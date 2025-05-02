export default function Time({ value }: { value: string }) {
  const regex = /(\d{1,2}):(\d{2})/;
  const match = value.match(regex);
  if (!match) {
    return null;
  }
  let hours = parseInt(match[1], 10);
  let minutes = parseInt(match[2], 10);
  if (minutes === 59) {
    hours = (hours + 1) % 24;
    minutes = 0;
  }
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  return (
    <span>{hoursStr}:{minutesStr}</span>
  );
}
