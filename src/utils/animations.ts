
import { useEffect, useState, useRef } from 'react';

// Detect when an element is in viewport
export function useIntersectionObserver(
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible] as const;
}

// Staggered animation for lists
export function useStaggeredAnimation(
  itemCount: number,
  staggerDelay: number = 100,
  initialDelay: number = 0
) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const newVisibleItems = Array(itemCount).fill(false);
    
    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => {
          const updated = [...prev];
          updated[i] = true;
          return updated;
        });
      }, initialDelay + i * staggerDelay);
      
      timeouts.push(timeout);
    }
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [itemCount, staggerDelay, initialDelay]);
  
  return visibleItems;
}

// Parallax scroll effect
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const elementTop = ref.current.getBoundingClientRect().top;
      const scrollOffset = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight && elementTop > -ref.current.offsetHeight) {
        setOffset(scrollOffset * speed);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return [ref, { transform: `translateY(${offset}px)` }] as const;
}

// Blurry lazy loading for images
export function useLazyLoadImage(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      setCurrentSrc(src);
    };
  }, [src]);
  
  return [currentSrc, isLoaded] as const;
}
