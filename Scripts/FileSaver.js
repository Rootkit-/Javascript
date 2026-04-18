"use strict";
const _global = window

function bom(blob, opts) {
    if (typeof opts === 'undefined')
        opts = {
            autoBom: false
        }
    else if (typeof opts !== 'object') {
        console.warn('Deprecated: Expected third argument to be a object')
        opts = {
            autoBom: !opts
        }
    }

    if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
        return new Blob([String.fromCharCode(0xFEFF), blob], {
            type: blob.type
        })
    }
    return blob
}

function createblob(url, name, types, opts) {
    var textFileAsBlob = new Blob([url], {
        type: types
    });
    saveAs(window.URL.createObjectURL(textFileAsBlob), name, opts)
};

function download2(url, name, opts) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url)
    xhr.responseType = 'blob';
    xhr.onload = function() {
        saveAs(xhr.response, name, opts)
    }
    xhr.onprogress = function(evt) {
        if (evt.lengthComputable) {
            console.log(`Saving: ${name}: ${url} ${evt.loaded} / ${evt.total}`)
        } else {
            console.log(`Saving: ${name}: ${url} ${evt.loaded}`)
        }
    }
    xhr.onerror = function() {
        console.error('could not download file')
    }
    xhr.send()
}

function download(url, name, opts) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.onload = function() {
        saveAs(xhr.response, name, opts)
    }
    xhr.onerror = function() {
        console.error('could not download file')
    }
    xhr.send()
}

function corsEnabled(url) {
    var xhr = new XMLHttpRequest()
    xhr.open('HEAD', url, false)
    try {
        xhr.send()
    } catch (e) {}
    return xhr.status >= 200 && xhr.status <= 299
}

function click(node) {
    try {
        node.dispatchEvent(new MouseEvent('click'))
    } catch (e) {
        var evt = document.createEvent('MouseEvents')
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
            20, false, false, false, false, 0, null)
        node.dispatchEvent(evt)
    }
}

var isMacOSWebView = _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)

function saveAs(blob, name, opts) {
    var URL = _global.URL || _global.webkitURL
    // Namespace is used to prevent conflict w/ Chrome Poper Blocker extension (Issue #561)
    var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    name = name || blob.name || 'download'

    a.download = name
    a.rel = 'noopener' // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    if (typeof blob === 'string') {
        // Support regular links
        a.href = blob
        if (a.origin !== location.origin) {
            corsEnabled(a.href) ?
                download(blob, name, opts) :
                click(a, a.target = '_blank')
        } else {
            click(a)
        }
    } else {
        // Support blobs
        a.href = URL.createObjectURL(blob)
        setTimeout(function() {
            URL.revokeObjectURL(a.href)
        }, 4E4) // 40s
        setTimeout(function() {
            click(a)
        }, 0)
    }
}
_global.saveAs = saveAs