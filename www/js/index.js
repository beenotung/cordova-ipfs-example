/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        if (id === "deviceready") {
            alert("ready");
            main();
        } else {
            alert("Received Event: " + id);
        }
    }
};

app.initialize();

function init() {
    return new Promise(function (resolve, reject) {
        try {
            var ipfs = new CordovaIpfs();
            var appFilesPath = cordova.file.dataDirectory.split("file://")[1] + "files/";
            ipfs.init(
                {
                    src: "https://dist.ipfs.io/go-ipfs/v0.4.8/go-ipfs_v0.4.8_linux-arm.tar.gz"
                    , appFilesDir: appFilesPath
                    , resetRepo: false
                }
                , function (res) {
                    alert("init Result: " + res.toString());
                    ipfs.start(function (res) {
                        alert("start Result: " + (res || "").toString());
                        resolve(true);
                    }, function (err) {
                        alert("start Error: " + err.toString());
                    });
                }
                , function (err) {
                    alert("init Error: " + err.toString());
                }
            );
        } catch (e) {
            alert("Exception: " + e.toString())
        }
    });
}

function load() {
    if (window.IpfsApi) {
        alert('ipfs library is loaded');
        return Promise.resolve();
    }
    alert('load ipfs-api now');
    return fetch('https://unpkg.com/ipfs-api@20.0.1/dist/index.js')
        .then(function (res) {
            return res.text()
        })
        .then(function (text) {
            alert('loaded code: ' + text.length);
            var e = document.createElement('script');
            e.textContent = text || "";
            document.appendChild(e);
            return new Promise(function (resolve) {
                setTimeout(resolve, 2000);
            })
        })
}

function run(f) {
    return function () {
        try {
            return Promise.resolve(f());
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

function toString(x) {
    return (x || "").toString();
}

function test() {
    var ipfs = window.ipfs = window.IpfsApi({
        host: 'localhost'
        , port: '5001'
        , protocol: 'http'
    });
    // var encoder = new TextEncoder();
    // var buffer = encoder.encode('test content');
    var buf = buffer.Buffer.from('test content');
    return ipfs.add(buf)
        .then(function (res) {
            return ipfs.get(res[0].hash)
                .then(function (res) {
                    var text = res[0].content.toString();
                    alert("get Result: " + text);
                    if (text === 'test content') {
                        alert('pass');
                    }
                })
                .catch(function (e) {
                    alert("get Error: " + toString(e))
                })
        })
        .catch(function (e) {
            alert("add Error: " + toString(e))
        })
}

window.initUI = function () {
    document.getElementById('load_container').style.display = 'none';
    document.getElementById('input_container').style.display = 'initial';
    var margin = document.getElementById('enter').getBoundingClientRect().height * 8;
    var height = screen.height - margin;
    document.getElementById('console').style.height = (height / 3 * 2) + 'px';
    document.getElementById('command').style.height = (height / 2) + 'px';
    document.getElementById('enter').addEventListener('click', onEnter, false);
};

function main() {
    return init()
        .then(function (res) {
            if (res !== true) {
                return Promise.reject(res);
            }
        })
        .then(run(load))
        .then(function (res) {
            initUI();
            return res;
        })
        .then(run(test))
        .then(function (res) {
            alert("Main Result: " + (res || "").toString())
        })
        .catch(function (err) {
            alert("Main Error: " + (err || "").toString())
        })
}

function onEnter(event) {
    try {
        var code = document.getElementById('command').value;
        var console = document.getElementById('console');
        var res = eval(code);
        console.textContent = "Result: " + res.toString();
    } catch (e) {
        console.textContent = "Error: " + e.toString();
    }
}

function alert(s) {
    s = "Alert: " + toString(s);
    console.log(s);
    document.getElementById('console').textContent += "\n" + s + "\n";
}
