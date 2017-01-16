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
		var newsView = plus.webview.create('../views/page_news_view.html', 'news_view');
		newsView.evalJS("updateContent('" + "','" + url + "','" + title + "')");
		newsView.show('slide-in-right', 240);
	},
	render: function render() {
		var follow = this.state.followlist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.followlist.isFollow ? 'undisplay' : 'display';
		return React.createElement(
			"div",
			{ className: "content" },
			React.createElement(
				"div",
				{ className: "feed" },
				React.createElement(
					"div",
					{ className: "schoolbar" },
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
							{ className: "schoolname" },
							this.state.followlist.nickname
						),
						React.createElement("br", null),
						React.createElement(
							"span",
							{ className: "schoolinfo" },
							this.state.followlist.district,
							" ",
							this.state.followlist.city
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
							"关注"
						)
					)
				)
			)
		);
	}
});
// 发现学校列表 -
var List = React.createClass({
	displayName: "List",

	getInitialState: function getInitialState() {
		return { list: [],
			follow: this.props.follow };
	},
	componentDidMount: function componentDidMount() {
		var url = "";
		if (this.state.follow) url = "http://pang.tunnel.yibaoedu.com:8080/followSchools";else url = "http://pang.tunnel.yibaoedu.com:8080/hotSchools";
		mui.ajax({
			url: url,
			dataType: "json",
			success: (function (data) {
				this.setState({ list: data });
			}).bind(this)
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