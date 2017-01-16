
// 一个collection内容
"use strict";

var Collection = React.createClass({
	displayName: "Collection",

	render: function render() {
		var type = this.props.item.type;
		var item = this.props.item;
		var typeMap = {
			'feed': function feed() {
				return React.createElement(
					"div",
					{ className: "feed", "data-id": item.feedid },
					React.createElement(
						"div",
						{ className: "content" },
						React.createElement(
							"div",
							{ className: "head-portrait" },
							React.createElement("img", { src: "../img/logo.png" })
						),
						React.createElement(
							"div",
							{ className: "title" },
							item.feedOwnerNickname
						),
						React.createElement("img", { src: item.feedPhoto, className: "work" })
					)
				);
			},
			'post': function post() {
				return React.createElement(
					"div",
					{ className: "post", "data-id": item.postid },
					React.createElement(
						"div",
						{ className: "content" },
						React.createElement(
							"div",
							{ className: "title" },
							item.postTitle
						),
						React.createElement("img", { src: item.postPic, className: "work" })
					)
				);
			}
		};

		return typeMap[type]();
	}
});
// Collection 列表 -
var CollectionList = React.createClass({
	displayName: "CollectionList",

	getInitialState: function getInitialState() {
		return { collectionList: [] };
	},
	componentDidMount: function componentDidMount() {
		mui.ajax({
			//url : baseUrl + "/favours/all?debugid=565a816dae1ce988100a811c",
			url: baseUrl + "/favours/all",
			dataType: "json",
			success: (function (data) {
				this.setState({ collectionList: data.favours });
			}).bind(this)
		});

		var list = ReactDOM.findDOMNode(this);
		mui(list).on('tap', '.feed', function (e) {
			var feedid = this.getAttribute('data-id');
			if (feedid) {
				var feedDetail = mui.openWindow({
					id: "feedDetail",
					url: "page_feeds_detail.html",
					styles: {},
					show: {
						aniShow: "pop-in",
						duration: 200
					},
					waiting: {
						autoShow: true
					}
				});
				setTimeout(function () {
					feedDetail.evalJS("update('" + feedid + "')");
				}, 50);
			}
		});
		mui(list).on('tap', '.post', function (e) {
			var postid = this.getAttribute('data-id');
			var pagePost = plus.webview.create('page_news_view.html', 'newsView', { top: 0, height: "39px" });
			pagePost.evalJS("updateContent('" + postid + "', '" + "test title" + "')");
		});
	},
	render: function render() {
		var cl = this.state.collectionList.map(function (one, i) {
			return React.createElement(Collection, { key: one._id, item: one });
		});
		return React.createElement(
			"div",
			null,
			cl
		);
	}
});