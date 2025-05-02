

import { createContext, useContext, useMemo, useState } from 'react';

import routes from "virtual:generated-pages-react";

export interface Meta {
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  time_slots: TimeSlotRaw[];
}
interface TimeSlotRaw {
  name_de: string;
  name_en: string;
  room: string;
  day: string;
  startTime: number;
  endTime: number;
  supervisors: Supervisor[];
}
interface CourseRoute {
  meta: Meta;
  path: string;
}

export interface TimeSlot {
  name: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  supervisors: Supervisor[];
}

export interface Course {
  name: string;
  description: string;
  time_slots: TimeSlot[];
  path: string;
}

interface Supervisor {
  name: string;
}



interface GlobalContextType {
  locale: string;
  setLocale: (locale: string) => void;
  courses: Course[];
};

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState('de');
  const course_route = routes.find((route) => route.path === "courses");
  if (!course_route || !Array.isArray(course_route.children)) {
    throw new Error("No course route found");
  }
  const rooms = {} as Record<string, number>;


  const courses = course_route.children.map((c) => {
    const { path, meta } = c as CourseRoute;
    const time_slots = meta.time_slots.map((slot) => {
      const name = (locale === 'de') ? slot.name_de : slot.name_en;
      if (slot.room) {
        if (!rooms[slot.room]) {
          rooms[slot.room] = 0;
        }
        rooms[slot.room] += 1;
      }
      return {
        name,
        room: slot.room,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        supervisors: slot.supervisors,
      };
    });
    const fullPath = `/courses/${path}`;
    return {
      name: (locale === 'de') ? meta.name_de : meta.name_en,
      description: (locale === 'de') ? meta.description_de : meta.description_en,
      time_slots,
      path: fullPath,
    };
  });
  console.log("Rooms", rooms);


  const value = useMemo(() => ({
    locale,
    setLocale,
    courses,
  }), [locale, setLocale, courses]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

const useGlobalContext = () => useContext(GlobalContext);
export default useGlobalContext;

