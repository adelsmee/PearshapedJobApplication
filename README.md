
This is my attempt at parsing the Lonely Planet XML into a series of web pages. LonelyPlanetCodingExercise is a command-line application that runs in Node.js flurg blop missen dupa

====================================================================
RUN
--------

The Application
--------
Open your Terminal screen, cd to the root directory of the application and then:

node bin/lonely-planet.js taxonomyfile destinationfile outputdirectory

** All paths should be relative to the root directory of the application.

E.g.

node bin/lonely-planet.js data/taxonomy.xml data/destinations.xml output/

The html parsing takes somewhere around five minutes for 10,000 records on my old laptop so be patient.

The Tests
--------
Open your Terminal screen, cd to the root directory of the application and then:

jasmine-node --color --verbose spec

====================================================================
PERFORMANCE
---------
Configuration file: /src/config.js

To tweak performance you can change the config.performance.numberOfConcurrentFileOperations
setting.  The default is 222 which is all my laptop can handle, but faster processors should be able to deal with larger numbers.

====================================================================
INSTALL
---------

Install Node.js using the package manager that fits you:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

Install jasmine-node so you can run the tests: https://github.com/mhevery/jasmine-node#readme

Unzip the application folder to the destination of your choice and run...

====================================================================
ENJOY!
---------
