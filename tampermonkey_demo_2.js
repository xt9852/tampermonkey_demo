// ==UserScript==
// @name         Demo
// @namespace    https://github.com/xt9852/tampermonkey_demo
// @version      0.1
// @description  demo
// @author       xt
// @match        https://v88avnetwork.github.io/88av.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest
// @connect      88av1044.cc
// @grant        GM_xmlhttpRequest
// ==/UserScript==


var dns;
var hls;
var last = null;

function link(name, addr) {
    let a = document.createElement("a");
    a.href= document.location.origin + document.location.pathname + addr;
    a.innerText = name;
    document.body.appendChild(a);

    a = document.createTextNode("\xa0\xa0\xa0\xa0");
    document.body.appendChild(a);

    console.log(name + '\t' + addr);
}

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
    hls.loadSource(dns + this.id);
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
    console.log("--查找地址开始--");

    dns = document.getElementsByTagName('a')[0].href;

    let ret;
    let reg = /\?type=(video\/latest|jav|oumei|categories\/91|search\/.+?)&page=(\d*)/g;
    let url = dns;

    if ((ret = reg.exec(window.location.search)) !== null) {
        url += ret[1] + "/" + ret[2];
    }

    console.log('dns:' + dns);
    console.log('url:' + url);

    console.log("--查找地址结束--\n\n\n");

    console.log("--添加连接开始--");

    document.body = document.createElement("body");

    link('jav', '?type=jav&page=1');
    link('oumei', '?type=oumei&page=1');
    link('latest', '?type=video/latest&page=1');
    link('search/ca', '?type=search/ca&page=');
    link('categories', '?type=categories&page=1');

    console.log("--添加连接结束--\n\n\n");

    console.log("--请求页面开始--");

    console.log(url);

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload(xhr) { make(xhr.responseText) }
    });

    console.log("--请求页面结束--\n\n\n");
}

main();
