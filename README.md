node-django-admin
=================

A Node.js admin site tool inspired by the Django framework admin site tool.

It requires [express](http://expressjs.com/) and [mongoose](http://mongoosejs.com/).

Theres is a demo app in the *demo* dir. There are example config files, views and stylesheets you can use in your own project.

Disclaimer
----------

We are in an early development stage, so the project is not fully functional. 

There is absolutely no concern about backward compatibility until version 0.1.x is reached.

Install
-------

    $ npm install node-django-admin

Views and stylesheets
---------------------

You can copy the example files to your app and modify then:

Copy the folder *demo/views/admin* to *your_app_views_dir/admin*.

Copy the folder *demo/public/admin* to *your_public_dir/admin*.

How to use
----------

Initialize the admin interface after initializing express:

    // Bootstrap admin site
    admin.config(app, mongoose, '/admin');

This must be called before configure express router:

    app.use(app.router);

Register the mongoose models in the admin interface:

Example:

    /**
     * Register the model in the admin interface
     */

    admin.add({
      singular: 'user',
      plural: 'users',
      model: 'User',
      list: [ 'name', 'email', 'client' ],
      edit: [ 'name', 'email', 'client' ],
      field: {
        'name': {
          header: 'Name'
        },
        'email': {
          header: 'Email',
          widget: 'email'
        },
        'client': {
          header: 'Client'
        }
      }
    });

### widget

* text (default)
* email
* select

Links
-----

* [npm registry](https://npmjs.org/package/node-django-admin)

