
import routes from "virtual:generated-pages-react";
import { Link } from "react-router-dom";


export default function Home() {
  return (
    <div>
      <h1>Home</h1>

      <div className="flex flex-col gap-2">
        {routes.map((route) => (
          <div key={route.path}>
            <Link
              className="text-blue-500 hover:underline"
              to={route.path ?? ""}>
              {route.path}
            </Link>
          </div>
        ))}
      </div>


      <p></p>
    </div>
  );
}
