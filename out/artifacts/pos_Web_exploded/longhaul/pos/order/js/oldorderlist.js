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
	//getOderType();
	// getorderbypage(0,$("#pageSize").val());
	//getOrderPageCount();
	
	//getOrderDetailPageCount();

	$("#orderlisttable tr").live('mouseover', function() {
				$(this).addClass("trover");
			});

	$("#orderlisttable tr").live('mouseout', function() {
				$(this).removeClass("trover");
			});

	 //getKondm();
	function getKondm(){
		$.getJSON(
				"longhaul/pos/stock/stockSystem.ered?reqCode=getKondmInfo&postType=1&random="
						+ Math.random(), {
				}, function(data) {
					$.each(data, function(key, val) {
						var option = $("<option value='"+ val.kondm +"'>" + val.vtext + "</option>");
						$("#kondm").append(option);
					});
				});
	}
	
		$('#orderlistdetailtable td').addClass('tdclass'); // 增加td样式
		$('#orderheadlist td').addClass('tdclass'); // 增加td样式
		
	// 分页查询明细
	function getorderdetailbypage(page, pageSize) {
		
		$("#orderlistdetailtable tr").each(function(index) {
			if (index != 0)
				$(this).remove();
		});
		
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
				"longhaul/pos/order/orderSystem.ered?reqCode=getOldOrderDetail&postType=1&random="
				+ Math.random(), {
					//saledatefrom : _saledatefrom,
					//"saledateto" : _saledateto,
					//"kondm" : $("#kondm").val(),
					"vipid" : $("#vipid").val(),
					//"ordertype" : _ordertype,
					//"orderflag" : _orderflag,
					"page" : page,
					//"batchno" : _batchno,
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
					var totaltagprice = 0;
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
						var sapsalesorderid = val.sapsalesorderid == null
						? "&nbsp;"
								: val.sapsalesorderid;
						row = row + "<td><div id=sapsalesorderid" + key + ">"
						+ sapsalesorderid + "</div></td>";
						row = row + "<td><div id='ordertype"+key+"' style='display : none;'>"+val.ordertype+"</div>" + val.ordertypetext + "</td>";
						row = row + "<td>" + val.saledate.substring(0,10) + "</td>";
						vipcard = val.vipcard == null ? "" : val.vipcard;
						row = row + "<td>" + val.vipcard + "</td>";
						totalmoney = val.totalmoney;
						totalmoney = Number(totalmoney).toFixed(2);
						row = row + "<td align='right'>" + val.totalmoney + "</td>";
						row = row + "<td align='right'>" + val.tagprice + "</td>";
						row = row + "<td align='right'>" + val.batchnumber + "</td>";
						row = row + "<td >" + (val.materialnumber == null ? '' : val.materialnumber) + "</td>";
						row = row + "<td >" + (val.materialdesc == null ? '' : val.materialdesc) + "</td>";
						row = row + "<td align='right'>" + val.salesquantity + "</td>";
						row = row + "<td align='right'>" + val.currentintegral + "</td>";
						row = row + "</tr>"
						$(row).insertAfter($("#orderlistdetailtable tr:eq(" + key
								+ ")"));
						$("#searchdetail").val("查询");
						$("#searchdetail").attr("disabled", false);
						
						index = key;
						totalCount = totalCount + Number(val.salesquantity);
						totalMoney = totalMoney + Number(val.totalmoney);
						totaltagprice = totaltagprice + Number(val.tagprice);
					});
					
					row = "<tr style='background-color : lightgreen; font-size:16px;'>";
					row = row+ "<td align='center'>"+"</td>";
					row = row + "<td>"+"</td>";
					row = row + "<td>"+"</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td>" + "总金额：" + "</td>";
					row = row + "<td align='right'>" + totalMoney.toFixed(2) + "</td>";
					row = row + "<td>" + totaltagprice.toFixed(2) + "</td>";
					row = row + "<td>"+ "</td>";
					row = row + "<td colspan=2 align='right'>" +"总数量："+  "</td>";
					row = row + "<td>" + totalCount.toFixed(0) + "</td>";
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
			
	$("#searchdetail").click(function() {
		if($("#vipid").val() == ''){
			jAlert("请输入会员卡号！","提示",function(){
				$("#vipid").focus();
			});
			return;
		}
		
		$("#searchdetail").val("正在查询");
		$("#searchdetail").attr("disabled", true);
		getOrderDetailPageCount();
	})
			
	$("#pageSize2").change(function() {
		getOrderDetailPageCount();
	})


	
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
				"longhaul/pos/order/orderSystem.ered?reqCode=getOldOrderDetailForPageCount&postType=1&random="
				+ Math.random(), {
					//"saledatefrom" : _saledatefrom,
					//"saledateto" : _saledateto,
					"vipid" : $("#vipid").val(),
					//"ordertype" : _ordertype,
					//"batchno" : _batchno,
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