const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

require("./app.js")(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });