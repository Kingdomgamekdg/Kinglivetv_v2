CREATE OR REPLACE FUNCTION KING_LIVE.FNC_CANCEL_BID_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------

	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_cancel_bid', '{"contract":"' || NEW.CONTRACT || '" ,"bid_order_id":"' || NEW.BID_ORDER_ID || '"   ,"is_cancel":"' || NEW.IS_CANCEL ||  '" }');
	RETURN NEW;
END;
$$
