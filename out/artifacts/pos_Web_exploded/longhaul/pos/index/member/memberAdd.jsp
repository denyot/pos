<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="表格综合演示一" >
<eRedG4:import src="/longhaul/pos/member/js/memberAdd.js" />
<eRedG4:import src="/resource/lovcombo/js/WebPage.js" />
<eRedG4:import src="/resource/lovcombo/js/Ext.ux.form.LovCombo.js" />
<eRedG4:import src="/resource/lovcombo/js/Ext.ux.ThemeCombo.js" />
<eRedG4:import src="/resource/lovcombo/css/Ext.ux.form.LovCombo.css" />

<style>
	.x-combo-list-item : {line-height:10px}
</style>
<eRedG4:ext.codeRender fields="QYBZ,SEX"/>
<%-- 自定义表格行高 
<style type="text/css">
    .x-grid3-row{
        height:80px;
    }
</style>
--%>
<eRedG4:body>
<div id="suggest_div"></div>
</eRedG4:body>
</eRedG4:html>