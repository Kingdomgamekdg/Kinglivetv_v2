/* eslint-disable prefer-const */
import { log, BigInt } from "@graphprotocol/graph-ts";

import { TransferSingle, Create , Review} from '../../generated/KingLive1155/KingLive1155';
import { AssetLogs , TransferLogs , ReviewLogs} from '../../generated/schema';

const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Creates asset
 */
 function createAsset(collectionId: string, assetId: BigInt , uri: string|null, creator: string,isReviewed: boolean, transaction: string, time: BigInt, logIndex: BigInt, edition: BigInt, totalEditions: BigInt): void {
    let data = new AssetLogs(transaction + '_' + logIndex.toString() + '_' + assetId.toString());

    data.collection = collectionId;
    data.assetId = assetId;
    data.creator = creator;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.isReviewed = isReviewed;
    if (uri != null) {
        data.uri = uri;
    }

    if (edition != null) {
        data.editions = edition;
    }

    if (totalEditions != null) {
        data.totalEditions = totalEditions;
    }

    data.save();
}

function createTransfer(collectionId: string, assetId: BigInt , from: string|null, to: string, amount: BigInt, transaction: string, time: BigInt, logIndex: BigInt): void {
    let data = new TransferLogs(transaction + '_' + logIndex.toString() + '_' + assetId.toString());

    data.collection = collectionId;
    data.assetId = assetId;
    data.fromAddress = from;
    data.toAddress= to;
    data.amount = amount;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.save();
}

export function handleReview (event: Review): void { 
    let collectionId = event.address.toHex();
    let assetId = event.params._id;
    let reviewer = event.params._reviewer.toHex();
    let result = event.params._result;
    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;     
    createReviewAsset(collectionId,assetId, reviewer, result, transaction,time, logIndex )
}

function createReviewAsset(collectionId: string, assetId: BigInt, reviewer : string , result: boolean, transaction: string, time: BigInt, logIndex: BigInt): void {
    let data = new ReviewLogs(transaction + '_' + logIndex.toString() + '_' + assetId.toString());

    data.collection = collectionId;
    data.assetId = assetId;
    data.reviewer = reviewer;
    data.result = result;
    data.transaction = transaction;
    data.logIndex = logIndex;
    data.time = time;
    data.save();
}



export function handleTransferSingle (event: TransferSingle): void {
    let collectionId = event.address.toHex();
    let assetId = event.params._id;
    let fromAddress = event.params._from.toHex();
    let toAddress = event.params._to.toHex();
    let amount = event.params._amount;
    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;

    log.info('Transfer asset (erc1155), collection: {}, from: {}, to: {}, asset_id: {}, value: {}', [collectionId, fromAddress, toAddress, assetId.toString(), amount.toString()]);


    if (fromAddress != GENESIS_ADDRESS && fromAddress != collectionId && toAddress!= collectionId)
    {
        createTransfer(collectionId, assetId, fromAddress, toAddress, amount, transaction, time, logIndex);
    }
}

/**
 * Handle event for minting assets
 */
export function handleCreate (event: Create): void {
    let collection = event.address.toHex();
    let id = event.params._id;
    let uri = event.params._uri;
    let creator = event.params._creator.toHex();
    let maxSupply = event.params._maxSupply;
    let initSupply= event.params._initSupply;
    let isReviewed =event.params._isReviewed;

    let transaction = event.transaction.hash.toHex();
    let time = event.block.timestamp;
    let logIndex = event.transactionLogIndex;
    log.info('Mint asset in "solo" collection, collection: {}, account: {}, id: {}, uri: {}', [collection, creator, id.toString(), uri.toString()]);


    // for (let i = 0; i < length; i++) {
    createAsset(collection, id, uri, creator,isReviewed , transaction, time, logIndex, initSupply, maxSupply);
    // }
}