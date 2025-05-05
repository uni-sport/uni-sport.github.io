
import Time from "./Time";
import Room from "./Room";
import Supervisor from "./Supervisor";
import Days from "./Days";

import { TimeSlot } from "../Context";
import Weekday from "./Weekday";

export default function Slot({ data }: { data: TimeSlot }) {
  const { schedule, rooms } = data;

  return (
    <div className="border-b border-gray-500 last:border-none justify-between p-1 flex flex-wrap gap-2 text-sm">
      <div>
        <span className="px-1">
          <Weekday value={data.day} />
        </span>
        <span className="text-nowrap">
          <Time value={data.startTime} /> - <Time value={data.endTime} />
        </span>
      </div>
      <div>
        {rooms.map((room, index) => (
          <span key={index} className="px-1">
            <Room value={room} />
          </span>
        ))}
      </div>

      <div className="mt-1 basis-full sm:basis-auto font-semibold">{data.name}</div>

      <div className="text-gray-500 gap-1">
        {data.supervisors.map((supervisor, index) => (
          <span key={index} className="px-1">
            <Supervisor value={supervisor.name} />
          </span>
        ))}
      </div>
      <div>
        <Days data={schedule} />
      </div>
    </div >
  );
}

