import config from "./config";
export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        wx.request({
            data,
            method,
            url: config.url + url,
            header:{
                cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find((item)=>item.indexOf('MUSIC_U')!==-1):''
            },
            success:(res)=>{
                resolve(res.data)
                
                if(data.isLogin){
                    wx.setStorageSync('cookies', res.cookies)
                }
            },
            fail:(error)=>{
                reject(error)
            }
        })
    })
}