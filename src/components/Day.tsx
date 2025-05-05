
export default function Day({ value }: { value: string }) {
  const date = new Date(value);
  const formatted = date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });


  return (
    <span>{formatted}</span>
  );
}
