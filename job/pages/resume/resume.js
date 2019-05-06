const util = require('../../utils/util.js');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		loginData: util.getLoginData() ,
		pics : []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	init(){
		var loginData = util.getLoginData();
		if(!loginData){
			return;
		}
		console.log(loginData);
		loginData.edit = !(loginData.name && loginData.class1);
		var pics = [];
		var b = loginData.pics.split(',');
		b.map(function (key) {
			if(key){
				pics.push({
					key: key,
					src: 'http://x.eat163.com/' + key + '?x-oss-process=image/resize,w_750'
				})
			}
		})
		this.setData({
			loginData: loginData,
			pics: pics
		})
	},
	onLoad: function (options) {
		this.init();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	add(){
		var self = this;
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(json) {
				wx.showLoading({
					title: '上传中' + json.tempFilePaths.length + '图片中。。。',
					duration : 20000,
					mask : true
				})
				console.log(json);
				var pics = self.data.pics.concat(json.tempFiles);
				self.setData({
					pics: pics
				})
				for (var i = 0; i < pics.length; i++){
					if (pics[i].path){
						self.upload(pics[i].path, i);
					}
				}
				
			}
		})

	},
	upload(src , index){
		var self = this;
		var data = {};
		var key = new Date().getTime() % 100000000 + '' + parseInt(Math.random() * 1000) + '.' + src.split('.').reverse()[0].toLocaleLowerCase();
		data.key =  key;
		data.policy = 'eyJleHBpcmF0aW9uIjoiMjA2Ni0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==';
		data.OSSAccessKeyId =  'LTAImRM0DKxCPkdL';
		data.signature =  'sjudNgSMRQr5fJlqMBmX78Mhy80=';
		data.success_action_status = '200';
		wx.uploadFile({
			url: 'https://img99.oss-cn-zhangjiakou.aliyuncs.com/' ,
			filePath : src ,
			name : 'file' , 
			formData : data ,
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			},
			success : function(data){
				var pics = self.data.pics;
				pics[index].key = key;
				pics[index].src = 'http://x.eat163.com/' + key + '?x-oss-process=image/resize,w_750';
				self.setData({pics : pics})	;
				for(var i=0;i<pics.length;i++){
					if (!pics[i].key){
						return;
					}
				}
				self.save();
				wx.hideLoading();
			}
		});
	},
	saveInfo(){
		if(this.data.loginData.name.trim() == '' || this.data.loginData.class1.trim() == ''){
			return wx.showModal({
				title: '温馨提示',
				content: '姓名及班级不能为空',
				showCancel : false
			})
		}
		this.data.loginData.edit = false;
		this.save();
		this.init();
	},
	save(){
		var loginData = this.data.loginData;
		var pics = this.data.pics;
		var str = [];
		pics.map(function(item){
			str.push(item.key);
		})
		loginData.pics = str.join(',');
		wx.setStorageSync('login', loginData);
		wx.request({
			url: 'https://www.eat163.com/wechat/save-student.json',
			data: loginData,
			method: 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			},
			success: function (json) {
				console.log(json.data);
			}
		})
	},
	input(event) {
		this.data.loginData[event.currentTarget.dataset.name] = event.detail.value;
	},
	editInfo(){
		this.data.loginData.edit = true;
		this.setData({
			loginData: this.data.loginData
		})
	},
	login(e) {
		var self = this;
		util.login(e.detail , function(data){
			self.init();
		})
		
	},
	removePic(event){
		var self = this;
		wx.showModal({
			title: '简历中心',
			content: '你确定要删除该页简历吗？',
			success	: function(res){
				if (res.confirm){
					var index = event.currentTarget.dataset.index;
					var pics = self.data.pics;
					pics.splice(index, 1);
					self.setData({ pics: pics });
					self.save();
				}
			}
		})
		
	}
})