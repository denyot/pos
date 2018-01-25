<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
    String WERKS = (String) request.getAttribute("WERKS");
    WERKS = WERKS == null || WERKS.equals("") ? "01DL" : WERKS;
    String opterator = (String) request.getAttribute("userid");
    opterator = opterator == null || opterator.equals("") ? "CHJ" : opterator;
    opterator = opterator.toUpperCase();
    String salesorderid = (String) request.getAttribute("salesorderid");
    salesorderid = salesorderid == null || salesorderid.equals("") ? "" : salesorderid;
    String opmode = (String) request.getAttribute("opmode");
    opmode = opmode == null || opmode.equals("") ? "ADD" : opmode;
    String ordertype = (String) request.getAttribute("ordertype");
    ordertype = ordertype == null || ordertype.equals("") ? "" : ordertype;
    String autocompletesecond = (String) request.getAttribute("autocompletesecond");
    String autocompletewords = (String) request.getAttribute("autocompletewords");
    autocompletesecond = autocompletesecond == null || autocompletesecond.equals("") ? "4000"
            : autocompletesecond;
    autocompletewords = autocompletewords == null || autocompletewords.equals("") ? "4" : autocompletewords;
    String posurl = (String) request.getAttribute("posurl");
    posurl = posurl == null || posurl.equals("") ? "192.168.0.119" : posurl;
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
  $( "#receive_date" ).datepicker({
  	changeMonth: true,
  	changeYear: true
  });
  if($("#accept_date").val()==""){
    $("#receive_date" ).datepicker('setDate', new Date());
  }
  $( "#factory_receive_date" ).datepicker({
    changeMonth: true,
    changeYear: true
  });
  $( "#factory_expected_ship_date" ).datepicker({
    changeMonth: true,
    changeYear: true
  });
  $( "#dept_receive_date" ).datepicker({
    changeMonth: true,
    changeYear: true
  });
  $( "#mailing_date" ).datepicker({
    changeMonth: true,
    changeYear: true
  });
  $("#charg").attr("disabled",true);
  $("#kunnr").focus();
  $('#loss_rate').val((($('#real_goods_weight').val() - 0)*0.05).toFixed(2));
});
//计算总价格
function pricesum() {
  var repair_charges = Number($('#repair_charges').val());
  var canadian_gold = Number($('#canadian_gold').val());
  var gole_price = Number($('#gole_price').val());
  var stone_costs = Number($('#stone_costs').val());
  var stone_process_fees = Number($('#stone_process_fees').val());
  var replacement_cost = Number($('#replacement_cost').val());
  var r_factory_loss = Number($('#r_factory_loss').val());
  var total = repair_charges + (canadian_gold * gole_price * r_factory_loss) + stone_costs + stone_process_fees + replacement_cost;
  $('#real_repair_amount').val(Number(total).toFixed(2));
}
//计算客户总价格
function cuspricesum() {
  var repair_charges_cus = Number($('#repair_charges_cus').val());
  var canadian_gold_cus = Number($('#canadian_gold_cus').val());
  var gole_price_cus = Number($('#gole_price_cus').val());
  var stone_costs_cus = Number($('#stone_costs_cus').val());
  var stone_process_fees_cus = Number($('#stone_process_fees_cus').val());
  var replacement_cost_cus = Number($('#replacement_cost_cus').val());
  var r_cus_price_loss = Number($('#r_cus_price_loss').val());
  var total_cus = repair_charges_cus + (canadian_gold_cus * gole_price_cus * r_cus_price_loss) + stone_costs_cus + stone_process_fees_cus + replacement_cost_cus;
  $('#real_repair_amount_cus').val(Number(total_cus).toFixed(2));
}
//计算损耗值,损耗率
function countloss(){
  var weigh = Number($('#real_goods_weight').val()) - 0;
  var repair_after_weight = Number($('#repair_after_weight').val()) - 0;
  $('#loss_value').val((weigh-repair_after_weight).toFixed(2));
  $('#loss_rate').val((weigh*0.05).toFixed(2));
}
</script>
  </head>
  <body>
    <table width="800px" border="1" align="center">
      <tbody align="left">
        <tr>
          <td colspan="3" align="center">
            <font class="titlehead"> 门店录入信息 </font>
          </td>
        </tr>
         <tr>
          <td>
            顾客姓名:
            ${map.member_name }
          </td>
          <td>
            会员卡号:
            ${map.member_cardnumber }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            电话:
            ${map.telephone }
          </td>
          <td>
            投诉单号:
            ${map.complaints_number }
          </td>
          <td>&nbsp;</td>
        </tr>
          <tr>
          <td>
            商品批次:
            ${map.old_commodity_barcode }
          </td>
          <td>
            品名:
            <input type="hidden" name="product_image" id="product_image" />
            ${map.trade_name }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
           原货品总重:
            ${map.old_goods_weight } g
          </td>
          <td>
            石料重量:
            ${map.old_stone_weight } ct
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            实收价:
            ${map.clinch_price } 元
          </td>
          <td>
            出售日期:
            ${map.sell_date }
          </td>
           <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            实收货品重量:
            ${map.real_goods_weight } g
          </td>
          <td>&nbsp;
          </td>
           <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            受理日期:
              ${map.accept_date }
          </td>
          <td>
            预计取货日期:
              ${map.expected_pickup_date }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            售后服务项目:
            ${map.after_ss_project }
          </td>
          <td>
            维修次数:
            ${map.repair_count }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr class="replacement_span" style="display:none">
          <td>
            配件:
            ${map.replacement }
          </td>
          <td>
            配件价格:
            ${map.replacement_cost } 元
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            金料损耗比率%:
            ${map.gold_loss_ratio }
          </td>
          <td>
            顾客特别要求:
            ${map.cus_requirement }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            商场维修费用:
            ${map.store_repair_costs } 元
          </td>
          <td>
            预计维修费用:
            ${map.expected_repair_costs } 元
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            专柜受理人:
            ${map.accept_people_first }
          </td>
          <td>
            备注:
            ${map.remark1 }
          </td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
    <form id="secondForm" name="secondForm" method="post">
      <table id="repairsystemtable" width="800px" border="1" align="center">
        <tr>
          <td colspan="5" align="center">
            <font class="titlehead"> 维修管理 </font>
          </td>
        </tr>
        <tr>
          <td colspan="5" align="left">
            <font class="numberInfo"> 维修单号：${map.service_number } 顾客姓名：${map.member_name } </font>
          </td>
        </tr>
        <tr>
          <td rowspan="4">
            质量部收货
          </td>
          <td>
            质量部收货日期:
          </td>
          <td class="inputleft">
            <input name="receive_date" id="receive_date" value="${map.receive_date }" class="inputreadonly"
              readonly="readonly" style="background: #f0f0f0" />
          </td>
           <td rowspan="3">
            图片:</td>
          <td rowspan="3" class="inputleft">
            <!-- img src="sappic/${map.product_image }" width="100px" height="80px" /> -->
            <img src="sappic/${map.charg_image }" width="100px" height="80px" />
          </td>
        </tr>
        <tr>
          <td>
            货品外观:
          </td>
          <td class="inputleft">
            <input name="goods_outward" value="${map.goods_outward }" />
          </td>
        </tr>
        <tr>
         <td>
           货品重量:
          </td>
          <td class="inputleft">
            <input name="real_goods_weight" id="real_goods_weight" value="${map.real_goods_weight }" />g
          </td>
        </tr>
        <tr>
         <td>
            石料重量:
          </td>
          <td class="inputleft">
            <input name="old_stone_weight" id="old_stone_weight" value="${map.old_stone_weight }" />ct
          </td>
           <td>
            石料检测:
          </td>
          <td class="inputleft">
            <input name="stone_detection" id="stone_detection" value="${map.stone_detection }" />
          </td>
        </tr>
        <tr>
          <td rowspan="2">
            工厂收货
          </td>
            <td>
            维修工厂:</td>
            <td class="inputleft">
            <input name="process_factory" id="process_factory" value="${map.process_factory}" />
          </td>
          <td>
            工厂收货日期:
          </td>
          <td class="inputleft">
            <input name="factory_receive_date" id="factory_receive_date" value="${map.factory_receive_date }"
              class="inputreadonly" readonly="readonly" style="background: #f0f0f0" />
          </td>
        </tr>
        <tr>
          <td>
            工厂收货人:
          </td>
          <td class="inputleft">
            <input name="factory_receive_people" id="factory_receive_people" value="${map.factory_receive_people }" />
          </td>
          <td>
            工厂预计出货日期:
          </td>
          <td class="inputleft">
            <input name="factory_expected_ship_date" id="factory_expected_ship_date"
              value="${map.factory_expected_ship_date }" class="inputreadonly" readonly="readonly"
              style="background: #f0f0f0" />
          </td>
        </tr>
        <tr>
          <td rowspan="4">
            工厂出货
          </td>
          <td>
            维修工费:
          </td>
          <td class="inputleft">
            <input name="repair_charges" id="repair_charges" value="${map.repair_charges }" />元
          </td>
          <td>
            加金:
          </td>
          <td class="inputleft">
            <input name="canadian_gold" id="canadian_gold" value="${map.canadian_gold }" />g
          </td>
        </tr>
        <tr>
          <td>
            金价:
          </td>
          <td class="inputleft">
            <input name="gole_price" id="gole_price" value="${map.gole_price }" />元/克
          </td>
          <td>
            石料费用:
          </td>
          <td class="inputleft">
            <input name="stone_costs" id="stone_costs" value="${map.stone_costs }" />元
          </td>
        </tr>
        <tr>
          <td>
            石料加工费:
          </td>
          <td class="inputleft">
            <input name="stone_process_fees" id="stone_process_fees" value="${map.stone_process_fees }" />元
          </td>
          <td>
            配件费用:
          </td>
          <td class="inputleft">
            <input name="replacement_cost" id="replacement_cost" value="${map.replacement_cost }" />元
          </td>
        </tr>
        <tr>
          <td>
            维修实际产生金额:
          </td>
          <td class="inputleft">
            <input name="real_repair_amount" id="real_repair_amount" value="${map.real_repair_amount }"
              class="inputreadonly" readonly="readonly" />元
          </td>
          <td>
            损耗值:
          </td>
          <td class="inputleft">
            <input name="r_factory_loss" id="r_factory_loss" value="${map.r_factory_loss }"/>
          </td>
        </tr>
        <!-- 收取顾客费用 -->
         <tr>
          <td rowspan="4">
            收取顾客费用
          </td>
          <td>
            维修工费:
          </td>
          <td class="inputleft">
            <input name="repair_charges_cus" id="repair_charges_cus" value="${map.repair_charges_cus }" />元
          </td>
          <td>
            加金:
          </td>
          <td class="inputleft">
            <input name="canadian_gold_cus" id="canadian_gold_cus" value="${map.canadian_gold_cus }" />g
          </td>
        </tr>
        <tr>
          <td>
            金价:
          </td>
          <td class="inputleft">
            <input name="gole_price_cus" id="gole_price_cus" value="${map.gole_price_cus }" />元/克
          </td>
          <td>
            石料费用:
          </td>
          <td class="inputleft">
            <input name="stone_costs_cus" id="stone_costs_cus" value="${map.stone_costs_cus }" />元
          </td>
        </tr>
        <tr>
          <td>
            石料加工费:
          </td>
          <td class="inputleft">
            <input name="stone_process_fees_cus" id="stone_process_fees_cus" value="${map.stone_process_fees_cus }" />元
          </td>
          <td>
            配件费用:
          </td>
          <td class="inputleft">
            <input name="replacement_cost_cus" id="replacement_cost_cus" value="${map.replacement_cost_cus }" />元
          </td>
        </tr>
        <tr>
          <td>
            收取顾客费用:
          </td>
          <td class="inputleft">
            <input name="real_repair_amount_cus" id="real_repair_amount_cus" value="${map.real_repair_amount_cus }"
              class="inputreadonly" readonly="readonly" />元
          </td>
          <td>
            损耗值:
          </td>
          <td class="inputleft">
            <input name="r_cus_price_loss" id="r_cus_price_loss" value="${map.r_cus_price_loss }" />
          </td>
        </tr>

        <tr>
          <td rowspan="4">
            质量部检测
          </td>
          <td>
            质量部收货日期:
          </td>
          <td class="inputleft">
            <input name="dept_receive_date" id="dept_receive_date" value="${map.dept_receive_date }"
              class="inputreadonly" readonly="readonly" style="background: #f0f0f0" />
          </td>
          <td>
            维修后重量:
          </td>
          <td class="inputleft">
            <input name="repair_after_weight" id="repair_after_weight" value="${map.repair_after_weight }" />g
          </td>
        </tr>

        <tr>
          <td>
            损耗值:
          </td>
          <td class="inputleft">
            <input name="loss_value" id="loss_value" value="${map.loss_value }" />
          </td>
          <td>
            损耗率%:
          </td>
          <td class="inputleft">
            <input name="loss_rate" id="loss_rate" value="${map.loss_rate }" />
          </td>
        </tr>
        <!--  class="failed_reason_tr" id="failed_reason_tr" -->
        <tr>
          <td>
            工厂维修结果:
          </td>
          <td class="inputleft">
            <select name="factory_repair_result" id="factory_repair_result" style="width: 150px">
             <c:if test="1==2">
               <option value="${map.factory_repair_result}">
                  ${map.factory_repair_result}
                </option>
              </c:if>
              <option value="">
                   请选择
              </option>
              <option value="合格">
                合格
              </option>
              <option value="不合格">
                不合格
              </option>
            </select>
          </td>
           <td>
            <span class="failed_reason_span">不合格原因:</span>
          </td>
          <td class="inputleft">
            <span class="failed_reason_span"><input name="failed_reason" id="failed_reason" value="" /></span>
          </td>
        </tr>
        <tr>
          <td>
            工厂返修次数:
          </td>
          <td class="inputleft">
            <input name="factory_repair_number" id="factory_repair_number" value="${map.factory_repair_number }"
              class="inputreadonly" readonly="readonly" />
          </td>
          <td>
            &nbsp;
          </td>
          <td>
            &nbsp;
          </td>
        </tr>

        <tr>
          <td>
            &nbsp;
          </td>
          <td>
            邮寄日期:
          </td>
          <td class="inputleft">
            <input name="mailing_date" id="mailing_date" value="${map.mailing_date }" class="inputreadonly"
              readonly="readonly" style="background: #f0f0f0" />
          </td>
         <td>
            货品状态:
          </td>
          <td class="inputleft">
            <select name="status" id="status" style="width: 150px">
              <option value="">
                请选择
              </option>
              <option value="6">
                邮寄
              </option>
              <option value="2">
                关闭
              </option>
              <option value="3">
                送厂
              </option>
              <option value="4">
                合格
              </option>
              <option value="5">
                返修
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            &nbsp;
          </td>
            <td>
            受理人:
          </td>
          <td class="inputleft">
            <select name="accept_people_second_select" id="accept_people_second_select" 
            multiple="multiple" style="width: 200px">
            </select>
            <input name="accept_people_second" id="accept_people_second" type="hidden" value="${map.accept_people_second }"/>
          </td>
          <td>
            注意事项:
          </td>
         <td class="inputleft">
            <textarea name="remark2" id="remark2">${map.remark2 }</textarea>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <input type="button" id="repairSubmitBtn" value="提交" class="orersystembutton" />
            &nbsp;&nbsp;
            <input type="reset" id="repairResetBtn" value="重置" class="orersystembutton" />
            <input type="hidden" id="service_number" name="service_number"
              value="<%=request.getParameter("service_number")%>" />
            <input type="hidden" id="opterator" name="opterator" value="<%=opterator%>" />
          </td>
        </tr>
      </table>
    </form>
  </body>
</html>
<script type="text/javascript">
$(function () {
    //绑定事件
    $('#repair_charges').bind("keyup",function(){pricesum();});
    $('#canadian_gold').bind("keyup",function(){pricesum();});
    $('#gole_price').bind("keyup",function(){pricesum();});
    $('#stone_costs').bind("keyup",function(){pricesum();});
    $('#stone_process_fees').bind("keyup",function(){pricesum();});
    $('#replacement_cost').bind("keyup",function(){pricesum();});
    $('#r_factory_loss').bind("keyup",function(){pricesum();});
    
    $('#repair_charges_cus').bind("keyup",function(){cuspricesum();});
    $('#canadian_gold_cus').bind("keyup",function(){cuspricesum();});
    $('#gole_price_cus').bind("keyup",function(){cuspricesum();});
    $('#stone_costs_cus').bind("keyup",function(){cuspricesum();});
    $('#stone_process_fees_cus').bind("keyup",function(){cuspricesum();});
    $('#replacement_cost_cus').bind("keyup",function(){cuspricesum();});
    $('#r_cus_price_loss').bind("keyup",function(){cuspricesum();});
    $('#repair_after_weight').bind("keyup",function(){countloss();});//维修后称重
  //获取质量部人员信息
  var selectman=$('#accept_people_second').val();
  getQPerson(selectman,"EDIT");
  function getQPerson(noneselectedtext, mode) {
    $.getJSON("longhaul/pos/aftersales/aftersales.ered?reqCode=initQualityInfo&postType=1&random=" + Math.random(), {
      werks : WERKS
    }, function(data) {
      $.each(data, function(key, val) {
        //salemanconf = salemanconf + 1;
        noneselectedtext = mode == "ADD" ? key == 100000 ? val.name : noneselectedtext : noneselectedtext; // 默认不需要选择
        noneselectedtext = mode == "ADD" ? "请选择受理人" : noneselectedtext;
        selectedadd = mode == "ADD" ? key == 100000 ? "selected" : "" : "";
        selectededit = mode == "EDIT" ? noneselectedtext.indexOf(val.name) > -1 ? "selected" : "" : "";
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
    //form提交
   $("#repairSubmitBtn").click(function() {
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
               url :'longhaul/pos/aftersales/aftersales.ered?reqCode=updateInfo&postType=1&service_type=1&step=2', 
               type:'post',    
               dataType:'json',   
               data:params,    
               error: function(XMLHttpRequest, textStatus, errorThrown){
                  jAlert('出现错误，保存失败!', '提示');
                  //window.location.href="longhaul/pos/authorization.jsp";
                },
               success:function(data){
                 jAlert('保存成功', '提示');
               }//回传函数
        });
    });
    
    loadFailedRecord();
    function loadFailedRecord(){
    var _service_number = $("#service_number").val();
    if(_service_number!=""){
        $.getJSON(
        "longhaul/pos/aftersales/aftersales.ered?reqCode=getFailedReason&postType=1&random="
            + Math.random(), {
          werks : WERKS,
          service_number : _service_number,
          after_type : 1
        }, function(data) {
          if (data == "") {
            //jAlert('无数据存在!', '提示', function(r) { });
            return;
          }
          $.each(data, function(key, val) {
            stylcss = key % 2 == 0 ? "failed_reason_tr" : "failed_reason_tr";
            row = "<tr>";
            var factory_receive_date = val.factory_receive_date == null? "&nbsp;": val.factory_receive_date;
            row = row + "<td>返修记录"+(key+1)+"</td><td>工厂收货日期:</td><td class='inputleft'>" + factory_receive_date + "</td>";
            var failed_reason = val.failed_reason == null? "&nbsp;": val.failed_reason;
            row = row + "<td>不合格原因:</td><td class='inputleft'>" + val.failed_reason + "</td>";
            row = row + "</tr>"
            //$(row).insertRow($("#failed_reason_tr :eq(" + key + ")"));
            $("#repairsystemtable tr:eq(19)").after(row);
          });
        });
      }
    }
     //选择工厂维修结果
    resultLinkage();
    function resultLinkage(){
      var re = $("#factory_repair_result").val();
      if(re=='合格' || re==''){
        $('.failed_reason_span').hide();
      }else if(re=='不合格'){
        $('.failed_reason_span').show();
      }
    }
   $('#factory_repair_result').change(function(){
        resultLinkage();
    });
});
</script>
<script src="longhaul/pos/aftersales/js/binding.js"></script>
