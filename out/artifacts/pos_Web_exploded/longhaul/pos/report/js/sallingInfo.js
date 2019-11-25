$(function() {
	$("#saledatefrom").datepicker({
				changeMonth : true,
				changeYear : true
			});
	// $('#saledatefrom').val(getMothFday("-"));
	$("#saledateto").datepicker({
				changeMonth : true,
				changeYear : true
			});
	$("#postingtime").datepicker({
				changeMonth : true,
				changeYear : true
			})

			
	if(werks == '1000'){
		$(".1000show").show();
		getWerks();
		getZone();
	}
	
	
	
	function getWerks(){
		
		$("#werks").append("<option value=''>请选择...</option>");
		
		$.getJSON(
				"longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getWerksInfo&postType=1&random="
						+ Math.random(), {
				}, function(data) {
					if (data == "") {
						jAlert('无数据存在!', '提示', function(r) {
									$("#search").val("查询");
									$("#search").attr("disabled", false);
								});
						return;
					}
					$.each(data, function(key, val) {
						var option = $("<option value='"+val.werks+"'>"+val.name1+"</option>");
						$("#werks").append(option);
					});
				});
	}
			
	
	function getZone(){
		$("#zone").append("<option value=''>请选择...</option>");
		$.getJSON(
				"longhaul/pos/report/reportSystem.ered?reqCode=getZone&postType=1&random="
						+ Math.random(), {
				}, function(data) {
					if (data == "") {
						jAlert('无数据存在!', '提示', function(r) {
									$("#search").val("查询");
									$("#search").attr("disabled", false);
								});
						return;
					}
					$.each(data, function(key, val) {
						var option = $("<option value='"+val.vkbur+"'>"+val.bezei+"</option>");
						$("#zone").append(option);
					});
				});
	}
	
			
	$('#postingtime').val(getTodyay("-"));

	$("#orderlisttable tr").live('mouseover', function() {
				$(this).addClass("trover");
			});

	$("#orderlisttable tr").live('mouseout', function() {
				$(this).removeClass("trover");
			});
	
	$('#orderheadlist td').addClass('tdclass'); // 增加td样式
	
	
	$("#search").click(getInfo);
	
	function getInfo(){
			$("#orderlisttable tr").each(function(index) {
					if (index != 0)
						$(this).remove();
				});
		
		var _saledatefrom = $("#saledatefrom").val();
		var _saledateto = $("#saledateto").val();
		var _werks = $("#werks").val();
		_werks = _werks != null ? _werks : '';
		var _zone = $("#zone").val();
		_zone = _zone != null ? _zone : '';
		
		if(_saledatefrom == ''){
			jAlert("请输入开始日期！","提示",function(){
				 $("#saledatefrom").focus();
			});
			return;
		}else if(_saledateto == ''){
			jAlert("请输入开始日期！","提示",function(){
				 $("#saledateto").focus();
			});
			return;
		}
		
		$.getJSON(
				"longhaul/pos/report/reportSystem.ered?reqCode=getSallingInfoByKondm&postType=1&random="
						+ Math.random(), {
					"dateFrom" : _saledatefrom,
					"dateTo" : _saledateto,
					"mywerks" : _werks,
					"zone" : _zone
				}, function(data) {
					if (data == "") {
						jAlert('无数据存在!', '提示', function(r) {
									$("#search").val("查询");
									$("#search").attr("disabled", false);
								});
						return;
					}
					var totalMoney = 0;
					var totalCount = 0;
					var index = 0;
					$.each(data, function(key, val) {
						stylcss = key % 2 == 0 ? "triped1" : "triped2";
						row = "<tr class=" + stylcss + ">";
						var _herf = "/longhaul/pos/order/orderSystem.ered?reqCode=orderSystemStart&postType=1&salesorderid=";
						row = row
								+ "<td align='center'><input name='useroption' id='useroption' type='checkbox' value='"
								+ key + "'/></td>";
						row = row + "<td style='display:none;'><a href='" + _herf
								+ "' target='showdetail'><div id=salesorderid"
								+ key + "> " + val.kondm
								+ "</div></a></td>";
//						var sapsalesorderid = val.sapsalesorderid == null
//								? "&nbsp;"
//								: val.sapsalesorderid;
								
						if(werks == '1000'){
							row = row + "<td align='center'>" + val.mygroup + "</td>";
							row = row + "<td align='center'>" + val.werksstr + "</td>";
						}
						row = row + "<td><a href='" + _herf
								+ "' target='showdetail'><div id=sapsalesorderid" + key + ">"
								+ val.kondmtext + "</div></a></td>";
//						row = row + "<td><div id='ordertype"+key+"' style='display : none;'>"+val.ordertype+"</div>" + val.ordertypetext + "</td>";
//						row = row + "<td>" + val.saledate.substring(0,10) + "</td>";
//						vipcard = val.vipcard == null ? "" : val.vipcard;
//						row = row + "<td>" + val.vipcard + "</td>";
//						row = row + "<td><div id=orderflag" + key
//								+ " style='display:none'>" + val.orderflag
//								+ "</div>" + val.orderflagtext + "</td>";
//						totalmoney = val.totalmoney;
//						totalmoney = Number(totalmoney).toFixed(2);
						row = row + "<td align='right'>" + val.quarty + "</td>";
						row = row + "<td>" + val.total + "</td>";
						//deliveryordernumbert = val.deliveryordernumber == null
						//		? ""
						//		: val.deliveryordernumber;
						//row = row + "<td><div id=deliveryordernumber" + key
						//		+ ">" + deliveryordernumbert + "</div></td>";
//						row = row + "<td style='display:none'><div id=operatedatetime" + key
//								+ " > "
//								+ val.operatedatetime + " </div></td>";
						row = row + "</tr>"
						$(row).insertAfter($("#orderlisttable tr:eq(" + key + ")"));
						$("#search").val("查询");
						$("#search").attr("disabled", false);
						
						
						index = key;
						totalCount = totalCount + Number(val.quarty);
						totalMoney = totalMoney + Number(val.total);
					});
					
					row = "<tr style='background-color : lightgreen; font-size:16px;'>";
					row = row+ "<td align='center'>"+"</td>";
							
					if(werks == '1000'){
						row = row+ "<td align='center'>"+"</td>";
						row = row+ "<td align='center'>"+"</td>";
					}
					row = row + "<td>" +"总计："+  "</td>";
					row = row + "<td align ='right' >" + totalCount + "</td>";
					row = row + "<td align='left'>" + totalMoney + "</td>";
					row = row + "</tr>"
					$(row).insertAfter($("#orderlisttable tr:eq(" + (index + 1)+ ")"));
				});
	}
	
	$("#dialog").dialog({
				modal : true,
				autoOpen : false,
				height : 'auto',
				width : '900'
			});
			
			
			$("div[id ^= sapsalesorderid]").click(function(){
				$("#dialog").dialog("open");
			});
	
	
});
