"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  CreditCard, 
  Smartphone, 
  Bitcoin, 
  DollarSign, 
  Banknote, 
  Lock, 
  ArrowLeft, 
  Copy, 
  Check,
  Loader2,
  X
} from 'lucide-react'

interface PaymentMethod {
  _id: string
  name: string
  type: 'cashapp' | 'paypal' | 'crypto' | 'venmo' | 'zelle'
  details: {
    cashtag?: string
    paypalEmail?: string
    walletAddress?: string
    cryptoType?: string
    venmoHandle?: string
    zelleEmail?: string
    zellePhone?: string
  }
  instructions?: string
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  bookingId: string | null
  serviceName: string
  onPaymentComplete: (paymentMethod: PaymentMethod, reference: string) => void
}

const paymentTypeIcons = {
  cashapp: <Smartphone className="w-6 h-6" />,
  paypal: <CreditCard className="w-6 h-6" />,
  crypto: <Bitcoin className="w-6 h-6" />,
  venmo: <DollarSign className="w-6 h-6" />,
  zelle: <Banknote className="w-6 h-6" />
}

const paymentTypeColors = {
  cashapp: 'bg-green-500',
  paypal: 'bg-blue-500',
  crypto: 'bg-orange-500',
  venmo: 'bg-blue-600',
  zelle: 'bg-purple-500'
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  bookingId, 
  serviceName, 
  onPaymentComplete 
}: PaymentModalProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [step, setStep] = useState<'select' | 'pay' | 'processing' | 'success' | 'failed'>('select')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [reference, setReference] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods()
      setStep('select')
      setSelectedMethod(null)
      setReference('')
    }
  }, [isOpen])

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payment-methods')
      const data = await response.json()
      
      if (data.success && Array.isArray(data.paymentMethods)) {
        setPaymentMethods(data.paymentMethods)
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
      toast({ 
        title: 'Error', 
        description: 'Could not load payment methods.', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setStep('pay')
  }

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast({ title: 'Copied!', description: `${type} copied to clipboard` })
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to copy to clipboard', variant: 'destructive' })
    }
  }

  const simulatePayment = async () => {
    if (!selectedMethod) return

    setStep('processing')
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate reference
      const paymentRef = `${selectedMethod.type.toUpperCase()}-${Date.now()}`
      setReference(paymentRef)
      
      // Update booking payment status
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentMethod: selectedMethod.type,
          paymentDetails: {
            methodId: selectedMethod._id,
            reference: paymentRef,
            confirmedAt: new Date()
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update payment status')
      }
      
      setStep('success')
      
      // Auto close and trigger completion after 2 seconds
      setTimeout(() => {
        onPaymentComplete(selectedMethod, paymentRef)
        onClose()
      }, 2500)
      
    } catch (error) {
      console.error('Payment simulation failed:', error)
      setStep('failed')
      toast({
        title: 'Payment Failed',
        description: 'Could not process your payment. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const renderSelectStep = () => (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select how you'd like to complete your payment
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold">${amount}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-600">Service</span>
          <span className="text-sm font-medium">{serviceName}</span>
        </div>
      </div>

      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <button
            key={method._id}
            onClick={() => handleMethodSelect(method)}
            className="w-full flex items-center p-4 border rounded-lg hover:border-primary transition-colors text-left"
          >
            <div className={`w-12 h-12 rounded-lg ${paymentTypeColors[method.type]} flex items-center justify-center text-white mr-4`}>
              {paymentTypeIcons[method.type]}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{method.name}</h4>
              <p className="text-sm text-gray-500 capitalize">{method.type}</p>
            </div>
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderPayStep = () => {
    if (!selectedMethod) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setStep('select')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded ${paymentTypeColors[selectedMethod.type]} flex items-center justify-center text-white`}>
              {paymentTypeIcons[selectedMethod.type]}
            </div>
            <span className="font-medium">{selectedMethod.name}</span>
          </div>
        </div>

        <Separator />

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount to Pay</span>
            <span className="text-2xl font-bold">${amount}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Payment Instructions</h4>
          
          {selectedMethod.type === 'cashapp' && selectedMethod.details.cashtag && (
            <div className="space-y-2">
              <p className="text-sm text-blue-800">Send payment to this CashApp:</p>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="font-mono text-lg font-bold">{selectedMethod.details.cashtag}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(selectedMethod.details.cashtag!, 'CashApp tag')}
                >
                  {copied === 'CashApp tag' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {selectedMethod.type === 'paypal' && selectedMethod.details.paypalEmail && (
            <div className="space-y-2">
              <p className="text-sm text-blue-800">Send payment to this PayPal email:</p>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="font-mono">{selectedMethod.details.paypalEmail}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(selectedMethod.details.paypalEmail!, 'PayPal email')}
                >
                  {copied === 'PayPal email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {selectedMethod.type === 'crypto' && selectedMethod.details.walletAddress && (
            <div className="space-y-2">
              <p className="text-sm text-blue-800">
                Send {selectedMethod.details.cryptoType || 'crypto'} to this wallet:
              </p>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Wallet Address</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(selectedMethod.details.walletAddress!, 'wallet address')}
                  >
                    {copied === 'wallet address' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <code className="text-xs break-all bg-gray-50 p-2 rounded block">
                  {selectedMethod.details.walletAddress}
                </code>
              </div>
            </div>
          )}

          {selectedMethod.type === 'venmo' && selectedMethod.details.venmoHandle && (
            <div className="space-y-2">
              <p className="text-sm text-blue-800">Send payment to this Venmo:</p>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="font-mono text-lg font-bold">{selectedMethod.details.venmoHandle}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(selectedMethod.details.venmoHandle!, 'Venmo handle')}
                >
                  {copied === 'Venmo handle' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {selectedMethod.type === 'zelle' && (selectedMethod.details.zelleEmail || selectedMethod.details.zellePhone) && (
            <div className="space-y-2">
              <p className="text-sm text-blue-800">Send payment via Zelle to:</p>
              {selectedMethod.details.zelleEmail && (
                <div className="flex items-center justify-between bg-white p-3 rounded border mb-2">
                  <span className="font-mono">{selectedMethod.details.zelleEmail}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(selectedMethod.details.zelleEmail!, 'Zelle email')}
                  >
                    {copied === 'Zelle email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              )}
              {selectedMethod.details.zellePhone && (
                <div className="flex items-center justify-between bg-white p-3 rounded border">
                  <span className="font-mono">{selectedMethod.details.zellePhone}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(selectedMethod.details.zellePhone!, 'Zelle phone')}
                  >
                    {copied === 'Zelle phone' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              )}
            </div>
          )}

          {selectedMethod.instructions && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">{selectedMethod.instructions}</p>
            </div>
          )}

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Include booking reference <strong>#{bookingId}</strong> in your payment note/memo.
            </p>
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={simulatePayment}
        >
          I've Made the Payment - Confirm Booking
        </Button>

        <div className="flex items-center justify-center text-xs text-gray-500">
          <Lock className="w-3 h-3 mr-1" />
          Secure payment processing
        </div>
      </div>
    )
  }

  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Processing Payment...</h3>
      <p className="text-sm text-muted-foreground">
        Please wait while we confirm your payment
      </p>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Your booking has been confirmed
      </p>
      {reference && (
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
          <code className="text-sm font-mono">{reference}</code>
        </div>
      )}
    </div>
  )

  const renderFailedStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Failed</h3>
      <p className="text-sm text-muted-foreground mb-4">
        There was an issue processing your payment
      </p>
      <div className="space-y-2">
        <Button onClick={() => setStep('pay')} className="w-full">
          Try Again
        </Button>
        <Button variant="outline" onClick={() => setStep('select')} className="w-full">
          Choose Different Method
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Secure Payment</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading payment methods...</p>
          </div>
        ) : (
          <>
            {step === 'select' && renderSelectStep()}
            {step === 'pay' && renderPayStep()}
            {step === 'processing' && renderProcessingStep()}
            {step === 'success' && renderSuccessStep()}
            {step === 'failed' && renderFailedStep()}
          </>
        )}
        
        {paymentMethods.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payment methods available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
