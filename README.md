# RockOntology
Website that shows a visual representation of the rock taxonomy. All the informations are retrieved online with sparql queries over www.dbpedia.org.

## web server
The web server ```server.py``` is both a static web server that provides the main page of the application and a REST endpoint.
## rest endpoint
- <b>GET  /query/genre/info?genre=<i>genre</i></b> returns the informations about the genre received as parameter
```json
data:{
  "origin":"year of origin",
  "info":"textual description"
}
