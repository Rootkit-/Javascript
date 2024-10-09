<!--Document start
/*
$(document).ready(function() {
}
*/
<!--Timeout-->
/*
setTimeout(function() {
}, 3000)
*/
<!--Parent Remove-->
/*waitForKeyElements ("div.thumb-under > p.metadata > span > span > a", blankifyLink);
Elements ("div.thumb-under > p.metadata > span > span:nth-child(3):href.indexOf('channels')", blankifyLink);
function blankifyLink (jNode) {
var tag = jNode.attr('href')
 if (tag.includes("/pornstar-channels/") || tag.includes("/channels/")) {
     jNode.parent().parent().parent().parent().parent().remove ();
 }
}
*/
<!--Checkbox-->
/*    var ischecked = $("input[id='category_filter_23'][value='23']").is(":checked");
    if (!ischecked) {
        $("input[id='category_filter_23'][value='23']").click();
        fixmages()
    } else {
        $("input[id='category_filter_23'][value='23']").click();
        setTimeout(function() {
            $("input[id='category_filter_23'][value='23']").click();
        }, 900)
        fixmages()
    }
*/
<!--Redirect-->
//var userss = /^https:\/\/www\.pornhub\.com\/users\/.*/
/*
var modelfinal = /^\/videos\/upload\?o\=mv/
if (userss.test(jNode[0].href) && !modelfinal.test(jNode[0].href)){
        jNode[0].href = jNode[0].href + '/videos/upload?o=mv'
}
*/
<!--Insert Before-->
/*
Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
}, false;

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;
var tagg= document.getElementsByClassName("tagsWrapper")[0];
tagg.appendBefore(document.getElementsByClassName("video-actions-container")[0]);
*/

//unbind 
.unbind('mouseout');


    
//click button
waitForKeyElements ("", blankifyLink);

function blankifyLink (jNode) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
	//$("input[id='category_filter_23'][value='23']").click();
}


//float button
(function() {
    'use strict';
    const button1 = addFloatButton('View', '&sort' ,'=views' ,'nil')
    const button2 = addFloatButton('720p', '&quality' , '=hd', '=1080P')
    const button3 = addFloatButton('1080P', '&quality', '=1080P', '=hd')
    const button4 = addFloatButton('Month', '&datef', '=month', '=week')
    const button5 = addFloatButton('Week', '&datef', '=week', '=month')

    document.querySelector("#__next > main > div > section.ipc-page-background.ipc-page-background--base.MainDetailPageLayout__StyledPageBackground-sc-13rp3wh-0.hsughJ > div > section > div > div.BTFWrapper__MainColumnContent-sc-1g8jgrg-1.fKIzsM.ipc-page-grid__item.ipc-page-grid__item--span-2 > section:nth-child(23)")
    function addFloatButton (text, type, amount, otha) {
        if (!document.addFloatButton) {
            const buttonContainer = document.body.appendChild(document.createElement('div')).attachShadow({ mode: 'open' })
            buttonContainer.innerHTML = '<style>:host{position:fixed;top:20%;left:1%;z-index:2147483647;height:0}#i{display:none}.on{border-color:#00ff29;}*{margin-bottom: 6%;float:left;float-offset:3em;margin:1px;padding:.5em;outline:0;border:0;border-radius:5px;background:#000;border: 2px solid black;border-color: #f00;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:20px;line-height:0;transition:.3s}:active{background:#696969;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}</style><input id="i" type="checkbox">'
            document.addFloatButton = (text, type, amount, otha) => {
                const button = document.createElement('button')
                button.textContent = text
                var url = window.location.href
                var urls = window.location.href
                var final, sadd
                button.style = "clear: left"
                var sads = urls.search(type + otha)

                var sad = url.search(type + amount)
                if (sad == -1) {
                  if (sads != -1) {
                        sadd = url.replace(otha,amount)
                    } else {
                        sadd = url + type + amount
                    }
                } else {
                    button.className = 'on'
                    sadd = url.replace(type + amount, '');
                }

                button.addEventListener('click', function(){ window.location.href = sadd })
                return buttonContainer.appendChild(button)
            }
        }
        return document.addFloatButton(text, type, amount, otha)
    }
})();