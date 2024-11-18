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
    <ul className="flex justify-end items-center gap-2 mx-16">
      <li><a className="cursor-pointer px-4 py-4 flex items-center hover:text-yellow-600" onClick={() => navigate("/")}>Home</a></li>
      {isAuthenticated && !isHome ? (
        <li><a className="cursor-pointer px-4 py-4 flex items-center hover:text-yellow-600" onClick={handleLogout}>Logout</a></li>
      ) : (
        <>
          <li><a className="cursor-pointer px-4 py-4 flex items-center hover:text-yellow-600" onClick={() => navigate("/login")}>Login</a></li>
          <li><a className="cursor-pointer px-4 py-4 flex items-center hover:text-yellow-600" onClick={() => navigate("/signup")}>Signup</a></li>
        </>
      )}
    </ul>
  )
};

export default Navbar;
