"use strict";

var RectImg = React.createClass({
	displayName: "RectImg",

	getInitialState: function getInitialState() {
		return {
			imgSrc: this.props.imgSrc
		};
	},
	HandleClick: function HandleClick() {
		this.props.remove(this.props.imgSrc);
	},
	render: function render() {
		var remove = this.props.isDelete ? React.createElement(
			"span",
			{ className: "fa-stack fa-lg", onClick: this.HandleClick },
			React.createElement("i", { className: "fa fa-circle fa-stack-2x" }),
			React.createElement("i", { className: "fa fa-close fa-stack-1x fa-inverse" })
		) : React.createElement("div", null);
		return React.createElement(
			"div",
			{ className: "rectImg" },
			remove,
			React.createElement("img", { id: "img", src: this.props.imgSrc, width: "100%" })
		);
	}
});

var UpdateContainer = React.createClass({
	displayName: "UpdateContainer",

	remove: function remove(imgSrc) {
		this.props.remove(imgSrc);
	},
	render: function render() {
		var that = this;
		var ReactImgList = this.props.srcList.map(function (one, i) {
			return React.createElement(RectImg, { imgSrc: one, isDelete: that.props.isDelete, remove: that.remove });
		});
		return React.createElement(
			"div",
			{ className: "container" },
			ReactImgList
		);
	}
});

var UpdateImg = React.createClass({
	displayName: "UpdateImg",

	getInitialState: function getInitialState() {
		return {
			srcList: [],
			isDelete: false
		};
	},
	remove: function remove(src) {
		console.log(src);
		for (var i = 0; i < this.state.srcList.length; i++) {
			if (src == this.state.srcList[i]) {
				var list = this.state.srcList;
				list.splice(i, 1);
				console.log(this.state.srcList[i]);
				this.setState({ srcList: list });
				break;
			}
		}
	},
	deleteimg: function deleteimg() {
		var isDelete = !this.state.isDelete;
		this.setState({ isDelete: isDelete });
	},
	add: function add() {
		var that = this;
		plus.nativeUI.actionSheet({ cancel: "取消", buttons: [{ title: "拍照" }, { title: "相册" }] }, function (e) {

			if (e.index == 2) Service.getGallery(function (files) {
				if (files != null) {
					var list = that.state.srcList;
					for (var i = 0; i < files.length; i++) list.push(files[i]);
					that.setState({ srcList: list });
				}
			});else if (e.index == 1) Service.camera(function (path) {
				if (path != null) {
					var list = that.state.srcList;
					path = path.substr(1);
					list.push("../../" + path);
					that.setState({ srcList: list });
				}
			});
		});
	},
	componentDidMount: function componentDidMount() {
		var list = ['../img/head.jpg', '../img/head.jpg', '../img/head.jpg'];
		this.setState({ srcList: list });
		console.log(9);
	},
	render: function render() {
		window.lists = this.state.list;
		return React.createElement(
			"div",
			null,
			React.createElement(UpdateContainer, { remove: this.remove, srcList: this.state.srcList, isDelete: this.state.isDelete }),
			React.createElement(
				"div",
				{ className: "block" },
				React.createElement(
					"div",
					{ className: "rect", onClick: this.deleteimg },
					React.createElement("span", { className: "fa fa-minus-circle fa-2x" })
				),
				React.createElement(
					"div",
					{ className: "rect right", onClick: this.add },
					React.createElement("span", { className: "fa fa-plus-circle fa-2x" })
				)
			)
		);
	}
});