"use strict";

var CommentColumn = React.createClass({
	displayName: "CommentColumn",

	render: function render() {
		var data = this.props.commentData;
		var imgname = this.props.commentData.feedPhoto || "";
		imgname = imgname == "undefined" ? "" : imgname.split('/');
		imgname = imgname.length > 0 ? imgname[imgname.length - 1] : "";
		imgname = imgname ? "http://yibao.img-cn-beijing.aliyuncs.com/" + imgname + "@1e_1c_0o_0l_120h_120w_100q" : "";
		return React.createElement(
			"div",
			{ className: "column", "data-feedid": this.props.commentData.feedid || "" },
			React.createElement(
				"div",
				{ className: "column-text" },
				React.createElement(
					"div",
					{ className: "head-portrait" },
					React.createElement("img", { className: "head-img", src: data.sender.photo, height: "47px" }),
					React.createElement("div", { className: "notice" })
				),
				React.createElement(
					"div",
					{ className: "info" },
					React.createElement(
						"span",
						{ className: "info-name" },
						data.sender.nickname
					),
					React.createElement("br", null),
					React.createElement(
						"span",
						{ className: "info-time" },
						Service.HQDate(data.editTime)
					)
				),
				React.createElement(
					"div",
					{ className: "comment" },
					React.createElement(
						"span",
						{ className: "text" },
						"评论了你的作品"
					),
					React.createElement("br", null)
				),
				React.createElement("img", { Style: "max-height:47px", src: imgname })
			),
			React.createElement("br", null),
			React.createElement(
				"div",
				{ className: "comment-text" },
				React.createElement("i", { className: "triangle-left" }),
				React.createElement(
					"span",
					{ className: "content-text" },
					data.content
				)
			)
		);
	}
});

var CommentColumnList = React.createClass({
	displayName: "CommentColumnList",

	getInitialState: function getInitialState() {
		return { CommentColumnList: [] };
	},
	componentDidMount: function componentDidMount() {
		var list = ReactDOM.findDOMNode(this);
		mui(list).on('click', 'div.column', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var feedid = this.getAttribute('data-feedid');
			if (feedid) {
				var feedDetail = mui.openWindow({
					id: "feedDetail",
					url: "page_feeds_detail.html",
					styles: {},
					show: {
						aniShow: "pop-in",
						duration: 400
					},
					waiting: {
						autoShow: true
					}
				});
				feedDetail.evalJS("update('" + feedid + "')");
			}
		});
	},
	componentWillUnmount: function componentWillUnmount() {
		mui(list).off('click', 'div.column');
	},
	render: function render() {
		var list = this.state.CommentColumnList.map(function (one, i) {
			return React.createElement(CommentColumn, { commentData: one });
		});
		var nothing = React.createElement(
			"div",
			{ className: "nothing" },
			"您还未收到任何评论"
		);
		var lists = this.state.CommentColumnList.length != 0 ? list : nothing;
		return React.createElement(
			"div",
			null,
			lists
		);
	}
});