import { useState } from "react";
import AuthScreen from "./pages/AuthScreen";
import MapScreen from "./pages/MapScreen";
import LessonScreen from "./pages/LessonScreen";
import ProfileScreen from "./pages/ProfileScreen";
import RewardScreen from "./pages/RewardScreen";

export type Screen = "auth" | "map" | "lesson" | "profile" | "reward";

export interface User {
  name: string;
  email: string;
  stars: number;
  level: number;
  completedLessons: number[];
  badges: string[];
  streak: number;
  isPremium: boolean;
}

export interface LessonResult {
  lessonId: number;
  stars: number;
  badge?: string;
}

const DEFAULT_USER: User = {
  name: "Маша",
  email: "masha@example.com",
  stars: 42,
  level: 1,
  completedLessons: [],
  badges: ["first_letter", "triple_combo"],
  streak: 5,
  isPremium: false,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("auth");
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [activeLessonId, setActiveLessonId] = useState<number>(101);
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);

  const navigate = (s: Screen) => setScreen(s);

  const startLesson = (id: number) => {
    setActiveLessonId(id);
    navigate("lesson");
  };

  const completeLesson = (result: LessonResult) => {
    setUser((u) => ({
      ...u,
      stars: u.stars + result.stars,
      completedLessons: u.completedLessons.includes(result.lessonId)
        ? u.completedLessons
        : [...u.completedLessons, result.lessonId],
      badges:
        result.badge && !u.badges.includes(result.badge)
          ? [...u.badges, result.badge]
          : u.badges,
    }));
    setLastResult(result);
    navigate("reward");
  };

  return (
    <div className="mobile-frame bg-background min-h-dvh font-nunito overflow-x-hidden">
      {screen === "auth" && <AuthScreen onLogin={() => navigate("map")} />}
      {screen === "map" && (
        <MapScreen
          user={user}
          onStartLesson={startLesson}
          onProfile={() => navigate("profile")}
        />
      )}
      {screen === "lesson" && (
        <LessonScreen
          lessonId={activeLessonId}
          user={user}
          onComplete={completeLesson}
          onBack={() => navigate("map")}
        />
      )}
      {screen === "profile" && (
        <ProfileScreen user={user} onBack={() => navigate("map")} />
      )}
      {screen === "reward" && lastResult && (
        <RewardScreen
          result={lastResult}
          user={user}
          onContinue={() => navigate("map")}
        />
      )}
    </div>
  );
}