"use strict";

var baseUrl = localStorage.getItem("baseUrl") || "http://pang.tunnel.yibaoedu.com:8080";
var Fans = React.createClass({
	displayName: "Fans",

	getInitialState: function getInitialState() {
		return { fanslist: this.props.fans };
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this.setState({ fanslist: nextProps.fans });
	},
	turnToFollow: function turnToFollow(e) {
		console.log("addFollow");
		e.stopPropagation();
		var that = this;
		mui.ajax({
			url: baseUrl + "/setFollow",
			data: {
				"followed_id": that.state.fanslist.follower._id,
				"type": "user"
			},
			type: 'post',
			success: (function (data) {
				console.log(JSON.stringify(data));
				if (data.msg == "ok") {
					var newfollowlist = that.state.fanslist;
					newfollowlist.isFollow = true;
					that.setState({ fanslist: newfollowlist });
				}
			}).bind(this),
			error: function error(data) {
				console.log(JSON.stringify(data));
			}
		});
	},
	turnToUnFollow: function turnToUnFollow(e) {
		console.log("addFollow");
		e.stopPropagation();
		var that = this;
		mui.ajax({
			url: baseUrl + "/cancelFollow",
			data: {
				"followed_id": that.state.fanslist.follower._id,
				"type": "user"
			},
			type: 'post',
			success: (function (data) {
				console.log(JSON.stringify(data));
				if (data.msg == "ok") {
					var newfollowlist = that.state.fanslist;
					newfollowlist.isFollow = false;
					that.setState({ fanslist: newfollowlist });
				}
			}).bind(this),
			error: function error(data) {
				console.log(JSON.stringify(data));
			}
		});
	},
	HandleClick: function HandleClick() {
		var role = this.state.fanslist.follower.role;
		var userid = this.state.fanslist.follower._id;
		console.log(role);
		console.log(userid);
		var webview_style = {
			popGesture: "close"
		};
		var id, url;
		if (role == "STUDENT") {
			console.log(101);
			id = "page_home_student.html";
			url = "page_home_student.html#/id/" + userid;
			console.log(url);
		} else if (role == "TEACHER") {
			console.log(100);
			id = "page_home_page_teacher.html";
			url = "page_home_page_teacher.html#/id/" + userid;
			console.log(100);
		} else {
			plus.nativeUI.toast("您的身份信息有误！");
			return;
		}
		mui.openWindow({
			id: id,
			url: url,
			styles: webview_style,
			show: {
				aniShow: "pop-in",
				duration: 400
			},
			waiting: {
				autoShow: true
			}
		});
		console.log(100);
	},
	render: function render() {
		var studentSelect = this.state.fanslist.follower.role == "STUDENT" ? 'display' : 'undisplay';
		var teacherSelect = this.state.fanslist.follower.role == "STUDENT" ? 'undisplay' : 'display';
		var follow = this.state.fanslist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.fanslist.isFollow ? 'undisplay' : 'display';
		var roleString = this.state.fanslist.follower.role == "STUDNET" ? "老师" : "学生";
		console.log(roleString);
		console.log(this.state.fanslist.follower._id);
		if (this.state.fanslist.follower.role == "STUDENT") {
			console.log(this.state.fanslist.follower.role);
			var role = this.state.fanslist.follower.role;
			return React.createElement(
				"div",
				{ className: studentSelect },
				React.createElement(
					"div",
					{ className: "feed", onClick: this.HandleClick },
					React.createElement(
						"div",
						{ className: "master-info" },
						React.createElement(
							"div",
							{ className: "profile" },
							React.createElement("img", { src: this.state.fanslist.followerPhoto })
						),
						React.createElement(
							"div",
							{ className: "info" },
							React.createElement(
								"span",
								{ className: "name" },
								this.state.fanslist.followerName
							),
							" ",
							React.createElement("br", null),
							React.createElement(
								"span",
								{ className: "info-infor" },
								this.state.fanslist.follower.address,
								" ",
								this.state.fanslist.follower.city,
								" ",
								React.createElement(
									"small",
									null,
									!this.state.fanslist.follower.follownum ? "0" : this.state.fanslist.follower.follownum,
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
		} else {
			return React.createElement(
				"div",
				{ className: teacherSelect },
				React.createElement(
					"div",
					{ className: "feed", onClick: this.HandleClick },
					React.createElement(
						"div",
						{ className: "teacherbar" },
						React.createElement(
							"div",
							{ className: "profile", onClick: this.HandleClick },
							React.createElement("img", { src: this.state.fanslist.follower.photo })
						),
						React.createElement(
							"div",
							{ className: "info" },
							React.createElement(
								"span",
								{ className: "teachername" },
								this.state.fanslist.follower.nickname
							),
							"  ",
							React.createElement(
								"span",
								{ className: "small" },
								"老师"
							),
							React.createElement("br", null),
							React.createElement(
								"span",
								{ className: "teacherinfo" },
								this.state.fanslist.follower.address,
								" ",
								this.state.fanslist.follower.city,
								" ",
								this.state.fanslist.follower.graduate_school
							),
							React.createElement("br", null),
							React.createElement(
								"span",
								{ className: "small" },
								"点评 ",
								this.state.fanslist.follower.commentNum,
								"  粉丝 ",
								this.state.fanslist.follower.fansNum
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
			);
		}
	}
});
// 粉丝列表 -
var FansList = React.createClass({
	displayName: "FansList",

	getInitialState: function getInitialState() {
		return { list: [] };
	},
	componentDidMount: function componentDidMount() {
		var that = this;
		mui.ajax({
			url: baseUrl + "/fans?debugid=565a816dae1ce988100a811c",
			success: (function (data) {
				console.log(JSON.stringify(data));
				that.setState({ list: data.fanslist });
			}).bind(this),
			error: function error(err) {
				console.log(JSON.stringify(err));
			}
		});
		var self = this;
	},
	render: function render() {
		var self = this;
		var list = this.state.list.map(function (one, i) {
			return React.createElement(Fans, { key: one._id, fans: one });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});