# react-sortable-items
Sort stuff with React.js

Based on [jasonslyvia/react-anything-sortable](https://github.com/jasonslyvia/react-anything-sortable) but without jQuery.

# Usage
To run the examples, run `gulp` in the respective example directories and open index.html in your favorite browser.

```javascript
var React = require('react');
var Sortable = require('react-sortable-items');
var SortableMixin = require('react-sortable-items/SortableItemMixin');

var Item = React.createClass({
	propTypes: { title: React.PropTypes.string.isRequired }
	mixins: [SortableMixin],
	render: function() {
		return this.renderWithSortable(<div>{this.title}</div>)
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
			}.bind(this));
		});
	},
	render: function() {
		var items = this.state.items.map(function (item, idx) {
			return <Item title={item} key={idx} sortData={idx} isDraggable={true} />;
		}.bind(this);

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

The `isDraggable` property on sortable items lets you selectively disable sorting if, for example, there's invalid data.

Putting the `is-isolated` class on any element in a sortable item will keep it from ever triggering a sort.

Use `sortData` on items to pass data through to the `onSort` callback.

# TODO
- [ ] Horizontal sorting
- [ ] Optional classnames if you're not using [SUIT CSS](http://suitcss.github.io/)
- [x] npm
- [x] CSS
- [x] Examples
- [ ] Tests
