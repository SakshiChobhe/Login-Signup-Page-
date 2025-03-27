from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import logging

from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This

# Enable logging for Flask
logging.basicConfig(level=logging.DEBUG)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''  # replace with your MySQL password
app.config['MYSQL_DB'] = 'myappdb'

mysql = MySQL(app)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    username = data['username']
    password = data['password']
    confirm_password = data['confirmPassword']

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match!"}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM signup WHERE username = %s", (username,))
    user = cur.fetchone()
    if user:
        return jsonify({"error": "Username already exists!"}), 400

    cur.execute("INSERT INTO signup (username, password) VALUES (%s, %s)", (username, password))
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Signup successful!"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data['username']
    password = data['password']

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM signup WHERE username = %s AND password = %s", (username, password))
    user = cur.fetchone()

    if user:
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"error": "Invalid credentials!"}), 400

if __name__ == '__main__':
    print('test')
    app.run(host="0.0.0.0",port=5005,debug=False)
