CREATE OR REPLACE FUNCTION KING_LIVE.FNC_LIST_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------

	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_list', '{"contract":"' || NEW.CONTRACT || '", "owner":"' || NEW.OWNER || '" ,"list_id":"' || NEW.LIST_ID || '","collection_id":"' || NEW.COLLECTION || '" ,"asset_id":"' || NEW.ASSET_ID ||  '"  ,"quantity":"' || NEW.QUANTITY ||  '","mask":"' || NEW.MASK ||  '" ,"price":"' || NEW.PRICE ||  '" ,"payment_token":"' || NEW.PAYMENT_TOKEN ||  '","time":"' || NEW.TIME ||  '" ,"expiration":"' || NEW.EXPIRATION ||  '","transaction":"' || NEW.TRANSACTION ||  '"   }');
	RETURN NEW;
END;
$$
