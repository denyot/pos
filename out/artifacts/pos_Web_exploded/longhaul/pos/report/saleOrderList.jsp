<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="销售明细表">
<eRedG4:ext.myux uxType="gridsummary"/>
<eRedG4:import src="/longhaul/pos/report/js/saleOrderList.js?a=1" />
<eRedG4:import src="/resource/lovcombo/js/Ext.ux.form.LovCombo.js" />
<eRedG4:import src="/resource/lovcombo/js/Ext.ux.ThemeCombo.js" />
<eRedG4:import src="/resource/lovcombo/css/Ext.ux.form.LovCombo.css" />
<eRedG4:body>
</eRedG4:body>
<eRedG4:script>
   var werks = '<eRedG4:out key="werks" scope="request"/>';
</eRedG4:script>
</eRedG4:html>