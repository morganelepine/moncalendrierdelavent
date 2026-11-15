import { gunzipSync } from "node:zlib";
import { XMLParser } from "fast-xml-parser";
import { getParisNow } from "../lib/parisTime";

// XML TV Fr (https://github.com/racacax/XML-TV-Fr): free TNT schedule,
// regenerated every night around 3:40 (Paris), covering ~10 days.
const XMLTV_URL = "https://xmltvfr.fr/xmltv/xmltv_tnt.xml.gz";
const FEED_REFRESH_HOUR = 4; // Paris

const CHRISTMAS_TITLE =
    /no[eë]l|christmas|xmas|cadeau|sapin|r[eé]veillon|lutin|\brennes?\b|flocon|tra[iî]neau|guirlande|\bgui\b|l'avent|\bhoux\b|bonhomme de neige/i;
const TV_MOVIE_CATEGORY = /t[ée]l[ée]film/i;

export interface TvMovie {
    title: string;
    description: string;
    image: string | null;
    channel: string;
    startHour: string;
    endHour: string;
}

interface DatedTvMovie extends TvMovie {
    day: string;
}

interface XmltvText {
    "#text"?: string;
}

interface XmltvProgramme {
    "@_start": string;
    "@_stop": string;
    "@_channel": string;
    title?: XmltvText[];
    desc?: XmltvText[];
    category?: XmltvText[];
    icon?: { "@_src"?: string }[];
}

const CHANNEL_NAMES: Record<string, string> = {
    "TF1SeriesFilms.fr": "TF1 Séries Films",
    "NT1.fr": "TFX",
    "CanalPlus.fr": "Canal+",
    "CanalPlusCinema.fr": "Canal+ Cinéma",
    "Cherie25.fr": "RMC Life",
};

const toChannelName = (channel: string): string =>
    CHANNEL_NAMES[channel] ?? channel.replace(/\.fr$/, "");

const toSecureImage = (url: string | undefined): string | null => {
    const secureUrl = url?.replace(/^http:\/\//, "https://");
    return secureUrl?.startsWith("https://") ? secureUrl : null;
};

// XMLTV times are Paris local times: "20261114133500 +0100".
const parseXmltvTime = (time: string): { day: string; hour: string } => {
    const [, y, mo, d, h, mi] =
        /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(time) ?? [];
    if (!y) throw new Error(`Invalid XMLTV time "${time}"`);
    return { day: `${y}-${mo}-${d}`, hour: `${h}:${mi}` };
};

const xmlParser = new XMLParser({
    ignoreAttributes: false,
    // Titles like "1917" must stay strings.
    parseTagValue: false,
    parseAttributeValue: false,
    alwaysCreateTextNode: true,
    isArray: (name) =>
        ["programme", "title", "desc", "category", "icon"].includes(name),
});

export function parseChristmasTvMovies(xml: string): DatedTvMovie[] {
    const programmes: XmltvProgramme[] =
        xmlParser.parse(xml).tv?.programme ?? [];

    return programmes.flatMap((programme) => {
        const title = programme.title?.[0]?.["#text"]?.trim() ?? "";
        const isTvMovie = programme.category?.some((category) =>
            TV_MOVIE_CATEGORY.test(category["#text"] ?? ""),
        );
        if (!isTvMovie || !CHRISTMAS_TITLE.test(title)) return [];

        const start = parseXmltvTime(programme["@_start"]);
        return [
            {
                day: start.day,
                title,
                description: programme.desc?.[0]?.["#text"]?.trim() ?? "",
                image: toSecureImage(programme.icon?.[0]?.["@_src"]),
                channel: toChannelName(programme["@_channel"]),
                startHour: start.hour,
                endHour: parseXmltvTime(programme["@_stop"]).hour,
            },
        ];
    });
}

// Until the next nightly feed regeneration.
export function secondsUntilFeedRefresh(): number {
    const now = getParisNow();
    const next = new Date(now);
    next.setHours(FEED_REFRESH_HOUR, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return Math.round((next.getTime() - now.getTime()) / 1000);
}

async function fetchChristmasTvMovies(): Promise<DatedTvMovie[]> {
    const res = await fetch(XMLTV_URL, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
        throw new Error(`XMLTV feed error ${res.status}`);
    }
    const xml = gunzipSync(Buffer.from(await res.arrayBuffer())).toString(
        "utf8",
    );
    return parseChristmasTvMovies(xml);
}

// The feed (~1 MB, ~0.5 s to parse) covers every date: one download per warm
// instance until the next regeneration, on top of the CDN cache per date.
let feedCache: { expiresAt: number; movies: Promise<DatedTvMovie[]> } | null =
    null;

const getChristmasTvMovies = (): Promise<DatedTvMovie[]> => {
    if (!feedCache || Date.now() >= feedCache.expiresAt) {
        const movies = fetchChristmasTvMovies();
        feedCache = {
            expiresAt: Date.now() + secondsUntilFeedRefresh() * 1000,
            movies,
        };
        movies.catch(() => {
            if (feedCache?.movies === movies) feedCache = null;
        });
    }
    return feedCache.movies;
};

// `date` is "yyyy-mm-dd", a Paris day.
export async function getTvMoviesByDate(date: string): Promise<TvMovie[]> {
    const movies = await getChristmasTvMovies();
    return (
        movies
            .filter((movie) => movie.day === date)
            .map(({ day, ...movie }) => movie)
            // "hh:mm" strings sort chronologically.
            .sort((a, b) => a.startHour.localeCompare(b.startHour))
    );
}
