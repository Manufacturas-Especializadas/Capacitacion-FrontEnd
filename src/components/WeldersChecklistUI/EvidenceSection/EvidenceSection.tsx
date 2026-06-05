import { Camera, X, UploadCloud } from "lucide-react";

interface Props {
  photo: string | null;
  onChange: (photoDataUrl: string | null) => void;
}

export const EvidenceSection = ({ photo, onChange }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 
      border-t-4 border-t-orange-500 font-sans mt-6"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
        <Camera className="text-orange-500" size={24} />
        <h2 className="text-xl font-bold text-slate-800 uppercase">
          Evidencia{" "}
          <span className="text-sm font-normal text-slate-400 capitalize">
            (Opcional)
          </span>
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center">
        {photo ? (
          <div
            className="relative w-full max-w-md rounded-xl overflow-hidden border 
            border-slate-200 shadow-sm group bg-slate-50"
          >
            <img
              src={photo}
              alt="Evidencia de Soldadura"
              className="w-full h-auto object-contain max-h-96"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-full 
              hover:bg-rose-600 transition-colors shadow-md cursor-pointer opacity-90 
              hover:opacity-100"
              title="Eliminar evidencia"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <label
            className="w-full flex flex-col items-center justify-center py-12 px-4 
            border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 
            hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer 
            group"
          >
            <div
              className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center 
              justify-center text-slate-400 group-hover:text-orange-500 mb-4 
              transition-colors"
            >
              <UploadCloud size={32} />
            </div>
            <p
              className="text-slate-700 font-semibold mb-1 text-center 
              group-hover:text-orange-600 transition-colors"
            >
              Haz clic aquí para tomar o subir una fotografía
            </p>
            <p className="text-slate-400 text-sm text-center">
              Soporta JPG o PNG. En móviles abrirá la cámara.
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};
