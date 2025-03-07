export const MIN_DAYS = 80;
export const MIN_HOURS = 80;

export function isValidEndDate(date: Date): boolean {
    const now: Date = new Date();
    const newDate: Date = new Date(now);
    newDate.setDate(newDate.getDate() + MIN_DAYS);
    const date1: Date = new Date(date);
    return date1 < newDate;
}

export function isValidHours(hours: number): boolean {
    return hours < MIN_HOURS;
}