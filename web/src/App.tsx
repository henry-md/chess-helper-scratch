import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import useAuth from "@/hooks/use-auth.tsx";

// Pages
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import { $isAuthenticated, setIsAuthenticated } from "./store/auth";
import { useStore } from "@nanostores/react";

function App() {
  const { validate } = useAuth();
  const validationRoutes = ["/", "/dashboard"];
  const authenticationRoutes = ["/login", "/register"];
  const isAuthenticated = useStore($isAuthenticated);
  
  // Redirect if authentication doesn't match route
  useEffect(() => {
    const checkValidation = async () => {
      const isValidated = await validate();
      setIsAuthenticated(isValidated);
      if (validationRoutes.includes(window.location.pathname) && !isValidated) {
        window.location.href = "/login";
      } else if (authenticationRoutes.includes(window.location.pathname) && isValidated) {
        window.location.href = "/dashboard";
      }
    };
    checkValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
