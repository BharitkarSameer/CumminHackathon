import React, { useEffect, useRef } from 'react';

export function LeftPanel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = Math.random() * canvas.height;

    let then = Date.now();
    const fpsInterval = 1000 / 30; // 30fps for realistic matrix feel

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      
      const now = Date.now();
      const elapsed = now - then;

      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        ctx.fillStyle = 'rgba(24, 24, 27, 0.15)'; // Trail effect fade
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#34a853'; // Google Green
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          
          // vary brightness slightly
          ctx.globalAlpha = Math.random() > 0.8 ? 0.4 : 1.0;
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
             drops[i] = 0;
          }
          drops[i]++;
        }
        ctx.globalAlpha = 1.0;
      }
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-zinc-900 pointer-events-none w-full h-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-zinc-900/40 to-zinc-900 z-10 pointer-events-none" />
      <canvas ref={canvasRef} className="block w-full h-full opacity-50 mix-blend-screen" />
    </div>
  );
}

export function RightPanel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const blips = [];
    for(let i=0; i<8; i++){
       blips.push({ angle: Math.random()*Math.PI*2, dist: Math.random()*0.8 + 0.1, life: Math.random() });
    }

    const draw = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.min(cx, cy) - 20;

      ctx.fillStyle = 'rgba(24, 24, 27, 0.1)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(66, 133, 244, 0.15)'; // Google Blue
      ctx.lineWidth = 1;
      
      [1, 0.66, 0.33].forEach(scale => {
         ctx.beginPath(); ctx.arc(cx, cy, r * scale, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();

      // Sweeper
      angle += 0.04;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      
      // Sweeper gradient
      const grad = ctx.createConicGradient(0, 0, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.1, 'rgba(66, 133, 244, 0.5)');
      grad.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, 0, 0.8, false);
      ctx.lineTo(0, 0);
      ctx.fillStyle = grad;
      ctx.fill();
      
      // Sweeper leading edge
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(Math.cos(0.8)*r, Math.sin(0.8)*r);
      ctx.strokeStyle = 'rgba(66, 133, 244, 1)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Draw blips
      blips.forEach(b => {
         b.life -= 0.02;
         if (b.life <= 0) {
            b.angle = Math.random()*Math.PI*2;
            b.dist = Math.random()*0.8 + 0.1;
            b.life = 1.0;
         }

         // Draw if sweeper just passed it roughly
         const blipX = cx + Math.cos(b.angle) * (r * b.dist);
         const blipY = cy + Math.sin(b.angle) * (r * b.dist);
         
         ctx.beginPath();
         ctx.arc(blipX, blipY, 3, 0, Math.PI*2);
         ctx.fillStyle = `rgba(234, 67, 53, ${b.life})`; // Red anomaly
         ctx.fill();
         ctx.strokeStyle = `rgba(234, 67, 53, ${b.life * 0.5})`;
         ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-zinc-900 pointer-events-none w-full h-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-zinc-900/40 to-zinc-900 z-10 pointer-events-none" />
      <canvas ref={canvasRef} className="block w-full h-full opacity-80 mix-blend-screen" />
    </div>
  );
}
