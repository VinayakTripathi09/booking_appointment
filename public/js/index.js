function redirectTo(role) {
    switch(role) {
        case 'admin':
            window.location.href = 'admin.html';
            break;
        case 'teacher':
            window.location.href = 'teacher.html';
            break;
        case 'student':
            window.location.href = 'student.html';
            break;
        default:
            alert("Invalid role selected");
    }
}
