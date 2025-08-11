"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Upload } from 'lucide-react'

interface CreditCardFormProps {
  onSubmit: (cardData: any) => void
  loading?: boolean
}

export default function CreditCardForm({ onSubmit, loading }: CreditCardFormProps) {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    frontImageUrl: '',
    backImageUrl: ''
  })
  const [uploadingFront, setUploadingFront] = useState(false)
  const [uploadingBack, setUploadingBack] = useState(false)

  const handleImageUpload = async (file: File, side: 'front' | 'back') => {
    const setUploading = side === 'front' ? setUploadingFront : setUploadingBack
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCardData(prev => ({
          ...prev,
          [side === 'front' ? 'frontImageUrl' : 'backImageUrl']: result.fileUrl
        }))
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleCameraCapture = async (side: 'front' | 'back') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `card-${side}-${Date.now()}.jpg`, { type: 'image/jpeg' })
            await handleImageUpload(file, side)
          }
          stream.getTracks().forEach(track => track.stop())
        }, 'image/jpeg', 0.8)
      })
    } catch (error) {
      console.error('Camera error:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(cardData)
  }

  const isValid = cardData.cardNumber && cardData.expiryDate && cardData.cvv && 
                 cardData.cardholderName && cardData.frontImageUrl && cardData.backImageUrl

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardData.cardNumber}
            onChange={(e) => setCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
            maxLength={19}
          />
        </div>
        <div>
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={cardData.cardholderName}
            onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            value={cardData.expiryDate}
            onChange={(e) => setCardData(prev => ({ ...prev, expiryDate: e.target.value }))}
            maxLength={5}
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={cardData.cvv}
            onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
            maxLength={4}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Card Images (Required)</Label>
        
        {/* Front Side */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium">Front Side</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'front')
                }}
                disabled={uploadingFront}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCameraCapture('front')}
                disabled={uploadingFront}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            {cardData.frontImageUrl && (
              <div className="mt-2 text-sm text-green-600">✓ Front uploaded</div>
            )}
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium">Back Side</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'back')
                }}
                disabled={uploadingBack}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCameraCapture('back')}
                disabled={uploadingBack}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            {cardData.backImageUrl && (
              <div className="mt-2 text-sm text-green-600">✓ Back uploaded</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isValid || loading}
      >
        {loading ? 'Processing...' : 'Process Payment'}
      </Button>
    </form>
  )
}