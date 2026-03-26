import { bytesToBase64, normalizeUrl } from '@/lib/utils'
import { ContractSnapshot } from '@/lib/xpla/contract/metadata'

type JsonRecord = Record<string, unknown>

interface SmartQueryEnvelope<T> {
  data?: T
}

interface FungibleTokenInfoResponse {
  name?: string
  symbol?: string
  decimals?: number
  total_supply?: string
}

interface AllAccountsResponse {
  accounts?: string[]
}

interface BalanceResponse {
  balance?: string
}

interface MinterResponse {
  minter?: string
}

interface NftContractInfoResponse {
  name?: string
  symbol?: string
}

interface NumTokensResponse {
  count?: number
}

interface AllTokensResponse {
  tokens?: string[]
}

interface OwnerOfResponse {
  owner?: string
}

interface NftInfoResponse {
  token_uri?: string
}

export type ContractStandard = 'cw20' | 'erc20' | 'cw721' | 'erc721' | 'generic'
export type ContractFamily = 'fungible' | 'nft' | 'generic'

export interface ContractExample {
  name: string
  description: string
  payload: string
}

export interface ContractProfile {
  standard: ContractStandard
  family: ContractFamily
  displayName: string
  symbol: string | null
  decimals: number | null
  totalSupply: string | null
  tokenCount: number | null
  sampleHolder: string | null
  sampleBalance: string | null
  sampleTokenId: string | null
  sampleOwner: string | null
  minter: string | null
  tokenUri: string | null
  queryExamples: ContractExample[]
  executeExamples: ContractExample[]
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null
}

function serializePayload(payload: unknown) {
  return JSON.stringify(payload, null, 2)
}

function formatIntegerString(value?: string | null) {
  if (!value) {
    return '-'
  }

  try {
    return BigInt(value).toLocaleString()
  } catch {
    return value
  }
}

function getInstantiateMessage(snapshot: ContractSnapshot) {
  const initEntry = snapshot.history.find((entry) =>
    entry.operation?.includes('INIT'),
  )

  return isRecord(initEntry?.msg) ? initEntry.msg : null
}

function getString(record: JsonRecord | null, key: string) {
  if (!record) {
    return null
  }

  const value = record[key]
  return typeof value === 'string' ? value : null
}

function getInitialBalanceAddress(instantiateMessage: JsonRecord | null) {
  const balances = instantiateMessage?.initial_balances
  if (!Array.isArray(balances)) {
    return null
  }

  const firstBalance = balances.find((entry) => isRecord(entry))
  if (!firstBalance || !isRecord(firstBalance)) {
    return null
  }

  return typeof firstBalance.address === 'string' ? firstBalance.address : null
}

function getInitialBalanceAmount(instantiateMessage: JsonRecord | null) {
  const balances = instantiateMessage?.initial_balances
  if (!Array.isArray(balances)) {
    return null
  }

  const firstBalance = balances.find((entry) => isRecord(entry))
  if (!firstBalance || !isRecord(firstBalance)) {
    return null
  }

  return typeof firstBalance.amount === 'string' ? firstBalance.amount : null
}

function buildTokenAmount(
  decimals: number | null,
  balance: string | null,
  fallback = '1000000',
) {
  try {
    const oneWhole =
      decimals !== null && decimals >= 0 && decimals <= 18
        ? 10n ** BigInt(decimals)
        : BigInt(fallback)

    const liveBalance = balance ? BigInt(balance) : null
    if (!liveBalance || liveBalance <= 0n) {
      return oneWhole.toString()
    }

    return (liveBalance < oneWhole ? liveBalance : oneWhole).toString()
  } catch {
    return fallback
  }
}

function getNextTokenId(
  sampleTokenId: string | null,
  tokenCount: number | null,
) {
  if (sampleTokenId) {
    try {
      return (BigInt(sampleTokenId) + 1n).toString()
    } catch {
      return `${sampleTokenId}-copy`
    }
  }

  if (tokenCount !== null) {
    return String(tokenCount + 1)
  }

  return 'demo-token-1'
}

function inferFungibleStandard(
  instantiateMessage: JsonRecord | null,
): ContractStandard {
  if (instantiateMessage && 'initial_supply' in instantiateMessage) {
    return 'erc20'
  }

  return 'cw20'
}

function inferNftStandard(
  instantiateMessage: JsonRecord | null,
): ContractStandard {
  if (instantiateMessage && 'owner' in instantiateMessage) {
    return 'cw721'
  }

  return 'erc721'
}

export function getContractStandardLabel(standard: ContractStandard) {
  switch (standard) {
    case 'cw20':
      return 'CW20'
    case 'erc20':
      return 'ERC20'
    case 'cw721':
      return 'CW721'
    case 'erc721':
      return 'ERC721'
    default:
      return 'Generic'
  }
}

export function getContractFamilyLabel(family: ContractFamily) {
  switch (family) {
    case 'fungible':
      return 'Fungible token'
    case 'nft':
      return 'NFT collection'
    default:
      return 'Generic contract'
  }
}

async function smartQuery<T>(
  lcd: string,
  address: string,
  query: unknown,
): Promise<T | null> {
  try {
    const baseUrl = normalizeUrl(lcd)
    const encoded = bytesToBase64(
      new TextEncoder().encode(JSON.stringify(query)),
    )
    const response = await fetch(
      `${baseUrl}/cosmwasm/wasm/v1/contract/${address}/smart/${encoded}`,
      {
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as SmartQueryEnvelope<T>
    return payload.data ?? null
  } catch {
    return null
  }
}

async function buildFungibleProfile(
  lcd: string,
  snapshot: ContractSnapshot,
  instantiateMessage: JsonRecord | null,
  tokenInfo: FungibleTokenInfoResponse,
): Promise<ContractProfile> {
  const allAccounts = await smartQuery<AllAccountsResponse>(
    lcd,
    snapshot.address,
    {
      all_accounts: { limit: 1 },
    },
  )
  const minterResponse = await smartQuery<MinterResponse>(
    lcd,
    snapshot.address,
    {
      minter: {},
    },
  )

  const sampleHolder =
    allAccounts?.accounts?.[0] ??
    getInitialBalanceAddress(instantiateMessage) ??
    snapshot.info.creator ??
    snapshot.info.admin ??
    null

  const balanceResponse = sampleHolder
    ? await smartQuery<BalanceResponse>(lcd, snapshot.address, {
        balance: { address: sampleHolder },
      })
    : null

  const standard = inferFungibleStandard(instantiateMessage)
  const recipient =
    sampleHolder ?? snapshot.info.admin ?? snapshot.info.creator ?? 'xpla1...'
  const spender =
    minterResponse?.minter ??
    snapshot.info.admin ??
    snapshot.info.creator ??
    recipient
  const sampleBalance =
    balanceResponse?.balance ?? getInitialBalanceAmount(instantiateMessage)
  const transferAmount = buildTokenAmount(
    tokenInfo.decimals ?? null,
    sampleBalance,
  )
  const minter =
    minterResponse?.minter ??
    getString(instantiateMessage, 'owner') ??
    snapshot.info.admin ??
    null

  const queryExamples: ContractExample[] = [
    {
      name: 'Token info',
      description: `Read live metadata for ${tokenInfo.symbol ?? snapshot.info.label}.`,
      payload: serializePayload({ token_info: {} }),
    },
  ]

  if (sampleHolder) {
    queryExamples.push({
      name: 'Balance',
      description: `Check a live holder balance for ${sampleHolder}.`,
      payload: serializePayload({
        balance: {
          address: sampleHolder,
        },
      }),
    })
  }

  queryExamples.push({
    name: 'All accounts',
    description: 'List token holders from live contract state.',
    payload: serializePayload({
      all_accounts: {
        limit: 10,
      },
    }),
  })

  if (minter) {
    queryExamples.push({
      name: 'Minter',
      description: 'Inspect the current mint authority.',
      payload: serializePayload({ minter: {} }),
    })
  }

  const executeExamples: ContractExample[] = [
    {
      name: 'Transfer',
      description: `Send ${transferAmount} base units to a live holder address.`,
      payload: serializePayload({
        transfer: {
          recipient,
          amount: transferAmount,
        },
      }),
    },
    {
      name: 'Approve',
      description: `Approve ${spender} to spend ${transferAmount} base units.`,
      payload: serializePayload({
        approve: {
          spender,
          amount: transferAmount,
        },
      }),
    },
    {
      name: 'Burn',
      description: `Burn ${transferAmount} base units from the connected wallet.`,
      payload: serializePayload({
        burn: {
          amount: transferAmount,
        },
      }),
    },
  ]

  if (minter) {
    executeExamples.splice(2, 0, {
      name: 'Mint',
      description: `Mint ${transferAmount} base units to ${recipient}.`,
      payload: serializePayload({
        mint: {
          recipient,
          amount: transferAmount,
        },
      }),
    })
  }

  return {
    standard,
    family: 'fungible',
    displayName: tokenInfo.name ?? snapshot.info.label,
    symbol: tokenInfo.symbol ?? null,
    decimals: tokenInfo.decimals ?? null,
    totalSupply: tokenInfo.total_supply ?? null,
    tokenCount: null,
    sampleHolder,
    sampleBalance,
    sampleTokenId: null,
    sampleOwner: null,
    minter,
    tokenUri: null,
    queryExamples,
    executeExamples,
  }
}

async function buildNftProfile(
  lcd: string,
  snapshot: ContractSnapshot,
  instantiateMessage: JsonRecord | null,
  contractInfo: NftContractInfoResponse,
  numTokens: NumTokensResponse,
): Promise<ContractProfile> {
  const allTokens = await smartQuery<AllTokensResponse>(lcd, snapshot.address, {
    all_tokens: { limit: 1 },
  })

  const sampleTokenId = allTokens?.tokens?.[0] ?? null
  const ownerOf = sampleTokenId
    ? await smartQuery<OwnerOfResponse>(lcd, snapshot.address, {
        owner_of: {
          token_id: sampleTokenId,
        },
      })
    : null
  const nftInfo = sampleTokenId
    ? await smartQuery<NftInfoResponse>(lcd, snapshot.address, {
        nft_info: {
          token_id: sampleTokenId,
        },
      })
    : null
  const minterResponse = await smartQuery<MinterResponse>(
    lcd,
    snapshot.address,
    {
      minter: {},
    },
  )

  const standard = inferNftStandard(instantiateMessage)
  const sampleOwner =
    ownerOf?.owner ??
    getString(instantiateMessage, 'owner') ??
    snapshot.info.creator ??
    null
  const recipient =
    sampleOwner ?? minterResponse?.minter ?? snapshot.info.creator ?? 'xpla1...'
  const operator =
    minterResponse?.minter ??
    snapshot.info.admin ??
    snapshot.info.creator ??
    recipient
  const mintTokenId = getNextTokenId(sampleTokenId, numTokens.count ?? null)
  const tokenUri =
    nftInfo?.token_uri ?? 'https://example.com/metadata/demo.json'

  const queryExamples: ContractExample[] = [
    {
      name: 'Contract info',
      description: `Read live collection metadata for ${contractInfo.symbol ?? snapshot.info.label}.`,
      payload: serializePayload({ contract_info: {} }),
    },
    {
      name: 'Token count',
      description: 'Inspect the current minted token count.',
      payload: serializePayload({ num_tokens: {} }),
    },
    {
      name: 'All tokens',
      description: 'List token IDs from the live collection.',
      payload: serializePayload({
        all_tokens: {
          limit: 10,
        },
      }),
    },
  ]

  if (sampleTokenId) {
    queryExamples.push(
      {
        name: 'Owner of token',
        description: `Read the current owner for token ${sampleTokenId}.`,
        payload: serializePayload({
          owner_of: {
            token_id: sampleTokenId,
          },
        }),
      },
      {
        name: 'NFT info',
        description: `Fetch the metadata payload for token ${sampleTokenId}.`,
        payload: serializePayload({
          nft_info: {
            token_id: sampleTokenId,
          },
        }),
      },
    )
  }

  const executeExamples: ContractExample[] = [
    {
      name: 'Mint',
      description: `Mint token ${mintTokenId} to ${recipient}.`,
      payload: serializePayload({
        mint: {
          token_id: mintTokenId,
          owner: recipient,
          token_uri: tokenUri,
        },
      }),
    },
    standard === 'erc721'
      ? {
          name: 'Transfer',
          description: `Transfer token ${sampleTokenId ?? mintTokenId} between live addresses.`,
          payload: serializePayload({
            transfer: {
              from: sampleOwner ?? recipient,
              to: recipient,
              token_id: sampleTokenId ?? mintTokenId,
            },
          }),
        }
      : {
          name: 'Transfer NFT',
          description: `Transfer token ${sampleTokenId ?? mintTokenId} to a live account address.`,
          payload: serializePayload({
            transfer_nft: {
              recipient,
              token_id: sampleTokenId ?? mintTokenId,
            },
          }),
        },
    standard === 'erc721'
      ? {
          name: 'Approve',
          description: `Approve ${operator} on token ${sampleTokenId ?? mintTokenId}.`,
          payload: serializePayload({
            approve: {
              to: operator,
              token_id: sampleTokenId ?? mintTokenId,
            },
          }),
        }
      : {
          name: 'Approve',
          description: `Approve ${operator} on token ${sampleTokenId ?? mintTokenId}.`,
          payload: serializePayload({
            approve: {
              spender: operator,
              token_id: sampleTokenId ?? mintTokenId,
            },
          }),
        },
    {
      name: 'Burn',
      description: `Burn token ${sampleTokenId ?? mintTokenId}.`,
      payload: serializePayload({
        burn: {
          token_id: sampleTokenId ?? mintTokenId,
        },
      }),
    },
  ]

  return {
    standard,
    family: 'nft',
    displayName: contractInfo.name ?? snapshot.info.label,
    symbol: contractInfo.symbol ?? null,
    decimals: null,
    totalSupply: null,
    tokenCount: numTokens.count ?? null,
    sampleHolder: null,
    sampleBalance: null,
    sampleTokenId,
    sampleOwner,
    minter: minterResponse?.minter ?? getString(instantiateMessage, 'minter'),
    tokenUri: nftInfo?.token_uri ?? null,
    queryExamples,
    executeExamples,
  }
}

function buildGenericProfile(snapshot: ContractSnapshot): ContractProfile {
  return {
    standard: 'generic',
    family: 'generic',
    displayName: snapshot.info.label,
    symbol: null,
    decimals: null,
    totalSupply: null,
    tokenCount: null,
    sampleHolder: null,
    sampleBalance: null,
    sampleTokenId: null,
    sampleOwner: null,
    minter: null,
    tokenUri: null,
    queryExamples: [],
    executeExamples: [],
  }
}

export async function fetchContractProfile(
  lcd: string,
  snapshot: ContractSnapshot,
): Promise<ContractProfile> {
  const instantiateMessage = getInstantiateMessage(snapshot)
  const tokenInfo = await smartQuery<FungibleTokenInfoResponse>(
    lcd,
    snapshot.address,
    {
      token_info: {},
    },
  )

  if (tokenInfo?.name && tokenInfo?.symbol) {
    return buildFungibleProfile(lcd, snapshot, instantiateMessage, tokenInfo)
  }

  const contractInfo = await smartQuery<NftContractInfoResponse>(
    lcd,
    snapshot.address,
    {
      contract_info: {},
    },
  )
  const numTokens = await smartQuery<NumTokensResponse>(lcd, snapshot.address, {
    num_tokens: {},
  })

  if (contractInfo?.name && contractInfo?.symbol && numTokens) {
    return buildNftProfile(
      lcd,
      snapshot,
      instantiateMessage,
      contractInfo,
      numTokens,
    )
  }

  return buildGenericProfile(snapshot)
}

export function getContractProfileSummary(profile: ContractProfile) {
  if (profile.family === 'fungible') {
    return [
      {
        label: 'Detected',
        value: `${getContractStandardLabel(profile.standard)} ${getContractFamilyLabel(profile.family)}`,
      },
      {
        label: 'Symbol',
        value: profile.symbol ?? '-',
      },
      {
        label: 'Decimals',
        value: profile.decimals !== null ? String(profile.decimals) : '-',
      },
      {
        label: 'Total supply',
        value: formatIntegerString(profile.totalSupply),
      },
      {
        label: 'Sample holder',
        value: profile.sampleHolder ?? '-',
      },
      {
        label: 'Sample balance',
        value: formatIntegerString(profile.sampleBalance),
      },
    ]
  }

  if (profile.family === 'nft') {
    return [
      {
        label: 'Detected',
        value: `${getContractStandardLabel(profile.standard)} ${getContractFamilyLabel(profile.family)}`,
      },
      {
        label: 'Symbol',
        value: profile.symbol ?? '-',
      },
      {
        label: 'Tokens',
        value:
          profile.tokenCount !== null
            ? profile.tokenCount.toLocaleString()
            : '-',
      },
      {
        label: 'Sample token',
        value: profile.sampleTokenId ?? '-',
      },
      {
        label: 'Sample owner',
        value: profile.sampleOwner ?? '-',
      },
      {
        label: 'Minter',
        value: profile.minter ?? '-',
      },
    ]
  }

  return [
    {
      label: 'Detected',
      value: getContractFamilyLabel(profile.family),
    },
    {
      label: 'Examples',
      value: 'No standard query or execute examples were inferred.',
    },
  ]
}
