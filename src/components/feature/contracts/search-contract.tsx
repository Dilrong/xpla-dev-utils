'use client'

import { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { useContractStore } from '@/lib/store/contract-store'

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
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  return (
    <div className="space-y-2 pb-4">
      <Input
        type="string"
        id="address"
        placeholder="Contract Address"
        onChange={handleChange}
      />
      {error && <p className="text-sm text-rose-600">Contract is Not Found</p>}
    </div>
  )
}

export default SearchContract
