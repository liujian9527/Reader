$(function(){
	
	(function(){
		//本地存储start
		var Util=(function(){
			var prefix='html5_reader_';
			var storageGetter=function(key){
				return localStorage.getItem( prefix + key)
			}
			var storageSetter=function(key,val){
				return localStorage.setItem( prefix + key,val)
			}
			//数据解密
			var getBSONP=function(url, callback) {
				return $.jsonp({
					url : url,
					cache : true,
					callback : "duokan_fiction_chapter",
					success : function(result) {
						//debugger
						var data = $.base64.decode(result);
						var json = decodeURIComponent(escape(data));
						console.log(JSON.parse(json))
						callback(json);
					}
				});
	
			};
			return {
				getBSONP:getBSONP,
				storageGetter:storageGetter,
				storageSetter:storageSetter
			}
		})()
		//本地存储end
			var Dom={
			    bottom_tool_bar : $('#bottom_tool_bar'),
				top_nav:$('#top-nav'),
				bottom_nav:$('.bottom-nav'),
				font_container:$('.font-container'),
				font_button:$('#font-button'),
				bk_container:$('.bk-container'),
				day_icon:$('#day_icon'),
				night_icon:$('#night_icon')
			}
			var ScrollLock = false;
			var win=$(window);
			var Doc=document;
			var Body=$('body');
			var Screen = Doc.body;
			var RootContainer=$('#fiction_contianer');
			var initBackGround;
			var initDay;
			var readerModel;
			var readerUI;
		function main(){
			//todo 整个项目的入口函数
			readerModel =ReaderModel();
		    readerUI=ReaderBaseFrame(RootContainer);
			readerModel.init(function(data){
				readerUI(data);
				Dom.bottom_tool_bar.show();
			});
			EventHanlder();
		}
		function ReaderModel(){
			//数据层 todo 实现和阅读器相关的数据交互的方法
			
			var Chapter_id;
			var ChapterTotal;
			var init=function(UIcallback){
				getFictionInfo (function(){
					getCurChapterContent(Chapter_id,function(data){
						UIcallback && UIcallback(data);
					})
				})
			}
			
			var getFictionInfo = function(callback){	
				$.get('data/chapter.json',function(data){
					//获得章节信息的回调
					Chapter_id=Util.storageGetter('last_chapter_id');
					if(Chapter_id==null){
						Chapter_id=data.chapters[1].chapter_id;
					}
					
					ChapterTotal=data.chapters.length;
					callback && callback();
				},'json');
			}
			var getCurChapterContent=function(chapter_id,callback){
				$.get('data/data'+chapter_id+'.json',function(data){
					if(data.result == 0){  //数据接收成功
						var url= data.jsonp;
						Util.getBSONP(url,function(data){
						    $('#init_loading').hide();
							callback && callback(data);
						});
					}
				},'json');
			}
			
			var prevChapter=function(UIcallback){
				Chapter_id=parseInt(Chapter_id,10);
				if(Chapter_id>1){
					Chapter_id-=1;
				}else{
					Chapter_id=4;
					
				}
				getCurChapterContent(Chapter_id,UIcallback);
				Util.storageSetter('last_chapter_id',Chapter_id);

			}
			var nextChapter=function(UIcallback){
				Chapter_id=parseInt(Chapter_id,10);
				//console.log(ChapterTotal)  == 270
				//4=ChapterTotal
				if(Chapter_id<4){
					Chapter_id+=1;
				}else{
					Chapter_id=1;
				}
				getCurChapterContent(Chapter_id,UIcallback);
				Util.storageSetter('last_chapter_id',Chapter_id);
			}
			return {
				init:init,
				prevChapter:prevChapter,
				nextChapter:nextChapter
			}
		}
		function ReaderBaseFrame(container){
			//Ui展示 todo 渲染基本的UI结构
			function parseChapterData(jsonData){
				var jsonObj=JSON.parse(jsonData);
				var html='<h4>'+jsonObj.t+'</h4>';
				for (var i=0; i<jsonObj.p.length; i++) {
					html+='<p>'+jsonObj.p[i]+'</p>'
				}
				return html;
			}
			return function(data){
				container.html(parseChapterData(data))
			}
		}
		function EventHanlder(){
			//控制层 todo 交互的事件的绑定

				$('#action-mid').on('click',function(){
					if (Dom.top_nav.css('display') == 'none') {
						Dom.top_nav.show();
						Dom.bottom_nav.show();
						Dom.font_container.hide();
						Dom.font_button.removeClass('current');
					} else{
						Dom.top_nav.hide();
						Dom.bottom_nav.hide();
						Dom.font_container.hide();
						Dom.font_button.removeClass('current');
					}
				})
				//顶栏底栏 toggle end		
				Dom.font_button.on('click',function(){
					if (Dom.font_container.css('display')=='none') {
						Dom.font_container.show();
						Dom.font_button.addClass('current');
					} else{
						Dom.font_container.hide();
						Dom.font_button.removeClass('current');
					}
				})
				//页面设置功能 end		
				win.on('scroll',function(){
					    Dom.top_nav.hide();
						Dom.bottom_nav.hide();
						Dom.font_container.hide();
						Dom.font_button.removeClass('current');
				})
				//
		    	

				var initFontSize=Util.storageGetter('font-size');
			    initFontSize=parseInt(initFontSize);
				if (!initFontSize) {
					initFontSize=14;
				}
				RootContainer.css('font-size',initFontSize);
				
				//
				$('#large-font').on('click',function(){
		
					initFontSize+=1;
					if (initFontSize>22) {
						initFontSize=22;
					}
					RootContainer.css('font-size',initFontSize);
					Util.storageSetter('font-size',initFontSize)
				})
				$('#small-font').on('click',function(){
					initFontSize-=1;
					if (initFontSize<12) {
						initFontSize=12;
					}
					RootContainer.css('font-size',initFontSize);
					Util.storageSetter('font-size',initFontSize)
				})	
				//
			Background();
			function Background(){
					var colorArr = [{
						value : '#f7eee5',
						name : '米白',
						font : ''
					}, {
						value : '#e9dfc7',
						name : '纸张',
						font : '',
						id : "font_normal"
					}, {
						value : '#a4a4a4',
						name : '浅灰',
						font : ''
					}, {
						value : '#cdefce',
						name : '护眼',
						font : ''
					}, {
						value : '#283548',
						name : '灰蓝',
						font : '#7685a2',
						bottomcolor : '#fff'
					}, {
						value : '#0f1410',
						name : '夜间',
						font : '#4e534f',
						bottomcolor : 'rgba(255,255,255,0.7)',
						id : "font_night"
					}];	
				    Dom.bk_container.each(function(i,ele){
						$(this).css('background',colorArr[i].value);
						$(this).attr('id',colorArr[i].id);
					})
					initBackGround= Util.storageGetter('background_color');
					if (!initBackGround) {
						initBackGround='#e9dfc7';
					}
					Body.css('background',initBackGround);
					Dom.bk_container.on('click',function(){
						if ($(this).attr('id')=='font_night') {
							Dom.day_icon.show();
		            		Dom.night_icon.hide();	
		            		Util.storageSetter('day','night');
						} else{
							Dom.day_icon.hide();
		            		Dom.night_icon.show();	
		            		Util.storageSetter('day','normal');
						}
						$('.bk-container-current').hide()
						$(this).find('.bk-container-current').show();
						initBackGround=$(this).css('background');
						Body.css('background',initBackGround);
						Util.storageSetter('background_color',initBackGround);
					})
					//设置背景色 end
					$('#night-button').on('click',function(){
						if (Dom.day_icon.css('display')=='none') { 
							$('#font_night').trigger('click');
						} else{
							$('#font_normal').trigger('click');
						}
					})	
					initDay=Util.storageGetter('day');
					if(initDay=='night'){
						console.log(1)
						Dom.day_icon.show();
						Dom.night_icon.hide();	
						$('.bk-container-current').hide()
						$('#font_night').find('.bk-container-current').show();
						
					}
					
					if(!initDay&&initDay=='normal'){
						console.log(2)
						Dom.day_icon.hide();
						Dom.night_icon.show();	
						$('.bk-container-current').hide()
						$('#font_normal').find('.bk-container-current').show();
					}	
					//设置夜间模式 end
					if (Dom.night_icon.css('display')=='none') { 
						$('.bk-container-current').hide()
						$('#font_night').find('.bk-container-current').show();
					}
				}
			
				$('.prev_button').on('click',function(){
					readerModel.prevChapter(function(data){
						readerUI(data);
						setTimeout(function() {document.body.scrollTop = 0;},20)
					});
				})
				
				$('.next_button').on('click',function(){
					readerModel.nextChapter(function(data){
						readerUI(data);
						setTimeout(function() {document.body.scrollTop = 0;},20)
					});
				})
			
		}
		//
		main();
		
	})()
})
