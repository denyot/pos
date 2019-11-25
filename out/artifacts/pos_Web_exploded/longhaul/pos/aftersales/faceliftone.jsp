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
<script
			src="resource/jquery/lhgdialog/lhgdialog.min.js?self=true&skin=mac"></script>
    <link rel="stylesheet" href="resource/jquery/themes/base/jquery.ui.all.css">
    <link rel="stylesheet" href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
    <link rel="stylesheet" href="resource/jquery/validate/css/validationEngine.jquery.css" media="screen" />
    <link rel="stylesheet" href="longhaul/pos/aftersales/css/aftersales.css" media="screen">
    <link rel="stylesheet" href="longhaul/pos/aftersales/css/stand.css" media="screen">
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
$(document).ready(function() {
    var service_type = "<%=request.getParameter("service_type")%>";
    if(service_type != ""){
      $("#service_type").val(service_type);
    }
    if(service_type=='3'){
      $("#servicebutton3").attr('class','servicebutton_se');
    }else{
      $("#servicebutton2").attr('class','servicebutton_se');
    }
});
</script>
  </head>
  <body>
    <form id="firstForm" name="firstForm" method="post">
      <table id="repairsystemtable" width="800px" border="1">
        <tr>
          <td colspan="5" align="center">
            <font class="titlehead"><span id="title_span">改款管理</span></font>
          </td>
          </tr>
        <tr>
          <td>
            服务类型：
          </td>
          <td class="inputleft" colspan="4">
            <input type="button" name="service_type_se" realva="1" id="servicebutton1" value="维修" class="servicebutton" />
            <input type="button" name="service_type_se" realva="2" id="servicebutton2" value="改款" class="servicebutton" />
            <input type="button" name="service_type_se" realva="3" id="servicebutton3" value="配对" class="servicebutton" />
          </td>
          </tr>
        <tr>
           <td>
            会员卡号:
          </td>
          <td class="inputleft">
            <input name="member_cardnumber" id="vipid"></input>
          </td>
        
          <td>
            <span class="spanIsCheck">*</span>顾客姓名:
          </td>
          <td class="inputleft">
            <input name="member_name" id="vipname"></input>
          </td>
       
        <td rowspan="3" class="inputleft"><img width="100px" height="80px" id="oldimg_id" /></td>
        </tr>
        <tr>
          <td>
            <span class="spanIsCheck">*</span>电话:
          </td>
          <td class="inputleft">
            <input name="telephone" id="tel"></input>
          </td>
          <td>
            投诉单号:
          </td>
          <td class="inputleft">
            <input name="complaints_number" id="complaints_number"></input>
          </td>
          </tr>
        <tr>
          <td>
            商品批次:
          </td>
          <td class="inputleft">
            <input name="old_commodity_barcode" id="charg"></input>
            <input name="kl_stone" id="kl_stone" type="checkbox"/><span id="kls">客来石</span>
          </td>
          <td>
            <span class="spanIsCheck">*</span> 品名:
          </td>
          <td class="inputleft">
            <input name="trade_name" id="trade_name"></input>
            <input type="hidden" name="product_image" id="product_image" />
          </td>
          </tr>
        <tr>
          <td>
            原货品总重:
          </td>
          <td class="inputleft">
            <input name="old_goods_weight" id="old_goods_weight" />g
          </td>
          <td>
            原货品石料重:
          </td>
          <td class="inputleft">
            <input name="old_stone_weight" id="old_stone_weight" />
            ct
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            原货品证书号:
          </td>
          <td class="inputleft">
            <input name="old_certificate_number" id="old_certificate_number"></input>
          </td>
          <td>
          <span class="spanIsCheck">*</span>
            实收货品重量:
          </td>
          <td class="inputleft">
            <input name="real_goods_weight" id="real_goods_weight" />g
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            裸石证书类型:
          </td>
          <td class="inputleft">
            <input name="luodan_certificate_type" id="luodan_certificate_type" />
          </td>
          <td>
            裸石证书号:
          </td>
          <td class="inputleft">
            <input name="luodan_certificate_number" id="luodan_certificate_number"></input>
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            实收价:
          </td>
          <td class="inputleft">
            <input name="clinch_price" id="clinch_price" />元
          </td>
          <td>
            出售日期:
          </td>
          <td class="inputleft">
            <input name="sell_date" id="sell_date" class="inputreadonly" readonly="readonly" style="background: #f0f0f0"></input>
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            受理日期:
          </td>
          <td class="inputleft">
            <input name="accept_date" id="accept_date" class="inputreadonly" readonly="readonly"
              style="background: #f0f0f0"></input>
          </td>
          <td>
            <span class="spanIsCheck">*</span>预计取货日期:
          </td>
          <td class="inputleft">
            <input name="expected_pickup_date" id="expected_pickup_date" class="inputreadonly" readonly="readonly"
              style="background: #f0f0f0"></input>
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr height="1">
          <td colspan="5" class="abline"></td>
          </tr>
        <tr>
          <td>
            <span>拟定改款批次:</span>
          </td>
          <td class="inputleft">
            <span ><input name=prepared_commodity_barcode id="charg_prepared" readonly="readonly" />
            <input type="hidden" name="expect_picture" id="expect_picture" /></span>
          </td>
           <td>
            <span class="pd_hide">改款后尺寸:</span>
          </td>
          <td class="inputleft">
            <span class="pd_hide"><input name="ring" id="ring" /></span>
          </td>
        <td rowspan="4" class="inputleft"><img width="100px" height="80px" id="expectimg_id" /></td>
        </tr>
        <tr>
          <td>
            <span class="switch_pd_span">改款</span>款式:
          </td>
          <td class="inputleft">
            <select name="facelift_bag" id="facelift_bag" style="width: 150px"></select>
          </td>
          <td>
           拟改款物料号:
          </td>
          <td class="inputleft">
            <input name="mf_mold_number" id="mf_mold_number" value="${map.mf_mold_number}" />
          </td>
          </tr>
        <tr>
          <td>
            金料:
          </td>
          <td class="inputleft">
            <select name="gold_material" id="gold_material" style="width: 150px"></select>
          </td>
          <td>
            <span class="pd_hide">金料损耗:</span>
          </td>
          <td class="inputleft">
            <span class="pd_hide"><input name="gold_material_loss" id="gold_material_loss" class="inputreadonly" readonly="readonly" /></span>
          </td>
          </tr>
        <tr>
          <td>
            金料成色:
          </td>
          <td class="inputleft">
            <select name="gold_material_quality" id="gold_material_quality" style="width: 150px">
            </select>
          </td>
  
          <td>
            <span class="pd_hide">工费:</span>
          </td>
          <td class="inputleft">
            <span class="pd_hide"><input name="mainstone_process_fees" id="mainstone_process_fees" class="inputreadonly" readonly="readonly" />元
            <font class="prompt"><span id="building_span" style="display:none;">免工费</span></font></span>
          </td>
        </tr>
        <!-- 
        <tr>
          <td>
            <span class="switch_pd_span">改款</span>石料:
          </td>
          <td class="inputleft">
            <input name="mf_stone" id="mf_stone" value="${map.mf_stone}" />
          </td>
          <td>
            石料重量:
          </td>
          <td class="inputleft">
            <input name="mf_stone_weight" id="mf_stone_weight" value="${map.mf_stone_weight}" />ct
          </td>
        <td>&nbsp;</td>
        </tr>
         -->
        <tr>
          <td>
            加工费是否免费:
          </td>
          <td class="inputleft">
            <input name="isfree_process_fees" id="isfree_process_fees" value="否" class="inputreadonly" readonly="readonly" />
          </td>
          <td></td>
          <td></td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            是否含副石:
          </td>
          <td class="inputleft">
            <select name="isincluding_vicestone" id="isincluding_vicestone" style="width: 150px"></select>
          </td>
          <td>
            副石石料:
          </td>
          <td class="inputleft">
             <select name="vicestone" id="vicestone" style="width: 150px">
              <option value="无">
                无
              </option>
              <option value="钻石">
                钻石
              </option>
              <option value="锆石">
                锆石
              </option>
            </select>
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            是否做证书:
          </td>
          <td class="inputleft">
            <select name="isdo_certificate" id="isdo_certificate" style="width: 150px"></select>
          </td>
          <td>
            预计费用:
          </td>
          <td class="inputleft">
            <input name="expected_cost" id="expected_cost" />元
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr class="isdo_certificate_tr">
          <td>
            证书类型:
          </td>
          <td class="inputleft">
            <select name="certificate_type" id="certificate_type" style="width: 150px"></select>
          </td>
          <td>
            证书费用:
          </td>
          <td class="inputleft">
            <input name="certificate_cost" id="certificate_cost" class="inputreadonly" readonly="readonly" />元
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            <span class="spanIsCheck">*</span>专柜受理人:
          </td>
          <td class="inputleft">
             <select name="accept_people_first_select" id="accept_people_first_select" 
            multiple="multiple" style="width: 150px">
            </select>
            <input name="accept_people_first" id="accept_people_first" type="hidden"/>
          </td>
          <td>
            备注:
          </td>
          <td class="inputleft">
            <textarea name="remark1" id="remark1"></textarea>
          </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
          <td colspan="5">
            <input type="button" id="faceliftSubmitBtn" value="提交" class="orersystembutton" />
            &nbsp;&nbsp;
            <input type="reset" id="faceliftResetBtn" value="重置" class="orersystembutton" />
            &nbsp;&nbsp;
            <input type="button" id="showRepairPrint" value="打印" class="orersystembutton" />
            <input type="hidden" id="chargtype" name="chargtype" value="charg" checked="checked" disabled="disabled">
            <input type="hidden" id="WERKS" name="WERKS" value="<%=WERKS%>" />
            <input type="hidden" id="opterator" name="opterator" value="<%=opterator%>" />
            <input type="hidden" id="service_number" name="service_number" />
            <input type="hidden" id="service_type" name="service_type" />
            <input type="hidden" id="kunnr" name="kunnr" />
            <input type="hidden" id="building" name="building" />
          </td>
          </tr>
      </table>
    </form>
  </body>
</html>
  <script src="longhaul/pos/aftersales/js/facelift.js">
</script>
    <script src="longhaul/pos/aftersales/js/aftersales.js">
</script>
<script src="longhaul/pos/aftersales/js/binding.js"></script>