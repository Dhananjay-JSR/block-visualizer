import {
  BTCStream,
  Connected_Client,
  ETHStream,
} from "./module/StreamConnector";
import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import {
  GetBTCAddress,
  GetAddressMetaData,
  GetInputOut,
  SearchQuerryReq,
  GETbtcTransactions,
  GetETHTrasction,
  GetETHTrasactions,
  GETEthParticipationgAdd,
} from "./module/BTCProxy";
import {
  EletrumGetBalance,
  EletrumGetListAddress,
  InfuraGetBLockCOunt,
  InfuraGetBalance,
  InfuraGetBlockByHash,
  InfuraGetBlockByNumber,
  InfuraGetCurrentBlock,
  InfuraGetGasPrice,
  InfuraGetLogs,
  InfuraGetTransaction,
  InfuraGetTransactionByHash,
  InfuraGetTransactionCount,
  InfuraGetTransactionReceipt,
  InfuraGetTransactionReceipts,
  InfuraMining,
} from "./module/RPC-Connectors";
import { db } from "../db/db";
import {
  Address,
  AddressType,
  ReportsQuerries,
  SearchHistory,
  TransactionQueries,
  TransactionType,
} from "../db/schema";
import { desc, eq } from "drizzle-orm";
import axios, { AxiosError } from "axios";
import process from "process";
import path from "path";
// import Reports from "../data.json"
import bodyParser from "body-parser";
import { Stream } from "stream";
const appBase = express();
const wsInstance = expressWs(appBase);

let { app } = wsInstance;

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

function safeToString(x: any) {
  switch (typeof x) {
    case "object":
      return "object";
    case "function":
      return "function";
    default:
      return x + "";
  }
}

app.use(express.static(path.join(process.cwd(), "..", "client", "dist")));

// app.use(express.static());

// Send US Address ID get Back Transaction
// @depreciated
app.get("/address", async (req, res) => {
  let AddressID = req.query.parameters as string;
  if (AddressID == undefined) {
    res.status(400).send("Bad Request");
    return;
  }
  const result: AddressType[] = await db
    .select()
    .from(Address)
    .where(eq(Address.address, AddressID));

  if (result.length == 0) {
    // Cache doesn't Exist Get Data from Upstream

    let TransactionsList = await GetBTCAddress(AddressID);
    let TxList = TransactionsList.data.map((tx: any) => tx.txid);
    let TxMetaData = await GetAddressMetaData(TxList);

    const MashedData = TxMetaData.data.map((txMeta: any) => {
      if (txMeta.inputs.some((e: any) => e.address == AddressID)) {
        return {
          id: txMeta.txid,
          IncomingTx: false,
        };
      }

      if (txMeta.outputs.some((e: any) => e.address == AddressID)) {
        return {
          id: txMeta.txid,
          IncomingTx: true,
        };
      }
    });
    let InstertResponse = await db.insert(Address).values({
      address: AddressID,
      json_data: MashedData,
    });

    if (InstertResponse.changes == 0) {
      res.status(500).send("Internal Server Error");
      return;
    } else if (InstertResponse.changes == 1) {
      res.status(201).send(MashedData);
      return;
    }
  } else {
    // Cache Exists
    let Data = result[0].json_data;
    res.status(200).json(Data);
    return;
  }
});

// This Route Gets Address ID and Return All Participating Transaction -> used in Graph
app.get("/address/tx", async (req, res) => {
  // Check if it's BTC
  let AddressID = req.query.parameters as string;
  if (AddressID == undefined) {
    res.status(400).send("Bad Request");
    return;
  }

  let CoinType = await axios.get(
    ("http://localhost:3000/search?parameters=" +
      req.query.parameters) as string
  );
  const CoinChain = CoinType.data.chain;
  // console.log(CoinChain)
  if (CoinChain == "BTC") {
    const result: AddressType[] = await db
      .select()
      .from(Address)
      .where(eq(Address.address, AddressID));

    if (result.length == 0) {
      // Cache doesn't Exist Get Data from Upstream
      let TransactionsList;
      try {
        TransactionsList = await GetBTCAddress(AddressID);
      } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status) {
          res.status(err.response.status).json({
            message: err.response.statusText,
            error: true,
          });
          return;
        }
      }

      let TxList = TransactionsList?.data.map((tx: any) => tx.txid);
      let TxMetaData = await GetAddressMetaData(TxList);
      const MashedData = TxMetaData.data.map((txMeta: any) => {
        if (txMeta.inputs.some((e: any) => e.address == AddressID)) {
          return {
            id: txMeta.txid,
            IncomingTx: false,
          };
        }

        if (txMeta.outputs.some((e: any) => e.address == AddressID)) {
          return {
            id: txMeta.txid,
            IncomingTx: true,
          };
        }
      });
      let InstertResponse = await db.insert(Address).values({
        address: AddressID,
        json_data: MashedData,
      });

      if (InstertResponse.changes == 0) {
        res.status(500).send("Internal Server Error");
        return;
      } else if (InstertResponse.changes == 1) {
        res.status(201).send(MashedData);
        return;
      }
    } else {
      // Cache Exists
      let Data = result[0].json_data;
      // @ts-ignore
      res.status(200).json(Data);
      return;
    }
  } else if (CoinChain == "ETH") {
    // console.log("Request Coming for ETH")
    // console.log(AddressID)
    const result: AddressType[] = await db
      .select()
      .from(Address)
      .where(eq(Address.address, AddressID));

    if (result.length == 0) {
      // console.log("DHANAAYA")
      let Data = await GetETHTrasactions(AddressID);
      // console.log("ComignReq",AddressID)
      // console.log(Data.data)
      let NewData = Data.data.accountTransactions.map((data: any) => {
        // if (parseInt(data.from,16)==parseInt(AddressID,16)){
        //   console.log("They are Equal")
        // }else{
        //   console.log("They are Not Equal")
        // }
        return {
          id: data.hash,
          value: data.value / 100000000,
          IncomingTx: parseInt(data.from, 16) != parseInt(AddressID, 16),
        };
      });
      let InstertResponse = await db.insert(Address).values({
        address: AddressID,
        json_data: NewData,
      });

      if (InstertResponse.changes == 0) {
        res.status(500).send("Internal Server Error");
        return;
      } else if (InstertResponse.changes == 1) {
        res.status(201).send(NewData);
        return;
      }
    } else {
      let Data = result[0].json_data;
      // @ts-ignore
      res.status(200).json(Data);
      return;
    }
  }
});

// This Route Received Tx ID and Return All Participating Address -> used in Graph
app.get("/transaction/addr", async (req, res) => {
  let TransactionID = req.query.parameters as string;
  try {
    // console.log(TransactionID)
    if (TransactionID == undefined) {
      res.status(400).send("Bad Request");
      return;
    }
    let CoinType = await axios.get(
      ("http://localhost:3000/search?parameters=" +
        req.query.parameters) as string
    );
    const CoinChain = CoinType.data.chain;
    // console.log(CoinChain)
    if (CoinChain == "BTC") {
      const result: TransactionType[] = await db
        .select()
        .from(TransactionQueries)
        .where(eq(TransactionQueries.transaction_id, TransactionID));

      if (result.length == 0) {
        // Cache doesn't Exist Get Data from Upstream
        let TransactionDetails = await GETbtcTransactions(TransactionID);
        let Data = await GetInputOut(TransactionID);
        let InAddres = Data.data.data[0].ins.map((e: any) => {
          return {
            address: e.addresses.map((f: any) => {
              return {
                labels: f.labels,
                value: f.value,
                entitities: f.entities.map((g: any) => g.value),
              };
            }),
            amount: e.amount,
          };
        });

        let OutAddres = Data.data.data[0].outs.map((e: any) => {
          return {
            address: e.addresses.map((f: any) => {
              return {
                labels: f.labels,
                value: f.value,
                entitities: f.entities.map((g: any) => g.value),
              };
            }),
            amount: e.amount,
          };
        });
        let InstertResponse = await db.insert(TransactionQueries).values({
          transaction_id: TransactionID,
          json_data: {
            ...TransactionDetails.data,
            AddresRote: {
              InAddress: InAddres,
              OutAddress: OutAddres,
            },
          },
        });

        if (InstertResponse.changes == 0) {
          res.status(500).send("Internal Server Error");
          return;
        } else if (InstertResponse.changes == 1) {
          res.status(201).json([
            ...Array.from(
              new Set(TransactionDetails.data.inputs.map((e: any) => e.address))
            ).map((e: any) => {
              return {
                address: e,
                inputAddress: true,
              };
            }),
            ...Array.from(
              new Set(
                TransactionDetails.data.outputs.map((e: any) => e.address)
              )
            ).map((e: any) => {
              return {
                address: e,
                inputAddress: false,
              };
            }),
          ]);
          // console.log(TransactionDetails.data)
          // res.status(201).send({...TransactionDetails.data,
          //     AddresRote:{
          //         InAddress: InAddres,
          //         OutAddress: OutAddres
          //     }})

          // res.status(201).json({
          //     inputs: [...new Set(TransactionDetails.data.inputs.map((e:any)=>e.address))],
          //     outputs: [...new Set(TransactionDetails.data.outputs.map((e:any)=>e.address))]
          //  })

          return;
        }
      } else {
        // Cache Exists
        let Data = result[0].json_data as any;
        // res.status(200).json(Data)
        //  res.status(200).json({
        //     inputs: [...new Set(Data.inputs.map((e:any)=>e.address))],
        //     outputs: [...new Set(Data.outputs.map((e:any)=>e.address))]
        //  })
        res.status(200).json([
          ...Array.from(new Set(Data.inputs.map((e: any) => e.address))).map(
            (e: any) => {
              return {
                address: e,
                inputAddress: true,
              };
            }
          ),
          ...Array.from(new Set(Data.outputs.map((e: any) => e.address))).map(
            (e: any) => {
              return {
                address: e,
                inputAddress: false,
              };
            }
          ),
        ]);
        return;
      }
    } else if (CoinChain == "ETH") {
      const result: TransactionType[] = await db
        .select()
        .from(TransactionQueries)
        .where(eq(TransactionQueries.transaction_id, TransactionID));
      let isIncomingALreadyAvaialble = req.query.incoming as string;

      if (result.length == 0) {
        let Data = await GETEthParticipationgAdd(TransactionID);
        let TransmittedData;

        if (isIncomingALreadyAvaialble == "true") {
          // console.log("THis shold execute")

          TransmittedData = [
            {
              address: Data.data.from,
              inputAddress: false,
            },
          ];
        } else {
          TransmittedData = [
            {
              address: Data.data.to,
              inputAddress: true,
            },
          ];
        }

        // [
        //   {
        //     address: Data.data.to,
        //     inputAddress: true,
        //   },
        //   {
        //     address: Data.data.from,
        //     inputAddress: false,
        //   },
        // ];

        let InstertResponse = await db.insert(TransactionQueries).values({
          transaction_id: TransactionID,
          json_data: TransmittedData,
        });

        if (InstertResponse.changes == 0) {
          res.status(500).send("Internal Server Error");
          return;
        } else if (InstertResponse.changes == 1) {
          res.status(201).json(TransmittedData);
          // console.log(TransactionDetails.data)
          // res.status(201).send({...TransactionDetails.data,
          //     AddresRote:{
          //         InAddress: InAddres,
          //         OutAddress: OutAddres
          //     }})

          // res.status(201).json({
          //     inputs: [...new Set(TransactionDetails.data.inputs.map((e:any)=>e.address))],
          //     outputs: [...new Set(TransactionDetails.data.outputs.map((e:any)=>e.address))]
          //  })

          return;
        }
      } else {
        let Data = result[0].json_data as any;
        console.log(Data);
        res.status(200).json(Data);
      }
    }
  } catch (e) {
    // @ts-ignore
    if (e.response?.status == 429) {
      return {
        Bal: EletrumGetBalance(TransactionID),
        Address: EletrumGetListAddress(TransactionID),
        BlockCOunt: InfuraGetBLockCOunt(),
        Balance: InfuraGetBalance(TransactionID),
        GetHash: InfuraGetBlockByHash(TransactionID),
        BLockID: InfuraGetBlockByNumber(TransactionID),
      };
    }
  }
});

app.get("/transaction", async (req, res) => {
  let TransactionID = req.query.parameters as string;
  try {
    if (TransactionID == undefined) {
      res.status(400).send("Bad Request");
      return;
    }

    let CoinType = await axios.get(
      "http://localhost:3000/search?parameters=" + TransactionID
    );
    let InAddres = null;
    let OutAddres = null;

    const result: TransactionType[] = await db
      .select()
      .from(TransactionQueries)
      .where(eq(TransactionQueries.transaction_id, TransactionID));

    if (result.length == 0) {
      // console.log("Hello WOrld")
      // Cache doesn't Exist Get Data from Upstream
      let TransactionDetails;
      // console.log(TransactionDetails)
      const COINTYPE = CoinType.data.chain;
      // console.log(COINTYPE);
      if (COINTYPE == "BTC") {
        TransactionDetails = await GETbtcTransactions(TransactionID);
        // Should Only Get Data if it's BTC
        let Data = await GetInputOut(TransactionID);

        InAddres = Data.data.data[0].ins.map((e: any) => {
          return {
            address: e.addresses.map((f: any) => {
              return {
                labels: f.labels,
                value: f.value,
                entitities: f.entities.map((g: any) => g.value),
              };
            }),
            amount: e.amount,
          };
        });

        OutAddres = Data.data.data[0].outs.map((e: any) => {
          return {
            address: e.addresses.map((f: any) => {
              return {
                labels: f.labels,
                value: f.value,
                entitities: f.entities.map((g: any) => g.value),
              };
            }),
            amount: e.amount,
          };
        });
      } else if (CoinType.data.chain == "ETH") {
        TransactionDetails = await GetETHTrasction(TransactionID);
      }

      if (TransactionDetails != undefined) {
        let InstertResponse = await db.insert(TransactionQueries).values({
          transaction_id: TransactionID,
          json_data: {
            ...TransactionDetails.data,
            AddresRote: {
              InAddress: InAddres,
              OutAddress: OutAddres,
            },
          },
        });

        if (InstertResponse.changes == 0) {
          res.status(500).send("Internal Server Error");
          return;
        } else if (InstertResponse.changes == 1) {
          // console.log(TransactionDetails.data)
          res.status(201).send({
            ...TransactionDetails.data,
            AddresRote: {
              InAddress: InAddres,
              OutAddress: OutAddres,
            },
          });
          return;
        }
      }
    } else {
      // Cache Exists
      let Data = result[0].json_data;
      res.status(200).json(Data);
      return;
    }
  } catch (e) {
    // @ts-ignore
    if (e.response?.status == 429) {
      return {
        EthHashNumber: InfuraGetTransaction(TransactionID),
        EthTransactionReceipt: InfuraGetTransactionReceipt(TransactionID),
        EthTransactionCount: InfuraGetTransactionCount(TransactionID),
        EthTransactionReceipts: InfuraGetTransactionReceipts(TransactionID),
      };
    }
  }

  // let TransactionDetails = await GETTransactions(TransactionID)
  // console.log(TransactionDetails.data)
  // await GETTransactions
});

// Send Us Trasacntion get All Partiicipating Input
app.get("/search", async (req, res) => {
  let SearchIDParams = req.query.parameters as string;
  // The App receives Data from the Client with Address
  //  Check weather it's a Address or Transaction ID
  if (SearchIDParams == undefined) {
    res.status(400).send("Bad Request");
    return;
  }
  // First We Check DB for Cache
  try {
    const SearchHistoryRes = await db
      .select()
      .from(SearchHistory)
      .where(eq(SearchHistory.search_term, SearchIDParams));

    if (SearchHistoryRes.length == 0) {
      // ^ DB is empty , Fill the Data
      const SearchQueryResult = (await SearchQuerryReq(SearchIDParams)).data;
      if (SearchQueryResult.message == "No Data Found") {
        return res.status(404).json({
          message: "No Data Found",
          error: true,
        });
      }
      const SearchQuerryResult =
        (await SearchQuerryReq(SearchIDParams)).data.length != 0
          ? (await SearchQuerryReq(SearchIDParams)).data[0]
          : null;
      if (SearchQuerryResult == null) {
        // No Data is accociated with the Search ID
        res.status(404).json({
          message: "No Data Found",
          error: true,
        });
        return;
      } else {
        // Data is Found -> Push to DB
        let InsertData = await db.insert(SearchHistory).values({
          search_term: SearchIDParams,
          json_data: SearchQueryResult,
        });

        if (InsertData.changes == 0) {
          // DB Error
          res.status(500).send("Internal Server Error");
          return;
        } else if (InsertData.changes == 1) {
          // Insertion Success -> Send Data to Client
          //START--- DUP CODE
          if (
            SearchQuerryResult.chain == "BTC" ||
            SearchQuerryResult.chain == "ETH"
          ) {
            // We are only allowing BTC and ETH for now
            // Next We Search for Type
            // console.log(SearchQuerryResult.type)
            if (SearchQuerryResult.type == "address") {
              res.status(200).json({
                type: "address",
                error: false,
                chain: SearchQuerryResult.chain,
              });
              return;
              // this should have a Feature Flag to Redirect to Graph Screen
            } else if (SearchQuerryResult.type == "transaction") {
              // this should send user to Transaction Screen
              res.status(200).json({
                type: "transaction",
                error: false,
                chain: SearchQuerryResult.chain,
              });
              return;
            }
          } else {
            // Chain Not Supported
            res.status(400).json({
              message: "Chain Not Supported",
              error: true,
            });
            return;
          }

          //END--- DUP CODE
        }
      }
    } else {
      // Cache Ecist just Querry from DB
      const SearchQueryResult = SearchHistoryRes[0].json_data as any;
      //START--- DUP CODE
      const SearchQuerryResult = SearchQueryResult[0];
      if (
        SearchQuerryResult.chain == "BTC" ||
        SearchQuerryResult.chain == "ETH"
      ) {
        // We are only allowing BTC and ETH for now
        // Next We Search for Type
        if (SearchQuerryResult.type == "address") {
          res.status(200).json({
            type: "address",
            error: false,
            chain: SearchQuerryResult.chain,
          });
          return;
          // this should have a Feature Flag to Redirect to Graph Screen
        } else if (SearchQuerryResult.type == "transaction") {
          // this should send user to Transaction Screen
          res.status(200).json({
            type: "transaction",
            error: false,
            chain: SearchQuerryResult.chain,
          });
          return;
        }
      } else {
        // Chain Not Supported
        res.status(400).json({
          message: "Chain Not Supported",
          error: true,
        });
        return;
      }
    }
  } catch (e) {
    return res.status(404).json({
      message: "No Data Found",
      error: true,
    });
  }
});

const LiveReportsStream = new Stream();

app.ws("/liveReports", (ws, res) => {
  const Handler = () => {
    ws.send(
      JSON.stringify({
        newEntry: true,
      })
    );
  };
  LiveReportsStream.on("data", Handler);

  LiveReportsStream.on("close", () => {
    LiveReportsStream.removeListener("data", Handler);
  });
});

app.ws("/btc", (ws, req) => {
  const Handler = (data: any) => {
    ws.send(JSON.stringify(data));
  };
  BTCStream.on("data", Handler);

  ws.on("close", () => {
    BTCStream.removeListener("data", Handler);
  });
});

app.ws("/eth", (ws, req) => {
  const Handler = (data: any) => {
    ws.send(JSON.stringify(data));
  };
  ETHStream.on("data", Handler);

  ws.on("close", () => {
    ETHStream.removeListener("data", Handler);
  });
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/report/latest", async (req, res) => {
  let result = await db
    .select()
    .from(ReportsQuerries)
    .orderBy(desc(ReportsQuerries.id))
    .limit(3);
  res.status(200).json(result);
});

app.get("/report", async (req, res) => {
  let id = req.query.id as string;
  if (id) {
    let result = await db
      .select()
      .from(ReportsQuerries)
      .where(eq(ReportsQuerries.WAddress, id));
    return res.status(200).json(result.splice(0, 1));
  }
});

app.post("/report", async (req, res) => {
  let ReportBody = req.body;
  let InstertResponse = await db
    .insert(ReportsQuerries)
    .values({
      WAddress: ReportBody.address,
      DateAdded: ReportBody.dateAdded,
      ScamType: ReportBody.typeOfScam,
      Country: ReportBody.country,
      Description: ReportBody.description,
      Source: ReportBody.source,
      SiteUrl: ReportBody.siteURL,
    })
    .execute();

  if (InstertResponse.changes == 0) {
    res.status(500).send("Internal Server Error");
    return;
  } else if (InstertResponse.changes == 1) {
    LiveReportsStream.emit("data");
    res.status(201).send("Report Added");
    return;
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "..", "client", "dist", "index.html"));
});

app.listen(3000, () => {
  console.log("Server Started on 3000");
});
