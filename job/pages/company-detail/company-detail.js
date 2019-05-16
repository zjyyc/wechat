// pages/company-detail/company-detail.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusBarHeight: app.globalData.statusBarHeight
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var self = this;
		// if(!options.companyId){
		// 	options.companyId = '1556343865202189';
		// }
		util.getData(function(data){
			var list = data.list;
			for(var i=0;i<list.length;i++){
				if(list[i].id == options.companyId){
					self.setData({
						company: list[i]
					});
					return ;
				}
			}
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
		var json = {
			title: '育英职业技术学院 - 招聘会',
			desc: '育英职业技术学院 - 招聘会',
			path: '/pages/company-detail/company-detail?companyId=' + this.data.company.id
		}
		return json;
	},
	onPageScroll: function (event) {
		var top = event.scrollTop;
		var opacity = Math.min(0.96 , (top-30) / 100);
		
		this.setData({
			opacity: opacity
		})
	},
	openMap(event) {
		var address = event.currentTarget.dataset.address;
		wx.openLocation({
			latitude: parseFloat(address.position.split(',')[0]),
			longitude: parseFloat(address.position.split(',')[1]),
			scale: 13,
			name: address.title,
			address: address.desc
		})
	},
	gotoWork(event) {
		var companyId = event.currentTarget.dataset.companyId;
		var jobId = event.currentTarget.dataset.jobId;
		wx.navigateTo({
			url: '/pages/work/work?companyId=' + companyId + '&jobId=' + jobId
		})
	},
	goBack() {
		
		if (getCurrentPages().length == 1) {
			wx.reLaunch({
				url: '/pages/index/index'
			})
		}
		else {
			wx.navigateBack({
				delta: 1
			});
		}
	},
	ringUp(event) {
		var tel = event.currentTarget.dataset.tel;
		wx.makePhoneCall({
			phoneNumber: tel //仅为示例，并非真实的电话号码
		});
		return false;
	}

})