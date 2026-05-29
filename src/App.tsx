import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { MyRoutes } from "./routes/Routes";
import { Toaster } from "sonner";

export const App = () => {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Navbar />
      <main>
        <MyRoutes />
      </main>
    </BrowserRouter>
  );
};
