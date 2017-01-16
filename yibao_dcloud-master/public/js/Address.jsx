var Located = React.createClass({
	HandleClick : function(){
		this.props.HandleLoaction(this.props.city);
	},
	render : function(){
		var location = this.props.isLocated? <span className="city">{this.props.city}</span> 
		: <i className="fa fa-spinner fa-pulse"></i>;
		return <div className="column" onClick={this.HandleClick}>
					<i className="fa fa-map-marker"></i>
					{location}
				</div>
	}
});

var All = React.createClass({
	render : function(){
		var that = this;
		var all = this.props.list.map(function(one,i){
			var HandleClick = function(){
				that.props.HandleClick(one);
			}
			return <div className="column-wrap">
						<div className="column" onClick={HandleClick}>
							<span className="text">{one}</span>
							<i className="fa fa-angle-right"></i>
						</div>
					</div>;
		});
		return <div className="framework">
						{all}
				</div>;
	}
});

var Address = React.createClass({
	getInitialState : function(){
		return{
			city : "北京市",
			list : [],
			isLocated : false,
			HandleProvince : this.props.HandleProvince
		};
	},
	componentDidMount : function(){
		//获取全国的省份
		var list = this.state.list;
		var that = this;
		Service.getDistrict({"keyword":"","subdistrict":1,"level":""},function(data){
			var provinceList = data.districtList[0].districtList;
				for(var i = 0; i < provinceList.length; i++)
				{
					var province = provinceList[i];
					list.push(province.name);
				}
			that.setState({list:list});
		});
		//console.log(list);
		
		//进行定位
		Service.getLocalCity(function(status,result){
			console.log(3);
			console.log(status);
			if(status == 'complete')
				that.setState({isLocated : true,city : result.city});
		});
		
	},
	render : function(){
		return <div className="contain">
					<span className="located-title">定位到的位置</span>
					<Located isLocated={this.state.isLocated} city={this.state.city} HandleLoaction={this.props.HandleLoaction}/>
					<span className="all-title">全部</span>
					<All list={this.state.list} HandleClick={this.state.HandleProvince}/>
				</div>;
	}
});

var City = React.createClass({
	getInitialState : function(){
		return{
			HandleClick : this.props.HandleClick,
			list : []
		};
	},
	getCityList : function(province){
		var list = [];
		var that = this;
		Service.getDistrict({"keyword": province,"subdistrict":1,"level":"province"},function(data){
			var cityList = data.districtList[0].districtList;
			for(var i = 0; i < cityList.length; i++)
			{
				var city = cityList[i];
				list.push(city.name);
			}
			that.setState({list:list});
		});
	},
	componentDidMount : function(){
		//获取provin省份下属的市
		this.getCityList(this.props.province);
	},
	componentWillUpdate : function(nextProps, nextStates){
		if(this.props.province != nextProps.province)
		this.getCityList(nextProps.province);
	},
	render : function(){
		console.log(143);
		return <div className="contain">
					<span className="all-title">请选择所在城市</span>
					<All list={this.state.list} HandleClick={this.state.HandleClick}/>
				</div>;
	}
})
