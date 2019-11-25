$(function() {
	// 设置回退不到回退到历史
	$(document).keydown(function(e) {
		var target = e.target;
		var tag = e.target.tagName.toUpperCase();
		if (e.keyCode == 8) {
			if ((tag == 'INPUT' && !$(target).attr("readonly")) || (tag == 'TEXTAREA' && !$(target).attr("readonly"))) {
				if ((target.type.toUpperCase() == "RADIO") || (target.type.toUpperCase() == "CHECKBOX")) {
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		}
	});
	$('#ordersystemtable td').addClass('tdclass'); // 增加td样式
	$('#logartlabe').hide();
	$('#logrt').hide();
	$("#goldvalue").hide();
	$("#saleman").focus();
	$("#goldvaluelabel").hide();
	$("#personcost").hide();
	$("#personcostlabel").hide();
	$("#showmatnrinfo").hide();
	$("#showoptinfo").hide();
	$('#opterator').val(opterator);
	// $('#saleman').text(opterator);
	if (opmode == "view") {
		$('input').attr('disabled', true);
		$('select').attr('disabled', true);
		$("#registertd").hide();
	} else if (opmode == "ADD") {
		getsaleman("", "ADD");
	}
	if (ordertype == "") {
		getOderType();
	} else { // 根据用户选择订单类型
		getUserOderType(ordertype);
		checkordertype(ordertype);
	}
	getsWerksSaleFlag(WERKS);
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
		$.getJSON("longhaul/orderSystem.ered?reqCode=getOrderType&postType=1&werks=" + WERKS + "", function(data) {
			var auart = "";
			$.each(data, function(key, val) {
				var selected = val.pzdm == "ZOR1" ? "selected" : "";
				$("#ordertype").append($("<option value=" + val.pzdm + " " + selected + ">" + val.pzdm + val.pzmc + "</option>"));
			});
			getOrderReason("ZOR1");
		});
	}

	function getUserOderType(ordertype) {
		$.getJSON("longhaul/orderSystem.ered?reqCode=getOrderType&postType=1&werks=" + WERKS + "&ordertype=" + ordertype, function(data) {
			var auart = "";
			$.each(data, function(key, val) {
				var selected = val.pzdm == ordertype ? "selected" : "";
				$("#ordertype").append($("<option value=" + val.pzdm + " " + selected + ">" + val.pzmc + "</option>"));
				$("#orderhead").text(val.pzmc);
			});
			getOrderReason(ordertype);
			$("#ordertypetd").hide();
			$("#ordertypeoptiontd").attr("colspan", "2");
		});
	}

	function getsWerksSaleFlag(werks) {
		$.ajax({
			url : "longhaul/orderSystem.ered?reqCode=getsWerksSaleFlag&postType=1&werks=" + werks + "",
			success : function(data) {
				werkssaleflag = data;

			}
		});
	}

	function getOrderReason(auart) {
		$.getJSON("longhaul/orderSystem.ered?reqCode=getOrderReason&postType=1", {
			auart : auart
		}, function(data) {
			$("#orderreason").empty();
			$.each(data, function(key, val) {
				selected = "";
				_ordertype = $("#ordertype").val(); // 订单类型字段
				if (_ordertype == "ZRE1" || _ordertype == "ZRE2" || _ordertype == "ZOR4") {
					if (val.xh == "009") {
						selected = "selected";
					}
				}
				$("#orderreason").append($("<option value=" + val.xh + " " + selected + " >" + val.gmyy + "</option>"));
			});
		});
	}

	function getsaleman(noneselectedtext, mode) {
		$.getJSON("longhaul/orderSystem.ered?reqCode=getsaleman&postType=1&random=" + Math.random(), {
			werks : WERKS
		}, function(data) {
			$.each(data, function(key, val) {
				noneselectedtext = mode == "ADD" ? key == 100000 ? val.yyy : noneselectedtext : noneselectedtext; // 默认不需要选择
				noneselectedtext = mode == "ADD" ? "请选择营业员" : noneselectedtext;
				selectedadd = mode == "ADD" ? key == 100000 ? "selected" : "" : "";
				selectededit = mode == "EDIT" ? noneselectedtext.indexOf(val.yyy) > -1 ? "selected" : "" : "";
				selected = selectedadd == "" ? selectededit : selectedadd;
				$("#saleman").append($("<option value=" + val.yyy + " " + selected + ">" + val.yyy + "</option>"));
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
		if (ordertype == "ZOR4") { // 退
			$('#logartlabe').show();
			$('#logrt').show().addClass("inputattention");
			$('#swaptype').show().addClass("inputattention")
			$("#matnr").show();
			$("#charglabel").html("条&nbsp;&nbsp;&nbsp;&nbsp;码: ");
			$("#matnrlabel").show();
			$("input[type=radio][name=chargtype][value=charg]").attr("checked", "checked");
		} else if (ordertype == "ZRE2" || ordertype == "ZKL") { // 赠品类型
			$("input[type=radio][name=chargtype][value=gift]").attr("checked", "checked");
			$('#logartlabe').hide();
			$('#logrt').hide();
			$('#swaptype').hide();
			$("#matnr").hide();
			$("#charglabel").html("赠品料号: ");
			$("#matnrlabel").hide();
		} else if (ordertype == "ZOR8") { // 赠品销售
			$("#matnr").hide();
			$("#charglabel").html("赠品料号: ");
			$("#matnrlabel").hide();
			$('#logartlabe').hide();
			$('#logrt').hide();
			$('#swaptype').hide();
		} else if (ordertype == "ZRE1") { // 销售退货
			$('#logartlabe').show();
			$('#logrt').show().addClass("inputattention");
			$('#swaptype').hide();
		} else {
			$('#logartlabe').hide();
			$('#logrt').hide();
			$('#swaptype').hide();
			$("#matnr").show();
			$("#charglabel").html("条&nbsp;&nbsp;&nbsp;&nbsp;码: ");
			$("#matnrlabel").show();
			$("input[type=radio][name=chargtype][value=charg]").attr("checked", "checked");
		}
		getOrderReason(ordertype);
		$('#salesorderid').val("");
		$("#kunnr").val("");
		$("#vipid").val("");
		$("#kunnrjf").val("");
		$("#tel").val("");
		$("#vipname").text("");
		// $("#matnr").show();
	}
	$('#ordertime').val(getTodyay("-"));

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
			
			if(ordertype == "ZOR4"){
				if($("#swaptype").val()=="ZOUT"){
					$("#logartlabe").hide();
					$("#logrt").hide();
				}
			}
			
		}
	}).autocomplete({
		source : function(request, response) {
			$.ajax({
				url : "longhaul/orderSystem.ered?reqCode=getVipRecord&option=auto&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
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
					response($.map(data, function(item) {
						var vipid = item.hykh == null ? "" : item.hykh;
						var tel = item.sj == null ? "" : item.sj;
						var kunnr = item.hybh == null ? "" : item.hybh;
						var vipname = item.hyxm == null ? "" : item.hyxm;
						var info = {
							label : kunnr,
							kunnr : kunnr,
							vipid : vipid,
							tel : tel,
							vipname : vipname
						};
						return info;
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
	function kunnrbyuser() {
		$.ajaxSetup({
			error : function(x, e) {
				jAlert("访问服务器错误!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
				});
				return false;
			}
		});
		$.ajax({
			url : "longhaul/orderSystem.ered?reqCode=getVipRecord&option=user&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
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
					var sfzf = item.sfzf;
					//alert($("#ordertype").val());
					//alert(sfzf);
					if($("#ordertype").val()=='ZKL' && (sfzf=='01' || sfzf =='02')){
						jAlert('该会员是冻结状态，不能进行免费兑换!', '提示', function(r) {
							$("#kunnr").focus();
							$("#vipid").val("");
							$("#kunnr").val("");
							$("#kunnrjf").val("");
							$("#vipname").text("");
						});
						return;
					} else if(sfzf=='02'){
							jAlert('该会员是全冻结状态，不能进行销售!', '提示', function(r) {
								$("#kunnr").focus();
								$("#vipid").val("");
								$("#kunnr").val("");
								$("#kunnrjf").val("");
								$("#vipname").text("");
							});
						
						return;
					}
					
					var info = {
						label : kunnr,
						kunnr : kunnr,
						vipid : vipid,
						tel : tel,
						vipname : vipname
					};
					$("#kunnr").val(info.kunnr);
					$("#vipid").val(info.vipid);
					if ($.trim($("#regname").val()) == "")
						$("#vipname").text(info.vipname);

					if (info.vipname != "" && info.vipname != null) {
						$("#vipname").text(info.vipname);
						$("#regname").val("");
					}
					getkunnrjf(info.kunnr); // 开始调用积分
					$("#tel").val(info.tel);
					$("#charg").attr("disabled", false);
					$("#charg").attr("readOnly", false);
					$("#kunnr").removeClass("inputkey").addClass("inputnom");
					$("#charg").addClass("inputkey");
					$("#charg").focus();
					if ($("#regname").val() == "")
						$("#registertd").hide();
					else
						$("#registertd").val("修改");
				});
			}
		});
	}
	function kunnrbyuserfornewuser() {
		$.ajaxSetup({
			error : function(x, e) {
				jAlert("访问服务器错误!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
				});
				return false;
			}
		});
		$.ajax({
			url : "longhaul/orderSystem.ered?reqCode=getVipRecordForNewUser&option=user&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
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
					var info = {
						label : kunnr,
						kunnr : kunnr,
						vipid : vipid,
						tel : tel,
						vipname : vipname
					};
					$("#kunnr").val(info.kunnr);
					$("#vipid").val(info.vipid);
					if ($.trim($("#regname").val()) == "")
						$("#vipname").text(info.vipname);

					if (info.vipname != "" && info.vipname != null) {
						$("#vipname").text(info.vipname);
						$("#regname").val("");
					}
					getkunnrjf(info.kunnr); // 开始调用积分
					$("#tel").val(info.tel);
					$("#charg").attr("disabled", false);
					$("#charg").attr("readOnly", false);
					$("#kunnr").removeClass("inputkey").addClass("inputnom");
					$("#charg").addClass("inputkey");
					$("#charg").focus();
					if ($("#regname").val() == "")
						$("#registertd").hide();
					else
						$("#registertd").val("修改");
				});
			}
		});
	}
	$("#vipid").keydown(function(event) {
		if (event.keyCode == 13) {
			var _checkrownum = $("#tablecontent tr").length - 2;
			if (_checkrownum > 0) {

			}
			if ($.trim($("#vipid").val()) != "") {
				$("#vipid").autocomplete("close");
				getvipidbyuser();
			}
		}
	}).autocomplete({
		source : function(request, response) {
			$.ajax({
				url : "longhaul/orderSystem.ered?reqCode=getVipRecord&option=auto&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
				dataType : "json",
				data : "vipid=" + $("#vipid").val() + "",
				success : function(data) {
					if (data == "") {
						jAlert('输入卡号或者电话号码不存在!!', '提示', function(r) {
							$("#vipid").focus();
							$("#vipid").val("");
							$("#kunnr").val("");
							$("#kunnrjf").val("");
							$("#vipname").text("");
						});
					}
					response($.map(data, function(item) {
						var vipid = item.hykh == null ? "" : item.hykh;
						var tel = item.sj == null ? "" : item.sj;
						var kunnr = item.hybh == null ? "" : item.hybh;
						var info = {
							label : kunnr,
							kunnr : kunnr,
							vipid : vipid,
							tel : tel
						};
						return {
							label : "客户号:" + kunnr + "VIPID:" + vipid + "电话:" + tel + ""
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

	function getvipidbyuser() {
		//$("#charg").focus();
		$.ajaxSetup({
			error : function(error, e) {
				jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
				});
				return false;
			}
		});
		tempvipid = $("#vipid").val();
		_kunnr = tempvipid.substring(tempvipid.indexOf("客户号:") + 4, tempvipid.indexOf("VIPID:"));
		_kunnr = tempvipid.indexOf("客户号:") > -1 ? _kunnr : tempvipid;
		viptype = tempvipid.indexOf("客户号:") > -1 ? "kunnr=" : "vipid=";
		$.ajax({
			url : "longhaul/orderSystem.ered?reqCode=getVipRecord&option=user&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
			dataType : "json",
			data : viptype + _kunnr + "",
			success : function(data) {
				if (data == "") {
					jAlert('输入卡号或者电话号码不存在!', '提示', function(r) {
						$("#vipid").focus();
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
					var info = {
						label : kunnr,
						kunnr : kunnr,
						vipid : vipid,
						tel : tel
					};
					$("#vipid").val(vipid);
					$("#kunnr").val(kunnr);
					$("#tel").val(tel);
					$("#vipname").text(vipname);
					$("#charg").attr("disabled", false);
					$("#charg").attr("readOnly", false);
					getkunnrjf(kunnr); // 开始调用积分
					// $("#kunnr").removeClass("inputkey")
					$("#kunnr").removeClass("inputkey").addClass("inputnom");
					$("#charg").addClass("inputkey");
					$("#charg").focus();
				});
			}
		});
		$("#vipid").autocomplete({
			disabled : false
		});
	}

	$("#charg").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($.trim($("#charg").val()) != "") {
				$("#charg").autocomplete("close");
				getchargbyuser();
			}
		}
	}).keypress(function(event) {

	}).autocomplete({
		source : function(request, response) {
			_ordertype = $("#ordertype").val();
			_chargtype = $('input:radio[name="chargtype"]:checked').val();
			_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
			_charg = $("#charg").val().toUpperCase();
			$.ajax({
				url : "longhaul/orderSystem.ered?reqCode=getpcxx&postType=1&ordertype=" + _ordertype + "&option=auto&werks=" + WERKS + "&random=" + Math.random() + "",
				dataType : "json",
				data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype,
				success : function(data) {
					if (data == "") {
						var chargalertstr = "输入条码不存在!";
						chargalertstr = _chargtype == "gift" ? "输入物料编码不存在!" : chargalertstr
						jAlert(chargalertstr, '提示', function(r) {
							clearcharginfo();
						});
					}
					response($.map(data, function(item) {
						var cpbm = item.cpbm == null ? "" : item.cpbm; // 批次
						var matnr = item.bkbh == null ? "" : item.bkbh; // 物料号
						var zhlhx = item.plmc == null ? "" : item.plmc; // 产品名称
						var ztjtj = item.bqj == null ? 0 : item.bqj; // 标签价
						var realprice = item.sxj == null ? 0 : item.sxj; // 售价
						var goldweight = item.jlzl == null ? 0 : item.jlzl; // 金重
						var gemweight = item.zszl == null ? 0 : item.zszl; // 石重
						var certificateno = item.zsh == null ? "" : item.zsh; // 证书号
						var personcost = item.xsgf == null ? 0 : item.xsgf; // 工费
						var pcimage = item.zp == null ? "" : item.zp; // 照片
						var sjczbm = item.sjczbm == null ? "" : item.sjczbm; // 类别('K90'
						// ,'P00')
						var zplb = item.zplb == null ? "" : item.zplb; // 赠品类别('ZP'
						// ,'ZL')
						cpbm = $.trim(cpbm);
						var info = {
							label : cpbm,
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
							zplb : zplb
						};
						// return info;
						return {
							label : cpbm + "->" + zhlhx
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
	// 用户回车选择批次事件
	function getchargbyuser() {
		// $("#number").focus();
		tempchargNo = $("#charg").val();
		_mycharg = tempchargNo.substring(0, tempchargNo.indexOf("->"));
		_ordertype = $("#ordertype").val();
		_chargtype = $('input:radio[name="chargtype"]:checked').val();
		_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
		_charg = tempchargNo.indexOf("->") > 0 ? _mycharg : tempchargNo;
		_charg = _charg.toUpperCase();
		$("#charg").val(_charg);
		$.ajaxSetup({
			error : function(x, e) {
				jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
				});
				return false;
			}
		});
		$.ajax({
			url : "longhaul/orderSystem.ered?reqCode=getpcxx&option=user&ordertype=" + _ordertype + "&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
			dataType : "json",
			data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype,
			success : function(data) {
				if (data == "") {
					var chargalertstr = "输入条码不存在!";
					chargalertstr = _chargtype == "gift" ? "输入物料编码不存在!" : chargalertstr
					jAlert(chargalertstr, '提示', function(r) {
						clearcharginfo();
					});
				}
				$.map(data, function(item) {
					var cpbm = item.cpbm == null ? "" : item.cpbm; // 批次
					var matnr = item.bkbh == null ? "" : item.bkbh; // 物料号
					var zhlhx = item.plmc == null ? "" : item.plmc; // 产品名称
					var ztjtj = item.bqj == null ? 0 : item.bqj; // 标签价
					var realprice = item.sxj == null ? 0 : item.sxj; // 售价
					var goldweight = item.jlzl == null ? 0 : item.jlzl; // 金重
					var gemweight = item.zszl == null ? 0 : item.zszl; // 石重
					var certificateno = item.zsh == null ? "" : item.zsh; // 证书号
					var personcost = item.xsgf == null ? 0 : item.xsgf; // 工费
					var pcimage = item.zp == null ? "" : item.zp; // 照片
					var sjczbm = item.sjczbm == null ? "" : item.sjczbm; // 类别('K90'
					// ,'P00')
					var zplb = item.zplb == null ? "" : item.zplb; // 赠品类别('ZP'
					// ,'ZL')
					var usedorderid = item.usedorderid == null ? "" : item.usedorderid; // 批次是否可用
					
					var compImage = item.compImage == null ? "" : item.compImage;//公司信息
					
					cpbm = $.trim(cpbm);
					var info = {
						label : cpbm,
						compImage : compImage,
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
						usedorderid : usedorderid
					};
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
		$("#matnr").val(charginfo.matnr);
		$("#zhlhx").val(charginfo.zhlhx);
		$("#ztjtj").val(charginfo.ztjtj);
		$("#realprice").val(charginfo.realprice); // 实收
		$("#goldweight").val(charginfo.goldweight); // 金重
		$("#gemweight").val(charginfo.gemweight); // 石重
		$("#certificateno").val(charginfo.certificateno);
		$("#realTagPrice").val(charginfo.ztjtj);
		usedorderid = charginfo.usedorderid;
		var sjczbm = charginfo.sjczbm;
		if (sjczbm == "K90") {// 调用黄金 K90是克卖
			getgoldprices(WERKS, $("#ordertime").val(), sjczbm);
			$("#goldvalue").addClass("inputattention");
			$("#personcost").addClass("inputattention");
			$("#ztjtj").val("0");
			goldtextdisplay();
		} else if (sjczbm == "P00") {
			if (werkssaleflag == "X") { // 按件卖
			} else { // 克卖
				getgoldprices(WERKS, $("#ordertime").val(), sjczbm);
				$("#goldvalue").addClass("inputattention");
				$("#personcost").addClass("inputattention");
				$("#ztjtj").val("0");
				goldtextdisplay();
			}
		}
		var zplb = charginfo.zplb;
		if (zplb == "ZP") { // 增品
			$("#logrt").val("0011");
		} else if (zplb == "ZL") { // 增链
			$("#logrt").val("0005");
		}
		$("#personcost").val(charginfo.personcost);
		_pcimage = charginfo.pcimage;
		_pcimage = _pcimage == null || _pcimage == "" ? (compImage=="VENTI" ? "vt.jpg" : "CHJ-LOGO.JPG" ) : _pcimage;
		
		$(".tooltip").attr("href", chargimgpath + _pcimage);
		$(".tooltip").attr("title", charginfo.zhlhx);
		$("#pcimage").attr("src", chargimgpath + _pcimage);
		$("#pcimage").attr("alt", _pcimage);
		$("#pcimage").load(function() {
		}).error(function() {
			if(compImage=='VENTI'){
				$("#pcimage").attr("src", "longhaul/order/images/vt.jpg");
				$("#pcimage").attr("alt", 'vt.jpg');
				$(".tooltip").attr("title", "产品图片");
			}else{
				$("#pcimage").attr("src", "longhaul/order/images/CHJ-LOGO.JPG");
				$("#pcimage").attr("alt", 'CHJ-LOGO.JPG');
				$(".tooltip").attr("title", "产品图片");
			}
			//$(".tooltip").attr("href", "longhaul/order/images/CHJ-LOGO.JPG");
		});

		$("#number").val("1");
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
		$("#showmatnrinfo").show();
		$("#showoptinfo").show();
	}
	// 清理批次相关信息
	function clearcharginfo() {
		$("#charg").focus();
		$("#charg").val("");
		$("#matnr").val("");
		$("#zhlhx").val("");
		$("#ztjtj").val("");
		$("#realTagPrice").val("");
		$("#realprice").val("");
		$("#goldweight").val("");
		$("#gemweight").val("");
		$("#certificateno").val("");
		$("#personcost").val("");
		$("#goldvalue").val("0");
		$("#charg").addClass("inputkey");
		$("#charg").focus();
	}

	// 换入换出项目
	$("#swaptype").keydown(function(event) {
		if (event.keyCode == 13) {
			$("#number").addClass("inputkey");
			$("#charg").removeClass("inputkey");
			$("#number").focus();
		}
	});

	// 在数量上回车事件
	$("#number").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($("#showmatnrinfo").css("display") == "none") {
				$("#charg").focus();
			} else {
				_ordertype = $("#ordertype").val();
				if (_ordertype == "ZKL") {
					_kunnrjf = $("#kunnrjf").val();
					_giftjf = $("#giftjf").text();
					if (Number(_giftjf) > Number(_kunnrjf)) {
						jAlert("客户积分不够兑换商品!当前客户积分:" + _kunnrjf + "商品所需积分:" + _giftjf, '提示', function(r) {
						});
						return false;
					}
				}
				if (!checkPostNum(this)) {
					$("#number").focus();
					return;
				}
				_chargtype = $('input:radio[name="chargtype"]:checked').val();

				if (_chargtype == "charg" && _ordertype == "ZOR1") {
					if (usedorderid != "") {
						jAlert($("#charg").val() + "已存在于订单" + usedorderid + "不能再次加入订单!", '提示', function(r) {
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
					_price = (Number(_goldvalue) * _goldweight) + Number(_personcost);
					_realprice = $("#realprice").val() * Number($("#number").val()); // 实际价格
					_price = _price.toFixed(2);
					setpricebychargtype(_price, _realprice);
				} else {
					_price = $("#ztjtj").val() * Number($("#number").val()); // 价格=标签价格*数量
					_realprice = $("#realprice").val() * Number($("#number").val()); // 实际价格
					_price = _price.toFixed(2);
					setpricebychargtype(_price, _realprice);
				}
				if ((_ordertype == "ZOR4" && $("#swaptype").val() == "ZIN" && _chargtype == "charg")|| (_ordertype == "ZRE1" && _chargtype == "charg")) {
					$("#number").removeClass("inputkey");
					$("#logrt").show();
					$("#logrt").focus();
				} else {
					$("#discount").addClass("inputkey");
					$("#number").removeClass("inputkey");
					$("#logrt").hide();
					$("#discount").val(100);
					$("#discount").focus();
				}
			}
		}
	});

	$("#discount").keydown(function(event) {
		if (event.keyCode == 13) {
			_discount = $("#discount").val();
			if (_discount != "") {
				$("#discount").removeClass("inputkey");
				$("#realprice").addClass("inputkey");
				$("#realprice").focus();
			}
		}
	});

	$("#logrt").keydown(
			function(event) {
				if (event.keyCode == 13) {

					if ($("#showmatnrinfo").css("display") == "none") {
						$("#charg").focus();
					} else {

						if ($("#swaptype").val() == "ZIN" || _ordertype == "ZRE1") { // 如果换入需要输入库位,换出不需要库位
							// 0001 0002 0003 0004 0006 0008
							var chargtype = $('input:radio[name="chargtype"]:checked').val();
							if ((chargtype == "charg" && this.value != "" && (this.value == "0001" || this.value == "0002" || this.value == "0003" || this.value == "0004" || this.value == "0006" || this.value == "0008"))
									|| (chargtype == "gift" && this.value != "" && (this.value == "0005" || this.value == "0011"))) {
								$("#realprice").addClass("inputkey");
								$("#number").removeClass("inputkey");
								$("#realprice").focus();
							} else {
								jAlert("请正确输入库位!", '提示', function(r) {
									$("#logrt").focus();
								});
								return false;
							}
						} else {
							$("#realprice").addClass("inputkey");
							$("#number").removeClass("inputkey");
							$("#realprice").focus();
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
		if (_ordertype == "ZRE2") {
			$("#receivable").val(_price);
			$("#realprice").val(_realprice);
		} else if (_ordertype == "ZOR4") {
			if (_swaptype == "ZIN" && _chargtype == "charg") {
				$("#receivable").val(_price);
				$("#realprice").val(_realprice);
			} else if (_swaptype == "ZOUT" && _chargtype == "charg") {
				$("#receivable").val(_price);
				$("#realprice").val(_price);
			} else {
				$("#receivable").val(0);
				$("#realprice").val(0);
				$("#ztjtj").val(0); // 标签价格
			}
		} else if (_chargtype == "charg") {
			$("#receivable").val(_price);
			$("#realprice").val(_price);
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
	$('#realprice').keyup(function(event) {
		if (checkNum(this)) {
			_checkuservalue = $('#realprice').val();
			var checkdigit = _checkuservalue.substring(_checkuservalue.indexOf('.') + 1, _checkuservalue.length);
			_check = checkdigit.length > 2 && _checkuservalue.indexOf('.') > 0
			if (_check) {
				alert("请精确到小数据后两位!");
				$(this).focus();
				$('#realprice').val(Number(_checkuservalue).toFixed(2));
			}
			if (Number($("#receivable").val()) == 0) {
				$("#discount").val(100);
			} else {
				_discount = (this.value / $("#receivable").val()) * 100 > 100 ? 100 : (this.value / $("#receivable").val()) * 100 ;
				_discount = _discount.toFixed(0);
				if (Number($("#goldvalue").val()) != 0) { // 黄金 = 只能扣除加工费用
					checkprice = Number(tempprice) - Number(this.value);
					checkprice = temppersoncost - checkprice;
					$("#personcost").val(checkprice);
					$("#discount").val(_discount);
				} else {
					$("#discount").val(_discount);
				}
			}
		}
	});
	
	
	$("#swaptype").change(function(){
		if($(this).val() == "ZOUT"){
			$("#logartlabe").hide();
			$("#logrt").hide();
		}else{
			$("#logartlabe").show();
			$("#logrt").show();
		}
	});
	

	$("#realprice").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($('#charg').val() == "") {
				alert("请录入商品信息!");
				return;
			}
			
			if(_ordertype == "ZRE1"){
				if($("#logrt").val() == ""){
					$("#logrt").focus();
					alert("请输入库位！");
					return;
				}
			}
			
			if(_ordertype == "ZOR4" && $("#swaptype").val()=="ZIN"){
				if($("#logrt").val() == ""){
					$("#logrt").focus();
					alert("请输入库位！");
					return;
				}
			}
			
			
			if(opmode=="EDIT"){
				$("#orderprint").val("<--先付款").attr('disabled', true);
			}
			
			if ($('input:radio[name="chargtype"]:checked').val() !== "gift") {
				if (Number($(this).val()) == 0) {
					alert("请正确输入金额!");
					return false;
				} else {
					btnAddRow();
				}
			} else {
				btnAddRow();
			}

		}
	});

	var upbynumber = 1; // 上屋记录
	var upgiftnumber = 1; // 上屋礼品记录
	var toplevelnumber = 1; // 顶屋记录
	var addrownumber = 1; // 记录增加行号到那行
	var updategifid = ""; // 得到赠品的ID 用于记录有多少赠品增加 了
	var updatechargid = ""; // 得到增加产品所在ID
	
	
	function btnAddRow() {
		var upnumber = 1;
		var style = "";
		var chargtype = $('input:radio[name="chargtype"]:checked').val();
		var rownum = $("#tablecontent tr").length - 2;
		var toplevelstr = ""; // 用于保存上存文本
		var upnumbertext = "";// 记录上存文体
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (chargtype == "charg") {
			upnumber = Number(toplevelnumber) * 10;
			toplevelnumber = toplevelnumber + 1;
			style = "tdtoplevel";
			upnumbertext = "00";
			toplevelstr = "<div id=leveladdgifts" + upnumber + " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品
		} else if (chargtype == "gift") {
			var gifusedid = $("#" + updategifid).text(); // 礼品最大填充了多少个
			var usedgifnumber = gifusedid;
			usedgifnumber = (usedgifnumber - (parseInt(usedgifnumber / 10) * 10));// 产品下现在多少礼品
			rownum = Number(addrownumber) + Number(usedgifnumber);
			var newgifs = Number(gifusedid) + 1
			// upnumber = Number(upbynumber) +upgiftnumber;
			style = "tdgiftlevel";
			upnumber = Number(gifusedid) + 1;
			$("#" + updategifid).text(newgifs);
			upnumbertext = $("#" + updatechargid).text(); // 得到上存ID
			var giftnumber = 0;
			if (opmode == "EDIT") {
				$("#tablecontent tr").each(function() {
					nextchildobject = $(this);
					childposnrnumber = nextchildobject.find("div[id^='upnumberlevel']").text(); // 找孩子结点编号
					if (childposnrnumber == upnumbertext) {
						giftnumber = giftnumber + 1;
					}
				});
				rownum = Number(addrownumber) + Number(giftnumber);
			}
			if (_ordertype == "ZRE2" || _ordertype == "ZKL") { // 赠品的特殊处理
				upnumber = upgiftnumber * 10;
				rownum = $("#tablecontent tr").length - 2; // 赠品固定在后面插入
				upnumbertext = "00";
			}
			// rownum=updaterow-1;
		}
		var ordertItemype = "<div id=ordertItemype" + rownum + "></div>";
		var logrt = "<div id=logrt" + rownum + ">" + $("#logrt").val() + "</div>";
		_realprice = Number($("#realprice").val());
		_total = Number($("#realprice").val());
		_ztjtj = $("#ztjtj").val(); // 标签价格
		_realTagPrice = $("#realTagPrice").val();
		_number = $("#number").val(); // 数量
		ordertItemypestr = "";
		switch (_ordertype) {
		case "ZOR4": // 换货订单类型
			_swaptype = $("#swaptype").val();
			if (chargtype == "charg") {
				if (_swaptype == "ZIN") {
					ordertItemypestr = "ZIN";
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
			logrt = "<div id=logrt" + rownum + ">" + $("#logrt").val() + "</div>";
			if ($("#swaptype").val() == "ZIN") {
				_realprice = (0 - Number(_realprice));
				_total = (0 - Number(_total));
				_ztjtj = (0 - Number(_ztjtj));
				_number = (0 - Number(_number));
			}
			break;
		case "ZOR1":
			ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTA1";
			break;
		case "ZOR3":
			ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTA1";
			break;
		case "ZOR7":
			ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTA1";
			break;
		case "ZOR8":
			ordertItemypestr = chargtype == "charg" ? "ZTAN" : "ZTA1";
			break;
		case "ZRE1":
			ordertItemypestr = chargtype == "charg" ? "ZREN" : "ZRE1";
			break;
		case "ZRE2":
			ordertItemypestr = chargtype == "charg" ? "ZREN" : "ZRE1";
			break;
		case "ZKL":
			ordertItemypestr = chargtype == "charg" ? "ZKLN" : "ZKLN";
			break;
		default:
			break;
		}
		ordertItemypeshow = ordertItemypeshowText(ordertItemypestr);
		ordertItemype = "<div id=ordertItemype" + rownum + " style='display:none'>" + ordertItemypestr + "</div>";
		var delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
		var row = "<div id=" + rownum + ">" + delimage + "</div>";
		var posnrnumber = "<div  id=posnrnumber" + rownum + "> " + upnumber + " </div>" + "<div id=upnumber" + chargtype + rownum + " style='display:none'>" + upnumber + "</div>" + toplevelstr + "";
		var upumber = "<div id=upnumberlevel" + rownum + ">" + upnumbertext + "</div>";

		var _tempcharg = "", _tempmatnr = "";
		if (chargtype == "charg" && _ordertype != "ZOR8") {
			_tempcharg = $("#charg").val();
			_tempmatnr = $("#matnr").val();
		} else {
			_tempcharg = "";
			_tempmatnr = $("#charg").val();
		}

		var charg = "<div id=charg" + rownum + ">" + _tempcharg.toUpperCase() + "&nbsp;</div>"; // 批次
		var matnr = "<div id=matnr" + rownum + ">" + _tempmatnr.toUpperCase() + "&nbsp; </div>"; // 物料

		var zhlhx = "<div id=zhlhx" + rownum + " class='divmatnrdesc'>" + $("#zhlhx").val() + "&nbsp; </div>"; // 商品ID
		var uniteprice = "<div id=uniteprice" + rownum + ">" + Number($("#ztjtj").val()).toFixed(2) + "&nbsp;</div>"; // 单价
		var number = "<div id=number" + rownum + ">" + _number + "</div>"; // 数量
		var personcost = "<div id=personcost" + rownum + ">" + Number($("#personcost").val()).toFixed(2) + "</div>"; // 人工费用
		var goldweight = "<div id=goldweight" + rownum + ">" + Number($("#goldweight").val()).toFixed(3) + "</div>"; // 金种
		var goldvalue = "<div id=goldvalue" + rownum + " style='display:none'>" + $("#goldvalue").val() + "</div>"; // 金种
		
		var goldrealprice = "<div id=goldrealprice" + rownum + ">" + (Number($("#personcost").val())+Number($("#goldweight").val())*Number($("#goldvalue").val())).toFixed(2) + "&nbsp;</div>"; //金价初始总价
		
		var receivable = "<div id=receivable" + rownum + ">" + Number(_total).toFixed(2) + "</div>"; // 合计
		var ztjtj = "<div id=ztjtj" + rownum + ">" + Number(_ztjtj).toFixed(2) + "</div>"; // 标签价格
		var realTagPrice = "<div id=realTagPrice" + rownum + ">" + Number(_realTagPrice).toFixed(2) + "</div>"; // 标签价格
		var realprice = "<div id=realprice" + rownum + " >" + Number(_realprice).toFixed(2) + "</div>"; // 实销价格
		var discount = "<div id=discount" + rownum + ">" + $("#discount").val() + "</div>"; // 折扣
		
		var imgpath = $("#pcimage").attr("src");
		var imgalt = $("#pcimage").attr("alt");
		var imaghref = "<a href=" + imgpath + " class='tooltip' title=" + $("#zhlhx").val() + "(" + $("#ztjtj").val() + ")>";
		var pcimage = "<div id=pcimage" + rownum + ">" + imaghref + "<img id=pcimagesrc  alt='" + imgalt + "' src=" + imgpath + " height='40' width='38'/></a></div>";
		// 设置合计

		$("#totalprice").text((Number($("#totalztjtj").text()) + Number($("#ztjtj").val())).toFixed(2)); // 总的标签价格
		$("#totalnumber").text((Number($("#totalnumber").text()) + Number(_number)).toFixed(0)); // 总数量
		$("#toalpersoncost").text((Number($("#toalpersoncost").text()) + Number($("#personcost").val())).toFixed(2)); // 人工费用
		$("#totalgoldweight").text((Number(Number($("#totalgoldweight").text()) + Number($("#goldweight").val()))).toFixed(3)); // 总金种
		if (chargtype == "charg" || _ordertype == 'ZRE2') {
			$("#total").text((Number($("#total").text()) + _total).toFixed(2)); // 
			$("#totalztjtj").text((Number($("#totalztjtj").text()) + Number(_ztjtj)).toFixed(2)); // 
			$("#totalrealprice").text((Number($("#totalrealprice").text()) + _realprice).toFixed(2)); // 实际销售合计
		}
		$("#goldvalue").removeClass("inputattention");
		$("#personcost").removeClass("inputattention");
		$("#charg").addClass("inputkey");
		$("#realprice").removeClass("inputkey");
		$("#charg").focus();
		// 将输入设置为空
		clearchargre();
		var row = "<tr><td class=" + style + ">" + row + "</td>";
		row = row + "<td class=" + style + ">" + posnrnumber + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + upumber + "</td>";
		row = row + "<td class=" + style + ">" + charg + "</td>";
		row = row + "<td class=" + style + ">" + matnr + "</td>";
		row = row + "<td class=" + style + ">" + zhlhx + "</td>";
		row = row + "<td class=" + style + " align='center'>" + pcimage + "</td>";
		row = row + "<td style='display:none' class=" + style + " align='right'>" + uniteprice + "</td>";
		row = row + "<td class=" + style + " align='right'>" + number + "</td>";
		goodtdshow = $("#thpersoncost").css("display") == "none" ? "display:none" : "";

		row = row + "<td  id='personcosttd" + rownum + "'  class=" + style + "  align='right' style=" + goodtdshow + ">" + personcost + "</td>";
		row = row + "<td  id='goldtr" + rownum + "'  class=" + style + "  align='right' style=" + goodtdshow + ">" + goldweight + goldvalue + "</td>";
		row = row + "<td style='display:none' class=" + style + " align='right'>" + receivable + "</td>";
		
		row = row + "<td style='display:none' class=" + style + " align='right'>" + goldrealprice + "</td>";
		
		row = row + "<td class=" + style + " align='right'>" + ztjtj + "</td>";
		row = row + "<td style='display:none' class=" + style + " align='right'>" + realTagPrice + "</td>";
		
		row = row + "<td class=" + style + " align='right'>" + realprice + "</td>";
		row = row + "<td class=" + style + ">" + discount + "</td>";
		row = row + "<td class=" + style + ">" + ordertItemype + "" + ordertItemypeshow + "</td>";
		row = row + "<td class=" + style + " id='logrttd" + rownum + "' >" + logrt + "</td>";
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
	}

	$("#salesorderid").keydown(function(event) {
		if (event.keyCode == 13) {
			creatTablehead($.trim($(this).val()));
		}

	});
	// 修改的时候创建ROW
	function creatTableRow(salesorderid) {
		$.getJSON("longhaul/orderSystem.ered?reqCode=getOrderItem&postType=1", {
			salesorderid : salesorderid,
			random : Math.random()
		}, function(data) {
			cleartable(); // 先清除table内容
			toplevelnumber = 1;
			upgiftnumber = 1;
			$.each(data, function(key, val) {
				// $("#ordertype").append($("<option value="+val.pzdm+"
				// "+selected+">"+val.pzmc+"("+val.pzdm+")</option>"));
				var style = "";
				_chargtype = val.upsalesorderitem == "00" ? "charg" : "gift";
				_ordertype = $("#ordertype").val(); // 订单类型字段
				style = val.upsalesorderitem == "00" && (_ordertype != "ZRE2" && _ordertype != "ZKL") ? "tdtoplevel" : "tdgiftlevel";
				var delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
				var row = "<div id=" + key + ">" + delimage + "</div>";
				ordertItemype = "<div id=ordertItemype" + key + " style='display:none'>" + val.orderitemtype + "</div>";
				storagelocation = val.storagelocation == null ? "" : val.storagelocation;
				_logrt = "<div id=logrt" + key + ">" + storagelocation + "</div>";
				delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
				// row="<div id="+key+">"+delimage+"</div>";
				lowerlevel = val.lowerlevelsnumber == null ? "" : val.lowerlevelsnumber;
				if (val.lowerlevelsnumber != null) { // 最大号
					toplevelnumber = Number(val.salesorderitem) / 10 + 1;
					// toplevelnumber =toplevelnumber+1;
				}
				toplevelstr = "<div id=leveladdgifts" + val.salesorderitem + "  style='display:none'>" + lowerlevel + "</div>";
				posnrnumber = "<div  id=posnrnumber" + key + "> " + val.salesorderitem + " </div>" + "<div id=upnumber" + _chargtype + key + "  style='display:none'>" + val.salesorderitem + "</div>" + toplevelstr + "";
				upumber = "<div id=upnumberlevel" + key + ">" + val.upsalesorderitem + "</div>";
				batchnumber = val.batchnumber == null ? "" : val.batchnumber;
				_charg = "<div id=charg" + key + ">" + batchnumber + "&nbsp;</div>"; // 批次
				var materialnumber = val.materialnumber == null || val.materialnumber == "null" ? "" : val.materialnumber;
				_matnr = "<div id=matnr" + key + ">" + materialnumber + "&nbsp; </div>"; // 物料
				var goodname = val.materialdesc == null || val.materialdesc == "null" ? "" :val.materialdesc;
				_zhlhx = "<div id=zhlhx" + key + " class='divmatnrdesc'>" + goodname + "</div>"; // 商品ID
				_uniteprice = "<div id=uniteprice" + key + ">" + Number(val.tagprice).toFixed(2) + "&nbsp;</div>"; // 单价
				_number = "<div id=number" + key + ">" + val.salesquantity + "</div>"; // 数量
				_personcost = "<div id=personcost" + key + ">" + Number(val.goodsprocessingfee).toFixed(2) + "</div>"; // 人工费用
				_goldweight = "<div id=goldweight" + key + ">" + Number(val.goldweight).toFixed(3) + "</div>"; // 金种
				_goldvalue = "<div id=goldvalue" + key + " style='display:none'>" + val.goldprice + "</div>"; // 金种
				_receivable = "<div id=receivable" + key + " >" + Number(val.totalamount).toFixed(2) + "</div>"; // 合计
				
				_ztjtj = "<div id=ztjtj" + key + " >" +( Number(val.goodsprocessingfee)==0 && val.salesorderitem % 10 == 0 && _ordertype != 'ZKL' ? Number(val.tagprice).toFixed(2) : '0.00') + "</div>"; // 标签价格
				_realTagPrice = "<div id=realTagPrice" + key + " >" + Number(val.tagprice).toFixed(2) + "</div>"; // 实际标签价格
				
				_realprice = "<div id=realprice" + key + ">" + Number(val.netprice).toFixed(2) + "</div>"; // 实销价格
				var discount = val.storediscount == null || val.storediscount=="null" ? "" : val.storediscount;
				_discount = "<div id=discount" + key + ">" + discount + "</div>"; // 折扣
				_productpictureurl = val.productpictureurl == null || val.productpictureurl == "" ? (compImage = "CHJ" ? "CHJ-LOGO.JPG" : "vt.jpg") : val.productpictureurl;
				var imgpath = chargimgpath + _productpictureurl;
				imaghref = "<a href=" + imgpath + " class='tooltip'>";
				_pcimage = "<div id=pcimage" + key + ">" + imaghref + "<img id=pcimagesrc   src=" + imgpath + " height='40' width='38' alt='" + _productpictureurl + "'/></a></div>";

				$("#pcimage").attr("src", imgpath);
				$("#pcimage").attr("alt", val.productpictureurl);
				setTotalObjectByName('totalprice', val.tagprice, 2);
				setTotalObjectByName('totalnumber', val.salesquantity, 0);
				setTotalObjectByName('toalpersoncost', val.goodsprocessingfee, 2);
				setTotalObjectByName('totalgoldweight', val.goldweight, 3);
				setTotalObjectByName('total', val.totalamount, 2);
				setTotalObjectByName('totalztjtj', val.tagprice, 2);
				setTotalObjectByName('totalrealprice', val.netprice, 2);
				var row = "<tr><td class=" + style + ">" + row + "</td>";
				if (opmode == "view") {
					row = "<tr><td class=" + style + "></td>";
				}
				row = row + "<td class=" + style + ">" + posnrnumber + "</td>";
				row = row + "<td class=" + style + " style='display:none'>" + upumber + "</td>";
				row = row + "<td class=" + style + ">" + _charg + "</td>";
				row = row + "<td class=" + style + ">" + _matnr + "</td>";
				row = row + "<td class=" + style + ">" + _zhlhx + "</td>";
				row = row + "<td class=" + style + " align='center'>" + _pcimage + "</td>";
				row = row + "<td class=" + style + " style='display:none'  align='right'>" + _uniteprice + "</td>";
				row = row + "<td class=" + style + " align='right'>" + _number + "</td>";
				goodtdshow = val.goldprice == 0 ? "display:none" : "";
				if (val.goldprice != 0) {
					goldtextdisplay();
				}
				goodtdshow = $("#thpersoncost").css("display") == "none" ? "display:none" : "";
				row = row + "<td class=" + style + "  id='personcosttd" + key + "'  align='right' style='" + goodtdshow + "'>" + _personcost + "</td>";
				row = row + "<td class=" + style + "   id='goldtr" + key + "'   align='right'style='" + goodtdshow + "'>" + _goldweight + _goldvalue + "</td>";
				row = row + "<td class=" + style + " style='display:none'  align='right'>" + _receivable + "</td>";
				row = row + "<td class=" + style + " align='right'>" + _ztjtj + "</td>";
				row = row + "<td  style='display:none' class=" + style + " align='right'>" + _realTagPrice + "</td>";
				row = row + "<td class=" + style + " align='right'>" + _realprice + "</td>";
				row = row + "<td class=" + style + ">" + _discount + "</td>";
				ordertItemypeshow = ordertItemypeshowText(val.orderitemtype);
				row = row + "<td class=" + style + ">" + ordertItemype + "" + ordertItemypeshow + "</td>";
				row = row + "<td class=" + style + ">" + _logrt + "</td>";
				row = row + "</tr>";
				if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
					$("input[type=radio][name=chargtype][value=gift]").attr("checked", "checked");
					$("#matnr").hide();
					$("#charglabel").html("赠品料号: ");
					$("#matnrlabel").hide();
					upgiftnumber = Number(val.salesorderitem) / 10 + 1;
				}
				$(row).insertAfter($("#tablecontent tr:eq(" + key + ")"));
				// toplevelnumber=Number(key)+1; //设置最上层记录增加
			});
		});
	}
	function ordertItemypeshowText(itemtype) {
		ordertItemypeshow = "";
		switch (itemtype) {
		case "ZTAN":
			ordertItemypeshow = "销售";
			break;
		case "ZREN":
			ordertItemypeshow = "退货";
			break;
		case "ZOUT":
			ordertItemypeshow = "换出";
			break;
		case "ZIN":
			ordertItemypeshow = "换入";
			break;
		case "ZKL":
			ordertItemypeshow = "免费";
			break;
		default:
			ordertItemypeshow = "免费";
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
		$.getJSON("longhaul/orderSystem.ered?reqCode=getOrderhead&postType=1", {
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
				$("#cashcoupon").val(val.cashcoupon);
				$("#shopnumber").val(val.storereceipt);
				$("#ordertype").val(val.ordertype);
				getUserOderType(val.ordertype);
				$("#orderreason").val(val.orderreason);
				$("#remark").val(val.remarks);
				$("#operatedatetime").text(val.operatedatetime);
				var _sapsalesorderid = val.sapsalesorderid;
				_sapsalesorderid = _sapsalesorderid == null ? "" : _sapsalesorderid;
				$("#sapsalesorderid").text(_sapsalesorderid);
				_vipname = val.vipname == null ? "" : val.vipname;
				$("#vipname").text(_vipname);
				$("#cash").val(val.cash);
				$("#salesorderid").val(val.salesorderid);
				$("#unionpay").val(val.unionpay);
				$("#shoppingcard").val(val.shoppingcard);
				$("#subscription").val(val.subscription);
				
				//如果判断是新会员
				if(val.rhrq1=='' || val.rhrq1==null)
					$("#regname").val(_vipname);
				else
					$("#regname").val("");
					
					
				if (opmode != "view" && _sapsalesorderid != "") {
					opmode = "EDIT";
				}
				if (val.ordertype == "ZOR8") {
					$("#matnr").hide();
					$("#charglabel").html("赠品料号: ");
					$("#matnrlabel").hide();
				} else if (val.ordertype == "ZRE1") {
					$('#logartlabe').show();
					$('#logrt').show().addClass("inputattention");
				} else if (val.ordertype == "ZOR4") {
					$('#logartlabe').show();
					$('#logrt').show().addClass("inputattention");
					$('#swaptype').show().addClass("inputattention");
				}
			});
			if (opmode != "view") {
				$("#charg").attr("disabled", false);
				$("#charg").attr("readOnly", false);
				$("#kunnr").removeClass("inputkey").addClass("inputnom");
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
		});
	}
	function cleartable() {
		$("#tablecontent tr").each(function() {
			nextchildobject = $(this);
			// 删除子结点
			childposnrnumber = nextchildobject.find("div[id^='upnumberlevel']").text(); // 找孩子结点编号
			if (childposnrnumber != "") {
				nextchildobject.remove();
			}
			upbynumber = 1;
			toplevelnumber = 1;
		});
		$("input[type=radio][name=chargtype][value=charg]").attr("checked", "checked");
		cleatTotaltr();
	}
	function clearhead() {
		$("#salesorderid").val("");
		$("#salepromotion").val("");
		$("#kunnr").val("");
		$("#vipid").val("");
		$("#saleman").val("");
		$("#salepromotion").val("");
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
		$("#regname").val("");
		$("#registertd").val("新会员").show();
	}

	function clearchargre() {
		// 设置批次相关对应初使值
		$("#charg").val("");
		$("#matnr").val("");
		$("#zhlhx").val("");
		$("#ztjtj").val("");
		$("#number").val("1");
		$("#personcost").val("");
		$("#goldweight").val("");
		$("#receivable").val("0");
		$("#ztjtj").val("0");
		$("#receivable").val("0");
		$("#realprice").val("0");
		$("#discount").val("0");
		$("#gemweight").val("0");
		$("#goldvalue").val("0");
		$("#logrt").val("");
		if (!$("#charg").is(":disabled")) {
			$("#charg").focus();
		}
	}

	function log(message) {
		$("#debugtext").text(message);
	}

	$("#tablecontent tr th").dblclick(function() {
		// 选择商品
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
			jAlert('赠品销售类型只能录入赠品!', '提示', function(r) {
			});
			return false;
		}
		$("input[type=radio][name=chargtype][value=charg]").attr("checked", "checked");
		upgiftnumber = 1;
		clearchargre();
		// log("录入商品"+upbynumber);
		log("录入商品");
		if (_ordertype == "ZOR8") {
			$("#matnr").hide();
			$("#charglabel").html("赠品料号: ");
			$("#matnrlabel").hide();
		} else {
			$("#charglabel").html("条&nbsp;&nbsp;&nbsp;&nbsp;码: ");
			$("#matnr").show();
			$("#matnrlabel").show();
		}
		if (!$("#charg").is(":disabled")) {
			$("#charg").focus();
		}
	});

	$('#tablecontent tr:gt(0) td').live('dblclick', function() {

		var tdSeq = $(this).parent().find("td").index($(this)[0]);
		var trSeq = $(this).parent().parent().find("tr").index($(this).parent()[0]);
		var thistr = $(this).parent();
		var val = $('input:radio[name="chargtype"]:checked').val();
		$("input[type=radio][name=chargtype][value=gift]").attr("checked", "checked");
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
				$("input[type=radio][name=chargtype][value=charg]").attr("checked", "checked");
				$("#charglabel").html("条&nbsp;&nbsp;&nbsp;&nbsp;码: ");
				$("#matnr").show();
				$("#matnrlabel").show();
			});
			return;
		} else {
			updategifid = $(thistr).find("div[id^='leveladdgifts']").attr("id"); // 得到赠品ID商品下增加了多少赠品
			updatechargid = $(thistr).find("div[id^='upnumbercharg']").attr("id");
			inputcharg = $(thistr).find("div[id^='charg']").text() + "条码";
			addrownumber = trSeq;
		}
		clearchargre();
		$("#charglabel").html("赠品料号: ");
		$("#matnrlabel").hide();
		$("#matnr").hide();

		// log("录赠品在"+trSeq+"行("+inputcharg+")上层:"+upbynumber);
		_ordertype = $("#ordertype").val();
		if (_ordertype == "ZOR4") {
			ordertItemype = $.trim($(thistr).find("div[id^='ordertItemype']").text());
			$("#swaptype").val(ordertItemype);
		} else if (_ordertype == "ZOR8") {
			$("#matnr").hide();
			$("#charglabel").html("赠品料号: ");
			$("#matnrlabel").hide();
			inputcharg = $(thistr).find("div[id^='matnr']").text() + "物料号";
		}
		log("录赠品在" + inputcharg + "");
		$(thistr).find("div").each(function() {
		});
	});

	$('#delrow').live('click', function() {
		if (opmode == "view") {
			return false;
		}
		var thistr = $(this).parents("tr:first");
		upnumberlevel = $(thistr).find("div[id^='upnumberlevel']").text(); // 得到上层及本层.
		upnumberlevelvalue = $("#leveladdgifts" + upnumberlevel).text(); // 得到上层有多上赠品
		if (opmode == "ADD") { // 只有增加 的时候编号可以重复计算增长
			$("#leveladdgifts" + upnumberlevel).text(Number(upnumberlevelvalue) - 1); // 当前赠品退出
		}
		
		if(opmode=="EDIT"){
			$("#orderprint").val("<--先付款").attr('disabled', true);
		}
		
		var nexttrobj = thistr;
		var nextchildobject = thistr;
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (upnumberlevel == "") {
			jAlert('删除错误!', '提示', function(r) {
				return false;
			});
		}
		do { // 删除 赠品结点改变相应以下赠品结点序号
			nexttrobj = $(nexttrobj).next();
			nextupnumberlevel = nexttrobj.find("div[id^='upnumberlevel']").text(); // 下个Tr上层
			posnrnumber = nexttrobj.find("div[id^='posnrnumber']").text(); // 下个Tr上层
			// 编号
			upnumbergift = nexttrobj.find("div[id^='upnumbergift']").text(); // 下个TR的赠品值
			if (nextupnumberlevel != "00") {
				if (opmode == "ADD") {
					nexttrobj.find("div[id^='posnrnumber']").text(Number(posnrnumber) - 1); // 更新层次编号
					nexttrobj.find("div[id^='upnumbergift']").text(Number(upnumbergift) - 1); // 更新赠品编号
				}
			}
		} while (nextupnumberlevel == upnumberlevel)

		if (upnumberlevel == "00") { // 如果是商品删除下面所以赠品 同时改变下面行的行号
			thisposnrnumber = $(thistr).find("div[id^='posnrnumber']").text(); // 得到当前上层编号
			delposnumber = $(thistr).find("div[id^='posnrnumber']").text(); // 得到删除当前编号
			$("#tablecontent tr").each(function() {
				nextchildobject = $(this);
				// 删除子结点
				childposnrnumber = nextchildobject.find("div[id^='upnumberlevel']").text(); // 找孩子结点编号
				if (Number(childposnrnumber) == Number(thisposnrnumber)) {
					setTotalByObject(nextchildobject); // 扣合计将子项目
					nextchildobject.remove();
				}
				thisposnumber = $(nextchildobject).find("div[id^='posnrnumber']").text(); // 得到当前编号
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
		thistr.remove();
		if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
			if (opmode == "ADD") {
				upgiftnumber = Number(upgiftnumber) - 1;
			}
			$("input[type=radio][name=chargtype][value=gift]").attr("checked", "checked");
		} else {
			$("input[type=radio][name=chargtype][value=charg]").attr("checked", "checked");
			$("#charglabel").html("条&nbsp;&nbsp;&nbsp;&nbsp;码: ");
			$("#matnr").show();
			$("#matnrlabel").show();
		}
		$(thistr).find("div").each(function() {
		});

	});
	// 改变下层赠品数量
	function changeNextLevel(object, filedaname) {
		oldvalue = $(object).find("div[id^='" + filedaname + "']").text();
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (oldvalue != "00") {
			if (opmode == "ADD") {
				$(object).find("div[id^='" + filedaname + "']").text(Number(oldvalue) - 10); // 下个编号少10
			}
			// 如果是赠品类的销售则不用减少upgiftnumber,因为上层已减少
			upgiftnumber = (_ordertype != "ZRE2" && _ordertype != "ZKL") ? Number(upgiftnumber) - 1 : upgiftnumber;
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
		$("#" + totalname + "").text((Number($("#" + totalname + "").text()) - Number(value)).toFixed(fixed));
	}

	// 设置合计字段当修改增加 行的时候
	function setTotalObjectByName(totalname, value, fixed) {
		$("#" + totalname + "").text((Number($("#" + totalname + "").text()) + Number(value)).toFixed(fixed));
	}

	// 设置汇总行为0
	function clearTotalText(totalname, fixed) {
		$("#" + totalname + "").text(Number(0));
	}

	// 设置更改折扣
	$('#discount').keyup(function() {
		$("#realprice").val($("#receivable").val() * (this.value / 100));
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
		$.ajax({
			url : "longhaul/orderSystem.ered?reqCode=getKunnrJF&postType=1&kunnr=" + kunnr + "&random=" + Math.random() + "",
			success : function(data) {
				$('#kunnrjf').val(Number(data).toFixed(0));
				$('#kunnrjf').addClass("kunnrjf");
				$('#tel').addClass("kunnrjf");
			}
		});
	}

	function getgiftjf(charg) {
		$.ajax({
			async : false,
			url : "longhaul/orderSystem.ered?reqCode=getGiftJF&postType=1&charg=" + charg + "&random=" + Math.random() + "",
			success : function(data) {
				$("#giftjf").text(data);
			}
		});
	}
	function getgoldprices(werks, date, chargtype) {
		$.getJSON("longhaul/orderSystem.ered?reqCode=getGoldPrices&postType=1", {
			werks : werks,
			date : date,
			chargtype : chargtype,
			random : Math.random()
		}, function(data) {
			if (data == null || data == "") {
				alert("请注意,没有维护金价!");
			}
			$.each(data, function(key, val) {
				$("#goldvalue").val(val.drjj);
			});
		});
	}
	// 改变实际销价格改变相应该合计
	function changerealprice(thistr, thisvalue, oldtext) {
		$("#totalrealprice").text((Number($("#totalrealprice").text()) + (thisvalue - oldtext)).toFixed(2));
		$("#total").text((Number($("#total").text()) + (thisvalue - oldtext)).toFixed(2));
		receivableobj = $(thistr).find("div[id^='receivable']");
		receivableobj.text(Number(thisvalue).toFixed(2));
	}
	var x = 20;
	var y = 10;
	$('a.tooltip').live('mouseover', function(e) {
		this.myTitle = this.title;
		this.title = "";
		var imgTitle = this.myTitle ? "<br/>" + this.myTitle : "";
		imgTitle = "";
		var tooltip = "<div id='tooltip'><img  src='" + e.target.src + "' alt='产品预览图'/>" + imgTitle + "<\/div>"; // 创建
		// div
		// 元素
		$("body").append(tooltip); // 追加到文档中
		$("#tooltip").css({
			"top" : (e.pageY + y) + "px",
			"left" : (e.pageX + x) + "px"
		}).show("fast"); // 设置x坐标和y坐标，并且显示
	});

	$('a.tooltip').live('mouseout', function(e) {
		this.title = this.myTitle;
		$("#tooltip").remove(); // 移除
	});
	$('a.tooltip').live('mousemove', function(e) {
		$("#tooltip").css({
			"top" : (e.pageY + y) + "px",
			"left" : (e.pageX + x) + "px"
		});

	});
	$('a.tooltip').live('click', function(event) {
		jAlert('请您将鼠标移动到图片上显示大图!', '提示', function(r) {
		});
		event.preventDefault();
	});

	$('div.divmatnrdesc').live('mouseover', function(e) {
		_text = $(this).text();
		_tooltip = "<div id='tooltipdiv'><font style='font-size:26px'> " + _text + "</font></div>";
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
		if(opmode == "view")
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
					divedit.html(Number($(this).val()).toFixed(2)); // 设置新值
					thisvalue = Number($(this).val());
					oldtext = Number(oldtext);
					
					
					var _discountDiv = $(thistr).find("div[id^='discount']");
					var _bqjg = $(thistr).find("div[id^='ztjtj']");
					
					
					var _goldvalue = Number($(thistr).find("div[id^='goldvalue']").text());
					
					var bqjg = 0;
					if (_goldvalue != 0) {
						var _currdiscount = Number(_discountDiv.text());
						var _personcostDiv = $(thistr).find("div[id^='personcost']");
						var _oldtotalpersoncost = Number($("#toalpersoncost").text());
						var _goldweight = Number($(thistr).find("div[id^='goldweight']").text());
						var _goldrealprice = Number($(thistr).find("div[id^='goldrealprice']").text());
						var _personcost = Number(_personcostDiv.text());
						var _newpersoncost =thisvalue - _goldweight * _goldvalue ;
						bqjg = _goldrealprice;
						var _totalpersoncost = _oldtotalpersoncost + _newpersoncost - _personcost;
						_personcostDiv.text(Number(_newpersoncost).toFixed(2));
						$("#toalpersoncost").text(Number(_totalpersoncost).toFixed(2));
					} else {
						bqjg = Number(_bqjg.text());
					}
					if (bqjg != 0)
						_discount = parseInt(thisvalue / bqjg * 100) > 100 ? 100 : parseInt(thisvalue / bqjg * 100);
					else
						_discount = 100;
					_discountDiv.text(_discount);
					
					
					changerealprice(thistr, thisvalue, oldtext);

				} else {
					$(this).focus();
				}
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
					divedit.html(Number($(this).val()).toFixed(2));
				} else {
					divedit.html(oldtext);
				}
			} else {
				$(this).focus();
			}

		});

	});
	
	
	$("td[id^='logrttd']").live('click', function() {
		if(opmode == "view")
			return;
		if($("#ordertype").val() != "ZOR4" && $("#ordertype").val() != "ZRE1")
			return;
			
		var divedit = $($(this).children().get(0));
		
		var thistr = $(this).parents("tr:first");
		var orderItemType = $(thistr).find("div[id^='ordertItemype']").text();
		if(orderItemType != "ZIN" && orderItemType != "ZREN")
			return;
			
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("<input type='text'/>"); // 创建input 输入框
		var oldtext = divedit.html(); // 保存原有的值
		inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		inputIns.keyup(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ((orderItemType != "ZTA1" && this.value != "" && (this.value == "0001" || this.value == "0002" || this.value == "0003" || this.value == "0004" || this.value == "0006" || this.value == "0008"))
									|| (orderItemType == "ZTA1" && this.value != "" && (this.value == "0005" || this.value == "0011"))) {
					divedit.html($(this).val()); // 设置新值
					thisvalue = $(this).val();
					oldtext = oldtext;
					
				} else {
					alert("请输入正确的库位");
					$(this).focus();
				}
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			alert(value);
			if((orderItemType != "ZTA1" && this.value != "" && (this.value == "0001" || this.value == "0002" || this.value == "0003" || this.value == "0004" || this.value == "0006" || this.value == "0008"))
									|| (orderItemType == "ZTA1" && this.value != "" && (this.value == "0005" || this.value == "0011"))){
					if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
						thisvalue = $(this).val();
						oldtext = oldtext;
						divedit.html($(this).val());
					} else {
						divedit.html(oldtext);
					}
				
				} else {
					alert("请输入正确的库位");
					$(this).focus();
			}


		});

	});
	
	
	function getordertableinfo() {
		trlength = $("#tablecontent tr").length;
		var orderhead = "";
		_werks = WERKS;
		_werks = _werks.substring(0, _werks.length - 1);
		_salesorderid = $("#salesorderid").val();
		orderhead = orderhead + "\"salesorderid\":\"" + $.trim(_salesorderid) + "\",";
		_sapsalesorderid = $("#sapsalesorderid").text();
		orderhead = orderhead + "\"sapsalesorderid\":\"" + $.trim(_sapsalesorderid) + "\",";
		_operatedatetime = $("#operatedatetime").text();
		orderhead = orderhead + "\"operatedatetime\":\"" + $.trim(_operatedatetime) + "\",";
		_ordertype = $("#ordertype").val();
		orderhead = orderhead + "\"ordertype\":\"" + $.trim(_ordertype) + "\",";
		_orderreason = $("#orderreason").val();
		orderhead = orderhead + "\"orderreason\":\"" + $.trim(_orderreason) + "\",";
		_ordertime = $("#ordertime").val();
		orderhead = orderhead + "\"saledate\":\"" + $.trim(_ordertime) + "\",";
		_salepromotion = $("#salepromotion").val();
		orderhead = orderhead + "\"salepromotioncode\":\"" + $.trim(_salepromotion) + "\",";
		_cashcoupon = $("#cashcoupon").val();
		orderhead = orderhead + "\"cashcoupon\":\"" + $.trim(_cashcoupon) + "\",";
		_shopnumber = $("#shopnumber").val();
		orderhead = orderhead + "\"storereceipt\":\"" + $.trim(_shopnumber) + "\",";
		_opterator = $("#opterator").val();
		orderhead = orderhead + "\"operator\":\"" + $.trim(_opterator) + "\",";
		_saleman = $("#saleman").text();
		orderhead = orderhead + "\"salesclerk\":\"" + $.trim(_saleman) + "\",";
		_kunnr = $("#kunnr").val();
		orderhead = orderhead + "\"customerid\":\"" + $.trim(_kunnr) + "\",";
		_vipid = $("#vipid").val();
		orderhead = orderhead + "\"vipcard\":\"" + $.trim(_vipid) + "\",";
		orderhead = orderhead + "\"storeid\":\"" + $.trim(_werks) + "\",";
		_remark = $("#remark").val();
		orderhead = orderhead + "\"remarks\":\"" + $.trim(_remark) + "\",";
		_totalprice = $("#totalprice").text();
		orderhead = orderhead + "\"totalprice\":\"" + $.trim(_totalprice) + "\",";
		_totalnumber = $("#totalnumber").text();
		orderhead = orderhead + "\"totalnumber\":\"" + $.trim(_totalnumber) + "\",";
		_toalpersoncost = $("#toalpersoncost").text();
		orderhead = orderhead + "\"toalpersoncost\":\"" + $.trim(_toalpersoncost) + "\",";
		_totalgoldweight = $("#totalgoldweight").text();
		orderhead = orderhead + "\"totalgoldweight\":\"" + $.trim(_totalgoldweight) + "\",";
		_total = $("#total").text();
		orderhead = orderhead + "\"total\":\"" + $.trim(_total) + "\",";
		_totalztjtj = $("#totalztjtj").text();
		orderhead = orderhead + "\"totalztjtj\":\"" + $.trim(_totalztjtj) + "\",";
		_totalrealprice = $("#totalrealprice").text();
		orderhead = orderhead + "\"totalmoney\":" + $.trim(_totalrealprice) + ",";
		_statementtotal = $("#statementtotal").val();
		orderhead = orderhead + "\"amountcollected\":" + $.trim(_statementtotal) + ",";
		_cash = $("#cash").val();
		_cash = $.trim(_cash);
		_cash = _cash == "" ? 0 : _cash;
		orderhead = orderhead + "\"cash\":" + _cash + ",";
		_unionpay = $("#unionpay").val();
		_unionpay = $.trim(_unionpay);
		_unionpay = _unionpay == "" ? 0 : _unionpay;
		orderhead = orderhead + "\"unionpay\":" + _unionpay + ",";
		_shoppingcard = $("#shoppingcard").val();
		_shoppingcard = $.trim(_shoppingcard);
		_shoppingcard = _shoppingcard == "" ? 0 : _shoppingcard
		orderhead = orderhead + "\"shoppingcard\":" + _shoppingcard + ",";
		_subscription = $("#subscription").val();
		_subscription = $.trim(_subscription);
		_subscription = _subscription == "" ? 0 : _subscription;
		orderhead = orderhead + "\"subscription\":" + _subscription + ",";
		_vipname = $("#vipname").text();
		orderhead = orderhead + "\"vipname\":\"" + $.trim(_vipname) + "\",";

		var regname = $("#regname").val();
		if (regname != null && regname != "") { // 判断姓名
			orderhead = orderhead + "\"regname\":\"" + $.trim(regname) + "\","
		}
		orderhead = orderhead + "\"orderflag\":\"NO\"";
		orderhead = "{" + orderhead + "}";
		var tablestr = "";
		var msg = "";
		$("#tablecontent tr").each(function() { // 得到每一个tr
			earchobject = $(this);

			if (earchobject.index() == 0 || earchobject.index() + 1 == trlength) {
				return true;
			}
			_posnrnumber = earchobject.find("div[id^='posnrnumber']").text();
			_upnumberlevel = earchobject.find("div[id^='upnumberlevel']").text();
			_charg = earchobject.find("div[id^='charg']").text();
			_matnr = earchobject.find("div[id^='matnr']").text();
			_zhlhx = earchobject.find("div[id^='zhlhx']").text(); // 商品ID
			_uniteprice = earchobject.find("div[id^='uniteprice']").text();
			_number = earchobject.find("div[id^='number']").text();
			_personcost = earchobject.find("div[id^='personcost']").text();
			_goldweight = earchobject.find("div[id^='goldweight']").text();
			_goldvalue = earchobject.find("div[id^='goldvalue']").text();
			_receivable = earchobject.find("div[id^='receivable']").text();
			_ztjtj = earchobject.find("div[id^='realTagPrice']").text();
			_realprice = earchobject.find("div[id^='realprice']").text();
			_discount = earchobject.find("div[id^='discount']").text();
			_ordertItemype = earchobject.find("div[id^='ordertItemype']").text();
			_logrt = earchobject.find("div[id^='logrt']").text();
			_pcimagesrc = earchobject.find("img[id^='pcimagesrc']").attr("alt");
			_leveladdgifts = earchobject.find("div[id^='leveladdgifts']").text();
			
			if((_ordertItemype == "ZIN" || _ordertItemype == "ZREN") && _logrt == ""){
				msg +="项目"+_posnrnumber+"行处，"+ (_ordertItemype == "ZIN" ? "换入" : "退入") + "商品：" + _charg + "没有输入库位，请修改后重新提交！\n ";
			}
			
			tablestr = tablestr + "\"" + earchobject.index() + "\":";
			tablestr = tablestr + "{\"salesorderitem\":\"" + $.trim(_posnrnumber) + "\",";
			tablestr = tablestr + "\"salesorderid\":\"" + $.trim(_salesorderid) + "\",";
			tablestr = tablestr + "\"upsalesorderitem\":\"" + $.trim(_upnumberlevel) + "\",";
			tablestr = tablestr + "\"batchnumber\":\"" + $.trim(_charg) + "\",";
			tablestr = tablestr + "\"materialnumber\":\"" + $.trim(_matnr) + "\",";
			tablestr = tablestr + "\"materialdesc\":\"" + $.trim(_zhlhx) + "\",";
			tablestr = tablestr + "\"uniteprice\":" + $.trim(_uniteprice) + ",";
			tablestr = tablestr + "\"salesquantity\":" + $.trim(_number) + ",";
			tablestr = tablestr + "\"goodsprocessingfee\":" + $.trim(_personcost) + ",";
			tablestr = tablestr + "\"goldweight\":" + $.trim(_goldweight) + ",";
			tablestr = tablestr + "\"goldprice\":" + $.trim(_goldvalue) + ",";
			tablestr = tablestr + "\"totalamount\":" + $.trim(_receivable) + ",";
			tablestr = tablestr + "\"tagprice\":" + $.trim(_ztjtj) + ",";
			tablestr = tablestr + "\"netprice\":" + $.trim(_realprice) + ",";
			tablestr = tablestr + "\"storediscount\":" + $.trim(_discount) + ",";
			tablestr = tablestr + "\"orderitemtype\":\"" + $.trim(_ordertItemype) + "\",";
			tablestr = tablestr + "\"lowerlevelsnumber\":\"" + $.trim(_leveladdgifts) + "\",";
			// tablestr = tablestr + "\"goldprice\":\""+_ordertItemype)+"\",";
			tablestr = tablestr + "\"storeid\":\"" + $.trim(_werks) + "\",";
			tablestr = tablestr + "\"storagelocation\":\"" + $.trim(_logrt) + "\",";
			tablestr = tablestr + "\"productpictureurl\":\"" + $.trim(_pcimagesrc) + "\"}";
			tablestr = earchobject.index() == trlength - 2 ? tablestr : tablestr + ",";
		});

		tablestr = "{" + tablestr + "}";
		var tableinfo = {
			orderhead : orderhead,
			orderitem : tablestr
		};
		if(msg != ""){
			alert(msg);
			return null;
		}
		
		return tableinfo;
	}

	$("#statementaccount").dialog("destroy");
	$("#statementaccount").dialog({
		autoOpen : false,
		height : 150,
		width : 620,
		modal : true,
		buttons : {
			"付款" : function() {
				if (opmode == "view" && useroption == "print") {
					_salesorderid = $("#salesorderid").val();
					window.showModalDialog("http://" + posurl + "/chjpos/dmgl/dyxp/dm_dyxp.jsp?ywxh=" + _salesorderid + "&dwbh=" + WERKS, 'printWindow', 'dialogWidth=650px;dialogHeight=700px');
					$('input').attr('disabled', true);
					$('select').attr('disabled', true);
					return;
				}
				$("#showuploading").show();
				var tableinfo = getordertableinfo();
				if(tableinfo == null){
					$("#showuploading").hide();
					$("#statementaccount").dialog("close");
					$(":button").slice(3, 5).attr("disabled", false); 
					return;
				}
				$(":button").slice(3, 5).attr("disabled", "disabled"); // 多个按钮时只设置某些按钮不可用
				$.ajaxSetup({
					error : function(x, e) {
						alert("访问服务器错误!" + x.responseText);
						$("#showuploading").hide();
						$(":button").slice(3, 5).attr("disabled", false); // 多个按钮时只设置某些按钮不可用
						return false;
					}
				});
				$.ajax({
					url : "longhaul/orderSystem.ered?reqCode=saveOrder&postType=1",
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
						if (retdata.sapsalesorderid == null || retdata.sapsalesorderid == "") { // 如果SAP订单号为空
							if (retdata.salesorderid != null || retdata.salesorderid != "") { // 如果SAP没有保存成功,但是AIG保存成功
								if (useroption == "print") {
									$("#salesorderid").val(retdata.salesorderid);
									$("#statementaccount").dialog("close");
									// printWindow=window.open("http://"+posurl+"/chj/dmgl/dyxp/dm_dyxp.jsp?ywxh="+retdata.salesorderid+"&dwbh="+WERKS,'printWindow',
									// 'top=10,width=650,height=800,scrollbars=yes,
									// resizable=yes');
									window.showModalDialog("http://" + posurl + "/chjpos/dmgl/dyxp/dm_dyxp.jsp?ywxh=" + retdata.salesorderid + "&dwbh=" + WERKS, 'printWindow', 'dialogWidth=650px;dialogHeight=700px');
									$('input').attr('disabled', true);
									$('select').attr('disabled', true);
									$("#regname").val("");
								} else {
									var messagestr = "";
									if (opmode == "ADD") {
										messagestr = "操作<font color=red>失败</font>临时凭证保存成功:" + retdata.salesorderid + "<br />";
									} else {
										messagestr = "操作<font color=red>失败</font>请重新修改订单记录:" + retdata.salesorderid + "<br />";
									}
									$("#salesorderid").val(retdata.salesorderid);
									if (retdata.error != null) {
										messagestr = messagestr + retdata.error + "<br/>" ;
									}
									if (retdata.message != null) {
										messagestr = messagestr + retdata.message + "<br/>" ;
									}
									if (retdata.message2 != null) {
										messagestr = messagestr + retdata.message2 + "<br/>" ;
									}
									jAlert(messagestr, '提示', function(r) {
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
								window.showModalDialog("http://" + posurl + "/chjpos/dmgl/dyxp/dm_dyxp.jsp?ywxh=" + retdata.salesorderid + "&dwbh=" + WERKS, 'printWindow', 'dialogWidth=650px;dialogHeight=700px');
							} else {
								// "POS订单号:" + retdata.salesorderid +
								// "<br>" +
								_retinfo = retdata.message + "<br><font  class='printinfo'>是否打印?</font>";
								// jAlert(_retinfo, '提示', function(r) {
								jConfirm(_retinfo, '提示', function(r) {
									if (r == true) {
										$("#salesorderid").val(retdata.salesorderid);
										$("#statementaccount").dialog("close");
										cleartable();
										clearhead();
										window.showModalDialog("http://" + posurl + "/chjpos/dmgl/dyxp/dm_dyxp.jsp?ywxh=" + retdata.salesorderid + "&dwbh=" + WERKS, 'printWindow', 'dialogWidth=650px;dialogHeight=700px');
									} else {
										$("#statementaccount").dialog("close");
										cleartable();
										clearhead();
										$("#matnr").show();
										$("#charglabel").html("条&nbsp;&nbsp;&nbsp;&nbsp;码: ");
										$("#matnrlabel").show();
										$("#charg").attr("disabled", true);
										$("#charg").attr("readOnly", true);
										$("#kunnr").removeClass("inputnom").addClass("inputkey");
										$("#charg").removeClass("inputkey").addClass("inputnom");
										$("#kunnr").focus();
									}
								});
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
	var useroption = "";
	var statementindex = 4;
	// 付款
	$("#userstatement").click(function() {
		if($("#ordertype").val() == "ZOR4" && !checkChangeInfo()){//检查换货输入信息
			$("#charg").focus();
		}else{
		$("#statementtotal").val($("#totalrealprice").text());
		_usercash = Number($("#totalrealprice").text()) - $("#unionpay").val() - $("#shoppingcard").val() - $("#subscription").val();
		$("#cash").val(_usercash);
		_unionpay = $("#unionpay").val();
		_shoppingcard = $("#shoppingcard").val();
		_subscription = $("#subscription").val();

		$(":button").eq(statementindex).text("付款");
		$(":button").eq(statementindex).addClass('ui-dialog-buttonpane ' + 'ui-widget-content ' + 'ui-helper-clearfix')
		$(":button").eq(statementindex + 1).text("关闭");
		$(":button").eq(statementindex + 1).addClass('ui-dialog-buttonpane ' + 'ui-widget-content ' + 'ui-helper-clearfix')

		useroption = "statement";
		trlength = $("#tablecontent tr").length;
		if (trlength == 2) {
			jAlert("没有录入任何订单信息,不能付款!", '提示', function(r) {
				return false;
			});
		} else {
			if ($.trim($("#saleman").text()) == "请选择营业员") {
				jAlert("请选择营业员", '提示', function(r) {
					$("#saleman").click();
					$("#saleman").focus();
				});
				return false;
			} else {
				$("#statementaccount").dialog("open");
				$("#showuploading").hide();
			}

		}
		}
	})

	$("#orderprint").click(function() {
		// $(":button").slice(2,3).attr("disabled",true); //多个按钮时只设置某些按钮不可用
	if($("#ordertype").val() == "ZOR4" && !checkChangeInfo()){//检查换货输入信息
			$("#charg").focus();
		}else{
		$(":button").eq(statementindex).text("打印");
		$(":button").eq(statementindex).addClass('ui-dialog-buttonpane ' + 'ui-widget-content ' + 'ui-helper-clearfix')
		$(":button").eq(statementindex + 1).text("关闭");
		$(":button").eq(statementindex + 1).addClass('ui-dialog-buttonpane ' + 'ui-widget-content ' + 'ui-helper-clearfix')

		useroption = "print";
		$("#statementtotal").val($("#totalrealprice").text());
		_usercash = Number($("#totalrealprice").text()) - $("#unionpay").val() - $("#shoppingcard").val() - $("#subscription").val();
		$("#cash").val(_usercash);
		_unionpay = $("#unionpay").val();
		_shoppingcard = $("#shoppingcard").val();
		_subscription = $("#subscription").val();
		trlength = $("#tablecontent tr").length;
		if (trlength == 2) {
			jAlert("没有录入任何订单信息,不能付款!", '提示', function(r) {
				return false;
			});
		} else {
			if ($.trim($("#saleman").text()) == "请选择营业员") {
				jAlert("请选择营业员", '提示', function(r) {
					$("#saleman").click();
					$("#saleman").focus();
				});
				return false;
			} else {
				$("#statementaccount").dialog("open");
				$("#showuploading").hide();
			}

		}
		}
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
				_autocompletesecond = _autocompletesecond == "" ? 4000 : _autocompletesecond;
				_autocompletewords = _autocompletewords == "" ? 2 : _autocompletewords;
				$.ajax({
					url : "longhaul/orderSystem.ered?reqCode=setUserConfiger&postType=1&userid=" + opterator + "&autocompletewords=" + _autocompletewords + "&autocompletesecond=" + _autocompletesecond + "&random=" + Math.random() + "",
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
		if (checkNum(this)) {
			unionpayvalue = Number($("#cash").val()) + Number(_unionpay);
			unionpayvalue = Number(unionpayvalue) - Number(value);
			$("#cash").val(unionpayvalue);
			_unionpay = value
			if (Number($("#cash").val()) < 0)
				jAlert("金额为负数了!", '提示', function(r) {
				});
		}
	});
	$("#shoppingcard").keyup(function(event) {
		value = $(this).val();
		if (checkNum(this)) {
			unionpayvalue = Number($("#cash").val()) + Number(_shoppingcard);
			unionpayvalue = Number(unionpayvalue) - Number(value);
			$("#cash").val(unionpayvalue);
			_shoppingcard = value
			if (Number($("#cash").val()) < 0)
				jAlert("金额为负数了!", '提示', function(r) {

				});
		}
	});
	$("#subscription").keyup(function(event) {
		value = $(this).val();
		if (checkNum(this)) {
			unionpayvalue = Number($("#cash").val()) + Number(_subscription);
			unionpayvalue = Number(unionpayvalue) - Number(value);
			$("#cash").val(unionpayvalue);
			_subscription = value
			if (Number($("#cash").val()) < 0)
				jAlert("金额为负数了!", '提示', function(r) {
				});
		}
	});

	$("#registertd").click(function() {
		$("#charg").removeClass("inputkey").addClass("inputnom").attr("readOnly", true).attr("disabled", true);

		if ($("#registertr").css("display") == "none") {

			$("#registertr").show();
			$("#kunnr").removeClass("inputkey").addClass("inputnom");
			$("#regname").removeClass("inputnom").addClass("inputkey").focus();
			$("#registertd").val("取消");

			log("新增会员信息");

		} else {
			if($("#registertd").val() == "取消"){
				$("#registertd").val("新会员");
				$("#regname").val("");
				$("#kunnr").val("");
				$("#vipname").text("");
			}
			$("#registertr").css("display", "none");

			$("#regname").removeClass("inputkey").addClass("inputnom");
			$("#kunnr").removeClass("inputnom").addClass("inputkey").focus();

			if ($("#kunnr").val() == "")
				$("#registertd").val("新会员");
			else
				$("#registertd").val("修改");
			log("");
			
		}

		
		

	});

	$("#regname").keydown(function(event) {
		_regname = $("#regname").val();
		if (event.keyCode == 13) {
			if (_regname == "") {
				alert("请输入名字!");
			} else {
				register();
			}
		}

	});

	$("#saveregmsg").bind("click", register);

	function register() {
		if ($("#regname").val() == "") {
			jAlert('请输入会员姓名', '提示', function(r) {
				$("#registertr").show();
				$("#regname").focus();
			});
		} else {
			$.ajax({
				url : "longhaul/orderSystem.ered?reqCode=registerUser&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
				dataType : "json",
				type : 'post',
				data : {
					regname : $("#regname").val()
				},
				success : function(data) {
					if (data == "" || data == null) {
						jAlert('获取会员编号出现错误，请检查是否有可用的会员编号,请稍后重试!!', '提示', function(r) {
							$("#regname").focus();
						});
					} else {

						$("#registertr").hide();
						$("#kunnr").val(data);
						kunnrbyuserfornewuser();
						$("#vipname").text($("#regname").val());
					}
				}
			});
		}
	}

	if (opmode == "EDIT") {
		$("#registertd").hide();
	}
	
	
	
	function checkChangeInfo(){ //检查换货输入信息
		var flag = false;
		var ingood = 0;
		var outgood = 0;
		var table = $("#tablecontent");
		var orderitems = $(table).find("div[id^='ordertItemype']");
		//alert(orderitems.length);
		for(var i = 0 ; i < orderitems.length; i++){
			var text = $(orderitems[i]).text();
			if(text == "ZOUT")
				outgood ++ ;
			else if(text == "ZIN")
				ingood ++ ;
		}
		if(ingood == 0)
			alert("请输入换入商品！");
		else if(outgood == 0)
			alert("请输入换出商品！");
		if(outgood >0 && ingood > 0)
			flag = true;
		return flag;
	}
	
});
