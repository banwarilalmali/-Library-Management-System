// Sample books are added when the project is opened for the first time.

// 10 Sample Students
let students = JSON.parse(localStorage.getItem("students"));

if (!students || students.length === 0) {
    students = [
        {
            id: 1,
            name: "Rahul Sharma",
            roll: "101",
            branch: "B.Tech CSE",
            semester: "3rd Semester",
            section: "A",
            mobile: "9876543210",
            email: "rahul@gmail.com"
        },
        {
            id: 2,
            name: "Priya Singh",
            roll: "102",
            branch: "B.Tech IT",
            semester: "3rd Semester",
            section: "A",
            mobile: "9876543211",
            email: "priya@gmail.com"
        },
        {
            id: 3,
            name: "Amit Kumar",
            roll: "103",
            branch: "B.Tech CSE",
            semester: "4th Semester",
            section: "B",
            mobile: "9876543212",
            email: "amit@gmail.com"
        },
        {
            id: 4,
            name: "Neha Verma",
            roll: "104",
            branch: "B.Tech ECE",
            semester: "2nd Semester",
            section: "A",
            mobile: "9876543213",
            email: "neha@gmail.com"
        },
        {
            id: 5,
            name: "Rohit Meena",
            roll: "105",
            branch: "B.Tech CSE",
            semester: "3rd Semester",
            section: "A",
            mobile: "9876543214",
            email: "rohit@gmail.com"
        },
        {
            id: 6,
            name: "Anjali Sharma",
            roll: "106",
            branch: "BCA",
            semester: "5th Semester",
            section: "B",
            mobile: "9876543215",
            email: "anjali@gmail.com"
        },
        {
            id: 7,
            name: "Vikas Yadav",
            roll: "107",
            branch: "B.Tech IT",
            semester: "6th Semester",
            section: "A",
            mobile: "9876543216",
            email: "vikas@gmail.com"
        },
        {
            id: 8,
            name: "Pooja Gupta",
            roll: "108",
            branch: "BBA",
            semester: "2nd Semester",
            section: "B",
            mobile: "9876543217",
            email: "pooja@gmail.com"
        },
        {
            id: 9,
            name: "Deepak Saini",
            roll: "109",
            branch: "B.Tech CSE",
            semester: "7th Semester",
            section: "A",
            mobile: "9876543218",
            email: "deepak@gmail.com"
        },
        {
            id: 10,
            name: "Kavita Kumari",
            roll: "110",
            branch: "B.Tech ECE",
            semester: "3rd Semester",
            section: "B",
            mobile: "9876543219",
            email: "kavita@gmail.com"
        }
    ];
}

let books = JSON.parse(localStorage.getItem("books")) || [
    { id: 1, name: "Data Structures and Algorithms in C++", author: "Adam Drozdek", category: "DSA", status: "Available", studentId: "" },
    { id: 2, name: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "DSA", status: "Available", studentId: "" },
    { id: 3, name: "Operating System Concepts", author: "Abraham Silberschatz", category: "Operating System", status: "Available", studentId: "" },
    { id: 4, name: "Database System Concepts", author: "Abraham Silberschatz", category: "DBMS", status: "Available", studentId: "" },
    { id: 5, name: "Let Us C", author: "Yashavant Kanetkar", category: "Programming", status: "Available", studentId: "" },
    { id: 6, name: "Computer Networking: A Top-Down Approach", author: "James Kurose", category: "Computer Networks", status: "Available", studentId: "" }
];

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("books", JSON.stringify(books));
}

function showPage(pageName) {
    let pages = document.querySelectorAll(".page");
    pages.forEach(function(page) {
        page.hidden = true;
    });
    document.getElementById(pageName).hidden = false;
}

// Register a new student.
document.getElementById("studentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let roll = document.getElementById("rollNumber").value.trim();
    let alreadyExists = students.some(function(student) {
        return student.roll.toLowerCase() === roll.toLowerCase();
    });

    if (alreadyExists) {
        alert("This roll number is already registered.");
        return;
    }

    let student = {
        id: students.length ? Math.max(...students.map(function(item) { return item.id; })) + 1 : 1,
        name: document.getElementById("studentName").value.trim(),
        roll: roll,
        branch: document.getElementById("branch").value,
        semester: document.getElementById("semester").value,
        section: document.getElementById("section").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    students.push(student);
    saveData();
    this.reset();
    displayStudents();
    updateDashboard();
    alert("Student registered successfully!");
    showPage("profile");
});

// Show students in the profile table.
function displayStudents() {
    let search = document.getElementById("studentSearch").value.toLowerCase();
    let list = document.getElementById("studentList");
    list.innerHTML = "";

    students.forEach(function(student) {
        if (student.name.toLowerCase().includes(search) || student.roll.toLowerCase().includes(search)) {
            list.innerHTML += `<tr>
                <td>STU${student.id}</td><td>${student.name}</td><td>${student.roll}</td>
                <td>${student.branch}</td><td>${student.semester}</td><td>${student.mobile || "-"}</td>
                <td><button class="small-button" onclick="viewStudent(${student.id})">View</button>
                <button class="small-button delete-button" onclick="deleteStudent(${student.id})">Delete</button></td>
            </tr>`;
        }
    });

    if (list.innerHTML === "") {
        list.innerHTML = '<tr><td colspan="7">No students found. Register a student first.</td></tr>';
    }
}

function viewStudent(id) {
    let student = students.find(function(item) { return item.id === id; });
    let details = document.getElementById("studentDetails");
    let issued = books.filter(function(book) { return book.studentId === id; });
    let bookText = "No books currently issued.";

    if (issued.length > 0) {
        bookText = issued.map(function(book) { return book.name; }).join(", ");
    }

    details.innerHTML = `<h3>${student.name}</h3>
        <p><b>Student ID:</b> STU${student.id}</p>
        <p><b>Roll Number:</b> ${student.roll}</p>
        <p><b>Branch:</b> ${student.branch} | <b>Semester:</b> ${student.semester}</p>
        <p><b>Section:</b> ${student.section || "-"}</p>
        <p><b>Mobile:</b> ${student.mobile || "-"}</p>
        <p><b>Email:</b> ${student.email || "-"}</p>
        <p><b>Currently Issued Books:</b> ${bookText}</p>`;
    details.hidden = false;
}

function deleteStudent(id) {
    let hasBook = books.some(function(book) { return book.studentId === id; });
    if (hasBook) {
        alert("Return this student's books before deleting the profile.");
        return;
    }
    if (confirm("Delete this student profile?")) {
        students = students.filter(function(student) { return student.id !== id; });
        saveData();
        displayStudents();
        updateDashboard();
        document.getElementById("studentDetails").hidden = true;
    }
}

// Add a new book to the list.
document.getElementById("bookForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let nextId = books.length ? Math.max(...books.map(function(book) { return book.id; })) + 1 : 1;

    books.push({
        id: nextId,
        name: document.getElementById("bookName").value.trim(),
        author: document.getElementById("bookAuthor").value.trim(),
        category: document.getElementById("bookCategory").value,
        status: "Available",
        studentId: ""
    });

    saveData();
    this.reset();
    displayBooks();
    updateDashboard();
});

function displayBooks() {
    let search = document.getElementById("bookSearch").value.toLowerCase();
    let list = document.getElementById("bookList");
    list.innerHTML = "";

    books.forEach(function(book) {
        let text = (book.name + " " + book.author + " " + book.category).toLowerCase();
        if (text.includes(search)) {
            let student = students.find(function(item) { return item.id === book.studentId; });
            let statusClass = book.status === "Issued" ? "status issued" : "status";
            let action = book.status === "Available"
                ? `<button class="small-button" onclick="issueBook(${book.id})">Issue</button>`
                : `<button class="small-button" onclick="returnBook(${book.id})">Return</button>`;

            list.innerHTML += `<tr>
                <td>BK${book.id}</td><td>${book.name}</td><td>${book.author}</td><td>${book.category}</td>
                <td class="${statusClass}">${book.status}</td><td>${student ? student.name : "-"}</td>
                <td>${action} <button class="small-button delete-button" onclick="deleteBook(${book.id})">Delete</button></td>
            </tr>`;
        }
    });

    if (list.innerHTML === "") {
        list.innerHTML = '<tr><td colspan="7">No books found.</td></tr>';
    }
}

function issueBook(id) {
    if (students.length === 0) {
        alert("Please register a student before issuing a book.");
        showPage("registration");
        return;
    }

    let options = students.map(function(student) {
        return student.id + ": " + student.name + " (" + student.roll + ")";
    }).join("\n");
    let answer = prompt("Enter the Student ID number from this list:\n" + options);
    if (answer === null || answer.trim() === "") return;

    let student = students.find(function(item) { return item.id === Number(answer); });
    if (!student) {
        alert("Student ID not found. Please try again.");
        return;
    }

    let book = books.find(function(item) { return item.id === id; });
    book.status = "Issued";
    book.studentId = student.id;
    saveData();
    displayBooks();
    displayStudents();
    updateDashboard();
}

function returnBook(id) {
    let book = books.find(function(item) { return item.id === id; });
    book.status = "Available";
    book.studentId = "";
    saveData();
    displayBooks();
    displayStudents();
    updateDashboard();
}

function deleteBook(id) {
    let book = books.find(function(item) { return item.id === id; });
    if (book.status === "Issued") {
        alert("Please return this book before deleting it.");
        return;
    }
    if (confirm("Delete this book from the list?")) {
        books = books.filter(function(item) { return item.id !== id; });
        saveData();
        displayBooks();
        updateDashboard();
    }
}

function updateDashboard() {
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("totalBooks").textContent = books.length;
    document.getElementById("availableBooks").textContent = books.filter(function(book) {
        return book.status === "Available";
    }).length;
    document.getElementById("issuedBooks").textContent = books.filter(function(book) {
        return book.status === "Issued";
    }).length;
}

// Display the sample books and dashboard totals when the page opens.
saveData();
displayStudents();
displayBooks();
updateDashboard();
