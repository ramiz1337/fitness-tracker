import { BrowserRouter } from "react-router-dom";
import Home from "./home/page";

export default function Page() {
  return (
    <div className="mt-22 text-black">
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </div>  
  );
}
