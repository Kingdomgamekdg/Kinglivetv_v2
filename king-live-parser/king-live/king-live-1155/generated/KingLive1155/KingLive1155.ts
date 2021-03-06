// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  EthereumCall,
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  EthereumTuple,
  Bytes,
  Address,
  BigInt,
  CallResult
} from "@graphprotocol/graph-ts";

export class ApprovalForAll extends EthereumEvent {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get _owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class Create extends EthereumEvent {
  get params(): Create__Params {
    return new Create__Params(this);
  }
}

export class Create__Params {
  _event: Create;

  constructor(event: Create) {
    this._event = event;
  }

  get _creator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _uri(): string {
    return this._event.parameters[2].value.toString();
  }

  get _royaltyFee(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _isReviewed(): boolean {
    return this._event.parameters[4].value.toBoolean();
  }

  get _maxSupply(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get _initSupply(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class MinterAdded extends EthereumEvent {
  get params(): MinterAdded__Params {
    return new MinterAdded__Params(this);
  }
}

export class MinterAdded__Params {
  _event: MinterAdded;

  constructor(event: MinterAdded) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class MinterRemoved extends EthereumEvent {
  get params(): MinterRemoved__Params {
    return new MinterRemoved__Params(this);
  }
}

export class MinterRemoved__Params {
  _event: MinterRemoved;

  constructor(event: MinterRemoved) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class OwnershipTransferred extends EthereumEvent {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Review extends EthereumEvent {
  get params(): Review__Params {
    return new Review__Params(this);
  }
}

export class Review__Params {
  _event: Review;

  constructor(event: Review) {
    this._event = event;
  }

  get _reviewer(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _result(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class TransferBatch extends EthereumEvent {
  get params(): TransferBatch__Params {
    return new TransferBatch__Params(this);
  }
}

export class TransferBatch__Params {
  _event: TransferBatch;

  constructor(event: TransferBatch) {
    this._event = event;
  }

  get _operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get _ids(): Array<BigInt> {
    return this._event.parameters[3].value.toBigIntArray();
  }

  get _amounts(): Array<BigInt> {
    return this._event.parameters[4].value.toBigIntArray();
  }
}

export class TransferSingle extends EthereumEvent {
  get params(): TransferSingle__Params {
    return new TransferSingle__Params(this);
  }
}

export class TransferSingle__Params {
  _event: TransferSingle;

  constructor(event: TransferSingle) {
    this._event = event;
  }

  get _operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class WhitelistAdminAdded extends EthereumEvent {
  get params(): WhitelistAdminAdded__Params {
    return new WhitelistAdminAdded__Params(this);
  }
}

export class WhitelistAdminAdded__Params {
  _event: WhitelistAdminAdded;

  constructor(event: WhitelistAdminAdded) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class WhitelistAdminRemoved extends EthereumEvent {
  get params(): WhitelistAdminRemoved__Params {
    return new WhitelistAdminRemoved__Params(this);
  }
}

export class WhitelistAdminRemoved__Params {
  _event: WhitelistAdminRemoved;

  constructor(event: WhitelistAdminRemoved) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class KingLive1155 extends SmartContract {
  static bind(address: Address): KingLive1155 {
    return new KingLive1155("KingLive1155", address);
  }

  ZOO_FEE(): BigInt {
    let result = super.call("ZOO_FEE", []);

    return result[0].toBigInt();
  }

  try_ZOO_FEE(): CallResult<BigInt> {
    let result = super.tryCall("ZOO_FEE", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  balanceOf(_owner: Address, _id: BigInt): BigInt {
    let result = super.call("balanceOf", [
      EthereumValue.fromAddress(_owner),
      EthereumValue.fromUnsignedBigInt(_id)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(_owner: Address, _id: BigInt): CallResult<BigInt> {
    let result = super.tryCall("balanceOf", [
      EthereumValue.fromAddress(_owner),
      EthereumValue.fromUnsignedBigInt(_id)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  balanceOfBatch(_owners: Array<Address>, _ids: Array<BigInt>): Array<BigInt> {
    let result = super.call("balanceOfBatch", [
      EthereumValue.fromAddressArray(_owners),
      EthereumValue.fromUnsignedBigIntArray(_ids)
    ]);

    return result[0].toBigIntArray();
  }

  try_balanceOfBatch(
    _owners: Array<Address>,
    _ids: Array<BigInt>
  ): CallResult<Array<BigInt>> {
    let result = super.tryCall("balanceOfBatch", [
      EthereumValue.fromAddressArray(_owners),
      EthereumValue.fromUnsignedBigIntArray(_ids)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigIntArray());
  }

  creators(param0: BigInt): Address {
    let result = super.call("creators", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);

    return result[0].toAddress();
  }

  try_creators(param0: BigInt): CallResult<Address> {
    let result = super.tryCall("creators", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toAddress());
  }

  feeToken(): Address {
    let result = super.call("feeToken", []);

    return result[0].toAddress();
  }

  try_feeToken(): CallResult<Address> {
    let result = super.tryCall("feeToken", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toAddress());
  }

  getCreator(_id: BigInt): Address {
    let result = super.call("getCreator", [
      EthereumValue.fromUnsignedBigInt(_id)
    ]);

    return result[0].toAddress();
  }

  try_getCreator(_id: BigInt): CallResult<Address> {
    let result = super.tryCall("getCreator", [
      EthereumValue.fromUnsignedBigInt(_id)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toAddress());
  }

  getFeeToken(): Address {
    let result = super.call("getFeeToken", []);

    return result[0].toAddress();
  }

  try_getFeeToken(): CallResult<Address> {
    let result = super.tryCall("getFeeToken", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toAddress());
  }

  getMintingFee(): BigInt {
    let result = super.call("getMintingFee", []);

    return result[0].toBigInt();
  }

  try_getMintingFee(): CallResult<BigInt> {
    let result = super.tryCall("getMintingFee", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  getroyaltyFee(_id: BigInt): BigInt {
    let result = super.call("getroyaltyFee", [
      EthereumValue.fromUnsignedBigInt(_id)
    ]);

    return result[0].toBigInt();
  }

  try_getroyaltyFee(_id: BigInt): CallResult<BigInt> {
    let result = super.tryCall("getroyaltyFee", [
      EthereumValue.fromUnsignedBigInt(_id)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  isApprovedForAll(_owner: Address, _operator: Address): boolean {
    let result = super.call("isApprovedForAll", [
      EthereumValue.fromAddress(_owner),
      EthereumValue.fromAddress(_operator)
    ]);

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    _owner: Address,
    _operator: Address
  ): CallResult<boolean> {
    let result = super.tryCall("isApprovedForAll", [
      EthereumValue.fromAddress(_owner),
      EthereumValue.fromAddress(_operator)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  isMinter(account: Address): boolean {
    let result = super.call("isMinter", [EthereumValue.fromAddress(account)]);

    return result[0].toBoolean();
  }

  try_isMinter(account: Address): CallResult<boolean> {
    let result = super.tryCall("isMinter", [
      EthereumValue.fromAddress(account)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  isOwner(): boolean {
    let result = super.call("isOwner", []);

    return result[0].toBoolean();
  }

  try_isOwner(): CallResult<boolean> {
    let result = super.tryCall("isOwner", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  isReviewed(param0: BigInt): boolean {
    let result = super.call("isReviewed", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);

    return result[0].toBoolean();
  }

  try_isReviewed(param0: BigInt): CallResult<boolean> {
    let result = super.tryCall("isReviewed", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  isWhitelistAdmin(account: Address): boolean {
    let result = super.call("isWhitelistAdmin", [
      EthereumValue.fromAddress(account)
    ]);

    return result[0].toBoolean();
  }

  try_isWhitelistAdmin(account: Address): CallResult<boolean> {
    let result = super.tryCall("isWhitelistAdmin", [
      EthereumValue.fromAddress(account)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  maxSupply(_id: BigInt): BigInt {
    let result = super.call("maxSupply", [
      EthereumValue.fromUnsignedBigInt(_id)
    ]);

    return result[0].toBigInt();
  }

  try_maxSupply(_id: BigInt): CallResult<BigInt> {
    let result = super.tryCall("maxSupply", [
      EthereumValue.fromUnsignedBigInt(_id)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  mintingFee(): BigInt {
    let result = super.call("mintingFee", []);

    return result[0].toBigInt();
  }

  try_mintingFee(): CallResult<BigInt> {
    let result = super.tryCall("mintingFee", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  name(): string {
    let result = super.call("name", []);

    return result[0].toString();
  }

  try_name(): CallResult<string> {
    let result = super.tryCall("name", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toString());
  }

  owner(): Address {
    let result = super.call("owner", []);

    return result[0].toAddress();
  }

  try_owner(): CallResult<Address> {
    let result = super.tryCall("owner", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toAddress());
  }

  reviewers(param0: Address): boolean {
    let result = super.call("reviewers", [EthereumValue.fromAddress(param0)]);

    return result[0].toBoolean();
  }

  try_reviewers(param0: Address): CallResult<boolean> {
    let result = super.tryCall("reviewers", [
      EthereumValue.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  royaltyFee(param0: BigInt): BigInt {
    let result = super.call("royaltyFee", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);

    return result[0].toBigInt();
  }

  try_royaltyFee(param0: BigInt): CallResult<BigInt> {
    let result = super.tryCall("royaltyFee", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  setProxyAddress(_proxyRegistryAddress: Address): boolean {
    let result = super.call("setProxyAddress", [
      EthereumValue.fromAddress(_proxyRegistryAddress)
    ]);

    return result[0].toBoolean();
  }

  try_setProxyAddress(_proxyRegistryAddress: Address): CallResult<boolean> {
    let result = super.tryCall("setProxyAddress", [
      EthereumValue.fromAddress(_proxyRegistryAddress)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  supportsInterface(_interfaceID: Bytes): boolean {
    let result = super.call("supportsInterface", [
      EthereumValue.fromFixedBytes(_interfaceID)
    ]);

    return result[0].toBoolean();
  }

  try_supportsInterface(_interfaceID: Bytes): CallResult<boolean> {
    let result = super.tryCall("supportsInterface", [
      EthereumValue.fromFixedBytes(_interfaceID)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  symbol(): string {
    let result = super.call("symbol", []);

    return result[0].toString();
  }

  try_symbol(): CallResult<string> {
    let result = super.tryCall("symbol", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toString());
  }

  tokenMaxSupply(param0: BigInt): BigInt {
    let result = super.call("tokenMaxSupply", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);

    return result[0].toBigInt();
  }

  try_tokenMaxSupply(param0: BigInt): CallResult<BigInt> {
    let result = super.tryCall("tokenMaxSupply", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  tokenSupply(param0: BigInt): BigInt {
    let result = super.call("tokenSupply", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);

    return result[0].toBigInt();
  }

  try_tokenSupply(param0: BigInt): CallResult<BigInt> {
    let result = super.tryCall("tokenSupply", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  tokenURI(param0: BigInt): string {
    let result = super.call("tokenURI", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);

    return result[0].toString();
  }

  try_tokenURI(param0: BigInt): CallResult<string> {
    let result = super.tryCall("tokenURI", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toString());
  }

  totalSupply(_id: BigInt): BigInt {
    let result = super.call("totalSupply", [
      EthereumValue.fromUnsignedBigInt(_id)
    ]);

    return result[0].toBigInt();
  }

  try_totalSupply(_id: BigInt): CallResult<BigInt> {
    let result = super.tryCall("totalSupply", [
      EthereumValue.fromUnsignedBigInt(_id)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  uri(_id: BigInt): string {
    let result = super.call("uri", [EthereumValue.fromUnsignedBigInt(_id)]);

    return result[0].toString();
  }

  try_uri(_id: BigInt): CallResult<string> {
    let result = super.tryCall("uri", [EthereumValue.fromUnsignedBigInt(_id)]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toString());
  }

  whiteListCreators(param0: Address): boolean {
    let result = super.call("whiteListCreators", [
      EthereumValue.fromAddress(param0)
    ]);

    return result[0].toBoolean();
  }

  try_whiteListCreators(param0: Address): CallResult<boolean> {
    let result = super.tryCall("whiteListCreators", [
      EthereumValue.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends EthereumCall {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddMinterCall extends EthereumCall {
  get inputs(): AddMinterCall__Inputs {
    return new AddMinterCall__Inputs(this);
  }

  get outputs(): AddMinterCall__Outputs {
    return new AddMinterCall__Outputs(this);
  }
}

export class AddMinterCall__Inputs {
  _call: AddMinterCall;

  constructor(call: AddMinterCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddMinterCall__Outputs {
  _call: AddMinterCall;

  constructor(call: AddMinterCall) {
    this._call = call;
  }
}

export class AddReviewerCall extends EthereumCall {
  get inputs(): AddReviewerCall__Inputs {
    return new AddReviewerCall__Inputs(this);
  }

  get outputs(): AddReviewerCall__Outputs {
    return new AddReviewerCall__Outputs(this);
  }
}

export class AddReviewerCall__Inputs {
  _call: AddReviewerCall;

  constructor(call: AddReviewerCall) {
    this._call = call;
  }

  get reviewer(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get canReview(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class AddReviewerCall__Outputs {
  _call: AddReviewerCall;

  constructor(call: AddReviewerCall) {
    this._call = call;
  }
}

export class AddWhitelistAdminCall extends EthereumCall {
  get inputs(): AddWhitelistAdminCall__Inputs {
    return new AddWhitelistAdminCall__Inputs(this);
  }

  get outputs(): AddWhitelistAdminCall__Outputs {
    return new AddWhitelistAdminCall__Outputs(this);
  }
}

export class AddWhitelistAdminCall__Inputs {
  _call: AddWhitelistAdminCall;

  constructor(call: AddWhitelistAdminCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddWhitelistAdminCall__Outputs {
  _call: AddWhitelistAdminCall;

  constructor(call: AddWhitelistAdminCall) {
    this._call = call;
  }
}

export class AdminWhiteListCreatorsCall extends EthereumCall {
  get inputs(): AdminWhiteListCreatorsCall__Inputs {
    return new AdminWhiteListCreatorsCall__Inputs(this);
  }

  get outputs(): AdminWhiteListCreatorsCall__Outputs {
    return new AdminWhiteListCreatorsCall__Outputs(this);
  }
}

export class AdminWhiteListCreatorsCall__Inputs {
  _call: AdminWhiteListCreatorsCall;

  constructor(call: AdminWhiteListCreatorsCall) {
    this._call = call;
  }

  get creator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get whiteList(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class AdminWhiteListCreatorsCall__Outputs {
  _call: AdminWhiteListCreatorsCall;

  constructor(call: AdminWhiteListCreatorsCall) {
    this._call = call;
  }
}

export class CreateCall extends EthereumCall {
  get inputs(): CreateCall__Inputs {
    return new CreateCall__Inputs(this);
  }

  get outputs(): CreateCall__Outputs {
    return new CreateCall__Outputs(this);
  }
}

export class CreateCall__Inputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get _maxSupply(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _initialSupply(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _royaltyFee(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _uri(): string {
    return this._call.inputValues[3].value.toString();
  }

  get _data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class CreateCall__Outputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get tokenId(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class MintCall extends EthereumCall {
  get inputs(): MintCall__Inputs {
    return new MintCall__Inputs(this);
  }

  get outputs(): MintCall__Outputs {
    return new MintCall__Outputs(this);
  }
}

export class MintCall__Inputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _quantity(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _data(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class MintCall__Outputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }
}

export class RemoveWhitelistAdminCall extends EthereumCall {
  get inputs(): RemoveWhitelistAdminCall__Inputs {
    return new RemoveWhitelistAdminCall__Inputs(this);
  }

  get outputs(): RemoveWhitelistAdminCall__Outputs {
    return new RemoveWhitelistAdminCall__Outputs(this);
  }
}

export class RemoveWhitelistAdminCall__Inputs {
  _call: RemoveWhitelistAdminCall;

  constructor(call: RemoveWhitelistAdminCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveWhitelistAdminCall__Outputs {
  _call: RemoveWhitelistAdminCall;

  constructor(call: RemoveWhitelistAdminCall) {
    this._call = call;
  }
}

export class RenounceMinterCall extends EthereumCall {
  get inputs(): RenounceMinterCall__Inputs {
    return new RenounceMinterCall__Inputs(this);
  }

  get outputs(): RenounceMinterCall__Outputs {
    return new RenounceMinterCall__Outputs(this);
  }
}

export class RenounceMinterCall__Inputs {
  _call: RenounceMinterCall;

  constructor(call: RenounceMinterCall) {
    this._call = call;
  }
}

export class RenounceMinterCall__Outputs {
  _call: RenounceMinterCall;

  constructor(call: RenounceMinterCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends EthereumCall {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceWhitelistAdminCall extends EthereumCall {
  get inputs(): RenounceWhitelistAdminCall__Inputs {
    return new RenounceWhitelistAdminCall__Inputs(this);
  }

  get outputs(): RenounceWhitelistAdminCall__Outputs {
    return new RenounceWhitelistAdminCall__Outputs(this);
  }
}

export class RenounceWhitelistAdminCall__Inputs {
  _call: RenounceWhitelistAdminCall;

  constructor(call: RenounceWhitelistAdminCall) {
    this._call = call;
  }
}

export class RenounceWhitelistAdminCall__Outputs {
  _call: RenounceWhitelistAdminCall;

  constructor(call: RenounceWhitelistAdminCall) {
    this._call = call;
  }
}

export class ReviewAssetCall extends EthereumCall {
  get inputs(): ReviewAssetCall__Inputs {
    return new ReviewAssetCall__Inputs(this);
  }

  get outputs(): ReviewAssetCall__Outputs {
    return new ReviewAssetCall__Outputs(this);
  }
}

export class ReviewAssetCall__Inputs {
  _call: ReviewAssetCall;

  constructor(call: ReviewAssetCall) {
    this._call = call;
  }

  get tokenId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get accept(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class ReviewAssetCall__Outputs {
  _call: ReviewAssetCall;

  constructor(call: ReviewAssetCall) {
    this._call = call;
  }
}

export class SafeBatchTransferFromCall extends EthereumCall {
  get inputs(): SafeBatchTransferFromCall__Inputs {
    return new SafeBatchTransferFromCall__Inputs(this);
  }

  get outputs(): SafeBatchTransferFromCall__Outputs {
    return new SafeBatchTransferFromCall__Outputs(this);
  }
}

export class SafeBatchTransferFromCall__Inputs {
  _call: SafeBatchTransferFromCall;

  constructor(call: SafeBatchTransferFromCall) {
    this._call = call;
  }

  get _from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _ids(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get _amounts(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get _data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class SafeBatchTransferFromCall__Outputs {
  _call: SafeBatchTransferFromCall;

  constructor(call: SafeBatchTransferFromCall) {
    this._call = call;
  }
}

export class SafeTransferFromCall extends EthereumCall {
  get inputs(): SafeTransferFromCall__Inputs {
    return new SafeTransferFromCall__Inputs(this);
  }

  get outputs(): SafeTransferFromCall__Outputs {
    return new SafeTransferFromCall__Outputs(this);
  }
}

export class SafeTransferFromCall__Inputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }

  get _from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _id(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class SafeTransferFromCall__Outputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }
}

export class SetApprovalForAllCall extends EthereumCall {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get _operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _approved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}

export class SetBaseMetadataURICall extends EthereumCall {
  get inputs(): SetBaseMetadataURICall__Inputs {
    return new SetBaseMetadataURICall__Inputs(this);
  }

  get outputs(): SetBaseMetadataURICall__Outputs {
    return new SetBaseMetadataURICall__Outputs(this);
  }
}

export class SetBaseMetadataURICall__Inputs {
  _call: SetBaseMetadataURICall;

  constructor(call: SetBaseMetadataURICall) {
    this._call = call;
  }

  get _newBaseMetadataURI(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class SetBaseMetadataURICall__Outputs {
  _call: SetBaseMetadataURICall;

  constructor(call: SetBaseMetadataURICall) {
    this._call = call;
  }
}

export class SetFeeTokenCall extends EthereumCall {
  get inputs(): SetFeeTokenCall__Inputs {
    return new SetFeeTokenCall__Inputs(this);
  }

  get outputs(): SetFeeTokenCall__Outputs {
    return new SetFeeTokenCall__Outputs(this);
  }
}

export class SetFeeTokenCall__Inputs {
  _call: SetFeeTokenCall;

  constructor(call: SetFeeTokenCall) {
    this._call = call;
  }

  get _feeToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetFeeTokenCall__Outputs {
  _call: SetFeeTokenCall;

  constructor(call: SetFeeTokenCall) {
    this._call = call;
  }
}

export class SetMintingFeeCall extends EthereumCall {
  get inputs(): SetMintingFeeCall__Inputs {
    return new SetMintingFeeCall__Inputs(this);
  }

  get outputs(): SetMintingFeeCall__Outputs {
    return new SetMintingFeeCall__Outputs(this);
  }
}

export class SetMintingFeeCall__Inputs {
  _call: SetMintingFeeCall;

  constructor(call: SetMintingFeeCall) {
    this._call = call;
  }

  get _mintingFee(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetMintingFeeCall__Outputs {
  _call: SetMintingFeeCall;

  constructor(call: SetMintingFeeCall) {
    this._call = call;
  }
}

export class SetProxyAddressCall extends EthereumCall {
  get inputs(): SetProxyAddressCall__Inputs {
    return new SetProxyAddressCall__Inputs(this);
  }

  get outputs(): SetProxyAddressCall__Outputs {
    return new SetProxyAddressCall__Outputs(this);
  }
}

export class SetProxyAddressCall__Inputs {
  _call: SetProxyAddressCall;

  constructor(call: SetProxyAddressCall) {
    this._call = call;
  }

  get _proxyRegistryAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetProxyAddressCall__Outputs {
  _call: SetProxyAddressCall;

  constructor(call: SetProxyAddressCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class TransferOwnershipCall extends EthereumCall {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
