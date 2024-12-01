import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const [cookies, removeCookie] = useCookies([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verify token to change isAuthenticated state
  useEffect(() => {
    // Quick and dirty check
    if (cookies.token && cookies.token !== "undefined") {
      setIsAuthenticated(true);
    }

    // Longer check
    const verifyToken = async () => {
      if (!cookies.token) {
        setIsAuthenticated(false);
      } else {
      const { data } = await axios.post(
        "http://localhost:4000/verify-token",
        {},
        { withCredentials: true }
      );
      const { status } = data;
      setIsAuthenticated(status);
      }
    }
    verifyToken();
  }, [cookies]);

  const navigate = useNavigate();
  const handleLogout = () => {
    removeCookie("token");
    navigate("/login");
  };

  return (
    <ul className="absolute top-0 right-0 flex items-center justify-end gap-2 mx-16">
      <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/")}>Home</a></li>
      {isAuthenticated ? (
        <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={handleLogout}>Logout</a></li>
      ) : (
        <>
          <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/login")}>Login</a></li>
          <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/signup")}>Signup</a></li>
        </>
      )}
    </ul>
  )
};

export default Navbar;
