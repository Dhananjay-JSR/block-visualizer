import React, { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "./Main";
import DATARAW from '../assets/bc1qfqqed76qxqm2epmxlv7ywgjz8k6tk472pj7msn.json'
import ReactFlow, { useNodesState, useEdgesState, addEdge, Edge, Node, Controls, MiniMap, Background, Connection, Handle, Position } from 'reactflow';

import 'reactflow/dist/style.css';
// const initialNodes = [
//     { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//     { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
export default function GraphExplorer() {


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
        id: `${i+1}`,
        data: { label: `Node ${i+1}` },
        position: {
            x: Math.random() * window.innerWidth - 100,
            y: Math.random() * window.innerHeight,
        },
    }));
    let CenterNodeX = 350;
    let        CenterNodeY = 150;
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
        }, 1000)
    }, [])
    // console.log(data.address)
 
                // const initialNodes: Node[] = 
                const initialNodes: Node[] = ([]
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

    const initialEdges:Edge[] = [...Elements.map((_,index)=>{
        return { id: `e${index+1}-source`, source: `${index+1}`, target: 'source' ,animated:true}
    })]
    
    
    // );
   
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(()=>{
        // const NewData = data.txs.map((tx:any,index:number)=>{
        //     return {
        //         id: `${index+1}`,
        //         data: { label: `Node ${index+1}` },
        //     }})
        //     console.log(NewData)
        if (data==null) return
        let MapperData = data.txs.map((NewData,index)=>{
            return {
                type: "selectorNode",
                id: `${index+1}`,
            data: { label: `${NewData.inputs[0].prev_out.addr}` },
            position: {
                x: Math.cos(2 * Math.PI * index / data.txs.length) * 170 + CenterNodeX,
                y: Math.sin(2 * Math.PI * index / data.txs.length) * 170 + CenterNodeY,
            },
            }
        })
        setNodes([...MapperData,{ id: 'source', position: { x: CenterNodeX, y: CenterNodeY },type: "selectorNode", data: { label: data.address,isSource:true } }])
        setEdges([...MapperData.map((_,index)=>{
            return { id: `e${index+1}-source`, source: `${index+1}`, target: 'source' ,animated:true}
        })])
    },[data])
    
    
                const nodeTypes = useMemo(() => ({ selectorNode: CustomNodder }), []);
   
    // const onConnect = useCallback((params:Edge | Connection) => setEdges((eds) => addEdge( params   , eds)), [setEdges]);
    
    const { addr } = useParams<{ addr: string }>()
    const [loading, setLoading] = useState(true)
   
    if (loading)
        return (
            <>
                <div className="flex justify-center items-center h-screen bg-[#00d4ff]">
                    Loading Data from Server Please Be Patient
                </div>
            </>
        );


    // console.log(data)
   
    return <div className="h-screen flex flex-col">
        <Header />
        <div className="w-full grow flex justify-center items-center ">

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView={true}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
            // onConnect={onConnect}
            />
            <Controls />
        <MiniMap />
        {/* <Background variant="dots" gap={12} size={1} /> */}

        </div></div>


} 

function CustomNodder({ data, isConnectable }:any) {
   
    return (
        <>
        {data.isSource==true&& <Handle
            type="target"
            position={Position.Top}
            style={{ background: '#555' }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
          />}
         
          <div className="flex justify-center items-center flex-col">

          <div style={{
            backgroundColor:data.isSource?"#00d4ff":"#ff0000"
          }} className=" rounded-full h-10 w-10 flex justify-center items-center flex-col">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
</svg>

          </div>
          <div className="max-w-[52px] truncate">
        
        {/* saddsadsasdadsadsjkhdsahkjjhkdsajhkdsajhkdsa */}
        <span>{
        data.label}</span>
        </div>
          </div>
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
          {data.isSource==null && <Handle
            type="source"
            position={Position.Right}
            id="b"
            style={{  background: '#555' }}
            isConnectable={isConnectable}
          />}
        </>
    )
}