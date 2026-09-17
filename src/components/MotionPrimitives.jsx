import React, { useEffect, useState, useRef } from 'react';

/**
 * PRISM Motion Primitives Suite
 * Zero-dependency, 60fps GPU-accelerated micro-animation & layout primitives
 * Inspired by modern motion design: spring physics, staggered entrances & fluid levitation
 */

// 1. MotionFadeIn: Staggered physics entrance
export function MotionFadeIn({
  children,
  delay = 0,
  duration = 0.55,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'none'
  distance = 24,
  className = '',
  style = {},
  as: Component = 'div',
  ...props
}) {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (hasEntered) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <Component
      className={`prism-motion-fade-in ${className}`}
      style={{
        opacity: hasEntered ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: 'opacity, transform',
        ...style
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

// 2. MotionScale: Elastic spring pop entrance with tactile hover/press response
export function MotionScale({
  children,
  delay = 0,
  hoverScale = 1.03,
  tapScale = 0.97,
  className = '',
  style = {},
  as: Component = 'div',
  ...props
}) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const currentScale = !hasEntered
    ? 0.92
    : isPressed
    ? tapScale
    : isHovered
    ? hoverScale
    : 1;

  return (
    <Component
      className={`prism-motion-scale ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        opacity: hasEntered ? 1 : 0,
        transform: `scale(${currentScale})`,
        transition: 'opacity 0.4s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
        willChange: 'opacity, transform',
        cursor: props.onClick ? 'pointer' : undefined,
        ...style
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

// 3. MotionFloat: Ambient continuous levitation physics
export function MotionFloat({
  children,
  duration = 4.5,
  distance = 8,
  delay = 0,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`prism-motion-float ${className}`}
      style={{
        animation: `prismFloatMotion ${duration}s ease-in-out ${delay}s infinite alternate`,
        willChange: 'transform',
        '--float-dist': `${distance}px`,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// 4. MotionGlow: Reactive glassmorphic glow border that tracks mouse movement
export function MotionGlow({
  children,
  color = 'var(--rt-primary, #6366f1)',
  borderRadius = '16px',
  className = '',
  style = {},
  ...props
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const boxRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      ref={boxRef}
      className={`prism-motion-glow-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius,
        ...style
      }}
      {...props}
    >
      <div
        className="prism-motion-glow-layer"
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius,
          background: isHovered
            ? `radial-gradient(280px circle at ${pos.x}% ${pos.y}%, ${color} 0%, transparent 70%)`
            : 'transparent',
          opacity: isHovered ? 0.65 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

// 5. MotionTextReveal: High-aesthetic staggered word reveal
export function MotionTextReveal({
  text,
  delay = 0,
  stagger = 0.04,
  className = '',
  style = {}
}) {
  const words = text.split(' ');

  return (
    <span className={`prism-motion-text-reveal ${className}`} style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em', ...style }}>
      {words.map((word, idx) => (
        <MotionFadeIn
          key={idx}
          delay={delay + idx * stagger}
          duration={0.4}
          direction="up"
          distance={10}
          style={{ display: 'inline-block' }}
        >
          {word}
        </MotionFadeIn>
      ))}
    </span>
  );
}
