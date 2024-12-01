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
  const [pgns, setPgn] = useState([]);
  
  // Verify token, and kick user out if it's not valid
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        console.log('No token found, navigating to login');
        navigate("/login");
        return;
      }
      const { data } = await axios.post(
        "http://localhost:4000/verify-token",
        {},
        { withCredentials: true }
      );
      const { status, username } = data;
      setUsername(username);
      return status
        ? toast(`Hello ${username}`, {
            position: "bottom-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    const fetchPgn = async () => {
      const { data } = await axios.get("http://localhost:4000/get-all-pgns", { withCredentials: true });
      console.log('data', data, 'pgns', data.pgns);
      setPgn(data.pgns);
    };
    fetchPgn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-[4rem] pt-24 px-32">
        <div className="grid grid-cols-1 gap-8 mx-auto sm:grid-cols-2 lg:grid-cols-4">
          {
            pgns.map((pgn, index) => (
              <BoardPreview key={index} gameTitle={pgn.title} isWhite={index % 2 === 0} />
            ))
            // Array.from({ length: 6 }).map((_, index) => (
            //   <BoardPreview key={index} gameTitle={`Game Title ${index + 1}`} isWhite={index % 2 === 0} />
            // ))
          }
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <p className="pb-2 text-center">New Study</p>
            <div className="relative flex items-center justify-center w-full bg-gray-200 rounded-md aspect-square group">
              <div className="absolute inset-0 z-50 transition-opacity bg-black rounded-md opacity-0 group-hover:opacity-[0.08]"></div>
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