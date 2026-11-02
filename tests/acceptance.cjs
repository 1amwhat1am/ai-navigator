/* Браузерные проверки. Запуск и зависимости описаны в README.md. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

const BASE_URL = process.env.TEST_URL || 'http://127.0.0.1:8000';
const STORAGE_KEY = 'ai-navigator.progress.v1';
const browserPath = process.env.BROWSER_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const checks = [];

(async () => {
  const browser = await chromium.launch({ executablePath: browserPath, headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const failedRequests = [];
  const externalRequests = [];
  context.on('page', (newPage) => newPage.on('pageerror', (error) => errors.push(error.message)));
  page.on('pageerror', (error) => errors.push(error.message));
  context.on('requestfailed', (request) => failedRequests.push(request.url()));
  context.on('request', (request) => {
    if (!request.url().startsWith(BASE_URL) && !request.url().startsWith('data:')) externalRequests.push(request.url());
  });
  async function run(name, action) {
    await action();
    checks.push(name);
    console.log(`✓ ${name}`);
  }
  async function home() {
    await page.goto(`${BASE_URL}/#home`);
    await page.locator('#hero-title').waitFor();
  }
  async function openLesson(id) {
    await page.goto(`${BASE_URL}/#lesson-${id}`);
    await page.locator('#complete-button').waitFor();
  }
  async function expectProgress(value) {
    await page.waitForFunction((value) => document.querySelector('#progress-percent').textContent === `${value}%`, value);
    assert.equal(await page.locator('#course-progress').getAttribute('aria-valuenow'), String(value));
  }
  async function reset() {
    await page.evaluate(() => localStorage.clear());
    await home();
  }
  async function noOverflow() {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `Горизонтальная прокрутка: ${page.url()}`);
  }
  try {
    await run('КП-01: главная содержит ровно 5 уроков и начальный прогресс 0%', async () => {
      await home();
      assert.equal(await page.locator('.lesson-card').count(), 5);
      assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
      await expectProgress(0);
      await page.screenshot({ path: '/tmp/ai-navigator-desktop.png', fullPage: true });
    });
    await run('КП-02 и БП-01: открываются 5 уроков с материалом и практикой; чтение не отмечает прохождение', async () => {
      for (let id = 1; id <= 5; id++) {
        await home();
        await page.locator(`.lesson-card[data-lesson-id="${id}"] h3 a`).click();
        await page.locator('#complete-button').waitFor();
        assert.match(page.url(), new RegExp(`#lesson-${id}$`));
        assert.ok((await page.locator('.lesson-article').innerText()).length > 1500);
        assert.ok((await page.locator('.practice').innerText()).length > 200);
        assert.equal(await page.locator('#complete-button').getAttribute('aria-pressed'), 'false');
        await expectProgress(0);
      }
    });
    await run('КП-03: явные отметки увеличивают прогресс на 20% до 100%', async () => {
      for (let id = 1; id <= 5; id++) {
        await openLesson(id);
        await page.locator('#complete-button').click();
        assert.equal(await page.locator('#complete-button').getAttribute('aria-pressed'), 'true');
        await page.getByRole('link', { name: 'Все уроки', exact: true }).click();
        await expectProgress(id * 20);
        assert.equal(await page.locator('.lesson-card.completed').count(), id);
      }
      assert.equal(await page.locator('#continue-label').innerText(), 'Повторить уроки');
    });
    await run('КП-04: 100% и все отметки сохраняются после перезагрузки', async () => {
      await page.reload();
      await expectProgress(100);
      assert.equal(await page.locator('.completed-badge').count(), 5);
      await openLesson(3);
      assert.equal(await page.locator('#complete-button').getAttribute('aria-pressed'), 'true');
    });
    await run('КП-05: отмена уменьшает прогресс до 0% и сохраняется после перезагрузки', async () => {
      for (let id = 5; id >= 1; id--) {
        await openLesson(id);
        await page.locator('#complete-button').click();
        await expectProgress((id - 1) * 20);
        assert.equal(await page.locator('#complete-button').getAttribute('aria-pressed'), 'false');
      }
      await home();
      await page.reload();
      await expectProgress(0);
      assert.equal(await page.locator('.completed-badge').count(), 0);
    });
    await run('Кнопка продолжения ведёт к первому непройденному уроку', async () => {
      await openLesson(1);
      await page.locator('#complete-button').click();
      await home();
      assert.equal(await page.locator('#continue-link').getAttribute('href'), '#lesson-2');
      await page.locator('#continue-link').click();
      await page.locator('#complete-button').waitFor();
      assert.match(page.url(), /#lesson-2$/);
    });
    await run('Навигация: следующий урок, возврат браузера, прямая ссылка и неизвестный адрес', async () => {
      await page.getByRole('link', { name: 'Следующий урок', exact: true }).click();
      await page.waitForURL('**/#lesson-3');
      await page.goBack();
      await page.waitForURL('**/#lesson-2');
      await page.reload();
      await page.locator('#complete-button').waitFor();
      assert.match(await page.locator('.lesson-header-meta').innerText(), /02/);
      await page.goto(`${BASE_URL}/#lesson-999`);
      await page.locator('#hero-title').waitFor();
      await expectProgress(20);
    });
    await run('Ссылка «Перейти к содержимому» сохраняет открытый урок и прогресс', async () => {
      await openLesson(2);
      const lessonUrl = page.url();
      const progressBefore = await page.locator('#progress-percent').textContent();
      await page.locator('.skip-link').focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.activeElement === document.querySelector('#main'));
      assert.equal(page.url(), lessonUrl);
      assert.equal(await page.locator('#lesson-view').isVisible(), true);
      assert.equal(await page.locator('#home-view').isVisible(), false);
      assert.equal(await page.locator('#progress-percent').textContent(), progressBefore);
    });
    await run('Локальное хранилище: дубликаты и неизвестные ID не искажают проценты', async () => {
      await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ version: 1, completedLessonIds: [1, 1, 3, 999, '2', null] })), STORAGE_KEY);
      await page.reload();
      await expectProgress(40);
      assert.equal(await page.locator('.completed-badge').count(), 2);
    });
    await run('Повреждённые данные: понятное предупреждение и восстановление после отметки', async () => {
      await page.evaluate((key) => localStorage.setItem(key, '{broken'), STORAGE_KEY);
      await page.reload();
      await expectProgress(0);
      assert.equal(await page.locator('#storage-warning').isVisible(), true);
      await openLesson(1);
      await page.locator('#complete-button').click();
      await page.reload();
      await expectProgress(20);
      assert.equal(await page.locator('#storage-warning').isVisible(), false);
    });
    await run('Синхронизация прогресса между вкладками', async () => {
      await reset();
      const secondPage = await context.newPage();
      await secondPage.goto(`${BASE_URL}/#lesson-4`);
      await secondPage.locator('#complete-button').click();
      await expectProgress(20);
      assert.equal(await page.locator('.lesson-card[data-lesson-id="4"]').evaluate((card) => card.classList.contains('completed')), true);
      await secondPage.close();
    });
    await run('Информационные окна: открытие с клавиатуры и закрытие Escape', async () => {
      await home();
      for (const type of ['how', 'about']) {
        await page.locator(`[data-info="${type}"]`).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('#info-dialog').evaluate((dialog) => dialog.open), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#info-dialog').evaluate((dialog) => dialog.open), false);
        assert.equal(await page.locator(`[data-info="${type}"]`).evaluate((button) => document.activeElement === button), true);
      }
    });
    await run('Копирование примера запроса (с разрешением браузера)', async () => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await openLesson(2);
      const prompt = await page.locator('.prompt-text').innerText();
      await page.locator('.copy-button').click();
      await page.waitForFunction(() => document.querySelector('#toast').textContent.startsWith('Запрос скопирован'));
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), prompt);
    });
    await run('КП-06: без горизонтальной прокрутки на ширинах 320, 375, 390, 768, 1024 и 1440', async () => {
      for (const width of [320, 375, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await home();
        await noOverflow();
        for (let id = 1; id <= 5; id++) {
          await openLesson(id);
          await noOverflow();
        }
        await home();
        for (const type of ['how', 'about']) {
          await page.locator(`[data-info="${type}"]`).click();
          await noOverflow();
          const box = await page.locator('#info-dialog').boundingBox();
          assert.ok(box.x >= 0 && box.x + box.width <= width);
          await page.keyboard.press('Escape');
        }
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await home();
      await page.screenshot({ path: '/tmp/ai-navigator-mobile.png', fullPage: true });
    });
    await run('Запрет localStorage: курс работает, отметки в памяти можно ставить и отменять', async () => {
      const blockedContext = await browser.newContext();
      await blockedContext.addInitScript((key) => {
        const get = Storage.prototype.getItem;
        const set = Storage.prototype.setItem;
        Storage.prototype.getItem = function (name) {
          if (name === key) throw new DOMException('Blocked', 'SecurityError');
          return get.call(this, name);
        };
        Storage.prototype.setItem = function (name, value) {
          if (name === key) throw new DOMException('Blocked', 'SecurityError');
          return set.call(this, name, value);
        };
      }, STORAGE_KEY);
      const blocked = await blockedContext.newPage();
      blocked.on('pageerror', (error) => errors.push(error.message));
      await blocked.goto(`${BASE_URL}/#lesson-1`);
      assert.equal(await blocked.locator('#storage-warning').isVisible(), true);
      await blocked.locator('#complete-button').click();
      await blocked.getByRole('link', { name: 'Следующий урок', exact: true }).click();
      await blocked.locator('#complete-button').click();
      assert.equal(await blocked.locator('#progress-percent').textContent(), '40%');
      await blocked.locator('#complete-button').click();
      assert.equal(await blocked.locator('#progress-percent').textContent(), '20%');
      await blocked.reload();
      assert.equal(await blocked.locator('#progress-percent').textContent(), '0%');
      await blockedContext.close();
    });
    await run('Переполнение хранилища: новые отметки не теряются в памяти между действиями', async () => {
      const quotaContext = await browser.newContext();
      await quotaContext.addInitScript((key) => {
        const set = Storage.prototype.setItem;
        if (localStorage.getItem(key) === null) set.call(localStorage, key, JSON.stringify({ version: 1, completedLessonIds: [1] }));
        Storage.prototype.setItem = function (name, value) {
          if (name === key) throw new DOMException('Full', 'QuotaExceededError');
          return set.call(this, name, value);
        };
      }, STORAGE_KEY);
      const quotaPage = await quotaContext.newPage();
      quotaPage.on('pageerror', (error) => errors.push(error.message));
      await quotaPage.goto(`${BASE_URL}/#lesson-2`);
      await quotaPage.locator('#complete-button').click();
      await quotaPage.getByRole('link', { name: 'Следующий урок', exact: true }).click();
      await quotaPage.locator('#complete-button').click();
      assert.equal(await quotaPage.locator('#progress-percent').textContent(), '60%');
      assert.equal(await quotaPage.locator('#storage-warning').isVisible(), true);
      await quotaPage.locator('#complete-button').click();
      assert.equal(await quotaPage.locator('#progress-percent').textContent(), '40%');
      await quotaPage.reload();
      assert.equal(await quotaPage.locator('#progress-percent').textContent(), '20%');
      await quotaContext.close();
    });
    await run('Нет ошибок JavaScript, неудачных запросов и внешних сетевых зависимостей', async () => {
      assert.deepEqual(errors, []);
      assert.deepEqual(failedRequests, []);
      assert.deepEqual(externalRequests, []);
    });
    console.log(`\nУспешно: ${checks.length} групп проверок. Скриншоты: /tmp/ai-navigator-desktop.png и /tmp/ai-navigator-mobile.png`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
