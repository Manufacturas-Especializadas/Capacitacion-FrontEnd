import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logomesa.png";
import { useAuth } from "../../context/AuthContext";
import { User, LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b
      border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="p-1 rounded-lg transition-colors group-hover:bg-slate-50">
              <img
                src={Logo}
                alt="MESA"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="hidden md:block h-6 w-px bg-slate-200" />{" "}
            <h1 className="text-lg font-semibold tracking-tight text-slate-800">
              <Link to="/">
                CAPACI<span className="text-blue-600">TACIÓN</span>
              </Link>
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden sm:flex items-center gap-3">
                <div
                  className="h-9 w-9 bg-blue-50 text-blue-600 rounded-full flex 
                  items-center justify-center border border-blue-100"
                >
                  <User size={18} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-700 leading-tight">
                    Nómina: {user.payrollNumber}
                  </span>
                  <span className="text-xs font-medium text-slate-500 leading-tight">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-slate-200" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-slate-500 
                hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors 
                cursor-pointer group"
                title="Cerrar sesión"
              >
                <LogOut
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="hidden sm:block text-sm font-semibold">
                  Salir
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
