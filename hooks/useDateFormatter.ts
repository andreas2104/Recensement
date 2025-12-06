export const useDateFormatter = () => {
  const formatDate = (
    dateString: string | Date | null | undefined,
    formatType: "short" | "long" | "time" = "short"
  ): string => {
    if (!dateString) return "No date provided";

    const date = dateString instanceof Date ? dateString : new Date(dateString);

    if (isNaN(date.getTime())) return " invalid Date";

    switch (formatType) {
      case "short":
        return date.toLocaleDateString("fr-FR");
      case "long":
        return date.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "time":
        return date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      default:
        return date.toLocaleDateString("fr-FR");
    }
  };

  return { formatDate };
};
