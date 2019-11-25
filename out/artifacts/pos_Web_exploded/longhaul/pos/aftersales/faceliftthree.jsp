<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String WERKS = (String) request.getAttribute("WERKS");
	WERKS = WERKS == null || WERKS.equals("") ? "01DL" : WERKS;
	String opterator = (String) request.getAttribute("userid");
	opterator = opterator == null || opterator.equals("") ? "CHJ"
			: opterator;
	opterator = opterator.toUpperCase();
	String salesorderid = (String) request.getAttribute("salesorderid");
	salesorderid = salesorderid == null || salesorderid.equals("") ? ""
			: salesorderid;
	String opmode = (String) request.getAttribute("opmode");
	opmode = opmode == null || opmode.equals("") ? "ADD" : opmode;
	String ordertype = (String) request.getAttribute("ordertype");
	ordertype = ordertype == null || ordertype.equals("") ? ""
			: ordertype;
	String autocompletesecond = (String) request
			.getAttribute("autocompletesecond");
	String autocompletewords = (String) request
			.getAttribute("autocompletewords");
	autocompletesecond = autocompletesecond == null
			|| autocompletesecond.equals("") ? "4000"
			: autocompletesecond;
	autocompletewords = autocompletewords == null
			|| autocompletewords.equals("") ? "4" : autocompletewords;
	String posurl = (String) request.getAttribute("posurl");
	posurl = posurl == null || posurl.equals("") ? "192.168.0.119"
			: posurl;
%>
<html>
  <head>
    <meta charset="utf-8">
    <base href="<%=basePath%>">
    <title>维修系统</title>
    <script src="resource/jquery/jquery-1.7.2.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.core.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.widget.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.position.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.autocomplete.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.datepicker.js">
</script>
    <script src="resource/jquery/ui/i18n/jquery.ui.datepicker-zh-CN.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.mouse.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.button.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.draggable.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.resizable.js">
</script>
    <script src="resource/jquery/ui/jquery.ui.dialog.js">
</script>
    <script src="resource/jquery/external/jquery.bgiframe-2.1.2.js">
</script>
    <script src="resource/jquery/jquery.alerts-1.1/jquery.alerts.js">
</script>
    <script src="resource/jquery/jquery-easyui-1.2.6/plugins/jquery.form.js">
</script>
    <script src="resource/jquery/validate/jquery.validationEngine.js">
</script>
    <script src="resource/jquery/validate/jquery.validationEngine-zh_CN.js">
</script>
    <script src="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.js" type="text/javascript">
</script>
    <script src="resource/jquery/jquery-cookie/jquery.cookie.js" type="text/javascript">
</script>
    <link href="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.css" rel="stylesheet" type="text/css" />
    <script src="longhaul/pos/order/js/orderdate.js">
</script>
    <link rel="stylesheet" href="resource/jquery/themes/base/jquery.ui.all.css">
    <link rel="stylesheet" href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
    <link rel="stylesheet" href="resource/jquery/validate/css/validationEngine.jquery.css" media="screen" />
    <link rel="stylesheet" href="longhaul/pos/aftersales/css/aftersales.css" media="screen">
    <style>
.ui-autocomplete-loading {
	background: white
		url('resource/jquery/ui/images/ui-anim_basic_16x16.gif') right center
		no-repeat;
	td {text-align: right;
}
</style>
    <script type="text/javascript">
var WERKS = "<%=WERKS%>";
var opterator = "<%=opterator%>";
var chargimgpath = "http://<%=posurl%>/sappic/";
var opmode = "<%=opmode%>";
var werkssaleflag = "";
var autocompletelength=<%=autocompletewords%>;
		 var autocompletedelay=<%=autocompletesecond%>;
		 var salesorderid = "<%=salesorderid%>";
		 var basepath = "<%=basePath%>";
		 var ordertype="<%=ordertype%>";
		 var posurl="<%=posurl%>";
		 $(document).ready(function(){
		    $( "#to_cabinet_date" ).datepicker({
  				changeMonth: true,
  				changeYear: true
			  });
        $( "#customer_pickup_date" ).datepicker({
          changeMonth: true,
          changeYear: true
        });
		    $("#charg").attr("disabled",true);
		    $("#kunnr").focus();
		 });
</script>
  </head>
  <body>
    <form id="thirdForm" name="thirdForm" method="post">
      <table width="800px" border="1" align="center">
        <tr>
          <td colspan="4" align="center">
            <font class="titlehead"> 改款管理 </font>
          </td>
        </tr>
        <td colspan="4" align="left">
          <font class="numberInfo"> 改款单号：${map.service_number } 顾客姓名：${map.member_name } </font>
        </td>
        <tr>
          <td>
            到柜日期:</td>
          <td class="inputleft">
            <input name="to_cabinet_date" id="to_cabinet_date" class="inputreadonly" readonly="readonly"
              style="background: #f0f0f0" value="${map.to_cabinet_date }" />
          </td>
           <td>
           工作联系单号:</td>
          <td class="inputleft">
            <input name="link_number" id="link_number" value="${map.link_number }" />
          </td>
        </tr>
        <tr>
          <td>
            满意度反馈:</td>
          <td class="inputleft">
            <select name="satisfaction" id="satisfaction" style="width: 150px">
              <option value="满意">
                满意
              </option>
              <option value="不满意">
                不满意
              </option>
            </select>
          </td>
          <!-- id="not_satisfied_reason_td" -->
          <td>不满意原因:</td>
          <td class="inputleft">
            <input name="not_satisfied_reason" id="not_satisfied_reason" value="${map.not_satisfied_reason }" />
          </td>
        </tr>
         <tr>
          <td>
            应收金额:</td>
          <td class="inputleft">
            <input value="${map.real_facelift_amount_cus }" class="inputreadonly" readonly="readonly" />元
          </td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
        </tr>
         <tr>
          <td>
           实收顾客金额:</td>
          <td class="inputleft">
            <input name="real_customer_amount" id="real_customer_amount" value="${map.real_customer_amount }" />元
          </td>
          <td>
           顾客取货日期:</td>
          <td class="inputleft">
            <input name="customer_pickup_date" id="customer_pickup_date" value="${map.customer_pickup_date }"
              class="inputreadonly" readonly="readonly" style="background: #f0f0f0" />
          </td>
        </tr>
        <tr>
          <td>
            状态:</td>
          <td class="inputleft">
            <select name="status" id="status" style="width: 150px">
              <option value="7">
                门店接收
              </option>
              <option value="8">
                顾客取货
              </option>
              <option value="9">
                不满意
              </option>
            </select>
          </td>
           <td>
            受理人:
          </td>
          <td class="inputleft">
             <select name="accept_people_third_select" id="accept_people_third_select" 
            multiple="multiple" style="width: 200px">
            </select>
            <input name="accept_people_third" id="accept_people_third" type="hidden"/>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <input type="button" id="faceliftSubmitBtn" value="提交" class="orersystembutton" />
            &nbsp;&nbsp;
            <input type=reset id="faceliftResetBtn" value="重置" class="orersystembutton" />
            <input type="hidden" id="opterator" name="opterator" value="<%=opterator%>" />
            <input type="hidden" id="service_number" name="service_number"
              value="<%=request.getParameter("service_number")%>" />
          </td>
        </tr>
      </table>
    </form>
  </body>
</html>
<script src="longhaul/pos/aftersales/js/binding.js"></script>
<script type="text/javascript">
$(function () {
   //选择满意度
    satisfiedLinkage();
    function satisfiedLinkage(){
      var re = $("#satisfaction").val();
      if(re=='满意'){
        $('#not_satisfied_reason_td').css('display','none');
      }else if(re=='不满意'){
        $('#not_satisfied_reason_td').css('display','block');
      }
    }
   $('#satisfaction').change(function(){
        satisfiedLinkage();
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
        $("#accept_people_third_select").append($("<option value=" + val.assistant_name + " " + selected + ">" + val.assistant_name + "</option>"));
      });
      $("#accept_people_third_select").multiSelect({
        selectAll : false,
        noneSelected : noneselectedtext,
        oneOrMoreSelected : '*'
      }, function(el) {
        var ac= $("#accept_people_third_select").selectedValuesString();
        $("#accept_people_third").val(ac);
        // $("#callbackResult").show().fadeOut();
      });
    });
  }
    $("#faceliftSubmitBtn").click(function() {
       var pass = $("#thirdForm").validationEngine('validate');
         if(pass==false){
           return false;
       }
       if($("#accept_people_third").val()==''){
        jAlert('受理人不能为空', '提示');
        return false;
      }
       var params=$('#thirdForm').serialize();
       $.ajax({  
               url :'longhaul/pos/aftersales/aftersales.ered?reqCode=updateInfo&postType=1&service_type=2&step=storeConfirm', 
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
});
</script>