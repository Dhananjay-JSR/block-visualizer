import axios from "axios"

let config = {
 
};

export function GETbtcTransactions(transactionID:string){
    return axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.blockchain.info/haskoin-store/btc/transaction/'+transactionID,
        headers: { 
          'authority': 'api.blockchain.info', 
          'accept': 'application/json, text/plain, */*', 
          'accept-language': 'en-US,en;q=0.9', 
          'cache-control': 'no-cache', 
          'origin': 'https://www.blockchain.com', 
          'pragma': 'no-cache', 
          'referer': 'https://www.blockchain.com/', 
          'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"', 
          'sec-ch-ua-mobile': '?0', 
          'sec-ch-ua-platform': '"Windows"', 
          'sec-fetch-dest': 'empty', 
          'sec-fetch-mode': 'cors', 
          'sec-fetch-site': 'cross-site', 
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        }
    })
}

export function GetInputOut(transactionID:string){
return axios.request({method: 'get',
maxBodyLength: Infinity,
url: 'https://api.oxt.me/txs/'+transactionID,
headers: { 
  'Accept': '*/*', 
  'Accept-Language': 'en-US,en;q=0.9', 
  'Cache-Control': 'no-cache', 
  'Connection': 'keep-alive', 
  'Origin': 'https://oxt.me', 
  'Pragma': 'no-cache', 
  'Referer': 'https://oxt.me/', 
  'Sec-Fetch-Dest': 'empty', 
  'Sec-Fetch-Mode': 'cors', 
  'Sec-Fetch-Site': 'same-site', 
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', 
  'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"', 
  'sec-ch-ua-mobile': '?0', 
  'sec-ch-ua-platform': '"Windows"'
}})

}

export function GetETHTrasction(address:string){
  return axios.request(
   {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.blockchain.info/v2/eth/data/transaction/'+address,
      headers: { 
        'authority': 'api.blockchain.info', 
        'accept': 'application/json, text/plain, */*', 
        'accept-language': 'en-US,en;q=0.9', 
        'cache-control': 'no-cache', 
        'origin': 'https://www.blockchain.com', 
        'pragma': 'no-cache', 
        'referer': 'https://www.blockchain.com/', 
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"', 
        'sec-ch-ua-mobile': '?0', 
        'sec-ch-ua-platform': '"Windows"', 
        'sec-fetch-dest': 'empty', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-site': 'cross-site', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }
    )
}


export function GetBTCAddress(address:string){
  return axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.blockchain.info/haskoin-store/btc/address/`+address+`/transactions?limit=100&offset=0`,
    headers: { 
      'authority': 'api.blockchain.info', 
      'accept': 'application/json, text/plain, */*', 
      'accept-language': 'en-US,en;q=0.9', 
      'cache-control': 'no-cache', 
      'origin': 'https://www.blockchain.com', 
      'pragma': 'no-cache', 
      'referer': 'https://www.blockchain.com/', 
      'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'cross-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
  })
  
}

export function GetAddressMetaData(List:string[]){
  return axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.blockchain.info/haskoin-store/btc/transactions?txids=${List.join(",")}`,
    headers: { 
      'authority': 'api.blockchain.info', 
      'accept': 'application/json, text/plain, */*', 
      'accept-language': 'en-US,en;q=0.9', 
      'cache-control': 'no-cache', 
      'origin': 'https://www.blockchain.com', 
      'pragma': 'no-cache', 
      'referer': 'https://www.blockchain.com/', 
      'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'cross-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
  })

}

export function SearchQuerryReq(searchParams:string){
let data = JSON.stringify({
  "search": searchParams
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://www.blockchain.com/explorer/search',
  headers: { 
    'authority': 'www.blockchain.com', 
    'accept': 'application/json, text/plain, */*', 
    'accept-language': 'en-US,en;q=0.9', 
    'cache-control': 'no-cache', 
    'content-type': 'application/json', 
    'cookie': 'clang=en; currency=USD; session_id=1702498406260', 
    'origin': 'https://www.blockchain.com', 
    'pragma': 'no-cache', 
    'referer': 'https://www.blockchain.com/explorer/search?search=0x3fa6d806609bcd5b86be4614e97976152ec78a99', 
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  data : data
};

return axios.request(config)

}

export function GetETHTrasactions(address:string){
  return axios({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.blockchain.info/v2/eth/data/account/'+address+'/wallet?page=0&size=100',
    headers: { 
      'authority': 'api.blockchain.info', 
      'accept': 'application/json, text/plain, */*', 
      'accept-language': 'en-US,en;q=0.9', 
      'cache-control': 'no-cache', 
      'origin': 'https://www.blockchain.com', 
      'pragma': 'no-cache', 
      'referer': 'https://www.blockchain.com/', 
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'cross-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }})
}

export function GETEthParticipationgAdd(TXID:string){
  return axios({
    method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.blockchain.info/v2/eth/data/transaction/'+TXID,
  headers: { 
    'authority': 'api.blockchain.info', 
    'accept': 'application/json, text/plain, */*', 
    'accept-language': 'en-US,en;q=0.9', 
    'cache-control': 'no-cache', 
    'origin': 'https://www.blockchain.com', 
    'pragma': 'no-cache', 
    'referer': 'https://www.blockchain.com/', 
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'cross-site', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
  })

}