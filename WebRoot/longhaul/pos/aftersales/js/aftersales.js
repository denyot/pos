$(function () {
	
	
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
	
	
	var day30 = 30 * 24 * 60 * 60 * 1000;
	var now = new Date();
	now.setTime(now.getTime() + day30);
	$("#accept_date").datepicker({changeMonth:true, changeYear:true});
	if($("#accept_date").val()=="")
	  $("#accept_date").datepicker("setDate", new Date());
	$("#sell_date").datepicker({changeMonth:true, changeYear:true});
	$("#expected_pickup_date").datepicker({changeMonth:true, changeYear:true});
	if($("#expected_pickup_date").val()=="")
	  $("#expected_pickup_date").datepicker("setDate", now);
	$("#receive_date").datepicker({changeMonth:true, changeYear:true});
	if($("#receive_date").val()=="")
	  $("#receive_date").datepicker("setDate", new Date());
	  
	//会员卡号自动填充
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
        url : "longhaul/pos/aftersales/aftersales.ered?reqCode=getVipRecord&option=auto&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
        dataType : "json",
        data : "vipid=" + $("#vipid").val() + "",
        success : function(data) {
          if (data == "") {
            jAlert('输入卡号不存在!!', '提示', function(r) {
              $("#vipid").focus();
              $("#vipid").val("");
              $("#vipname").val("");
              $("#tel").val("");
            });
          }
          response($.map(data, function(item) {
            var kunnr = item.hybh == null ? "" : item.hybh;
            var vipid = item.hykh == null ? "" : item.hykh;
            var tel = item.sj == null ? "" : item.sj;
            var info = {
              label : kunnr,
              kunnr : kunnr,//客户号
              vipid : vipid,
              tel : tel
            };
            return {
              label : "客户号:" + kunnr + "VIPID:" + vipid + "电话:" + tel + ""
              //label : "客户号:" + vipid + "电话:" + tel + ""
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
  //回车查询
  function getvipidbyuser() {
    $.ajaxSetup({
      error : function(error, e) {
        jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
        });
        return false;
      }
    });
    tempvipid = $("#vipid").val();
    _kunnr = tempvipid.indexOf("客户号:") !=-1 ? (tempvipid.substring(tempvipid.indexOf("客户号:") + 4, tempvipid.indexOf("VIPID:"))) : "";
    //_kunnr = tempvipid.indexOf("客户号:") > -1 ? _kunnr : tempvipid;
    _vipid = tempvipid.indexOf("客户号:") !=-1 ? tempvipid.substring(tempvipid.indexOf("VIPID:") + 6, tempvipid.indexOf("电话:")) : tempvipid;
    $.ajax({
      url : "longhaul/pos/aftersales/aftersales.ered?reqCode=getVipRecord&option=user&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
      dataType : "json",
      data : "kunnr=" + _kunnr + "&vipid="+_vipid,
      success : function(data) {
        if (data == "") {
          jAlert('输入卡号不存在!', '提示', function(r) {
            $("#vipid").focus();
            $("#vipid").val("");
            $("#vipname").val("");
          });
        }
        $.map(data, function(item) {
          var kunnr = item.hybh == null ? "" : item.hybh;
          var vipid = item.hykh == null ? "" : item.hykh;
          var tel = item.sj == null ? "" : item.sj;
          var vipname = item.hyxm == null ? "" : item.hyxm;
          var building = item.mfcs == null ? "" : item.mfcs;
          var info = {
            label : kunnr,
            kunnr : kunnr,//客户号
            vipid : vipid,
            tel : tel
          };
          $("#kunnr").val(kunnr);
          $("#vipid").val(vipid);
          $("#tel").val(tel);
          $("#vipname").val(vipname);
          $("#building").val(building);
          $("#charg").attr("disabled", false);
          $("#charg").attr("readOnly", false);
          $("#charg").addClass("inputkey");
          $("#charg").focus();
        });
      }
    });
    $("#vipid").autocomplete({
      disabled : false
    });
  }
  //电话号码自动填充
  $("#tel").keydown(function(event) {
    if (event.keyCode == 13) {
      var _checkrownum = $("#tablecontent tr").length - 2;
      if (_checkrownum > 0) {

      }
      if ($.trim($("#tel").val()) != "") {
        $("#tel").autocomplete("close");
        gettelbyuser();
      }
    }
  }).autocomplete({
    source : function(request, response) {
      $.ajax({
        url : "longhaul/pos/aftersales/aftersales.ered?reqCode=getVipRecord&option=auto&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
        dataType : "json",
        data : "tel=" + $("#tel").val() + "",
        success : function(data) {
          if (data == "") {
            jAlert('输入卡号不存在!!', '提示', function(r) {
              $("#tel").focus();
              $("#tel").val("");
              $("#vipid").val("");
              $("#vipname").val("");
            });
          }
          response($.map(data, function(item) {
            var kunnr = item.hybh == null ? "" : item.hybh;
            var vipid = item.hykh == null ? "" : item.hykh;
            var tel = item.sj == null ? "" : item.sj;
            var info = {
              label : kunnr,
              kunnr : kunnr,//客户号
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
  //回车根据电话号码查询
  function gettelbyuser() {
    $.ajaxSetup({
      error : function(error, e) {
        jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
        });
        return false;
      }
    });
    temptel = $("#tel").val();
    _tel = temptel.indexOf("电话") != -1 ? temptel.substring(temptel.indexOf("电话:")+3) : temptel;
    $.ajax({
      url : "longhaul/pos/aftersales/aftersales.ered?reqCode=getVipRecord&option=user&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
      dataType : "json",
      data : "tel=" + _tel + "",
      success : function(data) {
        if (data == "") {
          jAlert('输入卡号不存在!', '提示', function(r) {
            $("#tel").focus();
            $("#tel").val("");
            $("#vipid").val("");
            $("#vipname").val("");
          });
        }
        $.map(data, function(item) {
          var kunnr = item.hybh == null ? "" : item.hybh;
          var vipid = item.hykh == null ? "" : item.hykh;
          var tel = item.sj == null ? "" : item.sj;
          var vipname = item.hyxm == null ? "" : item.hyxm;
          var info = {
            label : kunnr,
            kunnr : kunnr,//客户号
            vipid : vipid,
            tel : tel
          };
          $("#vipid").val(vipid);
          $("#tel").val(tel);
          $("#vipname").val(vipname);
          $("#charg").attr("disabled", false);
          $("#charg").attr("readOnly", false);
          $("#charg").addClass("inputkey");
          $("#charg").focus();
        });
      }
    });
    $("#tel").autocomplete({
      disabled : false
    });
  }
  //切换
  $("input[name=service_type_se]").click(function(){
    var _step = $("#step").val();
    _service_type = $(this).attr("realva");
    if(_service_type=='1'){
          window.location.href=basepath
                + "longhaul/pos/aftersales/repairone.jsp?&postType=1"
                + "&service_type=" + _service_type
                + "&step=" + _step
                + "&WERKS=" + WERKS;
    }else{
      window.location.href=basepath
                + "longhaul/pos/aftersales/faceliftone.jsp?&postType=1"
                + "&service_type=" + _service_type
                + "&step=" + _step
                + "&WERKS=" + WERKS;
    }
  });
  var _service_type = $("#service_type").val();
   //商品条码自动
  $("#charg").keydown(function(event) {
    if (event.keyCode == 13) {
    	if(($("#vipid").val()) == ""){
    		jAlert("请输入会员卡号！","提示",function(){
    			$("#vipid").focus();
    		});
    		return false;
    		
    	}
    	
      if ($.trim($("#charg").val()) != "") {
        $("#charg").autocomplete("close");
        getchargbyuser();
      }
    }
  }).autocomplete({
    source : function(request, response) {
      _charg = $("#charg").val().toUpperCase();
      $.ajax({
        url : "longhaul/pos/aftersales/aftersales.ered?reqCode=getMateriel&postType=1&option=auto&werks=" + WERKS + "&random=" + Math.random() + "",
        dataType : "json",
        data : "charg=" + $.trim(_charg),
        success : function(data) {
          if (data == "") {
            var chargalertstr = "输入批次不存在!";
            //chargalertstr = _chargtype == "gift" ? "输入物料编码不存在!" : chargalertstr
            jAlert(chargalertstr, '提示', function(r) {
              clearcharginfo();
            });
          }
          response($.map(data, function(item) {
            var charg = item.charg == null ? "" : item.charg; 
            var sptm = item.sptm == null ? "" : item.sptm; // 物料号
            var spmc = item.spmc == null ? "" : item.spmc; // 产品名称
            var sptp = item.sptp == null ? "" : item.sptp; // 产品如图片
            var info = {
              charg : charg,
              sptm : sptm,
              spmc : spmc,
              sptp : sptp
            };
            // return info;
            return {
              label : charg + "->" + spmc
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
  // 用户回车选择商品名
  function getchargbyuser() {
    tempchargNo = $("#charg").val();
    _mycharg = tempchargNo.substring(0, tempchargNo.indexOf("->"));
    _charg = tempchargNo.indexOf("->") > 0 ? _mycharg : tempchargNo;
    _charg = _charg.toUpperCase();
    $("#charg").val(_charg);
    var _vipcard = $.trim($("#vipid").val());
    $.ajaxSetup({
      error : function(x, e) {
        jAlert("访问服务器错误信!<font color='red'>" + x.responseText + "</font>", '提示', function(r) {
        });
        return false;
      }
    });
    $.ajax({
      url : "longhaul/pos/aftersales/aftersales.ered?reqCode=getMateriel&option=user&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
      dataType : "json",
      data : "charg=" + $.trim(_charg)+"&vipcard=" + $.trim(_vipcard),
      success : function(data) {
        if (data == "") {
          var chargalertstr = "输入批次不存在!!";
          jAlert(chargalertstr, '提示', function(r) {
            clearcharginfo();
          });
        }
        $.map(data, function(item) {
            var charg = item.charg == null ? "" : item.charg; 
            var chargappcount = item.chargappcount == null ? "" : item.chargappcount; 
            
            var sptm = item.sptm == null ? "" : item.sptm; // 物料号
            var spmc = item.spmc == null ? "" : item.spmc; // 产品名称
            var sptp = item.sptp == null ? "" : item.sptp; // 产品如图片
            var hpzl = item.hpzl == null ? "" : item.hpzl; // 货品重量
            var slzl = item.slzl == null ? "" : item.slzl; // 石料重量
            var xsjg = item.xsjg == null ? "" : item.xsjg; // 销售价格
            var xsrq = item.xsrq == null ? "" : item.xsrq; // 销售日期
            var hpzsbh = item.hpzsbh == null ? "" : item.hpzsbh; // 货品证书号
            var zsbh = item.zsbh == null ? "" : item.zsbh; // 裸石证书号
            var zslx = item.zslx == null ? "" : item.zslx; // 裸石证书类型
            var vipcard = item.vipcard == null ? "" : item.vipcard; // 裸石证书类型
            var info = {
              charg : charg,
              chargappcount : chargappcount,
              sptm : sptm,
              spmc : spmc,
              sptp : sptp,
              hpzl : hpzl,
              slzl : slzl,
              xsjg : xsjg,
              xsrq : xsrq,
              hpzsbh : hpzsbh,
              zsbh : zsbh,
              vipcard : vipcard,
              zslx : zslx
            };
          chosecharginfo(info, "user");
        });
      }
    });
    //关闭自动完成
    $("#charg").autocomplete({
      disabled : false
    });
    //统计维修次数
    if("1"==_service_type){
      $.ajax({
	      url : "longhaul/pos/aftersales/aftersales.ered?reqCode=countRepairTime&postType=1&werks=" + WERKS + "&random=" + Math.random() + "",
	      dataType : "json",
	      data : "old_commodity_barcode=" + $.trim(_charg),
	      success : function(data) {
	        $("#repair_count").val(data);
	        }
      });
    }
  }
  //选择商品条码
  function chosecharginfo(item, type) {
    if (type = "") {
      charginfo = ui.item;
    } else {
      charginfo = item;
    }
//    alert(charginfo.vipcard);
    
    if($("#charg").val() == 'ZLSH000000'){
    	
    }else{
	    if(charginfo.xsjg === ''){
	    	jAlert("该批次没有销售过，不能做售后处理！","提示",function(e){
	    		$("#charg").select();
	    	});
	    	return;
//	    }else if(charginfo.vipcard != $("#vipid").val()){
//	    	jAlert("该批次不是该会员销售，不能做售后处理！","提示",function(e){
//	    		$("#charg").select();
//	    	});
//	    	return;
	    }
    }
    _product_image = charginfo.sptp;
    $("#trade_name").val(charginfo.spmc);//商品名称
    $("#product_image").val(_product_image);
    $("#old_goods_weight").val(charginfo.hpzl);
    $("#old_stone_weight").val(charginfo.slzl);
    $("#clinch_price").val(charginfo.xsjg);
    $("#sell_date").val(charginfo.xsrq);
    $("#old_certificate_number").val(charginfo.hpzsbh);//货品证书号
    $("#luodan_certificate_number").val(charginfo.zsbh);//裸石证书号
    $("#luodan_certificate_type").val(charginfo.zslx);//裸石证书类型
    $("img").attr("src", "sappic/" + _product_image);
    var chargappcount = Number(charginfo.chargappcount);
    var py  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var mypy = py.substring(chargappcount, chargappcount+1);
     if($("#charg").val() == 'ZLSH000000'){
    	$("#charg_prepared").val(charginfo.charg+(chargappcount+1));
     }else{
    	$("#charg_prepared").val(charginfo.charg+mypy);
     }
    
    $("#real_goods_weight").addClass("inputkey");
    $("#real_goods_weight").focus();
    
  }
  // 清理商品相关信息
  function clearcharginfo() {
    $("#charg").focus();
    $("#charg").val("");
    $("#trade_name").val("");
    $("#product_image").val("");
    $("#charg").addClass("inputkey");
  }
  
});

