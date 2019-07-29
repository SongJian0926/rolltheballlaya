var sharedCanvas
var context

var myScore = 0;
var myScoreTime = 0;


/**
 * 当前分页标记
 */
let pageIndex = 0;
let dataSize = 0;
let pageSize = 5;
let data;


/**
 * 分页相关
 */
let hasBeforPage;
let hasNextPage;

let beforCenterX;
let beforCenterY;
let nextCenterX;
let nextCenterY;
const { screenWidth, screenHeight, devicePixelRatio } = wx.getSystemInfoSync()
let currentDrawItemsNumber = 0;
let currentDrawFinishNumber = 0;
// let lastTouchEndX=0;
// let lastTouchEndY=0

let isInit = false;

/**
 * 绘制静态文本(静态文本只需要绘制一次)
 */
function drawStaticInfo() {
  if (isInit) {
    return;
  }
  isInit = true;

  //先清除整个画布
  // context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
  // console.log('重置Static')

  //提示信息 每周一凌晨刷新（从90%地方开始画）
  context.fillStyle = 'white'
  context.textAlign = 'center'
  context.font = "normal lighter " + sharedCanvas.width * 0.04 + "px arial";
  context.fillText('每周一凌晨刷新', sharedCanvas.width / 2, sharedCanvas.height * 0.95)

  //绘制分数列表背景
  // drawPic('img/bg.png',0,0,sharedCanvas.width,sharedCanvas.height,()=>{});
  drawPic("imgunpack/content.png", sharedCanvas.width * 0.1, sharedCanvas.height * 0.25, sharedCanvas.width * 0.8, sharedCanvas.height * 0.55, () => {
    drawPic("imgunpack/icon.png", sharedCanvas.width / 2 - (sharedCanvas.width * 0.15), sharedCanvas.height * 0.25 - (sharedCanvas.width * 0.15) + sharedCanvas.height * 0.55 * 0.03, sharedCanvas.width * 0.3, sharedCanvas.width * 0.3, () => { })
  });
}

function drawPic(path, x, y, w, h, next) {
  let img = wx.createImage();
  img.src = path;
  img.onload = () => {
    context.drawImage(img, x, y, w, h)
    if (next) {
      next();
    }
  }

}

function drawRankList(data) {
  // console.log(data.length, "准备绘制", pageIndex)
  //width = 80%-4 (0.06为边框)
  let cellWidth = sharedCanvas.width * 0.8 - sharedCanvas.width * 0.8 * 0.08
  //height = 54%-4 /6 一共5行数据+1行翻页
  let cellHeight = (sharedCanvas.height * 0.55 * 0.6) / 5
  //left = 10%+2
  let cellLeft = sharedCanvas.width * 0.1 + sharedCanvas.width * 0.8 * 0.04;
  //top = 18%+2
  let cellTop = sharedCanvas.height * 0.25 + sharedCanvas.height * 0.55 * 0.4 * 0.6;

  //清除内容重新画(列表区域)
  context.clearRect(cellLeft, cellTop, cellWidth, cellHeight * 5)
  context.fillStyle = 'rgba(140,219,226,1)'
  // context.drawImage('res/imgs/content.png', cellLeft, cellTop, cellWidth, cellHeight * 5)
  context.fillRect(cellLeft, cellTop, cellWidth, cellHeight * 5);


  currentDrawItemsNumber = 0
  currentDrawFinishNumber = 0

  data.map((item, index) => {
    //判断当前页展示的数据  [pageIndex*pageSize,(pageIndex+1)*pageSize-1
    if (!(index >= pageIndex * pageSize && index < (pageIndex + 1) * pageSize)) {
      return
    }

    let rowTop = cellTop + index % pageSize * cellHeight
    //判断当前条目的背景
    if (index % 2 == 0) {//偶数
      context.fillStyle = 'rgba(115,218,225,1)'
    } else {//奇数
      context.fillStyle = 'rgba(140,219,226,1)'
    }
    //这一行的顶部开始位置

    //先清除cell
    //top=18%，left=10%，width=80%,height=54%
    //要考虑4个单位的边框
    // context.clearRect(cellLeft, rowTop, cellWidth, cellHeight)
    //绘制条目背景
    //left=10%,top=18%+index%pageSize*cellHeight
    context.fillRect(cellLeft, rowTop, cellWidth, cellHeight)
    //设置排名颜色
    context.fillStyle = "white";
    if (index == 0) {
      drawPic('imgunpack/gold.png', cellLeft + cellHeight * 0.2, rowTop + cellHeight * 0.15, cellHeight * 0.5, cellHeight * 0.6, () => { })
    } else if (index == 1) {
      drawPic('imgunpack/silver.png', cellLeft + cellHeight * 0.2, rowTop + cellHeight * 0.15, cellHeight * 0.5, cellHeight * 0.6, () => { })
    } else if (index == 2) {
      drawPic('imgunpack/copper.png', cellLeft + cellHeight * 0.2, rowTop + cellHeight * 0.15, cellHeight * 0.5, cellHeight * 0.6, () => { })
    } else {
      //排行
      context.font = "normal bold " + cellHeight * 0.4 + "px arial";
      context.textAlign = 'left'
      context.textBaseline = 'middle'
      //left = 左边距+行高的20%，top=行高的中间
      context.fillText(index + 1, cellLeft + cellHeight * 0.3, rowTop + cellHeight * 0.5);
    }


    // 头像
    var image = wx.createImage();
    image.src = item.avatarUrl;
    image.onload = () => {
      //left = 左间距+行高的70%，top=这行的顶部+行高的10%，宽高为行高的80%
      context.drawImage(image, cellLeft + cellHeight * 0.8, rowTop + cellHeight * 0.1, cellHeight * 0.8, cellHeight * 0.8);
      currentDrawFinishNumber++;
      //图片加载完毕 注意:此处为异步加载可能会有数据不一致的情况
      // console.log("已加载---", currentDrawFinishNumber, "需要加载---", currentDrawItemsNumber)
      if (currentDrawFinishNumber >= currentDrawItemsNumber) {
        controller()
      }
    };

    //昵称

    context.textAlign = 'left'
    context.font = "normal lighter " + cellHeight * 0.3 + "px arial";
    // left = 左间距+行高*175%，top=这行的顶部+行高的50%
    context.fillText(item.nickname, cellLeft + cellHeight * 1.8, rowTop + cellHeight * 0.5);

    // 分数
    var score = 0
    try {
      score = JSON.parse(item.KVDataList[0].value).wxgame.score
    } catch (e) { }
    context.font = "normal bold " + cellHeight * 0.4 + "px arial";
    context.textAlign = 'right'
    //left = 90%-行高*20%,top=这行的顶部+行高的50%
    context.fillText(score + 'm', sharedCanvas.width * 0.85 - cellHeight * 0.2, rowTop + cellHeight * 0.5);
    currentDrawItemsNumber++;
    //解决最后空白的问题
    var row = index + 1;
    if (row == data.length) {
      while (row % 5 != 0) {
        if (row % 2 == 0) {//偶数
          context.fillStyle = 'rgba(115,218,225,1)'
        } else {//奇数
          context.fillStyle = 'rgba(140,219,226,1)'
        }
        let rowTop = cellTop + row % pageSize * cellHeight
        context.fillRect(cellLeft, rowTop, cellWidth, cellHeight)
        row++
      }
    }
  })
}

/**
 * 画用户的数据，位置参考静态框的位置
 */
function drawUserScore() {

  context.clearRect(sharedCanvas.width * 0.1, sharedCanvas.height * 0.8, sharedCanvas.width * 0.8, sharedCanvas.width * 0.8 / 3.6);
  //绘制个人数据背景 
  //绘制排行榜Star(size=sharedCanvas.width*0.4) 3.67/1
  drawPic("imgunpack/myRank.png", sharedCanvas.width * 0.1, sharedCanvas.height * 0.8, sharedCanvas.width * 0.8, sharedCanvas.width * 0.8 / 3.67, () => { });
  //高度9%
  let rankHeight = sharedCanvas.width * 0.8 / 3.67
  //宽度80%
  let rankWidth = sharedCanvas.width * 0.8
  //获取用户信息
  wx.getUserInfo({
    openIdList: ['selfOpenId'],
    lang: 'zh_CN',
    success: (res) => {
      // console.log('success', res.data)
      //avatar
      var image = wx.createImage()
      image.src = res.data[0].avatarUrl
      image.onload = () => {
        //left=10%+行高的20%，top=75%+行高的10%，width=行高的80%，height=行高的80%
        context.drawImage(image, sharedCanvas.width * 0.1 + rankWidth * 0.25, sharedCanvas.height * 0.8 + rankHeight * 0.25, rankHeight * 0.5, rankHeight * 0.5);
      }
      //nickname
      context.fillStyle = 'white'
      //文字大小=行高*25%
      context.font = "normal lighter " + rankHeight * 0.2 + "px arial";
      context.textAlign = 'left'
      context.textBaseline = 'middle'
      //left=10%+行高*120%，top=75+行高*50%
      // if (res.data[0].nickName.length > 5) {
      //   res.data[0].nickName = res.data[0].nickName.substring(0, 5) + '...';
      // }
      context.fillText(res.data[0].nickName, sharedCanvas.width * 0.1 + rankWidth * 0.25 + rankHeight * 0.6, sharedCanvas.height * 0.8 + rankHeight * 0.5);
      // score
      //文字大小=行高*30%
      context.font = "normal bold " + rankHeight * 0.25 + "px arial";
      context.textAlign = 'right';
      //right=90%-行高*20%，top=75%+行高*50%
      context.fillText(myScore + 'm', sharedCanvas.width * 0.9 - rankHeight * 0.2, sharedCanvas.height * 0.8 + sharedCanvas.width * 0.8 / 3.67 / 2);

      // console.log('绘制个人数据', res.data[0].nickName, myScore)
    }
  })



}


var getRankList = function () {
  wx.getFriendCloudStorage({
    keyList: ["frdscore"],
    success: res => {
      // console.log("getFriendCloudStorage->", res.data)
      data = filterData(res.data);
      // console.log('排序前', data)
      data.sort(compare)
      // console.log('排序后', data)
      // data = res.data 
      dataSize = data.length
      drawRankList(data)
    }
  })
}

let date = new Date();
date.setHours(0, 0, 0, 0);
let current_befor_Time = date.getTime() / 1000;
let currentDay = date.getDay();
//本周凌晨的时间戳
if (currentDay == 0) { //星期天
  currentDay = 7;
}
let current_monday_time = current_befor_Time - (currentDay - 1) * 24 * 60 * 60; //星期一减0天

/**
 * 过滤数据(数据必须先过滤然后进行排序)
 */
function filterData(data) {
  // console.log(data);
  var filterData = data.map((item, index) => {
    if (item.KVDataList.length == 0) {
      return item;
    }
    let json = JSON.parse(item.KVDataList[0].value);
    if (json.wxgame.update_time < current_monday_time) {
      //我们需要修改此条数据的
      json.wxgame.score = 0;
      item.KVDataList[0].value = JSON.stringify(json);
    }
    return item;
  }
  );
  return filterData;
}



var compare = function (data1, data2) {
  var score1 = 0
  if (data1.KVDataList.length > 0) {
    score1 = JSON.parse(data1.KVDataList[0].value).wxgame.score
  }
  var score2 = 0
  if (data2.KVDataList.length > 0) {
    score2 = JSON.parse(data2.KVDataList[0].value).wxgame.score
  }
  if (score1 > score2) {
    return -1
  } else if (score1 < score2) {
    return 1
  } else {
    return 0
  }
}


var controller = function () {
  /**
    * 绘制分页table
    */
  hasNextPage = !((pageIndex + 1) * pageSize >= dataSize)
  hasBeforPage = pageIndex != 0;
  // console.log(hasBeforPage, hasNextPage)
  // if (hasBeforPage) {
  var leftImage = wx.createImage()
  leftImage.src = 'imgunpack/beforPage.png'
  leftImage.onload = () => {
    //left=左间距+行宽*20%
    context.drawImage(leftImage, sharedCanvas.width * 0.01, sharedCanvas.height / 2 - sharedCanvas.width * 0.08 * 1.34 / 2, sharedCanvas.width * 0.08, sharedCanvas.width * 0.08 * 1.34)
  }
  //中心x=left+行高*0.5
  beforCenterX = (sharedCanvas.width * 0.01 + sharedCanvas.width * 0.08 / 2) * (screenWidth * devicePixelRatio) / sharedCanvas.width
  //中心y=top+行高*0.5
  beforCenterY = (sharedCanvas.height / 2) * (screenHeight * devicePixelRatio) / sharedCanvas.height
  // }

  // if (hasNextPage) {
  var rightImage = wx.createImage()
  rightImage.src = 'imgunpack/nextPage.png'
  rightImage.onload = () => {
    //left=左间距+行宽*60%
    context.drawImage(rightImage, sharedCanvas.width * 0.91, sharedCanvas.height / 2 - sharedCanvas.width * 0.08 * 1.34 / 2, sharedCanvas.width * 0.08, sharedCanvas.width * 0.08 * 1.34)

  }
  //中心x=left+行高*0.5
  nextCenterX = (sharedCanvas.width * 0.91 + sharedCanvas.width * 0.08 / 2) * (screenWidth * devicePixelRatio) / sharedCanvas.width
  //中心y=top+行高*0.5
  nextCenterY = (sharedCanvas.height / 2) * (screenHeight * devicePixelRatio) / sharedCanvas.height
  // }
  // console.log('w=',sharedCanvas.width,'h=',sharedCanvas.height)
  // console.log('w1=',screenWidth*devicePixelRatio,"h1=",screenHeight*devicePixelRatio)

}


function distance(x1, y1, x2, y2) {
  let dx = Math.abs(x1 - x2);
  let dy = Math.abs(y1 - y2);
  return Math.sqrt(dx * dx + dy * dy);
};


/**
* 用户操作获取
*/
wx.onTouchEnd((touches, changedTouches, timeStamp) => {
  if (currentDrawFinishNumber == currentDrawItemsNumber/**&&lastTouchEndX!=touches.changedTouches[0].clientX&&lastTouchEndY!=touches.changedTouches[0].clientY**/) {
    //注意:此处时间可能会被多次连续触发
    // console.log(touches.changedTouches[0])
    // console.log('像素密度',devicePixelRatio);
    // lastTouchEndX=touches.changedTouches[0].clientX
    // lastTouchEndY=touches.changedTouches[0].clientY
    /**
     * 需要判断点击的位置   需要保存两个点的圆心与半径
     * touches[].screenX  touches[].screenY
     */

    //1563 2780    
    if (hasBeforPage) {
      if (distance(beforCenterX, beforCenterY, touches.changedTouches[0].clientX * devicePixelRatio, touches.changedTouches[0].clientY * devicePixelRatio) < 100) {
        // console.log('上一页')
        pageIndex--;
        drawRankList(data)
      }

    }

    if (hasNextPage) {
      // console.log(nextCenterX, nextCenterY,hasNextPage)
      if (distance(nextCenterX, nextCenterY, touches.changedTouches[0].clientX * devicePixelRatio, touches.changedTouches[0].clientY * devicePixelRatio) < 100) {
        // console.log('下一页')
        pageIndex++;
        drawRankList(data)

      }
    }
  }

})


wx.onMessage(message => {

  // console.log("message->", message)

  if (message.type == "ui_info") {
    sharedCanvas = wx.getSharedCanvas()
    context = sharedCanvas.getContext('2d')

    // console.log("sharedCanvas->", sharedCanvas.width, sharedCanvas.height)
    drawStaticInfo()
    getRankList()
    drawUserScore()
  } else {
    let newScore = JSON.parse(message.data[0].value).wxgame.score;

    //如果新分数大于旧分数 并且旧分数过期
    if (newScore > myScore || (myScoreTime < current_monday_time)) {
      wx.setUserCloudStorage({
        KVDataList: message.data,
        success: () => {
          // console.log("upload score success!")
          myScore = newScore
          getRankList()
          wx.getUserCloudStorage({
            keyList: ["frdscore"],
            success: res => {
              // console.log("getUserCloudStorage->", res)
              if (res.KVDataList.length > 0) {
                myScore = JSON.parse(res.KVDataList[0].value).wxgame.score
                myScoreTime = JSON.parse(res.KVDataList[0].value).wxgame.update_time
                if (myScoreTime < current_monday_time) {
                  myScore = 0;
                }
                drawUserScore()
              }
            }
          })
        }
      });
    }
  }
})


wx.getUserCloudStorage({
  keyList: ["frdscore"],
  success: res => {
    // console.log("getUserCloudStorage->", res)
    if (res.KVDataList.length > 0) {
      myScore = JSON.parse(res.KVDataList[0].value).wxgame.score
      myScoreTime = JSON.parse(res.KVDataList[0].value).wxgame.update_time
      if (myScoreTime < current_monday_time) {
        myScore = 0;
      }
    }
  }
})
