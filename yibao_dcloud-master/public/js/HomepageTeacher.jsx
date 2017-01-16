var WorkTeacherContent = React.createClass({
	getInitialState : function(){
		return {works : [],
				user : this.props.user};
	},
	componentDidMount : function(){
		var that = this;
		mui.ajax({
			url : baseUrl + "/allWorks/"+this.props.user._id,
			type : "get",
			success : function(data){
				console.log(314);
				var worklist = data.worklist;
				if(worklist.length > 5){
					worklist = worklist.slice(0,4);
				}
				that.setState({works : worklist});
			},error : function(err){
				console.log("网络错误");
			}
		});
	},
	render 	: function(){
		console.log(23);
		
		var works = this.state.works.map(function(one,i){
			var imgUrl = one.picUrl.split('/');
			var imgname = imgUrl[imgUrl.length-1];
			return <img className="work" id = {one._id} src={"http://yibao.img-cn-beijing.aliyuncs.com/"+imgname+"@1e_1c_0o_0l_240h_240w_100q"} key={i} width="100%"/>;
		});
		return 	<div className="work-display">
					<TeacherTitle editable={this.props.editable}/>
					<div className="work-content">{works}</div>
				</div>;
	}
});

var TeacherTitle = React.createClass({
	render : function(){
		var edit = this.props.editable ? <span className="edit right" >编辑</span> :  null;
		
		return <div className="title">
     			   		<div className="photo icon">
    			  		</div>
   	 				<span className="work-show left">作品展示</span>
					{edit}
   	   	</div>;
	}
});

var TeacherDisplay = React.createClass({
	getInitialState : function(){
		return {user : this.props.user};
	},
	save : function() {
		user.graduate_school = this.refs.graduate_school.value;
		user.experience = this.refs.experience.value;
		user.teaching_object = this.refs.teaching_object.value;
		user.address_often = this.refs.address_often.value;
		
		Service.saveToLocal(user);
		console.log(JSON.stringify(user));
		plus.nativeUI.toast('保存成功');
		var event = new CustomEvent('MODIFY_USER');
		window.dispatchEvent(event);
	},
	render : function(){
		return  <div className="work-display">
      <div className="title">
        <div className="list icon">
        </div>
        <span className="left">基本信息</span>
	{this.props.editable ? <span className="edit right" onClick={this.save}>保存</span> : null}
      </div>
      <div className="work-content info">
        <div className="column">
         <div className="column-title">毕业院校：</div>
         <input type="text" className="column-content" 
		 onblur="save()" placeholder="您的院校" disabled={!this.props.editable}
		 ref="graduate_school"
		 defaultValue={this.props.editable ? (this.props.user.graduate_school) : (this.props.user.graduate_school || "暂未填写")  }/>
        </div>
        <div className="column">
          <div className="column-title">教学经验：</div>
          <input type="text" className="column-content" disabled={!this.props.editable}
		  onblur="save()" placeholder="教学经验"
		  ref="experience"
		  defaultValue={this.props.editable ? (this.props.user.experience) : (this.props.user.experience || "暂未填写")  }/>
        </div>
        <div className="column">
          <div className="column-title">教学对象：</div>
          <input type="text" className="column-content"  disabled={!this.props.editable}
		  onblur="save()" placeholder="教学对象" 
		  ref="teaching_object"
	  	  defaultValue={this.props.editable ? (this.props.user.teaching_object) : (this.props.user.teaching_object || "暂未填写")  }/>
        </div>
        <div className="column">
          <div className="column-title">常驻地址：</div>
          <input type="text" className="column-content" disabled={!this.props.editable}
		  onblur="save()" placeholder="您的住址" 
		  ref="address_often"
		  defaultValue={this.props.editable ? (this.props.user.address_often) : (this.props.user.address_often || "暂未填写")  }/>
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
	alltagSelect : function(){
		var alltag = this.state.alltag;
		alltag.isSelected = !alltag.isSelected;
		this.setState({alltag:alltag});
		this.props.selected(this.state.alltag);
	},
	render : function(){
		var selectClass = this.state.alltag.isSelected?'fa fa-circle fa-stack-2x selected' : 'fa fa-circle fa-stack-2x noselected';
		return <div className="tag-rect" onClick={this.alltagSelect}>
          <div className="tag">{this.state.alltag.name}</div>
          <span className="fa-stack fa-lg">
            <i className={selectClass}></i>
            <i className="fa fa-check fa-stack-1x fa-inverse"></i>
          </span>
        </div>;
	}
})
var WorkSpeciality = React.createClass({
	getInitialState : function(){
		
		return {alltags:this.props.alltags,
				tags:this.props.user.tags,
				isEdit:false};
	},
	specialityEdit : function(){
		this.setState({isEdit:!this.state.isEdit});

		if(this.state.isEdit)
		{
			var newtags = [];
			var newtagsid = [];
			for(var i = 0;i< this.state.alltags.length;i++)
			{
				var alltag_i = this.state.alltags[i];
				if(alltag_i.isSelected == true){
					newtags.push(alltag_i.name);
					newtagsid.push(alltag_i._id);
				}
			}
			this.setState({tags : newtags});
			var user = Service.getLocalUser();
			user.tags = newtagsid;
			
			Service.saveToRemote(user);
		}
		else this.initialAlltags();
			
	},
	initialAlltags : function(){
		for(var i = 0;i < this.state.alltags.length; i++)
		{
			this.state.alltags[i].isSelected = false;
			for(var j = 0;j < this.state.tags.length; j++)
			{
				var tags_j = this.state.tags[j];
				if(this.state.alltags[i].name == tags_j)
					this.state.alltags[i].isSelected = true;
			}
		}
	},
	componentDidMount : function(){
		this.initialAlltags();
	},
	selected : function(alltag){
		for(var i = 0;i < this.state.alltags.length; i++)
		{
			var alltags = this.state.alltags;
			var alltag_i = alltags[i];
			if(alltag.name == alltag_i.name)
			{
				var newtags = this.state.alltags;
				newtags[i] = alltag;
				this.setState({alltags : newtags});
				break;
			}
		}
	},
	render : function(){
		var that = this;
		var editable = this.props.editable;
		var edit = this.state.isEdit? "完成":"编辑";
		var tagMap = {
			'5643424a95804f136d5adeb2' : "色彩",
			'5643424a95804f136d5adeb3' : "素描",
			'56555a3c65436f3c714f8246' : "速写"
		};
		
		var teacherTags = this.state.tags.map(function(one,i){
				return <div className="tag-rect">
   					       <div className="tag" key={i}>{one.length>3 ? tagMap[one] : one}</div>
						</div>;
		});
		var allTags = this.state.alltags.map(function(one,i){
			return <Alltag alltag={one} key={i} selected={that.selected}/>;
		});
		var tags = this.state.isEdit? 
			<div className="tags">
     		   		{allTags}
    			</div>
    	  	: <div className="tags">
				{teacherTags}
	     	</div>;
	     	
		return 	<div className="work-display">
					<div className="title">
       					<div className="speciality icon"></div>
        				<span className="teacher-speciality left">教学特长</span>
       					{this.props.editable ? <span className="edit right" onClick={this.specialityEdit}>{edit}</span> : null}
    				</div>
     				{tags}
				</div>;
	}
});
 

var HomepageTeacher = React.createClass({
	getInitialState : function() {
		return {editable : user._id == this.props.user._id};
	},
	render : function(){
		return 	<div><HomeCard user={this.props.user} editable={this.state.editable}/>
					<WorkTeacherContent works={this.props.works} user={this.props.user} editable={this.state.editable} onClick={this.HandleClick}/>
					<TeacherDisplay user={this.props.user} editable={this.state.editable}/>
					<WorkSpeciality user={this.props.user} alltags={this.props.alltags} editable={this.state.editable} />
		</div>;
	}
});
