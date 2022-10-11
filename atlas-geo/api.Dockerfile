FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

COPY ./exports/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./exports /app
