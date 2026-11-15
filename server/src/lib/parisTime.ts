// Paris wall-clock time as a Date whose local fields (getHours()...) read Paris time.
// Only for calendar fields and differences, not as an instant.
export function getParisNow(): Date {
    return new Date(
        new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }),
    );
}
