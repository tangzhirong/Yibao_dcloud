"use strict";

var Cate = React.createClass({
	displayName: "Cate",

	getInitialState: function getInitialState() {
		return { user: this.props.user };
	},
	render: function render() {
		var invitation = this.state.user.role == "student" ? "老师点评" : "收到邀请";
		return React.createElement(
			"div",
			{ "class": "container" },
			React.createElement(
				"div",
				{ "class": "main-content" },
				React.createElement(
					"div",
					{ "class": "line-column invitation" },
					React.createElement("div", { "class": "icon", id: "icon" }),
					React.createElement(
						"span",
						null,
						invitation
					),
					React.createElement("i", { "class": "fa fa-angle-right" }),
					React.createElement("div", { "class": "line" })
				),
				React.createElement(
					"div",
					{ "class": "line-column publish" },
					React.createElement("div", { "class": "icon", id: "icon" }),
					React.createElement(
						"span",
						null,
						"我的发布"
					),
					React.createElement("i", { "class": "fa fa-angle-right" }),
					React.createElement("div", { "class": "line" })
				),
				React.createElement(
					"div",
					{ "class": "line-column comment" },
					React.createElement("div", { "class": "icon", id: "icon" }),
					React.createElement(
						"span",
						null,
						"收到评论"
					),
					React.createElement("i", { "class": "fa fa-angle-right" }),
					React.createElement("div", { "class": "line" })
				),
				React.createElement(
					"div",
					{ "class": "line-column homepage" },
					React.createElement("div", { "class": "icon", id: "icon" }),
					React.createElement(
						"span",
						null,
						"我的主页"
					),
					React.createElement("i", { "class": "fa fa-angle-right" }),
					React.createElement("div", { "class": "line" })
				),
				React.createElement(
					"div",
					{ "class": "line-column message" },
					React.createElement("div", { "class": "icon", id: "icon" }),
					React.createElement(
						"span",
						null,
						"艺宝通知"
					),
					React.createElement("i", { "class": "fa fa-angle-right" })
				)
			),
			React.createElement(
				"div",
				{ "class": "mine-content" },
				React.createElement(
					"div",
					{ "class": "line-column favour" },
					React.createElement("div", { "class": "icon", id: "icon" }),
					React.createElement(
						"span",
						null,
						"我的收藏"
					),
					React.createElement("i", { "class": "fa fa-angle-right" }),
					React.createElement("div", { "class": "line" })
				),
				React.createElement(
					"div",
					{ "class": "line-column attention" },
					React.createElement("div", { "class": "icon", id: "icon" }),
					React.createElement(
						"span",
						null,
						"我的关注"
					),
					React.createElement("i", { "class": "fa fa-angle-right" }),
					React.createElement("div", { "class": "line" })
				),
				React.createElement(
					"div",
					{ "class": "line-column fans" },
					React.createElement("div", { "class": "icon", id: "icon" }),
					React.createElement(
						"span",
						null,
						"我的粉丝"
					),
					React.createElement("i", { "class": "fa fa-angle-right" })
				)
			)
		);
	}
});