import { Link, useOutlet, useLocation } from "react-router-dom";
import LanguageSwitch from "../components/LanguageSwitch";
import useGlobalContext, { Course, Schedule, ScheduleWeekly, TimeSlot } from "../Context";
import Room from "../components/Room";
import Time from "../components/Time";
import Supervisor from "../components/Supervisor";
import Day from "../components/Day";




function CourseElem({ data }: { data: Course }) {
  return (
    <div className="border-b last:border-none border-gray-500 my-1 p-1">
      <Link to={data.path}>
        <span className="font-bold text-blue-700 hover:underline">{data.name}</span>
        <p className="text-xs text-gray-700">{data.description}</p>
      </Link>
    </div>
  );
}

function Exclusions({ data }: { data: ScheduleWeekly }) {
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

function Days({ data }: { data: Schedule }) {
  if (data.schedule === "weekly") {
    return (
      <div className="text-sm">
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
          <p className="text-xs text-gray-800" key={index}>
            <Day value={date} />
          </p>
        ))
      }
    </div>
  );
}

function Slot({ data }: { data: TimeSlot }) {
  const { schedule, rooms } = data;


  return (
    <div className="border-b flex justify-between items-center last:border-none border-gray-500">
      <div>
        <div className="text-sm font-bold">
          {data.day}
        </div>
        <div className="px-2">
          <Time value={data.startTime} /> - <Time value={data.endTime} />
        </div>
      </div>
      <div>
        {rooms.map((room, index) => (
          <p key={index} className="text-sm px-1 text-gray-500">
            <Room value={room} />
          </p>
        ))}
      </div>
      <span>
        {data.name}
      </span>
      <div>
        {data.supervisors.map((supervisor, index) => (
          <span key={index} className="text-sm px-1 text-gray-500">
            <Supervisor value={supervisor.name} />
          </span>
        ))}
      </div>
      <Days data={schedule} />
    </div>

  );
}

function TimeSlots({ courses }: { courses: Course[] }) {
  const location = useLocation();
  const course = courses.find((course) => location.pathname.includes(course.path));
  if (!course) return null;
  const { name, description, time_slots } = course
  return (
    <div>
      <h1 className="text-2xl font-extrabold">{name}</h1>
      <p className="text-sm text-gray-700">{description}</p>
      <div className="flex flex-col border border-gray-500 rounded-lg p-2 my-2">
        {time_slots.map((slot, index) => (
          <Slot key={index} data={slot} />
        ))}
      </div>
    </div>
  );


}



export default function Courses() {
  const { courses } = useGlobalContext();
  const outlet = useOutlet();

  const renderOutlet = () => {
    if (!outlet) return null;
    return (
      <div className="w-1/2">
        <TimeSlots courses={courses} />
        {outlet}
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <h1 className="text-2xl font-bold my-5 ">Courses</h1>
        <LanguageSwitch />
      </div>
      <div className="flex gap-2">
        <div className="max-h-screen overflow-y-scroll ">
          <div>
            {courses.map((course) => (
              <CourseElem key={course.path} data={course} />
            ))}
          </div>
        </div>
        {renderOutlet()}
      </div>
    </div>
  );
}
