FROM postgres:latest

# PG Cron extension
# https://github.com/citusdata/pg_cron
RUN apt-get update && \
    apt-get -y install postgresql-10-cron && \
    echo "shared_preload_libraries='pg_cron'" >> /etc/postgresql/postgresql.conf && \
    echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/pg_hba.conf && \
    echo "listen_addresses='*'" >> /etc/postgresql/postgresql.conf

EXPOSE 5432
