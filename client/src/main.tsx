import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import { TripProvider } from "./context/TripContext"; 
import { ExpensesProvider } from "./context/ExpensesContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <TripProvider>  
          <ExpensesProvider>
          <App />
          </ExpensesProvider>
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
