<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>SynchroRFCFunction</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	
	<script src="resource/jquery/jquery-1.7.2.js"></script>
	<script src="resource/jquery/timepicker/jquery-ui-1.8.16.custom.min.js"></script>
	<script src="resource/jquery/timepicker/jquery-ui-timepicker-addon.js"></script>
	<script src="resource/jquery/lhgdialog/lhgdialog.min.js?self=true&skin=mac"></script>
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
	
	<script src="longhaul/pos/synchro/js/synchro2.js" type="text/javascript"></script>
	
	
  </head>
  
  <body>
  
  选择需要同步的信息：	<select id="selectRfcName" >
  		<option value="">请选择......</option>
  		
  	</select>
  
  	<button id="synchro">提交</button>
  	
  	
  	<hr/>
  	<h3>物料快速同步</h3>
  		 物料号：<br/>
  		 <div id="matnrinfo">
  		 <input type="text" name="matnr0"  /><br/>
  		 </div>
  		 <input type="button" value="增加物料号" id="addMatnrRow"/>
		  <input type="button" value="同步" id="syncmatnr"/>
		  
	<hr />
	<h3>批次快速同步</h3>	  
		<div id="charginfo">
  		 <input type="text" name="charg0"  /><br/>
  		 </div>
  		 <input type="button" value="增加批次" id="addchargRow"/>
		  <input type="button" value="同步" id="synccharg"/>
	<hr />
	<h3>主模号快速同步</h3>	  
		<div id="tempinfo">
  		 <input type="text" name="temp0"  /><br/>
  		 </div>
  		 <input type="button" value="增加主模号" id="addtempRow"/>
		  <input type="button" value="同步" id="synctemp"/>
		  
		  
  </body>
</html>
