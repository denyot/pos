<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
    String WERKS = (String) request.getAttribute("WERKS");
    WERKS = WERKS == null || WERKS.equals("") ? "01SZ" : WERKS;
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
    <script src="longhaul/pos/aftersales/js/repairone.js"></script>
   <script src="longhaul/pos/aftersales/js/aftersales.js"></script>
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

textarea {
	resize: none;
}
.validate_hidden { position:absolute; height:0; width:0; border:0; }
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
</script>
  </head>
  <body>
    <form id="firstForm" name="firstForm" method="post">
      <table id="repairsystemtable" width="800px" border="1">
        <tr>
          <td colspan="5" align="center">
            <font class="titlehead"> 维修管理 </font>
          </td>
        </tr>
        <tr>
          <td>
            服务类型：
          </td>
          <td class="inputleft" colspan="4">
           <input type="button" name="service_type_se" realva="1" id="servicebutton1" value="维修" class="servicebutton_se" />
           <input type="button" name="service_type_se" realva="2" id="servicebutton2" value="改款" class="servicebutton" />
           <input type="button" name="service_type_se" realva="3" id="servicebutton3" value="配对" class="servicebutton" />
          </td>
        </tr>
        <tr>
           <td>
            会员卡号:
          </td>
          <td class="inputleft">
            <input name="member_cardnumber" id="vipid" />
          </td>
          <td>
            <span class="spanIsCheck">*</span>顾客姓名:
          </td>
          <td class="inputleft">
            <input name="member_name" id="vipname" />
          </td>
       
          <td rowspan="3" class="inputleft"><img width="100px" height="80px" /></td>
        </tr>
        <tr>
          <td>
          <span class="spanIsCheck">*</span>
            电话:
          </td>
          <td class="inputleft">
            <input name="telephone" id="tel" />
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
          </td>
          <td>
          <span class="spanIsCheck">*</span>
            品名:
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
            石料重量:
          </td>
          <td class="inputleft">
            <input name="old_stone_weight" id="old_stone_weight" />ct
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
          <span class="spanIsCheck">*</span>
            实收货品重量:
          </td>
          <td class="inputleft">
            <input name="real_goods_weight" id="real_goods_weight" />g
          </td>
          <td>
          </td>
          <td class="inputleft">
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
          <span class="spanIsCheck">*</span>
            预计取货日期:
          </td>
          <td class="inputleft">
            <input name="expected_pickup_date" id="expected_pickup_date" class="inputreadonly" readonly="readonly"
              style="background: #f0f0f0"></input>
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
          <span class="spanIsCheck">*</span>
            售后服务项目:
          </td>
          <td class="inputleft">
            <select name="after_ss_project_select" id="after_ss_project_select" 
            multiple="multiple" style="width: 150px">
            </select>
            <span id="ss_project_confirm">确定选择</span>
            <input name="after_ss_project" id="after_ss_project" type="hidden" />
          </td>
          <td>
            维修次数:
          </td>
          <td class="inputleft">
            <input name="repair_count" id="repair_count" class="inputreadonly" readonly="readonly" />
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr class="replacement_span" style="display:none">
          <td>
            配件:
          </td>
          <td class="inputleft">
            <select name="replacement" id="replacement" style="width: 150px">
            </select>
          </td>
          <td>
            配件价格:
          </td>
          <td class="inputleft">
            <input name="replacement_cost" id="replacement_cost"></input>
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            金料损耗比率%:
          </td>
          <td class="inputleft">
            <input name="gold_loss_ratio" id="gold_loss_ratio" value="5"></input>
          </td>
          <td>
            顾客特别要求:
          </td>
          <td class="inputleft">
            <input name="cus_requirement" id="cus_requirement"></input>
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
            商场维修费用:
          </td>
          <td class="inputleft">
            <input name="store_repair_costs" id="store_repair_costs" />元
          </td>
          <td>
          <span class="spanIsCheck">*</span>
            预计维修费用:
          </td>
          <td class="inputleft">
            <input name="expected_repair_costs" id="expected_repair_costs" />元
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>
          <span class="spanIsCheck">*</span>
            专柜受理人:
          </td>
          <td class="inputleft">
          <select name="accept_people_first_select" id="accept_people_first_select" 
            multiple="multiple" style="width: 150px">
            </select>
            <span style="display:none"><input name="accept_people_first" id="accept_people_first" /></span>
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
            <input type="button" id="repairSubmitBtn" value="提交" class="orersystembutton" />
            &nbsp;&nbsp;
            <input type="reset" id="repairResetBtn" value="重置" class="orersystembutton" />
            &nbsp;&nbsp;
            <input type="button" id="showRepairPrint" value="打印" class="orersystembutton" />
            <input type="hidden" id="chargtype" name="chargtype" value="charg" checked="checked" disabled="disabled">
            <input type="hidden" id="WERKS" name="WERKS" value="<%=WERKS%>" />
            <input type="hidden" id="service_type" name="service_type" value="1" />
            <input type="hidden" id="opterator" name="opterator" value="<%=opterator%>" />
            <input type="hidden" id="service_number" name="service_number" />
          </td>
        </tr>
      </table>
    </form>
  </body>
</html>
<script src="longhaul/pos/aftersales/js/binding.js"></script>