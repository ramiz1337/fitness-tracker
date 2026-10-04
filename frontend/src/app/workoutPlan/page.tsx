"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest, getStoredUser } from "../lib/api";

interface Exercise {
  id: number;
  name: string;
  equipment?: string;
  level?: string;
}

interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  order: number;
  sets: number;
  reps: number;
}

interface Workout {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  authorId: number;
  authorName: string;
  createdAt: string;
  exercises: WorkoutExercise[];
}

interface WorkoutComment {
  id: number;
  text: string;
  stars: number;
  createdAt: string;
  authorId: number;
  authorName: string;
  workoutId: number;
}

interface PlanExerciseDraft {
  exerciseId: number;
  sets: number;
  reps: number;
}

type PlanTab = "mine" | "used" | "discover";

const tabs: { id: PlanTab; label: string }[] = [
  { id: "mine", label: "My plans" },
  { id: "used", label: "Saved plans" },
  { id: "discover", label: "Discover" },
];

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={label}>
      <span className="tracking-wide text-amber-500" aria-hidden="true">
        {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      </span>
      <span className="text-sm font-semibold text-stone-700">{label}</span>
    </span>
  );
}

export default function WorkoutPlansPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [usedWorkoutIds, setUsedWorkoutIds] = useState<Set<number>>(new Set());
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [comments, setComments] = useState<WorkoutComment[]>([]);
  const [reviewsByWorkout, setReviewsByWorkout] = useState<Record<number, WorkoutComment[]>>({});
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [tab, setTab] = useState<PlanTab>("mine");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [draftExercises, setDraftExercises] = useState<PlanExerciseDraft[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentStars, setCommentStars] = useState(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);
  const [savingWorkoutId, setSavingWorkoutId] = useState<number | null>(null);
  const savingWorkoutIdRef = useRef<number | null>(null);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const user = getStoredUser();
      const userId = Number(user.id);
      if (!Number.isFinite(userId)) {
        throw new Error("Your saved user information is invalid. Please sign in again.");
      }
      setCurrentUserId(userId);
      const [mine, used, publicWorkouts, availableExercises] = await Promise.all([
        apiRequest<Workout[]>("/workouts/mine", user.token),
        apiRequest<Workout[]>("/workouts/used", user.token),
        apiRequest<Workout[]>("/workouts"),
        apiRequest<Exercise[]>("/exercises"),
      ]);
      const byId = new Map<number, Workout>();
      [...mine, ...used, ...publicWorkouts].forEach((workout) => byId.set(workout.id, workout));
      setWorkouts(Array.from(byId.values()));
      setUsedWorkoutIds(new Set(used.map((workout) => workout.id)));
      setExercises(availableExercises);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load workout plans.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const publicWorkouts = workouts.filter((workout) => workout.isPublic);
    if (publicWorkouts.length === 0) {
      setReviewsByWorkout({});
      return;
    }

    let isCurrent = true;
    Promise.all(publicWorkouts.map(async (workout) => [
      workout.id,
      await apiRequest<WorkoutComment[]>(`/workouts/comment/workout/${workout.id}`),
    ] as const))
      .then((reviews) => {
        if (isCurrent) setReviewsByWorkout(Object.fromEntries(reviews));
      })
      .catch((reviewError: unknown) => {
        if (isCurrent) {
          setError(reviewError instanceof Error ? reviewError.message : "Unable to load workout ratings.");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [workouts]);

  const visibleWorkouts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return workouts.filter((workout) => {
      const matchesSearch =
        !normalizedSearch ||
        workout.name.toLowerCase().includes(normalizedSearch) ||
        (workout.description || "").toLowerCase().includes(normalizedSearch) ||
        workout.authorName.toLowerCase().includes(normalizedSearch);
      if (!matchesSearch) return false;
      if (tab === "mine") return workout.authorId === currentUserId;
      if (tab === "used") return usedWorkoutIds.has(workout.id) && workout.authorId !== currentUserId;
      return workout.isPublic && workout.authorId !== currentUserId && !usedWorkoutIds.has(workout.id);
    });
  }, [currentUserId, search, tab, usedWorkoutIds, workouts]);

  const openWorkout = async (workout: Workout) => {
    setSelectedWorkout(workout);
    setComments([]);
    setCommentText("");
    setCommentStars(5);
    setFormError("");
    setNotice("");
    try {
      const workoutComments = await apiRequest<WorkoutComment[]>(
        `/workouts/comment/workout/${workout.id}`,
      );
      setComments(workoutComments);
      setReviewsByWorkout((previous) => ({ ...previous, [workout.id]: workoutComments }));
    } catch (commentError) {
      setFormError(commentError instanceof Error ? commentError.message : "Unable to load comments.");
    }
  };

  const createWorkout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setNotice("");
    if (draftExercises.length === 0) {
      setFormError("Add at least one exercise to your workout.");
      return;
    }

    setIsSavingWorkout(true);
    try {
      const user = getStoredUser();
      const workout = await apiRequest<Workout>("/workouts", user.token, {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          isPublic,
          exercises: draftExercises,
        }),
      });
      setWorkouts((previous) => [workout, ...previous.filter((item) => item.id !== workout.id)]);
      setName("");
      setDescription("");
      setIsPublic(true);
      setDraftExercises([]);
      setIsCreating(false);
      setTab("mine");
      setNotice("Your workout plan has been saved.");
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : "Unable to save this plan.");
    } finally {
      setIsSavingWorkout(false);
    }
  };

  const useWorkout = async (workout: Workout) => {
    if (savingWorkoutIdRef.current === workout.id || usedWorkoutIds.has(workout.id)) return;
    savingWorkoutIdRef.current = workout.id;
    setSavingWorkoutId(workout.id);
    setFormError("");
    setNotice("");
    try {
      const user = getStoredUser();
      await apiRequest<void>(`/workouts/${workout.id}/use`, user.token, { method: "POST" });
      setUsedWorkoutIds((previous) => new Set(previous).add(workout.id));
      setNotice(`“${workout.name}” has been added to your saved plans.`);
      setTab("used");
      await loadData();
    } catch (useError) {
      setFormError(useError instanceof Error ? useError.message : "Unable to save this workout.");
    } finally {
      savingWorkoutIdRef.current = null;
      setSavingWorkoutId(null);
    }
  };

  const submitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWorkout) return;
    setFormError("");
    setNotice("");
    setIsSubmittingComment(true);
    try {
      const user = getStoredUser();
      const newComment = await apiRequest<WorkoutComment>("/workouts/comment", user.token, {
        method: "POST",
        body: JSON.stringify({
          workoutId: selectedWorkout.id,
          text: commentText.trim(),
          stars: commentStars,
        }),
      });
      setComments((previous) => [newComment, ...previous]);
      setReviewsByWorkout((previous) => ({
        ...previous,
        [selectedWorkout.id]: [newComment, ...(previous[selectedWorkout.id] || [])],
      }));
      setCommentText("");
      setNotice("Your comment and rating have been added.");
    } catch (commentError) {
      setFormError(commentError instanceof Error ? commentError.message : "Unable to add your review.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const deleteWorkout = async (workout: Workout) => {
    if (!window.confirm(`Delete “${workout.name}”? This cannot be undone.`)) return;
    setFormError("");
    try {
      const user = getStoredUser();
      await apiRequest<void>(`/workouts/${workout.id}`, user.token, { method: "DELETE" });
      setWorkouts((previous) => previous.filter((item) => item.id !== workout.id));
      setSelectedWorkout(null);
      setNotice("Workout plan deleted.");
    } catch (deleteError) {
      setFormError(deleteError instanceof Error ? deleteError.message : "Unable to delete this plan.");
    }
  };

  const selectedAverage =
    comments.length > 0 ? comments.reduce((total, comment) => total + comment.stars, 0) / comments.length : 0;
  const alreadyReviewed = comments.some((comment) => comment.authorId === currentUserId);

  return (
    <main className="mt-24 grow bg-[#f6f8f4] px-4 pb-16 pt-10 text-stone-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 overflow-hidden rounded-3xl bg-[#14251c] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-lime-300">
                Train with purpose
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Workout plans</h1>
              <p className="mt-3 max-w-xl leading-7 text-green-50/75">
                Build a routine that works for you, save plans from the community, and share your training with others.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCreating((open) => !open);
                setFormError("");
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 py-3 font-bold text-[#14251c] transition hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
            >
              <span aria-hidden="true" className="text-xl leading-none">+</span>
              {isCreating ? "Close builder" : "Create a plan"}
            </button>
          </div>
        </section>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {notice}
          </div>
        )}

        {isCreating && (
          <form onSubmit={createWorkout} className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Build your workout</h2>
              <p className="mt-1 text-sm text-stone-500">Add exercises and choose whether everyone can discover your plan.</p>
            </div>
            {formError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-stone-700">
                Plan name
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="e.g. Upper-body strength"
                />
              </label>
              <label className="text-sm font-semibold text-stone-700">
                Description <span className="font-normal text-stone-400">(optional)</span>
                <input
                  maxLength={500}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="What is this plan designed for?"
                />
              </label>
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-green-50 p-4 text-sm">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
                className="mt-0.5 size-4 accent-green-700"
              />
              <span>
                <span className="block font-bold text-stone-800">Share publicly</span>
                <span className="mt-0.5 block text-stone-600">Other members can discover, save, comment on, and rate this plan.</span>
              </span>
            </label>
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold">Exercises</h3>
                <button
                  type="button"
                  onClick={() => setDraftExercises((previous) => [...previous, { exerciseId: 0, sets: 3, reps: 10 }])}
                  className="rounded-lg border border-green-700 px-3 py-2 text-sm font-bold text-green-800 transition hover:bg-green-50"
                >
                  + Add exercise
                </button>
              </div>
              {draftExercises.length === 0 && (
                <p className="rounded-xl border border-dashed border-stone-300 p-5 text-center text-sm text-stone-500">
                  Add at least one exercise to get started.
                </p>
              )}
              <div className="space-y-3">
                {draftExercises.map((draft, index) => (
                  <div key={index} className="grid gap-3 rounded-xl bg-stone-50 p-3 sm:grid-cols-[minmax(0,1fr)_110px_110px_auto] sm:items-end">
                    <label className="text-xs font-bold uppercase tracking-wide text-stone-500">
                      Exercise
                      <select
                        required
                        value={draft.exerciseId || ""}
                        onChange={(event) => {
                          const exerciseId = Number(event.target.value);
                          setDraftExercises((previous) => previous.map((item, itemIndex) => itemIndex === index ? { ...item, exerciseId } : item));
                        }}
                        className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-stone-800"
                      >
                        <option value="" disabled>Select an exercise</option>
                        {exercises.filter((exercise) => exercise.id === draft.exerciseId || !draftExercises.some((item, itemIndex) => itemIndex !== index && item.exerciseId === exercise.id)).map((exercise) => (
                          <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-bold uppercase tracking-wide text-stone-500">
                      Sets
                      <input
                        type="number"
                        min={1}
                        max={100}
                        required
                        value={draft.sets}
                        onChange={(event) => setDraftExercises((previous) => previous.map((item, itemIndex) => itemIndex === index ? { ...item, sets: Number(event.target.value) } : item))}
                        className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal text-stone-800"
                      />
                    </label>
                    <label className="text-xs font-bold uppercase tracking-wide text-stone-500">
                      Reps
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        required
                        value={draft.reps}
                        onChange={(event) => setDraftExercises((previous) => previous.map((item, itemIndex) => itemIndex === index ? { ...item, reps: Number(event.target.value) } : item))}
                        className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal text-stone-800"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setDraftExercises((previous) => previous.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label={`Remove exercise ${index + 1}`}
                      className="rounded-lg px-3 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setIsCreating(false)} className="rounded-xl px-4 py-3 font-semibold text-stone-600 hover:bg-stone-100">
                Cancel
              </button>
              <button disabled={isSavingWorkout} className="rounded-xl bg-green-800 px-5 py-3 font-bold text-white transition hover:bg-green-900 disabled:cursor-wait disabled:opacity-60">
                {isSavingWorkout ? "Saving…" : "Save workout plan"}
              </button>
            </div>
          </form>
        )}

        <section aria-label="Workout plans">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Plan categories">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition ${tab === item.id ? "bg-green-800 text-white shadow-sm" : "bg-white text-stone-600 hover:bg-green-50"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="relative block w-full md:max-w-xs">
              <span className="sr-only">Search workout plans</span>
              <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search plans"
                className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-9 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          {isLoading ? (
            <div className="rounded-2xl bg-white p-12 text-center text-stone-500">Loading workout plans…</div>
          ) : visibleWorkouts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-50 text-2xl text-green-800" aria-hidden="true">↗</div>
              <h2 className="text-lg font-bold">{search ? "No matching plans" : tab === "mine" ? "No plans yet" : tab === "used" ? "No saved plans yet" : "No public plans found"}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                {tab === "mine" ? "Create your first workout plan and build a routine that fits your goals." : "Try another category or search for a different workout."}
              </p>
              {tab === "mine" && (
                <button onClick={() => setIsCreating(true)} className="mt-5 rounded-xl bg-green-800 px-5 py-3 font-bold text-white hover:bg-green-900">
                  Create your first plan
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleWorkouts.map((workout) => {
                const ratingComments = reviewsByWorkout[workout.id] || [];
                const averageRating = ratingComments.length
                  ? ratingComments.reduce((total, comment) => total + comment.stars, 0) / ratingComments.length
                  : 0;
                return (
                  <article key={workout.id} className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <button onClick={() => void openWorkout(workout)} className="text-left focus-visible:outline-2 focus-visible:outline-green-700">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${workout.isPublic ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-600"}`}>
                          {workout.isPublic ? "Public" : "Private"}
                        </span>
                        <span className="text-xs text-stone-400">{workout.exercises.length} {workout.exercises.length === 1 ? "exercise" : "exercises"}</span>
                      </div>
                      <h2 className="text-xl font-extrabold leading-snug text-stone-900">{workout.name}</h2>
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-stone-500">{workout.description || "A focused training plan, ready to add to your routine."}</p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-400">By {workout.authorName}</p>
                      <ul className="mt-4 space-y-2 border-t border-stone-100 pt-4">
                        {workout.exercises.slice(0, 3).map((exercise) => (
                          <li key={`${workout.id}-${exercise.exerciseId}`} className="flex justify-between gap-3 text-sm">
                            <span className="truncate font-medium text-stone-700">{exercise.exerciseName}</span>
                            <span className="shrink-0 text-stone-500">{exercise.sets} × {exercise.reps}</span>
                          </li>
                        ))}
                        {workout.exercises.length > 3 && <li className="text-xs text-green-800">+{workout.exercises.length - 3} more</li>}
                      </ul>
                    </button>
                    <div className="mt-auto border-t border-stone-100 pt-4">
                      <div className="mb-3">
                        {averageRating ? (
                          <StarRating rating={averageRating} label={`${averageRating.toFixed(1)} · ${ratingComments.length} ${ratingComments.length === 1 ? "rating" : "ratings"}`} />
                        ) : (
                          <span className="text-sm text-stone-400">No ratings yet</span>
                        )}
                      </div>
                      {workout.authorId === currentUserId ? (
                        <button onClick={() => void deleteWorkout(workout)} className="w-full rounded-lg border border-red-200 px-3 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50">
                          Delete plan
                        </button>
                      ) : usedWorkoutIds.has(workout.id) ? (
                        <button disabled className="w-full cursor-default rounded-lg bg-green-50 px-3 py-2.5 text-sm font-bold text-green-800">
                          ✓ Added to your plans
                        </button>
                      ) : (
                        <button
                          disabled={savingWorkoutId === workout.id}
                          onClick={() => void useWorkout(workout)}
                          className="w-full rounded-lg bg-green-800 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-green-900 disabled:cursor-wait disabled:opacity-60"
                        >
                          {savingWorkoutId === workout.id ? "Saving…" : "Save workout"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedWorkout(null);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="workout-dialog-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedWorkout.isPublic ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-600"}`}>
                  {selectedWorkout.isPublic ? "Community plan" : "Private plan"}
                </span>
                <h2 id="workout-dialog-title" className="mt-3 text-2xl font-extrabold">{selectedWorkout.name}</h2>
                <p className="mt-1 text-sm text-stone-500">Created by {selectedWorkout.authorName}</p>
              </div>
              <button onClick={() => setSelectedWorkout(null)} aria-label="Close workout details" className="rounded-full p-2 text-2xl leading-none text-stone-400 hover:bg-stone-100">×</button>
            </div>
            {selectedWorkout.description && <p className="mt-4 leading-6 text-stone-600">{selectedWorkout.description}</p>}
            <div className="mt-6 rounded-2xl bg-[#f6f8f4] p-4">
              <h3 className="font-bold">Plan exercises</h3>
              <ul className="mt-3 divide-y divide-stone-200">
                {selectedWorkout.exercises.map((exercise) => (
                  <li key={`${selectedWorkout.id}-${exercise.exerciseId}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="font-semibold">{exercise.order}. {exercise.exerciseName}</span>
                    <span className="rounded-lg bg-white px-3 py-1.5 font-bold text-green-900">{exercise.sets} sets × {exercise.reps} reps</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-extrabold">Community reviews</h3>
                {comments.length > 0 ? (
                  <StarRating rating={selectedAverage} label={`${selectedAverage.toFixed(1)} average · ${comments.length} ${comments.length === 1 ? "review" : "reviews"}`} />
                ) : <span className="text-sm text-stone-500">No ratings yet</span>}
              </div>
              {selectedWorkout.isPublic && (
                alreadyReviewed ? (
                  <p className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-900">You’ve already reviewed this plan. Thanks for sharing your feedback.</p>
                ) : (
                  <form onSubmit={submitComment} className="mt-4 rounded-2xl border border-stone-200 p-4">
                    <label htmlFor="review-text" className="text-sm font-bold">Leave a comment and rating</label>
                    <div className="my-3 flex items-center gap-1" role="radiogroup" aria-label="Your star rating">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          role="radio"
                          aria-checked={commentStars === stars}
                          aria-label={`${stars} ${stars === 1 ? "star" : "stars"}`}
                          onClick={() => setCommentStars(stars)}
                          className={`rounded p-1 text-2xl focus-visible:outline-2 focus-visible:outline-green-700 ${stars <= commentStars ? "text-amber-500" : "text-stone-300"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      id="review-text"
                      required
                      maxLength={500}
                      rows={3}
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      placeholder="How did this plan work for you?"
                      className="w-full resize-y rounded-xl border border-stone-300 p-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                    <button disabled={isSubmittingComment} className="mt-3 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-900 disabled:opacity-60">
                      {isSubmittingComment ? "Posting…" : "Post review"}
                    </button>
                  </form>
                )
              )}
              {formError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
              {notice && <p role="status" className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
              <ul className="mt-4 space-y-3">
                {comments.map((comment) => (
                  <li key={comment.id} className="rounded-xl bg-stone-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-stone-800">{comment.authorName}</span>
                      <span className="text-sm tracking-wide text-amber-500" aria-label={`${comment.stars} out of 5 stars`}>
                        {"★".repeat(comment.stars)}{"☆".repeat(5 - comment.stars)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{comment.text}</p>
                    <time className="mt-2 block text-xs text-stone-400" dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time>
                  </li>
                ))}
                {comments.length === 0 && <li className="py-5 text-center text-sm text-stone-500">Be the first to leave a rating.</li>}
              </ul>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
