This app is not production ready, it is missing things such as setting headers and session control. 

# Style: 
I have written in semi-standard and using double spacing (standard with semi-colons). I haven't altered the formatting of the original code. 

I use "cammelCase" for variable names. 

## Node server 
The node server here is to save any data from the front end in a database (not working currently), the API end points will be in: 

MapStructor/nodeServer/router.js

Node uses environmental variables for config, these are added to a 
.dot (dot env) file, these include things like database access, API
keys and so on. 

Node also run build tools in development. 

## MongoDB
The app is currently configured to use MongoDB. You will have to set up
a DB for your project, this is very easy using Mongot Atlas. 

Config is as simple as adding a .env file with a user, password, DB name and connection URL. 
You can use the example given for testing. Note that .env and config files should not *usually* 
be commited to a Git repo. 

# Build tools used: 
## Grunt -task runner: 
Concatenates code. Can later be used to minify and "babelify" the code (compile more modern code into legacy code to support older browsers).

To run Grunt, move to the /nodeServer folder and start it via command line: 

`grunt watch`

This will watch for changes in the following foders: 
'../main/current/processing/timeline/js/*.js',
'../main/current/processing/timeline/css/*.css',
'../main/current/processing/timeline/css/*.scss'

Grunt will the produce your css and js files in ./frontend/production (master.css and master.js)

Note that (on my system Ubuntu 20.04.5 LTS) this only works for node version <14 and not the
latest versions. 

This is only need in development. 