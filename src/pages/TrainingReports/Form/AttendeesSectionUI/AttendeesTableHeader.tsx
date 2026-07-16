interface AttendeesTableHeaderProps {
  trainingType: string;
  days: { key: string; label: string }[];
}

export const AttendeesTableHeader = ({
  trainingType,
  days,
}: AttendeesTableHeaderProps) => {
  return (
    <thead
      className="bg-slate-100 text-slate-600 font-bold text-xs uppercase 
      tracking-wider"
    >
      <tr>
        <th rowSpan={2} className="border border-slate-200 px-3 py-2 w-28">
          Nómina
        </th>
        <th rowSpan={2} className="border border-slate-200 px-3 py-2 min-w-50">
          Nombre Completo
        </th>
        <th rowSpan={2} className="border border-slate-200 px-3 py-2 w-32">
          {trainingType === "SOLDADURA" ? "Línea de Involucramiento" : "Línea"}
        </th>

        {trainingType === "FABRICACION" && (
          <th rowSpan={2} className="border border-slate-200 px-3 py-2 w-24">
            Turno
          </th>
        )}

        <th
          colSpan={days.length}
          className="border border-slate-200 px-3 py-1 text-center bg-slate-200/50"
        >
          Día de entrenamiento
        </th>

        {trainingType === "EMPAQUE" && (
          <th rowSpan={2} className="border border-slate-200 px-3 py-2 w-48">
            Entrenamiento cliente correspondiente
          </th>
        )}

        {trainingType === "SOLDADURA" && (
          <>
            <th rowSpan={2} className="border border-slate-200 px-3 py-2 w-40">
              Clasificación de soldador y/o unión
            </th>
            <th
              rowSpan={2}
              className="border border-slate-200 px-3 py-2 w-24 text-center"
            >
              % Soldadura
            </th>
            <th
              rowSpan={2}
              className="border border-slate-200 px-3 py-2 w-24 text-center"
            >
              Diámetro
            </th>
          </>
        )}

        {trainingType === "FABRICACION" && (
          <>
            <th rowSpan={2} className="border border-slate-200 px-3 py-2 w-36">
              Maquinaria
            </th>
            <th
              rowSpan={2}
              className="border border-slate-200 px-3 py-2 w-24 text-center"
            >
              AST
            </th>
          </>
        )}

        <th rowSpan={2} className="border border-slate-200 px-3 py-2 w-48">
          Temas
        </th>
        <th
          rowSpan={2}
          className="border border-slate-200 px-3 py-2 w-32 text-center"
        >
          Firma Colaborador
        </th>
        <th
          rowSpan={2}
          className="border border-slate-200 px-3 py-2 w-32 text-center"
        >
          Firma Supervisor
        </th>
        <th
          rowSpan={2}
          className="border border-slate-200 px-3 py-2 w-12 text-center"
        ></th>
      </tr>

      <tr>
        {days.map((day) => (
          <th
            key={day.key}
            className="border border-slate-200 px-2 py-1 text-center w-8 bg-slate-50"
          >
            {day.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
