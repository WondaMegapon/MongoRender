const { MongoClient } = require("mongodb");

// The uri string must be the connection string for the database (obtained on Atlas).
const uri = "mongodb+srv://user:userGenerated@wndb.vfrepw4.mongodb.net/?retryWrites=true&w=majority";

// --- This is the standard stuff to get it to work on the browser
const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes will go here

// Default route:
app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Webpage started! We exist.';
  res.send(outstring);
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '.');
});


// Route to access database:
app.get('/api/mongo/:item', function(req, res) {
  const client = new MongoClient(uri);
  const searchKey = "{ partID: '" + req.params.item + "' }";
  console.log("Looking for: " + searchKey);

  async function run() {
    try {
      const database = client.db('Wondabase');
      const parts = database.collection('Utilities');

      const query = { name: req.params.item };

      const part = await parts.findOne(query);
      console.log(part);
      res.send('Found this: ' + JSON.stringify(part));

    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});
