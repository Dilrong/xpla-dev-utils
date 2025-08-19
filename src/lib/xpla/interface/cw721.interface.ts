import { AccAddress } from '@xpla/xpla.js'

export interface Cw721InstantiateMsg {
  name: string
  symbol: string
  minter: AccAddress
  owner: string
}

export interface Cw721Attribute {
  value: string
  trait_type: string
  display_type?: string
}

export interface Cw721Extension {
  name?: string
  description?: string
  image?: string
  image_data?: string
  external_url?: string
  background_color?: string
  animation_url?: string
  youtube_url?: string
  attributes?: Cw721Attribute[]
}

export interface Cw721ExecuteMintMsg {
  mint: {
    owner: string
    token_id: string
    token_uri: string
    extension: Cw721Extension
  }
}
