/**
 * @class SettingsManager
 * @description Handles persistence and state without any UI dependencies.
 */
class SettingsManager {
    /**
     * @param {string} prefix - GM storage prefix.
     * @param {Array<Object>} schema - The settings definition.
     */
    constructor(prefix, schema) {
        this.prefix = prefix;
        this.schema = schema;
        this.config = {};
        this._init();
    }

    /** @private */
    _init() {
        this.schema.forEach(item => {
            const val = GM_getValue(`${this.prefix}_${item.key}`, item.default);
            this.config[item.key] = val;
        });
    }

    /**
     * @param {string} key 
     * @param {*} val 
     * @param {Function} [onUpdate] - Internal hook for the MenuManager to refresh UI.
     */
    save(key, val, onUpdate) {
        GM_setValue(`${this.prefix}_${key}`, val);
        this.config[key] = val;
        
        const item = this.schema.find(i => i.key === key);
        if (item?.onChange) item.onChange(val, this.config);
        if (onUpdate) onUpdate();
    }
}

/**
 * @class MenuManager
 * @description Optional UI layer that attaches to a SettingsManager.
 */
class MenuManager {
    /**
     * @param {SettingsManager} settingsInstance 
     */
    constructor(settingsInstance) {
        this.settings = settingsInstance;
        this.menuIDs = [];
        this.symbols = { toggle: ['✔️', '❌'], config: '⚙️' };
        this.render();
    }

    render() {
        this.menuIDs.forEach(id => GM_unregisterMenuCommand(id));
        this.menuIDs = [];

        this.settings.schema.forEach(item => {
			if (item.type === undefined || item.type === null) return;
            const val = this.settings.config[item.key];
            const label = item.type === 'prompt' 
                ? `${this.symbols.config} ${item.label}: ${val}`
                : `${val ? this.symbols.toggle[0] : this.symbols.toggle[1]} ${item.label}`;

            const id = GM_registerMenuCommand(label, () => {
                let next = !val;
                if (item.type === 'prompt') {
                    const res = prompt(`Enter ${item.label}`, val);
                    if (res === null) return;
                    next = res;
                }
                // Save and trigger a re-render of this menu
                this.settings.save(item.key, next, () => this.render());
            });
            this.menuIDs.push(id);
        });
    }
}
/**
 * @function initAudioBuffer
 * @description Creates a persistent audio element, unlocks it for autoplay, and returns it for later use.
 * @param {string} resourceName - The name defined in your @resource metadata.
 * @param {string} type - The MIME type (e.g., 'audio/mpeg').
 * @param {number} [vol=0.5] - Default volume level.
 * @returns {HTMLAudioElement} The persistent audio element.
 */
function AutoPlay(resourceName, type, vol = 1) {
    const a = document.createElement("audio");
    a.className = 'my_audio'
	a.dataset.name= resourceName
    a.style.display = "none"; // Ensure it doesn't affect layout
    
    const src = getFixedResource(resourceName, type);
    if (!src) {
        console.error(`%c Audio Error: Resource "${resourceName}" missing!`, 'color: red;');
        return a;
    }

    a.innerHTML = `<source src="${src}" type="${type}">`;
    a.volume = vol;
    a.autoplay = false;
    a.muted = true;

    document.body.appendChild(a);
    a.play().then(() => {
        setTimeout(() => {
            a.pause();
            a.currentTime = 0;
            a.muted = false;
            console.log(`%c Audio Buffer "${resourceName}" Ready`, 'color: green;');
        }, 100);
    }).catch(e => {
        console.error(`%c Autoplay Blocked: ${resourceName} needs interaction.`, 'color: orange;');
    });

    return a;
}
/**
 * Checks if an element is entirely within the visual viewport.
 * Supports both vanilla DOM elements and jQuery objects.
 * @param {HTMLElement|jQuery} el - The element to check.
 * @returns {boolean} True if the element is fully visible.
 */
const isElementInViewport = (el) => {
    // Unwrap jQuery object if detected
    const element = (typeof jQuery === "function" && el instanceof jQuery) ? el[0] : el;

    // Safety check to ensure we have a valid DOM element
    if (!element || typeof element.getBoundingClientRect !== "function") {
        return false;
    }

    const { top, left, bottom, right } = element.getBoundingClientRect();
    const vHeight = window.innerHeight || document.documentElement.clientHeight;
    const vWidth = window.innerWidth || document.documentElement.clientWidth;

    return top >= 0 && left >= 0 && bottom <= vHeight && right <= vWidth;
};

/**
 * Calculates offsets and visibility status using modern rect logic.
 * @param {HTMLElement} el - The DOM element.
 * @returns {{left: number, top: number, insideViewport: boolean}}
 */
const getViewportOffsets = (el) => {
	const rect = el.getBoundingClientRect();
	const { top, left, bottom, right } = rect;
	const { innerHeight, innerWidth } = window;

	return {
		left,
		top,
		insideViewport: top < innerHeight && bottom > 0 && left < innerWidth && right > 0,
	};
};

/**
 * Normalizes scroll delta to determine if the user is scrolling up.
 * @param {WheelEvent} event - The wheel/scroll event.
 * @returns {boolean} True if scrolling up.
 */
const checkScrollDirectionIsUp = ({
	deltaY
}) => deltaY < 0;

/**
 * Returns the total scrollable height of the document.
 * @returns {number} Total height in pixels.
 */
const getScrollh = () => document.documentElement.scrollHeight;

/**
 * Returns the visible height of the document (viewport).
 * @returns {number} Client height in pixels.
 */
const getScrollc = () => document.documentElement.clientHeight;

/**
 * Calculates the maximum possible Y scroll value.
 * @returns {number} Max scrollable pixels.
 */
const getScrollMaxY = () => {
	const { scrollHeight, clientHeight } = document.documentElement;
	return scrollHeight - clientHeight;
};

/**
 * Checks if any part of the element is visible in the viewport.
 * @param {HTMLElement} elm - The DOM element.
 * @returns {boolean} True if partially visible.
 */
const checkVisible = (elm) => {
	const { top, bottom } = elm.getBoundingClientRect();
	const vHeight = window.innerHeight || document.documentElement.clientHeight;
	return !(bottom < 0 || top - vHeight >= 0);
};

/**
 * Gets the current viewport height.
 * @returns {number}
 */
const _get_window_height = () => window.innerHeight || document.documentElement.clientHeight;

/**
 * Gets the current vertical scroll position.
 * @returns {number}
 */
const _get_window_Yscroll = () => window.scrollY || window.pageYOffset;

/**
 * Gets the total document height across various browser implementations.
 * @returns {number}
 */
const _get_doc_height = () => {
	const { body, documentElement: html } = document;
	return Math.max(
		body.scrollHeight, html.scrollHeight,
		body.offsetHeight, html.offsetHeight,
		body.clientHeight, html.clientHeight);
};

/**
 * Calculates the current scroll progress as a percentage.
 * @returns {number} Percentage (0-100).
 */
const _get_scroll_percentage = () => {
	const scrollPos = _get_window_Yscroll() + _get_window_height();
	const totalHeight = _get_doc_height();
	return (scrollPos / totalHeight) * 100;
};

/**
 * Finds the absolute top position of an element relative to the document.
 * @param {HTMLElement} obj - The target element.
 * @returns {number} Vertical position in pixels.
 */
const findpos = (obj) => {
	const rect = obj.getBoundingClientRect();
	return rect.top + _get_window_Yscroll();
};

/**
 * Smoothly scrolls the window to a specific element.
 * @param {HTMLElement} obj - The target element.
 */
const GoTo = (obj) => {
	const top = findpos(obj);
	window.scrollTo({
		top,
		behavior: 'instant'
	});
};
/**
 * Scrolls the document body to the top and reloads the page.
 * Uses smooth scrolling and modern event loop handling.
 * @returns {void}
 */
const topscroll = () => {
	const body = document.querySelector("body");
	// Logic: findpos was undefined in source; defaulting to body top (0)
	// scrollTo with behavior: 'smooth' provides better UX
	window.scrollTo({
		top: 0,
		behavior: "instant"
	});

	// Use an arrow function in setTimeout to prevent immediate execution
	setTimeout(() => location.reload(), 200);
};

/**
 * Selects an item in a dropdown by value or text using a high-speed Set for lookup.
 * @param {HTMLSelectElement} selectElement - The select DOM element.
 * @param {string|number} ov - The value or text to match.
 * @returns {boolean} - Returns true if an item was found and selected.
 */
const selectItemInDropdownList = (selectElement, ov) => {
	if (!selectElement)
		return false;

	const target = String(ov);
	const options = Array.from(selectElement.options);

	const match = options.find(opt => opt.value === target || opt.text === target);

	if (match) {
		match.selected = true;
		return true;
	}
	return false;
};

/**
 * Sets up a listener to reload the page if the user returns to the tab
 * after a specified interval (default 30 mins).
 * @param {number} [intervalMs=1800000] - Interval in milliseconds.
 * @returns {void}
 */
const timereload = (intervalMs = 1800000) => {
	let reloadTimestamp = Date.now() + intervalMs;

	document.addEventListener("visibilitychange", () => {
		// Logic: Only check if the page is becoming visible
		if (document.visibilityState === "visible") {
			if (Date.now() >= reloadTimestamp) {
				topscroll();
			}
		}
	});
};

/**
 * Removes a specific node from the DOM.
 * @param {Element} jNode - The DOM element to remove.
 * @returns {void}
 */
const removeThis = (jNode) => jNode?.remove?.();

/**
 * Enhanced Query Selector.
 * @param {ParentNode|string} scopeOrSelector - The element to search within OR the selector string.
 * @param {string} [selector] - The selector string if a scope is provided.
 * @returns {Element|null}
 */
const qs = (scopeOrSelector, selector) => {
	const [parent, query] = selector
		 ? [scopeOrSelector, selector]
		 : [document, scopeOrSelector];
	return parent.querySelector(query);
};

/**
 * Enhanced Query Selector All (Returns Array instead of NodeList).
 * @param {ParentNode|string} scopeOrSelector - The element to search within OR the selector string.
 * @param {string} [selector] - The selector string if a scope is provided.
 * @returns {Element[]}
 */
const qsa = (scopeOrSelector, selector) => {
	const [parent, query] = selector
		 ? [scopeOrSelector, selector]
		 : [document, scopeOrSelector];
	return [...parent.querySelectorAll(query)];
};

/**
 * Extracts the filename from a Windows or Unix path.
 * @param {string} str - The path string.
 * @returns {string}
 */
const splitTest = function (str) {
	return str.split("\\").pop().split("/").pop();
};
/**
 * Dispatches a sequence of events to a target object using Promise.allSettled
 * to ensure all attempts are made regardless of individual event failures.
 * @param {HTMLElement} obj - The target element.
 * @returns {Promise<void>}
 */
const clickz = async(obj) => {
	if (!obj)
		return;

	const events = ["popstate", "focus", "touchstart", "click"];

	const triggers = events.map(type => {
		return new Promise((resolve) => {
			const event = new Event(type, {
				bubbles: true,
				cancelable: true
			});
			obj.dispatchEvent(event);
			resolve(type);
		});
	});

	await Promise.allSettled(triggers);
};

/**
 * Copies text to the system clipboard.
 * @param {string} text - The string to copy.
 * @returns {Promise<void>}
 */
const copyToClipboard = async(text) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error("Clipboard access denied", err);
	}
};

/**
 * Finds an element by selector that contains specific text.
 * @param {string} selector - CSS selector.
 * @param {string} text - Text to match.
 * @returns {Element|undefined}
 */
const qsit = (selector, text) => {
	return qsa(selector).find(el => el.textContent.includes(text));
};

function triggerEvent(node, eventType) {
	var clickEvent = document.createEvent("MouseEvents");
	clickEvent.initEvent(eventType, true, true);
	node.dispatchEvent(clickEvent);
}

/**
 * Replaces the value of an element and triggers the change event.
 * Uses modern Assignment and Event constructors.
 * * @param {HTMLElement|string} target - The DOM element or a CSS selector.
 * @param {string} value - The new value to set.
 * @returns {HTMLElement|null}
 */
const replaceVal = (target, value) => {
	const el = typeof target === 'string' ? document.querySelector(target) : target;

	if (!el)
		return null;

	el.focus();
	// select() is specific to HTMLInputElement/TextArea
	if (typeof el.select === 'function')
		el.select();

	// execCommand is deprecated; using direct value assignment for reliability.
	// We use a setter check to ensure we aren't breaking React/Vue controlled inputs.
	const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value')?.set;

	if (nativeInputValueSetter) {
		nativeInputValueSetter.call(el, value);
	} else {
		el.value = value;
	}

	el.dispatchEvent(new Event('input', {
			bubbles: true
		}));
	el.dispatchEvent(new Event('change', {
			bubbles: true
		}));

	return el;
};

// Alias for consistency with legacy code
const replaceValS = replaceVal;
/**
 * Replaces a pattern in a string while attempting to preserve the original casing.
 * * @param {string} str - The source string.
 * @param {string|RegExp} pattern - The pattern to find.
 * @param {string} newStr - The replacement string.
 * @returns {string}
 */
const replaceCase = (str, pattern, newStr) => {
	const rx = new RegExp(pattern, 'ig');

	return str.replace(rx, (matched) => {
		return Array.from(matched).map((char, i) => {
			const targetChar = newStr[i] ?? newStr[newStr.length - 1] ?? '';
			return /[A-Z]/.test(char) ? targetChar.toUpperCase() : targetChar.toLowerCase();
		}).join('');
	});
};

/**
 * Extracts the domain from a URL using the modern URL API.
 * * @param {string} url - The full URL string.
 * @returns {string|null}
 */
const getDomain = (url) => {
	try {
		const { hostname } = new URL(url.startsWith('http') ? url : `https://${url}`);
		const parts = hostname.replace(/^www\./, '').split('.');
		if (parts.length > 2)
			return parts.slice(-2).join('.');
		return hostname;
	} catch {
		return null;
	}
};

/**
 * Extracts the page number from a URL string.
 * * @param {string} url - The URL string.
 * @returns {number} Defaults to 1 if no page is found.
 */
const getPageFromUrl = (url) => {
	const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`, window.location.origin);
	const params = urlObj.searchParams;

	const page = params.get('p') || params.get('page') || url.match(/(?:\/page\/|page-)([1-9]\d*)/)?.[1];

	return page ? Number(page) : 1;
};

/**
 * Matches a string against a regex and returns the first capture group.
 * * @param {string} url - The string to search.
 * @param {RegExp} regg - The regular expression.
 * @returns {string|null}
 */
const getString = (url, regg) => url.match(regg)?.[1] ?? null;

/**
 * Saves text content as a local file using Object URLs.
 * * @param {string} textToWrite - Content of the file.
 * @param {string} fileNameToSaveAs - Name of the file.
 * @returns {void}
 */
const saveTextAsFiles = (textToWrite, fileNameToSaveAs) => {
	const blob = new Blob([textToWrite], {
		type: 'text/plain'
	});
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = fileNameToSaveAs;
	link.hidden = true;

	document.body.append(link);
	link.click();

	// Cleanup
	setTimeout(() => {
		URL.revokeObjectURL(url);
		link.remove();
	}, 100);
};


/**
 * Formats bytes into human-readable strings using logarithmic scale O(1).
 * @param {number|string} x - The byte value.
 * @returns {string}
 */
const niceBytes = (x) => {
	const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	let num = parseInt(x, 10) || 0;
	if (num === 0)
		return "0 B";

	const i = Math.floor(Math.log(num) / Math.log(1024));
	const val = num / Math.pow(1024, i);

	// Use 1 decimal place if value < 10 and not bytes
	const fractionDigits = (val < 10 && i > 0) ? 1 : 0;
	return `${val.toFixed(fractionDigits)} ${units[i]}`;
};

/**
 * Creates and appends a link button to a parent node.
 * @param {string} namer - Link text.
 * @param {string} linker - URL.
 * @param {HTMLElement} noder - Parent element.
 */
const CreateLinkButton = (namer, linker, noder) => {
	const wrapper = document.createElement("div");
	wrapper.className = "nav-linker";

	const anchor = document.createElement("a");
	anchor.className = "linker";
	anchor.href = linker;
	anchor.textContent = namer;

	wrapper.append(anchor);
	noder?.append(wrapper);
};

/**
 * Dispatches a modern MouseEvent to a node.
 * @param {HTMLElement|Array} jNode - Target element (handles jQuery-like arrays).
 */
const ClickThis = (jNode) => {
	var clickEvent = document.createEvent("MouseEvents");
	clickEvent.initEvent("click", true, true);
	jNode[0].dispatchEvent(clickEvent);
};

/**
 * Observes elements and triggers a click event.
 * Note: Assumes 'waitForKeyElements' is available in global scope.
 * @param {string} selector - CSS selector.
 */
const waitforclickthis = (selector) => {
	if (typeof waitForKeyElements !== "function") {
		console.error("waitForKeyElements dependency missing.");
		return;
	}

	waitForKeyElements(selector, (jNode) => {
		ClickThis(jNode);
	});
};

/**
 * Recursively finds the deepest hovered element.
 * @returns {HTMLElement|null}
 */
const getInnermostHover = () => {
	let element = document.querySelector(":hover");
	let lastElement = null;

	while (element) {
		lastElement = element;
		element = element.querySelector(":hover");
	}
	return lastElement;
};

/**
 * Capitalizes the first letter of a string.
 * @type {() => string}
 * @returns {string} The string with the first character capitalized.
 */
String.prototype.capitalize = function () {
	if (!this.length)
		return "";

	const [first, ...rest] = this;
	return `${first.toUpperCase()}${rest.join("")}`;
};

/**
 * Capitalizes every word in a string using locale-aware segmentation.
 * Prioritizes O(n) complexity.
 * @type {() => string}
 * @returns {string} The title-cased string.
 */
String.prototype.capitalizeWords = function () {
	if (!this.length)
		return "";

	// Use Intl.Segmenter for modern, locale-aware word boundary detection
	const segmenter = new Intl.Segmenter(undefined, {
		granularity: "word"
	});
	const segments = segmenter.segment(this);

	return [...segments]
	.map(({
			segment
		}) => segment.capitalize())
	.join("");
};
Element.prototype.appendBefore = function (element) {
	element.parentNode.insertBefore(this, element);
}, false;
Element.prototype.appendAfter = function (element) {
	element.parentNode.insertBefore(this, element.nextSibling);
}, false;
/* 


Element.prototype.appendBefore = function (target) {
	try {
		if (!(target instanceof Element)) {
			throw new TypeError("Target must be a valid DOM Element.");
		}
		target.insertAdjacentElement("beforebegin", this);
	} catch (error) {
		console.error("Failed to execute appendBefore:", error);
	}
};
Element.prototype.appendAfter = function (target) {
	try {
		if (!(target instanceof Element)) {
			throw new TypeError("Target must be a valid DOM Element.");
		}
		target.insertAdjacentElement("afterend", this);
	} catch (error) {
		console.error("Failed to execute appendAfter:", error);
	}
};*/
/**
 * Removes event listeners and inline handlers from an element and all descendants.
 * Optimized using TreeWalker for O(n) traversal without recursion depth issues.
 * @param {HTMLElement} element - The root element to clean.
 * @returns {void}
 */
const RecursiveUnbind = (element) => {
	if (!(element instanceof HTMLElement))
		return;

	const walker = document.createTreeWalker(
			element,
			NodeFilter.SHOW_ELEMENT,
			null);

	const clean = (el) => {
		// Clone node to strip all event listeners attached via addEventListener
		const clone = el.cloneNode(true);
		el.parentNode?.replaceChild(clone, el);
		// Remove legacy inline handlers
		clone.removeAttribute("onclick");
	};

	// Clean root and descendants
	let currentNode = walker.currentNode;
	while (currentNode) {
		clean(currentNode);
		currentNode = walker.nextNode();
	}
};

/**
 * Validates if a string is a valid domain format.
 * @param {string} domain - The string to validate.
 * @returns {boolean}
 */
const validateDomain = (domain) => {
	try {
		// Use URL constructor for native, robust validation
		new URL(`https://${domain}`);
		return true;
	} catch {
		return false;
	}
};

/**
 * Extracts the hostname from a URL string using the native URL API.
 * @param {string} url - The full URL.
 * @returns {string|null} The hostname or null if invalid.
 */
const extractHostname = (url) => {
	try {
		const { hostname } = new URL(url.includes("://") ? url : `https://${url}`);
		const cleanHostname = hostname.split(":")[0].split("?")[0];

		return validateDomain(cleanHostname) ? cleanHostname : null;
	} catch {
		return null;
	}
};

/**
 * Extracts the root domain (e.g., example.com) including handling for ccTLDs (e.g., example.co.uk).
 * @param {string} url - The full URL.
 * @returns {string|null}
 */
const extractRootDomain = (url) => {
	const hostname = extractHostname(url);
	if (!hostname)
		return null;

	const parts = hostname.split(".");
	const len = parts.length;

	if (len <= 2)
		return hostname;

	// Logic for ccTLDs (e.g., .com.au, .co.uk)
	const isCcTld = parts[len - 2].length <= 3 && parts[len - 1].length <= 2;
	const rootParts = isCcTld ? parts.slice(-3) : parts.slice(-2);

	const domain = rootParts.join(".");
	return validateDomain(domain) ? domain : null;
};
function saveData() {
	var asdasd = document.createElement("a");
	document.body.appendChild(asdasd);
	asdasd.style = "display: none";
	return function (data, fileName) {
		var blob = new Blob([data], {
			type: "octet/stream",
		});
		var url = window.URL.createObjectURL(blob);
		asdasd.href = url;
		asdasd.download = fileName;
		asdasd.click();
		window.URL.revokeObjectURL(url);
	};
}
function getFixedResource(name, type) {
    const raw = GM_getResourceURL(name);
    if (!raw) return "";
    return raw.replace('data:application;base64', 'data:' + type + ';base64');
}
/**
 * Modernized Notification System
 * @environment Browser
 */
const NotificationSystem = (() => {
	// Private State
	const queues = {
		topRight: [],
		bottomRight: [],
		topCenter: [],
		bottomLeft: [],
		topLeft: []
	};

	// Setup Styles once
	const injectStyles = () => {
		if (document.getElementById("hoecat-notif-style"))
			return;
		const style = document.createElement("style");
		style.id = "hoecat-notif-style";
		style.textContent = `
      .hoecat-notif {
        position: fixed; z-index: 9999; padding: 4px 10px;
        background: rgba(0,0,0,0.6); color: white; border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.4); font-family: sans-serif;
        font-weight: bold; pointer-events: auto; cursor: pointer;
        transition: all 0.3s ease; opacity: 0;
      }
      .notif-show { opacity: 1; transform: translateX(0) !important; }
      @keyframes notif-out {
        to { opacity: 0; transform: rotateX(-180deg) scale(0.5); }
      }
    `;
		document.head.append(style);
	};

	const getQuadrant = (pos) => {
		const isTop = !pos || !/low|bottom/i.test(pos);
		const isRight = !pos || !/left|center/i.test(pos);
		const isCenter = /center/i.test(pos);
		if (isCenter)
			return 'topCenter';
		return (isTop ? 'top' : 'bottom') + (isRight ? 'Right' : 'Left');
	};

	const reposition = (quadrant) => {
		let offset = 23;
		queues[quadrant].forEach(el => {
			const isTop = quadrant.startsWith('top');
			el.style[isTop ? 'top' : 'bottom'] = `${offset}px`;
			offset += el.offsetHeight + 8;
		});
	};

	injectStyles();

	// Return the public function
	return async(msg, position, size, duration = 2) => {
		const quadrant = getQuadrant(position);
		const el = document.createElement("div");

		el.className = "hoecat-notif";
		el.innerText = msg;
		el.style.fontSize = typeof size === 'number' ? `${size}px` : (size || '1.5em');

		// Initial X-offset for animation
		const isRight = quadrant.includes('Right');
		el.style.transform = `translateX(${isRight ? '35px' : '-35px'})`;

		// Horizontal alignment
		if (quadrant === 'topCenter') {
			el.style.right = "50%";
			el.style.transform = "translateX(50%)";
		} else {
			el.style[isRight ? 'right' : 'left'] = "27px";
		}

		document.body.append(el);
		queues[quadrant].push(el);

		// Trigger animations
		requestAnimationFrame(() => {
			reposition(quadrant);
			el.classList.add('notif-show');
		});

		const close = () => {
			el.style.animation = "notif-out 0.3s forwards";
			el.addEventListener('animationend', () => {
				el.remove();
				queues[quadrant] = queues[quadrant].filter(item => item !== el);
				reposition(quadrant);
			}, {
				once: true
			});
		};

		el.onclick = close;
		setTimeout(close, duration * 1000);
	};
})();

const notify = NotificationSystem;

/**
 * Decodes a Base64 string safely using a functional response pattern.
 * @param {string} base64String - The encoded string.
 * @returns {{success: boolean, data?: string, error?: string}}
 */
const safeAtob = (base64String) => {
	try {
		const decodedData = globalThis.atob(base64String);
		return {
			success: true,
			data: decodedData
		};
	} catch ({
		message
	}) {
		console.error(`Decoding failed for: ${base64String}`, message);
		return {
			success: false,
			error: message
		};
	}
};

/**
 * Calculates a date in the past based on a relative string (e.g., '5d', '2w').
 * Uses a Map for O(1) unit lookups and performance-optimized constants.
 * @param {string} relativeStr - The string to parse.
 * @returns {Date}
 */
const parseRelativeDate = (relativeStr) => {
	const now = Date.now();
	const match = relativeStr.match(/^(\d+)([hdwmy])$/);

	if (!match)
		return new Date(now);

	const [, valueStr, unit] = match;
	const value = Number.parseInt(valueStr, 10);

	const HOUR = 3_600_000;
	const DAY = HOUR * 24;

	// O(1) Lookup Table
	const offsets = new Map([
				['h', HOUR],
				['d', DAY],
				['w', DAY * 7],
				['m', DAY * 30],
				['y', DAY * 365]
			]);

	const offset = (offsets.get(unit) ?? 0) * value;
	return new Date(now - offset);
};

/**
 * Checks if the document is in dark mode using classList API.
 * @returns {boolean}
 */
const isDarkMode = () => document.documentElement.classList.contains("dark");

/**
 * Generates a cryptographically secure random float between 0 and 1.
 * @returns {number}
 */
const randomFloat = () => {
	const buffer = new Uint32Array(1);
	globalThis.crypto.getRandomValues(buffer);
	// Divide by max value of 32-bit unsigned integer (2^32 - 1)
	return buffer[0] / 0xFFFFFFFF;
};

/**
 * Inserts a CSS rule into a specific style sheet, creating it if it doesn't exist.
 * @param {string} css - The CSS rule to insert.
 * @param {string} realid - The ID of the style element.
 */
const GM_addStylez = (css, realid) => {
	const styleElement = document.getElementById(realid) ?? (() => {
		const el = document.createElement("style");
		el.id = realid;
		document.head.append(el);
		return el;
	})();

	const { sheet } = styleElement;
	sheet.insertRule(css, sheet.cssRules.length);
};

/**
 * Appends a new style block to the document head.
 * @param {string} style - The CSS text content.
 * @param {string} [ida] - Optional class name for the style tag.
 */
const appendStyleToDocument = (style, ida) => {
	const styleNode = document.createElement("style");
	if (ida)
		styleNode.className = ida;
	styleNode.textContent = style;
	document.head.append(styleNode);
};

/**
 * Returns the first substring found within a string.
 * @param {string} str
 * @param {string[]} substrings
 * @returns {string|null}
 */
const containsAnyString = (str, substrings) =>
substrings.find(sub => str.includes(sub)) ?? null;

/**
 * Returns the first substring found within a string (case-insensitive).
 * @param {string} str
 * @param {string[]} substrings
 * @returns {string|null}
 */
function containsAnyStringLower(str, substrings) {
	str = str.toLowerCase()
	for (var i = 0; i != substrings.length; i++) {
		var substring = substrings[i].toLowerCase()
			if (str.indexOf(substring) != -1) {
				return substring;
			}
	}
	return null;
}

/**
 * Checks if a string exactly matches any item in an array (case-insensitive).
 * @param {string} str
 * @param {string[]} substrings
 * @returns {boolean}
 */
const equalsAnyStringLower = (str, substrings) => {
	const lowerStr = str.toLowerCase();
	return substrings.some(sub => lowerStr === sub.toLowerCase());
};

/**
 * Returns true if the string contains any of the provided substrings.
 * @param {string} str
 * @param {string[]} substrings
 * @returns {boolean}
 */
const containsAnyTrue = (str, substrings) =>
substrings.some(sub => str.includes(sub));

/**
 * Returns true if the string contains any of the provided substrings (case-insensitive).
 * @param {string} str
 * @param {string[]} substrings
 * @returns {boolean}
 */
const containsAnyTrueLower = (str, substrings) => {
	const lowerStr = str.toLowerCase();
	return substrings.some(sub => lowerStr.includes(sub.toLowerCase()));
};

function watchForElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
	const targetContext = iframeSelector ? $(iframeSelector).contents() : $(document);
	if (!waitForKeyElements.processed)
		waitForKeyElements.processed = new WeakSet();

	const checkAndAct = () => {
		const nodes = targetContext.find(selectorTxt);

		nodes.each(function () {
			const jNode = $(this);
			if (!waitForKeyElements.processed.has(this)) {
				const cancelFound = actionFunction(jNode);

				if (cancelFound) {
					return false;
				} else {
					waitForKeyElements.processed.add(this);
				}
			}
		});
		if (bWaitOnce && nodes.length > 0) {
			observer.disconnect();
		}
	};
	const observer = new MutationObserver(checkAndAct);
	const observeTarget = iframeSelector ? targetContext[0] : document.documentElement;
	if (observeTarget) {
		observer.observe(observeTarget, {
			childList: true,
			subtree: true
		});
	}
	checkAndAct();
}

function waitForKeyElements2(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
	const targetContext = iframeSelector ? $(iframeSelector).contents() : $(document);
	if (!actionFunction.processedNodes)
		actionFunction.processedNodes = new WeakSet();

	const checkAndAct = () => {
		const nodes = targetContext.find(selectorTxt);

		nodes.each(function () {
			const jNode = $(this);
			const el = this;
			if (!actionFunction.processedNodes.has(el) && !jNode.data('alreadyFound')) {
				const cancelFound = actionFunction(jNode);

				if (cancelFound) {
					return false;
				} else {
					actionFunction.processedNodes.add(el);
					jNode.data('alreadyFound', true);
				}
			}
		});

		if (bWaitOnce && nodes.length > 0) {
			observer.disconnect();
		}
	};
	const observer = new MutationObserver(checkAndAct);
	const observeTarget = iframeSelector ? targetContext[0] : document.documentElement;

	if (observeTarget) {
		observer.observe(observeTarget, {
			childList: true,
			subtree: true
		});
	}
	checkAndAct();
}

function waitForElm(selector) {
	return new Promise((resolve) => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}
		const observer = new MutationObserver((mutations) => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				resolve(document.querySelector(selector));
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

function simplefloat() {
	const aa = document.createElement("div");
	aa.id = "hoefixedleft";
	aa.style = "width:min-content;";
	return aa;
}

function simplefloatbut(text) {
	const a = document.createElement("button");
	a.className = "hoebuttons";
	a.innerHTML = text;
	return a;
}
function CE(type, text, floatclass, floatid, floatstyle) {
	const button = document.createElement(type);
	if (text !== undefined)
		button.textContent = text;
	if (floatclass !== undefined)
		button.className = floatclass;
	if (floatid !== undefined)
		button.id = floatid;
	if (floatstyle !== undefined)
		button.style = floatstyle;
	return button;
}
function CS(type, srcc, floatclass) {
	const script = document.createElement(type);
	if (type == "link") {
		if (srcc !== undefined)
			script.href = srcc;
		script.rel = "stylesheet";
	} else {
		if (srcc !== undefined)
			script.src = srcc;
	}
	if (floatclass !== undefined)
		script.className = floatclass;
	return script;
}
function CA(text, floathref, floatclass, floatid, floatstyle, floattarg) {
	const button = document.createElement("a");
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
	return button;
}
function addFloatButtonss(text, floatclass, floatid, floatstyle) {
	const button = document.createElement("button");
	if (text !== undefined)
		button.textContent = text;
	if (floatclass !== undefined)
		button.className = floatclass;
	if (floatid !== undefined)
		button.id = floatid;
	if (floatstyle !== undefined)
		button.style = floatstyle;
	return button;
}