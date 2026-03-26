import { helpMockData } from "../mocks/helpMockData";
import { mapHelpResponse } from "../adapters/helpAdapter";

export const getHelpSections = async () => {
  const payload = await new Promise((resolve) => {
    setTimeout(() => resolve(helpMockData), 250);
  });

  return mapHelpResponse(payload);
};
