// ==UserScript==
// @name         Brazen Subscriptions Loader
// @namespace    brazenvoid
// @version      1.0.1
// @author       brazenvoid 
// @license      GPL-3.0-only
// @description  Helper class for loading account subscriptions
// ==/UserScript==
var test = '';
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
     * @typedef {{url: string, getPageCount: SubscriptionLoaderGetPageCountCallback, getPageUrl: SubscriptionLoaderGetPageUrlCallback,
     *            subscriptionNameSelector: string, subscriptionsCountSelector: string}} SubscriptionLoaderConfig
     */

    /**
     * @param {SubscriptionLoaderProgressReportingCallback} onProgressUpdate
     * @param {SubscriptionLoaderSubscriptionsGatheredCallback} onSubscriptionsGathered
     */
    constructor (onProgressUpdate, onSubscriptionsGathered)
    {
        /**
         * @type {number}
         * @private
         */
        this._configIterator = 0

        /**
         * @type {SubscriptionLoaderConfig[]}
         * @private
         */
        this._configs = []

        /**
         * @type {SubscriptionLoaderProgressReportingCallback}
         * @private
         */
        this._onProgressUpdate = onProgressUpdate

        /**
         * @type {SubscriptionLoaderSubscriptionsGatheredCallback}
         * @private
         */
        this._onSubscriptionsGathered = onSubscriptionsGathered

        /**
         * @type {JQuery}
         * @private
         */
        this._sandbox = null

        /**
         * @type {SubscriptionLoaderConfig}
         * @private
         */
        this._selectedConfig = {}

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
        this._sandbox.empty().load(this._selectedConfig.getPageUrl(this._selectedConfig.url, pageNo), () => {
            this._sandbox.find(this._selectedConfig.subscriptionNameSelector).each((index, element) => {
                this._subscriptions.push($(element).text().trim())
                console.log($(element).text().trim())
                test = test +'\n' +$(element).text().trim()
            })
            this._onProgressUpdate('Gathering subscriptions - ' + Math.ceil(((pageNo / maxPage) * 100)) + '% Complete')
            pageNo++
            if (pageNo <= maxPage) {
                this._loadSubscriptionsPage(pageNo, maxPage)
            } else {
                this._configIterator++
                if (this._configIterator < this._configs.length) {
                    this._processSubscriptions()
                } else {
                saveData(test, "file.txt");
                    this._sandbox.remove()
                    this._onProgressUpdate('Loaded ' + this._subscriptions.length + ' subscriptions.')
                    this._onSubscriptionsGathered(this._subscriptions)
                    this._configIterator = 0
                    this._subscriptions = []
                }
            }
        })
    }

    /**
     * @private
     */
    _processSubscriptions ()
    {
        this._selectedConfig = this._configs[this._configIterator]
        this._sandbox.empty().load(this._selectedConfig.url + ' ' + this._selectedConfig.subscriptionsCountSelector, () => {
            this._loadSubscriptionsPage(1, Math.ceil(this._selectedConfig.getPageCount(this._sandbox)))
        })
    }

    /**
     * @param {SubscriptionLoaderConfig} config
     * @returns {BrazenSubscriptionsLoader}
     */
    addConfig (config)
    {
        this._configs.push(config)
        return this
    }

    run ()
    {
        this._onProgressUpdate('Gathering subscriptions - 0% Complete')
        this._sandbox = $('<div id="brazen-subscriptions-loader-sandbox" hidden/>').appendTo('body')
        this._processSubscriptions()
    }
}