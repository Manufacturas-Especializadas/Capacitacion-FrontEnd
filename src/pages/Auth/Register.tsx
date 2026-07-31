import { useEffect, useState, type SyntheticEvent } from "react";
import {
  UserPlus,
  Hash,
  Lock,
  ShieldCheck,
  Loader2,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
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
  const [isActive, setIsActive] = useState<boolean>(
    userToEdit?.isActive ?? true,
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && roles.length > 0) {
      const currentRole = roles.find((r) => r.roleName == userToEdit.roleName);
      if (currentRole) {
        setRoleId(currentRole.id);
      }
    }
  }, [isEditMode, roles, userToEdit]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode) {
      if (!payrollNumber || roleId === 0) return;

      const success = await updateUser(
        userToEdit.id,
        payrollNumber,
        roleId,
        isActive,
      );

      if (success !== false) {
        navigate(-1);
      }
    } else {
      if (!payrollNumber || !password || roleId === 0) return;

      const success = await createUser(payrollNumber, password, roleId);

      if (success !== false) {
        setPayrollNumber("");
        setPassword("");
        setRoleId(0);
      }
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
            {isEditMode ? <Edit size={32} /> : <UserPlus size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Editar Usuario" : "Registrar Usuario"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isEditMode
              ? `Modificando acceso de nómina: ${userToEdit.payrollNumber}`
              : "Crea un nuevo acceso al portal asignando un rol"}
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
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-600 
                outline-none"
              />
            </div>
          </div>

          {!isEditMode && (
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
                  required={!isEditMode}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                  rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-600 
                  outline-none"
                />
              </div>
            </div>
          )}

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
                outline-none hover:cursor-pointer"
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

          {isEditMode && (
            <div
              className="flex items-center justify-between p-3 bg-gray-50 border 
              border-gray-200 rounded-xl"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Estatus del Usuario
                </label>
                <span className="text-xs text-gray-500">
                  {isActive
                    ? "Tiene acceso al sistema"
                    : "Acceso revocado temporalmente"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`transition-colors duration-200 hover:cursor-pointer ${
                  isActive ? "text-green-500" : "text-gray-400"
                }`}
              >
                {isActive ? (
                  <ToggleRight size={36} />
                ) : (
                  <ToggleLeft size={36} />
                )}
              </button>
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={
                isEditMode
                  ? isUpdating || roleId === 0
                  : isCreating || roleId === 0
              }
              className="w-full flex items-center justify-center gap-2 bg-blue-600 
              hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold 
              transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed
              hover:cursor-pointer"
            >
              {isCreating || isUpdating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>{isEditMode ? "Guardando..." : "Registrando..."}</span>
                </>
              ) : (
                <span>
                  {isEditMode ? "Guardar Cambios" : "Confirmar Registro"}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 
              hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold 
              transition-colors hover:cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
