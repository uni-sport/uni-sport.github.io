import { useLocation } from "react-router-dom";
import LanguageSwitch from "../components/LanguageSwitch";
import useGlobalContext from "../Context";


import CourseLi from "../components/CourseLi";

export default function Courses() {
  const { courses } = useGlobalContext();
  const location = useLocation();

  if (!courses) {
    return null;
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
              <CourseLi
                active={location.pathname.includes(course.path)}
                key={course.path}
                data={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
