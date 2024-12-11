import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar";
import BoardPreview from "../components/BoardPreview";
import { useStore } from "@nanostores/react";
import { $user } from "../lib/store";
import { useEffect } from "react";
import useMutationPgns from "../hooks/use-mutation-pgns";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = useStore($user);
  const { pgns } = useMutationPgns();
  const navigate = useNavigate();

  console.log('dashboard: pgns', pgns);

  useEffect(() => {
    toast(`Welcome ${user.username}!`, {
      position: "bottom-right",
    });
  }, [user]);

  // return (
  //   <>
  //     <div>Hello, world!</div>
  //   </>
  // )

  return (
    <>
      <Navbar />
      <div className="p-[4rem] pt-24 px-32">
        <div className="grid grid-cols-1 gap-8 mx-auto sm:grid-cols-2 lg:grid-cols-4">
          {
            Array.isArray(pgns) && pgns.map((pgn, index) => (
              <BoardPreview key={index} gameTitle={pgn.title} isWhite={index % 2 === 0} />
            ))
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