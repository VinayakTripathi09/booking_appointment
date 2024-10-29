document.getElementById('add-teacher-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('teacher-name').value;
    const department = document.getElementById('teacher-department').value;
    const subject = document.getElementById('teacher-subject').value;

    const response = await fetch('/admin/add-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, department, subject })
    });

    if (response.ok) {
        alert('Teacher added successfully');
        loadTeachers();
    } else {
        alert('Error adding teacher');
    }
});

async function loadTeachers() {
    const response = await fetch('/admin/get-teachers');
    const teachers = await response.json();
    const teacherList = document.getElementById('teacher-list');
    teacherList.innerHTML = teachers.map(teacher => `
        <div>
            <span>${teacher.name} - ${teacher.department} - ${teacher.subject}</span>
            <button onclick="deleteTeacher(${teacher.teacher_id})">Delete</button>
        </div>
    `).join('');
}

async function deleteTeacher(id) {
    const response = await fetch(`/admin/delete-teacher/${id}`, { method: 'DELETE' });
    if (response.ok) {
        alert('Teacher deleted');
        loadTeachers();
    } else {
        alert('Error deleting teacher');
    }
}

async function loadStudents() {
    const response = await fetch('/admin/get-students');
    const students = await response.json();
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = students.map(student => `
        <div>
            <span>${student.name} - ${student.email}</span>
            <button onclick="approveStudent(${student.student_id})">Approve</button>
        </div>
    `).join('');
}

async function approveStudent(id) {
    const response = await fetch(`/admin/approve-student/${id}`, { method: 'PATCH' });
    if (response.ok) {
        alert('Student approved');
        loadStudents();
    } else {
        alert('Error approving student');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTeachers();
    loadStudents();
});
