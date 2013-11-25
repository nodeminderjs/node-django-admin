node-django-admin
=================

A Node.js admin site tool inspired by the Django framework admin site tool.

It requires [express](http://expressjs.com/) and [mongoose](http://mongoosejs.com/).

Theres is a demo app in the *demo* dir. There are example config files, models, views and stylesheets you can use in your own project.
We are using [Twitter Bootstrap](http://getbootstrap.com/) in the demo app, but it's not required.

![list view](http://4.bp.blogspot.com/-TTszJFyDyS8/UpOiS8TpN7I/AAAAAAAAAF8/RGupqd3W0HM/s1600/1.png)


Disclaimer
----------

We are in an early development stage, so the project is not fully functional. 

There is absolutely no concern about backward compatibility until version 0.1.0 is reached.


Install
-------

    $ npm install node-django-admin


Models, views and stylesheets
-----------------------------

You can copy the example files to your app and modify then:

Copy the folder *demo/views/admin* to *your_app_views_dir/admin*.

Copy the folder *demo/public/admin* to *your_public_dir/admin*.

Example models are in the *demo/models* dir.

The models must have the following requirements:

* Define a virtual field for each ref field.
* Define the static methods *load* and *list*. See the examples for more information.


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
      list: [ 'name', 'email', 'client', 'role' ],
      edit: [ 'name', 'email', 'client', 'role' ],
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
          widget:  'ref',
          model:   'Client',
          display: 'name',
          field:   '_client'
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

![edit view](http://2.bp.blogspot.com/-VLFBbO0FQGs/UpOiSwxNyNI/AAAAAAAAAGA/Igt0MCovsyU/s1600/2.png)


Links
-----

* [Blog](http://nodeminderjs.blogspot.com.br/)
* [npm registry](https://npmjs.org/package/node-django-admin)
