import { DocumentCard } from "../LayoutPropTypes";
import { LOCAL_STORAGE_KEY } from "../constants/constants";
import staticData from "../constants/data.json";

/**
 *
 * @param cards
 * @param lastCardOrderRef
 * @returns new order of the cards if the order has changed, otherwise null
 */
export const compareCardOrder = (cards: DocumentCard[], lastCardOrderRef: string[]) => {
  const currentCardOrder = cards.map((card) => card.type);
  if (JSON.stringify(currentCardOrder) !== JSON.stringify(lastCardOrderRef)) {
    return currentCardOrder;
  }
  return null;
};

/**
 * Initialize local storage with static data if no data exists.
 */
export const initializeStorage = () => {
  // Check if data already exists in local storage
  const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);

  // If no data exists, initialize local storage with static data
  if (!existingData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(staticData));
  }
};

/**
 *
 * @returns documents from local storage
 */
export const getDocumentsFromStorage = (): Document[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

/**
 * set the new documents to local storage
 * @param newDocuments
 */
export const saveDocumentsToStorage = (newDocuments: Document[]): void => {
  // Save the updated list back to local storage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDocuments));
};
