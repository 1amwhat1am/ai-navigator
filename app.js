"use strict";

const STORAGE_KEY = "ai-navigator.progress.v1";

const lessons = [
  {
    id: 1,
    title: "Что такое искусственный интеллект",
    description: "Без магии и сложных слов: что умеет AI и где он встречается каждый день.",
    minutes: 8,
    icon: "spark",
    color: "sage",
    content: `
      <h2>Знакомьтесь: ваш новый помощник</h2>
      <p>Искусственный интеллект, или AI, — это общее название компьютерных систем, которые умеют решать задачи, обычно требующие человеческих способностей: распознавать речь, находить закономерности, создавать тексты и изображения.</p>
      <p>Вы, скорее всего, уже встречались с AI. Он помогает навигатору оценивать пробки, телефону — распознавать лицо, а почте — отделять нежелательные письма.</p>
      <h2>Чем отличаются современные AI-помощники</h2>
      <p>Есть инструменты, с которыми можно общаться обычными словами. Например, ChatGPT, GigaChat и Алиса AI. Вы пишете вопрос или задачу, а помощник создаёт ответ. Программировать для этого не нужно.</p>
      <ul>
        <li><strong>Текстовые помощники</strong> объясняют темы, предлагают идеи и помогают редактировать текст.</li>
        <li><strong>Генераторы изображений</strong> создают картинки по словесному описанию.</li>
        <li><strong>Инструменты для звука</strong> переводят речь в текст или озвучивают написанное.</li>
      </ul>
      <div class="lesson-tip"><p><strong>Полезный образ:</strong> представьте старательного помощника, которому нужно ясно объяснить задачу. Он быстро предложит вариант, но решение о том, подходит ли результат, принимаете вы.</p></div>
      <h2>Что важно помнить с самого начала</h2>
      <p>AI не мыслит и не понимает мир так же, как человек. Он находит закономерности в данных и на их основе строит ответ. Поэтому убедительный текст может содержать ошибки, а придуманная ссылка — выглядеть настоящей.</p>
      <p>Лучше всего начинать с задач, где вы сами можете оценить результат: придумать название, упростить знакомый текст, составить список идей.</p>`,
    practiceTitle: "Найдите AI в своей жизни",
    practice: `<p>Вспомните три ситуации, когда техника помогла вам с выбором, текстом, фотографией или маршрутом. Запишите их на бумаге или в заметках.</p>
      <p>Теперь придумайте одну небольшую задачу, которую вы хотели бы поручить AI: например, идеи для ужина из знакомых продуктов. Сформулируйте её одним предложением.</p>
      <p class="practice-hint">Проверьте себя: можете ли вы объяснить близкому человеку, что умеет AI и почему его ответы стоит проверять? Для задания не нужен отдельный сервис.</p>`
  },
  {
    id: 2,
    title: "Как задавать вопросы AI",
    description: "Учимся писать понятные запросы и получать действительно полезные ответы.",
    minutes: 10,
    icon: "chat",
    color: "lavender",
    content: `
      <h2>Хороший ответ начинается с запроса</h2>
      <p>Запрос к AI часто называют <strong>промптом</strong>. Это обычная инструкция: что нужно сделать, для кого и в каком виде. Специальные команды и волшебные слова не нужны.</p>
      <p>Сравните: «Расскажи про питание» и «Предложи три простых завтрака для человека, который утром спешит. На приготовление — не больше 10 минут, без орехов». Во втором запросе помощнику легче понять задачу.</p>
      <h2>Четыре части понятного запроса</h2>
      <ol>
        <li><strong>Задача.</strong> Что вы хотите получить: список, объяснение, план или черновик?</li>
        <li><strong>Контекст.</strong> Для кого результат и что полезно знать о ситуации?</li>
        <li><strong>Ограничения.</strong> Сколько времени, какой объём, чего следует избегать?</li>
        <li><strong>Формат.</strong> Например, пять пунктов, таблица или короткое письмо.</li>
      </ol>
      <div class="prompt-example"><div class="prompt-label">ПРИМЕР ЗАПРОСА <button class="copy-button" type="button" aria-label="Скопировать пример запроса"><svg class="icon"><use href="#icon-copy"/></svg></button></div><p class="prompt-text">Помоги составить план изучения английского для начинающего. У меня есть 15 минут в день. Предложи план на одну неделю в виде списка по дням. Используй только бесплатные занятия и объясняй простыми словами.</p></div>
      <h2>Разговор можно продолжить</h2>
      <p>Первый ответ — это начало. Напишите: «Сделай короче», «Приведи пример из жизни» или «Объясни последний пункт без специальных терминов». Если в запросе не хватает деталей, можно добавить: «Сначала задай мне три уточняющих вопроса».</p>
      <div class="lesson-tip"><p><strong>Один шаг за раз.</strong> Большую задачу удобнее разделить: сначала попросите план, потом обсудите один пункт и только затем переходите к следующему.</p></div>`,
    practiceTitle: "Превратите идею в понятный запрос",
    practice: `<p>Возьмите задачу из первого урока или придумайте новую. Напишите запрос из четырёх частей: задача, контекст, ограничения и формат ответа.</p>
      <p>Например: «Предложи пять идей для выходного с ребёнком 8 лет. Мы будем дома, у нас есть бумага и карандаши. Каждое занятие — до 30 минут. Оформи ответ списком с короткими инструкциями».</p>
      <p class="practice-hint">Проверьте себя: поймёт ли другой человек вашу задачу без дополнительных объяснений? По желанию попробуйте запрос в доступном вам AI-помощнике; это не обязательно для прохождения урока.</p>`
  },
  {
    id: 3,
    title: "Тексты с AI: от идеи до черновика",
    description: "Письма, планы и повседневные задачи — с помощником, который всегда рядом.",
    minutes: 10,
    icon: "text",
    color: "peach",
    content: `
      <h2>Чистый лист больше не пугает</h2>
      <p>AI может предложить начало письма, структуру выступления или несколько вариантов заголовка. Его результат лучше воспринимать как <strong>черновик</strong>, который вы проверите и сделаете своим.</p>
      <p>Вы можете попросить помощника придумать текст с нуля или улучшить уже написанное. Для начала подходят небольшие бытовые задачи без личных и рабочих секретов.</p>
      <h2>Три удобных способа работы</h2>
      <ul>
        <li><strong>Придумать.</strong> «Предложи пять идей для поздравления коллеги. Тон — тёплый, без пафоса».</li>
        <li><strong>Упростить.</strong> «Перепиши этот текст короткими предложениями, сохрани смысл и убери канцелярские выражения».</li>
        <li><strong>Структурировать.</strong> «Преврати эти заметки в список дел. Отдельно выдели вопросы, на которые пока нет ответа».</li>
      </ul>
      <div class="prompt-example"><div class="prompt-label">ПРИМЕР ЗАПРОСА <button class="copy-button" type="button" aria-label="Скопировать пример запроса"><svg class="icon"><use href="#icon-copy"/></svg></button></div><p class="prompt-text">Напиши вежливое письмо организатору мастер-класса. Хочу узнать, подойдёт ли занятие новичку и какие материалы взять с собой. Объём — до 100 слов, тон дружелюбный. Не придумывай имя организатора, дату или другие неизвестные детали.</p></div>
      <h2>Добавьте свой голос</h2>
      <p>Прочитайте черновик вслух. Так ли вы обычно говорите? Уберите лишние комплименты, исправьте неточности и добавьте только те детали, которые знаете сами.</p>
      <p>Если текст слишком официальный, попросите: «Перепиши проще, как сообщение знакомому человеку, но сохрани вежливый тон». Если он длинный — попросите сократить до пяти предложений.</p>
      <div class="lesson-tip"><p><strong>Проверка перед отправкой:</strong> верны ли имена, даты и числа? Нет ли обещаний, которых вы не давали? Остались ли в тексте незаполненные места? Ответственность за отправленное письмо остаётся у человека.</p></div>`,
    practiceTitle: "Подготовьте короткое письмо",
    practice: `<p>Выберите ситуацию: уточнить детали занятия, перенести встречу или поблагодарить за помощь. Составьте запрос с целью письма, желаемым тоном и ограничением в 100 слов.</p>
      <p>Напишите небольшой черновик сами или получите его у доступного AI-помощника. Затем отредактируйте минимум две фразы, чтобы текст звучал естественно для вас.</p>
      <p class="practice-hint">Проверьте себя: в письме понятна цель, нет выдуманных фактов и лишних личных данных. Отправлять письмо для выполнения задания не нужно.</p>`
  },
  {
    id: 4,
    title: "Создаём изображения словами",
    description: "От первого описания до собственной идеи для открытки или иллюстрации.",
    minutes: 12,
    icon: "image",
    color: "blue",
    content: `
      <h2>Опишите картинку, которую представляете</h2>
      <p>Генераторы изображений создают новые картинки по текстовому описанию. Это может быть иллюстрация для приглашения, идея оформления комнаты или эскиз открытки. Примеры таких инструментов — Шедеврум и Kandinsky; доступность и условия отдельных сервисов могут меняться.</p>
      <p>В этом уроке мы учимся составлять описание. Открывать сторонний сервис или платить за генерацию для прохождения курса не нужно.</p>
      <h2>Пять деталей хорошего описания</h2>
      <ol>
        <li><strong>Главный объект.</strong> Кто или что находится в кадре?</li>
        <li><strong>Окружение.</strong> Где всё происходит, что на заднем плане?</li>
        <li><strong>Стиль.</strong> Фотография, акварель, рисунок карандашом или простая иллюстрация?</li>
        <li><strong>Свет и настроение.</strong> Утренний свет, спокойствие, яркие или приглушённые цвета?</li>
        <li><strong>Композиция.</strong> Квадратный или вертикальный кадр, крупный план, место для подписи?</li>
      </ol>
      <div class="prompt-example"><div class="prompt-label">ПРИМЕР ЗАПРОСА <button class="copy-button" type="button" aria-label="Скопировать пример запроса"><svg class="icon"><use href="#icon-copy"/></svg></button></div><p class="prompt-text">Уютный домик у озера, вокруг сосны, раннее летнее утро. Мягкая акварельная иллюстрация, приглушённые зелёные и голубые оттенки. Квадратная композиция, домик справа, слева свободное место для подписи. Без текста и логотипов.</p></div>
      <h2>Улучшайте по одной детали</h2>
      <p>Если результат не совпал с ожиданием, уточните описание. Сначала измените свет, затем композицию или стиль. Когда меняется всё сразу, сложнее понять, что помогло.</p>
      <p>Генераторы могут ошибаться в надписях, количестве предметов и мелких деталях. Надпись для открытки часто проще добавить отдельно в обычном редакторе.</p>
      <div class="lesson-tip"><p><strong>Перед публикацией</strong> проверьте условия использования выбранного сервиса. Не выдавайте сгенерированную сцену за документальную фотографию и не загружайте чужие личные фотографии без разрешения.</p></div>`,
    practiceTitle: "Придумайте свою открытку",
    practice: `<p>Составьте описание открытки на свободную тему: приглашение на пикник, поздравление или пожелание хорошего дня. Включите все пять деталей из урока.</p>
      <p>Сделайте второй вариант: сохраните объект и композицию, но измените стиль и настроение. Например, вместо солнечной акварели — спокойный вечерний рисунок карандашом.</p>
      <p class="practice-hint">Проверьте себя: можно ли по вашим двум описаниям представить две разные картинки? Генерировать изображения в стороннем сервисе необязательно.</p>`
  },
  {
    id: 5,
    title: "Доверяй, но проверяй",
    description: "Распознаём ошибки, бережём личные данные и используем AI осознанно.",
    minutes: 10,
    icon: "shield",
    color: "rose",
    content: `
      <h2>Уверенный ответ не всегда верный</h2>
      <p>AI может придумать факт, цитату, книгу или ссылку. Такие ошибки иногда называют <strong>галлюцинациями</strong>. Они возникают даже в подробных и убедительных ответах.</p>
      <p>Просьба «проверь себя» может помочь улучшить ответ, но не заменяет независимую проверку. Даже приведённые помощником источники нужно открыть и прочитать.</p>
      <h2>Простой порядок проверки</h2>
      <ol>
        <li><strong>Выделите проверяемые утверждения:</strong> даты, числа, имена, правила и обещания.</li>
        <li><strong>Найдите первоисточник:</strong> официальный сайт организации, оригинал исследования или документ.</li>
        <li><strong>Проверьте дату:</strong> условия, цены и правила могли измениться.</li>
        <li><strong>Сравните с независимым источником</strong>, если от информации зависит важное решение.</li>
      </ol>
      <div class="lesson-tip"><p><strong>Особое внимание:</strong> ответы о здоровье, праве и финансах не заменяют консультацию профильного специалиста. Используйте AI, чтобы подготовить вопросы, а не принимать важное решение только на основе его ответа.</p></div>
      <h2>Что лучше оставить при себе</h2>
      <p>Не передавайте AI-помощнику пароли, коды из сообщений, данные банковской карты, паспортные данные и конфиденциальные рабочие документы. У разных сервисов разные правила хранения и использования ваших запросов.</p>
      <p>Чтобы обсудить ситуацию, замените имена и адреса вымышленными и уберите детали, по которым можно узнать человека. Например: «Клиент А хочет перенести встречу» вместо настоящей переписки с личными данными.</p>
      <h2>Ваш навык — оставаться автором решения</h2>
      <p>Теперь вы умеете ставить задачу, уточнять запрос, работать с текстом и описывать изображения. Последний шаг — оценивать результат. AI предлагает варианты, а вы выбираете то, что полезно и подходит именно вам.</p>`,
    practiceTitle: "Проверьте ответ помощника",
    practice: `<p>Представьте, что помощник написал: «Городской музей открыт каждый понедельник до 22:00, а вход для всех бесплатный».</p>
      <ol><li>Выделите три утверждения, которые нужно проверить.</li><li>Решите, где вы будете искать актуальную информацию перед посещением.</li><li>Перепишите запрос «Мой пароль — …, помоги войти в аккаунт» так, чтобы не раскрывать секретные данные.</li></ol>
      <p class="practice-hint">Ориентир для самопроверки: день работы, часы и условия входа; официальный сайт конкретного музея; безопасный запрос — «Как восстановить доступ к аккаунту через официальную страницу сервиса?»</p>`
  }
];

const validIds = new Set(lessons.map((lesson) => lesson.id));
const homeView = document.getElementById("home-view");
const lessonView = document.getElementById("lesson-view");
const storageWarning = document.getElementById("storage-warning");
let saveFailed = false;
let completed = readProgress();
let toastTimeout;

function icon(name, extraClass = "") {
  return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
}

function showStorageWarning(message) {
  storageWarning.textContent = message;
  storageWarning.hidden = false;
}

function readProgress(fallback = new Set()) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return new Set();
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !Array.isArray(saved.completedLessonIds)) {
      throw new Error("Invalid progress format");
    }
    return new Set(saved.completedLessonIds.filter((id) => validIds.has(id)));
  } catch (error) {
    const message = error instanceof SyntaxError || error.message === "Invalid progress format"
      ? "Сохранённые данные повреждены. Вы можете продолжить обучение; новые отметки заменят повреждённые данные."
      : "Браузер не разрешает сохранять данные. Вы можете учиться, но после закрытия страницы отметки могут исчезнуть.";
    showStorageWarning(message);
    return new Set(fallback);
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedLessonIds: [...completed] }));
    saveFailed = false;
    storageWarning.hidden = true;
  } catch {
    saveFailed = true;
    showStorageWarning("Не удалось сохранить прогресс в браузере. Отметки действуют до перезагрузки страницы. Проверьте, разрешено ли хранение данных для этого сайта.");
  }
}

function renderCards() {
  document.getElementById("lesson-grid").innerHTML = lessons.map((lesson) => {
    const isCompleted = completed.has(lesson.id);
    return `<article class="lesson-card${isCompleted ? " completed" : ""}" data-lesson-id="${lesson.id}">
      <div class="card-top"><span class="lesson-icon ${lesson.color}">${icon(lesson.icon)}</span>
        ${isCompleted ? `<span class="completed-badge">${icon("check")}Пройден</span>` : `<span class="lesson-number">УРОК 0${lesson.id}</span>`}
      </div>
      <h3><a href="#lesson-${lesson.id}">${lesson.title}</a></h3>
      <p>${lesson.description}</p>
      <div class="card-bottom">${icon("clock")}<span>${lesson.minutes} мин</span><span class="card-practice">С практикой</span><span class="card-arrow">${icon(isCompleted ? "check" : "arrow")}</span></div>
    </article>`;
  }).join("") + `<div class="encouragement-card">${icon("leaf")}<h3>Не нужно знать всё.<br>Достаточно начать.</h3><p>Каждый урок — небольшой шаг к уверенности. У вас получится.</p></div>`;
}

function updateProgress() {
  const count = completed.size;
  const percent = count / lessons.length * 100;
  document.getElementById("completed-count").textContent = `Пройдено ${count} из ${lessons.length} уроков`;
  document.getElementById("progress-percent").textContent = `${percent}%`;
  document.getElementById("progress-fill").style.width = `${percent}%`;
  document.getElementById("course-progress").setAttribute("aria-valuenow", percent);
  document.getElementById("progress-description").textContent = count === 0
    ? "Первый шаг — самый интересный. Начнём?"
    : count === lessons.length
      ? "Отличная работа! Все пять уроков пройдены. Возвращайтесь за вдохновением."
      : "Вы уже ближе к новым возможностям. Продолжайте в своём темпе.";
  const nextLesson = lessons.find((lesson) => !completed.has(lesson.id)) || lessons[0];
  document.getElementById("continue-link").href = `#lesson-${nextLesson.id}`;
  document.getElementById("continue-label").textContent = count === 0 ? "Начать обучение" : count === lessons.length ? "Повторить уроки" : "Продолжить обучение";
}

function currentLesson() {
  const match = /^#lesson-([1-5])$/.exec(location.hash);
  return match ? lessons.find((lesson) => lesson.id === Number(match[1])) : null;
}

function updateCompletionUI(lesson) {
  const isCompleted = completed.has(lesson.id);
  const button = document.getElementById("complete-button");
  if (!button) return;
  button.className = `button ${isCompleted ? "button-soft" : "button-dark"}`;
  button.setAttribute("aria-pressed", String(isCompleted));
  button.innerHTML = `${icon(isCompleted ? "check" : "shield")}<span>${isCompleted ? "Отменить прохождение" : "Отметить как пройденный"}</span>`;
  document.getElementById("completion-title").textContent = isCompleted ? "Урок пройден. Отличная работа!" : "Разобрались и попробовали?";
  document.getElementById("completion-description").textContent = isCompleted ? "Материал всегда доступен для повторения." : "Отметьте урок, когда будете готовы. Решаете только вы.";
}

function renderLesson(lesson) {
  const previous = lessons[lesson.id - 2];
  const next = lessons[lesson.id];
  lessonView.innerHTML = `<div class="lesson-layout">
    <a href="#home" class="back-link">${icon("arrow")}Все уроки</a>
    <header class="lesson-header">
      <div class="lesson-header-meta"><span class="lesson-icon ${lesson.color}">${icon(lesson.icon)}</span><span>УРОК 0${lesson.id} ИЗ 05</span><span>·</span><span>${lesson.minutes} минут с практикой</span></div>
      <h1>${lesson.title}</h1><p>${lesson.description}</p>
    </header>
    <article class="lesson-article" aria-label="Материал урока">
      ${lesson.content}
      <section class="practice" aria-labelledby="practice-title"><div class="practice-heading">${icon("spark")}ВАША ОЧЕРЕДЬ ПОПРОБОВАТЬ</div><h2 id="practice-title">${lesson.practiceTitle}</h2>${lesson.practice}</section>
    </article>
    <section class="completion-panel" aria-label="Отметка прохождения"><div><h2 id="completion-title"></h2><p id="completion-description"></p></div><button type="button" id="complete-button" class="button"></button></section>
    <nav class="lesson-navigation" aria-label="Навигация по урокам">
      ${previous ? `<a class="button button-light" href="#lesson-${previous.id}">${icon("arrow", "previous-arrow")}Предыдущий урок</a>` : `<span class="lesson-position">Первый из пяти шагов</span>`}
      ${next ? `<a class="button button-light" href="#lesson-${next.id}">Следующий урок${icon("arrow")}</a>` : `<a class="button button-light" href="#home">К моему обучению${icon("arrow")}</a>`}
    </nav>
  </div>`;
  updateCompletionUI(lesson);
}

function renderRoute(moveFocus = false) {
  clearTimeout(toastTimeout);
  document.getElementById("toast").hidden = true;
  const lesson = currentLesson();
  homeView.hidden = Boolean(lesson);
  lessonView.hidden = !lesson;
  document.getElementById("home-nav").setAttribute("aria-current", lesson ? "false" : "page");
  document.getElementById("topbar-title").textContent = lesson ? `Моё обучение / Урок ${lesson.id}` : "Моё обучение";
  document.title = lesson ? `${lesson.title} — AI-Навигатор` : "AI-Навигатор — ваше знакомство с AI";
  if (lesson) renderLesson(lesson);
  if (moveFocus) {
    document.getElementById("main").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

function toggleCompletion() {
  const lesson = currentLesson();
  if (!lesson) return;
  // Учитываем изменения из другой вкладки, сохраняя работу в памяти при запрете хранилища.
  if (!saveFailed) completed = readProgress(completed);
  if (completed.has(lesson.id)) completed.delete(lesson.id);
  else completed.add(lesson.id);
  saveProgress();
  updateProgress();
  renderCards();
  updateCompletionUI(lesson);
  document.getElementById("announcement").textContent = `${completed.has(lesson.id) ? "Урок отмечен как пройденный." : "Отметка прохождения отменена."} Прогресс: ${completed.size / lessons.length * 100}%.`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.hidden = false;
  toastTimeout = setTimeout(() => { toast.hidden = true; }, 3500);
}

async function copyPrompt(button) {
  const prompt = button.closest(".prompt-example").querySelector(".prompt-text");
  try {
    await navigator.clipboard.writeText(prompt.textContent);
    showToast("Запрос скопирован. Попробуйте адаптировать его под себя.");
  } catch {
    const range = document.createRange();
    range.selectNodeContents(prompt);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    showToast("Текст выделен. Скопируйте его через меню браузера.");
  }
}

const dialog = document.getElementById("info-dialog");
const infoContent = {
  how: `${icon("path", "dialog-icon")}<h2 id="dialog-title">Маленькие шаги, новые навыки</h2>
    <ol><li><strong>Выберите урок.</strong> Идите по порядку или начните с интересной темы. Все материалы открыты сразу.</li><li><strong>Прочитайте и попробуйте.</strong> В каждом уроке есть небольшая практика и ориентир для самопроверки.</li><li><strong>Отметьте результат.</strong> Нажмите «Отметить как пройденный» в конце урока. Чтение само по себе не меняет прогресс.</li></ol>
    <p>Каждый урок — 20% пути. Отметку можно отменить в любой момент. Прогресс сохраняется только в этом браузере на этом устройстве; очистка данных сайта удалит отметки.</p>`,
  about: `${icon("compass", "dialog-icon")}<h2 id="dialog-title">AI начинается с любопытства</h2>
    <p>AI-Навигатор — бесплатный вводный курс для тех, кто никогда не программировал и хочет разобраться в искусственном интеллекте.</p>
    <p>Пять уроков, около 50 минут, понятные примеры и практика. Чтобы читать материалы и отмечать прохождение, не нужны аккаунт, платная подписка или сторонний AI-сервис.</p>
    <p>Это учебный навигатор, а не AI-чат. Приложение не отправляет ваши данные на сервер. Отметки хранятся локально в браузере.</p>`
};

document.addEventListener("click", (event) => {
  if (event.target.closest(".skip-link")) {
    event.preventDefault();
    const main = document.getElementById("main");
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: "start", behavior: "instant" });
    return;
  }
  const infoButton = event.target.closest("[data-info]");
  if (infoButton) {
    document.getElementById("dialog-content").innerHTML = infoContent[infoButton.dataset.info];
    dialog.showModal();
    return;
  }
  if (event.target.closest(".dialog-close")) dialog.close();
  if (event.target.closest("#complete-button")) toggleCompletion();
  const copyButton = event.target.closest(".copy-button");
  if (copyButton) copyPrompt(copyButton);
});

dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

window.addEventListener("hashchange", () => renderRoute(true));
window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  if (saveFailed) return;
  completed = readProgress(completed);
  updateProgress();
  renderCards();
  const lesson = currentLesson();
  if (lesson) updateCompletionUI(lesson);
});

renderCards();
updateProgress();
renderRoute();
