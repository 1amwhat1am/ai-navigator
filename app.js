"use strict";

const Progress = AINavigatorProgress;
const Quiz = AINavigatorQuiz;

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

const homeView = document.getElementById("home-view");
const lessonView = document.getElementById("lesson-view");
const storageWarning = document.getElementById("storage-warning");
// Доступ к localStorage тоже может выбросить SecurityError.
const browserStorage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value)
};
const progressStore = Progress.createStore(browserStorage, (message) => {
  storageWarning.textContent = message;
  storageWarning.hidden = !message;
});
let progress = progressStore.snapshot();
let toastTimeout;

function icon(name, extraClass = "") {
  return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
}

function renderCards() {
  document.getElementById("lesson-grid").innerHTML = lessons.map((lesson) => {
    const read = progress.readLessonIds.includes(lesson.id);
    const status = Progress.status(progress, lesson.id);
    return `<article class="lesson-card${read ? " completed" : ""}" data-lesson-id="${lesson.id}" data-status="${status.key}">
      <div class="card-top"><span class="lesson-icon ${lesson.color}">${icon(lesson.icon)}</span>
        <span class="lesson-status status-${status.key}">${status.label}</span>
      </div>
      <span class="lesson-number">УРОК 0${lesson.id}${lesson.id === 2 ? " · С ТЕСТОМ" : ""}</span>
      <h3><a href="#lesson-${lesson.id}">${lesson.title}</a></h3>
      <p>${lesson.description}</p>
      <div class="card-bottom">${icon("clock")}<span>${lesson.minutes} мин</span><span class="card-practice">С практикой</span>${read ? '<span class="read-badge">Прочитан</span>' : ""}<span class="card-arrow">${icon("arrow")}</span></div>
    </article>`;
  }).join("") + `<div class="encouragement-card">${icon("leaf")}<h3>Не нужно знать всё.<br>Достаточно начать.</h3><p>Каждый урок — небольшой шаг к уверенности. У вас получится.</p></div>`;
}

function updateProgress() {
  const count = progress.readLessonIds.length;
  const percent = count / lessons.length * 100;
  const masteredCount = lessons.filter((lesson) => Progress.isMastered(progress, lesson.id)).length;
  const masteryPercent = masteredCount / lessons.length * 100;
  document.getElementById("completed-count").textContent = `Прочитано ${count} из 5 уроков`;
  document.getElementById("progress-percent").textContent = `${percent}%`;
  document.getElementById("progress-fill").style.width = `${percent}%`;
  document.getElementById("course-progress").setAttribute("aria-valuenow", percent);
  document.getElementById("mastery-count").textContent = `Освоено ${masteredCount} из 5 уроков`;
  document.getElementById("mastery-percent").textContent = `${masteryPercent}%`;
  document.getElementById("mastery-fill").style.width = `${masteryPercent}%`;
  document.getElementById("mastery-progress").setAttribute("aria-valuenow", masteryPercent);
  document.getElementById("progress-description").textContent = count === 0
    ? "Открытие урока не считается отметкой прочтения."
    : "Ознакомление с материалом и проверка знаний учитываются отдельно.";
  const nextLesson = lessons.find((lesson) => !progress.readLessonIds.includes(lesson.id) || (lesson.id === 2 && !Progress.isMastered(progress, 2)));
  document.getElementById("continue-link").href = `#lesson-${nextLesson?.id || 1}`;
  document.getElementById("continue-label").textContent = !nextLesson ? "Повторить уроки" : progress.startedLessonIds.length ? "Продолжить обучение" : "Начать обучение";
}

function refreshOverview() {
  progress = progressStore.snapshot();
  updateProgress();
  renderCards();
}

function mountQuiz() {
  const container = document.getElementById("lesson-quiz");
  if (!container) return;
  const perform = (action, redraw) => {
    try {
      action();
      refreshOverview();
      if (redraw) mountQuiz();
    } catch (error) {
      showToast(error.message);
      progressStore.refresh();
      refreshOverview();
      mountQuiz();
    }
  };
  Quiz.mount(container, progress, {
    persistent: progressStore.canPersist(),
    start: () => perform(() => progressStore.startQuiz(), true),
    answer: (draftId, questionId, choices) => perform(() => progressStore.answerQuiz(draftId, questionId, choices), false),
    submit: (draftId, answers) => perform(() => progressStore.submitQuiz(draftId, answers), true)
  });
}

function currentLesson() {
  const match = /^#lesson-([1-5])$/.exec(location.hash);
  return match ? lessons.find((lesson) => lesson.id === Number(match[1])) : null;
}

function updateCompletionUI(lesson) {
  const isCompleted = progress.readLessonIds.includes(lesson.id);
  const button = document.getElementById("complete-button");
  if (!button) return;
  button.className = `button ${isCompleted ? "button-soft" : "button-dark"}`;
  button.setAttribute("aria-pressed", String(isCompleted));
  button.innerHTML = `${icon(isCompleted ? "check" : "text")}<span>${isCompleted ? "Отменить отметку прочтения" : "Отметить как прочитанный"}</span>`;
  document.getElementById("completion-title").textContent = isCompleted ? "Материал прочитан" : "Разобрались и попробовали?";
  document.getElementById("completion-description").textContent = isCompleted ? "Это ознакомление с материалом. Тест для этого урока появится позже." : "Отметьте прочтение, когда будете готовы. Это не подтверждает освоение.";
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
    ${lesson.id === 2 ? '<section id="lesson-quiz" class="quiz-panel" aria-labelledby="quiz-title"></section>' : '<section class="completion-panel" aria-label="Отметка прочтения"><div><h2 id="completion-title"></h2><p id="completion-description"></p></div><button type="button" id="complete-button" class="button"></button></section>'}
    <nav class="lesson-navigation" aria-label="Навигация по урокам">
      ${previous ? `<a class="button button-light" href="#lesson-${previous.id}">${icon("arrow", "previous-arrow")}Предыдущий урок</a>` : `<span class="lesson-position">Первый из пяти шагов</span>`}
      ${next ? `<a class="button button-light" href="#lesson-${next.id}">Следующий урок${icon("arrow")}</a>` : `<a class="button button-light" href="#home">К моему обучению${icon("arrow")}</a>`}
    </nav>
  </div>`;
  if (lesson.id === 2) mountQuiz();
  else updateCompletionUI(lesson);
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
  if (lesson) {
    progressStore.markStarted(lesson.id);
    refreshOverview();
    renderLesson(lesson);
  }
  if (moveFocus) {
    document.getElementById("main").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

function toggleCompletion() {
  const lesson = currentLesson();
  if (!lesson || lesson.id === 2) return;
  progressStore.toggleRead(lesson.id);
  refreshOverview();
  updateCompletionUI(lesson);
  document.getElementById("announcement").textContent = `${progress.readLessonIds.includes(lesson.id) ? "Материал отмечен как прочитанный." : "Отметка прочтения отменена."} Ознакомление: ${progress.readLessonIds.length / lessons.length * 100}%.`;
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
    <ol><li><strong>Выберите урок.</strong> Идите по порядку или начните с интересной темы. Все материалы открыты сразу.</li><li><strong>Прочитайте и попробуйте.</strong> В каждом уроке есть небольшая практика и ориентир для самопроверки.</li><li><strong>Отметьте ознакомление.</strong> В уроках 1, 3, 4 и 5 можно отметить прочтение. В уроке 2 ознакомление учитывается после завершения теста.</li><li><strong>Подтвердите знания.</strong> Урок 2 считается освоенным только после результата от 80%. Неудачная повторная попытка сохраняет прежний успех.</li></ol>
    <p>Ознакомление и освоение считаются отдельно: каждый из пяти уроков — 20%. Пока проверка знаний доступна только в уроке 2, поэтому максимум освоения — 20%. Открытие урока даёт только статус «В процессе». Старые отметки сохранены как история ознакомления. Данные хранятся в этом браузере; очистка данных сайта удалит их.</p>`,
  about: `${icon("compass", "dialog-icon")}<h2 id="dialog-title">AI начинается с любопытства</h2>
    <p>AI-Навигатор — бесплатный вводный курс для тех, кто никогда не программировал и хочет разобраться в искусственном интеллекте.</p>
    <p>Пять уроков, около 50 минут, понятные примеры и практика. В уроке 2 есть интерактивный тест; результат от 80% подтверждает освоение. Чтобы читать материалы и отмечать прохождение, не нужны аккаунт, платная подписка или сторонний AI-сервис.</p>
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
  if (![Progress.STORAGE_KEY, Progress.LEGACY_KEY, null].includes(event.key)) return;
  progressStore.refresh();
  refreshOverview();
  const lesson = currentLesson();
  if (lesson?.id === 2) mountQuiz();
  else if (lesson) updateCompletionUI(lesson);
});

renderCards();
updateProgress();
renderRoute();
