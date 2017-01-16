var WorkTeacherContent = React.createClass({
	getInitialState : function(){
		return {imgUrls : this.props.works};
	},
	render : function(){
		var works = this.state.imgUrls.map(function(one,i){
			return <img src={one.url} key={i} width="100%"/>;
		});
		return 	<div className="work-display">
					<TeacherTitle/>
					<div className="work-content">{works}</div>
				</div>;
	}
});

var TeacherTitle = React.createClass({
	getInitialState : function(){
		return {};
	},
	render : function(){
		return <div className="title">
     			   	<div className="photo icon">
    			  	</div>
   	 			    <span className="work-show left">作品展示</span>
   	   			</div>
	}
});

var TeacherDisplay = React.createClass({
	getInitialState : function(){
		return {user : this.props.user};
	},
	render : function(){
		return  <div className="work-display">
      <div className="title">
        <div className="list icon">
        </div>
        <span className="left">基本信息</span>
      </div>
      <div className="work-content info">
        <div className="column">
         <div className="column-title">毕业院校：</div>
         <div className="column-content">{this.state.user.graduate}</div>
        </div>
        <div className="column">
          <div className="column-title">教学经验：</div>
          <div className="column-content">{this.state.user.experience}</div>
        </div>
        <div className="column">
          <div className="column-title">教学对象：</div>
          <div className="column-content">{this.state.user.objects}</div>
        </div>
        <div className="column">
          <div className="column-title">常驻地址：</div>
          <div className="column-content">{this.state.user.address}</div>
        </div>
      </div>
    </div>
	}
});
var Alltag = React.createClass({
	getInitialState : function(){
		return {
				alltag: this.props.alltag
		};
	},
	render : function(){
		return <div>
		          <div className="tag">{this.state.alltag.name}</div>
		          <span className="fa-stack fa-lg">
		            <i className="fa fa-circle fa-stack-2x"></i>
		            <i className="fa fa-check fa-stack-1x fa-inverse"></i>
		          </span>
		        </div>;
	}
});
var WorkSpeciality = React.createClass({
	getInitialState : function(){
		return {tags:this.props.user.tags};
	},
	render : function(){
		var allTags = this.state.tags.map(function(one,i){
			return <Alltag alltag={one}/>;
		});
		return 	<div className="work-display">
					<div className="title">
       					<div className="speciality icon"></div>
        				<span className="teacher-speciality left">教学特长</span>
    				</div>
     				{allTags}
				</div>;
	}
});
var HomepageTeacher = React.createClass({
	getInitialState : function(){
		return {user : this.props.user,
				works : this.props.works};
	},
	render : function(){
		return 	<div>
					<HomeCard user={this.props.user}/>
					<WorkTeacherContent works={this.props.works}/>
					<TeacherDisplay user={this.props.user}/>
					<WorkSpeciality user={this.props.user}/>
				</div>
	}
});