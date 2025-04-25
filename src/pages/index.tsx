
import routes from "virtual:generated-pages-react";

export default function Home() {

  console.log(routes);



  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(routes, null, 2)}</pre>
      <p>This is the home page.</p>
    </div>
  );
}
