// ==UserScript==
// @name         Brazen Base Search Enhancer
// @namespace    brazenvoid
// @version      5.3.4
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Base class for search enhancement scripts
// ==/UserScript==

const ICON_RECYCLE = '&#x267B'

// Preset filter configuration keys

const CONFIG_PAGINATOR_LIMIT = 'Pagination Limit'
const CONFIG_PAGINATOR_THRESHOLD = 'Pagination Threshold'

const FILTER_DURATION_RANGE = 'Dura'
const FILTER_PERCENTAGE_RATING_RANGE = 'Rating'
const FILTER_SUBSCRIBED_VIDEOS = 'H Sub'
const FILTER_TEXT_BLACKLIST = 'Blacklist'
const FILTER_TEXT_SEARCH = 'Search'
const FILTER_TEXT_SANITIZATION = 'Text Sanitization Rules'
const FILTER_TEXT_WHITELIST = 'Whitelist'
const FILTER_UNRATED = 'Unrated'

const STORE_SUBSCRIPTIONS = 'Account Subscriptions'

// Item preset attributes

const ITEM_NAME = 'name'
const ITEM_PROCESSED_ONCE = 'processedOnce'

// Configuration

const OPTION_ALWAYS_SHOW_SETTINGS_PANE = 'Always Show Settings Pane'
const OPTION_DISABLE_COMPLIANCE_VALIDATION = 'Disable All Filters'

class BrazenBaseSearchEnhancer
{
    /**
     * @typedef {{configKey: string, validate: SearchEnhancerFilterValidationCallback, comply: SearchEnhancerFilterComplianceCallback}} ComplianceFilter
     */
    
    /**
     * @typedef {{isUserLoggedIn: boolean, itemDeepAnalysisSelector: JQuery.Selector, itemListSelectors: JQuery.Selector, itemLinkSelector: JQuery.Selector,
     *            itemNameSelector: JQuery.Selector, itemSelectors: JQuery.Selector, requestDelay: number, scriptPrefix: string}} Configuration
     */
    
    /**
     * @callback SearchEnhancerFilterValidationCallback
     * @param {*} configValues
     * @return boolean
     */
    
    /**
     * @callback SearchEnhancerFilterComplianceCallback
     * @param {JQuery} item
     * @param {*} configValues
     * @return {*}
     */
    
    /**
     * @callback SubscriptionsFilterExclusionsCallback
     * @return {boolean}
     */
    
    /**
     * @callback SubscriptionsFilterUsernameCallback
     * @param {JQuery} item
     * @return {boolean|string}
     */
    
    /**
     * @param {Configuration} configuration
     */
    constructor(configuration)
    {
        /**
         * Array of item compliance filters ordered in intended sequence of execution
         * @type {ComplianceFilter[]}
         * @private
         */
        this._complianceFilters = []
        
        /**
         * Pagination manager
         * @type BrazenPaginator|null
         * @private
         */
        this._paginator = null
    
        /**
         * @type {Configuration}
         * @protected
         */
        this._config = configuration
        
        /**
         * @type {BrazenItemAttributesResolver}
         * @protected
         */
        this._itemAttributesResolver = new BrazenItemAttributesResolver({
            itemDeepAnalysisSelector: this._config.itemDeepAnalysisSelector,
            itemLinkSelector: this._config.itemLinkSelector,
            requestDelay: this._config.requestDelay,
            onDeepAttributesResolution: (item) => {
                this._complyItem(item)
                Utilities.callEventHandler(this._onAfterComplianceRun)
            }
        })
    
        /**
         * @type {boolean}
         * @private
         */
        this._sanitizationEnabled = false
        
        /**
         * @type {StatisticsRecorder}
         * @protected
         */
        this._statistics = new StatisticsRecorder(this._config.scriptPrefix)
        
        /**
         * @type {BrazenSubscriptionsLoader|null}
         * @protected
         */
        this._subscriptionsLoader = null
        
        /**
         * @type {JQuery<HTMLElement> | jQuery | HTMLElement}
         * @protected
         */
        this._syncConfigButton = $('<button id="brazen-sync-config-btn" style="position: fixed"></button>')
            .text(ICON_RECYCLE)
            .hide()
            .appendTo($('body'))
            .on('click', () => {
                this._onResetSettings()
                this._syncConfigButton.hide()
            })
        
        /**
         * @type {BrazenUIGenerator}
         * @protected
         */
        this._uiGen = new BrazenUIGenerator(this._config.scriptPrefix)
        
        /**
         * Local storage store with defaults
         * @type {BrazenConfigurationManager}
         * @protected
         */
        this._configurationManager = BrazenConfigurationManager.create(this._uiGen)
            .addFlagField(OPTION_DISABLE_COMPLIANCE_VALIDATION, 'Disables all search filters.')
            .addFlagField(OPTION_ALWAYS_SHOW_SETTINGS_PANE, 'Always show configuration interface.')
        
        // Events
        
        /**
         * Operations to perform after script initialization
         * @type {Function}
         * @protected
         */
        this._onAfterInitialization = null
        
        /**
         * Operations to perform after a complete compliance run
         * @type {Function}
         * @protected
         */
        this._onAfterComplianceRun = null
        
        /**
         * Operations to perform after UI generation
         * @type {Function}
         * @protected
         */
        this._onAfterUIBuild = null
        
        /**
         * Operations to perform before compliance validation. This callback can also be used to skip compliance validation by returning false.
         * @type {null}
         * @protected
         */
        this._onBeforeCompliance = null
        
        /**
         * Operations to perform before UI generation
         * @type {Function}
         * @protected
         */
        this._onBeforeUIBuild = null
        
        /**
         * Operations to perform after compliance checks, the first time item is retrieved
         * @type {Function}
         * @param {JQuery} item
         * @protected
         */
        this._onFirstHitAfterCompliance = null
        
        /**
         * Operations to perform before compliance checks, the first time item is retrieved
         * @type {Function}
         * @param {JQuery} item
         * @protected
         */
        this._onFirstHitBeforeCompliance = null
        
        /**
         * Logic to hide a non-compliant item
         * @type {Function}
         * @param {JQuery} item
         * @protected
         */
        this._onItemHide = (item) => {
            item.addClass('noncompliant-item')
            item.hide()
        }
        
        /**
         * Logic to show compliant item
         * @type {Function}
         * @param {JQuery} item
         * @protected
         */
        this._onItemShow = (item) => {
            item.removeClass('noncompliant-item')
            item.show()
        }
        
        /**
         * Must return the generated settings section node
         * @type {Function}
         * @protected
         */
        this._onUIBuild = null
        
        /**
         * Validate initiating initialization.
         * Can be used to stop script init on specific pages or vice versa
         * @type {Function}
         * @protected
         */
        this._onValidateInit = () => true
    }
    
    /**
     * @param {JQuery} UISection
     * @private
     */
    _embedUI(UISection)
    {
        UISection.on('mouseleave', (event) => {
            if (!this._getConfig(OPTION_ALWAYS_SHOW_SETTINGS_PANE)) {
                $(event.currentTarget).hide(300)
            }
        })
        if (this._getConfig(OPTION_ALWAYS_SHOW_SETTINGS_PANE)) {
            UISection.show()
        }
        this._uiGen.constructor.appendToBody(UISection)
        this._uiGen.constructor.appendToBody(this._uiGen.createSettingsShowButton('', UISection))
    }
    
    /**
     * @private
     */
    _onApplyNewSettings()
    {
        this._configurationManager.update()
        this._validateCompliance()
    }
    
    /**
     * @private
     */
    _onBackupSettings()
    {
        navigator.clipboard.writeText(this._configurationManager.backup()).then(() => this._uiGen.updateStatus('Settings backed up to clipboard!')).catch(
            () => this._uiGen.updateStatus('Settings backup failed!'))
    }
    
    /**
     * @private
     */
    _onResetSettings()
    {
        this._configurationManager.revertChanges()
        this._validateCompliance()
    }
    
    /**
     * @private
     */
    _onRestoreSettings()
    {
        let settings = $('#restore-settings').val().trim()
        if (!settings) {
            this._uiGen.updateStatus('No Settings provided!', true)
            Utilities.sleep(3000).then(() => this._uiGen.resetStatus())
        } else {
            try {
                this._configurationManager.restore(settings)
                this._uiGen.updateStatus('Settings restored!')
                this._validateCompliance()
            } catch (e) {
                this._uiGen.updateStatus('Settings restoration failed!')
            }
        }
        
    }
    
    /**
     * @private
     */
    _onSaveSettings()
    {
        this._onApplyNewSettings()
        this._configurationManager.save()
    }
    
    /**
     * @param {string} helpText
     * @protected
     */
    _addItemBlacklistFilter(helpText)
    {
        this._configurationManager.addRulesetField(
            FILTER_TEXT_BLACKLIST, 5, helpText, null, null, (rules) => Utilities.buildWholeWordMatchingRegex(rules) ?? '')
        this._addItemComplexComplianceFilter(
            FILTER_TEXT_BLACKLIST,
            (value) => value !== '',
            (item, value) => this._get(item, ITEM_NAME)?.match(value) === null,
        )
    }
    
    /**
     * @param {string} configKey
     * @param {SearchEnhancerFilterValidationCallback|null} validationCallback
     * @param {SearchEnhancerFilterComplianceCallback} complianceCallback
     * @protected
     */
    _addItemComplexComplianceFilter(configKey, validationCallback, complianceCallback)
    {
        this._addItemComplianceFilter(configKey, complianceCallback, validationCallback)
    }
    
    /**
     * @param {string} configKey
     * @param {SearchEnhancerFilterComplianceCallback|string} action
     * @param {SearchEnhancerFilterValidationCallback|null} validationCallback
     * @protected
     */
    _addItemComplianceFilter(configKey, action = null, validationCallback = null)
    {
        let configType = this._configurationManager.getField(configKey).type
        if (action === null) {
            action = configKey
        }
        if (typeof action === 'string') {
            let attributeName = action
            switch (configType) {
                case CONFIG_TYPE_CHECKBOXES_GROUP:
                    action = (item, values) => {
                        let attribute = this._get(item, attributeName)
                        return attribute && values.length ? values.includes(attribute) : true
                    }
                    break
                case CONFIG_TYPE_FLAG:
                    action = (item) => {
                        let attribute = this._get(item, attributeName)
                        return attribute !== null ? attribute : true
                    }
                    break
                case CONFIG_TYPE_RADIOS_GROUP:
                    action = (item, value) => {
                        let attribute = this._get(item, attributeName)
                        return attribute ? value === attribute : true
                    }
                    break
                case CONFIG_TYPE_RANGE:
                    action = (item, range) => {
                        let attribute = this._get(item, attributeName)
                        return attribute ? Validator.isInRange(this._get(item, attributeName), range.minimum, range.maximum) : true
                    }
                    break
                default:
                    throw new Error('Associated config type requires explicit action callback definition.')
            }
        }
        if (validationCallback === null) {
            switch (configType) {
                case CONFIG_TYPE_FLAG:
                case CONFIG_TYPE_RADIOS_GROUP:
                case CONFIG_TYPE_SELECT:
                    validationCallback = (value) => value
                    break
                case CONFIG_TYPE_CHECKBOXES_GROUP:
                    validationCallback = (valueKeys) => valueKeys.length
                    break
                case CONFIG_TYPE_NUMBER:
                    validationCallback = (value) => value > 0
                    break
                case CONFIG_TYPE_RANGE:
                    validationCallback = (range) => range.minimum > 0 || range.maximum > 0
                    break
                case CONFIG_TYPE_RULESET:
                    validationCallback = (rules) => rules.length
                    break
                case CONFIG_TYPE_TEXT:
                    validationCallback = (value) => value.length
                    break
                default:
                    throw new Error('Associated config type requires explicit validation callback definition.')
            }
        }
        this._complianceFilters.push({
            configKey: configKey,
            validate: validationCallback,
            comply: action,
        })
    }
    
    /**
     * @param {JQuery.Selector|Function} durationNodeSelector
     * @param {string|null} helpText
     * @protected
     */
    _addItemDurationRangeFilter(durationNodeSelector, helpText = null)
    {
        this._configurationManager.addRangeField(FILTER_DURATION_RANGE, 0, 100000, helpText ?? 'Filter items by duration.')
        
        this._itemAttributesResolver.addAttribute(FILTER_DURATION_RANGE, (item) => {
            let duration
            if (typeof durationNodeSelector !== 'function') {
                let durationNode = item.find(durationNodeSelector)
                if (durationNode.length) {
                    duration = durationNode.text().trim()
                } else {
                    return null
                }
            } else {
                duration = durationNodeSelector(item)
            }
            duration = duration.split(':')
            duration = (parseInt(duration[0]) * 60) + parseInt(duration[1])
            return duration === 0 ? null : duration
        })
        
      this._addItemComplianceFilter(FILTER_DURATION_RANGE)
    }
    
    /**
     * @param {JQuery.Selector} ratingNodeSelector
     * @param {string|null} helpText
     * @param {string|null} unratedHelpText
     * @protected
     */
    _addItemPercentageRatingRangeFilter(ratingNodeSelector, helpText = null, unratedHelpText = null)
    {
        this._configurationManager.addRangeField(FILTER_PERCENTAGE_RATING_RANGE, 0, 100000, helpText ?? 'Filter items by percentage rating.').addFlagField(
            FILTER_UNRATED, unratedHelpText ?? 'Hide items with zero or no rating.')
        
        this._itemAttributesResolver.addAttribute(FILTER_PERCENTAGE_RATING_RANGE, (item) => {
            let rating = item.find(ratingNodeSelector)
            return rating.length === 0 ? null : parseInt(rating.text().replace('%', ''))
        })
        
        this._addItemComplianceFilter(FILTER_PERCENTAGE_RATING_RANGE, (item, range) => {
            let rating = this._get(item, FILTER_PERCENTAGE_RATING_RANGE)
            return rating ? Validator.isInRange(rating, range.minimum, range.maximum) : !this._getConfig(FILTER_UNRATED)
        })
    }
    
    /**
     * @param {string} helpText
     * @protected
     */
    _addItemTextSanitizationFilter(helpText)
    {
        this._sanitizationEnabled = true
        
        this._configurationManager.addRulesetField(FILTER_TEXT_SANITIZATION, 2, helpText, (rules) => {
            let sanitizationRules = {}, fragments, validatedTargetWords
            for (let sanitizationRule of rules) {
                
                if (sanitizationRule.includes('=')) {
                    fragments = sanitizationRule.split('=')
                    if (fragments[0] === '') {
                        fragments[0] = ' '
                    }
                    
                    validatedTargetWords = Utilities.trimAndKeepNonEmptyStrings(fragments[1].split(','))
                    if (validatedTargetWords.length) {
                        sanitizationRules[fragments[0]] = validatedTargetWords
                    }
                }
            }
            return sanitizationRules
        }, (rules) => {
            let sanitizationRulesText = []
            for (let substitute in rules) {
                sanitizationRulesText.push(substitute + '=' + rules[substitute].join(','))
            }
            return sanitizationRulesText
            
        }, (rules) => {
            let optimizedRules = {}
            for (const substitute in rules) {
                optimizedRules[substitute] = Utilities.buildWholeWordMatchingRegex(rules[substitute])
            }
            return optimizedRules
        })
    }
    
    /**
     * @param {string|null} helpText
     * @protected
     */
    _addItemTextSearchFilter(helpText = null)
    {
        this._configurationManager.addTextField(FILTER_TEXT_SEARCH, helpText ?? 'Show videos with these comma separated words in their names.')
        this._addItemComplianceFilter(FILTER_TEXT_SEARCH, (item, value) => this._get(item, ITEM_NAME).includes(value))
    }
    
    /**
     * @param {string} helpText
     * @protected
     */
    _addItemWhitelistFilter(helpText)
    {
        this._configurationManager.addRulesetField(
            FILTER_TEXT_WHITELIST, 5, helpText, null, null, (rules) => Utilities.buildWholeWordMatchingRegex(rules))
    }
    
    /**
     * @param {SubscriptionsFilterExclusionsCallback} exclusionsCallback Add page exclusions here
     * @param {SubscriptionsFilterUsernameCallback} getItemUsername Return username of the item or return false to skip
     * @protected
     */
    _addSubscriptionsFilter(exclusionsCallback, getItemUsername)
    {
        this._configurationManager
            .addFlagField(FILTER_SUBSCRIBED_VIDEOS, 'Hide videos from subscribed channels.')
            .addTextField(STORE_SUBSCRIPTIONS, 'Recorded subscription accounts.')
        
        this._addItemComplexComplianceFilter(
            FILTER_SUBSCRIBED_VIDEOS,
            (value) => value && this._config.isUserLoggedIn && exclusionsCallback,
            (item) => {
                let username = getItemUsername(item)
                if (username === false) {
                    return true
                }
                return !(new RegExp('"([^"]*' + username + '[^"]*)"')).test(this._getConfig(STORE_SUBSCRIPTIONS))
            })
    }
    
    /**
     * @param {JQuery} item
     * @protected
     */
    _complyItem(item)
    {
        let itemComplies = true
        
        if (!this._getConfig(OPTION_DISABLE_COMPLIANCE_VALIDATION) &&
            this._validateItemWhiteList(item) &&
            Utilities.callEventHandler(this._onBeforeCompliance, [item], true)
        ) {
            let configField
            
            for (let complianceFilter of this._complianceFilters) {
                
                configField = this._configurationManager.getFieldOrFail(complianceFilter.configKey)
                if (complianceFilter.validate(configField.optimized ?? configField.value)) {
                    
                    itemComplies = complianceFilter.comply(item, configField.optimized ?? configField.value)
                    this._statistics.record(complianceFilter.configKey, itemComplies)
                    
                    if (!itemComplies) {
                        break
                    }
                }
            }
        }
        itemComplies ? Utilities.callEventHandler(this._onItemShow, [item]) : Utilities.callEventHandler(this._onItemHide, [item])
        item.css('opacity', 'unset')
    }
    
    /**
     * Filters items as per settings
     * @param {JQuery} itemsList
     * @param {boolean} fromObserver
     * @protected
     */
    _complyItemsList(itemsList, fromObserver = false)
    {
        let items = fromObserver ? itemsList.filter(this._config.itemSelectors) : itemsList.find(this._config.itemSelectors)
        items.css('opacity', 0.75).each((index, element) => {
            
            let item = $(element)
            
            // First run processing
            
            if (this._get(item, ITEM_PROCESSED_ONCE) === null) {
                if (this._sanitizationEnabled) {
                    Validator.sanitizeTextNode(
                        item.find(this._config.itemNameSelector), this._configurationManager.getFieldOrFail(FILTER_TEXT_SANITIZATION).optimized)
                }
                this._itemAttributesResolver.resolveAttributes(item)
                Utilities.callEventHandler(this._onFirstHitBeforeCompliance, [item])
            }
            
            // Compliance filtering
            
            this._complyItem(item)
            
            // After first run processing
            
            if (!this._get(item, ITEM_PROCESSED_ONCE)) {
                Utilities.callEventHandler(this._onFirstHitAfterCompliance, [item])
                this._itemAttributesResolver.set(item, ITEM_PROCESSED_ONCE, true)
            }
        })
        this._statistics.updateUI()
    }
    
    /**
     * @protected
     * @return {JQuery[]}
     */
    _createPaginationControls()
    {
        return [this._configurationManager.createElement(CONFIG_PAGINATOR_THRESHOLD), this._configurationManager.createElement(CONFIG_PAGINATOR_LIMIT)]
    }
    
    /**
     * @protected
     * @return {JQuery}
     */
    _createSettingsBackupRestoreFormActions()
    {
        return this._uiGen.createFormSection('Backup & Restore').append([
            this._uiGen.createFormActions([
                this._uiGen.createFormButton('Backup', 'Backup settings to the clipboard.', () => this._onBackupSettings()),
                this._uiGen.createFormGroupInput('text').attr('id', 'restore-settings').attr('placeholder', 'Paste settings...'),
                this._uiGen.createFormButton('Restore', 'Restore backup settings.', () => this._onRestoreSettings()),
            ], 'single-column-layout'),
        ])
    }
    
    /**
     * @protected
     * @return {JQuery}
     */
    _createSettingsFormActions()
    {
        return this._uiGen.createFormSection().append([
            this._uiGen.createFormActions([
                this._uiGen.createFormButton('Apply', 'Apply settings.', () => this._onApplyNewSettings()),
                this._uiGen.createFormButton('Save', 'Apply and update saved configuration.', () => this._onSaveSettings()),
                this._uiGen.createFormButton('Reset', 'Revert to saved configuration.', () => this._onResetSettings()),
            ]),
        ])
    }
    
    /**
     * @protected
     * @return {JQuery}
     */
    _createSubscriptionLoaderControls()
    {
        let button = this._uiGen.createFormButton('Load Subscriptions', 'Makes a copy of your subscriptions in cache for related filters.', (event) => {
            if (this._config.isUserLoggedIn) {
                $(event.currentTarget).prop('disabled', true)
                
                this._subscriptionsLoader.run()
            } else {
                this._showNotLoggedInAlert()
            }
        })
        return button.attr('id', 'subscriptions-loader')
    }
    
    /**
     * @param {JQuery} item
     * @param {string} attributeName
     * @returns {*}
     * @protected
     */
    _get(item, attributeName)
    {
        return this._itemAttributesResolver.get(item, attributeName)
    }
    
    /**
     * @param {string} config
     * @returns {*}
     * @protected
     */
    _getConfig(config)
    {
        return this._configurationManager.getValue(config)
    }
    
    /**
     * @param {string} flag
     * @param {Function} actionCallback
     * @param {Function} validationCallback
     * @returns {BrazenBaseSearchEnhancer}
     * @protected
     */
    _performComplexFlaggedOperation(flag, validationCallback, actionCallback)
    {
        return this._performFlaggedOperation(flag, actionCallback, validationCallback)
    }
    
    /**
     * @param {string} flag
     * @param {Function} actionCallback
     * @param {Function|null} validationCallback
     * @returns {BrazenBaseSearchEnhancer}
     * @protected
     */
    _performFlaggedOperation(flag, actionCallback, validationCallback = null)
    {
        if (this._getConfig(flag) && Utilities.callEventHandler(validationCallback, [], true)) {
            actionCallback()
        }
        return this
    }
    
    /**
     * @param {PaginatorConfiguration} configuration
     * @protected
     */
    _setupPaginator(configuration)
    {
        configuration.itemSelectors = this._config.itemSelectors
        
        this._paginator = new BrazenPaginator(configuration)
        this._configurationManager
            .addNumberField(CONFIG_PAGINATOR_LIMIT, 1, 50, 'Limit paginator to concatenate the specified number of maximum pages.')
            .addNumberField(CONFIG_PAGINATOR_THRESHOLD, 1, 1000, 'Make paginator ensure the specified number of minimum results.')
    }
    
    /**
     * @return {BrazenSubscriptionsLoader}
     * @protected
     */
    _setupSubscriptionLoader()
    {
        this._subscriptionsLoader =
            new BrazenSubscriptionsLoader((status) => this._uiGen.updateStatus(status), (subscriptions) => {
                this._configurationManager.getField(STORE_SUBSCRIPTIONS).value = subscriptions.length ? '"' + subscriptions.join('""') + '"' : ''
                this._configurationManager.save()
                $('#subscriptions-loader').prop('disabled', false)
            })
        return this._subscriptionsLoader
    }
    
    /**
     * @protected
     */
    _showNotLoggedInAlert()
    {
        alert('You need to be logged in to use this functionality')
    }
    
    /**
     * @param {boolean} firstRun
     * @protected
     */
    _validateCompliance(firstRun = false)
    {
        let itemLists = $(this._config.itemListSelectors)
        if (!firstRun) {
            this._statistics.reset()
            itemLists.each((index, itemsList) => {
                this._complyItemsList($(itemsList))
            })
        } else {
            itemLists.each((index, itemList) => {
                let itemListObject = $(itemList)
                
                if (this._paginator && itemListObject.is(this._paginator.getItemListSelector())) {
                    
                    ChildObserver.create()
                        .onNodesAdded((itemsAdded) => {
                            this._complyItemsList($(itemsAdded), true)
                            this._paginator.run(this._getConfig(CONFIG_PAGINATOR_THRESHOLD), this._getConfig(CONFIG_PAGINATOR_LIMIT))
                        })
                        .observe(itemList)
                    
                } else {
                    ChildObserver.create()
                        .onNodesAdded((itemsAdded) => this._complyItemsList($(itemsAdded), true))
                        .observe(itemList)
                }
                
                this._complyItemsList(itemListObject)
            })
        }
        if (this._paginator) {
            this._paginator.run(this._getConfig(CONFIG_PAGINATOR_THRESHOLD), this._getConfig(CONFIG_PAGINATOR_LIMIT))
        }
        Utilities.callEventHandler(this._onAfterComplianceRun)
        this._itemAttributesResolver.completeResolutionRun()
    }
    
    /**
     * @param {JQuery} item
     * @return {boolean}
     * @protected
     */
    _validateItemWhiteList(item)
    {
        let field = this._configurationManager.getField(FILTER_TEXT_WHITELIST)
        if (field) {
            let validationResult = field.value.length ? Validator.regexMatches(this._get(item, ITEM_NAME), field.optimized) : true
            this._statistics.record(FILTER_TEXT_WHITELIST, validationResult)
            return validationResult
        }
        return true
    }
    
    /**
     * Initialize the script and do basic UI removals
     */
    init()
    {
        if (Utilities.callEventHandler(this._onValidateInit)) {
            
            this._configurationManager.initialize(this._config.scriptPrefix)
            
            this._itemAttributesResolver
                .addAttribute(ITEM_NAME, (item) => item.find(this._config.itemNameSelector).text())
                .addAttribute(ITEM_PROCESSED_ONCE, () => false)
            
            if (this._paginator) {
                this._paginator.initialize()
            }
            
            Utilities.callEventHandler(this._onBeforeUIBuild)
            this._embedUI(Utilities.callEventHandler(this._onUIBuild))
            Utilities.callEventHandler(this._onAfterUIBuild)
            
            this._configurationManager.updateInterface()
            
            this._validateCompliance(true)
            
            this._uiGen.updateStatus('')
            
            Utilities.callEventHandler(this._onAfterInitialization)
        }
    }
    
    /**
     * @returns {boolean}
     */
    isUserLoggedIn()
    {
        return this._config.isUserLoggedIn
    }
}