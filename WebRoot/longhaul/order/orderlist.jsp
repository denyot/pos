<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String WERKS = request.getParameter("WERKS"); WERKS=WERKS==null||WERKS.equals("")?"01DLX":WERKS;
String opterator = request.getParameter("userid");   opterator=opterator==null||opterator.equals("")?"CHJ":opterator;
String password = request.getParameter("password");   password=password==null||password.equals("")?"":password;
String posurl = (String)  request.getParameter("posurl");
posurl= posurl==null||posurl.equals("")?"":posurl;
%>
<html>
  <head>
		<meta charset="utf-8">
	<base href="<%=basePath%>">
	<title>订单查询</title>
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
    <script src="longhaul/order/js/orderlist.js"></script>
    <script src="longhaul/order/js/orderdate.js"></script>
    <link rel="stylesheet" href="resource/jquery/jqpagination/jqpagination.css"/>
 	<script src="resource/jquery/jqpagination/jquery.jqpagination.min.js"></script>
    
	<link rel="stylesheet" href="resource/jquery/themes/base/jquery.ui.all.css">
	<link rel="stylesheet" href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
	<link rel="stylesheet" href="longhaul/order/css/ordersystem.css" media="screen">
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
				//getorder();
			 });
			
</script>
  </head>
  <body>
  <table border="0" id="orderheadlist" width="100%">
   <tr>
    <td width="50px">销售单号</td>
    <td><input id="salesorderid"  name="salesorderid" style="width:100px"/> </td>
     <td>SAP单号</td>
     <td><input id="sapsalesorderid"  name="sapsalesorderid" style="width:100px"/> </td>
     <td>客户编号</td>
     <td><input id="kunnr"  name="kunnr" style="width:100px"/> </td>
     <td>会员卡号</td>
     <td><input id="vipid"  name="vipid" style="width:100px"/> </td>
   </tr>
   <tr>
    <td>日期</td>
    <td><input id="saledatefrom"  name="saledatefrom" style="width:100px"/> </td>
     <td>日期到</td>
     <td><input id="saledateto"  name="saledateto" style="width:100px"/> </td>
    
     <td>批次号</td>
     <td><input id="batchno" name = "batchno" style="width:100px" /></td>
     <td>营业员</td>
     <td><input id="salesclerk"  name="salesclerk" style="width:100px"/> </td>
   </tr>
    <tr>
    <td>交货单</td>
    <td><input id="deliveryordernumber"  name="deliveryordernumber" style="width:100px"/> </td>
    <td>类型</td>
    <td><select name="ordertype" id="ordertype" style="width:100px" ></td>
    <td>状态</td>
    <td><select name="orderflag" id="orderflag" style="width:100px">
      <option value="">所有类型</option>
      <option value="NO">新订单</option>
      <option value="UO" selected>订单上传</option>
      <option value="SO">订单过账</option>
      <option value="NS">新结算单</option>
      <option value="US">结算单上传</option>
     </select></td>
      <td>操作员</td>
     <td><input id="kunnr"  name="operator" style="width:100px"/> </td>
     <td><input id="postingtime"  name="postingtime" style="width:100px;display:none"/> </td>
   </tr>
   
    <tr>
     <td>&nbsp;</td>
     <td colspan="4">
     <input   type="button" id="view" value="查看" class="oreropbutton"/>
     <input   type="button" id="update" value="修改" class="oreropbutton"/>
     <input   type="button" id="del" value="删除" class="oreropbutton"/>
     <input   type="button" id="posting" value="过帐" class="oreropbutton"/>
     <input   type="button" id="writeoff" value="冲销" class="oreropbutton"/>
     <input   type="button" id="search" value="查询" class="oreropbutton"/>
     </td>
     <td>&nbsp; </td>
     <td>&nbsp; </td>
     <td>&nbsp; </td>
   </tr> 
   <tr>
    <td colspan="8" >
     <table  border="0"  width="100%"  id="orderlisttable">
	 <thead>
		<tr>
		    <th align="center"><input name='opcontrol' id='opcontrol' type='checkbox'/></th>
			<th>销售单号</th>
			<th>SAP单号</th>
			<th>类型</th>
			<th>订单时间</th>
			<th>客户ID</th>
			<th>状态</th>
			<th>实销价格</th>
			<th>业务员</th>
			<th>交货单</th>
			<th style="display:none">操作时间</th>
		</tr>
	</thead>
	<tbody>
		
	</tbody>
  </table>
    
    </td>
   </tr>
  </table>
  
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
