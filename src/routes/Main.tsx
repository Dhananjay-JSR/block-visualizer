import { useState } from "react";
import { Link } from "react-router-dom";
import RobotImg from "../assets/robot.png";

export function Header() {
  return (
    <nav className="w-full h-16 flex px-3 justify-between items-center bg-[#19323C]">
      <div className="font-bold text-white">
        Blocky
        <span className="pl-2 text-lg">the Bitcoin Tracer</span>
      </div>
      <div className="text-white text-lg">
        System Status : <span className="">Online</span>
      </div>
    </nav>
  );
}

export default function Main() {
  const [Txaddress, setTxAddress] = useState("");
  return (
    <>
  
      <div className="h-screen flex flex-col">
        <Header />
        <div className="w-full grow flex justify-center items-center">
          <div className="flex flex-col justify-center -mt-20">
            <img src={RobotImg} className="h-56 w-96" />
            <div className="flex gap-1 justify-center items-center">
              <input
              value={Txaddress}
              onChange={(e) => setTxAddress(e.target.value)}
                placeholder="Enter Address You Want to Track"
                className="border-2 rounded-md w-80 border-[#19323C] px-2 placeholder:text-[#090979]/60 focus:outline-none "
              />
              <Link to={`/transaction/${Txaddress}`}>
              <button className="rounded-full group border-gray-500 hover:border-[#19323C] hover:transition-all transition-all border-2  p-1 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"  
                  height="16"
                  fill="currentColor"
                  className="bi bi-search fill-gray-500 transition-all group-hover:fill-[#19323C] group-hover:transition-all"
                  viewBox="0 0 16 16"
                  >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </button>
                  </Link>
            </div>
          </div>
        </div>
        <div className="h-10 w-full text-right pt-2 px-2 text-lg text-white bg-[#19323C]">
          Team Snowden
        </div>
      </div>
    </>
  );
}

