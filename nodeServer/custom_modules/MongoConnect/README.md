# MongoConnect
MongoConnect is a module that handles a connection pool for MongoDB.

Once all the .env variable are added to your .env file it is plug and play.

Git clone this module and place it where ever is convenient.

The required variables in .env are:

```
mongopass=<your_mongoDB_pass>
dbusername=<your_db_username>
dbname=<DB_you_wish_to_use>
mongoDBUrl=<See bellow>
```

Replace the information in between the angle brackets with that pertaining to
your database.  

The URL to the DB needs to be added. For Mongo Atlas it will look something like this:

mongoDBUrl=`mongodb+srv://${dbusername}:${mongopass}@server_address/${dbname}?retryWrites=true&w=majority`

*Where server_address is your cluster's URI* Your specific connection link
can be found on the Atlas web page.
