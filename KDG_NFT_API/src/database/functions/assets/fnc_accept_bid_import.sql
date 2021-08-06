CREATE OR REPLACE FUNCTION KING_LIVE.FNC_ACCEPT_BID_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------

	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_accept_bid', '{"contract":"' || NEW.CONTRACT || '","bid_order_id":"' || NEW.BID_ORDER_ID || '"  ,"is_accept":"' || NEW.IS_ACCEPT ||  '" }');
	RETURN NEW;
END;
$$
