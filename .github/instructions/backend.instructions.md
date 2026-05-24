---
applyTo: "blindest/**/*.py"
description: "Use when editing Django backend code, including models, DRF APIs, GraphQL schema, Channels consumers, Celery tasks, or tests in blindest/."
---

# Django Backend Instructions

**context**

- The backend is an ASGI Django app with `daphne`, `channels`, `graphene_django`, `drf-spectacular`, Celery, Redis, and RabbitMQ configured in [mystore/settings.py](mystore/settings.py).
- Core apps are `shop`, `stocks`, `variants` and `collection` and each REST Api logic is divided into three main folders: `api/serializers.py` and `api/views.py`. The views are imported in the main `<app>/urls.py` which is then included in the main `mystore/urls.py` under the `/api/v1/` path.
- Websocket behavior is part of the product architecture. Read [mystore/asgi.py](mystore/asgi.py) and the app `routing.py` files before changing consumers or auth flow.
- Test discovery is configured in [mystore/pytest.toml](mystore/pytest.toml) and coverage settings live in [mystore/pyproject.toml](mystore/pyproject.toml).
- Use `cd mystore && pytest` as the default validation command. Narrow to affected tests when you can.
- Keep settings and env-sensitive changes minimal. The checked-in settings default to SQLite for local DB state, but Channels and Celery still depend on Redis and RabbitMQ settings.
- All variables within the the `settings.py` file are stored in local `.env` files or system environment variables. Check the `settings.py` file for the relevant variable names and expected values.
- Files for deployment can be found in the root [docker-compose.yaml](docker-compose.yaml) and [mystore/Dockerfile](mystore/Dockerfile). Use those as references for env vars, mounted paths, and port configuration when relevant.
- The logic for the mystore backend workds exactly the same as the Django based micro-services for the cart, reviews and subscribers. Check the `services/` folder for more details on those micro-services and their README files for specific architecture and domain language references.
