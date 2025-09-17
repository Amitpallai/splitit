import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import App from "./App";
import './index.css';
import { AuthProvider } from "./context/AuthContext"; 
import { ThemeProvider } from './components/theme-provider';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <BrowserRouter>
     <ThemeProvider  defaultTheme="system">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
