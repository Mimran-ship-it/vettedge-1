"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

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
      <div className="flex min-h-screen">
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
          <div>
              <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and update your personal information.
              </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your name and email address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Leave blank to keep current password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>This will be used as default for checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={billingAddress.phone}
                    onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    value={billingAddress.address}
                    onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      type="text"
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full sm:w-auto bg-[#33BDC7] hover:bg-[#28a3ac] text-white"
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
          </form>
    </div>
  )
}
