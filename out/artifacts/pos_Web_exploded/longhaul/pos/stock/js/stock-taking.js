$(function(){
	$("#count").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($.trim($("#count").val()) != "") {
				getchargbyuser();
				
			}
		}
	});
	
	$("#count2").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($.trim($("#count2").val()) != "") {
				getmatnrbyuser();
				
			}
		}
	});
	$("#charg").keydown(function(event) {
		if (event.keyCode == 13) {
			if ($.trim($("#charg").val()) != "") {
				$("#count").focus();
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
		_charg = tempchargNo.indexOf("->") > 0 ? _mycharg : tempchargNo;
		_charg = _charg.toUpperCase();
		$("#charg").val(_charg);
		$.ajaxSetup({
			error : function(x, e) {
				jAlert(x.responseText,"提示",function(e){
					$("#statementaccount").dialog("destroy");
					location.reload();
				});
				return false;
			}
		});
		$.ajax({
			url : "longhaul/pos/stock/stockSystem.ered?reqCode=getchargforstocktaking&option=user&postType=1&werks=" + "01DL" + "&random=" + Math.random() + "",
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
					var lgort= item.lgort == null ? "" : item.lgort; //库位信息
					var charglabst = item.labst == null ? 1 : item.labst ; //批次数量
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
						charglabst : charglabst
					};
					chosecharginfo(info, "user");
				});
			}
		});
	}
	
	var count = 1;
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
		$("#goldweight").val(charginfo.goldweight); // 金重
		$("#gemweight").val(charginfo.gemweight); // 石重
		$("#certificateno").val(charginfo.certificateno);
		$("#logrt").val(charginfo.lgort);
		usedorderid = charginfo.usedorderid;
		var sjczbm = charginfo.sjczbm;
		var tr = "<option>"+(count++)+": ";
		tr += " "+$("#charg").val();
		tr += " / "+charginfo.zhlhx;
		tr += " / "+$("#count").val();
		tr += "</option>";	
		
		
		$("#data").append(tr);
		
		
		$("#charg").focus();
		
	}
	
	
	
	// 用户回车选择批次事件
	function getmatnrbyuser() {
		// $("#number").focus();
		// $("#toneRow").css("display","none");
		// $("#bowlderRow").css("display","none");getmatnrbyuser()
		// $("#goldRow").css("display","none");
		var _matnr = $("#matnr").val();
		_matnr = _matnr.toUpperCase();
		var choiceOrderType = $('#type').get(0).value;
//		$.ajaxSetup({
//			error : function(x, e) {
//				jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>","提示",function(e){});
//				return false;
//			}
//		});
		$.ajax({
			url : "longhaul/pos/choiceOrder/choiceOrderSystem.ered?reqCode=getMatnrInfo&option=user&postType=1&werks=" + "01DL" + "&random=" + Math.random() + "",
			dataType : "json",
			data : "matnr=" + $.trim(_matnr)+"&choiceOrderType="+choiceOrderType,
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
		$("#number").val(1);
		$("#realnumber").val(0);
		$("#realprice").val(0); // 实收
		$("#goldweight").val(0); // 金重
		$("#gemweight").val(0); // 石重
		$("#goodsize").val(0);// 货品尺寸
		$("#extwg").val(charginfo.extwg);// 货品款式
		$("#matkl").val(charginfo.matkl);// 核价系数
		$("#bismt").val(charginfo.bismt);// 主模号
		
		

		var zgy = charginfo.zgy.split(',');
		var sjczbm = $.trim(charginfo.sjczbm);
		var slbm = $.trim(charginfo.slbm);
		var slxz = $.trim(charginfo.slxz);
		var slys = $.trim(charginfo.slys);
		var slgg = $.trim(charginfo.slgg);
		var zsjd = $.trim(charginfo.zsjd);


	}
	
	
	
	
	
	
});