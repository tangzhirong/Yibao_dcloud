var Cate = React.createClass({
	getInitialState : function(){
		return {user : this.props.user};
	},
	render : function(){
		var invitation = this.state.user.role == "student"? "老师点评" : "收到邀请";
		return <div class="container">
			    <div class="main-content">
			      <div class="line-column invitation">
			        <div class="icon" id ="icon">
			        </div>
			        <span>{invitation}</span>
			        <i class="fa fa-angle-right">
			        </i>
			        <div class="line"></div>
			      </div>
			      <div class="line-column publish">
			        <div class="icon" id ="icon">
			        </div>
			        <span>我的发布</span>
			        <i class="fa fa-angle-right">
			        </i>
			        <div class="line"></div>
			      </div>
			      <div class="line-column comment">
			        <div class="icon" id ="icon">
			        </div>
			        <span>收到评论</span>
			        <i class="fa fa-angle-right">
			        </i>
			        <div class="line"></div>
			      </div>
			      <div class="line-column homepage">
			        <div class="icon" id ="icon">
			        </div>
			        <span>我的主页</span>
			        <i class="fa fa-angle-right">
			        </i>
			        <div class="line"></div>
			      </div>
			      <div class="line-column message">
			        <div class="icon" id ="icon">
			        </div>
			        <span>艺宝通知</span>
			        <i class="fa fa-angle-right">
			        </i>
			      </div>
			    </div>
			    <div class="mine-content">
			      <div class="line-column favour">
			        <div class="icon" id ="icon">
			        </div>
			        <span>我的收藏</span>
			        <i class="fa fa-angle-right">
			        </i>
			        <div class="line"></div>
			      </div>
			      <div class="line-column attention">
			        <div class="icon" id ="icon">
			        </div>
			        <span>我的关注</span>
			        <i class="fa fa-angle-right">
			        </i>
			        <div class="line"></div>
			      </div> 
			      <div class="line-column fans">
			        <div class="icon" id ="icon">
			        </div>
			        <span>我的粉丝</span>
			        <i class="fa fa-angle-right">
			        </i>
			      </div> 
			    </div>
			  </div>
	}
});
