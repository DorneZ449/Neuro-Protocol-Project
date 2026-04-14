import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    const planets: { x: number; y: number; size: number; color: string; speed: number }[] = [];

    // Создаём звёзды
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5,
      });
    }

    // Создаём планеты
    const planetColors = ['#4a90e2', '#e24a4a', '#e2a04a', '#4ae2a0'];
    for (let i = 0; i < 5; i++) {
      planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30 + Math.random() * 50,
        color: planetColors[Math.floor(Math.random() * planetColors.length)],
        speed: 0.1 + Math.random() * 0.3,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем звёзды
      stars.forEach((star) => {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Рисуем планеты
      planets.forEach((planet) => {
        const gradient = ctx.createRadialGradient(
          planet.x, planet.y, 0,
          planet.x, planet.y, planet.size
        );
        gradient.addColorStop(0, planet.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fill();

        planet.x += planet.speed;
        if (planet.x > canvas.width + planet.size) {
          planet.x = -planet.size;
          planet.y = Math.random() * canvas.height;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(to bottom, #0a0a1e, #1a1a3e)' }}
    />
  );
}
