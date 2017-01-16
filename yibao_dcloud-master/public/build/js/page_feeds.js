//Here is a Feed component, including all of its behaviour functions.

"use strict";

var FeedContent = React.createClass({
	displayName: "FeedContent",

	handleClick: function handleClick() {
		alert('将会跳转到Feed详情页面 feedid: ' + this.props.feed._id);
	},
	render: function render() {

		var tags = this.props.feed.tags.map(function (tag, i) {
			return React.createElement(
				"span",
				{ key: i },
				tag
			);
		});

		return React.createElement(
			"div",
			{ className: "card", onClick: this.handleClick },
			React.createElement(
				"div",
				{ className: "info" },
				React.createElement(
					"div",
					{ className: "head" },
					React.createElement("img", { src: this.props.feed.owner.profile })
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
							this.props.feed.owner.nickname
						),
						React.createElement(
							"div",
							{ className: "classNo" },
							"（",
							this.props.feed.owner.grade,
							"）"
						)
					),
					React.createElement(
						"div",
						{ className: "down" },
						React.createElement("div", { className: "time" }),
						React.createElement(
							"div",
							{ className: "province" },
							this.props.feed.owner.district
						),
						React.createElement(
							"div",
							{ className: "city" },
							this.props.feed.owner.city
						)
					)
				)
			),
			React.createElement(
				"div",
				{ className: "works" },
				React.createElement(
					"div",
					{ className: "image" },
					React.createElement("img", { src: this.props.feed.picUrl })
				),
				React.createElement(
					"div",
					{ className: "text" },
					this.props.feed.content
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
			)
		);
	}
});

var FeedComment = React.createClass({
	displayName: "FeedComment",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "comment" },
			React.createElement(
				"div",
				{ className: "pageview" },
				React.createElement("i", { className: "fa fa-eye" }),
				React.createElement(
					"span",
					null,
					this.props.feed.viewNum
				)
			),
			React.createElement(
				"div",
				{ className: "comments" },
				React.createElement("i", { className: "fa fa-comment-o" }),
				React.createElement(
					"span",
					null,
					this.props.feed.commentNum
				)
			),
			React.createElement(
				"div",
				{ className: "love" },
				React.createElement("i", { className: "fa fa-thumbs-o-up" }),
				React.createElement(
					"span",
					null,
					this.props.feed.kudoNum
				)
			),
			React.createElement(
				"div",
				{ className: "collection" },
				React.createElement("i", { className: "fa fa-star" }),
				React.createElement(
					"span",
					null,
					this.props.feed.favourNum
				)
			)
		);
	}
});

var Feed = React.createClass({
	displayName: "Feed",

	getInitialState: function getInitialState() {
		return { feed: this.props.feed };
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "feed" },
			React.createElement(FeedContent, { feed: this.state.feed }),
			React.createElement(FeedComment, { feed: this.state.feed })
		);
	}
});

var FeedList = React.createClass({
	displayName: "FeedList",

	getInitialState: function getInitialState() {
		return { feedList: [] };
	},
	componentDidMount: function componentDidMount() {
		mui.ajax({
			url: "../js/test_data/data_feeds.json",
			dataType: "json",
			success: (function (data) {
				this.setState({ feedList: data });
			}).bind(this)
		});
		var self = this;
	},

	render: function render() {
		var list = this.state.feedList.map(function (one, i) {
			return React.createElement(Feed, { key: one._id, feed: one });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});