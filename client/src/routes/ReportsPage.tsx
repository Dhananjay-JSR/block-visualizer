import React, { useEffect, useState } from "react";
import { Header } from "./Main";
import ReactDOM from "react-dom";
import axios from "axios";
import { SERVER_IP } from "../utils/ServerConst";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

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

function ReportsPage() {
  const [addressInput, setAddressInput] = useState("");
  const [DateAddedInput, setDateAddedInput] = useState("");
  const [TypeofScamInput, setTypeofScamInput] = useState("");
  const [CounteryInput, setCounteryInput] = useState("");
  const [DescriotionInpit, setDescriotionInpit] = useState("");
  const [SourceInput, setSourceInput] = useState("");
  const [SiteURL, setSiteURL] = useState("");
  const [SearchString,setSearchString] = useState("");
  const [showModal, SetshowModal] = useState(false);
  const [loading,SetLoading] = useState(true);
  const [ReponseDaa,SetResponseData] = useState<{
      id: number;
      WAddress: string | null;
      DateAdded: string | null;
      ScamType: string | null;
      Country: string | null;
      Description: string | null;
      Source: string | null;
      SiteUrl: string | null;
  }[]>([]);
  useEffect(()=>{
    const COntroller = new AbortController();
    const Signal = COntroller.signal;
    const FetchData = async ()=>{
      const Data = await axios.get(SERVER_IP+"/report/latest",{
        signal:Signal
      });

      SetResponseData(()=>Data.data);
      SetLoading(()=>false);
      
    }
    FetchData();
return()=>{
  COntroller.abort();
}
  },[])
  

  useEffect(()=>{
console.log(ReponseDaa)
  },[ReponseDaa])

  if (loading){
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <>
      <div className="z-50 fixed">
        <Toaster />
      </div>
      {showModal && (
        <>
          <ModalViewer setIsOpened={SetshowModal}>
            <div className="w-96 mx-auto mt-11 rounded-md bg-white py-3 px-7">
              <div className="flex items-center justify-between">
                <h4 className="text-blue-600">Add New Report</h4>
                <button
                  className="bg-gray-950 text-sm text-white p-2 rounded"
                  onClick={async () => {
                    if (
                      addressInput == "" ||
                      DateAddedInput == "" ||
                      TypeofScamInput == "" ||
                      CounteryInput == "" ||
                      DescriotionInpit == "" ||
                      SourceInput == "" ||
                      SiteURL == ""
                    ) {
                      SetshowModal(false);
                    } else {
                      
                      // Send Axios Request to post
                      const TOATID = toast.loading("Adding Report");
                      SetshowModal(false);
                      
                      const Data = await axios.post(SERVER_IP + "/report", {
                        address: addressInput,
                        dateAdded: DateAddedInput,
                        typeOfScam: TypeofScamInput,
                        country: CounteryInput,
                        description: DescriotionInpit,
                        source: SourceInput,
                        siteURL: SiteURL,
                      });
                      if (Data.status == 201) {
                       
                      
                


                        setTimeout(() => {
                          toast.success("Report Added Successfully", {
                            id: TOATID,
                          });
                          
                        setAddressInput("");
                        setDateAddedInput("");
                        setTypeofScamInput("");
                        setCounteryInput("");
                        setDescriotionInpit("");
                        setSourceInput("");
                        setSiteURL("");
                          SetResponseData((prev)=>[{
                            id: 0,
                            WAddress: addressInput,
                            DateAdded: DateAddedInput,
                            ScamType: TypeofScamInput,
                            Country: CounteryInput,
                            Description: DescriotionInpit,
                            Source: SourceInput,
                            SiteUrl: SiteURL,
                          },...prev.slice(0,2)])
                        }, 500);
                      }
                    }
                  }}
                >
                  {addressInput == "" ||
                  DateAddedInput == "" ||
                  TypeofScamInput == "" ||
                  CounteryInput == "" ||
                  DescriotionInpit == "" ||
                  SourceInput == "" ||
                  SiteURL == ""
                    ? "Cancel"
                    : "Send"}
                </button>
              </div>
              <div className="mt-6 space-y-2">
                <div>
                  <h6 className="text-xs">Address</h6>
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => {
                      const Vale = e.currentTarget.value;
                      setAddressInput(() => Vale);
                    }}
                    className=" border rounded w-full mt-1"
                  />
                </div>

                <div>
                  <h6 className="text-xs">Date Added</h6>
                  <input
                    type="text"
                    value={DateAddedInput}
                    onChange={(e) => {
                      const Vale = e.currentTarget.value;
                      setDateAddedInput(() => Vale);
                    }}
                    className=" border rounded w-full mt-1"
                  />
                </div>

                <div>
                  <h6 className="text-xs">Type of Scam</h6>
                  <input
                    type="text"
                    value={TypeofScamInput}
                    onChange={(e) => {
                      const Vale = e.currentTarget.value;
                      setTypeofScamInput(() => Vale);
                    }}
                    className=" border rounded w-full mt-1"
                  />
                </div>

                <div>
                  <h6 className="text-xs">Country of Origin</h6>
                  <input
                    type="text"
                    value={CounteryInput}
                    onChange={(e) => {
                      const Vale = e.currentTarget.value;
                      setCounteryInput(() => Vale);
                    }}
                    className=" border rounded w-full mt-1"
                  />
                </div>

                <div>
                  <h6 className="text-xs">Description</h6>
                  <textarea
                    value={DescriotionInpit}
                    onChange={(e) => {
                      const Vale = e.currentTarget.value;
                      setDescriotionInpit(() => Vale);
                    }}
                    className="  border rounded w-full mt-1"
                  />
                </div>

                <div>
                  <h6 className="text-xs">Source</h6>
                  <input
                    value={SourceInput}
                    onChange={(e) => {
                      const Vale = e.currentTarget.value;
                      setSourceInput(() => Vale);
                    }}
                    type="text"
                    className=" border rounded w-full mt-1"
                  />
                </div>

                <div>
                  <h6 className="text-xs">Site URL</h6>
                  <input
                    value={SiteURL}
                    onChange={(e) => {
                      const Vale = e.currentTarget.value;
                      setSiteURL(() => Vale);
                    }}
                    type="text"
                    className=" border rounded w-full mt-1"
                  />
                </div>
              </div>
            </div>
          </ModalViewer>
        </>
      )}
      <section className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="border-t h-full pt-32 grow w-full  space-y-8">
          <div className="w-fit mx-auto">
            <input
              type="text"
              value={SearchString}
              onKeyDown={async(e)=>{
                if (e.key == "Enter"){
                  const Data = await axios.get(SERVER_IP+"/report/?id="+SearchString)
                  SetResponseData(()=>Data.data);

                }
              }}
              onChange={(e)=>{
                const Vale = e.currentTarget.value;
                setSearchString(()=>Vale);
              }}
              className="border-2 rounded-sm focus:outline-none px-2 py-1 w-64 placeholder:text-black/60 "
              placeholder="Enter Address to Search for"
            />
          </div>

          <div className="font-medium max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="mb-6 text-black ">Recently Added Reports</h3>
              <button
                onClick={() => {
                  SetshowModal(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-patch-plus-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zM8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0" />
                </svg>
              </button>
            </div>
            <div className="space-y-8 mb-5">
              {ReponseDaa.length==0 ? <div className="text-center">No Reports Found</div>:ReponseDaa.map((items,index)=>{
                return <SectionHD address={items.WAddress} country={items.Country} dateAdded={items.DateAdded} description={items.Description} siteUrl={items.SiteUrl} source={items.Source} typeOfScam={items.ScamType} key={index}/>
              })}

              {/* <SectionHD />
              <SectionHD />
              <SectionHD /> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHD({
  country,
  dateAdded,
  description,
  siteUrl,source,
  typeOfScam,
  address
}:{
  address:string
dateAdded:string
typeOfScam:string
country:string
description:string
source:string
siteUrl:string
}) {
  return (
    <motion.section layout className=" w-[620px] py-2  border-2  rounded mx-auto ">
      <div className="border-b px-1.5">
        <div className="font-medium text-sm  text-blue-600">Address</div>
        <div className="pb-1.5">{address}</div>
      </div>
      <div className="grid grid-cols-2 border-b px-1">
        <div className="border-r pr-1.5 py-1">
          <div className="font-medium text-sm text-blue-600">Date Added</div>
          <div>{dateAdded}</div>
        </div>
        <div className="pl-1.5 py-1">
          <div className="font-medium text-sm text-blue-600">Type of Scam</div>
          <div>{typeOfScam}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b px-1.5">
        <div className="border-r pr-1.5 pt-1.5">
          <div className="font-medium text-sm text-blue-600">Country</div>
          <div>{country}</div>
        </div>
        <div className="pl-1.5">
          <div className="font-medium  text-sm pt-1.5 text-blue-600">
            Description
          </div>
          <div>{description}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 px-1.5">
        <div className="border-r pr-1.5">
          <div className="font-medium text-sm pt-1.5 text-blue-600">Source</div>
          <div>{source}</div>
        </div>
        <div className="pl-1.5">
          <div className="font-medium text-sm pt-1.5 text-blue-600">
            Site Url (if provided)
          </div>
          <div>{siteUrl}</div>
        </div>
      </div>
    </motion.section>
  );
}

export default ReportsPage;
