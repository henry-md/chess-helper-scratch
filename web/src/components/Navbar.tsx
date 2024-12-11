import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/use-auth.jsx";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { validate, logout } = useAuth();

  useEffect(() => {
    const checkValidation = async () => {
      const isValidated = await validate();
      setIsAuthenticated(isValidated);
    }
    checkValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useAuth]);

  const navigate = useNavigate();

  return (
    <ul className="absolute top-0 left-0 right-0 flex items-center justify-end gap-2 mx-16">
      <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/")}>Home</a></li>
      <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/dashboard")}>Dashboard</a></li>
      {isAuthenticated ? (
        <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={logout}>Logout</a></li>
      ) : (
        <>
          <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/login")}>Login</a></li>
          <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/register")}>Signup</a></li>
        </>
      )}
    </ul>
  )
};

export default Navbar;
