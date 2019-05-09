//index.js
//获取应用实例
const util = require('../../utils/util.js');
const app = getApp();
Page({
    data: {
		statusBarHeight: app.globalData.statusBarHeight,
        list : [] ,
		belong : {
			id : 0 ,
			title : '推荐公司'
		},
		loadTime: new Date().getTime()
    },
	getData(flag) {
		var self = this;
		util.getData(function(data){
			var list = data.list;
			list.map(function (item) {
				item.show = item.belongs.indexOf(self.data.belong.id) > -1
			})
			self.setData({
				list: list
			});
		} , flag);
	},
    onLoad: function() {
		this.getData(1);
		
    },
	onShow: function () {
		if(new Date().getTime() - this.data.loadTime > 30 * 60 * 1000){
			this.data.loadTime = new Date().getTime();
			this.getData(1);
		}
	},
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
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
	onPullDownRefresh() {
		this.getData(2);
	},
	changeBelong(){
		var self = this;
		var itemList = ['推荐公司', '民航交通分院', '信息技术分院',  '商务贸易分院', '经济管理分院', '创意设计分院'];
		wx.showActionSheet({
			itemList: itemList,
			success : function(res){
				var list = self.data.list;
				//因为民航要排第一。此处民航跟信息交换
				var index = res.tapIndex;
				if(index == 1){
					index = 2;
				}
				else if(index == 2){
					index = 1;
				}
				list.map(function(item){
					item.show = item.belongs.indexOf(index) > -1
				})
				self.setData({
					list : list , 
					belong: {
						id : res.tapIndex , 
						title : itemList[res.tapIndex]
					}
				})
			}
		})
	},
	
	go(event){
		var companyId = event.currentTarget.dataset.companyId;
		wx.navigateTo({
			url: '/pages/company-detail/company-detail?companyId=' + companyId
		})
	}
})