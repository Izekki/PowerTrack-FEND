export const mapHelpResponse = (rawData) => {
  if (!Array.isArray(rawData)) return [];

  return rawData.map((section) => ({
    id: section.id,
    title: section.title,
    guides: Array.isArray(section.items) ? section.items : [],
  }));
};
