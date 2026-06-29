import { ArrowLeft, Edit, Loader2, Plus, Trash } from "lucide-react";
import { Table, type Column } from "../../components/Table/Table";
import { useEmployees } from "../../hooks/useEmployees";
import type { Employee } from "../../types/Types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, type SyntheticEvent } from "react";
import { Modal } from "../../components/Modal/Modal";
import InputField from "../../components/Inputs/InputField";
import SelectField from "../../components/Inputs/SelectField";
import { useCatalogs } from "../../hooks/useCatalogs";
import { toast } from "sonner";

const INITIAL_FORM_DATA = {
  employeeNumber: "",
  name: "",
  productionLineId: 0,
};

export const Employees = () => {
  const {
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    employees,
    isLoadingEmployees,
  } = useEmployees();
  const { lines, fetchLines } = useCatalogs();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [filteredEmployee, setFilteredEmployee] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const navigate = useNavigate();

  const filteredData = employees.filter((employee) => {
    const searchTerm = filteredEmployee.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchTerm) ||
      employee.employeeNumber.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    fetchLines();
  }, [fetchLines]);

  const linesOptions = [
    { value: "", label: "Selecciona una línea" },
    ...lines.map((l) => ({
      value: l.id.toString(),
      label: l.name,
    })),
  ];

  const handleCloseModal = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleOpenEdit = (employee: Employee) => {
    setSelectedId(Number(employee.id));
    setIsEditOpen(true);

    const matchingLine = lines.find((l) => l.name === employee.line);

    setFormData({
      name: employee.name,
      employeeNumber: employee.employeeNumber,
      productionLineId: matchingLine ? matchingLine.id : 0,
    });
  };

  const handleDeleteClick = async (id: number) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este empleado? Esta acción puede afectar historiales existentes.",
      )
    ) {
      await deleteEmployee(id);
    }
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.employeeNumber.trim() ||
      formData.productionLineId === 0
    ) {
      return toast.error("Completa todos los campos");
    }

    const payload = {
      name: formData.name,
      employeeNumber: formData.employeeNumber,
      productionLineId: formData.productionLineId,
    };

    if (isEditOpen && selectedId) {
      const success = await updateEmployee(payload, selectedId);
      if (success) handleCloseModal();
    } else {
      const result = await createNewEmployee(payload);
      if (result) handleCloseModal();
    }
  };
  const columns: Column<Employee>[] = [
    {
      header: "Nombre del empleado",
      accessor: "name",
    },
    {
      header: "Número de nómina del empleado",
      accessor: "employeeNumber",
      className: "font-semibold text-slate-800",
    },
    {
      header: "Linea",
      accessor: "line",
    },
    {
      header: "Acciones",
      className: "text-center w-36",
      accessor: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50
            rounded-lg transition-colors cursor-pointer"
          >
            <Edit size={18} />
          </button>

          <button
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 
            rounded-lg transition-colors cursor-pointer"
          >
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      <div
        className="flex justify-end gap-4 bg-white p-4 rounded-xl border 
        border-slate-100 shadow-sm"
      >
        <div className="flex flex-col text-left gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Filtrar por empleado
          </label>
          <input
            type="text"
            placeholder="Nombre o nómina..."
            value={filteredEmployee}
            onChange={(e) => setFilteredEmployee(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700
            focus:outline-none focus:ring-1 focus:ring-slate-700"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-slate-500 hover:text-blue-600 flex items-center gap-2 
          transition-colors font-medium text-sm cursor-pointer"
        >
          <ArrowLeft size={20} /> Volver
        </button>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 
            px-5 rounded-xl text-sm transition-all duration-150 flex items-center justify-center 
            gap-2 shadow-sm cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} />
          Nuevo empleado
        </button>
      </div>

      {isLoadingEmployees ? (
        <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="animate-spin text-slate-700" size={20} />
        </div>
      ) : (
        <Table<Employee>
          data={filteredData}
          columns={columns}
          keyExtractor={(item) => item.id}
          emptyMessage="No se encontraron registros"
          defaultRowsPerPage={10}
        />
      )}

      <Modal
        isOpen={isCreateOpen || isEditOpen}
        onClose={handleCloseModal}
        title={isCreateOpen ? "Registrar nuevo empleado" : "Editar empleado"}
      >
        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          <InputField
            label="Nombre completo del empleado"
            value={formData.name}
            onChange={(e: any) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <InputField
            label="Número de nómina del empleado"
            value={formData.employeeNumber}
            onChange={(e: any) =>
              setFormData({ ...formData, employeeNumber: e.target.value })
            }
          />
          <SelectField
            label="Selecciona una linea de producción"
            options={linesOptions}
            value={formData.productionLineId}
            onChange={(e: any) =>
              setFormData({
                ...formData,
                productionLineId: Number(e.target.value),
              })
            }
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-semibold text-slate-600 
              hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-bold text-white bg-blue-600 
              hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {isCreateOpen ? "Guardar Empleado" : "Actualizar Cambios"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
