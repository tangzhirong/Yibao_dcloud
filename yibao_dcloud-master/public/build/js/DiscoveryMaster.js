"use strict";

var DiscoveryList = React.createClass({
	displayName: "DiscoveryList",

	getInitialState: function getInitialState() {
		return { discoverylist: this.props.discoverylist };
	},
	setFollow: function setFollow(e) {

		e.stopPropagation();
		var newdiscoverylist = this.state.discoverylist;
		var that = this;
		mui.ajax({
			url: "http://pang.tunnel.yibaoedu.com:8080/setFollow",
			type: "post",
			data: {
				followed_id: newdiscoverylist._id,
				type: 'user'
			},
			success: function success(result) {
				if (window.plus) plus.nativeUI.toast('关注成功!');else console.log('Like success');
				newdiscoverylist.isFollow = true;
				newdiscoverylist.fansNum++;
				that.setState({ discoverylist: newdiscoverylist });
			}
		});
	},
	cancelFollow: function cancelFollow(e) {

		e.stopPropagation();
		var newdiscoverylist = this.state.discoverylist;
		var that = this;
		mui.ajax({
			url: "http://pang.tunnel.yibaoedu.com:8080/cancelFollow",
			type: "post",
			data: {
				followed_id: newdiscoverylist._id,
				type: 'user'
			},
			success: function success(result) {
				if (window.plus) plus.nativeUI.toast('取消关注');else console.log('Cancel success');
				newdiscoverylist.isFollow = false;
				newdiscoverylist.fansNum--;
				that.setState({ discoverylist: newdiscoverylist });
			}
		});
	},

	goDetail: function goDetail() {
		var me = plus.webview.create("page_home_student.html#/id/" + this.state.discoverylist._id, 'homepage');
		setTimeout(function () {
			me.show('pop-in', 150);
		}, 250);
	},

	render: function render() {
		var follow = this.state.discoverylist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.discoverylist.isFollow ? 'undisplay' : 'display';
		return React.createElement(
			"div",
			{ className: "master-comments" },
			React.createElement(
				"div",
				{ className: "feed" },
				React.createElement(
					"div",
					{ className: "master-info", onClick: this.goDetail },
					React.createElement(
						"div",
						{ className: "profile" },
						React.createElement("img", { src: this.state.discoverylist.photo })
					),
					React.createElement(
						"div",
						{ className: "info" },
						React.createElement(
							"span",
							{ className: "name" },
							this.state.discoverylist.nickname
						),
						React.createElement(
							"span",
							{ className: "small" },
							"(",
							this.state.discoverylist.degree,
							")"
						),
						React.createElement("br", null),
						React.createElement(
							"span",
							{ className: "info-infor" },
							this.state.discoverylist.address,
							" ",
							this.state.discoverylist.city,
							" ",
							React.createElement(
								"small",
								null,
								this.state.discoverylist.followNum,
								"人关注"
							)
						)
					),
					React.createElement(
						"div",
						{ className: unfollow },
						React.createElement(
							"div",
							{ className: "addfollow", onClick: this.setFollow },
							"+关注"
						)
					),
					React.createElement(
						"div",
						{ className: follow },
						React.createElement(
							"div",
							{ className: "followed", onClick: this.cancelFollow },
							"已关注"
						)
					)
				),
				React.createElement(PicList, { picList: this.props.discoverylist.work })
			)
		);
	}
});
// 发现名师 列表 -
var List = React.createClass({
	displayName: "List",

	getInitialState: function getInitialState() {
		return { list: [] };
	},
	componentDidMount: function componentDidMount() {
		mui.ajax({
			type: "get",
			url: "http://pang.tunnel.yibaoedu.com:8080/HotMaster",
			dataType: "json",
			success: (function (data) {
				this.setState({ list: data.master_works });
			}).bind(this)
		});
		var self = this;
	},

	render: function render() {
		var self = this;

		var list = this.state.list.map(function (one, i) {
			return React.createElement(DiscoveryList, { key: one._id, discoverylist: one });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});

var Pic = React.createClass({
	displayName: "Pic",

	getInitialState: function getInitialState() {
		return { pic: this.props.pic };
	},
	render: function render() {
		return React.createElement("img", { src: this.state.pic.picUrl });
	}
});

var PicList = React.createClass({
	displayName: "PicList",

	getInitialState: function getInitialState() {
		return { picList: this.props.picList };
	},
	render: function render() {
		if (!this.state.picList) return null;
		var list = this.state.picList.map(function (pic, i) {
			if (!pic.picUrl) return null;
			return React.createElement(Pic, { key: i, pic: pic });
		});
		return React.createElement(
			"div",
			{ className: "picture" },
			list
		);
	}
});