export const thumbnails: Record<string, string> = {
  "bank-draft":
    "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg",
  "bill-of-lading":
    "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
  invoice:
    "https://img.freepik.com/free-photo/cute-domestic-kitten-sits-window-staring-outside-generative-ai_188544-12519.jpg",
  "bank-draft-2":
    "https://images.theconversation.com/files/541015/original/file-20230803-19-fmuwe.jpg?ixlib=rb-4.1.0&rect=10%2C0%2C6647%2C4626&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
  "bill-of-lading-2":
    "https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-rush-45170.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
};

export const LOCAL_STORAGE_KEY = 'documents';
export const DEVELOPMENT = 'development';

// constants/apiConstants.ts
export const apiEndpoints = {
  documents: {
    fetch: "/api/documents",
    save: "/api/documents",
  },
};
