import { AccAddress } from '@xpla/xpla.js'

export interface Erc20InstantiateMsg {
  name: string
  symbol: string
  decimals: number
  initial_supply: string
  owner: AccAddress
}

export interface Erc20ExecuteMsg {
  transfer?: {
    recipient: string
    amount: string
  }
  transfer_from?: {
    owner: string
    recipient: string
    amount: string
  }
  approve?: {
    spender: string
    amount: string
  }
  increase_allowance?: {
    spender: string
    amount: string
  }
  decrease_allowance?: {
    spender: string
    amount: string
  }
  mint?: {
    recipient: string
    amount: string
  }
  burn?: {
    amount: string
  }
  burn_from?: {
    owner: string
    amount: string
  }
}

export interface Erc20QueryMsg {
  balance?: {
    address: string
  }
  token_info?: {}
  allowance?: {
    owner: string
    spender: string
  }
  all_allowances?: {
    owner: string
    start_after?: string
    limit?: number
  }
  all_accounts?: {
    start_after?: string
    limit?: number
  }
  minter?: {}
}

export interface Erc20BalanceResponse {
  balance: string
}

export interface Erc20TokenInfoResponse {
  name: string
  symbol: string
  decimals: number
  total_supply: string
}

export interface Erc20AllowanceResponse {
  allowance: string
  expires?: {
    at_height?: number
    at_time?: number
  }
}

export interface Erc20AllAllowancesResponse {
  allowances: Array<{
    spender: string
    allowance: string
    expires?: {
      at_height?: number
      at_time?: number
    }
  }>
  next_key?: string
}

export interface Erc20AllAccountsResponse {
  accounts: Array<{
    address: string
    balance: string
  }>
  next_key?: string
}

export interface Erc20MinterResponse {
  minter: string
  cap?: string
}
