// ── Data ─────────────────────────────────────────────────────────────────

const LABELS = [
  "Никогда",
  "Очень редко",
  "Иногда",
  "Довольно часто",
  "Всегда / постоянно",
];

const TOX_QUESTIONS = [
  "Когда кто-то не соглашается со мной, я повышаю голос или становлюсь агрессивным.",
  "Я жёстко критикую других людей публично, не думая об их чувствах.",
  "Я испытываю удовольствие, когда кто-то терпит неудачу или выглядит плохо.",
  "Я использую сарказм и насмешки, чтобы поставить людей на место.",
  "Я перебиваю собеседников, не давая им договорить до конца.",
  "Я долго держу обиду и не могу простить, даже когда меня искренне просят об этом.",
  "Я распускаю слухи или говорю плохое о людях за их спиной.",
  "Я намеренно игнорирую человека (молчаливое наказание), если он меня расстроил.",
  "Я обвиняю других в своих ошибках, вместо того чтобы признать их.",
  "Я реагирую на любую критику в свой адрес враждебностью или агрессией.",
  "Мне нравится вызывать драму и конфликты в группе — это делает жизнь интереснее.",
  "Я использую чужие секреты или слабости как оружие в спорах.",
  "Я заставляю людей чувствовать себя виноватыми, чтобы добиться желаемого.",
  "Я унижаю или высмеиваю других, когда хочу почувствовать себя лучше.",
  "Я нарочно не отвечаю на сообщения или звонки, чтобы наказать человека.",
];

const EGO_QUESTIONS = [
  "Я считаю, что мои потребности важнее потребностей окружающих.",
  "В разговоре я очень много говорю о себе и своих делах.",
  "Мне сложно искренне порадоваться за чужой успех — я чаще завидую.",
  "Я редко интересуюсь делами других людей, если это не касается меня.",
  "Мне сложно признать свою неправоту перед другими.",
  "Я ожидаю особого отношения к себе — больше, чем другие заслуживают.",
  "Я думаю, что я талантливее и умнее большинства людей вокруг.",
  "Мне становится скучно или раздражительно, когда разговор не обо мне.",
  "Я с трудом сочувствую чужим проблемам — «их проблемы, не мои».",
  "Правила и договорённости, которые все соблюдают, ко мне не относятся.",
  "Я редко помогаю другим, не ожидая ничего взамен.",
  "Я уверен, что заслуживаю больше признания, чем получаю.",
  "Мне трудно по-настоящему слушать других — я думаю о своём.",
  "Я ставлю собственный комфорт выше неудобства, которое это причиняет другим.",
  "Я считаю, что большинство критики в мой адрес — это просто зависть.",
];

const TOX_LEVELS = [
  {
    min: 0, max: 25,
    emoji: "😌", cls: "level-0",
    title: "Низкая токсичность",
    desc: "Ты ведёшь себя уважительно и конструктивно. Конфликты — исключение, а не норма. Так держать!",
  },
  {
    min: 26, max: 50,
    emoji: "😐", cls: "level-1",
    title: "Умеренная токсичность",
    desc: "Иногда ты реагируешь резко или деструктивно. Есть точки роста — особенно в стрессовых ситуациях.",
  },
  {
    min: 51, max: 72,
    emoji: "😤", cls: "level-2",
    title: "Высокая токсичность",
    desc: "Твоё поведение регулярно причиняет дискомфорт окружающим. Стоит поработать над управлением эмоциями и эмпатией.",
  },
  {
    min: 73, max: 100,
    emoji: "🔥", cls: "level-3",
    title: "Очень высокая токсичность",
    desc: "Твой стиль общения активно вредит отношениям. Честная самооценка — уже первый шаг к изменениям.",
  },
];

const EGO_LEVELS = [
  {
    min: 0, max: 25,
    emoji: "🤝", cls: "level-0",
    title: "Низкий эгоцентризм",
    desc: "Ты внимателен к людям вокруг и редко ставишь себя в центр Вселенной. Большой плюс в общении.",
  },
  {
    min: 26, max: 50,
    emoji: "🙂", cls: "level-1",
    title: "Умеренный эгоцентризм",
    desc: "Ты думаешь о себе чуть больше среднего, но это в пределах нормы. Иногда полезно лучше слушать других.",
  },
  {
    min: 51, max: 72,
    emoji: "😏", cls: "level-2",
    title: "Высокий эгоцентризм",
    desc: "Ты часто ставишь свои интересы выше чужих. Людям рядом с тобой, скорее всего, не хватает внимания и понимания.",
  },
  {
    min: 73, max: 100,
    emoji: "👑", cls: "level-3",
    title: "Выраженный нарциссизм",
    desc: "Мир крутится вокруг тебя — по крайней мере, в твоей голове. Искренняя эмпатия и интерес к другим могут сильно изменить твои отношения.",
  },
];

// ── State ─────────────────────────────────────────────────────────────────

const state = {
  screen: "home",   // home | quiz | loading | result
  quizType: null,   // "toxicity" | "ego"
  currentQ: 0,
  answers: [],
  result: null,
};

let doughnutChart = null;
let barChart = null;

// ── Render ────────────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById("app");
  if (state.screen === "home")    app.innerHTML = renderHome();
  if (state.screen === "quiz")    app.innerHTML = renderQuiz();
  if (state.screen === "loading") app.innerHTML = renderLoading();
  if (state.screen === "result")  { app.innerHTML = renderResult(); initCharts(); }
  attachEvents();
}

// ── Home screen ───────────────────────────────────────────────────────────

function renderHome() {
  return `
  <div class="screen">
    <div style="margin-bottom:40px">
      <div class="hero-badge">✦ Психологический тест</div>
      <h1>Узнай, насколько ты<br><span class="gradient-tox">токсичен</span> и<br><span class="gradient-ego">эгоцентричен</span></h1>
      <p class="mt-8" style="font-size:1rem;max-width:500px">
        Пройди один или оба опросника — и сравни результат с сотнями других людей.
        Честные ответы дадут честный результат.
      </p>
    </div>

    <div class="quiz-grid">
      <div class="quiz-card tox" data-action="start" data-type="toxicity">
        <div class="quiz-icon">☢️</div>
        <h3 class="gradient-tox">Анализатор токсичности</h3>
        <p>Насколько твоё поведение вредит окружающим?</p>
        <div class="quiz-meta">
          <span class="tag tag-tox">15 вопросов</span>
          &nbsp;≈ 3 мин
        </div>
      </div>

      <div class="quiz-card ego" data-action="start" data-type="ego">
        <div class="quiz-icon">🪞</div>
        <h3 class="gradient-ego">Тест на эгоцентризм</h3>
        <p>Насколько ты сосредоточен на себе?</p>
        <div class="quiz-meta">
          <span class="tag tag-ego">15 вопросов</span>
          &nbsp;≈ 3 мин
        </div>
      </div>
    </div>

    <p class="text-muted text-center" style="margin-top:8px">
      Ответы анонимны и используются только для сравнительной статистики.
    </p>
  </div>`;
}

// ── Quiz screen ───────────────────────────────────────────────────────────

function renderQuiz() {
  const isTox = state.quizType === "toxicity";
  const questions = isTox ? TOX_QUESTIONS : EGO_QUESTIONS;
  const q = questions[state.currentQ];
  const total = questions.length;
  const pct = Math.round((state.currentQ / total) * 100);
  const cls = isTox ? "tox" : "ego";
  const selected = state.answers[state.currentQ];

  return `
  <div class="screen">
    <button class="btn btn-ghost" data-action="home" style="margin-bottom:20px;padding:8px 14px;font-size:.82rem">
      ← Назад на главную
    </button>

    <div class="progress-wrap">
      <div class="progress-bar ${cls}" style="width:${pct}%"></div>
    </div>
    <div class="q-counter">${state.currentQ + 1} / ${total}</div>

    <div class="card">
      <div class="q-text">${q}</div>

      <div class="options">
        ${LABELS.map((lbl, i) => {
          const val = i + 1;
          const isSel = selected === val;
          return `
          <button class="option-btn ${cls} ${isSel ? "selected" : ""}"
                  data-action="answer" data-val="${val}">
            <div class="option-dot">${isSel ? "✓" : ""}</div>
            <span>${lbl}</span>
          </button>`;
        }).join("")}
      </div>

      <div class="nav-row">
        <button class="btn btn-ghost" data-action="prev"
          ${state.currentQ === 0 ? "disabled" : ""}>
          ← Назад
        </button>
        <button class="btn btn-${cls}" data-action="next"
          ${selected == null ? "disabled style='opacity:.45;cursor:not-allowed'" : ""}>
          ${state.currentQ === total - 1 ? "Завершить →" : "Далее →"}
        </button>
      </div>
    </div>

    <p class="text-muted text-center mt-16">
      Отвечай честно — тест только для тебя
    </p>
  </div>`;
}

// ── Loading screen ────────────────────────────────────────────────────────

function renderLoading() {
  return `
  <div class="screen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:16px">
    <div class="spinner" style="width:44px;height:44px;border-width:4px"></div>
    <p>Обрабатываем результаты…</p>
  </div>`;
}

// ── Result screen ─────────────────────────────────────────────────────────

function renderResult() {
  const r = state.result;
  const isTox = state.quizType === "toxicity";
  const levels = isTox ? TOX_LEVELS : EGO_LEVELS;
  const cls = isTox ? "tox" : "ego";
  const level = levels.find(l => r.score >= l.min && r.score <= l.max) || levels[levels.length - 1];
  const higher = (100 - r.percentile).toFixed(0);

  return `
  <div class="screen">
    <button class="btn btn-ghost" data-action="home" style="margin-bottom:20px;padding:8px 14px;font-size:.82rem">
      ← На главную
    </button>

    <div class="card">
      <div class="text-center">
        <span class="emoji-big">${level.emoji}</span>
        <h2>${level.title}</h2>
        <p class="mt-4" style="font-size:.95rem">
          ${isTox ? '<span class="gradient-tox">Токсичность</span>' : '<span class="gradient-ego">Эгоцентризм</span>'}
        </p>
      </div>

      <!-- Score ring -->
      <div class="score-ring-wrap">
        <canvas id="ringChart" width="180" height="180"></canvas>
      </div>

      <!-- Interpretation banner -->
      <div class="interp-banner ${level.cls}">
        <div class="interp-title">${level.title}</div>
        <div class="interp-desc">${level.desc}</div>
      </div>

      <hr class="divider" />

      <!-- Stats grid -->
      <h3 class="mb-16">Сравнение с другими</h3>

      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-val" style="color:var(--${cls === 'tox' ? 'tox-2' : 'ego-2'})">${r.score.toFixed(0)}</div>
          <div class="stat-lbl">Твой балл</div>
        </div>
        <div class="stat-item">
          <div class="stat-val">${r.mean}</div>
          <div class="stat-lbl">Средний балл</div>
        </div>
        <div class="stat-item">
          <div class="stat-val">${r.median}</div>
          <div class="stat-lbl">Медиана</div>
        </div>
      </div>

      <div class="text-center mt-8 mb-16">
        <span class="percentile-badge ${cls}">
          Топ ${higher}% ${isTox ? "токсичнее тебя" : "эгоцентричнее тебя"}
        </span>
        <p class="text-muted mt-4">
          Ты ${r.percentile < 50 ? "менее" : "более"} ${isTox ? "токсичен" : "эгоцентричен"},
          чем ${r.percentile}% участников (${r.total_users.toLocaleString()} чел.)
        </p>
      </div>

      <!-- Bar chart -->
      <div class="chart-wrap">
        <div class="chart-title">Распределение баллов среди всех участников</div>
        <canvas id="barChart" height="160"></canvas>
      </div>

      <!-- Actions -->
      <div class="result-actions">
        <button class="btn btn-${cls} btn-full" data-action="retry">
          Пройти снова
        </button>
        <button class="btn btn-ghost btn-full" data-action="other">
          ${isTox ? "Тест на эгоцентризм 🪞" : "Тест на токсичность ☢️"}
        </button>
      </div>
    </div>
  </div>`;
}

// ── Chart init ────────────────────────────────────────────────────────────

function initCharts() {
  const r = state.result;
  const isTox = state.quizType === "toxicity";
  const color1 = isTox ? "#7c3aed" : "#0891b2";
  const color2 = isTox ? "#a855f7" : "#22d3ee";
  const score = r.score;

  // Doughnut ring
  if (doughnutChart) doughnutChart.destroy();
  const ringCtx = document.getElementById("ringChart");
  if (ringCtx) {
    doughnutChart = new Chart(ringCtx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [score, 100 - score],
          backgroundColor: [color2, "#2a2a40"],
          borderWidth: 0,
          circumference: 300,
          rotation: -150,
        }],
      },
      options: {
        cutout: "78%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        animation: { animateRotate: true, duration: 900 },
      },
      plugins: [{
        id: "centerText",
        afterDraw(chart) {
          const { ctx, width, height } = chart;
          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const cx = width / 2, cy = height / 2 + 8;
          ctx.font = "bold 2rem Inter, sans-serif";
          ctx.fillStyle = "#e8e8f0";
          ctx.fillText(score.toFixed(0), cx, cy - 8);
          ctx.font = ".75rem Inter, sans-serif";
          ctx.fillStyle = "#8888aa";
          ctx.fillText("из 100", cx, cy + 20);
          ctx.restore();
        },
      }],
    });
  }

  // Bar chart
  if (barChart) barChart.destroy();
  const barCtx = document.getElementById("barChart");
  if (barCtx) {
    const bucketLabels = ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80-89","90-100"];
    const myBucket = Math.min(9, Math.floor(score / 10));
    const bgColors = r.distribution.map((_, i) =>
      i === myBucket ? color2 : "#2a2a40"
    );
    barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: bucketLabels,
        datasets: [{
          data: r.distribution,
          backgroundColor: bgColors,
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: (ctx) => ` ${ctx.raw} чел.`,
        }}},
        scales: {
          x: { ticks: { color: "#8888aa", font: { size: 10 } }, grid: { display: false } },
          y: { ticks: { color: "#8888aa", font: { size: 10 } }, grid: { color: "#2a2a40" } },
        },
        animation: { duration: 800 },
      },
    });
  }
}

// ── Score calculation ─────────────────────────────────────────────────────

function calcScore() {
  const n = state.answers.length;
  const sum = state.answers.reduce((a, b) => a + b, 0);
  return Math.round(((sum - n) / (4 * n)) * 100);
}

// ── API calls ─────────────────────────────────────────────────────────────

async function submitResults() {
  const score = calcScore();
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_type: state.quizType,
        score,
        answers: state.answers,
      }),
    });
    if (!res.ok) throw new Error("Server error");
    const data = await res.json();
    return { score, ...data };
  } catch (err) {
    // Fallback if backend unreachable
    return {
      score,
      percentile: 50,
      mean: 45,
      median: 42,
      distribution: [12, 18, 22, 20, 15, 10, 8, 5, 4, 2],
      total_users: 116,
    };
  }
}

// ── Events ────────────────────────────────────────────────────────────────

function attachEvents() {
  document.querySelectorAll("[data-action]").forEach(el => {
    el.addEventListener("click", handleAction);
  });
}

async function handleAction(e) {
  const el = e.currentTarget;
  const action = el.dataset.action;

  if (action === "start") {
    state.quizType = el.dataset.type;
    state.currentQ = 0;
    state.answers = [];
    state.screen = "quiz";
    render();
  }

  if (action === "home") {
    state.screen = "home";
    render();
  }

  if (action === "answer") {
    const val = parseInt(el.dataset.val);
    state.answers[state.currentQ] = val;
    render();
  }

  if (action === "prev") {
    if (state.currentQ > 0) { state.currentQ--; render(); }
  }

  if (action === "next") {
    const questions = state.quizType === "toxicity" ? TOX_QUESTIONS : EGO_QUESTIONS;
    if (state.answers[state.currentQ] == null) return;

    if (state.currentQ < questions.length - 1) {
      state.currentQ++;
      render();
    } else {
      // Submit
      state.screen = "loading";
      render();
      state.result = await submitResults();
      state.screen = "result";
      render();
    }
  }

  if (action === "retry") {
    state.currentQ = 0;
    state.answers = [];
    state.screen = "quiz";
    render();
  }

  if (action === "other") {
    state.quizType = state.quizType === "toxicity" ? "ego" : "toxicity";
    state.currentQ = 0;
    state.answers = [];
    state.screen = "quiz";
    render();
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────
render();
