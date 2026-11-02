(function (root) {
  "use strict";
  const Quiz = typeof module !== "undefined" && module.exports ? require("./quiz.js") : root.AINavigatorQuiz;
  const STORAGE_KEY = "ai-navigator.progress.v2";
  const LEGACY_KEY = "ai-navigator.progress.v1";
  const ids = (values) => [...new Set(Array.isArray(values) ? values.filter((id) => Number.isInteger(id) && id >= 1 && id <= 5) : [])];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const empty = () => ({ version: 2, readLessonIds: [], startedLessonIds: [], legacyReadLessonIds: [], lesson2: { attempts: [], draft: null } });

  function normalizeDraft(draft) {
    if (!draft || draft.bankVersion !== Quiz.bankVersion || typeof draft.id !== "string" || !Quiz.validQuestionIds(draft.questionIds)) return null;
    const answers = {};
    for (const id of draft.questionIds) {
      const question = Quiz.byId.get(id);
      const choices = Array.isArray(draft.answers?.[id]) ? draft.answers[id] : [];
      answers[id] = [...new Set(choices.filter((choice) => question.options.some((option) => option.id === choice)))];
      if (question.type === "single") answers[id] = answers[id].slice(0, 1);
    }
    return { id: draft.id, bankVersion: Quiz.bankVersion, questionIds: [...draft.questionIds], answers };
  }

  function normalize(saved) {
    if (!saved || saved.version !== 2 || !Array.isArray(saved.readLessonIds) || !Array.isArray(saved.lesson2?.attempts)) throw new Error("invalid-data");
    const state = empty();
    state.readLessonIds = ids(saved.readLessonIds);
    state.legacyReadLessonIds = ids(saved.legacyReadLessonIds);
    state.startedLessonIds = ids([...(Array.isArray(saved.startedLessonIds) ? saved.startedLessonIds : []), ...state.readLessonIds]);
    state.lesson2.draft = normalizeDraft(saved.lesson2.draft);
    const seen = new Set();
    for (const attempt of saved.lesson2.attempts) {
      const draft = normalizeDraft(attempt);
      if (!draft || seen.has(draft.id)) continue;
      const result = Quiz.evaluate(draft.questionIds, draft.answers);
      if (!result.complete) continue;
      seen.add(draft.id);
      state.lesson2.attempts.push({ ...draft, finishedAt: typeof attempt.finishedAt === "string" ? attempt.finishedAt : null, ...result });
    }
    if (state.lesson2.draft || state.lesson2.attempts.length) state.startedLessonIds = ids([...state.startedLessonIds, 2]);
    if (state.lesson2.attempts.length) state.readLessonIds = ids([...state.readLessonIds, 2]);
    return state;
  }

  function migrate(legacy) {
    if (!legacy || legacy.version !== 1 || !Array.isArray(legacy.completedLessonIds)) throw new Error("invalid-data");
    const state = empty();
    state.readLessonIds = ids(legacy.completedLessonIds);
    state.startedLessonIds = [...state.readLessonIds];
    state.legacyReadLessonIds = [...state.readLessonIds];
    return state;
  }

  function isMastered(state, lessonId) {
    return lessonId === 2 && state.lesson2.attempts.some((attempt) => attempt.passed);
  }

  function status(state, lessonId) {
    if (isMastered(state, lessonId)) return { key: "mastered", label: "Освоен" };
    if (lessonId === 2 && state.lesson2.attempts.length) return { key: "failed", label: "Тест не пройден" };
    if (state.startedLessonIds.includes(lessonId) || state.readLessonIds.includes(lessonId)) return { key: "in-progress", label: "В процессе" };
    return { key: "not-started", label: "Не начат" };
  }

  function createStore(storage, onWarning = () => {}) {
    let state = empty();
    let saveFailed = false;
    let futureVersion = false;

    function persist() {
      if (futureVersion) {
        onWarning("Данные созданы более новой версией приложения. Они сохранены без изменений; текущие действия действуют только до перезагрузки.");
        return;
      }
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
        saveFailed = false;
        onWarning("");
      } catch {
        saveFailed = true;
        onWarning("Не удалось сохранить данные в браузере. Новые ответы и результаты действуют только до перезагрузки. Проверьте доступ к хранилищу.");
      }
    }

    function refresh() {
      if (saveFailed || futureVersion) return;
      try {
        const raw = storage.getItem(STORAGE_KEY);
        if (raw !== null) {
          const saved = JSON.parse(raw);
          if (typeof saved?.version === "number" && saved.version > 2) {
            futureVersion = true;
            onWarning("Обнаружен более новый формат прогресса. Данные не будут перезаписаны этой версией приложения.");
            return;
          }
          state = normalize(saved);
          return;
        }
        const legacy = storage.getItem(LEGACY_KEY);
        state = legacy === null ? empty() : migrate(JSON.parse(legacy));
        if (legacy !== null) persist();
      } catch (error) {
        const corrupt = error instanceof SyntaxError || error.message === "invalid-data";
        onWarning(corrupt
          ? "Сохранённые данные повреждены. Можно учиться дальше; следующая запись восстановит формат. Старые отметки MVP не удаляются."
          : "Браузер не разрешает читать данные. Новые ответы и результаты могут исчезнуть после перезагрузки.");
      }
    }

    function update(change) {
      refresh();
      change(state);
      persist();
      return clone(state);
    }

    refresh();
    return {
      snapshot: () => clone(state),
      canPersist: () => !saveFailed && !futureVersion,
      refresh() { refresh(); return clone(state); },
      markStarted(id) {
        refresh();
        if (state.startedLessonIds.includes(id)) return clone(state);
        return update((current) => { current.startedLessonIds = ids([...current.startedLessonIds, id]); });
      },
      toggleRead(id) {
        if (id === 2) throw new Error("Освоение урока 2 подтверждается только тестом.");
        return update((current) => {
          current.readLessonIds = current.readLessonIds.includes(id) ? current.readLessonIds.filter((value) => value !== id) : ids([...current.readLessonIds, id]);
          current.startedLessonIds = ids([...current.startedLessonIds, id]);
        });
      },
      startQuiz() {
        return update((current) => {
          current.startedLessonIds = ids([...current.startedLessonIds, 2]);
          if (!current.lesson2.draft) current.lesson2.draft = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            bankVersion: Quiz.bankVersion, questionIds: Quiz.selectQuestions(), answers: {}
          };
        });
      },
      answerQuiz(draftId, questionId, choices) {
        return update((current) => {
          if (current.lesson2.draft?.id !== draftId) throw new Error("Попытка изменилась в другой вкладке. Откройте тест заново.");
          if (!current.lesson2.draft.questionIds.includes(questionId)) throw new Error("Неизвестный вопрос.");
          current.lesson2.draft.answers[questionId] = choices;
          current.lesson2.draft = normalizeDraft(current.lesson2.draft);
        });
      },
      submitQuiz(draftId, answers) {
        return update((current) => {
          const draft = current.lesson2.draft;
          if (draft?.id !== draftId) throw new Error("Попытка уже завершена или изменилась в другой вкладке. Откройте тест заново.");
          const result = Quiz.evaluate(draft.questionIds, answers);
          if (!result.complete) throw new Error("Ответьте на все пять вопросов.");
          current.lesson2.attempts.push({ ...draft, answers: clone(answers), finishedAt: new Date().toISOString(), ...result });
          current.lesson2.draft = null;
          current.readLessonIds = ids([...current.readLessonIds, 2]);
        });
      }
    };
  }

  const api = { STORAGE_KEY, LEGACY_KEY, empty, normalize, migrate, status, isMastered, createStore };
  root.AINavigatorProgress = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(globalThis);
