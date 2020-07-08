from flask import Flask
from flask import url_for
from flask import request
from jinja2 import Template
import os
import json
from subprocess import Popen,PIPE
import hashlib

app = Flask(__name__)

class Query:
    ABSTRACT = "abstract.rq"

def generate_uid():
    uid = request.remote_addr + request.user_agent.string
    uid = hashlib.md5(uid.encode()).hexdigest()
    return uid

def compile_query(uid,qid,**kwargs):
    out_path = os.path.join("tmp",uid)
    with open(os.path.join("queries",Query.ABSTRACT),"r") as f:
        t = Template(f.read())
        with open(out_path,"w") as f:
            f.write(t.render(kwargs))

def run_query(uid):
    with Popen([os.path.join("commands","run.bat"),"./tmp/"+uid,"json"], stdout=PIPE) as proc:
        res = proc.stdout.read()
        os.remove(os.path.join("tmp",uid))
        if res==b'':
            return None
        else:
            return json.loads(res)

def check_args(*args):
    for a in args:
        if a not in request.args:
            return False
    return True

def get_args(*args):
    #TODO: Sanitize string before using 
    # as argument for the command
    d = {}
    for a in args:
        d[a] = request.args[a]
    return d

@app.route('/index')
def getIndex():
    with open(os.path.join("templates","app.html")) as f:
        t = Template(f.read())
    return t.render(
        javascript=url_for('static',filename="app.js"),
        stylesheet=url_for('static',filename="style.css"))



@app.route('/query/abstract',methods=["GET"])
def abstract():

    if not check_args("genre"):
        return json.dumps({"error":"invalid arguments"})


    args = get_args("genre")
    uid = generate_uid()
    compile_query(uid,Query.ABSTRACT,**args)
    res = run_query(uid)
    
    if not res:
        return json.dumps({"error":"invalid query"})
    
    res = res["results"]["bindings"]
    for r in res:
        if r['info']['xml:lang']=='en':
            return json.dumps({"data":r['info']['value']})

    return json.dumps({"error":"no result found"})


    
