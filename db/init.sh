#!/usr/bin/env bash

BASEDIR=$(dirname $0)

psql -h boozement-postgres -U postgres -d postgres -f $BASEDIR/databases.sql
psql -h boozement-postgres -U postgres -d boozement -f $BASEDIR/schema.sql
psql -h boozement-postgres -U postgres -d boozement-integration -f $BASEDIR/schema.sql


# Insert data from outside
psql -h boozement-postgres -U postgres -d boozement -f $BASEDIR/../../dump.sql
