$(function() {
	//function submitOutStock(rfcName) 
	$.ajax({
		url : 'longhaul/pos/synchro/synchroSystem.ered?reqCode=getSynRFC&option=user&postType=1&id=001001005',
		dataType : 'json',
		type : 'post',
		success : function(data){
			$.each(data,function(key,val){
				////alert(key);
				//alert(val.rfc_name);
				if (val.saprfcname == 'Z_RFC_STORE_25') {
					$("#selectRfcName").append($("<option value='"+val.saprfcname+"'>" + val.sortno+ ":" + val.rfc_name + "</option>"));
				}
			})
			$("#selectRfcName").multiSelect({
				//selectAll : false,
				noneSelected : "请选择......",
				oneOrMoreSelected : '*'
			}, function(el) {
			});
		}
	});
	

	
	$("#synchro").click(function(e) {
		if($("#selectRfcName").selectedValuesString() == ''){
			jAlert("请选择需要同步的信息！！","提示",function(e){})
			return;
		}
		var rfcnames = $("#selectRfcName").selectedValuesString();
			jConfirm("确定同步吗？","提示",function(e){
				if(e){
					var dialog = $.dialog({
						title:'同步中，请稍后...',
						max: false,
			   		 	min: false,
			   		 	close : false,
			   		 	lock : true
			   		 	});
					
					$.ajax({
						url : "longhaul/pos/synchro/synchroSystem.ered?reqCode=synchro&option=user&postType=1",
						data : "rfcName=" + rfcnames,
						dataType : 'json',
						success : function(data) {
							dialog.close();
							if(data.success != null)
							jAlert(data.success,"提示",function(e){});
							else 
							jAlert(data.error,"提示",function(e){});
						}
					});
				}
//				jAlert("同步执行成功！","提示",function(e){
//				});
				
			});
			});
			
			
			$("#addMatnrRow").click(function(){
				var matnrs = $("input[name ^='matnr']");
				var index = matnrs.length;
				var myinput = $("<input type='text'" + " name='matnr"+index+"'  /><br/>");
				$("#matnrinfo").append(myinput);
				
				$("input[name='matnr"+index+"']").focus();
				
			});
			$("#addchargRow").click(function(){
				var matnrs = $("input[name ^='matnr']");
				var index = matnrs.length;
				var myinput = $("<input type='text'" + " name='charg"+index+"'  /><br/>");
				$("#charginfo").append(myinput);
				
				$("input[name='charg"+index+"']").focus();
				
			});
			$("#addtempRow").click(function(){
				var matnrs = $("input[name ^='temp']");
				var index = matnrs.length;
				var myinput = $("<input type='text'" + " name='temp"+index+"'  /><br/>");
				$("#tempinfo").append(myinput);
				
				$("input[name='temp"+index+"']").focus();
				
			});
			
			
			$("#syncmatnr").click(function(){
				var matnrstr = '';
				var matnrs = $("input[name ^= 'matnr']");
				for(var i = 0 ; i < matnrs.length; i ++){
					var value = matnrs[i].value;
					if(value != '')
					matnrstr += matnrs[i].value + ',';
				}
				
				
				if($.trim(matnrstr) == ''){
					jAlert("请输入要同步的物料号！","提示", function(e){
						$("input[name^='matnr0']").focus();
					});
					return;
				}
				matnrstr = matnrstr.substring(0,matnrstr.length-1);
				
				
				var dialog = $.dialog({
						title:'同步中，请稍后...',
						max: false,
			   		 	min: false,
			   		 	close : false,
			   		 	lock : true
			   		 	});
				$.ajax({
						url : "longhaul/pos/synchro/synchroSystem.ered?reqCode=synchroMatnr&option=user&postType=1",
						data : "matnrstr=" + matnrstr,
						dataType : 'json',
						success : function(data) {
							dialog.close();
							if(data.success != null)
							jAlert(data.success+(data.matnrsuccess != '' ? "<br />成功物料号："+data.matnrsuccess : ''),"提示",function(e){});
							else 
							jAlert(data.error + (data.matnrsuccess != '' ? "<br />成功物料号："+data.matnrsuccess : ''),"提示",function(e){});
						}
					});
				
			});
			$("#synccharg").click(function(){
				var chargstr = '';
				var chargs = $("input[name ^= 'charg']");
				for(var i = 0 ; i < chargs.length; i ++){
					var value = chargs[i].value;
					if(value != '')
					chargstr += chargs[i].value + ',';
				}
				if($.trim(chargstr) == ''){
					jAlert("请输入要同步的批次号！","提示", function(e){
						$("input[name^='charg0']").focus();
					});
					return;
				}
				chargstr = chargstr.substring(0,chargstr.length-1);
				var dialog = $.dialog({
						title:'同步中，请稍后...',
						max: false,
			   		 	min: false,
			   		 	close : false,
			   		 	lock : true
			   		 	});
				$.ajax({
						url : "longhaul/pos/synchro/synchroSystem.ered?reqCode=synchroCharg&option=user&postType=1",
						data : "chargstr=" + chargstr,
						dataType : 'json',
						success : function(data) {
							dialog.close();
							if(data.success != null)
							jAlert(data.success+(data.chargsuccess != '' ? "<br />成功批次号："+data.chargsuccess : ''),"提示",function(e){});
							else 
							jAlert(data.error+(data.chargsuccess != '' ? "<br />成功批次号："+data.chargsuccess : ''),"提示",function(e){});
						}
					});
				
			});
			
			$("#synctemp").click(function(){
				var tempstr = '';
				var temps = $("input[name ^= 'temp']");
				for(var i = 0 ; i < temps.length; i ++){
					var value = temps[i].value;
					if(value != '')
					tempstr += temps[i].value + ',';
				}
				if($.trim(tempstr) == ''){
					jAlert("请输入要同步的主模号！","提示", function(e){
						$("input[name^='temp0']").focus();
					});
					return;
				}
				tempstr = tempstr.substring(0,tempstr.length-1);
				var dialog = $.dialog({
						title:'同步中，请稍后...',
						max: false,
			   		 	min: false,
			   		 	close : false,
			   		 	lock : true
			   		 	});
				$.ajax({
						url : "longhaul/pos/synchro/synchroSystem.ered?reqCode=synchrotemp&option=user&postType=1",
						data : "tempstr=" + tempstr,
						dataType : 'json',
						success : function(data) {
							dialog.close();
							if(data.success != null)
							jAlert(data.success+(data.tempsuccess != '' ? "<br />成功主模号："+data.tempsuccess : ''),"提示",function(e){});
							else 
							jAlert(data.error+(data.tempsuccess != '' ? "<br />成功主模号："+data.tempsuccess : ''),"提示",function(e){});
						}
					});
				
			});
			
			$("#syncwerk").click(function(){

				var werk = $("#werk").val();
				if($.trim(werk) == ''){
					jAlert("请输入要同步的门店！","提示", function(e){
						$("#werk").focus();
					});
					return;
				}
				var dialog = $.dialog({
						title:'同步中，请稍后...',
						max: false,
			   		 	min: false,
			   		 	close : false,
			   		 	lock : true
			   		 	});
				$.ajax({
						url : "longhaul/pos/synchro/synchroSystem.ered?reqCode=synchroStockByWerks&option=user&postType=1",
						data : "werk=" + werk,
						dataType : 'json',
						success : function(data) {
							dialog.close();
							if(data.success != null)
							jAlert(data.success+(data.werksuccess != '' ? "<br />门店: "+data.werksuccess : ''),"提示",function(e){});
							else 
							jAlert(data.error+(data.werksuccess != '' ? "<br />门店："+data.werksuccess : ''),"提示",function(e){});
						}
					});
				
			});
			

});