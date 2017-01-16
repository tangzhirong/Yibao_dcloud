"use strict";

var baseUrl = localStorage.getItem('baseUrl');
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
			url: baseUrl + "/setFollow",
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
			url: baseUrl + "/cancelFollow",
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
		var me = plus.webview.create("page_home_page_teacher.html#/id/" + this.state.discoverylist._id, 'homepage');
		setTimeout(function () {
			me.show('pop-in', 150);
		}, 250);
	},

	render: function render() {
		var follow = this.state.discoverylist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.discoverylist.isFollow ? 'undisplay' : 'display';
		return React.createElement(
			"div",
			{ className: "feed" },
			React.createElement(
				"div",
				{ className: "teacherbar", onClick: this.goDetail },
				React.createElement(
					"div",
					{ className: "profile" },
					React.createElement("img", { src: this.state.discoverylist.photo })
				),
				React.createElement(
					"div",
					{ className: "info" },
					React.createElement(
						"p",
						{ className: "teachername" },
						this.state.discoverylist.nickname
					),
					React.createElement(
						"p",
						{ className: "teacherinfo" },
						this.state.discoverylist.studio
					),
					React.createElement(
						"p",
						{ className: "teacherstate" },
						"点评 ",
						this.state.discoverylist.commentNum,
						"    粉丝 ",
						this.state.discoverylist.fansNum
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
	updateContent: function updateContent(e, cateid) {
		var cateid = e.detail.cateid || cateid;
		mui.ajax({
			type: "post",
			url: baseUrl + "/itemsByCategory",
			data: {
				cateid: cateid,
				type: 'user'
			},
			success: (function (data) {
				this.setState({ list: data.userlist });
			}).bind(this)
		});
	},
	componentDidMount: function componentDidMount() {
		this.updateContent({ detail: {} }, "564a91b09efd30d81bf13f56");
		window.addEventListener('CLICK_CATE', this.updateContent);
	},
	componentWillUnmount: function componentWillUnmount() {
		window.removeEventListener('CLICK_CATE', this.updateContent);
	},
	render: function render() {
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
// category
var Cate = React.createClass({
	displayName: "Cate",

	render: function render() {
		var className = this.props.selected ? "sidefocused" : "";
		return React.createElement(
			"li",
			{ "data-id": this.props.cate._id, className: className },
			this.props.cate.name
		);
	}
});
// 发现名师类别 列表 -
var CateList = React.createClass({
	displayName: "CateList",

	getInitialState: function getInitialState() {
		return { catelist: [], selectedId: "" };
	},
	componentDidMount: function componentDidMount() {
		var that = this;
		Service.getCatesByType(this.props.cateName, function (err, cates) {
			if (err) return;
			that.setState({ catelist: cates, selectedId: cates[0]._id });
		});
		var node = ReactDOM.findDOMNode(this);
		mui(node).on('tap', 'li', function (e) {
			var cateid = this.getAttribute('data-id');
			that.setState({ selectedId: cateid });
			var event = new CustomEvent('CLICK_CATE', { detail: { cateid: cateid } });
			window.dispatchEvent(event);
		});
	},
	render: function render() {
		var list = this.state.catelist.map((function (one, i) {
			return React.createElement(Cate, { key: one._id, cate: one, selected: one._id == this.state.selectedId });
		}).bind(this));
		return React.createElement(
			"div",
			null,
			list
		);
	}
});
/* {this.state.discoverylist.address}&nbsp;{this.state.discoverylist.city}&nbsp; */