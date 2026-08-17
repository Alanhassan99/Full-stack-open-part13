CREATE TABLE blogs( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);
insert into blogs (author, url, title, likes) values ('Kevin', 'google.com', 'TheBLOG', 90);
insert into blogs(author, url, title, likes) values ('Sam', 'Yahoo.com', 'Thesecondblog', 100);
