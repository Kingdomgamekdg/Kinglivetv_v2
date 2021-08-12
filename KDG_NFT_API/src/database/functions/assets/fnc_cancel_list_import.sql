CREATE OR REPLACE FUNCTION KING_LIVE.FNC_CANCEL_LIST_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------

	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_cancel_list', '{"contract":"' || NEW.CONTRACT || '","list_id":"' || NEW.LIST_ID || '"  }');
	RETURN NEW;
END;
$$
