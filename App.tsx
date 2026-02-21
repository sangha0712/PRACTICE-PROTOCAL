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
  Terminal,
  Activity,
  Skull,
  ChevronRight,
  ChevronLeft,
  Siren,
  HeartPulse,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SectionHeader } from './components/SectionHeader';
import { RuleCard } from './components/RuleCard';

// --- Configuration ---

const BRIEFING_SCRIPTS: Record<string, string[]> = {
  intro: [
    "ASH GUARD 전술 시뮬레이션에 오신 것을 환영합니다.",
    "본 브리핑은 여러분이 숙지해야 할 생존 프로토콜의 핵심을 전달합니다.",
    "생존이 걸린 문제이니, 집중해서 들어주시기 바랍니다."
  ],
  squad: [
    "이번 훈련은 철저하게 2인 1조 팀 단위로 진행됩니다.",
    "팀은 생체 데이터를 관리하는 전략 담당과, 전선을 책임지는 전투 담당으로 나뉩니다.",
    "두 명 모두 전투에 참여할 수는 있습니다.",
    "하지만 명심하십시오. 전략 담당이 빈사 상태에 빠지거나 전투 불능이 되면, 그 팀은 즉시 탈락 처리됩니다.",
    "전투담당은 파트너를 보호하는 것을 최우선으로 합니다."
  ],
  env: [
    "여러분이 투입될 작전 구역은 현재 보시는 훈련장의 4배 크기로 확장됩니다.",
    "구역은 크게 세 가지 지형으로 나뉩니다.",
    "체온 유지가 생존의 관건인 한랭 지역, 기습과 시가전이 빈번하게 일어나는 도심, 그리고 시야 확보가 극히 제한되는 숲입니다.",
    "각 지형의 특성을 전략적으로 활용하는 팀만이 살아남을 수 있을 것입니다."
  ],
  rules: [
    "훈련 제한 시간은 총 1시간 30분입니다.",
    "이 시간 동안 생존하는 것 자체가 목표이며, 10분을 버틸 때마다 10포인트가 자동으로 지급됩니다.",
    "단순히 숨어있는 것만이 능사는 아닙니다.",
    "적극적인 교전을 통해 다른 팀을 탈락시킬 경우, 팀당 15점의 높은 가산점을 획득할 수 있습니다."
  ],
  support: [
    "훈련 중 발생할 수 있는 치명적인 상황에 대비해, ASH GUARD의 개입 프로토콜이 준비되어 있습니다.",
    "전투 불능 상태가 된 팀은 록쇼 요원이 즉각 현장에 투입되어 안전지대로 이송할 것입니다.",
    "또한, 교전이 지나치게 과열되어 사망이나 중상에 준하는 위험이 감지될 경우.",
    "감찰관 유아린이 직접 개입하여 전투를 강제로 중단시킬 수 있으니, 통제에 반드시 따라주십시오."
  ],
  outro: [
    "이상으로 모든 작전 브리핑을 마칩니다.",
    "시스템 준비가 완료되었습니다.",
    "각 팀은 지정된 드롭 존으로 이동하여 훈련을 시작하십시오.",
    "여러분의 무운을 빕니다."
  ]
};

// --- Helpers ---

const addWavHeader = (pcmData: Uint8Array, sampleRate: number, numChannels: number, bitDepth: number): ArrayBuffer => {
  const headerLength = 44;
  const dataLength = pcmData.length;
  const buffer = new ArrayBuffer(headerLength + dataLength);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  const pcmView = new Uint8Array(buffer, headerLength);
  pcmView.set(pcmData);

  return buffer;
};

// --- Hooks ---

const useBriefing = (sentences: string[], isStarted: boolean) => {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCache = useRef<Record<string, AudioBuffer>>({});
  const fetchPromises = useRef<Record<string, Promise<AudioBuffer>>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize GenAI only if API key is available
  // Try both VITE_ prefix (for client-side) and standard process.env (for some build environments)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

  const stopAudio = useCallback(() => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (e) {}
      sourceNodeRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Reset when slide changes
  useEffect(() => {
    stopAudio();
    setSentenceIndex(0);
  }, [sentences, stopAudio]);

  const fetchAudioBuffer = useCallback((text: string): Promise<AudioBuffer> => {
    if (audioCache.current[text]) return Promise.resolve(audioCache.current[text]);
    if (fetchPromises.current[text]) return fetchPromises.current[text];

    const promise = (async () => {
      if (!genAI) {
        throw new Error("Gemini API key not configured");
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      
      if (!base64Audio) throw new Error("No audio data generated");

      const binaryString = window.atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const wavBytes = addWavHeader(bytes, 24000, 1, 16);
      const audioBuffer = await audioContextRef.current.decodeAudioData(wavBytes);
      audioCache.current[text] = audioBuffer;
      return audioBuffer;
    })();

    fetchPromises.current[text] = promise;
    return promise;
  }, []);

  useEffect(() => {
    if (!isStarted || isMuted || sentenceIndex >= sentences.length) return;

    let isActive = true;

    const play = async () => {
      const text = sentences[sentenceIndex];
      if (!text) return;

      // Determine delay based on ending punctuation for natural Korean speech pacing
      let delay = 750; // Default delay
      if (text.endsWith('.')) {
        delay = 800; // Full stop, slightly longer pause
      } else if (text.endsWith('?')) {
        delay = 900; // Question, longer pause for emphasis
      } else if (text.endsWith('!')) {
        delay = 600; // Exclamation, shorter pause to maintain energy
      } else if (text.endsWith(',')) {
        delay = 400; // Comma, short pause
      } else if (text.endsWith('다.') || text.endsWith('니다.')) {
        delay = 850; // Formal ending, standard pause
      }

      try {
        setIsLoading(true);
        const audioBuffer = await fetchAudioBuffer(text);
        
        // Preload the next sentence in the background
        const nextText = sentences[sentenceIndex + 1];
        if (nextText && !audioCache.current[nextText]) {
          fetchAudioBuffer(nextText).catch(e => console.warn("Preload next sentence failed", e));
        }

        if (!isActive) return;

        if (audioBuffer && audioContextRef.current) {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          
          source.onended = () => {
            if (!isActive) return;
            setIsPlaying(false);
            timeoutRef.current = setTimeout(() => {
              if (isActive) setSentenceIndex(prev => prev + 1);
            }, delay);
          };

          sourceNodeRef.current = source;
          source.start(0);
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("TTS Error:", error);
        if (!isActive) return;
        // Skip to next sentence on error (Silent fallback)
        timeoutRef.current = setTimeout(() => {
          if (isActive) setSentenceIndex(prev => prev + 1);
        }, delay);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    if (sentenceIndex === 0) {
      // 0.85s delay before the first sentence on a page
      timeoutRef.current = setTimeout(() => {
        if (isActive) play();
      }, 850);
    } else {
      play();
    }

    return () => {
      isActive = false;
      stopAudio();
      window.speechSynthesis.cancel();
    };
  }, [sentenceIndex, isStarted, isMuted, sentences, fetchAudioBuffer, stopAudio]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) stopAudio();
      return next;
    });
  };

  return { isPlaying, isLoading, isMuted, toggleMute };
};

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
        <span>MISSION BRIEFING: TACTICAL SIMULATION</span>
      </div>
    </Reveal>
    <Reveal delay={200}>
      <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight tracking-tight">
        SURVIVAL <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-500 to-neon-blue bg-300% animate-pulse-slow">PROTOCOL</span>
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
      <SectionHeader title="SQUAD COMPOSITION" icon={Users} />
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
              <p className="text-xs md:text-sm text-gray-500 font-mono mt-0.5">STRATEGIC ASSET</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4 text-sm md:text-base leading-relaxed flex-grow">
            팀의 두뇌로서 생체 데이터를 관리하고 전략을 수립합니다. 전투가 가능하지만, 본연의 임무는 생존입니다.
          </p>
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs md:text-sm flex items-start gap-2">
            <HeartPulse className="w-4 h-4 shrink-0 mt-0.5" />
            <span><strong>패배 조건:</strong> 전략 담당이 빈사 또는 전투 불능 상태가 될 경우, 팀은 즉시 탈락합니다.</span>
          </div>
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
              <p className="text-xs md:text-sm text-gray-500 font-mono mt-0.5">COMBAT ASSET</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed flex-grow">
            최전선에서 화력을 담당합니다. 적을 제압하는 것만큼이나, 전략 담당 파트너를 호위하여 생존시키는 것이 최우선 목표입니다.
          </p>
        </div>
      </Reveal>
    </div>
  </div>
);

const SlideEnvironment: React.FC = () => (
  <div className="max-w-[1000px] mx-auto w-full px-4 md:px-6">
    <Reveal delay={0}>
      <SectionHeader title="OPERATIONAL AREA (x4 EXPANSION)" icon={MapIcon} />
    </Reveal>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {[
        { name: '한랭 지역 (Frozen)', desc: '체온 유지 필수, 이동 속도 저하' },
        { name: '도심 (Urban)', desc: '건물 간 근접 교전, 매복 주의' },
        { name: '숲 (Forest)', desc: '은신 유리, 시야 확보 제한' }
      ].map((area, i) => (
        <Reveal key={area.name} delay={300 * (i + 1)}>
          <div className="group relative h-[240px] rounded-2xl overflow-hidden border border-white/10 glass-panel">
            <img src={`https://picsum.photos/600/900?random=${i + 60}&grayscale`} className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110" alt={area.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-ash-900/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="text-lg font-bold font-display text-white mb-1">{area.name}</h3>
              <p className="text-sm text-gray-300">{area.desc}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
);

const SlideRules: React.FC = () => (
  <div className="max-w-[1000px] mx-auto w-full px-4 md:px-6">
    <Reveal delay={0}>
      <SectionHeader title="SCORING PROTOCOLS" icon={Crosshair} />
    </Reveal>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <Reveal delay={300}><RuleCard title="제한 시간 90분" description="1시간 30분 동안 생존하며 포인트를 획득하십시오." icon={Clock} /></Reveal>
      <Reveal delay={600}><RuleCard title="생존 포인트 (+10)" description="10분 생존 시마다 10 포인트가 자동으로 지급됩니다." icon={Shield} variant="success" /></Reveal>
      <Reveal delay={900}><RuleCard title="킬 포인트 (+15)" description="타 팀을 탈락시킬 경우 팀당 15점의 가산점을 획득합니다." icon={Skull} variant="danger" /></Reveal>
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
                <h3 className="text-lg md:text-xl font-bold text-white">록쇼 (Rockshow) - 긴급 이송</h3>
             </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
              전투 불능이 확인된 팀은 즉시 록쇼 요원에 의해 안전지대로 이송됩니다.
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
                <h3 className="text-lg md:text-xl font-bold text-white">유아린 (Yoo Arin) - 교전 통제</h3>
             </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
              전투 과열로 인한 사망 또는 영구적 부상 위험이 감지될 경우, 감찰관 유아린이 현장에 개입하여 전투를 강제 중단시킵니다.
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
  const [hasStarted, setHasStarted] = useState(false);

  const next = useCallback((e?: React.MouseEvent) => { 
    if (e) e.stopPropagation();
    if (currentSlideIndex < SLIDES.length - 1) setCurrentSlideIndex(prev => prev + 1); 
  }, [currentSlideIndex]);

  const prev = useCallback((e?: React.MouseEvent) => { 
    if (e) e.stopPropagation();
    if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1); 
  }, [currentSlideIndex]);

  const currentSlide = SLIDES[currentSlideIndex];
  const sentences = BRIEFING_SCRIPTS[currentSlide?.id] || [];
  
  const { isPlaying, isLoading, isMuted, toggleMute } = useBriefing(
    sentences,
    hasStarted
  );

  const CurrentSlideComponent = currentSlide?.component || (() => null);
  const progress = ((currentSlideIndex) / (SLIDES.length - 1)) * 100;

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-ash-900 flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 z-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] opacity-20 bg-cover bg-center"></div>
        <div className="z-10 text-center">
          <Shield className="w-20 h-20 text-neon-blue mx-auto mb-8 animate-pulse" />
          <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-widest">ASH GUARD</h1>
          <p className="text-gray-400 font-mono mb-12">TACTICAL SIMULATION BRIEFING</p>
          <button 
            onClick={() => setHasStarted(true)}
            className="group relative px-8 py-4 bg-neon-blue/10 border border-neon-blue text-neon-blue font-mono text-lg tracking-widest hover:bg-neon-blue hover:text-ash-900 transition-all duration-300"
          >
            <span className="flex items-center gap-3">
              <Play className="w-5 h-5 fill-current" />
              INITIALIZE SYSTEM
            </span>
          </button>
        </div>
      </div>
    );
  }

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
          {/* Audio Status Indicator */}
          <div className="flex items-center gap-2 mr-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-neon-blue animate-pulse">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-mono">DECRYPTING...</span>
              </div>
            )}
            {isPlaying && (
              <div className="flex items-center gap-1 h-3">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-neon-blue animate-pulse" 
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s` 
                    }}
                  />
                ))}
              </div>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

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