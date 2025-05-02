import routes from "virtual:generated-pages-react";

export interface Meta {
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  time_slots: TimeSlot[];
}
export type Course = Meta & {
  path: string;
};

interface TimeSlot {
  name_de: string;
  name_en: string;
  room: string;
  day: string;
  startTime: number;
  endTime: number;
  supervisors: Supervisor[];
}

interface Supervisor {
  name: string;
}

interface CourseRoute {
  meta: Meta;
  path: string;
}

const course_route = routes.find((route) => route.path === "courses");
export const courses = course_route?.children?.map((c) => {
  const { path, meta } = c as CourseRoute;
  const fullPath = `courses/${path}`;
  return {
    path: fullPath,
    ...meta,
  } as Course;
});
