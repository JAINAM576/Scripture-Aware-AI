# Christianity-AI-Assistant

A high-performance, safe, denomination-aware, and scripture-grounded theological assistant. Built with a FastAPI backend and a modern React + Vite frontend, the assistant employs a dual-model LLM architecture via Groq and live Bible API grounding to provide deep theological insights while strictly preventing scripture hallucinations.

---

## 🌟 Key Features

* **Anti-Hallucination Grounding Gate**: The assistant is forbidden from quoting scripture from its internal model memory. All Bible passages are identified, verified, and fetched live from an external Bible API, then fed to the LLM inside secure `<verified_scripture>` XML tags.
* **Denomination-Aware Contexts**: Dynamically shifts theological explanations based on the selected tradition (**Catholic**, **Protestant**, **Orthodox**, or **Non-denominational**).
* **Canonical Boundary Enforcement**: Enforces scriptural differences between traditions (e.g., permits deuterocanonical books like Tobit and Judith for Catholic queries, but flags them as invalid and explains the canon boundaries for Protestant queries).
* **Isolated Multi-Session History**: Conversation logs and sessions are completely isolated on a per-denomination basis, maintaining distinct theological spaces.
* **Two-Tier Safety & Moderation Gates**: Rapid pre-check moderation filters out toxic or offensive prompts, and a specialized classification router blocks adversarial requests attempting to rewrite scripture for political or ideological bias.
* **Inline Multimodal Image Flow**: Image requests are automatically intercepted, rewritten by an LLM to ensure reverence, and sent to Pollinations.ai (powered by FLUX). Images load smoothly inside the chat interface using a shimmer/pulse skeleton UI.
* **Observability with LangSmith**: Traces all pipeline queries, latency, tokens, and model routes for production-ready auditability.

---

## 📐 System Architecture

Every user prompt passes through the following pipeline:

```
                            [ USER INPUT ]
                                  │
                                  ▼
                        [ 1. MODERATION GATE ] ──(Unsafe)──► [ Safety Refusal ]
                                  │ (Safe)
                                  ▼
                        [ 2. ROUTE CLASSIFIER ]
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
   [EXACT_VERSE]              [THEMATIC]              [DOCTRINAL]
 • Normalize reference      • Find relevant verses  • Apply denomination prompt
 • Fetch Bible API          • Fetch Bible API       • Skip API fetch
 • Verify chapter/verse     • Ground with XML tags  • Generate theological reply
         │                        │                        │
         └────────────────────────┴────────────────────────┘
                                  ▼
                         [ 3. LLM GROUNDING ]
                 (Inject scripture XML + last 10 turns)
                                  │
                                  ▼
                        [ 4. MAIN LLM (70B) ]
                                  │
                                  ▼
                         [ CHAT RESPONSE ]
```

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Vanilla CSS
* **Backend**: FastAPI, Python (managed via `uv` or `pip`)
* **Orchestration**: LangChain (InMemoryChatMessageHistory)
* **Models (Groq)**: 
  * `llama-3.1-8b-instant` (Moderation, Classification, Normalization, Thematic Search)
  * `llama-3.3-70b-versatile` (Main reasoning and theological response generation)
* **APIs**:
  * `bible-api.com` (Key-free scripture text provider)
  * `Pollinations.ai` (Key-free image generation)

---

## 🚀 Installation & Setup

### Prerequisites
* Python 3.10+
* Node.js 18+
* A Groq API Key (Free Tier)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   
   # Optional LangSmith Observability
   LANGSMITH_TRACING=true
   LANGSMITH_ENDPOINT=https://api.smith.langchain.com
   LANGSMITH_API_KEY=your_langsmith_api_key_here
   LANGSMITH_PROJECT="ChristianityAIAssistant"
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## 🧪 Running Evaluations

We have built a custom test suite with 41 distinct cases spanning scripture hallucinations, jailbreak attempts, canonical boundaries, and multi-turn conversation memory.

To run the evaluations against the active backend server:
```bash
cd backend
source .venv/bin/activate

# Run all test cases
python eval/run_tests.py

# Run a specific category (e.g., hallucination, adversarial, denomination)
python eval/run_tests.py --category hallucination

# Run with verbose output to inspect model responses
python eval/run_tests.py --category adversarial --verbose
```

---

## 📡 API Endpoints

### `POST /api/chat`
The primary chat orchestration endpoint.
* **Payload**:
  ```json
  {
    "session_id": "unique-session-string",
    "message": "What does Matthew 6:33 say?",
    "denomination": "Protestant"
  }
  ```
* **Response**:
  ```json
  {
    "reply": "According to Matthew 6:33...",
    "route_used": "EXACT_VERSE",
    "verses_fetched": ["Matthew 6:33"],
    "warning": "",
    "image_url": "",
    "safe_prompt": ""
  }
  ```

### `POST /api/generate-image`
Generates a Christian-themed image with visual moderation.
* **Payload**:
  ```json
  {
    "prompt": "Paint a picture of the crucifixion"
  }
  ```
* **Response**:
  ```json
  {
    "image_url": "https://image.pollinations.ai/prompt/...",
    "safe_prompt": "A reverent painting in a classical, dramatic oil style...",
    "original_prompt": "Paint a picture of the crucifixion",
    "blocked": false
  }
  ```
