#!/usr/bin/env bash

BASEDIR=$(dirname $0)

psql -h boozement-postgres -U postgres -d postgres -f $BASEDIR/databases.sql
psql -h boozement-postgres -U postgres -d boozement -f $BASEDIR/schema.sql
psql -h boozement-postgres -U postgres -d boozement-integration -f $BASEDIR/schema.sql

# Insert data from outside
# Need to be run manually

#psql -h boozement-postgres -U postgres -d boozement -f $BASEDIR/../../dump.sql
#psql -h boozement-postgres -U postgres -d boozement -f $BASEDIR/updates.sql
