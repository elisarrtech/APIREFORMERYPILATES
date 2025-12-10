# Usar una imagen base oficial de Python
FROM python:3.13-slim

# Instalar dependencias de sistema necesarias para psycopg2, etc.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      libpq5 \
      gcc \
      && rm -rf /var/lib/apt/lists/*

# Crear directorio de la app
WORKDIR /app

# Copiar requirements e instalar
COPY backend/requirements.txt ./requirements.txt
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar código
COPY backend/ ./

# Exponer puerto (si usas gunicorn en 8000 o 8080)
EXPOSE 8000

# Comando por defecto (Railway usará esto para ejecutar)
CMD ["gunicorn", "backend.app:app", "--bind", "0.0.0.0:8000", "--workers", "2"]
