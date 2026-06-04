import { ArrowRight, Flame, LayoutDashboard, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 
      selection:text-blue-900"
    >
      <div
        className="bg-white border-b border-slate-200 px-6 py-12 md:py-16 mb-8 
        text-center"
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center justify-center p-3 bg-blue-50 
            rounded-2xl mb-4 text-blue-600"
          >
            <LayoutDashboard size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Portal de Capacitación MESA
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium">
            Selecciona el módulo al que deseas ingresar para gestionar las
            asistencias o realizar evaluaciones operativas en piso.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div
            onClick={() => navigate("/historial-registro-de-asistencia")}
            className="group relative bg-white rounded-3xl p-8 border border-slate-200 
            shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 
            cursor-pointer overflow-hidden flex flex-col h-full"
          >
            <div
              className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-50 
            rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity 
            duration-500 pointer-events-none"
            />

            <div className="relative z-10">
              <div
                className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex 
                items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 
                transition-transform duration-300"
              >
                <Users size={28} strokeWidth={2} />
              </div>

              <h2
                className="text-2xl font-bold text-slate-900 mb-3 
                group-hover:text-blue-700 transition-colors"
              >
                Control de Asistencias
              </h2>

              <p className="text-slate-500 leading-relaxed mb-8 grow">
                Crea listas de asistencia, gestiona firmas digitales de
                operadores y calcula métricas de aprobación para cursos de
                capacitación.
              </p>

              <div className="flex items-center text-sm font-bold text-blue-600 mt-auto">
                <span className="group-hover:mr-2 transition-all">
                  Ingresar al módulo
                </span>
                <ArrowRight
                  size={16}
                  className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 
                  transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/soldadores/checklist")}
            className="group relative bg-white rounded-3xl p-8 border border-slate-200 
            shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 
            cursor-pointer overflow-hidden flex flex-col h-full"
          >
            <div
              className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-orange-50 
            rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity 
            duration-500 pointer-events-none"
            />

            <div className="relative z-10">
              <div
                className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl 
                flex items-center justify-center mb-6 group-hover:scale-110 
                group-hover:-rotate-3 transition-transform duration-300"
              >
                <Flame size={28} strokeWidth={2} />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <h2
                  className="text-2xl font-bold text-slate-900 
                  group-hover:text-orange-700 transition-colors"
                >
                  Checklist de Soldadores
                </h2>
              </div>

              <p className="text-slate-500 leading-relaxed mb-8 grow">
                Realiza evaluaciones técnicas en piso, verifica el equipo de
                protección y califica las habilidades prácticas del personal de
                soldadura.
              </p>

              <div className="flex items-center text-sm font-bold text-orange-600 mt-auto">
                <span className="group-hover:mr-2 transition-all">
                  Ingresar al módulo
                </span>
                <ArrowRight
                  size={16}
                  className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 
                  transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
