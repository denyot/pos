<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	//String WERKS = (String)request.getAttribute("WERKS"); WERKS=WERKS==null||WERKS.equals("")?"01DL":WERKS;
	//String opterator = (String)request.getAttribute("userid");   opterator=opterator==null||opterator.equals("")?"CHJ":opterator;
	//opterator = opterator.toUpperCase();
	//String salesorderid = (String)request.getAttribute("salesorderid");   salesorderid=salesorderid==null||salesorderid.equals("")?"":salesorderid;
	//String opmode = (String)request.getAttribute("opmode");   opmode=opmode==null||opmode.equals("")?"ADD":opmode;
	//String ordertype = (String)request.getAttribute("ordertype"); ordertype=ordertype==null||ordertype.equals("")?"":ordertype;
	//String autocompletesecond = (String)request.getAttribute("autocompletesecond");
	//String autocompletewords =  (String)request.getAttribute("autocompletewords");
	//autocompletesecond = autocompletesecond==null||autocompletesecond.equals("")?"4000":autocompletesecond;
	//autocompletewords = autocompletewords==null||autocompletewords.equals("")?"4":autocompletewords;
	//String posurl =(String)request.getAttribute("posurl");
	//posurl= posurl==null||posurl.equals("")?"localhost:8080":posurl;
%>
<html>
	<head>
		<meta charset="utf-8">
			<base href="<%=basePath%>">
				<title>订单系统</title> <script src="resource/jquery/jquery-1.7.2.js"></script>
				<script
					src="resource/jquery/lhgdialog/lhgdialog.min.js?self=true&skin=mac"></script>
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
				<script
					src="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.js"
					type="text/javascript"></script>
				<script src="resource/jquery/jquery-cookie/jquery.cookie.js"
					type="text/javascript"></script>
				<link
					href="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.css"
					rel="stylesheet" type="text/css" />
				<script src="longhaul/pos/report/js/orderdate.js"></script>
				<script src="longhaul/pos/report/js/report.js"></script>
				<link rel="stylesheet"
					href="resource/jquery/themes/base/jquery.ui.all.css">
					<link rel="stylesheet"
						href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
						<link rel="stylesheet"
							href="longhaul/pos/report/css/ordersystem.css" media="screen">
							<style>
.ui-autocomplete-loading {
	background: white
		url('resource/jquery/ui/images/ui-anim_basic_16x16.gif') right center
		no-repeat;
}
</style>
							<script type="text/javascript">
	var doubleIntervalValidate = false;
	$(document).ready(function() {
		$("#ordertime").datepicker({
			changeMonth : true,
			changeYear : true
		});
		$("#charg").attr("disabled", true);
		$("#kunnr").focus();
	});
</script>
	</head>
	<body style="width: 100%; text-align: center;">
		排名类型：
		<select id="type">
			<option value="">
				请选择...
			</option>
			<option value="1">
				周排名
			</option>
			<option value="2">
				月排名
			</option>
		</select>
		<span id="weeksSpan"> 周数： <select id="weeks">
				<option value="">
					请选择...
				</option>
			</select> </span>
		<span id="monthsSpan">月数： <select id="months">
				<option value="">
					请选择...
				</option>
			</select> </span>
	</body>
</html>
