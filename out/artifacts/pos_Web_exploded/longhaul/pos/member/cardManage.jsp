<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="表格综合演示一" >
<eRedG4:import src="/longhaul/pos/member/js/cardManage.js" />
<eRedG4:import src="/resource/lovcombo/js/WebPage.js" />
<eRedG4:import src="/resource/lovcombo/js/Ext.ux.form.LovCombo.js" />
<eRedG4:import src="/resource/lovcombo/js/Ext.ux.ThemeCombo.js" />
<eRedG4:import src="/resource/lovcombo/css/Ext.ux.form.LovCombo.css" />

<style>
	.x-combo-list-item : {line-height:10px}
</style>
<style type="text/css">
.panel_icon { background-image:url(images/first.gif)}
.center_icon { background-image:url(images/center.png)}
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
<form id="form1" runat="server">
<div><div id="oldlev"></div><div id="newlev"></div>
<div id="Div1" style="display:none;"></div>
</div>
</form>
</eRedG4:body>
</eRedG4:html>