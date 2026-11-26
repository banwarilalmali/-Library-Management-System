#include <iostream>
#include <vector>
#include <string>
#include <limits>
#include <iomanip>
#include <algorithm>
#include <cctype>

using namespace std;

// Book class stores the details of one book.
class Book {
private:
    int id;
    string title;
    string author;
    string category;
    bool issued;
    string studentName;
    int dueDay;

public:
    Book(int bookId, string bookTitle, string bookAuthor, string bookCategory) {
        id = bookId;
        title = bookTitle;
        author = bookAuthor;
        category = bookCategory;
        issued = false;
        studentName = "";
        dueDay = 0;
    }

    int getId() const { return id; }
    string getTitle() const { return title; }
    string getAuthor() const { return author; }
    string getCategory() const { return category; }
    bool isIssued() const { return issued; }
    string getStudentName() const { return studentName; }
    int getDueDay() const { return dueDay; }

    void updateDetails(string newTitle, string newAuthor, string newCategory) {
        title = newTitle;
        author = newAuthor;
        category = newCategory;
    }

    bool issueTo(string student, int todayDay) {
        if (issued) {
            return false;
        }

        issued = true;
        studentName = student;
        dueDay = todayDay + 14;  // Books are issued for 14 days.
        return true;
    }

    // Returns the fine amount. Fine is Rs. 5 for each late day.
    double returnBook(int todayDay) {
        int lateDays = todayDay - dueDay;
        double fine = 0;

        if (lateDays > 0) {
            fine = lateDays * 5;
        }

        issued = false;
        studentName = "";
        dueDay = 0;
        return fine;
    }
};

// Library class manages all books and library operations.
class Library {
private:
    vector<Book> books;
    int nextId;
    double totalFineCollected;

    Book* findBook(int bookId) {
        for (int i = 0; i < (int)books.size(); i++) {
            if (books[i].getId() == bookId) {
                return &books[i];
            }
        }
        return NULL;
    }

    string lowerCase(string value) {
        transform(value.begin(), value.end(), value.begin(), ::tolower);
        return value;
    }

public:
    Library() {
        nextId = 1;
        totalFineCollected = 0;
    }

    void addBook() {
        string title, author, category;

        cout << "Enter book title: ";
        getline(cin, title);
        cout << "Enter author name: ";
        getline(cin, author);
        cout << "Enter category: ";
        getline(cin, category);

        books.push_back(Book(nextId, title, author, category));
        cout << "Book added successfully! Book ID: " << nextId << "\n";
        nextId++;
    }

    void updateBook() {
        int id;
        cout << "Enter Book ID to update: ";
        cin >> id;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        Book* book = findBook(id);
        if (book == NULL) {
            cout << "Book not found.\n";
            return;
        }

        if (book->isIssued()) {
            cout << "Issued book cannot be updated. Return it first.\n";
            return;
        }

        string title, author, category;
        cout << "Enter new title: ";
        getline(cin, title);
        cout << "Enter new author: ";
        getline(cin, author);
        cout << "Enter new category: ";
        getline(cin, category);

        book->updateDetails(title, author, category);
        cout << "Book details updated successfully.\n";
    }

    void deleteBook() {
        int id;
        cout << "Enter Book ID to delete: ";
        cin >> id;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        for (int i = 0; i < (int)books.size(); i++) {
            if (books[i].getId() == id) {
                if (books[i].isIssued()) {
                    cout << "Issued book cannot be deleted. Return it first.\n";
                    return;
                }
                books.erase(books.begin() + i);
                cout << "Book deleted successfully.\n";
                return;
            }
        }
        cout << "Book not found.\n";
    }

    void displayBooks() {
        if (books.empty()) {
            cout << "No books available in the library.\n";
            return;
        }

        cout << "\n-------------------- BOOK LIST --------------------\n";
        cout << left << setw(7) << "ID" << setw(30) << "Title"
             << setw(22) << "Author" << setw(16) << "Category" << "Status\n";
        cout << string(88, '-') << "\n";

        for (int i = 0; i < (int)books.size(); i++) {
            cout << left << setw(7) << books[i].getId()
                 << setw(30) << books[i].getTitle().substr(0, 28)
                 << setw(22) << books[i].getAuthor().substr(0, 20)
                 << setw(16) << books[i].getCategory().substr(0, 14)
                 << (books[i].isIssued() ? "Issued" : "Available") << "\n";
        }
    }

    void searchBook() {
        string keyword;
        cout << "Enter book title or author to search: ";
        getline(cin, keyword);
        keyword = lowerCase(keyword);

        bool found = false;
        for (int i = 0; i < (int)books.size(); i++) {
            string title = lowerCase(books[i].getTitle());
            string author = lowerCase(books[i].getAuthor());

            if (title.find(keyword) != string::npos || author.find(keyword) != string::npos) {
                cout << "\nBook ID: " << books[i].getId()
                     << "\nTitle: " << books[i].getTitle()
                     << "\nAuthor: " << books[i].getAuthor()
                     << "\nCategory: " << books[i].getCategory()
                     << "\nStatus: " << (books[i].isIssued() ? "Issued" : "Available") << "\n";
                found = true;
            }
        }

        if (!found) {
            cout << "No matching book found.\n";
        }
    }

    void issueBook() {
        int id, todayDay;
        string student;

        cout << "Enter Book ID to issue: ";
        cin >> id;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        Book* book = findBook(id);
        if (book == NULL) {
            cout << "Book not found.\n";
            return;
        }

        cout << "Enter student name: ";
        getline(cin, student);
        cout << "Enter today's day number (example: 20): ";
        cin >> todayDay;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        if (book->issueTo(student, todayDay)) {
            cout << "Book issued successfully to " << student << ".\n";
            cout << "Return book by day number: " << book->getDueDay() << "\n";
        } else {
            cout << "This book is already issued.\n";
        }
    }

    void returnBook() {
        int id, todayDay;
        cout << "Enter Book ID to return: ";
        cin >> id;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        Book* book = findBook(id);
        if (book == NULL) {
            cout << "Book not found.\n";
            return;
        }

        if (!book->isIssued()) {
            cout << "This book has not been issued.\n";
            return;
        }

        cout << "Enter today's day number: ";
        cin >> todayDay;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        double fine = book->returnBook(todayDay);
        totalFineCollected += fine;

        cout << "Book returned successfully.\n";
        cout << "Late fine: Rs. " << fixed << setprecision(2) << fine << "\n";
    }

    void generateReport() {
        int available = 0;
        int issued = 0;

        for (int i = 0; i < (int)books.size(); i++) {
            if (books[i].isIssued()) {
                issued++;
            } else {
                available++;
            }
        }

        cout << "\n=============== LIBRARY REPORT ===============\n";
        cout << "Total books       : " << books.size() << "\n";
        cout << "Available books   : " << available << "\n";
        cout << "Issued books      : " << issued << "\n";
        cout << "Fine collected    : Rs. " << fixed << setprecision(2)
             << totalFineCollected << "\n";

        if (issued > 0) {
            cout << "\nCurrently issued books:\n";
            for (int i = 0; i < (int)books.size(); i++) {
                if (books[i].isIssued()) {
                    cout << "Book ID: " << books[i].getId()
                         << " | " << books[i].getTitle()
                         << " | Student: " << books[i].getStudentName()
                         << " | Due day: " << books[i].getDueDay() << "\n";
                }
            }
        }
        cout << "==============================================\n";
    }
};

int main() {
    Library library;
    int choice;

    do {
        cout << "\n========== LIBRARY MANAGEMENT SYSTEM ==========\n";
        cout << "1. Add Book\n";
        cout << "2. Update Book\n";
        cout << "3. Delete Book\n";
        cout << "4. Display All Books\n";
        cout << "5. Search Book\n";
        cout << "6. Issue Book\n";
        cout << "7. Return Book\n";
        cout << "8. Generate Library Report\n";
        cout << "0. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        switch (choice) {
            case 1: library.addBook(); break;
            case 2: library.updateBook(); break;
            case 3: library.deleteBook(); break;
            case 4: library.displayBooks(); break;
            case 5: library.searchBook(); break;
            case 6: library.issueBook(); break;
            case 7: library.returnBook(); break;
            case 8: library.generateReport(); break;
            case 0: cout << "Thank you for using Library Management System!\n"; break;
            default: cout << "Invalid choice. Please try again.\n";
        }
    } while (choice != 0);

    return 0;
}
