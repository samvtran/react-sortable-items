'use strict';

var Reflux = require('reflux');
var ItemActions = require('./ItemActions');
var ItemRecord = require('./ItemRecord');

module.exports = Reflux.createStore({
  listenables: [ItemActions],
  onRemoveItem: function(idx) {
    this.state.splice(idx, 1);
    this.trigger(this.state);
  },
  onSortItems: function(resort) {
    this.state = resort.map(function(idx) {
      return this.state[idx];
    }.bind(this));
    this.trigger(this.state);
  },
  onEditItem: function(mod, idx) {
    this.state[idx] = this.state[idx].set('link', mod);
    this.trigger(this.state);
  },
  getInitialState: function() {
    this.state = [
      new ItemRecord({ title: 'Item 1' }),
      new ItemRecord({ title: 'Item 2' }),
      new ItemRecord({ title: 'Item 3' })
    ];
    return this.state;
  }
});
