import { useState, useRef, useEffect } from "react";
import { User, LessonResult } from "../App";
import Icon from "@/components/ui/icon";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTTS } from "@/hooks/useTTS";

interface Props {
  lessonId: number;
  user: User;
  onComplete: (result: LessonResult) => void;
  onBack: () => void;
}

const LETTER_DATA: Record<number, {
  letter: string;
  emoji: string;
  words: { word: string; photo: string }[];
  color: string;
  bg: string;
  shadow: string;
}> = {
  101: {
    letter: "А",
    emoji: "🍎",
    words: [
      { word: "Арбуз",    photo: "https://picsum.photos/seed/arbuz/120/120" },
      { word: "Апельсин", photo: "https://picsum.photos/seed/apelsin/120/120" },
      { word: "Аист",     photo: "https://picsum.photos/seed/aist/120/120" },
    ],
    color: "hsl(0 85% 60%)",
    bg: "linear-gradient(135deg, hsl(0 85% 60%), hsl(350 85% 55%))",
    shadow: "hsl(0 85% 45%)",
  },
  102: {
    letter: "Б",
    emoji: "🐝",
    words: [
      { word: "Банан",    photo: "https://picsum.photos/seed/banan/120/120" },
      { word: "Бабочка",  photo: "https://picsum.photos/seed/babochka/120/120" },
      { word: "Бегемот",  photo: "https://picsum.photos/seed/begemot/120/120" },
    ],
    color: "hsl(45 95% 55%)",
    bg: "linear-gradient(135deg, hsl(45 95% 55%), hsl(35 95% 50%))",
    shadow: "hsl(45 95% 40%)",
  },
  103: {
    letter: "В",
    emoji: "🐺",
    words: [
      { word: "Волк",    photo: "https://picsum.photos/seed/volk/120/120" },
      { word: "Виноград", photo: "https://picsum.photos/seed/vinograd/120/120" },
      { word: "Ворона",  photo: "https://picsum.photos/seed/vorona/120/120" },
    ],
    color: "hsl(220 70% 55%)",
    bg: "linear-gradient(135deg, hsl(220 70% 55%), hsl(210 70% 50%))",
    shadow: "hsl(220 70% 40%)",
  },
  104: {
    letter: "Г",
    emoji: "🦆",
    words: [
      { word: "Гусь",  photo: "https://picsum.photos/seed/gus/120/120" },
      { word: "Груша", photo: "https://picsum.photos/seed/grusha/120/120" },
      { word: "Гриб",  photo: "https://picsum.photos/seed/grib/120/120" },
    ],
    color: "hsl(120 60% 45%)",
    bg: "linear-gradient(135deg, hsl(120 60% 45%), hsl(100 60% 40%))",
    shadow: "hsl(120 60% 32%)",
  },
  105: {
    letter: "Д",
    emoji: "🌳",
    words: [
      { word: "Дом",     photo: "https://picsum.photos/seed/dom/120/120" },
      { word: "Дыня",    photo: "https://picsum.photos/seed/dynya/120/120" },
      { word: "Дельфин", photo: "https://picsum.photos/seed/delfin/120/120" },
    ],
    color: "hsl(25 90% 55%)",
    bg: "linear-gradient(135deg, hsl(25 90% 55%), hsl(15 90% 50%))",
    shadow: "hsl(25 90% 40%)",
  },
  106: {
    letter: "Е",
    emoji: "🦔",
    words: [
      { word: "Ёж",     photo: "https://picsum.photos/seed/yozh/120/120" },
      { word: "Ель",    photo: "https://picsum.photos/seed/yel/120/120" },
      { word: "Енот",   photo: "https://picsum.photos/seed/enot/120/120" },
    ],
    color: "hsl(150 60% 42%)",
    bg: "linear-gradient(135deg, hsl(150 60% 42%), hsl(140 60% 37%))",
    shadow: "hsl(150 60% 30%)",
  },
  107: {
    letter: "Ё",
    emoji: "🌲",
    words: [
      { word: "Ёж",     photo: "https://picsum.photos/seed/yozh2/120/120" },
      { word: "Ёлка",   photo: "https://picsum.photos/seed/yolka/120/120" },
      { word: "Ёжик",   photo: "https://picsum.photos/seed/yozhik/120/120" },
    ],
    color: "hsl(160 55% 40%)",
    bg: "linear-gradient(135deg, hsl(160 55% 40%), hsl(150 55% 35%))",
    shadow: "hsl(160 55% 28%)",
  },
  108: {
    letter: "Ж",
    emoji: "🐞",
    words: [
      { word: "Жираф",   photo: "https://picsum.photos/seed/jiraf/120/120" },
      { word: "Жук",     photo: "https://picsum.photos/seed/juk/120/120" },
      { word: "Журавль", photo: "https://picsum.photos/seed/juravl/120/120" },
    ],
    color: "hsl(50 90% 50%)",
    bg: "linear-gradient(135deg, hsl(50 90% 50%), hsl(40 90% 45%))",
    shadow: "hsl(50 90% 35%)",
  },
  109: {
    letter: "З",
    emoji: "🦓",
    words: [
      { word: "Зебра",  photo: "https://picsum.photos/seed/zebra/120/120" },
      { word: "Заяц",   photo: "https://picsum.photos/seed/zayac/120/120" },
      { word: "Змея",   photo: "https://picsum.photos/seed/zmeya/120/120" },
    ],
    color: "hsl(270 70% 60%)",
    bg: "linear-gradient(135deg, hsl(270 70% 60%), hsl(260 70% 55%))",
    shadow: "hsl(270 70% 45%)",
  },
  110: {
    letter: "И",
    emoji: "🦌",
    words: [
      { word: "Индюк",  photo: "https://picsum.photos/seed/indyuk/120/120" },
      { word: "Ива",    photo: "https://picsum.photos/seed/iva/120/120" },
      { word: "Игла",   photo: "https://picsum.photos/seed/igla/120/120" },
    ],
    color: "hsl(190 70% 48%)",
    bg: "linear-gradient(135deg, hsl(190 70% 48%), hsl(180 70% 43%))",
    shadow: "hsl(190 70% 34%)",
  },
  111: {
    letter: "Й",
    emoji: "🎯",
    words: [
      { word: "Йогурт", photo: "https://picsum.photos/seed/yogurt/120/120" },
      { word: "Йод",    photo: "https://picsum.photos/seed/yod/120/120" },
      { word: "Йети",   photo: "https://picsum.photos/seed/yeti/120/120" },
    ],
    color: "hsl(200 65% 50%)",
    bg: "linear-gradient(135deg, hsl(200 65% 50%), hsl(190 65% 45%))",
    shadow: "hsl(200 65% 36%)",
  },
  112: {
    letter: "К",
    emoji: "🐱",
    words: [
      { word: "Кот",    photo: "https://picsum.photos/seed/kot/120/120" },
      { word: "Корова", photo: "https://picsum.photos/seed/korova/120/120" },
      { word: "Кит",    photo: "https://picsum.photos/seed/kit/120/120" },
    ],
    color: "hsl(330 80% 58%)",
    bg: "linear-gradient(135deg, hsl(330 80% 58%), hsl(320 80% 53%))",
    shadow: "hsl(330 80% 43%)",
  },
  113: {
    letter: "Л",
    emoji: "🦁",
    words: [
      { word: "Лев",    photo: "https://picsum.photos/seed/lev/120/120" },
      { word: "Лиса",   photo: "https://picsum.photos/seed/lisa/120/120" },
      { word: "Лук",    photo: "https://picsum.photos/seed/luk/120/120" },
    ],
    color: "hsl(28 85% 52%)",
    bg: "linear-gradient(135deg, hsl(28 85% 52%), hsl(18 85% 47%))",
    shadow: "hsl(28 85% 37%)",
  },
  114: {
    letter: "М",
    emoji: "🐭",
    words: [
      { word: "Медведь", photo: "https://picsum.photos/seed/medved/120/120" },
      { word: "Мышь",    photo: "https://picsum.photos/seed/mysh/120/120" },
      { word: "Морковь", photo: "https://picsum.photos/seed/morkov/120/120" },
    ],
    color: "hsl(10 80% 55%)",
    bg: "linear-gradient(135deg, hsl(10 80% 55%), hsl(0 80% 50%))",
    shadow: "hsl(10 80% 40%)",
  },
  115: {
    letter: "Н",
    emoji: "🌙",
    words: [
      { word: "Носорог", photo: "https://picsum.photos/seed/nosorog/120/120" },
      { word: "Нож",     photo: "https://picsum.photos/seed/nozh/120/120" },
      { word: "Ночь",    photo: "https://picsum.photos/seed/noch/120/120" },
    ],
    color: "hsl(240 60% 55%)",
    bg: "linear-gradient(135deg, hsl(240 60% 55%), hsl(230 60% 50%))",
    shadow: "hsl(240 60% 40%)",
  },
  116: {
    letter: "О",
    emoji: "🦊",
    words: [
      { word: "Обезьяна", photo: "https://picsum.photos/seed/obezyana/120/120" },
      { word: "Овца",     photo: "https://picsum.photos/seed/ovca/120/120" },
      { word: "Орёл",     photo: "https://picsum.photos/seed/orel/120/120" },
    ],
    color: "hsl(35 90% 52%)",
    bg: "linear-gradient(135deg, hsl(35 90% 52%), hsl(25 90% 47%))",
    shadow: "hsl(35 90% 37%)",
  },
  117: {
    letter: "П",
    emoji: "🐧",
    words: [
      { word: "Пингвин", photo: "https://picsum.photos/seed/pingvin/120/120" },
      { word: "Попугай", photo: "https://picsum.photos/seed/popugay/120/120" },
      { word: "Помидор", photo: "https://picsum.photos/seed/pomidor/120/120" },
    ],
    color: "hsl(350 80% 58%)",
    bg: "linear-gradient(135deg, hsl(350 80% 58%), hsl(340 80% 53%))",
    shadow: "hsl(350 80% 43%)",
  },
  118: {
    letter: "Р",
    emoji: "🌹",
    words: [
      { word: "Роза",    photo: "https://picsum.photos/seed/roza/120/120" },
      { word: "Рыба",    photo: "https://picsum.photos/seed/ryba/120/120" },
      { word: "Ракета",  photo: "https://picsum.photos/seed/raketa/120/120" },
    ],
    color: "hsl(0 80% 58%)",
    bg: "linear-gradient(135deg, hsl(0 80% 58%), hsl(350 80% 53%))",
    shadow: "hsl(0 80% 43%)",
  },
  119: {
    letter: "С",
    emoji: "🐘",
    words: [
      { word: "Слон",   photo: "https://picsum.photos/seed/slon/120/120" },
      { word: "Собака", photo: "https://picsum.photos/seed/sobaka/120/120" },
      { word: "Сыр",    photo: "https://picsum.photos/seed/syr/120/120" },
    ],
    color: "hsl(200 60% 50%)",
    bg: "linear-gradient(135deg, hsl(200 60% 50%), hsl(190 60% 45%))",
    shadow: "hsl(200 60% 36%)",
  },
  120: {
    letter: "Т",
    emoji: "🐯",
    words: [
      { word: "Тигр",    photo: "https://picsum.photos/seed/tigr/120/120" },
      { word: "Торт",    photo: "https://picsum.photos/seed/tort/120/120" },
      { word: "Тюлень",  photo: "https://picsum.photos/seed/tyulen/120/120" },
    ],
    color: "hsl(20 85% 55%)",
    bg: "linear-gradient(135deg, hsl(20 85% 55%), hsl(10 85% 50%))",
    shadow: "hsl(20 85% 40%)",
  },
  121: {
    letter: "У",
    emoji: "🦆",
    words: [
      { word: "Утка",   photo: "https://picsum.photos/seed/utka/120/120" },
      { word: "Улитка", photo: "https://picsum.photos/seed/ulitka/120/120" },
      { word: "Уж",     photo: "https://picsum.photos/seed/uzh/120/120" },
    ],
    color: "hsl(180 60% 44%)",
    bg: "linear-gradient(135deg, hsl(180 60% 44%), hsl(170 60% 39%))",
    shadow: "hsl(180 60% 31%)",
  },
  122: {
    letter: "Ф",
    emoji: "🎩",
    words: [
      { word: "Фламинго", photo: "https://picsum.photos/seed/flamingo/120/120" },
      { word: "Фрукты",   photo: "https://picsum.photos/seed/frukty/120/120" },
      { word: "Фонарь",   photo: "https://picsum.photos/seed/fonar/120/120" },
    ],
    color: "hsl(300 65% 55%)",
    bg: "linear-gradient(135deg, hsl(300 65% 55%), hsl(290 65% 50%))",
    shadow: "hsl(300 65% 40%)",
  },
  123: {
    letter: "Х",
    emoji: "🦔",
    words: [
      { word: "Хомяк",  photo: "https://picsum.photos/seed/homyak/120/120" },
      { word: "Хлеб",   photo: "https://picsum.photos/seed/hleb/120/120" },
      { word: "Хвост",  photo: "https://picsum.photos/seed/hvost/120/120" },
    ],
    color: "hsl(15 75% 52%)",
    bg: "linear-gradient(135deg, hsl(15 75% 52%), hsl(5 75% 47%))",
    shadow: "hsl(15 75% 37%)",
  },
  124: {
    letter: "Ц",
    emoji: "🌸",
    words: [
      { word: "Цветок",  photo: "https://picsum.photos/seed/cvetok/120/120" },
      { word: "Цапля",   photo: "https://picsum.photos/seed/caplya/120/120" },
      { word: "Цирк",    photo: "https://picsum.photos/seed/cirk/120/120" },
    ],
    color: "hsl(315 70% 57%)",
    bg: "linear-gradient(135deg, hsl(315 70% 57%), hsl(305 70% 52%))",
    shadow: "hsl(315 70% 42%)",
  },
  125: {
    letter: "Ч",
    emoji: "☕",
    words: [
      { word: "Черепаха", photo: "https://picsum.photos/seed/cherepaha/120/120" },
      { word: "Чайник",   photo: "https://picsum.photos/seed/chaynik/120/120" },
      { word: "Чайка",    photo: "https://picsum.photos/seed/chayka/120/120" },
    ],
    color: "hsl(30 80% 50%)",
    bg: "linear-gradient(135deg, hsl(30 80% 50%), hsl(20 80% 45%))",
    shadow: "hsl(30 80% 36%)",
  },
  126: {
    letter: "Ш",
    emoji: "🎱",
    words: [
      { word: "Шар",     photo: "https://picsum.photos/seed/shar/120/120" },
      { word: "Шмель",   photo: "https://picsum.photos/seed/shmel/120/120" },
      { word: "Шоколад", photo: "https://picsum.photos/seed/shokolad/120/120" },
    ],
    color: "hsl(280 65% 55%)",
    bg: "linear-gradient(135deg, hsl(280 65% 55%), hsl(270 65% 50%))",
    shadow: "hsl(280 65% 40%)",
  },
  127: {
    letter: "Щ",
    emoji: "🛡️",
    words: [
      { word: "Щенок",  photo: "https://picsum.photos/seed/schenok/120/120" },
      { word: "Щука",   photo: "https://picsum.photos/seed/schuka/120/120" },
      { word: "Щётка",  photo: "https://picsum.photos/seed/schetka/120/120" },
    ],
    color: "hsl(90 55% 45%)",
    bg: "linear-gradient(135deg, hsl(90 55% 45%), hsl(80 55% 40%))",
    shadow: "hsl(90 55% 32%)",
  },
  128: {
    letter: "Ъ",
    emoji: "🔑",
    words: [
      { word: "Объект",  photo: "https://picsum.photos/seed/obekt/120/120" },
      { word: "Объём",   photo: "https://picsum.photos/seed/obem/120/120" },
      { word: "Съезд",   photo: "https://picsum.photos/seed/sezd/120/120" },
    ],
    color: "hsl(210 50% 50%)",
    bg: "linear-gradient(135deg, hsl(210 50% 50%), hsl(200 50% 45%))",
    shadow: "hsl(210 50% 36%)",
  },
  129: {
    letter: "Ы",
    emoji: "🧀",
    words: [
      { word: "Рыба",   photo: "https://picsum.photos/seed/ryba2/120/120" },
      { word: "Мыло",   photo: "https://picsum.photos/seed/mylo/120/120" },
      { word: "Дым",    photo: "https://picsum.photos/seed/dym/120/120" },
    ],
    color: "hsl(55 80% 50%)",
    bg: "linear-gradient(135deg, hsl(55 80% 50%), hsl(45 80% 45%))",
    shadow: "hsl(55 80% 36%)",
  },
  130: {
    letter: "Ь",
    emoji: "🍂",
    words: [
      { word: "Соль",    photo: "https://picsum.photos/seed/sol/120/120" },
      { word: "Мышь",    photo: "https://picsum.photos/seed/mysh2/120/120" },
      { word: "Огонь",   photo: "https://picsum.photos/seed/ogon/120/120" },
    ],
    color: "hsl(25 70% 50%)",
    bg: "linear-gradient(135deg, hsl(25 70% 50%), hsl(15 70% 45%))",
    shadow: "hsl(25 70% 36%)",
  },
  131: {
    letter: "Э",
    emoji: "⚡",
    words: [
      { word: "Экран",      photo: "https://picsum.photos/seed/ekran/120/120" },
      { word: "Экскаватор", photo: "https://picsum.photos/seed/ekskavator/120/120" },
      { word: "Этаж",       photo: "https://picsum.photos/seed/etazh/120/120" },
    ],
    color: "hsl(195 80% 48%)",
    bg: "linear-gradient(135deg, hsl(195 80% 48%), hsl(185 80% 43%))",
    shadow: "hsl(195 80% 34%)",
  },
  132: {
    letter: "Ю",
    emoji: "🌍",
    words: [
      { word: "Юла",    photo: "https://picsum.photos/seed/yula/120/120" },
      { word: "Юноша",  photo: "https://picsum.photos/seed/yunosha/120/120" },
      { word: "Юг",     photo: "https://picsum.photos/seed/yug/120/120" },
    ],
    color: "hsl(210 80% 55%)",
    bg: "linear-gradient(135deg, hsl(210 80% 55%), hsl(200 80% 50%))",
    shadow: "hsl(210 80% 40%)",
  },
  133: {
    letter: "Я",
    emoji: "🍓",
    words: [
      { word: "Яблоко",  photo: "https://picsum.photos/seed/yabloko/120/120" },
      { word: "Ягода",   photo: "https://picsum.photos/seed/yagoda/120/120" },
      { word: "Якорь",   photo: "https://picsum.photos/seed/yakor/120/120" },
    ],
    color: "hsl(345 85% 58%)",
    bg: "linear-gradient(135deg, hsl(345 85% 58%), hsl(335 85% 53%))",
    shadow: "hsl(345 85% 43%)",
  },
};

const DEFAULT_LESSON = LETTER_DATA[101];

type Phase = "learn" | "mic" | "success" | "wrong";

export default function LessonScreen({ lessonId, user, onComplete, onBack }: Props) {
  const lesson = LETTER_DATA[lessonId] || DEFAULT_LESSON;
  const [phase, setPhase] = useState<Phase>("learn");
  const [attempts, setAttempts] = useState(0);
  const [stars, setStars] = useState(3);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; char: string }[]>([]);
  const confettiId = useRef(0);
  const { speak, speakLetter, stop, speaking } = useTTS();

  // Auto-speak letter when lesson loads
  useEffect(() => {
    const t = setTimeout(() => speakLetter(lesson.letter), 600);
    return () => clearTimeout(t);
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const spawnConfetti = () => {
    const chars = ["⭐", "✨", "🌟", "💫", "🎉"];
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F59E0B", "#34D399"];
    const items = Array.from({ length: 16 }, (_, i) => ({
      id: confettiId.current++,
      x: 5 + Math.random() * 90,
      color: colors[i % colors.length],
      char: chars[i % chars.length],
    }));
    setConfetti(items);
    setTimeout(() => setConfetti([]), 1800);
  };

  const { state: speechState, transcript, volume, start, reset } = useSpeechRecognition(
    lesson.letter,
    {
      onResult: (heard, correct) => {
        if (correct) {
          spawnConfetti();
          setPhase("success");
          const phrases = [
            `Молодец! Ты правильно сказал букву ${lesson.letter}!`,
            `Отлично! Буква ${lesson.letter} — ты справился!`,
            `Супер! Так держать, умница!`,
          ];
          const phrase = phrases[Math.floor(Math.random() * phrases.length)];
          setTimeout(() => speak(phrase), 400);
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= 2) setStars((s) => Math.max(1, s - 1));
          setPhase("wrong");
          setTimeout(() => speak(`Не расстраивайся! Попробуй ещё раз. Буква ${lesson.letter}.`), 300);
        }
      },
    }
  );

  const handleMicClick = () => {
    reset();
    setPhase("mic");
    start();
  };

  const handleRetry = () => {
    reset();
    setPhase("learn");
  };

  const handleComplete = () => {
    onComplete({
      lessonId,
      stars,
      badge: lessonId === 101 ? "first_letter" : undefined,
    });
  };

  const progressWidth =
    phase === "learn" ? "30%" : phase === "mic" ? "65%" : "100%";

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden bg-background">
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute pointer-events-none z-50 text-2xl"
          style={{
            left: `${c.x}%`,
            top: "-5%",
            animation: "confettiFall 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
          }}>
          {c.char}
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted transition-transform active:scale-95">
          <Icon name="X" size={20} />
        </button>

        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className="text-2xl transition-all duration-300"
              style={{ opacity: s <= stars ? 1 : 0.25, transform: s <= stars ? "scale(1)" : "scale(0.8)" }}>
              ⭐
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-muted rounded-xl px-3 py-1.5">
          <span className="text-base">⭐</span>
          <span className="font-black text-sm">{user.stars}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 mb-5">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-600 ease-out"
            style={{ width: progressWidth, background: lesson.bg }}
          />
        </div>
      </div>

      {/* ── LEARN PHASE ── */}
      {phase === "learn" && (
        <div className="flex-1 flex flex-col items-center px-5 pb-6 animate-fade-in">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
            Знакомимся с буквой
          </p>

          {/* Giant floating letter — tap to hear */}
          <button
            onClick={() => speakLetter(lesson.letter)}
            className="w-44 h-44 rounded-[2.5rem] flex flex-col items-center justify-center mb-6 shadow-xl relative transition-transform active:scale-95"
            style={{
              background: lesson.bg,
              boxShadow: speaking === `letter_${lesson.letter}`
                ? `0 0 0 6px ${lesson.color}40, 0 16px 48px ${lesson.color}66`
                : `0 12px 40px ${lesson.color}55`,
              animation: "floatY 3s ease-in-out infinite",
            }}>
            <span className="font-black text-white leading-none" style={{ fontSize: "7rem", textShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
              {lesson.letter}
            </span>
            <span className="text-white/70 text-xs font-bold mt-1 flex items-center gap-1">
              {speaking === `letter_${lesson.letter}` ? "🔊 звучит..." : "🔊 нажми"}
            </span>
          </button>

          {/* Words */}
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">
            Слова на «{lesson.letter}»
          </p>
          <div className="w-full space-y-2.5 mb-6">
            {lesson.words.map((w, i) => {
              const isSpeaking = speaking === w.word;
              return (
                <button
                  key={i}
                  onClick={() => isSpeaking ? stop() : speak(w.word)}
                  className="game-card w-full flex items-center gap-3 px-3 py-3 transition-all active:scale-[0.98] text-left overflow-hidden"
                  style={{
                    boxShadow: isSpeaking
                      ? `0 0 0 3px ${lesson.color}70, 0 8px 0 rgba(0,0,0,0.08), 0 2px 20px rgba(0,0,0,0.06)`
                      : undefined,
                  }}>
                  {/* Photo */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-muted">
                    <img
                      src={w.photo}
                      alt={w.word}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{ transform: isSpeaking ? "scale(1.08)" : "scale(1)" }}
                    />
                  </div>
                  {/* Word */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-black text-2xl" style={{ color: lesson.color }}>
                        {w.word[0]}
                      </span>
                      <span className="font-bold text-xl text-foreground">{w.word.slice(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                      {isSpeaking ? "🔊 звучит..." : "нажми, чтобы услышать"}
                    </p>
                  </div>
                  {/* Play button */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: isSpeaking ? lesson.bg : "hsl(var(--muted))" }}>
                    <span className="text-lg">{isSpeaking ? "🔊" : "▶️"}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA button */}
          <button
            onClick={handleMicClick}
            className="btn-bounce w-full py-5 rounded-2xl font-black text-lg text-white relative overflow-hidden"
            style={{ background: lesson.bg, boxShadow: `0 6px 0 ${lesson.shadow}` }}>
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">🎤</span>
              Произнести «{lesson.letter}»
            </span>
          </button>
        </div>
      )}

      {/* ── MIC PHASE ── */}
      {phase === "mic" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          {/* Mic pulse ring */}
          <div className="relative mb-8">
            {speechState === "listening" && (
              <>
                <div className="absolute inset-0 rounded-full opacity-20 animate-ping" style={{ background: lesson.color }} />
                <div className="absolute -inset-4 rounded-full opacity-10 animate-ping" style={{ background: lesson.color, animationDelay: "0.3s" }} />
              </>
            )}
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
              style={{
                background: lesson.bg,
                boxShadow: speechState === "listening"
                  ? `0 0 0 8px ${lesson.color}30, 0 12px 40px ${lesson.color}55`
                  : `0 12px 40px ${lesson.color}40`,
                transform: speechState === "listening" ? "scale(1.05)" : "scale(1)",
              }}>
              <span className="font-black text-white leading-none" style={{ fontSize: "5.5rem" }}>
                {lesson.letter}
              </span>
            </div>
          </div>

          {/* Equalizer bars */}
          <div className="flex items-end gap-1 h-12 mb-6">
            {(volume.length > 0 ? volume : Array(12).fill(0)).map((v, i) => (
              <div
                key={i}
                className="w-2.5 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(8, v * 48)}px`,
                  background: speechState === "listening"
                    ? lesson.color
                    : "hsl(var(--muted-foreground))",
                  opacity: speechState === "listening" ? 0.7 + v * 0.3 : 0.3,
                }}
              />
            ))}
          </div>

          <p className="font-black text-xl text-foreground mb-1">
            {speechState === "listening" ? "Слушаю..." : "Обрабатываю..."}
          </p>
          <p className="font-semibold text-muted-foreground text-center text-sm">
            {speechState === "listening"
              ? <>Скажи букву <span className="font-black text-base" style={{ color: lesson.color }}>«{lesson.letter}»</span> вслух</>
              : "Подожди секунду ⏳"}
          </p>

          {speechState === "unsupported" && (
            <div className="mt-6 game-card p-4 text-center">
              <p className="font-bold text-sm text-muted-foreground">
                Браузер не поддерживает распознавание речи.<br />
                Попробуй Chrome или Safari.
              </p>
              <button onClick={handleRetry} className="mt-3 font-black text-sm" style={{ color: lesson.color }}>
                Назад
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── SUCCESS PHASE ── */}
      {phase === "success" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          <div style={{ animation: "bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} className="mb-3">
            <span className="text-8xl">🎉</span>
          </div>
          <h2 className="text-4xl font-black text-foreground mb-1">Отлично!</h2>
          {transcript && (
            <p className="text-muted-foreground font-semibold mb-2 text-sm">
              Я услышал: <span className="font-black text-foreground">«{transcript}»</span>
            </p>
          )}
          <p className="text-muted-foreground font-semibold text-center mb-7">
            Ты правильно произнёс букву{" "}
            <span className="font-black text-xl" style={{ color: lesson.color }}>«{lesson.letter}»</span>
          </p>

          <div className="flex gap-3 mb-8">
            {[1, 2, 3].map((s, i) => (
              <span
                key={s}
                className="text-5xl"
                style={{
                  animation: `bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards`,
                  animationDelay: `${0.1 + i * 0.12}s`,
                  opacity: 0,
                }}>
                {s <= stars ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <button
            onClick={handleComplete}
            className="btn-bounce w-full py-5 rounded-2xl font-black text-lg text-white"
            style={{
              background: "linear-gradient(135deg, hsl(var(--game-green)), hsl(142 60% 40%))",
              boxShadow: "0 6px 0 hsl(142 60% 35%)",
            }}>
            Получить награду 🏆
          </button>
        </div>
      )}

      {/* ── WRONG PHASE ── */}
      {phase === "wrong" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          <div style={{ animation: "bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }} className="mb-3">
            <span className="text-7xl">😅</span>
          </div>
          <h2 className="text-2xl font-black text-foreground mb-1">Попробуй ещё!</h2>
          {transcript && (
            <p className="text-muted-foreground font-semibold mb-1 text-sm">
              Я услышал: <span className="font-black text-foreground">«{transcript}»</span>
            </p>
          )}
          <p className="font-semibold text-muted-foreground text-center mb-6">
            Произнеси букву <span className="font-black text-lg" style={{ color: lesson.color }}>«{lesson.letter}»</span> чётко и громко
          </p>

          <div className="game-card p-4 mb-6 w-full">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 text-center">Подсказка</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{lesson.words[0].emoji}</span>
              <p className="font-black text-xl text-foreground">{lesson.words[0].word}</p>
            </div>
            <p className="text-center text-sm text-muted-foreground font-semibold mt-1">
              Скажи первую букву этого слова
            </p>
          </div>

          <button
            onClick={handleMicClick}
            className="btn-bounce w-full py-5 rounded-2xl font-black text-lg text-white mb-3"
            style={{ background: lesson.bg, boxShadow: `0 6px 0 ${lesson.shadow}` }}>
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">🎤</span>
              Попробовать снова
            </span>
          </button>

          <button
            onClick={handleRetry}
            className="w-full py-3 rounded-2xl font-bold text-sm text-muted-foreground">
            ← Вернуться к букве
          </button>
        </div>
      )}
    </div>
  );
}