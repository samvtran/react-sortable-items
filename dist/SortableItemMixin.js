var SortableItemMixin =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM *//** @jsx React.DOM */
	'use strict';

	var React = __webpack_require__(1);
	var cx = __webpack_require__(2);

	/**
	 * Elements with 'is-isolated' in the class list will not trigger on mouse down events.
	 */
	module.exports = {
	  getDefaultProps: function() {
	    return {
	      sortableStyle: {},
	      onSortableItemMount: function(){},
	      onSortableItemMouseDown: function(){},
	      isDraggable: true,
	      // Used by the Sortable component
	      _isPlaceholder: false,
	      _isDragging: false
	    }
	  },
	  handleSortableItemMouseDown: function(e) {
	    var evt = {
	      pageX: e.pageX,
	      pageY: e.pageY,
	      offset: this.getPosition()
	    };
	    if (!e.target.classList.contains('is-isolated') && this.props.isDraggable) {
	      this.props.onSortableItemMouseDown(evt, this.props.sortableIndex);
	      e.stopPropagation();
	    }
	  },
	  outerHeight: function() {
	    var element = this.getDOMNode();
	    var style = getComputedStyle(element);
	    return element.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
	  },
	  outerWidth: function() {
	    var element = this.getDOMNode();
	    var style = getComputedStyle(element);
	    return element.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
	  },
	  getPosition: function() {
	    return {
	      left: this.getDOMNode().offsetLeft,
	      top: this.getDOMNode().offsetTop
	    }
	  },
	  componentDidMount: function(){
	    this.props.onSortableItemMount(this.getPosition(), this.outerWidth(), this.outerHeight(), this.props.sortableIndex);
	  },
	  componentDidUpdate: function(){
	    this.props.onSortableItemMount(this.getPosition(), this.outerWidth(), this.outerHeight(), this.props.sortableIndex);
	  },
	  renderWithSortable: function(item){
	    var classNames = cx({
	      'SortableItem': true,
	      'is-dragging': this.props._isDragging,
	      'is-undraggable': !this.props.isDraggable,
	      'is-placeholder': this.props._isPlaceholder
	    });
	    return React.addons.cloneWithProps(
	      this.props._isPlaceholder && this.getPlaceholderContent && Object.prototype.toString.call(this.getPlaceholderContent) === '[object Function]'
	        ? this.getPlaceholderContent() : item, {
	      className: classNames,
	      style: this.props.sortableStyle,
	      key: this.props.sortableIndex,
	      onMouseDown: this.handleSortableItemMouseDown,
	      onMouseUp: this.handleSortableItemMouseUp
	    });
	  }
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	function classNames() {
		var args = arguments;
		var classes = [];

		for (var i = 0; i < args.length; i++) {
			var arg = args[i];
			if (!arg) {
				continue;
			}

			if ('string' === typeof arg || 'number' === typeof arg) {
				classes.push(arg);
			} else if ('object' === typeof arg) {
				for (var key in arg) {
					if (!arg.hasOwnProperty(key) || !arg[key]) {
						continue;
					}
					classes.push(key);
				}
			}
		}
		return classes.join(' ');
	}

	// safely export classNames in case the script is included directly on a page
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	}


/***/ }
/******/ ])