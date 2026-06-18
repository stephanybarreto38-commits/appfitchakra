import { useState, useEffect, useRef, memo } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Home, Sparkles, List, ChevronLeft, ChevronRight,
  Play, Pause, RotateCcw, Check, User, Shield,
  Moon, Flame, LogOut, Edit2, X, Plus, Trash2
} from 'lucide-react';
import {
  ADMIN_EMAIL, getTodayStr, getYesterdayStr, daysBetween,
  Phase, PHASES, getPhase, SONGS, DayData, getDayData,
  Routine, ROUTINES, Ritual, RITUALS,
  parseSeconds, hasSide
} from './data/constants';
import { supabase } from './lib/supabase';

// ============ EXERCISE SVGs ============
const SVGS: Record<string, (c: string) => string> = {
  meditate: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="40" cy="14" r="7" fill="${c}"/><line x1="40" y1="21" x2="40" y2="44" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><path d="M40 44 Q28 50 20 58" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M40 44 Q52 50 60 58" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="58" r="4" fill="${c}"/><circle cx="60" cy="58" r="4" fill="${c}"/><path d="M40 28 Q28 36 22 50" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 28 Q52 36 58 50" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="22" cy="50" r="4" fill="${c}"/><circle cx="58" cy="50" r="4" fill="${c}"/></svg>`,
  squat: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="40" cy="10" r="7" fill="${c}"/><line x1="40" y1="17" x2="40" y2="38" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="24" x2="18" y2="32" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="24" x2="62" y2="32" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="32" r="4" fill="${c}"/><circle cx="62" cy="32" r="4" fill="${c}"/><line x1="40" y1="38" x2="23" y2="56" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="23" y1="56" x2="19" y2="70" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="38" x2="57" y2="56" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="57" y1="56" x2="61" y2="70" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="13" y="68" width="12" height="5" rx="2.5" fill="${c}"/><rect x="55" y="68" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  bridge: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="12" cy="62" r="7" fill="${c}"/><path d="M18 60 Q30 28 50 28 Q62 28 68 52" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><line x1="68" y1="52" x2="66" y2="68" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="60" y="66" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  lunge: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="38" cy="10" r="7" fill="${c}"/><line x1="38" y1="17" x2="38" y2="38" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="38" y1="26" x2="26" y2="34" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="38" y1="26" x2="50" y2="34" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="38" y1="38" x2="26" y2="55" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="26" y1="55" x2="22" y2="70" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="38" y1="38" x2="60" y2="50" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="60" y1="50" x2="64" y2="70" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="16" y="68" width="12" height="5" rx="2.5" fill="${c}"/><rect x="58" y="68" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  tree: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="40" cy="10" r="7" fill="${c}"/><line x1="40" y1="17" x2="40" y2="48" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="26" x2="27" y2="14" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="26" x2="53" y2="14" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="27" cy="14" r="4" fill="${c}"/><circle cx="53" cy="14" r="4" fill="${c}"/><line x1="40" y1="48" x2="40" y2="70" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="34" y="68" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  plank: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="12" cy="33" r="7" fill="${c}"/><line x1="18" y1="35" x2="68" y2="44" stroke="${c}" stroke-width="5" stroke-linecap="round"/><line x1="22" y1="37" x2="18" y2="52" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="18" y1="52" x2="30" y2="54" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="58" y1="43" x2="58" y2="58" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="68" y1="45" x2="68" y2="60" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="52" y="56" width="12" height="5" rx="2.5" fill="${c}"/><rect x="62" y="58" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  cobra: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="68" cy="28" r="7" fill="${c}"/><line x1="68" y1="35" x2="64" y2="44" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><path d="M64 44 Q50 40 30 52 Q16 58 10 62" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><line x1="62" y1="42" x2="58" y2="56" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="58" cy="56" r="4" fill="${c}"/></svg>`,
  twist: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="44" cy="12" r="7" fill="${c}"/><line x1="40" y1="19" x2="38" y2="42" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="28" x2="18" y2="24" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="28" x2="62" y2="34" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="24" r="4" fill="${c}"/><circle cx="62" cy="34" r="4" fill="${c}"/><path d="M38 42 Q26 50 18 58" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M38 42 Q50 50 58 56" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="18" cy="58" r="4" fill="${c}"/><circle cx="58" cy="56" r="4" fill="${c}"/></svg>`,
  floor: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="68" cy="56" r="6" fill="${c}"/><path d="M64 56 Q50 44 30 50 Q18 54 12 60" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><line x1="32" y1="50" x2="18" y2="44" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="44" r="4" fill="${c}"/></svg>`,
  hips: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="40" cy="10" r="7" fill="${c}"/><line x1="40" y1="17" x2="40" y2="42" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="43" cy="42" rx="11" ry="6" fill="${c}" opacity="0.5"/><line x1="36" y1="47" x2="32" y2="68" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="47" y1="47" x2="51" y2="68" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="26" y="66" width="12" height="5" rx="2.5" fill="${c}"/><rect x="45" y="66" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  stretch: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="40" cy="12" r="7" fill="${c}"/><line x1="40" y1="19" x2="40" y2="46" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="26" x2="22" y2="10" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="26" x2="58" y2="10" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="22" cy="10" r="4" fill="${c}"/><circle cx="58" cy="10" r="4" fill="${c}"/><line x1="40" y1="46" x2="36" y2="68" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="46" x2="44" y2="68" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="30" y="66" width="12" height="5" rx="2.5" fill="${c}"/><rect x="38" y="66" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  pushup: c => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="${c}20"/><circle cx="10" cy="30" r="7" fill="${c}"/><line x1="16" y1="32" x2="68" y2="48" stroke="${c}" stroke-width="5" stroke-linecap="round"/><line x1="24" y1="35" x2="20" y2="48" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="20" y1="48" x2="32" y2="52" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="62" y="56" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
};

function getSvgType(name: string): string {
  const n = name.toLowerCase();
  if (/medita|respiro|pranayama|escaneo|integra|4-7-8|zumbido|humm|respirac/.test(n)) return 'meditate';
  if (/sentad/.test(n)) return 'squat';
  if (/puente|glút/.test(n)) return 'bridge';
  if (/estocad/.test(n)) return 'lunge';
  if (/árbol|arbol|águila|aguila/.test(n)) return 'tree';
  if (/plank|mountain/.test(n)) return 'plank';
  if (/cobra|camello|pez|saludo/.test(n)) return 'cobra';
  if (/twist|russian|core|crunch|bicicl/.test(n)) return 'twist';
  if (/niño|mariposa|paloma|sukhasana/.test(n)) return 'floor';
  if (/circulo|círculo|ondulat|movimiento|cader/.test(n)) return 'hips';
  if (/apertura|roll|estira|trapec|hombro|cuello/.test(n)) return 'stretch';
  if (/push/.test(n)) return 'pushup';
  return 'meditate';
}

const ExerciseSVG = memo(function ExerciseSVG({ name, color, size = 80 }: { name: string; color: string; size?: number }) {
  const fn = SVGS[getSvgType(name)] || SVGS.meditate;
  return <div style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: fn(color) }} />;
});

// ============ TIMER ============
function Timer({ totalSecs, color, reps, compact = false }: { totalSecs: number; color: string; reps: string; compact?: boolean }) {
  const [rem, setRem] = useState(totalSecs);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => { setRem(totalSecs); setRunning(true); setDone(false); }, [totalSecs]);
  useEffect(() => {
    if (ref.current) clearInterval(ref.current);
    if (running && rem > 0) {
      ref.current = window.setInterval(() => {
        setRem(r => { if (r <= 1) { clearInterval(ref.current!); setDone(true); return 0; } return r - 1; });
      }, 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const m = Math.floor(rem / 60); const s = rem % 60;
  const R = compact ? 38 : 52; const C = 2 * Math.PI * R;
  const sz = compact ? 96 : 144;
  const offset = C * (rem / totalSecs);
  const reset = () => { if (ref.current) clearInterval(ref.current); setRem(totalSecs); setDone(false); setRunning(true); };

  return (
    <div className="flex flex-col items-center gap-3">
      {hasSide(reps) && <div className="bg-white/10 rounded-full px-3 py-1 text-[10px] text-[#C7BCDA] font-semibold tracking-widest">POR CADA LADO</div>}
      <div className="relative" style={{ width: sz, height: sz }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={sz/2} cy={sz/2} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={compact ? 6 : 8} />
          <circle cx={sz/2} cy={sz/2} r={R} fill="none" stroke={done ? '#5A9E6F' : color} strokeWidth={compact ? 6 : 8}
            strokeDasharray={C.toFixed(2)} strokeDashoffset={done ? C.toFixed(2) : offset.toFixed(2)}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.85s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {done ? <Check size={compact ? 24 : 32} className="text-[#5A9E6F]" />
            : <span className={`font-['Space_Grotesk'] font-bold text-[#F3EFE6] ${compact ? 'text-xl' : 'text-3xl'}`}>{m}:{String(s).padStart(2,'0')}</span>}
        </div>
      </div>
      {done ? <p className="text-[#5A9E6F] text-xs font-bold">¡Completado!</p>
        : <div className="flex gap-2">
            <button onClick={() => setRunning(r => !r)} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs text-[#C7BCDA] font-semibold transition-all cursor-pointer">
              {running ? <><Pause size={12}/> Pausar</> : <><Play size={12}/> Reanudar</>}
            </button>
            <button onClick={reset} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-2.5 py-1.5 text-[#8B7FA8] transition-all cursor-pointer"><RotateCcw size={13}/></button>
          </div>}
    </div>
  );
}

// ============ DESKTOP SIDEBAR ============
type Tab = 'home' | 'oracle' | 'routines' | 'rituals' | 'admin';

function Sidebar({ active, onNav, isAdmin, name, streak, day, onLogout, onEditName }: {
  active: Tab; onNav: (t: Tab) => void; isAdmin: boolean;
  name: string; streak: number; day: number; onLogout: () => void; onEditName: () => void;
}) {
  const phase = getPhase(day);
  const pct = Math.round((day - 1) / 30 * 100);
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Inicio', icon: <Home size={18} strokeWidth={1.8}/> },
    { id: 'oracle', label: 'Oráculo', icon: <Sparkles size={18} strokeWidth={1.8}/> },
    { id: 'routines', label: 'Rutinas', icon: <List size={18} strokeWidth={1.8}/> },
    { id: 'rituals', label: 'Rituales', icon: <Moon size={18} strokeWidth={1.8}/> },
  ];
  return (
    <aside className="w-64 h-full flex flex-col border-r border-white/[0.07] bg-[#0E0919] shrink-0">
      <div className="px-5 pt-7 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: phase.cl, border: `1px solid ${phase.cb}` }}>{phase.el}</div>
          <div>
            <span className="font-['Fraunces'] text-[#F3EFE6] text-lg font-semibold tracking-tight leading-none">ChakraFit</span>
            <p className="text-[#6E6480] text-[11px] mt-0.5">Viaje de 30 días</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/[0.05]">
        <div className="bg-white/[0.04] rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-[#F3EFE6] text-sm font-semibold">{name}</p>
              <p className="text-[#6E6480] text-[11px] mt-0.5">Día {day} de 30</p>
            </div>
            <button onClick={onEditName} className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer">
              <Edit2 size={12} className="text-[#8B7FA8]"/>
            </button>
          </div>
          <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden mb-2.5">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, #C44B4B, ${phase.c})` }}/>
          </div>
          <div className="flex items-center gap-1.5">
            {streak > 0 ? <Flame size={13} className="text-orange-400"/> : <div className="w-3 h-3 rounded-full border border-white/20"/>}
            <span className="font-['Space_Grotesk'] text-xs font-bold text-[#F3EFE6]">{streak}</span>
            <span className="text-[#6E6480] text-[11px]">días seguidos</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        {navItems.map(({ id, label, icon }) => (
          <button key={id} onClick={() => onNav(id)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${active === id ? 'bg-white/[0.08] text-[#F3EFE6]' : 'text-[#8B7FA8] hover:text-[#C7BCDA] hover:bg-white/[0.04]'}`}
          >
            <span style={{ color: active === id ? phase.c : undefined }}>{icon}</span>
            {label}
            {active === id && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: phase.c }}/>}
          </button>
        ))}
        {isAdmin && (
          <button onClick={() => onNav('admin')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer mt-1 ${active === 'admin' ? 'bg-[rgba(224,173,102,0.1)] text-[#E0AD66]' : 'text-[#8B7FA8] hover:text-[#C7BCDA] hover:bg-white/[0.04]'}`}
          >
            <div className="relative"><User size={18} strokeWidth={1.8} style={{ color: active === 'admin' ? '#E0AD66' : undefined }}/><Shield size={8} className="absolute -top-0.5 -right-1 text-[#E0AD66]"/></div>
            Admin
          </button>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="rounded-xl p-3 mb-3" style={{ background: phase.cl, border: `1px solid ${phase.cb}` }}>
          <p className="text-[10px] font-semibold tracking-widest mb-1" style={{ color: phase.c }}>{phase.name.toUpperCase()}</p>
          <p className="text-[#F3EFE6] text-xs leading-snug italic font-['Fraunces']">"{phase.int}"</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 w-full px-2 py-2 rounded-xl text-[#6E6480] hover:text-[#8B7FA8] text-xs transition-all cursor-pointer hover:bg-white/[0.03]">
          <LogOut size={13}/> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

// ============ MOBILE BOTTOM NAV ============
function BottomNav({ active, onNav, isAdmin }: {
  active: Tab; onNav: (t: Tab) => void; isAdmin: boolean;
}) {
  const phase = getPhase(1);
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Inicio', icon: <Home size={20} strokeWidth={1.7}/> },
    { id: 'oracle', label: 'Oráculo', icon: <Sparkles size={20} strokeWidth={1.7}/> },
    { id: 'routines', label: 'Rutinas', icon: <List size={20} strokeWidth={1.7}/> },
    { id: 'rituals', label: 'Rituales', icon: <Moon size={20} strokeWidth={1.7}/> },
  ];
  if (isAdmin) tabs.push({ id: 'admin', label: 'Admin', icon: <div className="relative"><User size={20} strokeWidth={1.7}/><Shield size={8} className="absolute -top-0.5 -right-1 text-[#E0AD66]"/></div> });
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-[#0E0919]/95 border-t border-white/[0.07] backdrop-blur-md flex items-center z-30 lg:hidden">
      {tabs.map(({ id, label, icon }) => (
        <button key={id} onClick={() => onNav(id)}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 cursor-pointer"
        >
          <span style={{ color: active === id ? '#E0AD66' : '#8B7FA8' }}>{icon}</span>
          <span className={`text-[10px] font-medium ${active === id ? 'text-[#E0AD66]' : 'text-[#8B7FA8]'}`}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ============ AUTH SCREENS ============
function EmailLogin() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    const e = email.trim().toLowerCase();
    if (!e.includes('@')) { setError('Ingresa un correo válido.'); return; }
    setError('');
    setLoading(true);

    try {
      // Edge function generates the OTP token directly — no email required
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email: e }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'not_allowed') {
          setError('Este correo no tiene acceso. Solicítalo a la administradora.');
        } else {
          setError('Error al acceder. Inténtalo de nuevo.');
        }
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setLoading(false);
        return;
      }

      // Use token_hash (hashed_token) for magic link verification — more reliable than email_otp
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        token_hash: data.token_hash,
        type: 'magiclink',
      });

      if (verifyErr) {
        setError('Error de verificación. Inténtalo de nuevo.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 60% 20%, #2D1F4570 0%, #0D0A18 70%)' }}>
      <div className="w-full max-w-sm px-8 py-12">
        <div className="text-center mb-10">
          <div className="text-6xl mb-6 inline-block">🌸</div>
          <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl font-semibold mb-3">Bienvenida a ChakraFit</h1>
          <p className="text-[#8B7FA8] text-sm leading-relaxed">Comunidad privada.<br/>Ingresa tu correo para continuar.</p>
        </div>

        <div className={`mb-4 ${shake ? 'animate-bounce' : ''}`}>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') doLogin(); }}
            disabled={loading}
            className="w-full bg-white/[0.07] border border-white/20 hover:border-white/30 focus:border-[#E0AD66] rounded-2xl text-[#F3EFE6] text-base py-4 px-5 text-center outline-none transition-all disabled:opacity-60"
          />
        </div>

        {error && (
          <div className="bg-[rgba(196,75,75,0.1)] border border-[rgba(196,75,75,0.2)] rounded-xl mb-4 py-2.5 px-4 text-center">
            <p className="text-[#E07070] text-sm">🔒 {error}</p>
          </div>
        )}

        <button
          onClick={doLogin}
          disabled={loading || !email.includes('@')}
          className="w-full bg-[#E0AD66] hover:bg-[#d49e55] text-[#2A2235] font-bold text-base py-4 rounded-2xl mb-6 transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Accediendo...
            </span>
          ) : 'Ingresar →'}
        </button>

        <p className="text-[#4A3F5C] text-xs text-center">¿Sin acceso? Solicítalo a la administradora del programa.</p>
      </div>
    </div>
  );
}


function Setup({ onSave }: { onSave: (name: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0A18]" style={{ background: 'radial-gradient(ellipse at 50% 30%, #2D1F4570 0%, #0D0A18 70%)' }}>
      <div className="w-full max-w-sm px-8 py-12 text-center animate-pop">
        <div className="text-6xl mb-6">🌱</div>
        <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl font-semibold mb-3">¡Acceso confirmado!</h1>
        <p className="text-[#8B7FA8] text-sm mb-10 leading-relaxed">Tu viaje de 30 días comienza hoy.<br/>¿Cómo te llamas?</p>
        <input placeholder="Tu nombre..." value={value} onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onSave(value.trim()); }}
          className="w-full bg-white/[0.07] border border-white/20 focus:border-[#E0AD66] rounded-2xl text-[#F3EFE6] text-base py-4 px-5 text-center outline-none transition-all mb-4"
        />
        <button onClick={() => value.trim() && onSave(value.trim())} className="w-full bg-[#E0AD66] text-[#2A2235] font-bold text-base py-4 rounded-2xl transition-all" style={{ opacity: value.trim() ? 1 : 0.4 }}>
          Comenzar mi viaje ✨
        </button>
      </div>
    </div>
  );
}

// ============ HOME SCREEN ============
function HomeScreen({ name, day, streak, lastComplete, today, onGoRoutine, onGoOracle, onGoRituals, onEditName }: {
  name: string; day: number; streak: number; lastComplete: string; today: string;
  onGoRoutine: (id: string) => void; onGoOracle: () => void; onGoRituals: () => void; onEditName: () => void;
}) {
  const phase = getPhase(day);
  const data = getDayData(day);
  const routine = ROUTINES[phase.id];
  const done = lastComplete === today;
  const pct = Math.round((day - 1) / 30 * 100);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20 lg:pb-0 px-5 lg:px-8 py-6 lg:py-8 animate-fade-in">
      {/* Mobile header */}
      <div className="flex justify-between items-start mb-6 lg:mb-8">
        <div>
          <p className="text-[#8B7FA8] text-sm mb-0.5">Buenos días, <span className="text-[#C7BCDA]">{name}</span>
            <button onClick={onEditName} className="ml-2 text-[#6E6480] hover:text-[#8B7FA8] transition-all cursor-pointer"><Edit2 size={12} className="inline"/></button>
          </p>
          <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl lg:text-4xl font-semibold leading-tight">Tu energía hoy</h1>
        </div>
        {/* Mobile streak badge */}
        <div className="lg:hidden text-center">
          <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center"
            style={{ background: streak > 0 ? 'radial-gradient(circle at 40% 35%, #FF6B35, #D9320A)' : 'rgba(255,255,255,0.07)', border: streak > 0 ? '2px solid rgba(255,107,53,0.4)' : '2px solid rgba(255,255,255,0.1)' }}>
            {streak > 0 ? <Flame size={14} className="text-orange-200 animate-pulse"/> : <span className="text-[#6E6480] text-base">○</span>}
            <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#FFF8F0] leading-none">{streak}</span>
          </div>
        </div>
      </div>

      {/* Desktop: 3-col grid. Mobile: stacked */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-5 mb-5 lg:mb-6 flex flex-col gap-4">
        {/* Quote card */}
        <div className="lg:col-span-2 bg-[#FBF7F0] rounded-2xl lg:rounded-3xl p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[2px] mb-2" style={{ color: phase.c }}>{phase.name.toUpperCase()} · DÍA {day}</p>
            <p className="font-['Fraunces'] text-[#2A2235] text-lg lg:text-xl italic font-semibold leading-snug mb-4">"{data.msg}"</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => onGoRoutine(phase.id)} className="flex-1 py-2.5 rounded-xl lg:rounded-2xl bg-[#2A2235] text-[#FBF7F0] font-semibold text-sm hover:bg-[#1E1530] transition-all cursor-pointer">Ver rutina →</button>
            <button onClick={onGoOracle} className="flex-1 py-2.5 rounded-xl lg:rounded-2xl bg-transparent text-[#2A2235] font-semibold text-sm border-2 border-[#D0C8B8] hover:bg-black/5 transition-all cursor-pointer">Oráculo</button>
          </div>
        </div>
        {/* Stats: side by side on mobile, stacked on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-3 lg:p-4 text-center flex flex-col items-center justify-center">
            <div className="text-2xl lg:text-3xl mb-1.5 animate-elem-float">{phase.el}</div>
            <div className="font-['Space_Grotesk'] text-xl lg:text-2xl font-bold text-[#F3EFE6]">Día {day}</div>
            <div className="text-xs text-[#6E6480] mt-0.5">de 30</div>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-3 lg:p-4 text-center flex flex-col items-center justify-center">
            <div className="text-xl lg:text-2xl mb-1">🎵</div>
            <div className="text-[10px] font-semibold text-[#C7BCDA] leading-snug">{SONGS[phase.id]}</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl lg:rounded-2xl p-3.5 lg:p-4 mb-4 lg:mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#8B7FA8] text-[11px] font-semibold tracking-wider">PROGRESO</span>
          <span className="font-['Space_Grotesk'] text-xs font-bold" style={{ color: phase.c }}>{pct}%</span>
        </div>
        <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#C44B4B 0%,#E07A3A 20%,#D9AE3F 40%,#5A9E6F 57%,#4A90C4 70%,#7B68C8 83%,#A87DC8 100%)' }}/>
        </div>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mb-5 lg:mb-6">
        <div className="bg-white/[0.04] border border-white/[0.07] hover:border-white/15 rounded-xl lg:rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all group" onClick={() => onGoRoutine(phase.id)}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl animate-elem-float" style={{ background: phase.cl, border: `1.5px solid ${phase.cb}` }}>{phase.el}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold tracking-wider mb-0.5" style={{ color: phase.c }}>{phase.en.toUpperCase()}</div>
            <div className="text-[#F3EFE6] text-sm font-semibold truncate">{routine.title}</div>
            <div className="text-xs mt-0.5" style={{ color: phase.c }}>{routine.dur} · {routine.steps.length} ejercicios</div>
          </div>
          {done ? <span className="text-[#5A9E6F] text-xs font-semibold shrink-0 bg-[rgba(90,158,111,0.15)] px-2 py-1 rounded-full">✓</span>
            : <ChevronRight size={15} className="text-[#4A3F5C] group-hover:text-[#C7BCDA] transition-all shrink-0"/>}
        </div>
        <div className="bg-white/[0.04] border border-white/[0.07] hover:border-white/15 rounded-xl lg:rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all group" onClick={onGoRituals}>
          <div className="w-12 h-12 rounded-xl bg-[rgba(168,166,201,0.15)] border border-[rgba(168,166,201,0.3)] flex items-center justify-center shrink-0 text-2xl">🌕</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold tracking-wider text-[#A8A6C9] mb-0.5">LUNA LLENA</div>
            <div className="text-[#F3EFE6] text-sm font-semibold">Ritual de Liberación</div>
            <div className="text-[#A8A6C9] text-xs mt-0.5">20 min · Disponible</div>
          </div>
          <ChevronRight size={15} className="text-[#4A3F5C] group-hover:text-[#C7BCDA] transition-all shrink-0"/>
        </div>
      </div>

      {/* Micro-rituals */}
      <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-3">MICRO-RITUALES DE HOY</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {([{ key: 'm', label: 'Mañana', color: phase.c }, { key: 'md', label: 'Mediodía', color: '#DD8A3E' }, { key: 'n', label: 'Noche', color: '#9D74BE' }] as const).map(({ key, label, color }) => {
          const item = data[key as keyof DayData] as { d: string; txt: string };
          return (
            <div key={key} className="bg-[#FBF7F0] rounded-xl lg:rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold tracking-widest" style={{ color }}>{label.toUpperCase()}</span>
                <span className="text-[#6E6480] text-[11px]">{item.d}</span>
              </div>
              <p className="text-[#2A2235] text-xs leading-relaxed">{item.txt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ ORACLE SCREEN ============
function OracleScreen({ day }: { day: number }) {
  const [selectedPhase, setSelectedPhase] = useState(getPhase(day));
  const [selectedDay, setSelectedDay] = useState(day);
  const pct = Math.round((day - 1) / 30 * 100);

  const handlePhaseSelect = (ph: Phase) => {
    setSelectedPhase(ph);
    setSelectedDay(ph.days[0]);
  };

  const data = getDayData(selectedDay);

  return (
    <div className="h-full animate-fade-in lg:flex lg:overflow-hidden">
      {/* Main content */}
      <div className="h-full overflow-y-auto lg:flex-1 custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-1.5">ORÁCULO · 30 DÍAS</p>
        <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl lg:text-4xl font-semibold mb-4 leading-tight">Activación de los 7 chakras</h1>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#C44B4B,#D9AE3F,#A87DC8)' }}/>
          </div>
          <span className="font-['Space_Grotesk'] text-sm font-bold shrink-0" style={{ color: getPhase(day).c }}>Día {day}/30</span>
        </div>

        <div className="rounded-2xl p-4 lg:p-5 mb-5" style={{ background: selectedPhase.cl, border: `1px solid ${selectedPhase.cb}` }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl animate-breathe" style={{ background: selectedPhase.cl, border: `2px solid ${selectedPhase.cb}` }}>{selectedPhase.el}</div>
            <div>
              <span className="inline-block text-xs font-semibold py-1 px-3 rounded-full mb-1" style={{ background: selectedPhase.cl, color: selectedPhase.c, border: `1px solid ${selectedPhase.cb}` }}>{selectedPhase.name.toUpperCase()}</span>
              <p className="text-[#8B7FA8] text-xs">Días {selectedPhase.days[0]}–{selectedPhase.days[selectedPhase.days.length-1]} · {selectedPhase.theme}</p>
            </div>
          </div>
          <p className="font-['Fraunces'] text-[#F3EFE6] text-base italic leading-relaxed mb-3">"{data.msg}"</p>
          <p className="text-[#C7BCDA] text-sm leading-relaxed">{selectedPhase.om}</p>
        </div>

        {/* Day selector tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {selectedPhase.days.map(d => (
            <button key={d} onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedDay === d ? 'text-[#0E0919]' : 'bg-white/[0.05] text-[#8B7FA8] hover:bg-white/10 hover:text-[#C7BCDA]'}`}
              style={selectedDay === d ? { background: selectedPhase.c } : {}}>
              Día {d}
            </button>
          ))}
        </div>

        <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-3">MICRO-RITUALES · DÍA {selectedDay}</h2>
        <div className="flex flex-col gap-3">
          {([{ key: 'm', label: 'MAÑANA', color: selectedPhase.c }, { key: 'md', label: 'MEDIODÍA', color: '#DD8A3E' }, { key: 'n', label: 'NOCHE', color: '#9D74BE' }] as const).map(({ key, label, color }) => {
            const item = data[key as keyof DayData] as { d: string; txt: string };
            return (
              <div key={key} className="bg-[#FBF7F0] rounded-xl lg:rounded-2xl p-4">
                <div className="flex justify-between mb-2"><span className="text-[10px] font-semibold tracking-wider" style={{ color }}>{label}</span><span className="text-[#6E6480] text-xs">{item.d}</span></div>
                <p className="text-[#2A2235] text-sm leading-relaxed">{item.txt}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile phases list */}
        <div className="lg:hidden mt-6">
          <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-4">FASES DEL VIAJE</h2>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/[0.06]"/>
            {PHASES.map(ph => {
              const past = ph.days[ph.days.length-1] < day;
              const sel = ph.id === selectedPhase.id;
              return (
                <div key={ph.id} className="flex gap-3 pb-4 relative z-10 cursor-pointer" onClick={() => handlePhaseSelect(ph)}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: sel ? ph.c : ph.c+'25', border: `2px solid ${sel ? ph.c : ph.c+'60'}`, boxShadow: sel ? `0 0 14px ${ph.c}60` : 'none', fontSize: past&&!sel ? 12 : 20 }}>
                    {past&&!sel ? <Check size={11}/> : ph.el}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-[10px] font-semibold mb-0.5 tracking-wider" style={{ color: sel ? ph.c : '#8B7FA8' }}>DÍAS {ph.days[0]}–{ph.days[ph.days.length-1]}</p>
                    <p className="text-xs" style={{ color: sel ? '#F3EFE6' : '#C7BCDA', fontWeight: sel ? 600 : 400 }}>{ph.name} · {ph.theme}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop phases sidebar */}
      <div className="hidden lg:block w-72 border-l border-white/[0.07] overflow-y-auto custom-scrollbar px-5 py-8 shrink-0">
        <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-4">FASES DEL VIAJE</p>
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/[0.06]"/>
          {PHASES.map(ph => {
            const past = ph.days[ph.days.length-1] < day;
            const sel = ph.id === selectedPhase.id;
            return (
              <div key={ph.id} className="flex gap-3 pb-5 relative z-10 cursor-pointer" onClick={() => handlePhaseSelect(ph)}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: sel ? ph.c : ph.c+'25', border: `2px solid ${sel ? ph.c : ph.c+'60'}`, boxShadow: sel ? `0 0 14px ${ph.c}60` : 'none', fontSize: past&&!sel ? 12 : 20 }}>
                  {past&&!sel ? <Check size={11}/> : ph.el}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-[10px] font-semibold mb-0.5 tracking-wider" style={{ color: sel ? ph.c : '#8B7FA8' }}>DÍAS {ph.days[0]}–{ph.days[ph.days.length-1]}</p>
                  <p className="text-xs" style={{ color: sel ? '#F3EFE6' : '#C7BCDA', fontWeight: sel ? 600 : 400 }}>{ph.name} · {ph.theme}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ ROUTINES SCREEN ============
function RoutinesScreen({ day, onSelect }: { day: number; onSelect: (id: string) => void }) {
  const todayPhase = getPhase(day);
  const pct = Math.round((day - 1) / 30 * 100);
  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-20 lg:pb-8 animate-fade-in">
      <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-1.5">CAMINO DE 30 DÍAS</p>
      <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl lg:text-4xl font-semibold mb-5 leading-tight">7 Rutinas, 7 Chakras</h1>
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl lg:rounded-2xl p-4 mb-5 lg:mb-6">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[#8B7FA8] text-[11px] font-semibold tracking-wider">PROGRESO TOTAL</span>
          <span className="font-['Space_Grotesk'] text-sm font-bold" style={{ color: todayPhase.c }}>Día {day} de 30</span>
        </div>
        <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#C44B4B 0%,#E07A3A 20%,#D9AE3F 40%,#5A9E6F 57%,#4A90C4 70%,#7B68C8 83%,#A87DC8 100%)' }}/>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {PHASES.map(ph => {
          const past = ph.days[ph.days.length-1] < day;
          const active = ph.id === todayPhase.id;
          const future = ph.days[0] > day;
          const r = ROUTINES[ph.id];
          return (
            <div key={ph.id} className="flex items-center gap-4 p-4 rounded-xl lg:rounded-2xl cursor-pointer transition-all group"
              style={{ background: active ? ph.cl : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? ph.cb : 'rgba(255,255,255,0.06)'}` }}
              onClick={() => onSelect(ph.id)}
            >
              <div className="w-11 lg:w-12 h-11 lg:h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
                style={{ background: active ? ph.c : past ? ph.c+'25' : 'rgba(255,255,255,0.04)', border: `2px solid ${active||past ? ph.c : 'rgba(255,255,255,0.1)'}` }}>
                {past ? <Check size={14} className="text-[#C44B4B]"/> : ph.el}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold tracking-wider" style={{ color: future ? 'rgba(255,255,255,0.15)' : active ? ph.c : '#8B7FA8' }}>DÍAS {ph.days[0]}–{ph.days[ph.days.length-1]}</span>
                  <span className="text-xs font-semibold" style={{ color: past ? '#5A9E6F' : active ? ph.c : 'rgba(255,255,255,0.15)' }}>{past ? '✓ Completado' : r.dur}</span>
                </div>
                <p className="text-sm font-semibold truncate" style={{ color: future ? 'rgba(255,255,255,0.18)' : active ? '#F3EFE6' : past ? '#C7BCDA' : '#5A4F6A' }}>{r.title}</p>
                {active && <p className="text-[#C7BCDA] text-xs italic mt-1 truncate">"{ph.int}"</p>}
              </div>
              <ChevronRight size={15} className={`shrink-0 transition-all ${active ? 'text-[#C7BCDA]' : 'text-[#3A3050] group-hover:text-[#8B7FA8]'}`}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ ROUTINE SUMMARY ============
function RoutineSummaryScreen({ phaseId, day, back, openEx }: {
  phaseId: string; day: number; back: () => void; openEx: (i: number) => void;
}) {
  const phase = PHASES.find(p => p.id === phaseId) || getPhase(day);
  const routine = ROUTINES[phase.id];
  return (
    <div className="h-full animate-fade-in lg:flex lg:overflow-hidden">
      <div className="h-full overflow-y-auto lg:flex-1 custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        <button onClick={back} className="flex items-center gap-2 text-[#8B7FA8] hover:text-[#C7BCDA] text-sm mb-5 transition-all cursor-pointer">
          <ChevronLeft size={15}/> Todas las rutinas
        </button>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{phase.el}</span>
          <div>
            <span className="inline-block text-xs font-semibold py-1 px-3 rounded-full" style={{ background: phase.cl, color: phase.c, border: `1px solid ${phase.cb}` }}>{phase.name.toUpperCase()}</span>
            <p className="text-[#8B7FA8] text-xs mt-1">{routine.dur} · {routine.steps.length} ejercicios</p>
          </div>
        </div>
        <h1 className="font-['Fraunces'] text-[#F3EFE6] text-2xl lg:text-3xl font-semibold mb-4 leading-tight">{routine.title}</h1>
        <div className="rounded-xl lg:rounded-2xl p-4 mb-5" style={{ background: phase.cl, border: `1px solid ${phase.cb}` }}>
          <p className="text-[10px] font-semibold tracking-widest mb-2" style={{ color: phase.c }}>INTENCIÓN</p>
          <p className="font-['Fraunces'] text-[#F3EFE6] text-sm italic leading-relaxed">"{phase.int}"</p>
        </div>
        <button onClick={() => openEx(0)} className="w-full bg-[#E0AD66] hover:bg-[#d49e55] text-[#2A2235] font-bold text-base py-3.5 rounded-xl lg:rounded-2xl mb-5 transition-all cursor-pointer">Comenzar rutina →</button>
        {/* Mobile exercise list */}
        <div className="lg:hidden flex flex-col gap-2.5">
          <p className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-1">EJERCICIOS</p>
          {routine.steps.map((step, i) => (
            <div key={i} className="bg-[#FBF7F0] rounded-xl p-3 flex items-center gap-3 cursor-pointer" onClick={() => openEx(i)}>
              <div className="w-11 h-11 shrink-0 rounded-lg overflow-hidden"><ExerciseSVG name={step.name} color={phase.c} size={44}/></div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2A2235] text-xs font-semibold mb-0.5 truncate">{step.name}</p>
                <p className="text-[10px]" style={{ color: phase.c }}>{step.reps}</p>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: phase.cl, border: `1.5px solid ${phase.cb}` }}>
                <span className="text-[10px] font-bold" style={{ color: phase.c }}>{i+1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Desktop exercise list sidebar */}
      <div className="hidden lg:block w-80 border-l border-white/[0.07] overflow-y-auto custom-scrollbar px-5 py-8 shrink-0">
        <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-4">EJERCICIOS</p>
        <div className="flex flex-col gap-2.5">
          {routine.steps.map((step, i) => (
            <div key={i} className="bg-[#FBF7F0] rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all" onClick={() => openEx(i)}>
              <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden"><ExerciseSVG name={step.name} color={phase.c} size={48}/></div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2A2235] text-xs font-semibold mb-0.5 truncate">{step.name}</p>
                <p className="text-[10px]" style={{ color: phase.c }}>{step.reps}</p>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: phase.cl, border: `1.5px solid ${phase.cb}` }}>
                <span className="text-[10px] font-bold" style={{ color: phase.c }}>{i+1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ EXERCISE DETAIL ============
function ExerciseDetailScreen({ phaseId, day, startIdx, back, onComplete, done, streak }: {
  phaseId: string; day: number; startIdx: number; back: () => void;
  onComplete: () => void; done: boolean; streak: number;
}) {
  const phase = PHASES.find(p => p.id === phaseId) || getPhase(day);
  const routine = ROUTINES[phase.id];
  const steps = routine.steps;
  const [idx, setIdx] = useState(startIdx);
  const step = steps[idx];
  const isLast = idx === steps.length - 1;
  const isFirst = idx === 0;
  const secs = parseSeconds(step.reps);

  return (
    <div className="h-full flex overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 0%, ${phase.cl} 0%, transparent 50%)` }}>
      {/* Main */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-28 lg:pb-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={back} className="flex items-center gap-2 text-[#8B7FA8] hover:text-[#C7BCDA] text-sm transition-all cursor-pointer"><ChevronLeft size={15}/> Volver</button>
          <span className="font-['Space_Grotesk'] text-[#8B7FA8] text-sm font-semibold">{idx+1} / {steps.length}</span>
        </div>
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full cursor-pointer transition-all" style={{ background: i===idx ? phase.c : i<idx ? phase.c+'50' : 'rgba(255,255,255,0.1)' }} onClick={() => setIdx(i)}/>
          ))}
        </div>

        {/* SVG — bigger on desktop */}
        <div className="w-36 h-36 lg:w-48 lg:h-48 mx-auto mb-5 rounded-2xl lg:rounded-3xl overflow-hidden">
          <ExerciseSVG name={step.name} color={phase.c} size={192}/>
        </div>

        {/* Mobile timer inline */}
        <div className="lg:hidden mb-5 flex justify-center">
          {secs > 0 ? <Timer key={idx} totalSecs={secs} color={phase.c} reps={step.reps} compact/>
            : <div className="bg-white/[0.06] border border-white/10 rounded-2xl py-3 px-5 text-center">
                <span className="font-['Space_Grotesk'] text-xl font-bold text-[#F3EFE6]">{step.reps}</span>
              </div>}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block text-xs font-semibold py-1 px-3 rounded-full" style={{ background: phase.cl, color: phase.c, border: `1px solid ${phase.cb}` }}>{phase.el} {phase.en}</span>
          <span className="text-[#8B7FA8] text-xs">{step.sub}</span>
        </div>
        <h2 className="font-['Fraunces'] text-[#F3EFE6] text-2xl lg:text-3xl font-semibold mb-4 leading-tight">{step.name}</h2>
        <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-xl py-2.5 px-3.5 mb-4 w-fit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ stroke: phase.c }}><circle cx="12" cy="12" r="9" strokeWidth="1.8"/><path d="M12 7v5l3 3" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <span className="text-sm font-semibold" style={{ color: phase.c }}>{step.reps}</span>
        </div>
        <p className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-2">CÓMO HACERLO</p>
        <p className="text-[#D4CEDF] text-sm leading-relaxed mb-5">{step.desc}</p>

        {isLast && (
          done
            ? <div className="bg-[rgba(90,158,111,0.12)] border border-[rgba(90,158,111,0.25)] rounded-2xl py-4 px-5 text-center">
                <p className="text-[#5A9E6F] font-bold mb-1">✓ ¡Rutina registrada!</p>
                <p className="text-[#8B7FA8] text-sm">Racha activa: 🔥 {streak} días</p>
              </div>
            : <button onClick={onComplete} className="w-full py-4 rounded-2xl bg-gradient-to-br from-[#E0AD66] to-[#C47A1A] text-[#2A2235] font-bold text-base cursor-pointer hover:opacity-90 transition-all">
                ✅ Registrar rutina completada
              </button>
        )}

        {/* Mobile nav buttons */}
        <div className="lg:hidden flex gap-3 mt-5">
          <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={isFirst}
            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm transition-all cursor-pointer disabled:cursor-default"
            style={{ background: isFirst ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.07)', border: `1px solid rgba(255,255,255,${isFirst?'0.04':'0.12'})`, color: isFirst ? '#2A2540' : '#C7BCDA' }}>
            <ChevronLeft size={14}/> Ant.
          </button>
          {!isLast
            ? <button onClick={() => setIdx(i => i+1)} className="flex-[2] py-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-all" style={{ background: phase.c, color: '#1E1530' }}>
                Siguiente <ChevronRight size={14}/>
              </button>
            : <button onClick={back} className="flex-[2] py-3 rounded-xl bg-white/[0.06] border border-white/10 text-[#C7BCDA] font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all">Volver al resumen</button>
          }
        </div>
      </div>

      {/* Desktop right panel */}
      <div className="hidden lg:flex w-72 border-l border-white/[0.07] flex-col shrink-0">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {secs > 0 ? <Timer key={idx} totalSecs={secs} color={phase.c} reps={step.reps}/>
            : <div className="text-center">
                <div className="w-28 h-28 rounded-full border-4 border-white/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#F3EFE6]">{step.reps.split(' ')[0]}</span>
                </div>
                <p className="text-[#8B7FA8] text-sm">{step.reps}</p>
              </div>}
        </div>
        <div className="p-5 border-t border-white/[0.07] flex gap-3">
          <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={isFirst}
            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm transition-all cursor-pointer disabled:cursor-default"
            style={{ background: isFirst ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.07)', border: `1px solid rgba(255,255,255,${isFirst?'0.04':'0.12'})`, color: isFirst ? '#2A2540' : '#C7BCDA' }}>
            <ChevronLeft size={14}/> Ant.
          </button>
          {!isLast
            ? <button onClick={() => setIdx(i => i+1)} className="flex-[2] py-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-all" style={{ background: phase.c, color: '#1E1530' }}>
                Siguiente <ChevronRight size={14}/>
              </button>
            : <button onClick={back} className="flex-[2] py-3 rounded-xl bg-white/[0.06] border border-white/10 text-[#C7BCDA] font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all">Volver al resumen</button>
          }
        </div>
      </div>
    </div>
  );
}

// ============ RITUALS SCREEN ============
function RitualsScreen({ completedRituals, onSelect }: { completedRituals: Set<string>; onSelect: (r: Ritual) => void }) {
  const getBadge = (r: Ritual) => {
    if (completedRituals.has(r.id)) return { text: '✓ Completado', color: '#5C9C7C', bg: 'rgba(90,158,111,0.12)' };
    if (r.status === 'available') return { text: '✨ Disponible hoy', color: r.c, bg: r.c+'18' };
    return { text: `En ${r.daysUntil} días`, color: '#6E6480', bg: 'rgba(255,255,255,0.06)' };
  };
  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-20 lg:pb-8 animate-fade-in">
      <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-1.5">LUNA Y SOL</p>
      <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl lg:text-4xl font-semibold mb-2 leading-tight">Rituales del Ciclo</h1>
      <p className="text-[#8B7FA8] text-sm mb-6 lg:mb-8 leading-relaxed">Prácticas alineadas con los ciclos lunares y estacionales.</p>
      <div className="flex flex-col gap-3 lg:gap-4">
        {RITUALS.map(r => {
          const badge = getBadge(r);
          return (
            <div key={r.id} className="bg-[#FBF7F0] rounded-xl lg:rounded-2xl p-4 lg:p-5 cursor-pointer hover:opacity-95 transition-all group" onClick={() => onSelect(r)}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl lg:rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: r.bg, border: `1px solid ${r.c}40` }}>🌕</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1.5">
                    <div><p className="text-[#2A2235] text-sm font-semibold">{r.name}</p><p className="text-[#6E6480] text-xs">{r.sub}</p></div>
                    <span className="text-[#6E6480] text-xs shrink-0 ml-4">{r.dur}</span>
                  </div>
                  <span className="inline-block text-xs font-semibold py-1 px-3 rounded-full" style={{ background: badge.bg, color: badge.color }}>{badge.text}</span>
                </div>
                <ChevronRight size={16} className="text-[#C7BCDA] shrink-0 group-hover:translate-x-0.5 transition-transform"/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ RITUAL DETAIL ============
function RitualDetailScreen({ ritual, completedSteps, back, toggle, complete }: {
  ritual: Ritual; completedSteps: Set<number>; back: () => void; toggle: (i: number) => void; complete: () => void;
}) {
  const done = completedSteps.size; const allDone = done === ritual.steps.length;
  const getIntention = () => {
    if (ritual.id === 'luna-nueva') return 'Hoy planto la semilla de lo que quiero cultivar.';
    if (ritual.id === 'luna-llena') return 'Hoy suelto lo que ya cumplió su propósito en mí.';
    return 'Hoy honro el equilibrio entre la luz y la sombra.';
  };
  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-20 lg:pb-8 animate-fade-in">
      <button onClick={back} className="flex items-center gap-2 text-[#8B7FA8] hover:text-[#C7BCDA] text-sm mb-5 transition-all cursor-pointer"><ChevronLeft size={15}/> Rituales</button>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-xl lg:rounded-2xl flex items-center justify-center text-3xl" style={{ background: ritual.bg, border: `1px solid ${ritual.c}40` }}>🌕</div>
        <div><h1 className="font-['Fraunces'] text-[#F3EFE6] text-2xl lg:text-3xl font-semibold leading-tight">{ritual.name}</h1><p className="text-[#8B7FA8] text-sm mt-1">{ritual.sub} · {ritual.dur}</p></div>
      </div>
      <div className="rounded-xl lg:rounded-2xl p-4 mb-5" style={{ background: ritual.bg, border: `1px solid ${ritual.c}30` }}>
        <p className="font-['Fraunces'] text-[#F3EFE6] text-sm italic leading-relaxed">"{getIntention()}"</p>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${(done/ritual.steps.length)*100}%`, background: ritual.c }}/></div>
        <span className="text-[#8B7FA8] text-xs shrink-0">{done}/{ritual.steps.length}</span>
      </div>
      <div className="flex flex-col gap-3 mb-5">
        {ritual.steps.map((s, i) => {
          const ch = completedSteps.has(i);
          return (
            <div key={i} className="bg-white/[0.05] border border-white/[0.08] hover:border-white/15 rounded-xl lg:rounded-2xl p-4 flex items-start gap-3.5 cursor-pointer transition-all" style={{ opacity: ch ? 0.55 : 1 }} onClick={() => toggle(i)}>
              <div className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center transition-all" style={{ border: `2px solid ${ch ? ritual.c : 'rgba(255,255,255,0.18)'}`, background: ch ? ritual.c : 'transparent' }}>
                {ch && <Check size={11} className="text-white"/>}
              </div>
              <div>
                <p className="text-[#F3EFE6] text-sm font-medium mb-1" style={{ textDecoration: ch ? 'line-through' : 'none' }}>{s.n}</p>
                <p className="text-[#8B7FA8] text-xs leading-relaxed">{s.i}</p>
              </div>
            </div>
          );
        })}
      </div>
      {allDone && <button onClick={complete} className="w-full bg-[#E0AD66] hover:bg-[#d49e55] text-[#2A2235] font-bold text-base py-4 rounded-xl lg:rounded-2xl transition-all cursor-pointer">Completar ritual ✨</button>}
    </div>
  );
}

// ============ ADMIN PANEL ============
interface AllowedEmail { email: string; invited_at: string; }

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [invited, setInvited] = useState<AllowedEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const loadInvited = async () => {
    const { data } = await supabase
      .from('allowed_emails')
      .select('email, invited_at')
      .eq('revoked', false)
      .order('invited_at', { ascending: false });
    if (data) setInvited(data);
    setLoadingData(false);
  };

  useEffect(() => { loadInvited(); }, []);

  const add = async () => {
    const e = newEmail.trim().toLowerCase();
    if (!e.includes('@')) { setError('Correo inválido.'); return; }
    if (e === ADMIN_EMAIL) { setError('Ese es tu correo de admin.'); return; }
    const { error: insertErr } = await supabase
      .from('allowed_emails')
      .upsert({ email: e, invited_by: ADMIN_EMAIL }, { onConflict: 'email' });
    if (insertErr) { setError('Error al agregar el correo.'); return; }

    // Send invitation email with a direct login link
    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email: e, redirectTo: window.location.origin }),
      }
    );

    await loadInvited();
    setNewEmail(''); setError('');
    setSuccess('✓ Acceso habilitado · correo de invitación enviado a ' + e);
    setTimeout(() => setSuccess(''), 4000);
  };

  const revoke = async (email: string) => {
    await supabase.from('allowed_emails').update({ revoked: true }).eq('email', email);
    setInvited(prev => prev.filter(i => i.email !== email));
    setConfirmDelete(null);
    setSuccess('Acceso revocado.'); setTimeout(() => setSuccess(''), 2500);
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return iso; }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-20 lg:pb-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-7">
        <div className="w-11 h-11 rounded-xl bg-[rgba(224,173,102,0.12)] border-2 border-[rgba(224,173,102,0.3)] flex items-center justify-center text-2xl">👑</div>
        <div>
          <p className="text-[#E0AD66] text-xs font-semibold tracking-widest mb-0.5">PANEL DE ADMINISTRACIÓN</p>
          <h1 className="font-['Fraunces'] text-[#F3EFE6] text-2xl font-semibold">Control de Accesos</h1>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[rgba(224,173,102,0.07)] border border-[rgba(224,173,102,0.18)] rounded-xl lg:rounded-2xl p-4 mb-6">
        <p className="text-[#E0AD66] text-[11px] font-semibold tracking-widest mb-2">✨ CÓMO FUNCIONA</p>
        <p className="text-[#C7BCDA] text-sm leading-relaxed">Agrega el correo de cada persona → Supabase le envía un <strong className="text-[#F3EFE6]">código OTP</strong> por correo cuando intente ingresar. El acceso funciona en <strong className="text-[#F3EFE6]">cualquier dispositivo</strong>.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-7">
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl lg:rounded-2xl p-4 text-center">
          <div className="font-['Space_Grotesk'] text-[#E0AD66] text-3xl font-bold">{invited.length}</div>
          <div className="text-[#8B7FA8] text-xs mt-1">invitadas activas</div>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl lg:rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">🔑</div>
          <div className="text-[#8B7FA8] text-xs">acceso por OTP</div>
        </div>
        <div className="hidden lg:block bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 text-center">
          <div className="font-['Space_Grotesk'] text-[#A87DC8] text-3xl font-bold">{invited.length + 1}</div>
          <div className="text-[#8B7FA8] text-xs mt-1">accesos totales</div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 flex flex-col gap-5">
        {/* Left col */}
        <div>
          <h2 className="text-[#C7BCDA] text-[11px] font-semibold tracking-widest mb-3">AGREGAR ACCESO</h2>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl lg:rounded-2xl p-4 mb-5">
            <div className="flex gap-2 mb-3">
              <input type="email" placeholder="correo@ejemplo.com" value={newEmail}
                onChange={e => { setNewEmail(e.target.value); setError(''); setSuccess(''); }}
                onKeyDown={e => { if (e.key === 'Enter') add(); }}
                className="flex-1 bg-white/[0.07] border border-white/15 focus:border-[#E0AD66] rounded-xl text-[#F3EFE6] text-sm py-2.5 px-3.5 outline-none transition-all"
              />
              <button onClick={add} className="bg-[#E0AD66] hover:bg-[#d49e55] rounded-xl text-[#2A2235] font-bold px-4 cursor-pointer transition-all flex items-center">
                <Plus size={16}/>
              </button>
            </div>
            {error && <p className="text-[#E07070] text-xs">{error}</p>}
            {success && <p className="text-[#5A9E6F] text-xs font-semibold">{success}</p>}
          </div>

          <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-3">ADMINISTRADORA</h2>
          <div className="bg-white/[0.04] border border-[rgba(224,173,102,0.2)] rounded-xl lg:rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[rgba(224,173,102,0.12)] border-2 border-[rgba(224,173,102,0.3)] flex items-center justify-center text-lg shrink-0">👑</div>
            <div className="flex-1 min-w-0">
              <p className="text-[#E0AD66] text-sm font-semibold truncate">{ADMIN_EMAIL}</p>
              <p className="text-[#6E6480] text-xs">Acceso directo · OTP</p>
            </div>
          </div>
        </div>

        {/* Right col — invited list */}
        <div>
          <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-3">ACCESOS ACTIVOS ({invited.length})</h2>
          {loadingData
            ? <div className="text-[#4A3F5C] text-sm text-center py-8">Cargando...</div>
            : invited.length === 0
              ? <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl lg:rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-3">🌱</div>
                  <p className="text-[#4A3F5C] text-sm">Aún no has invitado a nadie.<br/>Agrega un correo arriba.</p>
                </div>
              : <div className="flex flex-col gap-3">
                  {invited.map(({ email: e, invited_at }) => (
                    <div key={e} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[rgba(90,158,111,0.12)] border-2 border-[rgba(90,158,111,0.25)] flex items-center justify-center text-xs text-[#5A9E6F] font-bold shrink-0">✓</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#C7BCDA] text-sm font-medium truncate">{e}</p>
                          <p className="text-[#6E6480] text-[11px] mt-0.5">Invitada el {formatDate(invited_at)}</p>
                        </div>
                        {confirmDelete === e
                          ? <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => revoke(e)} className="bg-[rgba(196,75,75,0.15)] border border-[rgba(196,75,75,0.3)] rounded-lg text-[#E07070] text-[11px] py-1 px-2.5 font-semibold cursor-pointer">Revocar</button>
                              <button onClick={() => setConfirmDelete(null)} className="bg-transparent border border-white/10 rounded-lg text-[#6E6480] text-[11px] py-1 px-2 cursor-pointer"><X size={12}/></button>
                            </div>
                          : <button onClick={() => setConfirmDelete(e)} className="text-[#6E6480] hover:text-[#E07070] cursor-pointer transition-all shrink-0 p-1"><Trash2 size={14}/></button>
                        }
                      </div>
                    </div>
                  ))}
                </div>
          }
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/[0.06]">
        <button onClick={onLogout} className="flex items-center gap-2 text-[#6E6480] hover:text-[#8B7FA8] text-sm transition-all cursor-pointer">
          <LogOut size={14}/> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

// ============ EDIT NAME MODAL ============
function EditNameModal({ currentName, onSave, onCancel }: { currentName: string; onSave: (n: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState(currentName);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#1E1530] border border-white/15 rounded-2xl lg:rounded-3xl p-7 w-full max-w-sm animate-pop" onClick={e => e.stopPropagation()}>
        <h2 className="font-['Fraunces'] text-[#F3EFE6] text-2xl font-semibold mb-5">¿Cómo te llamas?</h2>
        <input value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onSave(value.trim()); }}
          className="w-full bg-white/[0.07] border border-white/20 focus:border-[#E0AD66] rounded-xl text-[#F3EFE6] text-base py-3.5 px-4 outline-none transition-all mb-4" autoFocus/>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-[#8B7FA8] text-sm font-semibold cursor-pointer hover:bg-white/10 transition-all">Cancelar</button>
          <button onClick={() => value.trim() && onSave(value.trim())} className="flex-[2] py-3 rounded-xl bg-[#E0AD66] text-[#2A2235] font-bold text-sm cursor-pointer hover:bg-[#d49e55] transition-all">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
type View = 'home' | 'oracle' | 'routines' | 'routine-summary' | 'exercise' | 'rituals' | 'ritual-detail' | 'admin';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const [name, setName] = useState('');
  const [day, setDay] = useState(1);
  const [streak, setStreak] = useState(0);
  const [lastComplete, setLastComplete] = useState('');
  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  const [editing, setEditing] = useState(false);
  const [view, setView] = useState<View>('home');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [ritual, setRitual] = useState<Ritual | null>(null);
  const [completedRituals, setCompletedRituals] = useState<Set<string>>(new Set());
  const [ritualSteps, setRitualSteps] = useState<Record<string, Set<number>>>({});

  const loadUserData = async (sess: Session) => {
    const uid = sess.user.id;
    const userEmail = sess.user.email!;

    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', uid)
      .maybeSingle();

    if (profile?.name) setName(profile.name);
    else setName('');

    const { data: prog } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();

    if (prog) {
      let currentDay = prog.day as number;
      const lastOpen = prog.last_open as string | null;
      if (lastOpen && lastOpen !== today) {
        currentDay = Math.min(30, currentDay + daysBetween(lastOpen, today));
      }
      await supabase.from('progress').update({
        day: currentDay,
        last_open: today,
        updated_at: new Date().toISOString(),
      }).eq('user_id', uid);

      setDay(currentDay);
      const lc = (prog.last_complete as string) || '';
      setStreak((lc === today || lc === yesterday) ? (prog.streak as number) : 0);
      setLastComplete(lc);
    } else {
      // Ensure profile row exists so progress FK resolves
      await supabase.from('profiles').upsert({ id: uid, email: userEmail }, { onConflict: 'id' });
      await supabase.from('progress').insert({ user_id: uid, day: 1, streak: 0, last_open: today });
      setDay(1); setStreak(0); setLastComplete('');
    }

    const { data: rituals } = await supabase
      .from('completed_rituals')
      .select('ritual_id')
      .eq('user_id', uid);
    if (rituals) setCompletedRituals(new Set(rituals.map(r => r.ritual_id as string)));

    const { data: steps } = await supabase
      .from('ritual_step_progress')
      .select('ritual_id, step_index')
      .eq('user_id', uid);
    if (steps) {
      const map: Record<string, Set<number>> = {};
      steps.forEach(({ ritual_id, step_index }) => {
        if (!map[ritual_id]) map[ritual_id] = new Set();
        map[ritual_id].add(step_index as number);
      });
      setRitualSteps(map);
    }
  };

  useEffect(() => {
    // INITIAL_SESSION fires once on startup (handles magic-link redirects from URL)
    // SIGNED_IN fires for new logins (OTP code verification)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      (async () => {
        if (event === 'INITIAL_SESSION') {
          setSession(s);
          if (s) await loadUserData(s);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && s) {
          setSession(s);
          await loadUserData(s);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setName(''); setDay(1); setStreak(0); setLastComplete('');
          setCompletedRituals(new Set()); setRitualSteps({});
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0D0A18]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-breathe">🌸</div>
          <p className="text-[#8B7FA8] text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) return <EmailLogin />;

  const isAdmin = session.user.email === ADMIN_EMAIL;

  const saveName = async (n: string) => {
    setName(n);
    const uid = session.user.id;
    await supabase.from('profiles').upsert(
      { id: uid, email: session.user.email!, name: n },
      { onConflict: 'id' }
    );
  };

  if (!name) return <Setup onSave={saveName} />;

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const registerWorkout = async () => {
    const t = getTodayStr();
    if (lastComplete === t) return;
    const newStreak = lastComplete === yesterday ? streak + 1 : 1;
    setStreak(newStreak);
    setLastComplete(t);
    await supabase.from('progress').update({
      streak: newStreak,
      last_complete: t,
      updated_at: new Date().toISOString(),
    }).eq('user_id', session.user.id);
  };

  const toggleRitualStep = async (ritualId: string, stepIdx: number) => {
    const uid = session.user.id;
    const current = ritualSteps[ritualId] || new Set<number>();
    if (current.has(stepIdx)) {
      setRitualSteps(m => { const s = new Set(m[ritualId] || []); s.delete(stepIdx); return { ...m, [ritualId]: s }; });
      await supabase.from('ritual_step_progress')
        .delete()
        .eq('user_id', uid)
        .eq('ritual_id', ritualId)
        .eq('step_index', stepIdx);
    } else {
      setRitualSteps(m => { const s = new Set(m[ritualId] || []); s.add(stepIdx); return { ...m, [ritualId]: s }; });
      await supabase.from('ritual_step_progress')
        .insert({ user_id: uid, ritual_id: ritualId, step_index: stepIdx });
    }
  };

  const completeRitual = async (ritualId: string) => {
    setCompletedRituals(s => new Set([...s, ritualId]));
    await supabase.from('completed_rituals')
      .upsert({ user_id: session.user.id, ritual_id: ritualId }, { onConflict: 'user_id,ritual_id' });
    setView('rituals');
  };

  const goRoutine = (id: string) => { setSelectedPhase(id); setView('routine-summary'); };
  const openExercise = (idx: number) => { setExerciseIdx(idx); setView('exercise'); };
  const routineDone = lastComplete === today;

  const sidebarTab: Tab = ({ home:'home', oracle:'oracle', routines:'routines', 'routine-summary':'routines', exercise:'routines', rituals:'rituals', 'ritual-detail':'rituals', admin:'admin' } as Record<View,Tab>)[view];

  const navTo = (t: Tab) => {
    if (t === 'home') setView('home');
    else if (t === 'oracle') setView('oracle');
    else if (t === 'routines') setView('routines');
    else if (t === 'rituals') setView('rituals');
    else if (t === 'admin') setView('admin');
  };

  return (
    <div className="h-screen flex bg-[#0D0A18] overflow-hidden">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:h-full lg:shrink-0 border-r border-white/[0.07]">
        <Sidebar active={sidebarTab} onNav={navTo} isAdmin={isAdmin} name={name} streak={streak} day={day} onLogout={logout} onEditName={() => setEditing(true)}/>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden min-w-0">
        {view === 'home' && <HomeScreen name={name} day={day} streak={streak} lastComplete={lastComplete} today={today} onGoRoutine={goRoutine} onGoOracle={() => setView('oracle')} onGoRituals={() => setView('rituals')} onEditName={() => setEditing(true)}/>}
        {view === 'oracle' && <OracleScreen day={day}/>}
        {view === 'routines' && <RoutinesScreen day={day} onSelect={goRoutine}/>}
        {view === 'routine-summary' && <RoutineSummaryScreen phaseId={selectedPhase} day={day} back={() => setView('routines')} openEx={openExercise}/>}
        {view === 'exercise' && <ExerciseDetailScreen phaseId={selectedPhase} day={day} startIdx={exerciseIdx} back={() => setView('routine-summary')} onComplete={registerWorkout} done={routineDone} streak={streak}/>}
        {view === 'rituals' && <RitualsScreen completedRituals={completedRituals} onSelect={r => { setRitual(r); setView('ritual-detail'); }}/>}
        {view === 'ritual-detail' && ritual && (
          <RitualDetailScreen
            ritual={ritual}
            completedSteps={ritualSteps[ritual.id] || new Set()}
            back={() => setView('rituals')}
            toggle={i => toggleRitualStep(ritual.id, i)}
            complete={() => completeRitual(ritual.id)}
          />
        )}
        {view === 'admin' && <AdminPanel onLogout={logout}/>}
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav active={sidebarTab} onNav={navTo} isAdmin={isAdmin}/>

      {editing && (
        <EditNameModal
          currentName={name}
          onSave={async n => { await saveName(n); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}
