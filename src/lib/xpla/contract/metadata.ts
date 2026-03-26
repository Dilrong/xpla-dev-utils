import { bech32 } from 'bech32'
import { normalizeUrl } from '@/lib/utils'

interface ContractInfoResponse {
  address?: string
  contract_address?: string
  contract_info?: {
    code_id?: string
    creator?: string
    admin?: string
    label?: string
    created?: {
      block_height?: string
      tx_index?: string
    }
    ibc_port_id?: string
  }
}

interface ContractHistoryResponse {
  entries?: ContractHistoryEntry[]
}

export interface ContractHistoryEntry {
  operation?: string
  code_id?: string
  updated?: {
    block_height?: string
    tx_index?: string
  }
  msg?: unknown
}

export interface ContractSnapshot {
  address: string
  info: {
    codeId: string
    creator: string
    admin: string | null
    label: string
    createdHeight: string
    createdTxIndex: string
    ibcPortId: string | null
  }
  history: ContractHistoryEntry[]
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export function isValidXplaAddress(address: string): boolean {
  try {
    if (!address.startsWith('xpla1')) {
      return false
    }

    bech32.decode(address)
    return true
  } catch {
    return false
  }
}

export function formatContractHistoryOperation(operation?: string) {
  if (!operation) {
    return 'Unknown'
  }

  return operation
    .replace('CONTRACT_CODE_HISTORY_OPERATION_TYPE_', '')
    .replaceAll('_', ' ')
}

export async function fetchContractSnapshot(
  lcd: string,
  address: string,
): Promise<ContractSnapshot> {
  const baseUrl = normalizeUrl(lcd)
  const contractResponse = await getJson<ContractInfoResponse>(
    `${baseUrl}/cosmwasm/wasm/v1/contract/${address}`,
  )
  const historyResponse = await getJson<ContractHistoryResponse>(
    `${baseUrl}/cosmwasm/wasm/v1/contract/${address}/history`,
  )

  const contractInfo = contractResponse.contract_info

  return {
    address:
      contractResponse.address ?? contractResponse.contract_address ?? address,
    info: {
      codeId: contractInfo?.code_id ?? '-',
      creator: contractInfo?.creator ?? '',
      admin: contractInfo?.admin || null,
      label: contractInfo?.label ?? 'Unlabeled contract',
      createdHeight: contractInfo?.created?.block_height ?? '-',
      createdTxIndex: contractInfo?.created?.tx_index ?? '-',
      ibcPortId: contractInfo?.ibc_port_id || null,
    },
    history: historyResponse.entries ?? [],
  }
}
