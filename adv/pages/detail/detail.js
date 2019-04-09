// pages/detail/detail.js
Page({

	/**
	 * 页面的初始数据
	 */
	id : 0 ,
	data: {
	},
	formData : {

	},
	getData(){
		wx.showToast({
			icon: 'loading',
			duration: 5000
		});
		var self = this;
		wx.request({
			url: 'https://www.eat163.com/maria/get-data.json',
			data: { id: 20 },
			success(res) {
				var list = [] , info = {}  , tel = {};
				console.log(res.data);
				res.data.map(function (group) {
					group.list.map(function (item) {
						if (item.id == self.id) {
							list = item.detail;
							info = item.info;
							tel  = item.tel;
						}
					})
				});
				if(list.length == 0){
					list.push({
						type : 1,
						value : '请在后台设置文本'
					})
				}
				info.formData = {};
				info.fields = ['电话号码'].concat(info.fields);
				self.setData({
					list: list,
					info : info,
					tel : tel
				});
				wx.hideToast();
				wx.stopPullDownRefresh();
			}
		});
	},
	input(event){
		this.data.info.formData[event.currentTarget.dataset.name] = event.detail.value;
	},
	save(event){
		console.log(this.formData);
		var index = event.currentTarget.dataset.index;
		var telReg = /^[1][0-9]{10}$/;
		var self = this;
		var formData = this.data.info.formData;
		if (!telReg.test(formData['电话号码'])) {
			wx.showModal({
				title: '请输入正确的电话号码',
				content: '',
				showCancel : false
			})
			return ;
		} 
		wx.showToast({
			icon: 'loading',
			mask : true, 
			duration: 5000
		});
		wx.request({ 
			url: 'https://www.eat163.com/maria/save-active-data.json' ,
			method : 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},  
			data : {
				f1: this.id,
				f2 : formData['电话号码'],
				site : 1 ,
				data : JSON.stringify(this.formData)
			},
			success(res){
				console.log(res);
				wx.hideToast();
				var list = self.data.list;
				list[index].status = 1;
				self.setData({
					['list[' + index +  ']'] : list[index] ,
					info : self.data.info
				})
			}
		});
	},
	write(event){
		var index = event.currentTarget.dataset.index;
		var list = this.data.list;
		list[index].status = 0;
		this.setData({
			['list[' + index + ']']: list[index]
		})
	},


	ringUp(event){
		var tel = event.currentTarget.dataset.tel;
		wx.makePhoneCall({
			phoneNumber: tel //仅为示例，并非真实的电话号码
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.id = options.id;
		this.id = 1554261145849313;
		this.getData();	
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
		this.getData();
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
			title: '弹出分享时显示的分享标题',
			desc: '弹出分享时显示的分享标题',
			path : '/pages/detail/detail'
		}
		return json;
	}
})