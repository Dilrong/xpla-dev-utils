'use client'

import StoreContract from '@/components/feature/contracts/store-contract'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useConfigStore } from '@/lib/store/config-store'
import { useContractStore } from '@/lib/store/contract-store'
import axios from 'axios'
import { ChangeEvent, useState } from 'react'
import { bech32 } from 'bech32'

const SearchContract = () => {
  const { lcd } = useConfigStore()
  const { toast } = useToast()
  const {
    historyList,
    setHistoryList,
    favoriteList,
    setFavoriteList,
    setAddress,
  } = useContractStore()
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // bech32 주소 유효성 검증
  const isValidBech32Address = (address: string): boolean => {
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

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    // 입력값이 비어있으면 에러 상태 초기화
    if (!value.trim()) {
      setError(false)
      setErrorMessage('')
      setAddress('')
      return
    }

    // bech32 주소 형식 검증
    if (!isValidBech32Address(value)) {
      setError(true)
      setErrorMessage('Invalid XPLA address format. Must start with "xpla1"')
      setAddress('')
      return
    }

    try {
      setError(false)
      setErrorMessage('')

      const res = await axios.get(`${lcd}/cosmwasm/wasm/v1/contract/${value}`)

      if (res.data && res.data.address) {
        setAddress(res.data.address)

        // Contract store HistoryList - 중복 방지 및 최신 순으로 정렬
        setHistoryList(res.data.address)

        toast({
          title: 'Contract found',
          description: 'Contract address has been loaded successfully.',
        })
      } else {
        throw new Error('Invalid contract response')
      }
    } catch (err) {
      console.error(err)
      setError(true)
      setErrorMessage('Contract not found or invalid contract address')
      setAddress('')

      toast({
        title: 'Contract not found',
        description: 'Please check the contract address and try again.',
        variant: 'destructive',
      })
    }
  }

  const onClickFavorite = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (!isValidBech32Address(value)) {
      toast({
        title: 'Invalid address',
        description: 'Cannot add invalid address to favorites.',
        variant: 'destructive',
      })
      return
    }

    // 이미 즐겨찾기에 있는지 확인
    if (favoriteList.includes(value)) {
      toast({
        title: 'Already in favorites',
        description: 'This address is already in your favorites.',
      })
      return
    }

    // 즐겨찾기에 추가
    setFavoriteList(value)

    toast({
      title: 'Added to favorites',
      description: 'Contract address has been added to favorites.',
    })
  }

  return (
    <div className="space-y-2 pb-4">
      <div className="flex flex-row">
        <Input
          type="string"
          id="address"
          placeholder="xpla1..."
          onChange={handleChange}
        />
        <StoreContract />
      </div>
      {error && (
        <p className="text-sm text-red-600">
          {errorMessage || 'Contract is not found'}
        </p>
      )}
    </div>
  )
}

export default SearchContract
