export function toBackendTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

export function isFutureOrToday(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) >= today;
}

export function hoursBetween(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  return (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;
}
