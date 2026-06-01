import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
}

export const SignatureModal = ({ isOpen, title, onClose, onSave }: Props) => {
  const sigCanvas = useRef<any>(null);

  if (!isOpen) return null;

  const handleClear = () => sigCanvas.current?.clear();

  const handleSave = () => {
    if (!sigCanvas.current) return;

    if (sigCanvas.current.isEmpty()) {
      alert("Por favor, ingresa una firma antes de guardar");
      return;
    }

    try {
      let canvas;
      try {
        canvas = sigCanvas.current.getTrimmedCanvas();
      } catch (e) {
        console.warn(
          "No se pudo recortar la firma, usando el lienzo completo.",
        );
        canvas = sigCanvas.current.getCanvas();
      }

      const datUrl = canvas.toDataURL("image/png");
      onSave(datUrl);
    } catch (error) {
      console.error("Error crítico al procesar la firma:", error);
      alert(
        "Hubo un problema interno al guardar la firma. Intenta limpiar y volver a firmar.",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex 
        flex-col"
      >
        <div
          className="p-4 border-b border-slate-200 flex justify-between items-center 
          bg-slate-50"
        >
          <h3 className="font-bold text-slate-800"> Firma de: {title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 bg-slate-100 flex justify-center items-center">
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 400,
                height: 200,
                className: "signature-canvas",
              }}
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-rose-600 font-medium hover:bg-rose-50 rounded 
            hover:cursor-pointer"
          >
            Limpiar
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 
              rounded hover:cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded 
              hover:bg-blue-700 hover:cursor-pointer"
            >
              Guardar Firma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
