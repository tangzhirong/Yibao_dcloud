var RectImg = React.createClass({
	 getInitialState : function(){
	 	return {
	 		imgSrc : this.props.imgSrc
	 	};
	 },
	 HandleClick : function(){
	 	this.props.remove(this.props.imgSrc);
	 },
	 render : function(){
	 	var remove = this.props.isDelete? <span className="fa-stack fa-lg" onClick={this.HandleClick}>
			  <i className="fa fa-circle fa-stack-2x"></i>
			  <i className="fa fa-close fa-stack-1x fa-inverse"></i>
			</span>
			: <div></div>;
	 	return <div className="rectImg">
	 				{remove}
	 				<img id="img" src={this.props.imgSrc} width='100%'/>
	 			</div>;
	 }
});

var UpdateContainer = React.createClass({
	remove : function(imgSrc){
		this.props.remove(imgSrc);
	},
	render : function(){
		var that = this;
		var ReactImgList = this.props.srcList.map(function(one,i){
			return <RectImg imgSrc={one} isDelete={that.props.isDelete} remove={that.remove}/>;
		});
		return <div className="container">
					{ReactImgList}
				</div>;
	}
});

var UpdateImg = React.createClass({
	getInitialState : function(){
		return {
				srcList : [],
				isDelete : false
		};
	},
	remove : function(src){
		console.log(src);
		for(var i = 0;i < this.state.srcList.length; i++)
		{
			if(src == this.state.srcList[i])
				{
					var list = this.state.srcList;
					list.splice(i,1);
					console.log(this.state.srcList[i]);
					this.setState({srcList : list});
					break;
				}
		}
	},
	deleteimg : function(){
		var isDelete = !this.state.isDelete;
		this.setState({isDelete : isDelete});
	},
	add : function(){
		var that = this;
		plus.nativeUI.actionSheet({cancel:"取消",buttons:[{title:"拍照"},{title:"相册"}]},function(e){
			
			if(e.index == 2)
				Service.getGallery(function(files){
					if(files != null)
					{
						var list = that.state.srcList;
						for(var i = 0;i < files.length; i++)
							list.push(files[i]);
						that.setState({srcList : list});
					}
				});
			else if(e.index == 1)
				Service.camera(function(path){
					if(path != null)
					{
						var list = that.state.srcList;
						path = path.substr(1);
						list.push("../../"+path);
						that.setState({srcList : list});
					}
				});
		});
	},
	componentDidMount : function(){
		var list = ['../img/head.jpg','../img/head.jpg','../img/head.jpg'];
		this.setState({srcList : list});
		console.log(9);
	},
	render : function(){
		window.lists = this.state.list;
		return <div>
					<UpdateContainer remove={this.remove}  srcList={this.state.srcList} isDelete={this.state.isDelete}/>
					<div className="block">
						<div className="rect" onClick={this.deleteimg}>
				  			<span className="fa fa-minus-circle fa-2x"></span>
				  		</div>
				  		<div className="rect right" onClick={this.add}>
				  			<span className="fa fa-plus-circle fa-2x"></span>
				  		</div>
			  		</div>
		  		</div>;
	}
});
