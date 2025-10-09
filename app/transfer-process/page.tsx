"use client"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Lock, Key, Send, CheckCircle, Loader2, MailCheck, ShieldCheck, Package, Receipt } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface BillingInfo {
  email?: string
  name?: string
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  phone?: string
}

interface Order {
  _id: string
  sessionId: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  paymentStatus: string
  billingInfo: BillingInfo
  domainTransfer: string
  createdAt: string
}

const steps = [
  {
    title: "Confirmation of Payment",
    description: "You'll receive an order confirmation email. Our team will verify the payment and prepare the domain for transfer. This usually takes up to 24 hours, but often much sooner.",
    icon: CheckCircle,
  },
  {
    title: "You Provide Transfer Info",
    description: "Depending on the registrar, we may need: Your registrar name (e.g. GoDaddy, Namecheap, Google Domains, etc.), Your account email/username (for internal transfer), Or a transfer code / EPP code request (for external transfer).",
    icon: Key,
  },
  {
    title: "We Initiate the Transfer",
    description: "If same registrar: We will 'transfer' the domain into your account using your email/username. If different registrar: We will unlock the domain and provide you with the EPP/Auth code.",
    icon: Send,
  },
  {
    title: "You Accept the Transfer",
    description: "For internal push: You'll receive an email notification from the registrar to accept the domain. For external transfer: You will need to approve the transfer from your own registrar dashboard.",
    icon: MailCheck,
  },
  {
    title: "Domain Successfully Transferred!",
    description: "Internal transfers typically complete within 1–24 hours. External transfers may take 3–7 days, depending on the registrars involved. You'll receive a confirmation email once the domain is successfully transferred to you.",
    icon: ShieldCheck,
  },
]

export default function TransferProcessPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [latestOrder, setLatestOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderNumber, setOrderNumber] = useState<number>(0)
  const [isAuthorized, setIsAuthorized] = useState(false)

  // Clear order data when user changes or logs out
  useEffect(() => {
    const storedOrderEmail = localStorage.getItem('order_customer_email')
    
    // If user logged out or different user logged in, clear stored order
    if (storedOrderEmail && user && user.email !== storedOrderEmail) {
      localStorage.removeItem('order_customer_email')
      localStorage.removeItem('order_session_id')
      localStorage.removeItem('order_timestamp')
      setIsAuthorized(false)
      setLatestOrder(null)
    }
    
    // If user logged out (no user), clear stored order
    if (!user && storedOrderEmail) {
      localStorage.removeItem('order_customer_email')
      localStorage.removeItem('order_session_id')
      localStorage.removeItem('order_timestamp')
      setIsAuthorized(false)
      setLatestOrder(null)
    }
  }, [user])

  const fetchLatestOrder = useCallback(async () => {
    try {
      // Get session_id from URL params (user just completed checkout)
      const sessionIdFromUrl = searchParams?.get('session_id') || null
      
      // Check localStorage for stored order email and session
      const storedOrderEmail = localStorage.getItem('order_customer_email')
      const storedSessionId = localStorage.getItem('order_session_id')
      const storedTimestamp = localStorage.getItem('order_timestamp')
      
      // Session is valid for 24 hours
      const isStoredSessionValid = storedTimestamp && 
        (Date.now() - parseInt(storedTimestamp)) < 24 * 60 * 60 * 1000

      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.orders && data.orders.length > 0) {
        // Find the order that matches the session ID
        let userOrder = null
        let foundOrderNumber = 0
        
        if (sessionIdFromUrl) {
          // User just came from checkout - find their order by session ID
          const orderIndex = data.orders.findIndex((order: Order) => order.sessionId === sessionIdFromUrl)
          if (orderIndex !== -1) {
            userOrder = data.orders[orderIndex]
            foundOrderNumber = data.orders.length - orderIndex
            
            // Store order details in localStorage for 24 hours
            const orderEmail = userOrder.billingInfo?.email || userOrder.customerEmail
            localStorage.setItem('order_customer_email', orderEmail)
            localStorage.setItem('order_session_id', sessionIdFromUrl)
            localStorage.setItem('order_timestamp', Date.now().toString())
            
            setIsAuthorized(true)
            setLatestOrder(userOrder)
            setOrderNumber(foundOrderNumber)
          }
        } else if (isStoredSessionValid && storedOrderEmail && storedSessionId) {
          // User has valid stored session - verify email matches
          const orderIndex = data.orders.findIndex((order: Order) => {
            const orderEmail = order.billingInfo?.email || order.customerEmail
            return order.sessionId === storedSessionId && orderEmail === storedOrderEmail
          })
          
          if (orderIndex !== -1) {
            userOrder = data.orders[orderIndex]
            foundOrderNumber = data.orders.length - orderIndex
            
            setIsAuthorized(true)
            setLatestOrder(userOrder)
            setOrderNumber(foundOrderNumber)
          } else {
            // Order not found or email doesn't match - clear stored data
            setIsAuthorized(false)
            localStorage.removeItem('order_customer_email')
            localStorage.removeItem('order_session_id')
            localStorage.removeItem('order_timestamp')
          }
        } else {
          // No valid session - clear any old data
          setIsAuthorized(false)
          localStorage.removeItem('order_customer_email')
          localStorage.removeItem('order_session_id')
          localStorage.removeItem('order_timestamp')
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchLatestOrder()
    
    // Set up periodic refresh every 30 seconds to check for user changes
    const intervalId = setInterval(() => {
      fetchLatestOrder()
    }, 30000) // 30 seconds
    
    return () => clearInterval(intervalId)
  }, [fetchLatestOrder])

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      {/* Order Summary Section - Only show to authorized users */}
      {!loading && isAuthorized && latestOrder && (
        <motion.section
          className="pt-36 pb-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-[#33BDC7] shadow-lg dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-[#33BDC7]/10 to-[#3BD17A]/10 dark:from-[#33BDC7]/20 dark:to-[#3BD17A]/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-[#33BDC7] text-white">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-[#33BDC7] dark:text-[#33BDC7]">
                        🎉 Order Confirmed!
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Order Number: <span className="font-bold text-[#33BDC7]">#{orderNumber}</span>
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#3BD17A] text-white hover:bg-[#3BD17A]/90 text-sm px-4 py-2">
                    {latestOrder.domainTransfer}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Order Details Table */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#33BDC7] mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Details
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="text-left p-3 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">Item</th>
                          <th className="text-left p-3 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">Price</th>
                          <th className="text-left p-3 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestOrder.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-3 text-gray-800 dark:text-gray-200">
                              {index + 1}. {item.name}
                            </td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">${item.price}</td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">{item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <td colSpan={2} className="p-3 text-right font-bold text-gray-800 dark:text-gray-200">
                            Total Amount:
                          </td>
                          <td className="p-3 font-bold text-[#33BDC7] text-lg">
                            ${latestOrder.totalAmount}
                          </td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <td colSpan={2} className="p-3 text-right text-gray-700 dark:text-gray-300">
                            Payment Status:
                          </td>
                          <td className="p-3 text-gray-800 dark:text-gray-200">
                            {latestOrder.paymentStatus}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Billing Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>{" "}
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {latestOrder.billingInfo.name || 
                         `${latestOrder.billingInfo.firstName || ''} ${latestOrder.billingInfo.lastName || ''}`.trim() ||
                         'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>{" "}
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {latestOrder.billingInfo.email || latestOrder.customerEmail}
                      </span>
                    </div>
                    {latestOrder.billingInfo.phone && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Phone:</span>{" "}
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          {latestOrder.billingInfo.phone}
                        </span>
                      </div>
                    )}
                    {latestOrder.billingInfo.address && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Address:</span>{" "}
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          {latestOrder.billingInfo.address}
                        </span>
                      </div>
                    )}
                    {latestOrder.billingInfo.city && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">City:</span>{" "}
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          {latestOrder.billingInfo.city}
                        </span>
                      </div>
                    )}
                    {latestOrder.billingInfo.country && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Country:</span>{" "}
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          {latestOrder.billingInfo.country}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Note */}
                <div className="mt-6 p-4 bg-[#33BDC7]/10 dark:bg-[#33BDC7]/20 rounded-lg border-l-4 border-[#33BDC7]">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong className="text-[#33BDC7]">⚡ Important:</strong> This contains important information about your purchase. 
                    Please keep it for your records and contact us via Live Chat or Contact Form to begin the transfer process.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      )}

      {/* Hero Section */}
      <motion.section
        className={`text-[#33BDC7] ${!loading && isAuthorized && latestOrder ? 'pt-12 pb-20' : 'pt-36 pb-20'}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tight">
            Domain Transfer Process
            <span className="block text-[#3BD17A]">Thank you for purchasing a domain from our marketplace! 🎉</span>
          </h1>
          <p className="text-md md:text-lg lg:text-xl text-[#33BDC7] max-w-3xl mx-auto leading-relaxed">
            To ensure a smooth and secure handover, here's everything you need to know about the domain transfer process.
          </p>
        </div>
      </motion.section>

      {/* What Happens After Purchase */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">What Happens After You Buy a Domain?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Once your payment is confirmed, we begin the process of transferring ownership of the domain to you. This can happen in two ways:
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-2 p-3 border-[#33BDC7]/20 hover:border-[#33BDC7] transition-all duration-300 dark:bg-gray-700 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-xl text-[#33BDC7] flex items-center">
                    <Lock className="mr-2 h-5 w-5" />
                    Transfer to Your Registrar (Internal Transfer)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    If the domain is registered at the same registrar where you have an account, we can transfer it directly to your account.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full p-3 border-2 border-[#33BDC7]/20 hover:border-[#33BDC7] transition-all duration-300 dark:bg-gray-700 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-xl text-[#33BDC7] flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    Push to Other Registrar (External Transfer)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    If you want to move the domain to a different registrar, we will provide you with the necessary authorization code to initiate the transfer.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">Please Contact Us After Payment</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              To begin the transfer process quickly, contact us via Live Chat or our Contact Form as soon as your payment is complete. Let us know:
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl mx-auto border border-gray-200 dark:border-gray-600 mb-8">
              <ul className="space-y-3 text-left text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#33BDC7] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your order number</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#33BDC7] mr-2 mt-0.5 flex-shrink-0" />
                  <span>The domain name you purchased</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#33BDC7] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your preferred registrar and account details (if known)</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
             
             <Link href='/contact'> <Button variant="outline" size="lg" className="rounded-full px-8 py-4 border-[#33BDC7] text-[#33BDC7] hover:bg-[#33BDC7]/10 font-semibold">
                Contact Form
              </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
              ⚡ The sooner we hear from you, the faster we can start your transfer!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white dark:bg-gray-800 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">Step-by-Step: How the Transfer Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Follow these steps to complete your domain transfer smoothly and securely.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg p-6 transition-all duration-300 border-2 hover:border-[#33BDC7] rounded-2xl flex flex-col dark:bg-gray-700 dark:border-gray-600">
                  <CardHeader className="flex items-center space-x-4 pb-4">
                    <div className="p-3 rounded-2xl bg-[#33BDC7]/10 dark:bg-[#33BDC7]/20 text-[#33BDC7]">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl text-[#33BDC7]">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
