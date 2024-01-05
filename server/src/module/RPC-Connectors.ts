import axios from "axios";

const rpcuser = "dhananjay";
const rpcpassword = "qwerty123";
const url = "'http://127.0.0.1:7777'";
const gatewayURL = "https://eth.dhananjaay.dev"

export function EletrumGetBalance(IncomingId: string) {
  return axios.post(
    url,
    {
      jsonrpc: "2.0",
      id: IncomingId,
      method: "getbalance",
      params: [],
    },
    {
      auth: {
        username: rpcuser,
        password: rpcpassword,
      },
    }
  );
}

export function EletrumGetListAddress(IncomingId: string) {
  return axios.post(
    url,
    {
      jsonrpc: "2.0",
      id: IncomingId,
      method: "listaddresses",
      params: [
        {
          funded: true,
        },
      ],
    },
    {
      auth: {
        username: rpcuser,
        password: rpcpassword,
      },
    }
  );
}

export function InfuraMining(){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_mining',
        params: [],
        id: 71
    })
}

export function InfuraGetGasPrice(){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 73
    })
}

export function InfuraGetBLockCOunt(){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 74
    })
}

export function InfuraGetCurrentBlock(){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest',false],
        id: 75
    })
}

export function InfuraGetTransactionReceipt(txid:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txid],
        id: 76
    })
}


export function InfuraGetTransaction(txid:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [txid],
        id: 77
    })
}

export function InfuraGetBalance(address:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address,'latest'],
        id: 78
    })
}

export function InfuraGetTransactionCount(address:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [address,'latest'],
        id: 79
    })
}

export function InfuraSendRawTransaction(rawtx:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_sendRawTransaction',
        params: [rawtx],
        id: 80
    })
}

export function InfuraGetBlockByNumber(blockNumber:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: [blockNumber,false],
        id: 81
    })
}

export function InfuraGetBlockByHash(blockHash:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getBlockByHash',
        params: [blockHash,false],
        id: 82
    })
}

export function InfuraGetLogs(address:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [{
            address: address
        }],
        id: 83
    })
}

export function InfuraGetTransactionReceipts(txid:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txid],
        id: 84
    })
}

export function InfuraGetTransactionByHash(txid:string){
    return axios.post(gatewayURL,{
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [txid],
        id: 85
    })
}


