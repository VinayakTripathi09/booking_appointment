CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE teachers (
    teacher_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    department VARCHAR(50),
    subject VARCHAR(50),
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    registration_approved BOOLEAN DEFAULT FALSE
);

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(teacher_id),
    student_id INTEGER REFERENCES students(student_id),
    appointment_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending'
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(teacher_id),
    student_id INTEGER REFERENCES students(student_id),
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
