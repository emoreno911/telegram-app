import { NextResponse } from "next/server";
import { privateKeyToAccount } from 'viem/accounts'
import {
    createWalletClient,
    getContract,
    publicActions,
    http,
} from "viem";
import { opBNB } from "viem/chains";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants";

// PK
const privateKey = process.env.OPERATOR_ACCOUNT_PK;

const logmessage = (str) => console.log('\x1b[33m%s\x1b[0m', str);

const getContractInstance = (contractAddr, abi) => {
    const account = privateKeyToAccount(privateKey)
    const chain = opBNB

    const walletClient = createWalletClient({
        chain,
        account,
        transport: http(),
    }).extend(publicActions);

    const contract = getContract({
        abi,
        address: contractAddr,
        client: { wallet: walletClient }
    })

    return contract
}

async function mint({to, tokenUri}) {
    const contract = getContractInstance(
        CONTRACT_ADDRESS, 
        CONTRACT_ABI
    );

    try {
        const result = await contract.write.safeMint([to, tokenUri])

        logmessage(`=== Minting success https://opbnb.bscscan.com/tx/${result}`);
        return {
            error: false,
            result
        }

    } catch (error) {
        console.log('=== Minting error', error)
        return { error: true }
    }
}

async function update({id, tokenUri}) {
    const contract = getContractInstance(
        CONTRACT_ADDRESS, 
        CONTRACT_ABI
    );

    try {
        const result = await contract.write.setTokenURI([id, tokenUri])

        logmessage(`=== setTokenUri success https://opbnb.bscscan.com/tx/${result}`);
        return {
            error: false,
            result
        }

    } catch (error) {
        console.log('=== setTokenUri error', error)
        return { error: true }
    }
}


export async function POST(req) {
    const {fn, data} = await req.json();
    let result = null;

    if (fn === "mint") {
        result = await mint(data)
    }

    if (fn === "update") {
        result = await update(data)
    }
    
    return NextResponse.json(result)
}