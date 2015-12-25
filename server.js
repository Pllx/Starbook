import Sequelize from 'sequelize';

import Nala from './Nala/nala'
import express from 'express';
import bodyParser from 'body-parser';
import Schema from './data/schema';

let pgURI = 'postgres://localhost/starwars'
let app = express();

app.use(express.static('client'));
app.use(bodyParser.urlencoded());


/* REST */
let sequelize = new Sequelize(pgURI);
let User = sequelize.define('users', {
  name : {type : Sequelize.STRING},
  species : {type : Sequelize.STRING},
  gender : {type : Sequelize.STRING},
  birthyear : {type : Sequelize.STRING},
  homeworld : {type : Sequelize.STRING}
});

User.sync();
User.belongsToMany(User, {through: 'friends_table', as: 'friends'});

app.use('/character', function(req,res){
  console.log('Request to character');
});

app.get('/users', function(req, res) {
  User
    .findAll({})
    .then(function(users) {
      // console.log(users);
      res.send(users);
    });
});

app.get('/friends', function(req, res) {
  User
    .findOne({where: req.query})
    .then(function (user) {
      // console.log('user is', user);
      user
        .getFriends({})
        .then(function(friends) {
          // console.log('got friends', friends);
          res.send(friends);
        });
    });
});

/* GraphQL */

let graphQLHandler = Nala(Schema, pgURI);
app.use('/gql', graphQLHandler);

app.listen(process.env.PORT ||  3000, function(){
  console.log('Server is listening on port 3000');
});

module.exports = app;
