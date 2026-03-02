import React, { useState, useCallback } from 'react';
import { 
  Shield, 
  Users, 
  Swords, 
  Map as MapIcon, 
  Clock, 
  AlertTriangle, 
  Ambulance, 
  Crosshair, 
  Terminal,
  Activity,
  Skull,
  ChevronRight,
  ChevronLeft,
  Siren,
  HeartPulse
} from 'lucide-react';
import { SectionHeader } from './components/SectionHeader';
import { RuleCard } from './components/RuleCard';

// --- Presentation Components ---

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = "",
  delay = 0
}) => (
  <div 
    className={`opacity-0 animate-fade-in-up ${className}`}
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
);

const SlideIntro: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
    <Reveal delay={0}>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-neon-blue/30 rounded-full bg-neon-blue/10 text-neon-blue text-xs md:text-sm font-mono mb-4 animate-pulse-slow">
        <Terminal className="w-3 h-3" />
        <span>MISSION BRIEFING: ALL-GRADE TOURNAMENT</span>
      </div>
    </Reveal>
    <Reveal delay={200}>
      <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight tracking-tight">
        COMBAT <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-500 to-neon-blue bg-300% animate-pulse-slow">TOURNAMENT</span>
      </h1>
    </Reveal>
    <Reveal delay={400}>
      <p className="text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed mt-2 font-light">
        ASH GUARD TACTICAL SIMULATION CENTER
      </p>
    </Reveal>
  </div>
);

const SlideSquad: React.FC = () => (
  <div className="max-w-[1000px] mx-auto w-full px-4 md:px-6">
    <Reveal delay={0}>
      <SectionHeader title="SQUAD COMPOSITION (2-MAN CELL)" icon={Users} />
    </Reveal>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
      <Reveal delay={300}>
        <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/5 relative group overflow-hidden h-full flex flex-col">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-neon-blue"></div>
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2.5 bg-neon-blue/20 rounded-xl text-neon-blue">
                <Activity className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold font-display text-white">전략 담당 (Command)</h3>
              <p className="text-xs md:text-sm text-gray-500 font-mono mt-0.5">NON-COMBATANT</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4 text-sm md:text-base leading-relaxed flex-grow">
            직접 전투에 참여하지 않습니다. <strong>인이어(In-ear)</strong>를 통해 전장 상황을 분석하고 전투 담당에게 실시간 브리핑을 제공합니다.
          </p>
        </div>
      </Reveal>
      <Reveal delay={600}>
        <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/5 relative group overflow-hidden h-full flex flex-col">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-neon-red"></div>
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2.5 bg-neon-red/20 rounded-xl text-neon-red">
                <Swords className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold font-display text-white">전투 담당 (Vanguard)</h3>
              <p className="text-xs md:text-sm text-gray-500 font-mono mt-0.5">SOLE COMBATANT</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed flex-grow">
            팀의 <strong>유일한 전투원</strong>입니다. 전략 담당의 오더를 수행하며 적을 제압하고 승리를 쟁취하십시오.
          </p>
        </div>
      </Reveal>
    </div>
  </div>
);

const SlideEnvironment: React.FC = () => (
  <div className="max-w-[1000px] mx-auto w-full px-4 md:px-6">
    <Reveal delay={0}>
      <SectionHeader title="OPERATIONAL AREA (x3 EXPANSION)" icon={MapIcon} />
    </Reveal>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {[
        { name: '한랭 지역 (Frozen)', desc: '체온 유지 필수, 이동 속도 저하', image: 'https://igx.kr/r/2M/26/33' },
        { name: '도심 (Urban)', desc: '건물 간 근접 교전, 매복 주의', image: 'https://igx.kr/r/2M/26/30' },
        { name: '숲 (Forest)', desc: '은신 유리, 시야 확보 제한', image: 'https://igx.kr/r/2M/26/31' }
      ].map((area, i) => (
        <Reveal key={area.name} delay={300 * (i + 1)}>
          <div className="group relative h-[240px] rounded-2xl overflow-hidden border border-white/10 glass-panel">
            <img src={area.image} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110" alt={area.name} referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-ash-900/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="text-lg font-bold font-display text-white mb-1">{area.name}</h3>
              <p className="text-sm text-gray-300">{area.desc}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={1200}>
      <div className="mt-4 p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-xl text-center">
        <p className="text-neon-blue text-sm font-mono">
          <Terminal className="w-4 h-4 inline-block mr-2 mb-0.5" />
          강당이 <strong>3배</strong>로 확장되며, 위 3가지 지형 중 <strong>하나가 무작위로 선정</strong>됩니다.
        </p>
      </div>
    </Reveal>
  </div>
);

const SlideRules: React.FC = () => (
  <div className="max-w-[1000px] mx-auto w-full px-4 md:px-6">
    <Reveal delay={0}>
      <SectionHeader title="TOURNAMENT RULES" icon={Crosshair} />
    </Reveal>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <Reveal delay={300}><RuleCard title="제한 시간 40분" description="경기 시간은 40분으로 제한됩니다. 신속하게 결착을 지으십시오." icon={Clock} /></Reveal>
      <Reveal delay={600}><RuleCard title="승리 조건" description="상대 팀의 전투 담당을 제압하여 전투 불능 상태로 만드십시오." icon={Swords} variant="success" /></Reveal>
      <Reveal delay={900}><RuleCard title="무승부 시 탈락" description="40분 내에 승부가 나지 않을 경우, 양 팀 모두 즉시 탈락합니다." icon={Skull} variant="danger" /></Reveal>
    </div>
  </div>
);

const SlideSupport: React.FC = () => (
  <div className="max-w-[1000px] mx-auto w-full px-4 md:px-6">
    <Reveal delay={0}>
      <SectionHeader title="ASH GUARD INTERVENTION" icon={Ambulance} />
    </Reveal>
    <div className="space-y-4 mt-6">
      <Reveal delay={300}>
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/5 relative group">
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-neon-green opacity-50"></div>
          <div className="p-4 md:p-6 w-full">
             <div className="flex items-center gap-3 mb-2">
                <Siren className="w-5 h-5 text-neon-green" />
                <h3 className="text-lg md:text-xl font-bold text-white">전투 불능자 이송</h3>
             </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
              전투 불능이 확인된 인원은 즉시 <strong>ASH GUARD</strong>에 의해 안전지대로 이송됩니다.
            </p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={600}>
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/5 relative group">
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-neon-purple opacity-50"></div>
          <div className="p-4 md:p-6 w-full">
            <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-neon-purple" />
                <h3 className="text-lg md:text-xl font-bold text-white">위험 상황 제지</h3>
             </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
              경기 중 사망이나 중상에 준하는 위험이 감지될 경우, <strong>ASH GUARD</strong>가 개입하여 상황을 제지합니다.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
);

const SlideOutro: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] text-center max-w-4xl mx-auto px-4">
    <Reveal delay={0}><Shield className="w-12 h-12 text-neon-blue mb-6 animate-pulse" /></Reveal>
    <Reveal delay={300}><h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-widest">BRIEFING COMPLETE</h2></Reveal>
    <Reveal delay={600}><p className="text-gray-400 text-base md:text-lg mb-8 font-mono">ALL SYSTEMS READY. PROCEED TO DROP ZONE.</p></Reveal>
  </div>
);

const SLIDES = [
  { id: 'intro', component: SlideIntro },
  { id: 'squad', component: SlideSquad },
  { id: 'env', component: SlideEnvironment },
  { id: 'rules', component: SlideRules },
  { id: 'support', component: SlideSupport },
  { id: 'outro', component: SlideOutro },
];

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const next = useCallback((e?: React.MouseEvent) => { 
    if (e) e.stopPropagation();
    if (currentSlideIndex < SLIDES.length - 1) setCurrentSlideIndex(prev => prev + 1); 
  }, [currentSlideIndex]);

  const prev = useCallback((e?: React.MouseEvent) => { 
    if (e) e.stopPropagation();
    if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1); 
  }, [currentSlideIndex]);

  const currentSlide = SLIDES[currentSlideIndex];
  const CurrentSlideComponent = currentSlide?.component || (() => null);
  const progress = ((currentSlideIndex) / (SLIDES.length - 1)) * 100;

  return (
    <div className="min-h-screen font-sans flex flex-col cursor-pointer overflow-hidden relative bg-ash-900" onClick={() => next()}>
      <div className="fixed inset-0 z-[-1]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-transparent via-ash-900/50 to-black/80"></div>
      
      <nav className="fixed top-0 w-full z-50 p-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-neon-blue drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold tracking-widest text-white leading-none">ASH GUARD</span>
            <span className="text-[9px] font-mono text-neon-blue/80 tracking-widest mt-0.5">TACTICAL BRIEFING V.3.3</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500 bg-black/40 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
            <span className="text-white/80">SECTOR {currentSlideIndex + 1} / {SLIDES.length}</span>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 overflow-y-auto w-full custom-scrollbar">
        <div key={currentSlideIndex} className="w-full max-w-[1000px] py-8">
          <CurrentSlideComponent />
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-black/90 backdrop-blur-2xl border-t border-white/10 p-4 z-50">
        <div className="container mx-auto max-w-[1200px] flex items-center justify-between gap-6">
          <div className="flex-grow group">
            <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-1.5 uppercase tracking-widest">
              <span>Mission Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-neon-blue transition-all duration-700 ease-out relative" style={{ width: `${progress}%`, boxShadow: '0 0 10px #0ea5e9' }}>
                <div className="absolute top-0 right-0 w-3 h-full bg-white/40 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
             <button onClick={(e) => prev(e)} disabled={currentSlideIndex === 0} className="p-3 rounded-xl text-white hover:bg-white/5 disabled:opacity-20 transition-all"><ChevronLeft className="w-6 h-6" /></button>
             <button onClick={(e) => next(e)} disabled={currentSlideIndex === SLIDES.length - 1} className="p-3 rounded-xl text-neon-blue hover:bg-neon-blue/5 disabled:opacity-20 transition-all"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;