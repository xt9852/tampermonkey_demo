// ==UserScript==
// @name         Demo
// @namespace    https://github.com/xt9852/tampermonkey_demo
// @version      0.1
// @description  demo
// @author       xt
// @match        https://88av931.cc/app/user/info*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest
// @connect      https://v88avnetwork.github.io/88av.html
// @grant        GM_xmlhttpRequest
// ==/UserScript==


var hls;
var last = null;

function play() {

    if (this == last) {
        return;
    }

    if (last != null) {
        last.controls = false;
        last.style.cursor = "pointer";
        hls.destroy();
    }

    last = this;
    this.controls = true;
    this.style.cursor = "default";

    hls = new Hls();
    hls.attachMedia(this);
    hls.loadSource(this.id);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        this.play();
    });
}

function make(html) {
    console.log("--处理页面开始--");

    let div;
    let img;
    let ret;
    let reg = /<img alt="([^"]+)"[\s\S]+?\/\/([^\/]+)\/videos\/([^\/]+)\//g;

    while ((ret = reg.exec(html)) !== null) {

        div = document.createElement("div");
        div.innerText = ret[1];
        document.body.appendChild(div);

        img = document.createElement("video");
        img.id = "/video/m3u8/" + ret[3] + ".m3u8?video_server=cncdn";
        img.poster = "https://" + ret[2] + "/videos/" + ret[3] + "/cover/5_505_259";
        img.onclick = play;
        img.style.cursor = "pointer";
        document.body.appendChild(img);

        console.log(img.id);
    }

    console.log("--处理页面结束--\n\n\n");
}

function main() {
    console.log("--添加连接开始--");

    document.body = document.createElement("body");

    let a = document.createElement("a");
    a.href= document.location.origin + document.location.pathname + "?type=video/latest&page=1"
    a.innerText = "latest";
    document.body.appendChild(a);
    console.log(a);

    a = document.createTextNode("\xa0\xa0\xa0\xa0");
    document.body.appendChild(a);

    a = document.createElement("a");
    a.href= document.location.origin + document.location.pathname + "?type=jav&page=1"
    a.innerText = "jav  ";
    document.body.appendChild(a);
    console.log(a);

    a = document.createTextNode("\xa0\xa0\xa0\xa0");
    document.body.appendChild(a);

    a = document.createElement("a");
    a.href= document.location.origin + document.location.pathname + "?type=oumei&page=1"
    a.innerText = "oumei  ";
    document.body.appendChild(a);
    console.log(a);

    a = document.createTextNode("\xa0\xa0\xa0\xa0");
    document.body.appendChild(a);

    a = document.createElement("a");
    a.href= document.location.origin + document.location.pathname + "?type=categories/91&page=1"
    a.innerText = "categories";
    document.body.appendChild(a);
    console.log(a);

    console.log("--添加连接结束--\n\n\n");

    console.log("--请求页面开始--");

    let ret;
    let reg = /\?type=(video\/latest|jav|oumei|categories\/91|search\/.+?)&page=(\d+)/g;
    let url = window.location.origin;

    if ((ret = reg.exec(window.location.search)) !== null) {
        url += "/" + ret[1] + "/" + ret[2];
    }

    console.log(url);

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload(xhr) { make(xhr.responseText) }
    });

    console.log("--请求页面结束--\n\n\n");
}

main();
