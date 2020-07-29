# RockOntology
RockOntology is a website that shows a visual representation of the rock taxonomy. All the informations are retrieved online with sparql queries over www.dbpedia.org.

## web server
The web server ```server.py``` is both a static web server that provides the main page of the application and a REST endpoint.

## rest endpoint
The rest endpoint exposes the following interface:
- <b>GET  /query/genre/info?genre=<i>genre_name</i></b> returns the informations about the genre <i>genre_name</i>
```json
{
  "data":{
    "origin":"year of origin",
    "info":"textual description"
  }
}
```
- <b> GET /query/artist/info?artist=<i>artist_name</i></b> returns informations about the artist <i>artist_name</i>
```json
{
  "data":{
    "abstract": "textual description of artist_name"
  }
}
```
- <b> GET /query/genre/artists?genre=<i>genre_name</i></b> returns all the artists involved in genre <i> genre_name </i>
```json
{
  "data":[
    "artist1",
    "artist2",
    "..."
  ]
}
```
- <b> GET /query/genre/groups?genre=<i>genre_name</i></b> returns all the groups involved in genre <i>genre_name</i>
```json
{
  "data":[
    "group1",
    "group2",
    "..."
  ]
}
```
- <b> GET /query/genre/subgenres?genre=<i>genre_name</i></b> returns all the subgenres of the genre <i>genre_name</i>
```json
{
  "data":[
    "subgenre1",
    "subgenre2",
    "..."
  ]
}
```
- <b> GET /query/genre/fusiongenres?genre=<i>genre_name</i></b> returns all the fusiongenres of the genre <i>genre_name</i>
```json
{
  "data":[
    "fusiongenre1",
    "fusiongenre2",
    "..."
  ]
}
```

In the folder <i>/queries</i> there are templates of SPARQL queries. Each template is mapped to a request. When the web server receives a request it loads and compiles the related template and executes the SPARQL query using Apache Jena SPARQL engine. The result is collected in JSON format and it is forwarded to the client.
