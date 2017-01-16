//Here is a Feed component, including all of its behaviour functions.

//用户的标题，可以重复被利用，在各种有用户的地方
// props : user = 用户信息
"use strict";

var Profile = React.createClass({
	displayName: "Profile",

	render: function render() {
		var classNo = this.props.user.degree ? React.createElement(
			"div",
			{ className: "classNo" },
			"（",
			this.props.user.degree,
			"）"
		) : React.createElement("div", null);
		return React.createElement(
			"div",
			{ className: "info profile", "data-role": this.props.user.role, "data-userid": this.props.user._id },
			React.createElement(
				"div",
				{ className: "head" },
				React.createElement(Imgx, { src: this.props.user.photo ? this.props.user.photo : "../img/logo.png" })
			),
			React.createElement(
				"div",
				{ className: "data" },
				React.createElement(
					"div",
					{ className: "upper" },
					React.createElement(
						"div",
						{ className: "name" },
						this.props.user.nickname
					),
					classNo
				),
				React.createElement(
					"div",
					{ className: "down" },
					React.createElement(
						"div",
						{ className: "province" },
						this.props.user.address
					),
					React.createElement(
						"div",
						{ className: "city" },
						this.props.user.city
					)
				)
			)
		);
	}
});

// 一个feed的整体内容
var FeedContent = React.createClass({
	displayName: "FeedContent",

	startDianping: function startDianping() {
		var event = new CustomEvent('ANONYMOUS_COMMENT');
		window.dispatchEvent(event);
	},
	render: function render() {
		var _props = this.props;
		var feed = _props.feed;
		var noDianpingBtn = _props.noDianpingBtn;
		var feedAddingLike = _props.feedAddingLike;
		var feedAddingFavour = _props.feedAddingFavour;

		var tags = feed.tags.map(function (tag, i) {
			return React.createElement(
				"span",
				{ key: i },
				tag.name
			);
		});
		var dianpingBtn = noDianpingBtn ? null : React.createElement(
			"div",
			{ className: "comments", onClick: this.startDianping },
			React.createElement(
				"span",
				{ className: "fa fa-edit" },
				"开始点评"
			)
		);

		var commentClass = noDianpingBtn ? " listview" : "";

		var imgTag = feed.picUrl && feed.picUrl != 'undefined' ? noDianpingBtn ? React.createElement("img", { src: feed.picUrl }) : React.createElement("img", { src: feed.picUrl, "data-preview-src": "", "data-preview-group": "1" }) : null;

		return React.createElement(
			"div",
			{ className: "card", id: feed._id },
			React.createElement(Profile, { user: feed.owner }),
			React.createElement(
				"div",
				{ className: "works" },
				React.createElement(
					"div",
					{ className: "image" },
					imgTag
				),
				React.createElement(
					"div",
					{ className: "text" },
					feed.content
				)
			),
			React.createElement(
				"div",
				{ className: "category" },
				React.createElement("i", { className: "fa fa-tag" }),
				React.createElement(
					"span",
					{ className: "tag" },
					tags
				)
			),
			React.createElement(
				"div",
				{ className: "comment" + commentClass },
				React.createElement(
					"div",
					{ className: "pageview" },
					React.createElement("i", { className: "fa fa-eye" }),
					React.createElement(
						"span",
						null,
						" ",
						feed.viewNum
					)
				),
				React.createElement(
					"div",
					{ className: feed.isDianzan ? "love up" : "love", onClick: feedAddingLike },
					React.createElement("i", { className: "fa fa-thumbs-o-up" }),
					React.createElement(
						"span",
						null,
						" ",
						feed.kudoNum
					)
				),
				React.createElement(
					"div",
					{ className: feed.isFavour ? "collection up" : "collection", onClick: feedAddingFavour },
					React.createElement("i", { className: "fa fa-star" }),
					React.createElement(
						"span",
						null,
						" ",
						feed.favourNum
					)
				),
				dianpingBtn
			)
		);
	}
});

var Feed = React.createClass({
	displayName: "Feed",

	addLike: function addLike(event) {
		event.stopPropagation();
		var feed = this.props.feed;
		var that = this;
		var url = '/setDianzan';
		if (feed.isDianzan) url = '/cancelDianzan';
		mui.ajax({
			url: baseUrl + url,
			type: "post",
			data: {
				id: feed._id,
				type: 'feed'
			},
			success: function success(result) {
				if (window.plus) plus.nativeUI.toast(feed.isDianzan ? '取消成功' : '点赞成功!');
				if (feed.isDianzan) feed.kudoNum--;else feed.kudoNum++;
				feed.isDianzan = !feed.isDianzan;
				var e = new CustomEvent('ADD_LIKE', { 'detail': { feed: feed, feedKey: that.props.feedKey } });
				window.dispatchEvent(e);
			}
		});
		return true;
	},
	addFavour: function addFavour(event) {
		event.stopPropagation();
		var feed = this.props.feed;
		if (feed.isFavour) {
			if (window.plus) {
				return plus.nativeUI.toast('已在收藏夹中了');
			}
			return true;
		}
		var that = this;
		mui.ajax({
			url: baseUrl + "/setFavour",
			type: "post",
			data: {
				id: feed._id,
				type: 'feed'
			},
			success: function success(result) {
				if (window.plus) plus.nativeUI.toast('收藏成功!');else console.log('Like success');
				feed.favourNum++;
				feed.isFavour = true;
				var e = new CustomEvent('ADD_LIKE', { 'detail': { feed: feed, feedKey: that.props.feedKey } });
				window.dispatchEvent(e);
			}
		});
		return true;
	},
	render: function render() {
		var _props2 = this.props;
		var feed = _props2.feed;
		var noDianpingBtn = _props2.noDianpingBtn;
		var startDianping = _props2.startDianping;

		if (feed) {
			return React.createElement(
				"div",
				{ className: "feed" },
				React.createElement(FeedContent, { feed: feed,
					feedAddingLike: this.addLike,
					feedAddingFavour: this.addFavour,
					noDianpingBtn: noDianpingBtn,
					startDianping: startDianping })
			);
		} else return null;
	}
});

// Feed 列表
var FeedList = React.createClass({
	displayName: "FeedList",

	getInitialState: function getInitialState() {
		return { feedList: [] };
	},
	componentDidMount: function componentDidMount() {
		window.addEventListener('ADD_LIKE', FeedCollection.updateFeed.bind(this));
		window.addEventListener('ADD_FAVOUR', FeedCollection.updateFeed.bind(this));
	},
	componentDidUnmount: function componentDidUnmount() {
		window.removeEventListener('ADD_LIKE');
		window.removeEventListener('ADD_FAVOUR');
	},
	render: function render() {
		var self = this;
		var list = this.state.feedList.map(function (one) {
			return React.createElement(Feed, { feed: one, key: one._id, feedAddingLike: self.feedAddingLike,
				feedAddingFavour: self.feedAddingFavour, noDianpingBtn: true });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});

var FeedCollection = {
	updateFeed: function updateFeed(e) {
		var feed = e.detail.feed;
		var feedKey = e.detail.feed;
		for (var i in this.state.feedList) {
			if (this.state.feedList[i]._id == feedKey) this.state.feedList[i] = feed;
		}
		this.setState({ feedList: this.state.feedList });
	}
};