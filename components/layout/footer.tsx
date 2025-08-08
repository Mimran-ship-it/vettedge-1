import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#33BDC7] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-semibold text-[#33BDC7]">
                Vettedge.domains
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner for premium expired domains with real authority and proven SEO value.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#33BDC7]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/domains"
                  className="text-gray-400 hover:text-[#38C172] transition-colors"
                >
                  Buy Domains
                </Link>
              </li>
              <li>
                <Link
                  href="/vetting-process"
                  className="text-gray-400 hover:text-[#38C172] transition-colors"
                >
                  Vetting Process
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-[#38C172] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-[#38C172] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#33BDC7]">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-[#38C172] transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-[#38C172] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-[#38C172] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-[#38C172] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#33BDC7]">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Email: support@vettedge.domains</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Hours: 24/7 Support Available</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Vettedge.domains. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
