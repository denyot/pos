$(function(){
	$('#ordertime').val(getTodyay("-"));
	$("#posttime").val(getTodyay("-"));
	$("#ordertime").datepicker({
			changeMonth : true,
			changeYear : true
		});
	$("#posttime").datepicker({
			changeMonth : true,
			changeYear : true
		});
	
	var dialog ;
	$('#ordersystemtable td').addClass('tdclass'); // 增加td样式
		
		
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
				url : "longhaul/pos/stock/stockSystem.ered?reqCode=getMatnrInfo&postType=1&option=auto&werks=" + "01DL" + "&random=" + Math.random() + "",
				dataType : "json",
				data : "matnr=" + $.trim(_charg) + "&chargtype=" + _chargtype+"&isyhp=1",
				success : function(data) {
					if (data == "") {
						var chargalertstr = "输入条码不存在!";
						chargalertstr = _chargtype == "gift" ? "输入物料编码不存在!" : chargalertstr
						jAlert(chargalertstr, '提示', function(r) {
							clearcharginfo();
						});
					}
					response($.map(data, function(item) {
						var cpbm = item.matnr == null ? "" : item.matnr; // 批次
						var zhlhx = item.maktx == null ? "" : item.maktx; // 产品名称
						return {
							label : cpbm + "->" + zhlhx
						};
					}));
				}
			});
		},
		delay : 3,
		minLength : 2,
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
				dialog.close();
				jAlert(x.responseText,"提示",function(e){
					//$("#statementaccount").dialog("destroy");
					//location.reload();
				});
				return false;
			}
		});
		$.ajax({
			url : "longhaul/pos/stock/stockSystem.ered?reqCode=getMatnrInfobyuser&option=user&postType=1&werks=" + "01DL" + "&random=" + Math.random() + "",
			dataType : "json",
			data : "matnr=" + $.trim(_charg) + "&chargtype=" + _chargtype+"&isyhp=1",
			success : function(data) {
				if (data == "") {
					var chargalertstr = "输入条码不存在!";
					chargalertstr = _chargtype == "gift" ? "输入物料编码不存在!" : chargalertstr
					jAlert(chargalertstr, '提示', function(r) {
						clearcharginfo();
					});
				}
				
				$.map(data,function(item,key){
					var matnr = item.matnr == null ? "" : item.matnr; // 物料号
					var zhlhx = item.maktx == null ? "" : item.maktx; // 产品名称
					var ztjtj = item.ztjtj == null ? 0 : item.ztjtj; // 标签价
					var realprice = item.realprice == null ? 0 : item.realprice; // 售价
					var pcimage = item.zp == null ? "" : item.zp; // 照片
					var lgort= item.lgort == null ? "" : item.lgort; //库位信息
					var charglabst = item.labst == null ? 1 : item.labst ; //批次数量
					var info = {
						matnr : matnr,
						zhlhx : zhlhx,
						ztjtj : ztjtj,
						realprice : realprice,
						pcimage : pcimage,
						lgort : lgort,
						charglabst : charglabst
					};
					chosecharginfo(info, "user");
				});
			}
		});
	}
	
	
	function chosecharginfo(item, type) {
		if (type = "") {
			charginfo = ui.item;
		} else {
			charginfo = item;
		}
		$("#matnr").val(charginfo.matnr);
		$("#zhlhx").val(charginfo.zhlhx);
		$("#ztjtj").val(charginfo.ztjtj);
		$("#number").val(charginfo.charglabst);
		$("#realnumber").val(charginfo.charglabst);
		$("#realprice").val(charginfo.realprice); // 实收
		$("#logrt").val(charginfo.lgort);
		usedorderid = charginfo.usedorderid;
		var sjczbm = charginfo.sjczbm;
		
		
		_pcimage = charginfo.pcimage;
		_pcimage = _pcimage == null || _pcimage == "" ? "zjzb.gif" : _pcimage;
		$(".tooltip").attr("href", "sappic/" + _pcimage);
		$(".tooltip").attr("title", charginfo.zhlhx);
		$("#pcimage").attr("src", "sappic/" + _pcimage);
		$("#pcimage").attr("alt", _pcimage);
		$("#pcimage").load(function() {
		}).error(function() {
			$("#pcimage").attr("src", "longhaul/pos/order/images/zjzb.gif");
			$("#pcimage").attr("alt", 'zjzb.gif');
			$(".tooltip").attr("href", "longhaul/pos/order/images/zjzb.gif");
			$(".tooltip").attr("title", "zjzb.gif");
		});

		$("#number").addClass("inputkey");
		$("#charg").removeClass("inputkey");
		$("#number").select();
		$("#showmatnrinfo").show();
		$("#showmatnrinfo2").show();
		$("#showoptinfo").show();
	}
	
	
	function clearcharginfo() {
		$("#charg").focus();
		$("#charg").val("");
		$("#matnr").val("");
		$("#zhlhx").val("");
		$("#ztjtj").val("");
		$("#realprice").val("");
		$("#goldweight").val("");
		$("#gemweight").val("");
		$("#certificateno").val("");
		$("#personcost").val("");
		$("#goldvalue").val("0");
		$("#charg").addClass("inputkey");
		$("#charg").focus();
	}
	
	
	
	$("#number").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($('#charg').val() == "") {
				alert("请录入商品信息!");
				return;
			}
			
//			if(Number($("#number").val()) > Number($("#realnumber").val())){
//				jAlert('商品数量大于库存量，请检查!', '提示', function(r) {
//							$("#number").focus();
//						});
//				return false;
//			}
			
			if ($('input:radio[name="chargtype"]:checked').val() !== "gift") {
				if (Number($(this).val()) == 0) {
					alert('商品数量不能为0，请检查!' );
							$("#number").focus();
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
		//ordertItemypeshow = ordertItemypeshowText(ordertItemypestr);
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

//		var charg = "<div id=charg" + rownum + ">" + _tempcharg.toUpperCase() + "&nbsp;</div>"; // 批次
		var matnr = "<div id=matnr" + rownum + ">" + _tempcharg.toUpperCase() + "&nbsp; </div>"; // 物料

		var zhlhx = "<div id=zhlhx" + rownum + " class='divmatnrdesc'>" + $("#zhlhx").val() + "&nbsp; </div>"; // 商品ID
		var uniteprice = "<div id=uniteprice" + rownum + ">" + Number($("#ztjtj").val()).toFixed(2) + "&nbsp;</div>"; // 单价
		var number = "<div id=number" + rownum + ">" + Number(_number) + "</div>"; // 数量
		//var personcost = "<div id=personcost" + rownum + ">" + Number($("#personcost").val()).toFixed(2) + "</div>"; // 人工费用
		//var goldweight = "<div id=goldweight" + rownum + ">" + Number($("#goldweight").val()).toFixed(3) + "</div>"; // 金种
		//var goldvalue = "<div id=goldvalue" + rownum + " style='display:none'>" + $("#goldvalue").val() + "</div>"; // 金种
		
		//var goldrealprice = "<div id=goldrealprice" + rownum + ">" + (Number($("#personcost").val())+Number($("#goldweight").val())*Number($("#goldvalue").val())).toFixed(2) + "&nbsp;</div>"; //金价初始总价
		
		//var receivable = "<div id=receivable" + rownum + ">" + Number(_total).toFixed(2) + "</div>"; // 合计
		var ztjtj = "<div id=ztjtj" + rownum + ">" + Number(_ztjtj).toFixed(2) + "</div>"; // 标签价格
		//var realTagPrice = "<div id=realTagPrice" + rownum + ">" + Number(_realTagPrice).toFixed(2) + "</div>"; // 标签价格
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
		//row = row + "<td class=" + style + ">" + charg + "</td>";
		row = row + "<td class=" + style + ">" + matnr + "</td>";
		row = row + "<td class=" + style + ">" + zhlhx + "</td>";
		row = row + "<td class=" + style + " align='center'>" + pcimage + "</td>";
		row = row + "<td style='display:none' class=" + style + " align='right'>" + uniteprice + "</td>";
		row = row + "<td class=" + style + " align='right'>" + number + "</td>";
		goodtdshow = $("#thpersoncost").css("display") == "none" ? "display:none" : "";
		
		goodtdshow= "";

		//row = row + "<td  id='personcosttd" + rownum + "'  class=" + style + "  align='right' style=" + goodtdshow + ">" + personcost + "</td>";
		//row = row + "<td  id='goldtr" + rownum + "'  class=" + style + "  align='right' style=" + goodtdshow + ">" + goldweight + goldvalue + "</td>";
		//row = row + "<td style='display:none' class=" + style + " align='right'>" + receivable + "</td>";
		
		//row = row + "<td style='display:none' class=" + style + " align='right'>" + goldrealprice + "</td>";
		
		row = row + "<td class=" + style + " align='right'>" + ztjtj + "</td>";
		//row = row + "<td style='display:none' class=" + style + " align='right'>" + realTagPrice + "</td>";
		
		//row = row + "<td class=" + style + " align='right'>" + realprice + "</td>";
		//row = row + "<td class=" + style + ">" + discount + "</td>";
		//row = row + "<td class=" + style + ">" + ordertItemype + "" + ordertItemypeshow + "</td>";
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
	
	function goldtextdisplayno() {
		$("#goldvalue").hide();
		$("#goldvaluelabel").hide();
		$("#personcost").hide();
		$("#personcostlabel").hide();
		$("#showmatnrinfo2").hide();
	}
	
	
	$('#delrow').live('click', function() {
		var thistr = $(this).parents("tr:first");
		upnumberlevel = $(thistr).find("div[id^='upnumberlevel']").text(); // 得到上层及本层.
		upnumberlevelvalue = $("#leveladdgifts" + upnumberlevel).text(); // 得到上层有多上赠品
		
		
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
					nexttrobj.find("div[id^='posnrnumber']").text(Number(posnrnumber) - 1); // 更新层次编号
					nexttrobj.find("div[id^='upnumbergift']").text(Number(upnumbergift) - 1); // 更新赠品编号
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

				toplevelnumber = Number(toplevelnumber) - 1;
				upbynumber = Number(upbynumber) - 1;
		}
		setTotalByObject(thistr); // 将合计扣除
		thistr.remove();
		if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
				upgiftnumber = Number(upgiftnumber) - 1;
			$("input[type=radio][name=chargtype][value=gift]").attr("checked", "checked");
		} else {
			$("input[type=radio][name=chargtype][value=charg]").attr("checked", "checked");
			//$("#charglabel").html("条&nbsp;&nbsp;&nbsp;&nbsp;码: ");
			$("#matnr").show();
			$("#matnrlabel").show();
		}
		$(thistr).find("div").each(function() {
		});

	});
	
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
		$("<img/>").attr("src", e.target.src).load(function() {
		
					imgWidth = Number(this.width);
					imgHeight = Number(this.height);

					$("body").append(tooltip); // 追加到文档中
					//alert($(window).height());
					// alert(e.pageY);
					// alert(e.pageX);
					// alert(e.target.height);
					//alert(e.pageY + imgHeight);
					if ((e.pageY + imgHeight) > $(window).height()) {
						$("#tooltip").css({
								"top" : (e.pageY + y - imgHeight/2) + "px",
								"left" : (e.pageX + x) + "px"
							}).show("fast"); // 设置x坐标和y坐标，并且显示
					}else{
						$("#tooltip").css({
								"top" : (e.pageY + y) + "px",
								"left" : (e.pageX + x) + "px"
							}).show("fast"); // 设置x坐标和y坐标，并且显示
					}
					
				});

	});

	$('a.tooltip').live('mouseout', function(e) {
		this.title = this.myTitle;
		$("#tooltip").remove(); // 移除
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
	
	getWerks();
	function getWerks(){
		$.ajax({
				url : "longhaul/pos/stock/stockSystem.ered?reqCode=getWerks&option=user&postType=1&werks=" + "01DL" + "&random=" + Math.random() + "",
				dataType : "json",
				//data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype,
				success : function(data) {
					if (data == "") {
						var chargalertstr = "输入条码不存在!";
						chargalertstr = _chargtype == "gift" ? "输入物料编码不存在!" : chargalertstr
						jAlert(chargalertstr, '提示', function(r) {
							clearcharginfo();
						});
					}
					$.map(data, function(item) {
						$("#inwerk").append("<option value='"+item.werks+"'>"+item.name1+"</option>");
					});
				}
			});
	}
	

	// 付款
	$("#submit").click(function() {
		if($("#ordertype").val() == "ZOR4" && !checkChangeInfo()){//检查换货输入信息
			$("#charg").focus();
		}else{
			$("#statementtotal").val($("#totalrealprice").text());
			_usercash = Number($("#totalrealprice").text()) - $("#unionpay").val() - $("#shoppingcard").val() - $("#subscription").val();
			$("#cash").val(_usercash);
			_unionpay = $("#unionpay").val();
			_shoppingcard = $("#shoppingcard").val();
			_subscription = $("#subscription").val();
	
			trlength = $("#tablecontent tr").length;
			if (trlength == 2) {
				jAlert("没有录入任何订单信息,不能付款!","提示",function(e){});
					return false;
			} else {
				if($("#inwerk").val()==""){
					jAlert("请选择收货门店!","提示",function(e){$("#inwerk").focus();});
					return false;
				}
				if($("#postno").val() == ""){
					jAlert("请输入邮寄单号！","提示",function(e){
						$("#postno").focus();
					})
					return;
				}
				//$("#statementaccount").dialog("open");
				jConfirm("确定提交吗？","提示", function(e){
					if(e){
						submitOutStock();
					}
				})
				
			}
		}
	})
	
	
	
	
	function submitOutStock(){
		var orderInfo = getordertableinfo();	
		dialog = $.dialog({
			title:'提交中...',
			max: false,
   		 	min: false,
   		 	close : false,
   		 	lock : true
   		 	});
		
		$.ajax({
			url : "longhaul/pos/stock/stockSystem.ered?reqCode=submitOutStockForYHP&option=user&postType=1",
			cache : false,
			data : {
				orderitem : orderInfo.orderitem,
				orderhead : orderInfo.orderhead
			},
			type : 'post',
			dataType : 'json',
			success : function(data){
				dialog.close();
				if(data.success != null){
					jAlert(data.success, "提示",function(e){
						location.reload();
					});
				}else{
					jAlert(data.error, "提示",function(e){
					});
				}
			}
		});
	}
	
	
	function getordertableinfo() {
		trlength = $("#tablecontent tr").length;
		var orderhead = "";
		_werks = "SZ01";
		//_werks = _werks.substring(0, _werks.length - 1);
		//_salesorderid = $("#salesorderid").val();
		//orderhead = orderhead + "\"salesorderid\":\"" + $.trim(_salesorderid) + "\",";
		//_sapsalesorderid = $("#sapsalesorderid").text();
		//orderhead = orderhead + "\"sapsalesorderid\":\"" + $.trim(_sapsalesorderid) + "\",";
		//_operatedatetime = $("#operatedatetime").text();
		//orderhead = orderhead + "\"operatedatetime\":\"" + $.trim(_operatedatetime) + "\",";
		//_ordertype = $("#ordertype").val();
		//orderhead = orderhead + "\"ordertype\":\"" + $.trim(_ordertype) + "\",";
		//_orderreason = $("#orderreason").val();
		//orderhead = orderhead + "\"orderreason\":\"" + $.trim(_orderreason) + "\",";
		_ordertime = $("#ordertime").val();
		orderhead = orderhead + "\"saledate\":\"" + $.trim(_ordertime) + "\",";
		_salepromotion = $("#salepromotion").val();
		orderhead = orderhead + "\"salepromotioncode\":\"" + $.trim(_salepromotion) + "\",";
		_postno =  $("#postno").val();
		orderhead = orderhead + "\"postno\":\"" + $.trim(_postno) + "\",";
		_posttime =  $("#posttime").val();
		orderhead = orderhead + "\"posttime\":\"" + $.trim(_posttime) + "\",";
		
		
		var _inwerk = $("#inwerk").val();
		orderhead = orderhead + "\"inwerk\":\"" + $.trim(_inwerk) + "\",";
		
		var _inlgort = $("#inlgort").val();
		orderhead = orderhead + "\"inlgort\":\"" + $.trim(_inlgort) + "\",";
		
		orderhead = "{" + orderhead + "}";
		var tablestr = "";
		$("#tablecontent tr").each(function() { // 得到每一个tr
			earchobject = $(this);

			if (earchobject.index() == 0 || earchobject.index() + 1 == trlength) {
				return true;
			}
			_posnrnumber = earchobject.find("div[id^='posnrnumber']").text();
			_upnumberlevel = earchobject.find("div[id^='upnumberlevel']").text();
			_charg = earchobject.find("div[id^='charg']").text();
			_matnr = earchobject.find("div[id^='matnr']").text();
			_zhlhx = earchobject.find("div[id^='zhlhx']").text(); // 商品名
			//_uniteprice = earchobject.find("div[id^='uniteprice']").text();
			_number = earchobject.find("div[id^='number']").text();
			_personcost = earchobject.find("div[id^='personcost']").text();
			_goldweight = earchobject.find("div[id^='goldweight']").text();
			//_goldvalue = earchobject.find("div[id^='goldvalue']").text();
			//_receivable = earchobject.find("div[id^='receivable']").text();
			_ztjtj = earchobject.find("div[id^='ztjtj']").text();
			_realprice = earchobject.find("div[id^='realprice']").text();
			//_discount = earchobject.find("div[id^='discount']").text();
			//_ordertItemype = earchobject.find("div[id^='ordertItemype']").text();
			_logrt = earchobject.find("div[id^='logrt']").text();
			_pcimagesrc = earchobject.find("img[id^='pcimagesrc']").attr("alt");
			//_leveladdgifts = earchobject.find("div[id^='leveladdgifts']").text();
			tablestr = tablestr + "\"" + earchobject.index() + "\":";
			tablestr = tablestr + "{\"salesorderitem\":\"" + $.trim(_posnrnumber) + "\",";
			//tablestr = tablestr + "\"salesorderid\":\"" + $.trim(_salesorderid) + "\",";
			tablestr = tablestr + "\"upsalesorderitem\":\"" + $.trim(_upnumberlevel) + "\",";
			tablestr = tablestr + "\"batchnumber\":\"" + $.trim(_matnr) + "\",";
			//tablestr = tablestr + "\"materialnumber\":\"" + $.trim(_matnr) + "\",";
			tablestr = tablestr + "\"materialdesc\":\"" + $.trim(_zhlhx) + "\",";
			//tablestr = tablestr + "\"uniteprice\":" + $.trim(_uniteprice) + ",";
			tablestr = tablestr + "\"salesquantity\":" + $.trim(_number) + ",";
			//tablestr = tablestr + "\"goodsprocessingfee\":" + $.trim(_personcost) + ",";
			//tablestr = tablestr + "\"goldweight\":" + $.trim(_goldweight) + ",";
			//tablestr = tablestr + "\"goldprice\":" + $.trim(_goldvalue) + ",";
			//tablestr = tablestr + "\"totalamount\":" + $.trim(_receivable) + ",";
			tablestr = tablestr + "\"tagprice\":" + $.trim(_ztjtj) + ",";
			//tablestr = tablestr + "\"netprice\":" + $.trim(_realprice) + ",";
			//tablestr = tablestr + "\"storediscount\":" + $.trim(_discount) + ",";
			//tablestr = tablestr + "\"orderitemtype\":\"" + $.trim(_ordertItemype) + "\",";
			//tablestr = tablestr + "\"lowerlevelsnumber\":\"" + $.trim(_leveladdgifts) + "\",";
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
		return tableinfo;
	}
	
	
	
	
	$("#statementaccount").dialog("destroy");
	$("#statementaccount").dialog({
		autoOpen : false,
		height : 150,
		width : 620,
		modal : true,
		buttons : {
			"提交" : function() {
				
				submitOutStock();
				
			},
			"关闭" : function() {
				$(this).dialog("close");
			}
		}

	});
	
	
		// 改变下层赠品数量
	function changeNextLevel(object, filedaname) {
		oldvalue = $(object).find("div[id^='" + filedaname + "']").text();
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (oldvalue != "00") {
				$(object).find("div[id^='" + filedaname + "']").text(Number(oldvalue) - 10); // 下个编号少10
			// 如果是赠品类的销售则不用减少upgiftnumber,因为上层已减少
		}
	}
	
	
	
});