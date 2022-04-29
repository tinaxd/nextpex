create table if not exists Player(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	display_name VARCHAR(64) UNIQUE NOT NULL
);