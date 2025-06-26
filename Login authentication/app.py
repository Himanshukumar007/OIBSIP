from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

def init_db():
    with sqlite3.connect("users.db") as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        ''')
init_db()

@app.route('/')
def home():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        uname = request.form['username']
        pwd = request.form['password']
        try:
            with sqlite3.connect("users.db") as conn:
                conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (uname, pwd))
                conn.commit()
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            return "Username already exists, please choose another."
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        uname = request.form['username']
        pwd = request.form['password']
        with sqlite3.connect("users.db") as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM users WHERE username=? AND password=?", (uname, pwd))
            user = cur.fetchone()
            if user:
                session['username'] = uname
                return redirect(url_for('dashboard'))
            else:
                return "Invalid username or password."
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=session['username'])

@app.route('/messages')
def messages():
    if 'username' not in session:
        return redirect(url_for('login'))
    # Placeholder messages list
    msgs = [
        {"from": "Alice", "subject": "Meeting reminder"},
        {"from": "Bob", "subject": "Project update"},
        {"from": "Charlie", "subject": "Lunch plans"}
    ]
    return render_template('messages.html', username=session['username'], messages=msgs)

@app.route('/notifications')
def notifications():
    if 'username' not in session:
        return redirect(url_for('login'))
    notes = [
        "Your password will expire in 5 days.",
        "New login from unknown device.",
        "System maintenance scheduled for Saturday."
    ]
    return render_template('notifications.html', username=session['username'], notifications=notes)

@app.route('/tasks')
def tasks():
    if 'username' not in session:
        return redirect(url_for('login'))
    tasks_list = [
        {"task": "Finish report", "due": "2025-07-05"},
        {"task": "Email client", "due": "2025-07-02"},
        {"task": "Update website", "due": "2025-07-10"},
    ]
    return render_template('tasks.html', username=session['username'], tasks=tasks_list)

@app.route('/profile')
def profile():
    if 'username' not in session:
        return redirect(url_for('login'))
    # You can expand with real user info here later
    return render_template('profile.html', username=session['username'])

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
