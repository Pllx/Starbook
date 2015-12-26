import {GraphQLList} from 'graphql';

//modelNames: array of user created GraphQL model names e.g.['user', 'blogpost']
function CreateGetters(modelNames, typeMap, queryFields, tables){
  // console.log('called create getters');
  // console.log('modelNames', modelNames);
  // console.log('typeMap',typeMap);
  // console.log('queryFields',queryFields);

  for(var i = 0; i < modelNames.length; i++){
    //'user' -> 'User'
    var capitalizedName = modelNames[i].charAt(0).toUpperCase()+modelNames[i].slice(1);
    var getterName = 'get'+capitalizedName;//+'By'+field.charAt(0).toUpperCase()+field.slice(1);
    var getterNamePlural = getterName+'s';
    var modelFields = typeMap[modelNames[i]]._fields;
    getterName = 'get'+capitalizedName;//+'By'+field.charAt(0).toUpperCase()+field.slice(1);
    var args  = [];

    for (var field in modelFields){ //fields: name, age...
      var argObject = {
        name: field,
        type: typeMap[modelFields[field].type.name],
        description: null,
        defaultValue: null
      };
      args.push(argObject);
    }

    //singular, e.g. getUser

    queryFields[getterName] = {
      name: getterName,
      description: 'test in createGetters(singular)',
      type: typeMap[modelNames[i]]
    };

    queryFields[getterName].args = args;

    queryFields[getterName].resolve = (root, args, test)=>{
      console.log('yo im in the created getter singular');
      console.log('dis my args', args);
      //console.log('dis my test', test);

      var selectorObj= {};
      for (var key in args){
        if (args[key] !== undefined){
          selectorObj[key]= args[key];
        }
      }
      console.log('dis my parsed args', selectorObj);
      return tables[capitalizedName]
          .findOne({
            where: selectorObj //e.g. { name : 'Ken' }
          });
    };

    //plural, e.g. getUsers
    queryFields[getterNamePlural] = {
      name: getterNamePlural,
      description: 'test in createGetters(plural)',
      type: new GraphQLList(typeMap[modelNames[i]])
    };

    queryFields[getterNamePlural].args = args;

    queryFields[getterNamePlural].resolve = (root, args)=>{
      console.log('yo im in the created getter plural');
      var selectorObj= {};
      for (var key in args){
        if (args[key] !== undefined){
          selectorObj[key]= args[key];
        }
      }
      return tables[capitalizedName]
          .findAll({
            where: selectorObj //e.g. { name : 'Ken' }
          });
    };
  }
}

module.exports = CreateGetters;
