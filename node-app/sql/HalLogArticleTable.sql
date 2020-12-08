CREATE TABLE articles (
  id int NOT NULL AUTO_INCREMENT,
  source_id int NOT NULL,
  url varchar(255) NOT NULL,
  message longtext,
  status_id int NOT NULL,
  date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;