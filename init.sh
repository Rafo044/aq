#!/bin/bash

INIT_SQL="./var/lib/postgresql/init.sql"

set -a
source ".env"
set +a

docker exec -it pgdata psql -U $POSTGRES_USER -d $POSTGRES_DB -f "$INIT_SQL"
