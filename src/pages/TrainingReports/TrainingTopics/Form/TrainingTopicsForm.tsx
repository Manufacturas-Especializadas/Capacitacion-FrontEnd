import { useState, useEffect, type SyntheticEvent } from "react";
import InputField from "../../../../components/Inputs/InputField";
import { Modal } from "../../../../components/Modal/Modal";
import { useTrainingTopics } from "../../../../hooks/useTrainingTopics";
import type { CreateTrainingTopics } from "../../../../types/Types";
import { toast } from "sonner";

interface TrainingTopicsFormProps {
  isOpen: boolean;
  onClose: () => void;
  topicToEdit?: (CreateTrainingTopics & { id: number }) | null;
  onSuccess: () => void;
}

const initialFormState: CreateTrainingTopics = {
  trainingType: "",
  topicCode: "",
  topicName: "",
};

const TRAINING_TYPES = ["SOLDADURA", "EMPAQUE", "FABRICACIÓN"];

export const TrainingTopicsForm = ({
  isOpen,
  onClose,
  topicToEdit,
  onSuccess,
}: TrainingTopicsFormProps) => {
  const { createTopic, updateTopic, isLoading } = useTrainingTopics();
  const [formData, setFormData] =
    useState<CreateTrainingTopics>(initialFormState);

  useEffect(() => {
    if (topicToEdit) {
      setFormData({
        trainingType: topicToEdit.trainingType,
        topicCode: topicToEdit.topicCode,
        topicName: topicToEdit.topicName,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [topicToEdit, isOpen]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.trainingType) {
      toast.error("Selecciona un tipo de entrenamiento");
      return;
    }

    let success = false;

    if (topicToEdit) {
      success = await updateTopic(topicToEdit.id, formData);
    } else {
      success = await createTopic(formData);
    }

    if (success) {
      onSuccess();
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setFormData(initialFormState);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={
        topicToEdit ? "Editar tema de entrenamiento" : "Registrar nuevo tema"
      }
    >
      <form className="space-y-6 text-left" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Tipo de Entrenamiento
          </label>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            {TRAINING_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, trainingType: type })}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all 
                    duration-200 hover:cursor-pointer 
                  ${
                    formData.trainingType === type
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <InputField
          label="Código del Tema"
          value={formData.topicCode}
          onChange={(e: any) =>
            setFormData({ ...formData, topicCode: e.target.value })
          }
        />
        <InputField
          label="Nombre del Tema"
          value={formData.topicName}
          onChange={(e: any) =>
            setFormData({ ...formData, topicName: e.target.value })
          }
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-slate-600 
            hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 
            hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading
              ? "Guardando..."
              : topicToEdit
                ? "Actualizar Cambios"
                : "Guardar Tema"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
