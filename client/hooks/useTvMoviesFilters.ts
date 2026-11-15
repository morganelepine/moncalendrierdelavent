import { useMemo, useState } from "react";
import { PillTabBarItem } from "@/components/navigation/PillTabBar";
import { TvMovie } from "@/interfaces/tvMovieInterface";
import { DaySlot, getDaySlot, toMinutes } from "@/utils/hours";

export const ALL = "all";
export type SlotFilter = DaySlot | typeof ALL;

interface TvMoviesFilters {
    channelItems: PillTabBarItem[]; // empty when there's a single channel
    channel: string;
    setChannel: (channel: string) => void;
    slot: SlotFilter;
    setSlot: (slot: SlotFilter) => void;
    filteredMovies: TvMovie[];
}

// Skip the slots whose movies are all over, based on the earliest movie
// still to finish rather than the clock, so a movie on air stays visible.
const getDefaultSlot = (
    movies: TvMovie[] | null,
    isTomorrow: boolean,
    nowMinutes: number,
): SlotFilter => {
    if (isTomorrow) return ALL;
    const nextMovie = movies?.find(
        (movie) => toMinutes(movie.endHour) > nowMinutes,
    );
    const nextSlot = nextMovie ? getDaySlot(nextMovie.startHour) : "morning";
    return nextSlot === "morning" ? ALL : nextSlot;
};

export const useTvMoviesFilters = (
    movies: TvMovie[] | null,
    isTomorrow: boolean,
    nowMinutes: number,
): TvMoviesFilters => {
    const [selectedChannel, setSelectedChannel] = useState(ALL);
    // null until the user picks a slot: the default then follows the clock.
    const [selectedSlot, setSelectedSlot] = useState<SlotFilter | null>(null);

    const channels = useMemo(
        () => [...new Set((movies ?? []).map((movie) => movie.channel))],
        [movies],
    );
    // Today's channel may not air tomorrow: fall back to all channels.
    const channel = channels.includes(selectedChannel) ? selectedChannel : ALL;
    const slot = selectedSlot ?? getDefaultSlot(movies, isTomorrow, nowMinutes);

    const filteredMovies = useMemo(
        () =>
            (movies ?? []).filter(
                (movie) =>
                    (channel === ALL || movie.channel === channel) &&
                    (slot === ALL || getDaySlot(movie.startHour) === slot),
            ),
        [movies, channel, slot],
    );

    const channelItems = useMemo(
        () =>
            channels.length > 1
                ? [
                      { key: ALL, label: "Toutes les chaînes" },
                      ...channels.map((name) => ({ key: name, label: name })),
                  ]
                : [],
        [channels],
    );

    return {
        channelItems,
        channel,
        setChannel: setSelectedChannel,
        slot,
        setSlot: setSelectedSlot,
        filteredMovies,
    };
};
