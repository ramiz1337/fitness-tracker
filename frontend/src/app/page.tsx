import { BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";

export default function Page() {
  return (
    <div className="mt-22 text-black">
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </div>  
  );
}
