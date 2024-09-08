// utils/apiUtils.ts
import { apiEndpoints } from "../constants/constants";
import { DocumentCard } from "../LayoutPropTypes";

export const fetchDocuments = async (): Promise<DocumentCard[]> => {
  try {
    const response = await fetch(apiEndpoints.documents.fetch);
    if (!response.ok) {
      throw new Error(
        `Error fetching documents: ${response.status} - ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    throw error;
  }
};

export const saveDocuments = async (cards: DocumentCard[]): Promise<void> => {
  try {
    const response = await fetch(apiEndpoints.documents.save, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cards),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to save documents: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error saving documents:", error);
    throw error;
  }
};
