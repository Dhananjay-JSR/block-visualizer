import { AnimatePresence, motion } from "framer-motion";
import { BTCTrans } from "../utils/Typers";
import { useState } from "react";
import React from "react";

export default function LiveCounter({
    wc,
    Title
}:{
    wc: WebSocket,
    Title:string
}){
    const [BTCHolder, setBTCHolder] = useState<BTCTrans[]>([]);

    
  React.useEffect(() => {
    if (wc.readyState === WebSocket.OPEN) {
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
    }
  }, []);
    return <div className="bg-[#121111]  h-full w-1/2 p-1">
    <div className="text-center mb-2 text-lg font-medium text-white font-mono underline">
      Latest {Title} Transaction
    </div>

    <table className="h-3/4 w-full">
      <tbody>
        {BTCHolder.map((item) => {
          return (
            <AnimatePresence>
              <motion.tr
                initial={{
                  translateX: 20,
                }}
                animate={{ translateX: 0 }}
                // exit={{opacity:0 }}
                className="hover:text-white text-gray-400 hover:cursor-pointer hover:bg-gray-300/20 "
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

                <td>
                  {item.transaction.out.reduce((curr, acc) => {
                    return curr + acc.value;
                  }, 0) / 1000000000}{" "}
                  BTC
                </td>
                <td>
                  {" "}
                  RS{" "}
                  {(
                    (item.transaction.out.reduce((curr, acc) => {
                      return curr + acc.value;
                    }, 0) /
                      1000000000) *
                    36_47_186
                  ).toFixed(2)}
                </td>
              </motion.tr>
            </AnimatePresence>
          );
        })}
      </tbody>
    </table>
  </div>

}