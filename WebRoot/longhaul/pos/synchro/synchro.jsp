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
	
	<script src="longhaul/pos/synchro/js/synchro.js" type="text/javascript"></script>
	
	
  </head>
  
  <body>
  <div id="selectRfcNameLaber">
  选择需要同步的信息：	<select id="selectRfcName" >
  		<option value="">请选择......</option>
  		<%--<option value="Z_RFC_STORE_01">物料信息</option>
  		<option value="Z_RFC_STORE_02">物料价格信息</option>
  		<option value="Z_RFC_STORE_03">批次信息</option>
  		<option value="Z_RFC_STORE_04">批次价格信息</option>
  		<option value="Z_RFC_STORE_05">会员信息下载</option>
  		<option value="Z_RFC_STORE_06">门店、库位信息</option>
  		<option value="Z_RFC_STORE_07">批次属性码表</option>
  		<option value="Z_RFC_STORE_08">成品石料信息表ZSLIT</option>
  		<option value="Z_RFC_STORE_09">编码配置表</option>
  		<option value="Z_RFC_STORE_20">库存接口</option>
  		<option value="Z_RFC_STORE_21">系列赠品信息</option>
  		<option value="Z_RFC_STORE_22">组合销售</option>
  		<option value="Z_RFC_STORE_23">促销信息</option>
  		<option value="Z_RFC_STORE_24">石料与石料颜色对照关系</option>
  		<option value="Z_RFC_STORE_25">石料金额 、每日金价 、工费损耗</option>
  		<option value="Z_RFC_STORE_26">批次标准价</option>
  		<option value="Z_RFC_STORE_27">销售方式</option>
  	--%></select>
  
  	
  	<button id="synchro">提交</button>
  	
  	
  	<hr/>
  	</div>
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
  		 <input type="button" value="增加主磨号" id="addtempRow"/>
		  <input type="button" value="同步" id="synctemp"/>
	<hr />
	<div id="werksLaber">
	<h3>门店库存同步</h3>	  
		<div id="werkinfo">
  		 <input type="text" name="werk" id="werk" /><br/>
  		 </div>
		  <input type="button" value="同步" id="syncwerk"/>
	 <hr />
	 </div>
     <h3>促销代码同步</h3>	  
		<div id="cxinfo">
  		 <input type="text"  /><br/>
  		 
  		 </div>
  		 <input type="button" value="增加促销代码" id="addcxRow"/>
		  <input type="button" value="同步" id="synccx"/>
  </body>
</html>
