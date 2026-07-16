import { useState } from "react";
import { mockReports } from "../../data/mockTrainingReports";
import { TrainingReportsHeader } from "../../components/UI/TrainingReportsUi/TrainingReportsHeader";
import { TrainingReportsGrid } from "../../components/UI/TrainingReportsUi/TrainingReportsGrid";

export const TrainingReports = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = mockReports.filter((report) => {
    const term = searchTerm.toLowerCase();
    return (
      report.leaderName.toLowerCase().includes(term) ||
      report.id.toString().includes(term) ||
      report.trainingType.toLowerCase().includes(term)
    );
  });

  const handleViewDetails = (id: number) => {
    console.log(`Ver detalles del reporte ${id}`);
    // navigate(`/reporte-entrenamiento/ver/${id}`)
  };

  const handleEdit = (id: number) => {
    console.log(`Editar reporte ${id}`);
    // navigate(`/reporte-entrenamiento/editar/${id}`)
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm("¿Estás seguro de eliminar este reporte de entrenamiento?")
    ) {
      console.log(`Eliminar reporte ${id}`);
      // await deleteReport(id);
    }
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen font-sans 
      text-slate-900"
    >
      <TrainingReportsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <TrainingReportsGrid
        data={filteredReports}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
