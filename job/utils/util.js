const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function getCompanyList(fn){
	wx.showToast({
		title: 'loading....',
		icon: 'loading',
		duration: 5000
	});
	var self = this;
	wx.request({
		url: 'https://www.eat163.com/maria/get-data.json',
		data: { id: 25 },
		success(res) {
			console.log(res.data);
			fn(res.data);
			wx.hideToast();
		}
	});
}

function getCompany(id , fn){
	this.getCompanyList(function(data){
		for(var i=0;i<data.length;i++){
			var item = data[i];
			if(item.id == id){
				fn(item);
			}
		}
	})
}
function getWork(){

}

function openMap(title , position){
	
}


module.exports = {
    formatTime: formatTime,
	getCompanyList: getCompanyList ,
	getCompany: getCompany ,
	getWork: getWork,
	openMap : openMap
}