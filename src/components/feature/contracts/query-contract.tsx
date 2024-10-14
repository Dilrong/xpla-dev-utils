'use client'

import { FormEvent, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { useContractStore } from '@/lib/store/contract-store'
import { Button } from '@/components/ui/button'
import JSONPretty from 'react-json-pretty'
import { bytesToBase64 } from '@/lib/utils'

const QueryContract = () => {
  const { lcd } = useConfigStore()
  const { address } = useContractStore()
  const [message, setMessage] = useState(
    bytesToBase64(new TextEncoder().encode('{"":{}}')),
  )
  const [result, setResult] = useState({})
  const [error, setError] = useState('')

  const handleChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget

    const utf8Bytes = new TextEncoder().encode(value)
    const base64Str = bytesToBase64(utf8Bytes)

    setMessage(base64Str)
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.get(
        `${lcd}/cosmwasm/wasm/v1/contract/${address}/smart/${message}`,
      )

      setResult(res.data.data)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response)
        setError(err.response.data.message)
      console.error(err)
    }
  }

  return (
    <>
      <div className="mt-4 space-y-4">
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <Textarea
          placeholder="Input Contract Query Message."
          defaultValue={`{"":{}}`}
          onChangeCapture={(e) => {
            handleChange(e)
          }}
        />
        <Button className="mt-4 w-full" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <JSONPretty id="json-pretty" data={result} />
      </div>
    </>
  )
}

export default QueryContract
