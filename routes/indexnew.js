var express = require('express');
var router = express.Router();

//blog內容
var postList = [
	{id:1,name:"aaa",msg:"ccc"},
	{id:2,name:"bbb",msg:"ddd"}
];

var count = postList.length;

//使用者登入狀態檢查
var isLogin = false ;
var checkLoginStatus = function(req,res){
	isLogin = false ;
	if(req.signedCookies.userid&&req.signedCookies.password){
		isLogin = true ;
	} 
}

//首頁
router.get('/',function(req,res,next){
	checkLoginStatus(req,res);
	res.render('index',{
		title : '歡迎來到部落格',
		loginStatus : isLogin,
		posts : postList
	});
});

//註冊頁面
router.get('/',function(req,res,next){
	checkLoginStatus(req,res);
	res.render('reg',{
		title : '註冊',
		loginStatus : isLogin 
	});
});

//執行註冊
router.get('/',function(req,res,next){
	if(req.body['password-repeat']!=req.body['password']){
		console.log('密碼輸入不一致');
		console.log('第一次輸入的密碼:'+req.body['password']);
		console.log('第二次輸入的密碼:'+req.body['password-repeat']);
		return res.redirect('/reg');
	}
	else{
		//登入成功，回到首頁
		res.cookie('userid',req.body['username'],{ path: '/', signed : true});
		res.cookie('password',req.body['password'],{ path: '/', signed : true});
		return res.redirect('/');
	}
	
});

//登入頁面
router.get('/',function(req,res,next){
	checkLoginStatus(req,res);
	res.render('login',{
		title : '登入',
		loginStatus :isLogin
	});
});

//執行登入
router.get('/',function(req,res,next){
	if(req.body['password-repeat']!= req.body['password']){
		console.log('密碼輸入不一致');
		console.log('第一次輸入的密碼:'+req.body['password']);
		console.log('第二次輸入的密碼:'+req.body['password-repeat']);
		return res.redirect('/');
	}
	else{
		//登入成功，返回首頁
		res.cookie('userid',req.body['username'],{path: '/', signed: true});
		res.cookie('password',req.body['password'],{path: '/',signed: true});
	}	return res.redirect('/');
});

//執行登出
router.get('/',function(req,res,next){
	res.clearCookie('userid',{path : '/'});
	res.clearCookie('password',{path : '/'});
	return res.redirect('/');
});

//發表訊息
router.get('/',function(req,res,next){
	var element = { id : count, name : req.signedCookies.userid, msg : req.body['post']};
	postList.push(element);

	return res.redirect('/');
});

//使用者頁面
router.get('/',function(req,res,next){
	var userName = req.params.user;
	var userPost = [];
	for (var i = 0; i <= postList.length; i++) {
		if(postList[i].name==userName){
			userPost.push(postList[i]);
		}
	}
	checkLoginStatus(req,res);
	res.render('user',{
		title : userName + '的頁面',
		loginStatus : isLogin,
		post : userPost
	});
});

module.exports = router ;