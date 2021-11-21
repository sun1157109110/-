// pages/songDetai/index.js
import moment from 'moment';
import PubSub from 'pubsub-js';
import request from '../../utils/request'
const appInstance =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    musicInfo:'',
    musicUrl:'',
    currentTime:'00:00',
    durationTime:'00:00',
    currentWidth:0
  },

  //点击播放音乐
  handleMusic(){
    let isPlay = !this.data.isPlay
    this.musicControl(isPlay,this.data.musicInfo.id,this.data.musicUrl)
  },

  //点击切换音乐
  handleSwitch(e){
    let {type} = e.currentTarget.dataset;
    this.musicPlay.stop();
    PubSub.subscribe('getMusicId',(msg,musicId)=>{
      this.getMusicInfo(musicId);
      this.musicControl(true,musicId);
      PubSub.unsubscribe('getMusicId')
    })
    //发布type消息给推荐页面
    PubSub.publish('switchType',type)
  },
  //控制音乐播放/暂停的回调
  async musicControl(isPlay,musicId,musicUrl){
    
    if(isPlay){
      if(!musicUrl){
        let resMusic = await request('/song/url',{id:musicId});
        musicUrl = resMusic.data[0].url;
        this.setData({musicUrl})
      }
      //播放器必备要素
      this.musicPlay.src = musicUrl;
      this.musicPlay.title = this.data.musicInfo.name
      this.musicPlay.play()
    }else{
      this.musicPlay.pause()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;
    this.getMusicInfo(musicId)
    if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId===musicId){
      this.setData({isPlay:true})
    }
    //创建背景音乐管理器实例对象并绑定在页面实例身上(其他函数可以用)
    this.musicPlay = wx.getBackgroundAudioManager()
    this.musicPlay.onPlay(()=>{
      this.changeMusicState(true)
      //修改全局音乐的id
      appInstance.globalData.musicId = musicId
    });
    this.musicPlay.onPause(()=>{
      this.changeMusicState(false)
    });
    //后台界面直接关闭的回调
    this.musicPlay.onStop(()=>{
      this.changeMusicState(false)
    });
    //监听背景音乐时间更新
    this.musicPlay.onTimeUpdate(()=>{
      let currentTime =moment(this.musicPlay.currentTime*1000).format('mm:ss');
      let currentWidth = (this.musicPlay.currentTime/this.musicPlay.duration)*500
      this.setData({currentTime,currentWidth})
    })
    this,this.musicPlay.onEnded(()=>{
      PubSub.publish('switchType','next');
      this.setData({
        currentWidth:0
      })
    })
  },
  //封装函数
  changeMusicState(isPlay){
    this.setData({isPlay})
    appInstance.globalData.isMusicPlay=isPlay;
  },

  //获取音乐详情信息
  async getMusicInfo(musicId){
    let resMusicInfo = await request('/song/detail',{ids:musicId});
    let durationTime = moment(resMusicInfo.songs[0].dt).format('mm:ss')
    this.setData({
      musicInfo:resMusicInfo.songs[0],
      durationTime
    })
    //动态修改音乐标题
    wx.setNavigationBarTitle({title:this.data.musicInfo.name})
    
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