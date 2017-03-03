//tool.js
//跨浏览器获取视口大小
function getinner()
{
	if (typeof window.innerWidth != 'undefined') {
		return {
				width:window.innerWidth,
				height:window.innerHeight
		}
	}else
	{
			return {
				width:document.documentElement.clientWidth,
				height:document.documentElement.clientHeight
		}
	}	

}

//跨浏览器获取style
function getstyle(element,attr)
{
	if(typeof window.getComputedStyle != 'undefined')
			{
					//w3c
					return window.getComputedStyle(element,null)[attr];

			}
			else if(typeof element.currentStyle != 'undefined')
			{
					//IE

					return element.currentStyle[attr];
			}

}




//判断class是否存在
function hasClass(element,className) {
	// body...
 return	element.className.match(new RegExp("'(\\s|^)'+className+'(\\s|$)'"));å
}

//跨浏览器添加link规则
function insertRule(sheet,selectorText,cssText,position) {
	// body...
		if (typeof sheet.insertRule != 'undefined') {
		//w3c
		// sheet.insertRule('body{background:red}',0);
		  sheet.insertRule(selectorText+'{'+cssText+'}',position);
	}else if (typeof sheet.addRule != 'undefined') 
	{//IE
		//第一个参数 选择器 第二个 css样式 第三个 位置
		// sheet.insertRule('body','background:red',0);
     sheet.addRule(selectorText,cssText,position);
	}
}



//获取event对象
function getevent(event)
{
	return  event || window.event;
}

//事件绑定  传统事件绑定 现代事件绑定
//用户或浏览器事件绑定执行方法
//在绑定事件时 w3c 绑定方法体this 是当前绑定的对象 但是IE却时window
// function addEvent(obj,type,fn)
// {
// 	//相同元素 给同一个事件绑定多次相同的函数多次
// 	//绑定
//    if (typeof obj.addEventListener != 'undefined') {

//    	obj.addEventListener(type,fn,false);
//    	//最后一个参数 是完c的捕获 一般不捕获false

//    }else if(typeof obj.attatchEvent != 'undefined'){
//    	//针对IE的匿名函数纠正 但是这里需要与删除做对应
//    	//删除时 删的fn有引用 但是这里改为匿名函数后 我们找不到对应的引用 无法删除
//    	//指定的引用  要对应对删除的函数 做处理
//    	//还有attachEvent绑定函数时 执行时 会自动将event对象传递给函数
//    	//使用匿名函数后 就函数默认就收不到了 需要自己将事件对象传过去
//    	//call和匿名函数 进行this的传递时
//    	obj.attatchEvent('on'+type,function(){
//    		fn.call(obj,window.event);//如果是函数 使用call 解决IE的this不对
//    		//这个call函数的第一个参数 如果是函数调用 就会在函数作用域中的this
//    		//纠正为引用对象为当前obj对象节点
//    	});

//    }


// }


function addEvent(obj,type,fn)
{
	//相同元素 给同一个事件绑定多次相同的函数多次
	//绑定
   if (typeof obj.addEventListener != 'undefined') {

   	obj.addEventListener(type,fn,false);
   	//最后一个参数 是完c的捕获 一般不捕获false

   }else if(typeof obj.attatchEvent != 'undefined'){

   		//创建哈希表 存储事件对象
   		//为了让删除函数 找到删除的 函数的引用 对传入的对象
   		//添加events属性 达到共享 管理这里每次的添加事件信息
   		if(!obj.events)obj.events={};
   	
   		if (!obj.events[type]) {
	//创建一个存放事件处理的函数的数组
   			obj.events[type]=[];
   			//把第一次的事件处理的函数先存储到第一个位置上
   		if(obj['on'+type])	obj.events[type][0]=fn;
   		
   		}else if(addEvent.equal(obj.events[type],fn)){
   			return false;
   		}
   		//从第二次开始我们用事件计数器来存储
   		obj.events[type][addEvent.ID++]=fn;

   		// obj['on'+type]= function(){
   		// 	for (var i in obj.events[type])
   		// 	{
   		// 		obj.events[type][i]();
   		// 	}
   		// }

   		obj['on'+type]=addEvent.exec;
   		


   }


}
//如果不是一个执行函数的就都添加可执行
//同一个执行函数进行屏蔽
addEvent.equal = function (es,fn){

	for (var in es)
	{
		if(es[i]==fn) return false;
	}
	return true;
}
//
addEvent.exec=function (event){
	var e= event|| window.event;
	var es =this.events[e.type];
	for (var i in es) {
		// this.events[e.type][i].();
		//解决将obj对象传给要调用的函数的this
		//call 第一个参数永远传给this 第二个参数 才是参数列表第一个吗
		es[i].call(this,e);
	}
}
addEvent.ID = 1 ;
//为每一个事件添加一个计数器 解决IE 第一步
//现代事件绑定 IE 多次绑定 执行顺序 无法解决 第二 绑定删除 IE无法解决 第三 解决内存
//传统事件绑定 实现
function ieAddEvent
{

}

function ieRemoveEvent
{

}

//删除事件
// function removeEvent(obj,type,fn)
// {
// 	if (typeof obj.removeEventListener != 'undefined') {

// 		obj.removeEventListener(type,fn,false);

// 	}else if(typeof obj.detachEvent != 'undefined')
// 	{
// 		obj.detachEvent('on'+type,fn);
// 	}
// }

function removeEvent(obj,type,fn)
{
	if (typeof obj.removeEventListener != 'undefined') {

		obj.removeEventListener(type,fn,false);

	}else if(typeof obj.detachEvent != 'undefined')
	{
		for (var i in obj.events[type]) {
			if (obj.events[type][i]==fn) {
				delete obj.events[type][i];
			}
		}
	}
}

// 阻止默认行为
 function predef(event)
 {
 	var e = getevent(event);
 	if (typeof e.preventDefault != 'undefined') {
 		//w3c

 		e.preventDefault();

 	}else
 	{


 		//IE
 		e.returnValue = false;
 	}
 }







