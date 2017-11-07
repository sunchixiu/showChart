var courseProgressInterval;
var studyStatus="2";//（1=未学习；2=学习中；3=学习完成）
var autostart =false;//是否自动播放；true自动；false不自动
var videoid = 'C0289F1D410F6D029C33DC5901307461';//CC视频ID
var last_second='50';//最后播放时间，单位秒
var courseBodyId='47c1dc8bf5b148bbbb032b798e21e263';//最后播放时间，单位秒
var uid='75a7a3d3ba4f484faab264e9fc2d2d3a';

//播放器配置---cc播放器加载时，会回调这个js
function on_cc_player_init(vid, objectId ){
	alert('配置');
	var config = {};
	//关闭右侧菜单
	config.rightmenu_enable = 0;
	
	config.on_player_seek = "custom_seek";
	config.on_player_ready = "custom_player_ready";
	config.on_player_start = "custom_player_start";
	config.on_player_pause = "custom_player_pause";
	config.on_player_resume = "custom_player_resume";
	config.on_player_stop = "custom_player_stop";
	config.on_player_playerror = "custom_player_playerror";
	
	
	/*config.player_plugins = {// 插件名称 : 插件参数
			Subtitle : {
				url : "http://dev.bokecc.com/static/font/example.utf8.srt"
				, size : 24
				, color : 0xFFFFFF
				, surroundColor : 0x3c3c3c
				, bottom : 0.15
				, font : "Helvetica"
				, code : "utf-8"
			}
		};*/
	
	var player = getSWF(objectId);
	player.setConfig(config);
}

//获取播放器对象
function getSWF(objectId) {
	alert('获取播放器对象');
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return window[objectId];
	} else {
		return document[objectId];
	}
}

/**Player API接口调用示例，主动调用-----------------------开始*/
var prefix = "cc_";
function player_play(id) { // 开始播放
	alert(11);
	var player = getSWF(prefix + id);
	player.start();
}

function player_pause(id) { // 暂停播放
	alert(22);
	var player = getSWF(prefix + id);
	player.pause();
}

function player_resume(id) { // 恢复播放
	alert(33);
	var player = getSWF(prefix + id);
	player.resume();
}

function player_current(id) { // 获取当前播放时间
	alert(44);
	var player = getSWF(prefix + id);
	console.log(player.getPosition());
	return player.getPosition();
}

function player_seek(id,second) { // 拖动播放
	alert(55);
	var player = getSWF(prefix + id);
	player.seek(second);
	console.log("播放指定时间："+second);
}

function player_getduration(id) { // 视频总时长
	alert(66);
	var player = getSWF(prefix + id);
	return player.getDuration();
}


/**Player API接口调用示例，主动调用-----------------------结束*/


/**自定义回调函数------------开始*/
//播放器准备就绪回调JS
function custom_player_ready() {
	alert(77);
	console.log("<strong>播放器配置</strong>：on_player_ready.");
	videoid = $("#videoid").val();//CC视频ID
	last_second=$("#last_second").val();//最后播放时间，单位秒
	courseBodyId=$("#courseBodyId").val();//最后播放时间，单位秒
	uid=$("#uid").val();;//登录用户ID
	if(autostart){
		player_play(videoid);//播放器准备就绪后播放
	}
	studyStatus="2";
	processCourseStudyStatus(studyStatus);
	$("#"+courseBodyId).addClass("active");
}

//开始播放后回调
function custom_player_start() {
	alert('播放');
	console.log("<strong>接口</strong>：start().&nbsp;&nbsp;<strong>播放器配置</strong>：on_player_start.");
	if(last_second>0){
		player_seek(videoid, last_second);//跳到指定的播放时间
	}
	addFirstPlayLog(videoid);
	initCourseProgressInterval();
	return;
}

function custom_player_pause() {
	alert(88);
	console.log("<strong>接口</strong>：pause().&nbsp;&nbsp;<strong>播放器配置</strong>：暂停了on_player_pause.");
	stopCourseProgressInterval();
	return;
}

function custom_player_resume() {
	alert(99);
	console.log("<strong>接口</strong>：resume().&nbsp;&nbsp;<strong>播放器配置</strong>：on_player_resume.");
	initCourseProgressInterval();
	return;
}

function custom_seek(from,to){
	alert(1010);
	console.log("拖动播放，从 <span style='color:#5CB85C;'>" + from + "</span> 秒拖动到第 <span style='color:#5CB85C;'>" + to + "</span> 秒");
}

//播放完毕
function custom_player_stop() {
	alert(1111);
	console.log("<strong>播放器配置</strong>：播放结束了on_player_stop.");
	studyStatus="3";//更新为学习完成
	processCourseStudyStatus(studyStatus);
	return;
}

//播放失败回调
function custom_player_playerror(code) {
	alert(1212);
//	alert("播放失败，失败原因code："+code);
//	return;
}
/**自定义回调函数------------结束*/


/**学习相关js------------开始*/

//开始定时调用-同步课程最后更新时间
function initCourseProgressInterval() {
	alert(1313);
	courseProgressInterval = window.setInterval("processCourseProgress()",10000);//5秒通知服务器一次
}
//停止定时调用-同步课程最后更新时间
function stopCourseProgressInterval() {
	alert(1414);
	window.clearInterval(courseProgressInterval);
}

//同步课程最后更新时间
function processCourseProgress(){
	alert(1515);
	last_second = player_current(videoid);//最后播放时间
	last_second = last_second || 0;
	var totalTime = player_getduration(videoid);
	if(totalTime==last_second || last_second == 0){
		stopCourseProgressInterval();
	}
	if(last_second>0){
		//ajax调用程序，记录最后播放时间
		console.log("同步课程最后更新时间processCourseProgress："+last_second);
		//更改最后播放时间
		updateStudyLastTime(last_second);
	}
}

//修改课程学习状态
function processCourseStudyStatus(studyStatus){
	alert(1616);
	console.log("修改课程学习状态processCourseStudyStatus："+studyStatus);
	//修改课程学习状态processCourseStudyStatus
	if(studyStatus == 3){
		updateStudyLastTime(last_second);
	}
	updateStudyStatus(studyStatus);
	
}

//返回给CC服务器
function get_cc_verification_code(vid){
	alert(1717);
	var courseid = '2b579f550f7d4d1eb2ad6feefa12e955';
	var userid = '75a7a3d3ba4f484faab264e9fc2d2d3a';
	return vid+"_"+userid+"_"+courseid;
}

function cc_callback(vid){
	alert(1818);
//	alert("CC回调成功："+vid);
	$("#tck").show();
}

/**学习相关js------------结束*/

//更改学习状态
function updateStudyStatus(studyStatus){
	alert(1919);
	var parm = {"studyStatus":studyStatus,"courseBodyId":$("#courseBodyId").val()};
	parm.courseId = getQueryString("courseId");
	parm.client = 1;
	$.ajaxSeentao($.getRootPath()+"/coursestudydetail/updateStudyStatus.rest", JSON.stringify(parm),function(json){
		if(json.code===1){
			
		}else{
			ischool.layout.error(json.errorMessage,2000);
		}
	});  
}

//更改学习视频最后时间
function updateStudyLastTime(lastStudyTime){
	alert(2020);
	var parm = {"lastStudyTime":lastStudyTime,"courseBodyId":courseBodyId};
	parm.courseId = getQueryString("courseId");
	$.ajaxSeentao($.getRootPath()+"/coursestudydetail/updateStudyLastTime.rest", JSON.stringify(parm),function(json){
		if(json.code===1){
			
		}else{
			ischool.layout.error(json.errorMessage,2000);
		}
	});  
}

//插入第一次播放记录
function addFirstPlayLog(){
	alert(2121);
	var parm = {"courseId":courseId,"goodsId":getQueryString("goodsId"),"videoId":videoid};
	$.ajaxSeentao($.getRootPath()+"/coursestudydetail/addFirstPlayLog.rest", JSON.stringify(parm),function(json){
		if(json.code===1){
			
		}else{
			ischool.layout.error(json.errorMessage,2000);
		}
	});  
}