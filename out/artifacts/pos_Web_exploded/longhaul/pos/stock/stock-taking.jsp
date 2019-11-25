<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>盘点</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
		<script src="resource/jquery/jquery-1.7.2.js"></script>
	<script src="resource/jquery/timepicker/jquery-ui-1.8.16.custom.min.js"></script>
	<script src="resource/jquery/timepicker/jquery-ui-timepicker-addon.js"></script>
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
	<script src="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.js" type="text/javascript"></script>
	<script src="resource/jquery/jquery-cookie/jquery.cookie.js" type="text/javascript"></script>
	<link href="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="resource/jquery/themes/base/jquery.ui.all.css">
	<link rel="stylesheet" href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
	
	<script src="longhaul/pos/stock/js/stock-taking.js" type="text/javascript"></script>
	<script src="longhaul/pos/stock/js/orderdate.js" type="text/javascript"></script>
	
	
	<style>
		.mydata th,td{
			border: 1px solid;
		}
	</style>
  </head>
  <body>
  	<table>
  		<tr>
  			<td style="padding-right: 20px;">
  			<b>批次盘</b><br/>
  			
  			批次号：<input type="text" id="charg" /> 数量： <input type="text" id="count" value=1 />	<br/>
		  	已盘清单:<br/>
			<select id="data" size="10" style="width:400px; height:200px;">
				<option>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;批&nbsp;&nbsp;次&nbsp;&nbsp;号&nbsp;&nbsp; / 物&nbsp;&nbsp;品&nbsp;&nbsp;名&nbsp;&nbsp;称  / 数量</option>
			</select> 
  			
  			
  			</td> 
  			
  			 <td>
  			 <b>物料盘</b><br/>
  			 物料号：<input type="text" id="matnr" /> 数量： <input type="text" id="count2" value=1 />	<br/>
  	已盘清单:<br/>
	<select id="data" size="10" style="width:400px; height:200px;">
		<option>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;物&nbsp;&nbsp;料&nbsp;&nbsp;号&nbsp;&nbsp; / 物&nbsp;&nbsp;品&nbsp;&nbsp;名&nbsp;&nbsp;称  / 数量</option>
	</select>
  			 
  			 </td>
  		</tr>
  		
  	</table>
	
	
  </body>
</html>
