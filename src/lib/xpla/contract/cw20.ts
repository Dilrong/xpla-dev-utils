import { MsgInstantiateContract } from '@xpla/xpla.js/dist/core/wasm'
import { AccAddress, Coins } from '@xpla/xpla.js'
import { Cw20InstantiateMsg } from '@/lib/xpla/interface/cw20.interface'

export const cw20CodeId = 1

export function makeMsgCw20Instantiate(
  executeMsg: Cw20InstantiateMsg,
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
