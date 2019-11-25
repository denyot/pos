$(function() {
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
	//getOderType();
	// getorderbypage(0,$("#pageSize").val());
	getOrderPageCount();

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
		_ordertype = $("#ordertype").get(0).selectedIndex == 0 ? null : $("#ordertype").val();
		_ordertype = _ordertype == null ? "" : _ordertype;
		_orderflag = $("#orderflag").val();
		_orderflag = _orderflag == null ? "" : _orderflag;
		_saledatefrom = $.trim($('#saledatefrom').val());
		_saledateto = $.trim($('#saledateto').val());
		_batchno = $.trim($('#batchno').val());
//		if (_saledatefrom == "" && _saledateto == "") {
//			_saledatefrom = "1910-01-01";
//			_saledateto = '2099-01-01';
//		}
		if (_saledatefrom != "" && _saledateto == "")
			_saledateto = _saledatefrom;

		if (_saledatefrom == "" && _saledateto != "")
			_saledatefrom = _saledateto;

		_deliveryordernumber = $.trim($('#deliveryordernumber').val());
		$.getJSON(
				'longhaul/pos/choiceOrder/choiceOrderSystem.ered?reqCode=getChoiceOrderHeader&option=user&postType=1', 
					{
					werks : WERKS,
					"startordertime" : _saledatefrom.replace(/-/g,''),
					"endordertime" : _saledateto.replace(/-/g,''),
					"choiceorderid" : $("#choiceorderid").val(),
					"saporderid" : $("#saporderid").val(),
					"type" : _ordertype,
					"orderflag" : _orderflag,
					"operator" : $.trim($("#operator").val()),
					"salesclerk" : $.trim($("#salesclerk").val()),
					"deliveryordernumber" : _deliveryordernumber,
					"start" : page,
					"batchno" : _batchno,
					"limit" : pageSize
				}, function(data) {
					if (data == "") {
						jAlert('无数据存在!', '提示', function(r) {
									$("#search").val("查询");
									$("#search").attr("disabled", false);
								});
						return;
					}
					$.each(data, function(key, val) {
						
						stylcss = key % 2 == 0 ? "triped1" : "triped2";
						row = "<tr class=" + stylcss + ">";
						var _herf = basepath
								+ "longhaul/pos/choiceOrder/choiceOrderSystem.ered?reqCode=getChoiceOrderByOrderIdForHeadQuarters&option=user&opmode=edit&postType=1&choiceOrderId="
								+ val.choiceorderid + "&WERKS=" + val.werks;
						row = row
								+ "<td align='center'><input name='useroption' id='useroption' type='checkbox' value='"
								+ key + "'/></td>";
						row = row + "<td><a href='" + _herf
								+ "' target='_blank'><div id=salesorderid"
								+ key + "> " + val.choiceorderid
								+ "</div></a></td>";
						var saporderid = val.saporderid == null
								? "&nbsp;"
								: val.saporderid;
						row = row + "<td><div id=saporderid" + key + ">"
								+ saporderid + "</div></td>";
						row = row + "<td>" + val.type + "</td>";
						row = row + "<td>" + val.ordertime.substring(0,10) + "</td>";
						
						var orderFlagStr = val.orderflag == 'NO' ? '新单' : '上传';
						
						row = row + "<td><div id=orderflag" + key
								+ " style='display:none'>" + val.orderflag
								+ "</div>" + orderFlagStr + "</td>";
						totalmoney = val.totalmoney;
						totalmoney = Number(totalmoney).toFixed(2);
						row = row + "<td align='right'>" + totalmoney + "</td>";
						quantity = val.quantity == null
								? ""
								: val.quantity;
						row = row + "<td><div id=deliveryordernumber" + key
								+ ">" + quantity + "</div></td>";
						row = row + "<td><div id=operatedatetime" + key
								+ " style='display:none'> "
								+ val.operatordate + " </div></td>";
						row = row + "</tr>"
						$(row).insertAfter($("#orderlisttable tr:eq(" + key
								+ ")"));
						$("#search").val("查询");
						$("#search").attr("disabled", false);
					});

				});
	}

	function getOderType() {
		$.getJSON(
				"longhaul/pos/order/orderSystem.ered?reqCode=getOrderType&postType=1&werks="
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
	$("#search").click(function() {
				$("#search").val("正在查询");
				$("#search").attr("disabled", true);
				getOrderPageCount();
				$("#opcontrol").attr("checked", false);
			})

	$("#pageSize").change(function() {
				getOrderPageCount();
			})

	$("#update").click(function(event) {
		var _salesorderid = "", _orderflag = "";
		$("input[name='useroption']:checked").each(function() {
					var usedkey = $(this).val();
					_salesorderid = $("#salesorderid" + usedkey).text();
					_orderflag = $("#orderflag" + usedkey).text();
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
								+ "&userid=" + opterator + "&posurl=" + posurl
								+ "&password=" + password + "&opmode=EDIT");
			} else {
				jAlert('凭证不允许修改请先冲销!', '提示', function(r) {
						});
				return;
			}
		}
	});

	$("#view").click(function(event) {
		var _salesorderid = "", _orderflag = "";
		$("input[name='useroption']:checked").each(function() {
					var usedkey = $(this).val();
					_salesorderid = $("#salesorderid" + usedkey).text();
					_orderflag = $("#orderflag" + usedkey).text();
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
							+ "&posurl=" + posurl + "&password=" + password);
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
				'longhaul/pos/choiceOrder/choiceOrderSystem.ered?reqCode=getChoiceOrderHeaderCount&option=user&postType=1'
				, {
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
								 current_page: 1, //设置当前页 默认为1
								max_page : Number(data) , // 设置最大页 默认为1
								page_string : '当前第{current_page}页,共{max_page}页',
								paged : function(page) {
									getorderbypage(page - 1, $("#pageSize")
													.val());
								}
							});
				});
	}
	
	
	
	
	
	
	

});