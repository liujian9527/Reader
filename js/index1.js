(function(){
		var Util=(function(){
			var prefix='html5_reader';
			var storageGetter=function(Key){
				return localStorage.getItem(prefix + Key)
			}
			var storageSetter=function(Key,val){
				return localStorage.setItem(prefix + Key, val)
			}
			return {
				storageGetter:storageGetter,
				storageSetter:storageSetter
			}
		})();
		
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
						//console.log(JSON.parse(json))
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