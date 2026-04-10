import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Package, Activity, Zap, Shield, ActivitySquare, Sparkles, Search, FileText } from 'lucide-react';
import '../cover.css';

const TextReveal = ({ text, className, Tag = "span", delay = 0 }) => {
  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.015, delayChildren: delay }}
      >
        {Array.from(text).map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0.2 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.1 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
};

const StreamingSentence = ({ sentence, delay = 0 }) => {
  return (
    <motion.div 
       initial="hidden" 
       animate="visible" 
       transition={{ staggerChildren: 0.04, delayChildren: delay }} 
       className="flex justify-center flex-wrap leading-tight"
    >
      {Array.from(sentence).map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, filter: 'blur(12px)', y: 15, scale: 0.8 },
            visible: { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal', marginRight: char === ' ' ? '0.2em' : '0' }}
        >
          {char === ' ' ? '' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const InteractiveParticleSwarm = ({ currentShapeIndex }) => {
  const canvasRef = useRef(null);
  const shapeIndexRef = useRef(currentShapeIndex);

  useEffect(() => {
    shapeIndexRef.current = currentShapeIndex;
  }, [currentShapeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let objectPoints = [];

    const createPoints = () => {
       const w = Math.min(width, height);
       const s = w * 0.35; 
       
       const addLine = (pts, p1, p2, density = 5) => {
          const dist = Math.hypot(p1.x-p2.x, p1.y-p2.y, p1.z-p2.z);
          const steps = Math.max(10, Math.floor(dist / density));
          for(let i=0; i<=steps; i++){
             const t = i/steps || 0;
             pts.push({ x: p1.x + (p2.x-p1.x)*t, y: p1.y + (p2.y-p1.y)*t, z: p1.z + (p2.z-p1.z)*t });
          }
       }

       const addBox = (pts, bw, bh, bd, ox=0, oy=0, oz=0) => {
         const v = [
            {x:ox-bw,y:oy-bh,z:oz-bd}, {x:ox+bw,y:oy-bh,z:oz-bd}, {x:ox+bw,y:oy+bh,z:oz-bd}, {x:ox-bw,y:oy+bh,z:oz-bd},
            {x:ox-bw,y:oy-bh,z:oz+bd}, {x:ox+bw,y:oy-bh,z:oz+bd}, {x:ox+bw,y:oy+bh,z:oz+bd}, {x:ox-bw,y:oy+bh,z:oz+bd}
         ];
         addLine(pts, v[0],v[1]); addLine(pts, v[1],v[2]); addLine(pts, v[2],v[3]); addLine(pts, v[3],v[0]);
         addLine(pts, v[4],v[5]); addLine(pts, v[5],v[6]); addLine(pts, v[6],v[7]); addLine(pts, v[7],v[4]);
         addLine(pts, v[0],v[4]); addLine(pts, v[1],v[5]); addLine(pts, v[2],v[6]); addLine(pts, v[3],v[7]);
       }

       const addCylinder = (pts, r, ch, segments=20, ox=0, oy=0, oz=0) => {
          for(let i=0; i<segments; i++) {
             const a1 = (i/segments)*Math.PI*2;
             const a2 = ((i+1)/segments)*Math.PI*2;
             addLine(pts, {x:ox+Math.cos(a1)*r, y:oy-ch, z:oz+Math.sin(a1)*r}, {x:ox+Math.cos(a2)*r, y:oy-ch, z:oz+Math.sin(a2)*r});
             addLine(pts, {x:ox+Math.cos(a1)*r, y:oy+ch, z:oz+Math.sin(a1)*r}, {x:ox+Math.cos(a2)*r, y:oy+ch, z:oz+Math.sin(a2)*r});
             if(i % Math.floor(segments/4) === 0) {
               addLine(pts, {x:ox+Math.cos(a1)*r, y:oy-ch, z:oz+Math.sin(a1)*r}, {x:ox+Math.cos(a1)*r, y:oy+ch, z:oz+Math.sin(a1)*r});
             }
          }
       }
       
       const addSphere = (pts, r, ox=0, oy=0, oz=0, bands=12) => {
          for(let i=0; i<bands; i++){
            const a = (i/bands)*Math.PI*2;
            for(let j=1; j<4; j++){
               const a2 = (j/4)*Math.PI;
               pts.push({ x: ox + Math.cos(a)*r*Math.cos(a2), y: oy + Math.sin(a)*r, z: oz + Math.cos(a)*r*Math.sin(a2) });
            }
          }
       }

       const ac = []; // 0. Air Conditioner
       // Main body
       addBox(ac, s*1.4, s*0.4, s*0.4); 
       // Front grill vents
       for(let i=-3; i<=3; i++) {
         addLine(ac, {x:-s*1.3, y:i*s*0.08, z:s*0.4}, {x:s*1.3, y:i*s*0.08, z:s*0.4});
       }
       // Side details
       addLine(ac, {x:-s*1.4, y:-s*0.4, z:0}, {x:-s*1.4, y:s*0.4, z:0});
       addLine(ac, {x:s*1.4, y:-s*0.4, z:0}, {x:s*1.4, y:s*0.4, z:0});
       // Power button
       addSphere(ac, s*0.05, s*1.1, s*0.2, s*0.4, 8);

       const rh = []; // 1. Room Heater
       // Vertical Body
       addBox(rh, s*0.4, s*1.1, s*0.15); 
       // Top curve/handle
       addCylinder(rh, s*0.2, s*0.05, 12, 0, -s*1.1, 0);
       // Grill mesh
       for(let i=-6; i<=6; i++) {
         addLine(rh, {x:i*s*0.05, y:-s*0.8, z:s*0.15}, {x:i*s*0.05, y:s*0.8, z:s*0.15});
         addLine(rh, {x:-s*0.3, y:i*s*0.1, z:s*0.15}, {x:s*0.3, y:i*s*0.1, z:s*0.15});
       }
       // Feet/Base
       addBox(rh, s*0.5, s*0.1, s*0.3, 0, s*1.1, 0);

       const mr = []; // 2. Mosquito Repellent
       // Main base (rounded box)
       addCylinder(mr, s*0.4, s*0.3, 16, 0, s*0.2, 0);
       // Cap
       addCylinder(mr, s*0.3, s*0.1, 16, 0, -s*0.1, 0);
       // The 'wick' bottle
       addCylinder(mr, s*0.25, s*0.4, 12, 0, s*0.6, 0); 
       // Plug pins
       addLine(mr, {x:-s*0.1, y:s*0.2, z:-s*0.4}, {x:-s*0.1, y:s*0.2, z:-s*0.7});
       addLine(mr, {x:s*0.1, y:s*0.2, z:-s*0.4}, {x:s*0.1, y:s*0.2, z:-s*0.7});
       
       const mg = []; // 3. Mixer Grinder
       // Motor base (tapered)
       for(let i=0; i<10; i++) {
         const r = s*0.6 - (i*s*0.02);
         addCylinder(mg, r, s*0.05, 16, 0, s*0.8 - i*s*0.05, 0);
       }
       // The Jar
       addCylinder(mg, s*0.45, s*0.6, 16, 0, -s*0.2, 0);
       // Jar Handle
       addLine(mg, {x:s*0.45, y:-s*0.6, z:0}, {x:s*0.7, y:-s*0.6, z:0});
       addLine(mg, {x:s*0.7, y:-s*0.6, z:0}, {x:s*0.7, y:-s*0.1, z:0});
       addLine(mg, {x:s*0.7, y:-s*0.1, z:0}, {x:s*0.45, y:-s*0.1, z:0});
       // Speed Knob
       addSphere(mg, s*0.1, 0, s*0.5, s*0.5, 8);

       const wp = []; // 4. Water Purifier
       // Modern slim body
       addBox(wp, s*0.5, s*0.9, s*0.4); 
       // Dispenser Tap
       addCylinder(wp, s*0.05, s*0.1, 8, 0, s*0.6, s*0.4);
       addLine(wp, {x:0, y:s*0.7, z:s*0.4}, {x:0, y:s*0.8, z:s*0.4});
       // Internal Filter cylinder visible partly
       addCylinder(wp, s*0.3, s*0.4, 12, 0, -s*0.3, 0);
       // Brand Panel
       for(let i=-2; i<=2; i++) addLine(wp, {x:i*s*0.1, y:-s*0.7, z:s*0.4}, {x:i*s*0.1, y:-s*0.6, z:s*0.4});

       const ek = []; // 5. Electric Kettle
       // Tapered Jar
       for(let i=0; i<10; i++) {
         const r = s*0.5 - (i*s*0.015);
         addCylinder(ek, r, s*0.05, 16, 0, s*0.5 - i*s*0.1, 0);
       }
       // Spout
       addLine(ek, {x:-s*0.45, y:-s*0.3, z:0}, {x:-s*0.7, y:-s*0.5, z:0});
       addLine(ek, {x:-s*0.45, y:-s*0.1, z:0}, {x:-s*0.7, y:-s*0.5, z:0});
       // Handle (Curved)
       for(let j=0; j<8; j++) {
         const a1 = -1 + (j/8)*2;
         const a2 = -1 + ((j+1)/8)*2;
         addLine(ek, {x:s*0.45+Math.cos(a1)*s*0.2, y:j*s*0.1, z:0}, {x:s*0.45+Math.cos(a2)*s*0.2, y:(j+1)*s*0.1, z:0});
       }
       // Base plate
       addCylinder(ek, s*0.55, s*0.05, 16, 0, s*0.6, 0);

       const ck = []; // 6. Cricket Kit
       // Detailed Bat
       addBox(ck, s*0.25, s*0.9, s*0.1, -s*0.4, s*0.3, 0); 
       addCylinder(ck, s*0.06, s*0.5, 12, -s*0.4, -s*0.9, 0); 
       // Ball (High density sphere)
       addSphere(ck, s*0.22, s*0.5, s*0.6, s*0.1, 40); 
       // Stumps (Simplified 3 lines)
       for(let i=-1; i<=1; i++) addLine(ck, {x:i*s*0.15, y:0, z:-s*0.4}, {x:i*s*0.15, y:s*1.2, z:-s*0.4});

       const ap = []; // 7. Air Purifier
       // Tower design
       addCylinder(ap, s*0.4, s*1.2, 24); 
       // Grill holes simulation
       for(let i=-4; i<=4; i++) {
         addCylinder(ap, s*0.42, s*0.02, 24, 0, i*s*0.2, 0);
       }
       // Top control panel
       addCylinder(ap, s*0.3, s*0.02, 16, 0, -s*1.2, 0);
       addSphere(ap, s*0.05, 0, -s*1.22, 0, 8);

       const ref = []; // 8. Refrigerator
       // Tall Main Body
       addBox(ref, s*0.7, s*1.5, s*0.6); 
       // Door split line
       addLine(ref, {x:0, y:-s*1.5, z:s*0.6}, {x:0, y:s*1.5, z:s*0.6});
       // Handles
       addLine(ref, {x:-s*0.1, y:-s*0.5, z:s*0.65}, {x:-s*0.1, y:s*0.3, z:s*0.65}); 
       addLine(ref, {x:s*0.1, y:-s*0.5, z:s*0.65}, {x:s*0.1, y:s*0.3, z:s*0.65});
       // Back coil simulation
       for(let i=-5; i<=5; i++) addLine(ref, {x:-s*0.6, y:i*s*0.25, z:-s*0.6}, {x:s*0.6, y:i*s*0.25, z:-s*0.6});

       const ew = []; // 9. Ethnic Wear Combo
       // The 'Hanger' Shirt Shape
       addLine(ew, {x:0, y:-s*1.2, z:0}, {x:-s*0.8, y:-s*0.9, z:0});
       addLine(ew, {x:0, y:-s*1.2, z:0}, {x:s*0.8, y:-s*0.9, z:0});
       addBox(ew, s*0.6, s*0.8, s*0.1, 0, -s*0.3, 0);
       // The Folded Pants below
       addBox(ew, s*0.5, s*0.6, s*0.15, 0, s*0.6, 0);
       // Buttons
       for(let i=-2; i<=2; i++) addSphere(ew, s*0.03, 0, i*s*0.1 - s*0.3, s*0.1, 6);

       return [ac, rh, mr, mg, wp, ek, ck, ap, ref, ew];
     };

    objectPoints = createPoints();

    const resize = () => {
      // Find parent layout element (the hero section) to constrain the canvas properly
      // We will match the canvas width/height to the hero section size.
      width = window.innerWidth;
      height = window.innerHeight; 
      canvas.width = width;
      canvas.height = height;
      objectPoints = createPoints();
    };
    window.addEventListener('resize', resize);
    // Explicitly call once to bind properly
    resize();

    const numParticles = width < 768 ? 800 : 1600; 
    const colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#8b5cf6', '#111111'];
    
    const particles = Array.from({length: numParticles}).map(() => ({
       x: width/2 + (Math.random() - 0.5) * width,
       y: height/2 + (Math.random() - 0.5) * height,
       vx: (Math.random() - 0.5) * 5,
       vy: (Math.random() - 0.5) * 5,
       size: Math.random() > 0.8 ? 3 : (Math.random() > 0.4 ? 2 : 1),
       color: colors[Math.floor(Math.random() * colors.length)],
       phase: Math.random() * Math.PI * 2,
       targetRandX: (Math.random() - 0.5) * 20,
       targetRandY: (Math.random() - 0.5) * 20
    }));

    let mouse = { x: -1000, y: -1000 };
    let isSwarming = false;

    // Use pageY instead of clientY to handle scrolling, but since canvas is inside h-screen, client works too.
    const onMouseMove = (e) => { 
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseOut = () => { mouse.x = -1000; mouse.y = -1000; };
    
    const onExplode = () => {
       isSwarming = true;
       particles.forEach(p => {
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * 60 + 30;
          p.vx = Math.cos(a) * r;
          p.vy = Math.sin(a) * r;
       });
       setTimeout(() => { isSwarming = false; }, 900); 
    };
    window.addEventListener('explodeSwarm', onExplode);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);

    let rotY = 0;
    
    const render = () => {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.3; 
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1.0;

      rotY += 0.003;
      const rotX = Math.sin(Date.now() * 0.0005) * 0.25;

      const currentPts = objectPoints[shapeIndexRef.current % objectPoints.length];
      const projected = currentPts.map(t => {
         const x1 = t.x * Math.cos(rotY) - t.z * Math.sin(rotY);
         const z1 = t.z * Math.cos(rotY) + t.x * Math.sin(rotY);
         const y2 = t.y * Math.cos(rotX) - z1 * Math.sin(rotX);
         const z2 = z1 * Math.cos(rotX) + t.y * Math.sin(rotX);
         const scale = 1100 / (1100 + z2); 
         return { x: width/2 + x1 * scale, y: height/2 + y2 * scale };
      });

      particles.forEach((p, i) => {
         let tx = width/2;
         let ty = height/2;
         
         if (projected.length > 0 && !isSwarming) {
            const target = projected[i % projected.length];
            tx = target.x + p.targetRandX * Math.sin(Date.now()*0.001 + p.phase);
            ty = target.y + p.targetRandY * Math.cos(Date.now()*0.001 + p.phase);
         }

         const dxMouse = mouse.x - p.x;
         const dyMouse = mouse.y - p.y;
         const distMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);

         if (distMouse < 200) {
            const force = (200 - distMouse) / 200;
            p.vx -= (dxMouse / distMouse) * force * 10;
            p.vy -= (dyMouse / distMouse) * force * 10;
         }

         if (!isSwarming) {
            p.vx += (tx - p.x) * 0.08;
            p.vy += (ty - p.y) * 0.08;
            p.vx *= 0.82; 
            p.vy *= 0.82;
         } else {
            p.vx *= 0.94;
            p.vy *= 0.94;
         }

         p.x += p.vx;
         p.y += p.vy;

         ctx.fillStyle = p.color;
         ctx.fillRect(p.x, p.y, p.size, p.size); 
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('explodeSwarm', onExplode);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
    </>
  );
};

const DarkInteractiveSwarm = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    const points = [];
    const bands = 45;
    const r = Math.min(width, height) * 0.7;
    for(let i=0; i<=bands; i++){
      const theta = (i / bands) * Math.PI; 
      const numPointsInBand = Math.max(1, Math.floor(Math.sin(theta) * bands * 2.5));
      for(let j=0; j<numPointsInBand; j++) {
        const phi = (j / numPointsInBand) * Math.PI * 2;
        points.push({
          x: r * Math.sin(theta) * Math.cos(phi),
          y: r * Math.cos(theta),
          z: r * Math.sin(theta) * Math.sin(phi),
          randOff: Math.random() * Math.PI * 2
        });
      }
    }

    let rotY = 0;
    let rotX = 0;
    
    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e) => { 
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseOut = () => { mouse.x = -1000; mouse.y = -1000; };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseout', onMouseOut);

    const render = () => {
      ctx.fillStyle = '#050505'; 
      ctx.fillRect(0, 0, width, height);

      rotY += 0.0015;
      rotX = Math.sin(Date.now() * 0.0003) * 0.15;

      const centerX = width * 0.7; 
      const centerY = height * 0.5;

      points.forEach(p => {
        const jx = Math.sin(Date.now()*0.001 + p.randOff) * 3;
        const jy = Math.cos(Date.now()*0.001 + p.randOff) * 3;
        
        const px = p.x + jx;
        const py = p.y + jy;
        const pz = p.z;

        const x1 = px * Math.cos(rotY) - pz * Math.sin(rotY);
        const z1 = pz * Math.cos(rotY) + px * Math.sin(rotY);
        const y2 = py * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = z1 * Math.cos(rotX) + py * Math.sin(rotX);
        
        const scale = 1400 / (1400 + z2);
        let screenX = centerX + x1 * scale;
        let screenY = centerY + y2 * scale;

        const dx = mouse.x - screenX;
        const dy = mouse.y - screenY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
           const force = (150 - dist) / 150;
           screenX -= (dx / dist) * force * 60;
           screenY -= (dy / dist) * force * 60;
        }

        const depthAlpha = Math.max(0.05, Math.min(1, (z2 + r) / (r * 1.5)));
        ctx.globalAlpha = depthAlpha;
        
        if (z2 > -r * 0.8) { 
           const size = Math.max(1, 2.5 * scale);
           const streakLen = 5 * scale;
           ctx.beginPath();
           ctx.moveTo(screenX, screenY);
           const scDx = screenX - centerX;
           const scDy = screenY - centerY;
           const scL = Math.sqrt(scDx*scDx + scDy*scDy) || 1;
           ctx.lineTo(screenX + (scDx/scL)*streakLen, screenY + (scDy/scL)*streakLen);
           ctx.lineWidth = size;
           ctx.strokeStyle = '#4285f4';
           ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 cursor-crosshair rounded-[2.5rem]" />;
};

export default function CoverPage() {
  const navigate = useNavigate();
  const [shapeIndex, setShapeIndex] = useState(0);

  const handleInteraction = () => {
     window.dispatchEvent(new Event('explodeSwarm'));
     setShapeIndex(prev => prev + 1);
  };

  useEffect(() => {
    // Automatically explode and transition to the next product every 4000ms
    const timer = setInterval(() => {
      handleInteraction();
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const objectNames = [
    'Air Conditioner 1.5T',
    'Room Heater 2000W',
    'Mosquito Repellent Set',
    'Mixer Grinder 750W',
    'Water Purifier RO',
    'Electric Kettle 1.5L',
    'Cricket Kit',
    'Air Purifier',
    'Refrigerator 300L',
    'Ethnic Wear Combo'
  ];

  return (
    <div className="cover-page min-h-screen bg-[#ffffff] text-zinc-900 font-sans overflow-x-hidden relative" style={{ margin: 0, padding: 0 }}>
      
      {/* 100vh Hero Section - Isolated */}
      <section 
         className="relative w-full h-screen overflow-hidden flex flex-col justify-between cursor-crosshair border-b border-zinc-100"
         onClick={handleInteraction}
      >
        <InteractiveParticleSwarm currentShapeIndex={shapeIndex} />

        <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6 w-full max-w-[1600px] mx-auto pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col items-start backdrop-blur-md bg-white/40 px-8 py-4 rounded-[1.5rem] border border-white/40 shadow-sm pointer-events-auto cursor-pointer group hover:bg-white/60 transition-all duration-300"
            onClick={() => navigate('/')}
          >
            <span style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '0.08em', color: '#111', lineHeight: '1', fontFamily: 'serif', transition: 'opacity 0.2s', textTransform: 'uppercase' }} className="group-hover:opacity-70">
               DemandIQ
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.35em', color: '#8a8981', marginTop: '6px', transition: 'opacity 0.2s', textTransform: 'uppercase' }} className="group-hover:opacity-70">
               Inspired by Williams-Sonoma
            </span>
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-zinc-600 pointer-events-auto bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 shadow-sm">
             <span className="hover:text-black transition-colors cursor-pointer">Product</span>
             <span onClick={() => navigate('/use-cases')} className="hover:text-black transition-colors cursor-pointer">Use Cases</span>
             <span className="hover:text-black transition-colors cursor-pointer">Pricing</span>
             <span onClick={() => navigate('/resources')} className="hover:text-black transition-colors cursor-pointer">Resources</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }} 
            className="px-5 py-2.5 bg-[#18181b] text-white rounded-full text-sm font-medium hover:bg-black transition-all shadow-xl flex items-center gap-2 cursor-pointer pointer-events-auto"
          >
             Enter Dashboard
          </button>
        </nav>

        <header className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4 w-full pointer-events-none">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="w-full relative max-w-6xl">
            
            <div className="flex items-center justify-center gap-2 mb-8 pointer-events-auto">
              <span className="px-4 py-1.5 rounded-full bg-white/80 border border-zinc-200/50 backdrop-blur-md text-xs font-semibold tracking-widest uppercase text-zinc-600 flex items-center gap-2 shadow-sm pulse-glow">
                <Sparkles className="w-4 h-4 text-[#ea4335]" /> Click anywhere to swarm
              </span>
            </div>

            <div className="relative inline-block pointer-events-none w-full">
              <div className="absolute inset-0 bg-white/70 blur-3xl rounded-[100%] scale-[1.3] -z-10" />
              <h1 className="relative text-[3.5rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-medium tracking-tighter text-zinc-900 leading-[0.95] z-10 drop-shadow-sm w-full" style={{ letterSpacing: '-0.04em', margin: '0 0 2rem 0' }}>
                <StreamingSentence sentence="Predict demand." delay={0.2} />
                <StreamingSentence sentence="Prevent stockouts." delay={0.9} />
              </h1>
            </div>

            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 font-regular tracking-normal leading-relaxed relative z-10" style={{ margin: '0 auto 2.5rem' }}>
              AI prediction model currently simulating volume for:<br/>
              <span className="font-semibold text-zinc-900 text-xl md:text-2xl mt-2 inline-block bg-white/60 border border-zinc-200/50 backdrop-blur-md px-5 py-1.5 rounded-xl shadow-sm">
                 {objectNames[shapeIndex % objectNames.length]}
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-20 pointer-events-auto mt-4 w-full">
              <button 
                onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
                style={{ padding: '1rem 2.5rem' }}
                className="bg-[#18181b] text-white rounded-full font-medium text-[16px] flex items-center justify-center gap-2 transition-all hover:bg-black hover:scale-105 cursor-pointer shadow-2xl"
              >
                 <Zap className="w-5 h-5" /> Enter Dashboard
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
                style={{ padding: '1rem 2.5rem' }}
                className="bg-white/90 backdrop-blur-xl text-zinc-800 rounded-full font-medium text-[16px] transition-all hover:bg-zinc-50 cursor-pointer shadow-md shadow-zinc-200/50 border border-zinc-200"
              >
                 Explore Insights
              </button>
            </div>
          </motion.div>
        </header>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center opacity-60 z-10 pointer-events-none">
           <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500 mb-2">Scroll</span>
           <div className="w-px h-8 bg-current opacity-50" />
        </div>
      </section>

      {/* --- PAGE CONTENT --- */}

      {/* Structured Glass Cards */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 mt-20 mb-32">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="flex flex-col gap-1 bg-white/90 backdrop-blur-xl border border-zinc-200/80 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#e8f0fe] rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#4285f4]" />
              </div>
              <span className="text-xs text-[#4285f4] font-mono font-medium">+24.8%</span>
            </div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] font-semibold mb-1">Demand Forecast</p>
            <p className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-900">High Growth</p>
          </div>

          <div className="flex flex-col gap-1 bg-white/90 backdrop-blur-xl border border-zinc-200/80 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#e6f4ea] rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-[#34a853]" />
              </div>
              <span className="text-xs text-[#34a853] font-mono font-medium">Live Sync</span>
            </div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] font-semibold mb-1">Inventory Optimized</p>
            <p className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-900">99.8% Efficiency</p>
          </div>

          <div className="flex flex-col gap-1 bg-white/90 backdrop-blur-xl border border-zinc-200/80 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#fce8e6] rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#ea4335]" />
              </div>
              <span className="text-xs text-zinc-400 font-mono font-medium">Status</span>
            </div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] font-semibold mb-1">Stockout Risk</p>
            <p className="text-2xl md:text-3xl font-medium tracking-tight text-[#ea4335]">Mitigated</p>
          </div>
        </motion.div>
      </section>



      {/* ANTIGRAVITY-STYLE SPACIOUS FEATURES */}
      <section className="bg-white px-6 w-full relative z-10 pb-20">
        
        {/* Feature 1: Demand Forecasting */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full max-w-[1300px] mx-auto mb-40 md:mb-56">
          <div className="flex-[0.8] flex flex-col items-start w-full pr-0 lg:pr-10">
            <h2 className="text-[2.25rem] md:text-[3.25rem] font-normal text-zinc-900 tracking-tight leading-[1.1] mb-6">
               <TextReveal text="Precision" /><br className="hidden md:block"/>
               <TextReveal text="forecasting" delay={0.15} />
            </h2>
            <p className="text-zinc-500 font-normal leading-relaxed text-[17px] md:text-[19px] max-w-md mb-8">
               <TextReveal text="Intuitively integrate historical sales, seasons, and anomalies to guide and refine your purchasing strategy using state-of-the-art AI." delay={0.3} Tag="span" />
            </p>
            <button className="px-6 py-3 bg-zinc-50 border border-zinc-200/80 rounded-full text-[14px] font-medium text-zinc-800 hover:bg-zinc-100 transition-all">
               Explore Forecast
            </button>
          </div>
          <div className="flex-[1.2] w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] relative flex items-center justify-center p-8 border border-zinc-100 bg-zinc-50/50 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0fe] to-[#e6f4ea] opacity-40 blur-3xl rounded-full scale-150 transform -z-10" />
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="w-full max-w-[420px] bg-white backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8"
            >
               <div className="flex justify-between items-center mb-10">
                  <span className="text-[13px] font-medium text-zinc-500 flex items-center gap-2"><Activity className="w-4 h-4 text-[#4285f4]"/> Network Prediction</span>
                  <span className="w-2.5 h-2.5 bg-[#4285f4] rounded-full animate-pulse" />
               </div>
               <div className="w-full flex items-end justify-between h-48 gap-3">
                  {[30, 45, 40, 65, 55, 80, 100].map((h, i) => (
                     <div key={i} className="w-full flex flex-col items-center gap-3">
                        <motion.div 
                          initial={{ height: "0%" }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                          className={`w-full rounded-[4px] ${i === 6 ? 'bg-[#4285f4]' : 'bg-[#e8f0fe]'}`} 
                        />
                     </div>
                  ))}
               </div>
            </motion.div>
          </div>
        </div>

        {/* Feature 2: Smart Inventory (Reversed) */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24 w-full max-w-[1300px] mx-auto mb-40 md:mb-56">
          <div className="flex-[0.8] flex flex-col items-start w-full pl-0 lg:pl-10">
            <h2 className="text-[2.25rem] md:text-[3.25rem] font-normal text-zinc-900 tracking-tight leading-[1.1] mb-6">
               <TextReveal text="Intelligent" /><br className="hidden md:block"/>
               <TextReveal text="rebalancing" delay={0.15} />
            </h2>
            <p className="text-zinc-500 font-normal leading-relaxed text-[17px] md:text-[19px] max-w-md mb-8">
               <TextReveal text="Balance stock levels precisely across your entire network. Command the system natively using natural language directives or rule-based triggers." delay={0.3} Tag="span" />
            </p>
            <button className="px-6 py-3 bg-zinc-50 border border-zinc-200/80 rounded-full text-[14px] font-medium text-zinc-800 hover:bg-zinc-100 transition-all">
               View Rebalance Log
            </button>
          </div>
          <div className="flex-[1.2] w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] relative flex items-center justify-center p-8 border border-zinc-100 bg-zinc-50/50 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e6f4ea] to-[#fef7e0] opacity-40 blur-3xl rounded-full scale-150 transform -z-10" />
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="w-full max-w-[420px] bg-white backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-6"
            >
               <div className="w-full bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 flex-shrink-0 bg-white border border-zinc-200 rounded-full flex items-center justify-center shadow-sm">
                     <Package className="w-4 h-4 text-[#34a853]" />
                  </div>
                  <span className="text-[14px] text-zinc-600 font-medium leading-relaxed">Rebalance SKU-499 across Midwest DC.</span>
               </div>
               <div className="flex justify-end gap-3 pr-2">
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                     <Shield className="w-3.5 h-3.5 text-zinc-300" /> Checks Passed
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-center gap-2 px-3 py-1.5 bg-[#e6f4ea] text-[#34a853] rounded-full text-xs font-bold tracking-wide">
                     <Zap className="w-3 h-3" /> Executing
                  </motion.div>
               </div>
            </motion.div>
          </div>
        </div>

        {/* Feature 3: Actionable Alerts */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full max-w-[1300px] mx-auto mb-20 md:mb-32">
          <div className="flex-[0.8] flex flex-col items-start w-full pr-0 lg:pr-10">
            <h2 className="text-[2.25rem] md:text-[3.25rem] font-normal text-zinc-900 tracking-tight leading-[1.1] mb-6">
               <TextReveal text="Actionable" /><br className="hidden md:block"/>
               <TextReveal text="global alerts" delay={0.15} />
            </h2>
            <p className="text-zinc-500 font-normal leading-relaxed text-[17px] md:text-[19px] max-w-md mb-8">
               <TextReveal text="Manage supply chain perturbations instantly, from one central mission control view. Identify risks before they culminate into stockouts." delay={0.3} Tag="span" />
            </p>
            <button className="px-6 py-3 bg-zinc-50 border border-zinc-200/80 rounded-full text-[14px] font-medium text-zinc-800 hover:bg-zinc-100 transition-all">
               Monitor Alerts
            </button>
          </div>
          <div className="flex-[1.2] w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] relative flex items-center justify-center p-8 border border-zinc-100 bg-zinc-50/50 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-tl from-[#fce8e6] via-[#fef7e0] to-white opacity-60 blur-3xl rounded-full scale-150 transform -z-10" />
            
            <div className="w-full max-w-[380px] flex flex-col gap-4 relative">
               <span className="text-[13px] font-medium text-zinc-500 mb-2 pl-2">Inbox <Zap className="w-3 h-3 inline pb-0.5"/></span>
               {[ 
                 { title: 'Critical Stockout Predicted', desc: 'Warehouse A is projected to deplete SKU-92B within 48 hours.', time: 'now', crit: true },
                 { title: 'Supplier Delay Notice', desc: 'Upstream transit time increased by 2 days.', time: '2m ago', crit: false },
               ].map((alert, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, delay: i * 0.2 }}
                     className={`w-full bg-white backdrop-blur-xl border ${alert.crit ? 'border-red-100' : 'border-zinc-100'} rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6`}
                  >
                     <div className="flex justify-between items-center mb-2">
                        <span className={`text-[14px] font-medium ${alert.crit ? 'text-[#ea4335]' : 'text-zinc-800'}`}>
                          {alert.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">{alert.time}</span>
                     </div>
                     <p className="text-[12px] text-zinc-500 leading-relaxed m-0 pr-4">
                        {alert.desc}
                     </p>
                  </motion.div>
               ))}
            </div>
          </div>
        </div>



      </section>

      {/* GIGANTIC Footer inspired directly by Antigravity's bold layout */}
      <footer className="bg-white px-6 md:px-12 pt-16 md:pt-24 pb-8 flex flex-col relative z-20">

        {/* Dark Interactive Section with Stats */}
        <section className="relative w-full h-[500px] md:h-[650px] bg-[#050505] rounded-[2.5rem] overflow-hidden flex items-center justify-center px-8 md:px-20 mx-auto max-w-[1500px] mb-24 shadow-2xl">
           <DarkInteractiveSwarm />
           <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.05]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
           
           <div className="relative z-10 w-full max-w-[1200px] pointer-events-none">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 justify-items-center md:justify-items-start w-full">
               {[
                 { value: "10+", label: "SKUs Tracked" },
                 { value: "7 Days", label: "AI Predictions" },
                 { value: "Live", label: "Real-time Alerts" },
                 { value: "Smart", label: "Inventory Planning" }
               ].map((stat, i) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    key={i} 
                    className="flex flex-col items-center md:items-start gap-3 drop-shadow-md"
                 >
                   <p className="text-5xl md:text-[4rem] lg:text-[5rem] font-medium tracking-tighter text-white leading-none">{stat.value}</p>
                   <p className="text-[10px] text-zinc-400 uppercase tracking-[0.25em] font-bold">{stat.label}</p>
                 </motion.div>
               ))}
             </div>
           </div>
        </section>

        <div className="flex flex-col md:flex-row justify-between items-end w-full max-w-[1500px] mx-auto mt-8 mb-24 px-4 md:px-8">
          <div className="flex flex-col gap-6">
             <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 leading-[1.05]">
               Experience liftoff<br/>
               <span className="text-zinc-400">with DemandIQ.</span>
             </h3>
             <button onClick={() => navigate('/dashboard')} className="w-fit mt-4 px-8 py-4 bg-zinc-900 text-white rounded-full font-semibold text-[15px] hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2">
                Launch Platform <Zap className="w-4 h-4 fill-white"/>
             </button>
          </div>
          <div className="flex gap-16 text-[14px] font-medium text-zinc-500 mt-16 md:mt-0 mb-4">
             <div className="flex flex-col gap-4">
               <span className="cursor-pointer text-zinc-900 font-semibold hover:text-black transition-colors" onClick={() => navigate('/dashboard')}>Launch Dashboard</span>
               <span className="cursor-pointer hover:text-zinc-900 transition-colors">Product</span>
               <span className="cursor-pointer hover:text-zinc-900 transition-colors">Docs</span>
               <span className="cursor-pointer hover:text-zinc-900 transition-colors" onClick={() => navigate('/resources')}>Resources</span>
             </div>
             <div className="flex flex-col gap-4">
               <span className="cursor-pointer hover:text-zinc-900 transition-colors">Blog</span>
               <span className="cursor-pointer hover:text-zinc-900 transition-colors">Pricing</span>
               <span className="cursor-pointer hover:text-zinc-900 transition-colors" onClick={() => navigate('/use-cases')}>Use Cases</span>
             </div>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-center justify-center overflow-hidden mb-16">
          <h1 className="font-bold tracking-tight text-zinc-900 w-full text-center leading-[0.8] select-none" style={{ fontSize: 'clamp(3rem, 15vw, 20rem)', letterSpacing: '0.04em', fontFamily: 'serif', textTransform: 'uppercase' }}>
            DemandIQ
          </h1>
          <p className="text-zinc-400 font-bold tracking-[0.4em] uppercase mt-4 text-[clamp(10px, 1.5vw, 18px)]">
            Inspired by Williams-Sonoma
          </p>
        </div>

        <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto mt-auto pt-8 border-t border-zinc-100 text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-zinc-900">The Deployment Squad</span>
          </div>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-zinc-900 transition-colors hidden sm:block">About</span>
            <span className="cursor-pointer hover:text-zinc-900 transition-colors hidden sm:block">Privacy</span>
            <span className="cursor-pointer hover:text-zinc-900 transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
