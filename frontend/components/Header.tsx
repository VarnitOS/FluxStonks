'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import GradientText from './GradientText'

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleReload = () => {
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/stock/${searchQuery.toUpperCase()}`)
    }
  }

  return (
    <header className="relative z-10 w-full">
      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Bottom horizontal line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        {/* Vertical line between logo and search */}
        <div className="absolute top-0 left-[220px] w-[1px] h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section with logo and search */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={handleReload}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl"></div>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={5}
                className="text-2xl font-medium"
              >
                FluxStonks
              </GradientText>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-64"> {/* Fixed width for search bar */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search a Ticker..."
                  className="w-full bg-[#252630]/60 text-white placeholder-white/50 pl-12 pr-4 py-3 rounded-xl border border-white/8 focus:border-white/20 focus:bg-[#252630]/80 focus:outline-none transition-all duration-300"
                />
              </div>
            </form>
          </div>

          {/* Right section for social links */}
          <div className="flex items-center space-x-6">
            {/* Social links will go here */}
          </div>
        </div>
      </div>
    </header>
  )
}
