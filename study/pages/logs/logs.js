//logs.js
const util = require('../../utils/util.js')

Page({
    data: {
        logs: []
    },
    onLoad: function() {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return util.formatTime(new Date(log))
            })
        })
    },
	onPullDownRefresh: function () {
		console.log(123);
		setTimeout(() => {
			wx.stopPullDownRefresh();
		} , 500);
	}
})