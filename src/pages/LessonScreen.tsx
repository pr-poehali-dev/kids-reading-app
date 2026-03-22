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
  words: { word: string; emoji: string }[];
  color: string;
  bg: string;
  shadow: string;
}> = {
  4: {
    letter: "А",
    emoji: "🍎",
    words: [
      { word: "Арбуз", emoji: "🍉" },
      { word: "Апельсин", emoji: "🍊" },
      { word: "Аист", emoji: "🦢" },
    ],
    color: "hsl(0 85% 60%)",
    bg: "linear-gradient(135deg, hsl(0 85% 60%), hsl(350 85% 55%))",
    shadow: "hsl(0 85% 45%)",
  },
  5: {
    letter: "Г",
    emoji: "🦆",
    words: [
      { word: "Гусь", emoji: "🦆" },
      { word: "Груша", emoji: "🍐" },
      { word: "Гриб", emoji: "🍄" },
    ],
    color: "hsl(120 60% 45%)",
    bg: "linear-gradient(135deg, hsl(120 60% 45%), hsl(100 60% 40%))",
    shadow: "hsl(120 60% 32%)",
  },
  6: {
    letter: "Д",
    emoji: "🌳",
    words: [
      { word: "Дом", emoji: "🏠" },
      { word: "Дыня", emoji: "🍈" },
      { word: "Дельфин", emoji: "🐬" },
    ],
    color: "hsl(25 90% 55%)",
    bg: "linear-gradient(135deg, hsl(25 90% 55%), hsl(15 90% 50%))",
    shadow: "hsl(25 90% 40%)",
  },
};

const DEFAULT_LESSON = LETTER_DATA[4];

type Phase = "learn" | "mic" | "success" | "wrong";

export default function LessonScreen({ lessonId, user, onComplete, onBack }: Props) {
  const lesson = LETTER_DATA[lessonId] || DEFAULT_LESSON;
  const [phase, setPhase] = useState<Phase>("learn");
  const [attempts, setAttempts] = useState(0);
  const [stars, setStars] = useState(3);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; char: string }[]>([]);
  const confettiId = useRef(0);
  const { speak, stop, speaking } = useTTS();

  // Auto-speak letter when lesson loads
  useEffect(() => {
    const t = setTimeout(() => speak(`Буква ${lesson.letter}`), 600);
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
      badge: lessonId === 4 ? "first_letter" : undefined,
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
            onClick={() => speak(`Буква ${lesson.letter}`)}
            className="w-44 h-44 rounded-[2.5rem] flex flex-col items-center justify-center mb-6 shadow-xl relative transition-transform active:scale-95"
            style={{
              background: lesson.bg,
              boxShadow: speaking === `Буква ${lesson.letter}`
                ? `0 0 0 6px ${lesson.color}40, 0 16px 48px ${lesson.color}66`
                : `0 12px 40px ${lesson.color}55`,
              animation: "floatY 3s ease-in-out infinite",
            }}>
            <span className="font-black text-white leading-none" style={{ fontSize: "7rem", textShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
              {lesson.letter}
            </span>
            <span className="text-white/70 text-xs font-bold mt-1 flex items-center gap-1">
              {speaking === `Буква ${lesson.letter}` ? "🔊 звучит..." : "🔊 нажми"}
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
                  className="game-card w-full flex items-center gap-4 px-4 py-3.5 transition-all active:scale-98 text-left"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    boxShadow: isSpeaking
                      ? `0 0 0 3px ${lesson.color}60, 0 8px 0 rgba(0,0,0,0.08), 0 2px 20px rgba(0,0,0,0.06)`
                      : undefined,
                  }}>
                  <span className="text-4xl">{w.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-black text-xl" style={{ color: lesson.color }}>
                        {w.word[0]}
                      </span>
                      <span className="font-bold text-lg text-foreground">{w.word.slice(1)}</span>
                    </div>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: isSpeaking ? lesson.bg : "hsl(var(--muted))",
                    }}>
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