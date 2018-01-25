<%@ page language="java"
	import="java.util.*,java.util.*,org.eredlab.g4.rif.web.BaseAction"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	
	
	String WERKS = request.getParameter("werks");
	WERKS = WERKS == null || WERKS.equals("") ? "01DL" : WERKS;
	String opterator = (String) request.getAttribute("userid");
	opterator = opterator == null || opterator.equals("")
			? "CHJ"
			: opterator;
	opterator = opterator.toUpperCase();
	String salesorderid = (String) request.getAttribute("salesorderid");
	salesorderid = salesorderid == null || salesorderid.equals("")
			? ""
			: salesorderid;
	String opmode = (String) request.getAttribute("opmode");
	opmode = opmode == null || opmode.equals("") ? "ADD" : opmode;
	String ordertype = (String) request.getAttribute("ordertype");
	ordertype = ordertype == null || ordertype.equals("")
			? ""
			: ordertype;
	String autocompletesecond = (String) request
			.getAttribute("autocompletesecond");
	String autocompletewords = (String) request
			.getAttribute("autocompletewords");
	autocompletesecond = autocompletesecond == null
			|| autocompletesecond.equals("")
			? "4000"
			: autocompletesecond;
	autocompletewords = autocompletewords == null
			|| autocompletewords.equals("") ? "4" : autocompletewords;
	String posurl = (String) request.getAttribute("posurl");
	posurl = posurl == null || posurl.equals("")
			? "192.168.0.119"
			: posurl;
%>

<html>
	<head>
		<meta charset="utf-8">
			<base href="<%=basePath%>">
				<title>单据打印</title> <script src="resource/jquery/jquery-1.7.2.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.core.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.widget.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.position.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.autocomplete.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.datepicker.js">
</script>
				<script src="resource/jquery/ui/i18n/jquery.ui.datepicker-zh-CN.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.mouse.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.button.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.draggable.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.resizable.js">
</script>
				<script src="resource/jquery/ui/jquery.ui.dialog.js">
</script>
				<script src="resource/jquery/external/jquery.bgiframe-2.1.2.js">
</script>
				<script src="resource/jquery/jquery.alerts-1.1/jquery.alerts.js">
</script>
				<script
					src="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.js"
					type="text/javascript">
</script>
				<script src="resource/jquery/jquery-cookie/jquery.cookie.js"
					type="text/javascript">
</script>
				<link
					href="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.css"
					rel="stylesheet" type="text/css" />
				<script src="longhaul/pos/order/js/orderdate.js">
</script>
				</script>
				<link rel="stylesheet"
					href="resource/jquery/themes/base/jquery.ui.all.css">
					<link rel="stylesheet"
						href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
						<link rel="stylesheet"
							href="longhaul/pos/aftersales/css/print.css" media="screen">
							<style>
.ui-autocomplete-loading {
	background: white
		url('resource/jquery/ui/images/ui-anim_basic_16x16.gif') right center
		no-repeat;
}
</style>
							<script type="text/javascript">
var WERKS = "<%=WERKS%>";
var opterator = "<%=opterator%>";
var chargimgpath = "http://<%=posurl%>/sappic/";
var opmode = "<%=opmode%>";
var werkssaleflag = "";
var autocompletelength=<%=autocompletewords%>;
		 var autocompletedelay=<%=autocompletesecond%>;
		 var salesorderid = "<%=salesorderid%>";
		 var basepath = "<%=basePath%>";
		 var ordertype="<%=ordertype%>";
		 var posurl="<%=posurl%>";
</script>
	</head>
	<body>
		<table width="800px" border="1" frame=hsides rules=rows>
			<tr>
				<td align="left" width=300px>
					<span><img src="logo/logo.jpg" width="100px" height="80px" />
					</span>
				</td>
				<td width=250px>
					<span valign="middle"><font size="6">售后服务单</font> </span>
				</td>
				<td width=250px>
					编号:${map.service_number }
				</td>
			</tr>
			<tr>
				<td colspan="3">
					门店:${map.store_name }
				</td>
			</tr>
			<!-- first -->
			<tr>
				<td>
					顾客姓名: ${map.member_name }
				</td>
				<td>
					会员卡号: ${map.member_cardnumber }
				</td>
				<td rowspan="4" class="inputleft">
					<img src="sappic/${map.charg_image }" width="100px" height="80px" />
				</td>
			</tr>
			<tr>
				<td>
					电话: ${map.telephone }
				</td>
				<td>
					投诉单号: ${map.complaints_number }
				</td>
			</tr>
			<tr>
				<td>
					商品批次: ${map.old_commodity_barcode }
				</td>
				<td>
					品名:
					<input type="hidden" name="product_image" id="product_image" />
					${map.trade_name }
				</td>
			</tr>
			<tr>
				<td>
					原货品总重: ${map.old_goods_weight } g
				</td>
				<td>
					石料重量: ${map.old_stone_weight } ct
				</td>
			</tr>
			<tr>
				<td>
					实收价: ${map.clinch_price } 元
				</td>
				<td>
					出售日期: ${map.sell_date }
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			<tr>
				<td>
					实收货品重量: ${map.real_goods_weight } g
				</td>
				<td>
					&nbsp;
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			<tr>
				<td>
					受理日期: ${map.accept_date }
				</td>
				<td>
					预计取货日期: ${map.expected_pickup_date }
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			<tr>
				<td>
					售后服务项目: ${map.after_ss_project }
				</td>
				<td>
					维修次数: ${map.repair_count }
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			<tr class="replacement_span" style="display: none">
				<td>
					配件: ${map.replacement }
				</td>
				<td>
					配件价格: ${map.replacement_cost } 元
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			<tr>
				<td>
					金料损耗比率%: ${map.gold_loss_ratio }
				</td>
				<td>
					顾客特别要求: ${map.cus_requirement }
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			<tr>
				<td>
					商场维修费用: ${map.store_repair_costs } 元
				</td>
				<td>
					预计维修费用: ${map.expected_repair_costs } 元
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			<tr>
				<td>
					专柜受理人: ${map.accept_people_first }
				</td>
				<td>
					备注: ${map.remark1 }
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
		</table>
		<!-- second -->
		<table width="800px" id="table_2" border="1" frame=hsides rules=rows>
			<tbody align="left">
				<tr>
					<td colspan="3" align="center">
						<font class="stephead"> 质量部处理 </font>
					</td>
				</tr>
				<tr>
					<td width="100px" rowspan="4">
						质量部收货
					</td>
					<td>
						质量部收货日期:${map.receive_date }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td>
						货品外观:${map.goods_outward }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td>
						货品重量:${map.old_goods_weight }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td>
						石料重量:${map.old_stone_weight }
					</td>
					<td>
						石料检测:${map.stone_detection }
					</td>
				</tr>
				<tr>
					<td rowspan="2">
						工厂收货
					</td>
					<td>
						工厂收货日期:${map.factory_receive_date }
					</td>
					<td>
						工厂收货人:${map.factory_receive_people }
					</td>
				</tr>
				<tr>
					<td>
						工厂预计出货日期:${map.factory_expected_ship_date }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr class="gcch">
					<td rowspan="4" class="gcch">
						工厂出货
					</td>
					<td class="gcch">
						维修工费:${map.repair_charges }
					</td>
					<td class="gcch">
						加金:${map.canadian_gold }
					</td>
				</tr>
				<tr class="gcch">
					<td class="gcch">
						金价:${map.gole_price }
					</td>
					<td class="gcch">
						石料费用:${map.stone_costs }
					</td>
				</tr>
				<tr class="gcch">
					<td class="gcch">
						石料加工费:${map.stone_process_fees }
					</td >
					<td class="gcch">
						配件费用:${map.replacement_cost }
					</td>
				</tr>
				<tr class="gcch">
					<td class="gcch">
						维修实际产生金额:${map.real_repair_amount }
					</td>
					<td class="gcch">
						损耗值:${map.r_factory_loss }
					</td>
				</tr>
				<!-- 收取顾客费用 -->
				<tr>
					<td rowspan="4">
						收取顾客费用
					</td>
					<td>
						维修工费:${map.repair_charges_cus }
					</td>
					<td>
						加金:${map.canadian_gold_cus }
					</td>
				</tr>
				<tr>
					<td>
						金价:${map.gole_price_cus }
					</td>
					<td>
						石料费用:${map.stone_costs_cus }
					</td>
				</tr>
				<tr>
					<td>
						石料加工费:${map.stone_process_fees_cus }
					</td>
					<td>
						配件费用:${map.replacement_cost_cus }
					</td>
				</tr>
				<tr>
					<td>
						收取顾客费用:${map.real_repair_amount_cus }
					</td>
					<td>
						损耗值:${map.r_cus_price_loss } 
					</td>
				</tr>

				<tr>
					<td rowspan="3">
						质量部检测
					</td>
					<td>
						质量部收货日期:${map.dept_receive_date }
					</td>
					<td>
						维修后重量:${map.repair_after_weight }
					</td>
				</tr>

				<tr>
					<td>
						损耗值:${map.loss_value }
					</td>
					<td>
						损耗率%:${map.loss_rate }
					</td>
				</tr>
				<tr>
					<td>
						工厂维修结果:${map.factory_repair_result }
					</td>
					<td>
						<span class="failed_reason_span"></span>
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
					<td>
						工厂返修次数:${map.factory_repair_number }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
					<td>
						邮寄日期:${map.mailing_date }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td colspan="3" align="center">
						<font class="stephead"> 门店确认 </font>
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
					<td>
						到柜日期:${map.to_cabinet_date }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
					<td>
						满意度反馈:${map.satisfaction }
					</td>
					<td>
						不满意原因:${map.not_satisfied_reason }
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
					<td>
						应收金额:${map.real_repair_amount_cus }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
					<td>
						实收顾客金额:${map.real_customer_amount }
					</td>
					<td>
						顾客取货日期:${map.customer_pickup_date }
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
					<td>
						货品状态:${map.description }
					</td>
					<td>
						&nbsp;
					</td>
				</tr>
			</tbody>
		</table>
		<!-- third -->
		<div id="signature" style="display: none">
			<table width="800px" border="1" frame=hsides rules=rows>
				<tbody align="left">
					<tr>
						<td colspan="2">
							顾客维修确认______________
						</td>
					</tr>
					<tr>
						<td colspan="2">
							取货确认______________
						</td>
					</tr>
					<tr>
						<td width=400px>
							温馨提示：因佩戴过程中，紧压、碰撞、拉扯造成一定程度的变形和断裂等情况，
							首饰经修复后无法恢复到原商品一模一样的程度，此首饰修复状态为能佩戴状态， 我公司将视为合格修复。
						</td>
						<td width=300px>
							<div>
								全国免费服务热线：400-716-0096
							</div>
							<div>
								姚氏珠宝-中国珠宝首饰业驰名品牌
							</div>
							<div>
								欢迎登陆品牌网站：www.zljewelry.com
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</body>
</html>
<script type="text/javascript">
$(document).ready(function(){
	var store_num = "<%= session.getAttribute("store_num")%>";
	if(store_num != 1000){
		$(".gcch").css('display','none');
	}
	
	
   var whichp = "<%=request.getAttribute("whichp")%>";
						if (whichp != "") {
							if (whichp == "s") {
								$("#signature").css('display', 'block');
								$("#table_2").css('display', 'none');
								window.print();
							}
						} else if (whichp == "detail") {
							//
						}
						//维修记录
						loadFailedRecord();
						function loadFailedRecord() {
							var _service_number = "${map.service_number }";
							if (_service_number != "") {
								$
										.getJSON(
												"longhaul/pos/aftersales/aftersales.ered?reqCode=getFailedReason&postType=1&random="
														+ Math.random(),
												{
													werks : WERKS,
													service_number : _service_number,
													after_type : 1
												},
												function(data) {
													if (data == "") {
														//jAlert('无数据存在!', '提示', function(r) { });
														return;
													}
													$
															.each(
																	data,
																	function(
																			key,
																			val) {
																		stylcss = key % 2 == 0 ? "failed_reason_tr"
																				: "failed_reason_tr";
																		row = "<tr class=" + stylcss + ">";
																		var factory_receive_date = val.factory_receive_date == null ? "&nbsp;"
																				: val.factory_receive_date;
																		row = row
																				+ "<td>返修记录"
																				+ (key + 1)
																				+ "</td><td>工厂收货日期："
																				+ factory_receive_date
																				+ "</td>";
																		var failed_reason = val.failed_reason == null ? "&nbsp;"
																				: val.failed_reason;
																		row = row
																				+ "<td>不合格原因："
																				+ val.failed_reason
																				+ "</td>";
																		row = row
																				+ "</tr>"
																		$(
																				"#table_2 tr:eq(17)")
																				.after(
																						row);
																	});
												});
							}
						}
					});
</script>
