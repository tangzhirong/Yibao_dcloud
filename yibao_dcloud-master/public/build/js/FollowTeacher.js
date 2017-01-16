"use strict";

var baseUrl = localStorage.getItem('baseUrl') || "http://pang.tunnel.yibaoedu.com:8080";
var FollowList = React.createClass({
	displayName: "FollowList",

	getInitialState: function getInitialState() {
		return { followlist: this.props.followlist };
	},
	turnToFollow: function turnToFollow() {
		var that = this;
		mui.ajax({
			url: baseUrl + "/setFollow",
			data: {
				followed_id: this.state.followlist._id,
				type: "user"
			},
			type: 'post',
			success: (function (data) {
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
			url: baseUrl + "/cancelFollow",
			data: {
				followed_id: this.props.followlist._id,
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
		var me = plus.webview.create("page_home_page_teacher.html#/id/" + this.state.followlist.followed._id, 'homepage');
		setTimeout(function () {
			me.show('pop-in', 150);
		}, 250);
	},
	componentDidMount: function componentDidMount() {
		var newfollowlist = this.state.followlist;
		newfollowlist.isFollow = this.props.follow;
		this.setState({ followlist: newfollowlist });
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "feed" },
			React.createElement(
				"div",
				{ className: "teacherbar", onClick: this.HandleClick },
				React.createElement(
					"div",
					{ className: "profile" },
					React.createElement("img", { src: this.state.followlist.followed.photo })
				),
				React.createElement(
					"div",
					{ className: "info" },
					React.createElement(
						"span",
						{ className: "teachername" },
						this.state.followlist.followed.nickname
					),
					React.createElement("br", null),
					React.createElement(
						"span",
						{ className: "teacherinfo" },
						this.state.followlist.followed.address,
						" ",
						this.state.followlist.followed.city,
						" ",
						this.state.followlist.followed.studio
					),
					React.createElement("br", null),
					React.createElement(
						"span",
						{ className: "teacherstate" },
						"点评 ",
						this.state.followlist.followed.comment,
						"  粉丝 ",
						this.state.followlist.followed.fansnum
					)
				),
				React.createElement(
					"div",
					null,
					React.createElement(
						"div",
						{ className: "followed", onClick: this.turnToUnFollow },
						"取消关注"
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
		return { list: [], follow: this.props.follow };
	},
	componentDidMount: function componentDidMount() {
		var url;
		var that = this;
		url = baseUrl + "/followTeachers?debugid=565a816dae1ce988100a811c";
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
			return React.createElement(FollowList, { key: one._id, follow: self.state.follow, followlist: one });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});