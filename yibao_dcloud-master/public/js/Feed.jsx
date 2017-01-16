//Here is a Feed component, including all of its behaviour functions.


//用户的标题，可以重复被利用，在各种有用户的地方
// props : user = 用户信息
var Profile = React.createClass({
    render : function(){
	var classNo = this.props.user.degree ? <div className="classNo">（{this.props.user.degree}）</div>
		: <div></div>;
	    return <div className="info profile" data-role={this.props.user.role} data-userid={this.props.user._id}>
		    <div className="head">
			    <Imgx src={this.props.user.photo ? this.props.user.photo : "../img/logo.png"}/>
		    </div>
		    <div className="data">
			    <div className="upper">
				    <div className="name">{this.props.user.nickname}</div>
				    {classNo}
			    </div>
			    <div className="down">
				    <div className="province">{this.props.user.address}</div>
				    <div className="city">{this.props.user.city}</div>
			    </div>
		    </div>
	    </div>;
    }
});


// 一个feed的整体内容
var FeedContent = React.createClass({
    startDianping : function() {
        var event = new CustomEvent('ANONYMOUS_COMMENT');
	window.dispatchEvent(event);
    },
    render : function(){
	
	var {feed, noDianpingBtn,feedAddingLike, feedAddingFavour} = this.props;
	
	var tags = feed.tags.map(function(tag,i){
	    return <span key={i}>{tag.name}</span>;
	});
	var dianpingBtn = noDianpingBtn ? null : <div className="comments" onClick={this.startDianping}>
		<span className="fa fa-edit">开始点评</span>
		</div>;

	var commentClass = noDianpingBtn ? " listview" : "";
	
	var imgTag = feed.picUrl && (feed.picUrl != 'undefined') ?
		(noDianpingBtn ? <img src={feed.picUrl} /> :
		 <img src={feed.picUrl} data-preview-src="" data-preview-group="1" />)
	    : null;
	
	return 	<div className="card" id={feed._id}>
	    <Profile user={feed.owner}/>
	    <div className="works">
	    <div className="image">
	    {imgTag}
	</div>
	    <div className="text">{feed.content}</div>
	    </div>
	    <div className="category">
	    <i className="fa fa-tag"></i>
	    <span className="tag">{tags}</span>
	    </div>
	    <div className= {"comment" + commentClass}>
	    <div className="pageview">
	    <i className="fa fa-eye"></i>
	    <span> {feed.viewNum}</span>
	    </div>
	    <div className={feed.isDianzan ? "love up":"love"} onClick={feedAddingLike}>
	    <i className="fa fa-thumbs-o-up"></i>
	    <span> {feed.kudoNum}</span>
	    </div>
	    <div className={feed.isFavour ? "collection up":"collection"} onClick={feedAddingFavour}>
	    <i className="fa fa-star"></i>
	    <span> {feed.favourNum}</span>
	    </div>		
	    {dianpingBtn}
	</div>
	    </div>;
    }
});

var Feed = React.createClass({
    addLike : function(event) {
        event.stopPropagation();
	var feed = this.props.feed;
	var that = this;
	var url = '/setDianzan';
	if(feed.isDianzan)
	    url = '/cancelDianzan';
	mui.ajax({
	    url : baseUrl + url,
	    type : "post",
	    data : {
		id : feed._id,
		type : 'feed'
	    },
	    success : function(result) {
		if(window.plus)
		    plus.nativeUI.toast(feed.isDianzan ?'取消成功' : '点赞成功!');
		if(feed.isDianzan)
		    feed.kudoNum --;
		else
		    feed.kudoNum ++;
		feed.isDianzan = !feed.isDianzan;
		var e = new CustomEvent('ADD_LIKE', {'detail': {feed : feed, feedKey : that.props.feedKey}});
		window.dispatchEvent(e);
	    }
	});
	return true;
    },
    addFavour : function(event) {
	event.stopPropagation();
        var feed = this.props.feed;
	if(feed.isFavour){
	    if(window.plus){
		return plus.nativeUI.toast('已在收藏夹中了');
	    }
	    return true;
	}
	var that = this;
	mui.ajax({
	    url : baseUrl + "/setFavour",
	    type : "post",
	    data : {
		id : feed._id,
		type : 'feed'
	    },
	    success : function(result) {
		if(window.plus)
		    plus.nativeUI.toast('收藏成功!');
		else
		    console.log('Like success');
		feed.favourNum ++;
		feed.isFavour = true;
		var e = new CustomEvent('ADD_LIKE', {'detail': {feed : feed, feedKey : that.props.feedKey}});
		window.dispatchEvent(e);		
	    }
	});
	return true;
    },
    render : function(){
	var {feed,  noDianpingBtn, startDianping} = this.props;
	if(feed){
	    return <div className="feed">
		<FeedContent feed={feed} 
	    feedAddingLike={this.addLike}
	    feedAddingFavour={this.addFavour}
	    noDianpingBtn={noDianpingBtn}
	    startDianping={startDianping}/>
		</div>;
	}else return null;
    }
});

// Feed 列表
var FeedList = React.createClass({
    getInitialState : function() {
        return {feedList : []};
    },
    componentDidMount : function() {
	window.addEventListener('ADD_LIKE', FeedCollection.updateFeed.bind(this));
	window.addEventListener('ADD_FAVOUR', FeedCollection.updateFeed.bind(this));
    },
    componentDidUnmount : function() {
        window.removeEventListener('ADD_LIKE');
	window.removeEventListener('ADD_FAVOUR');
    },
    render : function(){
	var self = this;
	var list = this.state.feedList.map(function(one){
		return <Feed feed={one} key={one._id}  feedAddingLike={self.feedAddingLike}
			       feedAddingFavour={self.feedAddingFavour}  noDianpingBtn={true} />;
	});
	return <div>{list}</div>;
    }
});

var FeedCollection = {
    updateFeed : function(e) {
        var feed = e.detail.feed;
	var feedKey = e.detail.feed;
	for(var i in this.state.feedList){
	    if(this.state.feedList[i]._id == feedKey)
		this.state.feedList[i] = feed;
	}
	this.setState({feedList : this.state.feedList});
    }
};
