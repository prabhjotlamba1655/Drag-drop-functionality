import ReactDOM from "react-dom/client"; // Import from 'react-dom/client'
import { DEVELOPMENT } from "./constants/constants";
import './index.css';
import { Layout } from "./Layout";
import { worker } from "./mocks/browser";
import { initializeStorage } from "./utils/commonUtils";

async function startApp() {
  initializeStorage();

  // Start mock worker 
  await worker.start();

  // Use ReactDOM.createRoot for React 18+
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(<Layout />);
}

startApp();
