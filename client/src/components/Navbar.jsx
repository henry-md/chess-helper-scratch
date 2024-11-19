import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [cookies, removeCookie] = useCookies([]);
  const isAuthenticated = cookies.token && cookies.token !== "undefined";
  const isHome = location.pathname === '/';

  const navigate = useNavigate();
  const handleLogout = () => {
    removeCookie("token");
    navigate("/login");
  };

  return (
    <ul className="flex items-center justify-end gap-2 mx-16">
      <li><a className="flex items-center px-4 py-4 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/")}>Home</a></li>
      {isAuthenticated && !isHome ? (
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
