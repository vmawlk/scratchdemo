# scratchdemo

quick and dirty from scratch to demonstrate connector access

## Installation
Please unzip the demo documents from ./testdata/health/doc.zip to ./test/health/doc
npm install

## Demo

### postit 
````bash
node postit
````

posts 200 documents with metadata to the connector and writes testids.ndjson file with the created document ids and content lengths.

### deleteit
````bash
node deleteit 
````

removes all created documents.



