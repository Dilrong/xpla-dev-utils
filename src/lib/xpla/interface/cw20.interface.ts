export interface Cw20InstantiateMsg {
  name: string
  symbol: string
  decimals: number
  initial_balances: {
    address: string
    amount: string
  }[]
}
