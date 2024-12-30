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
import { uploadJsonMetadata } from "../helpers/metadataBuilder";
import { CHAINS, DEFAULT_CHAIN_ID, CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { useSignal, initData, type User } from '@telegram-apps/sdk-react';


const defaultChainConfig = CHAINS.find(
  (chain) => String(chain.chainId) === DEFAULT_CHAIN_ID
);

export interface IDappContext {
	address: string;
	loaderMessage: string;
	setLoaderMessage: (val: string) => void;

	state: IDappContextState;
	profileToken: IProfileToken | null;
	btnLoading: boolean;
	signMessageContext: string;
	verifyMessageResult: string;
	connectWallet: () => void;
	disconnectWallet: () => void;
	signMessage: () => void;
	verifySignMessage: () => void;
	setSignMessageContext: (val: string) => void;
	checkProfile: (val: string) => void;
}

interface IDappContextState {
	address: string | null;
	appInfo: string | null;
	message: string | null;
	signature: string | null;
	chainRPCs: string[] | null | undefined;
}

interface IProfileToken {
	id: number;
	uri: string;
	symbol: string;
	username: string;
	bestScore: number;
	totalScore: number;
	avgTime: number;
}

interface Token {
  id: string;
  uri: string;
}

const DappContext = createContext({} as IDappContext);
export const useDapp = () => useContext(DappContext);

const DappProvider = ({ children }: PropsWithChildren<{}>) => {
	const initDataState = useSignal(initData.state);
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

	const [profileToken, setProfileToken] = useState<IProfileToken | null>(null);
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
			// browser estension mockup
			if (window?.ethereum) {
				setBtnLoading(true);
				setTimeout(async () => {
					// await window?.ethereum.request({
					// 	method: "eth_requestAccounts",
					// 	params: [],
					// });
					const accounts = await window?.ethereum.request({
						method: "eth_accounts",
						params: [],
					});
					await window?.ethereum.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: DEFAULT_CHAIN_ID }],
					});
					const addr = accounts[0];
					setAddress(addr);
					setChainId(DEFAULT_CHAIN_ID)
					setBtnLoading(false)
					checkOrMintProfile(addr)
				}, 1000);

				return;
			}
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
					checkOrMintProfile(accounts[0])
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

    const verifySignMessage = () => {
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

	const checkOrMintProfile = async (address:string) => {
		console.log("Loading...")
		const profile = await checkProfile(address);
		if (!profile.error && profile.data === null) { // mint new profile
			const username = initDataState?.user?.username || initDataState?.user?.id;
			const response = await mintProfile(address, username as string)
			if (response.error) {
				showNotification('An error occurred while minting the token')
			}
			else {
				showNotification('Profile minted successfully!!')
			}
		}
	}

	const checkProfile = async (address: string) => {
		try {
			if (!ethers.isAddress(address)) {
				console.log('Invalid Ethereum address')
				return { error: true, data: null }
			}

			const provider = new ethers.BrowserProvider(window?.ethereum)
			const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
			
			const symbol = await contract.symbol()
			const name = await contract.name()
			const balance = await contract.balanceOf(address)

			const tokenPromises: Promise<Token>[] = []

			for (let i = 0; i < balance; i++) {
				tokenPromises.push(
					(async () => {
						const tokenId = await contract.tokenOfOwnerByIndex(address, i)
						const tokenURI = await contract.tokenURI(tokenId)
						return { id: tokenId.toString(), uri: tokenURI }
					})()
				)
			}

			const fetchedTokens = await Promise.all(tokenPromises)
			//console.log({symbol, name, tokens:fetchedTokens})

			if (fetchedTokens.length > 0) {
				const nftData = fetchedTokens[0];
				const metadataRequest = await fetch(nftData.uri);
				const {attributes:
					{ username, bestScore, totalScore, avgTime }
				} = await metadataRequest.json();

				const data = {
					id: parseInt(nftData.id),
					uri: nftData.uri,
					symbol,
					username,
					bestScore,
					totalScore,
					avgTime
				}
				
				setProfileToken(data)
				return { error: false, data }
			}
			else {
				return { error: false, data: null }
			}
		} catch (err) {
			console.error(err)
			return { error: true, data: null }
		}
	}

	const mintProfile = async (to: string, username: string) => {
		try {
			const tokenUri:string = await uploadJsonMetadata({ username })
			if (tokenUri === "") {
				return {
					error: true,
					data: "UPLOAD_ERROR"
				}
			}

			const response = await fetch('/api/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ fn: "mint", data: { to, tokenUri } }),
			})
	
			const data = await response.json()
	
			if (!response.ok) {
				console.error(data.error || 'An error occurred while minting the token')
				return { error: true }
			}
			else {
				console.log(data)
				return { error: false, data }
			}
			
		} catch (err) {
			console.error(err)
			return { error: true }
		}
	}

    const exposedVars = {
			loaderMessage,
			setLoaderMessage,

			state,
			address,
			btnLoading,
			profileToken,
			signMessageContext,
			verifyMessageResult,
			connectWallet,
			disconnectWallet,
			setSignMessageContext,
			verifySignMessage,
			signMessage,
			checkProfile
    };

    return (
			<DappContext.Provider value={exposedVars}>
				{children}
			</DappContext.Provider>
    );
};

export default DappProvider;
