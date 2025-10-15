#!/bin/bash

ACTIVATE_LOG_SQL="./var/lib/postgresql/activate_log.sql"

set -a
source ".env"
set +a

docker exec -it pgdata psql -U $POSTGRES_USER -d $POSTGRES_DB -f "$ACTIVATE_LOG_SQL"
