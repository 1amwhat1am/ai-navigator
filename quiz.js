(function (root) {
  "use strict";
  const bank = typeof module !== "undefined" && module.exports ? require("./questions.js") : root.AINavigatorQuestions;
  const QUESTION_COUNT = 5;
  const PASS_PERCENT = 80;
  const byId = new Map(bank.questions.map((question) => [question.id, question]));

  function shuffled(items, random = Math.random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function selectQuestions(random = Math.random) {
    const selected = shuffled(bank.questions.filter((q) => q.situational), random).slice(0, 2);
    for (const type of ["single", "multiple"]) {
      if (!selected.some((q) => q.type === type)) {
        selected.push(shuffled(bank.questions.filter((q) => q.type === type && !selected.includes(q)), random)[0]);
      }
    }
    selected.push(...shuffled(bank.questions.filter((q) => !selected.includes(q)), random).slice(0, QUESTION_COUNT - selected.length));
    return shuffled(selected, random).map((q) => q.id);
  }

  function validQuestionIds(ids) {
    return Array.isArray(ids) && ids.length === QUESTION_COUNT && new Set(ids).size === QUESTION_COUNT
      && ids.every((id) => byId.has(id)) && ids.filter((id) => byId.get(id).situational).length >= 2
      && ["single", "multiple"].every((type) => ids.some((id) => byId.get(id).type === type));
  }

  function evaluate(questionIds, answers) {
    if (!validQuestionIds(questionIds)) throw new Error("Некорректный набор вопросов. Начните новую попытку.");
    const missing = questionIds.filter((id) => {
      const answer = answers?.[id];
      const question = byId.get(id);
      return !Array.isArray(answer) || answer.length === 0 || new Set(answer).size !== answer.length
        || (question.type === "single" && answer.length !== 1)
        || answer.some((choice) => !question.options.some((option) => option.id === choice));
    });
    if (missing.length) return { complete: false, missing };
    const results = questionIds.map((id) => {
      const question = byId.get(id);
      const correct = answers[id].length === question.correctIds.length && question.correctIds.every((choice) => answers[id].includes(choice));
      return { questionId: id, correct };
    });
    const correctCount = results.filter((result) => result.correct).length;
    const percent = correctCount / QUESTION_COUNT * 100;
    return { complete: true, correctCount, percent, passed: percent >= PASS_PERCENT, results };
  }

  function mount(container, state, actions) {
    const attempts = state.lesson2.attempts;
    const latest = attempts.at(-1);
    const mastered = attempts.some((attempt) => attempt.passed);
    const best = attempts.length ? Math.max(...attempts.map((attempt) => attempt.percent)) : null;
    const draft = state.lesson2.draft;
    let html = `<div class="practice-heading">ПРОВЕРКА ЗНАНИЙ</div><h2 id="quiz-title">Проверим на практике?</h2>
      <p>5 вопросов о реальных задачах. Для освоения урока нужно минимум 80% — 4 верных ответа из 5. Попытки не ограничены.</p>
      <p class="quiz-rules">В вопросах с несколькими ответами выберите все верные варианты. Балл начисляется только за полностью правильный ответ. Завершение теста отмечает ознакомление; только результат от 80% подтверждает освоение.</p>`;
    if (state.legacyReadLessonIds.includes(2)) html += `<p class="lesson-tip">Ваша отметка из первой версии сохранена как история ознакомления. Освоение подтвердит успешный тест.</p>`;
    if (best !== null) html += `<p class="quiz-history">Попыток: ${attempts.length} · Лучший результат: ${best}%${mastered ? " · Урок освоен" : ""}</p>`;
    if (draft) {
      html += `<form id="quiz-form" novalidate><div id="quiz-error" class="quiz-error" role="alert" hidden></div>`;
      html += draft.questionIds.map((id, index) => {
        const question = byId.get(id);
        return `<fieldset class="quiz-question" data-question-id="${id}"><legend><span class="question-number">ВОПРОС ${index + 1} ИЗ 5${question.situational ? " · СИТУАЦИЯ" : ""}</span>${question.text}</legend>
          <p class="question-hint">${question.type === "multiple" ? "Выберите все правильные ответы" : "Выберите один ответ"}</p>
          ${question.options.map((option) => `<label class="quiz-option"><input type="${question.type === "multiple" ? "checkbox" : "radio"}" name="${id}" value="${option.id}" ${(draft.answers[id] || []).includes(option.id) ? "checked" : ""}><span>${option.text}</span></label>`).join("")}</fieldset>`;
      }).join("");
      html += `<p class="quiz-autosave">${actions.persistent ? "Ответы сохраняются в этом браузере. Можно вернуться к ним позже." : "Хранилище недоступно. Ответы действуют только до перезагрузки страницы."}</p><button class="button button-dark" type="submit">Проверить ответы</button></form>`;
    } else {
      if (latest) {
        html += `<section class="quiz-result ${latest.passed ? "result-pass" : "result-fail"}" aria-labelledby="quiz-result-title"><h3 id="quiz-result-title" tabindex="-1">${latest.passed ? "Урок освоен!" : "Пока не получилось — попробуйте ещё"}</h3>
          <p class="quiz-score">${latest.percent}% <span>· ${latest.correctCount} из 5 верно</span></p>
          <p>${latest.passed ? `Вы умеете применять знания о запросах. ${actions.persistent ? "Результат сохранён." : "Результат действует только до перезагрузки: хранилище недоступно."}` : mastered ? "Предыдущий успешный результат сохранён в текущем состоянии. Урок остаётся освоенным." : "Нужно минимум 80%. Разберите ошибки ниже и начните новую попытку."}</p></section>
          <div class="quiz-review"><h3>Разбор ответов</h3>${latest.results.map((result) => {
            const question = byId.get(result.questionId);
            const chosen = question.options.filter((option) => latest.answers[question.id].includes(option.id)).map((option) => option.text).join("; ");
            const correct = question.options.filter((option) => question.correctIds.includes(option.id)).map((option) => option.text).join("; ");
            return `<section class="review-item ${result.correct ? "answer-correct" : "answer-wrong"}"><h4>${result.correct ? "Верно" : "Ошибка"}: ${question.text}</h4><p><strong>Ваш ответ:</strong> ${chosen}</p>${result.correct ? "" : `<p><strong>Правильный ответ:</strong> ${correct}</p>`}<p>${question.explanation}</p></section>`;
          }).join("")}</div>`;
      }
      html += `<button id="start-quiz" type="button" class="button button-dark">${latest ? "Попробовать ещё раз" : "Начать тест"}</button>`;
    }
    container.innerHTML = html;
    container.querySelector("#start-quiz")?.addEventListener("click", () => {
      actions.start();
      container.querySelector("input")?.focus({ preventScroll: true });
    });
    const form = container.querySelector("form");
    form?.addEventListener("change", (event) => {
      if (!event.target.matches("input")) return;
      const fieldset = event.target.closest("fieldset");
      const selected = [...fieldset.querySelectorAll("input:checked")].map((input) => input.value);
      actions.answer(draft.id, fieldset.dataset.questionId, selected);
      fieldset.removeAttribute("aria-invalid");
    });
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const answers = Object.fromEntries(draft.questionIds.map((id) => [id, [...form.elements[id]].filter((input) => input.checked).map((input) => input.value)]));
      const result = evaluate(draft.questionIds, answers);
      if (!result.complete) {
        const error = container.querySelector("#quiz-error");
        error.hidden = false;
        error.textContent = "Ответьте на все пять вопросов. В каждом выберите хотя бы один вариант.";
        for (const id of result.missing) form.querySelector(`[data-question-id="${id}"]`).setAttribute("aria-invalid", "true");
        form.querySelector(`[data-question-id="${result.missing[0]}"] input`).focus();
        return;
      }
      actions.submit(draft.id, answers);
      container.querySelector("#quiz-result-title")?.focus();
    });
  }

  const api = { bankVersion: bank.version, QUESTION_COUNT, PASS_PERCENT, byId, selectQuestions, validQuestionIds, evaluate, mount };
  root.AINavigatorQuiz = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(globalThis);
