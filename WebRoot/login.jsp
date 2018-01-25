<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="${sysTitle}" showLoading="false" exportParams="true"
	isSubPage="false">
<eRedG4:import src="/arm/js/login.js" />


<script >
	if(self!=top){top.location=self.location;}
</script>
<eRedG4:body>


	<div id="hello-win" class="x-hidden">
	<div id="hello-tabs"><img border="0" width="450" height="70"
		src="<%=request.getAttribute("bannerPath") == null ? request.getContextPath()
							+ "/resource/image/login_banner.png" : request.getAttribute("bannerPath")%>" />
	</div>
	</div>
	<div id="aboutDiv" class="x-hidden"
		style='color: black; padding-left: 10px; padding-top: 10px; font-size: 12px'>
	SAP系统集成与应用开发平台 (SAP AIG&reg)<br>
	<br>
	<br>
	官方网站:<a href="http://www.longhaul.com.cn" target="_blank">www.longhaul.com.cn</a>
	</div>
	<div id="infoDiv" class="x-hidden"
		style='color: black; padding-left: 10px; padding-top: 10px; font-size: 12px'>
	登录帐户[用户名/密码]...<br>
	[developer/111111]<br>
	[super/111111]<br>
	
	
	
	</div>
</eRedG4:body>
</eRedG4:html>