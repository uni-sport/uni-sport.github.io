import useGlobalContext from "../Context";

export default function LanguageSwitch() {
  const { locale, setLocale } = useGlobalContext();
  return (
    <div className="h-12 m-3">
      <div className="relative inline-flex rounded-md bg-gray-200 p-1">
        <div
          className={`absolute top-0 left-0 h-7 w-1/2 rounded-md bg-gray-50 shadow transition-all duration-300 ${locale === "de" ? "translate-x-full" : ""
            }`}
        />
        <button
          key="en"
          onClick={() => setLocale("en")}
          className="relative z-10 w-16 text-sm font-semibold text-blue-400 hover:underline focus:outline-none"
        >
          &#x1F1EC;&#x1F1E7; {/* Flag emoji for English */}
          EN
        </button>
        <button
          key="de"
          onClick={() => setLocale("de")}
          className="relative z-10 w-16 text-sm font-semibold text-blue-400 hover:underline focus:outline-none"
        >
          &#x1F1E9;&#x1F1EA; {/* Flag emoji for German */}
          DE
        </button>



      </div>
    </div>
  );
}


