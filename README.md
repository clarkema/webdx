A web front-end for your DXspider node.
===

WebDX provides a standalone, drop-in web front-end for the popular DXspider
cluster software.

WebDX allows anonymous users to receive a live, real-time feed of DX spots
in any modern browser without needing specialized client software.

To install:

    aptitude install git python build-essential libssl-dev
    
    # First, check out the node.js source code somewhere handy:
    mkdir ~/git
    cd ~/git
    git clone --depth 1 git://github.com/joyent/node.git
    cd node
    git checkout origin/v0.4

    # Make a directory to contain everything we'll need to run webdx:
    sudo mkdir -p /opt/webdx
    sudo chown $USER /opt/webdx
    
    # Build node.js into our new directory.
    ./configure --prefix=/opt/webdx
    make
    make install

    # OK, now to install npm; the node.js package manager.
    cd ~/git
    git clone --depth 1 git://github.com/isaacs/npm.git
    cd npm
    export PATH=$PATH:/opt/webdx/bin
    PREFIX=/opt/webdx make install

    cd /opt/webdx
    git clone git://github.com/clarkema/webdx.git
    npm install socket.io

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
