import {
  MsgExecuteContract,
  MsgInstantiateContract,
} from '@xpla/xpla.js/dist/core/wasm'
import { AccAddress, Coins, Extension } from '@xpla/xpla.js'
import {
  Cw721InstantiateMsg,
  Cw721ExecuteMintMsg,
  Cw721Extension,
} from '../interface/cw721.interface'

export const cw721CodeId = 2

export function makeMsgCw721Instantiate(
  executeMsg: Cw721InstantiateMsg,
  codeId: number,
  label: string,
  sender: AccAddress,
): MsgInstantiateContract {
  return new MsgInstantiateContract(
    sender,
    sender,
    codeId,
    executeMsg,
    undefined,
    label,
  )
}

export function makeMsgCw721Mint(
  contractAddress: string,
  sender: string,
  tokenId: string,
  tokenUri: string,
  extension: Cw721Extension,
  owner: string,
): MsgExecuteContract {
  const executeMsg: Cw721ExecuteMintMsg = {
    mint: {
      token_id: tokenId,
      token_uri: tokenUri,
      extension: extension,
      owner: owner,
    },
  }

  return new MsgExecuteContract(sender, contractAddress, executeMsg, undefined)
}

export function makeMsgCw721Burn(
  contractAddress: string,
  tokenId: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    burn: {
      token_id: tokenId,
    },
  })
}
