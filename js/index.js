$(function(){
	getClass();
	getGoodsList();
	Getbanner();
	Getdetail();
	Getcart();
//	var TexT=$(".search");
//	TexT[0].onblur=function(){
//		window.location.reload();
		Getsearch();
//	}
	
})
/*获取商品分类函数*/
function getClass(){
	var $listBox=$(".listBox");
	if($listBox.length){
		getdata();
	}
	
	/*AJAX获取分类数据*/
	function getdata(){
		getnumber();
		$.getJSON("http://datainfo.duapp.com/shopdata/getclass.php",function(data){
			
			if(data.length){
				for(var i=0;i<data.length;i++){
					var $thislist=$("<li>"+data[i].className+"</li>");
					$thislist[0].classID=data[i].classID;
					$listBox.append($thislist);
					
					$thislist.bind("click",function(){
						//alert(this.classID);
						/*页面跳转，并且拼接商品类ID参数，以便下一个页面获取商品列表使用*/
						window.location="listgoods.html?classID="+encodeURI(this.classID);
					})
				}
			}
			
		})
	}
}
/*获取商品列表*/
function getGoodsList(){
	var $goodsBox=$(".goodsList");
	/*获取地址栏参数*/
	var classID=GetQueryString("classID");
	/*判断当前页面*/
	if($goodsBox.length){
		getdata();
	}
	/*获取商品数据*/
	function getdata(){
		getnumber();
		var $Name=$(".className");
//		alert($Name)
		$.ajax({
			url:"http://datainfo.duapp.com/shopdata/getGoods.php",
			data:{classID:classID},
			dataType:"jsonp",
			success:function(data){
				
				if(data){
					$.each(data,function(i){
						var vprice=null;
						if(data[i].discount==0){
							vprice=data[i].price;
						}else{
							vprice=parseInt( data[i].price/(data[i].discount*0.1));
						}
						 
						var box=$('<div class="goods"><div class="imgbox"><img src="'+
							data[i].goodsListImg+'"></div><div class="goodesName">'+
							data[i].goodsName+'</div><div><span class="price">'+
							data[i].price+'</span><span class="vprice">'+
							vprice+'</span></div></div>');
							box[0].goodsID=data[i].goodsID;
							box[0].classID=data[i].classID;
							box[0].index=data[i].index;
							box.bind("click",function(){
//								alert(this.goodsID);
//								alert(i)
								if(window.localStorage){
									localStorage.setItem("goodsID",this.goodsID);
									localStorage.setItem("classID",this.classID);
									localStorage.setItem("num",i);
								}
								window.location="detaile.html?goodsID="+encodeURI(this.goodsID);
							})
//							alert(data[i].discount)
							$Name.innerHTML=data[i].className;
							$goodsBox.append(box);
					})
				}
			}
		});
	}
	
}
//首页图片轮播  获取首页数据
function Getbanner(){
	var swiperbox=$(".banner");
	if(swiperbox.length){
		getdata();
	}
	function getdata(){
		getnumber();
		$.ajax({
			url:"http://datainfo.duapp.com/shopdata/getBanner.php",		
			dataType:"jsonp",
			success:function(data){
				$.each(data, function(i) {
					var Data=data[i].goodsBenUrl.substring(1);
					var goodsben=Data.split(",");
					var bannerImg=$("<div class='swiper-slide'><img src="+goodsben[0]+"/></div>")
					swiperbox.append(bannerImg);
//					console.log(goodsben[4]);                                                          
				});
				var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        spaceBetween: 30,
		   		 });
			}
			
			
		});
	}
}



//搜索页获取数据
 function Getsearch(){
 	var content=$(".content"); 
 	var sear=$(".submit");
 	if(content.length){
 		getdata();
 	}
 	var TexT=$(".search")
 	var Tex=$(".search").value;
 	function getdata(){
 		getnumber();
 		$.ajax({
 			type:"get",
 			url:"http://datainfo.duapp.com/shopdata/selectGoodes.php",
 			async:true, 			
 			data:{
 				selectText:Tex,
 				pageCode:"0",
 				linenumber:"10"
 			},
 			dataType:"jsonp",
 			success:function(data){
 				console.log(data);
 			}
 		});
 		
 		$.getJSON("http://datainfo.duapp.com/shopdata/getclass.php",function(data){
			
			if(data.length){
				for(var i=0;i<data.length;i++){
					var $thislist=$("<p>"+data[i].className+"</p>");
					$thislist[0].className=data[i].className;
					$thislist[0].classID=data[i].classID;
					$thislist.css({"color":getRandomColor})
					content.append($thislist);
						var num=parseInt(Math.random()*20+16);
						$thislist.css({"font-size":num})
//					}					
					$thislist.bind("click",function(){
						/*页面跳转，并且拼接商品类ID参数，以便下一个页面获取商品列表使用*/
						var that=this.classID
						Tex=this.className;
						TexT[0].value=this.className;
						sear.bind("click",function(){
							window.location="listgoods.html?className="+encodeURI(that);
						})
					})
					
				}
			}
			
		})
 		
 		var getRandomColor = function(){  

  				return  "#" +  
    				(function(color){  
    					return (color +=  "0123456789abcdef" [Math.floor(Math.random()*16)])  
    					&& (color.length == 6) ?  color : arguments.callee(color);  
  					})("");  
		}
 	}
 }
 
// 获取商品详情
function Getdetail(){
	var goodsID=GetQueryString("goodsID");	
	var classID=GetQueryString("classID");	
	var ClasID=localStorage.getItem("classID")
	var num=localStorage.getItem("num")
	var id=localStorage.getItem("ID")
	var swiperbox=$(".detail");
	if(swiperbox.length){
		getdata();
	}
	
	function getdata(){
		$(function(){
			getnumber();
		//	showCar();
			
			
				$.ajax({
		 			type:"get",
		 			url:"http://datainfo.duapp.com/shopdata/getGoods.php",
					data:{
						classID:ClasID,
					},
		 			async:true, 			
		 			dataType:"jsonp",
		 			success:function(data){
		 					var Data=data[num].imgsUrl.substring(1,data[num].imgsUrl.length);
							var goodsben=Data.split(",");
//							console.log(data[num]);
							var divp=$("<div class='swiper-slide'><img src="+goodsben[0]+"/></div>");
							var divp1=$("<div class='swiper-slide'><img src="+goodsben[1]+"/></div>");
							var divp2=$("<div class='swiper-slide'><img src="+goodsben[2]+"/></div>");
		 					var swiper=$(".swiper-wrapper");
		 					var p1=$("<p>"+data[num].goodsName+"</p>");
		 					var p2=$("<p>￥"+data[num].price+"</p>");
		 					var main=$(".detail-main");
		 					main.append(p1);
		 					main.append(p2);
		 					swiper.append(divp);
		 					swiper.append(divp1);
		 					swiper.append(divp2);
		 				var swiper = new Swiper('.swiper-container', {
					        pagination: '.swiper-pagination',
					        slidesPerView: 'auto',
					        paginationClickable: true,
					        spaceBetween: 30
				   		 });
		 				$("button").bind("click",function(){
		 					window.location.reload();
							updataCar({userID:"zhangjing",goodsID:data[num].goodsID,number:1});							
		 				})
		 			}
		 		});
		 		
			})
		
	}
	
}
//购物车添加
function Getcart(){
	var box=$("#mianbox");
	if(box.length){		
		showCar()
	}	
		function showCar(){
			getnumber();
			$.ajax({
				url:"http://datainfo.duapp.com/shopdata/getCar.php",
				data:{userID:"zhangjing"},
				dataType:"jsonp",
				success:function(data){
					var $box=$("#mianbox");
					if(data.length){
						$.each(data,function(i){
							var $boxmin=$("<div class='cart'><img src='"+data[i].goodsListImg+"' /><p>"+data[i].price+"</p><span class='numberBox'>"+data[i].number+"</span></div>");
							var $btnC=$("<button goodsID='"+data[i].goodsID+"' number='"+data[i].number+"'>-</button>");
							var $btnA=$("<button goodsID='"+data[i].goodsID+"' number='"+data[i].number+"'>+</button>");
							$boxmin.append($btnC);
							$boxmin.append($btnA);
							$box.append($boxmin);
							$btnC.bind("click",function(){
								var numb=parseInt($(this).attr("number"))-1;
								if(numb<0){
									numb=0;
								}
								updataCar({userID:"zhangjing",goodsID:$(this).attr("goodsID"),number:numb});
								window.location.reload();
							})
							$btnA.bind("click",function(){
								var numb=parseInt($(this).attr("number"))+1;
								updataCar({userID:"zhangjing",goodsID:$(this).attr("goodsID"),number:numb});
								window.location.reload();
							})
						})
					}
					
				}
			})
		}
}
function getnumber(){
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/getCar.php",
		data:{userID:"zhangjing"},
		dataType:"jsonp",
		success:function(data){
			if(data.length){
				var number=data.length;
			}
			$(".shopNumber").text(number);
		}
	})
}
function updataCar(opt){
	$.get("http://datainfo.duapp.com/shopdata/updatecar.php",opt,function(data){
		console.log(data);
	})
}
/*获取URL参数方法*/
function GetQueryString(name){
	/*定义正则，用于获取相应参数*/
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	 /*字符串截取，获取匹配参数值*/
     var r = window.location.search.substr(1).match(reg);
	 /*但会参数值*/
     if(r!=null)return  decodeURI(r[2]); return null;
}