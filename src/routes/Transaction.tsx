import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "./Main";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Transaction() {
    let { txid } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [copy, setCopy] = useState(false);
    useEffect(() => {
        if (copy)
            setTimeout(() => {
                setCopy(false)
            }, 2000)
    }, [copy])
    // if (loading)
    React.useEffect(() => {
        fetch(`https://blockchain.info/rawtx/${txid}?cors=true`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setData(data);
                setLoading(false);
            });
    }, []);
    if (loading)
        return (
            <>
                <div className="flex justify-center items-center h-screen bg-[#19323C] text-white text-2xl">
                    Loading Data from Server Please Be Patient
                </div>
            </>
        );

    return (
        <>
          <div><Toaster/></div>
           
            <div className="min-h-screen flex flex-col  ">
                <Header />
                <div className="w-full grow flex justify-center items-center ">
                    <div className="max-w-5xl h-full w-full">
                        <div className="text-sm mt-5 mb-7">
                            <div className="text-center text-xl font-semibold underline underline-offset-2 text-gray-500">Provided Transaction ID</div>
                            <div className="text-center mt-2 ">
                                <span>

                                    {txid}
                                </span>
                                <button className="ml-4" onClick={() => {
                                    if (txid && navigator.clipboard) {

                                        toast.success("Transaction ID Copied to your Clipboard")

                                        navigator.clipboard.writeText(txid)
                                    }
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" />
                                    </svg></button>
                            </div>

                            {/* <span className="text-[#807fff]">Provided Transaction ID</span>
              <span className="text-[#0027b1] ml-2">{txid}</span> */}
                        </div>

                        <h2 className="text-lg font-semibold text-[#001ea4]">
                            Transaction Attributes
                        </h2>
                        <div className="rounded mt-3 border-2 border-[#dad3ff] grid grid-cols-2 ">
                            <DataViewBlock
                                title="Transaction Hash"
                                value={data.block_index}
                                showBorder
                                helperText=" A unique identifier for this Bitcoin transaction"
                            />
                            <DataViewBlock
                                title="Transaction Version"
                                value={data.ver}
                                helperText="The version number of this Bitcoin transaction"
                            />
                            <DataViewBlock
                                title="Transaction Size (Bytes)"
                                value={data.size}
                                showBorder
                                helperText="The size of the transaction in bytes"
                            />
                            <DataViewBlock
                                title="Transaction Weight"
                                helperText="The weight of the transaction"
                                value={data.weight}
                            />

                            <DataViewBlock
                                title="Transaction Fee (Satoshis)"
                                value={data.fee}
                                showBorder
                                helperText="Gass fee for this transaction in Satoshis"
                            />

                            <DataViewBlock
                                title="Transaction Index"
                                helperText="A unique index for this transaction"
                                value={data.tx_index}
                            />

                            <DataViewBlock
                                title="Transaction Timestamp"
                                helperText="The timestamp of the transaction"
                                value={new Date(data.time * 1000).toUTCString()}
                            />
                            <DataViewBlock title="" value={""} />
                        </div>

                        <h2 className="text-lg mt-8 font-semibold text-[#001ea4]">
                            Transport Network Attributes
                        </h2>
                        <div className="rounded mt-3 border-2 border-[#dad3ff] grid grid-cols-2 ">
                            <DataViewBlock
                                title="Lock Time"
                                value={data.lock_time}
                                showBorder
                                helperText="The lock time for this transaction"
                            />
                            <DataViewBlock
                                title="Relayed By"
                                helperText="The IP address that relayed this transaction"
                                value={data.relayed_by}
                            />
                            <DataViewBlock
                                title="Double Spend"
                                value={data.double_spend == false ? "No" : "YES"}
                                showBorder
                                helperText="Indicates whether this transaction is a double spend"
                            />

                            <DataViewBlock
                                title="Block Index"
                                value={data.block_index}
                                showBorder
                                helperText="The index of the block in which this transaction is included"
                            />
                            <DataViewBlock
                                title="Block Height"
                                helperText="The height of the block in which this transaction is included"
                                value={data.block_height}
                            />
                            <DataViewBlock title="" value={""} />
                        </div>

                        <h2 className="text-lg mt-8 font-semibold text-[#001ea4]">
                            Block Attributes
                        </h2>
                        <div className="rounded mt-3 border-2 border-[#dad3ff] grid grid-cols-2 ">
                            <DataViewBlock
                                title="Block Index"
                                value={data.block_index}
                                showBorder
                                helperText="The index of the block in which this transaction is included"
                            />
                            <DataViewBlock
                                title="Block Height"
                                helperText="The height of the block in which this transaction is included"
                                value={data.block_height}
                            />


                        </div>

                        <h2 className="text-lg mt-8 font-semibold text-[#001ea4]">
                            Transaction Nodes Attributes
                        </h2>
                        <div className="rounded mt-3  border-2 border-[#dad3ff] grid grid-cols-2 ">

                            <DataViewBlock
                                title="Number of Input Transactions"
                                value={data.inputs.length}
                                showBorder
                                helperText="The number of input transactions in this transaction"
                            />
                            <DataViewBlock
                                title="Number of Output Transactions"
                                helperText="The number of output transactions in this transaction"
                                value={data.out.length}
                            />
                        </div>
                        <h2 className="text-lg mt-8 font-semibold text-[#001ea4]">
                            Address Analysis
                        </h2>


                        <div className="rounded mt-3   border-2 border-[#dad3ff]  ">
                            <div >
                                <div className="bg-[#f3f0ff]  pl-10 p-2">

                                    Transaction Inputs
                                </div>
                                <table className="w-full ">
                                    <thead>
                                        <tr className="bg-[#7e79a2] text-white">
                                        <th className="font-normal">Order </th>
                                            <th className="font-normal">TX Index</th>
                                            <th className="font-normal">Sequence</th>
                                            <th className="font-normal">Value</th>
                                            <th className="font-normal">Is Spent</th>
                                            <th className="font-normal">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.inputs.map((input: any,index:number) => {
                                            return (
                                                <tr className="border-b-2 border-[#dad3ff]">
                                                    <td className="text-center py-2 ">{index}</td>
                                                    <td className="text-center py-2 ">{input.prev_out.tx_index}</td>
                                                    <td className="text-center py-2">{input.sequence}</td>
                                                    <td className="text-center py-2">{satoshisToBTCAndUSD(parseInt(input.prev_out.value),34685.12).btc}</td>
                                                    <td className="text-center py-2">{input.prev_out.spent == false ? "No" : "YES"}</td>
                                                    <td className="text-center py-2">{input.prev_out.addr}</td>
                                                </tr>
                                            
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>


                            </div>
                            <div className="rounded mt-5   border-2 border-[#dad3ff]  ">

                         
                            {/* <div className="mt-5"> */}
                                <div className="bg-[#f3f0ff]  pl-10 p-2">

                                    Transaction Outputs
                                </div>
                                <table className="w-full ">
                                    <thead>
                                        <tr className="bg-[#7e79a2] text-white">
                                            <th className="font-normal">TX Index</th>
                                            <th className="font-normal">Amount</th>
                                            <th className="font-normal">Change Address</th>
                                            <th className="font-normal">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.out.map((input: any,index:number) => {
                                            return (
                                                <tr className="border-b-2 border-[#dad3ff]">
                                                    <td className="text-center py-2 ">
                                                        {index}
                                                    </td>
                                                    <td className="text-center py-2 ">
                                                       
                                                        {satoshisToBTCAndUSD(parseInt(input.value),34685.12).btc}
                                                    </td>
                                                    <td className="text-center py-2">
                                                        {input.spent == false ? "No (likely not change)" : "YES (likely change)"}
                                                    </td>
                                                    <td className="text-center py-2 flex justify-center items-center gap-3">
                                                        {input.addr}
                                                        <Link to={`/graph/${input.addr}`}>
                                                        <button>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-vignette" viewBox="0 0 16 16">
  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z"/>
  <path d="M8.5 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm1.683-6.281a.5.5 0 1 1-.866-.5.5.5 0 0 1 .866.5Zm-3.5 6.062a.5.5 0 1 1-.866-.5.5.5 0 0 1 .866.5Zm4.598-4.598a.5.5 0 1 1-.5-.866.5.5 0 0 1 .5.866Zm-6.062 3.5a.5.5 0 1 1-.5-.866.5.5 0 0 1 .5.866ZM11.5 8.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm-7 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm6.281 1.683a.5.5 0 1 1 .5-.866.5.5 0 0 1-.5.866Zm-6.062-3.5a.5.5 0 1 1 .5-.866.5.5 0 0 1-.5.866Zm4.598 4.598a.5.5 0 1 1 .866-.5.5.5 0 0 1-.866.5Zm-3.5-6.062a.5.5 0 1 1 .866-.5.5.5 0 0 1-.866.5Z"/>
</svg>
                                                        </button>
                                                        </Link>
                                                    </td>
                                                    {/* <td className="text-center py-2 ">{input.prev_out.tx_index}</td>
                                                    <td className="text-center py-2">{input.sequence}</td>
                                                    <td className="text-center py-2">{input.prev_out.value}</td>
                                                    <td className="text-center py-2">{input.prev_out.spent == false ? "No" : "YES"}</td>
                                                    <td className="text-center py-2">{input.prev_out.addr}</td> */}
                                                </tr>

                                            
                                            )
                                        })}
                                    </tbody>
                                </table>
                            {/* </div> */}
                            </div>
                      



                    </div>
                </div>
                <div className="h-10 mt-5 w-full text-right pt-2 px-2 text-lg text-white bg-[#19323C]">
          Team Snowden
        </div>
            </div>
        </>
    );
}
function satoshisToBTCAndUSD(satoshis:number, bitcoinPriceUSD:number) {
    // Convert Satoshis to BTC (1 BTC = 100,000,000 Satoshis)
    const btcAmount = satoshis / 100000000;
  
    // Calculate the approximate value in USD
    const usdValue = btcAmount * bitcoinPriceUSD;
  
    return {
      btc: btcAmount.toFixed(4), // Adjust the number of decimal places as needed
      usd: usdValue.toFixed(2) // Adjust the number of decimal places as needed
    };
  }

function DataViewBlock({
    title,
    value,
    showBorder = false,
    helperText,
}: {
    title: string;
    value: string;
    showBorder?: boolean;
    helperText?: string;
}) {
    const [showHelper, setShowHelper] = useState(false);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    return (
        <div
            className={`flex ${showBorder ? "border-r-2" : ""
                } border-[#dad3ff] border-b-2 p-3 `}
        >
            <div className="w-full relative text-[#13293D] ">
                <div
                    onMouseMove={(e) => {
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseEnter={() => {
                        setShowHelper(true);
                    }}
                    onMouseLeave={() => {
                        setShowHelper(false);
                    }}
                    className="w-fit hover:cursor-help"
                >
                    {title}
                    {showHelper && (
                        <div
                            style={{
                                left: mousePosition.x,
                                top: mousePosition.y,
                                position: "fixed",
                            }}
                            className=" m-8 inset-0 text-[#FECEE9] font-semibold bg-[#011C27] p-3 w-fit h-fit rounded-md z-50"
                        >
                            {helperText}
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full text-[#00057f]">{value}</div>
        </div>
    );
}
