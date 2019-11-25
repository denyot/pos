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
	
	
//	alert(mf_stone_color);
//	alert(mf_stone_clarity);
//	alert(mf_stone_format);
//	alert(mf_stone_kind);
//	alert(factory_repair_result);
	
	$("#factory_repair_result").val(factory_repair_result);
	$("#status").val(status);
	
  //种类
  function getStoneKind(mf_stone_kind) {
      $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initStoneKind&postType=1&random=" + Math.random(), {
      werks : WERKS
    }, function(data) {
      $.each(data, function(key, val) {
        $("#mf_stone_kind").append($("<option value='" + val.zlcode + "' "+( $.trim(val.zlcode) == $.trim(mf_stone_kind) ? "selected" : "" )+ " >" + val.zlname + "</option>"));
      });
    });
  }
  //净度
  function getStoneClarity(mf_stone_clarity) {
    $("#mf_stone_clarity").append("<option value=''>请选择</option>");
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initStoneClarity&postType=1&random=" + Math.random(), {
      werks : WERKS
    }, function(data) {
      $.each(data, function(key, val) {
        $("#mf_stone_clarity").append($("<option value=" + val.jdcode + " "+( $.trim(val.jdcode) == $.trim(mf_stone_clarity) ? "selected" : "" )+  ">" + val.jdname + "</option>"));
      });
    });
  }
  //颜色
  function getStoneColor(mf_stone_color) {
    $("#mf_stone_color").append("<option value=''>请选择</option>");
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initStoneColor&postType=1&random=" + Math.random(), {
      werks : WERKS
    }, function(data) {
      $.each(data, function(key, val) {
        $("#mf_stone_color").append($("<option value=" + val.yscode + " "+( $.trim(val.yscode) == $.trim(mf_stone_color) ? "selected" : "" )+   ">" + val.ysname + "</option>"));
      });
    });
  }
  
	// 获取石料规格
	function getMainToneStyle(mf_stone_format) {
		$("#mf_stone_format").empty();
		$("#mf_stone_format").append($("<option value=''>请选择...</option>"));
		$.ajax({
			url : 'longhaul/pos/choiceorder/choiceOrderSystem.ered?reqCode=getMainToneStyle&option=user&postType=1',
			dataType : "json",
			success : function(data) {
				$.map(data, function(item) {
					var option = $("<option value='" + item.zslgg + "'" + (mf_stone_format == item.zslgg ? "selected" : "") + ">" + item.tslgg + "</option>");
					$("#mf_stone_format").append(option);
				})
			}
		});
	}
  
  
  
   //获取质量部人员信息
  var selectman=$('#accept_people_second').val();
  getQPerson(selectman,"EDIT");
  function getQPerson(noneselectedtext, mode) {
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initQualityInfo&postType=1&random=" + Math.random(), {
      werks : WERKS
    }, function(data) {
      $.each(data, function(key, val) {
        //salemanconf = salemanconf + 1;
        noneselectedtext = mode == "ADD" ? key == 100000 ? val.yyy : noneselectedtext : noneselectedtext; // 默认不需要选择
        noneselectedtext = mode == "ADD" ? "请选择受理人" : noneselectedtext;
        selectedadd = mode == "ADD" ? key == 100000 ? "selected" : "" : "";
        selectededit = mode == "EDIT" ? noneselectedtext.indexOf(val.yyy) > -1 ? "selected" : "" : "";
        selected = selectedadd == "" ? selectededit : selectedadd;
        $("#accept_people_second_select").append($("<option value=" + val.name + " " + selected + ">" + val.name + "</option>"));
      });
      $("#accept_people_second_select").multiSelect({
        selectAll : false,
        noneSelected : noneselectedtext,
        oneOrMoreSelected : '*'
      }, function(el) {
        var ac= $("#accept_people_second_select").selectedValuesString();
        $("#accept_people_second").val(ac);
      });
    });
  }
    //改款配对切换
  faceLinkage();
  function faceLinkage(){
    var v = $("#service_type").val();
    var _clinch_price = $("#clinch_price").val();
    var _real_facelift_amount = $("#tempamount").val();
     if(v == '3'){
       $("#title_span").text('配对管理');
       $(".switch_pd_span").text('配对');
       $(".facelift_ring_span").css('display','none');
       $("#old_gold_weight_span").css('display','none');
       $(".new_commodity_barcode_span").css('display','none');
       $(".ring_span").css('display','none');
       $(".new_certificate_number_span").css('display','none');
       //计算区域
       if(_real_facelift_amount ==''){//配对实际产生金额
          $("#real_facelift_amount").val(_clinch_price/2);
       }
       $(".formula_tb").hide();//计算区域
     }else if(v == '2'){
       $(".facelift_ring_span").css('display','block');
       $("#old_gold_weight_span").css('display','block');
       $(".new_commodity_barcode_span").css('display','block');
       $("#real_facelift_amount").val(_real_facelift_amount);//改款实际产生金额
       $(".ring_span").css('display','block');
     }
  }
    //选择工厂维修结果
    resultLinkage();
    function resultLinkage(){
      var re = $("#factory_repair_result").val();
      if(re=='合格'){
        $('.failed_reason_span').css('display','none');
      }else if(re=='不合格'){
        $('.failed_reason_span').css('display','block');
      }
    }
   $('#factory_repair_result').change(function(){
        resultLinkage();
    });
   //改款实际产生金额
     //计算总价格
     function faceprice() {
      var old_gold_weight = Number($('#old_gold_weight').val());
      var new_gold_weight = Number($('#new_gold_weight').val());
      var gold_material_loss = Number($('#gold_material_loss').val());
      var certificate_cost = Number($('#certificate_cost').val());
      var mainstone_process_fees = Number($('#mainstone_process_fees').val());
      var total_vicestone_process_fees = Number($('#total_vicestone_process_fees').val());
      var old_gold_price = Number($('#old_gold_price').val());
      var new_gold_price = Number($('#new_gold_price').val());
      var vicestone_cost = Number($('#vicestone_cost').val());
      var version_cost = Number($('#version_cost').val()) - 0;
      var certificate_cost = Number($('#certificate_cost').val());
      var total = (new_gold_weight*(1+gold_material_loss/100)*new_gold_price)-(old_gold_weight*old_gold_price)
      +mainstone_process_fees+total_vicestone_process_fees+vicestone_cost+version_cost+certificate_cost;
      $('#real_facelift_amount').val(Number(total).toFixed(2));
    }
     //绑定事件
    $('#old_gold_weight').bind("keyup",function(){$('#old_gold_weight_cus').val($('#old_gold_weight').val());faceprice();});
    $('#new_gold_weight').bind("keyup",function(){$('#new_gold_weight_cus').val($('#new_gold_weight').val());faceprice();});
    $('#gold_material_loss').bind("keyup",function(){faceprice();});
    $('#certificate_cost').bind("keyup",function(){faceprice();});
    $('#mainstone_process_fees').bind("keyup",function(){faceprice();});
    $('#total_vicestone_process_fees').bind("keyup",function(){faceprice();});
    $('#old_gold_price').bind("keyup",function(){faceprice();});
    $('#new_gold_price').bind("keyup",function(){$('#new_gold_price_cus').val((($('#new_gold_price').val())*1.1).toFixed(2));faceprice();});
    $('#vicestone_cost').bind("keyup",function(){$('#vicestone_cost_cus').val(($('#vicestone_cost').val())*2);faceprice();});
    $('#version_cost').bind("keyup",function(){$('#version_cost_cus').val(($('#version_cost').val())*2);faceprice();});
    
    $('#mf_stone_amount').bind("keyup",function(){$('#total_vicestone_process_fees').val(($('#mf_stone_amount').val())*5);
                                                  $('#total_vicestone_process_fees_cus').val(($('#mf_stone_amount').val())*5);});
    
     //计算收取客户总价格
     function cusfaceprice() {
      var old_gold_weight = Number($('#old_gold_weight_cus').val());
      var new_gold_weight = Number($('#new_gold_weight_cus').val());
      var gold_material_loss = Number($('#gold_material_loss_cus').val()) ;
      var certificate_cost = Number($('#certificate_cost').val());
      var mainstone_process_fees = Number($('#mainstone_process_fees_cus').val());
      var total_vicestone_process_fees = Number($('#total_vicestone_process_fees_cus').val());
      var old_gold_price = Number($('#old_gold_price_cus').val());
      var new_gold_price = Number($('#new_gold_price_cus').val());
      var vicestone_cost = Number($('#vicestone_cost_cus').val());
      var version_cost = Number($('#version_cost_cus').val()) ;
      //alert(old_gold_weight+""+new_gold_weight+""+gold_material_loss+""+certificate_cost+""+mainstone_process_fees+""+total_vicestone_process_fees+""+old_gold_price+""+new_gold_price+""+vicestone_cost+""+version_cost);
      var total = (new_gold_weight*(1+gold_material_loss/100)*new_gold_price)-(old_gold_weight*old_gold_price)
      +mainstone_process_fees+total_vicestone_process_fees+vicestone_cost+version_cost+certificate_cost;
      $('#real_repair_amount_cus').val(Number(total).toFixed(2));
    }
     //收取客户绑定事件
    $('#old_gold_weight_cus').bind("keyup",function(){cusfaceprice();});
    $('#new_gold_weight_cus').bind("keyup",function(){cusfaceprice();});
    $('#gold_material_loss_cus').bind("keyup",function(){cusfaceprice();});
    $('#mainstone_process_fees_cus').bind("keyup",function(){cusfaceprice();});
    $('#total_vicestone_process_fees_cus').bind("keyup",function(){cusfaceprice();});
    $('#old_gold_price_cus').bind("keyup",function(){cusfaceprice();});
    $('#new_gold_price_cus').bind("keyup",function(){cusfaceprice();});
    $('#vicestone_cost_cus').bind("keyup",function(){cusfaceprice();});
    $('#version_cost_cus').bind("keyup",function(){cusfaceprice();});
    //form提交
    $("#faceliftSubmitBtn").click(function() {
       var pass = $("#secondForm").validationEngine('validate');
         if(pass==false){
           return false;
       }
      if($("#accept_people_second").val()==''){
        jAlert('受理人不能为空', '提示');
        return false;
      }
       var params=$('#secondForm').serialize();
       $.ajax({  
               url :'longhaul/pos/aftersales/aftersales.ered?reqCode=updateInfo&postType=1&service_type=2&step=2', 
               type:'post',    
               dataType:'json',     
               data:params,    
               error: function(XMLHttpRequest, textStatus, errorThrown){
                  //jAlert('操作错误,请与系统管理员联系!', '提示');
                  window.location.href="longhaul/pos/authorization.jsp";
                },
               success:function(data){
                 jAlert('保存成功', '提示');
               }//回传函数
        });
    });
    
     //商品条码
  $("#charg").keydown(function(event) {
    if (event.keyCode == 13) {
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
      data : "charg=" + $.trim(_charg),
      success : function(data) {
        if (data == "") {
          var chargalertstr = "输入批次不存在!!";
          //chargalertstr = _chargtype == "gift" ? "输入物料编码不存在!" : chargalertstr
          jAlert(chargalertstr, '提示', function(r) {
            clearcharginfo();
          });
        }
        $.map(data, function(item) {
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
          chosecharginfo(info, "user");
        });
        $("#factory_receive_people").addClass("inputkey");
        $("#factory_receive_people").focus();
      }
    });
    //关闭自动完成
    $("#charg").autocomplete({
      disabled : false
    });
    
  }
  //选择商品条码
  $("#expect_picture_tr").hide();
  function chosecharginfo(item, type) {
    if (type = "") {
      charginfo = ui.item;
    } else {
      charginfo = item;
    }
    _product_image = charginfo.sptp;
    $("#trade_name").val(charginfo.spmc);//商品名称
    $("#expect_picture").val(_product_image);
    $("img").attr("src", "sappic/" + _product_image);
    $("#expect_picture_tr").show();
  }
  // 清理商品相关信息
  function clearcharginfo() {
    $("#charg").focus();
    $("#charg").val("");
    $("#trade_name").val("");
    $("#product_image").val("");
    $("#charg").addClass("inputkey");
  }
  
      //打印
  $("#showFactoryPrint").click(function() {
    var service_number = $("#facelift_number").val();
    if(service_number == ''){
      jAlert('当前没有可打印的信息，请提交信息后打印!', '提示');
      return false;
    }
    var url = basepath + "longhaul/pos/aftersales/aftersales.ered?reqCode=getServiceInfoById&postType=1&service_type=2&step=detail&whichp=f&facelift_number="+service_number;
    window.open(url);
  });
   $("#showStockPrint").click(function() {
    var service_number = $("#facelift_number").val();
    if(service_number == ''){
      jAlert('当前没有可打印的信息，请提交信息后打印!', '提示');
      return false;
    }
    var url = basepath + "longhaul/pos/aftersales/aftersales.ered?reqCode=getServiceInfoById&postType=1&service_type=2&step=detail&whichp=p&facelift_number="+service_number;
    window.open(url);
  });
  //失败记录
    loadFailedRecord();
    function loadFailedRecord(){
    var _service_number = $("#service_number").val();
    if(_service_number!=""){
        $.getJSON(
        "longhaul/pos/aftersales/aftersales.ered?reqCode=getFailedReason&postType=1&random="
            + Math.random(), {
          werks : WERKS,
          service_number : _service_number
        }, function(data) {
          if (data == "") {
            return;
          }
          $.each(data, function(key, val) {
            stylcss = key % 2 == 0 ? "failed_reason_tr" : "failed_reason_tr";
            row = "<tr>";
            var factory_receive_date = val.factory_receive_date == null? "&nbsp;": val.factory_receive_date;
            row = row + "<td>返修记录" + (key+1) + "</td><td>工厂收货日期:</td><td class='inputleft'>" + factory_receive_date + "</td>";
            var failed_reason = val.failed_reason == null? "&nbsp;": val.failed_reason;
            row = row + "<td>不合格原因:</td><td class='inputleft'>" + failed_reason + "</td>";
            row = row + "</tr>"
            $("#repairsystemtable tr:eq(30)").after(row);
          });

        });
      }
    }
    
    
    getStoneKind(mf_stone_kind);
    getStoneClarity(mf_stone_clarity);
    getStoneColor(mf_stone_color);
    getMainToneStyle(mf_stone_format);
    
  
});