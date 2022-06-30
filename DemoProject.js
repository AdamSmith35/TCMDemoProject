
// ------------------------------------------------
// testing getting snmp oids
// ------------------------------------------------

var snmp = require("net-snmp");
//var mibOps = new MibOperations();

var session = snmp.createSession ("127.0.0.1", "Youser");
session.version = snmp.Version2c;

var upTime;
var date;

var oids = 
["1.3.6.1.2.1.25.1.1.0", // System Up Time in String (computer? uptime)
"1.3.6.1.2.1.1.3.0", // System Up Time in TimeTicks (instance uptime)
"1.3.6.1.2.1.25.1.2.0"]; // System Date in Hex

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }
    //var date = mibOps.toString(varbinds[2]);
    //console.log (date)
    upTime = varbinds[0].value;

    var dateBuffer = Buffer.from(varbinds[2].value);
    date = new Date(
        dateBuffer.readUInt16BE(0),
        dateBuffer.readUInt8(2),
        dateBuffer.readUInt8(3),
        dateBuffer.readUInt8(4),
        dateBuffer.readUInt8(5),
        dateBuffer.readUInt8(6));

    session.close ();
});

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error)
        console.error (error);
}); 




/*
// ------------------------------------------------
// some mongodb direct from nodejs on local DB
// ------------------------------------------------

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    console.log("Database created!"); //not actually yet created until populated w/ content
    
    var dbo = db.db("mydb");

    //create the collection
    dbo.createCollection("customers", function(err, res) {
        if (err) throw err;
        console.log("Collection created!"); //not actually yet created until populated w/content
        db.close();
    });

    //insert document into collection
    var myobj = { name: "Campany Inc", address: "Highway 37" };// may use the manually set ids later but for now I don't yet see a point

    dbo.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted"); //NOW it is created with some data to store
        db.close();
    }); 
});
*/


// ------------------------------------------------
// print to http test thing 
// ------------------------------------------------

var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(date.toString() + '\n' + '       uptime: ' + upTime.toString() + "\nit is right now man");
  console.log("you should be seeing:\n" + date.toString() + '\n' + '       uptime: ' + upTime.toString() + "\nit is right now man");
  res.end();
}).listen(8080);








/*
// ------------------------------------------------
// mongodb testing through nodejs connecting to an atlas hosted cluster
// ------------------------------------------------
// I have just discovered that the tutorial I was following which hinged
// on having the database hosted and accessed through an atlas cluster
// failed to mention that atlas clusters only work on AWS, GCP or Azure
// and none of that is offered in ontario, so that's a thing.

// I was partway through creating functions for each of the CRUD operations but 
// that's probably unnecessary


const {MongoClient} = require('mongodb');


async function pushDocument(client, newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);
}// not going to create the function for pushing an array just yet as I'll first just need to give it single documents


async function findDocument(client, nameListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameListing})

    if(result) {
        console.log(`Found result '${nameListing}'`);
        console.log(result);
    } else {
        console.log(`Did not find '${nameListing}'`);
    }
}// while the tutorial showed how to specify queries and perform multiple complex searched, I won't be needing to for now.


async function updateDocument(client, nameListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("ListingsAndReviews").updateOne({ name:
    nameListing}, { $set:updatedListing});

    console.log(`${result.matchedCount} document(s) matched search criteria`);
    console.log(`${result.modifiedCount} document(s) updated`);
}


async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}




async function main() {

    const uri = ATLASURI;// replace with actual provided cluster address

    const client = new MongoClient(uri);

    try {
        await client.connect();
        await pushDocument(client, {
            name: "Lovely Loft",
            summary: "Charming loft in paris",
            bedrooms: 1,
            bathrooms: 1
        })
        await listDatabases(client);
        await findDocument(client, "Lovely Loft")
        await updateDocument(client, "Lovely Loft", {name: "Expensive as Hellll"});
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


main().catch(console.error);

*/


