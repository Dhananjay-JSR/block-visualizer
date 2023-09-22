import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './routes/Main.tsx'
import '@radix-ui/themes/styles.css';
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
import { Theme, ThemePanel } from '@radix-ui/themes';
import { ContainerContext, ContainerProvider } from './ContextProvider.tsx';

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
  <ContainerContext>

   <ReactFlowProvider>
    <Theme appearance="dark">
    {/* <ThemePanel /> */}
<RouterProvider router={router} />

      </Theme>
</ReactFlowProvider>
</ContainerContext>
  {/* <React.StrictMode>
  </React.StrictMode>, */}
  </>
)
