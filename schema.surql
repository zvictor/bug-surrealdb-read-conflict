DEFINE ANALYZER OVERWRITE simple_text TOKENIZERS blank,punct FILTERS ascii,lowercase;

DEFINE TABLE OVERWRITE book SCHEMAFULL;

DEFINE FIELD OVERWRITE title ON TABLE book TYPE string;
DEFINE FIELD OVERWRITE description ON TABLE book TYPE option<string>;

DEFINE INDEX OVERWRITE title_search ON book FIELDS title SEARCH ANALYZER simple_text BM25 HIGHLIGHTS;
DEFINE INDEX OVERWRITE description_search ON book FIELDS description SEARCH ANALYZER simple_text BM25 HIGHLIGHTS;
