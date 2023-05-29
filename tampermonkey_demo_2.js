// ==UserScript==
// @name         Demo
// @namespace    https://github.com/xt9852/tampermonkey_demo
// @version      0.1
// @description  demo
// @author       xt
// @match        https://v88avnetwork.github.io/88av.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest
// @connect      88av1090.cc
// @grant        GM_xmlhttpRequest
// ==/UserScript==


var dns;
var url
var hls;
var last = null;

function get_url() {
    console.log("--查找地址开始--");

    url = dns = document.getElementsByTagName('a')[0].href;

    let ret;
    let reg = /\?type=(.+?)&page=(\d*)/g;

    if ((ret = reg.exec(window.location.search)) !== null) {
        url += ret[1] + "/" + ret[2];
    }

    console.log('dns:' + dns);
    console.log('url:' + url);

    console.log("--查找地址结束--\n\n\n");
}

function new_link(name, addr) {
    let a = document.createElement("a");
    a.href= document.location.origin + document.location.pathname + addr;
    a.innerText = name;
    document.body.appendChild(a);

    a = document.createTextNode("\xa0\xa0\xa0\xa0");
    document.body.appendChild(a);

    console.log(name + '\t' + addr);
}

function add_link() {
    console.log("--添加连接开始--");

    document.body = document.createElement("body");

    new_link('91', '?type=categories/91&page=1');
    new_link('ca', '?type=search/ca&page=');
    new_link('jav', '?type=jav&page=1');
    new_link('usa', '?type=oumei&page=1');
    new_link('new', '?type=video/latest&page=1');

    console.log("--添加连接结束--\n\n\n");
}

function get_m3u8() {

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

function add_page(html) {
    console.log("--处理页面开始--");

    let div;
    let img;
    let ret;
    let txt = 'over';
    let reg = /<img alt="([^"]+)"[\s\S]+?\/\/([^\/]+)\/videos\/([^\/]+)\//g;

    for (var i = 1; (ret = reg.exec(html)) !== null; i++) {

        div = document.createElement("div");
        div.innerText = i + ': ' +ret[1];
        document.body.appendChild(div);

        img = document.createElement("video");
        img.id = "/video/m3u8/" + ret[3] + ".m3u8?video_server=cncdn";
        img.poster = "https://" + ret[2] + "/videos/" + ret[3] + "/cover/5_505_259";
        img.onclick = get_m3u8;
        img.style.cursor = "pointer";
        document.body.appendChild(img);

        console.log(img.id);
    }

    if (1 != i) {
        reg = /data-total-page=\"([0-9]+)\"/;
        if ((ret = reg.exec(html)) !== null) { txt = 'total-page=' + ret[1]; }
    }

    div = document.createElement("div");
    div.innerText = txt;
    document.body.appendChild(div);

    console.log(txt);

    console.log("--处理页面结束--\n\n\n");
}

function get_data() {
    console.log("--请求页面开始--");

    console.log(url);

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload(xhr) { add_page(xhr.responseText) }
    });

    console.log("--请求页面结束--\n\n\n");
}

function main() {
    get_url();

    add_link();

    get_data();
}

main();
