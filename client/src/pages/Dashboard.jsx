import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/navbar";
import BoardPreview from "../components/BoardPreview";

const Dashboard = () => {
  // Redirect to login if there's no token
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]); // watch all cookies
  // eslint-disable-next-line no-unused-vars
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
      <div className="p-16 pt-24 pl-32">
        <div className="flex flex-row flex-wrap items-center justify-start gap-8 ">
          {
            Array.from({ length: 10 }).map((_, index) => (
              <BoardPreview key={index} gameTitle={`Game Title ${index + 1}`} isWhite={index % 2 === 0} />
            ))
          }
          <div className="cursor-pointer">
            <p className="pb-2 text-center">New Study</p>
            <div className="w-[250px] h-[250px] bg-gray-200 rounded-md flex items-center justify-center">
              <div className="w-[80px] h-[80px] bg-gray-300 rounded-[1rem] flex items-center justify-center">
                <span className="text-6xl font-thin text-gray-400">＋</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Dashboard;