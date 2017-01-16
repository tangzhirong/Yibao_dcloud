"use strict";

var SuggestTab = React.createClass({
	displayName: "SuggestTab",

	getInitialState: function getInitialState() {
		return { select: 0 };
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "tab" },
			React.createElement(
				"div",
				{ id: "tab-all", className: this.state.select == 0 ? 'focused' : ' unfocused', onClick: getStudentList(0) },
				"推荐画霸"
			),
			React.createElement(
				"div",
				{ id: "tab-comment", className: this.state.select == 1 ? 'focused' : ' unfocused', onClick: getStudentList(1) },
				"人气名师"
			),
			React.createElement(
				"div",
				{ id: "tab-state", className: this.state.select == 2 ? 'focused' : ' unfocused', onClick: getStudentList(2) },
				"热门画室"
			)
		);
	}
});

var SuggestColumn = React.createClass({
	displayName: "SuggestColumn",

	getInitialState: function getInitialState() {
		return {
			follow: false
		};
	},
	HandleClick: function HandleClick() {
		var that = this;
		mui.ajax({
			url: "http://pang.tunnel.yibaoedu.com:8080/setFollow",
			data: {
				followed_id: this.props.user._id,
				type: "user"
			},
			type: 'post',
			success: (function (data) {
				console.log(JSON.stringify(data));
				if (data.msg == "ok") that.setState({ follow: true });
			}).bind(this)
		});
	},
	render: function render() {
		var unit = this.props.user.role == "TEACHER" ? React.createElement(
			"span",
			{ className: "unit" },
			"（画室老师）"
		) : React.createElement(
			"span",
			null,
			"xinsh"
		);
		var fol = this.state.follow ? "已关注" : "+关注";
		return React.createElement(
			"div",
			{ className: "master-comments" },
			React.createElement(
				"div",
				{ className: "feed" },
				React.createElement(
					"div",
					{ className: "master-info" },
					React.createElement(
						"div",
						{ className: "profile" },
						React.createElement("img", { src: "../img/head.jpg", height: "100%", width: "100%" }),
						React.createElement("div", { className: "v" })
					),
					React.createElement(
						"div",
						{ className: "info" },
						React.createElement(
							"span",
							{ className: "name" },
							this.props.user.nickname
						),
						unit,
						React.createElement("br", null),
						React.createElement(
							"span",
							{ className: "info-infor" },
							this.props.user.address,
							" ",
							this.props.user.city,
							" ",
							this.props.user.studio,
							" "
						),
						React.createElement("br", null),
						React.createElement(
							"span",
							{ className: "info-infornext" },
							React.createElement(
								"small",
								null,
								"点评 2000"
							),
							"   ",
							React.createElement(
								"small",
								null,
								"粉丝 2000"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "addfollow", onClick: this.HandleClick },
						fol
					)
				),
				React.createElement(
					"div",
					{ className: "picture" },
					React.createElement("img", { src: this.props.user.picUrl }),
					React.createElement("img", { src: this.props.user.picUrl }),
					React.createElement("img", { src: this.props.user.picUrl }),
					React.createElement("img", { src: this.props.user.picUrl }),
					React.createElement("img", { src: this.props.user.picUrl })
				)
			)
		);
	}
});

var SuggestColumnList = React.createClass({
	displayName: "SuggestColumnList",

	render: function render() {
		var userlist = this.props.userlist.map(function (one, i) {
			return React.createElement(SuggestColumn, { user: one });
		});
		return React.createElement(
			"div",
			null,
			userlist
		);
	}
});

var SuggestContent = React.createClass({
	displayName: "SuggestContent",

	getInitialState: function getInitialState() {
		return { userlist: [],
			user: this.props.user
		};
	},
	componentDidMount: function componentDidMount() {
		var that = this;
		console.log(that);
		mui.ajax({
			url: "http://pang.tunnel.yibaoedu.com:8080/hotTeacher",
			type: 'get',
			success: (function (data) {
				that.setState({ userlist: data.teacher_works });
				console.log(JSON.stringify(data.teacher_works));
			}).bind(this)
		});
		var self = this;
	},
	render: function render() {
		return React.createElement(SuggestColumnList, { userlist: this.state.userlist });
	}
});