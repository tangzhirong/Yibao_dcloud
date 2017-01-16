'use strict';

var RecordCountBox = React.createClass({
	displayName: 'RecordCountBox',

	getInitialState: function getInitialState() {
		return { isShow: false, countup: 0 };
	},
	startRecord: function startRecord() {
		var that = this;
		that.setState({ isShow: true, countup: 0 });
		that.counting = setInterval(function () {
			that.state.countup++;
			that.setState({ countup: that.state.countup });
		}, 1000);
	},
	endRecord: function endRecord() {
		this.setState({ isShow: false, countup: 0 });
		clearInterval(this.counting);
	},
	componentDidMount: function componentDidMount() {
		window.addEventListener('START_RECORD', this.startRecord);
		window.addEventListener('END_RECORD', this.endRecord);
	},
	componentWillMount: function componentWillMount() {
		window.removeEventListener('START_RECORD', this.startRecord);
		window.removeEventListener('END_RECORD', this.endRecord);
	},
	render: function render() {
		var className = !this.state.isShow ? "count-box hidden" : "count-box";
		return React.createElement(
			'div',
			{ className: className },
			React.createElement('span', { className: 'fa fa-microphone' }),
			React.createElement(
				'p',
				{ className: 'count' },
				this.state.countup
			)
		);
	}
});

var ReplyForm = React.createClass({
	displayName: 'ReplyForm',

	getInitialState: function getInitialState() {
		return { isShow: false, toPeople: null, isVoice: false };
	},
	textOnBlur: function textOnBlur() {
		this.setState({ isShow: false });
	},
	switchToVoice: function switchToVoice() {
		this.setState({ isVoice: !this.state.isVoice });
		if (this.state.isVoice) setTimeout(function () {
			document.getElementById('replyText').focus();
		}, 1);
	},
	startRecord: function startRecord() {
		var event = new CustomEvent('START_RECORD');
		window.dispatchEvent(event);
		this.isCancel = false;
		var that = this;
		this.startTime = Date.now();

		this.myRecorder = plus.audio.getRecorder();

		this.myRecorder.record({ filename: "_doc/audio/" }, function (recordFile) {
			console.log("Audio record success!   path : " + recordFile);
			var ms = Date.now() - that.startTime;
			if (ms <= 1100) {
				return plus.nativeUI.toast('录音时间太短');
			}

			if (that.isCancel) {
				return plus.nativeUI.toast('已取消发送');
			}

			var msgObj = {
				type: "voice",
				len: ms,
				localUrl: recordFile
			};
			that.submitComment(msgObj);
		}, function (e) {
			console.log("record error");
		});
	},
	endRecord: function endRecord() {
		var event = new CustomEvent('END_RECORD');
		window.dispatchEvent(event);
		if (this.myRecorder) this.myRecorder.stop();
	},
	submitComment: function submitComment(msgObj) {
		if (msgObj.type == "voice") {} else if (msgObj.type == "text") {
			msgObj.content = this.refs.textComment.value.trim();
			this.refs.textComment.value = "";
		}
		if (this.commentType == "TEACHER_FIRST") {
			var event = new CustomEvent('ADD_FIRST_COMMENT', { detail: { msgObj: msgObj, commentType: this.commentType } });

			return window.dispatchEvent(event);
		}

		console.log('[submit2] topeople : ' + JSON.stringify(this.state.toPeople));
		var event = new CustomEvent('SUBMIT_COMMENT', { detail: { msgObj: msgObj, commentType: this.commentType,
				comment: this.comment, toPeople: this.state.toPeople
			} });
		window.dispatchEvent(event);
	},
	/* 调整输入框高度的函数 */
	textinput: function textinput(event) {
		var area = document.getElementById("replyText");
		var outWrap = document.getElementById("replyForm");
		console.log('scrollHeight : ' + area.scrollHeight);
		if (area.scrollHeight > 53) {
			if (!/higher/.test(area.className)) {
				area.className += ' higher';
				outWrap.className += " higher";
			}
		} else {
			area.className = area.className.replace('higher', '');
			outWrap.className = outWrap.className.replace('higher', '');
		}
	},
	/* 初始化评论框 */
	initComment: function initComment(e) {
		this.feed = e.detail.feed;
		this.comment = e.detail.comment;
		this.commentType = e.detail.commentType; /* COMMENT, DISCUSS */
		var toPeople = e.detail.toPeople;
		this.setState({ toPeople: toPeople, isShow: true });
		if (e.detail.isVoice) this.setState({ isVoice: true });
	},

	cancelTip: function cancelTip(e) {
		if (Math.abs(e.detail.deltaY) > 50) {
			this.isCancel = true;
		} else {
			this.isCancel = false;
		}
	},

	componentDidMount: function componentDidMount() {

		this.isCancel = false;

		if (window.plus) {
			this.myRecorder = plus.audio.getRecorder();
		}
		var that = this;
		this.hideForm = function () {
			that.setState({ isShow: false });
		};
		window.addEventListener('INIT_FORM', this.initComment);
		window.addEventListener('HIDE_FORM', this.hideForm);
		window.addEventListener('PRESS_START', this.startRecord);
		window.addEventListener('PRESS_END', this.endRecord);

		document.body.addEventListener('drag', this.cancelTip);
	},
	componentWillUnmount: function componentWillUnmount() {
		window.removeEventListener('INIT_FORM', this.initComment);
		window.removeEventListener('HIDE_FORM', this.hideForm);
		window.removeEventListener('PRESS_START', this.startRecord);
		window.removeEventListener('PRESS_END', this.endRecord);
		document.body.removeEventListener('drag', this.cancelTip);
	},
	render: function render() {
		var className = this.state.isShow ? "reply" : "reply hidden";
		var formContent;
		if (!this.state.isVoice) return React.createElement(
			'div',
			{ className: className, id: 'replyForm' },
			React.createElement(
				'div',
				{ className: 'switchBtn', onClick: this.switchToVoice },
				React.createElement('span', { className: 'fa fa-rss' })
			),
			React.createElement('textarea', { type: 'text', name: 'replyText', id: 'replyText', onKeyDown: this.textinput,
				placeholder: this.state.toPeople ? "@" + this.state.toPeople.nickname : "评论", ref: 'textComment' }),
			React.createElement(
				'div',
				{ className: 'sendBtn', onClick: this.submitComment.bind(null, { type: "text" }) },
				'发送'
			)
		);else return React.createElement(
			'div',
			{ className: className + " replyForm" },
			React.createElement(
				'div',
				{ className: 'switchBtn', onClick: this.switchToVoice },
				React.createElement('span', { className: 'fa fa-keyboard-o' })
			),
			React.createElement(
				'div',
				{ className: 'voiceBox', id: 'voiceBox' },
				React.createElement(
					'span',
					null,
					'按住 说话'
				)
			),
			React.createElement('div', { className: 'voiceInput' })
		);
	}
});

var Tag = React.createClass({
	displayName: 'Tag',

	render: function render() {
		var activeClass = this.props.selected ? "active lab" : "lab";
		var clickTag = this.props.clickTag ? this.props.clickTag : function () {};
		return React.createElement(
			'div',
			{ className: activeClass, onClick: clickTag.bind(null, this.props.tag._id) },
			React.createElement('div', { className: 'fa fa-caret-left' }),
			React.createElement('div', { className: 'fa fa-circle' }),
			React.createElement(
				'div',
				{ className: 'rect-tag' },
				this.props.tag.name
			)
		);
	}
});

var TagList = React.createClass({
	displayName: 'TagList',

	clickTag: function clickTag(tagid) {
		console.log('tag id : ' + tagid);
		if (window.plus) {
			var newsView = plus.webview.create('page_news_view.html', 'newsView', { top: 0, height: "39px" });
			plus.nativeUI.showWaiting('加载中');
			setTimeout(function () {
				newsView.evalJS("updateContent('" + tagid + "', '标签文章', 'tagArticle')");
			}, 700);
		}
	},
	render: function render() {
		if (!this.props.tagList || this.props.tagList.length == 0) return React.createElement(
			'div',
			null,
			false
		);
		var that = this;
		var list = this.props.tagList.map(function (tag, i) {
			return React.createElement(Tag, { key: i, tag: tag, clickTag: that.clickTag });
		});
		return React.createElement(
			'div',
			{ className: 'label' },
			list
		);
	}
});
var SelectableTags = React.createClass({
	displayName: 'SelectableTags',

	getInitialState: function getInitialState() {
		return { selectedTags: [] };
	},
	clickTag: function clickTag(tagid) {
		var taglist = this.state.selectedTags;
		if (taglist.indexOf(tagid) != -1) taglist.splice(taglist.indexOf(tagid), 1);else if (taglist.length < 3) taglist.push(tagid);else {
			if (window.plus) plus.nativeUI.toast('最多只能选择3个标签');
		}
		this.setState({ selectedTags: this.state.selectedTags });
	},
	render: function render() {
		var that = this;
		var list = this.props.tagList.map(function (tag, i) {
			return React.createElement(Tag, { key: i, tag: tag, selected: that.state.selectedTags.indexOf(tag._id) != -1, clickTag: that.clickTag });
		});
		return React.createElement(
			'div',
			{ className: 'label' },
			list,
			React.createElement(
				'div',
				{ className: 'nextStep', onClick: this.props.next.bind(null, this.state.selectedTags) },
				'下一步'
			)
		);
	}
});

var TextDialog = React.createClass({
	displayName: 'TextDialog',

	render: function render() {
		var className = "";
		if (this.props.dialogData.isAsker) className = "rect-ask text";else className = "rect-answer text";
		return React.createElement(
			'div',
			{ className: className },
			this.props.dialogData.content
		);
	}
});

var discussText = React.createClass({
	displayName: 'discussText',

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'discussText' },
			this.props.dialogData.content
		);
	}
});

var AudioDialog = React.createClass({
	displayName: 'AudioDialog',

	startCount: function startCount(e) {
		e.preventDefault();
		this.isLongPress = true;
		this.pressStart = Date.now();
		var that = this;
	},
	endCount: function endCount(e) {
		e.preventDefault();
		this.isLongPress = false;
		clearTimeout(this.pressInt);
		if (Date.now() - this.pressStart > 700) {
			/* long press here */
		} else {
				this.play();
			}
	},
	play: function play() {
		var that = this;
		var audioObj = this.props.dialogData;
		var path = audioObj.content || audioObj.localUrl;
		var player = plus.audio.createPlayer(path);

		if (window.page.isPlaying) {
			window.page.player.stop();
		}
		window.page.player = player;
		window.page.isPlaying = true;
		window.page.player.play(function () {
			window.page.isPlaying = false;
		}, function () {
			window.page.isPlaying = false;
		});
	},

	componentDidMount: function componentDidMount() {
		var node = ReactDOM.findDOMNode(this);
		node.addEventListener('tap', this.play);
	},
	componentWillUnmount: function componentWillUnmount() {
		var node = ReactDOM.findDOMNode(this);
		node.removeEventListener('tap', this.play);
	},
	render: function render() {
		var className = "";
		if (this.props.dialogData.isAsker) className = "rect-ask";else className = "rect-answer";
		if (this.props.dialogData.contentType == 'voice') className += " voice";else className += " text";
		var dialog = this.props.dialogData;

		dialog.len = dialog.len || dialog.length;
		var width = (dialog.len > 5000 ? 160 : dialog.len / 50 + 40) + "px";
		return React.createElement('div', { className: className, style: { width: width } });
	}
});

// 对话框 - 可能包含语音||文字
var Dialog = React.createClass({
	displayName: 'Dialog',

	deleteDialog: function deleteDialog() {
		var that = this;

		console.log(JSON.stringify(this.props.dialogData));
		mui.ajax(baseUrl + '/deleteComment/' + this.props.dialogData.commentid, {
			type: "post",
			success: function success(result) {
				var node = ReactDOM.findDOMNode(that);
				if (/discuss/.test(node.parentElement.className)) {
					var payload = {
						index: that.props.index
					};
					var event = new CustomEvent('DELETE_DISCUSS', { detail: payload });
					window.dispatchEvent(event);
				} else {
					var payload = {
						dialogKey: that.props.dialogKey,
						commentKey: that.props.commentKey
					};
					var event = new CustomEvent('DELETE_COMMENT', { detail: payload });
					window.dispatchEvent(event);
				}
			},
			error: function error() {
				console.log('删除错误');
			}
		});
	},
	confirmDelete: function confirmDelete() {
		var that = this;
		if (window.plus) plus.nativeUI.actionSheet({
			title: "选择操作",
			cancel: "取消",
			buttons: [{ title: "删除" }] }, function (e) {
			if (e.index == 1) {

				console.log('删除!!');
				that.deleteDialog();
			}
		});
	},
	componentDidMount: function componentDidMount() {
		var node = ReactDOM.findDOMNode(this);
		node.addEventListener('longtap', this.confirmDelete, false);
	},
	componentWillUnMount: function componentWillUnMount() {
		// var node = ReactDOM.findDOMNode(this);
		// node.removeEventListener('hold', this.confirmDelete);

	},

	render: function render() {
		var dialogContent = this.props.dialogData.contentType == "voice" ? React.createElement(AudioDialog, { dialogData: this.props.dialogData, deleteDialog: this.deleteDialog }) : React.createElement(TextDialog, { dialogData: this.props.dialogData, deleteDialog: this.deleteDialog });
		var lengthTag = this.props.dialogData.contentType == "voice" ? React.createElement(
			'span',
			{ className: 'length' },
			this.props.dialogData.len / 1000 << 0,
			'"'
		) : React.createElement('span', null);

		if (this.props.dialogData.isAsker) {
			return React.createElement(
				'div',
				{ className: 'ask' },
				dialogContent,
				lengthTag,
				React.createElement('div', { className: 'clear' })
			);
		} else {
			return React.createElement(
				'div',
				{ className: 'answer' },
				dialogContent,
				lengthTag,
				React.createElement('div', { className: 'clear' })
			);
		}
	}
});
// 对话列表
var DialogList = React.createClass({
	displayName: 'DialogList',

	render: function render() {
		var that = this;
		var dialogs = this.props.dialogList.map(function (dialog, i) {
			return React.createElement(Dialog, { dialogData: dialog, key: i, commentKey: that.props.commentKey, dialogKey: i });
		});
		return React.createElement(
			'div',
			{ className: 'dialog-contents' },
			dialogs,
			React.createElement('div', { className: 'clear' })
		);
	}
});

/* 精准点评界面 */
var PreciseComment = React.createClass({
	displayName: 'PreciseComment',

	getInitialState: function getInitialState() {
		return { stage: 0, dialogs: [] };
	},
	nextStage: function nextStage(selectedTags) {
		if (selectedTags.length < 1) {
			if (window.plus) plus.nativeUI.toast('请至少选择一个问题标签');else alert('请至少选择一个问题标签');
			return;
		}
		this.selectedTags = selectedTags;
		var payload = { isVoice: true, commentType: "TEACHER_FIRST" };
		var event = new CustomEvent('INIT_FORM', { detail: payload });
		window.dispatchEvent(event);
		this.setState({ stage: 1 });
	},
	finishFirst: function finishFirst() {
		var payload = { commentType: "TEACHER_FIRST", tags: this.selectedTags, dialogs: this.state.dialogs };
		var event = new CustomEvent('SUBMIT_COMMENT', { detail: payload });
		window.dispatchEvent(event);
	},
	/* 这个函数跟CommentBox里面的一样，也是做上传处理用的 */
	uploadMsg: function uploadMsg(msgObj, cb) {
		if (msgObj.type == "text") return cb(msgObj);
		if (!window.plus) return cb(msgObj);
		var task = plus.uploader.createUpload(baseUrl + '/uploadVoice', { method: "GET" }, function (t, status) {
			if (status != 200) return plus.nativeUI.toast('上传语音失败，请重试');

			var replyObj = JSON.parse(t.responseText);
			console.log(t.responseText);
			msgObj.content = replyObj.path;
			cb(msgObj);
		});
		task.addFile(msgObj.localUrl, { key: "voiceFile" });
		task.start();
	},
	/* 将语音数据预上传至服务器 */
	preUploadComment: function preUploadComment(data, index) {
		var that = this;
		mui.ajax(baseUrl + '/addCommentToFeed', {
			type: 'post',
			dataType: "json",
			data: data,
			success: function success(result) {
				var comment = result.newcomment;
				that.state.dialogs[index].sent = true;
				that.state.dialogs[index].commentid = comment._id;
				that.state.dialogs[index].owner = user._id;
				that.state.dialogs[index].isAsker = false;
				that.setState({ dialogs: that.state.dialogs });
			}
		});
	},
	addFirstComment: function addFirstComment(e) {
		var that = this;
		var copyObj = mui.extend({}, e.detail.msgObj);
		copyObj.sent = false;
		copyObj.contentType = copyObj.type;

		that.state.dialogs.push(copyObj);
		var index = that.state.dialogs.length - 1;
		that.setState({ dialogs: that.state.dialogs });

		var data = {};
		that.uploadMsg(copyObj, function () {
			data.commentType = "PRE_ADD_COMMENT";
			data.type = copyObj.type;
			data.len = copyObj.len || 0;
			data.feedid = that.props.feed._id;
			data.content = copyObj.content;
			data.dialogid = null;
			that.preUploadComment(data, index);
		});
	},
	initWhenBack: function initWhenBack() {
		that.setState({ stage: 0 });
	},
	componentDidMount: function componentDidMount() {
		window.addEventListener('ADD_FIRST_COMMENT', this.addFirstComment, false);
		window.addEventListener('DETAIL_BACK', this.initWhenBack, false);
	},
	componentWillUnmount: function componentWillUnmount() {
		window.removeEventListener('DETAIL_BACK', this.initWhenBack);
		window.removeEventListener('ADD_FIRST_COMMENT', this.addFirstComment);
	},
	render: function render() {
		var dialogs = this.state.dialogs.map(function (dialog) {
			return React.createElement(Dialog, { dialogData: dialog });
		});

		var finishBtn = this.state.dialogs.length > 0 ? React.createElement(
			'div',
			{ className: 'nextStep', onClick: this.finishFirst },
			'完成点评'
		) : null;

		var stageContent = this.state.stage == 0 ? React.createElement(
			'div',
			{ className: 'teacher-comments precise' },
			React.createElement(
				'div',
				{ className: 'tips' },
				'该作品存在哪些问题,请您选择1~3个标签'
			),
			React.createElement(SelectableTags, { tagList: this.props.tags, next: this.nextStage }),
			' '
		) : React.createElement(
			'div',
			{ className: 'teacher-comments precise' },
			React.createElement(
				'div',
				{ className: 'tips' },
				'请您对该作品做一些点评'
			),
			React.createElement(DialogList, { dialogList: this.state.dialogs }),
			finishBtn
		);

		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ className: 'teacher-comments-header tips' },
				'点评步骤 (',
				this.state.stage + 1,
				')'
			),
			stageContent
		);
	}
});

var TeacherComment = React.createClass({
	displayName: 'TeacherComment',

	startAsk: function startAsk() {
		var e = new CustomEvent('ZHUIWEN_EVENT', { detail: { comment: this.props.comment } });
		window.dispatchEvent(e);
	},
	replyToStudent: function replyToStudent() {
		var e = new CustomEvent('TEACHER_REPLY_EVENT', { detail: { comment: this.props.comment } });
		window.dispatchEvent(e);
	},
	anonymousDiscuss: function anonymousDiscuss() {
		var e = new CustomEvent('ANONYMOUS_COMMENT');
		window.dispatchEvent(e);
	},
	render: function render() {

		var replyContent;

		if (user && user.role == "TEACHER" && user._id == this.props.comment.commenter._id) {
			replyContent = React.createElement(
				'div',
				{ className: 'control-li', onClick: this.replyToStudent },
				'回答'
			);
		} else if (user && user.role == "STUDENT" && this.props.feed.owner._id == user._id) {
			replyContent = React.createElement(
				'div',
				{ className: 'control-li', onClick: this.startAsk },
				'追问'
			);
		} else {
			replyContent = React.createElement(
				'div',
				{ className: 'control-li', onClick: this.anonymousDiscuss },
				React.createElement('i', { className: 'fa fa-reply' }),
				'   ',
				React.createElement(
					'span',
					null,
					'发表意见'
				)
			);
		}
		return React.createElement(
			'div',
			{ className: 'teacher-comments' },
			React.createElement(
				'div',
				{ className: 'feed' },
				React.createElement(Profile, { user: this.props.comment.commenter }),
				React.createElement(TagList, { tagList: this.props.comment.tags })
			),
			React.createElement(DialogList, { dialogList: this.props.comment.contents, commentKey: this.props.commentKey }),
			React.createElement(
				'div',
				{ className: 'control-ul' },
				replyContent
			)
		);
		return React.createElement('div', null);
	}
});

var TeacherComments = React.createClass({
	displayName: 'TeacherComments',

	render: function render() {
		var comments = this.props.comments;
		if (!comments || comments.length == 0) return null;
		var cs = [];
		var commentTips = React.createElement(
			'div',
			{ className: 'teacher-comments-header tips' },
			'暂无老师点评'
		);
		var commentHeader = Object.keys(comments).length == 0 ? commentTips : React.createElement(
			'div',
			{ className: 'teacher-comments-header' },
			React.createElement(
				'span',
				{ className: 'teacher-num' },
				'名师点评 (',
				"" + Object.keys(comments).length,
				')'
			)
		);
		for (var id in comments) {
			var comment = comments[id];
			cs.push(React.createElement(TeacherComment, { comment: comment, key: id, commentKey: id, feed: this.props.feed }));
		}
		return React.createElement(
			'div',
			null,
			commentHeader,
			cs
		);
	}
});

var DiscussItem = React.createClass({
	displayName: 'DiscussItem',

	componentDidMount: function componentDidMount() {
		var node = ReactDOM.findDOMNode(this);
		node.addEventListener('tap', this.vokeDiscuss);
	},
	componentWillUnmount: function componentWillUnmount() {
		var node = ReactDOM.findDOMNode(this);
		node.removeEventListener('tap', this.vokeDiscuss);
	},
	vokeDiscuss: function vokeDiscuss(e) {
		var payload = {};
		payload.comment = e.detail.comment;
		payload.commentType = "DISCUSS";
		payload.toPeople = this.props.comment.commenter;

		/* 用这些数据来初始化输入框 */
		var event = new CustomEvent('START_DISCUSS', { detail: payload });
		window.dispatchEvent(event);
	},
	render: function render() {
		console.log(JSON.stringify(this.props.comment));
		var time = Service.HQDate(this.props.comment.commenter.editTime);
		return React.createElement(
			'div',
			null,
			React.createElement(DiscussColumn, { time: time, comment: this.props.comment })
		);
	}

});
var DiscussList = React.createClass({
	displayName: 'DiscussList',

	render: function render() {
		var list = this.props.discussList.map(function (item, i) {
			return React.createElement(DiscussItem, { comment: item, key: i, index: i });
		});
		var commentHeader = this.props.discussList.length > 0 ? React.createElement(
			'div',
			{ className: 'teacher-comments-header' },
			React.createElement(
				'span',
				{ className: 'teacher-num' },
				'网友点评'
			)
		) : null;
		return React.createElement(
			'div',
			{ className: 'discussList' },
			commentHeader,
			list
		);
	}
});

/* CommentBox 整个点评的框架 */
var CommentBox = React.createClass({
	displayName: 'CommentBox',

	getInitialState: function getInitialState() {
		return {
			feed: null, comments: [], discussList: [], showReply: false, pastingTags: false
		};
	},
	startZhuiwen: function startZhuiwen(e) {
		var payload = {};
		payload.comment = e.detail.comment;
		payload.feed = this.state.feed;
		payload.commentType = 'STUDENT_REPLY';
		payload.toPeople = payload.comment.commenter;

		/* 用这些数据来初始化输入框 */
		var event = new CustomEvent('INIT_FORM', { detail: payload });
		window.dispatchEvent(event);
	},
	replyToStudent: function replyToStudent(e) {
		var payload = {};
		payload.comment = e.detail.comment;
		payload.feed = this.state.feed;
		payload.commentType = "TEACHER_REPLY";
		payload.toPeople = payload.feed.owner;

		/* 用这些数据来初始化输入框 */
		var event = new CustomEvent('INIT_FORM', { detail: payload });
		window.dispatchEvent(event);
	},
	startDiscuss: function startDiscuss(e) {
		var payload = {};
		payload.comment = e.detail.comment;
		payload.feed = this.state.feed;
		payload.commentType = "DISCUSS";
		console.log('[startDicuss] INIT_FORM : ' + e.detail.toPeople._id);
		payload.toPeople = e.detail.toPeople;

		/* 用这些数据来初始化输入框 */
		var event = new CustomEvent('INIT_FORM', { detail: payload });
		window.dispatchEvent(event);
	},
	/* 点击顶部的点评按钮进行点评 */
	anonymousComment: function anonymousComment(e) {

		var payload = {};
		var feed = payload.feed = this.state.feed;

		if (user && user._id == feed.owner._id) {
			/* 假如是画的主人,就会变成DISCUSS */
			payload.commentType = 'DISCUSS';
			payload.toPeople = null;
			/* 用这些数据来初始化输入框 */
			var event = new CustomEvent('INIT_FORM', { detail: payload });
			window.dispatchEvent(event);
		} else if (user && user.role.toUpperCase() == 'STUDENT') {
			/* 假如不是画主人,但是是学生,那还将会是DISCUSS */
			payload.commentType = 'DISCUSS';
			payload.toPeople = this.state.feed.owner;
			/* 用这些数据来初始化输入框 */
			var event = new CustomEvent('INIT_FORM', { detail: payload });
			window.dispatchEvent(event);
		} else if (user && user.role.toUpperCase() == 'TEACHER') {
			/* 假如不是画主人，评论者是老师 */
			if (this.state.comments[user._id]) {
				/* 已点评过  继续接着上次的进行点评 */
				payload.commentType = 'TEACHER_REPLY';
				payload.toPeople = this.state.feed.owner;
				payload.comment = this.state.comments[user._id];
				/* 用这些数据来初始化输入框 */
				var event = new CustomEvent('INIT_FORM', { detail: payload });
				window.dispatchEvent(event);
			} else {
				/* 还未点评过 启动精评程序 */
				payload.commentType = 'TEACHER_FIRST';
				payload.toPeople = this.state.feed.owner;
				this.setState({ pastingTags: true });
			}
		}
	},
	deleteComment: function deleteComment(e) {
		var dialogKey = e.detail.dialogKey;
		var commentKey = e.detail.commentKey;
		this.state.comments[commentKey].contents.splice(+dialogKey, 1);
		this.setState({ comments: this.state.comments });
	},
	deleteDiscuss: function deleteDiscuss(e) {
		var index = e.detail.index;
		this.state.discussList.splice(+index, 1);
		this.setState({ discussList: this.state.discussList });
	},

	/* 上传语音以获取远程地址 */
	uploadMsg: function uploadMsg(msgObj, cb) {
		if (msgObj.type == "text") return cb(msgObj);
		if (!window.plus) return cb(msgObj);
		var task = plus.uploader.createUpload(baseUrl + '/uploadVoice', { method: "GET" }, function (t, status) {
			console.log('voice upload status ' + status);
			if (status != 200) return plus.nativeUI.toast('上传语音失败，请重试');

			var replyObj = JSON.parse(t.responseText);
			console.log(t.responseText);
			msgObj.content = replyObj.path;
			cb(msgObj);
		});
		task.addFile(msgObj.localUrl, { key: "voiceFile" });
		task.start();
	},
	/* 发送comment到服务器进行保存 */
	updateComment: function updateComment(data, index) {
		var that = this;
		mui.ajax(baseUrl + '/addCommentToFeed', {
			type: 'post',
			dataType: "json",
			data: data,
			success: function success(result) {

				if (/REPLY/.test(data.commentType)) {
					var comment = result.newcomment;
					that.state.comments[comment.commenter].contents[index].sent = true;
					that.state.comments[comment.commenter].contents[index].commentid = comment._id;
					that.state.comments[comment.commenter].contents[index].owner = user._id;
					that.setState({ comments: that.state.comments });
					if (window.plus) plus.nativeUI.toast('回复成功');
				} else if (/TEACHER_FIRST/.test(data.commentType)) {
					/* 恢复正常流览模式 */
					that.setState({ pastingTags: false });
					var commentList = result.comments;
					var commentObj = {};
					commentObj.commenter = user;
					commentObj.dialogid = commentList[0].dialogid;
					commentObj.tags = commentList[0].tags;
					commentObj.contents = [];
					for (var i = 0; i < commentList.length; i++) {
						commentObj.contents[i] = commentList[i].content;
						commentObj.contents[i].commentid = commentList[i]._id;
						commentObj.contents[i].owner = commentList[i].owner;
					}
					that.state.comments[user._id] = commentObj;
					that.setState({ comments: that.state.comments });
					if (window.plus) plus.nativeUI.toast('点评成功');
				} else if (/DISCUSS$/.test(data.commentType)) {
					var discussList = that.state.discussList;
					discussList[index].sent = true;
					that.setState({ discussList: discussList });
					if (window.plus) plus.nativeUI.toast('讨论发表成功');
				}
			}
		});
	},
	/* replyForm里面传过来值，已经单击发送按钮了 */
	/* 先将内容显示在界面的相应位置，再进行上传 */
	submitComment: function submitComment(e) {
		var msgObj = e.detail.msgObj || {};
		var comment = e.detail.comment || {};
		var commentType = e.detail.commentType;
		var toPeople = e.detail.toPeople;

		var that = this;

		var data = {};
		data.commentType = commentType;

		msgObj.sent = false;
		var index; /* 插入新条目的下标 */
		if (commentType == "STUDENT_REPLY") {
			msgObj.isAsker = true;
			msgObj.owner = user._id;
			msgObj.contentType = msgObj.type;
			this.state.comments[comment.commenter._id].contents.push(msgObj);
			index = this.state.comments[comment.commenter._id].contents.length - 1;
			this.setState({ comments: this.state.comments });

			this.uploadMsg(msgObj, function (msg) {
				data.type = msg.type;
				data.content = msg.content;
				data.dialogid = comment.dialogid;
				data.feedid = that.state.feed._id;
				data.commenter = comment.commenter._id;
				data.len = msg.len || 0; /* 音频长度, 不能用length */

				that.updateComment.call(that, data, index);
			});
		} else if (commentType == "TEACHER_REPLY") {
			msgObj.isAsker = false;
			msgObj.owner = user._id;
			msgObj.contentType = msgObj.type;
			this.state.comments[comment.commenter._id].contents.push(msgObj);
			index = this.state.comments[comment.commenter._id].contents.length - 1;
			this.setState({ comments: this.state.comments });

			this.uploadMsg(msgObj, function (msg) {
				data.type = msg.type;
				data.content = msg.content;
				data.dialogid = comment.dialogid;
				data.feedid = that.state.feed._id;
				data.commenter = comment.commenter._id;
				data.len = msg.len || 0;

				that.updateComment.call(that, data, index);
			});
		} else if (commentType == "TEACHER_FIRST") {
			var dialogs = e.detail.dialogs;
			var d_ids = [];
			for (var i = 0; i < dialogs.length; i++) {
				d_ids.push(dialogs[i].commentid);
			}
			data.tags = e.detail.tags;
			data.dialogs = d_ids;
			data.feedid = that.state.feed._id;
			that.updateComment.call(that, data);
		} else if (/DISCUSS$/.test(commentType)) {
			msgObj.owner = user;
			msgObj.contentType = msgObj.type;
			msgObj.commenter = user;
			msgObj.toPeople = toPeople ? toPeople._id : this.state.feed.owner._id;

			this.state.discussList.push(msgObj);
			index = this.state.discussList.length - 1;
			this.setState({ discussList: this.state.discussList });

			this.uploadMsg(msgObj, function (msg) {
				data.type = msg.type;
				data.content = msg.content;
				data.feedid = that.state.feed._id;
				data.commenter = user._id;
				data.len = msg.len || 0;
				data.toPeople = msgObj.toPeople;

				console.log('[submitComment]  data : ' + JSON.stringify(data));

				that.updateComment.call(that, data, index);
			});
		}
	},
	componentDidMount: function componentDidMount() {
		window.addEventListener('ADD_LIKE', FeedCollection.updateFeed.bind(this));
		window.addEventListener('ADD_FAVOUR', FeedCollection.updateFeed.bind(this));
		window.addEventListener('ZHUIWEN_EVENT', this.startZhuiwen);
		window.addEventListener('TEACHER_REPLY_EVENT', this.replyToStudent);
		window.addEventListener('START_DISCUSS', this.startDiscuss);
		window.addEventListener('ANONYMOUS_COMMENT', this.anonymousComment);
		window.addEventListener('DELETE_COMMENT', this.deleteComment);
		window.addEventListener('DELETE_DISCUSS', this.deleteDiscuss);
		window.addEventListener('SUBMIT_COMMENT', this.submitComment);
	},
	componentWillUnmount: function componentWillUnmount() {
		window.removeEventListener('ADD_LIKE', FeedCollection.updateFeed.bind(this));
		window.removeEventListener('ADD_FAVOUR', FeedCollection.updateFeed.bind(this));
		window.removeEventListener('ZHUIWEN_EVENT', this.startZhuiwen);
		window.removeEventListener('TEACHER_REPLY_EVENT', this.replyToStudent);
		window.removeEventListener('START_DISCUSS', this.startDiscuss);
		window.removeEventListener('ANONYMOUS_COMMENT', this.anonymousComment);
		window.removeEventListener('DELETE_COMMENT', this.deleteComment);
		window.removeEventListener('DELETE_DISCUSS', this.deleteDiscuss);
		window.removeEventListener('SUBMIT_COMMENT', this.submitComment);
	},
	render: function render() {
		var preciseComment = this.state.pastingTags ? React.createElement(PreciseComment, { feed: this.state.feed, tags: this.state.tags }) : null;

		var commentContent = !this.state.pastingTags ? React.createElement(TeacherComments, { comments: this.state.comments, feed: this.state.feed }) : null;
		return React.createElement(
			'div',
			null,
			React.createElement(Feed, { feed: this.state.feed, noDianpingBtn: false }),
			preciseComment,
			commentContent,
			this.state.pastingTags ? null : React.createElement(DiscussList, { discussList: this.state.discussList }),
			React.createElement(ReplyForm, { isShow: this.state.showReply }),
			React.createElement(RecordCountBox, null)
		);
	}
});

//网友评论标签
var DiscussColumn = React.createClass({
	displayName: 'DiscussColumn',

	render: function render() {
		var picUrl = "../img/logo.png";
		if (this.props.comment.commenter.photo) {
			var imgname = this.props.comment.commenter.photo.split('/');
			imgname = imgname[imgname.length - 1];
			picUrl = "http://yibao.img-cn-beijing.aliyuncs.com/" + imgname + "@1e_1c_0o_0l_120h_120w_100q";
		}
		return React.createElement(
			'div',
			{ className: 'discuss-column' },
			React.createElement(
				'div',
				{ className: 'discuss-head' },
				React.createElement('img', { src: picUrl, width: '100%' })
			),
			React.createElement(
				'div',
				{ className: 'discuss-profile' },
				React.createElement(
					'div',
					{ className: 'discuss-name' },
					this.props.comment.commenter.nickname
				),
				React.createElement(
					'div',
					{ className: 'discuss-time' },
					this.props.time
				)
			),
			React.createElement(
				'div',
				{ className: 'discuss-comment' },
				this.props.comment.content
			)
		);
	}
});
// var CommentFunc = {
// 	inputFinish : function() {

// 	},
// 	startDianping : function() {
// 		/* 评断一下来者何人 */
// 		Service.getUser(function(err, user) {
// 			globalUser = user;
// 			console.log('User Role : ', user.role);
// 			if(!user || !user.role)
// 				return;

// 			/* 如果是老师则弹出精准点评界面 */
// 			if(user.role.toLowerCase() == 'teacher'){
// 				/* 检测老师是否已点评过 */
// 				if(commentList.state.comments[user._id]){
// 					/* 继续对上次的dialog进行点评 */
// 					replyform.setState({
// 						isShow : true,
// 						toPeople : feed.state.feed.owner,
// 						isVoice : true
// 					});					
// 				}else{
// 					/* 展开一个有标签列表的卡片 */

// 				}			
// 			}else if (user.role.toLowerCase() == 'student'){
// 				replyform.setState({
// 					isShow : true,
// 					toPeople : null,
// 					isVoice : true,
// 					submitCommentCB : commentCB
// 				});
// 			}			
// 		});

// 	},
// 	startDiscuss : function() {

// 	}	
// };
/* <div className="control-li">+关注</div>
<div className="control-li">献花</div> */