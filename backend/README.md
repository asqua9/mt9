# MT9 Backend

## Kurulum

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Test

```bash
curl http://127.0.0.1:8000/health
```
