"use strict";

var WorkTeacherContent = React.createClass({
	displayName: "WorkTeacherContent",

	getInitialState: function getInitialState() {
		return { imgUrls: this.props.imgUrls };
	},
	render: function render() {
		var works = this.state.imgUrls.map(function (one, i) {
			return React.createElement("imgx", { urlx: one.url });
		});
		return React.createElement(
			"div",
			null,
			works
		);
	}
});