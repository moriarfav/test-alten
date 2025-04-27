export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}
export function getWeekDay(date: string): string {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayIndex = new Date(date).getDay();
  return daysOfWeek[dayIndex];
}
