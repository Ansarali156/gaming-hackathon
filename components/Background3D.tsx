'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function Background3D() {
  const [shapes, setShapes] = useState<any[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const initialShapes = [
      { id: 1, type: 'sphere', size: 500, top: '5%', right: '-5%', baseOpacity: 0.1, rotate: 0 },
      { id: 2, type: 'pill', width: 200, height: 600, top: '20%', left: '-5%', baseOpacity: 0.05, rotate: 15 },
      
      { 
        id: 101, 
        type: 'text', 
        content: 'RTIH',
        size: 300, top: '5%', left: '2%', baseOpacity: 0.1, rotate: -5,
      },
      { 
        id: 102, 
        type: 'image', 
        src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800', 
        size: 400, top: '45%', right: '5%', baseOpacity: 0.08, rotate: -5,
        alt: 'Mecha Tech Unit',
        blend: 'lighten'
      },
      { 
        id: 103, 
        type: 'image', 
        src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800', 
        size: 500, top: '25%', left: '35%', baseOpacity: 0.04, rotate: 0,
        alt: 'Abstract Tech Figure',
        blend: 'color-dodge'
      },

      { 
        id: 201, 
        type: 'image', 
        src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600', 
        size: 280, top: '65%', left: '15%', baseOpacity: 0.07, rotate: -15,
        alt: 'Retro Gaming Tech'
      },
      { 
        id: 202, 
        type: 'image', 
        src: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600', 
        size: 220, top: '5%', right: '35%', baseOpacity: 0.09, rotate: 10,
        alt: 'Holographic Data Cards'
      },
      
      { 
        id: 301, 
        type: 'image', 
        src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', 
        size: 600, top: '50%', left: '45%', baseOpacity: 0.03, rotate: 0,
        alt: 'Global Map Interface',
        blend: 'screen'
      },
      { 
        id: 302, 
        type: 'image', 
        src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', 
        size: 300, top: '80%', right: '10%', baseOpacity: 0.05, rotate: -5,
        alt: 'Circuitry Patterns'
      },

      { id: 4, type: 'torus', size: 180, top: '75%', left: '40%', baseOpacity: 0.1, rotate: 30 },
      { id: 5, type: 'octahedron', width: 150, height: 220, top: '15%', right: '15%', baseOpacity: 0.1, rotate: -20 },
    ];
    setShapes(initialShapes);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
      <div className="spotlight-overlay" />
      
      {shapes.map((shape) => (
        <Shape key={shape.id} shape={shape} mouseX={mouseX} mouseY={mouseY} />
      ))}
      
      <div className="grain-overlay" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
    </div>
  );
}

function Shape({ shape, mouseX, mouseY }: { shape: any, mouseX: any, mouseY: any }) {
  const shapeRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(shape.baseOpacity);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(1);

  useEffect(() => {
    const updateParallax = () => {
      if (!shapeRef.current) return;
      const rect = shapeRef.current.getBoundingClientRect();
      const shapeCenterX = rect.left + rect.width / 2;
      const shapeCenterY = rect.top + rect.height / 2;

      const dx = mouseX.get() - shapeCenterX;
      const dy = mouseY.get() - shapeCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 500;

      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        const targetOpacity = Math.min(1, Math.max(shape.baseOpacity, strength * 1.5));
        setOpacity(targetOpacity);
        setBrightness(1 + strength * 4);
        setTranslate({ x: dx * 0.03, y: dy * 0.03 });
      } else {
        setOpacity(shape.baseOpacity);
        setBrightness(1);
        setTranslate({ x: 0, y: 0 });
      }
      
      requestAnimationFrame(updateParallax);
    };

    const animFrame = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(animFrame);
  }, [mouseX, mouseY, shape.baseOpacity]);

  const style: React.CSSProperties = {
    position: 'absolute',
    top: shape.top,
    left: shape.left,
    right: shape.right,
    width: shape.width || shape.size,
    height: shape.height || shape.size,
    opacity: opacity,
    filter: `brightness(${brightness})`,
    transform: `translate(${translate.x}px, ${translate.y}px) rotate(${shape.rotate}deg)`,
    transition: 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease',
    zIndex: 0,
  };

  const getShapeClass = () => {
    switch (shape.type) {
      case 'sphere': return 'rounded-full bg-gradient-to-br from-primary/10 to-white/5 backdrop-blur-md border border-white/5';
      case 'pill': return 'rounded-full bg-gradient-to-br from-primary/10 to-white/5 backdrop-blur-md border border-white/5';
      case 'torus': return 'rounded-full border-[15px] border-white/5 shadow-[inset_0_0_40px_rgba(255,153,51,0.1)] bg-transparent';
      case 'octahedron': return 'bg-gradient-to-br from-primary/10 to-white/5 backdrop-blur-md border border-white/5';
      case 'image': return '';
      case 'text': return 'flex items-center justify-center pointer-events-none select-none';
      default: return '';
    }
  };

  return (
    <div 
      ref={shapeRef}
      style={style}
      className={getShapeClass()}
    >
      {shape.type === 'text' && (
        <span 
          className="font-display font-black italic tracking-tighter leading-none"
          style={{ 
            fontSize: shape.size || 200,
            color: 'rgba(255, 153, 51, 0.05)',
            WebkitTextStroke: '2px rgba(255, 153, 51, 0.4)',
            filter: `drop-shadow(0 0 20px rgba(255, 153, 51, 0.2))`
          }}
        >
          {shape.content}
        </span>
      )}
      
      {shape.type === 'octahedron' && (
        <div className="w-full h-full bg-inherit" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      )}
      
      {shape.type === 'image' && (
        <img 
          src={shape.src} 
          alt={shape.alt} 
          className="w-full h-full object-cover grayscale brightness-50 contrast-125 hover:grayscale-0 transition-all duration-700"
          style={{ 
            mixBlendMode: (shape.blend || 'screen') as any,
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)'
          }}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}
