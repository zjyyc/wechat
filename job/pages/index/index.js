//index.js
//获取应用实例
const util = require('../../utils/util.js');
const app = getApp();
Page({
    data: {
        list : []
    },
	getData() {
		var self = this;
		util.getCompanyList(function(data){
			var list = data.concat(data).concat(data);
			list.map(function (item) {
				item.avatar = self.getAvatar(item.pic);
			})
			self.setData({
				list: list
			});
		});
		
	},
    onLoad: function() {
        this.getData();
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
	tap(){
		wx.showActionSheet({
			itemList: ['创意设计分院', '信息技术分院', '创意设计分院', '信息技术分院', '创意设计分院', '信息技术分院'],
			success : function(res){
				console.log(res.tapIndex);
			}
		})
	},
	getAvatar(src) {
		if (src.indexOf('http://x.eat163.com') == -1) {
			return src;
		}
		else {
			if (src.indexOf('?') > -1) {
				src = src.split('?')[0];
			}
			return src += '?x-oss-process=image/resize,w_160';
		}
	},
	go(event){
		var companyId = event.currentTarget.dataset.companyId;
		wx.navigateTo({
			url: '/pages/company-detail/company-detail?companyId=' + companyId
		})
	}
})