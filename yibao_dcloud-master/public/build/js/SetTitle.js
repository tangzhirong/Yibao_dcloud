"use strict";

var Title = React.createClass({
	displayName: "Title",

	getInitialState: function getInitialState() {
		return {
			title: this.props.title,
			right: this.props.right,
			backPage: this.props.backPage,
			nextPage: this.props.nextPage
		};
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "title" },
			React.createElement(
				"div",
				{ className: "title_back", onClick: backPage },
				React.createElement("i", { className: "fa fa-angle-left" })
			),
			React.createElement(
				"div",
				{ className: "title_name" },
				this.state.title
			),
			React.createElement(
				"div",
				{ className: "next", onClick: nextPage },
				this.state.right
			)
		);
	}
});