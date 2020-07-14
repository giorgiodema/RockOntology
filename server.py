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

if os.name=="nt":
    CMD = "run.bat"
if os.name=="posix":
    CMD = "run.sh"

class Query:
    GENRE_ABSTRACT = "genre_abstract.rq"
    GENRE_ORIGIN = "genre_origin.rq"
    ARTIST_ABSTRACT = "artist_abstract.rq"
    ARTISTS = "artists.rq"
    GROUPS = "groups.rq"
    SUBGENRES ="subgenres.rq"
    FUSIONGENRES="fusiongenres.rq"

def generate_uid():
    uid = request.remote_addr + request.user_agent.string
    uid = hashlib.md5(uid.encode()).hexdigest()
    return uid

def compile_query(uid,qid,**kwargs):
    if not os.path.exists("tmp"):
        os.mkdir("tmp")
    out_path = os.path.join("tmp",uid)
    with open(os.path.join("queries",qid),"r") as f:
        t = Template(f.read())
        with open(out_path,"w") as f:
            t = t.render(kwargs)
            f.write(t)

def run_query(uid):
    args = None
    if os.name=="nt":
        args = [os.path.join("commands",CMD),"./tmp/"+uid,"json"]
    else:
        args = ["bash",os.path.join("commands",CMD),"./tmp/"+uid,"json"]
    with Popen(args, stdout=PIPE) as proc:
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

# Renders the html page with the attached script
@app.route('/')
def getIndex():
    with open(os.path.join("templates","app.html")) as f:
        t = Template(f.read())
    return t.render(
        javascript=url_for('static',filename="app.js"),
        stylesheet=url_for('static',filename="style.css"))


# Gets informations about a music genre.
#   Parameters:
#       -> genre: the name of the music genre
#   Result:
#       -> abstract: textual description of the genre
#       -> origin: year in which the genre appears
@app.route('/query/genre/info',methods=["GET"])
def getGenreInfo():

    result = {"data":{}}
    if not check_args("genre"):
        return json.dumps({"error":"invalid arguments"})


    args = get_args("genre")
    uid = generate_uid()

    # get abstract
    compile_query(uid,Query.GENRE_ABSTRACT,**args)
    res = run_query(uid)
    if res:
        for r in res:
            if r['info']['xml:lang']=='en':
                result["data"]["abstract"] = r['info']['value']
    
    # get origin
    compile_query(uid,Query.GENRE_ORIGIN,**args)
    res = run_query(uid)
    if res and len(res)>0:
        m1 = re.match(r".*([0-9]{4}).*",res[0]["origin"]["value"])
        if m1 and m1.groups() and len(m1.groups())>0:
            result["data"]["origin"] = m1.groups()[0]
        else:
            m2 = re.match(r".*([0-9]{2}).*",res[0]["origin"]["value"])
            if m2 and m2.groups() and len(m2.groups())>0:
                result["data"]["origin"] = "19"+m2.groups()[0]
            else:
                result["data"]["origin"] = ""


    return json.dumps(result)

# Gets informations about an artist-
#   Parameters:
#       -> artist: the name of the artist
#   Result:
#       -> abstract: textual description of the artist 
@app.route('/query/artist/info',methods=["GET"])
def getArtistInfo():

    result = {"data":{}}
    if not check_args("artist"):
        return json.dumps({"error":"invalid arguments"})


    args = get_args("artist")
    uid = generate_uid()

    # get abstract
    compile_query(uid,Query.ARTIST_ABSTRACT,**args)
    res = run_query(uid)
    if res:
        for r in res:
            if r['info']['xml:lang']=='en':
                result["data"]["abstract"] = r['info']['value']

    return json.dumps(result)

# Gets the name of all the artists (Persons) involved in the
# specified music genre.
#   Parameters:
#       -> genre: the name of the music genre
#   Result:
#       -> []: a list with the name of the artists
@app.route('/query/genre/artists',methods=['GET'])
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

# Gets the name of all the groups involved in the
# specified music genre.
#   Parameters:
#       -> genre: the name of the music genre
#   Result:
#       -> []: a list with the name of the groups
@app.route('/query/genre/groups',methods=["GET"])
def getGroups():

    result = {"data":[]}
    if not check_args("genre"):
        return json.dumps({"error":"invalid arguments"})

    args = get_args("genre")
    uid = generate_uid()

    # get groups
    compile_query(uid,Query.GROUPS,**args)
    res = run_query(uid)
    for r in res:
        a = r["group"]["value"]
        match = re.match(r"http://dbpedia.org/resource/(.*)",a)
        if match and  len(match.groups())==1:
            result["data"].append(match.groups(1)[0])
    return result


# Gets the name of all the subgenres of the
# specified genre
#   Parameters:
#       -> genre: the name of the music genre
#   Result:
#       -> []: a list of the subgenres
@app.route('/query/genre/subgenres',methods=["GET"])
def getSubGenres():
    result = {"data":[]}
    if not check_args("genre"):
        return json.dumps({"error":"invalid arguments"})

    args = get_args("genre")
    uid = generate_uid()

    # get subgenres
    compile_query(uid,Query.SUBGENRES,**args)
    res = run_query(uid)
    for r in res:
        a = r["subgenre"]["value"]
        match = re.match(r"http://dbpedia.org/resource/(.*)",a)
        if match and  len(match.groups())==1:
            result["data"].append(match.groups(1)[0])
    return result

# Gets the name of all the fusion genres of the
# specified genre
#   Parameters:
#       -> genre: the name of the music genre
#   Result:
#       -> []: a list of the subgenfusion genresres
@app.route('/query/genre/fusiongenres',methods=["GET"])
def getFusionGenres():
    result = {"data":[]}
    if not check_args("genre"):
        return json.dumps({"error":"invalid arguments"})

    args = get_args("genre")
    uid = generate_uid()

    # get fusion genres
    compile_query(uid,Query.FUSIONGENRES,**args)
    res = run_query(uid)
    for r in res:
        a = r["fusiongenre"]["value"]
        match = re.match(r"http://dbpedia.org/resource/(.*)",a)
        if match and  len(match.groups())==1:
            result["data"].append(match.groups(1)[0])
    return result



    
