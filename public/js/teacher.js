document.getElementById('appointment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const appointmentDate = document.getElementById('appointment-date').value;

    const response = await fetch('/teacher/schedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentDate })
    });

    if (response.ok) {
        alert('Appointment scheduled');
        loadAppointments();
    } else {
        alert('Error scheduling appointment');
    }
});

async function loadAppointments() {
    const response = await fetch('/teacher/get-appointments');
    const appointments = await response.json();
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = appointments.map(appointment => `
        <div>
            <span>Appointment with ${appointment.student_name} on ${new Date(appointment.appointment_date)}</span>
            <button onclick="approveAppointment(${appointment.appointment_id})">Approve</button>
            <button onclick="cancelAppointment(${appointment.appointment_id})">Cancel</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    loadAppointments();
});
