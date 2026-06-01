FROM python:3.11-slim

WORKDIR /app

# Install Node.js 20
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Install Node deps and build frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy rest of source and build
COPY . .
RUN cd frontend && npm run build

CMD cd backend && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
