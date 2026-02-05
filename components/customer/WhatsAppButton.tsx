'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WhatsAppButtonProps {
  laptopName: string
  laptopPrice: number
  laptopUrl: string
}

export default function WhatsAppButton({ laptopName, laptopPrice, laptopUrl }: WhatsAppButtonProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+923462868512'

  const handleClick = () => {
    const message = `Hi NAFAY! I'm interested in the ${laptopName}.
Price: Rs. ${laptopPrice.toLocaleString()}
Link: ${laptopUrl}`

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="w-full bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:from-[#1EBE5D] hover:to-[#25D366] text-white font-medium shadow-whatsapp transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Inquire on WhatsApp
    </Button>
  )
}
