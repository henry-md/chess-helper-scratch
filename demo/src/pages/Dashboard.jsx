import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/navbar";

const Dashboard = () => {
  // Redirect to login if there's no token
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]); // watch all cookies
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!cookies.token) {
        console.log('No token found, navigating to login');
        navigate("/login");
        return;
      }
      const { data } = await axios.post(
        "http://localhost:4000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "bottom-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  return (
    <>
      <Navbar />
      <h2>Welcome {username}!</h2>
      <ToastContainer />
    </>
  );
};

export default Dashboard;