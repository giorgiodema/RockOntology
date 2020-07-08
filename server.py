from flask import Flask
from flask import url_for
from jinja2 import Template
import os

app = Flask(__name__)

@app.route('/index')
def getIndex():
    with open(os.path.join("templates","app.html")) as f:
        t = Template(f.read())
    return t.render(
        javascript=url_for('static',filename="app.js"),
        stylesheet=url_for('static',filename="style.css"))

@app.route('/query/info')
def answerQuery():
    pass