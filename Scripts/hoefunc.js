
function selectItemInDropdownList(selectElement, ov) {
  const optionToSelect = '' + ov
  const options = selectElement.getElementsByTagName('option')
  for (const optionEle of options) {
    if (optionToSelect === optionEle.innerText || optionToSelect === optionEle.value) {
      optionEle.selected = true // selects this option
      return true
    }
  }
  return false // failed
}
/*---------------------------------*/
/*---------------------------------*/
/*---- Window View ETC ----*/
/*---------------------------------*/
function isElementInViewport (el) {

	// Special bonus for those using jQuery
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}

	var rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
	);
}
function getViewportOffsets($e) {
  var $window = $(window),
    scrollLeft = $window.scrollLeft(),
    scrollTop = $window.scrollTop(),
    offset = $e.offset(),
    rect1 = { x1: scrollLeft, y1: scrollTop, x2: scrollLeft + $window.width(), y2: scrollTop + $window.height() },
    rect2 = { x1: offset.left, y1: offset.top, x2: offset.left + $e.width(), y2: offset.top + $e.height() };
  return {
    left: offset.left - scrollLeft,
    top: offset.top - scrollTop,
    insideViewport: rect1.x1 < rect2.x2 && rect1.x2 > rect2.x1 && rect1.y1 < rect2.y2 && rect1.y2 > rect2.y1
  };
}

function checkScrollDirectionIsUp(event) {
	if (event.wheelDelta) {
		return event.wheelDelta > 0;
	}
	return event.deltaY < 0;
}

function getScrollh() {
	if(typeof wn.scrollMaxY == 'number') return wn.scrollMaxY;

	var node = d.compatMode == 'BackCompat' ? d.body : d.documentElement;
	return node.scrollHeight
}
function getScrollc() {
	if(typeof wn.scrollMaxY == 'number') return wn.scrollMaxY;

	var node = d.compatMode == 'BackCompat' ? d.body : d.documentElement;
	return node.clientHeight;

}
function getScrollMaxY() {
	if(typeof wn.scrollMaxY == 'number') return wn.scrollMaxY;

	var node = d.compatMode == 'BackCompat' ? d.body : d.documentElement;
	return node.scrollHeight - node.clientHeight;

}
function checkVisible(elm) {
	var rect = elm.getBoundingClientRect();
	var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function _get_window_height() {
	return window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight || 0;
}

/** Get current absolute window scroll position */
function _get_window_Yscroll() {
	return window.pageYOffset ||
		document.body.scrollTop ||
		document.documentElement.scrollTop || 0;
}

/** Get current absolute document height */
function _get_doc_height() {
	return Math.max(
		document.body.scrollHeight || 0,
		document.documentElement.scrollHeight || 0,
		document.body.offsetHeight || 0,
		document.documentElement.offsetHeight || 0,
		document.body.clientHeight || 0,
		document.documentElement.clientHeight || 0
	);
}

/** Get current vertical scroll percentage*/
function _get_scroll_percentage() {
	return (
		(_get_window_Yscroll() + _get_window_height()) / _get_doc_height()
	) * 100;
}



/*---------------------------------*/
/*--------    Scroll     -----------*/
/*---------------------------------*/
function findpos(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return curtop;
	}
}
function GoTo(obj) {
	var ot = findpos(obj);
	//window.scrollTo(0,ot-75);
	window.scrollTo(0, ot);
}
function timereload() {
	var currdate = Date.now();
	var reloaddate = currdate + 1800000

	var hidden = "hidden"
	var visibilityChange = "visibilitychange"
	var visibilityState = "visibilityState";

	var document_hidden = document[hidden];

	document.addEventListener(visibilityChange, function() {
		if(document_hidden != document[hidden]) {
			if(document[hidden]) {
				// Document hidden
			} else {
				if( Date.now() >= reloaddate){
					topscroll()
				}
			}

			document_hidden = document[hidden];
		}
	});
}
function topscroll () {
	var obj = document.querySelector("body")
	var ot = findpos(obj);
	window.scrollTo(0,ot);
	setTimeout(location.reload(), 200);
}
function removeThis(jNode) {
	jNode.remove()
}

function qs(c, s) {
	if (s) {
		return c.querySelector(s)
	} else {
		return document.querySelector(c)
	}
}

function qsa(c, s) {
	if (s) {
		return c.querySelectorAll(s)
	} else {
		return document.querySelectorAll(c)
	}
}

function clickz(obj) {
	triggerEvent(obj, "popstate");
	triggerEvent(obj, "focus");
	triggerEvent(obj, "touchstart");
	triggerEvent(obj, "click");
}

function copyToClipboard(inputname) {
	navigator.clipboard.writeText(inputname)
}

function qsit(selector, text) {
	return Array.from(document.querySelectorAll(selector))
	.find(el => el.textContent.includes(text));
}

function containsAnyString(str, substrings) {
	for (var i = 0; i != substrings.length; i++) {
		var substring = substrings[i];
		if (str.indexOf(substring) != -1) {
			return substring;
		}
	}
	return null;
}


function containsAnyStringLower(str, substrings) {
	for (var i = 0; i != substrings.length; i++) {
		var substring = substrings[i].toLowerCase()
			if (str.indexOf(substring) != -1) {
				return substring;
			}
	}
	return null;
}
function equalsAnyStringLower(str, substrings) {
	for (var i = 0; i != substrings.length; i++) {
		var substring = substrings[i].toLowerCase()
			if (str == substring) {
				return true;
			}
	}
	return null;
}
function containsAnyTrue(str, substrings) {
	for (var i = 0; i != substrings.length; i++) {
		var substring = substrings[i];
		if (str.indexOf(substring) != -1) {
			return true;
		}
	}
	return false;
}
	
function triggerEvent(node, eventType) {
	var clickEvent = document.createEvent('MouseEvents');
	clickEvent.initEvent(eventType, true, true);
	node.dispatchEvent(clickEvent);
}
function replaceValS(selector, value) {
	const el = selector
	console.log("replaceValue");
	if (el) {
		el.focus();
		el.select();
		if (!document.execCommand('insertText', false, value)) {
			// Fallback for Firefox: just replace the value
			el.value = 'new text';
		}
		el.dispatchEvent(new Event('change', {
				bubbles: true
			})); // usually not needed
	}
	return el;
}
function replaceVal(selector, value) {
	const el = document.querySelector(selector);
	console.log("replaceValue");
	if (el) {
		el.focus();
		el.select();
		if (!document.execCommand('insertText', false, value)) {
			// Fallback for Firefox: just replace the value
			el.value = 'new text';
		}
		el.dispatchEvent(new Event('change', {
				bubbles: true
			})); // usually not needed
	}
	return el;
}
function getDomain(url) {
	var result
	var match
	if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
		result = match[1]
		if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
			result = match[1]
		}
	}
	return result
}
function getPageFromUrl(url) {
	const match = url.match(/(?:\/page\/|[?&]p=|[?&]page=|page-)([1-9]\d*)/)
		if (match) {
			return Number(match[1]);
		}
		return 1;
}

function getString(url, regg) {
	const match = url.match(regg)
		if (match) {
			return match[1]
		}
		return null
}

function CE(type, text, floatclass, floatid, floatstyle) {
	const button = document.createElement(type)
		if (text !== undefined)
			button.textContent = text;
		if (floatclass !== undefined)
			button.className = floatclass;
		if (floatid !== undefined)
			button.id = floatid;
		if (floatstyle !== undefined)
			button.style = floatstyle; //button.style = "clear: left"
		return button
}
function CS(type, srcc, floatclass) {
	const script = document.createElement(type)
		if(type == 'link'){
			if (srcc !== undefined)
				script.href = srcc;
			script.rel="stylesheet"
		} else{
			if (srcc !== undefined)
				script.src = srcc;
		}
		if (floatclass !== undefined)
			script.className = floatclass;
		return script
}
function CA(text, floathref, floatclass, floatid, floatstyle, floattarg) {
	const button = document.createElement('a')
		if (text !== undefined)
			button.textContent = text;
		if (floatclass !== undefined)
			button.className = floatclass;
		if (floatid !== undefined)
			button.id = floatid;
		if (floatstyle !== undefined);
		button.style = floatstyle;
	if (floathref !== undefined)
		button.href = floathref;
	if (floattarg !== undefined)
		button.target = floattarg; //button.style = "clear: left"
	return button
}

function addFloatButtonss(text, floatclass, floatid, floatstyle) {
	const button = document.createElement('button')
		if (text !== undefined)
			button.textContent = text;
		if (floatclass !== undefined)
			button.className = floatclass;
		if (floatid !== undefined)
			button.id = floatid;
		if (floatstyle !== undefined)
			button.style = floatstyle;
		//button.style = "clear: left"
		return button
}

function CreateLinkButton(namer, linker, noder) {
	const akkk = document.createElement("div");
	akkk.className = 'nav-linker'
		akkk.innerHTML = '<a class="linker" href="' + linker + '">' + namer + '</a>'
		noder.append(akkk)
}

function waitforclickthis(test) {
	waitForKeyElements(test, sexyclick)

	function sexyclick(jNode) {
		jNode.click()
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initEvent('click', true, true);
		jNode[0].dispatchEvent(clickEvent);
	}
}

function ClickThis(jNode) {
	// jNode.click()
	var clickEvent = document.createEvent('MouseEvents');
	clickEvent.initEvent('click', true, true);
	jNode[0].dispatchEvent(clickEvent);
}

function getInnermostHover() {
	var n = document.querySelector(":hover");
	var nn;
	while (n) {
		nn = n;
		n = nn.querySelector(":hover");
	}
	return nn
}
Element.prototype.appendBefore = function (element) {
	element.parentNode.insertBefore(this, element);
}, false;

Element.prototype.appendAfter = function (element) {
	element.parentNode.insertBefore(this, element.nextSibling);
}, false;

function RecursiveUnbind($jElement) {
	$jElement.unbind();
	$jElement.removeAttr('onclick');
	$jElement.children().each(function () {
		RecursiveUnbind($(this));
	});
}

function saveData() {
	var asdasd = document.createElement("a");
	document.body.appendChild(asdasd);
	asdasd.style = "display: none";
	return function (data, fileName) {
		var blob = new Blob([data], {
			type: "octet/stream"
		});
		var url = window.URL.createObjectURL(blob);
		asdasd.href = url;
		asdasd.download = fileName;
		asdasd.click();
		window.URL.revokeObjectURL(url);
	};
}
const isChromeUserScript = navigator.userAgent.includes("Chrome") && typeof unsafeWindow != "undefined",
    isFFuserScript = navigator.userAgent.includes("Firefox") && typeof unsafeWindow != "undefined",
    isFFtmScript = isFFuserScript && GM_info.scriptHandler == "Tampermonkey";
	
localStorage.alertQueue = JSON.stringify([]);
localStorage.notifyProps = JSON.stringify({
    queue: {
        topRight: [],
        bottomRight: [],
        bottomLeft: [],
        topLeft: []
    },
    lastNthAudio: 0
});
async function notify(msg, position, size, notifDuration) {
	let cjsMessages;
	notifDuration = notifDuration ? +notifDuration : 1.75;
	const fadeDuration = .3,
		  vpYoffset = 23,
		  vpXoffset = 27;
	var shadow = true
	const notificationDiv = document.createElement("div");
	notificationDiv.id = Math.floor(randomFloat() * 1e6) + Date.now();
	notificationDiv.classList.add("hoecat-notif");
	notificationDiv.innerText = msg;
	document.body.append(notificationDiv);
	/*const notificationpic = document.createElement("img");
	notificationpic.classList.add("hoecat-notif-img");
	notificationpic.style = 'max-height:30px;width:auto;height: inherit;object-fit: contain;vertical-align: middle;opacity: 0.4'
	notificationpic.src ="https://raw.githubusercontent.com/Rootkit-/sounds/main/images/cat.png";
	notificationDiv.append(notificationpic);
	const notificationspan = document.createElement("span");
	notificationspan.classList.add("hoecat-notif-span");
	notificationspan.style = 'opacity: 1;color:white;margin-top:5px;'
	notificationspan.innerText = msg;
	notificationDiv.append(notificationspan);
	const closeBtn = document.createElement("div");
	closeBtn.title = cjsMessages?.tooltip_dismiss || "Dismiss";
	closeBtn.classList.add("notif-close-btn");
	const closeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	closeSVG.setAttribute("height", "8px");
	closeSVG.setAttribute("viewBox", "0 0 14 14");
	closeSVG.setAttribute("fill", "none");
	closeSVG.style.height = closeSVG.style.width = "8px";
	const closeSVGpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	closeSVGpath.setAttribute("fill-rule", "evenodd");
	closeSVGpath.setAttribute("clip-rule", "evenodd");
	closeSVGpath.setAttribute("fill", "white");	}
	
	closeSVGpath.setAttribute("d", "M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976312 12.6834 -0.0976312 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976312 0.683417 -0.0976312 0.292893 0.292893C-0.0976312 0.683417 -0.0976312 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976312 12.6834 -0.0976312 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z");
	closeSVG.append(closeSVGpath);
	closeBtn.append(closeSVG);
	notificationDiv.append(closeBtn);*/
	notificationDiv.isTop = !position || !/low|bottom/i.test(position);
	notificationDiv.isRight = !position || !/left/i.test(position);
	notificationDiv.quadrant = (notificationDiv.isTop ? "top" : "bottom") + (notificationDiv.isRight ? "Right" : "Left");
	const thisUpdated = 20231110;
	let notifStyle = document.querySelector("#hoecat-notif-style");
	if (!notifStyle || parseInt(notifStyle.getAttribute("last-updated"), 10) < thisUpdated) {
		if (!notifStyle) {
			notifStyle = document.createElement("style");
			notifStyle.id = "hoecat-notif-style";
			notifStyle.setAttribute("last-updated", thisUpdated.toString());
			document.head.append(notifStyle)
		}
			notifStyle.innerText = ".hoecat-notif {" + "font-family: sans-serif; font-weight: bold; background-color: rgba(0,0,0,0.4);  padding: 5px 5px 5px 5px ; border-radius: 5px ;  border: 1px solid rgba(255,255,255,0.4) ;font-size:" + size +"px;" + "opacity: 0 ; position: fixed ; z-index: 9999 ; font-size: 1.8rem ; color: white ;" + "-webkit-user-select: none ; -moz-user-select: none ; -ms-user-select: none ; user-select: none ;" + `transform: translateX(${!notificationDiv.isRight?"-":""}35px) ;` + (shadow ? "box-shadow: -8px 13px 25px 0 " + (/\b(shadow|on)\b/gi.test(shadow) ? "gray" : shadow) : "") + "}" + ".notif-close-btn { cursor: pointer ; float: right ; position: relative ; right: -4px ; margin-left: -3px ;" + "display: grid }" + "@keyframes notif-zoom-fade-out { 0% { opacity: 1 ; transform: scale(1) }" + "15% { opacity: 0.35 ; transform: rotateX(-27deg) scale(1.05) }" + "45% { opacity: 0.05 ; transform: rotateX(-81deg) }" + "100% { opacity: 0 ; transform: rotateX(-180deg) scale(1.15) }}"
	}
	//notifStyle.innerText = ".hoecat-notif {" + "font-family: sans-serif; font-weight: bold; background-color: rgba(0,0,0,0.4); padding: 5px 5px 5px 5px;border-radius: 5px ; border: 1px solid rgba(255,255,255,0.4) ;" + "opacity:0 ; position: fixed ; z-index: 9999 ; font-size:" + size +"px; color: white ;" + "-webkit-user-select: none ; -moz-user-select: none ; -ms-user-select: none ; user-select: none ;" + `transform: translateX(${!notificationDiv.isRight?"-":""}35px) ;`  + ".notif-close-btn { cursor: pointer ; float: right ; top: -7px; position: relative ; right: -7px ; margin-left: -3px ;" + "display: grid }" + "@keyframes notif-zoom-fade-out { 0% { opacity: 1 ; transform: scale(1) }" + "15% { opacity: 0.35 ; transform: rotateX(-27deg) scale(1.05) }" + "45% { opacity: 0.05 ; transform: rotateX(-81deg) }" + "100% { opacity: 0 ; transform: rotateX(-180deg) scale(1.15) }}"
	//notifStyle.innerText = ".hoecat-notif {" + "font-family: sans-serif; font-weight: bold;height:fit-content; padding: 5px 8px 5px 8px;opacity: 1 ; position: fixed ; z-index: 9999 ; font-size:" + size +"px; color: white ;" + "-webkit-user-select: none ; -moz-user-select: none ; -ms-user-select: none ; user-select: none ;" + `transform: translateX(${!notificationDiv.isRight?"-":""}35px) ;`  + ".notif-close-btn { cursor: pointer ; float: right ; position: relative ; right: -4px ; margin-left: -3px ;" + "display: grid }" + "@keyframes notif-zoom-fade-out { 0% { opacity: 1 ; transform: scale(1) }" + "15% { opacity: 0.35 ; transform: rotateX(-27deg) scale(1.05) }" + "45% { opacity: 0.05 ; transform: rotateX(-81deg) }" + "100% { opacity: 0 ; transform: rotateX(-180deg) scale(1.15) }}"
	let notifyProps = JSON.parse(localStorage.notifyProps);
	notifyProps.queue[notificationDiv.quadrant].push(notificationDiv.id);
	localStorage.notifyProps = JSON.stringify(notifyProps);
	notificationDiv.style.top = notificationDiv.isTop ? vpYoffset.toString() + "px" : "";
	notificationDiv.style.bottom = !notificationDiv.isTop ? vpYoffset.toString() + "px" : "";
	notificationDiv.style.right = notificationDiv.isRight ? vpXoffset.toString() + "px" : "";
	notificationDiv.style.left = !notificationDiv.isRight ? vpXoffset.toString() + "px" : "";
	const thisQuadrantQueue = notifyProps.queue[notificationDiv.quadrant];
	if (thisQuadrantQueue.length > 1) {
		try {
			for (const divId of thisQuadrantQueue.slice(0, -1)) {
				const oldDiv = document.getElementById(divId),
					  offsetProp = oldDiv.style.top ? "top" : "bottom",
					  vOffset = +/\d+/.exec(oldDiv.style[offsetProp])[0] + 5 + oldDiv.getBoundingClientRect().height;
				oldDiv.style[offsetProp] = `${vOffset}px`
                }
			} catch (err) {}
		}
	   setTimeout(() => {
		   notificationDiv.style.opacity = 1
		   notificationDiv.style.transform = "translateX(0)";
		   notificationDiv.style.transition = "transform 0.15s ease, opacity 0.15s ease"
	   }, 10);
	   const hideDelay = fadeDuration > notifDuration ? 0 : notifDuration - fadeDuration;
	   const dismissNotif = () => {
		   notificationDiv.style.animation = `notif-zoom-fade-out ${fadeDuration}s ease-out`;
		   clearTimeout(dismissFuncTID);
	   };
	   const dismissFuncTID = setTimeout(dismissNotif, hideDelay * 1e3);
	  /* notificationDiv.addEventListener("click", () => {
		   clearTimeout(dismissFuncTID);
		   notificationDiv.remove();
		   notifyProps = JSON.parse(localStorage.notifyProps);
		   notifyProps.queue[notificationDiv.quadrant].shift();
		   localStorage.notifyProps = JSON.stringify(notifyProps)
	   }, {
		   once: true
	  })*/
	   notificationDiv.addEventListener("click", dismissNotif, {
		   once: true
	   });
	   notificationDiv.addEventListener("animationend", () => {
		   notificationDiv.remove();
		   notifyProps = JSON.parse(localStorage.notifyProps);
		   notifyProps.queue[notificationDiv.quadrant].shift();
		   localStorage.notifyProps = JSON.stringify(notifyProps)
	   }, {
		   once: true
	   })
   }
    function isDarkMode(){
        return document.documentElement.classList.toString().includes("dark")
    }
    function randomFloat() {
        const crypto = window.crypto || window.msCrypto;
        return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295
    }

function appendStyleToDocument(style) {
	const styleNode = document.createElement("style");
	styleNode.type = "text/css";
	styleNode.textContent = style;
	document.head.append(styleNode);
};
/*
var saveData = (function () {
var asdasd = document.createElement("a");
document.body.appendChild(asdasd);
asdasd.style = "display: none";
return function (data, fileName) {
var blob = new Blob([data], {type: "octet/stream"});
var url = window.URL.createObjectURL(blob);
asdasd.href = url;
asdasd.download = fileName;
asdasd.click();
window.URL.revokeObjectURL(url);
};
}());



const floatstyle =  `
#myContainer{
width:75px;
position: fixed;
top: 10%;
left: 6.5%;
z-index: 2147483647;
height: 0
}


#myButton:hover {
background: rgb(75, 75, 75);
}

#myButton {
width:100%;
float: left;
float-offset: 3em;
margin: 1px;
padding: 7px;
outline: 0;
border-radius: 5px;
background: #000;
border: 2px solid black;
border-color: #f00;
box-shadow: 0 1px 4px rgba(0, 0, 0, .1);
color: #fff;
font-size: 20px;
line-height: 10px;
transition: .3s
}

#myButton:active {
background: #696969;
box-shadow: 0 2px 5px rgba(0, 0, 0, .2)
}

#myButton:active {
transition: 0s
}

.plus-button-isOn {
border-color:rgb(230, 0, 230)!important
}
.plus-button-isOff{
border-color:rgb(0, 0, 0)!important
}
.FilterByTag {
margin: unset;
width:unset;
}
.tagList {
width:unset;
}
#myButtons {
width:100%;
float: left;
float-offset: 3em;
margin: 1px;
padding: 7px;
outline: 0;
border-radius: 5px;
background: #000;
border: 2px solid black;
border-color: #f00;
box-shadow: 0 1px 4px rgba(0, 0, 0, .1);
color: #fff;
font-size: 20px;
line-height: 10px;
transition: .3s
}

#myButtons:active {
background: #696969;
box-shadow: 0 2px 5px rgba(0, 0, 0, .2)
}

#myButtons:active {
transition: 0s
}
`*/
