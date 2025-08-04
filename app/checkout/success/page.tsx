"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Mail } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (orderId) {
      // Fetch order details
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrderDetails(data))
        .catch((err) => console.error("Error fetching order:", err))
    }
  }, [orderId])

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span className="text-gray-600">#{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span className="text-gray-600">${orderDetails.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Status:</span>
                <span className="text-green-600 font-medium">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order Date:</span>
                <span className="text-gray-600">{new Date(orderDetails.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Domains Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderDetails.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.domain.name}</p>
                    <p className="text-sm text-gray-600">{item.domain.category}</p>
                  </div>
                  <p className="font-medium">${item.domain.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• You will receive a confirmation email shortly</li>
            <li>• Domain transfer instructions will be sent within 24 hours</li>
            <li>• Our team will contact you to complete the vetting process</li>
            <li>• You can track your order status in your dashboard</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard">
              <Mail className="h-4 w-4 mr-2" />
              View Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/orders">
              <Download className="h-4 w-4 mr-2" />
              View Orders
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
