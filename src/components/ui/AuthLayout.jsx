import React from 'react'
import logo from '@/assets/logo.svg'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

function AuthLayout({
  title,
  children,
  button,
  footer,
  logoSrc = logo,
  description
}) {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-50">
      <Card className="w-full max-w-md p-0">
        <CardHeader className="flex flex-col items-center gap-4 pb-4 border-b">
          <img src={logoSrc} alt="logo" className="max-w-48" />
          {title && <CardTitle className="text-center text-zinc-700">{title}</CardTitle>}
          {description && <div className="text-base text-zinc-700 text-center max-w-sm">{description}</div>}
        </CardHeader>
        <CardContent className="pt-6 pb-0 px-6">
          {children}
        </CardContent>
        {button && (
          <div className="px-6 pt-4">
            {button}
          </div>
        )}
        {footer && (
          <CardFooter className="flex flex-col items-start gap-2 border-t mt-4 pt-4 px-6 text-gray-500">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export { AuthLayout }