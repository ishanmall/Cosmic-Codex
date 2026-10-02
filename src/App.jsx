import React, { useState } from 'react';
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

  const CurrentComponent = ASTRO_OBJECTS[selectedIndex].component;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#000', overflow: 'hidden' }}>
      
      {/* Renders the currently selected astrophysical simulator */}
      <CurrentComponent />

      {/* Global Navigation HUD */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        padding: '10px 16px',
        background: 'rgba(10, 10, 10, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 100,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: 'max-content',
        maxWidth: '90vw',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}>
        {ASTRO_OBJECTS.map((obj, i) => (
          <button
            key={obj.id}
            onClick={() => setSelectedIndex(i)}
            style={{
              background: selectedIndex === i ? '#ffffff' : 'transparent',
              color: selectedIndex === i ? '#000000' : '#ffffff',
              border: selectedIndex === i ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '11.5px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => {
              if (selectedIndex !== i) {
                e.target.style.borderColor = '#ffffff';
                e.target.style.color = '#ffffff';
              }
            }}
            onMouseOut={(e) => {
              if (selectedIndex !== i) {
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