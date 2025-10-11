
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
