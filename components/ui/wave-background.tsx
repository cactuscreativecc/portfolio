'use client'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Point {
    x: number
    y: number
    wave: { x: number; y: number }
    cursor: {
        x: number
        y: number
        vx: number
        vy: number
    }
}

interface WavesProps {
    className?: string
    strokeColor?: string
    backgroundColor?: string
    pointerSize?: number
    disableMouseFollow?: boolean
}

export function Waves({
    className = "",
    strokeColor = "rgba(255, 255, 255, 0.15)", // Very subtle white lines
    backgroundColor = "transparent",
    pointerSize = 0.5,
    disableMouseFollow = false
}: WavesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const mouseRef = useRef({
        x: -100,
        y: -100,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false,
    })
    const pathsRef = useRef<SVGPathElement[]>([])
    const linesRef = useRef<Point[][]>([])
    const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
    const rafRef = useRef<number | null>(null)
    const boundingRef = useRef<DOMRect | null>(null)

    // Initialization
    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return

        // Initialize noise generator
        noiseRef.current = createNoise2D()

        // Initialize size and lines
        setSize()
        setLines()

        // Bind events
        window.addEventListener('resize', onResize)
        if (!disableMouseFollow) {
            window.addEventListener('mousemove', onMouseMove)
            containerRef.current.addEventListener('touchmove', onTouchMove, { passive: false })
        }

        // Start animation
        rafRef.current = requestAnimationFrame(tick)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', onResize)
            if (!disableMouseFollow) {
                window.removeEventListener('mousemove', onMouseMove)
                containerRef.current?.removeEventListener('touchmove', onTouchMove)
            }
        }
    }, [])

    // Set SVG size
    const setSize = () => {
        if (!containerRef.current || !svgRef.current) return

        boundingRef.current = containerRef.current.getBoundingClientRect()
        const { width, height } = boundingRef.current

        svgRef.current.style.width = `${width}px`
        svgRef.current.style.height = `${height}px`
    }

    // Setup lines - responsive gaps for performance and clarity
    const setLines = () => {
        if (!svgRef.current || !boundingRef.current) return

        const { width, height } = boundingRef.current
        linesRef.current = []

        // Clear existing paths
        pathsRef.current.forEach(path => {
            path.remove()
        })
        pathsRef.current = []

        // Optimization: Use larger gaps on mobile
        const isMobile = width < 768
        const xGap = isMobile ? 18 : 10
        const yGap = isMobile ? 18 : 10

        const oWidth = width + 200
        const oHeight = height + 30

        const totalLines = Math.ceil(oWidth / xGap)
        const totalPoints = Math.ceil(oHeight / yGap)

        const xStart = (width - xGap * totalLines) / 2
        const yStart = (height - yGap * totalPoints) / 2

        for (let i = 0; i < totalLines; i++) {
            const points: Point[] = []

            for (let j = 0; j < totalPoints; j++) {
                const point: Point = {
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                }

                points.push(point)
            }

            const path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
            )
            path.setAttribute('fill', 'none')
            path.setAttribute('stroke', strokeColor)
            path.setAttribute('stroke-width', '0.8')
            path.setAttribute('style', 'vector-effect: non-scaling-stroke;')

            svgRef.current.appendChild(path)
            pathsRef.current.push(path)

            linesRef.current.push(points)
        }
    }

    const onResize = () => {
        setSize()
        setLines()
    }

    const onMouseMove = (e: MouseEvent) => {
        updateMousePosition(e.clientX, e.clientY)
    }

    const onTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        const touch = e.touches[0]
        updateMousePosition(touch.clientX, touch.clientY)
    }

    const updateMousePosition = (clientX: number, clientY: number) => {
        if (!boundingRef.current) return

        const mouse = mouseRef.current
        mouse.x = clientX - boundingRef.current.left
        mouse.y = clientY - boundingRef.current.top

        if (!mouse.set) {
            mouse.sx = mouse.x
            mouse.sy = mouse.y
            mouse.lx = mouse.x
            mouse.ly = mouse.y
            mouse.set = true
        }
    }

    const movePoints = (time: number) => {
        const { current: lines } = linesRef
        const { current: mouse } = mouseRef
        const { current: noise } = noiseRef

        if (!noise) return

        lines.forEach((points) => {
            points.forEach((p: Point) => {
                const move = noise(
                    (p.x + time * 0.005) * 0.002,
                    (p.y + time * 0.002) * 0.001
                ) * 6

                p.wave.x = Math.cos(move) * 10
                p.wave.y = Math.sin(move) * 5

                const dx = p.x - mouse.sx
                const dy = p.y - mouse.sy
                const d = Math.hypot(dx, dy)
                const l = Math.max(200, mouse.vs * 2)

                if (d < l) {
                    const s = 1 - d / l
                    const f = Math.cos(d * 0.001) * s

                    p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.0004
                    p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.0004
                }

                p.cursor.vx += (0 - p.cursor.x) * 0.008
                p.cursor.vy += (0 - p.cursor.y) * 0.008

                p.cursor.vx *= 0.94
                p.cursor.vy *= 0.94

                p.cursor.x += p.cursor.vx
                p.cursor.y += p.cursor.vy

                p.cursor.x = Math.min(60, Math.max(-60, p.cursor.x))
                p.cursor.y = Math.min(60, Math.max(-60, p.cursor.y))
            })
        })
    }

    const moved = (point: Point, withCursorForce = true) => {
        const coords = {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
        }

        return coords
    }

    const drawLines = () => {
        const { current: lines } = linesRef
        const { current: paths } = pathsRef

        lines.forEach((points, lIndex) => {
            if (points.length < 2 || !paths[lIndex]) return;

            const firstPoint = moved(points[0], false)
            let d = `M ${firstPoint.x} ${firstPoint.y}`

            for (let i = 1; i < points.length; i++) {
                const current = moved(points[i])
                // Quadratic curves would be smoother but lines are requested
                d += ` L ${current.x} ${current.y}`
            }

            paths[lIndex].setAttribute('d', d)
        })
    }

    const tick = (time: number) => {
        const { current: mouse } = mouseRef

        mouse.sx += (mouse.x - mouse.sx) * 0.1
        mouse.sy += (mouse.y - mouse.sy) * 0.1

        const dx = mouse.x - mouse.lx
        const dy = mouse.y - mouse.ly
        const d = Math.hypot(dx, dy)

        mouse.v = d
        mouse.vs += (d - mouse.vs) * 0.1
        mouse.vs = Math.min(120, mouse.vs)

        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.a = Math.atan2(dy, dx)

        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
            containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
        }

        movePoints(time)
        drawLines()

        rafRef.current = requestAnimationFrame(tick)
    }

    return (
        <div
            ref={containerRef}
            className={`waves-component absolute inset-0 overflow-hidden pointer-events-none ${className}`}
            style={{
                backgroundColor,
                '--x': '-100px',
                '--y': '-100px',
            } as React.CSSProperties}
        >
            <svg
                ref={svgRef}
                className="block w-full h-full opacity-30" // ADJUSTED: Low opacity for readability
                xmlns="http://www.w3.org/2000/svg"
            />
            {/* Green Glow Aura - Matching brand color #aed500 */}
            {!disableMouseFollow && (
                <div
                    className="pointer-glow"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `300px`,
                        height: `300px`,
                        background: 'radial-gradient(circle, rgba(174, 213, 0, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)',
                        willChange: 'transform',
                        pointerEvents: 'none',
                    }}
                />
            )}
            {/* Pointer Dot - #aed500 */}
            {!disableMouseFollow && (
                <div
                    className="pointer-dot"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${pointerSize}rem`,
                        height: `${pointerSize}rem`,
                        background: '#aed500',
                        boxShadow: '0 0 15px #aed500, 0 0 30px rgba(174, 213, 0, 0.5)',
                        borderRadius: '50%',
                        transform: 'translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)',
                        willChange: 'transform',
                        pointerEvents: 'none',
                    }}
                />
            )}
        </div>
    )
}
