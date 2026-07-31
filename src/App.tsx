import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { MyRoutes } from "./routes/Routes";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <Navbar />
        <main>
          <MyRoutes />
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
};
