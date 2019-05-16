const util = require('../../utils/util.js');
const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusBarHeight: app.globalData.statusBarHeight,
		loginData: util.getLoginData(),
		pics : []
	},

	getJobData(flag) {
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
				map: map
			})
		}, flag);
	},

	setType(e){
		var type = e.target.dataset.type;
		var self = this;
		var item = this.data.item;
		item.manager = this.data.loginData.name;
		item.type = type;
		wx.showLoading({
			title: 'loading....'
		});
		wx.request({
			url: 'https://www.eat163.com/wechat/apply-op.json',
			data : item,
			method: 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			},
			success(json){
				wx.hideLoading();
				if(json.data.code != 0){
					item.type = json.data.data.type;
					wx.showModal({
						title: '操作失败',
						content : '该学生已被' + json.data.data.manager + (item.type == -1 ? '拒绝' : '录取'),
						showCancel : false
					})
				}
				wx.setStorageSync('companyApplyList', self.companyApplyList);
				wx.setStorageSync('refreshMe', true);
				self.setData({
					item : item
				});
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var jobId = options.jobId;
		var tel = options.tel;
		var self = this;
		var companyApplyList = wx.getStorageSync('companyApplyList');
		this.companyApplyList = companyApplyList;
		this.getJobData();
		companyApplyList.map(function(item){
			if(item.jobId == jobId && tel == item.tel){
				var pics = item.pics.split(',');
				pics.map(function(pic , i){
					pics[i] = 'http://x.eat163.com/' + pic + '?x-oss-process=image/resize,w_750';
				});
				self.setData({
					item : item ,
					pics : pics
				})
				console.log(item);
			}
		});
	},
	goBack(){
		wx.navigateBack({
			delta: 1
		});
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
	ringUp(event) {
		var tel = event.currentTarget.dataset.tel;
		wx.makePhoneCall({
			phoneNumber: tel //仅为示例，并非真实的电话号码
		});
		return false;
	}
})