const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'student_teacher_appointment_booking_system',
    password: '123456',
    port: 5432
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));

app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length > 0) {
        const admin = result.rows[0];
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
            req.session.userId = admin.admin_id;
            req.session.role = 'admin';
            return res.json({ success: true });
        }
    }
    res.json({ success: false });
});


app.post('/admin/add-teacher', async (req, res) => {
    const { name, department, subject, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query(
            'INSERT INTO teachers (name, department, subject, email, password) VALUES ($1, $2, $3, $4, $5)',
            [name, department, subject, email, hashedPassword]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding teacher:', error);
        res.json({ success: false });
    }
});


app.get('/admin/get-teachers', async (req, res) => {
    const result = await pool.query('SELECT * FROM teachers');
    res.json(result.rows);
});


app.delete('/admin/delete-teacher/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM teachers WHERE teacher_id = $1', [id]);
    res.json({ success: true });
});


app.patch('/admin/approve-student/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('UPDATE students SET registration_approved = true WHERE student_id = $1', [id]);
    res.json({ success: true });
});


app.post('/teacher/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM teachers WHERE email = $1', [email]);
    if (result.rows.length > 0) {
        const teacher = result.rows[0];
        const match = await bcrypt.compare(password, teacher.password);
        if (match) {
            req.session.userId = teacher.teacher_id;
            req.session.role = 'teacher';
            return res.json({ success: true });
        }
    }
    res.json({ success: false });
});

app.post('/teacher/schedule-appointment', async (req, res) => {
    if (req.session.role === 'teacher') {
        const { appointmentDate } = req.body;
        await pool.query(
            'INSERT INTO appointments (teacher_id, appointment_date, status) VALUES ($1, $2, $3)',
            [req.session.userId, appointmentDate, 'Scheduled']
        );
        res.json({ success: true });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

app.post('/student/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query(
            'INSERT INTO students (name, email, password, registration_approved) VALUES ($1, $2, $3, $4)',
            [name, email, hashedPassword, false]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error registering student:', error);
        res.json({ success: false });
    }
});

app.post('/student/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM students WHERE email = $1', [email]);
    if (result.rows.length > 0) {
        const student = result.rows[0];
        const match = await bcrypt.compare(password, student.password);
        if (match && student.registration_approved) {
            req.session.userId = student.student_id;
            req.session.role = 'student';
            return res.json({ success: true });
        }
    }
    res.json({ success: false });
});

app.get('/student/search-teachers', async (req, res) => {
    const { q } = req.query;
    const result = await pool.query(
        'SELECT * FROM teachers WHERE name ILIKE $1 OR department ILIKE $1 OR subject ILIKE $1',
        [`%${q}%`]
    );
    res.json(result.rows);
});

app.post('/student/book-appointment', async (req, res) => {
    if (req.session.role === 'student') {
        const { appointmentDate, message } = req.body;
        await pool.query(
            'INSERT INTO appointments (student_id, teacher_id, appointment_date, status) VALUES ($1, $2, $3, $4)',
            [req.session.userId, req.body.teacherId, appointmentDate, 'Pending']
        );
        await pool.query(
            'INSERT INTO messages (student_id, teacher_id, content) VALUES ($1, $2, $3)',
            [req.session.userId, req.body.teacherId, message]
        );
        res.json({ success: true });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
