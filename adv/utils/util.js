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

var getPic = function(src , width , height){
	if(src.indexOf('http://x.eat163.com') == -1){
		return src;
	}
	else {
		if(src.indexOf('?') > -1){
			src = src.split('?')[0];
		}
		return src += '?x-oss-process=image/resize,m_fill,' + 'w_' + width + ',h_' + height;
	}
}




module.exports = {
    formatTime: formatTime,
	getPic : getPic
}