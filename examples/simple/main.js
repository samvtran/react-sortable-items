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
      style: {}
    }
  },
  handleRemove: function(e) {
    e.preventDefault();
    this.props.handleRemoval(this.props.index);
  },
  getPlaceholderContent: function() {
    return <div><h4>This is a placeholder!</h4></div>;
  },
  render: function() {
    return this.renderWithSortable(
      <div style={this.props.style}>
        <div className="Contents">
          <h4>{this.props.title}</h4>
          <a href="#" onClick={this.handleRemove} className="is-isolated">Delete (isolated)</a>
        </div>
      </div>
    );
  }
});

var SimpleSortable = React.createClass({
  getDefaultProps: function() {
    return {
      horizontal: false
    }
  },
  getInitialState: function() {
    return {
      items: [
        "Item 1",
        "Item 2",
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
      var style = {};
      if (this.props.horizontal) {
        style['display'] = 'inline-block';
      }
      return <Item key={idx}
                   index={idx}
                   isDraggable={true}
                   title={item}
                   style={style}
                   sortData={idx}
                   handleRemoval={this.removeRow} />;
    }.bind(this));
    /*
      Notice how we're defining a sensitivity of 0 because our placeholder is a little smaller than our items, so we want
      to make sure there's enough wiggle room for the placeholder to swap places with a bigger item without causing another
      re-sort in the opposite direction.
    */
    return (
      <div>
        <Sortable onSort={this.handleSort} horizontal={this.props.horizontal} sensitivity={0}>
          {items}
        </Sortable>
      </div>
    );
  }
});

React.render(<SimpleSortable />, document.getElementById('Example'));
React.render(<SimpleSortable horizontal={true} />, document.getElementById('HorizontalExample'));
