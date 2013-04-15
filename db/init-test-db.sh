#!/bin/sh
mysql -u root -h 127.0.0.1 -e "drop database boozement_test;"
mysql -u root -h 127.0.0.1 -e "create database boozement_test;"
mysql -u root -h 127.0.0.1 boozement_test < testdata.sql
mysql -u root -h 127.0.0.1 boozement_test -e "rename table servings to servings_template"
mysql -u root -h 127.0.0.1 boozement_test -e "rename table users to users_template"
