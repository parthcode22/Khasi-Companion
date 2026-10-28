import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import re
import json
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("khasi-backend")

app = FastAPI(
    title="Khasi Companion AI API",
    description="Dual Model A (Neural MarianMT Translation) & Model B (Hybrid Semantic RAG) Backend",
    version="1.0.0",
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Flexible Path Auto-Discovery
# ---------------------------------------------------------------------------
def discover_path(target_name: str) -> Optional[Path]:
    """
    Search recursively across common project directories to find model weights
    and data files regardless of where the server is invoked.
    """
    candidate_roots = [
        Path.cwd(),
        Path.cwd() / "backend",
        Path.cwd() / "backend_assests",
        Path.cwd() / "models",
        Path.cwd().parent,
        Path.cwd().parent / "backend_assests",
        Path.cwd().parent / "models",
        Path("E:/ai project"),
        Path("E:/ai project/backend_assests"),
        Path("E:/ai project/models"),
        Path("C:/Users/Parth/Downloads/AI-Project khasi/backend_assests"),
        Path("C:/Users/Parth/Downloads/AI-Project khasi/backend"),
    ]

    for root in candidate_roots:
        if not root.exists():
            continue
        direct = root / target_name
        if direct.exists():
            return direct
        # Also check data subdirectory
        data_sub = root / "data" / target_name
        if data_sub.exists():
            return data_sub

    return None

# ---------------------------------------------------------------------------
# Global State & Lazy Model Loading
# ---------------------------------------------------------------------------
state: Dict[str, Any] = {
    "device": "cpu",
    "gpu_name": "CPU (PyTorch Fallback)",
    "model_a": None,
    "tokenizer_a": None,
    "model_b": None,
    "kb_records": [],
    "kb_embeddings": None,
    "phrasebook": [],
    "model_a_loaded": False,
    "model_b_loaded": False,
}

SAFETY_KEYWORDS = [
    "doctor", "hospital", "emergency", "police", "ambulance",
    "112", "allergy", "accident", "fire", "bleeding", "poison", "dying"
]

def detect_safety_critical(text: str) -> bool:
    if not text:
        return False
    lower = text.lower()
    return any(re.search(rf"\b{re.escape(kw)}\b", lower) for kw in SAFETY_KEYWORDS)

# ---------------------------------------------------------------------------
# Startup Event: Load Models and Index Knowledge Base
# ---------------------------------------------------------------------------
@app.on_event("startup")
def startup_event():
    logger.info("Initializing Khasi Companion AI Backend...")

    # 1. Detect hardware
    try:
        import torch
        if torch.cuda.is_available():
            state["device"] = "cuda"
            state["gpu_name"] = torch.cuda.get_device_name(0)
            logger.info(f"CUDA accelerator detected: {state['gpu_name']}")
        else:
            state["device"] = "cpu"
            state["gpu_name"] = "CPU (No CUDA device found)"
            logger.info("Using CPU device.")
    except Exception as e:
        logger.warning(f"PyTorch hardware probe error: {e}")

    # 2. Load Knowledge Base (Sync exact 6 tourism records)
    kb_path = discover_path("knowledge_base.json")
    if kb_path and kb_path.exists():
        try:
            with open(kb_path, "r", encoding="utf-8") as f:
                state["kb_records"] = json.load(f)
            logger.info(f"Loaded {len(state['kb_records'])} verified records from {kb_path}")
        except Exception as e:
            logger.error(f"Failed to parse knowledge_base.json: {e}")
    else:
        logger.warning("knowledge_base.json not found via path discovery.")

    # 3. Load Phrasebook
    pb_path = discover_path("phrasebook.json")
    if pb_path and pb_path.exists():
        try:
            with open(pb_path, "r", encoding="utf-8") as f:
                state["phrasebook"] = json.load(f)
            logger.info(f"Loaded {len(state['phrasebook'])} phrasebook records from {pb_path}")
        except Exception as e:
            logger.error(f"Failed to parse phrasebook.json: {e}")
    else:
        logger.warning("phrasebook.json not found via path discovery.")

    # 4. Load Model A (khasi_translator_v1_final - MarianMT Seq2Seq)
    model_a_dir = discover_path("khasi_translator_v1_final")
    if model_a_dir and model_a_dir.exists():
        try:
            from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
            logger.info(f"Loading Model A from {model_a_dir} on {state['device']}...")
            tokenizer = AutoTokenizer.from_pretrained(str(model_a_dir))
            model = AutoModelForSeq2SeqLM.from_pretrained(str(model_a_dir)).to(state["device"])
            model.eval()
            state["tokenizer_a"] = tokenizer
            state["model_a"] = model
            state["model_a_loaded"] = True
            logger.info("Model A (MarianMT opus-mt-en-mul) loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Model A: {e}")
    else:
        logger.warning("khasi_translator_v1_final folder not found.")

    # 5. Load Model B (khasi_semantic_model_b_v1 - SentenceTransformer) & Index KB
    model_b_dir = discover_path("khasi_semantic_model_b_v1")
    if model_b_dir and model_b_dir.exists():
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading Model B from {model_b_dir} on {state['device']}...")
            model_b = SentenceTransformer(str(model_b_dir), device=state["device"])
            state["model_b"] = model_b
            state["model_b_loaded"] = True

            # Dynamic 6-Record Vector Indexing
            if state["kb_records"]:
                kb_texts = [
                    f"{r.get('title', '')}. {r.get('location', '')}. {r.get('content', {}).get('en', '')}"
                    for r in state["kb_records"]
                ]
                embeddings = model_b.encode(kb_texts, convert_to_tensor=True)
                state["kb_embeddings"] = embeddings
                logger.info(f"Dynamically indexed all {len(kb_texts)} tourism records in Model B semantic memory.")
        except Exception as e:
            logger.error(f"Failed to load Model B: {e}")
    else:
        logger.warning("khasi_semantic_model_b_v1 folder not found.")

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def get_health():
    """System Health and Device Diagnostics"""
    return {
        "status": "ok",
        "device": state["device"],
        "gpu_name": state["gpu_name"],
        "model_a_loaded": state["model_a_loaded"],
        "model_b_loaded": state["model_b_loaded"],
        "kb_records_count": len(state["kb_records"]),
        "phrasebook_records_count": len(state["phrasebook"]),
        "is_live_backend": True,
    }

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "kha"

@app.post("/api/translate")
def translate(req: TranslateRequest):
    """
    Model A Bidirectional Translation with Phrasebook fast-path & safety firewall
    """
    raw_text = req.text.strip()
    if not raw_text:
        return {
            "input": "",
            "translation": "",
            "reverse_check": None,
            "verification_status": "unverified",
            "source": "none",
            "is_safety_critical": False,
            "safety_warning": None,
            "notes": "Empty text provided.",
        }

    is_safety_critical = detect_safety_critical(raw_text)
    safety_warning = (
        "Safety Notice: For urgent medical or police emergencies, do not rely solely on automated translation. Dial 112 directly."
        if is_safety_critical
        else None
    )

    # Fast-Path: Check curated phrasebook for STRICT EXACT whole-string match only
    words = raw_text.split()
    if len(words) <= 12:
        clean_query = re.sub(r'^[^\w]+|[^\w]+$', '', raw_text.lower()).strip()
        for pb in state["phrasebook"]:
            en_clean = re.sub(r'^[^\w]+|[^\w]+$', '', pb.get("english", "").lower()).strip()
            kha_clean = re.sub(r'^[^\w]+|[^\w]+$', '', pb.get("khasi", "").lower()).strip()

            if req.source_lang == "en" and en_clean == clean_query and pb.get("khasi"):
                return {
                    "input": raw_text,
                    "translation": pb["khasi"],
                    "reverse_check": pb["english"],
                    "verification_status": pb.get("verification_status", "verified_native_speaker"),
                    "source": "Curated Native Phrasebook",
                    "is_safety_critical": is_safety_critical,
                    "safety_warning": safety_warning,
                    "notes": f"Exact verified match from curated dataset ({pb.get('dialect', 'Standard Khasi')}).",
                }
            elif req.source_lang == "kha" and kha_clean == clean_query and pb.get("english"):
                return {
                    "input": raw_text,
                    "translation": pb["english"],
                    "reverse_check": pb["khasi"],
                    "verification_status": pb.get("verification_status", "verified_native_speaker"),
                    "source": "Curated Native Phrasebook",
                    "is_safety_critical": is_safety_critical,
                    "safety_warning": safety_warning,
                    "notes": "Exact verified match from curated dataset.",
                }

    # Model A Neural Translation (with Multi-Sentence Paragraph Batching)
    if state["model_a_loaded"] and state["model_a"] is not None and state["tokenizer_a"] is not None:
        try:
            tokenizer = state["tokenizer_a"]
            model = state["model_a"]
            device = state["device"]

            # Split paragraph into individual sentences for high-fidelity translation
            raw_sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', raw_text) if s.strip()]
            if not raw_sentences:
                raw_sentences = [raw_text]

            # Forward translation
            prefix = ">>kha<< " if req.source_lang == "en" else ">>eng<< "
            prompts = [prefix + s for s in raw_sentences]

            inputs = tokenizer(prompts, return_tensors="pt", padding=True, truncation=True, max_length=128).to(device)
            gen = model.generate(**inputs, max_length=128, num_beams=4, early_stopping=True)
            translated_sents = [tokenizer.decode(g, skip_special_tokens=True).strip() for g in gen]
            translation = " ".join(translated_sents)

            # Reverse check: back-translate each sentence
            rev_prefix = ">>eng<< " if req.source_lang == "en" else ">>kha<< "
            rev_prompts = [rev_prefix + s for s in translated_sents if s]
            if rev_prompts:
                rev_inputs = tokenizer(rev_prompts, return_tensors="pt", padding=True, truncation=True, max_length=128).to(device)
                rev_gen = model.generate(**rev_inputs, max_length=128, num_beams=4, early_stopping=True)
                rev_sents = [tokenizer.decode(g, skip_special_tokens=True).strip() for g in rev_gen]
                reverse_check = " ".join(rev_sents)
            else:
                reverse_check = ""

            return {
                "input": raw_text,
                "translation": translation,
                "reverse_check": reverse_check,
                "verification_status": "unverified",
                "source": "Model A (MarianMT opus-mt-en-mul)",
                "is_safety_critical": is_safety_critical,
                "safety_warning": safety_warning,
                "notes": f"Neural translation of {len(raw_sentences)} sentence(s) generated by Model A.",
            }
        except Exception as e:
            logger.error(f"Model A generation failed: {e}")

    # Fallback if Model A is not loaded
    return {
        "input": raw_text,
        "translation": None,
        "reverse_check": None,
        "verification_status": "unverified",
        "source": "Backend (Models Offline)",
        "is_safety_critical": is_safety_critical,
        "safety_warning": safety_warning or "Model A neural weights are offline.",
        "notes": "Model A weights not ready. Please verify khasi_translator_v1_final folder.",
    }

def lexical_overlap(query: str, text: str) -> float:
    """Compute lexical non-stopword overlap ratio"""
    stop_words = {"the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "is", "are", "ka", "u", "ki", "i"}
    q_tokens = set(re.findall(r"\w+", query.lower())) - stop_words
    t_tokens = set(re.findall(r"\w+", text.lower())) - stop_words
    if not q_tokens:
        return 0.0
    return len(q_tokens & t_tokens) / len(q_tokens)

@app.get("/api/tourism")
def get_tourism(q: Optional[str] = Query(None)):
    """
    Model B Hybrid Semantic RAG with 0.38 Zero-Hallucination Anti-Hallucination Threshold
    """
    query = (q or "").strip()
    records = state["kb_records"]

    if not query or query == "*":
        return {
            "results": records,
            "count": len(records),
            "blocked_by_zero_hallucination": False,
            "notice": None,
            "is_live_model_b": state["model_b_loaded"],
        }

    # Hybrid RAG Ranking
    if state["model_b_loaded"] and state["model_b"] is not None and state["kb_embeddings"] is not None:
        try:
            from sentence_transformers import util
            model_b = state["model_b"]
            q_embed = model_b.encode(query, convert_to_tensor=True)
            cos_sims = util.cos_sim(q_embed, state["kb_embeddings"])[0].cpu().numpy()

            scored_records = []
            for i, rec in enumerate(records):
                dense_score = float(cos_sims[i])
                rec_text = f"{rec.get('title', '')} {rec.get('location', '')} {rec.get('content', {}).get('en', '')} {rec.get('safety_notes', '')}"
                lex_score = lexical_overlap(query, rec_text)
                # 75% Dense Semantic + 25% Grounded Lexical Overlap
                hybrid_score = (0.75 * dense_score) + (0.25 * lex_score)

                if hybrid_score >= 0.38:
                    scored_records.append({**rec, "hybrid_score": round(hybrid_score, 4)})

            scored_records.sort(key=lambda x: x["hybrid_score"], reverse=True)

            if not scored_records:
                return {
                    "results": [],
                    "count": 0,
                    "blocked_by_zero_hallucination": True,
                    "notice": "🛡️ No verified records match your query above the 0.38 confidence threshold. Khasi Companion adheres to a strict Zero-Hallucination policy and never invents ticket prices, timings, or unverified locations.",
                    "is_live_model_b": True,
                }

            return {
                "results": scored_records,
                "count": len(scored_records),
                "blocked_by_zero_hallucination": False,
                "notice": None,
                "is_live_model_b": True,
            }
        except Exception as e:
            logger.error(f"Model B ranking error: {e}")

    # Keyword fallback if Model B is unavailable
    q_lower = query.lower()
    matched = [
        r for r in records
        if q_lower in r.get("title", "").lower()
        or q_lower in r.get("location", "").lower()
        or q_lower in r.get("content", {}).get("en", "").lower()
    ]
    is_blocked = len(matched) == 0

    return {
        "results": matched,
        "count": len(matched),
        "blocked_by_zero_hallucination": is_blocked,
        "notice": "🛡️ No verified records match your query." if is_blocked else None,
        "is_live_model_b": False,
    }

@app.get("/api/phrasebook")
def get_phrasebook_endpoint(category: Optional[str] = Query(None)):
    """Retrieve curated phrasebook records with optional category filtering"""
    records = state["phrasebook"]
    if not category or category == "All":
        return records
    cat_lower = category.lower()
    return [r for r in records if cat_lower in r.get("category", "").lower()]

class QuizGradeRequest(BaseModel):
    english_prompt: str
    user_khasi_attempt: str

@app.post("/api/quiz-grade")
def grade_quiz(req: QuizGradeRequest):
    """
    Interactive AI Tutor: Uses Model A for reference Khasi generation and
    Model B for semantic similarity grading (0-100%).
    """
    eng = req.english_prompt.strip()
    user_khasi = req.user_khasi_attempt.strip()

    if not eng or not user_khasi:
        raise HTTPException(status_code=400, detail="Both english_prompt and user_khasi_attempt are required.")

    # 1. Determine reference translation
    ref_khasi = ""
    # Check phrasebook first
    for pb in state["phrasebook"]:
        if pb.get("english", "").lower().strip() == eng.lower().strip() and pb.get("khasi"):
            ref_khasi = pb["khasi"]
            break

    # If not in phrasebook, use Model A
    if not ref_khasi and state["model_a_loaded"]:
        try:
            tokenizer = state["tokenizer_a"]
            model = state["model_a"]
            prompt = ">>kha<< " + eng
            inputs = tokenizer([prompt], return_tensors="pt", padding=True, truncation=True, max_length=128).to(state["device"])
            gen = model.generate(**inputs, max_length=128, num_beams=4)
            ref_khasi = tokenizer.decode(gen[0], skip_special_tokens=True).strip()
        except Exception as e:
            logger.error(f"Failed to generate reference translation with Model A: {e}")

    if not ref_khasi:
        ref_khasi = "Khublei"  # General fallback

    # 2. Grade similarity using Model B
    score = 50
    reverse_check = None

    if state["model_b_loaded"] and state["model_b"] is not None:
        try:
            from sentence_transformers import util
            model_b = state["model_b"]
            embeds = model_b.encode([user_khasi, ref_khasi], convert_to_tensor=True)
            cos_sim = float(util.cos_sim(embeds[0], embeds[1])[0][0])
            score = int(round(max(0.0, min(1.0, cos_sim)) * 100))
        except Exception as e:
            logger.error(f"Model B grading error: {e}")
    else:
        # Lexical fallback score
        user_words = set(user_khasi.lower().split())
        ref_words = set(ref_khasi.lower().split())
        overlap = len(user_words & ref_words) / max(len(ref_words), 1)
        score = int(round(overlap * 100))

    # 3. Model A Reverse Check on user's attempt
    if state["model_a_loaded"] and state["model_a"] is not None and state["tokenizer_a"] is not None:
        try:
            tokenizer = state["tokenizer_a"]
            model = state["model_a"]
            prompt = ">>eng<< " + user_khasi
            inputs = tokenizer([prompt], return_tensors="pt", padding=True, truncation=True, max_length=128).to(state["device"])
            gen = model.generate(**inputs, max_length=128, num_beams=4)
            reverse_check = tokenizer.decode(gen[0], skip_special_tokens=True).strip()
        except Exception as e:
            logger.warning(f"Reverse check failed: {e}")

    # 4. Constructive Tutor Feedback
    if score >= 85:
        feedback = "Bha bha! Outstanding translation! Highly natural, grammatically aligned, and understandable to native Khasi speakers."
    elif score >= 65:
        feedback = "Good attempt! Understandable in everyday conversation with minor dialect or honorific variance."
    elif score >= 40:
        feedback = "Fair effort. Key vocabulary words are present, but check noun prefixes (Ka/U) and sentence structure."
    else:
        feedback = "Keep practicing! Review the gender particles (Ka for feminine/nature, U for masculine) and practice with the phrasebook."

    return {
        "score": score,
        "reference_khasi": ref_khasi,
        "feedback": feedback,
        "reverse_check": reverse_check,
        "model_used": "Model A (MarianMT) + Model B (Cross-Lingual MiniLM)",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
