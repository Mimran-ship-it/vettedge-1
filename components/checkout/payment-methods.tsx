"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet, Building } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

interface PaymentMethodsProps {
  selectedMethod: "stripe" | "paypal"
  onMethodChange: Dispatch<SetStateAction<"stripe" | "paypal">>
  onPaymentSubmit: (paymentData: any) => void
  loading: boolean
}

export function PaymentMethods({
  selectedMethod,
  onMethodChange,
  onPaymentSubmit,
  loading,
}: PaymentMethodsProps) {
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const paymentData = {
      method: selectedMethod,
      ...(selectedMethod === "stripe" && { card: cardData }), // using "stripe" for card payments
    }

    onPaymentSubmit(paymentData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> This is a demonstration. No real payments will be processed.
            </p>
          </div>

          <RadioGroup value={selectedMethod} onValueChange={(val) => onMethodChange(val as "stripe" | "paypal")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                PayPal
              </Label>
            </div>
          </RadioGroup>

          {selectedMethod === "stripe" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData((prev) => ({ ...prev, number: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData((prev) => ({ ...prev, expiry: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardData.cvc}
                    onChange={(e) => setCardData((prev) => ({ ...prev, cvc: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === "paypal" && (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600">You will be redirected to PayPal to complete your payment.</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Complete Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
