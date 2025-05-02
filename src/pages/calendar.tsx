
import config from '../config.yaml';


interface CalendarConfig {
  start: string;
  end: string;
  holidays: string[];
}
interface Weekday {
  date: string;
  active: boolean;
  disabled: boolean;
}


function getWeek(today: Date) {
  const calendar = config.calendar as CalendarConfig;
  const day = today.getDay(); // 0 (Sun) to 6 (Sat)
  const mondayOffset = day === 0 ? -6 : 1 - day; // Days to subtract to get to Monday
  const week = [];

  const calendarStart = new Date(calendar.start);
  const calendarEnd = new Date(calendar.end);


  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);
    const dateStr = date.toISOString().split('T')[0];
    const isHoliday = calendar.holidays.includes(dateStr);
    const isInRange = date >= calendarStart && date <= calendarEnd;

    week.push({
      date: dateStr,
      active: date.toDateString() === today.toDateString(),
      disabled: !isInRange || isHoliday,
    });
  }
  return week;
}


function Weekday({ data }: { data: Weekday }) {
  const { date, active, disabled } = data;
  return (
    <div>
      <span>{date}</span>
      <span>{active ? 'Active' : 'Inactive'}</span>
      <span>{disabled ? 'Disabled' : 'Enabled'}</span>
    </div>
  );
}


export default function Calendar() {
  const today = new Date();
  const week = getWeek(today);
  return (
    <div>
      <h1>Calendar</h1>
      <div className="grid grid-cols-8 border border-gray-300 rounded-xl">
        {week.map((day) => (
          <Weekday
            key={day.date}
            data={day}
          />
        ))}
      </div>
    </div>
  );
}
