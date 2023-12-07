import { useState } from "react";
import { Link } from "react-router-dom";
import RobotImg from "../assets/robot.png";
import React from "react";
import { BTC_ws,ETH_ws } from "../utils/conn";
import { BTCTrans } from "../utils/Typers";
import { AnimatePresence, motion } from "framer-motion";
import LiveCounter from "../components/LiveCounter";
import ETHCOunter from "../components/ETHLiveCounter";

export function Header() {
  return (
    <nav className="w-full h-14 flex px-3 justify-between items-center bg-[#121111]">
      <div className="font-bold text-[#dcf47c]  px-1 rounded-sm border-0 border-[#dcf47c] scale-y-150 scale-105">
        Blocky
        {/* <span className="pl-2 text-lg">the Bitcoin Tracer</span> */}
      </div>
      <div className="text-base text-[#dcf47c]">
        System Status : <span className="">Operational</span>
      </div>
    </nav>
  );
}



export default function Main() {
  const [Txaddress, setTxAddress] = useState("");


  return (
    <>
      <div className="h-screen bg-[#181716] flex flex-col overflow-hidden">
        <Header />
        <main className="flex-grow">
          <div className="bg-[#121111] relative h-44">
            <div className="pl-24 pt-3 text-white font-mono max-w-[700px] leading-loose ">
              Unearth Bitcoin's secrets with our powerful Transaction Explorer.{" "}
              <span className="text-xl text-[#dcf47c]">Track</span>,{" "}
              <span className="text-xl text-[#dcf47c]">analyze</span>, and{" "}
              <span className="text-xl text-[#dcf47c]">visualize</span> the
              digital currency journey – your ultimate guide to blockchain
              insights!{" "}
            </div>
            <div className="absolute bg-white w-5/6  bottom-0 translate-y-5 right-1/2 translate-x-1/2 shadow-md shadow-[#818f49]">
              <div className="w-full h-full relative ">
                <input
                  value={Txaddress}
                  onChange={(e) => {
                    const Value = e.currentTarget.value;
                    setTxAddress(() => Value);
                  }}
                  className="w-full text-xl p-2 outline-none"
                />
                <button className="absolute right-2 w-min bg-[#121111] text-white font-medium hover:text-[#dcf47c] hover:scale-105 active:scale-75 active:ease-in-out transition-all p-1 top-1/2 -translate-y-1/2">
                  SEARCH
                </button>
              </div>
            </div>
          </div>
        </main>
        <div className="flex -300 h-48 gap-5 px-5">

         <LiveCounter wc={BTC_ws} Title="BTC" />
         {/* <LiveCounter wc={ETH_ws} Title="ETH" /> */}
         <ETHCOunter wc={ETH_ws} Title="ETH" />

          {/* <div className="bg-[#121111]  h-full w-1/2 p-1">
            <div className="text-center text-lg font-medium text-white font-mono underline">
              Latest ETH Transaction
            </div>
          </div>
        </div> */}

        {/* <div className="w-full grow flex justify-center items-center">
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
        </div> */}
        {/* <div className="h-10 w-full text-right pt-2 px-2 text-lg text-white bg-[#19323C]">
          Team Snowden
        </div> */}
        </div>
      </div>
    </>
  );
}
