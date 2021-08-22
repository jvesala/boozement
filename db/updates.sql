UPDATE servings s1
SET tokens =
    setweight(to_tsvector('simple', lower(s1.type)), 'A') ||
    setweight(to_tsvector('simple', to_char(s1.date, 'YYYY:DD:MM')), 'B') ||
    setweight(to_tsvector('simple', to_char(s1.date, 'HH24:MI')), 'C') ||
    setweight(to_tsvector('simple', to_char(s1.date, 'HH12:MI')), 'D')
FROM servings s2;



