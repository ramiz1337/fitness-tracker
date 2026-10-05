export interface Exercise {
  id: number;
  name: string;
  imageUrl?: string | null;
  reps: number;
  sets: number;
  force: number | string;
  level: number | string;
  mechanic: number | string;
  equipment: string;
  category: number | string;
  exerciseMuscles?: { muscle?: { name?: string } }[];
  instructions?: { order: number; text: string }[];
}

const levels = ["Beginner", "Intermediate", "Advanced"];
const categories = ["Stretching", "Plyometrics", "Strongman", "Strength"];
const forces = ["Push", "Pull", "Static"];
const mechanics = ["Compound", "Isolation"];

function enumLabel(value: number | string | undefined, values: string[], fallback: string) {
  if (typeof value === "number") return values[value] ?? fallback;
  if (typeof value === "string") {
    const numericValue = Number(value);
    return Number.isInteger(numericValue) ? values[numericValue] ?? fallback : value;
  }
  return fallback;
}

export function exerciseLevel(level: number | string) {
  return enumLabel(level, levels, "All levels");
}

export function exerciseCategory(category: number | string) {
  return enumLabel(category, categories, "Exercise");
}

export function exerciseForce(force: number | string) {
  return enumLabel(force, forces, "Movement");
}

export function exerciseMechanic(mechanic: number | string) {
  return enumLabel(mechanic, mechanics, "Movement");
}

export function exerciseMuscles(exercise: Exercise) {
  return (exercise.exerciseMuscles ?? [])
    .map(({ muscle }) => muscle?.name)
    .filter((name): name is string => Boolean(name));
}

export function exerciseDescription(exercise: Exercise) {
  const targetMuscles = exerciseMuscles(exercise);
  const target = targetMuscles.length ? targetMuscles.join(" and ") : "the muscles involved in this movement";
  const force = exerciseForce(exercise.force).toLowerCase();
  const mechanic = exerciseMechanic(exercise.mechanic).toLowerCase();
  const movementFocus = force === "push"
    ? "builds pressing strength"
    : force === "pull"
      ? "develops pulling strength"
      : "challenges your ability to hold steady tension";
  const equipment = exercise.equipment || "bodyweight";

  return `${exercise.name} is a ${exerciseLevel(exercise.level).toLowerCase()} ${exerciseCategory(exercise.category).toLowerCase()} ${mechanic} exercise that ${movementFocus}, with an emphasis on ${target}. Use ${equipment} for ${exercise.sets} sets of ${exercise.reps} reps, keeping each repetition controlled.`;
}
