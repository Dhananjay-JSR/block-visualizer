import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './routes/Main.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Main from './routes/Main.tsx';
import Transaction from './routes/Transaction.tsx';
import GraphExplorer from './routes/Graph.tsx';
import { ReactFlowProvider } from 'reactflow';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
  },
  {
    path: "/transaction/:txid",
    element: <Transaction/>,
  },{
    path: "/graph/:addr",
    element: <GraphExplorer/>,
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
   <ReactFlowProvider>
<RouterProvider router={router} />
</ReactFlowProvider>
  {/* <React.StrictMode>
  </React.StrictMode>, */}
  </>
)
