CREATE OR REPLACE FUNCTION KING_LIVE.FNC_BID_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------

	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_bid', '{"contract":"' || NEW.CONTRACT || '","from":"' || NEW.FROM_ADDRESS || '","to":"' || NEW.TO_ADDRESS || '" ,"list_id":"' || NEW.LIST_ID || '" ,"bid_order_id":"' || NEW.BID_ORDER_ID || '"  ,"quantity":"' || NEW.QUANTITY ||  '" ,"bid_price":"' || NEW.BID_PRICE ||  '" ,"bid_token":"' || NEW.BID_TOKEN ||  '"  ,"transaction":"' || NEW.TRANSACTION
	 ||  '" ,"time":"' || NEW.TIME || '","expiration":"' || NEW.EXPIRATION || '" }');
	RETURN NEW;
END;
$$
