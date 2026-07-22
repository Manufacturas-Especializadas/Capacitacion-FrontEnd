import { Clock, ClipboardCheck, ArrowRight } from "lucide-react";
import CulturaMesaImg from "../../assets/Imagen1.jpg";

interface FormWelcomeProps {
  onStart: () => void;
}

export const FormWelcome = ({ onStart }: FormWelcomeProps) => {
  return (
    <div
      className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 
      overflow-hidden flex flex-col md:flex-row"
    >
      <div className="p-8 md:p-12 flex flex-col justify-center w-full md:w-1/2">
        <div
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 
          rounded-full text-sm font-semibold w-fit mb-6"
        >
          <ClipboardCheck size={16} />
          <span>Programa de Tutoreo</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
          Seguimiento a la adaptación del colaborador
        </h2>

        <p className="text-gray-600 mb-8 text-lg">
          Este formulario tiene como objetivo dar seguimiento a la adaptación
          del colaborador durante sus primeras semanas de trabajo.
        </p>

        <div
          className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-3 rounded-lg 
          mb-8 border border-gray-100 w-fit"
        >
          <Clock size={20} className="text-blue-600" />
          <span className="font-medium">
            Tiempo de llenado: <span className="text-gray-800">2 minutos</span>
          </span>
        </div>

        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 
          text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow 
          active:scale-[0.98] w-full sm:w-fit hover:cursor-pointer"
        >
          <span>Comenzar evaluación</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <div
        className="w-full md:w-1/2 bg-[#f8fafc] flex items-center justify-center p-6 border-t 
        md:border-t-0 md:border-l border-gray-100"
      >
        <img
          src={CulturaMesaImg}
          alt="Cultura de trabajo, respeto y mejora continua"
          className="w-full max-w-md h-auto object-contain drop-shadow-md rounded-xl"
        />
      </div>
    </div>
  );
};
