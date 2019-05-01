const util = require('../../utils/util.js');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var self = this;
		if (!options.companyId){
			options = { companyId: "1556343865202189", jobId: "1556362017798630" };
		}
		util.getCompanyList(function(list){
			var company = null; var job = null;
			for(var i=0;i<list.length;i++){
				if(list[i].id == options.companyId){
					company = list[i];
					break;
				}
			}
			for(var i=0;i<company.jobs.length;i++){
				var item = company.jobs[i];
				if (item.id == options.jobId){
					item.active = true;
					job = item;
					break;
				}
			}
			console.log(company);
			console.log(job);
			self.setData({
				company : company , 
				job : job
			})

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
	openMap(event){
		var address = event.currentTarget.dataset.address;
		wx.openLocation({
			latitude: parseFloat(address.position.split(',')[0]),
			longitude: parseFloat(address.position.split(',')[1]),
			scale: 13,
			name: address.title,
			address: address.desc
		})
	},
	goBack(){
		if (getCurrentPages().length == 1){
			wx.reLaunch({
				url : '/pages/works/works'
			})
		}
		else{
			wx.navigateBack({
				delta : 1
			});
		}
	},
	gotoCompany(event){
		var companyId = event.currentTarget.dataset.companyId;
		var list = getCurrentPages();
		if (list.length > 1 && list[list.length - 2].route == 'pages/company-detail/company-detail'){
			wx.navigateBack({
				delta: 1
			});
		}
		else{	
			wx.navigateTo({
				url: '/pages/company-detail/company-detail?companyId=' + companyId
			})
		}
	},
	gotoWork(event){
		var companyId = event.currentTarget.dataset.companyId;
		var jobId = event.currentTarget.dataset.jobId;
		wx.redirectTo({
			url: '/pages/work/work?companyId=' + companyId + '&jobId=' + jobId
		})
	}
})