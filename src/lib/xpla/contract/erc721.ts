import { MsgInstantiateContract } from '@xpla/xpla.js/dist/core/wasm'
import { MsgExecuteContract } from '@xpla/xpla.js'
import { AccAddress } from '@xpla/xpla.js'
import {
  Erc721InstantiateMsg,
  Erc721ExecuteMsg,
} from '@/lib/xpla/interface/erc721.interface'

export const erc721CodeId = 3

export function makeMsgErc721Instantiate(
  executeMsg: Erc721InstantiateMsg,
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

export function makeMsgErc721Mint(
  contractAddress: string,
  tokenId: string,
  owner: string,
  tokenUri?: string,
  extension?: any,
  sender?: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender || owner, contractAddress, {
    mint: {
      token_id: tokenId,
      owner,
      token_uri: tokenUri,
      extension,
    },
  })
}

export function makeMsgErc721Transfer(
  contractAddress: string,
  from: string,
  to: string,
  tokenId: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    transfer: {
      from,
      to,
      token_id: tokenId,
    },
  })
}

export function makeMsgErc721TransferFrom(
  contractAddress: string,
  from: string,
  to: string,
  tokenId: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    transfer_from: {
      from,
      to,
      token_id: tokenId,
    },
  })
}

export function makeMsgErc721Approve(
  contractAddress: string,
  to: string,
  tokenId: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    approve: {
      to,
      token_id: tokenId,
    },
  })
}

export function makeMsgErc721ApproveAll(
  contractAddress: string,
  operator: string,
  approve: boolean,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    approve_all: {
      operator,
      approve,
    },
  })
}

export function makeMsgErc721Revoke(
  contractAddress: string,
  spender: string,
  tokenId: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    revoke: {
      spender,
      token_id: tokenId,
    },
  })
}

export function makeMsgErc721RevokeAll(
  contractAddress: string,
  operator: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    revoke_all: {
      operator,
    },
  })
}

export function makeMsgErc721Burn(
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

export function makeMsgErc721BurnFrom(
  contractAddress: string,
  from: string,
  tokenId: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    burn_from: {
      from,
      token_id: tokenId,
    },
  })
}

export function makeMsgErc721SendNft(
  contractAddress: string,
  contract: string,
  tokenId: string,
  msg: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    send_nft: {
      contract,
      token_id: tokenId,
      msg,
    },
  })
}

export function makeMsgErc721Execute(
  contractAddress: string,
  executeMsg: Erc721ExecuteMsg,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, executeMsg)
}
