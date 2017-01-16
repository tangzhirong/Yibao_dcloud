(function(){
	var app = angular.module('manageApp', ['ui.router', 'blogApp','user','feeds','studio','tag','ngCookies']);
	app.config(['$stateProvider','$urlRouterProvider',function(s,url) {
		//url.when("", "/blog/category");
		url.when("/blog", "/blog/category")
			.when("/user","/user/list")
			.when("/feed","/feed/list")
			.when("/studio","/studio/list")
			.when("/tag", "/tag/list")
			.otherwise("/manager_login");

		// ��̨��¼ҳ��
		s.state('manager_login',{
			url : '/manager_login',
			templateUrl : "views/manager_login.html"
		});

		s.state('article',{
			url : "/article/{_id}",
			templateUrl:"views/manage/article.html",
			controller: "articleCtrl"
		});

		s.state('user',{
			url : "/user",
			controller: "userCtrl",
			templateUrl : "views/manage/user.html"
		}).state('blog',{
			url : "/blog",
			templateUrl : "views/manage/blog.html"
		}).state('blog.category',{
			url : "/category",
			controller : "categoryCtrl",
			templateUrl : "views/manage/blog.category.html"
		}).state('blog.category.edit',{
			url : "/edit?cateid&index",
			views : {
				"floatContent@" : {
					templateUrl : "views/manage/blog.categoryEdit.html",
					controller : "categoryEditCtrl"
				}
			}
		}).state('user.list',{
			url : "/list",
			templateUrl :"views/manage/user.list.html"
		}).state('user.query',{
			url : "/query",
			templateUrl : "views/manage/user.query.html"
		}).state('feed',{
			url :"/feed",
			controller:"feedCtrl",
			templateUrl :"views/manage/feed.html"
		}).state('feed.select',{
			url :"/select",
			templateUrl :"views/manage/feed.select.html"
		}).state('feed.select.detail',{
			url : "/detail/{_id}",
			views : {
				"floatContent@" : {
					templateUrl : "views/manage/feed.detail.html",
					controller : "feeddetailCtrl"
				}
			}
		}).state('feed.list',{
			url :"/list",
			templateUrl : "views/manage/feed.list.html"
		}).state('studio',{
			url :"/studio",
			controller: "studioCtrl",
			templateUrl :"views/manage/studio.html"
		}).state('studio.list',{
			url :"/list",
			templateUrl :"views/manage/studio.list.html"
		}).state('studio.manage',{
			url :"/manage",
			templateUrl: "views/manage/studio.manage.html"
		}).state('studio.picture',{
			url :"/picture/{_id}",
			templateUrl: "views/manage/studio.picture.html",
			controller:"UploaderController"
		}).state('tag', {
			url: "/tag",
			templateUrl: "views/manage/tag.html"
		}).state('tag.list',{
			url: "/list",
			controller: "tagCtrl",
			templateUrl: "views/manage/tag.list.html"
		}).state('tag.list.edit',{
			url: "/edit?tagid%index",
			views : {
				"floatContent@" : {
					templateUrl : "views/manage/tag.edit.html",
					controller : "tagEditCtrl"
				}
			}
		}).state('studio.list.profile',{
			url :"/profile/{_id}",
			views : {
				"floatContent@" : {
					templateUrl : "views/manage/studio.profile.html",
					controller : "studio_profileCtrl"
				}
			}
		}).state('user.query.detail',{
			url : "/detail/{id}",
			views : {
				"floatContent@" : {
					templateUrl : "views/manage/user.detail.html",
					controller : "userdetailCtrl"
				}
			}
		}).state('blog.posts',{
			url : "/posts",
			templateUrl : "views/manage/blog.posts.html",
			controller : "postsCtrl"
		}).state('blog.posts.create',{
			url : '/create',
			views : {
				"floatContent@" : {
					templateUrl : "views/manage/blog.postEdit.html",
					controller : "postCreateCtrl"
				}
			}
		}).state('blog.posts.edit',{
			url : "/edit?postid&index",
			views : {
				"floatContent@" : {
					templateUrl : "views/manage/blog.postEdit.html",
					controller : "postEditCtrl"
				}
			}

		});
	}]);



	app.controller('bodyCtrl', ['$scope','$rootScope','$state','Login','$cookies',function(s,$rootScope,$state,Login,$cookies){
		s.rightShow = false;
		s.leftShow=false;
		s.manager_list=[];
		//����cookie�Ƿ����
		if($cookies.get("sessionid")){
			$rootScope.isLogined = true;
			s.leftShow = true;
		}else
			$rootScope.isLogined = false;

		s.validation=function(){
			var user = document.getElementById("user").value;
			var password = document.getElementById("psw").value;
			Login.check(user, password).then(function(result){
				$rootScope.isLogined = result;
				s.leftShow = result;
				if(result){
					$state.go("user");
				}else
					alert("Wrong input!");
			});
		};
		s.logout=function(){
			$rootScope.isLogined=false;
			s.leftShow=false;
		    $cookies.sessionid=null;
			$state.go('manager_login');
		}

		$rootScope.$on('$stateChangeStart',function(e,toState) {
			var cookie = $cookies.get("sessionid");
			if( (!cookie) && toState.name != 'manager_login'){
				e.preventDefault();
				$state.go('manager_login');
			}
		});

	}]);
	app.service('Login',['$q','$http',function(q,http){
		this.check=function(user,psw){
			var d = q.defer();
			http.post("/manager/login",{uid : user,password : psw}).success(function(result) {
				d.resolve(result.isLogined);
			});
			return d.promise;
		};
	}]);

	app.service('upload', ['$q','$http',function(q,http){
		this.uploadImage = function(base64){
			var d = q.defer();
			http.post('/manager/getImgUrl', {base64 : base64}).success(function(result){
				d.resolve(result.url);
			});
			return d.promise;
		};
	}]);
})();
