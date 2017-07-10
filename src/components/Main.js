require('normalize.css/normalize.css');require('styles/App.less');import React from 'react';import ReactDOM from 'react-dom';// get data related to imgsvar imgData = require('../data/img.json');// 自执行函数，用于转换实际的 图片 url 信息imgData = (function getImageURL(imgDataArr){  for (var i = 0; i < imgDataArr.length; i++) {    var singleImgData = imgDataArr[i];    singleImgData.imgUrl = require('../images/'+ singleImgData.fileName);    imgDataArr[i] = singleImgData;  }  return imgDataArr;})(imgData);// 获取区间随机数var getRangeRandom = (low,high) => Math.floor(Math.random()*(high-low)+low);// 获取 -30————30度的随机角度var get30DegRandom = () =>{  return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random()*30)};class ImgFigure extends React.Component {  constructor(props) {   super(props);   this.handleClick = this.handleClick.bind(this); }  handleClick(e) {    e.stopPropagation();    e.preventDefault();    if (this.props.arrange.isCenter) {      this.props.inverse();    }else{      this.props.center();    }  }  render() {    var styleObj = {};    if (this.props.arrange.pos) {      styleObj = this.props.arrange.pos;    }    if(this.props.arrange.rotate){      (['MozTransform','msTransform','webkitTransform','transform']).forEach(function(value){        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';      }.bind(this))    }    if (this.props.arrange.isCenter) {      styleObj.zIndex = 11;    }    var imgFigureClassName = 'img-figure';    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse': '';    return(        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>          <img src={this.props.data.imgUrl}               alt={this.props.data.title} />          <figcaption>            <h3 className="img-title">{this.props.data.title}</h3>            <div className="img-back" onClick={this.handleClick}>              <p>                {this.props.data.desc}              </p>            </div>          </figcaption>        </figure>      );  }}class ControllerUnit extends React.Component{  constructor(props) {    super(props);  }  render() {    var controllerUnitClassName = "controllerUnit";    if (this.props.arrange.isCenter) {      controllerUnitClassName += ' is-center';      if (this.props.arrange.isInverse) {        controllerUnitClassName += ' is-inverse';      }    };    return(      <span className={controllerUnitClassName}></span>    );  }}class AppComponent extends React.Component {  constructor(props) {   super(props);   this.Constant = {     centerPos: {       left: 0,       right: 0     },     hPosRange: {       leftX: [0,0],       rightX: [0,0],       y: [0,0]     },     vPosRange: {       x: [0,0],       y: [0,0]     }   };   this.state = {     imgsArrangeArr: [      //  {      //     pos: {      //       left: '0',      //       top: '0'      //     },      //     rotate: 0,      //     isInverse: false,      //     isCenter: false      //  }     ]   }; }  // var imgFigures = [];  // imgData.forEach(function(value){  //   imgFigures.push(<ImgFigure data={value}>);  // });  inverse(index){    return function(){      var imgsArrangeArr = this.state.imgsArrangeArr;      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;      this.setState({        imgsArrangeArr: imgsArrangeArr      })    }.bind(this)  }  rearrange(centerIndex){    let imgsArrangeArr = this.state.imgsArrangeArr,        Constant = this.Constant,        centerPos = Constant.centerPos,        hPosRange = Constant.hPosRange,        vPosRange = Constant.vPosRange,        hPosRangeLeftX = hPosRange.leftX,        hPosRangeRightX = hPosRange.rightX,        hPosRangeY = hPosRange.y,        vPosRangeY = vPosRange.y,        vPosRangeX = vPosRange.x,        imgsArrangeTopArr = [],        topImgNum = Math.floor(Math.random() * 2),        topImgSpliceIndex = 0,        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);    // 居中中央图片    imgsArrangeCenterArr[0] = {      pos: centerPos,      isCenter: true,      isInverse: false,      rotate: 0    }    // 取出上区的一张或0张图片    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);    // 布局上侧的图片    imgsArrangeTopArr.forEach((v,index)=>(      imgsArrangeTopArr[index] = {        pos: {          top: getRangeRandom(vPosRangeY[0],vPosRangeY[1]),          left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])        },        isCenter: false,        isInverse: false,        rotate: get30DegRandom()      }    ))    // 布局左右两侧的图片    for (var i = 0,j = imgsArrangeArr.length,k = j/2; i < j; i++) {      let hPosRangeLORX = null;      if (i < k) {        hPosRangeLORX = hPosRangeLeftX;      }else{        hPosRangeLORX = hPosRangeRightX;      }      imgsArrangeArr[i] = {        pos: {          top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),          left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])        },        isCenter: false,        isInverse: false,        rotate: get30DegRandom()      };    }    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);    }    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);    this.setState({      imgsArrangeArr: imgsArrangeArr    });  }  center(index) {    return function(){      this.rearrange(index);    }.bind(this)  }  componentDidMount() {    // 展示区域的宽高    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),        stageW = stageDOM.scrollWidth,        stageH = stageDOM.scrollHeight,        halfStageW = Math.floor(stageW/2),        halfStageH = Math.floor(stageH/2);    // 获取一个 ImgFigure 的宽高    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),        imgW = imgFigureDOM.scrollWidth,        imgH = imgFigureDOM.scrollHeight,        halfImgW = Math.floor(imgW/2),        halfImgH = Math.floor(imgH/2);    // 计算中心图片的位置点    this.Constant.centerPos = {      left: halfStageW - halfImgW,      top: halfStageH - halfImgH    }    // 分别计算左，右，上侧区域的图片位置取值范围    //左右    this.Constant.hPosRange.leftX[0] = -halfImgW;    this.Constant.hPosRange.leftX[1] = halfStageW - halfImgW * 3;    this.Constant.hPosRange.rightX[0] = halfStageW + halfImgW;    this.Constant.hPosRange.rightX[1] = stageW - halfImgW;    this.Constant.hPosRange.y[0] = -halfImgH;    this.Constant.hPosRange.y[1] = stageH - halfImgH;    //上下    this.Constant.vPosRange.y[0] = -halfImgH;    this.Constant.vPosRange.y[1] = halfStageH - halfImgH * 3;    this.Constant.vPosRange.x[0] = halfStageW - imgW;    this.Constant.vPosRange.x[1] = halfStageW;    this.rearrange(Math.floor(Math.random()*15));  }  render() {    var imgFigures = [],        controllerUnits = [];    imgData.forEach(function(value,index){      if (!this.state.imgsArrangeArr[index]) {        this.state.imgsArrangeArr[index] = {          pos:{            left: 0,            top: 0          },          isCenter: false,          isInverse: false,          rotate: 0        }      }      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index}                        arrange = {this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)} />)      controllerUnits.push(<ControllerUnit key={index}                        arrange = {this.state.imgsArrangeArr[index]} />);    }.bind(this));    return (      <section className="stage" ref="stage">        <section className="imgs">          {imgFigures}        </section>        <nav className="ctrl">          {controllerUnits}        </nav>      </section>    );  }}AppComponent.defaultProps = {};export default AppComponent;