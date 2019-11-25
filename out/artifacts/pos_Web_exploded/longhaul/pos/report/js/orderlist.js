$(function() {
	
	
	var OriginImage = new Image();
	function GetImageWidth(oImage) {
		if (OriginImage.src != oImage.src)
			OriginImage.src = oImage.src;
		return OriginImage.width;
	}
	function GetImageHeight(oImage) {
		if (OriginImage.src != oImage.src)
			OriginImage.src = oImage.src;
		return OriginImage.height;
	}
	var currentPage = 1;
	var totalPage = 0;
	$(document).keydown(function(e) {
				var target = e.target;
				var tag = e.target.tagName.toUpperCase();
				if (e.keyCode == 13) {
					getOrderPageCount();
				}
			});

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

	$('#postingtime').val(getTodyay("-"));
	// $('#saledateto').val(getTodyay("-"));
	getOderType();
	// getorderbypage(0,$("#pageSize").val());
	getOrderPageCount();
	
	//getOrderDetailPageCount();

	$("#orderlisttable tr").live('mouseover', function() {
				$(this).addClass("trover");
			});

	$("#orderlisttable tr").live('mouseout', function() {
				$(this).removeClass("trover");
			});

	// 分页查询订单
	function getorderbypage(page, pageSize) {

		$("#orderlisttable tr").each(function(index) {
					if (index != 0)
						$(this).remove();
				});
		$('#orderheadlist td').addClass('tdclass'); // 增加td样式
		_ordertype = $("#ordertype").val();
		_ordertype = _ordertype == null ? "" : _ordertype;
		_orderflag = $("#orderflag").val();
		_orderflag = _orderflag == null ? "" : _orderflag;
		_saledatefrom = $.trim($('#saledatefrom').val());
		_saledateto = $.trim($('#saledateto').val());
		_batchno = $.trim($('#batchno').val());
		if (_saledatefrom == "" && _saledateto == "") {
			_saledatefrom = "1910-01-01";
			_saledateto = '2099-01-01';
		}
		if (_saledatefrom != "" && _saledateto == "")
			_saledateto = _saledatefrom;

		if (_saledatefrom == "" && _saledateto != "")
			_saledatefrom = _saledateto;

		_deliveryordernumber = $.trim($('#deliveryordernumber').val());
		$.getJSON(
				"longhaul/pos/order/orderSystem.ered?reqCode=orderSystem&postType=1&random="
						+ Math.random(), {
					werks : WERKS,
					saledatefrom : _saledatefrom,
					"saledateto" : _saledateto,
					"salesorderid" : $("#salesorderid").val(),
					"sapsalesorderid" : $("#sapsalesorderid").val(),
					"kunnr" : $("#kunnr").val(),
					"vipid" : $("#vipid").val(),
					"ordertype" : _ordertype,
					"orderflag" : _orderflag,
					"operator" : $.trim($("#operator").val()),
					"salesclerk" : $.trim($("#salesclerk").val()),
					"deliveryordernumber" : _deliveryordernumber,
					"page" : page,
					"batchno" : _batchno,
					"pageSize" : pageSize
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
						var _herf = basepath
								+ "/longhaul/pos/order/orderSystem.ered?reqCode=orderSystemStart&postType=1&salesorderid="
								+ val.salesorderid + "&WERKS=" + WERKS
								+ "&userid=" + opterator
								+ "&opmode=view&ordertype=" + val.ordertype
								+ "&password=" + password;
						row = row
								+ "<td align='center'><input name='useroption' id='useroption' type='checkbox' value='"
								+ key + "'/></td>";
						row = row + "<td style='display:none;'><a href='" + _herf
								+ "' target='_blank'><div id=salesorderid"
								+ key + "> " + val.salesorderid
								+ "</div></a></td>";
						var sapsalesorderid = val.sapsalesorderid == null
								? "&nbsp;"
								: val.sapsalesorderid;
						row = row + "<td><a href='" + _herf
								+ "' target='_blank'><div id=sapsalesorderid" + key + ">"
								+ sapsalesorderid + "</div></a></td>";
						row = row + "<td><div id='ordertype"+key+"' style='display : none;'>"+val.ordertype+"</div>" + val.ordertypetext + "</td>";
						row = row + "<td>" + val.saledate.substring(0,10) + "</td>";
						vipcard = val.vipcard == null ? "" : val.vipcard;
						row = row + "<td>" + val.vipcard + "</td>";
						row = row + "<td><div id=orderflag" + key
								+ " style='display:none'>" + val.orderflag
								+ "</div>" + val.orderflagtext + "</td>";
						totalmoney = val.totalmoney;
						totalmoney = Number(totalmoney).toFixed(2);
						row = row + "<td align='right'>" + totalmoney + "</td>";
						row = row + "<td>" + val.salesclerk + "</td>";
						//deliveryordernumbert = val.deliveryordernumber == null
						//		? ""
						//		: val.deliveryordernumber;
						//row = row + "<td><div id=deliveryordernumber" + key
						//		+ ">" + deliveryordernumbert + "</div></td>";
						row = row + "<td style='display:none'><div id=operatedatetime" + key
								+ " > "
								+ val.operatedatetime + " </div></td>";
						row = row + "</tr>"
						$(row).insertAfter($("#orderlisttable tr:eq(" + key + ")"));
						$("#search").val("查询");
						$("#search").attr("disabled", false);
						
						
						index = key;
						totalCount = totalCount + Number(val.totalcount);
						totalMoney = totalMoney + Number(totalmoney);
					});
					
					row = "<tr style='background-color : lightgreen; font-size:16px;'>";
					row = row+ "<td align='center'>"+"</td>";
					row = row + "<td>"+"</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td>" +"总数量："+  "</td>";
					row = row + "<td>" + totalCount + "</td>";
					row = row + "<td>" + "总金额：" + "</td>";
					row = row + "<td align='right'>" + totalMoney + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "</tr>"
					$(row).insertAfter($("#orderlisttable tr:eq(" + (index + 1)+ ")"));
				});
	}
	
	// 分页查询明细
	function getorderdetailbypage(page, pageSize) {
		
		$("#orderlistdetailtable tr").each(function(index) {
			if (index != 0)
				$(this).remove();
		});
		$('#orderlistdetailtable td').addClass('tdclass'); // 增加td样式
		_ordertype = $("#ordertype").val();
		_ordertype = _ordertype == null ? "" : _ordertype;
		_orderflag = $("#orderflag").val();
		_orderflag = _orderflag == null ? "" : _orderflag;
		_saledatefrom = $.trim($('#saledatefrom').val());
		_saledateto = $.trim($('#saledateto').val());
		_batchno = $.trim($('#batchno').val());
		if (_saledatefrom == "" && _saledateto == "") {
			_saledatefrom = "1910-01-01";
			_saledateto = '2099-01-01';
		}
		if (_saledatefrom != "" && _saledateto == "")
			_saledateto = _saledatefrom;
		
		if (_saledatefrom == "" && _saledateto != "")
			_saledatefrom = _saledateto;
		
		_deliveryordernumber = $.trim($('#deliveryordernumber').val());
		$.getJSON(
				"longhaul/pos/order/orderSystem.ered?reqCode=getOrderDetail&postType=1&random="
				+ Math.random(), {
					werks : WERKS,
					saledatefrom : _saledatefrom,
					"saledateto" : _saledateto,
					"salesorderid" : $("#salesorderid").val(),
					"sapsalesorderid" : $("#sapsalesorderid").val(),
					"kunnr" : $("#kunnr").val(),
					"vipid" : $("#vipid").val(),
					"ordertype" : _ordertype,
					"orderflag" : _orderflag,
					"operator" : $.trim($("#operator").val()),
					"salesclerk" : $.trim($("#salesclerk").val()),
					"deliveryordernumber" : _deliveryordernumber,
					"page" : page,
					"batchno" : _batchno,
					"pageSize" : pageSize
				}, function(data) {
					if (data == "") {
						jAlert('无数据存在!', '提示', function(r) {
							$("#searchdetail").val("查询");
							$("#searchdetail").attr("disabled", false);
						});
						return;
					}
					var totalMoney = 0;
					var totalCount = 0;
					var index = 0;
					$.each(data, function(key, val) {
						stylcss = key % 2 == 0 ? "triped1" : "triped2";
						row = "<tr class=" + stylcss + ">";
						var _herf = basepath
						+ "/longhaul/pos/order/orderSystem.ered?reqCode=orderSystemStart&postType=1&salesorderid="
						+ val.salesorderid + "&WERKS=" + WERKS
						+ "&userid=" + opterator
						+ "&opmode=view&ordertype=" + val.ordertype
						+ "&password=" + password;
						row = row
						+ "<td align='center'><input name='useroption1' id='useroption1' type='checkbox' value='"
						+ key + "'/></td>";
						row = row + "<td style='display:none;'><a href='" + _herf
						+ "' target='_blank'><div id=salesorderid"
						+ key + "> " + val.salesorderid
						+ "</div></a></td>";
						var sapsalesorderid = val.sapsalesorderid == null
						? "&nbsp;"
								: val.sapsalesorderid;
						row = row + "<td><a href='" + _herf
						+ "' target='_blank'><div id=sapsalesorderid" + key + ">"
						+ sapsalesorderid + "</div></a></td>";
						row = row + "<td><div id='ordertype"+key+"' style='display : none;'>"+val.ordertype+"</div>" + val.ordertypetext + "</td>";
						row = row + "<td>" + val.saledate.substring(0,10) + "</td>";
						vipcard = val.vipcard == null ? "" : val.vipcard;
						row = row + "<td>" + val.vipcard + "</td>";
						row = row + "<td><div id=orderflag" + key
						+ " style='display:none'>" + val.orderflag
						+ "</div>" + val.orderflagtext + "</td>";
						totalmoney = val.totalmoney;
						totalmoney = Number(totalmoney).toFixed(2);
						row = row + "<td align='right'>" + val.totalamount + "</td>";
						row = row + "<td align='right'>" + val.tagprice + "</td>";
						row = row + "<td align='right'>" + val.goldprice + "</td>";
						row = row + "<td align='right'>" + val.batchnumber + "</td>";
						row = row + "<td >" + val.materialnumber + "</td>";
						row = row + "<td >" + val.materialdesc + "</td>";
						row = row + "<td class='tooltip'>" + "<img src='sappic/"+val.zmatnrt + "' onerror='this.src=\"longhaul\/pos\/order\/images\/zjzb.gif\"' width='40px' height='40px'/></td>";
						row = row + "<td align='right'>" + val.salesquantity + "</td>";
						
						row = row + "<td align='right'>" +  (Number(val.tagprice)==0 || Number(val.totalamount) == 0 ? "" :  (Number(val.totalamount)/val.tagprice*100).toFixed(0)) + "</td>";
//						row = row + "<td align='right'>" + val.discount1 + "</td>";
//						row = row + "<td align='right'>" + val.discount2 + "</td>";
//						row = row + "<td align='right'>" + val.discount3 + "</td>";
//						row = row + "<td align='right'>" + val.discount4 + "</td>";
//						row = row + "<td align='right'>" + val.discount5 + "</td>";
						row = row + "<td align='right'>" + (val.zjlbm != null ? val.zjlbm : '')  + "</td>";
						row = row + "<td align='right'>" + val.goldweight + "</td>";
						row = row + "<td align='right'>" + val.goodsprocessingfee + "</td>";
						row = row + "<td align='right'>" + val.currentintegral + "</td>";
						row = row + "<td align='right'>" + (val.zslbm != null ? val.zslbm : '') + "</td>";
						row = row + "<td align='right'>" + (val.zzlnn != null ? val.zzlnn : '') + "</td>";
						row = row + "<td align='right'>" + (val.labor != null ? val.labor : '') + "</td>";
						row = row + "<td align='right'>" + (val.zslys != null ? val.zslys : '') + "</td>";
						row = row + "<td>" + val.salesclerk + "</td>";
						//deliveryordernumbert = val.deliveryordernumber == null
						//		? ""
						//		: val.deliveryordernumber;
						//row = row + "<td><div id=deliveryordernumber" + key
						//		+ ">" + deliveryordernumbert + "</div></td>";
						row = row + "<td style='display:none'><div id=operatedatetime" + key
						+ " > "
						+ val.operatedatetime + " </div></td>";
						row = row + "</tr>"
						$(row).insertAfter($("#orderlistdetailtable tr:eq(" + key
								+ ")"));
						$("#searchdetail").val("清单查询");
						$("#searchdetail").attr("disabled", false);
						
						index = key;
						totalCount = totalCount + Number(val.salesquantity);
						totalMoney = totalMoney + Number(val.totalamount);
					});
					
					row = "<tr style='background-color : lightgreen; font-size:16px;'>";
					row = row+ "<td align='center'>"+"</td>";
					row = row + "<td>"+"</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td>" + "总金额：" + "</td>";
					row = row + "<td align='right'>" + totalMoney + "</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td colspan=2 align='right'>" +"总数量："+  "</td>";
					row = row + "<td>" + totalCount + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "<td>"  + "</td>";
					row = row + "</tr>"
					$(row).insertAfter($("#orderlistdetailtable tr:eq(" + (index + 1)+ ")"));
				});
	}

	function getOderType() {
		$.getJSON(
				"longhaul/pos/order/orderSystem.ered?reqCode=getOrderTypeList&postType=1&werks="
						+ WERKS + "", function(data) {
					var auart = "";
					$("#ordertype")
							.append($("<option value='' selected>所有订单类型</option>"));
					$.each(data, function(key, val) {
								$("#ordertype").append($("<option value="
										+ val.pzdm + ">" + val.pzmc + "("
										+ val.pzdm + ")</option>"));
							});

				});

	}

	$("#opcontrol").click(function() {
				if ($(this).attr("checked") == "checked") {
					$("input[name='useroption']").attr("checked", "true");
				} else {
					$("input[name='useroption']").removeAttr("checked");
				}
			})
	$("#opcontrol1").click(function() {
				if ($(this).attr("checked") == "checked") {
					$("input[name='useroption1']").attr("checked", "true");
				} else {
					$("input[name='useroption1']").removeAttr("checked");
				}
			})
	$("#search").click(function() {
		$("#orderlistdetailtable").hide();
		$("#orderlisttable").show();
		$("#pageOprDetail").hide();
		$("#pageOpr").show();
		$("#search").val("正在查询");
		$("#search").attr("disabled", true);
		getOrderPageCount();
		$("#opcontrol").attr("checked", false);
	})
	$("#searchdetail").click(function() {
		$("#pageOprDetail").show();
		$("#pageOpr").hide();
		$("#orderlistdetailtable").show();
		$("#orderlisttable").hide();
		$("#searchdetail").val("正在查询");
		$("#searchdetail").attr("disabled", true);
		getOrderDetailPageCount();
		$("#opcontrol").attr("checked", false);
	})

	$("#pageSize").change(function() {
				getOrderPageCount();
			})
			
	$("#pageSize2").change(function() {
		getOrderDetailPageCount();
	})

	$("#update").click(function(event) {
		var _salesorderid = "", _orderflag = "", _orderType = "";
		$("input[name='useroption']:checked").each(function() {
					var usedkey = $(this).val();
					_salesorderid = $("#salesorderid" + usedkey).text();
					_orderflag = $("#orderflag" + usedkey).text();
					_orderType = $("#ordertype" + usedkey).text();
				})
		if ($("input[name='useroption']:checked").size() == 0) {
			jAlert('请选择项目!', '提示', function(r) {
					});
			return;
		}
		if ($("input[name='useroption']:checked").size() > 1) {
			jAlert('每次只可更新一笔数据', '提示', function(r) {
						return;
					});

		} else {
			if (_orderflag == "NO" || _orderflag == "PO" || _orderflag == "UO"
					|| _orderflag == "CO") {
				window
						.open(basepath
								+ "/longhaul/pos/order/orderSystem.ered?reqCode=orderSystemStart&postType=1&salesorderid="
								+ _salesorderid + "&WERKS=" + WERKS
								+ "&userid=" + opterator + "&ordertype=" + _orderType
								+ "&password=" + password + "&opmode=EDIT");
			} else {
				jAlert('凭证不允许修改请先冲销!', '提示', function(r) {
						});
				return;
			}
		}
	});

	$("#view").click(function(event) {
		var _salesorderid = "", _orderflag = "",_orderType = "";
		$("input[name='useroption']:checked").each(function() {
					var usedkey = $(this).val();
					_salesorderid = $("#salesorderid" + usedkey).text();
					_orderflag = $("#orderflag" + usedkey).text();
					_orderType = $("#ordertype" + usedkey).text();
				})
		if ($("input[name='useroption']:checked").size() == 0) {
			jAlert('请选择项目!', '提示', function(r) {
					});
			return;
		}
		if ($("input[name='useroption']:checked").size() > 1) {
			jAlert('每次只可查看一笔数据!', '提示', function(r) {
						return;
					});
		} else {
			window
					.open(basepath
							+ "/longhaul/pos/order/orderSystem.ered?reqCode=orderSystemStart&postType=1&salesorderid="
							+ _salesorderid + "&WERKS=" + WERKS + "&userid="
							+ opterator + "&opmode=view&password=" + password
							+ "&ordertype=" + _orderType + "&password=" + password);
		}
	});

	$("#del").click(function(event) {

		var orderhead = "", key = 1, postedorder = "", ordersorderids = "";

		$("input[name='useroption']:checked").each(function() {
			var usedkey = $(this).val();
			_sapsalesorderid = $.trim($("#sapsalesorderid" + usedkey).text());
			_salesorderid = $.trim($("#salesorderid" + usedkey).text());
			_deliveryordernumber = $.trim($("#deliveryordernumber" + usedkey)
					.text());
			_orderflag = $("#orderflag" + usedkey).text();
			if (_deliveryordernumber == "") {
				orderhead = orderhead + "\"" + key++ + "\":";
				orderhead = orderhead + "{\"salesorderid\":\""
						+ $.trim($("#salesorderid" + usedkey).text()) + "\",";
				orderhead = orderhead + "\"sapsalesorderid\":\""
						+ $.trim($("#sapsalesorderid" + usedkey).text())
						+ "\",";
				orderhead = orderhead + "\"operatedatetime\":\""
						+ $.trim($("#operatedatetime" + usedkey).text()) + "\"";
				orderhead = orderhead + "},";
			} else {
				postedorder = postedorder + "<font color=red>" + _salesorderid
						+ "</font>已过帐,不能删除,请冲销后删除!<br>";
			}

		})

		if (postedorder != "") {
			jAlert(postedorder + "请重新选择,可根据状态过滤.", '提示', function(r) {
					});
			return;
		}
		if (orderhead == "") {
			jAlert('请选择项目!', '提示', function(r) {
					});
			return;
		}
		jConfirm('确认要删除订单吗?', '提示', function(r) {
			if (r == true) {
				$("#del").val("正在删除");
				$("#del").attr("disabled", true);
				$.ajaxSetup({
							error : function(x, e) {
								alert("访问服务器错误请刷新页面!\n" + x.responseText);
								$("#del").val("正在删除");
								$("#del").attr("disabled", false);
								return false;
							}
						});
				$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=del&postType=1",
							cache : false,
							data : {
								orderhead : orderhead
							},
							type : 'post',
							dataType : 'json',
							success : function(retdata) {
								var message = "";
								$.each(retdata, function(key, val) {
											message = message + val.message
													+ "<br>"
										})
								jAlert(message, '提示', function(r) {
											getorderbypage(0, $("#pageSize").val());
										});
								$("#del").val("删除");
								$("#del").attr("disabled", false);
								$("#opcontrol").attr("checked", false);
							}
						});
				
			} else {
				return false;
			}
		});

	});

	$("#posting").click(function(event) {
		var orderhead = "", key = 1;
		var nosaporder = "", postedorder = "";
		$("input[name='useroption']:checked").each(function() {
			var usedkey = $(this).val();
			_sapsalesorderid = $.trim($("#sapsalesorderid" + usedkey).text());
			_salesorderid = $.trim($("#salesorderid" + usedkey).text());
			_deliveryordernumber = $.trim($("#deliveryordernumber" + usedkey)
					.text());
			if (_deliveryordernumber != "") {
				postedorder = postedorder + "<font color=red>" + _salesorderid
						+ "</font>已过帐,不能重复过帐!<br>";
			}
			if (_sapsalesorderid !== "") {
				orderhead = orderhead + "\"" + key++ + "\":";
				orderhead = orderhead + "{\"salesorderid\":\"" + _salesorderid
						+ "\",";
				orderhead = orderhead + "\"sapsalesorderid\":\""
						+ $.trim($("#sapsalesorderid" + usedkey).text())
						+ "\",";
				orderhead = orderhead + "\"postingtime\":\""
						+ $.trim($("#postingtime").val()) + "\",";
				orderhead = orderhead + "\"operatedatetime\":\""
						+ $.trim($("#operatedatetime" + usedkey).text()) + "\"";
				orderhead = orderhead + "},";
			} else {
				nosaporder = nosaporder + "<font color=red>" + _salesorderid
						+ "</font>没有上传到SAP不能过帐!<br>";
			}
		})
		orderhead = orderhead.length > 0 ? "{"
				+ orderhead.substring(0, orderhead.length - 1) + "}" : "";

		if (nosaporder != "") {
			jAlert(nosaporder + "请重新选择,可根据状态过滤.", '提示', function(r) {
					});
			return;
		}
		if (postedorder != "") {
			jAlert(postedorder + "请重新选择,可根据状态过滤.", '提示', function(r) {
					});
			return;
		}
		if (orderhead == "") {
			jAlert('请选择项目!', '提示', function(r) {
					});
			return;
		}
		$("#posting").val("正在过帐");
		$("#posting").attr("disabled", true);
		$.ajaxSetup({
					error : function(x, e) {
						alert("访问服务器错误请刷新页面!\n" + x.responseText);
						$("#posting").attr("disabled", false);
						$("#posting").val("过帐");
						return false;
					}
				});
		$.ajax({
					url : "longhaul/pos/order/orderSystem.ered?reqCode=posting&postType=1",
					cache : false,
					data : {
						orderhead : orderhead
					},
					type : 'post',
					dataType : 'json',
					success : function(retdata) {
						var message = "";
						$.each(retdata, function(key, val) {
									message = message + val.message + "<br>"
								})
						jAlert(message, '提示', function(r) {
									getorderbypage(0, $("#pageSize").val());
								});
						$("#posting").attr("disabled", false);
						$("#posting").val("过帐");
						$("#opcontrol").attr("checked", false);
					}
				});
	});

	$("#writeoff").click(function(event) {
		var orderhead = "", key = 1;
		var nopstorder = "";
		$("input[name='useroption']:checked").each(function() {
			var usedkey = $(this).val();
			_sapsalesorderid = $.trim($("#sapsalesorderid" + usedkey).text());
			_salesorderid = $.trim($("#salesorderid" + usedkey).text());
			_deliveryordernumber = $.trim($("#deliveryordernumber" + usedkey)
					.text());
			if (_deliveryordernumber != "") {
				orderhead = orderhead + "\"" + key++ + "\":";
				orderhead = orderhead + "{\"salesorderid\":\""
						+ $.trim($("#salesorderid" + usedkey).text()) + "\",";
				orderhead = orderhead + "\"sapsalesorderid\":\""
						+ $.trim($("#sapsalesorderid" + usedkey).text())
						+ "\",";
				orderhead = orderhead + "\"operatedatetime\":\""
						+ $.trim($("#operatedatetime" + usedkey).text())
						+ "\",";
				orderhead = orderhead + "\"postingtime\":\""
						+ $.trim($.trim($("#postingtime").val())) + "\",";
				orderhead = orderhead + "\"deliveryordernumber\":\""
						+ $.trim($("#deliveryordernumber" + usedkey).text())
						+ "\"";
				orderhead = orderhead + "},";
			} else {
				nopstorder = nopstorder + "<font color=red>" + _salesorderid
						+ "</font>没有能过帐,不能冲销<br>";
			}

		})

		if (nopstorder != "") {
			jAlert(nopstorder + "请重新选择,可根据状态过滤.", '提示', function(r) {
					});
			return;
		}

		orderhead = orderhead.length > 0 ? "{"
				+ orderhead.substring(0, orderhead.length - 1) + "}" : "";
		if (orderhead == "") {
			jAlert('请选择项目!', '提示', function(r) {
					});
			return;
		}
		$("#writeoff").val("正在冲销");
		$("#writeoff").attr("disabled", true);
		$.ajaxSetup({
					error : function(x, e) {
						alert("访问服务器错误请刷新页面!\n" + x.responseText);
						$("#writeoff").val("冲销");
						$("#writeoff").attr("disabled", false);
						return false;
					}
				});
		$.ajax({
					url : "longhaul/pos/order/orderSystem.ered?reqCode=writeoff&postType=1",
					cache : false,
					data : {
						orderhead : orderhead
					},
					type : 'post',
					dataType : 'json',
					success : function(retdata) {
						var message = "";
						$.each(retdata, function(key, val) {
									message = message + val.message + "<br>"
								})
						$("#writeoff").val("冲销");
						$("#writeoff").attr("disabled", false);
						$("#opcontrol").attr("checked", false);
						jAlert(message, '提示', function(r) {
									getorderbypage(0, $("#pageSize").val());
								});

					}
				});
	});

	function getOrderPageCount() {
		getorderbypage(0, $("#pageSize").val());
		// $('.pagination').die();
		var pageCount = 0;
		$('#orderheadlist td').addClass('tdclass'); // 增加td样式
		_ordertype = $("#ordertype").val();
		_ordertype = _ordertype == null ? "" : _ordertype;
		_orderflag = $("#orderflag").val();
		_orderflag = _orderflag == null ? "" : _orderflag;
		_saledatefrom = $.trim($('#saledatefrom').val());
		_saledateto = $.trim($('#saledateto').val());
		_batchno = $.trim($('#batchno').val());

		if (_saledatefrom == "" && _saledateto == "") {
			_saledatefrom = "1910-01-01";
			_saledateto = '2099-01-01';
		}
		if (_saledatefrom != "" && _saledateto == "")
			_saledateto = _saledatefrom;

		if (_saledatefrom == "" && _saledateto != "")
			_saledatefrom = _saledateto;

		_deliveryordernumber = $.trim($('#deliveryordernumber').val());
		$.post(
				"longhaul/pos/order/orderSystem.ered?reqCode=getOrderPageCount&postType=1&random="
						+ Math.random(), {
					werks : WERKS.substring(0, WERKS.length - 1),
					saledatefrom : _saledatefrom,
					"saledateto" : _saledateto,
					"salesorderid" : $("#salesorderid").val(),
					"sapsalesorderid" : $("#sapsalesorderid").val(),
					"kunnr" : $("#kunnr").val(),
					"vipid" : $("#vipid").val(),
					"ordertype" : _ordertype,
					"orderflag" : _orderflag,
					"operator" : $.trim($("#operator").val()),
					"salesclerk" : $.trim($("#salesclerk").val()),
					"deliveryordernumber" : _deliveryordernumber,
					"batchno" : _batchno,
					"pageSize" : $("#pageSize").val()
				}, function(data) {
					$('#pageOpr').die().unbind().clearQueue().jqPagination({
								// link_string : '/?page={page_number}',
								// current_page: 1, //设置当前页 默认为1
								max_page : parseInt(data), // 设置最大页 默认为1
								page_string : '当前第{current_page}页,共{max_page}页',
								paged : function(page) {
									getorderbypage(page - 1, $("#pageSize")
													.val());
								}
							});
				});
	}
	
	function getOrderDetailPageCount() {
		getorderdetailbypage(0, $("#pageSize2").val());
		// $('.pagination').die();
		var pageCount = 0;
		$('#orderheadlist td').addClass('tdclass'); // 增加td样式
		_ordertype = $("#ordertype").val();
		_ordertype = _ordertype == null ? "" : _ordertype;
		_orderflag = $("#orderflag").val();
		_orderflag = _orderflag == null ? "" : _orderflag;
		_saledatefrom = $.trim($('#saledatefrom').val());
		_saledateto = $.trim($('#saledateto').val());
		_batchno = $.trim($('#batchno').val());
		
		if (_saledatefrom == "" && _saledateto == "") {
			_saledatefrom = "1910-01-01";
			_saledateto = '2099-01-01';
		}
		if (_saledatefrom != "" && _saledateto == "")
			_saledateto = _saledatefrom;
		
		if (_saledatefrom == "" && _saledateto != "")
			_saledatefrom = _saledateto;
		
		_deliveryordernumber = $.trim($('#deliveryordernumber').val());
		$.post(
				"longhaul/pos/order/orderSystem.ered?reqCode=getOrderDetailForPageCount&postType=1&random="
				+ Math.random(), {
					werks : WERKS.substring(0, WERKS.length - 1),
					saledatefrom : _saledatefrom,
					"saledateto" : _saledateto,
					"salesorderid" : $("#salesorderid").val(),
					"sapsalesorderid" : $("#sapsalesorderid").val(),
					"kunnr" : $("#kunnr").val(),
					"vipid" : $("#vipid").val(),
					"ordertype" : _ordertype,
					"orderflag" : _orderflag,
					"operator" : $.trim($("#operator").val()),
					"salesclerk" : $.trim($("#salesclerk").val()),
					"deliveryordernumber" : _deliveryordernumber,
					"batchno" : _batchno,
					"pageSize" : $("#pageSize2").val()
				}, function(data) {
					$('#pageOprDetail').die().unbind().clearQueue().jqPagination({
						// link_string : '/?page={page_number}',
						// current_page: 1, //设置当前页 默认为1
						max_page : parseInt(data), // 设置最大页 默认为1
						page_string : '当前第{current_page}页,共{max_page}页',
						paged : function(page) {
							getorderdetailbypage(page - 1, $("#pageSize2").val());
						}
					});
				});
	}
	
	
	
	
	
	
	var x = 20;
	var y = 10;
	$('td.tooltip').live('mouseover', function(e) {
		this.myTitle = this.title;
		this.title = "";
		var imgTitle = this.myTitle ? "<br/>" + this.myTitle : "";
		imgTitle = "";
		var tooltip = "<div id='tooltip'><img  src='" + e.target.src + "' alt='产品预览图'/>" + imgTitle + "<\/div>"; // 创建
		var imgWidth, imgHeight;

		$("body").append(tooltip); // 追加到文档中
		// alert("hello");
		if (GetImageHeight(e.target) + e.pageY > $(window).height()) {
			$("#tooltip").css({
				"top" : (e.pageY + y - GetImageHeight(e.target) / 2) + "px",
				"left" : (e.pageX + x) + "px"
			}).show("fast"); // 设置x坐标和y坐标，并且显示

		} else {
			$("#tooltip").css({
				"top" : (e.pageY + y) + "px",
				"left" : (e.pageX + x) + "px"
			}).show("fast"); // 设置x坐标和y坐标，并且显示

		}
	});

	$('td.tooltip').live('mouseout', function(e) {
		this.title = this.myTitle;
		$("#tooltip").remove(); // 移除
	});
	$('td.tooltip').live('mousemove', function(e) {
		if (GetImageHeight(e.target) + e.pageY > $(window).height()) {
			$("#tooltip").css({
				"top" : (e.pageY + y - GetImageHeight(e.target) / 2) + "px",
				"left" : (e.pageX + x) + "px"
			}).show("fast"); // 设置x坐标和y坐标，并且显示

		} else {
			$("#tooltip").css({
				"top" : (e.pageY + y) + "px",
				"left" : (e.pageX + x) + "px"
			}).show("fast"); // 设置x坐标和y坐标，并且显示

		}

	});
	$('td.tooltip').live('click', function(event) {
		jAlert('请您将鼠标移动到图片上显示大图!', '提示', function(r) {
		});
		event.preventDefault();
	});
	
	
	

});