/**
 * helpdesk
 * cliente.js
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    admin = require('node-django-admin');

/**
 * Schema
 */

var schema = new Schema({
  name:      { type: String, default: '' },
  id:        { type: String, default: '' },
  contacts:  [{ name: String, email: String, tel: String }]
}, { collection: 'clients' });

/**
 * Validations
 */

var validatePresenceOf = function(value) {
  return value && value.length;
}

schema.path('name').validate(function(nome) {
  return nome.length;
}, 'Name cannot be blank');

schema.path('id').validate(function(codigo) {
  return codigo.length;
}, 'Id cannot be blank');

/**
 * Statics
 */

schema.statics = {
  load: function(id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {};
    var order = options.order || {'name': 1};

    this.find(criteria)
      //.populate('user', 'name username')
      .sort(order)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
}

/**
 * Register the model in mongoose
 */

mongoose.model('Client', schema);

/**
 * Register the model in the admin interface
 */

admin.add({
  path: 'clients',
  model: 'Client',
  list: [ 'name', 'id' ],
  edit: [ 'name', 'id' ],
  fields: {
    name: {
      header: 'Name'
    },
    id: {
      header: 'Id'
    }
  }  
});

