export const mapHelpResponse = (rawData) => {
  if (!Array.isArray(rawData)) return [];

  return rawData.map((section) => ({
    id: section.id,
    title: section.title,
    guides: Array.isArray(section.items)
      ? section.items.map((item) => {
          if (typeof item === "string") {
            return { title: item, description: "", steps: [] };
          }
          return {
            title: item.title || "",
            description: item.description || "",
            steps: Array.isArray(item.steps)
              ? item.steps.map((step) => {
                  if (typeof step === "string") {
                    return { text: step, image: null };
                  }
                  return {
                    text: step.text || "",
                    image: step.image || null,
                  };
                })
              : [],
          };
        })
      : [],
  }));
};
