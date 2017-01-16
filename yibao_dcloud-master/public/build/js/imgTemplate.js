// Imgx is a img component for caching the image into disk

// <Imgx src="some-pic-url" onClick="afterClick()" />

"use strict";

var Imgx = React.createClass({
	displayName: "Imgx",

	getInitialState: function getInitialState() {
		return { localUrl: "" };
	},
	getTheImage: function getTheImage(path) {
		if (!path) return;
		var that = this;
		var segs = path.split('/');

		var filename;
		if (segs.length == 1) filename = segs[0];else filename = segs[segs.length - 1];

		if (!window.plus) this.setState({ localUrl: path });else {

			if (path[0] == ".") return this.setState({ localUrl: path });
			var baseDir = "_doc/cachedImage/";
			plus.io.resolveLocalFileSystemURL(baseDir + filename, function (result) {
				var path = plus.io.convertLocalFileSystemURL(baseDir + filename);
				that.setState({ localUrl: path });
			}, function (result) {
				// If the file can not be found
				var downloadImg = plus.downloader.createDownload(that.props.src, { filename: baseDir + filename }, function (document, err) {
					var path = plus.io.convertLocalFileSystemURL(baseDir + filename);
					that.setState({ localUrl: path });
				});
				downloadImg.start();
			});
		}
	},
	componentDidMount: function componentDidMount() {
		this.getTheImage(this.props.src);
	},
	componentWillUpdate: function componentWillUpdate(nextProps, nextStates) {
		if (nextProps.src == this.props.src && this.state.localUrl == nextStates.localUrl) return false;
		this.getTheImage(nextProps.src);
	},
	render: function render() {
		return React.createElement("img", { src: this.state.localUrl });
	}
});