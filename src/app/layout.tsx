import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
 title: 'IPA Las Encinas',
 description: 'Iglesia Pentecostal Apostólica Las Encinas',
}

export default function RootLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
   <html lang="es" suppressHydrationWarning>
     <head>
       <link
         rel="stylesheet"
         type="text/css"
         href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
       />
       <link
         rel="stylesheet"
         type="text/css"
         href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
       />
     </head>
     <body className={`${inter.className} antialiased bg-background text-foreground`}>
       <AuthProvider>
         <AppProvider>
           {children}
         </AppProvider>
       </AuthProvider>
     </body>
   </html>
 )
}

