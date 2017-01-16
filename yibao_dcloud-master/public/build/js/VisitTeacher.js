"use strict";

var WorkTeacherContent = React.createClass({
	displayName: "WorkTeacherContent",

	getInitialState: function getInitialState() {
		return { imgUrls: this.props.works };
	},
	render: function render() {
		var works = this.state.imgUrls.map(function (one, i) {
			return React.createElement("img", { src: one.url, key: i, width: "100%" });
		});
		return React.createElement(
			"div",
			{ className: "work-display" },
			React.createElement(TeacherTitle, null),
			React.createElement(
				"div",
				{ className: "work-content" },
				works
			)
		);
	}
});

var TeacherTitle = React.createClass({
	displayName: "TeacherTitle",

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

var TeacherDisplay = React.createClass({
	displayName: "TeacherDisplay",

	getInitialState: function getInitialState() {
		return { user: this.props.user };
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "work-display" },
			React.createElement(
				"div",
				{ className: "title" },
				React.createElement("div", { className: "list icon" }),
				React.createElement(
					"span",
					{ className: "left" },
					"基本信息"
				)
			),
			React.createElement(
				"div",
				{ className: "work-content info" },
				React.createElement(
					"div",
					{ className: "column" },
					React.createElement(
						"div",
						{ className: "column-title" },
						"毕业院校："
					),
					React.createElement(
						"div",
						{ className: "column-content" },
						this.state.user.graduate
					)
				),
				React.createElement(
					"div",
					{ className: "column" },
					React.createElement(
						"div",
						{ className: "column-title" },
						"教学经验："
					),
					React.createElement(
						"div",
						{ className: "column-content" },
						this.state.user.experience
					)
				),
				React.createElement(
					"div",
					{ className: "column" },
					React.createElement(
						"div",
						{ className: "column-title" },
						"教学对象："
					),
					React.createElement(
						"div",
						{ className: "column-content" },
						this.state.user.objects
					)
				),
				React.createElement(
					"div",
					{ className: "column" },
					React.createElement(
						"div",
						{ className: "column-title" },
						"常驻地址："
					),
					React.createElement(
						"div",
						{ className: "column-content" },
						this.state.user.address
					)
				)
			)
		);
	}
});
var Alltag = React.createClass({
	displayName: "Alltag",

	getInitialState: function getInitialState() {
		return {
			alltag: this.props.alltag
		};
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "tag" },
				this.state.alltag.name
			),
			React.createElement(
				"span",
				{ className: "fa-stack fa-lg" },
				React.createElement("i", { className: "fa fa-circle fa-stack-2x" }),
				React.createElement("i", { className: "fa fa-check fa-stack-1x fa-inverse" })
			)
		);
	}
});
var WorkSpeciality = React.createClass({
	displayName: "WorkSpeciality",

	getInitialState: function getInitialState() {
		return { tags: this.props.user.tags };
	},
	render: function render() {
		var allTags = this.state.tags.map(function (one, i) {
			return React.createElement(Alltag, { alltag: one });
		});
		return React.createElement(
			"div",
			{ className: "work-display" },
			React.createElement(
				"div",
				{ className: "title" },
				React.createElement("div", { className: "speciality icon" }),
				React.createElement(
					"span",
					{ className: "teacher-speciality left" },
					"教学特长"
				)
			),
			allTags
		);
	}
});
var HomepageTeacher = React.createClass({
	displayName: "HomepageTeacher",

	getInitialState: function getInitialState() {
		return { user: this.props.user,
			works: this.props.works };
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(HomeCard, { user: this.props.user }),
			React.createElement(WorkTeacherContent, { works: this.props.works }),
			React.createElement(TeacherDisplay, { user: this.props.user }),
			React.createElement(WorkSpeciality, { user: this.props.user })
		);
	}
});