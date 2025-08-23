"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, User, MessageSquare, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useToast } from "@/hooks/use-toast"

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface ContactFormProps {
  variant?: "default" | "home" | "contact"
  className?: string
  showHeader?: boolean
  headerTitle?: string
  headerDescription?: string
}

export default function ContactForm({ 
  variant = "default", 
  className = "",
  showHeader = true,
  headerTitle = "Contact Us",
  headerDescription = "We'd love to hear from you. Send us a message and we'll respond as soon as possible."
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast: useToastHook } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      if (variant === "home") {
        useToastHook({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        })
      } else {
        toast.error("Please fill in all required fields")
      }
      return
    }

    if (formData.subject.trim().length < 3) {
      if (variant === "home") {
        useToastHook({
          title: "Validation Error", 
          description: "Subject must be at least 3 characters long.",
          variant: "destructive"
        })
      } else {
        toast.error("Subject must be at least 3 characters long")
      }
      return
    }

    if (formData.message.trim().length < 10) {
      if (variant === "home") {
        useToastHook({
          title: "Validation Error",
          description: "Message must be at least 10 characters long.",
          variant: "destructive"
        })
      } else {
        toast.error("Message must be at least 10 characters long")
      }
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        if (variant === "home") {
          useToastHook({
            title: "Message sent successfully!",
            description: "We'll get back to you within 24 hours."
          })
        } else {
          toast.success("Thank you! Your message has been sent successfully.")
        }
        setIsSubmitted(true)
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        })
        // Reset success state after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        if (variant === "home") {
          useToastHook({
            title: "Error",
            description: data.error || "Failed to send message. Please try again.",
            variant: "destructive"
          })
        } else {
          toast.error(data.error || "Failed to send message. Please try again.")
        }
      }
    } catch (error) {
      if (variant === "home") {
        useToastHook({
          title: "Network Error",
          description: "Please check your connection and try again.",
          variant: "destructive"
        })
      } else {
        toast.error("Network error. Please check your connection and try again.")
      }
      console.error("Contact form error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get styling based on variant
  const getCardStyles = () => {
    switch (variant) {
      case "home":
        return "w-full max-w-2xl mx-auto shadow-xl border-0"
      case "contact":
        return "w-full shadow-xl border-0"
      default:
        return "w-full max-w-2xl mx-auto"
    }
  }

  const getHeaderStyles = () => {
    switch (variant) {
      case "contact":
        return "text-xl md:text-2xl font-bold flex items-center text-[#33BDC7]"
      case "home":
        return "text-xl md:text-2xl font-bold flex items-center text-[#33BDC7]"
      default:
        return "text-2xl font-bold text-center"
    }
  }

  const getInputStyles = () => {
    switch (variant) {
      case "contact":
        return "border-[#33BDC7] focus:border-[#38C172]"
      case "home":
        return "w-full h-12"
      default:
        return "w-full"
    }
  }

  const getButtonStyles = () => {
    switch (variant) {
      case "contact":
        return "w-full bg-gradient-to-r from-[#38C172] to-[#33BDC7] hover:from-[#33BDC7] hover:to-[#38C172]"
      case "home":
        return "w-full h-12 text-lg font-semibold text-white bg-[#38C172] hover:bg-[#33BDC7]"
      default:
        return "w-full"
    }
  }

  const getLabelStyles = () => {
    switch (variant) {
      case "contact":
        return "text-[#33BDC7] font-semibold"
      default:
        return "flex items-center gap-2"
    }
  }

  if (isSubmitted) {
    return (
      <Card className={`${getCardStyles()} ${className}`}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${getCardStyles()} ${className}`}>
      {showHeader && (
        <CardHeader>
          <CardTitle className={getHeaderStyles()}>
            {variant === "contact" && <Send className="h-6 w-6 mr-2 text-[#33BDC7]" />}
            {headerTitle}
          </CardTitle>
          <p className={variant === "contact" ? "text-gray-600" : "text-gray-600 text-center"}>
            {headerDescription}
          </p>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={getLabelStyles()}>
                {variant !== "contact" && <User className="w-4 h-4" />}
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={getInputStyles()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={getLabelStyles()}>
                {variant !== "contact" && <Mail className="w-4 h-4" />}
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={getInputStyles()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className={getLabelStyles()}>
              {variant !== "contact" && <Phone className="w-4 h-4" />}
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className={getInputStyles()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className={getLabelStyles()}>
              {variant !== "contact" && <MessageSquare className="w-4 h-4" />}
              Subject *
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="What is this regarding?"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className={getInputStyles()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className={getLabelStyles()}>
              {variant !== "contact" && <MessageSquare className="w-4 h-4" />}
              {variant === "home" ? "How can we help you?" : "Message *"}
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder={variant === "home" ? "Tell us about your domain needs, target niche, or any specific requirements..." : "Tell us more about your inquiry..."}
              value={formData.message}
              onChange={handleInputChange}
              required
              className={`${getInputStyles()} min-h-32`}
              maxLength={2000}
              rows={variant === "contact" ? 6 : variant === "home" ? 5 : 4}
            />
            <div className="text-right text-sm text-gray-500">
              {formData.message.length}/2000 characters
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={getButtonStyles()}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {variant === "home" ? "Get Expert Advice" : "Send Message"}
              </>
            )}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            * Required fields. We respect your privacy and will never share your information.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
