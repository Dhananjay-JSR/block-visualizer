// eslint-disable 
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "./Main";
import DATARAW from '../assets/bc1qfqqed76qxqm2epmxlv7ywgjz8k6tk472pj7msn.json';
import KqrData from '../assets/1KqrDhH3jV98vRqXL2F8BGjGbRZqWMJ5c9.json'
import mHBData from '../assets/13mHBgLwVBrZtpQ1JAndCkic4FBMPiuocB.json'
import bs9Data from '../assets/178bs9PcpiQbvk6t1vJRNBr85pofYYHiL7.json'
import ReactFlow, { useNodesState, useEdgesState, addEdge, Edge, Node, Controls, MiniMap, Background, Connection, Handle, Position, Panel, useReactFlow, getRectOfNodes, getTransformForBounds, useNodeId } from 'reactflow';

import 'reactflow/dist/style.css';
import { toPng } from "html-to-image";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import { ContextMenu } from "@radix-ui/themes";
import { ActionType, ContainerProvider } from "../ContextProvider";
// const initialNodes = [
//     { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//     { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
export default function GraphExplorer() {

    const ContextData  = useContext(ContainerProvider)

    // console.log(ContextData?.state)


    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    // return (
    //   <div style={{ width: '100vw', height: '100vh' }}>
    //     <ReactFlow
    //       nodes={nodes}
    //       edges={edges}
    //       onNodesChange={onNodesChange}
    //       onEdgesChange={onEdgesChange}
    //       onConnect={onConnect}
    //     />
    //   </div>

    const Elements = Array(5).fill(0).map((_, i) => ({
        id: `${i + 1}`,
        data: { label: `Node ${i + 1}` },
        position: {
            x: Math.random() * window.innerWidth - 100,
            y: Math.random() * window.innerHeight,
        },
    }));
    let CenterNodeX = 350;
    let CenterNodeY = 150;
    const [data, setData] = useState<any>(null)

    React.useEffect(() => {
        // fetch(`https://blockchain.info/rawaddr/${addr}`).then((res)=>res.json()).then((data)=>{
        //     console.log(data)
        //     setData(data)
        //     setLoading(false)
        // })

        setTimeout(() => {
            setLoading(false)
            setData(DATARAW)
        }, 2700)
    }, [])
    // console.log(data.address)

    // const initialNodes: Node[] = 
    const initialNodes: Node[] = ([]
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

    const initialEdges: Edge[] = [...Elements.map((_, index) => {
        return { id: `e${index + 1}-source`, source: `${index + 1}`, target: 'source', animated: true }
    })]


    // );

    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        // const NewData = data.txs.map((tx:any,index:number)=>{
        //     return {
        //         id: `${index+1}`,
        //         data: { label: `Node ${index+1}` },
        //     }})
        //     console.log(NewData)
        if (data == null) return

       let BranchData =  Array.from(new Set(data.txs.map((tx:any,index:number)=>tx.inputs[0].prev_out.addr)))
    //    console.log(TesData)
        let MapperData = BranchData.map((NewData, index) => {
            return {
                type: "selectorNode",
                id: NewData as string,
                data: { label: `${NewData}`,isDestiny:true },
                position: {
                    x: Math.cos(2 * Math.PI * index / BranchData.length) * 170 + CenterNodeX,
                    y: Math.sin(2 * Math.PI * index / BranchData.length) * 170 + CenterNodeY,
                },
            }
        })
        setNodes([...MapperData, { id: 'source', position: { x: CenterNodeX, y: CenterNodeY }, type: "selectorNode", data: { label: data.address, isSource: true } }])
        setEdges([...MapperData.map((NewDataID, index) => {
            return { id: `e${NewDataID.id}-source`, source: NewDataID.id as unknown as string, target: 'source', animated: true }
        })])

    }, [data])


    useEffect(()=>{
        // console.log(ContextData?.state)
        setNodes((node)=>node.filter((item)=>!ContextData?.state.deletedNode.includes(item.id)))
        setEdges((edge)=>edge.filter((item)=>{
            return !ContextData?.state.detachedNode.includes(item.source as string) && !ContextData?.state.deletedNode.includes(item.target as string)
        }))

    },[ContextData?.state.deletedNode,ContextData?.state.detachedNode])

    // useEffect(()=>{

    //     if (ContextData?.state.extenderNode.nodeId == "") return
        
    //     const toastId = toast.loading('Loading...');


    //     setTimeout(() => {
    //         // console.log(ContextData?.state.extenderNode.nodeId)

    //         toast.success('Graph Data Fetched');
    //         setTimeout(()=>{
    //             toast.dismiss()
    //         },700)



    //     },1000)



    //     return ()=>{
    //         toast.dismiss(toastId)
    //     }

    // },[ContextData?.state.extenderNode])


    const nodeTypes = useMemo(() => ({ selectorNode: CustomNodder }), []);

    const onConnect = useCallback((params:Edge | Connection) => setEdges((eds) => addEdge( {
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        animated: true
    } as any   , eds)), [setEdges]);

    const { addr } = useParams<{ addr: string }>()
    const [loading, setLoading] = useState(true)

    if (loading)
        return (
            <>
                <div className="flex justify-center items-center h-screen bg-[#19323C] text-white text-lg">
                    Loading Data from Server Please Be Patient
                </div>
            </>
        );


    // console.log(data)

    return<><Toaster/> <div className="h-screen flex flex-col">
        <Header />
        <div className="w-full grow flex justify-center items-center ">

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView={true}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            >

                {/* <Panel position="top-right">top-left</Panel> */}
                <DownloadButton />
            </ReactFlow>
            <Controls />
            <MiniMap />
            {/* <Background variant="dots" gap={12} size={1} /> */}

        </div></div>
        </>


}

function CustomNodder({ data, isConnectable, selected,dragging,xPos,yPos }: any) {
    
    const nodeId = useNodeId();
    const reactFlowInstance = useReactFlow();


    const ContextData  = useContext(ContainerProvider)


   const [isLocked, setIsLocked] = useState(false)

    const [isBlackList, setIsBlackList] = useState(false)
    const [isWhiteList, setIsWhiteList] = useState(false)
    const [isDetached, setIsDetached] = useState(false)
    
    return (
        <>
            {
            // data.isSource ==
             true && <Handle
            
                type="target"
                position={Position.Top}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={ContextData?.state?.detachedNode.length && ContextData?.state?.detachedNode.length  > 0? true : false}
            />}
    <ContextMenu.Root>
    <ContextMenu.Trigger>
    {/* <RightClickZone style={{ height: 150 }} /> */}
  
            <div className= {`relative flex justify-center items-center flex-col ${isLocked? "nodrag" : ""}`}>

                <div style={{
                    opacity: isWhiteList? 0.5 : 1,
                    backgroundColor: isBlackList? "#F2545B" : data.isSource ? "#00d4ff" : "#19323C",
                    filter: isLocked? "brightness(20%)" : ""
                }} className="group: rounded-full h-10 w-10 flex justify-center items-center flex-col">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-person ${data.isSource? "" : "fill-white"}  `} viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                    </svg>

                </div>
                <button style={{
                    opacity: isWhiteList? 0.5 : 1,

                }} onClick={()=>{
                    toast.success("Address Copied to Clipboard")
                    navigator.clipboard.writeText(data.label)
                }} className={`absolute top-full  ${selected&&!dragging ? "bg-white border-2 py-0.5 px-1 rounded-md" :  "cursor-default max-w-[52px] truncate"}`}>

                    {/* saddsadsasdadsadsjkhdsahkjjhkdsajhkdsajhkdsa */}
                    <span className={`${!selected? "text-base" : "text-xs "}`}>{
                        data.label}</span>

                </button>
            </div>

            </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item  onClick={()=>{
        // ContextData?.dispatch({
        //     type: ActionType.ADD_EXTENDERNODE,
        //     payload: {
        //         nodeId: nodeId,
        //         XPosition: xPos,
        //         YPosition: yPos
        //     }
        // })

        // console.log(reactFlowInstance.getNodes())

        let OldNodes = reactFlowInstance.getNodes()
        let OldEdges = reactFlowInstance.getEdges()

 function DelayExecuter(){

    let tenpToadt = toast.loading("Fetching Address Info From Server ... Please Wait",{
        
    })


        if (nodeId== "1KqrDhH3jV98vRqXL2F8BGjGbRZqWMJ5c9"){
            setTimeout(()=>{

                toast.success("Data Retrival Suucessful",{
                    id:tenpToadt
                })


           
            // Detach The Node 

            let NewNodes = reactFlowInstance.getNodes().filter((item)=>item.id !== nodeId)
            let OldEdges = reactFlowInstance.getEdges()
            let BranchData =  Array.from(new Set(KqrData.txs.map((tx:any,index:number)=>tx.inputs[0].prev_out.addr)))
            reactFlowInstance.setNodes([...NewNodes,{
                id: nodeId,
                position: { x: xPos, y: yPos },
                type: "selectorNode",
                data: { label: nodeId, isSource: true,isDestiny:true,RandCol : getRandomHighContrastColor() }
             },...BranchData.filter((item)=>item !== nodeId).map((NewData, index) => {
                return {
                    type: "selectorNode",
                    id: NewData as string,
                    data: { label: `${NewData}`,isDestiny:true },
                    position: {
                        x: Math.cos(2 * Math.PI * index / BranchData.length) * 170 + xPos,
                        y: Math.sin(2 * Math.PI * index / BranchData.length) * 170 + yPos,
                    },
                }
            })])

            

            //  reactFlowInstance.setEdges([...OldEdges,{
            //     id: `e${nodeId}-TempID`, source:  "TempID", target:nodeId, animated: true
            //  }])

            reactFlowInstance.setEdges([...OldEdges,...BranchData.filter((item)=>item !== nodeId).map((NewData, index) => {
                return { id: `e${NewData}-${nodeId}`, source: NewData as unknown as string, target: nodeId, animated: true }
            })])



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
        },2400)
        }else if (nodeId=="13mHBgLwVBrZtpQ1JAndCkic4FBMPiuocB"){
            setTimeout(()=>{

                toast.success("Data Retrival Suucessful",{
                    id:tenpToadt
                })
           




            let NewNodes = reactFlowInstance.getNodes().filter((item)=>item.id !== nodeId)
            let OldEdges = reactFlowInstance.getEdges()
            let BranchData =  Array.from(new Set(mHBData.txs.map((tx:any,index:number)=>tx.inputs[0].prev_out.addr)))
            reactFlowInstance.setNodes([...NewNodes,{
                id: nodeId,
                position: { x: xPos, y: yPos },
                type: "selectorNode",
                data: { label: nodeId, isSource: true,isDestiny:true,RandCol : getRandomHighContrastColor() }
             },...BranchData.filter((item)=>item !== nodeId).map((NewData, index) => {
                return {
                    type: "selectorNode",
                    id: NewData as string,
                    data: { label: `${NewData}`,isDestiny:true },
                    position: {
                        x: Math.cos(2 * Math.PI * index / BranchData.length) * 170 + xPos,
                        y: Math.sin(2 * Math.PI * index / BranchData.length) * 170 + yPos,
                    },
                }
            })])

            //  reactFlowInstance.setEdges([...OldEdges,{
            //     id: `e${nodeId}-TempID`, source:  "TempID", target:nodeId, animated: true
            //  }])

            reactFlowInstance.setEdges([...OldEdges,...BranchData.filter((item)=>item !== nodeId).map((NewData, index) => {
                return { id: `e${NewData}-${nodeId}`, source: NewData as unknown as string, target: nodeId, animated: true }
            })])

        },2400)

        }else if (nodeId=="178bs9PcpiQbvk6t1vJRNBr85pofYYHiL7"){

            setTimeout(()=>{

            toast.success("Data Retrival Suucessful",{
                id:tenpToadt
            })
        

            let NewNodes = reactFlowInstance.getNodes().filter((item)=>item.id !== nodeId)
            let OldEdges = reactFlowInstance.getEdges()
            let BranchData =  Array.from(new Set(bs9Data.txs.map((tx:any,index:number)=>tx.inputs[0].prev_out.addr)))
            reactFlowInstance.setNodes([...NewNodes,{
                id: nodeId,
                position: { x: xPos, y: yPos },
                type: "selectorNode",
                data: { label: nodeId, isSource: true,isDestiny:true,RandCol : getRandomHighContrastColor() }
             },...BranchData.filter((item)=>item !== nodeId).map((NewData, index) => {
                return {
                    type: "selectorNode",
                    id: NewData as string,
                    data: { label: `${NewData}`,isDestiny:true },
                    position: {
                        x: Math.cos(2 * Math.PI * index / BranchData.length) * 170 + xPos,
                        y: Math.sin(2 * Math.PI * index / BranchData.length) * 170 + yPos,
                    },
                }
            })])

            //  reactFlowInstance.setEdges([...OldEdges,{
            //     id: `e${nodeId}-TempID`, source:  "TempID", target:nodeId, animated: true
            //  }])

            reactFlowInstance.setEdges([...OldEdges,...BranchData.filter((item)=>item !== nodeId).map((NewData, index) => {
                return { id: `e${NewData}-${nodeId}`, source: NewData as unknown as string, target: nodeId, animated: true }
            })])

        },2400)

        }else {
           

            setTimeout(()=>{
                // DelayExecuter()
                toast.error("No Transaction Data Found on This Node",{
                    id:tenpToadt
                })
                // toast.error("No Transaction Data Found on This Node")
                // toast.dismiss()
                // toast.dismiss(tenpToadt)
            },1300)
        }
    }



    DelayExecuter()
    // setTimeout(()=>{
        

    // },1300)
        
    }}>Explore This Node</ContextMenu.Item>
    {/* <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item> */}
    <ContextMenu.Separator />
    <ContextMenu.Item onClick={()=>{
        if (isLocked){
            setIsLocked(false)
        }
        else{

            setIsLocked(true)
        }
    }}>{isLocked ? "Unlock This Node" : "Lock This Node"}</ContextMenu.Item>

    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>Move Node To</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item onClick={()=>{
            if (isWhiteList){
                setIsWhiteList(false)
                // setIsBlackList(false)
            }else {
                setIsBlackList(false)
                setIsWhiteList(true)    
            }
        }}>{isWhiteList? "Remove From WhiteList" : "Add Node to WhiteList"}</ContextMenu.Item>
        <ContextMenu.Item onClick={()=>{
            if (isBlackList){

                setIsBlackList(false)
                // setIsWhiteList(false)
            }else {
                setIsWhiteList(false)
                setIsBlackList(true)
            }
        }}>{isBlackList? "Remove From BlackList" : "Add Node to Suspicious List"}</ContextMenu.Item>
        {/* <ContextMenu.Separator />
        <ContextMenu.Item>Advanced options…</ContextMenu.Item> */}
      </ContextMenu.SubContent>
    </ContextMenu.Sub>

    <ContextMenu.Separator />
    {/* <ContextMenu.Item>Share</ContextMenu.Item> */}
    <ContextMenu.Item onClick={()=>{
        setIsDetached(true)
        ContextData?.dispatch({
            type: ActionType.ADD_DETACHEDNODE,
            payload: nodeId
        })
    }}>Detach Node</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item  onClick={()=>{
            ContextData?.dispatch({
                type: ActionType.ADD_DELETEDNODE,
                payload: nodeId
            })
    }}  color="red">
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
            true && <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={{ background: '#555' }}
                isConnectable={isDetached?true:false}
            />}
        </>
    )
}



function downloadImage(dataUrl: string) {
    const a = document.createElement('a');

    a.setAttribute('download', 'tracer-graph.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
    const { getNodes } = useReactFlow();
    const onClick = () => {
        // we calculate a transform for the nodes so that all nodes are visible
        // we then overwrite the transform of the `.react-flow__viewport` element
        // with the style option of the html-to-image library
        const nodesBounds = getRectOfNodes(getNodes());
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
            backgroundColor: 'white',
            width: imageWidth,
            height: imageHeight,
            style: {
                width: imageWidth.toString(),
                height: imageHeight.toString(),
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        }).then(downloadImage);
    };

    return (
        <Panel position="top-right">
            <button className="font-semibold border-2 bg-white p-2 rounded-md hover:bg-gray-300 hover:transition-all  transition-all" onClick={onClick}>
                Save Graph Locally
            </button>
        </Panel>
    );
}


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
    const colorHex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  
    return { background: colorHex, text: textColor };
  }
  