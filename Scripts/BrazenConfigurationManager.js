// ==UserScript==
// @name         Brazen Configuration Manager
// @namespace    brazenvoid
// @version      1.2.0
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Configuration management and related UI creation module
// ==/UserScript==

const CONFIG_TYPE_CHECKBOXES_GROUP = 'checkboxes'
const CONFIG_TYPE_FLAG = 'flag'
const CONFIG_TYPE_NUMBER = 'number'
const CONFIG_TYPE_RADIOS_GROUP = 'radios'
const CONFIG_TYPE_RANGE = 'range'
const CONFIG_TYPE_RULESET = 'ruleset'
const CONFIG_TYPE_SELECT = 'select'
const CONFIG_TYPE_TEXT = 'text'

class BrazenConfigurationManager
{
    /**
     * @typedef {{title: string, type: string, element: null|JQuery, value: *, maximum: int, minimum: int, options: string[], helpText: string, onFormatForUI:
     *     ConfigurationManagerRulesetCallback, onTranslateFromUI: ConfigurationManagerRulesetCallback, onOptimize: ConfigurationManagerRulesetCallback, createElement: Function,
     *     setFromUserInterface: Function, updateUserInterface: Function}} ConfigurationField
     */

    /**
     * @callback ConfigurationManagerRulesetCallback
     * @param {*} values
     */

    /**
     * @param {BrazenUIGenerator} uiGenerator
     * @return {BrazenConfigurationManager}
     */
    static create (uiGenerator)
    {
        return new BrazenConfigurationManager(uiGenerator)
    }

    constructor (uiGenerator)
    {
        /**
         * @type {{}}
         * @private
         */
        this._config = {}

        /**
         * @type {LocalStore}
         * @private
         */
        this._localStore = null

        /**
         * @type BrazenUIGenerator
         * @private
         */
        this._uiGen = uiGenerator
    }

    /**
     * @param {string} type
     * @param {string} name
     * @param {*} value
     * @param {string|null} helpText
     * @return ConfigurationField
     * @private
     */
    _createField (type, name, value, helpText)
    {
        let fieldKey = this._formatFieldKey(name)
        let field = this._config[fieldKey]
        if (!field) {
            field = {
                element: null,
                helpText: helpText,
                title: name,
                type: type,
                value: value,
                createElement: null,
                setFromUserInterface: null,
                updateUserInterface: null,
            }
            this._config[fieldKey] = field
        } else {
            if (helpText) {
                field.helpText = helpText
            }
            field.value = value
        }
        return field
    }

    _formatFieldKey (name)
    {
        return Utilities.toKebabCase(name)
    }

    /**
     * @param {boolean} ignoreIfDefaultsSet
     * @private
     */
    _syncLocalStore (ignoreIfDefaultsSet)
    {
        let field
        let storeObject = this._localStore.get()

        if (!ignoreIfDefaultsSet || !this._localStore.wereDefaultsSet()) {
            for (let key in this._config) {

                field = this._config[key]
                if (typeof storeObject[key] !== 'undefined') {

                    field.value = storeObject[key]
                    if (field.type === CONFIG_TYPE_RULESET) {
                        field.optimized = Utilities.callEventHandler(field.onOptimize, [field.value])
                    }
                }
            }
            this.updateInterface()
        }
        return this
    }

    /**
     * @return {{}}
     * @private
     */
    _toStoreObject ()
    {
        let storeObject = {}
        for (let key in this._config) {
            storeObject[key] = this._config[key].value
        }
        return storeObject
    }

    backup ()
    {
        return Utilities.objectToJSON(this._toStoreObject())
    }

    createElement (name)
    {
        return this.getFieldOrFail(name).createElement()
    }

    initialize (scriptPrefix)
    {
        this._localStore = new LocalStore(scriptPrefix + 'settings', this._toStoreObject())
        this._localStore.onChange(() => this.updateInterface())

        return this._syncLocalStore(true)
    }

    addCheckboxesGroup (name, keyValuePairs, helpText)
    {
        let field = this._createField(CONFIG_TYPE_CHECKBOXES_GROUP, name, [], helpText)

        field.options = keyValuePairs

        field.createElement = () => {
            return field.element = this._uiGen.createFormCheckBoxesGroupSection(field.title, field.options, field.helpText)
        }
        field.setFromUserInterface = () => {
            field.value = []
            field.element.find('input:checked').each((index, element) => {
                field.value.push($(element).attr('data-value'))
            })
        }
        field.updateUserInterface = () => {
            let elements = field.element.find('input')
            for (let key of field.value) {
                elements.filter('[data-value="' + key + '"]').prop('checked', true)
            }
        }
        return this
    }

    addFlagField (name, helpText)
    {
        let field = this._createField(CONFIG_TYPE_FLAG, name, false, helpText)

        field.createElement = () => {
            let inputGroup = this._uiGen.createFormInputGroup(field.title, 'checkbox', field.helpText)
            field.element = inputGroup.find('input')
            return inputGroup
        }
        field.setFromUserInterface = () => {
            field.value = field.element.prop('checked')
        }
        field.updateUserInterface = () => {
            field.element.prop('checked', field.value)
        }
        return this
    }

    addNumberField (name, minimum, maximum, helpText)
    {
        let field = this._createField(CONFIG_TYPE_NUMBER, name, minimum, helpText)

        field.minimum = minimum
        field.maximum = maximum

        field.createElement = () => {
            let inputGroup = this._uiGen.createFormInputGroup(field.title, 'number', field.helpText).attr('min', field.minimum).attr('max', field.maximum)
            field.element = inputGroup.find('input')
            return inputGroup
        }
        field.setFromUserInterface = () => {
            field.value = parseInt(field.element.val())
        }
        field.updateUserInterface = () => {
            field.element.val(field.value)
        }
        return this
    }

    addRadiosGroup (name, keyValuePairs, helpText)
    {
        let field = this._createField(CONFIG_TYPE_RADIOS_GROUP, name, keyValuePairs[0][1], helpText)

        field.options = keyValuePairs

        field.createElement = () => {
            let inputGroup = this._uiGen.createFormRadiosGroupSection(field.title, field.options, field.helpText)
            field.element = inputGroup
            return inputGroup
        }
        field.setFromUserInterface = () => {
            field.value = field.element.find('input:checked').attr('data-value')
        }
        field.updateUserInterface = () => {
            field.element.find('input[data-value="' + field.value + '"]').prop('checked', true).trigger('change')
        }
        return this
    }

    addRangeField (name, minimum, maximum, helpText)
    {
        let field = this._createField(CONFIG_TYPE_RANGE, name, {minimum: minimum, maximum: minimum}, helpText)

        field.minimum = minimum
        field.maximum = maximum

        field.createElement = () => {
            let inputGroup = this._uiGen.createFormRangeInputGroup(field.title, 'number', field.minimum, field.maximum, field.helpText)
            field.element = inputGroup.find('input')
            return inputGroup
        }
        field.setFromUserInterface = () => {
            field.value = {
                minimum: field.element.first().val(),
                maximum: field.element.last().val(),
            }
        }
        field.updateUserInterface = () => {
            field.element.first().val(field.value.minimum)
            field.element.last().val(field.value.maximum)
        }
        return this
    }

    /**
     * @param {string} name
     * @param {number} rows
     * @param {string|null} helpText
     * @param {ConfigurationManagerRulesetCallback} onTranslateFromUI
     * @param {ConfigurationManagerRulesetCallback} onFormatForUI
     * @param {ConfigurationManagerRulesetCallback} onOptimize
     * @return {BrazenConfigurationManager}
     */
    addRulesetField (name, rows, helpText, onTranslateFromUI = null, onFormatForUI = null, onOptimize = null)
    {
        let field = this._createField(CONFIG_TYPE_RULESET, name, [], helpText)

        field.optimized = null
        field.onTranslateFromUI = onTranslateFromUI ?? field.onTranslateFromUI
        field.onFormatForUI = onFormatForUI ?? field.onFormatForUI
        field.onOptimize = onOptimize ?? field.onOptimize

        field.createElement = () => {
            let inputGroup = this._uiGen.createFormTextAreaGroup(field.title, rows, field.helpText)
            field.element = inputGroup.find('textarea')
            return inputGroup
        }
        field.setFromUserInterface = () => {
            let value = Utilities.trimAndKeepNonEmptyStrings(field.element.val().split(REGEX_LINE_BREAK))
            field.value = Utilities.callEventHandler(field.onTranslateFromUI, [value], value)
            field.optimized = Utilities.callEventHandler(field.onOptimize, [field.value])
        }
        field.updateUserInterface = () => {
            field.element.val(Utilities.callEventHandler(field.onFormatForUI, [field.value], field.value).join('\n'))
        }
        return this
    }
    
    addSelectField (name, keyValuePairs, helpText)
    {
        let field = this._createField(CONFIG_TYPE_SELECT, name, keyValuePairs[0][1], helpText)

        field.options = keyValuePairs

        field.createElement = () => {
            let inputGroup = this._uiGen.createFormSelectGroup(field.title, field.options, field.helpText)
            field.element = inputGroup.find('select')
            return inputGroup
        }
        field.setFromUserInterface = () => {
            field.value = field.element.val()
        }
        field.updateUserInterface = () => {
            field.element.val(field.value).trigger('change')
        }
        return this
    }

    addTextField (name, helpText)
    {
        let field = this._createField(CONFIG_TYPE_TEXT, name, '', helpText)

        field.createElement = () => {
            let inputGroup = this._uiGen.createFormInputGroup(field.title, 'text', field.helpText)
            field.element = inputGroup.find('input')
            return inputGroup
        }
        field.setFromUserInterface = () => {
            field.value = field.element.val()
        }
        field.updateUserInterface = () => {
            field.element.val(field.value)
        }
        return this
    }

    /**
     * @param {string} name
     * @return {ConfigurationField|null}
     */
    getField (name)
    {
        return this._config[this._formatFieldKey(name)]
    }

    /**
     * @param {string} name
     * @return {ConfigurationField}
     */
    getFieldOrFail (name)
    {
        let field = this._config[this._formatFieldKey(name)]
        if (field) {
            return field
        }
        throw new Error('Field named "' + name + '" could not be found')
    }

    getValue (name)
    {
        return this.getFieldOrFail(name).value
    }

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasField (name)
    {
        return typeof this.getField(name) !== 'undefined'
    }

    /**
     * @param {string} backedUpConfiguration
     */
    restore (backedUpConfiguration)
    {
        this._localStore.save(Utilities.objectFromJSON(backedUpConfiguration))
        this._syncLocalStore(false)
        return this
    }

    revertChanges ()
    {
        return this._syncLocalStore(false)
    }

    save ()
    {
        this.update()._localStore.save(this._toStoreObject())
        return this
    }

    update ()
    {
        let field
        for (let fieldName in this._config) {
            field = this._config[fieldName]
            if (field.element) {
                field.setFromUserInterface()
            }
        }
        return this
    }

    updateInterface ()
    {
        let field
        for (let fieldName in this._config) {
            field = this._config[fieldName]
            if (field.element) {
                field.updateUserInterface()
            }
        }
        return this
    }
}