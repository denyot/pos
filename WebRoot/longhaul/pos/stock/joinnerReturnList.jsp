<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="加盟商退货订单列表" >
<eRedG4:import src="/longhaul/pos/stock/js/joinnerReturnList.js" />
<eRedG4:body>
<% 
	out.write("<input id='werks' type='hidden' value='" + (String)session.getAttribute("sessionWerk") + "' />");
%>
</eRedG4:body>
</eRedG4:html>
