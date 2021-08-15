import React from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Button,
  ButtonProps,
  ConnectorId,
  useWalletModal,
  Login,
} from "@kinglive/uikit";
import { injected, bsc, walletconnect } from "../../connectors";
import useI18n from "../../hooks/useI18n";
const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n();
  const { account, activate, deactivate } = useWeb3React();

  const handleLogin = (connectorId: ConnectorId) => {
    if (connectorId === "walletconnect") {
      return activate(walletconnect);
    }

    if (connectorId === "bsc") {
      return activate(bsc);
    }

    return activate(injected);
  };

  const { onPresentConnectModal } = useWalletModal(
    handleLogin,
    deactivate,
    account as string
  );
  const accountEllipsis = account
    ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}`
    : null;
  return (
    <div>
      {account ? (
        <>
          <Button className="connect-custom">{accountEllipsis}</Button>
        </>
      ) : (
        <>
          {" "}
          <Button
            className="connect-custom"
            onClick={onPresentConnectModal}
            {...props}
            style={{ width: "100%", borderRadius: "10px", height: "46px" }}
          >
            {TranslateString(292, "Connect")}
          </Button>
        </>
      )}
    </div>
  );
};
export default UnlockButton;
