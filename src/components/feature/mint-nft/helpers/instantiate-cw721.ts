import Client from "@/lib/xpla/client"
import { cw721CodeId, makeMsgCw721Instantiate } from "@/lib/xpla/contract/cw721";
import { Cw721InstantiateMsg } from "@/lib/xpla/interface/cw721.interface";
import { ConnectedWallet } from "@xpla/wallet-provider";

async function instantiateCw721(
    name: string,
    symbol: string,
    connectedWallet: ConnectedWallet,
    toast: any,
): Promise<string | undefined> {
    const client = new Client();
    const lcd = client.getLcd();
    if (!lcd) {
        console.error('LCD ERROR')
        return ''
    }
    const minter = connectedWallet.xplaAddress;

    const instantiateMsg: Cw721InstantiateMsg = {
        name: name,
        symbol: symbol,
        minter: minter,
        owner: minter,
    }

    const msg = makeMsgCw721Instantiate(instantiateMsg, cw721CodeId, name, minter)

    const transactionMsg = {
        msgs: [msg],
        feeDenoms: ['axpla'],
    }

    const signTx = await connectedWallet.sign(transactionMsg)
    toast({
        title: 'tx broadcasting...',
    })
    const broadcastResult = await lcd.tx.broadcast(signTx.result)

    if (broadcastResult) {
        const txHash = broadcastResult.txhash

        const contractAddress = await client.getContractFromTxHash(txHash)
        return contractAddress
    } else {
        console.error('[instantiateToken]')
    }
}

export default instantiateCw721