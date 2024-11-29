FROM python:3.9-slim

WORKDIR /usr/src/app

# 依存関係をインストール
COPY requirements.txt .
RUN pip install -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# Pythonパスを設定
ENV PYTHONPATH=/usr/src/app