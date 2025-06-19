FROM python:3.11

WORKDIR /app

COPY requirements/prod.txt .
RUN pip install --no-cache-dir -r prod.txt

COPY . .

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
