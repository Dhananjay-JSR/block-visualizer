import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import RobotImg from "../assets/robot.png";
// import React from "react";
import { BTC_ws, ETH_ws } from "../utils/conn";
// import { BTCTrans } from "../utils/Typers";
// import { AnimatePresence, motion } from "framer-motion";
import LiveCounter from "../components/LiveCounter";
import ReactDOM from "react-dom";
import ETHCOunter from "../components/ETHLiveCounter";
import { SERVER_IP } from "../utils/ServerConst";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

function BlogLogo() {
  return (
    <svg
      className=""
      xmlns="http://www.w3.org/2000/svg"
      xlinkHref="http://www.w3.org/1999/xlink"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <defs>
        <linearGradient id="btc-c" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF" stopOpacity=".5" />
          <stop offset="100%" stopOpacity=".5" />
        </linearGradient>
        {/* <circle id="btc-b" cx="16" cy="15" r="15" /> */}
        <filter
          id="btc-a"
          width="111.7%"
          height="111.7%"
          x="-5.8%"
          y="-4.2%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy=".5" in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
            stdDeviation=".5"
          />
          <feComposite
            in="shadowBlurOuter1"
            in2="SourceAlpha"
            operator="out"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            in="shadowBlurOuter1"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.199473505 0"
          />
        </filter>
        <path
          id="btc-e"
          d="M23.1889526,13.0201846 C23.5025526,10.9239385 21.9064911,9.79704615 19.7240911,9.04529231 L20.4320295,6.20566154 L18.7035372,5.77489231 L18.0143065,8.53969231 C17.5599065,8.42646154 17.0931988,8.31963077 16.6294449,8.21378462 L17.3235988,5.43076923 L15.5960911,5 L14.8876603,7.83864615 C14.5115372,7.75298462 14.1423065,7.66830769 13.7839065,7.5792 L13.7858757,7.57033846 L11.4021218,6.97513846 L10.9423065,8.82129231 C10.9423065,8.82129231 12.224768,9.1152 12.1976911,9.13341538 C12.8977526,9.30818462 13.0242757,9.77144615 13.0031065,10.1387077 L12.1967065,13.3736615 C12.2449526,13.3859692 12.3074757,13.4036923 12.3763988,13.4312615 C12.3187988,13.4169846 12.2572603,13.4012308 12.1937526,13.3859692 L11.0634142,17.9176615 C10.9777526,18.1303385 10.7606449,18.4493538 10.2712911,18.3282462 C10.2885218,18.3533538 9.01492185,18.0146462 9.01492185,18.0146462 L8.15682954,19.9932308 L10.4061834,20.5539692 C10.8246449,20.6588308 11.2347372,20.7686154 11.6384295,20.872 L10.9231065,23.7441231 L12.6496295,24.1748923 L13.3580603,21.3332923 C13.8296911,21.4612923 14.2875372,21.5794462 14.7355372,21.6907077 L14.029568,24.5190154 L15.7580603,24.9497846 L16.4733834,22.0830769 C19.4208295,22.6408615 21.6371988,22.4158769 22.5701218,19.7500308 C23.3218757,17.6035692 22.5327065,16.3654154 20.9819372,15.5580308 C22.1112911,15.2976 22.9619988,14.5547077 23.1889526,13.0201846 L23.1889526,13.0201846 Z M19.2396603,18.5581538 C18.7055065,20.7046154 15.0914757,19.5442462 13.9197834,19.2532923 L14.8689526,15.4482462 C16.0406449,15.7406769 19.7979372,16.3196308 19.2396603,18.5581538 Z M19.7743065,12.9891692 C19.2869218,14.9416615 16.2789218,13.9496615 15.303168,13.7064615 L16.1637218,10.2553846 C17.1394757,10.4985846 20.2818757,10.9524923 19.7743065,12.9891692 Z"
        />
        <filter
          id="btc-d"
          width="123.2%"
          height="117.5%"
          x="-11.6%"
          y="-6.3%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy=".5" in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
            stdDeviation=".5"
          />
          <feColorMatrix
            in="shadowBlurOuter1"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.204257246 0"
          />
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill="#000" filter="url(#btc-a)" xlinkHref="#btc-b" />
        <use fill="#F7931A" xlinkHref="#btc-b" />
        <use
          fill="url(#btc-c)"
          style={{
            mixBlendMode: "soft-light",
          }}
          // style="mix-blend-mode:soft-light"
          xlinkHref="#btc-b"
        />
        <circle cx="16" cy="15" r="14.5" stroke="#000" strokeOpacity=".097" />
        <g fillRule="nonzero" className="">
          <use fill="#000" filter="url(#btc-d)" xlinkHref="#btc-e" />
          <use
            fill="#FFF"
            className="fill-blue-600"
            fillRule="evenodd"
            xlinkHref="#btc-e"
          />
        </g>
      </g>
    </svg>
  );
}
export function Header() {
  const [Response, setResponse] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      const Data = await fetch(SERVER_IP + "/health", {
        signal: signal,
      });
      const Body = await Data.text();
      if (Body == "OK") {
        setResponse(true);
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);
  return (
    <nav className="w-full h-10 flex px-3 justify-between items-center bg-white">
      <div className="text-blue-600 flex items-center gap-3">
        <div>
          <BlogLogo />
        </div>
        <div className="font-mono font-semibold">Blocky</div>
      </div>

      {/* <div className="font-bold text-[#dcf47c]  px-1 rounded-sm border-0 border-[#dcf47c] scale-y-150 scale-105">
        Blocky
  
      </div> */}
      <div className="text-[10px] gap-2 text-black flex  font-serif">
        <Link to={"/"} className="text-gray-600 hover:underline">
          Transactions
        </Link>
        <Link to={"/AboutUS"} className="text-gray-600 hover:underline">
          About US
        </Link>
        <div>
          <div className="select-none">
            <span className="mr-2 text-black/50">Server Status</span>
            {Response ? (
              <span className="">Operational</span>
            ) : (
              <span className="text-red-500">No Signal</span>
            )}
          </div>
        </div>
        {/* System Status :{" "}
         */}
      </div>
    </nav>
  );
}

function ModalViewer({
  children,
  setIsOpened,
}: {
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  const MODAL = document.getElementById("modal");
  useEffect(() => {
    setIsOpened(true);
  }, []);
  return ReactDOM.createPortal(
    <>
      <div className="fixed animate-modal-open   bg-transparent h-screen w-full top-0 left-0 "></div>
      <div className="fixed top-0 left-0 z-10 w-full h-screen">{children}</div>
    </>,
    MODAL
  );
}

export default function Main() {
  const [inputField,SetInputField] = useState("")
  const [setshowModal, setSetshowModal] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();
  const NodeRef = useRef<HTMLInputElement>();
  useEffect(() => {
    navigator.clipboard.writeText("0x414e561C4b66c6243a73F248BBf4DBbf98a87594")
    function CLickEvet(mouse: MouseEvent) {
      console.log("Called");
      if (isOpened) {
        if (
          NodeRef.current &&
          mouse.target instanceof HTMLElement &&
          !NodeRef.current.contains(mouse.target)
        ) {
          setSetshowModal(false);
          setIsOpened(false);
        }
      }
    }

    document.addEventListener("click", CLickEvet);

    return () => {
      document.removeEventListener("click", CLickEvet);
    };
  }, [isOpened]);

  return (
    <>
      {setshowModal && (
        <ModalViewer setIsOpened={setIsOpened}>
            <div>
        <Toaster />
      </div>
          <div className="mt-20 mx-auto w-fit">
            <input
            onChange={(e)=>{
              const Value = e.currentTarget.value
              SetInputField(Value)
            }}
            onKeyDown={async(e)=>{
              if (e.key=="Enter"){
                if (inputField!=""){
                  const toastId = toast.loading('Loading...');
                  try{

                 
                
                  const ReqData = await axios.get(SERVER_IP+"/search?parameters="+inputField)
                  if (ReqData.data.error==true){
                    toast.error("Could Not Find it in Out Block Network",{
                      id: toastId
                    })
                  }else{
                    toast.success("Result Found",{
                      id:toastId
                    })
                    if (ReqData.data.type=="transaction"){
                      navigate("/transaction/"+inputField)
                    }
                    if (ReqData.data.type=="address"){
                      navigate("/graph/"+inputField)
                    }
                  }
                }
                catch (err){
                  const Err  = err as AxiosError 
                  const ResponData = Err.response.data as Record<string,string>
                  toast.error(ResponData.message,{
                    id:toastId
                  })
                }

                  
                 
                  navigate("/transaction/"+inputField)
                }else{
                  alert("No Empty FIelds")
                }
              }
            }}
              ref={NodeRef}
              placeholder="Enter Etherium or Bitcoin Transaction Hash"
              type="text"
              className="w-96 text-sm px-2 py-1 outline-none rounded-md border  focus:border-black"
            />
            <button className="ml-2 " onClick={async()=>{
             if (inputField!=""){
              const toastId = toast.loading('Loading...');
              try{

             
            
              const ReqData = await axios.get(SERVER_IP+"/search?parameters="+inputField)
              if (ReqData.data.error==true){
                toast.error("Could Not Find it in Out Block Network",{
                  id: toastId
                })
              }else{
                toast.success("Result Found",{
                  id:toastId
                })
                if (ReqData.data.type=="transaction"){
                  navigate("/transaction/"+inputField)
                }
                if (ReqData.data.type=="address"){
                  navigate("/graph/"+inputField)
                }
              }
            }
            catch (err){
              const Err  = err as AxiosError 
              const ResponData = Err.response.data as Record<string,string>
              toast.error(ResponData.message,{
                id:toastId
              })
            }

              
             
              navigate("/transaction/"+inputField)
            }else{
              alert("No Empty FIelds")
            }
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search fill-white hover:fill-black/25" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
            </button>
          </div>
        </ModalViewer>
      )}
      <div className="min-h-screen bg-white flex flex-col overflow-hidden">
        <Header />
        <main className="text-center  pt-24 pb-10 bg-white">
          <div className="text-blue-600 font-bold text-xl">
            Welcome to Blocky
          </div>
          <div className="max-w-md text-xs mx-auto mt-2 leading-4">
            Discover and explore the world of blockchain and cryptocurrencies.
            Real-time data, transactions, and insights at your fingertips.
          </div>
          <button
            onClick={() => {
              setSetshowModal((prev) => true);
            }}
            className="bg-blue-500 mt-3 font-mono hover:bg-blue-400 transition-all text-white text-xs px-2 py-1.5 rounded-sm"
          >
            Explore Now
          </button>
        </main>
        <div className=" px-5 bg-gray-200 ">
          <h1 className="text-blue-600 font-bold text-lg text-center mt-10 mx-auto mb-6">
            Live Transaction Data
          </h1>
          <div className="flex max-w-[870px] mx-auto gap-5 pb-8">
            <LiveCounter wc={BTC_ws} Title="BTC" />
            <ETHCOunter wc={ETH_ws} Title="ETH" />
          </div>
        </div>
        <section className="bg-white  pt-12 pb-6 border-b border">
          <h1 className="text-blue-600 font-bold text-lg text-center mb-4">
            Tokens
          </h1>
          <div className="flex max-w-4xl mx-auto justify-between">
            <ShowCaseHolder
              desc="Most popular cryptocurrency in the world."
              headline="Bitcoin"
            />
            <ShowCaseHolder
              desc="Smart contract pioneer and second largest cryptocurrency by market cap."
              headline="Ethereum"
            />
          </div>
        </section>
        <section className="text-xs text-gray-500 space-y-2 pt-1 text-center">
          <h3>Created By Team Snowden</h3>
          <h6>SIH 2023</h6>
        </section>
      </div>
    </>
  );
}

function ShowCaseHolder({
  desc,
  headline,
}: {
  headline: string;
  desc: string;
}) {
  return (
    <div className="pb-3 p-2 border rounded-sm w-80">
      <h3 className="font-medium">{headline}</h3>
      <h5 className="text-gray-500 text-xs mt-4">{desc}</h5>
    </div>
  );
}
