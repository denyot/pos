$(function () {
//切换
  
  //查询基础信息
  var optionis="<option value='是'>是</option>";
  var optionno="<option value='否'>否</option>";
  $("#isincluding_vicestone").append("<option value='否'>否</option>");
  $("#isincluding_vicestone").append("<option value='是'>是</option>");
  $("#isdo_certificate").append("<option value='否'>否</option>");
  $("#isdo_certificate").append("<option value='是'>是</option>");
  
  //基础信息
  getFaceliftbagInfo();
  getGoldmaterialInfo();
  getCertificateInfo();
  getGoldQualityInfo();
  //改款款式
  function getFaceliftbagInfo() {
    $("#facelift_bag").append("<option value=''>请选择</option>");
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initFaceliftbagInfo&postType=1", function (data) {
      $.each(data, function (key, val) {
        $("#facelift_bag").append($("<option value=" + val.code + "-"+ val.price1 + ">" + val.style + "</option>"));
      });
    });
  }
  $('#facelift_bag').click(function(){
        var _building = $('#building').val();
        var str = $(this).children('option:selected').val();//value的值
        var _old_stone_weight = $("#old_stone_weight").val();
        if(_old_stone_weight==''){
           jAlert('请先输入原货品石料重!', '提示');
           return false;
        }
        var price = str.substr(str.indexOf('-') + 1,str.lenght);
        $("#isfree_process_fees").val('否');
        if(_old_stone_weight>=0&&_old_stone_weight<0.5){
          if(_building >=1){
            $("#building_span").text("免工费剩余"+_building+"次,可以免工费!");
            $("#building_span").css("display","block");
            $("#mainstone_process_fees").val(0);
            $("#isfree_process_fees").val('是');
          }else{
            $("#building_span").text("免工费剩余0次, 不可以免工费!");
            $("#building_span").css("display","block");
            $("#mainstone_process_fees").val(price);
          }
        }else if(_old_stone_weight>=0.5&&_old_stone_weight<1){
          $("#building_span").css("display","none");
          $("#mainstone_process_fees").val(price*2);
        }else if(_old_stone_weight>=1){
          $("#building_span").css("display","none");
          $("#mainstone_process_fees").val(price*3);
        }else{
          //
        }
    });
   //金料
  function getGoldmaterialInfo() {
    $("#gold_material").append("<option value=''>请选择</option>");
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initGoldmaterialInfo&postType=1", function (data) {
      $.each(data, function (key, val) {
        $("#gold_material").append($("<option value=" + val.code + "-"+ val.loss + ">" + val.name + "</option>"));
      });
    });
  }
   $('#gold_material').change(function(){
        var str = $(this).children('option:selected').val();//value的值
        var loss = str.substr(str.indexOf('-') + 1,str.lenght);
        $("#gold_material_loss").val(loss);
    });
  //成色
  function getGoldQualityInfo() {
    $("#gold_material_quality").append("<option value=''>请选择</option>");
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initGoldQualityInfo&postType=1", function (data) {
      $.each(data, function (key, val) {
        $("#gold_material_quality").append($("<option value=" + val.name + ">" + val.name + "</option>"));
      });
    });
  }
   //证书
  function getCertificateInfo() {
    $("#certificate_type").append("<option value=''>请选择</option>");
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initCertificateInfo&postType=1", function (data) {
      $.each(data, function (key, val) {
        $("#certificate_type").append($("<option value=" + val.code + "-"+ val.certificatecost + ">" + val.name + "</option>"));
      });
    });
  }
  //是否含副石
     $('#isincluding_vicestone').change(function(){
        var inc = $('#isincluding_vicestone').val();
        if(inc=='是'){
            $("#vicestone").attr("value","钻石");
        }else{
            $("#vicestone").attr("value","无");
        }
    });
  //营业员
  getsaleman("请选择","ADD");
  function getsaleman(noneselectedtext, mode) {
    $.getJSON("longhaul/pos/order/orderSystem.ered?reqCode=getsaleman&postType=1&random=" + Math.random(), {
      werks : WERKS
    }, function(data) {
      $.each(data, function(key, val) {
        //salemanconf = salemanconf + 1;
        noneselectedtext = mode == "ADD" ? key == 100000 ? val.yyy : noneselectedtext : noneselectedtext; // 默认不需要选择
        noneselectedtext = mode == "ADD" ? "请选择营业员" : noneselectedtext;
        selectedadd = mode == "ADD" ? key == 100000 ? "selected" : "" : "";
        selectededit = mode == "EDIT" ? noneselectedtext.indexOf(val.yyy) > -1 ? "selected" : "" : "";
        selected = selectedadd == "" ? selectededit : selectedadd;
        $("#accept_people_first_select").append($("<option value=" + val.assistant_name + " " + selected + ">" + val.assistant_name + "</option>"));
      });
      $("#accept_people_first_select").multiSelect({
        selectAll : false,
        noneSelected : noneselectedtext,
        oneOrMoreSelected : '*'
      }, function(el) {
        var ac= $("#accept_people_first_select").selectedValuesString();
        $("#accept_people_first").val(ac);
        // $("#callbackResult").show().fadeOut();
      });
    });
  }
     //裸石证书
  //function getLuodanCertificateInfo() {
  //  $("#luodan_certificate_type").append("<option value=''>请选择</option>");
  //  $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initLuodanCerInfo&postType=1", function (data) {
  //    $.each(data, function (key, val) {
  //      $("#luodan_certificate_type").append($("<option value=" + val.code + ">" + val.name + "</option>"));
  //    });
  //  });
  //}
  $('#certificate_type').change(function(){
        var str = $(this).children('option:selected').val();//value的值
        var cost = str.substr(str.indexOf('-') + 1,str.lenght);
        $("#certificate_cost").val(cost);
  });
  $('#isincluding_vicestone').change(function(){
        var se = $(this).children('option:selected').val();//value的值
        if(se == '是'){
          $("#vicestone_process_fees").val(5);
        }else if(se == '否'){
          $("#vicestone_process_fees").val('');
        }
    });
   $(".isdo_certificate_tr").hide();
   $('#isdo_certificate').change(function(){
        var se = $(this).children('option:selected').val();//value的值
        if(se == '是'){
          $('.isdo_certificate_tr').show();
        }else if(se == '否'){
          $('.isdo_certificate_tr').hide();
        }
    });
  //配对预计费用
    $('#clinch_price').bind("keyup",function(){
      var _service_type = $("#service_type").val();
      if(_service_type == '3'){
        $('#expected_cost').val((($('#clinch_price').val())/2).toFixed(2));
      }
    });
   //form提交
    $("#faceliftSubmitBtn").click(function() {
      var pass = $("#firstForm").validationEngine('validate');
        if(pass==false){
          return false;
      }
      if($("#accept_people_first").val()==''){
        jAlert('受理人不能为空', '提示');
        return false;
      }
      var params=$('#firstForm').serialize(); //这里直接就序列化了表单里面的值；很方便  
       $.ajax({  
               url :'longhaul/pos/aftersales/aftersales.ered?reqCode=saveInfo&postType=1', 
               type:'post',    
               dataType:'json',   
               data:params,    
               error: function(XMLHttpRequest, textStatus, errorThrown){
                  //jAlert(XMLHttpRequest+textStatus+errorThrown+'操作错误,请与系统管理员联系!', '提示');
                  window.location.href="longhaul/pos/authorization.jsp";
                },
               success:callmb//回传函数
        });
		});
		function updateBuilding(){
		  var _old_stone_weight = $("#old_stone_weight").val();
		  var _building = $("#building").val();
		  var _kunnr = $("#kunnr").val();
		  if(_old_stone_weight>0&&_old_stone_weight<0.5&&_building>=1){
       $.ajax({  
	       url :'longhaul/pos/member/memberSystem.ered?reqCode=updateMember&postType=1&mfcs=y', 
	       type:'post',    
	       dataType:'json',   
	       data:"kunnr=" + _kunnr + "&building=" + _building,
	       error: function(XMLHttpRequest, textStatus, errorThrown){
	          //jAlert(XMLHttpRequest+textStatus+errorThrown+'操作错误,请与系统管理员联系!', '提示');
	        },
	       success: function(){
	         alert("更新次数成功!");
	       }
       });
		  }
		}
	 //是否打印
      function callmb(data){
       updateBuilding();
       service_type = $("#service_type").val();
       if($.trim(data.success) == 'true'){
       //写单号
       $("#service_number").val(data.service_number);
                  jConfirm('是否打印!', '操作成功', function(r) {
                     if(r){
	                     print(service_type, data.service_number);
	                     document.forms["firstForm"].reset();
	                     window.location.reload();
                     }else{
                    	 window.location.reload();
                     }
                    });
               }else{
                 jAlert('操作失败!', '提示');
               }
      }
    //打印
  $("#showRepairPrint").click(function() {
    service_type = $("#service_type").val();
    var service_number = $("#service_number").val();
    if(service_number == ''){
      jAlert('当前没有可打印的信息，请提交信息后打印!', '提示');
      return false;
    }
    print(service_type, service_number);
  });
  function print(service_type, service_number){
    var url = basepath + "longhaul/pos/aftersales/aftersales.ered?reqCode=getServiceInfoById&postType=1&service_type="
    +service_type+"&whichp=s&step=detail&service_number="+service_number;
    window.open(url);
  }
   //拟定商品条码
  $("#charg_prepared").keydown(function(event) {
    if (event.keyCode == 13) {
      if ($.trim($("#charg_prepared").val()) != "") {
        $("#charg_prepared").autocomplete("close");
        getchargbyuser2();
      }
    }
  }).autocomplete({
    source : function(request, response) {
      _charg = $("#charg_prepared").val().toUpperCase();
      $.ajax({
        url : "longhaul/pos/aftersales/aftersales.ered?reqCode=getMateriel&postType=1&option=auto&werks=" + WERKS + "&random=" + Math.random() + "",
        dataType : "json",
        data : "charg=" + $.trim(_charg),
        success : function(data) {
          if (data == "") {
            var chargalertstr = "输入批次不存在!";
            jAlert(chargalertstr, '提示', function(r) {
              clearcharginfo2();
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
  function getchargbyuser2() {
    tempchargNo = $("#charg_prepared").val();
    _mycharg = tempchargNo.substring(0, tempchargNo.indexOf("->"));
    _charg = tempchargNo.indexOf("->") > 0 ? _mycharg : tempchargNo;
    _charg = _charg.toUpperCase();
    $("#charg_prepared").val(_charg);
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
          jAlert(chargalertstr, '提示', function(r) {
            clearcharginfo2();
          });
        }
        $.map(data, function(item) {
            var charg = item.charg == null ? "" : item.charg; 
            var sptm = item.sptm == null ? "" : item.sptm; // 物料号
            var spmc = item.spmc == null ? "" : item.spmc; // 产品名称
            var sptp = item.sptp == null ? "" : item.sptp; // 产品如图片
            var slzl = item.slzl == null ? "" : item.slzl; // 石料重
            var mjh = item.mjh == null ? "" : item.mjh; // 模具号
            var sl = item.sl == null ? "" : item.sl; // 石料
            var info = {
              charg : charg,
              sptm : sptm,
              spmc : spmc,
              sptp : sptp,
              slzl : slzl,
              mjh : mjh,
              sl : sl
            };
          chosecharginfo2(info, "user");
        });
        $("#expected_cost").addClass("inputkey");
        $("#expected_cost").focus();
      }
    });
    //关闭自动完成
    $("#charg_prepared").autocomplete({
      disabled : false
    });
    
  }
  //选择商品条码
  function chosecharginfo2(item, type) {
    if (type = "") {
      charginfo = ui.item;
    } else {
      charginfo = item;
    }
    _expect_picture = charginfo.sptp;
    $("#mf_mold_number_span").val(charginfo.mjh);//模具号
    $("#mf_stone").val(charginfo.sl);//配对石料
    $("#mf_stone_weight").val(charginfo.slzl);//石料重量
    $("#product_image").val(_expect_picture);
    $("#expectimg_id").attr("src", "sappic/" + _expect_picture);
    $("#product_image_tr").css("display","block");
    $("#product_image_div").css("display","block");
  }
  // 清理商品相关信息
  function clearcharginfo2() {
    $("#charg_prepared").focus();
    $("#charg_prepared").val("");
    $("#mf_mold_number_span").val("");//模具号
    $("#mf_stone").val("");//配对石料
    $("#mf_stone_weight").val("");//石料重量
    $("#product_image").val("");
    $("#charg_prepared").addClass("inputkey");
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
       $("#kl_stone").css('display','none');
       $("#kls").css('display','none');
       $("#facelift_ring_span").css('display','none');
       $("#old_gold_weight_span").css('display','none');
       $("#new_commodity_barcode_span").css('display','none');
       $("#real_facelift_amount_span").text('配对实际产生金额:');
       $(".pd_hide").css('display','none');
       //计算区域
       if(_real_facelift_amount ==''){//配对实际产生金额
          $("#real_facelift_amount").val(_clinch_price/2);
       }
       $(".formula_tb").hide();//计算区域
       //document.getElementById("detect_td").rowSpan="6";
     }else if(v == '2'){
       $("#title_span").text('改款管理');
       $("#facelift_ring_span").css('display','block');
       $("#old_gold_weight_span").css('display','block');
       $("#new_commodity_barcode_span").css('display','block');
       $("#real_facelift_amount").val(_real_facelift_amount);//改款实际产生金额
       $("#real_facelift_amount_span").text('改款实际产生金额:');
       $(".formula_tb").show();//计算区域
     }
  }
  
  
  
  $("#mf_mold_number").keydown(function(key){
  	var matnr = $.trim($(this).val());
	  if(key.keyCode == 13){
	  	 $.post("longhaul/pos/aftersales/aftersales.ered?reqCode=getMatnrInfo&postType=1",{
		  matnr : matnr
		  },function(data) {
		  	$("#expectimg_id").attr("src","sappic/"+data.zmatnrt);
		  	$("#mf_mold_number").val(data.matnr);
		  },"json");
	  }
  });
  
  $("#kl_stone").click(function(){
	  if($("#kl_stone").attr("checked") == "checked"){
		  $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=getKLCherg&postType=1&random=" + Math.random(), {
		      werks : WERKS
		    }, function(data) {
		    	$.each(data, function(key, val) {
		    		$("#charg").val(val.charg);
		    		$("#charg_prepared").val(val.charg+"A");
		    		$("#charg").attr('readOnly',true);
		    	})
		    }
		  )}else{
			  	$("#charg").val("");
			  	$("#charg_prepared").val("");
	    		$("#charg").attr('readOnly',false);
		  }
	  });
  
  $("#vipname").keydown(function(e){
	  if(e.keyCode == 13){
	  var name1 = $("#vipname").val();
	   if(name1 == ""){
		  return;
	  }
	  $.post("longhaul/pos/aftersales/aftersales.ered?reqCode=getVipInfo&postType=1",{
		  name1 : name1
		  },function(data) {
			  if(data.length == 0){
				  jAlert("您输入的会员姓名不存在！","提示");
			  }else if(data.length == 1){
		  			$.each(data, function(key, val) {
		  				$("#vipid").val(val.hykh);
		  				$("#tel").val(val.sj);
		  				$("#vipname").val(val.hyxm);
			    	})
		  		}else{
		  			var addhtml = "请选择会员卡号<select id='vipkh'>";
		  			$.each(data, function(key, val) {
		  				var option1 = "<option value="+val.hykh+"-"+val.sj+"-"+val.hyxm+">" + val.hykh + "</option>";
		  				addhtml += option1;
			    	})
			    	addhtml += "</select>";
		  			var dialog = $.dialog({
						title:"<b style='color:red'>提示，该会员姓名有多个会员卡号，请选择正确的会员卡号</b>",
						content: addhtml,
			   		 	button: [
			   		        {
			   		            name: '确定',
			   		            callback: function(){
			   		            	var values = ($("#vipkh").val()).toString();
			   		            	var values1 = values.split("-");
			   		            	$("#vipid").val(values1[0]);
			   		            	$("#tel").val(values1[1]);
					  				$("#vipname").val(values1[2]);
			   		            },
			   		            focus: true
			   		        }
			   		    ],
			   		 	close : false,
			   		 	lock : true
			   		 	});
		  			
		  		}
		    	
		    },"json");
	  
	  }
  });
  
  
});

