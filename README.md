# react-sortable-items
Sort stuff with React.js

Based on [jasonslyvia/react-anything-sortable](https://github.com/jasonslyvia/react-anything-sortable) but without jQuery.

# Usage
react-sortable-items requires React with addons.

You can install react-sortable-items with `npm i react-sortable-items` and include it using webpack, Browserify, etc. If you're having trouble, Gulpfiles using webpack are included in the examples directory.

If you just want to include the components directly in your pages, files that can be used as `<script>` srcs are included in the `dist` directory.

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
sensitivity | Default 1. A value 0-1 (0 for least sensitive, 1 for most) that will be used to determine the sensitivity of sorting. The bigger the number, the further from the center of an element you can drag before the list re-sorts. This is especially useful when you replace the placeholder contents with something at a smaller width or height than the sortable items in a horizontal or vertically sorted list respectively.


On components with `SortableItemMixin`:

Property | Description
-----|-----------
isDraggable | Default true. Whether the item can be dragged.
sortData | Any data added here will be sent to the `onSort` callback on Sortable in the correct re-sorted order.
style | Send any inline styles to the final component

Additionally, sortable items can define a `getPlaceholderContent()` function (example in the "simple" example directory) that will replace the placeholder for the item being dragged with whatever component you return.

The `is-isolated` class can also be set on any elements inside a sortable item to prevent them from accidentally triggering a sort.

# TODO
- [x] Horizontal sorting
- [ ] Grid sorting
- [ ] Optional classnames if you're not using [SUIT CSS](http://suitcss.github.io/)
- [x] npm
- [x] CSS
- [x] Examples
- [ ] Tests
