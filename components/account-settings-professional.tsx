"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Lock, CreditCard, Save } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface BillingAddress {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export function AccountSettingsProfessional() {
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
  
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
  
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your settings.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingUser) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Cards Skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white font-inter">Account Settings</h1>
        <p className="text-sm text-slate-400 font-inter">
          Manage your account settings and update your personal information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-slate-800 rounded-lg">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Personal Information</h2>
              <p className="text-sm text-slate-400">Update your name and email address</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-300">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
              <p className="text-sm text-slate-400">Leave blank to keep current password</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-300">New Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Billing Address Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-slate-800 rounded-lg">
              <CreditCard className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Billing Address</h2>
              <p className="text-sm text-slate-400">This will be used as default for checkout</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-300">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={billingAddress.phone}
                onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-slate-300">Address</Label>
              <Input
                id="address"
                type="text"
                value={billingAddress.address}
                onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-slate-300">City</Label>
                <Input
                  id="city"
                  type="text"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-slate-300">State</Label>
                <Input
                  id="state"
                  type="text"
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-sm font-medium text-slate-300">ZIP Code</Label>
                <Input
                  id="zipCode"
                  type="text"
                  value={billingAddress.zipCode}
                  onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-slate-300">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={billingAddress.country}
                  onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-600 text-white px-8 py-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="flex-1 sm:flex-none border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-3"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
