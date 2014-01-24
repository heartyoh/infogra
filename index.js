/*
 * infogra
 * https://github.com/heartyoh/infogra
 *
 *		
 * Copyright (c) 2014 Hearty, Oh.
 * Licensed under the MIT license.
 */

'use strict';

global.bwip = require('bwip');

exports.png = function(model, options) {
	return;
};

exports.base64 = function(model, options) {
	var s = this.png(model, options);
	
	var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var c1, c2, c3, e1, e2, e3, e4;
    var l = s.length;
    var i = 0;
    var r = "";

    do {
        c1 = s.charCodeAt(i);
        e1 = c1 >> 2;
        c2 = s.charCodeAt(i+1);
        e2 = ((c1 & 3) << 4) | (c2 >> 4);
        c3 = s.charCodeAt(i+2);
        if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }
        if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }
        r+= ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
    } while ((i+= 3) < l);
    
    return 'data:image/png;base64,' + r;
};
