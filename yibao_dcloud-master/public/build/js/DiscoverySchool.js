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

	goToSchool: function goToSchool() {
		var newsView = plus.webview.create('page_news_view.html', 'newsView', { top: 0, height: "39px" });
		newsView.evalJS("updateContent('" + this.props.discoverylist._id + "', '" + this.props.discoverylist.title + "')");
	},

	render: function render() {
		var follow = this.state.discoverylist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.discoverylist.isFollow ? 'undisplay' : 'display';
		return React.createElement(
			"div",
			{ className: "content", onClick: this.goToSchool },
			React.createElement(
				"div",
				{ className: "feed" },
				React.createElement(
					"div",
					{ className: "schoolbar" },
					React.createElement(
						"div",
						{ className: "profile" },
						React.createElement("img", { src: this.state.discoverylist.thumbUrl })
					),
					React.createElement(
						"div",
						{ className: "info" },
						React.createElement(
							"span",
							{ className: "schoolname" },
							this.state.discoverylist.title
						),
						React.createElement("br", null)
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
	componentDidMount: function componentDidMount() {
		var that = this;
		Service.getCatesByType("校考", function (err, cates) {
			if (err) return;
			console.log('here');
			//ajax
			mui.ajax({
				type: "post",
				url: baseUrl + "/itemsByCategory",
				data: {
					cateid: cates[0]._id,
					type: 'school'
				},
				success: function success(data) {
					that.setState({ list: data.schoollist });
				}
			});
		});
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
// category
var Cate = React.createClass({
	displayName: "Cate",

	render: function render() {
		var className = this.props.selected ? "sidefocused" : "";
		return React.createElement(
			"li",
			{ className: className, onClick: this.props.clickOnCate.bind(null, this) },
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
		Service.getCatesByType("校考", function (err, cates) {
			if (err) return;
			that.setState({ catelist: cates, selectedId: cates[0]._id });
		});
	},
	clickOnCate: function clickOnCate(cateThis) {
		this.selectedId = cateThis.props.cate._id;
		this.setState({ selectedId: this.selectedId });
		this.props.cateClickHandler(this.selectedId);
	},
	render: function render() {
		var self = this;

		var list = this.state.catelist.map(function (one, i) {
			return React.createElement(Cate, { key: one._id, cate: one, selected: one._id == self.state.selectedId, clickOnCate: self.clickOnCate });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});
/* <span className="schoolinfo">{this.state.discoverylist.address}&nbsp;{this.state.discoverylist.city}</span> */ /* <div className={unfollow}>
                                                                                                                  <div className="addfollow" onClick={this.setFollow}>
                                                                                                                  +关注
                                                                                                                  </div>
                                                                                                                  </div>
                                                                                                                  <div className={follow}>
                                                                                                                  <div className="followed" onClick={this.cancelFollow}>
                                                                                                                  已关注
                                                                                                                  </div>
                                                                                                                  </div> */