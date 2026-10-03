import React, { useState, useEffect } from 'react';
import DwarfStar from './DwarfStar';
import BrownDwarfStar from './BrownDwarfStar';
import NeutronStar from './NeutronStar';
import Pulsar from './Pulsar';
import Magnetar from './Magnetar';
import BlackHole from './BlackHole';
import WhiteHole from './WhiteHole';
import Quasar from './Quasar';
import Theory from './Theory';

const ASTRO_OBJECTS = [
  { id: 'dwarf', name: 'White Dwarf', component: DwarfStar },
  { id: 'browndwarf', name: 'Brown Dwarf', component: BrownDwarfStar },
  { id: 'neutron', name: 'Neutron Star', component: NeutronStar },
  { id: 'pulsar', name: 'Pulsar', component: Pulsar },
  { id: 'magnetar', name: 'Magnetar', component: Magnetar },
  { id: 'blackhole', name: 'Black Hole', component: BlackHole },
  { id: 'whitehole', name: 'White Hole', component: WhiteHole },
  { id: 'quasar', name: 'Quasar', component: Quasar },
  { id: 'theory', name: 'Theoretical', component: Theory },
];

export default function App() {
  // Start with Black Hole (index 5) as the default view
  const [selectedIndex, setSelectedIndex] = useState(5);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const CurrentComponent = ASTRO_OBJECTS[selectedIndex].component;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#000', overflow: 'hidden' }}>
      
      {/* Hide scrollbar for the mobile navigation container while keeping it swipeable */}
      <style>
        {`
          .nav-container::-webkit-scrollbar { display: none; }
          .nav-container { scrollbar-width: none; -ms-overflow-style: none; }
        `}
      </style>

      {/* Renders the currently selected astrophysical simulator */}
      <CurrentComponent />

      {/* Global Navigation HUD */}
      <div 
        className="nav-container"
        style={{
          position: 'absolute',
          top: isMobile ? '8px' : '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          padding: '10px',
          background: 'rgba(10, 10, 10, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 100,
          // Mobile: Scroll horizontally. PC: Wrap to new lines if needed.
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          justifyContent: isMobile ? 'flex-start' : 'center',
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          width: 'max-content',
          maxWidth: isMobile ? '95vw' : '90vw',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
        {ASTRO_OBJECTS.map((obj, i) => (
          <button
            key={obj.id}
            onClick={() => setSelectedIndex(i)}
            style={{
              flexShrink: 0, // Prevents buttons from squishing together on mobile
              background: selectedIndex === i ? '#ffffff' : 'transparent',
              color: selectedIndex === i ? '#000000' : '#ffffff',
              border: selectedIndex === i ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
              padding: isMobile ? '8px 12px' : '8px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: isMobile ? '10.5px' : '11.5px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => {
              if (selectedIndex !== i && !isMobile) {
                e.target.style.borderColor = '#ffffff';
                e.target.style.color = '#ffffff';
              }
            }}
            onMouseOut={(e) => {
              if (selectedIndex !== i && !isMobile) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.color = '#ffffff';
              }
            }}
          >
            {obj.name}
          </button>
        ))}
      </div>
    </div>
  );
}