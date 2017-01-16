"use strict";

var FollowList = React.createClass({
	displayName: "FollowList",

	getInitialState: function getInitialState() {
		return { followlist: this.props.followlist };
	},
	turnToFollow: function turnToFollow() {
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
				if (data.msg == "ok") {
					var newfollowlist = that.state.followlist;
					newfollowlist.isFollow = true;
					that.setState({ followlist: newfollowlist });
				}
			}).bind(this)
		});
	},
	turnToUnFollow: function turnToUnFollow() {
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
				if (data.msg == "ok") {
					var newfollowlist = that.state.followlist;
					newfollowlist.isFollow = false;
					that.setState({ followlist: newfollowlist });
				}
			}).bind(this)
		});
	},
	HandleClick: function HandleClick() {
		var user = followlist;
		var webview = plus.webview.create('../views/page_visit_student.html');
		webview.evalJS("setUser('" + user + "')");
		webview.show('slide-in-right', 240);
	},
	render: function render() {
		var follow = this.state.followlist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.followlist.isFollow ? 'undisplay' : 'display';
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
						{ className: "profile", onClick: this.HandleClick },
						React.createElement("img", { src: this.state.followlist.profile })
					),
					React.createElement(
						"div",
						{ className: "info" },
						React.createElement(
							"span",
							{ className: "name" },
							this.state.followlist.nickname
						),
						React.createElement(
							"span",
							{ className: "small" },
							"(",
							this.state.followlist.grade,
							")"
						),
						React.createElement("br", null),
						React.createElement(
							"span",
							{ className: "info-infor" },
							this.state.followlist.province,
							" ",
							this.state.followlist.city,
							" ",
							React.createElement(
								"small",
								null,
								this.state.followlist.follownum,
								"人关注"
							)
						)
					),
					React.createElement(
						"div",
						{ className: unfollow },
						React.createElement(
							"div",
							{ className: "addfollow", onClick: this.turnToFollow },
							"+关注"
						)
					),
					React.createElement(
						"div",
						{ className: follow },
						React.createElement(
							"div",
							{ className: "followed", onClick: this.turnToUnFollow },
							"取消"
						)
					)
				)
			)
		);
	}
});
// 发现名师 列表 -
var List = React.createClass({
	displayName: "List",

	getInitialState: function getInitialState() {
		return { list: [],
			follow: this.props.follow };
	},
	componentDidMount: function componentDidMount() {
		var url = "";
		var that = this;
		if (undefined == plus.webview.getWebviewById('main-menu.html')) url = baseUrl + "/hotMaster";else url = baseUrl + "/followMasters";
		mui.ajax({
			url: url,
			success: (function (data) {
				that.setState({ list: data.ftlist });
				plus.nativeUI.closeWaiting();
			}).bind(this),
			error: function error(err) {
				plus.nativeUI.closeWaiting();
				plus.nativeUI.toast("网络错误");
			}
		});
		var self = this;
	},
	render: function render() {
		var self = this;

		var list = this.state.list.map(function (one, i) {
			return React.createElement(FollowList, { key: one._id, followlist: one });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});