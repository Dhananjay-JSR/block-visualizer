import { AnimatePresence, motion } from "framer-motion";
import { BTCTrans } from "../utils/Typers";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LiveCounter({
    wc,
    Title
}:{
    wc: WebSocket,
    Title:string
}){
    const [BTCHolder, setBTCHolder] = useState<BTCTrans[]>([]);
    const navigate = useNavigate();

    
  React.useEffect(() => {
    // if (wc.readyState === WebSocket.OPEN) {
      const MSGPayloader = (msg: MessageEvent) => {
        // console.log(JSON.parse(msg.data))
        const Response: BTCTrans = JSON.parse(msg.data);
        Response.recivedTime = new Date().toLocaleTimeString();

        setBTCHolder((prev) => {
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
    <div className=" mb-2 text-base  font-semibold text-black font-mono  ">
      {Title} Transaction
    </div>

    <table className="h-3/4 w-full mt-4">
    {BTCHolder.length==0 ? <div className="w-full h-full flex justify-center items-center text-black bg-white/5 animate-pulse  ">
        <div className="">Waiting for Server Response</div>
      </div> : <tbody>
        {BTCHolder.map((item) => {
          return (
            <AnimatePresence key={item.transaction.hash}>
              <motion.tr
              onClick={()=>{
             
                navigate(`/transaction/${item.transaction.hash}`)
              }}
                initial={{
                  translateX: 20,
                }}
                animate={{ translateX: 0 }}
                // exit={{opacity:0 }}
                className="hover:text-black h text-gray-400 hover:cursor-pointer hover:bg-gray-300/20 "
                key={item.transaction.hash}
              >
                <td className="">
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

                <td className="text-clip">
                  {(item.transaction.out.reduce((curr, acc) => {
                    return curr + acc.value;
                  }, 0) / 1000000000).toFixed(3)}
                  BTC
                </td>
                {/* <td>
                  {" "}
                  RS{" "}
                  {(
                    (item.transaction.out.reduce((curr, acc) => {
                      return curr + acc.value;
                    }, 0) /
                      1000000000) *
                    36_47_186
                  ).toFixed(2)}
                </td> */}
              </motion.tr>
            </AnimatePresence>
          );
        })}
      </tbody>}
    </table>
  </div>

}