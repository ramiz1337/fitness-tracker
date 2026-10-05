"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import type { Exercise } from "../lib/exercises";
import { exerciseCategory, exerciseDescription, exerciseLevel, exerciseMuscles } from "../lib/exercises";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");

  useEffect(() => {
    let isCurrent = true;
    apiRequest<Exercise[]>("/exercises")
      .then((results) => {
        if (isCurrent) setExercises(results);
      })
      .catch((loadError: unknown) => {
        if (isCurrent) setError(loadError instanceof Error ? loadError.message : "Unable to load exercises.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const categories = Array.from(new Set(exercises.map((exercise) => exerciseCategory(exercise.category)))).sort();
  const levels = Array.from(new Set(exercises.map((exercise) => exerciseLevel(exercise.level)))).sort();
  const muscles = Array.from(new Set(exercises.flatMap(exerciseMuscles))).sort();
  const equipmentOptions = Array.from(new Set(exercises.map((exercise) => exercise.equipment).filter(Boolean))).sort();
  const normalizedSearch = search.trim().toLowerCase();
  const filteredExercises = exercises.filter((exercise) => {
    const exerciseMuscleNames = exerciseMuscles(exercise);
    const searchableText = [
      exercise.name,
      exercise.equipment,
      exerciseCategory(exercise.category),
      ...exerciseMuscleNames,
    ].join(" ").toLowerCase();

    return (
      (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
      (!selectedCategory || exerciseCategory(exercise.category) === selectedCategory) &&
      (!selectedLevel || exerciseLevel(exercise.level) === selectedLevel) &&
      (!selectedMuscle || exerciseMuscleNames.includes(selectedMuscle)) &&
      (!selectedEquipment || exercise.equipment === selectedEquipment)
    );
  });
  const hasActiveFilters = Boolean(search || selectedCategory || selectedLevel || selectedMuscle || selectedEquipment);

  return (
    <main className="mt-24 grow bg-[#f6f8f4] px-4 pb-16 pt-10 text-stone-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 overflow-hidden rounded-3xl bg-[#14251c] px-6 py-9 text-white shadow-xl sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Move with confidence</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Exercise library</h1>
          <p className="mt-3 max-w-2xl leading-7 text-green-50/75">
            Explore your next movement, understand the muscles it works, and get clear steps for doing it well.
          </p>
        </section>

        {error && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}

        {isLoading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-stone-500">Loading exercises…</div>
        ) : exercises.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center text-stone-600">
            {error ? "Exercises could not be loaded." : "No exercises are available yet."}
          </div>
        ) : (
          <>
            <section aria-label="Filter exercises" className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
                <label className="text-xs font-bold uppercase tracking-wide text-stone-500">
                  Search
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, muscle, equipment…"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-[#fbfcfa] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-stone-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </label>
                {[
                  { label: "Category", allLabel: "categories", value: selectedCategory, onChange: setSelectedCategory, options: categories },
                  { label: "Level", allLabel: "levels", value: selectedLevel, onChange: setSelectedLevel, options: levels },
                  { label: "Muscle", allLabel: "muscles", value: selectedMuscle, onChange: setSelectedMuscle, options: muscles },
                  { label: "Equipment", allLabel: "equipment", value: selectedEquipment, onChange: setSelectedEquipment, options: equipmentOptions },
                ].map((filter) => (
                  <label key={filter.label} className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    {filter.label}
                    <span className="relative mt-1.5 block">
                      <select
                        value={filter.value}
                        onChange={(event) => filter.onChange(event.target.value)}
                        className="w-full appearance-none rounded-xl border border-stone-200 bg-gradient-to-b from-white to-green-50/60 px-3 py-2.5 pr-9 text-sm font-semibold normal-case tracking-normal text-stone-800 shadow-sm outline-none transition hover:border-green-300 hover:shadow focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      >
                        <option value="">All {filter.allLabel}</option>
                        {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-800">⌄</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-3">
                <p aria-live="polite" className="text-sm text-stone-500">
                  Showing <span className="font-bold text-stone-800">{filteredExercises.length}</span> of {exercises.length} exercises
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("");
                      setSelectedLevel("");
                      setSelectedMuscle("");
                      setSelectedEquipment("");
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-bold text-green-900 hover:bg-green-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </section>

            {filteredExercises.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
                <h2 className="text-lg font-bold text-stone-900">No exercises match those filters</h2>
                <p className="mt-2 text-sm text-stone-500">Try changing your search or clearing a filter.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((exercise) => {
                  const imageUrl = exercise.imageUrl?.trim();
                  const targetMuscles = exerciseMuscles(exercise);
                  return (
                    <article key={exercise.id} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                      <Link href={`/exercises/${exercise.id}`} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700">
                        <div className="relative flex h-48 items-end overflow-hidden bg-gradient-to-br from-[#1d3929] via-[#315941] to-[#a4b984] p-5">
                          {imageUrl ? (
                            <img src={imageUrl} alt="" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" />
                          ) : (
                            <div aria-hidden="true" className="absolute -right-5 -top-12 size-48 rounded-full border-[28px] border-white/10" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          <span className="relative rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                            {exerciseCategory(exercise.category)}
                          </span>
                          <span aria-hidden="true" className="relative ml-auto flex size-10 items-center justify-center rounded-full bg-lime-300 font-bold text-[#14251c] transition group-hover:translate-x-1">↗</span>
                        </div>
                        <div className="p-5">
                          <h2 className="text-xl font-extrabold leading-snug text-stone-900">{exercise.name}</h2>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-900">{exerciseLevel(exercise.level)}</span>
                            {exercise.equipment && <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{exercise.equipment}</span>}
                          </div>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{exerciseDescription(exercise)}</p>
                          <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-sm">
                            <span className="font-semibold text-stone-500">{targetMuscles.slice(0, 2).join(" · ") || "Full body movement"}</span>
                            <span className="shrink-0 font-bold text-green-900">{exercise.sets} × {exercise.reps}</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
