'use strict';

var React = require('react/addons');
var ReactDOM = require('react-dom');
var cx = require('classnames');

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
    var element = ReactDOM.findDOMNode(this);
    var style = getComputedStyle(element);
    return element.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
  },
  outerWidth: function() {
    var element = ReactDOM.findDOMNode(this);
    var style = getComputedStyle(element);
    return element.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
  },
  getPosition: function() {
    return {
      left: ReactDOM.findDOMNode(this).offsetLeft,
      top: ReactDOM.findDOMNode(this).offsetTop
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
    return React.cloneElement(
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
