//实现远程开机
function remotePowerOn(pageequid) {
				var request = $.ajax({
					url : "equnature_remotePowerOn.action",
					type : "POST",
					data : {
						equid : pageequid
					},
					dataType : "json"
				});
		
				request.done(function(msg) {
				       // var result;
				       alert(msg.updateresult);
						
		
					}); 
			 request.fail(function(jqXHR, textStatus) {
					alert("发生错误[3]: " + textStatus);
				});	
			}	
//实现远程关机			
		function remotePowerOff(pageequid) {
				var request = $.ajax( {
					url : "equnature_remotePowerOff.action",
					type : "POST",
					data : {
						equid : pageequid
					},
					dataType : "json"
				});
		
				request.done(function(msg) {
				        var result;
						alert(msg.updateresult);
		
					}); 
			 request.fail(function(jqXHR, textStatus) {
					alert("发生错误[4]: " + textStatus);
				});	
			}
//实现远程重启
			function remoteReboot(pageequid) {
				var request = $.ajax( {
					url : "equnature_remoteReboot.action",
					type : "POST",
					data : {
						equid : pageequid
					},
					dataType : "json"
				});
		
				request.done(function(msg) {
				        var result;
						alert(msg.updateresult);
		
					}); 
			   request.fail(function(jqXHR, textStatus) {
					alert("发生错误[5]: " + textStatus);
				});	
			}
			
