import type { TutoringProgramModel } from "../../../types/Types";
import { EmptyState } from "../EmptyState/EmptyState";
import { TutoringCard } from "../TutoringCard/TutoringCard";

interface Props {
  data: TutoringProgramModel[];
}

export const TutoringGrid = ({ data }: Props) => {
  if (!data.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <TutoringCard key={item.id} tutoring={item} />
      ))}
    </div>
  );
};
