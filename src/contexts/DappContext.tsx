"use client";

import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    PropsWithChildren,
    useLayoutEffect,
} from "react";

import { ethers } from "ethers";
import type { WalletTgSdk } from "@uxuycom/web3-tg-sdk";
import { CHAINS } from "../constants";

const DEFAULT_CHAIN_ID = "0xcc"; // opBNB
const defaultChainConfig = CHAINS.find(
  (chain) => String(chain.chainId) === DEFAULT_CHAIN_ID
);

export interface IDappContext {
	address: string;
	loaderMessage: string;
	setLoaderMessage: (val: string) => void;

	state: IDappContextState;
	btnLoading: boolean;
	signMessageContext: string;
	verifyMessageResult: string;
	connectWallet: () => void;
	disconnectWallet: () => void;
	setSignMessageContext: (val: string) => void;
	signMessage: () => void;
	verifySignMessage: () => void;
}

interface IDappContextState {
	address: string | null;
	appInfo: string | null;
	message: string | null;
	signature: string | null;
	chainRPCs: string[] | null | undefined;
}

const DappContext = createContext({} as IDappContext);
export const useDapp = () => useContext(DappContext);

const DappProvider = ({ children }: PropsWithChildren<{}>) => {
    const [tgSdk, setTgSdk] = useState<WalletTgSdk | null>(null);
    const [address, setAddress] = useState("");
    const [loaderMessage, setLoaderMessage] = useState("");

    const [chainId, setChainId] = useState("0x1");
    const [state, setState] = useState<IDappContextState>({
        address: "",
        appInfo: "",
        signature: "",
        message: "DApp demo",
        chainRPCs: defaultChainConfig?.chainRPCs,
    });

    const [signMessageContext, setSignMessageContext] = useState("Hello world");
    const [btnLoading, setBtnLoading] = useState(false);
    const [verifyMessageResult, setVerifyMessageResult] = useState("");
    const [notification, setNotification] = useState("");

    useLayoutEffect(() => {
			import("@uxuycom/web3-tg-sdk")
				.then((module) => module.WalletTgSdk)
				.then((WalletTgSdk) => {
					setTgSdk(new WalletTgSdk());
				});
    }, []);

    useEffect(() => {
      if (tgSdk === null) {
        init();
      }
    }, [tgSdk]);

    function initEventListener() {
			// events
			tgSdk?.ethereum.removeAllListeners();
			function handleAccountsChanged(accounts: string[]) {
					setAddress(accounts[0]);
			}
			function handleChainChanged(_chainId: string) {
					setChainId("0x" + Number(_chainId).toString(16));
			}

			tgSdk?.ethereum.on("accountsChanged", handleAccountsChanged);
			tgSdk?.ethereum.on("chainChanged", handleChainChanged);
    }

    function showNotification(msg: string, b = false) {
      console.log(msg, b);
    }

    // get chainId, address
    const init = async () => {
			window?.Telegram?.WebApp?.expand?.();

			let accounts = await tgSdk?.ethereum.request({
					method: "eth_accounts",
			});
			if (!accounts) {
					await tgSdk?.ethereum.request({ method: "eth_requestAccounts" });
			}

			accounts = await tgSdk?.ethereum.request({
					method: "eth_accounts",
					params: [],
			});
			const chainId = await tgSdk?.ethereum.request({
					method: "eth_chainId",
					params: [],
			});

			console.log(accounts);
			if (!accounts) return;

			const isConnected = accounts[0];
			setChainId(chainId);
			setAddress(accounts[0]);
			initEventListener();
			isConnected && switchChain(DEFAULT_CHAIN_ID);
    };

    useEffect(() => {
			if (!chainId) {
					return;
			}

			const chainConfig = CHAINS.find(
					(chain) => parseInt(chain.chainId) == parseInt(chainId)
			);
			if (!chainConfig) {
					return;
			}

			setState({
					...state,
					chainRPCs: chainConfig?.chainRPCs,
			});
    }, [chainId]);

    // Get App Info Event
    const getAppInfo = () => {
			const appInfo = tgSdk?.ethereum?.getAppInfo?.();
			setState({ ...state, appInfo: JSON.stringify(appInfo) });
			showNotification("App info retrieved successfully");
    };

    // Connect Wallet Event
    const connectWallet = async () => {
			//if(btnLoadingConnect) return
			setBtnLoading(true);
			try {
					await tgSdk?.ethereum.request({
							method: "eth_requestAccounts",
							params: [],
					});

					const accounts = await tgSdk?.ethereum.request({
							method: "eth_accounts",
							params: [],
					});
					const chainId = await tgSdk?.ethereum.request({
							method: "eth_chainId",
							params: [],
					});
					setAddress(accounts[0]);
					setChainId(chainId);
					showNotification("Wallet connected successfully");
					switchChain(DEFAULT_CHAIN_ID);
			} catch (error) {
					console.error("Connection failed:", error);
					showNotification("Failed to connect wallet", false);
			}
			setBtnLoading(false);
    };

    const disconnectWallet = () => {
        tgSdk?.ethereum?.disconnect && tgSdk?.ethereum?.disconnect?.();
    };

    // Switch chian Event
    const switchChain = async (chainId: string) => {
			try {
					await tgSdk?.ethereum.request({
							method: "wallet_switchEthereumChain",
							params: [{ chainId: chainId }],
					});
					showNotification("Chain switched successfully");
			} catch (error) {
					console.error("Chain switch failed:", error);
					showNotification("Failed to switch chain", false);
			}
    };

    // Sign Message Event
    const signMessage = async () => {
			const signMessage = ethers.isHexString(signMessageContext)
					? signMessageContext
					: ethers.hexlify(ethers.toUtf8Bytes(signMessageContext));
			//if(btnLoadingSign) return
			setBtnLoading(true);
			try {
					const result = await tgSdk?.ethereum.request({
							method: "personal_sign",
							params: [signMessage, address],
					});
					setState({ ...state, signature: result, message: signMessage });
					showNotification("Message signed successfully");
			} catch (error) {
					console.error("Message signing failed:", error);
					showNotification("Failed to sign message", false);
			}
			setBtnLoading(false);
    };

    function verifySignMessage() {
			if (!state.signature) {
					showNotification("Please sign first");
					return;
			}

			const recoveredAddress = ethers.verifyMessage(
					signMessageContext,
					state.signature
			);
			setVerifyMessageResult(recoveredAddress);
    }

    const exposedVars = {
			loaderMessage,
			setLoaderMessage,

			state,
			address,
			btnLoading,
			signMessageContext,
			verifyMessageResult,
			connectWallet,
			disconnectWallet,
			setSignMessageContext,
			signMessage,
			verifySignMessage,
    };

    return (
			<DappContext.Provider value={exposedVars}>
				{children}
			</DappContext.Provider>
    );
};

export default DappProvider;
