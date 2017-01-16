"use strict";

var HomepageStudent = React.createClass({
	displayName: "HomepageStudent",

	getInitialState: function getInitialState() {
		return { user: this.props.user,
			editable: user._id == this.props.user._id };
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(HomeCard, { user: this.state.user, editable: this.state.editable }),
			React.createElement(
				"div",
				null,
				React.createElement(Publish, { user_id: this.state.user._id, feedClickHandler: this.props.feedClickHandler })
			)
		);
	}
});