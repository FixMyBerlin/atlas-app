FROM ghcr.io/multi-py/python-uvicorn:py3.11-0.24.0

COPY ./api/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./api /app
