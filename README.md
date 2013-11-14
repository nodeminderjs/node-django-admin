node-django-admin
=================

A Node.js admin site tool inspired by the Django framework admin site tool.

It requires [express](http://expressjs.com/) and [mongoose](http://mongoosejs.com/).

Theres is a demo app in the *demo* dir. There are example config files, views and stylesheets you can use in your own project.

![list view](http://1.bp.blogspot.com/-CGtruS6Wqag/UoTQh5F6Y9I/AAAAAAAAAFk/u1MHBYxZccM/s400/1.png)

Disclaimer
----------

We are in an early development stage, so the project is not fully functional. 

There is absolutely no concern about backward compatibility until version 0.1.0 is reached.

Install
-------

    $ npm install node-django-admin

Views and stylesheets
---------------------

You can copy the example files to your app and modify then:

Copy the folder *demo/views/admin* to *your_app_views_dir/admin*.

Copy the folder *demo/public/admin* to *your_public_dir/admin*.

Example models are in the *demo/models* dir.

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
      path: 'users',
      model: 'User',
      list: [ 'name', 'email', '_client', 'role' ],
      edit: [ 'name', 'email', '_client', 'role' ],
      fields: {
        'name': {
          header: 'Name'
        },
        'email': {
          header: 'Email',
          widget: 'email'
        },
        '_client': {
          header:  'Client',
          widget:  'ref',
          model:   'Client',
          display: 'name'
        },
        'role': {
          header: 'Role',
          widget: 'sel',
          values: ['admin', 'client', 'staff'] 
        }
      }
    });

### Widgets

* text (default)
* email
* ref
* sel

![edit view](http://4.bp.blogspot.com/-7kB6qmYNYIk/UoTQhpZzw8I/AAAAAAAAAFg/7d7pygRKt-U/s400/2.png)

Links
-----

* [Blog](http://nodeminderjs.blogspot.com.br/)
* [npm registry](https://npmjs.org/package/node-django-admin)
