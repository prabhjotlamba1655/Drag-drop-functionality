import { http, HttpResponse } from "msw";
import { getDocumentsFromStorage, saveDocumentsToStorage } from "../utils/commonUtils";

export const handlers = [
  // GET request handler for fetching documents
  http.get("/api/documents", () => {
    const documents = getDocumentsFromStorage();
    return new HttpResponse(JSON.stringify(documents), { status: 200 });
  }),

  // POST request handler for saving documents
  http.post("/api/documents", async ({ request }) => {
    const data = await request.json();
    const documents: Document[] = data as Document[];
    saveDocumentsToStorage(documents);
    return new HttpResponse("Data saved successfully", { status: 201 });
  }),
];
