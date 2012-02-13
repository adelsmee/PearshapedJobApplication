This is my attempt at parsing the Lonely Planet XML into a series of web pages. I've used JavaScript running on Node.js for server-side processing.

To run from the command line cd to the root directory of the application:

node bin/lonely-planet.js taxonomyfile destinationfile outputdirectory

* All paths should be relative to the root directory of the application.

E.g.

node bin/lonely-planet.js data/taxonomy.xml data/destinations.xml output/