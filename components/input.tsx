"use client";

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100 // increase radius for better glow
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const gradientRef = React.useRef(null)
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

    useGSAP(() => {
      gsap.set(gradientRef.current, {
        background: `radial-gradient(0px circle at ${mousePosition.x}px ${mousePosition.y}px, #aed500, transparent 80%)`,
      })
    }, { scope: containerRef })

    function handleMouseMove(e: React.MouseEvent) {
      if (!containerRef.current)
        return

      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top

      setMousePosition({ x, y })

      gsap.to(gradientRef.current, {
        background: `radial-gradient(${radius}px circle at ${x}px ${y}px, #aed500, transparent 80%)`,
        duration: 0.1,
      })
    }

    function handleMouseEnter(e: React.MouseEvent) {
      if (!containerRef.current)
        return

      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top

      setMousePosition({ x, y })
      gsap.set(gradientRef.current, {
        background: `radial-gradient(0px circle at ${x}px ${y}px, #aed500, transparent 80%)`,
      })

      gsap.to(gradientRef.current, {
        background: `radial-gradient(${radius}px circle at ${x}px ${y}px, #aed500, transparent 80%)`,
        duration: 0.3,
      })
    }

    function handleMouseLeave() {
      gsap.to(gradientRef.current, {
        background: `radial-gradient(0px circle at ${mousePosition.x}px ${mousePosition.y}px, #aed500, transparent 80%)`,
        duration: 0.3,
      })
    }

    return (
      <div
        ref={containerRef}
        className="group/input rounded-none p-[1px] transition duration-300 relative w-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={gradientRef}
          className="absolute inset-0 rounded-none z-0 opacity-50"
        />

        <input
          type={type}
          className={cn(
            `relative z-10 shadow-input flex h-12 w-full rounded-none border border-white/10 bg-black/80 px-4 py-2 font-body text-sm md:text-base text-white transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-600 focus-visible:outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  })
Input.displayName = 'Input'

export { Input }
