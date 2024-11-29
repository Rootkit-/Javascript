/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               Basic Functions (For userscripts)
// @name:zh-CN         常用函数（用户脚本）
// @name:en            Basic Functions (For userscripts)
// @namespace          PY-DNG Userscripts
// @version            0.8.13
// @description        Useful functions for myself
// @description:zh-CN  自用函数
// @description:en     Useful functions for myself
// @author             PY-DNG
// @license            GPL-3.0-or-later
// ==/UserScript==

// Note: version 0.8.2.1 is modified just the license and it's not uploaded to GF yet 23-11-26 15:03
// Note: version 0.8.3.1 is added just the description of parseArgs and has not uploaded to GF yet 24-02-03 18:55

let [
	// Console & Debug
	LogLevel, DoLog, Err, Assert,

	// DOM
	$, $All, $CrE, $AEL, $$CrE, addStyle, detectDom, destroyEvent,

	// Data
	copyProp, copyProps, parseArgs, escJsStr, replaceText,

	// Environment & Browser
	getUrlArgv, dl_browser, dl_GM,

	// Logic & Task
	AsyncManager, queueTask, testChecker, registerChecker, loadFuncs
] = (function() {
	/**
	 * level defination for DoLog function, bigger ones has higher possibility to be printed in console
	 * @property {Number} None - 0
	 * @property {Number} Error - 1
	 * @property {Number} Success - 2
	 * @property {Number} Warning - 3
	 * @property {Number} Info - 4
	 */
	/**
	 * Logger with level and logger function specification
	 * @param {Number} [level=LogLevel.Info] - level specified in LogLevel object
	 * @param {String} content - log content
	 * @param {String} [logger=log] - which log function to use (in window.console[logger])
	 */
	const [LogLevel, DoLog] = (function() {
		const LogLevel = {
			None: 0,
			Error: 1,
			Success: 2,
			Warning: 3,
			Info: 4,
		};

		return [LogLevel, DoLog];
		function DoLog() {
			// Get window
			const win = (typeof(unsafeWindow) === 'object' && unsafeWindow !== null) ? unsafeWindow : window;

			const LogLevelMap = {};
			LogLevelMap[LogLevel.None] = {
				prefix: '',
				color: 'color:#ffffff'
			}
			LogLevelMap[LogLevel.Error] = {
				prefix: '[Error]',
				color: 'color:#ff0000'
			}
			LogLevelMap[LogLevel.Success] = {
				prefix: '[Success]',
				color: 'color:#00aa00'
			}
			LogLevelMap[LogLevel.Warning] = {
				prefix: '[Warning]',
				color: 'color:#ffa500'
			}
			LogLevelMap[LogLevel.Info] = {
				prefix: '[Info]',
				color: 'color:#888888'
			}
			LogLevelMap[LogLevel.Elements] = {
				prefix: '[Elements]',
				color: 'color:#000000'
			}

			// Current log level
			DoLog.logLevel = (win.isPY_DNG && win.userscriptDebugging) ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

			// Log counter
			DoLog.logCount === undefined && (DoLog.logCount = 0);

			// Get args
			let [level, logContent, logger] = parseArgs([...arguments], [
				[2],
				[1,2],
				[1,2,3]
			], [LogLevel.Info, 'DoLog initialized.', 'log']);

			let msg = '%c' + LogLevelMap[level].prefix + (typeof GM_info === 'object' ? `[${GM_info.script.name}]` : '') + (LogLevelMap[level].prefix ? ' ' : '');
			let subst = LogLevelMap[level].color;

			switch (typeof(logContent)) {
				case 'string':
					msg += '%s';
					break;
				case 'number':
					msg += '%d';
					break;
				default:
					msg += '%o';
					break;
			}

			// Log when log level permits
			if (level <= DoLog.logLevel) {
				// Log to console when log level permits
				if (level <= DoLog.logLevel) {
					if (++DoLog.logCount > 512) {
						console.clear();
						DoLog.logCount = 0;
					}
					console[logger](msg, subst, logContent);
				}
			}
		}
	}) ();

	// type: [Error, TypeError]
	/**
	 * @typedef {Number} ErrorType
	 *
	 */
	/**
	 * Throw an error
	 * @param {String} msg - the error message
	 * @param {ErrorType} [type=0] - error type, which also means the Error constructor
	 */
	function Err(msg, type=0) {
		throw new [Error, TypeError][type]((typeof GM_info === 'object' ? `[${GM_info.script.name}]` : '') + msg);
	}

	function Assert(val, errmsg, errtype) {
		val || Err(errmsg, errtype);
	}

	// Basic functions
	// querySelector
	function $() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelector(arguments[1]);
				break;
			default:
				return document.querySelector(arguments[0]);
		}
	}
	// querySelectorAll
	function $All() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelectorAll(arguments[1]);
				break;
			default:
				return document.querySelectorAll(arguments[0]);
		}
	}
	// createElement
	function $CrE() {
		switch(arguments.length) {
			case 2:
				return arguments[0].createElement(arguments[1]);
				break;
			default:
				return document.createElement(arguments[0]);
		}
	}
	// addEventListener
	function $AEL(...args) {
		const target = args.shift();
		return target.addEventListener.apply(target, args);
	}
	function $$CrE() {
		const [tagName, props, attrs, classes, styles, listeners] = parseArgs([...arguments], [
			function(args, defaultValues) {
				const arg = args[0];
				return {
					'string': () => [arg, ...defaultValues.filter((arg, i) => i > 0)],
					'object': () => ['tagName', 'props', 'attrs', 'classes', 'styles', 'listeners'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i])
				}[typeof arg]();
			},
			[1,2],
			[1,2,3],
			[1,2,3,4],
			[1,2,3,4,5]
		], ['div', {}, {}, [], {}, []]);
		const elm = $CrE(tagName);
		for (const [name, val] of Object.entries(props)) {
			elm[name] = val;
		}
		for (const [name, val] of Object.entries(attrs)) {
			elm.setAttribute(name, val);
		}
		for (const cls of Array.isArray(classes) ? classes : [classes]) {
			elm.classList.add(cls);
		}
		for (const [name, val] of Object.entries(styles)) {
			elm.style[name] = val;
		}
		for (const listener of listeners) {
			$AEL(...[elm, ...listener]);
		}
		return elm;
	}

	// Append a style text to document(<head>) with a <style> element
	// arguments: css | css, id | parentElement, css, id
	// remove old one when id duplicates with another element in document
    function addStyle() {
    	// Get arguments
    	const [parentElement, css, id] = parseArgs([...arguments], [
    		[2],
    		[2,3],
    		[1,2,3]
    	], [document.head, '', null]);

    	// Make <style>
		const style = $CrE("style");
		style.textContent = css;
		id !== null && (style.id = id);
		id !== null && $(`#${id}`) && $(`#${id}`).remove();

		// Append to parentElement
        parentElement.appendChild(style);
		return style;
    }

	// Get callback when specific dom/element loaded
	// detectDom({[root], selector, callback}) | detectDom(selector, callback) | detectDom(root, selector, callback) | detectDom(root, selector, callback, attributes)
	// Supports both callback for multiple detection, and promise for one-time detection.
	// By default promise mode is preferred, meaning `callback` argument should be provided explicitly when using callback
	// mode (by adding `callback` property in details object, or provide all 4 arguments where callback should be the last)
	// This behavior is different from versions that equals to or older than 0.8.4.2, so be careful when using it.
	function detectDom() {
		let [selectors, root, attributes, callback] = parseArgs([...arguments], [
			function(args, defaultValues) {
				const arg = args[0];
				return {
					'string': () => [arg, ...defaultValues.filter((arg, i) => i > 0)],
					'object': () => ['selector', 'root', 'attributes', 'callback'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i])
				}[typeof arg]();
			},
			[2,1],
			[2,1,3],
			[2,1,3,4],
		], [[''], document, false, null]);
		!Array.isArray(selectors) && (selectors = [selectors]);

		if (select(root, selectors)) {
			for (const elm of selectAll(root, selectors)) {
				if (callback) {
					setTimeout(callback.bind(null, elm));
				} else {
					return Promise.resolve(elm);
				}
			}
		}

		const observer = new MutationObserver(mCallback);
		observer.observe(root, {
			childList: true,
			subtree: true,
			attributes,
		});

		let isPromise = !callback;
		return callback ? observer : new Promise((resolve, reject) => callback = resolve);

		function mCallback(mutationList, observer) {
			const addedNodes = mutationList.reduce((an, mutation) => {
				switch (mutation.type) {
					case 'childList':
						an.push(...mutation.addedNodes);
						break;
					case 'attributes':
						an.push(mutation.target);
						break;
				}
				return an;
			}, []);
			const addedSelectorNodes = addedNodes.reduce((nodes, anode) => {
				if (anode.matches && match(anode, selectors)) {
					nodes.add(anode);
				}
				const childMatches = anode.querySelectorAll ? selectAll(anode, selectors) : [];
				for (const cm of childMatches) {
					nodes.add(cm);
				}
				return nodes;
			}, new Set());
			for (const node of addedSelectorNodes) {
				callback(node);
				isPromise && observer.disconnect();
			}
		}

		function selectAll(elm, selectors) {
			!Array.isArray(selectors) && (selectors = [selectors]);
			return selectors.map(selector => [...$All(elm, selector)]).reduce((all, arr) => {
				all.push(...arr);
				return all;
			}, []);
		}

		function select(elm, selectors) {
			const all = selectAll(elm, selectors);
			return all.length ? all[0] : null;
		}

		function match(elm, selectors) {
			return !!elm.matches && selectors.some(selector => elm.matches(selector));
		}
	}

	// Just stopPropagation and preventDefault
	function destroyEvent(e) {
		if (!e) {return false;};
		if (!e instanceof Event) {return false;};
		e.stopPropagation();
		e.preventDefault();
	}

	// Object1[prop] ==> Object2[prop]
	function copyProp(obj1, obj2, prop) {obj1[prop] !== undefined && (obj2[prop] = obj1[prop]);}
	function copyProps(obj1, obj2, props) {(props || Object.keys(obj1)).forEach((prop) => (copyProp(obj1, obj2, prop)));}

	// Argument parser with sorting and defaultValue support
	function parseArgs(args, rules, defaultValues=[]) {
		// args and rules should be array, but not just iterable (string is also iterable)
		if (!Array.isArray(args) || !Array.isArray(rules)) {
			throw new TypeError('parseArgs: args and rules should be array')
		}

		// fill rules[0]
		(!Array.isArray(rules[0]) || rules[0].length === 1) && rules.splice(0, 0, []);

		// max arguments length
		const count = rules.length - 1;

		// args.length must <= count
		if (args.length > count) {
			throw new TypeError(`parseArgs: args has more elements(${args.length}) longer than ruless'(${count})`);
		}

		// rules[i].length should be === i if rules[i] is an array, otherwise it should be a function
		for (let i = 1; i <= count; i++) {
			const rule = rules[i];
			if (Array.isArray(rule)) {
				if (rule.length !== i) {
					throw new TypeError(`parseArgs: rules[${i}](${rule}) should have ${i} numbers, but given ${rules[i].length}`);
				}
				if (!rule.every((num) => (typeof num === 'number' && num <= count))) {
					throw new TypeError(`parseArgs: rules[${i}](${rule}) should contain numbers smaller than count(${count}) only`);
				}
			} else if (typeof rule !== 'function') {
				throw new TypeError(`parseArgs: rules[${i}](${rule}) should be an array or a function.`)
			}
		}

		// Parse
		const rule = rules[args.length];
		let parsed;
		if (Array.isArray(rule)) {
			parsed = [...defaultValues];
			for (let i = 0; i < rule.length; i++) {
				parsed[rule[i]-1] = args[i];
			}
		} else {
			parsed = rule(args, defaultValues);
		}
		return parsed;
	}

	// escape str into javascript written format
	function escJsStr(str, quote='"') {
		str = str.replaceAll('\\', '\\\\').replaceAll(quote, '\\' + quote).replaceAll('\t', '\\t');
		str = quote === '`' ? str.replaceAll(/(\$\{[^\}]*\})/g, '\\$1') : str.replaceAll('\r', '\\r').replaceAll('\n', '\\n');
		return quote + str + quote;
	}

	// Replace model text with no mismatching of replacing replaced text
	// e.g. replaceText('aaaabbbbccccdddd', {'a': 'b', 'b': 'c', 'c': 'd', 'd': 'e'}) === 'bbbbccccddddeeee'
	//      replaceText('abcdAABBAA', {'BB': 'AA', 'AAAAAA': 'This is a trap!'}) === 'abcdAAAAAA'
	//      replaceText('abcd{AAAA}BB}', {'{AAAA}': '{BB', '{BBBB}': 'This is a trap!'}) === 'abcd{BBBB}'
	//      replaceText('abcd', {}) === 'abcd'
	/* Note:
	    replaceText will replace in sort of replacer's iterating sort
	    e.g. currently replaceText('abcdAABBAA', {'BBAA': 'TEXT', 'AABB': 'TEXT'}) === 'abcdAATEXT'
	    but remember: (As MDN Web Doc said,) Although the keys of an ordinary Object are ordered now, this was
	    not always the case, and the order is complex. As a result, it's best not to rely on property order.
	    So, don't expect replaceText will treat replacer key-values in any specific sort. Use replaceText to
	    replace irrelevance replacer keys only.
	*/
	function replaceText(text, replacer) {
		if (Object.entries(replacer).length === 0) {return text;}
		const [models, targets] = Object.entries(replacer);
		const len = models.length;
		let text_arr = [{text: text, replacable: true}];
		for (const [model, target] of Object.entries(replacer)) {
			text_arr = replace(text_arr, model, target);
		}
		return text_arr.map((text_obj) => (text_obj.text)).join('');

		function replace(text_arr, model, target) {
			const result_arr = [];
			for (const text_obj of text_arr) {
				if (text_obj.replacable) {
					const splited = text_obj.text.split(model);
					for (const part of splited) {
						result_arr.push({text: part, replacable: true});
						result_arr.push({text: target, replacable: false});
					}
					result_arr.pop();
				} else {
					result_arr.push(text_obj);
				}
			}
			return result_arr;
		}
	}

	// Get a url argument from location.href
	// also recieve a function to deal the matched string
	// returns defaultValue if name not found
    // Args: {name, url=location.href, defaultValue=null, dealFunc=((a)=>{return a;})} or (name) or (url, name) or (url, name, defaultValue) or (url, name, defaultValue, dealFunc)
	function getUrlArgv(details) {
		const [name, url, defaultValue, dealFunc] = parseArgs([...arguments], [
			function(args, defaultValues) {
				const arg = args[0];
				return {
					'string': () => [arg, ...defaultValues.filter((arg, i) => i > 0)],
					'object': () => ['name', 'url', 'defaultValue', 'dealFunc'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i])
				}[typeof arg]();
			},
			[2,1],
			[2,1,3],
			[2,1,3,4]
		], [null, location.href, null, a => a]);

        if (name === null) { return null; }

		const search = new URL(url).search;
		const objSearch = new URLSearchParams(search);
		const raw = objSearch.has(name) ? objSearch.get(name) : defaultValue;
		const argv = dealFunc(raw);

		return argv;
	}

	// Save dataURL to file
	function dl_browser(dataURL, filename) {
		const a = document.createElement('a');
		a.href = dataURL;
		a.download = filename;
		a.click();
	}

	// File download function
	// details looks like the detail of GM_xmlhttpRequest
	// onload function will be called after file saved to disk
	function dl_GM(details) {
		if (!details.url || !details.name) {return false;};

		// Configure request object
		const requestObj = {
			url: details.url,
			responseType: 'blob',
			onload: function(e) {
				// Save file
				dl_browser(URL.createObjectURL(e.response), details.name);

				// onload callback
				details.onload ? details.onload(e) : function() {};
			}
		}
		if (details.onloadstart       ) {requestObj.onloadstart        = details.onloadstart;};
		if (details.onprogress        ) {requestObj.onprogress         = details.onprogress;};
		if (details.onerror           ) {requestObj.onerror            = details.onerror;};
		if (details.onabort           ) {requestObj.onabort            = details.onabort;};
		if (details.onreadystatechange) {requestObj.onreadystatechange = details.onreadystatechange;};
		if (details.ontimeout         ) {requestObj.ontimeout          = details.ontimeout;};

		// Send request
		GM_xmlhttpRequest(requestObj);
	}

	function AsyncManager() {
		const AM = this;

		// Ongoing xhr count
		this.taskCount = 0;

		// Whether generate finish events
		let finishEvent = false;
		Object.defineProperty(this, 'finishEvent', {
			configurable: true,
			enumerable: true,
			get: () => (finishEvent),
			set: (b) => {
				finishEvent = b;
				b && AM.taskCount === 0 && AM.onfinish && AM.onfinish();
			}
		});

		// Add one task
		this.add = () => (++AM.taskCount);

		// Finish one task
		this.finish = () => ((--AM.taskCount === 0 && AM.finishEvent && AM.onfinish && AM.onfinish(), AM.taskCount));
	}

	function queueTask(task, queueId='default') {
		init();

		return new Promise((resolve, reject) => {
			queueTask.hasOwnProperty(queueId) || (queueTask[queueId] = { tasks: [], ongoing: 0 });
			queueTask[queueId].tasks.push({task, resolve, reject});
			checkTask(queueId);
		});

		function init() {
			if (!queueTask[queueId]?.initialized) {
				queueTask[queueId] = {
					// defaults
					tasks: [],
					ongoing: 0,
					max: 3,
					sleep: 500,

					// user's pre-sets
					...(queueTask[queueId] || {}),

					// initialized flag
					initialized: true
				}
			};
		}

		function checkTask() {
			const queue = queueTask[queueId];
			setTimeout(() => {
				if (queue.ongoing < queue.max && queue.tasks.length) {
					const task = queue.tasks.shift();
					queue.ongoing++;
					setTimeout(
						() => task.task().then(v => {
							queue.ongoing--;
							task.resolve(v);
							checkTask(queueId);
						}).catch(e => {
							queue.ongoing--;
							task.reject(e);
							checkTask(queueId);
						}),
						queue.sleep
					);
				}
			});
		}
	}

	const [testChecker, registerChecker, loadFuncs] = (function() {
		const checkers = {
			switch: value => value,
			url: value => location.href === value,
			path: value => location.pathname === value,
			regurl: value => !!location.href.match(value),
			regpath: value => !!location.pathname.match(value),
			starturl: value => location.href.startsWith(value),
			startpath: value => location.pathname.startsWith(value),
			func: value => value()
		};

		// Check whether current page url matches FuncInfo.checker rule
		// This code is copy and modified from FunctionLoader.check
		function testChecker(checker) {
			if (!checker) {return true;}
			const values = Array.isArray(checker.value) ? checker.value : [checker.value];
			return values[checker.all ? 'every' : 'some'](value => {
				const type = checker.type;
				if (checkers.hasOwnProperty(type)) {
					try {
						return checkers[type](value);
					} catch (err) {
						DoLog(LogLevel.Error, 'Checker function raised an error');
						DoLog(LogLevel.Error, err);
						return false;
					}
				} else {
					DoLog(LogLevel.Error, 'Invalid checker type');
					return false;
				}
			});
		}

		function registerChecker(name, func) {
			Assert(['Symbol', 'string', 'number'].includes(typeof name), 'name should be symbol, string or number');
			Assert(typeof func === 'function', 'func should be a function');
			checkers[name] = func;
		}

		// Load all function-objs provided in funcs asynchronously, get their return values in one obj
		// funcobj: {[id], [readonly], [checker], [detectDom], func}
        // Provide id for oFunc if you want to get its return value or want it to be a dependency for other oFuncs
		function loadFuncs(oFuncs) {
            // Load
            const loading_promises = new Map();
			const returnObj = {};
			oFuncs.forEach(oFunc => load(oFunc));
			return returnObj;

            // Call do_load and store returned promise
            function load(oFunc, stack) {
                const promise = do_load(oFunc, stack)
                loading_promises.set(oFunc, promise);
                return promise;
            }

            // Check availability and then execute
            async function do_load(oFunc, stack = []) {
                const getFunc = id => oFuncs.find(oFunc => oFunc.id == id);

                // Prevent repeat loading
                if (oFunc.hasOwnProperty('id') && returnObj.hasOwnProperty(oFunc.id)) {
                    // Already loaded
                    return;
                }
                if (loading_promises.has(oFunc)) {
                    // Still loading
                    return await loading_promises.get(oFunc);
                }
                if (oFunc.hasOwnProperty('id') && stack.includes(oFunc.id)) {
                    // Circular depending
                    Err(`loadFuncs.load: loop dependencies: [${stack.join(' > ')}]`);
                }

                // Test checker
                const checker = oFunc.checker;
                if (checker && !testChecker(checker)) { return; }

                // Load dependencies
                let dps = oFunc.dependencies || [];
                if (!Array.isArray(dps)) { dps = [dps]; }
                await Promise.all(dps.map(
                    dp => load(
                        getFunc(dp),
                        oFunc.hasOwnProperty('id') ? stack.concat(oFunc.id) : [...stack]
                    )
                ));

                // Execute function
                if (oFunc.detectDom) {
                    const selectors = Array.isArray(oFunc.detectDom) ? oFunc.detectDom : [oFunc.detectDom];
                    await Promise.all(selectors.map(selector => detectDom(selector))).then(async node => await execute(oFunc));
                } else {
                    await execute(oFunc);
                }
            }

            // Execute directly
			function execute(oFunc) {
                return new Promise((resolve, reject) => {
                    setTimeout(async e => {
                        const rval = isAsyncFunction(oFunc.func) ? await oFunc.func(returnObj) : oFunc.func(returnObj);
                        typeof rval === 'object' && oFunc.id &&
                            (returnObj[oFunc.id] = returnObj.readonly ? MakeReadonlyObj(rval) : rval);
                        resolve();
                    }, 0);
                });

                function MakeReadonlyObj(val) {
                    return isObject(val) ? new Proxy(val, {
                        get: function(target, property, receiver) {
                            return MakeReadonlyObj(target[property]);
                        },
                        set: function(target, property, value, receiver) {},
                        has: function(target, prop) {}
                    }) : val;

                    function isObject(value) {
                        return ['object', 'function'].includes(typeof value) && value !== null;
                    }
                }

                function isAsyncFunction(fn) {
                    return fn.constructor.toString()=='function AsyncFunction() { [native code] }';
                }
			}
		}

		return [testChecker, registerChecker, loadFuncs];
	}) ();

	return [
		// Console & Debug
		LogLevel, DoLog, Err, Assert,

		// DOM
		$, $All, $CrE, $AEL, $$CrE, addStyle, detectDom, destroyEvent,

		// Data
		copyProp, copyProps, parseArgs, escJsStr, replaceText,

		// Environment & Browser
		getUrlArgv, dl_browser, dl_GM,

		// Logic & Task
		AsyncManager, queueTask, testChecker, registerChecker, loadFuncs
	];
})();