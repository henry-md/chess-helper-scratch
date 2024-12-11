import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import useAuth from "@/hooks/use-auth.tsx";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const { validate } = useAuth();
  const validationRoutes = ["/", "/dashboard"];
  const authenticationRoutes = ["/login", "/register"];
  
  // Redirect if authentication doesn't match route
  useEffect(() => {
    const checkValidation = async () => {
      const isValidated = await validate();
      if (validationRoutes.includes(window.location.pathname) && !isValidated) {
        window.location.href = "/login";
      } else if (authenticationRoutes.includes(window.location.pathname) && isValidated) {
        window.location.href = "/dashboard";
      }
    };
    checkValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validate]);
  
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
