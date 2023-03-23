// ==UserScript==
// @name         Demo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  demo
// @author       xt
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// ==/UserScript==


/*
@name               油猴脚本名称，会展示到浏览器中。必填项。
@namespace          脚本命名空间，用于唯一确定脚本。油猴管理面包中点击主页按钮即可跳转到此地址。
@homepage	        主页地址。油猴管理面板中点击主页按钮即可跳转到此地址。可以作为脚本更新网址。
@version            脚本版本，用于脚本的更新。必填项。
@icon	            用于指定脚本图标，可以设置为图片URL地址或base64的字符串。
@description        脚本描述。必填项。
@author             作者名字。
@license            脚本所使用的许可协议名称或地址，该协议需包含用户是否允许二次分发或修改脚本的权利。
                    其它人都可以随意使用时，指定为 MIT 即可。
@match              使用通配符匹配需要运行网址，例如: *,https://*,https://www.baidu.com/*等。
@exclude	        排除匹配到的网站。
@include	        保护匹配到的网站。
@run-at	            指定脚本的运行时机，如：页面加载完成时执行 @run-at document-end
@grant              指定脚本运行所需权限，拥有相应的权限才能调用油猴扩展提供的与浏览器进行交互的API。
                    如果为none，则不使用沙箱环境，脚本会直接运行在网页的环境中，这时无法使用大部分油猴扩展的Api，
                    而只能使用油猴默认添加的几个最常用 Api。
@require            指定脚本依赖的其他js库，比如 JQuery。
@connect            用于跨域访问时指定的目标网站域名。
                    当用户使用 gm_xmlhttprequest 请求远程数据的时候，需要使用connect指定允许访问的域名，
                    支持域名、子域名、ip地址以及 * 通配符
@updateURL
@installURL
@downloadURL        脚本更新网址，当油猴扩展检查更新的时候，会尝试从这个网址下载脚本，然后比对版本号确认是否更新，
                    不写时，@homepage也可以代替。
@supportURL	        用户可获得该脚本技术支持的链接地址 (如：错误反馈系统、论坛、电子  邮件)，该链接将显示在脚本的反馈页面。
@contributionURL	用于捐赠脚本作者的链接，该链接将显示在脚本的反馈页面。
@contributionAmount	建议捐赠金额，请配合 @contributionURL 使用。

------------------------------------------------------------------------------------------------------------
@grant unsafewindow                                 允许脚本可以完整访问原始页面，包括原始页面的脚本和变量。
@grant GM_getValue(name,defaultvalue)               从油猴扩展的存储中访问指定key的数据。可以设置默认值，
                                                    在没成功获取到数据的时候当做初始值。
                                                    如果保存的是日期等类型的话，取出来的数据会变成文本，需要自己转换一下。
@grant GM_setValue(name,value)                      将数据保存到油猴扩展的存储中。即使关了浏览器，重新打开仍然能获取到值。
                                                    同一个值在匹配的全部网页中都能获取到，所以必须在属性名中加以区分。
@grant GM_deleteValue(name)                         将数据从油猴扩展的存储中删除
@grant GM_listValues	                            从油猴扩展的存储中访问全部数据。
@grant GM_addValueChangeListener('hello',function(name, old_value, new_value, remote){ // 方法回调 });
                                                    添加对 gm_setvalue 的值进行监听，当值发生变化时，调用方法事件。
                                                    函数返回一个listener_id。
@grant GM_removeValueChangeListener(listener_id)	移除对 GM_setvalue 的值进行监听：GM_removeValueChangeListener(listener_id)
@grant GM_xmlhttprequest                            异步请求数据。

GM_xmlhttpRequest({
    url: "http://www.httpbin.org/post",
    method: 'POST',
    headers: {
            "content-type": "application/json"
      },
    data: {xxx},
    onerror: function(res){
        console.log(res);
    },
    onload: function(res){
        console.log(res);
    }
});

@grant GM_setclipboard(data, info)                  将数据复制到剪贴板中，第一个参数是要复制的数据，第二个参数是mime类型，
                                                    用于指定复制的数据类型。
@grant GM_log(xxx)                                  用于在控制台中打印日志，便于调试： GM_log("Hello World")
                                                    也可以使用原生的 console.log(xxx); 打印日志。
@grant GM_addStyle(css)                             向网页中指定元素(可以通过标签名,class样式,ID等选择)添加样式

示例一：GM_addStyle("#main_nav,.title_box-WbZs0QZH{display:none !important}");
  a、向指定id的元素，以及含有指定样式的元素添加css样式。
  b、多个选择器时用逗号隔开，多个style样式属性时用分号隔开。
  c、每一个css属性后面要跟一个 !important，表示添加的属性权限。

示例二：* 表示选择所有元素,如 GM_addStyle("* {margin-top:0px !important; margin-left:0px !important}");

示例三：GM_addStyle("div .logo {background-image: url('http://xxxxxx.jpg') !important}");
  a、为含有 .logo 样式的 div 元素设置背景图片(中间的空格表示层级)。

示例四：向页面添加自定义样式属性，然后使用 JQuery 的 hasClass、addClass、removeClass、toggleClass 方法操作目标元素的样式。
    GM_addStyle(".myClass {border: 3px dotted green;background-color: red;}");
    $("#main_nav").addClass("myClass");

示例五：将含有指定属性的div元素设置为不可见。
    GM_addStyle("div[align='center'],div[class='nav_bar wrap'] {display:none !important}");

@grant GM_notification(details, ondone)             设置网页通知/提示。或: GM_notification(text, title, image, onclick)
@grant window.close                                 关闭窗口
@grant window.focus                                 设置焦点
@grant GM_registerMenuCommand("name",function)      注册菜单命令，浏览器油猴插件展示脚本名称时，会携带此菜单，
                                                    方便用户做一些设置，而不用手动修改脚本。
@grant GM_openInTab(url, options)                   打开一个新的标签页面，类似 windown.open(url)。
                                                    url：指定打开的新 URL 地址；
                                                    options：指定页面展示方式及焦点停留页面。
                                                    GM_openInTab("https://www.baidu.com",{ active: true, setParent :true});
                                                    active:true，新标签页获取页面焦点
                                                    // setParent :true:新标签页面关闭后，焦点重新回到源页面
*/

GM_registerMenuCommand("Demo菜单1", function(){console.log("name1");}, "b");
GM_registerMenuCommand("Demo菜单2", function(){console.log("name2");}, "c");

(function() {
    'use strict';

    console.log("Hello World");

    let main = {
        init() {

            if (/(pan|yun).baidu.com/.test(location.host)) {
                console.log("baidu.com");
            }
        }
    };

    main.init();
})();