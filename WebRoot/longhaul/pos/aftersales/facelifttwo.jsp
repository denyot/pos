<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
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
    <title>售后系统</title>
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
    <script src="longhaul/pos/aftersales/js/facelifttwo.js">
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
var mf_stone_color = "${map.mf_stone_color }";
var mf_stone_clarity = "${map.mf_stone_clarity }";
var mf_stone_format = "${map.mf_stone_format }";
var mf_stone_kind = "${map.mf_stone_kind }";
var factory_repair_result = "${map.factory_repair_result }";
var status = "${map.status }";

var autocompletelength=<%=autocompletewords%>;
		 var autocompletedelay=<%=autocompletesecond%>;
		 var salesorderid = "<%=salesorderid%>";
		 var basepath = "<%=basePath%>";
		 var ordertype="<%=ordertype%>";
		 var posurl="<%=posurl%>";
		 $(document).ready(function(){
		    $( "#to_purchase_date" ).datepicker({
				changeMonth: true,
				changeYear: true
			});
       $( "#dept_receive_date" ).datepicker({
        changeMonth: true,
        changeYear: true
      });
       $( "#factory_receive_date" ).datepicker({
        changeMonth: true,
        changeYear: true
      });
       $( "#factory_expected_ship_date" ).datepicker({
        changeMonth: true,
        changeYear: true
      });
      $( "#mailing_date" ).datepicker({
        changeMonth: true,
        changeYear: true
      });
      $( "#good_recieve_date" ).datepicker({
        changeMonth: true,
        changeYear: true
      });
      
      
		 });
</script>
  </head>
  <body>
 <table width="800px" order="1" align="center">
      <tbody align="left">
      <tr>
          <td>
            门店:${map.store_name }
          </td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
          <tr>
          <td>
            顾客姓名:${map.member_name }
          </td>
          <td>
            会员卡号:${map.member_cardnumber }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            电话:${map.telephone }
          </td>
          <td>
            投诉单号:${map.complaints_number }
          </td>
          <td>&nbsp;</td>
          </tr>
        <tr>
          <td>
            商品批次:${map.old_commodity_barcode }
          </td>
          <td>
            品名:${map.trade_name }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            原货品总重:${map.old_goods_weight }
          </td>
          <td>
            原货品石料重:${map.old_stone_weight } ct
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            原货品证书号:${map.old_certificate_number }
          </td>
        <td>实收货品重量:${map.real_goods_weight }</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            裸石证书类型:${map.luodan_certificate_type }
          </td>
          <td>
            裸石证书号:${map.luodan_certificate_number }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            实收价:${map.clinch_price }
          </td>
          <td>
            出售日期:${map.sell_date }
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            受理日期:${map.accept_date }
          </td>
          <td>
            预计取货日期:${map.expected_pickup_date }
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
             <span class="switch_pd_span">拟定改款</span>批次:${map.prepared_commodity_barcode }
          </td>
           <td>
            <span class="ring_span">尺寸:${map.ring }</span>
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            <span class="switch_pd_span">改款</span>款式:${map.faceliftname }
          </td>
          <td>
            工费:${map.mainstone_process_fees }
          </td>
          <td>&nbsp;</td>
          </tr>
        <tr>
          <td>
            金料:${map.goldname }
          </td>
          <td>
            金料损耗:${map.gold_material_loss }
          </td>
          <td>&nbsp;</td>
          </tr>
        <tr>
          <td>
            金料成色:${map.gold_material_quality }
          </td>
          <td>
            <span class="switch_pd_span">改款</span>模具号:${map.mf_mold_number }
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            加工费是否免费:${map.isfree_process_fees }
          </td>
          <td></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            是否含副石:${map.isincluding_vicestone }
          </td>
          <td>
            副石石料:${map.vicestone }
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            是否做证书:${map.isdo_certificate }
          </td>
          <td>
            预计费用:${map.expected_cost }
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr class="isdo_certificate_tr">
          <td>
            证书类型:${map.cername }
          </td>
          <td>
            证书费用:${map.certificate_cost }
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            专柜受理人:${map.accept_people_first }
          </td>
          <td>
            备注:${map.remark1 }
          </td>
        <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
   <form id="secondForm" name="secondForm" method="post">
      <table id="repairsystemtable" width="800px" border="1" align="center">
        <tr>
          <td colspan="5" align="center">
            <font class="titlehead"><span id="title_span">改款管理</span></font>
          </td>
        </tr>
        <tr>
          <td colspan="5" align="left">
            <font class="numberInfo"> <span class="switch_pd_span">改款</span>单号：${map.service_number } 顾客姓名：${map.member_name } </font>
          </td>
        </tr>
        <tr>
        <td rowspan="5">
            质量部收货
          </td>
          <td>
            质量部收货日期:
          </td>
          <td class="inputleft">
            <input name="dept_receive_date" id="dept_receive_date" value="${map.dept_receive_date }"
              class="inputreadonly" readonly="readonly" style="background: #f0f0f0" />
          </td>
           <td rowspan="3">
            拟定图片:</td>
            <td rowspan="3"  class="inputleft"><img width="100px" height="80px" />
            <input type="hidden" name="expect_picture" id="expect_picture" />
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
       <tr class="trbottom">
         <td>
            原货品金料:
          </td>
          <td class="inputleft">
            <input name="old_gold_type" id="old_gold_type" value="${map.old_gold_type }" />
          </td>
          <td>
            原货品金料重量:
          </td>
          <td class="inputleft">
            <input name="old_gold_weight" id="old_gold_weight" value="${map.old_gold_weight }" />
          </td>
        </tr>
        
        <tr>
          <td>
            采购部收货
          </td>
          <td>
            交采购部日期:
          </td>
          <td class="inputleft">
            <input name="to_purchase_date" id="to_purchase_date" value="${map.to_purchase_date}" class="inputreadonly"
              readonly="readonly" style="background: #f0f0f0" />
          </td>
          <td>
            采购部接收人:
          </td>
          <td class="inputleft">
            <input name="purchase_receive_people" id="purchase_receive_people" value="${map.purchase_receive_people}" />
          </td>
        </tr>
        <tr>
          <td rowspan="2">
            工厂收货
          </td>
          <td>
            加工厂:</td>
            <td class="inputleft">
            <input name="process_factory" id="process_factory" value="${map.process_factory}" />
          </td>
          <td>
            工厂收货人:
          </td>
          <td class="inputleft">
            <input name="factory_receive_people" id="factory_receive_people" value="${map.factory_receive_people}" />
          </td>
        </tr>
        <tr class="trbottom">
         <td>
            工厂收货日期:
          </td>
          <td class="inputleft">
            <input name="factory_receive_date" id="factory_receive_date" class="inputreadonly" readonly="readonly"
              style="background: #f0f0f0" value="${map.factory_receive_date}" />
          </td>
          <td>
            工厂预计出货日期:
          </td>
          <td class="inputleft">
            <input name="factory_expected_ship_date" id="factory_expected_ship_date"
              value="${map.factory_expected_ship_date}" class="inputreadonly" readonly="readonly"
              style="background: #f0f0f0" />
          </td>
        </tr>

        <tr>
          <td rowspan="6">
            工厂出货
          </td>
          <td>
            原货品金重:
          </td>
          <td class="inputleft">
            <input name="old_gold_weight" id="old_gold_weight" value="${map.old_gold_weight}" />g
          </td>
          <td>
            新货品金重:
          </td>
          <td class="inputleft">
            <input name="new_gold_weight" id="new_gold_weight" value="${map.new_gold_weight}" />g
          </td>
        </tr>
        <tr>
          <td>
           原货品金价:</td>
           <td class="inputleft">
            <input name="old_gold_price" id="old_gold_price" value="${map.old_gold_price}" />元/克
          </td> 
          <td>
            新货品金价:
          </td>
          <td class="inputleft">
            <input name="new_gold_price" id="new_gold_price" value="${map.new_gold_price}" />元/克
          </td>
        </tr>
        <tr>
          <td>
            主石料加工费:
          </td>
          <td class="inputleft">
            <input name="mainstone_process_fees" id="mainstone_process_fees" value="${map.mainstone_process_fees}" />元
          </td>
          <td>
            工厂收取副石费用:
          </td>
          <td class="inputleft">
            <input name="vicestone_cost" id="vicestone_cost" value="${map.vicestone_cost}" />元
          </td>
        </tr>
        <tr>
         <td>
            副石数量:
          </td>
          <td class="inputleft">
            <input name="mf_stone_amount" id="mf_stone_amount" value="${map.mf_stone_amount}" />
          </td>
          <td>
            副石料加工费:
          </td>
          <td class="inputleft">
            <input name="total_vicestone_process_fees" id="total_vicestone_process_fees"
              value="${map.total_vicestone_process_fees}" />元
          </td>
        </tr>
        <tr>
          <td>
            起版费:
          </td>
          <td class="inputleft">
            <input name="version_cost" id="version_cost" value="${map.version_cost}" />元
          </td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr class="trbottom">
         <td>
            金料损耗:
          </td>
          <td class="inputleft">
            <input name="gold_material_loss" id="gold_material_loss" value="${map.gold_material_loss}" />
          </td>
          <td>
            <span class="switch_pd_span">改款</span>实际产生金额:
          </td>
          <td class="inputleft">
            <input name="real_facelift_amount" id="real_facelift_amount" value="${map.real_facelift_amount}" />元
            <input type="hidden" name="clinch_price" id="clinch_price" value="${map.clinch_price }" />
            <input type="hidden" id="tempamount" value="${map.real_facelift_amount }" />
          </td>
        </tr>
        <tr>
        
        </tr>
        <!-- 收取顾客费用 -->
        <tr>
          <td rowspan="6">
            收取顾客费用
          </td>
          <td>
            原货品金重:
          </td>
          <td class="inputleft">
            <input name="old_gold_weight_cus" id="old_gold_weight_cus" value="${map.old_gold_weight_cus}" />g
          </td>
          <td>
            新货品金重:
          </td>
          <td class="inputleft">
            <input name="new_gold_weight_cus" id="new_gold_weight_cus" value="${map.new_gold_weight_cus}" />g
          </td>
        </tr>
        <tr>
           <td>
           原货品金价:</td>
           <td class="inputleft">
            <input name="old_gold_price_cus" id="old_gold_price_cus" value="${map.old_gold_price_cus}" />元/克
          </td> 
          <td>
            新货品金价:
          </td>
          <td class="inputleft">
            <input name="new_gold_price_cus" id="new_gold_price_cus" value="${map.new_gold_price_cus}" />元/克
          </td>
        </tr>
        <tr>
          <td>
            主石料加工费:
          </td>
          <td class="inputleft">
            <input name="mainstone_process_fees_cus" id="mainstone_process_fees_cus" value="${map.mainstone_process_fees}" />元
          </td>
          <td>
            收取顾客副石费用:
          </td>
          <td class="inputleft">
            <input name="vicestone_cost_cus" id="vicestone_cost_cus" value="${map.vicestone_cost_cus}" />元
          </td>
        </tr>
        <tr>
           <td>
            副石料加工费:
          </td>
          <td class="inputleft">
            <input name="total_vicestone_process_fees_cus" id="total_vicestone_process_fees_cus"
              value="${map.total_vicestone_process_fees_cus}" />元
          </td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            起版费:
          </td>
          <td class="inputleft">
            <input name="version_cost_cus" id="version_cost_cus" value="${map.version_cost_cus}" />元
          </td>
          <td>
            证书费用:
          </td>
          <td class="inputleft">
            <input name="certificate_cost" id="certificate_cost" value="${map.certificate_cost}" />元
          </td>
        </tr>
        <tr class="trbottom">
        <td>
            金料损耗:
          </td>
          <td class="inputleft">
            <input name="gold_material_loss_cus" id="gold_material_loss_cus" value="${map.gold_material_loss}" />
          </td>
          <td>
             收取顾客费用:
          </td>
          <td class="inputleft">
            <input name="real_repair_amount_cus" id="real_repair_amount_cus" value="${map.real_repair_amount_cus}" />元
          </td>
        </tr>
        <tr>
          <td id="detect_td" rowspan="8">
            质量部检测
          </td>
        </tr>
        <tr>
         <td>
            服务类型:
          </td>
          <td class="inputleft">
            <input value="${map.servicename }" class="inputreadonly" readonly="readonly" />
            <input type="hidden" id="service_type" value="${map.service_type }" />
          </td>
          <td>
           <span class="switch_pd_span">改款</span>后新批次:
          </td>
          <td class="inputleft">
            <input name="prepared_commodity_barcode" id="prepared_commodity_barcode" value="${map.prepared_commodity_barcode }" readonly="readonly" />
          </td>
        </tr>
        <tr>
          <td>
            <span class="switch_pd_span">改款</span>后物料号:
          </td>
          <td class="inputleft">
            <input name="mf_mold_number" id="mf_mold_number" value="${map.mf_mold_number}" />
          </td>
          <td>
            <span class="switch_pd_span">改款</span>金料:
          </td>
          <td class="inputleft">
            <input id="mf_gold_material" value="${map.goldname}"  class="inputreadonly" readonly="readonly" />
          </td>
        </tr>
        <tr>
          <td>
            石料种类:
          </td>
          <td class="inputleft">
            <select name="mf_stone_kind" id="mf_stone_kind" style="width: 150px"></select>
          </td>
          <td>
            石料颜色:
          </td>
          <td class="inputleft">
            <select name="mf_stone_color" id="mf_stone_color" style="width: 150px"></select>
          </td>
        </tr>
        <tr>
          <td>
            石料规格:
          </td>
          <td class="inputleft">
          	<select name="mf_stone_format" id="mf_stone_format" ></select>
            <!-- <input name="mf_stone_format" id="mf_stone_format" value="${map.mf_stone_format}" /> -->
          </td>
          <td>
            石料净度:
          </td>
          <td class="inputleft">
            <select name="mf_stone_clarity" id="mf_stone_clarity" style="width: 150px" value="${map.mf_stone_clarity}" />
          </td>
        </tr>
        <tr>
          <td>
          货品返回日期
          </td>
          <td  class="inputleft"> 
          	<span class="good_recieve_date_span">
          	<input name="good_recieve_date" id="good_recieve_date" value="${map.good_recieve_date }" class="inputreadonly"
              readonly="readonly" style="background: #f0f0f0" />
			</span>
          </td>
          
          <td>
            <span class="new_good_weight_span">改款后货品重量:</span>
          </td>
          <td class="inputleft">
            <span class="new_good_weight_span"><input name="new_good_weight" id="new_good_weight" value="${map.new_good_weight}" /></span>
          </td>
        </tr>
        <tr>
            <td>
              &nbsp;<span class="facelift_ring_span">改款后尺寸: </span>
            </td>
            <td class="inputleft">
              <span class="facelift_ring_span"><input name="ring" id="ring" value="${map.ring}"  class="inputreadonly" />
              </span>
            </td>
             <td>
            <span class="new_certificate_number_span">改款后证书号:</span>
          </td>
          <td class="inputleft">
            <span class="new_certificate_number_span"><input name="new_certificate_number" id="new_certificate_number" value="${map.new_certificate_number}" /></span>
          </td>
           <!--  <td>
              <span class="new_commodity_barcode_span"> 改款后新批次:</span>
            </td>
            <td class="inputleft" class="inputreadonly" readonly="readonly">
              <span class="new_commodity_barcode_span"><input name="new_commodity_barcode" id="new_commodity_barcode" value="${map.new_commodity_barcode}" /></span>
          </td> -->
        </tr>
        <tr>
          <td>
            工厂维修结果:
          </td>
          <td class="inputleft">
            <select name="factory_repair_result" id="factory_repair_result" style="width: 150px">
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
            <span class="failed_reason_span">不合格原因说明:</span>
          </td>
          <td class="inputleft">
            <span class="failed_reason_span"><input name=failed_reason id="failed_reason" /></span>
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
            状态:
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
            <input name="accept_people_second" id="accept_people_second" value="${map.accept_people_second }" type="hidden"/>
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
            <input type="button" id="faceliftSubmitBtn" value="提交" class="orersystembutton" />
            &nbsp;&nbsp;
            <input type="reset" id="faceliftResetBtn" value="重置" class="orersystembutton" />
            &nbsp;&nbsp;
            <!-- <input type="button" id="showFactoryPrint" value="打印给工厂" class="orersystembutton" /> -->
            <!-- <input type="button" id="showStockPrint" value="打印给采购" class="orersystembutton" /> -->
            <input type="hidden" id="chargtype" name="chargtype" value="charg" checked="checked" disabled="disabled">
            <input type="hidden" id="WERKS" name="WERKS" value="<%=WERKS%>" />
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