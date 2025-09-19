"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/analyze", label: t("nav.analyze") },
    { href: "/about", label: t("nav.about") },
  ]

  const NavLink = ({
    href,
    label,
    mobile = false,
  }: {
    href: string
    label: string
    mobile?: boolean
  }) => {
    const isActive = pathname === href
    const baseClasses = "transition-colors font-medium"
    const desktopClasses =
      "px-3 py-2 rounded-md text-sm text-[#3d2f1b] hover:text-[#a1824a]"
    const mobileClasses =
      "block px-3 py-2 text-base text-[#3d2f1b] hover:text-[#a1824a]"
    const activeClasses = "text-[#a1824a] bg-[#f7f1d0]/30 rounded-md"

    return (
      <Link
        href={href}
        className={cn(baseClasses, mobile ? mobileClasses : desktopClasses, isActive && activeClasses)}
        onClick={() => mobile && setIsOpen(false)}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="border-b border-[#c9b88a] bg-[#f7f1d0]/80 backdrop-blur supports-[backdrop-filter]:bg-[#f7f1d0]/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-[#a1824a] flex items-center justify-center">
                <span className="text-[#fff8dc] font-bold text-lg">த</span>
              </div>
              <span className="font-bold text-xl text-[#3d2f1b] hidden sm:block">TLI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <Link href="/analyze">
              <Button className="bg-[#a1824a] hover:bg-[#8f6f3d] text-[#fff8dc]">
                {t("hero.cta")}
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 text-[#3d2f1b]">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-[#f7f1d0]/90">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#c9b88a]">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-lg bg-[#a1824a] flex items-center justify-center">
                        <span className="text-[#fff8dc] font-bold text-lg">த</span>
                      </div>
                      <span className="font-bold text-xl text-[#3d2f1b]">
                        Tamil Literature Intelligence
                      </span>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-1 py-4">
                    {navItems.map((item) => (
                      <NavLink key={item.href} href={item.href} label={item.label} mobile />
                    ))}
                  </div>

                  {/* Mobile CTA */}
                  <div className="mt-auto pt-4 border-t border-[#c9b88a]">
                    <Link href="/analyze" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-[#a1824a] hover:bg-[#8f6f3d] text-[#fff8dc]">
                        {t("hero.cta")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
