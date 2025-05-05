import useGlobalContext from "../Context";
import { ScheduleWeekly } from "../Context";
import Day from "./Day";



export default function Exclusions({ data }: { data: ScheduleWeekly }) {
  const { locale } = useGlobalContext();
  const message = locale === "de" ? "Nicht an folgenden Tagen:" : "Except on:";

  const { exclusions } = data;
  if (exclusions.length === 0) return null;
  return (
    <div className="text-xs text-gray-500">
      {message}
      {exclusions.map((date, index) => (
        <span className="text-gray-800 p-0.5" key={index}>
          <Day value={date} />
        </span>
      ))}
    </div>
  );
}
