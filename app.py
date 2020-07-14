from gevent.pywsgi import WSGIServer
from server import app

http_server = WSGIServer(('', 80),application=app)
http_server.serve_forever()