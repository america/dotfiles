/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3587:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery Validation Plugin v1.20.0
 *
 * https://jqueryvalidation.org/
 *
 * Copyright (c) 2023 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(9755)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}(function( $ ) {

$.extend( $.fn, {

	// https://jqueryvalidation.org/validate/
	validate: function( options ) {

		// If nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// Check if a validator for this form was already created
		var validator = $.data( this[ 0 ], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[ 0 ] );
		$.data( this[ 0 ], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.on( "click.validate", ":submit", function( event ) {

				// Track the used submit button to properly handle scripted
				// submits later.
				validator.submitButton = event.currentTarget;

				// Allow suppressing validation by adding a cancel class to the submit button
				if ( $( this ).hasClass( "cancel" ) ) {
					validator.cancelSubmit = true;
				}

				// Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $( this ).attr( "formnovalidate" ) !== undefined ) {
					validator.cancelSubmit = true;
				}
			} );

			// Validate the form on submit
			this.on( "submit.validate", function( event ) {
				if ( validator.settings.debug ) {

					// Prevent form submit to be able to see console output
					event.preventDefault();
				}

				function handle() {
					var hidden, result;

					// Insert a hidden input as a replacement for the missing submit button
					// The hidden input is inserted in two cases:
					//   - A user defined a `submitHandler`
					//   - There was a pending request due to `remote` method and `stopRequest()`
					//     was called to submit the form in case it's valid
					if ( validator.submitButton && ( validator.settings.submitHandler || validator.formSubmitted ) ) {
						hidden = $( "<input type='hidden'/>" )
							.attr( "name", validator.submitButton.name )
							.val( $( validator.submitButton ).val() )
							.appendTo( validator.currentForm );
					}

					if ( validator.settings.submitHandler && !validator.settings.debug ) {
						result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( hidden ) {

							// And clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						if ( result !== undefined ) {
							return result;
						}
						return false;
					}
					return true;
				}

				// Prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			} );
		}

		return validator;
	},

	// https://jqueryvalidation.org/valid/
	valid: function() {
		var valid, validator, errorList;

		if ( $( this[ 0 ] ).is( "form" ) ) {
			valid = this.validate().form();
		} else {
			errorList = [];
			valid = true;
			validator = $( this[ 0 ].form ).validate();
			this.each( function() {
				valid = validator.element( this ) && valid;
				if ( !valid ) {
					errorList = errorList.concat( validator.errorList );
				}
			} );
			validator.errorList = errorList;
		}
		return valid;
	},

	// https://jqueryvalidation.org/rules/
	rules: function( command, argument ) {
		var element = this[ 0 ],
			isContentEditable = typeof this.attr( "contenteditable" ) !== "undefined" && this.attr( "contenteditable" ) !== "false",
			settings, staticRules, existingRules, data, param, filtered;

		// If nothing is selected, return empty object; can't chain anyway
		if ( element == null ) {
			return;
		}

		if ( !element.form && isContentEditable ) {
			element.form = this.closest( "form" )[ 0 ];
			element.name = this.attr( "name" );
		}

		if ( element.form == null ) {
			return;
		}

		if ( command ) {
			settings = $.data( element.form, "validator" ).settings;
			staticRules = settings.rules;
			existingRules = $.validator.staticRules( element );
			switch ( command ) {
			case "add":
				$.extend( existingRules, $.validator.normalizeRule( argument ) );

				// Remove messages from rules, but allow them to be set separately
				delete existingRules.messages;
				staticRules[ element.name ] = existingRules;
				if ( argument.messages ) {
					settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[ element.name ];
					return existingRules;
				}
				filtered = {};
				$.each( argument.split( /\s/ ), function( index, method ) {
					filtered[ method ] = existingRules[ method ];
					delete existingRules[ method ];
				} );
				return filtered;
			}
		}

		data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules( element ),
			$.validator.attributeRules( element ),
			$.validator.dataRules( element ),
			$.validator.staticRules( element )
		), element );

		// Make sure required is at front
		if ( data.required ) {
			param = data.required;
			delete data.required;
			data = $.extend( { required: param }, data );
		}

		// Make sure remote is at back
		if ( data.remote ) {
			param = data.remote;
			delete data.remote;
			data = $.extend( data, { remote: param } );
		}

		return data;
	}
} );

// JQuery trim is deprecated, provide a trim method based on String.prototype.trim
var trim = function( str ) {

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim#Polyfill
	return str.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "" );
};

// Custom selectors
$.extend( $.expr.pseudos || $.expr[ ":" ], {		// '|| $.expr[ ":" ]' here enables backwards compatibility to jQuery 1.7. Can be removed when dropping jQ 1.7.x support

	// https://jqueryvalidation.org/blank-selector/
	blank: function( a ) {
		return !trim( "" + $( a ).val() );
	},

	// https://jqueryvalidation.org/filled-selector/
	filled: function( a ) {
		var val = $( a ).val();
		return val !== null && !!trim( "" + val );
	},

	// https://jqueryvalidation.org/unchecked-selector/
	unchecked: function( a ) {
		return !$( a ).prop( "checked" );
	}
} );

// Constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

// https://jqueryvalidation.org/jQuery.validator.format/
$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray( arguments );
			args.unshift( source );
			return $.validator.format.apply( this, args );
		};
	}
	if ( params === undefined ) {
		return source;
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray( arguments ).slice( 1 );
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each( params, function( i, n ) {
		source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
			return n;
		} );
	} );
	return source;
};

$.extend( $.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		pendingClass: "pending",
		validClass: "valid",
		errorElement: "label",
		focusCleanup: false,
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element ) {
			this.lastActive = element;

			// Hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.hideThese( this.errorsFor( element ) );
			}
		},
		onfocusout: function( element ) {
			if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
				this.element( element );
			}
		},
		onkeyup: function( element, event ) {

			// Avoid revalidate the field when pressing one of the following keys
			// Shift       => 16
			// Ctrl        => 17
			// Alt         => 18
			// Caps lock   => 20
			// End         => 35
			// Home        => 36
			// Left arrow  => 37
			// Up arrow    => 38
			// Right arrow => 39
			// Down arrow  => 40
			// Insert      => 45
			// Num lock    => 144
			// AltGr key   => 225
			var excludedKeys = [
				16, 17, 18, 20, 35, 36, 37,
				38, 39, 40, 45, 144, 225
			];

			if ( event.which === 9 && this.elementValue( element ) === "" || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
				return;
			} else if ( element.name in this.submitted || element.name in this.invalid ) {
				this.element( element );
			}
		},
		onclick: function( element ) {

			// Click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element( element );

			// Or option elements, check parent select in that case
			} else if ( element.parentNode.name in this.submitted ) {
				this.element( element.parentNode );
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
			} else {
				$( element ).addClass( errorClass ).removeClass( validClass );
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
			} else {
				$( element ).removeClass( errorClass ).addClass( validClass );
			}
		}
	},

	// https://jqueryvalidation.org/jQuery.validator.setDefaults/
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format( "Please enter no more than {0} characters." ),
		minlength: $.validator.format( "Please enter at least {0} characters." ),
		rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
		range: $.validator.format( "Please enter a value between {0} and {1}." ),
		max: $.validator.format( "Please enter a value less than or equal to {0}." ),
		min: $.validator.format( "Please enter a value greater than or equal to {0}." ),
		step: $.validator.format( "Please enter a multiple of {0}." )
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $( this.settings.errorLabelContainer );
			this.errorContext = this.labelContainer.length && this.labelContainer || $( this.currentForm );
			this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var currentForm = this.currentForm,
				groups = ( this.groups = {} ),
				rules;
			$.each( this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split( /\s/ );
				}
				$.each( value, function( index, name ) {
					groups[ name ] = key;
				} );
			} );
			rules = this.settings.rules;
			$.each( rules, function( key, value ) {
				rules[ key ] = $.validator.normalizeRule( value );
			} );

			function delegate( event ) {
				var isContentEditable = typeof $( this ).attr( "contenteditable" ) !== "undefined" && $( this ).attr( "contenteditable" ) !== "false";

				// Set form expando on contenteditable
				if ( !this.form && isContentEditable ) {
					this.form = $( this ).closest( "form" )[ 0 ];
					this.name = $( this ).attr( "name" );
				}

				// Ignore the element if it belongs to another form. This will happen mainly
				// when setting the `form` attribute of an input to the id of another form.
				if ( currentForm !== this.form ) {
					return;
				}

				var validator = $.data( this.form, "validator" ),
					eventType = "on" + event.type.replace( /^validate/, "" ),
					settings = validator.settings;
				if ( settings[ eventType ] && !$( this ).is( settings.ignore ) ) {
					settings[ eventType ].call( validator, this, event );
				}
			}

			$( this.currentForm )
				.on( "focusin.validate focusout.validate keyup.validate",
					":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
					"[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
					"[type='radio'], [type='checkbox'], [contenteditable], [type='button']", delegate )

				// Support: Chrome, oldIE
				// "select" is provided as event.target when clicking a option
				.on( "click.validate", "select, option, [type='radio'], [type='checkbox']", delegate );

			if ( this.settings.invalidHandler ) {
				$( this.currentForm ).on( "invalid-form.validate", this.settings.invalidHandler );
			}
		},

		// https://jqueryvalidation.org/Validator.form/
		form: function() {
			this.checkForm();
			$.extend( this.submitted, this.errorMap );
			this.invalid = $.extend( {}, this.errorMap );
			if ( !this.valid() ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ] );
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
				this.check( elements[ i ] );
			}
			return this.valid();
		},

		// https://jqueryvalidation.org/Validator.element/
		element: function( element ) {
			var cleanElement = this.clean( element ),
				checkElement = this.validationTargetFor( cleanElement ),
				v = this,
				result = true,
				rs, group;

			if ( checkElement === undefined ) {
				delete this.invalid[ cleanElement.name ];
			} else {
				this.prepareElement( checkElement );
				this.currentElements = $( checkElement );

				// If this element is grouped, then validate all group elements already
				// containing a value
				group = this.groups[ checkElement.name ];
				if ( group ) {
					$.each( this.groups, function( name, testgroup ) {
						if ( testgroup === group && name !== checkElement.name ) {
							cleanElement = v.validationTargetFor( v.clean( v.findByName( name ) ) );
							if ( cleanElement && cleanElement.name in v.invalid ) {
								v.currentElements.push( cleanElement );
								result = v.check( cleanElement ) && result;
							}
						}
					} );
				}

				rs = this.check( checkElement ) !== false;
				result = result && rs;
				if ( rs ) {
					this.invalid[ checkElement.name ] = false;
				} else {
					this.invalid[ checkElement.name ] = true;
				}

				if ( !this.numberOfInvalids() ) {

					// Hide error containers on last error
					this.toHide = this.toHide.add( this.containers );
				}
				this.showErrors();

				// Add aria-invalid status for screen readers
				$( element ).attr( "aria-invalid", !rs );
			}

			return result;
		},

		// https://jqueryvalidation.org/Validator.showErrors/
		showErrors: function( errors ) {
			if ( errors ) {
				var validator = this;

				// Add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = $.map( this.errorMap, function( message, name ) {
					return {
						message: message,
						element: validator.findByName( name )[ 0 ]
					};
				} );

				// Remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !( element.name in errors );
				} );
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// https://jqueryvalidation.org/Validator.resetForm/
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			}
			this.invalid = {};
			this.submitted = {};
			this.prepareForm();
			this.hideErrors();
			var elements = this.elements()
				.removeData( "previousValue" )
				.removeAttr( "aria-invalid" );

			this.resetElements( elements );
		},

		resetElements: function( elements ) {
			var i;

			if ( this.settings.unhighlight ) {
				for ( i = 0; elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ],
						this.settings.errorClass, "" );
					this.findByName( elements[ i ].name ).removeClass( this.settings.validClass );
				}
			} else {
				elements
					.removeClass( this.settings.errorClass )
					.removeClass( this.settings.validClass );
			}
		},

		numberOfInvalids: function() {
			return this.objectLength( this.invalid );
		},

		objectLength: function( obj ) {
			/* jshint unused: false */
			var count = 0,
				i;
			for ( i in obj ) {

				// This check allows counting elements with empty error
				// message as invalid elements
				if ( obj[ i ] !== undefined && obj[ i ] !== null && obj[ i ] !== false ) {
					count++;
				}
			}
			return count;
		},

		hideErrors: function() {
			this.hideThese( this.toHide );
		},

		hideThese: function( errors ) {
			errors.not( this.containers ).text( "" );
			this.addWrapper( errors ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [] )
					.filter( ":visible" )
					.trigger( "focus" )

					// Manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger( "focusin" );
				} catch ( e ) {

					// Ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep( this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			} ).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// Select all valid inputs inside the form (no submit or reset buttons)
			return $( this.currentForm )
			.find( "input, select, textarea, [contenteditable]" )
			.not( ":submit, :reset, :image, :disabled" )
			.not( this.settings.ignore )
			.filter( function() {
				var name = this.name || $( this ).attr( "name" ); // For contenteditable
				var isContentEditable = typeof $( this ).attr( "contenteditable" ) !== "undefined" && $( this ).attr( "contenteditable" ) !== "false";

				if ( !name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this );
				}

				// Set form expando on contenteditable
				if ( isContentEditable ) {
					this.form = $( this ).closest( "form" )[ 0 ];
					this.name = name;
				}

				// Ignore elements that belong to other/nested forms
				if ( this.form !== validator.currentForm ) {
					return false;
				}

				// Select only the first element for each name, and only those with rules specified
				if ( name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
					return false;
				}

				rulesCache[ name ] = true;
				return true;
			} );
		},

		clean: function( selector ) {
			return $( selector )[ 0 ];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.split( " " ).join( "." );
			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
		},

		resetInternals: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $( [] );
			this.toHide = $( [] );
		},

		reset: function() {
			this.resetInternals();
			this.currentElements = $( [] );
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor( element );
		},

		elementValue: function( element ) {
			var $element = $( element ),
				type = element.type,
				isContentEditable = typeof $element.attr( "contenteditable" ) !== "undefined" && $element.attr( "contenteditable" ) !== "false",
				val, idx;

			if ( type === "radio" || type === "checkbox" ) {
				return this.findByName( element.name ).filter( ":checked" ).val();
			} else if ( type === "number" && typeof element.validity !== "undefined" ) {
				return element.validity.badInput ? "NaN" : $element.val();
			}

			if ( isContentEditable ) {
				val = $element.text();
			} else {
				val = $element.val();
			}

			if ( type === "file" ) {

				// Modern browser (chrome & safari)
				if ( val.substr( 0, 12 ) === "C:\\fakepath\\" ) {
					return val.substr( 12 );
				}

				// Legacy browsers
				// Unix-based path
				idx = val.lastIndexOf( "/" );
				if ( idx >= 0 ) {
					return val.substr( idx + 1 );
				}

				// Windows-based path
				idx = val.lastIndexOf( "\\" );
				if ( idx >= 0 ) {
					return val.substr( idx + 1 );
				}

				// Just the file name
				return val;
			}

			if ( typeof val === "string" ) {
				return val.replace( /\r/g, "" );
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $( element ).rules(),
				rulesCount = $.map( rules, function( n, i ) {
					return i;
				} ).length,
				dependencyMismatch = false,
				val = this.elementValue( element ),
				result, method, rule, normalizer;

			// Abort any pending Ajax request from a previous call to this method.
			this.abortRequest( element );

			// Prioritize the local normalizer defined for this element over the global one
			// if the former exists, otherwise user the global one in case it exists.
			if ( typeof rules.normalizer === "function" ) {
				normalizer = rules.normalizer;
			} else if (	typeof this.settings.normalizer === "function" ) {
				normalizer = this.settings.normalizer;
			}

			// If normalizer is defined, then call it to retreive the changed value instead
			// of using the real one.
			// Note that `this` in the normalizer is `element`.
			if ( normalizer ) {
				val = normalizer.call( element, val );

				// Delete the normalizer from rules to avoid treating it as a pre-defined method.
				delete rules.normalizer;
			}

			for ( method in rules ) {
				rule = { method: method, parameters: rules[ method ] };
				try {
					result = $.validator.methods[ method ].call( this, val, element, rule.parameters );

					// If a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" && rulesCount === 1 ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor( element ) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch ( e ) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					if ( e instanceof TypeError ) {
						e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
					}

					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength( rules ) ) {
				this.successList.push( element );
			}
			return true;
		},

		// Return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		// return the generic message if present and no method specific message is present
		customDataMessage: function( element, method ) {
			return $( element ).data( "msg" + method.charAt( 0 ).toUpperCase() +
				method.substring( 1 ).toLowerCase() ) || $( element ).data( "msg" );
		},

		// Return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[ name ];
			return m && ( m.constructor === String ? m : m[ method ] );
		},

		// Return the first defined argument, allowing empty strings
		findDefined: function() {
			for ( var i = 0; i < arguments.length; i++ ) {
				if ( arguments[ i ] !== undefined ) {
					return arguments[ i ];
				}
			}
			return undefined;
		},

		// The second parameter 'rule' used to be a string, and extended to an object literal
		// of the following form:
		// rule = {
		//     method: "method name",
		//     parameters: "the given method parameters"
		// }
		//
		// The old behavior still supported, kept to maintain backward compatibility with
		// old code, and will be removed in the next major release.
		defaultMessage: function( element, rule ) {
			if ( typeof rule === "string" ) {
				rule = { method: rule };
			}

			var message = this.findDefined(
					this.customMessage( element.name, rule.method ),
					this.customDataMessage( element, rule.method ),

					// 'title' is never undefined, so handle empty string as undefined
					!this.settings.ignoreTitle && element.title || undefined,
					$.validator.messages[ rule.method ],
					"<strong>Warning: No message defined for " + element.name + "</strong>"
				),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call( this, rule.parameters, element );
			} else if ( theregex.test( message ) ) {
				message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
			}

			return message;
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule );

			this.errorList.push( {
				message: message,
				element: element,
				method: rule.method
			} );

			this.errorMap[ element.name ] = message;
			this.submitted[ element.name ] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements, error;
			for ( i = 0; this.errorList[ i ]; i++ ) {
				error = this.errorList[ i ];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[ i ]; i++ ) {
					this.showLabel( this.successList[ i ] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not( this.invalidElements() );
		},

		invalidElements: function() {
			return $( this.errorList ).map( function() {
				return this.element;
			} );
		},

		showLabel: function( element, message ) {
			var place, group, errorID, v,
				error = this.errorsFor( element ),
				elementID = this.idOrName( element ),
				describedBy = $( element ).attr( "aria-describedby" );

			if ( error.length ) {

				// Refresh error/success class
				error.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

				// Replace message on existing label
				if ( this.settings && this.settings.escapeHtml ) {
					error.text( message || "" );
				} else {
					error.html( message || "" );
				}
			} else {

				// Create error element
				error = $( "<" + this.settings.errorElement + ">" )
					.attr( "id", elementID + "-error" )
					.addClass( this.settings.errorClass );

				if ( this.settings && this.settings.escapeHtml ) {
					error.text( message || "" );
				} else {
					error.html( message || "" );
				}

				// Maintain reference to the element to be placed into the DOM
				place = error;
				if ( this.settings.wrapper ) {

					// Make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					place = error.hide().show().wrap( "<" + this.settings.wrapper + "/>" ).parent();
				}
				if ( this.labelContainer.length ) {
					this.labelContainer.append( place );
				} else if ( this.settings.errorPlacement ) {
					this.settings.errorPlacement.call( this, place, $( element ) );
				} else {
					place.insertAfter( element );
				}

				// Link error back to the element
				if ( error.is( "label" ) ) {

					// If the error is a label, then associate using 'for'
					error.attr( "for", elementID );

					// If the element is not a child of an associated label, then it's necessary
					// to explicitly apply aria-describedby
				} else if ( error.parents( "label[for='" + this.escapeCssMeta( elementID ) + "']" ).length === 0 ) {
					errorID = error.attr( "id" );

					// Respect existing non-error aria-describedby
					if ( !describedBy ) {
						describedBy = errorID;
					} else if ( !describedBy.match( new RegExp( "\\b" + this.escapeCssMeta( errorID ) + "\\b" ) ) ) {

						// Add to end of list if not already present
						describedBy += " " + errorID;
					}
					$( element ).attr( "aria-describedby", describedBy );

					// If this element is grouped, then assign to all elements in the same group
					group = this.groups[ element.name ];
					if ( group ) {
						v = this;
						$.each( v.groups, function( name, testgroup ) {
							if ( testgroup === group ) {
								$( "[name='" + v.escapeCssMeta( name ) + "']", v.currentForm )
									.attr( "aria-describedby", error.attr( "id" ) );
							}
						} );
					}
				}
			}
			if ( !message && this.settings.success ) {
				error.text( "" );
				if ( typeof this.settings.success === "string" ) {
					error.addClass( this.settings.success );
				} else {
					this.settings.success( error, element );
				}
			}
			this.toShow = this.toShow.add( error );
		},

		errorsFor: function( element ) {
			var name = this.escapeCssMeta( this.idOrName( element ) ),
				describer = $( element ).attr( "aria-describedby" ),
				selector = "label[for='" + name + "'], label[for='" + name + "'] *";

			// 'aria-describedby' should directly reference the error element
			if ( describer ) {
				selector = selector + ", #" + this.escapeCssMeta( describer )
					.replace( /\s+/g, ", #" );
			}

			return this
				.errors()
				.filter( selector );
		},

		// See https://api.jquery.com/category/selectors/, for CSS
		// meta-characters that should be escaped in order to be used with JQuery
		// as a literal part of a name/id or any selector.
		escapeCssMeta: function( string ) {
			if ( string === undefined ) {
				return "";
			}

			return string.replace( /([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1" );
		},

		idOrName: function( element ) {
			return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
		},

		validationTargetFor: function( element ) {

			// If radio/checkbox, validate first element in group instead
			if ( this.checkable( element ) ) {
				element = this.findByName( element.name );
			}

			// Always apply ignore filter
			return $( element ).not( this.settings.ignore )[ 0 ];
		},

		checkable: function( element ) {
			return ( /radio|checkbox/i ).test( element.type );
		},

		findByName: function( name ) {
			return $( this.currentForm ).find( "[name='" + this.escapeCssMeta( name ) + "']" );
		},

		getLength: function( value, element ) {
			switch ( element.nodeName.toLowerCase() ) {
			case "select":
				return $( "option:selected", element ).length;
			case "input":
				if ( this.checkable( element ) ) {
					return this.findByName( element.name ).filter( ":checked" ).length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[ typeof param ] ? this.dependTypes[ typeof param ]( param, element ) : true;
		},

		dependTypes: {
			"boolean": function( param ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$( param, element.form ).length;
			},
			"function": function( param, element ) {
				return param( element );
			}
		},

		optional: function( element ) {
			var val = this.elementValue( element );
			return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
		},

		elementAjaxPort: function( element ) {
			return "validate" + element.name;
		},

		startRequest: function( element ) {
			if ( !this.pending[ element.name ] ) {
				this.pendingRequest++;
				$( element ).addClass( this.settings.pendingClass );
				this.pending[ element.name ] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;

			// Sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[ element.name ];
			$( element ).removeClass( this.settings.pendingClass );
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() && this.pendingRequest === 0 ) {
				$( this.currentForm ).trigger( "submit" );

				// Remove the hidden input that was used as a replacement for the
				// missing submit button. The hidden input is added by `handle()`
				// to ensure that the value of the used submit button is passed on
				// for scripted submits triggered by this method
				if ( this.submitButton ) {
					$( "input:hidden[name='" + this.submitButton.name + "']", this.currentForm ).remove();
				}

				this.formSubmitted = false;
			} else if ( !valid && this.pendingRequest === 0 && this.formSubmitted ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ] );
				this.formSubmitted = false;
			}
		},

		abortRequest: function( element ) {
			var port;

			if ( this.pending[ element.name ] ) {
				port = this.elementAjaxPort( element );
				$.ajaxAbort( port );

				this.pendingRequest--;

				// Sometimes synchronization fails, make sure pendingRequest is never < 0
				if ( this.pendingRequest < 0 ) {
					this.pendingRequest = 0;
				}

				delete this.pending[ element.name ];
				$( element ).removeClass( this.settings.pendingClass );
			}
		},

		previousValue: function( element, method ) {
			method = typeof method === "string" && method || "remote";

			return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, { method: method } )
			} );
		},

		// Cleans up all forms and elements, removes validator-specific events
		destroy: function() {
			this.resetForm();

			$( this.currentForm )
				.off( ".validate" )
				.removeData( "validator" )
				.find( ".validate-equalTo-blur" )
					.off( ".validate-equalTo" )
					.removeClass( "validate-equalTo-blur" )
				.find( ".validate-lessThan-blur" )
					.off( ".validate-lessThan" )
					.removeClass( "validate-lessThan-blur" )
				.find( ".validate-lessThanEqual-blur" )
					.off( ".validate-lessThanEqual" )
					.removeClass( "validate-lessThanEqual-blur" )
				.find( ".validate-greaterThanEqual-blur" )
					.off( ".validate-greaterThanEqual" )
					.removeClass( "validate-greaterThanEqual-blur" )
				.find( ".validate-greaterThan-blur" )
					.off( ".validate-greaterThan" )
					.removeClass( "validate-greaterThan-blur" );
		}

	},

	classRuleSettings: {
		required: { required: true },
		email: { email: true },
		url: { url: true },
		date: { date: true },
		dateISO: { dateISO: true },
		number: { number: true },
		digits: { digits: true },
		creditcard: { creditcard: true }
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[ className ] = rules;
		} else {
			$.extend( this.classRuleSettings, className );
		}
	},

	classRules: function( element ) {
		var rules = {},
			classes = $( element ).attr( "class" );

		if ( classes ) {
			$.each( classes.split( " " ), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend( rules, $.validator.classRuleSettings[ this ] );
				}
			} );
		}
		return rules;
	},

	normalizeAttributeRule: function( rules, type, method, value ) {

		// Convert the value to a number for number inputs, and for text for backwards compability
		// allows type="date" and others to be compared as strings
		if ( /min|max|step/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
			value = Number( value );

			// Support Opera Mini, which returns NaN for undefined minlength
			if ( isNaN( value ) ) {
				value = undefined;
			}
		}

		if ( value || value === 0 ) {
			rules[ method ] = value;
		} else if ( type === method && type !== "range" ) {

			// Exception: the jquery validate 'range' method
			// does not test for the html5 'range' type
			rules[ type === "date" ? "dateISO" : method ] = true;
		}
	},

	attributeRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {

			// Support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = element.getAttribute( method );

				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}

				// Force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr( method );
			}

			this.normalizeAttributeRule( rules, type, method, value );
		}

		// 'maxlength' may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {
			value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );

			// Cast empty attributes like `data-rule-required` to `true`
			if ( value === "" ) {
				value = true;
			}

			this.normalizeAttributeRule( rules, type, method, value );
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {},
			validator = $.data( element.form, "validator" );

		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {

		// Handle dependency check
		$.each( rules, function( prop, val ) {

			// Ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[ prop ];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch ( typeof val.depends ) {
				case "string":
					keepRule = !!$( val.depends, element.form ).length;
					break;
				case "function":
					keepRule = val.depends.call( element, element );
					break;
				}
				if ( keepRule ) {
					rules[ prop ] = val.param !== undefined ? val.param : true;
				} else {
					$.data( element.form, "validator" ).resetElements( $( element ) );
					delete rules[ prop ];
				}
			}
		} );

		// Evaluate parameters
		$.each( rules, function( rule, parameter ) {
			rules[ rule ] = typeof parameter === "function" && rule !== "normalizer" ? parameter( element ) : parameter;
		} );

		// Clean number parameters
		$.each( [ "minlength", "maxlength" ], function() {
			if ( rules[ this ] ) {
				rules[ this ] = Number( rules[ this ] );
			}
		} );
		$.each( [ "rangelength", "range" ], function() {
			var parts;
			if ( rules[ this ] ) {
				if ( Array.isArray( rules[ this ] ) ) {
					rules[ this ] = [ Number( rules[ this ][ 0 ] ), Number( rules[ this ][ 1 ] ) ];
				} else if ( typeof rules[ this ] === "string" ) {
					parts = rules[ this ].replace( /[\[\]]/g, "" ).split( /[\s,]+/ );
					rules[ this ] = [ Number( parts[ 0 ] ), Number( parts[ 1 ] ) ];
				}
			}
		} );

		if ( $.validator.autoCreateRanges ) {

			// Auto-create ranges
			if ( rules.min != null && rules.max != null ) {
				rules.range = [ rules.min, rules.max ];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength != null && rules.maxlength != null ) {
				rules.rangelength = [ rules.minlength, rules.maxlength ];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each( data.split( /\s/ ), function() {
				transformed[ this ] = true;
			} );
			data = transformed;
		}
		return data;
	},

	// https://jqueryvalidation.org/jQuery.validator.addMethod/
	addMethod: function( name, method, message ) {
		$.validator.methods[ name ] = method;
		$.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
		if ( method.length < 3 ) {
			$.validator.addClassRules( name, $.validator.normalizeRule( name ) );
		}
	},

	// https://jqueryvalidation.org/jQuery.validator.methods/
	methods: {

		// https://jqueryvalidation.org/required-method/
		required: function( value, element, param ) {

			// Check if dependency is met
			if ( !this.depend( param, element ) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {

				// Could be an array for select-multiple or a string, both are fine this way
				var val = $( element ).val();
				return val && val.length > 0;
			}
			if ( this.checkable( element ) ) {
				return this.getLength( value, element ) > 0;
			}
			return value !== undefined && value !== null && value.length > 0;
		},

		// https://jqueryvalidation.org/email-method/
		email: function( value, element ) {

			// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
			// Retrieved 2014-01-14
			// If you have a problem with this implementation, report a bug against the above spec
			// Or use custom methods to implement your own email validation
			return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
		},

		// https://jqueryvalidation.org/url-method/
		url: function( value, element ) {

			// Copyright (c) 2010-2013 Diego Perini, MIT licensed
			// https://gist.github.com/dperini/729294
			// see also https://mathiasbynens.be/demo/url-regex
			// modified to allow protocol-relative URLs
			return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:(?:[^\]\[?\/<~#`!@$^&*()+=}|:";',>{ ]|%[0-9A-Fa-f]{2})+(?::(?:[^\]\[?\/<~#`!@$^&*()+=}|:";',>{ ]|%[0-9A-Fa-f]{2})*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
		},

		// https://jqueryvalidation.org/date-method/
		date: ( function() {
			var called = false;

			return function( value, element ) {
				if ( !called ) {
					called = true;
					if ( this.settings.debug && window.console ) {
						console.warn(
							"The `date` method is deprecated and will be removed in version '2.0.0'.\n" +
							"Please don't use it, since it relies on the Date constructor, which\n" +
							"behaves very differently across browsers and locales. Use `dateISO`\n" +
							"instead or one of the locale specific methods in `localizations/`\n" +
							"and `additional-methods.js`."
						);
					}
				}

				return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
			};
		}() ),

		// https://jqueryvalidation.org/dateISO-method/
		dateISO: function( value, element ) {
			return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
		},

		// https://jqueryvalidation.org/number-method/
		number: function( value, element ) {
			return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
		},

		// https://jqueryvalidation.org/digits-method/
		digits: function( value, element ) {
			return this.optional( element ) || /^\d+$/.test( value );
		},

		// https://jqueryvalidation.org/minlength-method/
		minlength: function( value, element, param ) {
			var length = Array.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length >= param;
		},

		// https://jqueryvalidation.org/maxlength-method/
		maxlength: function( value, element, param ) {
			var length = Array.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length <= param;
		},

		// https://jqueryvalidation.org/rangelength-method/
		rangelength: function( value, element, param ) {
			var length = Array.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
		},

		// https://jqueryvalidation.org/min-method/
		min: function( value, element, param ) {
			return this.optional( element ) || value >= param;
		},

		// https://jqueryvalidation.org/max-method/
		max: function( value, element, param ) {
			return this.optional( element ) || value <= param;
		},

		// https://jqueryvalidation.org/range-method/
		range: function( value, element, param ) {
			return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
		},

		// https://jqueryvalidation.org/step-method/
		step: function( value, element, param ) {
			var type = $( element ).attr( "type" ),
				errorMessage = "Step attribute on input type " + type + " is not supported.",
				supportedTypes = [ "text", "number", "range" ],
				re = new RegExp( "\\b" + type + "\\b" ),
				notSupported = type && !re.test( supportedTypes.join() ),
				decimalPlaces = function( num ) {
					var match = ( "" + num ).match( /(?:\.(\d+))?$/ );
					if ( !match ) {
						return 0;
					}

					// Number of digits right of decimal point.
					return match[ 1 ] ? match[ 1 ].length : 0;
				},
				toInt = function( num ) {
					return Math.round( num * Math.pow( 10, decimals ) );
				},
				valid = true,
				decimals;

			// Works only for text, number and range input types
			// TODO find a way to support input types date, datetime, datetime-local, month, time and week
			if ( notSupported ) {
				throw new Error( errorMessage );
			}

			decimals = decimalPlaces( param );

			// Value can't have too many decimals
			if ( decimalPlaces( value ) > decimals || toInt( value ) % toInt( param ) !== 0 ) {
				valid = false;
			}

			return this.optional( element ) || valid;
		},

		// https://jqueryvalidation.org/equalTo-method/
		equalTo: function( value, element, param ) {

			// Bind to the blur event of the target in order to revalidate whenever the target field is updated
			var target = $( param );
			if ( this.settings.onfocusout && target.not( ".validate-equalTo-blur" ).length ) {
				target.addClass( "validate-equalTo-blur" ).on( "blur.validate-equalTo", function() {
					$( element ).valid();
				} );
			}
			return value === target.val();
		},

		// https://jqueryvalidation.org/remote-method/
		remote: function( value, element, param, method ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}

			method = typeof method === "string" && method || "remote";

			var previous = this.previousValue( element, method ),
				validator, data, optionDataString;

			if ( !this.settings.messages[ element.name ] ) {
				this.settings.messages[ element.name ] = {};
			}
			previous.originalMessage = previous.originalMessage || this.settings.messages[ element.name ][ method ];
			this.settings.messages[ element.name ][ method ] = previous.message;

			param = typeof param === "string" && { url: param } || param;
			optionDataString = $.param( $.extend( { data: value }, param.data ) );
			if ( previous.old === optionDataString ) {
				return previous.valid;
			}

			previous.old = optionDataString;
			validator = this;
			this.startRequest( element );
			data = {};
			data[ element.name ] = value;
			$.ajax( $.extend( true, {
				mode: "abort",
				port: this.elementAjaxPort( element ),
				dataType: "json",
				data: data,
				context: validator.currentForm,
				success: function( response ) {
					var valid = response === true || response === "true",
						errors, message, submitted;

					validator.settings.messages[ element.name ][ method ] = previous.originalMessage;
					if ( valid ) {
						submitted = validator.formSubmitted;
						validator.toHide = validator.errorsFor( element );
						validator.formSubmitted = submitted;
						validator.successList.push( element );
						validator.invalid[ element.name ] = false;
						validator.showErrors();
					} else {
						errors = {};
						message = response || validator.defaultMessage( element, { method: method, parameters: value } );
						errors[ element.name ] = previous.message = message;
						validator.invalid[ element.name ] = true;
						validator.showErrors( errors );
					}
					previous.valid = valid;
					validator.stopRequest( element, valid );
				}
			}, param ) );
			return "pending";
		}
	}

} );

// Ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
//        $.ajaxAbort( port );
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

var pendingRequests = {},
	ajax;

// Use a prefilter if available (1.5+)
if ( $.ajaxPrefilter ) {
	$.ajaxPrefilter( function( settings, _, xhr ) {
		var port = settings.port;
		if ( settings.mode === "abort" ) {
			$.ajaxAbort( port );
			pendingRequests[ port ] = xhr;
		}
	} );
} else {

	// Proxy ajax
	ajax = $.ajax;
	$.ajax = function( settings ) {
		var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
			port = ( "port" in settings ? settings : $.ajaxSettings ).port;
		if ( mode === "abort" ) {
			$.ajaxAbort( port );
			pendingRequests[ port ] = ajax.apply( this, arguments );
			return pendingRequests[ port ];
		}
		return ajax.apply( this, arguments );
	};
}

// Abort the previous request without sending a new one
$.ajaxAbort = function( port ) {
	if ( pendingRequests[ port ] ) {
		pendingRequests[ port ].abort();
		delete pendingRequests[ port ];
	}
};
return $;
}));

/***/ }),

/***/ 9755:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
( function( global, factory ) {

	"use strict";

	if (  true && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var version = "3.7.1",

	rhtmlSuffix = /HTML$/i,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},


	// Retrieve the text value of an array of DOM nodes
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {

			// If no nodeType, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {

				// Do not traverse comment nodes
				ret += jQuery.text( node );
			}
		}
		if ( nodeType === 1 || nodeType === 11 ) {
			return elem.textContent;
		}
		if ( nodeType === 9 ) {
			return elem.documentElement.textContent;
		}
		if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes

		return ret;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	isXMLDoc: function( elem ) {
		var namespace = elem && elem.namespaceURI,
			docElem = elem && ( elem.ownerDocument || elem ).documentElement;

		// Assume HTML when documentElement doesn't yet exist, such as inside
		// document fragments.
		return !rhtmlSuffix.test( namespace || docElem && docElem.nodeName || "HTML" );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}


function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var pop = arr.pop;


var sort = arr.sort;


var splice = arr.splice;


var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




// Note: an element does not contain itself
jQuery.contains = function( a, b ) {
	var bup = b && b.parentNode;

	return a === bup || !!( bup && bup.nodeType === 1 && (

		// Support: IE 9 - 11+
		// IE doesn't have `contains` on SVG.
		a.contains ?
			a.contains( bup ) :
			a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
	) );
};




// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

function fcssescape( ch, asCodePoint ) {
	if ( asCodePoint ) {

		// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
		if ( ch === "\0" ) {
			return "\uFFFD";
		}

		// Control characters and (dependent upon position) numbers get escaped as code points
		return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
	}

	// Other potentially-special ASCII characters get backslash-escaped
	return "\\" + ch;
}

jQuery.escapeSelector = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};




var preferredDoc = document,
	pushNative = push;

( function() {

var i,
	Expr,
	outermostContext,
	sortInput,
	hasDuplicate,
	push = pushNative,

	// Local document vars
	document,
	documentElement,
	documentIsHTML,
	rbuggyQSA,
	matches,

	// Instance-specific data
	expando = jQuery.expando,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
		"loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
		whitespace + "*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		ID: new RegExp( "^#(" + identifier + ")" ),
		CLASS: new RegExp( "^\\.(" + identifier + ")" ),
		TAG: new RegExp( "^(" + identifier + "|[*])" ),
		ATTR: new RegExp( "^" + attributes ),
		PSEUDO: new RegExp( "^" + pseudos ),
		CHILD: new RegExp(
			"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		bool: new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		needsContext: new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		if ( nonHex ) {

			// Strip the backslash prefix from a non-hex escape sequence
			return nonHex;
		}

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		// Support: IE <=11+
		// For values outside the Basic Multilingual Plane (BMP), manually construct a
		// surrogate pair
		return high < 0 ?
			String.fromCharCode( high + 0x10000 ) :
			String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes; see `setDocument`.
	// Support: IE 9 - 11+, Edge 12 - 18+
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE/Edge.
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && nodeName( elem, "fieldset" );
		},
		{ dir: "parentNode", next: "legend" }
	);

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android <=4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = {
		apply: function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		},
		call: function( target ) {
			pushNative.apply( target, slice.call( arguments, 1 ) );
		}
	};
}

function find( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE 9 only
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								push.call( results, elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE 9 only
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							find.contains( context, elem ) &&
							elem.id === m ) {

							push.call( results, elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( !nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when
					// strict-comparing two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( newContext != context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = jQuery.escapeSelector( nid );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrimCSS, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties
		// (see https://github.com/jquery/sizzle/issues/157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by jQuery selector module
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		return nodeName( elem, "input" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		return ( nodeName( elem, "input" ) || nodeName( elem, "button" ) ) &&
			elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11+
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a jQuery selector context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [node] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
function setDocument( node ) {
	var subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	documentElement = document.documentElement;
	documentIsHTML = !jQuery.isXMLDoc( document );

	// Support: iOS 7 only, IE 9 - 11+
	// Older browsers didn't support unprefixed `matches`.
	matches = documentElement.matches ||
		documentElement.webkitMatchesSelector ||
		documentElement.msMatchesSelector;

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors
	// (see trac-13936).
	// Limit the fix to IE & Edge Legacy; despite Edge 15+ implementing `matches`,
	// all IE 9+ and Edge Legacy versions implement `msMatchesSelector` as well.
	if ( documentElement.msMatchesSelector &&

		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 9 - 11+, Edge 12 - 18+
		subWindow.addEventListener( "unload", unloadHandler );
	}

	// Support: IE <10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		documentElement.appendChild( el ).id = jQuery.expando;
		return !document.getElementsByName ||
			!document.getElementsByName( jQuery.expando ).length;
	} );

	// Support: IE 9 only
	// Check to see if it's possible to do matchesSelector
	// on a disconnected node.
	support.disconnectedMatch = assert( function( el ) {
		return matches.call( el, "*" );
	} );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// IE/Edge don't support the :scope pseudo-class.
	support.scope = assert( function() {
		return document.querySelectorAll( ":scope" );
	} );

	// Support: Chrome 105 - 111 only, Safari 15.4 - 16.3 only
	// Make sure the `:has()` argument is parsed unforgivingly.
	// We include `*` in the test to detect buggy implementations that are
	// _selectively_ forgiving (specifically when the list includes at least
	// one valid selector).
	// Note that we treat complete lack of support for `:has()` as if it were
	// spec-compliant support, which is fine because use of `:has()` in such
	// environments will fail in the qSA path and fall back to jQuery traversal
	// anyway.
	support.cssHas = assert( function() {
		try {
			document.querySelector( ":has(*,:jqfake)" );
			return false;
		} catch ( e ) {
			return true;
		}
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter.ID = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter.ID =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find.TAG = function( tag, context ) {
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			return context.getElementsByTagName( tag );

		// DocumentFragment nodes don't have gEBTN
		} else {
			return context.querySelectorAll( tag );
		}
	};

	// Class
	Expr.find.CLASS = function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	rbuggyQSA = [];

	// Build QSA regex
	// Regex strategy adopted from Diego Perini
	assert( function( el ) {

		var input;

		documentElement.appendChild( el ).innerHTML =
			"<a id='" + expando + "' href='' disabled='disabled'></a>" +
			"<select id='" + expando + "-\r\\' disabled='disabled'>" +
			"<option selected=''></option></select>";

		// Support: iOS <=7 - 8 only
		// Boolean attributes and "value" are not treated correctly in some XML documents
		if ( !el.querySelectorAll( "[selected]" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
		}

		// Support: iOS <=7 - 8 only
		if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
			rbuggyQSA.push( "~=" );
		}

		// Support: iOS 8 only
		// https://bugs.webkit.org/show_bug.cgi?id=136851
		// In-page `selector#id sibling-combinator selector` fails
		if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
			rbuggyQSA.push( ".#.+[+~]" );
		}

		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		if ( !el.querySelectorAll( ":checked" ).length ) {
			rbuggyQSA.push( ":checked" );
		}

		// Support: Windows 8 Native Apps
		// The type and name attributes are restricted during .innerHTML assignment
		input = document.createElement( "input" );
		input.setAttribute( "type", "hidden" );
		el.appendChild( input ).setAttribute( "name", "D" );

		// Support: IE 9 - 11+
		// IE's :disabled selector does not pick up the children of disabled fieldsets
		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		documentElement.appendChild( el ).disabled = true;
		if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
			rbuggyQSA.push( ":enabled", ":disabled" );
		}

		// Support: IE 11+, Edge 15 - 18+
		// IE 11/Edge don't find elements on a `[name='']` query in some cases.
		// Adding a temporary attribute to the document before the selection works
		// around the issue.
		// Interestingly, IE 10 & older don't seem to have the issue.
		input = document.createElement( "input" );
		input.setAttribute( "name", "" );
		el.appendChild( input );
		if ( !el.querySelectorAll( "[name='']" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
				whitespace + "*(?:''|\"\")" );
		}
	} );

	if ( !support.cssHas ) {

		// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
		// Our regular `try-catch` mechanism fails to detect natively-unsupported
		// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
		// in browsers that parse the `:has()` argument as a forgiving selector list.
		// https://drafts.csswg.org/selectors/#relational now requires the argument
		// to be parsed unforgivingly, but browsers have not yet fully adjusted.
		rbuggyQSA.push( ":has" );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a === document || a.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b === document || b.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	};

	return document;
}

find.matches = function( expr, elements ) {
	return find( expr, null, null, elements );
};

find.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyQSA || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return find( expr, document, null, [ elem ] ).length > 0;
};

find.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return jQuery.contains( context, elem );
};


find.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (see trac-13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	if ( val !== undefined ) {
		return val;
	}

	return elem.getAttribute( name );
};

find.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
jQuery.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	//
	// Support: Android <=4.0+
	// Testing for detecting duplicates is unpredictable so instead assume we can't
	// depend on duplicate detection in all browsers without a stable sort.
	hasDuplicate = !support.sortStable;
	sortInput = !support.sortStable && slice.call( results, 0 );
	sort.call( results, sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			splice.call( results, duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

jQuery.fn.uniqueSort = function() {
	return this.pushStack( jQuery.uniqueSort( slice.apply( this ) ) );
};

Expr = jQuery.expr = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		ATTR: function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" )
				.replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		CHILD: function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					find.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
				);
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

			// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				find.error( match[ 0 ] );
			}

			return match;
		},

		PSEUDO: function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr.CHILD.test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		TAG: function( nodeNameSelector ) {
			var expectedNodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return nodeName( elem, expectedNodeName );
				};
		},

		CLASS: function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace + ")" + className +
					"(" + whitespace + "|$)" ) ) &&
				classCache( className, function( elem ) {
					return pattern.test(
						typeof elem.className === "string" && elem.className ||
							typeof elem.getAttribute !== "undefined" &&
								elem.getAttribute( "class" ) ||
							""
					);
				} );
		},

		ATTR: function( name, operator, check ) {
			return function( elem ) {
				var result = find.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				if ( operator === "=" ) {
					return result === check;
				}
				if ( operator === "!=" ) {
					return result !== check;
				}
				if ( operator === "^=" ) {
					return check && result.indexOf( check ) === 0;
				}
				if ( operator === "*=" ) {
					return check && result.indexOf( check ) > -1;
				}
				if ( operator === "$=" ) {
					return check && result.slice( -check.length ) === check;
				}
				if ( operator === "~=" ) {
					return ( " " + result.replace( rwhitespace, " " ) + " " )
						.indexOf( check ) > -1;
				}
				if ( operator === "|=" ) {
					return result === check || result.slice( 0, check.length + 1 ) === check + "-";
				}

				return false;
			};
		},

		CHILD: function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || ( parent[ expando ] = {} );
							cache = outerCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {
								outerCache = elem[ expando ] || ( elem[ expando ] = {} );
								cache = outerCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );
											outerCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		PSEUDO: function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// https://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					find.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as jQuery does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		not: markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrimCSS, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element
					// (see https://github.com/jquery/sizzle/issues/299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		has: markFunction( function( selector ) {
			return function( elem ) {
				return find( selector, elem ).length > 0;
			};
		} ),

		contains: markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || jQuery.text( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// https://www.w3.org/TR/selectors/#lang-pseudo
		lang: markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				find.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		target: function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		root: function( elem ) {
			return elem === documentElement;
		},

		focus: function( elem ) {
			return elem === safeActiveElement() &&
				document.hasFocus() &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		enabled: createDisabledPseudo( false ),
		disabled: createDisabledPseudo( true ),

		checked: function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// https://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			return ( nodeName( elem, "input" ) && !!elem.checked ) ||
				( nodeName( elem, "option" ) && !!elem.selected );
		},

		selected: function( elem ) {

			// Support: IE <=11+
			// Accessing the selectedIndex property
			// forces the browser to treat the default option as
			// selected when in an optgroup.
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		empty: function( elem ) {

			// https://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		parent: function( elem ) {
			return !Expr.pseudos.empty( elem );
		},

		// Element/input types
		header: function( elem ) {
			return rheader.test( elem.nodeName );
		},

		input: function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		button: function( elem ) {
			return nodeName( elem, "input" ) && elem.type === "button" ||
				nodeName( elem, "button" );
		},

		text: function( elem ) {
			var attr;
			return nodeName( elem, "input" ) && elem.type === "text" &&

				// Support: IE <10 only
				// New HTML5 attribute values (e.g., "search") appear
				// with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		first: createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		last: createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		eq: createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		even: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		odd: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		lt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i;

			if ( argument < 0 ) {
				i = argument + length;
			} else if ( argument > length ) {
				i = length;
			} else {
				i = argument;
			}

			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		gt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos.nth = Expr.pseudos.eq;

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rleadingCombinator.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrimCSS, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	if ( parseOnly ) {
		return soFar.length;
	}

	return soFar ?
		find.error( selector ) :

		// Cache the tokens
		tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						if ( skip && nodeName( elem, skip ) ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = outerCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							outerCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		find( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem, matcherOut,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed ||
				multipleContexts( selector || "*",
					context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems;

		if ( matcher ) {

			// If we have a postFinder, or filtered seed, or non-seed postFilter
			// or preexisting results,
			matcherOut = postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results;

			// Find primary matches
			matcher( matcherIn, matcherOut, context, xml );
		} else {
			matcherOut = matcherIn;
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf.call( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			var ret = ( !leadingRelative && ( xml || context != outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element
			// (see https://github.com/jquery/sizzle/issues/299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrimCSS, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find.TAG( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: iOS <=7 - 9 only
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching
			// elements by id. (see trac-14142)
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							push.call( results, elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					jQuery.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

function compile( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
}

/**
 * A low-level selection function that works with jQuery's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with jQuery selector compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find.ID(
				token.matches[ 0 ].replace( runescape, funescape ),
				context
			) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr.needsContext.test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) &&
						testContext( context.parentNode ) || context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
}

// One-time assignments

// Support: Android <=4.0 - 4.1+
// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Initialize against the default document
setDocument();

// Support: Android <=4.0 - 4.1+
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

jQuery.find = find;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.unique = jQuery.uniqueSort;

// These have always been private, but they used to be documented as part of
// Sizzle so let's maintain them for now for backwards compatibility purposes.
find.compile = compile;
find.select = select;
find.setDocument = setDocument;
find.tokenize = tokenize;

find.escape = jQuery.escapeSelector;
find.getText = jQuery.text;
find.isXML = jQuery.isXMLDoc;
find.selectors = jQuery.expr;
find.support = jQuery.support;
find.uniqueSort = jQuery.uniqueSort;

	/* eslint-enable */

} )();


var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to jQuery#find
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.error );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the error, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getErrorHook ) {
									process.error = jQuery.Deferred.getErrorHook();

								// The deprecated alias of the above. While the name suggests
								// returning the stack, not an error instance, jQuery just passes
								// it directly to `console.warn` so both will work; an instance
								// just better cooperates with source maps.
								} else if ( jQuery.Deferred.getStackHook ) {
									process.error = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

// If `jQuery.Deferred.getErrorHook` is defined, `asyncError` is an error
// captured before the async barrier to get the original error cause
// which may otherwise be hidden.
jQuery.Deferred.exceptionHook = function( error, asyncError ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message,
			error.stack, asyncError );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", true );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, isSetup ) {

	// Missing `isSetup` indicates a trigger call, which must force setup through jQuery.event.add
	if ( !isSetup ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				if ( !saved ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					this[ type ]();
					result = dataPriv.get( this, type );
					dataPriv.set( this, type, false );

					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						return result;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering
				// the native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved ) {

				// ...and capture the result
				dataPriv.set( this, type, jQuery.event.trigger(
					saved[ 0 ],
					saved.slice( 1 ),
					this
				) );

				// Abort handling of the native event by all jQuery handlers while allowing
				// native handlers on the same element to run. On target, this is achieved
				// by stopping immediate propagation just on the jQuery event. However,
				// the native event is re-wrapped by a jQuery one on each level of the
				// propagation so the only way to stop it for jQuery is to stop it for
				// everyone via native `stopPropagation()`. This is not a problem for
				// focus/blur which don't bubble, but it does also stop click on checkboxes
				// and radios. We accept this limitation.
				event.stopPropagation();
				event.isImmediatePropagationStopped = returnTrue;
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {

	function focusMappedHandler( nativeEvent ) {
		if ( document.documentMode ) {

			// Support: IE 11+
			// Attach a single focusin/focusout handler on the document while someone wants
			// focus/blur. This is because the former are synchronous in IE while the latter
			// are async. In other browsers, all those handlers are invoked synchronously.

			// `handle` from private data would already wrap the event, but we need
			// to change the `type` here.
			var handle = dataPriv.get( this, "handle" ),
				event = jQuery.event.fix( nativeEvent );
			event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
			event.isSimulated = true;

			// First, handle focusin/focusout
			handle( nativeEvent );

			// ...then, handle focus/blur
			//
			// focus/blur don't bubble while focusin/focusout do; simulate the former by only
			// invoking the handler at the lower level.
			if ( event.target === event.currentTarget ) {

				// The setup part calls `leverageNative`, which, in turn, calls
				// `jQuery.event.add`, so event handle will already have been set
				// by this point.
				handle( event );
			}
		} else {

			// For non-IE browsers, attach a single capturing handler on the document
			// while someone wants focusin/focusout.
			jQuery.event.simulate( delegateType, nativeEvent.target,
				jQuery.event.fix( nativeEvent ) );
		}
	}

	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			var attaches;

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, true );

			if ( document.documentMode ) {

				// Support: IE 9 - 11+
				// We use the same native handler for focusin & focus (and focusout & blur)
				// so we need to coordinate setup & teardown parts between those events.
				// Use `delegateType` as the key as `type` is already used by `leverageNative`.
				attaches = dataPriv.get( this, delegateType );
				if ( !attaches ) {
					this.addEventListener( delegateType, focusMappedHandler );
				}
				dataPriv.set( this, delegateType, ( attaches || 0 ) + 1 );
			} else {

				// Return false to allow normal processing in the caller
				return false;
			}
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		teardown: function() {
			var attaches;

			if ( document.documentMode ) {
				attaches = dataPriv.get( this, delegateType ) - 1;
				if ( !attaches ) {
					this.removeEventListener( delegateType, focusMappedHandler );
					dataPriv.remove( this, delegateType );
				} else {
					dataPriv.set( this, delegateType, attaches );
				}
			} else {

				// Return false to indicate standard teardown should be applied
				return false;
			}
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	//
	// Support: IE 9 - 11+
	// To preserve relative focusin/focus & focusout/blur event order guaranteed on the 3.x branch,
	// attach a single handler for both events in IE.
	jQuery.event.special[ delegateType ] = {
		setup: function() {

			// Handle: regular nodes (via `this.ownerDocument`), window
			// (via `this.document`) & document (via `this`).
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType );

			// Support: IE 9 - 11+
			// We use the same native handler for focusin & focus (and focusout & blur)
			// so we need to coordinate setup & teardown parts between those events.
			// Use `delegateType` as the key as `type` is already used by `leverageNative`.
			if ( !attaches ) {
				if ( document.documentMode ) {
					this.addEventListener( delegateType, focusMappedHandler );
				} else {
					doc.addEventListener( type, focusMappedHandler, true );
				}
			}
			dataPriv.set( dataHolder, delegateType, ( attaches || 0 ) + 1 );
		},
		teardown: function() {
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType ) - 1;

			if ( !attaches ) {
				if ( document.documentMode ) {
					this.removeEventListener( delegateType, focusMappedHandler );
				} else {
					doc.removeEventListener( type, focusMappedHandler, true );
				}
				dataPriv.remove( dataHolder, delegateType );
			} else {
				dataPriv.set( dataHolder, delegateType, attaches );
			}
		}
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Re-enable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew jQuery#find here for performance reasons:
			// https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "box-sizing:content-box;border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is `display: block`
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {

		// Support: IE <=9 - 11+
		// IE only supports `"float"` in `getPropertyValue`; in computed styles
		// it's only available as `"cssFloat"`. We no longer modify properties
		// sent to `.css()` apart from camelCasing, so we need to check both.
		// Normally, this would create difference in behavior: if
		// `getPropertyValue` returns an empty string, the value returned
		// by `.css()` would be `undefined`. This is usually the case for
		// disconnected elements. However, in IE even disconnected elements
		// with no styles return `"none"` for `getPropertyValue( "float" )`
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( isCustomProp && ret ) {

			// Support: Firefox 105+, Chrome <=105+
			// Spec requires trimming whitespace for custom properties (gh-4926).
			// Firefox only trims leading whitespace. Chrome just collapses
			// both leading & trailing whitespace to a single space.
			//
			// Fall back to `undefined` if empty string returned.
			// This collapses a missing definition with property defined
			// and set to an empty string but there's no standard API
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jQuery.
			//
			// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" ) || undefined;
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0,
		marginDelta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		// Count margin delta separately to only add it after scroll gutter adjustment.
		// This is needed to make negative margins work with `outerHeight( true )` (gh-3982).
		if ( box === "margin" ) {
			marginDelta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta + marginDelta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		animationIterationCount: true,
		aspectRatio: true,
		borderImageSlice: true,
		columnCount: true,
		flexGrow: true,
		flexShrink: true,
		fontWeight: true,
		gridArea: true,
		gridColumn: true,
		gridColumnEnd: true,
		gridColumnStart: true,
		gridRow: true,
		gridRowEnd: true,
		gridRowStart: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		scale: true,
		widows: true,
		zIndex: true,
		zoom: true,

		// SVG-related
		fillOpacity: true,
		floodOpacity: true,
		stopOpacity: true,
		strokeMiterlimit: true,
		strokeOpacity: true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes trac-9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (trac-10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (trac-11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// trac-1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// trac-14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this
			.on( "mouseenter", fnOver )
			.on( "mouseleave", fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),

/***/ 509:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(9985);
var tryToString = __webpack_require__(3691);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 2655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isConstructor = __webpack_require__(9429);
var tryToString = __webpack_require__(3691);

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ 3550:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isPossiblePrototype = __webpack_require__(598);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 7370:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(4201);
var create = __webpack_require__(5391);
var defineProperty = (__webpack_require__(2560).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 1514:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var charAt = (__webpack_require__(730).charAt);

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ 5027:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(8999);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 7075:
/***/ ((module) => {

"use strict";

// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ 4872:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(7075);
var DESCRIPTORS = __webpack_require__(7697);
var global = __webpack_require__(9037);
var isCallable = __webpack_require__(9985);
var isObject = __webpack_require__(8999);
var hasOwn = __webpack_require__(6812);
var classof = __webpack_require__(926);
var tryToString = __webpack_require__(3691);
var createNonEnumerableProperty = __webpack_require__(5773);
var defineBuiltIn = __webpack_require__(1880);
var defineBuiltInAccessor = __webpack_require__(2148);
var isPrototypeOf = __webpack_require__(3622);
var getPrototypeOf = __webpack_require__(1868);
var setPrototypeOf = __webpack_require__(9385);
var wellKnownSymbol = __webpack_require__(4201);
var uid = __webpack_require__(4630);
var InternalStateModule = __webpack_require__(618);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw new TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw new TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw new TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ 4328:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(5290);
var toAbsoluteIndex = __webpack_require__(7578);
var lengthOfArrayLike = __webpack_require__(6310);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 6834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ 8820:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(509);
var toObject = __webpack_require__(690);
var IndexedObject = __webpack_require__(4413);
var lengthOfArrayLike = __webpack_require__(6310);

var $TypeError = TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    aCallable(callbackfn);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw new $TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ 6004:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);

module.exports = uncurryThis([].slice);


/***/ }),

/***/ 382:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var arraySlice = __webpack_require__(6004);

var floor = Math.floor;

var sort = function (array, comparefn) {
  var length = array.length;

  if (length < 8) {
    // insertion sort
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    }
  } else {
    // merge sort
    var middle = floor(length / 2);
    var left = sort(arraySlice(array, 0, middle), comparefn);
    var right = sort(arraySlice(array, middle), comparefn);
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    }
  }

  return array;
};

module.exports = sort;


/***/ }),

/***/ 6648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 926:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(3043);
var isCallable = __webpack_require__(9985);
var classofRaw = __webpack_require__(6648);
var wellKnownSymbol = __webpack_require__(4201);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 8758:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(6812);
var ownKeys = __webpack_require__(9152);
var getOwnPropertyDescriptorModule = __webpack_require__(2474);
var definePropertyModule = __webpack_require__(2560);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 1748:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 7807:
/***/ ((module) => {

"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ 5773:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var definePropertyModule = __webpack_require__(2560);
var createPropertyDescriptor = __webpack_require__(5684);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 5684:
/***/ ((module) => {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 2148:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var makeBuiltIn = __webpack_require__(8702);
var defineProperty = __webpack_require__(2560);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ 1880:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(9985);
var definePropertyModule = __webpack_require__(2560);
var makeBuiltIn = __webpack_require__(8702);
var defineGlobalProperty = __webpack_require__(5014);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 5014:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 7697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 6420:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var isObject = __webpack_require__(8999);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 7365:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var userAgent = __webpack_require__(71);

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ }),

/***/ 7298:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var UA = __webpack_require__(71);

module.exports = /MSIE|Trident/.test(UA);


/***/ }),

/***/ 806:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var classof = __webpack_require__(6648);

module.exports = classof(global.process) === 'process';


/***/ }),

/***/ 71:
/***/ ((module) => {

"use strict";

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ 3615:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var userAgent = __webpack_require__(71);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 7922:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var userAgent = __webpack_require__(71);

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ }),

/***/ 2739:
/***/ ((module) => {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 9989:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var getOwnPropertyDescriptor = (__webpack_require__(2474).f);
var createNonEnumerableProperty = __webpack_require__(5773);
var defineBuiltIn = __webpack_require__(1880);
var defineGlobalProperty = __webpack_require__(5014);
var copyConstructorProperties = __webpack_require__(8758);
var isForced = __webpack_require__(5266);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = global[TARGET] && global[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 3689:
/***/ ((module) => {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 1735:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(7215);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ 7215:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 2615:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(7215);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 1236:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var hasOwn = __webpack_require__(6812);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 2743:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var aCallable = __webpack_require__(509);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 6576:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classofRaw = __webpack_require__(6648);
var uncurryThis = __webpack_require__(8844);

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ 8844:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(7215);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 6058:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var isCallable = __webpack_require__(9985);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 2643:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var isArray = __webpack_require__(2297);
var isCallable = __webpack_require__(9985);
var classof = __webpack_require__(6648);
var toString = __webpack_require__(4327);

var push = uncurryThis([].push);

module.exports = function (replacer) {
  if (isCallable(replacer)) return replacer;
  if (!isArray(replacer)) return;
  var rawLength = replacer.length;
  var keys = [];
  for (var i = 0; i < rawLength; i++) {
    var element = replacer[i];
    if (typeof element == 'string') push(keys, element);
    else if (typeof element == 'number' || classof(element) === 'Number' || classof(element) === 'String') push(keys, toString(element));
  }
  var keysLength = keys.length;
  var root = true;
  return function (key, value) {
    if (root) {
      root = false;
      return value;
    }
    if (isArray(this)) return value;
    for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
  };
};


/***/ }),

/***/ 4849:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(509);
var isNullOrUndefined = __webpack_require__(981);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 9037:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 6812:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var toObject = __webpack_require__(690);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 7248:
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ 2688:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(6058);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 8506:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var fails = __webpack_require__(3689);
var createElement = __webpack_require__(6420);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 4413:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var fails = __webpack_require__(3689);
var classof = __webpack_require__(6648);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 6738:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var isCallable = __webpack_require__(9985);
var store = __webpack_require__(4091);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 618:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(9834);
var global = __webpack_require__(9037);
var isObject = __webpack_require__(8999);
var createNonEnumerableProperty = __webpack_require__(5773);
var hasOwn = __webpack_require__(6812);
var shared = __webpack_require__(4091);
var sharedKey = __webpack_require__(2713);
var hiddenKeys = __webpack_require__(7248);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 2297:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(6648);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ 9985:
/***/ ((module) => {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 9429:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);
var classof = __webpack_require__(926);
var getBuiltIn = __webpack_require__(6058);
var inspectSource = __webpack_require__(6738);

var noop = function () { /* empty */ };
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, [], argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ 5266:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 981:
/***/ ((module) => {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 8999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(9985);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 598:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(8999);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ 3931:
/***/ ((module) => {

"use strict";

module.exports = false;


/***/ }),

/***/ 1245:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(8999);
var classof = __webpack_require__(6648);
var wellKnownSymbol = __webpack_require__(4201);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) === 'RegExp');
};


/***/ }),

/***/ 734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(6058);
var isCallable = __webpack_require__(9985);
var isPrototypeOf = __webpack_require__(3622);
var USE_SYMBOL_AS_UID = __webpack_require__(9525);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IteratorPrototype = (__webpack_require__(2013).IteratorPrototype);
var create = __webpack_require__(5391);
var createPropertyDescriptor = __webpack_require__(5684);
var setToStringTag = __webpack_require__(5997);
var Iterators = __webpack_require__(9478);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ 2013:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);
var isObject = __webpack_require__(8999);
var create = __webpack_require__(5391);
var getPrototypeOf = __webpack_require__(1868);
var defineBuiltIn = __webpack_require__(1880);
var wellKnownSymbol = __webpack_require__(4201);
var IS_PURE = __webpack_require__(3931);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ 9478:
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ 6310:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toLength = __webpack_require__(3126);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 8702:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);
var hasOwn = __webpack_require__(6812);
var DESCRIPTORS = __webpack_require__(7697);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(1236).CONFIGURABLE);
var inspectSource = __webpack_require__(6738);
var InternalStateModule = __webpack_require__(618);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 8828:
/***/ ((module) => {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 5391:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(5027);
var definePropertiesModule = __webpack_require__(8920);
var enumBugKeys = __webpack_require__(2739);
var hiddenKeys = __webpack_require__(7248);
var html = __webpack_require__(2688);
var documentCreateElement = __webpack_require__(6420);
var sharedKey = __webpack_require__(2713);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 8920:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(5648);
var definePropertyModule = __webpack_require__(2560);
var anObject = __webpack_require__(5027);
var toIndexedObject = __webpack_require__(5290);
var objectKeys = __webpack_require__(300);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 2560:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var IE8_DOM_DEFINE = __webpack_require__(8506);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(5648);
var anObject = __webpack_require__(5027);
var toPropertyKey = __webpack_require__(8360);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 2474:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var call = __webpack_require__(2615);
var propertyIsEnumerableModule = __webpack_require__(9556);
var createPropertyDescriptor = __webpack_require__(5684);
var toIndexedObject = __webpack_require__(5290);
var toPropertyKey = __webpack_require__(8360);
var hasOwn = __webpack_require__(6812);
var IE8_DOM_DEFINE = __webpack_require__(8506);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 2741:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(4948);
var enumBugKeys = __webpack_require__(2739);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 7518:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 1868:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(6812);
var isCallable = __webpack_require__(9985);
var toObject = __webpack_require__(690);
var sharedKey = __webpack_require__(2713);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(1748);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 3622:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 4948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var hasOwn = __webpack_require__(6812);
var toIndexedObject = __webpack_require__(5290);
var indexOf = (__webpack_require__(4328).indexOf);
var hiddenKeys = __webpack_require__(7248);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 300:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(4948);
var enumBugKeys = __webpack_require__(2739);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 9556:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 9385:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(2743);
var anObject = __webpack_require__(5027);
var aPossiblePrototype = __webpack_require__(3550);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 5899:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var isCallable = __webpack_require__(9985);
var isObject = __webpack_require__(8999);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 9152:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(6058);
var uncurryThis = __webpack_require__(8844);
var getOwnPropertyNamesModule = __webpack_require__(2741);
var getOwnPropertySymbolsModule = __webpack_require__(7518);
var anObject = __webpack_require__(5027);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 6100:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var anObject = __webpack_require__(5027);
var isCallable = __webpack_require__(9985);
var classof = __webpack_require__(6648);
var regexpExec = __webpack_require__(6308);

var $TypeError = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw new $TypeError('RegExp#exec called on incompatible receiver');
};


/***/ }),

/***/ 6308:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = __webpack_require__(2615);
var uncurryThis = __webpack_require__(8844);
var toString = __webpack_require__(4327);
var regexpFlags = __webpack_require__(9633);
var stickyHelpers = __webpack_require__(7901);
var shared = __webpack_require__(3430);
var create = __webpack_require__(5391);
var getInternalState = (__webpack_require__(618).get);
var UNSUPPORTED_DOT_ALL = __webpack_require__(2100);
var UNSUPPORTED_NCG = __webpack_require__(6422);

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ 9633:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(5027);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ 3477:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var hasOwn = __webpack_require__(6812);
var isPrototypeOf = __webpack_require__(3622);
var regExpFlags = __webpack_require__(9633);

var RegExpPrototype = RegExp.prototype;

module.exports = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R)
    ? call(regExpFlags, R) : flags;
};


/***/ }),

/***/ 7901:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var global = __webpack_require__(9037);

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') !== null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') !== null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};


/***/ }),

/***/ 2100:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var global = __webpack_require__(9037);

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.test('\n') && re.flags === 's');
});


/***/ }),

/***/ 6422:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(3689);
var global = __webpack_require__(9037);

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});


/***/ }),

/***/ 4684:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isNullOrUndefined = __webpack_require__(981);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 5997:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineProperty = (__webpack_require__(2560).f);
var hasOwn = __webpack_require__(6812);
var wellKnownSymbol = __webpack_require__(4201);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ 2713:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var shared = __webpack_require__(3430);
var uid = __webpack_require__(4630);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 4091:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var defineGlobalProperty = __webpack_require__(5014);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 3430:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_PURE = __webpack_require__(3931);
var store = __webpack_require__(4091);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.35.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.35.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 6373:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(5027);
var aConstructor = __webpack_require__(2655);
var isNullOrUndefined = __webpack_require__(981);
var wellKnownSymbol = __webpack_require__(4201);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ 730:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);
var toIntegerOrInfinity = __webpack_require__(8700);
var toString = __webpack_require__(4327);
var requireObjectCoercible = __webpack_require__(4684);

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ 146:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(3615);
var fails = __webpack_require__(3689);
var global = __webpack_require__(9037);

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 7578:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(8700);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5290:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(4413);
var requireObjectCoercible = __webpack_require__(4684);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 8700:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var trunc = __webpack_require__(8828);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 3126:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(8700);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 690:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var requireObjectCoercible = __webpack_require__(4684);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 3250:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPositiveInteger = __webpack_require__(5904);

var $RangeError = RangeError;

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw new $RangeError('Wrong offset');
  return offset;
};


/***/ }),

/***/ 5904:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(8700);

var $RangeError = RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw new $RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ 8732:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(2615);
var isObject = __webpack_require__(8999);
var isSymbol = __webpack_require__(734);
var getMethod = __webpack_require__(4849);
var ordinaryToPrimitive = __webpack_require__(5899);
var wellKnownSymbol = __webpack_require__(4201);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 8360:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPrimitive = __webpack_require__(8732);
var isSymbol = __webpack_require__(734);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 3043:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(4201);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 4327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(926);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 3691:
/***/ ((module) => {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 4630:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(8844);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 9525:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(146);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 5648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(7697);
var fails = __webpack_require__(3689);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 9834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var isCallable = __webpack_require__(9985);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 4201:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var shared = __webpack_require__(3430);
var hasOwn = __webpack_require__(6812);
var uid = __webpack_require__(4630);
var NATIVE_SYMBOL = __webpack_require__(146);
var USE_SYMBOL_AS_UID = __webpack_require__(9525);

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(9989);
var $reduce = (__webpack_require__(8820).left);
var arrayMethodIsStrict = __webpack_require__(6834);
var CHROME_VERSION = __webpack_require__(3615);
var IS_NODE = __webpack_require__(806);

// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
var FORCED = CHROME_BUG || !arrayMethodIsStrict('reduce');

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: FORCED }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 3383:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = __webpack_require__(7370);

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('flat');


/***/ }),

/***/ 8324:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(9989);
var getBuiltIn = __webpack_require__(6058);
var apply = __webpack_require__(1735);
var call = __webpack_require__(2615);
var uncurryThis = __webpack_require__(8844);
var fails = __webpack_require__(3689);
var isCallable = __webpack_require__(9985);
var isSymbol = __webpack_require__(734);
var arraySlice = __webpack_require__(6004);
var getReplacerFunction = __webpack_require__(2643);
var NATIVE_SYMBOL = __webpack_require__(146);

var $String = String;
var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')('stringify detection');
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) !== '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) !== '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) !== '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = getReplacerFunction(replacer);
  if (!isCallable($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
  args[1] = function (key, value) {
    // some old implementations (like WebKit) could pass numbers as keys
    if (isCallable($replacer)) value = call($replacer, this, $String(key), value);
    if (!isSymbol(value)) return value;
  };
  return apply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}


/***/ }),

/***/ 9866:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-string-prototype-matchall -- safe */
var $ = __webpack_require__(9989);
var call = __webpack_require__(2615);
var uncurryThis = __webpack_require__(6576);
var createIteratorConstructor = __webpack_require__(974);
var createIterResultObject = __webpack_require__(7807);
var requireObjectCoercible = __webpack_require__(4684);
var toLength = __webpack_require__(3126);
var toString = __webpack_require__(4327);
var anObject = __webpack_require__(5027);
var isNullOrUndefined = __webpack_require__(981);
var classof = __webpack_require__(6648);
var isRegExp = __webpack_require__(1245);
var getRegExpFlags = __webpack_require__(3477);
var getMethod = __webpack_require__(4849);
var defineBuiltIn = __webpack_require__(1880);
var fails = __webpack_require__(3689);
var wellKnownSymbol = __webpack_require__(4201);
var speciesConstructor = __webpack_require__(6373);
var advanceStringIndex = __webpack_require__(1514);
var regExpExec = __webpack_require__(6100);
var InternalStateModule = __webpack_require__(618);
var IS_PURE = __webpack_require__(3931);

var MATCH_ALL = wellKnownSymbol('matchAll');
var REGEXP_STRING = 'RegExp String';
var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(REGEXP_STRING_ITERATOR);
var RegExpPrototype = RegExp.prototype;
var $TypeError = TypeError;
var stringIndexOf = uncurryThis(''.indexOf);
var nativeMatchAll = uncurryThis(''.matchAll);

var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
  nativeMatchAll('a', /./);
});

var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, $global, fullUnicode) {
  setInternalState(this, {
    type: REGEXP_STRING_ITERATOR,
    regexp: regexp,
    string: string,
    global: $global,
    unicode: fullUnicode,
    done: false
  });
}, REGEXP_STRING, function next() {
  var state = getInternalState(this);
  if (state.done) return createIterResultObject(undefined, true);
  var R = state.regexp;
  var S = state.string;
  var match = regExpExec(R, S);
  if (match === null) {
    state.done = true;
    return createIterResultObject(undefined, true);
  }
  if (state.global) {
    if (toString(match[0]) === '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
    return createIterResultObject(match, false);
  }
  state.done = true;
  return createIterResultObject(match, false);
});

var $matchAll = function (string) {
  var R = anObject(this);
  var S = toString(string);
  var C = speciesConstructor(R, RegExp);
  var flags = toString(getRegExpFlags(R));
  var matcher, $global, fullUnicode;
  matcher = new C(C === RegExp ? R.source : R, flags);
  $global = !!~stringIndexOf(flags, 'g');
  fullUnicode = !!~stringIndexOf(flags, 'u');
  matcher.lastIndex = toLength(R.lastIndex);
  return new $RegExpStringIterator(matcher, S, $global, fullUnicode);
};

// `String.prototype.matchAll` method
// https://tc39.es/ecma262/#sec-string.prototype.matchall
$({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
  matchAll: function matchAll(regexp) {
    var O = requireObjectCoercible(this);
    var flags, S, matcher, rx;
    if (!isNullOrUndefined(regexp)) {
      if (isRegExp(regexp)) {
        flags = toString(requireObjectCoercible(getRegExpFlags(regexp)));
        if (!~stringIndexOf(flags, 'g')) throw new $TypeError('`.matchAll` does not allow non-global regexes');
      }
      if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll(O, regexp);
      matcher = getMethod(regexp, MATCH_ALL);
      if (matcher === undefined && IS_PURE && classof(regexp) === 'RegExp') matcher = $matchAll;
      if (matcher) return call(matcher, regexp, O);
    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll(O, regexp);
    S = toString(O);
    rx = new RegExp(regexp, 'g');
    return IS_PURE ? call($matchAll, rx, S) : rx[MATCH_ALL](S);
  }
});

IS_PURE || MATCH_ALL in RegExpPrototype || defineBuiltIn(RegExpPrototype, MATCH_ALL, $matchAll);


/***/ }),

/***/ 6544:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(9989);
var DESCRIPTORS = __webpack_require__(7697);
var global = __webpack_require__(9037);
var uncurryThis = __webpack_require__(8844);
var hasOwn = __webpack_require__(6812);
var isCallable = __webpack_require__(9985);
var isPrototypeOf = __webpack_require__(3622);
var toString = __webpack_require__(4327);
var defineBuiltInAccessor = __webpack_require__(2148);
var copyConstructorProperties = __webpack_require__(8758);

var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('description detection')) === 'Symbol(description detection)';
  var thisSymbolValue = uncurryThis(SymbolPrototype.valueOf);
  var symbolDescriptiveString = uncurryThis(SymbolPrototype.toString);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineBuiltInAccessor(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = thisSymbolValue(this);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var string = symbolDescriptiveString(symbol);
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),

/***/ 9976:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var call = __webpack_require__(2615);
var ArrayBufferViewCore = __webpack_require__(4872);
var lengthOfArrayLike = __webpack_require__(6310);
var toOffset = __webpack_require__(3250);
var toIndexedObject = __webpack_require__(690);
var fails = __webpack_require__(3689);

var RangeError = global.RangeError;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw new RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);


/***/ }),

/***/ 3356:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(9037);
var uncurryThis = __webpack_require__(6576);
var fails = __webpack_require__(3689);
var aCallable = __webpack_require__(509);
var internalSort = __webpack_require__(382);
var ArrayBufferViewCore = __webpack_require__(4872);
var FF = __webpack_require__(7365);
var IE_OR_EDGE = __webpack_require__(7298);
var V8 = __webpack_require__(3615);
var WEBKIT = __webpack_require__(7922);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array = global.Uint16Array;
var nativeSort = Uint16Array && uncurryThis(Uint16Array.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !(fails(function () {
  nativeSort(new Uint16Array(2), null);
}) && fails(function () {
  nativeSort(new Uint16Array(2), {});
}));

var STABLE_SORT = !!nativeSort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 74;
  if (FF) return FF < 67;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 602;

  var array = new Uint16Array(516);
  var expected = Array(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  nativeSort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable(comparefn);
  if (STABLE_SORT) return nativeSort(this, comparefn);

  return internalSort(aTypedArray(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.json.stringify.js
var es_json_stringify = __webpack_require__(8324);
// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(9755);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);
// EXTERNAL MODULE: ./node_modules/jquery-validation/dist/jquery.validate.js
var jquery_validate = __webpack_require__(3587);
;// CONCATENATED MODULE: ./src/scripts/globals.ts
const _EXTENSION_ID = (/* unused pure expression or super */ null && ("ndakideadaglgpbblmppfonobpdgggin"));

const _APP_ID = (/* unused pure expression or super */ null && ("alhngdkjgnedakdlnamimgfihgkmenbh"));

const _SELF_ID = (/* unused pure expression or super */ null && ("ndakideadaglgpbblmppfonobpdgggin"));

const _VERSION = (/* unused pure expression or super */ null && ("1.4.2"));

(function () {
  if (false) {}
})();
function isExtension() {
  return "ndakideadaglgpbblmppfonobpdgggin" === "ndakideadaglgpbblmppfonobpdgggin";
}
function isApp() {
  return "ndakideadaglgpbblmppfonobpdgggin" === "alhngdkjgnedakdlnamimgfihgkmenbh";
}
function globals_GetClientVersionID() {
  if (isApp()) {
    return 'ChromeApp-' + "1.4.2";
  } else {
    return 'ChromeAppExt-' + "1.4.2";
  }
}
;// CONCATENATED MODULE: ./src/scripts/http/http.ts
async function http_getResponseBody(resp) {
  if (resp.ok) {
    return resp.json().then(respBody => respBody);
  }
  throw Error(`request ${resp.url} failed with HTTP ${resp.status} ${resp.statusText}`);
}
;// CONCATENATED MODULE: ./src/scripts/time/format.ts
function iso8601DateTimeZone(d) {
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + sign + pad(offset / 60) + ':' + pad(offset % 60);
}
function pad(n) {
  const abs = Math.floor(Math.abs(n));
  return (abs < 10 ? '0' : '') + abs;
}
;// CONCATENATED MODULE: ./src/scripts/log/log.ts


let remoteLogging = undefined;
if (self.chrome && chrome.storage && chrome.storage.local !== undefined) {
  chrome.storage.local.get('remoteLoggingURL', d => {
    if (d && d.remoteLoggingURL && d.remoteLoggingURL.startsWith('http')) {
      log_log(`Remote logging initialised: ${JSON.stringify(d)}`);
      remoteLogging = d;
    }
  });
}
function remoteLog(request) {
  if (!remoteLogging || !remoteLogging.remoteLoggingURL) {
    return;
  }
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs.length > 0) {
      request.body = `tab:${tabs[0].id} - ${request.body}`;
    } else {
      request.body = `??? - ${request.body}`;
    }
    fetch(`${remoteLogging.remoteLoggingURL}`, request).catch(e => {
      console.error('failed to remote log', e);
    });
  });
}
function isRemoteLogging() {
  return remoteLogging !== undefined;
}
function log_log(...args) {
  if (offscreenContext()) {
    sendToServiceWorker('log', args);
  } else {
    console.log.apply(console, [iso8601DateTimeZone(new Date()), ...args]);
  }
  if (isRemoteLogging()) {
    remoteLog({
      method: 'POST',
      body: JSON.stringify(['INFO', ...args])
    });
  }
}
function log_error(...args) {
  if (offscreenContext()) {
    sendToServiceWorker('error', args);
  } else {
    console.error.apply(console, [iso8601DateTimeZone(new Date()), ...args]);
  }
  if (isRemoteLogging()) {
    remoteLog({
      method: 'POST',
      body: JSON.stringify(['ERROR', ...args])
    });
  }
}
function log_warn(...args) {
  if (offscreenContext()) {
    sendToServiceWorker('warn', args);
  } else {
    console.warn.apply(console, [iso8601DateTimeZone(new Date()), ...args]);
  }
  if (isRemoteLogging()) {
    remoteLog({
      method: 'POST',
      body: JSON.stringify(['WARN', ...args])
    });
  }
}
function offscreenContext() {
  try {
    chrome.runtime.getManifest();
  } catch (e) {
    return true;
  }
  return false;
}
function sendToServiceWorker(type, data) {
  chrome.runtime.sendMessage({
    type,
    target: 'background',
    data
  });
}
;// CONCATENATED MODULE: ./src/scripts/log/index.ts

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.unscopables.flat.js
var es_array_unscopables_flat = __webpack_require__(3383);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.set.js
var es_typed_array_set = __webpack_require__(9976);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.sort.js
var es_typed_array_sort = __webpack_require__(3356);
;// CONCATENATED MODULE: ./src/scripts/random/string.ts


const RANDOM_STRING_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function string_cryptoRandomString(length) {
  let result = '';
  for (const v of crypto.getRandomValues(new Uint32Array(length))) {
    result += RANDOM_STRING_CHARSET[v % RANDOM_STRING_CHARSET.length];
  }
  return result;
}
;// CONCATENATED MODULE: ./src/scripts/random/index.ts

;// CONCATENATED MODULE: ./src/scripts/identity/clientId.ts


const CLIENT_ID_LENGTH = 22;
async function clientId_getClientId() {
  const clientId = await getLocalStorageData('clientId');
  if (clientId) {
    return Promise.resolve(clientId);
  } else {
    return setLocalStorageData('clientId', cryptoRandomString(CLIENT_ID_LENGTH));
  }
}
;// CONCATENATED MODULE: ./src/scripts/identity/index.ts

;// CONCATENATED MODULE: ./node_modules/pc-mobility-cloud/client/ts/session.ts

async function session_createSession(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "POST";
  const response = await fetch(`${sessionPath(baseUrl)}`, init);
  if (response.status !== 200) {
    throw `error creating client session [${response.status}]`;
  }
  return await response.json();
}
async function session_createOffer(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "PUT";
  init.body = JSON.stringify({
    iceOffer: req.iceOffer
  });
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}/offer`, init);
  if (response.status == 400) {
    throw `error sending offer: expired session`;
  }
  if (response.status != 200) {
    throw `error sending offer: [${response.status}]`;
  }
  return await response.json();
}
async function session_notifyClientCandidates(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "POST";
  init.body = JSON.stringify({
    iceCandidates: req.iceCandidates
  });
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}/candidate`, init);
  if (response.status == 400) {
    throw `error notifying new candidates: expired session`;
  }
  if (response.status != 200) {
    throw `error notifying new candidates: [${response.status}]`;
  }
  return await response.json();
}
async function session_getAnswer(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "GET";
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}/answer`, init);
  if (response.status == 404) {
    return "pending";
  }
  if (response.status == 400) {
    throw "error retrieving answer: expired session";
  }
  if (response.status != 200) {
    throw `error retrieving answer: [${response.status}]`;
  }
  return await response.json();
}
async function session_getServerCandidates(baseUrl, req) {
  const date = req.since;
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "GET";
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}/servercandidates?since=${req.since}`, init);
  if (response.status == 400) {
    throw `error receiving new candidates: expired session`;
  }
  if (response.status != 200) {
    throw `error receiving new candidates: [${response.status}]`;
  }
  return await response.json();
}
async function session_deleteSession(baseUrl, req) {
  const init = prepareRequestInit(req.clientToken, req.clientId);
  init.method = "DELETE";
  const response = await fetch(`${sessionPath(baseUrl)}/${req.sessionId}`, init);
  if (response.status != 200) {
    throw `error deleting session: [${response.status}]`;
  }
  return await response.json();
}
function prepareRequestInit(clientToken, clientId) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${clientToken}`);
  headers.append("X-PaperCut-Client-Id", clientId);
  headers.append("User-Agent", "PaperCutMobilityPrintCloudClientES/1.0.0");
  return {
    headers: headers
  };
}
function sessionPath(baseUrl) {
  return `${baseUrl}/client/v1/session`;
}
;// CONCATENATED MODULE: ./node_modules/pc-mobility-cloud/client/ts/index.ts

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__(6544);
;// CONCATENATED MODULE: ./src/scripts/peer/blob.ts

const DEFAULT_CHUNK_SIZE = 16384;
const MIN_CHUNK_SIZE = 1;
function blob_chunkBlob(blob, chunkSize) {
  if (chunkSize < MIN_CHUNK_SIZE) {
    chunkSize = DEFAULT_CHUNK_SIZE;
  }
  return {
    *[Symbol.iterator]() {
      let offset = 0;
      let end = Math.min(offset + chunkSize, blob.size);
      while (offset < blob.size) {
        yield blob.slice(offset, end);
        offset = end;
        end = Math.min(offset + chunkSize, blob.size);
      }
      return;
    }
  };
}
async function blob_blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}
async function blobToString(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(blob);
  });
}
;// CONCATENATED MODULE: ./src/scripts/peer/datachannel.ts




class datachannel_DataChannel {
  constructor(serverId, dataChannel, getChunkSize) {
    this.dataChannel = dataChannel;
    this.getChunkSize = getChunkSize;
    this.label = `${serverId}.${dataChannel.label}`;
  }
  async sendBlob(b) {
    const chunkSize = this.getChunkSize();
    const thresholdLow = chunkSize;
    const thresholdHigh = Math.max(chunkSize * 8, 1024 * 1024);
    const chunked = chunkBlob(b, chunkSize)[Symbol.iterator]();
    const numChunks = Math.ceil(b.size / chunkSize);
    const logEveryNChunks = Math.floor(1024 * 1024 / chunkSize);
    log(`[${this.label}] sendBlob: size=${b.size} bytes, numChunks=${numChunks}`);
    this.dataChannel.bufferedAmountLowThreshold = thresholdLow;
    const deferred = {
      resolved: false
    };
    deferred.promise = new Promise(resolve => {
      deferred.resolve = () => {
        deferred.resolved = true;
        resolve();
      };
    });
    let chunkIdx = 0;
    let fillInProgress = false;
    const fillToCapacity = async () => {
      fillInProgress = true;
      while (true) {
        if (this.dataChannel.bufferedAmount >= thresholdHigh) {
          fillInProgress = false;
          return;
        }
        const {
          value,
          done
        } = chunked.next();
        if (done) {
          deferred.resolve();
          return;
        }
        if (chunkIdx > 0 && chunkIdx % logEveryNChunks === 0) {
          log(`Transferred ${chunkIdx + 1} out of ${numChunks} chunks. [`, 'label=', this.label, ']');
        }
        const buf = await blobToArrayBuffer(value);
        this.dataChannel.send(buf);
        chunkIdx++;
      }
    };
    this.dataChannel.onbufferedamountlow = async () => {
      if (deferred.resolved || fillInProgress) {
        return;
      }
      await fillToCapacity();
    };
    log(`[${this.label}] ` + 'Starting data channel transfer. [', 'size=', b.size, 'chunkSize=', chunkSize, 'chunks=', numChunks, 'bufferHigh=', thresholdHigh, ']');
    const start = Date.now();
    await fillToCapacity();
    await deferred.promise;
    this.dataChannel.onbufferedamountlow = undefined;
    log('Data channel transfer complete. [', 'label=', this.label, 'duration=', `${Date.now() - start}ms`, ']');
  }
  sendString(s) {
    log(`[${this.label}] sendString: size=${s.length} bytes`);
    if (this.isClosed()) {
      error(`Cannot send message on closed channel '${this.label}`);
      return;
    }
    this.dataChannel.send(s);
  }
  isClosed() {
    return this.dataChannel.readyState === 'closed';
  }
  close() {
    this.dataChannel.close();
  }
  onOpen(f) {
    this.dataChannel.onopen = ev => {
      f(this, ev);
    };
  }
  onMessage(f) {
    this.dataChannel.onmessage = ev => {
      const msg = new Message(ev);
      f(this, msg);
    };
  }
  clearOnMessage() {
    this.dataChannel.onmessage = null;
  }
  onClose(f) {
    this.dataChannel.onclose = ev => {
      f(this, ev);
    };
  }
  onError(f) {
    this.dataChannel.onerror = ev => {
      f(this, ev);
    };
  }
}
;// CONCATENATED MODULE: ./src/scripts/peer/signal.ts

function signal_decodeSessionDescription(offer) {
  return JSON.parse(atob(offer));
}
function signal_encodeSessionDescription(sd) {
  return btoa(JSON.stringify(sd));
}
;// CONCATENATED MODULE: ./src/scripts/peer/peer.ts



const peer_MIN_CHUNK_SIZE = (/* unused pure expression or super */ null && (16 * 1024));
const MAX_CHUNK_SIZE = (/* unused pure expression or super */ null && (256 * 1024));
class peer_Peer {
  constructor(serverId, iceConfig) {
    this.dataChannels = new Map();
    this.connectionStateChangeCallbacks = [];
    this.serverId = serverId;
    this.connection = new RTCPeerConnection(createRTCConfig(iceConfig));
    this.connection.onconnectionstatechange = ev => {
      for (const f of this.connectionStateChangeCallbacks) {
        f(this, ev);
      }
    };
  }
  getServerId() {
    return this.serverId;
  }
  createDataChannel(label) {
    const dc = this.connection.createDataChannel(label);
    const channel = new DataChannel(this.serverId, dc, this.getChunkSize.bind(this));
    this.dataChannels.set(label, channel);
    return channel;
  }
  getChunkSize() {
    if (this.connection.sctp) {
      log(`[${this.getServerId()}]`, `Using SCTP specified chunk size value: ${this.connection.sctp.maxMessageSize} bytes`);
      return Math.min(this.connection.sctp.maxMessageSize - 1, MAX_CHUNK_SIZE);
    }
    log(`[${this.getServerId()}] Using fall-back chunk size value: ${peer_MIN_CHUNK_SIZE} bytes`);
    return peer_MIN_CHUNK_SIZE;
  }
  onDataChannel(f) {
    this.connection.ondatachannel = ev => {
      const dc = new DataChannel(this.serverId, ev.channel, this.getChunkSize.bind(this));
      this.dataChannels.set(dc.label, dc);
      f(this, dc);
    };
  }
  onNegotiationNeeded(f) {
    this.connection.onnegotiationneeded = ev => {
      f(this, ev);
    };
  }
  onICECandidate(f) {
    this.connection.onicecandidate = ev => {
      f(this, ev);
    };
  }
  isPeerConnected() {
    log(`[${this.serverId}] checking peer connection state:`, this.connection.iceConnectionState);
    return this.connection.connectionState === 'connected';
  }
  close() {
    log(`[${this.serverId}] closing peer connection...`);
    this.connection.close();
  }
  async createAnswer(offer) {
    const offerSessionDescription = decodeSessionDescription(offer);
    await this.connection.setRemoteDescription(offerSessionDescription);
    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
    return encodeSessionDescription(answer);
  }
  onConnectionStateChange(f) {
    this.connectionStateChangeCallbacks.push(f);
  }
  async onICEConnectionStateChange(f) {
    this.connection.oniceconnectionstatechange = ev => {
      f(this, ev);
    };
  }
  getConnectionState() {
    return this.connection.connectionState;
  }
  getICEConnectionState() {
    return this.connection.iceConnectionState;
  }
  async createOffer() {
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
    const result = this.connection.localDescription;
    return encodeSessionDescription(result);
  }
  async registerAnswer(answer) {
    const answerSessionDescription = decodeSessionDescription(answer);
    await this.connection.setRemoteDescription(answerSessionDescription);
  }
  addIceCandidate(candidate) {
    return this.connection.addIceCandidate(candidate);
  }
  getDataChannel(label) {
    return this.dataChannels.get(label);
  }
  getSelectedCandidatePair() {
    const iceTransport = this.getICETransport();
    if (!iceTransport) {
      return null;
    }
    return iceTransport.getSelectedCandidatePair();
  }
  getICETransport() {
    const sctp = this.connection.sctp;
    if (!sctp) {
      return null;
    }
    return sctp.transport.iceTransport;
  }
  waitForLiveConnection(waitFor) {
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => rej(`timeout waiting for peer connection ${this.serverId}, state:` + this.getConnectionState()), waitFor);
      this.onConnectionStateChange((ctx, _) => {
        switch (ctx.getConnectionState()) {
          case 'closed':
            break;
          case 'connected':
            clearTimeout(timeout);
            res();
            break;
          case 'connecting':
            break;
          case 'disconnected':
            break;
          case 'failed':
            clearTimeout(timeout);
            rej('failed');
            break;
          case 'new':
            break;
        }
      });
    });
  }
}
function createRTCConfig(iceConfig) {
  return {
    iceServers: iceConfig.servers,
    iceTransportPolicy: 'all'
  };
}
;// CONCATENATED MODULE: ./src/scripts/peer/index.ts





// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.reduce.js
var es_array_reduce = __webpack_require__(278);
;// CONCATENATED MODULE: ./src/scripts/cloudprint/client.ts







class client_MobRTCClient {
  constructor(id, peer, timeout, chunkSize, version) {
    this.id = id;
    this.peer = peer;
    this.timeout = timeout;
    this.chunkSize = chunkSize;
    this.version = version;
    this.shortTimeout = timeout / 4;
    this.serverId = peer.getServerId();
  }
  getID() {
    return this.id;
  }
  async getServerInfo() {
    log(`[${this.serverId}] Fetching server info...`);
    const dc = this.getServerInfoChannel();
    dc.sendString(' ');
    return this.readJsonResponseFromChannel(dc, this.shortTimeout);
  }
  async sendPrintJobDetails(printToken, printerUrl, params, fileSize) {
    log(`[${this.serverId}]`, `Submitting print job details: printerUrl=${printerUrl}, fileSize=${fileSize} bytes.`);
    const msg = JSON.stringify({
      clientVersion: this.version,
      printToken,
      printerUrl,
      params,
      fileSize
    });
    const dc = this.getJobDetailsChannel();
    dc.sendString(msg);
    let buf;
    let data;
    try {
      buf = await this.readChunkedResponse(dc);
      data = byteArrayToString(buf);
    } catch (e) {
      error(`[${this.serverId}] error parsing print job details response.`, e);
      throw e;
    }
    if (client_MobRTCClient.isError(data)) {
      throw new Error(data);
    }
    return data;
  }
  async sendPrintJob(file) {
    if (file.size == 0) {
      throw new Error(`invalid file size: [${file.size}]`);
    }
    return this.getJobChannel().sendBlob(file);
  }
  isReady() {
    return this.peer && this.peer.isPeerConnected();
  }
  close() {
    this.peer.close();
  }
  async getPrintToken(shareToken) {
    log(`[${this.serverId}] Exchanging share token for print token.`);
    return new Promise(async (resolve, reject) => {
      const dc = this.getTokenChannel();
      dc.sendString(shareToken);
      let buf;
      try {
        buf = await this.readChunkedResponse(dc);
      } catch (e) {
        return reject(e);
      }
      let printToken;
      try {
        printToken = byteArrayToString(buf);
      } catch (e) {
        error(`[${this.serverId}] error parsing auth-token response.`, e);
        return reject(e);
      }
      if (client_MobRTCClient.isError(printToken)) {
        return reject(`failed to exchange shareToken for printToken: ${printToken}`);
      }
      return resolve(printToken);
    });
  }
  readChunkedResponse(dc, chunkTimeout = this.timeout) {
    log(`[${dc.label}] readChunkedResponse,  chunkTimeout=${chunkTimeout}ms`);
    return new Promise((resolve, reject) => {
      let chunkIdx = 0;
      const startTime = performance.now();
      const buf = [];
      let onTimeout = setTimeout(() => {
        dc.clearOnMessage();
        return reject(`${chunkTimeout}ms timeout reached waiting for the first response.`);
      }, chunkTimeout);
      let logEveryNChunks = 0;
      dc.onMessage((ctx, msg) => {
        clearTimeout(onTimeout);
        onTimeout = setTimeout(() => {
          ctx.clearOnMessage();
          return reject(`${this.timeout}ms timeout reached waiting for data chunk: [${chunkIdx}]`);
        }, this.timeout);
        chunkIdx++;
        if (msg.stringData() === 'FINISH') {
          clearTimeout(onTimeout);
          ctx.clearOnMessage();
          if (buf.length == 0) {
            return resolve(new Uint8Array());
          }
          const result = buf.reduce((prev, next) => concatByteArrays(prev, next));
          log(`[${dc.label}]`, `Finished receiving ${(result.length / 1024).toFixed(2)}KiB,`, `chunks received: [${chunkIdx}]`, `took: ${(performance.now() - startTime).toFixed(2)} ms`);
          return resolve(result);
        }
        const chunk = msg.data();
        buf.push(new Uint8Array(chunk));
        if (logEveryNChunks === 0 && chunk.byteLength > 0) {
          logEveryNChunks = Math.floor(1024 * 1024 / chunk.byteLength);
        } else if (logEveryNChunks > 0 && chunkIdx > 0 && chunkIdx % logEveryNChunks === 0) {
          log(`[${dc.label}]: `, `Received ${chunkIdx} chunks,`, `${(chunk.byteLength * chunkIdx / 1024).toFixed(2)}KiB .`);
        }
      });
    });
  }
  async getPrinters(printToken) {
    return new Promise(async (resolve, reject) => {
      const dc = this.getPrinterChannel();
      dc.sendString(printToken);
      let printers;
      try {
        printers = await this.readJsonResponseFromChannel(dc);
      } catch (e) {
        error(`[${this.serverId}] error reading printer info response.`, e);
        return reject(e);
      }
      printers.forEach(p => {
        p.id = `http://localhost:9163/printers/${encodeURIComponent(p.name)}`;
        p.name = `${p.name} - [${p.description}]`;
      });
      return resolve(printers);
    });
  }
  async getCapabilities(printerId) {
    const dc = this.getCapabilitiesChannel();
    dc.sendString(printerId);
    return this.readJsonResponseFromChannel(dc);
  }
  async readJsonResponseFromChannel(dc, timeout = this.timeout) {
    return new Promise(async (resolve, reject) => {
      const tag = `${this.serverId}.${dc.label}`;
      let buf;
      try {
        buf = await this.readChunkedResponse(dc, timeout);
        const data = byteArrayToString(buf);
        if (client_MobRTCClient.isError(data)) {
          error(`[${tag}]: Server responded with error: ${data}`);
          return reject(`Server responded with error on: ${dc.label}`);
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          error(`[${tag}]: error parsing JSON response: `, e, buf);
          return reject(e);
        }
      } catch (e) {
        error(`[${tag}]: error reading response: `, e, buf);
        return reject(e);
      }
    });
  }
  getServerInfoChannel() {
    return this.peer.getDataChannel(SERVER_INFO_LABEL);
  }
  getPrinterChannel() {
    return this.peer.getDataChannel(PRINTER_CHANNEL_LABEL);
  }
  getJobChannel() {
    return this.peer.getDataChannel(JOB_CHANNEL_LABEL);
  }
  getTokenChannel() {
    return this.peer.getDataChannel(TOKEN_CHANNEL_LABEL);
  }
  getCapabilitiesChannel() {
    return this.peer.getDataChannel(CAPABILITIES_CHANNEL_LABEL);
  }
  getJobDetailsChannel() {
    return this.peer.getDataChannel(JOB_DETAILS_LABEL);
  }
  static isError(data) {
    return data.startsWith('ERROR:');
  }
}
function byteArrayToString(buf) {
  const utf8decode = new TextDecoder();
  return utf8decode.decode(buf);
}
function concatByteArrays(head, tail) {
  const concatResult = new Uint8Array(head.length + tail.length);
  concatResult.set(head);
  concatResult.set(tail, head.length);
  return concatResult;
}
;// CONCATENATED MODULE: ./src/scripts/cloudprint/clientbuilder.ts






const clientbuilder_SERVER_INFO_LABEL = 'SERVERINFO';
const clientbuilder_JOB_CHANNEL_LABEL = 'JOB';
const clientbuilder_JOB_DETAILS_LABEL = 'JOBDETAILS';
const clientbuilder_PRINTER_CHANNEL_LABEL = 'PRINTER';
const clientbuilder_TOKEN_CHANNEL_LABEL = 'TOKEN';
const clientbuilder_CAPABILITIES_CHANNEL_LABEL = 'CAPABILITIES';
const CLIENT_API_BASE_URL_PROD = 'https://mp.cloud.papercut.com';
const CLIENT_API_BASE_URL_TEST = 'https://mp.cloud.papercut.software';
class MobRTCClientBuilder {
  constructor(serverId) {
    this.clientId = '';
    this.timeout = 20000;
    this.shareToken = '';
    this.printToken = '';
    this.baseUrl = CLIENT_API_BASE_URL_PROD;
    this.serverId = serverId;
  }
  setClientId(clientId) {
    this.clientId = clientId;
    return this;
  }
  setTimeout(timeout) {
    this.timeout = timeout;
    return this;
  }
  setShareToken(shareToken) {
    this.shareToken = shareToken;
    return this;
  }
  setPrintToken(printToken) {
    this.printToken = printToken;
    return this;
  }
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  }
  async build() {
    let receivedAnswer = false;
    const clientCandidates = [];
    const clientToken = this.printToken || this.shareToken;
    log(`[MOB RTC Builder.${this.serverId}] Client '${this.clientId}' creating session via ${this.baseUrl} ...`);
    const {
      id,
      iceConfig
    } = await createSession(this.baseUrl, {
      clientToken,
      clientId: this.clientId
    });
    let sessionDeleted = false;
    log(`[MOB RTC Builder.${this.serverId}] ICE servers`, iceConfig.servers);
    const sessionParams = {
      clientToken,
      sessionId: id,
      clientId: this.clientId
    };
    log(`[MOB RTC Builder.${this.serverId}] starting peer connection: ` + `serverId=${this.serverId}, sessionId=${id}, clientId=${this.clientId}`);
    const peer = new Peer(this.serverId, iceConfig);
    peer.onConnectionStateChange((ctx, _) => {
      if (sessionDeleted) {
        return;
      }
      switch (ctx.getConnectionState()) {
        case 'closed':
        case 'failed':
          log(`[MOB RTC Builder.${this.serverId}] RTC connection closed, deleting session.`, 'sessionId', id);
          sessionDeleted = true;
          deleteSession(this.baseUrl, {
            ...sessionParams
          }).then(() => {
            log(`[MOB RTC Builder.${this.serverId}] Cloud session deleted.`, 'sessionId', id);
          });
          break;
        default:
          log(`[MOB RTC Builder.${this.serverId}] RTC connection state changed: ${ctx.getConnectionState()}`);
      }
    });
    peer.onICECandidate(async (ctx, ev) => {
      if (ev.candidate == null) {
        log(`[MOB RTC Builder.${this.serverId}] candidates exhausted`, id);
        return;
      }
      if (!receivedAnswer) {
        clientCandidates.push(JSON.stringify(ev.candidate));
        return;
      }
      try {
        log(`[MOB RTC Builder.${this.serverId}] found candidate, sending to remote peer`, 'candidate', ev.candidate, 'sessionId', id);
        await notifyClientCandidates(this.baseUrl, {
          ...sessionParams,
          iceCandidates: [JSON.stringify(ev.candidate)]
        });
      } catch (e) {
        ctx.close();
        await deleteSession(this.baseUrl, {
          ...sessionParams
        });
        throw e;
      }
    });
    const start = Date.now();
    const peerConnectionLive = peer.waitForLiveConnection(this.timeout);
    log(`[MOB RTC Builder.${this.serverId}] registering ice candidate send handler`);
    const offer = new Promise(res => {
      peer.onNegotiationNeeded(async (ctx, _) => {
        const offer = await ctx.createOffer();
        res(offer);
      });
    });
    const dataChannels = this.setDataChannelHandlers(peer);
    log(`[MOB RTC Builder.${this.serverId}] sending offer to remote peer`);
    await createOffer(this.baseUrl, {
      ...sessionParams,
      iceOffer: await offer
    });
    log(`[MOB RTC Builder.${this.serverId}] awaiting answer`);
    const answer = await pollGetAnswer(this.baseUrl, {
      ...sessionParams
    }, {
      interval: 500,
      timeout: 15000
    });
    if (answer == 'timeout') {
      throw new Error('could not retrieve remote answer');
    }
    log(`[MOB RTC Builder.${this.serverId}] registering remote answer locally`);
    await peer.registerAnswer(answer.iceAnswer);
    receivedAnswer = true;
    if (clientCandidates.length > 0) {
      log(`[MOB RTC Builder.${this.serverId}] sending buffered candidate to peer`);
      await notifyClientCandidates(this.baseUrl, {
        ...sessionParams,
        iceCandidates: clientCandidates
      });
    }
    this.pollForCandidates(peer, sessionParams);
    try {
      await peerConnectionLive;
    } catch (e) {
      log(`[MOB RTC Builder.${this.serverId}] Peer connection failed...`);
      throw e;
    }
    const sel = peer.getSelectedCandidatePair();
    log(`Selected peer candidates, local: ${JSON.stringify(sel.local)}, remote: ${JSON.stringify(sel.remote)}`);
    log(`[MOB RTC Builder.${this.serverId}] Peer connection is live. `, `Time to establish: ${(Date.now() - start) / 1000}s.`);
    try {
      await Promise.race([dataChannels, new Promise(res => setTimeout(res, this.timeout))]);
    } catch (e) {
      throw e;
    }
    log(`[MOB RTC Builder.${this.serverId}] Creating Mobility Cloud client: 
			version=${GetClientVersionID()},
			sessionId=${sessionParams.sessionId}
			clientId=${sessionParams.clientId}
			timeout=${this.timeout}ms, 
			maxChunkSize=${iceConfig.maxChunkSize}`);
    return new MobRTCClient(sessionParams.sessionId, peer, this.timeout, iceConfig.maxChunkSize, GetClientVersionID());
  }
  pollForCandidates(peer, sessionParams, timeoutMs = 20000) {
    log(`[MOB RTC Builder.${this.serverId}]`, `session '${sessionParams.sessionId}' starting polling for server candidates...`);
    new Promise(async res => {
      let time = 0;
      let shouldBreak = false;
      setTimeout(() => {
        shouldBreak = true;
      }, timeoutMs);
      while (true) {
        const {
          iceCandidates,
          updated
        } = await getServerCandidates(this.baseUrl, {
          ...sessionParams,
          since: time
        });
        time = updated;
        iceCandidates.forEach(c => {
          log(`[MOB RTC Builder.${this.serverId}] session '${sessionParams.sessionId}' got candidate`, c);
          const candidate = JSON.parse(c);
          peer.addIceCandidate(candidate);
        });
        await delay(500);
        if (shouldBreak) {
          break;
        }
      }
      res();
    }).then(_ => {
      log(`[MOB RTC Builder.${this.serverId}]`, `session '${sessionParams.sessionId}' stopped waiting for more server candidates`);
    });
  }
  setDataChannelHandler(peer, label) {
    const channel = peer.createDataChannel(label);
    channel.onClose((ctx, _) => {
      log(`[MOB RTC Client] [${ctx.label}] datachannel closed`);
    });
    channel.onError((ctx, ev) => {
      if (ev.error.message == 'Transport channel closed') {} else {
        log(`[MOB RTC Client] [${ctx.label}] datachannel error`, ev.error.errorDetail);
      }
    });
    return new Promise(resolve => {
      channel.onOpen((ctx, _) => {
        log(`[MOB RTC Client] [${ctx.label}] datachannel open and ready`);
        resolve();
      });
    });
  }
  setDataChannelHandlers(peer) {
    return Promise.all([this.setDataChannelHandler(peer, clientbuilder_SERVER_INFO_LABEL), this.setDataChannelHandler(peer, clientbuilder_CAPABILITIES_CHANNEL_LABEL), this.setDataChannelHandler(peer, clientbuilder_TOKEN_CHANNEL_LABEL), this.setDataChannelHandler(peer, clientbuilder_PRINTER_CHANNEL_LABEL), this.setDataChannelHandler(peer, clientbuilder_JOB_CHANNEL_LABEL), this.setDataChannelHandler(peer, clientbuilder_JOB_DETAILS_LABEL)]);
  }
}
async function delay(ms) {
  return new Promise(res => setTimeout(() => {
    chrome.runtime.sendMessage({
      msg: 'keep active'
    });
    res();
  }, ms));
}
async function pollGetAnswer(baseUrl, req, pollOptions) {
  let shouldBreak = false;
  const timeout = setTimeout(() => {
    shouldBreak = true;
  }, pollOptions.timeout);
  while (true) {
    if (shouldBreak) {
      break;
    }
    const response = await getAnswer(baseUrl, req);
    if (response !== 'pending') {
      clearTimeout(timeout);
      return response;
    }
    await delay(pollOptions.interval);
  }
  return 'timeout';
}
;// CONCATENATED MODULE: ./src/scripts/cloudprint/index.ts



;// CONCATENATED MODULE: ./src/scripts/printer/capabilities.ts
const defaultColorOptions = [{
  type: 'STANDARD_COLOR',
  is_default: true
}, {
  type: 'STANDARD_MONOCHROME'
}];
const defaultDuplexOptions = [{
  type: 'NO_DUPLEX',
  is_default: true
}, {
  type: 'LONG_EDGE'
}, {
  type: 'SHORT_EDGE'
}];
const defaultPaperSize = 'A4';
const defaultMediaSizes = [{
  name: 'ISO_A0',
  width_microns: 841000,
  height_microns: 1189000,
  is_default: false,
  custom_display_name: 'A0'
}, {
  name: 'ISO_A1',
  width_microns: 594000,
  height_microns: 841000,
  is_default: false,
  custom_display_name: 'A1'
}, {
  name: 'ISO_A2',
  width_microns: 420000,
  height_microns: 594000,
  is_default: false,
  custom_display_name: 'A2'
}, {
  name: 'ISO_A3',
  width_microns: 297000,
  height_microns: 420000,
  is_default: false,
  custom_display_name: 'A3'
}, {
  name: 'ISO_A4',
  width_microns: 210000,
  height_microns: 297000,
  is_default: 'A4' === defaultPaperSize.toUpperCase(),
  custom_display_name: 'A4'
}, {
  name: 'ISO_A5',
  width_microns: 148000,
  height_microns: 210000,
  is_default: false,
  custom_display_name: 'A5'
}, {
  name: 'ISO_A6',
  width_microns: 105000,
  height_microns: 148000,
  is_default: false,
  custom_display_name: 'A6'
}, {
  name: 'ISO_A7',
  width_microns: 74000,
  height_microns: 105000,
  is_default: false,
  custom_display_name: 'A7'
}, {
  name: 'ISO_A8',
  width_microns: 52000,
  height_microns: 74000,
  is_default: false,
  custom_display_name: 'A8'
}, {
  name: 'ISO_A9',
  width_microns: 37000,
  height_microns: 52000,
  is_default: false,
  custom_display_name: 'A9'
}, {
  name: 'ISO_A10',
  width_microns: 26000,
  height_microns: 37000,
  is_default: false,
  custom_display_name: 'A10'
}, {
  name: 'JIS_B0',
  width_microns: 1030000,
  height_microns: 1456000,
  is_default: false,
  custom_display_name: 'JIS B0'
}, {
  name: 'JIS_B1',
  width_microns: 728000,
  height_microns: 1030000,
  is_default: false,
  custom_display_name: 'JIS B1'
}, {
  name: 'JIS_B2',
  width_microns: 515000,
  height_microns: 728000,
  is_default: false,
  custom_display_name: 'JIS B2'
}, {
  name: 'JIS_B3',
  width_microns: 364000,
  height_microns: 515000,
  is_default: false,
  custom_display_name: 'JIS B3'
}, {
  name: 'JIS_B4',
  width_microns: 257000,
  height_microns: 364000,
  is_default: false,
  custom_display_name: 'JIS B4'
}, {
  name: 'JIS_B5',
  width_microns: 182000,
  height_microns: 257000,
  is_default: false,
  custom_display_name: 'JIS B5'
}, {
  name: 'JIS_B6',
  width_microns: 128000,
  height_microns: 182000,
  is_default: false,
  custom_display_name: 'JIS B6'
}, {
  name: 'JIS_B7',
  width_microns: 91000,
  height_microns: 128000,
  is_default: false,
  custom_display_name: 'JIS B7'
}, {
  name: 'JIS_B8',
  width_microns: 64000,
  height_microns: 91000,
  is_default: false,
  custom_display_name: 'JIS B8'
}, {
  name: 'JIS_B9',
  width_microns: 45000,
  height_microns: 64000,
  is_default: false,
  custom_display_name: 'JIS B9'
}, {
  name: 'JIS_B10',
  width_microns: 32000,
  height_microns: 45000,
  is_default: false,
  custom_display_name: 'JIS B10'
}, {
  name: 'ISO_B0',
  width_microns: 1000000,
  height_microns: 1414000,
  is_default: false,
  custom_display_name: 'ISO B0'
}, {
  name: 'ISO_B1',
  width_microns: 707000,
  height_microns: 1000000,
  is_default: false,
  custom_display_name: 'ISO B1'
}, {
  name: 'ISO_B2',
  width_microns: 500000,
  height_microns: 707000,
  is_default: false,
  custom_display_name: 'ISO B2'
}, {
  name: 'ISO_B3',
  width_microns: 353000,
  height_microns: 500000,
  is_default: false,
  custom_display_name: 'ISO B3'
}, {
  name: 'ISO_B4',
  width_microns: 250000,
  height_microns: 353000,
  is_default: false,
  custom_display_name: 'ISO B4'
}, {
  name: 'ISO_B5',
  width_microns: 176000,
  height_microns: 250000,
  is_default: false,
  custom_display_name: 'ISO B5'
}, {
  name: 'ISO_B6',
  width_microns: 125000,
  height_microns: 176000,
  is_default: false,
  custom_display_name: 'ISO B6'
}, {
  name: 'ISO_B7',
  width_microns: 88000,
  height_microns: 125000,
  is_default: false,
  custom_display_name: 'ISO B7'
}, {
  name: 'ISO_B8',
  width_microns: 62000,
  height_microns: 88000,
  is_default: false,
  custom_display_name: 'ISO B8'
}, {
  name: 'ISO_B9',
  width_microns: 44000,
  height_microns: 62000,
  is_default: false,
  custom_display_name: 'ISO B9'
}, {
  name: 'ISO_B10',
  width_microns: 31000,
  height_microns: 44000,
  is_default: false,
  custom_display_name: 'ISO B10'
}, {
  name: 'NA_LETTER',
  width_microns: 215900,
  height_microns: 279400,
  is_default: false,
  custom_display_name: 'Letter'
}, {
  name: 'NA_LEGAL',
  width_microns: 215900,
  height_microns: 355600,
  is_default: false,
  custom_display_name: 'Legal'
}, {
  name: 'NA_5X7',
  width_microns: 127000,
  height_microns: 177800,
  is_default: false,
  custom_display_name: '5X7'
}, {
  name: 'NA_EXECUTIVE',
  width_microns: 184150,
  height_microns: 266700,
  is_default: false,
  custom_display_name: 'Executive'
}, {
  name: 'NA_INVOICE',
  width_microns: 139700,
  height_microns: 215900,
  is_default: false,
  custom_display_name: 'Invoice'
}, {
  name: 'NA_LEDGER',
  width_microns: 279400,
  height_microns: 431800,
  is_default: false,
  custom_display_name: 'Ledger'
}];
function createPrinterCapabilities(colorOptions = defaultColorOptions, duplexOptions = defaultDuplexOptions, mediaSizes = defaultMediaSizes) {
  return {
    version: '1.0',
    printer: {
      supported_content_type: [{
        content_type: 'application/pdf'
      }],
      color: {
        option: colorOptions
      },
      duplex: {
        option: duplexOptions
      },
      page_orientation: {
        option: [{
          type: 'PORTRAIT',
          is_default: true
        }, {
          type: 'LANDSCAPE',
          is_default: false
        }, {
          type: 'AUTO',
          is_default: false
        }]
      },
      copies: {
        default: 1,
        max: 100
      },
      media_size: {
        option: mediaSizes
      }
    }
  };
}
function capabilities_parseMobilityPrintCapabilities(capabilities) {
  const mediaSizes = capabilities.mediaSizes.map(m => ({
    name: 'CUSTOM',
    width_microns: m.widthMicrons,
    height_microns: m.heightMicrons,
    is_default: m.isDefault,
    custom_display_name: m.customDisplayName || m.name
  }));
  if (mediaSizes.length > 0 && mediaSizes.every(function (m) {
    return !m.is_default;
  })) {
    mediaSizes[0].is_default = true;
  }
  const colorOptions = capabilities.color.map(function (n) {
    return {
      type: n
    };
  });
  if (colorOptions.length > 0) {
    colorOptions[0]['is_default'] = true;
  }
  const duplexOptions = capabilities.duplex.map(function (n) {
    return {
      type: n
    };
  });
  if (duplexOptions.length > 0) {
    duplexOptions[0]['is_default'] = true;
  }
  return createPrinterCapabilities(colorOptions, duplexOptions, mediaSizes);
}
;// CONCATENATED MODULE: ./src/scripts/storage/storage.ts
async function getManagedStorageData(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.managed.get(key, function (data) {
      if (data && data[key]) {
        resolve(data[key]);
      } else if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(undefined);
      }
    });
  });
}
async function storage_getLocalStorageData(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, result => {
      if (result && result[key]) {
        resolve(result[key]);
      } else if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(undefined);
      }
    });
  });
}
async function removeLocalStorageData(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
async function storage_setLocalStorageData(key, data) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      [key]: data
    }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(data);
      }
    });
  });
}
async function saveMap(key, map) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      [key]: Array.from(map.entries())
    }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(key);
      }
    });
  });
}
async function storage_loadMap(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, d => {
      if (d && d[key]) {
        const map = new Map();
        for (const [k, v] of d[key]) {
          map.set(k, v);
        }
        resolve(map);
      } else if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(undefined);
      }
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/wait.ts
async function sleep(millis) {
  return new Promise(r => setTimeout(r, millis));
}
async function waitForCondition(condTestFunc, sleepMillis = 1000, sleepMaxMillis = 60000) {
  const started = performance.now();
  while (!condTestFunc()) {
    if (performance.now() - started > sleepMaxMillis) {
      return false;
    }
    await sleep(sleepMillis);
  }
  return true;
}
async function workerWaitUntil(promise) {
  const keepAlive = setInterval(function () {
    console.log('Keep-alive');
    chrome.runtime.getPlatformInfo();
  }, 25 * 1000);
  const startTime = Date.now();
  try {
    console.log('Waiting with keep-alive...');
    return await promise;
  } catch (e) {
    console.log('Wait completed with error:', e);
  } finally {
    console.log(`Finished waiting with keep-alive, elapsed: ${(Date.now() - startTime) / 1000}seconds`);
    clearInterval(keepAlive);
  }
}
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offnetworkcache.ts





const printerCapabilitiesCache = new Map();
const serverIdToClientCache = new Map();
const storageKeyServerIdToInfoCache = 'serverIdToInfoCache';
const serverIdToInfoCache = new Map();
const storageKeyPrinterTimeUsedMap = 'printerTimeUsedMap';
const storageKeyPrinterCapabilitiesMap = 'printerCapabilitiesMap';
const storageKeyPrinterServerMap = 'printerServerMap';
const storageKeyPrintTokenCache = 'printTokenCache';
const printerTimeUsedMap = new Map();
const printerNameToServerIdCache = new Map();
const printTokenCache = new Map();
const storageKeyReclaimStorageLimitKb = 'reclaimStorageLimitKb';
const storageKeyPrintedOlderThanDays = 'printedOlderThanDays';
let reclaimStorageLimitKb;
let printedOlderThanDays;
let cacheLoaded = false;
async function offnetworkcache_initCache() {
  const [storageLimit, printedAge] = await Promise.all([getLocalStorageData(storageKeyReclaimStorageLimitKb).then(v => v ? +v : 4096), getLocalStorageData(storageKeyPrintedOlderThanDays).then(v => v ? +v : 30)]);
  reclaimStorageLimitKb = storageLimit;
  printedOlderThanDays = printedAge;
  log(`Local storage cleanup settings: reclaimStorageLimitKb=${reclaimStorageLimitKb} KiB, ` + `printedOlderThanDays=${printedOlderThanDays} days`);
  populateCache(reclaimStorageLimitKb, printedOlderThanDays);
}
function getServerIdToClientCache() {
  return serverIdToClientCache;
}
function offnetworkcache_getServerIdToServerInfoCache() {
  return serverIdToInfoCache;
}
function offnetworkcache_getPrinterNameToServerIdCache() {
  return printerNameToServerIdCache;
}
function offnetworkcache_getPrintTokenCache() {
  return printTokenCache;
}
function updatePrintToken(printTokenCacheID, printToken) {
  if (!printToken) {
    log_warn('updatePrintToken: Print token is not provided');
  }
  log_log(` updatePrintToken: Saving print token for: ${printTokenCacheID}`);
  offnetworkcache_getPrintTokenCache().set(printTokenCacheID, printToken);
  saveMapToStorage(storageKeyPrintTokenCache, printTokenCache).then(() => log_log(` updatePrintToken: Updated print token for: ${printTokenCacheID}`));
}
function updateServerInfo(serverId, serverInfo) {
  const idToServerInfoCache = offnetworkcache_getServerIdToServerInfoCache();
  idToServerInfoCache.set(serverId, serverInfo);
  saveMapToStorage(storageKeyServerIdToInfoCache, idToServerInfoCache).then(() => log_log(`Updated info for server '${serverId}: ${JSON.stringify(serverInfo)}...`));
}
function populateCache(reclaimStorageLimitKb, printedOlderThanDays) {
  Promise.all([loadMapFromStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), loadMapFromStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache), loadMapFromStorage(storageKeyPrinterServerMap, printerNameToServerIdCache), loadMapFromStorage(storageKeyPrintTokenCache, printTokenCache), loadMapFromStorage(storageKeyServerIdToInfoCache, serverIdToInfoCache)]).then(() => {
    chrome.storage.local.getBytesInUse(bytesInUse => {
      log(`[OffNetworkCache:populateCache] total cached storage: ${(bytesInUse / 1024).toFixed(2)}KiB`);
      if (bytesInUse / 1024 >= reclaimStorageLimitKb) {
        warn(`Exceeded storage limit threshold of ${reclaimStorageLimitKb}KiB, 
					cleanup capabilities for printers not used in ${printedOlderThanDays} days...`);
        cleanupStorage(printedOlderThanDays).then(() => log(`Completed cleanup of printers used > ${printedOlderThanDays} days`));
      }
      cacheLoaded = true;
      log('[OffNetworkCache:populateCache] completed.');
    });
  });
}
async function loadMapFromStorage(key, toMap) {
  try {
    const map = await loadMap(key);
    if (map) {
      copyToMap(map, toMap);
      log(`Loaded '${key}' with ${map.size} items from local storage...`);
    } else {
      log(`Unable to load '${key} from local storage - it does not exist`);
    }
  } catch (reason) {
    return error(`Unable to load '${key}' from local storage: ${reason}`);
  }
}
async function saveMapToStorage(key, map) {
  try {
    await saveMap(key, map);
    return log_log(`Saved '${key}' with ${map.size} items to local storage...`);
  } catch (reason) {
    log_error(`Failed to save data to local storage: ${reason}`);
    if (reason && reason.toLowerCase().includes('quota')) {
      cleanupStorage(printedOlderThanDays).then(() => log_log(`Completed cleanup of printers used > ${printedOlderThanDays} days`));
    }
  }
}
function copyToMap(src, dst) {
  dst.clear();
  src.forEach((value, key) => dst.set(key, value));
}
function daysAgo(timestampMillis) {
  const millisPerDay = 1000 * 60 * 60 * 24;
  if (timestampMillis === undefined) {
    return undefined;
  }
  return (Date.now() - timestampMillis) / millisPerDay;
}
async function cleanupStorage(printedOlderThanDays) {
  log_log(`[OffNetworkCache:cleanupStorage] Storage cleanup requested, printing threshold=${printedOlderThanDays}days`);
  chrome.storage.local.getBytesInUse(usedBytes => {
    log_log(`[OffNetworkCache:cleanupStorage] Storage cleanup, ${(usedBytes / 1024).toFixed(2)}KiB used`);
    log_log(`[OffNetworkCache:cleanupStorage] ${printerCapabilitiesCache.size} printer capabilities cached`);
  });
  for (const printerId of printerCapabilitiesCache.keys()) {
    const printerName = printerNameFromUrl(printerId);
    const unusedPrinter = printerName == undefined || (await offnetworkcache_getServerIdForPrinter(printerId)) === undefined;
    const printedDays = daysAgo(printerTimeUsedMap.get(printerId));
    let discard = false;
    if (unusedPrinter) {
      log_log(`[OffNetworkCache:cleanupStorage] Discarding unused printer capability: ${printerName}`);
      discard = true;
    } else if (printedDays === undefined || printedDays > printedOlderThanDays) {
      log_log(`[OffNetworkCache:cleanupStorage] Discarding printer capability older than ${printedOlderThanDays} days: 
			${printerName}, last printed: ${printedDays ? printedDays.toFixed(0) + ' days ago' : 'never'}`);
      discard = true;
    }
    if (discard) {
      printerTimeUsedMap.delete(printerId);
      printerCapabilitiesCache.delete(printerId);
    }
  }
  log_log(`[OffNetworkCache:cleanupStorage] ${printerCapabilitiesCache.size} printer capabilities after clean-up`);
  Promise.all([saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), saveMapToStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache)]).then(() => {
    chrome.storage.local.getBytesInUse(bytesInUse => {
      log_log(`[OffNetworkCache:cleanupStorage] Cleanup complete, ${(bytesInUse / 1024).toFixed(2)}KiB used`);
    });
  });
}
async function offnetworkcache_updatePrinterCache(serverId, printers) {
  for (const printer of printers) {
    printerCapabilitiesCache.set(printer.id, printer.capabilities);
    printerNameToServerIdCache.set(printer.name, serverId);
  }
  await Promise.all([saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap), saveMapToStorage(storageKeyPrinterCapabilitiesMap, printerCapabilitiesCache), saveMapToStorage(storageKeyPrinterServerMap, printerNameToServerIdCache)]).catch(e => {
    log_error(`Failed to save data caches to storage: ${e.name} - ${e.message}`);
  });
}
function getPrinterCapabilities(printerId) {
  const cap = printerCapabilitiesCache.get(printerId);
  if (!cap) {
    log(`Cached printer capability for '${printerId}' missing from cache!`);
    return null;
  }
  log(`Found cached printer capabilities for: ${printerId} => ${JSON.stringify(cap)}`);
  return parseMobilityPrintCapabilities(cap);
}
function offnetworkcache_updateLastPrintedTime(printerUrl) {
  printerTimeUsedMap.set(printerUrl, Date.now());
  saveMapToStorage(storageKeyPrinterTimeUsedMap, printerTimeUsedMap).then(() => {
    log(`Saved last printed date for: ${printerUrl}`);
  });
}
async function offnetworkcache_getServerIdForPrinter(printerUrl) {
  const printerName = printerNameFromUrl(printerUrl);
  if (!printerName) {
    return undefined;
  }
  const ready = await waitForCondition(() => {
    log_log('[OffNetworkCache:getServerIdForPrinter] Waiting for cache to be loaded and ready...');
    return cacheLoaded;
  });
  if (!ready) {
    log_error('[OffNetworkCache:getServerIdForPrinter] Giving up waited for cache to be ready...');
    return undefined;
  }
  for (const [cachedPrinterName, serverId] of printerNameToServerIdCache) {
    if (cachedPrinterName.startsWith(printerName)) {
      return serverId;
    }
  }
  return undefined;
}
function printerNameFromUrl(printerUrl) {
  try {
    const urlPath = new URL(printerUrl).pathname;
    const lastSlash = urlPath.lastIndexOf('/');
    return decodeURIComponent(urlPath.substring(lastSlash + 1));
  } catch (e) {
    log_error(`Cannot find printer name - invalid URL: ${printerUrl}`, e);
    return undefined;
  }
}
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offnetwork-utils.ts




const LINKS_STORAGE_KEY = 'CloudPrintInviteLinks';
const CLOUD_PRINT_ERR = 'Cloud Print error';
async function initCloudPrint() {
  log('[OffNetwork] Initializing Cloud Print');
  await getClientId();
  return initCache();
}
function isCloudPrintError(e) {
  if (typeof e === 'string') {
    return e.includes(CLOUD_PRINT_ERR);
  }
  return e && e.message && e.message.includes(CLOUD_PRINT_ERR);
}
async function saveBYODLink(link) {
  const links = await getAllLinks();
  if (!links.includes(link)) {
    log(`no existing link found, saving the received link as a BYOD link: ${link}`);
    const byodLinks = await getBYODLinks();
    byodLinks.push(link);
    chrome.storage.local.set({
      CloudPrintInviteLinks: byodLinks
    });
  } else {
    log('found existing link');
  }
}
function getBYODLinks() {
  return new Promise(res => {
    chrome.storage.local.get(LINKS_STORAGE_KEY, data => {
      if (data && data[LINKS_STORAGE_KEY]) {
        log(`getting ${data[LINKS_STORAGE_KEY].length} BYOD link(s)...`);
        return res(data[LINKS_STORAGE_KEY]);
      } else {
        log('no BYOD links found');
        res([]);
      }
    });
  });
}
function getManagedLinks() {
  return new Promise(res => {
    chrome.storage.managed.get(LINKS_STORAGE_KEY, data => {
      if (data && data[LINKS_STORAGE_KEY]) {
        log(`getting ${data[LINKS_STORAGE_KEY].length} managed link(s)...`);
        return res(data[LINKS_STORAGE_KEY]);
      } else {
        log('no managed links found');
        return res([]);
      }
    });
  });
}
async function getAllLinks() {
  const storedLinks = await getManagedLinks();
  const byodLinks = await getBYODLinks();
  return storedLinks.concat(byodLinks);
}
async function offnetwork_utils_getOffNetworkLinks() {
  const allLinks = await getAllLinks();
  const links = allLinks.map(s => {
    try {
      return CloudPrintLink.parse(s);
    } catch (e) {
      error('Failed to parse Cloud Print link.', 'link', s, e);
    }
  }).filter(res => res != null);
  log('Parsed Cloud Print links.', links.map(l => l.orgId + '/' + l.serverId + ' ' + (l.expires() ? `(expiry: ${l.expiry.toISOString()})` : '(no expiry)')));
  return links;
}
function offnetwork_utils_getPrintTokenCacheID(serverId, shareToken) {
  return serverId + ':' + shareToken;
}
async function offnetwork_utils_getShareToken(serverId) {
  return (await offnetwork_utils_getLink(serverId)).shareToken;
}
async function offnetwork_utils_getLink(serverId) {
  const link = (await offnetwork_utils_getOffNetworkLinks()).find(link => link.serverId == serverId);
  if (!link) {
    throw new Error(`no link for server ${serverId}`);
  }
  return link;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.match-all.js
var es_string_match_all = __webpack_require__(9866);
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offscreen-utils.ts


const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';
let offScreenDocumentCheck = Promise.resolve();
async function getOffScreenDocument() {
  offScreenDocumentCheck = offScreenDocumentCheck.then(async () => {
    if (!(await hasDocument())) {
      log('[Offscreen] creating offscreen document...');
      try {
        await chrome.offscreen.createDocument({
          url: OFFSCREEN_DOCUMENT_PATH,
          reasons: [chrome.offscreen.Reason.WEB_RTC],
          justification: 'WebRTC for Mobility Cloud Print'
        });
      } catch (error) {
        if (!error.message.startsWith('Only a single offscreen document')) {
          throw error;
        }
      }
    }
  });
  return offScreenDocumentCheck;
}
async function offscreen_utils_messageOffScreen(data) {
  await getOffScreenDocument();
  const clientUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
  const messageClient = (await self.clients.matchAll({
    includeUncontrolled: true
  })).find(c => c.url === clientUrl);
  const messageChannel = new MessageChannel();
  messageClient.postMessage(data, [messageChannel.port2]);
  const {
    data: offscreenResponse
  } = await new Promise(cb => messageChannel.port1.onmessage = cb);
  log(`[Offscreen.${data.MsgType}] got response`, offscreenResponse);
  return offscreenResponse;
}
async function hasDocument() {
  const clientWindows = await self.clients.matchAll();
  log('[Offscreen] checking for offscreen window...', clientWindows);
  for (const clientWindow of clientWindows) {
    if (clientWindow.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
      log('[Offscreen] found existing offscreen document', clientWindow);
      return true;
    }
  }
  log('[Offscreen] could not find existing offscreen document');
  return false;
}
try {
  chrome.runtime.onSuspend.addListener(() => {
    chrome.offscreen.closeDocument().then(() => {
      log_log('[Offscreen] document closed on extension unload');
    }).catch(error => {
      error('Failed to close offscreen document on unload:', error);
    });
  });
} catch (e) {
  console.log(`Error: ${e}`);
}
;// CONCATENATED MODULE: ./src/scripts/offnetwork/offnetwork_extension.ts







try {
  chrome.runtime.onMessage.addListener(handleMessages);
} catch (e) {
  console.log(`Error: ${e}`);
}
async function handleMessages(message) {
  if (message.target !== 'background') {
    return;
  }
  switch (message.type) {
    case 'log':
      {
        log_log(message.data);
        break;
      }
    case 'error':
      {
        log_error(message.data);
        break;
      }
    case 'warn':
      {
        log_warn(message.data);
        break;
      }
    case 'cache-server-info':
      {
        log_log(`[offscreen.${message.type}] cache server info: ${message.data.ServerID}`);
        updateServerInfo(message.data.ServerID, message.data.ServerInfo);
        break;
      }
    case 'update-print-token-cache':
      {
        log_log(`[offscreen.${message.type}] cache print token for server: ${message.data.ServerID}`);
        updatePrintToken(offnetwork_utils_getPrintTokenCacheID(message.data.ServerID, message.data.ShareToken), message.data.PrintToken);
        break;
      }
    case 'delete-print-token-cache':
      {
        log_log(`[offscreen.${message.type}] remove print token for server: ${message.data.ServerID}`);
        offnetworkcache_getPrintTokenCache().delete(offnetwork_utils_getPrintTokenCacheID(message.data.ServerID, message.data.ShareToken));
        break;
      }
    case 'update-printer-cache':
      {
        log_log(`[offscreen.${message.type}] update cached printers for server: ${message.data.ServerID}`);
        await offnetworkcache_updatePrinterCache(message.data.ServerID, message.data.PrinterList);
        break;
      }
    default:
      console.warn(`Unexpected message received for background script: '${JSON.stringify(message)}'.`);
  }
}
async function getPrintersFromAllServers() {
  let links;
  try {
    links = await getOffNetworkLinks();
  } catch (e) {
    error('[OffNetwork:getPrintersFromAllServers] failed to get links: ', e);
  }
  if (links.length === 0) {
    log('[OffNetwork:getPrintersFromAllServers] No Cloud Print links, skipping Cloud Print discovery.');
    return [];
  }
  log('[OffNetwork:getPrintersFromAllServers] links', links);
  const serverIds = new Set(links.map(link => link.serverId));
  const printerNameToServerIdCache = getPrinterNameToServerIdCache();
  for (const [printerName, serverId] of printerNameToServerIdCache.entries()) {
    if (!serverIds.has(serverId)) {
      printerNameToServerIdCache.delete(printerName);
    }
  }
  const printerResults = [...serverIds].map(async serverId => {
    try {
      const printers = await getPrintersFromServer(serverId);
      log(`[OffNetwork:getPrintersFromAllServers] got ${printers.length} printers from '${serverId}'`, printers);
      return printers;
    } catch (e) {
      error(`[OffNetwork:getPrintersFromAllServers] failed for ${serverId}: `, e);
      return [];
    }
  });
  const result = (await Promise.all(printerResults)).flat(Infinity);
  log(`[OffNetwork:getPrintersFromAllServers] completed with ${result.length} Cloud Print printers.`);
  return result;
}
async function offnetwork_extension_getServerInfoRTC(serverId) {
  log(`[OffNetwork:getServerInfoRTC] Requesting server info: ${serverId}`);
  const shareToken = await getShareToken(serverId);
  const printTokenCacheID = getPrintTokenCacheID(serverId, shareToken);
  const printToken = getPrintTokenCache().get(printTokenCacheID);
  const clientId = await getClientId();
  const data = {
    ServerID: serverId,
    ClientID: clientId,
    TestEnv: (await getLink(serverId)).testEnv,
    ShareToken: shareToken,
    PrintToken: printToken,
    MsgType: 'get-server-info-rtc'
  };
  const serverInfo = await messageOffScreen(data);
  if (!serverInfo.RespState) {
    error('[OffNetwork:getServerInfoRTC] server info fetch error ', serverInfo.RespData);
    throw new Error(serverInfo.RespData);
  }
  return serverInfo.RespData;
}
async function getPrintersFromServer(serverId) {
  log(`[OffNetwork:getPrintersFromServer] fetching printers for server '${serverId}'...`);
  const shareToken = await getShareToken(serverId);
  const printTokenCacheID = getPrintTokenCacheID(serverId, shareToken);
  const printToken = getPrintTokenCache().get(printTokenCacheID);
  const clientId = await getClientId();
  const data = {
    ServerID: serverId,
    ClientID: clientId,
    TestEnv: (await getLink(serverId)).testEnv,
    ShareToken: shareToken,
    PrintToken: printToken,
    MsgType: 'get-printers-from-server'
  };
  const printerResult = await messageOffScreen(data);
  if (!printerResult.RespState) {
    error('[OffNetwork:getPrintersFromServer] cloud print job submit error (promise reject): ', printerResult.RespData);
    throw new Error(printerResult.RespData);
  }
  await updatePrinterCache(serverId, printerResult.RespData);
  return printerResult.RespData;
}
async function getPrinterInfoRTC(printerId) {
  log(`[OffNetwork:getPrinterInfoRTC] Requesting printer info: ${printerId}`);
  const serverId = await getServerIdForPrinter(printerId);
  if (!serverId) {
    throw new Error(`unknown server id for printer: ${printerId}`);
  }
  const shareToken = await getShareToken(serverId);
  const printTokenCacheID = getPrintTokenCacheID(serverId, shareToken);
  const printToken = getPrintTokenCache().get(printTokenCacheID);
  const clientId = await getClientId();
  const data = {
    PrinterID: printerId,
    ServerID: serverId,
    ClientID: clientId,
    TestEnv: (await getLink(serverId)).testEnv,
    ShareToken: shareToken,
    PrintToken: printToken,
    MsgType: 'get-printer-info-rtc'
  };
  const capabilities = await messageOffScreen(data);
  if (!capabilities.RespState) {
    error('[OffNetwork:getCapabilitiesOffNetwork] cloud printer capabilities fetch error ', capabilities.RespData);
    throw new Error('Error fetching capabilities via cloud client');
  }
  log('[getPrinterInfoRTC] Received printer capabilities.', capabilities.RespData);
  return capabilities.RespData;
}
async function submitPrintJobRTC(file, printerUrl, params) {
  const serverId = await getServerIdForPrinter(printerUrl);
  if (!serverId) {
    throw new Error(`unknown server id for printer ${printerUrl}`);
  }
  log('[OffNetwork:submitPrintJobRTC]', 'serverId', serverId, 'params', {
    ...params,
    credentials: '[REDACTED]'
  });
  const shareToken = await getShareToken(serverId);
  const printTokenCacheID = getPrintTokenCacheID(serverId, shareToken);
  const printToken = getPrintTokenCache().get(printTokenCacheID);
  const clientId = await getClientId();
  const data = {
    FileData: file,
    PrinterURL: printerUrl,
    Params: params,
    ServerID: serverId,
    ClientID: clientId,
    TestEnv: (await getLink(serverId)).testEnv,
    ShareToken: shareToken,
    PrintToken: printToken,
    MsgType: 'submit-print-job-rtc'
  };
  const jobDetails = await messageOffScreen(data);
  if (!jobDetails.RespState) {
    error('[OffNetwork:submitPrintJobRTC] cloud print job submit error (promise reject): ', jobDetails.RespData);
    throw new Error(jobDetails.RespData);
  }
  log('[submitPrintJobRTC] received job submit result (jobDetails) from offscreen doc: ', jobDetails.RespData);
  updateLastPrintedTime(printerUrl);
  return jobDetails.RespData;
}
;// CONCATENATED MODULE: ./src/scripts/printer/printer.ts
function printer_getUrlBaseOfPrinterUrl(printerUrl) {
  return printerUrl.replace(/\/printers\/.*/i, '');
}
function getPrinterName(printerUrl) {
  return printerUrl.slice(printerUrl.lastIndexOf('/printers/') + '/printers/'.length);
}
;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/util.js
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
function int2char(n) {
    return BI_RM.charAt(n);
}
//#region BIT_OPERATIONS
// (public) this & a
function op_and(x, y) {
    return x & y;
}
// (public) this | a
function op_or(x, y) {
    return x | y;
}
// (public) this ^ a
function op_xor(x, y) {
    return x ^ y;
}
// (public) this & ~a
function op_andnot(x, y) {
    return x & ~y;
}
// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
    if (x == 0) {
        return -1;
    }
    var r = 0;
    if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16;
    }
    if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8;
    }
    if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4;
    }
    if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
    }
    if ((x & 1) == 0) {
        ++r;
    }
    return r;
}
// return number of 1 bits in x
function cbit(x) {
    var r = 0;
    while (x != 0) {
        x &= x - 1;
        ++r;
    }
    return r;
}
//#endregion BIT_OPERATIONS

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/base64.js

var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}
// convert a base64 string to hex
function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad) {
            break;
        }
        var v = b64map.indexOf(s.charAt(i));
        if (v < 0) {
            continue;
        }
        if (k == 0) {
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 1;
        }
        else if (k == 1) {
            ret += int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        }
        else if (k == 2) {
            ret += int2char(slop);
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 3;
        }
        else {
            ret += int2char((slop << 2) | (v >> 4));
            ret += int2char(v & 0xf);
            k = 0;
        }
    }
    if (k == 1) {
        ret += int2char(slop << 2);
    }
    return ret;
}
// convert a base64 string to a byte/number array
function b64toBA(s) {
    // piggyback on b64tohex for now, optimize later
    var h = b64tohex(s);
    var i;
    var a = [];
    for (i = 0; 2 * i < h.length; ++i) {
        a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
    }
    return a;
}

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/asn1js/hex.js
// Hex JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var decoder;
var Hex = {
    decode: function (a) {
        var i;
        if (decoder === undefined) {
            var hex = "0123456789ABCDEF";
            var ignore = " \f\n\r\t\u00A0\u2028\u2029";
            decoder = {};
            for (i = 0; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            hex = hex.toLowerCase();
            for (i = 10; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
                decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 2) {
                out[out.length] = bits;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 4;
            }
        }
        if (char_count) {
            throw new Error("Hex encoding incomplete: 4 bits missing");
        }
        return out;
    }
};

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/asn1js/base64.js
// Base64 JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var base64_decoder;
var Base64 = {
    decode: function (a) {
        var i;
        if (base64_decoder === undefined) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var ignore = "= \f\n\r\t\u00A0\u2028\u2029";
            base64_decoder = Object.create(null);
            for (i = 0; i < 64; ++i) {
                base64_decoder[b64.charAt(i)] = i;
            }
            base64_decoder['-'] = 62; //+
            base64_decoder['_'] = 63; //-
            for (i = 0; i < ignore.length; ++i) {
                base64_decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = base64_decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 4) {
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                out[out.length] = bits & 0xFF;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 6;
            }
        }
        switch (char_count) {
            case 1:
                throw new Error("Base64 encoding incomplete: at least 2 bits missing");
            case 2:
                out[out.length] = (bits >> 10);
                break;
            case 3:
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                break;
        }
        return out;
    },
    re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
    unarmor: function (a) {
        var m = Base64.re.exec(a);
        if (m) {
            if (m[1]) {
                a = m[1];
            }
            else if (m[2]) {
                a = m[2];
            }
            else {
                throw new Error("RegExp out of sync");
            }
        }
        return Base64.decode(a);
    }
};

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/asn1js/int10.js
// Big integer base-10 printing library
// Copyright (c) 2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var max = 10000000000000; // biggest integer that can still fit 2^53 when multiplied by 256
var Int10 = /** @class */ (function () {
    function Int10(value) {
        this.buf = [+value || 0];
    }
    Int10.prototype.mulAdd = function (m, c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] * m + c;
            if (t < max) {
                c = 0;
            }
            else {
                c = 0 | (t / max);
                t -= c * max;
            }
            b[i] = t;
        }
        if (c > 0) {
            b[i] = c;
        }
    };
    Int10.prototype.sub = function (c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] - c;
            if (t < 0) {
                t += max;
                c = 1;
            }
            else {
                c = 0;
            }
            b[i] = t;
        }
        while (b[b.length - 1] === 0) {
            b.pop();
        }
    };
    Int10.prototype.toString = function (base) {
        if ((base || 10) != 10) {
            throw new Error("only base 10 is supported");
        }
        var b = this.buf;
        var s = b[b.length - 1].toString();
        for (var i = b.length - 2; i >= 0; --i) {
            s += (max + b[i]).toString().substring(1);
        }
        return s;
    };
    Int10.prototype.valueOf = function () {
        var b = this.buf;
        var v = 0;
        for (var i = b.length - 1; i >= 0; --i) {
            v = v * max + b[i];
        }
        return v;
    };
    Int10.prototype.simplify = function () {
        var b = this.buf;
        return (b.length == 1) ? b[0] : this;
    };
    return Int10;
}());


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/asn1js/asn1.js
// ASN.1 JavaScript decoder
// Copyright (c) 2008-2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
/*global oids */

var ellipsis = "\u2026";
var reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
var reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
function stringCut(str, len) {
    if (str.length > len) {
        str = str.substring(0, len) + ellipsis;
    }
    return str;
}
var Stream = /** @class */ (function () {
    function Stream(enc, pos) {
        this.hexDigits = "0123456789ABCDEF";
        if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
        }
        else {
            // enc should be an array or a binary string
            this.enc = enc;
            this.pos = pos;
        }
    }
    Stream.prototype.get = function (pos) {
        if (pos === undefined) {
            pos = this.pos++;
        }
        if (pos >= this.enc.length) {
            throw new Error("Requesting byte offset ".concat(pos, " on a stream of length ").concat(this.enc.length));
        }
        return ("string" === typeof this.enc) ? this.enc.charCodeAt(pos) : this.enc[pos];
    };
    Stream.prototype.hexByte = function (b) {
        return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
    };
    Stream.prototype.hexDump = function (start, end, raw) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
            if (raw !== true) {
                switch (i & 0xF) {
                    case 0x7:
                        s += "  ";
                        break;
                    case 0xF:
                        s += "\n";
                        break;
                    default:
                        s += " ";
                }
            }
        }
        return s;
    };
    Stream.prototype.isASCII = function (start, end) {
        for (var i = start; i < end; ++i) {
            var c = this.get(i);
            if (c < 32 || c > 176) {
                return false;
            }
        }
        return true;
    };
    Stream.prototype.parseStringISO = function (start, end) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += String.fromCharCode(this.get(i));
        }
        return s;
    };
    Stream.prototype.parseStringUTF = function (start, end) {
        var s = "";
        for (var i = start; i < end;) {
            var c = this.get(i++);
            if (c < 128) {
                s += String.fromCharCode(c);
            }
            else if ((c > 191) && (c < 224)) {
                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
            }
            else {
                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
            }
        }
        return s;
    };
    Stream.prototype.parseStringBMP = function (start, end) {
        var str = "";
        var hi;
        var lo;
        for (var i = start; i < end;) {
            hi = this.get(i++);
            lo = this.get(i++);
            str += String.fromCharCode((hi << 8) | lo);
        }
        return str;
    };
    Stream.prototype.parseTime = function (start, end, shortYear) {
        var s = this.parseStringISO(start, end);
        var m = (shortYear ? reTimeS : reTimeL).exec(s);
        if (!m) {
            return "Unrecognized time: " + s;
        }
        if (shortYear) {
            // to avoid querying the timer, use the fixed range [1970, 2069]
            // it will conform with ITU X.400 [-10, +40] sliding window until 2030
            m[1] = +m[1];
            m[1] += (+m[1] < 70) ? 2000 : 1900;
        }
        s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
        if (m[5]) {
            s += ":" + m[5];
            if (m[6]) {
                s += ":" + m[6];
                if (m[7]) {
                    s += "." + m[7];
                }
            }
        }
        if (m[8]) {
            s += " UTC";
            if (m[8] != "Z") {
                s += m[8];
                if (m[9]) {
                    s += ":" + m[9];
                }
            }
        }
        return s;
    };
    Stream.prototype.parseInteger = function (start, end) {
        var v = this.get(start);
        var neg = (v > 127);
        var pad = neg ? 255 : 0;
        var len;
        var s = "";
        // skip unuseful bits (not allowed in DER)
        while (v == pad && ++start < end) {
            v = this.get(start);
        }
        len = end - start;
        if (len === 0) {
            return neg ? -1 : 0;
        }
        // show bit length of huge integers
        if (len > 4) {
            s = v;
            len <<= 3;
            while (((+s ^ pad) & 0x80) == 0) {
                s = +s << 1;
                --len;
            }
            s = "(" + len + " bit)\n";
        }
        // decode the integer
        if (neg) {
            v = v - 256;
        }
        var n = new Int10(v);
        for (var i = start + 1; i < end; ++i) {
            n.mulAdd(256, this.get(i));
        }
        return s + n.toString();
    };
    Stream.prototype.parseBitString = function (start, end, maxLength) {
        var unusedBit = this.get(start);
        var lenBit = ((end - start - 1) << 3) - unusedBit;
        var intro = "(" + lenBit + " bit)\n";
        var s = "";
        for (var i = start + 1; i < end; ++i) {
            var b = this.get(i);
            var skip = (i == end - 1) ? unusedBit : 0;
            for (var j = 7; j >= skip; --j) {
                s += (b >> j) & 1 ? "1" : "0";
            }
            if (s.length > maxLength) {
                return intro + stringCut(s, maxLength);
            }
        }
        return intro + s;
    };
    Stream.prototype.parseOctetString = function (start, end, maxLength) {
        if (this.isASCII(start, end)) {
            return stringCut(this.parseStringISO(start, end), maxLength);
        }
        var len = end - start;
        var s = "(" + len + " byte)\n";
        maxLength /= 2; // we work in bytes
        if (len > maxLength) {
            end = start + maxLength;
        }
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
        }
        if (len > maxLength) {
            s += ellipsis;
        }
        return s;
    };
    Stream.prototype.parseOID = function (start, end, maxLength) {
        var s = "";
        var n = new Int10();
        var bits = 0;
        for (var i = start; i < end; ++i) {
            var v = this.get(i);
            n.mulAdd(128, v & 0x7F);
            bits += 7;
            if (!(v & 0x80)) { // finished
                if (s === "") {
                    n = n.simplify();
                    if (n instanceof Int10) {
                        n.sub(80);
                        s = "2." + n.toString();
                    }
                    else {
                        var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                        s = m + "." + (n - m * 40);
                    }
                }
                else {
                    s += "." + n.toString();
                }
                if (s.length > maxLength) {
                    return stringCut(s, maxLength);
                }
                n = new Int10();
                bits = 0;
            }
        }
        if (bits > 0) {
            s += ".incomplete";
        }
        return s;
    };
    return Stream;
}());

var ASN1 = /** @class */ (function () {
    function ASN1(stream, header, length, tag, sub) {
        if (!(tag instanceof ASN1Tag)) {
            throw new Error("Invalid tag value.");
        }
        this.stream = stream;
        this.header = header;
        this.length = length;
        this.tag = tag;
        this.sub = sub;
    }
    ASN1.prototype.typeName = function () {
        switch (this.tag.tagClass) {
            case 0: // universal
                switch (this.tag.tagNumber) {
                    case 0x00:
                        return "EOC";
                    case 0x01:
                        return "BOOLEAN";
                    case 0x02:
                        return "INTEGER";
                    case 0x03:
                        return "BIT_STRING";
                    case 0x04:
                        return "OCTET_STRING";
                    case 0x05:
                        return "NULL";
                    case 0x06:
                        return "OBJECT_IDENTIFIER";
                    case 0x07:
                        return "ObjectDescriptor";
                    case 0x08:
                        return "EXTERNAL";
                    case 0x09:
                        return "REAL";
                    case 0x0A:
                        return "ENUMERATED";
                    case 0x0B:
                        return "EMBEDDED_PDV";
                    case 0x0C:
                        return "UTF8String";
                    case 0x10:
                        return "SEQUENCE";
                    case 0x11:
                        return "SET";
                    case 0x12:
                        return "NumericString";
                    case 0x13:
                        return "PrintableString"; // ASCII subset
                    case 0x14:
                        return "TeletexString"; // aka T61String
                    case 0x15:
                        return "VideotexString";
                    case 0x16:
                        return "IA5String"; // ASCII
                    case 0x17:
                        return "UTCTime";
                    case 0x18:
                        return "GeneralizedTime";
                    case 0x19:
                        return "GraphicString";
                    case 0x1A:
                        return "VisibleString"; // ASCII subset
                    case 0x1B:
                        return "GeneralString";
                    case 0x1C:
                        return "UniversalString";
                    case 0x1E:
                        return "BMPString";
                }
                return "Universal_" + this.tag.tagNumber.toString();
            case 1:
                return "Application_" + this.tag.tagNumber.toString();
            case 2:
                return "[" + this.tag.tagNumber.toString() + "]"; // Context
            case 3:
                return "Private_" + this.tag.tagNumber.toString();
        }
    };
    ASN1.prototype.content = function (maxLength) {
        if (this.tag === undefined) {
            return null;
        }
        if (maxLength === undefined) {
            maxLength = Infinity;
        }
        var content = this.posContent();
        var len = Math.abs(this.length);
        if (!this.tag.isUniversal()) {
            if (this.sub !== null) {
                return "(" + this.sub.length + " elem)";
            }
            return this.stream.parseOctetString(content, content + len, maxLength);
        }
        switch (this.tag.tagNumber) {
            case 0x01: // BOOLEAN
                return (this.stream.get(content) === 0) ? "false" : "true";
            case 0x02: // INTEGER
                return this.stream.parseInteger(content, content + len);
            case 0x03: // BIT_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseBitString(content, content + len, maxLength);
            case 0x04: // OCTET_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseOctetString(content, content + len, maxLength);
            // case 0x05: // NULL
            case 0x06: // OBJECT_IDENTIFIER
                return this.stream.parseOID(content, content + len, maxLength);
            // case 0x07: // ObjectDescriptor
            // case 0x08: // EXTERNAL
            // case 0x09: // REAL
            // case 0x0A: // ENUMERATED
            // case 0x0B: // EMBEDDED_PDV
            case 0x10: // SEQUENCE
            case 0x11: // SET
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)";
                }
                else {
                    return "(no elem)";
                }
            case 0x0C: // UTF8String
                return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
            case 0x12: // NumericString
            case 0x13: // PrintableString
            case 0x14: // TeletexString
            case 0x15: // VideotexString
            case 0x16: // IA5String
            // case 0x19: // GraphicString
            case 0x1A: // VisibleString
                // case 0x1B: // GeneralString
                // case 0x1C: // UniversalString
                return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
            case 0x1E: // BMPString
                return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
            case 0x17: // UTCTime
            case 0x18: // GeneralizedTime
                return this.stream.parseTime(content, content + len, (this.tag.tagNumber == 0x17));
        }
        return null;
    };
    ASN1.prototype.toString = function () {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]";
    };
    ASN1.prototype.toPrettyString = function (indent) {
        if (indent === undefined) {
            indent = "";
        }
        var s = indent + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0) {
            s += "+";
        }
        s += this.length;
        if (this.tag.tagConstructed) {
            s += " (constructed)";
        }
        else if ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) {
            s += " (encapsulates)";
        }
        s += "\n";
        if (this.sub !== null) {
            indent += "  ";
            for (var i = 0, max = this.sub.length; i < max; ++i) {
                s += this.sub[i].toPrettyString(indent);
            }
        }
        return s;
    };
    ASN1.prototype.posStart = function () {
        return this.stream.pos;
    };
    ASN1.prototype.posContent = function () {
        return this.stream.pos + this.header;
    };
    ASN1.prototype.posEnd = function () {
        return this.stream.pos + this.header + Math.abs(this.length);
    };
    ASN1.prototype.toHexString = function () {
        return this.stream.hexDump(this.posStart(), this.posEnd(), true);
    };
    ASN1.decodeLength = function (stream) {
        var buf = stream.get();
        var len = buf & 0x7F;
        if (len == buf) {
            return len;
        }
        // no reason to use Int10, as it would be a huge buffer anyways
        if (len > 6) {
            throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
        }
        if (len === 0) {
            return null;
        } // undefined
        buf = 0;
        for (var i = 0; i < len; ++i) {
            buf = (buf * 256) + stream.get();
        }
        return buf;
    };
    /**
     * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
     * @returns {string}
     * @public
     */
    ASN1.prototype.getHexStringValue = function () {
        var hexString = this.toHexString();
        var offset = this.header * 2;
        var length = this.length * 2;
        return hexString.substr(offset, length);
    };
    ASN1.decode = function (str) {
        var stream;
        if (!(str instanceof Stream)) {
            stream = new Stream(str, 0);
        }
        else {
            stream = str;
        }
        var streamStart = new Stream(stream);
        var tag = new ASN1Tag(stream);
        var len = ASN1.decodeLength(stream);
        var start = stream.pos;
        var header = start - streamStart.pos;
        var sub = null;
        var getSub = function () {
            var ret = [];
            if (len !== null) {
                // definite length
                var end = start + len;
                while (stream.pos < end) {
                    ret[ret.length] = ASN1.decode(stream);
                }
                if (stream.pos != end) {
                    throw new Error("Content size is not correct for container starting at offset " + start);
                }
            }
            else {
                // undefined length
                try {
                    for (;;) {
                        var s = ASN1.decode(stream);
                        if (s.tag.isEOC()) {
                            break;
                        }
                        ret[ret.length] = s;
                    }
                    len = start - stream.pos; // undefined lengths are represented as negative values
                }
                catch (e) {
                    throw new Error("Exception while decoding undefined length content: " + e);
                }
            }
            return ret;
        };
        if (tag.tagConstructed) {
            // must have valid content
            sub = getSub();
        }
        else if (tag.isUniversal() && ((tag.tagNumber == 0x03) || (tag.tagNumber == 0x04))) {
            // sometimes BitString and OctetString are used to encapsulate ASN.1
            try {
                if (tag.tagNumber == 0x03) {
                    if (stream.get() != 0) {
                        throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                    }
                }
                sub = getSub();
                for (var i = 0; i < sub.length; ++i) {
                    if (sub[i].tag.isEOC()) {
                        throw new Error("EOC is not supposed to be actual content.");
                    }
                }
            }
            catch (e) {
                // but silently ignore when they don't
                sub = null;
            }
        }
        if (sub === null) {
            if (len === null) {
                throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
            }
            stream.pos = start + Math.abs(len);
        }
        return new ASN1(streamStart, header, len, tag, sub);
    };
    return ASN1;
}());

var ASN1Tag = /** @class */ (function () {
    function ASN1Tag(stream) {
        var buf = stream.get();
        this.tagClass = buf >> 6;
        this.tagConstructed = ((buf & 0x20) !== 0);
        this.tagNumber = buf & 0x1F;
        if (this.tagNumber == 0x1F) { // long tag
            var n = new Int10();
            do {
                buf = stream.get();
                n.mulAdd(128, buf & 0x7F);
            } while (buf & 0x80);
            this.tagNumber = n.simplify();
        }
    }
    ASN1Tag.prototype.isUniversal = function () {
        return this.tagClass === 0x00;
    };
    ASN1Tag.prototype.isEOC = function () {
        return this.tagClass === 0x00 && this.tagNumber === 0x00;
    };
    return ASN1Tag;
}());


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/jsbn.js
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;
// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);
//#region
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
//#endregion
// (public) Constructor
var BigInteger = /** @class */ (function () {
    function BigInteger(a, b, c) {
        if (a != null) {
            if ("number" == typeof a) {
                this.fromNumber(a, b, c);
            }
            else if (b == null && "string" != typeof a) {
                this.fromString(a, 256);
            }
            else {
                this.fromString(a, b);
            }
        }
    }
    //#region PUBLIC
    // BigInteger.prototype.toString = bnToString;
    // (public) return string representation in given radix
    BigInteger.prototype.toString = function (b) {
        if (this.s < 0) {
            return "-" + this.negate().toString(b);
        }
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            return this.toRadix(b);
        }
        var km = (1 << k) - 1;
        var d;
        var m = false;
        var r = "";
        var i = this.t;
        var p = this.DB - (i * this.DB) % k;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = int2char(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & ((1 << p) - 1)) << (k - p);
                    d |= this[--i] >> (p += this.DB - k);
                }
                else {
                    d = (this[i] >> (p -= k)) & km;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if (d > 0) {
                    m = true;
                }
                if (m) {
                    r += int2char(d);
                }
            }
        }
        return m ? r : "0";
    };
    // BigInteger.prototype.negate = bnNegate;
    // (public) -this
    BigInteger.prototype.negate = function () {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    };
    // BigInteger.prototype.abs = bnAbs;
    // (public) |this|
    BigInteger.prototype.abs = function () {
        return (this.s < 0) ? this.negate() : this;
    };
    // BigInteger.prototype.compareTo = bnCompareTo;
    // (public) return + if this > a, - if this < a, 0 if equal
    BigInteger.prototype.compareTo = function (a) {
        var r = this.s - a.s;
        if (r != 0) {
            return r;
        }
        var i = this.t;
        r = i - a.t;
        if (r != 0) {
            return (this.s < 0) ? -r : r;
        }
        while (--i >= 0) {
            if ((r = this[i] - a[i]) != 0) {
                return r;
            }
        }
        return 0;
    };
    // BigInteger.prototype.bitLength = bnBitLength;
    // (public) return the number of bits in "this"
    BigInteger.prototype.bitLength = function () {
        if (this.t <= 0) {
            return 0;
        }
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
    };
    // BigInteger.prototype.mod = bnMod;
    // (public) this mod a
    BigInteger.prototype.mod = function (a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            a.subTo(r, r);
        }
        return r;
    };
    // BigInteger.prototype.modPowInt = bnModPowInt;
    // (public) this^e % m, 0 <= e < 2^32
    BigInteger.prototype.modPowInt = function (e, m) {
        var z;
        if (e < 256 || m.isEven()) {
            z = new Classic(m);
        }
        else {
            z = new Montgomery(m);
        }
        return this.exp(e, z);
    };
    // BigInteger.prototype.clone = bnClone;
    // (public)
    BigInteger.prototype.clone = function () {
        var r = nbi();
        this.copyTo(r);
        return r;
    };
    // BigInteger.prototype.intValue = bnIntValue;
    // (public) return value as integer
    BigInteger.prototype.intValue = function () {
        if (this.s < 0) {
            if (this.t == 1) {
                return this[0] - this.DV;
            }
            else if (this.t == 0) {
                return -1;
            }
        }
        else if (this.t == 1) {
            return this[0];
        }
        else if (this.t == 0) {
            return 0;
        }
        // assumes 16 < DB < 32
        return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
    };
    // BigInteger.prototype.byteValue = bnByteValue;
    // (public) return value as byte
    BigInteger.prototype.byteValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
    };
    // BigInteger.prototype.shortValue = bnShortValue;
    // (public) return value as short (assumes DB>=16)
    BigInteger.prototype.shortValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
    };
    // BigInteger.prototype.signum = bnSigNum;
    // (public) 0 if this == 0, 1 if this > 0
    BigInteger.prototype.signum = function () {
        if (this.s < 0) {
            return -1;
        }
        else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
            return 0;
        }
        else {
            return 1;
        }
    };
    // BigInteger.prototype.toByteArray = bnToByteArray;
    // (public) convert to bigendian byte array
    BigInteger.prototype.toByteArray = function () {
        var i = this.t;
        var r = [];
        r[0] = this.s;
        var p = this.DB - (i * this.DB) % 8;
        var d;
        var k = 0;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
                r[k++] = d | (this.s << (this.DB - p));
            }
            while (i >= 0) {
                if (p < 8) {
                    d = (this[i] & ((1 << p) - 1)) << (8 - p);
                    d |= this[--i] >> (p += this.DB - 8);
                }
                else {
                    d = (this[i] >> (p -= 8)) & 0xff;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if ((d & 0x80) != 0) {
                    d |= -256;
                }
                if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
                    ++k;
                }
                if (k > 0 || d != this.s) {
                    r[k++] = d;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.equals = function (a) {
        return (this.compareTo(a) == 0);
    };
    // BigInteger.prototype.min = bnMin;
    BigInteger.prototype.min = function (a) {
        return (this.compareTo(a) < 0) ? this : a;
    };
    // BigInteger.prototype.max = bnMax;
    BigInteger.prototype.max = function (a) {
        return (this.compareTo(a) > 0) ? this : a;
    };
    // BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.and = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_and, r);
        return r;
    };
    // BigInteger.prototype.or = bnOr;
    BigInteger.prototype.or = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_or, r);
        return r;
    };
    // BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.xor = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_xor, r);
        return r;
    };
    // BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.andNot = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_andnot, r);
        return r;
    };
    // BigInteger.prototype.not = bnNot;
    // (public) ~this
    BigInteger.prototype.not = function () {
        var r = nbi();
        for (var i = 0; i < this.t; ++i) {
            r[i] = this.DM & ~this[i];
        }
        r.t = this.t;
        r.s = ~this.s;
        return r;
    };
    // BigInteger.prototype.shiftLeft = bnShiftLeft;
    // (public) this << n
    BigInteger.prototype.shiftLeft = function (n) {
        var r = nbi();
        if (n < 0) {
            this.rShiftTo(-n, r);
        }
        else {
            this.lShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.shiftRight = bnShiftRight;
    // (public) this >> n
    BigInteger.prototype.shiftRight = function (n) {
        var r = nbi();
        if (n < 0) {
            this.lShiftTo(-n, r);
        }
        else {
            this.rShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    // (public) returns index of lowest 1-bit (or -1 if none)
    BigInteger.prototype.getLowestSetBit = function () {
        for (var i = 0; i < this.t; ++i) {
            if (this[i] != 0) {
                return i * this.DB + lbit(this[i]);
            }
        }
        if (this.s < 0) {
            return this.t * this.DB;
        }
        return -1;
    };
    // BigInteger.prototype.bitCount = bnBitCount;
    // (public) return number of set bits
    BigInteger.prototype.bitCount = function () {
        var r = 0;
        var x = this.s & this.DM;
        for (var i = 0; i < this.t; ++i) {
            r += cbit(this[i] ^ x);
        }
        return r;
    };
    // BigInteger.prototype.testBit = bnTestBit;
    // (public) true iff nth bit is set
    BigInteger.prototype.testBit = function (n) {
        var j = Math.floor(n / this.DB);
        if (j >= this.t) {
            return (this.s != 0);
        }
        return ((this[j] & (1 << (n % this.DB))) != 0);
    };
    // BigInteger.prototype.setBit = bnSetBit;
    // (public) this | (1<<n)
    BigInteger.prototype.setBit = function (n) {
        return this.changeBit(n, op_or);
    };
    // BigInteger.prototype.clearBit = bnClearBit;
    // (public) this & ~(1<<n)
    BigInteger.prototype.clearBit = function (n) {
        return this.changeBit(n, op_andnot);
    };
    // BigInteger.prototype.flipBit = bnFlipBit;
    // (public) this ^ (1<<n)
    BigInteger.prototype.flipBit = function (n) {
        return this.changeBit(n, op_xor);
    };
    // BigInteger.prototype.add = bnAdd;
    // (public) this + a
    BigInteger.prototype.add = function (a) {
        var r = nbi();
        this.addTo(a, r);
        return r;
    };
    // BigInteger.prototype.subtract = bnSubtract;
    // (public) this - a
    BigInteger.prototype.subtract = function (a) {
        var r = nbi();
        this.subTo(a, r);
        return r;
    };
    // BigInteger.prototype.multiply = bnMultiply;
    // (public) this * a
    BigInteger.prototype.multiply = function (a) {
        var r = nbi();
        this.multiplyTo(a, r);
        return r;
    };
    // BigInteger.prototype.divide = bnDivide;
    // (public) this / a
    BigInteger.prototype.divide = function (a) {
        var r = nbi();
        this.divRemTo(a, r, null);
        return r;
    };
    // BigInteger.prototype.remainder = bnRemainder;
    // (public) this % a
    BigInteger.prototype.remainder = function (a) {
        var r = nbi();
        this.divRemTo(a, null, r);
        return r;
    };
    // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    // (public) [this/a,this%a]
    BigInteger.prototype.divideAndRemainder = function (a) {
        var q = nbi();
        var r = nbi();
        this.divRemTo(a, q, r);
        return [q, r];
    };
    // BigInteger.prototype.modPow = bnModPow;
    // (public) this^e % m (HAC 14.85)
    BigInteger.prototype.modPow = function (e, m) {
        var i = e.bitLength();
        var k;
        var r = nbv(1);
        var z;
        if (i <= 0) {
            return r;
        }
        else if (i < 18) {
            k = 1;
        }
        else if (i < 48) {
            k = 3;
        }
        else if (i < 144) {
            k = 4;
        }
        else if (i < 768) {
            k = 5;
        }
        else {
            k = 6;
        }
        if (i < 8) {
            z = new Classic(m);
        }
        else if (m.isEven()) {
            z = new Barrett(m);
        }
        else {
            z = new Montgomery(m);
        }
        // precomputation
        var g = [];
        var n = 3;
        var k1 = k - 1;
        var km = (1 << k) - 1;
        g[1] = z.convert(this);
        if (k > 1) {
            var g2 = nbi();
            z.sqrTo(g[1], g2);
            while (n <= km) {
                g[n] = nbi();
                z.mulTo(g2, g[n - 2], g[n]);
                n += 2;
            }
        }
        var j = e.t - 1;
        var w;
        var is1 = true;
        var r2 = nbi();
        var t;
        i = nbits(e[j]) - 1;
        while (j >= 0) {
            if (i >= k1) {
                w = (e[j] >> (i - k1)) & km;
            }
            else {
                w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
                if (j > 0) {
                    w |= e[j - 1] >> (this.DB + i - k1);
                }
            }
            n = k;
            while ((w & 1) == 0) {
                w >>= 1;
                --n;
            }
            if ((i -= n) < 0) {
                i += this.DB;
                --j;
            }
            if (is1) { // ret == 1, don't bother squaring or multiplying it
                g[w].copyTo(r);
                is1 = false;
            }
            else {
                while (n > 1) {
                    z.sqrTo(r, r2);
                    z.sqrTo(r2, r);
                    n -= 2;
                }
                if (n > 0) {
                    z.sqrTo(r, r2);
                }
                else {
                    t = r;
                    r = r2;
                    r2 = t;
                }
                z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & (1 << i)) == 0) {
                z.sqrTo(r, r2);
                t = r;
                r = r2;
                r2 = t;
                if (--i < 0) {
                    i = this.DB - 1;
                    --j;
                }
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.modInverse = bnModInverse;
    // (public) 1/this % m (HAC 14.61)
    BigInteger.prototype.modInverse = function (m) {
        var ac = m.isEven();
        if ((this.isEven() && ac) || m.signum() == 0) {
            return BigInteger.ZERO;
        }
        var u = m.clone();
        var v = this.clone();
        var a = nbv(1);
        var b = nbv(0);
        var c = nbv(0);
        var d = nbv(1);
        while (u.signum() != 0) {
            while (u.isEven()) {
                u.rShiftTo(1, u);
                if (ac) {
                    if (!a.isEven() || !b.isEven()) {
                        a.addTo(this, a);
                        b.subTo(m, b);
                    }
                    a.rShiftTo(1, a);
                }
                else if (!b.isEven()) {
                    b.subTo(m, b);
                }
                b.rShiftTo(1, b);
            }
            while (v.isEven()) {
                v.rShiftTo(1, v);
                if (ac) {
                    if (!c.isEven() || !d.isEven()) {
                        c.addTo(this, c);
                        d.subTo(m, d);
                    }
                    c.rShiftTo(1, c);
                }
                else if (!d.isEven()) {
                    d.subTo(m, d);
                }
                d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
                u.subTo(v, u);
                if (ac) {
                    a.subTo(c, a);
                }
                b.subTo(d, b);
            }
            else {
                v.subTo(u, v);
                if (ac) {
                    c.subTo(a, c);
                }
                d.subTo(b, d);
            }
        }
        if (v.compareTo(BigInteger.ONE) != 0) {
            return BigInteger.ZERO;
        }
        if (d.compareTo(m) >= 0) {
            return d.subtract(m);
        }
        if (d.signum() < 0) {
            d.addTo(m, d);
        }
        else {
            return d;
        }
        if (d.signum() < 0) {
            return d.add(m);
        }
        else {
            return d;
        }
    };
    // BigInteger.prototype.pow = bnPow;
    // (public) this^e
    BigInteger.prototype.pow = function (e) {
        return this.exp(e, new NullExp());
    };
    // BigInteger.prototype.gcd = bnGCD;
    // (public) gcd(this,a) (HAC 14.54)
    BigInteger.prototype.gcd = function (a) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            return x;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
        }
        if (g > 0) {
            y.lShiftTo(g, y);
        }
        return y;
    };
    // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    // (public) test primality with certainty >= 1-.5^t
    BigInteger.prototype.isProbablePrime = function (t) {
        var i;
        var x = this.abs();
        if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
            for (i = 0; i < lowprimes.length; ++i) {
                if (x[0] == lowprimes[i]) {
                    return true;
                }
            }
            return false;
        }
        if (x.isEven()) {
            return false;
        }
        i = 1;
        while (i < lowprimes.length) {
            var m = lowprimes[i];
            var j = i + 1;
            while (j < lowprimes.length && m < lplim) {
                m *= lowprimes[j++];
            }
            m = x.modInt(m);
            while (i < j) {
                if (m % lowprimes[i++] == 0) {
                    return false;
                }
            }
        }
        return x.millerRabin(t);
    };
    //#endregion PUBLIC
    //#region PROTECTED
    // BigInteger.prototype.copyTo = bnpCopyTo;
    // (protected) copy this to r
    BigInteger.prototype.copyTo = function (r) {
        for (var i = this.t - 1; i >= 0; --i) {
            r[i] = this[i];
        }
        r.t = this.t;
        r.s = this.s;
    };
    // BigInteger.prototype.fromInt = bnpFromInt;
    // (protected) set from integer value x, -DV <= x < DV
    BigInteger.prototype.fromInt = function (x) {
        this.t = 1;
        this.s = (x < 0) ? -1 : 0;
        if (x > 0) {
            this[0] = x;
        }
        else if (x < -1) {
            this[0] = x + this.DV;
        }
        else {
            this.t = 0;
        }
    };
    // BigInteger.prototype.fromString = bnpFromString;
    // (protected) set from string and radix
    BigInteger.prototype.fromString = function (s, b) {
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 256) {
            k = 8;
            /* byte array */
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            this.fromRadix(s, b);
            return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length;
        var mi = false;
        var sh = 0;
        while (--i >= 0) {
            var x = (k == 8) ? (+s[i]) & 0xff : intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-") {
                    mi = true;
                }
                continue;
            }
            mi = false;
            if (sh == 0) {
                this[this.t++] = x;
            }
            else if (sh + k > this.DB) {
                this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
                this[this.t++] = (x >> (this.DB - sh));
            }
            else {
                this[this.t - 1] |= x << sh;
            }
            sh += k;
            if (sh >= this.DB) {
                sh -= this.DB;
            }
        }
        if (k == 8 && ((+s[0]) & 0x80) != 0) {
            this.s = -1;
            if (sh > 0) {
                this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
            }
        }
        this.clamp();
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.clamp = bnpClamp;
    // (protected) clamp off excess high words
    BigInteger.prototype.clamp = function () {
        var c = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == c) {
            --this.t;
        }
    };
    // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    // (protected) r = this << n*DB
    BigInteger.prototype.dlShiftTo = function (n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + n] = this[i];
        }
        for (i = n - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r.t = this.t + n;
        r.s = this.s;
    };
    // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    // (protected) r = this >> n*DB
    BigInteger.prototype.drShiftTo = function (n, r) {
        for (var i = n; i < this.t; ++i) {
            r[i - n] = this[i];
        }
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    };
    // BigInteger.prototype.lShiftTo = bnpLShiftTo;
    // (protected) r = this << n
    BigInteger.prototype.lShiftTo = function (n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB);
        var c = (this.s << bs) & this.DM;
        for (var i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = (this[i] >> cbs) | c;
            c = (this[i] & bm) << bs;
        }
        for (var i = ds - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    };
    // BigInteger.prototype.rShiftTo = bnpRShiftTo;
    // (protected) r = this >> n
    BigInteger.prototype.rShiftTo = function (n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
            r.t = 0;
            return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
        }
        if (bs > 0) {
            r[this.t - ds - 1] |= (this.s & bm) << cbs;
        }
        r.t = this.t - ds;
        r.clamp();
    };
    // BigInteger.prototype.subTo = bnpSubTo;
    // (protected) r = this - a
    BigInteger.prototype.subTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c -= a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c -= a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c < -1) {
            r[i++] = this.DV + c;
        }
        else if (c > 0) {
            r[i++] = c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyTo = function (a, r) {
        var x = this.abs();
        var y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < y.t; ++i) {
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        }
        r.s = 0;
        r.clamp();
        if (this.s != a.s) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.squareTo = bnpSquareTo;
    // (protected) r = this^2, r != this (HAC 14.16)
    BigInteger.prototype.squareTo = function (r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                r[i + x.t] -= x.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0) {
            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        }
        r.s = 0;
        r.clamp();
    };
    // BigInteger.prototype.divRemTo = bnpDivRemTo;
    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    BigInteger.prototype.divRemTo = function (m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0) {
            return;
        }
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null) {
                q.fromInt(0);
            }
            if (r != null) {
                this.copyTo(r);
            }
            return;
        }
        if (r == null) {
            r = nbi();
        }
        var y = nbi();
        var ts = this.s;
        var ms = m.s;
        var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
        if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
        }
        else {
            pm.copyTo(y);
            pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0) {
            return;
        }
        var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt;
        var d2 = (1 << this.F1) / yt;
        var e = 1 << this.F2;
        var i = r.t;
        var j = i - ys;
        var t = (q == null) ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y); // "negative" y so we can replace sub with am later
        while (y.t < ys) {
            y[y.t++] = 0;
        }
        while (--j >= 0) {
            // Estimate quotient digit
            var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd) {
                    r.subTo(t, r);
                }
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) {
                BigInteger.ZERO.subTo(q, q);
            }
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0) {
            r.rShiftTo(nsh, r);
        } // Denormalize remainder
        if (ts < 0) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.invDigit = bnpInvDigit;
    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    BigInteger.prototype.invDigit = function () {
        if (this.t < 1) {
            return 0;
        }
        var x = this[0];
        if ((x & 1) == 0) {
            return 0;
        }
        var y = x & 3; // y == 1/x mod 2^2
        y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
        y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
        y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
        // last step - calculate inverse mod DV directly;
        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
        y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
        // we really want the negative inverse, and -DV < y < DV
        return (y > 0) ? this.DV - y : -y;
    };
    // BigInteger.prototype.isEven = bnpIsEven;
    // (protected) true iff this is even
    BigInteger.prototype.isEven = function () {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
    };
    // BigInteger.prototype.exp = bnpExp;
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    BigInteger.prototype.exp = function (e, z) {
        if (e > 0xffffffff || e < 1) {
            return BigInteger.ONE;
        }
        var r = nbi();
        var r2 = nbi();
        var g = z.convert(this);
        var i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & (1 << i)) > 0) {
                z.mulTo(r2, g, r);
            }
            else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.chunkSize = bnpChunkSize;
    // (protected) return x s.t. r^x < DV
    BigInteger.prototype.chunkSize = function (r) {
        return Math.floor(Math.LN2 * this.DB / Math.log(r));
    };
    // BigInteger.prototype.toRadix = bnpToRadix;
    // (protected) convert to radix string
    BigInteger.prototype.toRadix = function (b) {
        if (b == null) {
            b = 10;
        }
        if (this.signum() == 0 || b < 2 || b > 36) {
            return "0";
        }
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = nbv(a);
        var y = nbi();
        var z = nbi();
        var r = "";
        this.divRemTo(d, y, z);
        while (y.signum() > 0) {
            r = (a + z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z);
        }
        return z.intValue().toString(b) + r;
    };
    // BigInteger.prototype.fromRadix = bnpFromRadix;
    // (protected) convert from radix string
    BigInteger.prototype.fromRadix = function (s, b) {
        this.fromInt(0);
        if (b == null) {
            b = 10;
        }
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs);
        var mi = false;
        var j = 0;
        var w = 0;
        for (var i = 0; i < s.length; ++i) {
            var x = intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-" && this.signum() == 0) {
                    mi = true;
                }
                continue;
            }
            w = b * w + x;
            if (++j >= cs) {
                this.dMultiply(d);
                this.dAddOffset(w, 0);
                j = 0;
                w = 0;
            }
        }
        if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
        }
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.fromNumber = bnpFromNumber;
    // (protected) alternate constructor
    BigInteger.prototype.fromNumber = function (a, b, c) {
        if ("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    // force MSB set
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                } // force odd
                while (!this.isProbablePrime(b)) {
                    this.dAddOffset(2, 0);
                    if (this.bitLength() > a) {
                        this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                    }
                }
            }
        }
        else {
            // new BigInteger(int,RNG)
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    // (protected) r = this op a (bitwise)
    BigInteger.prototype.bitwiseTo = function (a, op, r) {
        var i;
        var f;
        var m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i) {
            r[i] = op(this[i], a[i]);
        }
        if (a.t < this.t) {
            f = a.s & this.DM;
            for (i = m; i < this.t; ++i) {
                r[i] = op(this[i], f);
            }
            r.t = this.t;
        }
        else {
            f = this.s & this.DM;
            for (i = m; i < a.t; ++i) {
                r[i] = op(f, a[i]);
            }
            r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
    };
    // BigInteger.prototype.changeBit = bnpChangeBit;
    // (protected) this op (1<<n)
    BigInteger.prototype.changeBit = function (n, op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
    };
    // BigInteger.prototype.addTo = bnpAddTo;
    // (protected) r = this + a
    BigInteger.prototype.addTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c += a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c > 0) {
            r[i++] = c;
        }
        else if (c < -1) {
            r[i++] = this.DV + c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.dMultiply = bnpDMultiply;
    // (protected) this *= n, this >= 0, 1 < n < DV
    BigInteger.prototype.dMultiply = function (n) {
        this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
    };
    // BigInteger.prototype.dAddOffset = bnpDAddOffset;
    // (protected) this += n << w words, this >= 0
    BigInteger.prototype.dAddOffset = function (n, w) {
        if (n == 0) {
            return;
        }
        while (this.t <= w) {
            this[this.t++] = 0;
        }
        this[w] += n;
        while (this[w] >= this.DV) {
            this[w] -= this.DV;
            if (++w >= this.t) {
                this[this.t++] = 0;
            }
            ++this[w];
        }
    };
    // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while (i > 0) {
            r[--i] = 0;
        }
        for (var j = r.t - this.t; i < j; ++i) {
            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
        }
        for (var j = Math.min(a.t, n); i < j; ++i) {
            this.am(0, a[i], r, i, 0, n - i);
        }
        r.clamp();
    };
    // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0; // assumes a,this >= 0
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
        }
        r.clamp();
        r.drShiftTo(1, r);
    };
    // BigInteger.prototype.modInt = bnpModInt;
    // (protected) this % n, n < 2^26
    BigInteger.prototype.modInt = function (n) {
        if (n <= 0) {
            return 0;
        }
        var d = this.DV % n;
        var r = (this.s < 0) ? n - 1 : 0;
        if (this.t > 0) {
            if (d == 0) {
                r = this[0] % n;
            }
            else {
                for (var i = this.t - 1; i >= 0; --i) {
                    r = (d * r + this[i]) % n;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.millerRabin = bnpMillerRabin;
    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    BigInteger.prototype.millerRabin = function (t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0) {
            return false;
        }
        var r = n1.shiftRight(k);
        t = (t + 1) >> 1;
        if (t > lowprimes.length) {
            t = lowprimes.length;
        }
        var a = nbi();
        for (var i = 0; i < t; ++i) {
            // Pick bases at random, instead of starting at 2
            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while (j++ < k && y.compareTo(n1) != 0) {
                    y = y.modPowInt(2, this);
                    if (y.compareTo(BigInteger.ONE) == 0) {
                        return false;
                    }
                }
                if (y.compareTo(n1) != 0) {
                    return false;
                }
            }
        }
        return true;
    };
    // BigInteger.prototype.square = bnSquare;
    // (public) this^2
    BigInteger.prototype.square = function () {
        var r = nbi();
        this.squareTo(r);
        return r;
    };
    //#region ASYNC
    // Public API method
    BigInteger.prototype.gcda = function (a, callback) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            callback(x);
            return;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
        var gcda1 = function () {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
            if (!(x.signum() > 0)) {
                if (g > 0) {
                    y.lShiftTo(g, y);
                }
                setTimeout(function () { callback(y); }, 0); // escape
            }
            else {
                setTimeout(gcda1, 0);
            }
        };
        setTimeout(gcda1, 10);
    };
    // (protected) alternate constructor
    BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
        if ("number" == typeof b) {
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                }
                var bnp_1 = this;
                var bnpfn1_1 = function () {
                    bnp_1.dAddOffset(2, 0);
                    if (bnp_1.bitLength() > a) {
                        bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
                    }
                    if (bnp_1.isProbablePrime(b)) {
                        setTimeout(function () { callback(); }, 0); // escape
                    }
                    else {
                        setTimeout(bnpfn1_1, 0);
                    }
                };
                setTimeout(bnpfn1_1, 0);
            }
        }
        else {
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    return BigInteger;
}());

//#region REDUCERS
//#region NullExp
var NullExp = /** @class */ (function () {
    function NullExp() {
    }
    // NullExp.prototype.convert = nNop;
    NullExp.prototype.convert = function (x) {
        return x;
    };
    // NullExp.prototype.revert = nNop;
    NullExp.prototype.revert = function (x) {
        return x;
    };
    // NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
    };
    // NullExp.prototype.sqrTo = nSqrTo;
    NullExp.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
    };
    return NullExp;
}());
// Modular reduction using "classic" algorithm
var Classic = /** @class */ (function () {
    function Classic(m) {
        this.m = m;
    }
    // Classic.prototype.convert = cConvert;
    Classic.prototype.convert = function (x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) {
            return x.mod(this.m);
        }
        else {
            return x;
        }
    };
    // Classic.prototype.revert = cRevert;
    Classic.prototype.revert = function (x) {
        return x;
    };
    // Classic.prototype.reduce = cReduce;
    Classic.prototype.reduce = function (x) {
        x.divRemTo(this.m, null, x);
    };
    // Classic.prototype.mulTo = cMulTo;
    Classic.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Classic.prototype.sqrTo = cSqrTo;
    Classic.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Classic;
}());
//#endregion
//#region Montgomery
// Montgomery reduction
var Montgomery = /** @class */ (function () {
    function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 0x7fff;
        this.mph = this.mp >> 15;
        this.um = (1 << (m.DB - 15)) - 1;
        this.mt2 = 2 * m.t;
    }
    // Montgomery.prototype.convert = montConvert;
    // xR mod m
    Montgomery.prototype.convert = function (x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            this.m.subTo(r, r);
        }
        return r;
    };
    // Montgomery.prototype.revert = montRevert;
    // x/R mod m
    Montgomery.prototype.revert = function (x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    };
    // Montgomery.prototype.reduce = montReduce;
    // x = x/R mod m (HAC 14.32)
    Montgomery.prototype.reduce = function (x) {
        while (x.t <= this.mt2) {
            // pad x so am has enough room later
            x[x.t++] = 0;
        }
        for (var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i] & 0x7fff;
            var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
            // use am to combine the multiply-shift-add into one call
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            // propagate carry
            while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j]++;
            }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Montgomery.prototype.mulTo = montMulTo;
    // r = "xy/R mod m"; x,y != r
    Montgomery.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Montgomery.prototype.sqrTo = montSqrTo;
    // r = "x^2/R mod m"; x != r
    Montgomery.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Montgomery;
}());
//#endregion Montgomery
//#region Barrett
// Barrett modular reduction
var Barrett = /** @class */ (function () {
    function Barrett(m) {
        this.m = m;
        // setup Barrett
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
    }
    // Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.convert = function (x) {
        if (x.s < 0 || x.t > 2 * this.m.t) {
            return x.mod(this.m);
        }
        else if (x.compareTo(this.m) < 0) {
            return x;
        }
        else {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        }
    };
    // Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.revert = function (x) {
        return x;
    };
    // Barrett.prototype.reduce = barrettReduce;
    // x = x mod m (HAC 14.42)
    Barrett.prototype.reduce = function (x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0) {
            x.dAddOffset(1, this.m.t + 1);
        }
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Barrett.prototype.mulTo = barrettMulTo;
    // r = x*y mod m; x,y != r
    Barrett.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Barrett.prototype.sqrTo = barrettSqrTo;
    // r = x^2 mod m; x != r
    Barrett.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Barrett;
}());
//#endregion
//#endregion REDUCERS
// return new, unset BigInteger
function nbi() { return new BigInteger(null); }
function parseBigInt(str, r) {
    return new BigInteger(str, r);
}
// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.
var inBrowser = typeof navigator !== "undefined";
if (inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    BigInteger.prototype.am = function am2(i, x, w, j, c, n) {
        var xl = x & 0x7fff;
        var xh = x >> 15;
        while (--n >= 0) {
            var l = this[i] & 0x7fff;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 0x3fffffff;
        }
        return c;
    };
    dbits = 30;
}
else if (inBrowser && j_lm && (navigator.appName != "Netscape")) {
    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    BigInteger.prototype.am = function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 0x4000000);
            w[j++] = v & 0x3ffffff;
        }
        return c;
    };
    dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    BigInteger.prototype.am = function am3(i, x, w, j, c, n) {
        var xl = x & 0x3fff;
        var xh = x >> 14;
        while (--n >= 0) {
            var l = this[i] & 0x3fff;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 0xfffffff;
        }
        return c;
    };
    dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
// Digit conversions
var BI_RC = [];
var rr;
var vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c;
}
// return bigint initialized to value
function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
}
// returns bit length of the integer x
function nbits(x) {
    var r = 1;
    var t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
    }
    return r;
}
// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/prng4.js
// prng4.js - uses Arcfour as a PRNG
var Arcfour = /** @class */ (function () {
    function Arcfour() {
        this.i = 0;
        this.j = 0;
        this.S = [];
    }
    // Arcfour.prototype.init = ARC4init;
    // Initialize arcfour context from key, an array of ints, each from [0..255]
    Arcfour.prototype.init = function (key) {
        var i;
        var j;
        var t;
        for (i = 0; i < 256; ++i) {
            this.S[i] = i;
        }
        j = 0;
        for (i = 0; i < 256; ++i) {
            j = (j + this.S[i] + key[i % key.length]) & 255;
            t = this.S[i];
            this.S[i] = this.S[j];
            this.S[j] = t;
        }
        this.i = 0;
        this.j = 0;
    };
    // Arcfour.prototype.next = ARC4next;
    Arcfour.prototype.next = function () {
        var t;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        t = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = t;
        return this.S[(t + this.S[this.i]) & 255];
    };
    return Arcfour;
}());

// Plug in your RNG constructor here
function prng_newstate() {
    return new Arcfour();
}
// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/rng.js
// Random number generator - requires a PRNG backend, e.g. prng4.js

var rng_state;
var rng_pool = null;
var rng_pptr;
// Initialize the pool with junk if needed.
if (rng_pool == null) {
    rng_pool = [];
    rng_pptr = 0;
    var t = void 0;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        // Extract entropy (2048 bits) from RNG if available
        var z = new Uint32Array(256);
        window.crypto.getRandomValues(z);
        for (t = 0; t < z.length; ++t) {
            rng_pool[rng_pptr++] = z[t] & 255;
        }
    }
    // Use mouse events for entropy, if we do not have enough entropy by the time
    // we need it, entropy will be generated by Math.random.
    var count = 0;
    var onMouseMoveListener_1 = function (ev) {
        count = count || 0;
        if (count >= 256 || rng_pptr >= rng_psize) {
            if (window.removeEventListener) {
                window.removeEventListener("mousemove", onMouseMoveListener_1, false);
            }
            else if (window.detachEvent) {
                window.detachEvent("onmousemove", onMouseMoveListener_1);
            }
            return;
        }
        try {
            var mouseCoordinates = ev.x + ev.y;
            rng_pool[rng_pptr++] = mouseCoordinates & 255;
            count += 1;
        }
        catch (e) {
            // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
        }
    };
    if (typeof window !== 'undefined') {
        if (window.addEventListener) {
            window.addEventListener("mousemove", onMouseMoveListener_1, false);
        }
        else if (window.attachEvent) {
            window.attachEvent("onmousemove", onMouseMoveListener_1);
        }
    }
}
function rng_get_byte() {
    if (rng_state == null) {
        rng_state = prng_newstate();
        // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
        while (rng_pptr < rng_psize) {
            var random = Math.floor(65536 * Math.random());
            rng_pool[rng_pptr++] = random & 255;
        }
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
            rng_pool[rng_pptr] = 0;
        }
        rng_pptr = 0;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
}
var SecureRandom = /** @class */ (function () {
    function SecureRandom() {
    }
    SecureRandom.prototype.nextBytes = function (ba) {
        for (var i = 0; i < ba.length; ++i) {
            ba[i] = rng_get_byte();
        }
    };
    return SecureRandom;
}());


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsbn/rsa.js
// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2
// convert a (hex) string to a bignum object


// function linebrk(s,n) {
//   var ret = "";
//   var i = 0;
//   while(i + n < s.length) {
//     ret += s.substring(i,i+n) + "\n";
//     i += n;
//   }
//   return ret + s.substring(i,s.length);
// }
// function byte2Hex(b) {
//   if(b < 0x10)
//     return "0" + b.toString(16);
//   else
//     return b.toString(16);
// }
function pkcs1pad1(s, n) {
    if (n < s.length + 22) {
        console.error("Message too long for RSA");
        return null;
    }
    var len = n - s.length - 6;
    var filler = "";
    for (var f = 0; f < len; f += 2) {
        filler += "ff";
    }
    var m = "0001" + filler + "00" + s;
    return parseBigInt(m, 16);
}
// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
    if (n < s.length + 11) { // TODO: fix for utf-8
        console.error("Message too long for RSA");
        return null;
    }
    var ba = [];
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
        var c = s.charCodeAt(i--);
        if (c < 128) { // encode using utf-8
            ba[--n] = c;
        }
        else if ((c > 127) && (c < 2048)) {
            ba[--n] = (c & 63) | 128;
            ba[--n] = (c >> 6) | 192;
        }
        else {
            ba[--n] = (c & 63) | 128;
            ba[--n] = ((c >> 6) & 63) | 128;
            ba[--n] = (c >> 12) | 224;
        }
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = [];
    while (n > 2) { // random non-zero pad
        x[0] = 0;
        while (x[0] == 0) {
            rng.nextBytes(x);
        }
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
}
// "empty" RSA key constructor
var rsa_RSAKey = /** @class */ (function () {
    function RSAKey() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null;
    }
    //#region PROTECTED
    // protected
    // RSAKey.prototype.doPublic = RSADoPublic;
    // Perform raw public operation on "x": return x^e (mod n)
    RSAKey.prototype.doPublic = function (x) {
        return x.modPowInt(this.e, this.n);
    };
    // RSAKey.prototype.doPrivate = RSADoPrivate;
    // Perform raw private operation on "x": return x^d (mod n)
    RSAKey.prototype.doPrivate = function (x) {
        if (this.p == null || this.q == null) {
            return x.modPow(this.d, this.n);
        }
        // TODO: re-calculate any missing CRT params
        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
        var xq = x.mod(this.q).modPow(this.dmq1, this.q);
        while (xp.compareTo(xq) < 0) {
            xp = xp.add(this.p);
        }
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    };
    //#endregion PROTECTED
    //#region PUBLIC
    // RSAKey.prototype.setPublic = RSASetPublic;
    // Set the public key fields N and e from hex strings
    RSAKey.prototype.setPublic = function (N, E) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
        }
        else {
            console.error("Invalid RSA public key");
        }
    };
    // RSAKey.prototype.encrypt = RSAEncrypt;
    // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
    RSAKey.prototype.encrypt = function (text) {
        var maxLength = (this.n.bitLength() + 7) >> 3;
        var m = pkcs1pad2(text, maxLength);
        if (m == null) {
            return null;
        }
        var c = this.doPublic(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        var length = h.length;
        // fix zero before result
        for (var i = 0; i < maxLength * 2 - length; i++) {
            h = "0" + h;
        }
        return h;
    };
    // RSAKey.prototype.setPrivate = RSASetPrivate;
    // Set the private key fields N, e, and d from hex strings
    RSAKey.prototype.setPrivate = function (N, E, D) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
    // Set the private key fields N, e, d and CRT params from hex strings
    RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
            this.p = parseBigInt(P, 16);
            this.q = parseBigInt(Q, 16);
            this.dmp1 = parseBigInt(DP, 16);
            this.dmq1 = parseBigInt(DQ, 16);
            this.coeff = parseBigInt(C, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.generate = RSAGenerate;
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generate = function (B, E) {
        var rng = new SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        for (;;) {
            for (;;) {
                this.p = new BigInteger(B - qs, 1, rng);
                if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
                    break;
                }
            }
            for (;;) {
                this.q = new BigInteger(qs, 1, rng);
                if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
                    break;
                }
            }
            if (this.p.compareTo(this.q) <= 0) {
                var t = this.p;
                this.p = this.q;
                this.q = t;
            }
            var p1 = this.p.subtract(BigInteger.ONE);
            var q1 = this.q.subtract(BigInteger.ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                this.n = this.p.multiply(this.q);
                this.d = ee.modInverse(phi);
                this.dmp1 = this.d.mod(p1);
                this.dmq1 = this.d.mod(q1);
                this.coeff = this.q.modInverse(this.p);
                break;
            }
        }
    };
    // RSAKey.prototype.decrypt = RSADecrypt;
    // Return the PKCS#1 RSA decryption of "ctext".
    // "ctext" is an even-length hex string and the output is a plain string.
    RSAKey.prototype.decrypt = function (ctext) {
        var c = parseBigInt(ctext, 16);
        var m = this.doPrivate(c);
        if (m == null) {
            return null;
        }
        return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
    };
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generateAsync = function (B, E, callback) {
        var rng = new SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        var rsa = this;
        // These functions have non-descript names because they were originally for(;;) loops.
        // I don't know about cryptography to give them better names than loop1-4.
        var loop1 = function () {
            var loop4 = function () {
                if (rsa.p.compareTo(rsa.q) <= 0) {
                    var t = rsa.p;
                    rsa.p = rsa.q;
                    rsa.q = t;
                }
                var p1 = rsa.p.subtract(BigInteger.ONE);
                var q1 = rsa.q.subtract(BigInteger.ONE);
                var phi = p1.multiply(q1);
                if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                    rsa.n = rsa.p.multiply(rsa.q);
                    rsa.d = ee.modInverse(phi);
                    rsa.dmp1 = rsa.d.mod(p1);
                    rsa.dmq1 = rsa.d.mod(q1);
                    rsa.coeff = rsa.q.modInverse(rsa.p);
                    setTimeout(function () { callback(); }, 0); // escape
                }
                else {
                    setTimeout(loop1, 0);
                }
            };
            var loop3 = function () {
                rsa.q = nbi();
                rsa.q.fromNumberAsync(qs, 1, rng, function () {
                    rsa.q.subtract(BigInteger.ONE).gcda(ee, function (r) {
                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                            setTimeout(loop4, 0);
                        }
                        else {
                            setTimeout(loop3, 0);
                        }
                    });
                });
            };
            var loop2 = function () {
                rsa.p = nbi();
                rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                    rsa.p.subtract(BigInteger.ONE).gcda(ee, function (r) {
                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                            setTimeout(loop3, 0);
                        }
                        else {
                            setTimeout(loop2, 0);
                        }
                    });
                });
            };
            setTimeout(loop2, 0);
        };
        setTimeout(loop1, 0);
    };
    RSAKey.prototype.sign = function (text, digestMethod, digestName) {
        var header = getDigestHeader(digestName);
        var digest = header + digestMethod(text).toString();
        var m = pkcs1pad1(digest, this.n.bitLength() / 4);
        if (m == null) {
            return null;
        }
        var c = this.doPrivate(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        if ((h.length & 1) == 0) {
            return h;
        }
        else {
            return "0" + h;
        }
    };
    RSAKey.prototype.verify = function (text, signature, digestMethod) {
        var c = parseBigInt(signature, 16);
        var m = this.doPublic(c);
        if (m == null) {
            return null;
        }
        var unpadded = m.toString(16).replace(/^1f+00/, "");
        var digest = removeDigestHeader(unpadded);
        return digest == digestMethod(text).toString();
    };
    return RSAKey;
}());

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d, n) {
    var b = d.toByteArray();
    var i = 0;
    while (i < b.length && b[i] == 0) {
        ++i;
    }
    if (b.length - i != n - 1 || b[i] != 2) {
        return null;
    }
    ++i;
    while (b[i] != 0) {
        if (++i >= b.length) {
            return null;
        }
    }
    var ret = "";
    while (++i < b.length) {
        var c = b[i] & 255;
        if (c < 128) { // utf-8 decode
            ret += String.fromCharCode(c);
        }
        else if ((c > 191) && (c < 224)) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
            ++i;
        }
        else {
            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
            i += 2;
        }
    }
    return ret;
}
// https://tools.ietf.org/html/rfc3447#page-43
var DIGEST_HEADERS = {
    md2: "3020300c06082a864886f70d020205000410",
    md5: "3020300c06082a864886f70d020505000410",
    sha1: "3021300906052b0e03021a05000414",
    sha224: "302d300d06096086480165030402040500041c",
    sha256: "3031300d060960864801650304020105000420",
    sha384: "3041300d060960864801650304020205000430",
    sha512: "3051300d060960864801650304020305000440",
    ripemd160: "3021300906052b2403020105000414"
};
function getDigestHeader(name) {
    return DIGEST_HEADERS[name] || "";
}
function removeDigestHeader(str) {
    for (var name_1 in DIGEST_HEADERS) {
        if (DIGEST_HEADERS.hasOwnProperty(name_1)) {
            var header = DIGEST_HEADERS[name_1];
            var len = header.length;
            if (str.substr(0, len) == header) {
                return str.substr(len);
            }
        }
    }
    return str;
}
// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
// function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
// }
// public
// RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsrsasign/yahoo.js
/*!
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
var YAHOO = {};
YAHOO.lang = {
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass
     *                              if present.
     */
    extend: function (subc, superc, overrides) {
        if (!superc || !subc) {
            throw new Error("YAHOO.lang.extend failed, please check that " +
                "all dependencies are included.");
        }
        var F = function () { };
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }
        if (overrides) {
            var i;
            for (i in overrides) {
                subc.prototype[i] = overrides[i];
            }
            /*
             * IE will not enumerate native functions in a derived object even if the
             * function was overridden.  This is a workaround for specific functions
             * we care about on the Object prototype.
             * @property _IEEnumFix
             * @param {Function} r  the object to receive the augmentation
             * @param {Function} s  the object that supplies the properties to augment
             * @static
             * @private
             */
            var _IEEnumFix = function () { }, ADD = ["toString", "valueOf"];
            try {
                if (/MSIE/.test(navigator.userAgent)) {
                    _IEEnumFix = function (r, s) {
                        for (i = 0; i < ADD.length; i = i + 1) {
                            var fname = ADD[i], f = s[fname];
                            if (typeof f === 'function' && f != Object.prototype[fname]) {
                                r[fname] = f;
                            }
                        }
                    };
                }
            }
            catch (ex) { }
            ;
            _IEEnumFix(subc.prototype, overrides);
        }
    }
};

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/lib/jsrsasign/asn1-1.0.js
/* asn1-1.0.13.js (c) 2013-2017 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
/*
 * asn1.js - ASN.1 DER encoder classes
 *
 * Copyright (c) 2013-2017 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * https://kjur.github.io/jsrsasign/license
 *
 * The above copyright and license notice shall be
 * included in all copies or substantial portions of the Software.
 */


/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version asn1 1.0.13 (2017-Jun-02)
 * @since jsrsasign 2.1
 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
 */
/**
 * kjur's class library name space
 * <p>
 * This name space provides following name spaces:
 * <ul>
 * <li>{@link KJUR.asn1} - ASN.1 primitive hexadecimal encoder</li>
 * <li>{@link KJUR.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
 * <li>{@link KJUR.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature
 * class and utilities</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
 * @name KJUR
 * @namespace kjur's class library name space
 */
var KJUR = {};
/**
 * kjur's ASN.1 class library name space
 * <p>
 * This is ITU-T X.690 ASN.1 DER encoder class library and
 * class structure and methods is very similar to
 * org.bouncycastle.asn1 package of
 * well known BouncyCaslte Cryptography Library.
 * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
 * Here are ASN.1 DER primitive classes.
 * <ul>
 * <li>0x01 {@link KJUR.asn1.DERBoolean}</li>
 * <li>0x02 {@link KJUR.asn1.DERInteger}</li>
 * <li>0x03 {@link KJUR.asn1.DERBitString}</li>
 * <li>0x04 {@link KJUR.asn1.DEROctetString}</li>
 * <li>0x05 {@link KJUR.asn1.DERNull}</li>
 * <li>0x06 {@link KJUR.asn1.DERObjectIdentifier}</li>
 * <li>0x0a {@link KJUR.asn1.DEREnumerated}</li>
 * <li>0x0c {@link KJUR.asn1.DERUTF8String}</li>
 * <li>0x12 {@link KJUR.asn1.DERNumericString}</li>
 * <li>0x13 {@link KJUR.asn1.DERPrintableString}</li>
 * <li>0x14 {@link KJUR.asn1.DERTeletexString}</li>
 * <li>0x16 {@link KJUR.asn1.DERIA5String}</li>
 * <li>0x17 {@link KJUR.asn1.DERUTCTime}</li>
 * <li>0x18 {@link KJUR.asn1.DERGeneralizedTime}</li>
 * <li>0x30 {@link KJUR.asn1.DERSequence}</li>
 * <li>0x31 {@link KJUR.asn1.DERSet}</li>
 * </ul>
 * <h4>OTHER ASN.1 CLASSES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.ASN1Object}</li>
 * <li>{@link KJUR.asn1.DERAbstractString}</li>
 * <li>{@link KJUR.asn1.DERAbstractTime}</li>
 * <li>{@link KJUR.asn1.DERAbstractStructured}</li>
 * <li>{@link KJUR.asn1.DERTaggedObject}</li>
 * </ul>
 * <h4>SUB NAME SPACES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.cades} - CAdES long term signature format</li>
 * <li>{@link KJUR.asn1.cms} - Cryptographic Message Syntax</li>
 * <li>{@link KJUR.asn1.csr} - Certificate Signing Request (CSR/PKCS#10)</li>
 * <li>{@link KJUR.asn1.tsp} - RFC 3161 Timestamping Protocol Format</li>
 * <li>{@link KJUR.asn1.x509} - RFC 5280 X.509 certificate and CRL</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace.
 * This caused by a bug of jsdoc2.
 * @name KJUR.asn1
 * @namespace
 */
if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1)
    KJUR.asn1 = {};
/**
 * ASN1 utilities class
 * @name KJUR.asn1.ASN1Util
 * @class ASN1 utilities class
 * @since asn1 1.0.2
 */
KJUR.asn1.ASN1Util = new function () {
    this.integerToByteHex = function (i) {
        var h = i.toString(16);
        if ((h.length % 2) == 1)
            h = '0' + h;
        return h;
    };
    this.bigIntToMinTwosComplementsHex = function (bigIntegerValue) {
        var h = bigIntegerValue.toString(16);
        if (h.substr(0, 1) != '-') {
            if (h.length % 2 == 1) {
                h = '0' + h;
            }
            else {
                if (!h.match(/^[0-7]/)) {
                    h = '00' + h;
                }
            }
        }
        else {
            var hPos = h.substr(1);
            var xorLen = hPos.length;
            if (xorLen % 2 == 1) {
                xorLen += 1;
            }
            else {
                if (!h.match(/^[0-7]/)) {
                    xorLen += 2;
                }
            }
            var hMask = '';
            for (var i = 0; i < xorLen; i++) {
                hMask += 'f';
            }
            var biMask = new BigInteger(hMask, 16);
            var biNeg = biMask.xor(bigIntegerValue).add(BigInteger.ONE);
            h = biNeg.toString(16).replace(/^-/, '');
        }
        return h;
    };
    /**
     * get PEM string from hexadecimal data and header string
     * @name getPEMStringFromHex
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {String} dataHex hexadecimal string of PEM body
     * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
     * @return {String} PEM formatted string of input data
     * @description
     * This method converts a hexadecimal string to a PEM string with
     * a specified header. Its line break will be CRLF("\r\n").
     * @example
     * var pem  = KJUR.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
     * // value of pem will be:
     * -----BEGIN PRIVATE KEY-----
     * YWFh
     * -----END PRIVATE KEY-----
     */
    this.getPEMStringFromHex = function (dataHex, pemHeader) {
        return hextopem(dataHex, pemHeader);
    };
    /**
     * generate ASN1Object specifed by JSON parameters
     * @name newObject
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return {KJUR.asn1.ASN1Object} generated object
     * @since asn1 1.0.3
     * @description
     * generate any ASN1Object specified by JSON param
     * including ASN.1 primitive or structured.
     * Generally 'param' can be described as follows:
     * <blockquote>
     * {TYPE-OF-ASNOBJ: ASN1OBJ-PARAMETER}
     * </blockquote>
     * 'TYPE-OF-ASN1OBJ' can be one of following symbols:
     * <ul>
     * <li>'bool' - DERBoolean</li>
     * <li>'int' - DERInteger</li>
     * <li>'bitstr' - DERBitString</li>
     * <li>'octstr' - DEROctetString</li>
     * <li>'null' - DERNull</li>
     * <li>'oid' - DERObjectIdentifier</li>
     * <li>'enum' - DEREnumerated</li>
     * <li>'utf8str' - DERUTF8String</li>
     * <li>'numstr' - DERNumericString</li>
     * <li>'prnstr' - DERPrintableString</li>
     * <li>'telstr' - DERTeletexString</li>
     * <li>'ia5str' - DERIA5String</li>
     * <li>'utctime' - DERUTCTime</li>
     * <li>'gentime' - DERGeneralizedTime</li>
     * <li>'seq' - DERSequence</li>
     * <li>'set' - DERSet</li>
     * <li>'tag' - DERTaggedObject</li>
     * </ul>
     * @example
     * newObject({'prnstr': 'aaa'});
     * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
     * // ASN.1 Tagged Object
     * newObject({'tag': {'tag': 'a1',
     *                    'explicit': true,
     *                    'obj': {'seq': [{'int': 3}, {'prnstr': 'aaa'}]}}});
     * // more simple representation of ASN.1 Tagged Object
     * newObject({'tag': ['a1',
     *                    true,
     *                    {'seq': [
     *                      {'int': 3},
     *                      {'prnstr': 'aaa'}]}
     *                   ]});
     */
    this.newObject = function (param) {
        var _KJUR = KJUR, _KJUR_asn1 = _KJUR.asn1, _DERBoolean = _KJUR_asn1.DERBoolean, _DERInteger = _KJUR_asn1.DERInteger, _DERBitString = _KJUR_asn1.DERBitString, _DEROctetString = _KJUR_asn1.DEROctetString, _DERNull = _KJUR_asn1.DERNull, _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier, _DEREnumerated = _KJUR_asn1.DEREnumerated, _DERUTF8String = _KJUR_asn1.DERUTF8String, _DERNumericString = _KJUR_asn1.DERNumericString, _DERPrintableString = _KJUR_asn1.DERPrintableString, _DERTeletexString = _KJUR_asn1.DERTeletexString, _DERIA5String = _KJUR_asn1.DERIA5String, _DERUTCTime = _KJUR_asn1.DERUTCTime, _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime, _DERSequence = _KJUR_asn1.DERSequence, _DERSet = _KJUR_asn1.DERSet, _DERTaggedObject = _KJUR_asn1.DERTaggedObject, _newObject = _KJUR_asn1.ASN1Util.newObject;
        var keys = Object.keys(param);
        if (keys.length != 1)
            throw "key of param shall be only one.";
        var key = keys[0];
        if (":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
            throw "undefined key: " + key;
        if (key == "bool")
            return new _DERBoolean(param[key]);
        if (key == "int")
            return new _DERInteger(param[key]);
        if (key == "bitstr")
            return new _DERBitString(param[key]);
        if (key == "octstr")
            return new _DEROctetString(param[key]);
        if (key == "null")
            return new _DERNull(param[key]);
        if (key == "oid")
            return new _DERObjectIdentifier(param[key]);
        if (key == "enum")
            return new _DEREnumerated(param[key]);
        if (key == "utf8str")
            return new _DERUTF8String(param[key]);
        if (key == "numstr")
            return new _DERNumericString(param[key]);
        if (key == "prnstr")
            return new _DERPrintableString(param[key]);
        if (key == "telstr")
            return new _DERTeletexString(param[key]);
        if (key == "ia5str")
            return new _DERIA5String(param[key]);
        if (key == "utctime")
            return new _DERUTCTime(param[key]);
        if (key == "gentime")
            return new _DERGeneralizedTime(param[key]);
        if (key == "seq") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSequence({ 'array': a });
        }
        if (key == "set") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSet({ 'array': a });
        }
        if (key == "tag") {
            var tagParam = param[key];
            if (Object.prototype.toString.call(tagParam) === '[object Array]' &&
                tagParam.length == 3) {
                var obj = _newObject(tagParam[2]);
                return new _DERTaggedObject({ tag: tagParam[0],
                    explicit: tagParam[1],
                    obj: obj });
            }
            else {
                var newParam = {};
                if (tagParam.explicit !== undefined)
                    newParam.explicit = tagParam.explicit;
                if (tagParam.tag !== undefined)
                    newParam.tag = tagParam.tag;
                if (tagParam.obj === undefined)
                    throw "obj shall be specified for 'tag'.";
                newParam.obj = _newObject(tagParam.obj);
                return new _DERTaggedObject(newParam);
            }
        }
    };
    /**
     * get encoded hexadecimal string of ASN1Object specifed by JSON parameters
     * @name jsonToASN1HEX
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return hexadecimal string of ASN1Object
     * @since asn1 1.0.4
     * @description
     * As for ASN.1 object representation of JSON object,
     * please see {@link newObject}.
     * @example
     * jsonToASN1HEX({'prnstr': 'aaa'});
     */
    this.jsonToASN1HEX = function (param) {
        var asn1Obj = this.newObject(param);
        return asn1Obj.getEncodedHex();
    };
};
/**
 * get dot noted oid number string from hexadecimal value of OID
 * @name oidHexToInt
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} hex hexadecimal value of object identifier
 * @return {String} dot noted string of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from hexadecimal string representation of
 * ASN.1 value of object identifier to oid number string.
 * @example
 * KJUR.asn1.ASN1Util.oidHexToInt('550406') &rarr; "2.5.4.6"
 */
KJUR.asn1.ASN1Util.oidHexToInt = function (hex) {
    var s = "";
    var i01 = parseInt(hex.substr(0, 2), 16);
    var i0 = Math.floor(i01 / 40);
    var i1 = i01 % 40;
    var s = i0 + "." + i1;
    var binbuf = "";
    for (var i = 2; i < hex.length; i += 2) {
        var value = parseInt(hex.substr(i, 2), 16);
        var bin = ("00000000" + value.toString(2)).slice(-8);
        binbuf = binbuf + bin.substr(1, 7);
        if (bin.substr(0, 1) == "0") {
            var bi = new BigInteger(binbuf, 2);
            s = s + "." + bi.toString(10);
            binbuf = "";
        }
    }
    ;
    return s;
};
/**
 * get hexadecimal value of object identifier from dot noted oid value
 * @name oidIntToHex
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} oidString dot noted string of object identifier
 * @return {String} hexadecimal value of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from object identifier value string.
 * to hexadecimal string representation of it.
 * @example
 * KJUR.asn1.ASN1Util.oidIntToHex("2.5.4.6") &rarr; "550406"
 */
KJUR.asn1.ASN1Util.oidIntToHex = function (oidString) {
    var itox = function (i) {
        var h = i.toString(16);
        if (h.length == 1)
            h = '0' + h;
        return h;
    };
    var roidtox = function (roid) {
        var h = '';
        var bi = new BigInteger(roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7)
            padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++)
            bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7)
                b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };
    if (!oidString.match(/^[0-9.]+$/)) {
        throw "malformed oid string: " + oidString;
    }
    var h = '';
    var a = oidString.split('.');
    var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
    h += itox(i0);
    a.splice(0, 2);
    for (var i = 0; i < a.length; i++) {
        h += roidtox(a[i]);
    }
    return h;
};
// ********************************************************************
//  Abstract ASN.1 Classes
// ********************************************************************
// ********************************************************************
/**
 * base class for ASN.1 DER encoder object
 * @name KJUR.asn1.ASN1Object
 * @class base class for ASN.1 DER encoder object
 * @property {Boolean} isModified flag whether internal data was changed
 * @property {String} hTLV hexadecimal string of ASN.1 TLV
 * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
 * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
 * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
 * @description
 */
KJUR.asn1.ASN1Object = function () {
    var isModified = true;
    var hTLV = null;
    var hT = '00';
    var hL = '00';
    var hV = '';
    /**
     * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
     * @name getLengthHexFromValue
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV length(L)
     */
    this.getLengthHexFromValue = function () {
        if (typeof this.hV == "undefined" || this.hV == null) {
            throw "this.hV is null or undefined.";
        }
        if (this.hV.length % 2 == 1) {
            throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
        }
        var n = this.hV.length / 2;
        var hN = n.toString(16);
        if (hN.length % 2 == 1) {
            hN = "0" + hN;
        }
        if (n < 128) {
            return hN;
        }
        else {
            var hNlen = hN.length / 2;
            if (hNlen > 15) {
                throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
            }
            var head = 128 + hNlen;
            return head.toString(16) + hN;
        }
    };
    /**
     * get hexadecimal string of ASN.1 TLV bytes
     * @name getEncodedHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV
     */
    this.getEncodedHex = function () {
        if (this.hTLV == null || this.isModified) {
            this.hV = this.getFreshValueHex();
            this.hL = this.getLengthHexFromValue();
            this.hTLV = this.hT + this.hL + this.hV;
            this.isModified = false;
            //alert("first time: " + this.hTLV);
        }
        return this.hTLV;
    };
    /**
     * get hexadecimal string of ASN.1 TLV value(V) bytes
     * @name getValueHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
     */
    this.getValueHex = function () {
        this.getEncodedHex();
        return this.hV;
    };
    this.getFreshValueHex = function () {
        return '';
    };
};
// == BEGIN DERAbstractString ================================================
/**
 * base class for ASN.1 DER string classes
 * @name KJUR.asn1.DERAbstractString
 * @class base class for ASN.1 DER string classes
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @property {String} s internal string of value
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERAbstractString = function (params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var s = null;
    var hV = null;
    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @return {String} string value of this string object
     */
    this.getString = function () {
        return this.s;
    };
    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newS value by a string to set
     */
    this.setString = function (newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(this.s);
    };
    /**
     * set value by a hexadecimal string
     * @name setStringHex
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newHexString value by a hexadecimal string to set
     */
    this.setStringHex = function (newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params == "string") {
            this.setString(params);
        }
        else if (typeof params['str'] != "undefined") {
            this.setString(params['str']);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setStringHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
// == END   DERAbstractString ================================================
// == BEGIN DERAbstractTime ==================================================
/**
 * base class for ASN.1 DER Generalized/UTCTime class
 * @name KJUR.asn1.DERAbstractTime
 * @class base class for ASN.1 DER Generalized/UTCTime class
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractTime = function (params) {
    KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
    var s = null;
    var date = null;
    // --- PRIVATE METHODS --------------------
    this.localDateToUTC = function (d) {
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var utcDate = new Date(utc);
        return utcDate;
    };
    /*
     * format date string by Data object
     * @name formatDate
     * @memberOf KJUR.asn1.AbstractTime;
     * @param {Date} dateObject
     * @param {string} type 'utc' or 'gen'
     * @param {boolean} withMillis flag for with millisections or not
     * @description
     * 'withMillis' flag is supported from asn1 1.0.6.
     */
    this.formatDate = function (dateObject, type, withMillis) {
        var pad = this.zeroPadding;
        var d = this.localDateToUTC(dateObject);
        var year = String(d.getFullYear());
        if (type == 'utc')
            year = year.substr(2, 2);
        var month = pad(String(d.getMonth() + 1), 2);
        var day = pad(String(d.getDate()), 2);
        var hour = pad(String(d.getHours()), 2);
        var min = pad(String(d.getMinutes()), 2);
        var sec = pad(String(d.getSeconds()), 2);
        var s = year + month + day + hour + min + sec;
        if (withMillis === true) {
            var millis = d.getMilliseconds();
            if (millis != 0) {
                var sMillis = pad(String(millis), 3);
                sMillis = sMillis.replace(/[0]+$/, "");
                s = s + "." + sMillis;
            }
        }
        return s + "Z";
    };
    this.zeroPadding = function (s, len) {
        if (s.length >= len)
            return s;
        return new Array(len - s.length + 1).join('0') + s;
    };
    // --- PUBLIC METHODS --------------------
    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @return {String} string value of this time object
     */
    this.getString = function () {
        return this.s;
    };
    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {String} newS value by a string to set such like "130430235959Z"
     */
    this.setString = function (newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(newS);
    };
    /**
     * set value by a Date object
     * @name setByDateValue
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {Integer} year year of date (ex. 2013)
     * @param {Integer} month month of date between 1 and 12 (ex. 12)
     * @param {Integer} day day of month
     * @param {Integer} hour hours of date
     * @param {Integer} min minutes of date
     * @param {Integer} sec seconds of date
     */
    this.setByDateValue = function (year, month, day, hour, min, sec) {
        var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
        this.setByDate(dateObject);
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
// == END   DERAbstractTime ==================================================
// == BEGIN DERAbstractStructured ============================================
/**
 * base class for ASN.1 DER structured class
 * @name KJUR.asn1.DERAbstractStructured
 * @class base class for ASN.1 DER structured class
 * @property {Array} asn1Array internal array of ASN1Object
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractStructured = function (params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var asn1Array = null;
    /**
     * set value by array of ASN1Object
     * @name setByASN1ObjectArray
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {array} asn1ObjectArray array of ASN1Object to set
     */
    this.setByASN1ObjectArray = function (asn1ObjectArray) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array = asn1ObjectArray;
    };
    /**
     * append an ASN1Object to internal array
     * @name appendASN1Object
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {ASN1Object} asn1Object to add
     */
    this.appendASN1Object = function (asn1Object) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array.push(asn1Object);
    };
    this.asn1Array = new Array();
    if (typeof params != "undefined") {
        if (typeof params['array'] != "undefined") {
            this.asn1Array = params['array'];
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);
// ********************************************************************
//  ASN.1 Object Classes
// ********************************************************************
// ********************************************************************
/**
 * class for ASN.1 DER Boolean
 * @name KJUR.asn1.DERBoolean
 * @class class for ASN.1 DER Boolean
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERBoolean = function () {
    KJUR.asn1.DERBoolean.superclass.constructor.call(this);
    this.hT = "01";
    this.hTLV = "0101ff";
};
YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER Integer
 * @name KJUR.asn1.DERInteger
 * @class class for ASN.1 DER Integer
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERInteger = function (params) {
    KJUR.asn1.DERInteger.superclass.constructor.call(this);
    this.hT = "02";
    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function (bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };
    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DERInteger
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function (intValue) {
        var bi = new BigInteger(String(intValue), 10);
        this.setByBigInteger(bi);
    };
    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     * @example
     * new KJUR.asn1.DERInteger(123);
     * new KJUR.asn1.DERInteger({'int': 123});
     * new KJUR.asn1.DERInteger({'hex': '1fad'});
     */
    this.setValueHex = function (newHexString) {
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['bigint'] != "undefined") {
            this.setByBigInteger(params['bigint']);
        }
        else if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        }
        else if (typeof params == "number") {
            this.setByInteger(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER encoded BitString primitive
 * @name KJUR.asn1.DERBitString
 * @class class for ASN.1 DER encoded BitString primitive
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>bin - specify binary string (ex. '10111')</li>
 * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
 * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
 * <li>obj - specify {@link KJUR.asn1.ASN1Util.newObject}
 * argument for "BitString encapsulates" structure.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: 'obj' parameter have been supported since
 * asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).<br/>
 * @example
 * // default constructor
 * o = new KJUR.asn1.DERBitString();
 * // initialize with binary string
 * o = new KJUR.asn1.DERBitString({bin: "1011"});
 * // initialize with boolean array
 * o = new KJUR.asn1.DERBitString({array: [true,false,true,true]});
 * // initialize with hexadecimal string (04 is unused bits)
 * o = new KJUR.asn1.DEROctetString({hex: "04bac0"});
 * // initialize with ASN1Util.newObject argument for encapsulated
 * o = new KJUR.asn1.DERBitString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // BIT STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DERBitString = function (params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = "00" + o.getEncodedHex();
    }
    KJUR.asn1.DERBitString.superclass.constructor.call(this);
    this.hT = "03";
    /**
     * set ASN.1 value(V) by a hexadecimal string including unused bits
     * @name setHexValueIncludingUnusedBits
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} newHexStringIncludingUnusedBits
     */
    this.setHexValueIncludingUnusedBits = function (newHexStringIncludingUnusedBits) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = newHexStringIncludingUnusedBits;
    };
    /**
     * set ASN.1 value(V) by unused bit and hexadecimal string of value
     * @name setUnusedBitsAndHexValue
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {Integer} unusedBits
     * @param {String} hValue
     */
    this.setUnusedBitsAndHexValue = function (unusedBits, hValue) {
        if (unusedBits < 0 || 7 < unusedBits) {
            throw "unused bits shall be from 0 to 7: u = " + unusedBits;
        }
        var hUnusedBits = "0" + unusedBits;
        this.hTLV = null;
        this.isModified = true;
        this.hV = hUnusedBits + hValue;
    };
    /**
     * set ASN.1 DER BitString by binary string<br/>
     * @name setByBinaryString
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} binaryString binary value string (i.e. '10111')
     * @description
     * Its unused bits will be calculated automatically by length of
     * 'binaryValue'. <br/>
     * NOTE: Trailing zeros '0' will be ignored.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray("01011");
     */
    this.setByBinaryString = function (binaryString) {
        binaryString = binaryString.replace(/0+$/, '');
        var unusedBits = 8 - binaryString.length % 8;
        if (unusedBits == 8)
            unusedBits = 0;
        for (var i = 0; i <= unusedBits; i++) {
            binaryString += '0';
        }
        var h = '';
        for (var i = 0; i < binaryString.length - 1; i += 8) {
            var b = binaryString.substr(i, 8);
            var x = parseInt(b, 2).toString(16);
            if (x.length == 1)
                x = '0' + x;
            h += x;
        }
        this.hTLV = null;
        this.isModified = true;
        this.hV = '0' + unusedBits + h;
    };
    /**
     * set ASN.1 TLV value(V) by an array of boolean<br/>
     * @name setByBooleanArray
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {array} booleanArray array of boolean (ex. [true, false, true])
     * @description
     * NOTE: Trailing falses will be ignored in the ASN.1 DER Object.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray([false, true, false, true, true]);
     */
    this.setByBooleanArray = function (booleanArray) {
        var s = '';
        for (var i = 0; i < booleanArray.length; i++) {
            if (booleanArray[i] == true) {
                s += '1';
            }
            else {
                s += '0';
            }
        }
        this.setByBinaryString(s);
    };
    /**
     * generate an array of falses with specified length<br/>
     * @name newFalseArray
     * @memberOf KJUR.asn1.DERBitString
     * @function
     * @param {Integer} nLength length of array to generate
     * @return {array} array of boolean falses
     * @description
     * This static method may be useful to initialize boolean array.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.newFalseArray(3) &rarr; [false, false, false]
     */
    this.newFalseArray = function (nLength) {
        var a = new Array(nLength);
        for (var i = 0; i < nLength; i++) {
            a[i] = false;
        }
        return a;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
            this.setHexValueIncludingUnusedBits(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setHexValueIncludingUnusedBits(params['hex']);
        }
        else if (typeof params['bin'] != "undefined") {
            this.setByBinaryString(params['bin']);
        }
        else if (typeof params['array'] != "undefined") {
            this.setByBooleanArray(params['array']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER OctetString<br/>
 * @name KJUR.asn1.DEROctetString
 * @class class for ASN.1 DER OctetString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * This class provides ASN.1 OctetString simple type.<br/>
 * Supported "params" attributes are:
 * <ul>
 * <li>str - to set a string as a value</li>
 * <li>hex - to set a hexadecimal string as a value</li>
 * <li>obj - to set a encapsulated ASN.1 value by JSON object
 * which is defined in {@link KJUR.asn1.ASN1Util.newObject}</li>
 * </ul>
 * NOTE: A parameter 'obj' have been supported
 * for "OCTET STRING, encapsulates" structure.
 * since asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).
 * @see KJUR.asn1.DERAbstractString - superclass
 * @example
 * // default constructor
 * o = new KJUR.asn1.DEROctetString();
 * // initialize with string
 * o = new KJUR.asn1.DEROctetString({str: "aaa"});
 * // initialize with hexadecimal string
 * o = new KJUR.asn1.DEROctetString({hex: "616161"});
 * // initialize with ASN1Util.newObject argument
 * o = new KJUR.asn1.DEROctetString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // OCTET STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DEROctetString = function (params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = o.getEncodedHex();
    }
    KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
    this.hT = "04";
};
YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER Null
 * @name KJUR.asn1.DERNull
 * @class class for ASN.1 DER Null
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERNull = function () {
    KJUR.asn1.DERNull.superclass.constructor.call(this);
    this.hT = "05";
    this.hTLV = "0500";
};
YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER ObjectIdentifier
 * @name KJUR.asn1.DERObjectIdentifier
 * @class class for ASN.1 DER ObjectIdentifier
 * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERObjectIdentifier = function (params) {
    var itox = function (i) {
        var h = i.toString(16);
        if (h.length == 1)
            h = '0' + h;
        return h;
    };
    var roidtox = function (roid) {
        var h = '';
        var bi = new BigInteger(roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7)
            padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++)
            bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7)
                b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };
    KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
    this.hT = "06";
    /**
     * set value by a hexadecimal string
     * @name setValueHex
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} newHexString hexadecimal value of OID bytes
     */
    this.setValueHex = function (newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };
    /**
     * set value by a OID string<br/>
     * @name setValueOidString
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidString OID string (ex. 2.5.4.13)
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueOidString("2.5.4.13");
     */
    this.setValueOidString = function (oidString) {
        if (!oidString.match(/^[0-9.]+$/)) {
            throw "malformed oid string: " + oidString;
        }
        var h = '';
        var a = oidString.split('.');
        var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
        h += itox(i0);
        a.splice(0, 2);
        for (var i = 0; i < a.length; i++) {
            h += roidtox(a[i]);
        }
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = h;
    };
    /**
     * set value by a OID name
     * @name setValueName
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidName OID name (ex. 'serverAuth')
     * @since 1.0.1
     * @description
     * OID name shall be defined in 'KJUR.asn1.x509.OID.name2oidList'.
     * Otherwise raise error.
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueName("serverAuth");
     */
    this.setValueName = function (oidName) {
        var oid = KJUR.asn1.x509.OID.name2oid(oidName);
        if (oid !== '') {
            this.setValueOidString(oid);
        }
        else {
            throw "DERObjectIdentifier oidName undefined: " + oidName;
        }
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (params !== undefined) {
        if (typeof params === "string") {
            if (params.match(/^[0-2].[0-9.]+$/)) {
                this.setValueOidString(params);
            }
            else {
                this.setValueName(params);
            }
        }
        else if (params.oid !== undefined) {
            this.setValueOidString(params.oid);
        }
        else if (params.hex !== undefined) {
            this.setValueHex(params.hex);
        }
        else if (params.name !== undefined) {
            this.setValueName(params.name);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER Enumerated
 * @name KJUR.asn1.DEREnumerated
 * @class class for ASN.1 DER Enumerated
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * @example
 * new KJUR.asn1.DEREnumerated(123);
 * new KJUR.asn1.DEREnumerated({int: 123});
 * new KJUR.asn1.DEREnumerated({hex: '1fad'});
 */
KJUR.asn1.DEREnumerated = function (params) {
    KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
    this.hT = "0a";
    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function (bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };
    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function (intValue) {
        var bi = new BigInteger(String(intValue), 10);
        this.setByBigInteger(bi);
    };
    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     */
    this.setValueHex = function (newHexString) {
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        }
        else if (typeof params == "number") {
            this.setByInteger(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER UTF8String
 * @name KJUR.asn1.DERUTF8String
 * @class class for ASN.1 DER UTF8String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERUTF8String = function (params) {
    KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
    this.hT = "0c";
};
YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER NumericString
 * @name KJUR.asn1.DERNumericString
 * @class class for ASN.1 DER NumericString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERNumericString = function (params) {
    KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
    this.hT = "12";
};
YAHOO.lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER PrintableString
 * @name KJUR.asn1.DERPrintableString
 * @class class for ASN.1 DER PrintableString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERPrintableString = function (params) {
    KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
    this.hT = "13";
};
YAHOO.lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER TeletexString
 * @name KJUR.asn1.DERTeletexString
 * @class class for ASN.1 DER TeletexString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERTeletexString = function (params) {
    KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
    this.hT = "14";
};
YAHOO.lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER IA5String
 * @name KJUR.asn1.DERIA5String
 * @class class for ASN.1 DER IA5String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERIA5String = function (params) {
    KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
    this.hT = "16";
};
YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER UTCTime
 * @name KJUR.asn1.DERUTCTime
 * @class class for ASN.1 DER UTCTime
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * <h4>EXAMPLES</h4>
 * @example
 * d1 = new KJUR.asn1.DERUTCTime();
 * d1.setString('130430125959Z');
 *
 * d2 = new KJUR.asn1.DERUTCTime({'str': '130430125959Z'});
 * d3 = new KJUR.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
 * d4 = new KJUR.asn1.DERUTCTime('130430125959Z');
 */
KJUR.asn1.DERUTCTime = function (params) {
    KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
    this.hT = "17";
    /**
     * set value by a Date object<br/>
     * @name setByDate
     * @memberOf KJUR.asn1.DERUTCTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * o = new KJUR.asn1.DERUTCTime();
     * o.setByDate(new Date("2016/12/31"));
     */
    this.setByDate = function (dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'utc');
        this.hV = stohex(this.s);
    };
    this.getFreshValueHex = function () {
        if (typeof this.date == "undefined" && typeof this.s == "undefined") {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'utc');
            this.hV = stohex(this.s);
        }
        return this.hV;
    };
    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        }
        else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
            this.setString(params);
        }
        else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        }
        else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);
// ********************************************************************
/**
 * class for ASN.1 DER GeneralizedTime
 * @name KJUR.asn1.DERGeneralizedTime
 * @class class for ASN.1 DER GeneralizedTime
 * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
 * @property {Boolean} withMillis flag to show milliseconds or not
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
 * </ul>
 * NOTE1: 'params' can be omitted.
 * NOTE2: 'withMillis' property is supported from asn1 1.0.6.
 */
KJUR.asn1.DERGeneralizedTime = function (params) {
    KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
    this.hT = "18";
    this.withMillis = false;
    /**
     * set value by a Date object
     * @name setByDate
     * @memberOf KJUR.asn1.DERGeneralizedTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * When you specify UTC time, use 'Date.UTC' method like this:<br/>
     * o1 = new DERUTCTime();
     * o1.setByDate(date);
     *
     * date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
     */
    this.setByDate = function (dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'gen', this.withMillis);
        this.hV = stohex(this.s);
    };
    this.getFreshValueHex = function () {
        if (this.date === undefined && this.s === undefined) {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'gen', this.withMillis);
            this.hV = stohex(this.s);
        }
        return this.hV;
    };
    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        }
        else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
            this.setString(params);
        }
        else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        }
        else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
        if (params.millis === true) {
            this.withMillis = true;
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);
// ********************************************************************
/**
 * class for ASN.1 DER Sequence
 * @name KJUR.asn1.DERSequence
 * @class class for ASN.1 DER Sequence
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERSequence = function (params) {
    KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
    this.hT = "30";
    this.getFreshValueHex = function () {
        var h = '';
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            h += asn1Obj.getEncodedHex();
        }
        this.hV = h;
        return this.hV;
    };
};
YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);
// ********************************************************************
/**
 * class for ASN.1 DER Set
 * @name KJUR.asn1.DERSet
 * @class class for ASN.1 DER Set
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * <li>sortflag - flag for sort (default: true). ASN.1 BER is not sorted in 'SET OF'.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: sortflag is supported since 1.0.5.
 */
KJUR.asn1.DERSet = function (params) {
    KJUR.asn1.DERSet.superclass.constructor.call(this, params);
    this.hT = "31";
    this.sortFlag = true; // item shall be sorted only in ASN.1 DER
    this.getFreshValueHex = function () {
        var a = new Array();
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            a.push(asn1Obj.getEncodedHex());
        }
        if (this.sortFlag == true)
            a.sort();
        this.hV = a.join('');
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params.sortflag != "undefined" &&
            params.sortflag == false)
            this.sortFlag = false;
    }
};
YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);
// ********************************************************************
/**
 * class for ASN.1 DER TaggedObject
 * @name KJUR.asn1.DERTaggedObject
 * @class class for ASN.1 DER TaggedObject
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
 * For example, if you find '[1]' tag in a ASN.1 dump,
 * 'tagNoHex' will be 'a1'.
 * <br/>
 * As for optional argument 'params' for constructor, you can specify *ANY* of
 * following properties:
 * <ul>
 * <li>explicit - specify true if this is explicit tag otherwise false
 *     (default is 'true').</li>
 * <li>tag - specify tag (default is 'a0' which means [0])</li>
 * <li>obj - specify ASN1Object which is tagged</li>
 * </ul>
 * @example
 * d1 = new KJUR.asn1.DERUTF8String({'str':'a'});
 * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
 * hex = d2.getEncodedHex();
 */
KJUR.asn1.DERTaggedObject = function (params) {
    KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
    this.hT = "a0";
    this.hV = '';
    this.isExplicit = true;
    this.asn1Object = null;
    /**
     * set value by an ASN1Object
     * @name setString
     * @memberOf KJUR.asn1.DERTaggedObject#
     * @function
     * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
     * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
     * @param {ASN1Object} asn1Object ASN.1 to encapsulate
     */
    this.setASN1Object = function (isExplicitFlag, tagNoHex, asn1Object) {
        this.hT = tagNoHex;
        this.isExplicit = isExplicitFlag;
        this.asn1Object = asn1Object;
        if (this.isExplicit) {
            this.hV = this.asn1Object.getEncodedHex();
            this.hTLV = null;
            this.isModified = true;
        }
        else {
            this.hV = null;
            this.hTLV = asn1Object.getEncodedHex();
            this.hTLV = this.hTLV.replace(/^../, tagNoHex);
            this.isModified = false;
        }
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['tag'] != "undefined") {
            this.hT = params['tag'];
        }
        if (typeof params['explicit'] != "undefined") {
            this.isExplicit = params['explicit'];
        }
        if (typeof params['obj'] != "undefined") {
            this.asn1Object = params['obj'];
            this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);

;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/JSEncryptRSAKey.js
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







/**
 * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
 * This object is just a decorator for parsing the key parameter
 * @param {string|Object} key - The key in string format, or an object containing
 * the parameters needed to build a RSAKey object.
 * @constructor
 */
var JSEncryptRSAKey = /** @class */ (function (_super) {
    __extends(JSEncryptRSAKey, _super);
    function JSEncryptRSAKey(key) {
        var _this = _super.call(this) || this;
        // Call the super constructor.
        //  RSAKey.call(this);
        // If a key key was provided.
        if (key) {
            // If this is a string...
            if (typeof key === "string") {
                _this.parseKey(key);
            }
            else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
                JSEncryptRSAKey.hasPublicKeyProperty(key)) {
                // Set the values for the key.
                _this.parsePropertiesFrom(key);
            }
        }
        return _this;
    }
    /**
     * Method to parse a pem encoded string containing both a public or private key.
     * The method will translate the pem encoded string in a der encoded string and
     * will parse private key and public key parameters. This method accepts public key
     * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
     *
     * @todo Check how many rsa formats use the same format of pkcs #1.
     *
     * The format is defined as:
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * it's possible to examine the structure of the keys obtained from openssl using
     * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
     * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
     * @private
     */
    JSEncryptRSAKey.prototype.parseKey = function (pem) {
        try {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
            var asn1 = ASN1.decode(der);
            // Fixes a bug with OpenSSL 1.0+ private keys
            if (asn1.sub.length === 3) {
                asn1 = asn1.sub[2].sub[0];
            }
            if (asn1.sub.length === 9) {
                // Parse the private key.
                modulus = asn1.sub[1].getHexStringValue(); // bigint
                this.n = parseBigInt(modulus, 16);
                public_exponent = asn1.sub[2].getHexStringValue(); // int
                this.e = parseInt(public_exponent, 16);
                var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
                this.d = parseBigInt(private_exponent, 16);
                var prime1 = asn1.sub[4].getHexStringValue(); // bigint
                this.p = parseBigInt(prime1, 16);
                var prime2 = asn1.sub[5].getHexStringValue(); // bigint
                this.q = parseBigInt(prime2, 16);
                var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
                this.dmp1 = parseBigInt(exponent1, 16);
                var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
                this.dmq1 = parseBigInt(exponent2, 16);
                var coefficient = asn1.sub[8].getHexStringValue(); // bigint
                this.coeff = parseBigInt(coefficient, 16);
            }
            else if (asn1.sub.length === 2) {
                if (asn1.sub[0].sub) {
                    // Parse ASN.1 SubjectPublicKeyInfo type as defined by X.509
                    var bit_string = asn1.sub[1];
                    var sequence = bit_string.sub[0];
                    modulus = sequence.sub[0].getHexStringValue();
                    this.n = parseBigInt(modulus, 16);
                    public_exponent = sequence.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                }
                else {
                    // Parse ASN.1 RSAPublicKey type as defined by PKCS #1
                    modulus = asn1.sub[0].getHexStringValue();
                    this.n = parseBigInt(modulus, 16);
                    public_exponent = asn1.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                }
            }
            else {
                return false;
            }
            return true;
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa key.
     *
     * The translation follow the ASN.1 notation :
     * RSAPrivateKey ::= SEQUENCE {
     *   version           Version,
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER,  -- e
     *   privateExponent   INTEGER,  -- d
     *   prime1            INTEGER,  -- p
     *   prime2            INTEGER,  -- q
     *   exponent1         INTEGER,  -- d mod (p1)
     *   exponent2         INTEGER,  -- d mod (q-1)
     *   coefficient       INTEGER,  -- (inverse of q) mod p
     * }
     * @returns {string}  DER Encoded String representing the rsa private key
     * @private
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
        var options = {
            array: [
                new KJUR.asn1.DERInteger({ int: 0 }),
                new KJUR.asn1.DERInteger({ bigint: this.n }),
                new KJUR.asn1.DERInteger({ int: this.e }),
                new KJUR.asn1.DERInteger({ bigint: this.d }),
                new KJUR.asn1.DERInteger({ bigint: this.p }),
                new KJUR.asn1.DERInteger({ bigint: this.q }),
                new KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
                new KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
                new KJUR.asn1.DERInteger({ bigint: this.coeff }),
            ],
        };
        var seq = new KJUR.asn1.DERSequence(options);
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
        return hex2b64(this.getPrivateBaseKey());
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa public key.
     * The representation follow the ASN.1 notation :
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * @returns {string} DER Encoded String representing the rsa public key
     * @private
     */
    JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
        var first_sequence = new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
                new KJUR.asn1.DERNull(),
            ],
        });
        var second_sequence = new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERInteger({ bigint: this.n }),
                new KJUR.asn1.DERInteger({ int: this.e }),
            ],
        });
        var bit_string = new KJUR.asn1.DERBitString({
            hex: "00" + second_sequence.getEncodedHex(),
        });
        var seq = new KJUR.asn1.DERSequence({
            array: [first_sequence, bit_string],
        });
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
        return hex2b64(this.getPublicBaseKey());
    };
    /**
     * wrap the string in block of width chars. The default value for rsa keys is 64
     * characters.
     * @param {string} str the pem encoded string without header and footer
     * @param {Number} [width=64] - the length the string has to be wrapped at
     * @returns {string}
     * @private
     */
    JSEncryptRSAKey.wordwrap = function (str, width) {
        width = width || 64;
        if (!str) {
            return str;
        }
        var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
        return str.match(RegExp(regex, "g")).join("\n");
    };
    /**
     * Retrieve the pem encoded private key
     * @returns {string} the pem encoded private key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateKey = function () {
        var key = "-----BEGIN RSA PRIVATE KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
        key += "-----END RSA PRIVATE KEY-----";
        return key;
    };
    /**
     * Retrieve the pem encoded public key
     * @returns {string} the pem encoded public key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicKey = function () {
        var key = "-----BEGIN PUBLIC KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
        key += "-----END PUBLIC KEY-----";
        return key;
    };
    /**
     * Check if the object contains the necessary parameters to populate the rsa modulus
     * and public exponent parameters.
     * @param {Object} [obj={}] - An object that may contain the two public key
     * parameters
     * @returns {boolean} true if the object contains both the modulus and the public exponent
     * properties (n and e)
     * @todo check for types of n and e. N should be a parseable bigInt object, E should
     * be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
        obj = obj || {};
        return obj.hasOwnProperty("n") && obj.hasOwnProperty("e");
    };
    /**
     * Check if the object contains ALL the parameters of an RSA key.
     * @param {Object} [obj={}] - An object that may contain nine rsa key
     * parameters
     * @returns {boolean} true if the object contains all the parameters needed
     * @todo check for types of the parameters all the parameters but the public exponent
     * should be parseable bigint objects, the public exponent should be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e") &&
            obj.hasOwnProperty("d") &&
            obj.hasOwnProperty("p") &&
            obj.hasOwnProperty("q") &&
            obj.hasOwnProperty("dmp1") &&
            obj.hasOwnProperty("dmq1") &&
            obj.hasOwnProperty("coeff"));
    };
    /**
     * Parse the properties of obj in the current rsa object. Obj should AT LEAST
     * include the modulus and public exponent (n, e) parameters.
     * @param {Object} obj - the object containing rsa parameters
     * @private
     */
    JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
        this.n = obj.n;
        this.e = obj.e;
        if (obj.hasOwnProperty("d")) {
            this.d = obj.d;
            this.p = obj.p;
            this.q = obj.q;
            this.dmp1 = obj.dmp1;
            this.dmq1 = obj.dmq1;
            this.coeff = obj.coeff;
        }
    };
    return JSEncryptRSAKey;
}(rsa_RSAKey));


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/JSEncrypt.js
var _a;


var version = typeof process !== 'undefined'
    ? (_a = process.env) === null || _a === void 0 ? void 0 : _a.npm_package_version
    : undefined;
/**
 *
 * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
 * possible parameters are:
 * - default_key_size        {number}  default: 1024 the key size in bit
 * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
 * - log                     {boolean} default: false whether log warn/error or not
 * @constructor
 */
var JSEncrypt_JSEncrypt = /** @class */ (function () {
    function JSEncrypt(options) {
        if (options === void 0) { options = {}; }
        options = options || {};
        this.default_key_size = options.default_key_size
            ? parseInt(options.default_key_size, 10)
            : 1024;
        this.default_public_exponent = options.default_public_exponent || "010001"; // 65537 default openssl public exponent for rsa key type
        this.log = options.log || false;
        // The private and public key.
        this.key = null;
    }
    /**
     * Method to set the rsa key parameter (one method is enough to set both the public
     * and the private key, since the private key contains the public key paramenters)
     * Log a warning if logs are enabled
     * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
     * @public
     */
    JSEncrypt.prototype.setKey = function (key) {
        if (this.log && this.key) {
            console.warn("A key was already set, overriding existing.");
        }
        this.key = new JSEncryptRSAKey(key);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPrivateKey = function (privkey) {
        // Create the key.
        this.setKey(privkey);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPublicKey = function (pubkey) {
        // Sets the public key.
        this.setKey(pubkey);
    };
    /**
     * Proxy method for RSAKey object's decrypt, decrypt the string using the private
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str base64 encoded crypted string to decrypt
     * @return {string} the decrypted string
     * @public
     */
    JSEncrypt.prototype.decrypt = function (str) {
        // Return the decrypted string.
        try {
            return this.getKey().decrypt(b64tohex(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's encrypt, encrypt the string using the public
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str the string to encrypt
     * @return {string} the encrypted string encoded in base64
     * @public
     */
    JSEncrypt.prototype.encrypt = function (str) {
        // Return the encrypted string.
        try {
            return hex2b64(this.getKey().encrypt(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's sign.
     * @param {string} str the string to sign
     * @param {function} digestMethod hash method
     * @param {string} digestName the name of the hash algorithm
     * @return {string} the signature encoded in base64
     * @public
     */
    JSEncrypt.prototype.sign = function (str, digestMethod, digestName) {
        // return the RSA signature of 'str' in 'hex' format.
        try {
            return hex2b64(this.getKey().sign(str, digestMethod, digestName));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's verify.
     * @param {string} str the string to verify
     * @param {string} signature the signature encoded in base64 to compare the string to
     * @param {function} digestMethod hash method
     * @return {boolean} whether the data and signature match
     * @public
     */
    JSEncrypt.prototype.verify = function (str, signature, digestMethod) {
        // Return the decrypted 'digest' of the signature.
        try {
            return this.getKey().verify(str, b64tohex(signature), digestMethod);
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
     * will be created and returned
     * @param {callback} [cb] the callback to be called if we want the key to be generated
     * in an async fashion
     * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
     * @public
     */
    JSEncrypt.prototype.getKey = function (cb) {
        // Only create new if it does not exist.
        if (!this.key) {
            // Get a new private key.
            this.key = new JSEncryptRSAKey();
            if (cb && {}.toString.call(cb) === "[object Function]") {
                this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
                return;
            }
            // Generate the key.
            this.key.generate(this.default_key_size, this.default_public_exponent);
        }
        return this.key;
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateKey();
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateBaseKeyB64();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicKey();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicBaseKeyB64();
    };
    JSEncrypt.version = version;
    return JSEncrypt;
}());


;// CONCATENATED MODULE: ./node_modules/jsencrypt/lib/index.js


/* harmony default export */ const lib = ((/* unused pure expression or super */ null && (JSEncrypt)));

;// CONCATENATED MODULE: ./src/scripts/rsa.ts




class RSAEncrypt {
  constructor(modulus, exponent) {
    if (isExtension()) {
      this.encryptor = new JSEncrypt_JSEncrypt({
        log: true
      });
      const key = this.encryptor.getKey();
      const n = parseBigInt(modulus, 16);
      const e = parseInt(exponent, 16);
      key.parsePropertiesFrom({
        n,
        e
      });
    } else {
      const key = new RSAKey();
      key.setPublic(modulus, exponent);
      this.key = key;
    }
  }
  encrypt(data) {
    if (isExtension()) {
      try {
        return this.encryptor.getKey().encrypt(data);
      } catch (e) {
        log_error(`Failed to encrypt ${data.length} characters`, e);
        return null;
      }
    } else {
      return this.key.encrypt(data);
    }
  }
}
;// CONCATENATED MODULE: ./src/scripts/auth.ts







const GoogleUserInfoURL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GSuiteTokenRevokeUrl = 'https://accounts.google.com/o/oauth2/revoke';
async function auth_authenticateWithGSuiteHTTP(serverBaseURL, isInteractive) {
  return Promise.all([getRsaPublicKey(serverBaseURL), getGoogleAuthInfo(isInteractive)]).then(([rsaKey, authInfo]) => {
    return encryptCredentialsWithKey(`${authInfo.email}`, `${authInfo.token}`, rsaKey);
  });
}
async function authenticateWithGSuite(printJob, isInteractive, encryptForMobility = true) {
  log_log(`Authenticating with G-Suite: 
		printJobId=${printJob.printerId}, isInteractive=${isInteractive}, encryptForMobility=${encryptForMobility}`);
  if (encryptForMobility) {
    const serverBaseURL = printer_getUrlBaseOfPrinterUrl(printJob.printerId);
    return auth_authenticateWithGSuiteHTTP(serverBaseURL, isInteractive);
  }
  return getGoogleAuthInfo(isInteractive).then(googleAuth => new Promise(resolve => {
    return resolve({
      provider: 'google',
      userid: googleAuth.email,
      token: googleAuth.token
    });
  }));
}
async function getGoogleAuthInfo(isInteractive) {
  log_log(`Getting auth info from G-Suite: isInteractive=${isInteractive}`);
  const retryWithRefreshedToken = async (e, oldToken) => {
    log_error('failed to get Google user info. refreshing token...', e);
    const details = {
      interactive: isInteractive
    };
    return refreshToken(oldToken, details).then(newToken => getGSuiteUserInfo(newToken));
  };
  return getGSuiteToken(isInteractive).then(token => getGSuiteUserInfo(token).catch(e => retryWithRefreshedToken(e, token)));
}
async function getGSuiteToken(isInteractive) {
  const details = {
    interactive: isInteractive
  };
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken(details, token => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
        return;
      }
      resolve(token);
    });
  });
}
async function refreshToken(expiredToken, details) {
  return new Promise((resolve, reject) => {
    log_log(`Refreshing user token for: '${details.account}'...`);
    chrome.identity.removeCachedAuthToken({
      token: expiredToken
    }, () => {
      chrome.identity.getAuthToken(details, token => {
        if (chrome.runtime.lastError) {
          log_error(`Failed to refresh token: ${chrome.runtime.lastError.message}`);
          reject(chrome.runtime.lastError.message);
          return;
        }
        resolve(token);
      });
    });
  });
}
async function getGSuiteUserInfo(accessToken) {
  log_log('[getGSuiteUserInfo] Fetching user info from G-Suite...');
  try {
    const response = await fetch(`${GoogleUserInfoURL}?access_token=${accessToken}`);
    if (response.status !== 200) {
      throw new Error(`Failed to resolve G-Suite user: ${await response.text()}`);
    }
    const resp = await response.json();
    log_log(`[getGSuiteUserInfo] Resolved user: ${resp.email}`);
    return {
      token: accessToken,
      email: resp.email
    };
  } catch (err) {
    log_error('[getGSuiteUserInfo] Error:', err);
    throw err;
  }
}
async function getRsaPublicKey(urlBase) {
  try {
    const response = await fetch(urlBase + '/public-key', {
      method: 'GET',
      headers: {
        'client-type': clientVersionID()
      }
    }).then(response => http_getResponseBody(response));
    return parseRsaKey(response);
  } catch (err) {
    log_error('[getRsaPublicKey] Error:', err);
    throw err;
  }
  function parseRsaKey(resp) {
    if (!resp.modulus || !resp.exponent) {
      throw new Error('Invalid encryption key info returned by the server');
    } else {
      const keyLength = resp.modulus.length * 8 / 2;
      log_log(`[getRsaPublicKey] Mobility Print is using ${keyLength}bit RSA key...`);
      return new RSAEncrypt(resp.modulus, resp.exponent);
    }
  }
}
async function isGSuiteEnabledHTTP(urlBase) {
  log(`[isGSuiteEnabledHTTP] Checking if GSuite is enabled on server: ${urlBase}...`);
  try {
    const response = await fetch(urlBase + '/auth-options', {
      method: 'GET',
      headers: {
        'client-type': clientVersionID()
      }
    }).then(resp => getResponseBody(resp));
    return response.signInWithGoogle;
  } catch (err) {
    error('[isGSuiteEnabledHTTP] Error:', err);
    throw err;
  }
}
async function isGSuiteEnabledRTC(printerId) {
  const serverId = await getServerIdForPrinter(printerId);
  if (!serverId) {
    throw new Error(`unknown server id for printer: ${printerId}`);
  }
  const serverInfo = getServerIdToServerInfoCache().get(serverId);
  if (serverInfo) {
    return serverInfo.signInWithGoogle;
  }
  log(`Information for server '${serverId}' is not cached, fetching...`);
  return getServerInfoRTC(serverId).then(info => info.signInWithGoogle).catch(e => {
    error('Unable to determine if Google sign-in is enabled.', e);
    throw e;
  });
}
async function isGSuiteEnabled(printJob, cloudPrintJob = false) {
  log(`isGSuiteEnabled: printerId=${printJob.printerId} (${cloudPrintJob ? 'Cloud Job' : 'Local Job'})`);
  if (cloudPrintJob) {
    return isGSuiteEnabledRTC(printJob.printerId);
  }
  const urlBase = getUrlBaseOfPrinterUrl(printJob.printerId);
  return isGSuiteEnabledHTTP(urlBase);
}
async function revokeCachedGSuiteAuthToken(msBufferTime = 0) {
  log_log('Revoking auth token with G-Suite...');
  return new Promise(async (resolve, reject) => {
    try {
      const token = await new Promise(innerResolve => {
        chrome.identity.getAuthToken({
          interactive: false
        }, innerToken => {
          innerResolve(innerToken);
        });
      });
      if (token === null) {
        resolve();
        return;
      }
      const tokenParam = 'token=' + token;
      const response = await fetch(`${GSuiteTokenRevokeUrl}?${tokenParam}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.status === 200) {
        setTimeout(() => {
          resolve();
        }, msBufferTime);
      } else {
        reject(await response.text());
      }
    } catch (err) {
      log_error('[revokeCachedGSuiteAuthToken] Error:', err);
      reject('Connection failed');
    }
  });
}
async function encryptCredentialsWithKey(username, password, rsaKey) {
  log_log('Encrypting credentials...');
  const plainCredentials = username + ':' + password;
  const encrypted = rsaKey.encrypt(plainCredentials);
  if (!encrypted) {
    log_error('Credential encryption failed!', 'length', plainCredentials.length);
  }
  return encrypted;
}
function clientVersionID() {
  if (isExtension()) {
    return 'ChromeAppExt-' + chrome.runtime.getManifest().version;
  }
  return 'ChromeApp-' + chrome.runtime.getManifest().version;
}
async function auth_encryptCredentials(mpServerBaseUrl, username, password) {
  log_log(`Encrypting credentials for ${mpServerBaseUrl}...`);
  return getRsaPublicKey(mpServerBaseUrl).then(rsaKey => {
    return encryptCredentialsWithKey(username, password, rsaKey);
  });
}
const auth_inMemoryCreds = {
  rememberMe: false
};
function auth_rememberCredsInMemory(credentials) {
  auth_inMemoryCreds.username = credentials.username;
  auth_inMemoryCreds.password = credentials.password;
  auth_inMemoryCreds.rememberMe = credentials.rememberMe;
}
function clearInMemoryCreds() {
  auth_inMemoryCreds.username = undefined;
  auth_inMemoryCreds.password = undefined;
}
function auth_inMemoryCredsAvailable() {
  return auth_inMemoryCreds.username != null && auth_inMemoryCreds.password != null;
}
;// CONCATENATED MODULE: ./src/scripts/chrome/message/message_extension.ts

async function message_extension_sendPageMessage(msg, opts = {}) {
  return new Promise((resolve, reject) => {
    const tabMessage = opts.tabId !== undefined;
    console.info(`sendPageMessage(${tabMessage ? 'tab' : 'ext'}): ` + `${JSON.stringify(msg)}, opts: ${JSON.stringify(opts)}...`);
    const send = tabMessage ? chrome.tabs.sendMessage.bind(this, opts.tabId) : chrome.runtime.sendMessage;
    send(msg, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/chrome/chrome.ts


async function chrome_sendPageMessageWithRetry(msg, opts = {}) {
  if (msg === undefined) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const iter = (delay = 10, elapsed = 0, attempt = 0) => {
      setTimeout(async () => {
        elapsed += delay;
        attempt += 1;
        log_log('[sendPageMessageWithRetry] Attempting to send page message.', {
          attempt,
          msg,
          delay,
          elapsed
        });
        try {
          resolve(await message_extension_sendPageMessage(msg, opts));
        } catch (e) {
          if (elapsed < 500) {
            log_log('[sendPageMessageWithRetry] Unhandled page message send error within 500ms, will try again.', e);
            iter(delay * 2, elapsed, attempt);
          } else if (elapsed < 3000 && e && e['message'] == 'Could not establish connection. Receiving end does not exist.') {
            iter(delay * 2, elapsed, attempt);
          } else {
            reject(e);
          }
        }
      }, delay);
    };
    iter();
  });
}
;// CONCATENATED MODULE: ./src/scripts/chrome/index.ts



;// CONCATENATED MODULE: ./src/scripts/printdeploy/googleauth.ts

class GoogleOpenIDOAuthProvider {
  getAccessToken() {
    return getGoogleAuthInfo(true).then(authInfo => {
      return {
        accessToken: authInfo.token
      };
    });
  }
  getUserInfo(oauthToken) {
    return getGSuiteUserInfo(oauthToken.accessToken).then(userInfo => {
      return {
        email: userInfo.email
      };
    });
  }
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/oauth.ts

const oauth_OAuthProviderIDs = {
  Google: 'google'
};
function oauth_toPrintDeployTokenInfo(session) {
  return {
    authMethod: session.providerID,
    token: session.sessionToken
  };
}
const printDeployOauthProviders = new Map();
printDeployOauthProviders.set(oauth_OAuthProviderIDs.Google, new GoogleOpenIDOAuthProvider());
;// CONCATENATED MODULE: ./src/scripts/popup/popup_extension.ts




const maxWindowDimensions = {
  width: 1024,
  height: 768
};
const minWindowDimensions = {
  width: 100,
  height: 100
};
const defaultFrameSize = {
  width: 30,
  height: 30
};
let frameSize;
let displayBounds;
async function popup_extension_showPopup({
  page,
  width = 494,
  height = 610,
  message
}) {
  log('[popup] Displaying popup.', {
    page,
    width,
    height
  });
  await calculateFrameSize();
  const tab = await createTab({
    page,
    windowId: (await createPopupWindow(width, height)).id
  });
  log('[popup] sending page Message', {
    message
  });
  await sendPageMessageWithRetry(message, {
    tabId: tab.id
  });
  log(`[popup] Popup displayed (tab ${tab.id}).`, {
    page
  });
}
async function calculateFrameSize() {
  if (frameSize === undefined) {
    let saveFrameSize = false;
    frameSize = await getLocalStorageData('framesize');
    if (!frameSize || !frameSize.width || !frameSize.height) {
      log('Window frame size not known, calculating...');
      frameSize = await getFrameSize();
      saveFrameSize = true;
    }
    if (frameSize && frameSize.width >= 0 && frameSize.height >= 0) {
      log(`Using window frame size: ${JSON.stringify(frameSize)}`);
      Object.freeze(frameSize);
      if (saveFrameSize) {
        await setLocalStorageData('framesize', frameSize);
      }
    } else {
      warn(`Invalid window frame size, will use default: ${JSON.stringify(frameSize)}`);
      frameSize = defaultFrameSize;
    }
  }
}
async function createTab({
  page,
  windowId
}) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({
      url: chrome.runtime.getURL(page),
      windowId
    }, tab => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      log(`[popup] Tab '${page}' (id:${tab.id}, window:${tab.windowId}) created.`);
      resolve(tab);
    });
  });
}
async function getFrameSize() {
  return new Promise(async resolve => {
    try {
      log('[popup] Creating page to measure frame size.');
      let timeoutId = undefined;
      const frameSizeCallback = (frame, _s, responseCallback) => {
        var _fs$width, _fs$height;
        if (frame.type !== 'frame-size-response') {
          return;
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        responseCallback();
        chrome.runtime.onMessage.removeListener(frameSizeCallback);
        const fs = {
          width: frame.width,
          height: frame.height
        };
        fs.width = (_fs$width = fs.width) !== null && _fs$width !== void 0 ? _fs$width : defaultFrameSize.width;
        fs.height = (_fs$height = fs.height) !== null && _fs$height !== void 0 ? _fs$height : defaultFrameSize.height;
        log('[popup] Frame size measured.', fs);
        resolve(fs);
      };
      timeoutId = setTimeout(() => {
        chrome.runtime.onMessage.removeListener(frameSizeCallback);
        log('[popup] Timed out measuring frame size, using default.');
        resolve(defaultFrameSize);
      }, 3000);
      chrome.runtime.onMessage.addListener(frameSizeCallback);
      await createTab({
        page: 'framesize.html',
        windowId: (await createWindow({
          width: minWindowDimensions.width,
          height: minWindowDimensions.height,
          focused: false
        })).id
      });
    } catch (e) {
      log('[popup] Failed to measure frame size, using default.', e);
      resolve(defaultFrameSize);
    }
  });
}
async function createPopupWindow(width, height) {
  if (!displayBounds) {
    displayBounds = await getDisplayBounds(true);
    Object.freeze(displayBounds);
  }
  log('[popup] Display work area dimensions', JSON.stringify({
    displayWidth: displayBounds.width,
    displayHeight: displayBounds.height,
    maxWindowWidth: maxWindowDimensions.width,
    maxWindowHeight: maxWindowDimensions.height
  }));
  try {
    log('[popup] Creating window using screen info:', JSON.stringify({
      availWidth: displayBounds.width,
      availHeight: displayBounds.height,
      frameWidth: frameSize.width,
      frameHeight: frameSize.height
    }));
    return await createWindow({
      width: width + frameSize.width,
      height: height + frameSize.height,
      left: Math.round((displayBounds.width - width) / 2),
      top: Math.round((displayBounds.height - height) / 2)
    });
  } catch (e) {
    error('[popup] Window creation failed:', e);
    log('[popup] Last chance retry without centering.');
    return await createWindow({
      width: width + frameSize.width,
      height: height + frameSize.height,
      left: 0,
      top: 0
    });
  }
}
async function createWindow({
  width,
  height,
  left,
  top,
  focused = true
}) {
  if (displayBounds === undefined) {
    displayBounds = await getDisplayBounds(true);
    Object.freeze(displayBounds);
  }
  return new Promise((resolve, reject) => {
    log(`[popup] Requested window, width:${width}, height:${height}, left:${left}, top:${top}`);
    ({
      left,
      top,
      width,
      height
    } = normalizeWindowBounds({
      left,
      top,
      width,
      height
    }));
    chrome.windows.create({
      type: 'popup',
      focused,
      width,
      height,
      left,
      top
    }, async w => {
      if (chrome.runtime.lastError) {
        return reject(`failed to display popup: ${chrome.runtime.lastError.message}`);
      } else if (!w) {
        return reject('failed to display popup');
      }
      resolve(w);
    });
  });
}
function normalizeWindowBounds(wBounds) {
  const maxWidth = numRange(displayBounds.width, maxWindowDimensions.width, displayBounds.width);
  const maxHeight = numRange(displayBounds.height, maxWindowDimensions.height, displayBounds.height);
  return {
    width: numRange(wBounds.width, minWindowDimensions.width, maxWidth),
    height: numRange(wBounds.height, minWindowDimensions.height, maxHeight),
    left: wBounds.left ? numRange(wBounds.left, 0, Math.round((maxWidth - wBounds.width) / 2)) : undefined,
    top: wBounds.top ? numRange(wBounds.top, 0, Math.round((maxHeight - wBounds.height) / 2)) : undefined
  };
}
function numRange(value, min, max) {
  return Math.max(Math.min(value, max), min);
}
async function getDisplayBounds(isPrimary) {
  return new Promise(resolve => {
    chrome.system.display.getInfo(displays => {
      let display;
      for (const disp of displays) {
        if (disp.isPrimary === isPrimary) {
          display = disp;
        }
      }
      const bounds = display.workArea;
      if (bounds.width <= 0) {
        warn('Invalid display bounds width returned:', bounds.width);
        bounds.width = maxWindowDimensions.width;
      }
      if (bounds.height <= 0) {
        warn('Invalid display bounds height returned:', bounds.height);
        bounds.height = maxWindowDimensions.height;
      }
      resolve(bounds);
    });
  });
}
;// CONCATENATED MODULE: ./src/scripts/control/login.ts



async function login_displayLoginWindow({
  printJob = undefined,
  urlBase = undefined,
  showRememberMe,
  showUsernameLogin = false,
  showGoogleLogin = false,
  useCloudPrint = false,
  usePrintDeploy = false
}) {
  log('[displayLoginWindow]: Displaying sign-in pop-up.', {
    showRememberMe,
    showUsernameLogin,
    showGoogleLogin,
    useCloudPrint,
    usePrintDeploy
  });
  await showPopup({
    page: 'login.html',
    height: 675,
    message: {
      type: 'login-window-init',
      printJob,
      showUsernameLogin,
      showGoogleLogin,
      showRememberMe,
      urlBase,
      useCloudPrint,
      usePrintDeploy
    }
  });
}
async function login_closeLoginDialog() {
  log('[closeLoginDialog] sending message to close login window');
  const closeLoginWindowMessage = {
    type: 'close-login-window',
    msg: 'close window'
  };
  await sendPageMessage(closeLoginWindowMessage);
}
async function login_sendDisplayErrorMessage(errMsg) {
  log('[sendDisplayErrorMessage]: sending error to login window', {
    errMsg
  });
  const displayErrorMessage = {
    type: 'display-error',
    errMsg: errMsg
  };
  await sendPageMessageWithRetry(displayErrorMessage);
}
;// CONCATENATED MODULE: ./src/scripts/control/index.ts

;// CONCATENATED MODULE: ./src/scripts/printdeploy/printdeploy.types.ts
const printdeploy_types_PrintDeployAuthMethods = {
  Username: 'username',
  Google: 'google'
};
;// CONCATENATED MODULE: ./src/scripts/printdeploy/client/encryption.ts


const RSA_STRING_MAXLEN = 245;
class ClientEncryptionService {
  constructor(rsaKey, useAuthHeaderEncryption = false) {
    this.rsaKey = rsaKey;
    this.useAuthHeaderEncryption = useAuthHeaderEncryption;
  }
  encryptRequestBody(body) {
    const jsonBodyStr = JSON.stringify(body);
    if (this.rsaKey) {
      return this.encryptLongString(this.rsaKey, jsonBodyStr);
    }
    return jsonBodyStr;
  }
  encryptAuthHeaderValue(headerValue) {
    if (this.useAuthHeaderEncryption && this.rsaKey) {
      const encryptedHeader = this.encryptLongString(this.rsaKey, headerValue);
      if (encryptedHeader) {
        return encryptedHeader;
      }
    }
    return headerValue;
  }
  encryptLongString(rsaKey, str) {
    if (str.length <= RSA_STRING_MAXLEN) {
      return rsaKey.encrypt(str);
    }
    try {
      const pattern = `.{1,${RSA_STRING_MAXLEN}}`;
      return str.match(new RegExp(pattern, 'g')).map(s => rsaKey.encrypt(s)).reduce((acc, encryptedChunk) => acc + ',' + encryptedChunk);
    } catch (e) {
      console.error('encryption failed', e);
      return undefined;
    }
  }
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/client/client.ts




const DEFAULT_PRINT_DEPLOY_HTTPS_PORT = 9174;
const DEFAULT_PRINT_DEPLOY_HTTP_PORT = 9173;
class PrintDeployClientBuilder {
  constructor(host) {
    this.useHTTPSEncryption = () => new ClientEncryptionService();
    this.host = host;
  }
  withAccessibleTLSPort(port) {
    this.accessibleTLSPort = port;
    return this;
  }
  withStrictSSL(strictSSL) {
    this.strictSSL = strictSSL;
    return this;
  }
  withOAuthProviders(oauthProviders) {
    this.oauthProviders = oauthProviders;
    return this;
  }
  async build() {
    if (!this.oauthProviders) {
      this.oauthProviders = new Map();
    }
    if (this.hasCustomAccessibleTLSPort() || this.strictSSL) {
      const port = this.accessibleTLSPort || DEFAULT_PRINT_DEPLOY_HTTPS_PORT;
      const serverBaseURL = `https://${this.host}:${port}`;
      const client = new PDClient(serverBaseURL, this.oauthProviders, this.useHTTPSEncryption());
      return Promise.resolve(client);
    }
    const httpsServerBaseURL = `https://${this.host}:${DEFAULT_PRINT_DEPLOY_HTTPS_PORT}`;
    return fetch(httpsServerBaseURL).then(() => {
      const client = new PDClient(httpsServerBaseURL, this.oauthProviders, this.useHTTPSEncryption());
      return Promise.resolve(client);
    }).catch(_ => {
      const httpBaseUrl = `http://${this.host}:${DEFAULT_PRINT_DEPLOY_HTTP_PORT}`;
      return this.useEncryptedHTTP(httpBaseUrl).then(encryptionService => {
        return new PDClient(httpBaseUrl, this.oauthProviders, encryptionService);
      });
    });
  }
  async useEncryptedHTTP(httpBaseUrl) {
    if (httpBaseUrl.startsWith('https://')) {
      return Promise.reject('only use encrypted HTTP if the target host doesn\'t support HTTPS');
    }
    return getRsaPublicKey(httpBaseUrl).then(async rsaKey => {
      const useAuthHeaderEncryption = await this.isAuthHeaderEncryptionSupported(httpBaseUrl);
      return new ClientEncryptionService(rsaKey, useAuthHeaderEncryption);
    });
  }
  async isAuthHeaderEncryptionSupported(httpBaseUrl) {
    return fetch(`${httpBaseUrl}/${PrintDeployPaths.GET_CONFIG}`).then(resp => {
      return resp.status === 200;
    });
  }
  hasCustomAccessibleTLSPort() {
    return this.accessibleTLSPort && this.accessibleTLSPort !== 0 && this.accessibleTLSPort !== DEFAULT_PRINT_DEPLOY_HTTPS_PORT;
  }
}
var PrintDeployPaths;
(function (PrintDeployPaths) {
  PrintDeployPaths["LOGIN"] = "deploy/login";
  PrintDeployPaths["GET_PRINTERS"] = "deploy/printers";
  PrintDeployPaths["GET_CONFIG"] = "deploy/config";
  PrintDeployPaths["CREATE_OAUTH_SESSION"] = "deploy/oauth/session";
})(PrintDeployPaths || (PrintDeployPaths = {}));
const client_PrintDeployUnauthorizedError = 'Unauthorized';
class PDClient {
  constructor(serverBaseURL, oauthProviders, encryptionService) {
    this.encryptionService = encryptionService;
    this.providers = oauthProviders;
    this.serverBaseURL = serverBaseURL;
  }
  async login(credentials) {
    const username = credentials.username;
    const password = credentials.password;
    if (!username || !password) {
      return Promise.reject('missing required username/password to get PaperCut token');
    }
    const request = {
      headers: this.generateHeaders(),
      method: 'POST',
      body: this.encryptionService.encryptRequestBody({
        username,
        password
      })
    };
    return fetch(`${this.serverBaseURL}/${PrintDeployPaths.LOGIN}`, request).then(r => http_getResponseBody(r)).then(body => {
      return {
        authMethod: printdeploy_types_PrintDeployAuthMethods.Username,
        token: body.Token
      };
    });
  }
  async getConfig() {
    const headers = this.generateHeaders();
    return fetch(`${this.serverBaseURL}/${PrintDeployPaths.GET_CONFIG}`, {
      headers
    }).then(r => http_getResponseBody(r));
  }
  async getPrinters(tokenInfo, clientInfo) {
    const fetchPrinters = clientInfo => {
      const headers = this.generateHeaders(tokenInfo);
      const request = {
        headers: headers,
        method: 'POST',
        body: this.encryptionService.encryptRequestBody(clientInfo)
      };
      return fetch(`${this.serverBaseURL}/${PrintDeployPaths.GET_PRINTERS}`, request);
    };
    return fetchPrinters(clientInfo).then(handleInvalidToken).then(resp => http_getResponseBody(resp)).then(body => body.printers);
    function handleInvalidToken(resp) {
      if (resp.status === 401) {
        return Promise.reject(client_PrintDeployUnauthorizedError);
      }
      return Promise.resolve(resp);
    }
  }
  async createOAuthSession(providerID) {
    const oAuthProvider = this.providers.get(providerID);
    if (!oAuthProvider) {
      console.error('no such provider');
      return Promise.reject(`no registered provider for providerID=${providerID}`);
    }
    const oAuthToken = await oAuthProvider.getAccessToken();
    const url = `${this.serverBaseURL}/${PrintDeployPaths.CREATE_OAUTH_SESSION}`;
    const reqBody = {
      providerId: providerID,
      accessToken: oAuthToken.accessToken
    };
    return fetch(url, {
      method: 'POST',
      headers: this.generateHeaders(),
      body: this.encryptionService.encryptRequestBody(reqBody)
    }).then(resp => {
      if (resp.status === 403) {
        return Promise.reject('Unknown user');
      }
      return http_getResponseBody(resp);
    }).then(async body => {
      const sessionInfo = {
        providerID: providerID,
        username: body.username,
        sessionToken: body.sessionToken,
        oauthToken: oAuthToken,
        email: body.email
      };
      return Promise.resolve(sessionInfo);
    });
  }
  getServerBaseURL() {
    return this.serverBaseURL;
  }
  generateHeaders(tokenInfo) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    if (tokenInfo) {
      const header = `Bearer ${tokenInfo.token}`;
      headers['Authorization'] = this.encryptionService.encryptAuthHeaderValue(header);
      if (tokenInfo.authMethod !== printdeploy_types_PrintDeployAuthMethods.Username) {
        headers['PrintDeployAuthenticationType'] = tokenInfo.authMethod;
      }
    }
    return headers;
  }
}
;// CONCATENATED MODULE: ./src/scripts/chrome/network/network_extension.ts



const serviceType = '_banksia._tcp.local';
const minChromeVersion = 114;
const requiredChromeMessage = (/* unused pure expression or super */ null && (`Chrome ${minChromeVersion}+ required. Chrome version: ${getChromeOSVersion()}`));
function isSupportedChromeVersion() {
  return getChromeOSVersionMajor() >= minChromeVersion;
}
async function network_extension_getLocalIPAddresses() {
  return new Promise(async resolve => {
    try {
      if (isSupportedChromeVersion()) {
        chrome.system.network.getNetworkInterfaces(interfaces => {
          const localIPAddresses = interfaces.map(i => i.address).filter(isIPv4);
          log('[localIPAddresses] detected: ', localIPAddresses);
          resolve(localIPAddresses);
        });
        return;
      } else {
        log('[localIPAddresses] Chrome version not supported.', requiredChromeMessage);
      }
    } catch (e) {
      error('[localIPAddresses] chrome.system.network.getNetworkInterfaces failed.', e.message);
    }
    warn('[localIPAddresses] Local IP address unknown falling back to [0.0.0.0].');
    resolve(['0.0.0.0']);
  });
}
function startMDNSListener(onServiceList) {
  try {
    if (isSupportedChromeVersion()) {
      chrome.mdns.onServiceList.addListener(onServiceList, {
        serviceType
      });
      setInterval(() => {
        chrome.mdns.onServiceList.removeListener(onServiceList);
        chrome.mdns.onServiceList.addListener(onServiceList, {
          serviceType
        });
        chrome.mdns.forceDiscovery(() => {
          log('[MDNS:mdnsListener] ran re-discovery...');
        });
      }, 6000 * 1000);
      log('[MDNS:mdnsListener] registered...');
      return;
    } else {
      log('[MDNS:mdnsListener] Chrome version not supported.', requiredChromeMessage);
    }
  } catch (e) {
    error('chrome.mdns.onServiceList failed.', e.message);
  }
  warn('mDNS discovery will not work on this client.');
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/client/clientinfo.ts



async function clientinfo_getClientInfo() {
  return Promise.all([getClientId(), getPlatformInfo(), getLocalIPAddresses()]).then(([clientId, platformInfo, ipAddresses]) => {
    const chromeOSVersion = getChromeOSVersion();
    const clientInfo = {
      machine: {
        hostname: clientId,
        os: {
          name: 'chrome',
          version: chromeOSVersion,
          arch: platformInfo.arch
        },
        ipAddresses: ipAddresses,
        activeDirectoryDomainName: ''
      }
    };
    return clientInfo;
  });
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/client/index.ts



;// CONCATENATED MODULE: ./src/scripts/printdeploy/storage.ts

const OAUTH_SESSION_TOKEN_KEY = 'OauthSession';
const PRINT_DEPLOY_AUTH_REPO = 'printDeployAuthRepo';
const PRINT_DEPLOY_CONFIG_KEY = 'printDeployConfig';
const PAPERCUT_AUTH_KEY = 'papercutAuthCookie';
class PrintDeployLocalStorage {
  async getCachedConfig() {
    return storage_getLocalStorageData(PRINT_DEPLOY_CONFIG_KEY);
  }
  getCachedOAuthSessionToken() {
    return this.getCachedAuthToken(OAUTH_SESSION_TOKEN_KEY);
  }
  getCachedPrintDeployToken() {
    return this.getCachedAuthToken(PAPERCUT_AUTH_KEY);
  }
  async getCachedMobilityPrintServerToken(serverBaseUrl) {
    return this.getCachedAuthToken(serverBaseUrl);
  }
  async cacheConfig(config) {
    return storage_setLocalStorageData(PRINT_DEPLOY_CONFIG_KEY, config);
  }
  async cacheMobilityPrintServerToken(serverBaseUrl, token) {
    return this.cacheAuthToken(serverBaseUrl, token);
  }
  async cachePaperCutToken(token) {
    return this.cacheAuthToken(PAPERCUT_AUTH_KEY, token);
  }
  async cacheOAuthSessionToken(sessionToken) {
    return this.cacheAuthToken(OAUTH_SESSION_TOKEN_KEY, sessionToken);
  }
  async removeMobilityPrintServerToken(server) {
    const authRepo = await storage_getLocalStorageData(PRINT_DEPLOY_AUTH_REPO);
    if (!authRepo) {
      return Promise.resolve({});
    }
    delete authRepo[server];
    return storage_setLocalStorageData(PRINT_DEPLOY_AUTH_REPO, authRepo);
  }
  async cacheAuthToken(key, value) {
    let authRepo = await storage_getLocalStorageData(PRINT_DEPLOY_AUTH_REPO);
    if (!authRepo) {
      authRepo = {};
    }
    authRepo[key] = value;
    await storage_setLocalStorageData(PRINT_DEPLOY_AUTH_REPO, authRepo);
    return Promise.resolve(value);
  }
  async getCachedAuthToken(key) {
    return storage_getLocalStorageData(PRINT_DEPLOY_AUTH_REPO).then(authRepo => {
      if (!authRepo) {
        return undefined;
      }
      return authRepo[key];
    });
  }
  invalidateAllCachedTokens() {
    return storage_setLocalStorageData(PRINT_DEPLOY_AUTH_REPO, {});
  }
}
const storage_printDeployStorage = new PrintDeployLocalStorage();
;// CONCATENATED MODULE: ./src/scripts/printdeploy/printdeploy.ts











var ManagedStorageKeys;
(function (ManagedStorageKeys) {
  ManagedStorageKeys["PrintDeployServerHosts"] = "PrintDeployServerHosts";
  ManagedStorageKeys["AccessiblePrintDeployTLSPort"] = "AccessiblePrintDeployTLSPort";
  ManagedStorageKeys["StrictSSLCheckingEnabled"] = "StrictSSLCheckingEnabled";
})(ManagedStorageKeys || (ManagedStorageKeys = {}));
async function getPrintersFromPrintDeploy() {
  const pdHost = await getPreconfiguredPrintDeployServer();
  if (!pdHost) {
    log('[getPreconfiguredPrintDeployServer] no Print Deploy servers preconfigured');
    return [[], false];
  }
  try {
    log('[getPrintersFromPrintDeploy] found Print Deploy server:', pdHost);
    const printers = await getPrintersFromPrintDeployHost(pdHost);
    return [printers, true];
  } catch (e) {
    log('[getPrintersFromPrintDeployHost] failed to get printers:', e);
    return [[], true];
  }
}
async function getPreconfiguredPrintDeployServer() {
  return getManagedStorageData(ManagedStorageKeys.PrintDeployServerHosts).then(hosts => {
    if (!hosts || hosts.length === 0) {
      return null;
    }
    return hosts[0];
  });
}
async function getPrintDeployClient(pdHost) {
  const strictSSLCheckingEnabled = await getManagedStorageData(ManagedStorageKeys.StrictSSLCheckingEnabled);
  const accessibleTLSPort = await getManagedStorageData(ManagedStorageKeys.AccessiblePrintDeployTLSPort);
  const pdClient = await new PrintDeployClientBuilder(pdHost).withAccessibleTLSPort(accessibleTLSPort).withStrictSSL(strictSSLCheckingEnabled).withOAuthProviders(printDeployOauthProviders).build();
  log_log(`[printDeployClientBuilder] built PDClient with serverBaseURL=${pdClient.getServerBaseURL()}`);
  return Promise.resolve(pdClient);
}
async function getPrintersFromPrintDeployHost(pdHost) {
  const pdClient = await getPrintDeployClient(pdHost);
  let clientConfig;
  try {
    clientConfig = await pdClient.getConfig();
  } catch (e) {
    log('[pdClient.getConfig] failed to fetch config', e);
    return [];
  }
  log('[pdClient.getConfig] received config from server:', clientConfig);
  await printDeployStorage.cacheConfig(clientConfig);
  return getPrintersForClient(pdClient).then(getAndSaveTokensForPrinters).then(mapPrintersForPrintProvider);
}
async function getAndSaveTokensForPrinters(printers) {
  log('[getAndSaveTokensForPrinters]', printers);
  const clientConfig = await printDeployStorage.getCachedConfig();
  const mpServers = printers.map(printer => {
    return getSecureURLForMPServer(getUrlBaseOfPrinterUrl(printer.connection.name), clientConfig);
  });
  const uniqueMPServers = Array.from(new Set(mpServers));
  log(`[printdeploy.uniqueMPServers] found ${uniqueMPServers.length} unique MP servers from the discovered queues`, uniqueMPServers);
  return Promise.all(uniqueMPServers.map(getMobilityPrintTokenIfMissing)).then(() => printers);
  async function getMobilityPrintTokenIfMissing(mpServerURL) {
    return printDeployStorage.getCachedMobilityPrintServerToken(mpServerURL).then(token => token ? token : fetchTokenFromMobilityPrintServer(mpServerURL, inMemoryCreds)).then(token => {
      return inMemoryCreds.rememberMe ? printDeployStorage.cacheMobilityPrintServerToken(mpServerURL, token) : token;
    }).catch(e => {
      log(`[getMobilityPrintToken] failed to get token for MP server ${mpServerURL} via HTTPS. This may happen ` + 'if the MP server isn\'t using a non-zero length CA-signed certificate. We will use encrypted HTTP ' + 'instead. error:', e.message || e);
      return null;
    });
  }
}
function getSecureURLForMPServer(mpServerURL, config) {
  const server = mpServerURL.replace(/http:/gi, 'https:');
  let tlsPort = config === null || config === void 0 ? void 0 : config.AccessibleMobilityPrintTLSPort;
  if (!tlsPort || tlsPort == 0) {
    tlsPort = 9164;
  }
  return server.replace(/:9163/gi, `:${tlsPort}`);
}
async function getPrintersForClient(pdClient) {
  const fetchPrinters = () => {
    log('[fetchPrinters] getting print deploy token');
    return getPrintDeployToken(pdClient).then(tokenInfo => {
      return getClientInfo().then(clientInfo => {
        log(`[getPrinters] getting printers with the following user details: ${JSON.stringify(clientInfo)}`);
        return pdClient.getPrinters(tokenInfo, clientInfo);
      });
    });
  };
  return fetchPrinters().catch(e => {
    if (e === PrintDeployUnauthorizedError) {
      return printDeployStorage.invalidateAllCachedTokens().then(() => fetchPrinters());
    }
    return Promise.reject(e);
  });
}
async function getPrintDeployToken(pdClient) {
  const usernameToken = await printDeployStorage.getCachedPrintDeployToken();
  if (usernameToken) {
    return {
      authMethod: PrintDeployAuthMethods.Username,
      token: usernameToken
    };
  }
  const oauthSessionCreds = await printDeployStorage.getCachedOAuthSessionToken();
  if (oauthSessionCreds) {
    return toPrintDeployTokenInfo(oauthSessionCreds);
  }
  log('[handleMissingPaperCutToken] checking in memory creds');
  if (inMemoryCredsAvailable()) {
    return pdClient.login(inMemoryCreds).catch(() => askUserToAuthenticateForPrintDeploy(pdClient));
  }
  log('[handleMissingPaperCutToken] in memory creds unavailable');
  return askUserToAuthenticateForPrintDeploy(pdClient);
}
async function fetchTokenFromMobilityPrintServer(mpServerBaseUrl, credentials) {
  const {
    username,
    password
  } = credentials;
  if (!username || !password) {
    return Promise.reject('missing required username/password to get token from Mobility Print server');
  }
  if (mpServerBaseUrl.startsWith('http:')) {
    return Promise.reject('cannot get token from MP server using non-HTTPS URL');
  }
  const authUrl = `${mpServerBaseUrl}/token?printerName=none`;
  const requestParams = {
    headers: {
      Authorization: `Basic ${btoa(username + ':' + password)}`
    },
    method: 'GET'
  };
  return fetch(authUrl, requestParams).then(resp => getResponseBody(resp)).then(body => body.token);
}
async function askUserToAuthenticateForPrintDeploy(pdClient) {
  return new Promise(async (resolve, _reject) => {
    chrome.runtime.onMessage.addListener(onCredentialsEnteredForPrintDeployHandler(pdClient, resolve));
    chrome.runtime.onMessage.addListener(onOauthSessionCreatedForPrintDeployHandler(resolve));
    await showLoginWindow();
  });
}
function onCredentialsEnteredForPrintDeployHandler(pdClient, resolve) {
  return (message, sender) => {
    if (message.type === 'on-credentials-entered') {
      log('[onCredentialsEnteredForPrintDeployHandler] message received', {
        message,
        sender
      });
      const credentialsEntered = message;
      onCredentialsEnteredForPrintDeploy(credentialsEntered.credentials, pdClient).then(tokenInfo => {
        log('[onCredentialsEnteredForPrintDeployHandler] succeeded', {
          tokenInfo
        });
        chrome.runtime.onMessage.removeListener(onCredentialsEnteredForPrintDeployHandler(pdClient, resolve));
        resolve(tokenInfo);
        return true;
      }).catch(e => {
        log('error', {
          e
        });
        if (e === PrintDeployUnauthorizedError) {
          printDeployStorage.invalidateAllCachedTokens().then(() => {
            log('[onCredentialsEnteredForPrintDeployHandler] cleared cached print deploy tokens');
          }).catch(e => {
            log('[onCredentialsEnteredForPrintDeployHandler] error clearing print deploy tokens', {
              e
            });
          });
        }
        const errorMessage = resolveErrorToDisplay(e);
        sendDisplayErrorMessage(errorMessage).then(() => {
          log('[onCredentialsEnteredForPrintDeployHandler] sendDisplayErrorMessage');
        }).catch(e => {
          log('[onCredentialsEnteredForPrintDeployHandler]  sendDisplayErrorMessage error:', {
            e
          });
        });
        return true;
      });
    }
  };
}
async function onCredentialsEnteredForPrintDeploy(credentials, pdClient) {
  rememberCredsInMemory(credentials);
  return pdClient.login(credentials).then(async tokenInfo => {
    if (credentials.rememberMe) {
      await printDeployStorage.cachePaperCutToken(tokenInfo.token);
    }
    closeLoginDialog().then(() => {
      log('[onCredentialsEnteredForPrintDeploy] closed login dialog');
    }).catch(e => {
      log('[onCredentialsEnteredForPrintDeploy]  error:', {
        e
      });
    });
    return tokenInfo;
  });
}
function onOauthSessionCreatedForPrintDeployHandler(resolve) {
  return (message, sender) => {
    if (message.type === 'oauth-session-created') {
      log('[onOauthSessionCreatedForPrintDeployHandler] message received from', {
        message,
        sender
      });
      const oauthSessionCreated = message;
      log('[onOauthSessionCreatedForPrintDeployHandler]Received message oauthSessionCreated');
      onOAuthSessionCreatedForPrintDeploy(oauthSessionCreated.rememberMe, oauthSessionCreated.sessionCredentials).then(tokenInfo => {
        log('onOauthSessionCreatedForPrintDeployHandler succeeded', {
          tokenInfo
        });
        chrome.runtime.onMessage.removeListener(onOauthSessionCreatedForPrintDeployHandler(resolve));
        resolve(tokenInfo);
        return true;
      }).catch(e => {
        log('error', {
          e
        });
        return true;
      });
      return true;
    }
  };
}
async function onOAuthSessionCreatedForPrintDeploy(rememberMe, sessionCredentials) {
  log('[onOAuthSessionCreatedForPrintDeploy] onOAuthSessionCreated');
  rememberCredsInMemory({
    ...inMemoryCreds,
    rememberMe
  });
  if (rememberMe) {
    await printDeployStorage.cacheOAuthSessionToken(sessionCredentials);
  }
  closeLoginDialog().then(() => {
    log('[onOAuthSessionCreatedForPrintDeploy] closed login dialog');
  }).catch(e => {
    log('[onOAuthSessionCreatedForPrintDeploy]  error:', {
      e
    });
  });
  log('[onOAuthSessionCreatedForPrintDeploy]  getting token info');
  const printDeployTokenInfo = toPrintDeployTokenInfo(sessionCredentials);
  log('[onOAuthSessionCreatedForPrintDeploy] token info', {
    printDeployTokenInfo
  });
  return printDeployTokenInfo;
}
async function showLoginWindow(onCredentialsEntered) {
  log('[showLoginWindow] called', {
    onCredentialsEntered
  });
  const config = await printDeployStorage.getCachedConfig();
  const showUsernameLogin = config && config.AuthMethods.includes(PrintDeployAuthMethods.Username);
  const showGoogleLogin = config && config.AuthMethods.includes(PrintDeployAuthMethods.Google);
  await displayLoginWindow({
    showRememberMe: true,
    showUsernameLogin,
    showGoogleLogin,
    usePrintDeploy: true
  });
}
function mapPrintersForPrintProvider(printers) {
  return printers.map(({
    name,
    connection
  }) => {
    const displayName = getNormalisedName(name);
    return {
      id: `${connection.name}/printers/${encodeURI(displayName)}`,
      name: displayName,
      description: name,
      authMode: 'per-server',
      capabilities: undefined
    };
  });
}
function getNormalisedName(mpPrinterName) {
  const regex = /(.*)\[.*\]\(Mobility\)$/gm;
  if (!regex.test(mpPrinterName)) {
    return mpPrinterName;
  }
  return mpPrinterName.substring(0, mpPrinterName.lastIndexOf('[')).trim();
}
function resolveErrorToDisplay(e) {
  if (e.message) {
    if (e.message.includes('HTTP 401')) {
      return 'Invalid username and password';
    } else if (e.message.includes('HTTP 500')) {
      return 'An internal server error occurred';
    } else if (e.message.includes('Failed to fetch')) {
      return 'Connection failed';
    }
  }
  return 'Unknown error.';
}
async function getPDAuthForMobilityServer(mpServer) {
  const cachedToken = await printDeployStorage.getCachedMobilityPrintServerToken(mpServer);
  if (cachedToken) {
    log(`[getPrintDeployAuth] found cached token for ${mpServer}`);
    return Promise.resolve({
      token: cachedToken
    });
  }
  return handleMissingToken().catch(_e => {
    log(`[getPrintDeployAuth] did not find any cached tokens or credentials for MP server "${mpServer}. asking ` + 'user to authenticate..."');
    return askUserToAuthenticateForMPServer(mpServer);
  });
  async function handleMissingToken() {
    const oauthSession = await printDeployStorage.getCachedOAuthSessionToken();
    if (oauthSession && oauthSession.providerID === OAuthProviderIDs.Google) {
      return authenticateWithGSuiteHTTP(mpServer, false).then(encryptedCreds => {
        log(`[getPrintDeployAuth] generated encrypted oauth credentials for ${oauthSession.providerID}`);
        return {
          encryptedCreds,
          authOption: OAuthProviderIDs.Google
        };
      });
    }
    if (inMemoryCredsAvailable()) {
      return encryptCredentials(mpServer, inMemoryCreds.username, inMemoryCreds.password).then(encryptedCreds => {
        log('[getPrintDeployAuth] generated encrypted basic credentials');
        return {
          encryptedCreds
        };
      });
    }
    return Promise.reject(PrintDeployUnauthorizedError);
  }
}
function askUserToAuthenticateForMPServer(mpServer) {
  return new Promise(async (resolve, _reject) => {
    chrome.runtime.onMessage.addListener(onCredentialsEnteredForMPServerHandler(mpServer, resolve));
    await showLoginWindow();
  });
}
function onCredentialsEnteredForMPServerHandler(mpServer, resolve) {
  return (message, sender) => {
    if (message.type === 'on-credentials-entered') {
      const credentialsEntered = message;
      log('[onCredentialsEnteredForMPServerHandler] message received', {
        message,
        sender
      });
      onCredentialsEnteredForMPServer(credentialsEntered.credentials, mpServer).then(encryptedCredentials => {
        chrome.runtime.onMessage.removeListener(onCredentialsEnteredForMPServerHandler(mpServer, resolve));
        log('[onCredentialsEnteredForMPServer] succeeded', {
          encryptedCredentials
        });
        resolve(Promise.resolve(encryptedCredentials));
        closeLoginDialog().then(() => {
          log('[onCredentialsEnteredForMPServerHandler] closed login dialog');
        }).catch(e => {
          log('[onCredentialsEnteredForMPServerHandler]  error:', {
            e
          });
        });
        return true;
      }).catch(e => {
        const errorMessage = resolveErrorToDisplay(e);
        sendDisplayErrorMessage(errorMessage).then(() => {
          log('[onCredentialsEnteredForMPServerHandler] sendDisplayErrorMessage');
        }).catch(e => {
          log('[onCredentialsEnteredForMPServerHandler]  sendDisplayErrorMessage error:', {
            e
          });
        });
        return true;
      });
    }
  };
}
function wrapCreds(encryptedCreds) {
  return {
    encryptedCreds: encryptedCreds
  };
}
function onCredentialsEnteredForMPServer(credentials, mpServer) {
  rememberCredsInMemory(credentials);
  return encryptCredentials(mpServer, inMemoryCreds.username, inMemoryCreds.password).then(async encryptedCreds => {
    return wrapCreds(encryptedCreds);
  });
}
;// CONCATENATED MODULE: ./src/scripts/printdeploy/index.ts





;// CONCATENATED MODULE: ./src/scripts/window/window.ts
function windowResizeToInner(w, width, height) {
  w.resizeTo(width + (w.outerWidth - w.innerWidth), height + (w.outerHeight - w.innerHeight));
}
;// CONCATENATED MODULE: ./src/scripts/internationalization.js
/*
 * Copyright © 2017-2021 PaperCut Software International Pty. Ltd.
 */




function localizeHtmlPage() {
	log_log(`localizeHtmlPage: ${chrome.i18n.getUILanguage()}`);

	jquery_default()('.translated').each(function() {
		let element = jquery_default()(this);
		let key = element.data('key');
		let newText = key ? chrome.i18n.getMessage(key) : key;

		element.html(newText);
	});
}

localizeHtmlPage();

;// CONCATENATED MODULE: ./src/scripts/login/login.ts










chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'login-window-init') {
    log_log('Received init window message.', {
      message
    });
    initLoginWindow(message);
    sendResponse();
  } else if (message.type === 'close-login-window') {
    log_log('Received close window message');
    exitLoadingState();
    hideErrors();
    sendResponse();
    window.close();
  } else if (message.type === 'display-error') {
    log_log('display-error message received', {
      message
    });
    const displayErrorMessage = message;
    exitLoadingState();
    showMessageForError(displayErrorMessage.errMsg);
    sendResponse();
  } else {
    log_log(`unknown message from '${sender.url}: ${JSON.stringify(message)}`);
    sendResponse();
  }
});
const credentialsResponseHandler = function (response) {
  log_log('[credentialsResponseHandler]');
  exitLoadingState();
  updateUiOnJobSubmissionResponse(response);
};
const updateUiOnJobSubmissionResponse = function (response) {
  exitLoadingState();
  if (response && response.ok) {
    log_log('Authentication successful. Job submitted successfully.');
    hideErrors();
    window.close();
  } else {
    const error = response && response.message ? response.message : 'Failed to log in. Please try again.';
    showMessageForError(error);
  }
};
function initLoginWindow(loginWindow) {
  const loginUsingPaperCutCredentials = function () {
    enterLoadingState();
    const isRemember = jquery_default()('#remember').is(':checked');
    const username = jquery_default()('#username').val();
    const password = jquery_default()('#password').val();
    log_log(`Credentials entered for username="${username}" with ${password.length === 0 ? 'an empty' : 'a non-empty'} password`);
    if (loginWindow.useCloudPrint === true) {
      sendPrintJobMessage({
        username: username,
        password: password
      }, isRemember, loginWindow.useCloudPrint, credentialsResponseHandler);
      return;
    }
    auth_encryptCredentials(loginWindow.urlBase, username, password).then(encryptedCreds => {
      sendPrintJobMessage(encryptedCreds, isRemember, loginWindow.useCloudPrint, credentialsResponseHandler);
    }).catch(e => {
      exitLoadingState();
      e instanceof Error ? showMessageForError(e.message) : showMessageForError(e);
    });
  };
  const loginUsingGSuite = function () {
    enterLoadingState();
    const isRemember = jquery_default()('#remember').is(':checked');
    log_log(`loginUsingGSuite selected: isRemember=${isRemember}`);
    if (loginWindow.usePrintDeploy) {
      return getPreconfiguredPrintDeployServer().then(host => getPrintDeployClient(host)).then(client => client.createOAuthSession(oauth_OAuthProviderIDs.Google)).then(async session => {
        const oauthSessionCreatedMessage = {
          type: 'oauth-session-created',
          sessionCredentials: session,
          rememberMe: isRemember
        };
        await chrome_sendPageMessageWithRetry(oauthSessionCreatedMessage);
      }).catch(e => {
        exitLoadingState();
        e instanceof Error ? showMessageForError(e.message) : showMessageForError(e);
      });
    }
    return authenticateWithGSuite(loginWindow.printJob, true, !loginWindow.useCloudPrint).then(credentials => {
      sendPrintJobMessage(credentials, isRemember, loginWindow.useCloudPrint, handleResponse, 'google');
    }).catch(e => {
      showMessageForError(e, true);
      exitLoadingState();
    });
    function handleResponse(response) {
      log_log('handleResponse:', response);
      if (response && response.message === 'Invalid username or password') {
        response.message = 'Unknown user';
        revokeCachedGSuiteAuthToken(5000).finally(() => {
          updateUiOnJobSubmissionResponse(response);
        });
      } else {
        if (!isRemember) {
          revokeCachedGSuiteAuthToken().finally(() => {
            updateUiOnJobSubmissionResponse(response);
          });
        } else {
          updateUiOnJobSubmissionResponse(response);
        }
      }
    }
  };
  const onLoginClick = function () {
    if (loginWindow.usePrintDeploy) {
      const rememberMe = jquery_default()('#remember').is(':checked');
      const credentials = {
        username: (jquery_default()('#username').val() || '').toString(),
        password: (jquery_default()('#password').val() || '').toString(),
        rememberMe: rememberMe
      };
      const onCredentialsEnteredMessage = {
        type: 'on-credentials-entered',
        credentials: credentials
      };
      chrome_sendPageMessageWithRetry(onCredentialsEnteredMessage).then(() => {
        log_log('credentials message sent');
      }).catch(e => {
        log_log('error sending credentials', {
          e
        });
      });
      enterLoadingState();
    } else {
      loginUsingPaperCutCredentials();
    }
  };
  const initialise = function () {
    log_log('Setting up login options.', {
      showUsernameLogin: loginWindow.showUsernameLogin,
      showGoogleLogin: loginWindow.showGoogleLogin
    });
    if (loginWindow.showUsernameLogin && !loginWindow.showGoogleLogin) {
      const size = {
        width: 494,
        height: 610
      };
      log_log('Resizing window for user/pass only.', size);
      windowResizeToInner(window, size.width, size.height);
    } else if (!loginWindow.showUsernameLogin && loginWindow.showGoogleLogin) {
      const size = {
        width: 494,
        height: 465
      };
      log_log('Resizing window for Sign in with Google only.', size);
      windowResizeToInner(window, size.width, size.height);
    }
    toggleRemember(loginWindow.showRememberMe);
    const loginForm = jquery_default()('#login-form');
    const userPassArea = jquery_default()('#login-form-username');
    const userPassLoginButton = jquery_default()('#login');
    const orArea = jquery_default()('#login-form-or');
    const googleArea = jquery_default()('#login-form-google');
    const googleLoginButton = jquery_default()('#googlelogin');
    if (loginWindow.showUsernameLogin) {
      userPassLoginButton.on('click', function () {
        if (loginForm.valid()) {
          onLoginClick();
        }
      });
    } else {
      userPassArea.hide();
    }
    orArea.css('visibility', loginWindow.showUsernameLogin && loginWindow.showGoogleLogin ? 'visible' : 'hidden');
    if (loginWindow.showGoogleLogin) {
      googleLoginButton.on('click', function () {
        hideErrors();
        loginUsingGSuite().then(() => {
          log_log('[login] loginUsingGSuite returned');
        });
      });
    } else {
      googleArea.hide();
    }
    loginForm.validate({
      errorPlacement: function (error, element) {
        jquery_default()(element).closest('form').find('label[for=\'' + element.attr('id') + '\']').append(error);
      },
      errorElement: 'span',
      messages: {
        username: {
          required: ' (required)'
        },
        password: {
          required: ' (required)'
        }
      }
    });
    jquery_default()('#close').on('click', function () {
      const loginWindowClosedMessage = {
        type: 'login-window-closed',
        msg: 'window closed'
      };
      chrome_sendPageMessageWithRetry(loginWindowClosedMessage).then(() => {
        log_log('sent login window closed message');
      }).catch(e => {
        log_log('no one heard about the windows closing', {
          e
        });
      });
      window.close();
    });
    loginForm.find('input').keypress(function (e) {
      if (e.which == 10 || e.which == 13) {
        if (loginForm.valid()) {
          onLoginClick();
        }
      }
    });
    loginForm.find('input').on('input', function () {
      hideErrors();
    });
    jquery_default()(document).keyup(function (event) {
      if (event.keyCode === 27) {
        window.close();
      }
    });
  };
  initialise();
}
function exitLoadingState() {
  const loginButton = jquery_default()('#login');
  loginButton.removeAttr('disabled').removeClass('loading');
  const googleLoginBtn = jquery_default()('#googlelogin');
  googleLoginBtn.removeAttr('disabled').removeClass('loading');
}
function toggleRemember(showRememberMe) {
  jquery_default()('#remember-me-container').toggle(showRememberMe);
}
function enterLoadingState() {
  const loginButton = jquery_default()('#login');
  loginButton.attr('disabled', 'disabled').addClass('loading');
  const googleLoginBtn = jquery_default()('#googlelogin');
  googleLoginBtn.attr('disabled', 'disabled').addClass('loading');
}
function hideErrors() {
  jquery_default()('span.error-message').each((idx, em) => {
    jquery_default()(em).hide();
  });
}
function isAuthError(err) {
  if (err) {
    return err.includes('user and password') || err.includes('authentication');
  }
  return false;
}
function isConnectionError(err) {
  if (err) {
    return err.includes('Connection failed') || err.includes('Could not connect') || err.includes('Failed to fetch') || isCloudPrintError(err);
  }
  return false;
}
function showMessageForError(err, displayVerbatim) {
  log_log(`showMessageForError: ${err}, displayVerbatim=${displayVerbatim}`);
  if (displayVerbatim) {
    jquery_default()('#error-message-show-verbatim').text(err).show();
  } else if (isAuthError(err)) {
    jquery_default()('#error-message-invalid-creds').show();
  } else if (err === 'The user did not approve access.') {
    jquery_default()('#error-message-grant-access').show();
  } else if (err === 'Unknown user') {
    jquery_default()('#error-message-unknown-g-account').show();
  } else if (err === 'GSuite not supported') {
    jquery_default()('#error-message-gsuite-not-supported').show();
  } else if (isConnectionError(err)) {
    jquery_default()('#error-message-connection-failed').show();
  } else if (err.includes('let third-party apps access Directory data')) {
    jquery_default()('#error-message-gsuite-third-party-access').show();
  } else if (err.includes('Printer access denied by group restriction')) {
    jquery_default()('#error-message-denied-group-restriction').show();
  } else if (err.includes('is not registered')) {
    jquery_default()('#error-message-email-unregistered').show();
  } else {
    jquery_default()('#error-message-invalid-creds').show();
  }
}
function sendPrintJobMessage(credentials, isRemember, useCloudPrint = false, responseHandler, authOption = '') {
  log_log(`sendPrintJobMessage: isRemember=${isRemember}, useCloudPrint=${useCloudPrint}, authOption=${authOption}`);
  const sendPrintJobMessage = {
    type: 'send-print-job-message',
    credentials: credentials,
    remember: isRemember,
    useCloudPrint: useCloudPrint,
    authOption: authOption
  };
  chrome.runtime.sendMessage(sendPrintJobMessage, {}, responseHandler);
}
chrome.runtime.onSuspend.addListener(() => {
  log_log('[login] Suspending.');
});
})();

/******/ })()
;