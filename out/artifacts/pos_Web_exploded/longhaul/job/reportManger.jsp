<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="SAP RFC 功能管理" uxEnabled="true">
<eRedG4:import src="/longhaul/job/js/reportManger.js"/>
<eRedG4:ext.codeRender fields="OPTION,CACHEMODE,PRIMARYKEY,LEAF,ENABLED,EDITMODE"/>
<eRedG4:ext.codeStore fields="OPTION,CACHEMODE,PRIMARYKEY,LEAF,ENABLED,EDITMODE"/>
<eRedG4:body>
<eRedG4:div key="rfcTreeDiv2"></eRedG4:div>
</eRedG4:body>
</eRedG4:html>