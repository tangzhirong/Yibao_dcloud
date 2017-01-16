"use strict";

if (!window.baseUrl) window.baseUrl = localStorage.getItem('baseUrl');

var Zixun = React.createClass({
	displayName: "Zixun",

	getInitialState: function getInitialState() {
		return { zixun: this.props.zixun };
	},
	addFavour: function addFavour(e) {
		e.stopPropagation();
		var newzixun = this.state.zixun;
		var that = this;
		mui.ajax({
			url: baseUrl + "/setFavour",
			type: "post",
			data: {
				id: newzixun._id,
				type: 'post'
			},
			success: function success(result) {
				if (window.plus) plus.nativeUI.toast('收藏成功!');else console.log('Like success');
				newzixun.isFavour = true;
				newzixun.FavourNum++;
				that.setState({ zixun: newzixun });
			}
		});
	},
	cancelFavour: function cancelFavour(e) {
		e.stopPropagation();
		var newzixun = this.state.zixun;
		var that = this;
		mui.ajax({
			url: baseUrl + "/cancelFavour",
			type: "post",
			data: {
				_id: newzixun._id,
				type: 'post'
			},
			success: function success(result) {
				if (window.plus) plus.nativeUI.toast('取消收藏');else console.log('Cancel success');
				newzixun.isFavour = false;
				newzixun.FavourNum--;
				that.setState({ zixun: newzixun });
			}
		});
	},
	render: function render() {
		var follow = this.state.zixun.isFavour ? 'display' : 'undisplay';
		var unfollow = this.state.zixun.isFavour ? 'undisplay' : 'display';
		var viewItemClickHandler = this.props.viewArticleClickHandler || function () {};
		return React.createElement(
			"div",
			{ className: "feed", onClick: viewItemClickHandler.bind(this) },
			React.createElement(
				"div",
				{ className: "consult-bar" },
				React.createElement(
					"div",
					{ className: "profile" },
					React.createElement("img", { src: this.state.zixun.thumbUrl })
				),
				React.createElement(
					"div",
					{ className: "consult-info" },
					React.createElement(
						"div",
						{ className: "title" },
						this.state.zixun.title
					),
					React.createElement(
						"div",
						{ className: "time" },
						this.state.zixun.createTime
					)
				),
				React.createElement(
					"div",
					{ className: unfollow },
					React.createElement(
						"div",
						{ className: "addfollow", onClick: this.addFavour },
						"收藏"
					)
				),
				React.createElement(
					"div",
					{ className: follow },
					React.createElement(
						"div",
						{ className: "followed", onClick: this.cancelFavour },
						"已收藏"
					)
				)
			)
		);
	}
});

// 资讯列表 -
var List = React.createClass({
	displayName: "List",

	getInitialState: function getInitialState() {
		return { list: [] };
	},
	componentDidMount: function componentDidMount() {
		mui.ajax({
			type: "get",
			url: baseUrl + "/postsByCategory/564a89b3e7aa481418b09864",
			dataType: "json",
			success: (function (data) {
				this.setState({ list: data.postlist });
			}).bind(this)
		});
		var self = this;
	},

	render: function render() {
		var self = this;

		var list = this.state.list.map(function (one, i) {
			return React.createElement(Zixun, { key: one._id, zixun: one, viewArticleClickHandler: self.props.viewArticleClickHandler });
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

	getInitialState: function getInitialState() {
		return { cate: this.props.cate };
	},
	changeStyle: function changeStyle(e) {
		var list = document.querySelectorAll("#page-sidebar-content li");
		for (var i = 0; i < list.length; i++) {
			list[i].className = "";
		}
		e.target.className += ' sidefocused';
		this.props.cateClickHandler.call(this);
	},
	render: function render() {
		return React.createElement(
			"li",
			{ onClick: this.changeStyle },
			this.state.cate.name
		);
	}
});
// 类别列表 -
var CateList = React.createClass({
	displayName: "CateList",

	getInitialState: function getInitialState() {
		return { catelist: [] };
	},
	componentDidMount: function componentDidMount() {
		var that = this;
		Service.getCatesByType('艺考咨讯', function (err, catelist) {
			that.setState({ catelist: catelist });
		});
	},

	render: function render() {
		var self = this;

		var list = this.state.catelist.map(function (one, i) {
			return React.createElement(Cate, { key: one._id, cate: one, cateClickHandler: self.props.cateClickHandler });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});