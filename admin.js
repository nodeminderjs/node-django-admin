/**
 * admin.js
 */
var path = require('path');

var paths = [],
    info  = {};

var mongoose,
    base_url,
    path_url;

exports.add = function(model_info) {
  paths.push(model_info.path);
  info[model_info.path] = model_info;
};

exports.config = function(app, mongoose_app, base) {
  mongoose = mongoose_app;
  base_url = base.replace(/\/$/, "");  // remove trailing slash from base url

  // middleware to expose some helper functions and vars to templates
  app.use('/admin', function(req, res, next) {
    res.locals.capitalizeFirstLetter = capitalizeFirstLetter;
    res.locals.base = base_url;
    res.locals.menu = paths;
    console.log(res.locals.menu);
    next();
  });

  // routes
  app.get(path.join(base, '/'), index);

  app.get(path.join(base, '/:path/:id/edit'), edit);
  app.get(path.join(base, '/:path/new'), edit);
  app.get(path.join(base, '/:path'), list);
  
  app.post(path.join(base, '/:path/:id/delete'), del);
  app.post(path.join(base, '/:path/:id'), save);
  app.post(path.join(base, '/:path'), save);
  
};

function index(req, res) {
  res.render('admin/index', { title: 'Admin' });
}

function list(req, res) {
  var p = req.params.path,
      m = info[p].model,
      Model = mongoose.model(m);

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
        title: capitalizeFirstLetter(p),
        list:  info[p].list,
        field: info[p].fields,
        data:  result,
        path:  p,
        page:  page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });  
}

function edit(req, res) {
  var p = req.params.path,
      id = req.params.id,
      meta = info[p];
      Model = mongoose.model(meta.model);
      
  Model.load(id, function(err, doc) {
    if (err) return res.render('admin/500');
    if (!doc) {
      doc = new Model();
    }
    processEditFields(meta.edit, meta.fields, function() {
      res.render('admin/edit', {
        doc:   doc,
        path:  p,
        edit:  meta.edit,
        field: meta.fields
      });
    });
  });
}

function save(req, res) {
  var id = req.params.id,
      p = req.params.path,
      Model = mongoose.model(info[p].model),
      doc;

  if (id) {
    Model.findOne({_id: id}, function(err, doc) {
      if (err) console.log(err);
      updateFromObject(doc, req.body[p]);
      doc.save(function(err) {
        if (err) console.log(err);
        return res.redirect(base_url + '/' + p);
      });
    });
  } else {
    var doc = new Model(req.body[p]);
    doc.password = '123change';
    doc.save(function(err) {
      if (err) console.log(err);
      return res.redirect(base_url + '/' + p);
    });
  }
}

function del(req, res) {
  var id = req.params.id,
      p = req.params.path,
      Model = mongoose.model(info[p].model);
  
  Model.remove({ _id: id }, function(err) {
    if (err) console.log(err);
    return res.redirect(base_url + '/' + p);
  });  
}

/**
 * Helper functions
 */

function capitalizeFirstLetter(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateFromObject(doc, obj) {
  for (var field in obj) {
    doc[field] = obj[field];  
  }
}

function getType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function processEditFields(edit, fields, cb) {
  var f,
      Model,
      query,
      field,
      select,
      count = 0;
  
  for (f in edit)
    if (fields[edit[f]].query)
      count++;
  
  if (!count) {
    cb();
    return;
  }

  for (f in edit) {
    field = fields[edit[f]]; 
    if (field.query) {
      query = field.query;
      // query: { model: 'Client', where: {}, select: 'name' }
      select = query.select;
      Model = mongoose.model(query.model);
      Model.find(query.filter, select, {sort: select}, function(err, results) {
        if (err) console.log(err);
        field['values'] = results.map(function(e) { return e[select]; });
        count--;
        if (count == 0) {
          cb();
        }
      });      
    }
  }
}
