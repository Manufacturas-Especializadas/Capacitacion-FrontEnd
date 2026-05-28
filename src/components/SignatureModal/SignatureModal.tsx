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
    if (sigCanvas.current?.isEmpty()) {
      alert("Por favor, ingresa una firma antes de guardar");

      return;
    }

    const datUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    onSave(datUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden 
        flex flex-col"
      >
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800"> Firma de: {title}</h3>
          <button
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
            onClick={handleClear}
            className="px-4 py-2 text-rose-600 font-medium hover:bg-rose-50 
            rounded hover:cursor-pointer"
          >
            Limpiar
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded
              hover:cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white 
              font-medium rounded hover:bg-blue-700 hover:cursor-pointer"
            >
              Guardar Firma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
