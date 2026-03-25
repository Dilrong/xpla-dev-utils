import { bech32 } from 'bech32'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * base64를 bytes로 변경한다.
 * @param base64
 */
export function base64ToBytes(base64: string) {
  const binString = atob(base64)
  return Uint8Array.from(binString, (m) => m.codePointAt(0) as number)
}

/**
 * bytes를 Base64로 변경한다.
 * @param bytes
 */
export function bytesToBase64(bytes: Uint8Array): string {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join('')
  return btoa(binString)
}

/**
 * 주소를 요약해서 반환한다.
 * @param address
 * @param startLength
 * @param endLength
 */
export function summarizeAddress(
  address: string,
  startLength = 5,
  endLength = 6,
): string {
  if (!address) return ''
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * 현지화된 숫자 데이터를 반환한다.
 * @param value
 * @returns
 */
export function formatWithCommas(value: number | string): string {
  let convertValue: number

  if (typeof value === 'string') {
    convertValue = parseFloat(value)

    if (isNaN(convertValue)) {
      throw new Error('Input value isNaN')
    }
  } else if (typeof value === 'number') {
    convertValue = value
  } else {
    throw new Error('Invalid input value type')
  }

  return convertValue.toLocaleString()
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}

export function decodeBech32Address(address: string) {
  try {
    const decoded = bech32.decode(address)

    return {
      bytes: Uint8Array.from(bech32.fromWords(decoded.words)),
      prefix: decoded.prefix,
      words: decoded.words,
    }
  } catch {
    return null
  }
}

export function encodeBech32Prefix(words: number[], prefix: string) {
  return bech32.encode(prefix, words)
}

export function normalizeUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

export function formatDuration(duration: string): string {
  const match = duration.match(/^(\d+)(s)$/)

  if (!match) {
    return duration
  }

  const totalSeconds = Number.parseInt(match[1], 10)

  if (!Number.isFinite(totalSeconds)) {
    return duration
  }

  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60

  const units = [
    days ? `${days}d` : '',
    hours ? `${hours}h` : '',
    minutes ? `${minutes}m` : '',
    seconds ? `${seconds}s` : '',
  ].filter(Boolean)

  return units.length ? units.join(' ') : '0s'
}
