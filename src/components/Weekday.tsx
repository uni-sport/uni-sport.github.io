import useGlobalContext from "../Context";

export default function Weekday({ value }: { value: string }) {
  const { locale } = useGlobalContext();

  const translations = {
    "Monday": "Montag",
    "Tuesday": "Dienstag",
    "Wednesday": "Mittwoch",
    "Thursday": "Donnerstag",
    "Friday": "Freitag",
    "Saturday": "Samstag",
    "Sunday": "Sonntag",
  };


  if (locale === "en") {
    return (
      <span>
        {value}
      </span>
    );
  }
  if (locale === "de") {
    return (
      <span>
        {translations[value as keyof typeof translations]}
      </span>
    );
  }

}
