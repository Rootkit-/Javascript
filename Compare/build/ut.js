/*! For license information please see ut.js.LICENSE.txt */
(() => {
	var e = {
		454: (e, t, n) => {
			"use strict";
			const a = n(918),
			i = n(923),
			r = n(904);
			e.exports = {
				XMLParser: i,
				XMLValidator: a,
				XMLBuilder: r
			}
		},
		85: e => {
			e.exports = function (e) {
				return "function" == typeof e ? e : Array.isArray(e) ? t => {
					for (const n of e) {
						if ("string" == typeof n && t === n)
							return !0;
						if (n instanceof RegExp && n.test(t))
							return !0
					}
				}
				 : () => !1
			}
		},
		334: (e, t) => {
			"use strict";
			const n = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
			a = "[" + n + "][" + (n + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040") + "]*",
			i = new RegExp("^" + a + "$");
			t.isExist = function (e) {
				return void 0 !== e
			},
			t.isEmptyObject = function (e) {
				return 0 === Object.keys(e).length
			},
			t.merge = function (e, t, n) {
				if (t) {
					const a = Object.keys(t),
					i = a.length;
					for (let r = 0; r < i; r++)
						e[a[r]] = "strict" === n ? [t[a[r]]] : t[a[r]]
				}
			},
			t.getValue = function (e) {
				return t.isExist(e) ? e : ""
			},
			t.isName = function (e) {
				const t = i.exec(e);
				return !(null == t)
			},
			t.getAllMatches = function (e, t) {
				const n = [];
				let a = t.exec(e);
				for (; a; ) {
					const i = [];
					i.startIndex = t.lastIndex - a[0].length;
					const r = a.length;
					for (let e = 0; e < r; e++)
						i.push(a[e]);
					n.push(i),
					a = t.exec(e)
				}
				return n
			},
			t.nameRegexp = a
		},
		918: (e, t, n) => {
			"use strict";
			const a = n(334),
			i = {
				allowBooleanAttributes: !1,
				unpairedTags: []
			};

			function r(e) {
				return " " === e || "\t" === e || "\n" === e || "\r" === e
			}

			function o(e, t) {
				const n = t;
				for (; t < e.length; t++)
					if ("?" != e[t] && " " != e[t]);
					else {
						const a = e.substr(n, t - n);
						if (t > 5 && "xml" === a)
							return g("InvalidXml", "XML declaration allowed only at the start of the document.", p(e, t));
						if ("?" == e[t] && ">" == e[t + 1]) {
							t++;
							break
						}
					}
				return t
			}

			function s(e, t) {
				if (e.length > t + 5 && "-" === e[t + 1] && "-" === e[t + 2]) {
					for (t += 3; t < e.length; t++)
						if ("-" === e[t] && "-" === e[t + 1] && ">" === e[t + 2]) {
							t += 2;
							break
						}
				} else if (e.length > t + 8 && "D" === e[t + 1] && "O" === e[t + 2] && "C" === e[t + 3] && "T" === e[t + 4] && "Y" === e[t + 5] && "P" === e[t + 6] && "E" === e[t + 7]) {
					let n = 1;
					for (t += 8; t < e.length; t++)
						if ("<" === e[t])
							n++;
						else if (">" === e[t] && (n--, 0 === n))
							break
				} else if (e.length > t + 9 && "[" === e[t + 1] && "C" === e[t + 2] && "D" === e[t + 3] && "A" === e[t + 4] && "T" === e[t + 5] && "A" === e[t + 6] && "[" === e[t + 7])
					for (t += 8; t < e.length; t++)
						if ("]" === e[t] && "]" === e[t + 1] && ">" === e[t + 2]) {
							t += 2;
							break
						}
				return t
			}
			t.validate = function (e, t) {
				t = Object.assign({}, i, t);
				const n = [];
				let d = !1,
				u = !1;
				"\ufeff" === e[0] && (e = e.substr(1));
				for (let i = 0; i < e.length; i++)
					if ("<" === e[i] && "?" === e[i + 1]) {
						if (i += 2, i = o(e, i), i.err)
							return i
					} else {
						if ("<" !== e[i]) {
							if (r(e[i]))
								continue;
							return g("InvalidChar", "char '" + e[i] + "' is not expected.", p(e, i))
						} {
							let f = i;
							if (i++, "!" === e[i]) {
								i = s(e, i);
								continue
							} {
								let v = !1;
								"/" === e[i] && (v = !0, i++);
								let b = "";
								for (; i < e.length && ">" !== e[i] && " " !== e[i] && "\t" !== e[i] && "\n" !== e[i] && "\r" !== e[i]; i++)
									b += e[i];
								if (b = b.trim(), "/" === b[b.length - 1] && (b = b.substring(0, b.length - 1), i--), l = b, !a.isName(l)) {
									let t;
									return t = 0 === b.trim().length ? "Invalid space after '<'." : "Tag '" + b + "' is an invalid name.",
									g("InvalidTag", t, p(e, i))
								}
								const w = m(e, i);
								if (!1 === w)
									return g("InvalidAttr", "Attributes for '" + b + "' have open quote.", p(e, i));
								let y = w.value;
								if (i = w.index, "/" === y[y.length - 1]) {
									const n = i - y.length;
									y = y.substring(0, y.length - 1);
									const a = h(y, t);
									if (!0 !== a)
										return g(a.err.code, a.err.msg, p(e, n + a.err.line));
									d = !0
								} else if (v) {
									if (!w.tagClosed)
										return g("InvalidTag", "Closing tag '" + b + "' doesn't have proper closing.", p(e, i));
									if (y.trim().length > 0)
										return g("InvalidTag", "Closing tag '" + b + "' can't have attributes or invalid starting.", p(e, f));
									if (0 === n.length)
										return g("InvalidTag", "Closing tag '" + b + "' has not been opened.", p(e, f)); {
										const t = n.pop();
										if (b !== t.tagName) {
											let n = p(e, t.tagStartPos);
											return g("InvalidTag", "Expected closing tag '" + t.tagName + "' (opened in line " + n.line + ", col " + n.col + ") instead of closing tag '" + b + "'.", p(e, f))
										}
										0 == n.length && (u = !0)
									}
								} else {
									const a = h(y, t);
									if (!0 !== a)
										return g(a.err.code, a.err.msg, p(e, i - y.length + a.err.line));
									if (!0 === u)
										return g("InvalidXml", "Multiple possible root nodes found.", p(e, i));
									 - 1 !== t.unpairedTags.indexOf(b) || n.push({
										tagName: b,
										tagStartPos: f
									}),
									d = !0
								}
								for (i++; i < e.length; i++)
									if ("<" === e[i]) {
										if ("!" === e[i + 1]) {
											i++,
											i = s(e, i);
											continue
										}
										if ("?" !== e[i + 1])
											break;
										if (i = o(e, ++i), i.err)
											return i
									} else if ("&" === e[i]) {
										const t = c(e, i);
										if (-1 == t)
											return g("InvalidChar", "char '&' is not expected.", p(e, i));
										i = t
									} else if (!0 === u && !r(e[i]))
										return g("InvalidXml", "Extra text at the end", p(e, i));
								"<" === e[i] && i--
							}
						}
					}
				var l;
				return d ? 1 == n.length ? g("InvalidTag", "Unclosed tag '" + n[0].tagName + "'.", p(e, n[0].tagStartPos)) : !(n.length > 0) || g("InvalidXml", "Invalid '" + JSON.stringify(n.map((e => e.tagName)), null, 4).replace(/\r?\n/g, "") + "' found.", {
					line: 1,
					col: 1
				}) : g("InvalidXml", "Start tag expected.", 1)
			};
			const d = '"',
			u = "'";

			function m(e, t) {
				let n = "",
				a = "",
				i = !1;
				for (; t < e.length; t++) {
					if (e[t] === d || e[t] === u)
						"" === a ? a = e[t] : a !== e[t] || (a = "");
					else if (">" === e[t] && "" === a) {
						i = !0;
						break
					}
					n += e[t]
				}
				return "" === a && {
					value: n,
					index: t,
					tagClosed: i
				}
			}
			const l = new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");

			function h(e, t) {
				const n = a.getAllMatches(e, l),
				i = {};
				for (let e = 0; e < n.length; e++) {
					if (0 === n[e][1].length)
						return g("InvalidAttr", "Attribute '" + n[e][2] + "' has no space in starting.", v(n[e]));
					if (void 0 !== n[e][3] && void 0 === n[e][4])
						return g("InvalidAttr", "Attribute '" + n[e][2] + "' is without value.", v(n[e]));
					if (void 0 === n[e][3] && !t.allowBooleanAttributes)
						return g("InvalidAttr", "boolean attribute '" + n[e][2] + "' is not allowed.", v(n[e]));
					const a = n[e][2];
					if (!f(a))
						return g("InvalidAttr", "Attribute '" + a + "' is an invalid name.", v(n[e]));
					if (i.hasOwnProperty(a))
						return g("InvalidAttr", "Attribute '" + a + "' is repeated.", v(n[e]));
					i[a] = 1
				}
				return !0
			}

			function c(e, t) {
				if (";" === e[++t])
					return -1;
				if ("#" === e[t])
					return function (e, t) {
						let n = /\d/;
						for ("x" === e[t] && (t++, n = /[\da-fA-F]/); t < e.length; t++) {
							if (";" === e[t])
								return t;
							if (!e[t].match(n))
								break
						}
						return -1
					}
				(e, ++t);
				let n = 0;
				for (; t < e.length; t++, n++)
					if (!(e[t].match(/\w/) && n < 20)) {
						if (";" === e[t])
							break;
						return -1
					}
				return t
			}

			function g(e, t, n) {
				return {
					err: {
						code: e,
						msg: t,
						line: n.line || n,
						col: n.col
					}
				}
			}

			function f(e) {
				return a.isName(e)
			}

			function p(e, t) {
				const n = e.substring(0, t).split(/\r?\n/);
				return {
					line: n.length,
					col: n[n.length - 1].length + 1
				}
			}

			function v(e) {
				return e.startIndex + e[1].length
			}
		},
		904: (e, t, n) => {
			"use strict";
			const a = n(788),
			i = n(85),
			r = {
				attributeNamePrefix: "@_",
				attributesGroupName: !1,
				textNodeName: "#text",
				ignoreAttributes: !0,
				cdataPropName: !1,
				format: !1,
				indentBy: "  ",
				suppressEmptyNode: !1,
				suppressUnpairedNode: !0,
				suppressBooleanAttributes: !0,
				tagValueProcessor: function (e, t) {
					return t
				},
				attributeValueProcessor: function (e, t) {
					return t
				},
				preserveOrder: !1,
				commentPropName: !1,
				unpairedTags: [],
				entities: [{
						regex: new RegExp("&", "g"),
						val: "&amp;"
					}, {
						regex: new RegExp(">", "g"),
						val: "&gt;"
					}, {
						regex: new RegExp("<", "g"),
						val: "&lt;"
					}, {
						regex: new RegExp("'", "g"),
						val: "&apos;"
					}, {
						regex: new RegExp('"', "g"),
						val: "&quot;"
					}
				],
				processEntities: !0,
				stopNodes: [],
				oneListGroup: !1
			};

			function o(e) {
				this.options = Object.assign({}, r, e),
				!0 === this.options.ignoreAttributes || this.options.attributesGroupName ? this.isAttribute = function () {
					return !1
				}
				 : (this.ignoreAttributesFn = i(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = u),
				this.processTextOrObjNode = s,
				this.options.format ? (this.indentate = d, this.tagEndChar = ">\n", this.newLine = "\n") : (this.indentate = function () {
					return ""
				}, this.tagEndChar = ">", this.newLine = "")
			}

			function s(e, t, n, a) {
				const i = this.j2x(e, n + 1, a.concat(t));
				return void 0 !== e[this.options.textNodeName] && 1 === Object.keys(e).length ? this.buildTextValNode(e[this.options.textNodeName], t, i.attrStr, n) : this.buildObjectNode(i.val, t, i.attrStr, n)
			}

			function d(e) {
				return this.options.indentBy.repeat(e)
			}

			function u(e) {
				return !(!e.startsWith(this.options.attributeNamePrefix) || e === this.options.textNodeName) && e.substr(this.attrPrefixLen)
			}
			o.prototype.build = function (e) {
				return this.options.preserveOrder ? a(e, this.options) : (Array.isArray(e) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (e = {
							[this.options.arrayNodeName]: e
						}), this.j2x(e, 0, []).val)
			},
			o.prototype.j2x = function (e, t, n) {
				let a = "",
				i = "";
				const r = n.join(".");
				for (let o in e)
					if (Object.prototype.hasOwnProperty.call(e, o))
						if (void 0 === e[o])
							this.isAttribute(o) && (i += "");
						else if (null === e[o])
							this.isAttribute(o) ? i += "" : "?" === o[0] ? i += this.indentate(t) + "<" + o + "?" + this.tagEndChar : i += this.indentate(t) + "<" + o + "/" + this.tagEndChar;
						else if (e[o]instanceof Date)
							i += this.buildTextValNode(e[o], o, "", t);
						else if ("object" != typeof e[o]) {
							const n = this.isAttribute(o);
							if (n && !this.ignoreAttributesFn(n, r))
								a += this.buildAttrPairStr(n, "" + e[o]);
							else if (!n)
								if (o === this.options.textNodeName) {
									let t = this.options.tagValueProcessor(o, "" + e[o]);
									i += this.replaceEntitiesValue(t)
								} else
									i += this.buildTextValNode(e[o], o, "", t)
						} else if (Array.isArray(e[o])) {
							const a = e[o].length;
							let r = "",
							s = "";
							for (let d = 0; d < a; d++) {
								const a = e[o][d];
								if (void 0 === a);
								else if (null === a)
									"?" === o[0] ? i += this.indentate(t) + "<" + o + "?" + this.tagEndChar : i += this.indentate(t) + "<" + o + "/" + this.tagEndChar;
								else if ("object" == typeof a)
									if (this.options.oneListGroup) {
										const e = this.j2x(a, t + 1, n.concat(o));
										r += e.val,
										this.options.attributesGroupName && a.hasOwnProperty(this.options.attributesGroupName) && (s += e.attrStr)
									} else
										r += this.processTextOrObjNode(a, o, t, n);
								else if (this.options.oneListGroup) {
									let e = this.options.tagValueProcessor(o, a);
									e = this.replaceEntitiesValue(e),
									r += e
								} else
									r += this.buildTextValNode(a, o, "", t)
							}
							this.options.oneListGroup && (r = this.buildObjectNode(r, o, s, t)),
							i += r
						} else if (this.options.attributesGroupName && o === this.options.attributesGroupName) {
							const t = Object.keys(e[o]),
							n = t.length;
							for (let i = 0; i < n; i++)
								a += this.buildAttrPairStr(t[i], "" + e[o][t[i]])
						} else
							i += this.processTextOrObjNode(e[o], o, t, n);
				return {
					attrStr: a,
					val: i
				}
			},
			o.prototype.buildAttrPairStr = function (e, t) {
				return t = this.options.attributeValueProcessor(e, "" + t),
				t = this.replaceEntitiesValue(t),
				this.options.suppressBooleanAttributes && "true" === t ? " " + e : " " + e + '="' + t + '"'
			},
			o.prototype.buildObjectNode = function (e, t, n, a) {
				if ("" === e)
					return "?" === t[0] ? this.indentate(a) + "<" + t + n + "?" + this.tagEndChar : this.indentate(a) + "<" + t + n + this.closeTag(t) + this.tagEndChar; {
					let i = "</" + t + this.tagEndChar,
					r = "";
					return "?" === t[0] && (r = "?", i = ""),
					!n && "" !== n || -1 !== e.indexOf("<") ? !1 !== this.options.commentPropName && t === this.options.commentPropName && 0 === r.length ? this.indentate(a) + `\x3c!--${e}--\x3e` + this.newLine : this.indentate(a) + "<" + t + n + r + this.tagEndChar + e + this.indentate(a) + i : this.indentate(a) + "<" + t + n + r + ">" + e + i
				}
			},
			o.prototype.closeTag = function (e) {
				let t = "";
				return -1 !== this.options.unpairedTags.indexOf(e) ? this.options.suppressUnpairedNode || (t = "/") : t = this.options.suppressEmptyNode ? "/" : `></${e}`,
				t
			},
			o.prototype.buildTextValNode = function (e, t, n, a) {
				if (!1 !== this.options.cdataPropName && t === this.options.cdataPropName)
					return this.indentate(a) + `<![CDATA[${e}]]>` + this.newLine;
				if (!1 !== this.options.commentPropName && t === this.options.commentPropName)
					return this.indentate(a) + `\x3c!--${e}--\x3e` + this.newLine;
				if ("?" === t[0])
					return this.indentate(a) + "<" + t + n + "?" + this.tagEndChar; {
					let i = this.options.tagValueProcessor(t, e);
					return i = this.replaceEntitiesValue(i),
					"" === i ? this.indentate(a) + "<" + t + n + this.closeTag(t) + this.tagEndChar : this.indentate(a) + "<" + t + n + ">" + i + "</" + t + this.tagEndChar
				}
			},
			o.prototype.replaceEntitiesValue = function (e) {
				if (e && e.length > 0 && this.options.processEntities)
					for (let t = 0; t < this.options.entities.length; t++) {
						const n = this.options.entities[t];
						e = e.replace(n.regex, n.val)
					}
				return e
			},
			e.exports = o
		},
		788: e => {
			function t(e, o, s, d) {
				let u = "",
				m = !1;
				for (let l = 0; l < e.length; l++) {
					const h = e[l],
					c = n(h);
					if (void 0 === c)
						continue;
					let g = "";
					if (g = 0 === s.length ? c : `${s}.${c}`, c === o.textNodeName) {
						let e = h[c];
						i(g, o) || (e = o.tagValueProcessor(c, e), e = r(e, o)),
						m && (u += d),
						u += e,
						m = !1;
						continue
					}
					if (c === o.cdataPropName) {
						m && (u += d),
						u += `<![CDATA[${h[c][0][o.textNodeName]}]]>`,
						m = !1;
						continue
					}
					if (c === o.commentPropName) {
						u += d + `\x3c!--${h[c][0][o.textNodeName]}--\x3e`,
						m = !0;
						continue
					}
					if ("?" === c[0]) {
						const e = a(h[":@"], o),
						t = "?xml" === c ? "" : d;
						let n = h[c][0][o.textNodeName];
						n = 0 !== n.length ? " " + n : "",
						u += t + `<${c}${n}${e}?>`,
						m = !0;
						continue
					}
					let f = d;
					"" !== f && (f += o.indentBy);
					const p = d + `<${c}${a(h[":@"], o)}`,
					v = t(h[c], o, g, f);
					 - 1 !== o.unpairedTags.indexOf(c) ? o.suppressUnpairedNode ? u += p + ">" : u += p + "/>" : v && 0 !== v.length || !o.suppressEmptyNode ? v && v.endsWith(">") ? u += p + `>${v}${d}</${c}>` : (u += p + ">", v && "" !== d && (v.includes("/>") || v.includes("</")) ? u += d + o.indentBy + v + d : u += v, u += `</${c}>`) : u += p + "/>",
					m = !0
				}
				return u
			}

			function n(e) {
				const t = Object.keys(e);
				for (let n = 0; n < t.length; n++) {
					const a = t[n];
					if (e.hasOwnProperty(a) && ":@" !== a)
						return a
				}
			}

			function a(e, t) {
				let n = "";
				if (e && !t.ignoreAttributes)
					for (let a in e) {
						if (!e.hasOwnProperty(a))
							continue;
						let i = t.attributeValueProcessor(a, e[a]);
						i = r(i, t),
						!0 === i && t.suppressBooleanAttributes ? n += ` ${a.substr(t.attributeNamePrefix.length)}` : n += ` ${a.substr(t.attributeNamePrefix.length)}="${i}"`
					}
				return n
			}

			function i(e, t) {
				let n = (e = e.substr(0, e.length - t.textNodeName.length - 1)).substr(e.lastIndexOf(".") + 1);
				for (let a in t.stopNodes)
					if (t.stopNodes[a] === e || t.stopNodes[a] === "*." + n)
						return !0;
				return !1
			}

			function r(e, t) {
				if (e && e.length > 0 && t.processEntities)
					for (let n = 0; n < t.entities.length; n++) {
						const a = t.entities[n];
						e = e.replace(a.regex, a.val)
					}
				return e
			}
			e.exports = function (e, n) {
				let a = "";
				return n.format && n.indentBy.length > 0 && (a = "\n"),
				t(e, n, "", a)
			}
		},
		400: (e, t, n) => {
			const a = n(334);

			function i(e, t) {
				let n = "";
				for (; t < e.length && "'" !== e[t] && '"' !== e[t]; t++)
					n += e[t];
				if (n = n.trim(), -1 !== n.indexOf(" "))
					throw new Error("External entites are not supported");
				const a = e[t++];
				let i = "";
				for (; t < e.length && e[t] !== a; t++)
					i += e[t];
				return [n, i, t]
			}

			function r(e, t) {
				return "!" === e[t + 1] && "-" === e[t + 2] && "-" === e[t + 3]
			}

			function o(e, t) {
				return "!" === e[t + 1] && "E" === e[t + 2] && "N" === e[t + 3] && "T" === e[t + 4] && "I" === e[t + 5] && "T" === e[t + 6] && "Y" === e[t + 7]
			}

			function s(e, t) {
				return "!" === e[t + 1] && "E" === e[t + 2] && "L" === e[t + 3] && "E" === e[t + 4] && "M" === e[t + 5] && "E" === e[t + 6] && "N" === e[t + 7] && "T" === e[t + 8]
			}

			function d(e, t) {
				return "!" === e[t + 1] && "A" === e[t + 2] && "T" === e[t + 3] && "T" === e[t + 4] && "L" === e[t + 5] && "I" === e[t + 6] && "S" === e[t + 7] && "T" === e[t + 8]
			}

			function u(e, t) {
				return "!" === e[t + 1] && "N" === e[t + 2] && "O" === e[t + 3] && "T" === e[t + 4] && "A" === e[t + 5] && "T" === e[t + 6] && "I" === e[t + 7] && "O" === e[t + 8] && "N" === e[t + 9]
			}

			function m(e) {
				if (a.isName(e))
					return e;
				throw new Error(`Invalid entity name ${e}`)
			}
			e.exports = function (e, t) {
				const n = {};
				if ("O" !== e[t + 3] || "C" !== e[t + 4] || "T" !== e[t + 5] || "Y" !== e[t + 6] || "P" !== e[t + 7] || "E" !== e[t + 8])
					throw new Error("Invalid Tag instead of DOCTYPE"); {
					t += 9;
					let a = 1,
					l = !1,
					h = !1,
					c = "";
					for (; t < e.length; t++)
						if ("<" !== e[t] || h)
							if (">" === e[t]) {
								if (h ? "-" === e[t - 1] && "-" === e[t - 2] && (h = !1, a--) : a--, 0 === a)
									break
							} else
								"[" === e[t] ? l = !0 : c += e[t];
						else {
							if (l && o(e, t))
								t += 7, [entityName, val, t] = i(e, t + 1), -1 === val.indexOf("&") && (n[m(entityName)] = {
										regx: RegExp(`&${entityName};`, "g"),
										val
									});
							else if (l && s(e, t))
								t += 8;
							else if (l && d(e, t))
								t += 8;
							else if (l && u(e, t))
								t += 9;
							else {
								if (!r)
									throw new Error("Invalid DOCTYPE");
								h = !0
							}
							a++,
							c = ""
						}
					if (0 !== a)
						throw new Error("Unclosed DOCTYPE")
				}
				return {
					entities: n,
					i: t
				}
			}
		},
		460: (e, t) => {
			const n = {
				preserveOrder: !1,
				attributeNamePrefix: "@_",
				attributesGroupName: !1,
				textNodeName: "#text",
				ignoreAttributes: !0,
				removeNSPrefix: !1,
				allowBooleanAttributes: !1,
				parseTagValue: !0,
				parseAttributeValue: !1,
				trimValues: !0,
				cdataPropName: !1,
				numberParseOptions: {
					hex: !0,
					leadingZeros: !0,
					eNotation: !0
				},
				tagValueProcessor: function (e, t) {
					return t
				},
				attributeValueProcessor: function (e, t) {
					return t
				},
				stopNodes: [],
				alwaysCreateTextNode: !1,
				isArray: () => !1,
				commentPropName: !1,
				unpairedTags: [],
				processEntities: !0,
				htmlEntities: !1,
				ignoreDeclaration: !1,
				ignorePiTags: !1,
				transformTagName: !1,
				transformAttributeName: !1,
				updateTag: function (e, t, n) {
					return e
				}
			};
			t.buildOptions = function (e) {
				return Object.assign({}, n, e)
			},
			t.defaultOptions = n
		},
		680: (e, t, n) => {
			"use strict";
			const a = n(334),
			i = n(832),
			r = n(400),
			o = n(983),
			s = n(85);

			function d(e) {
				const t = Object.keys(e);
				for (let n = 0; n < t.length; n++) {
					const a = t[n];
					this.lastEntities[a] = {
						regex: new RegExp("&" + a + ";", "g"),
						val: e[a]
					}
				}
			}

			function u(e, t, n, a, i, r, o) {
				if (void 0 !== e && (this.options.trimValues && !a && (e = e.trim()), e.length > 0)) {
					o || (e = this.replaceEntitiesValue(e));
					const a = this.options.tagValueProcessor(t, e, n, i, r);
					if (null == a)
						return e;
					if (typeof a != typeof e || a !== e)
						return a;
					if (this.options.trimValues)
						return M(e, this.options.parseTagValue, this.options.numberParseOptions);
					return e.trim() === e ? M(e, this.options.parseTagValue, this.options.numberParseOptions) : e
				}
			}

			function m(e) {
				if (this.options.removeNSPrefix) {
					const t = e.split(":"),
					n = "/" === e.charAt(0) ? "/" : "";
					if ("xmlns" === t[0])
						return "";
					2 === t.length && (e = n + t[1])
				}
				return e
			}
			const l = new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?", "gm");

			function h(e, t, n) {
				if (!0 !== this.options.ignoreAttributes && "string" == typeof e) {
					const n = a.getAllMatches(e, l),
					i = n.length,
					r = {};
					for (let e = 0; e < i; e++) {
						const a = this.resolveNameSpace(n[e][1]);
						if (this.ignoreAttributesFn(a, t))
							continue;
						let i = n[e][4],
						o = this.options.attributeNamePrefix + a;
						if (a.length)
							if (this.options.transformAttributeName && (o = this.options.transformAttributeName(o)), "__proto__" === o && (o = "#__proto__"), void 0 !== i) {
								this.options.trimValues && (i = i.trim()),
								i = this.replaceEntitiesValue(i);
								const e = this.options.attributeValueProcessor(a, i, t);
								r[o] = null == e ? i : typeof e != typeof i || e !== i ? e : M(i, this.options.parseAttributeValue, this.options.numberParseOptions)
							} else
								this.options.allowBooleanAttributes && (r[o] = !0)
					}
					if (!Object.keys(r).length)
						return;
					if (this.options.attributesGroupName) {
						const e = {};
						return e[this.options.attributesGroupName] = r,
						e
					}
					return r
				}
			}
			const c = function (e) {
				e = e.replace(/\r\n?/g, "\n");
				const t = new i("!xml");
				let n = t,
				a = "",
				o = "";
				for (let s = 0; s < e.length; s++) {
					if ("<" === e[s])
						if ("/" === e[s + 1]) {
							const t = b(e, ">", s, "Closing Tag is not closed.");
							let i = e.substring(s + 2, t).trim();
							if (this.options.removeNSPrefix) {
								const e = i.indexOf(":");
								 - 1 !== e && (i = i.substr(e + 1))
							}
							this.options.transformTagName && (i = this.options.transformTagName(i)),
							n && (a = this.saveTextToParentTag(a, n, o));
							const r = o.substring(o.lastIndexOf(".") + 1);
							if (i && -1 !== this.options.unpairedTags.indexOf(i))
								throw new Error(`Unpaired tag can not be used as closing tag: </${i}>`);
							let d = 0;
							r && -1 !== this.options.unpairedTags.indexOf(r) ? (d = o.lastIndexOf(".", o.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : d = o.lastIndexOf("."),
							o = o.substring(0, d),
							n = this.tagsNodeStack.pop(),
							a = "",
							s = t
						} else if ("?" === e[s + 1]) {
							let t = w(e, s, !1, "?>");
							if (!t)
								throw new Error("Pi Tag is not closed.");
							if (a = this.saveTextToParentTag(a, n, o), this.options.ignoreDeclaration && "?xml" === t.tagName || this.options.ignorePiTags);
							else {
								const e = new i(t.tagName);
								e.add(this.options.textNodeName, ""),
								t.tagName !== t.tagExp && t.attrExpPresent && (e[":@"] = this.buildAttributesMap(t.tagExp, o, t.tagName)),
								this.addChild(n, e, o)
							}
							s = t.closeIndex + 1
						} else if ("!--" === e.substr(s + 1, 3)) {
							const t = b(e, "--\x3e", s + 4, "Comment is not closed.");
							if (this.options.commentPropName) {
								const i = e.substring(s + 4, t - 2);
								a = this.saveTextToParentTag(a, n, o),
								n.add(this.options.commentPropName, [{
											[this.options.textNodeName]: i
										}
									])
							}
							s = t
						} else if ("!D" === e.substr(s + 1, 2)) {
							const t = r(e, s);
							this.docTypeEntities = t.entities,
							s = t.i
						} else if ("![" === e.substr(s + 1, 2)) {
							const t = b(e, "]]>", s, "CDATA is not closed.") - 2,
							i = e.substring(s + 9, t);
							a = this.saveTextToParentTag(a, n, o);
							let r = this.parseTextData(i, n.tagname, o, !0, !1, !0, !0);
							null == r && (r = ""),
							this.options.cdataPropName ? n.add(this.options.cdataPropName, [{
										[this.options.textNodeName]: i
									}
								]) : n.add(this.options.textNodeName, r),
							s = t + 2
						} else {
							let r = w(e, s, this.options.removeNSPrefix),
							d = r.tagName;
							const u = r.rawTagName;
							let m = r.tagExp,
							l = r.attrExpPresent,
							h = r.closeIndex;
							this.options.transformTagName && (d = this.options.transformTagName(d)),
							n && a && "!xml" !== n.tagname && (a = this.saveTextToParentTag(a, n, o, !1));
							const c = n;
							if (c && -1 !== this.options.unpairedTags.indexOf(c.tagname) && (n = this.tagsNodeStack.pop(), o = o.substring(0, o.lastIndexOf("."))), d !== t.tagname && (o += o ? "." + d : d), this.isItStopNode(this.options.stopNodes, o, d)) {
								let t = "";
								if (m.length > 0 && m.lastIndexOf("/") === m.length - 1)
									"/" === d[d.length - 1] ? (d = d.substr(0, d.length - 1), o = o.substr(0, o.length - 1), m = d) : m = m.substr(0, m.length - 1), s = r.closeIndex;
								else if (-1 !== this.options.unpairedTags.indexOf(d))
									s = r.closeIndex;
								else {
									const n = this.readStopNodeData(e, u, h + 1);
									if (!n)
										throw new Error(`Unexpected end of ${u}`);
									s = n.i,
									t = n.tagContent
								}
								const a = new i(d);
								d !== m && l && (a[":@"] = this.buildAttributesMap(m, o, d)),
								t && (t = this.parseTextData(t, d, o, !0, l, !0, !0)),
								o = o.substr(0, o.lastIndexOf(".")),
								a.add(this.options.textNodeName, t),
								this.addChild(n, a, o)
							} else {
								if (m.length > 0 && m.lastIndexOf("/") === m.length - 1) {
									"/" === d[d.length - 1] ? (d = d.substr(0, d.length - 1), o = o.substr(0, o.length - 1), m = d) : m = m.substr(0, m.length - 1),
									this.options.transformTagName && (d = this.options.transformTagName(d));
									const e = new i(d);
									d !== m && l && (e[":@"] = this.buildAttributesMap(m, o, d)),
									this.addChild(n, e, o),
									o = o.substr(0, o.lastIndexOf("."))
								} else {
									const e = new i(d);
									this.tagsNodeStack.push(n),
									d !== m && l && (e[":@"] = this.buildAttributesMap(m, o, d)),
									this.addChild(n, e, o),
									n = e
								}
								a = "",
								s = h
							}
						}
					else
						a += e[s]
				}
				return t.child
			};

			function g(e, t, n) {
				const a = this.options.updateTag(t.tagname, n, t[":@"]);
				!1 === a || ("string" == typeof a ? (t.tagname = a, e.addChild(t)) : e.addChild(t))
			}
			const f = function (e) {
				if (this.options.processEntities) {
					for (let t in this.docTypeEntities) {
						const n = this.docTypeEntities[t];
						e = e.replace(n.regx, n.val)
					}
					for (let t in this.lastEntities) {
						const n = this.lastEntities[t];
						e = e.replace(n.regex, n.val)
					}
					if (this.options.htmlEntities)
						for (let t in this.htmlEntities) {
							const n = this.htmlEntities[t];
							e = e.replace(n.regex, n.val)
						}
					e = e.replace(this.ampEntity.regex, this.ampEntity.val)
				}
				return e
			};

			function p(e, t, n, a) {
				return e && (void 0 === a && (a = 0 === Object.keys(t.child).length), void 0 !== (e = this.parseTextData(e, t.tagname, n, !1, !!t[":@"] && 0 !== Object.keys(t[":@"]).length, a)) && "" !== e && t.add(this.options.textNodeName, e), e = ""),
				e
			}

			function v(e, t, n) {
				const a = "*." + n;
				for (const n in e) {
					const i = e[n];
					if (a === i || t === i)
						return !0
				}
				return !1
			}

			function b(e, t, n, a) {
				const i = e.indexOf(t, n);
				if (-1 === i)
					throw new Error(a);
				return i + t.length - 1
			}

			function w(e, t, n, a = ">") {
				const i = function (e, t, n = ">") {
					let a,
					i = "";
					for (let r = t; r < e.length; r++) {
						let t = e[r];
						if (a)
							t === a && (a = "");
						else if ('"' === t || "'" === t)
							a = t;
						else if (t === n[0]) {
							if (!n[1])
								return {
									data: i,
									index: r
								};
							if (e[r + 1] === n[1])
								return {
									data: i,
									index: r
								}
						} else
							"\t" === t && (t = " ");
						i += t
					}
				}
				(e, t + 1, a);
				if (!i)
					return;
				let r = i.data;
				const o = i.index,
				s = r.search(/\s/);
				let d = r,
				u = !0;
				 - 1 !== s && (d = r.substring(0, s), r = r.substring(s + 1).trimStart());
				const m = d;
				if (n) {
					const e = d.indexOf(":");
					 - 1 !== e && (d = d.substr(e + 1), u = d !== i.data.substr(e + 1))
				}
				return {
					tagName: d,
					tagExp: r,
					closeIndex: o,
					attrExpPresent: u,
					rawTagName: m
				}
			}

			function y(e, t, n) {
				const a = n;
				let i = 1;
				for (; n < e.length; n++)
					if ("<" === e[n])
						if ("/" === e[n + 1]) {
							const r = b(e, ">", n, `${t} is not closed`);
							if (e.substring(n + 2, r).trim() === t && (i--, 0 === i))
								return {
									tagContent: e.substring(a, n),
									i: r
								};
							n = r
						} else if ("?" === e[n + 1]) {
							n = b(e, "?>", n + 1, "StopNode is not closed.")
						} else if ("!--" === e.substr(n + 1, 3)) {
							n = b(e, "--\x3e", n + 3, "StopNode is not closed.")
						} else if ("![" === e.substr(n + 1, 2)) {
							n = b(e, "]]>", n, "StopNode is not closed.") - 2
						} else {
							const a = w(e, n, ">");
							if (a) {
								(a && a.tagName) === t && "/" !== a.tagExp[a.tagExp.length - 1] && i++,
								n = a.closeIndex
							}
						}
			}

			function M(e, t, n) {
				if (t && "string" == typeof e) {
					const t = e.trim();
					return "true" === t || "false" !== t && o(e, n)
				}
				return a.isExist(e) ? e : ""
			}
			e.exports = class {
				constructor(e) {
					this.options = e,
					this.currentNode = null,
					this.tagsNodeStack = [],
					this.docTypeEntities = {},
					this.lastEntities = {
						apos: {
							regex: /&(apos|#39|#x27);/g,
							val: "'"
						},
						gt: {
							regex: /&(gt|#62|#x3E);/g,
							val: ">"
						},
						lt: {
							regex: /&(lt|#60|#x3C);/g,
							val: "<"
						},
						quot: {
							regex: /&(quot|#34|#x22);/g,
							val: '"'
						}
					},
					this.ampEntity = {
						regex: /&(amp|#38|#x26);/g,
						val: "&"
					},
					this.htmlEntities = {
						space: {
							regex: /&(nbsp|#160);/g,
							val: " "
						},
						cent: {
							regex: /&(cent|#162);/g,
							val: "¢"
						},
						pound: {
							regex: /&(pound|#163);/g,
							val: "£"
						},
						yen: {
							regex: /&(yen|#165);/g,
							val: "¥"
						},
						euro: {
							regex: /&(euro|#8364);/g,
							val: "€"
						},
						copyright: {
							regex: /&(copy|#169);/g,
							val: "©"
						},
						reg: {
							regex: /&(reg|#174);/g,
							val: "®"
						},
						inr: {
							regex: /&(inr|#8377);/g,
							val: "₹"
						},
						num_dec: {
							regex: /&#([0-9]{1,7});/g,
							val: (e, t) => String.fromCharCode(Number.parseInt(t, 10))
						},
						num_hex: {
							regex: /&#x([0-9a-fA-F]{1,6});/g,
							val: (e, t) => String.fromCharCode(Number.parseInt(t, 16))
						}
					},
					this.addExternalEntities = d,
					this.parseXml = c,
					this.parseTextData = u,
					this.resolveNameSpace = m,
					this.buildAttributesMap = h,
					this.isItStopNode = v,
					this.replaceEntitiesValue = f,
					this.readStopNodeData = y,
					this.saveTextToParentTag = p,
					this.addChild = g,
					this.ignoreAttributesFn = s(this.options.ignoreAttributes)
				}
			}
		},
		923: (e, t, n) => {
			const {
				buildOptions: a
			} = n(460),
			i = n(680), {
				prettify: r
			} = n(629),
			o = n(918);
			e.exports = class {
				constructor(e) {
					this.externalEntities = {},
					this.options = a(e)
				}
				parse(e, t) {
					if ("string" == typeof e);
					else {
						if (!e.toString)
							throw new Error("XML data is accepted in String or Bytes[] form.");
						e = e.toString()
					}
					if (t) {
						!0 === t && (t = {});
						const n = o.validate(e, t);
						if (!0 !== n)
							throw Error(`${n.err.msg}:${n.err.line}:${n.err.col}`)
					}
					const n = new i(this.options);
					n.addExternalEntities(this.externalEntities);
					const a = n.parseXml(e);
					return this.options.preserveOrder || void 0 === a ? a : r(a, this.options)
				}
				addEntity(e, t) {
					if (-1 !== t.indexOf("&"))
						throw new Error("Entity value can't have '&'");
					if (-1 !== e.indexOf("&") || -1 !== e.indexOf(";"))
						throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
					if ("&" === t)
						throw new Error("An entity with value '&' is not permitted");
					this.externalEntities[e] = t
				}
			}
		},
		629: (e, t) => {
			"use strict";

			function n(e, t, o) {
				let s;
				const d = {};
				for (let u = 0; u < e.length; u++) {
					const m = e[u],
					l = a(m);
					let h = "";
					if (h = void 0 === o ? l : o + "." + l, l === t.textNodeName)
						void 0 === s ? s = m[l] : s += "" + m[l];
					else {
						if (void 0 === l)
							continue;
						if (m[l]) {
							let e = n(m[l], t, h);
							const a = r(e, t);
							m[":@"] ? i(e, m[":@"], h, t) : 1 !== Object.keys(e).length || void 0 === e[t.textNodeName] || t.alwaysCreateTextNode ? 0 === Object.keys(e).length && (t.alwaysCreateTextNode ? e[t.textNodeName] = "" : e = "") : e = e[t.textNodeName],
							void 0 !== d[l] && d.hasOwnProperty(l) ? (Array.isArray(d[l]) || (d[l] = [d[l]]), d[l].push(e)) : t.isArray(l, h, a) ? d[l] = [e] : d[l] = e
						}
					}
				}
				return "string" == typeof s ? s.length > 0 && (d[t.textNodeName] = s) : void 0 !== s && (d[t.textNodeName] = s),
				d
			}

			function a(e) {
				const t = Object.keys(e);
				for (let e = 0; e < t.length; e++) {
					const n = t[e];
					if (":@" !== n)
						return n
				}
			}

			function i(e, t, n, a) {
				if (t) {
					const i = Object.keys(t),
					r = i.length;
					for (let o = 0; o < r; o++) {
						const r = i[o];
						a.isArray(r, n + "." + r, !0, !0) ? e[r] = [t[r]] : e[r] = t[r]
					}
				}
			}

			function r(e, t) {
				const {
					textNodeName: n
				} = t,
				a = Object.keys(e).length;
				return 0 === a || !(1 !== a || !e[n] && "boolean" != typeof e[n] && 0 !== e[n])
			}
			t.prettify = function (e, t) {
				return n(e, t)
			}
		},
		832: e => {
			"use strict";
			e.exports = class {
				constructor(e) {
					this.tagname = e,
					this.child = [],
					this[":@"] = {}
				}
				add(e, t) {
					"__proto__" === e && (e = "#__proto__"),
					this.child.push({
						[e]: t
					})
				}
				addChild(e) {
					"__proto__" === e.tagname && (e.tagname = "#__proto__"),
					e[":@"] && Object.keys(e[":@"]).length > 0 ? this.child.push({
						[e.tagname]: e.child,
						":@": e[":@"]
					}) : this.child.push({
						[e.tagname]: e.child
					})
				}
			}
		},
		10: function (e, t, n) {
			var a,
			i,
			r;
			i = [n(227)],
			void 0 === (r = "function" == typeof(a = function (e) {
						var t;
						e.register("locale", "bg", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "хил",
								million: "млн",
								billion: "млрд",
								trillion: "трлн"
							},
							ordinal: function (e) {
								return ""
							},
							currency: {
								symbol: "лв"
							}
						}),
						e.register("locale", "chs", {
							delimiters: {
								thousands: ",",
								decimal: "."
							},
							abbreviations: {
								thousand: "千",
								million: "百万",
								billion: "十亿",
								trillion: "兆"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "¥"
							}
						}),
						e.register("locale", "cs", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "tis.",
								million: "mil.",
								billion: "b",
								trillion: "t"
							},
							ordinal: function () {
								return "."
							},
							currency: {
								symbol: "Kč"
							}
						}),
						e.register("locale", "da-dk", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "mio",
								billion: "mia",
								trillion: "b"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "DKK"
							}
						}),
						e.register("locale", "de-ch", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "CHF"
							}
						}),
						e.register("locale", "de", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "en-au", {
							delimiters: {
								thousands: ",",
								decimal: "."
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								var t = e % 10;
								return 1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th"
							},
							currency: {
								symbol: "$"
							}
						}),
						e.register("locale", "en-gb", {
							delimiters: {
								thousands: ",",
								decimal: "."
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								var t = e % 10;
								return 1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th"
							},
							currency: {
								symbol: "£"
							}
						}),
						e.register("locale", "en-za", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								var t = e % 10;
								return 1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th"
							},
							currency: {
								symbol: "R"
							}
						}),
						e.register("locale", "es-es", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "mm",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								var t = e % 10;
								return 1 === t || 3 === t ? "er" : 2 === t ? "do" : 7 === t || 0 === t ? "mo" : 8 === t ? "vo" : 9 === t ? "no" : "to"
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "es", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "mm",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								var t = e % 10;
								return 1 === t || 3 === t ? "er" : 2 === t ? "do" : 7 === t || 0 === t ? "mo" : 8 === t ? "vo" : 9 === t ? "no" : "to"
							},
							currency: {
								symbol: "$"
							}
						}),
						e.register("locale", "et", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: " tuh",
								million: " mln",
								billion: " mld",
								trillion: " trl"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "fi", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "M",
								billion: "G",
								trillion: "T"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "fr-ca", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "M",
								billion: "G",
								trillion: "T"
							},
							ordinal: function (e) {
								return 1 === e ? "er" : "e"
							},
							currency: {
								symbol: "$"
							}
						}),
						e.register("locale", "fr-ch", {
							delimiters: {
								thousands: "'",
								decimal: "."
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								return 1 === e ? "er" : "e"
							},
							currency: {
								symbol: "CHF"
							}
						}),
						e.register("locale", "fr", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								return 1 === e ? "er" : "e"
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "hu", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "E",
								million: "M",
								billion: "Mrd",
								trillion: "T"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: " Ft"
							}
						}),
						e.register("locale", "it", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: "mila",
								million: "mil",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								return "º"
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "ja", {
							delimiters: {
								thousands: ",",
								decimal: "."
							},
							abbreviations: {
								thousand: "千",
								million: "百万",
								billion: "十億",
								trillion: "兆"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "¥"
							}
						}),
						e.register("locale", "lv", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: " tūkst.",
								million: " milj.",
								billion: " mljrd.",
								trillion: " trilj."
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "nl-be", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: " mln",
								billion: " mld",
								trillion: " bln"
							},
							ordinal: function (e) {
								var t = e % 100;
								return 0 !== e && t <= 1 || 8 === t || t >= 20 ? "ste" : "de"
							},
							currency: {
								symbol: "€ "
							}
						}),
						e.register("locale", "nl-nl", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "mln",
								billion: "mrd",
								trillion: "bln"
							},
							ordinal: function (e) {
								var t = e % 100;
								return 0 !== e && t <= 1 || 8 === t || t >= 20 ? "ste" : "de"
							},
							currency: {
								symbol: "€ "
							}
						}),
						e.register("locale", "no", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "kr"
							}
						}),
						e.register("locale", "pl", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "tys.",
								million: "mln",
								billion: "mld",
								trillion: "bln"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "PLN"
							}
						}),
						e.register("locale", "pt-br", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: "mil",
								million: "milhões",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								return "º"
							},
							currency: {
								symbol: "R$"
							}
						}),
						e.register("locale", "pt-pt", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "m",
								billion: "b",
								trillion: "t"
							},
							ordinal: function (e) {
								return "º"
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "ru-ua", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "тыс.",
								million: "млн",
								billion: "b",
								trillion: "t"
							},
							ordinal: function () {
								return "."
							},
							currency: {
								symbol: "₴"
							}
						}),
						e.register("locale", "ru", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "тыс.",
								million: "млн.",
								billion: "млрд.",
								trillion: "трлн."
							},
							ordinal: function () {
								return "."
							},
							currency: {
								symbol: "руб."
							}
						}),
						e.register("locale", "sk", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "tis.",
								million: "mil.",
								billion: "b",
								trillion: "t"
							},
							ordinal: function () {
								return "."
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "sl", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: "k",
								million: "mio",
								billion: "mrd",
								trillion: "trilijon"
							},
							ordinal: function () {
								return "."
							},
							currency: {
								symbol: "€"
							}
						}),
						e.register("locale", "th", {
							delimiters: {
								thousands: ",",
								decimal: "."
							},
							abbreviations: {
								thousand: "พัน",
								million: "ล้าน",
								billion: "พันล้าน",
								trillion: "ล้านล้าน"
							},
							ordinal: function (e) {
								return "."
							},
							currency: {
								symbol: "฿"
							}
						}),
						t = {
							1: "'inci",
							5: "'inci",
							8: "'inci",
							70: "'inci",
							80: "'inci",
							2: "'nci",
							7: "'nci",
							20: "'nci",
							50: "'nci",
							3: "'üncü",
							4: "'üncü",
							100: "'üncü",
							6: "'ncı",
							9: "'uncu",
							10: "'uncu",
							30: "'uncu",
							60: "'ıncı",
							90: "'ıncı"
						},
						e.register("locale", "tr", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: "bin",
								million: "milyon",
								billion: "milyar",
								trillion: "trilyon"
							},
							ordinal: function (e) {
								if (0 === e)
									return "'ıncı";
								var n = e % 10,
								a = e % 100 - n,
								i = e >= 100 ? 100 : null;
								return t[n] || t[a] || t[i]
							},
							currency: {
								symbol: "₺"
							}
						}),
						e.register("locale", "uk-ua", {
							delimiters: {
								thousands: " ",
								decimal: ","
							},
							abbreviations: {
								thousand: "тис.",
								million: "млн",
								billion: "млрд",
								trillion: "блн"
							},
							ordinal: function () {
								return ""
							},
							currency: {
								symbol: "₴"
							}
						}),
						e.register("locale", "vi", {
							delimiters: {
								thousands: ".",
								decimal: ","
							},
							abbreviations: {
								thousand: " nghìn",
								million: " triệu",
								billion: " tỷ",
								trillion: " nghìn tỷ"
							},
							ordinal: function () {
								return "."
							},
							currency: {
								symbol: "₫"
							}
						})
					}) ? a.apply(t, i) : a) || (e.exports = r)
		},
		227: function (e, t, n) {
			var a,
			i;
			a = function () {
				var e,
				t,
				n,
				a,
				i,
				r = "2.0.6",
				o = {},
				s = {},
				d = {
					currentLocale: "en",
					zeroFormat: null,
					nullFormat: null,
					defaultFormat: "0,0",
					scalePercentBy100: !0
				},
				u = {
					currentLocale: d.currentLocale,
					zeroFormat: d.zeroFormat,
					nullFormat: d.nullFormat,
					defaultFormat: d.defaultFormat,
					scalePercentBy100: d.scalePercentBy100
				};

				function m(e, t) {
					this._input = e,
					this._value = t
				}
				return (e = function (n) {
					var a,
					i,
					r,
					s;
					if (e.isNumeral(n))
						a = n.value();
					else if (0 === n || void 0 === n)
						a = 0;
					else if (null === n || t.isNaN(n))
						a = null;
					else if ("string" == typeof n)
						if (u.zeroFormat && n === u.zeroFormat)
							a = 0;
						else if (u.nullFormat && n === u.nullFormat || !n.replace(/[^0-9]+/g, "").length)
							a = null;
						else {
							for (i in o)
								if ((s = "function" == typeof o[i].regexps.unformat ? o[i].regexps.unformat() : o[i].regexps.unformat) && n.match(s)) {
									r = o[i].unformat;
									break
								}
							a = (r = r || e._.stringToNumber)(n)
						}
					else
						a = Number(n) || null;
					return new m(n, a)
				}).version = r,
				e.isNumeral = function (e) {
					return e instanceof m
				},
				e._ = t = {
					numberToFormat: function (t, n, a) {
						var i,
						r,
						o,
						d,
						u,
						m,
						l,
						h = s[e.options.currentLocale],
						c = !1,
						g = !1,
						f = 0,
						p = "",
						v = 1e12,
						b = 1e9,
						w = 1e6,
						y = 1e3,
						M = "",
						k = !1;
						if (t = t || 0, r = Math.abs(t), e._.includes(n, "(") ? (c = !0, n = n.replace(/[\(|\)]/g, "")) : (e._.includes(n, "+") || e._.includes(n, "-")) && (u = e._.includes(n, "+") ? n.indexOf("+") : t < 0 ? n.indexOf("-") : -1, n = n.replace(/[\+|\-]/g, "")), e._.includes(n, "a") && (i = !!(i = n.match(/a(k|m|b|t)?/)) && i[1], e._.includes(n, " a") && (p = " "), n = n.replace(new RegExp(p + "a[kmbt]?"), ""), r >= v && !i || "t" === i ? (p += h.abbreviations.trillion, t /= v) : r < v && r >= b && !i || "b" === i ? (p += h.abbreviations.billion, t /= b) : r < b && r >= w && !i || "m" === i ? (p += h.abbreviations.million, t /= w) : (r < w && r >= y && !i || "k" === i) && (p += h.abbreviations.thousand, t /= y)), e._.includes(n, "[.]") && (g = !0, n = n.replace("[.]", ".")), o = t.toString().split(".")[0], d = n.split(".")[1], m = n.indexOf(","), f = (n.split(".")[0].split(",")[0].match(/0/g) || []).length, d ? (e._.includes(d, "[") ? (d = (d = d.replace("]", "")).split("["), M = e._.toFixed(t, d[0].length + d[1].length, a, d[1].length)) : M = e._.toFixed(t, d.length, a), o = M.split(".")[0], M = e._.includes(M, ".") ? h.delimiters.decimal + M.split(".")[1] : "", g && 0 === Number(M.slice(1)) && (M = "")) : o = e._.toFixed(t, 0, a), p && !i && Number(o) >= 1e3 && p !== h.abbreviations.trillion)
							switch (o = String(Number(o) / 1e3), p) {
							case h.abbreviations.thousand:
								p = h.abbreviations.million;
								break;
							case h.abbreviations.million:
								p = h.abbreviations.billion;
								break;
							case h.abbreviations.billion:
								p = h.abbreviations.trillion
							}
						if (e._.includes(o, "-") && (o = o.slice(1), k = !0), o.length < f)
							for (var P = f - o.length; P > 0; P--)
								o = "0" + o;
						return m > -1 && (o = o.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + h.delimiters.thousands)),
						0 === n.indexOf(".") && (o = ""),
						l = o + M + (p || ""),
						c ? l = (c && k ? "(" : "") + l + (c && k ? ")" : "") : u >= 0 ? l = 0 === u ? (k ? "-" : "+") + l : l + (k ? "-" : "+") : k && (l = "-" + l),
						l
					},
					stringToNumber: function (e) {
						var t,
						n,
						a,
						i = s[u.currentLocale],
						r = e,
						o = {
							thousand: 3,
							million: 6,
							billion: 9,
							trillion: 12
						};
						if (u.zeroFormat && e === u.zeroFormat)
							n = 0;
						else if (u.nullFormat && e === u.nullFormat || !e.replace(/[^0-9]+/g, "").length)
							n = null;
						else {
							for (t in n = 1, "." !== i.delimiters.decimal && (e = e.replace(/\./g, "").replace(i.delimiters.decimal, ".")), o)
								if (a = new RegExp("[^a-zA-Z]" + i.abbreviations[t] + "(?:\\)|(\\" + i.currency.symbol + ")?(?:\\))?)?$"), r.match(a)) {
									n *= Math.pow(10, o[t]);
									break
								}
							n *= (e.split("-").length + Math.min(e.split("(").length - 1, e.split(")").length - 1)) % 2 ? 1 : -1,
							e = e.replace(/[^0-9\.]+/g, ""),
							n *= Number(e)
						}
						return n
					},
					isNaN: function (e) {
						return "number" == typeof e && isNaN(e)
					},
					includes: function (e, t) {
						return -1 !== e.indexOf(t)
					},
					insert: function (e, t, n) {
						return e.slice(0, n) + t + e.slice(n)
					},
					reduce: function (e, t) {
						if (null === this)
							throw new TypeError("Array.prototype.reduce called on null or undefined");
						if ("function" != typeof t)
							throw new TypeError(t + " is not a function");
						var n,
						a = Object(e),
						i = a.length >>> 0,
						r = 0;
						if (3 === arguments.length)
							n = arguments[2];
						else {
							for (; r < i && !(r in a); )
								r++;
							if (r >= i)
								throw new TypeError("Reduce of empty array with no initial value");
							n = a[r++]
						}
						for (; r < i; r++)
							r in a && (n = t(n, a[r], r, a));
						return n
					},
					multiplier: function (e) {
						var t = e.toString().split(".");
						return t.length < 2 ? 1 : Math.pow(10, t[1].length)
					},
					correctionFactor: function () {
						return Array.prototype.slice.call(arguments).reduce((function (e, n) {
								var a = t.multiplier(n);
								return e > a ? e : a
							}), 1)
					},
					toFixed: function (e, t, n, a) {
						var i,
						r,
						o,
						s,
						d = e.toString().split("."),
						u = t - (a || 0);
						return i = 2 === d.length ? Math.min(Math.max(d[1].length, u), t) : u,
						o = Math.pow(10, i),
						s = (n(e + "e+" + i) / o).toFixed(i),
						a > t - i && (r = new RegExp("\\.?0{1," + (a - (t - i)) + "}$"), s = s.replace(r, "")),
						s
					}
				},
				e.options = u,
				e.formats = o,
				e.locales = s,
				e.locale = function (e) {
					return e && (u.currentLocale = e.toLowerCase()),
					u.currentLocale
				},
				e.localeData = function (e) {
					if (!e)
						return s[u.currentLocale];
					if (e = e.toLowerCase(), !s[e])
						throw new Error("Unknown locale : " + e);
					return s[e]
				},
				e.reset = function () {
					for (var e in d)
						u[e] = d[e]
				},
				e.zeroFormat = function (e) {
					u.zeroFormat = "string" == typeof e ? e : null
				},
				e.nullFormat = function (e) {
					u.nullFormat = "string" == typeof e ? e : null
				},
				e.defaultFormat = function (e) {
					u.defaultFormat = "string" == typeof e ? e : "0.0"
				},
				e.register = function (e, t, n) {
					if (t = t.toLowerCase(), this[e + "s"][t])
						throw new TypeError(t + " " + e + " already registered.");
					return this[e + "s"][t] = n,
					n
				},
				e.validate = function (t, n) {
					var a,
					i,
					r,
					o,
					s,
					d,
					u,
					m;
					if ("string" != typeof t && (t += "", console.warn && console.warn("Numeral.js: Value is not string. It has been co-erced to: ", t)), (t = t.trim()).match(/^\d+$/))
						return !0;
					if ("" === t)
						return !1;
					try {
						u = e.localeData(n)
					} catch (t) {
						u = e.localeData(e.locale())
					}
					return r = u.currency.symbol,
					s = u.abbreviations,
					a = u.delimiters.decimal,
					i = "." === u.delimiters.thousands ? "\\." : u.delimiters.thousands,
					!(null !== (m = t.match(/^[^\d]+/)) && (t = t.substr(1), m[0] !== r) || null !== (m = t.match(/[^\d]+$/)) && (t = t.slice(0, -1), m[0] !== s.thousand && m[0] !== s.million && m[0] !== s.billion && m[0] !== s.trillion) || (d = new RegExp(i + "{2}"), t.match(/[^\d.,]/g) || (o = t.split(a)).length > 2 || (o.length < 2 ? !o[0].match(/^\d+.*\d$/) || o[0].match(d) : 1 === o[0].length ? !o[0].match(/^\d+$/) || o[0].match(d) || !o[1].match(/^\d+$/) : !o[0].match(/^\d+.*\d$/) || o[0].match(d) || !o[1].match(/^\d+$/))))
				},
				e.fn = m.prototype = {
					clone: function () {
						return e(this)
					},
					format: function (t, n) {
						var a,
						i,
						r,
						s = this._value,
						d = t || u.defaultFormat;
						if (n = n || Math.round, 0 === s && null !== u.zeroFormat)
							i = u.zeroFormat;
						else if (null === s && null !== u.nullFormat)
							i = u.nullFormat;
						else {
							for (a in o)
								if (d.match(o[a].regexps.format)) {
									r = o[a].format;
									break
								}
							i = (r = r || e._.numberToFormat)(s, d, n)
						}
						return i
					},
					value: function () {
						return this._value
					},
					input: function () {
						return this._input
					},
					set: function (e) {
						return this._value = Number(e),
						this
					},
					add: function (e) {
						var n = t.correctionFactor.call(null, this._value, e);

						function a(e, t, a, i) {
							return e + Math.round(n * t)
						}
						return this._value = t.reduce([this._value, e], a, 0) / n,
						this
					},
					subtract: function (e) {
						var n = t.correctionFactor.call(null, this._value, e);

						function a(e, t, a, i) {
							return e - Math.round(n * t)
						}
						return this._value = t.reduce([e], a, Math.round(this._value * n)) / n,
						this
					},
					multiply: function (e) {
						function n(e, n, a, i) {
							var r = t.correctionFactor(e, n);
							return Math.round(e * r) * Math.round(n * r) / Math.round(r * r)
						}
						return this._value = t.reduce([this._value, e], n, 1),
						this
					},
					divide: function (e) {
						function n(e, n, a, i) {
							var r = t.correctionFactor(e, n);
							return Math.round(e * r) / Math.round(n * r)
						}
						return this._value = t.reduce([this._value, e], n),
						this
					},
					difference: function (t) {
						return Math.abs(e(this._value).subtract(t).value())
					}
				},
				e.register("locale", "en", {
					delimiters: {
						thousands: ",",
						decimal: "."
					},
					abbreviations: {
						thousand: "k",
						million: "m",
						billion: "b",
						trillion: "t"
					},
					ordinal: function (e) {
						var t = e % 10;
						return 1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th"
					},
					currency: {
						symbol: "$"
					}
				}),
				e.register("format", "bps", {
					regexps: {
						format: /(BPS)/,
						unformat: /(BPS)/
					},
					format: function (t, n, a) {
						var i,
						r = e._.includes(n, " BPS") ? " " : "";
						return t *= 1e4,
						n = n.replace(/\s?BPS/, ""),
						i = e._.numberToFormat(t, n, a),
						e._.includes(i, ")") ? ((i = i.split("")).splice(-1, 0, r + "BPS"), i = i.join("")) : i = i + r + "BPS",
						i
					},
					unformat: function (t) {
						return  + (1e-4 * e._.stringToNumber(t)).toFixed(15)
					}
				}),
				a = {
					base: 1024,
					suffixes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
				},
				i = "(" + (i = (n = {
								base: 1e3,
								suffixes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
							}).suffixes.concat(a.suffixes.filter((function (e) {
									return n.suffixes.indexOf(e) < 0
								}))).join("|")).replace("B", "B(?!PS)") + ")",
				e.register("format", "bytes", {
					regexps: {
						format: /([0\s]i?b)/,
						unformat: new RegExp(i)
					},
					format: function (t, i, r) {
						var o,
						s,
						d,
						u = e._.includes(i, "ib") ? a : n,
						m = e._.includes(i, " b") || e._.includes(i, " ib") ? " " : "";
						for (i = i.replace(/\s?i?b/, ""), o = 0; o <= u.suffixes.length; o++)
							if (s = Math.pow(u.base, o), d = Math.pow(u.base, o + 1), null === t || 0 === t || t >= s && t < d) {
								m += u.suffixes[o],
								s > 0 && (t /= s);
								break
							}
						return e._.numberToFormat(t, i, r) + m
					},
					unformat: function (t) {
						var i,
						r,
						o = e._.stringToNumber(t);
						if (o) {
							for (i = n.suffixes.length - 1; i >= 0; i--) {
								if (e._.includes(t, n.suffixes[i])) {
									r = Math.pow(n.base, i);
									break
								}
								if (e._.includes(t, a.suffixes[i])) {
									r = Math.pow(a.base, i);
									break
								}
							}
							o *= r || 1
						}
						return o
					}
				}),
				e.register("format", "currency", {
					regexps: {
						format: /(\$)/
					},
					format: function (t, n, a) {
						var i,
						r,
						o = e.locales[e.options.currentLocale],
						s = {
							before: n.match(/^([\+|\-|\(|\s|\$]*)/)[0],
							after: n.match(/([\+|\-|\)|\s|\$]*)$/)[0]
						};
						for (n = n.replace(/\s?\$\s?/, ""), i = e._.numberToFormat(t, n, a), t >= 0 ? (s.before = s.before.replace(/[\-\(]/, ""), s.after = s.after.replace(/[\-\)]/, "")) : t < 0 && !e._.includes(s.before, "-") && !e._.includes(s.before, "(") && (s.before = "-" + s.before), r = 0; r < s.before.length; r++)
							switch (s.before[r]) {
							case "$":
								i = e._.insert(i, o.currency.symbol, r);
								break;
							case " ":
								i = e._.insert(i, " ", r + o.currency.symbol.length - 1)
							}
						for (r = s.after.length - 1; r >= 0; r--)
							switch (s.after[r]) {
							case "$":
								i = r === s.after.length - 1 ? i + o.currency.symbol : e._.insert(i, o.currency.symbol,  - (s.after.length - (1 + r)));
								break;
							case " ":
								i = r === s.after.length - 1 ? i + " " : e._.insert(i, " ",  - (s.after.length - (1 + r) + o.currency.symbol.length - 1))
							}
						return i
					}
				}),
				e.register("format", "exponential", {
					regexps: {
						format: /(e\+|e-)/,
						unformat: /(e\+|e-)/
					},
					format: function (t, n, a) {
						var i = ("number" != typeof t || e._.isNaN(t) ? "0e+0" : t.toExponential()).split("e");
						return n = n.replace(/e[\+|\-]{1}0/, ""),
						e._.numberToFormat(Number(i[0]), n, a) + "e" + i[1]
					},
					unformat: function (t) {
						var n = e._.includes(t, "e+") ? t.split("e+") : t.split("e-"),
						a = Number(n[0]),
						i = Number(n[1]);

						function r(t, n, a, i) {
							var r = e._.correctionFactor(t, n);
							return t * r * (n * r) / (r * r)
						}
						return i = e._.includes(t, "e-") ? i *= -1 : i,
						e._.reduce([a, Math.pow(10, i)], r, 1)
					}
				}),
				e.register("format", "ordinal", {
					regexps: {
						format: /(o)/
					},
					format: function (t, n, a) {
						var i = e.locales[e.options.currentLocale],
						r = e._.includes(n, " o") ? " " : "";
						return n = n.replace(/\s?o/, ""),
						r += i.ordinal(t),
						e._.numberToFormat(t, n, a) + r
					}
				}),
				e.register("format", "percentage", {
					regexps: {
						format: /(%)/,
						unformat: /(%)/
					},
					format: function (t, n, a) {
						var i,
						r = e._.includes(n, " %") ? " " : "";
						return e.options.scalePercentBy100 && (t *= 100),
						n = n.replace(/\s?\%/, ""),
						i = e._.numberToFormat(t, n, a),
						e._.includes(i, ")") ? ((i = i.split("")).splice(-1, 0, r + "%"), i = i.join("")) : i = i + r + "%",
						i
					},
					unformat: function (t) {
						var n = e._.stringToNumber(t);
						return e.options.scalePercentBy100 ? .01 * n : n
					}
				}),
				e.register("format", "time", {
					regexps: {
						format: /(:)/,
						unformat: /(:)/
					},
					format: function (e, t, n) {
						var a = Math.floor(e / 60 / 60),
						i = Math.floor((e - 60 * a * 60) / 60),
						r = Math.round(e - 60 * a * 60 - 60 * i);
						return a + ":" + (i < 10 ? "0" + i : i) + ":" + (r < 10 ? "0" + r : r)
					},
					unformat: function (e) {
						var t = e.split(":"),
						n = 0;
						return 3 === t.length ? (n += 60 * Number(t[0]) * 60, n += 60 * Number(t[1]), n += Number(t[2])) : 2 === t.length && (n += 60 * Number(t[0]), n += Number(t[1])),
						Number(n)
					}
				}),
				e
			},
			void 0 === (i = "function" == typeof a ? a.call(t, n, t, e) : a) || (e.exports = i)
		},
		983: e => {
			const t = /^[-+]?0x[a-fA-F0-9]+$/,
			n = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
			!Number.parseInt && window.parseInt && (Number.parseInt = window.parseInt),
			!Number.parseFloat && window.parseFloat && (Number.parseFloat = window.parseFloat);
			const a = {
				hex: !0,
				leadingZeros: !0,
				decimalPoint: ".",
				eNotation: !0
			};
			e.exports = function (e, i = {}) {
				if (i = Object.assign({}, a, i), !e || "string" != typeof e)
					return e;
				let r = e.trim();
				if (void 0 !== i.skipLike && i.skipLike.test(r))
					return e;
				if (i.hex && t.test(r))
					return Number.parseInt(r, 16); {
					const t = n.exec(r);
					if (t) {
						const n = t[1],
						a = t[2];
						let o = function (e) {
							if (e && -1 !== e.indexOf("."))
								return "." === (e = e.replace(/0+$/, "")) ? e = "0" : "." === e[0] ? e = "0" + e : "." === e[e.length - 1] && (e = e.substr(0, e.length - 1)), e;
							return e
						}
						(t[3]);
						const s = t[4] || t[6];
						if (!i.leadingZeros && a.length > 0 && n && "." !== r[2])
							return e;
						if (!i.leadingZeros && a.length > 0 && !n && "." !== r[1])
							return e; {
							const t = Number(r),
							d = "" + t;
							return -1 !== d.search(/[eE]/) || s ? i.eNotation ? t : e : -1 !== r.indexOf(".") ? "0" === d && "" === o || d === o || n && d === "-" + o ? t : e : a ? o === d || n + o === d ? t : e : r === d || r === n + d ? t : e
						}
					}
					return e
				}
			}
		},
		633: (e, t, n) => {
			var a = n(738).default;

			function i() {
				"use strict";
				e.exports = i = function () {
					return n
				},
				e.exports.__esModule = !0,
				e.exports.default = e.exports;
				var t,
				n = {},
				r = Object.prototype,
				o = r.hasOwnProperty,
				s = Object.defineProperty || function (e, t, n) {
					e[t] = n.value
				},
				d = "function" == typeof Symbol ? Symbol : {},
				u = d.iterator || "@@iterator",
				m = d.asyncIterator || "@@asyncIterator",
				l = d.toStringTag || "@@toStringTag";

				function h(e, t, n) {
					return Object.defineProperty(e, t, {
						value: n,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}),
					e[t]
				}
				try {
					h({}, "")
				} catch (t) {
					h = function (e, t, n) {
						return e[t] = n
					}
				}

				function c(e, t, n, a) {
					var i = t && t.prototype instanceof y ? t : y,
					r = Object.create(i.prototype),
					o = new H(a || []);
					return s(r, "_invoke", {
						value: E(e, n, o)
					}),
					r
				}

				function g(e, t, n) {
					try {
						return {
							type: "normal",
							arg: e.call(t, n)
						}
					} catch (e) {
						return {
							type: "throw",
							arg: e
						}
					}
				}
				n.wrap = c;
				var f = "suspendedStart",
				p = "suspendedYield",
				v = "executing",
				b = "completed",
				w = {};

				function y() {}

				function M() {}

				function k() {}
				var P = {};
				h(P, u, (function () {
						return this
					}));
				var W = Object.getPrototypeOf,
				j = W && W(W(N([])));
				j && j !== r && o.call(j, u) && (P = j);
				var x = k.prototype = y.prototype = Object.create(P);

				function z(e) {
					["next", "throw", "return"].forEach((function (t) {
							h(e, t, (function (e) {
									return this._invoke(t, e)
								}))
						}))
				}

				function T(e, t) {
					function n(i, r, s, d) {
						var u = g(e[i], e, r);
						if ("throw" !== u.type) {
							var m = u.arg,
							l = m.value;
							return l && "object" == a(l) && o.call(l, "__await") ? t.resolve(l.__await).then((function (e) {
									n("next", e, s, d)
								}), (function (e) {
									n("throw", e, s, d)
								})) : t.resolve(l).then((function (e) {
									m.value = e,
									s(m)
								}), (function (e) {
									return n("throw", e, s, d)
								}))
						}
						d(u.arg)
					}
					var i;
					s(this, "_invoke", {
						value: function (e, a) {
							function r() {
								return new t((function (t, i) {
										n(e, a, t, i)
									}))
							}
							return i = i ? i.then(r, r) : r()
						}
					})
				}

				function E(e, n, a) {
					var i = f;
					return function (r, o) {
						if (i === v)
							throw Error("Generator is already running");
						if (i === b) {
							if ("throw" === r)
								throw o;
							return {
								value: t,
								done: !0
							}
						}
						for (a.method = r, a.arg = o; ; ) {
							var s = a.delegate;
							if (s) {
								var d = S(s, a);
								if (d) {
									if (d === w)
										continue;
									return d
								}
							}
							if ("next" === a.method)
								a.sent = a._sent = a.arg;
							else if ("throw" === a.method) {
								if (i === f)
									throw i = b, a.arg;
								a.dispatchException(a.arg)
							} else
								"return" === a.method && a.abrupt("return", a.arg);
							i = v;
							var u = g(e, n, a);
							if ("normal" === u.type) {
								if (i = a.done ? b : p, u.arg === w)
									continue;
								return {
									value: u.arg,
									done: a.done
								}
							}
							"throw" === u.type && (i = b, a.method = "throw", a.arg = u.arg)
						}
					}
				}

				function S(e, n) {
					var a = n.method,
					i = e.iterator[a];
					if (i === t)
						return n.delegate = null, "throw" === a && e.iterator.return && (n.method = "return", n.arg = t, S(e, n), "throw" === n.method) || "return" !== a && (n.method = "throw", n.arg = new TypeError("The iterator does not provide a '" + a + "' method")), w;
					var r = g(i, e.iterator, n.arg);
					if ("throw" === r.type)
						return n.method = "throw", n.arg = r.arg, n.delegate = null, w;
					var o = r.arg;
					return o ? o.done ? (n[e.resultName] = o.value, n.next = e.nextLoc, "return" !== n.method && (n.method = "next", n.arg = t), n.delegate = null, w) : o : (n.method = "throw", n.arg = new TypeError("iterator result is not an object"), n.delegate = null, w)
				}

				function C(e) {
					var t = {
						tryLoc: e[0]
					};
					1 in e && (t.catchLoc = e[1]),
					2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]),
					this.tryEntries.push(t)
				}

				function A(e) {
					var t = e.completion || {};
					t.type = "normal",
					delete t.arg,
					e.completion = t
				}

				function H(e) {
					this.tryEntries = [{
							tryLoc: "root"
						}
					],
					e.forEach(C, this),
					this.reset(!0)
				}

				function N(e) {
					if (e || "" === e) {
						var n = e[u];
						if (n)
							return n.call(e);
						if ("function" == typeof e.next)
							return e;
						if (!isNaN(e.length)) {
							var i = -1,
							r = function n() {
								for (; ++i < e.length; )
									if (o.call(e, i))
										return n.value = e[i], n.done = !1, n;
								return n.value = t,
								n.done = !0,
								n
							};
							return r.next = r
						}
					}
					throw new TypeError(a(e) + " is not iterable")
				}
				return M.prototype = k,
				s(x, "constructor", {
					value: k,
					configurable: !0
				}),
				s(k, "constructor", {
					value: M,
					configurable: !0
				}),
				M.displayName = h(k, l, "GeneratorFunction"),
				n.isGeneratorFunction = function (e) {
					var t = "function" == typeof e && e.constructor;
					return !!t && (t === M || "GeneratorFunction" === (t.displayName || t.name))
				},
				n.mark = function (e) {
					return Object.setPrototypeOf ? Object.setPrototypeOf(e, k) : (e.__proto__ = k, h(e, l, "GeneratorFunction")),
					e.prototype = Object.create(x),
					e
				},
				n.awrap = function (e) {
					return {
						__await: e
					}
				},
				z(T.prototype),
				h(T.prototype, m, (function () {
						return this
					})),
				n.AsyncIterator = T,
				n.async = function (e, t, a, i, r) {
					void 0 === r && (r = Promise);
					var o = new T(c(e, t, a, i), r);
					return n.isGeneratorFunction(t) ? o : o.next().then((function (e) {
							return e.done ? e.value : o.next()
						}))
				},
				z(x),
				h(x, l, "Generator"),
				h(x, u, (function () {
						return this
					})),
				h(x, "toString", (function () {
						return "[object Generator]"
					})),
				n.keys = function (e) {
					var t = Object(e),
					n = [];
					for (var a in t)
						n.push(a);
					return n.reverse(),
					function e() {
						for (; n.length; ) {
							var a = n.pop();
							if (a in t)
								return e.value = a, e.done = !1, e
						}
						return e.done = !0,
						e
					}
				},
				n.values = N,
				H.prototype = {
					constructor: H,
					reset: function (e) {
						if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(A), !e)
							for (var n in this)
								"t" === n.charAt(0) && o.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = t)
					},
					stop: function () {
						this.done = !0;
						var e = this.tryEntries[0].completion;
						if ("throw" === e.type)
							throw e.arg;
						return this.rval
					},
					dispatchException: function (e) {
						if (this.done)
							throw e;
						var n = this;

						function a(a, i) {
							return s.type = "throw",
							s.arg = e,
							n.next = a,
							i && (n.method = "next", n.arg = t),
							!!i
						}
						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var r = this.tryEntries[i],
							s = r.completion;
							if ("root" === r.tryLoc)
								return a("end");
							if (r.tryLoc <= this.prev) {
								var d = o.call(r, "catchLoc"),
								u = o.call(r, "finallyLoc");
								if (d && u) {
									if (this.prev < r.catchLoc)
										return a(r.catchLoc, !0);
									if (this.prev < r.finallyLoc)
										return a(r.finallyLoc)
								} else if (d) {
									if (this.prev < r.catchLoc)
										return a(r.catchLoc, !0)
								} else {
									if (!u)
										throw Error("try statement without catch or finally");
									if (this.prev < r.finallyLoc)
										return a(r.finallyLoc)
								}
							}
						}
					},
					abrupt: function (e, t) {
						for (var n = this.tryEntries.length - 1; n >= 0; --n) {
							var a = this.tryEntries[n];
							if (a.tryLoc <= this.prev && o.call(a, "finallyLoc") && this.prev < a.finallyLoc) {
								var i = a;
								break
							}
						}
						i && ("break" === e || "continue" === e) && i.tryLoc <= t && t <= i.finallyLoc && (i = null);
						var r = i ? i.completion : {};
						return r.type = e,
						r.arg = t,
						i ? (this.method = "next", this.next = i.finallyLoc, w) : this.complete(r)
					},
					complete: function (e, t) {
						if ("throw" === e.type)
							throw e.arg;
						return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t),
						w
					},
					finish: function (e) {
						for (var t = this.tryEntries.length - 1; t >= 0; --t) {
							var n = this.tryEntries[t];
							if (n.finallyLoc === e)
								return this.complete(n.completion, n.afterLoc), A(n), w
						}
					},
					catch : function (e) {
						for (var t = this.tryEntries.length - 1; t >= 0; --t) {
							var n = this.tryEntries[t];
							if (n.tryLoc === e) {
								var a = n.completion;
								if ("throw" === a.type) {
									var i = a.arg;
									A(n)
								}
								return i
							}
						}
						throw Error("illegal catch attempt")
					},
				delegateYield: function (e, n, a) {
					return this.delegate = {
						iterator: N(e),
						resultName: n,
						nextLoc: a
					},
					"next" === this.method && (this.arg = t),
					w
				}
			},
			n
		}
		e.exports = i,
		e.exports.__esModule = !0,
		e.exports.default = e.exports
	},
	738: e => {
		function t(n) {
			return e.exports = t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
				return typeof e
			}
			 : function (e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			},
			e.exports.__esModule = !0,
			e.exports.default = e.exports,
			t(n)
		}
		e.exports = t,
		e.exports.__esModule = !0,
		e.exports.default = e.exports
	},
	756: (e, t, n) => {
		var a = n(633)();
		e.exports = a;
		try {
			regeneratorRuntime = a
		} catch (e) {
			"object" == typeof globalThis ? globalThis.regeneratorRuntime = a : Function("r", "regeneratorRuntime = r")(a)
		}
	}
},
t = {};

function n(a) {
	var i = t[a];
	if (void 0 !== i)
		return i.exports;
	var r = t[a] = {
		exports: {}
	};
	return e[a].call(r.exports, r, r.exports, n),
	r.exports
}
n.n = e => {
	var t = e && e.__esModule ? () => e.default : () => e;
	return n.d(t, {
		a: t
	}),
	t
},
n.d = (e, t) => {
	for (var a in t)
		n.o(t, a)
			 && !n.o(e, a) && Object.defineProperty(e, a, {
				enumerable: !0,
				get: t[a]
			})
	},
	n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
	(() => {
		"use strict";

		function e(e, t, n, a, i, r, o) {
			try {
				var s = e[r](o),
				d = s.value
			} catch (e) {
				return void n(e)
			}
			s.done ? t(d) : Promise.resolve(d).then(a, i)
		}

		function t(t) {
			return function () {
				var n = this,
				a = arguments;
				return new Promise((function (i, r) {
						var o = t.apply(n, a);

						function s(t) {
							e(o, i, r, s, d, "next", t)
						}

						function d(t) {
							e(o, i, r, s, d, "throw", t)
						}
						s(void 0)
					}))
			}
		}
		var a = n(756),
		i = n.n(a),
		r = {
			set: function (e, t) {
				chromeStorage.set(e, (function () {
						!chrome.runtime.lastError || -1 === chrome.runtime.lastError.message.indexOf("quota exceeded") && -1 === chrome.runtime.lastError.message.indexOf("QuotaExceededError") && -1 === chrome.runtime.lastError.message.indexOf("Failed to insert value") ? chrome.runtime.sendMessage({
							cmd: "set"
						}, t) : chrome.storage.sync.get(null, (function (e) {
								e.ysc_settings.sync_type = "locale",
								chromeStorage = chrome.storage.local,
								chromeStorage.set(e, (function () {
										chrome.runtime.sendMessage({
											cmd: "set"
										}, t)
									}))
							}))
					}))
			},
			setAsync: function (e) {
				return new Promise((function (t) {
						chromeStorage.set(e, (function () {
								!chrome.runtime.lastError || -1 === chrome.runtime.lastError.message.indexOf("quota exceeded") && -1 === chrome.runtime.lastError.message.indexOf("QuotaExceededError") && -1 === chrome.runtime.lastError.message.indexOf("Failed to insert value") ? chrome.runtime.sendMessage({
									cmd: "set"
								}, (function (e) {
										t(e)
									})) : chrome.storage.sync.get(null, (function (e) {
										e.ysc_settings.sync_type = "locale",
										chromeStorage = chrome.storage.local,
										chromeStorage.set(e, (function () {
												chrome.runtime.sendMessage({
													cmd: "set"
												}, (function (e) {
														t(e)
													}))
											}))
									}))
							}))
					}))
			}
		};
		const o = r;
		var s,
		d = {
			addAsync: (s = t(i().mark((function e(t, n) {
								var a;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.next = 2,
												d.getPopup();
											case 2:
												return (a = e.sent) || (a = {}),
												a[t] = n,
												e.abrupt("return", new Promise((function (e) {
															d.save("ysc_popup", a, (function (t) {
																	e(t)
																}))
														})));
											case 6:
											case "end":
												return e.stop()
											}
									}), e)
							}))), function (e, t) {
				return s.apply(this, arguments)
			}),
			add: function (e, t, n) {
				d.getPopup().then((function (a) {
						a || (a = {}),
						a[e] = t,
						d.save("ysc_popup", a, n)
					})).catch((function () {}))
			},
			getPopup: function () {
				return new Promise((function (e) {
						d.get(e)
					}))
			},
			get: function (e) {
				var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
				chromeStorage.get("ysc_popup", function () {
					var a = t(i().mark((function t(a) {
									var r;
									return i().wrap((function (t) {
											for (; ; )
												switch (t.prev = t.next) {
												case 0:
													if (a && 0 !== Object.keys(a).length) {
														t.next = 7;
														break
													}
													if (a = {}, !(n < 3)) {
														t.next = 7;
														break
													}
													return t.next = 5,
													Li(500);
												case 5:
													return d.get(e, ++n),
													t.abrupt("return");
												case 7:
													r = a && a.ysc_popup ? a.ysc_popup : {},
													e(r);
												case 9:
												case "end":
													return t.stop()
												}
										}), t)
								})));
					return function (e) {
						return a.apply(this, arguments)
					}
				}
					())
			},
			save: function (e, t, n) {
				var a = {};
				a[e] = t,
				o.set(a, n)
			}
		};

		function u(e) {
			return u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
				return typeof e
			}
			 : function (e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			},
			u(e)
		}

		function m(e) {
			var t = function (e, t) {
				if ("object" != u(e) || !e)
					return e;
				var n = e[Symbol.toPrimitive];
				if (void 0 !== n) {
					var a = n.call(e, t || "default");
					if ("object" != u(a))
						return a;
					throw new TypeError("@@toPrimitive must return a primitive value.")
				}
				return ("string" === t ? String : Number)(e)
			}
			(e, "string");
			return "symbol" == u(t) ? t : t + ""
		}

		function l(e, t, n) {
			return (t = m(t))in e ? Object.defineProperty(e, t, {
				value: n,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = n,
			e
		}

		function h(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var n = 0, a = Array(t); n < t; n++)
				a[n] = e[n];
			return a
		}

		function c(e) {
			return function (e) {
				if (Array.isArray(e))
					return h(e)
			}
			(e) || function (e) {
				if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"])
					return Array.from(e)
			}
			(e) || function (e, t) {
				if (e) {
					if ("string" == typeof e)
						return h(e, t);
					var n = {}
					.toString.call(e).slice(8, -1);
					return "Object" === n && e.constructor && (n = e.constructor.name),
					"Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? h(e, t) : void 0
				}
			}
			(e) || function () {
				throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}
			()
		}

		function g(e, t) {
			var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (!n) {
				if (Array.isArray(e) || (n = function (e, t) {
						if (e) {
							if ("string" == typeof e)
								return f(e, t);
								var n = {}
								.toString.call(e).slice(8, -1);
								return "Object" === n && e.constructor && (n = e.constructor.name),
								"Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? f(e, t) : void 0
							}
						}
							(e)) || t && e && "number" == typeof e.length) {
						n && (e = n);
						var a = 0,
						i = function () {};
						return {
							s: i,
							n: function () {
								return a >= e.length ? {
									done: !0
								}
								 : {
									done: !1,
									value: e[a++]
								}
							},
							e: function (e) {
								throw e
							},
							f: i
						}
					}
				throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}
			var r,
			o = !0,
			s = !1;
			return {
				s: function () {
					n = n.call(e)
				},
				n: function () {
					var e = n.next();
					return o = e.done,
					e
				},
				e: function (e) {
					s = !0,
					r = e
				},
				f: function () {
					try {
						o || null == n.return || n.return()
					} finally {
						if (s)
							throw r
					}
				}
			}
		}

		function f(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var n = 0, a = Array(t); n < t; n++)
				a[n] = e[n];
			return a
		}
		var p,
		v = {
			chunkSize: 250,
			type: "ysc_collection",
			chunks: 10,
			add: function (e, t, n) {
				chrome.runtime.sendMessage({
					cmd: "add_group",
					groupTitle: t,
					idChannel: e
				});
				var a = v.getCollections();
				Promise.all([a]).then((function (a) {
						t = t.trim();
						var i = a[0];
						i && i[t] || (i[t] = []),
						e && -1 === i[t].indexOf(e) && i[t].push(e),
						v.save(i, n)
					})).catch((function () {}))
			},
			addAsync: function () {
				var e = t(i().mark((function e(t, n) {
								var a;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return chrome.runtime.sendMessage({
													cmd: "add_group",
													groupTitle: n,
													idChannel: t
												}),
												e.next = 3,
												v.getCollectionsWithoutRetry();
											case 3:
												return a = e.sent,
												n = n.trim(),
												a && a[n] || (a[n] = []),
												t && -1 === a[n].indexOf(t) && a[n].push(t),
												e.abrupt("return", new Promise((function (e) {
															v.save(a, (function (t) {
																	e(t)
																}))
														})));
											case 8:
											case "end":
												return e.stop()
											}
									}), e)
							})));
				return function (t, n) {
					return e.apply(this, arguments)
				}
			}
			(),
			mergeNewChannels: (p = t(i().mark((function e(t, n) {
								var a;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return chrome.runtime.sendMessage({
													cmd: "update_group_list",
													groupTitle: n,
													idChannels: t
												}),
												e.next = 3,
												v.getCollections();
											case 3:
												return a = e.sent,
												n = n.trim(),
												a && a[n] || (a[n] = []),
												a[n] = [].concat(c(a[n]), c(t)),
												e.abrupt("return", v.makeSavingData(a));
											case 8:
											case "end":
												return e.stop()
											}
									}), e)
							}))), function (e, t) {
				return p.apply(this, arguments)
			}),
			updateChannelsList: function (e, t, n) {
				chrome.runtime.sendMessage({
					cmd: "update_group_list",
					groupTitle: t,
					idChannels: e
				});
				var a = v.getCollections();
				Promise.all([a]).then((function (a) {
						t = t.trim();
						var i = a[0];
						i && i[t] || (i[t] = []),
						i[t] = e,
						v.save(i, n)
					})).catch((function () {}))
			},
			removeChannelFromGroup: function (e, t, n) {
				chrome.runtime.sendMessage({
					cmd: "remove_channel_from_group",
					groupTitle: t,
					idChannel: e
				});
				var a = v.getCollections();
				Promise.all([a]).then((function (a) {
						var i = a[0];
						for (var r in i)
							if (r == t)
								for (var o in i[r])
									i[r][o] == e && i[r].splice(o, 1);
						v.save(i, n)
					})).catch((function () {}))
			},
			removeChannel: function (e, t) {
				chrome.runtime.sendMessage({
					cmd: "remove_channel",
					idChannel: e
				});
				var n = v.getCollections();
				Promise.all([n]).then((function (n) {
						var a = n[0];
						for (var i in a)
							for (var r in a[i])
								a[i][r] == e && a[i].splice(r, 1);
						v.save(a, t)
					})).catch((function () {}))
			},
			removeGroup: function (e, t) {
				chrome.runtime.sendMessage({
					cmd: "remove_group",
					groupTitle: e
				});
				var n = v.getCollections();
				Promise.all([n]).then((function (n) {
						var a = n[0];
						delete a[e],
						chromeStorage.remove(e, (function () {})),
						v.save(a, t)
					})).catch((function () {}))
			},
			removeGroups: function (e, t) {
				var n = v.getCollections();
				Promise.all([n]).then((function (n) {
						var a,
						i = n[0],
						r = g(e);
						try {
							for (r.s(); !(a = r.n()).done; ) {
								delete i[a.value]
							}
						} catch (e) {
							r.e(e)
						} finally {
							r.f()
						}
						chromeStorage.remove(e, (function () {})),
						v.save(i, t)
					})).catch((function () {}))
			},
			updateTitle: function (e, t, n) {
				chrome.runtime.sendMessage({
					cmd: "update_group_title",
					titleOld: e,
					titleNew: t
				});
				var a = v.getCollections();
				Promise.all([a]).then((function (a) {
						var i = a[0];
						t = t.trim(),
						Object.defineProperty(i, t, Object.getOwnPropertyDescriptor(i, e)),
						delete i[e],
						chromeStorage.remove(e, (function () {})),
						v.save(i, n)
					})).catch((function () {}))
			},
			updateListOrder: function (e, t) {
				var n = v.getCollections();
				Promise.all([n]).then((function (n) {
						var a = n[0];
						a[t] = e,
						v.save(a)
					})).catch((function () {}))
			},
			getIds: function () {
				return new Promise((function (e) {
						v.get((function (t) {
								var n = {};
								for (var a in t[v.type])
									if (t[v.type][a])
										for (var i in t[v.type][a])
											n && n[t[v.type][a][i]] || (n[t[v.type][a][i]] = {
													groups: []
												}), -1 === n[t[v.type][a][i]].groups.indexOf(a) && n[t[v.type][a][i]].groups.push(a);
								e(n)
							}))
					}))
			},
			getCollectionsWithoutRetry: function () {
				return new Promise((function (e) {
						v.get((function (t) {
								var n = t && t[v.type] ? t[v.type] : {};
								e(n)
							}), 3)
					}))
			},
			getCollections: function () {
				return new Promise((function (e) {
						v.get((function (t) {
								var n = t && t[v.type] ? t[v.type] : {};
								e(n)
							}))
					}))
			},
			getId: function (e) {
				return new Promise((function (t) {
						v.get((function (n) {
								var a = {};
								for (var i in n[v.type])
									if (n[v.type][i])
										for (var r in n[v.type][i])
											a && a[n[v.type][i][r]] || (a[n[v.type][i][r]] = {
													groups: []
												}), -1 === a[n[v.type][i][r]].groups.indexOf(i) && a[n[v.type][i][r]].groups.push(i);
								var o = a && a[e] ? a[e] : {};
								t(o)
							}))
					}))
			},
			getChildrenGroups: function (e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
				n = [];
				return "object" !== u(e) || Object.keys(e).forEach((function (a) {
						(null !== t && a === t || null === t) && (n = [].concat(c(n), c(Object.keys(e[a])), c(v.getChildrenGroups(e[a])))),
						Object.keys(e[a]) !== [] && (n = [].concat(c(n), c(v.getChildrenGroups(e[a], t))))
					})),
				n
			},
			getByTitleGroupWithTree: function (e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
				return new Promise((function (n) {
						v.get((function (a) {
								var i = a && a[v.type] && a[v.type][e] ? a[v.type][e] : [];
								v.getChildrenGroups(t, e).forEach((function (e) {
										void 0 !== a[v.type][e] && (i = [].concat(c(i), c(a[v.type][e])))
									})),
								n(c(new Set(i)))
							}))
					}))
			},
			getByTitlesGroupWithTree: function (e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
				return new Promise((function (n) {
						v.get((function (a) {
								var i = [];
								e.forEach((function (e) {
										i = [].concat(c(i), c(a && a[v.type] && a[v.type][e] ? a[v.type][e] : [])),
										v.getChildrenGroups(t, e).forEach((function (e) {
												void 0 !== a[v.type][e] && (i = [].concat(c(i), c(a[v.type][e])))
											}))
									})),
								n(c(new Set(i)))
							}))
					}))
			},
			enrichData: function (e, t, n) {
				for (var a = []; t.length > v.chunkSize; )
					a.push(t.splice(0, v.chunkSize));
				a.push(t);
				for (var i = a.length >= v.chunks ? v.chunks : a.length, r = 0; r < i; r++)
					0 !== r ? e[n + "_ysm_" + r] = a[r] : e[n] = a[r];
				return e
			},
			save: function (e, t) {
				var n = {};
				for (var a in n[v.type] = e, e) {
					var i = e[a];
					e[a] = a,
					n = v.enrichData(n, i, a)
				}
				o.set(n, t)
			},
			makeSavingData: function (e) {
				var t = {};
				for (var n in t[v.type] = e, e) {
					var a = e[n];
					e[n] = n,
					t = v.enrichData(t, a, n)
				}
				return t
			},
			get: function (e) {
				var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
				chromeStorage.get(v.type, function () {
					var a = t(i().mark((function a(r) {
									var o,
									s,
									d,
									u;
									return i().wrap((function (a) {
											for (; ; )
												switch (a.prev = a.next) {
												case 0:
													if (r && 0 !== Object.keys(r).length) {
														a.next = 7;
														break
													}
													if (r = {}, !(n < 3)) {
														a.next = 7;
														break
													}
													return a.next = 5,
													Li(500);
												case 5:
													return v.get(e, ++n),
													a.abrupt("return");
												case 7:
													o = [],
													a.t0 = i().keys(r[v.type]);
												case 9:
													if ((a.t1 = a.t0()).done) {
														a.next = 24;
														break
													}
													if (s = a.t1.value, !("string" == typeof(d = r[v.type][s]) || d instanceof String)) {
														a.next = 22;
														break
													}
													u = 0;
												case 14:
													if (!(u < v.chunks)) {
														a.next = 22;
														break
													}
													if (0 !== u) {
														a.next = 18;
														break
													}
													return o.push(d),
													a.abrupt("continue", 19);
												case 18:
													o.push(d + "_ysm_" + u);
												case 19:
													u++,
													a.next = 14;
													break;
												case 22:
													a.next = 9;
													break;
												case 24:
													0 === o.length && e(r),
													chromeStorage.get(o, function () {
														var a = t(i().mark((function t(a) {
																		var r,
																		s,
																		d,
																		u,
																		m;
																		return i().wrap((function (t) {
																				for (; ; )
																					switch (t.prev = t.next) {
																					case 0:
																						if (a && 0 !== Object.keys(a).length) {
																							t.next = 7;
																							break
																						}
																						if (a = {}, !(n < 3)) {
																							t.next = 7;
																							break
																						}
																						return t.next = 5,
																						Li(500);
																					case 5:
																						return v.get(e, ++n),
																						t.abrupt("return");
																					case 7:
																						r = {},
																						s = 0,
																						d = o;
																					case 9:
																						if (!(s < d.length)) {
																							t.next = 22;
																							break
																						}
																						if (!1 != (u = d[s])in a) {
																							t.next = 13;
																							break
																						}
																						return t.abrupt("continue", 19);
																					case 13:
																						if (!1 == (m = u.replace(/_ysm_[0-9]*/g, ""))in r && (r[m] = []), Array.isArray(a[u])) {
																							t.next = 18;
																							break
																						}
																						return r[m] = c(new Set(c(r[m]))),
																						t.abrupt("continue", 19);
																					case 18:
																						r[m] = c(new Set([].concat(c(r[m]), c(a[u]))));
																					case 19:
																						s++,
																						t.next = 9;
																						break;
																					case 22:
																						e(l({}, v.type, r));
																					case 23:
																					case "end":
																						return t.stop()
																					}
																			}), t)
																	})));
														return function (e) {
															return a.apply(this, arguments)
														}
													}
														());
												case 26:
												case "end":
													return a.stop()
												}
										}), a)
								})));
					return function (e) {
						return a.apply(this, arguments)
					}
				}
					())
			}
		};

		function b(e, t) {
			var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (!n) {
				if (Array.isArray(e) || (n = function (e, t) {
						if (e) {
							if ("string" == typeof e)
								return w(e, t);
								var n = {}
								.toString.call(e).slice(8, -1);
								return "Object" === n && e.constructor && (n = e.constructor.name),
								"Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? w(e, t) : void 0
							}
						}
							(e)) || t && e && "number" == typeof e.length) {
						n && (e = n);
						var a = 0,
						i = function () {};
						return {
							s: i,
							n: function () {
								return a >= e.length ? {
									done: !0
								}
								 : {
									done: !1,
									value: e[a++]
								}
							},
							e: function (e) {
								throw e
							},
							f: i
						}
					}
				throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}
			var r,
			o = !0,
			s = !1;
			return {
				s: function () {
					n = n.call(e)
				},
				n: function () {
					var e = n.next();
					return o = e.done,
					e
				},
				e: function (e) {
					s = !0,
					r = e
				},
				f: function () {
					try {
						o || null == n.return || n.return()
					} finally {
						if (s)
							throw r
					}
				}
			}
		}

		function w(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var n = 0, a = Array(t); n < t; n++)
				a[n] = e[n];
			return a
		}
		var y,
		M,
		k = {
			addAsync: function () {
				var e = t(i().mark((function e(t, n) {
								var a,
								r;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.next = 2,
												k.getSettings();
											case 2:
												if ((a = e.sent) || (a = {}), "patreon" !== t || a.patreon !== n) {
													e.next = 6;
													break
												}
												return e.abrupt("return");
											case 6:
												if ("yu" !== t || a.yu !== n) {
													e.next = 8;
													break
												}
												return e.abrupt("return");
											case 8:
												if (Array.isArray(t) && Array.isArray(n))
													for (r = 0; r < t.length; r++)
														a[t[r]] = n[r];
												else
													a[t] = n;
												return e.abrupt("return", new Promise((function (e) {
															k.save("ysc_settings", a, (function (t) {
																	e(t)
																}))
														})));
											case 10:
											case "end":
												return e.stop()
											}
									}), e)
							})));
				return function (t, n) {
					return e.apply(this, arguments)
				}
			}
			(),
			add: function (e, t, n) {
				k.getSettings().then((function (a) {
						if (a || (a = {}), Array.isArray(e) && Array.isArray(t))
							for (var i = 0; i < e.length; i++)
								a[e[i]] = t[i];
						else
							a[e] = t;
						k.save("ysc_settings", a, (function () {
								n()
							}))
					}))
			},
			remove: (M = t(i().mark((function e(t) {
								var n;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.next = 2,
												k.getSettings();
											case 2:
												return (n = e.sent) || (n = {}),
												delete n[t],
												e.abrupt("return", new Promise((function (e) {
															k.save("ysc_settings", n, (function (t) {
																	e(t)
																}))
														})));
											case 6:
											case "end":
												return e.stop()
											}
									}), e)
							}))), function (e) {
				return M.apply(this, arguments)
			}),
			removeAll: (y = t(i().mark((function e(t) {
								var n,
								a,
								r,
								o;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.next = 2,
												k.getSettings();
											case 2:
												(n = e.sent) || (n = {}),
												a = b(t);
												try {
													for (a.s(); !(r = a.n()).done; )
														o = r.value, delete n[o]
												} catch (e) {
													a.e(e)
												} finally {
													a.f()
												}
												return e.abrupt("return", new Promise((function (e) {
															k.save("ysc_settings", n, (function (t) {
																	e(t)
																}))
														})));
											case 7:
											case "end":
												return e.stop()
											}
									}), e)
							}))), function (e) {
				return y.apply(this, arguments)
			}),
			getSettings: function () {
				return new Promise((function (e) {
						k.get(e)
					}))
			},
			get: function (e) {
				var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
				chromeStorage.get("ysc_settings", function () {
					var a = t(i().mark((function t(a) {
									var r;
									return i().wrap((function (t) {
											for (; ; )
												switch (t.prev = t.next) {
												case 0:
													if (a && 0 !== Object.keys(a).length) {
														t.next = 7;
														break
													}
													if (a = {}, !(n < 3)) {
														t.next = 7;
														break
													}
													return t.next = 5,
													Li(500);
												case 5:
													return k.get(e, ++n),
													t.abrupt("return");
												case 7:
													r = a && a.ysc_settings ? a.ysc_settings : {},
													e(r);
												case 9:
												case "end":
													return t.stop()
												}
										}), t)
								})));
					return function (e) {
						return a.apply(this, arguments)
					}
				}
					())
			},
			save: function (e, t, n) {
				var a = {};
				a[e] = t,
				o.set(a, n)
			}
		};
		const P = k;
		var W,
		j = {
			maxNestedLevel: 3,
			addedSubGroupToTree: function (e, t, n, a) {
				var i = !1;
				for (var r in e) {
					var o = j.addedSubGroupToTree(e[r], t, n, a);
					!0 === o.addedStatus && (e[r] = o.tree, i = !0),
					r === t && (e[r][n] = a, i = !0)
				}
				return {
					tree: e,
					addedStatus: i
				}
			},
			removeChildFromTree: function (e, t) {
				var n = !1;
				for (var a in e) {
					var i = j.removeChildFromTree(e[a], t);
					!1 !== i.removedElement && (e[a] = i.tree, n = i.removedElement),
					a !== t || (n = e[a], delete e[a])
				}
				return {
					tree: e,
					removedElement: n
				}
			},
			updateTitleInTree: function (e, t, n) {
				for (var a in e)
					e[a] = j.updateTitleInTree(e[a], t, n), a === t && (e[n] = e[t], delete e[t]);
				return e
			},
			getDepthElement: function (e) {
				var t = 1;
				for (var n in e) {
					var a = j.getDepthElement(e[n]) + 1;
					t = Math.max(a, t)
				}
				return t
			},
			addSubGroupAsync: (W = t(i().mark((function e(t, n) {
								var a,
								r,
								o,
								s,
								d;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.next = 2,
												P.getSettings();
											case 2:
												if ((a = e.sent) || (a = {}), "sub_groups" in a || (a.sub_groups = {}), "none" != t) {
													e.next = 11;
													break
												}
												r = j.removeChildFromTree(a.sub_groups, n),
												a.sub_groups = r.tree,
												a.sub_groups[n] = r.removedElement,
												e.next = 18;
												break;
											case 11:
												if (o = j.removeChildFromTree(a.sub_groups, n), s = {}, !1 !== o.removedElement && (s = o.removedElement), d = j.addedSubGroupToTree(a.sub_groups, t, n, s), !(j.getDepthElement(s) - 1 > j.maxNestedLevel || j.getDepthElement(d.tree) - 1 > j.maxNestedLevel)) {
													e.next = 17;
													break
												}
												return e.abrupt("return");
											case 17:
												!1 === d.addedStatus ? ([t]in a.sub_groups || (a.sub_groups[t] = {}), a.sub_groups[t][n] = s) : a.sub_groups = d.tree;
											case 18:
												return e.abrupt("return", new Promise((function (e) {
															P.save("ysc_settings", a, (function (t) {
																	e(t)
																}))
														})));
											case 19:
											case "end":
												return e.stop()
											}
									}), e)
							}))), function (e, t) {
				return W.apply(this, arguments)
			}),
			updateTitle: function (e, t, n) {
				P.getSettings().then((function (a) {
						a || (a = {}),
						"sub_groups" in a || (a.sub_groups = {}),
						a.sub_groups = j.updateTitleInTree(a.sub_groups, e, t),
						P.save("ysc_settings", a, n)
					})).catch((function () {}))
			},
			removeGroup: function (e, t) {
				P.getSettings().then((function (n) {
						n || (n = {}),
						"sub_groups" in n || (n.sub_groups = {});
						var a = j.removeChildFromTree(n.sub_groups, e);
						n.sub_groups = a.tree,
						P.save("ysc_settings", n, t)
					})).catch((function () {}))
			},
			get: function () {
				return new Promise((function (e) {
						j.getCallback(e)
					}))
			},
			getCallback: function (e) {
				var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
				chromeStorage.get("ysc_settings", function () {
					var a = t(i().mark((function t(a) {
									var r,
									o,
									s,
									d,
									u,
									m;
									return i().wrap((function (t) {
											for (; ; )
												switch (t.prev = t.next) {
												case 0:
													if (void 0 === r && (r = self), a && 0 !== Object.keys(a).length) {
														t.next = 8;
														break
													}
													if (a = {}, !(n < 3)) {
														t.next = 8;
														break
													}
													return t.next = 6,
													Li(500);
												case 6:
													return j.getCallback(e, ++n),
													t.abrupt("return");
												case 8:
													if (o = a && a.ysc_settings ? a.ysc_settings : {}, s = o && o.sub_groups ? o.sub_groups : {}, r.isPatreon) {
														t.next = 65;
														break
													}
													if (patreonInit) {
														t.next = 63;
														break
													}
													return t.next = 14,
													ir();
												case 14:
													if (t.t0 = t.sent, t.t0) {
														t.next = 17;
														break
													}
													t.t0 = {};
												case 17:
													if ("patreonData" in(d = t.t0) && Object.keys(d.patreonData).length && (r.isPatreon = Zi(d.patreonData), patreonInit = !0, r.isPatreon || (s = {})), "paddleData" in d && Object.keys(d.paddleData).length && (r.isPatreon = er(d.paddleData), r.isPatreon && document.querySelector("html").setAttribute("ysm-email", d.paddleData.email), patreonInit = !0, r.isPatreon || (s = {})), !("patreon" in o) || patreonInit) {
														t.next = 40;
														break
													}
													return t.prev = 21,
													t.next = 24,
													Bi(o.patreon);
												case 24:
													if (!("error" in(u = t.sent)) || "race-limit" !== u.error) {
														t.next = 29;
														break
													}
													return t.next = 28,
													P.removeAll(["patreon", "yu"]);
												case 28:
													s = {};
												case 29:
													if ("error" in u) {
														t.next = 34;
														break
													}
													return t.next = 32,
													P.addAsync("patreon", JSON.stringify(u));
												case 32:
													r.isPatreon = Zi(u),
													r.isPatreon || (s = {});
												case 34:
													t.next = 39;
													break;
												case 36:
													t.prev = 36,
													t.t1 = t.catch(21),
													console.log(t.t1);
												case 39:
													patreonInit = !0;
												case 40:
													if (!("yu" in o) || !("email" in o.yu) || patreonInit) {
														t.next = 61;
														break
													}
													return t.prev = 41,
													t.next = 44,
													Ri(o.yu);
												case 44:
													if (!("error" in(m = t.sent)) || "race-limit" !== m.error) {
														t.next = 49;
														break
													}
													return t.next = 48,
													P.removeAll(["patreon", "yu"]);
												case 48:
													s = {};
												case 49:
													if ("error" in m) {
														t.next = 55;
														break
													}
													return t.next = 52,
													P.addAsync("yu", m);
												case 52:
													r.isPatreon = er(m),
													r.isPatreon && document.querySelector("html").setAttribute("ysm-email", m.email),
													r.isPatreon || (s = {});
												case 55:
													t.next = 60;
													break;
												case 57:
													t.prev = 57,
													t.t2 = t.catch(41),
													console.log(t.t2);
												case 60:
													patreonInit = !0;
												case 61:
													t.next = 64;
													break;
												case 63:
													s = {};
												case 64:
													patreonInit = !0;
												case 65:
													e(s);
												case 66:
												case "end":
													return t.stop()
												}
										}), t, null, [
											[21, 36],
											[41, 57]
										])
								})));
					return function (e) {
						return a.apply(this, arguments)
					}
				}
					())
			}
		};

		function x(e, t) {
			var n = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var a = Object.getOwnPropertySymbols(e);
				t && (a = a.filter((function (t) {
								return Object.getOwnPropertyDescriptor(e, t).enumerable
							}))),
				n.push.apply(n, a)
			}
			return n
		}

		function z(e) {
			for (var t = 1; t < arguments.length; t++) {
				var n = null != arguments[t] ? arguments[t] : {};
				t % 2 ? x(Object(n), !0).forEach((function (t) {
						l(e, t, n[t])
					})) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : x(Object(n)).forEach((function (t) {
						Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
					}))
			}
			return e
		}

		function T(e, t) {
			var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (!n) {
				if (Array.isArray(e) || (n = function (e, t) {
						if (e) {
							if ("string" == typeof e)
								return E(e, t);
								var n = {}
								.toString.call(e).slice(8, -1);
								return "Object" === n && e.constructor && (n = e.constructor.name),
								"Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? E(e, t) : void 0
							}
						}
							(e)) || t && e && "number" == typeof e.length) {
						n && (e = n);
						var a = 0,
						i = function () {};
						return {
							s: i,
							n: function () {
								return a >= e.length ? {
									done: !0
								}
								 : {
									done: !1,
									value: e[a++]
								}
							},
							e: function (e) {
								throw e
							},
							f: i
						}
					}
				throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}
			var r,
			o = !0,
			s = !1;
			return {
				s: function () {
					n = n.call(e)
				},
				n: function () {
					var e = n.next();
					return o = e.done,
					e
				},
				e: function (e) {
					s = !0,
					r = e
				},
				f: function () {
					try {
						o || null == n.return || n.return()
					} finally {
						if (s)
							throw r
					}
				}
			}
		}

		function E(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var n = 0, a = Array(t); n < t; n++)
				a[n] = e[n];
			return a
		}
		var S,
		C = {
			chunkSize: 50,
			type: "ysc_meta",
			chunks: 20,
			add: function (e, t, n) {
				C.getMeta().then((function (a) {
						e = e.trim(),
						a && a[e] || (a[e] = {
								img: ""
							}),
						a[e].img = t,
						C.save(C.type, a, n)
					})).catch((function () {}))
			},
			addAsyncSave: (S = t(i().mark((function e(t, n) {
								var a;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.next = 2,
												C.getMetaWithoutRetry();
											case 2:
												return a = e.sent,
												t = t.trim(),
												a && a[t] || (a[t] = {
														img: ""
													}),
												a[t].img = n,
												e.abrupt("return", new Promise((function (e) {
															C.save(C.type, a, (function (t) {
																	e(t)
																}))
														})));
											case 7:
											case "end":
												return e.stop()
											}
									}), e)
							}))), function (e, t) {
				return S.apply(this, arguments)
			}),
			addAsync: function () {
				var e = t(i().mark((function e(t, n) {
								var a;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.next = 2,
												C.getMeta();
											case 2:
												return a = e.sent,
												t = t.trim(),
												a && a[t] || (a[t] = {
														img: ""
													}),
												a[t].img = n,
												e.abrupt("return", {
													ysc_meta: a
												});
											case 7:
											case "end":
												return e.stop()
											}
									}), e)
							})));
				return function (t, n) {
					return e.apply(this, arguments)
				}
			}
			(),
			updateListOrder: function (e) {
				C.getMeta().then((function (t) {
						for (var n in e)
							t && t[n] || (t[n] = {
									img: ""
								}), t[n].position = e[n];
						C.save(C.type, t, (function () {}))
					})).catch((function () {}))
			},
			removeTitleId: function (e, t) {
				C.getMeta().then((function (n) {
						for (var a in n)
							a == e && delete n[a];
						C.save(C.type, n, t)
					})).catch((function () {}))
			},
			removeGroups: function (e, t) {
				C.getMeta().then((function (n) {
						for (var a in n)
							 - 1 !== e.indexOf(a) && delete n[a];
						C.save(C.type, n, t)
					})).catch((function () {}))
			},
			updateTitle: function (e, t, n) {
				C.getMeta().then((function (a) {
						for (var i in t = t.trim(), a)
							i == e && (a[t] = a[i], delete a[i]);
						C.save(C.type, a, n)
					})).catch((function () {}))
			},
			getMetaWithoutRetry: function () {
				return new Promise((function (e) {
						for (var t = [C.type], n = 0; n < C.chunks; n++)
							t.push(C.type + "_meta_parts_" + n);
						C.getMetaCallback(t, e, 3)
					}))
			},
			getMeta: function () {
				return new Promise((function (e) {
						for (var t = [C.type], n = 0; n < C.chunks; n++)
							t.push(C.type + "_meta_parts_" + n);
						C.getMetaCallback(t, e)
					}))
			},
			getMetaId: function (e) {
				return new Promise((function (t) {
						for (var n = [C.type], a = 0; a < C.chunks; a++)
							n.push(C.type + "_meta_parts_" + a);
						C.getMetaIdCallback(n, e, t)
					}))
			},
			getMetaCallback: function (e, n) {
				var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
				chromeStorage.get(e, function () {
					var r = t(i().mark((function t(r) {
									var o,
									s,
									d,
									u;
									return i().wrap((function (t) {
											for (; ; )
												switch (t.prev = t.next) {
												case 0:
													if (r && 0 !== Object.keys(r).length) {
														t.next = 7;
														break
													}
													if (r = {}, !(a < 3)) {
														t.next = 7;
														break
													}
													return t.next = 5,
													Li(500);
												case 5:
													return C.getMetaCallback(e, n, ++a),
													t.abrupt("return");
												case 7:
													o = {},
													s = T(e),
													t.prev = 9,
													s.s();
												case 11:
													if ((d = s.n()).done) {
														t.next = 18;
														break
													}
													if (!1 != (u = d.value)in r) {
														t.next = 15;
														break
													}
													return t.abrupt("continue", 16);
												case 15:
													o = z(z({}, o), r[u]);
												case 16:
													t.next = 11;
													break;
												case 18:
													t.next = 23;
													break;
												case 20:
													t.prev = 20,
													t.t0 = t.catch(9),
													s.e(t.t0);
												case 23:
													return t.prev = 23,
													s.f(),
													t.finish(23);
												case 26:
													n(o);
												case 27:
												case "end":
													return t.stop()
												}
										}), t, null, [
											[9, 20, 23, 26]
										])
								})));
					return function (e) {
						return r.apply(this, arguments)
					}
				}
					())
			},
			getMetaIdCallback: function (e, n, a) {
				var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;
				chromeStorage.get(e, function () {
					var o = t(i().mark((function t(o) {
									var s,
									d,
									u,
									m,
									l;
									return i().wrap((function (t) {
											for (; ; )
												switch (t.prev = t.next) {
												case 0:
													if (o && 0 !== Object.keys(o).length) {
														t.next = 7;
														break
													}
													if (o = {}, !(r < 3)) {
														t.next = 7;
														break
													}
													return t.next = 5,
													Li(500);
												case 5:
													return C.getMetaIdCallback(e, n, a, ++r),
													t.abrupt("return");
												case 7:
													s = {},
													d = T(e),
													t.prev = 9,
													d.s();
												case 11:
													if ((u = d.n()).done) {
														t.next = 18;
														break
													}
													if (!1 != (m = u.value)in o) {
														t.next = 15;
														break
													}
													return t.abrupt("continue", 16);
												case 15:
													s = z(z({}, s), o[m]);
												case 16:
													t.next = 11;
													break;
												case 18:
													t.next = 23;
													break;
												case 20:
													t.prev = 20,
													t.t0 = t.catch(9),
													d.e(t.t0);
												case 23:
													return t.prev = 23,
													d.f(),
													t.finish(23);
												case 26:
													l = s[n] ? s[n] : {},
													a(l);
												case 28:
												case "end":
													return t.stop()
												}
										}), t, null, [
											[9, 20, 23, 26]
										])
								})));
					return function (e) {
						return o.apply(this, arguments)
					}
				}
					())
			},
			enrichData: function (e, t) {
				for (var n = Object.entries(t), a = []; n.length > C.chunkSize; )
					a.push(n.splice(0, C.chunkSize));
				a.push(n);
				for (var i = a.length >= C.chunks ? C.chunks : a.length, r = 0; r < i; r++)
					if (0 !== r) {
						for (var o = {}, s = 0; s < a[r].length; s++)
							o[a[r][s][0]] = a[r][s][1];
						e[C.type + "_meta_parts_" + r] = o
					} else {
						for (var d = {}, u = 0; u < a[r].length; u++)
							d[a[r][u][0]] = a[r][u][1];
						e[C.type] = d
					}
				return e
			},
			save: function (e, t, n) {
				var a = {};
				Object.keys(t).length <= C.chunkSize ? a[e] = t : a = C.enrichData(a, t),
				o.set(a, n)
			}
		};

		function A(e, t) {
			for (var n = 0; n < t.length; n++) {
				var a = t[n];
				a.enumerable = a.enumerable || !1,
				a.configurable = !0,
				"value" in a && (a.writable = !0),
				Object.defineProperty(e, m(a.key), a)
			}
		}
		var H = function () {
			return function (e, t, n) {
				return t && A(e.prototype, t),
				n && A(e, n),
				Object.defineProperty(e, "prototype", {
					writable: !1
				}),
				e
			}
			((function e() {
					!function (e, t) {
						if (!(e instanceof t))
							throw new TypeError("Cannot call a class as a function")
					}
					(this, e),
					this.handlers = []
				}), [{
						key: "subscribe",
						value: function (e, t, n) {
							void 0 === n && (n = t),
							this.handlers.push({
								event: e,
								handler: t.bind(n)
							})
						}
					}, {
						key: "publish",
						value: function (e, t) {
							this.handlers.forEach((function (n) {
									n.event === e && n.handler(t)
								}))
						}
					}
				])
		}
		();
		new H;
		const N = {
			lessThanXSeconds: {
				one: "minder as 'n sekonde",
				other: "minder as {{count}} sekondes"
			},
			xSeconds: {
				one: "1 sekonde",
				other: "{{count}} sekondes"
			},
			halfAMinute: "'n halwe minuut",
			lessThanXMinutes: {
				one: "minder as 'n minuut",
				other: "minder as {{count}} minute"
			},
			xMinutes: {
				one: "'n minuut",
				other: "{{count}} minute"
			},
			aboutXHours: {
				one: "ongeveer 1 uur",
				other: "ongeveer {{count}} ure"
			},
			xHours: {
				one: "1 uur",
				other: "{{count}} ure"
			},
			xDays: {
				one: "1 dag",
				other: "{{count}} dae"
			},
			aboutXWeeks: {
				one: "ongeveer 1 week",
				other: "ongeveer {{count}} weke"
			},
			xWeeks: {
				one: "1 week",
				other: "{{count}} weke"
			},
			aboutXMonths: {
				one: "ongeveer 1 maand",
				other: "ongeveer {{count}} maande"
			},
			xMonths: {
				one: "1 maand",
				other: "{{count}} maande"
			},
			aboutXYears: {
				one: "ongeveer 1 jaar",
				other: "ongeveer {{count}} jaar"
			},
			xYears: {
				one: "1 jaar",
				other: "{{count}} jaar"
			},
			overXYears: {
				one: "meer as 1 jaar",
				other: "meer as {{count}} jaar"
			},
			almostXYears: {
				one: "byna 1 jaar",
				other: "byna {{count}} jaar"
			}
		};

		function X(e) {
			return (t = {}) => {
				const n = t.width ? String(t.width) : e.defaultWidth;
				return e.formats[n] || e.formats[e.defaultWidth]
			}
		}
		const I = {
			date: X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM yyyy",
					medium: "d MMM yyyy",
					short: "yyyy/MM/dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'om' {{time}}",
					long: "{{date}} 'om' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		D = {
			lastWeek: "'verlede' eeee 'om' p",
			yesterday: "'gister om' p",
			today: "'vandag om' p",
			tomorrow: "'môre om' p",
			nextWeek: "eeee 'om' p",
			other: "P"
		};

		function _(e) {
			return (t, n) => {
				let a;
				if ("formatting" === (n?.context ? String(n.context) : "standalone") && e.formattingValues) {
					const t = e.defaultFormattingWidth || e.defaultWidth,
					i = n?.width ? String(n.width) : t;
					a = e.formattingValues[i] || e.formattingValues[t]
				} else {
					const t = e.defaultWidth,
					i = n?.width ? String(n.width) : e.defaultWidth;
					a = e.values[i] || e.values[t]
				}
				return a[e.argumentCallback ? e.argumentCallback(t) : t]
			}
		}

		function G(e) {
			return (t, n = {}) => {
				const a = n.width,
				i = a && e.matchPatterns[a] || e.matchPatterns[e.defaultMatchWidth],
				r = t.match(i);
				if (!r)
					return null;
				const o = r[0],
				s = a && e.parsePatterns[a] || e.parsePatterns[e.defaultParseWidth],
				d = Array.isArray(s) ? function (e, t) {
					for (let n = 0; n < e.length; n++)
						if (t(e[n]))
							return n;
					return
				}
				(s, (e => e.test(o))) : function (e, t) {
					for (const n in e)
						if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n]))
							return n;
					return
				}
				(s, (e => e.test(o)));
				let u;
				u = e.valueCallback ? e.valueCallback(d) : d,
				u = n.valueCallback ? n.valueCallback(u) : u;
				return {
					value: u,
					rest: t.slice(o.length)
				}
			}
		}

		function F(e) {
			return (t, n = {}) => {
				const a = t.match(e.matchPattern);
				if (!a)
					return null;
				const i = a[0],
				r = t.match(e.parsePattern);
				if (!r)
					return null;
				let o = e.valueCallback ? e.valueCallback(r[0]) : r[0];
				o = n.valueCallback ? n.valueCallback(o) : o;
				return {
					value: o,
					rest: t.slice(i.length)
				}
			}
		}
		_({
			values: {
				narrow: ["vC", "nC"],
				abbreviated: ["vC", "nC"],
				wide: ["voor Christus", "na Christus"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["K1", "K2", "K3", "K4"],
				wide: ["1ste kwartaal", "2de kwartaal", "3de kwartaal", "4de kwartaal"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
				abbreviated: ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
				wide: ["Januarie", "Februarie", "Maart", "April", "Mei", "Junie", "Julie", "Augustus", "September", "Oktober", "November", "Desember"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["S", "M", "D", "W", "D", "V", "S"],
				short: ["So", "Ma", "Di", "Wo", "Do", "Vr", "Sa"],
				abbreviated: ["Son", "Maa", "Din", "Woe", "Don", "Vry", "Sat"],
				wide: ["Sondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrydag", "Saterdag"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "vm",
					pm: "nm",
					midnight: "middernag",
					noon: "middaguur",
					morning: "oggend",
					afternoon: "middag",
					evening: "laat middag",
					night: "aand"
				},
				abbreviated: {
					am: "vm",
					pm: "nm",
					midnight: "middernag",
					noon: "middaguur",
					morning: "oggend",
					afternoon: "middag",
					evening: "laat middag",
					night: "aand"
				},
				wide: {
					am: "vm",
					pm: "nm",
					midnight: "middernag",
					noon: "middaguur",
					morning: "oggend",
					afternoon: "middag",
					evening: "laat middag",
					night: "aand"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "vm",
					pm: "nm",
					midnight: "middernag",
					noon: "uur die middag",
					morning: "uur die oggend",
					afternoon: "uur die middag",
					evening: "uur die aand",
					night: "uur die aand"
				},
				abbreviated: {
					am: "vm",
					pm: "nm",
					midnight: "middernag",
					noon: "uur die middag",
					morning: "uur die oggend",
					afternoon: "uur die middag",
					evening: "uur die aand",
					night: "uur die aand"
				},
				wide: {
					am: "vm",
					pm: "nm",
					midnight: "middernag",
					noon: "uur die middag",
					morning: "uur die oggend",
					afternoon: "uur die middag",
					evening: "uur die aand",
					night: "uur die aand"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(ste|de)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^([vn]\.? ?C\.?)/,
				abbreviated: /^([vn]\. ?C\.?)/,
				wide: /^((voor|na) Christus)/
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^v/, /^n/]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^K[1234]/i,
				wide: /^[1234](st|d)e kwartaal/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(Jan|Feb|Mrt|Apr|Mei|Jun|Jul|Aug|Sep|Okt|Nov|Dec)\.?/i,
				wide: /^(Januarie|Februarie|Maart|April|Mei|Junie|Julie|Augustus|September|Oktober|November|Desember)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^J/i, /^F/i, /^M/i, /^A/i, /^M/i, /^J/i, /^J/i, /^A/i, /^S/i, /^O/i, /^N/i, /^D/i],
				any: [/^Jan/i, /^Feb/i, /^Mrt/i, /^Apr/i, /^Mei/i, /^Jun/i, /^Jul/i, /^Aug/i, /^Sep/i, /^Okt/i, /^Nov/i, /^Dec/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[smdwv]/i,
				short: /^(So|Ma|Di|Wo|Do|Vr|Sa)/i,
				abbreviated: /^(Son|Maa|Din|Woe|Don|Vry|Sat)/i,
				wide: /^(Sondag|Maandag|Dinsdag|Woensdag|Donderdag|Vrydag|Saterdag)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^S/i, /^M/i, /^D/i, /^W/i, /^D/i, /^V/i, /^S/i],
				any: [/^So/i, /^Ma/i, /^Di/i, /^Wo/i, /^Do/i, /^Vr/i, /^Sa/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				any: /^(vm|nm|middernag|(?:uur )?die (oggend|middag|aand))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^vm/i,
					pm: /^nm/i,
					midnight: /^middernag/i,
					noon: /^middaguur/i,
					morning: /oggend/i,
					afternoon: /middag/i,
					evening: /laat middag/i,
					night: /aand/i
				}
			},
			defaultParseWidth: "any"
		});
		const O = {
			lessThanXSeconds: {
				one: "أقل من ثانية واحدة",
				two: "أقل من ثانتين",
				threeToTen: "أقل من {{count}} ثواني",
				other: "أقل من {{count}} ثانية"
			},
			xSeconds: {
				one: "ثانية واحدة",
				two: "ثانتين",
				threeToTen: "{{count}} ثواني",
				other: "{{count}} ثانية"
			},
			halfAMinute: "نصف دقيقة",
			lessThanXMinutes: {
				one: "أقل من دقيقة",
				two: "أقل من دقيقتين",
				threeToTen: "أقل من {{count}} دقائق",
				other: "أقل من {{count}} دقيقة"
			},
			xMinutes: {
				one: "دقيقة واحدة",
				two: "دقيقتين",
				threeToTen: "{{count}} دقائق",
				other: "{{count}} دقيقة"
			},
			aboutXHours: {
				one: "ساعة واحدة تقريباً",
				two: "ساعتين تقريباً",
				threeToTen: "{{count}} ساعات تقريباً",
				other: "{{count}} ساعة تقريباً"
			},
			xHours: {
				one: "ساعة واحدة",
				two: "ساعتين",
				threeToTen: "{{count}} ساعات",
				other: "{{count}} ساعة"
			},
			xDays: {
				one: "يوم واحد",
				two: "يومين",
				threeToTen: "{{count}} أيام",
				other: "{{count}} يوم"
			},
			aboutXWeeks: {
				one: "أسبوع واحد تقريباً",
				two: "أسبوعين تقريباً",
				threeToTen: "{{count}} أسابيع تقريباً",
				other: "{{count}} أسبوع تقريباً"
			},
			xWeeks: {
				one: "أسبوع واحد",
				two: "أسبوعين",
				threeToTen: "{{count}} أسابيع",
				other: "{{count}} أسبوع"
			},
			aboutXMonths: {
				one: "شهر واحد تقريباً",
				two: "شهرين تقريباً",
				threeToTen: "{{count}} أشهر تقريباً",
				other: "{{count}} شهر تقريباً"
			},
			xMonths: {
				one: "شهر واحد",
				two: "شهرين",
				threeToTen: "{{count}} أشهر",
				other: "{{count}} شهر"
			},
			aboutXYears: {
				one: "عام واحد تقريباً",
				two: "عامين تقريباً",
				threeToTen: "{{count}} أعوام تقريباً",
				other: "{{count}} عام تقريباً"
			},
			xYears: {
				one: "عام واحد",
				two: "عامين",
				threeToTen: "{{count}} أعوام",
				other: "{{count}} عام"
			},
			overXYears: {
				one: "أكثر من عام",
				two: "أكثر من عامين",
				threeToTen: "أكثر من {{count}} أعوام",
				other: "أكثر من {{count}} عام"
			},
			almostXYears: {
				one: "عام واحد تقريباً",
				two: "عامين تقريباً",
				threeToTen: "{{count}} أعوام تقريباً",
				other: "{{count}} عام تقريباً"
			}
		},
		Y = {
			date: X({
				formats: {
					full: "EEEE, MMMM do, y",
					long: "MMMM do, y",
					medium: "MMM d, y",
					short: "MM/dd/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'عند' {{time}}",
					long: "{{date}} 'عند' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		$ = {
			lastWeek: "'أخر' eeee 'عند' p",
			yesterday: "'أمس عند' p",
			today: "'اليوم عند' p",
			tomorrow: "'غداً عند' p",
			nextWeek: "eeee 'عند' p",
			other: "P"
		},
		K = (_({
				values: {
					narrow: ["ق", "ب"],
					abbreviated: ["ق.م.", "ب.م."],
					wide: ["قبل الميلاد", "بعد الميلاد"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["ر1", "ر2", "ر3", "ر4"],
					wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["ي", "ف", "م", "أ", "م", "ي", "ي", "أ", "س", "أ", "ن", "د"],
					abbreviated: ["ينا", "فبر", "مارس", "أبريل", "مايو", "يونـ", "يولـ", "أغسـ", "سبتـ", "أكتـ", "نوفـ", "ديسـ"],
					wide: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
					short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
					abbreviated: ["أحد", "اثنـ", "ثلا", "أربـ", "خميـ", "جمعة", "سبت"],
					wide: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ص",
						pm: "م",
						midnight: "ن",
						noon: "ظ",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					},
					abbreviated: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					},
					wide: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "ص",
						pm: "م",
						midnight: "ن",
						noon: "ظ",
						morning: "في الصباح",
						afternoon: "بعد الظـهر",
						evening: "في المساء",
						night: "في الليل"
					},
					abbreviated: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "في الصباح",
						afternoon: "بعد الظهر",
						evening: "في المساء",
						night: "في الليل"
					},
					wide: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظـهر",
						evening: "في المساء",
						night: "في الليل"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(th|st|nd|rd)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ق|ب)/i,
					abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?م\.?\s?|a\.?\s?d\.?|c\.?\s?)/i,
					wide: /^(قبل الميلاد|قبل الميلاد|بعد الميلاد|بعد الميلاد)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^قبل/i, /^بعد/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^ر[1234]/i,
					wide: /^الربع [1234]/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[يفمأمسند]/i,
					abbreviated: /^(ين|ف|مار|أب|ماي|يون|يول|أغ|س|أك|ن|د)/i,
					wide: /^(ين|ف|مار|أب|ماي|يون|يول|أغ|س|أك|ن|د)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ي/i, /^ف/i, /^م/i, /^أ/i, /^م/i, /^ي/i, /^ي/i, /^أ/i, /^س/i, /^أ/i, /^ن/i, /^د/i],
					any: [/^ين/i, /^ف/i, /^مار/i, /^أب/i, /^ماي/i, /^يون/i, /^يول/i, /^أغ/i, /^س/i, /^أك/i, /^ن/i, /^د/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[حنثرخجس]/i,
					short: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
					abbreviated: /^(أحد|اثن|ثلا|أرب|خمي|جمعة|سبت)/i,
					wide: /^(الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
					wide: [/^الأحد/i, /^الاثنين/i, /^الثلاثاء/i, /^الأربعاء/i, /^الخميس/i, /^الجمعة/i, /^السبت/i],
					any: [/^أح/i, /^اث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
					any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^mi/i,
						noon: /^no/i,
						morning: /morning/i,
						afternoon: /afternoon/i,
						evening: /evening/i,
						night: /night/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "أقل من ثانية واحدة",
				two: "أقل من ثانتين",
				threeToTen: "أقل من {{count}} ثواني",
				other: "أقل من {{count}} ثانية"
			},
			xSeconds: {
				one: "ثانية واحدة",
				two: "ثانتين",
				threeToTen: "{{count}} ثواني",
				other: "{{count}} ثانية"
			},
			halfAMinute: "نصف دقيقة",
			lessThanXMinutes: {
				one: "أقل من دقيقة",
				two: "أقل من دقيقتين",
				threeToTen: "أقل من {{count}} دقائق",
				other: "أقل من {{count}} دقيقة"
			},
			xMinutes: {
				one: "دقيقة واحدة",
				two: "دقيقتين",
				threeToTen: "{{count}} دقائق",
				other: "{{count}} دقيقة"
			},
			aboutXHours: {
				one: "ساعة واحدة تقريباً",
				two: "ساعتين تقريباً",
				threeToTen: "{{count}} ساعات تقريباً",
				other: "{{count}} ساعة تقريباً"
			},
			xHours: {
				one: "ساعة واحدة",
				two: "ساعتين",
				threeToTen: "{{count}} ساعات",
				other: "{{count}} ساعة"
			},
			xDays: {
				one: "يوم واحد",
				two: "يومين",
				threeToTen: "{{count}} أيام",
				other: "{{count}} يوم"
			},
			aboutXWeeks: {
				one: "أسبوع واحد تقريباً",
				two: "أسبوعين تقريباً",
				threeToTen: "{{count}} أسابيع تقريباً",
				other: "{{count}} أسبوع تقريباً"
			},
			xWeeks: {
				one: "أسبوع واحد",
				two: "أسبوعين",
				threeToTen: "{{count}} أسابيع",
				other: "{{count}} أسبوع"
			},
			aboutXMonths: {
				one: "شهر واحد تقريباً",
				two: "شهرين تقريباً",
				threeToTen: "{{count}} أشهر تقريباً",
				other: "{{count}} شهر تقريباً"
			},
			xMonths: {
				one: "شهر واحد",
				two: "شهرين",
				threeToTen: "{{count}} أشهر",
				other: "{{count}} شهر"
			},
			aboutXYears: {
				one: "عام واحد تقريباً",
				two: "عامين تقريباً",
				threeToTen: "{{count}} أعوام تقريباً",
				other: "{{count}} عام تقريباً"
			},
			xYears: {
				one: "عام واحد",
				two: "عامين",
				threeToTen: "{{count}} أعوام",
				other: "{{count}} عام"
			},
			overXYears: {
				one: "أكثر من عام",
				two: "أكثر من عامين",
				threeToTen: "أكثر من {{count}} أعوام",
				other: "أكثر من {{count}} عام"
			},
			almostXYears: {
				one: "عام واحد تقريباً",
				two: "عامين تقريباً",
				threeToTen: "{{count}} أعوام تقريباً",
				other: "{{count}} عام تقريباً"
			}
		}),
		J = {
			date: X({
				formats: {
					full: "EEEE, MMMM do, y",
					long: "MMMM do, y",
					medium: "MMM d, y",
					short: "MM/dd/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'عند' {{time}}",
					long: "{{date}} 'عند' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		V = {
			lastWeek: "'أخر' eeee 'عند' p",
			yesterday: "'أمس عند' p",
			today: "'اليوم عند' p",
			tomorrow: "'غداً عند' p",
			nextWeek: "eeee 'عند' p",
			other: "P"
		},
		q = (_({
				values: {
					narrow: ["ق", "ب"],
					abbreviated: ["ق.م.", "ب.م."],
					wide: ["قبل الميلاد", "بعد الميلاد"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["ر1", "ر2", "ر3", "ر4"],
					wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
				},
				defaultWidth: "wide",
				argumentCallback: e => Number(e) - 1
			}), _({
				values: {
					narrow: ["ج", "ف", "م", "أ", "م", "ج", "ج", "أ", "س", "أ", "ن", "د"],
					abbreviated: ["جانـ", "فيفـ", "مارس", "أفريل", "مايـ", "جوانـ", "جويـ", "أوت", "سبتـ", "أكتـ", "نوفـ", "ديسـ"],
					wide: ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
					short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
					abbreviated: ["أحد", "اثنـ", "ثلا", "أربـ", "خميـ", "جمعة", "سبت"],
					wide: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ص",
						pm: "م",
						midnight: "ن",
						noon: "ظ",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					},
					abbreviated: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					},
					wide: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "ص",
						pm: "م",
						midnight: "ن",
						noon: "ظ",
						morning: "في الصباح",
						afternoon: "بعد الظـهر",
						evening: "في المساء",
						night: "في الليل"
					},
					abbreviated: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "في الصباح",
						afternoon: "بعد الظهر",
						evening: "في المساء",
						night: "في الليل"
					},
					wide: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظـهر",
						evening: "في المساء",
						night: "في الليل"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(th|st|nd|rd)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ق|ب)/i,
					abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?م\.?\s?|a\.?\s?d\.?|c\.?\s?)/i,
					wide: /^(قبل الميلاد|قبل الميلاد|بعد الميلاد|بعد الميلاد)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^قبل/i, /^بعد/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^ر[1234]/i,
					wide: /^الربع [1234]/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => Number(e) + 1
			}), G({
				matchPatterns: {
					narrow: /^[جفمأسند]/i,
					abbreviated: /^(جان|فيف|مار|أفر|ماي|جوا|جوي|أوت|سبت|أكت|نوف|ديس)/i,
					wide: /^(جانفي|فيفري|مارس|أفريل|ماي|جوان|جويلية|أوت|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ج/i, /^ف/i, /^م/i, /^أ/i, /^م/i, /^ج/i, /^ج/i, /^أ/i, /^س/i, /^أ/i, /^ن/i, /^د/i],
					any: [/^جان/i, /^فيف/i, /^مار/i, /^أفر/i, /^ماي/i, /^جوا/i, /^جوي/i, /^أوت/i, /^سبت/i, /^أكت/i, /^نوف/i, /^ديس/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[حنثرخجس]/i,
					short: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
					abbreviated: /^(أحد|اثن|ثلا|أرب|خمي|جمعة|سبت)/i,
					wide: /^(الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
					wide: [/^الأحد/i, /^الاثنين/i, /^الثلاثاء/i, /^الأربعاء/i, /^الخميس/i, /^الجمعة/i, /^السبت/i],
					any: [/^أح/i, /^اث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
					any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^mi/i,
						noon: /^no/i,
						morning: /morning/i,
						afternoon: /afternoon/i,
						evening: /evening/i,
						night: /night/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "أقل من ثانية واحدة",
				two: "أقل من ثانتين",
				threeToTen: "أقل من {{count}} ثواني",
				other: "أقل من {{count}} ثانية"
			},
			xSeconds: {
				one: "ثانية واحدة",
				two: "ثانتين",
				threeToTen: "{{count}} ثواني",
				other: "{{count}} ثانية"
			},
			halfAMinute: "نصف دقيقة",
			lessThanXMinutes: {
				one: "أقل من دقيقة",
				two: "أقل من دقيقتين",
				threeToTen: "أقل من {{count}} دقائق",
				other: "أقل من {{count}} دقيقة"
			},
			xMinutes: {
				one: "دقيقة واحدة",
				two: "دقيقتين",
				threeToTen: "{{count}} دقائق",
				other: "{{count}} دقيقة"
			},
			aboutXHours: {
				one: "ساعة واحدة تقريباً",
				two: "ساعتين تقريباً",
				threeToTen: "{{count}} ساعات تقريباً",
				other: "{{count}} ساعة تقريباً"
			},
			xHours: {
				one: "ساعة واحدة",
				two: "ساعتين",
				threeToTen: "{{count}} ساعات",
				other: "{{count}} ساعة"
			},
			xDays: {
				one: "يوم واحد",
				two: "يومين",
				threeToTen: "{{count}} أيام",
				other: "{{count}} يوم"
			},
			aboutXWeeks: {
				one: "أسبوع واحد تقريباً",
				two: "أسبوعين تقريباً",
				threeToTen: "{{count}} أسابيع تقريباً",
				other: "{{count}} أسبوع تقريباً"
			},
			xWeeks: {
				one: "أسبوع واحد",
				two: "أسبوعين",
				threeToTen: "{{count}} أسابيع",
				other: "{{count}} أسبوع"
			},
			aboutXMonths: {
				one: "شهر واحد تقريباً",
				two: "شهرين تقريباً",
				threeToTen: "{{count}} أشهر تقريباً",
				other: "{{count}} شهر تقريباً"
			},
			xMonths: {
				one: "شهر واحد",
				two: "شهرين",
				threeToTen: "{{count}} أشهر",
				other: "{{count}} شهر"
			},
			aboutXYears: {
				one: "عام واحد تقريباً",
				two: "عامين تقريباً",
				threeToTen: "{{count}} أعوام تقريباً",
				other: "{{count}} عام تقريباً"
			},
			xYears: {
				one: "عام واحد",
				two: "عامين",
				threeToTen: "{{count}} أعوام",
				other: "{{count}} عام"
			},
			overXYears: {
				one: "أكثر من عام",
				two: "أكثر من عامين",
				threeToTen: "أكثر من {{count}} أعوام",
				other: "أكثر من {{count}} عام"
			},
			almostXYears: {
				one: "عام واحد تقريباً",
				two: "عامين تقريباً",
				threeToTen: "{{count}} أعوام تقريباً",
				other: "{{count}} عام تقريباً"
			}
		}),
		L = {
			date: X({
				formats: {
					full: "EEEE, MMMM do, y",
					long: "MMMM do, y",
					medium: "MMM d, y",
					short: "MM/dd/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'عند' {{time}}",
					long: "{{date}} 'عند' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		B = {
			lastWeek: "'أخر' eeee 'عند' p",
			yesterday: "'أمس عند' p",
			today: "'اليوم عند' p",
			tomorrow: "'غداً عند' p",
			nextWeek: "eeee 'عند' p",
			other: "P"
		},
		Q = (_({
				values: {
					narrow: ["ق", "ب"],
					abbreviated: ["ق.م.", "ب.م."],
					wide: ["قبل الميلاد", "بعد الميلاد"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["ر1", "ر2", "ر3", "ر4"],
					wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
				},
				defaultWidth: "wide",
				argumentCallback: e => Number(e) - 1
			}), _({
				values: {
					narrow: ["ي", "ف", "م", "أ", "م", "ي", "ي", "غ", "ش", "أ", "ن", "د"],
					abbreviated: ["ينا", "فبر", "مارس", "أبريل", "ماي", "يونـ", "يولـ", "غشت", "شتنـ", "أكتـ", "نونـ", "دجنـ"],
					wide: ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
					short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
					abbreviated: ["أحد", "اثنـ", "ثلا", "أربـ", "خميـ", "جمعة", "سبت"],
					wide: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ص",
						pm: "م",
						midnight: "ن",
						noon: "ظ",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					},
					abbreviated: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					},
					wide: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظهر",
						evening: "مساءاً",
						night: "ليلاً"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "ص",
						pm: "م",
						midnight: "ن",
						noon: "ظ",
						morning: "في الصباح",
						afternoon: "بعد الظـهر",
						evening: "في المساء",
						night: "في الليل"
					},
					abbreviated: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "في الصباح",
						afternoon: "بعد الظهر",
						evening: "في المساء",
						night: "في الليل"
					},
					wide: {
						am: "ص",
						pm: "م",
						midnight: "نصف الليل",
						noon: "ظهر",
						morning: "صباحاً",
						afternoon: "بعد الظـهر",
						evening: "في المساء",
						night: "في الليل"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(th|st|nd|rd)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ق|ب)/i,
					abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?م\.?\s?|a\.?\s?d\.?|c\.?\s?)/i,
					wide: /^(قبل الميلاد|قبل الميلاد|بعد الميلاد|بعد الميلاد)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^قبل/i, /^بعد/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^ر[1234]/i,
					wide: /^الربع [1234]/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => Number(e) + 1
			}), G({
				matchPatterns: {
					narrow: /^[يفمأمسند]/i,
					abbreviated: /^(ين|ف|مار|أب|ماي|يون|يول|غش|شت|أك|ن|د)/i,
					wide: /^(ين|ف|مار|أب|ماي|يون|يول|غش|شت|أك|ن|د)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ي/i, /^ف/i, /^م/i, /^أ/i, /^م/i, /^ي/i, /^ي/i, /^غ/i, /^ش/i, /^أ/i, /^ن/i, /^د/i],
					any: [/^ين/i, /^فب/i, /^مار/i, /^أب/i, /^ماي/i, /^يون/i, /^يول/i, /^غشت/i, /^ش/i, /^أك/i, /^ن/i, /^د/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[حنثرخجس]/i,
					short: /^(أحد|إثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
					abbreviated: /^(أحد|إثن|ثلا|أرب|خمي|جمعة|سبت)/i,
					wide: /^(الأحد|الإثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
					wide: [/^الأحد/i, /^الإثنين/i, /^الثلاثاء/i, /^الأربعاء/i, /^الخميس/i, /^الجمعة/i, /^السبت/i],
					any: [/^أح/i, /^إث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
					any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^mi/i,
						noon: /^no/i,
						morning: /morning/i,
						afternoon: /afternoon/i,
						evening: /evening/i,
						night: /night/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "bir saniyədən az",
				other: "{{count}} bir saniyədən az"
			},
			xSeconds: {
				one: "1 saniyə",
				other: "{{count}} saniyə"
			},
			halfAMinute: "yarım dəqiqə",
			lessThanXMinutes: {
				one: "bir dəqiqədən az",
				other: "{{count}} bir dəqiqədən az"
			},
			xMinutes: {
				one: "bir dəqiqə",
				other: "{{count}} dəqiqə"
			},
			aboutXHours: {
				one: "təxminən 1 saat",
				other: "təxminən {{count}} saat"
			},
			xHours: {
				one: "1 saat",
				other: "{{count}} saat"
			},
			xDays: {
				one: "1 gün",
				other: "{{count}} gün"
			},
			aboutXWeeks: {
				one: "təxminən 1 həftə",
				other: "təxminən {{count}} həftə"
			},
			xWeeks: {
				one: "1 həftə",
				other: "{{count}} həftə"
			},
			aboutXMonths: {
				one: "təxminən 1 ay",
				other: "təxminən {{count}} ay"
			},
			xMonths: {
				one: "1 ay",
				other: "{{count}} ay"
			},
			aboutXYears: {
				one: "təxminən 1 il",
				other: "təxminən {{count}} il"
			},
			xYears: {
				one: "1 il",
				other: "{{count}} il"
			},
			overXYears: {
				one: "1 ildən çox",
				other: "{{count}} ildən çox"
			},
			almostXYears: {
				one: "demək olar ki 1 il",
				other: "demək olar ki {{count}} il"
			}
		}),
		R = {
			date: X({
				formats: {
					full: "EEEE, do MMMM y 'il'",
					long: "do MMMM y 'il'",
					medium: "d MMM y 'il'",
					short: "dd.MM.yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}} - 'də'",
					long: "{{date}} {{time}} - 'də'",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		U = {
			lastWeek: "'sonuncu' eeee p -'də'",
			yesterday: "'dünən' p -'də'",
			today: "'bugün' p -'də'",
			tomorrow: "'sabah' p -'də'",
			nextWeek: "eeee p -'də'",
			other: "P"
		},
		Z = {
			1: "-inci",
			5: "-inci",
			8: "-inci",
			70: "-inci",
			80: "-inci",
			2: "-nci",
			7: "-nci",
			20: "-nci",
			50: "-nci",
			3: "-üncü",
			4: "-üncü",
			100: "-üncü",
			6: "-ncı",
			9: "-uncu",
			10: "-uncu",
			30: "-uncu",
			60: "-ıncı",
			90: "-ıncı"
		};
		_({
			values: {
				narrow: ["e.ə", "b.e"],
				abbreviated: ["e.ə", "b.e"],
				wide: ["eramızdan əvvəl", "bizim era"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["K1", "K2", "K3", "K4"],
				wide: ["1ci kvartal", "2ci kvartal", "3cü kvartal", "4cü kvartal"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["Y", "F", "M", "A", "M", "İ", "İ", "A", "S", "O", "N", "D"],
				abbreviated: ["Yan", "Fev", "Mar", "Apr", "May", "İyun", "İyul", "Avq", "Sen", "Okt", "Noy", "Dek"],
				wide: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["B.", "B.e", "Ç.a", "Ç.", "C.a", "C.", "Ş."],
				short: ["B.", "B.e", "Ç.a", "Ç.", "C.a", "C.", "Ş."],
				abbreviated: ["Baz", "Baz.e", "Çər.a", "Çər", "Cüm.a", "Cüm", "Şə"],
				wide: ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "am",
					pm: "pm",
					midnight: "gecəyarı",
					noon: "gün",
					morning: "səhər",
					afternoon: "gündüz",
					evening: "axşam",
					night: "gecə"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "gecəyarı",
					noon: "gün",
					morning: "səhər",
					afternoon: "gündüz",
					evening: "axşam",
					night: "gecə"
				},
				wide: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "gecəyarı",
					noon: "gün",
					morning: "səhər",
					afternoon: "gündüz",
					evening: "axşam",
					night: "gecə"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "a",
					pm: "p",
					midnight: "gecəyarı",
					noon: "gün",
					morning: "səhər",
					afternoon: "gündüz",
					evening: "axşam",
					night: "gecə"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "gecəyarı",
					noon: "gün",
					morning: "səhər",
					afternoon: "gündüz",
					evening: "axşam",
					night: "gecə"
				},
				wide: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "gecəyarı",
					noon: "gün",
					morning: "səhər",
					afternoon: "gündüz",
					evening: "axşam",
					night: "gecə"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(-?(ci|inci|nci|uncu|üncü|ncı))?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(b|a)$/i,
				abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)$/i,
				wide: /^(bizim eradan əvvəl|bizim era)$/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^b$/i, /^(a|c)$/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]$/i,
				abbreviated: /^K[1234]$/i,
				wide: /^[1234](ci)? kvartal$/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[(?-i)yfmaisond]$/i,
				abbreviated: /^(Yan|Fev|Mar|Apr|May|İyun|İyul|Avq|Sen|Okt|Noy|Dek)$/i,
				wide: /^(Yanvar|Fevral|Mart|Aprel|May|İyun|İyul|Avgust|Sentyabr|Oktyabr|Noyabr|Dekabr)$/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^[(?-i)y]$/i, /^[(?-i)f]$/i, /^[(?-i)m]$/i, /^[(?-i)a]$/i, /^[(?-i)m]$/i, /^[(?-i)i]$/i, /^[(?-i)i]$/i, /^[(?-i)a]$/i, /^[(?-i)s]$/i, /^[(?-i)o]$/i, /^[(?-i)n]$/i, /^[(?-i)d]$/i],
				abbreviated: [/^Yan$/i, /^Fev$/i, /^Mar$/i, /^Apr$/i, /^May$/i, /^İyun$/i, /^İyul$/i, /^Avg$/i, /^Sen$/i, /^Okt$/i, /^Noy$/i, /^Dek$/i],
				wide: [/^Yanvar$/i, /^Fevral$/i, /^Mart$/i, /^Aprel$/i, /^May$/i, /^İyun$/i, /^İyul$/i, /^Avgust$/i, /^Sentyabr$/i, /^Oktyabr$/i, /^Noyabr$/i, /^Dekabr$/i]
			},
			defaultParseWidth: "narrow"
		}),
		G({
			matchPatterns: {
				narrow: /^(B\.|B\.e|Ç\.a|Ç\.|C\.a|C\.|Ş\.)$/i,
				short: /^(B\.|B\.e|Ç\.a|Ç\.|C\.a|C\.|Ş\.)$/i,
				abbreviated: /^(Baz\.e|Çər|Çər\.a|Cüm|Cüm\.a|Şə)$/i,
				wide: /^(Bazar|Bazar ertəsi|Çərşənbə axşamı|Çərşənbə|Cümə axşamı|Cümə|Şənbə)$/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^B\.$/i, /^B\.e$/i, /^Ç\.a$/i, /^Ç\.$/i, /^C\.a$/i, /^C\.$/i, /^Ş\.$/i],
				abbreviated: [/^Baz$/i, /^Baz\.e$/i, /^Çər\.a$/i, /^Çər$/i, /^Cüm\.a$/i, /^Cüm$/i, /^Şə$/i],
				wide: [/^Bazar$/i, /^Bazar ertəsi$/i, /^Çərşənbə axşamı$/i, /^Çərşənbə$/i, /^Cümə axşamı$/i, /^Cümə$/i, /^Şənbə$/i],
				any: [/^B\.$/i, /^B\.e$/i, /^Ç\.a$/i, /^Ç\.$/i, /^C\.a$/i, /^C\.$/i, /^Ş\.$/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(a|p|gecəyarı|gün|səhər|gündüz|axşam|gecə)$/i,
				any: /^(am|pm|a\.m\.|p\.m\.|AM|PM|gecəyarı|gün|səhər|gündüz|axşam|gecə)$/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^a$/i,
					pm: /^p$/i,
					midnight: /^gecəyarı$/i,
					noon: /^gün$/i,
					morning: /səhər$/i,
					afternoon: /gündüz$/i,
					evening: /axşam$/i,
					night: /gecə$/i
				}
			},
			defaultParseWidth: "any"
		});

		function ee(e, t) {
			if (void 0 !== e.one && 1 === t)
				return e.one;
			const n = t % 10,
			a = t % 100;
			return 1 === n && 11 !== a ? e.singularNominative.replace("{{count}}", String(t)) : n >= 2 && n <= 4 && (a < 10 || a > 20) ? e.singularGenitive.replace("{{count}}", String(t)) : e.pluralGenitive.replace("{{count}}", String(t))
		}

		function te(e) {
			return (t, n) => n && n.addSuffix ? n.comparison && n.comparison > 0 ? e.future ? ee(e.future, t) : "праз " + ee(e.regular, t) : e.past ? ee(e.past, t) : ee(e.regular, t) + " таму" : ee(e.regular, t)
		}
		const ne = {
			lessThanXSeconds: te({
				regular: {
					one: "менш за секунду",
					singularNominative: "менш за {{count}} секунду",
					singularGenitive: "менш за {{count}} секунды",
					pluralGenitive: "менш за {{count}} секунд"
				},
				future: {
					one: "менш, чым праз секунду",
					singularNominative: "менш, чым праз {{count}} секунду",
					singularGenitive: "менш, чым праз {{count}} секунды",
					pluralGenitive: "менш, чым праз {{count}} секунд"
				}
			}),
			xSeconds: te({
				regular: {
					singularNominative: "{{count}} секунда",
					singularGenitive: "{{count}} секунды",
					pluralGenitive: "{{count}} секунд"
				},
				past: {
					singularNominative: "{{count}} секунду таму",
					singularGenitive: "{{count}} секунды таму",
					pluralGenitive: "{{count}} секунд таму"
				},
				future: {
					singularNominative: "праз {{count}} секунду",
					singularGenitive: "праз {{count}} секунды",
					pluralGenitive: "праз {{count}} секунд"
				}
			}),
			halfAMinute: (e, t) => t && t.addSuffix ? t.comparison && t.comparison > 0 ? "праз паўхвіліны" : "паўхвіліны таму" : "паўхвіліны",
			lessThanXMinutes: te({
				regular: {
					one: "менш за хвіліну",
					singularNominative: "менш за {{count}} хвіліну",
					singularGenitive: "менш за {{count}} хвіліны",
					pluralGenitive: "менш за {{count}} хвілін"
				},
				future: {
					one: "менш, чым праз хвіліну",
					singularNominative: "менш, чым праз {{count}} хвіліну",
					singularGenitive: "менш, чым праз {{count}} хвіліны",
					pluralGenitive: "менш, чым праз {{count}} хвілін"
				}
			}),
			xMinutes: te({
				regular: {
					singularNominative: "{{count}} хвіліна",
					singularGenitive: "{{count}} хвіліны",
					pluralGenitive: "{{count}} хвілін"
				},
				past: {
					singularNominative: "{{count}} хвіліну таму",
					singularGenitive: "{{count}} хвіліны таму",
					pluralGenitive: "{{count}} хвілін таму"
				},
				future: {
					singularNominative: "праз {{count}} хвіліну",
					singularGenitive: "праз {{count}} хвіліны",
					pluralGenitive: "праз {{count}} хвілін"
				}
			}),
			aboutXHours: te({
				regular: {
					singularNominative: "каля {{count}} гадзіны",
					singularGenitive: "каля {{count}} гадзін",
					pluralGenitive: "каля {{count}} гадзін"
				},
				future: {
					singularNominative: "прыблізна праз {{count}} гадзіну",
					singularGenitive: "прыблізна праз {{count}} гадзіны",
					pluralGenitive: "прыблізна праз {{count}} гадзін"
				}
			}),
			xHours: te({
				regular: {
					singularNominative: "{{count}} гадзіна",
					singularGenitive: "{{count}} гадзіны",
					pluralGenitive: "{{count}} гадзін"
				},
				past: {
					singularNominative: "{{count}} гадзіну таму",
					singularGenitive: "{{count}} гадзіны таму",
					pluralGenitive: "{{count}} гадзін таму"
				},
				future: {
					singularNominative: "праз {{count}} гадзіну",
					singularGenitive: "праз {{count}} гадзіны",
					pluralGenitive: "праз {{count}} гадзін"
				}
			}),
			xDays: te({
				regular: {
					singularNominative: "{{count}} дзень",
					singularGenitive: "{{count}} дні",
					pluralGenitive: "{{count}} дзён"
				}
			}),
			aboutXWeeks: te({
				regular: {
					singularNominative: "каля {{count}} тыдні",
					singularGenitive: "каля {{count}} тыдняў",
					pluralGenitive: "каля {{count}} тыдняў"
				},
				future: {
					singularNominative: "прыблізна праз {{count}} тыдзень",
					singularGenitive: "прыблізна праз {{count}} тыдні",
					pluralGenitive: "прыблізна праз {{count}} тыдняў"
				}
			}),
			xWeeks: te({
				regular: {
					singularNominative: "{{count}} тыдзень",
					singularGenitive: "{{count}} тыдні",
					pluralGenitive: "{{count}} тыдняў"
				}
			}),
			aboutXMonths: te({
				regular: {
					singularNominative: "каля {{count}} месяца",
					singularGenitive: "каля {{count}} месяцаў",
					pluralGenitive: "каля {{count}} месяцаў"
				},
				future: {
					singularNominative: "прыблізна праз {{count}} месяц",
					singularGenitive: "прыблізна праз {{count}} месяцы",
					pluralGenitive: "прыблізна праз {{count}} месяцаў"
				}
			}),
			xMonths: te({
				regular: {
					singularNominative: "{{count}} месяц",
					singularGenitive: "{{count}} месяцы",
					pluralGenitive: "{{count}} месяцаў"
				}
			}),
			aboutXYears: te({
				regular: {
					singularNominative: "каля {{count}} года",
					singularGenitive: "каля {{count}} гадоў",
					pluralGenitive: "каля {{count}} гадоў"
				},
				future: {
					singularNominative: "прыблізна праз {{count}} год",
					singularGenitive: "прыблізна праз {{count}} гады",
					pluralGenitive: "прыблізна праз {{count}} гадоў"
				}
			}),
			xYears: te({
				regular: {
					singularNominative: "{{count}} год",
					singularGenitive: "{{count}} гады",
					pluralGenitive: "{{count}} гадоў"
				}
			}),
			overXYears: te({
				regular: {
					singularNominative: "больш за {{count}} год",
					singularGenitive: "больш за {{count}} гады",
					pluralGenitive: "больш за {{count}} гадоў"
				},
				future: {
					singularNominative: "больш, чым праз {{count}} год",
					singularGenitive: "больш, чым праз {{count}} гады",
					pluralGenitive: "больш, чым праз {{count}} гадоў"
				}
			}),
			almostXYears: te({
				regular: {
					singularNominative: "амаль {{count}} год",
					singularGenitive: "амаль {{count}} гады",
					pluralGenitive: "амаль {{count}} гадоў"
				},
				future: {
					singularNominative: "амаль праз {{count}} год",
					singularGenitive: "амаль праз {{count}} гады",
					pluralGenitive: "амаль праз {{count}} гадоў"
				}
			})
		},
		ae = {
			date: X({
				formats: {
					full: "EEEE, d MMMM y 'г.'",
					long: "d MMMM y 'г.'",
					medium: "d MMM y 'г.'",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					any: "{{date}}, {{time}}"
				},
				defaultWidth: "any"
			})
		},
		ie = (Math.pow(10, 8), Symbol.for("constructDateFrom"));

		function re(e, t) {
			return "function" == typeof e ? e(t) : e && "object" == typeof e && ie in e ? e[ie](t) : e instanceof Date ? new e.constructor(t) : new Date(t)
		}
		let oe = {};

		function se() {
			return oe
		}

		function de(e, t) {
			return re(t || e, e)
		}

		function ue(e, t) {
			const n = se(),
			a = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0,
			i = de(e, t?.in),
			r = i.getDay(),
			o = (r < a ? 7 : 0) + r - a;
			return i.setDate(i.getDate() - o),
			i.setHours(0, 0, 0, 0),
			i
		}

		function me(e, t, n) {
			const [a, i] = function (e, ...t) {
				const n = re.bind(null, e || t.find((e => "object" == typeof e)));
				return t.map(n)
			}
			(n?.in, e, t);
			return +ue(a, n) == +ue(i, n)
		}
		const le = ["нядзелю", "панядзелак", "аўторак", "сераду", "чацвер", "пятніцу", "суботу"];

		function he(e) {
			return "'у " + le[e] + " а' p"
		}
		const ce = {
			lastWeek: (e, t, n) => {
				const a = de(e),
				i = a.getDay();
				return me(a, t, n) ? he(i) : function (e) {
					const t = le[e];
					switch (e) {
					case 0:
					case 3:
					case 5:
					case 6:
						return "'у мінулую " + t + " а' p";
					case 1:
					case 2:
					case 4:
						return "'у мінулы " + t + " а' p"
					}
				}
				(i)
			},
			yesterday: "'учора а' p",
			today: "'сёння а' p",
			tomorrow: "'заўтра а' p",
			nextWeek: (e, t, n) => {
				const a = de(e),
				i = a.getDay();
				return me(a, t, n) ? he(i) : function (e) {
					const t = le[e];
					switch (e) {
					case 0:
					case 3:
					case 5:
					case 6:
						return "'у наступную " + t + " а' p";
					case 1:
					case 2:
					case 4:
						return "'у наступны " + t + " а' p"
					}
				}
				(i)
			},
			other: "P"
		},
		ge = (_({
				values: {
					narrow: ["да н.э.", "н.э."],
					abbreviated: ["да н. э.", "н. э."],
					wide: ["да нашай эры", "нашай эры"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1-ы кв.", "2-і кв.", "3-і кв.", "4-ы кв."],
					wide: ["1-ы квартал", "2-і квартал", "3-і квартал", "4-ы квартал"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["С", "Л", "С", "К", "М", "Ч", "Л", "Ж", "В", "К", "Л", "С"],
					abbreviated: ["студз.", "лют.", "сак.", "крас.", "май", "чэрв.", "ліп.", "жн.", "вер.", "кастр.", "ліст.", "снеж."],
					wide: ["студзень", "люты", "сакавік", "красавік", "май", "чэрвень", "ліпень", "жнівень", "верасень", "кастрычнік", "лістапад", "снежань"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["С", "Л", "С", "К", "М", "Ч", "Л", "Ж", "В", "К", "Л", "С"],
					abbreviated: ["студз.", "лют.", "сак.", "крас.", "мая", "чэрв.", "ліп.", "жн.", "вер.", "кастр.", "ліст.", "снеж."],
					wide: ["студзеня", "лютага", "сакавіка", "красавіка", "мая", "чэрвеня", "ліпеня", "жніўня", "верасня", "кастрычніка", "лістапада", "снежня"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["Н", "П", "А", "С", "Ч", "П", "С"],
					short: ["нд", "пн", "аў", "ср", "чц", "пт", "сб"],
					abbreviated: ["нядз", "пан", "аўт", "сер", "чац", "пят", "суб"],
					wide: ["нядзеля", "панядзелак", "аўторак", "серада", "чацвер", "пятніца", "субота"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ДП",
						pm: "ПП",
						midnight: "поўн.",
						noon: "поўд.",
						morning: "ран.",
						afternoon: "дзень",
						evening: "веч.",
						night: "ноч"
					},
					abbreviated: {
						am: "ДП",
						pm: "ПП",
						midnight: "поўн.",
						noon: "поўд.",
						morning: "ран.",
						afternoon: "дзень",
						evening: "веч.",
						night: "ноч"
					},
					wide: {
						am: "ДП",
						pm: "ПП",
						midnight: "поўнач",
						noon: "поўдзень",
						morning: "раніца",
						afternoon: "дзень",
						evening: "вечар",
						night: "ноч"
					}
				},
				defaultWidth: "any",
				formattingValues: {
					narrow: {
						am: "ДП",
						pm: "ПП",
						midnight: "поўн.",
						noon: "поўд.",
						morning: "ран.",
						afternoon: "дня",
						evening: "веч.",
						night: "ночы"
					},
					abbreviated: {
						am: "ДП",
						pm: "ПП",
						midnight: "поўн.",
						noon: "поўд.",
						morning: "ран.",
						afternoon: "дня",
						evening: "веч.",
						night: "ночы"
					},
					wide: {
						am: "ДП",
						pm: "ПП",
						midnight: "поўнач",
						noon: "поўдзень",
						morning: "раніцы",
						afternoon: "дня",
						evening: "вечара",
						night: "ночы"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(-?(е|я|га|і|ы|ае|ая|яя|шы|гі|ці|ты|мы))?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^((да )?н\.?\s?э\.?)/i,
					abbreviated: /^((да )?н\.?\s?э\.?)/i,
					wide: /^(да нашай эры|нашай эры|наша эра)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^д/i, /^н/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234](-?[ыі]?)? кв.?/i,
					wide: /^[1234](-?[ыі]?)? квартал/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[слкмчжв]/i,
					abbreviated: /^(студз|лют|сак|крас|ма[йя]|чэрв|ліп|жн|вер|кастр|ліст|снеж)\.?/i,
					wide: /^(студзен[ья]|лют(ы|ага)|сакавіка?|красавіка?|ма[йя]|чэрвен[ья]|ліпен[ья]|жні(вень|ўня)|верас(ень|ня)|кастрычніка?|лістапада?|снеж(ань|ня))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^с/i, /^л/i, /^с/i, /^к/i, /^м/i, /^ч/i, /^л/i, /^ж/i, /^в/i, /^к/i, /^л/i, /^с/i],
					any: [/^ст/i, /^лю/i, /^са/i, /^кр/i, /^ма/i, /^ч/i, /^ліп/i, /^ж/i, /^в/i, /^ка/i, /^ліс/i, /^сн/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[нпасч]/i,
					short: /^(нд|ня|пн|па|аў|ат|ср|се|чц|ча|пт|пя|сб|су)\.?/i,
					abbreviated: /^(нядз?|ндз|пнд|пан|аўт|срд|сер|чцв|чац|птн|пят|суб).?/i,
					wide: /^(нядзел[яі]|панядзел(ак|ка)|аўтор(ак|ка)|серад[аы]|чацв(ер|ярга)|пятніц[аы]|субот[аы])/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^н/i, /^п/i, /^а/i, /^с/i, /^ч/i, /^п/i, /^с/i],
					any: [/^н/i, /^п[ан]/i, /^а/i, /^с[ер]/i, /^ч/i, /^п[ят]/i, /^с[уб]/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^([дп]п|поўн\.?|поўд\.?|ран\.?|дзень|дня|веч\.?|ночы?)/i,
					abbreviated: /^([дп]п|поўн\.?|поўд\.?|ран\.?|дзень|дня|веч\.?|ночы?)/i,
					wide: /^([дп]п|поўнач|поўдзень|раніц[аы]|дзень|дня|вечара?|ночы?)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: {
						am: /^дп/i,
						pm: /^пп/i,
						midnight: /^поўн/i,
						noon: /^поўд/i,
						morning: /^р/i,
						afternoon: /^д[зн]/i,
						evening: /^в/i,
						night: /^н/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "по-малко от секунда",
				other: "по-малко от {{count}} секунди"
			},
			xSeconds: {
				one: "1 секунда",
				other: "{{count}} секунди"
			},
			halfAMinute: "половин минута",
			lessThanXMinutes: {
				one: "по-малко от минута",
				other: "по-малко от {{count}} минути"
			},
			xMinutes: {
				one: "1 минута",
				other: "{{count}} минути"
			},
			aboutXHours: {
				one: "около час",
				other: "около {{count}} часа"
			},
			xHours: {
				one: "1 час",
				other: "{{count}} часа"
			},
			xDays: {
				one: "1 ден",
				other: "{{count}} дни"
			},
			aboutXWeeks: {
				one: "около седмица",
				other: "около {{count}} седмици"
			},
			xWeeks: {
				one: "1 седмица",
				other: "{{count}} седмици"
			},
			aboutXMonths: {
				one: "около месец",
				other: "около {{count}} месеца"
			},
			xMonths: {
				one: "1 месец",
				other: "{{count}} месеца"
			},
			aboutXYears: {
				one: "около година",
				other: "около {{count}} години"
			},
			xYears: {
				one: "1 година",
				other: "{{count}} години"
			},
			overXYears: {
				one: "над година",
				other: "над {{count}} години"
			},
			almostXYears: {
				one: "почти година",
				other: "почти {{count}} години"
			}
		}),
		fe = {
			date: X({
				formats: {
					full: "EEEE, dd MMMM yyyy",
					long: "dd MMMM yyyy",
					medium: "dd MMM yyyy",
					short: "dd.MM.yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					any: "{{date}} {{time}}"
				},
				defaultWidth: "any"
			})
		},
		pe = ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"];

		function ve(e) {
			const t = pe[e];
			return 2 === e ? "'във " + t + " в' p" : "'в " + t + " в' p"
		}
		const be = {
			lastWeek: (e, t, n) => {
				const a = de(e),
				i = a.getDay();
				return me(a, t, n) ? ve(i) : function (e) {
					const t = pe[e];
					switch (e) {
					case 0:
					case 3:
					case 6:
						return "'миналата " + t + " в' p";
					case 1:
					case 2:
					case 4:
					case 5:
						return "'миналия " + t + " в' p"
					}
				}
				(i)
			},
			yesterday: "'вчера в' p",
			today: "'днес в' p",
			tomorrow: "'утре в' p",
			nextWeek: (e, t, n) => {
				const a = de(e),
				i = a.getDay();
				return me(a, t, n) ? ve(i) : function (e) {
					const t = pe[e];
					switch (e) {
					case 0:
					case 3:
					case 6:
						return "'следващата " + t + " в' p";
					case 1:
					case 2:
					case 4:
					case 5:
						return "'следващия " + t + " в' p"
					}
				}
				(i)
			},
			other: "P"
		};

		function we(e, t, n, a, i) {
			const r = function (e) {
				return "quarter" === e
			}
			(t) ? i : function (e) {
				return "year" === e || "week" === e || "minute" === e || "second" === e
			}
			(t) ? a : n;
			return e + "-" + r
		}
		_({
			values: {
				narrow: ["пр.н.е.", "н.е."],
				abbreviated: ["преди н. е.", "н. е."],
				wide: ["преди новата ера", "новата ера"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["1-во тримес.", "2-ро тримес.", "3-то тримес.", "4-то тримес."],
				wide: ["1-во тримесечие", "2-ро тримесечие", "3-то тримесечие", "4-то тримесечие"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				abbreviated: ["яну", "фев", "мар", "апр", "май", "юни", "юли", "авг", "сеп", "окт", "ное", "дек"],
				wide: ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["Н", "П", "В", "С", "Ч", "П", "С"],
				short: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
				abbreviated: ["нед", "пон", "вто", "сря", "чет", "пет", "съб"],
				wide: ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				wide: {
					am: "преди обяд",
					pm: "след обяд",
					midnight: "в полунощ",
					noon: "на обяд",
					morning: "сутринта",
					afternoon: "следобед",
					evening: "вечерта",
					night: "през нощта"
				}
			},
			defaultWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(-?[врмт][аи]|-?т?(ен|на)|-?(ев|ева))?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^((пр)?н\.?\s?е\.?)/i,
				abbreviated: /^((пр)?н\.?\s?е\.?)/i,
				wide: /^(преди новата ера|новата ера|нова ера)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^п/i, /^н/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^[1234](-?[врт]?o?)? тримес.?/i,
				wide: /^[1234](-?[врт]?о?)? тримесечие/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				abbreviated: /^(яну|фев|мар|апр|май|юни|юли|авг|сеп|окт|ное|дек)/i,
				wide: /^(януари|февруари|март|април|май|юни|юли|август|септември|октомври|ноември|декември)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^я/i, /^ф/i, /^мар/i, /^ап/i, /^май/i, /^юн/i, /^юл/i, /^ав/i, /^се/i, /^окт/i, /^но/i, /^де/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[нпвсч]/i,
				short: /^(нд|пн|вт|ср|чт|пт|сб)/i,
				abbreviated: /^(нед|пон|вто|сря|чет|пет|съб)/i,
				wide: /^(неделя|понеделник|вторник|сряда|четвъртък|петък|събота)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^н/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
				any: [/^н[ед]/i, /^п[он]/i, /^вт/i, /^ср/i, /^ч[ет]/i, /^п[ет]/i, /^с[ъб]/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				any: /^(преди о|след о|в по|на о|през|веч|сут|следо)/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^преди о/i,
					pm: /^след о/i,
					midnight: /^в пол/i,
					noon: /^на об/i,
					morning: /^сут/i,
					afternoon: /^следо/i,
					evening: /^веч/i,
					night: /^през н/i
				}
			},
			defaultParseWidth: "any"
		});
		const ye = {
			locale: {
				1: "১",
				2: "২",
				3: "৩",
				4: "৪",
				5: "৫",
				6: "৬",
				7: "৭",
				8: "৮",
				9: "৯",
				0: "০"
			},
			number: {
				"১": "1",
				"২": "2",
				"৩": "3",
				"৪": "4",
				"৫": "5",
				"৬": "6",
				"৭": "7",
				"৮": "8",
				"৯": "9",
				"০": "0"
			}
		};

		function Me(e) {
			return e.toString().replace(/\d/g, (function (e) {
					return ye.locale[e]
				}))
		}
		_({
			values: {
				narrow: ["খ্রিঃপূঃ", "খ্রিঃ"],
				abbreviated: ["খ্রিঃপূর্ব", "খ্রিঃ"],
				wide: ["খ্রিস্টপূর্ব", "খ্রিস্টাব্দ"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["১", "২", "৩", "৪"],
				abbreviated: ["১ত্রৈ", "২ত্রৈ", "৩ত্রৈ", "৪ত্রৈ"],
				wide: ["১ম ত্রৈমাসিক", "২য় ত্রৈমাসিক", "৩য় ত্রৈমাসিক", "৪র্থ ত্রৈমাসিক"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে"],
				abbreviated: ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে"],
				wide: ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["র", "সো", "ম", "বু", "বৃ", "শু", "শ"],
				short: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"],
				abbreviated: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"],
				wide: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার ", "শুক্রবার", "শনিবার"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "পূ",
					pm: "অপ",
					midnight: "মধ্যরাত",
					noon: "মধ্যাহ্ন",
					morning: "সকাল",
					afternoon: "বিকাল",
					evening: "সন্ধ্যা",
					night: "রাত"
				},
				abbreviated: {
					am: "পূর্বাহ্ন",
					pm: "অপরাহ্ন",
					midnight: "মধ্যরাত",
					noon: "মধ্যাহ্ন",
					morning: "সকাল",
					afternoon: "বিকাল",
					evening: "সন্ধ্যা",
					night: "রাত"
				},
				wide: {
					am: "পূর্বাহ্ন",
					pm: "অপরাহ্ন",
					midnight: "মধ্যরাত",
					noon: "মধ্যাহ্ন",
					morning: "সকাল",
					afternoon: "বিকাল",
					evening: "সন্ধ্যা",
					night: "রাত"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "পূ",
					pm: "অপ",
					midnight: "মধ্যরাত",
					noon: "মধ্যাহ্ন",
					morning: "সকাল",
					afternoon: "বিকাল",
					evening: "সন্ধ্যা",
					night: "রাত"
				},
				abbreviated: {
					am: "পূর্বাহ্ন",
					pm: "অপরাহ্ন",
					midnight: "মধ্যরাত",
					noon: "মধ্যাহ্ন",
					morning: "সকাল",
					afternoon: "বিকাল",
					evening: "সন্ধ্যা",
					night: "রাত"
				},
				wide: {
					am: "পূর্বাহ্ন",
					pm: "অপরাহ্ন",
					midnight: "মধ্যরাত",
					noon: "মধ্যাহ্ন",
					morning: "সকাল",
					afternoon: "বিকাল",
					evening: "সন্ধ্যা",
					night: "রাত"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		X({
			formats: {
				full: "EEEE, MMMM do, y",
				long: "MMMM do, y",
				medium: "MMM d, y",
				short: "MM/dd/yyyy"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "h:mm:ss a zzzz",
				long: "h:mm:ss a z",
				medium: "h:mm:ss a",
				short: "h:mm a"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "{{date}} {{time}} 'সময়'",
				long: "{{date}} {{time}} 'সময়'",
				medium: "{{date}}, {{time}}",
				short: "{{date}}, {{time}}"
			},
			defaultWidth: "full"
		}),
		F({
			matchPattern: /^(\d+)(ম|য়|র্থ|ষ্ঠ|শে|ই|তম)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(খ্রিঃপূঃ|খ্রিঃ)/i,
				abbreviated: /^(খ্রিঃপূর্ব|খ্রিঃ)/i,
				wide: /^(খ্রিস্টপূর্ব|খ্রিস্টাব্দ)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^খ্রিঃপূঃ/i, /^খ্রিঃ/i],
				abbreviated: [/^খ্রিঃপূর্ব/i, /^খ্রিঃ/i],
				wide: [/^খ্রিস্টপূর্ব/i, /^খ্রিস্টাব্দ/i]
			},
			defaultParseWidth: "wide"
		}),
		G({
			matchPatterns: {
				narrow: /^[১২৩৪]/i,
				abbreviated: /^[১২৩৪]ত্রৈ/i,
				wide: /^[১২৩৪](ম|য়|র্থ)? ত্রৈমাসিক/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/১/i, /২/i, /৩/i, /৪/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^(জানু|ফেব্রু|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্ট|অক্টো|নভে|ডিসে)/i,
				abbreviated: /^(জানু|ফেব্রু|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্ট|অক্টো|নভে|ডিসে)/i,
				wide: /^(জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^জানু/i, /^ফেব্রু/i, /^মার্চ/i, /^এপ্রিল/i, /^মে/i, /^জুন/i, /^জুলাই/i, /^আগস্ট/i, /^সেপ্ট/i, /^অক্টো/i, /^নভে/i, /^ডিসে/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(র|সো|ম|বু|বৃ|শু|শ)+/i,
				short: /^(রবি|সোম|মঙ্গল|বুধ|বৃহ|শুক্র|শনি)+/i,
				abbreviated: /^(রবি|সোম|মঙ্গল|বুধ|বৃহ|শুক্র|শনি)+/i,
				wide: /^(রবিবার|সোমবার|মঙ্গলবার|বুধবার|বৃহস্পতিবার |শুক্রবার|শনিবার)+/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^র/i, /^সো/i, /^ম/i, /^বু/i, /^বৃ/i, /^শু/i, /^শ/i],
				short: [/^রবি/i, /^সোম/i, /^মঙ্গল/i, /^বুধ/i, /^বৃহ/i, /^শুক্র/i, /^শনি/i],
				abbreviated: [/^রবি/i, /^সোম/i, /^মঙ্গল/i, /^বুধ/i, /^বৃহ/i, /^শুক্র/i, /^শনি/i],
				wide: [/^রবিবার/i, /^সোমবার/i, /^মঙ্গলবার/i, /^বুধবার/i, /^বৃহস্পতিবার /i, /^শুক্রবার/i, /^শনিবার/i]
			},
			defaultParseWidth: "wide"
		}),
		G({
			matchPatterns: {
				narrow: /^(পূ|অপ|মধ্যরাত|মধ্যাহ্ন|সকাল|বিকাল|সন্ধ্যা|রাত)/i,
				abbreviated: /^(পূর্বাহ্ন|অপরাহ্ন|মধ্যরাত|মধ্যাহ্ন|সকাল|বিকাল|সন্ধ্যা|রাত)/i,
				wide: /^(পূর্বাহ্ন|অপরাহ্ন|মধ্যরাত|মধ্যাহ্ন|সকাল|বিকাল|সন্ধ্যা|রাত)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: {
					am: /^পূ/i,
					pm: /^অপ/i,
					midnight: /^মধ্যরাত/i,
					noon: /^মধ্যাহ্ন/i,
					morning: /সকাল/i,
					afternoon: /বিকাল/i,
					evening: /সন্ধ্যা/i,
					night: /রাত/i
				}
			},
			defaultParseWidth: "any"
		}),
		X({
			formats: {
				full: "EEEE, d 'de' MMMM y",
				long: "d 'de' MMMM y",
				medium: "d MMM y",
				short: "dd/MM/y"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "HH:mm:ss zzzz",
				long: "HH:mm:ss z",
				medium: "HH:mm:ss",
				short: "HH:mm"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "{{date}} 'a les' {{time}}",
				long: "{{date}} 'a les' {{time}}",
				medium: "{{date}}, {{time}}",
				short: "{{date}}, {{time}}"
			},
			defaultWidth: "full"
		}),
		_({
			values: {
				narrow: ["aC", "dC"],
				abbreviated: ["a. de C.", "d. de C."],
				wide: ["abans de Crist", "després de Crist"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["T1", "T2", "T3", "T4"],
				wide: ["1r trimestre", "2n trimestre", "3r trimestre", "4t trimestre"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["GN", "FB", "MÇ", "AB", "MG", "JN", "JL", "AG", "ST", "OC", "NV", "DS"],
				abbreviated: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."],
				wide: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["dg.", "dl.", "dt.", "dm.", "dj.", "dv.", "ds."],
				short: ["dg.", "dl.", "dt.", "dm.", "dj.", "dv.", "ds."],
				abbreviated: ["dg.", "dl.", "dt.", "dm.", "dj.", "dv.", "ds."],
				wide: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "am",
					pm: "pm",
					midnight: "mitjanit",
					noon: "migdia",
					morning: "matí",
					afternoon: "tarda",
					evening: "vespre",
					night: "nit"
				},
				abbreviated: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "mitjanit",
					noon: "migdia",
					morning: "matí",
					afternoon: "tarda",
					evening: "vespre",
					night: "nit"
				},
				wide: {
					am: "ante meridiem",
					pm: "post meridiem",
					midnight: "mitjanit",
					noon: "migdia",
					morning: "matí",
					afternoon: "tarda",
					evening: "vespre",
					night: "nit"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "am",
					pm: "pm",
					midnight: "de la mitjanit",
					noon: "del migdia",
					morning: "del matí",
					afternoon: "de la tarda",
					evening: "del vespre",
					night: "de la nit"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "de la mitjanit",
					noon: "del migdia",
					morning: "del matí",
					afternoon: "de la tarda",
					evening: "del vespre",
					night: "de la nit"
				},
				wide: {
					am: "ante meridiem",
					pm: "post meridiem",
					midnight: "de la mitjanit",
					noon: "del migdia",
					morning: "del matí",
					afternoon: "de la tarda",
					evening: "del vespre",
					night: "de la nit"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(è|r|n|r|t)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(aC|dC)/i,
				abbreviated: /^(a. de C.|d. de C.)/i,
				wide: /^(abans de Crist|despr[eé]s de Crist)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^aC/i, /^dC/i],
				abbreviated: [/^(a. de C.)/i, /^(d. de C.)/i],
				wide: [/^(abans de Crist)/i, /^(despr[eé]s de Crist)/i]
			},
			defaultParseWidth: "wide"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^T[1234]/i,
				wide: /^[1234](è|r|n|r|t)? trimestre/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^(GN|FB|MÇ|AB|MG|JN|JL|AG|ST|OC|NV|DS)/i,
				abbreviated: /^(gen.|febr.|març|abr.|maig|juny|jul.|ag.|set.|oct.|nov.|des.)/i,
				wide: /^(gener|febrer|març|abril|maig|juny|juliol|agost|setembre|octubre|novembre|desembre)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^GN/i, /^FB/i, /^MÇ/i, /^AB/i, /^MG/i, /^JN/i, /^JL/i, /^AG/i, /^ST/i, /^OC/i, /^NV/i, /^DS/i],
				abbreviated: [/^gen./i, /^febr./i, /^març/i, /^abr./i, /^maig/i, /^juny/i, /^jul./i, /^ag./i, /^set./i, /^oct./i, /^nov./i, /^des./i],
				wide: [/^gener/i, /^febrer/i, /^març/i, /^abril/i, /^maig/i, /^juny/i, /^juliol/i, /^agost/i, /^setembre/i, /^octubre/i, /^novembre/i, /^desembre/i]
			},
			defaultParseWidth: "wide"
		}),
		G({
			matchPatterns: {
				narrow: /^(dg\.|dl\.|dt\.|dm\.|dj\.|dv\.|ds\.)/i,
				short: /^(dg\.|dl\.|dt\.|dm\.|dj\.|dv\.|ds\.)/i,
				abbreviated: /^(dg\.|dl\.|dt\.|dm\.|dj\.|dv\.|ds\.)/i,
				wide: /^(diumenge|dilluns|dimarts|dimecres|dijous|divendres|dissabte)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^dg./i, /^dl./i, /^dt./i, /^dm./i, /^dj./i, /^dv./i, /^ds./i],
				abbreviated: [/^dg./i, /^dl./i, /^dt./i, /^dm./i, /^dj./i, /^dv./i, /^ds./i],
				wide: [/^diumenge/i, /^dilluns/i, /^dimarts/i, /^dimecres/i, /^dijous/i, /^divendres/i, /^disssabte/i]
			},
			defaultParseWidth: "wide"
		}),
		G({
			matchPatterns: {
				narrow: /^(a|p|mn|md|(del|de la) (matí|tarda|vespre|nit))/i,
				abbreviated: /^([ap]\.?\s?m\.?|mitjanit|migdia|(del|de la) (matí|tarda|vespre|nit))/i,
				wide: /^(ante meridiem|post meridiem|mitjanit|migdia|(del|de la) (matí|tarda|vespre|nit))/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: {
					am: /^a/i,
					pm: /^p/i,
					midnight: /^mitjanit/i,
					noon: /^migdia/i,
					morning: /matí/i,
					afternoon: /tarda/i,
					evening: /vespre/i,
					night: /nit/i
				}
			},
			defaultParseWidth: "any"
		}),
		X({
			formats: {
				full: "EEEE, d. MMMM yyyy",
				long: "d. MMMM yyyy",
				medium: "d. M. yyyy",
				short: "dd.MM.yyyy"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "H:mm:ss zzzz",
				long: "H:mm:ss z",
				medium: "H:mm:ss",
				short: "H:mm"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "{{date}} 'v' {{time}}",
				long: "{{date}} 'v' {{time}}",
				medium: "{{date}}, {{time}}",
				short: "{{date}}, {{time}}"
			},
			defaultWidth: "full"
		}),
		_({
			values: {
				narrow: ["př. n. l.", "n. l."],
				abbreviated: ["př. n. l.", "n. l."],
				wide: ["před naším letopočtem", "našeho letopočtu"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["1. čtvrtletí", "2. čtvrtletí", "3. čtvrtletí", "4. čtvrtletí"],
				wide: ["1. čtvrtletí", "2. čtvrtletí", "3. čtvrtletí", "4. čtvrtletí"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["L", "Ú", "B", "D", "K", "Č", "Č", "S", "Z", "Ř", "L", "P"],
				abbreviated: ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"],
				wide: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"]
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: ["L", "Ú", "B", "D", "K", "Č", "Č", "S", "Z", "Ř", "L", "P"],
				abbreviated: ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"],
				wide: ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"]
			},
			defaultFormattingWidth: "wide"
		}),
		_({
			values: {
				narrow: ["ne", "po", "út", "st", "čt", "pá", "so"],
				short: ["ne", "po", "út", "st", "čt", "pá", "so"],
				abbreviated: ["ned", "pon", "úte", "stř", "čtv", "pát", "sob"],
				wide: ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "dop.",
					pm: "odp.",
					midnight: "půlnoc",
					noon: "poledne",
					morning: "ráno",
					afternoon: "odpoledne",
					evening: "večer",
					night: "noc"
				},
				abbreviated: {
					am: "dop.",
					pm: "odp.",
					midnight: "půlnoc",
					noon: "poledne",
					morning: "ráno",
					afternoon: "odpoledne",
					evening: "večer",
					night: "noc"
				},
				wide: {
					am: "dopoledne",
					pm: "odpoledne",
					midnight: "půlnoc",
					noon: "poledne",
					morning: "ráno",
					afternoon: "odpoledne",
					evening: "večer",
					night: "noc"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "dop.",
					pm: "odp.",
					midnight: "půlnoc",
					noon: "poledne",
					morning: "ráno",
					afternoon: "odpoledne",
					evening: "večer",
					night: "noc"
				},
				abbreviated: {
					am: "dop.",
					pm: "odp.",
					midnight: "půlnoc",
					noon: "poledne",
					morning: "ráno",
					afternoon: "odpoledne",
					evening: "večer",
					night: "noc"
				},
				wide: {
					am: "dopoledne",
					pm: "odpoledne",
					midnight: "půlnoc",
					noon: "poledne",
					morning: "ráno",
					afternoon: "odpoledne",
					evening: "večer",
					night: "noc"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)\.?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(p[řr](\.|ed) Kr\.|p[řr](\.|ed) n\. l\.|po Kr\.|n\. l\.)/i,
				abbreviated: /^(p[řr](\.|ed) Kr\.|p[řr](\.|ed) n\. l\.|po Kr\.|n\. l\.)/i,
				wide: /^(p[řr](\.|ed) Kristem|p[řr](\.|ed) na[šs][íi]m letopo[čc]tem|po Kristu|na[šs]eho letopo[čc]tu)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^p[řr]/i, /^(po|n)/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^[1234]\. [čc]tvrtlet[íi]/i,
				wide: /^[1234]\. [čc]tvrtlet[íi]/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[lúubdkčcszřrlp]/i,
				abbreviated: /^(led|[úu]no|b[řr]e|dub|kv[ěe]|[čc]vn|[čc]vc|srp|z[áa][řr]|[řr][íi]j|lis|pro)/i,
				wide: /^(leden|ledna|[úu]nora?|b[řr]ezen|b[řr]ezna|duben|dubna|kv[ěe]ten|kv[ěe]tna|[čc]erven(ec|ce)?|[čc]ervna|srpen|srpna|z[áa][řr][íi]|[řr][íi]jen|[řr][íi]jna|listopad(a|u)?|prosinec|prosince)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^l/i, /^[úu]/i, /^b/i, /^d/i, /^k/i, /^[čc]/i, /^[čc]/i, /^s/i, /^z/i, /^[řr]/i, /^l/i, /^p/i],
				any: [/^led/i, /^[úu]n/i, /^b[řr]e/i, /^dub/i, /^kv[ěe]/i, /^[čc]vn|[čc]erven(?!\w)|[čc]ervna/i, /^[čc]vc|[čc]erven(ec|ce)/i, /^srp/i, /^z[áa][řr]/i, /^[řr][íi]j/i, /^lis/i, /^pro/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[npuúsčps]/i,
				short: /^(ne|po|[úu]t|st|[čc]t|p[áa]|so)/i,
				abbreviated: /^(ned|pon|[úu]te|st[rř]|[čc]tv|p[áa]t|sob)/i,
				wide: /^(ned[ěe]le|pond[ěe]l[íi]|[úu]ter[ýy]|st[řr]eda|[čc]tvrtek|p[áa]tek|sobota)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^n/i, /^p/i, /^[úu]/i, /^s/i, /^[čc]/i, /^p/i, /^s/i],
				any: [/^ne/i, /^po/i, /^[úu]t/i, /^st/i, /^[čc]t/i, /^p[áa]/i, /^so/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				any: /^dopoledne|dop\.?|odpoledne|odp\.?|p[ůu]lnoc|poledne|r[áa]no|odpoledne|ve[čc]er|(v )?noci?/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^dop/i,
					pm: /^odp/i,
					midnight: /^p[ůu]lnoc/i,
					noon: /^poledne/i,
					morning: /r[áa]no/i,
					afternoon: /odpoledne/i,
					evening: /ve[čc]er/i,
					night: /noc/i
				}
			},
			defaultParseWidth: "any"
		}),
		X({
			formats: {
				full: "EEEE, d MMMM yyyy",
				long: "d MMMM yyyy",
				medium: "d MMM yyyy",
				short: "dd/MM/yyyy"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "h:mm:ss a zzzz",
				long: "h:mm:ss a z",
				medium: "h:mm:ss a",
				short: "h:mm a"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "{{date}} 'am' {{time}}",
				long: "{{date}} 'am' {{time}}",
				medium: "{{date}}, {{time}}",
				short: "{{date}}, {{time}}"
			},
			defaultWidth: "full"
		}),
		_({
			values: {
				narrow: ["C", "O"],
				abbreviated: ["CC", "OC"],
				wide: ["Cyn Crist", "Ar ôl Crist"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["Ch1", "Ch2", "Ch3", "Ch4"],
				wide: ["Chwarter 1af", "2ail chwarter", "3ydd chwarter", "4ydd chwarter"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["I", "Ch", "Ma", "E", "Mi", "Me", "G", "A", "Md", "H", "T", "Rh"],
				abbreviated: ["Ion", "Chwe", "Maw", "Ebr", "Mai", "Meh", "Gor", "Aws", "Med", "Hyd", "Tach", "Rhag"],
				wide: ["Ionawr", "Chwefror", "Mawrth", "Ebrill", "Mai", "Mehefin", "Gorffennaf", "Awst", "Medi", "Hydref", "Tachwedd", "Rhagfyr"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["S", "Ll", "M", "M", "I", "G", "S"],
				short: ["Su", "Ll", "Ma", "Me", "Ia", "Gw", "Sa"],
				abbreviated: ["Sul", "Llun", "Maw", "Mer", "Iau", "Gwe", "Sad"],
				wide: ["dydd Sul", "dydd Llun", "dydd Mawrth", "dydd Mercher", "dydd Iau", "dydd Gwener", "dydd Sadwrn"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "b",
					pm: "h",
					midnight: "hn",
					noon: "hd",
					morning: "bore",
					afternoon: "prynhawn",
					evening: "gyda'r nos",
					night: "nos"
				},
				abbreviated: {
					am: "yb",
					pm: "yh",
					midnight: "hanner nos",
					noon: "hanner dydd",
					morning: "bore",
					afternoon: "prynhawn",
					evening: "gyda'r nos",
					night: "nos"
				},
				wide: {
					am: "y.b.",
					pm: "y.h.",
					midnight: "hanner nos",
					noon: "hanner dydd",
					morning: "bore",
					afternoon: "prynhawn",
					evening: "gyda'r nos",
					night: "nos"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "b",
					pm: "h",
					midnight: "hn",
					noon: "hd",
					morning: "yn y bore",
					afternoon: "yn y prynhawn",
					evening: "gyda'r nos",
					night: "yn y nos"
				},
				abbreviated: {
					am: "yb",
					pm: "yh",
					midnight: "hanner nos",
					noon: "hanner dydd",
					morning: "yn y bore",
					afternoon: "yn y prynhawn",
					evening: "gyda'r nos",
					night: "yn y nos"
				},
				wide: {
					am: "y.b.",
					pm: "y.h.",
					midnight: "hanner nos",
					noon: "hanner dydd",
					morning: "yn y bore",
					afternoon: "yn y prynhawn",
					evening: "gyda'r nos",
					night: "yn y nos"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(af|ail|ydd|ed|fed|eg|ain)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(c|o)/i,
				abbreviated: /^(c\.?\s?c\.?|o\.?\s?c\.?)/i,
				wide: /^(cyn christ|ar ôl crist|ar ol crist)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				wide: [/^c/i, /^(ar ôl crist|ar ol crist)/i],
				any: [/^c/i, /^o/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^ch[1234]/i,
				wide: /^(chwarter 1af)|([234](ail|ydd)? chwarter)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^(i|ch|m|e|g|a|h|t|rh)/i,
				abbreviated: /^(ion|chwe|maw|ebr|mai|meh|gor|aws|med|hyd|tach|rhag)/i,
				wide: /^(ionawr|chwefror|mawrth|ebrill|mai|mehefin|gorffennaf|awst|medi|hydref|tachwedd|rhagfyr)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^i/i, /^ch/i, /^m/i, /^e/i, /^m/i, /^m/i, /^g/i, /^a/i, /^m/i, /^h/i, /^t/i, /^rh/i],
				any: [/^io/i, /^ch/i, /^maw/i, /^e/i, /^mai/i, /^meh/i, /^g/i, /^a/i, /^med/i, /^h/i, /^t/i, /^rh/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(s|ll|m|i|g)/i,
				short: /^(su|ll|ma|me|ia|gw|sa)/i,
				abbreviated: /^(sul|llun|maw|mer|iau|gwe|sad)/i,
				wide: /^dydd (sul|llun|mawrth|mercher|iau|gwener|sadwrn)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^s/i, /^ll/i, /^m/i, /^m/i, /^i/i, /^g/i, /^s/i],
				wide: [/^dydd su/i, /^dydd ll/i, /^dydd ma/i, /^dydd me/i, /^dydd i/i, /^dydd g/i, /^dydd sa/i],
				any: [/^su/i, /^ll/i, /^ma/i, /^me/i, /^i/i, /^g/i, /^sa/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(b|h|hn|hd|(yn y|y|yr|gyda'r) (bore|prynhawn|nos|hwyr))/i,
				any: /^(y\.?\s?[bh]\.?|hanner nos|hanner dydd|(yn y|y|yr|gyda'r) (bore|prynhawn|nos|hwyr))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^b|(y\.?\s?b\.?)/i,
					pm: /^h|(y\.?\s?h\.?)|(yr hwyr)/i,
					midnight: /^hn|hanner nos/i,
					noon: /^hd|hanner dydd/i,
					morning: /bore/i,
					afternoon: /prynhawn/i,
					evening: /^gyda'r nos$/i,
					night: /blah/i
				}
			},
			defaultParseWidth: "any"
		}),
		X({
			formats: {
				full: "EEEE 'den' d. MMMM y",
				long: "d. MMMM y",
				medium: "d. MMM y",
				short: "dd/MM/y"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "HH:mm:ss zzzz",
				long: "HH:mm:ss z",
				medium: "HH:mm:ss",
				short: "HH:mm"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "{{date}} 'kl'. {{time}}",
				long: "{{date}} 'kl'. {{time}}",
				medium: "{{date}} {{time}}",
				short: "{{date}} {{time}}"
			},
			defaultWidth: "full"
		}),
		_({
			values: {
				narrow: ["fvt", "vt"],
				abbreviated: ["f.v.t.", "v.t."],
				wide: ["før vesterlandsk tidsregning", "vesterlandsk tidsregning"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["1. kvt.", "2. kvt.", "3. kvt.", "4. kvt."],
				wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
				abbreviated: ["jan.", "feb.", "mar.", "apr.", "maj", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."],
				wide: ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["S", "M", "T", "O", "T", "F", "L"],
				short: ["sø", "ma", "ti", "on", "to", "fr", "lø"],
				abbreviated: ["søn.", "man.", "tir.", "ons.", "tor.", "fre.", "lør."],
				wide: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "a",
					pm: "p",
					midnight: "midnat",
					noon: "middag",
					morning: "morgen",
					afternoon: "eftermiddag",
					evening: "aften",
					night: "nat"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "midnat",
					noon: "middag",
					morning: "morgen",
					afternoon: "eftermiddag",
					evening: "aften",
					night: "nat"
				},
				wide: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "midnat",
					noon: "middag",
					morning: "morgen",
					afternoon: "eftermiddag",
					evening: "aften",
					night: "nat"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "a",
					pm: "p",
					midnight: "midnat",
					noon: "middag",
					morning: "om morgenen",
					afternoon: "om eftermiddagen",
					evening: "om aftenen",
					night: "om natten"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "midnat",
					noon: "middag",
					morning: "om morgenen",
					afternoon: "om eftermiddagen",
					evening: "om aftenen",
					night: "om natten"
				},
				wide: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "midnat",
					noon: "middag",
					morning: "om morgenen",
					afternoon: "om eftermiddagen",
					evening: "om aftenen",
					night: "om natten"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(\.)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(fKr|fvt|eKr|vt)/i,
				abbreviated: /^(f\.Kr\.?|f\.v\.t\.?|e\.Kr\.?|v\.t\.)/i,
				wide: /^(f.Kr.|før vesterlandsk tidsregning|e.Kr.|vesterlandsk tidsregning)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^f/i, /^(v|e)/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^[1234]. kvt\./i,
				wide: /^[1234]\.? kvartal/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan.|feb.|mar.|apr.|maj|jun.|jul.|aug.|sep.|okt.|nov.|dec.)/i,
				wide: /^(januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
				any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^maj/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[smtofl]/i,
				short: /^(søn.|man.|tir.|ons.|tor.|fre.|lør.)/i,
				abbreviated: /^(søn|man|tir|ons|tor|fre|lør)/i,
				wide: /^(søndag|mandag|tirsdag|onsdag|torsdag|fredag|lørdag)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^s/i, /^m/i, /^t/i, /^o/i, /^t/i, /^f/i, /^l/i],
				any: [/^s/i, /^m/i, /^ti/i, /^o/i, /^to/i, /^f/i, /^l/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(a|p|midnat|middag|(om) (morgenen|eftermiddagen|aftenen|natten))/i,
				any: /^([ap]\.?\s?m\.?|midnat|middag|(om) (morgenen|eftermiddagen|aftenen|natten))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^a/i,
					pm: /^p/i,
					midnight: /midnat/i,
					noon: /middag/i,
					morning: /morgen/i,
					afternoon: /eftermiddag/i,
					evening: /aften/i,
					night: /nat/i
				}
			},
			defaultParseWidth: "any"
		}),
		X({
			formats: {
				full: "EEEE, do MMMM y",
				long: "do MMMM y",
				medium: "do MMM y",
				short: "dd.MM.y"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "HH:mm:ss zzzz",
				long: "HH:mm:ss z",
				medium: "HH:mm:ss",
				short: "HH:mm"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "{{date}} 'um' {{time}}",
				long: "{{date}} 'um' {{time}}",
				medium: "{{date}} {{time}}",
				short: "{{date}} {{time}}"
			},
			defaultWidth: "full"
		});
		const ke = {
			narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
			abbreviated: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
			wide: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
		},
		Pe = {
			narrow: ke.narrow,
			abbreviated: ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."],
			wide: ke.wide
		},
		We = (_({
				values: {
					narrow: ["v.Chr.", "n.Chr."],
					abbreviated: ["v.Chr.", "n.Chr."],
					wide: ["vor Christus", "nach Christus"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: ke,
				formattingValues: Pe,
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["S", "M", "D", "M", "D", "F", "S"],
					short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
					abbreviated: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
					wide: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "vm.",
						pm: "nm.",
						midnight: "Mitternacht",
						noon: "Mittag",
						morning: "Morgen",
						afternoon: "Nachm.",
						evening: "Abend",
						night: "Nacht"
					},
					abbreviated: {
						am: "vorm.",
						pm: "nachm.",
						midnight: "Mitternacht",
						noon: "Mittag",
						morning: "Morgen",
						afternoon: "Nachmittag",
						evening: "Abend",
						night: "Nacht"
					},
					wide: {
						am: "vormittags",
						pm: "nachmittags",
						midnight: "Mitternacht",
						noon: "Mittag",
						morning: "Morgen",
						afternoon: "Nachmittag",
						evening: "Abend",
						night: "Nacht"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "vm.",
						pm: "nm.",
						midnight: "Mitternacht",
						noon: "Mittag",
						morning: "morgens",
						afternoon: "nachm.",
						evening: "abends",
						night: "nachts"
					},
					abbreviated: {
						am: "vorm.",
						pm: "nachm.",
						midnight: "Mitternacht",
						noon: "Mittag",
						morning: "morgens",
						afternoon: "nachmittags",
						evening: "abends",
						night: "nachts"
					},
					wide: {
						am: "vormittags",
						pm: "nachmittags",
						midnight: "Mitternacht",
						noon: "Mittag",
						morning: "morgens",
						afternoon: "nachmittags",
						evening: "abends",
						night: "nachts"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(\.)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e)
			}), G({
				matchPatterns: {
					narrow: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
					abbreviated: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
					wide: /^(vor Christus|vor unserer Zeitrechnung|nach Christus|unserer Zeitrechnung)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^v/i, /^n/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234](\.)? Quartal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(j[aä]n|feb|mär[z]?|apr|mai|jun[i]?|jul[i]?|aug|sep|okt|nov|dez)\.?/i,
					wide: /^(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^j[aä]/i, /^f/i, /^mär/i, /^ap/i, /^mai/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[smdmf]/i,
					short: /^(so|mo|di|mi|do|fr|sa)/i,
					abbreviated: /^(son?|mon?|die?|mit?|don?|fre?|sam?)\.?/i,
					wide: /^(sonntag|montag|dienstag|mittwoch|donnerstag|freitag|samstag)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^so/i, /^mo/i, /^di/i, /^mi/i, /^do/i, /^f/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(vm\.?|nm\.?|Mitternacht|Mittag|morgens|nachm\.?|abends|nachts)/i,
					abbreviated: /^(vorm\.?|nachm\.?|Mitternacht|Mittag|morgens|nachm\.?|abends|nachts)/i,
					wide: /^(vormittags|nachmittags|Mitternacht|Mittag|morgens|nachmittags|abends|nachts)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: {
						am: /^v/i,
						pm: /^n/i,
						midnight: /^Mitte/i,
						noon: /^Mitta/i,
						morning: /morgens/i,
						afternoon: /nachmittags/i,
						evening: /abends/i,
						night: /nachts/i
					}
				},
				defaultParseWidth: "any"
			}), X({
				formats: {
					full: "EEEE, d MMMM y",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "d/M/yy"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} - {{time}}",
					long: "{{date}} - {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), _({
				values: {
					narrow: ["πΧ", "μΧ"],
					abbreviated: ["π.Χ.", "μ.Χ."],
					wide: ["προ Χριστού", "μετά Χριστόν"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Τ1", "Τ2", "Τ3", "Τ4"],
					wide: ["1ο τρίμηνο", "2ο τρίμηνο", "3ο τρίμηνο", "4ο τρίμηνο"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["Ι", "Φ", "Μ", "Α", "Μ", "Ι", "Ι", "Α", "Σ", "Ο", "Ν", "Δ"],
					abbreviated: ["Ιαν", "Φεβ", "Μάρ", "Απρ", "Μάι", "Ιούν", "Ιούλ", "Αύγ", "Σεπ", "Οκτ", "Νοέ", "Δεκ"],
					wide: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["Ι", "Φ", "Μ", "Α", "Μ", "Ι", "Ι", "Α", "Σ", "Ο", "Ν", "Δ"],
					abbreviated: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαΐ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"],
					wide: ["Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου", "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["Κ", "Δ", "T", "Τ", "Π", "Π", "Σ"],
					short: ["Κυ", "Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά"],
					abbreviated: ["Κυρ", "Δευ", "Τρί", "Τετ", "Πέμ", "Παρ", "Σάβ"],
					wide: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "πμ",
						pm: "μμ",
						midnight: "μεσάνυχτα",
						noon: "μεσημέρι",
						morning: "πρωί",
						afternoon: "απόγευμα",
						evening: "βράδυ",
						night: "νύχτα"
					},
					abbreviated: {
						am: "π.μ.",
						pm: "μ.μ.",
						midnight: "μεσάνυχτα",
						noon: "μεσημέρι",
						morning: "πρωί",
						afternoon: "απόγευμα",
						evening: "βράδυ",
						night: "νύχτα"
					},
					wide: {
						am: "π.μ.",
						pm: "μ.μ.",
						midnight: "μεσάνυχτα",
						noon: "μεσημέρι",
						morning: "πρωί",
						afternoon: "απόγευμα",
						evening: "βράδυ",
						night: "νύχτα"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(ος|η|ο)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(πΧ|μΧ)/i,
					abbreviated: /^(π\.?\s?χ\.?|π\.?\s?κ\.?\s?χ\.?|μ\.?\s?χ\.?|κ\.?\s?χ\.?)/i,
					wide: /^(προ Χριστο(ύ|υ)|πριν απ(ό|ο) την Κοιν(ή|η) Χρονολογ(ί|ι)α|μετ(ά|α) Χριστ(ό|ο)ν|Κοιν(ή|η) Χρονολογ(ί|ι)α)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^π/i, /^(μ|κ)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^τ[1234]/i,
					wide: /^[1234]ο? τρ(ί|ι)μηνο/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[ιφμαμιιασονδ]/i,
					abbreviated: /^(ιαν|φεβ|μ[άα]ρ|απρ|μ[άα][ιΐ]|ιο[ύυ]ν|ιο[ύυ]λ|α[ύυ]γ|σεπ|οκτ|νο[έε]|δεκ)/i,
					wide: /^(μ[άα][ιΐ]|α[ύυ]γο[υύ]στ)(ος|ου)|(ιανου[άα]ρ|φεβρου[άα]ρ|μ[άα]ρτ|απρ[ίι]λ|ιο[ύυ]ν|ιο[ύυ]λ|σεπτ[έε]μβρ|οκτ[ώω]βρ|νο[έε]μβρ|δεκ[έε]μβρ)(ιος|ίου)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ι/i, /^φ/i, /^μ/i, /^α/i, /^μ/i, /^ι/i, /^ι/i, /^α/i, /^σ/i, /^ο/i, /^ν/i, /^δ/i],
					any: [/^ια/i, /^φ/i, /^μ[άα]ρ/i, /^απ/i, /^μ[άα][ιΐ]/i, /^ιο[ύυ]ν/i, /^ιο[ύυ]λ/i, /^α[ύυ]/i, /^σ/i, /^ο/i, /^ν/i, /^δ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[κδτπσ]/i,
					short: /^(κυ|δε|τρ|τε|π[εέ]|π[αά]|σ[αά])/i,
					abbreviated: /^(κυρ|δευ|τρι|τετ|πεμ|παρ|σαβ)/i,
					wide: /^(κυριακ(ή|η)|δευτ(έ|ε)ρα|τρ(ί|ι)τη|τετ(ά|α)ρτη|π(έ|ε)μπτη|παρασκευ(ή|η)|σ(ά|α)ββατο)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^κ/i, /^δ/i, /^τ/i, /^τ/i, /^π/i, /^π/i, /^σ/i],
					any: [/^κ/i, /^δ/i, /^τρ/i, /^τε/i, /^π[εέ]/i, /^π[αά]/i, /^σ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(πμ|μμ|μεσ(ά|α)νυχτα|μεσημ(έ|ε)ρι|πρω(ί|ι)|απ(ό|ο)γευμα|βρ(ά|α)δυ|ν(ύ|υ)χτα)/i,
					any: /^([πμ]\.?\s?μ\.?|μεσ(ά|α)νυχτα|μεσημ(έ|ε)ρι|πρω(ί|ι)|απ(ό|ο)γευμα|βρ(ά|α)δυ|ν(ύ|υ)χτα)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^πμ|π\.\s?μ\./i,
						pm: /^μμ|μ\.\s?μ\./i,
						midnight: /^μεσάν/i,
						noon: /^μεσημ(έ|ε)/i,
						morning: /πρω(ί|ι)/i,
						afternoon: /απ(ό|ο)γευμα/i,
						evening: /βρ(ά|α)δυ/i,
						night: /ν(ύ|υ)χτα/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "less than a second",
				other: "less than {{count}} seconds"
			},
			xSeconds: {
				one: "1 second",
				other: "{{count}} seconds"
			},
			halfAMinute: "half a minute",
			lessThanXMinutes: {
				one: "less than a minute",
				other: "less than {{count}} minutes"
			},
			xMinutes: {
				one: "1 minute",
				other: "{{count}} minutes"
			},
			aboutXHours: {
				one: "about 1 hour",
				other: "about {{count}} hours"
			},
			xHours: {
				one: "1 hour",
				other: "{{count}} hours"
			},
			xDays: {
				one: "1 day",
				other: "{{count}} days"
			},
			aboutXWeeks: {
				one: "about 1 week",
				other: "about {{count}} weeks"
			},
			xWeeks: {
				one: "1 week",
				other: "{{count}} weeks"
			},
			aboutXMonths: {
				one: "about 1 month",
				other: "about {{count}} months"
			},
			xMonths: {
				one: "1 month",
				other: "{{count}} months"
			},
			aboutXYears: {
				one: "about 1 year",
				other: "about {{count}} years"
			},
			xYears: {
				one: "1 year",
				other: "{{count}} years"
			},
			overXYears: {
				one: "over 1 year",
				other: "over {{count}} years"
			},
			almostXYears: {
				one: "almost 1 year",
				other: "almost {{count}} years"
			}
		}),
		je = (e, t, n) => {
			let a;
			const i = We[e];
			return a = "string" == typeof i ? i : 1 === t ? i.one : i.other.replace("{{count}}", t.toString()),
			n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + a : a + " ago" : a
		},
		xe = (X({
				formats: {
					full: "EEEE, MMMM do, y",
					long: "MMMM do, y",
					medium: "MMM d, y",
					short: "MM/dd/yyyy"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'at' {{time}}",
					long: "{{date}} 'at' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), {
			lastWeek: "'last' eeee 'at' p",
			yesterday: "'yesterday at' p",
			today: "'today at' p",
			tomorrow: "'tomorrow at' p",
			nextWeek: "eeee 'at' p",
			other: "P"
		}),
		ze = (e, t, n, a) => xe[e],
		Te = {
			ordinalNumber: (e, t) => {
				const n = Number(e),
				a = n % 100;
				if (a > 20 || a < 10)
					switch (a % 10) {
					case 1:
						return n + "st";
					case 2:
						return n + "nd";
					case 3:
						return n + "rd"
					}
				return n + "th"
			},
			era: _({
				values: {
					narrow: ["B", "A"],
					abbreviated: ["BC", "AD"],
					wide: ["Before Christ", "Anno Domini"]
				},
				defaultWidth: "wide"
			}),
			quarter: _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}),
			month: _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
				},
				defaultWidth: "wide"
			}),
			day: _({
				values: {
					narrow: ["S", "M", "T", "W", "T", "F", "S"],
					short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
					abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
					wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
				},
				defaultWidth: "wide"
			}),
			dayPeriod: _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "mi",
						noon: "n",
						morning: "morning",
						afternoon: "afternoon",
						evening: "evening",
						night: "night"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "midnight",
						noon: "noon",
						morning: "morning",
						afternoon: "afternoon",
						evening: "evening",
						night: "night"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "midnight",
						noon: "noon",
						morning: "morning",
						afternoon: "afternoon",
						evening: "evening",
						night: "night"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "mi",
						noon: "n",
						morning: "in the morning",
						afternoon: "in the afternoon",
						evening: "in the evening",
						night: "at night"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "midnight",
						noon: "noon",
						morning: "in the morning",
						afternoon: "in the afternoon",
						evening: "in the evening",
						night: "at night"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "midnight",
						noon: "noon",
						morning: "in the morning",
						afternoon: "in the afternoon",
						evening: "in the evening",
						night: "at night"
					}
				},
				defaultFormattingWidth: "wide"
			})
		},
		Ee = {
			ordinalNumber: F({
				matchPattern: /^(\d+)(th|st|nd|rd)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}),
			era: G({
				matchPatterns: {
					narrow: /^(b|a)/i,
					abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
					wide: /^(before christ|before common era|anno domini|common era)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^b/i, /^(a|c)/i]
				},
				defaultParseWidth: "any"
			}),
			quarter: G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234](th|st|nd|rd)? quarter/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}),
			month: G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
					wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}),
			day: G({
				matchPatterns: {
					narrow: /^[smtwf]/i,
					short: /^(su|mo|tu|we|th|fr|sa)/i,
					abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
					wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
					any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}),
			dayPeriod: G({
				matchPatterns: {
					narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
					any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^mi/i,
						noon: /^no/i,
						morning: /morning/i,
						afternoon: /afternoon/i,
						evening: /evening/i,
						night: /night/i
					}
				},
				defaultParseWidth: "any"
			})
		},
		Se = (X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM yyyy",
					medium: "d MMM yyyy",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'at' {{time}}",
					long: "{{date}} 'at' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), {
			lessThanXSeconds: {
				one: "less than a second",
				other: "less than {{count}} seconds"
			},
			xSeconds: {
				one: "a second",
				other: "{{count}} seconds"
			},
			halfAMinute: "half a minute",
			lessThanXMinutes: {
				one: "less than a minute",
				other: "less than {{count}} minutes"
			},
			xMinutes: {
				one: "a minute",
				other: "{{count}} minutes"
			},
			aboutXHours: {
				one: "about an hour",
				other: "about {{count}} hours"
			},
			xHours: {
				one: "an hour",
				other: "{{count}} hours"
			},
			xDays: {
				one: "a day",
				other: "{{count}} days"
			},
			aboutXWeeks: {
				one: "about a week",
				other: "about {{count}} weeks"
			},
			xWeeks: {
				one: "a week",
				other: "{{count}} weeks"
			},
			aboutXMonths: {
				one: "about a month",
				other: "about {{count}} months"
			},
			xMonths: {
				one: "a month",
				other: "{{count}} months"
			},
			aboutXYears: {
				one: "about a year",
				other: "about {{count}} years"
			},
			xYears: {
				one: "a year",
				other: "{{count}} years"
			},
			overXYears: {
				one: "over a year",
				other: "over {{count}} years"
			},
			almostXYears: {
				one: "almost a year",
				other: "almost {{count}} years"
			}
		}),
		Ce = (X({
				formats: {
					full: "EEEE, MMMM do, yyyy",
					long: "MMMM do, yyyy",
					medium: "MMM d, yyyy",
					short: "yyyy-MM-dd"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'at' {{time}}",
					long: "{{date}} 'at' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM yyyy",
					medium: "d MMM yyyy",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'at' {{time}}",
					long: "{{date}} 'at' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM, yyyy",
					medium: "d MMM, yyyy",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'at' {{time}}",
					long: "{{date}} 'at' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM yyyy",
					medium: "d MMM yyyy",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'at' {{time}}",
					long: "{{date}} 'at' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), {
			lessThanXSeconds: {
				one: "malpli ol sekundo",
				other: "malpli ol {{count}} sekundoj"
			},
			xSeconds: {
				one: "1 sekundo",
				other: "{{count}} sekundoj"
			},
			halfAMinute: "duonminuto",
			lessThanXMinutes: {
				one: "malpli ol minuto",
				other: "malpli ol {{count}} minutoj"
			},
			xMinutes: {
				one: "1 minuto",
				other: "{{count}} minutoj"
			},
			aboutXHours: {
				one: "proksimume 1 horo",
				other: "proksimume {{count}} horoj"
			},
			xHours: {
				one: "1 horo",
				other: "{{count}} horoj"
			},
			xDays: {
				one: "1 tago",
				other: "{{count}} tagoj"
			},
			aboutXMonths: {
				one: "proksimume 1 monato",
				other: "proksimume {{count}} monatoj"
			},
			xWeeks: {
				one: "1 semajno",
				other: "{{count}} semajnoj"
			},
			aboutXWeeks: {
				one: "proksimume 1 semajno",
				other: "proksimume {{count}} semajnoj"
			},
			xMonths: {
				one: "1 monato",
				other: "{{count}} monatoj"
			},
			aboutXYears: {
				one: "proksimume 1 jaro",
				other: "proksimume {{count}} jaroj"
			},
			xYears: {
				one: "1 jaro",
				other: "{{count}} jaroj"
			},
			overXYears: {
				one: "pli ol 1 jaro",
				other: "pli ol {{count}} jaroj"
			},
			almostXYears: {
				one: "preskaŭ 1 jaro",
				other: "preskaŭ {{count}} jaroj"
			}
		}),
		Ae = {
			date: X({
				formats: {
					full: "EEEE, do 'de' MMMM y",
					long: "y-MMMM-dd",
					medium: "y-MMM-dd",
					short: "yyyy-MM-dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "Ho 'horo kaj' m:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					any: "{{date}} {{time}}"
				},
				defaultWidth: "any"
			})
		},
		He = {
			lastWeek: "'pasinta' eeee 'je' p",
			yesterday: "'hieraŭ je' p",
			today: "'hodiaŭ je' p",
			tomorrow: "'morgaŭ je' p",
			nextWeek: "eeee 'je' p",
			other: "P"
		},
		Ne = (_({
				values: {
					narrow: ["aK", "pK"],
					abbreviated: ["a.K.E.", "p.K.E."],
					wide: ["antaŭ Komuna Erao", "Komuna Erao"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["K1", "K2", "K3", "K4"],
					wide: ["1-a kvaronjaro", "2-a kvaronjaro", "3-a kvaronjaro", "4-a kvaronjaro"]
				},
				defaultWidth: "wide",
				argumentCallback: function (e) {
					return Number(e) - 1
				}
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aŭg", "sep", "okt", "nov", "dec"],
					wide: ["januaro", "februaro", "marto", "aprilo", "majo", "junio", "julio", "aŭgusto", "septembro", "oktobro", "novembro", "decembro"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["D", "L", "M", "M", "Ĵ", "V", "S"],
					short: ["di", "lu", "ma", "me", "ĵa", "ve", "sa"],
					abbreviated: ["dim", "lun", "mar", "mer", "ĵaŭ", "ven", "sab"],
					wide: ["dimanĉo", "lundo", "mardo", "merkredo", "ĵaŭdo", "vendredo", "sabato"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "noktomezo",
						noon: "tagmezo",
						morning: "matene",
						afternoon: "posttagmeze",
						evening: "vespere",
						night: "nokte"
					},
					abbreviated: {
						am: "a.t.m.",
						pm: "p.t.m.",
						midnight: "noktomezo",
						noon: "tagmezo",
						morning: "matene",
						afternoon: "posttagmeze",
						evening: "vespere",
						night: "nokte"
					},
					wide: {
						am: "antaŭtagmeze",
						pm: "posttagmeze",
						midnight: "noktomezo",
						noon: "tagmezo",
						morning: "matene",
						afternoon: "posttagmeze",
						evening: "vespere",
						night: "nokte"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(-?a)?/i,
				parsePattern: /\d+/i,
				valueCallback: function (e) {
					return parseInt(e, 10)
				}
			}), G({
				matchPatterns: {
					narrow: /^([ap]k)/i,
					abbreviated: /^([ap]\.?\s?k\.?\s?e\.?)/i,
					wide: /^((antaǔ |post )?komuna erao)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^a/i, /^[kp]/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^k[1234]/i,
					wide: /^[1234](-?a)? kvaronjaro/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: function (e) {
					return e + 1
				}
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan|feb|mar|apr|maj|jun|jul|a(ŭ|ux|uh|u)g|sep|okt|nov|dec)/i,
					wide: /^(januaro|februaro|marto|aprilo|majo|junio|julio|a(ŭ|ux|uh|u)gusto|septembro|oktobro|novembro|decembro)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^maj/i, /^jun/i, /^jul/i, /^a(u|ŭ)/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[dlmĵjvs]/i,
					short: /^(di|lu|ma|me|(ĵ|jx|jh|j)a|ve|sa)/i,
					abbreviated: /^(dim|lun|mar|mer|(ĵ|jx|jh|j)a(ŭ|ux|uh|u)|ven|sab)/i,
					wide: /^(diman(ĉ|cx|ch|c)o|lundo|mardo|merkredo|(ĵ|jx|jh|j)a(ŭ|ux|uh|u)do|vendredo|sabato)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^(j|ĵ)/i, /^v/i, /^s/i],
					any: [/^d/i, /^l/i, /^ma/i, /^me/i, /^(j|ĵ)/i, /^v/i, /^s/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^([ap]|(posttagmez|noktomez|tagmez|maten|vesper|nokt)[eo])/i,
					abbreviated: /^([ap][.\s]?t[.\s]?m[.\s]?|(posttagmez|noktomez|tagmez|maten|vesper|nokt)[eo])/i,
					wide: /^(anta(ŭ|ux)tagmez|posttagmez|noktomez|tagmez|maten|vesper|nokt)[eo]/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^noktom/i,
						noon: /^t/i,
						morning: /^m/i,
						afternoon: /^posttagmeze/i,
						evening: /^v/i,
						night: /^n/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "menos de un segundo",
				other: "menos de {{count}} segundos"
			},
			xSeconds: {
				one: "1 segundo",
				other: "{{count}} segundos"
			},
			halfAMinute: "medio minuto",
			lessThanXMinutes: {
				one: "menos de un minuto",
				other: "menos de {{count}} minutos"
			},
			xMinutes: {
				one: "1 minuto",
				other: "{{count}} minutos"
			},
			aboutXHours: {
				one: "alrededor de 1 hora",
				other: "alrededor de {{count}} horas"
			},
			xHours: {
				one: "1 hora",
				other: "{{count}} horas"
			},
			xDays: {
				one: "1 día",
				other: "{{count}} días"
			},
			aboutXWeeks: {
				one: "alrededor de 1 semana",
				other: "alrededor de {{count}} semanas"
			},
			xWeeks: {
				one: "1 semana",
				other: "{{count}} semanas"
			},
			aboutXMonths: {
				one: "alrededor de 1 mes",
				other: "alrededor de {{count}} meses"
			},
			xMonths: {
				one: "1 mes",
				other: "{{count}} meses"
			},
			aboutXYears: {
				one: "alrededor de 1 año",
				other: "alrededor de {{count}} años"
			},
			xYears: {
				one: "1 año",
				other: "{{count}} años"
			},
			overXYears: {
				one: "más de 1 año",
				other: "más de {{count}} años"
			},
			almostXYears: {
				one: "casi 1 año",
				other: "casi {{count}} años"
			}
		}),
		Xe = {
			date: X({
				formats: {
					full: "EEEE, d 'de' MMMM 'de' y",
					long: "d 'de' MMMM 'de' y",
					medium: "d MMM y",
					short: "dd/MM/y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'a las' {{time}}",
					long: "{{date}} 'a las' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Ie = {
			lastWeek: "'el' eeee 'pasado a la' p",
			yesterday: "'ayer a la' p",
			today: "'hoy a la' p",
			tomorrow: "'mañana a la' p",
			nextWeek: "eeee 'a la' p",
			other: "P"
		},
		De = {
			lastWeek: "'el' eeee 'pasado a las' p",
			yesterday: "'ayer a las' p",
			today: "'hoy a las' p",
			tomorrow: "'mañana a las' p",
			nextWeek: "eeee 'a las' p",
			other: "P"
		},
		_e = (_({
				values: {
					narrow: ["AC", "DC"],
					abbreviated: ["AC", "DC"],
					wide: ["antes de cristo", "después de cristo"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["T1", "T2", "T3", "T4"],
					wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
				},
				defaultWidth: "wide",
				argumentCallback: e => Number(e) - 1
			}), _({
				values: {
					narrow: ["e", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
					abbreviated: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
					wide: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["d", "l", "m", "m", "j", "v", "s"],
					short: ["do", "lu", "ma", "mi", "ju", "vi", "sá"],
					abbreviated: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
					wide: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "mn",
						noon: "md",
						morning: "mañana",
						afternoon: "tarde",
						evening: "tarde",
						night: "noche"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "medianoche",
						noon: "mediodia",
						morning: "mañana",
						afternoon: "tarde",
						evening: "tarde",
						night: "noche"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "medianoche",
						noon: "mediodia",
						morning: "mañana",
						afternoon: "tarde",
						evening: "tarde",
						night: "noche"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "mn",
						noon: "md",
						morning: "de la mañana",
						afternoon: "de la tarde",
						evening: "de la tarde",
						night: "de la noche"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "medianoche",
						noon: "mediodia",
						morning: "de la mañana",
						afternoon: "de la tarde",
						evening: "de la tarde",
						night: "de la noche"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "medianoche",
						noon: "mediodia",
						morning: "de la mañana",
						afternoon: "de la tarde",
						evening: "de la tarde",
						night: "de la noche"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(º)?/i,
				parsePattern: /\d+/i,
				valueCallback: function (e) {
					return parseInt(e, 10)
				}
			}), G({
				matchPatterns: {
					narrow: /^(ac|dc|a|d)/i,
					abbreviated: /^(a\.?\s?c\.?|a\.?\s?e\.?\s?c\.?|d\.?\s?c\.?|e\.?\s?c\.?)/i,
					wide: /^(antes de cristo|antes de la era com[uú]n|despu[eé]s de cristo|era com[uú]n)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^ac/i, /^dc/i],
					wide: [/^(antes de cristo|antes de la era com[uú]n)/i, /^(despu[eé]s de cristo|era com[uú]n)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^T[1234]/i,
					wide: /^[1234](º)? trimestre/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[efmajsond]/i,
					abbreviated: /^(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)/i,
					wide: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^e/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^en/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[dlmjvs]/i,
					short: /^(do|lu|ma|mi|ju|vi|s[áa])/i,
					abbreviated: /^(dom|lun|mar|mi[ée]|jue|vie|s[áa]b)/i,
					wide: /^(domingo|lunes|martes|mi[ée]rcoles|jueves|viernes|s[áa]bado)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^j/i, /^v/i, /^s/i],
					any: [/^do/i, /^lu/i, /^ma/i, /^mi/i, /^ju/i, /^vi/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|mn|md|(de la|a las) (mañana|tarde|noche))/i,
					any: /^([ap]\.?\s?m\.?|medianoche|mediodia|(de la|a las) (mañana|tarde|noche))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^mn/i,
						noon: /^md/i,
						morning: /mañana/i,
						afternoon: /tarde/i,
						evening: /tarde/i,
						night: /noche/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				standalone: {
					one: "vähem kui üks sekund",
					other: "vähem kui {{count}} sekundit"
				},
				withPreposition: {
					one: "vähem kui ühe sekundi",
					other: "vähem kui {{count}} sekundi"
				}
			},
			xSeconds: {
				standalone: {
					one: "üks sekund",
					other: "{{count}} sekundit"
				},
				withPreposition: {
					one: "ühe sekundi",
					other: "{{count}} sekundi"
				}
			},
			halfAMinute: {
				standalone: "pool minutit",
				withPreposition: "poole minuti"
			},
			lessThanXMinutes: {
				standalone: {
					one: "vähem kui üks minut",
					other: "vähem kui {{count}} minutit"
				},
				withPreposition: {
					one: "vähem kui ühe minuti",
					other: "vähem kui {{count}} minuti"
				}
			},
			xMinutes: {
				standalone: {
					one: "üks minut",
					other: "{{count}} minutit"
				},
				withPreposition: {
					one: "ühe minuti",
					other: "{{count}} minuti"
				}
			},
			aboutXHours: {
				standalone: {
					one: "umbes üks tund",
					other: "umbes {{count}} tundi"
				},
				withPreposition: {
					one: "umbes ühe tunni",
					other: "umbes {{count}} tunni"
				}
			},
			xHours: {
				standalone: {
					one: "üks tund",
					other: "{{count}} tundi"
				},
				withPreposition: {
					one: "ühe tunni",
					other: "{{count}} tunni"
				}
			},
			xDays: {
				standalone: {
					one: "üks päev",
					other: "{{count}} päeva"
				},
				withPreposition: {
					one: "ühe päeva",
					other: "{{count}} päeva"
				}
			},
			aboutXWeeks: {
				standalone: {
					one: "umbes üks nädal",
					other: "umbes {{count}} nädalat"
				},
				withPreposition: {
					one: "umbes ühe nädala",
					other: "umbes {{count}} nädala"
				}
			},
			xWeeks: {
				standalone: {
					one: "üks nädal",
					other: "{{count}} nädalat"
				},
				withPreposition: {
					one: "ühe nädala",
					other: "{{count}} nädala"
				}
			},
			aboutXMonths: {
				standalone: {
					one: "umbes üks kuu",
					other: "umbes {{count}} kuud"
				},
				withPreposition: {
					one: "umbes ühe kuu",
					other: "umbes {{count}} kuu"
				}
			},
			xMonths: {
				standalone: {
					one: "üks kuu",
					other: "{{count}} kuud"
				},
				withPreposition: {
					one: "ühe kuu",
					other: "{{count}} kuu"
				}
			},
			aboutXYears: {
				standalone: {
					one: "umbes üks aasta",
					other: "umbes {{count}} aastat"
				},
				withPreposition: {
					one: "umbes ühe aasta",
					other: "umbes {{count}} aasta"
				}
			},
			xYears: {
				standalone: {
					one: "üks aasta",
					other: "{{count}} aastat"
				},
				withPreposition: {
					one: "ühe aasta",
					other: "{{count}} aasta"
				}
			},
			overXYears: {
				standalone: {
					one: "rohkem kui üks aasta",
					other: "rohkem kui {{count}} aastat"
				},
				withPreposition: {
					one: "rohkem kui ühe aasta",
					other: "rohkem kui {{count}} aasta"
				}
			},
			almostXYears: {
				standalone: {
					one: "peaaegu üks aasta",
					other: "peaaegu {{count}} aastat"
				},
				withPreposition: {
					one: "peaaegu ühe aasta",
					other: "peaaegu {{count}} aasta"
				}
			}
		}),
		Ge = {
			date: X({
				formats: {
					full: "EEEE, d. MMMM y",
					long: "d. MMMM y",
					medium: "d. MMM y",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'kell' {{time}}",
					long: "{{date}} 'kell' {{time}}",
					medium: "{{date}}. {{time}}",
					short: "{{date}}. {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Fe = {
			lastWeek: "'eelmine' eeee 'kell' p",
			yesterday: "'eile kell' p",
			today: "'täna kell' p",
			tomorrow: "'homme kell' p",
			nextWeek: "'järgmine' eeee 'kell' p",
			other: "P"
		},
		Oe = {
			narrow: ["J", "V", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
			abbreviated: ["jaan", "veebr", "märts", "apr", "mai", "juuni", "juuli", "aug", "sept", "okt", "nov", "dets"],
			wide: ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"]
		},
		Ye = {
			narrow: ["P", "E", "T", "K", "N", "R", "L"],
			short: ["P", "E", "T", "K", "N", "R", "L"],
			abbreviated: ["pühap.", "esmasp.", "teisip.", "kolmap.", "neljap.", "reede.", "laup."],
			wide: ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"]
		},
		$e = (_({
				values: {
					narrow: ["e.m.a", "m.a.j"],
					abbreviated: ["e.m.a", "m.a.j"],
					wide: ["enne meie ajaarvamist", "meie ajaarvamise järgi"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["K1", "K2", "K3", "K4"],
					wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: Oe,
				defaultWidth: "wide",
				formattingValues: Oe,
				defaultFormattingWidth: "wide"
			}), _({
				values: Ye,
				defaultWidth: "wide",
				formattingValues: Ye,
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "kesköö",
						noon: "keskpäev",
						morning: "hommik",
						afternoon: "pärastlõuna",
						evening: "õhtu",
						night: "öö"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "kesköö",
						noon: "keskpäev",
						morning: "hommik",
						afternoon: "pärastlõuna",
						evening: "õhtu",
						night: "öö"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "kesköö",
						noon: "keskpäev",
						morning: "hommik",
						afternoon: "pärastlõuna",
						evening: "õhtu",
						night: "öö"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "keskööl",
						noon: "keskpäeval",
						morning: "hommikul",
						afternoon: "pärastlõunal",
						evening: "õhtul",
						night: "öösel"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "keskööl",
						noon: "keskpäeval",
						morning: "hommikul",
						afternoon: "pärastlõunal",
						evening: "õhtul",
						night: "öösel"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "keskööl",
						noon: "keskpäeval",
						morning: "hommikul",
						afternoon: "pärastlõunal",
						evening: "õhtul",
						night: "öösel"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^\d+\./i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(e\.m\.a|m\.a\.j|eKr|pKr)/i,
					abbreviated: /^(e\.m\.a|m\.a\.j|eKr|pKr)/i,
					wide: /^(enne meie ajaarvamist|meie ajaarvamise järgi|enne Kristust|pärast Kristust)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^e/i, /^(m|p)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^K[1234]/i,
					wide: /^[1234](\.)? kvartal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jvmasond]/i,
					abbreviated: /^(jaan|veebr|märts|apr|mai|juuni|juuli|aug|sept|okt|nov|dets)/i,
					wide: /^(jaanuar|veebruar|märts|aprill|mai|juuni|juuli|august|september|oktoober|november|detsember)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^v/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^v/i, /^mär/i, /^ap/i, /^mai/i, /^juun/i, /^juul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[petknrl]/i,
					short: /^[petknrl]/i,
					abbreviated: /^(püh?|esm?|tei?|kolm?|nel?|ree?|laup?)\.?/i,
					wide: /^(pühapäev|esmaspäev|teisipäev|kolmapäev|neljapäev|reede|laupäev)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^p/i, /^e/i, /^t/i, /^k/i, /^n/i, /^r/i, /^l/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(am|pm|keskööl?|keskpäev(al)?|hommik(ul)?|pärastlõunal?|õhtul?|öö(sel)?)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^keskö/i,
						noon: /^keskp/i,
						morning: /hommik/i,
						afternoon: /pärastlõuna/i,
						evening: /õhtu/i,
						night: /öö/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "segundo bat baino gutxiago",
				other: "{{count}} segundo baino gutxiago"
			},
			xSeconds: {
				one: "1 segundo",
				other: "{{count}} segundo"
			},
			halfAMinute: "minutu erdi",
			lessThanXMinutes: {
				one: "minutu bat baino gutxiago",
				other: "{{count}} minutu baino gutxiago"
			},
			xMinutes: {
				one: "1 minutu",
				other: "{{count}} minutu"
			},
			aboutXHours: {
				one: "1 ordu gutxi gorabehera",
				other: "{{count}} ordu gutxi gorabehera"
			},
			xHours: {
				one: "1 ordu",
				other: "{{count}} ordu"
			},
			xDays: {
				one: "1 egun",
				other: "{{count}} egun"
			},
			aboutXWeeks: {
				one: "aste 1 inguru",
				other: "{{count}} aste inguru"
			},
			xWeeks: {
				one: "1 aste",
				other: "{{count}} astean"
			},
			aboutXMonths: {
				one: "1 hilabete gutxi gorabehera",
				other: "{{count}} hilabete gutxi gorabehera"
			},
			xMonths: {
				one: "1 hilabete",
				other: "{{count}} hilabete"
			},
			aboutXYears: {
				one: "1 urte gutxi gorabehera",
				other: "{{count}} urte gutxi gorabehera"
			},
			xYears: {
				one: "1 urte",
				other: "{{count}} urte"
			},
			overXYears: {
				one: "1 urte baino gehiago",
				other: "{{count}} urte baino gehiago"
			},
			almostXYears: {
				one: "ia 1 urte",
				other: "ia {{count}} urte"
			}
		}),
		Ke = {
			date: X({
				formats: {
					full: "EEEE, y'ko' MMMM'ren' d'a' y'ren'",
					long: "y'ko' MMMM'ren' d'a'",
					medium: "y MMM d",
					short: "yy/MM/dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'tan' {{time}}",
					long: "{{date}} 'tan' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Je = {
			lastWeek: "'joan den' eeee, LT",
			yesterday: "'atzo,' p",
			today: "'gaur,' p",
			tomorrow: "'bihar,' p",
			nextWeek: "eeee, p",
			other: "P"
		},
		Ve = {
			lastWeek: "'joan den' eeee, p",
			yesterday: "'atzo,' p",
			today: "'gaur,' p",
			tomorrow: "'bihar,' p",
			nextWeek: "eeee, p",
			other: "P"
		},
		qe = (_({
				values: {
					narrow: ["k.a.", "k.o."],
					abbreviated: ["k.a.", "k.o."],
					wide: ["kristo aurretik", "kristo ondoren"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1H", "2H", "3H", "4H"],
					wide: ["1. hiruhilekoa", "2. hiruhilekoa", "3. hiruhilekoa", "4. hiruhilekoa"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["u", "o", "m", "a", "m", "e", "u", "a", "i", "u", "a", "a"],
					abbreviated: ["urt", "ots", "mar", "api", "mai", "eka", "uzt", "abu", "ira", "urr", "aza", "abe"],
					wide: ["urtarrila", "otsaila", "martxoa", "apirila", "maiatza", "ekaina", "uztaila", "abuztua", "iraila", "urria", "azaroa", "abendua"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["i", "a", "a", "a", "o", "o", "l"],
					short: ["ig", "al", "as", "az", "og", "or", "lr"],
					abbreviated: ["iga", "ast", "ast", "ast", "ost", "ost", "lar"],
					wide: ["igandea", "astelehena", "asteartea", "asteazkena", "osteguna", "ostirala", "larunbata"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "ge",
						noon: "eg",
						morning: "goiza",
						afternoon: "arratsaldea",
						evening: "arratsaldea",
						night: "gaua"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "gauerdia",
						noon: "eguerdia",
						morning: "goiza",
						afternoon: "arratsaldea",
						evening: "arratsaldea",
						night: "gaua"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "gauerdia",
						noon: "eguerdia",
						morning: "goiza",
						afternoon: "arratsaldea",
						evening: "arratsaldea",
						night: "gaua"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "ge",
						noon: "eg",
						morning: "goizean",
						afternoon: "arratsaldean",
						evening: "arratsaldean",
						night: "gauean"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "gauerdia",
						noon: "eguerdia",
						morning: "goizean",
						afternoon: "arratsaldean",
						evening: "arratsaldean",
						night: "gauean"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "gauerdia",
						noon: "eguerdia",
						morning: "goizean",
						afternoon: "arratsaldean",
						evening: "arratsaldean",
						night: "gauean"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(.)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(k.a.|k.o.)/i,
					abbreviated: /^(k.a.|k.o.)/i,
					wide: /^(kristo aurretik|kristo ondoren)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^k.a./i, /^k.o./i],
					abbreviated: [/^(k.a.)/i, /^(k.o.)/i],
					wide: [/^(kristo aurretik)/i, /^(kristo ondoren)/i]
				},
				defaultParseWidth: "wide"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234]H/i,
					wide: /^[1234](.)? hiruhilekoa/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[uomaei]/i,
					abbreviated: /^(urt|ots|mar|api|mai|eka|uzt|abu|ira|urr|aza|abe)/i,
					wide: /^(urtarrila|otsaila|martxoa|apirila|maiatza|ekaina|uztaila|abuztua|iraila|urria|azaroa|abendua)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^u/i, /^o/i, /^m/i, /^a/i, /^m/i, /^e/i, /^u/i, /^a/i, /^i/i, /^u/i, /^a/i, /^a/i],
					any: [/^urt/i, /^ots/i, /^mar/i, /^api/i, /^mai/i, /^eka/i, /^uzt/i, /^abu/i, /^ira/i, /^urr/i, /^aza/i, /^abe/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[iaol]/i,
					short: /^(ig|al|as|az|og|or|lr)/i,
					abbreviated: /^(iga|ast|ast|ast|ost|ost|lar)/i,
					wide: /^(igandea|astelehena|asteartea|asteazkena|osteguna|ostirala|larunbata)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^i/i, /^a/i, /^a/i, /^a/i, /^o/i, /^o/i, /^l/i],
					short: [/^ig/i, /^al/i, /^as/i, /^az/i, /^og/i, /^or/i, /^lr/i],
					abbreviated: [/^iga/i, /^ast/i, /^ast/i, /^ast/i, /^ost/i, /^ost/i, /^lar/i],
					wide: [/^igandea/i, /^astelehena/i, /^asteartea/i, /^asteazkena/i, /^osteguna/i, /^ostirala/i, /^larunbata/i]
				},
				defaultParseWidth: "wide"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|ge|eg|((goiza|goizean)|arratsaldea|(gaua|gauean)))/i,
					any: /^([ap]\.?\s?m\.?|gauerdia|eguerdia|((goiza|goizean)|arratsaldea|(gaua|gauean)))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					narrow: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^ge/i,
						noon: /^eg/i,
						morning: /goiz/i,
						afternoon: /arratsaldea/i,
						evening: /arratsaldea/i,
						night: /gau/i
					},
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^gauerdia/i,
						noon: /^eguerdia/i,
						morning: /goiz/i,
						afternoon: /arratsaldea/i,
						evening: /arratsaldea/i,
						night: /gau/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "کمتر از یک ثانیه",
				other: "کمتر از {{count}} ثانیه"
			},
			xSeconds: {
				one: "1 ثانیه",
				other: "{{count}} ثانیه"
			},
			halfAMinute: "نیم دقیقه",
			lessThanXMinutes: {
				one: "کمتر از یک دقیقه",
				other: "کمتر از {{count}} دقیقه"
			},
			xMinutes: {
				one: "1 دقیقه",
				other: "{{count}} دقیقه"
			},
			aboutXHours: {
				one: "حدود 1 ساعت",
				other: "حدود {{count}} ساعت"
			},
			xHours: {
				one: "1 ساعت",
				other: "{{count}} ساعت"
			},
			xDays: {
				one: "1 روز",
				other: "{{count}} روز"
			},
			aboutXWeeks: {
				one: "حدود 1 هفته",
				other: "حدود {{count}} هفته"
			},
			xWeeks: {
				one: "1 هفته",
				other: "{{count}} هفته"
			},
			aboutXMonths: {
				one: "حدود 1 ماه",
				other: "حدود {{count}} ماه"
			},
			xMonths: {
				one: "1 ماه",
				other: "{{count}} ماه"
			},
			aboutXYears: {
				one: "حدود 1 سال",
				other: "حدود {{count}} سال"
			},
			xYears: {
				one: "1 سال",
				other: "{{count}} سال"
			},
			overXYears: {
				one: "بیشتر از 1 سال",
				other: "بیشتر از {{count}} سال"
			},
			almostXYears: {
				one: "نزدیک 1 سال",
				other: "نزدیک {{count}} سال"
			}
		}),
		Le = {
			date: X({
				formats: {
					full: "EEEE do MMMM y",
					long: "do MMMM y",
					medium: "d MMM y",
					short: "yyyy/MM/dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'در' {{time}}",
					long: "{{date}} 'در' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Be = {
			lastWeek: "eeee 'گذشته در' p",
			yesterday: "'دیروز در' p",
			today: "'امروز در' p",
			tomorrow: "'فردا در' p",
			nextWeek: "eeee 'در' p",
			other: "P"
		};
		_({
			values: {
				narrow: ["ق", "ب"],
				abbreviated: ["ق.م.", "ب.م."],
				wide: ["قبل از میلاد", "بعد از میلاد"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["س‌م1", "س‌م2", "س‌م3", "س‌م4"],
				wide: ["سه‌ماهه 1", "سه‌ماهه 2", "سه‌ماهه 3", "سه‌ماهه 4"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["ژ", "ف", "م", "آ", "م", "ج", "ج", "آ", "س", "ا", "ن", "د"],
				abbreviated: ["ژانـ", "فور", "مارس", "آپر", "می", "جون", "جولـ", "آگو", "سپتـ", "اکتـ", "نوامـ", "دسامـ"],
				wide: ["ژانویه", "فوریه", "مارس", "آپریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
				short: ["1ش", "2ش", "3ش", "4ش", "5ش", "ج", "ش"],
				abbreviated: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
				wide: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "ق",
					pm: "ب",
					midnight: "ن",
					noon: "ظ",
					morning: "ص",
					afternoon: "ب.ظ.",
					evening: "ع",
					night: "ش"
				},
				abbreviated: {
					am: "ق.ظ.",
					pm: "ب.ظ.",
					midnight: "نیمه‌شب",
					noon: "ظهر",
					morning: "صبح",
					afternoon: "بعدازظهر",
					evening: "عصر",
					night: "شب"
				},
				wide: {
					am: "قبل‌ازظهر",
					pm: "بعدازظهر",
					midnight: "نیمه‌شب",
					noon: "ظهر",
					morning: "صبح",
					afternoon: "بعدازظهر",
					evening: "عصر",
					night: "شب"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "ق",
					pm: "ب",
					midnight: "ن",
					noon: "ظ",
					morning: "ص",
					afternoon: "ب.ظ.",
					evening: "ع",
					night: "ش"
				},
				abbreviated: {
					am: "ق.ظ.",
					pm: "ب.ظ.",
					midnight: "نیمه‌شب",
					noon: "ظهر",
					morning: "صبح",
					afternoon: "بعدازظهر",
					evening: "عصر",
					night: "شب"
				},
				wide: {
					am: "قبل‌ازظهر",
					pm: "بعدازظهر",
					midnight: "نیمه‌شب",
					noon: "ظهر",
					morning: "صبح",
					afternoon: "بعدازظهر",
					evening: "عصر",
					night: "شب"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(ق|ب)/i,
				abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?د\.?\s?م\.?|م\.?\s?|د\.?\s?م\.?)/i,
				wide: /^(قبل از میلاد|قبل از دوران مشترک|میلادی|دوران مشترک|بعد از میلاد)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^قبل/i, /^بعد/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^س‌م[1234]/i,
				wide: /^سه‌ماهه [1234]/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[جژفمآاماسند]/i,
				abbreviated: /^(جنو|ژانـ|ژانویه|فوریه|فور|مارس|آوریل|آپر|مه|می|ژوئن|جون|جول|جولـ|ژوئیه|اوت|آگو|سپتمبر|سپتامبر|اکتبر|اکتوبر|نوامبر|نوامـ|دسامبر|دسامـ|دسم)/i,
				wide: /^(ژانویه|جنوری|فبروری|فوریه|مارچ|مارس|آپریل|اپریل|ایپریل|آوریل|مه|می|ژوئن|جون|جولای|ژوئیه|آگست|اگست|آگوست|اوت|سپتمبر|سپتامبر|اکتبر|اکتوبر|نوامبر|نومبر|دسامبر|دسمبر)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^(ژ|ج)/i, /^ف/i, /^م/i, /^(آ|ا)/i, /^م/i, /^(ژ|ج)/i, /^(ج|ژ)/i, /^(آ|ا)/i, /^س/i, /^ا/i, /^ن/i, /^د/i],
				any: [/^ژا/i, /^ف/i, /^ما/i, /^آپ/i, /^(می|مه)/i, /^(ژوئن|جون)/i, /^(ژوئی|جول)/i, /^(اوت|آگ)/i, /^س/i, /^(اوک|اک)/i, /^ن/i, /^د/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[شیدسچپج]/i,
				short: /^(ش|ج|1ش|2ش|3ش|4ش|5ش)/i,
				abbreviated: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه)/i,
				wide: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^ی/i, /^دو/i, /^س/i, /^چ/i, /^پ/i, /^ج/i, /^ش/i],
				any: [/^(ی|1ش|یکشنبه)/i, /^(د|2ش|دوشنبه)/i, /^(س|3ش|سه‌شنبه)/i, /^(چ|4ش|چهارشنبه)/i, /^(پ|5ش|پنجشنبه)/i, /^(ج|جمعه)/i, /^(ش|شنبه)/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(ب|ق|ن|ظ|ص|ب.ظ.|ع|ش)/i,
				abbreviated: /^(ق.ظ.|ب.ظ.|نیمه‌شب|ظهر|صبح|بعدازظهر|عصر|شب)/i,
				wide: /^(قبل‌ازظهر|نیمه‌شب|ظهر|صبح|بعدازظهر|عصر|شب)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: {
					am: /^(ق|ق.ظ.|قبل‌ازظهر)/i,
					pm: /^(ب|ب.ظ.|بعدازظهر)/i,
					midnight: /^(‌نیمه‌شب|ن)/i,
					noon: /^(ظ|ظهر)/i,
					morning: /(ص|صبح)/i,
					afternoon: /(ب|ب.ظ.|بعدازظهر)/i,
					evening: /(ع|عصر)/i,
					night: /(ش|شب)/i
				}
			},
			defaultParseWidth: "any"
		});

		function Qe(e) {
			return e.replace(/sekuntia?/, "sekunnin")
		}

		function Re(e) {
			return e.replace(/minuuttia?/, "minuutin")
		}

		function Ue(e) {
			return e.replace(/tuntia?/, "tunnin")
		}

		function Ze(e) {
			return e.replace(/(viikko|viikkoa)/, "viikon")
		}

		function et(e) {
			return e.replace(/(kuukausi|kuukautta)/, "kuukauden")
		}

		function tt(e) {
			return e.replace(/(vuosi|vuotta)/, "vuoden")
		}
		const nt = {
			lessThanXSeconds: {
				one: "alle sekunti",
				other: "alle {{count}} sekuntia",
				futureTense: Qe
			},
			xSeconds: {
				one: "sekunti",
				other: "{{count}} sekuntia",
				futureTense: Qe
			},
			halfAMinute: {
				one: "puoli minuuttia",
				other: "puoli minuuttia",
				futureTense: e => "puolen minuutin"
			},
			lessThanXMinutes: {
				one: "alle minuutti",
				other: "alle {{count}} minuuttia",
				futureTense: Re
			},
			xMinutes: {
				one: "minuutti",
				other: "{{count}} minuuttia",
				futureTense: Re
			},
			aboutXHours: {
				one: "noin tunti",
				other: "noin {{count}} tuntia",
				futureTense: Ue
			},
			xHours: {
				one: "tunti",
				other: "{{count}} tuntia",
				futureTense: Ue
			},
			xDays: {
				one: "päivä",
				other: "{{count}} päivää",
				futureTense: function (e) {
					return e.replace(/päivää?/, "päivän")
				}
			},
			aboutXWeeks: {
				one: "noin viikko",
				other: "noin {{count}} viikkoa",
				futureTense: Ze
			},
			xWeeks: {
				one: "viikko",
				other: "{{count}} viikkoa",
				futureTense: Ze
			},
			aboutXMonths: {
				one: "noin kuukausi",
				other: "noin {{count}} kuukautta",
				futureTense: et
			},
			xMonths: {
				one: "kuukausi",
				other: "{{count}} kuukautta",
				futureTense: et
			},
			aboutXYears: {
				one: "noin vuosi",
				other: "noin {{count}} vuotta",
				futureTense: tt
			},
			xYears: {
				one: "vuosi",
				other: "{{count}} vuotta",
				futureTense: tt
			},
			overXYears: {
				one: "yli vuosi",
				other: "yli {{count}} vuotta",
				futureTense: tt
			},
			almostXYears: {
				one: "lähes vuosi",
				other: "lähes {{count}} vuotta",
				futureTense: tt
			}
		},
		at = {
			date: X({
				formats: {
					full: "eeee d. MMMM y",
					long: "d. MMMM y",
					medium: "d. MMM y",
					short: "d.M.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH.mm.ss zzzz",
					long: "HH.mm.ss z",
					medium: "HH.mm.ss",
					short: "HH.mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'klo' {{time}}",
					long: "{{date}} 'klo' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		it = {
			lastWeek: "'viime' eeee 'klo' p",
			yesterday: "'eilen klo' p",
			today: "'tänään klo' p",
			tomorrow: "'huomenna klo' p",
			nextWeek: "'ensi' eeee 'klo' p",
			other: "P"
		},
		rt = {
			narrow: ["T", "H", "M", "H", "T", "K", "H", "E", "S", "L", "M", "J"],
			abbreviated: ["tammi", "helmi", "maalis", "huhti", "touko", "kesä", "heinä", "elo", "syys", "loka", "marras", "joulu"],
			wide: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"]
		},
		ot = {
			narrow: rt.narrow,
			abbreviated: rt.abbreviated,
			wide: ["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta", "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta"]
		},
		st = {
			narrow: ["S", "M", "T", "K", "T", "P", "L"],
			short: ["su", "ma", "ti", "ke", "to", "pe", "la"],
			abbreviated: ["sunn.", "maan.", "tiis.", "kesk.", "torst.", "perj.", "la"],
			wide: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"]
		},
		dt = {
			narrow: st.narrow,
			short: st.short,
			abbreviated: st.abbreviated,
			wide: ["sunnuntaina", "maanantaina", "tiistaina", "keskiviikkona", "torstaina", "perjantaina", "lauantaina"]
		},
		ut = (_({
				values: {
					narrow: ["eaa.", "jaa."],
					abbreviated: ["eaa.", "jaa."],
					wide: ["ennen ajanlaskun alkua", "jälkeen ajanlaskun alun"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["1. kvartaali", "2. kvartaali", "3. kvartaali", "4. kvartaali"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: rt,
				defaultWidth: "wide",
				formattingValues: ot,
				defaultFormattingWidth: "wide"
			}), _({
				values: st,
				defaultWidth: "wide",
				formattingValues: dt,
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ap",
						pm: "ip",
						midnight: "keskiyö",
						noon: "keskipäivä",
						morning: "ap",
						afternoon: "ip",
						evening: "illalla",
						night: "yöllä"
					},
					abbreviated: {
						am: "ap",
						pm: "ip",
						midnight: "keskiyö",
						noon: "keskipäivä",
						morning: "ap",
						afternoon: "ip",
						evening: "illalla",
						night: "yöllä"
					},
					wide: {
						am: "ap",
						pm: "ip",
						midnight: "keskiyöllä",
						noon: "keskipäivällä",
						morning: "aamupäivällä",
						afternoon: "iltapäivällä",
						evening: "illalla",
						night: "yöllä"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(\.)/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(e|j)/i,
					abbreviated: /^(eaa.|jaa.)/i,
					wide: /^(ennen ajanlaskun alkua|jälkeen ajanlaskun alun)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^e/i, /^j/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234]\.? kvartaali/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[thmkeslj]/i,
					abbreviated: /^(tammi|helmi|maalis|huhti|touko|kesä|heinä|elo|syys|loka|marras|joulu)/i,
					wide: /^(tammikuu|helmikuu|maaliskuu|huhtikuu|toukokuu|kesäkuu|heinäkuu|elokuu|syyskuu|lokakuu|marraskuu|joulukuu)(ta)?/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^t/i, /^h/i, /^m/i, /^h/i, /^t/i, /^k/i, /^h/i, /^e/i, /^s/i, /^l/i, /^m/i, /^j/i],
					any: [/^ta/i, /^hel/i, /^maa/i, /^hu/i, /^to/i, /^k/i, /^hei/i, /^e/i, /^s/i, /^l/i, /^mar/i, /^j/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[smtkpl]/i,
					short: /^(su|ma|ti|ke|to|pe|la)/i,
					abbreviated: /^(sunn.|maan.|tiis.|kesk.|torst.|perj.|la)/i,
					wide: /^(sunnuntai|maanantai|tiistai|keskiviikko|torstai|perjantai|lauantai)(na)?/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^s/i, /^m/i, /^t/i, /^k/i, /^t/i, /^p/i, /^l/i],
					any: [/^s/i, /^m/i, /^ti/i, /^k/i, /^to/i, /^p/i, /^l/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(ap|ip|keskiyö|keskipäivä|aamupäivällä|iltapäivällä|illalla|yöllä)/i,
					any: /^(ap|ip|keskiyöllä|keskipäivällä|aamupäivällä|iltapäivällä|illalla|yöllä)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^ap/i,
						pm: /^ip/i,
						midnight: /^keskiyö/i,
						noon: /^keskipäivä/i,
						morning: /aamupäivällä/i,
						afternoon: /iltapäivällä/i,
						evening: /illalla/i,
						night: /yöllä/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "moins d’une seconde",
				other: "moins de {{count}} secondes"
			},
			xSeconds: {
				one: "1 seconde",
				other: "{{count}} secondes"
			},
			halfAMinute: "30 secondes",
			lessThanXMinutes: {
				one: "moins d’une minute",
				other: "moins de {{count}} minutes"
			},
			xMinutes: {
				one: "1 minute",
				other: "{{count}} minutes"
			},
			aboutXHours: {
				one: "environ 1 heure",
				other: "environ {{count}} heures"
			},
			xHours: {
				one: "1 heure",
				other: "{{count}} heures"
			},
			xDays: {
				one: "1 jour",
				other: "{{count}} jours"
			},
			aboutXWeeks: {
				one: "environ 1 semaine",
				other: "environ {{count}} semaines"
			},
			xWeeks: {
				one: "1 semaine",
				other: "{{count}} semaines"
			},
			aboutXMonths: {
				one: "environ 1 mois",
				other: "environ {{count}} mois"
			},
			xMonths: {
				one: "1 mois",
				other: "{{count}} mois"
			},
			aboutXYears: {
				one: "environ 1 an",
				other: "environ {{count}} ans"
			},
			xYears: {
				one: "1 an",
				other: "{{count}} ans"
			},
			overXYears: {
				one: "plus d’un an",
				other: "plus de {{count}} ans"
			},
			almostXYears: {
				one: "presqu’un an",
				other: "presque {{count}} ans"
			}
		}),
		mt = (e, t, n) => {
			let a;
			const i = ut[e];
			return a = "string" == typeof i ? i : 1 === t ? i.one : i.other.replace("{{count}}", String(t)),
			n?.addSuffix ? n.comparison && n.comparison > 0 ? "dans " + a : "il y a " + a : a
		},
		lt = (X({
				formats: {
					full: "EEEE d MMMM y",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "dd/MM/y"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'à' {{time}}",
					long: "{{date}} 'à' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), {
			lastWeek: "eeee 'dernier à' p",
			yesterday: "'hier à' p",
			today: "'aujourd’hui à' p",
			tomorrow: "'demain à' p'",
			nextWeek: "eeee 'prochain à' p",
			other: "P"
		}),
		ht = (e, t, n, a) => lt[e],
		ct = ["MMM", "MMMM"],
		gt = {
			preprocessor: (e, t) => {
				if (1 === e.getDate())
					return t;
				return t.some((e => e.isToken && ct.includes(e.value))) ? t.map((e => e.isToken && "do" === e.value ? {
						isToken: !0,
						value: "d"
					}
						 : e)) : t
			},
			ordinalNumber: (e, t) => {
				const n = Number(e),
				a = t?.unit;
				if (0 === n)
					return "0";
				let i;
				return i = 1 === n ? a && ["year", "week", "hour", "minute", "second"].includes(a) ? "ère" : "er" : "ème",
				n + i
			},
			era: _({
				values: {
					narrow: ["av. J.-C", "ap. J.-C"],
					abbreviated: ["av. J.-C", "ap. J.-C"],
					wide: ["avant Jésus-Christ", "après Jésus-Christ"]
				},
				defaultWidth: "wide"
			}),
			quarter: _({
				values: {
					narrow: ["T1", "T2", "T3", "T4"],
					abbreviated: ["1er trim.", "2ème trim.", "3ème trim.", "4ème trim."],
					wide: ["1er trimestre", "2ème trimestre", "3ème trimestre", "4ème trimestre"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}),
			month: _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
					wide: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
				},
				defaultWidth: "wide"
			}),
			day: _({
				values: {
					narrow: ["D", "L", "M", "M", "J", "V", "S"],
					short: ["di", "lu", "ma", "me", "je", "ve", "sa"],
					abbreviated: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
					wide: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
				},
				defaultWidth: "wide"
			}),
			dayPeriod: _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "minuit",
						noon: "midi",
						morning: "mat.",
						afternoon: "ap.m.",
						evening: "soir",
						night: "mat."
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "minuit",
						noon: "midi",
						morning: "matin",
						afternoon: "après-midi",
						evening: "soir",
						night: "matin"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "minuit",
						noon: "midi",
						morning: "du matin",
						afternoon: "de l’après-midi",
						evening: "du soir",
						night: "du matin"
					}
				},
				defaultWidth: "wide"
			})
		},
		ft = {
			ordinalNumber: F({
				matchPattern: /^(\d+)(ième|ère|ème|er|e)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e)
			}),
			era: G({
				matchPatterns: {
					narrow: /^(av\.J\.C|ap\.J\.C|ap\.J\.-C)/i,
					abbreviated: /^(av\.J\.-C|av\.J-C|apr\.J\.-C|apr\.J-C|ap\.J-C)/i,
					wide: /^(avant Jésus-Christ|après Jésus-Christ)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^av/i, /^ap/i]
				},
				defaultParseWidth: "any"
			}),
			quarter: G({
				matchPatterns: {
					narrow: /^T?[1234]/i,
					abbreviated: /^[1234](er|ème|e)? trim\.?/i,
					wide: /^[1234](er|ème|e)? trimestre/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}),
			month: G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(janv|févr|mars|avr|mai|juin|juill|juil|août|sept|oct|nov|déc)\.?/i,
					wide: /^(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^av/i, /^ma/i, /^juin/i, /^juil/i, /^ao/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}),
			day: G({
				matchPatterns: {
					narrow: /^[lmjvsd]/i,
					short: /^(di|lu|ma|me|je|ve|sa)/i,
					abbreviated: /^(dim|lun|mar|mer|jeu|ven|sam)\.?/i,
					wide: /^(dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^j/i, /^v/i, /^s/i],
					any: [/^di/i, /^lu/i, /^ma/i, /^me/i, /^je/i, /^ve/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}),
			dayPeriod: G({
				matchPatterns: {
					narrow: /^(a|p|minuit|midi|mat\.?|ap\.?m\.?|soir|nuit)/i,
					any: /^([ap]\.?\s?m\.?|du matin|de l'après[-\s]midi|du soir|de la nuit)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^min/i,
						noon: /^mid/i,
						morning: /mat/i,
						afternoon: /ap/i,
						evening: /soir/i,
						night: /nuit/i
					}
				},
				defaultParseWidth: "any"
			})
		},
		pt = (X({
				formats: {
					full: "EEEE d MMMM y",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "yy-MM-dd"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'à' {{time}}",
					long: "{{date}} 'à' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "EEEE d MMMM y",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}), X({
				formats: {
					full: "{{date}} 'à' {{time}}",
					long: "{{date}} 'à' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			}), {
			lessThanXSeconds: {
				one: "nas lugha na diog",
				other: "nas lugha na {{count}} diogan"
			},
			xSeconds: {
				one: "1 diog",
				two: "2 dhiog",
				twenty: "20 diog",
				other: "{{count}} diogan"
			},
			halfAMinute: "leth mhionaid",
			lessThanXMinutes: {
				one: "nas lugha na mionaid",
				other: "nas lugha na {{count}} mionaidean"
			},
			xMinutes: {
				one: "1 mionaid",
				two: "2 mhionaid",
				twenty: "20 mionaid",
				other: "{{count}} mionaidean"
			},
			aboutXHours: {
				one: "mu uair de thìde",
				other: "mu {{count}} uairean de thìde"
			},
			xHours: {
				one: "1 uair de thìde",
				two: "2 uair de thìde",
				twenty: "20 uair de thìde",
				other: "{{count}} uairean de thìde"
			},
			xDays: {
				one: "1 là",
				other: "{{count}} là"
			},
			aboutXWeeks: {
				one: "mu 1 seachdain",
				other: "mu {{count}} seachdainean"
			},
			xWeeks: {
				one: "1 seachdain",
				other: "{{count}} seachdainean"
			},
			aboutXMonths: {
				one: "mu mhìos",
				other: "mu {{count}} mìosan"
			},
			xMonths: {
				one: "1 mìos",
				other: "{{count}} mìosan"
			},
			aboutXYears: {
				one: "mu bhliadhna",
				other: "mu {{count}} bliadhnaichean"
			},
			xYears: {
				one: "1 bhliadhna",
				other: "{{count}} bliadhna"
			},
			overXYears: {
				one: "còrr is bliadhna",
				other: "còrr is {{count}} bliadhnaichean"
			},
			almostXYears: {
				one: "cha mhòr bliadhna",
				other: "cha mhòr {{count}} bliadhnaichean"
			}
		}),
		vt = {
			date: X({
				formats: {
					full: "EEEE, MMMM do, y",
					long: "MMMM do, y",
					medium: "MMM d, y",
					short: "MM/dd/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'aig' {{time}}",
					long: "{{date}} 'aig' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		bt = {
			lastWeek: "'mu dheireadh' eeee 'aig' p",
			yesterday: "'an-dè aig' p",
			today: "'an-diugh aig' p",
			tomorrow: "'a-màireach aig' p",
			nextWeek: "eeee 'aig' p",
			other: "P"
		},
		wt = (_({
				values: {
					narrow: ["R", "A"],
					abbreviated: ["RC", "AD"],
					wide: ["ro Chrìosta", "anno domini"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["C1", "C2", "C3", "C4"],
					wide: ["a' chiad chairteal", "an dàrna cairteal", "an treas cairteal", "an ceathramh cairteal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["F", "G", "M", "G", "C", "Ò", "I", "L", "S", "D", "S", "D"],
					abbreviated: ["Faoi", "Gear", "Màrt", "Gibl", "Cèit", "Ògmh", "Iuch", "Lùn", "Sult", "Dàmh", "Samh", "Dùbh"],
					wide: ["Am Faoilleach", "An Gearran", "Am Màrt", "An Giblean", "An Cèitean", "An t-Ògmhios", "An t-Iuchar", "An Lùnastal", "An t-Sultain", "An Dàmhair", "An t-Samhain", "An Dùbhlachd"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["D", "L", "M", "C", "A", "H", "S"],
					short: ["Dò", "Lu", "Mà", "Ci", "Ar", "Ha", "Sa"],
					abbreviated: ["Did", "Dil", "Dim", "Dic", "Dia", "Dih", "Dis"],
					wide: ["Didòmhnaich", "Diluain", "Dimàirt", "Diciadain", "Diardaoin", "Dihaoine", "Disathairne"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "m",
						pm: "f",
						midnight: "m.o.",
						noon: "m.l.",
						morning: "madainn",
						afternoon: "feasgar",
						evening: "feasgar",
						night: "oidhche"
					},
					abbreviated: {
						am: "M.",
						pm: "F.",
						midnight: "meadhan oidhche",
						noon: "meadhan là",
						morning: "madainn",
						afternoon: "feasgar",
						evening: "feasgar",
						night: "oidhche"
					},
					wide: {
						am: "m.",
						pm: "f.",
						midnight: "meadhan oidhche",
						noon: "meadhan là",
						morning: "madainn",
						afternoon: "feasgar",
						evening: "feasgar",
						night: "oidhche"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "m",
						pm: "f",
						midnight: "m.o.",
						noon: "m.l.",
						morning: "sa mhadainn",
						afternoon: "feasgar",
						evening: "feasgar",
						night: "air an oidhche"
					},
					abbreviated: {
						am: "M.",
						pm: "F.",
						midnight: "meadhan oidhche",
						noon: "meadhan là",
						morning: "sa mhadainn",
						afternoon: "feasgar",
						evening: "feasgar",
						night: "air an oidhche"
					},
					wide: {
						am: "m.",
						pm: "f.",
						midnight: "meadhan oidhche",
						noon: "meadhan là",
						morning: "sa mhadainn",
						afternoon: "feasgar",
						evening: "feasgar",
						night: "air an oidhche"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(d|na|tr|mh)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(r|a)/i,
					abbreviated: /^(r\.?\s?c\.?|r\.?\s?a\.?\s?c\.?|a\.?\s?d\.?|a\.?\s?c\.?)/i,
					wide: /^(ro Chrìosta|ron aois choitchinn|anno domini|aois choitcheann)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^b/i, /^(a|c)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^c[1234]/i,
					wide: /^[1234](cd|na|tr|mh)? cairteal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[fgmcòilsd]/i,
					abbreviated: /^(faoi|gear|màrt|gibl|cèit|ògmh|iuch|lùn|sult|dàmh|samh|dùbh)/i,
					wide: /^(am faoilleach|an gearran|am màrt|an giblean|an cèitean|an t-Ògmhios|an t-Iuchar|an lùnastal|an t-Sultain|an dàmhair|an t-Samhain|an dùbhlachd)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^f/i, /^g/i, /^m/i, /^g/i, /^c/i, /^ò/i, /^i/i, /^l/i, /^s/i, /^d/i, /^s/i, /^d/i],
					any: [/^fa/i, /^ge/i, /^mà/i, /^gi/i, /^c/i, /^ò/i, /^i/i, /^l/i, /^su/i, /^d/i, /^sa/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[dlmcahs]/i,
					short: /^(dò|lu|mà|ci|ar|ha|sa)/i,
					abbreviated: /^(did|dil|dim|dic|dia|dih|dis)/i,
					wide: /^(didòmhnaich|diluain|dimàirt|diciadain|diardaoin|dihaoine|disathairne)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^d/i, /^l/i, /^m/i, /^c/i, /^a/i, /^h/i, /^s/i],
					any: [/^d/i, /^l/i, /^m/i, /^c/i, /^a/i, /^h/i, /^s/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|mi|n|(san|aig) (madainn|feasgar|feasgar|oidhche))/i,
					any: /^([ap]\.?\s?m\.?|meadhan oidhche|meadhan là|(san|aig) (madainn|feasgar|feasgar|oidhche))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^m/i,
						pm: /^f/i,
						midnight: /^meadhan oidhche/i,
						noon: /^meadhan là/i,
						morning: /sa mhadainn/i,
						afternoon: /feasgar/i,
						evening: /feasgar/i,
						night: /air an oidhche/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "menos dun segundo",
				other: "menos de {{count}} segundos"
			},
			xSeconds: {
				one: "1 segundo",
				other: "{{count}} segundos"
			},
			halfAMinute: "medio minuto",
			lessThanXMinutes: {
				one: "menos dun minuto",
				other: "menos de {{count}} minutos"
			},
			xMinutes: {
				one: "1 minuto",
				other: "{{count}} minutos"
			},
			aboutXHours: {
				one: "arredor dunha hora",
				other: "arredor de {{count}} horas"
			},
			xHours: {
				one: "1 hora",
				other: "{{count}} horas"
			},
			xDays: {
				one: "1 día",
				other: "{{count}} días"
			},
			aboutXWeeks: {
				one: "arredor dunha semana",
				other: "arredor de {{count}} semanas"
			},
			xWeeks: {
				one: "1 semana",
				other: "{{count}} semanas"
			},
			aboutXMonths: {
				one: "arredor de 1 mes",
				other: "arredor de {{count}} meses"
			},
			xMonths: {
				one: "1 mes",
				other: "{{count}} meses"
			},
			aboutXYears: {
				one: "arredor dun ano",
				other: "arredor de {{count}} anos"
			},
			xYears: {
				one: "1 ano",
				other: "{{count}} anos"
			},
			overXYears: {
				one: "máis dun ano",
				other: "máis de {{count}} anos"
			},
			almostXYears: {
				one: "case un ano",
				other: "case {{count}} anos"
			}
		}),
		yt = {
			date: X({
				formats: {
					full: "EEEE, d 'de' MMMM y",
					long: "d 'de' MMMM y",
					medium: "d MMM y",
					short: "dd/MM/y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'ás' {{time}}",
					long: "{{date}} 'ás' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Mt = {
			lastWeek: "'o' eeee 'pasado á' LT",
			yesterday: "'onte á' p",
			today: "'hoxe á' p",
			tomorrow: "'mañá á' p",
			nextWeek: "eeee 'á' p",
			other: "P"
		},
		kt = {
			lastWeek: "'o' eeee 'pasado ás' p",
			yesterday: "'onte ás' p",
			today: "'hoxe ás' p",
			tomorrow: "'mañá ás' p",
			nextWeek: "eeee 'ás' p",
			other: "P"
		},
		Pt = (_({
				values: {
					narrow: ["AC", "DC"],
					abbreviated: ["AC", "DC"],
					wide: ["antes de cristo", "despois de cristo"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["T1", "T2", "T3", "T4"],
					wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["e", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
					abbreviated: ["xan", "feb", "mar", "abr", "mai", "xun", "xul", "ago", "set", "out", "nov", "dec"],
					wide: ["xaneiro", "febreiro", "marzo", "abril", "maio", "xuño", "xullo", "agosto", "setembro", "outubro", "novembro", "decembro"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["d", "l", "m", "m", "j", "v", "s"],
					short: ["do", "lu", "ma", "me", "xo", "ve", "sa"],
					abbreviated: ["dom", "lun", "mar", "mer", "xov", "ven", "sab"],
					wide: ["domingo", "luns", "martes", "mércores", "xoves", "venres", "sábado"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "mn",
						noon: "md",
						morning: "mañá",
						afternoon: "tarde",
						evening: "tarde",
						night: "noite"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "medianoite",
						noon: "mediodía",
						morning: "mañá",
						afternoon: "tarde",
						evening: "tardiña",
						night: "noite"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "medianoite",
						noon: "mediodía",
						morning: "mañá",
						afternoon: "tarde",
						evening: "tardiña",
						night: "noite"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "mn",
						noon: "md",
						morning: "da mañá",
						afternoon: "da tarde",
						evening: "da tardiña",
						night: "da noite"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "medianoite",
						noon: "mediodía",
						morning: "da mañá",
						afternoon: "da tarde",
						evening: "da tardiña",
						night: "da noite"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "medianoite",
						noon: "mediodía",
						morning: "da mañá",
						afternoon: "da tarde",
						evening: "da tardiña",
						night: "da noite"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(º)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ac|dc|a|d)/i,
					abbreviated: /^(a\.?\s?c\.?|a\.?\s?e\.?\s?c\.?|d\.?\s?c\.?|e\.?\s?c\.?)/i,
					wide: /^(antes de cristo|antes da era com[uú]n|despois de cristo|era com[uú]n)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^ac/i, /^dc/i],
					wide: [/^(antes de cristo|antes da era com[uú]n)/i, /^(despois de cristo|era com[uú]n)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^T[1234]/i,
					wide: /^[1234](º)? trimestre/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[xfmasond]/i,
					abbreviated: /^(xan|feb|mar|abr|mai|xun|xul|ago|set|out|nov|dec)/i,
					wide: /^(xaneiro|febreiro|marzo|abril|maio|xuño|xullo|agosto|setembro|outubro|novembro|decembro)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^x/i, /^f/i, /^m/i, /^a/i, /^m/i, /^x/i, /^x/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^xan/i, /^feb/i, /^mar/i, /^abr/i, /^mai/i, /^xun/i, /^xul/i, /^ago/i, /^set/i, /^out/i, /^nov/i, /^dec/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[dlmxvs]/i,
					short: /^(do|lu|ma|me|xo|ve|sa)/i,
					abbreviated: /^(dom|lun|mar|mer|xov|ven|sab)/i,
					wide: /^(domingo|luns|martes|m[eé]rcores|xoves|venres|s[áa]bado)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^x/i, /^v/i, /^s/i],
					any: [/^do/i, /^lu/i, /^ma/i, /^me/i, /^xo/i, /^ve/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|mn|md|(da|[aá]s) (mañ[aá]|tarde|noite))/i,
					any: /^([ap]\.?\s?m\.?|medianoite|mediod[ií]a|(da|[aá]s) (mañ[aá]|tarde|noite))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^mn/i,
						noon: /^md/i,
						morning: /mañ[aá]/i,
						afternoon: /tarde/i,
						evening: /tardiña/i,
						night: /noite/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "હમણાં",
				other: "​આશરે {{count}} સેકંડ"
			},
			xSeconds: {
				one: "1 સેકંડ",
				other: "{{count}} સેકંડ"
			},
			halfAMinute: "અડધી મિનિટ",
			lessThanXMinutes: {
				one: "આ મિનિટ",
				other: "​આશરે {{count}} મિનિટ"
			},
			xMinutes: {
				one: "1 મિનિટ",
				other: "{{count}} મિનિટ"
			},
			aboutXHours: {
				one: "​આશરે 1 કલાક",
				other: "​આશરે {{count}} કલાક"
			},
			xHours: {
				one: "1 કલાક",
				other: "{{count}} કલાક"
			},
			xDays: {
				one: "1 દિવસ",
				other: "{{count}} દિવસ"
			},
			aboutXWeeks: {
				one: "આશરે 1 અઠવાડિયું",
				other: "આશરે {{count}} અઠવાડિયા"
			},
			xWeeks: {
				one: "1 અઠવાડિયું",
				other: "{{count}} અઠવાડિયા"
			},
			aboutXMonths: {
				one: "આશરે 1 મહિનો",
				other: "આશરે {{count}} મહિના"
			},
			xMonths: {
				one: "1 મહિનો",
				other: "{{count}} મહિના"
			},
			aboutXYears: {
				one: "આશરે 1 વર્ષ",
				other: "આશરે {{count}} વર્ષ"
			},
			xYears: {
				one: "1 વર્ષ",
				other: "{{count}} વર્ષ"
			},
			overXYears: {
				one: "1 વર્ષથી વધુ",
				other: "{{count}} વર્ષથી વધુ"
			},
			almostXYears: {
				one: "લગભગ 1 વર્ષ",
				other: "લગભગ {{count}} વર્ષ"
			}
		}),
		Wt = {
			date: X({
				formats: {
					full: "EEEE, d MMMM, y",
					long: "d MMMM, y",
					medium: "d MMM, y",
					short: "d/M/yy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "hh:mm:ss a zzzz",
					long: "hh:mm:ss a z",
					medium: "hh:mm:ss a",
					short: "hh:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		jt = {
			lastWeek: "'પાછલા' eeee p",
			yesterday: "'ગઈકાલે' p",
			today: "'આજે' p",
			tomorrow: "'આવતીકાલે' p",
			nextWeek: "eeee p",
			other: "P"
		},
		xt = (_({
				values: {
					narrow: ["ઈસપૂ", "ઈસ"],
					abbreviated: ["ઈ.સ.પૂર્વે", "ઈ.સ."],
					wide: ["ઈસવીસન પૂર્વે", "ઈસવીસન"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["1લો ત્રિમાસ", "2જો ત્રિમાસ", "3જો ત્રિમાસ", "4થો ત્રિમાસ"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["જા", "ફે", "મા", "એ", "મે", "જૂ", "જુ", "ઓ", "સ", "ઓ", "ન", "ડિ"],
					abbreviated: ["જાન્યુ", "ફેબ્રુ", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઑગસ્ટ", "સપ્ટે", "ઓક્ટો", "નવે", "ડિસે"],
					wide: ["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઇ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["ર", "સો", "મં", "બુ", "ગુ", "શુ", "શ"],
					short: ["ર", "સો", "મં", "બુ", "ગુ", "શુ", "શ"],
					abbreviated: ["રવિ", "સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ"],
					wide: ["રવિવાર", "સોમવાર", "મંગળવાર", "બુધવાર", "ગુરુવાર", "શુક્રવાર", "શનિવાર"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "મ.રાત્રિ",
						noon: "બ.",
						morning: "સવારે",
						afternoon: "બપોરે",
						evening: "સાંજે",
						night: "રાત્રે"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "​મધ્યરાત્રિ",
						noon: "બપોરે",
						morning: "સવારે",
						afternoon: "બપોરે",
						evening: "સાંજે",
						night: "રાત્રે"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "​મધ્યરાત્રિ",
						noon: "બપોરે",
						morning: "સવારે",
						afternoon: "બપોરે",
						evening: "સાંજે",
						night: "રાત્રે"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "મ.રાત્રિ",
						noon: "બપોરે",
						morning: "સવારે",
						afternoon: "બપોરે",
						evening: "સાંજે",
						night: "રાત્રે"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "મધ્યરાત્રિ",
						noon: "બપોરે",
						morning: "સવારે",
						afternoon: "બપોરે",
						evening: "સાંજે",
						night: "રાત્રે"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "​મધ્યરાત્રિ",
						noon: "બપોરે",
						morning: "સવારે",
						afternoon: "બપોરે",
						evening: "સાંજે",
						night: "રાત્રે"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(લ|જ|થ|ઠ્ઠ|મ)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ઈસપૂ|ઈસ)/i,
					abbreviated: /^(ઈ\.સ\.પૂર્વે|ઈ\.સ\.)/i,
					wide: /^(ઈસવીસન\sપૂર્વે|ઈસવીસન)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^ઈસપૂ/i, /^ઈસ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234](લો|જો|થો)? ત્રિમાસ/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[જાફેમાએમેજૂજુઓસઓનડિ]/i,
					abbreviated: /^(જાન્યુ|ફેબ્રુ|માર્ચ|એપ્રિલ|મે|જૂન|જુલાઈ|ઑગસ્ટ|સપ્ટે|ઓક્ટો|નવે|ડિસે)/i,
					wide: /^(જાન્યુઆરી|ફેબ્રુઆરી|માર્ચ|એપ્રિલ|મે|જૂન|જુલાઇ|ઓગસ્ટ|સપ્ટેમ્બર|ઓક્ટોબર|નવેમ્બર|ડિસેમ્બર)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^જા/i, /^ફે/i, /^મા/i, /^એ/i, /^મે/i, /^જૂ/i, /^જુ/i, /^ઑગ/i, /^સ/i, /^ઓક્ટો/i, /^ન/i, /^ડિ/i],
					any: [/^જા/i, /^ફે/i, /^મા/i, /^એ/i, /^મે/i, /^જૂ/i, /^જુ/i, /^ઑગ/i, /^સ/i, /^ઓક્ટો/i, /^ન/i, /^ડિ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(ર|સો|મં|બુ|ગુ|શુ|શ)/i,
					short: /^(ર|સો|મં|બુ|ગુ|શુ|શ)/i,
					abbreviated: /^(રવિ|સોમ|મંગળ|બુધ|ગુરુ|શુક્ર|શનિ)/i,
					wide: /^(રવિવાર|સોમવાર|મંગળવાર|બુધવાર|ગુરુવાર|શુક્રવાર|શનિવાર)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ર/i, /^સો/i, /^મં/i, /^બુ/i, /^ગુ/i, /^શુ/i, /^શ/i],
					any: [/^ર/i, /^સો/i, /^મં/i, /^બુ/i, /^ગુ/i, /^શુ/i, /^શ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|મ\.?|સ|બ|સાં|રા)/i,
					any: /^(a|p|મ\.?|સ|બ|સાં|રા)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^મ\.?/i,
						noon: /^બ/i,
						morning: /સ/i,
						afternoon: /બ/i,
						evening: /સાં/i,
						night: /રા/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "פחות משנייה",
				two: "פחות משתי שניות",
				other: "פחות מ־{{count}} שניות"
			},
			xSeconds: {
				one: "שנייה",
				two: "שתי שניות",
				other: "{{count}} שניות"
			},
			halfAMinute: "חצי דקה",
			lessThanXMinutes: {
				one: "פחות מדקה",
				two: "פחות משתי דקות",
				other: "פחות מ־{{count}} דקות"
			},
			xMinutes: {
				one: "דקה",
				two: "שתי דקות",
				other: "{{count}} דקות"
			},
			aboutXHours: {
				one: "כשעה",
				two: "כשעתיים",
				other: "כ־{{count}} שעות"
			},
			xHours: {
				one: "שעה",
				two: "שעתיים",
				other: "{{count}} שעות"
			},
			xDays: {
				one: "יום",
				two: "יומיים",
				other: "{{count}} ימים"
			},
			aboutXWeeks: {
				one: "כשבוע",
				two: "כשבועיים",
				other: "כ־{{count}} שבועות"
			},
			xWeeks: {
				one: "שבוע",
				two: "שבועיים",
				other: "{{count}} שבועות"
			},
			aboutXMonths: {
				one: "כחודש",
				two: "כחודשיים",
				other: "כ־{{count}} חודשים"
			},
			xMonths: {
				one: "חודש",
				two: "חודשיים",
				other: "{{count}} חודשים"
			},
			aboutXYears: {
				one: "כשנה",
				two: "כשנתיים",
				other: "כ־{{count}} שנים"
			},
			xYears: {
				one: "שנה",
				two: "שנתיים",
				other: "{{count}} שנים"
			},
			overXYears: {
				one: "יותר משנה",
				two: "יותר משנתיים",
				other: "יותר מ־{{count}} שנים"
			},
			almostXYears: {
				one: "כמעט שנה",
				two: "כמעט שנתיים",
				other: "כמעט {{count}} שנים"
			}
		}),
		zt = {
			date: X({
				formats: {
					full: "EEEE, d בMMMM y",
					long: "d בMMMM y",
					medium: "d בMMM y",
					short: "d.M.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'בשעה' {{time}}",
					long: "{{date}} 'בשעה' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Tt = {
			lastWeek: "eeee 'שעבר בשעה' p",
			yesterday: "'אתמול בשעה' p",
			today: "'היום בשעה' p",
			tomorrow: "'מחר בשעה' p",
			nextWeek: "eeee 'בשעה' p",
			other: "P"
		},
		Et = {
			ordinalNumber: (e, t) => {
				const n = Number(e);
				if (n <= 0 || n > 10)
					return String(n);
				const a = String(t?.unit),
				i = n - 1;
				return ["year", "hour", "minute", "second"].indexOf(a) >= 0 ? ["ראשונה", "שנייה", "שלישית", "רביעית", "חמישית", "שישית", "שביעית", "שמינית", "תשיעית", "עשירית"][i] : ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי", "שמיני", "תשיעי", "עשירי"][i]
			},
			era: _({
				values: {
					narrow: ["לפנה״ס", "לספירה"],
					abbreviated: ["לפנה״ס", "לספירה"],
					wide: ["לפני הספירה", "לספירה"]
				},
				defaultWidth: "wide"
			}),
			quarter: _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["רבעון 1", "רבעון 2", "רבעון 3", "רבעון 4"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}),
			month: _({
				values: {
					narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
					abbreviated: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"],
					wide: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]
				},
				defaultWidth: "wide"
			}),
			day: _({
				values: {
					narrow: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
					short: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
					abbreviated: ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳", "שבת"],
					wide: ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"]
				},
				defaultWidth: "wide"
			}),
			dayPeriod: _({
				values: {
					narrow: {
						am: "לפנה״צ",
						pm: "אחה״צ",
						midnight: "חצות",
						noon: "צהריים",
						morning: "בוקר",
						afternoon: "אחר הצהריים",
						evening: "ערב",
						night: "לילה"
					},
					abbreviated: {
						am: "לפנה״צ",
						pm: "אחה״צ",
						midnight: "חצות",
						noon: "צהריים",
						morning: "בוקר",
						afternoon: "אחר הצהריים",
						evening: "ערב",
						night: "לילה"
					},
					wide: {
						am: "לפנה״צ",
						pm: "אחה״צ",
						midnight: "חצות",
						noon: "צהריים",
						morning: "בוקר",
						afternoon: "אחר הצהריים",
						evening: "ערב",
						night: "לילה"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "לפנה״צ",
						pm: "אחה״צ",
						midnight: "חצות",
						noon: "צהריים",
						morning: "בבוקר",
						afternoon: "בצהריים",
						evening: "בערב",
						night: "בלילה"
					},
					abbreviated: {
						am: "לפנה״צ",
						pm: "אחה״צ",
						midnight: "חצות",
						noon: "צהריים",
						morning: "בבוקר",
						afternoon: "אחר הצהריים",
						evening: "בערב",
						night: "בלילה"
					},
					wide: {
						am: "לפנה״צ",
						pm: "אחה״צ",
						midnight: "חצות",
						noon: "צהריים",
						morning: "בבוקר",
						afternoon: "אחר הצהריים",
						evening: "בערב",
						night: "בלילה"
					}
				},
				defaultFormattingWidth: "wide"
			})
		},
		St = ["רא", "שנ", "של", "רב", "ח", "שי", "שב", "שמ", "ת", "ע"],
		Ct = (F({
				matchPattern: /^(\d+|(ראשון|שני|שלישי|רביעי|חמישי|שישי|שביעי|שמיני|תשיעי|עשירי|ראשונה|שנייה|שלישית|רביעית|חמישית|שישית|שביעית|שמינית|תשיעית|עשירית))/i,
				parsePattern: /^(\d+|רא|שנ|של|רב|ח|שי|שב|שמ|ת|ע)/i,
				valueCallback: e => {
					const t = parseInt(e, 10);
					return isNaN(t) ? St.indexOf(e) + 1 : t
				}
			}), G({
				matchPatterns: {
					narrow: /^ל(ספירה|פנה״ס)/i,
					abbreviated: /^ל(ספירה|פנה״ס)/i,
					wide: /^ל(פני ה)?ספירה/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^לפ/i, /^לס/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^רבעון [1234]/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^\d+/i,
					abbreviated: /^(ינו|פבר|מרץ|אפר|מאי|יוני|יולי|אוג|ספט|אוק|נוב|דצמ)׳?/i,
					wide: /^(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^1$/i, /^2/i, /^3/i, /^4/i, /^5/i, /^6/i, /^7/i, /^8/i, /^9/i, /^10/i, /^11/i, /^12/i],
					any: [/^ינ/i, /^פ/i, /^מר/i, /^אפ/i, /^מא/i, /^יונ/i, /^יול/i, /^אוג/i, /^ס/i, /^אוק/i, /^נ/i, /^ד/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[אבגדהוש]׳/i,
					short: /^[אבגדהוש]׳/i,
					abbreviated: /^(שבת|יום (א|ב|ג|ד|ה|ו)׳)/i,
					wide: /^יום (ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					abbreviated: [/א׳$/i, /ב׳$/i, /ג׳$/i, /ד׳$/i, /ה׳$/i, /ו׳$/i, /^ש/i],
					wide: [/ן$/i, /ני$/i, /לישי$/i, /עי$/i, /מישי$/i, /שישי$/i, /ת$/i],
					any: [/^א/i, /^ב/i, /^ג/i, /^ד/i, /^ה/i, /^ו/i, /^ש/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(אחר ה|ב)?(חצות|צהריים|בוקר|ערב|לילה|אחה״צ|לפנה״צ)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^לפ/i,
						pm: /^אחה/i,
						midnight: /^ח/i,
						noon: /^צ/i,
						morning: /בוקר/i,
						afternoon: /בצ|אחר/i,
						evening: /ערב/i,
						night: /לילה/i
					}
				},
				defaultParseWidth: "any"
			}), {
			locale: {
				1: "१",
				2: "२",
				3: "३",
				4: "४",
				5: "५",
				6: "६",
				7: "७",
				8: "८",
				9: "९",
				0: "०"
			},
			number: {
				"१": "1",
				"२": "2",
				"३": "3",
				"४": "4",
				"५": "5",
				"६": "6",
				"७": "7",
				"८": "8",
				"९": "9",
				"०": "0"
			}
		});

		function At(e) {
			return e.toString().replace(/\d/g, (function (e) {
					return Ct.locale[e]
				}))
		}
		_({
			values: {
				narrow: ["ईसा-पूर्व", "ईस्वी"],
				abbreviated: ["ईसा-पूर्व", "ईस्वी"],
				wide: ["ईसा-पूर्व", "ईसवी सन"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["ति1", "ति2", "ति3", "ति4"],
				wide: ["पहली तिमाही", "दूसरी तिमाही", "तीसरी तिमाही", "चौथी तिमाही"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["ज", "फ़", "मा", "अ", "मई", "जू", "जु", "अग", "सि", "अक्टू", "न", "दि"],
				abbreviated: ["जन", "फ़र", "मार्च", "अप्रैल", "मई", "जून", "जुल", "अग", "सित", "अक्टू", "नव", "दिस"],
				wide: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
				short: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
				abbreviated: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
				wide: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "पूर्वाह्न",
					pm: "अपराह्न",
					midnight: "मध्यरात्रि",
					noon: "दोपहर",
					morning: "सुबह",
					afternoon: "दोपहर",
					evening: "शाम",
					night: "रात"
				},
				abbreviated: {
					am: "पूर्वाह्न",
					pm: "अपराह्न",
					midnight: "मध्यरात्रि",
					noon: "दोपहर",
					morning: "सुबह",
					afternoon: "दोपहर",
					evening: "शाम",
					night: "रात"
				},
				wide: {
					am: "पूर्वाह्न",
					pm: "अपराह्न",
					midnight: "मध्यरात्रि",
					noon: "दोपहर",
					morning: "सुबह",
					afternoon: "दोपहर",
					evening: "शाम",
					night: "रात"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "पूर्वाह्न",
					pm: "अपराह्न",
					midnight: "मध्यरात्रि",
					noon: "दोपहर",
					morning: "सुबह",
					afternoon: "दोपहर",
					evening: "शाम",
					night: "रात"
				},
				abbreviated: {
					am: "पूर्वाह्न",
					pm: "अपराह्न",
					midnight: "मध्यरात्रि",
					noon: "दोपहर",
					morning: "सुबह",
					afternoon: "दोपहर",
					evening: "शाम",
					night: "रात"
				},
				wide: {
					am: "पूर्वाह्न",
					pm: "अपराह्न",
					midnight: "मध्यरात्रि",
					noon: "दोपहर",
					morning: "सुबह",
					afternoon: "दोपहर",
					evening: "शाम",
					night: "रात"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		X({
			formats: {
				full: "EEEE, do MMMM, y",
				long: "do MMMM, y",
				medium: "d MMM, y",
				short: "dd/MM/yyyy"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "h:mm:ss a zzzz",
				long: "h:mm:ss a z",
				medium: "h:mm:ss a",
				short: "h:mm a"
			},
			defaultWidth: "full"
		}),
		X({
			formats: {
				full: "{{date}} 'को' {{time}}",
				long: "{{date}} 'को' {{time}}",
				medium: "{{date}}, {{time}}",
				short: "{{date}}, {{time}}"
			},
			defaultWidth: "full"
		}),
		F({
			matchPattern: /^[०१२३४५६७८९]+/i,
			parsePattern: /^[०१२३४५६७८९]+/i,
			valueCallback: function (e) {
				const t = e.toString().replace(/[१२३४५६७८९०]/g, (function (e) {
							return Ct.number[e]
						}));
				return Number(t)
			}
		}),
		G({
			matchPatterns: {
				narrow: /^(ईसा-पूर्व|ईस्वी)/i,
				abbreviated: /^(ईसा\.?\s?पूर्व\.?|ईसा\.?)/i,
				wide: /^(ईसा-पूर्व|ईसवी पूर्व|ईसवी सन|ईसवी)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^b/i, /^(a|c)/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^ति[1234]/i,
				wide: /^[1234](पहली|दूसरी|तीसरी|चौथी)? तिमाही/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[जफ़माअप्मईजूनजुअगसिअक्तनदि]/i,
				abbreviated: /^(जन|फ़र|मार्च|अप्|मई|जून|जुल|अग|सित|अक्तू|नव|दिस)/i,
				wide: /^(जनवरी|फ़रवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्तूबर|नवंबर|दिसंबर)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^ज/i, /^फ़/i, /^मा/i, /^अप्/i, /^मई/i, /^जू/i, /^जु/i, /^अग/i, /^सि/i, /^अक्तू/i, /^न/i, /^दि/i],
				any: [/^जन/i, /^फ़/i, /^मा/i, /^अप्/i, /^मई/i, /^जू/i, /^जु/i, /^अग/i, /^सि/i, /^अक्तू/i, /^नव/i, /^दिस/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[रविसोममंगलबुधगुरुशुक्रशनि]/i,
				short: /^(रवि|सोम|मंगल|बुध|गुरु|शुक्र|शनि)/i,
				abbreviated: /^(रवि|सोम|मंगल|बुध|गुरु|शुक्र|शनि)/i,
				wide: /^(रविवार|सोमवार|मंगलवार|बुधवार|गुरुवार|शुक्रवार|शनिवार)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^रवि/i, /^सोम/i, /^मंगल/i, /^बुध/i, /^गुरु/i, /^शुक्र/i, /^शनि/i],
				any: [/^रवि/i, /^सोम/i, /^मंगल/i, /^बुध/i, /^गुरु/i, /^शुक्र/i, /^शनि/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(पू|अ|म|द.\?|सु|दो|शा|रा)/i,
				any: /^(पूर्वाह्न|अपराह्न|म|द.\?|सु|दो|शा|रा)/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^पूर्वाह्न/i,
					pm: /^अपराह्न/i,
					midnight: /^मध्य/i,
					noon: /^दो/i,
					morning: /सु/i,
					afternoon: /दो/i,
					evening: /शा/i,
					night: /रा/i
				}
			},
			defaultParseWidth: "any"
		});
		const Ht = {
			lessThanXSeconds: {
				one: {
					standalone: "manje od 1 sekunde",
					withPrepositionAgo: "manje od 1 sekunde",
					withPrepositionIn: "manje od 1 sekundu"
				},
				dual: "manje od {{count}} sekunde",
				other: "manje od {{count}} sekundi"
			},
			xSeconds: {
				one: {
					standalone: "1 sekunda",
					withPrepositionAgo: "1 sekunde",
					withPrepositionIn: "1 sekundu"
				},
				dual: "{{count}} sekunde",
				other: "{{count}} sekundi"
			},
			halfAMinute: "pola minute",
			lessThanXMinutes: {
				one: {
					standalone: "manje od 1 minute",
					withPrepositionAgo: "manje od 1 minute",
					withPrepositionIn: "manje od 1 minutu"
				},
				dual: "manje od {{count}} minute",
				other: "manje od {{count}} minuta"
			},
			xMinutes: {
				one: {
					standalone: "1 minuta",
					withPrepositionAgo: "1 minute",
					withPrepositionIn: "1 minutu"
				},
				dual: "{{count}} minute",
				other: "{{count}} minuta"
			},
			aboutXHours: {
				one: {
					standalone: "oko 1 sat",
					withPrepositionAgo: "oko 1 sat",
					withPrepositionIn: "oko 1 sat"
				},
				dual: "oko {{count}} sata",
				other: "oko {{count}} sati"
			},
			xHours: {
				one: {
					standalone: "1 sat",
					withPrepositionAgo: "1 sat",
					withPrepositionIn: "1 sat"
				},
				dual: "{{count}} sata",
				other: "{{count}} sati"
			},
			xDays: {
				one: {
					standalone: "1 dan",
					withPrepositionAgo: "1 dan",
					withPrepositionIn: "1 dan"
				},
				dual: "{{count}} dana",
				other: "{{count}} dana"
			},
			aboutXWeeks: {
				one: {
					standalone: "oko 1 tjedan",
					withPrepositionAgo: "oko 1 tjedan",
					withPrepositionIn: "oko 1 tjedan"
				},
				dual: "oko {{count}} tjedna",
				other: "oko {{count}} tjedana"
			},
			xWeeks: {
				one: {
					standalone: "1 tjedan",
					withPrepositionAgo: "1 tjedan",
					withPrepositionIn: "1 tjedan"
				},
				dual: "{{count}} tjedna",
				other: "{{count}} tjedana"
			},
			aboutXMonths: {
				one: {
					standalone: "oko 1 mjesec",
					withPrepositionAgo: "oko 1 mjesec",
					withPrepositionIn: "oko 1 mjesec"
				},
				dual: "oko {{count}} mjeseca",
				other: "oko {{count}} mjeseci"
			},
			xMonths: {
				one: {
					standalone: "1 mjesec",
					withPrepositionAgo: "1 mjesec",
					withPrepositionIn: "1 mjesec"
				},
				dual: "{{count}} mjeseca",
				other: "{{count}} mjeseci"
			},
			aboutXYears: {
				one: {
					standalone: "oko 1 godinu",
					withPrepositionAgo: "oko 1 godinu",
					withPrepositionIn: "oko 1 godinu"
				},
				dual: "oko {{count}} godine",
				other: "oko {{count}} godina"
			},
			xYears: {
				one: {
					standalone: "1 godina",
					withPrepositionAgo: "1 godine",
					withPrepositionIn: "1 godinu"
				},
				dual: "{{count}} godine",
				other: "{{count}} godina"
			},
			overXYears: {
				one: {
					standalone: "preko 1 godinu",
					withPrepositionAgo: "preko 1 godinu",
					withPrepositionIn: "preko 1 godinu"
				},
				dual: "preko {{count}} godine",
				other: "preko {{count}} godina"
			},
			almostXYears: {
				one: {
					standalone: "gotovo 1 godinu",
					withPrepositionAgo: "gotovo 1 godinu",
					withPrepositionIn: "gotovo 1 godinu"
				},
				dual: "gotovo {{count}} godine",
				other: "gotovo {{count}} godina"
			}
		},
		Nt = {
			date: X({
				formats: {
					full: "EEEE, d. MMMM y.",
					long: "d. MMMM y.",
					medium: "d. MMM y.",
					short: "dd. MM. y."
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss (zzzz)",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'u' {{time}}",
					long: "{{date}} 'u' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Xt = {
			lastWeek: e => {
				switch (e.getDay()) {
				case 0:
					return "'prošlu nedjelju u' p";
				case 3:
					return "'prošlu srijedu u' p";
				case 6:
					return "'prošlu subotu u' p";
				default:
					return "'prošli' EEEE 'u' p"
				}
			},
			yesterday: "'jučer u' p",
			today: "'danas u' p",
			tomorrow: "'sutra u' p",
			nextWeek: e => {
				switch (e.getDay()) {
				case 0:
					return "'iduću nedjelju u' p";
				case 3:
					return "'iduću srijedu u' p";
				case 6:
					return "'iduću subotu u' p";
				default:
					return "'prošli' EEEE 'u' p"
				}
			},
			other: "P"
		},
		It = (_({
				values: {
					narrow: ["pr.n.e.", "AD"],
					abbreviated: ["pr. Kr.", "po. Kr."],
					wide: ["Prije Krista", "Poslije Krista"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1.", "2.", "3.", "4."],
					abbreviated: ["1. kv.", "2. kv.", "3. kv.", "4. kv."],
					wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."],
					abbreviated: ["sij", "velj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro"],
					wide: ["siječanj", "veljača", "ožujak", "travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."],
					abbreviated: ["sij", "velj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro"],
					wide: ["siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja", "srpnja", "kolovoza", "rujna", "listopada", "studenog", "prosinca"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["N", "P", "U", "S", "Č", "P", "S"],
					short: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"],
					abbreviated: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"],
					wide: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutro",
						afternoon: "popodne",
						evening: "navečer",
						night: "noću"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutro",
						afternoon: "popodne",
						evening: "navečer",
						night: "noću"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutro",
						afternoon: "poslije podne",
						evening: "navečer",
						night: "noću"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutro",
						afternoon: "popodne",
						evening: "navečer",
						night: "noću"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutro",
						afternoon: "popodne",
						evening: "navečer",
						night: "noću"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutro",
						afternoon: "poslije podne",
						evening: "navečer",
						night: "noću"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)\./i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(pr\.n\.e\.|AD)/i,
					abbreviated: /^(pr\.\s?Kr\.|po\.\s?Kr\.)/i,
					wide: /^(Prije Krista|prije nove ere|Poslije Krista|nova era)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^pr/i, /^(po|nova)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234]\.\s?kv\.?/i,
					wide: /^[1234]\. kvartal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(10|11|12|[123456789])\./i,
					abbreviated: /^(sij|velj|(ožu|ozu)|tra|svi|lip|srp|kol|ruj|lis|stu|pro)/i,
					wide: /^((siječanj|siječnja|sijecanj|sijecnja)|(veljača|veljače|veljaca|veljace)|(ožujak|ožujka|ozujak|ozujka)|(travanj|travnja)|(svibanj|svibnja)|(lipanj|lipnja)|(srpanj|srpnja)|(kolovoz|kolovoza)|(rujan|rujna)|(listopad|listopada)|(studeni|studenog)|(prosinac|prosinca))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/1/i, /2/i, /3/i, /4/i, /5/i, /6/i, /7/i, /8/i, /9/i, /10/i, /11/i, /12/i],
					abbreviated: [/^sij/i, /^velj/i, /^(ožu|ozu)/i, /^tra/i, /^svi/i, /^lip/i, /^srp/i, /^kol/i, /^ruj/i, /^lis/i, /^stu/i, /^pro/i],
					wide: [/^sij/i, /^velj/i, /^(ožu|ozu)/i, /^tra/i, /^svi/i, /^lip/i, /^srp/i, /^kol/i, /^ruj/i, /^lis/i, /^stu/i, /^pro/i]
				},
				defaultParseWidth: "wide"
			}), G({
				matchPatterns: {
					narrow: /^[npusčc]/i,
					short: /^(ned|pon|uto|sri|(čet|cet)|pet|sub)/i,
					abbreviated: /^(ned|pon|uto|sri|(čet|cet)|pet|sub)/i,
					wide: /^(nedjelja|ponedjeljak|utorak|srijeda|(četvrtak|cetvrtak)|petak|subota)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
					any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(am|pm|ponoc|ponoć|(po)?podne|navecer|navečer|noću|poslije podne|ujutro)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^pono/i,
						noon: /^pod/i,
						morning: /jutro/i,
						afternoon: /(poslije\s|po)+podne/i,
						evening: /(navece|naveče)/i,
						night: /(nocu|noću)/i
					}
				},
				defaultParseWidth: "any"
			}), {
			about: "körülbelül",
			over: "több mint",
			almost: "majdnem",
			lessthan: "kevesebb mint"
		}),
		Dt = {
			xseconds: " másodperc",
			halfaminute: "fél perc",
			xminutes: " perc",
			xhours: " óra",
			xdays: " nap",
			xweeks: " hét",
			xmonths: " hónap",
			xyears: " év"
		},
		_t = {
			xseconds: {
				"-1": " másodperccel ezelőtt",
				1: " másodperc múlva",
				0: " másodperce"
			},
			halfaminute: {
				"-1": "fél perccel ezelőtt",
				1: "fél perc múlva",
				0: "fél perce"
			},
			xminutes: {
				"-1": " perccel ezelőtt",
				1: " perc múlva",
				0: " perce"
			},
			xhours: {
				"-1": " órával ezelőtt",
				1: " óra múlva",
				0: " órája"
			},
			xdays: {
				"-1": " nappal ezelőtt",
				1: " nap múlva",
				0: " napja"
			},
			xweeks: {
				"-1": " héttel ezelőtt",
				1: " hét múlva",
				0: " hete"
			},
			xmonths: {
				"-1": " hónappal ezelőtt",
				1: " hónap múlva",
				0: " hónapja"
			},
			xyears: {
				"-1": " évvel ezelőtt",
				1: " év múlva",
				0: " éve"
			}
		},
		Gt = {
			date: X({
				formats: {
					full: "y. MMMM d., EEEE",
					long: "y. MMMM d.",
					medium: "y. MMM d.",
					short: "y. MM. dd."
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Ft = ["vasárnap", "hétfőn", "kedden", "szerdán", "csütörtökön", "pénteken", "szombaton"];

		function Ot(e) {
			return t => {
				const n = Ft[t.getDay()];
				return `${e ? "" : "'múlt' "}'${n}' p'-kor'`
			}
		}
		const Yt = {
			lastWeek: Ot(!1),
			yesterday: "'tegnap' p'-kor'",
			today: "'ma' p'-kor'",
			tomorrow: "'holnap' p'-kor'",
			nextWeek: Ot(!0),
			other: "P"
		},
		$t = (_({
				values: {
					narrow: ["ie.", "isz."],
					abbreviated: ["i. e.", "i. sz."],
					wide: ["Krisztus előtt", "időszámításunk szerint"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1.", "2.", "3.", "4."],
					abbreviated: ["1. n.év", "2. n.év", "3. n.év", "4. n.év"],
					wide: ["1. negyedév", "2. negyedév", "3. negyedév", "4. negyedév"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1,
				formattingValues: {
					narrow: ["I.", "II.", "III.", "IV."],
					abbreviated: ["I. n.év", "II. n.év", "III. n.év", "IV. n.év"],
					wide: ["I. negyedév", "II. negyedév", "III. negyedév", "IV. negyedév"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["J", "F", "M", "Á", "M", "J", "J", "A", "Sz", "O", "N", "D"],
					abbreviated: ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."],
					wide: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["V", "H", "K", "Sz", "Cs", "P", "Sz"],
					short: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
					abbreviated: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
					wide: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "de.",
						pm: "du.",
						midnight: "éjfél",
						noon: "dél",
						morning: "reggel",
						afternoon: "du.",
						evening: "este",
						night: "éjjel"
					},
					abbreviated: {
						am: "de.",
						pm: "du.",
						midnight: "éjfél",
						noon: "dél",
						morning: "reggel",
						afternoon: "du.",
						evening: "este",
						night: "éjjel"
					},
					wide: {
						am: "de.",
						pm: "du.",
						midnight: "éjfél",
						noon: "dél",
						morning: "reggel",
						afternoon: "délután",
						evening: "este",
						night: "éjjel"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)\.?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ie\.|isz\.)/i,
					abbreviated: /^(i\.\s?e\.?|b?\s?c\s?e|i\.\s?sz\.?)/i,
					wide: /^(Krisztus előtt|időszámításunk előtt|időszámításunk szerint|i\. sz\.)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/ie/i, /isz/i],
					abbreviated: [/^(i\.?\s?e\.?|b\s?ce)/i, /^(i\.?\s?sz\.?|c\s?e)/i],
					any: [/előtt/i, /(szerint|i. sz.)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]\.?/i,
					abbreviated: /^[1234]?\.?\s?n\.év/i,
					wide: /^([1234]|I|II|III|IV)?\.?\s?negyedév/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1|I$/i, /2|II$/i, /3|III/i, /4|IV/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmaásond]|sz/i,
					abbreviated: /^(jan\.?|febr\.?|márc\.?|ápr\.?|máj\.?|jún\.?|júl\.?|aug\.?|szept\.?|okt\.?|nov\.?|dec\.?)/i,
					wide: /^(január|február|március|április|május|június|július|augusztus|szeptember|október|november|december)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a|á/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s|sz/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^már/i, /^áp/i, /^máj/i, /^jún/i, /^júl/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^([vhkpc]|sz|cs|sz)/i,
					short: /^([vhkp]|sze|cs|szo)/i,
					abbreviated: /^([vhkp]|sze|cs|szo)/i,
					wide: /^(vasárnap|hétfő|kedd|szerda|csütörtök|péntek|szombat)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^v/i, /^h/i, /^k/i, /^sz/i, /^c/i, /^p/i, /^sz/i],
					any: [/^v/i, /^h/i, /^k/i, /^sze/i, /^c/i, /^p/i, /^szo/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^((de|du)\.?|éjfél|délután|dél|reggel|este|éjjel)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^de\.?/i,
						pm: /^du\.?/i,
						midnight: /^éjf/i,
						noon: /^dé/i,
						morning: /reg/i,
						afternoon: /^délu\.?/i,
						evening: /es/i,
						night: /éjj/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "ավելի քիչ քան 1 վայրկյան",
				other: "ավելի քիչ քան {{count}} վայրկյան"
			},
			xSeconds: {
				one: "1 վայրկյան",
				other: "{{count}} վայրկյան"
			},
			halfAMinute: "կես րոպե",
			lessThanXMinutes: {
				one: "ավելի քիչ քան 1 րոպե",
				other: "ավելի քիչ քան {{count}} րոպե"
			},
			xMinutes: {
				one: "1 րոպե",
				other: "{{count}} րոպե"
			},
			aboutXHours: {
				one: "մոտ 1 ժամ",
				other: "մոտ {{count}} ժամ"
			},
			xHours: {
				one: "1 ժամ",
				other: "{{count}} ժամ"
			},
			xDays: {
				one: "1 օր",
				other: "{{count}} օր"
			},
			aboutXWeeks: {
				one: "մոտ 1 շաբաթ",
				other: "մոտ {{count}} շաբաթ"
			},
			xWeeks: {
				one: "1 շաբաթ",
				other: "{{count}} շաբաթ"
			},
			aboutXMonths: {
				one: "մոտ 1 ամիս",
				other: "մոտ {{count}} ամիս"
			},
			xMonths: {
				one: "1 ամիս",
				other: "{{count}} ամիս"
			},
			aboutXYears: {
				one: "մոտ 1 տարի",
				other: "մոտ {{count}} տարի"
			},
			xYears: {
				one: "1 տարի",
				other: "{{count}} տարի"
			},
			overXYears: {
				one: "ավելի քան 1 տարի",
				other: "ավելի քան {{count}} տարի"
			},
			almostXYears: {
				one: "համարյա 1 տարի",
				other: "համարյա {{count}} տարի"
			}
		}),
		Kt = {
			date: X({
				formats: {
					full: "d MMMM, y, EEEE",
					long: "d MMMM, y",
					medium: "d MMM, y",
					short: "dd.MM.yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'ժ․'{{time}}",
					long: "{{date}} 'ժ․'{{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Jt = {
			lastWeek: "'նախորդ' eeee p'֊ին'",
			yesterday: "'երեկ' p'֊ին'",
			today: "'այսօր' p'֊ին'",
			tomorrow: "'վաղը' p'֊ին'",
			nextWeek: "'հաջորդ' eeee p'֊ին'",
			other: "P"
		},
		Vt = (_({
				values: {
					narrow: ["Ք", "Մ"],
					abbreviated: ["ՔԱ", "ՄԹ"],
					wide: ["Քրիստոսից առաջ", "Մեր թվարկության"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Ք1", "Ք2", "Ք3", "Ք4"],
					wide: ["1֊ին քառորդ", "2֊րդ քառորդ", "3֊րդ քառորդ", "4֊րդ քառորդ"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["Հ", "Փ", "Մ", "Ա", "Մ", "Հ", "Հ", "Օ", "Ս", "Հ", "Ն", "Դ"],
					abbreviated: ["հուն", "փետ", "մար", "ապր", "մայ", "հուն", "հուլ", "օգս", "սեպ", "հոկ", "նոյ", "դեկ"],
					wide: ["հունվար", "փետրվար", "մարտ", "ապրիլ", "մայիս", "հունիս", "հուլիս", "օգոստոս", "սեպտեմբեր", "հոկտեմբեր", "նոյեմբեր", "դեկտեմբեր"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["Կ", "Ե", "Ե", "Չ", "Հ", "Ո", "Շ"],
					short: ["կր", "եր", "եք", "չք", "հգ", "ուր", "շբ"],
					abbreviated: ["կիր", "երկ", "երք", "չոր", "հնգ", "ուրբ", "շաբ"],
					wide: ["կիրակի", "երկուշաբթի", "երեքշաբթի", "չորեքշաբթի", "հինգշաբթի", "ուրբաթ", "շաբաթ"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "կեսգշ",
						noon: "կեսօր",
						morning: "առավոտ",
						afternoon: "ցերեկ",
						evening: "երեկո",
						night: "գիշեր"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "կեսգիշեր",
						noon: "կեսօր",
						morning: "առավոտ",
						afternoon: "ցերեկ",
						evening: "երեկո",
						night: "գիշեր"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "կեսգիշեր",
						noon: "կեսօր",
						morning: "առավոտ",
						afternoon: "ցերեկ",
						evening: "երեկո",
						night: "գիշեր"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "կեսգշ",
						noon: "կեսօր",
						morning: "առավոտը",
						afternoon: "ցերեկը",
						evening: "երեկոյան",
						night: "գիշերը"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "կեսգիշերին",
						noon: "կեսօրին",
						morning: "առավոտը",
						afternoon: "ցերեկը",
						evening: "երեկոյան",
						night: "գիշերը"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "կեսգիշերին",
						noon: "կեսօրին",
						morning: "առավոտը",
						afternoon: "ցերեկը",
						evening: "երեկոյան",
						night: "գիշերը"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)((-|֊)?(ին|րդ))?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(Ք|Մ)/i,
					abbreviated: /^(Ք\.?\s?Ա\.?|Մ\.?\s?Թ\.?\s?Ա\.?|Մ\.?\s?Թ\.?|Ք\.?\s?Հ\.?)/i,
					wide: /^(քրիստոսից առաջ|մեր թվարկությունից առաջ|մեր թվարկության|քրիստոսից հետո)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^ք/i, /^մ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^ք[1234]/i,
					wide: /^[1234]((-|֊)?(ին|րդ)) քառորդ/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[հփմաօսնդ]/i,
					abbreviated: /^(հուն|փետ|մար|ապր|մայ|հուն|հուլ|օգս|սեպ|հոկ|նոյ|դեկ)/i,
					wide: /^(հունվար|փետրվար|մարտ|ապրիլ|մայիս|հունիս|հուլիս|օգոստոս|սեպտեմբեր|հոկտեմբեր|նոյեմբեր|դեկտեմբեր)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^հ/i, /^փ/i, /^մ/i, /^ա/i, /^մ/i, /^հ/i, /^հ/i, /^օ/i, /^ս/i, /^հ/i, /^ն/i, /^դ/i],
					any: [/^հու/i, /^փ/i, /^մար/i, /^ա/i, /^մայ/i, /^հուն/i, /^հուլ/i, /^օ/i, /^ս/i, /^հոկ/i, /^ն/i, /^դ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[եչհոշկ]/i,
					short: /^(կր|եր|եք|չք|հգ|ուր|շբ)/i,
					abbreviated: /^(կիր|երկ|երք|չոր|հնգ|ուրբ|շաբ)/i,
					wide: /^(կիրակի|երկուշաբթի|երեքշաբթի|չորեքշաբթի|հինգշաբթի|ուրբաթ|շաբաթ)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^կ/i, /^ե/i, /^ե/i, /^չ/i, /^հ/i, /^(ո|Ո)/, /^շ/i],
					short: [/^կ/i, /^եր/i, /^եք/i, /^չ/i, /^հ/i, /^(ո|Ո)/, /^շ/i],
					abbreviated: [/^կ/i, /^երկ/i, /^երք/i, /^չ/i, /^հ/i, /^(ո|Ո)/, /^շ/i],
					wide: [/^կ/i, /^երկ/i, /^երե/i, /^չ/i, /^հ/i, /^(ո|Ո)/, /^շ/i]
				},
				defaultParseWidth: "wide"
			}), G({
				matchPatterns: {
					narrow: /^([ap]|կեսգշ|կեսօր|(առավոտը?|ցերեկը?|երեկո(յան)?|գիշերը?))/i,
					any: /^([ap]\.?\s?m\.?|կեսգիշեր(ին)?|կեսօր(ին)?|(առավոտը?|ցերեկը?|երեկո(յան)?|գիշերը?))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /կեսգիշեր/i,
						noon: /կեսօր/i,
						morning: /առավոտ/i,
						afternoon: /ցերեկ/i,
						evening: /երեկո/i,
						night: /գիշեր/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "kurang dari 1 detik",
				other: "kurang dari {{count}} detik"
			},
			xSeconds: {
				one: "1 detik",
				other: "{{count}} detik"
			},
			halfAMinute: "setengah menit",
			lessThanXMinutes: {
				one: "kurang dari 1 menit",
				other: "kurang dari {{count}} menit"
			},
			xMinutes: {
				one: "1 menit",
				other: "{{count}} menit"
			},
			aboutXHours: {
				one: "sekitar 1 jam",
				other: "sekitar {{count}} jam"
			},
			xHours: {
				one: "1 jam",
				other: "{{count}} jam"
			},
			xDays: {
				one: "1 hari",
				other: "{{count}} hari"
			},
			aboutXWeeks: {
				one: "sekitar 1 minggu",
				other: "sekitar {{count}} minggu"
			},
			xWeeks: {
				one: "1 minggu",
				other: "{{count}} minggu"
			},
			aboutXMonths: {
				one: "sekitar 1 bulan",
				other: "sekitar {{count}} bulan"
			},
			xMonths: {
				one: "1 bulan",
				other: "{{count}} bulan"
			},
			aboutXYears: {
				one: "sekitar 1 tahun",
				other: "sekitar {{count}} tahun"
			},
			xYears: {
				one: "1 tahun",
				other: "{{count}} tahun"
			},
			overXYears: {
				one: "lebih dari 1 tahun",
				other: "lebih dari {{count}} tahun"
			},
			almostXYears: {
				one: "hampir 1 tahun",
				other: "hampir {{count}} tahun"
			}
		}),
		qt = {
			date: X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM yyyy",
					medium: "d MMM yyyy",
					short: "d/M/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH.mm.ss",
					long: "HH.mm.ss",
					medium: "HH.mm",
					short: "HH.mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'pukul' {{time}}",
					long: "{{date}} 'pukul' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Lt = {
			lastWeek: "eeee 'lalu pukul' p",
			yesterday: "'Kemarin pukul' p",
			today: "'Hari ini pukul' p",
			tomorrow: "'Besok pukul' p",
			nextWeek: "eeee 'pukul' p",
			other: "P"
		},
		Bt = (_({
				values: {
					narrow: ["SM", "M"],
					abbreviated: ["SM", "M"],
					wide: ["Sebelum Masehi", "Masehi"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["K1", "K2", "K3", "K4"],
					wide: ["Kuartal ke-1", "Kuartal ke-2", "Kuartal ke-3", "Kuartal ke-4"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"],
					wide: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["M", "S", "S", "R", "K", "J", "S"],
					short: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
					abbreviated: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
					wide: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "siang",
						evening: "sore",
						night: "malam"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "siang",
						evening: "sore",
						night: "malam"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "siang",
						evening: "sore",
						night: "malam"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "siang",
						evening: "sore",
						night: "malam"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "siang",
						evening: "sore",
						night: "malam"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "siang",
						evening: "sore",
						night: "malam"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^ke-(\d+)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(sm|m)/i,
					abbreviated: /^(s\.?\s?m\.?|s\.?\s?e\.?\s?u\.?|m\.?|e\.?\s?u\.?)/i,
					wide: /^(sebelum masehi|sebelum era umum|masehi|era umum)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^s/i, /^(m|e)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^K-?\s[1234]/i,
					wide: /^Kuartal ke-?\s?[1234]/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan|feb|mar|apr|mei|jun|jul|agt|sep|okt|nov|des)/i,
					wide: /^(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^ma/i, /^ap/i, /^me/i, /^jun/i, /^jul/i, /^ag/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[srkjm]/i,
					short: /^(min|sen|sel|rab|kam|jum|sab)/i,
					abbreviated: /^(min|sen|sel|rab|kam|jum|sab)/i,
					wide: /^(minggu|senin|selasa|rabu|kamis|jumat|sabtu)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^m/i, /^s/i, /^s/i, /^r/i, /^k/i, /^j/i, /^s/i],
					any: [/^m/i, /^sen/i, /^sel/i, /^r/i, /^k/i, /^j/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|tengah m|tengah h|(di(\swaktu)?) (pagi|siang|sore|malam))/i,
					any: /^([ap]\.?\s?m\.?|tengah malam|tengah hari|(di(\swaktu)?) (pagi|siang|sore|malam))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^pm/i,
						midnight: /^tengah m/i,
						noon: /^tengah h/i,
						morning: /pagi/i,
						afternoon: /siang/i,
						evening: /sore/i,
						night: /malam/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "minna en 1 sekúnda",
				other: "minna en {{count}} sekúndur"
			},
			xSeconds: {
				one: "1 sekúnda",
				other: "{{count}} sekúndur"
			},
			halfAMinute: "hálf mínúta",
			lessThanXMinutes: {
				one: "minna en 1 mínúta",
				other: "minna en {{count}} mínútur"
			},
			xMinutes: {
				one: "1 mínúta",
				other: "{{count}} mínútur"
			},
			aboutXHours: {
				one: "u.þ.b. 1 klukkustund",
				other: "u.þ.b. {{count}} klukkustundir"
			},
			xHours: {
				one: "1 klukkustund",
				other: "{{count}} klukkustundir"
			},
			xDays: {
				one: "1 dagur",
				other: "{{count}} dagar"
			},
			aboutXWeeks: {
				one: "um viku",
				other: "um {{count}} vikur"
			},
			xWeeks: {
				one: "1 viku",
				other: "{{count}} vikur"
			},
			aboutXMonths: {
				one: "u.þ.b. 1 mánuður",
				other: "u.þ.b. {{count}} mánuðir"
			},
			xMonths: {
				one: "1 mánuður",
				other: "{{count}} mánuðir"
			},
			aboutXYears: {
				one: "u.þ.b. 1 ár",
				other: "u.þ.b. {{count}} ár"
			},
			xYears: {
				one: "1 ár",
				other: "{{count}} ár"
			},
			overXYears: {
				one: "meira en 1 ár",
				other: "meira en {{count}} ár"
			},
			almostXYears: {
				one: "næstum 1 ár",
				other: "næstum {{count}} ár"
			}
		}),
		Qt = {
			date: X({
				formats: {
					full: "EEEE, do MMMM y",
					long: "do MMMM y",
					medium: "do MMM y",
					short: "d.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "'kl'. HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'kl.' {{time}}",
					long: "{{date}} 'kl.' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Rt = {
			lastWeek: "'síðasta' dddd 'kl.' p",
			yesterday: "'í gær kl.' p",
			today: "'í dag kl.' p",
			tomorrow: "'á morgun kl.' p",
			nextWeek: "dddd 'kl.' p",
			other: "P"
		},
		Ut = (_({
				values: {
					narrow: ["f.Kr.", "e.Kr."],
					abbreviated: ["f.Kr.", "e.Kr."],
					wide: ["fyrir Krist", "eftir Krist"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1F", "2F", "3F", "4F"],
					wide: ["1. fjórðungur", "2. fjórðungur", "3. fjórðungur", "4. fjórðungur"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "Á", "S", "Ó", "N", "D"],
					abbreviated: ["jan.", "feb.", "mars", "apríl", "maí", "júní", "júlí", "ágúst", "sept.", "okt.", "nóv.", "des."],
					wide: ["janúar", "febrúar", "mars", "apríl", "maí", "júní", "júlí", "ágúst", "september", "október", "nóvember", "desember"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["S", "M", "Þ", "M", "F", "F", "L"],
					short: ["Su", "Má", "Þr", "Mi", "Fi", "Fö", "La"],
					abbreviated: ["sun.", "mán.", "þri.", "mið.", "fim.", "fös.", "lau."],
					wide: ["sunnudagur", "mánudagur", "þriðjudagur", "miðvikudagur", "fimmtudagur", "föstudagur", "laugardagur"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "f",
						pm: "e",
						midnight: "miðnætti",
						noon: "hádegi",
						morning: "morgunn",
						afternoon: "síðdegi",
						evening: "kvöld",
						night: "nótt"
					},
					abbreviated: {
						am: "f.h.",
						pm: "e.h.",
						midnight: "miðnætti",
						noon: "hádegi",
						morning: "morgunn",
						afternoon: "síðdegi",
						evening: "kvöld",
						night: "nótt"
					},
					wide: {
						am: "fyrir hádegi",
						pm: "eftir hádegi",
						midnight: "miðnætti",
						noon: "hádegi",
						morning: "morgunn",
						afternoon: "síðdegi",
						evening: "kvöld",
						night: "nótt"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "f",
						pm: "e",
						midnight: "á miðnætti",
						noon: "á hádegi",
						morning: "að morgni",
						afternoon: "síðdegis",
						evening: "um kvöld",
						night: "um nótt"
					},
					abbreviated: {
						am: "f.h.",
						pm: "e.h.",
						midnight: "á miðnætti",
						noon: "á hádegi",
						morning: "að morgni",
						afternoon: "síðdegis",
						evening: "um kvöld",
						night: "um nótt"
					},
					wide: {
						am: "fyrir hádegi",
						pm: "eftir hádegi",
						midnight: "á miðnætti",
						noon: "á hádegi",
						morning: "að morgni",
						afternoon: "síðdegis",
						evening: "um kvöld",
						night: "um nótt"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(\.)?/i,
				parsePattern: /\d+(\.)?/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(f\.Kr\.|e\.Kr\.)/i,
					abbreviated: /^(f\.Kr\.|e\.Kr\.)/i,
					wide: /^(fyrir Krist|eftir Krist)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^(f\.Kr\.)/i, /^(e\.Kr\.)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]\.?/i,
					abbreviated: /^q[1234]\.?/i,
					wide: /^[1234]\.? fjórðungur/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1\.?/i, /2\.?/i, /3\.?/i, /4\.?/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmásónd]/i,
					abbreviated: /^(jan\.|feb\.|mars\.|apríl\.|maí|júní|júlí|águst|sep\.|oct\.|nov\.|dec\.)/i,
					wide: /^(januar|febrúar|mars|apríl|maí|júní|júlí|águst|september|október|nóvember|desember)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^á/i, /^s/i, /^ó/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^maí/i, /^jún/i, /^júl/i, /^áu/i, /^s/i, /^ó/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[smtwf]/i,
					short: /^(su|má|þr|mi|fi|fö|la)/i,
					abbreviated: /^(sun|mán|þri|mið|fim|fös|lau)\.?/i,
					wide: /^(sunnudagur|mánudagur|þriðjudagur|miðvikudagur|fimmtudagur|föstudagur|laugardagur)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^s/i, /^m/i, /^þ/i, /^m/i, /^f/i, /^f/i, /^l/i],
					any: [/^su/i, /^má/i, /^þr/i, /^mi/i, /^fi/i, /^fö/i, /^la/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(f|e|síðdegis|(á|að|um) (morgni|kvöld|nótt|miðnætti))/i,
					any: /^(fyrir hádegi|eftir hádegi|[ef]\.?h\.?|síðdegis|morgunn|(á|að|um) (morgni|kvöld|nótt|miðnætti))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^f/i,
						pm: /^e/i,
						midnight: /^mi/i,
						noon: /^há/i,
						morning: /morgunn/i,
						afternoon: /síðdegi/i,
						evening: /kvöld/i,
						night: /nótt/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "meno di un secondo",
				other: "meno di {{count}} secondi"
			},
			xSeconds: {
				one: "un secondo",
				other: "{{count}} secondi"
			},
			halfAMinute: "alcuni secondi",
			lessThanXMinutes: {
				one: "meno di un minuto",
				other: "meno di {{count}} minuti"
			},
			xMinutes: {
				one: "un minuto",
				other: "{{count}} minuti"
			},
			aboutXHours: {
				one: "circa un'ora",
				other: "circa {{count}} ore"
			},
			xHours: {
				one: "un'ora",
				other: "{{count}} ore"
			},
			xDays: {
				one: "un giorno",
				other: "{{count}} giorni"
			},
			aboutXWeeks: {
				one: "circa una settimana",
				other: "circa {{count}} settimane"
			},
			xWeeks: {
				one: "una settimana",
				other: "{{count}} settimane"
			},
			aboutXMonths: {
				one: "circa un mese",
				other: "circa {{count}} mesi"
			},
			xMonths: {
				one: "un mese",
				other: "{{count}} mesi"
			},
			aboutXYears: {
				one: "circa un anno",
				other: "circa {{count}} anni"
			},
			xYears: {
				one: "un anno",
				other: "{{count}} anni"
			},
			overXYears: {
				one: "più di un anno",
				other: "più di {{count}} anni"
			},
			almostXYears: {
				one: "quasi un anno",
				other: "quasi {{count}} anni"
			}
		}),
		Zt = {
			date: X({
				formats: {
					full: "EEEE d MMMM y",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "dd/MM/y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		en = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

		function tn(e) {
			return "'" + en[e] + " alle' p"
		}
		const nn = {
			lastWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? tn(a) : function (e) {
					return 0 === e ? "'domenica scorsa alle' p" : "'" + en[e] + " scorso alle' p"
				}
				(a)
			},
			yesterday: "'ieri alle' p",
			today: "'oggi alle' p",
			tomorrow: "'domani alle' p",
			nextWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? tn(a) : function (e) {
					return 0 === e ? "'domenica prossima alle' p" : "'" + en[e] + " prossimo alle' p"
				}
				(a)
			},
			other: "P"
		},
		an = (_({
				values: {
					narrow: ["aC", "dC"],
					abbreviated: ["a.C.", "d.C."],
					wide: ["avanti Cristo", "dopo Cristo"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["T1", "T2", "T3", "T4"],
					wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["G", "F", "M", "A", "M", "G", "L", "A", "S", "O", "N", "D"],
					abbreviated: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
					wide: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["D", "L", "M", "M", "G", "V", "S"],
					short: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
					abbreviated: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
					wide: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "m.",
						pm: "p.",
						midnight: "mezzanotte",
						noon: "mezzogiorno",
						morning: "mattina",
						afternoon: "pomeriggio",
						evening: "sera",
						night: "notte"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "mezzanotte",
						noon: "mezzogiorno",
						morning: "mattina",
						afternoon: "pomeriggio",
						evening: "sera",
						night: "notte"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "mezzanotte",
						noon: "mezzogiorno",
						morning: "mattina",
						afternoon: "pomeriggio",
						evening: "sera",
						night: "notte"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "m.",
						pm: "p.",
						midnight: "mezzanotte",
						noon: "mezzogiorno",
						morning: "di mattina",
						afternoon: "del pomeriggio",
						evening: "di sera",
						night: "di notte"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "mezzanotte",
						noon: "mezzogiorno",
						morning: "di mattina",
						afternoon: "del pomeriggio",
						evening: "di sera",
						night: "di notte"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "mezzanotte",
						noon: "mezzogiorno",
						morning: "di mattina",
						afternoon: "del pomeriggio",
						evening: "di sera",
						night: "di notte"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(º)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(aC|dC)/i,
					abbreviated: /^(a\.?\s?C\.?|a\.?\s?e\.?\s?v\.?|d\.?\s?C\.?|e\.?\s?v\.?)/i,
					wide: /^(avanti Cristo|avanti Era Volgare|dopo Cristo|Era Volgare)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^a/i, /^(d|e)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^t[1234]/i,
					wide: /^[1234](º)? trimestre/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[gfmalsond]/i,
					abbreviated: /^(gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)/i,
					wide: /^(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^g/i, /^f/i, /^m/i, /^a/i, /^m/i, /^g/i, /^l/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ge/i, /^f/i, /^mar/i, /^ap/i, /^mag/i, /^gi/i, /^l/i, /^ag/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[dlmgvs]/i,
					short: /^(do|lu|ma|me|gi|ve|sa)/i,
					abbreviated: /^(dom|lun|mar|mer|gio|ven|sab)/i,
					wide: /^(domenica|luned[i|ì]|marted[i|ì]|mercoled[i|ì]|gioved[i|ì]|venerd[i|ì]|sabato)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^g/i, /^v/i, /^s/i],
					any: [/^d/i, /^l/i, /^ma/i, /^me/i, /^g/i, /^v/i, /^s/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|m\.|p|mezzanotte|mezzogiorno|(di|del) (mattina|pomeriggio|sera|notte))/i,
					any: /^([ap]\.?\s?m\.?|mezzanotte|mezzogiorno|(di|del) (mattina|pomeriggio|sera|notte))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^mezza/i,
						noon: /^mezzo/i,
						morning: /mattina/i,
						afternoon: /pomeriggio/i,
						evening: /sera/i,
						night: /notte/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "1秒未満",
				other: "{{count}}秒未満",
				oneWithSuffix: "約1秒",
				otherWithSuffix: "約{{count}}秒"
			},
			xSeconds: {
				one: "1秒",
				other: "{{count}}秒"
			},
			halfAMinute: "30秒",
			lessThanXMinutes: {
				one: "1分未満",
				other: "{{count}}分未満",
				oneWithSuffix: "約1分",
				otherWithSuffix: "約{{count}}分"
			},
			xMinutes: {
				one: "1分",
				other: "{{count}}分"
			},
			aboutXHours: {
				one: "約1時間",
				other: "約{{count}}時間"
			},
			xHours: {
				one: "1時間",
				other: "{{count}}時間"
			},
			xDays: {
				one: "1日",
				other: "{{count}}日"
			},
			aboutXWeeks: {
				one: "約1週間",
				other: "約{{count}}週間"
			},
			xWeeks: {
				one: "1週間",
				other: "{{count}}週間"
			},
			aboutXMonths: {
				one: "約1か月",
				other: "約{{count}}か月"
			},
			xMonths: {
				one: "1か月",
				other: "{{count}}か月"
			},
			aboutXYears: {
				one: "約1年",
				other: "約{{count}}年"
			},
			xYears: {
				one: "1年",
				other: "{{count}}年"
			},
			overXYears: {
				one: "1年以上",
				other: "{{count}}年以上"
			},
			almostXYears: {
				one: "1年近く",
				other: "{{count}}年近く"
			}
		}),
		rn = {
			date: X({
				formats: {
					full: "y年M月d日EEEE",
					long: "y年M月d日",
					medium: "y/MM/dd",
					short: "y/MM/dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H時mm分ss秒 zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		on = {
			lastWeek: "先週のeeeeのp",
			yesterday: "昨日のp",
			today: "今日のp",
			tomorrow: "明日のp",
			nextWeek: "翌週のeeeeのp",
			other: "P"
		},
		sn = (_({
				values: {
					narrow: ["BC", "AC"],
					abbreviated: ["紀元前", "西暦"],
					wide: ["紀元前", "西暦"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["第1四半期", "第2四半期", "第3四半期", "第4四半期"]
				},
				defaultWidth: "wide",
				argumentCallback: e => Number(e) - 1
			}), _({
				values: {
					narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
					abbreviated: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
					wide: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["日", "月", "火", "水", "木", "金", "土"],
					short: ["日", "月", "火", "水", "木", "金", "土"],
					abbreviated: ["日", "月", "火", "水", "木", "金", "土"],
					wide: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "午前",
						pm: "午後",
						midnight: "深夜",
						noon: "正午",
						morning: "朝",
						afternoon: "午後",
						evening: "夜",
						night: "深夜"
					},
					abbreviated: {
						am: "午前",
						pm: "午後",
						midnight: "深夜",
						noon: "正午",
						morning: "朝",
						afternoon: "午後",
						evening: "夜",
						night: "深夜"
					},
					wide: {
						am: "午前",
						pm: "午後",
						midnight: "深夜",
						noon: "正午",
						morning: "朝",
						afternoon: "午後",
						evening: "夜",
						night: "深夜"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "午前",
						pm: "午後",
						midnight: "深夜",
						noon: "正午",
						morning: "朝",
						afternoon: "午後",
						evening: "夜",
						night: "深夜"
					},
					abbreviated: {
						am: "午前",
						pm: "午後",
						midnight: "深夜",
						noon: "正午",
						morning: "朝",
						afternoon: "午後",
						evening: "夜",
						night: "深夜"
					},
					wide: {
						am: "午前",
						pm: "午後",
						midnight: "深夜",
						noon: "正午",
						morning: "朝",
						afternoon: "午後",
						evening: "夜",
						night: "深夜"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^第?\d+(年|四半期|月|週|日|時|分|秒)?/i,
				parsePattern: /\d+/i,
				valueCallback: function (e) {
					return parseInt(e, 10)
				}
			}), G({
				matchPatterns: {
					narrow: /^(B\.?C\.?|A\.?D\.?)/i,
					abbreviated: /^(紀元[前後]|西暦)/i,
					wide: /^(紀元[前後]|西暦)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^B/i, /^A/i],
					any: [/^(紀元前)/i, /^(西暦|紀元後)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^Q[1234]/i,
					wide: /^第[1234一二三四１２３４]四半期/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/(1|一|１)/i, /(2|二|２)/i, /(3|三|３)/i, /(4|四|４)/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^([123456789]|1[012])/,
					abbreviated: /^([123456789]|1[012])月/i,
					wide: /^([123456789]|1[012])月/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^1\D/, /^2/, /^3/, /^4/, /^5/, /^6/, /^7/, /^8/, /^9/, /^10/, /^11/, /^12/]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[日月火水木金土]/,
					short: /^[日月火水木金土]/,
					abbreviated: /^[日月火水木金土]/,
					wide: /^[日月火水木金土]曜日/
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^日/, /^月/, /^火/, /^水/, /^木/, /^金/, /^土/]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(AM|PM|午前|午後|正午|深夜|真夜中|夜|朝)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^(A|午前)/i,
						pm: /^(P|午後)/i,
						midnight: /^深夜|真夜中/i,
						noon: /^正午/i,
						morning: /^朝/i,
						afternoon: /^午後/i,
						evening: /^夜/i,
						night: /^深夜/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				past: "{{count}} წამზე ნაკლები ხნის წინ",
				present: "{{count}} წამზე ნაკლები",
				future: "{{count}} წამზე ნაკლებში"
			},
			xSeconds: {
				past: "{{count}} წამის წინ",
				present: "{{count}} წამი",
				future: "{{count}} წამში"
			},
			halfAMinute: {
				past: "ნახევარი წუთის წინ",
				present: "ნახევარი წუთი",
				future: "ნახევარი წუთში"
			},
			lessThanXMinutes: {
				past: "{{count}} წუთზე ნაკლები ხნის წინ",
				present: "{{count}} წუთზე ნაკლები",
				future: "{{count}} წუთზე ნაკლებში"
			},
			xMinutes: {
				past: "{{count}} წუთის წინ",
				present: "{{count}} წუთი",
				future: "{{count}} წუთში"
			},
			aboutXHours: {
				past: "დაახლოებით {{count}} საათის წინ",
				present: "დაახლოებით {{count}} საათი",
				future: "დაახლოებით {{count}} საათში"
			},
			xHours: {
				past: "{{count}} საათის წინ",
				present: "{{count}} საათი",
				future: "{{count}} საათში"
			},
			xDays: {
				past: "{{count}} დღის წინ",
				present: "{{count}} დღე",
				future: "{{count}} დღეში"
			},
			aboutXWeeks: {
				past: "დაახლოებით {{count}} კვირას წინ",
				present: "დაახლოებით {{count}} კვირა",
				future: "დაახლოებით {{count}} კვირაში"
			},
			xWeeks: {
				past: "{{count}} კვირას კვირა",
				present: "{{count}} კვირა",
				future: "{{count}} კვირაში"
			},
			aboutXMonths: {
				past: "დაახლოებით {{count}} თვის წინ",
				present: "დაახლოებით {{count}} თვე",
				future: "დაახლოებით {{count}} თვეში"
			},
			xMonths: {
				past: "{{count}} თვის წინ",
				present: "{{count}} თვე",
				future: "{{count}} თვეში"
			},
			aboutXYears: {
				past: "დაახლოებით {{count}} წლის წინ",
				present: "დაახლოებით {{count}} წელი",
				future: "დაახლოებით {{count}} წელში"
			},
			xYears: {
				past: "{{count}} წლის წინ",
				present: "{{count}} წელი",
				future: "{{count}} წელში"
			},
			overXYears: {
				past: "{{count}} წელზე მეტი ხნის წინ",
				present: "{{count}} წელზე მეტი",
				future: "{{count}} წელზე მეტი ხნის შემდეგ"
			},
			almostXYears: {
				past: "თითქმის {{count}} წლის წინ",
				present: "თითქმის {{count}} წელი",
				future: "თითქმის {{count}} წელში"
			}
		}),
		dn = {
			date: X({
				formats: {
					full: "EEEE, do MMMM, y",
					long: "do, MMMM, y",
					medium: "d, MMM, y",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}'-ზე'",
					long: "{{date}} {{time}}'-ზე'",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		un = {
			lastWeek: "'წინა' eeee p'-ზე'",
			yesterday: "'გუშინ' p'-ზე'",
			today: "'დღეს' p'-ზე'",
			tomorrow: "'ხვალ' p'-ზე'",
			nextWeek: "'შემდეგი' eeee p'-ზე'",
			other: "P"
		},
		mn = (_({
				values: {
					narrow: ["ჩ.წ-მდე", "ჩ.წ"],
					abbreviated: ["ჩვ.წ-მდე", "ჩვ.წ"],
					wide: ["ჩვენს წელთაღრიცხვამდე", "ჩვენი წელთაღრიცხვით"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1-ლი კვ", "2-ე კვ", "3-ე კვ", "4-ე კვ"],
					wide: ["1-ლი კვარტალი", "2-ე კვარტალი", "3-ე კვარტალი", "4-ე კვარტალი"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["ია", "თე", "მა", "აპ", "მს", "ვნ", "ვლ", "აგ", "სე", "ოქ", "ნო", "დე"],
					abbreviated: ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ"],
					wide: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["კვ", "ორ", "სა", "ოთ", "ხუ", "პა", "შა"],
					short: ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"],
					abbreviated: ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"],
					wide: ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "შუაღამე",
						noon: "შუადღე",
						morning: "დილა",
						afternoon: "საღამო",
						evening: "საღამო",
						night: "ღამე"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "შუაღამე",
						noon: "შუადღე",
						morning: "დილა",
						afternoon: "საღამო",
						evening: "საღამო",
						night: "ღამე"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "შუაღამე",
						noon: "შუადღე",
						morning: "დილა",
						afternoon: "საღამო",
						evening: "საღამო",
						night: "ღამე"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "შუაღამით",
						noon: "შუადღისას",
						morning: "დილით",
						afternoon: "ნაშუადღევს",
						evening: "საღამოს",
						night: "ღამით"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "შუაღამით",
						noon: "შუადღისას",
						morning: "დილით",
						afternoon: "ნაშუადღევს",
						evening: "საღამოს",
						night: "ღამით"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "შუაღამით",
						noon: "შუადღისას",
						morning: "დილით",
						afternoon: "ნაშუადღევს",
						evening: "საღამოს",
						night: "ღამით"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(-ლი|-ე)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ჩვ?\.წ)/i,
					abbreviated: /^(ჩვ?\.წ)/i,
					wide: /^(ჩვენს წელთაღრიცხვამდე|ქრისტეშობამდე|ჩვენი წელთაღრიცხვით|ქრისტეშობიდან)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^(ჩვენს წელთაღრიცხვამდე|ქრისტეშობამდე)/i, /^(ჩვენი წელთაღრიცხვით|ქრისტეშობიდან)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234]-(ლი|ე)? კვ/i,
					wide: /^[1234]-(ლი|ე)? კვარტალი/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					any: /^(ია|თე|მა|აპ|მს|ვნ|ვლ|აგ|სე|ოქ|ნო|დე)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: [/^ია/i, /^თ/i, /^მარ/i, /^აპ/i, /^მაი/i, /^ი?ვნ/i, /^ი?ვლ/i, /^აგ/i, /^ს/i, /^ო/i, /^ნ/i, /^დ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(კვ|ორ|სა|ოთ|ხუ|პა|შა)/i,
					short: /^(კვი|ორშ|სამ|ოთხ|ხუთ|პარ|შაბ)/i,
					wide: /^(კვირა|ორშაბათი|სამშაბათი|ოთხშაბათი|ხუთშაბათი|პარასკევი|შაბათი)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^კვ/i, /^ორ/i, /^სა/i, /^ოთ/i, /^ხუ/i, /^პა/i, /^შა/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^([ap]\.?\s?m\.?|შუაღ|დილ)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^შუაღ/i,
						noon: /^შუადღ/i,
						morning: /^დილ/i,
						afternoon: /ნაშუადღევს/i,
						evening: /საღამო/i,
						night: /ღამ/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				regular: {
					one: "1 секундтан аз",
					singularNominative: "{{count}} секундтан аз",
					singularGenitive: "{{count}} секундтан аз",
					pluralGenitive: "{{count}} секундтан аз"
				},
				future: {
					one: "бір секундтан кейін",
					singularNominative: "{{count}} секундтан кейін",
					singularGenitive: "{{count}} секундтан кейін",
					pluralGenitive: "{{count}} секундтан кейін"
				}
			},
			xSeconds: {
				regular: {
					singularNominative: "{{count}} секунд",
					singularGenitive: "{{count}} секунд",
					pluralGenitive: "{{count}} секунд"
				},
				past: {
					singularNominative: "{{count}} секунд бұрын",
					singularGenitive: "{{count}} секунд бұрын",
					pluralGenitive: "{{count}} секунд бұрын"
				},
				future: {
					singularNominative: "{{count}} секундтан кейін",
					singularGenitive: "{{count}} секундтан кейін",
					pluralGenitive: "{{count}} секундтан кейін"
				}
			},
			halfAMinute: e => e?.addSuffix ? e.comparison && e.comparison > 0 ? "жарты минут ішінде" : "жарты минут бұрын" : "жарты минут",
			lessThanXMinutes: {
				regular: {
					one: "1 минуттан аз",
					singularNominative: "{{count}} минуттан аз",
					singularGenitive: "{{count}} минуттан аз",
					pluralGenitive: "{{count}} минуттан аз"
				},
				future: {
					one: "минуттан кем ",
					singularNominative: "{{count}} минуттан кем",
					singularGenitive: "{{count}} минуттан кем",
					pluralGenitive: "{{count}} минуттан кем"
				}
			},
			xMinutes: {
				regular: {
					singularNominative: "{{count}} минут",
					singularGenitive: "{{count}} минут",
					pluralGenitive: "{{count}} минут"
				},
				past: {
					singularNominative: "{{count}} минут бұрын",
					singularGenitive: "{{count}} минут бұрын",
					pluralGenitive: "{{count}} минут бұрын"
				},
				future: {
					singularNominative: "{{count}} минуттан кейін",
					singularGenitive: "{{count}} минуттан кейін",
					pluralGenitive: "{{count}} минуттан кейін"
				}
			},
			aboutXHours: {
				regular: {
					singularNominative: "шамамен {{count}} сағат",
					singularGenitive: "шамамен {{count}} сағат",
					pluralGenitive: "шамамен {{count}} сағат"
				},
				future: {
					singularNominative: "шамамен {{count}} сағаттан кейін",
					singularGenitive: "шамамен {{count}} сағаттан кейін",
					pluralGenitive: "шамамен {{count}} сағаттан кейін"
				}
			},
			xHours: {
				regular: {
					singularNominative: "{{count}} сағат",
					singularGenitive: "{{count}} сағат",
					pluralGenitive: "{{count}} сағат"
				}
			},
			xDays: {
				regular: {
					singularNominative: "{{count}} күн",
					singularGenitive: "{{count}} күн",
					pluralGenitive: "{{count}} күн"
				},
				future: {
					singularNominative: "{{count}} күннен кейін",
					singularGenitive: "{{count}} күннен кейін",
					pluralGenitive: "{{count}} күннен кейін"
				}
			},
			aboutXWeeks: {
				type: "weeks",
				one: "шамамен 1 апта",
				other: "шамамен {{count}} апта"
			},
			xWeeks: {
				type: "weeks",
				one: "1 апта",
				other: "{{count}} апта"
			},
			aboutXMonths: {
				regular: {
					singularNominative: "шамамен {{count}} ай",
					singularGenitive: "шамамен {{count}} ай",
					pluralGenitive: "шамамен {{count}} ай"
				},
				future: {
					singularNominative: "шамамен {{count}} айдан кейін",
					singularGenitive: "шамамен {{count}} айдан кейін",
					pluralGenitive: "шамамен {{count}} айдан кейін"
				}
			},
			xMonths: {
				regular: {
					singularNominative: "{{count}} ай",
					singularGenitive: "{{count}} ай",
					pluralGenitive: "{{count}} ай"
				}
			},
			aboutXYears: {
				regular: {
					singularNominative: "шамамен {{count}} жыл",
					singularGenitive: "шамамен {{count}} жыл",
					pluralGenitive: "шамамен {{count}} жыл"
				},
				future: {
					singularNominative: "шамамен {{count}} жылдан кейін",
					singularGenitive: "шамамен {{count}} жылдан кейін",
					pluralGenitive: "шамамен {{count}} жылдан кейін"
				}
			},
			xYears: {
				regular: {
					singularNominative: "{{count}} жыл",
					singularGenitive: "{{count}} жыл",
					pluralGenitive: "{{count}} жыл"
				},
				future: {
					singularNominative: "{{count}} жылдан кейін",
					singularGenitive: "{{count}} жылдан кейін",
					pluralGenitive: "{{count}} жылдан кейін"
				}
			},
			overXYears: {
				regular: {
					singularNominative: "{{count}} жылдан астам",
					singularGenitive: "{{count}} жылдан астам",
					pluralGenitive: "{{count}} жылдан астам"
				},
				future: {
					singularNominative: "{{count}} жылдан астам",
					singularGenitive: "{{count}} жылдан астам",
					pluralGenitive: "{{count}} жылдан астам"
				}
			},
			almostXYears: {
				regular: {
					singularNominative: "{{count}} жылға жақын",
					singularGenitive: "{{count}} жылға жақын",
					pluralGenitive: "{{count}} жылға жақын"
				},
				future: {
					singularNominative: "{{count}} жылдан кейін",
					singularGenitive: "{{count}} жылдан кейін",
					pluralGenitive: "{{count}} жылдан кейін"
				}
			}
		});

		function ln(e, t) {
			if (e.one && 1 === t)
				return e.one;
			const n = t % 10,
			a = t % 100;
			return 1 === n && 11 !== a ? e.singularNominative.replace("{{count}}", String(t)) : n >= 2 && n <= 4 && (a < 10 || a > 20) ? e.singularGenitive.replace("{{count}}", String(t)) : e.pluralGenitive.replace("{{count}}", String(t))
		}
		const hn = {
			date: X({
				formats: {
					full: "EEEE, do MMMM y 'ж.'",
					long: "do MMMM y 'ж.'",
					medium: "d MMM y 'ж.'",
					short: "dd.MM.yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					any: "{{date}}, {{time}}"
				},
				defaultWidth: "any"
			})
		},
		cn = ["жексенбіде", "дүйсенбіде", "сейсенбіде", "сәрсенбіде", "бейсенбіде", "жұмада", "сенбіде"];

		function gn(e) {
			return "'" + cn[e] + " сағат' p'-де'"
		}
		const fn = {
			lastWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? gn(a) : function (e) {
					return "'өткен " + cn[e] + " сағат' p'-де'"
				}
				(a)
			},
			yesterday: "'кеше сағат' p'-де'",
			today: "'бүгін сағат' p'-де'",
			tomorrow: "'ертең сағат' p'-де'",
			nextWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? gn(a) : function (e) {
					return "'келесі " + cn[e] + " сағат' p'-де'"
				}
				(a)
			},
			other: "P"
		},
		pn = {
			0: "-ші",
			1: "-ші",
			2: "-ші",
			3: "-ші",
			4: "-ші",
			5: "-ші",
			6: "-шы",
			7: "-ші",
			8: "-ші",
			9: "-шы",
			10: "-шы",
			20: "-шы",
			30: "-шы",
			40: "-шы",
			50: "-ші",
			60: "-шы",
			70: "-ші",
			80: "-ші",
			90: "-шы",
			100: "-ші"
		},
		vn = (_({
				values: {
					narrow: ["б.з.д.", "б.з."],
					abbreviated: ["б.з.д.", "б.з."],
					wide: ["біздің заманымызға дейін", "біздің заманымыз"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1-ші тоқ.", "2-ші тоқ.", "3-ші тоқ.", "4-ші тоқ."],
					wide: ["1-ші тоқсан", "2-ші тоқсан", "3-ші тоқсан", "4-ші тоқсан"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["Қ", "А", "Н", "С", "М", "М", "Ш", "Т", "Қ", "Қ", "Қ", "Ж"],
					abbreviated: ["қаң", "ақп", "нау", "сәу", "мам", "мау", "шіл", "там", "қыр", "қаз", "қар", "жел"],
					wide: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["Қ", "А", "Н", "С", "М", "М", "Ш", "Т", "Қ", "Қ", "Қ", "Ж"],
					abbreviated: ["қаң", "ақп", "нау", "сәу", "мам", "мау", "шіл", "там", "қыр", "қаз", "қар", "жел"],
					wide: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["Ж", "Д", "С", "С", "Б", "Ж", "С"],
					short: ["жс", "дс", "сс", "ср", "бс", "жм", "сб"],
					abbreviated: ["жс", "дс", "сс", "ср", "бс", "жм", "сб"],
					wide: ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ТД",
						pm: "ТК",
						midnight: "түн ортасы",
						noon: "түс",
						morning: "таң",
						afternoon: "күндіз",
						evening: "кеш",
						night: "түн"
					},
					wide: {
						am: "ТД",
						pm: "ТК",
						midnight: "түн ортасы",
						noon: "түс",
						morning: "таң",
						afternoon: "күндіз",
						evening: "кеш",
						night: "түн"
					}
				},
				defaultWidth: "any",
				formattingValues: {
					narrow: {
						am: "ТД",
						pm: "ТК",
						midnight: "түн ортасында",
						noon: "түс",
						morning: "таң",
						afternoon: "күн",
						evening: "кеш",
						night: "түн"
					},
					wide: {
						am: "ТД",
						pm: "ТК",
						midnight: "түн ортасында",
						noon: "түсте",
						morning: "таңертең",
						afternoon: "күндіз",
						evening: "кеште",
						night: "түнде"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(-?(ші|шы))?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^((б )?з\.?\s?д\.?)/i,
					abbreviated: /^((б )?з\.?\s?д\.?)/i,
					wide: /^(біздің заманымызға дейін|біздің заманымыз|біздің заманымыздан)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^б/i, /^з/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234](-?ші)? тоқ.?/i,
					wide: /^[1234](-?ші)? тоқсан/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(қ|а|н|с|м|мау|ш|т|қыр|қаз|қар|ж)/i,
					abbreviated: /^(қаң|ақп|нау|сәу|мам|мау|шіл|там|қыр|қаз|қар|жел)/i,
					wide: /^(қаңтар|ақпан|наурыз|сәуір|мамыр|маусым|шілде|тамыз|қыркүйек|қазан|қараша|желтоқсан)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^қ/i, /^а/i, /^н/i, /^с/i, /^м/i, /^м/i, /^ш/i, /^т/i, /^қ/i, /^қ/i, /^қ/i, /^ж/i],
					abbreviated: [/^қаң/i, /^ақп/i, /^нау/i, /^сәу/i, /^мам/i, /^мау/i, /^шіл/i, /^там/i, /^қыр/i, /^қаз/i, /^қар/i, /^жел/i],
					any: [/^қ/i, /^а/i, /^н/i, /^с/i, /^м/i, /^м/i, /^ш/i, /^т/i, /^қ/i, /^қ/i, /^қ/i, /^ж/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(ж|д|с|с|б|ж|с)/i,
					short: /^(жс|дс|сс|ср|бс|жм|сб)/i,
					wide: /^(жексенбі|дүйсенбі|сейсенбі|сәрсенбі|бейсенбі|жұма|сенбі)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ж/i, /^д/i, /^с/i, /^с/i, /^б/i, /^ж/i, /^с/i],
					short: [/^жс/i, /^дс/i, /^сс/i, /^ср/i, /^бс/i, /^жм/i, /^сб/i],
					any: [/^ж[ек]/i, /^д[үй]/i, /^сe[й]/i, /^сә[р]/i, /^б[ей]/i, /^ж[ұм]/i, /^се[н]/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i,
					wide: /^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i,
					any: /^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: {
						am: /^ТД/i,
						pm: /^ТК/i,
						midnight: /^түн орта/i,
						noon: /^күндіз/i,
						morning: /таң/i,
						afternoon: /түс/i,
						evening: /кеш/i,
						night: /түн/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: {
				default:
					"1 ಸೆಕೆಂಡ್‌ಗಿಂತ ಕಡಿಮೆ",
					future: "1 ಸೆಕೆಂಡ್‌ಗಿಂತ ಕಡಿಮೆ",
					past: "1 ಸೆಕೆಂಡ್‌ಗಿಂತ ಕಡಿಮೆ"
				},
				other: {
				default:
					"{{count}} ಸೆಕೆಂಡ್‌ಗಿಂತ ಕಡಿಮೆ",
					future: "{{count}} ಸೆಕೆಂಡ್‌ಗಿಂತ ಕಡಿಮೆ",
					past: "{{count}} ಸೆಕೆಂಡ್‌ಗಿಂತ ಕಡಿಮೆ"
				}
			},
			xSeconds: {
				one: {
				default:
					"1 ಸೆಕೆಂಡ್",
					future: "1 ಸೆಕೆಂಡ್‌ನಲ್ಲಿ",
					past: "1 ಸೆಕೆಂಡ್ ಹಿಂದೆ"
				},
				other: {
				default:
					"{{count}} ಸೆಕೆಂಡುಗಳು",
					future: "{{count}} ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ",
					past: "{{count}} ಸೆಕೆಂಡ್ ಹಿಂದೆ"
				}
			},
			halfAMinute: {
				other: {
				default:
					"ಅರ್ಧ ನಿಮಿಷ",
					future: "ಅರ್ಧ ನಿಮಿಷದಲ್ಲಿ",
					past: "ಅರ್ಧ ನಿಮಿಷದ ಹಿಂದೆ"
				}
			},
			lessThanXMinutes: {
				one: {
				default:
					"1 ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ",
					future: "1 ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ",
					past: "1 ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ"
				},
				other: {
				default:
					"{{count}} ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ",
					future: "{{count}} ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ",
					past: "{{count}} ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ"
				}
			},
			xMinutes: {
				one: {
				default:
					"1 ನಿಮಿಷ",
					future: "1 ನಿಮಿಷದಲ್ಲಿ",
					past: "1 ನಿಮಿಷದ ಹಿಂದೆ"
				},
				other: {
				default:
					"{{count}} ನಿಮಿಷಗಳು",
					future: "{{count}} ನಿಮಿಷಗಳಲ್ಲಿ",
					past: "{{count}} ನಿಮಿಷಗಳ ಹಿಂದೆ"
				}
			},
			aboutXHours: {
				one: {
				default:
					"ಸುಮಾರು 1 ಗಂಟೆ",
					future: "ಸುಮಾರು 1 ಗಂಟೆಯಲ್ಲಿ",
					past: "ಸುಮಾರು 1 ಗಂಟೆ ಹಿಂದೆ"
				},
				other: {
				default:
					"ಸುಮಾರು {{count}} ಗಂಟೆಗಳು",
					future: "ಸುಮಾರು {{count}} ಗಂಟೆಗಳಲ್ಲಿ",
					past: "ಸುಮಾರು {{count}} ಗಂಟೆಗಳ ಹಿಂದೆ"
				}
			},
			xHours: {
				one: {
				default:
					"1 ಗಂಟೆ",
					future: "1 ಗಂಟೆಯಲ್ಲಿ",
					past: "1 ಗಂಟೆ ಹಿಂದೆ"
				},
				other: {
				default:
					"{{count}} ಗಂಟೆಗಳು",
					future: "{{count}} ಗಂಟೆಗಳಲ್ಲಿ",
					past: "{{count}} ಗಂಟೆಗಳ ಹಿಂದೆ"
				}
			},
			xDays: {
				one: {
				default:
					"1 ದಿನ",
					future: "1 ದಿನದಲ್ಲಿ",
					past: "1 ದಿನದ ಹಿಂದೆ"
				},
				other: {
				default:
					"{{count}} ದಿನಗಳು",
					future: "{{count}} ದಿನಗಳಲ್ಲಿ",
					past: "{{count}} ದಿನಗಳ ಹಿಂದೆ"
				}
			},
			aboutXMonths: {
				one: {
				default:
					"ಸುಮಾರು 1 ತಿಂಗಳು",
					future: "ಸುಮಾರು 1 ತಿಂಗಳಲ್ಲಿ",
					past: "ಸುಮಾರು 1 ತಿಂಗಳ ಹಿಂದೆ"
				},
				other: {
				default:
					"ಸುಮಾರು {{count}} ತಿಂಗಳು",
					future: "ಸುಮಾರು {{count}} ತಿಂಗಳುಗಳಲ್ಲಿ",
					past: "ಸುಮಾರು {{count}} ತಿಂಗಳುಗಳ ಹಿಂದೆ"
				}
			},
			xMonths: {
				one: {
				default:
					"1 ತಿಂಗಳು",
					future: "1 ತಿಂಗಳಲ್ಲಿ",
					past: "1 ತಿಂಗಳ ಹಿಂದೆ"
				},
				other: {
				default:
					"{{count}} ತಿಂಗಳು",
					future: "{{count}} ತಿಂಗಳುಗಳಲ್ಲಿ",
					past: "{{count}} ತಿಂಗಳುಗಳ ಹಿಂದೆ"
				}
			},
			aboutXYears: {
				one: {
				default:
					"ಸುಮಾರು 1 ವರ್ಷ",
					future: "ಸುಮಾರು 1 ವರ್ಷದಲ್ಲಿ",
					past: "ಸುಮಾರು 1 ವರ್ಷದ ಹಿಂದೆ"
				},
				other: {
				default:
					"ಸುಮಾರು {{count}} ವರ್ಷಗಳು",
					future: "ಸುಮಾರು {{count}} ವರ್ಷಗಳಲ್ಲಿ",
					past: "ಸುಮಾರು {{count}} ವರ್ಷಗಳ ಹಿಂದೆ"
				}
			},
			xYears: {
				one: {
				default:
					"1 ವರ್ಷ",
					future: "1 ವರ್ಷದಲ್ಲಿ",
					past: "1 ವರ್ಷದ ಹಿಂದೆ"
				},
				other: {
				default:
					"{{count}} ವರ್ಷಗಳು",
					future: "{{count}} ವರ್ಷಗಳಲ್ಲಿ",
					past: "{{count}} ವರ್ಷಗಳ ಹಿಂದೆ"
				}
			},
			overXYears: {
				one: {
				default:
					"1 ವರ್ಷದ ಮೇಲೆ",
					future: "1 ವರ್ಷದ ಮೇಲೆ",
					past: "1 ವರ್ಷದ ಮೇಲೆ"
				},
				other: {
				default:
					"{{count}} ವರ್ಷಗಳ ಮೇಲೆ",
					future: "{{count}} ವರ್ಷಗಳ ಮೇಲೆ",
					past: "{{count}} ವರ್ಷಗಳ ಮೇಲೆ"
				}
			},
			almostXYears: {
				one: {
				default:
					"ಬಹುತೇಕ 1 ವರ್ಷದಲ್ಲಿ",
					future: "ಬಹುತೇಕ 1 ವರ್ಷದಲ್ಲಿ",
					past: "ಬಹುತೇಕ 1 ವರ್ಷದಲ್ಲಿ"
				},
				other: {
				default:
					"ಬಹುತೇಕ {{count}} ವರ್ಷಗಳಲ್ಲಿ",
					future: "ಬಹುತೇಕ {{count}} ವರ್ಷಗಳಲ್ಲಿ",
					past: "ಬಹುತೇಕ {{count}} ವರ್ಷಗಳಲ್ಲಿ"
				}
			}
		});

		function bn(e, t) {
			return t?.addSuffix ? t.comparison && t.comparison > 0 ? e.future : e.past : e.default
		}
		const wn = {
			date: X({
				formats: {
					full: "EEEE, MMMM d, y",
					long: "MMMM d, y",
					medium: "MMM d, y",
					short: "d/M/yy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "hh:mm:ss a zzzz",
					long: "hh:mm:ss a z",
					medium: "hh:mm:ss a",
					short: "hh:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		yn = {
			lastWeek: "'ಕಳೆದ' eeee p 'ಕ್ಕೆ'",
			yesterday: "'ನಿನ್ನೆ' p 'ಕ್ಕೆ'",
			today: "'ಇಂದು' p 'ಕ್ಕೆ'",
			tomorrow: "'ನಾಳೆ' p 'ಕ್ಕೆ'",
			nextWeek: "eeee p 'ಕ್ಕೆ'",
			other: "P"
		},
		Mn = (_({
				values: {
					narrow: ["ಕ್ರಿ.ಪೂ", "ಕ್ರಿ.ಶ"],
					abbreviated: ["ಕ್ರಿ.ಪೂ", "ಕ್ರಿ.ಶ"],
					wide: ["ಕ್ರಿಸ್ತ ಪೂರ್ವ", "ಕ್ರಿಸ್ತ ಶಕ"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["ತ್ರೈ 1", "ತ್ರೈ 2", "ತ್ರೈ 3", "ತ್ರೈ 4"],
					wide: ["1ನೇ ತ್ರೈಮಾಸಿಕ", "2ನೇ ತ್ರೈಮಾಸಿಕ", "3ನೇ ತ್ರೈಮಾಸಿಕ", "4ನೇ ತ್ರೈಮಾಸಿಕ"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["ಜ", "ಫೆ", "ಮಾ", "ಏ", "ಮೇ", "ಜೂ", "ಜು", "ಆ", "ಸೆ", "ಅ", "ನ", "ಡಿ"],
					abbreviated: ["ಜನ", "ಫೆಬ್ರ", "ಮಾರ್ಚ್", "ಏಪ್ರಿ", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗ", "ಸೆಪ್ಟೆಂ", "ಅಕ್ಟೋ", "ನವೆಂ", "ಡಿಸೆಂ"],
					wide: ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["ಭಾ", "ಸೋ", "ಮಂ", "ಬು", "ಗು", "ಶು", "ಶ"],
					short: ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"],
					abbreviated: ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"],
					wide: ["ಭಾನುವಾರ", "ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ಪೂರ್ವಾಹ್ನ",
						pm: "ಅಪರಾಹ್ನ",
						midnight: "ಮಧ್ಯರಾತ್ರಿ",
						noon: "ಮಧ್ಯಾಹ್ನ",
						morning: "ಬೆಳಗ್ಗೆ",
						afternoon: "ಮಧ್ಯಾಹ್ನ",
						evening: "ಸಂಜೆ",
						night: "ರಾತ್ರಿ"
					},
					abbreviated: {
						am: "ಪೂರ್ವಾಹ್ನ",
						pm: "ಅಪರಾಹ್ನ",
						midnight: "ಮಧ್ಯರಾತ್ರಿ",
						noon: "ಮಧ್ಯಾನ್ಹ",
						morning: "ಬೆಳಗ್ಗೆ",
						afternoon: "ಮಧ್ಯಾನ್ಹ",
						evening: "ಸಂಜೆ",
						night: "ರಾತ್ರಿ"
					},
					wide: {
						am: "ಪೂರ್ವಾಹ್ನ",
						pm: "ಅಪರಾಹ್ನ",
						midnight: "ಮಧ್ಯರಾತ್ರಿ",
						noon: "ಮಧ್ಯಾನ್ಹ",
						morning: "ಬೆಳಗ್ಗೆ",
						afternoon: "ಮಧ್ಯಾನ್ಹ",
						evening: "ಸಂಜೆ",
						night: "ರಾತ್ರಿ"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "ಪೂ",
						pm: "ಅ",
						midnight: "ಮಧ್ಯರಾತ್ರಿ",
						noon: "ಮಧ್ಯಾನ್ಹ",
						morning: "ಬೆಳಗ್ಗೆ",
						afternoon: "ಮಧ್ಯಾನ್ಹ",
						evening: "ಸಂಜೆ",
						night: "ರಾತ್ರಿ"
					},
					abbreviated: {
						am: "ಪೂರ್ವಾಹ್ನ",
						pm: "ಅಪರಾಹ್ನ",
						midnight: "ಮಧ್ಯ ರಾತ್ರಿ",
						noon: "ಮಧ್ಯಾನ್ಹ",
						morning: "ಬೆಳಗ್ಗೆ",
						afternoon: "ಮಧ್ಯಾನ್ಹ",
						evening: "ಸಂಜೆ",
						night: "ರಾತ್ರಿ"
					},
					wide: {
						am: "ಪೂರ್ವಾಹ್ನ",
						pm: "ಅಪರಾಹ್ನ",
						midnight: "ಮಧ್ಯ ರಾತ್ರಿ",
						noon: "ಮಧ್ಯಾನ್ಹ",
						morning: "ಬೆಳಗ್ಗೆ",
						afternoon: "ಮಧ್ಯಾನ್ಹ",
						evening: "ಸಂಜೆ",
						night: "ರಾತ್ರಿ"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(ನೇ|ನೆ)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ಕ್ರಿ.ಪೂ|ಕ್ರಿ.ಶ)/i,
					abbreviated: /^(ಕ್ರಿ\.?\s?ಪೂ\.?|ಕ್ರಿ\.?\s?ಶ\.?|ಪ್ರ\.?\s?ಶ\.?)/i,
					wide: /^(ಕ್ರಿಸ್ತ ಪೂರ್ವ|ಕ್ರಿಸ್ತ ಶಕ|ಪ್ರಸಕ್ತ ಶಕ)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^ಪೂ/i, /^(ಶ|ಪ್ರ)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^ತ್ರೈ[1234]|ತ್ರೈ [1234]| [1234]ತ್ರೈ/i,
					wide: /^[1234](ನೇ)? ತ್ರೈಮಾಸಿಕ/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(ಜೂ|ಜು|ಜ|ಫೆ|ಮಾ|ಏ|ಮೇ|ಆ|ಸೆ|ಅ|ನ|ಡಿ)/i,
					abbreviated: /^(ಜನ|ಫೆಬ್ರ|ಮಾರ್ಚ್|ಏಪ್ರಿ|ಮೇ|ಜೂನ್|ಜುಲೈ|ಆಗ|ಸೆಪ್ಟೆಂ|ಅಕ್ಟೋ|ನವೆಂ|ಡಿಸೆಂ)/i,
					wide: /^(ಜನವರಿ|ಫೆಬ್ರವರಿ|ಮಾರ್ಚ್|ಏಪ್ರಿಲ್|ಮೇ|ಜೂನ್|ಜುಲೈ|ಆಗಸ್ಟ್|ಸೆಪ್ಟೆಂಬರ್|ಅಕ್ಟೋಬರ್|ನವೆಂಬರ್|ಡಿಸೆಂಬರ್)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ಜ$/i, /^ಫೆ/i, /^ಮಾ/i, /^ಏ/i, /^ಮೇ/i, /^ಜೂ/i, /^ಜು$/i, /^ಆ/i, /^ಸೆ/i, /^ಅ/i, /^ನ/i, /^ಡಿ/i],
					any: [/^ಜನ/i, /^ಫೆ/i, /^ಮಾ/i, /^ಏ/i, /^ಮೇ/i, /^ಜೂನ್/i, /^ಜುಲೈ/i, /^ಆ/i, /^ಸೆ/i, /^ಅ/i, /^ನ/i, /^ಡಿ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(ಭಾ|ಸೋ|ಮ|ಬು|ಗು|ಶು|ಶ)/i,
					short: /^(ಭಾನು|ಸೋಮ|ಮಂಗಳ|ಬುಧ|ಗುರು|ಶುಕ್ರ|ಶನಿ)/i,
					abbreviated: /^(ಭಾನು|ಸೋಮ|ಮಂಗಳ|ಬುಧ|ಗುರು|ಶುಕ್ರ|ಶನಿ)/i,
					wide: /^(ಭಾನುವಾರ|ಸೋಮವಾರ|ಮಂಗಳವಾರ|ಬುಧವಾರ|ಗುರುವಾರ|ಶುಕ್ರವಾರ|ಶನಿವಾರ)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ಭಾ/i, /^ಸೋ/i, /^ಮ/i, /^ಬು/i, /^ಗು/i, /^ಶು/i, /^ಶ/i],
					any: [/^ಭಾ/i, /^ಸೋ/i, /^ಮ/i, /^ಬು/i, /^ಗು/i, /^ಶು/i, /^ಶ/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(ಪೂ|ಅ|ಮಧ್ಯರಾತ್ರಿ|ಮಧ್ಯಾನ್ಹ|ಬೆಳಗ್ಗೆ|ಸಂಜೆ|ರಾತ್ರಿ)/i,
					any: /^(ಪೂರ್ವಾಹ್ನ|ಅಪರಾಹ್ನ|ಮಧ್ಯರಾತ್ರಿ|ಮಧ್ಯಾನ್ಹ|ಬೆಳಗ್ಗೆ|ಸಂಜೆ|ರಾತ್ರಿ)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^ಪೂ/i,
						pm: /^ಅ/i,
						midnight: /ಮಧ್ಯರಾತ್ರಿ/i,
						noon: /ಮಧ್ಯಾನ್ಹ/i,
						morning: /ಬೆಳಗ್ಗೆ/i,
						afternoon: /ಮಧ್ಯಾನ್ಹ/i,
						evening: /ಸಂಜೆ/i,
						night: /ರಾತ್ರಿ/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "1초 미만",
				other: "{{count}}초 미만"
			},
			xSeconds: {
				one: "1초",
				other: "{{count}}초"
			},
			halfAMinute: "30초",
			lessThanXMinutes: {
				one: "1분 미만",
				other: "{{count}}분 미만"
			},
			xMinutes: {
				one: "1분",
				other: "{{count}}분"
			},
			aboutXHours: {
				one: "약 1시간",
				other: "약 {{count}}시간"
			},
			xHours: {
				one: "1시간",
				other: "{{count}}시간"
			},
			xDays: {
				one: "1일",
				other: "{{count}}일"
			},
			aboutXWeeks: {
				one: "약 1주",
				other: "약 {{count}}주"
			},
			xWeeks: {
				one: "1주",
				other: "{{count}}주"
			},
			aboutXMonths: {
				one: "약 1개월",
				other: "약 {{count}}개월"
			},
			xMonths: {
				one: "1개월",
				other: "{{count}}개월"
			},
			aboutXYears: {
				one: "약 1년",
				other: "약 {{count}}년"
			},
			xYears: {
				one: "1년",
				other: "{{count}}년"
			},
			overXYears: {
				one: "1년 이상",
				other: "{{count}}년 이상"
			},
			almostXYears: {
				one: "거의 1년",
				other: "거의 {{count}}년"
			}
		}),
		kn = {
			date: X({
				formats: {
					full: "y년 M월 d일 EEEE",
					long: "y년 M월 d일",
					medium: "y.MM.dd",
					short: "y.MM.dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "a H시 mm분 ss초 zzzz",
					long: "a H:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Pn = {
			lastWeek: "'지난' eeee p",
			yesterday: "'어제' p",
			today: "'오늘' p",
			tomorrow: "'내일' p",
			nextWeek: "'다음' eeee p",
			other: "P"
		},
		Wn = (_({
				values: {
					narrow: ["BC", "AD"],
					abbreviated: ["BC", "AD"],
					wide: ["기원전", "서기"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["1분기", "2분기", "3분기", "4분기"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
					abbreviated: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
					wide: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["일", "월", "화", "수", "목", "금", "토"],
					short: ["일", "월", "화", "수", "목", "금", "토"],
					abbreviated: ["일", "월", "화", "수", "목", "금", "토"],
					wide: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "오전",
						pm: "오후",
						midnight: "자정",
						noon: "정오",
						morning: "아침",
						afternoon: "오후",
						evening: "저녁",
						night: "밤"
					},
					abbreviated: {
						am: "오전",
						pm: "오후",
						midnight: "자정",
						noon: "정오",
						morning: "아침",
						afternoon: "오후",
						evening: "저녁",
						night: "밤"
					},
					wide: {
						am: "오전",
						pm: "오후",
						midnight: "자정",
						noon: "정오",
						morning: "아침",
						afternoon: "오후",
						evening: "저녁",
						night: "밤"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "오전",
						pm: "오후",
						midnight: "자정",
						noon: "정오",
						morning: "아침",
						afternoon: "오후",
						evening: "저녁",
						night: "밤"
					},
					abbreviated: {
						am: "오전",
						pm: "오후",
						midnight: "자정",
						noon: "정오",
						morning: "아침",
						afternoon: "오후",
						evening: "저녁",
						night: "밤"
					},
					wide: {
						am: "오전",
						pm: "오후",
						midnight: "자정",
						noon: "정오",
						morning: "아침",
						afternoon: "오후",
						evening: "저녁",
						night: "밤"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(일|번째)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
					abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
					wide: /^(기원전|서기)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^(bc|기원전)/i, /^(ad|서기)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234]사?분기/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(1[012]|[123456789])/,
					abbreviated: /^(1[012]|[123456789])월/i,
					wide: /^(1[012]|[123456789])월/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^1월?$/, /^2/, /^3/, /^4/, /^5/, /^6/, /^7/, /^8/, /^9/, /^10/, /^11/, /^12/]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[일월화수목금토]/,
					short: /^[일월화수목금토]/,
					abbreviated: /^[일월화수목금토]/,
					wide: /^[일월화수목금토]요일/
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^일/, /^월/, /^화/, /^수/, /^목/, /^금/, /^토/]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(am|pm|오전|오후|자정|정오|아침|저녁|밤)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^(am|오전)/i,
						pm: /^(pm|오후)/i,
						midnight: /^자정/i,
						noon: /^정오/i,
						morning: /^아침/i,
						afternoon: /^오후/i,
						evening: /^저녁/i,
						night: /^밤/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				standalone: {
					one: "manner wéi eng Sekonn",
					other: "manner wéi {{count}} Sekonnen"
				},
				withPreposition: {
					one: "manner wéi enger Sekonn",
					other: "manner wéi {{count}} Sekonnen"
				}
			},
			xSeconds: {
				standalone: {
					one: "eng Sekonn",
					other: "{{count}} Sekonnen"
				},
				withPreposition: {
					one: "enger Sekonn",
					other: "{{count}} Sekonnen"
				}
			},
			halfAMinute: {
				standalone: "eng hallef Minutt",
				withPreposition: "enger hallwer Minutt"
			},
			lessThanXMinutes: {
				standalone: {
					one: "manner wéi eng Minutt",
					other: "manner wéi {{count}} Minutten"
				},
				withPreposition: {
					one: "manner wéi enger Minutt",
					other: "manner wéi {{count}} Minutten"
				}
			},
			xMinutes: {
				standalone: {
					one: "eng Minutt",
					other: "{{count}} Minutten"
				},
				withPreposition: {
					one: "enger Minutt",
					other: "{{count}} Minutten"
				}
			},
			aboutXHours: {
				standalone: {
					one: "ongeféier eng Stonn",
					other: "ongeféier {{count}} Stonnen"
				},
				withPreposition: {
					one: "ongeféier enger Stonn",
					other: "ongeféier {{count}} Stonnen"
				}
			},
			xHours: {
				standalone: {
					one: "eng Stonn",
					other: "{{count}} Stonnen"
				},
				withPreposition: {
					one: "enger Stonn",
					other: "{{count}} Stonnen"
				}
			},
			xDays: {
				standalone: {
					one: "een Dag",
					other: "{{count}} Deeg"
				},
				withPreposition: {
					one: "engem Dag",
					other: "{{count}} Deeg"
				}
			},
			aboutXWeeks: {
				standalone: {
					one: "ongeféier eng Woch",
					other: "ongeféier {{count}} Wochen"
				},
				withPreposition: {
					one: "ongeféier enger Woche",
					other: "ongeféier {{count}} Wochen"
				}
			},
			xWeeks: {
				standalone: {
					one: "eng Woch",
					other: "{{count}} Wochen"
				},
				withPreposition: {
					one: "enger Woch",
					other: "{{count}} Wochen"
				}
			},
			aboutXMonths: {
				standalone: {
					one: "ongeféier ee Mount",
					other: "ongeféier {{count}} Méint"
				},
				withPreposition: {
					one: "ongeféier engem Mount",
					other: "ongeféier {{count}} Méint"
				}
			},
			xMonths: {
				standalone: {
					one: "ee Mount",
					other: "{{count}} Méint"
				},
				withPreposition: {
					one: "engem Mount",
					other: "{{count}} Méint"
				}
			},
			aboutXYears: {
				standalone: {
					one: "ongeféier ee Joer",
					other: "ongeféier {{count}} Joer"
				},
				withPreposition: {
					one: "ongeféier engem Joer",
					other: "ongeféier {{count}} Joer"
				}
			},
			xYears: {
				standalone: {
					one: "ee Joer",
					other: "{{count}} Joer"
				},
				withPreposition: {
					one: "engem Joer",
					other: "{{count}} Joer"
				}
			},
			overXYears: {
				standalone: {
					one: "méi wéi ee Joer",
					other: "méi wéi {{count}} Joer"
				},
				withPreposition: {
					one: "méi wéi engem Joer",
					other: "méi wéi {{count}} Joer"
				}
			},
			almostXYears: {
				standalone: {
					one: "bal ee Joer",
					other: "bal {{count}} Joer"
				},
				withPreposition: {
					one: "bal engem Joer",
					other: "bal {{count}} Joer"
				}
			}
		}),
		jn = ["d", "h", "n", "t", "z"],
		xn = ["a,", "e", "i", "o", "u"],
		zn = [0, 1, 2, 3, 8, 9],
		Tn = [40, 50, 60, 70];

		function En(e) {
			const t = e.charAt(0).toLowerCase();
			if (-1 != xn.indexOf(t) || -1 != jn.indexOf(t))
				return !0;
			const n = e.split(" ")[0],
			a = parseInt(n);
			return !isNaN(a) && -1 != zn.indexOf(a % 10) && -1 == Tn.indexOf(parseInt(n.substring(0, 2)))
		}
		const Sn = {
			date: X({
				formats: {
					full: "EEEE, do MMMM y",
					long: "do MMMM y",
					medium: "do MMM y",
					short: "dd.MM.yy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'um' {{time}}",
					long: "{{date}} 'um' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Cn = {
			lastWeek: e => {
				const t = e.getDay();
				let n = "'läschte";
				return 2 !== t && 4 !== t || (n += "n"),
				n += "' eeee 'um' p",
				n
			},
			yesterday: "'gëschter um' p",
			today: "'haut um' p",
			tomorrow: "'moien um' p",
			nextWeek: "eeee 'um' p",
			other: "P"
		},
		An = (_({
				values: {
					narrow: ["v.Chr.", "n.Chr."],
					abbreviated: ["v.Chr.", "n.Chr."],
					wide: ["viru Christus", "no Christus"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["Jan", "Feb", "Mäe", "Abr", "Mee", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
					wide: ["Januar", "Februar", "Mäerz", "Abrëll", "Mee", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["S", "M", "D", "M", "D", "F", "S"],
					short: ["So", "Mé", "Dë", "Më", "Do", "Fr", "Sa"],
					abbreviated: ["So.", "Mé.", "Dë.", "Më.", "Do.", "Fr.", "Sa."],
					wide: ["Sonndeg", "Méindeg", "Dënschdeg", "Mëttwoch", "Donneschdeg", "Freideg", "Samschdeg"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "mo.",
						pm: "nomë.",
						midnight: "Mëtternuecht",
						noon: "Mëtteg",
						morning: "Moien",
						afternoon: "Nomëtteg",
						evening: "Owend",
						night: "Nuecht"
					},
					abbreviated: {
						am: "moies",
						pm: "nomëttes",
						midnight: "Mëtternuecht",
						noon: "Mëtteg",
						morning: "Moien",
						afternoon: "Nomëtteg",
						evening: "Owend",
						night: "Nuecht"
					},
					wide: {
						am: "moies",
						pm: "nomëttes",
						midnight: "Mëtternuecht",
						noon: "Mëtteg",
						morning: "Moien",
						afternoon: "Nomëtteg",
						evening: "Owend",
						night: "Nuecht"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "mo.",
						pm: "nom.",
						midnight: "Mëtternuecht",
						noon: "mëttes",
						morning: "moies",
						afternoon: "nomëttes",
						evening: "owes",
						night: "nuets"
					},
					abbreviated: {
						am: "moies",
						pm: "nomëttes",
						midnight: "Mëtternuecht",
						noon: "mëttes",
						morning: "moies",
						afternoon: "nomëttes",
						evening: "owes",
						night: "nuets"
					},
					wide: {
						am: "moies",
						pm: "nomëttes",
						midnight: "Mëtternuecht",
						noon: "mëttes",
						morning: "moies",
						afternoon: "nomëttes",
						evening: "owes",
						night: "nuets"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(\.)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
					abbreviated: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
					wide: /^(viru Christus|virun eiser Zäitrechnung|no Christus|eiser Zäitrechnung)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^v/i, /^n/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234](\.)? Quartal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan|feb|mäe|abr|mee|jun|jul|aug|sep|okt|nov|dez)/i,
					wide: /^(januar|februar|mäerz|abrëll|mee|juni|juli|august|september|oktober|november|dezember)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mä/i, /^ab/i, /^me/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[smdf]/i,
					short: /^(so|mé|dë|më|do|fr|sa)/i,
					abbreviated: /^(son?|méi?|dën?|mët?|don?|fre?|sam?)\.?/i,
					wide: /^(sonndeg|méindeg|dënschdeg|mëttwoch|donneschdeg|freideg|samschdeg)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^so/i, /^mé/i, /^dë/i, /^më/i, /^do/i, /^f/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(mo\.?|nomë\.?|Mëtternuecht|mëttes|moies|nomëttes|owes|nuets)/i,
					abbreviated: /^(moi\.?|nomët\.?|Mëtternuecht|mëttes|moies|nomëttes|owes|nuets)/i,
					wide: /^(moies|nomëttes|Mëtternuecht|mëttes|moies|nomëttes|owes|nuets)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: {
						am: /^m/i,
						pm: /^n/i,
						midnight: /^Mëtter/i,
						noon: /^mëttes/i,
						morning: /moies/i,
						afternoon: /nomëttes/i,
						evening: /owes/i,
						night: /nuets/i
					}
				},
				defaultParseWidth: "any"
			}), {
			xseconds_other: "sekundė_sekundžių_sekundes",
			xminutes_one: "minutė_minutės_minutę",
			xminutes_other: "minutės_minučių_minutes",
			xhours_one: "valanda_valandos_valandą",
			xhours_other: "valandos_valandų_valandas",
			xdays_one: "diena_dienos_dieną",
			xdays_other: "dienos_dienų_dienas",
			xweeks_one: "savaitė_savaitės_savaitę",
			xweeks_other: "savaitės_savaičių_savaites",
			xmonths_one: "mėnuo_mėnesio_mėnesį",
			xmonths_other: "mėnesiai_mėnesių_mėnesius",
			xyears_one: "metai_metų_metus",
			xyears_other: "metai_metų_metus",
			about: "apie",
			over: "daugiau nei",
			almost: "beveik",
			lessthan: "mažiau nei"
		}),
		Hn = (e, t, n, a) => t ? a ? "kelių sekundžių" : "kelias sekundes" : "kelios sekundės",
		Nn = (e, t, n, a) => t ? a ? Dn(n)[1] : Dn(n)[2] : Dn(n)[0],
		Xn = (e, t, n, a) => {
			const i = e + " ";
			return 1 === e ? i + Nn(0, t, n, a) : t ? a ? i + Dn(n)[1] : i + (In(e) ? Dn(n)[1] : Dn(n)[2]) : i + (In(e) ? Dn(n)[1] : Dn(n)[0])
		};

		function In(e) {
			return e % 10 == 0 || e > 10 && e < 20
		}

		function Dn(e) {
			return An[e].split("_")
		}
		const _n = {
			lessThanXSeconds: {
				one: Hn,
				other: Xn
			},
			xSeconds: {
				one: Hn,
				other: Xn
			},
			halfAMinute: "pusė minutės",
			lessThanXMinutes: {
				one: Nn,
				other: Xn
			},
			xMinutes: {
				one: Nn,
				other: Xn
			},
			aboutXHours: {
				one: Nn,
				other: Xn
			},
			xHours: {
				one: Nn,
				other: Xn
			},
			xDays: {
				one: Nn,
				other: Xn
			},
			aboutXWeeks: {
				one: Nn,
				other: Xn
			},
			xWeeks: {
				one: Nn,
				other: Xn
			},
			aboutXMonths: {
				one: Nn,
				other: Xn
			},
			xMonths: {
				one: Nn,
				other: Xn
			},
			aboutXYears: {
				one: Nn,
				other: Xn
			},
			xYears: {
				one: Nn,
				other: Xn
			},
			overXYears: {
				one: Nn,
				other: Xn
			},
			almostXYears: {
				one: Nn,
				other: Xn
			}
		},
		Gn = {
			date: X({
				formats: {
					full: "y 'm'. MMMM d 'd'., EEEE",
					long: "y 'm'. MMMM d 'd'.",
					medium: "y-MM-dd",
					short: "y-MM-dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Fn = {
			lastWeek: "'Praėjusį' eeee p",
			yesterday: "'Vakar' p",
			today: "'Šiandien' p",
			tomorrow: "'Rytoj' p",
			nextWeek: "eeee p",
			other: "P"
		};
		_({
			values: {
				narrow: ["pr. Kr.", "po Kr."],
				abbreviated: ["pr. Kr.", "po Kr."],
				wide: ["prieš Kristų", "po Kristaus"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["I ketv.", "II ketv.", "III ketv.", "IV ketv."],
				wide: ["I ketvirtis", "II ketvirtis", "III ketvirtis", "IV ketvirtis"]
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["I k.", "II k.", "III k.", "IV k."],
				wide: ["I ketvirtis", "II ketvirtis", "III ketvirtis", "IV ketvirtis"]
			},
			defaultFormattingWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["S", "V", "K", "B", "G", "B", "L", "R", "R", "S", "L", "G"],
				abbreviated: ["saus.", "vas.", "kov.", "bal.", "geg.", "birž.", "liep.", "rugp.", "rugs.", "spal.", "lapkr.", "gruod."],
				wide: ["sausis", "vasaris", "kovas", "balandis", "gegužė", "birželis", "liepa", "rugpjūtis", "rugsėjis", "spalis", "lapkritis", "gruodis"]
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: ["S", "V", "K", "B", "G", "B", "L", "R", "R", "S", "L", "G"],
				abbreviated: ["saus.", "vas.", "kov.", "bal.", "geg.", "birž.", "liep.", "rugp.", "rugs.", "spal.", "lapkr.", "gruod."],
				wide: ["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio"]
			},
			defaultFormattingWidth: "wide"
		}),
		_({
			values: {
				narrow: ["S", "P", "A", "T", "K", "P", "Š"],
				short: ["Sk", "Pr", "An", "Tr", "Kt", "Pn", "Št"],
				abbreviated: ["sk", "pr", "an", "tr", "kt", "pn", "št"],
				wide: ["sekmadienis", "pirmadienis", "antradienis", "trečiadienis", "ketvirtadienis", "penktadienis", "šeštadienis"]
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: ["S", "P", "A", "T", "K", "P", "Š"],
				short: ["Sk", "Pr", "An", "Tr", "Kt", "Pn", "Št"],
				abbreviated: ["sk", "pr", "an", "tr", "kt", "pn", "št"],
				wide: ["sekmadienį", "pirmadienį", "antradienį", "trečiadienį", "ketvirtadienį", "penktadienį", "šeštadienį"]
			},
			defaultFormattingWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "pr. p.",
					pm: "pop.",
					midnight: "vidurnaktis",
					noon: "vidurdienis",
					morning: "rytas",
					afternoon: "diena",
					evening: "vakaras",
					night: "naktis"
				},
				abbreviated: {
					am: "priešpiet",
					pm: "popiet",
					midnight: "vidurnaktis",
					noon: "vidurdienis",
					morning: "rytas",
					afternoon: "diena",
					evening: "vakaras",
					night: "naktis"
				},
				wide: {
					am: "priešpiet",
					pm: "popiet",
					midnight: "vidurnaktis",
					noon: "vidurdienis",
					morning: "rytas",
					afternoon: "diena",
					evening: "vakaras",
					night: "naktis"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "pr. p.",
					pm: "pop.",
					midnight: "vidurnaktis",
					noon: "perpiet",
					morning: "rytas",
					afternoon: "popietė",
					evening: "vakaras",
					night: "naktis"
				},
				abbreviated: {
					am: "priešpiet",
					pm: "popiet",
					midnight: "vidurnaktis",
					noon: "perpiet",
					morning: "rytas",
					afternoon: "popietė",
					evening: "vakaras",
					night: "naktis"
				},
				wide: {
					am: "priešpiet",
					pm: "popiet",
					midnight: "vidurnaktis",
					noon: "perpiet",
					morning: "rytas",
					afternoon: "popietė",
					evening: "vakaras",
					night: "naktis"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(-oji)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^p(r|o)\.?\s?(kr\.?|me)/i,
				abbreviated: /^(pr\.\s?(kr\.|m\.\s?e\.)|po\s?kr\.|mūsų eroje)/i,
				wide: /^(prieš Kristų|prieš mūsų erą|po Kristaus|mūsų eroje)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				wide: [/prieš/i, /(po|mūsų)/i],
				any: [/^pr/i, /^(po|m)/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^([1234])/i,
				abbreviated: /^(I|II|III|IV)\s?ketv?\.?/i,
				wide: /^(I|II|III|IV)\s?ketvirtis/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/1/i, /2/i, /3/i, /4/i],
				any: [/I$/i, /II$/i, /III/i, /IV/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[svkbglr]/i,
				abbreviated: /^(saus\.|vas\.|kov\.|bal\.|geg\.|birž\.|liep\.|rugp\.|rugs\.|spal\.|lapkr\.|gruod\.)/i,
				wide: /^(sausi(s|o)|vasari(s|o)|kov(a|o)s|balandž?i(s|o)|gegužės?|birželi(s|o)|liep(a|os)|rugpjū(t|č)i(s|o)|rugsėj(is|o)|spali(s|o)|lapkri(t|č)i(s|o)|gruodž?i(s|o))/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^s/i, /^v/i, /^k/i, /^b/i, /^g/i, /^b/i, /^l/i, /^r/i, /^r/i, /^s/i, /^l/i, /^g/i],
				any: [/^saus/i, /^vas/i, /^kov/i, /^bal/i, /^geg/i, /^birž/i, /^liep/i, /^rugp/i, /^rugs/i, /^spal/i, /^lapkr/i, /^gruod/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[spatkš]/i,
				short: /^(sk|pr|an|tr|kt|pn|št)/i,
				abbreviated: /^(sk|pr|an|tr|kt|pn|št)/i,
				wide: /^(sekmadien(is|į)|pirmadien(is|į)|antradien(is|į)|trečiadien(is|į)|ketvirtadien(is|į)|penktadien(is|į)|šeštadien(is|į))/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^s/i, /^p/i, /^a/i, /^t/i, /^k/i, /^p/i, /^š/i],
				wide: [/^se/i, /^pi/i, /^an/i, /^tr/i, /^ke/i, /^pe/i, /^še/i],
				any: [/^sk/i, /^pr/i, /^an/i, /^tr/i, /^kt/i, /^pn/i, /^št/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(pr.\s?p.|pop.|vidurnaktis|(vidurdienis|perpiet)|rytas|(diena|popietė)|vakaras|naktis)/i,
				any: /^(priešpiet|popiet$|vidurnaktis|(vidurdienis|perpiet)|rytas|(diena|popietė)|vakaras|naktis)/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				narrow: {
					am: /^pr/i,
					pm: /^pop./i,
					midnight: /^vidurnaktis/i,
					noon: /^(vidurdienis|perp)/i,
					morning: /rytas/i,
					afternoon: /(die|popietė)/i,
					evening: /vakaras/i,
					night: /naktis/i
				},
				any: {
					am: /^pr/i,
					pm: /^popiet$/i,
					midnight: /^vidurnaktis/i,
					noon: /^(vidurdienis|perp)/i,
					morning: /rytas/i,
					afternoon: /(die|popietė)/i,
					evening: /vakaras/i,
					night: /naktis/i
				}
			},
			defaultParseWidth: "any"
		});

		function On(e) {
			return (t, n) => {
				if (1 === t)
					return n?.addSuffix ? e.one[0].replace("{{time}}", e.one[2]) : e.one[0].replace("{{time}}", e.one[1]); {
					const a = t % 10 == 1 && t % 100 != 11;
					return n?.addSuffix ? e.other[0].replace("{{time}}", a ? e.other[3] : e.other[4]).replace("{{count}}", String(t)) : e.other[0].replace("{{time}}", a ? e.other[1] : e.other[2]).replace("{{count}}", String(t))
				}
			}
		}
		const Yn = {
			lessThanXSeconds: On({
				one: ["mazāk par {{time}}", "sekundi", "sekundi"],
				other: ["mazāk nekā {{count}} {{time}}", "sekunde", "sekundes", "sekundes", "sekundēm"]
			}),
			xSeconds: On({
				one: ["1 {{time}}", "sekunde", "sekundes"],
				other: ["{{count}} {{time}}", "sekunde", "sekundes", "sekundes", "sekundēm"]
			}),
			halfAMinute: (e, t) => t?.addSuffix ? "pusminūtes" : "pusminūte",
			lessThanXMinutes: On({
				one: ["mazāk par {{time}}", "minūti", "minūti"],
				other: ["mazāk nekā {{count}} {{time}}", "minūte", "minūtes", "minūtes", "minūtēm"]
			}),
			xMinutes: On({
				one: ["1 {{time}}", "minūte", "minūtes"],
				other: ["{{count}} {{time}}", "minūte", "minūtes", "minūtes", "minūtēm"]
			}),
			aboutXHours: On({
				one: ["apmēram 1 {{time}}", "stunda", "stundas"],
				other: ["apmēram {{count}} {{time}}", "stunda", "stundas", "stundas", "stundām"]
			}),
			xHours: On({
				one: ["1 {{time}}", "stunda", "stundas"],
				other: ["{{count}} {{time}}", "stunda", "stundas", "stundas", "stundām"]
			}),
			xDays: On({
				one: ["1 {{time}}", "diena", "dienas"],
				other: ["{{count}} {{time}}", "diena", "dienas", "dienas", "dienām"]
			}),
			aboutXWeeks: On({
				one: ["apmēram 1 {{time}}", "nedēļa", "nedēļas"],
				other: ["apmēram {{count}} {{time}}", "nedēļa", "nedēļu", "nedēļas", "nedēļām"]
			}),
			xWeeks: On({
				one: ["1 {{time}}", "nedēļa", "nedēļas"],
				other: ["{{count}} {{time}}", "nedēļa", "nedēļu", "nedēļas", "nedēļām"]
			}),
			aboutXMonths: On({
				one: ["apmēram 1 {{time}}", "mēnesis", "mēneša"],
				other: ["apmēram {{count}} {{time}}", "mēnesis", "mēneši", "mēneša", "mēnešiem"]
			}),
			xMonths: On({
				one: ["1 {{time}}", "mēnesis", "mēneša"],
				other: ["{{count}} {{time}}", "mēnesis", "mēneši", "mēneša", "mēnešiem"]
			}),
			aboutXYears: On({
				one: ["apmēram 1 {{time}}", "gads", "gada"],
				other: ["apmēram {{count}} {{time}}", "gads", "gadi", "gada", "gadiem"]
			}),
			xYears: On({
				one: ["1 {{time}}", "gads", "gada"],
				other: ["{{count}} {{time}}", "gads", "gadi", "gada", "gadiem"]
			}),
			overXYears: On({
				one: ["ilgāk par 1 {{time}}", "gadu", "gadu"],
				other: ["vairāk nekā {{count}} {{time}}", "gads", "gadi", "gada", "gadiem"]
			}),
			almostXYears: On({
				one: ["gandrīz 1 {{time}}", "gads", "gada"],
				other: ["vairāk nekā {{count}} {{time}}", "gads", "gadi", "gada", "gadiem"]
			})
		},
		$n = {
			date: X({
				formats: {
					full: "EEEE, y. 'gada' d. MMMM",
					long: "y. 'gada' d. MMMM",
					medium: "dd.MM.y.",
					short: "dd.MM.y."
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'plkst.' {{time}}",
					long: "{{date}} 'plkst.' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Kn = ["svētdienā", "pirmdienā", "otrdienā", "trešdienā", "ceturtdienā", "piektdienā", "sestdienā"],
		Jn = {
			lastWeek: (e, t, n) => {
				if (me(e, t, n))
					return "eeee 'plkst.' p";
				return "'Pagājušā " + Kn[e.getDay()] + " plkst.' p"
			},
			yesterday: "'Vakar plkst.' p",
			today: "'Šodien plkst.' p",
			tomorrow: "'Rīt plkst.' p",
			nextWeek: (e, t, n) => {
				if (me(e, t, n))
					return "eeee 'plkst.' p";
				return "'Nākamajā " + Kn[e.getDay()] + " plkst.' p"
			},
			other: "P"
		},
		Vn = (_({
				values: {
					narrow: ["p.m.ē", "m.ē"],
					abbreviated: ["p. m. ē.", "m. ē."],
					wide: ["pirms mūsu ēras", "mūsu ērā"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1. cet.", "2. cet.", "3. cet.", "4. cet."],
					wide: ["pirmais ceturksnis", "otrais ceturksnis", "trešais ceturksnis", "ceturtais ceturksnis"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1. cet.", "2. cet.", "3. cet.", "4. cet."],
					wide: ["pirmajā ceturksnī", "otrajā ceturksnī", "trešajā ceturksnī", "ceturtajā ceturksnī"]
				},
				defaultFormattingWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["janv.", "febr.", "marts", "apr.", "maijs", "jūn.", "jūl.", "aug.", "sept.", "okt.", "nov.", "dec."],
					wide: ["janvāris", "februāris", "marts", "aprīlis", "maijs", "jūnijs", "jūlijs", "augusts", "septembris", "oktobris", "novembris", "decembris"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["janv.", "febr.", "martā", "apr.", "maijs", "jūn.", "jūl.", "aug.", "sept.", "okt.", "nov.", "dec."],
					wide: ["janvārī", "februārī", "martā", "aprīlī", "maijā", "jūnijā", "jūlijā", "augustā", "septembrī", "oktobrī", "novembrī", "decembrī"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["S", "P", "O", "T", "C", "P", "S"],
					short: ["Sv", "P", "O", "T", "C", "Pk", "S"],
					abbreviated: ["svētd.", "pirmd.", "otrd.", "trešd.", "ceturtd.", "piektd.", "sestd."],
					wide: ["svētdiena", "pirmdiena", "otrdiena", "trešdiena", "ceturtdiena", "piektdiena", "sestdiena"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["S", "P", "O", "T", "C", "P", "S"],
					short: ["Sv", "P", "O", "T", "C", "Pk", "S"],
					abbreviated: ["svētd.", "pirmd.", "otrd.", "trešd.", "ceturtd.", "piektd.", "sestd."],
					wide: ["svētdienā", "pirmdienā", "otrdienā", "trešdienā", "ceturtdienā", "piektdienā", "sestdienā"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "am",
						pm: "pm",
						midnight: "pusn.",
						noon: "pusd.",
						morning: "rīts",
						afternoon: "diena",
						evening: "vakars",
						night: "nakts"
					},
					abbreviated: {
						am: "am",
						pm: "pm",
						midnight: "pusn.",
						noon: "pusd.",
						morning: "rīts",
						afternoon: "pēcpusd.",
						evening: "vakars",
						night: "nakts"
					},
					wide: {
						am: "am",
						pm: "pm",
						midnight: "pusnakts",
						noon: "pusdienlaiks",
						morning: "rīts",
						afternoon: "pēcpusdiena",
						evening: "vakars",
						night: "nakts"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "am",
						pm: "pm",
						midnight: "pusn.",
						noon: "pusd.",
						morning: "rītā",
						afternoon: "dienā",
						evening: "vakarā",
						night: "naktī"
					},
					abbreviated: {
						am: "am",
						pm: "pm",
						midnight: "pusn.",
						noon: "pusd.",
						morning: "rītā",
						afternoon: "pēcpusd.",
						evening: "vakarā",
						night: "naktī"
					},
					wide: {
						am: "am",
						pm: "pm",
						midnight: "pusnaktī",
						noon: "pusdienlaikā",
						morning: "rītā",
						afternoon: "pēcpusdienā",
						evening: "vakarā",
						night: "naktī"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)\./i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(p\.m\.ē|m\.ē)/i,
					abbreviated: /^(p\. m\. ē\.|m\. ē\.)/i,
					wide: /^(pirms mūsu ēras|mūsu ērā)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^p/i, /^m/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234](\. cet\.)/i,
					wide: /^(pirma(is|jā)|otra(is|jā)|treša(is|jā)|ceturta(is|jā)) ceturksn(is|ī)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^1/i, /^2/i, /^3/i, /^4/i],
					abbreviated: [/^1/i, /^2/i, /^3/i, /^4/i],
					wide: [/^p/i, /^o/i, /^t/i, /^c/i]
				},
				defaultParseWidth: "wide",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(janv\.|febr\.|marts|apr\.|maijs|jūn\.|jūl\.|aug\.|sept\.|okt\.|nov\.|dec\.)/i,
					wide: /^(janvār(is|ī)|februār(is|ī)|mart[sā]|aprīl(is|ī)|maij[sā]|jūnij[sā]|jūlij[sā]|august[sā]|septembr(is|ī)|oktobr(is|ī)|novembr(is|ī)|decembr(is|ī))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^mai/i, /^jūn/i, /^jūl/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[spotc]/i,
					short: /^(sv|pi|o|t|c|pk|s)/i,
					abbreviated: /^(svētd\.|pirmd\.|otrd.\|trešd\.|ceturtd\.|piektd\.|sestd\.)/i,
					wide: /^(svētdien(a|ā)|pirmdien(a|ā)|otrdien(a|ā)|trešdien(a|ā)|ceturtdien(a|ā)|piektdien(a|ā)|sestdien(a|ā))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^s/i, /^p/i, /^o/i, /^t/i, /^c/i, /^p/i, /^s/i],
					any: [/^sv/i, /^pi/i, /^o/i, /^t/i, /^c/i, /^p/i, /^se/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(am|pm|pusn\.|pusd\.|rīt(s|ā)|dien(a|ā)|vakar(s|ā)|nakt(s|ī))/,
					abbreviated: /^(am|pm|pusn\.|pusd\.|rīt(s|ā)|pēcpusd\.|vakar(s|ā)|nakt(s|ī))/,
					wide: /^(am|pm|pusnakt(s|ī)|pusdienlaik(s|ā)|rīt(s|ā)|pēcpusdien(a|ā)|vakar(s|ā)|nakt(s|ī))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: {
						am: /^am/i,
						pm: /^pm/i,
						midnight: /^pusn/i,
						noon: /^pusd/i,
						morning: /^r/i,
						afternoon: /^(d|pēc)/i,
						evening: /^v/i,
						night: /^n/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "помалку од секунда",
				other: "помалку од {{count}} секунди"
			},
			xSeconds: {
				one: "1 секунда",
				other: "{{count}} секунди"
			},
			halfAMinute: "половина минута",
			lessThanXMinutes: {
				one: "помалку од минута",
				other: "помалку од {{count}} минути"
			},
			xMinutes: {
				one: "1 минута",
				other: "{{count}} минути"
			},
			aboutXHours: {
				one: "околу 1 час",
				other: "околу {{count}} часа"
			},
			xHours: {
				one: "1 час",
				other: "{{count}} часа"
			},
			xDays: {
				one: "1 ден",
				other: "{{count}} дена"
			},
			aboutXWeeks: {
				one: "околу 1 недела",
				other: "околу {{count}} месеци"
			},
			xWeeks: {
				one: "1 недела",
				other: "{{count}} недели"
			},
			aboutXMonths: {
				one: "околу 1 месец",
				other: "околу {{count}} недели"
			},
			xMonths: {
				one: "1 месец",
				other: "{{count}} месеци"
			},
			aboutXYears: {
				one: "околу 1 година",
				other: "околу {{count}} години"
			},
			xYears: {
				one: "1 година",
				other: "{{count}} години"
			},
			overXYears: {
				one: "повеќе од 1 година",
				other: "повеќе од {{count}} години"
			},
			almostXYears: {
				one: "безмалку 1 година",
				other: "безмалку {{count}} години"
			}
		}),
		qn = {
			date: X({
				formats: {
					full: "EEEE, dd MMMM yyyy",
					long: "dd MMMM yyyy",
					medium: "dd MMM yyyy",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					any: "{{date}} {{time}}"
				},
				defaultWidth: "any"
			})
		},
		Ln = ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"];

		function Bn(e) {
			const t = Ln[e];
			switch (e) {
			case 0:
			case 3:
			case 6:
				return "'ова " + t + " вo' p";
			case 1:
			case 2:
			case 4:
			case 5:
				return "'овој " + t + " вo' p"
			}
		}
		const Qn = {
			lastWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? Bn(a) : function (e) {
					const t = Ln[e];
					switch (e) {
					case 0:
					case 3:
					case 6:
						return "'минатата " + t + " во' p";
					case 1:
					case 2:
					case 4:
					case 5:
						return "'минатиот " + t + " во' p"
					}
				}
				(a)
			},
			yesterday: "'вчера во' p",
			today: "'денес во' p",
			tomorrow: "'утре во' p",
			nextWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? Bn(a) : function (e) {
					const t = Ln[e];
					switch (e) {
					case 0:
					case 3:
					case 6:
						return "'следната " + t + " вo' p";
					case 1:
					case 2:
					case 4:
					case 5:
						return "'следниот " + t + " вo' p"
					}
				}
				(a)
			},
			other: "P"
		},
		Rn = (_({
				values: {
					narrow: ["пр.н.е.", "н.е."],
					abbreviated: ["пред н. е.", "н. е."],
					wide: ["пред нашата ера", "нашата ера"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1-ви кв.", "2-ри кв.", "3-ти кв.", "4-ти кв."],
					wide: ["1-ви квартал", "2-ри квартал", "3-ти квартал", "4-ти квартал"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					abbreviated: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "септ", "окт", "ноем", "дек"],
					wide: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["Н", "П", "В", "С", "Ч", "П", "С"],
					short: ["не", "по", "вт", "ср", "че", "пе", "са"],
					abbreviated: ["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
					wide: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					wide: {
						am: "претпладне",
						pm: "попладне",
						midnight: "полноќ",
						noon: "напладне",
						morning: "наутро",
						afternoon: "попладне",
						evening: "навечер",
						night: "ноќе"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(-?[врмт][и])?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^((пр)?н\.?\s?е\.?)/i,
					abbreviated: /^((пр)?н\.?\s?е\.?)/i,
					wide: /^(пред нашата ера|нашата ера)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^п/i, /^н/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234](-?[врт]?и?)? кв.?/i,
					wide: /^[1234](-?[врт]?и?)? квартал/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					abbreviated: /^(јан|фев|мар|апр|мај|јун|јул|авг|сеп|окт|ноем|дек)/i,
					wide: /^(јануари|февруари|март|април|мај|јуни|јули|август|септември|октомври|ноември|декември)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^ја/i, /^Ф/i, /^мар/i, /^ап/i, /^мај/i, /^јун/i, /^јул/i, /^ав/i, /^се/i, /^окт/i, /^но/i, /^де/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[нпвсч]/i,
					short: /^(не|по|вт|ср|че|пе|са)/i,
					abbreviated: /^(нед|пон|вто|сре|чет|пет|саб)/i,
					wide: /^(недела|понеделник|вторник|среда|четврток|петок|сабота)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^н/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
					any: [/^н[ед]/i, /^п[он]/i, /^вт/i, /^ср/i, /^ч[ет]/i, /^п[ет]/i, /^с[аб]/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(претп|попл|полноќ|утро|пладне|вечер|ноќ)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /претпладне/i,
						pm: /попладне/i,
						midnight: /полноќ/i,
						noon: /напладне/i,
						morning: /наутро/i,
						afternoon: /попладне/i,
						evening: /навечер/i,
						night: /ноќе/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "kurang dari 1 saat",
				other: "kurang dari {{count}} saat"
			},
			xSeconds: {
				one: "1 saat",
				other: "{{count}} saat"
			},
			halfAMinute: "setengah minit",
			lessThanXMinutes: {
				one: "kurang dari 1 minit",
				other: "kurang dari {{count}} minit"
			},
			xMinutes: {
				one: "1 minit",
				other: "{{count}} minit"
			},
			aboutXHours: {
				one: "sekitar 1 jam",
				other: "sekitar {{count}} jam"
			},
			xHours: {
				one: "1 jam",
				other: "{{count}} jam"
			},
			xDays: {
				one: "1 hari",
				other: "{{count}} hari"
			},
			aboutXWeeks: {
				one: "sekitar 1 minggu",
				other: "sekitar {{count}} minggu"
			},
			xWeeks: {
				one: "1 minggu",
				other: "{{count}} minggu"
			},
			aboutXMonths: {
				one: "sekitar 1 bulan",
				other: "sekitar {{count}} bulan"
			},
			xMonths: {
				one: "1 bulan",
				other: "{{count}} bulan"
			},
			aboutXYears: {
				one: "sekitar 1 tahun",
				other: "sekitar {{count}} tahun"
			},
			xYears: {
				one: "1 tahun",
				other: "{{count}} tahun"
			},
			overXYears: {
				one: "lebih dari 1 tahun",
				other: "lebih dari {{count}} tahun"
			},
			almostXYears: {
				one: "hampir 1 tahun",
				other: "hampir {{count}} tahun"
			}
		}),
		Un = {
			date: X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM yyyy",
					medium: "d MMM yyyy",
					short: "d/M/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH.mm.ss",
					long: "HH.mm.ss",
					medium: "HH.mm",
					short: "HH.mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'pukul' {{time}}",
					long: "{{date}} 'pukul' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Zn = {
			lastWeek: "eeee 'lepas pada jam' p",
			yesterday: "'Semalam pada jam' p",
			today: "'Hari ini pada jam' p",
			tomorrow: "'Esok pada jam' p",
			nextWeek: "eeee 'pada jam' p",
			other: "P"
		},
		ea = (_({
				values: {
					narrow: ["SM", "M"],
					abbreviated: ["SM", "M"],
					wide: ["Sebelum Masihi", "Masihi"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["S1", "S2", "S3", "S4"],
					wide: ["Suku pertama", "Suku kedua", "Suku ketiga", "Suku keempat"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "O", "S", "O", "N", "D"],
					abbreviated: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"],
					wide: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["A", "I", "S", "R", "K", "J", "S"],
					short: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
					abbreviated: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
					wide: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "am",
						pm: "pm",
						midnight: "tgh malam",
						noon: "tgh hari",
						morning: "pagi",
						afternoon: "tengah hari",
						evening: "petang",
						night: "malam"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "tengah hari",
						evening: "petang",
						night: "malam"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "tengah hari",
						evening: "petang",
						night: "malam"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "am",
						pm: "pm",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "tengah hari",
						evening: "petang",
						night: "malam"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "tengah hari",
						evening: "petang",
						night: "malam"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "tengah malam",
						noon: "tengah hari",
						morning: "pagi",
						afternoon: "tengah hari",
						evening: "petang",
						night: "malam"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^ke-(\d+)?/i,
				parsePattern: /petama|\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(sm|m)/i,
					abbreviated: /^(s\.?\s?m\.?|m\.?)/i,
					wide: /^(sebelum masihi|masihi)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^s/i, /^(m)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^S[1234]/i,
					wide: /Suku (pertama|kedua|ketiga|keempat)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/pertama|1/i, /kedua|2/i, /ketiga|3/i, /keempat|4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan|feb|mac|apr|mei|jun|jul|ogo|sep|okt|nov|dis)/i,
					wide: /^(januari|februari|mac|april|mei|jun|julai|ogos|september|oktober|november|disember)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^o/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^ma/i, /^ap/i, /^me/i, /^jun/i, /^jul/i, /^og/i, /^s/i, /^ok/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[aisrkj]/i,
					short: /^(ahd|isn|sel|rab|kha|jum|sab)/i,
					abbreviated: /^(ahd|isn|sel|rab|kha|jum|sab)/i,
					wide: /^(ahad|isnin|selasa|rabu|khamis|jumaat|sabtu)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^a/i, /^i/i, /^s/i, /^r/i, /^k/i, /^j/i, /^s/i],
					any: [/^a/i, /^i/i, /^se/i, /^r/i, /^k/i, /^j/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(am|pm|tengah malam|tengah hari|pagi|petang|malam)/i,
					any: /^([ap]\.?\s?m\.?|tengah malam|tengah hari|pagi|petang|malam)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^pm/i,
						midnight: /^tengah m/i,
						noon: /^tengah h/i,
						morning: /pa/i,
						afternoon: /tengah h/i,
						evening: /pe/i,
						night: /m/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "inqas minn sekonda",
				other: "inqas minn {{count}} sekondi"
			},
			xSeconds: {
				one: "sekonda",
				other: "{{count}} sekondi"
			},
			halfAMinute: "nofs minuta",
			lessThanXMinutes: {
				one: "inqas minn minuta",
				other: "inqas minn {{count}} minuti"
			},
			xMinutes: {
				one: "minuta",
				other: "{{count}} minuti"
			},
			aboutXHours: {
				one: "madwar siegħa",
				other: "madwar {{count}} siegħat"
			},
			xHours: {
				one: "siegħa",
				other: "{{count}} siegħat"
			},
			xDays: {
				one: "ġurnata",
				other: "{{count}} ġranet"
			},
			aboutXWeeks: {
				one: "madwar ġimgħa",
				other: "madwar {{count}} ġimgħat"
			},
			xWeeks: {
				one: "ġimgħa",
				other: "{{count}} ġimgħat"
			},
			aboutXMonths: {
				one: "madwar xahar",
				other: "madwar {{count}} xhur"
			},
			xMonths: {
				one: "xahar",
				other: "{{count}} xhur"
			},
			aboutXYears: {
				one: "madwar sena",
				two: "madwar sentejn",
				other: "madwar {{count}} snin"
			},
			xYears: {
				one: "sena",
				two: "sentejn",
				other: "{{count}} snin"
			},
			overXYears: {
				one: "aktar minn sena",
				two: "aktar minn sentejn",
				other: "aktar minn {{count}} snin"
			},
			almostXYears: {
				one: "kważi sena",
				two: "kważi sentejn",
				other: "kważi {{count}} snin"
			}
		}),
		ta = {
			date: X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM yyyy",
					medium: "d MMM yyyy",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		na = {
			lastWeek: "eeee 'li għadda' 'fil-'p",
			yesterday: "'Il-bieraħ fil-'p",
			today: "'Illum fil-'p",
			tomorrow: "'Għada fil-'p",
			nextWeek: "eeee 'fil-'p",
			other: "P"
		},
		aa = (_({
				values: {
					narrow: ["Q", "W"],
					abbreviated: ["QK", "WK"],
					wide: ["qabel Kristu", "wara Kristu"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["K1", "K2", "K3", "K4"],
					wide: ["1. kwart", "2. kwart", "3. kwart", "4. kwart"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "Ġ", "L", "A", "S", "O", "N", "D"],
					abbreviated: ["Jan", "Fra", "Mar", "Apr", "Mej", "Ġun", "Lul", "Aww", "Set", "Ott", "Nov", "Diċ"],
					wide: ["Jannar", "Frar", "Marzu", "April", "Mejju", "Ġunju", "Lulju", "Awwissu", "Settembru", "Ottubru", "Novembru", "Diċembru"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["Ħ", "T", "T", "E", "Ħ", "Ġ", "S"],
					short: ["Ħa", "Tn", "Tl", "Er", "Ħa", "Ġi", "Si"],
					abbreviated: ["Ħad", "Tne", "Tli", "Erb", "Ħam", "Ġim", "Sib"],
					wide: ["Il-Ħadd", "It-Tnejn", "It-Tlieta", "L-Erbgħa", "Il-Ħamis", "Il-Ġimgħa", "Is-Sibt"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "nofsillejl",
						noon: "nofsinhar",
						morning: "għodwa",
						afternoon: "wara nofsinhar",
						evening: "filgħaxija",
						night: "lejl"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "nofsillejl",
						noon: "nofsinhar",
						morning: "għodwa",
						afternoon: "wara nofsinhar",
						evening: "filgħaxija",
						night: "lejl"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "nofsillejl",
						noon: "nofsinhar",
						morning: "għodwa",
						afternoon: "wara nofsinhar",
						evening: "filgħaxija",
						night: "lejl"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "f'nofsillejl",
						noon: "f'nofsinhar",
						morning: "filgħodu",
						afternoon: "wara nofsinhar",
						evening: "filgħaxija",
						night: "billejl"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "f'nofsillejl",
						noon: "f'nofsinhar",
						morning: "filgħodu",
						afternoon: "wara nofsinhar",
						evening: "filgħaxija",
						night: "billejl"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "f'nofsillejl",
						noon: "f'nofsinhar",
						morning: "filgħodu",
						afternoon: "wara nofsinhar",
						evening: "filgħaxija",
						night: "billejl"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(º)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(q|w)/i,
					abbreviated: /^(q\.?\s?k\.?|b\.?\s?c\.?\s?e\.?|w\.?\s?k\.?)/i,
					wide: /^(qabel kristu|before common era|wara kristu|common era)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^(q|b)/i, /^(w|c)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^k[1234]/i,
					wide: /^[1234](\.)? kwart/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmaglsond]/i,
					abbreviated: /^(jan|fra|mar|apr|mej|ġun|lul|aww|set|ott|nov|diċ)/i,
					wide: /^(jannar|frar|marzu|april|mejju|ġunju|lulju|awwissu|settembru|ottubru|novembru|diċembru)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^ġ/i, /^l/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^mej/i, /^ġ/i, /^l/i, /^aw/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[ħteġs]/i,
					short: /^(ħa|tn|tl|er|ħa|ġi|si)/i,
					abbreviated: /^(ħad|tne|tli|erb|ħam|ġim|sib)/i,
					wide: /^(il-ħadd|it-tnejn|it-tlieta|l-erbgħa|il-ħamis|il-ġimgħa|is-sibt)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ħ/i, /^t/i, /^t/i, /^e/i, /^ħ/i, /^ġ/i, /^s/i],
					any: [/^(il-)?ħad/i, /^(it-)?tn/i, /^(it-)?tl/i, /^(l-)?er/i, /^(il-)?ham/i, /^(il-)?ġi/i, /^(is-)?si/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|f'nofsillejl|f'nofsinhar|(ta') (għodwa|wara nofsinhar|filgħaxija|lejl))/i,
					any: /^([ap]\.?\s?m\.?|f'nofsillejl|f'nofsinhar|(ta') (għodwa|wara nofsinhar|filgħaxija|lejl))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^f'nofsillejl/i,
						noon: /^f'nofsinhar/i,
						morning: /għodwa/i,
						afternoon: /wara(\s.*)nofsinhar/i,
						evening: /filgħaxija/i,
						night: /lejl/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "mindre enn ett sekund",
				other: "mindre enn {{count}} sekunder"
			},
			xSeconds: {
				one: "ett sekund",
				other: "{{count}} sekunder"
			},
			halfAMinute: "et halvt minutt",
			lessThanXMinutes: {
				one: "mindre enn ett minutt",
				other: "mindre enn {{count}} minutter"
			},
			xMinutes: {
				one: "ett minutt",
				other: "{{count}} minutter"
			},
			aboutXHours: {
				one: "omtrent en time",
				other: "omtrent {{count}} timer"
			},
			xHours: {
				one: "en time",
				other: "{{count}} timer"
			},
			xDays: {
				one: "en dag",
				other: "{{count}} dager"
			},
			aboutXWeeks: {
				one: "omtrent en uke",
				other: "omtrent {{count}} uker"
			},
			xWeeks: {
				one: "en uke",
				other: "{{count}} uker"
			},
			aboutXMonths: {
				one: "omtrent en måned",
				other: "omtrent {{count}} måneder"
			},
			xMonths: {
				one: "en måned",
				other: "{{count}} måneder"
			},
			aboutXYears: {
				one: "omtrent ett år",
				other: "omtrent {{count}} år"
			},
			xYears: {
				one: "ett år",
				other: "{{count}} år"
			},
			overXYears: {
				one: "over ett år",
				other: "over {{count}} år"
			},
			almostXYears: {
				one: "nesten ett år",
				other: "nesten {{count}} år"
			}
		}),
		ia = {
			date: X({
				formats: {
					full: "EEEE d. MMMM y",
					long: "d. MMMM y",
					medium: "d. MMM y",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "'kl'. HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'kl.' {{time}}",
					long: "{{date}} 'kl.' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		ra = {
			lastWeek: "'forrige' eeee 'kl.' p",
			yesterday: "'i går kl.' p",
			today: "'i dag kl.' p",
			tomorrow: "'i morgen kl.' p",
			nextWeek: "EEEE 'kl.' p",
			other: "P"
		},
		oa = (_({
				values: {
					narrow: ["f.Kr.", "e.Kr."],
					abbreviated: ["f.Kr.", "e.Kr."],
					wide: ["før Kristus", "etter Kristus"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["jan.", "feb.", "mars", "apr.", "mai", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "des."],
					wide: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["S", "M", "T", "O", "T", "F", "L"],
					short: ["sø", "ma", "ti", "on", "to", "fr", "lø"],
					abbreviated: ["søn", "man", "tir", "ons", "tor", "fre", "lør"],
					wide: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "midnatt",
						noon: "middag",
						morning: "på morg.",
						afternoon: "på etterm.",
						evening: "på kvelden",
						night: "på natten"
					},
					abbreviated: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "midnatt",
						noon: "middag",
						morning: "på morg.",
						afternoon: "på etterm.",
						evening: "på kvelden",
						night: "på natten"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "midnatt",
						noon: "middag",
						morning: "på morgenen",
						afternoon: "på ettermiddagen",
						evening: "på kvelden",
						night: "på natten"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)\.?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(f\.? ?Kr\.?|fvt\.?|e\.? ?Kr\.?|evt\.?)/i,
					abbreviated: /^(f\.? ?Kr\.?|fvt\.?|e\.? ?Kr\.?|evt\.?)/i,
					wide: /^(før Kristus|før vår tid|etter Kristus|vår tid)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^f/i, /^e/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234](\.)? kvartal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan|feb|mars?|apr|mai|juni?|juli?|aug|sep|okt|nov|des)\.?/i,
					wide: /^(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^mai/i, /^jun/i, /^jul/i, /^aug/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[smtofl]/i,
					short: /^(sø|ma|ti|on|to|fr|lø)/i,
					abbreviated: /^(søn|man|tir|ons|tor|fre|lør)/i,
					wide: /^(søndag|mandag|tirsdag|onsdag|torsdag|fredag|lørdag)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^s/i, /^m/i, /^ti/i, /^o/i, /^to/i, /^f/i, /^l/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(midnatt|middag|(på) (morgenen|ettermiddagen|kvelden|natten)|[ap])/i,
					any: /^([ap]\.?\s?m\.?|midnatt|middag|(på) (morgenen|ettermiddagen|kvelden|natten))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a(\.?\s?m\.?)?$/i,
						pm: /^p(\.?\s?m\.?)?$/i,
						midnight: /^midn/i,
						noon: /^midd/i,
						morning: /morgen/i,
						afternoon: /ettermiddag/i,
						evening: /kveld/i,
						night: /natt/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "minder dan een seconde",
				other: "minder dan {{count}} seconden"
			},
			xSeconds: {
				one: "1 seconde",
				other: "{{count}} seconden"
			},
			halfAMinute: "een halve minuut",
			lessThanXMinutes: {
				one: "minder dan een minuut",
				other: "minder dan {{count}} minuten"
			},
			xMinutes: {
				one: "een minuut",
				other: "{{count}} minuten"
			},
			aboutXHours: {
				one: "ongeveer 1 uur",
				other: "ongeveer {{count}} uur"
			},
			xHours: {
				one: "1 uur",
				other: "{{count}} uur"
			},
			xDays: {
				one: "1 dag",
				other: "{{count}} dagen"
			},
			aboutXWeeks: {
				one: "ongeveer 1 week",
				other: "ongeveer {{count}} weken"
			},
			xWeeks: {
				one: "1 week",
				other: "{{count}} weken"
			},
			aboutXMonths: {
				one: "ongeveer 1 maand",
				other: "ongeveer {{count}} maanden"
			},
			xMonths: {
				one: "1 maand",
				other: "{{count}} maanden"
			},
			aboutXYears: {
				one: "ongeveer 1 jaar",
				other: "ongeveer {{count}} jaar"
			},
			xYears: {
				one: "1 jaar",
				other: "{{count}} jaar"
			},
			overXYears: {
				one: "meer dan 1 jaar",
				other: "meer dan {{count}} jaar"
			},
			almostXYears: {
				one: "bijna 1 jaar",
				other: "bijna {{count}} jaar"
			}
		}),
		sa = {
			date: X({
				formats: {
					full: "EEEE d MMMM y",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "dd-MM-y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'om' {{time}}",
					long: "{{date}} 'om' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		da = {
			lastWeek: "'afgelopen' eeee 'om' p",
			yesterday: "'gisteren om' p",
			today: "'vandaag om' p",
			tomorrow: "'morgen om' p",
			nextWeek: "eeee 'om' p",
			other: "P"
		},
		ua = (_({
				values: {
					narrow: ["v.C.", "n.C."],
					abbreviated: ["v.Chr.", "n.Chr."],
					wide: ["voor Christus", "na Christus"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["K1", "K2", "K3", "K4"],
					wide: ["1e kwartaal", "2e kwartaal", "3e kwartaal", "4e kwartaal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["jan.", "feb.", "mrt.", "apr.", "mei", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."],
					wide: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["Z", "M", "D", "W", "D", "V", "Z"],
					short: ["zo", "ma", "di", "wo", "do", "vr", "za"],
					abbreviated: ["zon", "maa", "din", "woe", "don", "vri", "zat"],
					wide: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "middernacht",
						noon: "het middaguur",
						morning: "'s ochtends",
						afternoon: "'s middags",
						evening: "'s avonds",
						night: "'s nachts"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "middernacht",
						noon: "het middaguur",
						morning: "'s ochtends",
						afternoon: "'s middags",
						evening: "'s avonds",
						night: "'s nachts"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "middernacht",
						noon: "het middaguur",
						morning: "'s ochtends",
						afternoon: "'s middags",
						evening: "'s avonds",
						night: "'s nachts"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)e?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^([vn]\.? ?C\.?)/,
					abbreviated: /^([vn]\. ?Chr\.?)/,
					wide: /^((voor|na) Christus)/
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^v/, /^n/]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^K[1234]/i,
					wide: /^[1234]e kwartaal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan.|feb.|mrt.|apr.|mei|jun.|jul.|aug.|sep.|okt.|nov.|dec.)/i,
					wide: /^(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^jan/i, /^feb/i, /^m(r|a)/i, /^apr/i, /^mei/i, /^jun/i, /^jul/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[zmdwv]/i,
					short: /^(zo|ma|di|wo|do|vr|za)/i,
					abbreviated: /^(zon|maa|din|woe|don|vri|zat)/i,
					wide: /^(zondag|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^z/i, /^m/i, /^d/i, /^w/i, /^d/i, /^v/i, /^z/i],
					any: [/^zo/i, /^ma/i, /^di/i, /^wo/i, /^do/i, /^vr/i, /^za/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(am|pm|middernacht|het middaguur|'s (ochtends|middags|avonds|nachts))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^am/i,
						pm: /^pm/i,
						midnight: /^middernacht/i,
						noon: /^het middaguur/i,
						morning: /ochtend/i,
						afternoon: /middag/i,
						evening: /avond/i,
						night: /nacht/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "minder dan een seconde",
				other: "minder dan {{count}} seconden"
			},
			xSeconds: {
				one: "1 seconde",
				other: "{{count}} seconden"
			},
			halfAMinute: "een halve minuut",
			lessThanXMinutes: {
				one: "minder dan een minuut",
				other: "minder dan {{count}} minuten"
			},
			xMinutes: {
				one: "een minuut",
				other: "{{count}} minuten"
			},
			aboutXHours: {
				one: "ongeveer 1 uur",
				other: "ongeveer {{count}} uur"
			},
			xHours: {
				one: "1 uur",
				other: "{{count}} uur"
			},
			xDays: {
				one: "1 dag",
				other: "{{count}} dagen"
			},
			aboutXWeeks: {
				one: "ongeveer 1 week",
				other: "ongeveer {{count}} weken"
			},
			xWeeks: {
				one: "1 week",
				other: "{{count}} weken"
			},
			aboutXMonths: {
				one: "ongeveer 1 maand",
				other: "ongeveer {{count}} maanden"
			},
			xMonths: {
				one: "1 maand",
				other: "{{count}} maanden"
			},
			aboutXYears: {
				one: "ongeveer 1 jaar",
				other: "ongeveer {{count}} jaar"
			},
			xYears: {
				one: "1 jaar",
				other: "{{count}} jaar"
			},
			overXYears: {
				one: "meer dan 1 jaar",
				other: "meer dan {{count}} jaar"
			},
			almostXYears: {
				one: "bijna 1 jaar",
				other: "bijna {{count}} jaar"
			}
		}),
		ma = {
			date: X({
				formats: {
					full: "EEEE d MMMM y",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'om' {{time}}",
					long: "{{date}} 'om' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		la = {
			lastWeek: "'vorige' eeee 'om' p",
			yesterday: "'gisteren om' p",
			today: "'vandaag om' p",
			tomorrow: "'morgen om' p",
			nextWeek: "eeee 'om' p",
			other: "P"
		},
		ha = (_({
				values: {
					narrow: ["v.C.", "n.C."],
					abbreviated: ["v.Chr.", "n.Chr."],
					wide: ["voor Christus", "na Christus"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["K1", "K2", "K3", "K4"],
					wide: ["1e kwartaal", "2e kwartaal", "3e kwartaal", "4e kwartaal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["jan.", "feb.", "mrt.", "apr.", "mei", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."],
					wide: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["Z", "M", "D", "W", "D", "V", "Z"],
					short: ["zo", "ma", "di", "wo", "do", "vr", "za"],
					abbreviated: ["zon", "maa", "din", "woe", "don", "vri", "zat"],
					wide: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "middernacht",
						noon: "het middag",
						morning: "'s ochtends",
						afternoon: "'s namiddags",
						evening: "'s avonds",
						night: "'s nachts"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "middernacht",
						noon: "het middag",
						morning: "'s ochtends",
						afternoon: "'s namiddags",
						evening: "'s avonds",
						night: "'s nachts"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "middernacht",
						noon: "het middag",
						morning: "'s ochtends",
						afternoon: "'s namiddags",
						evening: "'s avonds",
						night: "'s nachts"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)e?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^([vn]\.? ?C\.?)/,
					abbreviated: /^([vn]\. ?Chr\.?)/,
					wide: /^((voor|na) Christus)/
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^v/, /^n/]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^K[1234]/i,
					wide: /^[1234]e kwartaal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan.|feb.|mrt.|apr.|mei|jun.|jul.|aug.|sep.|okt.|nov.|dec.)/i,
					wide: /^(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^jan/i, /^feb/i, /^m(r|a)/i, /^apr/i, /^mei/i, /^jun/i, /^jul/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[zmdwv]/i,
					short: /^(zo|ma|di|wo|do|vr|za)/i,
					abbreviated: /^(zon|maa|din|woe|don|vri|zat)/i,
					wide: /^(zondag|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^z/i, /^m/i, /^d/i, /^w/i, /^d/i, /^v/i, /^z/i],
					any: [/^zo/i, /^ma/i, /^di/i, /^wo/i, /^do/i, /^vr/i, /^za/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(am|pm|middernacht|het middaguur|'s (ochtends|middags|avonds|nachts))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^am/i,
						pm: /^pm/i,
						midnight: /^middernacht/i,
						noon: /^het middaguur/i,
						morning: /ochtend/i,
						afternoon: /middag/i,
						evening: /avond/i,
						night: /nacht/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "mindre enn eitt sekund",
				other: "mindre enn {{count}} sekund"
			},
			xSeconds: {
				one: "eitt sekund",
				other: "{{count}} sekund"
			},
			halfAMinute: "eit halvt minutt",
			lessThanXMinutes: {
				one: "mindre enn eitt minutt",
				other: "mindre enn {{count}} minutt"
			},
			xMinutes: {
				one: "eitt minutt",
				other: "{{count}} minutt"
			},
			aboutXHours: {
				one: "omtrent ein time",
				other: "omtrent {{count}} timar"
			},
			xHours: {
				one: "ein time",
				other: "{{count}} timar"
			},
			xDays: {
				one: "ein dag",
				other: "{{count}} dagar"
			},
			aboutXWeeks: {
				one: "omtrent ei veke",
				other: "omtrent {{count}} veker"
			},
			xWeeks: {
				one: "ei veke",
				other: "{{count}} veker"
			},
			aboutXMonths: {
				one: "omtrent ein månad",
				other: "omtrent {{count}} månader"
			},
			xMonths: {
				one: "ein månad",
				other: "{{count}} månader"
			},
			aboutXYears: {
				one: "omtrent eitt år",
				other: "omtrent {{count}} år"
			},
			xYears: {
				one: "eitt år",
				other: "{{count}} år"
			},
			overXYears: {
				one: "over eitt år",
				other: "over {{count}} år"
			},
			almostXYears: {
				one: "nesten eitt år",
				other: "nesten {{count}} år"
			}
		}),
		ca = ["null", "ein", "to", "tre", "fire", "fem", "seks", "sju", "åtte", "ni", "ti", "elleve", "tolv"],
		ga = {
			date: X({
				formats: {
					full: "EEEE d. MMMM y",
					long: "d. MMMM y",
					medium: "d. MMM y",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "'kl'. HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'kl.' {{time}}",
					long: "{{date}} 'kl.' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		fa = {
			lastWeek: "'førre' eeee 'kl.' p",
			yesterday: "'i går kl.' p",
			today: "'i dag kl.' p",
			tomorrow: "'i morgon kl.' p",
			nextWeek: "EEEE 'kl.' p",
			other: "P"
		},
		pa = (_({
				values: {
					narrow: ["f.Kr.", "e.Kr."],
					abbreviated: ["f.Kr.", "e.Kr."],
					wide: ["før Kristus", "etter Kristus"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
					abbreviated: ["jan.", "feb.", "mars", "apr.", "mai", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "des."],
					wide: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["S", "M", "T", "O", "T", "F", "L"],
					short: ["su", "må", "ty", "on", "to", "fr", "lau"],
					abbreviated: ["sun", "mån", "tys", "ons", "tor", "fre", "laur"],
					wide: ["sundag", "måndag", "tysdag", "onsdag", "torsdag", "fredag", "laurdag"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "midnatt",
						noon: "middag",
						morning: "på morg.",
						afternoon: "på etterm.",
						evening: "på kvelden",
						night: "på natta"
					},
					abbreviated: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "midnatt",
						noon: "middag",
						morning: "på morg.",
						afternoon: "på etterm.",
						evening: "på kvelden",
						night: "på natta"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "midnatt",
						noon: "middag",
						morning: "på morgonen",
						afternoon: "på ettermiddagen",
						evening: "på kvelden",
						night: "på natta"
					}
				},
				defaultWidth: "wide"
			}), F({
				matchPattern: /^(\d+)\.?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(f\.? ?Kr\.?|fvt\.?|e\.? ?Kr\.?|evt\.?)/i,
					abbreviated: /^(f\.? ?Kr\.?|fvt\.?|e\.? ?Kr\.?|evt\.?)/i,
					wide: /^(før Kristus|før vår tid|etter Kristus|vår tid)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^f/i, /^e/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234](\.)? kvartal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan|feb|mars?|apr|mai|juni?|juli?|aug|sep|okt|nov|des)\.?/i,
					wide: /^(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^mai/i, /^jun/i, /^jul/i, /^aug/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[smtofl]/i,
					short: /^(su|må|ty|on|to|fr|la)/i,
					abbreviated: /^(sun|mån|tys|ons|tor|fre|laur)/i,
					wide: /^(sundag|måndag|tysdag|onsdag|torsdag|fredag|laurdag)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^s/i, /^m/i, /^ty/i, /^o/i, /^to/i, /^f/i, /^l/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(midnatt|middag|(på) (morgonen|ettermiddagen|kvelden|natta)|[ap])/i,
					any: /^([ap]\.?\s?m\.?|midnatt|middag|(på) (morgonen|ettermiddagen|kvelden|natta))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a(\.?\s?m\.?)?$/i,
						pm: /^p(\.?\s?m\.?)?$/i,
						midnight: /^midn/i,
						noon: /^midd/i,
						morning: /morgon/i,
						afternoon: /ettermiddag/i,
						evening: /kveld/i,
						night: /natt/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: {
					regular: "mniej niż sekunda",
					past: "mniej niż sekundę",
					future: "mniej niż sekundę"
				},
				twoFour: "mniej niż {{count}} sekundy",
				other: "mniej niż {{count}} sekund"
			},
			xSeconds: {
				one: {
					regular: "sekunda",
					past: "sekundę",
					future: "sekundę"
				},
				twoFour: "{{count}} sekundy",
				other: "{{count}} sekund"
			},
			halfAMinute: {
				one: "pół minuty",
				twoFour: "pół minuty",
				other: "pół minuty"
			},
			lessThanXMinutes: {
				one: {
					regular: "mniej niż minuta",
					past: "mniej niż minutę",
					future: "mniej niż minutę"
				},
				twoFour: "mniej niż {{count}} minuty",
				other: "mniej niż {{count}} minut"
			},
			xMinutes: {
				one: {
					regular: "minuta",
					past: "minutę",
					future: "minutę"
				},
				twoFour: "{{count}} minuty",
				other: "{{count}} minut"
			},
			aboutXHours: {
				one: {
					regular: "około godziny",
					past: "około godziny",
					future: "około godzinę"
				},
				twoFour: "około {{count}} godziny",
				other: "około {{count}} godzin"
			},
			xHours: {
				one: {
					regular: "godzina",
					past: "godzinę",
					future: "godzinę"
				},
				twoFour: "{{count}} godziny",
				other: "{{count}} godzin"
			},
			xDays: {
				one: {
					regular: "dzień",
					past: "dzień",
					future: "1 dzień"
				},
				twoFour: "{{count}} dni",
				other: "{{count}} dni"
			},
			aboutXWeeks: {
				one: "około tygodnia",
				twoFour: "około {{count}} tygodni",
				other: "około {{count}} tygodni"
			},
			xWeeks: {
				one: "tydzień",
				twoFour: "{{count}} tygodnie",
				other: "{{count}} tygodni"
			},
			aboutXMonths: {
				one: "około miesiąc",
				twoFour: "około {{count}} miesiące",
				other: "około {{count}} miesięcy"
			},
			xMonths: {
				one: "miesiąc",
				twoFour: "{{count}} miesiące",
				other: "{{count}} miesięcy"
			},
			aboutXYears: {
				one: "około rok",
				twoFour: "około {{count}} lata",
				other: "około {{count}} lat"
			},
			xYears: {
				one: "rok",
				twoFour: "{{count}} lata",
				other: "{{count}} lat"
			},
			overXYears: {
				one: "ponad rok",
				twoFour: "ponad {{count}} lata",
				other: "ponad {{count}} lat"
			},
			almostXYears: {
				one: "prawie rok",
				twoFour: "prawie {{count}} lata",
				other: "prawie {{count}} lat"
			}
		});

		function va(e, t, n) {
			const a = function (e, t) {
				if (1 === t)
					return e.one;
				const n = t % 100;
				if (n <= 20 && n > 10)
					return e.other;
				const a = n % 10;
				return a >= 2 && a <= 4 ? e.twoFour : e.other
			}
			(e, t);
			return ("string" == typeof a ? a : a[n]).replace("{{count}}", String(t))
		}
		const ba = {
			date: X({
				formats: {
					full: "EEEE, do MMMM y",
					long: "do MMMM y",
					medium: "do MMM y",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		wa = {
			masculine: "ostatni",
			feminine: "ostatnia"
		},
		ya = {
			masculine: "ten",
			feminine: "ta"
		},
		Ma = {
			masculine: "następny",
			feminine: "następna"
		},
		ka = {
			0: "feminine",
			1: "masculine",
			2: "masculine",
			3: "feminine",
			4: "masculine",
			5: "masculine",
			6: "feminine"
		};

		function Pa(e, t, n, a) {
			let i;
			if (me(t, n, a))
				i = ya;
			else if ("lastWeek" === e)
				i = wa;
			else {
				if ("nextWeek" !== e)
					throw new Error(`Cannot determine adjectives for token ${e}`);
				i = Ma
			}
			const r = t.getDay();
			return `'${i[ka[r]]}' eeee 'o' p`
		}
		const Wa = {
			lastWeek: Pa,
			yesterday: "'wczoraj o' p",
			today: "'dzisiaj o' p",
			tomorrow: "'jutro o' p",
			nextWeek: Pa,
			other: "P"
		},
		ja = (_({
				values: {
					narrow: ["p.n.e.", "n.e."],
					abbreviated: ["p.n.e.", "n.e."],
					wide: ["przed naszą erą", "naszej ery"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["I kw.", "II kw.", "III kw.", "IV kw."],
					wide: ["I kwartał", "II kwartał", "III kwartał", "IV kwartał"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["S", "L", "M", "K", "M", "C", "L", "S", "W", "P", "L", "G"],
					abbreviated: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"],
					wide: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["s", "l", "m", "k", "m", "c", "l", "s", "w", "p", "l", "g"],
					abbreviated: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"],
					wide: ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["N", "P", "W", "Ś", "C", "P", "S"],
					short: ["nie", "pon", "wto", "śro", "czw", "pią", "sob"],
					abbreviated: ["niedz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."],
					wide: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["n", "p", "w", "ś", "c", "p", "s"],
					short: ["nie", "pon", "wto", "śro", "czw", "pią", "sob"],
					abbreviated: ["niedz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."],
					wide: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "półn.",
						noon: "poł",
						morning: "rano",
						afternoon: "popoł.",
						evening: "wiecz.",
						night: "noc"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "północ",
						noon: "południe",
						morning: "rano",
						afternoon: "popołudnie",
						evening: "wieczór",
						night: "noc"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "północ",
						noon: "południe",
						morning: "rano",
						afternoon: "popołudnie",
						evening: "wieczór",
						night: "noc"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "o półn.",
						noon: "w poł.",
						morning: "rano",
						afternoon: "po poł.",
						evening: "wiecz.",
						night: "w nocy"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "o północy",
						noon: "w południe",
						morning: "rano",
						afternoon: "po południu",
						evening: "wieczorem",
						night: "w nocy"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "o północy",
						noon: "w południe",
						morning: "rano",
						afternoon: "po południu",
						evening: "wieczorem",
						night: "w nocy"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(p\.?\s*n\.?\s*e\.?\s*|n\.?\s*e\.?\s*)/i,
					abbreviated: /^(p\.?\s*n\.?\s*e\.?\s*|n\.?\s*e\.?\s*)/i,
					wide: /^(przed\s*nasz(ą|a)\s*er(ą|a)|naszej\s*ery)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^p/i, /^n/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^(I|II|III|IV)\s*kw\.?/i,
					wide: /^(I|II|III|IV)\s*kwarta(ł|l)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/1/i, /2/i, /3/i, /4/i],
					any: [/^I kw/i, /^II kw/i, /^III kw/i, /^IV kw/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[slmkcwpg]/i,
					abbreviated: /^(sty|lut|mar|kwi|maj|cze|lip|sie|wrz|pa(ź|z)|lis|gru)/i,
					wide: /^(stycznia|stycze(ń|n)|lutego|luty|marca|marzec|kwietnia|kwiecie(ń|n)|maja|maj|czerwca|czerwiec|lipca|lipiec|sierpnia|sierpie(ń|n)|wrze(ś|s)nia|wrzesie(ń|n)|pa(ź|z)dziernika|pa(ź|z)dziernik|listopada|listopad|grudnia|grudzie(ń|n))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^s/i, /^l/i, /^m/i, /^k/i, /^m/i, /^c/i, /^l/i, /^s/i, /^w/i, /^p/i, /^l/i, /^g/i],
					any: [/^st/i, /^lu/i, /^mar/i, /^k/i, /^maj/i, /^c/i, /^lip/i, /^si/i, /^w/i, /^p/i, /^lis/i, /^g/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[npwścs]/i,
					short: /^(nie|pon|wto|(ś|s)ro|czw|pi(ą|a)|sob)/i,
					abbreviated: /^(niedz|pon|wt|(ś|s)r|czw|pt|sob)\.?/i,
					wide: /^(niedziela|poniedzia(ł|l)ek|wtorek|(ś|s)roda|czwartek|pi(ą|a)tek|sobota)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^n/i, /^p/i, /^w/i, /^ś/i, /^c/i, /^p/i, /^s/i],
					abbreviated: [/^n/i, /^po/i, /^w/i, /^(ś|s)r/i, /^c/i, /^pt/i, /^so/i],
					any: [/^n/i, /^po/i, /^w/i, /^(ś|s)r/i, /^c/i, /^pi/i, /^so/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(^a$|^p$|pó(ł|l)n\.?|o\s*pó(ł|l)n\.?|po(ł|l)\.?|w\s*po(ł|l)\.?|po\s*po(ł|l)\.?|rano|wiecz\.?|noc|w\s*nocy)/i,
					any: /^(am|pm|pó(ł|l)noc|o\s*pó(ł|l)nocy|po(ł|l)udnie|w\s*po(ł|l)udnie|popo(ł|l)udnie|po\s*po(ł|l)udniu|rano|wieczór|wieczorem|noc|w\s*nocy)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					narrow: {
						am: /^a$/i,
						pm: /^p$/i,
						midnight: /pó(ł|l)n/i,
						noon: /po(ł|l)/i,
						morning: /rano/i,
						afternoon: /po\s*po(ł|l)/i,
						evening: /wiecz/i,
						night: /noc/i
					},
					any: {
						am: /^am/i,
						pm: /^pm/i,
						midnight: /pó(ł|l)n/i,
						noon: /po(ł|l)/i,
						morning: /rano/i,
						afternoon: /po\s*po(ł|l)/i,
						evening: /wiecz/i,
						night: /noc/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "menos de um segundo",
				other: "menos de {{count}} segundos"
			},
			xSeconds: {
				one: "1 segundo",
				other: "{{count}} segundos"
			},
			halfAMinute: "meio minuto",
			lessThanXMinutes: {
				one: "menos de um minuto",
				other: "menos de {{count}} minutos"
			},
			xMinutes: {
				one: "1 minuto",
				other: "{{count}} minutos"
			},
			aboutXHours: {
				one: "aproximadamente 1 hora",
				other: "aproximadamente {{count}} horas"
			},
			xHours: {
				one: "1 hora",
				other: "{{count}} horas"
			},
			xDays: {
				one: "1 dia",
				other: "{{count}} dias"
			},
			aboutXWeeks: {
				one: "aproximadamente 1 semana",
				other: "aproximadamente {{count}} semanas"
			},
			xWeeks: {
				one: "1 semana",
				other: "{{count}} semanas"
			},
			aboutXMonths: {
				one: "aproximadamente 1 mês",
				other: "aproximadamente {{count}} meses"
			},
			xMonths: {
				one: "1 mês",
				other: "{{count}} meses"
			},
			aboutXYears: {
				one: "aproximadamente 1 ano",
				other: "aproximadamente {{count}} anos"
			},
			xYears: {
				one: "1 ano",
				other: "{{count}} anos"
			},
			overXYears: {
				one: "mais de 1 ano",
				other: "mais de {{count}} anos"
			},
			almostXYears: {
				one: "quase 1 ano",
				other: "quase {{count}} anos"
			}
		}),
		xa = {
			date: X({
				formats: {
					full: "EEEE, d 'de' MMMM 'de' y",
					long: "d 'de' MMMM 'de' y",
					medium: "d 'de' MMM 'de' y",
					short: "dd/MM/y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'às' {{time}}",
					long: "{{date}} 'às' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		za = {
			lastWeek: e => {
				const t = e.getDay();
				return "'" + (0 === t || 6 === t ? "último" : "última") + "' eeee 'às' p"
			},
			yesterday: "'ontem às' p",
			today: "'hoje às' p",
			tomorrow: "'amanhã às' p",
			nextWeek: "eeee 'às' p",
			other: "P"
		},
		Ta = (_({
				values: {
					narrow: ["aC", "dC"],
					abbreviated: ["a.C.", "d.C."],
					wide: ["antes de Cristo", "depois de Cristo"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["T1", "T2", "T3", "T4"],
					wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
					abbreviated: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
					wide: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["d", "s", "t", "q", "q", "s", "s"],
					short: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
					abbreviated: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
					wide: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "manhã",
						afternoon: "tarde",
						evening: "noite",
						night: "madrugada"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "manhã",
						afternoon: "tarde",
						evening: "noite",
						night: "madrugada"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "manhã",
						afternoon: "tarde",
						evening: "noite",
						night: "madrugada"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "da manhã",
						afternoon: "da tarde",
						evening: "da noite",
						night: "da madrugada"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "da manhã",
						afternoon: "da tarde",
						evening: "da noite",
						night: "da madrugada"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "da manhã",
						afternoon: "da tarde",
						evening: "da noite",
						night: "da madrugada"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(º|ª)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ac|dc|a|d)/i,
					abbreviated: /^(a\.?\s?c\.?|a\.?\s?e\.?\s?c\.?|d\.?\s?c\.?|e\.?\s?c\.?)/i,
					wide: /^(antes de cristo|antes da era comum|depois de cristo|era comum)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^ac/i, /^dc/i],
					wide: [/^(antes de cristo|antes da era comum)/i, /^(depois de cristo|era comum)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^T[1234]/i,
					wide: /^[1234](º|ª)? trimestre/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i,
					wide: /^(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ab/i, /^mai/i, /^jun/i, /^jul/i, /^ag/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[dstq]/i,
					short: /^(dom|seg|ter|qua|qui|sex|s[áa]b)/i,
					abbreviated: /^(dom|seg|ter|qua|qui|sex|s[áa]b)/i,
					wide: /^(domingo|segunda-?\s?feira|terça-?\s?feira|quarta-?\s?feira|quinta-?\s?feira|sexta-?\s?feira|s[áa]bado)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^d/i, /^s/i, /^t/i, /^q/i, /^q/i, /^s/i, /^s/i],
					any: [/^d/i, /^seg/i, /^t/i, /^qua/i, /^qui/i, /^sex/i, /^s[áa]/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|meia-?\s?noite|meio-?\s?dia|(da) (manh[ãa]|tarde|noite|madrugada))/i,
					any: /^([ap]\.?\s?m\.?|meia-?\s?noite|meio-?\s?dia|(da) (manh[ãa]|tarde|noite|madrugada))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^meia/i,
						noon: /^meio/i,
						morning: /manh[ãa]/i,
						afternoon: /tarde/i,
						evening: /noite/i,
						night: /madrugada/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "menos de um segundo",
				other: "menos de {{count}} segundos"
			},
			xSeconds: {
				one: "1 segundo",
				other: "{{count}} segundos"
			},
			halfAMinute: "meio minuto",
			lessThanXMinutes: {
				one: "menos de um minuto",
				other: "menos de {{count}} minutos"
			},
			xMinutes: {
				one: "1 minuto",
				other: "{{count}} minutos"
			},
			aboutXHours: {
				one: "cerca de 1 hora",
				other: "cerca de {{count}} horas"
			},
			xHours: {
				one: "1 hora",
				other: "{{count}} horas"
			},
			xDays: {
				one: "1 dia",
				other: "{{count}} dias"
			},
			aboutXWeeks: {
				one: "cerca de 1 semana",
				other: "cerca de {{count}} semanas"
			},
			xWeeks: {
				one: "1 semana",
				other: "{{count}} semanas"
			},
			aboutXMonths: {
				one: "cerca de 1 mês",
				other: "cerca de {{count}} meses"
			},
			xMonths: {
				one: "1 mês",
				other: "{{count}} meses"
			},
			aboutXYears: {
				one: "cerca de 1 ano",
				other: "cerca de {{count}} anos"
			},
			xYears: {
				one: "1 ano",
				other: "{{count}} anos"
			},
			overXYears: {
				one: "mais de 1 ano",
				other: "mais de {{count}} anos"
			},
			almostXYears: {
				one: "quase 1 ano",
				other: "quase {{count}} anos"
			}
		}),
		Ea = {
			date: X({
				formats: {
					full: "EEEE, d 'de' MMMM 'de' y",
					long: "d 'de' MMMM 'de' y",
					medium: "d MMM y",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'às' {{time}}",
					long: "{{date}} 'às' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Sa = {
			lastWeek: e => {
				const t = e.getDay();
				return "'" + (0 === t || 6 === t ? "último" : "última") + "' eeee 'às' p"
			},
			yesterday: "'ontem às' p",
			today: "'hoje às' p",
			tomorrow: "'amanhã às' p",
			nextWeek: "eeee 'às' p",
			other: "P"
		},
		Ca = (_({
				values: {
					narrow: ["AC", "DC"],
					abbreviated: ["AC", "DC"],
					wide: ["antes de cristo", "depois de cristo"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["T1", "T2", "T3", "T4"],
					wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
					abbreviated: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
					wide: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["D", "S", "T", "Q", "Q", "S", "S"],
					short: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"],
					abbreviated: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
					wide: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "mn",
						noon: "md",
						morning: "manhã",
						afternoon: "tarde",
						evening: "tarde",
						night: "noite"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "manhã",
						afternoon: "tarde",
						evening: "tarde",
						night: "noite"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "manhã",
						afternoon: "tarde",
						evening: "tarde",
						night: "noite"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "mn",
						noon: "md",
						morning: "da manhã",
						afternoon: "da tarde",
						evening: "da tarde",
						night: "da noite"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "da manhã",
						afternoon: "da tarde",
						evening: "da tarde",
						night: "da noite"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "meia-noite",
						noon: "meio-dia",
						morning: "da manhã",
						afternoon: "da tarde",
						evening: "da tarde",
						night: "da noite"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)[ºªo]?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(ac|dc|a|d)/i,
					abbreviated: /^(a\.?\s?c\.?|d\.?\s?c\.?)/i,
					wide: /^(antes de cristo|depois de cristo)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^ac/i, /^dc/i],
					wide: [/^antes de cristo/i, /^depois de cristo/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^T[1234]/i,
					wide: /^[1234](º)? trimestre/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmajsond]/i,
					abbreviated: /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i,
					wide: /^(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ja/i, /^fev/i, /^mar/i, /^abr/i, /^mai/i, /^jun/i, /^jul/i, /^ago/i, /^set/i, /^out/i, /^nov/i, /^dez/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(dom|[23456]ª?|s[aá]b)/i,
					short: /^(dom|[23456]ª?|s[aá]b)/i,
					abbreviated: /^(dom|seg|ter|qua|qui|sex|s[aá]b)/i,
					wide: /^(domingo|(segunda|ter[cç]a|quarta|quinta|sexta)([- ]feira)?|s[aá]bado)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					short: [/^d/i, /^2/i, /^3/i, /^4/i, /^5/i, /^6/i, /^s[aá]/i],
					narrow: [/^d/i, /^2/i, /^3/i, /^4/i, /^5/i, /^6/i, /^s[aá]/i],
					any: [/^d/i, /^seg/i, /^t/i, /^qua/i, /^qui/i, /^sex/i, /^s[aá]b/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|mn|md|(da) (manhã|tarde|noite))/i,
					any: /^([ap]\.?\s?m\.?|meia[-\s]noite|meio[-\s]dia|(da) (manhã|tarde|noite))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^mn|^meia[-\s]noite/i,
						noon: /^md|^meio[-\s]dia/i,
						morning: /manhã/i,
						afternoon: /tarde/i,
						evening: /tarde/i,
						night: /noite/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "mai puțin de o secundă",
				other: "mai puțin de {{count}} secunde"
			},
			xSeconds: {
				one: "1 secundă",
				other: "{{count}} secunde"
			},
			halfAMinute: "jumătate de minut",
			lessThanXMinutes: {
				one: "mai puțin de un minut",
				other: "mai puțin de {{count}} minute"
			},
			xMinutes: {
				one: "1 minut",
				other: "{{count}} minute"
			},
			aboutXHours: {
				one: "circa 1 oră",
				other: "circa {{count}} ore"
			},
			xHours: {
				one: "1 oră",
				other: "{{count}} ore"
			},
			xDays: {
				one: "1 zi",
				other: "{{count}} zile"
			},
			aboutXWeeks: {
				one: "circa o săptămână",
				other: "circa {{count}} săptămâni"
			},
			xWeeks: {
				one: "1 săptămână",
				other: "{{count}} săptămâni"
			},
			aboutXMonths: {
				one: "circa 1 lună",
				other: "circa {{count}} luni"
			},
			xMonths: {
				one: "1 lună",
				other: "{{count}} luni"
			},
			aboutXYears: {
				one: "circa 1 an",
				other: "circa {{count}} ani"
			},
			xYears: {
				one: "1 an",
				other: "{{count}} ani"
			},
			overXYears: {
				one: "peste 1 an",
				other: "peste {{count}} ani"
			},
			almostXYears: {
				one: "aproape 1 an",
				other: "aproape {{count}} ani"
			}
		}),
		Aa = {
			date: X({
				formats: {
					full: "EEEE, d MMMM yyyy",
					long: "d MMMM yyyy",
					medium: "d MMM yyyy",
					short: "dd.MM.yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'la' {{time}}",
					long: "{{date}} 'la' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Ha = {
			lastWeek: "eeee 'trecută la' p",
			yesterday: "'ieri la' p",
			today: "'astăzi la' p",
			tomorrow: "'mâine la' p",
			nextWeek: "eeee 'viitoare la' p",
			other: "P"
		};
		_({
			values: {
				narrow: ["Î", "D"],
				abbreviated: ["Î.d.C.", "D.C."],
				wide: ["Înainte de Cristos", "După Cristos"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["T1", "T2", "T3", "T4"],
				wide: ["primul trimestru", "al doilea trimestru", "al treilea trimestru", "al patrulea trimestru"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["I", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"],
				abbreviated: ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "noi", "dec"],
				wide: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["d", "l", "m", "m", "j", "v", "s"],
				short: ["du", "lu", "ma", "mi", "jo", "vi", "sâ"],
				abbreviated: ["dum", "lun", "mar", "mie", "joi", "vin", "sâm"],
				wide: ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "a",
					pm: "p",
					midnight: "mn",
					noon: "ami",
					morning: "dim",
					afternoon: "da",
					evening: "s",
					night: "n"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "miezul nopții",
					noon: "amiază",
					morning: "dimineață",
					afternoon: "după-amiază",
					evening: "seară",
					night: "noapte"
				},
				wide: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "miezul nopții",
					noon: "amiază",
					morning: "dimineață",
					afternoon: "după-amiază",
					evening: "seară",
					night: "noapte"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "a",
					pm: "p",
					midnight: "mn",
					noon: "amiază",
					morning: "dimineață",
					afternoon: "după-amiază",
					evening: "seară",
					night: "noapte"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "miezul nopții",
					noon: "amiază",
					morning: "dimineață",
					afternoon: "după-amiază",
					evening: "seară",
					night: "noapte"
				},
				wide: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "miezul nopții",
					noon: "amiază",
					morning: "dimineață",
					afternoon: "după-amiază",
					evening: "seară",
					night: "noapte"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(Î|D)/i,
				abbreviated: /^(Î\.?\s?d\.?\s?C\.?|Î\.?\s?e\.?\s?n\.?|D\.?\s?C\.?|e\.?\s?n\.?)/i,
				wide: /^(Înainte de Cristos|Înaintea erei noastre|După Cristos|Era noastră)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^ÎC/i, /^DC/i],
				wide: [/^(Înainte de Cristos|Înaintea erei noastre)/i, /^(După Cristos|Era noastră)/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^T[1234]/i,
				wide: /^trimestrul [1234]/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[ifmaasond]/i,
				abbreviated: /^(ian|feb|mar|apr|mai|iun|iul|aug|sep|oct|noi|dec)/i,
				wide: /^(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^i/i, /^f/i, /^m/i, /^a/i, /^m/i, /^i/i, /^i/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
				any: [/^ia/i, /^f/i, /^mar/i, /^ap/i, /^mai/i, /^iun/i, /^iul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[dlmjvs]/i,
				short: /^(d|l|ma|mi|j|v|s)/i,
				abbreviated: /^(dum|lun|mar|mie|jo|vi|sâ)/i,
				wide: /^(duminica|luni|marţi|miercuri|joi|vineri|sâmbătă)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^j/i, /^v/i, /^s/i],
				any: [/^d/i, /^l/i, /^ma/i, /^mi/i, /^j/i, /^v/i, /^s/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(a|p|mn|a|(dimineaţa|după-amiaza|seara|noaptea))/i,
				any: /^([ap]\.?\s?m\.?|miezul nopții|amiaza|(dimineaţa|după-amiaza|seara|noaptea))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^a/i,
					pm: /^p/i,
					midnight: /^mn/i,
					noon: /amiaza/i,
					morning: /dimineaţa/i,
					afternoon: /după-amiaza/i,
					evening: /seara/i,
					night: /noaptea/i
				}
			},
			defaultParseWidth: "any"
		});

		function Na(e, t) {
			if (void 0 !== e.one && 1 === t)
				return e.one;
			const n = t % 10,
			a = t % 100;
			return 1 === n && 11 !== a ? e.singularNominative.replace("{{count}}", String(t)) : n >= 2 && n <= 4 && (a < 10 || a > 20) ? e.singularGenitive.replace("{{count}}", String(t)) : e.pluralGenitive.replace("{{count}}", String(t))
		}

		function Xa(e) {
			return (t, n) => n?.addSuffix ? n.comparison && n.comparison > 0 ? e.future ? Na(e.future, t) : "через " + Na(e.regular, t) : e.past ? Na(e.past, t) : Na(e.regular, t) + " назад" : Na(e.regular, t)
		}
		const Ia = {
			lessThanXSeconds: Xa({
				regular: {
					one: "меньше секунды",
					singularNominative: "меньше {{count}} секунды",
					singularGenitive: "меньше {{count}} секунд",
					pluralGenitive: "меньше {{count}} секунд"
				},
				future: {
					one: "меньше, чем через секунду",
					singularNominative: "меньше, чем через {{count}} секунду",
					singularGenitive: "меньше, чем через {{count}} секунды",
					pluralGenitive: "меньше, чем через {{count}} секунд"
				}
			}),
			xSeconds: Xa({
				regular: {
					singularNominative: "{{count}} секунда",
					singularGenitive: "{{count}} секунды",
					pluralGenitive: "{{count}} секунд"
				},
				past: {
					singularNominative: "{{count}} секунду назад",
					singularGenitive: "{{count}} секунды назад",
					pluralGenitive: "{{count}} секунд назад"
				},
				future: {
					singularNominative: "через {{count}} секунду",
					singularGenitive: "через {{count}} секунды",
					pluralGenitive: "через {{count}} секунд"
				}
			}),
			halfAMinute: (e, t) => t?.addSuffix ? t.comparison && t.comparison > 0 ? "через полминуты" : "полминуты назад" : "полминуты",
			lessThanXMinutes: Xa({
				regular: {
					one: "меньше минуты",
					singularNominative: "меньше {{count}} минуты",
					singularGenitive: "меньше {{count}} минут",
					pluralGenitive: "меньше {{count}} минут"
				},
				future: {
					one: "меньше, чем через минуту",
					singularNominative: "меньше, чем через {{count}} минуту",
					singularGenitive: "меньше, чем через {{count}} минуты",
					pluralGenitive: "меньше, чем через {{count}} минут"
				}
			}),
			xMinutes: Xa({
				regular: {
					singularNominative: "{{count}} минута",
					singularGenitive: "{{count}} минуты",
					pluralGenitive: "{{count}} минут"
				},
				past: {
					singularNominative: "{{count}} минуту назад",
					singularGenitive: "{{count}} минуты назад",
					pluralGenitive: "{{count}} минут назад"
				},
				future: {
					singularNominative: "через {{count}} минуту",
					singularGenitive: "через {{count}} минуты",
					pluralGenitive: "через {{count}} минут"
				}
			}),
			aboutXHours: Xa({
				regular: {
					singularNominative: "около {{count}} часа",
					singularGenitive: "около {{count}} часов",
					pluralGenitive: "около {{count}} часов"
				},
				future: {
					singularNominative: "приблизительно через {{count}} час",
					singularGenitive: "приблизительно через {{count}} часа",
					pluralGenitive: "приблизительно через {{count}} часов"
				}
			}),
			xHours: Xa({
				regular: {
					singularNominative: "{{count}} час",
					singularGenitive: "{{count}} часа",
					pluralGenitive: "{{count}} часов"
				}
			}),
			xDays: Xa({
				regular: {
					singularNominative: "{{count}} день",
					singularGenitive: "{{count}} дня",
					pluralGenitive: "{{count}} дней"
				}
			}),
			aboutXWeeks: Xa({
				regular: {
					singularNominative: "около {{count}} недели",
					singularGenitive: "около {{count}} недель",
					pluralGenitive: "около {{count}} недель"
				},
				future: {
					singularNominative: "приблизительно через {{count}} неделю",
					singularGenitive: "приблизительно через {{count}} недели",
					pluralGenitive: "приблизительно через {{count}} недель"
				}
			}),
			xWeeks: Xa({
				regular: {
					singularNominative: "{{count}} неделя",
					singularGenitive: "{{count}} недели",
					pluralGenitive: "{{count}} недель"
				}
			}),
			aboutXMonths: Xa({
				regular: {
					singularNominative: "около {{count}} месяца",
					singularGenitive: "около {{count}} месяцев",
					pluralGenitive: "около {{count}} месяцев"
				},
				future: {
					singularNominative: "приблизительно через {{count}} месяц",
					singularGenitive: "приблизительно через {{count}} месяца",
					pluralGenitive: "приблизительно через {{count}} месяцев"
				}
			}),
			xMonths: Xa({
				regular: {
					singularNominative: "{{count}} месяц",
					singularGenitive: "{{count}} месяца",
					pluralGenitive: "{{count}} месяцев"
				}
			}),
			aboutXYears: Xa({
				regular: {
					singularNominative: "около {{count}} года",
					singularGenitive: "около {{count}} лет",
					pluralGenitive: "около {{count}} лет"
				},
				future: {
					singularNominative: "приблизительно через {{count}} год",
					singularGenitive: "приблизительно через {{count}} года",
					pluralGenitive: "приблизительно через {{count}} лет"
				}
			}),
			xYears: Xa({
				regular: {
					singularNominative: "{{count}} год",
					singularGenitive: "{{count}} года",
					pluralGenitive: "{{count}} лет"
				}
			}),
			overXYears: Xa({
				regular: {
					singularNominative: "больше {{count}} года",
					singularGenitive: "больше {{count}} лет",
					pluralGenitive: "больше {{count}} лет"
				},
				future: {
					singularNominative: "больше, чем через {{count}} год",
					singularGenitive: "больше, чем через {{count}} года",
					pluralGenitive: "больше, чем через {{count}} лет"
				}
			}),
			almostXYears: Xa({
				regular: {
					singularNominative: "почти {{count}} год",
					singularGenitive: "почти {{count}} года",
					pluralGenitive: "почти {{count}} лет"
				},
				future: {
					singularNominative: "почти через {{count}} год",
					singularGenitive: "почти через {{count}} года",
					pluralGenitive: "почти через {{count}} лет"
				}
			})
		},
		Da = {
			date: X({
				formats: {
					full: "EEEE, d MMMM y 'г.'",
					long: "d MMMM y 'г.'",
					medium: "d MMM y 'г.'",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					any: "{{date}}, {{time}}"
				},
				defaultWidth: "any"
			})
		},
		_a = ["воскресенье", "понедельник", "вторник", "среду", "четверг", "пятницу", "субботу"];

		function Ga(e) {
			const t = _a[e];
			return 2 === e ? "'во " + t + " в' p" : "'в " + t + " в' p"
		}
		const Fa = {
			lastWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? Ga(a) : function (e) {
					const t = _a[e];
					switch (e) {
					case 0:
						return "'в прошлое " + t + " в' p";
					case 1:
					case 2:
					case 4:
						return "'в прошлый " + t + " в' p";
					case 3:
					case 5:
					case 6:
						return "'в прошлую " + t + " в' p"
					}
				}
				(a)
			},
			yesterday: "'вчера в' p",
			today: "'сегодня в' p",
			tomorrow: "'завтра в' p",
			nextWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? Ga(a) : function (e) {
					const t = _a[e];
					switch (e) {
					case 0:
						return "'в следующее " + t + " в' p";
					case 1:
					case 2:
					case 4:
						return "'в следующий " + t + " в' p";
					case 3:
					case 5:
					case 6:
						return "'в следующую " + t + " в' p"
					}
				}
				(a)
			},
			other: "P"
		};
		_({
			values: {
				narrow: ["до н.э.", "н.э."],
				abbreviated: ["до н. э.", "н. э."],
				wide: ["до нашей эры", "нашей эры"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["1-й кв.", "2-й кв.", "3-й кв.", "4-й кв."],
				wide: ["1-й квартал", "2-й квартал", "3-й квартал", "4-й квартал"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
				abbreviated: ["янв.", "фев.", "март", "апр.", "май", "июнь", "июль", "авг.", "сент.", "окт.", "нояб.", "дек."],
				wide: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
				abbreviated: ["янв.", "фев.", "мар.", "апр.", "мая", "июн.", "июл.", "авг.", "сент.", "окт.", "нояб.", "дек."],
				wide: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
			},
			defaultFormattingWidth: "wide"
		}),
		_({
			values: {
				narrow: ["В", "П", "В", "С", "Ч", "П", "С"],
				short: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
				abbreviated: ["вск", "пнд", "втр", "срд", "чтв", "птн", "суб"],
				wide: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "ДП",
					pm: "ПП",
					midnight: "полн.",
					noon: "полд.",
					morning: "утро",
					afternoon: "день",
					evening: "веч.",
					night: "ночь"
				},
				abbreviated: {
					am: "ДП",
					pm: "ПП",
					midnight: "полн.",
					noon: "полд.",
					morning: "утро",
					afternoon: "день",
					evening: "веч.",
					night: "ночь"
				},
				wide: {
					am: "ДП",
					pm: "ПП",
					midnight: "полночь",
					noon: "полдень",
					morning: "утро",
					afternoon: "день",
					evening: "вечер",
					night: "ночь"
				}
			},
			defaultWidth: "any",
			formattingValues: {
				narrow: {
					am: "ДП",
					pm: "ПП",
					midnight: "полн.",
					noon: "полд.",
					morning: "утра",
					afternoon: "дня",
					evening: "веч.",
					night: "ночи"
				},
				abbreviated: {
					am: "ДП",
					pm: "ПП",
					midnight: "полн.",
					noon: "полд.",
					morning: "утра",
					afternoon: "дня",
					evening: "веч.",
					night: "ночи"
				},
				wide: {
					am: "ДП",
					pm: "ПП",
					midnight: "полночь",
					noon: "полдень",
					morning: "утра",
					afternoon: "дня",
					evening: "вечера",
					night: "ночи"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(-?(е|я|й|ое|ье|ая|ья|ый|ой|ий|ый))?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^((до )?н\.?\s?э\.?)/i,
				abbreviated: /^((до )?н\.?\s?э\.?)/i,
				wide: /^(до нашей эры|нашей эры|наша эра)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^д/i, /^н/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^[1234](-?[ыои]?й?)? кв.?/i,
				wide: /^[1234](-?[ыои]?й?)? квартал/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[яфмаисонд]/i,
				abbreviated: /^(янв|фев|март?|апр|ма[йя]|июн[ья]?|июл[ья]?|авг|сент?|окт|нояб?|дек)\.?/i,
				wide: /^(январ[ья]|феврал[ья]|марта?|апрел[ья]|ма[йя]|июн[ья]|июл[ья]|августа?|сентябр[ья]|октябр[ья]|октябр[ья]|ноябр[ья]|декабр[ья])/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^я/i, /^ф/i, /^м/i, /^а/i, /^м/i, /^и/i, /^и/i, /^а/i, /^с/i, /^о/i, /^н/i, /^я/i],
				any: [/^я/i, /^ф/i, /^мар/i, /^ап/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^ав/i, /^с/i, /^о/i, /^н/i, /^д/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[впсч]/i,
				short: /^(вс|во|пн|по|вт|ср|чт|че|пт|пя|сб|су)\.?/i,
				abbreviated: /^(вск|вос|пнд|пон|втр|вто|срд|сре|чтв|чет|птн|пят|суб).?/i,
				wide: /^(воскресень[ея]|понедельника?|вторника?|сред[аы]|четверга?|пятниц[аы]|суббот[аы])/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^в/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
				any: [/^в[ос]/i, /^п[он]/i, /^в/i, /^ср/i, /^ч/i, /^п[ят]/i, /^с[уб]/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,
				abbreviated: /^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,
				wide: /^([дп]п|полночь|полдень|утр[оа]|день|дня|вечера?|ноч[ьи])/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: {
					am: /^дп/i,
					pm: /^пп/i,
					midnight: /^полн/i,
					noon: /^полд/i,
					morning: /^у/i,
					afternoon: /^д[ен]/i,
					evening: /^в/i,
					night: /^н/i
				}
			},
			defaultParseWidth: "any"
		});

		function Oa(e, t, n) {
			const a = function (e, t) {
				return 1 === t && e.one ? e.one : t >= 2 && t <= 4 && e.twoFour ? e.twoFour : e.other
			}
			(e, t);
			return a[n].replace("{{count}}", String(t))
		}

		function Ya(e) {
			let t = "";
			return "almost" === e && "takmer",
			"about" === e && "približne",
			t.length > 0 ? t + " " : ""
		}

		function $a(e) {
			let t = "";
			return "lessThan" === e && "menej než",
			"over" === e && "viac než",
			t.length > 0 ? t + " " : ""
		}
		const Ka = {
			xSeconds: {
				one: {
					present: "sekunda",
					past: "sekundou",
					future: "sekundu"
				},
				twoFour: {
					present: "{{count}} sekundy",
					past: "{{count}} sekundami",
					future: "{{count}} sekundy"
				},
				other: {
					present: "{{count}} sekúnd",
					past: "{{count}} sekundami",
					future: "{{count}} sekúnd"
				}
			},
			halfAMinute: {
				other: {
					present: "pol minúty",
					past: "pol minútou",
					future: "pol minúty"
				}
			},
			xMinutes: {
				one: {
					present: "minúta",
					past: "minútou",
					future: "minútu"
				},
				twoFour: {
					present: "{{count}} minúty",
					past: "{{count}} minútami",
					future: "{{count}} minúty"
				},
				other: {
					present: "{{count}} minút",
					past: "{{count}} minútami",
					future: "{{count}} minút"
				}
			},
			xHours: {
				one: {
					present: "hodina",
					past: "hodinou",
					future: "hodinu"
				},
				twoFour: {
					present: "{{count}} hodiny",
					past: "{{count}} hodinami",
					future: "{{count}} hodiny"
				},
				other: {
					present: "{{count}} hodín",
					past: "{{count}} hodinami",
					future: "{{count}} hodín"
				}
			},
			xDays: {
				one: {
					present: "deň",
					past: "dňom",
					future: "deň"
				},
				twoFour: {
					present: "{{count}} dni",
					past: "{{count}} dňami",
					future: "{{count}} dni"
				},
				other: {
					present: "{{count}} dní",
					past: "{{count}} dňami",
					future: "{{count}} dní"
				}
			},
			xWeeks: {
				one: {
					present: "týždeň",
					past: "týždňom",
					future: "týždeň"
				},
				twoFour: {
					present: "{{count}} týždne",
					past: "{{count}} týždňami",
					future: "{{count}} týždne"
				},
				other: {
					present: "{{count}} týždňov",
					past: "{{count}} týždňami",
					future: "{{count}} týždňov"
				}
			},
			xMonths: {
				one: {
					present: "mesiac",
					past: "mesiacom",
					future: "mesiac"
				},
				twoFour: {
					present: "{{count}} mesiace",
					past: "{{count}} mesiacmi",
					future: "{{count}} mesiace"
				},
				other: {
					present: "{{count}} mesiacov",
					past: "{{count}} mesiacmi",
					future: "{{count}} mesiacov"
				}
			},
			xYears: {
				one: {
					present: "rok",
					past: "rokom",
					future: "rok"
				},
				twoFour: {
					present: "{{count}} roky",
					past: "{{count}} rokmi",
					future: "{{count}} roky"
				},
				other: {
					present: "{{count}} rokov",
					past: "{{count}} rokmi",
					future: "{{count}} rokov"
				}
			}
		},
		Ja = {
			date: X({
				formats: {
					full: "EEEE d. MMMM y",
					long: "d. MMMM y",
					medium: "d. M. y",
					short: "d. M. y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}}, {{time}}",
					long: "{{date}}, {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Va = ["nedeľu", "pondelok", "utorok", "stredu", "štvrtok", "piatok", "sobotu"];

		function qa(e) {
			return 4 === e ? "'vo' eeee 'o' p" : "'v " + Va[e] + " o' p"
		}
		const La = {
			lastWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? qa(a) : function (e) {
					const t = Va[e];
					switch (e) {
					case 0:
					case 3:
					case 6:
						return "'minulú " + t + " o' p";
					default:
						return "'minulý' eeee 'o' p"
					}
				}
				(a)
			},
			yesterday: "'včera o' p",
			today: "'dnes o' p",
			tomorrow: "'zajtra o' p",
			nextWeek: (e, t, n) => {
				const a = e.getDay();
				return me(e, t, n) ? qa(a) : function (e) {
					const t = Va[e];
					switch (e) {
					case 0:
					case 4:
					case 6:
						return "'budúcu " + t + " o' p";
					default:
						return "'budúci' eeee 'o' p"
					}
				}
				(a)
			},
			other: "P"
		};
		_({
			values: {
				narrow: ["pred Kr.", "po Kr."],
				abbreviated: ["pred Kr.", "po Kr."],
				wide: ["pred Kristom", "po Kristovi"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["Q1", "Q2", "Q3", "Q4"],
				wide: ["1. štvrťrok", "2. štvrťrok", "3. štvrťrok", "4. štvrťrok"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
				abbreviated: ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec"],
				wide: ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"]
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
				abbreviated: ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec"],
				wide: ["januára", "februára", "marca", "apríla", "mája", "júna", "júla", "augusta", "septembra", "októbra", "novembra", "decembra"]
			},
			defaultFormattingWidth: "wide"
		}),
		_({
			values: {
				narrow: ["n", "p", "u", "s", "š", "p", "s"],
				short: ["ne", "po", "ut", "st", "št", "pi", "so"],
				abbreviated: ["ne", "po", "ut", "st", "št", "pi", "so"],
				wide: ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "AM",
					pm: "PM",
					midnight: "poln.",
					noon: "pol.",
					morning: "ráno",
					afternoon: "pop.",
					evening: "več.",
					night: "noc"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "poln.",
					noon: "pol.",
					morning: "ráno",
					afternoon: "popol.",
					evening: "večer",
					night: "noc"
				},
				wide: {
					am: "AM",
					pm: "PM",
					midnight: "polnoc",
					noon: "poludnie",
					morning: "ráno",
					afternoon: "popoludnie",
					evening: "večer",
					night: "noc"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "AM",
					pm: "PM",
					midnight: "o poln.",
					noon: "nap.",
					morning: "ráno",
					afternoon: "pop.",
					evening: "več.",
					night: "v n."
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "o poln.",
					noon: "napol.",
					morning: "ráno",
					afternoon: "popol.",
					evening: "večer",
					night: "v noci"
				},
				wide: {
					am: "AM",
					pm: "PM",
					midnight: "o polnoci",
					noon: "napoludnie",
					morning: "ráno",
					afternoon: "popoludní",
					evening: "večer",
					night: "v noci"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)\.?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(pred Kr\.|pred n\. l\.|po Kr\.|n\. l\.)/i,
				abbreviated: /^(pred Kr\.|pred n\. l\.|po Kr\.|n\. l\.)/i,
				wide: /^(pred Kristom|pred na[šs][íi]m letopo[čc]tom|po Kristovi|n[áa][šs]ho letopo[čc]tu)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^pr/i, /^(po|n)/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234]\. [šs]tvr[ťt]rok/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar|apr|m[áa]j|j[úu]n|j[úu]l|aug|sep|okt|nov|dec)/i,
				wide: /^(janu[áa]ra?|febru[áa]ra?|(marec|marca)|apr[íi]la?|m[áa]ja?|j[úu]na?|j[úu]la?|augusta?|(september|septembra)|(okt[óo]ber|okt[óo]bra)|(november|novembra)|(december|decembra))/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
				any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^m[áa]j/i, /^j[úu]n/i, /^j[úu]l/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[npusšp]/i,
				short: /^(ne|po|ut|st|št|pi|so)/i,
				abbreviated: /^(ne|po|ut|st|št|pi|so)/i,
				wide: /^(nede[ľl]a|pondelok|utorok|streda|[šs]tvrtok|piatok|sobota])/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^n/i, /^p/i, /^u/i, /^s/i, /^š/i, /^p/i, /^s/i],
				any: [/^n/i, /^po/i, /^u/i, /^st/i, /^(št|stv)/i, /^pi/i, /^so/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(am|pm|(o )?poln\.?|(nap\.?|pol\.?)|r[áa]no|pop\.?|ve[čc]\.?|(v n\.?|noc))/i,
				abbreviated: /^(am|pm|(o )?poln\.?|(napol\.?|pol\.?)|r[áa]no|pop\.?|ve[čc]er|(v )?noci?)/i,
				any: /^(am|pm|(o )?polnoci?|(na)?poludnie|r[áa]no|popoludn(ie|í|i)|ve[čc]er|(v )?noci?)/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^am/i,
					pm: /^pm/i,
					midnight: /poln/i,
					noon: /^(nap|(na)?pol(\.|u))/i,
					morning: /^r[áa]no/i,
					afternoon: /^pop/i,
					evening: /^ve[čc]/i,
					night: /^(noc|v n\.)/i
				}
			},
			defaultParseWidth: "any"
		});
		const Ba = {
			lessThanXSeconds: {
				present: {
					one: "manj kot {{count}} sekunda",
					two: "manj kot {{count}} sekundi",
					few: "manj kot {{count}} sekunde",
					other: "manj kot {{count}} sekund"
				},
				past: {
					one: "manj kot {{count}} sekundo",
					two: "manj kot {{count}} sekundama",
					few: "manj kot {{count}} sekundami",
					other: "manj kot {{count}} sekundami"
				},
				future: {
					one: "manj kot {{count}} sekundo",
					two: "manj kot {{count}} sekundi",
					few: "manj kot {{count}} sekunde",
					other: "manj kot {{count}} sekund"
				}
			},
			xSeconds: {
				present: {
					one: "{{count}} sekunda",
					two: "{{count}} sekundi",
					few: "{{count}} sekunde",
					other: "{{count}} sekund"
				},
				past: {
					one: "{{count}} sekundo",
					two: "{{count}} sekundama",
					few: "{{count}} sekundami",
					other: "{{count}} sekundami"
				},
				future: {
					one: "{{count}} sekundo",
					two: "{{count}} sekundi",
					few: "{{count}} sekunde",
					other: "{{count}} sekund"
				}
			},
			halfAMinute: "pol minute",
			lessThanXMinutes: {
				present: {
					one: "manj kot {{count}} minuta",
					two: "manj kot {{count}} minuti",
					few: "manj kot {{count}} minute",
					other: "manj kot {{count}} minut"
				},
				past: {
					one: "manj kot {{count}} minuto",
					two: "manj kot {{count}} minutama",
					few: "manj kot {{count}} minutami",
					other: "manj kot {{count}} minutami"
				},
				future: {
					one: "manj kot {{count}} minuto",
					two: "manj kot {{count}} minuti",
					few: "manj kot {{count}} minute",
					other: "manj kot {{count}} minut"
				}
			},
			xMinutes: {
				present: {
					one: "{{count}} minuta",
					two: "{{count}} minuti",
					few: "{{count}} minute",
					other: "{{count}} minut"
				},
				past: {
					one: "{{count}} minuto",
					two: "{{count}} minutama",
					few: "{{count}} minutami",
					other: "{{count}} minutami"
				},
				future: {
					one: "{{count}} minuto",
					two: "{{count}} minuti",
					few: "{{count}} minute",
					other: "{{count}} minut"
				}
			},
			aboutXHours: {
				present: {
					one: "približno {{count}} ura",
					two: "približno {{count}} uri",
					few: "približno {{count}} ure",
					other: "približno {{count}} ur"
				},
				past: {
					one: "približno {{count}} uro",
					two: "približno {{count}} urama",
					few: "približno {{count}} urami",
					other: "približno {{count}} urami"
				},
				future: {
					one: "približno {{count}} uro",
					two: "približno {{count}} uri",
					few: "približno {{count}} ure",
					other: "približno {{count}} ur"
				}
			},
			xHours: {
				present: {
					one: "{{count}} ura",
					two: "{{count}} uri",
					few: "{{count}} ure",
					other: "{{count}} ur"
				},
				past: {
					one: "{{count}} uro",
					two: "{{count}} urama",
					few: "{{count}} urami",
					other: "{{count}} urami"
				},
				future: {
					one: "{{count}} uro",
					two: "{{count}} uri",
					few: "{{count}} ure",
					other: "{{count}} ur"
				}
			},
			xDays: {
				present: {
					one: "{{count}} dan",
					two: "{{count}} dni",
					few: "{{count}} dni",
					other: "{{count}} dni"
				},
				past: {
					one: "{{count}} dnem",
					two: "{{count}} dnevoma",
					few: "{{count}} dnevi",
					other: "{{count}} dnevi"
				},
				future: {
					one: "{{count}} dan",
					two: "{{count}} dni",
					few: "{{count}} dni",
					other: "{{count}} dni"
				}
			},
			aboutXWeeks: {
				one: "približno {{count}} teden",
				two: "približno {{count}} tedna",
				few: "približno {{count}} tedne",
				other: "približno {{count}} tednov"
			},
			xWeeks: {
				one: "{{count}} teden",
				two: "{{count}} tedna",
				few: "{{count}} tedne",
				other: "{{count}} tednov"
			},
			aboutXMonths: {
				present: {
					one: "približno {{count}} mesec",
					two: "približno {{count}} meseca",
					few: "približno {{count}} mesece",
					other: "približno {{count}} mesecev"
				},
				past: {
					one: "približno {{count}} mesecem",
					two: "približno {{count}} mesecema",
					few: "približno {{count}} meseci",
					other: "približno {{count}} meseci"
				},
				future: {
					one: "približno {{count}} mesec",
					two: "približno {{count}} meseca",
					few: "približno {{count}} mesece",
					other: "približno {{count}} mesecev"
				}
			},
			xMonths: {
				present: {
					one: "{{count}} mesec",
					two: "{{count}} meseca",
					few: "{{count}} meseci",
					other: "{{count}} mesecev"
				},
				past: {
					one: "{{count}} mesecem",
					two: "{{count}} mesecema",
					few: "{{count}} meseci",
					other: "{{count}} meseci"
				},
				future: {
					one: "{{count}} mesec",
					two: "{{count}} meseca",
					few: "{{count}} mesece",
					other: "{{count}} mesecev"
				}
			},
			aboutXYears: {
				present: {
					one: "približno {{count}} leto",
					two: "približno {{count}} leti",
					few: "približno {{count}} leta",
					other: "približno {{count}} let"
				},
				past: {
					one: "približno {{count}} letom",
					two: "približno {{count}} letoma",
					few: "približno {{count}} leti",
					other: "približno {{count}} leti"
				},
				future: {
					one: "približno {{count}} leto",
					two: "približno {{count}} leti",
					few: "približno {{count}} leta",
					other: "približno {{count}} let"
				}
			},
			xYears: {
				present: {
					one: "{{count}} leto",
					two: "{{count}} leti",
					few: "{{count}} leta",
					other: "{{count}} let"
				},
				past: {
					one: "{{count}} letom",
					two: "{{count}} letoma",
					few: "{{count}} leti",
					other: "{{count}} leti"
				},
				future: {
					one: "{{count}} leto",
					two: "{{count}} leti",
					few: "{{count}} leta",
					other: "{{count}} let"
				}
			},
			overXYears: {
				present: {
					one: "več kot {{count}} leto",
					two: "več kot {{count}} leti",
					few: "več kot {{count}} leta",
					other: "več kot {{count}} let"
				},
				past: {
					one: "več kot {{count}} letom",
					two: "več kot {{count}} letoma",
					few: "več kot {{count}} leti",
					other: "več kot {{count}} leti"
				},
				future: {
					one: "več kot {{count}} leto",
					two: "več kot {{count}} leti",
					few: "več kot {{count}} leta",
					other: "več kot {{count}} let"
				}
			},
			almostXYears: {
				present: {
					one: "skoraj {{count}} leto",
					two: "skoraj {{count}} leti",
					few: "skoraj {{count}} leta",
					other: "skoraj {{count}} let"
				},
				past: {
					one: "skoraj {{count}} letom",
					two: "skoraj {{count}} letoma",
					few: "skoraj {{count}} leti",
					other: "skoraj {{count}} leti"
				},
				future: {
					one: "skoraj {{count}} leto",
					two: "skoraj {{count}} leti",
					few: "skoraj {{count}} leta",
					other: "skoraj {{count}} let"
				}
			}
		};
		const Qa = {
			date: X({
				formats: {
					full: "EEEE, dd. MMMM y",
					long: "dd. MMMM y",
					medium: "d. MMM y",
					short: "d. MM. yy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Ra = {
			lastWeek: e => {
				switch (e.getDay()) {
				case 0:
					return "'prejšnjo nedeljo ob' p";
				case 3:
					return "'prejšnjo sredo ob' p";
				case 6:
					return "'prejšnjo soboto ob' p";
				default:
					return "'prejšnji' EEEE 'ob' p"
				}
			},
			yesterday: "'včeraj ob' p",
			today: "'danes ob' p",
			tomorrow: "'jutri ob' p",
			nextWeek: e => {
				switch (e.getDay()) {
				case 0:
					return "'naslednjo nedeljo ob' p";
				case 3:
					return "'naslednjo sredo ob' p";
				case 6:
					return "'naslednjo soboto ob' p";
				default:
					return "'naslednji' EEEE 'ob' p"
				}
			},
			other: "P"
		},
		Ua = (_({
				values: {
					narrow: ["pr. n. št.", "po n. št."],
					abbreviated: ["pr. n. št.", "po n. št."],
					wide: ["pred našim štetjem", "po našem štetju"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1. čet.", "2. čet.", "3. čet.", "4. čet."],
					wide: ["1. četrtletje", "2. četrtletje", "3. četrtletje", "4. četrtletje"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
					abbreviated: ["jan.", "feb.", "mar.", "apr.", "maj", "jun.", "jul.", "avg.", "sep.", "okt.", "nov.", "dec."],
					wide: ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["n", "p", "t", "s", "č", "p", "s"],
					short: ["ned.", "pon.", "tor.", "sre.", "čet.", "pet.", "sob."],
					abbreviated: ["ned.", "pon.", "tor.", "sre.", "čet.", "pet.", "sob."],
					wide: ["nedelja", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "d",
						pm: "p",
						midnight: "24.00",
						noon: "12.00",
						morning: "j",
						afternoon: "p",
						evening: "v",
						night: "n"
					},
					abbreviated: {
						am: "dop.",
						pm: "pop.",
						midnight: "poln.",
						noon: "pold.",
						morning: "jut.",
						afternoon: "pop.",
						evening: "več.",
						night: "noč"
					},
					wide: {
						am: "dop.",
						pm: "pop.",
						midnight: "polnoč",
						noon: "poldne",
						morning: "jutro",
						afternoon: "popoldne",
						evening: "večer",
						night: "noč"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "d",
						pm: "p",
						midnight: "24.00",
						noon: "12.00",
						morning: "zj",
						afternoon: "p",
						evening: "zv",
						night: "po"
					},
					abbreviated: {
						am: "dop.",
						pm: "pop.",
						midnight: "opoln.",
						noon: "opold.",
						morning: "zjut.",
						afternoon: "pop.",
						evening: "zveč.",
						night: "ponoči"
					},
					wide: {
						am: "dop.",
						pm: "pop.",
						midnight: "opolnoči",
						noon: "opoldne",
						morning: "zjutraj",
						afternoon: "popoldan",
						evening: "zvečer",
						night: "ponoči"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)\./i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					abbreviated: /^(pr\. n\. št\.|po n\. št\.)/i,
					wide: /^(pred Kristusom|pred na[sš]im [sš]tetjem|po Kristusu|po na[sš]em [sš]tetju|na[sš]ega [sš]tetja)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^pr/i, /^(po|na[sš]em)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234]\.\s?[čc]et\.?/i,
					wide: /^[1234]\. [čc]etrtletje/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[jfmasond]/i,
					abbreviated: /^(jan\.|feb\.|mar\.|apr\.|maj|jun\.|jul\.|avg\.|sep\.|okt\.|nov\.|dec\.)/i,
					wide: /^(januar|februar|marec|april|maj|junij|julij|avgust|september|oktober|november|december)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					abbreviated: [/^ja/i, /^fe/i, /^mar/i, /^ap/i, /^maj/i, /^jun/i, /^jul/i, /^av/i, /^s/i, /^o/i, /^n/i, /^d/i],
					wide: [/^ja/i, /^fe/i, /^mar/i, /^ap/i, /^maj/i, /^jun/i, /^jul/i, /^av/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "wide"
			}), G({
				matchPatterns: {
					narrow: /^[nptsčc]/i,
					short: /^(ned\.|pon\.|tor\.|sre\.|[cč]et\.|pet\.|sob\.)/i,
					abbreviated: /^(ned\.|pon\.|tor\.|sre\.|[cč]et\.|pet\.|sob\.)/i,
					wide: /^(nedelja|ponedeljek|torek|sreda|[cč]etrtek|petek|sobota)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^n/i, /^p/i, /^t/i, /^s/i, /^[cč]/i, /^p/i, /^s/i],
					any: [/^n/i, /^po/i, /^t/i, /^sr/i, /^[cč]/i, /^pe/i, /^so/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(d|po?|z?v|n|z?j|24\.00|12\.00)/i,
					any: /^(dop\.|pop\.|o?poln(\.|o[cč]i?)|o?pold(\.|ne)|z?ve[cč](\.|er)|(po)?no[cč]i?|popold(ne|an)|jut(\.|ro)|zjut(\.|raj))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					narrow: {
						am: /^d/i,
						pm: /^p/i,
						midnight: /^24/i,
						noon: /^12/i,
						morning: /^(z?j)/i,
						afternoon: /^p/i,
						evening: /^(z?v)/i,
						night: /^(n|po)/i
					},
					any: {
						am: /^dop\./i,
						pm: /^pop\./i,
						midnight: /^o?poln/i,
						noon: /^o?pold/i,
						morning: /j/i,
						afternoon: /^pop\./i,
						evening: /^z?ve/i,
						night: /(po)?no/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: {
					standalone: "мање од 1 секунде",
					withPrepositionAgo: "мање од 1 секунде",
					withPrepositionIn: "мање од 1 секунду"
				},
				dual: "мање од {{count}} секунде",
				other: "мање од {{count}} секунди"
			},
			xSeconds: {
				one: {
					standalone: "1 секунда",
					withPrepositionAgo: "1 секунде",
					withPrepositionIn: "1 секунду"
				},
				dual: "{{count}} секунде",
				other: "{{count}} секунди"
			},
			halfAMinute: "пола минуте",
			lessThanXMinutes: {
				one: {
					standalone: "мање од 1 минуте",
					withPrepositionAgo: "мање од 1 минуте",
					withPrepositionIn: "мање од 1 минуту"
				},
				dual: "мање од {{count}} минуте",
				other: "мање од {{count}} минута"
			},
			xMinutes: {
				one: {
					standalone: "1 минута",
					withPrepositionAgo: "1 минуте",
					withPrepositionIn: "1 минуту"
				},
				dual: "{{count}} минуте",
				other: "{{count}} минута"
			},
			aboutXHours: {
				one: {
					standalone: "око 1 сат",
					withPrepositionAgo: "око 1 сат",
					withPrepositionIn: "око 1 сат"
				},
				dual: "око {{count}} сата",
				other: "око {{count}} сати"
			},
			xHours: {
				one: {
					standalone: "1 сат",
					withPrepositionAgo: "1 сат",
					withPrepositionIn: "1 сат"
				},
				dual: "{{count}} сата",
				other: "{{count}} сати"
			},
			xDays: {
				one: {
					standalone: "1 дан",
					withPrepositionAgo: "1 дан",
					withPrepositionIn: "1 дан"
				},
				dual: "{{count}} дана",
				other: "{{count}} дана"
			},
			aboutXWeeks: {
				one: {
					standalone: "око 1 недељу",
					withPrepositionAgo: "око 1 недељу",
					withPrepositionIn: "око 1 недељу"
				},
				dual: "око {{count}} недеље",
				other: "око {{count}} недеље"
			},
			xWeeks: {
				one: {
					standalone: "1 недељу",
					withPrepositionAgo: "1 недељу",
					withPrepositionIn: "1 недељу"
				},
				dual: "{{count}} недеље",
				other: "{{count}} недеље"
			},
			aboutXMonths: {
				one: {
					standalone: "око 1 месец",
					withPrepositionAgo: "око 1 месец",
					withPrepositionIn: "око 1 месец"
				},
				dual: "око {{count}} месеца",
				other: "око {{count}} месеци"
			},
			xMonths: {
				one: {
					standalone: "1 месец",
					withPrepositionAgo: "1 месец",
					withPrepositionIn: "1 месец"
				},
				dual: "{{count}} месеца",
				other: "{{count}} месеци"
			},
			aboutXYears: {
				one: {
					standalone: "око 1 годину",
					withPrepositionAgo: "око 1 годину",
					withPrepositionIn: "око 1 годину"
				},
				dual: "око {{count}} године",
				other: "око {{count}} година"
			},
			xYears: {
				one: {
					standalone: "1 година",
					withPrepositionAgo: "1 године",
					withPrepositionIn: "1 годину"
				},
				dual: "{{count}} године",
				other: "{{count}} година"
			},
			overXYears: {
				one: {
					standalone: "преко 1 годину",
					withPrepositionAgo: "преко 1 годину",
					withPrepositionIn: "преко 1 годину"
				},
				dual: "преко {{count}} године",
				other: "преко {{count}} година"
			},
			almostXYears: {
				one: {
					standalone: "готово 1 годину",
					withPrepositionAgo: "готово 1 годину",
					withPrepositionIn: "готово 1 годину"
				},
				dual: "готово {{count}} године",
				other: "готово {{count}} година"
			}
		}),
		Za = {
			date: X({
				formats: {
					full: "EEEE, d. MMMM yyyy.",
					long: "d. MMMM yyyy.",
					medium: "d. MMM yy.",
					short: "dd. MM. yy."
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss (zzzz)",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'у' {{time}}",
					long: "{{date}} 'у' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		ei = {
			lastWeek: e => {
				switch (e.getDay()) {
				case 0:
					return "'прошле недеље у' p";
				case 3:
					return "'прошле среде у' p";
				case 6:
					return "'прошле суботе у' p";
				default:
					return "'прошли' EEEE 'у' p"
				}
			},
			yesterday: "'јуче у' p",
			today: "'данас у' p",
			tomorrow: "'сутра у' p",
			nextWeek: e => {
				switch (e.getDay()) {
				case 0:
					return "'следеће недеље у' p";
				case 3:
					return "'следећу среду у' p";
				case 6:
					return "'следећу суботу у' p";
				default:
					return "'следећи' EEEE 'у' p"
				}
			},
			other: "P"
		},
		ti = (_({
				values: {
					narrow: ["пр.н.е.", "АД"],
					abbreviated: ["пр. Хр.", "по. Хр."],
					wide: ["Пре Христа", "После Христа"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1.", "2.", "3.", "4."],
					abbreviated: ["1. кв.", "2. кв.", "3. кв.", "4. кв."],
					wide: ["1. квартал", "2. квартал", "3. квартал", "4. квартал"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."],
					abbreviated: ["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец"],
					wide: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."],
					abbreviated: ["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец"],
					wide: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["Н", "П", "У", "С", "Ч", "П", "С"],
					short: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"],
					abbreviated: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"],
					wide: ["недеља", "понедељак", "уторак", "среда", "четвртак", "петак", "субота"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "поноћ",
						noon: "подне",
						morning: "ујутру",
						afternoon: "поподне",
						evening: "увече",
						night: "ноћу"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "поноћ",
						noon: "подне",
						morning: "ујутру",
						afternoon: "поподне",
						evening: "увече",
						night: "ноћу"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "поноћ",
						noon: "подне",
						morning: "ујутру",
						afternoon: "после подне",
						evening: "увече",
						night: "ноћу"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "АМ",
						pm: "ПМ",
						midnight: "поноћ",
						noon: "подне",
						morning: "ујутру",
						afternoon: "поподне",
						evening: "увече",
						night: "ноћу"
					},
					abbreviated: {
						am: "АМ",
						pm: "ПМ",
						midnight: "поноћ",
						noon: "подне",
						morning: "ујутру",
						afternoon: "поподне",
						evening: "увече",
						night: "ноћу"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "поноћ",
						noon: "подне",
						morning: "ујутру",
						afternoon: "после подне",
						evening: "увече",
						night: "ноћу"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)\./i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(пр\.н\.е\.|АД)/i,
					abbreviated: /^(пр\.\s?Хр\.|по\.\s?Хр\.)/i,
					wide: /^(Пре Христа|пре нове ере|После Христа|нова ера)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^пр/i, /^(по|нова)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234]\.\s?кв\.?/i,
					wide: /^[1234]\. квартал/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(10|11|12|[123456789])\./i,
					abbreviated: /^(јан|феб|мар|апр|мај|јун|јул|авг|сеп|окт|нов|дец)/i,
					wide: /^((јануар|јануара)|(фебруар|фебруара)|(март|марта)|(април|априла)|(мја|маја)|(јун|јуна)|(јул|јула)|(август|августа)|(септембар|септембра)|(октобар|октобра)|(новембар|новембра)|(децембар|децембра))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^1/i, /^2/i, /^3/i, /^4/i, /^5/i, /^6/i, /^7/i, /^8/i, /^9/i, /^10/i, /^11/i, /^12/i],
					any: [/^ја/i, /^ф/i, /^мар/i, /^ап/i, /^мај/i, /^јун/i, /^јул/i, /^авг/i, /^с/i, /^о/i, /^н/i, /^д/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[пусчн]/i,
					short: /^(нед|пон|уто|сре|чет|пет|суб)/i,
					abbreviated: /^(нед|пон|уто|сре|чет|пет|суб)/i,
					wide: /^(недеља|понедељак|уторак|среда|четвртак|петак|субота)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^п/i, /^у/i, /^с/i, /^ч/i, /^п/i, /^с/i, /^н/i],
					any: [/^нед/i, /^пон/i, /^уто/i, /^сре/i, /^чет/i, /^пет/i, /^суб/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(ам|пм|поноћ|(по)?подне|увече|ноћу|после подне|ујутру)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^поно/i,
						noon: /^под/i,
						morning: /ујутру/i,
						afternoon: /(после\s|по)+подне/i,
						evening: /(увече)/i,
						night: /(ноћу)/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: {
					standalone: "manje od 1 sekunde",
					withPrepositionAgo: "manje od 1 sekunde",
					withPrepositionIn: "manje od 1 sekundu"
				},
				dual: "manje od {{count}} sekunde",
				other: "manje od {{count}} sekundi"
			},
			xSeconds: {
				one: {
					standalone: "1 sekunda",
					withPrepositionAgo: "1 sekunde",
					withPrepositionIn: "1 sekundu"
				},
				dual: "{{count}} sekunde",
				other: "{{count}} sekundi"
			},
			halfAMinute: "pola minute",
			lessThanXMinutes: {
				one: {
					standalone: "manje od 1 minute",
					withPrepositionAgo: "manje od 1 minute",
					withPrepositionIn: "manje od 1 minutu"
				},
				dual: "manje od {{count}} minute",
				other: "manje od {{count}} minuta"
			},
			xMinutes: {
				one: {
					standalone: "1 minuta",
					withPrepositionAgo: "1 minute",
					withPrepositionIn: "1 minutu"
				},
				dual: "{{count}} minute",
				other: "{{count}} minuta"
			},
			aboutXHours: {
				one: {
					standalone: "oko 1 sat",
					withPrepositionAgo: "oko 1 sat",
					withPrepositionIn: "oko 1 sat"
				},
				dual: "oko {{count}} sata",
				other: "oko {{count}} sati"
			},
			xHours: {
				one: {
					standalone: "1 sat",
					withPrepositionAgo: "1 sat",
					withPrepositionIn: "1 sat"
				},
				dual: "{{count}} sata",
				other: "{{count}} sati"
			},
			xDays: {
				one: {
					standalone: "1 dan",
					withPrepositionAgo: "1 dan",
					withPrepositionIn: "1 dan"
				},
				dual: "{{count}} dana",
				other: "{{count}} dana"
			},
			aboutXWeeks: {
				one: {
					standalone: "oko 1 nedelju",
					withPrepositionAgo: "oko 1 nedelju",
					withPrepositionIn: "oko 1 nedelju"
				},
				dual: "oko {{count}} nedelje",
				other: "oko {{count}} nedelje"
			},
			xWeeks: {
				one: {
					standalone: "1 nedelju",
					withPrepositionAgo: "1 nedelju",
					withPrepositionIn: "1 nedelju"
				},
				dual: "{{count}} nedelje",
				other: "{{count}} nedelje"
			},
			aboutXMonths: {
				one: {
					standalone: "oko 1 mesec",
					withPrepositionAgo: "oko 1 mesec",
					withPrepositionIn: "oko 1 mesec"
				},
				dual: "oko {{count}} meseca",
				other: "oko {{count}} meseci"
			},
			xMonths: {
				one: {
					standalone: "1 mesec",
					withPrepositionAgo: "1 mesec",
					withPrepositionIn: "1 mesec"
				},
				dual: "{{count}} meseca",
				other: "{{count}} meseci"
			},
			aboutXYears: {
				one: {
					standalone: "oko 1 godinu",
					withPrepositionAgo: "oko 1 godinu",
					withPrepositionIn: "oko 1 godinu"
				},
				dual: "oko {{count}} godine",
				other: "oko {{count}} godina"
			},
			xYears: {
				one: {
					standalone: "1 godina",
					withPrepositionAgo: "1 godine",
					withPrepositionIn: "1 godinu"
				},
				dual: "{{count}} godine",
				other: "{{count}} godina"
			},
			overXYears: {
				one: {
					standalone: "preko 1 godinu",
					withPrepositionAgo: "preko 1 godinu",
					withPrepositionIn: "preko 1 godinu"
				},
				dual: "preko {{count}} godine",
				other: "preko {{count}} godina"
			},
			almostXYears: {
				one: {
					standalone: "gotovo 1 godinu",
					withPrepositionAgo: "gotovo 1 godinu",
					withPrepositionIn: "gotovo 1 godinu"
				},
				dual: "gotovo {{count}} godine",
				other: "gotovo {{count}} godina"
			}
		}),
		ni = {
			date: X({
				formats: {
					full: "EEEE, d. MMMM yyyy.",
					long: "d. MMMM yyyy.",
					medium: "d. MMM yy.",
					short: "dd. MM. yy."
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss (zzzz)",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'u' {{time}}",
					long: "{{date}} 'u' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		ai = {
			lastWeek: e => {
				switch (e.getDay()) {
				case 0:
					return "'prošle nedelje u' p";
				case 3:
					return "'prošle srede u' p";
				case 6:
					return "'prošle subote u' p";
				default:
					return "'prošli' EEEE 'u' p"
				}
			},
			yesterday: "'juče u' p",
			today: "'danas u' p",
			tomorrow: "'sutra u' p",
			nextWeek: e => {
				switch (e.getDay()) {
				case 0:
					return "'sledeće nedelje u' p";
				case 3:
					return "'sledeću sredu u' p";
				case 6:
					return "'sledeću subotu u' p";
				default:
					return "'sledeći' EEEE 'u' p"
				}
			},
			other: "P"
		},
		ii = (_({
				values: {
					narrow: ["pr.n.e.", "AD"],
					abbreviated: ["pr. Hr.", "po. Hr."],
					wide: ["Pre Hrista", "Posle Hrista"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1.", "2.", "3.", "4."],
					abbreviated: ["1. kv.", "2. kv.", "3. kv.", "4. kv."],
					wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."],
					abbreviated: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"],
					wide: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."],
					abbreviated: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"],
					wide: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["N", "P", "U", "S", "Č", "P", "S"],
					short: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
					abbreviated: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
					wide: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutru",
						afternoon: "popodne",
						evening: "uveče",
						night: "noću"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutru",
						afternoon: "popodne",
						evening: "uveče",
						night: "noću"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutru",
						afternoon: "posle podne",
						evening: "uveče",
						night: "noću"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutru",
						afternoon: "popodne",
						evening: "uveče",
						night: "noću"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutru",
						afternoon: "popodne",
						evening: "uveče",
						night: "noću"
					},
					wide: {
						am: "AM",
						pm: "PM",
						midnight: "ponoć",
						noon: "podne",
						morning: "ujutru",
						afternoon: "posle podne",
						evening: "uveče",
						night: "noću"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)\./i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(pr\.n\.e\.|AD)/i,
					abbreviated: /^(pr\.\s?Hr\.|po\.\s?Hr\.)/i,
					wide: /^(Pre Hrista|pre nove ere|Posle Hrista|nova era)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^pr/i, /^(po|nova)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234]\.\s?kv\.?/i,
					wide: /^[1234]\. kvartal/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(10|11|12|[123456789])\./i,
					abbreviated: /^(jan|feb|mar|apr|maj|jun|jul|avg|sep|okt|nov|dec)/i,
					wide: /^((januar|januara)|(februar|februara)|(mart|marta)|(april|aprila)|(maj|maja)|(jun|juna)|(jul|jula)|(avgust|avgusta)|(septembar|septembra)|(oktobar|oktobra)|(novembar|novembra)|(decembar|decembra))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^1/i, /^2/i, /^3/i, /^4/i, /^5/i, /^6/i, /^7/i, /^8/i, /^9/i, /^10/i, /^11/i, /^12/i],
					any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^maj/i, /^jun/i, /^jul/i, /^avg/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[npusčc]/i,
					short: /^(ned|pon|uto|sre|(čet|cet)|pet|sub)/i,
					abbreviated: /^(ned|pon|uto|sre|(čet|cet)|pet|sub)/i,
					wide: /^(nedelja|ponedeljak|utorak|sreda|(četvrtak|cetvrtak)|petak|subota)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
					any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(am|pm|ponoc|ponoć|(po)?podne|uvece|uveče|noću|posle podne|ujutru)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^pono/i,
						noon: /^pod/i,
						morning: /jutro/i,
						afternoon: /(posle\s|po)+podne/i,
						evening: /(uvece|uveče)/i,
						night: /(nocu|noću)/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "mindre än en sekund",
				other: "mindre än {{count}} sekunder"
			},
			xSeconds: {
				one: "en sekund",
				other: "{{count}} sekunder"
			},
			halfAMinute: "en halv minut",
			lessThanXMinutes: {
				one: "mindre än en minut",
				other: "mindre än {{count}} minuter"
			},
			xMinutes: {
				one: "en minut",
				other: "{{count}} minuter"
			},
			aboutXHours: {
				one: "ungefär en timme",
				other: "ungefär {{count}} timmar"
			},
			xHours: {
				one: "en timme",
				other: "{{count}} timmar"
			},
			xDays: {
				one: "en dag",
				other: "{{count}} dagar"
			},
			aboutXWeeks: {
				one: "ungefär en vecka",
				other: "ungefär {{count}} veckor"
			},
			xWeeks: {
				one: "en vecka",
				other: "{{count}} veckor"
			},
			aboutXMonths: {
				one: "ungefär en månad",
				other: "ungefär {{count}} månader"
			},
			xMonths: {
				one: "en månad",
				other: "{{count}} månader"
			},
			aboutXYears: {
				one: "ungefär ett år",
				other: "ungefär {{count}} år"
			},
			xYears: {
				one: "ett år",
				other: "{{count}} år"
			},
			overXYears: {
				one: "över ett år",
				other: "över {{count}} år"
			},
			almostXYears: {
				one: "nästan ett år",
				other: "nästan {{count}} år"
			}
		}),
		ri = ["noll", "en", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "elva", "tolv"],
		oi = {
			date: X({
				formats: {
					full: "EEEE d MMMM y",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "y-MM-dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "'kl'. HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'kl.' {{time}}",
					long: "{{date}} 'kl.' {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		si = {
			lastWeek: "'i' EEEE's kl.' p",
			yesterday: "'igår kl.' p",
			today: "'idag kl.' p",
			tomorrow: "'imorgon kl.' p",
			nextWeek: "EEEE 'kl.' p",
			other: "P"
		};
		_({
			values: {
				narrow: ["f.Kr.", "e.Kr."],
				abbreviated: ["f.Kr.", "e.Kr."],
				wide: ["före Kristus", "efter Kristus"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["Q1", "Q2", "Q3", "Q4"],
				wide: ["1:a kvartalet", "2:a kvartalet", "3:e kvartalet", "4:e kvartalet"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
				abbreviated: ["jan.", "feb.", "mars", "apr.", "maj", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "dec."],
				wide: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["S", "M", "T", "O", "T", "F", "L"],
				short: ["sö", "må", "ti", "on", "to", "fr", "lö"],
				abbreviated: ["sön", "mån", "tis", "ons", "tors", "fre", "lör"],
				wide: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "fm",
					pm: "em",
					midnight: "midnatt",
					noon: "middag",
					morning: "morg.",
					afternoon: "efterm.",
					evening: "kväll",
					night: "natt"
				},
				abbreviated: {
					am: "f.m.",
					pm: "e.m.",
					midnight: "midnatt",
					noon: "middag",
					morning: "morgon",
					afternoon: "efterm.",
					evening: "kväll",
					night: "natt"
				},
				wide: {
					am: "förmiddag",
					pm: "eftermiddag",
					midnight: "midnatt",
					noon: "middag",
					morning: "morgon",
					afternoon: "eftermiddag",
					evening: "kväll",
					night: "natt"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "fm",
					pm: "em",
					midnight: "midnatt",
					noon: "middag",
					morning: "på morg.",
					afternoon: "på efterm.",
					evening: "på kvällen",
					night: "på natten"
				},
				abbreviated: {
					am: "fm",
					pm: "em",
					midnight: "midnatt",
					noon: "middag",
					morning: "på morg.",
					afternoon: "på efterm.",
					evening: "på kvällen",
					night: "på natten"
				},
				wide: {
					am: "fm",
					pm: "em",
					midnight: "midnatt",
					noon: "middag",
					morning: "på morgonen",
					afternoon: "på eftermiddagen",
					evening: "på kvällen",
					night: "på natten"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(:a|:e)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(f\.? ?Kr\.?|f\.? ?v\.? ?t\.?|e\.? ?Kr\.?|v\.? ?t\.?)/i,
				abbreviated: /^(f\.? ?Kr\.?|f\.? ?v\.? ?t\.?|e\.? ?Kr\.?|v\.? ?t\.?)/i,
				wide: /^(före Kristus|före vår tid|efter Kristus|vår tid)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^f/i, /^[ev]/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234](:a|:e)? kvartalet/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar[s]?|apr|maj|jun[i]?|jul[i]?|aug|sep|okt|nov|dec)\.?/i,
				wide: /^(januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
				any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^maj/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[smtofl]/i,
				short: /^(sö|må|ti|on|to|fr|lö)/i,
				abbreviated: /^(sön|mån|tis|ons|tors|fre|lör)/i,
				wide: /^(söndag|måndag|tisdag|onsdag|torsdag|fredag|lördag)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^s/i, /^m/i, /^ti/i, /^o/i, /^to/i, /^f/i, /^l/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				any: /^([fe]\.?\s?m\.?|midn(att)?|midd(ag)?|(på) (morgonen|eftermiddagen|kvällen|natten))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^f/i,
					pm: /^e/i,
					midnight: /^midn/i,
					noon: /^midd/i,
					morning: /morgon/i,
					afternoon: /eftermiddag/i,
					evening: /kväll/i,
					night: /natt/i
				}
			},
			defaultParseWidth: "any"
		});
		const di = {
			lessThanXSeconds: {
				one: {
				default:
					"ஒரு வினாடிக்கு குறைவாக",
					in: "ஒரு வினாடிக்குள்",
					ago: "ஒரு வினாடிக்கு முன்பு"
				},
				other: {
				default:
					"{{count}} வினாடிகளுக்கு குறைவாக",
					in: "{{count}} வினாடிகளுக்குள்",
					ago: "{{count}} வினாடிகளுக்கு முன்பு"
				}
			},
			xSeconds: {
				one: {
				default:
					"1 வினாடி",
					in: "1 வினாடியில்",
					ago: "1 வினாடி முன்பு"
				},
				other: {
				default:
					"{{count}} விநாடிகள்",
					in: "{{count}} வினாடிகளில்",
					ago: "{{count}} விநாடிகளுக்கு முன்பு"
				}
			},
			halfAMinute: {
			default:
				"அரை நிமிடம்",
				in: "அரை நிமிடத்தில்",
				ago: "அரை நிமிடம் முன்பு"
			},
			lessThanXMinutes: {
				one: {
				default:
					"ஒரு நிமிடத்திற்கும் குறைவாக",
					in: "ஒரு நிமிடத்திற்குள்",
					ago: "ஒரு நிமிடத்திற்கு முன்பு"
				},
				other: {
				default:
					"{{count}} நிமிடங்களுக்கும் குறைவாக",
					in: "{{count}} நிமிடங்களுக்குள்",
					ago: "{{count}} நிமிடங்களுக்கு முன்பு"
				}
			},
			xMinutes: {
				one: {
				default:
					"1 நிமிடம்",
					in: "1 நிமிடத்தில்",
					ago: "1 நிமிடம் முன்பு"
				},
				other: {
				default:
					"{{count}} நிமிடங்கள்",
					in: "{{count}} நிமிடங்களில்",
					ago: "{{count}} நிமிடங்களுக்கு முன்பு"
				}
			},
			aboutXHours: {
				one: {
				default:
					"சுமார் 1 மணி நேரம்",
					in: "சுமார் 1 மணி நேரத்தில்",
					ago: "சுமார் 1 மணி நேரத்திற்கு முன்பு"
				},
				other: {
				default:
					"சுமார் {{count}} மணி நேரம்",
					in: "சுமார் {{count}} மணி நேரத்திற்கு முன்பு",
					ago: "சுமார் {{count}} மணி நேரத்தில்"
				}
			},
			xHours: {
				one: {
				default:
					"1 மணி நேரம்",
					in: "1 மணி நேரத்தில்",
					ago: "1 மணி நேரத்திற்கு முன்பு"
				},
				other: {
				default:
					"{{count}} மணி நேரம்",
					in: "{{count}} மணி நேரத்தில்",
					ago: "{{count}} மணி நேரத்திற்கு முன்பு"
				}
			},
			xDays: {
				one: {
				default:
					"1 நாள்",
					in: "1 நாளில்",
					ago: "1 நாள் முன்பு"
				},
				other: {
				default:
					"{{count}} நாட்கள்",
					in: "{{count}} நாட்களில்",
					ago: "{{count}} நாட்களுக்கு முன்பு"
				}
			},
			aboutXWeeks: {
				one: {
				default:
					"சுமார் 1 வாரம்",
					in: "சுமார் 1 வாரத்தில்",
					ago: "சுமார் 1 வாரம் முன்பு"
				},
				other: {
				default:
					"சுமார் {{count}} வாரங்கள்",
					in: "சுமார் {{count}} வாரங்களில்",
					ago: "சுமார் {{count}} வாரங்களுக்கு முன்பு"
				}
			},
			xWeeks: {
				one: {
				default:
					"1 வாரம்",
					in: "1 வாரத்தில்",
					ago: "1 வாரம் முன்பு"
				},
				other: {
				default:
					"{{count}} வாரங்கள்",
					in: "{{count}} வாரங்களில்",
					ago: "{{count}} வாரங்களுக்கு முன்பு"
				}
			},
			aboutXMonths: {
				one: {
				default:
					"சுமார் 1 மாதம்",
					in: "சுமார் 1 மாதத்தில்",
					ago: "சுமார் 1 மாதத்திற்கு முன்பு"
				},
				other: {
				default:
					"சுமார் {{count}} மாதங்கள்",
					in: "சுமார் {{count}} மாதங்களில்",
					ago: "சுமார் {{count}} மாதங்களுக்கு முன்பு"
				}
			},
			xMonths: {
				one: {
				default:
					"1 மாதம்",
					in: "1 மாதத்தில்",
					ago: "1 மாதம் முன்பு"
				},
				other: {
				default:
					"{{count}} மாதங்கள்",
					in: "{{count}} மாதங்களில்",
					ago: "{{count}} மாதங்களுக்கு முன்பு"
				}
			},
			aboutXYears: {
				one: {
				default:
					"சுமார் 1 வருடம்",
					in: "சுமார் 1 ஆண்டில்",
					ago: "சுமார் 1 வருடம் முன்பு"
				},
				other: {
				default:
					"சுமார் {{count}} ஆண்டுகள்",
					in: "சுமார் {{count}} ஆண்டுகளில்",
					ago: "சுமார் {{count}} ஆண்டுகளுக்கு முன்பு"
				}
			},
			xYears: {
				one: {
				default:
					"1 வருடம்",
					in: "1 ஆண்டில்",
					ago: "1 வருடம் முன்பு"
				},
				other: {
				default:
					"{{count}} ஆண்டுகள்",
					in: "{{count}} ஆண்டுகளில்",
					ago: "{{count}} ஆண்டுகளுக்கு முன்பு"
				}
			},
			overXYears: {
				one: {
				default:
					"1 வருடத்திற்கு மேல்",
					in: "1 வருடத்திற்கும் மேலாக",
					ago: "1 வருடம் முன்பு"
				},
				other: {
				default:
					"{{count}} ஆண்டுகளுக்கும் மேலாக",
					in: "{{count}} ஆண்டுகளில்",
					ago: "{{count}} ஆண்டுகளுக்கு முன்பு"
				}
			},
			almostXYears: {
				one: {
				default:
					"கிட்டத்தட்ட 1 வருடம்",
					in: "கிட்டத்தட்ட 1 ஆண்டில்",
					ago: "கிட்டத்தட்ட 1 வருடம் முன்பு"
				},
				other: {
				default:
					"கிட்டத்தட்ட {{count}} ஆண்டுகள்",
					in: "கிட்டத்தட்ட {{count}} ஆண்டுகளில்",
					ago: "கிட்டத்தட்ட {{count}} ஆண்டுகளுக்கு முன்பு"
				}
			}
		},
		ui = {
			date: X({
				formats: {
					full: "EEEE, d MMMM, y",
					long: "d MMMM, y",
					medium: "d MMM, y",
					short: "d/M/yy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "a h:mm:ss zzzz",
					long: "a h:mm:ss z",
					medium: "a h:mm:ss",
					short: "a h:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		mi = {
			lastWeek: "'கடந்த' eeee p 'மணிக்கு'",
			yesterday: "'நேற்று ' p 'மணிக்கு'",
			today: "'இன்று ' p 'மணிக்கு'",
			tomorrow: "'நாளை ' p 'மணிக்கு'",
			nextWeek: "eeee p 'மணிக்கு'",
			other: "P"
		},
		li = (_({
				values: {
					narrow: ["கி.மு.", "கி.பி."],
					abbreviated: ["கி.மு.", "கி.பி."],
					wide: ["கிறிஸ்துவுக்கு முன்", "அன்னோ டோமினி"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["காலா.1", "காலா.2", "காலா.3", "காலா.4"],
					wide: ["ஒன்றாம் காலாண்டு", "இரண்டாம் காலாண்டு", "மூன்றாம் காலாண்டு", "நான்காம் காலாண்டு"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["ஜ", "பி", "மா", "ஏ", "மே", "ஜூ", "ஜூ", "ஆ", "செ", "அ", "ந", "டி"],
					abbreviated: ["ஜன.", "பிப்.", "மார்.", "ஏப்.", "மே", "ஜூன்", "ஜூலை", "ஆக.", "செப்.", "அக்.", "நவ.", "டிச."],
					wide: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
					short: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
					abbreviated: ["ஞாயி.", "திங்.", "செவ்.", "புத.", "வியா.", "வெள்.", "சனி"],
					wide: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "மு.ப",
						pm: "பி.ப",
						midnight: "நள்.",
						noon: "நண்.",
						morning: "கா.",
						afternoon: "மதி.",
						evening: "மா.",
						night: "இர."
					},
					abbreviated: {
						am: "முற்பகல்",
						pm: "பிற்பகல்",
						midnight: "நள்ளிரவு",
						noon: "நண்பகல்",
						morning: "காலை",
						afternoon: "மதியம்",
						evening: "மாலை",
						night: "இரவு"
					},
					wide: {
						am: "முற்பகல்",
						pm: "பிற்பகல்",
						midnight: "நள்ளிரவு",
						noon: "நண்பகல்",
						morning: "காலை",
						afternoon: "மதியம்",
						evening: "மாலை",
						night: "இரவு"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "மு.ப",
						pm: "பி.ப",
						midnight: "நள்.",
						noon: "நண்.",
						morning: "கா.",
						afternoon: "மதி.",
						evening: "மா.",
						night: "இர."
					},
					abbreviated: {
						am: "முற்பகல்",
						pm: "பிற்பகல்",
						midnight: "நள்ளிரவு",
						noon: "நண்பகல்",
						morning: "காலை",
						afternoon: "மதியம்",
						evening: "மாலை",
						night: "இரவு"
					},
					wide: {
						am: "முற்பகல்",
						pm: "பிற்பகல்",
						midnight: "நள்ளிரவு",
						noon: "நண்பகல்",
						morning: "காலை",
						afternoon: "மதியம்",
						evening: "மாலை",
						night: "இரவு"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(வது)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(கி.மு.|கி.பி.)/i,
					abbreviated: /^(கி\.?\s?மு\.?|கி\.?\s?பி\.?)/,
					wide: /^(கிறிஸ்துவுக்கு\sமுன்|அன்னோ\sடோமினி)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/கி\.?\s?மு\.?/, /கி\.?\s?பி\.?/]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^காலா.[1234]/i,
					wide: /^(ஒன்றாம்|இரண்டாம்|மூன்றாம்|நான்காம்) காலாண்டு/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/1/i, /2/i, /3/i, /4/i],
					any: [/(1|காலா.1|ஒன்றாம்)/i, /(2|காலா.2|இரண்டாம்)/i, /(3|காலா.3|மூன்றாம்)/i, /(4|காலா.4|நான்காம்)/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(ஜ|பி|மா|ஏ|மே|ஜூ|ஆ|செ|அ|ந|டி)$/i,
					abbreviated: /^(ஜன.|பிப்.|மார்.|ஏப்.|மே|ஜூன்|ஜூலை|ஆக.|செப்.|அக்.|நவ.|டிச.)/i,
					wide: /^(ஜனவரி|பிப்ரவரி|மார்ச்|ஏப்ரல்|மே|ஜூன்|ஜூலை|ஆகஸ்ட்|செப்டம்பர்|அக்டோபர்|நவம்பர்|டிசம்பர்)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ஜ$/i, /^பி/i, /^மா/i, /^ஏ/i, /^மே/i, /^ஜூ/i, /^ஜூ/i, /^ஆ/i, /^செ/i, /^அ/i, /^ந/i, /^டி/i],
					any: [/^ஜன/i, /^பி/i, /^மா/i, /^ஏ/i, /^மே/i, /^ஜூன்/i, /^ஜூலை/i, /^ஆ/i, /^செ/i, /^அ/i, /^ந/i, /^டி/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(ஞா|தி|செ|பு|வி|வெ|ச)/i,
					short: /^(ஞா|தி|செ|பு|வி|வெ|ச)/i,
					abbreviated: /^(ஞாயி.|திங்.|செவ்.|புத.|வியா.|வெள்.|சனி)/i,
					wide: /^(ஞாயிறு|திங்கள்|செவ்வாய்|புதன்|வியாழன்|வெள்ளி|சனி)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ஞா/i, /^தி/i, /^செ/i, /^பு/i, /^வி/i, /^வெ/i, /^ச/i],
					any: [/^ஞா/i, /^தி/i, /^செ/i, /^பு/i, /^வி/i, /^வெ/i, /^ச/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(மு.ப|பி.ப|நள்|நண்|காலை|மதியம்|மாலை|இரவு)/i,
					any: /^(மு.ப|பி.ப|முற்பகல்|பிற்பகல்|நள்ளிரவு|நண்பகல்|காலை|மதியம்|மாலை|இரவு)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^மு/i,
						pm: /^பி/i,
						midnight: /^நள்/i,
						noon: /^நண்/i,
						morning: /காலை/i,
						afternoon: /மதியம்/i,
						evening: /மாலை/i,
						night: /இரவு/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				standalone: {
					one: "సెకను కన్నా తక్కువ",
					other: "{{count}} సెకన్ల కన్నా తక్కువ"
				},
				withPreposition: {
					one: "సెకను",
					other: "{{count}} సెకన్ల"
				}
			},
			xSeconds: {
				standalone: {
					one: "ఒక సెకను",
					other: "{{count}} సెకన్ల"
				},
				withPreposition: {
					one: "ఒక సెకను",
					other: "{{count}} సెకన్ల"
				}
			},
			halfAMinute: {
				standalone: "అర నిమిషం",
				withPreposition: "అర నిమిషం"
			},
			lessThanXMinutes: {
				standalone: {
					one: "ఒక నిమిషం కన్నా తక్కువ",
					other: "{{count}} నిమిషాల కన్నా తక్కువ"
				},
				withPreposition: {
					one: "ఒక నిమిషం",
					other: "{{count}} నిమిషాల"
				}
			},
			xMinutes: {
				standalone: {
					one: "ఒక నిమిషం",
					other: "{{count}} నిమిషాలు"
				},
				withPreposition: {
					one: "ఒక నిమిషం",
					other: "{{count}} నిమిషాల"
				}
			},
			aboutXHours: {
				standalone: {
					one: "సుమారు ఒక గంట",
					other: "సుమారు {{count}} గంటలు"
				},
				withPreposition: {
					one: "సుమారు ఒక గంట",
					other: "సుమారు {{count}} గంటల"
				}
			},
			xHours: {
				standalone: {
					one: "ఒక గంట",
					other: "{{count}} గంటలు"
				},
				withPreposition: {
					one: "ఒక గంట",
					other: "{{count}} గంటల"
				}
			},
			xDays: {
				standalone: {
					one: "ఒక రోజు",
					other: "{{count}} రోజులు"
				},
				withPreposition: {
					one: "ఒక రోజు",
					other: "{{count}} రోజుల"
				}
			},
			aboutXWeeks: {
				standalone: {
					one: "సుమారు ఒక వారం",
					other: "సుమారు {{count}} వారాలు"
				},
				withPreposition: {
					one: "సుమారు ఒక వారం",
					other: "సుమారు {{count}} వారాలల"
				}
			},
			xWeeks: {
				standalone: {
					one: "ఒక వారం",
					other: "{{count}} వారాలు"
				},
				withPreposition: {
					one: "ఒక వారం",
					other: "{{count}} వారాలల"
				}
			},
			aboutXMonths: {
				standalone: {
					one: "సుమారు ఒక నెల",
					other: "సుమారు {{count}} నెలలు"
				},
				withPreposition: {
					one: "సుమారు ఒక నెల",
					other: "సుమారు {{count}} నెలల"
				}
			},
			xMonths: {
				standalone: {
					one: "ఒక నెల",
					other: "{{count}} నెలలు"
				},
				withPreposition: {
					one: "ఒక నెల",
					other: "{{count}} నెలల"
				}
			},
			aboutXYears: {
				standalone: {
					one: "సుమారు ఒక సంవత్సరం",
					other: "సుమారు {{count}} సంవత్సరాలు"
				},
				withPreposition: {
					one: "సుమారు ఒక సంవత్సరం",
					other: "సుమారు {{count}} సంవత్సరాల"
				}
			},
			xYears: {
				standalone: {
					one: "ఒక సంవత్సరం",
					other: "{{count}} సంవత్సరాలు"
				},
				withPreposition: {
					one: "ఒక సంవత్సరం",
					other: "{{count}} సంవత్సరాల"
				}
			},
			overXYears: {
				standalone: {
					one: "ఒక సంవత్సరం పైగా",
					other: "{{count}} సంవత్సరాలకు పైగా"
				},
				withPreposition: {
					one: "ఒక సంవత్సరం",
					other: "{{count}} సంవత్సరాల"
				}
			},
			almostXYears: {
				standalone: {
					one: "దాదాపు ఒక సంవత్సరం",
					other: "దాదాపు {{count}} సంవత్సరాలు"
				},
				withPreposition: {
					one: "దాదాపు ఒక సంవత్సరం",
					other: "దాదాపు {{count}} సంవత్సరాల"
				}
			}
		}),
		hi = {
			date: X({
				formats: {
					full: "d, MMMM y, EEEE",
					long: "d MMMM, y",
					medium: "d MMM, y",
					short: "dd-MM-yy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}'కి'",
					long: "{{date}} {{time}}'కి'",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		ci = {
			lastWeek: "'గత' eeee p",
			yesterday: "'నిన్న' p",
			today: "'ఈ రోజు' p",
			tomorrow: "'రేపు' p",
			nextWeek: "'తదుపరి' eeee p",
			other: "P"
		},
		gi = (_({
				values: {
					narrow: ["క్రీ.పూ.", "క్రీ.శ."],
					abbreviated: ["క్రీ.పూ.", "క్రీ.శ."],
					wide: ["క్రీస్తు పూర్వం", "క్రీస్తుశకం"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["త్రై1", "త్రై2", "త్రై3", "త్రై4"],
					wide: ["1వ త్రైమాసికం", "2వ త్రైమాసికం", "3వ త్రైమాసికం", "4వ త్రైమాసికం"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["జ", "ఫి", "మా", "ఏ", "మే", "జూ", "జు", "ఆ", "సె", "అ", "న", "డి"],
					abbreviated: ["జన", "ఫిబ్ర", "మార్చి", "ఏప్రి", "మే", "జూన్", "జులై", "ఆగ", "సెప్టెం", "అక్టో", "నవం", "డిసెం"],
					wide: ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జులై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["ఆ", "సో", "మ", "బు", "గు", "శు", "శ"],
					short: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
					abbreviated: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
					wide: ["ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "పూర్వాహ్నం",
						pm: "అపరాహ్నం",
						midnight: "అర్ధరాత్రి",
						noon: "మిట్టమధ్యాహ్నం",
						morning: "ఉదయం",
						afternoon: "మధ్యాహ్నం",
						evening: "సాయంత్రం",
						night: "రాత్రి"
					},
					abbreviated: {
						am: "పూర్వాహ్నం",
						pm: "అపరాహ్నం",
						midnight: "అర్ధరాత్రి",
						noon: "మిట్టమధ్యాహ్నం",
						morning: "ఉదయం",
						afternoon: "మధ్యాహ్నం",
						evening: "సాయంత్రం",
						night: "రాత్రి"
					},
					wide: {
						am: "పూర్వాహ్నం",
						pm: "అపరాహ్నం",
						midnight: "అర్ధరాత్రి",
						noon: "మిట్టమధ్యాహ్నం",
						morning: "ఉదయం",
						afternoon: "మధ్యాహ్నం",
						evening: "సాయంత్రం",
						night: "రాత్రి"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "పూర్వాహ్నం",
						pm: "అపరాహ్నం",
						midnight: "అర్ధరాత్రి",
						noon: "మిట్టమధ్యాహ్నం",
						morning: "ఉదయం",
						afternoon: "మధ్యాహ్నం",
						evening: "సాయంత్రం",
						night: "రాత్రి"
					},
					abbreviated: {
						am: "పూర్వాహ్నం",
						pm: "అపరాహ్నం",
						midnight: "అర్ధరాత్రి",
						noon: "మిట్టమధ్యాహ్నం",
						morning: "ఉదయం",
						afternoon: "మధ్యాహ్నం",
						evening: "సాయంత్రం",
						night: "రాత్రి"
					},
					wide: {
						am: "పూర్వాహ్నం",
						pm: "అపరాహ్నం",
						midnight: "అర్ధరాత్రి",
						noon: "మిట్టమధ్యాహ్నం",
						morning: "ఉదయం",
						afternoon: "మధ్యాహ్నం",
						evening: "సాయంత్రం",
						night: "రాత్రి"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(వ)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(క్రీ\.పూ\.|క్రీ\.శ\.)/i,
					abbreviated: /^(క్రీ\.?\s?పూ\.?|ప్ర\.?\s?శ\.?\s?పూ\.?|క్రీ\.?\s?శ\.?|సా\.?\s?శ\.?)/i,
					wide: /^(క్రీస్తు పూర్వం|ప్రస్తుత శకానికి పూర్వం|క్రీస్తు శకం|ప్రస్తుత శకం)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^(పూ|శ)/i, /^సా/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^త్రై[1234]/i,
					wide: /^[1234](వ)? త్రైమాసికం/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(జూ|జు|జ|ఫి|మా|ఏ|మే|ఆ|సె|అ|న|డి)/i,
					abbreviated: /^(జన|ఫిబ్ర|మార్చి|ఏప్రి|మే|జూన్|జులై|ఆగ|సెప్|అక్టో|నవ|డిసె)/i,
					wide: /^(జనవరి|ఫిబ్రవరి|మార్చి|ఏప్రిల్|మే|జూన్|జులై|ఆగస్టు|సెప్టెంబర్|అక్టోబర్|నవంబర్|డిసెంబర్)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^జ/i, /^ఫి/i, /^మా/i, /^ఏ/i, /^మే/i, /^జూ/i, /^జు/i, /^ఆ/i, /^సె/i, /^అ/i, /^న/i, /^డి/i],
					any: [/^జన/i, /^ఫి/i, /^మా/i, /^ఏ/i, /^మే/i, /^జూన్/i, /^జులై/i, /^ఆగ/i, /^సె/i, /^అ/i, /^న/i, /^డి/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(ఆ|సో|మ|బు|గు|శు|శ)/i,
					short: /^(ఆది|సోమ|మం|బుధ|గురు|శుక్ర|శని)/i,
					abbreviated: /^(ఆది|సోమ|మం|బుధ|గురు|శుక్ర|శని)/i,
					wide: /^(ఆదివారం|సోమవారం|మంగళవారం|బుధవారం|గురువారం|శుక్రవారం|శనివారం)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^ఆ/i, /^సో/i, /^మ/i, /^బు/i, /^గు/i, /^శు/i, /^శ/i],
					any: [/^ఆది/i, /^సోమ/i, /^మం/i, /^బుధ/i, /^గురు/i, /^శుక్ర/i, /^శని/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(పూర్వాహ్నం|అపరాహ్నం|అర్ధరాత్రి|మిట్టమధ్యాహ్నం|ఉదయం|మధ్యాహ్నం|సాయంత్రం|రాత్రి)/i,
					any: /^(పూర్వాహ్నం|అపరాహ్నం|అర్ధరాత్రి|మిట్టమధ్యాహ్నం|ఉదయం|మధ్యాహ్నం|సాయంత్రం|రాత్రి)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^పూర్వాహ్నం/i,
						pm: /^అపరాహ్నం/i,
						midnight: /^అర్ధ/i,
						noon: /^మిట్ట/i,
						morning: /ఉదయం/i,
						afternoon: /మధ్యాహ్నం/i,
						evening: /సాయంత్రం/i,
						night: /రాత్రి/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "น้อยกว่า 1 วินาที",
				other: "น้อยกว่า {{count}} วินาที"
			},
			xSeconds: {
				one: "1 วินาที",
				other: "{{count}} วินาที"
			},
			halfAMinute: "ครึ่งนาที",
			lessThanXMinutes: {
				one: "น้อยกว่า 1 นาที",
				other: "น้อยกว่า {{count}} นาที"
			},
			xMinutes: {
				one: "1 นาที",
				other: "{{count}} นาที"
			},
			aboutXHours: {
				one: "ประมาณ 1 ชั่วโมง",
				other: "ประมาณ {{count}} ชั่วโมง"
			},
			xHours: {
				one: "1 ชั่วโมง",
				other: "{{count}} ชั่วโมง"
			},
			xDays: {
				one: "1 วัน",
				other: "{{count}} วัน"
			},
			aboutXWeeks: {
				one: "ประมาณ 1 สัปดาห์",
				other: "ประมาณ {{count}} สัปดาห์"
			},
			xWeeks: {
				one: "1 สัปดาห์",
				other: "{{count}} สัปดาห์"
			},
			aboutXMonths: {
				one: "ประมาณ 1 เดือน",
				other: "ประมาณ {{count}} เดือน"
			},
			xMonths: {
				one: "1 เดือน",
				other: "{{count}} เดือน"
			},
			aboutXYears: {
				one: "ประมาณ 1 ปี",
				other: "ประมาณ {{count}} ปี"
			},
			xYears: {
				one: "1 ปี",
				other: "{{count}} ปี"
			},
			overXYears: {
				one: "มากกว่า 1 ปี",
				other: "มากกว่า {{count}} ปี"
			},
			almostXYears: {
				one: "เกือบ 1 ปี",
				other: "เกือบ {{count}} ปี"
			}
		}),
		fi = {
			date: X({
				formats: {
					full: "วันEEEEที่ do MMMM y",
					long: "do MMMM y",
					medium: "d MMM y",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss น. zzzz",
					long: "H:mm:ss น. z",
					medium: "H:mm:ss น.",
					short: "H:mm น."
				},
				defaultWidth: "medium"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'เวลา' {{time}}",
					long: "{{date}} 'เวลา' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		pi = {
			lastWeek: "eeee'ที่แล้วเวลา' p",
			yesterday: "'เมื่อวานนี้เวลา' p",
			today: "'วันนี้เวลา' p",
			tomorrow: "'พรุ่งนี้เวลา' p",
			nextWeek: "eeee 'เวลา' p",
			other: "P"
		},
		vi = (_({
				values: {
					narrow: ["B", "คศ"],
					abbreviated: ["BC", "ค.ศ."],
					wide: ["ปีก่อนคริสตกาล", "คริสต์ศักราช"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["ไตรมาสแรก", "ไตรมาสที่สอง", "ไตรมาสที่สาม", "ไตรมาสที่สี่"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
					abbreviated: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
					wide: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
					short: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
					abbreviated: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
					wide: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ก่อนเที่ยง",
						pm: "หลังเที่ยง",
						midnight: "เที่ยงคืน",
						noon: "เที่ยง",
						morning: "เช้า",
						afternoon: "บ่าย",
						evening: "เย็น",
						night: "กลางคืน"
					},
					abbreviated: {
						am: "ก่อนเที่ยง",
						pm: "หลังเที่ยง",
						midnight: "เที่ยงคืน",
						noon: "เที่ยง",
						morning: "เช้า",
						afternoon: "บ่าย",
						evening: "เย็น",
						night: "กลางคืน"
					},
					wide: {
						am: "ก่อนเที่ยง",
						pm: "หลังเที่ยง",
						midnight: "เที่ยงคืน",
						noon: "เที่ยง",
						morning: "เช้า",
						afternoon: "บ่าย",
						evening: "เย็น",
						night: "กลางคืน"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "ก่อนเที่ยง",
						pm: "หลังเที่ยง",
						midnight: "เที่ยงคืน",
						noon: "เที่ยง",
						morning: "ตอนเช้า",
						afternoon: "ตอนกลางวัน",
						evening: "ตอนเย็น",
						night: "ตอนกลางคืน"
					},
					abbreviated: {
						am: "ก่อนเที่ยง",
						pm: "หลังเที่ยง",
						midnight: "เที่ยงคืน",
						noon: "เที่ยง",
						morning: "ตอนเช้า",
						afternoon: "ตอนกลางวัน",
						evening: "ตอนเย็น",
						night: "ตอนกลางคืน"
					},
					wide: {
						am: "ก่อนเที่ยง",
						pm: "หลังเที่ยง",
						midnight: "เที่ยงคืน",
						noon: "เที่ยง",
						morning: "ตอนเช้า",
						afternoon: "ตอนกลางวัน",
						evening: "ตอนเย็น",
						night: "ตอนกลางคืน"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^\d+/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^([bB]|[aA]|คศ)/i,
					abbreviated: /^([bB]\.?\s?[cC]\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?|ค\.?ศ\.?)/i,
					wide: /^(ก่อนคริสตกาล|คริสต์ศักราช|คริสตกาล)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^[bB]/i, /^(^[aA]|ค\.?ศ\.?|คริสตกาล|คริสต์ศักราช|)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^ไตรมาส(ที่)? ?[1234]/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/(1|แรก|หนึ่ง)/i, /(2|สอง)/i, /(3|สาม)/i, /(4|สี่)/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?)/i,
					abbreviated: /^(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?')/i,
					wide: /^(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					wide: [/^มก/i, /^กุม/i, /^มี/i, /^เม/i, /^พฤษ/i, /^มิ/i, /^กรก/i, /^ส/i, /^กัน/i, /^ต/i, /^พฤศ/i, /^ธ/i],
					any: [/^ม\.?ค\.?/i, /^ก\.?พ\.?/i, /^มี\.?ค\.?/i, /^เม\.?ย\.?/i, /^พ\.?ค\.?/i, /^มิ\.?ย\.?/i, /^ก\.?ค\.?/i, /^ส\.?ค\.?/i, /^ก\.?ย\.?/i, /^ต\.?ค\.?/i, /^พ\.?ย\.?/i, /^ธ\.?ค\.?/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(อา\.?|จ\.?|อ\.?|พฤ\.?|พ\.?|ศ\.?|ส\.?)/i,
					short: /^(อา\.?|จ\.?|อ\.?|พฤ\.?|พ\.?|ศ\.?|ส\.?)/i,
					abbreviated: /^(อา\.?|จ\.?|อ\.?|พฤ\.?|พ\.?|ศ\.?|ส\.?)/i,
					wide: /^(อาทิตย์|จันทร์|อังคาร|พุธ|พฤหัสบดี|ศุกร์|เสาร์)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					wide: [/^อา/i, /^จั/i, /^อั/i, /^พุธ/i, /^พฤ/i, /^ศ/i, /^เส/i],
					any: [/^อา/i, /^จ/i, /^อ/i, /^พ(?!ฤ)/i, /^พฤ/i, /^ศ/i, /^ส/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(ก่อนเที่ยง|หลังเที่ยง|เที่ยงคืน|เที่ยง|(ตอน.*?)?.*(เที่ยง|เช้า|บ่าย|เย็น|กลางคืน))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^ก่อนเที่ยง/i,
						pm: /^หลังเที่ยง/i,
						midnight: /^เที่ยงคืน/i,
						noon: /^เที่ยง/i,
						morning: /เช้า/i,
						afternoon: /บ่าย/i,
						evening: /เย็น/i,
						night: /กลางคืน/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "bir saniyeden az",
				other: "{{count}} saniyeden az"
			},
			xSeconds: {
				one: "1 saniye",
				other: "{{count}} saniye"
			},
			halfAMinute: "yarım dakika",
			lessThanXMinutes: {
				one: "bir dakikadan az",
				other: "{{count}} dakikadan az"
			},
			xMinutes: {
				one: "1 dakika",
				other: "{{count}} dakika"
			},
			aboutXHours: {
				one: "yaklaşık 1 saat",
				other: "yaklaşık {{count}} saat"
			},
			xHours: {
				one: "1 saat",
				other: "{{count}} saat"
			},
			xDays: {
				one: "1 gün",
				other: "{{count}} gün"
			},
			aboutXWeeks: {
				one: "yaklaşık 1 hafta",
				other: "yaklaşık {{count}} hafta"
			},
			xWeeks: {
				one: "1 hafta",
				other: "{{count}} hafta"
			},
			aboutXMonths: {
				one: "yaklaşık 1 ay",
				other: "yaklaşık {{count}} ay"
			},
			xMonths: {
				one: "1 ay",
				other: "{{count}} ay"
			},
			aboutXYears: {
				one: "yaklaşık 1 yıl",
				other: "yaklaşık {{count}} yıl"
			},
			xYears: {
				one: "1 yıl",
				other: "{{count}} yıl"
			},
			overXYears: {
				one: "1 yıldan fazla",
				other: "{{count}} yıldan fazla"
			},
			almostXYears: {
				one: "neredeyse 1 yıl",
				other: "neredeyse {{count}} yıl"
			}
		}),
		bi = {
			date: X({
				formats: {
					full: "d MMMM y EEEE",
					long: "d MMMM y",
					medium: "d MMM y",
					short: "dd.MM.yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'saat' {{time}}",
					long: "{{date}} 'saat' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		wi = {
			lastWeek: "'geçen hafta' eeee 'saat' p",
			yesterday: "'dün saat' p",
			today: "'bugün saat' p",
			tomorrow: "'yarın saat' p",
			nextWeek: "eeee 'saat' p",
			other: "P"
		},
		yi = (_({
				values: {
					narrow: ["MÖ", "MS"],
					abbreviated: ["MÖ", "MS"],
					wide: ["Milattan Önce", "Milattan Sonra"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1Ç", "2Ç", "3Ç", "4Ç"],
					wide: ["İlk çeyrek", "İkinci Çeyrek", "Üçüncü çeyrek", "Son çeyrek"]
				},
				defaultWidth: "wide",
				argumentCallback: e => Number(e) - 1
			}), _({
				values: {
					narrow: ["O", "Ş", "M", "N", "M", "H", "T", "A", "E", "E", "K", "A"],
					abbreviated: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
					wide: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["P", "P", "S", "Ç", "P", "C", "C"],
					short: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
					abbreviated: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cts"],
					wide: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "öö",
						pm: "ös",
						midnight: "gy",
						noon: "ö",
						morning: "sa",
						afternoon: "ös",
						evening: "ak",
						night: "ge"
					},
					abbreviated: {
						am: "ÖÖ",
						pm: "ÖS",
						midnight: "gece yarısı",
						noon: "öğle",
						morning: "sabah",
						afternoon: "öğleden sonra",
						evening: "akşam",
						night: "gece"
					},
					wide: {
						am: "Ö.Ö.",
						pm: "Ö.S.",
						midnight: "gece yarısı",
						noon: "öğle",
						morning: "sabah",
						afternoon: "öğleden sonra",
						evening: "akşam",
						night: "gece"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "öö",
						pm: "ös",
						midnight: "gy",
						noon: "ö",
						morning: "sa",
						afternoon: "ös",
						evening: "ak",
						night: "ge"
					},
					abbreviated: {
						am: "ÖÖ",
						pm: "ÖS",
						midnight: "gece yarısı",
						noon: "öğlen",
						morning: "sabahleyin",
						afternoon: "öğleden sonra",
						evening: "akşamleyin",
						night: "geceleyin"
					},
					wide: {
						am: "ö.ö.",
						pm: "ö.s.",
						midnight: "gece yarısı",
						noon: "öğlen",
						morning: "sabahleyin",
						afternoon: "öğleden sonra",
						evening: "akşamleyin",
						night: "geceleyin"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(\.)?/i,
				parsePattern: /\d+/i,
				valueCallback: function (e) {
					return parseInt(e, 10)
				}
			}), G({
				matchPatterns: {
					narrow: /^(mö|ms)/i,
					abbreviated: /^(mö|ms)/i,
					wide: /^(milattan önce|milattan sonra)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/(^mö|^milattan önce)/i, /(^ms|^milattan sonra)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234]ç/i,
					wide: /^((i|İ)lk|(i|İ)kinci|üçüncü|son) çeyrek/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i],
					abbreviated: [/1ç/i, /2ç/i, /3ç/i, /4ç/i],
					wide: [/^(i|İ)lk çeyrek/i, /(i|İ)kinci çeyrek/i, /üçüncü çeyrek/i, /son çeyrek/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[oşmnhtaek]/i,
					abbreviated: /^(oca|şub|mar|nis|may|haz|tem|ağu|eyl|eki|kas|ara)/i,
					wide: /^(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^o/i, /^ş/i, /^m/i, /^n/i, /^m/i, /^h/i, /^t/i, /^a/i, /^e/i, /^e/i, /^k/i, /^a/i],
					any: [/^o/i, /^ş/i, /^mar/i, /^n/i, /^may/i, /^h/i, /^t/i, /^ağ/i, /^ey/i, /^ek/i, /^k/i, /^ar/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[psçc]/i,
					short: /^(pz|pt|sa|ça|pe|cu|ct)/i,
					abbreviated: /^(paz|pzt|sal|çar|per|cum|cts)/i,
					wide: /^(pazar(?!tesi)|pazartesi|salı|çarşamba|perşembe|cuma(?!rtesi)|cumartesi)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^p/i, /^p/i, /^s/i, /^ç/i, /^p/i, /^c/i, /^c/i],
					any: [/^pz/i, /^pt/i, /^sa/i, /^ça/i, /^pe/i, /^cu/i, /^ct/i],
					wide: [/^pazar(?!tesi)/i, /^pazartesi/i, /^salı/i, /^çarşamba/i, /^perşembe/i, /^cuma(?!rtesi)/i, /^cumartesi/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(öö|ös|gy|ö|sa|ös|ak|ge)/i,
					any: /^(ö\.?\s?[ös]\.?|öğleden sonra|gece yarısı|öğle|(sabah|öğ|akşam|gece)(leyin))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^ö\.?ö\.?/i,
						pm: /^ö\.?s\.?/i,
						midnight: /^(gy|gece yarısı)/i,
						noon: /^öğ/i,
						morning: /^sa/i,
						afternoon: /^öğleden sonra/i,
						evening: /^ak/i,
						night: /^ge/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "بىر سىكۇنت ئىچىدە",
				other: "سىكۇنت ئىچىدە {{count}}"
			},
			xSeconds: {
				one: "بىر سىكۇنت",
				other: "سىكۇنت {{count}}"
			},
			halfAMinute: "يىرىم مىنۇت",
			lessThanXMinutes: {
				one: "بىر مىنۇت ئىچىدە",
				other: "مىنۇت ئىچىدە {{count}}"
			},
			xMinutes: {
				one: "بىر مىنۇت",
				other: "مىنۇت {{count}}"
			},
			aboutXHours: {
				one: "تەخمىنەن بىر سائەت",
				other: "سائەت {{count}} تەخمىنەن"
			},
			xHours: {
				one: "بىر سائەت",
				other: "سائەت {{count}}"
			},
			xDays: {
				one: "بىر كۈن",
				other: "كۈن {{count}}"
			},
			aboutXWeeks: {
				one: "تەخمىنەن بىرھەپتە",
				other: "ھەپتە {{count}} تەخمىنەن"
			},
			xWeeks: {
				one: "بىرھەپتە",
				other: "ھەپتە {{count}}"
			},
			aboutXMonths: {
				one: "تەخمىنەن بىر ئاي",
				other: "ئاي {{count}} تەخمىنەن"
			},
			xMonths: {
				one: "بىر ئاي",
				other: "ئاي {{count}}"
			},
			aboutXYears: {
				one: "تەخمىنەن بىر يىل",
				other: "يىل {{count}} تەخمىنەن"
			},
			xYears: {
				one: "بىر يىل",
				other: "يىل {{count}}"
			},
			overXYears: {
				one: "بىر يىلدىن ئارتۇق",
				other: "يىلدىن ئارتۇق {{count}}"
			},
			almostXYears: {
				one: "ئاساسەن بىر يىل",
				other: "يىل {{count}} ئاساسەن"
			}
		}),
		Mi = {
			date: X({
				formats: {
					full: "EEEE, MMMM do, y",
					long: "MMMM do, y",
					medium: "MMM d, y",
					short: "MM/dd/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'دە' {{time}}",
					long: "{{date}} 'دە' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		ki = {
			lastWeek: "'ئ‍ۆتكەن' eeee 'دە' p",
			yesterday: "'تۈنۈگۈن دە' p",
			today: "'بۈگۈن دە' p",
			tomorrow: "'ئەتە دە' p",
			nextWeek: "eeee 'دە' p",
			other: "P"
		};
		_({
			values: {
				narrow: ["ب", "ك"],
				abbreviated: ["ب", "ك"],
				wide: ["مىيلادىدىن بۇرۇن", "مىيلادىدىن كىيىن"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["1", "2", "3", "4"],
				wide: ["بىرىنجى چارەك", "ئىككىنجى چارەك", "ئۈچىنجى چارەك", "تۆتىنجى چارەك"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["ي", "ف", "م", "ا", "م", "ى", "ى", "ا", "س", "ۆ", "ن", "د"],
				abbreviated: ["يانۋار", "فېۋىرال", "مارت", "ئاپرىل", "ماي", "ئىيۇن", "ئىيول", "ئاۋغۇست", "سىنتەبىر", "ئۆكتەبىر", "نويابىر", "دىكابىر"],
				wide: ["يانۋار", "فېۋىرال", "مارت", "ئاپرىل", "ماي", "ئىيۇن", "ئىيول", "ئاۋغۇست", "سىنتەبىر", "ئۆكتەبىر", "نويابىر", "دىكابىر"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["ي", "د", "س", "چ", "پ", "ج", "ش"],
				short: ["ي", "د", "س", "چ", "پ", "ج", "ش"],
				abbreviated: ["يەكشەنبە", "دۈشەنبە", "سەيشەنبە", "چارشەنبە", "پەيشەنبە", "جۈمە", "شەنبە"],
				wide: ["يەكشەنبە", "دۈشەنبە", "سەيشەنبە", "چارشەنبە", "پەيشەنبە", "جۈمە", "شەنبە"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "ئە",
					pm: "چ",
					midnight: "ك",
					noon: "چ",
					morning: "ئەتىگەن",
					afternoon: "چۈشتىن كىيىن",
					evening: "ئاخشىم",
					night: "كىچە"
				},
				abbreviated: {
					am: "ئە",
					pm: "چ",
					midnight: "ك",
					noon: "چ",
					morning: "ئەتىگەن",
					afternoon: "چۈشتىن كىيىن",
					evening: "ئاخشىم",
					night: "كىچە"
				},
				wide: {
					am: "ئە",
					pm: "چ",
					midnight: "ك",
					noon: "چ",
					morning: "ئەتىگەن",
					afternoon: "چۈشتىن كىيىن",
					evening: "ئاخشىم",
					night: "كىچە"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "ئە",
					pm: "چ",
					midnight: "ك",
					noon: "چ",
					morning: "ئەتىگەندە",
					afternoon: "چۈشتىن كىيىن",
					evening: "ئاخشامدا",
					night: "كىچىدە"
				},
				abbreviated: {
					am: "ئە",
					pm: "چ",
					midnight: "ك",
					noon: "چ",
					morning: "ئەتىگەندە",
					afternoon: "چۈشتىن كىيىن",
					evening: "ئاخشامدا",
					night: "كىچىدە"
				},
				wide: {
					am: "ئە",
					pm: "چ",
					midnight: "ك",
					noon: "چ",
					morning: "ئەتىگەندە",
					afternoon: "چۈشتىن كىيىن",
					evening: "ئاخشامدا",
					night: "كىچىدە"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(ب|ك)/i,
				wide: /^(مىيلادىدىن بۇرۇن|مىيلادىدىن كىيىن)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^بۇرۇن/i, /^كىيىن/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^چ[1234]/i,
				wide: /^چارەك [1234]/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^[يفمئامئ‍ئاسۆند]/i,
				abbreviated: /^(يانۋار|فېۋىرال|مارت|ئاپرىل|ماي|ئىيۇن|ئىيول|ئاۋغۇست|سىنتەبىر|ئۆكتەبىر|نويابىر|دىكابىر)/i,
				wide: /^(يانۋار|فېۋىرال|مارت|ئاپرىل|ماي|ئىيۇن|ئىيول|ئاۋغۇست|سىنتەبىر|ئۆكتەبىر|نويابىر|دىكابىر)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^ي/i, /^ف/i, /^م/i, /^ا/i, /^م/i, /^ى‍/i, /^ى‍/i, /^ا‍/i, /^س/i, /^ۆ/i, /^ن/i, /^د/i],
				any: [/^يان/i, /^فېۋ/i, /^مار/i, /^ئاپ/i, /^ماي/i, /^ئىيۇن/i, /^ئىيول/i, /^ئاۋ/i, /^سىن/i, /^ئۆك/i, /^نوي/i, /^دىك/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[دسچپجشي]/i,
				short: /^(يە|دۈ|سە|چا|پە|جۈ|شە)/i,
				abbreviated: /^(يە|دۈ|سە|چا|پە|جۈ|شە)/i,
				wide: /^(يەكشەنبە|دۈشەنبە|سەيشەنبە|چارشەنبە|پەيشەنبە|جۈمە|شەنبە)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^ي/i, /^د/i, /^س/i, /^چ/i, /^پ/i, /^ج/i, /^ش/i],
				any: [/^ي/i, /^د/i, /^س/i, /^چ/i, /^پ/i, /^ج/i, /^ش/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^(ئە|چ|ك|چ|(دە|ئەتىگەن) ( ئە‍|چۈشتىن كىيىن|ئاخشىم|كىچە))/i,
				any: /^(ئە|چ|ك|چ|(دە|ئەتىگەن) ( ئە‍|چۈشتىن كىيىن|ئاخشىم|كىچە))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^ئە/i,
					pm: /^چ/i,
					midnight: /^ك/i,
					noon: /^چ/i,
					morning: /ئەتىگەن/i,
					afternoon: /چۈشتىن كىيىن/i,
					evening: /ئاخشىم/i,
					night: /كىچە/i
				}
			},
			defaultParseWidth: "any"
		});

		function Pi(e, t) {
			if (void 0 !== e.one && 1 === t)
				return e.one;
			const n = t % 10,
			a = t % 100;
			return 1 === n && 11 !== a ? e.singularNominative.replace("{{count}}", String(t)) : n >= 2 && n <= 4 && (a < 10 || a > 20) ? e.singularGenitive.replace("{{count}}", String(t)) : e.pluralGenitive.replace("{{count}}", String(t))
		}

		function Wi(e) {
			return (t, n) => n && n.addSuffix ? n.comparison && n.comparison > 0 ? e.future ? Pi(e.future, t) : "за " + Pi(e.regular, t) : e.past ? Pi(e.past, t) : Pi(e.regular, t) + " тому" : Pi(e.regular, t)
		}
		const ji = {
			lessThanXSeconds: Wi({
				regular: {
					one: "менше секунди",
					singularNominative: "менше {{count}} секунди",
					singularGenitive: "менше {{count}} секунд",
					pluralGenitive: "менше {{count}} секунд"
				},
				future: {
					one: "менше, ніж за секунду",
					singularNominative: "менше, ніж за {{count}} секунду",
					singularGenitive: "менше, ніж за {{count}} секунди",
					pluralGenitive: "менше, ніж за {{count}} секунд"
				}
			}),
			xSeconds: Wi({
				regular: {
					singularNominative: "{{count}} секунда",
					singularGenitive: "{{count}} секунди",
					pluralGenitive: "{{count}} секунд"
				},
				past: {
					singularNominative: "{{count}} секунду тому",
					singularGenitive: "{{count}} секунди тому",
					pluralGenitive: "{{count}} секунд тому"
				},
				future: {
					singularNominative: "за {{count}} секунду",
					singularGenitive: "за {{count}} секунди",
					pluralGenitive: "за {{count}} секунд"
				}
			}),
			halfAMinute: (e, t) => t && t.addSuffix ? t.comparison && t.comparison > 0 ? "за півхвилини" : "півхвилини тому" : "півхвилини",
			lessThanXMinutes: Wi({
				regular: {
					one: "менше хвилини",
					singularNominative: "менше {{count}} хвилини",
					singularGenitive: "менше {{count}} хвилин",
					pluralGenitive: "менше {{count}} хвилин"
				},
				future: {
					one: "менше, ніж за хвилину",
					singularNominative: "менше, ніж за {{count}} хвилину",
					singularGenitive: "менше, ніж за {{count}} хвилини",
					pluralGenitive: "менше, ніж за {{count}} хвилин"
				}
			}),
			xMinutes: Wi({
				regular: {
					singularNominative: "{{count}} хвилина",
					singularGenitive: "{{count}} хвилини",
					pluralGenitive: "{{count}} хвилин"
				},
				past: {
					singularNominative: "{{count}} хвилину тому",
					singularGenitive: "{{count}} хвилини тому",
					pluralGenitive: "{{count}} хвилин тому"
				},
				future: {
					singularNominative: "за {{count}} хвилину",
					singularGenitive: "за {{count}} хвилини",
					pluralGenitive: "за {{count}} хвилин"
				}
			}),
			aboutXHours: Wi({
				regular: {
					singularNominative: "близько {{count}} години",
					singularGenitive: "близько {{count}} годин",
					pluralGenitive: "близько {{count}} годин"
				},
				future: {
					singularNominative: "приблизно за {{count}} годину",
					singularGenitive: "приблизно за {{count}} години",
					pluralGenitive: "приблизно за {{count}} годин"
				}
			}),
			xHours: Wi({
				regular: {
					singularNominative: "{{count}} годину",
					singularGenitive: "{{count}} години",
					pluralGenitive: "{{count}} годин"
				}
			}),
			xDays: Wi({
				regular: {
					singularNominative: "{{count}} день",
					singularGenitive: "{{count}} днi",
					pluralGenitive: "{{count}} днів"
				}
			}),
			aboutXWeeks: Wi({
				regular: {
					singularNominative: "близько {{count}} тижня",
					singularGenitive: "близько {{count}} тижнів",
					pluralGenitive: "близько {{count}} тижнів"
				},
				future: {
					singularNominative: "приблизно за {{count}} тиждень",
					singularGenitive: "приблизно за {{count}} тижні",
					pluralGenitive: "приблизно за {{count}} тижнів"
				}
			}),
			xWeeks: Wi({
				regular: {
					singularNominative: "{{count}} тиждень",
					singularGenitive: "{{count}} тижні",
					pluralGenitive: "{{count}} тижнів"
				}
			}),
			aboutXMonths: Wi({
				regular: {
					singularNominative: "близько {{count}} місяця",
					singularGenitive: "близько {{count}} місяців",
					pluralGenitive: "близько {{count}} місяців"
				},
				future: {
					singularNominative: "приблизно за {{count}} місяць",
					singularGenitive: "приблизно за {{count}} місяці",
					pluralGenitive: "приблизно за {{count}} місяців"
				}
			}),
			xMonths: Wi({
				regular: {
					singularNominative: "{{count}} місяць",
					singularGenitive: "{{count}} місяці",
					pluralGenitive: "{{count}} місяців"
				}
			}),
			aboutXYears: Wi({
				regular: {
					singularNominative: "близько {{count}} року",
					singularGenitive: "близько {{count}} років",
					pluralGenitive: "близько {{count}} років"
				},
				future: {
					singularNominative: "приблизно за {{count}} рік",
					singularGenitive: "приблизно за {{count}} роки",
					pluralGenitive: "приблизно за {{count}} років"
				}
			}),
			xYears: Wi({
				regular: {
					singularNominative: "{{count}} рік",
					singularGenitive: "{{count}} роки",
					pluralGenitive: "{{count}} років"
				}
			}),
			overXYears: Wi({
				regular: {
					singularNominative: "більше {{count}} року",
					singularGenitive: "більше {{count}} років",
					pluralGenitive: "більше {{count}} років"
				},
				future: {
					singularNominative: "більше, ніж за {{count}} рік",
					singularGenitive: "більше, ніж за {{count}} роки",
					pluralGenitive: "більше, ніж за {{count}} років"
				}
			}),
			almostXYears: Wi({
				regular: {
					singularNominative: "майже {{count}} рік",
					singularGenitive: "майже {{count}} роки",
					pluralGenitive: "майже {{count}} років"
				},
				future: {
					singularNominative: "майже за {{count}} рік",
					singularGenitive: "майже за {{count}} роки",
					pluralGenitive: "майже за {{count}} років"
				}
			})
		},
		xi = {
			date: X({
				formats: {
					full: "EEEE, do MMMM y 'р.'",
					long: "do MMMM y 'р.'",
					medium: "d MMM y 'р.'",
					short: "dd.MM.y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "H:mm:ss zzzz",
					long: "H:mm:ss z",
					medium: "H:mm:ss",
					short: "H:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} 'о' {{time}}",
					long: "{{date}} 'о' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		zi = ["неділю", "понеділок", "вівторок", "середу", "четвер", "п’ятницю", "суботу"];

		function Ti(e) {
			return "'у " + zi[e] + " о' p"
		}
		const Ei = {
			lastWeek: (e, t, n) => {
				const a = de(e),
				i = a.getDay();
				return me(a, t, n) ? Ti(i) : function (e) {
					const t = zi[e];
					switch (e) {
					case 0:
					case 3:
					case 5:
					case 6:
						return "'у минулу " + t + " о' p";
					case 1:
					case 2:
					case 4:
						return "'у минулий " + t + " о' p"
					}
				}
				(i)
			},
			yesterday: "'вчора о' p",
			today: "'сьогодні о' p",
			tomorrow: "'завтра о' p",
			nextWeek: (e, t, n) => {
				const a = de(e),
				i = a.getDay();
				return me(a, t, n) ? Ti(i) : function (e) {
					const t = zi[e];
					switch (e) {
					case 0:
					case 3:
					case 5:
					case 6:
						return "'у наступну " + t + " о' p";
					case 1:
					case 2:
					case 4:
						return "'у наступний " + t + " о' p"
					}
				}
				(i)
			},
			other: "P"
		},
		Si = (_({
				values: {
					narrow: ["до н.е.", "н.е."],
					abbreviated: ["до н. е.", "н. е."],
					wide: ["до нашої ери", "нашої ери"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["1-й кв.", "2-й кв.", "3-й кв.", "4-й кв."],
					wide: ["1-й квартал", "2-й квартал", "3-й квартал", "4-й квартал"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["С", "Л", "Б", "К", "Т", "Ч", "Л", "С", "В", "Ж", "Л", "Г"],
					abbreviated: ["січ.", "лют.", "берез.", "квіт.", "трав.", "черв.", "лип.", "серп.", "верес.", "жовт.", "листоп.", "груд."],
					wide: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["С", "Л", "Б", "К", "Т", "Ч", "Л", "С", "В", "Ж", "Л", "Г"],
					abbreviated: ["січ.", "лют.", "берез.", "квіт.", "трав.", "черв.", "лип.", "серп.", "верес.", "жовт.", "листоп.", "груд."],
					wide: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["Н", "П", "В", "С", "Ч", "П", "С"],
					short: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
					abbreviated: ["нед", "пон", "вів", "сер", "чтв", "птн", "суб"],
					wide: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п’ятниця", "субота"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "ДП",
						pm: "ПП",
						midnight: "півн.",
						noon: "пол.",
						morning: "ранок",
						afternoon: "день",
						evening: "веч.",
						night: "ніч"
					},
					abbreviated: {
						am: "ДП",
						pm: "ПП",
						midnight: "півн.",
						noon: "пол.",
						morning: "ранок",
						afternoon: "день",
						evening: "веч.",
						night: "ніч"
					},
					wide: {
						am: "ДП",
						pm: "ПП",
						midnight: "північ",
						noon: "полудень",
						morning: "ранок",
						afternoon: "день",
						evening: "вечір",
						night: "ніч"
					}
				},
				defaultWidth: "any",
				formattingValues: {
					narrow: {
						am: "ДП",
						pm: "ПП",
						midnight: "півн.",
						noon: "пол.",
						morning: "ранку",
						afternoon: "дня",
						evening: "веч.",
						night: "ночі"
					},
					abbreviated: {
						am: "ДП",
						pm: "ПП",
						midnight: "півн.",
						noon: "пол.",
						morning: "ранку",
						afternoon: "дня",
						evening: "веч.",
						night: "ночі"
					},
					wide: {
						am: "ДП",
						pm: "ПП",
						midnight: "північ",
						noon: "полудень",
						morning: "ранку",
						afternoon: "дня",
						evening: "веч.",
						night: "ночі"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(-?(е|й|є|а|я))?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^((до )?н\.?\s?е\.?)/i,
					abbreviated: /^((до )?н\.?\s?е\.?)/i,
					wide: /^(до нашої ери|нашої ери|наша ера)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^д/i, /^н/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^[1234](-?[иі]?й?)? кв.?/i,
					wide: /^[1234](-?[иі]?й?)? квартал/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[слбктчвжг]/i,
					abbreviated: /^(січ|лют|бер(ез)?|квіт|трав|черв|лип|серп|вер(ес)?|жовт|лис(топ)?|груд)\.?/i,
					wide: /^(січень|січня|лютий|лютого|березень|березня|квітень|квітня|травень|травня|червня|червень|липень|липня|серпень|серпня|вересень|вересня|жовтень|жовтня|листопад[а]?|грудень|грудня)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^с/i, /^л/i, /^б/i, /^к/i, /^т/i, /^ч/i, /^л/i, /^с/i, /^в/i, /^ж/i, /^л/i, /^г/i],
					any: [/^сі/i, /^лю/i, /^б/i, /^к/i, /^т/i, /^ч/i, /^лип/i, /^се/i, /^в/i, /^ж/i, /^лис/i, /^г/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[нпвсч]/i,
					short: /^(нд|пн|вт|ср|чт|пт|сб)\.?/i,
					abbreviated: /^(нед|пон|вів|сер|че?тв|птн?|суб)\.?/i,
					wide: /^(неділ[яі]|понеділ[ок][ка]|вівтор[ок][ка]|серед[аи]|четвер(га)?|п\W*?ятниц[яі]|субот[аи])/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^н/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
					any: [/^н/i, /^п[он]/i, /^в/i, /^с[ер]/i, /^ч/i, /^п\W*?[ят]/i, /^с[уб]/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^([дп]п|півн\.?|пол\.?|ранок|ранку|день|дня|веч\.?|ніч|ночі)/i,
					abbreviated: /^([дп]п|півн\.?|пол\.?|ранок|ранку|день|дня|веч\.?|ніч|ночі)/i,
					wide: /^([дп]п|північ|полудень|ранок|ранку|день|дня|вечір|вечора|ніч|ночі)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: {
						am: /^дп/i,
						pm: /^пп/i,
						midnight: /^півн/i,
						noon: /^пол/i,
						morning: /^р/i,
						afternoon: /^д[ен]/i,
						evening: /^в/i,
						night: /^н/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "sekunddan kam",
				other: "{{count}} sekunddan kam"
			},
			xSeconds: {
				one: "1 sekund",
				other: "{{count}} sekund"
			},
			halfAMinute: "yarim minut",
			lessThanXMinutes: {
				one: "bir minutdan kam",
				other: "{{count}} minutdan kam"
			},
			xMinutes: {
				one: "1 minut",
				other: "{{count}} minut"
			},
			aboutXHours: {
				one: "tahminan 1 soat",
				other: "tahminan {{count}} soat"
			},
			xHours: {
				one: "1 soat",
				other: "{{count}} soat"
			},
			xDays: {
				one: "1 kun",
				other: "{{count}} kun"
			},
			aboutXWeeks: {
				one: "tahminan 1 hafta",
				other: "tahminan {{count}} hafta"
			},
			xWeeks: {
				one: "1 hafta",
				other: "{{count}} hafta"
			},
			aboutXMonths: {
				one: "tahminan 1 oy",
				other: "tahminan {{count}} oy"
			},
			xMonths: {
				one: "1 oy",
				other: "{{count}} oy"
			},
			aboutXYears: {
				one: "tahminan 1 yil",
				other: "tahminan {{count}} yil"
			},
			xYears: {
				one: "1 yil",
				other: "{{count}} yil"
			},
			overXYears: {
				one: "1 yildan ko'p",
				other: "{{count}} yildan ko'p"
			},
			almostXYears: {
				one: "deyarli 1 yil",
				other: "deyarli {{count}} yil"
			}
		}),
		Ci = {
			date: X({
				formats: {
					full: "EEEE, do MMMM, y",
					long: "do MMMM, y",
					medium: "d MMM, y",
					short: "dd/MM/yyyy"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "h:mm:ss zzzz",
					long: "h:mm:ss z",
					medium: "h:mm:ss",
					short: "h:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					any: "{{date}}, {{time}}"
				},
				defaultWidth: "any"
			})
		},
		Ai = {
			lastWeek: "'oldingi' eeee p 'da'",
			yesterday: "'kecha' p 'da'",
			today: "'bugun' p 'da'",
			tomorrow: "'ertaga' p 'da'",
			nextWeek: "eeee p 'da'",
			other: "P"
		},
		Hi = (_({
				values: {
					narrow: ["M.A", "M."],
					abbreviated: ["M.A", "M."],
					wide: ["Miloddan Avvalgi", "Milodiy"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["CH.1", "CH.2", "CH.3", "CH.4"],
					wide: ["1-chi chorak", "2-chi chorak", "3-chi chorak", "4-chi chorak"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["Y", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"],
					abbreviated: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
					wide: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["Y", "D", "S", "CH", "P", "J", "SH"],
					short: ["Ya", "Du", "Se", "Cho", "Pa", "Ju", "Sha"],
					abbreviated: ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"],
					wide: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "y.t",
						noon: "p.",
						morning: "ertalab",
						afternoon: "tushdan keyin",
						evening: "kechqurun",
						night: "tun"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "yarim tun",
						noon: "peshin",
						morning: "ertalab",
						afternoon: "tushdan keyin",
						evening: "kechqurun",
						night: "tun"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "yarim tun",
						noon: "peshin",
						morning: "ertalab",
						afternoon: "tushdan keyin",
						evening: "kechqurun",
						night: "tun"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "a",
						pm: "p",
						midnight: "y.t",
						noon: "p.",
						morning: "ertalab",
						afternoon: "tushdan keyin",
						evening: "kechqurun",
						night: "tun"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "yarim tun",
						noon: "peshin",
						morning: "ertalab",
						afternoon: "tushdan keyin",
						evening: "kechqurun",
						night: "tun"
					},
					wide: {
						am: "a.m.",
						pm: "p.m.",
						midnight: "yarim tun",
						noon: "peshin",
						morning: "ertalab",
						afternoon: "tushdan keyin",
						evening: "kechqurun",
						night: "tun"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)(chi)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(m\.a|m\.)/i,
					abbreviated: /^(m\.a\.?\s?m\.?)/i,
					wide: /^(miloddan avval|miloddan keyin)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^b/i, /^(a|c)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^q[1234]/i,
					wide: /^[1234](chi)? chorak/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/1/i, /2/i, /3/i, /4/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^[yfmasond]/i,
					abbreviated: /^(yan|fev|mar|apr|may|iyun|iyul|avg|sen|okt|noy|dek)/i,
					wide: /^(yanvar|fevral|mart|aprel|may|iyun|iyul|avgust|sentabr|oktabr|noyabr|dekabr)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^y/i, /^f/i, /^m/i, /^a/i, /^m/i, /^i/i, /^i/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
					any: [/^ya/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^iyun/i, /^iyul/i, /^av/i, /^s/i, /^o/i, /^n/i, /^d/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[ydschj]/i,
					short: /^(ya|du|se|cho|pa|ju|sha)/i,
					abbreviated: /^(yak|dush|sesh|chor|pay|jum|shan)/i,
					wide: /^(yakshanba|dushanba|seshanba|chorshanba|payshanba|juma|shanba)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^y/i, /^d/i, /^s/i, /^ch/i, /^p/i, /^j/i, /^sh/i],
					any: [/^ya/i, /^d/i, /^se/i, /^ch/i, /^p/i, /^j/i, /^sh/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|y\.t|p| (ertalab|tushdan keyin|kechqurun|tun))/i,
					any: /^([ap]\.?\s?m\.?|yarim tun|peshin| (ertalab|tushdan keyin|kechqurun|tun))/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^a/i,
						pm: /^p/i,
						midnight: /^y\.t/i,
						noon: /^pe/i,
						morning: /ertalab/i,
						afternoon: /tushdan keyin/i,
						evening: /kechqurun/i,
						night: /tun/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "dưới 1 giây",
				other: "dưới {{count}} giây"
			},
			xSeconds: {
				one: "1 giây",
				other: "{{count}} giây"
			},
			halfAMinute: "nửa phút",
			lessThanXMinutes: {
				one: "dưới 1 phút",
				other: "dưới {{count}} phút"
			},
			xMinutes: {
				one: "1 phút",
				other: "{{count}} phút"
			},
			aboutXHours: {
				one: "khoảng 1 giờ",
				other: "khoảng {{count}} giờ"
			},
			xHours: {
				one: "1 giờ",
				other: "{{count}} giờ"
			},
			xDays: {
				one: "1 ngày",
				other: "{{count}} ngày"
			},
			aboutXWeeks: {
				one: "khoảng 1 tuần",
				other: "khoảng {{count}} tuần"
			},
			xWeeks: {
				one: "1 tuần",
				other: "{{count}} tuần"
			},
			aboutXMonths: {
				one: "khoảng 1 tháng",
				other: "khoảng {{count}} tháng"
			},
			xMonths: {
				one: "1 tháng",
				other: "{{count}} tháng"
			},
			aboutXYears: {
				one: "khoảng 1 năm",
				other: "khoảng {{count}} năm"
			},
			xYears: {
				one: "1 năm",
				other: "{{count}} năm"
			},
			overXYears: {
				one: "hơn 1 năm",
				other: "hơn {{count}} năm"
			},
			almostXYears: {
				one: "gần 1 năm",
				other: "gần {{count}} năm"
			}
		}),
		Ni = {
			date: X({
				formats: {
					full: "EEEE, 'ngày' d MMMM 'năm' y",
					long: "'ngày' d MMMM 'năm' y",
					medium: "d MMM 'năm' y",
					short: "dd/MM/y"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "HH:mm:ss zzzz",
					long: "HH:mm:ss z",
					medium: "HH:mm:ss",
					short: "HH:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Xi = {
			lastWeek: "eeee 'tuần trước vào lúc' p",
			yesterday: "'hôm qua vào lúc' p",
			today: "'hôm nay vào lúc' p",
			tomorrow: "'ngày mai vào lúc' p",
			nextWeek: "eeee 'tới vào lúc' p",
			other: "P"
		},
		Ii = (_({
				values: {
					narrow: ["TCN", "SCN"],
					abbreviated: ["trước CN", "sau CN"],
					wide: ["trước Công Nguyên", "sau Công Nguyên"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["Q1", "Q2", "Q3", "Q4"],
					wide: ["quý I", "quý II", "quý III", "quý IV"]
				},
				defaultFormattingWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
					abbreviated: ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"],
					wide: ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"]
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
					abbreviated: ["thg 1", "thg 2", "thg 3", "thg 4", "thg 5", "thg 6", "thg 7", "thg 8", "thg 9", "thg 10", "thg 11", "thg 12"],
					wide: ["tháng 01", "tháng 02", "tháng 03", "tháng 04", "tháng 05", "tháng 06", "tháng 07", "tháng 08", "tháng 09", "tháng 10", "tháng 11", "tháng 12"]
				},
				defaultFormattingWidth: "wide"
			}), _({
				values: {
					narrow: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
					short: ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"],
					abbreviated: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
					wide: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "am",
						pm: "pm",
						midnight: "nửa đêm",
						noon: "tr",
						morning: "sg",
						afternoon: "ch",
						evening: "tối",
						night: "đêm"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "nửa đêm",
						noon: "trưa",
						morning: "sáng",
						afternoon: "chiều",
						evening: "tối",
						night: "đêm"
					},
					wide: {
						am: "SA",
						pm: "CH",
						midnight: "nửa đêm",
						noon: "trưa",
						morning: "sáng",
						afternoon: "chiều",
						evening: "tối",
						night: "đêm"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "am",
						pm: "pm",
						midnight: "nửa đêm",
						noon: "tr",
						morning: "sg",
						afternoon: "ch",
						evening: "tối",
						night: "đêm"
					},
					abbreviated: {
						am: "AM",
						pm: "PM",
						midnight: "nửa đêm",
						noon: "trưa",
						morning: "sáng",
						afternoon: "chiều",
						evening: "tối",
						night: "đêm"
					},
					wide: {
						am: "SA",
						pm: "CH",
						midnight: "nửa đêm",
						noon: "giữa trưa",
						morning: "vào buổi sáng",
						afternoon: "vào buổi chiều",
						evening: "vào buổi tối",
						night: "vào ban đêm"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(\d+)/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(tcn|scn)/i,
					abbreviated: /^(trước CN|sau CN)/i,
					wide: /^(trước Công Nguyên|sau Công Nguyên)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^t/i, /^s/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^([1234]|i{1,3}v?)/i,
					abbreviated: /^q([1234]|i{1,3}v?)/i,
					wide: /^quý ([1234]|i{1,3}v?)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/(1|i)$/i, /(2|ii)$/i, /(3|iii)$/i, /(4|iv)$/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(0?[2-9]|10|11|12|0?1)/i,
					abbreviated: /^thg[ _]?(0?[1-9](?!\d)|10|11|12)/i,
					wide: /^tháng ?(Một|Hai|Ba|Tư|Năm|Sáu|Bảy|Tám|Chín|Mười|Mười ?Một|Mười ?Hai|0?[1-9](?!\d)|10|11|12)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/0?1$/i, /0?2/i, /3/, /4/, /5/, /6/, /7/, /8/, /9/, /10/, /11/, /12/],
					abbreviated: [/^thg[ _]?0?1(?!\d)/i, /^thg[ _]?0?2/i, /^thg[ _]?0?3/i, /^thg[ _]?0?4/i, /^thg[ _]?0?5/i, /^thg[ _]?0?6/i, /^thg[ _]?0?7/i, /^thg[ _]?0?8/i, /^thg[ _]?0?9/i, /^thg[ _]?10/i, /^thg[ _]?11/i, /^thg[ _]?12/i],
					wide: [/^tháng ?(Một|0?1(?!\d))/i, /^tháng ?(Hai|0?2)/i, /^tháng ?(Ba|0?3)/i, /^tháng ?(Tư|0?4)/i, /^tháng ?(Năm|0?5)/i, /^tháng ?(Sáu|0?6)/i, /^tháng ?(Bảy|0?7)/i, /^tháng ?(Tám|0?8)/i, /^tháng ?(Chín|0?9)/i, /^tháng ?(Mười|10)/i, /^tháng ?(Mười ?Một|11)/i, /^tháng ?(Mười ?Hai|12)/i]
				},
				defaultParseWidth: "wide"
			}), G({
				matchPatterns: {
					narrow: /^(CN|T2|T3|T4|T5|T6|T7)/i,
					short: /^(CN|Th ?2|Th ?3|Th ?4|Th ?5|Th ?6|Th ?7)/i,
					abbreviated: /^(CN|Th ?2|Th ?3|Th ?4|Th ?5|Th ?6|Th ?7)/i,
					wide: /^(Chủ ?Nhật|Chúa ?Nhật|thứ ?Hai|thứ ?Ba|thứ ?Tư|thứ ?Năm|thứ ?Sáu|thứ ?Bảy)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/CN/i, /2/i, /3/i, /4/i, /5/i, /6/i, /7/i],
					short: [/CN/i, /2/i, /3/i, /4/i, /5/i, /6/i, /7/i],
					abbreviated: [/CN/i, /2/i, /3/i, /4/i, /5/i, /6/i, /7/i],
					wide: [/(Chủ|Chúa) ?Nhật/i, /Hai/i, /Ba/i, /Tư/i, /Năm/i, /Sáu/i, /Bảy/i]
				},
				defaultParseWidth: "wide"
			}), G({
				matchPatterns: {
					narrow: /^(a|p|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i,
					abbreviated: /^(am|pm|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i,
					wide: /^(ch[^i]*|sa|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: {
						am: /^(a|sa)/i,
						pm: /^(p|ch[^i]*)/i,
						midnight: /nửa đêm/i,
						noon: /trưa/i,
						morning: /sáng/i,
						afternoon: /chiều/i,
						evening: /tối/i,
						night: /^đêm/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "不到 1 秒",
				other: "不到 {{count}} 秒"
			},
			xSeconds: {
				one: "1 秒",
				other: "{{count}} 秒"
			},
			halfAMinute: "半分钟",
			lessThanXMinutes: {
				one: "不到 1 分钟",
				other: "不到 {{count}} 分钟"
			},
			xMinutes: {
				one: "1 分钟",
				other: "{{count}} 分钟"
			},
			xHours: {
				one: "1 小时",
				other: "{{count}} 小时"
			},
			aboutXHours: {
				one: "大约 1 小时",
				other: "大约 {{count}} 小时"
			},
			xDays: {
				one: "1 天",
				other: "{{count}} 天"
			},
			aboutXWeeks: {
				one: "大约 1 个星期",
				other: "大约 {{count}} 个星期"
			},
			xWeeks: {
				one: "1 个星期",
				other: "{{count}} 个星期"
			},
			aboutXMonths: {
				one: "大约 1 个月",
				other: "大约 {{count}} 个月"
			},
			xMonths: {
				one: "1 个月",
				other: "{{count}} 个月"
			},
			aboutXYears: {
				one: "大约 1 年",
				other: "大约 {{count}} 年"
			},
			xYears: {
				one: "1 年",
				other: "{{count}} 年"
			},
			overXYears: {
				one: "超过 1 年",
				other: "超过 {{count}} 年"
			},
			almostXYears: {
				one: "将近 1 年",
				other: "将近 {{count}} 年"
			}
		}),
		Di = {
			date: X({
				formats: {
					full: "y'年'M'月'd'日' EEEE",
					long: "y'年'M'月'd'日'",
					medium: "yyyy-MM-dd",
					short: "yy-MM-dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "zzzz a h:mm:ss",
					long: "z a h:mm:ss",
					medium: "a h:mm:ss",
					short: "a h:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		};

		function _i(e, t, n) {
			const a = "eeee p";
			return me(e, t, n) ? a : e.getTime() > t.getTime() ? "'下个'" + a : "'上个'" + a
		}
		const Gi = {
			lastWeek: _i,
			yesterday: "'昨天' p",
			today: "'今天' p",
			tomorrow: "'明天' p",
			nextWeek: _i,
			other: "PP p"
		},
		Fi = (_({
				values: {
					narrow: ["前", "公元"],
					abbreviated: ["前", "公元"],
					wide: ["公元前", "公元"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["1", "2", "3", "4"],
					abbreviated: ["第一季", "第二季", "第三季", "第四季"],
					wide: ["第一季度", "第二季度", "第三季度", "第四季度"]
				},
				defaultWidth: "wide",
				argumentCallback: e => e - 1
			}), _({
				values: {
					narrow: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
					abbreviated: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
					wide: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: ["日", "一", "二", "三", "四", "五", "六"],
					short: ["日", "一", "二", "三", "四", "五", "六"],
					abbreviated: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
					wide: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
				},
				defaultWidth: "wide"
			}), _({
				values: {
					narrow: {
						am: "上",
						pm: "下",
						midnight: "凌晨",
						noon: "午",
						morning: "早",
						afternoon: "下午",
						evening: "晚",
						night: "夜"
					},
					abbreviated: {
						am: "上午",
						pm: "下午",
						midnight: "凌晨",
						noon: "中午",
						morning: "早晨",
						afternoon: "中午",
						evening: "晚上",
						night: "夜间"
					},
					wide: {
						am: "上午",
						pm: "下午",
						midnight: "凌晨",
						noon: "中午",
						morning: "早晨",
						afternoon: "中午",
						evening: "晚上",
						night: "夜间"
					}
				},
				defaultWidth: "wide",
				formattingValues: {
					narrow: {
						am: "上",
						pm: "下",
						midnight: "凌晨",
						noon: "午",
						morning: "早",
						afternoon: "下午",
						evening: "晚",
						night: "夜"
					},
					abbreviated: {
						am: "上午",
						pm: "下午",
						midnight: "凌晨",
						noon: "中午",
						morning: "早晨",
						afternoon: "中午",
						evening: "晚上",
						night: "夜间"
					},
					wide: {
						am: "上午",
						pm: "下午",
						midnight: "凌晨",
						noon: "中午",
						morning: "早晨",
						afternoon: "中午",
						evening: "晚上",
						night: "夜间"
					}
				},
				defaultFormattingWidth: "wide"
			}), F({
				matchPattern: /^(第\s*)?\d+(日|时|分|秒)?/i,
				parsePattern: /\d+/i,
				valueCallback: e => parseInt(e, 10)
			}), G({
				matchPatterns: {
					narrow: /^(前)/i,
					abbreviated: /^(前)/i,
					wide: /^(公元前|公元)/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/^(前)/i, /^(公元)/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[1234]/i,
					abbreviated: /^第[一二三四]刻/i,
					wide: /^第[一二三四]刻钟/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/(1|一)/i, /(2|二)/i, /(3|三)/i, /(4|四)/i]
				},
				defaultParseWidth: "any",
				valueCallback: e => e + 1
			}), G({
				matchPatterns: {
					narrow: /^(一|二|三|四|五|六|七|八|九|十[二一])/i,
					abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]|\d|1[12])月/i,
					wide: /^(一|二|三|四|五|六|七|八|九|十[二一])月/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					narrow: [/^一/i, /^二/i, /^三/i, /^四/i, /^五/i, /^六/i, /^七/i, /^八/i, /^九/i, /^十(?!(一|二))/i, /^十一/i, /^十二/i],
					any: [/^一|1/i, /^二|2/i, /^三|3/i, /^四|4/i, /^五|5/i, /^六|6/i, /^七|7/i, /^八|8/i, /^九|9/i, /^十(?!(一|二))|10/i, /^十一|11/i, /^十二|12/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					narrow: /^[一二三四五六日]/i,
					short: /^[一二三四五六日]/i,
					abbreviated: /^周[一二三四五六日]/i,
					wide: /^星期[一二三四五六日]/i
				},
				defaultMatchWidth: "wide",
				parsePatterns: {
					any: [/日/i, /一/i, /二/i, /三/i, /四/i, /五/i, /六/i]
				},
				defaultParseWidth: "any"
			}), G({
				matchPatterns: {
					any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨|)/i
				},
				defaultMatchWidth: "any",
				parsePatterns: {
					any: {
						am: /^上午?/i,
						pm: /^下午?/i,
						midnight: /^午夜/i,
						noon: /^[中正]午/i,
						morning: /^早上/i,
						afternoon: /^下午/i,
						evening: /^晚上?/i,
						night: /^凌晨/i
					}
				},
				defaultParseWidth: "any"
			}), {
			lessThanXSeconds: {
				one: "少於 1 秒",
				other: "少於 {{count}} 秒"
			},
			xSeconds: {
				one: "1 秒",
				other: "{{count}} 秒"
			},
			halfAMinute: "半分鐘",
			lessThanXMinutes: {
				one: "少於 1 分鐘",
				other: "少於 {{count}} 分鐘"
			},
			xMinutes: {
				one: "1 分鐘",
				other: "{{count}} 分鐘"
			},
			xHours: {
				one: "1 小時",
				other: "{{count}} 小時"
			},
			aboutXHours: {
				one: "大約 1 小時",
				other: "大約 {{count}} 小時"
			},
			xDays: {
				one: "1 天",
				other: "{{count}} 天"
			},
			aboutXWeeks: {
				one: "大約 1 個星期",
				other: "大約 {{count}} 個星期"
			},
			xWeeks: {
				one: "1 個星期",
				other: "{{count}} 個星期"
			},
			aboutXMonths: {
				one: "大約 1 個月",
				other: "大約 {{count}} 個月"
			},
			xMonths: {
				one: "1 個月",
				other: "{{count}} 個月"
			},
			aboutXYears: {
				one: "大約 1 年",
				other: "大約 {{count}} 年"
			},
			xYears: {
				one: "1 年",
				other: "{{count}} 年"
			},
			overXYears: {
				one: "超過 1 年",
				other: "超過 {{count}} 年"
			},
			almostXYears: {
				one: "將近 1 年",
				other: "將近 {{count}} 年"
			}
		}),
		Oi = {
			date: X({
				formats: {
					full: "y'年'M'月'd'日' EEEE",
					long: "y'年'M'月'd'日'",
					medium: "yyyy-MM-dd",
					short: "yy-MM-dd"
				},
				defaultWidth: "full"
			}),
			time: X({
				formats: {
					full: "zzzz a h:mm:ss",
					long: "z a h:mm:ss",
					medium: "a h:mm:ss",
					short: "a h:mm"
				},
				defaultWidth: "full"
			}),
			dateTime: X({
				formats: {
					full: "{{date}} {{time}}",
					long: "{{date}} {{time}}",
					medium: "{{date}} {{time}}",
					short: "{{date}} {{time}}"
				},
				defaultWidth: "full"
			})
		},
		Yi = {
			lastWeek: "'上個'eeee p",
			yesterday: "'昨天' p",
			today: "'今天' p",
			tomorrow: "'明天' p",
			nextWeek: "'下個'eeee p",
			other: "P"
		};
		_({
			values: {
				narrow: ["前", "公元"],
				abbreviated: ["前", "公元"],
				wide: ["公元前", "公元"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["第一刻", "第二刻", "第三刻", "第四刻"],
				wide: ["第一刻鐘", "第二刻鐘", "第三刻鐘", "第四刻鐘"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		_({
			values: {
				narrow: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
				abbreviated: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
				wide: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: ["日", "一", "二", "三", "四", "五", "六"],
				short: ["日", "一", "二", "三", "四", "五", "六"],
				abbreviated: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
				wide: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
			},
			defaultWidth: "wide"
		}),
		_({
			values: {
				narrow: {
					am: "上",
					pm: "下",
					midnight: "凌晨",
					noon: "午",
					morning: "早",
					afternoon: "下午",
					evening: "晚",
					night: "夜"
				},
				abbreviated: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜間"
				},
				wide: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜間"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "上",
					pm: "下",
					midnight: "凌晨",
					noon: "午",
					morning: "早",
					afternoon: "下午",
					evening: "晚",
					night: "夜"
				},
				abbreviated: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜間"
				},
				wide: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜間"
				}
			},
			defaultFormattingWidth: "wide"
		}),
		F({
			matchPattern: /^(第\s*)?\d+(日|時|分|秒)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}),
		G({
			matchPatterns: {
				narrow: /^(前)/i,
				abbreviated: /^(前)/i,
				wide: /^(公元前|公元)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^(前)/i, /^(公元)/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^第[一二三四]刻/i,
				wide: /^第[一二三四]刻鐘/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/(1|一)/i, /(2|二)/i, /(3|三)/i, /(4|四)/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		G({
			matchPatterns: {
				narrow: /^(一|二|三|四|五|六|七|八|九|十[二一])/i,
				abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]|\d|1[12])月/i,
				wide: /^(一|二|三|四|五|六|七|八|九|十[二一])月/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^一/i, /^二/i, /^三/i, /^四/i, /^五/i, /^六/i, /^七/i, /^八/i, /^九/i, /^十(?!(一|二))/i, /^十一/i, /^十二/i],
				any: [/^一|1/i, /^二|2/i, /^三|3/i, /^四|4/i, /^五|5/i, /^六|6/i, /^七|7/i, /^八|8/i, /^九|9/i, /^十(?!(一|二))|10/i, /^十一|11/i, /^十二|12/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				narrow: /^[一二三四五六日]/i,
				short: /^[一二三四五六日]/i,
				abbreviated: /^週[一二三四五六日]/i,
				wide: /^星期[一二三四五六日]/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/日/i, /一/i, /二/i, /三/i, /四/i, /五/i, /六/i]
			},
			defaultParseWidth: "any"
		}),
		G({
			matchPatterns: {
				any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨)/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^上午?/i,
					pm: /^下午?/i,
					midnight: /^午夜/i,
					noon: /^[中正]午/i,
					morning: /^早上/i,
					afternoon: /^下午/i,
					evening: /^晚上?/i,
					night: /^凌晨/i
				}
			},
			defaultParseWidth: "any"
		});
		var $i,
		Ki = {
			add: ($i = t(i().mark((function e(t) {
								var n,
								a,
								r;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.next = 2,
												Ki.getCollections();
											case 2:
												for (a in n = e.sent, t)
													r = a in n ? n[a].img : "", "" !== t[a].img && (r = t[a].img), n[a] = {
														img: r,
														ts: t[a].ts || 0,
														title: t[a].title
													};
												return e.abrupt("return", new Promise((function (e) {
															Ki.save("ysc_channel_metadata", n, (function (t) {
																	e(t)
																}))
														})));
											case 5:
											case "end":
												return e.stop()
											}
									}), e)
							}))), function (e) {
				return $i.apply(this, arguments)
			}),
			getCollections: function () {
				return new Promise((function (e) {
						chrome.storage.local.get("ysc_channel_metadata", (function (t) {
								var n = t && t.ysc_channel_metadata ? t.ysc_channel_metadata : {};
								e(n)
							}))
					}))
			},
			save: function (e, t, n) {
				var a = {};
				a[e] = t,
				chrome.storage.local.set(a, n)
			}
		};
		n(227),
		n(10);
		n(454).XMLParser;

		function Ji(e) {
			var t = document.cookie.match(new RegExp("(?:^|; )" + e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
			return t ? decodeURIComponent(t[1]) : void 0
		}

		function Vi(e) {
			return qi.apply(this, arguments)
		}

		function qi() {
			return (qi = t(i().mark((function e(t) {
								var n,
								a,
								r,
								o;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return n = (new TextEncoder).encode(t),
												e.next = 3,
												crypto.subtle.digest("SHA-1", n);
											case 3:
												return a = e.sent,
												r = Array.from(new Uint8Array(a)),
												o = r.map((function (e) {
															return e.toString(16).padStart(2, "0")
														})).join(""),
												e.abrupt("return", o);
											case 7:
											case "end":
												return e.stop()
											}
									}), e)
							})))).apply(this, arguments)
		}

		function Li() {
			var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
			return new Promise((function (t) {
					return setTimeout(t, e)
				}))
		}

		function Bi(e) {
			return Qi.apply(this, arguments)
		}

		function Qi() {
			return Qi = t(i().mark((function e(n) {
							var a,
							r,
							o;
							return i().wrap((function (e) {
									for (; ; )
										switch (e.prev = e.next) {
										case 0:
											if (!("" !== (a = JSON.parse(n)).last_charge_date && a.currently_entitled_amount_cents >= 300)) {
												e.next = 5;
												break
											}
											if (!(Math.floor(new Date(a.last_charge_date).getTime() / 1e3) + 3456e3 > Math.floor(Date.now() / 1e3))) {
												e.next = 5;
												break
											}
											return e.abrupt("return", a);
										case 5:
											if (r = {}, "" !== a.note && void 0 !== a.note && (r = JSON.parse(a.note)), !("fullAccess" in r && !0 === r.fullAccess || "trial" in r && r.trial > Math.floor((new Date).getTime() / 1e3))) {
												e.next = 9;
												break
											}
											return e.abrupt("return", a);
										case 9:
											return e.next = 11,
											new Promise(function () {
												var e = t(i().mark((function e(t) {
																return i().wrap((function (e) {
																		for (; ; )
																			switch (e.prev = e.next) {
																			case 0:
																				chrome.runtime.sendMessage({
																					cmd: "get_patreon_user_data",
																					patreonData: a
																				}, (function (e) {
																						t(e.gdData.data)
																					}));
																			case 1:
																			case "end":
																				return e.stop()
																			}
																	}), e)
															})));
												return function (t) {
													return e.apply(this, arguments)
												}
											}
												());
										case 11:
											return o = e.sent,
											e.abrupt("return", Object.assign({}, a, o));
										case 13:
										case "end":
											return e.stop()
										}
								}), e)
						}))),
			Qi.apply(this, arguments)
		}

		function Ri(e) {
			return Ui.apply(this, arguments)
		}

		function Ui() {
			return Ui = t(i().mark((function e(n) {
							var a;
							return i().wrap((function (e) {
									for (; ; )
										switch (e.prev = e.next) {
										case 0:
											if (!("status" in n && "active" === n.status || "next_bill_date" in n && new Date(n.next_bill_date) >= new Date)) {
												e.next = 2;
												break
											}
											return e.abrupt("return", n);
										case 2:
											return e.next = 4,
											new Promise(function () {
												var e = t(i().mark((function e(t) {
																return i().wrap((function (e) {
																		for (; ; )
																			switch (e.prev = e.next) {
																			case 0:
																				chrome.runtime.sendMessage({
																					cmd: "get_paddle_user_data",
																					paddleData: n
																				}, (function (e) {
																						t(e.gdData.data)
																					}));
																			case 1:
																			case "end":
																				return e.stop()
																			}
																	}), e)
															})));
												return function (t) {
													return e.apply(this, arguments)
												}
											}
												());
										case 4:
											return a = e.sent,
											e.abrupt("return", Object.assign({}, n, a));
										case 6:
										case "end":
											return e.stop()
										}
								}), e)
						}))),
			Ui.apply(this, arguments)
		}

		function Zi(e) {
			var t = {};
			return "" !== e.note && void 0 !== e.note && (t = JSON.parse(e.note)),
			e.currently_entitled_amount_cents >= 300 || "fullAccess" in t && !0 === t.fullAccess || "trial" in t && t.trial > Math.floor((new Date).getTime() / 1e3)
		}

		function er(e) {
			return "status" in e && "active" === e.status || "next_bill_date" in e && new Date(e.next_bill_date) >= new Date
		}

		function tr() {
			return navigator.userAgent.indexOf("OPR/") >= 0
		}

		function nr() {
			return navigator.userAgent.indexOf("Edg/") >= 0 || navigator.userAgent.indexOf("Edge/") >= 0
		}

		function ar() {
			return navigator.userAgent.toLowerCase().indexOf("firefox") > -1
		}

		function ir() {
			return rr.apply(this, arguments)
		}

		function rr() {
			return rr = t(i().mark((function e() {
							var n;
							return i().wrap((function (e) {
									for (; ; )
										switch (e.prev = e.next) {
										case 0:
											return e.next = 2,
											new Promise(function () {
												var e = t(i().mark((function e(t) {
																return i().wrap((function (e) {
																		for (; ; )
																			switch (e.prev = e.next) {
																			case 0:
																				chrome.runtime.sendMessage(ar() ? "playlist@yousub.info" : "bplnofkhjdphoihfkfcddikgmecfehdd", {
																					cmd: "get_paid_data"
																				}, (function (e) {
																						t(e)
																					}));
																			case 1:
																			case "end":
																				return e.stop()
																			}
																	}), e)
															})));
												return function (t) {
													return e.apply(this, arguments)
												}
											}
												());
										case 2:
											if (void 0 !== (n = e.sent) || !nr()) {
												e.next = 7;
												break
											}
											return e.next = 6,
											new Promise((function (e) {
													chrome.runtime.sendMessage("ehbcnddflnbfekidfnieclbpknhkelkj", {
														cmd: "get_paid_data"
													}, (function (t) {
															e(t)
														}))
												}));
										case 6:
											n = e.sent;
										case 7:
											if (void 0 !== n || !tr()) {
												e.next = 11;
												break
											}
											return e.next = 10,
											new Promise((function (e) {
													chrome.runtime.sendMessage("noeichdeafhgfdbnhbldnheclppjknhm", {
														cmd: "get_paid_data"
													}, (function (t) {
															e(t)
														}))
												}));
										case 10:
											n = e.sent;
										case 11:
											return e.abrupt("return", n);
										case 12:
										case "end":
											return e.stop()
										}
								}), e)
						}))),
			rr.apply(this, arguments)
		}

		function or(e) {
			return sr.apply(this, arguments)
		}

		function sr() {
			return (sr = t(i().mark((function e(t) {
								var n,
								a,
								r,
								o,
								s,
								d;
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return n = Math.floor((new Date).getTime() / 1e3),
												a = void 0 === Ji("SAPISID") ? Ji("__Secure-3PAPISID") : Ji("SAPISID"),
												e.next = 4,
												Vi(n + " " + a + " https://www.youtube.com");
											case 4:
												return r = e.sent,
												e.next = 7,
												dr(n, r, t);
											case 7:
												return o = e.sent,
												e.next = 10,
												o.json();
											case 10:
												if (!("contents" in(s = e.sent))) {
													e.next = 16;
													break
												}
												return d = s.contents[0].addToPlaylistRenderer,
												e.next = 15,
												Li(200);
											case 15:
												document.querySelector("ytd-grid-video-renderer, ytd-rich-grid-media").dispatchEvent(new CustomEvent("yt-action", {
														bubbles: !0,
														composed: !0,
														detail: {
															actionName: "yt-open-popup-action",
															args: [{
																	openPopupAction: {
																		popupType: "DIALOG",
																		popup: {
																			addToPlaylistRenderer: d
																		}
																	}
																}, document.querySelector("ytd-grid-video-renderer, ytd-rich-grid-media")],
															disableBroadcast: !1,
															optionalAction: !1,
															returnValue: []
														}
													}));
											case 16:
											case "end":
												return e.stop()
											}
									}), e)
							})))).apply(this, arguments)
		}

		function dr(e, t, n) {
			return ur.apply(this, arguments)
		}

		function ur() {
			return (ur = t(i().mark((function e(t, n, a) {
								return i().wrap((function (e) {
										for (; ; )
											switch (e.prev = e.next) {
											case 0:
												return e.abrupt("return", fetch("https://www.youtube.com/youtubei/v1/playlist/get_add_to_playlist?key=".concat(ytcfg.INNERTUBE_API_KEY), {
														credentials: "include",
														headers: {
															accept: "*/*",
															"content-type": "application/json",
															"accept-language": ytcfg.accept_language,
															"cache-control": "no-cache",
															authorization: "SAPISIDHASH " + t + "_" + n,
															pragma: "no-cache",
															"sec-fetch-dest": "empty",
															"sec-fetch-mode": "cors",
															"sec-fetch-site": "same-origin",
															"x-goog-authuser": ytcfg.SESSION_INDEX,
															"x-goog-visitor-id": ytcfg.visitorData,
															"x-origin": "https://www.youtube.com"
														},
														referrer: "https://www.youtube.com/",
														referrerPolicy: "origin-when-cross-origin",
														body: '{"context":{"client":{"clientName":"'.concat(ytcfg.INNERTUBE_CONTEXT_CLIENT_NAME, '","hl":"').concat(ytcfg.INNERTUBE_CONTEXT_HL, '","gl":"').concat(ytcfg.INNERTUBE_CONTEXT_GL, '","clientVersion":"').concat(ytcfg.INNERTUBE_CONTEXT_CLIENT_VERSION, '"},').concat("" !== ytcfg.DELEGATED_SESSION_ID ? '"user":{"onBehalfOfUser":"' + ytcfg.DELEGATED_SESSION_ID + '"},' : "", '"request":{"internalExperimentFlags":[],"consistencyTokenJars":[]}},"excludeWatchLater":false,"videoIds":').concat(JSON.stringify([a]), "}"),
														method: "POST",
														mode: "cors"
													}));
											case 1:
											case "end":
												return e.stop()
											}
									}), e)
							})))).apply(this, arguments)
		}

		function mr(e) {
			for (var t = document.querySelectorAll("li.guide-item.guide-channel"), n = 0; n < t.length; n++)
				t[n].classList.remove("background-choise");
			for (var a = document.querySelectorAll("li.guide-item.guide-channel#" + e), i = 0; i < a.length; i++)
				a[i].classList.add("background-choise")
		}

		function lr() {
			if (this.data && this.data.commandMetadata && this.data.commandMetadata.webCommandMetadata && this.data.commandMetadata.webCommandMetadata.url && this.dataset.ysmPlaylistId)
				return this.data.browseEndpoint && (this.data.browseEndpoint.canonicalBaseUrl = "/playlist?list=" + this.dataset.ysmPlaylistId, this.data.browseEndpoint.browseId = "VL" + this.dataset.ysmPlaylistId), void(this.data.commandMetadata.webCommandMetadata.url = "/playlist?list=" + this.dataset.ysmPlaylistId)
		}

		function hr() {
			if (this.data && this.data.commandMetadata && this.data.commandMetadata.webCommandMetadata && this.data.commandMetadata.webCommandMetadata.url && this.dataset.ysmChannelId)
				return this.data.browseEndpoint && ("live" == this.dataset.ysmFetchContentType ? (this.data.browseEndpoint.canonicalBaseUrl = "/channel/" + this.dataset.ysmChannelId + "/streams", this.data.browseEndpoint.params = "EgdzdHJlYW1z") : (this.data.browseEndpoint.canonicalBaseUrl = "/channel/" + this.dataset.ysmChannelId + "/videos", this.data.browseEndpoint.params = "EgZ2aWRlb3M%3D"), this.data.browseEndpoint.browseId = this.dataset.ysmChannelId), void("live" == this.dataset.ysmFetchContentType ? this.data.commandMetadata.webCommandMetadata.url = "/channel/" + this.dataset.ysmChannelId + "/streams" : this.data.commandMetadata.webCommandMetadata.url = "/channel/" + this.dataset.ysmChannelId + "/videos")
		}
		document.addEventListener("readystatechange", (function (e) {
				var n;
				"complete" == e.target.readyState && (n = function (e) {
					e.forEach(function () {
						var e = t(i().mark((function e(t) {
										var n,
										a,
										r;
										return i().wrap((function (e) {
												for (; ; )
													switch (e.prev = e.next) {
													case 0:
														if (r = function () {
															if (this.data && this.data.commandMetadata && this.data.commandMetadata.webCommandMetadata && this.data.commandMetadata.webCommandMetadata.url && this.dataset.ysmChannelId)
																return this.data.browseEndpoint && (this.data.browseEndpoint.canonicalBaseUrl = "/channel/" + this.dataset.ysmChannelId + "/" + this.dataset.ysmFetchContentType, this.data.browseEndpoint.browseId = this.dataset.ysmChannelId, this.data.browseEndpoint.params = cr(this.dataset.ysmFetchContentType)) , this.data.commandMetadata.webCommandMetadata.url = "/channel/" + this.dataset.ysmChannelId + "/" + this.dataset.ysmFetchContentType, void mr(this.dataset.ysmChannelId);
																location.pathname = "channel/" + this.dataset.externalId + "/" + this.dataset.ysmFetchContentType
															}, ["ysm-channel-open"].includes(t.attributeName)) {
																e.next = 3;
																break
															}
														return e.abrupt("return");
													case 3:
														n = document.querySelector("html").getAttribute("ysm-channel-open"),
														(a = document.querySelector('a.yt-simple-endpoint[href]:not([target]):not([href^="/watch"]):not([href="null"]):not([href^="https://www.youtube.com/redirect"]):not([href^="https://www.googleadservices.com"]):not([href^="https://studio.youtube.com"]):not(.ytd-display-ad-renderer)')).dataset.ysmChannelId = n,
														document.querySelector("html").getAttribute("ysm-subscriptions-destination") ? a.dataset.ysmFetchContentType = document.querySelector("html").getAttribute("ysm-subscriptions-destination") : a.dataset.ysmFetchContentType = "videos",
														a && (a.addEventListener("click", r, !0), a.click(), a.removeEventListener("click", r, !0));
													case 8:
													case "end":
														return e.stop()
													}
											}), e)
									})));
						return function (t) {
							return e.apply(this, arguments)
						}
					}
						())
				}, new MutationObserver(n).observe(document.querySelector("html"), {
						attributes: !0
					}))
			}));

		function cr(e) {
			switch (e) {
			case "home":
				return "EghmZWF0dXJlZPIGBAoCMgA%3D";
			case "videos":
				return "EgZ2aWRlb3PyBgQKAjoA";
			case "shorts":
				return "EgZzaG9ydHPyBgUKA5oBAA%3D%3D";
			case "streams":
				return "EgdzdHJlYW1z8gYECgJ6AA%3D%3D";
			case "podcasts":
				return "Eghwb2RjYXN0c_IGBQoDugEA";
			case "playlists":
				return "EglwbGF5bGlzdHPyBgQKAkIA";
			case "community":
				return "Egljb21tdW5pdHnyBgQKAkoA";
			case "releases":
				return "EghyZWxlYXNlc_IGBQoDsgEA"
			}
			return ""
		}
		new MutationObserver((function (e) {
				e.forEach(function () {
					var e = t(i().mark((function e(t) {
									var n,
									a,
									r,
									o,
									s,
									d,
									u,
									m,
									l,
									h;
									return i().wrap((function (e) {
											for (; ; )
												switch (e.prev = e.next) {
												case 0:
													if (["ysm-fetch-options"].includes(t.attributeName)) {
														e.next = 2;
														break
													}
													return e.abrupt("return");
												case 2:
													if (7 !== parseInt(document.querySelector("html").getAttribute("ysm-fetch-options"))) {
														e.next = 9;
														break
													}
													return n = document.querySelector("html").getAttribute("ysm-fetch-playlist-id"),
													document.querySelector("html").removeAttribute("ysm-fetch-options"),
													(a = document.querySelector('a.yt-simple-endpoint[href]:not([target]):not([href^="/watch"]):not([href="null"]):not([href^="https://www.youtube.com/redirect"]):not([href^="https://www.googleadservices.com"]):not([href^="https://studio.youtube.com"]):not(.ytd-display-ad-renderer):not([href="/"])')).dataset.ysmPlaylistId = n,
													a && (document.querySelector("html").setAttribute("ysm-page-loading", 2), a.addEventListener("click", lr, !0), a.click(), a.removeEventListener("click", lr, !0)),
													e.abrupt("return");
												case 9:
													if (8 !== parseInt(document.querySelector("html").getAttribute("ysm-fetch-options"))) {
														e.next = 17;
														break
													}
													return r = document.querySelector("html").getAttribute("ysm-fetch-video-id"),
													document.querySelector('ytd-playlist-video-renderer [href^="/watch?v=' + r + '"]').closest("ytd-playlist-video-renderer").resolveCommand({
														signalServiceEndpoint: {
															signal: "CLIENT_SIGNAL",
															actions: [{
																	addToPlaylistCommand: {
																		openMiniplayer: !0,
																		listType: "PLAYLIST_EDIT_LIST_TYPE_QUEUE",
																		onCreateListCommand: {
																			createPlaylistServiceEndpoint: {
																				videoIds: [r],
																				params: "CAQ%3D"
																			}
																		},
																		videoIds: [r]
																	}
																}
															]
														}
													}),
													document.querySelector("html").removeAttribute("ysm-fetch-options"),
													document.querySelector("html").removeAttribute("ysm-fetch-video-id"),
													document.querySelector("html").removeAttribute("ysm-fetch-playlist-id"),
													e.abrupt("return");
												case 17:
													if (4 !== parseInt(document.querySelector("html").getAttribute("ysm-fetch-options"))) {
														e.next = 25;
														break
													}
													return o = document.querySelector("html").getAttribute("ysm-fetch-channel-id"),
													document.querySelector("html").removeAttribute("ysm-fetch-options"),
													(s = document.querySelector('a.yt-simple-endpoint[href]:not([target]):not([href^="/watch"]):not([href="null"]):not([href^="https://www.youtube.com/redirect"]):not([href^="https://www.googleadservices.com"]):not([href^="https://studio.youtube.com"]):not(.ytd-display-ad-renderer):not([href="/"])')).dataset.ysmChannelId = o,
													s.dataset.ysmFetchContentType = document.querySelector("html").getAttribute("ysm-fetch-content-type"),
													s && (document.querySelector("html").setAttribute("ysm-page-loading", 1), s.addEventListener("click", hr, !0), s.click(), s.removeEventListener("click", hr, !0)),
													e.abrupt("return");
												case 25:
													if (5 !== parseInt(document.querySelector("html").getAttribute("ysm-fetch-options"))) {
														e.next = 33;
														break
													}
													return d = document.querySelector("html").getAttribute("ysm-fetch-video-id"),
													document.querySelector('ytd-rich-grid-media [href^="/watch?v=' + d + '"], ytd-grid-video-renderer [href^="/watch?v=' + d + '"], ytd-grid-video-renderer [href^="/shorts/' + d + '"]').closest("ytd-thumbnail, ytd-grid-video-renderer, ytd-rich-grid-media").resolveCommand({
														signalServiceEndpoint: {
															signal: "CLIENT_SIGNAL",
															actions: [{
																	addToPlaylistCommand: {
																		openMiniplayer: !0,
																		listType: "PLAYLIST_EDIT_LIST_TYPE_QUEUE",
																		onCreateListCommand: {
																			createPlaylistServiceEndpoint: {
																				videoIds: [d],
																				params: "CAQ%3D"
																			}
																		},
																		videoIds: [d]
																	}
																}
															]
														}
													}),
													document.querySelector("html").removeAttribute("ysm-fetch-options"),
													document.querySelector("html").removeAttribute("ysm-fetch-video-id"),
													document.querySelector("html").removeAttribute("ysm-fetch-channel-id"),
													e.abrupt("return");
												case 33:
													"save_to_playlist" === document.querySelector("html").getAttribute("ysm-fetch-options") && (u = JSON.parse(document.querySelector("html").getAttribute("ysm-data-save-to-playlist")), m = document.querySelector("html").getAttribute("ysm-video-save-to-playlist"), l = document.querySelector("html").getAttribute("ysm-channel-save-to-playlist"), (h = document.querySelector('a.yt-simple-endpoint[href]:not([target]):not([href^="/watch"]):not([href="null"]):not([href^="https://www.youtube.com/redirect"]):not([href^="https://www.googleadservices.com"]):not([href^="https://studio.youtube.com"]):not(.ytd-display-ad-renderer):not([href="/"])')).dataset.ysmChannelId = l, h.dataset.ysmFetchContentType = document.querySelector("html").getAttribute("ysm-fetch-content-type"), h && (document.querySelector("html").setAttribute("ysm-page-loading", 3), h.addEventListener("click", hr, !0), h.click(), h.removeEventListener("click", hr, !0)), ytcfg = u.ytcfg, or(m), document.querySelector("html").removeAttribute("ysm-fetch-options"), document.querySelector("html").removeAttribute("ysm-video-save-to-playlist"), document.querySelector("html").removeAttribute("ysm-channel-save-to-playlist"), document.querySelector("html").removeAttribute("ysm-data-save-to-playlist"));
												case 34:
												case "end":
													return e.stop()
												}
										}), e)
								})));
					return function (t) {
						return e.apply(this, arguments)
					}
				}
					())
			})).observe(document.querySelector("html"), {
			attributes: !0
		})
	})()
})();
