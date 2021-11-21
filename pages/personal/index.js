import request from '../../utils/request'
// pages/personal/index.js
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distanceY:'translateY(0)',
    transitionData:'',
    userInfo:{},
    recentPlayList:[]
  },
  handleTouchStart(event){
    startY = event.touches[0].clientY;
    this.setData({
      transitionData:''
    })
    // console.log(startY);
  },
  handleTouchMove(e){
     moveY =e.touches[0].clientY;
     moveDistance = moveY-startY;
     if(moveDistance<=0)return;
     if(moveDistance>=80){
      moveDistance=80
     }
    //  console.log(moveDistance);
     this.setData({distanceY:`translateY(${moveDistance}rpx)`})
  },
  handleTouchEnd(){
    this.setData({
      distanceY:'translateY(0rpx)',
      transitionData:'transform 1s ease'
    });
    
  },
  //点击头像跳转登录
  toLogin(){
    wx.navigateTo({
      url:"/pages/login/index"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userData = wx.getStorageSync('userInfo');
    if(userData){
      this.setData({
        userInfo:JSON.parse(userData)
      })
    }
    this.getRecentPlayList(this.data.userInfo.userId)
  },
//播放记录
async getRecentPlayList(userId){
  let resRecentData = await request('/user/record',{uid:userId,type:0});
  let recentNewData = resRecentData.allData.slice(0,10).map((item,index)=>({...item,id:index}));
  this.setData({recentPlayList:recentNewData})
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

  }
})