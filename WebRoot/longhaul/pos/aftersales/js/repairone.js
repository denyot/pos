$(function () {
//切换
	
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
	

  //查询基础信息
  getAfterSSP("ADD");
  getReplacementInfo();
  
    //获取门店
  function getStoresInfo() {
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initStoresInfo&postType=1&werks=" + WERKS, function (data) {
      $.each(data, function (key, val) {
        $("#stores_name").text(val.NAME1);
      });
    });
  }
 //获取售后服务项目
	function getAfterSSP(mode) {
		  $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initAfterSSInfo&postType=1&random=" + Math.random(), {
      werks : WERKS
    }, function(data) {
      $.each(data, function(key, val) {
        //noneselectedtext = mode == "ADD" ? key == 100000 ? val.yyy : noneselectedtext : noneselectedtext; // 默认不需要选择
        //noneselectedtext = mode == "ADD" ? "请选择售后服务项目" : noneselectedtext;
        //selectedadd = mode == "ADD" ? key == 100000 ? "selected" : "" : "";
        //selectededit = mode == "EDIT" ? noneselectedtext.indexOf(val.yyy) > -1 ? "selected" : "" : "";
        //selected = selectedadd == "" ? selectededit : selectedadd;
        $("#after_ss_project_select").append($("<option value=" + val.name + ">" + val.name + "</option>"));
      });
      //multiSelect是一个多选下拉列表框插件
      $("#after_ss_project_select").multiSelect({
        selectAll : false,
        noneSelected : "请选择",
        oneOrMoreSelected : '*'
      }, function(el) {
        //$("#callbackResult").show().fadeOut();
      });
    });
	}
	$('#after_ss_project').change(function() {alert('change'); });
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
	$('#ss_project_confirm').click(function() {      
	  var ss= $("#after_ss_project_select").selectedValuesString();
    $("#after_ss_project").val(ss);
    if(ss=="配件"||ss.indexOf("配件")>1)
      $(".replacement_span").show();
    else{
      $(".replacement_span").hide();
      $("#replacement").attr("value","");
      $("#replacement_cost").attr("value","");
    }
  });
	//获取配件
  function getReplacementInfo() {
    $("#replacement").append("<option value=''>请选择</option>");
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initReplacementInfo&postType=1", function (data) {
      $.each(data, function (key, val) {
        $("#replacement").append($("<option value=" + val.code + "-"+ val.price + ">" + val.name + "</option>"));
      });
    });
  }
  //选择配件设置价格
  $('#replacement').change(function(){
        var str = $(this).children('option:selected').val();//value的值
        var price = str.substr(str.indexOf('-') + 1,str.lenght);
        $("#replacement_cost").val(price);
  });
	
   //form提交
    $("#repairSubmitBtn").click(function() {
	    //数字绑定
      var pass = $("#firstForm").validationEngine('validate');
      if(pass==false){
        return false;
      }
      var ss= $("#after_ss_project_select").selectedValuesString();
      $("#after_ss_project").val(ss);
      if($("#after_ss_project").val()==''){
        jAlert('售后服务项目不能为空', '提示');
        return false;
      }
      if($("#real_goods_weight").val() == ''){
    	  jAlert('实收货品重量不能为空','提示');
    	  return false;
      }
      if($("#accept_people_first").val()==''){
        jAlert('受理人不能为空', '提示');
        return false;
      }
      
      //$("#firstForm").submit();
      var params=$('#firstForm').serialize(); //这里直接就序列化了表单里面的值
       $.ajax({  
               url :'longhaul/pos/aftersales/aftersales.ered?reqCode=saveInfo&postType=1&service_type=1', 
               type:'post',    
               dataType:'json',   
               data:params,    
               error: function(XMLHttpRequest, textStatus, errorThrown){
                  //jAlert('操作错误,请与系统管理员联系!', '提示');
                  window.location.href="longhaul/pos/authorization.jsp";
                },
               success:print//回传函数
        });
        //是否打印
        function print(data){
         if($.trim(data.success) == 'true'){
            //写单号
            $("#service_number").val(data.service_number);
              jConfirm('是否打印!', '操作成功', function(r) {
                 var url = basepath + "longhaul/pos/aftersales/aftersales.ered?reqCode=getServiceInfoById&postType=1&service_type=1&werks=" + WERKS +"&step=detail&whichp=s&service_number="+data.service_number;
                 if(r){
	                 window.open(url);
	                 window.onafterprint=function(){window.close();};
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
		});
    //打印
  $("#showRepairPrint").click(function() {
    var service_number = $("#service_number").val();
    if(service_number == ''){
      jAlert('当前没有可打印的信息，请提交信息后打印!', '提示');
      return false;
    }
    var url = basepath + "longhaul/pos/aftersales/aftersales.ered?reqCode=getServiceInfoById&postType=1&service_type=1&werks=" + WERKS +"&step=detail&whichp=s&service_number="+service_number;
    window.open(url);
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

