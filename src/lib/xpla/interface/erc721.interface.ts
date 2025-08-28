import { AccAddress } from '@xpla/xpla.js'

export interface Erc721InstantiateMsg {
  name: string
  symbol: string
  minter: AccAddress
}

export interface Erc721ExecuteMsg {
  mint?: {
    token_id: string
    owner: string
    token_uri?: string
    extension?: any
  }
  transfer?: {
    from: string
    to: string
    token_id: string
  }
  transfer_from?: {
    from: string
    to: string
    token_id: string
  }
  approve?: {
    to: string
    token_id: string
  }
  approve_all?: {
    operator: string
    approve: boolean
  }
  revoke?: {
    spender: string
    token_id: string
  }
  revoke_all?: {
    operator: string
  }
  burn?: {
    token_id: string
  }
  burn_from?: {
    from: string
    token_id: string
  }
  send_nft?: {
    contract: string
    token_id: string
    msg: string
  }
  extension?: any
}

export interface Erc721QueryMsg {
  owner_of?: {
    token_id: string
    include_expired?: boolean
  }
  approval?: {
    token_id: string
    spender: string
    include_expired?: boolean
  }
  approvals?: {
    token_id: string
    include_expired?: boolean
  }
  operator_all_owner?: {
    owner: string
    operator: string
    include_expired?: boolean
  }
  all_operators?: {
    owner: string
    include_expired?: boolean
    start_after?: string
    limit?: number
  }
  num_tokens?: {}
  contract_info?: {}
  nft_info?: {
    token_id: string
  }
  all_nft_info?: {
    token_id: string
    include_expired?: boolean
  }
  tokens?: {
    owner: string
    start_after?: string
    limit?: number
  }
  all_tokens?: {
    start_after?: string
    limit?: number
  }
  minter?: {}
  extension?: any
}

export interface Erc721OwnerOfResponse {
  owner: string
  approvals: Array<{
    spender: string
    expires?: {
      at_height?: number
      at_time?: number
    }
  }>
}

export interface Erc721ApprovalResponse {
  approval: {
    spender: string
    expires?: {
      at_height?: number
      at_time?: number
    }
  }
}

export interface Erc721ApprovalsResponse {
  approvals: Array<{
    spender: string
    expires?: {
      at_height?: number
      at_time?: number
    }
  }>
}

export interface Erc721OperatorAllOwnerResponse {
  approval: {
    operator: string
    expires?: {
      at_height?: number
      at_time?: number
    }
  }
}

export interface Erc721AllOperatorsResponse {
  operators: Array<{
    operator: string
    expires?: {
      at_height?: number
      at_time?: number
    }
  }>
  next_key?: string
}

export interface Erc721NumTokensResponse {
  count: number
}

export interface Erc721ContractInfoResponse {
  name: string
  symbol: string
}

export interface Erc721NftInfoResponse {
  token_uri?: string
  extension?: any
}

export interface Erc721AllNftInfoResponse {
  access: {
    owner: string
    approvals: Array<{
      spender: string
      expires?: {
        at_height?: number
        at_time?: number
      }
    }>
  }
  info: {
    token_uri?: string
    extension?: any
  }
}

export interface Erc721TokensResponse {
  tokens: string[]
}

export interface Erc721AllTokensResponse {
  tokens: string[]
  next_key?: string
}

export interface Erc721MinterResponse {
  minter: string
}
