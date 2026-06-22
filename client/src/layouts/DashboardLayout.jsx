import React from 'react';
import HeroBackground from '../components/HeroBackground';

const DashboardLayout = ({ children }) => {
  return (
    <div className="relative h-screen bg-dark-900 overflow-hidden flex flex-col">
      <HeroBackground />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col h-full min-h-0 overflow-hidden">{children}</div>
    </div>
  );
};

export default DashboardLayout;
