import { useLocation } from "react-router-dom";
import Slot from "./TimeSlot";
import { Course } from "../Context";

export default function TimeSlots({ courses }: { courses: Course[] }) {
  const location = useLocation();
  const course = courses.find((course) => location.pathname.includes(course.path));
  if (!course) return null;
  const { time_slots } = course
  return (
    <div>
      <div className="flex flex-col border border-gray-500 rounded-lg p-2 my-2">
        {time_slots.map((slot, index) => (
          <Slot key={index} data={slot} />
        ))}
      </div>
    </div>
  );


}
