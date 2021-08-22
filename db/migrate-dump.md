1. Remove start and end
2. Modify insert statement 
     
`INSERT INTO servings (user_id, date, type, amount, units) VALUES`

4. Replace \' with \'
5. Replace
-- \(\d+,\d+,
-- ('acf556cc-72ab-4a04-922b-829116ab7638',
6. Add line to dump file

`SET TIME ZONE 'America/New_York';`

8. Run 

`psql -h boozement-postgres -U postgres -d boozement -f ../dump.sql`
`psql -h boozement-postgres -U postgres -d boozement -f db/updates.sql`

