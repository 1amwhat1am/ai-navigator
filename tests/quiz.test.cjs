const { test } = require('node:test');
const assert = require('node:assert/strict');
const bank = require('../questions.js');
const Quiz = require('../quiz.js');
const Progress = require('../progress.js');

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
function answersFor(ids, correctCount) {
  return Object.fromEntries(ids.map((id, index) => {
    const q = Quiz.byId.get(id);
    return [id, index < correctCount ? [...q.correctIds] : [q.options.find((o) => !q.correctIds.includes(o.id)).id]];
  }));
}
function submit(store, correctCount) {
  const draft = store.startQuiz().lesson2.draft;
  return store.submitQuiz(draft.id, answersFor(draft.questionIds, correctCount));
}

test('Банк: минимум 10 корректных прикладных вопросов, два типа и ситуации', () => {
  assert.ok(bank.questions.length >= 10);
  assert.equal(new Set(bank.questions.map((q) => q.id)).size, bank.questions.length);
  assert.ok(bank.questions.filter((q) => q.situational).length >= 2);
  for (const q of bank.questions) {
    assert.ok(q.explanation.length > 30);
    assert.equal(new Set(q.options.map((o) => o.id)).size, q.options.length);
    assert.ok(q.correctIds.every((id) => q.options.some((o) => o.id === id)));
    assert.ok(q.correctIds.length > 0 && q.correctIds.length < q.options.length);
    assert.equal(q.type === 'single', q.correctIds.length === 1);
  }
});
test('Каждая выборка: 5 разных вопросов, минимум 2 ситуации и оба типа', () => {
  const variants = new Set();
  for (let i = 0; i < 100; i++) {
    const ids = Quiz.selectQuestions();
    assert.equal(Quiz.validQuestionIds(ids), true);
    variants.add(ids.join(','));
  }
  assert.ok(variants.size > 1);
});
test('Без всех ответов нет результата; неподходящие варианты не засчитываются', () => {
  const ids = Quiz.selectQuestions();
  const answers = answersFor(ids, 5);
  delete answers[ids[0]];
  assert.equal(Quiz.evaluate(ids, answers).complete, false);
  answers[ids[0]] = ['not-an-option'];
  assert.equal(Quiz.evaluate(ids, answers).complete, false);
  assert.throws(() => Quiz.evaluate([ids[0], ids[0], ...ids.slice(2)], answers));
});
test('Множественный ответ требует точного совпадения всего набора', () => {
  const ids = Quiz.selectQuestions();
  const q = ids.map((id) => Quiz.byId.get(id)).find((q) => q.type === 'multiple');
  const answers = answersFor(ids, 5);
  answers[q.id] = q.correctIds.slice(1);
  assert.equal(Quiz.evaluate(ids, answers).correctCount, 4);
  answers[q.id] = [...q.correctIds, q.options.find((o) => !q.correctIds.includes(o.id)).id];
  assert.equal(Quiz.evaluate(ids, answers).correctCount, 4);
  answers[q.id] = [...q.correctIds].reverse();
  assert.equal(Quiz.evaluate(ids, answers).correctCount, 5);
});
test('Порог: 3/5 = 60% не сдано, 4/5 = 80% сдано', () => {
  const ids = Quiz.selectQuestions();
  assert.equal(Quiz.evaluate(ids, answersFor(ids, 3)).passed, false);
  assert.equal(Quiz.evaluate(ids, answersFor(ids, 3)).percent, 60);
  assert.equal(Quiz.evaluate(ids, answersFor(ids, 4)).passed, true);
  assert.equal(Quiz.evaluate(ids, answersFor(ids, 4)).percent, 80);
});
test('Миграция v1: старые отметки — история ознакомления, не освоение', () => {
  const raw = JSON.stringify({ version: 1, completedLessonIds: [1, 2, 2, 5, 999, '3'] });
  const storage = memoryStorage({ [Progress.LEGACY_KEY]: raw });
  const store = Progress.createStore(storage);
  const state = store.snapshot();
  assert.deepEqual(state.readLessonIds, [1, 2, 5]);
  assert.deepEqual(state.legacyReadLessonIds, [1, 2, 5]);
  assert.equal(Progress.isMastered(state, 2), false);
  assert.equal(state.lesson2.attempts.length, 0);
  assert.equal(storage.getItem(Progress.LEGACY_KEY), raw);
  store.toggleRead(1);
  assert.deepEqual(store.snapshot().legacyReadLessonIds, [1, 2, 5]);
  assert.equal(Progress.createStore(storage).snapshot().readLessonIds.includes(1), false);
});
test('Открытие и обычная кнопка не присваивают освоение', () => {
  const store = Progress.createStore(memoryStorage());
  store.markStarted(2);
  assert.equal(Progress.status(store.snapshot(), 2).label, 'В процессе');
  assert.equal(store.snapshot().readLessonIds.length, 0);
  assert.throws(() => store.toggleRead(2));
  store.toggleRead(1);
  assert.equal(Progress.isMastered(store.snapshot(), 1), false);
});
test('Незавершённая попытка не попадает в историю; черновик восстанавливается', () => {
  const storage = memoryStorage();
  const store = Progress.createStore(storage);
  const draft = store.startQuiz().lesson2.draft;
  const q = Quiz.byId.get(draft.questionIds[0]);
  store.answerQuiz(draft.id, q.id, q.correctIds);
  assert.throws(() => store.submitQuiz(draft.id, {}));
  assert.equal(store.snapshot().lesson2.attempts.length, 0);
  const restored = Progress.createStore(storage).snapshot().lesson2.draft;
  assert.deepEqual(restored.questionIds, draft.questionIds);
  assert.deepEqual(restored.answers[q.id], q.correctIds);
});
test('Результат хранится после перезагрузки; неудача не стирает прежний успех', () => {
  const storage = memoryStorage();
  const store = Progress.createStore(storage);
  submit(store, 4);
  submit(store, 3);
  const state = Progress.createStore(storage).snapshot();
  assert.equal(state.lesson2.attempts.at(-1).percent, 60);
  assert.equal(state.lesson2.attempts.length, 2);
  assert.equal(Progress.status(state, 2).label, 'Освоен');
});
test('Повторные попытки без ограничения и без дублирования завершённой', () => {
  const store = Progress.createStore(memoryStorage());
  for (let i = 0; i < 15; i++) submit(store, 3);
  const state = store.snapshot();
  assert.equal(state.lesson2.attempts.length, 15);
  assert.equal(Progress.status(state, 2).label, 'Тест не пройден');
  assert.throws(() => store.submitQuiz(state.lesson2.attempts.at(-1).id, {}));
});
test('Хранилище: поддельные итоговые флаги не заменяют ответы', () => {
  const store = Progress.createStore(memoryStorage());
  const state = submit(store, 3);
  state.lesson2.attempts[0].passed = true;
  state.lesson2.attempts[0].percent = 100;
  assert.equal(Progress.normalize(state).lesson2.attempts[0].passed, false);
});
test('Переполнение хранилища: результаты живут в памяти, показывается предупреждение', () => {
  const storage = memoryStorage();
  storage.setItem = () => { throw new Error('QuotaExceeded'); };
  const warnings = [];
  const store = Progress.createStore(storage, (message) => warnings.push(message));
  submit(store, 4);
  submit(store, 3);
  assert.equal(Progress.isMastered(store.snapshot(), 2), true);
  assert.ok(warnings.some((message) => message.includes('Не удалось сохранить')));
});
test('Более новая версия данных не перезаписывается', () => {
  const raw = JSON.stringify({ version: 3, important: true });
  const storage = memoryStorage({ [Progress.STORAGE_KEY]: raw });
  const store = Progress.createStore(storage);
  submit(store, 4);
  assert.equal(storage.getItem(Progress.STORAGE_KEY), raw);
});
