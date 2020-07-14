from gevent.pywsgi import WSGIServer
from server import app

http_server = WSGIServer(('0.0.0.0', 1234),application=app)
http_server.serve_forever()