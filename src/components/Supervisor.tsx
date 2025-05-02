export default function Supervisor({ value }: { value: string }) {
  const parts = value.split(" ");
  const lastName = parts.pop() ?? "";
  const name = `${parts.join(" ")} ${lastName.charAt(0)}.`;
  return (
    <span>
      {name}
    </span>
  );
}
