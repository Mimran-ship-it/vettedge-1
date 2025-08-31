"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const suggestions = [
    { title: "Browse Domains", href: "/domains", icon: <Search className="w-4 h-4" /> },
    { title: "Help Center", href: "/help", icon: <HelpCircle className="w-4 h-4" /> },
    { title: "Contact Us", href: "/contact", icon: <HelpCircle className="w-4 h-4" /> },
    { title: "About Us", href: "/about", icon: <HelpCircle className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#33BDC7] to-[#38C172] bg-clip-text text-transparent">
            404
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#33BDC7] to-[#38C172] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Error Message */}
        <Card className="mb-8 border-[#33BDC7]/20">
          <CardContent className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#33BDC7]">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Oops! The page you're looking for seems to have wandered off into the digital void. 
              Don't worry, even the best domains sometimes get lost in cyberspace.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              The page might have been moved, deleted, or you might have typed the URL incorrectly.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/">
            <Button className="bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white px-6">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-[#38C172] text-[#38C172] hover:bg-[#38C172] hover:text-white px-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Suggestions */}
        <Card className="border-[#33BDC7]/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-[#33BDC7]">
              Maybe you were looking for:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {suggestions.map((suggestion, index) => (
                <Link key={index} href={suggestion.href}>
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#33BDC7]/40 hover:bg-[#33BDC7]/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#38C172]">{suggestion.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300">{suggestion.title}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fun Domain Fact */}
        <div className="mt-8 p-4 bg-gradient-to-r from-[#33BDC7]/10 to-[#38C172]/10 rounded-lg border border-[#33BDC7]/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong className="text-[#33BDC7]">Fun Fact:</strong> Did you know that the first domain name ever registered was symbolics.com on March 15, 1985? 
            It's still active today! Just like how we help you find premium domains that stand the test of time.
          </p>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-500">
          Still can't find what you're looking for? 
          <Link href="/contact" className="text-[#33BDC7] hover:underline ml-1">
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  )
}
