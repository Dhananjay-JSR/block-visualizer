import { useState } from "react";
import { EthTrans } from "../utils/Typers";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function ETHCOunter({
    wc,
    Title
}:{
    wc: WebSocket,
    Title:string
}){
    const [ETHHolder, setETHHolder] = useState<EthTrans[]>([]);

  React.useEffect(() => {
    // if (wc.readyState === WebSocket.OPEN) {
      const MSGPayloader = (msg: MessageEvent) => {
        // console.log(msg)
        // console.log(JSON.parse(msg.data))
        const Response: EthTrans = JSON.parse(msg.data);
        Response.recivedTime = new Date().toLocaleTimeString();

        setETHHolder((prev) => {
          // Add the latest message at the beginning of the array
          const newState = [Response, ...prev];
          // Keep only the latest two messages
          if (newState.length > 5) {
            return newState.slice(0, 5);
          }

          return newState;
        });
      };
      wc.addEventListener("message", MSGPayloader);
      return () => {
        wc.removeEventListener("message", MSGPayloader);
      };
    // }
  }, []);
    return <div className="bg-white  h-52 w-1/2 p-1 px-2.5">
    <div className="mb-2 text-base  font-semibold text-black font-mono">
       {Title} Transaction
    </div>

    <table className="h-3/4 w-full mt-4">
      {ETHHolder.length==0 ? <div className="w-full h-full flex justify-center items-center text-black bg-white/5 animate-pulse  ">
        <div className="">Waiting for Server Response</div>
      </div> :<tbody className="w-full">
        {ETHHolder.map((item) => {
          return (
            <AnimatePresence key={item.transaction.hash}>
              <motion.tr
                initial={{
                  translateX: 20,
                }}
                animate={{ translateX: 0 }}
                // exit={{opacity:0 }}
                className="hover:text-black text-gray-400 hover:cursor-pointer hover:bg-gray-300/20 "
                key={item.transaction.hash}
              >
                <td>
                  {item.transaction.hash
                    .slice(0, 8)
                    .split("")
                    .map((char, index) => {
                      return index > 0 && index % 4 === 0
                        ? `-${char}`
                        : char;
                    })
                    .join("")}
                </td>
                <td>{item.recivedTime}</td>

                <td className="text-ellipsis overflow-hidden">
                  {/* {item.transaction.out.reduce((curr, acc) => {
                    return curr + acc.value;
                  }, 0) / 1000000000}{" "} */}
                  {(parseFloat(item.transaction.value)/1000000000).toFixed(2)}
                  ETH
                </td>
                {/* <td className="text-ellipsis overflow-hidden ">
                  {" "}
                  RS{" "}
                  {(
                    (parseFloat(item.transaction.value) /
                      1000000) *
                      1_86_269
                  ).toFixed(2)}
                </td> */}
              </motion.tr>
            </AnimatePresence>
          );
        })}
      </tbody> }
      
    </table>
  </div>

}