"use strict";

var StudioCatalogue = React.createClass({
	displayName: "StudioCatalogue",

	getInitialState: function getInitialState() {
		return {};
	},
	HandleClick: function HandleClick() {
		//画室简介
		console.log("画室简介");
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "catalogue", onClick: this.HandleClick },
			React.createElement(
				"div",
				{ className: "left horizontal" },
				React.createElement("div", { className: "image studio-brief" })
			)
		);
	}
});
var WorkStudioContent = React.createClass({
	displayName: "WorkStudioContent",

	getInitialState: function getInitialState() {
		return { imgUrls: this.props.works };
	},
	render: function render() {
		var works = this.state.imgUrls.map(function (one, i) {
			return React.createElement("img", { src: one.url });
		});
		return React.createElement(
			"div",
			{ className: "work-display" },
			React.createElement(StudioTitle, null),
			React.createElement(
				"div",
				null,
				works
			)
		);
	}
});

var StudioTitle = React.createClass({
	displayName: "StudioTitle",

	getInitialState: function getInitialState() {
		return {};
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "title" },
			React.createElement("div", { className: "photo icon" }),
			React.createElement(
				"span",
				{ className: "work-show left" },
				"作品展示"
			)
		);
	}
});

var DisplayTeachers = React.createClass({
	displayName: "DisplayTeachers",

	getInitialState: function getInitialState() {
		return { teachers: this.props.teachers };
	},
	HandleClick: function HandleClick() {
		console.log("老师简介");
	},
	render: function render() {
		var teachersinfo = this.state.teachers.map(function (one, i) {
			return React.createElement(
				"div",
				{ className: "teacher-info", onClick: HandleClick },
				React.createElement("img", { src: one.url, width: "100%" }),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ className: "name" },
					one.nickname
				)
			);
		});
		return React.createElement(
			"div",
			{ className: "work-display" },
			React.createElement(
				"div",
				{ className: "title" },
				React.createElement("div", { className: "photo icon" }),
				React.createElement(
					"span",
					{ className: "work-show left" },
					"师资队伍"
				)
			),
			React.createElement(
				"div",
				{ className: "work-content-teacher" },
				teachersinfo
			)
		);
	}
});

var HomepageStudio = React.createClass({
	displayName: "HomepageStudio",

	getInitialState: function getInitialState() {
		return { user: this.props.user,
			teachers: [],
			works: [] };
	},
	componentDidMount: function componentDidMount() {
		console.log("getWorks");
		mui.ajax({
			url: "",
			type: 'get',
			dataType: 'json',
			success: (function (data) {
				this.setState({ userlist: data.teacher_works });
			}).bind(this)
		});
		var self = this;
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(HomeCard, { user: this.props.user }),
			React.createElement(
				"div",
				{ className: "display" },
				React.createElement(StudioCatalogue, null),
				React.createElement(
					"div",
					{ className: "work-display" },
					React.createElement(StudioTitle, null),
					React.createElement(WorkStudioContent, { works: this.state.works })
				)
			)
		);
	}
});