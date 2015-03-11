/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = require('classnames');
var CloneWithProps = React.addons.cloneWithProps;

module.exports = React.createClass({
  displayName: 'Sortable',
  propTypes: {
    onSort: React.PropTypes.func,
    horizontal: React.PropTypes.bool,
    sensitivity: function(props, propName, componentName) {
      if (isNaN(parseFloat(props[propName])) && !isFinite(props[propName]) || props[propName] < 0 || props[propName] > 1) {
        return new Error('sensitivity must be a number from 0 to 1.');
      }
    }.bind(this),
    /**
      If a sortable item has isDraggable set to false, prevent sorting below the item.
      This is most useful if items are pinned at the bottom until validated.
      Note that anything below an undraggable element can be moved above it.
      This option takes precedence over floatUndraggables if both are set to true.
    */
    sinkUndraggables: React.PropTypes.bool,
    /**
      See sinkUndraggables. This won't allow sorting above undraggable items.
      This defers to sinkUndraggables if both are set to true.
    */
    floatUndraggables: React.PropTypes.bool
  },
  getDefaultProps: function() {
    return {
      onSort: function() {},
      horizontal: false,
      sinkUndraggables: false,
      sensitivity: 0,
    }
  },
  getInitialState: function() {
    this.rerender(this.props.children);

    return {
      isDragging: false,
      placeHolderIndex: null,
      left: null,
      top: null
    };
  },
  componentWillReceiveProps: function (nextProps) {
    if (this.props.children !== nextProps.children) {
      this.rerender(nextProps.children);
    }
  },
  rerender: function(children) {
    this._firstDraggable = 0;
    this._lastDraggable = React.Children.count(children) - 1;
    var lastDraggableSet = false;
    this._orderArr = [];
    this._dimensionArr = children.map(function(item, idx) {
      if (this.props.sinkUndraggables && !item.props.isDraggable && idx <= this._lastDraggable && !lastDraggableSet) {
        this._lastDraggable = idx - 1;
        lastDraggableSet = true;
      } else if (this.props.floatUndraggables && !item.props.isDraggable && idx >= this._firstDraggable) {
        this._firstDraggable = idx + 1;
      }
      this._orderArr.push(idx);
      return {}
    }.bind(this));
  },
  componentDidMount: function(){
    this._dragDimensions = null;
  },
  componentWillUnmount: function() {
    this.unbindEvent();
  },
  bindEvent: function(){
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  },
  unbindEvent: function(){
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  },
  handleMouseDown: function(e, index){
    this.containerWidth = this.getDOMNode().offsetWidth;
    this.containerHeight = this.getDOMNode().offsetHeight;
    this._draggingIndex = index;
    this._prevX = e.pageX;
    this._prevY = e.pageY;
    this._initOffset = e.offset;
    this.bindEvent();
  },
  handleMouseMove: function(e){
    var newOffset = this.calculateNewOffset(e);
    var newIndex = this.calculateNewIndex(e);

    var newState = {
      isDragging: true,
      top: newOffset.top,
      left: newOffset.left
    };

    if (newIndex !== -1) {
      this._draggingIndex = newIndex;
      newState['placeHolderIndex'] = newIndex;
    }

    this.setState(newState);

    this._prevX = e.pageX;
    this._prevY = e.pageY;
  },
  handleMouseUp: function(e){
    this.unbindEvent();

    //reset temp vars
    this._draggingIndex = null;
    this._initOffset = null;
    this._prevX = null;
    this._prevY = null;
    this._dragDimensions = null;

    if (this.state.isDragging) {
        this.props.onSort(this.getSortData());
    }

    this.isMounted() && this.setState({
      isDragging: false,
      placeHolderIndex: null,
      left: null,
      top: null
    });
  },

  handleChildUpdate: function(offset, width, height, index){
    this._dimensionArr[index] = React.addons.update(this._dimensionArr[index], {
      top: { $set: offset.top },
      left: { $set: offset.left },
      width: { $set: width },
      height: { $set: height }
    });
  },

  getIndexByOffset: function(offset, direction){
    if (!offset || !this.isNumeric(offset.top) || !this.isNumeric(offset.left)) {
      return -1;
    }

    var offsetX = offset.left;
    var offsetY = offset.top;
    var prevIndex = this.state.placeHolderIndex !== null ?
      this.state.placeHolderIndex :
      this._draggingIndex;
    var newIndex;

    if (this.props.horizontal) {
      newIndex = this.getHorizontalIndexOffset(offsetX, offsetY, direction);
    } else {
      newIndex = this.getVerticalIndexOffset(offsetX, offsetY, direction);
    }

    return newIndex !== undefined ? newIndex : prevIndex;
  },
  getVerticalIndexOffset: function(offsetX, offsetY, direction) {
    var newIndex;
    var lastDimens = this._dimensionArr[this._dimensionArr.length - 1];
    var buffer = 1 - this.props.sensitivity;
    this._dimensionArr.every(function(coord, index) {
      var relativeLeft = offsetX - coord.left;
      var relativeTop = offsetY - coord.top;
      if (offsetY < 0) {
        newIndex = 0;
        return false;
      } else if (offsetY > this.containerHeight || offsetY > (lastDimens.top + lastDimens.height)) {
        newIndex = this._dimensionArr.length - 1;
        return false;
      } else if (relativeTop < coord.height && relativeLeft < coord.width) {
        if (relativeTop < ((coord.height / 2) - ((coord.height / 4) * buffer)) && direction === 'up') {
          newIndex = index;
        } else if (relativeTop > ((coord.height / 2) + ((coord.height / 4) * buffer)) && direction === 'down') {
          newIndex = Math.min(index + 1, this._dimensionArr.length - 1);
        }
        return false;
      }
      return true;
    }.bind(this));

    return newIndex;
  },
  getHorizontalIndexOffset: function(offsetX, offsetY, direction) {
    var newIndex;
    var lastDimens = this._dimensionArr[this._dimensionArr.length - 1];
    var buffer = 1 - this.props.sensitivity;
    this._dimensionArr.every(function(coord, index) {
      var relativeLeft = offsetX - coord.left;
      var relativeTop = offsetY - coord.top;
      if (offsetX < 0) {
        newIndex = 0;
        return false;
      } else if (offsetX > this.containerWidth || offsetX > (lastDimens.left + lastDimens.width)) {
        newIndex = this._dimensionArr.length - 1;
        return false;
      } else if (relativeLeft < coord.width) {
        if (relativeLeft < ((coord.width / 2) - ((coord.width / 4) * buffer)) && direction === 'left') {
          newIndex = index;
        } else if (relativeLeft > ((coord.width / 2) + ((coord.width / 4) * buffer)) && direction === 'right') {
          newIndex = Math.min(index + 1, this._dimensionArr.length - 1);
        }
        return false;
      }
      return true;
    }.bind(this));
    return newIndex;
  },
  isNumeric: function(val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
  },

  swapArrayItemPosition: function(arr, from, to){
    if (!arr || !this.isNumeric(from) || !this.isNumeric(to)) {
      return arr;
    }

    var fromEl = arr.splice(from, 1)[0];
    arr.splice(to, 0, fromEl);
    return arr;
  },
  calculateNewOffset: function(e){
    var deltaX = this._prevX - e.pageX;
    var deltaY = this._prevY - e.pageY;

    var prevLeft = this.state.left !== null ? this.state.left : this._initOffset.left;
    var prevTop = this.state.top !== null ? this.state.top : this._initOffset.top;
    var newLeft = prevLeft - deltaX;
    var newTop = prevTop - deltaY;

    return {
      left: newLeft,
      top: newTop
    };
  },
  getPosition: function() {
    return {
      left: this.getDOMNode().offsetLeft,
      top: this.getDOMNode().offsetTop
    }
  },
  closest: function(element, f) {
    return element && (f(element) ? element : this.closest(element.parentNode, f));
  },
  calculateNewIndex: function(e){
    var placeHolderIndex = this.state.placeHolderIndex !== null ?
      this.state.placeHolderIndex :
      this._draggingIndex;
    var dragElement = this.closest(e.target, function(element) {
      if (typeof element === 'undefined' || typeof element.classList === 'undefined') return false;
      return element.classList.contains('SortableItem');
    });

    var offset;
    if (dragElement) {
      offset = { left: dragElement.offsetLeft, top: dragElement.offsetTop };
    }

    var direction = '';

    if (this.props.horizontal) {
      direction = this._prevX > e.pageX ? 'left' : 'right';
    } else {
      direction = this._prevY > e.pageY ? 'up' : 'down';
    }

    var newIndex = this.getIndexByOffset(offset, direction);
    if (newIndex !== -1 && newIndex < this._firstDraggable) {
      newIndex = this._firstDraggable;
      if (this._draggingIndex < this._firstDraggable) {
        newIndex = this._firstDraggable - 1;
        this._firstDraggable -= 1;
      }
    } else if (newIndex !== -1 && newIndex > this._lastDraggable) {
      newIndex = this._lastDraggable;
      if (this._draggingIndex > this._lastDraggable) {
        newIndex = this._lastDraggable + 1;
        this._lastDraggable += 1;
      }
    }

    if (newIndex !== -1 && newIndex !== placeHolderIndex) {
      this._dimensionArr = this.swapArrayItemPosition(this._dimensionArr, placeHolderIndex, newIndex);
      this._orderArr = this.swapArrayItemPosition(this._orderArr, placeHolderIndex, newIndex);
    }

    return newIndex;
  },
  getSortData: function() {
    return this._orderArr.map(function(itemIndex){
      return this.props.children[itemIndex].props.sortData;
    }.bind(this));
  },
  renderItems: function() {
    var draggingItem = [];
    var childrenCount = React.Children.count(this.props.children);

    var items = this._orderArr.map(function(itemIndex, index) {
      var item = this.props.children[itemIndex];
      if (index === this._draggingIndex && item.props.isDraggable) {
        if (this._dragDimensions === null) {
          this._dragDimensions = {
            width: this._dimensionArr[this._draggingIndex].width,
            height: this._dimensionArr[this._draggingIndex].height
          };
        }
        draggingItem.push(this.renderDraggingItem(item));
      }
      return CloneWithProps(item, {
        key: index,
        _isPlaceholder: index === this.state.placeHolderIndex,
        sortableIndex: index,
        onSortableItemMouseDown: function(e) {
          this.handleMouseDown(e, index);
        }.bind(this),
        onSortableItemMount: this.handleChildUpdate
      });
    }.bind(this));

    return items.concat(draggingItem);
  },
  renderDraggingItem: function(item) {
    var style = {
      top: this.state.top,
      left: this.state.left,
      width: this._dragDimensions.width,
      height: this._dragDimensions.height
    };
    return CloneWithProps(item, {
      key: this._dimensionArr.length,
      sortableStyle: style,
      _isDragging: true
    });
  },
  render: function(){
    return (
      <div className="Sortable" ref="movable">
        {this.renderItems()}
      </div>
    );
  }
});
