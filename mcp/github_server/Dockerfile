FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r requirements.txt
COPY . /app
ENV PYTHONPATH=/app
EXPOSE 9101
CMD ["python","server.py"]
