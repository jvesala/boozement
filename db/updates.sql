UPDATE servings s1
SET tokens =
    setweight(to_tsvector('simple', s1.type), 'A') ||
    setweight(to_tsvector('simple', to_char(s1.date, 'YYYY:DD:MM')), 'B') ||
    setweight(to_tsvector('simple', to_char(s1.date, 'HH24:MI')), 'C') ||
    setweight(to_tsvector('simple', to_char(s1.date, 'HH12:MI')), 'D')
FROM servings s2;



-- \(\d+,\d+,
-- ('acf556cc-72ab-4a04-922b-829116ab7638',
