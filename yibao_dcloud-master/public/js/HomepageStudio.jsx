var StudioCatalogue = React.createClass({
	HandleClickBrief : function(){
		var webview = plus.webview.create('../views/page_brief','brief');
		webview.evalJS("setUser('"+this.props.user+"')");
	},
	HandleClickEnvir : function(){
		var webview = plus.webview.create('../views/page_environment');
		webview.evalJS("setUser('"+this.props.user+"')");
	},
	HandleClickProgress : function(){
		var webview = plus.webview.create('../views/page_progress');
		webview.evalJS("setUser('"+this.props.user+"')");
	},
	render : function(){
		return <div className="catalogue">
          			<div className="left horizontal" onClick={this.HandleClickBrief}>
            			<div className="image studio-brief"></div>
            			<br/>
            			<span>画室简介</span>
          			</div>
         			<div className="center horizontal" onClick={this.HandleClickEnvir}>
            			<div className="image environment"></div>
            			<br/>
            			<span>教学环境</span>
          			</div>
          			<div className="right horizontal" onClick={this.HandleClickProgress}>
            			<div className="image progress"></div>
            			<br/>
            			<span>教学成果</span>
          			</div>
        		</div>
	}
});
var WorkStudioContent = React.createClass({
	getInitialState : function(){
		return {imgUrls : this.props.works};
	},
	render : function(){
		var works = this.state.imgUrls.map(function(one,i){
			return <img src={one.url} />;
		});
		return 	<div className="work-display">
					<StudioTitle/>
					<div>{works}</div>
				</div>;
	}
});

var StudioTitle = React.createClass({
	getInitialState : function(){
		return {};
	},
	render : function(){
		return <div className="title">
     			   	<div className="photo icon">
    			  	</div>
   	 			    <span className="work-show left">作品展示</span>
 	      			 <span className="edit right" >编辑</span>
   	   			</div>
	}
});

var DisplayTeachers = React.createClass({
	getInitialState : function(){
		return {teachers : this.props.teachers};
	},
	render : function(){
		var teachersinfo = this.state.teachers.map(function(one,i){
			return 		<div className="teacher-info">
              				<img src={one.url} width="100%"/>
            				<br/>
              				<div className="name">{one.nickname}</div>
            			</div>;
		});
		return  <div className="work-display">
          			<div className="title">
            			<div className="photo icon">
            			</div>
            			<span className="work-show left">师资队伍</span>
            			<span className="edit right">编辑</span>
          			</div>
          			<div className="work-content-teacher">
            			{teachersinfo}
          			</div>
        		</div>;
	}
});

var HomepageStudio = React.createClass({
	getInitialState : function(){
		return {user : this.props.user,
				teachers : [],
				works : []};
	},
	componentDidMount : function(){
		mui.ajax({
			url : "http://yibao.coding.io/HotTeacher/"+'56320e949dd245b85ebe26e6',
			type: 'get',
			dataType : 'json',
			success : function(data){
				this.setState({userlist : data.teacher_works});
			}.bind(this)
		});
		var self = this;
	},
	render : function(){
		return 	<div>
					<HomeCard user={this.props.user}/>
					<div className="studio">
						<div className="display">
						<StudioCatalogue user={this.props.user}/>
						<div className="work-display">
							<StudioTitle/>
							<WorkStudioContent works={this.state.works}/>
						</div>
					</div>
					</div>
				</div>;
	}
});