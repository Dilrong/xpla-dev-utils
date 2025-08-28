import { MsgInstantiateContract } from '@xpla/xpla.js/dist/core/wasm'
import { MsgExecuteContract } from '@xpla/xpla.js'
import { AccAddress } from '@xpla/xpla.js'
import {
  Erc20InstantiateMsg,
  Erc20ExecuteMsg,
} from '@/lib/xpla/interface/erc20.interface'

export const erc20CodeId = 2

export function makeMsgErc20Instantiate(
  executeMsg: Erc20InstantiateMsg,
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

export function makeMsgErc20Transfer(
  contractAddress: string,
  recipient: string,
  amount: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    transfer: {
      recipient,
      amount,
    },
  })
}

export function makeMsgErc20TransferFrom(
  contractAddress: string,
  owner: string,
  recipient: string,
  amount: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    transfer_from: {
      owner,
      recipient,
      amount,
    },
  })
}

export function makeMsgErc20Approve(
  contractAddress: string,
  spender: string,
  amount: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    approve: {
      spender,
      amount,
    },
  })
}

export function makeMsgErc20IncreaseAllowance(
  contractAddress: string,
  spender: string,
  amount: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    increase_allowance: {
      spender,
      amount,
    },
  })
}

export function makeMsgErc20DecreaseAllowance(
  contractAddress: string,
  spender: string,
  amount: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    decrease_allowance: {
      spender,
      amount,
    },
  })
}

export function makeMsgErc20Mint(
  contractAddress: string,
  recipient: string,
  amount: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    mint: {
      recipient,
      amount,
    },
  })
}

export function makeMsgErc20Burn(
  contractAddress: string,
  amount: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    burn: {
      amount,
    },
  })
}

export function makeMsgErc20BurnFrom(
  contractAddress: string,
  owner: string,
  amount: string,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, {
    burn_from: {
      owner,
      amount,
    },
  })
}

export function makeMsgErc20Execute(
  contractAddress: string,
  executeMsg: Erc20ExecuteMsg,
  sender: string,
): MsgExecuteContract {
  return new MsgExecuteContract(sender, contractAddress, executeMsg)
}
