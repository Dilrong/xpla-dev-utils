'use client'

import StoreContract from '@/components/feature/contracts/store-contract'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useConfigStore } from '@/lib/store/config-store'
import { useContractStore } from '@/lib/store/contract-store'
import axios from 'axios'
import { ChangeEvent, useState } from 'react'

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

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    try {
      const res = await axios.get(`${lcd}/cosmwasm/wasm/v1/contract/${value}`)
      setAddress(res.data.address)
      setError(false)

      // Contract store HistoryList
      const newAddress = res.data.address
      const storedAddresses = historyList

      if (!storedAddresses.includes(newAddress)) {
        storedAddresses.push(newAddress)

        if (storedAddresses.length > 5) {
          storedAddresses.shift()
        }

        setHistoryList(JSON.stringify(storedAddresses))
      }
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  const onClickFavorite = async (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: input에 있는 값 가져와야한다.
    const { value } = event.target

    const newAddress = value
    const storedAddresses = favoriteList

    if (storedAddresses.includes(newAddress)) {
      storedAddresses.push(newAddress)

      if (storedAddresses.length > 10) {
        toast({
          title: 'favoriteList cannot exceed 10.',
        })
      }

      setFavoriteList(JSON.stringify(storedAddresses))
    }
  }

  return (
    <div className="space-y-2 pb-4">
      <div className="flex flex-row">
        <Input
          type="string"
          id="address"
          placeholder="Contract Address"
          onChange={handleChange}
        />
        <StoreContract />
      </div>
      {error && <p className="text-sm text-rose-600">Contract is Not Found</p>}
    </div>
  )
}

export default SearchContract
