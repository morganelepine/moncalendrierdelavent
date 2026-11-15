// Helpers for "hh:mm" hours, as used by the TV movies schedule
// (daytime only: no movie runs past midnight).

// "14:25" -> 865
export const toMinutes = (hour: string): number => {
    const [h, m] = hour.split(":").map(Number);
    return h * 60 + m;
};

// 865 -> "14:25"
export const toHour = (minutes: number): string =>
    `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

// Whether `minutes` (since midnight) falls in [startHour, endHour).
export const isBetween = (
    minutes: number,
    startHour: string,
    endHour: string,
): boolean => minutes >= toMinutes(startHour) && minutes < toMinutes(endHour);

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
