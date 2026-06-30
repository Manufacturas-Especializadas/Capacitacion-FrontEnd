import { useEffect, useState } from "react";
import { ArrowLeft, Edit, Loader2, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TrainingTopicsForm } from "./Form/TrainingTopicsForm";
import { Table, type Column } from "../../../components/Table/Table";
import type { TrainingTopicsAll } from "../../../types/Types";
import { useTrainingTopics } from "../../../hooks/useTrainingTopics";

export const TrainingTopics = () => {
  const { isLoading, topics, fetchTopics, deleteTopic } = useTrainingTopics();

  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState<TrainingTopicsAll | null>(
    null,
  );
  const [filteredTopic, setFilteredTopic] = useState("");

  const filteredData = topics.filter((topic) => {
    const searchTerm = filteredTopic.toLocaleLowerCase();

    return (
      topic.topicName.toLocaleLowerCase().includes(searchTerm) ||
      topic.trainingType.toLocaleLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleOpenCreate = () => {
    setTopicToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (topic: TrainingTopicsAll) => {
    setTopicToEdit(topic);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este tema? Esta acción no se puede deshacer.",
    );

    if (isConfirmed) {
      const success = await deleteTopic(id);
      if (success) {
        fetchTopics();
      }
    }
  };

  const handleFormSuccess = () => {
    fetchTopics();
    setIsFormOpen(false);
  };

  const columns: Column<TrainingTopicsAll>[] = [
    {
      header: "Tipo de entrenamiento",
      accessor: "trainingType",
    },
    {
      header: "Número del tema",
      accessor: "topicCode",
    },
    {
      header: "Tema",
      accessor: "topicName",
    },
    {
      header: "Acciones",
      className: "text-center w-36",
      accessor: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50
            rounded-lg transition-colors cursor-pointer"
            title="Editar tema"
          >
            <Edit size={18} />
          </button>

          <button
            onClick={() => handleDeleteClick(Number(row.id))}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 
            rounded-lg transition-colors cursor-pointer"
            title="Eliminar tema"
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
        className="flex justify-end gap-4 bg-white p-4 rounded-xl 
        border border-slate-100 shadow-sm"
      >
        <div className="flex flex-col text-left gap-1">
          <label
            className="text-[10px] font-bold text-slate-400 
            uppercase tracking-wide"
          >
            Filtrar por tema
          </label>
          <input
            type="text"
            placeholder="Nombre o código..."
            value={filteredTopic}
            onChange={(e) => setFilteredTopic(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700
            focus:outline-none focus:ring-1 focus:ring-slate-700"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate("/reportes-entrenamientos")}
          className="text-slate-500 hover:text-blue-600 flex items-center gap-2 
          transition-colors font-medium text-sm cursor-pointer"
        >
          <ArrowLeft size={20} /> Volver
        </button>
        <button
          onClick={handleOpenCreate}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 
            px-5 rounded-xl text-sm transition-all duration-150 flex items-center justify-center 
            gap-2 shadow-sm cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} />
          Nuevo tema
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-slate-700" size={32} />
        </div>
      ) : (
        <Table<TrainingTopicsAll>
          data={filteredData}
          columns={columns}
          keyExtractor={(item) => item.id}
          emptyMessage="No se encontraron registros"
          defaultRowsPerPage={10}
        />
      )}

      <TrainingTopicsForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        topicToEdit={topicToEdit}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
