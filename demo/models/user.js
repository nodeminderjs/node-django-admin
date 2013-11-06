/**
 * node-django-admin
 * user.js
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    admin = require('node-django-admin');

/**
 * User Schema
 */

var UserSchema = new Schema({
  name:            { type: String, default: '' },
  email:           { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt:            { type: String, default: '' },
  authToken:       { type: String, default: '' },
  client:          { type: String, default: '' }
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password; });

/**
 * Validations
 */

var validatePresenceOf = function(value) {
  return value && value.length;
}

UserSchema.path('name').validate(function(name) {
  return name.length;
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length;
}, 'Email cannot be blank')

UserSchema.path('email').validate(function(email, fn) {
  var User = mongoose.model('User');
  
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }, function(err, users) {
      fn(!err && users.length === 0);
    });
  } else {
    fn(true);
  }
}, 'Email already exists')

UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password)) {
    next(new Error('Invalid password'));
  }
  else {
    next();
  }
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   */

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   */

  encryptPassword: function(password) {
    if (!password) return '';
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred;
    } catch (err) {
      return '';
    }
  }
}

/**
 * Statics
 */

UserSchema.statics = {

  load: function(id, cb) {
    this.findOne({ _id : id })
      .exec(cb);
  },

  list: function(options, cb) {
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

mongoose.model('User', UserSchema);

/**
 * Register the model in the admin interface
 */

admin.add({
  path: 'users',
  model: 'User',
  list: [ 'name', 'email', 'client' ],
  edit: [ 'name', 'email', 'client' ],
  fields: {
    'name': {
      header: 'Name'
    },
    'email': {
      header: 'Email',
      widget: 'email'
    },
    'client': {
      header: 'Client',
      widget: 'select',
      query:  { model: 'Client', where: {}, select: 'id' },
      values: []
    }
  }
});

