<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="各品类销售统计分析报表" fcfEnabled="true">
<eRedG4:import src="/longhaul/pos/report/js/salesStatistics.js" />
<eRedG4:import src="/resource/lovcombo/js/Ext.ux.form.LovCombo.js" />
<eRedG4:import src="/resource/lovcombo/js/Ext.ux.ThemeCombo.js" />
<eRedG4:import src="/resource/lovcombo/js/WebPage.js" />
<eRedG4:import src="/resource/lovcombo/css/Ext.ux.form.LovCombo.css" />
<eRedG4:body>
	<eRedG4:flashReport type="3DP" dataVar="xmlString" id="my2DcChart" align="center" style="margin-top:50px" visible="false" />
</eRedG4:body>
</eRedG4:html>