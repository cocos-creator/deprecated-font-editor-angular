﻿// 暂时从atlas-editor复制过来，之后应该统一
var _commonDownload = function (url, filename) {
    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    a.href = url;
    a.download = filename;
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(event);
};

var _saveDataUrl = function (dataUrl, path) {
    var fs = require('fs');
    var base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(path, base64, {'encoding': 'base64'});
};

// 暂时从atlas-editor复制过来，之后应该统一
var _savePng = function (canvas, basename, path) {
    var isnw = process && process.versions && process.versions['node-webkit'];
    if (isnw) {
        var pngDataUrl = canvas.toDataURL("image/png");
        _saveDataUrl(pngDataUrl, path);
    }
    else {
        canvas.toBlob = canvas.toBlob || canvas.msToBlob;
        window.navigator.saveBlob = window.navigator.saveBlob || window.navigator.msSaveBlob;
        window.BlobBuilder = window.BlobBuilder || window.MSBlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
        if (window.BlobBuilder && canvas.toBlob && window.navigator.saveBlob) {
            var blobBuilderObject = new BlobBuilder(); // Create a blob builder object so that we can append content to it.
            blobBuilderObject.append(canvas.toBlob()); // Append the user's drawing in PNG format to the builder object.
            window.navigator.saveBlob(blobBuilderObject.getBlob(), basename + ".png"); // Move the builder object content to a blob and save it to a file.
        }
        else {
            var pngDataUrl = canvas.toDataURL("image/png");
            _commonDownload(pngDataUrl, basename + ".png");
        }
    }
};

var getSavePath = function (defaultFilename, preserveDirKey, callback) {
    var chooser = document.createElement('input');
    chooser.type = 'file';
    chooser.nwsaveas = defaultFilename;
    var defaultDir = localStorage[preserveDirKey];
    if (defaultDir) {
        chooser.nwworkingdir = defaultDir;
    }
    chooser.addEventListener("change", function (evt) {
        localStorage[preserveDirKey] = this.value;
        callback(this.value);
    }, false);
    chooser.click();
};

var modifyExtension = function (path, newExtension) {
    var Path = require('path');
    return Path.join(Path.dirname(path), Path.basename(path, Path.extname(path))) + newExtension;
};