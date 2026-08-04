export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  return date.toLocaleDateString("es-Mx", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
