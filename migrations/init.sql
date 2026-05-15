CREATE TABLE institution (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    `forwardEmail` TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE forward (
    id INT NOT NULL AUTO_INCREMENT,
    data TEXT NOT NULL,
    `institutionId` INT NOT NULL,
    to TEXT NOT NULL,
    PRIMARY KEY (id)
);