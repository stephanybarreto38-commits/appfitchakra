import { useState, useEffect, useRef, memo } from 'react';
import {
  Home, Sparkles, List, ChevronLeft, ChevronRight,
  Play, Pause, RotateCcw, Check, User, Shield,
  Moon, Flame, LogOut, Edit2, X, Plus, Trash2, Globe
} from 'lucide-react';
import {
  ADMIN_EMAIL, getTodayStr, getYesterdayStr, daysBetween,
  Phase, PHASES, getPhase, SONGS, DayData, getDayData,
  Routine, ROUTINES, Ritual, RITUALS,
  parseSeconds, hasSide
} from './data/constants';

// ============ LOCAL STORAGE ============
function lsGet<T>(key: string, def: T): T {
  try {
    const v = localStorage.getItem('cf_' + key);
    return v !== null ? JSON.parse(v) : def;
  } catch { return def; }
}
function lsSet<T>(key: string, val: T): void {
  try { localStorage.setItem('cf_' + key, JSON.stringify(val)); } catch {}
}

// ============ LANGUAGE ============
type Lang = 'es' | 'en';

const TR: Record<Lang, Record<string, string>> = {
  es: {
    // Nav
    home: 'Inicio', oracle: 'Oráculo', routines: 'Rutinas', rituals: 'Rituales', admin: 'Admin',
    // Home
    good_morning: 'Buenos días', your_energy: 'Tu energía hoy', streak_days: 'días seguidos',
    see_routine: 'Ver rutina →', oracle_btn: 'Oráculo', day_label: 'Día', of_30: 'de 30',
    done_badge: '✓ Hecho', exercises: 'ejercicios', full_moon_label: 'LUNA LLENA',
    liberation_title: 'Ritual de Liberación', liberation_dur: '20 min · Disponible',
    progress_label: 'PROGRESO', micro_label: 'MICRO-RITUALES DE HOY',
    morning: 'Mañana', midday: 'Mediodía', night: 'Noche',
    // Oracle
    oracle_sub: 'ORÁCULO · 30 DÍAS', oracle_title: 'Activación de los 7 chakras',
    day_of_30: 'de 30', phases_label: 'FASES DEL VIAJE', days_label: 'DÍAS',
    micro_day: 'MICRO-RITUALES · DÍA',
    // Routines
    path_label: 'CAMINO DE 30 DÍAS', seven_chakras: '7 Rutinas, 7 Chakras',
    total_progress: 'PROGRESO TOTAL', completed_label: '✓ Completado',
    // Routine Summary
    all_routines: 'Todas las rutinas', intention_label: 'INTENCIÓN',
    begin_routine: 'Comenzar rutina →', exercises_label: 'EJERCICIOS',
    // Exercise Detail
    back_btn: 'Volver', how_to: 'CÓMO HACERLO',
    registered_title: '✓ ¡Rutina registrada!', active_streak: 'Racha activa: 🔥',
    streak_days2: 'días', register_btn: '✅ Registrar rutina completada',
    back_summary: 'Volver al resumen', prev_btn: 'Ant.', next_btn: 'Siguiente',
    // Timer
    each_side: 'POR CADA LADO', completed_time: '¡Completado!',
    pause_btn: 'Pausar', resume_btn: 'Reanudar',
    // Audio
    sound_of: 'Sonido del', playing: '▶ sonando', silence: 'silencio',
    binaural_hint: 'Beat binaural · onda theta 6 Hz · usa audífonos para mayor efecto',
    // Rituals
    rituals_sub: 'LUNA Y SOL', rituals_title: 'Rituales del Ciclo',
    rituals_desc: 'Prácticas alineadas con los ciclos lunares y estacionales.',
    available_today: '✨ Disponible hoy', in_days: 'En', days_unit: 'días',
    back_rituals: 'Rituales', complete_ritual: 'Completar ritual ✨',
    ritual_new_intention: 'Hoy planto la semilla de lo que quiero cultivar.',
    ritual_full_intention: 'Hoy suelto lo que ya cumplió su propósito en mí.',
    ritual_equi_intention: 'Hoy honro el equilibrio entre la luz y la sombra.',
    // Auth
    welcome: 'Bienvenida a ChakraFit', private_comm: 'Comunidad privada.',
    email_hint: 'Ingresa tu correo para continuar.', continue_btn: 'Continuar →',
    login_btn: 'Ingresar →', valid_email: 'Ingresa un correo válido.',
    code_hint: 'Ingresa el código de acceso que te compartió la administradora:',
    wrong_code: 'Código incorrecto. Verifica el código que te enviaron.',
    no_code: '¿Sin código? Solicítalo a la administradora del programa.',
    change_btn: 'Cambiar', access_confirmed: '¡Acceso confirmado!',
    journey_begins: 'Tu viaje de 30 días comienza hoy.', your_name: '¿Cómo te llamas?',
    name_placeholder: 'Tu nombre...', begin_journey: 'Comenzar mi viaje ✨',
    // Edit name modal
    modal_title: '¿Cómo te llamas?', save_btn: 'Guardar', cancel_btn: 'Cancelar',
    // Admin
    admin_title: 'PANEL DE ADMINISTRACIÓN', access_control: 'Control de Accesos',
    how_works: '✨ CÓMO FUNCIONA',
    how_desc: 'Agrega el correo de cada persona → se genera su código único → copia y envíaselo. El código funciona en',
    how_desc2: 'cualquier dispositivo',
    active_invited: 'invitadas activas', secure_codes: 'códigos seguros', total_access: 'accesos totales',
    add_access: 'AGREGAR ACCESO', admin_lbl: 'ADMINISTRADORA', generated_lbl: 'ACCESOS GENERADOS',
    direct_access: 'Acceso directo · sin código', copied_btn: '✓ Copiado', copy_btn: '📋 Copiar',
    revoke_btn: 'Revocar', no_invited: 'Aún no has invitado a nadie.\nAgrega un correo arriba.',
    logout_btn: 'Cerrar sesión', invalid_email: 'Correo inválido.', self_email: 'Ese es tu correo de admin.',
    code_ok: '✓ Código generado para ', revoked_ok: 'Acceso revocado.',
    // Sidebar
    journey_label: 'Viaje de 30 días',
    // Journey 30 days
    day_of_label: 'Día',
    of_label: 'de 30',
    days_streak: 'días seguidos',
  },
  en: {
    // Nav
    home: 'Home', oracle: 'Oracle', routines: 'Routines', rituals: 'Rituals', admin: 'Admin',
    // Home
    good_morning: 'Good morning', your_energy: 'Your energy today', streak_days: 'day streak',
    see_routine: 'View routine →', oracle_btn: 'Oracle', day_label: 'Day', of_30: 'of 30',
    done_badge: '✓ Done', exercises: 'exercises', full_moon_label: 'FULL MOON',
    liberation_title: 'Liberation Ritual', liberation_dur: '20 min · Available',
    progress_label: 'PROGRESS', micro_label: "TODAY'S MICRO-RITUALS",
    morning: 'Morning', midday: 'Midday', night: 'Night',
    // Oracle
    oracle_sub: 'ORACLE · 30 DAYS', oracle_title: 'Activation of the 7 Chakras',
    day_of_30: 'of 30', phases_label: 'JOURNEY PHASES', days_label: 'DAYS',
    micro_day: 'MICRO-RITUALS · DAY',
    // Routines
    path_label: '30-DAY PATH', seven_chakras: '7 Routines, 7 Chakras',
    total_progress: 'TOTAL PROGRESS', completed_label: '✓ Completed',
    // Routine Summary
    all_routines: 'All routines', intention_label: 'INTENTION',
    begin_routine: 'Start routine →', exercises_label: 'EXERCISES',
    // Exercise Detail
    back_btn: 'Back', how_to: 'HOW TO DO IT',
    registered_title: '✓ Routine recorded!', active_streak: 'Active streak: 🔥',
    streak_days2: 'days', register_btn: '✅ Mark routine as complete',
    back_summary: 'Back to summary', prev_btn: 'Prev.', next_btn: 'Next',
    // Timer
    each_side: 'EACH SIDE', completed_time: 'Done!',
    pause_btn: 'Pause', resume_btn: 'Resume',
    // Audio
    sound_of: 'Sound of', playing: '▶ playing', silence: 'silence',
    binaural_hint: 'Binaural beat · theta wave 6 Hz · use headphones for best effect',
    // Rituals
    rituals_sub: 'MOON & SUN', rituals_title: 'Cycle Rituals',
    rituals_desc: 'Practices aligned with lunar and seasonal cycles.',
    available_today: '✨ Available today', in_days: 'In', days_unit: 'days',
    back_rituals: 'Rituals', complete_ritual: 'Complete ritual ✨',
    ritual_new_intention: "Today I plant the seed of what I want to cultivate.",
    ritual_full_intention: "Today I release what has served its purpose in me.",
    ritual_equi_intention: "Today I honor the balance between light and shadow.",
    // Auth
    welcome: 'Welcome to ChakraFit', private_comm: 'Private community.',
    email_hint: 'Enter your email to continue.', continue_btn: 'Continue →',
    login_btn: 'Sign in →', valid_email: 'Please enter a valid email.',
    code_hint: 'Enter the access code shared by the administrator:',
    wrong_code: 'Incorrect code. Check the code you were sent.',
    no_code: 'No code? Request it from the program administrator.',
    change_btn: 'Change', access_confirmed: 'Access confirmed!',
    journey_begins: 'Your 30-day journey starts today.', your_name: "What's your name?",
    name_placeholder: 'Your name...', begin_journey: 'Begin my journey ✨',
    // Edit name modal
    modal_title: "What's your name?", save_btn: 'Save', cancel_btn: 'Cancel',
    // Admin
    admin_title: 'ADMIN PANEL', access_control: 'Access Control',
    how_works: '✨ HOW IT WORKS',
    how_desc: "Add each person's email → a unique code is generated → copy and send it. The code works on",
    how_desc2: 'any device',
    active_invited: 'active members', secure_codes: 'secure codes', total_access: 'total access',
    add_access: 'ADD ACCESS', admin_lbl: 'ADMINISTRATOR', generated_lbl: 'GENERATED CODES',
    direct_access: 'Direct access · no code', copied_btn: '✓ Copied', copy_btn: '📋 Copy',
    revoke_btn: 'Revoke', no_invited: "You haven't invited anyone yet.\nAdd an email above.",
    logout_btn: 'Sign out', invalid_email: 'Invalid email.', self_email: 'That is your admin email.',
    code_ok: '✓ Code generated for ', revoked_ok: 'Access revoked.',
    // Sidebar
    journey_label: '30-day journey',
    // Journey 30 days
    day_of_label: 'Day',
    of_label: 'of 30',
    days_streak: 'day streak',
  },
};

// Global lang — module-level so it's accessible everywhere without prop drilling
let _lang: Lang = lsGet<Lang>('lang', 'es');
function t(key: string): string {
  return (TR[_lang] && TR[_lang][key] !== undefined) ? TR[_lang][key] : (TR.es[key] || key);
}
function useLang(): [Lang, () => void] {
  const [lang, setLang] = useState<Lang>(_lang);
  const toggle = () => {
    const next: Lang = _lang === 'es' ? 'en' : 'es';
    _lang = next;
    lsSet('lang', next);
    setLang(next);
  };
  return [lang, toggle];
}

// ============ ACCESS SYSTEM (code-based) ============
const MASTER_KEY = 'chakrafit_sagrada_2024';

function genCode(email: string): string {
  const str = email.toLowerCase().trim() + '::' + MASTER_KEY;
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let n = Math.abs(h);
  for (let i = 0; i < 8; i++) {
    code += chars[n % chars.length];
    n = Math.floor(n / chars.length) || Math.abs(h * (i + 2)) % 1e9;
  }
  return code.slice(0, 4) + '-' + code.slice(4, 8);
}

function verifyAccess(email: string, code: string): boolean {
  if (email === ADMIN_EMAIL) return true;
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '') === genCode(email).replace('-', '');
}

function getInvited(): string[] { return lsGet<string[]>('invited', []); }
function addInvited(email: string): void {
  const list = getInvited();
  if (!list.includes(email)) lsSet('invited', [...list, email]);
}
function removeInvited(email: string): void {
  lsSet('invited', getInvited().filter(e => e !== email));
}

// ============ BOOT ============
interface BootData { name: string; day: number; streak: number; lastComplete: string; today: string; yesterday: string; }
function boot(): BootData {
  const today = getTodayStr(); const yesterday = getYesterdayStr();
  const lastOpen = lsGet('last_open', '');
  let day = lsGet('prog_day', 1);
  if (lastOpen && lastOpen !== today) { day = Math.min(30, day + daysBetween(lastOpen, today)); lsSet('prog_day', day); }
  lsSet('last_open', today);
  const storedStreak = lsGet('streak', 0); const lc = lsGet('last_complete', '');
  const effectiveStreak = (lc === today || lc === yesterday) ? storedStreak : 0;
  return { name: lsGet('name', ''), day, streak: effectiveStreak, lastComplete: lc, today, yesterday };
}

// ============ EXERCISE SVGs ============
const SVGS: Record<string, (c: string) => string> = {
  meditate: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="40" cy="16" r="7" fill="${c}"/><line x1="40" y1="23" x2="40" y2="44" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><path d="M40 44 Q27 52 18 52" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 44 Q53 52 62 52" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="17" cy="52" r="4" fill="${c}"/><circle cx="63" cy="52" r="4" fill="${c}"/><line x1="40" y1="31" x2="24" y2="44" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/><line x1="40" y1="31" x2="56" y2="44" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/><circle cx="23" cy="45" r="3.5" fill="${c}"/><circle cx="57" cy="45" r="3.5" fill="${c}"/></svg>`,
  squat: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="40" cy="10" r="7" fill="${c}"/><line x1="40" y1="17" x2="40" y2="38" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="24" x2="19" y2="33" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="24" x2="61" y2="33" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="34" r="4" fill="${c}"/><circle cx="62" cy="34" r="4" fill="${c}"/><line x1="40" y1="38" x2="24" y2="56" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="24" y1="56" x2="20" y2="69" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="38" x2="56" y2="56" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="56" y1="56" x2="60" y2="69" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="14" y="67" width="12" height="5" rx="2.5" fill="${c}"/><rect x="54" y="67" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  bridge: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><line x1="8" y1="68" x2="72" y2="68" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity="0.25"/><circle cx="13" cy="62" r="6" fill="${c}"/><path d="M19 60 Q28 30 40 24 Q52 30 61 60" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/><rect x="56" y="58" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  lunge: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="38" cy="10" r="7" fill="${c}"/><line x1="38" y1="17" x2="38" y2="38" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="38" y1="26" x2="26" y2="34" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="38" y1="26" x2="50" y2="34" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="38" y1="38" x2="26" y2="55" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="26" y1="55" x2="22" y2="70" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="38" y1="38" x2="60" y2="50" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="60" y1="50" x2="64" y2="70" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="16" y="68" width="12" height="5" rx="2.5" fill="${c}"/><rect x="58" y="68" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  tree: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="40" cy="10" r="7" fill="${c}"/><line x1="40" y1="17" x2="40" y2="48" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="26" x2="24" y2="17" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="26" x2="56" y2="17" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="23" cy="16" r="4" fill="${c}"/><circle cx="57" cy="16" r="4" fill="${c}"/><line x1="40" y1="48" x2="40" y2="70" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="57" x2="57" y2="50" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="58" cy="49" r="4" fill="${c}"/><rect x="34" y="68" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  plank: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="13" cy="33" r="7" fill="${c}"/><line x1="19" y1="35" x2="67" y2="44" stroke="${c}" stroke-width="5" stroke-linecap="round"/><line x1="25" y1="37" x2="21" y2="53" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="14" y="51" width="13" height="5" rx="2.5" fill="${c}"/><line x1="42" y1="42" x2="38" y2="57" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="31" y="55" width="13" height="5" rx="2.5" fill="${c}"/></svg>`,
  cobra: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="40" cy="20" r="7" fill="${c}"/><path d="M40 27 Q40 38 38 48 Q35 58 18 63" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/><line x1="38" y1="43" x2="23" y2="35" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="38" y1="43" x2="53" y2="37" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="21" cy="34" r="4" fill="${c}"/><circle cx="55" cy="36" r="4" fill="${c}"/><line x1="18" y1="63" x2="62" y2="63" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`,
  twist: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="40" cy="12" r="7" fill="${c}"/><line x1="40" y1="19" x2="40" y2="42" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="28" x2="17" y2="22" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="28" x2="63" y2="35" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="21" r="4" fill="${c}"/><circle cx="64" cy="36" r="4" fill="${c}"/><line x1="40" y1="42" x2="26" y2="56" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="42" x2="54" y2="56" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/></svg>`,
  floor: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="60" cy="44" r="7" fill="${c}"/><path d="M54 47 Q40 40 22 46" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><line x1="22" y1="46" x2="11" y2="39" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="10" cy="38" r="4" fill="${c}"/><line x1="60" y1="51" x2="52" y2="63" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="60" y1="51" x2="68" y2="63" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/></svg>`,
  hips: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="40" cy="10" r="7" fill="${c}"/><line x1="40" y1="17" x2="40" y2="40" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="40" cy="40" rx="13" ry="7" fill="none" stroke="${c}" stroke-width="2.5" stroke-dasharray="4 3"/><line x1="34" y1="46" x2="30" y2="66" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="46" y1="46" x2="50" y2="66" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="23" y="64" width="13" height="5" rx="2.5" fill="${c}"/><rect x="44" y="64" width="13" height="5" rx="2.5" fill="${c}"/></svg>`,
  stretch: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="40" cy="13" r="7" fill="${c}"/><line x1="40" y1="20" x2="40" y2="48" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="28" x2="17" y2="13" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="28" x2="63" y2="13" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="12" r="4" fill="${c}"/><circle cx="64" cy="12" r="4" fill="${c}"/><line x1="40" y1="48" x2="28" y2="67" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="48" x2="52" y2="67" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="22" y="65" width="12" height="5" rx="2.5" fill="${c}"/><rect x="46" y="65" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  pushup: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="13" cy="36" r="7" fill="${c}"/><line x1="19" y1="38" x2="67" y2="46" stroke="${c}" stroke-width="5" stroke-linecap="round"/><line x1="26" y1="40" x2="21" y2="52" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="21" y1="52" x2="34" y2="54" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="35" cy="54" r="4" fill="${c}"/><line x1="55" y1="44" x2="51" y2="58" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="44" y="56" width="13" height="5" rx="2.5" fill="${c}"/></svg>`,
  legwall: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><line x1="68" y1="6" x2="68" y2="74" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity="0.25"/><circle cx="16" cy="56" r="6" fill="${c}"/><line x1="22" y1="56" x2="55" y2="56" stroke="${c}" stroke-width="5" stroke-linecap="round"/><line x1="49" y1="56" x2="49" y2="14" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="61" y1="56" x2="61" y2="14" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="43" y="10" width="11" height="5" rx="2.5" fill="${c}"/><rect x="56" y="10" width="11" height="5" rx="2.5" fill="${c}"/></svg>`,
  sunsal: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="40" cy="6" r="5" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.35"/><circle cx="40" cy="16" r="7" fill="${c}"/><line x1="40" y1="23" x2="40" y2="48" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="38" y1="29" x2="32" y2="13" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="42" y1="29" x2="48" y2="13" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="31" cy="12" r="4" fill="${c}"/><circle cx="49" cy="12" r="4" fill="${c}"/><line x1="40" y1="48" x2="30" y2="68" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="48" x2="50" y2="68" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="24" y="66" width="12" height="5" rx="2.5" fill="${c}"/><rect x="44" y="66" width="12" height="5" rx="2.5" fill="${c}"/></svg>`,
  mountain: c => `<svg viewBox="0 0 80 80" width="100%" height="100%"><circle cx="40" cy="40" r="36" fill="${c}18"/><circle cx="13" cy="31" r="7" fill="${c}"/><line x1="19" y1="33" x2="67" y2="42" stroke="${c}" stroke-width="5" stroke-linecap="round"/><line x1="25" y1="35" x2="21" y2="51" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="14" y="49" width="13" height="5" rx="2.5" fill="${c}"/><line x1="44" y1="41" x2="38" y2="54" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><circle cx="53" cy="36" r="5" fill="${c}" opacity="0.5"/><line x1="53" y1="41" x2="50" y2="55" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 2"/><rect x="43" y="53" width="12" height="4" rx="2" fill="${c}" opacity="0.6"/></svg>`,
};

function getSvgType(name: string): string {
  const n = name.toLowerCase();
  if (/medita|respiro|pranayama|escaneo|integra|4-7-8|zumbido|humm|respirac/.test(n)) return 'meditate';
  if (/sentad/.test(n)) return 'squat';
  if (/puente|glút|elevacion/.test(n)) return 'bridge';
  if (/estocad/.test(n)) return 'lunge';
  if (/árbol|arbol|águila|aguila|balanceo|un pie/.test(n)) return 'tree';
  if (/mountain/.test(n)) return 'mountain';
  if (/plank/.test(n)) return 'plank';
  if (/push.?up|flexion/.test(n)) return 'pushup';
  if (/pared/.test(n)) return 'legwall';
  if (/saludo|sol completo/.test(n)) return 'sunsal';
  if (/cobra|camello|pez/.test(n)) return 'cobra';
  if (/twist|russian|core|crunch|bicicl/.test(n)) return 'twist';
  if (/niño|mariposa|paloma|sukhasana/.test(n)) return 'floor';
  if (/circulo|círculo|ondulat|movimiento|cader/.test(n)) return 'hips';
  if (/apertura|roll|estira|trapec|hombro|cuello/.test(n)) return 'stretch';
  return 'meditate';
}

const ExerciseSVG = memo(function ExerciseSVG({ name, color, size = 80 }: { name: string; color: string; size?: number }) {
  const fn = SVGS[getSvgType(name)] || SVGS.meditate;
  return <div style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: fn(color) }} />;
});

// ============ TIMER ============
function playBell() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.5, ctx.currentTime);
    master.connect(ctx.destination);
    [0, 0.45, 0.9].forEach(delay => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + delay + 1.2);
      g.gain.setValueAtTime(0, ctx.currentTime + delay);
      g.gain.linearRampToValueAtTime(0.7, ctx.currentTime + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.8);
      osc.connect(g); g.connect(master);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.8);
    });
    setTimeout(() => ctx.close(), 4000);
  } catch (_) {}
}

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
        setRem(r => { if (r <= 1) { clearInterval(ref.current!); setDone(true); playBell(); return 0; } return r - 1; });
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
      {hasSide(reps) && <div className="bg-white/10 rounded-full px-3 py-1 text-[10px] text-[#C7BCDA] font-semibold tracking-widest">{t('each_side')}</div>}
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
      {done ? <p className="text-[#5A9E6F] text-xs font-bold">{t('completed_time')}</p>
        : <div className="flex gap-2">
            <button onClick={() => setRunning(r => !r)} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs text-[#C7BCDA] font-semibold transition-all cursor-pointer">
              {running ? <><Pause size={12}/> {t('pause_btn')}</> : <><Play size={12}/> {t('resume_btn')}</>}
            </button>
            <button onClick={reset} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-2.5 py-1.5 text-[#8B7FA8] transition-all cursor-pointer"><RotateCcw size={13}/></button>
          </div>}
    </div>
  );
}

// ============ DESKTOP SIDEBAR ============
type Tab = 'home' | 'oracle' | 'routines' | 'rituals' | 'admin';

function Sidebar({ active, onNav, isAdmin, name, streak, day, onLogout, onEditName, onToggleLang, lang }: {
  active: Tab; onNav: (t: Tab) => void; isAdmin: boolean;
  name: string; streak: number; day: number; onLogout: () => void; onEditName: () => void;
  onToggleLang: () => void; lang: Lang;
}) {
  const phase = getPhase(day);
  const pct = Math.round((day - 1) / 30 * 100);
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t('home'), icon: <Home size={18} strokeWidth={1.8}/> },
    { id: 'oracle', label: t('oracle'), icon: <Sparkles size={18} strokeWidth={1.8}/> },
    { id: 'routines', label: t('routines'), icon: <List size={18} strokeWidth={1.8}/> },
    { id: 'rituals', label: t('rituals'), icon: <Moon size={18} strokeWidth={1.8}/> },
  ];
  return (
    <aside className="w-64 h-full flex flex-col border-r border-white/[0.07] bg-[#0E0919] shrink-0">
      <div className="px-5 pt-7 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: phase.cl, border: `1px solid ${phase.cb}` }}>{phase.el}</div>
          <div>
            <span className="font-['Fraunces'] text-[#F3EFE6] text-lg font-semibold tracking-tight leading-none">ChakraFit</span>
            <p className="text-[#6E6480] text-[11px] mt-0.5">{t('journey_label')}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/[0.05]">
        <div className="bg-white/[0.04] rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-[#F3EFE6] text-sm font-semibold">{name}</p>
              <p className="text-[#6E6480] text-[11px] mt-0.5">{t('day_of_label')} {day} {t('of_label')}</p>
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
            <span className="text-[#6E6480] text-[11px]">{t('days_streak')}</span>
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
        <button onClick={onToggleLang} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl mb-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-[#C7BCDA] hover:text-[#F3EFE6] transition-all cursor-pointer">
          <Globe size={14} className="shrink-0"/>
          <span className="text-xs font-semibold flex-1 text-left">{lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}</span>
          <span className="font-['Space_Grotesk'] font-bold text-[10px] bg-white/10 px-1.5 py-0.5 rounded-md">{lang === 'es' ? 'EN' : 'ES'}</span>
        </button>
        <button onClick={onLogout} className="flex items-center gap-2 w-full px-2 py-2 rounded-xl text-[#6E6480] hover:text-[#8B7FA8] text-xs transition-all cursor-pointer hover:bg-white/[0.03]">
          <LogOut size={13}/> {t('logout_btn')}
        </button>
      </div>
    </aside>
  );
}

// ============ MOBILE BOTTOM NAV ============
function BottomNav({ active, onNav, isAdmin, onToggleLang, lang }: {
  active: Tab; onNav: (t: Tab) => void; isAdmin: boolean; onToggleLang: () => void; lang: Lang;
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t('home'), icon: <Home size={20} strokeWidth={1.7}/> },
    { id: 'oracle', label: t('oracle'), icon: <Sparkles size={20} strokeWidth={1.7}/> },
    { id: 'routines', label: t('routines'), icon: <List size={20} strokeWidth={1.7}/> },
    { id: 'rituals', label: t('rituals'), icon: <Moon size={20} strokeWidth={1.7}/> },
  ];
  if (isAdmin) tabs.push({ id: 'admin', label: t('admin'), icon: <div className="relative"><User size={20} strokeWidth={1.7}/><Shield size={8} className="absolute -top-0.5 -right-1 text-[#E0AD66]"/></div> });
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
      <button onClick={onToggleLang} className="flex-1 flex flex-col items-center gap-1 py-2.5 cursor-pointer group">
        <div className="relative">
          <Globe size={20} strokeWidth={1.7} className="text-[#8B7FA8] group-active:text-[#C7BCDA]"/>
          <span className="absolute -top-1 -right-2 font-['Space_Grotesk'] font-bold text-[8px] text-[#E0AD66] bg-[#2A2235] border border-[#E0AD66]/30 px-0.5 rounded leading-none">{lang === 'es' ? 'EN' : 'ES'}</span>
        </div>
        <span className="text-[10px] font-medium text-[#8B7FA8]">{lang === 'es' ? 'EN' : 'ES'}</span>
      </button>
    </nav>
  );
}

// ============ AUTH SCREENS ============
function EmailLogin({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const nextStep = () => {
    const e = email.trim().toLowerCase();
    if (!e.includes('@')) { setError(t('valid_email')); return; }
    setError('');
    if (e === ADMIN_EMAIL) { doLogin(e, ''); }
    else { setStep(2); }
  };

  const doLogin = (e: string, c: string) => {
    if (verifyAccess(e, c)) { lsSet('email', e); onLogin(e); }
    else { setError(t('wrong_code')); setShake(true); setTimeout(() => setShake(false), 600); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 60% 20%, #2D1F4570 0%, #0D0A18 70%)' }}>
      <div className="w-full max-w-sm px-8 py-12">
        <div className="text-center mb-10">
          <div className="text-6xl mb-6 inline-block">🌸</div>
          <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl font-semibold mb-3">{t('welcome')}</h1>
          <p className="text-[#8B7FA8] text-sm leading-relaxed">{t('private_comm')}<br/>{t('email_hint')}</p>
        </div>

        {step === 1 && (
          <div className={`mb-4 ${shake ? 'animate-bounce' : ''}`}>
            <input type="email" placeholder="tu@correo.com" value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') nextStep(); }}
              className="w-full bg-white/[0.07] border border-white/20 hover:border-white/30 focus:border-[#E0AD66] rounded-2xl text-[#F3EFE6] text-base py-4 px-5 text-center outline-none transition-all"
            />
          </div>
        )}

        {step === 2 && (
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3 bg-white/[0.05] rounded-xl px-3 py-2.5">
              <span className="text-[#8B7FA8] text-sm flex-1 truncate">{email}</span>
              <button onClick={() => { setStep(1); setError(''); setCode(''); }} className="text-[#E0AD66] text-xs font-semibold cursor-pointer bg-transparent border-none shrink-0">{t('change_btn')}</button>
            </div>
            <p className="text-[#C7BCDA] text-xs mb-3 leading-relaxed">{t('code_hint')}</p>
            <div className={shake ? 'animate-bounce' : ''}>
              <input placeholder="XXXX-XXXX" value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') doLogin(email.trim().toLowerCase(), code); }}
                className="w-full bg-white/[0.07] border border-white/20 hover:border-white/30 focus:border-[#E0AD66] rounded-2xl text-[#F3EFE6] text-xl py-4 px-5 text-center outline-none transition-all font-['Space_Grotesk'] tracking-[4px] font-bold"
                maxLength={9}
              />
            </div>
          </div>
        )}

        {error && <div className="bg-[rgba(196,75,75,0.1)] border border-[rgba(196,75,75,0.2)] rounded-xl mb-4 py-2.5 px-4 text-center"><p className="text-[#E07070] text-sm">🔒 {error}</p></div>}

        <button
          onClick={step === 1 ? nextStep : () => doLogin(email.trim().toLowerCase(), code)}
          className="w-full bg-[#E0AD66] hover:bg-[#d49e55] text-[#2A2235] font-bold text-base py-4 rounded-2xl mb-6 transition-all cursor-pointer"
        >
          {step === 1 ? t('continue_btn') : t('login_btn')}
        </button>
        <p className="text-[#4A3F5C] text-xs text-center">{t('no_code')}</p>
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
        <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl font-semibold mb-3">{t('access_confirmed')}</h1>
        <p className="text-[#8B7FA8] text-sm mb-10 leading-relaxed">{t('journey_begins')}<br/>{t('your_name')}</p>
        <input placeholder={t('name_placeholder')} value={value} onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onSave(value.trim()); }}
          className="w-full bg-white/[0.07] border border-white/20 focus:border-[#E0AD66] rounded-2xl text-[#F3EFE6] text-base py-4 px-5 text-center outline-none transition-all mb-4"
        />
        <button onClick={() => value.trim() && onSave(value.trim())} className="w-full bg-[#E0AD66] text-[#2A2235] font-bold text-base py-4 rounded-2xl transition-all" style={{ opacity: value.trim() ? 1 : 0.4 }}>
          {t('begin_journey')}
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
          <p className="text-[#8B7FA8] text-sm mb-0.5">{t('good_morning')}, <span className="text-[#C7BCDA]">{name}</span>
            <button onClick={onEditName} className="ml-2 text-[#6E6480] hover:text-[#8B7FA8] transition-all cursor-pointer"><Edit2 size={12} className="inline"/></button>
          </p>
          <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl lg:text-4xl font-semibold leading-tight">{t('your_energy')}</h1>
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
            <p className="text-[10px] font-semibold tracking-[2px] mb-2" style={{ color: phase.c }}>{(_lang === 'en' ? phase.nameEn : phase.name).toUpperCase()} · {t('day_label').toUpperCase()} {day}</p>
            <p className="font-['Fraunces'] text-[#2A2235] text-lg lg:text-xl italic font-semibold leading-snug mb-4">"{_lang === 'en' ? data.msgEn : data.msg}"</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => onGoRoutine(phase.id)} className="flex-1 py-2.5 rounded-xl lg:rounded-2xl bg-[#2A2235] text-[#FBF7F0] font-semibold text-sm hover:bg-[#1E1530] transition-all cursor-pointer">{t('see_routine')}</button>
            <button onClick={onGoOracle} className="flex-1 py-2.5 rounded-xl lg:rounded-2xl bg-transparent text-[#2A2235] font-semibold text-sm border-2 border-[#D0C8B8] hover:bg-black/5 transition-all cursor-pointer">{t('oracle_btn')}</button>
          </div>
        </div>
        {/* Stats: side by side on mobile, stacked on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-3 lg:p-4 text-center flex flex-col items-center justify-center">
            <div className="text-2xl lg:text-3xl mb-1.5 animate-elem-float">{phase.el}</div>
            <div className="font-['Space_Grotesk'] text-xl lg:text-2xl font-bold text-[#F3EFE6]">{t('day_label')} {day}</div>
            <div className="text-xs text-[#6E6480] mt-0.5">{t('of_30')}</div>
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
          <span className="text-[#8B7FA8] text-[11px] font-semibold tracking-wider">{t('progress_label')}</span>
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
            <div className="text-[10px] font-semibold tracking-wider mb-0.5" style={{ color: phase.c }}>{ (_lang === 'en' ? phase.enEn : phase.en).toUpperCase()}</div>
            <div className="text-[#F3EFE6] text-sm font-semibold truncate">{_lang === 'en' ? routine.titleEn : routine.title}</div>
            <div className="text-xs mt-0.5" style={{ color: phase.c }}>{routine.dur} · {routine.steps.length} {t('exercises')}</div>
          </div>
          {done ? <span className="text-[#5A9E6F] text-xs font-semibold shrink-0 bg-[rgba(90,158,111,0.15)] px-2 py-1 rounded-full">{t('done_badge')}</span>
            : <ChevronRight size={15} className="text-[#4A3F5C] group-hover:text-[#C7BCDA] transition-all shrink-0"/>}
        </div>
        <div className="bg-white/[0.04] border border-white/[0.07] hover:border-white/15 rounded-xl lg:rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all group" onClick={onGoRituals}>
          <div className="w-12 h-12 rounded-xl bg-[rgba(168,166,201,0.15)] border border-[rgba(168,166,201,0.3)] flex items-center justify-center shrink-0 text-2xl">🌕</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold tracking-wider text-[#A8A6C9] mb-0.5">{t('full_moon_label')}</div>
            <div className="text-[#F3EFE6] text-sm font-semibold">{t('liberation_title')}</div>
            <div className="text-[#A8A6C9] text-xs mt-0.5">{t('liberation_dur')}</div>
          </div>
          <ChevronRight size={15} className="text-[#4A3F5C] group-hover:text-[#C7BCDA] transition-all shrink-0"/>
        </div>
      </div>

      {/* Micro-rituals */}
      <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-3">{t('micro_label')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {([{ key: 'm', labelKey: 'morning', color: phase.c }, { key: 'md', labelKey: 'midday', color: '#DD8A3E' }, { key: 'n', labelKey: 'night', color: '#9D74BE' }] as const).map(({ key, labelKey, color }) => {
          const item = data[key as keyof DayData] as { d: string; txt: string; txtEn: string };
          return (
            <div key={key} className="bg-[#FBF7F0] rounded-xl lg:rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold tracking-widest" style={{ color }}>{t(labelKey).toUpperCase()}</span>
                <span className="text-[#6E6480] text-[11px]">{item.d}</span>
              </div>
              <p className="text-[#2A2235] text-xs leading-relaxed">{_lang === 'en' ? item.txtEn : item.txt}</p>
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
        <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-1.5">{t('oracle_sub')}</p>
        <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl lg:text-4xl font-semibold mb-4 leading-tight">{t('oracle_title')}</h1>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#C44B4B,#D9AE3F,#A87DC8)' }}/>
          </div>
          <span className="font-['Space_Grotesk'] text-sm font-bold shrink-0" style={{ color: getPhase(day).c }}>{t('day_label')} {day}/{t('day_of_30')}</span>
        </div>

        <div className="rounded-2xl p-4 lg:p-5 mb-5" style={{ background: selectedPhase.cl, border: `1px solid ${selectedPhase.cb}` }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl animate-breathe" style={{ background: selectedPhase.cl, border: `2px solid ${selectedPhase.cb}` }}>{selectedPhase.el}</div>
            <div>
              <span className="inline-block text-xs font-semibold py-1 px-3 rounded-full mb-1" style={{ background: selectedPhase.cl, color: selectedPhase.c, border: `1px solid ${selectedPhase.cb}` }}>{ (_lang === 'en' ? selectedPhase.nameEn : selectedPhase.name).toUpperCase()}</span>
              <p className="text-[#8B7FA8] text-xs">{t('days_label')} {selectedPhase.days[0]}–{selectedPhase.days[selectedPhase.days.length-1]} · {_lang === 'en' ? selectedPhase.themeEn : selectedPhase.theme}</p>
            </div>
          </div>
          <p className="font-['Fraunces'] text-[#F3EFE6] text-base italic leading-relaxed mb-3">"{_lang === 'en' ? data.msgEn : data.msg}"</p>
          <p className="text-[#C7BCDA] text-sm leading-relaxed">{_lang === 'en' ? selectedPhase.omEn : selectedPhase.om}</p>
        </div>

        {/* Day selector tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {selectedPhase.days.map(d => (
            <button key={d} onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedDay === d ? 'text-[#0E0919]' : 'bg-white/[0.05] text-[#8B7FA8] hover:bg-white/10 hover:text-[#C7BCDA]'}`}
              style={selectedDay === d ? { background: selectedPhase.c } : {}}>
              {t('day_label')} {d}
            </button>
          ))}
        </div>

        <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-3">{t('micro_day')} {selectedDay}</h2>
        <div className="flex flex-col gap-3">
          {([{ key: 'm', labelKey: 'morning', color: selectedPhase.c }, { key: 'md', labelKey: 'midday', color: '#DD8A3E' }, { key: 'n', labelKey: 'night', color: '#9D74BE' }] as const).map(({ key, labelKey, color }) => {
            const item = data[key as keyof DayData] as { d: string; txt: string; txtEn: string };
            return (
              <div key={key} className="bg-[#FBF7F0] rounded-xl lg:rounded-2xl p-4">
                <div className="flex justify-between mb-2"><span className="text-[10px] font-semibold tracking-wider" style={{ color }}>{t(labelKey).toUpperCase()}</span><span className="text-[#6E6480] text-xs">{item.d}</span></div>
                <p className="text-[#2A2235] text-sm leading-relaxed">{_lang === 'en' ? item.txtEn : item.txt}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile phases list */}
        <div className="lg:hidden mt-6">
          <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-4">{t('phases_label')}</h2>
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
                    <p className="text-[10px] font-semibold mb-0.5 tracking-wider" style={{ color: sel ? ph.c : '#8B7FA8' }}>{t('days_label')} {ph.days[0]}–{ph.days[ph.days.length-1]}</p>
                    <p className="text-xs" style={{ color: sel ? '#F3EFE6' : '#C7BCDA', fontWeight: sel ? 600 : 400 }}>{ (_lang === 'en' ? ph.nameEn : ph.name)} · {_lang === 'en' ? ph.themeEn : ph.theme}</p>
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
              <div key={ph.id} className="flex gap-3 pb-4 relative z-10 cursor-pointer group" onClick={() => handlePhaseSelect(ph)}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all" style={{ background: sel ? ph.c : ph.c+'25', border: `2px solid ${sel ? ph.c : ph.c+'60'}`, boxShadow: sel ? `0 0 16px ${ph.c}60` : 'none', fontSize: past&&!sel ? 12 : 20 }}>
                  {past&&!sel ? <Check size={12}/> : ph.el}
                </div>
                <div className="flex-1 pt-1.5 min-w-0">
                  <p className="text-[10px] font-semibold mb-0.5 tracking-wider" style={{ color: sel ? ph.c : '#8B7FA8' }}>DÍAS {ph.days[0]}–{ph.days[ph.days.length-1]}</p>
                  <p className="text-xs truncate group-hover:text-[#C7BCDA] transition-colors" style={{ color: sel ? '#F3EFE6' : '#6E6480', fontWeight: sel ? 600 : 400 }}>{ph.name} · {ph.theme}</p>
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
      <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-1.5">{t('path_label')}</p>
      <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl lg:text-4xl font-semibold mb-5 leading-tight">{t('seven_chakras')}</h1>
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl lg:rounded-2xl p-4 mb-5 lg:mb-6">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[#8B7FA8] text-[11px] font-semibold tracking-wider">{t('total_progress')}</span>
          <span className="font-['Space_Grotesk'] text-sm font-bold" style={{ color: todayPhase.c }}>{t('day_label')} {day} {t('of_30')}</span>
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
                  <span className="text-[10px] font-semibold tracking-wider" style={{ color: future ? 'rgba(255,255,255,0.15)' : active ? ph.c : '#8B7FA8' }}>{t('days_label')} {ph.days[0]}–{ph.days[ph.days.length-1]}</span>
                  <span className="text-xs font-semibold" style={{ color: past ? '#5A9E6F' : active ? ph.c : 'rgba(255,255,255,0.15)' }}>{past ? t('completed_label') : r.dur}</span>
                </div>
                <p className="text-sm font-semibold truncate" style={{ color: future ? 'rgba(255,255,255,0.18)' : active ? '#F3EFE6' : past ? '#C7BCDA' : '#5A4F6A' }}>{ _lang === 'en' ? r.titleEn : r.title}</p>
                {active && <p className="text-[#C7BCDA] text-xs italic mt-1 truncate">"{ _lang === 'en' ? ph.intEn : ph.int}"</p>}
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
          <ChevronLeft size={15}/> {t('all_routines')}
        </button>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{phase.el}</span>
          <div>
            <span className="inline-block text-xs font-semibold py-1 px-3 rounded-full" style={{ background: phase.cl, color: phase.c, border: `1px solid ${phase.cb}` }}>{ (_lang === 'en' ? phase.nameEn : phase.name).toUpperCase()}</span>
            <p className="text-[#8B7FA8] text-xs mt-1">{routine.dur} · {routine.steps.length} {t('exercises')}</p>
          </div>
        </div>
        <h1 className="font-['Fraunces'] text-[#F3EFE6] text-2xl lg:text-3xl font-semibold mb-4 leading-tight">{_lang === 'en' ? routine.titleEn : routine.title}</h1>
        <div className="rounded-xl lg:rounded-2xl p-4 mb-5" style={{ background: phase.cl, border: `1px solid ${phase.cb}` }}>
          <p className="text-[10px] font-semibold tracking-widest mb-2" style={{ color: phase.c }}>{t('intention_label')}</p>
          <p className="font-['Fraunces'] text-[#F3EFE6] text-sm italic leading-relaxed">"{_lang === 'en' ? phase.intEn : phase.int}"</p>
        </div>
        <button onClick={() => openEx(0)} className="w-full bg-[#E0AD66] hover:bg-[#d49e55] text-[#2A2235] font-bold text-base py-3.5 rounded-xl lg:rounded-2xl mb-5 transition-all cursor-pointer">{t('begin_routine')}</button>
        {/* Mobile exercise list */}
        <div className="lg:hidden flex flex-col gap-2.5">
          <p className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-1">{t('exercises_label')}</p>
          {routine.steps.map((step, i) => (
            <div key={i} className="bg-[#FBF7F0] rounded-xl p-3 flex items-center gap-3 cursor-pointer" onClick={() => openEx(i)}>
              <div className="w-11 h-11 shrink-0 rounded-lg overflow-hidden"><ExerciseSVG name={step.name} color={phase.c} size={44}/></div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2A2235] text-xs font-semibold mb-0.5 truncate">{_lang === 'en' ? step.nameEn : step.name}</p>
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
        <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-4">{t('exercises_label')}</p>
        <div className="flex flex-col gap-2.5">
          {routine.steps.map((step, i) => (
            <div key={i} className="bg-[#FBF7F0] rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all" onClick={() => openEx(i)}>
              <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden"><ExerciseSVG name={step.name} color={phase.c} size={48}/></div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2A2235] text-xs font-semibold mb-0.5 truncate">{_lang === 'en' ? step.nameEn : step.name}</p>
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

// ============ MEDITATION AUDIO ============
const CHAKRA_AUDIO: Record<string, { hz: number; mantra: string; label: string; color: string }> = {
  raiz:     { hz: 396, mantra: 'LAM', label: '396 Hz · Liberación del miedo',  color: '#C44B4B' },
  sacro:    { hz: 417, mantra: 'VAM', label: '417 Hz · Creatividad y flujo',    color: '#E07A3A' },
  solar:    { hz: 528, mantra: 'RAM', label: '528 Hz · Transformación y poder', color: '#D9AE3F' },
  corazon:  { hz: 639, mantra: 'YAM', label: '639 Hz · Amor y conexión',        color: '#5A9E6F' },
  garganta: { hz: 741, mantra: 'HAM', label: '741 Hz · Expresión y verdad',     color: '#4A90C4' },
  tojo:     { hz: 852, mantra: 'AUM', label: '852 Hz · Intuición y claridad',   color: '#7B68C8' },
  corona:   { hz: 963, mantra: 'OM',  label: '963 Hz · Consciencia pura',       color: '#A87DC8' },
};

function isMeditacion(name: string): boolean {
  return /meditaci|pranayama|escaneo|humming|zumbido|nadi|sukhasana|respiraci/i.test(name);
}

const WAVE_BARS = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8, 0.5];

function MeditationAudio({ phaseId, color }: { phaseId: string; color: string }) {
  const info = CHAKRA_AUDIO[phaseId] || CHAKRA_AUDIO.corona;
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.4);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, OscillatorNode | GainNode>>({});

  function startAudio() {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ac = ctxRef.current;
    if (ac.state === 'suspended') ac.resume();

    const master = ac.createGain();
    master.gain.setValueAtTime(0, ac.currentTime);
    master.gain.linearRampToValueAtTime(vol, ac.currentTime + 2);
    master.connect(ac.destination);

    const osc1 = ac.createOscillator();
    osc1.type = 'sine'; osc1.frequency.value = info.hz;
    const g1 = ac.createGain(); g1.gain.value = 0.6;
    osc1.connect(g1); g1.connect(master); osc1.start();

    const merger = ac.createChannelMerger(2);
    const oscL = ac.createOscillator(), oscR = ac.createOscillator();
    oscL.type = 'sine'; oscL.frequency.value = info.hz;
    oscR.type = 'sine'; oscR.frequency.value = info.hz + 6;
    const gL = ac.createGain(), gR = ac.createGain();
    gL.gain.value = 0.25; gR.gain.value = 0.25;
    oscL.connect(gL); gL.connect(merger, 0, 0);
    oscR.connect(gR); gR.connect(merger, 0, 1);
    merger.connect(master); oscL.start(); oscR.start();

    const osc2 = ac.createOscillator();
    osc2.type = 'sine'; osc2.frequency.value = info.hz / 2;
    const g2 = ac.createGain(); g2.gain.value = 0.15;
    osc2.connect(g2); g2.connect(master); osc2.start();

    nodesRef.current = { master, osc1, oscL, oscR, osc2 } as any;
  }

  function stopAudio() {
    const { master, osc1, oscL, oscR, osc2 } = nodesRef.current as any;
    if (!master) return;
    const ac = ctxRef.current!;
    master.gain.setValueAtTime(master.gain.value, ac.currentTime);
    master.gain.linearRampToValueAtTime(0, ac.currentTime + 1.5);
    setTimeout(() => {
      [osc1, oscL, oscR, osc2].forEach((o: OscillatorNode) => { try { o.stop(); } catch (_) {} });
    }, 1600);
    nodesRef.current = {};
  }

  useEffect(() => () => { if (playing) stopAudio(); }, []);

  function toggle() {
    if (playing) { stopAudio(); setPlaying(false); }
    else { startAudio(); setPlaying(true); }
  }

  function changeVol(e: Event) {
    const v = parseFloat((e.target as HTMLInputElement).value);
    setVol(v);
    const master = (nodesRef.current as any).master as GainNode | undefined;
    if (master && ctxRef.current) master.gain.setTargetAtTime(v, ctxRef.current.currentTime, 0.1);
  }

  const c = color || info.color;

  return (
    <div style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${c}40`, borderRadius: 18, padding: '14px 16px', marginBottom: 20 }}>
      <div className="flex items-center gap-3 mb-3">
        <div
          onClick={toggle}
          style={{ width: 44, height: 44, borderRadius: '50%', background: playing ? c : 'rgba(255,255,255,0.06)', border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', boxShadow: playing ? `0 0 18px ${c}60` : 'none', flexShrink: 0 }}
        >
          {playing
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill={c === '#D9AE3F' ? '#2A2235' : '#F3EFE6'}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill={c}><path d="M8 5V19L19 12L8 5Z"/></svg>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#F3EFE6] text-xs font-bold mb-0.5">🎵 {t('sound_of')} {info.mantra}</p>
          <p className="text-xs" style={{ color: c }}>{info.label}</p>
        </div>
        <span className="font-['Space_Grotesk'] text-[#8B7FA8] text-[10px] shrink-0">{playing ? t('playing') : t('silence')}</span>
      </div>

      <div className="flex items-center justify-center gap-1 mb-3" style={{ height: 32 }}>
        {WAVE_BARS.map((h, i) => (
          <div key={i} style={{
            width: 3, borderRadius: 3,
            height: playing ? `${h * 28}px` : '4px',
            background: playing ? c : 'rgba(255,255,255,0.12)',
            transition: 'height 0.3s ease, background 0.3s',
            animation: playing ? `chakra-wv ${0.6 + i * 0.08}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.06}s`,
          }}/>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs">🔈</span>
        <input type="range" min="0.05" max="0.8" step="0.05" value={vol} onInput={changeVol}
          style={{ flex: 1, accentColor: c, cursor: 'pointer', height: 3 }}/>
        <span className="text-xs">🔊</span>
      </div>
      <p className="text-[#4A3F5C] text-[10px] text-center mt-2 leading-relaxed">{t('binaural_hint')}</p>
      <style>{`@keyframes chakra-wv { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
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
          <button onClick={back} className="flex items-center gap-2 text-[#8B7FA8] hover:text-[#C7BCDA] text-sm transition-all cursor-pointer"><ChevronLeft size={15}/> {t('back_btn')}</button>
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
          <span className="inline-block text-xs font-semibold py-1 px-3 rounded-full" style={{ background: phase.cl, color: phase.c, border: `1px solid ${phase.cb}` }}>{phase.el} {_lang === 'en' ? phase.enEn : phase.en}</span>
          <span className="text-[#8B7FA8] text-xs">{_lang === 'en' ? step.subEn : step.sub}</span>
        </div>
        <h2 className="font-['Fraunces'] text-[#F3EFE6] text-2xl lg:text-3xl font-semibold mb-4 leading-tight">{_lang === 'en' ? step.nameEn : step.name}</h2>
        <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-xl py-2.5 px-3.5 mb-4 w-fit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ stroke: phase.c }}><circle cx="12" cy="12" r="9" strokeWidth="1.8"/><path d="M12 7v5l3 3" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <span className="text-sm font-semibold" style={{ color: phase.c }}>{step.reps}</span>
        </div>
        <p className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-2">{t('how_to')}</p>
        <p className="text-[#D4CEDF] text-sm leading-relaxed mb-5">{_lang === 'en' ? step.descEn : step.desc}</p>

        {isMeditacion(step.name) && (
          <MeditationAudio key={`${phaseId}-${idx}`} phaseId={phaseId} color={phase.c} />
        )}

        {isLast && (
          done
            ? <div className="bg-[rgba(90,158,111,0.12)] border border-[rgba(90,158,111,0.25)] rounded-2xl py-4 px-5 text-center">
                <p className="text-[#5A9E6F] font-bold mb-1">{t('registered_title')}</p>
                <p className="text-[#8B7FA8] text-sm">{t('active_streak')} {streak} {t('streak_days2')}</p>
              </div>
            : <button onClick={onComplete} className="w-full py-4 rounded-2xl bg-gradient-to-br from-[#E0AD66] to-[#C47A1A] text-[#2A2235] font-bold text-base cursor-pointer hover:opacity-90 transition-all">
                {t('register_btn')}
              </button>
        )}

        {/* Mobile nav buttons */}
        <div className="lg:hidden flex gap-3 mt-5">
          <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={isFirst}
            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm transition-all cursor-pointer disabled:cursor-default"
            style={{ background: isFirst ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.07)', border: `1px solid rgba(255,255,255,${isFirst?'0.04':'0.12'})`, color: isFirst ? '#2A2540' : '#C7BCDA' }}>
            <ChevronLeft size={14}/> {t('prev_btn')}
          </button>
          {!isLast
            ? <button onClick={() => setIdx(i => i+1)} className="flex-[2] py-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-all" style={{ background: phase.c, color: '#1E1530' }}>
                {t('next_btn')} <ChevronRight size={14}/>
              </button>
            : <button onClick={back} className="flex-[2] py-3 rounded-xl bg-white/[0.06] border border-white/10 text-[#C7BCDA] font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all">{t('back_summary')}</button>
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
            <ChevronLeft size={14}/> {t('prev_btn')}
          </button>
          {!isLast
            ? <button onClick={() => setIdx(i => i+1)} className="flex-[2] py-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-all" style={{ background: phase.c, color: '#1E1530' }}>
                {t('next_btn')} <ChevronRight size={14}/>
              </button>
            : <button onClick={back} className="flex-[2] py-3 rounded-xl bg-white/[0.06] border border-white/10 text-[#C7BCDA] font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all">{t('back_summary')}</button>
          }
        </div>
      </div>
    </div>
  );
}

// ============ RITUALS SCREEN ============
function RitualsScreen({ completedRituals, onSelect }: { completedRituals: Set<string>; onSelect: (r: Ritual) => void }) {
  const getBadge = (r: Ritual) => {
    if (completedRituals.has(r.id)) return { text: t('completed_label'), color: '#5C9C7C', bg: 'rgba(90,158,111,0.12)' };
    if (r.status === 'available') return { text: t('available_today'), color: r.c, bg: r.c+'18' };
    return { text: `${t('in_days')} ${r.daysUntil} ${t('days_unit')}`, color: '#6E6480', bg: 'rgba(255,255,255,0.06)' };
  };
  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-20 lg:pb-8 animate-fade-in">
      <p className="text-[#8B7FA8] text-xs font-semibold tracking-widest mb-1.5">{t('rituals_sub')}</p>
      <h1 className="font-['Fraunces'] text-[#F3EFE6] text-3xl lg:text-4xl font-semibold mb-2 leading-tight">{t('rituals_title')}</h1>
      <p className="text-[#8B7FA8] text-sm mb-6 lg:mb-8 leading-relaxed">{t('rituals_desc')}</p>
      <div className="flex flex-col gap-3 lg:gap-4">
        {RITUALS.map(r => {
          const badge = getBadge(r);
          return (
            <div key={r.id} className="bg-[#FBF7F0] rounded-xl lg:rounded-2xl p-4 lg:p-5 cursor-pointer hover:opacity-95 transition-all group" onClick={() => onSelect(r)}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl lg:rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: r.bg, border: `1px solid ${r.c}40` }}>🌕</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1.5">
                    <div><p className="text-[#2A2235] text-sm font-semibold">{_lang === 'en' ? r.nameEn : r.name}</p><p className="text-[#6E6480] text-xs">{_lang === 'en' ? r.subEn : r.sub}</p></div>
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
    if (ritual.id === 'luna-nueva') return t('ritual_new_intention');
    if (ritual.id === 'luna-llena') return t('ritual_full_intention');
    return t('ritual_equi_intention');
  };
  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-20 lg:pb-8 animate-fade-in">
      <button onClick={back} className="flex items-center gap-2 text-[#8B7FA8] hover:text-[#C7BCDA] text-sm mb-5 transition-all cursor-pointer"><ChevronLeft size={15}/> {t('back_rituals')}</button>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-xl lg:rounded-2xl flex items-center justify-center text-3xl" style={{ background: ritual.bg, border: `1px solid ${ritual.c}40` }}>🌕</div>
        <div><h1 className="font-['Fraunces'] text-[#F3EFE6] text-2xl lg:text-3xl font-semibold leading-tight">{_lang === 'en' ? ritual.nameEn : ritual.name}</h1><p className="text-[#8B7FA8] text-sm mt-1">{_lang === 'en' ? ritual.subEn : ritual.sub} · {ritual.dur}</p></div>
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
                <p className="text-[#F3EFE6] text-sm font-medium mb-1" style={{ textDecoration: ch ? 'line-through' : 'none' }}>{ _lang === 'en' ? s.nEn : s.n}</p>
                <p className="text-[#8B7FA8] text-xs leading-relaxed">{_lang === 'en' ? s.iEn : s.i}</p>
              </div>
            </div>
          );
        })}
      </div>
      {allDone && <button onClick={complete} className="w-full bg-[#E0AD66] hover:bg-[#d49e55] text-[#2A2235] font-bold text-base py-4 rounded-xl lg:rounded-2xl transition-all cursor-pointer">{t('complete_ritual')}</button>}
    </div>
  );
}

// ============ ADMIN PANEL ============
function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [invited, setInvited] = useState<string[]>(getInvited);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [copied, setCopied] = useState('');

  const add = () => {
    const e = newEmail.trim().toLowerCase();
    if (!e.includes('@')) { setError(t('invalid_email')); return; }
    if (e === ADMIN_EMAIL) { setError(t('self_email')); return; }
    addInvited(e);
    const next = getInvited();
    setInvited(next); setNewEmail(''); setError('');
    setSuccess(t('code_ok') + e); setTimeout(() => setSuccess(''), 3000);
  };

  const revoke = (email: string) => {
    removeInvited(email); setInvited(getInvited()); setConfirmDelete(null);
    setSuccess(t('revoked_ok')); setTimeout(() => setSuccess(''), 2500);
  };

  const copyCode = (e: string, code: string) => {
    const msg = `Hola! Tu código de acceso para ChakraFit:\n\nCorreo: ${e}\nCódigo: ${code}\n\nIngresa en la app con estos datos. ✨`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg).then(() => { setCopied(e); setTimeout(() => setCopied(''), 2000); });
    } else {
      const ta = document.createElement('textarea'); ta.value = msg;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta); setCopied(e); setTimeout(() => setCopied(''), 2000);
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 lg:px-8 py-6 lg:py-8 pb-20 lg:pb-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-7">
        <div className="w-11 h-11 rounded-xl bg-[rgba(224,173,102,0.12)] border-2 border-[rgba(224,173,102,0.3)] flex items-center justify-center text-2xl">👑</div>
        <div>
          <p className="text-[#E0AD66] text-xs font-semibold tracking-widest mb-0.5">{t('admin_title')}</p>
          <h1 className="font-['Fraunces'] text-[#F3EFE6] text-2xl font-semibold">{t('access_control')}</h1>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[rgba(224,173,102,0.07)] border border-[rgba(224,173,102,0.18)] rounded-xl lg:rounded-2xl p-4 mb-6">
        <p className="text-[#E0AD66] text-[11px] font-semibold tracking-widest mb-2">{t('how_works')}</p>
        <p className="text-[#C7BCDA] text-sm leading-relaxed">{t('how_desc')} <strong className="text-[#F3EFE6]">{t('how_desc2')}</strong>.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-7">
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl lg:rounded-2xl p-4 text-center">
          <div className="font-['Space_Grotesk'] text-[#E0AD66] text-3xl font-bold">{invited.length}</div>
          <div className="text-[#8B7FA8] text-xs mt-1">{t('active_invited')}</div>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl lg:rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">🔑</div>
          <div className="text-[#8B7FA8] text-xs">{t('secure_codes')}</div>
        </div>
        <div className="hidden lg:block bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 text-center">
          <div className="font-['Space_Grotesk'] text-[#A87DC8] text-3xl font-bold">{invited.length + 1}</div>
          <div className="text-[#8B7FA8] text-xs mt-1">{t('total_access')}</div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 flex flex-col gap-5">
        {/* Left col */}
        <div>
          <h2 className="text-[#C7BCDA] text-[11px] font-semibold tracking-widest mb-3">{t('add_access')}</h2>
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

          <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-3">{t('admin_lbl')}</h2>
          <div className="bg-white/[0.04] border border-[rgba(224,173,102,0.2)] rounded-xl lg:rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[rgba(224,173,102,0.12)] border-2 border-[rgba(224,173,102,0.3)] flex items-center justify-center text-lg shrink-0">👑</div>
            <div className="flex-1 min-w-0">
              <p className="text-[#E0AD66] text-sm font-semibold truncate">{ADMIN_EMAIL}</p>
              <p className="text-[#6E6480] text-xs">{t('direct_access')}</p>
            </div>
          </div>
        </div>

        {/* Right col — invited list with codes */}
        <div>
          <h2 className="text-[#8B7FA8] text-[11px] font-semibold tracking-widest mb-3">{t('generated_lbl')} ({invited.length})</h2>
          {invited.length === 0
            ? <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl lg:rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">🌱</div>
                <p className="text-[#4A3F5C] text-sm">{t('no_invited').split('\n').map((l, i) => i > 0 ? <><br/>{l}</> : l)}</p>
              </div>
            : <div className="flex flex-col gap-3">
                {invited.map(e => {
                  const code = genCode(e);
                  const isCopied = copied === e;
                  return (
                    <div key={e} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3.5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[rgba(90,158,111,0.12)] border-2 border-[rgba(90,158,111,0.25)] flex items-center justify-center text-xs text-[#5A9E6F] font-bold shrink-0">✓</div>
                        <p className="text-[#C7BCDA] text-sm font-medium flex-1 min-w-0 truncate">{e}</p>
                        {confirmDelete === e
                          ? <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => revoke(e)} className="bg-[rgba(196,75,75,0.15)] border border-[rgba(196,75,75,0.3)] rounded-lg text-[#E07070] text-[11px] py-1 px-2.5 font-semibold cursor-pointer">{t('revoke_btn')}</button>
                              <button onClick={() => setConfirmDelete(null)} className="bg-transparent border border-white/10 rounded-lg text-[#6E6480] text-[11px] py-1 px-2 cursor-pointer"><X size={12}/></button>
                            </div>
                          : <button onClick={() => setConfirmDelete(e)} className="text-[#6E6480] hover:text-[#E07070] cursor-pointer transition-all shrink-0 p-1"><Trash2 size={14}/></button>
                        }
                      </div>
                      <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-3 py-2.5">
                        <span className="font-['Space_Grotesk'] text-[#E0AD66] text-lg font-bold tracking-[3px] flex-1">{code}</span>
                        <button
                          onClick={() => copyCode(e, code)}
                          className={`rounded-lg text-xs py-1.5 px-3 font-semibold cursor-pointer transition-all shrink-0 border ${isCopied ? 'bg-[rgba(90,158,111,0.15)] border-[rgba(90,158,111,0.4)] text-[#5A9E6F]' : 'bg-[rgba(224,173,102,0.12)] border-[rgba(224,173,102,0.3)] text-[#E0AD66] hover:bg-[rgba(224,173,102,0.2)]'}`}
                        >
                          {isCopied ? t('copied_btn') : t('copy_btn')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
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
        <h2 className="font-['Fraunces'] text-[#F3EFE6] text-2xl font-semibold mb-5">{t('modal_title')}</h2>
        <input value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onSave(value.trim()); }}
          className="w-full bg-white/[0.07] border border-white/20 focus:border-[#E0AD66] rounded-xl text-[#F3EFE6] text-base py-3.5 px-4 outline-none transition-all mb-4" autoFocus/>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-[#8B7FA8] text-sm font-semibold cursor-pointer hover:bg-white/10 transition-all">{t('cancel_btn')}</button>
          <button onClick={() => value.trim() && onSave(value.trim())} className="flex-[2] py-3 rounded-xl bg-[#E0AD66] text-[#2A2235] font-bold text-sm cursor-pointer hover:bg-[#d49e55] transition-all">{t('save_btn')}</button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
type View = 'home' | 'oracle' | 'routines' | 'routine-summary' | 'exercise' | 'rituals' | 'ritual-detail' | 'admin';

export default function App() {
  const [lang, toggleLang] = useLang();
  const [email, setEmail] = useState<string>(() => lsGet('email', ''));
  const isAdmin = email === ADMIN_EMAIL;
  const logout = () => { lsSet('email', ''); setEmail(''); };

  const bootData = boot();
  const [name, setName] = useState(bootData.name);
  const [day] = useState(bootData.day);
  const [streak, setStreak] = useState(bootData.streak);
  const [lastComplete, setLastComplete] = useState(bootData.lastComplete);
  const [today] = useState(bootData.today);
  const [yesterday] = useState(bootData.yesterday);

  const [editing, setEditing] = useState(false);
  const [view, setView] = useState<View>('home');
  const [selectedPhase, setSelectedPhase] = useState(getPhase(bootData.day).id);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [ritual, setRitual] = useState<Ritual | null>(null);
  const [completedRituals, setCompletedRituals] = useState<Set<string>>(new Set(['equinoccio']));
  const [ritualSteps, setRitualSteps] = useState<Record<string, Set<number>>>({});

  if (!email) return <EmailLogin onLogin={e => setEmail(e)}/>;
  if (!name) return <Setup onSave={n => { setName(n); lsSet('name', n); }}/>;

  const registerWorkout = () => {
    const todayStr = getTodayStr();
    if (lastComplete === todayStr) return;
    const newStreak = lastComplete === yesterday ? streak + 1 : 1;
    setStreak(newStreak); setLastComplete(todayStr);
    lsSet('streak', newStreak); lsSet('last_complete', todayStr);
  };

  const goRoutine = (id: string) => { setSelectedPhase(id); setView('routine-summary'); };
  const openExercise = (idx: number) => { setExerciseIdx(idx); setView('exercise'); };
  const routineDone = lastComplete === today;

  const sidebarTab: Tab = ({ home:'home', oracle:'oracle', routines:'routines', 'routine-summary':'routines', exercise:'routines', rituals:'rituals', 'ritual-detail':'rituals', admin:'admin' } as Record<View,Tab>)[view];

  const navTo = (tab: Tab) => {
    if (tab === 'home') setView('home');
    else if (tab === 'oracle') setView('oracle');
    else if (tab === 'routines') setView('routines');
    else if (tab === 'rituals') setView('rituals');
    else if (tab === 'admin') setView('admin');
  };

  return (
    <div className="h-screen flex bg-[#0D0A18] overflow-hidden">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:h-full lg:shrink-0 border-r border-white/[0.07]">
        <Sidebar active={sidebarTab} onNav={navTo} isAdmin={isAdmin} name={name} streak={streak} day={day} onLogout={logout} onEditName={() => setEditing(true)} onToggleLang={toggleLang} lang={lang}/>
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
          <RitualDetailScreen ritual={ritual} completedSteps={ritualSteps[ritual.id] || new Set()} back={() => setView('rituals')}
            toggle={i => setRitualSteps(m => { const s = new Set(m[ritual.id]||[]); s.has(i)?s.delete(i):s.add(i); return {...m,[ritual.id]:s}; })}
            complete={() => { setCompletedRituals(s => new Set([...s,ritual.id])); setView('rituals'); }}
          />
        )}
        {view === 'admin' && <AdminPanel onLogout={logout}/>}
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav active={sidebarTab} onNav={navTo} isAdmin={isAdmin} onToggleLang={toggleLang} lang={lang}/>

      {editing && (
        <EditNameModal currentName={name} onSave={n => { setName(n); lsSet('name', n); setEditing(false); }} onCancel={() => setEditing(false)}/>
      )}
    </div>
  );
}
