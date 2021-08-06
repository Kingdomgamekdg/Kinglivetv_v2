CREATE OR REPLACE FUNCTION KING_LIVE.FNC_ASSET_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------

	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_asset', '{"collection_id":"' || NEW.COLLECTION || '","asset_id":"' || NEW.ASSET_ID || '","uri":"' || NEW.URI || '" ,"creator":"' || NEW.CREATOR ||  '"  ,"editions":"' || NEW.EDITIONS ||  '","total_editions":"' || NEW.TOTAL_EDITIONS ||  '","is_reviewed":"' || NEW.IS_REVIEWED ||  '" ,"time":"' || NEW.TIME ||  '" }');
	RETURN NEW;
END;
$$