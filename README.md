## Documentation for Frontend Assignment 

### Overview

This application displays different document types as draggable and reorderable cards, and it allows users to view document images in an overlay. It supports saving the order of the documents to browser storage and syncing with a server via mock APIs created using `msw`. 

The core functionalities include:

- Displaying loading spinner while fetching document data. 
- Reordering the cards using drag-and-drop.
- Displaying the document image in an overlay, which can be closed by clicking on the image or pressing the Escape key.
- Periodically saving the document order to the server.
- Mocking a REST API to fetch and store data in the browser using `msw`.

### Core Features

1. **Fetching Documents**: The app loads document data on initialization using `fetchData`. A loading spinner is displayed while fetching documents from the server.
2. **Drag-and-Drop Functionality**: Users can drag and drop the document cards to reorder them. The new order is automatically saved to the server every 5 seconds.
3. **Image Overlay**: Clicking on a document card opens the image in an overlay. The overlay can be closed by either clicking outside the image or pressing the Escape key.
4. **Mock API**: The application uses `msw` to mock API calls. The mock API fetches and saves documents in browser storage to ensure data persistence across reloads.

### API Design and Architecture

The `msw` library provides the mock server, which allows seamless communication between the client and mocked backend services.

#### API Endpoints:
1. **GET `/api/documents`**:
   - Fetches the current list of documents from browser storage.
   
2. **POST `/api/documents`**:
   - Saves the current state of the documents (including order) in browser storage.

### Approach to Hooks

We use multiple `useEffect` hooks to handle the core functionality of the app:
- **Document Fetching**: A `useEffect` hook is used on component mount to fetch documents from the server. The fetched data is stored in the `cards` state, and a loading spinner is shown until the fetch completes.
  
- **Image Overlay**: Another `useEffect` hook manages the `Escape` key press event, which closes the overlay. The event listener is added when the component mounts and removed on unmount to ensure proper resource management.

- **Auto-Saving**: We use a `setInterval` inside a `useEffect` to periodically check if the order of the cards has changed. If so, the document order is automatically saved to the server every 5 seconds.

- **Order-Comparing**: We used `useRef` that holds the last card order reference to compare with the current order to avoid redundant API calls.

### Key Code Snippets

1. **Fetching Documents with `useEffect`:**
```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const documents = await fetchDocuments();
      setCards(documents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };

  // Delay fetching to display loading spinner
  setTimeout(() => {
    fetchData();
  }, 5000);
}, []);
```

2. **Auto-Saving Documents Every 5 Seconds:**
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    const updatedOrder = compareCardOrder(cards, lastCardOrderRef.current);
    if (updatedOrder) {
      lastCardOrderRef.current = updatedOrder;
      saveDocuments(cards);  // Save the updated document order
    }
  }, 5000);

  return () => clearInterval(interval);
}, [cards]);
```

3. **Handling Image Overlay and Escape Key:**
```tsx
useEffect(() => {
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOverlayImage(null);  // Close overlay on ESC press
    }
  };

  window.addEventListener("keydown", handleEscapeKey);

  return () => {
    window.removeEventListener("keydown", handleEscapeKey);
  };
});
```

### Mock API Setup

The mock API handlers are defined using `msw`. They simulate the real-world behavior of saving and fetching data to/from the server.

```ts
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
    saveDocumentsToStorage(data);
    return new HttpResponse("Data saved successfully", { status: 201 });
  }),
];
```

### Drag-and-Drop Implementation

The drag-and-drop functionality in the application allows users to reorder document cards interactively. This feature is implemented using three core functions: `handleDragStart`, `handleDrop`, and `handleDragOver`. Below is the detailed explanation and implementation of each function:

#### 1. `handleDragStart`

**Purpose:** This function is triggered when the user starts dragging a card. It captures the index of the dragged card and stores it in the state.

**Implementation:**

```tsx
const handleDragStart = (index: number) => {
  setDraggedCardIndex(index); // Store the index of the dragged card
};
```

**Explanation:**
- **`index: number`**: The index of the card being dragged.
- **`setDraggedCardIndex(index)`**: Updates the state with the index of the card currently being dragged. This index will be used later to determine which card to swap with.

#### 2. `handleDrop`

**Purpose:** This function is triggered when the dragged card is dropped onto another card. It swaps the positions of the dragged card and the card it was dropped onto.

**Implementation:**

```tsx
const handleDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
  if (draggedCardIndex !== null && draggedCardIndex !== index) {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      // Swap the positions of the dragged card and the target card
      [updatedCards[draggedCardIndex], updatedCards[index]] = [
        updatedCards[index],
        updatedCards[draggedCardIndex],
      ];
      return updatedCards; // Return the updated list of cards
    });
  }
  setDraggedCardIndex(null); // Reset the index of the dragged card
};
```

**Explanation:**
- **`event: React.DragEvent<HTMLDivElement>`**: The drag event.
- **`index: number`**: The index of the card where the dragged card is dropped.
- **`draggedCardIndex`**: The index of the card being dragged.
- **`setCards`**: Updates the state with a new list of cards where the dragged card and the target card have swapped places.
- **Swapping Logic:** The values at `updatedCards[draggedCardIndex]` and `updatedCards[index]` are exchanged to reflect the new order.
- **`setDraggedCardIndex(null)`**: Resets the state to indicate that no card is currently being dragged.

#### 3. `handleDragOver`

**Purpose:** This function ensures that the card being dragged can be dropped onto another card by preventing the default behavior of the dragover event.

**Implementation:**

```tsx
const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event?.preventDefault(); // Prevent default behavior to allow drop
};
```

**Explanation:**
- **`event: React.DragEvent<HTMLDivElement>`**: The drag event.
- **`event?.preventDefault()`**: Prevents the default behavior of the dragover event, which is necessary to enable the drop event.

### Conclusion

This solution is built with reusability and scalability in mind:
- The API is modular, allowing for easy updates and reuse across different components.
- The state management in React is optimized with hooks, ensuring efficient data fetching, drag-and-drop functionality, and automatic document saving.
- Using `msw` to mock the backend API provides a reliable development environment without needing a full backend setup. This can be easily swapped out for a real API in production.


### Steps to Run the Project

To get the project up and running on your local development environment, follow these steps:

#### 1. **Clone the Repository**

   First, clone the project repository from GitHub:

   ```bash
   git clone https://github.com/prabhjotlamba1655/Drag-drop-functionality.git
   cd zania-assignment
   ```

#### 2. **Install Dependencies**

   Install the necessary dependencies using `npm` or `yarn`:

   ```bash
   npm i -f
   ```

#### 3. **Run the Development Server**

   Start the development server to run the project:

   ```bash
   npm start
   # or
   yarn start
   ```

   This command will start the local development server and open the application in your default web browser.

Following these steps will help you set up and run the project successfully in your local development environment.

#### Note: Please be aware that the Docker process could not be completed due to an issue with the `mockServiceWorker.js` file. In Docker, we copy all files, but this particular file changes with each refresh. As a result, the webpage was using a previously cached version of `mockServiceWorker.js`, which caused the error.
