"use strict";

var Strategy = React.createClass({
	displayName: "Strategy",

	getInitialState: function getInitialState() {
		return { strategy: this.props.strategy };
	},
	addFavour: function addFavour(e) {
		e.stopPropagation();
		var newstrategy = this.state.strategy;
		var that = this;
		if (!newstrategy.isFavour) {
			mui.ajax({
				url: "http://pang.tunnel.yibaoedu.com:8080/setFavour",
				type: "post",
				data: {
					id: newstrategy._id,
					type: 'post'
				},
				success: function success(result) {
					if (window.plus) plus.nativeUI.toast('收藏成功!');else console.log('Like success');
					newstrategy.isFavour = true;
					newstrategy.FavourNum++;
					that.setState({ strategy: newstrategy });
				}
			});
		} else {
			mui.ajax({
				url: "http://pang.tunnel.yibaoedu.com:8080/cancelFavour",
				type: "post",
				data: {
					_id: newstrategy._id,
					type: 'post'
				},
				success: function success(result) {
					if (window.plus) plus.nativeUI.toast('取消收藏');else console.log('Cancel success');
					newstrategy.isFavour = false;
					newstrategy.FavourNum--;
					that.setState({ strategy: newstrategy });
				}
			});
		}
	},
	addDianzan: function addDianzan(e) {
		e.stopPropagation();
		var newstrategy = this.state.strategy;
		var that = this;
		if (!newstrategy.isDianzan) {
			mui.ajax({
				url: "http://pang.tunnel.yibaoedu.com:8080/setDianzan",
				type: "post",
				data: {
					id: newstrategy._id,
					type: 'post'
				},
				success: function success(result) {
					if (window.plus) plus.nativeUI.toast('点赞成功！');else console.log('Like success');
					newstrategy.isDianzan = true;
					newstrategy.likeNum++;
					that.setState({ strategy: newstrategy });
				}
			});
		} else {
			mui.ajax({
				url: "http://pang.tunnel.yibaoedu.com:8080/cancelDianzan",
				type: "post",
				data: {
					id: newstrategy._id,
					type: 'post'
				},
				success: function success(result) {
					if (window.plus) plus.nativeUI.toast('取消点赞');else console.log('Like success');
					newstrategy.isDianzan = false;
					newstrategy.likeNum--;
					that.setState({ strategy: newstrategy });
				}
			});
		}
	},
	render: function render() {

		var isfavour = this.state.strategy.isFavour ? 'collection up' : 'collection down';
		var islove = this.state.strategy.isDianzan ? 'love up' : 'love down';
		return React.createElement(
			"div",
			{ className: "feed" },
			React.createElement(
				"div",
				{ className: "card", id: this.state.strategy._id, title: this.state.strategy.title },
				React.createElement(
					"div",
					{ className: "picture" },
					React.createElement("img", { src: this.state.strategy.picUrl }),
					React.createElement(
						"div",
						{ className: "title" },
						this.state.strategy.title
					)
				)
			),
			React.createElement(
				"div",
				{ className: "brief" },
				React.createElement(
					"div",
					{ className: "subtitle" },
					this.state.strategy.subtitle
				),
				React.createElement("hr", null),
				React.createElement(
					"div",
					{ className: "comment" },
					React.createElement(
						"div",
						{ className: "pageview" },
						React.createElement("i", { className: "fa fa-eye" }),
						React.createElement(
							"div",
							{ className: "text" },
							this.state.strategy.viewNum
						)
					),
					React.createElement(
						"div",
						{ className: islove, onClick: this.addDianzan },
						React.createElement("i", { className: "fa fa-thumbs-o-up" }),
						React.createElement(
							"div",
							{ className: "text" },
							this.state.strategy.likeNum
						)
					),
					React.createElement(
						"div",
						{ className: isfavour, onClick: this.addFavour },
						React.createElement("i", { className: "fa fa-star" }),
						React.createElement(
							"div",
							{ className: "text" },
							this.state.strategy.FavourNum
						)
					)
				)
			)
		);
	}
});
// 攻略列表 -
var List = React.createClass({
	displayName: "List",

	getInitialState: function getInitialState() {
		return { list: [] };
	},
	componentDidMount: function componentDidMount() {
		mui.ajax({
			type: "get",
			url: "http://pang.tunnel.yibaoedu.com:8080/postsByCategory/5643424a95804f136d5adec1",
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
			return React.createElement(Strategy, { key: one._id, strategy: one });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});