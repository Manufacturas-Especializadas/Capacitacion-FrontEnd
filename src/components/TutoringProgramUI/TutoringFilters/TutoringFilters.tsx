import { Search } from "lucide-react";

export const TutoringFilters = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            placeholder="Buscar colaborador..."
            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none 
            transition focus:border-blue-500"
          />
        </div>

        <select className="rounded-xl border border-gray-300 px-3">
          <option>Todos los tutores</option>
        </select>

        <select className="rounded-xl border border-gray-300 px-3">
          <option>Todas las semanas</option>
        </select>
      </div>
    </div>
  );
};
