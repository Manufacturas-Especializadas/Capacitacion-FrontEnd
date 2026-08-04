import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, type SyntheticEvent } from "react";
import { Hash, Loader2, LogIn, Lock } from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [payrollNumber, setPayrollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!payrollNumber || !password) return;

    setIsLoading(true);
    const success = await login(payrollNumber, password);

    setIsLoading(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 
      animate-in fade-in duration-500"
    >
      <div
        className="bg-white rounded-2xl shadow-md border border-gray-100 max-w-md w-full 
        p-8 md:p-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center 
            justify-center mb-5 shadow-sm transform rotate-3"
          >
            <LogIn size={32} className="-rotate-3" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Bienvenido a MESA
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Ingresa tus credenciales para acceder al portal de Capacitación y
            Evaluaciones
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Número de Nómina
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none 
                text-gray-400"
              >
                <Hash size={18} />
              </div>
              <input
                type="text"
                required
                value={payrollNumber}
                onChange={(e) => setPayrollNumber(e.target.value)}
                placeholder="Ej. 6294"
                disabled={isLoading}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 
                rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-600 
                focus:border-transparent transition-all outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none 
                text-gray-400"
              >
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 
                rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-600 
                focus:border-transparent transition-all outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !payrollNumber || !password}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 
            hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors 
            shadow-sm hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Manufacturas Especializadas, S.A.
        </p>
        <p>Departamento de Innovación y Tecnología</p>
      </div>
    </div>
  );
};
