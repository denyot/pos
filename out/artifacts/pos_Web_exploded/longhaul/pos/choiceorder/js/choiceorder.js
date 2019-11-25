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

	$("#choiceorderid").attr('disabled', true);
	$("#saporderid").attr('disabled', true);
	$("#remark2").attr('disabled', true);

	var historyWerks ;
	var isHavePrice = false;
	var toneCount = 0;

	if (opmode != 'view' && opmode != 'edit')
		$.ajax({
			url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getChoiceType&postType=1",
			dataType : "json",
			success : function(data) {
				if (data == "" || data == null) {
					return;
					// }else if(data.isJiameng == '1'){
					// return;
				} else {
					$("#type").empty();
					$("#type").append($("<option value=''>请选择...</option>"))
					for ( var i = 0; i < data.length; i++) {
						var item = data[i];
						var value = item.value;
						var item = item.name;
						var option = $("<option value='" + value + "'>" + item + "</option>");
						$("#type").append($(option));
					}
				}
			}
		});

	// alert("ok");
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

	$('#ordertime').val(getTodyay("-"));
	$("#posttime").val(getTodyay("-"));
//	$("#ordertime").datepicker({
//		changeMonth : true,
//		changeYear : true
//	});
	$("#posttime").datepicker({
		changeMonth : true,
		changeYear : true
	});
	var decimalReg = /^[+\-]?\d+(.\d+)?$/;
	var numberReg = /^[+\-]?\d+(\d+)?$/;
	var orderType;
	var needGetMatnr = 0;

	$('#ordersystemtable td').addClass('tdclass'); // 增加td样式

	// 获取工艺类型
	function gettechnics(selected) {
		$("#technics").empty();
		$("#technics").append($("<option value='' >请选择...</option>"));
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getTechnicsTypeInfo&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				if (data.length == 1) {
					$("#technics").empty();
				}
				$.map(data, function(item) {
					var flag = false;
					if (selected != null) {
						for ( var i = 0; i < selected.length; i++) {
							if (item.atwrt == selected[i]) {
								flag = true;
								break;
							}
						}
					}
					var option = $("<option value='" + item.atwrt + "'" + (flag ? "selected" : "") + " >" + item.atwtb + "</option>");
					$("#technics").append(option);
				})
				// var noneselectedtext = "请选择...";
				// $("#technics").multiSelect({
				// selectAll : false,
				// noneSelected : noneselectedtext,
				// oneOrMoreSelected : '*'
				// }, function(el) {
				// // $("#callbackResult").show().fadeOut();
				// });

			}

		});
	}
	getMytechnics();
	function getMytechnics() {
		$("#mytechnics").empty();
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getTechnicsTypeInfo&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				if (data.length == 1) {
					$("#mytechnics").empty();
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.atwrt + "' >" + item.atwtb + "</option>");
					$("#mytechnics").append(option);
				})
				// var noneselectedtext = "请选择...";
				// $("#technics").multiSelect({
				// selectAll : false,
				// noneSelected : noneselectedtext,
				// oneOrMoreSelected : '*'
				// }, function(el) {
				// // $("#callbackResult").show().fadeOut();
				// });

			}

		});
	}

	$("#toneType").change(function() {
		needGetMatnr += 1;
		// getNewPrice();
		if ($(this).val() != '') {
			getToneColor(null, null, $(this).val());
		}
	});

	$("#toneNeatness").change(function() {
		// getNewPrice();

	});
	$("#toneColor").change(function() {
		// getNewPrice();

	});

	$("#bowlderType").change(function() {
		needGetMatnr += 1;
		$("#retailPrice").val('0-0');
		$("#retailPrice").attr("readonly", false);

		getToneColor2(null, null, $(this).val());
	});

	$("#toneshape").change(function() {
		needGetMatnr += 1;
		$("#retailPrice").val('0-0');
		$("#retailPrice").attr("readonly", false);
	});

	$("#toneColor2").change(function() {
		needGetMatnr += 1;
		$("#retailPrice").val('0-0');
		$("#retailPrice").attr("readonly", false);
	});

	$("#ifinlay").click(function() {
		getGoldType("all");
		if ($(this).attr("checked") == "checked") {
			$("#goldRow").css("display", "");
			// $("#goldTypeth").css("display", "");
			// $("#subtotaltd").attr("colspan", "4");
			// if($("#tablecontent tr").length > 2){
			// $("td[id^='goldTypehide']").show();
			// }

		} else {
			$("#goldRow").css("display", "none");
			// $("#subtotaltd").attr("colspan", "3");
			// if($("#tablecontent tr").length <= 2){
			// $("#goldTypeth").hide();
			// }else{
			// $("td[id^='goldTypehide']").show();
			// }
		}
	});

	function changeType1(type) {
		$("#thgoldweight").css("display", "");
		$("#goldWeightSpan").css("display", "");
		$("#tdtotalgoldweight").css("display", "");
		$("#totaltoneweightcol").css("display", "");
		$("#totaltoneweightcol").attr("colspan", "1");
		$("#subtotaltd").attr("colspan", "1");
		$("#tdLast").attr("colspan", "1");
		$("#technicsspan").css("display", "");
		$("#technicsth").css("display", "");
		$("#goldTypeth").css("display", "");

		if (type == "J3") {
			$("#marketPriceth").css("display", "");
			$("#littleTotalth").css("display", "");
			$("#totalsubtotal").css("display", "");
			$("#marketPriceSpan").css("display", "");
			$("#subtotaltd").attr("colspan", "3");
		}

		orderType = 1;
		getGoldType(type);
		$("#goldRow").css("display", "");
		// if ($.trim($("#technics").text()) == "") {
		gettechnics();
		// }

	}

	$("#ifNeedLessTone").click(function() {
		needGetMatnr = 1;
		if ($("#ifNeedLessTone").attr("checked") == "checked") {
			$("#lessToneSpan").show();
		} else {
			$("#lessToneSpan").hide();
		}
	});

	$("#type").change(changeType);

	function changeType() {
		clearcharginfo();
		// gettechnics();
		_checkrownum = $("#tablecontent tr").length - 2;
		changeValue = this.value;
		if (_checkrownum > 0) {
			jConfirm('已存在订单记录,请删除订单记录?', '提示', function(r) {
				if (r == true) {
					cleartable();
					clearcharginfo();
				} else {
					return false;
				}
			});
		}

		var type = $("#type").val();
		if (type == "") {
			return;
		}
		$("#goldRow").css("display", "none");
		$("#thgoldweight").css("display", "none");
		$("#toneRow").css("display", "none");
		$("#bowlderRow").css("display", "none");
		$("#toneColorSpan").css("display", "none");
		$("#toneNeatnessSpan").css("display", "none");
		$("#goldWeightSpan").css("display", "none");
		$("#tdtotaltoneweight").css("display", "none");
		$("#tdtotalgoldweight").css("display", "none");
		$("#totaltoneweightcol").css("display", "none");
		$("#toneNeatnessSpan").css("display", "none");
		$("#toneTypeth").css("display", "none");
		$("#tongWeightth").css("display", "none");
		$("#tongColorth").css("display", "none");
		// $("#marketPriceSpan").css("display", "none");
		$("#lessToneSpan").css("display", "none");
		$("#toneFireColorSpan").css("display", "none");
		$("#ifNeedLessToneTypeth").css("display", "none");
		$("#goldWeightSpan").css("display", "none");
		$("#ifNeedLessToneSpan").css("display", "none");
		$("#toneNeatnessth").css("display", "none");
		$("#technicsspan").css("display", "none");
		$("#technicsth").css("display", "none");
		$("#goldTypeth").css("display", "none");
		$("#ifinlayth").css("display", "none");
		$("#marketPriceth").css("display", "none");
		$("#littleTotalth").css("display", "none");
		$("#totalsubtotal").css("display", "none");
		$("#calcNewPrice").css("display", "none");
		$("#certificateSpan").css("display", "none");
		$("#certificateth").css("display", "none");
		$("#lessToneTypeth").css("display", "none");
		$("#gemweightspan").css("display", "none");
		$("#toneFireColorth").css("display", "none");
		$("#mainToneStyleSpan").css("display", "none");
		$("#thgoldweightlittletotal").css("display", "none");
		$("#mainToneStyleth").css("display", "none");
		$("#goodTotalWeightSpan").css("display", "none");
		$("#toneshapeth").css("display", "none");
		$("#totalWeightth").css("display", "none");
		$("#tdtotalgoldweight").attr("colspan", "1");
		$("#matnrselect").hide();
		$("#matnrinput").show();

		if (type == "J1" || type == "J2" || type == "J3" || type == "J4" || type == "J5") {
			$("#thgoldweight").css("display", "");
			$("#goldWeightSpan").css("display", "");
			$("#tdtotalgoldweight").css("display", "");
			$("#totaltoneweightcol").css("display", "");
			$("#totaltoneweightcol").attr("colspan", "2");
			$("#subtotaltd").css("display", "");
			$("#subtotaltd").attr("colspan", "1");
			$("#tdLast").attr("colspan", "1");
			$("#technicsspan").css("display", "");
			$("#technicsth").css("display", "");
			$("#thgoldweightlittletotal").css("display", "");
			$("#goldTypeth").css("display", "");

			// if (type == "J1"||type == "J2"||type == "J4"||type == "J3") {
			$("#marketPriceth").css("display", "");
			$("#littleTotalth").css("display", "");
			$("#totalsubtotal").css("display", "");
			$("#marketPriceSpan").css("display", "");
			$("#subtotaltd").attr("colspan", "3");
			// }

			if (type == "J3") {
				$("#goldWeightSpan").css("display", "none");
				$("#thgoldweight").css("display", "none");
				$("#thgoldweightlittletotal").css("display", "none");
				$("#totalgoldweight").css("display", "none");
				$("#subtotaltd").css("display", "none");
				$("#tdtotalgoldweight").attr("colspan", "2");
			}

			orderType = 1;
			getGoldType(type);
			$("#goldRow").css("display", "");
			// if ($.trim($("#technics").text()) == "") {
			gettechnics();
			// }

		} else if (type == "X1" || type == "X2" || type == "X3" || type == "X4" || type == "X5" || type == "Q1") {
			$("#toneColorSpan").css("display", "");
			$("#toneTypeth").css("display", "");
			$("#tongWeightth").css("display", "");
			$("#tongColorth").css("display", "");
			$("#subtotaltd").css("display", "");
			$("#goodTotalWeightSpan").css("display", "");
			$("#gemweightspan").css("display", "");
			// $("#totalWeightth").css("display", "");
			if (type == "X1" || type == "X4" || type == "Q1") {
				$("#toneNeatnessSpan").css("display", "");
				$("#toneNeatnessth").css("display", "");
				$("#lessToneTypeth").show();
				// $("#tdLast").attr("colspan", "4");
				$("#subtotaltd").attr("colspan", "6");
				getToneNeatness();
			} else {
				$("#toneNeatnessSpan").css("display", "");
				$("#toneNeatnessth").css("display", "");
				$("#subtotaltd").attr("colspan", "7");
			}
			$("#technicsspan").css("display", "");
			$("#totaltoneweightcol").css("display", "");
			$("#marketPriceSpan").css("display", "");
			$("#technicsth").css("display", "");
			$("#totaltoneweightcol").attr("colspan", "2");
			$("#goldTypeth").css("display", "");
			$("#ifNeedLessToneSpan").css("display", "");
			$("#ifNeedLessToneTypeth").css("display", "");
			$("#marketPriceth").css("display", "");
			$("#littleTotalth").css("display", "");
			$("#totalsubtotal").css("display", "");
			// $("#calcNewPrice").css("display", "");

			if (type == "X2" || type == "X3") {
				$("#mainToneStyleSpan").css("display", "");
				// $("#mainToneStyleth").css("display", "");
				$("#lessToneTypeth").css("display", "");
				$("#tdLast").attr("colspan", "4");
				// $("#gemweightspan").css("display", "none");
				// $("#tongWeightth").css("display", "none");
				$("#mainToneStyleSpan").css("display", "none");
				$("#toneNeatnessSpan").css("display", "none");
				$("#toneNeatnessth").css("display", "none");
				$("#subtotaltd").attr("colspan", "5");
				// getMainToneStyle();
			}

			if (type == "X2" || type == "X3" || type == "X4") {
				$("#gemweightspan").css("display", "none");
				$("#tongWeightth").css("display", "none");
				$("#toneColorSpan").css("display", "none");
				$("#tongColorth").css("display", "none");
				$("#toneNeatnessSpan").css("display", "none");
				$("#toneNeatnessth").css("display", "none");
				$("#subtotaltd").attr("colspan", "3");
				$("#tdLast").attr("colspan", "3");
			}

			if (type == "X1" || type == "Q1") {
				$("#certificateSpan").css("display", "");
				$("#certificateth").css("display", "");
				$("#tdLast").attr("colspan", "5");
				//getCertificate();
			}

			if (type == "X5") {
				$("#toneFireColorSpan").css("display", "");
				$("#toneFireColorth").css("display", "");
				$("#mainToneStyleSpan").css("display", "");
				$("#mainToneStyleth").css("display", "");
				$("#tdLast").attr("colspan", "4");
				getToneFireType();
			}
			// getToneNeatness();
			// getToneColor('all');
			orderType = 2;
			switch (type) {
			case "X1":
				mytype = 'DD';
				break;
			case "X2":
				mytype = 'GS(RU,SA)';
				break;
			case "X3":
				mytype = 'GS(!RU,SA)';
				break;
			case "X4":
				mytype = 'SY(CZ)';
				break;
			case "X5":
				mytype = 'JA(CH,JA)';
				break;
			case "Q1":
				mytype = 'OT';
				break;
			}
			getToneType(mytype);
			getGoldType('all');
			$("#toneRow").css("display", "");
			$("#goldRow").css("display", "");
			// if ($.trim($("#technics").text()) == "") {
			gettechnics();
			// }
		} else if (type == "Y1") {
			$("#toneTypeth").css("display", "");
			$("#tongColorth").css("display", "");
			$("#ifinlayth").css("display", "");
			$("#marketPriceSpan").css("display", "");
			$("#subtotaltd").attr("colspan", "3");
			$("#totaltoneweightcol").css("display", "");
			$("#totaltoneweightcol").attr("colspan", "2");
			$("#toneFireColorSpan").css("display", "");
			$("#bowlderRow").css("display", "");
			$("#marketPriceth").css("display", "");
			$("#littleTotalth").css("display", "");
			$("#totalsubtotal").css("display", "");
			$("#toneNeatnessSpan").css("display", "");
			$("#toneFireColorSpan").css("display", "");
			$("#toneFireColorth").css("display", "");
			$("#goodTotalWeightSpan").css("display", "");
			// $("#goldRow").css("display", "");
			$("#goldTypeth").css("display", "");
			$("#subtotaltd").attr("colspan", "5");
			$("#toneshapeth").css("display", "");
			$("#subtotaltd").css("display", "");
			getToneFireType();
			$("#tdLast").attr("colspan", "2");
			orderType = 3;
			getToneColor2(type);
			type = 'JA(CH,JA)';
			getBowlderType(type);
			getGoldType('all');
		}
		if (type == "J1" || type == "J2" || type == "J4" || type == "X1") {
			$("#calcNewPrice").css("display", "");
			$("#marketPriceSpan").css("display", "");
		}

		$("#showmatnrinfo").hide();
		$("#showmatnrinfo2").hide();
		$("#charg").focus();
	}

	// 获取金料类型
	function getGoldType(type, value) {
		$("#goldType").empty();
		$("#goldType").append($("<option value=''>请选择...</option>"));
		var type2;
		switch (type) {
		case "J1":
			type2 = 'G';
			break;
		case "J2":
			type2 = 'PT';
			break;
		case "J3":
			type2 = 'K';
			break;
		case "J4":
			type2 = 'PD';
			break;
		case "J5":
			type2 = 'S';
			break;
		case "all":
			type2 = 'all';
			break;
		}
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getGoldTypeInfo&option=user&postType=1',
			dataType : "json",
			data : "type=" + type2,
			success : function(data) {
				if (data.length == 1) {
					$("#goldType").empty();
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.zjlbn + "'" + (item.zjlbn == value ? 'selected' : '') + ">" + item.zjlms + "</option>");
					$("#goldType").append(option);
				})
			}
		});

	}

	// 获取石头类型
	function getToneType(type, value) {
		switch (type) {
		case "X1":
			$("#toneNeatnessSpan").css("display", "");
			// getToneNeatness();
			type = 'DD';
			break;
		case "X2":
			type = 'GS(RU,SA)';
			break;
		case "X3":
			type = 'GS(!RU,SA)';
			break;
		case "X4":
			type = 'SY(CZ)';
			break;
		case "X5":
			type = 'JA(CH,JA)';
			break;
		case "Q1":
			type = 'OT';
			break;
		}

		$("#toneType").empty();
		$("#toneType").append($("<option value=''>请选择...</option>"));
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getToneTypeInfo&option=user&postType=1',
			dataType : "json",
			data : "type=" + type,
			success : function(data) {
				if (data.length == 1) {
					$("#toneType").empty();
					getToneColor(null, null, data[0].zslbm);
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.zslbm + "'" + (value == item.zslbm ? "selected" : "") + ">" + item.tslbm + "</option>");
					$("#toneType").append(option);
				})
			}
		});
	}

	// 获取石头形状
	function getToneShape(value) {
		$("#toneshape").empty();
		$("#toneshape").append($("<option value=''>请选择...</option>"));
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getToneSharp&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				if (data.length == 1) {
					$("#toneshape").empty();
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.zslxz + "' " + (value == item.zslxz ? "selected" : "") + ">" + item.tslxz + "</option>");
					$("#toneshape").append(option);
				})
			}
		});
	}

	// 获取玉石类型
	function getBowlderType(type, value) {
		$("#bowlderType").empty();
		$("#bowlderType").append($("<option value=''>请选择...</option>"));
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getToneTypeInfo&option=user&postType=1',
			dataType : "json",
			data : "type=" + type,
			success : function(data) {
				if (data.length == 1) {
					$("#bowlderType").empty();
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.zslbm + "'" + (value == item.zslbm ? "selected" : "") + ">" + item.tslbm + "</option>");
					$("#bowlderType").append(option);
				})
			}
		});
		getToneShape();
	}

	// 获取石头颜色
	function getToneColor(type, value, toneType) {
		$("#toneColor").empty();
		$("#toneColor").append($("<option value=''>请选择...</option>"));
		var types = "";

		var toneType = (toneType != null ? toneType : $("#toneType").val());
		if (toneType == "DI") {
			if (Number($("#gemweight").val()) > 0 && $("#gemweight").val() != '' && Number($("#gemweight").val()) <= 0.078) {
				types = "WW";
			}else{ 
				if($("#certificate").selectedValuesString() == ""){
				 	types = "W,Y1,87,96,86,85,84,88";
				}else{
					types = "0,94,95,96,97,98,99";
				}
			}
			types = "types=" + types;
		} else {
			types = "toneType=" + toneType;
		}

		if (type == 'all') {
			types = "types=all";
		}

		// switch (type) {
		// case "X1":
		// //types =
		// "00,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,Y,BR,GR,G,R,R1,BL";
		// if($("#certificate").selectedValuesString() == "")
		// types = "89,88,87,86,85,84";
		// else
		// types = "00,99,98,97,96,95,94,93,92,91,90";
		//				
		// break;
		// case "X2":
		// types = "R,R1,R2,B,B1,B2,G,Y,O,P,W";
		// break;
		// case "X3":
		// types =
		// "B,B1,B2,B3,B4,B5,B6,BL,BR,BR1,D,G,G1,G2,G3,G4,G5,G6,GO,GR,P,P1,PU,R,R1,R2,R3,R4,R5,R6,W,W1,Y,Y1";
		// break;
		// case "X4":
		// types = "W,Y,P,O,B,BR,BL";
		// break;
		// case "X5":
		// types = "J0,J1,J2,J3,J4,J5,J6,J7,J8,J9,K1,K2,W,R,O,Y,G,B,PU";
		// break;
		// case "Y1":
		// types = "J0,J1,J2,J3,J4,J5,J6,J7,J8,J9,K1,K2,W,R,O,Y,G,B,PU";
		// break;
		// case "Q1":
		// types = "all";
		// break;
		// case "all":
		// types = "all";
		// break;
		// }
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getToneColor&option=user&postType=1',
			dataType : "json",
			type : "post",
			data : types,
			success : function(data) {
				if (data.length == 1) {
					$("#toneColor").empty();
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.zslys + "'" + (value == item.zslys ? "selected" : "") + ">" + item.tslys + "</option>");
					$("#toneColor").append(option);
				})
			}
		});
	}

	// 获取玉石颜色
	function getToneColor2(type, value, toneType) {
		$("#toneColor2").empty();
		$("#toneColor2").append($("<option value=''>请选择...</option>"));

		// $("#toneColor").empty();
		// $("#toneColor").append($("<option value=''>请选择...</option>"));
		var types = "";

		var toneType = (toneType != null ? toneType : $("#bowlderType").val());
		if (toneType == "DI") {
			// if($("#certificate").selectedValuesString() == "")
			// types = "89,88,87,86,85,84";
			// else
			types = "00,99,98,97,96,95,94,93,92,91,90,WW";

			types = "types=" + types;
		} else {
			types = "toneType=" + toneType;
		}

		if (type == 'all') {
			types = "types=all";
		}

		// switch (type) {
		// case "X1":
		// //types =
		// "00,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,Y,BR,GR,G,R,R1,BL";
		// if($("#certificate").selectedValuesString() == "")
		// types = "89,88,87,86,85,84";
		// else
		// types = "00,99,98,97,96,95,94,93,92,91,90";
		//				
		// break;
		// case "X2":
		// types = "R,R1,R2,B,B1,B2,G,Y,O,P,W";
		// break;
		// case "X3":
		// types =
		// "B,B1,B2,B3,B4,B5,B6,BL,BR,BR1,D,G,G1,G2,G3,G4,G5,G6,GO,GR,P,P1,PU,R,R1,R2,R3,R4,R5,R6,W,W1,Y,Y1";
		// break;
		// case "X4":
		// types = "W,Y,P,O,B,BR,BL";
		// break;
		// case "X5":
		// types = "J0,J1,J2,J3,J4,J5,J6,J7,J8,J9,K1,K2,W,R,O,Y,G,B,PU";
		// break;
		// case "Y1":
		// types = "J0,J1,J2,J3,J4,J5,J6,J7,J8,J9,K1,K2,W,R,O,Y,G,B,PU";
		// break;
		// case "Q1":
		// types = "all";
		// break;
		// case "all":
		// types = "all";
		// break;
		// }
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getToneColor&option=user&postType=1',
			dataType : "json",
			type : "post",
			data : types,
			success : function(data) {
				if (data.length == 1) {
					$("#toneColor2").empty();
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.zslys + "'" + (value == item.zslys ? "selected" : "") + ">" + item.tslys + "</option>");
					$("#toneColor2").append(option);
				})
			}
		});

		// var types = "";
		// switch (type) {
		// case "X1":
		// types =
		// "00,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,Y,BR,GR,G,R,R1,BL";
		// break;
		// case "X2":
		// types = "R,R1,R2,B,B1,B2,G,Y,O,P,W";
		// break;
		// case "X3":
		// types =
		// "B,B1,B2,B3,B4,B5,B6,BL,BR,BR1,D,G,G1,G2,G3,G4,G5,G6,GO,GR,P,P1,PU,R,R1,R2,R3,R4,R5,R6,W,W1,Y,Y1";
		// break;
		// case "X4":
		// types = "W,Y,P,O,B,BR,BL";
		// break;
		// case "X5":
		// types = "J0,J1,J2,J3,J4,J5,J6,J7,J8,J9,K1,K2,W,R,O,Y,G,B,PU";
		// break;
		// case "Y1":
		// types = "J0,J1,J2,J3,J4,J5,J6,J7,J8,J9,K1,K2,W,R,O,Y,G,B,PU";
		// break;
		// case "all":
		// types = "all";
		// break;
		// }
		// $.ajax({
		// url :
		// 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getToneColor&option=user&postType=1',
		// dataType : "json",
		// type : "post",
		// data : "types=" + types,
		// success : function(data) {
		// $.map(data, function(item) {
		// var option = $("<option value='" + item.zslys + "'" + (value ==
		// item.zslys ? "selected" : "") + ">" + item.tslys + "</option>");
		// $("#toneColor2").append(option);
		// })
		// }
		// });
	}

	// 获取石料净度
	function getToneNeatness(value) {
		$("#toneNeatness").empty();
		$("#toneNeatness").append($("<option value=''>请选择...</option>"));
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getToneNeatness&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				if (data.length == 1) {
					$("#toneNeatness").empty();
				}
				$.map(data, function(item) {
					if (Number($("#gemweight").val()) > 0 && $("#gemweight").val() != '' && $("#toneType").val() == 'DI'
							&& Number($("#gemweight").val()) <= 0.078) {
						value = "WW0";
						$("#toneNeatness").attr("disabled", true);
					} else {
						if (!isHavePrice)
							$("#toneNeatness").attr("disabled", false);
					}
					var option = $("<option value='" + item.zsljd + "'" + (value == item.zsljd ? "selected" : "") + ">" + item.tsljd + "</option>");
					$("#toneNeatness").append(option);
				})
			}
		});

	}

	// 获取火彩信息
	function getToneFireType(value) {
		$("#toneFireColor").empty();
		$("#toneFireColor").append($("<option value=''>请选择...</option>"));
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getToneFireType&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				if (data.length == 1) {
					$("#toneFireColor").empty();
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.zslhc + "'" + (value == item.zslhc ? "selected" : "") + ">" + item.tslhc + "</option>");
					$("#toneFireColor").append(option);
				})
			}
		});
	}

	// 获取裸石证书信息
	function getCertificate(value) {
		
		$("#certificate").empty();
		if(Number($("#gemweight").val()) < 0.299){
			return;
		}
		$("#certificate").append("<option value=''>请选择...</option>");
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getCertificate&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				$.map(data, function(item) {
					var option = $("<option value='" + item.zzslx + "'" + (value == item.zzslx ? "selected" : "") + ">" + item.tzslx + "</option>");
					$("#certificate").append(option);
				});
				var noneselectedtext = "请选择...";
				$("#certificate").multiSelect({
					selectAll : false,
					noneSelected : noneselectedtext,
					oneOrMoreSelected : '*'
				}, function(el) {
					 getToneColor($("#type").val(),null,"DI");
				});
			}
		});

	}
	getMyCertificate();
	function getMyCertificate() {
		$("#mycertificate").empty();
		$("#mycertificate").append("<option value=''>请选择...</option>");
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getCertificate&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				$.map(data, function(item) {
					var option = $("<option value='" + item.zzslx + "'>" + item.tzslx + "</option>");
					$("#mycertificate").append(option);
				});
				// var noneselectedtext = "请选择...";
				// $("#certificate").multiSelect({
				// selectAll : false,
				// noneSelected : noneselectedtext,
				// oneOrMoreSelected : '*'
				// }, function(el) {
				// });
			}
		});

	}

	// 获取石料规格
	function getMainToneStyle(value) {
		$("#mainToneStyle").empty();
		$("#mainToneStyle").append($("<option value=''>请选择...</option>"));
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getMainToneStyle&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				if (data.length == 1) {
					$("#mainToneStyle").empty();
				}
				$.map(data, function(item) {
					var option = $("<option value='" + item.zslgg + "'" + (value == item.zslgg ? "selected" : "") + ">" + item.tslgg + "</option>");
					$("#mainToneStyle").append(option);
				})
			}
		});
	}

	$("#charg").keydown(function(event) {
		if ($('#type').get(0).selectedIndex == 0) {
			jAlert("请先选择选款类型！！", "提示", function(e) {
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

	}).autocomplete(
			{
				source : function(request, response) {
					_ordertype = $("#ordertype").val();
					_chargtype = $('input:radio[name="chargtype"]:checked').val();
					var choiceOrderType = $('#type').get(0).value;
					_chargtype = _ordertype == "ZOR8" ? "gift" : _chargtype; // 赠品销售特殊化处理
					_charg = $("#charg").val().toUpperCase();
					$.ajax({
						url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getpcxx&postType=1&option=auto&werks=" + "01DL" + "&random="
								+ Math.random() + "",
						dataType : "json",
						data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype + "&choiceOrderType=" + choiceOrderType,
						success : function(data) {
							if (data == "") {
								var chargalertstr = "输入批次不存在!";
								chargalertstr = _chargtype == "gift" ? "输入批次不存在!" : chargalertstr
								jAlert(chargalertstr, "提示", function(e) {
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
				delay : 1000,
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
		// $.ajaxSetup({
		// error : function(x, e) {
		// jAlert("访问服务器错误信!<font color='red'>" + x.responseText +
		// "</font>","提示",function(e){});
		// return false;
		// }
		// });
		$.ajax({
			url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getpcxx&option=user&postType=1&werks=" + "01DL" + "&random="
					+ Math.random() + "",
			dataType : "json",
			data : "charg="
					+ $.trim(_charg)
					+ "&chargtype="
					+ _chargtype
					+ "&choiceOrderType="
					+ choiceOrderType
					+ (($("#type").val() == 'J1' || $("#type").val() == 'J2' || $("#type").val() == 'J3' || $("#type").val() == 'J4' || $("#type")
							.val() == 'J5') ? "&zzfst=" + 0 : ""),
			success : function(data) {
				if (data == "" || data == null) {
					jAlert("无此批次号，请与产品部联系！", "提示", function(e) {
						clearcharginfo();
						$("#charg").focus();
					});
					return;
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
					var mstae = item.mstae;

					var zgy = item.zgy;
					var slbm = item.slbm;
					var slxz = item.slxz;
					var slys = item.zslys;
					var slgg = item.slgg;
					var zsjd = item.labor;
					var kondm = item.kondm;
					var extwg = item.extwg;
					var zccnn = item.zccnn;
					var matkl = item.matkl;
					var hpzl = item.hpzl;
					var bismt = item.bismt;
					var zjlbm = item.zjlbm;
					var menge = item.menge;
					
					toneCount = menge;
					
					//alert(mstae);

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
						mstae : mstae,
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
		}
		if(charginfo.mstae == '03'){
			jAlert("此物料号不允许下单", "提示",function(e){
				$("#charg").focus();
			});
			return;
		}
		
			$("#zhlhx").val(charginfo.zhlhx);
			$("#ztjtj").val(charginfo.ztjtj);
			$("#number").val(1);
			$("#realnumber").val(charginfo.charglabst);
			$("#realprice").val(charginfo.realprice); // 实收
			$("#goldweight").val(charginfo.goldweight); // 金重
			$("#gemweight").val(charginfo.gemweight); // 石重
			$("#goodsize").val((charginfo.zccnn).replace('#',''));// 货品尺寸
			$("#extwg").val(charginfo.extwg);// 货品款式
			$("#matkl").val(charginfo.matkl);// 核价系数
			$("#goodTotalWeight").val(charginfo.hpzl);// 货品重量
			$("#bismt").val(charginfo.bismt);// 主模号
			$("#retailPrice").val('0-0');// 主模号
		// $("#matnrselect").empty();
		// $("#matnrselect").append($("<option>"+charginfo.matnr+"</option>"));
		// $("#matnrselect").show();
		// $("#matnrinput").css("display","none");
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

		// alert(zsjd);

		if ($("#type").val() == 'Y1') {
			if (charginfo.zjlbm != null && charginfo.zjlbm != '') {
				$("#ifinlay").attr("checked", true);
				$("#goldRow").show();
				getGoldType('all', charginfo.zjlbm);
			} else {
				$("#ifinlay").attr("checked", false);
				$("#goldRow").hide();
			}
		}

		// getCurrentPrice(charginfo.kondm, slbm, charginfo.gemweight, slxz,
		// slys, zsjd, charginfo.zgy, charginfo.extwg);

		if ((orderType == 1 || orderType == 2))
			getToneColor($("#type").val(), slys, slbm);
		else {
			$("#bowlderRow").css("display", "");
			getToneColor2($("#type").val(), slys, slbm);
		}

		if (orderType == 2) {
			$("#toneRow").css("display", "");
			getToneNeatness(zsjd);
		}

		if (charginfo.bismt == "" || charginfo.bismt == null) {

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

		} else {
			getBismtInfo(charginfo.bismt, slxz, slgg, zgy, sjczbm, slbm);
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

		$("#number").val("1");
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

	function getCurrentPrice(kondm, slbm, gemweight, slxz, slys, zsjd, zgy, extwg) {
		if (orderType == 1) {

		} else if (orderType == 2 || orderType == 3) {
			var charg = $("#charg").val();
			$.ajax({
				url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getMarketPrice&option=user&postType=1',
				dataType : "json",
				type : "POST",
				data : "kondm=" + kondm + "&charg=" + charg + "&toneType=" + slbm + "&gemweight=" + gemweight + "&toneColor=" + slys
						+ "&toneNeatness=" + zsjd + "&technics=" + zgy + "&extwg=" + extwg,
				success : function(data) {
					$("#retailPrice").val(data.oldMarketPrice);
					$("#oldRetailPrice").val(data.oldMarketPrice);
					$("#costPrice").val(data.oldPrice);
					$("#oldCostPrice").val(data.oldPrice);
					if (data.oldMarketPrice != 0)
						$("#retailPrice").attr("readonly", true);
					$("#oldTonePrice").val(data.oldTonePrice);
					$("#oldTechnicsPrice").val(data.technicsPrice);
					$("#oldYbzjbPrice").val(data.oldYbzjbPrice);
					$("#kbetr").val(data.kbetr);// 商品定价组
				}
			});
		}
	}

	$("#calcNewPrice").click(function() {
		getNewPrice();
	});

	function getNewPrice() {
		
		
		if($("#ifNeedLessTone").attr("checked") == "checked"){
			if($("#lessToneType").val() == ''){
				jAlert("请选择副石类型","提示",function(){
					$("#lessToneType").focus();
				});
				return;
			}
		}
		
		
		if ($("#type").val() == '' || $("#type").val() == null) {
			jAlert("请先选择选款类型！", "提示", function(e) {
				$("#type").focus();
			});
			return;
		}
		if ($("#matnrinput").val() == '' || $("#matnrinput").val() == null) {
			jAlert("请先输入商品信息！", "提示", function(e) {
				$("#matnrinput").focus();
			});
			return;
		}

		if (needGetMatnr != 0) {
			jConfirm("你有修改选款参数值，系统将会重新获取物料号，确定获取吗？", "提示", function(e) {
				if (e) {
					// $("#getMatnrInfo").focus();
					getmatnrinfo();
					// getNewPrice();

				}
			});
			return;
		}
		var dialog = $.dialog({
			title : '处理中，请稍后...',
			max : false,
			min : false,
			close : false,
			lock : true
		});

		if (orderType == 1) {
			var choiceType = $("#type").val();
			if (choiceType == 'J1' || choiceType == 'J2' || choiceType == 'J4') {
				var goldType = $("#goldType").val();
				var goldWeight = Number($("#goldweight").val());
				if (charg != "" || matnr != "") {
					$.ajax({
						url : 'longhaul/pos/order/orderSystem.ered?reqCode=getGoldPrices&postType=1',
						dataType : "json",
						type : "POST",
						data : "chargtype=" + goldType,
						success : function(data) {
							dialog.close();
							if (data == null || data == "") {
								jAlert("请注意,没有维护金价!", "提示", function(e) {
									$("#retailPrice").val('0-0');
								});
							} else {
								var goldweightFrom = Number($("#goldweightFrom").val());
								var goldweightTo = Number($("#goldweightTo").val());
								var drjj = Number(data[0].drjj);
								var marketPrice = parseInt(goldweightFrom * drjj) + "-" + parseInt(goldweightTo * drjj);
								$("#retailPrice").val(marketPrice);
								$("#retailPrice").attr("readonly", true);
								$("#remark").focus();
							}
						}
					});
				} else {
					dialog.close();
					jAlert("请输入批次或者物料信息！", "提示", function(e) {
						$("#charg").select();
					})
				}

			}
		} else if (orderType == 2) {
			var charg = $("#charg").val();
			// alert($("#matnrselect").val());
			// alert($("#matnrinput").val());
			var matnr = ($("#matnrselect").val() == "" || $("#matnrselect").val() == null) ? $("#matnrinput").val() : $("#matnrselect").val();
			var goldType = $("#goldType").val();
			var lessToneType = $("#lessToneType").val();
			var toneColor = $("#toneColor").val();
			var toneNeatness = $("#toneNeatness").val();
			var isBarerock;
			if(Number($("#gemweight").val()) > 0.299){
				isBarerock = $("#certificate").selectedValuesString() != '' ? '1' : '0';
			}else{
				isBarerock = '0';
			}
			if (charg != "" || matnr != "") {
				$.ajax({
					url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getNewMarketPrice&option=user&postType=1',
					dataType : "json",
					type : "POST",
					data : "&toneType=" + $("#toneType").val() + "&gemweight=" + $("#gemweight").val() + "&matkl=" + $("#matkl").val() + "&matnr="
							+ matnr + "&charg=" + charg + "&goldType=" + goldType + "&lessToneType=" + lessToneType + "&toneColor=" + toneColor
							+ "&toneNeatness=" + toneNeatness + "&toneCount=" + toneCount+ "&isBarerock=" + isBarerock,
					// "&toneType=" + $("#toneType").val() + "&gemweight=" +
					// $("#gemweight").val() + "&toneColor=" +
					// $("#toneColor").val() + "&toneNeatness=" +
					// $("#toneNeatness").val() + "&technics="
					// + $("#technics").val() + "&extwg=" + $("#extwg").val() +
					// "&matkl=" + $("#matkl").val()+"&matnr=" + matnr+"&charg="
					// + charg,
					success : function(data) {
						dialog.close();
						var oldRetailPrice = Number($("#oldRetailPrice").val());
						var oldYbzjbPrice = Number($("#oldYbzjbPrice").val());
						var oldCostPrice = Number($("#oldCostPrice").val());
						var zhjxs = data.zhjxs;
						var oldTonePrice = Number($("#oldTonePrice").val());
						var oldTechnicsPrice = Number($("#oldTechnicsPrice").val());
						var newTonePrice = Number(data.newTonePrice);
						var technicsPrice = Number(data.technicsPrice);
						var kbetr = Number($("#kbetr").val());
						var newPrice = ((oldYbzjbPrice / zhjxs) - oldTonePrice - oldTechnicsPrice + newTonePrice + technicsPrice) * zhjxs * kbetr;
						// $("#retailPrice").val(newPrice > 0 ?
						// newPrice.toFixed(0) : 0);
						// if(newPrice <= 0)
						// $("#retailPrice").attr("readOnly",false);
						var newCostPrice = oldCostPrice - oldTonePrice - oldTechnicsPrice + newTonePrice + technicsPrice;
						$("#costPrice").val(newCostPrice > 0 ? newCostPrice : 0);
						var msg = "";
						if (data.phxserror != '' && data.phxserror != null)
							msg += data.phxserror + "<br/>";
						if (data.hjxserror != '' && data.hjxserror != null)
							msg += data.hjxserror + "<br/>";
						if (data.dailyGoldPriceerror != '' && data.dailyGoldPriceerror != null)
							msg += data.dailyGoldPriceerror + "<br/>";
						if (data.goldSHerror != '' && data.goldSHerror != null)
							msg += data.goldSHerror + "<br/>";
						if (data.goldGFerror != '' && data.goldGFerror != null)
							msg += data.goldGFerror + "<br/>";
						if (data.goldWeighterror != '' && data.goldWeighterror != null)
							msg += data.goldWeighterror + "<br/>";
						if (data.lessToneCounterror != '' && data.lessToneCounterror != null)
							msg += data.lessToneCounterror + "<br/>";
						if (data.totalLessToneWeighterror != '' && data.totalLessToneWeighterror != null)
							msg += data.totalLessToneWeighterror + "<br/>";
						if (data.lessTonePriceerror != '' && data.lessTonePriceerror != null)
							msg += data.lessTonePriceerror + "<br/>";
						if (data.lessToneError != '' && data.lessToneError != null)
							msg += data.lessToneError + "<br/>";
						if (data.tonePriceError != '' && data.tonePriceError != null)
							msg += data.tonePriceError + "<br/>";
						if (data.discountError != '' && data.discountError != null)
							msg += data.discountError + "<br/>";

						if (msg != '') {
							jAlert(msg, "提示", function(e) {
								$("#retailPrice").val('0-0');
								//$("#retailPrice").focus();
								//$("#retailPrice").attr("readonly", false);
							});
							//return;
						}

						if (data.newMarketPrice > 0) {
							var marketPrice = Number(data.newMarketPrice);
							marketPrice = parseInt(marketPrice * 0.0095) * 100 + "-" + parseInt(marketPrice * 0.011) * 100;
							$("#retailPrice").val(marketPrice);
							$("#retailPrice").attr("readonly", true);
							$("#remark").focus();
						}

					}
				});
			} else {
				dialog.close();
				jAlert("请输入批次或者物料信息！", "提示", function(e) {
					$("#charg").select();
				})
			}
		} else if (orderType == 3 || $("#type").val() == "X5") {
			dialog.close();
			$("#retailPrice").val('0-0');
			$("#retailPrice").attr("readonly", false);
			$("#retailPrice").focus();

		}
	}

	$("#toneType").keydown(function(e) {
		if (e.keyCode == 13) {
			if ($(this).val() == '') {
				alert("请选择石料类型");
				$("#toneType").focus();
				return;
			}
			$("#gemweight").focus();
		}
	});
	// $("#gemweight").blur(getNewPrice);

	$("#gemweight").keydown(function(e) {
		needGetMatnr += 1;
		if (e.keyCode == 13) {
			if (decimalReg.test($(this).val())) {
				$(this).val(Number(decimalReg.exec($(this).val())[0]));
				$("#toneNeatness").focus();
				// getNewPrice();
			} else {
				alert("请输入正确的数字！");
				$("#gemweight").focus();
			}
		}
	});

	$("#toneColor").keydown(function(e) {
		if (e.keyCode == 13) {
			if ($(this).val() == '') {
				alert("请选择石料颜色");
				$("#toneColor").focus();
				return;
			}
			$("#goldType").focus();
		}
	});

	$("#toneNeatness").keydown(function(e) {
		if (e.keyCode == 13) {
			if ($(this).val() == '') {
				alert("请选择石料净度");
				$("#toneNeatness").focus();
				return;
			}
			$("#certificate").focus();
		}
	});

	$("#goldType").keydown(function(e) {
		if (e.keyCode == 13) {
			if ($(this).val() == '') {
				alert("请选择金料类型");
				$("#goldType").focus();
				return;
			}
			if (orderType == 1) {
				if ($("#type").val() == "J3") {
					$("#goodsize").focus();
				} else
					$("#goldweightFrom").focus();
			} else
				$("#goodsize").focus();

		}
	});

	$("#goldweightFrom").keydown(function(e) {
		if (e.keyCode == 13) {
			if (decimalReg.test($(this).val())) {
				$(this).val(Number(decimalReg.exec($(this).val())[0]));
				$("#goldweightTo").focus();
			} else {
				alert("请输入正确的数字！");
				$("#goldweightFrom").focus();
			}
		}
	});
	$("#goldweightTo").keydown(function(e) {
		if (e.keyCode == 13) {
			if (decimalReg.test($(this).val())) {
				$(this).val(Number(decimalReg.exec($(this).val())[0]));
				$("#goodsize").focus();
			} else {
				alert("请输入正确的数字！");
				$("#goldweightTo").focus();
			}
		}
	});
	$("#goldweight").keydown(function(e) {
		if (e.keyCode == 13) {
			if (decimalReg.test($(this).val())) {
				$(this).val(Number(decimalReg.exec($(this).val())[0]));
				$("#goodsize").focus();
			} else {
				alert("请输入正确的数字！");
				$("#goldweight").focus();
			}
		}
	});
	$("#goodsize").keydown(function(e) {
		if (orderType != 1)
			needGetMatnr = 1;
		if (e.keyCode == 13) {
			if ($(this).val() != '') {
				$(this).val(Number(decimalReg.exec($(this).val())[0]));
				$("#technics").focus();
			} else {
				alert("请输入正确的数字！");
				$("#goodsize").focus();
			}
		}
	});

	$("#technics").change(function(e) {
		needGetMatnr += 1;
	});
	$("#mainToneStyle").change(function(e) {
		needGetMatnr += 1;
	});

	$("#technics").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#number").focus();
		}
	});
	$("#number").keydown(function(e) {
		if (e.keyCode == 13) {
			if (decimalReg.test($(this).val())) {
				if ($("#type").val() == "J3") {
					$("#retailPrice").focus();
				} else {
					$(this).val(Number(numberReg.exec($(this).val())[0]));
					$("#calcNewPrice").focus();
				}
			} else {
				alert("请输入正确的数字！");
				$("#number").focus();
			}
		}
	});

	$("#retailPrice").keydown(function(e) {
		if (e.keyCode == 13) {
			// if (decimalReg.test($(this).val())) {
			// $(this).val(Number(decimalReg.exec($(this).val())[0]));
			$("#remark").focus();

			event.stopPropagation();
			// } else {
			// alert("请输入正确的数字！");
			// $("#retailPrice").focus();
			// }
		}

	});

	function clearcharginfo() {
		
		$("#matnrselect").hide();
		$("#matnrinput").show();
		
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
		// $("#retailPrice").val("");
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
		if ($("#type").val() == 'Y1') {
			$("#ifinlay").attr('checked', false);
			$("#goldRow").hide();
			$("#toneFireColor").val('');
			$("#toneshape").val('');
		}
		$("#goldType").val('');
		$("#number").val(1);
		$("#lessToneType").val('');
		$("#toneNeatness").val('');
		// $("#toneNeatness").append("<option value=''>请选择...</option>");
		$("#lessToneSpan").hide();
		$("#toneType").val('');
		// $("#toneType").append("<option value=''>请选择...</option>");
		$("#toneColor").val('');
		$("#toneColor2").val('');
		// $("#toneColor").append("<option value=''>请选择...</option>");
		$("#goldType").val('');
		// $("#goldType").append("<option value=''>请选择...</option>");
		//getCertificate();
		$("#technics").val('');
		// $("#technics").append("<option value=''>请选择...</option>");
		$("#mainToneStyle").val('');
		// $("#mainToneStyle").append("<option value=''>请选择...</option>");
		$("#gemweight").val('');
		$("#ifNeedLessTone").attr('checked', false);
		// $("#charg").focus();
	}

	$("#remark").keydown(
			function(event) {
				if (event.keyCode == 13) {
					if ($('#matnr').val() == "") {
						alert("请录入商品信息!");
						$('#matnr').focus();
						return;
					}
					if ($('#matnrinput').val() == "") {
						alert("请录入商品信息!");
						$('#matnrinput').focus();
						return;
					}
					if (orderType == 1) {
						if ($("#goldType").val() == '') {
							alert("请选择金料类型!");
							$("#goldType").focus();
							return;
						}
					} else if (orderType == 2) {
						if ($("#toneType").val() == '') {
							alert("请选择石料类型!");
							$("#toneType").focus();
							return;
						} else if ($("#toneColor").val() == '' && $("#toneColor").find("option").length > 1 && !isHavePrice
								&& $("#type").val() != 'X4' && $("#type").val() != 'X3' && $("#type").val() != 'X2') {
							alert("请选择石料颜色!");
							$("#toneColor").focus();
							return;
						} else if ($("#toneNeatness").val() == '' && $("#type").val() == "X1" && !isHavePrice) {
							alert("请选择石料净度!");
							$("#toneNeatness").focus();
							return;
						} else if ($("#goldType").val() == '') {
							alert("请选择金料类型!");
							$("#goldType").focus();
							return;
						}
					} else if (orderType == 3) {
						if ($("#bowlderType").val() == '') {
							alert("请选择石料类型!");
							$("#bowlderType").focus();
							return;
							// } else if ($("#toneshape").get(0).selectedIndex
							// == 0) {
							// alert("请选择石料形状!");
							// $("#toneshape").focus();
							// return;
						} else if ($("#checkbox").attr("checked") == "checked" && $("#goldType").get(0).selectedIndex == 0) {
							alert("请选择金料类型!");
							$("#goldType").focus();
							return;
						}
					} else {
						alert("请选择选款类型！");
						$("#type").focus();
					}

					if (needGetMatnr != 0) {
						jConfirm("你有修改选款参数值，系统重新获取修改后的物料编号,确定开始获取物料信息！", "操作提示", function(e) {
							if (e) {
								// $("#getMatnrInfo").focus();
								getmatnrinfo();
							}
						});
						return;
					}

					if ($("#ifNeedLessTone").attr("checked") == "checked" && $("#lessToneType").val() == '') {
						alert("请选择 副石石料！");
						$("#lessToneType").focus();
						return;
					}

					if ($('input:radio[name="chargtype"]:checked').val() !== "gift") {
						if (Number($("#number").val()) <= 0 || !decimalReg.test($("#number").val())) {
							alert('商品数量不正确，请检查!');
							$("#number").focus();
							return false;
						}
					}

					if (orderType == 1 && $("#type").val() != "J3") {
						if ($("#goldweightFrom").val() == '' && !isHavePrice) {
							alert("您没有输入金重的起始值！");
							$("#goldweightFrom").focus();
							return;
						} else if ($("#goldweightTo").val() == '' && !isHavePrice) {
							alert("您没有输入金重的结束值！");
							$("#goldweightTo").focus();
							return;
						}
					}

					if ($("#goodsize").val() == '' && !isHavePrice) {
						jAlert("请输入货品尺寸");
					}

					var value = $("#retailPrice").val();
					if (value.indexOf('-') == -1 && !isHavePrice) {
						alert("市场零售参考价中请输入正确的金额区间!");
						$("#retailPrice").select();
						return;
					}
					var values = value.split('-');
					if (Number(values[0]) > Number(values[1]) && !isHavePrice) {
						alert("市场零售参考价中区间前值不能大于后值！");
						$("#retailPrice").select();
						return;
					} else if (Number(values[1]) <= 0 && !isHavePrice) {
						alert("请输入市场零售参考价！");
						$("#retailPrice").select();
						return;
					}

					var choiceType = $("#type").val();
					if (choiceType == 'J1' || choiceType == 'J2' || choiceType == 'J3' || choiceType == 'J4' || choiceType == 'J5'
							|| choiceType == 'Y1' || choiceType == 'X2' || choiceType == 'X3' || choiceType == 'X4') {
						// alert($("#remark").val());
						if ($("#remark").val() == '') {
							alert("您还没有在备注中录入特殊需求或具体款式描述，不能提交！");
							$("#remark").focus();
							return;
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
		var currType = $("#type").val();
		var chargtype = $('input:radio[name="chargtype"]:checked').val();
		var rownum = $("#tablecontent tr").length - 2;
		var toplevelstr = ""; // 用于保存上存文本
		var upnumbertext = "";// 记录上存文体
		_ordertype = $("#ordertype").val(); // 订单类型字段
		// if (chargtype == "charg") {
		upnumber = Number(toplevelnumber) * 10;
		toplevelnumber = toplevelnumber + 1;
		style = "tdtoplevel";
		upnumbertext = "00";
		toplevelstr = "<div id=leveladdgifts" + upnumber + " style='display:none'>" + upnumber + "</div>"; // 增加礼品时记录礼品行号包括有多少礼品
		// } else if (chargtype == "gift") {
		// var gifusedid = $("#" + updategifid).text(); // 礼品最大填充了多少个
		// var usedgifnumber = gifusedid;
		// usedgifnumber = (usedgifnumber - (parseInt(usedgifnumber / 10) *
		// 10));// 产品下现在多少礼品
		// rownum = Number(addrownumber) + Number(usedgifnumber);
		// var newgifs = Number(gifusedid) + 1
		// // upnumber = Number(upbynumber) +upgiftnumber;
		// style = "tdgiftlevel";
		// upnumber = Number(gifusedid) + 1;
		// $("#" + updategifid).text(newgifs);
		// upnumbertext = $("#" + updatechargid).text(); // 得到上存ID
		// var giftnumber = 0;
		// if (opmode == "EDIT") {
		// $("#tablecontent tr").each(function() {
		// nextchildobject = $(this);
		// childposnrnumber =
		// nextchildobject.find("div[id^='upnumberlevel']").text(); // 找孩子结点编号
		// if (childposnrnumber == upnumbertext) {
		// giftnumber = giftnumber + 1;
		// }
		// });
		// rownum = Number(addrownumber) + Number(giftnumber);
		// }
		// if (_ordertype == "ZRE2" || _ordertype == "ZKL") { // 赠品的特殊处理
		// upnumber = upgiftnumber * 10;
		// rownum = $("#tablecontent tr").length - 2; // 赠品固定在后面插入
		// upnumbertext = "00";
		// }
		// // rownum=updaterow-1;
		// }
		// var ordertItemype = "<div id=ordertItemype" + rownum + "></div>";
		// var logrt = "<div id=logrt" + rownum + ">" + $("#logrt").val()
		// + "</div>";
		// _realprice = Number($("#realprice").val());
		// _total = Number($("#realprice").val());
		// _ztjtj = $("#ztjtj").val(); // 标签价格
		// _realTagPrice = $("#realTagPrice").val();
		_number = Number($("#number").val()); // 数量
		// ordertItemypestr = "";
		// ordertItemypeshow = ordertItemypeshowText(ordertItemypestr);
		// ordertItemype = "<div id=ordertItemype" + rownum + "
		// style='display:none'>" + ordertItemypestr + "</div>";
		var delimage = "<img alt='删除' src='resource/image/ext/delete.png' id='delrow'  align='middle' style='cursor:hand;'>";
		var row = "<div id=" + rownum + ">" + delimage + "</div>";
		var posnrnumber = "<div  id=posnrnumber" + rownum + "> " + upnumber + " </div>" + "<div id=upnumber" + chargtype + rownum
				+ " style='display:none'>" + upnumber + "</div>" + toplevelstr + "";
		var upumber = "<div id=upnumberlevel" + rownum + ">" + upnumbertext + "</div>";

		var _tempcharg = "", _tempmatnr = "";
		_tempcharg = $("#charg").val();
		_tempmatnr = ($("#matnrselect").val() == null || $("#matnrselect").val() == "") ? $("#matnrinput").val() : $("#matnrselect").val();
		_tempmatnr = _tempmatnr.indexOf("->") != -1 ? _tempmatnr.substring(0, _tempmatnr.indexOf("->")) : _tempmatnr;
		var charg = "<div id=charg" + rownum + ">" + _tempcharg.toUpperCase() + "&nbsp;</div>"; // 批次
		var matnr = "<div id=matnr" + rownum + ">" + _tempmatnr.toUpperCase() + "&nbsp; </div>"; // 物料

		var zhlhx = "<div id=zhlhx" + rownum + " >" + $("#zhlhx").val() + "&nbsp; </div>"; // 商品ID
		var number = "<div id=number" + rownum + ">" + _number + "</div>"; // 数量
		var ifinlay = $("#ifinlay").attr("checked") == "checked" ? 'X' : '';
		var ifinlayDiv = "<div id=ifinlay" + rownum + " style='display:none'>" + ifinlay + "</div><div id='ifinlayShow" + rownum + "'>"
				+ (ifinlay == "X" ? "是" : "否") + "</div>"; // 是否需要镶嵌

		if (orderType == 3)
			var toneType = "<div id=toneType"
					+ rownum
					+ " style='display:none'>"
					+ ($("#bowlderType").get(0).selectedIndex != 0 ? $("#bowlderType").val() + "|-|"
							+ $("#bowlderType").find("option:selected").text() : "") + "</div><div id='toneTypeShow" + rownum + "'>"
					+ ($("#bowlderType").get(0).selectedIndex != 0 ? $("#bowlderType").find("option:selected").text() : "&nbsp;") + "</div>"; // 石料
		else
			var toneType = "<div id=toneType" + rownum + " style='display:none'>"
					+ ($("#toneType").get(0).selectedIndex != 0 ? $("#toneType").val() + "|-|" + $("#toneType").find("option:selected").text() : "")
					+ "</div><div id='toneTypeShow" + rownum + "'>"
					+ ($("#toneType").get(0).selectedIndex != 0 ? $("#toneType").find("option:selected").text() : "&nbsp;") + "</div>"; // 石料

		var toneWeight = Number($("#gemweight").val());
		var toneWeightDiv = "<div id=toneWeight" + rownum + ">" + toneWeight + "</div>"; // 主石重

		// // 总重
		// var goodTotalWeight = "<div id=goodTotalWeight" + rownum + ">" +
		// Number($("#goodTotalWeight").val()) + "</div>";

		// 石料颜色
		var toneColor = "<div id=toneColor"
				+ rownum
				+ " style='display:none'>"
				+ (orderType == 2 ? ($("#toneColor").val() != '' ? ($("#toneColor").val() + "|-|" + $("#toneColor").find("option:selected").text())
						: "") : ($("#toneColor2").val() != '' ? ($("#toneColor2").val() + "|-|" + $("#toneColor2").find("option:selected").text())
						: ""))
				+ "</div><div id='toneColorShow"
				+ rownum
				+ "' >"
				+ (orderType == 2 ? ($("#toneColor").val() != '' ? $("#toneColor").find("option:selected").text() : "&nbsp;") : ($("#toneColor2")
						.val() != '' ? $("#toneColor2").find("option:selected").text() : "&nbsp;")) + "</div>";

		// 石料净度
		var toneNeatness = "<div id=toneNeatness"
				+ rownum
				+ " style='display:none'>"
				+ ($("#toneNeatness").get(0).selectedIndex != 0 ? ($("#toneNeatness").val() + "|-|" + $("#toneNeatness").find("option:selected")
						.text()) : " ") + "</div><div id='toneNeatnessShow" + rownum + "'>"
				+ ($("#toneNeatness").get(0).selectedIndex != 0 ? $("#toneNeatness").find("option:selected").text() : "&nbsp;") + "</div>";

		// 石料形状$("#toneshapeth").css("display", "none");
		var toneshape = "<div id=toneshape" + rownum + " style='display:none'>"
				+ ($("#toneshape").get(0).selectedIndex != 0 ? ($("#toneshape").val() + "|-|" + $("#toneshape").find("option:selected").text()) : "")
				+ "</div><div id='toneNeatnessShow" + rownum + "'>"
				+ ($("#toneshape").get(0).selectedIndex != 0 ? $("#toneshape").find("option:selected").text() : "&nbsp;") + "</div>";

		// 金料
		var goldType = "<div id=goldType" + rownum + " style='display:none'>"
				+ ($("#goldType").get(0).selectedIndex != 0 ? ($("#goldType").val() + "|-|" + $("#goldType").find("option:selected").text()) : "")
				+ "</div><div id='goldtypeShow" + rownum + "'>"
				+ ($("#goldType").get(0).selectedIndex != 0 ? $("#goldType").find("option:selected").text() : "&nbsp;") + "</div>";
		var mygoldtype = $("#goldType").val();
		// 工艺
		var technics = "<div id=technics" + rownum + " style='display:none'>"
				+ ($("#technics").val() != "" ? ($("#technics").val() + "|-|" + $('#technics').find("option:selected").text()) : "")
				+ "</div><div id='technicsShow" + rownum + "'>"
				+ ($('#technics').get(0).selectedIndex != 0 ? $('#technics').find("option:selected").text() : "&nbsp;") + "</div>";
		var goodsize = "<div id=goodsize" + rownum + ">" + $("#goodsize").val() + "&nbsp;</div>"; // 货品尺寸

		var retailPrice = "<div id=retailPrice" + rownum + ">" + $("#retailPrice").val() + "</div>"; // 市场零售价参考

		var _remark = $("#remark").val();
		var con = 1;
		do {
			if (con % 2 != 0) {
				_remark = _remark.replace("\"", "“");
			} else {
				_remark = _remark.replace("\"", "”");
			}
			con++;
		} while (_remark.indexOf("\"") != -1);
		con = 1;
		do {
			if (con % 2 != 0) {
				_remark = _remark.replace("\'", "‘");
			} else {
				_remark = _remark.replace("\'", "’");
			}
			con++;
		} while (_remark.indexOf("\'") != -1);

		var remark = "<div id=remark" + rownum + ">" + _remark + "&nbsp;</div>"; // 备注

		var littleTotal = "";
		var retailPriceValue = $("#retailPrice").val();
		var retailPrices = retailPriceValue.split('-');
		littleTotal = (Number($("#number").val()) * Number(retailPrices[0])) + '-' + (Number($("#number").val()) * Number(retailPrices[1]));// 小计金额
		var littleTotalDiv = "<div id=littleTotal" + rownum + ">" + littleTotal + "</div>"; // 小计金额DIV

		var ifNeedLessTone = $("#ifNeedLessTone").attr("checked") == "checked" ? 'X' : '';
		var ifNeedLessToneDiv = "<div id=ifNeedLessTone" + rownum + " style='display:none'>" + ifNeedLessTone + "</div><div id='ifNeedLessToneShow"
				+ rownum + "'>" + (ifNeedLessTone == "X" ? "是" : "否") + "</div>"; // 是否需要副石Div

		// 副石
		var lessToneTypeDiv = "<div id=lessToneType"
				+ rownum
				+ " style='display:none'>"
				+ (($("#ifNeedLessTone").attr("checked") == "checked") ? ($("#lessToneType").get(0).selectedIndex != 0 ? ($("#lessToneType").val()
						+ "|-|" + $("#lessToneType").find("option:selected").text()) : "") : '')
				+ "</div><div id='lessToneTypeShow"
				+ rownum
				+ "'>"
				+ (($("#ifNeedLessTone").attr("checked") == "checked") ? ($("#lessToneType").get(0).selectedIndex != 0 ? $("#lessToneType").find(
						"option:selected").text() : "&nbsp;") : '&nbsp;') + "</div>";

		// 证书
		var certificateDiv = // "<div id=certificate" + rownum + "
		// style='display:none'>" +
		// ($("#certificate").get(0).selectedIndex != 0
		// ? $("#certificate").val():"") + "</div><div>"
		// + ($("#certificate").get(0).selectedIndex !=
		// 0 ?
		// $("#certificate").find("option:selected").text():"")
		// + "</div>";
		"<div id=certificate"
				+ rownum
				+ " style='display:none'>"
				+ ($("#certificate").selectedValuesString() != "" ? ($("#certificate").selectedValuesString() + "|-|" + $('#certificate').text())
						: "") + "</div><div id='certificateShow" + rownum + "'>"
				+ ($('#certificate').text() != "请选择..." ? $('#certificate').text() : "&nbsp;") + "</div>";

		// 火彩颜色
		var toneFireColor = "<div id=toneFireColor"
				+ rownum
				+ " style='display:none'>"
				+ ($("#toneFireColor").get(0).selectedIndex != 0 ? ($("#toneFireColor").val() + "|-|" + $("#toneFireColor").find("option:selected")
						.text()) : "") + "</div><div id='toneFireColorShow" + rownum + "'>"
				+ ($("#toneFireColor").get(0).selectedIndex != 0 ? $("#toneFireColor").find("option:selected").text() : " ") + "</div>";
		// 主石规格
		var mainToneStyle = "<div id=mainToneStyle"
				+ rownum
				+ " style='display:none'>"
				+ ($("#mainToneStyle").get(0).selectedIndex != 0 ? ($("#mainToneStyle").val() + "|-|" + $("#mainToneStyle").find("option:selected")
						.text()) : "") + "</div><div id='mainToneStyleShow" + rownum + "'>"
				+ ($("#mainToneStyle").get(0).selectedIndex != 0 ? $("#mainToneStyle").find("option:selected").text() : "&nbsp;") + "</div>";

		var goldweight = $("#goldweight").val();
		var goldweightdiv = "<div id=goldweight" + rownum + " style='display:none;'>" + goldweight + "</div>"; // 金重

		var goldweightFrom = $("#goldweightFrom").val();
		var goldweightTo = $("#goldweightTo").val();
		var mygoldweight = goldweightFrom + "-" + goldweightTo;
		var mygoldweightdiv = "<div id=mygoldweight" + rownum + ">" + mygoldweight + "</div>"; // 金重

		var count = Number($("#number").val());
		var goldweightlittleTotal = ((Number(goldweightFrom) + Number(goldweightTo)) / 2 * count).toFixed(2);
		var goldweightlittleTotaldiv = "<div id=goldweightlittleTotal" + rownum + ">" + goldweightlittleTotal + "</div>"; // 金重小计

		var imgpath = $("#pcimage").attr("src");
		var imgalt = $("#pcimage").attr("alt");
		var imaghref = "<a href=" + imgpath + " class='tooltip' title=" + $("#zhlhx").val() + "(" + $("#ztjtj").val() + ")>";
		var pcimage = "<div id=pcimage" + rownum + ">" + imaghref + "<img id=pcimagesrc  alt='" + imgalt + "' src=" + imgpath
				+ " height='40' width='38'/></a></div>";

		var oldRetailPrice = "<div id=oldRetailPrice" + rownum + ">" + $("#oldRetailPrice").val() + "</div>"; // 旧市场价
		var oldYbzjbPrice = "<div id=oldYbzjbPrice" + rownum + ">" + $("#oldYbzjbPrice").val() + "</div>"; // 旧的
		var oldTonePrice = "<div id=oldTonePrice" + rownum + ">" + $("#oldTonePrice").val() + "</div>"; // 旧石头价
		var oldTechnicsPrice = "<div id=oldTechnicsPrice" + rownum + ">" + $("#oldTechnicsPrice").val() + "</div>"; // 旧工艺价
		var extwg = "<div id=extwg" + rownum + ">" + $("#extwg").val() + "</div>"; // 旧extwg
		var matkl = "<div id=matkl" + rownum + ">" + $("#matkl").val() + "</div>"; // 旧matkl
		var kbetr = "<div id=kbetr" + rownum + ">" + $("#kbetr").val() + "</div>"; // 旧kbetr
		var oldCostPrice = "<div id=oldCostPrice" + rownum + ">" + $("#oldRetailPrice").val() + "</div>"; // 旧市场价

		var totalsubtotals = $("#totalsubtotal").text().split('-');

		$("#goldvalue").removeClass("inputattention");
		$("#personcost").removeClass("inputattention");
		$("#charg").addClass("inputkey");
		$("#realprice").removeClass("inputkey");
		$("#charg").focus();

		var row = "<tr><td class=" + style + ">" + row + "</td>";
		row = row + "<td class=" + style + ">" + posnrnumber + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + upumber + "</td>";
		row = row + "<td class=" + style + ">" + charg + "</td>";
		row = row + "<td class=" + style + ">" + matnr + "</td>";
		row = row + "<td class=" + style + ">" + zhlhx + "</td>";
		row = row + "<td class=" + style + " align='center'>" + pcimage + "</td>";
		row = row + "<td class=" + style + " align='right'>" + number + "</td>";
		if (orderType == 3)
			row = row + "<td class=" + style + " align='right'>" + ifinlayDiv + "</td>";

		if (orderType == 2 || orderType == 3)
			row = row + "<td class=" + style + " align='right'>" + toneType + "</td>";

		if (currType == "X1")
			row = row + "<td class=" + style + " align='right'>" + toneWeightDiv + "</td>";

		if ((currType == "X1" || orderType == 3))
			row = row + "<td class=" + style + " align='right'>" + toneColor + "</td>";

		if (orderType == 3)
			row = row + "<td class=" + style + " align='right'>" + toneshape + "</td>";

		// if (currType == "X2" || currType == "X3") {
		// row = row + "<td class=" + style + " align='right'>" + mainToneStyle
		// + "</td>";
		// }

		if (orderType == 2 && currType != 'X2' && currType != 'X3' && currType != 'X4') {
			row = row + "<td class=" + style + " align='right'>" + toneNeatness + "</td>";
		}

		if (orderType == 1 || orderType == 2 || ifinlay == "X")
			row = row + "<td class=" + style + " align='right'>" + goldType + "</td>";

		else if (orderType == 3 && ifinlay == "") {
			row = row + "<td class=" + style + " align='right'>" + goldType + "</td>";
		}
		if (orderType == 1 && currType != "J3") {
			row = row + "<td class=" + style + " align='right'>" + goldweightdiv + mygoldweightdiv + "</td>";
			row = row + "<td class=" + style + " align='right'>" + goldweightlittleTotaldiv + "</td>";
		}
		if (orderType == 1 || orderType == 2)
			row = row + "<td class=" + style + " align='right'>" + technics + "</td>";

		row = row + "<td class=" + style + " align='right'>" + goodsize + "</td>";

		// if (orderType != 1 || $("#type").val() == "J1"||$("#type").val() ==
		// "J2"||$("#type").val() == "J4"){
		row = row + "<td class=" + style + " align='right'>" + retailPrice + "</td>";
		row = row + "<td class=" + style + " align='right'>" + littleTotalDiv + "</td>";
		// }

		if (orderType == 2) {
			row = row + "<td class=" + style + " align='right'>" + ifNeedLessToneDiv + "</td>";
			// if(ifNeedLessTone == "X" || $("#lessToneTypeth").attr("display")
			// != 'none'){
			row = row + "<td class=" + style + " align='right'>" + lessToneTypeDiv + "</td>";
			// }
			// else{
			// row = row + "<td class=" + style + " align='right'
			// style='display:none' id='lessToneTypehide'"+rownum+">" +
			// lessToneTypeDiv + "</td>";
			// }
		}

		if (currType == "X5" || orderType == 3) {
			row = row + "<td class=" + style + " align='right'>" + toneFireColor + "</td>";
		}

		if ($("#type").val() == "X1") {
			row = row + "<td class=" + style + " align='right'>" + certificateDiv + "</td>";
		}

		// if (orderType == 2)
		// row = row + "<td class=" + style + " align='right'>" +
		// goodTotalWeight + "</td>"; // 总重

		row = row + "<td class=" + style + " align='right'>" + remark + "</td>"; // 备注

		row = row + "<td class=" + style + "  style='display:none'>" + oldRetailPrice + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + oldYbzjbPrice + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + oldTonePrice + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + oldTechnicsPrice + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + extwg + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + matkl + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + kbetr + "</td>";
		row = row + "<td class=" + style + "  style='display:none'>" + oldCostPrice + "</td>";
		row = row + "</tr>";

		if (currType == "J3") {
			// alert(mygoldtype);
			$.ajax({
				url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getHeadGoldValue&postType=1',
				data : "goldType=" + mygoldtype,
				dataType : 'json',
				success : function(data) {
					if (data.success != null) {
						$(row).insertAfter($("#tablecontent tr:eq(" + 0 + ")"));
						if (chargtype == "charg") {
							upbynumber = Number(upbynumber) + 1;
						} else if (chargtype == "gift") {
							upgiftnumber = Number(upgiftnumber) + 1;
						}
						goldtextdisplayno();
						gettechnics();
						$("#showmatnrinfo").hide('fast');
						$("#showoptinfo").hide('fast');
						$("#type").attr("disabled", true);

						$("#ifNeedLessTone").attr('checked', false);
						$("#lessToneSpan").hide();
						$("#matnr").empty();

						$("#matnrinput").show();
						$("#matnrinput").val('');
						// $("#number").val('');
						$("#retailPrice").val('');
						$("#matnrselect").hide();
						$("#matnrselect").empty();

						// 设置合计
						$("#totalnumber").text((Number($("#totalnumber").text()) + Number(_number)).toFixed(0)); // 总数量

						if (orderType == 1 && currType != "J3") {
							var totalgoldweight = Number($("#totalgoldweight").text());
							// alert($("#totalgoldweight").text());
							// alert(totalgoldweight);
							// alert(goldweightlittleTotal);
							$("#totalgoldweight").text(Number(Number($("#totalgoldweight").text()) + Number(goldweightlittleTotal)).toFixed(2)); // 总金重
						}

						// alert(totalsubtotals[0]);
						// alert(totalsubtotals[1]);
						$("#totalsubtotal").text(
								(Number(Number(totalsubtotals[0]) + Number(retailPrices[0]) * Number(_number))) + '-'
										+ (Number(Number(totalsubtotals[1]) + Number(retailPrices[1]) * Number(_number)))); // 总价格

						if (orderType == 2)
							$("#totaltoneweight").text((Number(Number($("#totaltoneweight").text()) + toneWeight))); // 总石重

						// if (chargtype == "charg" || _ordertype == 'ZRE2') {
						// $("#total").text((Number($("#total").text()) +
						// _total).toFixed(2));
						// //
						// $("#totalztjtj")
						// .text((Number($("#totalztjtj").text()) +
						// Number(_ztjtj))
						// .toFixed(2)); //
						// $("#totalrealprice")
						// .text((Number($("#totalrealprice").text()) +
						// _realprice)
						// .toFixed(2)); // 实际销售合计
						// }

					} else {
						jAlert("总部没有维护该金料的金价，不能提交", "提示", function(e) {
						});
						return;
					}
				}
			});

		} else {
			$(row).insertAfter($("#tablecontent tr:eq(" + 0 + ")"));
			if (chargtype == "charg") {
				upbynumber = Number(upbynumber) + 1;
			} else if (chargtype == "gift") {
				upgiftnumber = Number(upgiftnumber) + 1;
			}
			goldtextdisplayno();
			gettechnics();
			$("#showmatnrinfo").hide('fast');
			$("#showoptinfo").hide('fast');
			$("#type").attr("disabled", true);

			$("#ifNeedLessTone").attr('checked', false);
			$("#lessToneSpan").hide();
			$("#matnr").empty();

			$("#matnrinput").show();
			$("#matnrinput").val('');
			$("#number").val('1');
			$("#retailPrice").val('');
			$("#matnrselect").hide();
			$("#matnrselect").empty();

			// 设置合计
			$("#totalnumber").text((Number($("#totalnumber").text()) + Number(_number)).toFixed(0)); // 总数量

			if (orderType == 1 && currType != "J3") {
				var totalgoldweight = Number($("#totalgoldweight").text());
				// alert($("#totalgoldweight").text());
				// alert(totalgoldweight);
				// alert(goldweightlittleTotal);
				$("#totalgoldweight").text(Number(Number($("#totalgoldweight").text()) + Number(goldweightlittleTotal)).toFixed(2)); // 总金重
			}

			// alert(totalsubtotals[0]);
			// alert(totalsubtotals[1]);
			$("#totalsubtotal").text(
					(Number(Number(totalsubtotals[0]) + Number(retailPrices[0]) * Number(_number))) + '-'
							+ (Number(Number(totalsubtotals[1]) + Number(retailPrices[1]) * Number(_number)))); // 总价格

			if (orderType == 2)
				$("#totaltoneweight").text((Number(Number($("#totaltoneweight").text()) + toneWeight))); // 总石重

			// if (chargtype == "charg" || _ordertype == 'ZRE2') {
			// $("#total").text((Number($("#total").text()) +
			// _total).toFixed(2));
			// //
			// $("#totalztjtj")
			// .text((Number($("#totalztjtj").text()) + Number(_ztjtj))
			// .toFixed(2)); //
			// $("#totalrealprice")
			// .text((Number($("#totalrealprice").text()) + _realprice)
			// .toFixed(2)); // 实际销售合计
			// }

		}

		// 将输入设置为空
		clearcharginfo();
	}

	$("#salesorderid").keydown(function(event) {
		if (event.keyCode == 13) {
			creatTablehead($.trim($(this).val()));
		}

	});

	function goldtextdisplayno() {
		$("#goldvalue").hide();
		$("#goldvaluelabel").hide();
		$("#personcost").hide();
		$("#personcostlabel").hide();
		$("#showmatnrinfo2").hide();
	}

	$('#delrow').live('click', function() {
		var thistr = $(this).parents("tr:first");
		jConfirm("确定删除该条记录吗？", "请确认？", function(e) {
			if (e) {
				upnumberlevel = $(thistr).find("div[id^='upnumberlevel']").text(); // 得到上层及本层.
				upnumberlevelvalue = $("#leveladdgifts" + upnumberlevel).text(); // 得到上层有多上赠品

				var nexttrobj = thistr;
				var nextchildobject = thistr;
				_ordertype = $("#ordertype").val(); // 订单类型字段
				if (upnumberlevel == "") {
					jAlert('删除错误!', "提示", function(e) {
					});
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
				setTotalByObject(thistr); // 将合计扣除
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

	// 根据对象设置总值
	function setTotalByObject(object) {
		setTotalObjectText(object, 'totalnumber', 'number', 0);
		setTotalObjectText(object, 'totaltoneweight', 'toneWeight', 2);
		setTotalObjectText(object, 'totalgoldweight', 'goldweight', 3);
		setTotalObjectText(object, 'totalsubtotal', 'littleTotal', 2);
	}

	// 清除汇总行
	function cleatTotaltr() {
		clearTotalText('totalnumber', 0);
		clearTotalText('totaltoneweight', 2);
		clearTotalText('totalgoldweight', 3);
		clearTotalText('totalsubtotal', 2);
		clearTotalText('totalrealprice', 2);
	}

	// 设置合计字段当删除的时候
	function setTotalObjectText(object, totalname, fieldname, fixed) {

		if (totalname != 'totalsubtotal') {
			var value = $(object).find("div[id^='" + fieldname + "']").text();
			// 在原有值基础上-去
			$("#" + totalname + "").text((Number($("#" + totalname + "").text()) - Number(value)).toFixed(fixed));

		} else {
			var values = $(object).find("div[id^='" + fieldname + "']").text().split("-");
			var totals = $("#" + totalname + "").text().split("-");
			// 在原有值基础上-去
			$("#" + totalname + "").text((Number(totals[0]) - Number(values[0])) + "-" + (Number(totals[1]) - Number(values[1])));
		}
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

	$('a.tooltip').live('mousemove', function(e) {
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

	$('a.tooltip').live('mouseout', function(e) {
		this.title = this.myTitle;
		$("#tooltip").remove(); // 移除
	});
	$('a.tooltip').live('click', function(event) {
		jAlert('请您将鼠标移动到图片上显示大图!', "提示", function(e) {
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

	// $.ajax({
	// url :
	// "longhaul/pos/stock/stockSystem.ered?reqCode=getWerks&option=user&postType=1&werks="
	// + "01DL" + "&random=" + Math.random() + "",
	// dataType : "json",
	// //data : "charg=" + $.trim(_charg) + "&chargtype=" + _chargtype,
	// success : function(data) {
	// if (data == "") {
	// var chargalertstr = "输入条码不存在!";
	// chargalertstr = _chargtype == "gift" ? "输入物料编码不存在!" : chargalertstr
	// jAlert(chargalertstr, '提示', function(r) {
	// clearcharginfo();
	// });
	// }
	// $.map(data, function(item) {
	// $("#inwerk").append("<option
	// value='"+item.werks+"'>"+item.name1+"</option>");
	// });
	// }
	// });

	// 付款
	$("#submit").click(function() {
		submitValidate();
	})

	function submitValidate() {

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
				jAlert("没有录入任何订单信息,不能付款!", "提示", function(e) {
				});
				return false;
			} else {

				if ($("#custommade").attr("checked") == "checked") {
					if ($("#vipid").val() == '') {
						jAlert("请输入定制的顾客！", "提示", function(e) {
							$("#vipid").select();
						});
						return;
					} else if ($("#urgent").get(0).selectedIndex == 0) {
						jAlert("请选择加急状态！", "提示", function(e) {
							$("#urgent").focus();
						});
						return;
					}

				}

				jConfirm("确定提交吗？", "提示", function(e) {
					if (e == true)
						submitOrder();
				});
				// $("#statementaccount").dialog("open");
			}
		}

	}

	function submitOrder() {
		var orderInfo = getordertableinfo();
		var dialog = $.dialog({
			title : '提交中...',
			max : false,
			min : false,
			close : false,
			lock : true
		});

		$.ajax({
			url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=saveChoiceOrder&option=user&postType=1",
			data : {
				orderitem : orderInfo.orderitem,
				orderhead : orderInfo.orderhead
			},
			type : 'post',
			dataType : 'json',
			success : function(data) {
				dialog.close();
				var msg = "";
				if (data.dailygolderror != null) {
					msg += data.dailygolderror + "<br/>";
				}
				if (data.error != null)
					msg += data.error + "<br/>";
				if (data.success != null)
					msg += data.success + "<br/>";
				if (data.loginError != null)
					msg += data.loginError + "<br/>";

				jAlert(msg, "提示", function(e) {
					if (data.success != null) {
						location.reload();
					}
				});
			}
		});

	}

	// $("#custommade").click(function(){
	// alert($('#custommade').attr("checked")==null)
	// });

	function getordertableinfo() {
		trlength = $("#tablecontent tr").length;
		var orderhead = "";

		_saporderid = $("#saporderid").val();
		// alert(_saporderid);
		orderhead = orderhead + "\"saporderid\":\"" + $.trim(_saporderid) + "\",";

		_choiceorderid = $("#choiceorderid").val();
		// alert(_choiceorderid);
		orderhead = orderhead + "\"choiceorderid\":\"" + $.trim(_choiceorderid) + "\",";

		_ordertime = $("#ordertime").val();
		orderhead = orderhead + "\"saledate\":\"" + $.trim(_ordertime) + "\",";

		_type = $("#type").val();
		orderhead = orderhead + "\"type\":\"" + $.trim(_type) + "\",";

		_totalnumber = $("#totalnumber").text();
		orderhead = orderhead + "\"quantity\":\"" + $.trim(_totalnumber) + "\",";

		// 加急状态
		_urgent = $("#urgent").val();
		orderhead = orderhead + "\"urgent\":\"" + $.trim(_urgent) + "\",";

		// 联系方式
		_contract = $("#contract").val();
		orderhead = orderhead + "\"telephone\":\"" + $.trim(_contract) + "\",";

		// 订单头备注
		_headremark = $("#headermark").val();
		orderhead = orderhead + "\"remark\":\"" + $.trim(_headremark) + "\",";

		_custommade = $('#custommade').attr("checked") == null ? '' : 'X';
		orderhead = orderhead + "\"custommade\":\"" + $.trim(_custommade) + "\",";

		_vipid = $('#custommade').attr("checked") == null ? '' : $("#vipid").val();
		orderhead = orderhead + "\"vipid\":\"" + $.trim(_vipid) + "\",";
		
		orderhead = orderhead + "\"oldwerks\":\"" + $.trim(historyWerks == null ? "" : historyWerks ) + "\",";
	
		
		if (orderType == 2) {
			_totaltoneweight = $("#totaltoneweight").text();
			if(isNaN(_totaltoneweight)){
				_totaltoneweight = '0';
			}
			orderhead = orderhead + "\"totaltoneweight\":\"" + $.trim(_totaltoneweight) + "\",";
		}
		

		if (orderType == 1) {
			_totalgoldweight = $("#totalgoldweight").text();
			if(isNaN(_totalgoldweight)){
				_totalgoldweight = '0';
			}
				orderhead = orderhead + "\"totalgoldweight\":\"" + $.trim(_totalgoldweight) + "\",";
		}

		// if (orderType != 1 || $("#type") == 'J3') {
		_totalsubtotal = $("#totalsubtotal").text();
		orderhead = orderhead + "\"totalmoney\":\"" + $.trim(_totalsubtotal) + "\",";
		// }

		orderhead = orderhead + "\"orderflag\":\"NO\"";

		orderhead = "{" + orderhead + "}";

		var tablestr = "";
		$("#tablecontent tr").each(function() { // 得到每一个tr
			earchobject = $(this);

			if (earchobject.index() == 0 || earchobject.index() + 1 == trlength) {
				return true;
			}
			_posnrnumber = earchobject.find("div[id^='posnrnumber']").text();
			_upnumberlevel = earchobject.find("div[id^='upnumberlevel']").text();
			_charg = earchobject.find("div[id^='charg']").text();// 批次
			_matnr = earchobject.find("div[id^='matnr']").text();// 物料号
			_zhlhx = earchobject.find("div[id^='zhlhx']").text(); // 商品名
			_number = earchobject.find("div[id^='number']").text();// 数量

			_toneType = $(earchobject.find("div[id^='toneType']")[0]).text(); // 石料类型

			_goldweight = $(earchobject.find("div[id^='goldweight']")[0]).text(); // 金料重量

			_mygoldweight = $(earchobject.find("div[id^='mygoldweight']")[0]).text(); // 金料重量

			_toneWeight = earchobject.find("div[id^='toneWeight']").text();// 石料重量

			_toneColor = $(earchobject.find("div[id^='toneColor']")[0]).text();// 石料颜色

			_toneNeatness = $(earchobject.find("div[id^='toneNeatness']")[0]).text();// 石料净度

			_mainToneStyle = $(earchobject.find("div[id^='mainToneStyle']")[0]).text();// 主石规格

			_goldType = $(earchobject.find("div[id^='goldType']")[0]).text();// 金料类型

			_technics = $(earchobject.find("div[id^='technics']")[0]).text();// 工艺类型

			_goodsize = earchobject.find("div[id^='goodsize']").text();// 货品尺寸

			_retailPrice = earchobject.find("div[id^='retailPrice']").text();// 市场零售参考价

			_littleTotal = earchobject.find("div[id^='littleTotal']").text();// 小计费用

			_pcimagesrc = earchobject.find("img[id^='pcimagesrc']").attr("alt"); // 图片路径

			_ifNeedLessTone = $(earchobject.find("div[id^='ifNeedLessTone']")[0]).text();// 是否要副石

			_lessToneType = $(earchobject.find("div[id^='lessToneType']")[0]).text();// 副石类型

			_toneshape = $(earchobject.find("div[id^='toneshape']")[0]).text();// 石料形状

			_certificate = $(earchobject.find("div[id^='certificate']")[0]).text();// 裸石证书

			_toneFireColor = $(earchobject.find("div[id^='toneFireColor']")[0]).text();// 石料火彩

			_goodTotalWeight = earchobject.find("div[id^='goodTotalWeight']").text();// 总重

			_remark = earchobject.find("div[id^='remark']").text();// 备注
			var con = 1;
			do {
				if (con % 2 != 0) {
					_remark = _remark.replace("\"", "“");
				} else {
					_remark = _remark.replace("\"", "”");
				}
				con++;
			} while (_remark.indexOf("\"") != -1);

			con = 1;
			do {
				if (con % 2 != 0) {
					_remark = _remark.replace("\'", "‘");
				} else {
					_remark = _remark.replace("\'", "’");
				}
				con++;
			} while (_remark.indexOf("\'") != -1);

			_oldRetailPrice = earchobject.find("div[id^='oldRetailPrice']").text();// 备注
			_oldYbzjbPrice = earchobject.find("div[id^='oldYbzjbPrice']").text();// 备注
			_oldTonePrice = earchobject.find("div[id^='oldTonePrice']").text();// 备注
			_oldTechnicsPrice = earchobject.find("div[id^='oldTechnicsPrice']").text();// 备注
			_extwg = earchobject.find("div[id^='extwg']").text();// 备注
			_matkl = earchobject.find("div[id^='matkl']").text();// 备注
			_kbetr = earchobject.find("div[id^='kbetr']").text();// 备注
			_oldCostPrice = earchobject.find("div[id^='oldCostPrice']").text();// 备注

			_goldweightlittleTotal = $("#goldweightlittleTotal").text();

			_ifinlay = $(earchobject.find("div[id^='ifinlay']")[0]).text(); // 是否镶嵌

			tablestr = tablestr + "\"" + earchobject.index() + "\":";
			tablestr = tablestr + "{\"choiceorderitem\":\"" + $.trim(_posnrnumber) + "\",";
			tablestr = tablestr + "\"upchoiceorderitem\":\"" + $.trim(_upnumberlevel) + "\",";
			tablestr = tablestr + "\"batchnumber\":\"" + $.trim(_charg) + "\",";
			tablestr = tablestr + "\"materialnumber\":\"" + $.trim(_matnr) + "\",";
			tablestr = tablestr + "\"materialdesc\":\"" + $.trim(_zhlhx) + "\",";
			tablestr = tablestr + "\"quantity\":" + $.trim(_number) + ",";

			tablestr = tablestr + "\"toneType\":\"" + $.trim(_toneType) + "\",";

			if (orderType == 1) {
				tablestr = tablestr + "\"goldweight\":\"" + $.trim(_goldweight) + "\",";
				tablestr = tablestr + "\"mygoldweight\":\"" + $.trim(_mygoldweight) + "\",";
				tablestr = tablestr + "\"goldweightlittleTotal\":\"" + $.trim(_goldweightlittleTotal) + "\",";
			}

			if (orderType == 2) {
				tablestr = tablestr + "\"toneWeight\":\"" + $.trim(_toneWeight) + "\",";
				tablestr = tablestr + "\"ifNeedLessTone\":\"" + $.trim(_ifNeedLessTone) + "\",";
				// tablestr = tablestr + "\"goodTotalWeight\":" +
				// $.trim(_goodTotalWeight) + ",";

				if (_ifNeedLessTone == "X") {
					tablestr = tablestr + "\"lessToneType\":\"" + $.trim(_lessToneType) + "\",";
				}
				if ($("#type").val() == "X1" || $("#type").val() == "X4" || $("#type").val() == "Q1")
					tablestr = tablestr + "\"certificate\":\"" + $.trim(_certificate) + "\",";
				else
					tablestr = tablestr + "\"mainToneStyle\":\"" + $.trim(_mainToneStyle) + "\",";
			}

			if (orderType == 2 || orderType == 3)
				tablestr = tablestr + "\"toneColor\":\"" + $.trim(_toneColor) + "\",";

			if (orderType == 2)
				tablestr = tablestr + "\"toneNeatness\":\"" + $.trim(_toneNeatness) + "\",";

			if (orderType == 3) {
				tablestr = tablestr + "\"ifinlay\":\"" + $.trim(_ifinlay) + "\",";
				tablestr = tablestr + "\"toneshape\":\"" + $.trim(_toneshape) + "\",";
				tablestr = tablestr + "\"toneFireColor\":\"" + $.trim(_toneFireColor) + "\",";
			}

			if ((orderType == 1 || orderType == 2) || (orderType == 3 && _ifinlay == "X"))
				tablestr = tablestr + "\"goldType\":\"" + $.trim(_goldType) + "\",";

			if (orderType == 1 || orderType == 2)
				tablestr = tablestr + "\"technics\":\"" + $.trim(_technics) + "\",";

			tablestr = tablestr + "\"goodsize\":\"" + $.trim(_goodsize) + "\",";

			// if (orderType == 2 || orderType == 3 || $("#type").val() == "J3")
			// {
			tablestr = tablestr + "\"retailPrice\":\"" + $.trim(_retailPrice) + "\",";
			tablestr = tablestr + "\"littleTotal\":\"" + $.trim(_littleTotal) + "\",";
			// }

			tablestr = tablestr + "\"remark\":\"" + $.trim(_remark) + "\",";

			tablestr = tablestr + "\"oldRetailPrice\":\"" + $.trim(_oldRetailPrice) + "\",";
			tablestr = tablestr + "\"oldYbzjbPrice\":\"" + $.trim(_oldYbzjbPrice) + "\",";
			tablestr = tablestr + "\"oldTonePrice\":\"" + $.trim(_oldTonePrice) + "\",";
			tablestr = tablestr + "\"oldTechnicsPrice\":\"" + $.trim(_oldTechnicsPrice) + "\",";
			tablestr = tablestr + "\"extwg\":\"" + $.trim(_extwg) + "\",";
			tablestr = tablestr + "\"matkl\":\"" + $.trim(_matkl) + "\",";
			tablestr = tablestr + "\"kbetr\":\"" + $.trim(_kbetr) + "\",";
			tablestr = tablestr + "\"oldCostPrice\":\"" + $.trim(_oldCostPrice) + "\",";

			tablestr = tablestr + "\"productpictureurl\":\"" + $.trim(_pcimagesrc) + "\"}";

			tablestr = earchobject.index() == trlength - 2 ? tablestr : tablestr + ",";
		});

		tablestr = "{" + tablestr + "}";
		// alert(tablestr);
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

				submitOrder();

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
		// cleatTotaltr();
		gettechnics();
	}

	// 清除汇总行
	function cleatTotaltr() {
		clearTotalText('totalnumber', 0);
		clearTotalText('totalgoldweight', 3);
		clearTotalText('totalsubtotal', 2);
		clearTotalText('totaltoneweight', 2);
	}

	// 设置汇总行为0
	function clearTotalText(totalname, fixed) {
		$("#" + totalname + "").text(Number(0));
	}

	// $("#type").focus();
	$("#type").keydown(function(e) {
		if (e.keyCode == 13) {
			if ($(this).get(0).selectedIndex == 0) {
				jAlert("请选择选款类型！", "提示", function(e) {
				});
				$(this).focus();
				return;
			}
			$("#charg").focus();
		}
	});

	$("#matnrinput").keydown(function(event) {
		if ($('#type').get(0).selectedIndex == 0) {
			jAlert("请先选择选款类型！！", "提示", function(e) {
				$("#charg").val('');
				$('#type').focus();
			});
			return;
		}
		if (event.keyCode == 13) {
			if ($.trim($("#matnrinput").val()) != "") {
				$("#matnrinput").autocomplete("close");
				$("#number").val('1');
				getmatnrbyuser();
			}
		}
	}).keypress(function(event) {

	}).autocomplete(
			{
				source : function(request, response) {
					_matnr = $("#matnrinput").val().toUpperCase();
					var choiceOrderType = $('#type').get(0).value;
					$.ajax({
						url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getMatnrInfo&postType=1&option=auto&werks=" + "01DL"
								+ "&random=" + Math.random() + "",
						dataType : "json",
						data : "matnr=" + $.trim(_matnr) + "&choiceOrderType=" + choiceOrderType,
						success : function(data) {
							if (data == "") {
								jAlert("输入物料号不存在!", "提示", function(e) {
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
				delay : 1000,
				minLength : 1,
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
		// $("#number").focus();
		// $("#toneRow").css("display","none");
		// $("#bowlderRow").css("display","none");getmatnrbyuser()
		// $("#goldRow").css("display","none");
		if ($("#matnrinput").css("display") != 'none')
			tempmatnrNo = $("#matnrinput").val();
		else
			tempmatnrNo = $("#matnrselect").val();
		_mycharg = tempmatnrNo.substring(0, tempmatnrNo.indexOf("->"));
		_matnr = tempmatnrNo.indexOf("->") > 0 ? _mycharg : tempmatnrNo;
		_matnr = _matnr.toUpperCase();
		var choiceOrderType = $('#type').get(0).value;
		$("#matnrinput").val(_matnr);
		// $.ajaxSetup({
		// error : function(x, e) {
		// jAlert("访问服务器错误信!<font color='red'>" + x.responseText +
		// "</font>","提示",function(e){});
		// return false;
		// }
		// });
		$.ajax({
			url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getMatnrInfo&option=user&postType=1&werks=" + "01DL" + "&random="
					+ Math.random() + "",
			dataType : "json",
			data : "matnr=" + $.trim(_matnr) + "&choiceOrderType=" + choiceOrderType,
			success : function(data) {
				if (data == "" || data == null) {
					jAlert("无此物料号，请与产品部联系！", "提示", function(e) {
						clearcharginfo();
						$("#matnrinput").focus();
					});
					return;
				}
				$.map(data, function(item) {
					var matnr = item.matnr == null ? "" : item.matnr; // 物料号
					var zhlhx = item.maktx == null ? "" : item.maktx; // 产品名称
					var ztjtj = item.kbetr == null ? 0 : item.kbetr; // 标签价
					var pcimage = item.zmatnrt == null ? "" : item.zmatnrt; // 照片
					pcimage = (pcimage == null || pcimage == '') ? (matnr.substring(0,1)+'/'+matnr.substring(1,2)+'/'+matnr.substring(2,3)+'/' + matnr + '.jpg') : pcimage;
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
					var minPrice = item.zbzjs;
					var maxPrice = item.zbzjx;
					var menge = item.menge;
					var mstae = item.mstae;
					toneCount = menge;
					var isOk = item.isOk;
					// alert(zjlbm);
					// alert(minPrice);
					// alert(maxPrice);
					// alert(menge);
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
						minPrice : minPrice,
						maxPrice : maxPrice,
						isOk : isOk,
						mstae : mstae,
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
		
		
		if(charginfo.mstae == '03'){
			jAlert("此物料号不允许下单", "提示",function(e){
				$("#matnrinput").focus();
			});
			return;
		}
		
	//$("#certificate").empty();
		if (charginfo.isOk == "NO") {
			jAlert("类型不符，请选择其他物料号！", "提示", function(e) {
				clearcharginfo();
				$("#matnrinput").focus();
			});
			return;
		}

		// $("#charg").val("");
		$("#matnrinput").val(charginfo.matnr);
		$("#zhlhx").val(charginfo.zhlhx);
		$("#ztjtj").val(charginfo.ztjtj);
		// $("#number").val(1);
		$("#realnumber").val(0);
		// $("#realprice").val(0); // 实收
		$("#goldweight").val(0); // 金重
		if ($("#matnrinput").css("display") != 'none')
			$("#gemweight").val(0); // 石重
		if ($("#matnrinput").css("display") != 'none')
			$("#goodsize").val(0);// 货品尺寸
		$("#extwg").val(charginfo.extwg);// 货品款式
		$("#matkl").val(charginfo.matkl);// 核价系数
		$("#bismt").val(charginfo.bismt);// 主模号

		if ($("#type").val() == 'Y1') {
			if (charginfo.zjlbm != null && charginfo.zjlbm != '') {
				$("#ifinlay").attr("checked", true);
				$("#goldRow").show();
				getGoldType('all', charginfo.zjlbm);
			} else {
				$("#ifinlay").attr("checked", false);
				$("#goldRow").hide();
			}
		}

		var zgy = charginfo.zgy.split(',');
		var sjczbm = $.trim(charginfo.sjczbm);
		var slbm = $.trim(charginfo.slbm);
		var slxz = $.trim(charginfo.slxz);
		var slys = $.trim(charginfo.slys);
		var slgg = $.trim(charginfo.slgg);
		var zsjd = $.trim(charginfo.zsjd);

		getYshckBymatnr(charginfo.matnr, charginfo.kondm, slbm, slxz, slys, zsjd, charginfo.zgy, charginfo.extwg);

		if (($("#matnrinput").css("display") != 'none')) {
			if (charginfo.bismt == "" || charginfo.bismt == null) {
				if (slbm != "" && slbm != null) {
					if (orderType == 3) {
						getBowlderType('JA(CH,JA)', slbm);
					} else {
						$("#toneRow").css("display", "");
						getToneType($("#type").val(), slbm);
					}
				}

				if (orderType == 3) {
					$("#bowlderRow").css("display", "");
					getToneShape(slxz);
					getToneFireType(null);
				}

				// if (slys != "" && slys != null) {
				// if (orderType == 3) {
				// $("#bowlderRow").css("display", "");
				// getToneColor2("all", slys);
				// }
				// }

				if ((orderType == 1 || orderType == 2))
					getToneColor($("#type").val(), slys, slbm);
				else {
					$("#bowlderRow").css("display", "");
					getToneColor2($("#type").val(), slys, slbm);
				}

				if (orderType == 2) {
					$("#toneRow").css("display", "");
					getToneNeatness(zsjd);
				}

				if (orderType == 1 || orderType == 2)
					$("#goldRow").css("display", "");
				gettechnics(zgy);

				// var type = sjczbm.substring(0, 1) == "P"? sjczbm.substring(0,
				// 2):
				// sjczbm.substring(0, 1);
				if (orderType == 2)
					getGoldType("all", sjczbm);
				else
					getGoldType($("#type").val(), sjczbm);

			} else {
				getBismtInfo(charginfo.bismt, slxz, slgg, zgy, sjczbm, slbm);

				if(orderType == 1 || orderType == 2){
				}else{
					$("#bowlderRow").css("display", "");
				}
				
				if ((orderType == 1 || orderType == 2) && ($("#matnrinput").css("display") != 'none'))
					getToneColor($("#type").val(), slys, slbm);
				else {
					if($("#matnrinput").css("display") == 'none'){
						getToneColor2($("#type").val(), slys, slbm);
					}
				}

				if ($("#type").val() == "X1" && ($("#matnrinput").css("display") == 'none') ) {
					getToneNeatness(zsjd);
				}

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
			$("#showmatnrinfo").show();
			$("#showmatnrinfo2").show();
			$("#showoptinfo").show();
			// alert(charginfo.minPrice);
			if (Number(charginfo.minPrice) > 0) {

				jAlert("请注意，该款为<b style='color:red;'>特殊款式</b>，其中的属性不能修改！", "提示", function(e) {
					$("#remark").focus();
				});

				isHavePrice = true;
				$("#retailPrice").val(charginfo.minPrice + '-' + charginfo.maxPrice);
				$("#gemweight").val('');
				$("#goodsize").val('');
				$("#toneType").attr("disabled", true);
				$("#goldType").attr("disabled", true);
				$("#calcNewPrice").attr("disabled", true);
				$("#toneColor").attr("disabled", true);
				$("#toneNeatness").attr("disabled", true);
				$("#technics").attr("disabled", true);
				$("#ifNeedLessTone").attr("disabled", true);

				$("#retailPrice").attr("readOnly", true);
				$("#gemweight").attr("readOnly", true);
				$("#getMatnrInfo").attr("readOnly", true);
				$("#goodsize").attr("readOnly", true);
			} else {
				isHavePrice = false;
				$("#retailPrice").val('');
				$("#toneType").attr("disabled", false);
				$("#goldType").attr("disabled", false);
				$("#calcNewPrice").attr("disabled", false);
				$("#toneColor").attr("disabled", false);
				$("#toneNeatness").attr("disabled", false);
				$("#technics").attr("disabled", false);
				$("#ifNeedLessTone").attr("disabled", false);

				$("#retailPrice").attr("readOnly", false);
				$("#gemweight").attr("readOnly", false);
				$("#getMatnrInfo").attr("readOnly", false);
				$("#goodsize").attr("readOnly", false);
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
		}

		// if($("#matnrinput").css("display") != 'none'){
		// $("#matnrselect").empty();
		// $("#matnrselect").append($("<option>"+charginfo.matnr+"</option>"));
		// $("#matnrselect").show();
		// $("#matnrinput").css("display","none");
		// }

	}

	function getYshckBymatnr(matnr, kondm, slbm, slxz, slys, zsjd, zgy, extwg) {
		if (orderType == 1) {

		} else if (orderType == 2 || orderType == 3) {
			if (matnr == "" && matnr == null) {
				jAlert("请输入物料号", "提示", function(e) {
				});
				return;
			}

			$.ajax({
				url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getYshckBymatnr&postType=1",
				dataType : 'json',
				type : 'post',
				data : "&matnr=" + matnr + "&toneType=" + slbm + "&kondm=" + kondm + "&toneColor=" + slys + "&toneNeatness=" + zsjd + "&technics="
						+ zgy + "&extwg=" + extwg,
				success : function(data) {
					var oldTonePrice = data.oldTonePrice;
					var technicsPrice = data.technicsPrice;
					var oldMarketPrice = data.retailPrice;
					var oldYbzjbPrice = data.oldYbzjbPrice;
					var costPrice = data.costPrice;
					$("#oldRetailPrice").val(oldMarketPrice);
					$("#oldYbzjbPrice").val(oldYbzjbPrice);
					$("#costPrice").val(costPrice);
					$("#oldCostPrice").val(costPrice);
					$("#oldTonePrice").val(oldTonePrice);
					$("#oldTechnicsPrice").val(technicsPrice);
					// $("#retailPrice").val(oldMarketPrice);
					// $("#retailPrice").attr("readonly", true);
					$("#kbetr").val(data.kbetr);// 商品定价组
				}
			});
		}

	}

	if (opmode == 'view' || opmode == 'edit')
		creatTablehead(choiceOrderId);

	// 设置订单头信息
	function creatTablehead(choiceorderid) {
		$.ajaxSetup({
			error : function(x, e) {
				jAlert("访问服务器错误信息:" + x.responseText, "提示", function(e) {
				});
				return false;
			}
		});
		$.getJSON("longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getChoiceOrderHeaderInfo&postType=1", {
			choiceorderid : choiceorderid,
			random : Math.random()
		}, function(data) {
			// alert(data.saporderid);
			// alert(data.type);
			historyWerks = data.werks;
			$("#type").val(data.type);
			$("#choiceorderid").val(data.choiceorderid);
			$("#saporderid").val(data.saporderid);
			$("#totalnumber").text(data.quantity);
			$("#totalgoldweight").text(data.totalgoldweight);
			$("#totalsubtotal").text(data.totalmoney);
			$("#choiceorderid").attr("readonly", true);
			$("#saporderid").attr("disabled", true);
			$("#remark2").attr("readonly", true);
			$("#remark2").val(data.remark);
			$("#contract").val(data.telephone);
			$("#oldtotalmoneySpan").show();
			$("#oldtotalmoney").text(data.oldtotalmoney);
			$("#oldquantity").text(data.quantity);
			$("#headermark").val(data.remark);
			// alert(data.remark);
			$("#type").attr("disabled", true);
			if (data.custommade == 'X') {
				$('#custommade').attr('checked', 'checked');
				$("#urgentSpan").show();
				$("#vipInfoSpan").show();
				$("#vipid").val(data.vipid);
				$("#urgent").val(data.urgent);
			}

			// alert(data.custommade);
			// $("#charg").attr("disabled", true);
			// $("#matnr").attr("disabled", true);
			// $("#goodsize").attr("disabled", true);
			// $("#goodTotalWeight").attr("disabled", true);
			// $("#zhlhx").attr("disabled", true);
			// $("#number").attr("disabled", true);
			// $("#retailPrice").attr("disabled", true);
			// $("#remark").attr("disabled", true);
			// $("#submit").attr("disabled", true);
			changeType();
			if (data == "") {
				jAlert("选款下单信息不存在!", "提示", function(e) {
				});
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
				// $("#charg").focus();

			} else {
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
				// $("#kunnr").removeClass("inputkey").addClass("inputnom");
				// $("#charg").addClass("inputkey");
				// $("#charg").focus();
			}
			creatTableRow(choiceorderid);
		});
	}

	// 修改的时候创建ROW
	function creatTableRow(salesorderid) {
		$.getJSON("longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getChoiceOrderItem&postType=1", {
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

				var posnrnumber = "<div  id=posnrnumber" + val.choiceorderitem + "> " + upnumber + " </div>" + "<div id=upnumber" + chargtype
						+ rownum + " style='display:none'>" + upnumber + "</div>" + toplevelstr + "";
				var upumber = "<div id=upnumberlevel" + rownum + ">" + upnumbertext + "</div>";

				var _tempcharg = val.batchnumber == null ? "" : val.batchnumber;
				var _tempmatnr = val.materialnumber;

				var charg = "<div id=charg" + rownum + ">" + _tempcharg.toUpperCase() + "&nbsp;</div>"; // 批次
				var matnr = "<div id=matnr" + rownum + ">" + _tempmatnr.toUpperCase() + "&nbsp;</div>"; // 物料

				var zhlhx = "<div id=zhlhx" + rownum + " >" + val.materialdesc + "&nbsp; </div>"; // 商品ID
				var number = "<div id=number" + rownum + ">" + Number(val.quantity) + "</div>"; // 数量
				var ifinlay = val.ifinlay;
				var ifinlayDiv = "<div id=ifinlay" + rownum + " style='display:none'>" + ifinlay + "</div><div id='ifinlayShow" + rownum + "'>"
						+ (ifinlay == "X" ? "是" : "否") + "</div>"; // 是否需要镶嵌

				var toneTypeShow = val.tonetype != null ? (val.tonetype
						.substring((val.tonetype.indexOf('|-|') != -1 ? val.tonetype.indexOf('|-|') + 3 : 0))) : " ";
				// if (orderType == 3)
				// var toneType = "<div id=toneType" + rownum + "
				// style='display:none'>" + (val.tonetype) + "</div><div
				// id='toneTypeShow"+rownum+"'>"
				// + toneTypeShow + "</div>"; // 石料
				// else
				var toneType = "<div id=toneType" + rownum + " style='display:none'>" + (val.tonetype) + "</div><div id='toneTypeShow" + rownum
						+ "'>" + toneTypeShow + "</div>"; // 石料

				var toneWeight = Number(val.toneweight);
				var toneWeightDiv = "<div id=toneWeight" + rownum + ">" + toneWeight + "</div>"; // 主石重

				// // 总重
				// var goodTotalWeight = "<div id=goodTotalWeight" + rownum +
				// ">" + Number(val.goodtotalweight) + "</div>";

				// 石料颜色
				var toneColorShow = val.tonecolor != null ? (val.tonecolor.substring(val.tonecolor.indexOf('|-|') != -1 ? val.tonecolor
						.indexOf('|-|') + 3 : 0)) : "&nbsp;";
				var toneColor = "<div id=toneColor" + rownum + " style='display:none'>" + (val.tonecolor) + "</div><div id='toneColorShow" + rownum
						+ "' >" + toneColorShow + "</div>";

				// 石料净度
				var toneNeatnessShow = val.toneneatness != null ? (val.toneneatness
						.substring((val.toneneatness.indexOf('|-|') != -1 ? val.toneneatness.indexOf('|-|') + 3 : 0))) : "&nbsp;";
				var toneNeatness = "<div id=toneNeatness" + rownum + " style='display:none'>" + (val.toneneatness)
						+ "</div><div id='toneNeatnessShow" + rownum + "'>" + toneNeatnessShow + "</div>";

				// 石料形状$("#toneshapeth").css("display", "none");
				var toneshapeShow = val.toneshape != null ? (val.toneshape.substring((val.toneshape.indexOf('|-|') != -1 ? val.toneshape
						.indexOf('|-|') + 3 : 0))) : "&nbsp;";
				var toneshape = "<div id=toneshape" + rownum + " style='display:none'>" + (val.toneshape) + "</div><div id='toneshapeShow" + rownum
						+ "'>" + (toneshapeShow) + "</div>";

				// 金料
				var goldtypeShow = val.goldtype != null ? (val.goldtype
						.substring((val.goldtype.indexOf('|-|') != -1 ? val.goldtype.indexOf('|-|') + 3 : 0))) : "&nbsp;";
				var goldType = "<div id=goldType" + rownum + " style='display:none'>" + (val.goldtype) + "</div><div id='goldtypeShow" + rownum
						+ "'>" + (goldtypeShow) + "</div>";

				// 工艺
				var technicsShow = val.technics != null ? (val.technics
						.substring((val.technics.indexOf('|-|') != -1 ? val.technics.indexOf('|-|') + 3 : 0))) : "&nbsp;";
				var technics = "<div id=technics" + rownum + " style='display:none'>" + (val.technics) + "</div><div id='technicsShow" + rownum
						+ "'>" + (technicsShow) + "</div>";

				var goodsize = "<div id=goodsize" + rownum + ">" + val.goodsize + "</div>"; // 货品尺寸

				var retailPrice = "<div id=retailPrice" + rownum + ">" + val.retailprice + "&nbsp;</div>"; // 市场零售价参考
				// alert(val.retailprice);

				var remark = "<div id=remark" + rownum + ">" + val.remark + "&nbsp;</div>"; // 备注
				var littleTotal = val.littletotal;// 小计金额
				var littleTotalDiv = "<div id=littleTotal" + rownum + ">" + littleTotal + "</div>"; // 小计金额DIV

				var ifNeedLessTone = val.ifneedlesstone;
				var ifNeedLessToneDiv = "<div id=ifNeedLessTone" + rownum + " style='display:none'>" + ifNeedLessTone
						+ "</div><div id='ifNeedLessToneShow" + rownum + "'>" + (ifNeedLessTone == "X" ? "是" : "否") + "</div>"; // 是否需要副石Div

				// 副石
				var lessToneTypeShow = val.lesstonetype != null ? (val.lesstonetype
						.substring((val.lesstonetype.indexOf('|-|') != -1 ? val.lesstonetype.indexOf('|-|') + 3 : 0))) : "&nbsp;";
				var lessToneTypeDiv = "<div id=lessToneType" + rownum + " style='display:none'>" + (val.lesstonetype != null ? val.lesstonetype : "")
						+ "</div><div id='lessToneTypeShow" + rownum + "'>" + (lessToneTypeShow) + "</div>";

				// 证书
				var certificateShow = val.certificate != null ? (val.certificate.substring((val.certificate.indexOf('|-|') != -1 ? val.certificate
						.indexOf('|-|') + 3 : 0))) : "&nbsp;";
				var certificateDiv = // "<div id=certificate" + rownum + "
				// style='display:none'>" +
				// ($("#certificate").get(0).selectedIndex != 0
				// ? $("#certificate").val():"") + "</div><div>"
				// + ($("#certificate").get(0).selectedIndex !=
				// 0 ?
				// $("#certificate").find("option:selected").text():"")
				// + "</div>";
				"<div id=certificate" + rownum + " style='display:none'>" + (val.certificate) + "</div><div id='certificateShow" + rownum + "'>"
						+ (certificateShow) + "</div>";

				// 火彩颜色
				var toneFireColorShow = val.tonefirecolor != null ? (val.tonefirecolor
						.substring((val.tonefirecolor.indexOf('|-|') != -1 ? val.tonefirecolor.indexOf('|-|') + 3 : 0))) : "&nbsp;";

				var toneFireColor = "<div id=toneFireColor" + rownum + " style='display:none'>" + (val.tonefirecolor)
						+ "</div><div id='toneFireColorShow" + rownum + "'>" + (toneFireColorShow) + "</div>";
				// 主石规格
				var mainToneStyleShow = val.maintonestyle != null ? (val.maintonestyle
						.substring((val.maintonestyle.indexOf('|-|') != -1 ? val.maintonestyle.indexOf('|-|') + 3 : 0))) : "&nbsp;";

				var mainToneStyle = "<div id=mainToneStyle" + rownum + " style='display:none'>"
						+ (val.maintonestyle == null ? "" : val.maintonestyle) + "</div><div id='mainToneStyleShow" + rownum + "'>"
						+ (mainToneStyleShow) + "</div>";

				var goldweight = Number(val.goldweight).toFixed(3);
				var goldweightdiv = "<div id=goldweight" + rownum + " style='display:none;'>" + goldweight + "</div>"; // 金重

				var mygoldweight = val.mygoldweight;
				var mygoldweights = mygoldweight == null ? "" : mygoldweight.split('-');
				var mygoldweightdiv = "<div id=mygoldweight" + rownum + ">" + mygoldweight + "</div>"; // 金重1

				var mycount = Number(val.quantity);
				var goldweightlittleTotal = (Number(mygoldweights[0]) + Number(mygoldweights[1])) / 2 * mycount;
				var goldweightlittleTotaldiv = "<div id=goldweightlittleTotal" + rownum + ">" + goldweightlittleTotal + "</div>"; // 金重小计

				var imgpath = val.productpictureurl == null ? '' : val.productpictureurl;
				var imgalt = val.productpictureurl == null ? '' : val.productpictureurl;
				var imaghref = "<a href=" + imgpath + " class='tooltip' title=" + $("#zhlhx").val() + "(" + $("#ztjtj").val() + ")>";
				var pcimage = "<div id=pcimage" + rownum + ">" + imaghref + "<img id=pcimagesrc  alt='" + imgalt + "' src=sappic/" + imgpath
						+ " height='40' width='38' onerror='this.src=\"longhaul\/pos\/order\/images\/zjzb.gif\"'/></a></div>";

				var oldRetailPrice = "<div id=oldRetailPrice" + rownum + ">" + (val.oldretailprice == null ? 0 : val.oldretailprice) + "</div>"; // 旧市场价
				var oldYbzjbPrice = "<div id=oldYbzjbPrice" + rownum + ">" + (val.oldybzjbprice == null ? 0 : val.oldybzjbprice) + "</div>"; // 旧的
				var oldTonePrice = "<div id=oldTonePrice" + rownum + ">" + (val.oldtoneprice == null ? 0 : val.oldtoneprice) + "</div>"; // 旧石头价
				var oldTechnicsPrice = "<div id=oldTechnicsPrice" + rownum + ">" + (val.oldtechnicsprice == null ? 0 : val.oldtechnicsprice)
						+ "</div>"; // 旧工艺价
				var extwg = "<div id=extwg" + rownum + ">" + (val.extwg == null ? "" : val.extwg) + "</div>"; // 旧extwg
				var matkl = "<div id=matkl" + rownum + ">" + (val.matkl == null ? "" : val.matkl) + "</div>"; // 旧matkl
				var kbetr = "<div id=kbetr" + rownum + ">" + (val.kbetr == null ? 0 : val.kbetr) + "</div>"; // 旧kbetr
				var oldCostPrice = "<div id=oldCostPrice" + rownum + ">" + (val.oldCostPrice == null ? 0 : val.oldCostPrice) + "</div>"; // 旧市场价

				// 设置合计
				// $("#totalnumber").text((Number($("#totalnumber").text()) +
				// Number(_number)).toFixed(0)); // 总数量

				// if (orderType == 1)
				// $("#totalgoldweight").text((Number(Number($("#totalgoldweight").text())
				// + Number($("#goldweight").val()))).toFixed(3)); // 总金种

				// $("#totalsubtotal").text((Number(Number($("#totalsubtotal").text())
				// + littleTotal))); // 总价格

				// if (orderType == 2)
				// $("#totaltoneweight").text((Number(Number($("#totaltoneweight").text())
				// + toneWeight))); // 总石重

				// if (chargtype == "charg" || _ordertype == 'ZRE2') {
				// $("#total").text((Number($("#total").text()) +
				// _total).toFixed(2));
				// //
				// $("#totalztjtj")
				// .text((Number($("#totalztjtj").text()) + Number(_ztjtj))
				// .toFixed(2)); //
				// $("#totalrealprice")
				// .text((Number($("#totalrealprice").text()) + _realprice)
				// .toFixed(2)); // 实际销售合计
				// }

				$("#goldvalue").removeClass("inputattention");
				$("#personcost").removeClass("inputattention");
				$("#charg").addClass("inputkey");
				$("#realprice").removeClass("inputkey");
				// $("#charg").focus();

				// 将输入设置为空
				// clearcharginfo();
				var row = "<tr><td class=" + style + ">" + row + "</td>";
				row = row + "<td class=" + style + ">" + posnrnumber + "</td>";
				row = row + "<td class=" + style + "  style='display:none'>" + upumber + "</td>";
				row = row + "<td class=" + style + ">" + charg + "</td>";
				row = row + "<td class=" + style + ">" + matnr + "</td>";
				row = row + "<td class=" + style + ">" + zhlhx + "</td>";
				row = row + "<td class=" + style + " align='center'>" + pcimage + "</td>";
				row = row + "<td class=" + style + " align='right'>" + number + "</td>";
				if (orderType == 3)
					row = row + "<td class=" + style + " align='right'>" + ifinlayDiv + "</td>";

				if (orderType == 2 || orderType == 3)
					row = row + "<td class=" + style + " align='right'>" + toneType + "</td>";

				if (currType == "X1")
					row = row + "<td class=" + style + " align='right'>" + toneWeightDiv + "</td>";

				if ((currType == "X1" || orderType == 3))
					row = row + "<td class=" + style + " align='right'>" + toneColor + "</td>";

				if (orderType == 3)
					row = row + "<td class=" + style + " align='right'>" + toneshape + "</td>";

				// if (currType == "X2" || currType == "X3") {
				// row = row + "<td class=" + style + " align='right'>" +
				// mainToneStyle + "</td>";
				// }

				if (orderType == 2 && currType != "X2" && currType != "X3" && currType != "X4")
					row = row + "<td class=" + style + " align='right'>" + toneNeatness + "</td>";

				if (orderType == 1 || orderType == 2 || ifinlay == "X")
					row = row + "<td class=" + style + " align='right'>" + goldType + "</td>";

				else if (orderType == 3 && ifinlay == "") {
					row = row + "<td class=" + style + " align='right'>" + goldType + "</td>";
				}
				if (orderType == 1 && currType != "J3" && currType != "X2" && currType != "X3") {
					row = row + "<td class=" + style + " align='right'>" + goldweightdiv + mygoldweightdiv + "</td>";
					row = row + "<td class=" + style + " align='right'>" + goldweightlittleTotaldiv + "</td>";
				}
				if (orderType == 1 || orderType == 2)
					row = row + "<td class=" + style + ">" + technics + "</td>";

				row = row + "<td class=" + style + " align='right'>" + goodsize + "</td>";

				// if (orderType != 1 || $("#type").val() == "J3")
				row = row + "<td class=" + style + " align='right'>" + retailPrice + "</td>";

				// if (orderType != 1 || $("#type").val() == "J3")
				row = row + "<td class=" + style + " align='right'>" + littleTotalDiv + "</td>";

				if (orderType == 2) {
					row = row + "<td class=" + style + " align='right'>" + ifNeedLessToneDiv + "</td>";
					// if(ifNeedLessTone == "X" ||
					// $("#lessToneTypeth").attr("display")
					// != 'none'){
					row = row + "<td class=" + style + " align='right'>" + lessToneTypeDiv + "</td>";
					// }
					// else{
					// row = row + "<td class=" + style + " align='right'
					// style='display:none' id='lessToneTypehide'"+rownum+">" +
					// lessToneTypeDiv + "</td>";
					// }
				}

				if (currType == "X5" || orderType == 3) {
					row = row + "<td class=" + style + " align='right'>" + toneFireColor + "</td>";
				}

				if ($("#type").val() == "X1") {
					row = row + "<td class=" + style + ">" + certificateDiv + "</td>";
				}

				// if (orderType == 2)
				// row = row + "<td class=" + style + " align='right'>" +
				// goodTotalWeight + "</td>"; // 总重

				row = row + "<td class=" + style + " align='right'>" + remark + "</td>"; // 备注

				row = row + "<td class=" + style + "  style='display:none'>" + oldRetailPrice + "</td>";
				row = row + "<td class=" + style + "  style='display:none'>" + oldYbzjbPrice + "</td>";
				row = row + "<td class=" + style + "  style='display:none'>" + oldTonePrice + "</td>";
				row = row + "<td class=" + style + "  style='display:none'>" + oldTechnicsPrice + "</td>";
				row = row + "<td class=" + style + "  style='display:none'>" + extwg + "</td>";
				row = row + "<td class=" + style + "  style='display:none'>" + matkl + "</td>";
				row = row + "<td class=" + style + "  style='display:none'>" + kbetr + "</td>";
				row = row + "<td class=" + style + "  style='display:none'>" + oldCostPrice + "</td>";

				row = row + "</tr>";

				// // $("#ordertype").append($("<option
				// // value="+val.pzdm+"
				// // "+selected+">"+val.pzmc+"("+val.pzdm+")</option>"));
				// var style = "";
				// _chargtype = val.upchoiceorderitem == "00" ? "charg" :
				// "gift";
				// _ordertype = $("#ordertype").val(); // 订单类型字段
				// style = val.upchoiceorderitem == "00" && (_ordertype !=
				// "ZRE2" && _ordertype != "ZKL") ? "tdtoplevel" :
				// "tdgiftlevel";
				// var delimage = "<img alt='删除'
				// src='resource/image/ext/delete.png' id='delrow'
				// align='middle' style='cursor:hand;'>";
				// var row = "<div id=" + key + ">" + delimage + "</div>";
				// //ordertItemype = "<div id=ordertItemype" + key + "
				// style='display:none'>" + val.orderitemtype + "</div>";
				// storagelocation = val.storagelocation == null ? "" :
				// val.storagelocation;
				// _logrt = "<div id=logrt" + key + ">" + storagelocation +
				// "</div>";
				// delimage = "<img alt='删除' src='resource/image/ext/delete.png'
				// id='delrow' align='middle' style='cursor:hand;'>";
				// // row="<div id="+key+">"+delimage+"</div>";
				// lowerlevel = val.upchoiceorderitem == null ? "" :
				// val.upchoiceorderitem;
				// if (val.upchoiceorderitem != null) { // 最大号
				// toplevelnumber = Number(val.choiceorderitem) / 10 + 1;
				// // toplevelnumber =toplevelnumber+1;
				// }
				// toplevelstr = "<div id=leveladdgifts" + val.choiceorderitem +
				// " style='display:none'>" + lowerlevel + "</div>";
				// posnrnumber = "<div id=posnrnumber" + key + "> " +
				// val.choiceorderitem + " </div>" + "<div id=upnumber" +
				// _chargtype + key + " style='display:none'>" +
				// val.salesorderitem + "</div>" + toplevelstr + "";
				// upumber = "<div id=upnumberlevel" + key + ">" +
				// val.upchoiceorderitem + "</div>";
				// batchnumber = val.batchnumber == null ? "" : val.batchnumber;
				// _charg = "<div id=charg" + key + ">" + batchnumber +
				// "&nbsp;</div>"; // 批次
				// var materialnumber = val.materialnumber == null ||
				// val.materialnumber == "null" ? "" : val.materialnumber;
				// _matnr = "<div id=matnr" + key + ">" + materialnumber +
				// "&nbsp; </div>"; // 物料
				// var goodname = val.materialdesc == null || val.materialdesc
				// == "null" ? "" : val.materialdesc;
				// _zhlhx = "<div id=zhlhx" + key + " class='divmatnrdesc'>" +
				// goodname + "</div>"; // 商品ID
				// _uniteprice = "<div id=uniteprice" + key + ">" +
				// Number(val.tagprice).toFixed(2) + "&nbsp;</div>"; // 单价
				// _number = "<div id=number" + key + ">" + val.salesquantity +
				// "</div>"; // 数量
				// _personcost = "<div id=personcost" + key + ">" +
				// Number(val.goodsprocessingfee).toFixed(2) + "</div>"; // 人工费用
				// _goldweight = "<div id=goldweight" + key + ">" +
				// Number(val.goldweight).toFixed(3) + "</div>"; // 金种
				// _goldvalue = "<div id=goldvalue" + key + "
				// style='display:none'>" + val.goldprice + "</div>"; // 金种
				// _receivable = "<div id=receivable" + key + " >" +
				// Number(val.totalamount).toFixed(2) + "</div>"; // 合计
				//
				// _ztjtj = "<div id=ztjtj" + key + " >" +
				// (Number(val.goodsprocessingfee) == 0 && val.salesorderitem %
				// 10 == 0 && _ordertype != 'ZKL' ?
				// Number(val.tagprice).toFixed(2) : '0.00') + "</div>"; // 标签价格
				// _realTagPrice = "<div id=realTagPrice" + key + " >" +
				// Number(val.tagprice).toFixed(2) + "</div>"; // 实际标签价格
				//
				// _realprice = "<div id=realprice" + key + ">" +
				// Number(val.netprice).toFixed(2) + "</div>"; // 实销价格
				// var discount = val.storediscount == null || val.storediscount
				// == "null" ? "" : val.storediscount;
				// _discount = "<div id=discount" + key + ">" + discount +
				// "</div>"; // 折扣
				// _productpictureurl = val.productpictureurl == null ||
				// val.productpictureurl == "" ? (compImage = "CHJ" ?
				// "CHJ-LOGO.JPG" : "vt.jpg") : val.productpictureurl;
				// var imgpath = chargimgpath + _productpictureurl;
				// imaghref = "<a href=" + imgpath + " class='tooltip'>";
				// _pcimage = "<div id=pcimage" + key + ">" + imaghref + "<img
				// id=pcimagesrc src=" + imgpath + " height='40' width='38'
				// alt='" + _productpictureurl + "'/></a></div>";
				//
				// $("#pcimage").attr("src", imgpath);
				// $("#pcimage").attr("alt", val.productpictureurl);
				// setTotalObjectByName('totalprice', val.tagprice, 2);
				// setTotalObjectByName('totalnumber', val.salesquantity, 0);
				// setTotalObjectByName('toalpersoncost',
				// val.goodsprocessingfee, 2);
				// setTotalObjectByName('totalgoldweight', val.goldweight, 3);
				// setTotalObjectByName('total', val.totalamount, 2);
				// setTotalObjectByName('totalztjtj', val.tagprice, 2);
				// setTotalObjectByName('totalrealprice', val.netprice, 2);
				// var row = "<tr><td class=" + style + ">" + row + "</td>";
				// if (opmode == "view") {
				// row = "<tr><td class=" + style + "></td>";
				// }
				// row = row + "<td class=" + style + ">" + posnrnumber +
				// "</td>";
				// row = row + "<td class=" + style + " style='display:none'>" +
				// upumber + "</td>";
				// row = row + "<td class=" + style + ">" + _charg + "</td>";
				// row = row + "<td class=" + style + ">" + _matnr + "</td>";
				// row = row + "<td class=" + style + ">" + _zhlhx + "</td>";
				// row = row + "<td class=" + style + " align='center'>" +
				// _pcimage + "</td>";
				// row = row + "<td class=" + style + " style='display:none'
				// align='right'>" + _uniteprice + "</td>";
				// row = row + "<td class=" + style + " align='right'>" +
				// _number + "</td>";
				// goodtdshow = val.goldprice == 0 ? "display:none" : "";
				// if (val.goldprice != 0) {
				// goldtextdisplay();
				// }
				// goodtdshow = $("#thpersoncost").css("display") == "none" ?
				// "display:none" : "";
				// row = row + "<td class=" + style + " id='personcosttd" + key
				// + "' align='right' style='" + goodtdshow + "'>" + _personcost
				// + "</td>";
				// row = row + "<td class=" + style + " id='goldtr" + key + "'
				// align='right'style='" + goodtdshow + "'>" + _goldweight +
				// _goldvalue + "</td>";
				// row = row + "<td class=" + style + " style='display:none'
				// align='right'>" + _receivable + "</td>";
				// row = row + "<td class=" + style + " align='right'>" + _ztjtj
				// + "</td>";
				// row = row + "<td style='display:none' class=" + style + "
				// align='right'>" + _realTagPrice + "</td>";
				// row = row + "<td class=" + style + " align='right'>" +
				// _realprice + "</td>";
				// row = row + "<td class=" + style + ">" + _discount + "</td>";
				// ordertItemypeshow = ordertItemypeshowText(val.orderitemtype);
				// row = row + "<td class=" + style + ">" + ordertItemype + "" +
				// ordertItemypeshow + "</td>";
				// row = row + "<td class=" + style + ">" + _logrt + "</td>";
				// row = row + "</tr>";
				// if (_ordertype == "ZRE2" || _ordertype == "ZKL") {
				// $("input[type=radio][name=chargtype][value=gift]").attr("checked",
				// "checked");
				// $("#matnr").hide();
				// $("#charglabel").html("赠品料号: ");
				// $("#matnrlabel").hide();
				// upgiftnumber = Number(val.salesorderitem) / 10 + 1;
				// }
				$(row).insertAfter($("#tablecontent tr:eq(" + 0 + ")"));
				// toplevelnumber=Number(key)+1; //设置最上层记录增加
			});
		});
	}

	function checkNum(obj) {
		var objvalue = obj.value.replace(/(^\s*)|(\s*$)/g, "");
		// obj.value = objvalue;
		if (objvalue == "" || objvalue == null) {
			return true;
		} else if (isNaN(objvalue)) {
			jAlert("非法字符，请输入数字", "提示", function(e) {
				obj.value = "";
			});
			return false;
		} else {
			return true;
		}
	}

	$("div[id^='number']").live('click', function() {
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
					// changerealprice(thistr, thisvalue, oldtext);
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

	$("div[id^='toneWeight']").live('click', function() {
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
					// changerealprice(thistr, thisvalue, oldtext);
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

	$("div[id^='goodsize']").live('click', function() {
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
				divedit.html($(this).val()); // 设置新值
				// getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
				thisvalue = $(this).val();
				divedit.html($(this).val());
				// getNewPriceInTable(thistr);
			} else {
				divedit.html(oldtext);
			}
		});

	});
	$("div[id^='retailPrice']").live('click', function() {
		if (opmode == 'view')
			return;
		var currType = $("#type").val();

		if (currType == "J1" || currType == "J2" || currType == "J4" || currType == "X1")
			return;

		var thistd = $(this).parents("td:first");

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
		var littleTotal = thistr.find("div[id^='littleTotal']");
		var number = thistr.find("div[id^='number']").text();

		inputIns.keyup(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).val().indexOf("-") != -1) {
					divedit.html($(this).val()); // 设置新值

					var values = $(this).val().split("-");

					var littleTotalValue = Number(values[0]) * Number(number) + "-" + Number(values[1]) * Number(number);
					littleTotal.html(littleTotalValue);

					getNewPriceInTable(thistr);
				} else {
					jAlert("请输入正确的区间！", "提示", function(e) {
						inputIns.focus();
					});
				}
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).val().indexOf("-") != -1) {
				if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
					thisvalue = Number($(this).val());
					oldtext = Number(oldtext);
					// changerealprice(thistr, thisvalue, oldtext);
					divedit.html($(this).val());

					var values = $(this).val().split("-");

					var littleTotalValue = Number(values[0]) * Number(number.val()) + "-" + Number(values[1]) * Number(number.val())
					littleTotal.html(littleTotalValue);

					getNewPriceInTable(thistr);
				} else {
					divedit.html(oldtext);
				}
			} else {
				jAlert("请输入正确的区间！", "提示", function(e) {
					inputIns.focus();
				});
			}

		});

	});

	$("div[id^='goodTotalWeight']").live('click', function() {
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
					// changerealprice(thistr, thisvalue, oldtext);
					divedit.html(Number($(this).val()).toFixed(2));
				} else {
					divedit.html(oldtext);
				}
			} else {
				$(this).focus();
			}

		});

	});

	$("div[id^='mygoldweight']").live('click', function() {
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
				if ($(this).val().indexOf('-') == -1) {
					alert("请输入金重区间！");
					return;
				} else {
					var values = $(this).val().split('-');
					if (Number(values[0]) > Number(values[1])) {
						alert("区间前值不能大于后值！");
						return;
					}
				}
				divedit.html($(this).val()); // 设置新值
				getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).val().indexOf('-') == -1) {
					alert("请输入金重区间！");
					return;
				} else {
					var values = $(this).val().split('-');
					if (Number(values[0]) > Number(values[1])) {
						alert("区间前值不能大于后值！");
						return;
					}
				}
				thisvalue = Number($(this).val());
				oldtext = Number(oldtext);
				// changerealprice(thistr, thisvalue, oldtext);
				divedit.html($(this).val());
				getNewPriceInTable(thistr);
			} else {
				divedit.html(oldtext);
			}

		});

	});

	$("div[id^='remark']").live('click', function() {
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
				if ((checkType()) && $(this).val() == '') {
					alert("必须输入备注信息！");
					$("#this").focus();
					return;
				} else {
					divedit.html($(this).val() + "&nbsp;"); // 设置新值
				}
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).val() != oldtext && confirm('是否保存修改值!')) {

				if ((checkType()) && $(this).val() == '') {
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

	$("div[id^='matnr']").live('click', function() {
		return;
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
	$("div[id^='charg']").live('click', function() {
		return;
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

	// $("div[id^='remark']").live('click',function(){
	// var thistd = $(this).parents("td:first");
	//		
	//
	// if (opmode == 'view')
	// return;
	//
	// var divedit = $(this);
	// // var divid = divedit.attr('id')
	// // _order = divid.substring(divid.indexOf("realprice") + 9,
	// // divid.length);
	// if (divedit.children("input").length > 0) {
	// return false;
	// }
	// var inputIns = $("<input type='text'/>"); // 创建input 输入框
	// var oldtext = $(this).html(); // 保存原有的值
	// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
	// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
	// divedit.html(""); // 删除原来单元格DIV内容
	// inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
	// inputIns.click(function() {
	// return false;
	// });
	// // 处理回车和ESC事件
	// var thistr = $(this).parents("tr:first");
	// inputIns.keyup(function(event) {
	// var keycode = event.which;
	// if (keycode == 13 && inputIns.unbind("blur")) {
	// divedit.html($(this).val()); // 设置新值
	// }
	// if (keycode == 27) {
	// divedit.html(oldtext); // 返回旧值
	// }
	// }).blur(function(event) {
	// value = $(this).val();
	// if ($(this).val() != oldtext && confirm('是否保存修改值!')) {
	// thisvalue = $(this).val();
	// oldtext = oldtext;
	// divedit.html($(this).val());
	// } else {
	// divedit.html(oldtext);
	// }
	//
	// });
	//
	//	
	// });

	$("div[id^='toneTypeShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		// var divid = divedit.attr('id')
		// _order = divid.substring(divid.indexOf("realprice") + 9,
		// divid.length);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns;
		if ($("#type").val() == "Y1")
			inputIns = $("#bowlderType").clone(true);
		else
			inputIns = $("#toneType").clone(true);

		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");

		var valueDiv = thistr.find("div[id^='toneType']");
		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));

		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					jAlert("请选择正确的选项！", "提示", function(e) {
					});
					$(this).focus();
					return;
				}
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
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
				if ($(this).get(0).selectedIndex == 0) {
					jAlert("请选择正确的选项！", "提示", function(e) {
					});
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
				getNewPriceInTable(thistr);
			} else {
				divedit.html(oldtext);
			}

		});

	});

	$("div[id^='toneColorShow']").live('click', function() {
		if (opmode == 'view' || $("#toneColor").find("option").length == 1)
			return;
		var divedit = $(this);
		// var divid = divedit.attr('id')
		// _order = divid.substring(divid.indexOf("realprice") + 9,
		// divid.length);
		if (divedit.children("input").length > 0) {
			return false;
		}
		if ($("#type").val() == "Y1")
			var inputIns = $("#toneColor2").clone(true);
		else
			var inputIns = $("#toneColor").clone(true);
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='toneColor']");
		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
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
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
				getNewPriceInTable(thistr);
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='toneNeatnessShow']").live('click', function() {
		if (opmode == 'view' || $("#toneNeatness").attr("disabled") == 'disabled')
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
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='toneNeatness']");
		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
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
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
				getNewPriceInTable(thistr);
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='goldtypeShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		// var divid = divedit.attr('id')
		// _order = divid.substring(divid.indexOf("realprice") + 9,
		// divid.length);
		if (divedit.children("input").length > 0) {
			return false;
		}
		
		var thistr = $(this).parents("tr:first");
		
		var ifinlay = $(thistr.find("div[id^='ifinlay']")[0]);
		if(ifinlay.text() == ''){
			return;
		}
		
		var inputIns = $("#goldType").clone(true);
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		
		
		var valueDiv = thistr.find("div[id^='goldType']");
		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));

		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='lessToneTypeShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#lessToneType").clone(true);
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='lessToneType']");
		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='toneFireColorShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#toneFireColor").clone(true);
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='toneFireColor']");
		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='toneshapeShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#toneshape").clone(true);
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='toneshape']");
		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='mainToneStyleShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("#mainToneStyle").clone(true);
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		inputIns.click(function() {
			return false;
		});
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='mainToneStyle']");
		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));
		inputIns.unbind('keydown').keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='ifNeedLessToneShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("<select><option value=''>请选择...</option><option value=''>否</option><option value='X'>是</option></select>");
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
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
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val();

				if (value == 'X') {
					var inputIns = $("#lessToneType").clone(true);
					thisLessToneShow.html("");
					inputIns.appendTo(thisLessToneShow);
					thisLessToneShow.focus();
					inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));
					inputIns.unbind('keydown').keydown(function(event) {
						var keycode = event.which;
						if (keycode == 13 && inputIns.unbind("blur")) {
							if ($(this).get(0).selectedIndex == 0) {
								alert("请选择正确的选项！");
								$(this).focus();
								return;
							}
							var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
							valueDiv.html(value); // 设置新值
							divedit.html($(this).find("option:selected").text()); // 设置新值
						}
						if (keycode == 27) {
							divedit.html(oldtext); // 返回旧值
						}
					}).blur(function(event) {
						value = $(this).val();
						if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
							if ($(this).get(0).selectedIndex == 0) {
								alert("请选择正确的选项！");
								$(this).focus();
								return;
							}
							thisvalue = $(this).val();
							oldtext = oldtext;
							var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
							valueDiv.html(value); // 设置新值
							divedit.html($(this).find("option:selected").text()); // 设置新值
						} else {
							divedit.html(oldtext);
						}

					});

				} else {
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
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='ifinlayShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		if (divedit.children("input").length > 0) {
			return false;
		}
		var inputIns = $("<select><option value=''>请选择...</option><option value=''>否</option><option value='X'>是</option></select>");
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
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
			//var keycode = event.which;
			if (event.keyCode == 13 && $(this).unbind("blur")) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				var value = $(this).val();

				if (value == 'X') {
					var inputIns2 = $("#goldType").clone(true);
					thisgoldTypeShow.html("");
					inputIns2.appendTo(thisgoldTypeShow);
					thisgoldTypeShow.focus();
					inputIns2.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')));
					inputIns2.unbind('keydown').keydown(function(event) {
						//var keycode = event.which;
						if (event.keyCode == 13 && inputIns2.unbind("blur")) {
							if ($(this).get(0).selectedIndex == 0) {
								alert("请选择正确的选项！");
								$(this).focus();
								return;
							}
							var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
							thisgoldType.html(value); // 设置新值
							thisgoldTypeShow.html($(this).find("option:selected").text()); // 设置新值
						}
						if (event.keyCode == 27) {
							divedit.html(oldtext); // 返回旧值
						}
					}).blur(function(event) {
						value = $(this).val();
						if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
							if ($(this).get(0).selectedIndex == 0) {
								alert("请选择正确的选项！");
								$(this).focus();
								return;
							}
							thisvalue = $(this).val();
							oldtext = oldtext;
							var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
							valueDiv.html(value); // 设置新值
							divedit.html($(this).find("option:selected").text()); // 设置新值
						} else {
							divedit.html(oldtext);
						}

					});

				} else {
					thisgoldType.html('');
					thisgoldTypeShow.html('&nbsp;');
				}

				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			}
			if (event.keyCode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='technicsShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		if (divedit.children("select").length > 0) {
			return false;
		}
		var inputIns = $("#technics").clone(true);
		inputIns.css("display", "");
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容

		// inputIns.empty();
		// $.ajax({
		// url :
		// 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getTechnicsTypeInfo&option=user&postType=1',
		// dataType : "json",
		// success : function(data) {
		// $.map(data, function(item) {
		// var flag = false;
		// var option = "<option value='" + item.atwrt + "' >" + item.atwtb +
		// "</option>";
		// inputIns.append(option);
		// })
		// //var noneselectedtext = "请选择...";
		// // inputIns.multiSelect({
		// // selectAll : false,
		// // noneSelected : noneselectedtext,
		// // oneOrMoreSelected : '*'
		// // }, function(el) {
		// // // $("#callbackResult").show().fadeOut();
		// // });
		//
		// }
		//
		// });

		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		// inputIns.click(function() {
		// return false;
		// });
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='technics']");

		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')).split(','));
		inputIns.unbind().keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {

				var text = "";
				for ( var i = 0; i < $(this).find("option:selected").size(); i++) {
					text = text + $($(this).find("option:selected")[i]).text() + ", ";
				}
				text = text.substring(0, text.length - 2);
				var value = $(this).val() + '|-|' + text;
				valueDiv.html(value); // 设置新值
				divedit.html(text); // 设置新值
				getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
				getNewPriceInTable(thistr);
			} else {
				divedit.html(oldtext);
			}

		});
	});

	$("div[id^='certificateShow']").live('click', function() {
		if (opmode == 'view')
			return;
		var divedit = $(this);
		if (divedit.children("select").length > 0) {
			return false;
		}
		var inputIns = $("#mycertificate").clone(true);
		inputIns.css("display", "");
		var oldtext = $(this).html(); // 保存原有的值
		// inputIns.width(divedit.width()); // 设置INPUT与DIV宽度一致
		// inputIns.val(divedit.html()); // 将本来单元格DIV内容copy到插入的文本框INPUT中
		divedit.html(""); // 删除原来单元格DIV内容
		inputIns.appendTo(divedit).focus().select(); // 将需要插入的输入框代码插入DOM节点中
		// inputIns.click(function() {
		// return false;
		// });
		// 处理回车和ESC事件
		var thistr = $(this).parents("tr:first");
		var valueDiv = thistr.find("div[id^='certificate']");

		// inputIns.empty();
		// $.ajax({
		// url :
		// 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getCertificate&option=user&postType=1',
		// dataType : "json",
		// success : function(data) {
		//				
		// $.map(data, function(item) {
		// var option = "<option value='" + item.zzslx + "'>" + item.tzslx +
		// "</option>";
		// inputIns.append(option);
		// });
		// //var noneselectedtext = "请选择...";
		// // inputIns.multiSelect({
		// // selectAll : false,
		// // noneSelected : noneselectedtext,
		// // oneOrMoreSelected : '*'
		// // }, function(el) {
		// // });
		// }
		// });

		inputIns.val(valueDiv.text().substring(0, valueDiv.text().indexOf('|-|')).split(','));
		inputIns.unbind().keydown(function(event) {
			var keycode = event.which;
			if (keycode == 13 && inputIns.unbind("blur")) {
				var text = "";
				for ( var i = 0; i < $(this).find("option:selected").size(); i++) {
					text = text + $($(this).find("option:selected")[i]).text() + ", ";
				}
				text = text.substring(0, text.length - 2);
				var value = $(this).val() + '|-|' + text;
				valueDiv.html(value); // 设置新值
				divedit.html(text); // 设置新值

				getNewPriceInTable(thistr);
			}
			if (keycode == 27) {
				divedit.html(oldtext); // 返回旧值
			}
		}).blur(function(event) {
			value = $(this).val();
			if ($(this).find("option:selected").text() != oldtext && confirm('是否保存修改值!')) {
				if ($(this).get(0).selectedIndex == 0) {
					alert("请选择正确的选项！");
					$(this).focus();
					return;
				}
				thisvalue = $(this).val();
				oldtext = oldtext;
				var value = $(this).val() + '|-|' + $(this).find("option:selected").text();
				valueDiv.html(value); // 设置新值
				divedit.html($(this).find("option:selected").text()); // 设置新值
				getNewPriceInTable(thistr);
			} else {
				divedit.html(oldtext);
			}

		});
	});

	// 改变实际销价格改变相应该合计
	function changerealprice(thistr, thisvalue, oldtext) {
		$("#totalrealprice").text((Number($("#totalrealprice").text()) + (thisvalue - oldtext)).toFixed(2));
		$("#total").text((Number($("#total").text()) + (thisvalue - oldtext)).toFixed(2));
		receivableobj = $(thistr).find("div[id^='receivable']");
		receivableobj.text(Number(thisvalue).toFixed(2));
	}

	function getNewPriceInTable(currentTr) {
		if (orderType == 1) {
			choiceType = $("#type").val();
			if (choiceType == 'J1' || choiceType == 'J2' || choiceType == 'J4') {
				var goldType = $($(currentTr).find("div[id^='goldType']")[0]).text();
				goldType = (goldType.indexOf("|-|") != -1) ? goldType.substring(0, goldType.indexOf("|-|")) : goldType;
				var goldWeight = Number($($(currentTr).find("div[id^='goldweight']")[0]).text());
				if (charg != "" || matnr != "") {
					$.ajax({
						url : 'longhaul/pos/order/orderSystem.ered?reqCode=getGoldPrices&postType=1',
						dataType : "json",
						type : "POST",
						data : "chargtype=" + goldType,
						success : function(data) {
							if (data == null || data == "") {
								jAlert("请注意,没有维护金价!", "提示", function(e) {
									var marketPrice = $(currentTr).find("div[id^='retailPrice']").text();
									var number = Number($(currentTr).find("div[id^='number']").text());
									var retailPrices = marketPrice.split('-');
									var littleTotal = (Number(number) * Number(retailPrices[0]!=null?retailPrices[0]:0)) + '-' + (Number(number) * Number(retailPrices[1]!=null?retailPrices[1]:0));// 小计金额
									$(currentTr).find("div[id^='littleTotal']").text(littleTotal);
									getTotal();
									getTotalGold();
								});
							} else {
								// var marketPrice =
								// Number(data[0].drjj)*goldWeight;
								// marketPrice =
								// parseInt(marketPrice*0.01)*100+"-" +
								// parseInt(marketPrice*0.01)*100;
								// $(currentTr).find("div[id^='retailPrice']").text(marketPrice);
								// var retailPrices = marketPrice.split('-');
								// var littleTotal = (Number(number) *
								// Number(retailPrices[0])) + '-' +
								// (Number(number) * Number(retailPrices[1]));//
								// 小计金额
								// $(currentTr).find("div[id^='littleTotal']").text(littleTotal);
								//								
								// var goldweightFrom =
								// Number($("#goldweightFrom").val());
								// var goldweightTo =
								// Number($("#goldweightTo").val());
								var number = Number($(currentTr).find("div[id^='number']").text());
								var drjj = Number(data[0].drjj);
								var goldWeights = $($(currentTr).find("div[id^='mygoldweight']")[0]).text().split("-");
								var goldweightlittleTotal = (((Number(goldWeights[0]) + Number(goldWeights[1])) / 2) * number).toFixed(2);
								var marketPrice = parseInt(Number(goldWeights[0]) * drjj * 0.01) * 100 + "-"
										+ parseInt(Number(goldWeights[1]) * drjj * 0.01) * 100;
								$(currentTr).find("div[id^='littleTotal']").text(marketPrice);
								$(currentTr).find("div[id^='goldweightlittleTotal']").text(goldweightlittleTotal);
								var littleTotal = parseInt(Number(number) * Number(goldWeights[0]) * drjj * 0.01) * 100 + '-'
										+ parseInt(Number(number) * Number(goldWeights[1]) * drjj * 0.01) * 100;// 小计金额
								$(currentTr).find("div[id^='littleTotal']").text(littleTotal);

								getTotal();
								getTotalGold();
							}
						}
					});
				} else {
					jAlert("请输入批次或者物料信息！", "提示", function(e) {
						$("#charg").select();
					})
				}

			} else {
				getTotal();
				getTotalGold();
			}

		} else if (orderType == 2 && $("#type").val() != "X5" && $("#type").val() != "X2" && $("#type").val() != "X3") {
			var toneType = $($(currentTr).find("div[id^='toneType']")[0]).text();
			toneType = (toneType.indexOf("|-|") != -1) ? toneType.substring(0, toneType.indexOf("|-|")) : toneType;
			var charg = $.trim($($(currentTr).find("div[id^='charg']")[0]).text());
			var matnr = $.trim($($(currentTr).find("div[id^='matnr']")[0]).text());
			var gemweight = $(currentTr).find("div[id^='toneWeight']").text();
			var toneColor = $($(currentTr).find("div[id^='toneColor']")[0]).text();
			toneColor = (toneColor.indexOf("|-|") != -1) ? toneColor.substring(0, toneColor.indexOf("|-|")) : toneColor;
			var toneNeatness = $($(currentTr).find("div[id^='toneNeatness']")[0]).text();
			toneNeatness = (toneNeatness.indexOf("|-|") != -1) ? toneNeatness.substring(0, toneNeatness.indexOf("|-|")) : toneNeatness;
			var technics = $($(currentTr).find("div[id^='technics']")[0]).text().substring(
					0,
					(($($(currentTr).find("div[id^='technics']")[0]).text().indexOf('|-|') == -1) ? ($($(currentTr).find("div[id^='technics']")[0])
							.text().length) : ($($(currentTr).find("div[id^='technics']")[0]).text().indexOf('|-|'))));
			technics = (technics == null || technics == 'null')? '' : technics;
			var extwg = $(currentTr).find("div[id^='extwg']").text();
			var matkl = $(currentTr).find("div[id^='matkl']").text();
			var oldRetailPrice = Number($(currentTr).find("div[id^='oldRetailPrice']").text());
			var ifNeedLessTone = $(currentTr).find("div[id^='ifNeedLessTone']").text();
			var lessToneType = $(currentTr).find("div[id^='lessToneType']").text();
			lessToneType = (lessToneType.indexOf("|-|") != -1) ? lessToneType.substring(0, lessToneType.indexOf("|-|")) : lessToneType;
			var oldYbzjbPrice = Number($(currentTr).find("div[id^='oldYbzjbPrice']").text());
			var oldTonePrice = Number($(currentTr).find("div[id^='oldTonePrice']").text());
			var oldTechnicsPrice = Number($(currentTr).find("div[id^='oldTechnicsPrice']").text());
			var kbetr = $(currentTr).find("div[id^='kbetr']").text();
			var number = $(currentTr).find("div[id^='number']").text();
			var retailPrice = $(currentTr).find("div[id^='retailPrice']");
			oldRetailPrice = oldRetailPrice == 0 ? Number(retailPrice.text()) : oldRetailPrice;
			var littleTotal = $(currentTr).find("div[id^='littleTotal']");
			var oldLittleTotal = Number(littleTotal.text());
			var goldType = $(currentTr).find("div[id^='goldType']").text();
			goldType = (goldType.indexOf("|-|") != -1) ? goldType.substring(0, goldType.indexOf("|-|")) : goldType;
			if (charg != "" || matnr != "") {
				$.ajax({
					url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getNewMarketPrice&option=user&postType=1',
					dataType : "json",
					type : "POST",
					data : "&toneType=" + toneType + "&gemweight=" + gemweight + "&matnr=" + matnr + "&charg=" + charg + "&goldType=" + goldType
							+ "&lessToneType=" + $.trim(lessToneType) + "&toneColor=" + toneColor + "&toneNeatness=" + toneNeatness + "&toneCount="
							+ toneCount,
					// "&toneType=" + $("#toneType").val() + "&gemweight=" +
					// $("#gemweight").val() + "&toneColor=" +
					// $("#toneColor").val() + "&toneNeatness=" +
					// $("#toneNeatness").val() + "&technics="
					// + $("#technics").val() + "&extwg=" + $("#extwg").val() +
					// "&matkl=" + $("#matkl").val()+"&matnr=" + matnr+"&charg="
					// + charg,
					success : function(data) {
						var oldRetailPrice = Number($("#oldRetailPrice").val());
						var oldYbzjbPrice = Number($("#oldYbzjbPrice").val());
						var oldCostPrice = Number($("#oldCostPrice").val());
						var zhjxs = data.zhjxs;
						var oldTonePrice = Number($("#oldTonePrice").val());
						var oldTechnicsPrice = Number($("#oldTechnicsPrice").val());
						var newTonePrice = Number(data.newTonePrice);
						var technicsPrice = Number(data.technicsPrice);
						var kbetr = Number($("#kbetr").val());
						var newPrice = ((oldYbzjbPrice / zhjxs) - oldTonePrice - oldTechnicsPrice + newTonePrice + technicsPrice) * zhjxs * kbetr;

						var newCostPrice = oldCostPrice - oldTonePrice - oldTechnicsPrice + newTonePrice + technicsPrice;
						$("#costPrice").val(newCostPrice > 0 ? newCostPrice : 0);
						var msg = "";
						if (data.phxserror != '' && data.phxserror != null)
							msg += data.phxserror + "<br/>";
						if (data.hjxserror != '' && data.hjxserror != null)
							msg += data.hjxserror + "<br/>";
						if (data.dailyGoldPriceerror != '' && data.dailyGoldPriceerror != null)
							msg += data.dailyGoldPriceerror + "<br/>";
						if (data.goldSHerror != '' && data.goldSHerror != null)
							msg += data.goldSHerror + "<br/>";
						if (data.goldGFerror != '' && data.goldGFerror != null)
							msg += data.goldGFerror + "<br/>";
						if (data.goldWeighterror != '' && data.goldWeighterror != null)
							msg += data.goldWeighterror + "<br/>";
						if (data.lessToneCounterror != '' && data.lessToneCounterror != null)
							msg += data.lessToneCounterror + "<br/>";
						if (data.totalLessToneWeighterror != '' && data.totalLessToneWeighterror != null)
							msg += data.totalLessToneWeighterror + "<br/>";
						if (data.lessTonePriceerror != '' && data.lessTonePriceerror != null)
							msg += data.lessTonePriceerror + "<br/>";
						if (data.lessToneError != '' && data.lessToneError != null)
							msg += data.lessToneError + "<br/>";
						if (data.tonePriceError != '' && data.tonePriceError != null)
							msg += data.tonePriceError + "<br/>";

						if (msg != '') {
							jAlert(msg, "提示", function(e) {
								var marketPrice = $(currentTr).find("div[id^='retailPrice']").text();
								var number = Number($(currentTr).find("div[id^='number']").text());
								var retailPrices = marketPrice.split('-');
								var littleTotal = (Number(number) * Number(retailPrices[0])) + '-' + (Number(number) * Number(retailPrices[1]));// 小计金额
								$(currentTr).find("div[id^='littleTotal']").text(littleTotal);
								getTotal();
							});
						} else {
							if (data.newMarketPrice > 0) {
								var marketPrice = Number(data.newMarketPrice);
								marketPrice = parseInt(marketPrice * 0.0095) * 100 + "-" + parseInt(marketPrice * 0.011) * 100;
								$(currentTr).find("div[id^='retailPrice']").text(marketPrice);
								var number = Number($(currentTr).find("div[id^='number']").text());
								var retailPrices = marketPrice.split('-');
								var littleTotal = (Number(number) * Number(retailPrices[0])) + '-' + (Number(number) * Number(retailPrices[1]));// 小计金额
								$(currentTr).find("div[id^='littleTotal']").text(littleTotal);
								getTotal();
							}
						}
					}
				});
			}
		} else if (orderType == 3 || $("#type").val() == "X5" || $("#type").val() == "X2" || $("#type").val() == "X3") {
			// $("#retailPrice").val(0);
			// $("#retailPrice").attr("readonly", false);
			var retailPrices = $($(currentTr).find("div[id^='retailPrice']")[0]).text().split("-");
			var number = Number($(currentTr).find("div[id^='number']").text());
			var littleTotal = $(currentTr).find("div[id^='littleTotal']");
			var littleTotalValue = number * Number(retailPrices[0]) + "-" + number * Number(retailPrices[1]);
			littleTotal.text(littleTotalValue);
			getTotal();
		}
	}

	function getTotal() {
		var tableList = $("#tablecontent");

		var totalsubtotal = $("#totalsubtotal");
		var totalnumber = $("#totalnumber");

		var numbers = tableList.find("div[id^=number]");
		var littleTotal = tableList.find("div[id^=littleTotal]");

		var littleTotal0 = 0;
		var littleTotal1 = 0;

		var totalLittleTotal = '';
		var totalNumber = 0;
		for ( var i = 0; i < numbers.size(); i++) {
			totalNumber = totalNumber + Number($(numbers[i]).text());
			littleTotals = $(littleTotal[i]).text().split('-');
			littleTotal0 = littleTotal0 + Number(littleTotals[0]);
			littleTotal1 = littleTotal1 + Number(littleTotals[1]);
			// alert(littleTotals[0]);
			// alert(littleTotals[1]);
			// alert(littleTotal0);
			// alert(littleTotal1);
		}
		totalLittleTotal = littleTotal0 + "-" + littleTotal1;
		totalnumber.text(totalNumber);
		totalsubtotal.text(totalLittleTotal);
	}

	function getTotalGold() {
		var tableList = $("#tablecontent");

		var totalnumber = $("#totalnumber");
		var totalgoldweight = $("#totalgoldweight");

		var numbers = tableList.find("div[id^=number]");
		var mygoldweights = tableList.find("div[id^=mygoldweight]");

		var goldweight = tableList.find("div[id^=goldweightlittleTotal]");

		var totalNumber = 0;
		var totalGoldweight = 0;
		for ( var i = 0; i < numbers.size(); i++) {
			var mygoldweight = $(mygoldweights[i]).text().split('-');
			$(goldweight[i]).text(((Number(mygoldweight[0]) + Number(mygoldweight[1])) / 2 * Number($(numbers[i]).text())).toFixed(2));
			totalNumber = totalNumber + Number($(numbers[i]).text());
			totalGoldweight = totalGoldweight + (Number(mygoldweight[0]) + Number(mygoldweight[1])) / 2 * Number($(numbers[i]).text());
		}
		totalnumber.text(totalNumber);
		totalgoldweight.text(totalGoldweight.toFixed(2));
	}

	$("#custommade").click(function(e) {
		if ($("#custommade").attr("checked") == "checked") {
			$("#urgentSpan").show();
			$("#vipInfoSpan").show();
			$("#vipid").facus();
		} else {
			$("#urgentSpan").hide();
			$("#vipInfoSpan").hide();
		}
	});

	$("#getMatnrInfo").click(getmatnrinfo);

	function getmatnrinfo() {
		if ($("#matnrinput").val() == '') {
			jAlert("请先录入商品信息!", "提示", function(e) {
				$("#matnrinput").focus();
			})
			return;
		}

		var oldMatnr = $.trim($("#matnrinput").val());
		// alert(oldMatnr);
		var toneType = $("#toneType").val();
		var goldType = $("#goldType").val();
		// var toneColor = $("#toneColor").val();
		// var toneNeatness = $("#toneNeatness").val();
		var gemweight = $("#gemweight").val();
		var goodsize = $("#goodsize").val();
		var technics = $("#technics").val();// $("#technics").selectedValuesString();
		var bismt = $("#bismt").val();
		var toneshape = $("#toneshape").val();
		toneshape = toneshape == null ? '' : toneshape;
		var mainToneStyle = $("#mainToneStyle").val();
		var ifNeedLessTone = $("#ifNeedLessTone").attr("checked") == "checked" ? "X" : "";
		var data = 'orderType=' + $("#type").val() + "&";
		var orderType = $("#type").val();
		// alert(gemweight);
		if (orderType == 'J1' || orderType == 'J2' || orderType == 'J3' || orderType == 'J4' || orderType == 'J5')
			data += "&goldType=" + goldType + "&bismt=" + bismt;
		else if (orderType == "Y1")
			data += "toneType=" + $("#bowlderType").val() + "&goldType=" + goldType +
			// "&technics="+technics+
			"&bismt=" + bismt
			// + "&toneshape="+toneshape
			// "&mainToneStyle="+mainToneStyle
			+ "&goodsize=" + goodsize;
		else if (orderType == 'X1')
			data += "toneType=" + toneType + "&goldType=" + goldType + "&gemweight=" + gemweight + "&technics=" + technics + "&bismt=" + bismt
			// +"&mainToneStyle="+mainToneStyle
			+ "&goodsize=" + goodsize + "&ifNeedLessTone=" + ifNeedLessTone;
		else
			data += "toneType=" + toneType + "&goldType=" + goldType + "&technics=" + technics + "&bismt=" + bismt + "&mainToneStyle="
					+ mainToneStyle + "&goodsize=" + goodsize + "&ifNeedLessTone=" + ifNeedLessTone;

		$("#matnrselect").empty();

		var dialog = $.dialog({
			title : '正在获取物料号，请稍后...',
			max : false,
			min : false,
			close : false,
			lock : true
		});

		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getMatnrByParam&option=user&postType=1',
			type : 'post',
			dataType : 'json',
			data : data,
			success : function(retdata) {
				dialog.close();
				if (retdata == '') {
					jAlert("暂无此类物料号,请与产品部联系！", "提示", function(e) {
						$("#matnrselect").hide();
						$("#matnrinput").show();
						$("#matnrinput").select();
					});
					return;
				}
				needGetMatnr = 0;
				$("#matnrselect").show();
				$("#matnrinput").hide();
				// alert(oldMatnr);
				// $("#matnrinput").val(retdata[0]);
				for ( var i = 0; i < retdata.length; i++) {
					$("#matnrselect").append($("<option " + (oldMatnr == retdata[i] ? "selected" : "") + ">" + retdata[i] + "</option>"));
				}
				getmatnrbyuser();
			},
			failure : function(e) {
			}
		});
	}

	$("#matnrselect").change(function(e) {
		getmatnrbyuser();
	});

	$("#goldType").change(function(e) {
		needGetMatnr += 1;
	});
	autocompletedelay = 3;
	autocompletelength = 2;
	$("#vipid").keydown(function(event) {
		// if ($("#kunnr").val() == "")
		// $("#registertd").show();
		if (event.keyCode == 13) {
			var _checkrownum = $("#tablecontent tr").length - 2;
			if (_checkrownum > 0) {
			}
			if ($.trim($("#vipid").val()) != "") {
				$("#vipid").autocomplete("close");
				kunnrbyuser();
			}
		}
	}).autocomplete({
		source : function(request, response) {
			$.ajax({
				url : "longhaul/pos/order/orderSystem.ered?reqCode=getVipRecord&postType=1&option=auto",
				dataType : "json",
				data : "vipid=" + $("#vipid").val() + "",
				success : function(data) {
					if (data == "") {
						alert('请输入正确的客户号!');
						$("#vipid").val("");
						$("#vipname").text("");
						response(null);
						return;
					}
					response($.map(data, function(item) {
						var vipid = item.hykh == null ? "" : item.hykh;
						var tel = item.sj == null ? "" : item.sj;
						var kunnr = item.hybh == null ? "" : item.hybh;
						var vipname = item.hyxm == null ? "" : item.hyxm;
						var info = {
							label : vipid + "->" + vipname,
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
		delay : 1000,
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
		var vipid = $("#vipid").val().indexOf('->') != -1 ? ($("#vipid").val().substring(0, $("#vipid").val().indexOf('->'))) : $("#vipid").val();
		// $.ajaxSetup({
		// error : function(x, e) {
		// jAlert("访问服务器错误!<font color='red'>" + x.responseText + "</font>",
		// '提示', function(r) {
		// });
		// return false;
		// }
		// });
		$.ajax({
			url : "longhaul/pos/order/orderSystem.ered?reqCode=getVipRecord&option=user&postType=1",
			dataType : "json",
			data : "vipid=" + $.trim(vipid) + "",
			success : function(data) {
				if (data == "") {
					jAlert('请输入正确的客户号!', '提示', function(r) {
						$("#vipid").focus();
						$("#vipid").val("");
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
					$("#vipid").val(info.vipid);
					$("#kunnrjf").val(info.zjf);
					$('#kunnrjf').addClass("kunnrjf");

					if (info.vipname != "" && info.vipname != null) {
						$("#vipname").text(info.vipname);
					}
				});
			}
		});
	}

	function getBismtInfo(bismt, myslxz, myslgg, mygy, myjlbm, myslbm) {
		$.ajax({
			url : "longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getBismtInfo&option=user&postType=1",
			dataType : 'json',
			type : 'post',
			data : "bismt=" + bismt,
			success : function(data) {

				if (data == null) {
					jAlert("没有找到主模号信息！", "提示", function(e) {
						$("#matnrselect").hide();
						$("#matnrinput").show();
						$("#matnrinput").select();

					})
					return;
				}
				var slxz = data.slxz;
				var slgg = data.slgg;
				var gy = data.gy;
				var jlbm = data.jlbm;
				var slbm = data.slbm;
				var allinfo = data.allinfo;
				var mainToneWeight = allinfo[0].zscnt;
				var ifNeedLessTone = allinfo[0].zynfs;

				if (ifNeedLessTone == 'X') {
					$("#ifNeedLessTone").attr("checked", true);
					$("#lessToneSpan").show();
				}

				// alert(allinfo[0].zssiz);
				$("#mainToneWeightRang").html("<b style='color: green;'>范围：<span id='mainToneSizeRangText'>" + mainToneWeight + "</span></b>");
				$("#goodsizeRang").html("<b style='color: green;'>范围：<span id='goodSizeText'>" + allinfo[0].zssiz + "</span></b>");
				if (slxz.length != 0) {
					$("#toneshape").empty();
					$("#toneshape").append("<option value=''>请选择...</option>");

					for ( var i = 0; i < slxz.length; i++) {
						var value = slxz[i].zslxz;
						var text = slxz[i].tslxz;
						$("#toneshape").append("<option value='" + value + "'" + (value == myslxz ? 'selected' : '') + ">" + text + "</option>");
					}
				}else{
					getToneShape(null);
				}
				if (slgg.length != 0) {
					$("#mainToneStyle").empty();
					$("#mainToneStyle").append("<option value=''>请选择...</option>");

					for ( var i = 0; i < slgg.length; i++) {
						var value = slgg[i].zslgg;
						var text = slgg[i].tslgg;
						$("#mainToneStyle").append("<option value='" + value + "'" + (value == myslgg ? 'selected' : '') + ">" + text + "</option>");
					}
				}

				if (gy.length != 0) {
					$("#technics").empty();
					$("#technics").append("<option value=''>请选择...</option>");

					for ( var i = 0; i < gy.length; i++) {
						var flag = false;
						var value = gy[i].atwrt;
						var text = gy[i].atwtb;
						for ( var j = 0; j < mygy.length; j++) {
							if (value == mygy[j]) {
								flag = true;
							}
						}
						$("#technics").append("<option value='" + value + "'" + (flag ? 'selected' : '') + ">" + text + "</option>");
					}

					// var noneselectedtext = "请选择...";
					// $("#technics").multiSelect({
					// selectAll : false,
					// noneSelected : noneselectedtext,
					// oneOrMoreSelected : '*'
					// }, function(el) {
					// });
				}else{
					gettechnics(null);
				}
				if (jlbm.length != 0) {
					$("#goldType").empty();
					$("#goldType").append("<option value=''>请选择...</option>");

					for ( var i = 0; i < jlbm.length; i++) {
						var value = jlbm[i].zjlbn;
						var text = jlbm[i].zjlms;
						$("#goldType").append("<option value='" + value + "'" + (value == myjlbm ? 'selected' : '') + ">" + text + "</option>");
					}
				}else{
					getGoldType(null, null);
				}
				if (slbm.length != 0) {

					if ($("#type").val() == "Y1") {
						$("#bowlderType").empty();
						$("#bowlderType").append("<option value=''>请选择...</option>");

						for ( var i = 0; i < slbm.length; i++) {
							var value = slbm[i].zslbm;
							var text = slbm[i].tslbm;
							$("#bowlderType")
									.append("<option value='" + value + "'" + (value == myslbm ? 'selected' : '') + ">" + text + "</option>");
						}
					} else {
						$("#toneType").empty();
						$("#toneType").append("<option value=''>请选择...</option>");

						for ( var i = 0; i < slbm.length; i++) {
							var value = slbm[i].zslbm;
							var text = slbm[i].tslbm;
							$("#toneType").append("<option value='" + value + "'" + (value == myslbm ? 'selected' : '') + ">" + text + "</option>");
						}
					}
				}else{
					getToneType($("#type").val(),myslbm);
				}
			}
		});

	}

	$("#goodsize").blur(function(e) {
		if (isHavePrice) {
			return;
		}

		var myNumberReg = /^\d+\.?\d+$|^\d+$/;
		var value = $(this).val();
		value = Number(myNumberReg.exec(value));
		var goodSizeStr = $("#goodSizeText").text();
		var goodSize;
		if (goodSizeStr.indexOf("-") != -1) {
			goodSize = goodSizeStr.split("-");
			if (value >= goodSize[0] && value <= goodSize[1]) {
				return;
			} else {
				jAlert("尺寸必须在" + goodSizeStr + "之间", "提示", function(e) {
					$("#goodsize").focus();
				});

			}
		} else if (goodSizeStr.indexOf(",") != -1) {
			goodSize = goodSizeStr.split(",");
			for ( var i = 0; i < goodSize.length; i++) {
				if (goodSize[i] == value) {
					return;
				}
			}
			jAlert("尺寸必须在" + goodSizeStr + "之间选择", "提示", function(e) {
				$("#goodsize").focus();
			});
		}else{
			if(value == Number(goodSizeStr)){
				return;
			}
			needValified = true;
		}
	});

	//$("#gemweight").blur(function(e) {
	$("#gemweight").change(function(e) {
		if (isHavePrice) {
			return;
		}

		if ($("#toneType").val() == "DI") {
			getToneColor(null, null, $("#toneType").val());
			getToneNeatness($("#toneType").val());
		}
		var myNumberReg = /^\d+\.?\d+$|^\d+$/;
		var value = $(this).val();
		value = Number(myNumberReg.exec(value));
		var needValified = false;
		var goodSizeStr = $("#mainToneSizeRangText").text();
		var goodSize;
		var arr,childArr;
		arr = goodSizeStr.split(",");
		for(var ar in arr){
			if (arr[ar].indexOf("-") != -1){
				childArr=[];
				childArr = arr[ar].split("-");
				if(value<=childArr[1] && value >= childArr[0]){
					needValified = false;
					break;
				}else{
					needValified = true;
				}
			}else{
				if(value==arr[ar]){
					needValified = false;
					break;
				}else{
					needValified = true;
				}
			}
			
		}
		
		/** zwh 2015-11-14
		if (goodSizeStr.indexOf("/") != -1) {
			var goodSizeStrs = goodSizeStr.split("/");
			for ( var i = 0; i < goodSizeStrs.length; i++) {
				if (goodSizeStrs[i].indexOf("-") != -1) {
					goodSize = goodSizeStrs[i].split("-");
					if (value >= goodSize[0] && value <= goodSize[1]) {
						needValified = false;
						getCertificate();
						break;
					} else {
						needValified = true;
					}
				}
			}
		} else if (goodSizeStr.indexOf("-") != -1) {
			goodSize = goodSizeStr.split("-");
			if (value >= goodSize[0] && value <= goodSize[1]) {
				getCertificate();
				return;
			} else {
				needValified = true;
			}
		} else if (goodSizeStr.indexOf(",") != -1) {
			goodSize = goodSizeStr.split(",");
			for ( var i = 0; i < goodSize.length; i++) {
				if (goodSize[i] == value) {
					getCertificate();
					return;
				}
			}
			needValified = true;
		}
		**/
		if (needValified) {
			jAlert("主石重必须在" + goodSizeStr + "之间", "提示", function(e) {
				$("#gemweight").focus();
			});
		}
	});

	function checkType() {
		var currType = $("#type").val();
		if (currType == "X2" || currType == "X3" || currType == "J1" || currType == "J2" || currType == "J3" || currType == "Y1") {
			return true;
		} else {
			return false;
		}
	}

	// $("#retailPrice").blur(function(e){
	// if($("#matnrinput").val() == ''){
	// return;
	// }
	//		
	// var value = $(this).val();
	// if(value.indexOf('-')==-1){
	// jAlert("请输入正确的金额区间!","提示",function(e){
	// $("#retailPrice").select();
	// });
	// return;
	// }
	// var values = value.split('-');
	// if(Number(values[0]) > Number(values[1])){
	// jAlert("区间前值不能大于后值！","提示",function(e){
	// $("#retailPrice").select();
	// })
	// return;
	// }
	// });

	$("#btnAddRow").click(
			function() {

				// btnAddRow();
				//			
				// return;

				if ($('#matnr').val() == "") {
					alert("请录入商品信息!");
					$('#matnr').focus();
					return;
				}
				if ($('#matnrinput').val() == "") {
					alert("请录入商品信息!");
					$('#matnrinput').focus();
					return;
				}
				if (orderType == 1) {
					if ($("#goldType").val() == '') {
						alert("请选择金料类型!");
						$("#goldType").focus();
						return;
					}
				} else if (orderType == 2) {
					if ($("#toneType").val() == '') {
						alert("请选择石料类型!");
						$("#toneType").focus();
						return;
					} else if ($("#toneColor").val() == '' && $("#toneColor").find("option").length > 1 && !isHavePrice && $("#type").val() != 'X4'
							&& $("#type").val() != 'X3' && $("#type").val() != 'X2') {
						alert("请选择石料颜色!");
						$("#toneColor").focus();
						return;
					} else if ($("#toneNeatness").val() == '' && $("#type").val() == "X1" && !isHavePrice) {
						alert("请选择石料净度!");
						$("#toneNeatness").focus();
						return;
					} else if ($("#goldType").val() == '' && !isHavePrice) {
						alert("请选择金料类型!");
						$("#goldType").focus();
						return;
					}
				} else if (orderType == 3) {
					if ($("#bowlderType").val() == '' && !isHavePrice) {
						alert("请选择石料类型!");
						$("#bowlderType").focus();
						return;
					}
					// else if ($("#toneshape").val() == '') {
					// alert("请选择石料形状!");
					// $("#toneshape").focus();
					// return;
					// }
					else if ($("#checkbox").attr("checked") == "checked" && $("#goldType").get(0).selectedIndex == 0 && !isHavePrice) {
						alert("请选择金料类型!");
						$("#goldType").focus();
						return;
					}
				} else {
					alert("请选择选款类型！");
					$("#type").focus();
				}

				if (needGetMatnr != 0) {
					jConfirm("你有修改选款参数值，系统重新获取修改后的物料编号,确定开始获取物料信息！", "操作提示", function(e) {
						if (e) {
							// $("#getMatnrInfo").focus();
							getmatnrinfo();
						}
					});
					return;
				}

				if ($("#ifNeedLessTone").attr("checked") == "checked" && $("#lessToneType").val() == '' && !isHavePrice) {
					alert("请选择 副石石料！");
					$("#lessToneType").focus();
					return;
				}

				if ($('input:radio[name="chargtype"]:checked').val() !== "gift") {
					if (Number($("#number").val()) <= 0 || $("#number").val().indexOf('.') != -1) {
						alert('商品数量不正确，请检查!');
						$("#number").focus();
						return false;
					}
				}

				if (orderType == 1 && $("#type").val() != "J3") {
					if ($("#goldweightFrom").val() == '' && !isHavePrice) {
						alert("您没有输入金重的起始值！");
						$("#goldweightFrom").focus();
						return;
					} else if ($("#goldweightTo").val() == '' && !isHavePrice) {
						alert("您没有输入金重的结束值！");
						$("#goldweightTo").focus();
						return;
					}
				}

				if ($("#goodsize").val() == '' && !isHavePrice) {
					jAlert("请输入货品尺寸");
				}

				var value = $("#retailPrice").val();
				if (value.indexOf('-') == -1) {
					alert("市场零售参考价中请输入正确的金额区间!");
					$("#retailPrice").select();
					return;
				}
				var values = value.split('-');
				if (Number(values[0]) > Number(values[1]) && !isHavePrice) {
					alert("市场零售参考价中区间前值不能大于后值！");
					$("#retailPrice").select();
					return;
				} else if (Number(values[1]) <= 0 && !isHavePrice) {
					alert("请输入市场零售参考价！");
					$("#retailPrice").select();
					return;
				}

				var choiceType = $("#type").val();
				if (choiceType == 'J1' || choiceType == 'J2' || choiceType == 'J3' || choiceType == 'J4' || choiceType == 'J5' || choiceType == 'Y1'
						|| choiceType == 'X2' || choiceType == 'X3' || choiceType == 'X4') {
					// alert($("#remark").val());
					if ($("#remark").val() == '') {
						alert("您还没有在备注中录入特殊需求或具体款式描述，不能提交！");
						$("#remark").focus();
						return;
					} else {
						btnAddRow();
					}
				} else {
					btnAddRow();
				}
			});

});