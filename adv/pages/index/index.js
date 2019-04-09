//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
		groups : []
	},
	util : util ,
    //事件处理函数
    go: function(event) {
		var id = event.currentTarget.dataset.id;
		console.log(id);
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + id
        })
    },
	getData(){
		wx.showToast({
			title: 'loading....',
			icon: 'loading',
			duration: 5000
		});
		var self = this;
		wx.request({
			url: 'https://www.eat163.com/maria/get-data.json',
			data: { id: 20 },
			success(res) {
				console.log(res.data);
				res.data.map(function (group) {
					group.list.map(function (item) {
						item.pic = util.getPic(item.pic, 750, 375);
					})
				});
				self.setData({
					groups: res.data
				});
				wx.hideToast();
				wx.stopPullDownRefresh();
			}
		});
	},
    onLoad: function() {
		this.getData();
    }, 
    getUserInfo: function(e) {
        
    },
	onPullDownRefresh() {
		this.getData();
	}  
})