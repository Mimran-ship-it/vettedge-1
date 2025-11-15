"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"

interface PaymentMethodsProps {
  selectedMethod: "stripe" | "paypal"
  onMethodChange: Dispatch<SetStateAction<"stripe" | "paypal">>
  onPaymentSubmit: (paymentData: any) => void // ✅ Calls CheckoutForm method
  loading: boolean
  amount: number
}

export function PaymentMethods({
  selectedMethod,
  onMethodChange,
  onPaymentSubmit,
  loading,
  amount,
}: PaymentMethodsProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [cardholderName, setCardholderName] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (selectedMethod === "stripe") {
      if (!stripe || !elements) {
        setErrorMessage("Stripe not loaded yet")
        return
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        setErrorMessage("Card details not entered")
        return
      }

      // ✅ Call the CheckoutForm handler with all needed info
      onPaymentSubmit({
        method: "stripe",
        stripe,
        cardElement,
        billingDetails: { name: cardholderName },
        amount,
      })
    }

    if (selectedMethod === "paypal") {
      onPaymentSubmit({ method: "paypal", amount })
    }
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
          {/* Method selection */}
          <RadioGroup
            value={selectedMethod}
            onValueChange={(val) => onMethodChange(val as "stripe" | "paypal")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Stripe
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

          {/* Stripe fields */}
          {selectedMethod === "stripe" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <input
                  id="cardName"
                  className="border  w-full p-2 bg-white"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  
                />
              </div>

              <div>
                <Label>Card Details</Label>
                <div className="border  p-3 bg-white">
                  <CardElement
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: { fontSize: "16px", color: "#32325d", fontFamily: "inherit", "::placeholder": { color: "#a0aec0" } },
                        invalid: { color: "#e53e3e" },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PayPal placeholder */}
          {selectedMethod === "paypal" && (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600">
                You will be redirected to PayPal to complete your payment.
              </p>
            </div>
          )}

          {/* Error messages */}
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || (selectedMethod === "stripe" && !stripe)}
          >
            {loading ? "Processing..." : "Complete Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
