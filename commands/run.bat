@echo off
if [%1] equ [] echo "usage: .\run.bat query [text|xml|json|csv|tsv]" & goto :end
if [%2] neq [] (rsparql --service http://dbpedia.org/sparql --query %1 --results %2) else rsparql --service http://dbpedia.org/sparql --query %1

:end