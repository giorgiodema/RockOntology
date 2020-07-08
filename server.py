from flask import Flask
from flask import url_for
from flask import request
from jinja2 import Template
import os
import json
from subprocess import Popen,PIPE
import hashlib
import re

app = Flask(__name__)

class Query:
    ABSTRACT = "abstract.rq"
    ORIGIN = "origin.rq"
    ARTISTS = "artists.rq"

def generate_uid():
    uid = request.remote_addr + request.user_agent.string
    uid = hashlib.md5(uid.encode()).hexdigest()
    return uid

def compile_query(uid,qid,**kwargs):
    out_path = os.path.join("tmp",uid)
    with open(os.path.join("queries",qid),"r") as f:
        t = Template(f.read())
        with open(out_path,"w") as f:
            t = t.render(kwargs)
            f.write(t)

def run_query(uid):
    with Popen([os.path.join("commands","run.bat"),"./tmp/"+uid,"json"], stdout=PIPE) as proc:
        res = proc.stdout.read()
        os.remove(os.path.join("tmp",uid))
        if res==b'':
            return None
        else:
            return json.loads(res)["results"]["bindings"]

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


@app.route('/query/artists',methods=['GET'])
def getArtists():

    result = {"data":[]}
    if not check_args("genre"):
        return json.dumps({"error":"invalid arguments"})

    args = get_args("genre")
    uid = generate_uid()

    # get artists
    compile_query(uid,Query.ARTISTS,**args)
    res = run_query(uid)
    for r in res:
        a = r["artist"]["value"]
        match = re.match(r"http://dbpedia.org/resource/(.*)",a)
        if match and  len(match.groups())==1:
            result["data"].append(match.groups(1)[0])
    return result


@app.route('/query/info',methods=["GET"])
def getInfo():

    result = {"data":{}}
    if not check_args("genre"):
        return json.dumps({"error":"invalid arguments"})


    args = get_args("genre")
    uid = generate_uid()

    # get abstract
    compile_query(uid,Query.ABSTRACT,**args)
    res = run_query(uid)
    if res:
        for r in res:
            if r['info']['xml:lang']=='en':
                result["data"]["abstract"] = r['info']['value']
    
    # get origin
    compile_query(uid,Query.ORIGIN,**args)
    res = run_query(uid)
    if res and len(res)>0:
        result["data"]["origin"] = int(float(res[0]["origin"]["value"]))

    return json.dumps(result)


    
