CREATE OR REPLACE FUNCTION KING_LIVE.FNC_BUY_IMPORT ()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
	-----------------------------------------------------------------
	-- Imports asset data
	-----------------------------------------------------------------

	-- Open Edition smart contract on Rinkeby and Mainnet
	PERFORM PG_NOTIFY('new_buy', '{"contract":"' || NEW.CONTRACT || '","from":"' || NEW.FROM_ADDRESS || '","to":"' || NEW.TO_ADDRESS || '" ,"list_id":"' || NEW.LIST_ID || '"  ,"quantity":"' || NEW.QUANTITY ||  '" ,"payment_amount":"' || NEW.PAYMENT_AMOUNT ||  '" ,"payment_token":"' || NEW.PAYMENT_TOKEN ||  '","transaction":"' || NEW.TRANSACTION ||  '"    }');
	RETURN NEW;
END;
$$
