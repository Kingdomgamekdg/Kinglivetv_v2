/* eslint-disable prefer-const */
import { log, BigInt } from "@graphprotocol/graph-ts";

import { List, Buy, Bid , UpdateBid, UpdateItem, AcceptBid } from '../../generated/KingLiveMarket/KingLiveMarket';
import { AcceptBidLogs, BidLogs, BuyLogs, ListLogs , CancelListedLogs, CancelBidLogs} from '../../generated/schema';

const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Creates list
 */
 

function createList(contract: string, owner: string,listId : BigInt,collection: string ,assetId: BigInt ,quantity: BigInt,mask: i32 ,price: BigInt,paymentToken: string ,expiration: BigInt ,transaction: string ,time: BigInt ,logIndex: BigInt): void {
    let data = new ListLogs(transaction + '_' + logIndex.toString() + '_' + assetId.toString());
    data.contract = contract;
    data.collection = collection;
    data.owner = owner;
    data.listId = listId;
    data.assetId = assetId;
    data.quantity = quantity;
    data.mask = mask;
    data.price = price;
    data.paymentToken = paymentToken;
    data.expiration =expiration;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.save();
}



function createBuy(contract: string,from: string, to: string,listId : BigInt,paymentToken: string,paymentAmount: BigInt,amount :BigInt  ,transaction: string ,time: BigInt ,logIndex: BigInt): void {
    let data = new BuyLogs(transaction + '_' + logIndex.toString());
    data.contract = contract;
    data.listId = listId;
    data.fromAddress = from;
    data.toAddress = to;
    data.quantity = amount;
    data.paymentAmount = paymentAmount;
    data.paymentToken = paymentToken;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.save();
}


function createBid(contract: string,from : string , to :string ,bidOrderId: BigInt,listId : BigInt,paymentToken: string,paymentPrice: BigInt,amount :BigInt ,expiration:BigInt ,transaction: string ,time: BigInt ,logIndex: BigInt): void {
    let data = new BidLogs(transaction + '_' + logIndex.toString());
    data.contract = contract;
    data.listId = listId;
    data.fromAddress = from;
    data.toAddress = to;
    data.bidOrderId = bidOrderId;
    data.quantity = amount;
    data.bidPrice = paymentPrice;
    data.bidToken = paymentToken;
    data.expiration = expiration;
    data.status = 1;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.save();
}


// export function handleTransferSingle (event: TransferSingle): void {
//     let collectionId = event.address.toHex();
//     let assetId = event.params._id;
//     let from = event.params._from.toHex();
//     let to = event.params._to.toHex();
//     let amount = event.params._amount;
//     let transaction = event.transaction.hash.toHex();
//     let time = event.block.timestamp;
//     let logIndex = event.transactionLogIndex;

//     log.info('Transfer asset (erc1155), collection: {}, from: {}, to: {}, asset_id: {}, value: {}', [collectionId, from, to, assetId.toString(), amount.toString()]);


//     if (from != GENESIS_ADDRESS && from != collectionId && to!= collectionId)
//     {
//         createTransfer(collectionId, assetId, from, to, amount, transaction, time, logIndex);
//     }
// }

/**
 * Handle event for minting assets
 */
export function handleList (event : List): void {
    let contract = event.address.toHex();
    let listId = event.params._orderId;
    let owner = event.params._owner.toHex();;
    let collection = event.params._tokenAddress.toHex();
    let assetId = event.params.tokenId;
    let paymentToken = event.params._paymentToken.toHex();
    let paymentAmount= event.params._price;
    let amount = event.params._quantity;
    let mask = event.params._mask.toI32();
    let expiration = event.params._expiration;
    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;

    log.info('List asset, asset: {}, amount: {}, price: {}', [assetId.toString(), amount.toString(), paymentAmount.toString()]);


    // for (let i = 0; i < length; i++) {
        createList(contract,owner , listId ,collection ,assetId,amount,mask,paymentAmount,paymentToken ,expiration ,transaction,time,logIndex);
    // }
}


export function handleBuy (event : Buy): void {
    let contract = event.address.toHex();
    let listId = event.params._itemId;
    let from = event.params._from.toHex();;
    let to = event.params._to.toHex();
    let paymentToken = event.params._paymentToken.toHex();
    let paymentAmount= event.params._paymentAmount;
    let amount = event.params._quantity;
    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;

    log.info('List asset, listId: {}, paymentToken: {}, paymentAmount: {}', [listId.toString(), paymentToken.toString(), paymentAmount.toString()]);


    // for (let i = 0; i < length; i++) {
        createBuy(contract,from,to ,listId,paymentToken ,paymentAmount,amount ,transaction,time,logIndex);
    // }
}



export function handleBid (event : Bid): void {
    let contract = event.address.toHex();
    let listId = event.params._itemId;
    let from = event.params._from.toHex();
    let to = event.params._to.toHex();
    let bidOrderId = event.params._bidId;
    let paymentToken = event.params._bidToken.toHex();
    let paymentPrice= event.params._bidPrice;
    let amount = event.params._quantity;
    let expiration = event.params._expiration;
    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;

    log.info('List asset, listId: {}, paymentToken: {}, paymentAmount: {}', [listId.toString(), paymentToken.toString(), paymentPrice.toString()]);


    // for (let i = 0; i < length; i++) {
        createBid(contract,from, to,bidOrderId ,listId ,paymentToken ,paymentPrice,amount,expiration ,transaction,time,logIndex);
    // }
}


function createUpdateBid(contract: string, from: string,bidOrderId: BigInt,paymentToken: string,paymentPrice: BigInt,amount :BigInt ,status : i32,expiration:BigInt ,transaction: string ,time: BigInt ,logIndex: BigInt): void {
    let data = new BidLogs(transaction + '_' + logIndex.toString());
    data.contract = contract;
    data.bidOrderId = bidOrderId;
    data.fromAddress = from;
    data.quantity = amount;
    data.bidPrice = paymentPrice;
    data.bidToken = paymentToken;
    data.expiration = expiration;
    data.status = status;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.save();
}



export function handleUpdateBid (event : UpdateBid): void {
    let contract = event.address.toHex();
    let bidOrderId = event.params._bidId;
    let from = event.params._from.toHex();;
    let paymentToken = event.params._bidToken.toHex();
    let paymentPrice= event.params._bidPrice;
    let amount = event.params._quantity;
    let status = event.params._status.toI32();
    let expiration = event.params._expiration;
    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;

    log.info('Update bid, bidOrderId: {}, status: {}', [bidOrderId.toString(), status.toString()]);


    // for (let i = 0; i < length; i++) {
        createUpdateBid(contract, from ,bidOrderId  ,paymentToken ,paymentPrice,amount,status,expiration ,transaction,time,logIndex);
    // }
}


function createAcceptBid(contract: string, from: string, to: string,bidOrderId: BigInt,isAccept: boolean ,transaction: string ,time: BigInt ,logIndex: BigInt): void {
    let data = new AcceptBidLogs(transaction + '_' + logIndex.toString());
    data.contract = contract;
    data.fromAddress = from;
    data.toAddress = to;
    data.bidOrderId = bidOrderId;
    data.isAccept = isAccept;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.save();
}


export function handleAcceptBid (event : AcceptBid): void {
    let contract = event.address.toHex();
    let from = event.params._from.toHex();
    let to = event.params._to.toHex();
    let bidOrderId = event.params._bidOrderId;
    let isAccept = event.params._result;
    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;

    log.info('accept bid, bidOrderId: {}, isAccept: {}', [bidOrderId.toString(), isAccept.toString()]);


    // for (let i = 0; i < length; i++) {
        createAcceptBid(contract,from , to,bidOrderId  ,isAccept ,transaction,time,logIndex);
    // }
}


function createCancelBid(contract: string, from: string, to: string,bidOrderId: BigInt,isAccept: boolean ,transaction: string ,time: BigInt ,logIndex: BigInt): void {
    let data = new CancelBidLogs(transaction + '_' + logIndex.toString());
    data.contract = contract;
    data.fromAddress = from;
    data.toAddress = to;
    data.bidOrderId = bidOrderId;
    data.isCancel = isAccept;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.save();
}


export function handleCancelBid (event : AcceptBid): void {
    let contract = event.address.toHex();
    let from = event.params._from.toHex();
    let to = event.params._to.toHex();
    let bidOrderId = event.params._bidOrderId;
    let isCancel = event.params._result;
    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;

    log.info('accept bid, bidOrderId: {}, isAccept: {}', [bidOrderId.toString(), isCancel.toString()]);


    // for (let i = 0; i < length; i++) {
        createCancelBid(contract,from , to,bidOrderId  ,isCancel ,transaction,time,logIndex);
    // }
}

