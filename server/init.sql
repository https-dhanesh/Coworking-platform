create table users(
    id serial primary key,
    username varchar(50) not null unique,
    email varchar(100) not null unique,
    password_hash varchar(255) not null,
    role varchar(20) not null default 'member',
    created_at timestamp with time zone default current_timestamp
);


CREATE TABLE spaces (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE space_amenities (
    space_id INTEGER NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
    amenity_id INTEGER NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (space_id, amenity_id)
);

INSERT INTO amenities (name) VALUES ('Wi-Fi');
INSERT INTO amenities (name) VALUES ('Free Parking');
INSERT INTO amenities (name) VALUES ('Coffee Machine');
INSERT INTO amenities (name) VALUES ('24/7 Access');