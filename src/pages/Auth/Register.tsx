import { useState, type SyntheticEvent } from "react";
import { UserPlus, Hash, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { useLocation, useNavigate } from "react-router-dom";
import type { Users } from "../../types/Types";

export const Register = () => {
  const { roles, isCreating, createUser, updateUser, isUpdating } = useUsers();

  const location = useLocation();
  const userToEdit = location.state?.userToEdit as Users | undefined;
  const isEditMode = !!userToEdit;

  const [payrollNumber, setPayrollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number>(0);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!payrollNumber || !password || roleId === 0) return;

    const success = await createUser(payrollNumber, password, roleId);

    if (success !== false) {
      setPayrollNumber("");
      setPassword("");
      setRoleId(0);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-in fade-in 
      duration-500"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md w-full p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center 
            justify-center mb-4 border border-blue-100"
          >
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Registrar Usuario
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Crea un nuevo acceso al portal asignando un rol
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-600 
                focus:border-transparent transition-all outline-none"
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
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-600 
                focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Rol del Sistema
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none 
                text-gray-400"
              >
                <ShieldCheck size={18} />
              </div>
              <select
                required
                value={roleId}
                onChange={(e) => setRoleId(Number(e.target.value))}
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-600 
                focus:border-transparent transition-all outline-none appearance-none 
                hover:cursor-pointer"
              >
                <option value={0} disabled>
                  Seleccione un rol...
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating || roleId === 0}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 
            hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors 
            shadow-sm hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              <span>Confirmar Registro</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-600 
            hover:bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors 
            shadow-sm hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
};
