import { useContext, useState } from "react";
import { Handle, Position, useNodeId ,useReactFlow} from "reactflow";
import { ActionType, ContainerProvider } from "../../ContextProvider";
import { ContextMenu } from "@radix-ui/themes";
import toast from "react-hot-toast";

export default function CustomNodder({ data, isConnectable, selected,dragging,xPos,yPos }: any) {
    
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
                    <span className={`${!selected? "text-base text-white" : "text-xs "}`}>{
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