"use strict";

var Work_card = React.createClass({
	displayName: "Work_card",

	render: function render() {
		var that = this;
		var work = this.props.workcate.content.map(function (one, i) {
			if (!one.picUrl) return null;

			var imgUrl = one.picUrl.split('/');
			var imgname = imgUrl[imgUrl.length - 1];
			if (/yibao/.test(one.picUrl)) return React.createElement("img", { className: "work", id: one._id,
				src: "http://yibao.img-cn-beijing.aliyuncs.com/" + imgname + "@1e_1c_0o_0l_360h_360w_100q", width: "100%" });else return React.createElement("img", { className: "work", id: one._id,
				src: one.picUrl, width: "100%" });
		});
		return React.createElement(
			"div",
			{ className: "card-content" },
			React.createElement(
				"div",
				{ className: "works_info" },
				React.createElement(
					"span",
					{ className: "works_time" },
					this.props.workcate.time
				),
				React.createElement(
					"span",
					{ className: "works_num" },
					this.props.workcate.content.length,
					"幅"
				)
			),
			React.createElement(
				"div",
				{ className: "works" },
				work
			)
		);
	}
});
var Display = React.createClass({
	displayName: "Display",

	render: function render() {
		var that = this;
		var work_cards = this.props.workcates.map(function (one, i) {
			return React.createElement(
				"div",
				{ className: "works_card_contain" },
				React.createElement(
					"div",
					{ className: "works_card" },
					React.createElement(Work_card, { workcate: one })
				)
			);
		});
		return React.createElement(
			"div",
			null,
			React.createElement("div", { className: "card-image-background" }),
			React.createElement(
				"div",
				{ className: "contain" },
				work_cards
			),
			React.createElement("div", { className: "works_card_contain" })
		);
	}
});