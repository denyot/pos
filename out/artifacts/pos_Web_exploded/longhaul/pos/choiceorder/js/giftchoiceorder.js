$(function() {
	$(document).keydown(function(e) {
		var target = e.target;
		var tag = e.target.tagName.toUpperCase();
		if (e.keyCode == 8) {
			if ((tag == 'INPUT' && !$(target).attr("readonly")) || (tag == 'TEXTAREA' && !$(target).attr("readonly"))) {
				if ((target.type.toUpperCase() == "RADIO") || (target.type.toUpperCase() == "CHECKBOX") || (target.type.toUpperCase() == "BUTTON")) {
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		}
	});
	
	$("#choiceorderid").attr('disabled',true);
	$("#saporderid").attr('disabled',true);
	$("#remark2").attr('disabled',true);
	

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
	var decimalReg = /^[+\-]?\d+(.\d+)?$/;
	var numberReg = /^[+\-]?\d+(\d+)?$/;
	var orderType;
	var needGetMatnr = 0 ;

	$('#ordersystemtable td').addClass('tdclass'); // 增加td样式


	$("#charg").keydown(function(event) {
		if($('#type').get(0).selectedIndex == 0){
			jAlert("请先选择选款类型！！","提示",function(e){
				$("#charg").val('');
				$('#type').focus();
			});
			return;
		}
		
		if (event.keyCode == 13) {
			$("#matnrinput").show();
			$("#matnrselect").hide();
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
			var choiceOrderType = $('#type').get(0).value;
			_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
			_charg = $("#charg").val().toUpperCase();
			$.ajax({
				url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getpcxx&postType=1&option=auto&werks=" + "01DL" + "&random=" + Math.random() + "",
				dataType : "json",
				data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype+"&choiceOrderType="+choiceOrderType,
				success : function(data) {
					if (data == "") { 	
						var chargalertstr = "输入批次不存在!";
						chargalertstr = _chargtype == "gift" ? "输入批次不存在!" : chargalertstr
						jAlert(chargalertstr,"提示",function(e){
							clearcharginfo();
							$("#charg").focus();
						});
						response(null);
						return null;
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
							label : cpbm
						// + "->" + zhlhx
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
		// $("#toneRow").css("display","none");
		// $("#bowlderRow").css("display","none");
		// $("#goldRow").css("display","none");
		tempchargNo = $("#charg").val();
		_mycharg = tempchargNo.substring(0, tempchargNo.indexOf("->"));
		_ordertype = $("#ordertype").val();
		_chargtype = $('input:radio[name="chargtype"]:checked').val();
		_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
		_charg = tempchargNo.indexOf("->") > 0 ? _mycharg : tempchargNo;
		_charg = _charg.toUpperCase();
		var choiceOrderType = $('#type').get(0).value;
		$("#charg").val(_charg);
//		$.ajaxSetup({
//			error : function(x, e) {
//				jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>","提示",function(e){});
//				return false;
//			}
//		});
		$.ajax({
			url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getpcxx&option=user&postType=1&werks=" + "01DL" + "&random=" + Math.random() + "",
			dataType : "json",
			data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype+"&choiceOrderType="+choiceOrderType+
				(($("#type").val() == 'J1' || $("#type").val() == 'J2'|| $("#type").val() == 'J3'|| $("#type").val() == 'J4'|| $("#type").val() == 'J5') ? "&zzfst="+0 : ""),
			success : function(data) {
				if (data == "") {
					var chargalertstr = "输入批次不存在!";
					chargalertstr = _chargtype == "gift" ? "输入批次不存在!" : chargalertstr
					jAlert(chargalertstr,"提示",function(e){
						clearcharginfo();
						$("#charg").focus();
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
					var lgort = item.lgort == null ? "" : item.lgort; // 库位信息
					var charglabst = item.labst == null ? 1 : item.labst; // 批次数量

					var zgy = item.zgy;
					var slbm = item.slbm;
					var slxz = item.slxz;
					var slys = item.zslys;
					var slgg = item.slgg;
					var zsjd = item.zsjd;
					var kondm = item.kondm;
					var extwg = item.extwg;
					var zccnn = item.zccnn;
					var matkl = item.matkl;
					var hpzl = item.hpzl;
					var bismt = item.bismt;
					var zjlbm = item.zjlbm;

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
						zplb : zplb,
						usedorderid : usedorderid,
						lgort : lgort,
						charglabst : charglabst,
						zgy : zgy,
						slbm : slbm,
						slxz : slxz,
						slys : slys,
						slgg : slgg,
						zsjd : zsjd,
						kondm : kondm,
						zjlbm : zjlbm,
						extwg : extwg,
						zccnn : zccnn,
						matkl : matkl,
						bismt : bismt,
						hpzl : hpzl
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
		
		
		$("#zhlhx").val(charginfo.zhlhx);
		$("#ztjtj").val(charginfo.ztjtj);
		//$("#number").val(1);
		$("#realnumber").val(charginfo.charglabst);
		$("#realprice").val(charginfo.realprice); // 实收
		$("#goldweight").val(charginfo.goldweight); // 金重
		$("#gemweight").val(charginfo.gemweight); // 石重
		$("#goodsize").val(charginfo.zccnn);// 货品尺寸
		$("#extwg").val(charginfo.extwg);// 货品款式
		$("#matkl").val(charginfo.matkl);// 核价系数
		$("#goodTotalWeight").val(charginfo.hpzl);// 货品重量
		$("#bismt").val(charginfo.bismt);//主模号
		$("#retailPrice").val('0-0');//主模号
		
		}
//		$("#matnrselect").empty();
//		$("#matnrselect").append($("<option>"+charginfo.matnr+"</option>"));
//		$("#matnrselect").show();
//		$("#matnrinput").css("display","none");
		$("#matnrinput").val(charginfo.matnr);

		$("#certificateno").val(charginfo.certificateno);
		$("#logrt").val(charginfo.lgort);
		var zgy = charginfo.zgy.split(',');
		var sjczbm = $.trim(charginfo.sjczbm);
		var slbm = $.trim(charginfo.slbm);
		var slxz = $.trim(charginfo.slxz);
		var slys = $.trim(charginfo.slys);
		var slgg = $.trim(charginfo.slgg);
		var zsjd = $.trim(charginfo.zsjd);
		var bismt = $.trim(charginfo.bismt);
		
		
		
		if($("#type").val() == 'Y1'){
			if(charginfo.zjlbm != null &&charginfo.zjlbm != ''){
				$("#ifinlay").attr("checked",true);
				$("#goldRow").show();
				getGoldType('all',charginfo.zjlbm);
			}else{
				$("#ifinlay").attr("checked",false);
				$("#goldRow").show();
			}
		}
		
		

		//getCurrentPrice(charginfo.kondm, slbm, charginfo.gemweight, slxz, slys, zsjd, charginfo.zgy, charginfo.extwg);

		if (orderType == 1) {

		}
		
		
		if ((orderType == 1 || orderType == 2))
			getToneColor($("#type").val(), slys , slbm);
		else {
			$("#bowlderRow").css("display", "");
			getToneColor2($("#type").val(), slys , slbm);
		}

		if (orderType == 2) {
			$("#toneRow").css("display", "");
			getToneNeatness(zsjd);
		}

		
		if(charginfo.bismt == "" || charginfo.bismt == null){
	
			if (slbm != "" && slbm != null) {
				if (orderType == 2)
					$("#toneRow").css("display", "");
				getToneType($("#type").val(), slbm);
			}
	
			if (orderType == 3) {
				$("#bowlderRow").css("display", "");
				getToneShape(slxz);
			}
	
			// if (slys != "" && slys != null) {
			// if (orderType == 3) {
			// $("#bowlderRow").css("display", "");
			// getToneColor2("all", slys);
			// }
			// }
	
		
			if (orderType == 1 || orderType == 2)
				$("#goldRow").css("display", "");
			gettechnics(zgy);
	
			// var type = sjczbm.substring(0, 1) == "P"? sjczbm.substring(0, 2):
			// sjczbm.substring(0, 1);
			if (orderType == 2 || orderType == 3)
				getGoldType("all", sjczbm);
			else
				getGoldType($("#type").val(), sjczbm);
				
				
			
			}else{
				getBismtInfo(charginfo.bismt,slxz,slgg,zgy,sjczbm,slbm);
			}

		// var zplb = charginfo.zplb;
		// if (zplb == "ZP") { // 增品
		// $("#logrt").val("0011");
		// } else if (zplb == "ZL") { // 增链
		// $("#logrt").val("0005");
		// }
		$("#personcost").val(charginfo.personcost);
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

		// $("#number").val("1");
		_ordertype = $("#ordertype").val();
		if (_ordertype == "ZKL") { // 交货免费得到积分
			_charg = charginfo.label;
			getgiftjf(_charg);
		}
		if (_ordertype == "ZOR4") {
			$("#swaptype").focus();
		} else {
			$("#charg").removeClass("inputkey");
			if (orderType == 1) {
				$("#goldType").focus();
			} else if (orderType == 2) {
				$("#toneType").focus();
			} else {
				$("#bowlderType").focus();
			}
		}
		$("#showmatnrinfo").show();
		$("#showmatnrinfo2").show();
		$("#showoptinfo").show();

	}


	function clearcharginfo() {
		$("#charg").val("");
		$("#matnrinput").val("");
		$("#matnrselect").val("");
		$("#zhlhx").val("");
		$("#ztjtj").val("");
		$("#realprice").val("");
		$("#goldweight").val("");
		$("#gemweight").val("");
		$("#certificateno").val("");
		$("#personcost").val("");
		$("#remark").val("");
		$("#goodsize").val("");
		//$("#retailPrice").val("");
		$("#bowlderType").val("");
		$("#goodsizeRang").html("");
		$("#mainToneWeightRang").html("");
		$("#goldvalue").val("0");
		$("#charg").addClass("inputkey");
		$("#toneColor").val('');
		$("#goldweightFrom").val('');
		$("#goldweightTo").val('');
		$("#toneNeatness").val('');
		$("#toneType").val('');
		if($("#type").val() == 'Y1'){
			$("#ifinlay").attr('checked',false);
			$("#goldRow").hide();
			$("#toneFireColor").val('');
			$("#toneshape").val('');
		}
		$("#goldType").val('');
		//$("#number").val('');
		$("#lessToneType").val('');
		$("#toneNeatness").val('');
		//$("#toneNeatness").append("<option value=''>请选择...</option>");
		$("#lessToneSpan").hide();
		$("#toneType").val('');
//		$("#toneType").append("<option value=''>请选择...</option>");
		$("#toneColor").val('');
		$("#toneColor2").val('');
//		$("#toneColor").append("<option value=''>请选择...</option>");
		$("#goldType").val('');
//		$("#goldType").append("<option value=''>请选择...</option>");
		$("#technics").val('');
//		$("#technics").append("<option value=''>请选择...</option>");
		$("#mainToneStyle").val('');
//		$("#mainToneStyle").append("<option value=''>请选择...</option>");
		$("#gemweight").val('');
		$("#ifNeedLessTone").attr('checked',false);
		$("#matnrinput").focus();
	}

	$("#remark").keydown(function(event) {
		if(event.keyCode == 13){
			checkAddRow();
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
		var currType = $("#type").val();
		var chargtype = $('input:radio[name="chargtype"]:checked').val();
		var rownum = $("#tablecontent tr").length - 2;
		var toplevelstr = ""; // 用于保存上存文本
		var upnumbertext = "";// 记录上存文体
		_ordertype = $("#ordertype").val(); // 订单类型字段
		//if (chargtype == "charg") {
			upnumber = Number(toplevelnumber) * 10;
			toplevelnumber = toplevelnumber + 1;
			style = "tdtoplevel";
			upnumbertext = "00";
			toplevelstr = "<div id=leveladdgifts" + upnumber + " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品
		_number = $("#number").val(); // 数量
		var delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
		var row = "<div id=" + rownum + ">" + delimage + "</div>";
		var posnrnumber = "<div  id=posnrnumber" + rownum + "> " + upnumber + " </div>" + "<div id=upnumber" + chargtype + rownum + " style='display:none'>" + upnumber + "</div>" + toplevelstr + "";
		var upumber = "<div id=upnumberlevel" + rownum + ">" + upnumbertext + "</div>";

		var  _tempmatnr = "";
			_tempmatnr =  $("#matnrinput").val()  ;

		var matnr = "<div id=matnr" + rownum + ">" + _tempmatnr.toUpperCase() + "&nbsp; </div>"; // 物料

		var zhlhx = "<div id=zhlhx" + rownum + ">" + $("#zhlhx").val() + "&nbsp; </div>"; // 商品ID
		
		var tbtxt = "<div id=tbtxt" + rownum + ">" + $("#retailPrice").val() + "&nbsp; </div>"; // 商品ID
		
		var number = "<div id=number" + rownum + ">" + Number(_number) + "</div>"; // 数量

		var remark = "<div id=remark" + rownum + ">" + $("#remark").val() + "&nbsp;</div>"; // 备注
		

		// 将输入设置为空
		clearcharginfo();
		var row = "<tr><td class=" + style + " >" + row + "</td>";
		row = row + "<td class=" + style + " style='font-size:20px;'>" + posnrnumber + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + upumber + "</td>";
		row = row + "<td class=" + style + " style='font-size:20px;'>" + matnr + "</td>";
		row = row + "<td class=" + style + " style='font-size:20px;'>" + zhlhx + "</td>";
		row = row + "<td class=" + style + " style='font-size:20px;'>" + tbtxt + "</td>";
		row = row + "<td class=" + style + " align='right'  style='font-size:20px;'>" + number + "</td>";

		row = row + "<td class=" + style + " align='right'  style='font-size:20px;'>" + remark + "</td>"; // 备注
		
		
		row = row + "</tr>";
			$(row).insertAfter($("#tablecontent tr:eq(" + rownum + ")"));
			upbynumber = Number(upbynumber) + 1;
			$("#matnrinput").show();
			$("#matnrinput").val('');
			$("#number").val('');
			$("#retailPrice").val('');
			getTotal();	
	}


	$('#delrow').live('click', function() {
		var thistr = $(this).parents("tr:first");
		jConfirm("确定删除该条记录吗？","请确认？",function(e){
			if(e){
				upnumberlevel = $(thistr).find("div[id^='upnumberlevel']").text(); // 得到上层及本层.
				upnumberlevelvalue = $("#leveladdgifts" + upnumberlevel).text(); // 得到上层有多上赠品
		
				var nexttrobj = thistr;
				var nextchildobject = thistr;
				_ordertype = $("#ordertype").val(); // 订单类型字段
				if (upnumberlevel == "") {
					jAlert('删除错误!',"提示",function(e){});
					return false;
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
				thistr.remove();
				if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
					upgiftnumber = Number(upgiftnumber) - 1;
					$("input[type=radio][name=chargtype][value=gift]").attr("checked", "checked");
				} else {
					$("input[type=radio][name=chargtype][value=charg]").attr("checked", "checked");
					$("#charglabel").html("条&nbsp;&nbsp;&nbsp;&nbsp;码: ");
					$("#matnr").show();
					$("#matnrlabel").show();
				}
				$(thistr).find("div").each(function() {
				});
				trlength = $("#tablecontent tr").length;
				if (trlength == 2) {
					$("#type").attr("disabled", false);
				}
						
			}
		});

	});


	// 付款
	$("#submit").click(function() {
			submitValidate();
	})
	
	
	
	function submitValidate(){
		
			if ($("#ordertype").val() == "ZOR4" && !checkChangeInfo()) {// 检查换货输入信息
				$("#charg").focus();
			} else {
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
				}else {
					
					if($("#custommade").attr("checked") == "checked" ){
						if($("#vipid").val()==''){
							jAlert("请输入定制的顾客！","提示",function(e){
								$("#vipid").select();
							});
							return;
						}
						else if($("#urgent").get(0).selectedIndex == 0){
							jAlert("请选择加急状态！","提示",function(e){
								$("#urgent").focus();
							});
							return;
						}
						
					}
					
					jConfirm("确定提交吗？","提示" , function(e){
						if(e==true)
							submitOrder();
					});
					//$("#statementaccount").dialog("open");
				}
			}
		
	}
	
	

	function submitOrder() {
		var orderInfo = getordertableinfo();
		var dialog = $.dialog({
			title:'提交中...',
			max: false,
   		 	min: false,
   		 	close : false,
   		 	lock : true
   		 	});
		
		$.ajax({
			url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=saveChoiceOrderForGift&option=user&postType=1",
			data : {
				orderitem : orderInfo.orderitem,
				orderhead : orderInfo.orderhead
			},
			type : 'post',
			dataType : 'json',
			success : function(data) {
				dialog.close();
				var msg = "";
				if(data.dailygolderror != null){
					msg += data.dailygolderror + "<br/>";
				}
				if(data.error != null)
					msg += data.error + "<br/>";
				if(data.success != null)
					msg += data.success + "<br/>";
				if(data.loginError != null)
					msg += data.loginError + "<br/>";
					
				jAlert(msg,"提示",function(e){
					if(data.success!=null){
						location.reload();
					}
				});
			}
		});

	}
	

	function getordertableinfo() {
		trlength = $("#tablecontent tr").length;
		var orderhead = "";
		
		_choiceorderid = $("#choiceorderid").val();
		orderhead = orderhead + "\"choiceorderid\":\"" + $.trim(_choiceorderid) + "\",";
		
		_ordertime = $("#ordertime").val();
		orderhead = orderhead + "\"saledate\":\"" + $.trim(_ordertime) + "\",";
		
		_totalnumber = $("#totalnumber").text();
		orderhead = orderhead + "\"quantity\":\"" + $.trim(_totalnumber) + "\",";

		// 联系方式
		_contract = $("#contract").val();
		orderhead = orderhead + "\"telephone\":\"" + $.trim(_contract) + "\",";

		// 订单头备注
		_headremark = $("#headermark").val();
		orderhead = orderhead + "\"remark\":\"" + $.trim(_headremark) + "\",";
		
		orderhead = orderhead + "\"orderflag\":\"NO\"";

		orderhead = "{" + orderhead + "}";

		var tablestr = "";
		$("#tablecontent tr").each(function() { // 得到每一个tr
			earchobject = $(this);

			if (earchobject.index() == 0 || earchobject.index() + 1 == trlength) {
				return true;
			}
			_posnrnumber = earchobject.find("div[id^='posnrnumber']").text();
			
			_matnr = earchobject.find("div[id^='matnr']").text();// 物料号
			
			_zhlhx = earchobject.find("div[id^='zhlhx']").text(); // 商品名
			
			_number = earchobject.find("div[id^='number']").text();// 数量

			_remark = earchobject.find("div[id^='remark']").text();// 备注
			
			_tbtxt = earchobject.find("div[id^='tbtxt']").text();// 备注
			

			tablestr = tablestr + "\"" + earchobject.index() + "\":";
			
			tablestr = tablestr + "{\"choiceorderitem\":\"" + $.trim(_posnrnumber) + "\",";
			
			tablestr = tablestr + "\"materialnumber\":\"" + $.trim(_matnr) + "\",";
			
			tablestr = tablestr + "\"materialdesc\":\"" + $.trim(_zhlhx) + "\",";
			
			tablestr = tablestr + "\"quantity\":" + $.trim(_number) + ",";

			tablestr = tablestr + "\"remark\":\"" + $.trim(_remark) + "\",";
			
			tablestr = tablestr + "\"tbtxt\":\"" + $.trim(_tbtxt) + "\"}";

			tablestr = earchobject.index() == trlength - 2 ? tablestr : tablestr + ",";
		});

		tablestr = "{" + tablestr + "}";
		var tableinfo = {
			orderhead : orderhead,
			orderitem : tablestr
		};
		return tableinfo;
	}


	// 改变下层赠品数量
	function changeNextLevel(object, filedaname) {
		oldvalue = $(object).find("div[id^='" + filedaname + "']").text();
		_ordertype = $("#ordertype").val(); // 订单类型字段
		if (oldvalue != "00") {
			$(object).find("div[id^='" + filedaname + "']").text(Number(oldvalue) - 10); // 下个编号少10
			// 如果是赠品类的销售则不用减少upgiftnumber,因为上层已减少
		}
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
		//cleatTotaltr();
	}

	$("#matnrinput").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($.trim($("#matnrinput").val()) != "") {
				$("#matnrinput").autocomplete("close");
				$("#number").val('');
				getmatnrbyuser();
			}
		}
	}).keypress(function(event) {

	}).autocomplete({
		source : function(request, response) {
			_matnr = $("#matnrinput").val().toUpperCase();
			$.ajax({
				url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getMatnrInfo&postType=1&option=auto&werks=" + "01DL" + "&random=" + Math.random() + "",
				dataType : "json",
				data : "matnr=" + $.trim(_matnr),
				success : function(data) {
					if (data == "") {
						jAlert("输入物料号不存在!","提示",function(e){
							clearcharginfo();
							$("#matnrinput").focus();
						});
						response(null);
						return;
					}
					response($.map(data, function(item) {
						var matnr = item.matnr == null ? "" : item.matnr; // 物料号
						var zhlhx = item.maktx == null ? "" : item.maktx; // 产品名称
						cpbm = $.trim(matnr);
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
	function getmatnrbyuser() {
		if($("#matnrinput").css("display") != 'none')
			tempmatnrNo = $("#matnrinput").val();
		else
			tempmatnrNo = $("#matnrselect").val();
		_mycharg = tempmatnrNo.substring(0, tempmatnrNo.indexOf("->"));
		_matnr = tempmatnrNo.indexOf("->") > 0 ? _mycharg : tempmatnrNo;
		_matnr = _matnr.toUpperCase();
		$("#matnrinput").val(_matnr);
		$.ajaxSetup({
			error : function(x, e) {
				jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>","提示",function(e){});
				return false;
			}
		});
		$.ajax({
			url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getMatnrInfo&option=user&postType=1&werks=" + "01DL" + "&random=" + Math.random() + "",
			dataType : "json",
			data : "matnr=" + $.trim(_matnr),
			success : function(data) {
				if (data == "") {
					jAlert("类型不符，请选择其他物料号！","提示",function(e){
						clearcharginfo();
					});
				}
				$.map(data, function(item) {
					var matnr = item.matnr == null ? "" : item.matnr; // 物料号
					var zhlhx = item.maktx == null ? "" : item.maktx; // 产品名称
					var ztjtj = item.kbetr == null ? 0 : item.kbetr; // 标签价
					var pcimage = item.zmatnrt == null ? "" : item.zmatnrt; // 照片
					var sjczbm = item.zjlbm == null ? "" : item.zjlbm; // 金料类型
					var zgy = item.zgy; // 工艺类型
					var slbm = item.zslbm;// 石料编码
					var slxz = item.zslxz;// 石料形状
					var slys = item.zslys;// 石料颜色
					var slgg = item.zslgg;// 石料规格
					var zsjd = item.labor;// 石料净度
					var kondm = item.kondm;// 商品定价组
					var extwg = item.extwg;// 款式
					var matkl = item.matkl;// 商品类目
					var bismt = item.bismt;// 主模号
					var zjlbm = item.zjlbm;
					var tbtxt = item.tbtxt;
					
					cpbm = $.trim(matnr);
					var info = {
						label : cpbm,
						matnr : matnr,
						zhlhx : zhlhx,
						ztjtj : ztjtj,
						pcimage : pcimage,
						zgy : zgy,
						slbm : slbm,
						slxz : slxz,
						slys : slys,
						slgg : slgg,
						zsjd : zsjd,
						kondm : kondm,
						sjczbm : sjczbm,
						extwg : extwg,
						bismt : bismt,
						zjlbm : zjlbm,
						tbtxt : tbtxt,
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
		$("#charg").val("");
		$("#zhlhx").val(charginfo.zhlhx);
		$("#ztjtj").val(charginfo.ztjtj);
		$("#retailPrice").val(charginfo.tbtxt);
		$("#number").focus();
	}

	if (opmode == 'view' || opmode == 'edit')
		creatTablehead(choiceOrderId);

	// 设置订单头信息
	function creatTablehead(choiceorderid) {
		$.ajaxSetup({
			error : function(x, e) {
				jAlert("访问服务器错误信息:" + x.responseText,"提示",function(e){});
					return false;
				}
			});
			$.getJSON("longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getChoiceOrderHeaderInfoForGift&postType=1", {
				choiceorderid : choiceorderid,
				random : Math.random()
			}, function(data) {
				//alert(data.saporderid);
				//alert(data.type);
		
				$("#type").val(data.type);
				$("#choiceorderid").val(data.choiceorderid);
				$("#saporderid").val(data.saporderid);
				$("#totalnumber").text(data.quantity);
				$("#totalgoldweight").text(data.totalgoldweight);
				$("#totalsubtotal").text(data.totalmoney);
				$("#choiceorderid").attr("readonly",true);
				$("#saporderid").attr("disabled",true);
				$("#remark2").attr("readonly",true);
				$("#remark2").val(data.remark);
				$("#contract").val(data.telephone);
				$("#oldtotalmoneySpan").show(); 
				$("#oldtotalmoney").text(data.oldtotalmoney);
				$("#oldquantity").text(data.quantity);
				$("#headermark").val(data.remark);
				//alert(data.remark);
				$("#type").attr("disabled", true);
				if(data.custommade == 'X'){
					$('#custommade').attr('checked','checked');
					$("#urgentSpan").show();
					$("#vipInfoSpan").show();
					$("#vipid").val(data.vipid);
					$("#urgent").val(data.urgent);
				}
				
				//changeType();
				if (data == "") {
					jAlert("选款下单信息不存在!","提示",function(e){});
					return;
				}
				
				
				if (opmode != "view") {
					
					$("#charg").attr("disabled", false);
					$("#charg").attr("readOnly", false);
					$("#charg").attr("disabled", false);
					$("#toneType").attr("disabled", false);
					$("#goldType").attr("disabled", false);
					$("#toneColor").attr("disabled", false);
					$("#toneNeatness").attr("disabled", false);
					$("#gemweight").attr("disabled", false);
					$("#ifNeedLessTone").attr("disabled", false);
					$("#custommade").attr("disabled", false);
					$("#submit").attr("disabled", false);
					$("#calcNewPrice").attr("disabled", false);
					$("#matnrinput").attr("disabled", false);
					$("#goodsize").attr("disabled", false);
					$("#goodTotalWeight").attr("disabled", false);
					$("#zhlhx").attr("disabled", false);
					$("#number").attr("disabled", false);
					$("#btnAddRow").attr("disabled", false);
					$("#retailPrice").attr("disabled", false);
					$("#remark").attr("disabled", false);	
					$("#contract").attr("disabled", false);
					$("#headermark").attr("disabled", false);
					$("#vipid").attr("disabled", false);	
					$("#urgent").attr("disabled", false);	
					$("#vipid").attr("readOnly", false);	
					$("#urgent").attr("readOnly", false);	
					$("#kunnr").removeClass("inputkey").addClass("inputnom");
					$("#charg").addClass("inputkey");
					//$("#charg").focus();
		
				}else{
					$("#charg").attr("disabled", true);
					$("#charg").attr("readOnly", true);
					$("#charg").attr("disabled", true);
					$("#toneType").attr("disabled", true);
					$("#goldType").attr("disabled", true);
					$("#toneColor").attr("disabled", true);
					$("#toneNeatness").attr("disabled", true);
					$("#gemweight").attr("disabled", true);
					$("#ifNeedLessTone").attr("disabled", true);
					$("#custommade").attr("disabled", true);
					$("#submit").attr("disabled", true);
					$("#btnAddRow").attr("disabled", true);
					$("#getMatnrInfo").attr("disabled", true);
					$("#calcNewPrice").attr("disabled", true);
					$("#matnrinput").attr("disabled", true);
					$("#goodsize").attr("disabled", true);
					$("#goodTotalWeight").attr("disabled", true);
					$("#mainToneStyle").attr("disabled", true);
					$("#technics").attr("disabled", true);
					$("#zhlhx").attr("disabled", true);
					$("#number").attr("disabled", true);
					$("#retailPrice").attr("disabled", true);
					$("#remark").attr("disabled", true);
					$("#contract").attr("disabled", true);
					$("#headermark").attr("disabled", true);
					$("#vipid").attr("disabled", true);	
					$("#urgent").attr("disabled", true);	
					//$("#kunnr").removeClass("inputkey").addClass("inputnom");
					//$("#charg").addClass("inputkey");
					//$("#charg").focus();
				}
				creatTableRow(choiceorderid);
			});
		}
		
		// 修改的时候创建ROW
		function creatTableRow(salesorderid) {
			$.getJSON("longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getChoiceOrderItemForGift&postType=1", {
				salesorderid : salesorderid,
				random : Math.random()
			}, function(data) {
				cleartable(); // 先清除table内容
				toplevelnumber = 1;
				$.each(data, function(key, val) {
					var upnumber = 1;
					var style = "";
					var currType = $("#type").val();
					var chargtype = $('input:radio[name="chargtype"]:checked').val();
					var rownum = $("#tablecontent tr").length - 2;
					var toplevelstr = ""; // 用于保存上存文本
					var upnumbertext = "";// 记录上存文体
					_ordertype = $("#ordertype").val(); // 订单类型字段
					upnumber = Number(toplevelnumber) * 10;
					toplevelnumber = toplevelnumber + 1;
					style = "tdtoplevel";
					upnumbertext = "00";
					toplevelstr = "<div id=leveladdgifts" + upnumber + " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品
					
							
					var delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
					var row = "<div id=" + key + ">" + (opmode == 'view' ? "" : delimage) + "</div>";
					
					var posnrnumber = "<div  id=posnrnumber" + val.choiceorderitem + "> " + upnumber + " </div>" + "<div id=upnumber" + chargtype + rownum + " style='display:none'>" + upnumber + "</div>" + toplevelstr + "";
					var upumber = "<div id=upnumberlevel" + rownum + ">" + upnumbertext + "</div>";
				
					var _tempcharg = val.batchnumber;
					var _tempmatnr = val.materialnumber;
				
					//var charg = "<div id=charg" + rownum + ">" + _tempcharg.toUpperCase() + "&nbsp;</div>"; // 批次
					var matnr = "<div id=matnr" + rownum + ">" + _tempmatnr.toUpperCase() + "&nbsp;</div>"; // 物料
				
					var zhlhx = "<div id=zhlhx" + rownum + ">" + val.materialdesc + "&nbsp; </div>"; // 商品ID
					var number = "<div id=number" + rownum + ">" + Number(val.quantity) + "</div>"; // 数量
//					var ifinlay = val.ifinlay;
//					var ifinlayDiv = "<div id=ifinlay" + rownum + " style='display:none'>" + ifinlay + "</div><div id='ifinlayShow"+rownum+"'>" + (ifinlay == "X" ? "是" : "否") + "</div>"; // 是否需要镶嵌
					
//					var toneTypeShow = val.tonetype != null ? (val.tonetype.substring((val.tonetype.indexOf('|-|') != -1 ? val.tonetype.indexOf('|-|')+3 : 0))) : " " ;
//						var toneType = "<div id=toneType" + rownum + " style='display:none'>" + (val.tonetype) + "</div><div id='toneTypeShow"+rownum+"'>"
//								+ toneTypeShow + "</div>"; // 石料
				
					var tbtxt = "<div id=toneWeight" + rownum + ">" + val.tbtxt + "</div>"; // 主石重
				
//					// 石料颜色
//					var toneColorShow = val.tonecolor != null ? (val.tonecolor.substring(val.tonecolor.indexOf('|-|') != -1?val.tonecolor.indexOf('|-|')+3:0)) : "&nbsp;";
//					var toneColor = "<div id=toneColor" + rownum + " style='display:none'>"
//							+ (val.tonecolor) + "</div><div id='toneColorShow"+rownum+"' >"
//							+ toneColorShow
//							+ "</div>";
				
//					// 石料净度
//					var toneNeatnessShow = val.toneneatness != null ? (val.toneneatness.substring((val.toneneatness.indexOf('|-|') != -1 ? val.toneneatness.indexOf('|-|')+3 : 0))) : "&nbsp;";
//					var toneNeatness = "<div id=toneNeatness" + rownum + " style='display:none'>" + (val.toneneatness) + "</div><div id='toneNeatnessShow"+rownum +"'>"
//							+ toneNeatnessShow + "</div>";
				
//					// 石料形状$("#toneshapeth").css("display", "none");
//					var toneshapeShow = val.toneshape != null ? (val.toneshape.substring((val.toneshape.indexOf('|-|') != -1 ? val.toneshape.indexOf('|-|')+3 : 0))) : "&nbsp;";
//					var toneshape = "<div id=toneshape" + rownum + " style='display:none'>" + (val.toneshape) + "</div><div id='toneshapeShow"+rownum +"'>"
//							+ (toneshapeShow) + "</div>";
				
//					// 金料
//					var goldtypeShow = val.goldtype != null ? (val.goldtype.substring((val.goldtype.indexOf('|-|') != -1 ? val.goldtype.indexOf('|-|')+3 : 0))) : "&nbsp;";
//					var goldType = "<div id=goldType" + rownum + " style='display:none'>" + (val.goldtype) + "</div><div id='goldtypeShow"+rownum +"'>"
//							+ (goldtypeShow) + "</div>";
//				
//					// 工艺
//					var technicsShow = val.technics != null ? (val.technics.substring((val.technics.indexOf('|-|') != -1 ? val.technics.indexOf('|-|')+3 : 0))) : "&nbsp;";
//					var technics = "<div id=technics" + rownum + " style='display:none'>" + (val.technics) + "</div><div id='technicsShow"+rownum +"'>"
//							+ (technicsShow) + "</div>";
				
//					var goodsize = "<div id=goodsize" + rownum + ">" + val.goodsize + "</div>"; // 货品尺寸
				
//					var retailPrice = "<div id=retailPrice" + rownum + ">" + val.retailprice + "&nbsp;</div>"; // 市场零售价参考
					//alert(val.retailprice);
				
					var remark = "<div id=remark" + rownum + ">" + val.remark + "&nbsp;</div>"; // 备注
//					var littleTotal = val.littletotal;// 小计金额
//					var littleTotalDiv = "<div id=littleTotal" + rownum + ">" + littleTotal + "</div>"; // 小计金额DIV
				
//					var ifNeedLessTone = val.ifneedlesstone;
//					var ifNeedLessToneDiv = "<div id=ifNeedLessTone" + rownum + " style='display:none'>" + ifNeedLessTone + "</div><div id='ifNeedLessToneShow"+rownum+"'>" + (ifNeedLessTone == "X" ? "是" : "否") + "</div>"; // 是否需要副石Div
				
					// 副石
//					var lessToneTypeShow =  val.lesstonetype != null ? (val.lesstonetype.substring((val.lesstonetype.indexOf('|-|') != -1 ? val.lesstonetype.indexOf('|-|')+3 : 0))) : "&nbsp;";
//					var lessToneTypeDiv = "<div id=lessToneType" + rownum + " style='display:none'>" + (val.lesstonetype != null ? val.lesstonetype : "")
//							+ "</div><div id='lessToneTypeShow"+rownum +"'>" + (lessToneTypeShow) + "</div>";
				
					// 证书
//					var certificateShow =  val.certificate != null ? (val.certificate.substring((val.certificate.indexOf('|-|') != -1 ? val.certificate.indexOf('|-|')+3 : 0))) : "&nbsp;";
//					var certificateDiv = // "<div id=certificate" + rownum + "
//					"<div id=certificate" + rownum + " style='display:none'>" + (val.certificate) + "</div><div id='certificateShow"+rownum +"'>"
//							+ (certificateShow) + "</div>";
				
//					// 火彩颜色
//					var toneFireColorShow =  val.tonefirecolor != null ? (val.tonefirecolor.substring((val.tonefirecolor.indexOf('|-|') != -1 ? val.tonefirecolor.indexOf('|-|')+3 : 0))) :  "&nbsp;";
					
//					var toneFireColor = "<div id=toneFireColor" + rownum + " style='display:none'>" + (val.tonefirecolor) + "</div><div id='toneFireColorShow"+rownum +"'>"
//							+ (toneFireColorShow) + "</div>";
					// 主石规格
//					var mainToneStyleShow =  val.maintonestyle != null ? (val.maintonestyle.substring((val.maintonestyle.indexOf('|-|') != -1 ? val.maintonestyle.indexOf('|-|')+3 : 0))) : "&nbsp;";
					
//					var mainToneStyle = "<div id=mainToneStyle" + rownum + " style='display:none'>" + (val.maintonestyle == null ? "" : val.maintonestyle) + "</div><div id='mainToneStyleShow"+rownum +"'>"
//							+ (mainToneStyleShow) + "</div>";
//				
//					var goldweight = Number(val.goldweight).toFixed(3);
//					var goldweightdiv = "<div id=goldweight" + rownum + " style='display:none;'>" + goldweight + "</div>"; // 金重
					
					
					
//					var mygoldweight = val.mygoldweight;
//					var mygoldweights =	mygoldweight == null ? "" : mygoldweight.split('-');
//					var mygoldweightdiv = "<div id=mygoldweight" + rownum + ">" + mygoldweight + "</div>"; // 金重1
				
//					var mycount = Number(val.quantity);
//					var goldweightlittleTotal = (Number(mygoldweights[0])+Number(mygoldweights[1]))/2*mycount;
//					var goldweightlittleTotaldiv = "<div id=goldweightlittleTotal" + rownum + ">" + goldweightlittleTotal + "</div>"; // 金重小计
					
					
//					var imgpath = val.productpictureurl;
//					var imgalt = val.productpictureurl;
//					var imaghref = "<a href=" + imgpath + " class='tooltip' title=" + $("#zhlhx").val() + "(" + $("#ztjtj").val() + ")>";
//					var pcimage = "<div id=pcimage" + rownum + ">" + imaghref + "<img id=pcimagesrc  alt='" + imgalt + "' src=sappic/" + imgpath + " height='40' width='38' onerror='this.src=\"longhaul\/pos\/order\/images\/zjzb.gif\"'/></a></div>";
					
					
					
//					var oldRetailPrice = "<div id=oldRetailPrice" + rownum + ">" + (val.oldretailprice == null ? 0 : val.oldretailprice) + "</div>"; // 旧市场价
//					var oldYbzjbPrice = "<div id=oldYbzjbPrice" + rownum + ">" + (val.oldybzjbprice == null ? 0 : val.oldybzjbprice)  + "</div>"; // 旧的
//					var oldTonePrice = "<div id=oldTonePrice" + rownum + ">" + (val.oldtoneprice == null ? 0 : val.oldtoneprice) + "</div>"; // 旧石头价
//					var oldTechnicsPrice = "<div id=oldTechnicsPrice" + rownum + ">" + (val.oldtechnicsprice == null ? 0 : val.oldtechnicsprice) + "</div>"; // 旧工艺价
//					var extwg = "<div id=extwg" + rownum + ">" + (val.extwg == null ? "" : val.extwg) + "</div>"; // 旧extwg
//					var matkl = "<div id=matkl" + rownum + ">" + (val.matkl == null ? "" : val.matkl ) + "</div>"; // 旧matkl
//					var kbetr = "<div id=kbetr" + rownum + ">" + (val.kbetr == null ? 0 : val.kbetr )+ "</div>"; // 旧kbetr
//					var oldCostPrice = "<div id=oldCostPrice" + rownum + ">" + (val.oldCostPrice == null ? 0 : val.oldCostPrice) + "</div>"; // 旧市场价
					
					
				
//					$("#goldvalue").removeClass("inputattention");
//					$("#personcost").removeClass("inputattention");
//					$("#charg").addClass("inputkey");
//					$("#realprice").removeClass("inputkey");
					//$("#charg").focus();
				
					// 将输入设置为空
					//clearcharginfo();
					var row = "<tr><td class=" + style + ">" + row + "</td>";
					row = row + "<td class=" + style + "  style='font-size:20px;'>" + posnrnumber + "</td>";
					row = row + "<td class=" + style + "  style='display:none'>" + upumber + "</td>";
					//row = row + "<td class=" + style + ">" + charg + "</td>";
					row = row + "<td class=" + style + "  style='font-size:20px;'>" + matnr + "</td>";
					row = row + "<td class=" + style + "  style='font-size:20px;'>" + zhlhx + "</td>";
					row = row + "<td class=" + style + "  style='font-size:20px;'>" + tbtxt + "</td>";
					row = row + "<td class=" + style + " align='right'  style='font-size:20px;'>" + number + "</td>";
//					if (orderType == 3)
//						row = row + "<td class=" + style + " align='right'>" + ifinlayDiv + "</td>";
//				
//					if (orderType == 2 || orderType == 3)
//						row = row + "<td class=" + style + " align='right'>" + toneType + "</td>";
//				
//					if (orderType == 2 && $("#type").val() != "X2" && $("#type").val() != "X3" && currType != "X4")
//						row = row + "<td class=" + style + " align='right'>" + toneWeightDiv + "</td>";
//				
//					if (orderType == 2 || orderType == 3)
//						row = row + "<td class=" + style + " align='right'>" + toneColor + "</td>";
//				
//					if (orderType == 3)
//						row = row + "<td class=" + style + " align='right'>" + toneshape + "</td>";
//				
//					if (currType == "X2" || currType == "X3") {
//						row = row + "<td class=" + style + " align='right'>" + mainToneStyle + "</td>";
//					}
//				
//					if (orderType == 2 && currType != "X2" && currType != "X3")
//						row = row + "<td class=" + style + " align='right'>" + toneNeatness + "</td>";
//				
//					if (orderType == 1 || orderType == 2 || ifinlay == "X")
//						row = row + "<td class=" + style + " align='right'>" + goldType + "</td>";
//				
//					else if (orderType == 3 && ifinlay == "") {
//						row = row + "<td class=" + style + " align='right'>" + goldType + "</td>";
//					}
//					if (orderType == 1 && currType != "J3" && currType != "X2" && currType != "X3"){
//						row = row + "<td class=" + style + " align='right'>" + goldweightdiv + mygoldweightdiv + "</td>";
//						row = row + "<td class=" + style + " align='right'>" + goldweightlittleTotaldiv + "</td>";
//					}
//					if (orderType == 1 || orderType == 2)
//						row = row + "<td class=" + style + ">" + technics + "</td>";
//				
//					row = row + "<td class=" + style + " align='right'>" + goodsize + "</td>";
//				
//					//if (orderType != 1 || $("#type").val() == "J3")
//						row = row + "<td class=" + style + " align='right'>" + retailPrice + "</td>";
//				
//					//if (orderType != 1 || $("#type").val() == "J3")
//						row = row + "<td class=" + style + " align='right'>" + littleTotalDiv + "</td>";
//				
//					if (orderType == 2) {
//						row = row + "<td class=" + style + " align='right'>" + ifNeedLessToneDiv + "</td>";
//						row = row + "<td class=" + style + " align='right'>" + lessToneTypeDiv + "</td>";
//					}
//				
//					if (currType == "X5" || orderType == 3) {
//						row = row + "<td class=" + style + " align='right'>" + toneFireColor + "</td>";
//					}
//				
//					if ($("#type").val() == "X1" || $("#type").val() == "X4" || $("#type").val() == "Q1") {
//						row = row + "<td class=" + style + ">" + certificateDiv + "</td>";
//					}
				
					row = row + "<td class=" + style + " align='right'>" + remark + "</td>"; // 备注
					
					
					
//					row = row + "<td class=" + style + "  style='display:none'>" + oldRetailPrice + "</td>";
//					row = row + "<td class=" + style + "  style='display:none'>" + oldYbzjbPrice + "</td>";
//					row = row + "<td class=" + style + "  style='display:none'>" + oldTonePrice + "</td>";
//					row = row + "<td class=" + style + "  style='display:none'>" + oldTechnicsPrice + "</td>";
//					row = row + "<td class=" + style + "  style='display:none'>" + extwg + "</td>";
//					row = row + "<td class=" + style + "  style='display:none'>" + matkl + "</td>";
//					row = row + "<td class=" + style + "  style='display:none'>" + kbetr + "</td>";
//					row = row + "<td class=" + style + "  style='display:none'>" + oldCostPrice + "</td>";
//					
					
					
				
					row = row + "</tr>";
							
						
				
				$(row).insertAfter($("#tablecontent tr:eq(" + key + ")"));
			});
		});
	}
	
	
	function checkNum(obj) {
		var objvalue = obj.value.replace(/(^\s*)|(\s*$)/g, "");
		// obj.value = objvalue;
		if (objvalue == "" || objvalue == null) {
			return true;
		} else if (isNaN(objvalue)) {
			jAlert("非法字符，请输入数字","提示",function(e){
				obj.value = "";
			});
			return false;
		} else {
			return true;
		}
	}
	
	
	$("div[id^='number']").live('click',function(){
		var thistd = $(this).parents("td:first");

		if (opmode == 'view')
			return;

		var divedit = $(this);
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
					getNewPriceInTable(thistr);
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
							getNewPriceInTable(thistr);
						} else {
							divedit.html(oldtext);
						}
					} else {
						$(this).focus();
					}

				});

	
	});
	
	$("div[id^='toneWeight']").live('click',function(){
		var thistd = $(this).parents("td:first");

		if (opmode == 'view')
			return;

		var divedit = $(this);
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
					getNewPriceInTable(thistr);
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
							getNewPriceInTable(thistr);
						} else {
							divedit.html(oldtext);
						}
					} else {
						$(this).focus();
					}

				});

	
	});
	
	$("div[id^='goodsize']").live('click',function(){
		var thistd = $(this).parents("td:first");
		

		if (opmode == 'view')
			return;

		var divedit = $(this);
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
					divedit.html($(this).val()); // 设置新值
					//getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
						if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
							thisvalue = $(this).val();
							divedit.html($(this).val());
							//getNewPriceInTable(thistr);
						} else {
							divedit.html(oldtext);
						}
				});

	
	});
	$("div[id^='retailPrice']").live('click',function(){
		if (opmode == 'view')
			return;
		var currType = $("#type").val();
		
		if(currType == "J1" || currType == "J2" || currType == "J4" || currType == "X1")
			return;
			
		var thistd = $(this).parents("td:first");
		


		var divedit = $(this);
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
		var littleTotal = thistr.find("div[id^='littleTotal']");
		var number = thistr.find("div[id^='number']").text();
		
		inputIns.keyup(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).val().indexOf("-")!=-1) {
					divedit.html($(this).val()); // 设置新值
					
					var values = $(this).val().split("-");
					
					var littleTotalValue = Number(values[0])*Number(number)+"-"+Number(values[1])*Number(number);
					littleTotal.html(littleTotalValue);
					
					getNewPriceInTable(thistr);
				} else {
					jAlert("请输入正确的区间！","提示",function(e){
						inputIns.focus();
					});
				}
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).val().indexOf("-")!=-1) {
						if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
							thisvalue = Number($(this).val());
							oldtext = Number(oldtext);
							changerealprice(thistr, thisvalue, oldtext);
							divedit.html($(this).val());
									
							var values = $(this).val().split("-");
							
							var littleTotalValue = Number(values[0])*Number(number.val())+"-"+Number(values[1])*Number(number.val())
							littleTotal.html(littleTotalValue);
							
							getNewPriceInTable(thistr);
						} else {
							divedit.html(oldtext);
						}
					} else {
						jAlert("请输入正确的区间！","提示",function(e){
							inputIns.focus();
						});
					}

				});

	
	});
	
	$("div[id^='goodTotalWeight']").live('click',function(){
		var thistd = $(this).parents("td:first");
		

		if (opmode == 'view')
			return;

		var divedit = $(this);
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
	
	
	$("div[id^='goldweight']").live('click',function(){
		var thistd = $(this).parents("td:first");

		if (opmode == 'view')
			return;

		var divedit = $(this);
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
					divedit.html(Number($(this).val()).toFixed(2)); // 设置新值
					getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
						if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
							thisvalue = Number($(this).val());
							oldtext = Number(oldtext);
							changerealprice(thistr, thisvalue, oldtext);
							divedit.html(Number($(this).val()).toFixed(2));
							getNewPriceInTable(thistr);
						} else {
							divedit.html(oldtext);
						}

				});

	
	});
	
	
	$("div[id^='remark']").live('click',function(){
		var thistd = $(this).parents("td:first");
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
				if((checkType()) && $(this).val() == ''){
					alert("必须输入备注信息！");
					$("#this").focus();
					return;
				}else{
					divedit.html($(this).val() + "&nbsp;"); // 设置新值
				}
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
						if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
							
						if((checkType()) && $(this).val() == ''){
							alert("必须输入备注信息！");
							$("#this").focus();
							return;
						}
							thisvalue = $(this).val();
							oldtext = thisvalue;
							divedit.html(thisvalue + "&nbsp;");
						} else {
							divedit.html(oldtext);
						}

				});

	
	});
	
	$("div[id^='matnr']").live('click',function(){
		return;
		var thistd = $(this).parents("td:first");
		

		if (opmode == 'view')
			return;

		var divedit = $(this);
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
		var thistr = $(this).parents("tr:first");
		inputIns.keyup(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
					divedit.html($(this).val()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
						if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
							thisvalue = $(this).val();
							oldtext = oldtext;
							divedit.html($(this).val());
						} else {
							divedit.html(oldtext);
						}

				});

	
	});
	$("div[id^='charg']").live('click',function(){
		return;
		var thistd = $(this).parents("td:first");
		

		if (opmode == 'view')
			return;

		var divedit = $(this);
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
		var thistr = $(this).parents("tr:first");
		inputIns.keyup(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
					divedit.html($(this).val()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
						if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
							thisvalue = $(this).val();
							oldtext = oldtext;
							divedit.html($(this).val());
						} else {
							divedit.html(oldtext);
						}

				});

	
	});
	
	$("div[id^='toneTypeShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		// var divid = divedit.attr('id')
		// _order = divid.substring(divid.indexOf("realprice") + 9,
		// divid.length);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns;
		if($("#type").val() == "Y1")
			inputIns = $("#bowlderType").clone(true); 
		else
			inputIns = $("#toneType").clone(true); 
			
		
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		
		var valueDiv = thistr.find("div[id^='toneType']");
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
		
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
					jAlert("请选择正确的选项！","提示",function(e){
					});
						$(this).focus();
					return;
				}
				var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
				getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							jAlert("请选择正确的选项！","提示",function(e){});
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
						getNewPriceInTable(thistr);
					} else {
						divedit.html(oldtext);
					}

				});

	
	});
	
	$("div[id^='toneColorShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		// var divid = divedit.attr('id')
		// _order = divid.substring(divid.indexOf("realprice") + 9,
		// divid.length);
		if (divedit.children("input").length > 0) {
			return false;
		}
		if($("#type").val() == "Y1")
			var inputIns = $("#toneColor2").clone(true); 
		else
			var inputIns = $("#toneColor").clone(true); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='toneColor']");
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
				getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
						getNewPriceInTable(thistr);
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	
	$("div[id^='toneNeatnessShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		// var divid = divedit.attr('id')
		// _order = divid.substring(divid.indexOf("realprice") + 9,
		// divid.length);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#toneNeatness").clone(true); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='toneNeatness']");
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
				getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
						getNewPriceInTable(thistr);
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	$("div[id^='goldtypeShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		// var divid = divedit.attr('id')
		// _order = divid.substring(divid.indexOf("realprice") + 9,
		// divid.length);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#goldType").clone(true); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("td:first");
		var valueDiv = thistr.find("div[id^='goldType']");
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
		
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	
	$("div[id^='lessToneTypeShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#lessToneType").clone(true); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='lessToneType']");
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	
	$("div[id^='toneFireColorShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#toneFireColor").clone(true); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='toneFireColor']");
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	$("div[id^='toneshapeShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#toneshape").clone(true); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='toneshape']");
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	$("div[id^='mainToneStyleShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#mainToneStyle").clone(true); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='mainToneStyle']");
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	$("div[id^='ifNeedLessToneShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("<select><option value=''>请选择...</option><option value=''>否</option><option value='X'>是</option></select>"); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var thisLessTone = $(thistr.find("div[id^='lessToneType']")[0]);
		var thisLessToneShow = $(thistr.find("div[id^='lessToneType']")[1]);
		
		
		var valueDiv = thistr.find("div[id^='ifNeedLessTone']");
		inputIns.val($(valueDiv[0]).text());
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && $(this).unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val();
				
				
				if(value == 'X'){
					var inputIns = $("#lessToneType").clone(true); 
					thisLessToneShow.html("");
					inputIns.appendTo(thisLessToneShow);
					thisLessToneShow.focus();
					inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
					inputIns.unbind('keydown').keydown(function(event) {
						var keycode = event.which;
						if (keycode == 13 && inputIns.unbind("blur")) {
							if($(this).get(0).selectedIndex == 0){
										alert("请选择正确的选项！");
										$(this).focus();
										return;
									}
							var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
							valueDiv.html(value); // 设置新值
							divedit.html($(this).find("option:selected").text()); // 设置新值
						}
						if (keycode == 27) {
							divedit.html(oldtext); // 返回旧值
						}
					}).blur(function(event) {
								value = $(this).val();
								if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
									if($(this).get(0).selectedIndex == 0){
										alert("请选择正确的选项！");
										$(this).focus();
										return;
									}
									thisvalue = $(this).val();
									oldtext = oldtext;
									var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
									valueDiv.html(value); // 设置新值
									divedit.html($(this).find("option:selected").text()); // 设置新值
								} else {
									divedit.html(oldtext);
								}
			
							});
					
					
				}else{
					thisLessTone.html('');
					thisLessToneShow.html('&nbsp;');	
				}
				
				
				
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	$("div[id^='ifinlayShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("<select><option value=''>请选择...</option><option value=''>否</option><option value='X'>是</option></select>"); 
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
					return false;
				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var thisgoldType = $(thistr.find("div[id^='goldType']")[0]);
		var thisgoldTypeShow = $(thistr.find("div[id^='goldtypeShow']")[0]);
		
		
		var valueDiv = thistr.find("div[id^='ifinlay']");
		inputIns.val($(valueDiv[0]).text());
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && $(this).unbind("blur")) {
				if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
				var value = $(this).val();
				
				
				if(value == 'X'){
					var inputIns = $("#goldType").clone(true); 
					thisgoldTypeShow.html("");
					inputIns.appendTo(thisgoldTypeShow);
					thisgoldTypeShow.focus();
					inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')));
					inputIns.unbind('keydown').keydown(function(event) {
						var keycode = event.which;
						if (keycode == 13 && inputIns.unbind("blur")) {
							if($(this).get(0).selectedIndex == 0){
										alert("请选择正确的选项！");
										$(this).focus();
										return;
									}
							var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
							valueDiv.html(value); // 设置新值
							divedit.html($(this).find("option:selected").text()); // 设置新值
						}
						if (keycode == 27) {
							divedit.html(oldtext); // 返回旧值
						}
					}).blur(function(event) {
								value = $(this).val();
								if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
									if($(this).get(0).selectedIndex == 0){
										alert("请选择正确的选项！");
										$(this).focus();
										return;
									}
									thisvalue = $(this).val();
									oldtext = oldtext;
									var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
									valueDiv.html(value); // 设置新值
									divedit.html($(this).find("option:selected").text()); // 设置新值
								} else {
									divedit.html(oldtext);
								}
			
							});
					
					
				}else{
					thisgoldType.html('');
					thisgoldTypeShow.html('&nbsp;');	
				}
				
				
				
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	$("div[id^='technicsShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		if (divedit.children("select").length > 0) {
			return false;
		}
		var inputIns = $("#technics").clone(true); 
		inputIns.css("display","");
		var oldtext = $(this).html(); // 保存原有的值
		//inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		//inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		
			//inputIns.empty();
//		$.ajax({
//			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getTechnicsTypeInfo&option=user&postType=1',
//			dataType : "json",
//			success : function(data) {
//				$.map(data, function(item) {
//					var flag = false;
//					var option = "<option value='" + item.atwrt + "' >" + item.atwtb + "</option>";
//					inputIns.append(option);
//				})
//				//var noneselectedtext = "请选择...";
////				inputIns.multiSelect({
////					selectAll : false,
////					noneSelected : noneselectedtext,
////					oneOrMoreSelected : '*'
////				}, function(el) {
////					// $("#callbackResult").show().fadeOut();
////				});
//
//			}
//
//		});
		
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
//		inputIns.click(function() {
//					return false;
//				});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='technics']");
		
	
	
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')).split(','));
		inputIns.unbind().keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				
				var text = "";
				for(var i = 0 ; i <$(this).find("option:selected").size();i++ ){
					text = text + $($(this).find("option:selected")[i]).text()+", ";
				}
				text = text.substring(0, text.length - 2 );
				var value = $(this).val() +'|-|' + text;
				valueDiv.html(value); // 设置新值
				divedit.html(text); // 设置新值
				getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		})
		.blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
						getNewPriceInTable(thistr);
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	
	$("div[id^='certificateShow']").live('click',function(){
		if(opmode == 'view')
				return;
		var divedit = $(this);
		if (divedit.children("select").length > 0) {
			return false;
		}
		var inputIns = $("#mycertificate").clone(true); 
		inputIns.css("display","");
		var oldtext = $(this).html(); // 保存原有的值
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='certificate']");
		
	
		
		inputIns.val(valueDiv.text().substring(0,valueDiv.text().indexOf('|-|')).split(','));
		inputIns.unbind().keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				var text = "";
				for(var i = 0 ; i <$(this).find("option:selected").size();i++ ){
					text = text + $($(this).find("option:selected")[i]).text()+", ";
				}
				text = text.substring(0, text.length - 2 );
				var value = $(this).val() +'|-|' + text;
				valueDiv.html(value); // 设置新值
				divedit.html(text); // 设置新值
				
				getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		})
		.blur(function(event) {
					value = $(this).val();
					if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
						if($(this).get(0).selectedIndex == 0){
							alert("请选择正确的选项！");
							$(this).focus();
							return;
						}
						thisvalue = $(this).val();
						oldtext = oldtext;
						var value = $(this).val() +'|-|' + $(this).find("option:selected").text();
						valueDiv.html(value); // 设置新值
						divedit.html($(this).find("option:selected").text()); // 设置新值
						getNewPriceInTable(thistr);
					} else {
						divedit.html(oldtext);
					}

				});
	});
	
	
	
	
	
	
	
	function getTotal(){
		var tableList = $("#tablecontent");
		
		var totalsubtotal = $("#totalsubtotal");
		var totalnumber = $("#totalnumber");
		
		var numbers = tableList.find("div[id^=number]");
		var littleTotal = tableList.find("div[id^=littleTotal]");
		
		var littleTotal0 = 0;
		var littleTotal1 = 0;
		
		var totalLittleTotal = '';
		var totalNumber = 0 ;
		for(var i = 0;i<numbers.size();i++){
			totalNumber = totalNumber + Number($(numbers[i]).text());
			littleTotals = $(littleTotal[i]).text().split('-');
			littleTotal0 = littleTotal0 + Number(littleTotals[0]);
			littleTotal1 = littleTotal1 + Number(littleTotals[1]);
		}
		totalLittleTotal = littleTotal0 +"-"+littleTotal1;
		totalnumber.text(totalNumber);
		totalsubtotal.text(totalLittleTotal);
	}
	
	
	$("#btnAddRow").click(function(){
		checkAddRow();
	});
	
	function checkAddRow(){
		if($("#number").val() == ''){
			alert("请输入数量！");
			return;
		}else if ($("#matnrinput").val() == ''){
			alert("请输入物料号！");
			return;
		}
		btnAddRow();
	}
	
	
	$("#number").keydown(function(e){
		if(e.keyCode == 13){
			if(!checkNum(this)){
				alert("请输入正确的金额！");
				return;
			}
			$("#remark").focus();
		}
	});
	

});