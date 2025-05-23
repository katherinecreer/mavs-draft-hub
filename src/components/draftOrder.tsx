import React from 'react';
import draftOrderData from '../data/draft_order_2025.json';
import { teamLogoMap } from '../services/teamLogoMap';

const draftOrder: React.FC = () => (
  <section className="draft-order-panel">
    <h2>2025 Draft Order</h2>
    <div className="draft-order-list">
      {draftOrderData.map((pick) => {
        const TeamLogo = teamLogoMap[pick.team as keyof typeof teamLogoMap];

        return (
          <div 
            key={pick.pick} 
            style={{
              borderBottom: '1px solid #ddd',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: '#fff',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = '#f5f5f5';
              const details = target.querySelector('.details') as HTMLElement;
              if (details) {
                details.style.maxHeight = `${details.scrollHeight}px`;
                details.style.marginTop = '0.75rem';
                details.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = '#fff';
              const details = target.querySelector('.details') as HTMLElement;
              if (details) {
                details.style.maxHeight = '0';
                details.style.marginTop = '0';
                details.style.opacity = '0';
              }
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span className="pick-number" style={{ fontWeight: 'bold', marginRight: '1rem' }}>#{pick.pick}</span>
              <span className="team-name" style={{ flex: 1, marginRight: '1rem' }}>{pick.team}</span>
              {TeamLogo && <TeamLogo size={26} />}
            </div>
            
            <div className="details" style={{
              maxHeight: '0',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              opacity: '0',
              marginTop: '0',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                <strong>GM:</strong> {pick.gm}
              </p>
              <a 
                href={pick.contact}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0066cc',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                Front Office Information
              </a>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default draftOrder; 