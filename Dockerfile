FROM python:latest

WORKDIR /app

# https://spacy.io/usage/models
RUN python -m spacy download fr_core_news_md
RUN python -m spacy download en_core_web_sm
