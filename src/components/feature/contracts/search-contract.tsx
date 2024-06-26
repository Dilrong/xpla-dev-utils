'use client'

import { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { useContractStore } from '@/lib/store/contract-store'
import StoreContract from '@/components/feature/contracts/store-contract'

const SearchContract = () => {
  const { lcd } = useConfigStore()
  const { setAddress } = useContractStore()
  const [error, setError] = useState(false)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    try {
      const res = await axios.get(`${lcd}/cosmwasm/wasm/v1/contract/${value}`)
      setAddress(res.data.address)
      setError(false)

      if (typeof window !== 'undefined') {
        const newAddress = res.data.address
        const storedAddresses = JSON.parse(
          localStorage.getItem('contract-address-history') || '[]',
        )

        if (!storedAddresses.includes(newAddress)) {
          storedAddresses.push(newAddress)

          if (storedAddresses.length > 5) {
            storedAddresses.shift()
          }

          localStorage.setItem(
            'contract-address-history',
            JSON.stringify(storedAddresses),
          )
        }
      }
    } catch (err) {
      console.error(err)
      setError(true)
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
