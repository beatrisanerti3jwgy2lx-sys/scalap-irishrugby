import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'
import HeaderClient from '@/components/HeaderClient'

export const metadata: Metadata = {
  title: 'IRFU Rugby | Official Ticket Sales',
  description:
    'Official IRFU Rugby ticket sales. Buy tickets for Six Nations 2027 Ireland vs England at Aviva Stadium, Dublin.',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <HeaderClient />
          <main>{children}</main>
          <footer className="footer">
            {/* Partners */}
            <div className="footer-partners">
              <p className="footer-partners-label">Official Partners</p>
              <div className="footer-partners-logos">
                <span className="footer-partner-item">Vodafone</span>
                <span className="footer-partner-item">Bank of Ireland</span>
                <span className="footer-partner-item">Aer Lingus</span>
              </div>
            </div>

            <div className="footer-inner">
              {/* Footer Links */}
              <div className="footer-links-row">
                <Link href="/">Home</Link>
                <Link href="/event/ireland-vs-england-six-nations">Tickets</Link>
                <Link href="/cart">My Cart</Link>
                <Link href="/">Privacy Policy</Link>
                <Link href="/">Terms &amp; Conditions</Link>
                <Link href="/">Cookie Policy</Link>
                <Link href="/">Accessibility</Link>
              </div>

              {/* Bottom */}
              <div className="footer-bottom">
                <div className="footer-bottom-logos">
                  <span className="footer-org-badge">IRFU</span>
                  <span className="footer-org-badge">Six Nations Rugby</span>
                </div>
                <p>&copy; 2027 Irish Rugby Football Union. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
