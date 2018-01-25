<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html>
	<head>
		<meta charset="utf-8">
			<base href="<%=basePath%>">
				<title>订单查询</title> <script src="resource/jquery/jquery-1.7.2.js"></script>
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
				<script src="resource/jquery/external/jquery.jeditable.js"></script>
				<script src="resource/jquery/external/jquery.json-2.3.js"></script>
				<script src="longhaul/pos/order/js/orderlist.js"></script>
				<script src="longhaul/pos/order/js/orderdate.js"></script>
				<link rel="stylesheet"
					href="resource/jquery/jqpagination/jqpagination.css" />
				<script
					src="resource/jquery/jqpagination/jquery.jqpagination.min.js"></script>

				<link rel="stylesheet"
					href="resource/jquery/themes/base/jquery.ui.all.css">
					<link rel="stylesheet"
						href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
						<link rel="stylesheet"
							href="longhaul/pos/order/css/ordersystem.css" media="screen">
							<style>
.ui-autocomplete-loading {
	background: white
		url('resource/jquery/ui/images/ui-anim_basic_16x16.gif') right center
		no-repeat;
}
</style>
							<script type="text/javascript" charset="utf-8">
	$(document).ready(function() {
		//getorder();
	});
</script>
	</head>
	<body>
		<table border="0" id="orderheadlist" width="100%">
			<tr>
				<td colspan="8">
					<table border="0" width="auto" id="orderlistdetailtable"
						style="display: none;">
						<thead>
							<tr>
								<th align="center">
									<input name='opcontrol1' id='opcontrol1' type='checkbox' />
								</th>
								<th>
									销售单号
								</th>
								<!-- <th>SAP单号</th> -->
								<th style="width: 200px;">
									&nbsp;类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型&nbsp;
								</th>
								<th>
									订&nbsp;单&nbsp;时&nbsp;间
								</th>
								<th>
									客户ID
								</th>
								<th>
									状&nbsp;&nbsp;态
								</th>
								<th>
									实销价格
								</th>
								<th>
									标签价
								</th>
								<th>
									金价
								</th>
								<th>
									批次
								</th>
								<th>
									物料号
								</th>
								<th>
									&nbsp;&nbsp;物&nbsp;&nbsp;料&nbsp;&nbsp;名&nbsp;&nbsp;称&nbsp;&nbsp;
								</th>
								<th>
									图片
								</th>
								<th>
									数量
								</th>
								<th>
									实销折扣
								</th>
								<!-- <th>常规折扣</th>
			<th>促销折扣</th>
			<th>VIP折扣</th>
			<th>商场会员折扣</th>
			<th>特殊折扣</th> -->
								<th>
									&nbsp;金&nbsp;料&nbsp;
								</th>
								<th>
									金重
								</th>
								<th>
									工费
								</th>
								<th>
									本次积分
								</th>
								<th>
									石料
								</th>
								<th>
									石重
								</th>
								<th>
									石料净度
								</th>
								<th>
									石料颜色
								</th>
								<th>
									营&nbsp;业&nbsp;员
								</th>
								<!--<th>交货单</th>-->
								<th style="display: none">
									操作时间
								</th>
							</tr>
						</thead>
						<tbody>

						</tbody>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>
