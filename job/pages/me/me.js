// pages/me/me.js
const util = require('../../utils/util.js');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusBarHeight: app.globalData.statusBarHeight ,
		loginData : util.getLoginData(), 
		belong: {
			id: 0,
			title: '个人中心'
		},
		map : {} ,
		loadTime: new Date().getTime()
	},
	getApplyData(){
		var self = this;
		wx.showLoading({
			title: '加载中。。。',
		})
		wx.request({
			url: 'https://www.eat163.com/wechat/get-apply-list-by-tel.json',
			data : {
				tel : util.getLoginData().tel 
			},
			success : function(json){
				var applyData = {};
				json.data.map(function(item){
					item.date = item.gmt_time.substring(5 , 10);
					applyData[item.job_id] = {
						tel : item.tel , 
						companyId : item.company_id ,
						jobId: item.job_id,
						type : item.type
					}
				});
				self.setData({
					applyList : json.data
				});
				wx.setStorageSync('applyData', applyData);
				wx.hideLoading();
				wx.stopPullDownRefresh();
			}
		})
	},
	getApplyDataByCompany(){
		var self = this;
		var loginData = util.getLoginData();
		if(!loginData.company){
			return;
		}
		wx.showLoading({
			title: '加载中。。。',
		})
		wx.request({
			url: 'https://www.eat163.com/wechat/get-apply-list-by-company.json',
			data : {
				companyId: util.getLoginData().company.id
			},
			success : function(json){
				json.data.map(function (item) {
					item.date = item.gmt_time.substring(5, 10);
					item.companyId = item.company_id;
					item.jobId = item.job_id;
				});
				self.setData({
					companyApplyList: json.data
				});
				wx.setStorageSync('companyApplyList', json.data);
				wx.hideLoading();
				wx.stopPullDownRefresh();
				console.log(json)
			}
		})
	},
	getJobData(flag){
		var self = this;
		util.getData(function (data) {
			var list = data.list;
			var map = {};
			var jobList = [];
			for (var i = 0; i < list.length; i++) {
				var company = list[i];
				for (var j = 0; j < company.jobs.length; j++) {
					var job = company.jobs[j];
					job.companyName = company.name;
					job.companyId = company.id;
					map[job.id] = job;
				}
			}
			self.setData({
				map : map
			})
		} , flag);
	},


	init : function(){
		this.getJobData();
		this.getApplyData();
		this.getApplyDataByCompany();
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
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
		var loginData = util.getLoginData();
		if (!loginData) {
			return;
		}
		this.setData({
			loginData: loginData
		})
		if (new Date().getTime() - this.data.loadTime > 10 * 60 * 1000 || wx.getStorageSync('refreshMe' )){
			this.init();
			this.data.loadTime = new Date().getTime();
			wx.setStorageSync('refreshMe', false);
		}
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
		this.getApplyData();
		this.getJobData(2);
		this.getApplyDataByCompany();
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
	changeType(){

	},
	go(event) {
		var companyId = event.currentTarget.dataset.companyId;
		var jobId = event.currentTarget.dataset.jobId;
		wx.navigateTo({
			url: '/pages/work/work?companyId=' + companyId + '&jobId=' + jobId
		})
	},
	goStudent(event){
		var tel = event.currentTarget.dataset.tel;
		var jobId = event.currentTarget.dataset.jobId;
		wx.navigateTo({
			url: '/pages/student/student?tel=' + tel + '&jobId=' + jobId
		})
	},
	login(e) {
		var self = this;
		util.login(e.detail, function (data) {
			self.setData({
				loginData : data
			})

			self.init();
		})
	},
	logout(){
		wx.removeStorageSync("login");
		wx.removeStorageSync("applyData");
		this.setData({
			loginData : ''
		})
	},
	ringUp(event) {
		var tel = event.currentTarget.dataset.tel;
		wx.makePhoneCall({
			phoneNumber: tel //仅为示例，并非真实的电话号码
		});
		return false;
	}
})