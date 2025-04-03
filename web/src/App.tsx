import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useMemo } from "react";
import useAuth from "@/hooks/use-auth.tsx";
import { $isAuthenticated, setIsAuthenticated } from "./store/auth";
import { useStore } from "@nanostores/react";
import Game from "./pages/game";

// Pages
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";


function App() {
  const { validate } = useAuth();
  const authenticationRoutes = ["/login", "/register"];
  const isAuthenticated = useStore($isAuthenticated);
  
  const isInAuthenticationRoute = useMemo(() => {
    return authenticationRoutes.includes(window.location.pathname);
  }, [window.location.pathname]);
  
  // Redirect if authentication doesn't match route
  useEffect(() => {
    const checkValidation = async () => {
      const isValidated = await validate();
      setIsAuthenticated(isValidated);
      if (!isInAuthenticationRoute && !isValidated) {
        window.location.href = "/login";
      } else if (isInAuthenticationRoute && isValidated) {
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
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
