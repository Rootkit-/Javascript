/*
Copyright 2009+, GM_config Contributors (https://github.com/sizzlemctwizzle/GM_config)

GM_config Collaborators/Contributors:
    Mike Medley <medleymind@gmail.com>
    Joe Simmons
    Izzy Soft
    Marti Martz
    Adam Thompson-Sharpe

GM_config is distributed under the terms of the GNU Lesser General Public License.

    GM_config is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @exclude       *
// @author        Mike Medley <medleymind@gmail.com> (https://github.com/sizzlemctwizzle/GM_config)
// @icon          https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/master/gm_config_icon_large.png

// ==UserLibrary==
// @name          GM_config
// @description   A lightweight, reusable, cross-browser graphical settings framework for inclusion in user scripts.
// @copyright     2009+, Mike Medley (https://github.com/sizzlemctwizzle)
// @license       LGPL-3.0-or-later; https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/master/LICENSE

// @homepageURL   https://openuserjs.org/libs/sizzle/GM_config
// @homepageURL   https://github.com/sizzlemctwizzle/GM_config
// @supportURL    https://github.com/sizzlemctwizzle/GM_config/issues

// ==/UserScript==

// ==/UserLibrary==


let GM_config = (function () {    
  // This is the initializer function
  function GM_configInit(config, args) {
    // Initialize instance variables
    if (typeof config.fields == "undefined") {
      config.fields = {};
      config.onInit = config.onInit || function() {};
      config.onOpen = config.onOpen || function() {};
      config.onSave = config.onSave || function() {};
      config.onClose = config.onClose || function() {};
      config.onReset = config.onReset || function() {};
      config.isOpen = false;
      config.title = 'User Script Settings';
      config.css = {
        basic: [
          "#GM_config * { font-family: arial,tahoma,myriad pro,sans-serif; }",
          "#GM_config { background: #FFF; }",
          "#GM_config input[type='radio'] { margin-right: 8px; }",
          "#GM_config .indent40 { margin-left: 40%; }",
          "#GM_config .field_label { font-size: 12px; font-weight: bold; margin-right: 6px; }",
          "#GM_config .radio_label { font-size: 12px; }",
          "#GM_config .block { display: block; }",
          "#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }",
          "#GM_config .reset, #GM_config .reset a," +
            " #GM_config_buttons_holder { color: #000; text-align: right; }",
          "#GM_config .config_header { font-size: 20pt; margin: 0; }",
          "#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }",
          "#GM_config .center { text-align: center; }",
          "#GM_config .section_header_holder { margin-top: 8px; }",
          "#GM_config .config_var { margin: 0 0 4px; }",
          "#GM_config .section_header { background: #414141; border: 1px solid #000; color: #FFF;",
          " font-size: 13pt; margin: 0; }",
          "#GM_config .section_desc { background: #EFEFEF; border: 1px solid #CCC; color: #575757;" +
            " font-size: 9pt; margin: 0 0 6px; }"
          ].join('\n') + '\n',
        basicPrefix: "GM_config",
        stylish: ""
      };
    }

    if (args.length == 1 &&
      typeof args[0].id == "string" &&
      typeof args[0].appendChild != "function") var settings = args[0];
    else {
      // Provide backwards-compatibility with argument style intialization
      var settings = {};

      // loop through GM_config.init() arguments
      for (var i = 0, l = args.length, arg; i < l; ++i) {
        arg = args[i];

        // An element to use as the config window
        if (typeof arg.appendChild == "function") {
          settings.frame = arg;
          continue;
        }

        switch (typeof arg) {
          case 'object':
            for (var j in arg) { // could be a callback functions or settings object
              if (typeof arg[j] != "function") { // we are in the settings object
                settings.fields = arg; // store settings object
                break; // leave the loop
              } // otherwise it must be a callback function
              if (!settings.events) settings.events = {};
              settings.events[j] = arg[j];
            }
            break;
          case 'function': // passing a bare function is set to open callback
            settings.events = {onOpen: arg};
            break;
          case 'string': // could be custom CSS or the title string
            if (/\w+\s*\{\s*\w+\s*:\s*\w+[\s|\S]*\}/.test(arg))
              settings.css = arg;
            else
              settings.title = arg;
            break;
        }
      }
    }

    /* Initialize everything using the new settings object */
    // Set the id
    if (settings.id) config.id = settings.id;
    else if (typeof config.id == "undefined") config.id = 'GM_config';

    // Set the title
    if (settings.title) config.title = settings.title;

    // Set the custom css
    if (settings.css) config.css.stylish = settings.css;

    // Set the frame
    if (settings.frame) config.frame = settings.frame;

    // Set the event callbacks
    if (settings.events) {
      var events = settings.events;
      for (var e in events)
        config["on" + e.charAt(0).toUpperCase() + e.slice(1)] = events[e];
    }
    
    // If the id has changed we must modify the default style
    if (config.id != config.css.basicPrefix) {
      config.css.basic = config.css.basic.replace(
        new RegExp('#' + config.css.basicPrefix, 'gm'), '#' + config.id);
      config.css.basicPrefix = config.id;
    }

    // Create the fields
    config.isInit = false;
    if (settings.fields) {
      config.read(null, (stored) => { // read the stored settings
        var fields = settings.fields,
          customTypes = settings.types || {},
          configId = config.id;

        for (var id in fields) {
          var field = fields[id];

          // for each field definition create a field object
          if (field)
            config.fields[id] = new GM_configField(field, stored[id], id,
              customTypes[field.type], configId);
          else if (config.fields[id]) delete config.fields[id];
        }

        config.isInit = true;
        config.onInit();
      });
    } else {
      config.isInit = true;
      config.onInit();
    }
  }

  let construct = function () {
    // Parsing of input provided via frontends
    GM_configInit(this, arguments);
  };
  construct.prototype = {
    // Support re-initalization
    init: function() {
      GM_configInit(this, arguments);
    },

    // call GM_config.open() from your script to open the menu
    open: function () {
      // don't open before init is finished
      if (!this.isInit) {
        setTimeout(() => this.open(), 0);
        return;
      }
      // Die if the menu is already open on this page
      // You can have multiple instances but you can't open the same instance twice
      var match = document.getElementById(this.id);
      if (match && (match.tagName == "IFRAME" || match.childNodes.length > 0)) return;

      // Sometimes "this" gets overwritten so create an alias
      var config = this;

      // Function to build the mighty config window :)
      function buildConfigWin (body, head) {
        var create = config.create,
            fields = config.fields,
            configId = config.id,
            bodyWrapper = create('div', {id: configId + '_wrapper'});

        // Append the style which is our default style plus the user style
        head.appendChild(
          create('style', {
          type: 'text/css',
          textContent: config.css.basic + config.css.stylish
        }));

        // Add header and title
        bodyWrapper.appendChild(create('div', {
          id: configId + '_header',
          className: 'config_header block center'
        }, config.title));

        // Append elements
        var section = bodyWrapper,
            secNum = 0; // Section count

        // loop through fields
        for (var id in fields) {
          var field = fields[id],
              settings = field.settings;

          if (settings.section) { // the start of a new section
            section = bodyWrapper.appendChild(create('div', {
                className: 'section_header_holder',
                id: configId + '_section_' + secNum
              }));

            if (Object.prototype.toString.call(settings.section) !== '[object Array]')
              settings.section = [settings.section];

            if (settings.section[0])
              section.appendChild(create('div', {
                className: 'section_header center',
                id: configId + '_section_header_' + secNum
              }, settings.section[0]));

            if (settings.section[1])
              section.appendChild(create('p', {
                className: 'section_desc center',
                id: configId + '_section_desc_' + secNum
              }, settings.section[1]));
            ++secNum;
          }

          // Create field elements and append to current section
          section.appendChild((field.wrapper = field.toNode()));
        }

        // Add save and close buttons
        bodyWrapper.appendChild(create('div',
          {id: configId + '_buttons_holder'},

          create('button', {
            id: configId + '_saveBtn',
            textContent: 'Save',
            title: 'Save settings',
            className: 'saveclose_buttons',
            onclick: function () { config.save() }
          }),

          create('button', {
            id: configId + '_closeBtn',
            textContent: 'Close',
            title: 'Close window',
            className: 'saveclose_buttons',
            onclick: function () { config.close() }
          }),

          create('div',
            {className: 'reset_holder block'},

            // Reset link
            create('a', {
              id: configId + '_resetLink',
              textContent: 'Reset to defaults',
              href: '#',
              title: 'Reset fields to default values',
              className: 'reset',
              onclick: function(e) { e.preventDefault(); config.reset() }
            })
        )));

        body.appendChild(bodyWrapper); // Paint everything to window at once
        config.center(); // Show and center iframe
        window.addEventListener('resize', config.center, false); // Center frame on resize

        // Call the open() callback function
        config.onOpen(config.frame.contentDocument || config.frame.ownerDocument,
                      config.frame.contentWindow || window,
                      config.frame);

        // Close frame on window close
        window.addEventListener('beforeunload', function () {
            config.close();
        }, false);

        // Now that everything is loaded, make it visible
        config.frame.style.display = "block";
        config.isOpen = true;
      }

      // Change this in the onOpen callback using this.frame.setAttribute('style', '')
      var defaultStyle = 'bottom: auto; border: 1px solid #000; display: none; height: 75%;'
        + ' left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0;'
        + ' overflow: auto; padding: 0; position: fixed; right: auto; top: 0;'
        + ' width: 75%; z-index: 9999;';

      // Either use the element passed to init() or create an iframe
      if (this.frame) {
        this.frame.id = this.id; // Allows for prefixing styles with the config id
        this.frame.setAttribute('style', defaultStyle);
        buildConfigWin(this.frame, this.frame.ownerDocument.getElementsByTagName('head')[0]);
      } else {
        // Create frame
        document.body.appendChild((this.frame = this.create('iframe', {
          id: this.id,
          style: defaultStyle
        })));

        // In WebKit src can't be set until it is added to the page
        this.frame.src = 'about:blank';
        // we wait for the iframe to load before we can modify it
        var that = this;
        this.frame.addEventListener('load', function(e) {
            var frame = config.frame;
            if (frame.src && !frame.contentDocument) {
              // Some agents need this as an empty string for newer context implementations
              frame.src = "";
            } else if (!frame.contentDocument) {
              that.log("GM_config failed to initialize default settings dialog node!");
            }
            var body = frame.contentDocument.getElementsByTagName('body')[0];
            body.id = config.id; // Allows for prefixing styles with the config id
            buildConfigWin(body, frame.contentDocument.getElementsByTagName('head')[0]);
        }, false);
      }
    },

    save: function () {
      this.write(null, null, this.onSave);
    },

    close: function() {
      // If frame is an iframe then remove it
      if (this.frame && this.frame.contentDocument) {
        this.remove(this.frame);
        this.frame = null;
      } else if (this.frame) { // else wipe its content
        this.frame.innerHTML = "";
        this.frame.style.display = "none";
      }

      // Null out all the fields so we don't leak memory
      var fields = this.fields;
      for (var id in fields) {
        var field = fields[id];
        field.wrapper = null;
        field.node = null;
      }

      this.onClose(); //  Call the close() callback function
      this.isOpen = false;
    },

    set: function (name, val) {
      this.fields[name].value = val;

      if (this.fields[name].node) {
        this.fields[name].reload();
      }
    },

    get: function (name, getLive) {
      var field = this.fields[name],
          fieldVal = null;

      if (getLive && field.node) {
        fieldVal = field.toValue();
      }

      return fieldVal != null ? fieldVal : field.value;
    },

    write: function (store, obj, cb) {
      if (!obj) {
        var values = {},
            forgotten = {},
            fields = this.fields;

        for (var id in fields) {
          var field = fields[id];
          var value = field.toValue();

          if (field.save) {
            if (value != null) {
              values[id] = value;
              field.value = value;
            } else
              values[id] = field.value;
          } else
            forgotten[id] = value;
        }
      }
      
      (async () => {
        try {
          let val = this.stringify(obj || values);
          await this.setValue(store || this.id, val);
        } catch(e) {
          this.log("GM_config failed to save settings!");
        }
        cb(forgotten);
      })();
    },

    read: function (store, cb) {
      (async () => {
        let val = await this.getValue(store || this.id, '{}')
        try {
          let rval = this.parser(val);
          cb(rval);
        } catch(e) {
          this.log("GM_config failed to read saved settings!");
          cb({});
        }
      })();
    },

    reset: function () {
      var fields = this.fields;

      // Reset all the fields
      for (var id in fields) fields[id].reset();

      this.onReset(); // Call the reset() callback function
    },

    create: function () {
      switch(arguments.length) {
        case 1:
          var A = document.createTextNode(arguments[0]);
          break;
        default:
          var A = document.createElement(arguments[0]),
              B = arguments[1];
          for (var b in B) {
            if (b.indexOf("on") == 0)
              A.addEventListener(b.substring(2), B[b], false);
            else if (",style,accesskey,id,name,src,href,which,for".indexOf("," +
                     b.toLowerCase()) != -1)
              A.setAttribute(b, B[b]);
            else
              A[b] = B[b];
          }
          if (typeof arguments[2] == "string")
            A.innerHTML = arguments[2];
          else
            for (var i = 2, len = arguments.length; i < len; ++i)
              A.appendChild(arguments[i]);
      }
      return A;
    },

    center: function () {
      var node = this.frame;
      if (!node) return;
      var style = node.style,
          beforeOpacity = style.opacity;
      if (style.display == 'none') style.opacity = '0';
      style.display = '';
      style.top = Math.floor((window.innerHeight / 2) - (node.offsetHeight / 2)) + 'px';
      style.left = Math.floor((window.innerWidth / 2) - (node.offsetWidth / 2)) + 'px';
      style.opacity = '1';
    },

    remove: function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }
  };
  
  construct.prototype.name = 'GM_config';
  construct.prototype.constructor = construct;
  let isGM4 = typeof GM === 'object' && typeof GM.getValue !== 'undefined' &&
    typeof GM.setValue !== 'undefined';
  let isGM = isGM4 || (typeof GM_getValue !== 'undefined' &&
    typeof GM_getValue('a', 'b') !== 'undefined');
  construct.prototype.isGM = isGM;
  
  if (!isGM4) {
    let promisify = (old) => (...args) => {
      return new Promise((resolve) => {
        try {
          resolve(old.apply(this, args));
        } catch (e) {
          reject(e);
        }
      });
    };
    
    let getValue = isGM ? GM_getValue
      : (name, def) => {
        let s = localStorage.getItem(name);
        return s !== null ? s : def;
      };
    let setValue = isGM ? GM_setValue
      : (name, value) => localStorage.setItem(name, value);
    let log = isGM ? GM_log : console.log;
    
    var GM = Object.create(null);
    GM.getValue = promisify(getValue);
    GM.setValue = promisify(setValue);
    GM.log = promisify(log);
  }
  
  construct.prototype.stringify = JSON.stringify;
  construct.prototype.parser = JSON.parse;
  construct.prototype.getValue = GM.getValue;
  construct.prototype.setValue = GM.setValue;
  construct.prototype.log = GM.log;
  
  // Passthrough frontends for new and old usage
  let config = function () {
    return new (config.bind.apply(construct,
      [null].concat(Array.from(arguments))));
  };
  config.prototype.constructor = config;
    
  // Support old method of initalizing
  config.init = function () { 
    GM_config = config.apply(this, arguments);
    GM_config.init = function() {
      GM_configInit(this, arguments);
    };
  };

  config.create = construct.prototype.create;
  config.isGM = construct.prototype.isGM;
  config.setValue = construct.prototype.setValue;
  config.getValue = construct.prototype.getValue;
  config.stringify = construct.prototype.stringify;
  config.parser = construct.prototype.parser;
  config.log = construct.prototype.log;
  config.remove = construct.prototype.remove;

  return config;
}());
let GM_configStruct = GM_config;

function GM_configField(settings, stored, id, customType, configId) {
  // Store the field's settings
  this.settings = settings;
  this.id = id;
  this.configId = configId;
  this.node = null;
  this.wrapper = null;
  this.save = typeof settings.save == "undefined" ? true : settings.save;

  // Buttons are static and don't have a stored value
  if (settings.type == "button") this.save = false;

  // if a default value wasn't passed through init() then
  //   if the type is custom use its default value
  //   else use default value for type
  // else use the default value passed through init()
  this['default'] = typeof settings['default'] == "undefined" ?
    customType ?
      customType['default']
      : this.defaultValue(settings.type, settings.options)
    : settings['default'];

  // Store the field's value
  this.value = typeof stored == "undefined" ? this['default'] : stored;

  // Setup methods for a custom type
  if (customType) {
    this.toNode = customType.toNode;
    this.toValue = customType.toValue;
    this.reset = customType.reset;
  }
}

GM_configField.prototype = {
  create: GM_config.create,
  
  defaultValue: function(type, options) {
    var value;

    if (type.indexOf('unsigned ') == 0)
      type = type.substring(9);

    switch (type) {
      case 'radio': case 'select':
        value = options[0];
        break;
      case 'checkbox':
        value = false;
        break;
      case 'int': case 'integer':
      case 'float': case 'number':
        value = 0;
        break;
      default:
        value = '';
    }

    return value;
  },

  toNode: function() {
    var field = this.settings,
        value = this.value,
        options = field.options,
        type = field.type,
        id = this.id,
        configId = this.configId,
        labelPos = field.labelPos,
        create = this.create;

    function addLabel(pos, labelEl, parentNode, beforeEl) {
      if (!beforeEl) beforeEl = parentNode.firstChild;
      switch (pos) {
        case 'right': case 'below':
          if (pos == 'below')
            parentNode.appendChild(create('br', {}));
          parentNode.appendChild(labelEl);
          break;
        default:
          if (pos == 'above')
            parentNode.insertBefore(create('br', {}), beforeEl);
          parentNode.insertBefore(labelEl, beforeEl);
      }
    }

    var retNode = create('div', { className: 'config_var',
          id: configId + '_' + id + '_var',
          title: field.title || '' }),
        firstProp;

    // Retrieve the first prop
    for (var i in field) { firstProp = i; break; }

    var label = field.label && type != "button" ?
      create('label', {
        id: configId + '_' + id + '_field_label',
        for: configId + '_field_' + id,
        className: 'field_label'
      }, field.label) : null;

    switch (type) {
      case 'textarea':
        retNode.appendChild((this.node = create('textarea', {
          innerHTML: value,
          id: configId + '_field_' + id,
          className: 'block',
          cols: (field.cols ? field.cols : 20),
          rows: (field.rows ? field.rows : 2)
        })));
        break;
      case 'radio':
        var wrap = create('div', {
          id: configId + '_field_' + id
        });
        this.node = wrap;

        for (var i = 0, len = options.length; i < len; ++i) {
          var radLabel = create('label', {
            className: 'radio_label'
          }, options[i]);

          var rad = wrap.appendChild(create('input', {
            value: options[i],
            type: 'radio',
            name: id,
            checked: options[i] == value
          }));

          var radLabelPos = labelPos &&
            (labelPos == 'left' || labelPos == 'right') ?
            labelPos : firstProp == 'options' ? 'left' : 'right';

          addLabel(radLabelPos, radLabel, wrap, rad);
        }

        retNode.appendChild(wrap);
        break;
      case 'select':
        var wrap = create('select', {
          id: configId + '_field_' + id
        });
        this.node = wrap;

        for (var i = 0, len = options.length; i < len; ++i) {
          var option = options[i];
          wrap.appendChild(create('option', {
            value: option,
            selected: option == value
          }, option));
        }

        retNode.appendChild(wrap);
        break;
      default: // fields using input elements
        var props = {
          id: configId + '_field_' + id,
          type: type,
          value: type == 'button' ? field.label : value
        };

        switch (type) {
          case 'checkbox':
            props.checked = value;
            break;
          case 'button':
            props.size = field.size ? field.size : 25;
            if (field.script) field.click = field.script;
            if (field.click) props.onclick = field.click;
            break;
          case 'hidden':
            break;
          default:
            // type = text, int, or float
            props.type = 'text';
            props.size = field.size ? field.size : 25;
        }

        retNode.appendChild((this.node = create('input', props)));
    }

    if (label) {
      // If the label is passed first, insert it before the field
      // else insert it after
      if (!labelPos)
        labelPos = firstProp == "label" || type == "radio" ?
          "left" : "right";

      addLabel(labelPos, label, retNode);
    }

    return retNode;
  },

  toValue: function() {
    var node = this.node,
        field = this.settings,
        type = field.type,
        unsigned = false,
        rval = null;

    if (!node) return rval;

    if (type.indexOf('unsigned ') == 0) {
      type = type.substring(9);
      unsigned = true;
    }

    switch (type) {
      case 'checkbox':
        rval = node.checked;
        break;
      case 'select':
        rval = node[node.selectedIndex].value;
        break;
      case 'radio':
        var radios = node.getElementsByTagName('input');
        for (var i = 0, len = radios.length; i < len; ++i)
          if (radios[i].checked)
            rval = radios[i].value;
        break;
      case 'button':
        break;
      case 'int': case 'integer':
      case 'float': case 'number':
        var num = Number(node.value);
        var warn = 'Field labeled "' + field.label + '" expects a' +
          (unsigned ? ' positive ' : 'n ') + 'integer value';

        if (isNaN(num) || (type.substr(0, 3) == 'int' &&
            Math.ceil(num) != Math.floor(num)) ||
            (unsigned && num < 0)) {
          alert(warn + '.');
          return null;
        }

        if (!this._checkNumberRange(num, warn))
          return null;
        rval = num;
        break;
      default:
        rval = node.value;
        break;
    }

    return rval; // value read successfully
  },

  reset: function() {
    var node = this.node,
        field = this.settings,
        type = field.type;

    if (!node) return;

    switch (type) {
      case 'checkbox':
        node.checked = this['default'];
        break;
      case 'select':
        for (var i = 0, len = node.options.length; i < len; ++i)
          if (node.options[i].textContent == this['default'])
            node.selectedIndex = i;
        break;
      case 'radio':
        var radios = node.getElementsByTagName('input');
        for (var i = 0, len = radios.length; i < len; ++i)
          if (radios[i].value == this['default'])
            radios[i].checked = true;
        break;
      case 'button' :
        break;
      default:
        node.value = this['default'];
        break;
      }
  },

  remove: function(el) {
    GM_configStruct.remove(el || this.wrapper);
    this.wrapper = null;
    this.node = null;
  },

  reload: function() {
    var wrapper = this.wrapper;
    if (wrapper) {
      var fieldParent = wrapper.parentNode;
      fieldParent.insertBefore((this.wrapper = this.toNode()), wrapper);
      this.remove(wrapper);
    }
  },

  _checkNumberRange: function(num, warn) {
    var field = this.settings;
    if (typeof field.min == "number" && num < field.min) {
      alert(warn + ' greater than or equal to ' + field.min + '.');
      return null;
    }

    if (typeof field.max == "number" && num > field.max) {
      alert(warn + ' less than or equal to ' + field.max + '.');
      return null;
    }
    return true;
  }
};