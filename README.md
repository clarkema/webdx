A web front-end for your DXspider node.
=======================================

WebDX provides a standalone, drop-in web front-end for the popular DXspider
cluster software.

WebDX allows anonymous users to receive a live, real-time feed of DX spots
in any modern browser without needing specialized client software.

Installation
------------

This is only one way of getting WebDX up and running; there are many
possible variations!

This approach involves installing node.js, npm and
WebDX into their own tree under /opt/webdx rather than installing
node.js and npm globally.

1. Install system-level dependencies.


        aptitude install git python build-essential libssl-dev


2. Make a directory to contain everything we'll need to run WebDX:

        sudo mkdir -p /opt/webdx
        sudo chown $USER /opt/webdx

3. Temporarily add the directory that we're going to install the node.js
   binary into to our PATH.  We'll need this to be able to install and
   run npm later on, but won't need it to run WebDX once the
   installation is complete.

        export PATH=$PATH:/opt/webdx/bin

4. WebDX depends on node.js and its package manager (npm).  Start by
   downloading and install node.js.

        mkdir ~/git
        cd ~/git
        git clone --depth 1 git://github.com/joyent/node.git
        cd node
        git checkout origin/v0.4
        ./configure --prefix=/opt/webdx
        make
        make install

4.  Now we have node.js installed, we can turn our attention to npm.

        cd ~/git
        git clone --depth 1 git://github.com/isaacs/npm.git
        cd npm
        PREFIX=/opt/webdx make install

5.  With node.js and npm installed, get a copy of the WebDX source,
    and use npm to install the node.js modules we depend on.

        cd /opt/webdx
        git clone git://github.com/clarkema/webdx.git
        npm install socket.io

Configuration
-------------

At this point everything is in place.  Edit /opt/webdx/webdx/webdx.js
and follow the comments to configure the port you want to listen on, and 
the cluster nodes you want to connect to.

Edit /opt/webdx/webdx/web/index.html and follow the comments to
configure the URL you'll be using.

You need to contrive some way to have your webserver make
/opt/webdx/webdx/web available; generally this is done via an alias
directive.

On lighttpd:

    alias.url = ( "/webdx/" => "/opt/webdx/webdx/web/" )

On Apache:

    Alias /webdx /opt/webdx/webdx/web

You should now be able to run WebDX:

    /opt/webdx/bin/node /opt/webdx/webdx/webdx.js

TODO
----

Add daemon and init.d support.
