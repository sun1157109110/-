// pages/video/index.js
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoNavData: [],
    navId: '',
    videoList: [],
    onePageList:[],
    videoUpdateList:[],
    isRefresher:false
  },
  //进入搜索页面
  handleSearch(){
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },

  handleTap(e) {
    this.setData({
      navId: e.currentTarget.id * 1,
      videoList: [],
      vId: ''
    });

    this.getVideoList(this.data.navId);
  },
  handlePlay(e) {
    this.setData({
      vId: e.currentTarget.id
    });
    let videoContext = wx.createVideoContext(e.currentTarget.id);
    let {videoUpdateList} = this.data;
    let videoItem = videoUpdateList.find((item)=>item.vId===e.currentTarget.id)
    if(videoItem){
      videoContext.seek(videoItem.updateTime)
    }
    
  },
  //更新播放进度
  handleUpdatePlay(e) {
    let {videoUpdateList} = this.data;
    let videoUpdateObj = videoUpdateList.find((item)=>item.vId===e.currentTarget.id)
    if(videoUpdateObj){
      videoUpdateObj.updateTime=e.detail.currentTime
    }else{
      console.log('1');
      let updateObj = {vId:e.currentTarget.id,updateTime:e.detail.currentTime};
      videoUpdateList.push(updateObj)
    };
    this.setData({
      videoUpdateList
    })

  },
  handleEnd(e){
    let {videoUpdateList} = this.data;
    let videoItemIndex = videoUpdateList.findIndex((item)=>item.vId===e.currentTarget.id);
    videoUpdateList.splice(videoItemIndex,1);
    this.setData({
      videoUpdateList
    })
  },
  //上拉重新刷新请求
  handleRefresh(){
    this.getVideoList(this.data.navId);
    
  },
  //下拉继续刷新数据
  handleTolower(){
    //前端分页 获取下一页数据
    let videoList = this.data.videoList;
    
    let newList = videoList.concat(this.data.onePageList)
    this.setData({
      videoList:newList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoNav();
  },
  async getVideoNav() {
    let resVideoNav = await request('/video/group/list');
    this.setData({
      videoNavData: resVideoNav.data.slice(0, 12),
      navId: resVideoNav.data[0].id
    })
    await this.getVideoList(this.data.navId);
    this.setData({
      onePageList:[...this.data.videoList]
    })
  },
  async getVideoList(navId) {
    if (!navId) {
      return
    }
    //显示正在加载
    wx.showLoading({
      text: "正在加载",
      mask: true
    })
    //动态获取导航栏视频
    let resVideoData = await request('/video/group', {
      id: navId
    });
    this.setData({
      videoList: resVideoData.datas.map((item, index) => ({
        id: index,
        ...item
      })),
      isRefresher:false
    });
    
    wx.hideLoading()
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