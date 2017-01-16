var StudioCatalogue = React.createClass({
	getInitialState : function(){
		return {};
	}, 
	HandleClick : function(){
		//画室简介
		console.log("画室简介");
	},
	render : function(){
		return <div className="catalogue" onClick={this.HandleClick}>
          			<div className="left horizontal">
            			<div className="image studio-brief"></div>
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
   	   			</div>
	}
});

var DisplayTeachers = React.createClass({
	getInitialState : function(){
		return {teachers : this.props.teachers};
	},
	HandleClick : function(){
		console.log("老师简介");
	},
	render : function(){
		var teachersinfo = this.state.teachers.map(function(one,i){
			return 		<div className="teacher-info" onClick={HandleClick}>
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
		console.log("getWorks");
		mui.ajax({
			url : "",
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
						<div className="display">
						<StudioCatalogue/>
						<div className="work-display">
							<StudioTitle/>
							<WorkStudioContent works={this.state.works}/>
						</div>
					</div>
				</div>;
	}
});