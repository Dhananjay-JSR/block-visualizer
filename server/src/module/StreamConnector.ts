import {client as WSClient} from 'websocket'
import { Stream} from 'stream'

const BTCClient = new WSClient();
let BTC_Confirmation = false;
let ETH_Confirmation = false;
const ETHStream = new Stream()
const BTCStream = new Stream()

const Connected_Client = new Set();
BTCClient.on("connect",(conn)=>{
    console.log("Host Peer Connected")
    conn.send(JSON.stringify({"coin":"btc","command":"subscribe","entity":"pending_transaction"}))
    conn.send(JSON.stringify({"coin":"eth","command":"subscribe","entity":"pending_transaction"}))
    try{
    conn.on("message",(msg)=>{
        if (msg.type === "utf8"){
            if (BTC_Confirmation==false ){
                let Response = JSON.parse(msg.utf8Data) as {success:boolean, entity:string, coin:string,message:string}
                if (Response.coin=="btc"){
                    if (Response.success){

                        console.log("BTC Peer Establishment Successfull")
                        BTC_Confirmation=true;
                    }else{
                        new Error("BTC Peer Establishment Failed")
                    }
                }               
            }else if (ETH_Confirmation==false){
                let Response = JSON.parse(msg.utf8Data) as {success:boolean, entity:string, coin:string,message:string}
                if (Response.coin=="eth"){
                    if (Response.success){
                        console.log("Etherium Peer Establishment Successfull")
                        ETH_Confirmation=true;
                    }else{
                        new Error("Etherium Peer Establishment Failed")
                    }
                }
            }
            else if (BTC_Confirmation && ETH_Confirmation){
                    let resp = (JSON.parse(msg.utf8Data))
                    if (resp.coin=="btc"&&BTCStream.listenerCount("data")!=0){
                            BTCStream.emit("data",resp)
                    }
                    if (resp.coin=="eth"&&ETHStream.listenerCount("data")!=0){
                        ETHStream.emit("data",resp)
                    }
            }
        }
    })

}
catch (e){
    console.error(e)
}
})
BTCClient.connect("wss://ws.blockchain.info/coins")

export {BTCStream,ETHStream,Connected_Client}
