
----------------------------------------------------
CREATE TRIGGER TRG_ASSET_IMPORT
BEFORE INSERT
ON SGD4.ASSET_LOGS
FOR EACH ROW
EXECUTE PROCEDURE KING_LIVE.FNC_ASSET_IMPORT ();




----------------------------------------------------
CREATE TRIGGER TRG_TRANSFER_ASSET_IMPORT
BEFORE INSERT
ON SGD4.TRANSFER_LOGS
FOR EACH ROW
EXECUTE PROCEDURE KING_LIVE.FNC_TRANSFER_ASSET_IMPORT();



----------------------------------------------------
CREATE TRIGGER TRG_REVIEW_ASSET_IMPORT
BEFORE INSERT
ON SGD4.REVIEW_LOGS
FOR EACH ROW
EXECUTE PROCEDURE KING_LIVE.FNC_REVIEW_ASSET_IMPORT();

