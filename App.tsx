import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Shield, 
  Users, 
  Swords, 
  Map as MapIcon, 
  Clock, 
  AlertTriangle, 
  Ambulance, 
  Crosshair, 
  Snowflake, 
  Building2, 
  Trees,
  Terminal,
  Activity,
  Skull,
  ChevronRight,
  ChevronLeft,
  MousePointer2
} from 'lucide-react';
import { SectionHeader } from './components/SectionHeader';
import { RuleCard } from './components/RuleCard';

// --- Presentation Components ---

// Wrapper to animate elements in
const Reveal: React.FC<{ visible: boolean; children: React.ReactNode; className?: string; delay?: number }> = ({ 
  visible, 
  children, 
  className = "",
  delay = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (visible && ref.current) {
      // Small timeout to ensure DOM is ready and animation starts
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      ref={ref} 
      className={`animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Slide Content Definitions
const SlideIntro: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="inline-flex items-center gap-2 px-3 py-1 border border-neon-blue/30 rounded-full bg-neon-blue/10 text-neon-blue text-xs font-mono mb-8 animate-pulse-slow">
      <Terminal className="w-3 h-3" />
      <span>MISSION BRIEFING: TACTICAL SIMULATION</span>
    </div>
    <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-6 leading-tight">
      SURVIVAL <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-500 to-neon-blue bg-300% animate-pulse-slow">PROTOCOL</span>
    </h1>
    <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mt-4">
      ASH GUARD TACTICAL SIMULATION CENTER
    </p>
    <div className="mt-12 text-sm text-gray-500 font-mono animate-bounce">
      TAP OR CLICK TO INITIALIZE
    </div>
  </div>
);

const SlideSquad: React.FC<{ step: number }> = ({ step }) => (
  <div className="max-w-6xl mx-auto w-full">
    <Reveal visible={step >= 0}>
      <SectionHeader title="SQUAD COMPOSITION" icon={Users} />
    </Reveal>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <Reveal visible={step >= 1}>
        <div className="glass-panel p-8 rounded-xl border border-white/5 relative group overflow-hidden h-full">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue"></div>
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-neon-blue/20 rounded-lg text-neon-blue">
                <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-white">전략 담당 (Command)</h3>
              <p className="text-sm text-gray-500 font-mono mt-1">PRIMARY ASSET</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4 text-lg">
            팀의 두뇌 역할을 수행하며 전술을 지휘합니다. 전투가 가능하지만 생존이 최우선입니다.
          </p>
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded text-red-400 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              <strong>CRITICAL WARNING:</strong> 전략 담당이 빈사 또는 전투 불능 상태가 될 경우 해당 팀은 즉시 <span className="underline font-bold">탈락 처리</span>됩니다.
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal visible={step >= 2}>
        <div className="glass-panel p-8 rounded-xl border border-white/5 relative group overflow-hidden h-full">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-red"></div>
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-neon-red/20 rounded-lg text-neon-red">
                <Swords className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-white">전투 담당 (Vanguard)</h3>
              <p className="text-sm text-gray-500 font-mono mt-1">OFFENSIVE ASSET</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            전방에서 위협을 제거하고 전략 담당을 보호합니다. 적극적인 교전을 통해 포인트를 획득하는 주력 전투원입니다.
          </p>
        </div>
      </Reveal>
    </div>
  </div>
);

const SlideEnvironment: React.FC<{ step: number }> = ({ step }) => (
  <div className="max-w-6xl mx-auto w-full">
    <Reveal visible={step >= 0}>
      <SectionHeader title="OPERATIONAL AREA" icon={MapIcon} />
      <div className="mb-8 text-gray-300 text-lg border-l-4 border-neon-blue pl-4 py-2 bg-white/5 rounded-r-lg">
        <p>훈련 구역이 기존 대비 <span className="text-neon-blue font-bold text-xl">4배</span> 확장되었습니다.</p>
      </div>
    </Reveal>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Reveal visible={step >= 1}>
        <div className="group relative h-80 rounded-xl overflow-hidden cursor-default tech-border border border-white/10">
          <img src="https://picsum.photos/400/600?random=1&grayscale" alt="Frozen" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-center gap-2 text-sky-400 mb-2">
              <Snowflake className="w-5 h-5" />
              <span className="font-mono text-xs tracking-widest">SECTOR A</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">한랭 지역</h3>
            <div className="h-0.5 w-10 bg-sky-500 mb-3"></div>
            <p className="text-sm text-gray-300">저체온증 위험<br/>시야 확보 어려움</p>
          </div>
        </div>
      </Reveal>

      <Reveal visible={step >= 2}>
        <div className="group relative h-80 rounded-xl overflow-hidden cursor-default tech-border border border-white/10">
          <img src="https://picsum.photos/400/600?random=2&grayscale" alt="Urban" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Building2 className="w-5 h-5" />
              <span className="font-mono text-xs tracking-widest">SECTOR B</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">도심</h3>
             <div className="h-0.5 w-10 bg-gray-500 mb-3"></div>
            <p className="text-sm text-gray-300">건물 내 매복<br/>근접 전투(CQC) 다발</p>
          </div>
        </div>
      </Reveal>

      <Reveal visible={step >= 3}>
        <div className="group relative h-80 rounded-xl overflow-hidden cursor-default tech-border border border-white/10">
          <img src="https://picsum.photos/400/600?random=3&grayscale" alt="Forest" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Trees className="w-5 h-5" />
              <span className="font-mono text-xs tracking-widest">SECTOR C</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">숲</h3>
             <div className="h-0.5 w-10 bg-emerald-500 mb-3"></div>
            <p className="text-sm text-gray-300">은폐 및 엄폐 용이<br/>기습 주의</p>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
);

const SlideRules: React.FC<{ step: number }> = ({ step }) => (
  <div className="max-w-6xl mx-auto w-full">
    <Reveal visible={step >= 0}>
      <SectionHeader title="MISSION PARAMETERS" icon={Crosshair} />
    </Reveal>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <Reveal visible={step >= 1}>
        <RuleCard 
          title="제한 시간" 
          description="총 1시간 30분의 제한 시간 내에 끝까지 살아남아야 합니다."
          icon={Clock}
        />
      </Reveal>
      <Reveal visible={step >= 2}>
        <RuleCard 
          title="생존 보너스" 
          description="생존 시간 10분당 10 포인트(RP)가 팀 점수에 누적됩니다."
          icon={Shield}
          variant="success"
        />
      </Reveal>
      <Reveal visible={step >= 3}>
        <RuleCard 
          title="처치 보너스" 
          description="타 팀을 공격하여 탈락시킬 경우, 가산점 15 포인트(RP)를 획득합니다."
          icon={Skull}
          variant="danger"
        />
      </Reveal>
    </div>
  </div>
);

const SlideSupport: React.FC<{ step: number }> = ({ step }) => (
  <div className="max-w-6xl mx-auto w-full">
    <Reveal visible={step >= 0}>
      <SectionHeader title="ASH GUARD SUPPORT" icon={Ambulance} />
    </Reveal>

    <div className="space-y-6 mt-8">
      <Reveal visible={step >= 1}>
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row group border border-white/5">
          <div className="w-full md:w-1/4 bg-gray-800 relative min-h-[150px]">
              <img src="https://picsum.photos/300/300?random=10" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity grayscale" alt="Rockshow" />
              <div className="absolute inset-0 bg-neon-blue/20 mix-blend-overlay"></div>
              <div className="absolute bottom-0 left-0 bg-neon-blue px-3 py-1 text-black font-bold font-display text-xs">MEDEVAC</div>
          </div>
          <div className="p-6 md:w-3/4 flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">록쇼 (Rockshow)</h3>
                <p className="text-xs text-neon-blue font-mono mb-2">ASH GUARD / TRANSPORT UNIT</p>
              </div>
              <Ambulance className="text-gray-600 w-8 h-8" />
            </div>
            <p className="text-gray-300">
              전투 불능이 된 팀의 이송을 담당합니다. 탈락이 확정된 인원은 즉시 안전 구역으로 후송 조치됩니다.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal visible={step >= 2}>
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row group border border-white/5">
          <div className="w-full md:w-1/4 bg-gray-800 relative min-h-[150px]">
              <img src="https://picsum.photos/300/300?random=11" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity grayscale" alt="Yoo Arin" />
              <div className="absolute inset-0 bg-neon-purple/20 mix-blend-overlay"></div>
              <div className="absolute bottom-0 left-0 bg-neon-purple px-3 py-1 text-black font-bold font-display text-xs">ARBITER</div>
          </div>
          <div className="p-6 md:w-3/4 flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">유아린 (Yoo Arin)</h3>
                <p className="text-xs text-neon-purple font-mono mb-2">ASH GUARD / SAFETY OFFICER</p>
              </div>
              <Shield className="text-gray-600 w-8 h-8" />
            </div>
            <p className="text-gray-300">
              전투가 과열되어 사망 또는 중상 위험이 감지될 경우 현장에 즉각 개입하여 전투를 강제 중단시킵니다.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
);

const SlideOutro: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-2xl mx-auto">
    <Shield className="w-20 h-20 text-neon-blue mb-8 animate-pulse" />
    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
      BRIEFING COMPLETE
    </h2>
    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
      모든 요원은 즉시 장비를 점검하고 투입 지점으로 이동하십시오.
      <br/>
      행운을 빕니다.
    </p>
    <div className="p-4 border border-white/10 bg-white/5 rounded-lg text-xs font-mono text-gray-500">
      SYSTEM STATUS: READY FOR DEPLOYMENT
    </div>
  </div>
);

// --- Data Structure ---

const SLIDES = [
  { id: 'intro', component: SlideIntro, maxSteps: 0 },
  { id: 'squad', component: SlideSquad, maxSteps: 2 },
  { id: 'env', component: SlideEnvironment, maxSteps: 3 },
  { id: 'rules', component: SlideRules, maxSteps: 3 },
  { id: 'support', component: SlideSupport, maxSteps: 2 },
  { id: 'outro', component: SlideOutro, maxSteps: 0 },
];

// --- Main App ---

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Navigation Logic
  const next = useCallback(() => {
    const currentSlide = SLIDES[currentSlideIndex];
    
    // If we can advance steps within the current slide
    if (currentStepIndex < currentSlide.maxSteps) {
      setCurrentStepIndex(prev => prev + 1);
    } 
    // If we are at the end of the slide, go to next slide
    else if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setCurrentStepIndex(0);
    }
  }, [currentSlideIndex, currentStepIndex]);

  const prev = useCallback(() => {
    // If we can go back steps within the current slide
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
    // Go to previous slide
    else if (currentSlideIndex > 0) {
      const prevSlideIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(prevSlideIndex);
      setCurrentStepIndex(SLIDES[prevSlideIndex].maxSteps);
    }
  }, [currentSlideIndex, currentStepIndex]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  const CurrentSlideComponent = SLIDES[currentSlideIndex].component;
  const progress = ((currentSlideIndex) / (SLIDES.length - 1)) * 100;

  return (
    <div 
      className="min-h-screen font-sans selection:bg-neon-blue selection:text-white flex flex-col cursor-pointer overflow-hidden relative"
      onClick={next}
    >
      
      {/* Background Grid Effect */}
      <div className="fixed inset-0 z-[-1]" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-black/20 via-black/80 to-black pointer-events-none"></div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-neon-blue" />
          <span className="text-lg font-display font-bold tracking-widest text-white">ASH GUARD <span className="text-neon-blue text-xs align-top">SYS.</span></span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          <span className="hidden md:inline-block text-neon-green">● LIVE</span>
          <span>SLIDE {currentSlideIndex + 1}/{SLIDES.length}</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 overflow-y-auto w-full">
        {/* We use a key to force re-render animation when slide changes, but steps animate within */}
        <div key={currentSlideIndex} className="w-full max-w-7xl animate-fade-in-up">
          <CurrentSlideComponent step={currentStepIndex} />
        </div>
      </main>

      {/* Bottom Control Bar */}
      <footer className="fixed bottom-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 p-4 z-50">
        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
          
          {/* Progress Bar */}
          <div className="flex-grow h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neon-blue transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 shrink-0">
             <button 
              onClick={(e) => { e.stopPropagation(); prev(); }}
              disabled={currentSlideIndex === 0 && currentStepIndex === 0}
              className="p-2 rounded-full hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>

             <div className="text-xs font-mono text-gray-400 hidden md:flex items-center gap-2 animate-pulse">
               <MousePointer2 className="w-3 h-3" />
               <span>CLICK TO CONTINUE</span>
             </div>

             <button 
              onClick={(e) => { e.stopPropagation(); next(); }}
              disabled={currentSlideIndex === SLIDES.length - 1 && currentStepIndex === SLIDES[SLIDES.length - 1].maxSteps}
              className="p-2 rounded-full hover:bg-neon-blue/20 text-neon-blue disabled:opacity-30 transition-colors"
             >
               <ChevronRight className="w-6 h-6" />
             </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;