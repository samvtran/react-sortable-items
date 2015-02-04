'use strict';

var Sortable = require('react-sortable-items');
var sortableMixin = require('react-sortable-items/SortableItemMixin');
var React = require('react');
var style = require('react-sortable-items/style.css');

var Item = React.createClass({
  mixins: [sortableMixin],
  propTypes: {
    title: React.PropTypes.string.isRequired,
    handleRemoval: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired
  },
  getDefaultProps: function() {
    return {
      style: { border: '1px solid #ddd' }
    }
  },
  handleRemove: function(e) {
    e.preventDefault();
    this.props.handleRemoval(this.props.index);
  },
  render: function() {
    return this.renderWithSortable(
      <div style={this.props.style}>
        <h4>{this.props.title}</h4>
        <a href="#" onClick={this.handleRemove} className="is-isolated">Delete (isolated)</a>
      </div>
    );
  }
});

var SimpleSortable = React.createClass({
  getDefaultProps: function() {
    return {
      horizontal: false,
      sinkUndraggables: false,
      floatUndraggables: false
    }
  },
  getInitialState: function() {
    return {
      items: [
        "Item 1",
        "Item 2 (unsortable, will " + (this.props.sinkUndraggables ? 'sink to the bottom)' : 'float to the top)'),
        "Item 3",
        "Item 4",
        "Item 5"
      ]
    }
  },
  removeRow: function(idx) {
    var newItems = this.state.items;
    newItems.splice(idx, 1);
    this.setState({
      items: newItems
    })
  },
  handleSort: function(reorder) {
    this.setState({
      items: reorder.map(function (idx) {
        return this.state.items[idx];
      }.bind(this))
    })
  },
  render: function() {
    var items = this.state.items.map(function(item, idx) {
      var style = { border: '1px solid #ddd' };
      if (this.props.horizontal) {
        style['display'] = 'inline-block';
      }
      return <Item key={idx}
                   index={idx}
                   isDraggable={item.indexOf("Item 2") === -1}
                   title={item}
                   style={style}
                   sortData={idx}
                   handleRemoval={this.removeRow} />;
    }.bind(this));
    return (
      <div>
        <Sortable onSort={this.handleSort} horizontal={this.props.horizontal}
          floatUndraggables={this.props.floatUndraggables} sinkUndraggables={this.props.sinkUndraggables}>
          {items}
        </Sortable>
      </div>
    );
  }
});

React.render(<SimpleSortable sinkUndraggables={true} />, document.getElementById('Example'));
React.render(<SimpleSortable floatUndraggables={true} />, document.getElementById('HorizontalExample'));
