'use client'

import { FormEvent, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { base64ToBytes, bytesToBase64 } from '@/lib/utils'

const Base64Convert = () => {
  const [base64, setBase64] = useState('')
  const [bytes, setBytes] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.currentTarget

    switch (id) {
      case 'text':
        const base64Str = bytesToBase64(new TextEncoder().encode(value))
        setBytes(value)
        setBase64(base64Str)
        setError('')
        break
      case 'base64':
        try {
          const text = new TextDecoder().decode(base64ToBytes(value))
          setBase64(value)
          setBytes(text)
          setError('')
        } catch (err) {
          setError('The string to be decoded is not correctly encoded.')
        }
        break
      default:
        setError('Id is not found.')
        break
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5 space-y-2 py-4">
        <Label htmlFor="text">Text</Label>
        <Textarea
          id="text"
          placeholder="Input the text you want to convert to base64"
          onChangeCapture={(e) => {
            handleChange(e)
          }}
          value={bytes}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5 space-y-2 py-4">
        <Label htmlFor="base64">Base64</Label>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <Textarea
          id="base64"
          placeholder="Input the base64 you want to convert to text"
          onChangeCapture={(e) => {
            handleChange(e)
          }}
          value={base64}
        />
      </div>
    </div>
  )
}

export default Base64Convert
