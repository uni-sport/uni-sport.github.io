
import { Course } from "../Context";
import { Link } from "react-router-dom";
import { useOutlet } from "react-router-dom";
import TimeSlots from "./TimeSlots";

export default function CourseElem({ data, active }: { data: Course, active: boolean }) {
  const outlet = useOutlet();

  const renderOutlet = () => {
    if (!outlet || !active) return null;
    return (
      <div className="">
        <TimeSlots courses={[data]} />
        {outlet}
      </div>
    );
  }


  return (
    <div className="border-b last:border-none border-gray-500 m-1 p-1">
      <Link to={data.path}>
        <span className="font-bold text-blue-700 hover:underline">{data.name}</span>
        <p className="text-xs text-gray-700">{data.description}</p>
      </Link>
      {renderOutlet()}
    </div>
  );
}
