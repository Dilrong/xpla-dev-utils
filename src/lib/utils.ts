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
  let convertValue: number;

  if (typeof (value) === 'string') {
    convertValue = parseFloat(value);

    if (isNaN(convertValue)) {
      throw new Error('Input value isNaN')
    }
  } else if (typeof (value) === 'number') {
    convertValue = value;
  } else {
    throw new Error('Invalid input value type')
  }

  return convertValue.toLocaleString();
}