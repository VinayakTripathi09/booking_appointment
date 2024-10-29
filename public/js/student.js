async function searchTeachers() {
    const query = document.getElementById('search-input').value;
    const response = await fetch(`/student/search-teachers?q=${encodeURIComponent(query)}`);
    const teachers = await response.json();
    const teacherResults = document.getElementById('teacher-results');
    teacherResults.innerHTML = teachers.map(teacher => `
        <div>
            <span>${teacher.name} - ${teacher.department} - ${teacher.subject}</span>
            <button onclick="selectTeacher(${teacher.teacher_id})">Select</button>
        </div>
    `).join('');
}

async function bookAppointment() {
    const appointmentDate = document.getElementById('appointment-date').value;
    const message = document.getElementById('message').value;

    const response = await fetch('/student/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentDate, message })
    });

    if (response.ok) {
        alert('Appointment booked');
    } else {
        alert('Error booking appointment');
    }
}
