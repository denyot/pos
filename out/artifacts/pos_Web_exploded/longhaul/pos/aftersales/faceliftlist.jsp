<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String WERKS = request.getParameter("WERKS"); WERKS=WERKS==null||WERKS.equals("")?"01DL":WERKS;
String opterator = request.getParameter("userid");   opterator=opterator==null||opterator.equals("")?"CHJ":opterator;
String password = request.getParameter("password");   password=password==null||password.equals("")?"":password;
String posurl = (String)  request.getParameter("posurl");
posurl= posurl==null||posurl.equals("")?"":posurl;
String step =request.getParameter("step");  step = step==null||("").equals(step)?"query":step;
%>
<html>
  <head>
		<meta charset="utf-8">
	<base href="<%=basePath%>">
	<title>改款查询</title>
	<script src="resource/jquery/jquery-1.7.2.js"></script>
	<script src="resource/jquery/ui/jquery.ui.core.js"></script>
	<script src="resource/jquery/ui/jquery.ui.widget.js"></script>
	<script src="resource/jquery/ui/jquery.ui.position.js"></script>
	<script src="resource/jquery/ui/jquery.ui.autocomplete.js"></script>
	<script src="resource/jquery/ui/jquery.ui.datepicker.js"></script>
    <script src="resource/jquery/ui/i18n/jquery.ui.datepicker-zh-CN.js"></script>
    <script src="resource/jquery/ui/jquery.ui.mouse.js"></script>
	<script src="resource/jquery/ui/jquery.ui.button.js"></script>
	<script src="resource/jquery/ui/jquery.ui.draggable.js"></script>
    <script src="resource/jquery/ui/jquery.ui.resizable.js"></script>
	<script src="resource/jquery/ui/jquery.ui.dialog.js"></script>
    <script src="resource/jquery/external/jquery.bgiframe-2.1.2.js"></script>
    <script src="resource/jquery/jquery.alerts-1.1/jquery.alerts.js"></script>
    <script src="resource/jquery/external/jquery.jeditable.js"></script>
    <script src="resource/jquery/external/jquery.json-2.3.js"></script>
    
    <script src="longhaul/pos/order/js/orderdate.js"></script>
    <link rel="stylesheet" href="resource/jquery/jqpagination/jqpagination.css"/>
 	<script src="resource/jquery/jqpagination/jquery.jqpagination.min.js"></script>
    
	<link rel="stylesheet" href="resource/jquery/themes/base/jquery.ui.all.css">
	<link rel="stylesheet" href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
	<link rel="stylesheet" href="longhaul/pos/order/css/ordersystem.css" media="screen">
  <link rel="stylesheet" href="longhaul/pos/aftersales/css/stand.css" media="screen">
	<style>
	.ui-autocomplete-loading { background: white url('resource/jquery/ui/images/ui-anim_basic_16x16.gif') right center no-repeat; }
	</style>
	<script type="text/javascript" charset="utf-8">
     var WERKS="<%=WERKS%>";
     var opterator = "<%=opterator%>";
     var basepath = "<%=basePath%>";
     var password = "<%=password%>";
     var posurl ="<%=posurl%>";
		 $(document).ready(function() {
			  var step = "<%=step%>";
        var service_type = "<%=request.getAttribute("service_type")%>";
        if(service_type != ""){
          $("#service_type").val(service_type);
        }
        if(service_type=='3'){
          $("#servicebutton3").attr('class','servicebutton_se');
          $(".switch_servicenumber").text("配对单号");
        }else{
          $("#servicebutton2").attr('class','servicebutton_se');
        }
         if(step !='2'){
            $("input[name=export_se]").hide();
          }
        $("#step").val(step);
        if(step=='query'){
          $("#update").hide();
          $("#del").hide();
          $("#print").show();
        }else{
        	$("#print").hide();
        }
		 });
</script>
  </head>
  <body>
  <table border="0" id="faceliftheadlist" width="100%">
  <tr>
    <td colpan="8">服务类型</td>
    <td>
    <input type="button" name="service_type_se" realva="0" id="servicebutton0" value="所有" class="servicebutton" />
    <input type="button" name="service_type_se" realva="1" id="servicebutton1" value="维修" class="servicebutton" />
    <input type="button" name="service_type_se" realva="2" id="servicebutton2" value="改款" class="servicebutton" />
    <input type="button" name="service_type_se" realva="3" id="servicebutton3" value="配对" class="servicebutton" />
    </td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
   </tr>
   <tr>
    <td width="50px">单号</td>
    <td width="280px"><input id=service_number  name="service_number" style="width:100px"/> </td>
     <td>顾客姓名</td>
     <td><input id="member_name"  name="member_name" style="width:100px"/> </td>
     <td>状态</td>
     <td><select name="status" id="status" style="width:100px">
      <option value="">全部</option>
      <option value="1">新单</option>
      <option value="2">关闭</option>
      <option value="3">送厂</option>
      <option value="4">合格</option>
      <option value="5">返修</option>
      <option value="6">邮寄</option>
      <option value="7">门店接收</option>
      <option value="8">顾客取货</option>
      <option value="9">不满意</option>
     </select></td>
     <td>&nbsp;</td>
     <td>&nbsp;</td>
   </tr>
   <tr> 
     <td>开始时间</td>
     <td><input id="start_time"  name="start_time" style="width:100px"/> </td>
     <td>截止时间</td>
     <td><input id="end_time"  name="end_time" style="width:100px"/> </td>
     <td>批次号</td>
     <td><input id="old_commodity_barcode"  name="old_commodity_barcode" style="width:100px"/> </td>
     <td>&nbsp;</td>
     <td>&nbsp;</td>
    </tr>
    <tr>
     <td>&nbsp;</td>
     <td colspan="4">
     <input   type="button" id="search" value="查询" class="oreropbutton"/>
     <input   type="button" id="view" value="查看" class="oreropbutton"/>
     <input   type="button" id="update" value="修改" class="oreropbutton"/>
     <input   type="button" id="print_facelift" value="打印维修单" class="oreropbutton" style="width: 100px;"/>
     <input   type="button" id="print" value="打印售后单" class="oreropbutton" style="width: 100px;"/>
     <!-- <input   type="button" id="del" value="删除" class="oreropbutton"/> -->
     <input type="button" name="export_se" id="export_self" value="导出" exporttype="quality" class="oreropbutton"/>
     <input type="button" name="export_se" id="export_factory" value="导出-工厂" exporttype="factory"  class="oreropbutton"/>
     <input type="button" name="export_se" id="export_stock" value="导出-采购"  exporttype="purchase" class="oreropbutton"/>
     </td>
     <td>&nbsp; </td>
     <td>&nbsp; </td>
     <td>&nbsp; </td>
   </tr> 
   <tr>
    <td colspan="8" >
     <table  border="0"  width="100%"  id="faceliftlisttable">
	 <thead>
		<tr>
		  <th align="center"><input name='opcontrol' id='opcontrol' type='checkbox'/></th>
			<th><span class="switch_servicenumber">改款单号</span></th>
			<th>名称</th>
			<th>会员卡号</th>
			<th>顾客姓名</th>
			<th>商品批次</th>
			<th>商品名</th>
			<th>付款</th>
			<th>收款</th>
			<th>状态</th>
      <th>邮寄日期</th>
      <th>处理方案</th>
			<th style="display:none">操作时间</th>
		</tr>
	</thead>
	<tbody>
		
	</tbody>
  </table>
    
    </td>
   </tr>
  </table>
   <input type="hidden" id="step" value="" />
   <input type="hidden" id="service_type" value="" />
  <!-- 添加分页操作的div块 -->
  <div class="pagination" id="pageOpr">
   <a href="#" class="first" data-action="first" id="first">&laquo;</a>
   <a href="#" class="previous" data-action="previous" id="previous">&lsaquo;</a>
   <input type="text" readonly="readonly" data-max-page="40" id="pageMsg" />
   <a href="#" class="next" data-action="next" id="next">&rsaquo;</a>
   <a href="#" class="last" data-action="last" id="last">&raquo;</a>
    每页显示量：
   <select id="pageSize">
   		<option value="5"  >5</option>
   		<option value="8"  >8</option>
   		<option value="10" >10</option>
   		<option value="15"  >15</option>
   		<option value="20" selected='selected'  > 20</option>
   		<option value="40" > 40</option>
   		<option value="60" > 60</option>
   		<option value="80" > 80</option>
   		<option value="100" > 100</option>
      <option value="200" > 200</option>
      <option value="500" > 500</option>
      <option value="9999999999" > 无限</option>
   </select>
 </div>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  </body>
</html>
<script src="longhaul/pos/aftersales/js/faceliftlist.js"></script>