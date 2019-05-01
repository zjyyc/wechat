//logs.js
const util = require('../../utils/util.js')

Page({
    data: {
        logs: []
    },
    onLoad: function() {
		wx.login();
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return util.formatTime(new Date(log))
            })
        })
    },
	getUserInfo(e , data){
		console.log(e);
		console.log(data);
	}

})