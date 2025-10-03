export function getGreeting(
  date: Date = new Date(),
  timeZone: string = "America/Sao_Paulo",
): string {
  const timeInTimezone = new Date(date.toLocaleString("en-US", { timeZone }));
  const hours = timeInTimezone.getHours();

  if (hours >= 5 && hours < 12) return "Bom dia"; // Good morning (5:00 - 11:59)
  if (hours >= 12 && hours < 18) return "Boa tarde"; // Good afternoon (12:00 - 17:59)
  return "Boa noite"; // Good evening/night (18:00 - 4:59)
}

export function replaceWithGreeting(value: string): string;
export function replaceWithGreeting(value?: string): string | undefined;
export function replaceWithGreeting(value?: string): string | undefined {
  return value?.replaceAll("{{greeting}}", getGreeting());
}
