This is my attempt at parsing the Lonely Planet XML into a series of web pages. I've used JavaScript running on 
Node.js for the server-side processing.

Run the application in Node.js through bin/lonely-planet.js followed by the relative location of the taxonomy file, the destinations file and the output folder where you would like your site to be created.

E.g.

node bin/lonely-planet.js data/taxonomy.xml data/destinations.xml output/