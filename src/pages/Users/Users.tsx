import { ArrowLeft, Edit, Loader2, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";
import { Table, type Column } from "../../components/Table/Table";
import type { Users } from "../../types/Types";
import { formatDateTime } from "../../utils/formatters";

export const GetUsers = () => {
  const { users, loading } = useUsers();

  const navigate = useNavigate();

  const columns: Column<Users>[] = [
    {
      header: "Número de nómina",
      accessor: "payrollNumber",
    },
    {
      header: "Rol",
      accessor: "roleName",
    },
    {
      header: "Fecha de registro",
      accessor: (row) => formatDateTime(row.createdAt),
    },
    {
      header: "¿Esta activo?",
      accessor: (row) => (
        <span
          className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full
              border ${
                row.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }
            `}
        >
          {row.isActive ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right w-24",
      accessor: (row) => (
        <div className="flex items-center justify-end pr-2">
          <button
            onClick={() =>
              navigate("/registro", { state: { userToEdit: row } })
            }
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 
            rounded-lg transition-colors cursor-pointer"
          >
            <Edit size={18} />
          </button>
          {/* <button
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg 
            transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-12 antialiased">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <header
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b
          border-gray-200 pb-6 gap-4"
        >
          <div className="space-y-1 text-left">
            <h1
              className="text-3xl font-extrabold text-slate-900 tracking-tight 
              flex items-center gap-2.5"
            >
              <User className="text-slate-700" size={28} />
              Control de usuarios
            </h1>
            <p className="text-slate-500 text-sm font-normal">
              Gestion al personal del sistema de capacitación
            </p>
          </div>

          <button
            onClick={() => navigate("/registro")}
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-5 
            rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 
            shadow-sm cursor-pointer self-start sm:self-center"
          >
            <Plus size={16} />
            Nuevo usuario
          </button>
        </header>

        <main className="relative">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-slate-500 hover:text-blue-600 flex items-center 
            gap-2 mb-4 transition-colors font-medium text-sm cursor-pointer"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500 gap-2 font-medium">
              <Loader2 className="animate-spin text-slate-700" size={20} />
              Cargando datos...
            </div>
          ) : (
            <Table<Users>
              data={users}
              columns={columns}
              keyExtractor={(item) => item.id}
              emptyMessage="No se han registrado usuarios en el sistema"
              defaultRowsPerPage={5}
            />
          )}
        </main>
      </div>
    </div>
  );
};
