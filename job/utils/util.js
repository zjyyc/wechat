function init(){
	wx.getUserInfo({
		lang: 'zh_CN',
		success: function (json) {
			wx.setStorage({
				key: 'avatarUrl',
				data: json.userInfo.avatarUrl,
			})
		}
	})
}

// init();

function getAvatar(src) {
	if (src.indexOf('http://x.eat163.com') == -1) {
		return src;
	}
	else {
		if (src.indexOf('?') > -1) {
			src = src.split('?')[0];
		}
		return src += '?x-oss-process=image/resize,w_160';
	}
}

function getData(fn , flag){
	var time = wx.getStorageSync('get-data-time');
	if (!flag || (flag == 1 && time && (new Date().getTime() - time < 1800 * 1000))){
		console.log(1800 * 1000 - new Date().getTime() + time  );
		wx.getStorage({
			key : 'data' ,
			success: function(data){
				fn(data.data);
			}
		});
		return;
	}
	wx.showToast({
		title: 'loading....',
		icon: 'loading',
		duration: 5000
	});
	var self = this;
	wx.request({
		url: 'https://www.eat163.com/maria/get-data-list.json',
		data: { ids: '26,27,28,29,30,31' },
		success(res) {
			console.log(res);
			var list = [];
			for(var i=1;i<6;i++){
				res.data['json_' + (i+25)].map(function(item){
					item.belongs = item.belongs || '0';
					item.belongs += (',' + i);
					item.avatar = getAvatar(item.pic);
					list.push(item);
				});
			}
			var data = {
				list: list,
				config: res.data.json_31
			};
			fn(data);
			wx.setStorage({
				key : 'get-data-time' ,
				data : new Date().getTime()
			});
			wx.setStorage({
				key: 'data',
				data: data
			});
			wx.hideToast();
			wx.stopPullDownRefresh();
		}
	});
}
function getLoginData(){
	return wx.getStorageSync('login');;
}
function login( detail , fn){
	if (detail && detail.iv) {
		wx.showLoading({
			title: '登陆中....'
		});
		wx.login({
			success: function (json) {
				json.iv = detail.iv;
				json.encryptedData = detail.encryptedData;
				wx.request({
					url: 'https://www.eat163.com/wechat/login.json',
					data: json,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
					},
					success: function (json) {
						wx.hideLoading();
						if(typeof json.data == 'string' && json.data.indexOf('<html>' > -1)){
							wx.showModal({
								title: '登陆失败，请稍后再试',
								content: '',
								showCancel: false
							})
						}
						else{
							wx.setStorageSync('login', json.data);
							fn(json.data);
						}
						
					}
				})
			}
		});
	}
}

function getApplyData(){
	var applyData = wx.getStorageSync('applyData') || {};
	return applyData;
}
function setApplyData(json){
	var applyData = getApplyData();
	applyData[json.jobId] = json;
	wx.setStorageSync('applyData', applyData);
}


module.exports = {
	getData: getData,
	getLoginData: getLoginData ,
	login : login , 
	getApplyData: getApplyData ,
	setApplyData: setApplyData
}