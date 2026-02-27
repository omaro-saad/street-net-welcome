import { useEffect, useRef, useState } from 'react'

/**
 * Adds "in-view" class to the element when it enters the viewport.
 * Used for scroll-triggered animations.
 * @param {Object} options - { rootMargin: string, threshold: number }
 * @returns {[React.RefObject, boolean]} - ref to attach to element, and inView state
 */
export function useInView(options = {}) {
  const { rootMargin = '0px 0px -60px 0px', threshold = 0.1 } = options
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return [ref, inView]
}
