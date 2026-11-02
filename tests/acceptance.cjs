/* Приёмка Sprint 1 и регрессии MVP. Запуск описан в README.md. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const Quiz = require('../quiz.js');
const Progress = require('../progress.js');
const BASE_URL = process.env.TEST_URL || 'http://127.0.0.1:8000';
const browserPath = process.env.BROWSER_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);

(async () => {
  const browser = await chromium.launch({ executablePath: browserPath, headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const failedRequests = [];
  const externalRequests = [];
  const httpErrors = [];
  let count = 0;
  const watch = (p) => p.on('pageerror', (error) => errors.push(error.message));
  watch(page);
  context.on('page', watch);
  context.on('requestfailed', (r) => failedRequests.push(r.url()));
  context.on('response', (r) => { if (r.status() >= 400) httpErrors.push(`${r.status()} ${r.url()}`); });
  context.on('request', (r) => { if (!r.url().startsWith(BASE_URL) && !r.url().startsWith('data:')) externalRequests.push(r.url()); });
  async function run(name, fn) { await fn(); count++; console.log(`✓ ${name}`); }
  async function home() { await page.goto(`${BASE_URL}/#home`); await page.locator('#hero-title').waitFor(); }
  async function openLesson(id) {
    await page.goto(`${BASE_URL}/#lesson-${id}`);
    await page.locator(id === 2 ? '#lesson-quiz' : '#complete-button').waitFor();
  }
  async function reset() { await page.evaluate(() => localStorage.clear()); await home(); await page.reload(); await page.locator('#hero-title').waitFor(); }
  async function percent(read, mastery = 0) {
    await page.waitForFunction(([a, b]) => document.querySelector('#progress-percent').textContent === `${a}%` && document.querySelector('#mastery-percent').textContent === `${b}%`, [read, mastery]);
    assert.equal(await page.locator('#course-progress').getAttribute('aria-valuenow'), String(read));
    assert.equal(await page.locator('#mastery-progress').getAttribute('aria-valuenow'), String(mastery));
  }
  async function snapshot() { return page.evaluate((key) => JSON.parse(localStorage.getItem(key)), Progress.STORAGE_KEY); }
  async function status(id, text) { assert.equal(await page.locator(`[data-lesson-id="${id}"] .lesson-status`).textContent(), text); }
  async function answer(correctCount, skipLast = false) {
    const ids = await page.locator('.quiz-question').evaluateAll((fields) => fields.map((field) => field.dataset.questionId));
    for (let index = 0; index < ids.length - (skipLast ? 1 : 0); index++) {
      const q = Quiz.byId.get(ids[index]);
      const selected = index < correctCount ? q.correctIds : [q.options.find((o) => !q.correctIds.includes(o.id)).id];
      for (const value of selected) await page.locator(`input[name="${q.id}"][value="${value}"]`).check();
    }
  }
  async function start() { await page.locator('#start-quiz').click(); await page.locator('#quiz-form').waitFor(); }
  async function submit() { await page.getByRole('button', { name: 'Проверить ответы', exact: true }).click(); }
  async function noOverflow() {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Горизонтальная прокрутка: ${page.url()}`);
  }
  try {
    await run('Главная: сохранены 5 уроков, русский интерфейс, два независимых прогресса и начальные статусы', async () => {
      await home();
      assert.equal(await page.locator('.lesson-card').count(), 5);
      assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
      await percent(0);
      for (let id = 1; id <= 5; id++) await status(id, 'Не начат');
      await page.screenshot({ path: '/tmp/ai-navigator-sprint1-desktop.png', fullPage: true });
    });
    await run('Все 5 уроков открываются с материалом и практикой; открытие не даёт освоения', async () => {
      for (let id = 1; id <= 5; id++) {
        await home();
        await page.locator(`[data-lesson-id="${id}"] h3 a`).click();
        await page.locator(id === 2 ? '#lesson-quiz' : '#complete-button').waitFor();
        assert.ok((await page.locator('.lesson-article').innerText()).length > 1500);
        assert.ok((await page.locator('.practice').innerText()).length > 200);
        await percent(0);
        await status(id, 'В процессе');
      }
    });
    await run('Урок 2 нельзя отметить обычной кнопкой; новая попытка содержит 5 вопросов обоих типов и минимум 2 ситуации', async () => {
      await openLesson(2);
      assert.equal(await page.locator('#complete-button').count(), 0);
      await start();
      const ids = await page.locator('.quiz-question').evaluateAll((nodes) => nodes.map((node) => node.dataset.questionId));
      assert.equal(Quiz.validQuestionIds(ids), true);
      assert.ok(await page.locator('input[type="radio"]').count() > 0);
      assert.ok(await page.locator('input[type="checkbox"]').count() > 0);
      await percent(0);
    });
    await run('Нельзя сдать тест без всех ответов; незавершённая попытка не записывается', async () => {
      await answer(4, true);
      await submit();
      assert.equal(await page.locator('#quiz-error').isVisible(), true);
      assert.equal((await snapshot()).lesson2.attempts.length, 0);
      await percent(0);
    });
    await run('Черновик и выбранные ответы восстанавливаются после перезагрузки и возврата в урок', async () => {
      const before = (await snapshot()).lesson2.draft;
      await page.reload();
      await page.locator('#quiz-form').waitFor();
      assert.deepEqual((await snapshot()).lesson2.draft, before);
      const inputs = await page.locator('#quiz-form input:checked').count();
      assert.ok(inputs >= 4);
      await home(); await openLesson(2);
      assert.deepEqual((await snapshot()).lesson2.draft, before);
    });
    await run('3/5 = 60%: тест не пройден, есть объяснения ошибок и отдельная отметка ознакомления', async () => {
      await reset(); await openLesson(2); await start(); await answer(3); await submit();
      await page.locator('#quiz-result-title').waitFor();
      assert.match(await page.locator('.quiz-score').textContent(), /60%/);
      assert.equal(await page.locator('.answer-wrong').count(), 2);
      assert.equal(await page.locator('.review-item').count(), 5);
      await percent(20, 0); await home(); await status(2, 'Тест не пройден');
      assert.equal((await snapshot()).lesson2.attempts[0].passed, false);
    });
    await run('4/5 = 80%: урок освоен; история и результат сохраняются после перезагрузки', async () => {
      await openLesson(2); await start(); await answer(4); await submit();
      assert.match(await page.locator('.quiz-score').textContent(), /80%/);
      await percent(20, 20);
      await page.reload(); await page.locator('#quiz-result-title').waitFor();
      assert.match(await page.locator('.quiz-score').textContent(), /80%/);
      await home(); await status(2, 'Освоен'); await percent(20, 20);
      assert.equal((await snapshot()).lesson2.attempts.length, 2);
    });
    await run('Повторная неудачная попытка не стирает успешный результат, в том числе после перезагрузки', async () => {
      await openLesson(2); await start(); await answer(3); await submit();
      assert.match(await page.locator('.quiz-score').textContent(), /60%/);
      assert.match(await page.locator('.quiz-result').textContent(), /Предыдущий успешный результат сохранён/);
      await page.reload(); await page.locator('#quiz-result-title').waitFor();
      await percent(20, 20); await home(); await status(2, 'Освоен');
      assert.equal((await snapshot()).lesson2.attempts.length, 3);
    });
    await run('Остальные 4 урока: отметки и отмена работают, ознакомление не превращается в освоение', async () => {
      await reset();
      for (const [index, id] of [1, 3, 4, 5].entries()) {
        await openLesson(id); await page.locator('#complete-button').click();
        await percent((index + 1) * 20, 0);
      }
      await home(); await page.reload(); await percent(80, 0);
      assert.equal(await page.locator('.read-badge').count(), 4);
      for (const [index, id] of [5, 4, 3, 1].entries()) {
        await openLesson(id); await page.locator('#complete-button').click();
        await percent((3 - index) * 20, 0);
      }
      await home(); await page.reload(); await percent(0);
    });
    await run('Миграция v1: 100% старых отметок — история ознакомления, 0% освоения; исходный ключ сохранён', async () => {
      await reset();
      const raw = JSON.stringify({ version: 1, completedLessonIds: [1, 2, 3, 4, 5] });
      await page.evaluate(([key, value]) => localStorage.setItem(key, value), [Progress.LEGACY_KEY, raw]);
      await page.reload(); await percent(100, 0);
      assert.equal(await page.evaluate((key) => localStorage.getItem(key), Progress.LEGACY_KEY), raw);
      assert.deepEqual((await snapshot()).legacyReadLessonIds, [1, 2, 3, 4, 5]);
      await status(2, 'В процессе');
      await openLesson(2);
      assert.match(await page.locator('#lesson-quiz').textContent(), /история ознакомления/);
      assert.equal((await snapshot()).lesson2.attempts.length, 0);
      await home(); assert.equal(await page.locator('#continue-link').getAttribute('href'), '#lesson-2');
    });
    await run('Навигация, история браузера и ссылка перехода к содержимому сохраняют урок', async () => {
      await openLesson(2);
      await page.locator('.skip-link').focus(); await page.keyboard.press('Enter');
      assert.match(page.url(), /#lesson-2$/);
      assert.equal(await page.locator('#main').evaluate((node) => document.activeElement === node), true);
      await page.getByRole('link', { name: 'Следующий урок', exact: true }).click();
      await page.waitForURL('**/#lesson-3'); await page.goBack(); await page.waitForURL('**/#lesson-2');
      await page.goto(`${BASE_URL}/#lesson-999`); await page.locator('#hero-title').waitFor();
    });
    await run('Повреждённые данные не ломают приложение; запись восстанавливает формат', async () => {
      await reset();
      await page.evaluate((key) => localStorage.setItem(key, '{broken'), Progress.STORAGE_KEY);
      await page.reload(); await percent(0);
      assert.equal(await page.locator('#storage-warning').isVisible(), true);
      await openLesson(1); await page.locator('#complete-button').click();
      await page.reload(); await percent(20);
      assert.equal(await page.locator('#storage-warning').isVisible(), false);
    });
    await run('Вкладки синхронизируют чтение, черновик и успешный тест', async () => {
      await reset();
      const other = await context.newPage();
      await other.goto(`${BASE_URL}/#lesson-4`); await other.locator('#complete-button').click();
      await percent(20);
      await openLesson(2); await start();
      await other.goto(`${BASE_URL}/#lesson-2`); await other.locator('#quiz-form').waitFor();
      assert.equal(await other.locator('.quiz-question').count(), 5);
      await answer(5); await submit();
      await other.locator('#quiz-result-title').waitFor();
      assert.match(await other.locator('.quiz-score').textContent(), /100%/);
      await percent(40, 20); await other.close();
    });
    await run('Информационные окна открываются клавиатурой и закрываются Escape с восстановлением фокуса', async () => {
      await home();
      for (const type of ['how', 'about']) {
        await page.locator(`[data-info="${type}"]`).focus(); await page.keyboard.press('Enter');
        assert.equal(await page.locator('#info-dialog').evaluate((node) => node.open), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#info-dialog').evaluate((node) => node.open), false);
        assert.equal(await page.locator(`[data-info="${type}"]`).evaluate((node) => node === document.activeElement), true);
      }
    });
    await run('Копирование примера запроса', async () => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await openLesson(2); await page.locator('.copy-button').click();
      await page.waitForFunction(() => document.querySelector('#toast').textContent.startsWith('Запрос скопирован'));
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await page.locator('.prompt-text').textContent());
    });
    await run('Мобильный тест: выбор ответов, ошибки, успех и все уроки без горизонтальной прокрутки', async () => {
      await reset();
      for (const width of [320, 375, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        await home(); await noOverflow();
        for (let id = 1; id <= 5; id++) { await openLesson(id); await noOverflow(); }
        if (!(await page.locator('#quiz-form').count())) { await openLesson(2); if (await page.locator('#start-quiz').count()) await start(); }
        await noOverflow();
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await openLesson(2); await noOverflow();
      await page.locator('#main').focus();
      await page.locator('#lesson-quiz').screenshot({ path: '/tmp/ai-navigator-sprint1-quiz-mobile.png' });
      await submit(); assert.equal(await page.locator('#quiz-error').isVisible(), true); await noOverflow();
      await answer(4); await submit(); await noOverflow();
      assert.match(await page.locator('.quiz-score').textContent(), /80%/);
      await page.locator('#lesson-quiz').screenshot({ path: '/tmp/ai-navigator-sprint1-result-mobile.png' });
      await home(); await noOverflow();
      await page.screenshot({ path: '/tmp/ai-navigator-sprint1-mobile.png', fullPage: true });
    });
    await run('Запрет и переполнение localStorage: тест работает в памяти и предупреждает об отсутствии сохранения', async () => {
      for (const blockedRead of [true, false]) {
        const limitedContext = await browser.newContext();
        await limitedContext.addInitScript(({ key, blockedRead }) => {
          const get = Storage.prototype.getItem;
          Storage.prototype.getItem = function (name) {
            if (blockedRead && name === key) throw new DOMException('Blocked', 'SecurityError');
            return get.call(this, name);
          };
          Storage.prototype.setItem = function () { throw new DOMException('Full', 'QuotaExceededError'); };
        }, { key: Progress.STORAGE_KEY, blockedRead });
        const limited = await limitedContext.newPage(); watch(limited);
        await limited.goto(`${BASE_URL}/#lesson-2`); await limited.locator('#start-quiz').click();
        const ids = await limited.locator('.quiz-question').evaluateAll((nodes) => nodes.map((node) => node.dataset.questionId));
        for (const id of ids) for (const choice of Quiz.byId.get(id).correctIds) await limited.locator(`input[name="${id}"][value="${choice}"]`).check();
        await limited.getByRole('button', { name: 'Проверить ответы' }).click();
        assert.match(await limited.locator('.quiz-score').textContent(), /100%/);
        assert.match(await limited.locator('.quiz-result').textContent(), /только до перезагрузки/);
        assert.equal(await limited.locator('#storage-warning').isVisible(), true);
        await limited.reload();
        assert.equal(await limited.locator('#mastery-percent').textContent(), '0%');
        await limitedContext.close();
      }
    });
    await run('Нет ошибок JavaScript, HTTP-ошибок, неудачных запросов и внешних сетевых зависимостей', async () => {
      assert.deepEqual(errors, []); assert.deepEqual(failedRequests, []); assert.deepEqual(httpErrors, []); assert.deepEqual(externalRequests, []);
    });
    console.log(`\nУспешно: ${count} групп браузерных проверок.`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
