$(function() {
	/***************************************************************************
	 * Share JavaScript (http://www.ShareJS.com) 使用此脚本程序，请保留此声明
	 * 获取此脚本以及更多的JavaScript程序，请访问 http://www.ShareJS.com
	 **************************************************************************/
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
	
	var mykondm;
	var allowEditPrice = false;
	var g_charginfo={};
	var huitou=1;
	
	// 设置回退不到回退到历史
	$(document).keydown(function(e) {
		var target = e.target;
		var tag = e.target.tagName.toUpperCase();
		if (e.keyCode == 8) {
			if ((tag == 'INPUT' && !$(target).attr("readonly"))
					|| (tag == 'TEXTAREA' && !$(target).attr("readonly"))) {
				if ((target.type.toUpperCase() == "RADIO")
						|| (target.type.toUpperCase() == "CHECKBOX")) {
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		}
	});

	var oldcurrentInteval;
	var goldSealMethod;

	$('#ordersystemtable td').addClass('tdclass'); // 增加td样式
	$('#logartlabe').hide();
	$('#logrt').hide();
	$("#goldvalue").hide();
	// $("#saleman").focus();
	$("#goldvaluelabel").hide();
	$("#personcost").hide();
	$("#personcostlabel").hide();
	$("#showmatnrinfo").hide();
	$("#showoptinfo").hide();
	$('#opterator').val(opterator);
	// $('#saleman').text(opterator);
	if (opmode == "view") {
		$('input').attr('disabled', true);
		$("#userstatement").hide();
		$('select').attr('disabled', true);
		// $("#registertd").hide();
		$("#orderprint").show();
		$("#updateorderprice").show().attr('disabled', false);
	} else if (opmode == "ADD") {
		getsaleman("", "ADD");
	}
	if (ordertype == "") {
		getOderType();
	} else { // 根据用户选择订单类型
		getUserOderType(ordertype);
		checkordertype(ordertype);
	}
	// getsWerksSaleFlag(WERKS);
	if (salesorderid != "") {
		creatTablehead(salesorderid);
	}
	$("#salepromotion").keydown(function(event) {
				if (event.keyCode == 13) {
					$("#cashcoupon").focus();
				}
			});
	$("#cashcoupon").keydown(function(event) {
				if (event.keyCode == 13) {
					$("#shopnumber").focus();
				}
			});
	$("#shopnumber").keydown(function(event) {
				if (event.keyCode == 13) {
					$("#opterator").focus();
				}
			});
	$("#opterator").keydown(function(event) {
				if (event.keyCode == 13) {
					$("#saleman").focus();
				}
			});
	$("#saleman").keydown(function(event) {
				if (event.keyCode == 13) {
					$("#kunnr").focus();
				}
			});

	function getOderType() {
		$.getJSON("longhaul/pos/order/orderSystem.ered?reqCode=getOrderTypeList&postType=1&werks=" + WERKS + "", function(data) {
			var auart = "";
			$.each(data, function(key, val) {
						var selected = val.pzdm == "ZOR1" ? "selected" : "";
						$("#ordertype").append($("<option value="
										+ val.pzdm + " "
										+ selected + ">"
										+ val.pzdm + val.pzmc
										+ "</option>"));
					});
			getOrderReason("ZOR1");
		});
	}

	function getUserOderType(ordertype) {
		$.getJSON("longhaul/pos/order/orderSystem.ered?reqCode=getOrderType&postType=1&werks="
						+ WERKS + "&ordertype=" + ordertype, function(data) {
					var auart = "";
					$.each(data, function(key, val) {
								var selected = val.pzdm == ordertype
										? "selected"
										: "";
								$("#ordertype").append($("<option value="
										+ val.pzdm + " " + selected + ">"
										+ val.pzmc + "</option>"));
								$("#orderhead").text(val.pzmc);
							});
					getOrderReason(ordertype);
					$("#ordertypetd").hide();
					$("#ordertypeoptiontd").attr("colspan", "2");
				});
	}

	function getsWerksSaleFlag(werks) {
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getsWerksSaleFlag&postType=1&werks="
					+ werks + "",
			success : function(data) {
				werkssaleflag = data;

			}
		});
	}

	var giftPrice = 0;
	getGiftPrice();
	function getGiftPrice() {
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getGiftPrice&postType=1",
			dataType : 'json',
			type : 'post',
			success : function(data) {
				giftPrice = data.giftPrice;
				WERKS = data.werks;
				$("#giftPrice").text(giftPrice);
			}
		});
	}

	function getOrderReason(auart) {
		$.getJSON(
						"longhaul/pos/order/orderSystem.ered?reqCode=getOrderReason&postType=1",
						{
							auart : auart
						}, function(data) {
							$("#orderreason").empty();
							$.each(data, function(key, val) {
										selected = "";
										// _ordertype = $("#ordertype").val();
										// // 订单类型字段
										// if (_ordertype == "ZRE1" ||
										// _ordertype == "ZRE2" ||
										// _ordertype == "ZOR4") {
										// if (val.xh == "009") {
										// selected = "selected";
										// }
										// }
										$("#orderreason")
												.append($("<option value="
														+ val.augru + " "
														+ selected + " >"
														+ val.bezei
														+ "</option>"));
									});
						});

	}

	var salemanconf = 0;

	function getsaleman(noneselectedtext, mode) {
		var salesMans = noneselectedtext.split(",");
		$.getJSON(
				"longhaul/pos/order/orderSystem.ered?reqCode=getsaleman&postType=1&random="
						+ Math.random(), {
					werks : WERKS
				}, function(data) {
					$.each(data, function(key, val) {
						var selected = '';
						for (var i = 0; i < salesMans.length; i++) {
							if ($.trim(salesMans[i]) == val.assistant_name || $.trim(salesMans[i]) == val.assistantno) {
								//selected = 'selected';
								$("#saleman").append($("<option value="
										+ val.assistant_name + " selected='selected'>"
										+ val.assistant_name + "</option>"));
							} else {
								//selected = '';
								$("#saleman").append($("<option value="
										+ val.assistant_name + ">"
										+ val.assistant_name + "</option>"));
							}
						}
						salemanconf = salemanconf + 1;

						// noneselectedtext = mode == "ADD" ? key == 100000 ?
						// val.yyy :
						// noneselectedtext : noneselectedtext; // 默认不需要选择
						noneselectedtext = "请选择营业员";
						// selectedadd = mode == "ADD" ? key == 100000 ?
						// "selected" : ""
						// : "";
						// selectededit = mode == "EDIT" ?
						// noneselectedtext.indexOf(val.yyy) > -1 ? "selected" :
						// "" :
						// "";
						// selected = selectedadd == "" ? selectededit :
						// selectedadd;
//						if(selected = 'selected'){
//							$("#saleman").append($("<option value="
//									+ val.assistant_name + " selected='selected'>"
//									+ val.assistant_name + "</option>"));
//						} else {
//							$("#saleman").append($("<option value="
//									+ val.assistant_name + ">"
//									+ val.assistant_name + "</option>"));
//						}
						
					});

					$("#saleman").multiSelect({
								selectAll : false,
								noneSelected : noneselectedtext,
								oneOrMoreSelected : '*'
							}, function(el) {
								// $("#callbackResult").show().fadeOut();
							});
				});
	}

	$("#ordertype").change(function() {
				_checkrownum = $("#tablecontent tr").length - 2;
				changeValue = this.value;
				if (_checkrownum > 0) {
					jConfirm('已存在订单记录,请删除订单记录?', '提示', function(r) {
								if (r == true) {
									cleartable();
									clearchargre();
									checkordertype(changeValue);
								} else {
									return false;
								}
							});
				} else {
					checkordertype(changeValue);
				}

			})
	function checkordertype(ordertype) {
		if (ordertype == "ZYS2" || ordertype == "ZJM2") { // 退货类型
			$('#logartlabe').show();
			$('#logrt').show().addClass("inputattention");
			$('#swaptype').show().addClass("inputattention")
			$("#matnr").show();
			$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次: ");
			$("#matnrlabel").show();
			$("input[type=radio][name=chargtype][value=charg]").attr("checked",
					"checked");
		} else if (ordertype == "ZYS6" || ordertype == "ZJM6") { // 赠品类型
			$("input[type=radio][name=chargtype][value=gift]").attr("checked",
					"checked");
			$('#logartlabe').hide();
			$('#logrt').hide();
			$('#swaptype').hide();
			$("#matnr").hide();
			$("#charglabel").html("赠品料号: ");
			$("#matnrlabel").hide();
		} else if (ordertype == "ZYS4" || ordertype == "ZJM4") { // 赠品销售
			$("#matnr").hide();
			$("#charglabel").html("赠品料号: ");
			$("#matnrlabel").hide();
			$('#logartlabe').hide();
			$('#logrt').hide();
			$('#swaptype').hide();
		} else if (ordertype == "ZJR1" || ordertype == "ZYR1") { // 销售退货
			$('#logartlabe').show();
			$('#logrt').show().addClass("inputattention");
			$('#swaptype').hide();
		} else {
			$('#logartlabe').hide();
			$('#logrt').hide();
			$('#swaptype').hide();
			$("#matnr").show();
			$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次: ");
			$("#matnrlabel").show();
			$("input[type=radio][name=chargtype][value=charg]").attr("checked",
					"checked");
		}
		getOrderReason(ordertype);

		initialWindow(ordertype);

		$('#salesorderid').val("");
		$("#kunnr").val("");
		$("#vipid").val("");
		$("#kunnrjf").val("");
		$("#tel").val("");
		// $("#vipname").text("");
		// $("#matnr").show();
	}
	$('#ordertime').val(getTodyay("-"));
	
	$('#ordertime').change(function(event) {
		var p = this;
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getAccountFlag&postType=1",
			success : function(data) {
				if(data){
					var v =p.value.replace(/-/ig,"");
					if(v<eval("("+data+")").zdate){
						jAlert('你输入的日期已关闭！', '提示', function(r) {
							p.value = '';
						})
					}
					
				}
			}
		});
		
	});

	$("#kunnr").keydown(function(event) {
		if ($("#kunnr").val() == "")
			$("#registertd").show();
		if (event.keyCode == 13) {
			var _checkrownum = $("#tablecontent tr").length - 2;
			if (_checkrownum > 0) {
			}
			if ($.trim($("#kunnr").val()) != "") {
				$("#kunnr").autocomplete("close");
				$("#regname").val("");
				kunnrbyuser();
			}
		}
	});

	function kunnrbyuser() {
		$.ajaxSetup({error : function(x, e) {
				jAlert(	"访问服务器错误!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
				});
				return false;
			}
		});
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getVipRecord&option=user&postType=1&werks="
					+ WERKS + "&random=" + Math.random() + "",
			dataType : "json",
			data : "kunnr=" + $("#kunnr").val() + "",
			success : function(data) {
				if (data == "") {
					jAlert('请输入正确的客户号!', '提示', function(r) {
								$("#kunnr").focus();
								$("#vipid").val("");
								$("#kunnr").val("");
								$("#kunnrjf").val("");
								$("#vipname").text("");
							});
				}
				$.map(data, function(item) {
					var vipid = item.hykh == null ? "" : item.hykh;
					var tel = item.sj == null ? "" : item.sj;
					var kunnr = item.hybh == null ? "" : item.hybh;
					var vipname = item.hyxm == null ? "" : item.hyxm;
					var integral = item.zwdhjf == null ? "" : item.zwdhjf;
					var zjf = item.zjf == null ? "" : item.zjf;
					var info = {
						label : kunnr,
						kunnr : kunnr,
						vipid : vipid,
						tel : tel,
						vipname : vipname,
						integral : integral,
						zjf : zjf
					};
					$("#kunnr").val(info.kunnr);
					$("#vipid").val(info.vipid);
					if (info.kunnr == "0090000000")
						$("#kunnrjf").val(0);
					else
						$("#kunnrjf").val(info.zjf);
					$('#kunnrjf').addClass("kunnrjf");
					$('#tel').addClass("kunnrjf");
					if ($.trim($("#regname").val()) == "")
						$("#vipname").text(info.vipname);

					if (info.vipname != "" && info.vipname != null) {
						$("#vipname").text(info.vipname);
						$("#regname").val("");
					}

					$("#tel").val(info.tel);
					if(opmode != 'view'){
						$("#charg").attr("disabled", false);
						$("#charg").attr("readOnly", false);
					}
					$("#kunnr").removeClass("inputkey").addClass("inputnom");
					$("#charg").addClass("inputkey");
					$("#charg").focus();
						// if ($("#regname").val() == "")
						// $("#registertd").hide();
						// else
						// $("#registertd").val("修改");
					});
			}
		});
	}
	$("#vipid").keydown(function(event) {
		if (ordertype != 'ZJM6' && ordertype != 'ZYS6' && ordertype != 'ZYR2'
				&& ordertype != 'ZJR2' && ordertype != 'ZYS3'
				&& ordertype != 'ZJM3') {
			if ($(this).val() == "")
				$("#registertd").show();
			if ($(this).val() == '' && $("#regname").val() == '') {
				$("#registertd").val("新会员");
			}
		}
		if (event.keyCode == 13) {
			var _checkrownum = $("#tablecontent tr").length - 2;
			if (_checkrownum > 0) {

			}
			if ($.trim($("#vipid").val()) != "") {
				$("#vipid").autocomplete("close");
				getvipidbyuser();
			}
		}
	});

	var giftflag = 0 ;
	
	function getvipidbyuser() {
		// $("#charg").focus();
		$("#matnrSelect").empty();
		$("#matnrSelect").append("<option value=''>请选择...</option>");
		$.ajaxSetup({
			error : function(error, e) {
				jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
						});
				return false;
			}
		});
		var saledate = $('#ordertime').val();
		tempvipid = $("#vipid").val();
		_kunnr = tempvipid.substring(tempvipid.indexOf("客户号:") + 4, tempvipid.indexOf("VIPID:"));
		_kunnr = tempvipid.indexOf("客户号:") > -1 ? _kunnr : tempvipid;
		viptype = "vipid=";
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getVipRecord&option=user&postType=1&werks="
					+ WERKS + "&random=" + Math.random() + "",
			dataType : "json",
			type : "post",
			data : viptype + _kunnr +"&saledate="+saledate,
			success : function(data) {
				if (data.length == 1) {
					var zjf = "";
					if (data == "") {
						jAlert('输入卡号或者电话号码不存在!', '提示', function(r) {
									$("#vipid").focus();
									$("#vipid").val("");
									$("#kunnr").val("");
									$("#kunnrjf").val("");
									$("#vipname").text("");
									$("#referrer").val("");
								});
						return;
					}
					$.map(data, function(item) {

						var vipid = item.hykh == null ? "" : item.hykh;
						var tel = item.sj == null ? "" : item.sj;
						var kunnr = item.hybh == null ? "" : item.hybh;
						var vipname = item.hyxm == null ? "" : item.hyxm;
						var integral = item.zwdhjf == null ? "" : item.zwdhjf;
						zjf = item.zjf == null ? "" : item.zjf;
						var fax_number = item.fax_number == null
								? ""
								: item.fax_number;
								
						var doubleInteval = item.doubleInteval;
						var joindate = item.joindate;
						
						//alert(joindate);
						var birthday = item.gbdat == '0000-00-00' ? '' : item.gbdat;
						var marryday = item.telf2 == '0000-00-00' ? '' : item.telf2;
						
						$("#birthday").text(birthday == '' ? '没有维护' : birthday);						
						$("#marryday").text(marryday == '' ? '没有维护' : marryday);						
						
						// alert(doubleInteval);
						var info = {
							label : kunnr,
							kunnr : kunnr,
							vipid : vipid,
							tel : tel,
							vipname : vipname,
							integral : integral,
							fax_number : fax_number,
							doubleInteval : doubleInteval,
							zjf : zjf
						};
						$("#kunnr").val(info.kunnr);
						$("#vipid").val(info.vipid);
						// if(info.kunnr == "0090000000")
						// $("#kunnrjf").val(0);
						// else
						$("#kunnrjf").val(info.zjf);
						$('#kunnrjf').addClass("kunnrjf");
						$("#referrer").val(info.fax_number);
						$('#tel').addClass("kunnrjf");
						if(opmode != 'view'){
							$("#charg").attr("disabled", false);
							$("#charg").attr("readOnly", false);
						}

						$("#kunnr").removeClass("inputkey")
								.addClass("inputnom");
						$("#charg").addClass("inputkey");
						
						var ordertime = $("#ordertime").val();
						
						if(joindate != ordertime){
							if (doubleInteval == 1) {
								if (ordertype == "ZJM1" || ordertype == "ZJM2"
										|| ordertype == "ZYS1"
										|| ordertype == "ZYS2") {
										/**
									jAlert(
											"<span style='font-size: 16px;color: green;'>"
													+ vipname
													+ "</span>是本月的生日，并且是回头消费将会获得三倍积分！",
											"提示", function(e) {
												$("#charg").select();
											});
											**/
								}
								doubleIntervalValidate = true;
								huitou = 1;
							} else if (doubleInteval == 2) {
								if (ordertype == "ZJM1" || ordertype == "ZJM2"
										|| ordertype == "ZYS1"
										|| ordertype == "ZYS2") {
									/**jAlert(
											"<span style='font-size: 16px;color: green;'>"
													+ vipname
													+ "</span>是本月的结婚纪念日，，并且是回头消费将会获得三倍积分！",
											"提示", function(e) {
												$("#charg").select();
											});**/
								}
								doubleIntervalValidate = true;
								huitou = 1;
							} else {
								doubleIntervalValidate = false;
								$("#charg").select();
							}
						}else{
							doubleIntervalValidate = false;
							$("#charg").select();
						}
						
						// alert(doubleIntervalValidate);
						// if (info.vipname != "" && info.vipname != null) {
						// $("#vipname").text(info.vipname);
						// $("#regname").val("");
						// }

						// getkunnrjf(info.kunnr); // 开始调用积分
						if ($.trim($("#regname").val()) == "") {
							$("#vipname").text(info.vipname);
							$("#tel").val(info.tel);
						}

						getThankIntegral();
						if ($("#regname").val() == "") {
							$("#registertd").hide();
						} else {
							$("#registertd").val("修改");
						}
					});

					if ((ordertype == "ZJM3" || ordertype == "ZYS3") && opmode != 'view') {
						var vipid = $("#vipid").val();
						$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=getCustommadeList&option=user&postType=1",
							dataType : "json",
							type : "post",
							data : "vipid=" + vipid,
							success : function(data) {
								if (data == "") {
									jAlert("该会员没有定制信息！", "提示", function(e) {
											});
									return;
								}
								$.map(data, function(item) {
											$("#matnrSelect")
													.append($("<option value="
															+ item.choiceorderid
															+ ">"
															+ item.saporderid
															+ "</option>"));
										});

								$("#matnrSelect").focus();
							}
						});
					}

					if (ordertype == "ZJR2" || ordertype == "ZYR2") {
						var vipid = $("#vipid").val();
						$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=getFrontMoneyList&option=user&postType=1",
							dataType : "json",
							type : "post",
							data : "vipid=" + vipid,
							success : function(data) {
								if (data == "") {
									jAlert("该会员没有定金信息！", "提示", function(e) {
												$("#vipid").select();
											});
									return;
								}
								$.map(data, function(item) {
											$("#matnrSelect")
													.append($("<option value="
															+ item.salesorderid
															+ ">"
															+ item.sapsalesorderid
															+ "</option>"));
										});

								$("#matnrSelect").focus();
							}
						});
					}

					if (ordertype == "ZJM6" || ordertype == "ZYS6") {
						if (zjf == 0) {
							jAlert("您的可用积分为0，不能进行礼品兑换！", "提示", function(e) {
										$("#vipid").focus();
									});
							return;
						}

						$("#matnrSelect").empty();
						$("#matnrSelect")
								.append($("<option value=''>请选择...</option>"));
						$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=getIntegralMatnrInfo&option=user&postType=1",
							dataType : "json",
							type : "post",
							data : "zjf=" + zjf + "&ordertype=" + ordertype,
							success : function(data) {
								if (data == "") {
									jAlert("没有取到兑换品，请检查积分是否足够！", "提示",
											function(e) {
												$("#vipid").focus();
											});
									return;
								}
								$.map(data, function(item) {
											$("#matnrSelect")
													.append($("<option value="
																	+ item.matnr
																	+ "-"
																	+ item.kbetr
																	+ ">"
																	+ item.maktx
																	+ " 需要积分："
																	+ item.kbetr
																	+ "</option>"));
										});

								$("#matnrSelect").focus();
							}
						});
					}
					
					if (ordertype == "ZJM4" || ordertype == "ZYS4") {
						var vipid = $("#vipid").val();
						$("input[type=radio][name=chargtype][value=gift]").attr("checked", "checked");
						$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=getIfHaveGiveGift&option=user&postType=1",
							dataType : "json",
							type : "post",
							data : "vipid=" + vipid,
							success : function(data) {
								giftflag = data.flag;
								if(data.flag != 3){
									$("#matnrSelect").empty();
									$("#matnrSelect")
											.append($("<option value=''>请选择...</option>"));
									$.ajax({
										url : "longhaul/pos/order/orderSystem.ered?reqCode=getIntegralMatnrInfo&option=user&postType=1",
										dataType : "json",
										type : "post",
										data : "ordertype=" + ordertype,
										success : function(data) {
											if (data == "") {
												jAlert("没有取到礼品信息，请检查库存是否足够！", "提示",
														function(e) {
															$("#vipid").focus();
														});
												return;
											}
											$.map(data, function(item) {
														$("#matnrSelect")
																.append($("<option value="
																				+ item.matnr
																				+ "-"
																				+ item.labst
																				+ ">"
																				+ item.maktx+"->"+item.matnr
																				+ "</option>"));
													});
											$("#matnrSelect").focus();
										}
									});
								}else{
									jAlert("该会员已领取今年生日礼品和结婚纪念礼品，不能重复领取！","提示",function(e){
										$("#vipid").select();
									});
								}
							}
						});
					}
				} else if (data.length == 0) {
					jAlert('输入卡号或者电话号码不存在!', '提示', function(r) {
								$("#vipid").focus();
								$("#vipid").val("");
								$("#kunnr").val("");
								$("#kunnrjf").val("");
								$("#vipname").text("");
								$("#referrer").val("");
							});
				} else {
					var addhtml = "请选择会员卡号<select id='vipkh'>";
					$.each(data, function(key, val) {
								var option1 = "<option value=" + val.hykh + "-"
										+ val.sj + "-" + val.hyxm + ">"
										+ val.hykh + "</option>";
								addhtml += option1;
							})
					addhtml += "</select>";
					var dialog = $.dialog({
								title : "<b style='color:red'>提示，该会员有多个会员卡号，请选择</b>",
								content : addhtml,
								button : [{
									name : '确定',
									callback : function() {
										var values = ($("#vipkh").val()).toString();
										var values1 = values.split("-");
										$("#vipid").val(values1[0]);
										$("#tel").val(values1[1]);
										$("#vipname").val(values1[2]);
										getvipidbyuser();
									},
									focus : true
								}],
								close : false,
								lock : true
							});
				}

			}

		});
		$("#vipid").autocomplete({
					disabled : false
				});
	}
	var _selfprivilege2=0;
	var _selfticketprice =0;
	$("#charg").keydown(function(event) {
		_selfprivilege2=0;
		_selfticketprice=0;
		if (allGiftNumber > 0) {
			jAlert("您已经输入整单礼品，请删除后再输入商品！！", "提示", function(e) {
					});
			return;
		}
		if (event.keyCode == 13) {
			// clearcharginfo();
			var chargval=$(this).val();
			if(chargval.length>15){
				chargval = chargval.substring(0,chargval.indexOf("/"));
			}	
			
			$("#giftMethod").val('');
			var table = $("#tablecontent");
			var chargDivs = table.find("div[id^='charg']");

			for (var i = 0; i < chargDivs.length; i++) {
				if ($.trim($(chargDivs[i]).text()) == $.trim($(this)
						.val())) {
					alert("订单中存在该批次信息，请不要重复录入！");
					$("#charg").select();
					return;
				}
			}

			$("#matnr").val("");
			$("#zhlhx").val("");
			$("#ztjtj").val("");
			$("#realprice").val("");
			$("#receivable").val(0);
			$("#goldweight").val("");
			$("#mGoldweight").val("");
			$("#gemweight").val("");
			$("#certificateno").val("");
			$("#goldvaluelabel").hide();
			$("#freepersoncost").attr("checked", null);
			$("#goldvalue").hide();
			$("#personcostlabel").hide();
			$("#goldweightSpan").hide();
			$("#mgoldweightSpan").hide();
			$("#salepromotion").val("");
			$("#personcost").hide();
			if ($.trim($("#charg").val()) != "") {
				$("#charg").autocomplete("close");

				$("#discount12").val(1);
				$("#salepromotionSpan").hide();
				getchargbyuser();
			}
		}
	});

	// 用户回车选择批次事件
	function getchargbyuser() {
		// $("#number").focus();
		tempchargNo = $("#charg").val();
		_mycharg = tempchargNo.substring(0, tempchargNo.indexOf("->"));
		_ordertype = $("#ordertype").val();
		_chargtype = $('input:radio[name="chargtype"]:checked').val();
		_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
		if ($("#inputPackage").attr("checked") == 'checked') {
			_chargtype = 'bc';
		}
		
		if(((ordertype == 'ZYS2' && $("#swaptype").val() == 'ZIN') || ordertype == 'ZYR1')){
			$("#salepromotionSpan").show();
		}
		if ($("#rejPackageAndGift").attr("checked") == 'checked') {
			_chargtype = 'rejpackageandgift';
		}

		_charg = tempchargNo.indexOf("->") > 0 ? _mycharg : tempchargNo;
		_charg = _charg.toUpperCase();
		$("#charg").val(_charg);
		var method = "getpcxx";
		// if(((ordertype == "ZJM2"|| ordertype == "ZYS2") &&
		// $("#swaptype").val() == "ZIN") || ordertype == "ZYR1" || ordertype ==
		// "ZJR1")
		// method = "getReturnPcxx";

		
		
		var dialog = $.dialog({
			title:'正在获取商品信息，请稍候...',
			max: false,
		 	min: false,
		 	close : false,
		 	lock : true
	 	});
			
		
		
		$.ajaxSetup({error : function(x, e) {
			jAlert(	"访问服务器错误信!<font color='red'>" + x.responseText + "</font>", "提示", function(e) {
			});
			return false;
			}
		});
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=" + method
					+ "&option=user&ordertype=" + _ordertype
					+ "&postType=1&werks=" + WERKS + "&random=" + Math.random()
					+ "",
			dataType : "json",
			data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype
					+ "&giftReferencePrice=" + $("#giftReferencePrice").val()
					+ "&vipid=" + $("#vipid").val() + "&kunnr="
					+ $("#kunnr").val() + "&saledate=" + $("#ordertime").val()
					+ "&swap="+$("#swaptype").val()
					,
			success : function(data) {
				dialog.hide();
				if (data == "") {
					var chargalertstr = "输入批次不存在!";
					chargalertstr = _chargtype == "gift"
							? "输入物料编码不存在!"
							: chargalertstr
					jAlert(chargalertstr, '提示', function(r) {
								clearcharginfo();
							});
				}
				$.map(data, function(item) {
							var cpbm = item.cpbm == null ? "" : item.cpbm; // 批次
							var matnr = item.bkbh == null ? "" : item.bkbh; // 物料号
							var zhlhx = item.plmc == null ? "" : item.plmc; // 产品名称
							if(zhlhx == ''){
								zhlhx = item.maktx;
							}
							var ztjtj = item.bqj == null ? 0 : item.bqj; // 标签价
							var realprice = item.sxj == null ? 0 : item.sxj; // 售价
							var goldweight = item.jlzl == null ? 0 : item.jlzl; // 金重
							var gemweight = item.zszl == null ? 0 : item.zszl; // 石重
							var certificateno = item.zsh == null
									? ""
									: item.zsh; // 证书号
							var personcost = item.xsgf == null ? 0 : item.xsgf; // 工费
							var pcimage = item.zp == null ? "" : item.zp; // 照片
							var sjczbm = item.sjczbm == null ? "" : item.sjczbm; // 类别
							var zplb = item.zplb == null ? "" : item.zplb; // 赠品类别
							var usedorderid = item.usedorderid == null
									? ""
									: item.usedorderid; // 批次是否可用
							var lgort = item.lgort == null ? "" : item.lgort; // 库位信息
							
							var labst = item.labst == null ? 0 : item.labst; // 库存数量
							var matkl = item.matkl == null ? "" : item.matkl; // 商品类目
							var kbstat = item.kbstat == null ? "" : item.kbstat; // 定价的处理状态
							var kosrt = item.kosrt == null ? "" : item.kosrt; // 组合销售号码

							var oldsapsaleorderid = item.oldsapsaleorderid == null
									? ""
									: item.oldsapsaleorderid;
							var oldsalesorderid = item.oldsalesorderid == null
									? ""
									: item.oldsalesorderid;
							var oldunionpay = item.oldunionpay == null
									? 0
									: item.oldunionpay;
							var oldvipcard = item.oldvipcard;
							var oldshoppingcard = item.oldshoppingcard;
							var olddiscount1 = item.olddiscount1;
							var olddiscount2 = item.olddiscount2;
							var olddiscount3 = item.olddiscount3;
							var olddiscount4 = item.olddiscount4;
							var olddiscount5 = item.olddiscount5;

							var oldmarketprivilege = item.oldmarketprivilege;
							var oldselfticketprice = item.oldselfticketprice;
							var oldvipintegral = item.oldvipintegral;
							var oldselfprivilege = item.oldselfprivilege;
							var oldmarketticketprice = item.oldmarketticketprice;
							var oldcurrentintegral = item.oldcurrentintegral;
							var oldsalepromotion = item.oldsalepromotion;
							var oldsalesquantity = item.oldsalesquantity;
							var oldgoldWeight = item.oldgoldWeight;
							oldcurrentInteval = item.oldcurrentintegral == null ? 0 : oldcurrentInteval;
							var extwg = item.extwg;
							var kondm = item.kondm;
							mykondm = kondm;
							var charg_o = item.charg_o;
							var goldsealmethod = item.goldsealmethod;
							var ckxx = item.ckxx;
							var meins = item.meins;
							var hpzl = item.hpzl;
							var totalLabst = item.totalLabst;

							// alert(goldsealmethod);
							// alert(oldsapsaleorderid);
							// alert(oldcurrentInteval);
							// alert(oldunionpay);
							// alert(meins);
							// alert(charg_o);
							cpbm = $.trim(cpbm);
							var info = {
								label : cpbm,
								charg : cpbm,
								matnr : matnr,
								zhlhx : zhlhx,
								ztjtj : ztjtj,
								realprice : realprice,
								goldweight : goldweight,
								gemweight : gemweight,
								certificateno : certificateno,
								personcost : personcost,
								pcimage : pcimage,
								sjczbm : sjczbm,
								zplb : zplb,
								usedorderid : usedorderid,
								lgort : lgort,
								labst : labst,
								kbstat : kbstat,
								kondm : kondm,
								oldsapsaleorderid : oldsapsaleorderid,
								oldsalesorderid : oldsalesorderid,
								oldunionpay : oldunionpay,
								oldvipcard : oldvipcard,
								oldshoppingcard : oldshoppingcard,
								olddiscount1 : olddiscount1,
								olddiscount2 : olddiscount2,
								olddiscount3 : olddiscount3,
								olddiscount4 : olddiscount4,
								olddiscount5 : olddiscount5,
								oldmarketprivilege : oldmarketprivilege,
								oldselfticketprice : oldselfticketprice,
								oldvipintegral : oldvipintegral,
								oldselfprivilege : oldselfprivilege,
								oldmarketticketprice : oldmarketticketprice,
								oldcurrentintegral : oldcurrentintegral,
								oldsalepromotion : oldsalepromotion,
								oldsalesquantity : oldsalesquantity,
								oldgoldWeight : oldgoldWeight,
								kosrt : kosrt,
								extwg : extwg,
								charg_o : charg_o,
								goldsealmethod : goldsealmethod,
								ckxx : ckxx,
								meins : meins,
								hpzl : hpzl,
								totalLabst : totalLabst,
								matkl : matkl
							};
							g_charginfo = info;//20150227 批次输入一半
							chosecharginfo(info, "user");

						});
			}
		});
	}
	function goldtextdisplay() {
		$("#goldvalue").show();
		$("#goldvaluelabel").show();
		$("#personcost").show();
		$("#personcostlabel").show();
		// $("#freepersoncostspan").show();
		$("#thpersoncost").show();
		$("#thgoldweight").show();
		$("#tdtotalgoldweight").show();
		$("#tdtoalpersoncost").show();
		perobject = $(document).find("td[id^='personcosttd']");
		for (i = 0; i < perobject.length; i++) {
			$(perobject[i]).show();
		}
		perobject = $(document).find("td[id^='goldtr']");
		for (i = 0; i < perobject.length; i++) {
			$(perobject[i]).show();
		}
	}
	function goldtextdisplayno() {
		$("#goldvalue").hide();
		$("#goldvaluelabel").hide();
		$("#freepersoncostspan").hide();
		$("#personcost").hide();
		$("#personcostlabel").hide();
	}
	var usedorderid = "";
	function chosecharginfo(item, type) {
		if (type = "") {
			charginfo = ui.item;
		} else {
			charginfo = item;
		}

		// alert(charginfo.oldsapsaleorderid);
		// alert(charginfo.lgort)
		// alert($('input:radio[name="chargtype"]:checked').val());
		if ((charginfo.lgort != '0001' && charginfo.lgort != '0017')
				&& $('input:radio[name="chargtype"]:checked').val() == "charg" && ordertype != 'ZYR1'&& ordertype != 'ZJR1'
				&& ( ordertype == 'ZYS2' && $("#swaptype").val() == 'ZOUT')&&( ordertype == 'ZJM2' && $("#swaptype").val() == 'ZOUT')) {
			jAlert("该批次目前不在货品仓，不能销售！", "提示", function(e) {
						$("#charg").focus();
					});
			return;
		}

		$("#charg_ospan").hide();
		if (charginfo.charg_o != '' && charginfo.charg_o != null) {
			$("#charg").val(charginfo.charg);
			$("#charg_ospan").show();
			$("#charg_o").text(charginfo.charg_o);
		}
		// alert(charginfo.extwg);
		$("#doubleorsingleSpan").hide();
		$("#doubleorsingle").val('1');

		// 如果是耳环，耳钩，耳钉，耳线就可以选择半只
		if (charginfo.extwg == 'EA' || charginfo.extwg == 'EH'
				|| charginfo.extwg == 'ES' || charginfo.extwg == 'EW') {
			$("#doubleorsingleSpan").show();
		}else{
			$("#doubleorsingleSpan").hide();
		}
		myOldRealPrice = charginfo.realprice;
		// alert(myOldRealPrice);
		if ((charginfo.labst == null || charginfo.labst <= 0)
				&& !(ordertype == 'ZJM2' && $("#swaptype").val() == 'ZIN')
				&& !(ordertype == 'ZYS2' && $("#swaptype").val() == 'ZIN')
				&& ordertype != 'ZJR1' && ordertype != 'ZYR1'
				&& ordertype != 'ZYR2' && ordertype != 'ZJR2'
				&& ordertype != 'ZJM3' && ordertype != 'ZYS3') {
			// jConfirm("该批次pos库存不足，无法销售，是否检查SAP库存信息？", "提示", function(e) {
			jAlert("库存不足，请检查库存是否足够!", "提示", function(e) {
				$("#charg").select();
				return;
				if (e) {
					$.ajax({
						url : "longhaul/pos/order/orderSystem.ered?reqCode=getSapStockByCharg&postType=1",
						dataType : 'json',
						type : 'post',
						data : "charg=" + charginfo.charg,
						success : function(data) {
							$("#realnumber").val(Number(data));
							if (Number(data) == 0) {
								jAlert("该批次SAP库存不足，不能销售！", "提示", function(e) {
											$("#charg").select();
										});
							} else {
								makePcxxInit(charginfo);
							}
						}
					});
				} else {
					$("#charg").select();
				}
			});
			// return false;
		} else {
			$("#marketprivilege").val(0);
			$("#selfticketprice").val(0);
			$("#vipintegral").val(0);
			$("#selfprivilege").val(0);
			$("#marketticketprice").val(0);
			$("#cashcoupon").val(0);

			makePcxxInit(charginfo);
		}
//		if(!((ordertype == 'ZYS2' && $("#swaptype").val() == 'ZIN') || ordertype == 'ZYR1')){
			getSalepromotion();
//		}

	}

	var needNE = false;
	var extwg = "";

	function makePcxxInit(charginfo) {
		if (charginfo.kbstat == '02') {
			jAlert("价格被冻结，不能进行销售！", "提示", function(e) {
						$("#charg").focus();
					});
			return false;
		} else {

			needNE = false;
			$("#freepersoncostspan").hide();
			$("#matnr").val(charginfo.matnr);
			$("#zhlhx").val(charginfo.zhlhx);
			$("#ztjtj").val(charginfo.ztjtj);
			$("#realprice").val(charginfo.realprice); // 实收
			$("#goldweight").attr("readOnly", true);
			if (charginfo.meins == "G") {
				$("#goldweight").val(charginfo.labst);
			} else {
				$("#goldweight").val(charginfo.goldweight); // 实收
			}
			$("#gemweight").val(charginfo.gemweight); // 石重
			$("#certificateno").val(charginfo.certificateno);
			$("#number").val(1);
			//由于珍珠需要多件管理
				if (charginfo.extwg =="LG"){
					$("#number").val(charginfo.labst);
					$("#numberSpan").show();
					
				}else{
					$("#numberSpan").hide();
				}
			// alert(charginfo.extwg);
			extwg = charginfo.extwg;
			if (charginfo.extwg == 'PE') {
				// $.ajax({
				// url :
				// "longhaul/pos/order/orderSystem.ered?reqCode=getIfNeedNE&postType=1",
				// dataType : 'json',
				// type : 'post',
				// data : "charg=" + charginfo.charg,
				// success : function(data) {
				var name = charginfo.zhlhx;
				// alert(name);
				if (name.indexOf("(") != -1 && name.indexOf("赠链") != -1) {
					// alert("ok");
					needNE = true;
				} else if (name.indexOf("（") != -1 && name.indexOf("赠链") != -1) {
					// alert("ok");
					needNE = true;
				}

				// }
				// });
			}

			$("#realprice").data("kosrt", charginfo.kosrt);
			$("#swaptype").data("oldLgort", charginfo.lgort);
			getLgort(charginfo.lgort);

			$("#logrtinput").val(charginfo.lgort);

			$("#realnumber").val(charginfo.labst);
			// alert(charginfo.labst);

			usedorderid = charginfo.usedorderid;
			var matkl = charginfo.matkl;
			var sjczbm = charginfo.sjczbm;
			var hpzl = charginfo.hpzl;
			// alert(charginfo.ztjtj);
			$("#hpweight").val(hpzl);

			// if($("#swaptype").val() == "GZIN"){
			$("#hpweightSpan").show();
			// }
			if (charginfo.ckxx == '0') {
				// if (charginfo.ztjtj == null || charginfo.ztjtj == 0) {
				if (matkl == 'D' || matkl == 'G' || matkl == 'P' || matkl == 'S') {
					$("#goleweightSpan").show();
					$("#hpweightSpan").hide();
					$("#goldvalue").addClass("inputattention");
					$("#goldweight").val(charginfo.labst); // 金重
					$("#goldweightSpan").show();
					$("#personcost").addClass("inputattention");
					$("#personcost").attr("readOnly", false);
					$("#goldweight").attr("readOnly", false);
					$("#mGoldWeight").attr("readOnly", false);
					$("#ztjtj").val("0");
					if ((ordertype == 'ZJM2' || ordertype == 'ZYS2')
							&& $("#swaptype").val() == 'ZIN') {
						if (matkl == 'P') {
							$("#personcost").val(30);
						} else if (matkl == 'G') {
							$("#personcost").val(20);
						}
					} else if (ordertype == 'ZJR1' || ordertype == 'ZYR1') {
						$("#personcost").val(0);
					} else {
						
						$("#freepersoncostspan").show();
						switch (charginfo.kondm) {
							case '09' :
								var dialog = $.dialog({
										title : '正在获取基本工费，请稍后...',
										max : false,
										min : false,
										close : false,
										lock : true
									});
							$.ajax({
									url : "longhaul/pos/order/orderSystem.ered?reqCode=getZjbgf&postType=1",
									type : 'post',
									data : "charg=" + charginfo.charg+"&kondm=" + charginfo.kondm ,
									success : function(data) {
										dialog.close();
										$("#personcost").val(Number(data));
										// $("#personcostshow").val(Number(data)
										// *
										// 2);
										$("#personcost").attr("readOnly", true);
										getgoldprices(sjczbm);
									}
								});
							
//								if (Number(charginfo.goldweight) < 1) {
//									$("#personcost").val(20);
//									// $("#personcostshow").val(20);
//									getgoldprices(sjczbm);
//								} else if (Number(charginfo.goldweight) >= 1) {
//									$("#personcost").val(10);
//									// $("#personcostshow").val(10);
//									getgoldprices(sjczbm);
//								}
//								$("#personcost").attr("readOnly", true);
								break;
							case '12' :
								var dialog = $.dialog({
											title : '正在获取基本工费，请稍后...',
											max : false,
											min : false,
											close : false,
											lock : true
										});
								$.ajax({
									url : "longhaul/pos/order/orderSystem.ered?reqCode=getZjbgf&postType=1",
									type : 'post',
									data : "charg=" + charginfo.charg+"&kondm=" + charginfo.kondm ,
									success : function(data) {
										dialog.close();
										$("#personcost").val(Number(data) );
										// $("#personcostshow").val(Number(data)
										// *
										// 2);
										$("#personcost").attr("readOnly", true);
										getgoldprices(sjczbm);
									}
								});
								break;
							case '20' :
								var dialog = $.dialog({
											title : '正在获取基本工费，请稍后...',
											max : false,
											min : false,
											close : false,
											lock : true
										});
								$.ajax({
									url : "longhaul/pos/order/orderSystem.ered?reqCode=getZjbgf&postType=1",
									type : 'post',
									data : "charg=" + charginfo.charg+"&kondm=" + charginfo.kondm ,
									success : function(data) {
										dialog.close();
										$("#personcost").val(Number(data) * 2);
										$("#personcost").attr("readOnly", true);
										getgoldprices(sjczbm);
									}
								});
								break;
							default :
								$("#personcost").val(0);
								$("#personcost").attr("readOnly", false);
								getgoldprices(sjczbm);
								break;
						}
					}
					goldtextdisplay();
				}
			}
			_pcimage = charginfo.pcimage;
			_pcimage = _pcimage == null || _pcimage == ""
					? "zjzb.gif"
					: _pcimage;
			$(".tooltip").attr("href", "sappic/" + _pcimage);
			$(".tooltip").attr("title", charginfo.zhlhx);
			$("#pcimage").attr("src", "sappic/" + _pcimage);
			$("#pcimage").attr("alt", _pcimage);
			$("#pcimage").load(function() {
					}).error(function() {
				$("#pcimage").attr("src", "longhaul/pos/order/images/zjzb.gif");
				$("#pcimage").attr("alt", 'zjzb.gif');
				$(".tooltip")
						.attr("href", "longhaul/pos/order/images/zjzb.gif");
				$(".tooltip").attr("title", "zjzb.gif");
			});

			// $("#numberSpan").show();

			_ordertype = $("#ordertype").val();
			if (_ordertype == "ZKL") { // 交货免费得到积分
				_charg = charginfo.label;
				getgiftjf(_charg);
			}
			if (_ordertype == "ZOR4") {
				$("#swaptype").focus();
			} else {
				$("#number").addClass("inputkey");
				$("#charg").removeClass("inputkey");
				$("#number").focus();
			}
			if ((ordertype == "ZJM2" && $("#swaptype").val() != "ZOUT")
					|| (ordertype == "ZYS2" && $("#swaptype").val() != "ZOUT")
					|| ordertype == "ZJR1" || ordertype == "ZYR1") {

				if ($("#rejPackageAndGift").attr("checked") == 'checked') {
										
				} else {
					if((charginfo.extwg == 'EA' || charginfo.extwg == 'EH'
						|| charginfo.extwg == 'ES' || charginfo.extwg == 'EW') && charginfo.meins=='PC' && Number(charginfo.totalLabst) > 0 ){
							if(Number(charginfo.totalLabst) == 0.5){
								if(Number(charginfo.oldsalesquantity) == 0.5){
									$("#doubleorsingleSpan").hide();
								}else{
									$("#doubleorsingle").val('0.5');
									//$("#doubleorsingle").attr("disabled",true);
								}
							}else{
								jAlert("该批次有库存，可能已经做过了退换货，不能再次做退换货处理！", "提示", function(e) {
											$("#charg").focus();
										});
								return;
							}
				}else if (Number(charginfo.totalLabst) > 0 ) {
						jAlert("该批次有库存，可能已经做过了退换货，不能再次做退换货处理！", "提示", function(e) {
									$("#charg").focus();
								});
						return;
				}else if(!charginfo.oldvipcard){
					jAlert("该批次没有出售过，不能做退回处理，谢谢！","提示",function(e){
						$("#charg").select();
						clearcharginfo();
					});
					
				}else if(charginfo.oldvipcard != $("#vipid").val()){
					if($("#matnrSelect").css("display") == 'none'){
						jConfirm("请注意，该批次是卡号："+charginfo.oldvipcard+"购买的，而不是本次会员，确定继续吗？", "提示", function(e) {
									if(e){
										$("#logrt").focus();
									}else{
										$("#charg").select();
										clearcharginfo();
									}
								});		
					}
				}
					if (Number(charginfo.oldunionpay) != 0) {
						$("#ifunionpay").attr("checked", true);
					}

					$("#discount12Span").hide();
					$("#discount34Span").hide();

					$("#discount12").attr("disabled", true);
					$("#discount34").attr("disabled", true);
					$("#selfprivilege").attr("readOnly", true);
					$("#selfticketprice").attr("readOnly", true);
					$("#vipintegral").attr("readOnly", true);
					$("#marketprivilege").attr("readOnly", true);
					$("#marketticketprice").attr("readOnly", true);
					$("#receivable").val(charginfo.realprice);

					$("#goldweight").attr("readOnly", true);
					$("#goldweight").val(charginfo.oldgoldWeight);
					$("#realprice").val(Number(charginfo.realprice)
							- Number($("#personcost").val())
							* Number(charginfo.oldgoldWeight));

					$("#selfprivilege").val(charginfo.oldselfprivilege);
					$("#selfticketprice").val(charginfo.oldselfticketprice);
					$("#vipintegral").val(charginfo.oldvipintegral);
					$("#marketprivilege").val(charginfo.oldmarketprivilege);
					$("#marketticketprice").val(charginfo.oldmarketticketprice);

					if (charginfo.olddiscount1 != 'N/A') {
						$("#discount12").val('1');
						$("#discount1").val(charginfo.olddiscount1);
					} else if (charginfo.olddiscount2 != 'N/A') {
						$("#discount12").val('2');
						$("#discount1").val(charginfo.olddiscount2);
					} else if (charginfo.olddiscount5 != 'N/A') {
						$("#discount12").val('3');
						$("#discount1").val(charginfo.olddiscount5);
					}
					if (charginfo.olddiscount3 != 'N/A') {
						$("#discount34").val('1');
						$("#discount2").val(charginfo.olddiscount3);
					} else if (charginfo.olddiscount4 != 'N/A') {
						$("#discount34").val('2');
						$("#discount2").val(charginfo.olddiscount4);
					}

					$("#oldsaleorderid").val(charginfo.oldsapsaleorderid);
					$("#number").val(charginfo.oldsalesquantity);
					// alert(charginfo.oldshoppingcard);
				}

			} else {
				$("#discount12Span").show();
				$("#discount34Span").show();
				$("#discount12").attr("disabled", false);
				$("#discount34").attr("disabled", false);
				$("#selfprivilege").attr("readOnly", false);
				$("#selfticketprice").attr("readOnly", false);
				$("#vipintegral").attr("readOnly", false);
				$("#marketprivilege").attr("readOnly", false);
				$("#marketticketprice").attr("readOnly", false);
			}

			$("#showmatnrinfo").show();
			$("#showoptinfo").show();

			if (ordertype == "ZYS7" || ordertype == "ZJM7") {
				$("#selfprivilege").attr("readOnly", true);
				//$("#selfticketprice").attr("readOnly", true);
				//$("#vipintegral").attr("readOnly", true);
				$("#marketprivilege").attr("readOnly", true);
				$("#marketticketprice").attr("readOnly", true);

				//$("#giftMethod").attr("disabled", true);
				$("#discount12").attr("disabled", true);
				$("#discount12").val('3');
				$("#discount34").attr("disabled", true);
				$("#discount2").attr("readOnly", true);
				$("#discount1").attr("readOnly", false);
				$("#discount1").focus();
			}

			// 显示价格信息

			if ($("#personcostlabel").css("display") != 'none') {
				$("#personcost").focus();
			} else {

				_ordertype = $("#ordertype").val();
				if (_ordertype == "ZKL") {
					_kunnrjf = $("#kunnrjf").val();
					_giftjf = $("#giftjf").text();
					if (Number(_giftjf) > Number(_kunnrjf)) {
						jAlert(	"客户积分不够兑换商品!当前客户积分:" + _kunnrjf + "商品所需积分:"
										+ _giftjf, '提示', function(r) {
								});
						return false;
					}
				}

				// if (!checkPostNum(this)) {
				// $("#number").focus();
				// return;
				// }
				_chargtype = $('input:radio[name="chargtype"]:checked').val();

				if (_chargtype == "charg" && _ordertype == "ZOR1") {
					if (usedorderid != "") {
						jAlert(	$("#charg").val() + "已存在于订单" + usedorderid
										+ "不能再次加入订单!", '提示', function(r) {
									clearcharginfo();
									$("#number").removeClass("inputkey");
								});
						return false;
					}
				}
				if (Number($("#goldvalue").val()) != 0) {// 有金价
					_goldvalue = $("#goldvalue").val();
					_goldweight = $("#goldweight").val();
					_personcost = $("#personcost").val();
					_price = (Number(_goldvalue) * _goldweight)
							+ Number(_personcost);
					_realprice = $("#realprice").val(); // 实际价格
					_price = _price.toFixed(0);
					// setpricebychargtype(_price, _realprice);
				} else {
					_price = $("#ztjtj").val(); // 价格=标签价格*数量
					_realprice = $("#realprice").val(); // 实际价格
					_price = Number(_price).toFixed(0);
					// setpricebychargtype(_price, _realprice);
				}
				if ((_ordertype == "ZYS2"
						&& ($("#swaptype").val() == "ZIN" || $("#swaptype")
								.val() == "GZIN") && _chargtype == "charg")
						|| (_ordertype == "ZYS2"
								&& $("#swaptype").val() == "ZIN1" && _chargtype == "charg")
						|| (_ordertype == "ZJM2"
								&& ($("#swaptype").val() == "ZIN" || $("#swaptype")
										.val() == "GZIN") && _chargtype == "charg")
						|| (_ordertype == "ZJM2"
								&& $("#swaptype").val() == "ZIN1" && _chargtype == "charg")
						|| (_ordertype == "ZYR1" && _chargtype == "charg")
						|| (_ordertype == "ZJR1" && _chargtype == "charg")) {
					$("#number").removeClass("inputkey");
					// $("#discount1").val(100);
					// $("#discount2").val(100);
					// $("#discount3").val(100);
					// $("#discount4").val(100);
					$("#logrt").show();
					$("#logrt").focus();
				} else {
					$("#discount").addClass("inputkey");
					$("#number").removeClass("inputkey");
					$("#logrt").hide();
					// alert($("#matnrinput").val());
					if ($("#ordertype").val() == 'ZYS1'
							|| ($("#ordertype").val() == 'ZYS2' && $("#swaptype")
									.val() == 'ZOUT')
							|| $("#ordertype").val() == 'ZYS4') {
						$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=getDiscount&option=user&postType=1&charg="
									+ $("#charg").val()
									+ "&kunnr="
									+ $("#kunnr").val()
									+ "&matnr="
									+ $("#matnr").val()
									+ "&saledate="
									+ $("#ordertime").val(),
							dataType : 'json',
							success : function(data) {
								$("#discount1").val(data.discount1);
								$("#discount2").val(data.discount3);
								calcPrice();
							}
						});
					} else {
						$("#discount1").val(100);
						$("#discount2").val(100);
						// $("#discount3").val(100);
					}

					// $("#discount4").val(100);
					$("#discount12").focus();

				}

				if (((ordertype == "ZYS2" || ordertype == "ZJM2") && ($("#swaptype")
						.val() == "ZIN" || $("#swaptype").val() == "GZIN"))
						|| (ordertype == "ZYR1") || (ordertype == "ZJR1")) {

					if ((ordertype == "ZYS2" || ordertype == "ZJM2")
							&& ($("#swaptype").val() == "ZIN" || $("#swaptype")
									.val() == "GZIN"))
						$("#logrt").focus();
					else
						$("#realprice").focus();
				}

				if ($('input:radio[name="chargtype"]:checked').val() == "gift") {
					$("#realprice").select();
					$("#number").val(1);
				}
			}
			calcPrice();
			
			
			if(ordertype == 'ZJM3' || ordertype == 'ZYS3' ){
				if($("#inputBookGood").attr("checked") == 'checked'){
					$("#discount12Span").hide();
					
					$("#giftMethodSpan").hide();
					$("#discount34Span").hide();
					$("#discount1").val("N/A");
					$("#discount2").val("N/A");
				}
			}
			
		}

		if ($('input:radio[name="chargtype"]:checked').val() == 'gift') {
			btnAddRow();
		}

	}

	// 清理批次相关信息
	function clearcharginfo() {
		$("#charg").val("");
		$("#matnr").val("");
		$("#zhlhx").val("");
		$("#ztjtj").val("");
		$("#realprice").val("");
		$("#goldweight").val("");
		$("#mGoldweight").val("");
		$("#gemweight").val("");
		$("#certificateno").val("");
		$("#goldvaluelabel").hide();
		$("#goldvalue").hide();
		$("#personcostlabel").hide();
		$("#goldweightSpan").hide();
		$("#mgoldweightSpan").hide();
		$("#hpweightSpan").hide();
		$("#personcost").hide();
		$("#freepersoncostspan").hide();
		$("#showmatnrinfo").hide();
		$("#showoptinfo").hide();
		$("#personcost").val("");
		$("#goldvalue").val("0");
		$("#number").val("0");
		$("#charg").addClass("inputkey");
		$("#charg_ospan").hide();
		// $("#charg").focus();
	}

	// 换入换出项目
	$("#swaptype").keydown(function(event) {
				if (event.keyCode == 13) {
					// $("#number").addClass("inputkey");
					$("#charg").removeClass("inputkey");
					$("#discount12").focus();
				}
			});

	$("#number").keydown(function(event) {
				if (event.keyCode == 13) {
					$("#settlegoldvalue").focus();
				}
			});

	if (ordertype == "ZOR6") {
		if (opmode != 'view')
			$("#matnrInput").focus();
	} else {
		if (opmode != 'view')
			$("#vipid").focus();
	}

	// 在数量上回车事件personcost
	$("#personcost").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($("#showmatnrinfo").css("display") == "none") {
				$("#charg").select();
			} else {
				_ordertype = $("#ordertype").val();
				// if (_ordertype == "ZKL") {
				// _kunnrjf = $("#kunnrjf").val();
				// _giftjf = $("#giftjf").text();
				// if (Number(_giftjf) > Number(_kunnrjf)) {
				// jAlert("客户积分不够兑换商品!当前客户积分:" + _kunnrjf + "商品所需积分:" +
				// _giftjf, '提示', function(r) {
				// });
				// return false;
				// }
				// }
				// if (!checkPostNum(this)) {
				// $("#number").select();
				// return;
				// }
				_chargtype = $('input:radio[name="chargtype"]:checked').val();

				if (_chargtype == "charg" && _ordertype == "ZOR1") {
					if (usedorderid != "") {
						jAlert(	$("#charg").val() + "已存在于订单" + usedorderid
										+ "不能再次加入订单!", '提示', function(r) {
									clearcharginfo();
									$("#number").removeClass("inputkey");
								});
						return false;
					}
				}

				if ((_ordertype == "ZYS2"
						&& ($("#swaptype").val() == "ZIN" || $("#swaptype")
								.val() == "GZIN") && _chargtype == "charg")
						|| (_ordertype == "ZYR1" && _chargtype == "charg")) {
					$("#realprice").select();
				}
				calcPrice();
			}
		}
	});

	$("#discount1").keydown(function(event) {
				if (event.keyCode == 13) {
					// getCurrentIntegral();
					_discount = $("#discount1").val();
					if (_discount != "") {
						$("#discount1").removeClass("inputkey");
						$("#discount2").addClass("inputkey");
						// $("#discount2").focus();
						$("#discount2").select();
					}
				}
			});
	$("#discount2").keydown(function(event) {
				if (event.keyCode == 13) {
					_discount = $("#discount2").val();
					if (_discount != "") {
						$("#discount2").removeClass("inputkey");
						$("#realprice").addClass("inputkey");
						// $("#realprice").focus();
						$("#realprice").select();
					}
				}
			});

	// $("#discount3").keydown(function(event) {
	// if (event.keyCode == 13) {
	// _discount = $("#discount3").val();
	// if (_discount != "") {
	// $("#discount3").removeClass("inputkey");
	// $("#discount4").addClass("inputkey");
	// $("#discount4").focus();
	// }
	// }
	// });
	// $("#discount4").keydown(function(event) {
	// if (event.keyCode == 13) {
	// _discount = $("#discount4").val();
	// if (_discount != "") {
	// $("#discount4").removeClass("inputkey");
	// $("#realprice").addClass("inputkey");
	// $("#realprice").focus();
	// }
	// }
	// });

	$("#logrt").keydown(function(event) {
		if (event.keyCode == 13) {

			if ($("#showmatnrinfo").css("display") == "none") {
				$("#charg").focus();
			} else {

				if ($("#swaptype").val() == "ZIN" || _ordertype == "ZRE1") { // 如果换入需要输入库位,换出不需要库位
					// 0001 0002 0003 0004 0006 0008
					var chargtype = $('input:radio[name="chargtype"]:checked')
							.val();
					if ((chargtype == "charg" && this.value != "" && (this.value == "0001"
							|| this.value == "0002"
							|| this.value == "0003"
							|| this.value == "0004" || this.value == "0006" || this.value == "0008" || this.value == "0017"))
							|| (chargtype == "gift" && this.value != "" && (this.value == "0005" || this.value == "0011"))) {
						$("#realprice").addClass("inputkey");
						$("#number").removeClass("inputkey");
						$("#realprice").select();
					} else {
						jAlert("请正确输入库位!", '提示', function(r) {
									$("#logrt").focus();
								});
						return false;
					}
				} else {
					$("#realprice").addClass("inputkey");
					$("#number").removeClass("inputkey");
					$("#realprice").select();
				}
			}

		}
	});

	// 根据类型判断是否需要增加 价格
	function setpricebychargtype(_price, _realprice) {
		_chargtype = $('input:radio[name="chargtype"]:checked').val();
		_ordertype = $("#ordertype").val(); // 订单类型字段
		_swaptype = $("#swaptype").val();
		_realprice = _realprice == 0 ? _price : _realprice;// 如果没有最后一次销售价格带出标签价格
		if (_ordertype == "ZYR2" || _ordertype == "ZJM2") {
			$("#receivable").val(_realprice);
			$("#realprice").val(_realprice);
		} else if (_ordertype == "ZYS2" || _ordertype == "ZJM2") {
			if (_swaptype == "ZIN" && _chargtype == "charg") {
				$("#receivable").val(_realprice);
				$("#realprice").val(_realprice);
			} else if (_swaptype == "ZOUT" && _chargtype == "charg") {
				$("#receivable").val(_realprice);
				$("#realprice").val(_realprice);
			} else {
				$("#receivable").val(0);
				$("#realprice").val(0);
				$("#ztjtj").val(0); // 标签价格
			}
		} else if (_chargtype == "charg") {
			$("#receivable").val(_realprice);
			$("#realprice").val(_realprice);
		} else if (_chargtype == "gift") {
			$("#receivable").val(0);
			$("#realprice").val(0);
			$("#ztjtj").val(0); // 标签价格
		}
	}
	// 记录中间变量
	var tempprice = 0;
	var temppersoncost = 0;
	$('#realprice').focus(function(event) {
				tempprice = $(this).val();
				temppersoncost = $("#personcost").val();
			});

	// 在实收这里按
	// $('#realprice').keyup(function(event) {
	// if (checkNum(this)) {
	// _checkuservalue = $('#realprice').val();
	// var checkdigit = _checkuservalue.substring(_checkuservalue.indexOf('.') +
	// 1, _checkuservalue.length);
	// _check = checkdigit.length > 2 && _checkuservalue.indexOf('.') > 0
	// if (_check) {
	// alert("请精确到小数据后两位!");
	// $(this).select();
	// $('#realprice').val(Number(_checkuservalue).toFixed(0));
	// }
	// // if (Number($("#receivable").val()) == 0) {
	// // $("#discount").val(100);
	// // } else {
	// // _discount = (this.value / $("#receivable").val()) * 100 > 100 ? 100 :
	// (this.value / $("#receivable").val()) * 100;
	// // _discount = _discount.toFixed(0);
	// // if (Number($("#goldvalue").val()) != 0) { // 黄金 = 只能扣除加工费用
	// // checkprice = Number(tempprice) - Number(this.value);
	// // checkprice = temppersoncost - checkprice;
	// // //$("#personcost").val(checkprice);
	// // $("#discount").val(_discount);
	// // } else {
	// // $("#discount").val(_discount);
	// // }
	// // }
	// }
	// });

	// 在实收这里按
	$('#realprice').keydown(function(event) {
				// if (event.keyCode == 13) {
				// if (!checkNum(this)) {
				// jAlert("请正确输入金额!", "提示", function(e) {
				// $('#realprice').focus();
				// });
				// return false;
				// }
				//			
				// if(ordertype == 'ZJM6' || ordertype == 'ZYS6'){
				// btnAddRow();
				// }else{
				// $("#selfprivilege").focus();
				// $("#selfprivilege").select();
				// }
				// }
			});

	// 在自发优惠券这里按
	$('#selfprivilege').keydown(function(event) {
				if (event.keyCode == 13) {
					if (!checkNum(this)) {
						jAlert("请正确输入金额!", "提示", function(e) {
									$('#selfprivilege').focus();
								});
						return false;
					}
					$("#selfticketprice").focus();
					$("#selfticketprice").select();
				}
			});

	// 在自发现金券这里按
	$('#selfticketprice').keydown(function(event) {
				if (event.keyCode == 13) {
					if (!checkNum(this)) {
						jAlert("请正确输入金额!", "提示", function(e) {
									$('#selfticketprice').focus();
								});
						return false;
					}
					$("#marketprivilege").focus();
					$("#marketprivilege").select();
				}
			});

	// 在商场优惠券这里按
	$('#marketprivilege').keydown(function(event) {
				if (event.keyCode == 13) {
					if (!checkNum(this)) {
						jAlert("请正确输入金额!", "提示", function(e) {
									$('#marketprivilege').focus();
								});
						return false;
					}
					$("#marketticketprice").focus();
					$("#marketticketprice").select();
				}
			});

	// 在商场优惠券这里按
	$('#marketticketprice').keydown(function(event) {
				if (event.keyCode == 13) {
					if (!checkNum(this)) {
						jAlert("请正确输入金额!", "提示", function(e) {
									$('#marketticketprice').focus();
								});
						return false;
					}
					$("#vipintegral").focus();
					$("#vipintegral").select();
				}
			});

	$("#vipintegral").keydown(function(event) {
				if (event.keyCode == 13) {
					$("#realprice").select();
				} else {
				}
			});

	var myOldRealPrice = 0;
    var dbclick = 0;
	$("#realprice").keypress(function(e) {
		var stone = $("#matnr").val().trim().substring(7,9);
		if (e.keyCode != 13 && dbclick==0) {
			if (ordertype == "ZYR1"
					|| ordertype == "ZJR1"
					|| ((ordertype == "ZYS2" || ordertype == "ZJM2") && ($("#swaptype")
							.val() == "ZIN" || $("#swaptype").val() == "GZIN"))) {
								if(mykondm != '06' && mykondm != '07' && mykondm != '09' && stone != 'CZ'){
								   if( $("#matnr").val().length > 4){
									jAlert("退回产品无法修改实销价！", "提示", function(e) {
												$("#realprice").val(myOldRealPrice);
											});
									}
								}
				return;
			}
		}
	});
$("#realprice").dblclick(function (){
	dbclick++;
});
	$("#realprice").keypress(function(e) {
				if (ordertype == "ZOR6") {
					jAlert("总部易耗品销售，实收价不能修改！", "提示", function(e) {
							})
					return;
				}

			});

	$("#realprice").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($('#charg').val() == "" && $('#matnrInput').val() == "") {
				jAlert("请录入商品信息!", "提示", function(e) {
							$('#charg').focus();
						});
				return;
			}
			var swaptype = $("#swaptype").val();
			if (ordertype == "ZYR1"
					|| ordertype == "ZJR1"
					|| (ordertype == "ZYS2" && (swaptype == "ZIN" || swaptype == 'ZIN1'))
					|| (ordertype == "ZJM2" && (swaptype == "ZIN" || swaptype == 'ZIN1'))) {
				if ($("#logrt").val() == "") {
					jAlert("请输入库位！", "提示", function(e) {
								$("#logrt").focus();
							});
					return;
				}
			}

			if (opmode == "EDIT") {
				$("#orderprint").val("<--先付款").attr('disabled', true);
			}

			if ($('input:radio[name="chargtype"]:checked').val() !== "gift") {
				if (!checkNum(this)) {
					jAlert("请正确输入金额!", "提示", function(e) {
								$("#vipintegral").focus();
							});
				} else if ($("#realprice").val() == 0
						&& $("#giftMethod").val() == '') {
					jAlert("单件实收不能为0，请检查!", "提示", function(e) {
								$("#realprice").focus();
							});
					return false;
				} else {
					
					if(ordertype == 'ZJM3' || ordertype == 'ZJM8' || ordertype == 'ZYS3' || ordertype == 'ZYS8' ){
						$("#currentIntegral").val(0);
						btnAddRow();
					}else{
					var matnr = $("#matnr").val();
					var kunnr = $("#kunnr").val();
						$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=getCurrentIntegral&postType=1",
							data : {
								matnr : matnr,
								kunnr : kunnr,
								orderdate : $("#ordertime").val()
							},
							type : 'post',
							dataType : 'json',
							success : function(retdata) {
								if (retdata != null) {
									$("#currentIntegral").val(retdata);
								} else {
									$("#currentIntegral").val(0);
								}
								// alert($("#realprice").data("kosrt"));
	
								if ($("#realprice").data("kosrt") != null
										&& $("#realprice").data("kosrt") != "") {
									jConfirm("该商品为有组合商品，是否带出组合商品信息！", "提示",
											function(e) {
												if (e) {
													getGroupGoodsInfo($("#realprice")
															.data("kosrt"));
												} else {
													btnAddRow();
												}
											});
								} else {
									btnAddRow();
								}
							}
						});
					}
				}
			} else {
				$.ajax({
					url : "longhaul/pos/order/orderSystem.ered?reqCode=getCurrentIntegral&postType=1",
					data : {
						matnr : matnr,
						orderdate : $("#ordertime").val()
					},
					type : 'post',
					dataType : 'json',
					success : function(retdata) {
						if (retdata != null) {
							$("#currentIntegral").val(retdata);
						} else {
							$("#currentIntegral").val(0);
						}
						// alert($("#realprice").data("kosrt"));

						if ($("#realprice").data("kosrt") != null
								&& $("#realprice").data("kosrt") != "") {
							jConfirm("该商品为有组合商品，是否带出组合商品信息！", "提示",
									function(e) {
										if (e) {
											getGroupGoodsInfo($("#realprice")
													.data("kosrt"));
										} else {
											btnAddRow();
										}
									});
						} else {
							btnAddRow();
						}
					}
				});
			}

		}
	});

	var upbynumber = 1; // 上屋记录
	var upgiftnumber = 1; // 上屋礼品记录
	var toplevelnumber = 1; // 顶屋记录
	var addrownumber = 1; // 记录增加行号到那行
	var updategifid = ""; // 得到赠品的ID 用于记录有多少赠品增加 了
	var updatechargid = ""; // 得到增加产品所在ID
	var allGiftNumber = 0; // 整单礼品
	var bcCount = 0; // 包材礼品
	var needNECount = 0;

	function btnAddRow() {
		var upnumber = 1;
		var style = "";
		var chargtype = $('input:radio[name="chargtype"]:checked').val();
		var rownum = $("#tablecontent tr").length - 2;
		var toplevelstr = ""; // 用于保存上存文本
		var upnumbertext = "";// 记录上存文体

		var ifneedNe = 0;
		if (needNE) {
			
			if(ordertype == "ZJM2" || ordertype == "ZYS2" ){
				if($("#swaptype").val() == 'ZIN'){
					needNECount--;
					ifneedNe = 2;
				}else{
					needNECount++;
					ifneedNe = 1;
				}
			}else if( ordertype == "ZJR1" || ordertype == "ZYR1"){
				needNECount--;
				ifneedNe = 2;
			}else{
				needNECount++;
				ifneedNe = 1
			}
		}

		var isGoldBar = false;
		if ($("#inputgoldbar").attr("checked") == "checked") {
			isGoldBar = true;
		}

		// alert($("#inputgoldbar").attr("checked"));
		// alert(needNE);
		// alert(needNECount);

		var giftMethod = $("#giftMethod").val();
		var depreciationPrice = $("#depreciationPrice").val() == null
				? ''
				: $("#depreciationPrice").val();
		var giftMethodStr = ""
		switch (giftMethod) {
			case '01' :
				giftMethodStr = "赠链";
				break;
			case '02' :
				giftMethodStr = "赠货品";
				break;
		}

		if (giftMethod == "01") {
			if(((ordertype == "ZJM2" || ordertype == "ZYS2") && $("#swaptype").val() == 'ZIN') || ordertype == "ZJR1" || ordertype == "ZYR1" ){
				needNECount++;
				ifneedNe = 1;
			}else{
				needNECount--;
				ifneedNe = 2;
			}
			//ifneedNe = 2;
		}
		// alert(needNECount);

		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (chargtype == "charg") {
			upnumber = Number(toplevelnumber) * 10;
			toplevelnumber = toplevelnumber + 1;
			style = "tdtoplevel";
			upnumbertext = "00";
			toplevelstr = "<div id=leveladdgifts" + upnumber
					+ " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品
		} else if (chargtype == "gift") {

			if ($("#allGift").attr("checked") == 'checked'
					|| ordertype == "ZYS4" || ordertype == "ZJM4") {
				style = "tdallfigtlevel";
				upnumbertext = "00";
				upnumber = Number(toplevelnumber) * 10;
				toplevelnumber = toplevelnumber + 1;

				// style = "tdtoplevel";
				upnumbertext = "00";
				toplevelstr = "<div id=leveladdgifts" + upnumber
						+ " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品

				allGiftNumber++;
			} else if ($("#inputPackage").attr("checked") == 'checked' || ordertype == "ZJM6" || ordertype == "ZYS6") {
				style = "tdbclevel";
				upnumbertext = "00";
				upnumber = Number(toplevelnumber) * 10;
				toplevelnumber = toplevelnumber + 1;

				// style = "tdtoplevel";
				upnumbertext = "00";
				toplevelstr = "<div id=levelbc" + upnumber
						+ " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品

				bcCount++;
			} else if ($("#rejPackageAndGift").attr("checked") == 'checked') {
				style = "tdbclevel";
				upnumbertext = "00";
				upnumber = Number(toplevelnumber) * 10;
				toplevelnumber = toplevelnumber + 1;

				// style = "tdtoplevel";
				upnumbertext = "00";
				toplevelstr = "<div id=levelbc" + upnumber
						+ " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品
			} else {
				var gifusedid = $("#" + updategifid).text(); // 礼品最大填充了多少个
				var usedgifnumber = gifusedid;
				usedgifnumber = (usedgifnumber - (parseInt(usedgifnumber / 10) * 10));// 产品下现在多少礼品
				rownum = Number(addrownumber) + Number(usedgifnumber);
				var newgifs = Number(gifusedid) + 1;
				// upnumber = Number(upbynumber) +upgiftnumber;
				style = "tdgiftlevel";
				upnumber = Number(gifusedid) + 1;
				$("#" + updategifid).text(newgifs);
				upnumbertext = $("#" + updatechargid).text(); // 得到上存ID
				var giftnumber = 0;
				if (opmode == "EDIT") {
					$("#tablecontent tr").each(function() {
						nextchildobject = $(this);
						childposnrnumber = nextchildobject
								.find("div[id^='upnumberlevel']").text(); // 找孩子结点编号
						if (childposnrnumber == upnumbertext) {
							giftnumber = giftnumber + 1;
						}
					});
					rownum = Number(adrownumber) + Number(giftnumber);
				}
				if (_ordertype == "ZRE2" || _ordertype == "ZKL"
						|| _ordertype == "ZJM6" || _ordertype == "ZYS6") { // 赠品的特殊处理
					upnumber = upgiftnumber * 10;
					rownum = $("#tablecontent tr").length - 2; // 赠品固定在后面插入
					// if(ordertype == "ZJM6" || ordertype == 'ZYS6'){
					// rownum = $("#tablecontent tr").length - 2;
					// }
					upnumbertext = "00";
				}
			}
			// rownum=updaterow-1;
		}
		var ordertItemype = "<div id=ordertItemype" + rownum + "></div>";
		// alert($("#logrtinput").val());
		var logrt = "<div id=logrt" + rownum + ">" + $("#logrtinput").val()
				+ "</div>";
		_realprice = Number($("#realprice").val());
		_total = Number($("#realprice").val());
		_ztjtj = $("#ztjtj").val(); // 标签价格
		_realTagPrice = $("#realTagPrice").val();

		_marketprivilege = $("#marketprivilege").val();
		_selfprivilege = $("#selfprivilege").val();
		_marketticketprice = $("#marketticketprice").val();
		_selfticketprice = $("#selfticketprice").val();
		_vipintegral = $("#vipintegral").val();

		var doubleorsingle = Number($("#doubleorsingle").val());
		// alert(doubleorsingle);
		_number = Number($("#number").val()) * Number(doubleorsingle); // 数量

		_goldweight = (Number($("#goldweight").val()) * doubleorsingle)
				.toFixed(3);
		_mGoldWeight = (Number($("#mGoldWeight").val()) * doubleorsingle)
				.toFixed(3);
		var _personcost = (Number($("#personcost").val()) * _goldweight)
				.toFixed(0);
		
		if ($("#swaptype").val() == 'GZIN') {
			_personcost = (Number($("#depreciationPrice").val()) * _goldweight)
					.toFixed(0);
		}

		var personcost = "<div id=personcost" + rownum + ">" + _personcost
				+ "</div>"; // 人工费用

		ordertItemypestr = "";
		switch (_ordertype) {
			case "ZYS2" : // 换货订单类型
				if (chargtype == "charg") {
					_swaptype = $("#swaptype").val();
					if (chargtype == "charg") {
						if (_swaptype == "ZIN") {
							ordertItemypestr = "ZIN";
						} else if (_swaptype == "GZIN") {
							ordertItemypestr = "ZIN1";
						} else {
							ordertItemypestr = "ZOUT";
						}
					} else {
						if (_swaptype == "ZIN") {
							ordertItemypestr = "ZRE1";
						} else {
							ordertItemypestr = "ZTA1";
						}
					}
					logrt = "<div id=logrt" + rownum + ">"
							+ $("#logrtinput").val() + "</div>";
					if ($("#swaptype").val() == "ZIN"
							|| $("#swaptype").val() == "GZIN") {
						_realprice = (0 - Number(_realprice));
						_total = (0 - Number(_total));
						_ztjtj = (0 - Number(_ztjtj));
						_number = (0 - Number(_number));
						_goldweight = (0 - Number(_goldweight));

						_marketprivilege = (0 - Number(_marketprivilege));
						_selfprivilege = (0 - Number(_selfprivilege));
						_marketticketprice = (0 - Number(_marketticketprice));
						_selfticketprice = (0 - Number(_selfticketprice));
						_vipintegral = (0 - Number(_vipintegral));
						
					}
				} else {
					ordertItemypestr = "ZTNN";
					if (_swaptype == "ZIN") {
						_number = (0 - Number(_number));
					}
				}
				break;
			case "ZYS1" :// 直营店普通销售
				ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
				break;
			case "ZYS3" :// 直营店收取订金
				ordertItemypestr = chargtype == "charg" ? "ZL2N" : "ZL2N";
				break;
			case "ZYS4" : // 直营店赠品销售
				ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
				break;
			case "ZYS6" : // 直营店积分兑换
				ordertItemypestr = chargtype == "charg" ? "ZTN3" : "ZTN3";
				logrt = "<div id=logrt" + rownum + ">" + '0014' + "</div>";
				break;
			case "ZYR1" : // 直营店销售退货
				ordertItemypestr = chargtype == "charg" ? "ZREN" : "ZRNN";
				_realprice = (0 - Number(_realprice));
				_total = (0 - Number(_total));
				_ztjtj = (0 - Number(_ztjtj));
				_number = (0 - Number(_number));
				_goldweight = (0 - Number(_goldweight));

				_marketprivilege = (0 - Number(_marketprivilege));
				_selfprivilege = (0 - Number(_selfprivilege));
				_marketticketprice = (0 - Number(_marketticketprice));
				_selfticketprice = (0 - Number(_selfticketprice));
				_vipintegral = (0 - Number(_vipintegral));
				
				
				break;
			case "ZYR2" : // 直营店退还订金
				ordertItemypestr = chargtype == "charg" ? "ZG2N" : "ZG2N";
				break;

			case "ZJM2" : // 加盟店换货销售
				if (chargtype == "charg") {
					_swaptype = $("#swaptype").val();
					if (chargtype == "charg") {
						if (_swaptype == "ZIN") {
							ordertItemypestr = "ZIN";
						} else if (_swaptype == "GZIN") {
							ordertItemypestr = "ZIN1";
						} else {
							ordertItemypestr = "ZOUT";
						}
					} else {
						if (_swaptype == "ZIN") {
							ordertItemypestr = "ZRE1";
						} else {
							ordertItemypestr = "ZTA1";
						}
					}
					logrt = "<div id=logrt" + rownum + ">"
							+ $("#logrtinput").val() + "</div>";
					if ($("#swaptype").val() == "ZIN"
							|| $("#swaptype").val() == "GZIN") {
						_realprice = (0 - Number(_realprice));
						_total = (0 - Number(_total));
						_ztjtj = (0 - Number(_ztjtj));
						_number = (0 - Number(_number));
						_goldweight = (0 - Number(_goldweight));

						_marketprivilege = (0 - Number(_marketprivilege));
						_selfprivilege = (0 - Number(_selfprivilege));
						_marketticketprice = (0 - Number(_marketticketprice));
						_selfticketprice = (0 - Number(_selfticketprice));
						_vipintegral = (0 - Number(_vipintegral));
					}
				} else {
					ordertItemypestr = "ZTNN";
					if (_swaptype == "ZIN") {
						_number = (0 - Number(_number));
					}
				}
				break;
			case "ZJM1" :// 加盟店普通销售
				ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
				break;
			case "ZJM3" :// 加盟店收取订金
				ordertItemypestr = chargtype == "charg" ? "ZL2N" : "ZL2N";
				break;
			case "ZJM4" : // 加盟店赠品销售
				ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
				break;
			case "ZJM6" : // 加盟店积分兑换
				ordertItemypestr = chargtype == "charg" ? "ZTN3" : "ZTN3";
				logrt = "<div id=logrt" + rownum + ">" + '0014' + "</div>";
				break;
			case "ZJR1" : // 加盟店销售退货
				ordertItemypestr = chargtype == "charg" ? "ZREN" : "ZRNN";
				break;
			case "ZJR2" : // 加盟店退还订金
				ordertItemypestr = chargtype == "charg" ? "ZG2N" : "ZG2N";
				break;
			case "ZYS7" :// 直营店员工内销
				ordertItemypestr = chargtype == "charg" ? "ZTA2" : "ZTN2";
				if($("#inputWJGF").attr("checked") == "checked"){
					ordertItemypestr = "ZTA3";
				}
				break;
			case "ZJM7" :// 加盟店员工内销
				ordertItemypestr = chargtype == "charg" ? "ZTA2" : "ZTN2";
				if($("#inputWJGF").attr("checked") == "checked"){
					ordertItemypestr = "ZTA3";
				}
				break;
			case "ZOR6" :// 加盟店员工内销
				ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
				break;
			default :
				break;
		}
		ordertItemypeshow = ordertItemypeshowText(ordertItemypestr);
		ordertItemype = "<div id=ordertItemype" + rownum
				+ " style='display:none'>" + ordertItemypestr + "</div>";

		var delimage;
		if ($("#allGift").attr("checked") == 'checked') {
			delimage = "<img alt='删除allGift' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
		} else if ($("#allGift").attr("checked") == 'checked') {
			delimage = "<img alt='删除bcinfo' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
		} else
			delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
		var row = "<div id=" + rownum + ">" + delimage + "</div>";
		var posnrnumber = "<div  id=posnrnumber" + rownum + "> " + upnumber
				+ " </div>" + "<div id=upnumber" + chargtype + rownum
				+ " style='display:none'>" + upnumber + "</div>" + toplevelstr
				+ "";
		var upumber = "<div id=upnumberlevel" + rownum + ">" + upnumbertext
				+ "</div>";

		var _tempcharg = "", _tempmatnr = "";
		if (chargtype == "charg" && _ordertype != "ZOR8") {
			_tempcharg = $("#charg").val();
			//_tempcharg = g_charginfo.charg?g_charginfo.charg:$("#charg").val();
			g_charginfo={};//清空
			_tempmatnr = $("#matnr").val().indexOf("-") != -1
					? $("#matnr").val().substring(0,
							$("#matnr").val().indexOf("-"))
					: $("#matnr").val();
		} else {
			_tempcharg = "";
			_tempmatnr = $("#charg").val();
		}

		if (ordertype == "ZJM6" || ordertype == "ZYS6" || ordertype == 'ZYS4'
				|| ordertype == 'ZJM4') {
			_tempmatnr = _tempmatnr.substring(0, _tempmatnr.indexOf("-"));
		}

		var charg = "<div id=charg" + rownum + ">"
				+ (isGoldBar ? "" : _tempcharg.toUpperCase()) + "&nbsp;</div>"; // 批次
		var matnr = "<div id=matnr" + rownum + ">" + _tempmatnr.toUpperCase()
				+ "&nbsp; </div>"; // 物料

		var needNEDiv = "<div id=needNE" + rownum + " style='display:none;'>"
				+ ifneedNe + "</div>"; // 是否需要赠链
		var giftMethodDiv = "<div id=giftMethod" + rownum
				+ " style='display:none;'>" + giftMethod + "</div>"; // 赠送方式
		var depreciationPriceDiv = "<div id=depreciationPrice" + rownum
				+ " style='display:none;'>" + depreciationPrice + "</div>"; // 赠送方式

		var zhlhx = "<div id=zhlhx" + rownum + " >" + $("#zhlhx").val()
				+ "&nbsp; </div>"; // 商品ID
		var uniteprice = "<div id=uniteprice" + rownum + ">"
				+ Number($("#ztjtj").val()).toFixed(0) + "&nbsp;</div>"; // 单价
		var number = "<div id=number" + rownum + ">" + _number + "</div>"; // 数量
		var goldweight = "<div id=goldweight" + rownum + ">" + _goldweight + "</div>"; // 金重
		var mGoldWeight = "<div id=mGoldWeight" + rownum + ">" + _mGoldWeight + "</div>"; // 毛重
		var goldvalue = "<div id=goldvalue"
				+ rownum
				+ " style='display:none'>"
				+ (isGoldBar ? $("#realitygoldvalue").val() : $("#goldvalue")
						.val()) + "</div>"; // 金价

		var goldrealprice = "<div id=goldrealprice"
				+ rownum
				+ ">"
				+ (Number($("#personcost").val()) + Number($("#goldweight")
						.val())
						* Number($("#goldvalue").val())).toFixed(0)
				+ "&nbsp;</div>"; // 金价初始总价

		var receivable = "<div id=receivable" + rownum + ">"
				+ Number(_total).toFixed(2) + "</div>"; // 合计
		var ztjtj = "<div id=ztjtj" + rownum + ">" + Number(_ztjtj).toFixed(2)
				+ "</div>"; // 标签价格
		var realTagPrice = "<div id=realTagPrice" + rownum + ">"
				+ Number(_realTagPrice).toFixed(2) + "</div>"; // 标签价格
		var realprice = "<div id=realprice" + rownum + " >"
				+ Number(_realprice).toFixed(2) + "</div>"; // 实销价格
		
		if(((ordertype == 'ZYS2' && $("#swaptype").val() == 'ZIN') || ordertype == 'ZYR1')){
			var salepromotion = "<div id=salepromotion" + rownum + ">" + $("#salepromotion").val() + "</div>"; // 促销代码
		} else {
			var salepromotion = "<div id=salepromotion"
				+ rownum
				+ ">"
				+ (($("#discount12").get(0).selectedIndex == 1)
						? $("#salepromotion").val()
								: "") + "</div>"; // 促销代码
		}
		
		_realDiscount = (Number(_ztjtj) != 0 ? Number(_realprice)
				/ Number(_ztjtj) * 100 : 100).toFixed(0);
		_realDiscount = _realDiscount > 100 ? 100 : _realDiscount;
		var discount1 = "";
		var discount2 = "";
		var discount3 = "";
		var discount4 = "";
		var discount5 = "";

		if (((ordertype == 'ZJM2' || ordertype == 'ZYS2') && ($("#swaptype")
				.val() == 'GZIN' || $("#swaptype").val() == 'ZIN'))
				|| ordertype == 'ZJR1' || ordertype == 'ZYR1') {
			discount1 = "N/A";
			discount2 = "N/A";
			discount3 = "N/A";
			discount4 = "N/A";
			discount5 = "N/A";
		} else {
			var discount12 = $("#discount12").val();
			var discount34 = $("#discount34").val();
			if (discount12 == "1") {
				discount1 = $("#discount1").val(); // 折扣1
				discount2 = 'N/A' // 折扣2
				discount5 = 'N/A';// 折扣5
			} else if (discount12 == '2') {
				discount1 = 'N/A'; // 折扣1
				discount2 = $("#discount1").val(); // 折扣2
				discount5 = 'N/A';// 折扣5
			} else if (discount12 == '3') {
				discount1 = 'N/A'; // 折扣1
				discount2 = 'N/A'; // 折扣2
				discount5 = $("#discount1").val();// 折扣5
			} else {
				discount1 = 'N/A'; // 折扣1
				discount2 = 'N/A' // 折扣2
				discount5 = 'N/A';// 折扣5
			}

			if (discount34 == "1") {
				discount3 = $("#discount2").val(); // 折扣3
				discount4 = "N/A"; // 折扣4
			} else if (discount34 == "2") {
				discount3 = "N/A"; // 折扣3
				discount4 = $("#discount2").val(); // 折扣4
			} else {
				discount3 = "N/A"; // 折扣3
				discount4 = "N/A"; // 折扣4
			}
		}

		if (chargtype == "gift") {
			discount1 = "N/A";
			discount2 = "N/A";
			discount3 = "N/A";
			discount4 = "N/A";
			discount5 = "N/A";
		}

		discount1 = "<div id=discount1" + rownum + ">" + discount1 + "</div>"; // 折扣1
		discount2 = "<div id=discount2" + rownum + ">" + discount2 + "</div>"; // 折扣2
		discount3 = "<div id=discount3" + rownum + ">" + discount3 + "</div>"; // 折扣3
		discount4 = "<div id=discount4" + rownum + ">" + discount4 + "</div>"; // 折扣4
		discount5 = "<div id=discount5" + rownum + ">" + discount5 + "</div>"; // 折扣5
		discount6 = "<div id=discount6" + rownum + ">" + _realDiscount
				+ "</div>"; // 折扣6

		var marketprivilege = "<div id=marketprivilege" + rownum + ">"
				+ _marketprivilege + "</div>";
		var selfprivilege = "<div id=selfprivilege" + rownum + ">"
				+ _selfprivilege + "</div>";
		var marketticketprice = "<div id=marketticketprice" + rownum + ">"
				+ _marketticketprice + "</div>";
		var selfticketprice = "<div id=selfticketprice" + rownum + ">"
				+ _selfticketprice + "</div>";
		var vipintegralNum = Number($("#vipintegral").val());
		var vipintegral = "<div id=vipintegral" + rownum + ">" + _vipintegral
				+ "</div>";
		var currentIntegralNum = (Number($("#currentIntegral").val()) == 0
				? 0
				: (Number(_realprice) / Number($("#currentIntegral").val())))
				.toFixed(0);
		//alert(_ordertype);
				
		// if($("#regname").val() != ""){
		// doubleIntervalValidate = true;
		// }
				
				
				
		if ($("#regname").val() != "") {
			doubleIntervalValidate = false;
		}
				

		if ((ordertype == 'ZYS2' && ($("#swaptype").val() == "ZIN" || $("#swaptype")
				.val() == "GZIN"))
				|| (ordertype == 'ZJM2' && ($("#swaptype").val() == "ZIN" || $("#swaptype")
						.val() == "GZIN"))
				|| (ordertype == 'ZJR1')
				|| (ordertype == 'ZYR1')
				|| (ordertype == 'ZJM3')
				|| (ordertype == 'ZJM8')
				|| (ordertype == 'ZJR2')
				|| (ordertype == 'ZJR3')
				|| (ordertype == 'ZYR2')
				|| (ordertype == 'ZYR3')
				|| (ordertype == 'ZYS3')
				|| (ordertype == 'ZYS8')) {

		} else if (doubleIntervalValidate && currentIntegralNum > 0) {
			/*if (mykondm == "01" || mykondm == "02" || mykondm == "03" || mykondm == "04" || mykondm == "05" || mykondm == "06"){
				if (Number($("#currentIntegral").val()) == 100){
					currentIntegralNum = currentIntegralNum * 2;
				}
			} else if (mykondm == "11"){
				if (Number($("#currentIntegral").val()) == 3000){
					currentIntegralNum = currentIntegralNum * 2;
				}
			} else {
				if (Number($("#currentIntegral").val()) == 300){
					currentIntegralNum = currentIntegralNum * 2;
				}
			}*/
			//三倍积分 zwh 20150108
			
			currentIntegralNum = currentIntegralNum * huitou;
		}
		if (((ordertype == 'ZYS2' || ordertype == 'ZJM2') && $("#swaptype")
				.val() == "ZIN")
				|| ordertype == 'ZYR1' || ordertype == 'ZJR1') {
			//currentIntegralNum = "-" + oldcurrentInteval;
		}

		var currentIntegral = "<div id=currentIntegral" + rownum + ">"
				+ (currentIntegralNum) + "</div>";

		// var cashcoupon = "<div id=cashcoupon" + rownum + ">" +
		// $("#cashcoupon").val() + "</div>";

		var imgpath = $("#pcimage").attr("src");
		var imgalt = $("#pcimage").attr("alt");
		var imaghref = "<a href=" + imgpath + " class='tooltip' title="
				+ $("#zhlhx").val() + "(" + $("#ztjtj").val() + ")>";
		var pcimage = "<div id=pcimage"
				+ rownum
				+ ">"
				+ imaghref
				+ "<img id=pcimagesrc  alt='"
				+ imgalt
				+ "' src="
				+ imgpath
				+ " height='40' width='38' onerror='this.src=\"longhaul\/pos\/order\/images\/zjzb.gif\"'/></a></div>";

		var settlegoldvalueNum = $("#settlegoldvalue").val();
		var realitygoldvalueNum = $("#realitygoldvalue").val();

		var settlegoldvalue = "<div id=settlegoldvalue" + rownum + ">"
				+ (settlegoldvalueNum) + "</div>";
		var realitygoldvalue = "<div id=realitygoldvalue" + rownum + ">"
				+ (realitygoldvalueNum) + "</div>";

		// 设置合计

		$("#totalprice")
				.text((Number($("#totalztjtj").text()) + Number($("#ztjtj")
						.val())).toFixed(2)); // 总的标签价格
		$("#totalnumber")
				.text((Number($("#totalnumber").text()) + Number(_number))); // 总数量
		$("#toalpersoncost")
				.text((Number($("#toalpersoncost").text()) + Number(_personcost))
						.toFixed(2)); // 人工费用
		// $("#totalgoldweight").text((Number(Number($("#totalgoldweight").text())
		// + _goldweight))); // 总金重
		setTotalObjectByName('totalgoldweight', _goldweight, 3);

		// if (chargtype == "charg" || _ordertype == 'ZRE2') {
		$("#total").text((Number($("#total").text()) + _total).toFixed(2)); // 
		$("#totalztjtj")
				.text((Number($("#totalztjtj").text()) + Number(_ztjtj))
						.toFixed(2)); // 
		$("#totalrealprice")
				.text((Number($("#totalrealprice").text()) + _realprice)
						.toFixed(2)); // 实际销售合计
		// }
		$("#goldvalue").removeClass("inputattention");
		$("#personcost").removeClass("inputattention");
		$("#charg").addClass("inputkey");
		$("#realprice").removeClass("inputkey");

		if ($("#matnrselect").css("display") != 'none') {
			$("#matnrselect").focus();
		} else {
			$("#charg").focus();
		}
		// 将输入设置为空
		clearchargre();
		var row = "<tr><td class=" + style + ">" + row + "</td>";
		row = row + "<td class=" + style + ">" + posnrnumber + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + upumber
				+ "</td>";
		row = row + "<td class=" + style + ">" + charg + "</td>";
		row = row + "<td class=" + style + ">" + matnr + "</td>";
		row = row + "<td class=" + style + ">" + zhlhx + needNEDiv
				+ giftMethodDiv + depreciationPriceDiv + "</td>";
		row = row + "<td class=" + style + " align='center'>" + pcimage
				+ "</td>";
		row = row + "<td style='display:none' class=" + style
				+ " align='right'>" + uniteprice + "</td>";
		row = row + "<td style='display:none' class=" + style + ">"
				+ currentIntegral + "</td>";
		row = row + "<td class=" + style + " align='right'>" + number + "</td>";
		goodpersoncosttdshow = $("#thpersoncost").css("display") == "none"
				? "display:none"
				: "";
		goodtdshow = $("#thgoldweight").css("display") == "none"
				? "display:none"
				: "";

		if (ordertItemypestr == 'ZIN1') {
			goodtdshow = "";
			$("#tablecontent tr").each(function() { // 得到每一个tr
						earchobject = $(this);
						$(earchobject.find("td[id^='goldtr']")[0]).show();
					});
		}

		row = row + "<td  id='personcosttd" + rownum + "'  class=" + style
				+ "  align='right' style=" + goodpersoncosttdshow + ">"
				+ personcost + "</td>";
		row = row + "<td  id='goldtr" + rownum + "'  class=" + style
				+ "  align='right' style=" + goodtdshow + ">" + goldweight
				+ goldvalue + "</td>";
		row = row + "<td style='display:none' class=" + style
				+ " align='right'>" + mGoldWeight + "</td>";
		row = row + "<td style='display:none' class=" + style
				+ " align='right'>" + receivable + "</td>";
		row = row + "<td style='display:none' class=" + style
				+ " align='right'>" + goldrealprice + "</td>";
		if (ordertype != "ZJM4" && ordertype != "ZYS4")
			row = row + "<td class=" + style + " align='right'>" + ztjtj
					+ "</td>";

		row = row + "<td style='display:none' class=" + style
				+ " align='right'>" + realTagPrice + "</td>";
		if (ordertype != "ZJM4" && ordertype != "ZYS4")
			row = row + "<td class=" + style + " align='right'>" + realprice
					+ "</td>";
		row = row + "<td class=" + style + ">" + ordertItemype + ""
				+ ordertItemypeshow + "<br/>" + giftMethodStr + "</td>";

		if (ordertype != "ZJM6" && ordertype != "ZYS6" && ordertype != "ZOR6"
				&& (!isGoldBar) && ordertype != "ZJM4" && ordertype != "ZYS4"
				&& ordertype != "ZYS3" && ordertype != "ZJM3" 
				&& ordertype != "ZYS8" && ordertype != "ZJM8") {
			row = row + "<td class=" + style + ">" + discount1 + "</td>";
			row = row + "<td class=" + style + ">" + discount2 + "</td>";
			row = row + "<td class=" + style + ">" + discount5 + "</td>";
			row = row + "<td class=" + style + ">" + discount3 + "</td>";
			row = row + "<td class=" + style + ">" + discount4 + "</td>";
			row = row + "<td class=" + style + ">" + discount6 + "</td>";

			row = row + "<td class=" + style + ">" + marketprivilege + "</td>";
			row = row + "<td class=" + style + ">" + selfprivilege + "</td>";
			row = row + "<td class=" + style + ">" + marketticketprice
					+ "</td>";
			row = row + "<td class=" + style + ">" + selfticketprice + "</td>";
			row = row + "<td class=" + style + ">" + vipintegral + "</td>";
			row = row + "<td class=" + style + ">" + salepromotion + "</td>";
			// row = row + "<td class=" + style + ">" + cashcoupon + "</td>";

			row = row + "<td class=" + style + " id='logrttd" + rownum + "' >"
					+ logrt + "</td>";
		} else {
			if (ordertype != "ZJM4" && ordertype != "ZYS4") {
				if(ordertype != 'ZJM6' && ordertype != 'ZYS6' && ordertype != "ZYS3" && ordertype != "ZJM3" 
				&& ordertype != "ZYS8" && ordertype != "ZJM8"){
				row = row + "<td class=" + style + ">" + settlegoldvalue
						+ "</td>";
						
				row = row + "<td class=" + style + ">" + realitygoldvalue
						+ "</td>";
				
				}
			}
			
			if(ordertype != 'ZJM6' && ordertype != 'ZYS6' && ordertype != "ZYS3" && ordertype != "ZJM3" 
				&& ordertype != "ZYS8" && ordertype != "ZJM8")
				row = row + "<td class=" + style + " id='logrttd" + rownum + "' >"
						+ logrt + "</td>";

		}

		if (ordertype == "ZOR6") {
			row = row + "<td class=" + style + " id='logrttd" + rownum + "' >"
					+ logrt + "</td>";
		}

		row = row + "</tr>";
		$(row).insertAfter($("#tablecontent tr:eq(" + rownum + ")"));
		if (chargtype == "charg") {
			upbynumber = Number(upbynumber) + 1;
		} else if (chargtype == "gift") {
			upgiftnumber = Number(upgiftnumber) + 1;
		}
		goldtextdisplayno();
		$("#showmatnrinfo").hide('fast');
		$("#showoptinfo").hide('fast');

		$("#cash").val($("#totalrealprice").text());
		$("#statementtotal").val($("#totalrealprice").text());

		// if((ordertype == 'ZYS2' && ($("#swaptype").val()=="ZIN" ||
		// $("#swaptype").val()=="GZIN")) || (ordertype == 'ZJM2' &&
		// ($("#swaptype").val()=="ZIN" || $("#swaptype").val()=="GZIN")) ||
		// (ordertype == 'ZJR1') || (ordertype == 'ZYR1')){
		// $("#currentIntevalSpan").text(Number($("#currentIntevalSpan").text())+Number(currentIntegralNum)
		// - vipintegralNum);
		// }else{
		// }

		// $.ajax({
		// url :
		// "longhaul/pos/order/orderSystem.ered?reqCode=getGroupSealGood&option=user&postType=1&charg="
		// + $("#charg").val() + "&matnr=" + $("#matnr").val(),
		// dataType : 'json',
		// success : function(data) {
		//				
		// if(data != '' && data != null){
		// jAlert("该商品有组合产品，是否加入组合商品")
		//					
		// }
		// }
		// });

		if (ordertype == "ZOR6") {
			$("#matnrInput").select();
		}

		$("#statementtotal").val($("#totalrealprice").text());
		getcurrentInteval();

		$("#matnrSelect").val('');
		if (isGoldBar) {
			$("#inputgoldbar").attr("disabled", true);
		} else {
			$("#inputGoldBarSpan").hide();
		}

		if ($("#swaptype").val() == 'GZIN') {
			$("#outGoldType").val('');
		}
	}

	$("#salesorderid").keydown(function(event) {
				if (event.keyCode == 13) {
					creatTablehead($.trim($(this).val()));
				}

			});
	// 修改的时候创建ROW
	function creatTableRow(salesorderid) {
		$.getJSON("longhaul/pos/order/orderSystem.ered?reqCode=getOrderItem&postType=1",
						{
							salesorderid : salesorderid,
							random : Math.random()
						}, function(data) {
							cleartable(); // 先清除table内容
							toplevelnumber = 1;
							upgiftnumber = 1;
							$.each(data, function(key, val) {
								// $("#ordertype").append($("<option
								// value="+val.pzdm+"
								// "+selected+">"+val.pzmc+"("+val.pzdm+")</option>"));
								var style = "";
								_chargtype = val.upsalesorderitem == "00"
										? "charg"
										: "gift";
								_ordertype = $("#ordertype").val(); // 订单类型字段
								style = val.upsalesorderitem == "00"
										&& (_ordertype != "ZRE2" && _ordertype != "ZKL")
										? "tdtoplevel"
										: "tdgiftlevel";

								if (val.orderitemtype == 'ZTNN'
										&& (val.salesorderitem % 10) == 0) {
									if (val.storagelocation == '0012') {
										style = "tdbclevel";
									} else
										style = "tdallfigtlevel";
								}
								var giftMethodStr = "";
								switch (val.giftmethod) {
									case '01' :
										giftMethodStr = "赠链";
										break;
									case '02' :
										giftMethodStr = "赠货品";
										break;
								}

								var delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
								var row = "<div id=" + key + ">" + delimage
										+ "</div>";
								ordertItemype = "<div id=ordertItemype" + key
										+ " style='display:none'>"
										+ val.orderitemtype + "</div>";
								storagelocation = val.storagelocation == null
										? ""
										: val.storagelocation;
								_logrt = "<div id=logrt" + key + ">"
										+ storagelocation + "</div>";
								_promotion = val.salepromotion == null ? "" : val.salepromotion;
								delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
								// row="<div id="+key+">"+delimage+"</div>";
								lowerlevel = val.lowerlevelsnumber == null
										? ""
										: val.lowerlevelsnumber;
								if (val.lowerlevelsnumber != null) { // 最大号
									toplevelnumber = Number(val.salesorderitem)
											/ 10 + 1;
									// toplevelnumber =toplevelnumber+1;
								}
								toplevelstr = "<div id=leveladdgifts"
										+ val.salesorderitem
										+ "  style='display:none'>"
										+ lowerlevel + "</div>";
								posnrnumber = "<div  id=posnrnumber" + key
										+ "> " + val.salesorderitem + " </div>"
										+ "<div id=upnumber" + _chargtype + key
										+ "  style='display:none'>"
										+ val.salesorderitem + "</div>"
										+ toplevelstr + "";
								upumber = "<div id=upnumberlevel" + key + ">"
										+ val.upsalesorderitem + "</div>";
								batchnumber = val.batchnumber == null
										? ""
										: val.batchnumber;
								_charg = "<div id=charg" + key + ">"
										+ batchnumber + "&nbsp;</div>"; // 批次
								var materialnumber = val.materialnumber == null
										|| val.materialnumber == "null"
										? ""
										: val.materialnumber;
								_matnr = "<div id=matnr" + key + ">"
										+ materialnumber + "&nbsp; </div>"; // 物料
								var goodname = val.materialdesc == null
										|| val.materialdesc == "null"
										? ""
										: val.materialdesc;
								_zhlhx = "<div id=zhlhx" + key + " >"
										+ goodname + "</div>"; // 商品ID
								_uniteprice = "<div id=uniteprice" + key + ">"
										+ Number(val.tagprice).toFixed(2)
										+ "&nbsp;</div>"; // 单价
								_number = "<div id=number" + key + ">"
										+ val.salesquantity + "</div>"; // 数量
								_personcost = "<div id=personcost"
										+ key
										+ ">"
										+ Number(val.goodsprocessingfee)
												.toFixed(2) + "</div>"; // 人工费用
								_goldweight = "<div id=goldweight" + key + ">"
										+ Number(val.goldweight).toFixed(3)
										+ "</div>"; // 金重
								_mGoldWeight = "<div id=mGoldWeight" + key + ">"
										+ Number(val.mGoldWeight).toFixed(3)
										+ "</div>"; // 金重
								_goldvalue = "<div id=goldvalue" + key
										+ " style='display:none'>"
										+ val.goldprice + "</div>"; // 金价
								_receivable = "<div id=receivable" + key + " >"
										+ Number(val.totalamount).toFixed(2)
										+ "</div>"; // 合计

								_realDiscount = Number(Number(val.tagprice) != 0
										? Number(val.totalamount)
												/ Number(val.tagprice) * 100
										: 100).toFixed(0);

								if (Number(val.goldprice) > 0) {
									_realDiscount = parseInt(Number(val.totalamount)
											/ (Number(val.goldprice)
													* Number(val.goldweight) + Number(val.goodsprocessingfee))
											* 100);
									_realDiscount = _realDiscount > 100
											? 100
											: _realDiscount;
								}

								// alert(_realDiscount);
								_discount1 = "<div id=discount1"
										+ key
										+ ">"
										+ (val.discount1 == null
												? ""
												: val.discount1) + "</div>"; // 折扣1
								_discount2 = "<div id=discount2"
										+ key
										+ ">"
										+ (val.discount2 == null
												? ""
												: val.discount2) + "</div>"; // 折扣2
								_discount3 = "<div id=discount3"
										+ key
										+ ">"
										+ (val.discount3 == null
												? ""
												: val.discount3) + "</div>"; // 折扣3
								_discount4 = "<div id=discount4"
										+ key
										+ ">"
										+ (val.discount4 == null
												? ""
												: val.discount4) + "</div>"; // 折扣4
								_discount5 = "<div id=discount5"
										+ key
										+ ">"
										+ (val.discount5 == null
												? ""
												: val.discount5) + "</div>"; // 折扣5
								_discount6 = "<div id=discount5" + key + ">"
										+ (_realDiscount) + "</div>"; // 折扣6

								_marketprivilege = "<div id=marketprivilege"
										+ key
										+ ">"
										+ (val.marketprivilege == null
												? ""
												: val.marketprivilege)
										+ "</div>"; // 商场优惠券
								_selfticketprice = "<div id=selfticketprice"
										+ key
										+ ">"
										+ (val.selfticketprice == null
												? ""
												: val.selfticketprice)
										+ "</div>"; // 自发优惠券
								_vipintegral = "<div id=vipintegral"
										+ key
										+ ">"
										+ (val.vipintegral == null
												? ""
												: val.vipintegral) + "</div>"; // 商场现金券
								_selfprivilege = "<div id=selfprivilege"
										+ key
										+ ">"
										+ (val.selfprivilege == null
												? ""
												: val.selfprivilege) + "</div>"; // 自发现金券
								_marketticketprice = "<div id=marketticketprice"
										+ key
										+ ">"
										+ (val.marketticketprice == null
												? ""
												: val.marketticketprice)
										+ "</div>"; // VIP抵现优惠

								_ztjtj = "<div id=ztjtj"
										+ key
										+ " >"
										+ (Number(val.goodsprocessingfee) == 0
												&& val.salesorderitem % 10 == 0
												&& _ordertype != 'ZKL'
												? Number(val.tagprice)
														.toFixed(2)
												: '0.00') + "</div>"; // 标签价格
								_realTagPrice = "<div id=realTagPrice" + key
										+ " >"
										+ Number(val.tagprice).toFixed(2)
										+ "</div>"; // 实际标签价格

								_realprice = "<div id=realprice"
										+ key
										+ ">"
										+ ((ordertype == "ZYR2" || ordertype == "ZJR2")
												? "-"
														+ Number(val.netprice)
																.toFixed(2)
												: Number(val.netprice)
														.toFixed(2)) + "</div>"; // 实销价格
								var discount = val.storediscount == null
										|| val.storediscount == "null"
										? ""
										: val.storediscount;
								_discount = "<div id=discount" + key + ">"
										+ discount + "</div>"; // 折扣
								_productpictureurl = val.productpictureurl == null
										|| val.productpictureurl == ""
										? (compImage = "CHJ"
												? "CHJ-LOGO.JPG"
												: "vt.jpg")
										: val.productpictureurl;
								var imgpath = "sappic/" + _productpictureurl;
								imaghref = "<a href=" + imgpath
										+ " class='tooltip'>";
								_pcimage = "<div id=pcimage"
										+ key
										+ ">"
										+ imaghref
										+ "<img id=pcimagesrc   src="
										+ imgpath
										+ " height='40' width='38' alt='"
										+ _productpictureurl
										+ "' onerror='this.src=\"longhaul\/pos\/order\/images\/zjzb.gif\"'/></a></div>";

								$("#pcimage").attr("src", imgpath);
								$("#pcimage")
										.attr("alt", val.productpictureurl);
								setTotalObjectByName('totalprice',
										val.tagprice, 2);
								setTotalObjectByName('totalnumber',
										val.salesquantity, 0);
								setTotalObjectByName('toalpersoncost',
										val.goodsprocessingfee, 2);
								setTotalObjectByName('totalgoldweight',
										val.goldweight, 3);
								setTotalObjectByName('total', val.totalamount,
										2);
								setTotalObjectByName('totalztjtj',
										val.tagprice, 2);
								setTotalObjectByName(
										'totalrealprice',
										((ordertype == "ZYR2" || ordertype == "ZJR2")
												? -val.netprice
												: val.netprice), 2);
								var row = "<tr><td class=" + style + ">" + row
										+ "</td>";
								if (opmode == "view") {
									row = "<tr><td class=" + style + "></td>";
								}
								row = row + "<td class=" + style + ">"
										+ posnrnumber + "</td>";
								row = row + "<td class=" + style
										+ " style='display:none'>" + upumber
										+ "</td>";
								row = row + "<td class=" + style + ">" + _charg
										+ "</td>";
								row = row + "<td class=" + style + ">" + _matnr
										+ "</td>";
								row = row + "<td class=" + style + ">" + _zhlhx
										+ "</td>";
								row = row + "<td class=" + style
										+ " align='center'>" + _pcimage
										+ "</td>";
								row = row
										+ "<td class="
										+ style
										+ " style='display:none'  align='right'>"
										+ _uniteprice + "</td>";
								row = row + "<td class=" + style
										+ " align='right'>" + _number + "</td>";
								goodtdshow = val.goldprice == 0
										? "display:none"
										: "";
								if (val.goldprice != 0) {
									goldtextdisplay();
								}
								goodtdshow = $("#thpersoncost").css("display") == "none"
										? "display:none"
										: "";
								row = row + "<td class=" + style
										+ "  id='personcosttd" + key
										+ "'  align='right' style='"
										+ goodtdshow + "'>" + _personcost
										+ "</td>";
								row = row + "<td class=" + style
										+ "   id='goldtr" + key
										+ "'   align='right'style='"
										+ goodtdshow + "'>" + _goldweight
										+ _goldvalue + "</td>";
								row = row
										+ "<td class="
										+ style
										+ " style='display:none'  align='right'>"
										+ _receivable + "</td>";

								if (orderTypeCheck() || ordertype == 'ZYS6'
										|| ordertype == 'ZJM6') {
									row = row + "<td class=" + style
											+ " align='right'>" + _ztjtj
											+ "</td>";
									row = row
											+ "<td  style='display:none' class="
											+ style + " align='right'>"
											+ _realTagPrice + "</td>";
								}
								if (ordertype == "ZYS3" || ordertype == "ZJM3"
										|| ordertype == "ZYS8"
										|| ordertype == "ZJM8") {
									row = row + "<td class=" + style
											+ " align='right'>" + _ztjtj
											+ "</td>";
									row = row
											+ "<td  style='display:none' class="
											+ style + " align='right'>"
											+ _realTagPrice + "</td>";
								}

								if (ordertype == "ZOR6") {
									row = row + "<td class=" + style
											+ " align='right'>" + _ztjtj
											+ "</td>";
									row = row
											+ "<td  style='display:none' class="
											+ style + " align='right'>"
											+ _realTagPrice + "</td>";
								}
								if (ordertype != 'ZYS4' && ordertype != 'ZJM4')
									row = row + "<td class=" + style
											+ " align='right'>" + _realprice
											+ "</td>";

								ordertItemypeshow = ordertItemypeshowText(val.orderitemtype);
								row = row + "<td class=" + style + ">"
										+ ordertItemype + ""
										+ ordertItemypeshow + "<br/>"
										+ giftMethodStr + "</td>";
								if (orderTypeCheck()) {
									row = row + "<td class=" + style + ">"
											+ _discount1 + "</td>";
									row = row + "<td class=" + style + ">"
											+ _discount2 + "</td>";
									row = row + "<td class=" + style + ">"
											+ _discount5 + "</td>";
									row = row + "<td class=" + style + ">"
											+ _discount3 + "</td>";
									row = row + "<td class=" + style + ">"
											+ _discount4 + "</td>";
									row = row + "<td class=" + style + ">"
											+ _discount6 + "</td>";

									row = row + "<td class=" + style + ">"
											+ _marketprivilege + "</td>";
									row = row + "<td class=" + style + ">"
											+ _selfprivilege + "</td>";
									row = row + "<td class=" + style + ">"
											+ _marketticketprice + "</td>";
									row = row + "<td class=" + style + ">"
											+ _selfticketprice + "</td>";
									row = row + "<td class=" + style + ">"
											+ _vipintegral + "</td>";
								}

								if (ordertype == "ZOR6") {
									row = row + "<td class=" + style + ">"
											+ _logrt + "</td>";
								}

								if (orderTypeCheck() || ordertype == 'ZYS4' || ordertype == 'ZJM4') {
									row = row + "<td class=" + style + ">" + _promotion + "</td>";
									row = row + "<td class=" + style + ">" + _logrt + "</td>";
								}
								
								row = row + "</tr>";
								if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
									$("input[type=radio][name=chargtype][value=gift]")
											.attr("checked", "checked");
									$("#matnr").hide();
									$("#charglabel").html("赠品料号: ");
									$("#matnrlabel").hide();
									upgiftnumber = Number(val.salesorderitem)
											/ 10 + 1;
								}
								$(row).insertAfter($("#tablecontent tr:eq("
										+ key + ")"));
									// toplevelnumber=Number(key)+1; //设置最上层记录增加
							});
						});
	}
	function ordertItemypeshowText(itemtype) {
		ordertItemypeshow = "";
		switch (itemtype) {
			case "ZTAN" :
				ordertItemypeshow = "标准";
				break;
			case "ZTNN" :
				ordertItemypeshow = "免费";
				break;
			case "ZREN" :
				ordertItemypeshow = "退货";
				break;
			case "ZRNN" :
				ordertItemypeshow = "退货免费";
				break;
			case "ZOUT" :
				ordertItemypeshow = "标准换出";
				break;
			case "ZIN" :
				ordertItemypeshow = "标准换入";
				break;
			case "ZIN1" :
				ordertItemypeshow = "旧金换入";
				break;
			case "ZL2N" :
				ordertItemypeshow = "收取订金";
				break;
			case "ZG2N" :
				ordertItemypeshow = "退还订金";
				break;
			case "ZTA2" :
				ordertItemypeshow = "标准（内销）";
				break;
			case "ZTN2" :
				ordertItemypeshow = "免费（内销）";
				break;
			case "ZG3N" :
				ordertItemypeshow = "退还订金（商场收银）";
				break;
			case "ZL3N" :
				ordertItemypeshow = "收取订金（商场收银）";
				break;
			case "ZTN3" :
				ordertItemypeshow = "积分兑换";
				break;
			case "ZTA3" :
				ordertItemypeshow = "外金工费";
				break;
			default :
				ordertItemypeshow = "未知";
				break;
		}
		return ordertItemypeshow;
	}
	// 设置订单头信息
	function creatTablehead(salesorderid) {
		$.ajaxSetup({
					error : function(x, e) {
						alert("访问服务器错误信息:" + x.responseText);
						return false;
					}
				});
		$.getJSON("longhaul/pos/order/orderSystem.ered?reqCode=getOrderhead&postType=1",
						{
							salesorderid : salesorderid,
							random : Math.random()
						}, function(data) {

							$("#kunnr").val("");
							$("#vipid").val("");

							if (data == "") {
								alert("订单信息不存在!");
								return;
							}
							$.each(data, function(key, val) {
								$("#kunnr").val(val.customerid);
								$("#vipid").val(val.vipcard);
								$("#ordertime").val(val.saledate);
								$("#opterator").val(val.operator);
								// $("#saleman").text(val.salesclerk);
								getsaleman(val.salesclerk, "EDIT");
								$("#salepromotion").val(val.salepromotioncode);
								$("#referrer").val(val.referrer);
								if (opmode == 'view') {
									$("#salepromotion").show();
									$("#salepromotionSelect").hide();
								}
								$("#cashcoupon").val(val.cashcoupon);
								$("#shopnumber").val(val.storereceipt);
								$("#ordertype").val(val.ordertype);
								getUserOderType(val.ordertype);
								$("#orderreason").val(val.orderreason);
								$("#remark").val(val.remarks);
								$("#operatedatetime").text(val.operatedatetime);
								var _sapsalesorderid = val.sapsalesorderid;
								_sapsalesorderid = _sapsalesorderid == null
										? ""
										: _sapsalesorderid;
								$("#sapsalesorderid").text(_sapsalesorderid);
								_vipname = val.vipname == null
										? ""
										: val.vipname;
								$("#vipname").text(_vipname);
								$("#cash").val(val.cash);
								$("#salesorderid").val(val.salesorderid);
								_unionpay = Number(val.unionpay);
								$("#unionpay").val(val.unionpay);
								if (val.storereceipt != null
										&& val.storereceipt != '') {
									$("#ifGiveShopper").attr("checked", true);
									$("#shopnumberSpan").show();
								}
								_shoppingcard = Number(val.shoppingcard);
								$("#shoppingcard").val(val.shoppingcard);
								$("#subscription").val(val.subscription);
								$("#choiceOrderTotalMoney").val(val.totalmoney);
								$("#statementtotal").val(val.amountcollected);
								$("#saleorderidSpan").show();
								$("#currentIntevalSpan")
										.text(val.currentintegral);
								$("#currentIntevalSpanShow")
										.text(val.currentintegral);
								if (opmode != "view" && _sapsalesorderid != "") {
									opmode = "EDIT";
								}
								if (val.ordertype == "ZOR8") {
									$("#matnr").hide();
									$("#charglabel").html("赠品料号: ");
									$("#matnrlabel").hide();
								} else if (val.ordertype == "ZRE1") {
									$('#logartlabe').show();
									$('#logrt').show()
											.addClass("inputattention");
								} else if (val.ordertype == "ZOR4") {
									$('#logartlabe').show();
									$('#logrt').show()
											.addClass("inputattention");
									$('#swaptype').show()
											.addClass("inputattention");
								}
							});
							if (opmode != "view") {
								$("#charg").attr("disabled", false);
								$("#charg").attr("readOnly", false);
								$("#vipid").removeClass("inputkey")
										.addClass("inputnom");
								$("#charg").addClass("inputkey");
								$("#charg").focus();

							}
							$('#ordertype').attr('disabled', true);
							$('#orderreason').attr('disabled', true);
							getkunnrjf($("#kunnr").val());
							$('#kunnr').attr('disabled', true);
							$('#vipid').attr('disabled', true);
							$('#salesorderid').attr('disabled', true);
							$('#orderprint').attr('disabled', false);
							creatTableRow(salesorderid);

							$("#salesorderidSpan").show();
							
							getvipidbyuser();
						});
	}
	function cleartable() {
		$("#tablecontent tr").each(function() {
			nextchildobject = $(this);
			// 删除子结点
			childposnrnumber = nextchildobject.find("div[id^='upnumberlevel']")
					.text(); // 找孩子结点编号
			if (childposnrnumber != "") {
				nextchildobject.remove();
			}
			upbynumber = 1;
			toplevelnumber = 1;
		});
		$("input[type=radio][name=chargtype][value=charg]").attr("checked",
				"checked");
		cleatTotaltr();

	}
	function clearhead() {
		$("#salesorderid").val("");
		//$("#salepromotion").val("");
		$("#kunnr").val("");
		$("#vipid").val("");
		$("#saleman").val("");
		//$("#salepromotion").val("");
		$("#cashcoupon").val("");
		$("#shopnumber").val("");
		$("#sapsalesorderid").text("");
		$("#remark").val("");
		$("#operatedatetime").text("");
		$("#kunnrjf").val("");
		$("#vipname").text("");
		$("#cash").val("0");
		$("#unionpay").val("0");
		$("#shoppingcard").val("0");
		$("#subscription").val("0");
		$("#statementtotal").val("0");

	}

	function clearchargre() {
		// 设置批次相关对应初使值
		$("#charg").val("");
		$("#matnr").val("");
		$("#zhlhx").val("");
		$("#ztjtj").val("");
		$("#number").val("");
		$("#personcost").val("");
		$("#goldweight").val("");
		$("#mGoldweight").val("");
		$("#hpweight").val("");
		$("#receivable").val("0");
		$("#salepromotion").val("");
		$("#matnrInput").val("");
		$("#ztjtj").val("0");
		$("#receivable").val("0");
		$("#realprice").val("0");
		$("#discount1").val("100");
		$("#discount2").val("100");
		$("#gemweight").val("0");
		$("#goldvalue").val("0");
		$("#giftMethod").val("");
		$("#salepromotionSpan").hide();
		$("#goldweightSpan").hide();
		$("#mgoldweightSpan").hide();
		$("#hpweightSpan").hide();
		$("#discount12").val(1);
		$("#discount34").val(1);
		$("#referrer").val("");
		$("#referrer").val("");
		$("#logrt").val("");
		$("#charg_ospan").hide();
		$("#doubleorsingleSpan").hide();
		$("#inputWJGF").attr("checked",null);
		// if (!$("#charg").is(":disabled")) {
		// $("#charg").focus();
		// }
	}

	function log(message) {
		$("#debugtext").text(message);
	}

	$("#tablecontent tr th").dblclick(function() {
		if (opmode == 'view') {
			return;
		}

		if (ordertype == 'ZYS3' || ordertype == 'ZYR2' || ordertype == 'ZJM3'
				|| ordertype == 'ZJR2' || ordertype == 'ZJR1'
				|| ordertype == 'ZYR1' || ordertype == 'ZYS4'
				|| ordertype == 'ZJM4') {
			return;
		}

		// 选择商品
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
			jAlert('赠品销售类型只能录入赠品!', '提示', function(r) {
					});
			return false;
		}
		$("input[type=radio][name=chargtype][value=charg]").attr("checked",
				"checked");
		upgiftnumber = 1;
		clearchargre();
		// log("录入商品"+upbynumber);
		log("录入商品");
		if (_ordertype == "ZOR8") {
			$("#matnr").hide();
			$("#charglabel").html("赠品料号: ");
			$("#matnrlabel").hide();
		} else {
			$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次: ");
			$("#matnr").show();
			$("#charg").show();
			$("#matnrSelect").hide();

			$("#matnrlabel").show();
		}
		if (!$("#charg").is(":disabled")) {
			$("#charg").focus();
		}
	});

	$('#tablecontent tr:gt(0) td').live('dblclick', function() {

		if (opmode == 'view') {
			return;
		}

		if (ordertype == 'ZYS3' || ordertype == 'ZYR2' || ordertype == 'ZJM3'
				|| ordertype == 'ZJR2' || ordertype == 'ZJR1'
				|| ordertype == 'ZYR1' || ordertype == 'ZYS4'
				|| ordertype == 'ZJM4') {
			return;
		}
		//积分兑换修改  20150707
		if (ordertype == 'ZYS6'){
			var tdthis = $(this);
			var chldiv = tdthis.find("div");
			if(chldiv.attr("id").substring(0,9) != "realprice" && parseInt(chldiv.html()) != 1){
				jAlert('不能进行修改,详情可联系VIP部门', '提示');	
			return;
			}
			var chlinput=$("<input value="+chldiv.html()+">"); 
			tdthis.html("");
			tdthis.append(chlinput);
			chlinput.focus();
			chlinput.blur(function (){
				chldiv.html($(this).val());
				tdthis.html(chldiv);
				var td =  tdthis.parent("tr").eq(0).find("td");			
				var td13 = td.eq(13);
				var td15 = td.eq(15);
				var td17 = td.eq(17);
				td15.find("div").html(chldiv.html());
				td13.find("div").html(chldiv.html());		
				var strs = tdthis.parent().parent().find("tr");
				var sumprice = 0;
				for(var i=1;i<strs.length-1;i++){
					var singprice = $(strs[i]).find("td").eq(15).find("div").html();
					sumprice += parseInt(singprice);
					
				}
				$(strs[strs.length-1]).find("td").eq(13).find("div").html(sumprice);
				$("#statementtotal").val(sumprice);
			});
			return false;
		}
		
		
		var tdSeq = $(this).parent().find("td").index($(this)[0]);
		var trSeq = $(this).parent().parent().find("tr")
				.index($(this).parent()[0]);
		var thistr = $(this).parent();
		var val = $('input:radio[name="chargtype"]:checked').val();
		$("input[type=radio][name=chargtype][value=gift]").attr("checked",
				"checked");
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
			jAlert('赠品类型只能录入赠品!', '提示', function(r) {
					});
			return false;
		}
		upbynumber = $(thistr).find("div[id^='upnumbercharg']").text(); // 选择当前商品上屋
		inputcharg = "";
		if (upbynumber == "") {
			jAlert('请选择商品行项增加赠品!!', '提示', function(r) {
						$("input[type=radio][name=chargtype][value=charg]")
								.attr("checked", "checked");
						$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次: ");
						$("#matnr").show();
						$("#matnrSelect").hide();
						$("#charg").show();
						$("#matnrlabel").show();
					});
			return;
		} else {
			updategifid = $(thistr).find("div[id^='leveladdgifts']").attr("id"); // 得到赠品ID商品下增加了多少赠品
			updatechargid = $(thistr).find("div[id^='upnumbercharg']")
					.attr("id");
			inputcharg = $(thistr).find("div[id^='charg']").text() + "批次";
			addrownumber = trSeq;
		}
		var matnr = $(thistr).find("div[id^='matnr']").text().replace(/(^\s*)|(\s*$)/g, "");

		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getMatnrGift&postType=1",
			type : 'post',
			dataType : 'json',
			data : {
				matnr : matnr
			},
			success : function(retdata) {
				// alert(retdata.length);
				if (retdata.length == 0) {
					jAlert("没有批次对应的礼品！", "提示", function(e) {
								// clearchargre();
								// $("#charglabel").html("赠品料号: ");
								// $("#matnrlabel").hide();
								// $("#matnr").hide();
								// $("#charg").show();
								// $("#matnrSelect").hide();
								//
								// //
								// log("录赠品在"+trSeq+"行("+inputcharg+")上层:"+upbynumber);
								// _ordertype = $("#ordertype").val();
								// if (_ordertype == "ZOR4") {
								// ordertItemype =
								// $.trim($(thistr).find("div[id^='ordertItemype']").text());
								// $("#swaptype").val(ordertItemype);
								// } else if (_ordertype == "ZOR8") {
								// $("#matnr").hide();
								// $("#charglabel").html("赠品料号: ");
								// $("#matnrlabel").hide();
								// inputcharg =
								// $(thistr).find("div[id^='matnr']").text() +
								// "物料号";
								// }
								// log("录赠品在" + inputcharg + "");
								//
								// $("#giftReferencePrice").val($(thistr).find("div[id^='ztjtj']").text());
								// // 赋值礼品参考价
								// $(thistr).find("div").each(function() {
								// });

							});
					return;
				}
				$("#matnrSelect").empty();
				$("#matnrSelect").append("<option value=''>请选择</option>");
				$.map(retdata, function(item) {
							clearchargre();
							$("#charglabel").html("赠品料号: ");
							$("#matnrlabel").hide();
							$("#matnr").hide();
							$("#charg").hide();
							$("#matnrSelect").show();
							$("#matnrSelect").append("<option value='"
									+ item.matnr + "'>" + item.name
									+ "</option>");
						});
			}
		});

	});

	$('#delrow').live('click', function() {
		var thistr = $(this).parents("tr:first");
		var thisdelrow = $(this);
		jConfirm("确定删除吗？", "请确认？", function(e) {
			if (e) {
				$("#inputPackage").attr("checked", null);
				$("#inputPackage").attr("allGift", null);
				
				if (opmode == "view") {
					return false;
				}
				if (thisdelrow.attr('alt') == '删除allGift') {
					allGiftNumber--;
				} else if (thisdelrow.attr('alt') == '删除bcinfo') {
					bcCount--;
				}
				// alert($(thistr).find("div[id^='needNE']").text())
				if (thistr.find("div[id^='needNE']").text() == '1') {
					needNECount--;
				} else if (thistr.find("div[id^='needNE']").text() == '2') {
					needNECount++;
				} else if (thistr.find("div[id^='needNE']").text() == '3') {
					needNECount--;
				}
				// alert(needNECount);
				upnumberlevel = $(thistr).find("div[id^='upnumberlevel']")
						.text(); // 得到上层及本层.

				var currentInteval = Number($(thistr).find("div[id^='currentIntegral']").text()); // 本次积分
				var vipintegral = Number($(thistr).find("div[id^='vipintegral']").text()); // 本次积分
				$("#currentIntevalSpan").text(Number($("#currentIntevalSpan").text())- Number(currentInteval))+ vipintegral;
				$("#currentIntevalSpanShow").text(Number($("#currentIntevalSpanShow").text())- Number(currentInteval));

				upnumberlevelvalue = $("#leveladdgifts" + upnumberlevel).text(); // 得到上层有多上赠品
				if (opmode == "ADD") { // 只有增加 的时候编号可以重复计算增长
					$("#leveladdgifts" + upnumberlevel)
							.text(Number(upnumberlevelvalue) - 1); // 当前赠品退出
				}
				if (opmode == "EDIT") {
					$("#orderprint").val(("<--先付款")).attr('disabled', true);
				}

				var nexttrobj = thistr;
				var nextchildobject = thistr;
				_ordertype = $("#ordertype").val(); // 订单类型字段
				if (upnumberlevel == "") {
					jAlert('删除错误!', '提示', function(r) {
							});
					return false;
				}
				do { // 删除 赠品结点改变相应以下赠品结点序号
					nexttrobj = $(nexttrobj).next();
					nextupnumberlevel = nexttrobj
							.find("div[id^='upnumberlevel']").text(); // 下个Tr上层
					posnrnumber = nexttrobj.find("div[id^='posnrnumber']")
							.text(); // 下个Tr上层
					// 编号
					upnumbergift = nexttrobj.find("div[id^='upnumbergift']")
							.text(); // 下个TR的赠品值
					if (nextupnumberlevel != "00") {
						if (opmode == "ADD") {
							nexttrobj.find("div[id^='posnrnumber']")
									.text(Number(posnrnumber) - 1); // 更新层次编号
							nexttrobj.find("div[id^='upnumbergift']")
									.text(Number(upnumbergift) - 1); // 更新赠品编号
						}
					}
				} while (nextupnumberlevel == upnumberlevel)

				if (upnumberlevel == "00") { // 如果是商品删除下面所以赠品 同时改变下面行的行号
					thisposnrnumber = $(thistr).find("div[id^='posnrnumber']")
							.text(); // 得到当前上层编号
					delposnumber = $(thistr).find("div[id^='posnrnumber']")
							.text(); // 得到删除当前编号
					$("#tablecontent tr").each(function() {
						nextchildobject = $(this);
						// 删除子结点
						childposnrnumber = nextchildobject
								.find("div[id^='upnumberlevel']").text(); // 找孩子结点编号
						if (Number(childposnrnumber) == Number(thisposnrnumber)) {
							setTotalByObject(nextchildobject); // 扣合计将子项目
							nextchildobject.remove();
						}
						thisposnumber = $(nextchildobject)
								.find("div[id^='posnrnumber']").text(); // 得到当前编号
						// 循环
						if (Number(thisposnumber) > Number(delposnumber)) {
							changeNextLevel(nextchildobject, 'posnrnumber');
							changeNextLevel(nextchildobject, 'upnumberlevel');
							changeNextLevel(nextchildobject, 'leveladdgifts');
							changeNextLevel(nextchildobject, 'upnumbercharg');
							changeNextLevel(nextchildobject, 'upnumbergift');

						}
					});

					if (opmode == "ADD") {
						toplevelnumber = Number(toplevelnumber) - 1;
						upbynumber = Number(upbynumber) - 1;
					}
				}
				setTotalByObject(thistr); // 将合计扣除

				// var type = thistr.find("div[id^='ordertItemype'");
				// var retailMoney = Number(thistr.find("div[id^='realprice'"));
				// if(type == 'ZIN'){
				// inMoney = inMoney - retailMoney;
				// }else if(type == 'ZOUT'){
				// outMoney = outMoney - retailMoney;
				// }

				// alert(inMoney);
				// alert(outMoney);

				thistr.remove();
				if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
					if (opmode == "ADD") {
						upgiftnumber = Number(upgiftnumber) - 1;
					}
					$("input[type=radio][name=chargtype][value=gift]").attr(
							"checked", "checked");
				} else if (_ordertype == "ZJM4" || _ordertype == "ZYS4"|| _ordertype == "ZJM6"|| _ordertype == "ZYS6") {
					$("input[type=radio][name=chargtype][value=gift]").attr(
							"checked", "checked");
					$("#charglabel").html("赠品料号:");
				} else {
					$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次 ：");
					$("input[type=radio][name=chargtype][value=charg]").attr(
							"checked", "checked");
					// $("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次: ");
					$("#matnr").show();
					$("#matnrlabel").show();
				}

				if (_ordertype == "ZYS2" || _ordertype == "ZJM2") {

				}
				if (_ordertype == "ZJM6" || _ordertype == "ZYS6"
						|| _ordertype == "ZJM4" || _ordertype == "ZYS4") {

				} else {
					if ($("#inputgoldbar").attr("checked") == "checked") {
					} else {
						$("#matnrSelect").hide();
						$("#charg").show();
						$("#allGift").attr("checked", false);
					}
				}

				$(thistr).find("div").each(function() {
						});

				$("#shoppingcard").val(0);
				$("#unionpay").val(0);
				$("#cash").val($("#totalrealprice").text());
				$("#cash").val($("#totalrealprice").text());
				$("#statementtotal").val($("#totalrealprice").text());

				trlength = $("#tablecontent tr").length;
				if (trlength <= 2 && (_ordertype == "ZJM1"
						|| _ordertype == "ZYS1")) {
					$("#inputGoldBarSpan").show();
					$("#inputgoldbar").attr("disabled", false);
				}

			}
		});

	});
	// 改变下层赠品数量
	function changeNextLevel(object, filedaname) {
		oldvalue = $(object).find("div[id^='" + filedaname + "']").text();
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (oldvalue != "00") {
			if (opmode == "ADD") {
				$(object).find("div[id^='" + filedaname + "']")
						.text(Number(oldvalue) - 10); // 下个编号少10
			}
			// 如果是赠品类的销售则不用减少upgiftnumber,因为上层已减少
			upgiftnumber = (_ordertype != "ZRE2" && _ordertype != "ZKL")
					? Number(upgiftnumber) - 1
					: upgiftnumber;
		}
	}

	// 根据对象设置总值
	function setTotalByObject(object) {
		setTotalObjectText(object, 'totalprice', 'uniteprice', 2);
		setTotalObjectText(object, 'totalnumber', 'number', 0);
		setTotalObjectText(object, 'toalpersoncost', 'personcost', 2);
		setTotalObjectText(object, 'totalgoldweight', 'goldweight', 3);
		setTotalObjectText(object, 'total', 'receivable', 2);
		setTotalObjectText(object, 'totalztjtj', 'ztjtj', 2);
		setTotalObjectText(object, 'totalrealprice', 'realprice', 2);
	}

	// 清除汇总行
	function cleatTotaltr() {
		clearTotalText('totalprice', 2);
		clearTotalText('totalnumber', 0);
		clearTotalText('toalpersoncost', 2);
		clearTotalText('totalgoldweight', 3);
		clearTotalText('total', 2);
		clearTotalText('totalztjtj', 2);
		clearTotalText('totalrealprice', 2);
	}

	// 设置合计字段当删除的时候
	function setTotalObjectText(object, totalname, fieldname, fixed) {
		var value = $(object).find("div[id^='" + fieldname + "']").text();
		// 在原有值基础上-去
		$("#" + totalname + "")
				.text((Number($("#" + totalname + "").text()) - Number(value))
						.toFixed(fixed));
	}

	// 设置合计字段当修改增加 行的时候
	function setTotalObjectByName(totalname, value, fixed) {
		$("#" + totalname + "")
				.text((Number($("#" + totalname + "").text()) + Number(value))
						.toFixed(fixed));
	}

	// 设置汇总行为0
	function clearTotalText(totalname, fixed) {
		$("#" + totalname + "").text(Number(0));
	}

	// 设置更改折扣
	$('input[id^=discount]').keyup(function() {
				calcPrice();
			});

	function checkNum(obj) {
		var objvalue = obj.value.replace(/(^\s*)|(\s*$)/g, "");
		// obj.value = objvalue;
		if (objvalue == "" || objvalue == null) {
			return true;
		} else if (isNaN(objvalue)) {
			alert("非法字符，请输入数字");
			obj.value = "";
			return false;
		} else {
			return true;
		}
	}
	function checkPostNum(obj) {
		var re = /^[1-9]\d*$/;
		if (!re.test(obj.value)) {
			alert("必须为正整数!");
			return false;
		} else {
			return true;
		}
	}

	function getkunnrjf(kunnr) {
		// $.ajax({
		// url :
		// "longhaul/pos/order/orderSystem.ered?reqCode=getKunnrJF&postType=1&kunnr="
		// + kunnr + "&random=" + Math.random() + "",
		// success : function(data) {
		// $('#kunnrjf').val(Number(data).toFixed(0));
		// $('#kunnrjf').addClass("kunnrjf");
		// $('#tel').addClass("kunnrjf");
		// }
		// });
	}

	function getgiftjf(charg) {
		$.ajax({
			async : false,
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getGiftJF&postType=1&charg="
					+ charg + "&random=" + Math.random() + "",
			success : function(data) {
				$("#giftjf").text(data);
			}
		});
	}
	function getgoldprices(chargtype) {
		$
				.getJSON(
						"longhaul/pos/order/orderSystem.ered?reqCode=getGoldPrices&postType=1",
						{
							chargtype : chargtype,
							random : Math.random()
						}, function(data) {
							if (data == null || data == "") {
								alert("请注意,没有维护金价!");
							}
							$.each(data, function(key, val) {
										$("#goldvalue").val(val.drjj);
										// var receivable =
										// Number($("#goldvalue").val())*Number($("#goldweight").val());
										// $("#receivable").val(receivable);
										// $("#realprice").val(receivable);
										calcPrice();
									});

						});
	}
	// 改变实际销价格改变相应该合计
	function changerealprice(thistr, thisvalue, oldtext) {
		$("#totalrealprice")
				.text((Number($("#totalrealprice").text()) + (thisvalue - oldtext))
						.toFixed(0));
		$("#total").text((Number($("#total").text()) + (thisvalue - oldtext))
				.toFixed(0));
		receivableobj = $(thistr).find("div[id^='receivable']");
		receivableobj.text(Number(thisvalue).toFixed(0));
	}
	var x = 20;
	var y = 10;
	$('a.tooltip').live('mouseover', function(e) {
		this.myTitle = this.title;
		this.title = "";
		var imgTitle = this.myTitle ? "<br/>" + this.myTitle : "";
		imgTitle = "";
		var tooltip = "<div id='tooltip'><img  src='" + e.target.src
				+ "' alt='产品预览图'/>" + imgTitle + "<\/div>"; // 创建
		var imgWidth, imgHeight;

		$("body").append(tooltip); // 追加到文档中
		// alert("hello");
		if (GetImageHeight(e.target) + e.pageY > $(window).height()) {
			$("#tooltip").css({
						"top" : (e.pageY + y - GetImageHeight(e.target) / 2)
								+ "px",
						"left" : (e.pageX + x) + "px"
					}).show("fast"); // 设置x坐标和y坐标，并且显示

		} else {
			$("#tooltip").css({
						"top" : (e.pageY + y) + "px",
						"left" : (e.pageX + x) + "px"
					}).show("fast"); // 设置x坐标和y坐标，并且显示

		}
			// $("<img/>").attr("src", e.target.src).load(function() {
			//
			// imgWidth = Number(this.width);
			// imgHeight = Number(this.height);
			//
			// alert($(window).height());
			// // alert(e.pageY);
			// // alert(e.pageX);
			// // alert(e.target.height);
			// alert(e.pageY + imgHeight);
			// if ((e.pageY + imgHeight) > $(window).height()) {
			// $("#tooltip").css({
			// "top" : (e.pageY + y - imgHeight / 2)
			// + "px",
			// "left" : (e.pageX + x) + "px"
			// }).show("fast"); // 设置x坐标和y坐标，并且显示
			// } else {
			// $("#tooltip").css({
			// "top" : (e.pageY + y) + "px",
			// "left" : (e.pageX + x) + "px"
			// }).show("fast"); // 设置x坐标和y坐标，并且显示
			// }
			//
			// });
			//				
			// }
	});

	$('a.tooltip').live('mouseout', function(e) {
				this.title = this.myTitle;
				$("#tooltip").remove(); // 移除
			});
	$('a.tooltip').live('mousemove', function(e) {
		if (GetImageHeight(e.target) + e.pageY > $(window).height()) {
			$("#tooltip").css({
						"top" : (e.pageY + y - GetImageHeight(e.target) / 2)
								+ "px",
						"left" : (e.pageX + x) + "px"
					}).show("fast"); // 设置x坐标和y坐标，并且显示

		} else {
			$("#tooltip").css({
						"top" : (e.pageY + y) + "px",
						"left" : (e.pageX + x) + "px"
					}).show("fast"); // 设置x坐标和y坐标，并且显示

		}

	});
	$('a.tooltip').live('click', function(event) {
				jAlert('请您将鼠标移动到图片上显示大图!', '提示', function(r) {
						});
				event.preventDefault();
			});

	$('div.divmatnrdesc').live('mouseover', function(e) {
		_text = $(this).text();
		_tooltip = "<div id='tooltipdiv'><font style='font-size:26px'> "
				+ _text + "</font></div>";
		$("body").append(_tooltip);
		$("#tooltipdiv").show();
		$("#tooltipdiv").css({
					"top" : (e.pageY + 10) + "px",
					"left" : (e.pageX + 10) + "px"
				}).show("fast");
	});

	$('div.divmatnrdesc').live('mouseout', function(e) {
				$("#tooltipdiv").remove();
			});

	$('div.divmatnrdesc').live('mousemove', function(e) {
				$("#tooltipdiv").css({
							"top" : (e.pageY + 10) + "px",
							"left" : (e.pageX + 10) + "px"
						}).show();
			});

	$("div[id^='realprice']").live('click', function() {
		if (ordertype != "ZYS3" && ordertype != "ZJM3")
			return;

		if (opmode == 'view')
			return;

		var divedit = $(this);
		// var divid = divedit.attr('id')
		// _order = divid.substring(divid.indexOf("realprice") + 9,
		// divid.length);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("<input type='text'/>"); // 创建input 输入框
		var oldtext = $(this).html(); // 保存原有的值
		inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		inputIns.keyup(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if (checkNum(this)) {
					divedit.html(Number($(this).val()).toFixed(0)); // 设置新值
					thisvalue = Number($(this).val());
					oldtext = Number(oldtext);

					var _discountDiv = $(thistr).find("div[id^='discount']");
					var _bqjg = $(thistr).find("div[id^='ztjtj']");

					var _goldvalue = Number($(thistr)
							.find("div[id^='goldvalue']").text());

					var bqjg = 0;
					if (_goldvalue != 0) {
						var _currdiscount = Number(_discountDiv.text());
						var _personcostDiv = $(thistr)
								.find("div[id^='personcost']");
						var _oldtotalpersoncost = Number($("#toalpersoncost")
								.text());
						var _goldweight = Number($(thistr)
								.find("div[id^='goldweight']").text());
						
						var _goldrealprice = Number($(thistr)
								.find("div[id^='goldrealprice']").text());
						var _personcost = Number(_personcostDiv.text());
						var _newpersoncost = thisvalue - _goldweight
								* _goldvalue;
						bqjg = _goldrealprice;
						var _totalpersoncost = _oldtotalpersoncost
								+ _newpersoncost - _personcost;
						_personcostDiv.text(Number(_newpersoncost).toFixed(0));
						$("#toalpersoncost").text(Number(_totalpersoncost)
								.toFixed(0));
					} else {
						bqjg = Number(_bqjg.text());
					}
					if (bqjg != 0)
						_discount = parseInt(thisvalue / bqjg * 100) > 100
								? 100
								: parseInt(thisvalue / bqjg * 100);
					else
						_discount = 100;
					// _discountDiv.text(_discount);

					changerealprice(thistr, thisvalue, oldtext);
				} else {
					$(this).focus();
				}
				$("#cash").val($("#totalrealprice").text());
				$("#statementtotal").val($("#totalrealprice").text());
				$("#shoppingcard").val(0);
				$("#unionpay").val(0);

			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
				value = $(this).val();
				if (checkNum(this)) {
					if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
						thisvalue = Number($(this).val());
						oldtext = Number(oldtext);
						changerealprice(thistr, thisvalue, oldtext);
						divedit.html(Number($(this).val()).toFixed(0));

						$("#cash").val($("#totalrealprice").text());
						$("#statementtotal").val($("#totalrealprice")
								.text());
						$("#shoppingcard").val(0);
						$("#unionpay").val(0);
					} else {
						divedit.html(oldtext);
					}
				} else {
					$(this).focus();
				}
			});

	});

	var inMoney = 0;
	var outMoney = 0;
	var allInMoney = 0;
	var allOutMoney = 0;
	function getordertableinfo() {
		trlength = $("#tablecontent tr").length;
		var orderhead = "";
		inMoney = 0;
		outMoney = 0;
		_werks = WERKS;
		// _werks = _werks.substring(0, _werks.length - 1);
		_salesorderid = $("#salesorderid").val();
		orderhead = orderhead + "\"salesorderid\":\"" + $.trim(_salesorderid)
				+ "\",";
		_sapsalesorderid = $("#sapsalesorderid").text();
		orderhead = orderhead + "\"sapsalesorderid\":\""
				+ $.trim(_sapsalesorderid) + "\",";
		_operatedatetime = $("#operatedatetime").text();
		orderhead = orderhead + "\"operatedatetime\":\""
				+ $.trim(_operatedatetime) + "\",";

		var matnrSelectId = $("#matnrSelect").val();

		if (ordertype == 'ZJM3' || ordertype == 'ZJM8' || ordertype == 'ZYS3'
				|| ordertype == 'ZYS8') {
			orderhead = orderhead + "\"choiceorderid\":\""
					+ $.trim(matnrSelectId) + "\",";
		} else if (ordertype == 'ZJR2' || ordertype == 'ZJR3'
				|| ordertype == 'ZYR2' || ordertype == 'ZYR3') {
			orderhead = orderhead + "\"oldsaleorderid\":\""
					+ $.trim(matnrSelectId) + "\",";
		}

		var _ordertype;
		if ($("#ifGiveShopper").attr("checked") != null) {
			switch (ordertype) {
				case 'ZYS3' :
					_ordertype = 'ZYS8';
					break;
				case 'ZYR2' :
					_ordertype = 'ZYR3';
					break;
				case 'ZJM3' :
					_ordertype = 'ZJM8';
					break;
				case 'ZJR2' :
					_ordertype = 'ZJR3';
					break;
			}
		} else {
			_ordertype = $("#ordertype").val();
		}
		orderhead = orderhead + "\"ordertype\":\"" + $.trim(_ordertype) + "\",";
		_orderreason = $("#orderreason").val();
		orderhead = orderhead + "\"orderreason\":\"" + $.trim(_orderreason)
				+ "\",";
		_ordertime = $("#ordertime").val();
		orderhead = orderhead + "\"saledate\":\"" + $.trim(_ordertime) + "\",";
		_salepromotion = $("#salepromotion").val();
		orderhead = orderhead + "\"salepromotioncode\":\""
				+ $.trim(_salepromotion) + "\",";
		_cashcoupon = $("#cashcoupon").val();
		orderhead = orderhead + "\"cashcoupon\":\"" + $.trim(_cashcoupon)
				+ "\",";
		_shopnumber = $("#shopnumber").val();
		orderhead = orderhead + "\"storereceipt\":\"" + $.trim(_shopnumber)
				+ "\",";
		_opterator = $("#opterator").val();
		orderhead = orderhead + "\"operator\":\"" + $.trim(_opterator) + "\",";
		_saleman = $("#saleman").text();
		// _saleman = $("#saleman").selectedValuesString();
		orderhead = orderhead + "\"salesclerk\":\"" + $.trim(_saleman) + "\",";
		_kunnr = $("#kunnr").val();
		orderhead = orderhead + "\"customerid\":\"" + $.trim(_kunnr) + "\",";
		_vipid = $("#vipid").val();
		orderhead = orderhead + "\"vipcard\":\"" + $.trim(_vipid) + "\",";
		orderhead = orderhead + "\"storeid\":\"" + $.trim(_werks) + "\",";
		_remark = $("#remark").val();
		orderhead = orderhead + "\"remarks\":\"" + $.trim(_remark) + "\",";
		_totalprice = $("#totalprice").text();
		orderhead = orderhead + "\"totalprice\":\"" + $.trim(_totalprice)
				+ "\",";
		_totalnumber = $("#totalnumber").text();
		orderhead = orderhead + "\"totalnumber\":\"" + $.trim(_totalnumber)
				+ "\",";
		_toalpersoncost = $("#toalpersoncost").text();
		orderhead = orderhead + "\"toalpersoncost\":\""
				+ $.trim(_toalpersoncost) + "\",";
		_totalgoldweight = $("#totalgoldweight").text();
		
		orderhead = orderhead + "\"totalgoldweight\":\""
				+ $.trim(_totalgoldweight) + "\",";
				
		_total = $("#total").text();
		orderhead = orderhead + "\"total\":\"" + $.trim(_total) + "\",";
		_totalztjtj = $("#totalztjtj").text();
		orderhead = orderhead + "\"totalztjtj\":\"" + $.trim(_totalztjtj)
				+ "\",";
//		if (ordertype == 'ZJM3' || ordertype == 'ZJM8' || ordertype == 'ZYS3'
//				|| ordertype == 'ZYS8') {
//			_totalrealprice = $("#choiceOrderTotalMoney").val() == '' ?  $("#totalrealprice").text() : $("#choiceOrderTotalMoney").val();
//		} else {
			_totalrealprice = $("#totalrealprice").text();
//		}
		orderhead = orderhead + "\"totalmoney\":\"" + $.trim(_totalrealprice)
				+ "\",";
		_statementtotal = $("#statementtotal").val();
		orderhead = orderhead + "\"amountcollected\":"
				+ $.trim(_statementtotal) + ",";
		_currentInteval = $("#currentIntevalSpan").text();
		orderhead = orderhead + "\"currentIntegral\":"
				+ $.trim(_currentInteval) + ",";
		_cash = $("#cash").val();
		_cash = $.trim(_cash);
		_cash = _cash == "" ? 0 : _cash;
		orderhead = orderhead + "\"cash\":\"" + _cash + "\",";
		_unionpay = $("#unionpay").val();
		_unionpay = $.trim(_unionpay);
		_unionpay = _unionpay == "" || _unionpay == null ? 0 : _unionpay;
		orderhead = orderhead + "\"unionpay\":\"" + _unionpay + "\",";
		_shoppingcard = $("#shoppingcard").val();
		_shoppingcard = $.trim(_shoppingcard);
		_shoppingcard = _shoppingcard == "" ? 0 : _shoppingcard
		orderhead = orderhead + "\"shoppingcard\":\"" + _shoppingcard + "\",";

		// 推荐人卡号
		_referrer = $("#referrer").val();
		orderhead = orderhead + "\"referrer\":\"" + _referrer + "\",";

		_subscription = $("#subscription").val();
		_subscription = $.trim(_subscription);
		_subscription = _subscription == "" ? 0 : _subscription;
		// orderhead = orderhead + "\"subscription\":" + _subscription + ",";

		// // 自发券优惠
		// _selfprivilege = $("#selfprivilege").val();
		// _selfprivilege = $.trim(_selfprivilege);
		// _selfprivilege = _selfprivilege == "" ? 0 : _selfprivilege;
		// orderhead = orderhead + "\"selfprivilege\":" + _selfprivilege + ",";
		//
		// // 商场优惠券
		// _marketprivilege = $("#marketprivilege").val();
		// _marketprivilege = $.trim(_marketprivilege);
		// _marketprivilege = _marketprivilege == "" ? 0 : _marketprivilege;
		// orderhead = orderhead + "\"marketprivilege\":" + _marketprivilege +
		// ",";
		//
		// // VIP抵现优惠
		// _vipintegral = $("#vipintegral").val();
		// _vipintegral = $.trim(_vipintegral);
		// _vipintegral = _vipintegral == "" ? 0 : _vipintegral;
		// orderhead = orderhead + "\"vipintegral\":" + _vipintegral + ",";

		_vipname = $("#vipname").text();
		orderhead = orderhead + "\"vipname\":\"" + $.trim(_vipname) + "\",";

		_oldid = $("#matnrSelect").val();
		orderhead = orderhead + "\"oldid\":\"" + $.trim(_oldid) + "\",";
		// alert(_oldid);

		var regname = $("#regname").val();
		var regtel = $("#regtel").val();
		if (regname != null && regname != "") { // 判断姓名
			orderhead = orderhead + "\"regname\":\"" + $.trim(regname) + "\","
			orderhead = orderhead + "\"regtel\":\"" + $.trim(regtel) + "\","
		}

		orderhead = orderhead + "\"orderflag\":\"NO\"";
		orderhead = "{" + orderhead + "}";
		var tablestr = "";
		$("#tablecontent tr").each(function() { // 得到每一个tr
					earchobject = $(this);

					if (earchobject.index() == 0
							|| earchobject.index() + 1 == trlength) {
						return true;
					}
					_posnrnumber = earchobject.find("div[id^='posnrnumber']")
							.text();
					_upnumberlevel = earchobject
							.find("div[id^='upnumberlevel']").text();
					_charg = earchobject.find("div[id^='charg']").text();
					_matnr = earchobject.find("div[id^='matnr']").text();
					_zhlhx = earchobject.find("div[id^='zhlhx']").text(); // 商品ID
					_giftMethod = earchobject.find("div[id^='giftMethod']")
							.text(); // 赠送方式
					_depreciationPrice = earchobject
							.find("div[id^='depreciationPrice']").text(); // 折旧费
					_uniteprice = earchobject.find("div[id^='uniteprice']")
							.text();
					_number = earchobject.find("div[id^='number']").text();
					_personcost = earchobject.find("div[id^='personcost']")
							.text();
					_goldweight = earchobject.find("div[id^='goldweight']")
							.text();
					_mGoldWeight = earchobject.find("div[id^='mGoldWeight']")
							.text();
					_goldvalue = earchobject.find("div[id^='goldvalue']")
							.text();
					_settlegoldvalue = earchobject
							.find("div[id^='settlegoldvalue']").text();
					_realitygoldvalue = earchobject
							.find("div[id^='realitygoldvalue']").text();
					_receivable = earchobject.find("div[id^='receivable']")
							.text();
					_ztjtj = earchobject.find("div[id^='ztjtj']").text();
					_realprice = earchobject.find("div[id^='realprice']")
							.text();
					_discount1 = earchobject.find("div[id^='discount1']")
							.text();
					_discount2 = earchobject.find("div[id^='discount2']")
							.text();
					_discount3 = earchobject.find("div[id^='discount3']")
							.text();
					_discount4 = earchobject.find("div[id^='discount4']")
							.text();
					_discount5 = earchobject.find("div[id^='discount5']")
							.text();
					_ordertItemype = earchobject
							.find("div[id^='ordertItemype']").text()
					_ordertItemype = (_ordertype == 'ZYS8' || _ordertype == 'ZJM8')
							? 'ZL3N'
							: _ordertItemype;
					_ordertItemype = (_ordertype == 'ZYR3' || _ordertype == 'ZJR3')
							? 'ZG3N'
							: _ordertItemype;

					_logrt = earchobject.find("div[id^='logrt']").text();
					_pcimagesrc = earchobject.find("img[id^='pcimagesrc']")
							.attr("alt");
					_leveladdgifts = earchobject
							.find("div[id^='leveladdgifts']").text();

					// 自发券优惠
					_selfprivilege = earchobject
							.find("div[id^='selfprivilege']").text();
					_selfprivilege = $.trim(_selfprivilege);
					_selfprivilege = _selfprivilege == "" ? 0 : _selfprivilege;

					// 商场优惠券
					_marketprivilege = earchobject
							.find("div[id^='marketprivilege']").text();
					_marketprivilege = $.trim(_marketprivilege);
					_marketprivilege = _marketprivilege == ""
							? 0
							: _marketprivilege;

					// VIP抵现优惠
					_vipintegral = earchobject.find("div[id^='vipintegral']")
							.text();
					_vipintegral = $.trim(_vipintegral);
					_vipintegral = _vipintegral == "" ? 0 : _vipintegral;

					// 商场现金券
					_marketticketprice = earchobject
							.find("div[id^='marketticketprice']").text();
					_marketticketprice = $.trim(_marketticketprice);
					_marketticketprice = _marketticketprice == ""
							? 0
							: _marketticketprice;

					// 自发现金券
					_selfticketprice = earchobject
							.find("div[id^='selfticketprice']").text();
					_selfticketprice = $.trim(_selfticketprice);
					_selfticketprice = _selfticketprice == ""
							? 0
							: _selfticketprice;

					// 本次销售积分
					_currentIntegral = earchobject.find("div[id^='currentIntegral']").text();
					_currentIntegral = $.trim(_currentIntegral);
					_currentIntegral = _currentIntegral == "" ? 0 : _currentIntegral;

					_salepromotion = earchobject
							.find("div[id^='salepromotion']").text();
					_salepromotion1 = earchobject
							.find("div[id^='salepromotion']").text();

					// 答谢积分
					_thankIntegral = $("#thankIntegral").val();

					
					if (_ordertItemype == 'ZIN' || _ordertItemype == 'ZIN1'){
							allInMoney = allInMoney + Number(_realprice);
					}else if (_ordertItemype == 'ZOUT'){
							allOutMoney = allOutMoney + Number(_realprice);
					}
					
					var firstCode = _matnr.substring(0, 1);
					var middleCode = _matnr.substring(7, 9);
					if (firstCode == 'M' && middleCode == 'DI') {
						if (_ordertItemype == 'ZIN' || _ordertItemype == 'ZIN1')
							inMoney = inMoney + Number(_realprice);
						else if (_ordertItemype == 'ZOUT')
							outMoney = outMoney + Number(_realprice);
					}
					tablestr = tablestr + "\"" + earchobject.index() + "\":";
					tablestr = tablestr + "{\"salesorderitem\":\""
							+ $.trim(_posnrnumber) + "\",";
					tablestr = tablestr + "\"salesorderid\":\""
							+ $.trim(_salesorderid) + "\",";
					tablestr = tablestr + "\"upsalesorderitem\":\""
							+ $.trim(_upnumberlevel) + "\",";
					tablestr = tablestr + "\"batchnumber\":\"" + $.trim(_charg)
							+ "\",";
					tablestr = tablestr + "\"materialnumber\":\""
							+ $.trim(_matnr) + "\",";
					tablestr = tablestr + "\"materialdesc\":\""
							+ $.trim(_zhlhx) + "\",";
					tablestr = tablestr + "\"giftMethod\":\""
							+ $.trim(_giftMethod) + "\",";
					tablestr = tablestr + "\"depreciationPrice\":\""
							+ $.trim(_depreciationPrice) + "\",";
					tablestr = tablestr + "\"uniteprice\":\""
							+ $.trim(_uniteprice) + "\",";
					tablestr = tablestr + "\"salesquantity\":\""
							+ $.trim(_number) + "\",";
					tablestr = tablestr + "\"goodsprocessingfee\":\""
							+ $.trim(_personcost) + "\",";
					tablestr = tablestr + "\"goldweight\":\""
							+ $.trim(_goldweight) + "\",";
					tablestr = tablestr + "\"mGoldWeight\":\""
							+ $.trim(_mGoldWeight) + "\",";
					tablestr = tablestr + "\"goldprice\":\""
							+ $.trim(_goldvalue) + "\",";
					tablestr = tablestr + "\"settlegoldvalue\":\""
							+ $.trim(_settlegoldvalue) + "\",";
					tablestr = tablestr + "\"realitygoldvalue\":\""
							+ $.trim(_realitygoldvalue) + "\",";
					tablestr = tablestr + "\"totalamount\":\""
							+ ((_ordertype=='ZYS3'||_ordertype=='ZYS8'||_ordertype=='ZYR2'||_ordertype=='ZYR3')?$.trim(_realprice):$.trim(_receivable)) + "\",";
					tablestr = tablestr + "\"tagprice\":\"" + $.trim(_ztjtj)
							+ "\",";
					tablestr = tablestr + "\"netprice\":\""
							+ $.trim(_realprice) + "\",";
					tablestr = tablestr + "\"discount1\":\""
							+ $.trim(_discount1) + "\",";
					tablestr = tablestr + "\"discount2\":\""
							+ $.trim(_discount2) + "\",";
					tablestr = tablestr + "\"discount3\":\""
							+ $.trim(_discount3) + "\",";
					tablestr = tablestr + "\"discount4\":\""
							+ $.trim(_discount4) + "\",";
					tablestr = tablestr + "\"discount5\":\""
							+ $.trim(_discount5) + "\",";
					tablestr = tablestr + "\"orderitemtype\":\""
							+ $.trim(_ordertItemype) + "\",";
					tablestr = tablestr + "\"lowerlevelsnumber\":\""
							+ $.trim(_leveladdgifts) + "\",";
					tablestr = tablestr + "\"storeid\":\"" + $.trim(_werks)
							+ "\",";
					tablestr = tablestr + "\"storagelocation\":\""
							+ $.trim(_logrt) + "\",";

					tablestr = tablestr + "\"selfprivilege\":\""
							+ _selfprivilege + "\",";
					tablestr = tablestr + "\"marketprivilege\":\""
							+ _marketprivilege + "\",";
					tablestr = tablestr + "\"vipintegral\":\"" + _vipintegral
							+ "\",";
					tablestr = tablestr + "\"marketticketprice\":\""
							+ _marketticketprice + "\",";
					tablestr = tablestr + "\"selfticketprice\":\""
							+ _selfticketprice + "\",";

					tablestr = tablestr + "\"thankIntegral\":\""
							+ _thankIntegral + "\",";
					tablestr = tablestr + "\"currentIntegral\":\""
							+ _currentIntegral + "\",";
					tablestr = tablestr + "\"salepromotion\":\""
							+ _salepromotion + "\",";

					tablestr = tablestr + "\"productpictureurl\":\""
							+ $.trim(_pcimagesrc) + "\"}";

					tablestr = earchobject.index() == trlength - 2
							? tablestr
							: tablestr + ",";
				});

		tablestr = "{" + tablestr + "}";
		var tableinfo = {
			orderhead : orderhead,
			orderitem : tablestr
		};
		return tableinfo;
	}

	$("#statementaccount").dialog("destroy");
	$("#statementaccount").dialog({
		autoOpen : false,
		height : 180,
		width : 620,
		modal : true,
		buttons : {
			"付款" : function() {
				if (opmode == "view" && useroption == "print") {
					_salesorderid = $("#salesorderid").val();
					window.showModalDialog(basepath
									+ "longhaul/pos/order/dm_dyxp.jsp?ywxh="
									+ _salesorderid + "&dwbh=" + WERKS,
							'printWindow',
							'dialogWidth=650px;dialogHeight=700px');
					$('input').attr('disabled', true);
					$('select').attr('disabled', true);
					return;
				}
				$("#showuploading").show();
				$(":button").slice(3, 5).attr("disabled", "disabled"); // 多个按钮时只设置某些按钮不可用
				var tableinfo = getordertableinfo();

				if ($("#ordertype").val() == 'ZYS2') {
					if (outMoney < (-inMoney * 1.3)) {
						jAlert("换出金额不能小于换入金额的30%", "提示", function(e) {
									$("#showuploading").hide();
									$(this).dialog("close");
									$(":button").slice(3, 5).attr("disabled",
											false); // 多个按钮时只设置某些按钮不可用
								});
						return;
					}
				}
				$.ajaxSetup({
							error : function(x, e) {
								alert("访问服务器错误!" + x.responseText);
								$("#showuploading").hide();
								$(":button").slice(3, 5)
										.attr("disabled", false); // 多个按钮时只设置某些按钮不可用
								return false;
							}
						});
				$.ajax({
					url : "longhaul/pos/order/orderSystem.ered?reqCode=saveOrder&postType=1",
					cache : false,
					data : {
						orderitem : tableinfo.orderitem,
						orderhead : tableinfo.orderhead,
						useroption : useroption
					},
					type : 'post',
					dataType : 'json',
					success : function(retdata) {
						$("#showuploading").hide();
						$("#orderprint").val("打印").attr('disabled', false);
						if (retdata.sapsalesorderid == null
								|| retdata.sapsalesorderid == "") { // 如果SAP订单号为空
							if (retdata.salesorderid != null
									|| retdata.salesorderid != "") { // 如果SAP没有保存成功,但是AIG保存成功
								if (useroption == "print") {
									$("#salesorderid")
											.val(retdata.salesorderid);
									$("#statementaccount").dialog("close");
									// printWindow=window.open("http://"+posurl+"/chj/dmgl/dyxp/resource/Lodop5.023/dm_dyxp.jsp?ywxh="+retdata.salesorderid+"&dwbh="+WERKS,'printWindow',
									// 'top=10,width=650,height=800,scrollbars=yes,
									// resizable=yes');
									window
											.showModalDialog(
													basepath
															+ "longhaul/pos/order/dm_dyxp.jsp?ywxh="
															+ retdata.salesorderid
															+ "&dwbh=" + WERKS,
													'printWindow',
													'dialogWidth=650px;dialogHeight=700px');
									$('input').attr('disabled', true);
									$('select').attr('disabled', true);
								} else {
									var messagestr = "";
									if (opmode == "ADD") {
										messagestr = "操作<font color=red>失败</font>临时凭证保存成功:"
												+ retdata.salesorderid + "<br>";
									} else {
										messagestr = "操作<font color=red>失败</font>请重新修改订单记录:"
												+ retdata.salesorderid + "<br>";
									}
									$("#salesorderid")
											.val(retdata.salesorderid);
									if (retdata.error != null) {
										messagestr = messagestr + retdata.error;
									}
									if (retdata.message != null) {
										messagestr = messagestr + ""
												+ retdata.message;
									}
									jAlert(messagestr, '提示', function(r) {
												$("#statementaccount")
														.dialog("close");
											});
								}
							} else {
								_retinfo = "操作失败:" + retdata.message;
								jAlert(_retinfo, '提示', function(r) {
											$("#statementaccount")
													.dialog("close");
										});
							}
						} else {
							if (useroption == "print") {
								$("#salesorderid").val(retdata.salesorderid);
								$("#statementaccount").dialog("close");
								// printWindow=window.open("http://"+posurl+"/chj/dmgl/dyxp/dm_dyxp.jsp?ywxh="+retdata.salesorderid+"&dwbh="+WERKS,'printWindow',
								// 'top=10,width=650,height=800,scrollbars=yes,
								// resizable=yes');
								window
										.showModalDialog(
												basepath
														+ "longhaul/pos/order/dm_dyxp.jsp?ywxh="
														+ retdata.salesorderid
														+ "&dwbh=" + WERKS,
												'printWindow',
												'dialogWidth=650px;dialogHeight=700px');
							} else {
								// "POS订单号:" + retdata.salesorderid +
								// "<br>" +
								_retinfo = retdata.message
										+ "<br><font  class='printinfo'>是否打印?</font>";
								jAlert(retdata.message, '提示', function(r) {
									$("#statementaccount").dialog("close");
									cleartable();
									clearhead();
									$("#matnr").show();
									$("#charglabel")
											.html("批&nbsp;&nbsp;&nbsp;&nbsp;次: ");
									$("#matnrlabel").show();
									$("#charg").attr("disabled", true);
									$("#charg").attr("readOnly", true);
									$("#vipid").removeClass("inputnom")
											.addClass("inputkey");
									$("#charg").removeClass("inputkey")
											.addClass("inputnom");
									$("#vipid").focus();

								})
								// alert(_retinfo)

								// jConfirm(_retinfo, '提示', function(r)
								// {
								// if (r == true) {
								// $("#salesorderid").val(retdata.salesorderid);
								// $("#statementaccount").dialog("close");
								// cleartable();
								// clearhead();
								// window.showModalDialog(basepath +
								// "longhaul/pos/order/dm_dyxp.jsp?ywxh="
								// +
								// retdata.salesorderid + "&dwbh=" +
								// WERKS,
								// 'printWindow',
								// 'dialogWidth=650px;dialogHeight=700px');
								// } else {
								// $("#statementaccount").dialog("close");
								// cleartable();
								// clearhead();
								// $("#matnr").show();
								// $("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次:
								// ");
								// $("#matnrlabel").show();
								// $("#charg").attr("disabled", true);
								// $("#charg").attr("readOnly", true);
								// $("#kunnr").removeClass("inputnom").addClass("inputkey");
								// $("#charg").removeClass("inputkey").addClass("inputnom");
								// $("#kunnr").focus();
								// }
								// });
							}

						}
						$(":button").slice(3, 5).attr("disabled", false); // 多个按钮时只设置某些按钮不可用

					}
				});
			},
			"关闭" : function() {
				$(this).dialog("close");
			}
		}

	});
	var _unionpay = 0;
	var _shoppingcard = 0;
	var _subscription = 0;

	var _selfprivilege = 0;
	var _marketprivilege = 0;
	
	var _vipintegral = 0;

	var useroption = "";
	var statementindex = 4;
	// 付款
	$("#userstatement").click(function() {
		var $p = $(this);
		$p.hide();//隐藏按妞
		setTimeout("$('#userstatement').show()",5000);//5s后恢复
		if ($("#ordertype").val() == "ZOR4" && !checkChangeInfo()) {// 检查换货输入信息
			$("#charg").focus();
		} else {
			//积分兑换时检查积分是否足够
			if(ordertype == 'ZYS6'){
				//var totalPoint = Number($("#statementtotal").html());
				var totalPoint = Number($("#totalrealprice").html());
				var userPoint = Number($("#kunnrjf").val());
				//alert(totalPoint + "|" + userPoint);
				if(totalPoint > userPoint){
					jAlert("积分不够，不允许兑换！", "提示", function(e) {
					});
					return false;
				}
			}

			if (ordertype == 'ZYS3' || ordertype == 'ZJM3') {

			} else {
				$("#statementtotal").val($("#totalrealprice").text());
				_usercash = Number($("#totalrealprice").text())
						- $("#unionpay").val() - $("#shoppingcard").val()
						- $("#selfprivilege").val()
						- $("#marketprivilege").val() - $("#vipintegral").val();
				$("#cash").val(_usercash);
			}
			_unionpay = $("#unionpay").val();
			_shoppingcard = $("#shoppingcard").val();
			_subscription = $("#subscription").val();

			_selfprivilege = $("#selfprivilege").val();
			_marketprivilege = $("#marketprivilege").val();
			_vipintegral = $("#vipintegral").val();

//			$(":button").eq(statementindex).text("付款");
//			$(":button").eq(statementindex).addClass('ui-dialog-buttonpane '
//					+ 'ui-widget-content ' + 'ui-helper-clearfix')
//			$(":button").eq(statementindex + 1).text("关闭");
//			$(":button").eq(statementindex + 1)
//					.addClass('ui-dialog-buttonpane ' + 'ui-widget-content '
//							+ 'ui-helper-clearfix')

			useroption = "statement";
			trlength = $("#tablecontent tr").length;
			if (trlength == 2) {
				jAlert("没有录入任何订单信息,不能付款!", "提示", function(e) {
							// alert(e);
						});
				return false;
			} else {

				
//				if (needNECount > 0) {
//					jAlert("你有" + needNECount + "个含赠链吊坠需要输入赠链,请输入赠链信息后再提交！",
//							"提示", function(e) {
//								$("#charg").focus();
//							});
//					return;
//				} else if (needNECount < 0) {
//					jAlert(	"你有录入" + Math.abs(needNECount)
//									+ "条赠链信息，但是没有发现需要配赠链的吊坠信息，请检查！", "提示",
//							function(e) {
//								$("#charg").focus();
//							});
//					return;
//				}

				if (ordertype == "ZOR6") {// || ordertype ==
					// "ZYS3" ||
					// ordertype ==
					// "ZYR2" ||
					// ordertype ==
					// "ZJM3" ||
					// ordertype ==
					// "ZJR2"){
					
									submit();
				} else {
					if (salemanconf == 0) {
						jAlert("没有营业员信息，请维护营业员信息！", "提示", function(e) {
									getsaleman("", "ADD");
									$("#saleman").click();
									$("#saleman").focus();
								});
						return;
					} else if ($.trim($("#saleman").text()) == "请选择营业员") {
						jAlert("请选择营业员", "提示", function(e) {
									$("#saleman").click();
									$("#saleman").focus();
								});
						return false;
					} else if ($("#shopnumber").val() == '') {

						if ((ordertype != "ZJM3" && ordertype != "ZYS3"
								&& ordertype != "ZJR2" && ordertype != "ZYR2"
								&& ordertype != "ZJM6" && ordertype != "ZYS6"
								&& ordertype != 'ZJM4' && ordertype != 'ZYS4')) {
							jAlert("商场小票不能为空！", "提示", function(e) {
										$("#shopnumber").focus();
									});
							return;
						} else {
							if ($("#ifGiveShopper").attr("checked") != null) {
								jAlert("商场小票不能为空！", "提示", function(e) {
											$("#shopnumber").focus();
										});
								return;
							}

											submit();
						}
					} else {
										submit();
					}
				}

			}
		}
	})

	$("#orderprint").click(function() {
		var salesorderid = $("#salesorderid").val();
		var sapsalesorderid = $("#sapsalesorderid").text();

		// window.showModalDialog(basepath +
		// "longhaul/pos/order/orderSystem.ered?reqCode=getOrderInfoForPrint&postType=1&salesorderid="
		// + salesorderid+"&sapsalesorderid="+sapsalesorderid, 'Print',
		// 'height=800, width=1000, top=0, left=0, toolbar=no,
		// menubar=no, scrollbars=no, resizable=no,location=n o,
		// status=no');

		window
				.showModalDialog(basepath
								+ "/longhaul/pos/order/dm_dyxp.jsp?ywxh="
								+ salesorderid, "Print",
						"dialogWidth:1000px,dialogHeight:735px,dialogTop:20px,dialogLeft,20px");

			// window.location.reload(true);
			/*
			 * // $(":button").slice(2,3).attr("disabled",true);
			 * //多个按钮时只设置某些按钮不可用 $(":button").eq(statementindex).text("打印");
			 * $(":button").eq(statementindex).addClass('ui-dialog-buttonpane ' +
			 * 'ui-widget-content ' + 'ui-helper-clearfix')
			 * $(":button").eq(statementindex + 1).text("关闭");
			 * $(":button").eq(statementindex +
			 * 1).addClass('ui-dialog-buttonpane ' + 'ui-widget-content ' +
			 * 'ui-helper-clearfix')
			 * 
			 * useroption = "print";
			 * $("#statementtotal").val($("#totalrealprice").text()); _usercash =
			 * Number($("#totalrealprice").text()) - $("#unionpay").val() -
			 * $("#shoppingcard").val() - $("#selfprivilege").val() -
			 * $("#marketprivilege").val() - $("#vipintegral").val();
			 * $("#cash").val(_usercash); _unionpay = $("#unionpay").val();
			 * _shoppingcard = $("#shoppingcard").val(); _subscription =
			 * $("#subscription").val(); trlength = $("#tablecontent
			 * tr").length; if (trlength == 2) { jAlert("没有录入任何订单信息,不能付款!",
			 * '提示', function(r) { return false; }); } else { if
			 * ($.trim($("#saleman").text()) == "请选择营业员") { jAlert("请选择营业员",
			 * '提示', function(r) { $("#saleman").click(); $("#saleman").focus();
			 * }); return false; } else { $("#statementaccount").dialog("open");
			 * $("#showuploading").hide(); } }
			 */
	})

	$("#orderhead").click(function() {
				$("#autocompletesecond").val(autocompletedelay);
				$("#autocompletewords").val(autocompletelength);
				$("#userconfiger").dialog("open");
			})
	$("#userconfiger").dialog("destroy");
	$("#userconfiger").dialog({
		autoOpen : false,
		height : 300,
		width : 340,
		modal : true,
		buttons : {
			"保存" : function() {
				_autocompletesecond = $("#autocompletesecond").val();
				_autocompletewords = $("#autocompletewords").val();
				_autocompletesecond = $.trim(_autocompletesecond);
				_autocompletesecond = _autocompletesecond == ""
						? 4000
						: _autocompletesecond;
				_autocompletewords = _autocompletewords == ""
						? 2
						: _autocompletewords;
				$.ajax({
					url : "longhaul/pos/order/orderSystem.ered?reqCode=setUserConfiger&postType=1&userid="
							+ opterator
							+ "&autocompletewords="
							+ _autocompletewords
							+ "&autocompletesecond="
							+ _autocompletesecond
							+ "&random="
							+ Math.random()
							+ "",
					success : function(data) {
						$("#userconfiger").dialog("close");
					}
				});

			},
			"关闭" : function() {
				$("#userconfiger").dialog("close");
			}
		},
		show : function() {
			// $(":button").attr("disabled","disabled"); //所以按钮不可用
			// $(":button").slice(0,1).attr("disabled","disabled");
			// //多个按钮时只设置某些按钮不可用
		}
	})

	$("#autocompletesecond").keyup(function(event) {
				value = $(this).val();
				if (checkNum(this)) {
				}
			})
	$("#autocompletewords").keyup(function(event) {
				_value = $(this).val();
				if (checkNum(this)) {
				}
			})

	$("#unionpay").keyup(function(event) {
		value = $(this).val();
		if (ordertype == 'ZJR2' || ordertype == 'ZYR2') {
			if (value.length > 1) {
				if (checkNum(this)) {
					unionpayvalue = Number($("#cash").val())
							+ Number(_unionpay);
					unionpayvalue = Number(unionpayvalue) - Number(value);
					$("#cash").val(unionpayvalue.toFixed(2));
					_unionpay = value
				}
			}
		} else {
			if (checkNum(this)) {
				unionpayvalue = Number($("#cash").val()) + Number(_unionpay);
				unionpayvalue = Number(unionpayvalue) - Number(value);
				$("#cash").val(unionpayvalue.toFixed(2));
				_unionpay = value

				if (Number($("#cash").val()) < 0)
					jAlert("金额为负数了!", '提示', function(r) {
								$("#unionpay").focus();
							});
			}
		}
	});
	$("#shoppingcard").keyup(function(event) {
		value = $(this).val();

		if (ordertype == 'ZJR2' || ordertype == 'ZYR2') {
			if (value.length > 1) {
				if (checkNum(this)) {
					unionpayvalue = Number($("#cash").val())
							+ Number(_shoppingcard);
					unionpayvalue = Number(unionpayvalue) - Number(value);
					$("#cash").val(unionpayvalue.toFixed(2));
					_shoppingcard = value
					if (ordertype != 'ZJR2' && ordertype != 'ZYR2')
						if (Number($("#cash").val()) < 0)
							jAlert("金额为负数了!", '提示', function(r) {
										$("#shoppingcard").focus();
									});
				}
			}
		} else {
			if (checkNum(this)) {
				unionpayvalue = Number($("#cash").val())
						+ Number(_shoppingcard);
				unionpayvalue = Number(unionpayvalue) - Number(value);
				$("#cash").val(unionpayvalue.toFixed(2));
				_shoppingcard = value
				if (ordertype != 'ZJR2' && ordertype != 'ZYR2')
					if (Number($("#cash").val()) < 0)
						jAlert("金额为负数了!", '提示', function(r) {
									$("#shoppingcard").focus();
								});
			}
		}
	});
	// $("#subscription").keyup(function(event) {
	// value = $(this).val();
	// if (checkNum(this)) {
	// unionpayvalue = Number($("#cash").val()) + Number(_subscription);
	// unionpayvalue = Number(unionpayvalue) - Number(value);
	// $("#cash").val(unionpayvalue);
	// _subscription = value
	// if (Number($("#cash").val()) < 0)
	// jAlert("金额为负数了!", '提示', function(r) {
	// });
	// }
	// });
	// $("#selfprivilege").keyup(function(event) {
	// value = $(this).val();
	// if (checkNum(this)) {
	// unionpayvalue = Number($("#cash").val()) + Number(_selfprivilege);
	// unionpayvalue = Number(unionpayvalue) - Number(value);
	// $("#cash").val(unionpayvalue);
	// _selfprivilege = value
	// if (Number($("#cash").val()) < 0)
	// jAlert("金额为负数了!", '提示', function(r) {
	// });
	// }
	// });
	$("#marketprivilege").keyup(function(event) {
				// value = $(this).val();
				// if (checkNum(this)) {
				// unionpayvalue = Number($("#cash").val()) +
				// Number(_marketprivilege);
				// unionpayvalue = Number(unionpayvalue) - Number(value);
				// $("#cash").val(unionpayvalue);
				// _marketprivilege = value
				// if (Number($("#cash").val()) < 0)
				// jAlert("金额为负数了!", '提示', function(r) {
				// });
				// }
			});
	$("#vipintegral").keyup(function(event) {
		var value = $(this).val();
		var kunnrjf = Number($("#kunnrjf").val());
		var currentInteval = Number($("#currentIntevalSpan").text());
		// alert(currentInteval);
		if (checkNum(this)) {
			unionpayvalue = Number($("#realprice").val())
					+ Number(_vipintegral);
			unionpayvalue = Number(unionpayvalue) - Number(value);
			$("#realprice").val(unionpayvalue);
			_vipintegral = value

			if (value != 0 && Number(value) > kunnrjf + currentInteval) {
				alert("积分不足");
				$(this).val(kunnrjf + currentInteval);
				value = $(this).val();
				var kunnrjf = Number($("#kunnrjf").val());
				if (checkNum(this)) {
					unionpayvalue = Number($("#realprice").val())
							+ Number(_vipintegral);
					unionpayvalue = Number(unionpayvalue) - Number(value);
					$("#realprice").val(unionpayvalue);
					_vipintegral = value
				}
			}
			if (Number($("#realprice").val()) < 0)
				alert("金额为负数了!");
		}
	});
/******************************************************/
// 在自发现金券这里按
	$('#selfticketprice').keyup(function(event) {
				value = $(this).val();
		if (checkNum(this)) {
			unionpayvalue = Number($("#realprice").val())
					+ Number(_selfticketprice);
			unionpayvalue = Number(unionpayvalue) - Number(value);
			$("#realprice").val(unionpayvalue);
			_selfticketprice = value

			if (Number($("#realprice").val()) < 0)
				alert("金额为负数了!");
		}
	});

	//zifa 
	$('#selfprivilege').keyup(function(event) {
		value = $(this).val();
		if (checkNum(this)) {
			unionpayvalue = Number($("#realprice").val())
					+ Number(_selfprivilege2);
			unionpayvalue = Number(unionpayvalue) - Number(value);
			$("#realprice").val(unionpayvalue);
			_selfprivilege2= value

			if (Number($("#realprice").val()) < 0)
				alert("金额为负数了!");
		}
	});
/********************************************************/
	$("#marketprivilege").keyup(function(event) {
		value = $(this).val();
		if (checkNum(this)) {
			unionpayvalue = Number($("#realprice").val())
					+ Number(_selfprivilege);
			unionpayvalue = Number(unionpayvalue) - Number(value);
			$("#realprice").val(unionpayvalue);
			_selfprivilege = value

			if (Number($("#realprice").val()) < 0)
				alert("金额为负数了!");
		}
	});
	$("#marketticketprice").keyup(function(event) {
		value = $(this).val();
		if (checkNum(this)) {
			unionpayvalue = Number($("#realprice").val())
					+ Number(_marketprivilege);
			unionpayvalue = Number(unionpayvalue) - Number(value);
			$("#realprice").val(unionpayvalue);
			_marketprivilege = value

			if (Number($("#realprice").val()) < 0)
				alert("金额为负数了!");
		}
	});

	$("#registertd").click(function() {

		// if ($("#kunnr").val() == "") {
		$("#charg").removeClass("inputkey").addClass("inputnom").attr(
				"readOnly", true).attr("disabled", true);

		if ($("#registertr").css("display") == "none") {

			$("#registertr").show();
			$("#vipid").removeClass("inputkey").addClass("inputnom");
			$("#regname").removeClass("inputnom").addClass("inputkey").focus();
			$("#registertd").val("取消");

			log("新增会员信息");

		} else {
			$("#registertr").css("display", "none");

			$("#regname").removeClass("inputkey").addClass("inputnom");
			$("#vipid").removeClass("inputnom").addClass("inputkey").focus();

			if ($("#vipid").val() == "") {
				$("#registertd").val("新会员");
				$("#regname").val("");
				$("#regtel").val("");
				$("#vipname").text("");
				$("#kunnrjf").val("");
				$("#tel").val("");

			} else {
				$("#registertd").val("修改");
			}
			log("");

		}

			// }
	});

	$("#regname").keydown(function(event) {
				if (event.keyCode == 13) {
					if ($("#regname").val() == "") {
						jAlert("请输入名字!", "提示", function(e) {
									$("#regname").focus();
								});
					} else {
						$("#regtel").focus();
					}
				}

			});

	$("#regtel").keydown(function(event) {
				if (event.keyCode == 13) {
					if ($("#regtel").val() == "") {
						alert("请输入名字!");
					} else {
						register();
					}
				}

			});

	$("#saveregmsg").bind("click", register);

	function register() {
		if ($("#regname").val() == "") {
			jAlert('请输入会员姓名！', '提示', function(r) {
						$("#registertr").show();
						$("#regname").focus();
					});
		} else if ($("#regtel").val() == '') {
			jAlert('请输入手机号码！', '提示', function(r) {
						$("#registertr").show();
						$("#regtel").focus();
					});
		} else if ($("#regtel").val().length != 11) {
			jAlert('您输入的手机号码有误，请重新输入！', '提示', function(r) {
						$("#registertr").show();
						$("#regtel").focus();
					});
		} else {
			$.ajax({
				url : "longhaul/pos/order/orderSystem.ered?reqCode=validateRegistPhone&postType=1&werks="
						+ WERKS + "&random=" + Math.random() + "",
				dataType : "json",
				type : 'post',
				data : {
					regPhone : $("#regtel").val()
				},
				success : function(data) {
					if (data != "" && data != null) {
						jAlert("手机号码已经存在，请检查！", "提示", function(e) {
									$("#regtel").focus();
								});
					} else {
						$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=registerUser&postType=1&werks="
									+ WERKS + "&random=" + Math.random() + "",
							dataType : "json",
							type : 'post',
							data : {
								regname : $("#regname").val(),
								cardType : $("#cardType").val(),
								regPhone : $("#regtel").val()
							},
							success : function(data) {
								if (data == "" || data == null) {
									jAlert('获取会员编号出现错误，请检查是否有可用的会员编号,请稍后重试!!',
											'提示', function(r) {
												$("#regtel").focus();
											});
								} else {
									$("#registertr").hide();
									$("#kunnr").val(data.kunnr);
									$("#vipid").val(data.sort2);
									// kunnrbyuser();
									getvipidbyuser();
									$("#vipname").text($("#regname").val());
									$("#tel").val($("#regtel").val());
								}
							}
						});
					}
				}
			});
		}
	}

	if (opmode == "EDIT") {
		$("#registertd").hide();
	}

	function checkChangeInfo() { // 检查换货输入信息
		var flag = false;
		var ingood = 0;
		var outgood = 0;
		var table = $("#tablecontent");
		var orderitems = $(table).find("div[id^='ordertItemype']");
		// alert(orderitems.length);
		for (var i = 0; i < orderitems.length; i++) {
			var text = $(orderitems[i]).text();
			if (text == "ZOUT")
				outgood++;
			else if (text == "ZIN")
				ingood++;
		}
		if (ingood == 0)
			alert("请输入换入商品！");
		else if (outgood == 0)
			alert("请输入换出商品！");
		if (outgood > 0 && ingood > 0)
			flag = true;
		return flag;
	}

	$("#discount12").change(function() {
		$("#salepromotionSpan").hide();
		if ($("#discount12").get(0).selectedIndex == 2) {
			$("#discount1").attr("readonly", false);
			$("#discount1").val('100');
			$("#discount1").select();
			calcPrice();
		} else if ($("#discount12").get(0).selectedIndex == 3) {
			$("#discount1").attr("readonly", true);
			$("#discount1").val('N/A');
			calcPrice();
		} else {
			$("#discount1").attr("readonly", true);
			$.ajax({
				url : "longhaul/pos/order/orderSystem.ered?reqCode=getDiscount&option=user&postType=1&charg="
						+ $("#charg").val()
						+ "&kunnr="
						+ $("#kunnr").val()
						+ "&matnr="
						+ $("#matnr").val()
						+ "&saledate="
						+ $("#ordertime").val(),
				dataType : 'json',
				success : function(data) {
					if ($("#discount12").get(0).selectedIndex == 0) {
						$("#discount1").val(data.discount1);
					} else if ($("#discount12").get(0).selectedIndex == 1) {
						$("#salepromotionSpan").show();
						if ($("#salepromotionSelect").find("option").length == 0) {
							jAlert("没有找到该商品的促销活动，请核对！", "提示", function(e) {
										//1111111
										$("#discount1").val('100');
									});
						} else {
							var discount = 100
									+ (Number($("#salepromotionSelect")
											.val()
											.substring($("#salepromotionSelect")
															.val().indexOf("|")
															+ 1)) / 10);
							$("#discount1").val(discount);
						}
					}
					// if ($("#discount12").get(0).selectedIndex == 1) {
					//								
					// // alert(discount);
					// }
					calcPrice();
				}
			});
		}
	});
	$("#discount34").change(function() {
		if ($("#discount34").get(0).selectedIndex == 1) {
			$("#discount2").attr("readonly", false);
			$("#discount2").val('100');
			$("#discount2").select();
			calcPrice();
		} else if ($("#discount34").get(0).selectedIndex == 2) {
			$("#discount2").attr("readonly", true);
			$("#discount2").val('N/A');
			calcPrice();
		} else {
			$.ajax({
				url : "longhaul/pos/order/orderSystem.ered?reqCode=getDiscount&option=user&postType=1&charg="
						+ $("#charg").val()
						+ "&kunnr="
						+ $("#kunnr").val()
						+ "&matnr=" + $("#matnr").val(),
				dataType : 'json',
				success : function(data) {
					$("#discount2").attr("readOnly", false);
					$("#discount2").val(data.discount3);
					calcPrice();
				}
			});
		}

	});

	$("#salepromotionSelect").change(function(e) {
		$("#salepromotion").val($(this).val().substring(0,
				$(this).val().indexOf("->")));
		var discount = 100
				+ Number($(this).val()
						.substring($(this).val().indexOf("|") + 1)) / 10;
		$("#discount1").val(discount);
		calcPrice();
	});

	function calcPrice() {

		if ($("#inputgoldbar").attr("checked") == "checked") {
			var count = Number($("#number").val());
			var goldweight = Number($("#goldweight").val());
			var realitygoldvalue = Number($("#realitygoldvalue").val());

			var total = count * goldweight * realitygoldvalue;

			$("#realprice").val(total.toFixed(2));

			$("#receivable").val(total.toFixed(2));
		} else if (((ordertype == "ZYS2" || ordertype == "ZJM2") && ($("#swaptype")
				.val() == "ZIN"
				// ||$("#swaptype").val()=="GZIN"
		))
				|| (ordertype == "ZYR1") || (ordertype == "ZJR1")) {
			// if((ordertype == "ZYS2"||ordertype ==
			// "ZJM2")&&($("#swaptype").val()=="ZIN"||$("#swaptype").val()=="GZIN"))
			// $("#logrt").focus();
			// else
			// $("#realprice").focus();
			var doubleorsingle = Number($("#doubleorsingle").val());
			var receivable = Number($("#receivable").val())*doubleorsingle;
			var goldweight = Number($("#goldweight").val());
			var personcost = Number($("#personcost").val());
			if ($("#personcost").attr("display") != "none")
				$("#realprice").val((receivable - goldweight * personcost)
						.toFixed(2));

		}else if(ordertype == 'ZJM3' || ordertype == 'ZYS3' ){
			var tagPrice = Number($("#ztjtj").val());
			$("#realprice").val((tagPrice*0.3).toFixed(2));
			$("#receivable").val((tagPrice*0.3).toFixed(2));
		} else {

			_selfprivilege = 0;
			_marketprivilege = 0;
			_vipintegral = 0;

			var discount1 = Number($("#discount1").val() == 'N/A' ? "100" : $("#discount1").val());
			var discount2 = Number($("#discount2").val() == 'N/A' ? "100" : $("#discount2").val());
			if ($("#swaptype").val() == 'GZIN'
					&& $("#outGoldTypeSpan").css("display") != 'none') {
				var discount1 = 100;
				var discount2 = 100;
			}

			var doubleorsingle = Number($("#doubleorsingle").val());

			// var discount3 = Number($("#discount3").val());
			// var discount4 = Number($("#discount4").val());
			$("#selfprivilege").val(0);
			$("#selfticketprice").val(0);
			$("#marketprivilege").val(0);
			$("#marketticketprice").val(0);
			$("#vipintegral").val(0);
			var goldValue = Number($("#goldvalue").val());
			var goldWeight = Number($("#goldweight").val());
			var depreciationPrice = Number($("#depreciationPrice").val());
			var total = 0;
			// alert($("#goldvalue").css("display"));
			if ($("#goldvalue").css("display") == "none") {
				total = ($("#ztjtj").val() * (discount1 / 100) * (discount2 / 100))
						.toFixed(2)
						* doubleorsingle;
				$("#realprice").val(total.toFixed(2));
				$("#receivable").val(total.toFixed(2));
			} else {
				total = ((goldValue * goldWeight * (discount1 / 100) * (discount2 / 100))
						+ (Number($("#personcost").val()) * goldWeight) - depreciationPrice
						* goldWeight)
						* doubleorsingle;
				$("#realprice").val(total.toFixed(2));
				$("#receivable").val(total.toFixed(2));
			}
		}
	}

	$("#allGift").click(function(e) {
//		if (needNECount > 0) {
//			jAlert("你有" + needNECount + "个含赠链吊坠需要输入赠链,请输入赠链信息后再提交！", "提示",
//					function(e) {
//						$("#allGift").attr("checked", false);
//						$("#charg").focus();
//					});
//			return;
//		} else if (needNECount < 0) {
//			jAlert("您删除了需要含赠链的吊坠信息，需要附带删除赠链的信息才能提交！", "提示", function(e) {
//						$("#allGift").attr("checked", false);
//						$("#charg").focus();
//					});
//			return;
//		}

		trlength = $("#tablecontent tr").length;
		if (trlength <= 2) {
			jAlert("请先录入商品信息！", "提示", function() {
						if ($("#vipid").val() == '') {
							$("#vipid").focus();
						} else {
							$("#charg").focus();
						}
						$("#allGift").attr("checked", false);
					});
			return;
		}
		if ($(this).attr("checked") == 'checked') {
			$("#inputPackage").attr("checked", null);
			$("input[type=radio][name=chargtype][value=gift]").attr("checked",
					"checked");
			$("#charglabel").html("整单礼品：");
			$("#charg").hide();
			$("#matnrSelect").show();
			$("#giftReferencePrice").val($("#totalrealprice").text())
			getGiftInfo();
		} else {
			$("input[type=radio][name=chargtype][value=charg]").attr("checked",
					"checked");
			$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次:");
			$("#charg").show();
			$("#matnrSelect").hide();
			$("#giftReferencePrice").val('');
		}

	});

	$("#inputPackage").click(function(e) {
//		if (needNECount > 0) {
//			jAlert("你有" + needNECount + "个含赠链吊坠需要输入赠链,请输入赠链信息后再提交！", "提示",
//					function(e) {
//						$("#inputPackage").attr("checked", false);
//						$("#charg").focus();
//					});
//			return;
//		} else if (needNECount < 0) {
//			jAlert("您删除了需要含赠链的吊坠信息，需要附带删除赠链的信息才能提交！", "提示", function(e) {
//						$("#inputPackage").attr("checked", false);
//						$("#charg").focus();
//					});
//			return;
//		}

		trlength = $("#tablecontent tr").length;
		if (trlength <= 2) {
			jAlert("请先录入商品信息！", "提示", function() {
						if ($("#vipid").val() == '') {
							$("#vipid").focus();
						} else {
							$("#charg").focus();
						}
						$("#inputPackage").attr("checked", false);
					});
			return;
		}
		if ($(this).attr("checked") == 'checked') {
			$("#allGift").attr("checked", null);
			$("input[type=radio][name=chargtype][value=gift]").attr("checked",
					"checked");
			$("#charglabel").html("包&nbsp;&nbsp;&nbsp;&nbsp;材：");
			$("#charg").hide();
			$("#matnrSelect").show();
			$("#giftReferencePrice").val($("#totalrealprice").text())
			getPackageInfo();
		} else {
			$("input[type=radio][name=chargtype][value=charg]").attr("checked",
					"checked");
			$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次:");
			$("#charg").show();
			$("#matnrSelect").hide();
			$("#giftReferencePrice").val('');
		}

	});

	function getGiftInfo() {
		_ordertype = $("#ordertype").val();
		_chargtype = $('input:radio[name="chargtype"]:checked').val();
		_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
		_charg = $("#charg").val().toUpperCase();

		var dialog = $.dialog({
					title : '正在获取整单礼品,请稍后...',
					max : false,
					min : false,
					close : false,
					lock : true
				});

		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getpcxx&postType=1&ordertype="
					+ _ordertype
					+ "&option=auto&werks="
					+ WERKS
					+ "&random="
					+ Math.random() + "",
			dataType : "json",
			data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype
					+ "&giftReferencePrice=" + $("#giftReferencePrice").val(),
			success : function(data) {
				dialog.close();
				if (data == "") {
					var chargalertstr = "没有找到整单礼品信息";
					chargalertstr = _chargtype == "gift"
							? "没有找到整单礼品信息!"
							: chargalertstr
					jAlert(chargalertstr, '提示', function(r) {
								clearcharginfo();
								$("#matnrSelect").hide();
								$("#charg").show();
								$("#allGift").attr("checked", null);
								$("#charglabel")
										.html("批&nbsp;&nbsp;&nbsp;&nbsp;次：");
							});
					response(null);
					return;
				}
				$("#matnrSelect").empty();
				$("#matnrSelect").append($("<option value=''>请选择...</option>"));
				$.map(data, function(item) {
							var matnr = item.cpbm == null ? "" : item.cpbm; // 物料号
							var plmc = item.plmc == null ? "" : item.plmc; // 物料号
							$("#matnrSelect").append($("<option value='"
									+ matnr + "'>" + plmc + '->' + matnr
									+ "</option>"));
						});
			}
		});

	}

	function getPackageInfo() {
		_ordertype = $("#ordertype").val();
		_chargtype = $('input:radio[name="chargtype"]:checked').val();
		_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
		_charg = $("#charg").val().toUpperCase();

		var dialog = $.dialog({
					title : '正在获取包材信息,请稍后...',
					max : false,
					min : false,
					close : false,
					lock : true
				});

		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getPackageInfo&postType=1&ordertype="
					+ _ordertype
					+ "&option=auto&werks="
					+ WERKS
					+ "&random="
					+ Math.random() + "",
			dataType : "json",
			data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype
					+ "&giftReferencePrice=" + $("#giftReferencePrice").val(),
			success : function(data) {
				dialog.close();
				if (data == "") {
					jAlert("没有找到包材信息!", '提示', function(r) {
								clearcharginfo();
							});
					response(null);
					return;
				}
				$("#matnrSelect").empty();
				$("#matnrSelect").append($("<option value=''>请选择...</option>"));
				$.map(data, function(item) {
							var matnr = item.matnr == null ? "" : item.matnr; // 物料号
							var plmc = item.maktx == null ? "" : item.maktx; // 物料号
							$("#matnrSelect").append($("<option value='"
									+ matnr + "'>" + plmc + '->' + matnr
									+ "</option>"));
						});
			}
		});

	}

	$("#matnrSelect").change(function(e) {
		$("#charg").val($(this).val());
		$("#matnrlabel").hide();
		$("#matnr").hide();
		if ($(this).get(0).selectedIndex != 0) {
			if (ordertype == 'ZJM3' || ordertype == 'ZYS3')
				getcustommadeInfo();
			else if (ordertype == 'ZJR2' || ordertype == 'ZYR2')
				getFrontMoneyInfo();
			else if (ordertype == 'ZJM6' || ordertype == 'ZYS6') {
				getIntegralMatnrInfo();
			} else if ($("#inputgoldbar").attr("checked") == "checked"
					|| ordertype == "ZYS4" || ordertype == 'ZJM4') {
			 var matnr = $(this).val();
			if(matnr.substring(0,3) == 'VSR'){
				if(giftflag == 1){
					jAlert("该会员已领取今年生日礼品","提示",function(){
					});
					return;
				}
			}else if(matnr.substring(0,3) == 'VJH'){
				if(giftflag == 2){
					jAlert("该会员已领取今年结婚纪念日礼品","提示",function(){
					});
					return;
				}
			}
				getmatnrbyuser();
			} else {
				getchargbyuser();
				$(this).val('');
				// $("#realprice").select();
			}
		}
	});

	
	
	$("#matnrSelect1").change(function(e) {
		
		if ($(this).get(0).selectedIndex != 0) {
			if (ordertype == 'ZJM3' || ordertype == 'ZYS3')
				getcustommadeInfo();
			else if (ordertype == 'ZJR2' || ordertype == 'ZYR2')
				getFrontMoneyInfo();
			else if (ordertype == 'ZJM6' || ordertype == 'ZYS6') {
				getIntegralMatnrInfo();
			} else if ($("#inputgoldbar").attr("checked") == "checked"
					|| ordertype == "ZYS4" || ordertype == 'ZJM4') {
			 var matnr = $(this).val();
			if(matnr.substring(0,3) == 'VSR'){
				if(giftflag == 1){
					jAlert("该会员已领取今年生日礼品","提示",function(){
					});
					return;
				}
			}else if(matnr.substring(0,3) == 'VJH'){
				if(giftflag == 2){
					jAlert("该会员已领取今年结婚纪念日礼品","提示",function(){
					});
					return;
				}
			}
				getmatnrbyuser();
			} else {
				getchargbyuser();
				$(this).val('');
				// $("#realprice").select();
			}
		}
	});
	
	
	
	function getLgort(lgort) {
		$("#logrt").empty();
		$("#logrt").append("<option value=''>请选择库位...</option>");
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getLgort&option=user&postType=1&werks="
					+ "1000" + "&random=" + Math.random() + "",
			dataType : "json",
			success : function(data) {
				$.map(data, function(item) {
							$("#logrt").append("<option value='"
											+ item.lgort
											+ "'"
											+ (item.lgort == lgort
													? "checked"
													: "") + ">" + item.lgort
											+ item.lgobe + "</option>");
						});
			}
		});
	}

	function submit() {
		if (opmode == "view" && useroption == "print") {
			_salesorderid = $("#salesorderid").val();
			window.showModalDialog(basepath
							+ "longhaul/pos/order/dm_dyxp.jsp?ywxh="
							+ _salesorderid + "&dwbh=" + WERKS, 'printWindow',
					'dialogWidth=650px;dialogHeight=700px');
			$('input').attr('disabled', true);
			$('select').attr('disabled', true);
			return;
		}
		// $("#showuploading").show();
		$(":button").slice(3, 5).attr("disabled", "disabled"); // 多个按钮时只设置某些按钮不可用
		var tableinfo = getordertableinfo();

		///** 判断订单中是否全部都是包材 Xiashou 20130621*/
		var lgortFlag = false;
		if (ordertype != 'ZYR2' && ordertype != 'ZYR3' && ordertype != 'ZYS3' && ordertype != 'ZYS8' && ordertype != 'ZYS6' && ordertype != 'ZYS4'){
			$("#tablecontent tr").each(function() { // 得到每一个tr
				earchobject = $(this);
				var trLgort = earchobject.find("div[id^='logrt']").text();
				trLgort = (trLgort == null || trLgort =='') ? '0012' : trLgort;
				if (trLgort != '0012'){
					lgortFlag = true;
				}
			});
			if(!lgortFlag){
				jAlert("必须录入商品！", "提示", function(e) {
					$("#showuploading").hide();
					$(this).dialog("close");
					$(":button").slice(3, 5).attr("disabled",false); // 多个按钮时只设置某些按钮不可用
				});
				return;
			}
		}
		///** 判断订单中是否全部都是包材 */
		
		if ($("#ordertype").val() == 'ZYS2' && $("#remark").val() == '') {
			if (outMoney < (-inMoney * 1.3)) {
				jAlert("换高未达到30%，请备注原因!", "提示", function(e) {
							// $(":button").slice(3, 5).attr("disabled", false);
							// // 多个按钮时只设置某些按钮不可用
							// $("#showuploading").hide();
							// $(this).dialog("close");
						});
				return;
			}else if(allInMoney == 0 ){
				jAlert("必须录入换出商品", "提示", function(e) {
						});
				return;
			}else if(allOutMoney == 0 ){
				jAlert("必须录入换入商品", "提示", function(e) {
						});
				return;
			}
		}
		$.ajaxSetup({
					error : function(x, e) {
						alert("访问服务器错误!" + x.responseText);
						$("#showuploading").hide();
						$(":button").slice(3, 5).attr("disabled", false); // 多个按钮时只设置某些按钮不可用
						return false;
					}
				});
				
				jConfirm("确定提交吗？", "提示", function(e) {
								if (e){
									//$("#userstatement").attr('disabled', true);	//点完确定就灰掉提交按钮，禁止重复
									var dialog = $.dialog({
												title : '提交中...',
												max : false,
												min : false,
												close : false,
												lock : true
											});
									$.ajax({
										url : "longhaul/pos/order/orderSystem.ered?reqCode=saveOrder&postType=1",
										cache : false,
										data : {
											orderitem : tableinfo.orderitem,
											orderhead : tableinfo.orderhead,
											useroption : useroption
										},
										type : 'post',
										dataType : 'json',
										success : function(retdata) {
											dialog.close();
											if (retdata.loginerror != null) {
												jAlert(retdata.loginerror, "提示", function(e) {
													parent.location.href = '/yspos/login.ered?reqCode=init';
												});
												return;
											}
							
											$("#currentIntevalSpan").text(0);
											$("#showuploading").hide();
											$("#orderprint").val("打印").attr('disabled', false);
											if (retdata.sapsalesorderid == null
													|| retdata.sapsalesorderid == "") { // 如果SAP订单号为空
												if (retdata.salesorderid != null
														|| retdata.salesorderid != "") { // 如果SAP没有保存成功,但是AIG保存成功
													$("#salesorderid").val(retdata.salesorderid);
													if (useroption == "print") {
														$("#salesorderid").val(retdata.salesorderid);
														$("#statementaccount").dialog("close");
														// printWindow=window.open("http://"+posurl+"/chj/dmgl/dyxp/resource/Lodop5.023/dm_dyxp.jsp?ywxh="+retdata.salesorderid+"&dwbh="+WERKS,'printWindow',
														// 'top=10,width=650,height=800,scrollbars=yes,
														// resizable=yes');
														window
																.showModalDialog(
																		basepath
																				+ "longhaul/pos/order/dm_dyxp.jsp?ywxh="
																				+ retdata.salesorderid
																				+ "&dwbh=" + WERKS,
																		'printWindow',
																		'dialogWidth=650px;dialogHeight=700px');
														$('input').attr('disabled', true);
														$('select').attr('disabled', true);
													} else {
														$("#salesorderid").val(retdata.salesorderid);
														var messagestr = "";
														// if (opmode == "ADD") {
														// messagestr = "操作<font
														// color=red>失败</font>临时凭证保存成功:" +
														// retdata.salesorderid + "<br>";
														// } else {
														// messagestr = "操作<font
														// color=red>失败</font>请重新修改订单记录:" +
														// retdata.salesorderid + "<br>";
														// }
														$("#salesorderid").val(retdata.salesorderid);
														if (retdata.error != null) {
															messagestr = messagestr + retdata.error;
														}
														if (retdata.message != null) {
															messagestr = messagestr + "" + retdata.message
																	+ "<br>";
														}
														if (retdata.empid != null) {
															messagestr = messagestr + "保存会员卡号："
																	+ retdata.empid;
														}
														if (retdata.empmessage != null) {
															messagestr = messagestr + ""
																	+ retdata.empmessage;
														}
														if (retdata.emperror != null) {
															messagestr = messagestr + "" + retdata.emperror;
														}
														jAlert(messagestr, '提示', function(r) {
																	doubleIntervalValidate = false;
																	$("#statementaccount").dialog("close");
																});
													}
												} else {
													_retinfo = "操作失败:" + retdata.message;
													jAlert(_retinfo, '提示', function(r) {
																$("#statementaccount").dialog("close");
															});
												}
											} else {
												if (useroption == "print") {
													$("#salesorderid").val(retdata.salesorderid);
													$("#statementaccount").dialog("close");
													// printWindow=window.open("http://"+posurl+"/chj/dmgl/dyxp/dm_dyxp.jsp?ywxh="+retdata.salesorderid+"&dwbh="+WERKS,'printWindow',
													// 'top=10,width=650,height=800,scrollbars=yes,
													// resizable=yes');
													window
															.showModalDialog(
																	basepath
																			+ "longhaul/pos/order/dm_dyxp.jsp?ywxh="
																			+ retdata.salesorderid
																			+ "&dwbh=" + WERKS,
																	'printWindow',
																	'dialogWidth=650px;dialogHeight=700px');
												} else {
													// "POS订单号:" + retdata.salesorderid +
													// "<br>" +
							
													var messagestr = "";
													// _retinfo = retdata.message + "<br><font
													// class='printinfo'>是否打印?</font>";
													if (retdata.message != null) {
														messagestr = messagestr + "" + retdata.message
																+ "<br>";
													}
													if (retdata.empid != null) {
														messagestr = messagestr + "保存会员卡号：" + retdata.empid
																+ "&nbsp;&nbsp;";
													}
													if (retdata.empmessage != null) {
														messagestr = messagestr + "" + retdata.empmessage;
													}
													if (retdata.emperror != null) {
														messagestr = messagestr + "" + retdata.emperror;
													}
													// jAlert(messagestr, '提示', function(r) {
													//							
													//							
													// window.location.reload();
													//							
													//							
													// // $("#statementaccount").dialog("close");
													// // cleartable();
													// // clearhead();
													// // $("#matnr").show();
													// //
													// $("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次:");
													// // $("#matnrlabel").show();
													// // $("#charg").attr("disabled", true);
													// // $("#charg").attr("readOnly", true);
													// //
													// $("#vipid").removeClass("inputnom").addClass("inputkey");
													// //
													// $("#charg").removeClass("inputkey").addClass("inputnom");
													// // $("#vipid").focus();
													// //
													// // $("#regname").val('');
													// // $("#regtel").val('');
													// // $("#registertd").val('新会员');
													// // $("#tel").val('');
													// // $("#thankIntegral").val('');
													//
													// })
							
													messagestr = messagestr
															+ "<br><font  class='printinfo'>是否打印?</font>";
													// jAlert(_retinfo, '提示', function(r) {
													jConfirm(messagestr, '提示', function(r) {
														if (r == true) {
															$("#salesorderid").val(retdata.salesorderid);
															$("#statementaccount").dialog("close");
															// cleartable();
															// clearhead();
															window
																	.showModalDialog(
																			basepath
																					+ "/longhaul/pos/order/dm_dyxp.jsp?ywxh="
																					+ retdata.salesorderid,
																			'Print',
																			'dialogWidth:920px,dialogHeight:735px,dialogTop:20px,dialogLeft,20px');
															window.location.reload(true);
														} else {
															$("#statementaccount").dialog("close");
															window.location.reload(true);
															$("#matnr").show();
															$("#charglabel")
																	.html("批&nbsp;&nbsp;&nbsp;&nbsp;次: ");
															$("#matnrlabel").show();
															$("#charg").attr("disabled", true);
															$("#charg").attr("readOnly", true);
															$("#kunnr").removeClass("inputnom")
																	.addClass("inputkey");
															$("#charg").removeClass("inputkey")
																	.addClass("inputnom");
															$("#kunnr").focus();
														}
													});
							
													// alert(_retinfo)
							
													// jConfirm(_retinfo, '提示', function(r) {
													// if (r == true) {
													// $("#salesorderid").val(retdata.salesorderid);
													// $("#statementaccount").dialog("close");
													// cleartable();
													// clearhead();
													// window.showModalDialog(basepath +
													// "longhaul/pos/order/dm_dyxp.jsp?ywxh=" +
													// retdata.salesorderid + "&dwbh=" + WERKS,
													// 'printWindow',
													// 'dialogWidth=650px;dialogHeight=700px');
													// } else {
													// $("#statementaccount").dialog("close");
													// cleartable();
													// clearhead();
													// $("#matnr").show();
													// $("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次:
													// ");
													// $("#matnrlabel").show();
													// $("#charg").attr("disabled", true);
													// $("#charg").attr("readOnly", true);
													// $("#kunnr").removeClass("inputnom").addClass("inputkey");
													// $("#charg").removeClass("inputkey").addClass("inputnom");
													// $("#kunnr").focus();
													// }
													// });
												}
							
											}
											$(":button").slice(3, 5).attr("disabled", false); // 多个按钮时只设置某些按钮不可用
										}
									});
																
																
									
								}
							});
				

	}

	function initialWindow(orderType) {
		if (orderType == 'ZJM3' || orderType == 'ZJR2' || orderType == 'ZYS3'
				|| orderType == 'ZYR2' || orderType == 'ZYS8'
				|| orderType == 'ZJM8' || orderType == 'ZYR3'
				|| orderType == 'ZJR3') {
			$("#groupSealSpan").hide();
			$("#orderreasonSpan").hide();
			$("#kunnrjfSpan").hide();
			$("#discount12Span").hide();
			$("#discount34Span").hide();
			$("#marketprivilegeSpan").hide();
			$("#selfticketpriceSpan").hide();
			$("#vipintegralSpan").hide();
			$("#selfprivilegeSpan").hide();
			$("#marketticketpriceSpan").hide();
			$("#charg").hide();
			$("#inputHeadGiftSpan").hide();
			$("#salepromotionSpan").hide();
			$("#referrerSpan").hide();
			$("#shoppingcardSpan").hide();
			$("#inputHeadGiftSpan").hide();
			$("#inputPackageSpan").hide();
			// $("#salemanSapn").hide();
			//$("#shopnumberSpan").hide();
			$("#registertd").hide();

			$("#choiceOrderInfoSpan").show();
			$("#inputBookGoodSpan").show();
			$("#thankIntegralSpan").hide();

			$("#matnrSelect").show();
			$("#ifGiveShopperSpan").show();

			$("#discount1Th").hide();
			$("#discount2Th").hide();
			$("#discount3Th").hide();
			$("#discount4Th").hide();
			$("#discount5Th").hide();
			$("#discount6Th").hide();
			// $("#labelPriceTh").hide();
			$("#lgortTh").hide();

			// $("#totalztjtjTd").hide();

			$("#marketprivilegeTh").hide();
			$("#selfticketpriceTh").hide();
			$("#vipintegralTh").hide();
			$("#selfprivilegeTh").hide();
			$("#marketticketpriceTh").hide();

			$("#charglabel").html("定制单号:");
			
			$("#statementtotalLabel").html("收取定金:");

			$("#statementtotal").attr("readOnly", false);

			if (orderType == 'ZJR2' || orderType == 'ZYR2') {
				$("#choiceOrderInfoSpan").hide();
				$("#inputBookGoodSpan").hide();
				$("#frontMoneySpan").show();
				$("#charglabel").html("定金单号:");
				$("#statementtotalLabel").html("退还定金:");
			}

		} else if (orderType == 'ZJM6' || orderType == 'ZYS6'
				|| orderType == 'ZJM4' || orderType == 'ZYS4') {
			$("#groupSealSpan").hide();
			$("#orderreasonSpan").hide();
			$("#discount12Span").hide();
			$("#discount34Span").hide();
			$("#marketprivilegeSpan").hide();
			$("#selfticketpriceSpan").hide();
			$("#vipintegralSpan").hide();
			$("#selfprivilegeSpan").hide();
			$("#marketticketpriceSpan").hide();
			$("#inputHeadGiftSpan").hide();
			$("#salepromotionSpan").hide();
			$("#shopnumberSpan").hide();
			$("#referrerSpan").hide();
			$("#shoppingcardSpan").hide();
			$("#cashSpan").hide();
			$("#unionpaySpan").hide();
			$("#inputHeadGiftSpan").hide();
			$("#thankIntegralSpan").hide();
			$("#inputPackageSpan").hide();

			$("#charg").hide();
			$("#registertd").hide();
			$("#discount1Th").hide();
			$("#discount2Th").hide();
			$("#discount3Th").hide();
			$("#discount4Th").hide();
			$("#discount5Th").hide();
			$("#discount6Th").hide();
			$("#labelPriceTh").text("需要积分");
			$("#realpriceTh").text("实际兑换积分");
			$("#lgortTh").hide();

			$("#totalztjtjTd").hide();

			$("#marketprivilegeTh").hide();
			$("#selfticketpriceTh").hide();
			$("#vipintegralTh").hide();
			$("#selfprivilegeTh").hide();
			$("#marketticketpriceTh").hide();

			$("#charglabel").html("赠品料号:");
			$("#statementtotalLabel").html("消耗积分:");

			$("#userstatement").val("提交");
			$("#orderprint").hide();

			$("#matnrSelect").show();

			$("#statementtotal").attr("readOnly", false);

			if (orderType == 'ZJM4' || orderType == 'ZYS4') {
				$("#statementtotalLabel").hide();
				$("#statementtotal").hide();
				$("#inputPackageSpan").hide();
				$("#mygift").hide();
				$("#lgortTh").show();
			}

		} else if (ordertype == 'ZYR1' || ordertype == 'ZJR1') {
			$("#inputHeadGiftSpan").hide();
		} else if (ordertype == "ZOR6") {
			$("#discount1Th").hide();
			$("#discount2Th").hide();
			$("#discount3Th").hide();
			$("#discount4Th").hide();
			$("#discount5Th").hide();
			$("#discount5Th").hide();
			$("#discount6Th").hide();
			$("#marketprivilegeTh").hide();
			$("#selfprivilegeTh").hide();
			$("#marketticketpriceTh").hide();
			$("#selfticketpriceTh").hide();
			$("#vipintegralTh").hide();
			$("#orderreasonSpan").hide();
			$("#salemanSapn").hide();
			$("#vipidSpan").hide();
			$("#receivableSpan").hide();
			$("#vipnameSpan").hide();
			$("#memberInfoSpan").hide();
			$("#groupSealSpan").hide();
			$("#inputHeadGiftSpan").hide();
			$("#shopnumberSpan").hide();
			$("#cashSpan").hide();
			$("#shoppingcardSpan").hide();
			$("#unionpaySpan").hide();
			$("#unionpaySpan").hide();
			$("#discount12Span").hide();
			$("#discount34Span").hide();
			$("#selfprivilegeSpan").hide();
			$("#selfticketpriceSpan").hide();
			$("#vipintegralSpan").hide();
			$("#marketprivilegeSpan").hide();
			$("#marketprivilegeSpan").hide();
			$("#marketticketpriceSpan").hide();

			$("#userstatement").val("提交")
			$("#charglabel").text("物料号：")
			$("#charg").hide();
			$("#matnrInput").show();
			$("#numberSpan").show();
		}

		if (orderType == 'ZJM4' || orderType == 'ZYS4') {
			$("#labelPriceTh").hide();
			$("#realpriceTh").hide();
			$("#totalrealprice").hide();
			$("#birthdayspan").show();
			$("#marrydayspan").show();
			
			
		}

		$("#inputGoldBarSpan").hide();
		if (ordertype == 'ZYS1' || ordertype == 'ZJM1') {
			$("#inputGoldBarSpan").show();
		}

		if (ordertype == "ZYS2" || ordertype == "ZJM2" || ordertype == "ZYR1"
				|| ordertype == "ZJR1") {
			$("#saleorderidspan").show();

			if (ordertype == "ZYR1" || ordertype == "ZJR1") {
				$("#discount12Span").hide();
				$("#discount34Span").hide();
			}
			if (ordertype == "ZYS2" || ordertype == "ZJM2") {
				getOldGoldType();
			}

		}

		if (ordertype == "ZYS7" || ordertype == "ZJM7") {
			$("#selfprivilege").attr("readOnly", true);
			$("#selfticketprice").attr("readOnly", true);
			$("#vipintegral").attr("readOnly", true);
			$("#marketprivilege").attr("readOnly", true);
			$("#marketticketprice").attr("readOnly", true);

			//$("#giftMethod").attr("disabled", true);
			$("#discount34").attr("disabled", true);
			$("#discount2").attr("readOnly", true);
			$("#inputWJGFSpan").show();
			
			
			$("#shopnumber").attr('readOnly',true);
			$("#shopnumber").val('10000000000');
			
		}

		if (ordertype == "ZJM2" || ordertype == "ZYS2" || ordertype == "ZJR1"
				|| ordertype == "ZYR1") {
			$("#rejPackageAndGiftSpan").show();
		}
		
		if(ordertype == "ZYS3" || ordertype == "ZYR2"){//ZWH 20141117 
			$("#matnrSelect").hide();
			$("#matnrSelect1").show();
			
		}
		

	}

	function getcustommadeInfo() { // 获取选款下单抬头
		/*var choiceorderid = $("#matnrSelect").val();
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getCustommadeInfo&postType=1",
			cache : false,
			data : {
				choiceorderid : choiceorderid
			},
			type : 'post',
			dataType : 'json',
			success : function(retdata) {
				$.map(retdata, function(item) {
							var totalMoney = 0;
							if (item.totalmoney.indexOf("-") != -1) {
								var moneys = item.totalmoney.split("-")
								totalMoney = totalMoney + Number(moneys[0])
										+ Number(moneys[1]);
								totalMoney = totalMoney / 2;
							} else {
								totalMoney = item.totalmoney;
							}

							$("#choiceOrderTotalMoney").val(totalMoney);
							$("#statementtotal").val((Number(totalMoney) * 0.3)
									.toFixed(0));
							$("#cash").val((Number(totalMoney) * 0.3)
									.toFixed(0));
						});

				getcustommadeItem();
			}
		});*/
		getcustommadeItem();
		
	}

	function getcustommadeItem() {
		//var choiceorderid = $("#matnrSelect").val();
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getCustommadeItem&postType=1",
			cache : false,
			data : {
				choiceorderid : '01KF20140712J3001'
			},
			type : 'post',
			dataType : 'json',
			success : function(retdata) {
				creatChoiceOrderRow(retdata);
			}
		});

	}

	function creatChoiceOrderRow(data) {
		cleartable(); // 先清除table内容
		toplevelnumber = 1;
		upgiftnumber = 1;
		$.each(data, function(key, val) {
			var style = "";
			_chargtype = "charg";
			_ordertype = $("#ordertype").val(); // 订单类型字段
			style = "tdtoplevel";
			ordertItemype = "<div id=ordertItemype" + key
					+ " style='display:none'>ZL2N</div>";
			storagelocation = val.storagelocation == null
					? ""
					: val.storagelocation;
			_logrt = "<div id=logrt" + key + ">" + storagelocation + "</div>";
			delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
			row = "<div id=" + key + ">" + "" + "</div>";
			lowerlevel = val.lowerlevelsnumber == null
					? ""
					: val.lowerlevelsnumber;
			if (val.lowerlevelsnumber != null) { // 最大号
				toplevelnumber = Number(val.salesorderitem) / 10 + 1;
			}
			toplevelstr = "<div id=leveladdgifts" + val.salesorderitem
					+ "  style='display:none'>" + lowerlevel + "</div>";
			posnrnumber = "<div  id=posnrnumber" + key + "> "
					+ val.choiceorderitem + " </div>" + "<div id=upnumber"
					+ _chargtype + key + "  style='display:none'>"
					+ val.choiceorderitem + "</div>" + toplevelstr + "";
			upumber = "<div id=upnumberlevel" + key + ">"
					+ val.upchoiceorderitem + "</div>";
			batchnumber = val.batchnumber == null ? "" : val.batchnumber;
			_charg = "<div id=charg" + key + ">" + batchnumber + "&nbsp;</div>"; // 批次
			var materialnumber = val.materialnumber == null
					|| val.materialnumber == "null" ? "" : val.materialnumber;
			_matnr = "<div id=matnr" + key + ">" + materialnumber
					+ "&nbsp; </div>"; // 物料
			var goodname = val.materialdesc == null
					|| val.materialdesc == "null" ? "" : val.materialdesc;
			_zhlhx = "<div id=zhlhx" + key + " class='divmatnrdesc'>"
					+ goodname + "</div>"; // 商品ID
			_number = "<div id=number" + key + ">" + val.quantity + "</div>"; // 数量
			_goldweight = "<div id=goldweight" + key + ">"
					+ Number(val.goldweight).toFixed(3) + "</div>"; // 金种
			_goldvalue = "<div id=goldvalue" + key + " style='display:none'>"
					+ val.goldprice + "</div>"; // 金种
			_realTagPrice = "<div id=realTagPrice" + key + " >"
					+ Number(val.tagprice).toFixed(0) + "</div>"; // 实际标签价格

			var totalMoney = 0;
			if (val.retailprice.indexOf("-") != -1) {
				var moneys = val.retailprice.split("-")
				totalMoney = totalMoney + Number(moneys[0]) + Number(moneys[1]);
				totalMoney = totalMoney / 2;
			} else {
				totalMoney = val.retailprice;
			}

			_realprice = "<div id=realprice" + key + ">"
					+ Number(Number(totalMoney) * 0.3).toFixed(0) + "</div>"; // 实销价格

			var ztjtj = "<div id=ztjtj" + key + ">" + totalMoney + "</div>"; // 标签价格

			var discount = val.storediscount == null
					|| val.storediscount == "null" ? "" : val.storediscount;
			_discount = "<div id=discount" + key + ">" + discount + "</div>"; // 折扣
			_productpictureurl = val.productpictureurl == null
					|| val.productpictureurl == "" ? (compImage = "CHJ"
					? "CHJ-LOGO.JPG"
					: "vt.jpg") : val.productpictureurl;
			var imgpath = chargimgpath + _productpictureurl;
			imaghref = "<a href=" + imgpath + " class='tooltip'>";
			_pcimage = "<div id=pcimage"
					+ key
					+ ">"
					+ imaghref
					+ "<img id=pcimagesrc   src=sappic/"
					+ imgpath
					+ " height='40' width='38' alt='"
					+ _productpictureurl
					+ "' onerror='this.src=\"longhaul\/pos\/order\/images\/zjzb.gif\"'/></a></div>";

			$("#pcimage").attr("src", imgpath);
			$("#pcimage").attr("alt", val.productpictureurl);

			setTotalObjectByName('totalnumber', val.quantity, 0);
			setTotalObjectByName('totalrealprice', totalMoney * 0.3, 2);

			$("#totalztjtj")
					.text((Number($("#totalztjtj").text()) + Number(totalMoney))
							.toFixed(0)); // 

			var row = "<tr><td class=" + style + ">" + row + "</td>";
			if (opmode == "view") {
				row = "<tr><td class=" + style + "></td>";
			}
			row = row + "<td class=" + style + ">" + posnrnumber + "</td>";
			row = row + "<td class=" + style + " style='display:none'>"
					+ upumber + "</td>";
			row = row + "<td class=" + style + ">" + _charg + "</td>";
			row = row + "<td class=" + style + ">" + _matnr + "</td>";
			row = row + "<td class=" + style + ">" + _zhlhx + "</td>";
			row = row + "<td class=" + style + " align='center'>" + _pcimage
					+ "</td>";
			row = row + "<td class=" + style + " align='right'>" + _number
					+ "</td>";
			row = row + "<td class=" + style + " align='right'>" + ztjtj
					+ "</td>";
			row = row + "<td class=" + style + " align='right' id='zys3jg'>" + _realprice
					+ "</td>";
			ordertItemypeshow = ordertItemypeshowText('ZL2N');
			row = row + "<td class=" + style + ">" + ordertItemype + ""
					+ ordertItemypeshow + "</td>";
			row = row + "</tr>";
			$(row).insertAfter($("#tablecontent tr:eq(" + key + ")"));
		});
	}

	function getFrontMoneyInfo() {// 获取收货定金单号抬头
		//var orderid = $("#matnrSelect").val();
		var orderid = $("#matnrSelect1").val();
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getFrontMoneyInfo&postType=1",
			cache : false,
			data : {
				orderid : orderid
			},
			type : 'post',
			dataType : 'json',
			success : function(retdata) {
				$.map(retdata, function(item) {
					$("#statementtotal").val("-" + item.amountcollected);
					$("#cash").val("-" + item.amountcollected);
					$("#frontMoney").val(item.amountcollected);

					if (item.ordertype == "ZYS8") {
						$("#ifGiveShopper").attr("checked", true);
						$("#shopnumberSpan").show();
						$("#shopnumber").val(item.storereceipt);
						$("#ifGiveShopper").attr("disabled", true);
						$("#shopnumber").attr("readOnly", true);
					} else {
						$("#ifGiveShopper").attr("checked", false);
						$("#shopnumberSpan").hide();
						$("#shopnumber").val('');
						$("#ifGiveShopper").attr("disabled", false);
						$("#shopnumber").attr("readOnly", false);
					}
						// alert(item.ordertype);
						// alert(item.storereceipt);
					});

				getFrontMoneyItem();
			}
		});
		
		getFrontMoneyItem();
	}

	function getFrontMoneyItem() {
		var orderid = $("#matnrSelect1").val();
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getFrontMoneyItem&postType=1",
			cache : false,
			data : {
				orderid : orderid
			},
			type : 'post',
			dataType : 'json',
			success : function(retdata) {
				creatFrontMoneyItemRow(retdata);
			}
		});

	}

	function getIntegralMatnrInfo() {
		var matnr = $("#matnrSelect").val().substring(0,
				$("#matnrSelect").val().indexOf("-"));
		var integral = $("#matnrSelect").val().substring($("#matnrSelect")
				.val().indexOf("-")
				+ 1);
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getIntegralMatnrItem&postType=1",
			cache : false,
			data : {
				matnr : matnr
			},
			type : 'post',
			dataType : 'json',
			success : function(retdata) {
				var charginfo = retdata[0];

//				if (charginfo.labst <= 0) {
//					jAlert("库存不足!", "提示", function(e) {
//							});
//					return;
//				}

				// alert(retdata[0].matnr);
				// alert(retdata[0].maktx);
				// alert(retdata[0].zmatnrt);

				$("#matnr").val(charginfo.matnr);
				$("#zhlhx").val(charginfo.maktx);
				$("#receivable").val(integral);
				$("#realprice").val(integral); // 实收
				$("#ztjtj").val(integral);

				// getLgort(charginfo.lgort);
				$("#logrt").val(charginfo.lgort);
				$("#logrtinput").val(charginfo.lgort);

				_pcimage = charginfo.zmatnrt;
				_pcimage = _pcimage == null || _pcimage == ""
						? "zjzb.gif"
						: _pcimage;
				$(".tooltip").attr("href", "sappic/" + _pcimage);
				$(".tooltip").attr("title", charginfo.zhlhx);
				$("#pcimage").attr("src", "sappic/" + _pcimage);
				$("#pcimage").attr("alt", _pcimage);
				$("#pcimage").load(function() {
						}).error(function() {
					$("#pcimage").attr("src",
							"longhaul/pos/order/images/zjzb.gif");
					$("#pcimage").attr("alt", 'zjzb.gif');
					$(".tooltip").attr("href",
							"longhaul/pos/order/images/zjzb.gif");
					$(".tooltip").attr("title", "zjzb.gif");
				});

				$("#receivableLabel").text("需要积分：");

				$("#number").val("1");
				$("#showmatnrinfo").show();
				$("#showoptinfo").show();
				$("#realpriceLabel").text("实收积分");
				// $("#realprice").focus();

				btnAddRow();
			}
		});

	}

	function creatFrontMoneyItemRow(data) {
		cleartable(); // 先清除table内容
		toplevelnumber = 1;
		upgiftnumber = 1;
		$.each(data, function(key, val) {
			var style = "";
			_chargtype = "charg";
			_ordertype = $("#ordertype").val(); // 订单类型字段
			style = "tdtoplevel";
			ordertItemype = "<div id=ordertItemype" + key
					+ " style='display:none'>ZG2N</div>";
			storagelocation = val.storagelocation == null
					? ""
					: val.storagelocation;
			_logrt = "<div id=logrt" + key + ">" + storagelocation + "</div>";
			delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
			row = "<div id=" + key + ">" + "" + "</div>";
			lowerlevel = val.lowerlevelsnumber == null
					? ""
					: val.lowerlevelsnumber;
			if (val.lowerlevelsnumber != null) { // 最大号
				toplevelnumber = Number(val.salesorderitem) / 10 + 1;
			}
			toplevelstr = "<div id=leveladdgifts" + val.salesorderitem
					+ "  style='display:none'>" + lowerlevel + "</div>";
			posnrnumber = "<div  id=posnrnumber" + key + "> "
					+ val.salesorderitem + " </div>" + "<div id=upnumber"
					+ _chargtype + key + "  style='display:none'>"
					+ val.salesorderitem + "</div>" + toplevelstr + "";
			upumber = "<div id=upnumberlevel" + key + ">"
					+ val.upsalesorderitem + "</div>";
			batchnumber = val.batchnumber == null ? "" : val.batchnumber;
			_charg = "<div id=charg" + key + ">" + batchnumber + "&nbsp;</div>"; // 批次
			var materialnumber = val.materialnumber == null
					|| val.materialnumber == "null" ? "" : val.materialnumber;
			_matnr = "<div id=matnr" + key + ">" + materialnumber
					+ "&nbsp; </div>"; // 物料
			var goodname = val.materialdesc == null
					|| val.materialdesc == "null" ? "" : val.materialdesc;
			_zhlhx = "<div id=zhlhx" + key + " class='divmatnrdesc'>"
					+ goodname + "</div>"; // 商品ID
			_number = "<div id=number" + key + ">-" + val.salesquantity
					+ "</div>"; // 数量
			_goldweight = "<div id=goldweight" + key + ">-"
					+ Number(val.goldweight).toFixed(3) + "</div>"; // 金种
			_mGoldWeight = "<div id=mGoldWeight" + key + ">-"
					+ Number(val.mGoldWeight).toFixed(3) + "</div>"; // 毛重
			_goldvalue = "<div id=goldvalue" + key + " style='display:none'>-"
					+ val.goldprice + "</div>"; // 金种
			_realTagPrice = "<div id=realTagPrice" + key + " >-"
					+ Number(val.tagprice).toFixed(0) + "</div>"; // 实际标签价格
			_realprice = "<div id=realprice" + key
					+ " style='display : none;'>"
					+ Number(val.netprice).toFixed(0) + "</div><div>-"
					+ Number(val.netprice).toFixed(0) + "</div>"; // 实销价格
			var discount = val.storediscount == null
					|| val.storediscount == "null" ? "" : val.storediscount;
			_discount = "<div id=discount" + key + ">" + discount + "</div>"; // 折扣
			_productpictureurl = val.productpictureurl == null
					|| val.productpictureurl == "" ? (compImage = "CHJ"
					? "CHJ-LOGO.JPG"
					: "vt.jpg") : val.productpictureurl;
			var imgpath = chargimgpath + _productpictureurl;
			imaghref = "<a href=" + imgpath + " class='tooltip'>";
			_pcimage = "<div id=pcimage"
					+ key
					+ ">"
					+ imaghref
					+ "<img id=pcimagesrc   src=sappic/"
					+ imgpath
					+ " height='40' width='38' alt='"
					+ _productpictureurl
					+ "' onerror='this.src=\"longhaul\/pos\/order\/images\/zjzb.gif\"'/></a></div>";

			$("#pcimage").attr("src", imgpath);
			$("#pcimage").attr("alt", val.productpictureurl);

			setTotalObjectByName('totalnumber', "-" + val.salesquantity, 0);
			setTotalObjectByName('totalrealprice', "-" + val.netprice, 2);
			setTotalObjectByName('totalztjtj', "-" + val.tagprice, 2);

			var row = "<tr><td class=" + style + ">" + row + "</td>";
			if (opmode == "view") {
				row = "<tr><td class=" + style + "></td>";
			}
			row = row + "<td class=" + style + ">" + posnrnumber + "</td>";
			row = row + "<td class=" + style + " style='display:none'>"
					+ upumber + "</td>";
			row = row + "<td class=" + style + ">" + _charg + "</td>";
			row = row + "<td class=" + style + ">" + _matnr + "</td>";
			row = row + "<td class=" + style + ">" + _zhlhx + "</td>";
			row = row + "<td class=" + style + " align='center'>" + _pcimage
					+ "</td>";
			row = row + "<td class=" + style + " align='right'>" + _number
					+ "</td>";
			row = row + "<td class=" + style
					+ " align='right'>" + _realTagPrice + "</td>";
			row = row + "<td class=" + style + " align='right'>" + _realprice
					+ "</td>";
			ordertItemypeshow = ordertItemypeshowText('ZG2N');
			row = row + "<td class=" + style + ">" + ordertItemype + ""
					+ ordertItemypeshow + "</td>";
			row = row + "</tr>";
			$(row).insertAfter($("#tablecontent tr:eq(" + key + ")"));
		});
	}

	function getThankIntegral() {
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getThankIntegral&postType=1",
			type : 'post',
			dataType : 'json',
			success : function(retdata) {
				if (retdata != null) {
					$("#thankIntegral").val(retdata);
				}
			}
		});
	}

	// if (opmode != "view")
	// getSalepromotion();
	function getSalepromotion() {
		$("#salepromotionSelect").empty();
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getSalepromotion&postType=1",
			type : 'post',
			data : "charg=" + $("#charg").val() + "&matnr=" + $("#matnr").val()
					+ "&orderdate=" + $("#ordertime").val(),
			dataType : 'json',
			success : function(retdata) {
				// alert(retdata.length);
				if (retdata.length == 0) {// retdata.length==0){
					$("#salepromotionSelect").hide();
					//$("#salepromotion").show();
				} else {
					$("#salepromotionSelect").show();
					$("#salepromotion").hide();
					if(((ordertype == 'ZYS2' && $("#swaptype").val() == 'ZIN') || ordertype == 'ZYR1')){
						$("#salepromotionSelect").append("<option value=''>无活动</option>");
					}
					$.map(retdata, function(item) {
								if(((ordertype == 'ZYS2' && $("#swaptype").val() == 'ZIN') || ordertype == 'ZYR1')){
									$("#salepromotion").val("");
								} else {
									if ($("#salepromotion").val() == "") {
										$("#salepromotion").val(item.aktnr);
									}
								}
								$("#salepromotionSelect")
										.append("<option value='" + item.aktnr
														+ '->' + item.aktkt
														+ '|' + item.kbetr
														+ "' kbetr='"
														+ item.kbetr + "'>"
														+ item.aktnr + '->'
														+ item.aktkt
														+ "</option>");
							});
				}
			}
		});
	}

	function orderTypeCheck() { // 判断订单类型
		if (ordertype == 'ZJM3' || ordertype == 'ZJR2' || ordertype == 'ZYS3'
				|| ordertype == 'ZYR2' || ordertype == 'ZYR3'
				|| ordertype == 'ZYS8' || ordertype == 'ZJM8'
				|| ordertype == 'ZJR3' || ordertype == 'ZOR6'
				|| ordertype == 'ZYS6' || ordertype == 'ZJM6'
				|| ordertype == 'ZYS4' || ordertype == 'ZJM4')
			return false;
		else
			return true;
	}

	$("#statementtotal").keyup(function(e) {
				$("#cash").val($(this).val());
				
				$("#shoppingcard").val(0);
				$("#unionpay").val(0);
			});

	$("#logrt").change(function(e) {
				$("#logrtinput").val($(this).val());
			});

	$("#discount12").keydown(function(e) {
				if (e.keyCode == 13) {
					$("#discount34").focus();
					calcPrice();
				}
			});
	$("#discount34").keydown(function(e) {
				if (e.keyCode == 13) {
					$("#selfprivilege").select();
				}
			});

	$("#swaptype").change(function(e) {
				$("#depreciationPrice").val(0);
				var value = $(this).val();
				
				$("#outGoldTypeSpan").hide();
				$("#depreciationPriceSpan").hide();
				$("#salepromotionSpan").hide();

				$("#saleorderidspan").show();
				$("#giftMethodSpan").show();
				$("#vipintegralSpan").show();
				$("#selfticketpriceSpan").show();
				$("#selfprivilegeSpan").show();
				$("#marketprivilegeSpan").show();
				$("#marketticketpriceSpan").show();
				$("#discount12Span").show();
				$("#discount34Span").show();
				$("#goldvaluelabel").hide();
				$("#goldvalue").hide();
				$("#goldweightSpan").hide();
				$("#mgoldweightSpan").hide();
				// $("#goldweight").hide();
				// $("#tdtotalgoldweight").hide();
				// $("#thgoldweight").hide();
				$("#charg").attr("readOnly", false);

				if (value == 'ZIN' || value == 'GZIN') {
					getLgort();
					$("#logartlabe").show();
					$("#logrt").show();
					$("#saleorderidspan").show();
					if (value == 'GZIN') {
						$("#charg").attr("readOnly", true);
						$("#outGoldTypeSpan").show();
						$("#depreciationPriceSpan").show();
						$("#thgoldweight").show();
						$("#tdtotalgoldweight").show();
						$("#saleorderidspan").hide();
						$("#giftMethodSpan").hide();
						$("#vipintegralSpan").hide();
						$("#selfticketpriceSpan").hide();
						$("#selfprivilegeSpan").hide();
						$("#marketprivilegeSpan").hide();
						$("#marketticketpriceSpan").hide();
						//$("#discount12Span").hide();
						$("#discount12Span").show();
						
						
						$("#discount34Span").hide();
						$("#goldvaluelabel").show();
						$("#goldvalue").show();
						$("#goldweightSpan").show();
						$("#mgoldweightSpan").show();
						$("#goldweight").show();
						$("#mGoldweight").show();
						
						
						$("#outGoldType").val('');
						$("#charg").val('');
						$("#charg_ospan").hide();
						$("#charg_o").val('');
						
						
						// getOldGoldType();
					}

				} else {
					$("#logartlabe").hide();
					$("#logrt").hide();
					$("#saleorderidspan").hide();
					$("#logrtinput").val($("#swaptype").data("oldLgort"));
				}

				if (value == 'GZIN') {
					$("#goldweight").attr("readOnly", false);
					$("#mGoldweight").attr("readOnly", false);
				} else {
					$("#goldweight").attr("readOnly", true);
					$("#mGoldweight").attr("readOnly", true);
				}

			});

	$("#goldweight").keyup(function(e) {
				if (checkNum(this)) {
					calcPrice();
				}
			});

	$("#goldweight").keydown(function(e) {
				if (e.keyCode == 13) {
					if ($("#swaptype").val() == 'GZIN') {
						$("#depreciationPrice").select();
					} else {
						$("#realprice").select();
					}
				}
			});

	$("#personcost").keyup(function(e) {
				if (checkNum(this)) {
					calcPrice();
				}
			});

	$($("#depreciationPrice")).keyup(function(e) {
				if (checkNum(this)) {
					calcPrice();
				}
			});
	$($("#depreciationPrice")).keydown(function(e) {
				if (e.keyCode == 13) {
					$("#realprice").select();
				}
			});

	$("#matnrInput").keydown(function(event) {
				if (event.keyCode == 13) {
					if ($.trim($("#matnrInput").val()) != "") {
						$("#matnrInput").autocomplete("close");
						getmatnrbyuser();
					}
				}
			}).keypress(function(event) {

			}).autocomplete({
		source : function(request, response) {
			_ordertype = $("#ordertype").val();
			_chargtype = $('input:radio[name="chargtype"]:checked').val();
			_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
			_matnr = $("#matnrInput").val().toUpperCase();
			$.ajax({
				url : "longhaul/pos/order/orderSystem.ered?reqCode=getMatnrInfo&postType=1&ordertype="
						+ _ordertype
						+ "&option=auto&werks="
						+ WERKS
						+ "&random=" + Math.random() + "",
				dataType : "json",
				data : "matnr=" + $.trim(_matnr),
				success : function(data) {
					if (data == "") {
						var chargalertstr = "输入物料号不存在!";
						jAlert(chargalertstr, '提示', function(r) {
									clearcharginfo();
								});
						response(null);
						return;
					}
					response($.map(data, function(item) {
								var matnr = item.matnr == null
										? ""
										: item.matnr; // 物料号
								var maktx = item.maktx == null
										? ""
										: item.maktx; // 产品名称
								return {
									label : matnr + "->" + maktx
								};
							}));
				}
			});
		},
		delay : autocompletedelay,
		minLength : autocompletelength,
		maxLength : 15,
		open : function(event, ui) {
		},
		select : function(event, ui) {
		},
		close : function(event, ui) {

		},
		destroy : function(event, ui) {

		},
		focus : function(event, ui) {

		},
		change : function(event, ui) {

		},
		search : function(event, ui) {
		},
		create : function(event, ui) {
		}
	});

	function getmatnrbyuser() {
		$("#number").focus();
		tempchargNo = $("#matnrInput").val();
		_mycharg = tempchargNo.substring(0, tempchargNo.indexOf("->"));
		_ordertype = $("#ordertype").val();
		_chargtype = $('input:radio[name="chargtype"]:checked').val();
		_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
		_matnr = tempchargNo.indexOf("->") > 0 ? _mycharg : tempchargNo;
		_matnr = _matnr.toUpperCase();
		$("#matnrInput").val(_matnr);

		if ($("#outGoldTypeSpan").css("display") != 'none'
				&& $("#swaptype").val() == 'GZIN') {
			_matnr = $("#outGoldType").val();
			// alert(_matnr);
		} else if ($("#inputgoldbar").attr("checked") == "checked") {
			_matnr = $("#matnrSelect").val();
			var realCount = _matnr.substring(_matnr.indexOf("->") + 2);
			$("#realnumber").val(realCount);
			_matnr = _matnr.substring(0, _matnr.indexOf("->"));

			var table = $("#tablecontent");

			var matnrDivs = table.find("div[id^='matnr']");

			for (var i = 0; i < matnrDivs.length; i++) {
				if ($.trim($(matnrDivs[i]).text()) == $.trim(_matnr)) {
					jAlert("订单中存在该物料信息，请不要重复录入！", "提示", function(e) {
								$("#matnrSelect").val('');
							});
					$("#charg").select();
					return;
				}
			}
		} else if (ordertype == 'ZYS4' || ordertype == 'ZJM4') {
			_matnr = $("#matnrSelect").val();
			var realCount = _matnr.substring(_matnr.indexOf("-") + 1);
			$("#realnumber").val(realCount);
			_matnr = _matnr.substring(0, _matnr.indexOf("-"));
		}

		var method = "getMatnrInfobyuser";
		// if(((ordertype == "ZJM2"|| ordertype == "ZYS2") &&
		// $("#swaptype").val() == "ZIN") || ordertype == "ZYR1" || ordertype ==
		// "ZJR1")
		// method = "getReturnPcxx";

		$.ajaxSetup({
					error : function(x, e) {
						jAlert(	"访问服务器错误信!<font color='red'>" + x.responseText
										+ "</font>", "提示", function(e) {
								});
						return false;
					}
				});
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=" + method
					+ "&option=user&ordertype=" + _ordertype
					+ "&postType=1&werks=" + WERKS + "&random=" + Math.random()
					+ "",
			dataType : "json",
			data : "matnr=" + $.trim(_matnr) + "&chargtype=" + _chargtype,
			success : function(data) {
				if (data == "") {
					var chargalertstr = "输入批次不存在!";
					chargalertstr = _chargtype == "gift"
							? "输入物料编码不存在!"
							: chargalertstr
					jAlert(chargalertstr, '提示', function(r) {
								clearcharginfo();
								$("#matnrInput").select();
							});
				}
				$.map(data, function(item) {
					var matnr = item.matnr == null ? "" : item.matnr; // 物料号
					var maktx = item.maktx == null ? "" : item.maktx; // 物料名
					var ztjtj = item.realprice == null ? 0 : item.realprice; // 标签价
					var realprice = item.realprice == null ? 0 : item.realprice; // 售价
					var zmatnrt = item.zmatnrt == null ? "" : item.zmatnrt; // 照片
					var matkl = item.matkl == null ? "" : item.matkl; // 类别
					var zjlbm = item.zjlbm;

					if ($("#swaptype").val() == 'GZIN' && zjlbm != null
							&& zjlbm != '') {
						getgoldprices(zjlbm);
					}

					var info = {
						matnr : matnr,
						maktx : maktx,
						ztjtj : ztjtj,
						realprice : realprice,
						zmatnrt : zmatnrt,
						matkl : matkl
					};
					chosematnrinfo(info, "user");
				});
			}
		});

	}

	function chosematnrinfo(item, type) {
		if (type = "") {
			charginfo = ui.item;
		} else {
			charginfo = item;
		}
		makeMatnrInit(charginfo);
	}

	function makeMatnrInit(charginfo) {

		$("#matnr").val(charginfo.matnr);
		$("#zhlhx").val(charginfo.maktx);
		$("#ztjtj").val(Number(charginfo.ztjtj).toFixed(0));
		$("#realprice").val(Number(charginfo.realprice).toFixed(0)); // 实收
		var lgort = '0008';
		if (charginfo.matkl == 'DJ') {
			lgort = '0013';
		} else if (charginfo.matkl == 'BC') {
			lgort = '0012';
		} else if (charginfo.matkl == 'BG') {
			lgort = '0015';
		} else if (charginfo.matkl == 'ZP' || charginfo.matkl == 'VI') {
			lgort = '0014';
		} else if (charginfo.matkl == 'G') {
			lgort = '0001';
		}
		$("#logrtinput").val(lgort);
		_pcimage = charginfo.zmatnrt;
		_pcimage = _pcimage == null || _pcimage == "" ? "zjzb.gif" : _pcimage;
		$(".tooltip").attr("href", "sappic/" + _pcimage);
		$(".tooltip").attr("title", charginfo.zhlhx);
		$("#pcimage").attr("src", "sappic/" + _pcimage);
		$("#pcimage").attr("alt", _pcimage);
		$("#pcimage").load(function() {
				}).error(function() {
					$("#pcimage").attr("src",
							"longhaul/pos/order/images/zjzb.gif");
					$("#pcimage").attr("alt", 'zjzb.gif');
					$(".tooltip").attr("href",
							"longhaul/pos/order/images/zjzb.gif");
					$(".tooltip").attr("title", "zjzb.gif");
				});

		$("#number").val("1");
		$("#showmatnrinfo").show();
		$("#showoptinfo").show();

		if ($("#inputgoldbar").attr("checked") == "checked") {
			$("#goldweightSpan").show();
			var reg = /\d+/;
			var goldweight = reg.exec(charginfo.maktx);
			$("#goldweight").val(goldweight);
			calcPrice();
		}

		if ($('input:radio[name="chargtype"]:checked').val() == 'gift') {
			btnAddRow();
		}
	}

	function getGroupGoodsInfo(kosrt) {
		var dialog = $.dialog({
					title : '正在努力加载中，请稍后...',
					max : false,
					min : false,
					close : false,
					lock : true
				});
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getGroupGoodsItem&postType=1",
			cache : false,
			data : {
				kosrt : kosrt
			},
			type : 'post',
			dataType : 'json',
			success : function(retdata) {
				creatGroupGoodsRow(retdata);
				getcurrentInteval();
				dialog.close();
			}
		});
	}

	function creatGroupGoodsRow(data) {
		var table = $("#tablecontent");
		var chargDivs = table.find("div[id^='charg']");
		var swaptype = $("#swaptype").val();
		if(( ordertype == 'ZYS2' && swaptype == 'ZIN' ) || ( ordertype == 'ZJM2' && swaptype == 'ZIN' ) 
		|| ordertype == 'ZYR1' || ordertype == 'ZJR1' ){
				for (var i = 0; i < data.length; i++) {
				if (Number(data[i].labst) > 0) {
					jAlert(	"组合中批次<b style='color:red;'>" + data[i].cpbm + "-"
									+ data[i].plmc + "</b>已经有库存，可能已经做过退换货，不能组合进行退换！", "提示",
							function(e) {
								$("#charg").select();
							});
					return;
				}
			}
		}else{
			for (var i = 0; i < data.length; i++) {
				if (Number(data[i].labst) <= 0) {
					jAlert(	"组合中批次<b style='color:red;'>" + data[i].cpbm + "-"
									+ data[i].plmc + "</b>库存不足，不能组合销售！", "提示",
							function(e) {
								$("#charg").select();
							});
					return;
				}
			}
		}
		
		for (var i = 0; i < chargDivs.length; i++) {
			for (var i = 0; i < data.length; i++) {
				if ($.trim($(chargDivs[i]).text()) == $.trim(data[i].cpbm)) {
					jAlert(	"组合中已经有批次<b style='color:red;'>" + data[i].cpbm
									+ "-" + data[i].plmc
									+ "</b>录入到销单中，请删除后重新录入！", "提示",
							function(e) {
								$("#charg").select();
							});
					return;
				}
			}
		}
		// cleartable(); // 先清除table内容
		// toplevelnumber = 1;
		// upgiftnumber = 1;

		var discount12 = $("#discount12").val();
		var discount34 = $("#discount12").val();

		var _discount1 = "";
		var _discount2 = "";
		var _discount3 = "";
		var _discount4 = "";
		var _discount5 = "";
		if (discount12 == "1") {
			_discount1 = $("#discount1").val(); // 折扣1
			_discount2 = 'N/A' // 折扣2
			_discount5 = 'N/A';// 折扣5
		} else if (discount12 == '2') {
			_discount1 = 'N/A'; // 折扣1
			_discount2 = $("#discount1").val(); // 折扣2
			_discount5 = 'N/A';// 折扣5
		} else {
			_discount1 = 'N/A'; // 折扣1
			_discount2 = 'N/A'; // 折扣2
			_discount5 = $("#discount1").val();// 折扣5
		}

		if (discount34 == "1") {
			_discount3 = $("#discount2").val(); // 折扣3
			_discount4 = "N/A"; // 折扣4
		} else {
			_discount3 = "N/A"; // 折扣3
			_discount4 = $("#discount2").val(); // 折扣4
		}

		var _marketprivilege = (Number($("#marketprivilege").val()) / 2)
				.toFixed(0);
		var _selfprivilege = (Number($("#selfprivilege").val()) / 2).toFixed(0);
		var _marketticketprice = (Number($("#marketticketprice").val()) / 2)
				.toFixed(0);
		var _selfticketprice = (Number($("#selfticketprice").val()) / 2)
				.toFixed(0);
		var _vipintegralNum = (Number($("#vipintegral").val()) / 2).toFixed(0);
		var _vipintegral = (Number($("#vipintegral").val()) / 2).toFixed(0);
		//zwh 2014.8.9
		var _cxdm = $("#salepromotion").val();
		$.each(data, function(key, val) {
			var upnumber = 1;
			var style = "";
			var chargtype = $('input:radio[name="chargtype"]:checked').val();
			var rownum = $("#tablecontent tr").length - 2;
			var toplevelstr = ""; // 用于保存上存文本
			var upnumbertext = "";// 记录上存文体
			_ordertype = $("#ordertype").val(); // 订单类型字段
			upnumber = Number(toplevelnumber) * 10;
			toplevelnumber = toplevelnumber + 1;
			style = "tdgrouptoplevel";
			upnumbertext = "00";
			toplevelstr = "<div id=leveladdgifts" + upnumber
					+ " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品
			var ordertItemype = "<div id=ordertItemype" + rownum + "></div>";
			// alert($("#logrtinput").val());
			//var logrt = "<div id=logrt" + rownum + ">" + $("#logrtinput").val()
			//+ "</div>";
			// ZWH 2014.8.9
			var logrt = "<div id=logrt" + rownum + ">" + $("#logrtinput").val()
			+ "</div>";
			
			_total = val.bqj;
			_realprice = val.bqj;
			_ztjtj = val.bqj; // 标签价格
			_realTagPrice = val.bqj;
			_number = 1; // 数量

			_goldweight = val.jlzl;
			ordertItemypestr = "";
			switch (_ordertype) {
				case "ZYS2" : // 换货订单类型
					_swaptype = $("#swaptype").val();
					if (chargtype == "charg") {
						if (_swaptype == "ZIN") {
							ordertItemypestr = "ZIN";
						} else if (_swaptype == "GZIN") {
							ordertItemypestr = "ZIN1";
						} else {
							ordertItemypestr = "ZOUT";
						}
					} else {
						if (_swaptype == "ZIN") {
							ordertItemypestr = "ZRE1";
						} else {
							ordertItemypestr = "ZTA1";
						}
					}
					logrt = "<div id=logrt" + rownum + ">"
							+ $("#logrtinput").val() + "</div>";
					if ($("#swaptype").val() == "ZIN"
							|| $("#swaptype").val() == "GZIN") {
						_realprice = (0 - Number(_realprice));
						_total = (0 - Number(_total));
						_ztjtj = (0 - Number(_ztjtj));
						_number = (0 - Number(_number));
						_goldweight = (0 - Number(_goldweight));
					}
					break;
				case "ZYS1" :// 直营店普通销售
					ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
					break;
				case "ZYS3" :// 直营店收取订金
					ordertItemypestr = chargtype == "charg" ? "ZL2N" : "ZL2N";
					break;
				case "ZYS4" : // 直营店赠品销售
					ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
					break;
				case "ZYS6" : // 直营店积分兑换
					ordertItemypestr = chargtype == "charg" ? "ZTNN" : "ZTNN";
					break;
				case "ZYR1" : // 直营店销售退货
					ordertItemypestr = chargtype == "charg" ? "ZREN" : "ZRNN";
					_realprice = (0 - Number(_realprice));
					_total = (0 - Number(_total));
					_ztjtj = (0 - Number(_ztjtj));
					_number = (0 - Number(_number));
					_goldweight = (0 - Number(_goldweight));
					break;
				case "ZYR2" : // 直营店退还订金
					ordertItemypestr = chargtype == "charg" ? "ZG2N" : "ZG2N";
					break;

				case "ZJM2" : // 加盟店换货销售
					_swaptype = $("#swaptype").val();
					if (chargtype == "charg") {
						if (_swaptype == "ZIN") {
							ordertItemypestr = "ZIN";
						} else if (_swaptype == "GZIN") {
							ordertItemypestr = "ZIN1";
						} else {
							ordertItemypestr = "ZOUT";
						}
					} else {
						if (_swaptype == "ZIN") {
							ordertItemypestr = "ZIN1";
						} else {
							ordertItemypestr = "ZTNN";
						}
					}
					logrt = "<div id=logrt" + rownum + ">" + $("#logrt").val()
							+ "</div>";
					if ($("#swaptype").val() == "ZIN"
							|| $("#swaptype").val() == "GZIN") {
						_realprice = (0 - Number(_realprice));
						_total = (0 - Number(_total));
						_ztjtj = (0 - Number(_ztjtj));
						_number = (0 - Number(_number));
						_goldweight = (0 - Number(_goldweight));
					}
					break;
				case "ZJM1" :// 加盟店普通销售
					ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
					break;
				case "ZJM3" :// 加盟店收取订金
					ordertItemypestr = chargtype == "charg" ? "ZL2N" : "ZL2N";
					break;
				case "ZJM4" : // 加盟店赠品销售
					ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
					break;
				case "ZJM6" : // 加盟店积分兑换
					ordertItemypestr = chargtype == "charg" ? "ZTNN" : "ZTNN";
					break;
				case "ZJR1" : // 加盟店销售退货
					ordertItemypestr = chargtype == "charg" ? "ZREN" : "ZRNN";
					break;
				case "ZJR2" : // 加盟店退还订金
					ordertItemypestr = chargtype == "charg" ? "ZG2N" : "ZG2N";
					break;
				case "ZYS7" :// 直营店员工内销
					ordertItemypestr = chargtype == "charg" ? "ZTA2" : "ZTN2";
					break;
				case "ZJM7" :// 加盟店员工内销
					ordertItemypestr = chargtype == "charg" ? "ZTA2" : "ZTN2";
					break;
				case "ZOR6" :// 加盟店员工内销
					ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTNN";
					break;
				default :
					break;
			}
			ordertItemypeshow = ordertItemypeshowText(ordertItemypestr);
			ordertItemype = "<div id=ordertItemype" + rownum
					+ " style='display:none'>" + ordertItemypestr + "</div>";

			var delimage;
			if ($("#allGift").attr("checked") == 'checked') {
				delimage = "<img alt='删除allGift' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
			} else
				delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
			var row = "<div id=" + rownum + ">" + delimage + "</div>";
			var posnrnumber = "<div  id=posnrnumber" + rownum + "> " + upnumber
					+ " </div>" + "<div id=upnumber" + chargtype + rownum
					+ " style='display:none'>" + upnumber + "</div>"
					+ toplevelstr + "";
			var upumber = "<div id=upnumberlevel" + rownum + ">" + upnumbertext
					+ "</div>";

			var charg = "<div id=charg" + rownum + ">" + val.cpbm
					+ "&nbsp;</div>"; // 批次
			var matnr = "<div id=matnr" + rownum + ">" + val.bkbh
					+ "&nbsp; </div>"; // 物料

			var zhlhx = "<div id=zhlhx" + rownum + " class='divmatnrdesc'>"
					+ val.plmc + "&nbsp; </div>"; // 商品ID
			var uniteprice = "<div id=uniteprice" + rownum + ">"
					+ Number($("#ztjtj").val()).toFixed(0) + "&nbsp;</div>"; // 单价
			var number = "<div id=number" + rownum + ">" + _number + "</div>"; // 数量
			var personcost = "<div id=personcost" + rownum + ">"
					+ Number($("#personcost").val()).toFixed(0) + "</div>"; // 人工费用
			var goldweight = "<div id=goldweight" + rownum + ">" + val.jlzl
					+ "</div>"; // 金重
			var goldvalue = "<div id=goldvalue" + rownum
					+ " style='display:none'>" + $("#goldvalue").val()
					+ "</div>"; // 金价

			var goldrealprice = "<div id=goldrealprice"
					+ rownum
					+ ">"
					+ (Number($("#personcost").val()) + Number($("#goldweight")
							.val())
							* Number($("#goldvalue").val())).toFixed(0)
					+ "&nbsp;</div>"; // 金价初始总价

			var myprice = (( ordertype == 'ZYS2' && swaptype == 'ZIN' ) || ( ordertype == 'ZJM2' && swaptype == 'ZIN' ) 
		|| ordertype == 'ZYR1' || ordertype == 'ZJR1' ) ? ( '-'+val.bqj ) : val.bqj;
					
			var receivable = "<div id=receivable" + rownum + ">"
					+ Number(_total).toFixed(0) + "</div>"; // 合计
			var ztjtj = "<div id=ztjtj" + rownum + ">" + myprice + "</div>"; // 标签价格
			var realTagPrice = "<div id=realTagPrice" + rownum + ">" + myprice
					+ "</div>"; // 标签价格
			_realprice = Number(Number(myprice)
							* (_discount1 != "N/A"
									? (Number(_discount1) / 100)
									: 1)
							* (_discount2 != "N/A"
									? (Number(_discount2) / 100)
									: 1)
							* (_discount3 != "N/A"
									? (Number(_discount3) / 100)
									: 1)
							* (_discount4 != "N/A"
									? (Number(_discount4) / 100)
									: 1)
							* (_discount5 != "N/A"
									? (Number(_discount5) / 100)
									: 1)).toFixed(0);
			_realprice = _realprice - _vipintegral;
			// alert(_realprice);
			var realprice = "<div id=realprice" + rownum + " >" + (_realprice)
					+ "</div>"; // 实销价格

			var salepromotion = "<div id=salepromotion"
					+ rownum
					+ ">"
					+ (($("#discount12").get(0).selectedIndex == 1)
							? $("#salepromotion").val()
							: "") + "</div>"; // 促销代码

			var discount1 = "<div id=discount1" + rownum + ">" + _discount1
					+ "</div>"; // 折扣1
			var discount2 = "<div id=discount2" + rownum + ">" + _discount2
					+ "</div>"; // 折扣2
			var discount3 = "<div id=discount3" + rownum + ">" + _discount3
					+ "</div>"; // 折扣3
			var discount4 = "<div id=discount4" + rownum + ">" + _discount4
					+ "</div>"; // 折扣4
			var discount5 = "<div id=discount5" + rownum + ">" + _discount5
					+ "</div>"; // 折扣5

			var marketprivilege = "<div id=marketprivilege" + rownum + ">"
					+ marketprivilege + "</div>";
			var selfprivilege = "<div id=selfprivilege" + rownum + ">"
					+ selfprivilege + "</div>";
			var marketticketprice = "<div id=marketticketprice" + rownum + ">"
					+ marketticketprice + "</div>";
			var selfticketprice = "<div id=selfticketprice" + rownum + ">"
					+ selfticketprice + "</div>";
			// var vipintegralNum = Number($("#vipintegral").val());
			var vipintegral = "<div id=vipintegral" + rownum + ">"
					+ _vipintegral + "</div>";
			var currentIntegralNum = parseInt(Number($("#currentIntegral")
					.val()) == 0
					? 0
					: (Number(_realprice) / Number($("#currentIntegral").val())));
			// alert(currentIntegralNum);

			if ($("#regname").val() != "") {
				doubleIntervalValidate = false;
			}

			if ((ordertype == 'ZYS2' && ($("#swaptype").val() == "ZIN" || $("#swaptype")
					.val() == "GZIN"))
					|| (ordertype == 'ZJM2' && ($("#swaptype").val() == "ZIN" || $("#swaptype")
							.val() == "GZIN"))
					|| (ordertype == 'ZJR1')
					|| (ordertype == 'ZYR1')) {

			} else if (doubleIntervalValidate) {
//				currentIntegralNum = currentIntegralNum * 2;
				if (mykondm == "01" || mykondm == "02" || mykondm == "03" || mykondm == "04" || mykondm == "05" || mykondm == "06"){
					if (Number($("#currentIntegral").val()) == 100){
						currentIntegralNum = currentIntegralNum * 2;
					}
				} else if (mykondm == "11"){
					if (Number($("#currentIntegral").val()) == 3000){
						currentIntegralNum = currentIntegralNum * 2;
					}
				} else {
					if (Number($("#currentIntegral").val()) == 300){
						currentIntegralNum = currentIntegralNum * 2;
					}
				}
			}
			var currentIntegral = "<div id=currentIntegral" + rownum + ">"
					+ (currentIntegralNum) + "</div>";

			// var cashcoupon = "<div id=cashcoupon" + rownum + ">" +
			// $("#cashcoupon").val() + "</div>";

			var imgpath = $("#pcimage").attr("src");
			var imgalt = $("#pcimage").attr("alt");
			var imaghref = "<a href=" + imgpath + " class='tooltip' title="
					+ $("#zhlhx").val() + "(" + $("#ztjtj").val() + ")>";
			var pcimage = "<div id=pcimage" + rownum + ">" + imaghref
					+ "<img id=pcimagesrc  alt='" + imgalt + "' src=" + imgpath
					+ " height='40' width='38'/></a></div>";
			// 设置合计

			$("#totalprice").text((Number($("#totalztjtj").text()) + val.bqj)); // 总的标签价格
			$("#totalnumber")
					.text((Number($("#totalnumber").text()) + Number(_number))
							.toFixed(0)); // 总数量
			$("#toalpersoncost")
					.text((Number($("#toalpersoncost").text()) + Number($("#personcost")
							.val())).toFixed(0)); // 人工费用
			$("#totalgoldweight").text((Number(Number($("#totalgoldweight")
					.text())
					+ _goldweight))); // 总金重
			// if (chargtype == "charg" || _ordertype == 'ZRE2') {
			$("#total").text((Number($("#total").text()) + _total).toFixed(0)); // 
			$("#totalztjtj")
					.text((Number($("#totalztjtj").text()) + Number(_ztjtj))
							.toFixed(0)); // 
			$("#totalrealprice")
					.text(	(Number($("#totalrealprice").text()) + (Number(myprice)
									* (_discount1 != "N/A"
											? (Number(_discount1) / 100)
											: 1)
									* (_discount2 != "N/A"
											? (Number(_discount2) / 100)
											: 1)
									* (_discount3 != "N/A"
											? (Number(_discount3) / 100)
											: 1)
									* (_discount4 != "N/A"
											? (Number(_discount4) / 100)
											: 1) * (_discount5 != "N/A"
									? (Number(_discount5) / 100)
									: 1))).toFixed(0)); // 实际销售合计
			// }
			$("#goldvalue").removeClass("inputattention");
			$("#personcost").removeClass("inputattention");
			$("#charg").addClass("inputkey");
			$("#realprice").removeClass("inputkey");
			// if($("#matnrselect").css("display") != 'none'){
			// $("#matnrselect").focus();
			// }else{
			// $("#charg").focus();
			// }
			// 将输入设置为空
			clearchargre();
			var row = "<tr><td class=" + style + ">" + row + "</td>";
			row = row + "<td class=" + style + ">" + posnrnumber + "</td>";
			row = row + "<td class=" + style + "  style='display:none'>"
					+ upumber + "</td>";
			row = row + "<td class=" + style + ">" + charg + "</td>";
			row = row + "<td class=" + style + ">" + matnr + "</td>";
			row = row + "<td class=" + style + ">" + zhlhx + "</td>";
			row = row + "<td class=" + style + " align='center'>" + pcimage
					+ "</td>";
			row = row + "<td style='display:none' class=" + style
					+ " align='right'>" + uniteprice + "</td>";
			row = row + "<td style='display:none' class=" + style + ">"
					+ currentIntegral + "</td>";
			row = row + "<td class=" + style + " align='right'>" + number
					+ "</td>";
			goodtdshow = $("#thpersoncost").css("display") == "none"
					? "display:none"
					: "";

			row = row + "<td  id='personcosttd" + rownum + "'  class=" + style
					+ "  align='right' style=" + goodtdshow + ">" + personcost
					+ "</td>";
			row = row + "<td  id='goldtr" + rownum + "'  class=" + style
					+ "  align='right' style=" + goodtdshow + ">" + goldweight
					+ goldvalue + "</td>";
			row = row + "<td style='display:none' class=" + style
					+ " align='right'>" + receivable + "</td>";

			row = row + "<td style='display:none' class=" + style
					+ " align='right'>" + goldrealprice + "</td>";

			row = row + "<td class=" + style + " align='right'>" + ztjtj
					+ "</td>";
			row = row + "<td style='display:none' class=" + style
					+ " align='right'>" + realTagPrice + "</td>";

			row = row + "<td class=" + style + " align='right'>" + realprice
					+ "</td>";
			row = row + "<td class=" + style + ">" + ordertItemype + ""
					+ ordertItemypeshow + "</td>";

			if (ordertype != "ZJM6" && ordertype != "ZYS6"
					&& ordertype != "ZOR6" && ordertype != "ZJM4"
					&& ordertype != "ZYS4") {
				row = row + "<td class=" + style + ">" + 100 + "</td>";
				row = row + "<td class=" + style + ">" + discount1 + "</td>";
				row = row + "<td class=" + style + ">" + discount2 + "</td>";
				row = row + "<td class=" + style + ">" + discount5 + "</td>";
				row = row + "<td class=" + style + ">" + discount3 + "</td>";
				row = row + "<td class=" + style + ">" + discount4 + "</td>";

				row = row + "<td class=" + style + ">" + _marketprivilege
						+ "</td>";
				row = row + "<td class=" + style + ">" + _selfprivilege
						+ "</td>";
				row = row + "<td class=" + style + ">" + _marketticketprice
						+ "</td>";
				row = row + "<td class=" + style + ">" + _selfticketprice
						+ "</td>";
				row = row + "<td class=" + style + ">" + vipintegral + "</td>";
				//row = row + "<td class=" + style + " style='display:none;'>"zwh  20141112
				row = row + "<td class=" + style + " >"
						+ _cxdm + "</td>";
				// row = row + "<td class=" + style + ">" + cashcoupon +
				// "</td>";

				row = row + "<td class=" + style + " id='logrttd" + rownum
						+ "' >" + logrt + "</td>";
			}

			if (ordertype == "ZOR6") {
				row = row + "<td class=" + style + " id='logrttd" + rownum
						+ "' >" + logrt + "</td>";
			}

			row = row + "</tr>";
			$(row).insertAfter($("#tablecontent tr:eq(" + rownum + ")"));
			if (chargtype == "charg") {
				upbynumber = Number(upbynumber) + 1;
			} else if (chargtype == "gift") {
				upgiftnumber = Number(upgiftnumber) + 1;
			}
			goldtextdisplayno();
			$("#showmatnrinfo").hide('fast');
			$("#showoptinfo").hide('fast');

			$("#cash").val($("#totalrealprice").text());
			$("#statementtotal").val($("#totalrealprice").text());

			// if((ordertype == 'ZYS2' && ($("#swaptype").val()=="ZIN" ||
			// $("#swaptype").val()=="GZIN")) || (ordertype == 'ZJM2' &&
			// ($("#swaptype").val()=="ZIN" || $("#swaptype").val()=="GZIN")) ||
			// (ordertype == 'ZJR1') || (ordertype == 'ZYR1')){
			// $("#currentIntevalSpan").text(Number($("#currentIntevalSpan").text())+Number(currentIntegralNum)
			// - vipintegralNum);
			// }else{
			// $("#currentIntevalSpan").text(Number($("#currentIntevalSpan").text())+Number(currentIntegralNum)
			// - vipintegralNum);
			// }

			$("#statementtotal").val($("#totalrealprice").text());
		});
	}

	$("#ifGiveShopper").click(function(e) {
				if ($(this).attr("checked") != null) {
					$("#shopnumberSpan").show();
				} else {
					$("#shopnumberSpan").hide();
				}
			})

	$("#giftMethod").change(function(e) {
				// alert(extwg);
				var value = $(this).val();
				if (value == '') {
					$("#giftPriceSpan").hide();
					// var realprice = $("#receivable").val();
					// $("#realprice").val(realprice);
					$("#realprice").select();

					getMyDiscount();

				} else if (value == '01') {

					if (value == "01" && extwg != "NE") {
						jAlert("您输入的批次不是赠链，不能做为赠链赠送！", "提示", function(e) {
									$("#giftPriceSpan").hide();
									var realprice = $("#receivable").val();
									$("#realprice").val(realprice);
									$("#realprice").select();
									$("#giftMethod").val('');
									if ($("#discount1").val() == 'N/A') {
										getMyDiscount();
									}
								});
						return;
					}

					$("#discount1").val("N/A");
					$("#discount2").val("N/A");

					calcPrice();

					$("#giftPriceSpan").show();
					var realprice = $("#receivable").val();
					//alert(ordertype);
					if(((ordertype == 'ZYS2' || ordertype == 'ZJM2' )&& $("#swaptype").val() == 'ZIN') || (ordertype == 'ZYR1' || ordertype == 'ZJR1' )){
						
					}else{
						realprice = Number(realprice) - Number(giftPrice);
					}
					if (realprice < 0) {
						realprice = 0;
					}
					$("#realprice").val(realprice.toFixed(0));
					$("#realprice").select();
				} else {

					$("#discount1").val("N/A");
					$("#discount2").val("N/A");

					calcPrice();

					// $("#giftPriceSpan").show();
					// var realprice = $("#receivable").val();
					// realprice = Number(realprice) - Number(giftPrice);
					// if (realprice < 0) {
					// realprice = 0;
					// }
					
					if($("#swaptype").attr("display") == 'display' && $("#swaptype").val() == 'ZIN'){
						
					}else{
						$("#realprice").val(0);
					}
					$("#realprice").select();
				}
			});

	function getMyDiscount() {

		$("#salepromotionSpan").hide();
		if ($("#discount12").get(0).selectedIndex == 2) {
			$("#discount1").attr("readonly", false);
			$("#discount1").val('100');
			$("#discount1").select();
			calcPrice();
		} else if ($("#discount12").get(0).selectedIndex == 3) {
			$("#discount1").attr("readonly", true);
			$("#discount1").val('N/A');
			calcPrice();
		} else {
			$("#discount1").attr("readonly", true);
			$.ajax({
				url : "longhaul/pos/order/orderSystem.ered?reqCode=getDiscount&option=user&postType=1&charg="
						+ $("#charg").val()
						+ "&kunnr="
						+ $("#kunnr").val()
						+ "&matnr=" + $("#matnr").val(),
				dataType : 'json',
				success : function(data) {
					if ($("#discount12").get(0).selectedIndex == 0) {
						$("#discount1").val(data.discount1);
					} else if ($("#discount12").get(0).selectedIndex == 1) {
						$("#salepromotionSpan").show();
						if ($("#salepromotionSelect").find("option").length == 0) {
							jAlert("没有找到该商品的促销活动，请核对！", "提示", function(e) {
										$("#discount1").val('100');
									});
						} else {
							var discount = 100
									+ (Number($("#salepromotionSelect")
											.val()
											.substring($("#salepromotionSelect")
															.val().indexOf("|")
															+ 1)) / 10);
							$("#discount1").val(discount);
						}
					}
					// if ($("#discount12").get(0).selectedIndex == 1) {
					//								
					// // alert(discount);
					// }
					// calcPrice();

					if ($("#discount34").get(0).selectedIndex == 1) {
						$("#discount2").attr("readonly", false);
						$("#discount2").val('100');
						$("#discount2").select();
						calcPrice();
					} else if ($("#discount34").get(0).selectedIndex == 2) {
						$("#discount2").attr("readonly", true);
						$("#discount2").val('N/A');
						calcPrice();
					} else {
						$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=getDiscount&option=user&postType=1&charg="
									+ $("#charg").val()
									+ "&kunnr="
									+ $("#kunnr").val()
									+ "&matnr="
									+ $("#matnr").val(),
							dataType : 'json',
							success : function(data) {
								$("#discount2").attr("readOnly", true);
								$("#discount2").val(data.discount3);
								calcPrice();
							}
						});
					}

				}
			});
		}

	}

	$("#outGoldType").change(function(e) {
				var value = $(this).val();
				var index;

				if (value != '') {
					$("#goldweightSpan").show();
				} else {
					$("#goldweightSpan").hide();
				}

				goldtextdisplay();

				switch (value) {
					case 'JG99' :
						index = '01';
						break;
					case 'JG90' :
						index = '02';
						break;
					case 'JG9X' :
						index = '03';
						break;
					case 'JK18' :
						index = '04';
						break;
					case 'JP95' :
						index = '05';
						break;
					case 'JP99' :
						index = '06';
						break;
					case 'JP9X' :
						index = '07';
						break;
					default :
						index = '11';
						break;
				}

				if (value == '') {
					return;
				}
				var mydate = new Date();
				var yearText = (mydate.getFullYear() + '').substring(2, 4);
				var monthText = mydate.getMonth() + 1;
				if (monthText < 10)
					monthText = '0' + monthText;
				var mycharg = WERKS + yearText + monthText + index;
				$("#charg").val(mycharg);
				$("#matnr").val("JG9X");//旧金默认
				getmatnrbyuser();

				$("#goldweight").val('1');
				$("#depreciationPrice").val('0');
				$("#logrt").val('0008');
				$("#logrtinput").val('0008');
				$("#goldweight").select();
				
				getSalepromotion();//20150211 zwh
			});

	function getOldGoldType() {
		$("#outGoldType").empty();
		$("#outGoldType").append("<option value=''>请选择...</option>");
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getOldGoldType&postType=1",
			dataType : "json",
			success : function(data) {
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					var value = item.matnr;
					var text = item.maktx;
					var option = $("<option value='" + value + "'>" + text
							+ '-' + value + "</option>")
					$("#outGoldType").append(option);
				}
			}
		});
	}

	function getcurrentInteval() {
		var totalCurrentIntetial = 0;
		var totalVipintegral = 0;
		$("#tablecontent tr").each(function() { // 得到每一个tr
					earchobject = $(this);
					var currentIntevial = earchobject
							.find("div[id^='currentIntegral']").text();
							//alert(currentIntevial);
						currentIntevial = (currentIntevial == null || currentIntevial =='') ? 0 : currentIntevial;
					var vipintegral = earchobject
							.find("div[id^='vipintegral']").text();
					vipintegral = (vipintegral == null || vipintegral =='') ? 0 : vipintegral;
					totalCurrentIntetial += Number(currentIntevial);
					totalVipintegral += Number(vipintegral);
				});

		$("#currentIntevalSpan").text((totalCurrentIntetial - totalVipintegral)
				.toFixed(0));
		$("#currentIntevalSpanShow").text(totalCurrentIntetial.toFixed(0));
	}

	$("#doubleorsingle").change(function() {
				calcPrice();
			});

	$("#freepersoncost").click(function() {
				if ($(this).attr("checked") == 'checked') {
					$("#personcost").val(0);
					calcPrice();
				} else {
					getPersonCost();
				}
			});

	function getPersonCost() {
		if ((ordertype == 'ZJM2' || ordertype == 'ZYS2')
				&& $("#swaptype").val() == 'ZIN') {
			if (matkl == 'P') {
				$("#personcost").val(30);
			} else if (matkl == 'G') {
				$("#personcost").val(20);
			}
			calcPrice();
		} else if (ordertype == 'ZJR1' || ordertype == 'ZYR1') {
			$("#personcost").val(0);
			calcPrice();
		} else {
			switch (mykondm) {
				case '09' :
					var dialog = $.dialog({
								title : '正在获取基本工费，请稍后...',
								max : false,
								min : false,
								close : false,
								lock : true
							});
					$.ajax({
						url : "longhaul/pos/order/orderSystem.ered?reqCode=getZjbgf&postType=1",
						type : 'post',
						data : "charg=" + $("#charg").val()+"&kondm=" + mykondm,
						success : function(data) {
							dialog.close();
							calcPrice();
							$("#personcost").val(Number(data));
							// $("#personcostshow").val(Number(data) *
							// 2);
							$("#personcost").attr("readOnly", true);
							// getgoldprices(sjczbm);
						}
					});
					break;
				case '12' :
					var dialog = $.dialog({
								title : '正在获取基本工费，请稍后...',
								max : false,
								min : false,
								close : false,
								lock : true
							});
					$.ajax({
						url : "longhaul/pos/order/orderSystem.ered?reqCode=getZjbgf&postType=1",
						type : 'post',
						data : "charg=" + $("#charg").val()+"&kondm=" + mykondm ,
						success : function(data) {
							dialog.close();
							calcPrice();
							$("#personcost").val(Number(data));
							// $("#personcostshow").val(Number(data) *
							// 2);
							$("#personcost").attr("readOnly", true);
							// getgoldprices(sjczbm);
						}
					});
					break;
				case '20' :
					var dialog = $.dialog({
								title : '正在获取基本工费，请稍后...',
								max : false,
								min : false,
								close : false,
								lock : true
							});
					$.ajax({
						url : "longhaul/pos/order/orderSystem.ered?reqCode=getZjbgf&postType=1",
						type : 'post',
						data : "charg=" + $("#charg").val()+"&kondm=" + mykondm ,
						success : function(data) {
							dialog.close();
							calcPrice();
							$("#personcost").val(Number(data) * 2);
							$("#personcost").attr("readOnly", true);
							// getgoldprices(sjczbm);
						}
					});
					break;
				default :
					$("#personcost").val(0);
					calcPrice();
					$("#personcost").attr("readOnly", false);
					// getgoldprices(sjczbm);
					break;
			}
		}
	}

	// setInterval("calcPrice()", 100);

	$("#inputgoldbar").click(function() {
				if ($("#vipid").val() == '') {
					jAlert("请先输入客户信息！", "提示", function(e) {
								$("#inputgoldbar").attr("checked", null);
								$("#vipid").focus();
							});
					return;
				}

				if ($(this).attr("checked") == null) {
					$("#discount1Th").show();
					$("#discount2Th").show();
					$("#discount3Th").show();
					$("#discount4Th").show();
					$("#discount5Th").show();
					$("#discount6Th").show();
					$("#marketprivilegeTh").show();
					$("#selfprivilegeTh").show();
					$("#marketticketpriceTh").show();
					$("#selfticketpriceTh").show();
					$("#vipintegralTh").show();
					$("#selfprivilegeTh").show();
					$("#charg").show();
					$("#inputHeadGiftSpan").show();
					$("#inputPackageSpan").show();
					$("#matnrSelect").hide();
					$("#goldbargoldvaluespan").hide();
					$("#settlegoldvalueTh").hide();
					$("#realitygoldvalueTh").hide();
					$("#numberSpan").hide();
					$("#goldweightSpan").hide();
					$("#mgoldweightSpan").hide();
					$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次:");

					$("#discount12Span").show();
					$("#discount34Span").show();
					$("#selfprivilegeSpan").show();
					$("#selfticketpriceSpan").show();
					$("#vipintegralSpan").show();
					$("#giftMethodSpan").show();
					$("#marketprivilegeSpan").show();
					$("#marketticketpriceSpan").show();

				} else {
					$("#discount1Th").hide();
					$("#discount2Th").hide();
					$("#discount3Th").hide();
					$("#discount4Th").hide();
					$("#discount5Th").hide();
					$("#discount6Th").hide();
					$("#marketprivilegeTh").hide();
					$("#selfprivilegeTh").hide();
					$("#marketticketpriceTh").hide();
					$("#selfticketpriceTh").hide();
					$("#vipintegralTh").hide();
					$("#selfprivilegeTh").hide();
					$("#charg").hide();
					$("#inputHeadGiftSpan").hide();
					$("#inputPackageSpan").hide();
					$("#matnrSelect").show();
					$("#goldbargoldvaluespan").show();
					$("#settlegoldvalueTh").show();
					$("#realitygoldvalueTh").show();
					$("#numberSpan").show();
					$("#goldweightSpan").show();
					$("#goldweight").attr("readOnly", true);
					$("#charglabel").html("物&nbsp;料&nbsp;号:");

					$("#discount12Span").hide();
					$("#discount34Span").hide();
					$("#selfprivilegeSpan").hide();
					$("#selfticketpriceSpan").hide();
					$("#vipintegralSpan").hide();
					$("#giftMethodSpan").hide();
					$("#marketprivilegeSpan").hide();
					$("#marketticketpriceSpan").hide();

					getgoldbarmatnrinfo();
				}
			});

	function getgoldbarmatnrinfo() {
		_ordertype = $("#ordertype").val();
		_chargtype = 'goldbar';
		_charg = $("#charg").val().toUpperCase();

		var dialog = $.dialog({
					title : '正在获取投资金条物料号,请稍后...',
					max : false,
					min : false,
					close : false,
					lock : true
				});

		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getpcxx&postType=1&ordertype="
					+ _ordertype
					+ "&option=auto&werks="
					+ WERKS
					+ "&random="
					+ Math.random() + "",
			dataType : "json",
			data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype
					+ "&giftReferencePrice=" + $("#giftReferencePrice").val(),
			success : function(data) {
				dialog.close();
				if (data == "") {
					var chargalertstr = "没有找到投资金条物料信息";
					jAlert(chargalertstr, '提示', function(r) {
								clearcharginfo();
								$("#matnrSelect").hide();
								$("#charg").show();
								$("#allGift").attr("checked", null);
							});
					response(null);
					return;
				}
				$("#matnrSelect").empty();
				$("#matnrSelect").append($("<option value=''>请选择...</option>"));
				$.map(data, function(item) {
							var matnr = item.cpbm == null ? "" : item.cpbm; // 物料号
							var plmc = item.plmc == null ? "" : item.plmc; // 名称
							var labst = item.labst == null ? "" : item.labst; // 库存
							var option = $("<option value='" + matnr + "->"
									+ labst + "'>" + plmc + '->' + matnr
									+ "</option>");
							$("#matnrSelect").append(option);
						});
			}
		});

	}

	$("#realitygoldvalue").keyup(function() {
				if (checkNum(this))
					calcPrice();
			});
	$("#number").keyup(function() {
				var realCount = Number($("#realnumber").val());
				var number = Number($(this).val());
				var goldweight = Number($("#goldweight").val());

				/*if (realCount < number * goldweight) {
					number = parseInt(realCount / goldweight);
					jAlert("超出库存数量，库存只支持卖出" + number + "件！", "提示", function() {
								$("#number").select();
							});
					$(this).val(number);
				}**/
				if (realCount < number ) {
					number = parseInt(realCount / goldweight);
					jAlert("超出库存数量，库存只支持卖出" + number + "件！", "提示", function() {
								$("#number").select();
							});
					$(this).val(number);
				}
				if (checkNum(this))
					calcPrice();
			});

	$("#settlegoldvalue").keydown(function(e) {
				if (e.keyCode == 13) {
					if (Number($(this).val()) > 0) {
						$("#realitygoldvalue").focus();
					} else {
						alert("请输入正确的金额！");
					}
				}
			});

	$("#realitygoldvalue").keydown(function(e) {
				if (e.keyCode == 13) {
					if (Number($(this).val()) > 0) {
						$("#realprice").focus();
					} else {
						alert("请输入正确的金额！");
					}
				}
			});

	if (ordertype == "ZYS4" || ordertype == "ZJM4") {
		$("#matnrSelect").empty();
		$("#matnrSelect").append($("<option value=''>请选择...</option>"));
	}

	if (ordertype == "ZYS6" || ordertype == "ZJM6") {
		$("#matnrSelect").empty();
		$("#matnrSelect").append($("<option value=''>请选择...</option>"));
	}

	$("#rejPackageAndGift").click(function() {
		clearcharginfo();
		if ($(this).attr("checked") == "checked") {
			$("#charglabel").html("物&nbsp;料&nbsp;号：");
			$("input[type=radio][name=chargtype][value=gift]").attr("checked",
					"checked");
		} else {
			$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;次：");
			$("input[type=radio][name=chargtype][value=charg]").attr("checked",
					"checked");
		}

	});
	
	
	$("#updateorderprice").click(function(){
		var currdate = new Date();
		var year = currdate.getFullYear();
		var month = currdate.getMonth()+1;
		var date = currdate.getDate();
		var ordertime = $("#ordertime").val();
		var array = ordertime.split('-');
//		alert(array[0]);
//		alert(array[1]);
//		alert(array[2]);
		
		if($(this).val()=='保存'){
			var cash = $("#cash").val();
			var shoppingcard = $("#shoppingcard").val();
			var unionpay = $("#unionpay").val();
			var shopnumber = $("#shopnumber").val();
			var salesorderid = $("#salesorderid").val();
			var sapsalesorderid = $("#sapsalesorderid").text();
			var remark = $("#remark").val();
			var ordertime = $("#ordertime").val();
			
			jConfirm("确定更新吗？","提示",function(e){
				if(e){
					var dialog = $.dialog({
							title : '正在更新中，请稍后...',
							max : false,
							min : false,
							close : false,
							lock : true
						});
					$.ajax({
							url : "longhaul/pos/order/orderSystem.ered?reqCode=updateOrderPrice&option=user&postType=1",
							dataType : "json",
							type : 'post',
							data : "cash=" + cash + "&shoppingcard=" + shoppingcard + "&unionpay=" + unionpay + "&shopnumber=" + shopnumber
								+ "&salesorderid=" + salesorderid + "&sapsalesorderid=" + sapsalesorderid+ "&remark=" + remark+ "&ordertime=" + ordertime,
							success : function(data) {
								dialog.close();
								if (data.success != null) {
									jAlert(data.success,"更新成功",function(){
										$("#updateorderprice").val('修改');
										$("#cancleupdate").css("display", "none");
										$("#unionpay").attr('disabled',true);
										$("#shoppingcard").attr('disabled',true);
										$("#shopnumber").attr('disabled',true);
										$("#remark").attr('disabled',true);
										$("#ordertime").attr('disabled',true);
									});
								}else if(data.error != null){
									jAlert(data.error,"更新失败",function(){
									});
								}
							}
						});		
				}
			});
			
		}else{
//			if( !(year == Number(array[0]) && month == Number(array[1]) && date == Number(array[2]) )){
//				jAlert("只能修改当天的销售订单，该销售单无法修改！","提示",function(){});
//				return;
//			}
			
			$(this).val('保存');
			
			$("#cancleupdate").css("display", "");
			$("#cancleupdate").attr('disabled',false);
			
			$("#unionpay").attr('disabled',false);
			$("#shoppingcard").attr('disabled',false);
			$("#shopnumber").attr('disabled',false);
			$("#remark").attr('disabled',false);
			$("#ordertime").attr('disabled',false);
		}
	});
	
	
	$("#cancleupdate").click(function(){
		$(this).css("display", "none");
		$("#updateorderprice").val('修改');
		$("#unionpay").attr('disabled',true);
		$("#shoppingcard").attr('disabled',true);
		$("#shopnumber").attr('disabled',true);
		$("#remark").attr('disabled',true);
		$("#ordertime").attr('disabled',true);

		
	});
	$("#inputWJGF").click(function(){
		if($(this).attr("checked") == 'checked'){
			$("#showmatnrinfo").show();
			$("#showoptinfo").show();
			
			$("#matnr").val("WJGF");
			$("#matnrInput").val("WJGF");
			$("#zhlhx").val("外金工费");
			$("#receivable").val("0");
			$("#ztjtj").val("0");
			$("#realprice").val("0");
			$("#selfprivilege").val("0");
			$("#selfticketprice").val("0");
			$("#vipintegral").val("0");
			$("#marketprivilege").val("0");
			$("#marketticketprice").val("0");
		}else{
			$("#showmatnrinfo").hide();
			$("#showoptinfo").hide();
		}
	});
	
	$("#inputBookGood").click(function(){
		if($(this).attr("checked") == 'checked'){
			$("#matnrSelect").hide();
			$("#choiceOrderInfoSpan").hide();
			$("#charg").show();
			$("#matnrSelect1").hide();
			$("#charglabel").html("批&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;次:");
		}else{
			$("#matnrSelect1").show();
			$("#choiceOrderInfoSpan").show();
			$("#charg").hide();
			$("#charglabel").html("定制单号:");
			
		}
	});
	
	
	
	
	

});
