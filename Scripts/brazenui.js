// ==UserScript==
// @name         Brazen UI Generator
// @namespace    brazenvoid
// @version      1.2.5
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Helper methods to generate a control panel UI for scripts
// @grant        GM_addStyle
// ==/UserScript==

/**
 * @function GM_addStyle
 * @param {string} style
 */
GM_addStyle(
    `@keyframes fadeEffect {
	from {
		opacity: 0
	}
	to {
		opacity: 1
	}
}

.bg-brand {
	background-color: #ffa31a
}

.border-primary {
	border: 1px solid #000
}

.font-primary {
	color: #000
}

.font-secondary {
	color: #fff
}

button.form-button {
	color:black;
	background-color: revert;
	padding: 0 5px;
	width: 100%
}

button.show-settings {
	border: 0;
	font-size: .7rem;
	height: 50vh;
	left: 0;
	margin: 0;
	padding: 0;
	position: fixed;
	top: 5vh;
	width: .2vw;
	writing-mode: sideways-lr;
	z-index: 999
}

button.tab-button {
	background-color: inherit;
	border-bottom: 0;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
	cursor: pointer;
	float: left;
	outline: none;
	padding: 5px 10px;
	transition: .3s
}

button.tab-button:hover {
	background-color: #fff
}

button.tab-button.active {
	background-color: #fff;
	display: block
}

div.form-actions {
	text-align: center
}

div.form-actions button.form-button {
	padding: 0 5px;
	width: auto
}

div.form-actions-wrapper {
	display: inline-flex
}

div.form-actions-wrapper>div.form-group+* {
	margin-left: 15px
}

div.form-actions-wrapper.single-column-layout {
	flex-direction: column;
	width: 100%
}

div.form-actions-wrapper.single-column-layout input {
	width: 100%
}

div.form-actions-wrapper.single-column-layout *+* {
	margin-top: 5px
}

div.form-group {
	align-items: center;
	display: flex;
	min-height: 20px;
	padding: 1px 0
}

div.form-group.form-stat-group {
	padding: 2px 0
}

div.form-group.form-textarea-group {
	align-items: unset;
	display: block
}

div.form-group.form-range-input-group>input {
	padding: 0 5px;
	width: 20px
}

div.form-group.form-range-input-group>input+input {
	margin-left: 2px
}

div.form-section>label.title {
	text-align: center
}

div.form-section button+button {
	margin-left: 5px
}

div.form-section label.title {
	display: block;
	height: 20px;
	width: 100%
}

div.tab-panel {
	animation: fadeEffect 1s;
	display: none;
	padding: 5px 10px;
	max-height: 70vh;
	overflow: auto
}

div.tab-panel.active {
	display: block
}

div.tabs-nav {
	overflow: hidden
}

div.tabs-section {
	margin-bottom: 5px
}

hr {
	margin: 3px
}

input.form-input {
	text-align: center
}

input.form-input.check-radio-input {
	margin-right: 5px
}

input.form-input.regular-input {
	width: 40px
}

label.form-label {
	flex-grow: 1
}

label.form-stat-label {
	padding: 2px 0
}

select.form-input {
	flex-grow: 1
}

section.form-section {
	font-size: 12px;
	font-weight: 700;
	position: fixed;
	left: 0;
	padding: 5px 10px;
	z-index: 1000
}

textarea.form-input {
	display: block;
	height: auto;
	position: relative;
	width: 98%
}`)

class BrazenUIGenerator
{
    /**
     * @param {JQuery} nodes
     */
    static appendToBody (nodes)
    {
        $('body').append(nodes)
    }

    /**
     * @param {string} selectorPrefix
     */
    constructor (selectorPrefix)
    {
        /**
         * @type {*}
         * @private
         */
        this._buttonBackroundColor = null

        /**
         * @type {JQuery}
         * @private
         */
        this._section = null

        /**
         * @type {SelectorGenerator}
         * @private
         */
        this._selectorGenerator = new SelectorGenerator(selectorPrefix)

        /**
         * @type {string}
         * @private
         */
        this._selectorPrefix = selectorPrefix

        /**
         * @type {JQuery}
         * @private
         */
        this._statusLine = null

        /**
         * @type {string}
         * @private
         */
        this._statusText = ''
    }

    /**
     * @param {JQuery} node
     * @param {string} text
     * @return {JQuery}
     * @private
     */
    _addHelpTextOnHover (node, text)
    {
        if (text !== '') {
            node.on('mouseover', () => this.updateStatus(text, true))
            node.on('mouseout', () => this.resetStatus())
        }
        return node
    }

    /**
     * @return {JQuery}
     */
    createBreakSeparator ()
    {
        return $('<br/>')
    }

    /**
     * @param {JQuery|JQuery[]} children
     * @param {string} wrapperClasses
     * @return {JQuery}
     */
    createFormActions (children, wrapperClasses = '')
    {
        return $('<div class="form-actions"/>').append($('<div class="form-actions-wrapper '+ wrapperClasses +'"/>').append(children))
    }

    /**
     * @param {string} caption
     * @param {JQuery.EventHandler} onClick
     * @param {string} hoverHelp
     * @return {JQuery}
     */
    createFormButton (caption, hoverHelp, onClick)
    {
        let button = $('<button class="form-button">').
            text(caption).
            on('click', onClick)
        if (this._buttonBackroundColor) {
            button.css('backgroundColor', this._buttonBackroundColor)
        }
        return this._addHelpTextOnHover(button, hoverHelp)
    }

    createFormCheckBoxesGroupSection (label, keyValuePairs, hoverHelp)
    {
        let section = this.createFormSection(label)
        for (let i = 0; i < keyValuePairs.length; i++) {
            section.append(
                this.createFormGroup().append([
                    this.createFormGroupLabel(keyValuePairs[i][0], 'checkbox'),
                    this.createFormGroupInput('checkbox').attr('data-value', keyValuePairs[i][1]),
                ]),
            )
        }
        return this._addHelpTextOnHover(section, hoverHelp)
    }

    /**
     * @return {JQuery}
     */
    createFormGroup ()
    {
        return $('<div class="form-group"/>')
    }

    /**
     * @param {string} id
     * @param {Array} keyValuePairs
     *
     * @return {JQuery}
     */
    createFormGroupDropdown (id, keyValuePairs)
    {
        let dropdown = $('<select>').attr('id', id).addClass('form-input')

        for (let i = 0; i < keyValuePairs.length; i++) {
            dropdown.append($('<option>').attr('value', keyValuePairs[i][0]).text(keyValuePairs[i][1]).prop('selected', (i === 0)))
        }
        return dropdown
    }

    /**
     * @param {string} type
     *
     * @return {JQuery}
     */
    createFormGroupInput (type)
    {
        let input = $('<input class="form-input">').attr('type', type)
        switch (type) {
            case 'number':
            case 'text':
                input.addClass('regular-input')
                break

            case 'radio':
            case 'checkbox':
                input.addClass('check-radio-input')
                break
        }
        return input
    }

    /**
     * @param {string} label
     * @param {string} inputType
     * @return {JQuery}
     */
    createFormGroupLabel (label, inputType = '')
    {
        let labelFormGroup = $('<label class="form-label">').text(label)
        if (inputType !== '') {
            switch (inputType) {
                case 'number':
                case 'text':
                    labelFormGroup.addClass('regular-input')
                    labelFormGroup.text(labelFormGroup.text() + ': ')
                    break
                case 'radio':
                case 'checkbox':
                    labelFormGroup.addClass('check-radio-input')
                    break
            }
        }
        return labelFormGroup
    }

    /**
     * @param {string} statisticType
     * @return {JQuery}
     */
    createFormGroupStatLabel (statisticType)
    {
        return $('<label class="form-stat-label">').
            attr('id', this._selectorGenerator.getStatLabelSelector(statisticType)).
            text('0')
    }

    /**
     * @param {string} label
     * @param {string} inputType
     * @param {string} hoverHelp
     * @return {JQuery}
     */
    createFormInputGroup (label, inputType, hoverHelp = '')
    {
        return this._addHelpTextOnHover(
            this.createFormGroup().append([
                this.createFormGroupLabel(label, inputType),
                this.createFormGroupInput(inputType),
            ]),
            hoverHelp,
        )
    }

    createFormRadiosGroupSection (label, keyValuePairs, hoverHelp)
    {
        let section = this.createFormSection(label)
        for (let i = 0; i < keyValuePairs.length; i++) {
            section.append(
                this.createFormGroup().append([
                    this.createFormGroupLabel(keyValuePairs[i][0], 'radio'),
                    this.createFormGroupInput('radio').prop('checked', i === 0).attr('data-value', keyValuePairs[i][1]).on('change', (event) => {
                        $(event.currentTarget).parents('.form-section').first().find('input').each((index, element) => {
                            if(!element.isSameNode(event.currentTarget)) {
                                $(element).prop('checked', false)
                            }
                        })
						var test = document.getElementsByClassName("form-button grrapp")[0]
						if(test){
							test.click();
						}
                    }),
                ]),
            )
        }
        return this._addHelpTextOnHover(section, hoverHelp)
    }

    /**
     * @param {string} label
     * @param {string} inputsType
     * @param {number} minimum
     * @param {number} maximum
     * @param {string} hoverHelp
     * @return {JQuery}
     */
    createFormRangeInputGroup (label, inputsType, minimum, maximum, hoverHelp)
    {
        return this._addHelpTextOnHover(
            this.createFormGroup().addClass('form-range-input-group').append([
                this.createFormGroupLabel(label, inputsType),
                this.createFormGroupInput(inputsType).attr('min', minimum).attr('max', maximum),
                this.createFormGroupInput(inputsType).attr('min', minimum).attr('max', maximum),
            ]),
            hoverHelp,
        )
    }

    /**
     * @param {string} title
     * @return {JQuery}
     */
    createFormSection (title = '')
    {
        let sectionDiv = $('<div class="form-section">')
        if (title !== '') {
            sectionDiv.append($('<label class="title">').text(title))
        }
        return sectionDiv
    }

    /**
     * @param {string} label
     * @param {int} rows
     * @param {string} hoverHelp
     * @return {JQuery}
     */
    createFormTextAreaGroup (label, rows, hoverHelp = '')
    {
        return this._addHelpTextOnHover(
            this.createFormGroup().addClass('form-textarea-group').append([
                this.createFormGroupLabel(label),
                $('<textarea class="form-input">').attr('rows', rows),
            ]),
            hoverHelp,
        )
    }

    /**
     * @return {JQuery}
     */
    createSection ()
    {
        this._section = $('<section class="form-section font-primary">')
        return this._section
    }

    /**
     * @return {JQuery}
     */
    createSeparator ()
    {
        return $('<hr/>')
    }

    /**
     * @return {JQuery}
     */
    createSettingsHideButton ()
    {
        return this.createFormButton('<< Hide', '', () => this._section.style.display = 'none')
    }

    /**
     * @return {JQuery}
     */
    createSettingsSection ()
    {
        return this.createSection().attr('id', 'settings-wrapper').addClass('bg-brand').hide()
    }

    /**
     * @param {string} caption
     * @param {JQuery} settingsSection
     *
     * @return {JQuery}
     */
    createSettingsShowButton (caption, settingsSection)
    {
        return $('<button class="show-settings bg-brand font-primary">').text(caption).on('click', () => settingsSection.toggle(300))
    }

    /**
     * @param {string} statisticsType
     * @param {string} label
     * @return {JQuery}
     */
    createStatisticsFormGroup (statisticsType, label = '')
    {
        return this.createFormGroup().addClass('form-stat-group').append([
            this.createFormGroupLabel((label === '' ? statisticsType : label) + ' Filter'),
            this.createFormGroupStatLabel(statisticsType),
        ])
    }

    /**
     * @return {JQuery}
     */
    createStatisticsTotalsGroup ()
    {
        return this.createFormGroup().append([
            this.createFormGroupLabel('Total'),
            this.createFormGroupStatLabel('Total'),
        ])
    }

    /**
     * @return {JQuery}
     */
    createStatusSection ()
    {
        this._statusLine = this.createFormGroupLabel('Status').attr('id', this._selectorGenerator.getSelector('status'))
        return this.createFormSection().append(this._statusLine)
    }

    /**
     * @param {string} tabName
     * @param {boolean} isFirst
     * @return {JQuery}
     */
    createTabButton (tabName, isFirst)
    {
        let tabButton = $('<button class="tab-button border-primary">').
            text(tabName).
            on('click', (event) => {
                let button = $(event.currentTarget)
                button.parents('.tabs-section:first').
                    find('.tab-button,.tab-panel').
                    removeClass('active font-secondary').
                    addClass('font-primary')
                button.removeClass('font-primary').addClass('active font-secondary')
                $('#' + Utilities.toKebabCase(button.text())).addClass('active')
            }).
            on('mouseenter', (event) => $(event.currentTarget).addClass('font-secondary')).
            on('mouseleave', (event) => $(event.currentTarget).removeClass('font-secondary'))

        return isFirst ? tabButton.addClass('active font-secondary') : tabButton.addClass('font-primary')
    }

    /**
     * @param {string} tabName
     * @param {boolean} isFirst
     * @return {JQuery}
     */
    createTabPanel (tabName, isFirst = false)
    {
        let tabPanel = $('<div class="tab-panel border-primary">').attr('id', Utilities.toKebabCase(tabName))
        if (isFirst) {
            tabPanel.addClass('active')
        }
        return tabPanel
    }

    /**
     * @param {string[]} tabNames
     * @param {JQuery[]} tabPanels
     * @return {JQuery}
     */
    createTabsSection (tabNames, tabPanels)
    {
        let tabButtons = []
        for (let i = 0; i < tabNames.length; i++) {
            tabButtons.push(this.createTabButton(tabNames[i], i === 0))
        }
        let nav = $('<div class="tabs-nav">').append(tabButtons)
        return $('<div class="tabs-section">').append(nav).append(...tabPanels)
    }

    /**
     * @return {JQuery}
     */
    getSelectedSection ()
    {
        return this._section
    }

    resetStatus ()
    {
        this._statusLine.text(this._statusText)
    }

    /**
     * @param {string} status
     * @param {boolean} transient
     */
    updateStatus (status, transient = false)
    {
        if (!transient) {
            this._statusText = status
        }
        this._statusLine.text(status)
    }
}