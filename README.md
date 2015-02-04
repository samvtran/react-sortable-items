# react-sortable-items
Sort stuff with React.js

Based on [jasonslyvia/react-anything-sortable](https://github.com/jasonslyvia/react-anything-sortable) but without jQuery.

# Usage
You can install react-sortable-items with `npm i react-sortable-items` and include it using webpack, Browserify, etc. If you're having trouble, Gulpfiles using webpack are included in the examples directory.

To run the examples, run `gulp` in the respective example directories and open index.html in your favorite browser.

```javascript
var React = require('react');
var Sortable = require('react-sortable-items');
var SortableMixin = require('react-sortable-items/SortableItemMixin');
var style = require('react-sortable-items/style.css'); // If you're using webpack or Browserify

var Item = React.createClass({
	propTypes: { title: React.PropTypes.string.isRequired },
	mixins: [SortableMixin],
	render: function() {
		return this.renderWithSortable(<div>{this.props.title}</div>)
	}
});

var List = React.createClass({
	getInitialState: function() {
		return {
			items: ["Item 1", "Item 2", "Item 3"]
		}
	},
	handleSort: function(reorder) {
		this.setState({
			items: reorder.map(function (idx) {
				return this.state.items[idx];
			}.bind(this))
		});
	},
	render: function() {
		var items = this.state.items.map(function (item, idx) {
			return <Item title={item} key={idx} sortData={idx} isDraggable={true} />;
		});

		return (
			<div>
				<h1>Sortable List</h1>
				<Sortable onSort={this.handleSort}>
					{items}
				</Sortable>
			</div>
		);
	}
});

React.render(<List />, document.getElementById('boourns'));

```

# Configuration

On `<Sortable />`:

Property | Description
-----|-----
onSort | Callback that returns sorted array of data from `sortData`.
horizontal | Default false. Whether to sort horizontally.
floatUndraggables | Default false. Whether to only allow sorting below items with isDraggable set to false, sending undraggable items to the top of the list over time.
sinkUndraggables | Default false. Whether to only allow sorting above items with isDraggable set to false, sending undraggable items to the bottom of the list over time.


On components with `SortableItemMixin`:

Property | Description
-----|-----------
isDraggable | Default true. Whether the item can be dragged.
sortData | Any data added here will be sent to the `onSort` callback on Sortable in the correct resorted order.
style | Send any inline styles to the final component

The `is-isolated` class can also be set on any elements inside a sortable item to prevent them from accidentally triggering a sort.

# TODO
- [x] Horizontal sorting
- [ ] Grid sorting
- [ ] Optional classnames if you're not using [SUIT CSS](http://suitcss.github.io/)
- [x] npm
- [x] CSS
- [x] Examples
- [ ] Tests
