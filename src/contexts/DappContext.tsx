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
import { sleep } from "@/helpers/utils";
import { getLastMatches, getPointsAndAvg, insertMatch, updateLeaderboard } from "@/helpers/service";


const defaultChainConfig = CHAINS.find(
  (chain) => String(chain.chainId) === DEFAULT_CHAIN_ID
);

export interface IDappContext {
	address: string;
	loaderMessage: string;
	setLoaderMessage: (val: string) => void;

	state: IDappContextState;
	profileImage: string | null;
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
	updatePlayerStats: (val: string) => void;
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
	nftId: string;
	symbol: string;
	username: string;
	bestScore: number;
	totalScore: number;
	avgTime: number;
}

interface IMetadataAttrs {
	username: string | undefined
	bestScore: number 
	totalScore: number 
	avgTime: number
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

	const [profileImage, setProfileImage] = useState<string|null>(null)
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
					await checkOrMintProfile(addr)
					setBtnLoading(false)
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
			console.log(username)
			//return
			const response = await mintProfile(address, username as string)
			if (response.error) {
				showNotification('An error occurred while minting the token')
			}
			else {
				showNotification('Profile minted successfully!!')
			}
		}

		if (profile.data !== null) {
			console.log("Profile loaded", profile.data)
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

				const {image, attributes} = await metadataRequest.json();
				const [user, best, total, avg] = attributes;

				const data = {
					id: parseInt(nftData.id),
					nftId: `${CONTRACT_ADDRESS}_${nftData.id}`,
					uri: nftData.uri,
					symbol,
					username: user.value,
					bestScore: best.value,
					totalScore: total.value,
					avgTime: avg.value
				}
				
				setProfileToken(data)
				setProfileImage(image)
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

	const updatePlayerStats = async (matchDataJSON:string) => {
		const {totals:[points, avg_time], cat_id, cat_name} = JSON.parse(matchDataJSON);

		if (profileToken === null) {
			showNotification("Please connect wallet to store scores")
			return
		}
		
		const oldScores = await getPointsAndAvg(profileToken?.nftId);
		//const oldScores = await getPointsAndAvg("0x00000_5");
		if (oldScores.error) {
			console.log("Error getting old matches scores")
			return;
		}

		const scores = [...oldScores.data, {points, avg_time}]
		const result = scores.reduce((acc, current) => {
			return {
			  totalPoints: acc.totalPoints + current.points,
			  totalTime: acc.totalTime + current.avg_time
			};
		}, { totalPoints: 0, totalTime: 0 });

		const total = result.totalPoints;
		const avg = result.totalTime / scores.length;
		const best = Math.max(...scores.map(s => parseInt(s.points)));
		const username = profileToken?.username;
		const nft_id = profileToken?.nftId;

		// add db rows
		const matchAdd = await insertMatch({
			nft_id,
			username,
			points,
			avg_time,
			cat_id,
			cat_name
		})

		const leadUpdate = await updateLeaderboard({
			nft_id,
			username,
			total,
			best,
			avg
		})

		if (leadUpdate.error || matchAdd.error) {
			console.log("error", {leadUpdate}, {matchAdd})
			return;
		}

		console.log("db updated", {leadUpdate}, {matchAdd})
		await updateNftProfile({
			username,
			bestScore: best,
			totalScore: total,
			avgTime: parseFloat(avg.toFixed(3))
		})

		showNotification("Nft Profile updated")
	}

	const updateNftProfile = async (ndata:IMetadataAttrs) => {
		try {
			const {tokenUri, base64} = await uploadJsonMetadata(ndata)
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
				body: JSON.stringify({ fn: "update", data: { id: profileToken?.id, tokenUri } }),
			})
	
			const data = await response.json()
	
			if (!response.ok) {
				console.error(data.error || 'An error occurred while minting the token')
				return { error: true }
			}
			else {
				console.log(data)
				setProfileImage(base64)
				setProfileToken(o => {
					if (o !== null) {
						o.bestScore = ndata.bestScore
						o.totalScore = ndata.totalScore
						o.avgTime = ndata.avgTime
					}
					return o
				})
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
		profileImage,
		signMessageContext,
		verifyMessageResult,
		connectWallet,
		disconnectWallet,
		setSignMessageContext,
		verifySignMessage,
		signMessage,
		checkProfile,
		updatePlayerStats
    };

    return (
			<DappContext.Provider value={exposedVars}>
				{children}
			</DappContext.Provider>
    );
};

export default DappProvider;
