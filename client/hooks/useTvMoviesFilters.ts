import { useMemo, useState } from "react";
import { PillTabBarItem } from "@/components/navigation/PillTabBar";
import { TvMovie } from "@/interfaces/tvMovieInterface";
import { DaySlot, getDaySlot } from "@/utils/hours";

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

export const useTvMoviesFilters = (
    movies: TvMovie[] | null,
): TvMoviesFilters => {
    const [selectedChannel, setSelectedChannel] = useState(ALL);
    const [slot, setSlot] = useState<SlotFilter>(ALL);

    const channels = useMemo(
        () => [...new Set((movies ?? []).map((movie) => movie.channel))],
        [movies],
    );
    // Today's channel may not air tomorrow: fall back to all channels.
    const channel = channels.includes(selectedChannel) ? selectedChannel : ALL;

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
        setSlot,
        filteredMovies,
    };
};
