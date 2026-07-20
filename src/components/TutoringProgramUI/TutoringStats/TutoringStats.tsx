import { ClipboardList, CalendarDays, Users, Star } from "lucide-react";

interface Props {
  total: number;
}

export const TutoringStats = ({ total }: Props) => {
  const cards = [
    {
      title: "Total",
      value: total,
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Semana 1",
      value: 18,
      icon: CalendarDays,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Semana 2",
      value: 12,
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Promedio",
      value: "4.5",
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition 
            hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>

                <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
