'use strict';

var Sortable = require('react-sortable-items');
var sortableMixin = require('react-sortable-items/SortableItemMixin');
var React = require('react');
var style = require('react-sortable-items/style.css');
var ItemStore = require('./ItemStore');
var Reflux = require('reflux');
var ItemActions = require('./ItemActions');
var ItemRecord = require('./ItemRecord');

var Item = React.createClass({
  mixins: [sortableMixin],
  propTypes: {
    record: React.PropTypes.instanceOf(ItemRecord).isRequired,
    handleRemoval: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired
  },
  handleRemove: function(e) {
    e.preventDefault();
    this.props.handleRemoval(this.props.index);
  },
  handleEdit: function(e) {
    ItemActions.editItem(e.target.value, this.props.index);
  },
  render: function() {
    return this.renderWithSortable(
      <div style={{ border: '1px solid #ddd'}}>
        <h4>{this.props.record.title}</h4>
        <input type="text" value={this.props.record.link} onChange={this.handleEdit} />
        <a href="#" onClick={this.handleRemove} className="is-isolated">Delete (isolated)</a>
      </div>
    );
  }
});

var SimpleSortable = React.createClass({
  mixins: [Reflux.connect(ItemStore, 'items')],
  removeRow: function(idx) {
    ItemActions.removeItem(idx);
  },
  handleSort: function(reorder) {
    ItemActions.sortItems(reorder);
  },
  render: function() {
    var items = this.state.items.map(function(item, idx) {
      return <Item record={item} key={idx} index={idx} sortData={idx} isDraggable={true} handleRemoval={this.removeRow} />;
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
