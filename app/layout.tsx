import {ReactNode} from "react";
import {Providers} from "@/_components/Providers";

interface LayoutProps {
  children: ReactNode
}

export default function RootLayout({children}: LayoutProps) {
  return (
      <html lang="en">
      <body>
      <Providers>
        {children}
      </Providers>
      </body>
      </html>
  )
}
