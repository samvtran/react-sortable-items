'use strict';

var Sortable = require('Sortable');
var sortableMixin = require('SortableItemMixin');
var React = require('react');
var style = require('style.css');

var Item = React.createClass({
  mixins: [sortableMixin],
  propTypes: {
    title: React.PropTypes.string.isRequired,
    handleRemoval: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired
  },
  handleRemove: function(e) {
    e.preventDefault();
    this.props.handleRemoval(this.props.index);
  },
  render: function() {
    return this.renderWithSortable(
      <div style={{ border: '1px solid #ddd'}}>
        <h4>{this.props.title}</h4>
        <a href="#" onClick={this.handleRemove} className="is-isolated">Delete (isolated)</a>
      </div>
    );
  }
});

var SimpleSortable = React.createClass({
  getInitialState: function() {
    return {
      items: [
        "Item 1",
        "Item 2",
        "Item 3"
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
      return <Item title={item} key={idx} index={idx} sortData={idx} isDraggable={true} handleRemoval={this.removeRow} />;
    }.bind(this));
      return (
        <div>
          <Sortable onSort={this.handleSort}>
            {items}
          </Sortable>
        </div>
      );
  }
});

React.render(<SimpleSortable />, document.getElementById('Example'));
