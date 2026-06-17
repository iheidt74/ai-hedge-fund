import sqlite3
import json
import random
from contextlib import contextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

DB_PATH = "toxicity.db"
STATIC_DIR = Path(__file__).parent / "static"

app = FastAPI(title="Toxicity Analyzer")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# ── DB helpers ─────────────────────────────────────────────────────────────

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS results (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                quiz_type   TEXT NOT NULL,
                score       REAL NOT NULL,
                answers     TEXT NOT NULL,
                created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)
    _seed_data()


def _seed_data():
    """Pre-populate with realistic distribution so first users see real comparison."""
    with get_db() as conn:
        count = conn.execute("SELECT COUNT(*) FROM results").fetchone()[0]
        if count >= 200:
            return

    # Toxicity: right-skewed (most people are not very toxic)
    tox_scores = (
        [random.gauss(20, 8) for _ in range(80)] +  # low
        [random.gauss(40, 8) for _ in range(70)] +  # medium
        [random.gauss(60, 8) for _ in range(35)] +  # high
        [random.gauss(78, 6) for _ in range(15)]     # very high
    )
    # Self-centered: roughly normal, slightly right-skewed
    ego_scores = (
        [random.gauss(25, 10) for _ in range(60)] +
        [random.gauss(45, 10) for _ in range(80)] +
        [random.gauss(65, 8)  for _ in range(45)] +
        [random.gauss(82, 5)  for _ in range(15)]
    )

    with get_db() as conn:
        for s in tox_scores:
            conn.execute(
                "INSERT INTO results (quiz_type, score, answers) VALUES (?,?,?)",
                ("toxicity", max(0, min(100, s)), "[]"),
            )
        for s in ego_scores:
            conn.execute(
                "INSERT INTO results (quiz_type, score, answers) VALUES (?,?,?)",
                ("ego", max(0, min(100, s)), "[]"),
            )


# ── Models ─────────────────────────────────────────────────────────────────

class SubmitRequest(BaseModel):
    quiz_type: str   # "toxicity" | "ego"
    score: float
    answers: list[int]


class StatsResponse(BaseModel):
    percentile: float
    mean: float
    median: float
    distribution: list[int]   # 10 buckets 0-9, 10-19, …, 90-100
    total_users: int


# ── Routes ─────────────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def root():
    return FileResponse(STATIC_DIR / "index.html")


@app.post("/api/submit", response_model=StatsResponse)
async def submit(req: SubmitRequest):
    if req.quiz_type not in ("toxicity", "ego"):
        raise HTTPException(400, "Invalid quiz_type")
    if not (0 <= req.score <= 100):
        raise HTTPException(400, "Score out of range")

    with get_db() as conn:
        conn.execute(
            "INSERT INTO results (quiz_type, score, answers) VALUES (?,?,?)",
            (req.quiz_type, req.score, json.dumps(req.answers)),
        )
        rows = conn.execute(
            "SELECT score FROM results WHERE quiz_type=?", (req.quiz_type,)
        ).fetchall()

    scores = sorted(r["score"] for r in rows)
    n = len(scores)
    below = sum(1 for s in scores if s < req.score)
    percentile = round(below / n * 100, 1)

    mean = round(sum(scores) / n, 1)
    median = round(scores[n // 2], 1)

    buckets = [0] * 10
    for s in scores:
        buckets[min(9, int(s // 10))] += 1

    return StatsResponse(
        percentile=percentile,
        mean=mean,
        median=median,
        distribution=buckets,
        total_users=n,
    )


@app.get("/api/stats/{quiz_type}", response_model=StatsResponse)
async def stats(quiz_type: str):
    if quiz_type not in ("toxicity", "ego"):
        raise HTTPException(400, "Invalid quiz_type")

    with get_db() as conn:
        rows = conn.execute(
            "SELECT score FROM results WHERE quiz_type=?", (quiz_type,)
        ).fetchall()

    if not rows:
        raise HTTPException(404, "No data yet")

    scores = sorted(r["score"] for r in rows)
    n = len(scores)
    mean = round(sum(scores) / n, 1)
    median = round(scores[n // 2], 1)

    buckets = [0] * 10
    for s in scores:
        buckets[min(9, int(s // 10))] += 1

    return StatsResponse(
        percentile=50,
        mean=mean,
        median=median,
        distribution=buckets,
        total_users=n,
    )


@app.on_event("startup")
def startup():
    init_db()
