/**
 * @license
 * Copyright (c) 2015 MediaMath Inc. All rights reserved.
 * This code may only be used under the BSD style license found at http://mediamath.github.io/strand/LICENSE.txt

*/
(function (scope) {

	scope.Input = Polymer({
		is: 'mm-input',

		behaviors: [
			StrandTraits.Stylable,
			StrandTraits.Validatable
		],

		properties: {
			PRIMARY_ICON_COLOR: {
				type:String, 
				value: Colors.A18 
			},
			direction: {
				type: String,
				value: false
			},
			placeholder: {
				type: String,
				reflectToAttribute: true
			},
			type: {
				type: String,
				value: "text",
				reflectToAttribute: true,
				observer: "_typeChanged"
			},
			icon: {
				type: String,
				value: false,
				reflectToAttribute: true
			},
			search: {
				type: Boolean,
				value: false,
				reflectToAttribute: true,
				observer: "_searchChanged"
			},
			clear: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			width: {
				type: Number,
				value: false,
				reflectToAttribute: true
			},
			maxlength: { 
				type: Number,
				value: false, 
				reflectToAttribute: true 
			},
			value: {
				type: String,
				value: null,
				observer: "_valueChanged",
				notify: true
			},
			disabled: { 
				type: Boolean,
				value: false, 
				reflectToAttribute: true 
			},
			fitparent: { 
				type: Boolean,
				value: false, 
				reflectToAttribute: true
			},
			layout: { 
				type: String,
				value: false, 
				reflectToAttribute: true 
			},
			clearVisible: {
				type: Boolean,
				value: false
			}
		},

		DIRECTION_TOP:  "top",
		DIRECTION_BOTTOM: "bottom",
		PADDING_RIGHT_ICON: 25,
		PADDING_RIGHT_DEFAULT: 10,

		_typeChanged: function(newVal, oldVal) {
			var types = /(text|password|email|number|tel|search|url)/ig;
			if (!types.test(newVal)) {
				this.type = "text";
			}
		},

		_searchChanged: function(newVal, oldVal) {
			if (newVal) { 
				this.icon = "search";
			} else if (!newVal && this.icon === "search") {
				this.icon = false;
			}
		},

		_updateIcon: function(icon, clearVisible) {
			var visible = icon && !clearVisible;
			return this.styleBlock({
				display: visible ? "block" : "none"
			});
		},

		_updateClear: function(clearVisible) {
			return this.styleBlock({
				display: clearVisible ? "block" : "none"
			});
		}, 
		
		_valueChanged: function(newVal, oldVal) {
			if (newVal && newVal.length > 0) {
				this.clearVisible = this.clear;
			} else {
				this.clearVisible = false;
			}
			this.fire("changed", { value: newVal });
		},

		clearInput: function(e) {
			this.value = null;
			this.clearVisible = false;
		},

		_updateStyle: function(icon, width, fitparent, clear) {
			var p = icon || clear ? this.PADDING_RIGHT_ICON + "px" : this.PADDING_RIGHT_DEFAULT + "px",
				f = fitparent ? "100%" : false,
				w = width ? width + "px" : "auto";

			return this.styleBlock({
				paddingRight: p,
				width: f ? f : w
			});
		},

		_updateClass: function(direction, error) {
			var o = {};
			o["text-input"] = true;
			o.invalid = error;
			o.top = (direction === this.DIRECTION_TOP);
			o.bottom = (direction === this.DIRECTION_BOTTOM);
			return this.classBlock(o);
		}

	});

})(window.Strand = window.Strand || {});