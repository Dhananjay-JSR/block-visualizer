import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "./Main";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { SERVER_IP } from "../utils/ServerConst";
import { TransactionCopier } from "../components/DetailsScreen/TransactionCopier";
import { DataViewBlock } from "../components/DetailsScreen/DataViewBlock";
import { DownloadTableExcel } from "react-export-table-to-excel";
import axios from "axios";

export default function Transaction() {
  const { txid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [CoinType, setCoinType] = useState<"ETH" | "BTC" | null>(null);
  const [copy, setCopy] = useState(false);
  useEffect(() => {
    if (copy)
      setTimeout(() => {
        setCopy(false);
      }, 2000);
  }, [copy]);
  // if (loading)
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    (async () => {
      try {
        const ToaterID = toast.loading("Connection to BlockChain RPC");
        const SearchQuerry = await axios.get(
          SERVER_IP + "/search?parameters=" + txid
      );
        if (SearchQuerry.data.chain == "BTC") {
          setCoinType(() => "BTC");
        } else if (SearchQuerry.data.chain == "ETH") {
          setCoinType(() => "ETH");
        }

        if (SearchQuerry.data.type == "transaction") {
          const DataRequest = await axios.get(
            SERVER_IP + "/transaction?parameters=" + txid
          );
          toast.success("Data Fetched Success", {
            id: ToaterID,
          });
          setData(() => DataRequest.data);
         
          setLoading(false);
        } else {
          toast.success("Data Fetched Success", {
            id: ToaterID,
          });
          navigate("/graph/" + txid);
        }
      } catch (e) {
        alert("Error Occured While Fetch");
      }
    })();
    // fetch(`${SERVER_IP}/transaction?parameters=${txid}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     setData(data);
    //     setLoading(false);
    //   });
  }, []);
  // if (loading)
  //   return (
  //     <>
  //      <div>
  //       <Toaster />
  //     </div>

  //     </>
  //   );

  return (
    <>
      <div>
        <Toaster />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-black text-white text-2xl">
          Loading Data from Server Please Be Patient
        </div>
      ) : (
        <>
          {" "}
          <div className="min-h-screen flex flex-col  ">
            <Header />
            <div className="w-full grow bg-white flex  border border-t ">
              <div className="max-w-5xl h-full w-full mx-auto">
                <TransactionCopier type={CoinType} txid={txid} />

                <div className="px-2 mt-3">
                  <h2 className="text-lg font-semibold ">
                    Transaction Attributes
                  </h2>
                  <div className="rounded mt-3 border-2 border-[#dad3ff] grid grid-cols-2 ">
                    <DataViewBlock
                      title="Transaction Hash"
                      value={CoinType == "BTC" ? data.txid : data.hash}
                      showBorder
                      helperText=" A unique identifier for this Bitcoin transaction"
                    />
                    {CoinType == "BTC" && (
                      <DataViewBlock
                        title="Transaction Version"
                        value={data.version}
                        helperText="The version number of this Bitcoin transaction"
                      />
                    )}

                    {CoinType == "BTC" && (
                      <DataViewBlock
                        title="Transaction Size (Bytes)"
                        value={data.size}
                        showBorder
                        helperText="The size of the transaction in bytes"
                      />
                    )}
                    {CoinType == "BTC" && (
                      <DataViewBlock
                        title="Transaction Weight"
                        helperText="The weight of the transaction"
                        value={data.weight}
                      />
                    )}

                    {CoinType == "BTC" && (
                      <DataViewBlock
                        title="Transaction Fee (Satoshis)"
                        value={data.fee}
                        showBorder
                        helperText="Gass fee for this transaction in Satoshis"
                      />
                    )}
                    {CoinType == "ETH" && (
                      <DataViewBlock
                        title="Transaction Success"
                        value={data.success == true ? "True" : "False"}
                        showBorder
                        helperText="Is Transaction Success"
                      />
                    )}
                    {CoinType == "ETH" && (
                      <DataViewBlock
                        title="Transaction State"
                        value={data.state}
                        showBorder
                        helperText="State of Trasaction in Chain Net"
                      />
                    )}
                    {/* 
              <DataViewBlock
                title="Transaction Index"
                helperText="A unique index for this transaction"
                value={data.tx_index}
              /> */}

                    <DataViewBlock
                      title="Transaction Timestamp"
                      helperText="The timestamp of the transaction"
                      value={new Date(
                        CoinType == "BTC" ? data.time : data.timestamp * 1000
                      ).toUTCString()}
                    />
                  </div>
                </div>

                {CoinType=="ETH"&& <div className="px-2 mt-3">
                    <h2 className="text-lg mt-8 font-semibold text-black">
                      Transport Block Attribute
                    </h2>
                    <div className="rounded mt-3 border-2 border-[#dad3ff] grid grid-cols-2 ">
                    <DataViewBlock
                        title="Block Hash"
                        value={data.blockHash}
                        showBorder
                        helperText="Hash ID of Block"
                      />
                        <DataViewBlock
                        title="Block Number"
                        value={data.blockNumber}
                        showBorder
                        helperText="Block Number of Participating Block"
                      />
                      </div>
                  </div>}
                {CoinType == "BTC" && (
                  <div className="px-2 mt-3">
                    <h2 className="text-lg mt-8 font-semibold text-black">
                      Transport Network Attributes
                    </h2>
                    <div className="rounded mt-3 border-2 border-[#dad3ff] grid grid-cols-2 ">
                      <DataViewBlock
                        title="Lock Time"
                        value={data.locktime}
                        showBorder
                        helperText="The lock time for this transaction"
                      />
                      {/* <DataViewBlock
                title="Relayed By"
                helperText="The IP address that relayed this transaction"
                value={data.relayed_by}
              /> */}
                      <DataViewBlock
                        title="Double Spend"
                        value={data.double_spend == false ? "No" : "YES"}
                        showBorder
                        helperText="Indicates whether this transaction is a double spend"
                      />

                      <DataViewBlock
                        title="Block Index"
                        value={data.block.position}
                        showBorder
                        helperText="The index of the block in which this transaction is included"
                      />
                      <DataViewBlock
                        title="Block Height"
                        helperText="The height of the block in which this transaction is included"
                        value={data.block.height}
                      />
                      {/* <DataViewBlock title="" value={""} /> */}
                    </div>
                  </div>
                )}

                <div className="px-2 mt-3">
                  <h2 className="text-lg mt-8 font-semibold text-black">
                    Transaction Nodes Attributes
                  </h2>
                  <div className="rounded mt-3  border-2 border-[#dad3ff] grid grid-cols-2 ">
                    <DataViewBlock
                      title="Number of Input Transactions"
                      value={CoinType == "BTC" ? data.inputs.length : 1}
                      showBorder
                      helperText="The number of input transactions in this transaction"
                    />
                    <DataViewBlock
                      title="Number of Output Transactions"
                      helperText="The number of output transactions in this transaction"
                      value={CoinType == "BTC" ? data.outputs.length : 1}
                    />
                  </div>
                </div>

                {CoinType == "ETH" && (
                  <div className="px-2 mt-3">
                    <h2 className="text-lg mt-8 font-semibold text-black">
                      Gas Details
                    </h2>
                    <div className="rounded mt-3  border-2 border-[#dad3ff] grid grid-cols-2 ">
                      <DataViewBlock
                        title="Gas Price"
                        helperText="Gas Price Consumed in Transaction"
                        value={data.gasPrice}
                      />
                      <DataViewBlock
                        title="Gas Limit"
                        helperText="Gas Limit in Transaction"
                        value={data.gasLimit}
                      />
                      <DataViewBlock
                        title="Gas Used"
                        helperText="Gas Used in Transaction"
                        value={data.gasUsed}
                      />
                      <DataViewBlock title="" value={""} />
                    </div>
                  </div>
                )}

                {CoinType == "ETH" && (
                  <div className="px-2 mt-3">
                    <h2 className="text-lg mt-8 font-semibold text-black">
                      Data Transmitted
                    </h2>
                    <div className="rounded mt-3  border-2 border-[#dad3ff] grid grid-cols-1 ">
                      <DataViewBlock
                        title="Data"
                        helperText="SOlidity Data Transferred"
                        value={data.data}
                      />
                    </div>
                  </div>
                )}

                <div className="px-2 mt-3">
                  <h2 className="text-lg mt-8 font-semibold text-black">
                    Address Analysis
                  </h2>

                  {CoinType == "ETH" && (
                    <>
                      <div className="rounded mt-3   border-2 border-[#dad3ff]  ">
                        <div>
                          <div className="bg-[#f3f0ff]  pl-10 p-2">
                            Transaction Inputs
                          </div>
                          <table className="w-full ">
                            <thead>
                              <tr className="bg-blue-600 text-white">
                                <th className="font-normal">Index </th>
                                <th className="font-normal">Address </th>
                                <th className="font-normal">Trace </th>

                                {/* <th className="font-normal">Is Spent</th> */}
                                {/* <th className="font-normal">Address</th> */}
                              </tr>
                            </thead>
                            <tbody className="bg-[#f3f0ff]">
                              <tr>
                                <td className="text-center">1</td>
                                <td className="text-center"> {data.from}</td>
                                <td className="flex justify-center">
                                  <Link to={`/graph/${data.from}`}>
                                    <button>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-vignette"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z" />
                                        <path d="M8.5 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm1.683-6.281a.5.5 0 1 1-.866-.5.5.5 0 0 1 .866.5Zm-3.5 6.062a.5.5 0 1 1-.866-.5.5.5 0 0 1 .866.5Zm4.598-4.598a.5.5 0 1 1-.5-.866.5.5 0 0 1 .5.866Zm-6.062 3.5a.5.5 0 1 1-.5-.866.5.5 0 0 1 .5.866ZM11.5 8.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm-7 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm6.281 1.683a.5.5 0 1 1 .5-.866.5.5 0 0 1-.5.866Zm-6.062-3.5a.5.5 0 1 1 .5-.866.5.5 0 0 1-.5.866Zm4.598 4.598a.5.5 0 1 1 .866-.5.5.5 0 0 1-.866.5Zm-3.5-6.062a.5.5 0 1 1 .866-.5.5.5 0 0 1-.866.5Z" />
                                      </svg>
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                       
                </div>
                <div className="rounded mt-5   border-2 border-[#dad3ff]  ">
              {/* <div className="mt-5"> */}
              <div className="bg-[#f3f0ff]  pl-10 p-2">Transaction Outputs</div>
              <table className="w-full ">

              <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="font-normal">TX Index</th>
                    <th className="font-normal">Address</th>
                    <th className="font-normal">Trace</th>
                  </tr>
                </thead>
                <tbody className="bg-[#f3f0ff]">


                <tr>
                                <td className="text-center">1</td>
                                <td className="text-center"> {data.to}</td>
                                <td className="flex justify-center">
                                  <Link to={`/graph/${data.to}`}>
                                    <button>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-vignette"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z" />
                                        <path d="M8.5 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm1.683-6.281a.5.5 0 1 1-.866-.5.5.5 0 0 1 .866.5Zm-3.5 6.062a.5.5 0 1 1-.866-.5.5.5 0 0 1 .866.5Zm4.598-4.598a.5.5 0 1 1-.5-.866.5.5 0 0 1 .5.866Zm-6.062 3.5a.5.5 0 1 1-.5-.866.5.5 0 0 1 .5.866ZM11.5 8.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm-7 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm6.281 1.683a.5.5 0 1 1 .5-.866.5.5 0 0 1-.5.866Zm-6.062-3.5a.5.5 0 1 1 .5-.866.5.5 0 0 1-.5.866Zm4.598 4.598a.5.5 0 1 1 .866-.5.5.5 0 0 1-.866.5Zm-3.5-6.062a.5.5 0 1 1 .866-.5.5.5 0 0 1-.866.5Z" />
                                      </svg>
                                    </button>
                                  </Link>
                                </td>
                              </tr>

                  </tbody>
                </table>
                      </div>
                </>
                  )}

                  {CoinType == "BTC" && (
                    <>
                      <div className="rounded mt-3   border-2 border-[#dad3ff]  ">
                        <div>
                          <div className="bg-[#f3f0ff]  pl-10 p-2">
                            Transaction Inputs
                          </div>
                          <table className="w-full ">
                            <thead>
                              <tr className="bg-blue-600 text-white">
                                <th className="font-normal">Order </th>
                                <th className="font-normal">Wallet Type </th>
                                <th className="font-normal">Address</th>
                                <th className="font-normal">Sequence</th>
                                <th className="font-normal">Value (INR)</th>
                                <td></td>
                                {/* <th className="font-normal">Is Spent</th> */}
                                {/* <th className="font-normal">Address</th> */}
                              </tr>
                            </thead>
                            <tbody className="bg-[#f3f0ff]">
                              {data.inputs.map((input: any, index: number) => {
                                return (
                                  <tr className="border-b-2 border-[#dad3ff]">
                                    <td className="text-center py-2 ">
                                      {index}
                                    </td>
                                    <td className="text-center py-2 flex  gap-2 justify-center">
                                      {/* {(data.AddresRote.InAddress.filter((filterValue)=>{
                                if (filterValue.address[0].value==input.address){
                                    return true
                                }
                            })[0].address[0].entitities.map(tags=>{
                                return <div>{tags}</div>
                            }))} */}

                                      {data.AddresRote.InAddress.filter(
                                        (filterValue) => {
                                          if (
                                            filterValue.address[0].value ==
                                            input.address
                                          ) {
                                            return true;
                                          }
                                        }
                                      )[0].address[0].entitities.length == 0 ? (
                                        <div>NONE</div>
                                      ) : (
                                        data.AddresRote.InAddress.filter(
                                          (filterValue) => {
                                            if (
                                              filterValue.address[0].value ==
                                              input.address
                                            ) {
                                              return true;
                                            }
                                          }
                                        )[0].address[0].entitities.map(
                                          (tags: string) => {
                                            return (
                                              <div>
                                                {tags.includes("ANON")
                                                  ? "ANONYMOUS"
                                                  : tags}
                                              </div>
                                            );
                                          }
                                        )
                                      )}
                                    </td>
                                    <td className="text-center py-2 ">
                                      {input.address}
                                    </td>
                                    <td className="text-center py-2">
                                      {input.sequence}
                                    </td>
                                    <td className="text-center py-2">
                                      - Rs{" "}
                                      {parseFloat(
                                        satoshisToBTCAndUSD(
                                          parseInt(input.value),
                                          34685.12
                                        ).btc
                                      ) * 37_03_848.06}
                                    </td>
                                    {/* 
                          <td className="text-center py-2">
                            {input.prev_out.spent == false ? "No" : "YES"}
                          </td>
                          <td className="text-center py-2">
                            {input.prev_out.addr}
                          </td> */}
                                  </tr>
                                );
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
                            <tr className="bg-blue-600 text-white">
                              <th className="font-normal">TX Index</th>
                              <th className="font-normal">Wallet Type</th>
                              <th className="font-normal">Address</th>
                              <th className="font-normal">Is Spent</th>
                              <th className="font-normal">Value</th>
                              <th className="font-normal">Trace</th>
                            </tr>
                          </thead>
                          <tbody className="bg-[#f3f0ff]">
                            {data.outputs.map((input: any, index: number) => {
                              return (
                                <tr className="border-b-2 border-[#dad3ff]">
                                  <td className="text-center py-2 ">{index}</td>
                                  <td className="text-center py-2 flex  gap-2 justify-center">
                                    {data.AddresRote.OutAddress.filter(
                                      (filterValue) => {
                                        if (
                                          filterValue.address[0].value ==
                                          input.address
                                        ) {
                                          return true;
                                        }
                                      }
                                    )[0].address[0].entitities.length == 0 ? (
                                      <div>NONE</div>
                                    ) : (
                                      data.AddresRote.OutAddress.filter(
                                        (filterValue) => {
                                          if (
                                            filterValue.address[0].value ==
                                            input.address
                                          ) {
                                            return true;
                                          }
                                        }
                                      )[0].address[0].entitities.map(
                                        (tags: string) => {
                                          return (
                                            <div>
                                              {tags.includes("ANON")
                                                ? "ANONYMOUS"
                                                : tags}
                                            </div>
                                          );
                                        }
                                      )
                                    )}
                                  </td>
                                  <td className="text-center py-2 ">
                                    {input.address}
                                  </td>
                                  <td className="text-center py-2 ">
                                    {input.spent == true ? "TRUE" : "FALSE"}
                                  </td>
                                  <td className="text-center py-2 ">
                                    + Rs{" "}
                                    {parseFloat(
                                      satoshisToBTCAndUSD(
                                        parseInt(input.value),
                                        34685.12
                                      ).btc
                                    ) * 37_03_848.06}
                                  </td>
                                  {/* <td className="text-center py-2 ">
                          {
                            satoshisToBTCAndUSD(parseInt(input.value), 34685.12)
                              .btc
                          }
                        </td>
                        <td className="text-center py-2">
                          {input.spent == false
                            ? "No (likely not change)"
                            : "YES (likely change)"}
                        </td> */}
                                  <td className="text-center py-2 flex justify-center items-center gap-3">
                                    {input.addr}
                                    <Link to={`/graph/${input.address}`}>
                                      <button>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-vignette"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z" />
                                          <path d="M8.5 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm1.683-6.281a.5.5 0 1 1-.866-.5.5.5 0 0 1 .866.5Zm-3.5 6.062a.5.5 0 1 1-.866-.5.5.5 0 0 1 .866.5Zm4.598-4.598a.5.5 0 1 1-.5-.866.5.5 0 0 1 .5.866Zm-6.062 3.5a.5.5 0 1 1-.5-.866.5.5 0 0 1 .5.866ZM11.5 8.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm-7 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm6.281 1.683a.5.5 0 1 1 .5-.866.5.5 0 0 1-.5.866Zm-6.062-3.5a.5.5 0 1 1 .5-.866.5.5 0 0 1-.5.866Zm4.598 4.598a.5.5 0 1 1 .866-.5.5.5 0 0 1-.866.5Zm-3.5-6.062a.5.5 0 1 1 .866-.5.5.5 0 0 1-.866.5Z" />
                                        </svg>
                                      </button>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="h-10 mt-5 w-full text-right pt-2 px-2 text-lg text-white bg-[#19323C]">
          Team Snowden
        </div> */}
          </div>
        </>
      )}
    </>
  );
}
function satoshisToBTCAndUSD(satoshis: number, bitcoinPriceUSD: number) {
  // Convert Satoshis to BTC (1 BTC = 100,000,000 Satoshis)
  const btcAmount = satoshis / 100000000;

  // Calculate the approximate value in USD
  const usdValue = btcAmount * bitcoinPriceUSD;

  return {
    btc: btcAmount.toFixed(4), // Adjust the number of decimal places as needed
    usd: usdValue.toFixed(2), // Adjust the number of decimal places as needed
  };
}
