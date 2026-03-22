import { useEffect, useState } from "react";
import { User, LessonResult } from "../App";

interface Props {
  result: LessonResult;
  user: User;
  onContinue: () => void;
}

const BADGES: Record<string, { emoji: string; title: string; desc: string }> = {
  first_letter: {
    emoji: "🌟",
    title: "Первая буква!",
    desc: "Выучил первую букву",
  },
  triple_combo: {
    emoji: "🔥",
    title: "Трио!",
    desc: "3 правильных ответа подряд",
  },
  perfect_lesson: {
    emoji: "💎",
    title: "Идеально!",
    desc: "Урок без ошибок",
  },
};

export default function RewardScreen({ result, user, onContinue }: Props) {
  const [showBadge, setShowBadge] = useState(false);
  const [particles, setParticles] = useState(true);

  const badge = result.badge ? BADGES[result.badge] : null;
  const isNewBadge = badge && !user.badges.slice(0, -1).includes(result.badge!);

  useEffect(() => {
    const t = setTimeout(() => setShowBadge(true), 600);
    const t2 = setTimeout(() => setParticles(false), 2000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, hsl(258 90% 66%) 0%, hsl(220 60% 97%) 60%)" }} />

      {/* Floating particles */}
      {particles && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {["⭐", "✨", "🌟", "💫", "🎉", "🎊"].map((e, i) => (
            <span
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${10 + i * 15}%`,
                top: `${5 + (i % 3) * 10}%`,
                animation: `confettiFall ${1.2 + i * 0.2}s ease-in forwards`,
                animationDelay: `${i * 0.15}s`,
              }}>
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Trophy */}
        <div className="bounce-in mb-2">
          <span className="text-8xl leading-none">🏆</span>
        </div>

        <h1 className="text-4xl font-black text-white mb-1 animate-fade-in">
          Молодец!
        </h1>
        <p className="text-white/80 font-bold text-lg mb-6 animate-fade-in">
          Урок пройден!
        </p>

        {/* Stars */}
        <div className="flex gap-4 justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="text-5xl"
              style={{
                animation: `bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                animationDelay: `${0.2 + s * 0.15}s`,
                opacity: 0,
              }}>
              {s <= result.stars ? "⭐" : "☆"}
            </div>
          ))}
        </div>

        {/* Stats card */}
        <div className="game-card p-5 mb-5 animate-slide-up">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: "hsl(var(--game-purple))" }}>
                +{result.stars * 10}
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Звёзды</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: "hsl(var(--game-green))" }}>
                {user.completedLessons.length}
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Уроков</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: "hsl(var(--game-orange))" }}>
                {user.streak}🔥
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Серия</p>
            </div>
          </div>
        </div>

        {/* New badge */}
        {badge && showBadge && (
          <div className="game-card p-5 mb-5 bounce-in border-2"
            style={{ borderColor: "hsl(var(--game-yellow))" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(var(--game-yellow)), hsl(40 100% 60%))" }}>
                {badge.emoji}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-black text-foreground">{badge.title}</p>
                  {isNewBadge && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                      style={{ background: "hsl(var(--game-orange))" }}>
                      НОВЫЙ!
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-semibold">{badge.desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="btn-bounce w-full py-5 rounded-2xl font-black text-xl text-white animate-fade-in"
          style={{
            background: "linear-gradient(135deg, hsl(var(--game-green)), hsl(142 60% 40%))",
            boxShadow: "0 8px 0 hsl(142 60% 35%)",
            animationDelay: "0.5s",
          }}>
          Продолжить! →
        </button>
      </div>
    </div>
  );
}
