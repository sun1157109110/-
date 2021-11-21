// pages/recommendSong/index.js
import PubSub from 'pubsub-js';
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],
    index:0
  },
  //点击跳转至音乐播放界面
  handleToSong(e){
    let musicId = e.currentTarget.id
    let {index}=e.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetai/index?musicId='+musicId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //先判断是否登录
    if(!wx.getStorageSync('userInfo')){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: function() {
          wx.reLaunch('/pages/login/index')
        }
      })
    }
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    this.getRecommendList()
    //订阅来自songdetail页面的消息
    PubSub.subscribe('switchType',(msg,type)=>{
      let {recommendList,index} = this.data
      if(type==='pre'){
        (index===0)&&(index=recommendList.length);
        index-=1
      }else{
        (index===recommendList.length-1)&&(index=-1);
        index+=1
      }
      //更新index
      this.setData({index})
      let musicId = recommendList[index].id
      //将misicid回传至音乐详情页
      PubSub.publish('getMusicId',musicId)
      
    })
  },

  async getRecommendList(){
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList:recommendListData.recommend
    })
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