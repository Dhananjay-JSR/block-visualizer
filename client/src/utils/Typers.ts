export interface BTCTrans {
    coin:        string;
    entity:      string;
    transaction: Transaction;
    recivedTime: string;
}

export interface Transaction {
    lock_time:  number;
    ver:        number;
    size:       number;
    inputs:     Input[];
    time:       number;
    tx_index:   number;
    vin_sz:     number;
    hash:       string;
    vout_sz:    number;
    relayed_by: string;
    out:        Out[];
}

export interface Input {
    address:  string;
    value:    number;
    sequence: number;
    prev_out: Out;
    script:   string;
}

export interface Out {
    spent:    boolean;
    tx_index: number;
    type:     number;
    addr:     string;
    value:    number;
    n:        number;
    script:   string;
}

export interface EthTrans {
    coin:        string;
    entity:      string;
    transaction: TransactionEth;
    recivedTime: string;
}

export interface TransactionEth {
    hash:             string;
    blockHash:        null;
    blockNumber:      null;
    from:             string;
    to:               string;
    contractAddress:  string;
    value:            string;
    nonce:            number;
    gasPrice:         string;
    gasLimit:         number;
    gasUsed:          number;
    data:             string;
    transactionIndex: number;
    success:          boolean;
    error:            string;
    firstSeen:        number;
    timestamp:        number;
    state:            string;
}

