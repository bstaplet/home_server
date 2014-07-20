CREATE SCHEMA IF NOT EXISTS home_server;

USE home_server;

CREATE TABLE IF NOT EXISTS USERS (
	id           INT          NOT NULL AUTO_INCREMENT,
	first_name   VARCHAR(255) NOT NULL,
	last_name    VARCHAR(255) NOT NULL,
	uname        VARCHAR(255) NOT NULL,
	hashed_pword CHAR(64)     NOT NULL,
	salt         CHAR(64)     NOT NULL,
	email        VARCHAR(255) NULL DEFAULT NULL,
	PRIMARY KEY (id),
	UNIQUE  KEY uname (uname),
	UNIQUE  KEY email (email),
	        KEY first_name (first_name),
	        KEY last_name (last_name)
) ENGINE=INNODB ROW_FORMAT=COMPRESSED DEFAULT CHARACTER SET utf8;

INSERT INTO USERS (first_name, last_name, uname, hashed_pword, salt, email)
VALUES ('admin_first', 'admin_last', 'admin', '', '', 'admin@hausawausa.com');

-- SELECT * FROM USERS;
