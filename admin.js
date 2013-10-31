/**
 * admin.js
 */
var path = require('path');

var plural = [],
    singular = [],
    info  = {};

var mongoose,
    base_url;

exports.add = function(model_info) {
  plural.push(model_info.plural);
  singular.push(model_info.singular);
  info[model_info.singular] = model_info;
}

exports.config = function(app, mongoose_app, base) {
  mongoose = mongoose_app;
  base_url = base.replace(/\/$/, "");  // remove trailing slash from base url

  // middleware to expose helper functions to templates
  app.use('/admin', function(req, res, next) {
    res.locals.capitalizeFirstLetter = capitalizeFirstLetter;
    next();
  });

  // routes
  app.get(path.join(base, '/'), index);

  /**
   * List   - /admin/users
   * Create - /admin/user/new
   * Read   - /admin/user/<user_id>
   * Update - /admin/user/<user_id>/update
   * Delete - /admin/user/<user_id>/delete
   */

  app.get(path.join(base, '/:list'), list);
  app.get(path.join(base, '/:model/:id'), read);
}

function index(req, res) {
  res.render('admin/index', { title: 'Admin', base: base_url, menu: plural });
}

function list(req, res) {
  var lst = req.params.list;
  var i = plural.indexOf(lst);
  if (i == -1) {
    return res.render('admin/404');
  }

  try {
    var m = singular[i];
    var mm = info[m].model;
    var Model = mongoose.model(mm);
  }
  catch(err) {
    return res.render('admin/404');
  }

  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Model.list(options, function(err, result) {
    if (err) return res.render('admin/500');
    Model.count().exec(function(err, count) {
      res.render('admin/list', {
        title: capitalizeFirstLetter(lst),
        base: base_url,
        list: { fields: info[m].list.fields, headers: info[m].list.headers, data: result, id: info[m].id, model: m },
        menu: plural,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });  
}

function read(req, res) {
  res.end('show: ' + req.params.model + ' / ' + req.params.id );
}

/**
 * Helper functions
 */

function capitalizeFirstLetter(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

