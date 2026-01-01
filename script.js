let isAdmin = false;
const ADMIN_PASSWORD = "shanzid1010"; 

document.addEventListener('DOMContentLoaded', displayData);

function toggleAdmin() {
    const pass = prompt("Enter Admin Password to Edit:");
    if (pass === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('adminBtn').innerText = "Admin Active";
        document.getElementById('adminBtn').style.background = "#16a34a";
        displayData();
    } else {
        alert("Incorrect Password!");
    }
}

function addData() {
    const name = document.getElementById('name').value.trim();
    const session = document.getElementById('session').value.trim();
    const score = parseInt(document.getElementById('score').value);

    if (!name || !session || isNaN(score)) {
        alert("Sob gulo ghore thikmoto data din!");
        return;
    }

    let students = JSON.parse(localStorage.getItem('scoreboardData')) || [];
    let studentIndex = students.findIndex(s => s.name.toLowerCase() === name.toLowerCase());

    if (studentIndex > -1) {
        // Jodi session agey na thake tobei add korbe
        if(!students[studentIndex].sessions.includes(session)) {
            students[studentIndex].sessions.push(session);
        }
        students[studentIndex].totalScore += score;
    } else {
        students.push({
            name: name,
            sessions: [session],
            totalScore: score
        });
    }

    localStorage.setItem('scoreboardData', JSON.stringify(students));
    displayData();
    
    document.getElementById('name').value = '';
    document.getElementById('session').value = '';
    document.getElementById('score').value = '';
}

function displayData() {
    const students = JSON.parse(localStorage.getItem('scoreboardData')) || [];
    const tbody = document.getElementById('scoreBody');
    const theadAction = document.getElementById('actionHeader');
    
    tbody.innerHTML = '';
    if (isAdmin) theadAction.style.display = 'table-cell';

    // Sort by Total Score (Highest to Lowest)
    students.sort((a, b) => b.totalScore - a.totalScore);

    students.forEach((student, index) => {
        let rankDisplay = index + 1;
        let rowClass = "";

        if (index === 0) { rankDisplay = "🥇"; rowClass = "top-3"; }
        else if (index === 1) { rankDisplay = "🥈"; rowClass = "top-3"; }
        else if (index === 2) { rankDisplay = "🥉"; rowClass = "top-3"; }

        const row = `
            <tr class="${rowClass}">
                <td class="rank-icon"><strong>${rankDisplay}</strong></td>
                <td><strong>${student.name}</strong></td>
                <td>${student.sessions.join(', ')}</td>
                <td><strong>${student.totalScore}</strong></td>
                ${isAdmin ? `
                    <td>
                        <button class="edit-btn" onclick="editData(${index})">Edit</button>
                        <button class="del-btn" onclick="deleteEntry(${index})">Delete</button>
                    </td>
                ` : ""}
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// UPDATE: Session shoho edit kora
function editData(index) {
    let students = JSON.parse(localStorage.getItem('scoreboardData'));
    const student = students[index];

    // Name Edit
    const newName = prompt("Edit Student Name:", student.name);
    if (newName === null) return;

    // Session Edit (Comma separated)
    const newSessions = prompt("Edit Sessions (Comma diye likhun, ex: 1, 2, 5):", student.sessions.join(', '));
    if (newSessions === null) return;

    // Total Score Edit
    const newTotalScore = prompt("Edit Total Score:", student.totalScore);
    if (newTotalScore === null) return;

    // Data Update
    students[index].name = newName.trim();
    // String ke array te convert kora hobe
    students[index].sessions = newSessions.split(',').map(s => s.trim()).filter(s => s !== "");
    students[index].totalScore = parseInt(newTotalScore) || 0;
    
    localStorage.setItem('scoreboardData', JSON.stringify(students));
    displayData();
    alert("Data updated successfully!");
}

function deleteEntry(index) {
    if(confirm("Are you sure?")) {
        let students = JSON.parse(localStorage.getItem('scoreboardData'));
        students.splice(index, 1);
        localStorage.setItem('scoreboardData', JSON.stringify(students));
        displayData();
    }

}
