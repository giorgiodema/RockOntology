from gevent.pywsgi import WSGIServer
from server import app
import os

port = int(os.environ.get("PORT", 1234))

http_server = WSGIServer(('0.0.0.0', port),application=app)
http_server.serve_forever()