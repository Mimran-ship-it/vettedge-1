"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Lock, CreditCard, Mail, Phone, MapPin, Building2 } from "lucide-react"

interface BillingAddress {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export default function AccountSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetchingUser, setFetchingUser] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  })

  useEffect(() => {
    
    // Fetch full user data including billing address
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        
        if (data.user) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            password: "",
            confirmPassword: "",
          })

          if (data.user.billingAddress) {
            setBillingAddress(data.user.billingAddress)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setFetchingUser(false)
      }
    }

    fetchUserData()
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }
  
    setLoading(true)
  
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        billingAddress,
      }
  
      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password
      }
  
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.error || "Update failed")
      }
  
      toast({
        title: "Settings updated",
        description: "Your account settings have been updated successfully.",
      })
  
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
  
      // 🔁 Reload the page after short delay so toast can show
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error.message || "There was an error updating your settings.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  

  if (fetchingUser) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Set a new password for your account</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>This will be used as default for checkout</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={billingAddress.phone}
                  onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                type="text"
                value={billingAddress.address}
                onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  type="text"
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                  placeholder="NY"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  type="text"
                  value={billingAddress.zipCode}
                  onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                  placeholder="10001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="country"
                    type="text"
                    value={billingAddress.country}
                    onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#33BDC7] hover:bg-[#28a3ac] text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
