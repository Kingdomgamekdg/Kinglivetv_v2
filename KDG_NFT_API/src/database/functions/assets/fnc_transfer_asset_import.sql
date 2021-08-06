CREATE OR REPLACE FUNCTION KING_LIVE.FNC_TRANSFER_ASSET_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------
	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_transfer', '{"collection_id":"' || NEW.COLLECTION || '","asset_id":"' || NEW.ASSET_ID || '","from":"' || NEW.FROM_ADDRESS || '" ,"to":"' || NEW.TO_ADDRESS ||  '"  ,"amount":"' || NEW.AMOUNT|| '","transaction":"' || NEW.TRANSACTION|| '"  }');
	RETURN NEW;
END;
$$
