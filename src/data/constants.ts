// Admin email - hardcoded for whitelist management
export const ADMIN_EMAIL = 'stephanybarreto38@gmail.com';

// Date utilities
export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function daysBetween(a: string, b: string): number {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export interface Phase {
  id: string;
  name: string;
  theme: string;
  days: number[];
  c: string;
  cl: string;
  cb: string;
  el: string;
  en: string;
  int: string;
  om: string;
}

export const PHASES: Phase[] = [
  { id: 'raiz', name: 'Chakra Raíz', theme: 'Presencia y Arraigo', days: [1, 2, 3, 4], c: '#C44B4B', cl: 'rgba(196,75,75,0.15)', cb: 'rgba(196,75,75,0.4)', el: '🌍', en: 'Tierra', int: 'Me siento segura y arraigada en la tierra.', om: 'Tu cuerpo es tu hogar más sagrado. Esta semana, vuelve a él.' },
  { id: 'sacro', name: 'Chakra Sacro', theme: 'Creatividad y Flujo', days: [5, 6, 7, 8], c: '#E07A3A', cl: 'rgba(224,122,58,0.15)', cb: 'rgba(224,122,58,0.4)', el: '🌊', en: 'Agua', int: 'Fluyo con la vida con gracia y alegría.', om: 'Tu creatividad no necesita permiso. Solo movimiento.' },
  { id: 'solar', name: 'Chakra Solar', theme: 'Poder y Confianza', days: [9, 10, 11, 12, 13], c: '#D9AE3F', cl: 'rgba(217,174,63,0.15)', cb: 'rgba(217,174,63,0.4)', el: '🔥', en: 'Fuego', int: 'Activo mi poder personal. Soy suficiente.', om: 'Tu fuego interior te pide que actúes sin permiso.' },
  { id: 'corazon', name: 'Chakra Corazón', theme: 'Amor y Compasión', days: [14, 15, 16, 17], c: '#5A9E6F', cl: 'rgba(90,158,111,0.15)', cb: 'rgba(90,158,111,0.4)', el: '💚', en: 'Aire', int: 'Me abro al amor. Me doy lo que doy a los demás.', om: 'La compasión empieza en ti.' },
  { id: 'garganta', name: 'Chakra Garganta', theme: 'Expresión y Verdad', days: [18, 19, 20, 21], c: '#4A90C4', cl: 'rgba(74,144,196,0.15)', cb: 'rgba(74,144,196,0.4)', el: '🌀', en: 'Éter', int: 'Mi voz importa. Digo mi verdad con amor.', om: 'Lo que guardas en silencio también pesa.' },
  { id: 'tojo', name: 'Tercer Ojo', theme: 'Intuición y Visión', days: [22, 23, 24, 25], c: '#7B68C8', cl: 'rgba(123,104,200,0.15)', cb: 'rgba(123,104,200,0.4)', el: '💫', en: 'Luz', int: 'Confío en mi intuición.', om: 'Tu intuición habla en susurros.' },
  { id: 'corona', name: 'Chakra Corona', theme: 'Trascendencia y Cierre', days: [26, 27, 28, 29, 30], c: '#A87DC8', cl: 'rgba(168,125,200,0.15)', cb: 'rgba(168,125,200,0.4)', el: '✨', en: 'Cosmos', int: 'Soy parte de algo más grande.', om: 'Este mes fue un ritual completo.' },
];

export function getPhase(day: number): Phase {
  return PHASES.find(p => p.days.includes(day)) || PHASES[0];
}

export const SONGS: Record<string, string> = {
  raiz: 'Roots – Imagine Dragons',
  sacro: 'River – Leon Bridges',
  solar: 'Confident – Demi Lovato',
  corazon: 'What a Wonderful World – L. Armstrong',
  garganta: 'Brave – Sara Bareilles',
  tojo: 'Breathe – Telepopmusik',
  corona: 'Here Comes the Sun – The Beatles',
};

export interface DayData {
  msg: string;
  m: { d: string; txt: string };
  md: { d: string; txt: string };
  n: { d: string; txt: string };
}

export const DAILY_DATA: DayData[] = [
  { msg: 'Soy tierra. Soy estable. Soy hogar.', m: { d: '2 min', txt: 'Párate descalza. 5 respiraciones profundas sintiendo la tierra.' }, md: { d: '1 min', txt: 'Toca algo de la naturaleza: una piedra, madera, tierra.' }, n: { d: '5 min', txt: 'Escribe: ¿qué personas o lugares me hacen sentir en casa?' } },
  { msg: 'Mis raíces me sostienen incluso en la tormenta.', m: { d: '3 min', txt: 'Postura montaña: siente el peso de tu cuerpo sobre la tierra.' }, md: { d: '2 min', txt: 'Di 5 veces: "Estoy aquí. Estoy segura. Estoy bien."' }, n: { d: '4 min', txt: 'Lista 3 cosas que te dieron seguridad hoy.' } },
  { msg: 'Confío en el ritmo de mi cuerpo.', m: { d: '2 min', txt: 'Masajea las plantas de los pies antes de levantarte.' }, md: { d: 'sin t.', txt: 'Come algo con plena atención. Sin pantallas.' }, n: { d: '5 min', txt: '¿En qué momento me sentí más arraigada hoy?' } },
  { msg: 'Hoy me permito descansar sin culpa.', m: { d: '3 min', txt: 'Inhala rojo. Exhala tensión. 10 respiraciones de raíz.' }, md: { d: '3 min', txt: 'Camina lento y nota el contacto de cada pie con el piso.' }, n: { d: '5 min', txt: 'Escribe qué necesitas soltar para sentirte más liviana.' } },
  { msg: 'Soy agua. Me adapto y fluyo.', m: { d: '2 min', txt: 'Círculos de cadera suaves. Despierta la energía creativa.' }, md: { d: '2 min', txt: 'Observa algo bello sin sacarle foto. Solo con los ojos.' }, n: { d: '5 min', txt: '¿Qué me da placer genuino y no me permito con frecuencia?' } },
  { msg: 'Mi creatividad es sagrada y sin límites.', m: { d: '3 min', txt: 'Pon música y muévete libremente. Sin coreografía, sin juicio.' }, md: { d: '3 min', txt: 'Dibuja lo que sea con tu mano no dominante.' }, n: { d: '4 min', txt: '¿Qué emoción sentí hoy que no expresé?' } },
  { msg: 'Hoy me permito sentir sin juzgar.', m: { d: '1 min', txt: 'Toma agua con conciencia.' }, md: { d: 'sin t.', txt: 'Haz algo diferente a lo habitual.' }, n: { d: '5 min', txt: '¿Cuándo fluí sin esfuerzo hoy?' } },
  { msg: 'El placer es una práctica espiritual.', m: { d: '1 min', txt: 'Huele algo rico: café, una fruta, aceite esencial.' }, md: { d: '1 min', txt: 'Sonríe sin razón por 20 segundos.' }, n: { d: '5 min', txt: 'Lista 5 cosas que disfrutas con el cuerpo, no la mente.' } },
  { msg: 'Soy fuego. Actúo con decisión.', m: { d: '2 min', txt: 'Manos en el plexo solar. Di: "Hoy actúo."' }, md: { d: '30 s', txt: 'Toma una decisión pequeña en menos de 30 segundos.' }, n: { d: '4 min', txt: '¿En qué momento de hoy sentí mi poder?' } },
  { msg: 'Mi poder no amenaza, ilumina.', m: { d: '2 min', txt: 'Respiración de fuego: 20 exhalos cortos y fuertes.' }, md: { d: '3 min', txt: 'Envía un mensaje de reconocimiento a alguien.' }, n: { d: '5 min', txt: '¿Qué haría si no tuviera miedo al juicio de otros?' } },
  { msg: 'Hoy tomo decisiones sin buscar aprobación.', m: { d: '2 min', txt: 'Párate derecha. Hombros atrás. Respira desde el centro.' }, md: { d: 'sin t.', txt: 'Di "no" a algo que no quieras hacer hoy.' }, n: { d: '4 min', txt: '¿Qué logré hoy que no creía posible?' } },
  { msg: 'Confío en mi criterio y mi instinto.', m: { d: '2 min', txt: 'Manos en el abdomen. Siente el calor. Di: soy capaz.' }, md: { d: '3 min', txt: '1 decisión que puedes tomar hoy sin pedir permiso.' }, n: { d: '5 min', txt: '¿En qué momento de hoy confié plenamente en mí?' } },
  { msg: 'Soy la autora de mi propia historia.', m: { d: '3 min', txt: 'Visualiza una llama dorada en tu plexo solar.' }, md: { d: 'sin t.', txt: 'Acepta un cumplido hoy sin restar mérito.' }, n: { d: '6 min', txt: '¿Qué aprendí sobre mi poder esta semana?' } },
  { msg: 'Soy amor. Me permito recibir.', m: { d: '2 min', txt: 'Mano derecha en el corazón. 5 respiraciones de amor.' }, md: { d: '1 min', txt: 'Envía amor mental a alguien difícil.' }, n: { d: '5 min', txt: 'Escribe: "Lo que más me gusta de mí es..."' } },
  { msg: 'Mi corazón tiene espacio para todo.', m: { d: '1 min', txt: 'Di en voz alta: "Merezco amor sin condiciones."' }, md: { d: 'sin t.', txt: 'Recibe un halago sin minimizarlo.' }, n: { d: '4 min', txt: '5 cosas que te agradeces a ti misma hoy.' } },
  { msg: 'Hoy me trato con la ternura que merezco.', m: { d: '2 min', txt: 'Abrazo de mariposa: palmea suave tu pecho.' }, md: { d: 'sin t.', txt: 'Haz algo amable por ti.' }, n: { d: '5 min', txt: '¿Qué le daría a mi mejor amiga que no me doy a mí?' } },
  { msg: 'El amor propio no es egoísmo, es práctica.', m: { d: '3 min', txt: 'Visualiza luz verde que sale de tu pecho.' }, md: { d: '2 min', txt: 'Perdona mentalmente algo pequeño.' }, n: { d: '5 min', txt: '¿Cómo me amoré hoy?' } },
  { msg: 'Soy voz. Mi verdad tiene peso.', m: { d: '2 min', txt: 'Humming: zumba "mmm" 5 veces largas.' }, md: { d: 'sin t.', txt: 'Di lo que piensas en la próxima conversación.' }, n: { d: '5 min', txt: '¿Qué no dije hoy que necesitaba decir?' } },
  { msg: 'Hoy digo lo que pienso con claridad.', m: { d: '3 min', txt: 'Lee en voz alta algo que te inspire.' }, md: { d: 'sin t.', txt: 'Expresa una opinión hoy sin disculparte.' }, n: { d: '6 min', txt: 'Escribe una carta que no vas a enviar.' } },
  { msg: 'Mi expresión crea realidad.', m: { d: '3 min', txt: 'Canta en la ducha o en tu cuarto.' }, md: { d: '1 min', txt: 'Nombra cómo te sientes exactamente.' }, n: { d: '5 min', txt: '¿Qué quiero que el mundo sepa de mí?' } },
  { msg: 'Comunico desde el amor, no el miedo.', m: { d: '2 min', txt: 'Di 3 verdades sobre ti que normalmente callas.' }, md: { d: 'sin t.', txt: 'Escucha activamente sin preparar respuesta.' }, n: { d: '4 min', txt: '¿Mi voz de hoy fue auténtica o complaciente?' } },
  { msg: 'Soy visión. Veo con claridad interior.', m: { d: '5 min', txt: 'Siéntate en silencio. Sin teléfono.' }, md: { d: '2 min', txt: 'Escribe la primera impresión sin analizarla.' }, n: { d: '4 min', txt: 'Anota cualquier imagen mental que hayas tenido hoy.' } },
  { msg: 'Confío en los mensajes de mi cuerpo.', m: { d: '2 min', txt: 'Con ojos cerrados, dibuja en el aire lo que sientes.' }, md: { d: 'sin t.', txt: 'Confía en una corazonada y actúa.' }, n: { d: '5 min', txt: '¿Cuándo ignoré mi intuición hoy?' } },
  { msg: 'Mi intuición es un regalo, no un error.', m: { d: '1 min', txt: 'Frota suavemente el entrecejo en círculos.' }, md: { d: '2 min', txt: 'Observa una situación desde otro punto de vista.' }, n: { d: '5 min', txt: '¿Qué patrón estás viendo en tu vida?' } },
  { msg: 'Hoy observo antes de reaccionar.', m: { d: '4 min', txt: 'Visualiza cómo quieres que sea tu día.' }, md: { d: '1 min', txt: 'Pregúntate: ¿qué siento, más allá de lo que pienso?' }, n: { d: '5 min', txt: '¿Qué supe hoy que no sabías que ya sabías?' } },
  { msg: 'Soy luz. Soy parte del todo.', m: { d: '5 min', txt: 'Cinco minutos de silencio total.' }, md: { d: '2 min', txt: 'Mira el cielo por 2 minutos sin pensar.' }, n: { d: '8 min', txt: '¿Qué aprendí de mí en estos 30 días?' } },
  { msg: 'Confío en el plan del universo para mí.', m: { d: '5 min', txt: 'Medita sin ninguna intención.' }, md: { d: '1 min', txt: 'Suelta una expectativa sobre este día.' }, n: { d: '6 min', txt: 'Gratitud: 3 cosas que no elegiste pero te formaron.' } },
  { msg: 'Hoy suelto el control y confío.', m: { d: '4 min', txt: 'Inhala expansión, exhala lo que no eres tú.' }, md: { d: '5 min', txt: 'Haz algo sin propósito.' }, n: { d: '7 min', txt: '¿En qué me convertí silenciosamente este mes?' } },
  { msg: 'Soy suficiente exactamente como soy.', m: { d: '5 min', txt: 'Visualiza luz blanca entrando por la coronilla.' }, md: { d: '2 min', txt: 'Recuerda una versión anterior de ti. Envíale amor.' }, n: { d: '8 min', txt: 'Carta a tu yo de hace un mes.' } },
  { msg: 'Este mes me transformé en silencio.', m: { d: '7 min', txt: 'Siéntate en silencio. Este mes fue un ritual.' }, md: { d: 'sin t.', txt: 'Celebra tu llegada al día 30 como elijas.' }, n: { d: '10 min', txt: 'Escribe tu intención para el próximo ciclo.' } },
];

export function getDayData(day: number): DayData {
  return DAILY_DATA[day - 1] || DAILY_DATA[0];
}

export interface ExerciseStep {
  name: string;
  reps: string;
  sub: string;
  desc: string;
}

export interface Routine {
  title: string;
  dur: string;
  steps: ExerciseStep[];
}

export const ROUTINES: Record<string, Routine> = {
  raiz: { title: 'Rutina de Raíz', dur: '17 min', steps: [
    { name: 'Respiración abdominal', reps: '3 minutos', sub: 'Activación de tierra', desc: 'Siéntate recta. Una mano en abdomen, otra en pecho. Inhala 4, sostén 2, exhala 6.' },
    { name: 'Sentadillas profundas', reps: '3 × 12 reps', sub: 'Fuerza de piernas', desc: 'Pies al ancho de caderas. Baja hasta muslos paralelos. Empuja desde los talones.' },
    { name: 'Puente de glúteos', reps: '3 × 10 reps', sub: 'Activación glútea', desc: 'Boca arriba, rodillas flexionadas. Eleva la cadera, sostén 2 seg.' },
    { name: 'Estocadas alternas', reps: '2 × 8 por pierna', sub: 'Equilibrio y fuerza', desc: 'Paso largo al frente, baja la rodilla trasera sin tocar el piso.' },
    { name: 'Postura del árbol', reps: '45 seg por lado', sub: 'Equilibrio y raíz', desc: 'De pie, pie en el interior del muslo contrario. Junta palmas.' },
    { name: 'Meditación de raíz', reps: '5 minutos', sub: 'Integración', desc: 'Visualiza raíces rojas desde tu coxis hacia la tierra.' },
  ]},
  sacro: { title: 'Rutina Sacra', dur: '22 min', steps: [
    { name: 'Círculos de cadera', reps: '2 min por sentido', sub: 'Apertura sacra', desc: 'De pie, manos en caderas. Círculos amplios y fluidos.' },
    { name: 'Paloma preparatoria', reps: '90 seg por lado', sub: 'Apertura de cadera', desc: 'Desde cuatro puntos, desliza la rodilla hacia la mano del mismo lado.' },
    { name: 'Elevaciones de cadera', reps: '3 × 15 reps', sub: 'Fuerza y movilidad', desc: 'Boca arriba, pies en el piso. Eleva la cadera apretando glúteos.' },
    { name: 'Estiramiento de mariposa', reps: '3 minutos', sub: 'Apertura profunda', desc: 'Sentada, junta las plantas de los pies. Inclínate suavemente.' },
    { name: 'Movimiento ondulatorio', reps: '3 minutos', sub: 'Expresión creativa', desc: 'Ojos cerrados. Deja que el cuerpo se mueva libremente.' },
    { name: 'Meditación sacra', reps: '7 minutos', sub: 'Integración', desc: 'Luz naranja pulsando en tu zona sacra.' },
  ]},
  solar: { title: 'Solar Plexus Flow', dur: '20 min', steps: [
    { name: 'Respiración de fuego', reps: '3 minutos', sub: 'Activación de poder', desc: 'Exhala con fuerza contrayendo el abdomen. 1 exhalo por segundo.' },
    { name: 'Plank de antebrazos', reps: '3 × 45 seg', sub: 'Fuerza de núcleo', desc: 'Antebrazos en el suelo. Cuerpo en línea recta.' },
    { name: 'Mountain climbers', reps: '3 × 30 seg', sub: 'Cardio de fuego', desc: 'Desde plank, lleva rodillas al pecho alternando rápido.' },
    { name: 'Russian twists', reps: '3 × 20 reps', sub: 'Rotación de poder', desc: 'Sentada, tronco a 45°. Gira el torso de lado a lado.' },
    { name: 'Core flow continuo', reps: '2 minutos', sub: 'Flujo sin pausa', desc: '5 crunches → 5 elevaciones de piernas → 5 bicicleta.' },
    { name: 'Meditación del guerrero', reps: '7 minutos', sub: 'Integración', desc: 'Llama dorada en el plexo solar.' },
  ]},
  corazon: { title: 'Rutina de Corazón', dur: '22 min', steps: [
    { name: 'Apertura de pecho suave', reps: '3 minutos', sub: 'Apertura inicial', desc: 'Entrelaza los dedos detrás. Abre el pecho al exhalar.' },
    { name: 'Cobra suave', reps: '5 × 30 seg', sub: 'Extensión de espalda', desc: 'Eleva el torso usando la espalda. Cuello largo.' },
    { name: 'Postura del camello', reps: '3 × 20 seg', sub: 'Apertura profunda', desc: 'Arrodillada, manos a los talones. Empuja cadera adelante.' },
    { name: 'Push-ups con manos abiertas', reps: '3 × 10 reps', sub: 'Fuerza de apertura', desc: 'Manos más separadas que los hombros. Codos a 45°.' },
    { name: 'Niño con brazos extendidos', reps: '3 minutos', sub: 'Rendición amorosa', desc: 'Torso hacia adelante, brazos extendidos. Frente al suelo.' },
    { name: 'Meditación de corazón', reps: '7 minutos', sub: 'Integración', desc: 'Luz verde irradiando desde el centro de tu pecho.' },
  ]},
  garganta: { title: 'Rutina de Garganta', dur: '20 min', steps: [
    { name: 'Rolls de cuello', reps: '2 minutos suaves', sub: 'Liberación cervical', desc: 'Oreja al hombro. Rueda lentamente de un lado al otro.' },
    { name: 'Apertura de hombros', reps: '3 minutos', sub: 'Hombros libres', desc: 'Con toalla, lleva los brazos por encima alternando lados.' },
    { name: 'Postura del pez', reps: '3 × 30 seg', sub: 'Apertura de garganta', desc: 'Apoya los codos y eleva el pecho arqueando la espalda.' },
    { name: 'Humming — zumbido', reps: '5 minutos', sub: 'Vibración de expresión', desc: 'Exhala emitiendo "mmmmm" sostenido. Siente la vibración.' },
    { name: 'Estiramiento de trapecio', reps: '90 seg por lado', sub: 'Liberación final', desc: 'Oreja al hombro. Presión muy suave sobre la sien.' },
    { name: 'Meditación de la voz', reps: '5 minutos', sub: 'Integración', desc: 'Luz azul en tu garganta. Tu verdad se libera.' },
  ]},
  tojo: { title: 'Rutina del Tercer Ojo', dur: '22 min', steps: [
    { name: 'Postura del águila', reps: '60 seg por lado', sub: 'Enfoque y equilibrio', desc: 'Cruza el muslo sobre el otro. Entrelaza los antebrazos.' },
    { name: 'Balanceo en un pie', reps: '90 seg por lado', sub: 'Presencia plena', desc: 'Eleva un pie del suelo. Cierra los ojos.' },
    { name: 'Niño con frente en suelo', reps: '3 minutos', sub: 'Introspección', desc: 'El entrecejo toca el suelo, activando el tercer ojo.' },
    { name: 'Piernas en la pared', reps: '5 minutos', sub: 'Inversión restaurativa', desc: 'Espalda en el suelo, piernas rectas contra la pared.' },
    { name: 'Nadi Shodhana', reps: '5 minutos', sub: 'Equilibrio hemisférico', desc: 'Respiración alterna: tapa fosa derecha, inhala izquierda.' },
    { name: 'Meditación de visión', reps: '7 minutos', sub: 'Activación', desc: 'Luz índigo pulsando en tu entrecejo.' },
  ]},
  corona: { title: 'Rutina de Corona', dur: '30 min', steps: [
    { name: 'Saludo al sol completo', reps: '5 rondas lentas', sub: 'Activación total', desc: 'Inhala al extender, exhala al doblar. Flujo entre posturas.' },
    { name: 'Sukhasana con elongación', reps: '5 minutos', sub: 'Apertura de corona', desc: 'Piernas cruzadas. Inhala elongando la columna hacia arriba.' },
    { name: 'Postura del niño profunda', reps: '3 minutos', sub: 'Rendición total', desc: 'Rodillas abiertas, brazos extendidos. Frente al suelo.' },
    { name: 'Pranayama 4-7-8', reps: '5 minutos', sub: 'Sistema nervioso', desc: 'Inhala 4, sostén 7, exhala 8.' },
    { name: 'Escaneo corporal', reps: '5 minutos', sub: 'Integración somática', desc: 'Recorre el cuerpo de pies a coronilla. Suelta tensión.' },
    { name: 'Meditación de corona', reps: '10 minutos', sub: 'Cierre del ciclo', desc: 'Luz blanca dorada entra por tu coronilla.' },
  ]},
};

export interface Ritual {
  id: string;
  name: string;
  sub: string;
  dur: string;
  c: string;
  bg: string;
  status: 'available' | 'upcoming' | 'completed';
  daysUntil?: number;
  steps: { n: string; i: string }[];
}

export const RITUALS: Ritual[] = [
  { id: 'luna-nueva', name: 'Luna Nueva', sub: 'Ritual de Siembra', dur: '15 min', c: '#6B6FA0', bg: 'rgba(107,111,160,0.12)', status: 'upcoming', daysUntil: 12, steps: [
    { n: 'Encendido del espacio', i: 'Enciende una vela, respira profundo 3 veces.' },
    { n: 'Movimiento de raíz', i: '5 min de sentadillas lentas.' },
    { n: 'Escritura de intención', i: 'Escribe una intención para los próximos 28 días.' },
    { n: 'Cierre', i: '"Soy la tierra fértil donde mis intenciones germinan."' },
  ]},
  { id: 'luna-llena', name: 'Luna Llena', sub: 'Ritual de Liberación', dur: '20 min', c: '#A8A6C9', bg: 'rgba(168,166,201,0.12)', status: 'available', steps: [
    { n: 'Movimiento de liberación', i: '8 min de apertura de pecho y torsiones.' },
    { n: 'Gratitud y lista de soltar', i: '3 cosas que agradeces, 1 cosa que sueltas.' },
    { n: 'Ritual simbólico', i: 'Rompe el papel donde escribiste lo que sueltas.' },
    { n: 'Meditación', i: '5 min visualizando la luna llena.' },
  ]},
  { id: 'equinoccio', name: 'Equinoccio', sub: 'Ritual de Equilibrio', dur: '20 min', c: '#9C7E63', bg: 'rgba(156,126,99,0.12)', status: 'completed', steps: [
    { n: 'Postura del árbol', i: '6 min de equilibrio alternando lados.' },
    { n: 'Journaling', i: '¿Qué área necesita más luz, cuál más descanso?' },
    { n: 'Nadi Shodhana', i: '5 min de respiración alterna.' },
    { n: 'Cierre', i: '"Honro mi luz y mi sombra."' },
  ]},
];

// Timer parsing utility
export function parseSeconds(reps: string): number {
  const r = reps.toLowerCase();
  const mC = r.match(/×\s*(\d+)\s*(min|seg)/);
  if (mC) return mC[2].startsWith('min') ? +mC[1] * 60 : +mC[1];
  const mM = r.match(/(\d+)\s*min/);
  if (mM) return +mM[1] * 60;
  const mS = r.match(/(\d+)\s*seg/);
  if (mS) return +mS[1];
  return 0;
}

export function hasSide(reps: string): boolean {
  return /por lado/i.test(reps);
}
