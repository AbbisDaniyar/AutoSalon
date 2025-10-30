CREATE DATABASE IF NOT EXISTS AutoSalon;
USE AutoSalon;

CREATE TABLE brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) UNIQUE NOT NULL,
    country VARCHAR(50)
);

CREATE TABLE models (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id_ref INT,
    model_name VARCHAR(100) NOT NULL,
    car_type ENUM('sedan', 'suv', 'hatchback'),
    FOREIGN KEY (brand_id_ref) REFERENCES brands(brand_id)
);

CREATE TABLE cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    model_id_ref INT,
    vin VARCHAR(17) UNIQUE,
    color VARCHAR(30),
    engine ENUM('petrol', 'diesel', 'electric'),
    transmission ENUM('manual', 'automatic'),
    price DECIMAL(10,2),
    status ENUM('available', 'reserved', 'sold'),
    FOREIGN KEY (model_id_ref) REFERENCES models(model_id)
);

CREATE TABLE clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100)
);

CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    position VARCHAR(100)
);

CREATE TABLE sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id_ref INT UNIQUE,
    client_id_ref INT,
    employee_id_ref INT,
    sale_date DATE,
    sale_price DECIMAL(10,2),
    payment_type ENUM('cash', 'card', 'credit'),
    FOREIGN KEY (car_id_ref) REFERENCES cars(car_id),
    FOREIGN KEY (client_id_ref) REFERENCES clients(client_id),
    FOREIGN KEY (employee_id_ref) REFERENCES employees(employee_id)
);

INSERT INTO brands (brand_name, country) VALUES
('Toyota', 'Япония'),
('BMW', 'Германия'),
('Mercedes', 'Германия'),
('Hyundai', 'Корея');

INSERT INTO models (brand_id_ref, model_name, car_type) VALUES
(1, 'Camry', 'sedan'),
(1, 'RAV4', 'suv'),
(2, 'X5', 'suv'),
(2, '3 Series', 'sedan'),
(3, 'E-Class', 'sedan');

INSERT INTO cars (model_id_ref, vin, color, engine, transmission, price, status) VALUES
(1, 'JTDKBRFU91234567', 'Белый', 'petrol', 'automatic', 2500000, 'available'),
(2, 'JTMWPBRFX1234568', 'Серый', 'petrol', 'automatic', 2800000, 'available'),
(3, 'WBAFR1C531234569', 'Черный', 'diesel', 'automatic', 5500000, 'available');

INSERT INTO clients (full_name, phone, email) VALUES
('Петров Иван Сергеевич', '+79161234567', 'ivan@mail.ru'),
('Сидорова Мария Владимировна', '+79161234568', 'maria@mail.ru');

INSERT INTO employees (full_name, position) VALUES
('Иванов Сергей Николаевич', 'Менеджер по продажам'),
('Смирнова Ольга Дмитриевна', 'Старший менеджер');