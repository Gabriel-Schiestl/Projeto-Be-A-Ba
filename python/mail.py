from flask import Flask, request, jsonify, send_file
from flask_mail import Mail, Message
import random
import os
from dotenv import load_dotenv
from flask_cors import CORS
import matplotlib.pyplot as plt
import io

load_dotenv()

def generate_code():
    random_number = random.randint(100000, 999999)
    return random_number

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp-mail.outlook.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv('HOTMAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('HOTMAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('HOTMAIL_USERNAME')

mail = Mail(app)

@app.route('/send-recovery-email', methods=['POST'])
def send_email():
    data = request.get_json()
    email = data['email']
    code = generate_code()

    msg = Message('Código para recuperação de senha', sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[email])
    msg.body = f'Seu código para recuperação de senha é: {code}'
    mail.send(msg)

    return jsonify({"code": code}), 200

@app.route('/graph', methods=['POST'])
def send_graph():
    data = request.get_json()
    columns = ['Perfis', 'Usuários', 'Módulos', 'Transações', 'Funções']
    sizes = [data['profiles'], data['users'], data['modules'], data['transactions'], data['functions']]

    plt.figure(figsize=(8, 8))
    plt.pie(sizes, labels=columns, autopct='%1.1f%%', startangle=140)
    plt.axis('equal')

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png'), 200


if __name__ == '__main__':
    app.run(port=5000)