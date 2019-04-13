// pages/detail/detail.js
const util = require('../../utils/util.js');
Page({
	/**
	 * 页面的初始数据
	 */
	id : 0 ,
	title : '',
	from : '',
	data: {
		markers : [{
			id : 0 ,
			latitude: '30.3048880000',
			longitude: '120.3521790000',
			title : '浙江育英职业技术学院',
			alpha : 0.8 ,
			callout : {
				content: '浙江育英职业技术学院',
				display: 'ALWAYS',
				padding:10 ,
				fontSize : 18 ,
				color: '#ffffff' , 
				bgColor : '#333333' ,
				borderRadius : 15,
				alpha : 0.8
			}
		}]
	},
	videoList : [],
	flag : false,
	getData(){
		wx.showToast({
			icon: 'loading',
			duration: 5000
		});
		var self = this;
		wx.request({
			url: 'https://www.eat163.com/maria/get-data.json',
			data: {id: 20},
			success(res) {
				var list = [] , info = {}  , tel = {} ;
				console.log(res.data);
				res.data.map(function (group) {
					group.list.map(function (item) {
						if (item.id == self.id) {
							list = item.detail;
							info = item.info;
							tel  = item.tel;
							self.title = item.des;
						}
					});
				});
				if(list.length == 0){
					list.push({
						type : 1,
						value : '请在后台设置文本'
					});
				}
				list.map(function(item , index){
					if(item.type == 2){
						item.pic = self.getFullPic(item.value);
					}
					if(item.type == 3){
						self.videoList.push({
							index : index
						});
					}
					if(item.type == 6){
						item.latitude = parseFloat(item.value.split(',')[0]);
						item.longitude = parseFloat(item.value.split(',')[1]);
						item.markers = [{
							id: 0,
							latitude: item.latitude,
							longitude: item.longitude,
							title: item.extra,
							alpha: 0.8,
							callout: {
								content: item.extra,
								display: 'ALWAYS',
								padding: 10,
								fontSize: 18,
								color: '#ffffff',
								bgColor: '#333333',
								borderRadius: 15,
								alpha: 0.8
							}
						}];
					}
				});
				console.log(self.videoList);
				info.formData = {};
				info.fields = ['电话号码'].concat(info.fields);
				self.setData({
					list: list,
					info : info,
					tel : tel,
					from : self.from
				});
				wx.hideToast();
				wx.stopPullDownRefresh();
				setTimeout(function(){
					self.videoList.map(function(item){
						var query = wx.createSelectorQuery();
						var dom = query.select('#video-' + item.index);
						dom.boundingClientRect(function (res) {
							item.position = res;
						}).exec();
						dom.context(function (res) {
							item.context = res.context;
						}).exec();
					});
				} , 2000);
			}
		});
	},
	markertap(event){
		var item = event.currentTarget.dataset.item;
		console.log(item);
		wx.openLocation({
			latitude: item.latitude,
			longitude: item.longitude,
			scale: 13
		})
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
				data : JSON.stringify(formData)
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
		this.from = options.from || '';
		// this.id = 1554697489980196;
		this.getData();	
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
	
		
	},

	back:function(){
		wx.navigateBack();
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		for(var i=0;i<this.videoList.length;i++){
			var item = this.videoList[i];
			if (item.index > 0 && item.context){
				item.context.pause();
			}
		}
	},

	onHide() {
		for (var i = 0; i < this.videoList.length; i++) {
			var item = this.videoList[i];
			if (item.context) {
				item.context.pause();
			}
		}
	},
	onUnload() {
		for (var i = 0; i < this.videoList.length; i++) {
			var item = this.videoList[i];
			if (item.context) {
				item.context.pause();
			}
		}
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
			title: this.title,
			desc: this.title,
			path : '/pages/detail/detail?id=' + this.id
		}
		return json;
	},
	onPageScroll : function(event){
		var top = event.scrollTop;
		var height = wx.getSystemInfoSync().windowHeight;
		var list = this.videoList;
		
		for(var i=0; i < this.videoList.length; i++){
			var item = this.videoList[i];
			if(top < item.position.bottom - 50 && top + height/1.5 > item.position.top){
				this.play(i);
				console.log('play' , item);
				return;
			}
			if(top > item.position.bottom-50 || top + height < item.position.top ){
				item.status = 'pause';
				console.log('pause' , item);
				item.context.pause();
			}
		}
	},
	play(index){
		for (var i = 0; i < this.videoList.length; i++) {
			var item = this.videoList[i];
			if(i != index){
				if(item.status == 'pause'){
					continue;
				}
				item.context.pause();
				item.status = 'pause';
			}
			else{
				if(item.status == 'play'){
					continue;
				}
				item.status = 'play';
				item.context.play();
			}
		}
	},
	getFullPic(src) {
		if (src.indexOf('http://x.eat163.com') == -1) {
			return src;
		}
		else {
			if (src.indexOf('?') > -1) {
				src = src.split('?')[0];
			}
			return src += '?x-oss-process=image/resize,w_750';
		}
	}
})