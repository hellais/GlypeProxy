if (ginf) {
    siteURL = ginf.url + '/' + ginf.script
}
ignore = '';
base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

function base64_encode(a) {
    var b = "";
    var g = "";
    var f = a.length % 3;
    if (f > 0) {
        for (; f < 3; f++) {
            g += '=';
            a += "\0"
        }
    }
    for (f = 0; f < a.length; f += 3) {
        var d = (a.charCodeAt(f) << 16) + (a.charCodeAt(f + 1) << 8) + a.charCodeAt(f + 2);
        d = [(d >>> 18) & 63, (d >>> 12) & 63, (d >>> 6) & 63, d & 63];
        b += base64chars[d[0]] + base64chars[d[1]] + base64chars[d[2]] + base64chars[d[3]]
    }
    return b.substring(0, b.length - g.length) + g
}
function substr_replace(a, b, g, f) {
    return a.substr(0, g) + b + a.substr(g + f)
}
function strpos(a, b, g) {
    var f = a.indexOf(b, g);
    return f >= 0 ? f : false
}
function strspn(a, b, g, f) {
    var f = f ? g + f : a.length;
    var d = g ? g : 0;
    var c = 0;
    while (d < f) {
        if (b.indexOf(a.charAt(d)) == -1) {
            return c
        }++c;
        ++d
    }
    return c
}
function fetchAjaxObject() {
    var a;
    try {
        a = new XMLHttpRequest
    } catch (e) {
        try {
            a = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (e) {
            try {
                a = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {
                return false
            }
        }
    }
    return a
}
function parseURL(a, b) {
    if (!a) {
        return ''
    }
    a = a.toString();
    if (a.charAt(0) == '#') {
        return a
    }
    if (a.toLowerCase().indexOf('javascript:') === 0) {
        return parseJS(a)
    }
    if (a === 'about:blank') {
        return a
    }
    if (a.indexOf(siteURL) === 0) {
        return a
    }
    if (a.indexOf('http://') !== 0 && a.indexOf('https://') !== 0) {
        if (a == '.') {
            a = ''
        }
        if (a.charAt(0) == '/') {
            if (a.length > 0 && a.charAt(1) == '/') {
                a = 'http:' + a
            } else {
                a = ginf.target.h + a
            }
        } else if (ginf.target.b) {
            a = ginf.target.b + a
        } else {
            a = ginf.target.h + ginf.target.p + a
        }
    }
    a = a.replace('/./', '/');
    if (a.length > 8 && a.substr(8).indexOf('//')) {
        a = a.replace(/[^:]\/\//g, '/')
    }
    if (a.indexOf('/..') > 0) {
        var g = a.substring(ginf.target.h.length).split(/\//);
        for (var f in g) {
            if (g[f] == '..') {
                a = a.replace('/' + g[f - 1] + '/..', '')
            }
        }
    }
    var d = '';
    var c = a.indexOf('#');
    if (c >= 0) {
        d = a.substr(c);
        a = a.substr(0, c)
    }
    if (ginf.enc.e) {
        a = a.substr(4);
        a = base64_encode(a);
        if (ginf.enc.u) {
            a = ginf.enc.u + a
        }
    }
    a = encodeURIComponent(a);
    if (ginf.enc.p && ginf.enc.e) {
        a = a.replace(/%/g, '_');
        return siteURL + '/' + a + '/b' + ginf.b + '/' + (b ? 'f' + b + '/' : '') + d
    }
    return siteURL + '?u=' + a + '&b=' + ginf.b + (b ? '&f=' + b : '') + d
}
function updateLocation(a) {
    ginf.b = 0;
    var b = new Array();
    for (i = 0; i < a.elements.length; i++) {
        if (a.elements[i].name == 'u') {
            url = a.elements[i].value
        } else if (a.elements[i].type == 'checkbox') {
            b.push(a.elements[i]);
            if (a.elements[i].name == 'encodeURL') {
                ginf.enc.e = a.elements[i].checked
            }
        }
    }
    if (!url) {
        return false
    }
    for (i = 0; i < b.length; i++) {
        if (b[i].checked == true) {
            ginf.b = ginf.b | Math.pow(2, i)
        }
    }
    if (url.indexOf('http') !== 0) {
        url = 'http://' + url
    }
    window.top.location = myParseURL(url, 'norefer');
    return false
}
function parseHTML(a) {
    if (typeof (a) != 'string') {
        return a
    }
    if ((parser = /<base href(?==)=["']?([^"' >]+)['"]?(>|\/>|<\/base>)/i.exec(a))) {
        ginf.target.b = parser[1];
        if (ginf.target.b.charAt(ginf.target.b.length - 1) != '/') ginf.target.b += '/';
        a = a.replace(parser[0], '')
    }
    if (parser = /content=(["'])?([0-9]+)\s*;\s*url=(['"]?)([^"'>]+)\3\1(.*?)(>|\/>)/i.exec(a)) a = a.replace(parser[0], parser[0].replace(parser[4], parseURL(parser[4])));
    a = a.replace(/\.(action|src|location|href)\s*=\s*([^;}]+)/ig, '.$1=parseURL($2)');
    a = a.replace(/\.innerHTML\s*(\+)?=\s*([^};]+)\s*/ig, '.innerHTML$1=parseHTML($2)');
    parser = /<iframe\s+([^>]*)\s*src\s*=\s*(["']?)([^"']+)\2/ig;
    while (match = parser.exec(a)) a = a.replace(match[0], '<iframe ' + match[1] + ' src=' + match[2] + parseURL(match[3], 'frame') + match[2]);
    parser = /\s(href|src|background|action)\s*=\s*(["']?)([^"'\s>]+)/ig;
    while (match = parser.exec(a)) {
        a = a.replace(match[0], ' ' + match[1] + '=' + match[2] + parseURL(match[3]))
    }
    parser = /<fo(?=r)rm((?:(?!method)[^>])*)(?:\s*method\s*=\s*(["']?)(get|post)\2)?([^>]*)>/ig;
    while (match = parser.exec(a)) if (!match[3] || match[3].toLowerCase() != 'post') a = a.replace(match[0], '<form' + match[1] + ' method="post" ' + match[4] + '><input type="hidden" name="convertGET" value="1">');
    parser = /url\s*\(['"]?([^'"\)]+)['"]?\)/ig;
    while (match = parser.exec(a)) a = a.replace(match[0], 'url(' + parseURL(match[1]) + ')');
    parser = /@import\s*['"]([^'"\(\)]+)['"]/ig;
    while (match = parser.exec(a)) a = a.replace(match[0], '@import "' + parseURL(match[1]) + '"');
    return a
}
function parseJS(h, m) {
    if (typeof (h) != 'string' || h == false) return h;

    function l(a, b, g) {
        var f = b.length;
        if (a.substr(f, 5) == 'parse') {
            return a
        }
        var d = analyze_js(a, f);
        b = b.replace(/\s/g, '');
        var c = (b == '.innerHTML=') ? 'parseHTML' : 'parseURL';
        var j = c + '(' + a.substring(f, d) + ')';
        return substr_replace(a, j, f, d - f)
    }
    function k(a, b) {
        for (var g = a; a = a.replace(b, l), a != g; g = a);
        return a
    }
    h = k(h, /\b(location\s*\.\s*replace\s*\(\s*)[\s\S]{0,500}/g);
    h = k(h, /(\.\s*innerHTML\s*=(?!=)\s*)[\s\S]{0,500}/g);
    if (window.failed.watched) {
        h = k(h, /\b(location(?:\s*\.\s*href)?\s*=(?!=)\s*)[\s\S]{0,500}/g)
    }
    if (window.failed.setters) {
        h = k(h, /\b(\.href\s*=(?!=)\s*)[\s\S]{0,500}/g);
        h = k(h, /\b(\.background\s*=(?!=)\s*)[\s\S]{0,500}/g);
        h = k(h, /\b(\.src\s*=(?!=)\s*)[\s\S]{0,500}/g);
        h = k(h, /\b(\.action\s*=(?!=)\s*)[\s\S]{0,500}/g)
    }
    h = h.replace(/\bdocument\s*\.\s*domain\s*=/g, 'ignore=');
    return h
}
function analyze_js(a, b, g) {
    var f = 1;
    var d = b;
    var c = a.length;
    var j = false;
    var h = 0;
    var m = 0;
    var l = 0;
    while (j === false && d < c) {
        var k = a.charAt(d);
        switch (k) {
        case '"':
        case "'":
            while ((d = strpos(a, k, d + 1)) && a.charAt(d - 1) == '\\');
            if (d === false) {
                j = c
            }
            break;
        case ';':
            j = d;
            break;
        case "\n":
        case "\r":
            if (h || m || l || g) {
                break
            }
            var n = d + strspn(a, " \t\r\n", d + 1) + 1;
            var o = a.charAt(n);
            if (n <= c && (o == '(' || o == '+')) {
                d = n;
                break
            }
            j = d;
            break;
        case '+':
            d += strspn(a, " \t\r\n", d + 1);
            break;
        case '{':
            ++h;
            break;
        case '(':
            ++m;
            break;
        case '[':
            ++l;
            break;
        case '}':
            h ? --h : j = d;
            break;
        case ')':
            m ? --m : j = d;
            break;
        case ']':
            l ? --l : j = d;
            break;
        case ',':
            if (!g) {
                break
            }
            if (h || m || l) {
                break
            }
            if (f == g) {
                j = d
            }++f;
            if (f == g) {
                var b = d + 1
            }
            break;
        default:
        }++d
    }
    if (j === false) {
        j = c
    }
    if (g) {
        return [b, j]
    }
    return j
}
window.failed = {};
window.base_open = window.open;
window.open = function () {
    var a = Array.prototype.slice.call(arguments);
    if (ginf.override) {
        a[0] = parseURL(a[0])
    } else if (a[a.length - 1] == 'gl') {
        a[0] = parseURL(a[0]);
        a.splice(a.length - 1)
    }
    try {
        return window.base_open(a[0], a[1], a[2])
    } catch (e) {}
};
try {
    XMLHttpRequest.prototype.base_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (a, b, g, f, d) {
        var c = Array.prototype.slice.call(arguments);
        if (ginf.override) {
            c[1] = parseURL(c[1], 'ajax')
        } else if (c[c.length - 1] == 'gl') {
            c[1] = parseURL(c[1], 'ajax');
            c.splice(c.length - 1)
        }
        return this.base_open.apply(this, c)
    }
} catch (e) {
    try {
        document.write('<script type="text/javascript">' + (function (a, b, g, f, d, c) {
            for (f = b[c[33]] - 1; f >= 0; f--) g += d[c[69]][c[74]](b[c[75]](f) - 1);
            b = g[c[73]](' ');
            for (f = b[c[33]] - 1; f >= 0; f--) a = a[c[72]](d[c[71]](f % 10 + (d[c[69]][c[74]](122 - d[c[70]][c[76]](f / 10))), 'g'), b[f]);
            d[c[3]]('_', a)(c)
        })("8y s=6x8x109x;8y b=6w6x8x209x,c=6x8x249x8x149x3w!6x8x449x;9z e2w{5x.a5=s?2y s:2y 6x8x09x(_[7]);5x.a4=0w};0y(b3ws8x679x)e8x679x=s8x679x;e8x99x=0;e8x89x=1;e8x49x=2;e8x59x=3;e8x29x=4;e8x489x8x509x=e8x99x;e8x489x8x539x=\"\";e8x489x8x549x=2x;e8x489x8x599x=0;e8x489x8x609x=\"\";e8x489x8x409x=2x;e8x409x=2x;e8x399x=2x;e8x419x=2x;e8x389x=2x;e8x489x8x439x=9z(t,w,a,x,v){0y(4x8x339x<3)a=3x;5x.a2=a;8y r=5x,m=5x8x509x;0y(c){8y i=9z2w{0y(r.a58x509x7we8x29x){f(r);r8x129x2w}};0y(a)6x8x179x(_[42],i)}5x.a58x409x=9z2w{0y(b3w!a)3y;r8x509x=r.a58x509x;k(r);0y(r.a1){r8x509x=e8x99x;3y}0y(r8x509x5we8x29x){f(r);0y(c3wa)6x8x229x(_[42],i)}0y(m7wr8x509x)j(r);m=r8x509x};0y(e8x399x)e8x399x8x169x(5x,4x);5x.a58x439x(t,w,a,x,v);0y(!a3wb){5x8x509x=e8x89x;j(5x)}};e8x489x8x559x=9z(z){0y(e8x419x)e8x419x8x169x(5x,4x);0y(z3wz8x369x){z=6x8x119x?2y 6x8x119x2w8x569x(z):z8x689x;0y(!5x.a38x19x)5x.a58x579x(_[1],_[15])}5x.a58x559x(z);0y(b3w!5x.a2){5x8x509x=e8x89x;k(5x);9y(5x8x509x<e8x29x){5x8x509x0v;j(5x);0y(5x.a1)3y}}};e8x489x8x129x=9z2w{0y(e8x389x)e8x389x8x169x(5x,4x);0y(5x8x509x>e8x99x)5x.a1=3x;5x.a58x129x2w;f(5x)};e8x489x8x279x=9z2w{3y 5x.a58x279x2w};e8x489x8x289x=9z(u){3y 5x.a58x289x(u)};e8x489x8x579x=9z(u,y){0y(!5x.a3)5x.a3=1w;5x.a3[u]=y;3y 5x.a58x579x(u,y)};e8x489x8x139x=9z(u,h,d){8z(8y l=0,q;q=5x.a4[l];l0v)0y(q[0]5wu3wq[1]5wh3wq[2]5wd)3y;5x.a48x499x([u,h,d])};e8x489x8x529x=9z(u,h,d){8z(8y l=0,q;q=5x.a4[l];l0v)0y(q[0]5wu3wq[1]5wh3wq[2]5wd)1z;0y(q)5x.a48x589x(l,1)};e8x489x8x239x=9z(p){8y p={'type':p8x669x,'target':5x,'currentTarget':5x,'eventPhase':2,'bubbles':p8x189x,'cancelable':p8x199x,'timeStamp':p8x649x,'stopPropagation':9z2w1w,'preventDefault':9z2w1w,'0zitEvent':9z2w1w};0y(p8x669x5w_[51]3w5x8x409x)(5x8x409x8x299x4w5x8x409x)8x169x(5x,[p]);8z(8y l=0,q;q=5x.a4[l];l0v)0y(q[0]5wp8x669x3w!q[2])(q[1]8x299x4wq[1])8x169x(5x,[p])};e8x489x8x659x=9z2w{3y '['+_[37]+' '+_[10]+']'};e8x659x=9z2w{3y '['+_[10]+']'};9z j(r){0y(e8x409x)e8x409x8x169x(r);r8x239x({'type':_[51],'bubbles':1x,'cancelable':1x,'timeStamp':2y Date+0})};9z g(r){8y o=r8x549x;0y(c3wo3w!o8x259x3wr8x289x(_[1])8x359x(/[^\\/]+\\/[^\\+]+\\+xml/)){o=2y 6x8x09x(_[6]);o8x349x(r8x539x)}0y(o)0y((c3wo8x459x7w0)4w(o8x259x3wo8x259x8x629x5w_[46]))3y 2x;3y o};9z k(r){7y{r8x539x=r.a58x539x}3z(e)1w7y{r8x549x=g(r.a5)}3z(e)1w7y{r8x599x=r.a58x599x}3z(e)1w7y{r8x609x=r.a58x609x}3z(e)1w};9z f(r){r.a58x409x=2y 6x8x39x;6z r.a3};0y(!6x8x39x8x489x8x169x){6x8x39x8x489x8x169x=9z(r,n){0y(!n)n=0w;r.a0=5x;r.a0(n[0],n[1],n[2],n[3],n[4]);6z r.a0}};6x8x109x=e;", ">?!>=!..!,,!>.!>,!>\"!\"\"!>>!}}!\'\'!*)!~|!^\\!^^!\\`\\!uofnvdpe!xpeojx!tjiu!tuofnvhsb!fvsu!mmvo!ftmbg!iujx!fmjix!sbw!zsu!idujxt!gpfqzu!xpsiu!osvufs!xfo!gpfdobutoj!gj!opjudovg!spg!ftmf!fufmfe!umvbgfe!fvojuopd!idubd!ftbd!lbfsc!oj", '', 0, this, 'ActiveXObject Content-Type DONE Function HEADERS_RECEIVED LOADING Microsoft.XMLDOM Microsoft.XMLHTTP OPENED UNSENT XMLHttpRequest XMLSerializer abort addEventListener all application/xml apply attachEvent bubbles cancelable controllers currentTarget detachEvent dispatchEvent document documentElement eventPhase getAllResponseHeaders getResponseHeader handleEvent http://www.w3.org/XML/1998/namespace http://www.w3.org/ns/xbl initEvent length loadXML match nodeType object onabort onopen onreadystatechange onsend onunload open opera parseError parsererror preventDefault prototype push readyState readystatechange removeEventListener responseText responseXML send serializeToString setRequestHeader splice status statusText stopPropagation tagName target timeStamp toString type wrapped xml String Math RegExp replace split fromCharCode charCodeAt floor'.split(' ')) + '</script>');
        XMLHttpRequest.prototype.base_open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (a, b, g, f, d) {
            var c = Array.prototype.slice.call(arguments);
            if (ginf.override) {
                c[1] = parseURL(c[1], 'ajax')
            } else if (c[c.length - 1] == 'gl') {
                c[1] = parseURL(c[1], 'ajax');
                c.splice(c.length - 1)
            }
            return this.base_open.apply(this, c)
        }
    } catch (e) {
        failed.ajax = true
    }
}
document.base_write = document.write;
document.base_writeln = document.writeln;
document.write = function (a) {
    var b = Array.prototype.slice.call(arguments);
    if (ginf.override || b[b.length - 1] == 'gl') {
        a = parseHTML(a)
    }
    document.base_write(a)
};
document.writeln = function (a) {
    var b = Array.prototype.slice.call(arguments);
    if (ginf.override || b[b.length - 1] == 'gl') {
        a = parseHTML(a)
    }
    document.base_writeln(a)
};
if (typeof ginf.override != 'undefined' || typeof ginf.test != 'undefined') {
    base_eval = eval;
    eval = function (a) {
        return base_eval(parseJS(a))
    };
    try {
        function locationWatcher(a, b, g) {
            return parseURL(g)
        }
        location.watch('href', locationWatcher);
        window.watch('location', locationWatcher);
        parent.watch('location', locationWatcher);
        self.watch('location', locationWatcher);
        top.watch('location', locationWatcher);
        document.watch('location', locationWatcher)
    } catch (e) {
        failed.watched = true
    }
    try {
        var intercept = [HTMLElement, HTMLHtmlElement, HTMLHeadElement, HTMLLinkElement, HTMLStyleElement, HTMLBodyElement, HTMLFormElement, HTMLSelectElement, HTMLOptionElement, HTMLInputElement, HTMLTextAreaElement, HTMLButtonElement, HTMLLabelElement, HTMLFieldSetElement, HTMLLegendElement, HTMLUListElement, HTMLOListElement, HTMLDListElement, HTMLDirectoryElement, HTMLMenuElement, HTMLLIElement, HTMLDivElement, HTMLParagraphElement, HTMLHeadingElement, HTMLQuoteElement, HTMLPreElement, HTMLBRElement, HTMLBaseFontElement, HTMLFontElement, HTMLHRElement, HTMLAnchorElement, HTMLImageElement, HTMLObjectElement, HTMLParamElement, HTMLAppletElement, HTMLMapElement, HTMLModElement, HTMLAreaElement, HTMLScriptElement, HTMLTableElement, HTMLTableCaptionElement, HTMLTableColElement, HTMLTableSectionElement, HTMLTableRowElement, HTMLTableCellElement, HTMLFrameSetElement, HTMLFrameElement, HTMLIFrameElement];
        newSrc = function (a) {
            try {
                this.base_setAttribute('src', parseURL(a))
            } catch (ignore) {}
        };
        newAction = function (a) {
            try {
                this.base_setAttribute('action', parseURL(a))
            } catch (ignore) {}
        };
        newHref = function (a) {
            try {
                this.base_setAttribute('href', parseURL(a))
            } catch (ignore) {}
        };
        newBackground = function (a) {
            try {
                this.base_setAttribute('background', parseURL(a))
            } catch (ignore) {}
        };
        mySetAttribute = function (a, b) {
            try {
                type = a.toLowerCase();
                if (type == 'src' || type == 'href' || type == 'background' || type == 'action') {
                    b = parseURL(b)
                }
                this.base_setAttribute(a, b)
            } catch (ignore) {}
        };
        for (i = 0, len = intercept.length; i < len; i++) {
            if (typeof intercept[i].prototype == 'undefined') {
                continue
            }
            obj = intercept[i].prototype;
            obj.base_setAttribute = obj.setAttribute;
            obj.setAttribute = mySetAttribute;
            obj.__defineSetter__('src', newSrc);
            obj.__defineSetter__('action', newAction);
            obj.__defineSetter__('href', newHref);
            obj.__defineSetter__('background', newBackground)
        }
    } catch (e) {
        failed.setters = true
    }
    if (typeof ginf.test != 'undefined') {
        var req = fetchAjaxObject();
        var failures = '';
        if (failed.ajax) failures += '&ajax=1';
        if (failed.watched) failures += '&watch=1';
        if (failed.setters) failures += '&setters=1';
        req.base_open('GET', ginf.url + '/includes/process.php?action=jstest&' + failures, true);
        req.send('')
    }
}
window.myParseHTML = parseHTML;
window.myParseJS = parseJS;
window.myParseURL = parseURL;

function noChange(a) {
    return a
}
function disableOverride() {
    window.parseHTML = noChange;
    window.parseJS = noChange;
    window.parseURL = noChange
}
function enableOverride() {
    if (!ginf.override) {
        return
    }
    window.parseHTML = window.myParseHTML;
    window.parseJS = window.myParseJS;
    window.parseURL = window.myParseURL
}
var offsetx = 12;
var offsety = 8;

function newelement(a) {
    if (document.createElement) {
        var b = document.createElement('div');
        b.id = a;
        with(b.style) {
            display = 'none';
            position = 'absolute'
        }
        b.innerHTML = '&nbsp;';
        document.body.appendChild(b)
    }
}
var ie5 = (document.getElementById && document.all);
var ns6 = (document.getElementById && !document.all);
var ua = navigator.userAgent.toLowerCase();
var isapple = (ua.indexOf('applewebkit') != -1 ? 1 : 0);

function getmouseposition(a) {
    if (document.getElementById) {
        var b = (document.compatMode && document.compatMode != 'BackCompat') ? document.documentElement : document.body;
        pagex = (isapple == 1 ? 0 : (ie5) ? b.scrollLeft : window.pageXOffset);
        pagey = (isapple == 1 ? 0 : (ie5) ? b.scrollTop : window.pageYOffset);
        mousex = (ie5) ? event.x : (ns6) ? clientX = a.clientX : false;
        mousey = (ie5) ? event.y : (ns6) ? clientY = a.clientY : false;
        var g = document.getElementById('tooltip');
        g.style.left = (mousex + pagex + offsetx) + 'px';
        g.style.top = (mousey + pagey + offsety) + 'px'
    }
}
function tooltip(a) {
    if (!document.getElementById('tooltip')) newelement('tooltip');
    var b = document.getElementById('tooltip');
    b.innerHTML = a;
    b.style.display = 'block';
    document.onmousemove = getmouseposition
}
function exit() {
    document.getElementById('tooltip').style.display = 'none'
}
window.domReadyFuncs = new Array();
window.addDomReadyFunc = function (a) {
    window.domReadyFuncs.push(a)
};

function init() {
    if (arguments.callee.done) return;
    arguments.callee.done = true;
    if (_timer) clearInterval(_timer);
    for (var a = 0; a < window.domReadyFuncs.length; ++a) {
        try {
            window.domReadyFuncs[a]()
        } catch (ignore) {}
    }
}
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init, false)
} /*@cc_on @*/
/*@if(@_win32)var proto="src='javascript:void(0)'";if(location.protocol=="https:")proto="src=//0";document.base_write("<script id=__ie_onload defer "+proto+"><\/script>");var script=document.getElementById("__ie_onload");script.onreadystatechange=function(){if(this.readyState=="complete"){init()}};/*@end @*/
if (/WebKit/i.test(navigator.userAgent)) {
    var _timer = setInterval(function () {
        if (/loaded|complete/.test(document.readyState)) {
            init()
        }
    }, 10)
}
window.onload = init;
