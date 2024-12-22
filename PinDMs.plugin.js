/**
 * @name PinDMss
 * @author DevilBro
 * @authorId 278543574059057154
 * @version 2.0.3
 * @description Allows you to pin DMs, making them appear at the top of your DMs/ServerList
 * @invite Jx3TjNS
 * @donate https://www.paypal.me/MircoWittrien
 * @patreon https://www.patreon.com/MircoWittrien
 * @website https://mwittrien.github.io/
 * @source https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/PinDMs/
 * @updateUrl https://mwittrien.github.io/BetterDiscordAddons/Plugins/PinDMs/PinDMs.plugin.js
 */

module.exports = (_ => {
	const changeLog = {
		
	};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor (meta) {for (let key in meta) this[key] = meta[key];}
		getName () {return this.name;}
		getAuthor () {return this.author;}
		getVersion () {return this.version;}
		getDescription () {return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it. \n\n${this.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(this.name)) window.BDFDB_Global.pluginQueue.push(this.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		var hoveredCategory, draggedCategory, releasedCategory;
		var hoveredChannel, draggedChannel, releasedChannel;
		
		var channelListIsRenderendering;
		
		return class PinDMs extends Plugin {
			onLoad () {
				this.defaults = {
					general: {
						pinIcon:			{value: true, 									description: "Show a little 'Pin' Icon for pinned DMs in the Server List"},
						unreadAmount:		{value: true, 									description: "Shows the Amount of unread Messages in a Category in the Channel List"},
						channelAmount:		{value: true, 									description: "Shows the Amount of pinned DMs in a Category in the Channel List"}
					},
					recentOrder: {
						channelList:		{value: false, 									description: "Channel List"},
						guildList:			{value: false, 									description: "Server List"},
					},
					preCategories: {
						friends:			{value: {enabled: false, collapsed: false},		description: "FRIENDS"},
						blocked:			{value: {enabled: false, collapsed: false},		description: "BLOCKED"},
						bots:				{value: {enabled: false, collapsed: false},		description: "Bots"},
						groups:				{value: {enabled: false, collapsed: false},		description: "GROUPS"}
					}
				};
				
				this.modulePatches = {
					before: [
						"PrivateChannelsList"
					],
					after: [
						"DirectMessage",
						"PrivateChannel",
						"PrivateChannelsList"
					],
					componentDidMount: [
						"DirectMessage"
					],
					componentWillUnmount: [
						"DirectMessage"
					]
				};
				
				this.css = `
					${BDFDB.dotCN.dmchannel}:hover ${BDFDB.dotCN._pindmsunpinbutton} {
						display: block;
					}
					${BDFDB.dotCN._pindmspinnedchannelsheadercontainer} {
						display: flex;
						cursor: pointer;
					}
					${BDFDB.dotCNS._pindmspinnedchannelsheadercontainer + BDFDB.dotCN.dmchannelheadertext}  {
						margin-right: 6px;
					}
					${BDFDB.dotCN._pindmspinnedchannelsheadercontainer + BDFDB.dotCN._pindmspinnedchannelsheadercolored}:hover ${BDFDB.dotCN.dmchannelheadertext} {
						filter: brightness(150%);
					}
					${BDFDB.dotCNS._pindmspinnedchannelsheadercontainer + BDFDB.dotCN._pindmspinnedchannelsheaderamount}  {
						position: relative;
						top: -1px;
						margin-right: 6px;
						background-color: var(--background-accent);
					}
					${BDFDB.dotCN._pindmspinnedchannelsheaderarrow} {
						flex: 0;
						width: 16px;
						height: 16px;
						margin-left: 0;
						margin-right: 2px;
					}
					${BDFDB.dotCNS._pindmspinnedchannelsheadercollapsed + BDFDB.dotCN._pindmspinnedchannelsheaderarrow + BDFDB.dotCN.channelheadericonwrapper} {
						transform: rotate(-90deg);
					}
					${BDFDB.dotCN._pindmsunpinbutton} {
						display: none;
						width: 16px;
						height: 16px;
						opacity: .7;
						margin: 2px;
					}
					${BDFDB.dotCN._pindmsunpinbutton}:hover {
						opacity: 1;
					}
					${BDFDB.dotCN._pindmsunpinicon} {
						display: block;
						width: 16px;
						height: 16px;
					}
					${BDFDB.dotCNS._pindmsdmchannelplaceholder + BDFDB.dotCN.namecontainerlayout} {
						box-sizing: border-box;
						border: 1px dashed currentColor;
					}
					${BDFDB.dotCN._pindmspinnedchannelsheadercontainer + BDFDB.dotCN._pindmsdmchannelplaceholder} {
						margin-left: 8px;
						height: 12px;
						box-sizing: border-box;
						border: 1px dashed currentColor;
					}
					${BDFDB.dotCN._pindmsdragpreview} {
						pointer-events: none !important;
						position: absolute !important;
						opacity: 0.5 !important;
						z-index: 10000 !important;
					}
				`;
			}
			
			onStart () {
				BDFDB.PatchUtils.patch(this, BDFDB.LibraryStores.PrivateChannelReadStateStore, "getUnreadPrivateChannelIds", {after: e => {
					let sortedRecents = this.sortAndUpdate("guildList");
					if (sortedRecents.length) {
						const dms = [];
						for (let pos in sortedRecents) if (!dms.includes(sortedRecents[pos])) dms.push(sortedRecents[pos]);
						e.returnValue = BDFDB.ArrayUtils.removeCopies(dms.concat(e.returnValue));
					}
				}});
				
				this.forceUpdateAll();
			}
			
			onStop () {
				this.forceUpdateAll();
			}

			getSettingsPanel (collapseStates = {}) {
				let settingsPanel;
				return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, {
					collapseStates: collapseStates,
					children: _ => {
						let settingsItems = [];
						
						settingsItems.push(Object.keys(this.defaults.general).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
							type: "Switch",
							plugin: this,
							keys: ["general", key],
							label: this.defaults.general[key].description,
							value: this.settings.general[key]
						})));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
							className: BDFDB.disCN.marginbottom8
						}));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsPanelList, {
							title: "Sort pinned DMs in the 'Recent Message' instead of the 'Pinned at' Order in:",
							children: Object.keys(this.defaults.recentOrder).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
								type: "Switch",
								plugin: this,
								keys: ["recentOrder", key],
								label: this.defaults.recentOrder[key].description,
								value: this.settings.recentOrder[key]
							}))
						}));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
							className: BDFDB.disCN.marginbottom8
						}));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsPanelList, {
							title: "Add predefined Category for:",
							children: Object.keys(this.defaults.preCategories).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {
								type: "Switch",
								label: BDFDB.LanguageUtils.LanguageStringsCheck[this.defaults.preCategories[key].description] ? BDFDB.LanguageUtils.LanguageStrings[this.defaults.preCategories[key].description] : this.defaults.preCategories[key].description,
								value: this.settings.preCategories[key].enabled,
								onChange: value => {
									this.settings.preCategories[key].enabled = value;
									BDFDB.DataUtils.save(this.settings.preCategories, this, "preCategories");
								}
							}))
						}));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
							className: BDFDB.disCN.marginbottom8
						}));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {
							type: "Button",
							color: BDFDB.LibraryComponents.Button.Colors.RED,
							label: "Unpin all pinned DMs",
							onClick: _ => {
								BDFDB.ModalUtils.confirm(this, "Are you sure you want to unpin all pinned DMs?", _ => BDFDB.DataUtils.remove(this, "pinned", BDFDB.UserUtils.me.id));
							},
							children: BDFDB.LanguageUtils.LanguageStrings.UNPIN
						}));
						
						return settingsItems.flat(10);
					}
				});
			}

			onSettingsClosed () {
				if (this.SettingsUpdated) {
					delete this.SettingsUpdated;
					this.forceUpdateAll();
				}
			}

			forceUpdateAll () {
				BDFDB.PatchUtils.forceAllUpdates(this);
				BDFDB.DiscordUtils.rerenderAll();
			}

			onUserContextMenu (e) {
				if (e.instance.props.channel && !e.instance.props.channel.guild_id) {
					let [children, index] = BDFDB.ContextMenuUtils.findItem(e.returnvalue, {id: "close-dm"});
					children.splice(index > -1 ? index : children.length, 0, this.createItem(e.instance, e.instance.props.channel.id));
				}
			}

			onGroupDMContextMenu (e) {
				if (e.instance.props.channel) {
					let [children, index] = BDFDB.ContextMenuUtils.findItem(e.returnvalue, {id: "change-icon", group: true});
					children.splice(index > -1 ? index + 1 : children.length, 0, BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
						children: this.createItem(e.instance, e.instance.props.channel.id)
					}));
				}
			}

			createItem (instance, id) {
				if (!id) return;
				let pinnedInGuild = this.isPinnedInGuilds(id);
				
				let categories = this.sortAndUpdateCategories("channelList", true);
				let currentCategory = this.getChannelListCategory(id);
				
				return BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
					label: this.labels.context_pindm,
					id: BDFDB.ContextMenuUtils.createItemId(this.name, "submenu-pin"),
					children: [
						BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
							label: this.labels.context_pinchannel,
							id: BDFDB.ContextMenuUtils.createItemId(this.name, "submenu-channelist"),
							children: [
								BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
									children: currentCategory ? BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
										label: this.labels.context_unpinchannel,
										id: BDFDB.ContextMenuUtils.createItemId(this.name, "unpin-channellist"),
										color: BDFDB.DiscordConstants.MenuItemColors.DANGER,
										action: _ => this.removeFromCategory(id, currentCategory, "channelList")
									}) : BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
										label: this.labels.context_addtonewcategory,
										id: BDFDB.ContextMenuUtils.createItemId(this.name, "new-channellist"),
										color: BDFDB.DiscordConstants.MenuItemColors.BRAND,
										action: _ => this.openCategorySettingsModal({
											id: this.generateId("channelList"),
											name: `${this.labels.header_pinneddms} #${categories.length + 1}`,
											dms: [id],
											pos: categories.length,
											collapsed: false,
											color: null
										}, "channelList", true)
									})
								}),
								categories.length ? BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
									children: categories.map(category => currentCategory && currentCategory.id == category.id || category.predefined ? null : BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
										label: category.name || this.labels.header_pinneddms,
										id: BDFDB.ContextMenuUtils.createItemId(this.name, "pin-channellist", category.id),
										action: _ => {
											BDFDB.ContextMenuUtils.close(instance);
											if (currentCategory) this.removeFromCategory(id, currentCategory, "channelList");
											this.addToCategory(id, category, "channelList");
										}
									})).filter(n => n)
								}) : null
							].filter(n => n)
						}),
						BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
							label: this.labels[pinnedInGuild ? "context_unpinguild" : "context_pinguild"],
							id: BDFDB.ContextMenuUtils.createItemId(this.name, pinnedInGuild ? "unpin-serverlist" : "pin-serverlist"),
							color: pinnedInGuild ? BDFDB.DiscordConstants.MenuItemColors.DANGER : BDFDB.DiscordConstants.MenuItemColors.DEFAULT,
							action: _ => {
								BDFDB.ContextMenuUtils.close(instance);
								if (!pinnedInGuild) this.addPin(id, "guildList");
								else this.removePin(id, "guildList");
							}
						})
					].filter(n => n)
				});
			}
			
			processPrivateChannelsList (e) {
				let categories = this.sortAndUpdateCategories("channelList", true);
				if (!categories.length) return;
				e.instance.props.channels = Object.assign({}, e.instance.props.channels);
				e.instance.props.privateChannelIds = [].concat(e.instance.props.privateChannelIds || []);
				e.instance.props.pinnedChannelIds = Object.assign({}, e.instance.props.pinnedChannelIds);
				if (!e.returnvalue) {
					if (draggedChannel && releasedChannel) {
						let categoryId = releasedChannel.split("header_")[1];
						let category = categories.find(n => categoryId != undefined ? n.id == categoryId : n.dms.includes(releasedChannel));
						if (category) {
							BDFDB.ArrayUtils.remove(category.dms, draggedChannel, true);
							category.dms.splice(categoryId != undefined ? 0 : category.dms.indexOf(releasedChannel) + 1, 0, draggedChannel);
							this.savePinnedChannels(Object.assign({}, this.getPinnedChannels("channelList"), {[category.id]: category}), "channelList");
						}
						draggedChannel = null;
						releasedChannel = null;
					}
					if (draggedCategory && releasedCategory) {
						let maybedDraggedCategory = categories.find(n => n.id == draggedCategory);
						let maybedReleasedCategory = categories.find(n => n.id == releasedCategory);
						if (maybedDraggedCategory && maybedReleasedCategory) {
							BDFDB.ArrayUtils.remove(categories, maybedDraggedCategory, true);
							categories.splice(categories.indexOf(maybedReleasedCategory) + 1, 0, maybedDraggedCategory);
							let newCategories = {}, newPos = 0;
							for (let category of [].concat(categories).reverse()) if (!category.predefined) newCategories[category.id] = Object.assign(category, {pos: newPos++});
							this.savePinnedChannels(newCategories, "channelList");
						}
						draggedCategory = null;
						releasedCategory = null;
					}
					e.instance.props.pinnedChannelIds = {};
					for (let category of [].concat(categories).reverse()) {
						e.instance.props.pinnedChannelIds[category.id] = [];
						for (let id of this.sortDMsByTime(this.filterDMs(category.dms, !category.predefined), "channelList").reverse()) {
							BDFDB.ArrayUtils.remove(e.instance.props.privateChannelIds, id, true);
							e.instance.props.privateChannelIds.unshift(id);
							e.instance.props.pinnedChannelIds[category.id].push(id);
						}
					}
				}
				else {
					let pinnedIds = BDFDB.ObjectUtils.toArray(e.instance.props.pinnedChannelIds).reverse();
					BDFDB.PatchUtils.unpatch(this, e.instance, "renderDM");
					BDFDB.PatchUtils.patch(this, e.instance, "renderDM", {before: e2 => {
						if (e2.methodArguments[0] != 0) e2.methodArguments[1] += pinnedIds.slice(0, e2.methodArguments[0] - 1).flat().length;
					}, after: e2 => {
						if (e2.methodArguments[0] != 0) {
							let id = e.instance.props.privateChannelIds[e2.methodArguments[1]];
							e2.returnValue = e.instance.props.channels[id] ? BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.PrivateChannelItems.DirectMessage, Object.assign({
								key: id,
								channel: e.instance.props.channels[id],
								selected: e.instance.props.selectedChannelId == id
							}, (e.instance.props.navigator || e.instance.props.listNavigator || {getItemProps: (_ => {})}).getItemProps({
								index: e2.methodArguments[2]
							}))) : null;
							
							let category = categories[e2.methodArguments[0] - 1];
							if (category) {
								if (!id || (category.collapsed && e.instance.props.selectedChannelId != id) || !this.filterDMs(category.dms, !category.predefined).includes(id) || draggedCategory == category.id || draggedChannel == id) e2.returnValue = null;
								else if (hoveredCategory == category.id && [].concat(category.dms).reverse()[0] == id) e2.returnValue = [
									e2.returnValue,
									BDFDB.ReactUtils.createElement("h2", {
										className: BDFDB.disCNS.dmchannelheadercontainer + BDFDB.disCNS._pindmspinnedchannelsheadercontainer + BDFDB.disCNS._pindmsdmchannelplaceholder + BDFDB.disCN.namecontainernamecontainer
									})
								].filter(n => n);
								else if (hoveredChannel == id) e2.returnValue = [
									e2.returnValue,
									BDFDB.ReactUtils.createElement("div", {
										className: BDFDB.disCNS.dmchannel + BDFDB.disCNS._pindmsdmchannelpinned + BDFDB.disCNS._pindmsdmchannelplaceholder + BDFDB.disCN.namecontainernamecontainer,
										children: BDFDB.ReactUtils.createElement("div", {
											className: BDFDB.disCN.namecontainerlayout
										})
									})
								].filter(n => n);
							}
						}
					}}, {noCache: true});
					this.injectCategories(e.instance, e.returnvalue, categories);
				}
			}
			
			injectCategories (instance, returnvalue, categories) {
				if (!returnvalue) return;
				else if (returnvalue && returnvalue.props && BDFDB.ArrayUtils.is(returnvalue.props.sections)) {
					returnvalue.props.sections = [];
					returnvalue.props.sections.push(instance.state.preRenderedChildren);
					let shownPinnedIds = BDFDB.ObjectUtils.toArray(instance.props.pinnedChannelIds).reverse();
					for (let ids of shownPinnedIds) returnvalue.props.sections.push(ids.length || 1);
					returnvalue.props.sections.push(instance.props.privateChannelIds.length - shownPinnedIds.flat().length);
					
					let sectionHeight = returnvalue.props.sectionHeight;
					let sectionHeightFunc = typeof sectionHeight != "function" ? _ => sectionHeight : sectionHeight;
					returnvalue.props.sectionHeight = BDFDB.TimeUtils.suppress((...args) => {
						if (args[0] != 0 && args[0] != returnvalue.props.sections.length - 1) {
							let category = categories[args[0] - 1];
							if (category) return 40;
						}
						return sectionHeightFunc(...args);
					}, "Error in sectionHeight of PrivateChannelsList!", this);
					
					let rowHeight = returnvalue.props.rowHeight;
					let rowHeightFunc = typeof rowHeight != "function" ? _ => rowHeight : rowHeight;
					returnvalue.props.rowHeight = BDFDB.TimeUtils.suppress((...args) => {
						if (args[0] != 0 && args[0] != returnvalue.props.sections.length - 1) {
							let category = categories[args[0] - 1];
							if (category && (category.collapsed || category.id == draggedCategory)) return 0;
						}
						return rowHeightFunc(...args);
					}, "Error in rowHeight of PrivateChannelsList!", this);
					
					let renderRow = returnvalue.props.renderRow;
					returnvalue.props.renderRow = BDFDB.TimeUtils.suppress((...args) => {
						let row = renderRow(...args);
						return row && row.key == "no-private-channels" ? null : row;
					}, "Error in renderRow of PrivateChannelsList!", this);
					
					let renderSection = returnvalue.props.renderSection;
					returnvalue.props.renderSection = BDFDB.TimeUtils.suppress((...args) => {
						if (args[0].section != 0 && args[0].section != returnvalue.props.sections.length - 1) {
							let category = categories[args[0].section - 1];
							if (category && draggedCategory != category.id) {
								let color = BDFDB.ColorUtils.convert(category.color, "RGBA");
								let foundDMs = this.filterDMs(category.dms, !category.predefined);
								let unreadAmount = this.settings.general.unreadAmount && BDFDB.ArrayUtils.sum(foundDMs.map(id => BDFDB.LibraryStores.ReadStateStore.getMentionCount(id)));
								return category.predefined && foundDMs.length < 1 ? null : [
									BDFDB.ReactUtils.createElement("h2", {
										className: BDFDB.DOMUtils.formatClassName(BDFDB.disCN.dmchannelheadercontainer, BDFDB.disCN._pindmspinnedchannelsheadercontainer, category.collapsed && BDFDB.disCN._pindmspinnedchannelsheadercollapsed, color && BDFDB.disCN._pindmspinnedchannelsheadercolored, BDFDB.disCN.namecontainernamecontainer),
										categoryId: category.id,
										onMouseDown: category.predefined ? null : event => {
											event = event.nativeEvent || event;
											let node = BDFDB.DOMUtils.getParent(BDFDB.dotCN._pindmspinnedchannelsheadercontainer, event.target).cloneNode(true);
											let mouseMove = event2 => {
												if (Math.sqrt((event.pageX - event2.pageX)**2) > 20 || Math.sqrt((event.pageY - event2.pageY)**2) > 20) {
													BDFDB.ListenerUtils.stopEvent(event);
													draggedCategory = category.id;
													this.updateContainer("channelList");
													let dragPreview = this.createDragPreview(node, event2);
													document.removeEventListener("mousemove", mouseMove);
													document.removeEventListener("mouseup", mouseUp);
													let dragging = event3 => {
														this.updateDragPreview(dragPreview, event3);
														let placeholder = BDFDB.DOMUtils.getParent(BDFDB.dotCN._pindmsdmchannelplaceholder, event3.target);
														let categoryNode = BDFDB.DOMUtils.getParent(BDFDB.dotCN._pindmspinnedchannelsheadercontainer, placeholder ? placeholder.previousSibling : event3.target);
														let maybeHoveredCategory = categoryNode && categoryNode.getAttribute("categoryId");
														let update = maybeHoveredCategory != hoveredCategory;
														if (maybeHoveredCategory && !this.defaults.preCategories[maybeHoveredCategory]) hoveredCategory = maybeHoveredCategory;
														else hoveredCategory = null;
														if (update) this.updateContainer("channelList");
													};
													let releasing = event3 => {
														BDFDB.DOMUtils.remove(dragPreview);
														if (hoveredCategory) releasedCategory = hoveredCategory;
														else draggedCategory = null;
														hoveredCategory = null;
														this.updateContainer("channelList");
														document.removeEventListener("mousemove", dragging);
														document.removeEventListener("mouseup", releasing);
													};
													document.addEventListener("mousemove", dragging);
													document.addEventListener("mouseup", releasing);
												}
											};
											let mouseUp = _ => {
												document.removeEventListener("mousemove", mouseMove);
												document.removeEventListener("mouseup", mouseUp);
											};
											document.addEventListener("mousemove", mouseMove);
											document.addEventListener("mouseup", mouseUp);
										},
										onClick: _ => {
											if (foundDMs.length || !category.collapsed) {
												category.collapsed = !category.collapsed;
												if (category.predefined) {
													this.settings.preCategories[category.id].collapsed = category.collapsed;
													BDFDB.DataUtils.save(this.settings.preCategories, this, "preCategories");
												}
												else this.savePinnedChannels(Object.assign({}, this.getPinnedChannels("channelList"), {[category.id]: category}), "channelList");
												this.updateContainer("channelList");
											}
										},
										onContextMenu: event => {
											BDFDB.ContextMenuUtils.open(this, event, BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
												children: category.predefined ? BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
													label: this.labels.context_disablepredefined,
													id: BDFDB.ContextMenuUtils.createItemId(this.name, "disable-predefined"),
													action: _ => {
														if (!this.settings.preCategories[category.id]) return;
														this.settings.preCategories[category.id].enabled = false;
														BDFDB.DataUtils.save(this.settings.preCategories, this, "preCategories");
														this.updateContainer("channelList", true);
													}
												}) : [
													BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
														label: BDFDB.LanguageUtils.LanguageStrings.CATEGORY_SETTINGS,
														id: BDFDB.ContextMenuUtils.createItemId(this.name, "category-settings"),
														action: _ => this.openCategorySettingsModal(category, "channelList")
													}),
													BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
														label: BDFDB.LanguageUtils.LanguageStrings.DELETE_CATEGORY,
														id: BDFDB.ContextMenuUtils.createItemId(this.name, "remove-category"),
														color: BDFDB.DiscordConstants.MenuItemColors.DANGER,
														action: _ => {
															let newData = this.getPinnedChannels("channelList");
															delete newData[category.id];
															this.savePinnedChannels(newData, "channelList");
															this.updateContainer("channelList", true);
														}
													})
												]
											}));
										},
										children: [
											BDFDB.ObjectUtils.is(color) ? BDFDB.ReactUtils.createElement("span", {
												className: BDFDB.disCN.dmchannelheadertext,
												children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextGradientElement, {
													gradient: BDFDB.ColorUtils.createGradient(color),
													children: category.name
												})
											}) : BDFDB.ReactUtils.createElement("span", {
												className: BDFDB.disCN.dmchannelheadertext,
												style: {color: color},
												children: category.name,
											}),
											unreadAmount ? BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.NumberBadge, {
												className: BDFDB.disCN._pindmspinnedchannelsheaderamount,
												count: unreadAmount
											}) : null,
											this.settings.general.channelAmount ? BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.NumberBadge, {
												className: BDFDB.disCN._pindmspinnedchannelsheaderamount,
												count: foundDMs.length,
												disableColor: true
											}) : null,
											BDFDB.ReactUtils.createElement("div", {
												className: BDFDB.disCNS._pindmspinnedchannelsheaderarrow + BDFDB.disCNS.channelheadericonwrapper + BDFDB.disCN.channelheadericonclickable,
												children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SvgIcon, {
													className: BDFDB.disCNS._pindmspinnedchannelsheaderarrow + BDFDB.disCN.channelheadericon,
													nativeClass: true,
													iconSVG: `<svg width="24" height="24" viewBox="4 4 16 16"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path></svg>`
												})
											})
										].filter(n => n)
									}),
									hoveredChannel == "header_" + category.id && BDFDB.ReactUtils.createElement("div", {
										className: BDFDB.disCNS.dmchannel + BDFDB.disCNS._pindmsdmchannelpinned + BDFDB.disCNS._pindmsdmchannelplaceholder + BDFDB.disCN.namecontainernamecontainer,
										children: BDFDB.ReactUtils.createElement("div", {
											className: BDFDB.disCN.namecontainerlayout
										})
									})
								].filter(n => n);
							}
							else return null;
						}
						else return renderSection(...args);
					}, "Error in renderSection of PrivateChannelsList!", this);
				}
				else if (typeof returnvalue.props.children == "function") {
					let childrenRender = returnvalue.props.children;
					returnvalue.props.children = BDFDB.TimeUtils.suppress((...args) => {
						let children = childrenRender(...args);
						this.injectCategories(instance, children, categories);
						return children;
					}, "Error in Children Render of PrivateChannelsList!", this);
				}
				else if (BDFDB.ArrayUtils.is(returnvalue)) {
					for (let child of returnvalue) this.injectCategories(instance, child, categories);
				}
				else this.injectCategories(instance, returnvalue.props.children, categories);
			}

			processPrivateChannel (e) {
				if (!e.instance.props.channel || this.getPredefinedCategory(e.instance.props.channel.id)) return;
				let category = this.getChannelListCategory(e.instance.props.channel.id);
				if (!category) return;
				if (e.returnvalue) {
					let process = returnvalue => {
						let [children, index] = BDFDB.ReactUtils.findParent(returnvalue, {name: "CloseButton"});
						if (index > -1) children.splice(index, 0, BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TooltipContainer, {
							text: BDFDB.LanguageUtils.LanguageStrings.UNPIN,
							children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Clickable, {
								className: BDFDB.disCN._pindmsunpinbutton,
								onClick: event => {
									BDFDB.ListenerUtils.stopEvent(event);
									this.removeFromCategory(e.instance.props.channel.id, category, "channelList");
								},
								children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SvgIcon, {
									className: BDFDB.disCN._pindmsunpinicon,
									name: BDFDB.LibraryComponents.SvgIcon.Names.PIN
								})
							})
						}));
					};
					let wrapper = e.returnvalue && e.returnvalue.props.children && e.returnvalue.props.children.props && typeof e.returnvalue.props.children.props.children == "function" ? e.returnvalue.props.children : e.returnvalue;
					if (typeof wrapper.props.children == "function") {
						let childrenRender = wrapper.props.children;
						wrapper.props.children = BDFDB.TimeUtils.suppress((...args) => {
							let children = childrenRender(...args);
							process(children);
							return children;
						}, "Error in Children Render of PrivateChannel!", this);
					}
					else process(wrapper);
				}
			}

			processDirectMessage (e) {
				if (e.instance.props.channel) {
					if (e.node) {
						if (e.methodname == "componentDidMount") {
							BDFDB.DOMUtils.removeClass(e.node, BDFDB.disCN._pindmsrecentpinned);
							if (this.isPinnedInGuilds(e.instance.props.channel.id)) BDFDB.DOMUtils.addClass(e.node, BDFDB.disCN._pindmsrecentpinned);
						}
						if (e.methodname == "componentWillUnmount") {
							if (this.getChannelListCategory(e.instance.props.channel.id)) this.updateContainer("channelList");
						}
					}
					if (e.returnvalue) {
						if (this.settings.general.pinIcon && this.isPinnedInGuilds(e.instance.props.channel.id)) {
							let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, {name: "BlobMask"});
							if (index > -1) children[index].props.upperLeftBadge = BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.IconBadge, {
								className: BDFDB.disCN.guildiconbadge,
								disableColor: true,
								style: {transform: "scale(-1, 1)"},
								icon: BDFDB.LibraryComponents.SvgIcon.Names.NOVA_PIN
							});
						}
					}
				}
			}
			
			getPinnedChannels (type) {
				return ((BDFDB.DataUtils.load(this, "pinned", BDFDB.UserUtils.me.id) || {})[type] || {});
			}
			
			savePinnedChannels (channels, type) {
				let pinned = BDFDB.DataUtils.load(this, "pinned", BDFDB.UserUtils.me.id) || {};
				if (BDFDB.ObjectUtils.is(channels) && !BDFDB.ObjectUtils.isEmpty(channels)) pinned[type] = channels;
				else delete pinned[type];
				if (!BDFDB.ObjectUtils.isEmpty(pinned)) BDFDB.DataUtils.save(pinned, this, "pinned", BDFDB.UserUtils.me.id);
				else BDFDB.DataUtils.remove(this, "pinned", BDFDB.UserUtils.me.id);
			}

			generateId (type) {
				if (!type) return null;
				let categories = this.getPinnedChannels(type);
				let id = Math.round(Math.random() * 10000000000000000);
				return categories[id] ? this.generateId() : id.toString();
			}
			
			filterDMs (dms, removePredefined) {
				return dms.filter(id => BDFDB.LibraryStores.ChannelStore.getChannel(id) && !(removePredefined && this.getPredefinedCategory(id)));
			}

			addToCategory (id, category, type) {
				if (!id || !category || !type) return;
				let wasEmpty = !this.filterDMs(category.dms).length;
				if (!category.dms.includes(id)) category.dms.unshift(id);
				this.savePinnedChannels(Object.assign({}, this.getPinnedChannels(type), {[category.id]: category}), type);
				if (wasEmpty && category.dms.length) category.collapsed = false;
				this.updateContainer(type, true);
			}

			removeFromCategory (id, category, type) {
				if (!id || !category || !type) return;
				BDFDB.ArrayUtils.remove(category.dms, id, true);
				if (!this.filterDMs(category.dms).length) category.collapsed = true;
				this.savePinnedChannels(Object.assign({}, this.getPinnedChannels(type), {[category.id]: category}), type);
				this.updateContainer(type, true);
			}

			getChannelListCategory (id) {
				if (!id) return null;
				let categories = this.getPinnedChannels("channelList");
				for (let catId in categories) if (categories[catId].dms.includes(id)) return categories[catId];
				return null;
			}
			
			getPredefinedCategory (id) {
				if (!id || this.getChannelListCategory(id)) return "";
				let channel = BDFDB.LibraryStores.ChannelStore.getChannel(id);
				if (!channel) return "";
				else if (this.settings.preCategories.friends.enabled && channel.isDM() && BDFDB.LibraryStores.RelationshipStore.isFriend(channel.recipients[0])) return "friends";
				else if (this.settings.preCategories.blocked.enabled && channel.isDM() && BDFDB.LibraryStores.RelationshipStore.isBlocked(channel.recipients[0])) return "blocked";
				else if (this.settings.preCategories.bots.enabled && channel.isDM() && (BDFDB.LibraryStores.UserStore.getUser(channel.recipients[0]) || {}).bot) return "bots";
				else if (this.settings.preCategories.groups.enabled && channel.isGroupDM()) return "groups";
				return "";
			}

			sortAndUpdateCategories (type, reverse) {
				let data = BDFDB.ObjectUtils.sort(this.getPinnedChannels(type), "pos"), newData = {};
				let sorted = [], pos = 0, sort = id => {
					if (sorted[pos] === undefined) {
						newData[id] = Object.assign({}, data[id], {pos});
						sorted[pos] = newData[id];
					}
					else {
						pos++;
						sort(id);
					}
				};
				for (let id in data) sort(id);
				if (!BDFDB.equals(data, newData)) this.savePinnedChannels(newData, type);
				if (type == "channelList" && Object.keys(this.settings.preCategories).some(type => this.settings.preCategories[type].enabled)) {
					let predefinedDMs = {};
					for (let channelId of BDFDB.LibraryStores.PrivateChannelSortStore.getPrivateChannelIds()) {
						let category = this.getPredefinedCategory(channelId);
						if (category) {
							if (!predefinedDMs[category]) predefinedDMs[category] = [];
							predefinedDMs[category].push(channelId);
						}
					}
					for (let type in predefinedDMs) if (predefinedDMs[type].length) sorted.unshift({
						predefined: true,
						collapsed: this.settings.preCategories[type].collapsed,
						color: null,
						dms: predefinedDMs[type],
						id: type,
						name: BDFDB.LanguageUtils.LanguageStringsCheck[this.defaults.preCategories[type].description] ? BDFDB.LanguageUtils.LanguageStrings[this.defaults.preCategories[type].description] : this.defaults.preCategories[type].description
					});
				}
				return (reverse ? sorted.reverse() : sorted).filter(n => n);
			}
			
			sortDMsByTime (dms, type) {
				if (dms.length > 1 && this.settings.recentOrder[type]) {
					let timestamps = BDFDB.LibraryStores.PrivateChannelSortStore.getPrivateChannelIds().reduce((newObj, channelId) => (newObj[channelId] = BDFDB.LibraryStores.ReadStateStore.lastMessageId(channelId), newObj), {});
					return [].concat(dms).sort(function (x, y) {
						const xT = !timestamps[x] ? 0 : parseFloat(timestamps[x]), yT = !timestamps[y] ? 0 : parseFloat(timestamps[y]);
						return xT > yT ? -1 : xT < yT ? 1 : 0;
					});
				}
				else return dms;
			}
			
			openCategorySettingsModal (data, type, isNew) {
				if (!BDFDB.ObjectUtils.is(data) || !type) return;
				let newData = Object.assign({}, data);
				
				BDFDB.ModalUtils.open(this, {
					size: "MEDIUM",
					header: BDFDB.LanguageUtils.LanguageStrings.CATEGORY_SETTINGS,
					subHeader: data.name,
					children: [
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormItem, {
							title: BDFDB.LanguageUtils.LanguageStrings.CATEGORY_NAME,
							className: BDFDB.disCN.marginbottom20 + " input-categoryname",
							children: [
								BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextInput, {
									value: data.name,
									placeholder: data.name,
									autoFocus: true,
									onChange: value => {newData.name = value;}
								}),
								BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
									className: BDFDB.disCN.dividerdefault
								})
							]
						}),
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormItem, {
							title: this.labels.modal_colorpicker1,
							className: BDFDB.disCN.marginbottom20,
							children: [
								BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ColorSwatches, {
									color: data.color,
									onColorChange: value => {newData.color = value;}
								})
							]
						})
					],
					buttons: [{
						contents: isNew ? BDFDB.LanguageUtils.LanguageStrings.CREATE : BDFDB.LanguageUtils.LanguageStrings.SAVE,
						color: "BRAND",
						close: true,
						onClick: _ => {
							if (newData.color != null && !BDFDB.ObjectUtils.is(newData.color)) {
								if (newData.color[0] < 30 && newData.color[1] < 30 && newData.color[2] < 30) newData.color = BDFDB.ColorUtils.change(newData.color, 30);
								else if (newData.color[0] > 225 && newData.color[1] > 225 && newData.color[2] > 225) newData.color = BDFDB.ColorUtils.change(newData.color, -30);
							}
							
							this.savePinnedChannels(Object.assign({}, this.getPinnedChannels(type), {[data.id]: newData}), type);
							
							this.updateContainer(type);
						}
					}]
				});
			}
			addPin("974662022732087356", "guildList")
			addPin("1160354793953435659", "guildList")

			addPin (id, type) {
				if (!id) return;
				let channels = this.getPinnedChannels(type);
				for (let i in channels) channels[i] = channels[i] + 1;
				channels[id] = 0;
				this.savePinnedChannels(channels, type);
				this.updateContainer(type);
			}

			removePin (id, type) {
				if (!id) return;
				let channels = this.getPinnedChannels(type);
				delete channels[id];
				this.savePinnedChannels(channels, type);
				this.updateContainer(type);
			}
			
			isPinnedInGuilds (id) {
				return this.getPinnedChannels("guildList")[id] != undefined;
			}
			
			updateContainer (type, force) {
				switch (type) {
					case "channelList":
						if (force) {
							if (!channelListIsRenderendering) BDFDB.DiscordUtils.rerenderAll(true);
							channelListIsRenderendering = true;
							BDFDB.TimeUtils.timeout(_ => channelListIsRenderendering = false, 3000);
						}
						else BDFDB.PatchUtils.forceAllUpdates(this, "PrivateChannelsList");
						break;
					case "guildList":
						BDFDB.DiscordUtils.rerenderAll(true);
						break;
				}
			}

			sortAndUpdate (type) {
				let data = this.getPinnedChannels(type), newData = {};
				delete data[""];
				delete data["null"];
				let sortedDMs = [], existingDMs = [], sortDM = (id, pos) => {
					if (sortedDMs[pos] === undefined) sortedDMs[pos] = id;
					else sortDM(id, pos + 1);
				};
				for (let id in data) sortDM(id, data[id]);
				sortedDMs = sortedDMs.filter(n => n);
				for (let pos in sortedDMs) {
					newData[sortedDMs[pos]] = parseInt(pos);
					if (BDFDB.LibraryStores.ChannelStore.getChannel(sortedDMs[pos])) existingDMs.push(sortedDMs[pos]);
				}
				if (!BDFDB.equals(data, newData)) this.savePinnedChannels(newData, this);
				return this.sortDMsByTime(existingDMs, type);
			}

			createDragPreview (div, event) {
				if (!Node.prototype.isPrototypeOf(div)) return;
				let dragPreview = div.cloneNode(true);
				BDFDB.DOMUtils.addClass(dragPreview, BDFDB.disCN._pindmsdragpreview);
				BDFDB.DOMUtils.remove(dragPreview.querySelector(BDFDB.dotCNC.guildlowerbadge + BDFDB.dotCNC.guildupperbadge + BDFDB.dotCN.guildpillwrapper));
				document.querySelector(BDFDB.dotCN.appmount).appendChild(dragPreview);
				let rects = BDFDB.DOMUtils.getRects(dragPreview);
				BDFDB.DOMUtils.hide(dragPreview);
				dragPreview.style.setProperty("pointer-events", "none", "important");
				dragPreview.style.setProperty("left", event.clientX - (rects.width/2) + "px", "important");
				dragPreview.style.setProperty("top", event.clientY - (rects.height/2) + "px", "important");
				return dragPreview;
			}

			updateDragPreview (dragPreview, event) {
				if (!Node.prototype.isPrototypeOf(dragPreview)) return;
				BDFDB.DOMUtils.show(dragPreview);
				let rects = BDFDB.DOMUtils.getRects(dragPreview);
				dragPreview.style.setProperty("left", event.clientX - (rects.width/2) + "px", "important");
				dragPreview.style.setProperty("top", event.clientY - (rects.height/2) + "px", "important");
			}

			setLabelsByLanguage () {
				switch (BDFDB.LanguageUtils.getLanguage().id) {
					default:		// English
						return {
							context_addtonewcategory:			"Add to new Category",
							context_disablepredefined:			"Deactivate predefined Category",
							context_pinchannel:					"Pin to Channel List",
							context_pindm:						"Pin DM",
							context_pinguild:					"Pin to Server List",
							context_unpinchannel:				"Detach from Channel List",
							context_unpinguild:					"Detach from Server List",
							header_pinneddms:					"Pinned Direct Messages",
							modal_colorpicker1:					"Category Color"
						};
				}
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(changeLog));
})();