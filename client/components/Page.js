require('babel/register');
var React = require('react');
var $ = require('jQuery');

var SelectedView = require('./SelectedView');
var OptionsView = require('./OptionsView');
var FriendsView = require('./FriendsView');
var Header = require('./Header');
var Footer = require('./Footer');

var Page = React.createClass({

    // Helper methods:
    updateSelected: function(selection) {
      console.log('Ouch!!', selection.name);

      var user = {'name' : selection.name};
      var query = {
        'query' : `
          query queryUser($name:String){
            getUser(name: $name){
              name,
              gender,
              species,
              birthyear,
              homeworld,
              friends{
                name,
                homeworld
              }
            }
          }`,
        'variables': {'name':String(selection.name)}
      };
      $.post('/gql', query, function(response) {
        console.log('GOT RESPONSE FROM GET USER',response);
        var user = response.data.getUser;
        this.setState({
          selected : user,
          friends : user.friends
        });
      }.bind(this));
    },

    getUsers_gql: function() {
      var query = {
        'query' : `query queryUser {
                        getUsers {
                          name,
                          gender,
                          species,
                          birthyear,
                          homeworld,
                          friends {
                            name,
                            homeworld
                          }
                        }
                      }`,
      };
      $.post('/gql', query, function(response) {
        console.log('Retrieving all users',response.data);
        var users = response.data.getUsers;
        this.setState({
          selected : users[0],
          options : users,
          friends : users[0].friends
        });
      }.bind(this));
    },

    // Lifecycle methods:
    getInitialState : function() {
      return ({
        selected : {},
        options : [],
        friends : [],
      });
    },

    componentDidMount : function() {
      var schemaQueryIntrospection = {
        'query' : `{__schema {
          queryType {
            name
          }
        }}`
      };
      var queryIntrospection = {
        'query' : `{__type(name:"query") {
          name,
          fields {
            name,
            description
          }
        }}`
      };
      var schemaMutationIntrospection = {
        'query' : `{__schema {
          mutationType {
            name
          }
        }}`
      };
      var mutationIntrospection = {
        'query' : `{__type(name:"mutation") {
          name,
          fields {
            name,
            description
          }
        }}`
      };
      $.post('/gql', mutationIntrospection, function(response) {
        console.log('introspection',response);
      });
      this.getUsers_gql();
    },

    render : function() {
      //            <OptionsView options={this.state.options} updateSelected={this.updateSelected} />
      return (
        <div id="container" style={styles.page}>

          <Header />
          <div id="navbar"></div>
          <div id="content">
            <br /><br />
            <SelectedView selected={this.state.selected} />
            <br />
            <h3 style={styles.sectionTitle}>Friends</h3>
            <FriendsView friends={this.state.friends} updateSelected={this.updateSelected} />
            <br />
            <h3 style={styles.sectionTitle}>Users</h3>
            <OptionsView options={this.state.options} updateSelected={this.updateSelected} />
          </div>

        </div>
      )
    }
  }
);

var styles = {
  page : {
    backgroundColor : '#151515'
  },
  sectionTitle : {
    color: 'white',
    width: '70%',
    textAlign : 'center',
    margin: '0 auto'
  }

};

module.exports = Page;
