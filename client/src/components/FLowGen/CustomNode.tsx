import { useContext, useState } from "react";
import {
  Handle,
  MarkerType,
  Position,
  useNodeId,
  useReactFlow,
} from "reactflow";
import { ActionType, ContainerProvider } from "../../ContextProvider";
import { ContextMenu } from "@radix-ui/themes";
import toast from "react-hot-toast";
import axios from "axios";
import { SERVER_IP } from "../../utils/ServerConst";
import { useNavigate } from "react-router-dom";
function getRandomHighContrastColor() {
  // Generate random values for red, green, and blue components
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Calculate the luminance (brightness) of the color
  // using the formula Y = 0.299*R + 0.587*G + 0.114*B
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Check if the luminance is above a certain threshold
  // to ensure high contrast with black or white text
  const textColor = luminance > 128 ? "#000000" : "#FFFFFF";

  // Convert the RGB values to a hex string
  const colorHex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return { background: colorHex, text: textColor };
}
export default function CustomNodder({
  data,
  isConnectable,
  selected,
  dragging,
  xPos,
  yPos,
}: any) {
  const navigate = useNavigate();
  const nodeId = useNodeId();
  const reactFlowInstance = useReactFlow();

  const ContextData = useContext(ContainerProvider);

  const [isLocked, setIsLocked] = useState(false);

  const [isBlackList, setIsBlackList] = useState(false);
  const [isWhiteList, setIsWhiteList] = useState(false);
  const [isDetached, setIsDetached] = useState(false);

  return (
    <>
      {
        // data.isSource ==
        true && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ background: "#555" }}
            onConnect={(params) => console.log("handle onConnect", params)}
            isConnectable={
              ContextData?.state?.detachedNode.length &&
              ContextData?.state?.detachedNode.length > 0
                ? true
                : false
            }
          />
        )
      }
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          {/* <RightClickZone style={{ height: 150 }} /> */}

          <div
            className={`relative flex justify-center items-center flex-col ${
              isLocked ? "nodrag" : ""
            }`}
          >
            <div
              style={{
                opacity: isWhiteList ? 0.5 : 1,
                backgroundColor: isBlackList
                  ? "#F2545B"
                  : data.isSource
                  ? "#00d4ff"
                  : "#FAF6F0",
                filter: isLocked ? "brightness(20%)" : "",
              }}
              className="group: rounded-full h-10 w-10 flex justify-center items-center flex-col"
            >
              {data.IncomingTx != undefined ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-left-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={`bi bi-person `}
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                </svg>
              )}
            </div>
            <button
              style={{
                marginTop: "20px",
                opacity: isWhiteList ? 0.5 : 1,
              }}
              onClick={() => {
                if (data.IncomingTx != undefined) {
                  toast.success("Transaction ID Copied to Clipboard");
                  navigator.clipboard.writeText(data.label);
                } else {
                  toast.success("Address Copied to Clipboard");
                  navigator.clipboard.writeText(data.label);
                }
              }}
              className={`absolute top-full  ${
                selected && !dragging
                  ? "bg-white border-2 py-0.5 px-1 rounded-md"
                  : "cursor-default max-w-[52px] truncate text-blue-600"
              }`}
            >
              {/* <div className="bg-white"> */}

              {/* saddsadsasdadsadsjkhdsahkjjhkdsajhkdsajhkdsa */}
              <span className={`${!selected ? "text-base " : "text-xs "}`}>
                {data.label}
              </span>
              {/* </div> */}
            </button>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          {data.PropogationCompleted != true && (
            <>
              {" "}
              <ContextMenu.Item
                onClick={async () => {
                  const toasterloaderID = toast.loading(
                    "Loading Data From Backend"
                  );
                  if (data.IncomingTx != undefined) {
                    const OldNodes = reactFlowInstance.getNodes();
                    const OldEdges = reactFlowInstance.getEdges();
                    // this is an Tx , get All pariticipting Address
                    const Data = (
                      await axios(
                        `${SERVER_IP}/transaction/addr?parameters=${nodeId}&incoming=${data.IncomingTx}`
                      )
                    ).data;
                    // console.log(Data)
                    const CurrNode = OldNodes.filter(
                      (item) => item.id == nodeId
                    )[0];
                    const NewNodes = OldNodes.filter(
                      (item) => item.id !== nodeId
                    );
                    // console.log(CurrNode)

                    reactFlowInstance.setNodes([
                      ...NewNodes,
                      {
                        id: nodeId,
                        position: { x: xPos, y: yPos },
                        type: "selectorNode",
                        data: {
                          ...CurrNode.data,

                          // isSource: true,
                          // isDestiny: true,
                          // RandCol: getRandomHighContrastColor(),
                        },
                      },

                        
                      ...Data.map((NewAddress, index) => {
                        return {
                          type: "selectorNode",
                          id: NewAddress.address as string,
                          data: {
                            label: `${NewAddress.address}`,
                            isDestiny: true,
                          },
                          position: {
                            x:
                              Math.cos((2 * Math.PI * index) / Data.length) *
                                170 +
                              xPos,
                            y:
                              Math.sin((2 * Math.PI * index) / Data.length) *
                                170 +
                              yPos,
                          },
                        };
                      }),

                      // ...Data.data.filter((item) => item !== nodeId).map(
                      //   (NewData, index) => {
                      //     return {
                      //       type: "selectorNode",
                      //       id: NewData as string,
                      //       data: { label: `${NewData}`, isDestiny: true },
                      //       position: {
                      //         x:
                      //           Math.cos(
                      //             (2 * Math.PI * index) / Data.length
                      //           ) *
                      //             170 +
                      //           xPos,
                      //         y:
                      //           Math.sin(
                      //             (2 * Math.PI * index) / Data.length
                      //           ) *
                      //             170 +
                      //           yPos,
                      //       },
                      //     };
                      //   }
                      // ),
                    ]);

                    reactFlowInstance.setEdges([
                      ...OldEdges,
                      ...Data.map((NewAddress) => {
                        if (NewAddress.inputAddress) {
                          return {
                            id: `e${NewAddress.address}-${nodeId}`,
                            source: NewAddress.address as unknown as string,
                            target: nodeId,
                            animated: true,
                            style: {
                              strokeWidth: 2,
                              // stroke: '#FF0072',
                            },
                            markerStart: {
                              type: MarkerType.ArrowClosed,
                              width: 15,
                    height: 15,
                    color: "gray",
                            },
                          };
                        } else {
                          return {
                            id: `e${NewAddress.address}-${nodeId}`,
                            source: NewAddress.address as unknown as string,
                            target: nodeId,
                            animated: true,
                            style: {
                              strokeWidth: 2,
                              // stroke: '#FF0072',
                            },
                            markerEnd: {
                              type: MarkerType.ArrowClosed,
                              width: 15,
                              height: 15,
                              color: "gray",
                            },
                          };
                        }
                      }),
                    ]);
                  } else {
                    // Address
                    // toast.success("Clicking on Address")

                    const OldNodes = reactFlowInstance.getNodes();
                    const OldEdges = reactFlowInstance.getEdges();
                    // this is an Address , get All pariticipting TX
                    const Data = (
                      await axios(
                        `${SERVER_IP}/address/tx?parameters=${nodeId}`
                      )
                    ).data;
                    // console.log(Data)
                    const CurrNode = OldNodes.filter(
                      (item) => item.id == nodeId
                    )[0];
                    const NewNodes = OldNodes.filter(
                      (item) => item.id !== nodeId
                    );

                    reactFlowInstance.setNodes([
                      ...NewNodes,
                      {
                        id: nodeId,
                        position: { x: xPos, y: yPos },
                        type: "selectorNode",
                        data: {
                          ...CurrNode.data,
                        },
                      },

                      ...Data.map((NewAddress, index) => {
                        return {
                          type: "selectorNode",
                          id: NewAddress.id as string,
                          data: {
                            label: `${NewAddress.id}`,
                            isDestiny: true,
                            IncomingTx: NewAddress.IncomingTx,
                            value: `${((parseInt(NewAddress.value))/100000000).toFixed(2)} ETH`,
                          },
                          position: {
                            x:
                              Math.cos((2 * Math.PI * index) / Data.length) *
                                170 +
                              xPos,
                            y:
                              Math.sin((2 * Math.PI * index) / Data.length) *
                                170 +
                              yPos,
                          },
                        };
                      }),
                    ]);

                    reactFlowInstance.setEdges([
                      ...OldEdges,
                      ...Data.map((NewAddress) => {
                        if (NewAddress.IncomingTx) {
                          return {
                            id: `e${NewAddress.id}-${nodeId}`,
                            source: NewAddress.id as unknown as string,
                            target: nodeId,
                            animated: true,
                            label : `${((parseInt(NewAddress.value))/100000000).toFixed(2)} ETH`,
                            style: {
                              strokeWidth: 2,
                              // stroke: '#FF0072',
                            },
                            markerStart: {
                              type: MarkerType.ArrowClosed,
                              width: 15,
                              height: 15,
                              color: "gray",
                            },
                          };
                        } else {
                          return {
                            id: `e${NewAddress.id}-${nodeId}`,
                            source: NewAddress.id as unknown as string,
                            target: nodeId,
                            animated: true,
                            label : `${((parseInt(NewAddress.value))/100000000).toFixed(2)} ETH`,
                            style: {
                              strokeWidth: 2,
                              // stroke: '#FF0072',
                            },
                            markerEnd: {
                              type: MarkerType.ArrowClosed,
                              width: 15,
                              height: 15,
                              color: "gray",
                            },
                          };
                        }
                      }),
                    ]);
                  }
                  toast.success("Node Connection Suucesful", {
                    id: toasterloaderID,
                  });

                  /*
                  // ContextData?.dispatch({
                  //     type: ActionType.ADD_EXTENDERNODE,
                  //     payload: {
                  //         nodeId: nodeId,
                  //         XPosition: xPos,
                  //         YPosition: yPos
                  //     }
                  // })

                  // console.log(reactFlowInstance.getNodes())

                  let OldNodes = reactFlowInstance.getNodes();
                  let OldEdges = reactFlowInstance.getEdges();

                  function DelayExecuter() {
                    const tenpToadt = toast.loading(
                      "Fetching Address Info From Server ... Please Wait",
                      {}
                    );

                    if (nodeId == "1KqrDhH3jV98vRqXL2F8BGjGbRZqWMJ5c9") {
                      setTimeout(() => {
                        toast.success("Data Retrival Suucessful", {
                          id: tenpToadt,
                        });

                        // Detach The Node

                        const NewNodes = reactFlowInstance
                          .getNodes()
                          .filter((item) => item.id !== nodeId);
                        const OldEdges = reactFlowInstance.getEdges();
                        const BranchData = Array.from(
                          new Set(
                            KqrData.txs.map(
                              (tx: any, index: number) =>
                                tx.inputs[0].prev_out.addr
                            )
                          )
                        );
                        reactFlowInstance.setNodes([
                          ...NewNodes,
                          {
                            id: nodeId,
                            position: { x: xPos, y: yPos },
                            type: "selectorNode",
                            data: {
                              label: nodeId,
                              isSource: true,
                              isDestiny: true,
                              RandCol: getRandomHighContrastColor(),
                            },
                          },
                          ...BranchData.filter((item) => item !== nodeId).map(
                            (NewData, index) => {
                              return {
                                type: "selectorNode",
                                id: NewData as string,
                                data: { label: `${NewData}`, isDestiny: true },
                                position: {
                                  x:
                                    Math.cos(
                                      (2 * Math.PI * index) / BranchData.length
                                    ) *
                                      170 +
                                    xPos,
                                  y:
                                    Math.sin(
                                      (2 * Math.PI * index) / BranchData.length
                                    ) *
                                      170 +
                                    yPos,
                                },
                              };
                            }
                          ),
                        ]);

                        //  reactFlowInstance.setEdges([...OldEdges,{
                        //     id: `e${nodeId}-TempID`, source:  "TempID", target:nodeId, animated: true
                        //  }])

                        reactFlowInstance.setEdges([
                          ...OldEdges,
                          ...BranchData.filter((item) => item !== nodeId).map(
                            (NewData, index) => {
                              return {
                                id: `e${NewData}-${nodeId}`,
                                source: NewData as unknown as string,
                                target: nodeId,
                                animated: true,
                              };
                            }
                          ),
                        ]);
                        // let NewNode = reactFlowInstance.getNode(nodeId)?.data?.isSource
                        // let BranchData =  Array.from(new Set(KqrData.txs.map((tx:any,index:number)=>tx.inputs[0].prev_out.addr)))
                        // //    console.log(TesData)
                        //      let MapperData = BranchData.map((NewData, index) => {
                        //          return {
                        //              type: "selectorNode",
                        //              id: NewData as string,
                        //              data: { label: `${NewData}`,isSource: false },
                        //              position: {
                        //                  x: Math.cos(2 * Math.PI * index / BranchData.length) * 170 + xPos,
                        //                  y: Math.sin(2 * Math.PI * index / BranchData.length) * 170 + yPos,
                        //              },
                        //          }
                        //      })

                        //      console.log(MapperData)
                        //     //  @ts-ignore
                        //     //  MapperData.concat({ id: nodeId, position: { x: xPos, y: yPos }, type: "selectorNode", data: { label: data.address, isSource: true } })
                        //      reactFlowInstance.setNodes([...OldNodes,...MapperData,{
                        //         id: nodeId,
                        //         position: { x: xPos, y: yPos },
                        //         type: "selectorNode",
                        //         data: { label: nodeId, isSource: true }
                        //      }])

                        //      let TempEdge = MapperData.map((NewDataID, index) => {
                        //         return { id: `e${NewDataID.id}-${nodeId}source`, source: NewDataID.id as unknown as string, target: nodeId, animated: true }
                        //     })

                        //     console.log
                        //         reactFlowInstance.setEdges([...OldEdges,...TempEdge])
                        //     //  setNodes([...OldNodes,...MapperData])
                        //     //  setEdges([...OldEdges,...MapperData.map((NewDataID, index) => {
                        //         // return { id: `e${NewDataID.id}-source`, source: NewDataID.id as unknown as string, target: 'source', animated: true }
                        //     // })])
                      }, 2400);
                    } else if (nodeId == "13mHBgLwVBrZtpQ1JAndCkic4FBMPiuocB") {
                      setTimeout(() => {
                        toast.success("Data Retrival Suucessful", {
                          id: tenpToadt,
                        });

                        const NewNodes = reactFlowInstance
                          .getNodes()
                          .filter((item) => item.id !== nodeId);
                        const OldEdges = reactFlowInstance.getEdges();
                        const BranchData = Array.from(
                          new Set(
                            mHBData.txs.map(
                              (tx: any, index: number) =>
                                tx.inputs[0].prev_out.addr
                            )
                          )
                        );
                        reactFlowInstance.setNodes([
                          ...NewNodes,
                          {
                            id: nodeId,
                            position: { x: xPos, y: yPos },
                            type: "selectorNode",
                            data: {
                              label: nodeId,
                              isSource: true,
                              isDestiny: true,
                              RandCol: getRandomHighContrastColor(),
                            },
                          },
                          ...BranchData.filter((item) => item !== nodeId).map(
                            (NewData, index) => {
                              return {
                                type: "selectorNode",
                                id: NewData as string,
                                data: { label: `${NewData}`, isDestiny: true },
                                position: {
                                  x:
                                    Math.cos(
                                      (2 * Math.PI * index) / BranchData.length
                                    ) *
                                      170 +
                                    xPos,
                                  y:
                                    Math.sin(
                                      (2 * Math.PI * index) / BranchData.length
                                    ) *
                                      170 +
                                    yPos,
                                },
                              };
                            }
                          ),
                        ]);

                        //  reactFlowInstance.setEdges([...OldEdges,{
                        //     id: `e${nodeId}-TempID`, source:  "TempID", target:nodeId, animated: true
                        //  }])

                        reactFlowInstance.setEdges([
                          ...OldEdges,
                          ...BranchData.filter((item) => item !== nodeId).map(
                            (NewData, index) => {
                              return {
                                id: `e${NewData}-${nodeId}`,
                                source: NewData as unknown as string,
                                target: nodeId,
                                animated: true,
                              };
                            }
                          ),
                        ]);
                      }, 2400);
                    } else if (nodeId == "178bs9PcpiQbvk6t1vJRNBr85pofYYHiL7") {
                      setTimeout(() => {
                        toast.success("Data Retrival Suucessful", {
                          id: tenpToadt,
                        });

                        const NewNodes = reactFlowInstance
                          .getNodes()
                          .filter((item) => item.id !== nodeId);
                        const OldEdges = reactFlowInstance.getEdges();
                        const BranchData = Array.from(
                          new Set(
                            bs9Data.txs.map(
                              (tx: any, index: number) =>
                                tx.inputs[0].prev_out.addr
                            )
                          )
                        );
                        reactFlowInstance.setNodes([
                          ...NewNodes,
                          {
                            id: nodeId,
                            position: { x: xPos, y: yPos },
                            type: "selectorNode",
                            data: {
                              label: nodeId,
                              isSource: true,
                              isDestiny: true,
                              RandCol: getRandomHighContrastColor(),
                            },
                          },
                          ...BranchData.filter((item) => item !== nodeId).map(
                            (NewData, index) => {
                              return {
                                type: "selectorNode",
                                id: NewData as string,
                                data: { label: `${NewData}`, isDestiny: true },
                                position: {
                                  x:
                                    Math.cos(
                                      (2 * Math.PI * index) / BranchData.length
                                    ) *
                                      170 +
                                    xPos,
                                  y:
                                    Math.sin(
                                      (2 * Math.PI * index) / BranchData.length
                                    ) *
                                      170 +
                                    yPos,
                                },
                              };
                            }
                          ),
                        ]);

                        //  reactFlowInstance.setEdges([...OldEdges,{
                        //     id: `e${nodeId}-TempID`, source:  "TempID", target:nodeId, animated: true
                        //  }])

                        reactFlowInstance.setEdges([
                          ...OldEdges,
                          ...BranchData.filter((item) => item !== nodeId).map(
                            (NewData, index) => {
                              return {
                                id: `e${NewData}-${nodeId}`,
                                source: NewData as unknown as string,
                                target: nodeId,
                                animated: true,
                              };
                            }
                          ),
                        ]);
                      }, 2400);
                    } else {
                      setTimeout(() => {
                        // DelayExecuter()
                        toast.error("No Transaction Data Found on This Node", {
                          id: tenpToadt,
                        });
                        // toast.error("No Transaction Data Found on This Node")
                        // toast.dismiss()
                        // toast.dismiss(tenpToadt)
                      }, 1300);
                    }
                  }

                  DelayExecuter();
                  // setTimeout(()=>{

                  // },1300)
                  */
                }}
              >
                {data.IncomingTx != undefined
                  ? "View Addresses"
                  : "View All Tx "}
                {/* Explore This Node */}
              </ContextMenu.Item>
              {data.IncomingTx != undefined && (
                <ContextMenu.Item
                  onClick={() => {
                    navigate(`/transaction/` + data.label);
                  }}
                >
                  Get More Insight
                </ContextMenu.Item>
              )}
              <ContextMenu.Separator />
            </>
          )}

          <ContextMenu.Item
            onClick={() => {
              if (isLocked) {
                setIsLocked(false);
              } else {
                setIsLocked(true);
              }
            }}
          >
            {isLocked ? "Unlock This Node" : "Lock This Node"}
          </ContextMenu.Item>

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>Move Node To</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item
                onClick={() => {
                  if (isWhiteList) {
                    setIsWhiteList(false);
                    // setIsBlackList(false)
                  } else {
                    setIsBlackList(false);
                    setIsWhiteList(true);
                  }
                }}
              >
                {isWhiteList
                  ? "Remove From WhiteList"
                  : "Add Node to WhiteList"}
              </ContextMenu.Item>
              <ContextMenu.Item
                onClick={() => {
                  if (isBlackList) {
                    setIsBlackList(false);
                    // setIsWhiteList(false)
                  } else {
                    setIsWhiteList(false);
                    setIsBlackList(true);
                  }
                }}
              >
                {isBlackList
                  ? "Remove From BlackList"
                  : "Add Node to Suspicious List"}
              </ContextMenu.Item>
              {/* <ContextMenu.Separator />
        <ContextMenu.Item>Advanced options…</ContextMenu.Item> */}
            </ContextMenu.SubContent>
          </ContextMenu.Sub>

          <ContextMenu.Separator />
          {/* <ContextMenu.Item>Share</ContextMenu.Item> */}
          <ContextMenu.Item
            onClick={() => {
              setIsDetached(true);
              ContextData?.dispatch({
                type: ActionType.ADD_DETACHEDNODE,
                payload: nodeId,
              });
            }}
          >
            Detach Node
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item
            onClick={() => {
              ContextData?.dispatch({
                type: ActionType.ADD_DELETEDNODE,
                payload: nodeId,
              });
            }}
            color="red"
          >
            Delete Node
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      {/* <div>
            Custom Color Picker Node: <strong>{data.color}</strong>
          </div>
          <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} /> */}
      {/* <Handle
            type="source"
            position={Position.Right}
            id="a"
            style={{ top: 10, background: '#555' }}
            isConnectable={isConnectable}
          /> */}
      {
        // data.isDestiny==
        true && (
          <Handle
            type="source"
            position={Position.Bottom}
            id="b"
            style={{ background: "#555", }}
            isConnectable={isDetached ? true : false}
          />
        )
      }
    </>
  );
}
