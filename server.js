const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

var corsOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
const dbConfig = require('./app/config/db.config');
const Role = db.role;

db.mongoose
    .connect(dbConfig.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(()=> {
          console.log('Successfully connected to MongoDB');
          initial();
      })
      .catch(err => {
          console.log('Connection error');
          process.exit();
      });

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my application' });
});


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: 'user'
            }).save(err => {
                if (err) {
                    console.log('error ', err);
                }

                console.log('Added "user" to roles collection');
            });
            
            new Role({
                name: 'moderator'
            }).save(err => {
                if (err) {
                    console.log('error ', err);
                }

                console.log('Added "moderator" to roles collection');
            });

            new Role({
                name: 'admin'
            }).save(err => {
                if (err) {
                    console.log('error ', err);
                }

                console.log('Added "admin" to roles collection');
            });
        }
    });
}