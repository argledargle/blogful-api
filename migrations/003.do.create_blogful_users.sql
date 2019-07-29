CREATE TABLE blogful_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  fullname TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  nickname TEXT,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);