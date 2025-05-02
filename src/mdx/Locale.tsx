import useGlobalContext from "../Context";

export default function Locale({ children, value }: { children: React.ReactNode, value: string }) {
  const { locale } = useGlobalContext();
  if (value !== locale) {
    return null;
  }
  return (
    <div>
      {children}
    </div>
  );
}
