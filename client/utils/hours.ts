// Helpers for "hh:mm" hours, as used by the TV movies schedule.

const DAY_MINUTES = 24 * 60;

// "14:25" -> 865
export const toMinutes = (hour: string): number => {
    const [h, m] = hour.split(":").map(Number);
    return h * 60 + m;
};

// 865 -> "14:25", wrapping past midnight (1470 -> "00:30").
export const toHour = (minutes: number): string => {
    const dayMinutes = minutes % DAY_MINUTES;
    return `${String(Math.floor(dayMinutes / 60)).padStart(2, "0")}:${String(dayMinutes % 60).padStart(2, "0")}`;
};

// An end at or before the start is on the next day: "22:50"–"00:30" ends
// at 1470, so it stays after every time of the start's day.
export const toEndMinutes = (startHour: string, endHour: string): number => {
    const end = toMinutes(endHour);
    return end <= toMinutes(startHour) ? end + DAY_MINUTES : end;
};

// Whether `minutes` (since midnight) falls in [startHour, endHour).
export const isBetween = (
    minutes: number,
    startHour: string,
    endHour: string,
): boolean =>
    minutes >= toMinutes(startHour) &&
    minutes < toEndMinutes(startHour, endHour);

export type DaySlot = "morning" | "afternoon" | "evening";

export const getDaySlot = (hour: string): DaySlot => {
    const minutes = toMinutes(hour);
    if (minutes < 12 * 60) return "morning";
    if (minutes < 18 * 60) return "afternoon";
    return "evening";
};

// "01:13" -> "1h13", "14:25" -> "14h25"
export const formatHour = (hour: string): string => {
    const [h, m] = hour.split(":");
    return `${Number(h)}h${m}`;
};
