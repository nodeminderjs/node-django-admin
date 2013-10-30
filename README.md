node-django-admin
=================

A Node.js admin site tool inspired by the Django framework admin site tool.

It requires [express](http://expressjs.com/) and [mongoose](http://mongoosejs.com/).

Theres is a demo app in the *demo* dir. There are example config files, views and stylesheets you can use in your own project.

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

Register the mongoose models in the admin interface:

Example:

    /**
     * Register the model in the admin interface
     */

    admin.add({
      singular: 'user',
      plural: 'users',
      model: 'User',
      list: {
        fields:  [ 'name', 'email'  ],
        headers: [ 'Name', 'E-mail' ]
      },
      id: 'email'
    });

Links
-----

* [npm registry](https://npmjs.org/package/node-django-admin)

