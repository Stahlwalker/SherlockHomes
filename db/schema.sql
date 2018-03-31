DROP DATABASE IF EXISTS home_db;
CREATE database home_db;

USE home_db;

CREATE TABLE realtor_list (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(100),
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    password VARCHAR(100) NULL,
    company VARCHAR(100) NULL,
    access_type VARCHAR(100) DEFAULT "user",
    date TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE blogs (
  id Int( 11 ) AUTO_INCREMENT NOT NULL,
  title_header VARCHAR(255) NOT NULL,
  title_descrip VARCHAR( 255) NOT NULL,
  created_at VARCHAR(100) NOT NULL,
  blog_content VARCHAR(1000 ) NOT NULL,
  ts TIMESTAMP,

  PRIMARY KEY ( id )
);

 CREATE TABLE mailing_list (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(100),
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    date TIMESTAMP,
    PRIMARY KEY (id)
);

select * from realtor_list;
select * from blogs;
select * from mailing_list;
