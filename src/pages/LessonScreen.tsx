import { useState, useEffect, useRef } from "react";
import { User, LessonResult } from "../App";
import Icon from "@/components/ui/icon";

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
  },
};

const DEFAULT_LESSON = LETTER_DATA[4];

type Phase = "intro" | "learn" | "listen" | "success" | "wrong";

export default function LessonScreen({ lessonId, user, onComplete, onBack }: Props) {
  const lesson = LETTER_DATA[lessonId] || DEFAULT_LESSON;
  const [phase, setPhase] = useState<Phase>("intro");
  const [listenActive, setListenActive] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [stars, setStars] = useState(3);
  const [particles, setParticles] = useState<{ x: number; y: number; color: string; id: number }[]>([]);
  const particleId = useRef(0);

  const spawnParticles = () => {
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F59E0B"];
    const newParticles = Array.from({ length: 20 }, () => ({
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      id: particleId.current++,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  const handleListen = () => {
    setListenActive(true);
    setPhase("listen");

    // Simulate speech recognition (3 sec)
    setTimeout(() => {
      const correct = Math.random() > 0.3; // 70% chance success for demo
      if (correct) {
        spawnParticles();
        setPhase("success");
      } else {
        setAttempts((a) => a + 1);
        if (attempts >= 1) setStars((s) => Math.max(1, s - 1));
        setPhase("wrong");
      }
      setListenActive(false);
    }, 3000);
  };

  const handleRetry = () => {
    setPhase("learn");
  };

  const handleComplete = () => {
    onComplete({
      lessonId,
      stars,
      badge: lessonId === 4 ? "first_letter" : undefined,
    });
  };

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Confetti particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm pointer-events-none z-50 confetti-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.color,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted">
          <Icon name="X" size={20} />
        </button>
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`text-2xl transition-all ${s <= stars ? "opacity-100" : "opacity-30"}`}>
              ⭐
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-xl px-3 py-1.5">
          <span className="text-base">⭐</span>
          <span className="font-black text-sm">{user.stars}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-4">
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: phase === "intro" ? "10%" : phase === "learn" ? "40%" : phase === "listen" ? "70%" : "100%",
              background: lesson.bg,
            }}
          />
        </div>
      </div>

      {/* Content */}
      {(phase === "intro" || phase === "learn") && (
        <div className="flex-1 flex flex-col items-center px-5 py-4 animate-fade-in">
          <p className="font-bold text-muted-foreground text-sm mb-2 uppercase tracking-wide">
            {phase === "intro" ? "Знакомимся с буквой" : "Запомни букву"}
          </p>

          {/* Giant letter */}
          <div
            className="w-44 h-44 rounded-[2.5rem] flex items-center justify-center mb-6 letter-card float"
            style={{ background: lesson.bg }}>
            <span
              className="font-black leading-none"
              style={{ fontSize: "8rem", color: "white", textShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
              {lesson.letter}
            </span>
          </div>

          {/* Word cards */}
          <p className="font-bold text-muted-foreground text-sm mb-3 uppercase tracking-wide">
            Слова на букву {lesson.letter}:
          </p>
          <div className="w-full space-y-3 mb-6">
            {lesson.words.map((w, i) => (
              <div
                key={i}
                className="game-card flex items-center gap-4 px-5 py-3 animate-fade-in"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <span className="text-4xl">{w.emoji}</span>
                <div>
                  <span className="font-black text-xl text-foreground">{w.word}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className="font-black text-lg"
                      style={{ color: lesson.color }}>
                      {lesson.letter}
                    </span>
                    <span className="font-bold text-muted-foreground text-sm">
                      {w.word.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleListen}
            className="btn-bounce w-full py-5 rounded-2xl font-black text-lg text-white pulse-ring"
            style={{
              background: lesson.bg,
              boxShadow: `0 6px 0 ${lesson.color}88`,
            }}>
            🎤 Произнести букву {lesson.letter}
          </button>
        </div>
      )}

      {phase === "listen" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          <div
            className="w-48 h-48 rounded-full flex items-center justify-center mb-8 animate-pulse"
            style={{ background: lesson.bg }}>
            <span className="text-9xl font-black text-white">{lesson.letter}</span>
          </div>

          <div className="flex gap-3 mb-6">
            {[1, 2, 3].map((d) => (
              <div
                key={d}
                className="w-3 rounded-full"
                style={{
                  background: lesson.color,
                  animation: `float ${0.5 + d * 0.2}s ease-in-out infinite`,
                  height: `${20 + d * 12}px`,
                }}
              />
            ))}
          </div>

          <p className="font-black text-xl text-foreground mb-2">Слушаю...</p>
          <p className="font-semibold text-muted-foreground text-center">
            Произнеси букву <span style={{ color: lesson.color }} className="font-black">«{lesson.letter}»</span> вслух
          </p>
        </div>
      )}

      {phase === "success" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          <div className="bounce-in mb-4">
            <span className="text-8xl">🎉</span>
          </div>
          <h2 className="text-3xl font-black text-foreground mb-2">Отлично!</h2>
          <p className="font-bold text-muted-foreground text-center mb-8">
            Ты правильно произнёс букву<br />
            <span style={{ color: lesson.color }} className="font-black text-2xl">«{lesson.letter}»</span>
          </p>

          <div className="flex gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className="text-5xl star-shine"
                style={{ animationDelay: `${s * 0.15}s` }}>
                {s <= stars ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={handleComplete}
              className="btn-bounce w-full py-4 rounded-2xl font-black text-lg text-white"
              style={{
                background: "linear-gradient(135deg, hsl(var(--game-green)), hsl(142 60% 40%))",
                boxShadow: "0 6px 0 hsl(142 60% 35%)",
              }}>
              Получить награду 🏆
            </button>
          </div>
        </div>
      )}

      {phase === "wrong" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          <div className="bounce-in mb-4">
            <span className="text-8xl">😅</span>
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">Попробуй ещё!</h2>
          <p className="font-bold text-muted-foreground text-center mb-6">
            Не расстраивайся! Произнеси букву<br />
            <span style={{ color: lesson.color }} className="font-black text-2xl">«{lesson.letter}»</span> чётко и громко
          </p>

          <div className="game-card p-4 mb-6 w-full">
            <p className="text-sm font-bold text-muted-foreground mb-2 text-center">Подсказка:</p>
            <p className="text-center font-black text-lg">
              «А» как в слове {lesson.words[0].emoji} «{lesson.words[0].word}»
            </p>
          </div>

          <button
            onClick={handleRetry}
            className="btn-bounce w-full py-4 rounded-2xl font-black text-lg text-white"
            style={{
              background: lesson.bg,
              boxShadow: `0 6px 0 ${lesson.color}88`,
            }}>
            🎤 Попробовать снова
          </button>
        </div>
      )}
    </div>
  );
}
