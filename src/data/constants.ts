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
  name: string; nameEn: string;
  theme: string; themeEn: string;
  days: number[];
  c: string; cl: string; cb: string;
  el: string;
  en: string; enEn: string;
  int: string; intEn: string;
  om: string; omEn: string;
}

export const PHASES: Phase[] = [
  { id: 'raiz',     name: 'Chakra Raíz',     nameEn: 'Root Chakra',          theme: 'Presencia y Arraigo',    themeEn: 'Presence & Grounding',    days: [1,2,3,4],       c: '#C44B4B', cl: 'rgba(196,75,75,0.15)',   cb: 'rgba(196,75,75,0.4)',   el: '🌍', en: 'Tierra', enEn: 'Earth',  int: 'Me siento segura y arraigada en la tierra.',     intEn: 'I feel safe and rooted in the earth.',          om: 'Tu cuerpo es tu hogar más sagrado. Esta semana, vuelve a él.',             omEn: 'Your body is your most sacred home. This week, return to it.' },
  { id: 'sacro',    name: 'Chakra Sacro',     nameEn: 'Sacral Chakra',        theme: 'Creatividad y Flujo',    themeEn: 'Creativity & Flow',        days: [5,6,7,8],       c: '#E07A3A', cl: 'rgba(224,122,58,0.15)',  cb: 'rgba(224,122,58,0.4)',  el: '🌊', en: 'Agua',   enEn: 'Water',  int: 'Fluyo con la vida con gracia y alegría.',        intEn: 'I flow with life with grace and joy.',          om: 'Tu creatividad no necesita permiso. Solo movimiento.',                     omEn: 'Your creativity needs no permission. Only movement.' },
  { id: 'solar',    name: 'Chakra Solar',     nameEn: 'Solar Chakra',         theme: 'Poder y Confianza',      themeEn: 'Power & Confidence',       days: [9,10,11,12,13], c: '#D9AE3F', cl: 'rgba(217,174,63,0.15)', cb: 'rgba(217,174,63,0.4)', el: '🔥', en: 'Fuego',  enEn: 'Fire',   int: 'Activo mi poder personal. Soy suficiente.',      intEn: 'I activate my personal power. I am enough.',   om: 'Tu fuego interior te pide que actúes sin permiso.',                        omEn: 'Your inner fire asks you to act without permission.' },
  { id: 'corazon',  name: 'Chakra Corazón',   nameEn: 'Heart Chakra',         theme: 'Amor y Compasión',       themeEn: 'Love & Compassion',        days: [14,15,16,17],   c: '#5A9E6F', cl: 'rgba(90,158,111,0.15)',  cb: 'rgba(90,158,111,0.4)', el: '💚', en: 'Aire',   enEn: 'Air',    int: 'Me abro al amor. Me doy lo que doy a los demás.',intEn: 'I open to love. I give myself what I give to others.', om: 'La compasión empieza en ti.',                                        omEn: 'Compassion starts with you.' },
  { id: 'garganta', name: 'Chakra Garganta',  nameEn: 'Throat Chakra',        theme: 'Expresión y Verdad',     themeEn: 'Expression & Truth',       days: [18,19,20,21],   c: '#4A90C4', cl: 'rgba(74,144,196,0.15)',  cb: 'rgba(74,144,196,0.4)', el: '🌀', en: 'Éter',   enEn: 'Ether',  int: 'Mi voz importa. Digo mi verdad con amor.',       intEn: 'My voice matters. I speak my truth with love.', om: 'Lo que guardas en silencio también pesa.',                                omEn: 'What you keep in silence also weighs.' },
  { id: 'tojo',     name: 'Tercer Ojo',       nameEn: 'Third Eye',            theme: 'Intuición y Visión',     themeEn: 'Intuition & Vision',       days: [22,23,24,25],   c: '#7B68C8', cl: 'rgba(123,104,200,0.15)', cb: 'rgba(123,104,200,0.4)',el: '💫', en: 'Luz',    enEn: 'Light',  int: 'Confío en mi intuición.',                        intEn: 'I trust my intuition.',                        om: 'Tu intuición habla en susurros.',                                          omEn: 'Your intuition speaks in whispers.' },
  { id: 'corona',   name: 'Chakra Corona',    nameEn: 'Crown Chakra',         theme: 'Trascendencia y Cierre', themeEn: 'Transcendence & Closing',  days: [26,27,28,29,30],c: '#A87DC8', cl: 'rgba(168,125,200,0.15)', cb: 'rgba(168,125,200,0.4)',el: '✨', en: 'Cosmos', enEn: 'Cosmos', int: 'Soy parte de algo más grande.',                  intEn: 'I am part of something greater.',              om: 'Este mes fue un ritual completo.',                                         omEn: 'This month was a complete ritual.' },
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
  msg: string; msgEn: string;
  m: { d: string; txt: string; txtEn: string };
  md: { d: string; txt: string; txtEn: string };
  n: { d: string; txt: string; txtEn: string };
}

export const DAILY_DATA: DayData[] = [
  { msg: 'Soy tierra. Soy estable. Soy hogar.', msgEn: 'I am earth. I am stable. I am home.', m: { d: '2 min', txt: 'Párate descalza. 5 respiraciones profundas sintiendo la tierra.', txtEn: 'Stand barefoot. 5 deep breaths feeling the earth.' }, md: { d: '1 min', txt: 'Toca algo de la naturaleza: una piedra, madera, tierra.', txtEn: 'Touch something from nature: a stone, wood, earth.' }, n: { d: '5 min', txt: 'Escribe: ¿qué personas o lugares me hacen sentir en casa?', txtEn: 'Write: what people or places make me feel at home?' } },
  { msg: 'Mis raíces me sostienen incluso en la tormenta.', msgEn: 'My roots hold me even in the storm.', m: { d: '3 min', txt: 'Postura montaña: siente el peso de tu cuerpo sobre la tierra.', txtEn: 'Mountain pose: feel the weight of your body on the earth.' }, md: { d: '2 min', txt: 'Di 5 veces: "Estoy aquí. Estoy segura. Estoy bien."', txtEn: 'Say 5 times: "I am here. I am safe. I am well."' }, n: { d: '4 min', txt: 'Lista 3 cosas que te dieron seguridad hoy.', txtEn: 'List 3 things that gave you security today.' } },
  { msg: 'Confío en el ritmo de mi cuerpo.', msgEn: 'I trust the rhythm of my body.', m: { d: '2 min', txt: 'Masajea las plantas de los pies antes de levantarte.', txtEn: 'Massage the soles of your feet before getting up.' }, md: { d: 'sin t.', txt: 'Come algo con plena atención. Sin pantallas.', txtEn: 'Eat something with full attention. No screens.' }, n: { d: '5 min', txt: '¿En qué momento me sentí más arraigada hoy?', txtEn: 'At what moment did I feel most grounded today?' } },
  { msg: 'Hoy me permito descansar sin culpa.', msgEn: 'Today I allow myself to rest without guilt.', m: { d: '3 min', txt: 'Inhala rojo. Exhala tensión. 10 respiraciones de raíz.', txtEn: 'Inhale red. Exhale tension. 10 root breaths.' }, md: { d: '3 min', txt: 'Camina lento y nota el contacto de cada pie con el piso.', txtEn: 'Walk slowly and notice each foot\'s contact with the floor.' }, n: { d: '5 min', txt: 'Escribe qué necesitas soltar para sentirte más liviana.', txtEn: 'Write what you need to release to feel lighter.' } },
  { msg: 'Soy agua. Me adapto y fluyo.', msgEn: 'I am water. I adapt and flow.', m: { d: '2 min', txt: 'Círculos de cadera suaves. Despierta la energía creativa.', txtEn: 'Gentle hip circles. Awaken creative energy.' }, md: { d: '2 min', txt: 'Observa algo bello sin sacarle foto. Solo con los ojos.', txtEn: 'Observe something beautiful without taking a photo. Just with your eyes.' }, n: { d: '5 min', txt: '¿Qué me da placer genuino y no me permito con frecuencia?', txtEn: 'What gives me genuine pleasure that I rarely allow myself?' } },
  { msg: 'Mi creatividad es sagrada y sin límites.', msgEn: 'My creativity is sacred and limitless.', m: { d: '3 min', txt: 'Pon música y muévete libremente. Sin coreografía, sin juicio.', txtEn: 'Put on music and move freely. No choreography, no judgment.' }, md: { d: '3 min', txt: 'Dibuja lo que sea con tu mano no dominante.', txtEn: 'Draw anything with your non-dominant hand.' }, n: { d: '4 min', txt: '¿Qué emoción sentí hoy que no expresé?', txtEn: 'What emotion did I feel today that I did not express?' } },
  { msg: 'Hoy me permito sentir sin juzgar.', msgEn: 'Today I allow myself to feel without judgment.', m: { d: '1 min', txt: 'Toma agua con conciencia.', txtEn: 'Drink water mindfully.' }, md: { d: 'sin t.', txt: 'Haz algo diferente a lo habitual.', txtEn: 'Do something different from your routine.' }, n: { d: '5 min', txt: '¿Cuándo fluí sin esfuerzo hoy?', txtEn: 'When did I flow effortlessly today?' } },
  { msg: 'El placer es una práctica espiritual.', msgEn: 'Pleasure is a spiritual practice.', m: { d: '1 min', txt: 'Huele algo rico: café, una fruta, aceite esencial.', txtEn: 'Smell something delicious: coffee, a fruit, essential oil.' }, md: { d: '1 min', txt: 'Sonríe sin razón por 20 segundos.', txtEn: 'Smile for no reason for 20 seconds.' }, n: { d: '5 min', txt: 'Lista 5 cosas que disfrutas con el cuerpo, no la mente.', txtEn: 'List 5 things you enjoy with your body, not your mind.' } },
  { msg: 'Soy fuego. Actúo con decisión.', msgEn: 'I am fire. I act with decision.', m: { d: '2 min', txt: 'Manos en el plexo solar. Di: "Hoy actúo."', txtEn: 'Hands on solar plexus. Say: "Today I act."' }, md: { d: '30 s', txt: 'Toma una decisión pequeña en menos de 30 segundos.', txtEn: 'Make a small decision in less than 30 seconds.' }, n: { d: '4 min', txt: '¿En qué momento de hoy sentí mi poder?', txtEn: 'At what moment today did I feel my power?' } },
  { msg: 'Mi poder no amenaza, ilumina.', msgEn: 'My power does not threaten, it illuminates.', m: { d: '2 min', txt: 'Respiración de fuego: 20 exhalos cortos y fuertes.', txtEn: 'Fire breathing: 20 short, strong exhales.' }, md: { d: '3 min', txt: 'Envía un mensaje de reconocimiento a alguien.', txtEn: 'Send a message of recognition to someone.' }, n: { d: '5 min', txt: '¿Qué haría si no tuviera miedo al juicio de otros?', txtEn: 'What would I do if I weren\'t afraid of others\' judgment?' } },
  { msg: 'Hoy tomo decisiones sin buscar aprobación.', msgEn: 'Today I make decisions without seeking approval.', m: { d: '2 min', txt: 'Párate derecha. Hombros atrás. Respira desde el centro.', txtEn: 'Stand tall. Shoulders back. Breathe from your center.' }, md: { d: 'sin t.', txt: 'Di "no" a algo que no quieras hacer hoy.', txtEn: 'Say "no" to something you don\'t want to do today.' }, n: { d: '4 min', txt: '¿Qué logré hoy que no creía posible?', txtEn: 'What did I achieve today that I didn\'t think was possible?' } },
  { msg: 'Confío en mi criterio y mi instinto.', msgEn: 'I trust my judgment and my instinct.', m: { d: '2 min', txt: 'Manos en el abdomen. Siente el calor. Di: soy capaz.', txtEn: 'Hands on abdomen. Feel the warmth. Say: I am capable.' }, md: { d: '3 min', txt: '1 decisión que puedes tomar hoy sin pedir permiso.', txtEn: '1 decision you can make today without asking permission.' }, n: { d: '5 min', txt: '¿En qué momento de hoy confié plenamente en mí?', txtEn: 'At what moment today did I fully trust myself?' } },
  { msg: 'Soy la autora de mi propia historia.', msgEn: 'I am the author of my own story.', m: { d: '3 min', txt: 'Visualiza una llama dorada en tu plexo solar.', txtEn: 'Visualize a golden flame at your solar plexus.' }, md: { d: 'sin t.', txt: 'Acepta un cumplido hoy sin restar mérito.', txtEn: 'Accept a compliment today without downplaying it.' }, n: { d: '6 min', txt: '¿Qué aprendí sobre mi poder esta semana?', txtEn: 'What did I learn about my power this week?' } },
  { msg: 'Soy amor. Me permito recibir.', msgEn: 'I am love. I allow myself to receive.', m: { d: '2 min', txt: 'Mano derecha en el corazón. 5 respiraciones de amor.', txtEn: 'Right hand on heart. 5 love breaths.' }, md: { d: '1 min', txt: 'Envía amor mental a alguien difícil.', txtEn: 'Send mental love to someone difficult.' }, n: { d: '5 min', txt: 'Escribe: "Lo que más me gusta de mí es..."', txtEn: 'Write: "What I love most about myself is..."' } },
  { msg: 'Mi corazón tiene espacio para todo.', msgEn: 'My heart has space for everything.', m: { d: '1 min', txt: 'Di en voz alta: "Merezco amor sin condiciones."', txtEn: 'Say aloud: "I deserve unconditional love."' }, md: { d: 'sin t.', txt: 'Recibe un halago sin minimizarlo.', txtEn: 'Receive a compliment without minimizing it.' }, n: { d: '4 min', txt: '5 cosas que te agradeces a ti misma hoy.', txtEn: '5 things you are grateful to yourself for today.' } },
  { msg: 'Hoy me trato con la ternura que merezco.', msgEn: 'Today I treat myself with the tenderness I deserve.', m: { d: '2 min', txt: 'Abrazo de mariposa: palmea suave tu pecho.', txtEn: 'Butterfly hug: gently pat your chest.' }, md: { d: 'sin t.', txt: 'Haz algo amable por ti.', txtEn: 'Do something kind for yourself.' }, n: { d: '5 min', txt: '¿Qué le daría a mi mejor amiga que no me doy a mí?', txtEn: 'What would I give my best friend that I don\'t give myself?' } },
  { msg: 'El amor propio no es egoísmo, es práctica.', msgEn: 'Self-love is not selfishness, it is practice.', m: { d: '3 min', txt: 'Visualiza luz verde que sale de tu pecho.', txtEn: 'Visualize green light radiating from your chest.' }, md: { d: '2 min', txt: 'Perdona mentalmente algo pequeño.', txtEn: 'Mentally forgive something small.' }, n: { d: '5 min', txt: '¿Cómo me amoré hoy?', txtEn: 'How did I love myself today?' } },
  { msg: 'Soy voz. Mi verdad tiene peso.', msgEn: 'I am voice. My truth has weight.', m: { d: '2 min', txt: 'Humming: zumba "mmm" 5 veces largas.', txtEn: 'Humming: hum "mmm" 5 long times.' }, md: { d: 'sin t.', txt: 'Di lo que piensas en la próxima conversación.', txtEn: 'Say what you think in the next conversation.' }, n: { d: '5 min', txt: '¿Qué no dije hoy que necesitaba decir?', txtEn: 'What did I not say today that needed to be said?' } },
  { msg: 'Hoy digo lo que pienso con claridad.', msgEn: 'Today I say what I think with clarity.', m: { d: '3 min', txt: 'Lee en voz alta algo que te inspire.', txtEn: 'Read something inspiring aloud.' }, md: { d: 'sin t.', txt: 'Expresa una opinión hoy sin disculparte.', txtEn: 'Express an opinion today without apologizing.' }, n: { d: '6 min', txt: 'Escribe una carta que no vas a enviar.', txtEn: 'Write a letter you will not send.' } },
  { msg: 'Mi expresión crea realidad.', msgEn: 'My expression creates reality.', m: { d: '3 min', txt: 'Canta en la ducha o en tu cuarto.', txtEn: 'Sing in the shower or in your room.' }, md: { d: '1 min', txt: 'Nombra cómo te sientes exactamente.', txtEn: 'Name exactly how you feel.' }, n: { d: '5 min', txt: '¿Qué quiero que el mundo sepa de mí?', txtEn: 'What do I want the world to know about me?' } },
  { msg: 'Comunico desde el amor, no el miedo.', msgEn: 'I communicate from love, not fear.', m: { d: '2 min', txt: 'Di 3 verdades sobre ti que normalmente callas.', txtEn: 'Say 3 truths about yourself that you normally keep silent.' }, md: { d: 'sin t.', txt: 'Escucha activamente sin preparar respuesta.', txtEn: 'Listen actively without preparing a response.' }, n: { d: '4 min', txt: '¿Mi voz de hoy fue auténtica o complaciente?', txtEn: 'Was my voice today authentic or people-pleasing?' } },
  { msg: 'Soy visión. Veo con claridad interior.', msgEn: 'I am vision. I see with inner clarity.', m: { d: '5 min', txt: 'Siéntate en silencio. Sin teléfono.', txtEn: 'Sit in silence. No phone.' }, md: { d: '2 min', txt: 'Escribe la primera impresión sin analizarla.', txtEn: 'Write your first impression without analyzing it.' }, n: { d: '4 min', txt: 'Anota cualquier imagen mental que hayas tenido hoy.', txtEn: 'Note any mental image you had today.' } },
  { msg: 'Confío en los mensajes de mi cuerpo.', msgEn: 'I trust the messages of my body.', m: { d: '2 min', txt: 'Con ojos cerrados, dibuja en el aire lo que sientes.', txtEn: 'With eyes closed, draw in the air what you feel.' }, md: { d: 'sin t.', txt: 'Confía en una corazonada y actúa.', txtEn: 'Trust a gut feeling and act on it.' }, n: { d: '5 min', txt: '¿Cuándo ignoré mi intuición hoy?', txtEn: 'When did I ignore my intuition today?' } },
  { msg: 'Mi intuición es un regalo, no un error.', msgEn: 'My intuition is a gift, not an error.', m: { d: '1 min', txt: 'Frota suavemente el entrecejo en círculos.', txtEn: 'Gently massage your brow in circles.' }, md: { d: '2 min', txt: 'Observa una situación desde otro punto de vista.', txtEn: 'Observe a situation from another point of view.' }, n: { d: '5 min', txt: '¿Qué patrón estás viendo en tu vida?', txtEn: 'What pattern are you seeing in your life?' } },
  { msg: 'Hoy observo antes de reaccionar.', msgEn: 'Today I observe before I react.', m: { d: '4 min', txt: 'Visualiza cómo quieres que sea tu día.', txtEn: 'Visualize how you want your day to be.' }, md: { d: '1 min', txt: 'Pregúntate: ¿qué siento, más allá de lo que pienso?', txtEn: 'Ask yourself: what do I feel, beyond what I think?' }, n: { d: '5 min', txt: '¿Qué supe hoy que no sabías que ya sabías?', txtEn: 'What did you know today that you didn\'t know you already knew?' } },
  { msg: 'Soy luz. Soy parte del todo.', msgEn: 'I am light. I am part of everything.', m: { d: '5 min', txt: 'Cinco minutos de silencio total.', txtEn: 'Five minutes of total silence.' }, md: { d: '2 min', txt: 'Mira el cielo por 2 minutos sin pensar.', txtEn: 'Look at the sky for 2 minutes without thinking.' }, n: { d: '8 min', txt: '¿Qué aprendí de mí en estos 30 días?', txtEn: 'What did I learn about myself in these 30 days?' } },
  { msg: 'Confío en el plan del universo para mí.', msgEn: "I trust the universe's plan for me.", m: { d: '5 min', txt: 'Medita sin ninguna intención.', txtEn: 'Meditate with no intention.' }, md: { d: '1 min', txt: 'Suelta una expectativa sobre este día.', txtEn: 'Release one expectation about this day.' }, n: { d: '6 min', txt: 'Gratitud: 3 cosas que no elegiste pero te formaron.', txtEn: 'Gratitude: 3 things you didn\'t choose but that shaped you.' } },
  { msg: 'Hoy suelto el control y confío.', msgEn: 'Today I release control and trust.', m: { d: '4 min', txt: 'Inhala expansión, exhala lo que no eres tú.', txtEn: 'Inhale expansion, exhale what is not you.' }, md: { d: '5 min', txt: 'Haz algo sin propósito.', txtEn: 'Do something without purpose.' }, n: { d: '7 min', txt: '¿En qué me convertí silenciosamente este mes?', txtEn: 'What did I become silently this month?' } },
  { msg: 'Soy suficiente exactamente como soy.', msgEn: 'I am enough exactly as I am.', m: { d: '5 min', txt: 'Visualiza luz blanca entrando por la coronilla.', txtEn: 'Visualize white light entering through your crown.' }, md: { d: '2 min', txt: 'Recuerda una versión anterior de ti. Envíale amor.', txtEn: 'Remember a previous version of yourself. Send her love.' }, n: { d: '8 min', txt: 'Carta a tu yo de hace un mes.', txtEn: 'Letter to your self from a month ago.' } },
  { msg: 'Este mes me transformé en silencio.', msgEn: 'This month I transformed in silence.', m: { d: '7 min', txt: 'Siéntate en silencio. Este mes fue un ritual.', txtEn: 'Sit in silence. This month was a ritual.' }, md: { d: 'sin t.', txt: 'Celebra tu llegada al día 30 como elijas.', txtEn: 'Celebrate reaching day 30 however you choose.' }, n: { d: '10 min', txt: 'Escribe tu intención para el próximo ciclo.', txtEn: 'Write your intention for the next cycle.' } },
];

export function getDayData(day: number): DayData {
  return DAILY_DATA[day - 1] || DAILY_DATA[0];
}

export interface ExerciseStep {
  name: string; nameEn: string;
  reps: string;
  sub: string; subEn: string;
  desc: string; descEn: string;
}

export interface Routine {
  title: string; titleEn: string;
  dur: string;
  steps: ExerciseStep[];
}

export const ROUTINES: Record<string, Routine> = {
  raiz: { title: 'Rutina de Raíz', titleEn: 'Root Routine', dur: '17 min', steps: [
    { name: 'Respiración abdominal', nameEn: 'Abdominal Breathing', reps: '2 minutos', sub: 'Activación de tierra', subEn: 'Earth activation', desc: 'Siéntate recta. Una mano en abdomen, otra en pecho. Inhala 4, sostén 2, exhala 6.', descEn: 'Sit up straight. One hand on belly, one on chest. Inhale 4, hold 2, exhale 6.' },
    { name: 'Sentadillas profundas', nameEn: 'Deep Squats', reps: '3 × 12 reps', sub: 'Fuerza de piernas', subEn: 'Leg strength', desc: 'Pies al ancho de caderas. Baja hasta muslos paralelos. Empuja desde los talones.', descEn: 'Feet hip-width apart. Lower until thighs are parallel. Push through your heels.' },
    { name: 'Puente de glúteos', nameEn: 'Glute Bridge', reps: '3 × 10 reps', sub: 'Activación glútea', subEn: 'Glute activation', desc: 'Boca arriba, rodillas flexionadas. Eleva la cadera, sostén 2 seg.', descEn: 'On your back, knees bent. Lift hips, hold 2 sec.' },
    { name: 'Estocadas alternas', nameEn: 'Alternating Lunges', reps: '2 × 8 por pierna', sub: 'Equilibrio y fuerza', subEn: 'Balance & strength', desc: 'Paso largo al frente, baja la rodilla trasera sin tocar el piso.', descEn: 'Step forward, lower back knee without touching the floor.' },
    { name: 'Postura del árbol', nameEn: 'Tree Pose', reps: '45 seg por lado', sub: 'Equilibrio y raíz', subEn: 'Balance & root', desc: 'De pie, pie en el interior del muslo contrario. Junta palmas.', descEn: 'Standing, foot on inner thigh. Bring palms together.' },
    { name: 'Meditación de raíz', nameEn: 'Root Meditation', reps: '5 minutos', sub: 'Integración', subEn: 'Integration', desc: 'Visualiza raíces rojas desde tu coxis hacia la tierra.', descEn: 'Visualize red roots from your tailbone into the earth.' },
  ]},
  sacro: { title: 'Rutina Sacra', titleEn: 'Sacral Routine', dur: '22 min', steps: [
    { name: 'Círculos de cadera', nameEn: 'Hip Circles', reps: '2 min por sentido', sub: 'Apertura sacra', subEn: 'Sacral opening', desc: 'De pie, manos en caderas. Círculos amplios y fluidos.', descEn: 'Standing, hands on hips. Wide, fluid circles.' },
    { name: 'Paloma preparatoria', nameEn: 'Pigeon Prep', reps: '90 seg por lado', sub: 'Apertura de cadera', subEn: 'Hip opening', desc: 'Desde cuatro puntos, desliza la rodilla hacia la mano del mismo lado.', descEn: 'From all fours, slide knee toward same-side hand.' },
    { name: 'Elevaciones de cadera', nameEn: 'Hip Raises', reps: '3 × 15 reps', sub: 'Fuerza y movilidad', subEn: 'Strength & mobility', desc: 'Boca arriba, pies en el piso. Eleva la cadera apretando glúteos.', descEn: 'On your back, feet on floor. Lift hips squeezing glutes.' },
    { name: 'Estiramiento de mariposa', nameEn: 'Butterfly Stretch', reps: '3 minutos', sub: 'Apertura profunda', subEn: 'Deep opening', desc: 'Sentada, junta las plantas de los pies. Inclínate suavemente.', descEn: 'Sitting, soles together. Gently lean forward.' },
    { name: 'Movimiento ondulatorio', nameEn: 'Undulating Movement', reps: '3 minutos', sub: 'Expresión creativa', subEn: 'Creative expression', desc: 'Ojos cerrados. Deja que el cuerpo se mueva libremente.', descEn: 'Eyes closed. Let the body move freely.' },
    { name: 'Meditación sacra', nameEn: 'Sacral Meditation', reps: '7 minutos', sub: 'Integración', subEn: 'Integration', desc: 'Luz naranja pulsando en tu zona sacra.', descEn: 'Orange light pulsing in your sacral zone.' },
  ]},
  solar: { title: 'Solar Plexus Flow', titleEn: 'Solar Plexus Flow', dur: '20 min', steps: [
    { name: 'Respiración de fuego', nameEn: 'Fire Breathing', reps: '2 minutos', sub: 'Activación de poder', subEn: 'Power activation', desc: 'Exhala con fuerza contrayendo el abdomen. 1 exhalo por segundo.', descEn: 'Exhale forcefully contracting the belly. 1 exhale per second.' },
    { name: 'Plank de antebrazos', nameEn: 'Forearm Plank', reps: '3 × 45 seg', sub: 'Fuerza de núcleo', subEn: 'Core strength', desc: 'Antebrazos en el suelo. Cuerpo en línea recta.', descEn: 'Forearms on the floor. Body in a straight line.' },
    { name: 'Mountain climbers', nameEn: 'Mountain Climbers', reps: '3 × 30 seg', sub: 'Cardio de fuego', subEn: 'Fire cardio', desc: 'Desde plank, lleva rodillas al pecho alternando rápido.', descEn: 'From plank, bring knees to chest alternating fast.' },
    { name: 'Russian twists', nameEn: 'Russian Twists', reps: '3 × 20 reps', sub: 'Rotación de poder', subEn: 'Power rotation', desc: 'Sentada, tronco a 45°. Gira el torso de lado a lado.', descEn: 'Sitting, torso at 45°. Rotate side to side.' },
    { name: 'Core flow continuo', nameEn: 'Continuous Core Flow', reps: '2 minutos', sub: 'Flujo sin pausa', subEn: 'Unbroken flow', desc: '5 crunches → 5 elevaciones de piernas → 5 bicicleta.', descEn: '5 crunches → 5 leg raises → 5 bicycle.' },
    { name: 'Meditación del guerrero', nameEn: 'Warrior Meditation', reps: '7 minutos', sub: 'Integración', subEn: 'Integration', desc: 'Llama dorada en el plexo solar.', descEn: 'Golden flame at the solar plexus.' },
  ]},
  corazon: { title: 'Rutina de Corazón', titleEn: 'Heart Routine', dur: '22 min', steps: [
    { name: 'Apertura de pecho suave', nameEn: 'Gentle Chest Opening', reps: '3 minutos', sub: 'Apertura inicial', subEn: 'Initial opening', desc: 'Entrelaza los dedos detrás. Abre el pecho al exhalar.', descEn: 'Interlace fingers behind. Open chest on exhale.' },
    { name: 'Cobra suave', nameEn: 'Gentle Cobra', reps: '5 × 30 seg', sub: 'Extensión de espalda', subEn: 'Back extension', desc: 'Eleva el torso usando la espalda. Cuello largo.', descEn: 'Lift torso using your back. Long neck.' },
    { name: 'Postura del camello', nameEn: 'Camel Pose', reps: '3 × 20 seg', sub: 'Apertura profunda', subEn: 'Deep opening', desc: 'Arrodillada, manos a los talones. Empuja cadera adelante.', descEn: 'Kneeling, hands to heels. Push hips forward.' },
    { name: 'Push-ups con manos abiertas', nameEn: 'Wide-hand Push-ups', reps: '3 × 10 reps', sub: 'Fuerza de apertura', subEn: 'Opening strength', desc: 'Manos más separadas que los hombros. Codos a 45°.', descEn: 'Hands wider than shoulders. Elbows at 45°.' },
    { name: 'Niño con brazos extendidos', nameEn: 'Child Pose Extended Arms', reps: '3 minutos', sub: 'Rendición amorosa', subEn: 'Loving surrender', desc: 'Torso hacia adelante, brazos extendidos. Frente al suelo.', descEn: 'Torso forward, arms extended. Forehead to floor.' },
    { name: 'Meditación de corazón', nameEn: 'Heart Meditation', reps: '7 minutos', sub: 'Integración', subEn: 'Integration', desc: 'Luz verde irradiando desde el centro de tu pecho.', descEn: 'Green light radiating from the center of your chest.' },
  ]},
  garganta: { title: 'Rutina de Garganta', titleEn: 'Throat Routine', dur: '20 min', steps: [
    { name: 'Rolls de cuello', nameEn: 'Neck Rolls', reps: '2 minutos suaves', sub: 'Liberación cervical', subEn: 'Neck release', desc: 'Oreja al hombro. Rueda lentamente de un lado al otro.', descEn: 'Ear to shoulder. Roll slowly side to side.' },
    { name: 'Apertura de hombros', nameEn: 'Shoulder Opening', reps: '3 minutos', sub: 'Hombros libres', subEn: 'Free shoulders', desc: 'Con toalla, lleva los brazos por encima alternando lados.', descEn: 'With towel, bring arms overhead alternating sides.' },
    { name: 'Postura del pez', nameEn: 'Fish Pose', reps: '3 × 30 seg', sub: 'Apertura de garganta', subEn: 'Throat opening', desc: 'Apoya los codos y eleva el pecho arqueando la espalda.', descEn: 'Rest on elbows and lift chest arching the back.' },
    { name: 'Humming — zumbido', nameEn: 'Humming', reps: '5 minutos', sub: 'Vibración de expresión', subEn: 'Expression vibration', desc: 'Exhala emitiendo "mmmmm" sostenido. Siente la vibración.', descEn: 'Exhale making a sustained "mmmmm". Feel the vibration.' },
    { name: 'Estiramiento de trapecio', nameEn: 'Trapezius Stretch', reps: '90 seg por lado', sub: 'Liberación final', subEn: 'Final release', desc: 'Oreja al hombro. Presión muy suave sobre la sien.', descEn: 'Ear to shoulder. Very gentle pressure on temple.' },
    { name: 'Meditación de la voz', nameEn: 'Voice Meditation', reps: '5 minutos', sub: 'Integración', subEn: 'Integration', desc: 'Luz azul en tu garganta. Tu verdad se libera.', descEn: 'Blue light in your throat. Your truth is released.' },
  ]},
  tojo: { title: 'Rutina del Tercer Ojo', titleEn: 'Third Eye Routine', dur: '22 min', steps: [
    { name: 'Postura del águila', nameEn: 'Eagle Pose', reps: '60 seg por lado', sub: 'Enfoque y equilibrio', subEn: 'Focus & balance', desc: 'Cruza el muslo sobre el otro. Entrelaza los antebrazos.', descEn: 'Cross thigh over the other. Interlace forearms.' },
    { name: 'Balanceo en un pie', nameEn: 'One-foot Balance', reps: '90 seg por lado', sub: 'Presencia plena', subEn: 'Full presence', desc: 'Eleva un pie del suelo. Cierra los ojos.', descEn: 'Lift one foot off the floor. Close your eyes.' },
    { name: 'Niño con frente en suelo', nameEn: 'Child Pose Forehead Down', reps: '3 minutos', sub: 'Introspección', subEn: 'Introspection', desc: 'El entrecejo toca el suelo, activando el tercer ojo.', descEn: 'Forehead touches the floor, activating the third eye.' },
    { name: 'Piernas en la pared', nameEn: 'Legs Up the Wall', reps: '5 minutos', sub: 'Inversión restaurativa', subEn: 'Restorative inversion', desc: 'Espalda en el suelo, piernas rectas contra la pared.', descEn: 'Back on floor, straight legs against the wall.' },
    { name: 'Nadi Shodhana', nameEn: 'Nadi Shodhana', reps: '5 minutos', sub: 'Equilibrio hemisférico', subEn: 'Hemispheric balance', desc: 'Respiración alterna: tapa fosa derecha, inhala izquierda.', descEn: 'Alternate breathing: close right nostril, inhale left.' },
    { name: 'Meditación de visión', nameEn: 'Vision Meditation', reps: '7 minutos', sub: 'Activación', subEn: 'Activation', desc: 'Luz índigo pulsando en tu entrecejo.', descEn: 'Indigo light pulsing at your brow.' },
  ]},
  corona: { title: 'Rutina de Corona', titleEn: 'Crown Routine', dur: '30 min', steps: [
    { name: 'Saludo al sol completo', nameEn: 'Full Sun Salutation', reps: '5 rondas lentas', sub: 'Activación total', subEn: 'Full activation', desc: 'Inhala al extender, exhala al doblar. Flujo entre posturas.', descEn: 'Inhale to extend, exhale to fold. Flow between poses.' },
    { name: 'Sukhasana con elongación', nameEn: 'Sukhasana with Elongation', reps: '5 minutos', sub: 'Apertura de corona', subEn: 'Crown opening', desc: 'Piernas cruzadas. Inhala elongando la columna hacia arriba.', descEn: 'Legs crossed. Inhale lengthening spine upward.' },
    { name: 'Postura del niño profunda', nameEn: 'Deep Child Pose', reps: '3 minutos', sub: 'Rendición total', subEn: 'Total surrender', desc: 'Rodillas abiertas, brazos extendidos. Frente al suelo.', descEn: 'Knees open, arms extended. Forehead to floor.' },
    { name: 'Pranayama 4-7-8', nameEn: '4-7-8 Pranayama', reps: '5 minutos', sub: 'Sistema nervioso', subEn: 'Nervous system', desc: 'Inhala 4, sostén 7, exhala 8.', descEn: 'Inhale 4, hold 7, exhale 8.' },
    { name: 'Escaneo corporal', nameEn: 'Body Scan', reps: '5 minutos', sub: 'Integración somática', subEn: 'Somatic integration', desc: 'Recorre el cuerpo de pies a coronilla. Suelta tensión.', descEn: 'Travel the body from feet to crown. Release tension.' },
    { name: 'Meditación de corona', nameEn: 'Crown Meditation', reps: '10 minutos', sub: 'Cierre del ciclo', subEn: 'Cycle closing', desc: 'Luz blanca dorada entra por tu coronilla.', descEn: 'Golden white light enters through your crown.' },
  ]},
};

export interface Ritual {
  id: string;
  name: string; nameEn: string;
  sub: string; subEn: string;
  dur: string;
  c: string;
  bg: string;
  status: 'available' | 'upcoming' | 'completed';
  daysUntil?: number;
  steps: { n: string; nEn: string; i: string; iEn: string }[];
}

export const RITUALS: Ritual[] = [
  { id: 'luna-nueva', name: 'Luna Nueva', nameEn: 'New Moon', sub: 'Ritual de Siembra', subEn: 'Planting Ritual', dur: '15 min', c: '#6B6FA0', bg: 'rgba(107,111,160,0.12)', status: 'upcoming', daysUntil: 12, steps: [
    { n: 'Encendido del espacio', nEn: 'Opening the space', i: 'Enciende una vela, respira profundo 3 veces.', iEn: 'Light a candle, take 3 deep breaths.' },
    { n: 'Movimiento de raíz', nEn: 'Root movement', i: '5 min de sentadillas lentas.', iEn: '5 min of slow squats.' },
    { n: 'Escritura de intención', nEn: 'Intention writing', i: 'Escribe una intención para los próximos 28 días.', iEn: 'Write an intention for the next 28 days.' },
    { n: 'Cierre', nEn: 'Closing', i: '"Soy la tierra fértil donde mis intenciones germinan."', iEn: '"I am fertile ground where my intentions grow."' },
  ]},
  { id: 'luna-llena', name: 'Luna Llena', nameEn: 'Full Moon', sub: 'Ritual de Liberación', subEn: 'Liberation Ritual', dur: '20 min', c: '#A8A6C9', bg: 'rgba(168,166,201,0.12)', status: 'available', steps: [
    { n: 'Movimiento de liberación', nEn: 'Release movement', i: '8 min de apertura de pecho y torsiones.', iEn: '8 min of chest opening and twists.' },
    { n: 'Gratitud y lista de soltar', nEn: 'Gratitude & letting go', i: '3 cosas que agradeces, 1 cosa que sueltas.', iEn: "3 things you're grateful for, 1 thing you release." },
    { n: 'Ritual simbólico', nEn: 'Symbolic ritual', i: 'Rompe el papel donde escribiste lo que sueltas.', iEn: 'Tear the paper where you wrote what you release.' },
    { n: 'Meditación', nEn: 'Meditation', i: '5 min visualizando la luna llena.', iEn: '5 min visualizing the full moon.' },
  ]},
  { id: 'equinoccio', name: 'Equinoccio', nameEn: 'Equinox', sub: 'Ritual de Equilibrio', subEn: 'Balance Ritual', dur: '20 min', c: '#9C7E63', bg: 'rgba(156,126,99,0.12)', status: 'completed', steps: [
    { n: 'Postura del árbol', nEn: 'Tree pose', i: '6 min de equilibrio alternando lados.', iEn: '6 min of balance alternating sides.' },
    { n: 'Journaling', nEn: 'Journaling', i: '¿Qué área necesita más luz, cuál más descanso?', iEn: 'What area needs more light, which needs more rest?' },
    { n: 'Nadi Shodhana', nEn: 'Nadi Shodhana', i: '5 min de respiración alterna.', iEn: '5 min of alternate breathing.' },
    { n: 'Cierre', nEn: 'Closing', i: '"Honro mi luz y mi sombra."', iEn: '"I honor my light and my shadow."' },
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
