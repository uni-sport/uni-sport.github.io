import Exclusions from "./Exclusions";
import Day from "./Day";
import { Schedule } from "../Context";

export default function Days({ data }: { data: Schedule }) {
  if (data.schedule === "weekly") {
    return (
      <div className="text-xs text-gray-700">
        <Day value={data.start} /> - <Day value={data.end} />
        <Exclusions data={data} />
      </div>
    );
  }
  const { dates } = data;
  return (
    <div>
      {
        dates.map((date, index) => (
          <p className="text-xs text-gray-700" key={index}>
            <Day value={date} />
          </p>
        ))
      }
    </div>
  );
}
