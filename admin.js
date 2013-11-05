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
};

exports.config = function(app, mongoose_app, base) {
  mongoose = mongoose_app;
  base_url = base.replace(/\/$/, "");  // remove trailing slash from base url

  // middleware to expose some helper functions and vars to templates
  app.use('/admin', function(req, res, next) {
    res.locals.capitalizeFirstLetter = capitalizeFirstLetter;
    res.locals.getFieldWidget = getFieldWidget;
    res.locals.base = base_url,
    res.locals.menu = plural;
    next();
  });

  // routes
  app.get(path.join(base, '/'), index);

  app.get(path.join(base, '/:singular/:id/edit'), edit);
  app.get(path.join(base, '/:singular/new'), edit);
  app.get(path.join(base, '/:plural'), list);
  
  app.post(path.join(base, '/:singular/:id'), save);
  app.post(path.join(base, '/:singular'), save);
  
};

function index(req, res) {
  res.render('admin/index', { title: 'Admin', base: base_url, menu: plural });
}

function list(req, res) {
  var lst = req.params.plural;
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
      //console.log(info[m].list);
      res.render('admin/list', {
        title: capitalizeFirstLetter(lst),
        list: info[m].list,
        field: info[m].field,
        data: result,
        model: m,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });  
}

function edit(req, res) {
  var s = req.params.singular,
      p = plural[singular.indexOf(s)],
      id = req.params.id,
      meta = info[s];
      Model = mongoose.model(meta.model);

  Model.load(id, function(err, doc) {
    if (err) return res.render('admin/500');
    if (!doc) {
      doc = new Model();
    }
    res.render('admin/form', {
      doc: doc,
      singular: s,
      plural: p,
      edit: meta.edit,
      field: meta.field
    });
  });
}

function save(req, res) {
  var id = req.params.id,
      s = req.params.singular,
      p = plural[singular.indexOf(s)],
      Model = mongoose.model(info[s].model),
      doc;

  if (id) {
    Model.findOne({_id: id}, function(err, doc) {
      if (err) console.log(err);
      updateFromObject(doc, req.body[s]);
      doc.save(function(err) {
        if (err) console.log(err);
        return res.redirect(base_url + '/' + p);
      });
    });
    //return res.end(id);
  } else {
    var doc = new Model(req.body[s]);
    doc.password = '123mudar';
    doc.save(function(err) {
      if (err) console.log(err);
      return res.redirect(base_url + '/' + p);
    });
  }
}

/**
 * Helper functions
 */

function capitalizeFirstLetter(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getFieldWidget(model, field) {
  var widget = info[model].field[field]['widget'] || 'text';
  switch (widget) {
  case 'text':
    return '<input type="text"></input>';
  case 'email':
    return '<input type="email"></input>';
  }
}

function updateFromObject(doc, obj) {
  for (var field in obj) {
    doc[field] = obj[field];  
  }
}