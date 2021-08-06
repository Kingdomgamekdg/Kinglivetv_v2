


CREATE OR REPLACE FUNCTION KING_LIVE.FNC_REVIEW_ASSET_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------

	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_review', '{"collection_id":"' || NEW.COLLECTION || '","asset_id":"' || NEW.ASSET_ID || '" ,"reviewer":"' || NEW.REVIEWER ||  '"  ,"result":"' || NEW.RESULT ||  '"  }');
	RETURN NEW;
END;
$$
