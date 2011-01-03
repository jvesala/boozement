drop database if exists boozement;
create database boozement;
grant all on boozement.* to 'boozement'@'%' identified by 'boozement';
grant all on boozement.* to 'boozement'@'localhost' identified by 'boozement';

drop database if exists boozement_test;
create database boozement_test;
grant all on boozement_test.* to 'boozement'@'%' identified by 'boozement';
grant all on boozement_test.* to 'boozement'@'localhost' identified by 'boozement';
