// ==UserScript==
// @name         Brazen Base Search Enhancer
// @namespace    brazenvoid
// @version      2.9.0
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Base class for search enhancement scripts
// ==/UserScript==
// https://greasyfork.org/scripts/416105-brazen-base-search-enhancer/code/Brazen%20Base%20Search%20Enhancer.js?version=899428
var test = '';
const STORE_SUBSCRIPTIONS = 'Account Subscriptions'
// const STORE_VIEWED_ADDRESSES = 'Viewed Addresses Store'
// const STORE_WATCHED_ADDRESSES = 'Watched Addresses Store'
var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());
const FILTER_DURATION_RANGE = 'Dura'
const FILTER_PERCENTAGE_RATING_RANGE = 'Rate'
const FILTER_SUBSCRIBED_VIDEOS = 'H Sub'
const FILTER_TEXT_BLACKLIST = 'Blacklist'
const FILTER_TEXT_SEARCH = 'Search'
const FILTER_TEXT_SANITIZATION = 'Text Sanitization'
const FILTER_TEXT_WHITELIST = 'Whitelist'
const FILTER_UNRATED = 'Unrat'
const FILTER_VIEWED_VIDEOS = 'Hide Browsed'
// const FILTER_WATCHED_VIDEOS = 'Hide Watched Videos'

const ITEM_NAME_DOM_KEY = 'scriptItemName'
const ITEM_PROCESSED_ONCE_DOM_KEY = 'scriptProcessedOnce'

const CONFIG_PAGINATOR_LIMIT = 'Pagination Limit'
const CONFIG_PAGINATOR_THRESHOLD = 'Pagination Threshold'

const OPTION_ALWAYS_SHOW_SETTINGS_PANE = 'Always Show Settings Pane'
const OPTION_DISABLE_COMPLIANCE_VALIDATION = 'Dis All Filt'

const UI_MARK_WATCHED_VIDEOS = 'Mark Watched Videos'

class BrazenPaginator
{
    /**
     * @callback PaginatorAfterPaginationEventHandler
     * @param {BrazenPaginator} paginator
     */

    /**
     * @callback PaginatorGetPageNoFromUrlHandler
     * @param {string} pageUrl
     * @param {BrazenPaginator} paginator
     */

    /**
     * @callback PaginatorGetPageUrlFromPageNoHandler
     * @param {number} pageNo
     * @param {BrazenPaginator} paginator
     */

    /**
     * @callback PaginatorGetPaginationElementForPageNoHandler
     * @param {number} pageNo
     * @param {BrazenPaginator} paginator
     */

    /**
     * @param {JQuery} paginationWrapper
     * @param {JQuery.Selector} listSelector
     * @param {JQuery.Selector} itemClassesSelector
     * @param {string } lastPageUrl
     * @return {BrazenPaginator}
     */
    static create (paginationWrapper, listSelector, itemClassesSelector, lastPageUrl)
    {
        return (new BrazenPaginator).configure(paginationWrapper, listSelector, itemClassesSelector, lastPageUrl)
    }

    /**
     *
     */
    constructor ()
    {
        /**
         * @type {number}
         * @private
         */
        this._currentPageNo = 0

        /**
         * @type {JQuery.Selector}
         * @private
         */
        this._itemClassesSelector = ''

        /**
         * @type {number}
         * @private
         */
        this._lastPageNo = 0

        /**
         * @type {string}
         * @private
         */
        this._lastPageUrl = ''

        /**
         * @type {JQuery.Selector}
         * @private
         */
        this._listSelector = ''

        /**
         * @type {boolean}
         * @private
         */
        this._pageConcatenated = false

        /**
         * @type {number}
         * @private
         */
        this._paginatedPageNo = 0

        /**
         * @type {JQuery}
         * @private
         */
        this._paginationWrapper = null

        /**
         * @type {JQuery}
         * @private
         */
        this._targetElement = null

        // Events and callbacks

        /**
         * @type {PaginatorAfterPaginationEventHandler}
         * @private
         */
        this._onAfterPagination = null

        /**
         * @type {PaginatorGetPageNoFromUrlHandler}
         * @private
         */
        this._onGetPageNoFromUrl = null

        /**
         * @type {PaginatorGetPageUrlFromPageNoHandler}
         * @private
         */
        this._onGetPageUrlFromPageNo = null

        /**
         * @type {PaginatorGetPaginationElementForPageNoHandler}
         * @private
         */
        this._onGetPaginationElementForPageNo = null
    }

    _conformUIToNewPaginatedState ()
    {
        if (this._pageConcatenated) {
            this._pageConcatenated = false

            let currentPageElement = this.getPaginationElementForPageNo(this._currentPageNo)
            let newSubsequentPageNo = this._paginatedPageNo + 1
            let newSubsequentPageNoUrl = this.getPageUrlFromPageNo(newSubsequentPageNo)

            // Mutate current page no element to show paginated page numbers

            currentPageElement.text(this._currentPageNo + '-' + this._paginatedPageNo)

            // Get next pages' pagination elements

            let currentNextPageElements = currentPageElement.nextAll()

            if (this._paginatedPageNo === this._lastPageNo) {

                // Delete all pagination elements if last page is paginated

                currentNextPageElements.remove()

            } else {

                // Determine whether the paginated page immediately precedes the last page

                if (newSubsequentPageNo !== this._lastPageNo) {

                    // If not so, determine whether pagination element for the page following the paginated page exists

                    let newSubsequentPageElement = this.getPaginationElementForPageNo(newSubsequentPageNo)
                    if (!newSubsequentPageElement.length) {

                        // If it does not exist then try getting the old next page no element

                        let oldSubsequentPageElement = this.getPaginationElementForPageNo(this._currentPageNo + 1)
                        if (oldSubsequentPageElement.length) {

                            // If it does exist then mutate it for this purpose

                            oldSubsequentPageElement.attr('href', newSubsequentPageNoUrl).text(newSubsequentPageNo)

                        } else {

                            // If even that does not exist, then clone the less desirable alternative; the last page element and mutate it to this use

                            let lastPageElement = this.getPaginationElementForPageNo(this._lastPageNo)
                            lastPageElement.clone().insertAfter(currentPageElement).attr('href', newSubsequentPageNoUrl).text(newSubsequentPageNo)

                        }
                    }

                    // Remove any other pagination elements for already paginated pages

                    currentNextPageElements.each((index, element) => {
                        let paginationLink = $(element)
                        let paginationLinkUrl = paginationLink.attr('href')
                        if (paginationLinkUrl && this.getPageNoFromUrl(paginationLinkUrl) <= this._paginatedPageNo) {
                            paginationLink.remove()
                        }
                    })
                }
            }
            Utilities.callEventHandler(this._onAfterPagination, [this])
        }
    }

    /**
     * @param {number} threshold
     * @param {number} limit
     * @private
     */
    _loadAndParseNextPage (threshold, limit)
    {
        let lastPageHasNotBeenReached = this._paginatedPageNo < this._lastPageNo
        let paginationLimitHasNotBeenMet = limit > 0 && (this._paginatedPageNo - this._currentPageNo) < limit
        let compliantItemsAreLessThanTheThreshold = this._targetElement.find(this._itemClassesSelector + ':not(.noncompliant-item)').length < threshold

        if (lastPageHasNotBeenReached && paginationLimitHasNotBeenMet && compliantItemsAreLessThanTheThreshold) {

            this._sandbox.load(this.getPageUrlFromPageNo(++this._paginatedPageNo) + ' ' + this._listSelector, '', () => {
                this._pageConcatenated = true
                this._sandbox.find(this._itemClassesSelector).insertAfter(this._targetElement.find(this._itemClassesSelector + ':last'))
                this._sandbox.empty()
            })
        } else {
            this._conformUIToNewPaginatedState()
        }
    }

    /**
     * @param {JQuery} paginationWrapper
     * @param {JQuery.Selector} listSelector
     * @param {JQuery.Selector} itemClassesSelector
     * @param {string } lastPageUrl
     * @return {BrazenPaginator}
     */
    configure (paginationWrapper, listSelector, itemClassesSelector, lastPageUrl)
    {
        this._lastPageUrl = lastPageUrl
        this._listSelector = listSelector
        this._itemClassesSelector = itemClassesSelector
        this._paginationWrapper = paginationWrapper
        return this
    }

    getCurrentPageNo ()
    {
        return this._currentPageNo
    }

    getLastPageNo ()
    {
        return this._lastPageNo
    }

    getListSelector ()
    {
        return this._listSelector
    }

    /**
     * @param {string} pageUrl
     * @return {number}
     */
    getPageNoFromUrl (pageUrl)
    {
        return Utilities.callEventHandlerOrFail('onGetPageNoFromUrl', this._onGetPageNoFromUrl, [pageUrl, this])
    }

    /**
     * @param {number} pageNo
     * @return {string}
     */
    getPageUrlFromPageNo (pageNo)
    {
        return Utilities.callEventHandlerOrFail('onGetPageUrlFromPageNo', this._onGetPageUrlFromPageNo, [pageNo, this])
    }

    /**
     * @param {number} pageNo
     * @return {JQuery}
     */
    getPaginationElementForPageNo (pageNo)
    {
        return Utilities.callEventHandlerOrFail('onGetPaginationElementForPageNo', this._onGetPaginationElementForPageNo, [pageNo, this])
    }

    getPaginatedPageNo ()
    {
        return this._paginatedPageNo
    }

    getPaginationWrapper ()
    {
        return this._paginationWrapper
    }

    initialize ()
    {
        this._currentPageNo = this.getPageNoFromUrl(window.location.href)
        this._lastPageNo = this.getPageNoFromUrl(this._lastPageUrl)
        this._paginatedPageNo = this._currentPageNo
        this._sandbox = $('<div id="brazen-paginator-sandbox" hidden/>').appendTo('body')
        this._targetElement = $(this._listSelector + ':first')
        return this
    }

    /**
     * @param {PaginatorAfterPaginationEventHandler} handler
     * @return {this}
     */
    onAfterPagination (handler)
    {
        this._onAfterPagination = handler
        return this
    }

    /**
     * @param {PaginatorGetPageNoFromUrlHandler} handler
     * @return {this}
     */
    onGetPageNoFromUrl (handler)
    {
        this._onGetPageNoFromUrl = handler
        return this
    }

    /**
     * @param {PaginatorGetPageUrlFromPageNoHandler} handler
     * @return {this}
     */
    onGetPageUrlFromPageNo (handler)
    {
        this._onGetPageUrlFromPageNo = handler
        return this
    }

    /**
     * @param {PaginatorGetPaginationElementForPageNoHandler} handler
     * @return {this}
     */
    onGetPaginationElementForPageNo (handler)
    {
        this._onGetPaginationElementForPageNo = handler
        return this
    }

    run (threshold, limit)
    {
        if (this._paginationWrapper.length && threshold) {
            this._loadAndParseNextPage(threshold, limit)
        }
        return this
    }
}

class BrazenSubscriptionsLoader
{
    /**
     * @callback SubscriptionLoaderGetPageCountCallback
     * @param {JQuery} page
     * @return {number}
     */

    /**
     * @callback SubscriptionLoaderGetPageUrlCallback
     * @param {string} baseUrl
     * @param {number} pageNo
     * @return {string}
     */

    /**
     * @callback SubscriptionLoaderProgressReportingCallback
     * @param {string} status
     */

    /**
     * @callback SubscriptionLoaderSubscriptionsGatheredCallback
     * @param {string[]} subscriptions
     */

    /**
     *
     */
    constructor ()
    {
        /**
         * @type {string}
         */
        this.baseUrl = ''

        /**
         * @type {SubscriptionLoaderGetPageCountCallback}
         */
        this.getPageCount = null

        /**
         * @type {SubscriptionLoaderGetPageUrlCallback}
         */
        this.getPageUrl = null

        /**
         * @type {SubscriptionLoaderProgressReportingCallback}
         */
        this.onProgressUpdate = null

        /**
         * @type {SubscriptionLoaderSubscriptionsGatheredCallback}
         */
        this.onSubscriptionsGathered = null

        /**
         * @type {JQuery.Selector}
         */
        this.subscriptionNameSelector = ''

        /**
         * @type {JQuery.Selector}
         */
        this.subsectionSelector = ''

        /**
         * @type {JQuery}
         * @private
         */
        this._sandbox = null

        /**
         * @type {*[]}
         * @private
         */
        this._subscriptions = []
    }

    /**
     * Loads and records subscriptions by page
     * @param {number} maxPage
     * @param {number} pageNo
     * @private
     */
    _loadSubscriptionsPage (pageNo, maxPage)
    {
        this._sandbox.empty().load(this.getPageUrl(this.baseUrl, pageNo), () => {
            this._sandbox.find(this.subscriptionNameSelector).each((index, element) => {
                this._subscriptions.push($(element).text().trim())
					console.log($(element).text().trim())
                    test = test +'\n' +$(element).text().trim()
            })
            this.onProgressUpdate('Gathering subscriptions - ' + Math.ceil(((pageNo / maxPage) * 100)) + '% Complete')
            pageNo++
            if (pageNo <= maxPage) {
                this._loadSubscriptionsPage(pageNo, maxPage)
            } else {
                saveData(test, "file.txt");
                this._sandbox.remove()
                this.onProgressUpdate('Loaded '+ this._subscriptions.length +' subscriptions.')
                this.onSubscriptionsGathered(this._subscriptions)
                this._subscriptions = []
            }
        })
    }

    run ()
    {
        this.onProgressUpdate('Gathering subscriptions - 0% Complete')
        this._sandbox = $('<div>').appendTo('body')
        this._sandbox.load(this.baseUrl + ' ' + this.subsectionSelector, () => {
            this._loadSubscriptionsPage(1, Math.ceil(this.getPageCount(this._sandbox) / 100))
        })
    }
}

class BrazenBaseSearchEnhancer
{
    /**
     * @typedef {{configKey: string, validate: SearchEnhancerFilterValidationCallback, comply: SearchEnhancerFilterComplianceCallback}} ComplianceFilter
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
     * @return BrazenBaseSearchEnhancer
     */
    static initialize ()
    {
        BrazenBaseSearchEnhancer.throwOverrideError()
    }

    static throwOverrideError ()
    {
        throw new Error('Method must be overridden.')
    }

    /**
     * @param {string} scriptPrefix
     * @param {string} itemSelectors
     * @param {boolean} isUserLoggedIn
     */
    constructor (scriptPrefix, itemSelectors, isUserLoggedIn)
    {
        /**
         * Array of item compliance filters ordered in intended sequence of execution
         * @type {ComplianceFilter[]}
         * @protected
         */
        this._complianceFilters = []

        /**
         * @type {boolean}
         * @protected
         */
        this._isUserLoggedIn = isUserLoggedIn

        /**
         * @type {string}
         * @protected
         */
        this._itemClassesSelector = itemSelectors

        /**
         * Pagination manager
         * @type BrazenPaginator|null
         * @protected
         */
        this._paginator = null

        /**
         * @type {string}
         * @protected
         */
        this._scriptPrefix = scriptPrefix

        /**
         * @type {StatisticsRecorder}
         * @protected
         */
        this._statistics = new StatisticsRecorder(this._scriptPrefix)

        /**
         * @type {BrazenUIGenerator}
         * @protected
         */
        this._uiGen = new BrazenUIGenerator(this._scriptPrefix)

        /**
         * Local storage store with defaults
         * @type {BrazenConfigurationManager}
         * @protected
         */
        this._configurationManager = BrazenConfigurationManager.create(this._uiGen).
            addFlagField(OPTION_DISABLE_COMPLIANCE_VALIDATION, 'Disables all search filters.').
            addFlagField(OPTION_ALWAYS_SHOW_SETTINGS_PANE, 'Always show configuration interface.')
//            onExternalConfigurationChange((manager) => {
//
//            })

        /**
         * @type {BrazenSubscriptionsLoader}
         * @protected
         */
        this._subscriptionsLoader = new BrazenSubscriptionsLoader(this._uiGen)

        // Events

        /**
         * Operations to perform after script initialization
         * @type {Function}
         * @protected
         */
        this._onAfterInitialization = null

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
         * Operations to perform after compliance checks, the first time a item is retrieved
         * @type {Function}
         * @param {JQuery} item
         * @protected
         */
        this._onFirstHitAfterCompliance = null

        /**
         * Operations to perform before compliance checks, the first time a item is retrieved
         * @type {Function}
         * @param {JQuery} item
         * @protected
         */
        this._onFirstHitBeforeCompliance = null

        /**
         * Get item lists from the page
         * @type {Function}
         * @protected
         */
        this._onGetItemLists = null

        /**
         * Get item name from its node
         * @type {Function}
         * @param {JQuery} item
         * @protected
         */
        this._onGetItemName = null

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
         * Load user account subscriptions
         * @type {Function}
         * @param {JQuery} sandbox
         * @private
         */
        this._onLoadSubscriptions = null

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
     * @param {string} configKey
     * @param {SearchEnhancerFilterValidationCallback|null} validationCallback
     * @param {SearchEnhancerFilterComplianceCallback} complianceCallback
     * @protected
     */
    _addItemComplexComplianceFilter (configKey, validationCallback, complianceCallback)
    {
        this._addItemComplianceFilter(configKey, complianceCallback, validationCallback)
    }

    /**
     * @param {string} configKey
     * @param {SearchEnhancerFilterComplianceCallback} complianceCallback
     * @param {SearchEnhancerFilterValidationCallback|null} validationCallback
     * @protected
     */
    _addItemComplianceFilter (configKey, complianceCallback, validationCallback = null)
    {
        if (validationCallback === null) {
            switch (this._configurationManager.getField(configKey).type) {
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
                    throw new Error('The config type associated requires a validation callback to be defined explicitly.')
            }
        }
        this._complianceFilters.push({
            configKey: configKey,
            validate: validationCallback,
            comply: complianceCallback,
        })
    }

    /**
     * @param {string} helpText
     * @protected
     */
    _addItemBlacklistFilter (helpText)
    {
        this._configurationManager.addRulesetField(
            FILTER_TEXT_BLACKLIST, 3, helpText, null, null, (rules) => Utilities.buildWholeWordMatchingRegex(rules) ?? '')
        this._addItemComplexComplianceFilter(
            FILTER_TEXT_BLACKLIST, (value) => value !== '', (item, value) => item[0][ITEM_NAME_DOM_KEY].match(value) === null,
        )
    }

    /**
     * @param {JQuery.Selector} durationNodeSelector
     * @param {string|null} helpText
     * @protected
     */
    _addItemDurationRangeFilter (durationNodeSelector, helpText = null)
    {
        this._configurationManager.addRangeField(FILTER_DURATION_RANGE, 0, 100000, helpText ?? 'Filter items by duration.')
        this._addItemComplianceFilter(FILTER_DURATION_RANGE, (item, range) => {
            let duration = 0
            let durationNode = item.find(durationNodeSelector)
            if (durationNode.length) {
                duration = durationNode.text().split(':')
                duration = (parseInt(duration[0]) * 60) + parseInt(duration[1])
            }
            return duration === 0 ? !durationNode.length : Validator.isInRange(duration, range.minimum, range.maximum)
        })
    }

    /**
     * @param {JQuery.Selector} ratingNodeSelector
     * @param {string|null} helpText
     * @param {string|null} unratedHelpText
     * @protected
     */
    _addItemPercentageRatingRangeFilter (ratingNodeSelector, helpText = null, unratedHelpText = null)
    {
        this._configurationManager.
            addRangeField(FILTER_PERCENTAGE_RATING_RANGE, 0, 100000, helpText ?? 'Filter items by percentage rating.').
            addFlagField(FILTER_UNRATED, unratedHelpText ?? 'Hide items with zero or no rating.')

        this._addItemComplianceFilter(FILTER_PERCENTAGE_RATING_RANGE, (item, range) => {
            let rating = item.find(ratingNodeSelector)
            rating = rating.length === 0 ? 0 : parseInt(rating.text().replace('%', ''))

            return rating === 0 ? !this._configurationManager.getValue(FILTER_UNRATED) : Validator.isInRange(rating, range.minimum, range.maximum)
        })
    }

    /**
     * @param {string} helpText
     * @protected
     */
    _addItemTextSanitizationFilter (helpText)
    {
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
    _addItemTextSearchFilter (helpText = null)
    {
        this._configurationManager.addTextField(FILTER_TEXT_SEARCH, helpText ?? 'Show videos with these comma separated words in their names.')
        this._addItemComplianceFilter(FILTER_TEXT_SEARCH, (item, value) => item[0][ITEM_NAME_DOM_KEY].includes(value))
    }

    // /**
    //  * @protected
    //  */
    // _addItemCustomWatchedFilters ()
    // {
    //     this._configurationManager.
    //         addFlagField(FILTER_VIEWED_VIDEOS, 'Tracks and hides all items present on opened pages on next page load. Should be purged regularly.').
    //         addFlagField(FILTER_WATCHED_VIDEOS, 'Tracks and hides 3,000 recent seen items.').
    //         addTextField(STORE_VIEWED_ADDRESSES, '').
    //         addTextField(STORE_WATCHED_ADDRESSES, '')
    // }

    /**
     * @param {string} helpText
     * @protected
     */
    _addItemWhitelistFilter (helpText)
    {
        this._configurationManager.addRulesetField(
            FILTER_TEXT_WHITELIST, 3, helpText, null, null, (rules) => Utilities.buildWholeWordMatchingRegex(rules))
    }

    _addPaginationConfiguration ()
    {
        this._configurationManager.
            addNumberField(CONFIG_PAGINATOR_LIMIT, 1, 50, 'Limit paginator to concatenate the specified number of maximum pages.').
            addNumberField(CONFIG_PAGINATOR_THRESHOLD, 1, 1000, 'Make paginator ensure the specified number of minimum results.')
    }

    /**
     * @param {{}} options
     * @param {{}} options.filter
     * @param {SubscriptionsFilterExclusionsCallback} options.filter.exclusionsCallback Add page exclusions here
     * @param {SubscriptionsFilterUsernameCallback} options.filter.getItemUsername Return username of the item or return false to skip
     * @param {{}} options.loader
     * @param {JQuery.Selector} options.loader.subscriptionNameSelector
     * @param {string} options.loader.subscriptionsPageUrl
     * @param {JQuery.Selector} options.loader.subsectionSelector
     * @param {SubscriptionLoaderGetPageCountCallback} options.loader.getPageCount
     * @param {SubscriptionLoaderGetPageUrlCallback} options.loader.getPageUrl
     * @protected
     */
    _addSubscriptionsFilter (options)
    {
        this._configurationManager.
            addFlagField(FILTER_SUBSCRIBED_VIDEOS, 'Hide videos from subscribed channels.').
            addTextField(STORE_SUBSCRIPTIONS, 'Recorded subscription accounts.')

        this._subscriptionsLoader.baseUrl = options.loader.subscriptionsPageUrl
        this._subscriptionsLoader.getPageCount = options.loader.getPageCount
        this._subscriptionsLoader.getPageUrl = options.loader.getPageUrl
        this._subscriptionsLoader.onSubscriptionsGathered = (subscriptions) => {
            this._configurationManager.getField(STORE_SUBSCRIPTIONS).value = subscriptions.length ? '"' + subscriptions.join('""') + '"' : ''
            this._configurationManager.save()
            $('#subscriptions-loader').prop('disabled', false)
        }
        this._subscriptionsLoader.onProgressUpdate = (status) => this._uiGen.updateStatus(status)
        this._subscriptionsLoader.subscriptionNameSelector = options.loader.subscriptionNameSelector
        this._subscriptionsLoader.subsectionSelector = options.loader.subsectionSelector

        this._addItemComplexComplianceFilter(
            FILTER_SUBSCRIBED_VIDEOS,
            (value) => value && this._isUserLoggedIn && options.filter.exclusionsCallback(),
            (item) => {
                let username = options.filter.getItemUsername(item)
                return username === false ? true : !(new RegExp('"([^"]*' + username + '[^"]*)"')).test(this._configurationManager.getValue(STORE_SUBSCRIPTIONS))
            })
    }

    /**
     * Filters items as per settings
     * @param {JQuery} itemsList
     * @param {boolean} fromObserver
     * @protected
     */
    _complyItemsList (itemsList, fromObserver = false)
    {
        let items = fromObserver ? itemsList.filter(this._itemClassesSelector) : itemsList.find(this._itemClassesSelector)
        items.each((index, element) => {
            let item = $(element)

            // Before compliance filtering

            if (typeof element[ITEM_PROCESSED_ONCE_DOM_KEY] === 'undefined') {
                element[ITEM_PROCESSED_ONCE_DOM_KEY] = false
                Utilities.callEventHandler(this._onFirstHitBeforeCompliance, [item])
                element[ITEM_NAME_DOM_KEY] = Utilities.callEventHandlerOrFail('getItemName', this._onGetItemName, [item])
            }

            // Compliance filtering

            let itemComplies = true

            if (!this._configurationManager.getValue(OPTION_DISABLE_COMPLIANCE_VALIDATION) &&
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

            // After compliance filtering

            if (!element[ITEM_PROCESSED_ONCE_DOM_KEY]) {
                Utilities.callEventHandler(this._onFirstHitAfterCompliance, [item])
                element[ITEM_PROCESSED_ONCE_DOM_KEY] = true
            }
        })
        this._statistics.updateUI()
    }

    /**
     * @protected
     * @return {JQuery[]}
     */
    _createPaginationControls ()
    {
        return [this._configurationManager.createElement(CONFIG_PAGINATOR_THRESHOLD), this._configurationManager.createElement(CONFIG_PAGINATOR_LIMIT)]
    }

    /**
     * @protected
     * @return {JQuery}
     */
    _createSettingsFormActions ()
    {
        return this._uiGen.createFormSection().append([
            this._uiGen.createFormActions([
                this._uiGen.createFormButton('Ap', 'Apply settings.', () => this._onApplyNewSettings()),
                this._uiGen.createFormButton('Sav', 'Apply and update saved configuration.', () => this._onSaveSettings()),
                this._uiGen.createFormButton('Res', 'Revert to saved configuration.', () => this._onResetSettings()),
            ]),
        ])
    }

    /**
     * @protected
     * @return {JQuery}
     */
    _createSettingsBackupRestoreFormActions ()
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
    _createSubscriptionLoaderControls ()
    {
        let button = this._uiGen.createFormButton('Load Subscriptions', 'Makes a copy of your subscriptions in cache for related filters.', (event) => {
            if (this._isUserLoggedIn) {
                $(event.currentTarget).prop('disabled', true)

                this._subscriptionsLoader.run()
            } else {
                this._showNotLoggedInAlert()
            }
        })
        return button.attr('id', 'subscriptions-loader')
    }

    /**
     * @param {JQuery} UISection
     * @private
     */
    _embedUI (UISection)
    {
        UISection.on('mouseleave', (event) => {
            if (!this._configurationManager.getValue(OPTION_ALWAYS_SHOW_SETTINGS_PANE)) {
                $(event.currentTarget).hide(300)
            }
        })
        if (this._configurationManager.getValue(OPTION_ALWAYS_SHOW_SETTINGS_PANE)) {
            UISection.show()
        }
        this._uiGen.constructor.appendToBody(UISection)
        this._uiGen.constructor.appendToBody(this._uiGen.createSettingsShowButton('', UISection))
    }

    /**
     * @private
     */
    _onApplyNewSettings ()
    {
        this._configurationManager.update()
        this._validateCompliance()
    }

    /**
     * @private
     */
    _onBackupSettings ()
    {
        navigator.clipboard.writeText(this._configurationManager.backup()).
            then(() => this._uiGen.updateStatus('Settings backed up to clipboard!')).
            catch(() => this._uiGen.updateStatus('Settings backup failed!'))
    }

    /**
     * @private
     */
    _onResetSettings ()
    {
        this._configurationManager.revertChanges()
        this._validateCompliance()
    }

    /**
     * @private
     */
    _onRestoreSettings ()
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
    _onSaveSettings ()
    {
        this._onApplyNewSettings()
        this._configurationManager.save()
    }

    /**
     * @protected
     */
    _showNotLoggedInAlert ()
    {
        alert('You need to be logged in to use this functionality')
    }

    /**
     * @param {boolean} firstRun
     * @protected
     */
    _validateCompliance (firstRun = false)
    {
        let itemLists = Utilities.callEventHandler(this._onGetItemLists)
        if (!firstRun) {
            this._statistics.reset()
            itemLists.each((index, itemsList) => {
                this._complyItemsList($(itemsList))
            })
        } else {
            itemLists.each((index, itemList) => {
                let itemListObject = $(itemList)

                if (this._paginator && itemListObject.is(this._paginator.getListSelector())) {
                    ChildObserver.create().onNodesAdded((itemsAdded) => {
                        this._complyItemsList($(itemsAdded), true)
                        this._paginator.run(this._configurationManager.getValue(CONFIG_PAGINATOR_THRESHOLD), this._configurationManager.getValue(CONFIG_PAGINATOR_LIMIT))
                    }).observe(itemList)
                } else {
                    ChildObserver.create().onNodesAdded((itemsAdded) => this._complyItemsList($(itemsAdded), true)).observe(itemList)
                }

                this._complyItemsList(itemListObject)
            })
        }
        if (this._paginator) {
            this._paginator.run(this._configurationManager.getValue(CONFIG_PAGINATOR_THRESHOLD), this._configurationManager.getValue(CONFIG_PAGINATOR_LIMIT))
        }
    }

    /**
     * @param {JQuery} item
     * @return {boolean}
     * @protected
     */
    _validateItemWhiteList (item)
    {
        let field = this._configurationManager.getField(FILTER_TEXT_WHITELIST)
        if (field) {
            let validationResult = field.value.length ? Validator.regexMatches(item[0][ITEM_NAME_DOM_KEY], field.optimized) : true
            this._statistics.record(FILTER_TEXT_WHITELIST, validationResult)
            return validationResult
        }
        return true
    }

    /**
     * Initialize the script and do basic UI removals
     */
    init ()
    {
        if (Utilities.callEventHandler(this._onValidateInit)) {

            this._configurationManager.initialize(this._scriptPrefix)

            if (this._paginator) {
                this._paginator.initialize()
            }

            Utilities.callEventHandler(this._onBeforeUIBuild)
            this._embedUI(Utilities.callEventHandler(this._onUIBuild))
            Utilities.callEventHandler(this._onAfterUIBuild)

            this._configurationManager.updateInterface()

            this._validateCompliance(true)

            this._uiGen.updateStatus('Initialized')

            Utilities.callEventHandler(this._onAfterInitialization)
        }
    }
}