import { ClipboardX } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white py-20 text-center">
      <ClipboardX className="mx-auto text-gray-400" size={60} />

      <h2 className="mt-5 text-2xl font-bold">No existen seguimientos</h2>

      <p className="mt-2 text-gray-500">
        Comienza registrando el primer seguimiento.
      </p>
    </div>
  );
};
