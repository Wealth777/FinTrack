University Of Ilesa Student finacial Tracker
FinTrack is a financial tracking application designed for students who want to record income, expenses, and budgets. The app provides an organized dashboard, summaries, and secure authentication to help sudents understand how much they gain or lose.

Features

User registration and login
Token based authentication
Add income, expense, and budget
View income, expense, and budget
Total income and total expense calculation
Summary of financial activity
Category based tracking
Dashboard overview
CRUD operations for all financial entries


Upcoming Features

Notifications
User profile image upload
Report issue section
Income and expense charts
Extended financial analytics

Tech Stack
Frontend: React JS
Backend: Laravel

Authentication
Users register with full name, email, and password.
Login verifies credentials and generates a token for secure access to the dashboard and protected routes.

Income Module
Users enter source, amount, date, and description.
Each entry is saved with a slug for easy viewing, editing, and deletion.

Expense Module
Works the same as the income module.
Users record amount, date, description, and expense name or source.

Dashboard
Displays total income, total expenses, remaining balance, and general overview of financial status.

API Endpoints

Authentication
POST /api/register
POST /api/login
POST /api/logout
GET /api/me

Income
GET /api/incomes
POST /api/incomes
GET /api/incomes/{slug}
PUT /api/incomes/{slug}
DELETE /api/incomes/{slug}

Expense
GET /api/expenses
POST /api/expenses
GET /api/expenses/{slug}
PUT /api/expenses/{slug}
DELETE /api/expenses/{slug}

Dashboard
GET /api/summary
GET /api/summary/categories
GET /api/dashboard

User Guide

1. Register with name, email, and password
2. Login to access the dashboard
3. Add income or expenses
4. View all records
5. Check financial summaries
6. Logout from topnav

Current Development Status
Version 1 features are complete.
The expenses page is currently being finalized.