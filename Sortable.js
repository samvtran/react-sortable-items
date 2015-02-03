/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;
var CloneWithProps = React.addons.cloneWithProps;
var Immutable = require('immutable');

module.exports = React.createClass({
  propTypes: {
    onSort: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      onSort: function() {}
    }
  },
  getInitialState: function(){
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
    this._lastDraggable = React.Children.count(children) - 1;
    this._orderArr = [];
    this._dimensionArr = children.map(function(item, idx) {
      if (!item.props.isDraggable && idx <= this._lastDraggable) {
        this._lastDraggable = idx - 1;
      }
      this._orderArr.push(idx);
      return {}
    }.bind(this));
  },
  componentDidMount: function(){
    this.containerWidth = this.getDOMNode().offsetWidth;
    this.containerHeight = this.getDOMNode().offsetHeight;
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
    this._draggingIndex = index;
    this._prevX = e.pageX;
    this._prevY = e.pageY;
    this._initOffset = e.offset;
    this.bindEvent();
  },
  handleMouseMove: function(e){
    var newOffset = this.calculateNewOffset(e);
    var newIndex = this.calculateNewIndex(e);
    this._draggingIndex = newIndex;

    this.setState({
      isDragging: true,
      top: newOffset.top,
      left: newOffset.left,
      placeHolderIndex: newIndex
    });

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

    if (this.state.isDragging) {
      this._dimensionArr[this.state.placeHolderIndex].isPlaceHolder = false;

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
      return 0;
    }

    var _dimensionArr = this._dimensionArr;
    var offsetX = offset.left;
    var offsetY = offset.top;
    var prevIndex = this.state.placeHolderIndex !== null ?
      this.state.placeHolderIndex :
      this._draggingIndex;
    var newIndex;

    _dimensionArr.every(function(coord, index) {
      var relativeLeft = offsetX - coord.left;
      var relativeTop = offsetY - coord.top;

      if (offsetY < 0) {
        newIndex = 0;
        return false;
      } else if (offsetY > this.containerHeight) {
        newIndex = _dimensionArr.length - 1;
        return false;
      } else if (relativeTop < coord.height && relativeLeft < coord.width) {
        if (relativeTop < coord.height / 2 && direction === 'up') {
          newIndex = index;
        } else if (relativeTop > coord.height / 2 && direction === 'down') {
          newIndex = Math.min(index + 1, _dimensionArr.length - 1);
        }
        return false
      }
      return true;
    }.bind(this));

    return newIndex !== undefined ? newIndex : prevIndex;
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

    var direction = this._prevY > e.pageY ? 'up' : 'down';

    var newIndex = this.getIndexByOffset(offset, direction);

    if (newIndex > this._lastDraggable) {
      newIndex = this._lastDraggable;
    }

    if (newIndex !== placeHolderIndex) {
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
        draggingItem.push(this.renderDraggingItem(item));
      }

      var isPlaceHolder = this._dimensionArr[index].isPlaceHolder;
      var itemClassName = cx({
        'SortableItem': true,
        'SortableItem--placeholder': isPlaceHolder,
        'is-active': this.state.isDragging && isPlaceHolder
      });

      return CloneWithProps(item, {
        key: index,
        sortableClassName: itemClassName,
        sortableIndex: index,
        onSortableItemMouseDown: isPlaceHolder ? undefined : function(e) {
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
      width: this._dimensionArr[this._draggingIndex].width,
      height: this._dimensionArr[this._draggingIndex].height
    };
    return CloneWithProps(item, {
      sortableClassName: 'SortableItem is-dragging',
      key: this._dimensionArr.length,
      sortableStyle: style,
      isDragging: true
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