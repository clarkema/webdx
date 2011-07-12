/* webdx -- a standalone web interface for DXspider cluster nodes.
 * Copyright (C) 2011, Michael Clarke, M0PRL
 * <mike -at- galosh.org.uk>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License Version 3, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var net  = require('net'); // Don't touch this line.

/*
 * Set the port on the next line to the port you want to listen on.
 * Default: 8010
 */
var listenPort = 8010;

/*
 * Update the next line with the details of the cluster you want
 * to connect to.
 */
var spider = spiderConnection( 'example.com', 8000, "USER" );
spider.on( 'data', function (chunk) { processSpot("manual", chunk) } );

/*
 * Update the username to use when connecting to the RBN below.  If
 * you want to completely disable RBN spots, comment out the next
 * two lines.
 */
var rbn = spiderConnection( 'telnet.reversebeacon.net', 7300, "USER" );
rbn.on( 'data', function (chunk) { processSpot("bot", chunk) } );

/*
 * You shouldn't need to change anything below here.
 */

var io = require('socket.io').listen( listenPort );
var activeClients = 0;

io.sockets.on( 'connection', function ( socket ) {
    io.sockets.emit( 'client-count', ++activeClients );

    socket.on( 'disconnect', function() {
        io.sockets.emit( 'client-count', --activeClients );
    });
});

function spiderConnection( host, port, username ) {
    var client = net.createConnection( port, host );
    client.setEncoding( 'utf8' );
    client.on( 'connect', function() {
        client.write( username + "\n" );
        client.write( "se/ve7cc\n" );
    });
    return client;
}

function processSpot (source, data) {
    var fields;
    var spot = new Object;

    if ( data.match( /^CC11/ ) ) {
        fields       = data.split( '^' ).slice( 1, 7 ); 
        spot.source  = source;
        spot.dx      = fields[1];
        spot.spotter = fields[5].replace(/-#$/, '');
        spot.qrg     = fields[0];
        spot.date    = fields[2];
        spot.time    = fields[3];
        spot.comment = fields[4];

        io.sockets.emit('spot', JSON.stringify( spot ) );
    }
}
