const util = require('../../utils/util.js');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [],
		belong: {
			id: 0,
			title: '推荐职位'
		}
	},
	getData(flag) {
		var self = this;
		util.getData(function (data) {
			var list = data.list;
			list.map(function (item) {
				item.show = item.belongs.indexOf(self.data.belong.id) > -1
			})
			self.setData({
				list: list
			});
		}, flag);
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getData(1);
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
			path: '/pages/works/works'
		}
		return json;
	},
	changeBelong() {
		var self = this;
		var itemList = ['推荐职位', '信息技术分院', '民航交通分院', '商务贸易分院', '经济管理分院', '创意设计分院'];
		wx.showActionSheet({
			itemList: itemList,
			success: function (res) {
				var list = self.data.list;
				list.map(function (item) {
					item.show = item.belongs.indexOf(res.tapIndex) > -1
				})
				self.setData({
					list: list,
					belong: {
						id: res.tapIndex,
						title: itemList[res.tapIndex]
					}
				})
			}
		})
	},
	onPullDownRefresh() {
		this.getData(2);
	},
	go(event) {
		var companyId = event.currentTarget.dataset.companyId;
		var jobId = event.currentTarget.dataset.jobId;
		wx.navigateTo({
			url: '/pages/work/work?companyId=' + companyId + '&jobId=' + jobId
		})
	}
})