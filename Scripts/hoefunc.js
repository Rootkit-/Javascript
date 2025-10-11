function selectItemInDropdownList(selectElement, ov) {
	const optionToSelect = '' + ov
		const options = selectElement.getElementsByTagName('option')
		for (const optionEle of options) {
			if (optionToSelect === optionEle.innerText || optionToSelect === optionEle.value) {
				optionEle.selected = true
					return true
			}
		}
		return false
}
/*---------------------------------*/
/*---------------------------------*/
/*---------------------------------*/
/*---- Window View ETC ----*/
/*---------------------------------*/
function isElementInViewport(el) {
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */);
}
function getViewportOffsets($e) {
	var $window = $(window),
	scrollLeft = $window.scrollLeft(),
	scrollTop = $window.scrollTop(),
	offset = $e.offset(),
	rect1 = {
		x1: scrollLeft,
		y1: scrollTop,
		x2: scrollLeft + $window.width(),
		y2: scrollTop + $window.height()
	},
	rect2 = {
		x1: offset.left,
		y1: offset.top,
		x2: offset.left + $e.width(),
		y2: offset.top + $e.height()
	};
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
	if (typeof wn.scrollMaxY == 'number')
		return wn.scrollMaxY;
	var node = d.compatMode == 'BackCompat' ? d.body : d.documentElement;
	return node.scrollHeight
}
function getScrollc() {
	if (typeof wn.scrollMaxY == 'number')
		return wn.scrollMaxY;
	var node = d.compatMode == 'BackCompat' ? d.body : d.documentElement;
	return node.clientHeight;
}
function getScrollMaxY() {
	if (typeof wn.scrollMaxY == 'number')
		return wn.scrollMaxY;
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
		document.documentElement.clientHeight || 0);
}
/** Get current vertical scroll percentage*/
function _get_scroll_percentage() {
	return (
		(_get_window_Yscroll() + _get_window_height()) / _get_doc_height()) * 100;
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
	window.scrollTo(0, ot);
}
function timereload() {
	var currdate = Date.now();
	var reloaddate = currdate + 1800000
		var hidden = "hidden"
		var visibilityChange = "visibilitychange"
		var visibilityState = "visibilityState";
	var document_hidden = document[hidden];
	document.addEventListener(visibilityChange, function () {
		if (document_hidden != document[hidden]) {
			if (document[hidden]) {}
			else {
				if (Date.now() >= reloaddate) {
					topscroll()
				}
			}
			document_hidden = document[hidden];
		}
	});
}
function topscroll() {
	var obj = document.querySelector("body")
		var ot = findpos(obj);
	window.scrollTo(0, ot);
	setTimeout(location.reload(), 200);
}
function waitForElm(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}
		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				resolve(document.querySelector(selector));
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
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
var splitTest = function (str) {
    return str.split('\\').pop().split('/').pop();
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
		var substring = substrings[i]
			if (str.indexOf(substring) != -1) {
				return true;
			}
	}
	return false;
}
function containsAnyTrueLower(str, substrings) {
	for (var i = 0; i != substrings.length; i++) {
		var substring = substrings[i].toLowerCase();
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
			el.value = 'new text';
		}
		el.dispatchEvent(new Event('change', {
				bubbles: true
			}));
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
			el.value = 'new text';
		}
		el.dispatchEvent(new Event('change', {
				bubbles: true
			}));
	}
	return el;
}
function replaceCase(str, pattern, newStr) {
	const rx = new RegExp(pattern, "ig")
		const replacer = (c, i) => c.match(/[A-Z]/) ? newStr[i].toUpperCase() : newStr[i]
		return str.replace(rx, (oldStr) => oldStr.replace(/./g, replacer))
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
			button.style = floatstyle;
		return button
}
function CS(type, srcc, floatclass) {
	const script = document.createElement(type)
		if (type == 'link') {
			if (srcc !== undefined)
				script.href = srcc;
			script.rel = "stylesheet"
		} else {
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
		button.target = floattarg;
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
function extractHostname(url) {
	var hostname;
	if (url.indexOf("//") > -1) {
		hostname = url.split('/')[2];
	} else {
		hostname = url.split('/')[0];
	}
	hostname = hostname.split(':')[0];
	hostname = hostname.split('?')[0];
	validateDomain(hostname);
	return hostname;
}
function extractRootDomain(url) {
	var domain = extractHostname(url),
	splitArr = domain.split('.'),
	arrLen = splitArr.length;

	if (arrLen > 2) {
		domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
		if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
			domain = splitArr[arrLen - 3] + '.' + domain;
		}
	}
	validateDomain(domain);
	return domain;
}
const urlHostname = url => {
	try {
		return new URL(url).hostname;
	} catch (e) {
		return e;
	}
};

const validateDomain = s => {
	try {
		new URL("https://" + s);
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
};

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
localStorage.alertQueue = JSON.stringify([]);
localStorage.notifyProps = JSON.stringify({
	queue: {
		topRight: [],
		bottomRight: [],
		topCenter: [],
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
	notificationDiv.isTop = !position || !/low|bottom/i.test(position);
	notificationDiv.isRight = !position || !/left/i.test(position);
	notificationDiv.isCenter = (!/left/i.test(position) || !/right/i.test(position)) || false;

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

		notifStyle.innerText = ".hoecat-notif {" + "line-height:normal!important; font-family: sans-serif; font-weight: bold; background-color: rgba(0,0,0,0.4);  padding: 1px 5px 1px 5px ; border-radius: 5px ;  border: 1px solid rgba(255,255,255,0.4) ;font-size:" + (!size ? "1.5em" : size) + "px;" + "opacity: 0 ; position: fixed ; z-index: 9999 ;  color: white ;" + "-webkit-user-select: none ; -moz-user-select: none ; -ms-user-select: none ; user-select: none ;" + `transform: translateX(${!notificationDiv.isRight ? "-" : ""}35px) ;` + (shadow ? "box-shadow: -8px 13px 25px 0 " + (/\b(shadow|on)\b/gi.test(shadow) ? "gray" : shadow) : "") + "}" + ".notif-close-btn { cursor: pointer ; float: right ; position: relative ; right: -4px ; margin-left: -3px ;" + "display: grid }" + "@keyframes notif-zoom-fade-out { 0% { opacity: 1 ; transform: scale(1) }" + "15% { opacity: 0.35 ; transform: rotateX(-27deg) }" + "45% { opacity: 0.05 ; transform: rotateX(-81deg) }" + "100% { opacity: 0 ; transform: rotateX(-180deg)  }}"

	}
	let notifyProps = JSON.parse(localStorage.notifyProps);
	notifyProps.queue[notificationDiv.quadrant].push(notificationDiv.id);
	localStorage.notifyProps = JSON.stringify(notifyProps);
	notificationDiv.style.top = notificationDiv.isTop ? vpYoffset.toString() + "px" : "";
	notificationDiv.style.bottom = !notificationDiv.isTop ? vpYoffset.toString() + "px" : "";
	if (notificationDiv.isCenter) {
		notificationDiv.style.right = "50%"
	}
	if (notificationDiv.isRight) {
		notificationDiv.style.right = notificationDiv.isRight ? vpXoffset.toString() + "px" : "";
	}
	const thisQuadrantQueue = notifyProps.queue[notificationDiv.quadrant];
	if (thisQuadrantQueue.length > 1) {
		try {
			for (const divId of thisQuadrantQueue.slice(0, -1)) {
				const oldDiv = document.getElementById(divId),
				offsetProp = oldDiv.style.top ? "top" : "bottom",
				vOffset =  + /\d+/.exec(oldDiv.style[offsetProp])[0] + 5 + oldDiv.getBoundingClientRect().height;
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

function isDarkMode() {
	return document.documentElement.classList.toString().includes("dark")
}

function randomFloat() {
	const crypto = window.crypto || window.msCrypto;
	return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295
}

function GM_addStylez(css, realid) {
	const style = document.getElementById(realid) || (function () {
		const style = document.createElement('style');
		style.type = 'text/css';
		style.id = realid;
		document.head.appendChild(style);
		return style;
	})();
	const sheet = style.sheet;
	sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
function appendStyleToDocument(style, ida) {
	const styleNode = document.createElement("style");
	styleNode.type = "text/css";
	if (ida !== undefined) {
		styleNode.className = ida;
	}
	styleNode.textContent = style;
	document.head.append(styleNode);
};
