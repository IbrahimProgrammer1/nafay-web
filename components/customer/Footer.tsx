'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+923462868512'

  return (
    <footer className="bg-white text-text-primary mt-16 border-t border-black/[0.06]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-text-primary">NAFAY</h3>
            <p className="text-text-secondary text-sm">
              Your trusted destination for premium laptops. Browse our collection and visit our shop for the best deals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/laptops" className="text-text-secondary hover:text-accent-orange transition-colors">
                  Browse Laptops
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-text-secondary hover:text-accent-orange transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Contact Us</h3>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sm text-text-secondary hover:text-accent-orange transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp: {whatsappNumber}</span>
            </a>
          </div>
        </div>

        <div className="border-t border-black/[0.06] mt-8 pt-8 text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} NAFAY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
