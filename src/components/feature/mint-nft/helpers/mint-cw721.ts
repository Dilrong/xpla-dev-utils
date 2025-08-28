import Client from '@/lib/xpla/client'
import { makeMsgCw721Mint } from '@/lib/xpla/contract/cw721'
import { Cw721Extension } from '@/lib/xpla/interface/cw721.interface'
import { ConnectedWallet } from '@xpla/wallet-provider'

async function mintCw721(
  contractAddress: string,
  name: string,
  description: string,
  image: string,
  tokenId: string,
  tokenUri: string,
  connectedWallet: ConnectedWallet,
  toast: any,
) {
  const client = new Client()
  const lcd = client.getLcd()
  if (!lcd) {
    console.error('LCD ERROR')
    return ''
  }
  const minter = connectedWallet.xplaAddress

  const extension: Cw721Extension = {
    name: name,
    description: description,
    image: image,
    attributes: [
      {
        value: image,
        trait_type: 'thumbnail_url',
      },
    ],
  }

  const msg = makeMsgCw721Mint(
    contractAddress,
    minter,
    tokenId,
    tokenUri,
    extension,
    minter,
  )

  const transactionMsg = {
    msgs: [msg],
    feeDenoms: ['axpla'],
  }

  const signTx = await connectedWallet.sign(transactionMsg as any)
  toast({
    title: 'tx broadcasting...',
  })
  const broadcastResult = await lcd.tx.broadcast(signTx.result as any)

  if (broadcastResult) {
    const txHash = broadcastResult.txhash

    return txHash
  } else {
    console.error('[mintCw721]')
    return ''
  }
}

export default mintCw721
