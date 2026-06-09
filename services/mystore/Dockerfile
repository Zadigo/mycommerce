FROM python:alpine AS builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set uv environment variables
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY pyproject.toml uv.lock ./

# Install dependencies into /app/.venv (no project, just deps)
RUN uv sync --frozen --no-install-project --no-dev

FROM python:alpine AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH"

# Install system dependencies needed at runtime
# Python:slim -> RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*
RUN apk add --no-cache libpq

# Create a non-root user for security
# Python:slim -> RUN groupadd --gid 1001 django && useradd --uid 1001 --gid django --shell /bin/bash --create-home django
RUN addgroup -S django && adduser -S django -G django


WORKDIR /app

# Copy the virtualenv from builder stage
COPY --from=builder /app/.venv /app/.venv

# Copy project source
COPY . .
# COPY --chown=django:django . .

# Switch to non-root user
# USER django

# Make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 8000

# Run with gunicorn (replace 'config' with your Django project name)
# ENTRYPOINT ["gunicorn", "mystore.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--threads", "2", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-"]

# For development, you might want to run with Django's development server
ENTRYPOINT ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# For production
# ENTRYPOINT [ "./entrypoint.sh" ]
