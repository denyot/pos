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
    
    <title>My JSP 'search.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	
	<link rel="shortcut icon" href="resource/image/g4.ico" />  

<link rel="stylesheet" type="text/css" href="resource/css/ext_icon.css"/>

<link rel="stylesheet" type="text/css" href="resource/theme/default/resources/css/ext-all.css"/>

<script type="text/javascript" src="resource/ext-3.4.0/adapter/ext/ext-base.js"></script>

  <script type="text/javascript" src="resource/ext-3.4.0/ext-all-debug.js"></script>

  <link rel="stylesheet" type="text/css" href="resource/css/ext_css_patch.css" />

<script type="text/javascript" src="resource/commonjs/ext-lang-zh_CN.js"></script>

<script type="text/javascript" src="resource/commonjs/eredg4.js"></script>

<link rel="stylesheet" type="text/css" href="resource/css/eredg4.css"/>

<script type="text/javascript" src="resource/ext-3.4.0/ux/ux-all.js"></script>

<link rel="stylesheet" type="text/css" href="resource/ext-3.4.0/ux/css/ux-all.css"/>
	
	<script type="text/javascript" src="longhaul/pos/stock/js/search.js"></script>

  </head>
  
  <body>
    <div id="businessUserSearch"></div>
    <div id="businessUserQuery"></div>
    <div id="businessEditorGrid"></div>
    
    <select><option>损坏</option><option>损坏</option><option>损坏</option></select>
    
    <textarea rows="" cols=""></textarea>
  </body>
</html>
