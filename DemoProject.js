
// ------------------------------------------------
// testing getting snmp oids
// ------------------------------------------------

var snmp = require("net-snmp");
//var mibOps = new MibOperations();

var upTime;
var upTimeInst;
var date;
var memAvail;
var memUsed;
var cpuUsed;
var returnTable;

class TimeObj {
    constructor(timeTicks){
        this.timeTicks = timeTicks;
    }

    get ticks(){
        return this.timeTicks;
    }

    get seconds() {
        return this.timeTicks / 100;
    }

    get minutes() {
        return this.timeTicks / 6000;
    }

    get hours() {
        return this.timeTicks / 360000;
    }

    get days() {
        return this.timeTicks / 8640000;
    }
/*
    get daysRem() {
        return this.timeTicks % 8640000;
    }

    get hoursRem() {
        return (this.timeTicks % 8640000) % 360000;
    }

    get minutesRem() {
        return ((this.timeTicks % 8640000) % 360000) % 6000;
    }

    get secondsRem() {
        return (((this.timeTicks % 8640000) % 360000) % 6000) % 100;
    }
*/

    /*
    get print() {
        return "Days: " + Math.floor(this.days()) + 
        ", Hours: " + this.daysRem()......
    }*/
}

var session = snmp.createSession ("127.0.0.1", "Youser");
session.version = snmp.Version2c;

var oids = 
["1.3.6.1.2.1.25.1.1.0", // System Up Time in String (computer? uptime)
"1.3.6.1.2.1.1.3.0", // System Up Time in TimeTicks (instance uptime)
"1.3.6.1.2.1.25.1.2.0", // System Date in Hex
"1.3.6.1.4.1.2021.4.5.0", // Total System Memory
"1.3.6.1.4.1.2021.4.6.0", // Current Memory Usage
"1.3.6.1.4.1.2021.11.9.0"]; // CPU Usage

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
    upTime = new TimeObj(varbinds[0].value);
    upTimeInst = new TimeObj(varbinds[1].value);

    var dateBuffer = Buffer.from(varbinds[2].value);
    date = new Date(
        dateBuffer.readUInt16BE(0),
        dateBuffer.readUInt8(2) - 1,
        dateBuffer.readUInt8(3),
        dateBuffer.readUInt8(4),
        dateBuffer.readUInt8(5),
        dateBuffer.readUInt8(6));

    memTotal = varbinds[3].value;
    memUsed = varbinds[4].value;
    cpuUsed = varbinds[5].value;

    session.close ();
});

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error)
        console.error (error);
}); 


// ------------------------------------------------
// some mongodb direct from nodejs on local DB
// ------------------------------------------------

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    //console.log("Database created!"); //not actually yet created until populated w/ content
    
    var dbo = db.db("mydb");

    /*
    //create the collection
    dbo.createCollection("customers", function(err, res) {
        if (err) throw err;
        console.log("Collection created!"); //not actually yet created until populated w/content
        db.close();
    });*/

    //insert document into collection
    var myobj = { serverDate: date, 
        serverUpTime: upTime, 
        serverUpTimeInstance: upTimeInst,
        serverTotalMemory: memTotal,
        serverUsedMemory: memUsed,
        serverCPUUsage: cpuUsed
    };// may use the manually set ids later but for now I don't yet see a point

    dbo.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted"); //NOW it is created with some data to store
    }); 

    //returnTable = await dbo.collection("customers").find().sort({"serverDate":-1}).limit(10).toArray();
    readDatabase(db);

    //db.close();
});


async function readDatabase(db){
    var dbo = db.db("mydb");
    returnTable = await dbo.collection("customers").find().sort({"serverDate":-1}).limit(10).toArray();
}


// ------------------------------------------------
// print to http test thing 
// ------------------------------------------------
/*
var http = require('http');

http.createServer(function (req, res) {

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(date.toString() + '\n' + '       uptime: ~' 
  + Math.floor(upTime.seconds.toString()) + " seconds, or ~" 
  + Math.floor(upTime.minutes.toString()) + " minutes, or ~" 
  + Math.floor(upTime.hours.toString()) + " hours, or ~" 
  + Math.floor(upTime.days.toString()) + " days."
  + " total memory: " + Math.floor(memTotal/1000).toString() + " MB"
  + " used memory: " + Math.floor((memUsed/memTotal) * 100).toString() + "%"
  + " used cpu: " + cpuUsed.toString() + "%");

  console.log("you should be seeing:\n" + date.toString() 
  + '\n' + '       uptime: ~' 
  + Math.floor(upTime.seconds.toString()) + " seconds, or ~" 
  + Math.floor(upTime.minutes.toString()) + " minutes, or ~" 
  + Math.floor(upTime.hours.toString()) + " hours, or ~" 
  + Math.floor(upTime.days.toString()) + " days."
  + " total memory: " + Math.floor(memTotal/1000).toString() + " MB"
  + " used memory: " + Math.floor((memUsed/memTotal) * 100).toString() + "%"
  + " used cpu: " + cpuUsed.toString() + "%");

  res.end();
}).listen(8080);
*/

// ------------------------------------------------
// Send to react app test 
// ------------------------------------------------

var express = require("express");

var app = express();
var port = process.env.PORT || 8000;

app.listen(port, () => console.log('Listening to: ' + port));

app.get('/Connect', (req, res) => {
    res.send({express: "Connected."})
});

app.get('/Retrieve', (req, res) => {console.log('retrieve called');
    res.send({  serverDate: "Server Date: " + date.toString(), 
                serverUpTime: "Server Uptime (seconds): " + upTime.seconds.toString(), 
                serverUpTimeInstance: "Server Uptime Instance (seconds): " + upTimeInst.seconds.toString(),
                serverTotalMemory: "Total Server Memory: " + Math.floor(memTotal/1000).toString() + " MB",
                serverUsedMemory: "Server Memory Used: " + Math.floor((memUsed/memTotal) * 100).toString() + "%",
                serverCPUUsage: "Server CPU Usage: " + cpuUsed.toString() + "%",
                databaseReturnTable: returnTable
            });
    console.log('sent');
});





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



