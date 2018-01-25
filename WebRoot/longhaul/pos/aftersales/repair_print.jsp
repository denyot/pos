<%@page import="com.sun.org.apache.xalan.internal.xsltc.compiler.sym"%>
<%@ page contentType="text/html;charset=GBK" language="java"
	import="java.sql.*,java.util.*,java.util.List,java.util.ArrayList,org.eredlab.g4.bmf.base.IReader,org.eredlab.g4.bmf.util.SpringBeanLoader,org.eredlab.g4.ccl.util.G4Utils"
	errorPage=""%>
<%
	request.setCharacterEncoding("GBK");
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	request.getAttribute("map");
	System.out.println(request.getAttribute("map"));
	System.out.println("hellk");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">
		<title>打印订单-维修</title>
		<base href="<%=basePath%>">
		<SCRIPT language=javascript src="resource/jnprint/LodopFuncs.js"></SCRIPT>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK" />
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
	</head>

	<body onload="myShow()">
		<table>
			<tr align="center">
				<td>
					<input type="button" value=" 打印 " onClick="f_print()">
					<input type="button" value="设置 " onClick="f_setup()">
					<input type="button" value=" 关闭 " onClick="f_close()">
				</td>
			</tr>

		</table>

		<object id="LODOP"
			classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=900
			height=1200>
			<embed id="LODOP_EM" type="application/x-print-lodop" width=900
				height=1200></embed>
		</object>
		<div id="div2" style="display: none;">
			<table border="1px solid #FFFFFF" align="center" width="620px" style="font-size: 10px">
				<TBODY align="left">
					<tr>
						<td>
							门店:
						</td>
						<td>
							${map.store_name }
						</td>

						<td>
							类型:
						</td>
						<td>
							维修
						</td>
						<td>
							编号:
						</td>
						<td>
							${map.service_number }
						</td>
					</tr>
					<!-- first -->
					 <tr>
						<td>
							顾客姓名:
						</td>
						<td>
							${map.member_name }
						</td>
						<td>
							会员卡号:
						</td>
						<td>
							${map.member_cardnumber }
						</td>
						<td rowspan="5" class="inputleft" colspan="2">
							<img src="<%=basePath %>/sappic/${map.charg_image }" width="100px" height="80px" id="charg_image"/>
						</td>
					</tr>
					<tr>
						<td>
							电话:
						</td>
						<td>
							${map.telephone }
						</td>
						<td>
							投诉单号:
						</td>
						<td>
							${map.complaints_number }
						</td>
					</tr>
					<tr>
						<td>
							商品批次:
						</td>
						<td>
							${map.old_commodity_barcode }
						</td>
						<td>
							品名:
						</td>
						<td>
							<input type="hidden" name="product_image" id="product_image" />
							${map.trade_name }
						</td>
					</tr>
					<tr>
						<td>
							原货品总重:
						</td>
						<td>
							${map.old_goods_weight } g
						</td>
						<td>
							石料重量:
						</td>
						<td>
							${map.old_stone_weight } ct
						</td>
					</tr>
					<tr>
						<td>
							实收价:
						</td>
						<td>
							${map.clinch_price } 元
						</td>
						<td>
							出售日期:
						</td>
						<td>
							${map.sell_date }
						</td>
					</tr>
					<tr>
						<td>
							实收货品重量:
						</td>
						<td colspan="5">
							${map.real_goods_weight } g
						</td>

					</tr>
					<tr>
						<td>
							受理日期:
						</td>
						<td>
							${map.accept_date }
						</td>
						<td>
							预计取货日期:
						</td>
						<td colspan="3">
							${map.expected_pickup_date }
						</td>

					</tr>
					<tr>
						<td>
							售后服务项目:
						</td>
						<td>
							${map.after_ss_project }
						</td>
						<td>
							维修次数:
						</td>
						<td colspan="3">
							${map.repair_count }
						</td>
					</tr>
					<tr class="replacement_span" style="display: none;">
						<td>
							配件:
						</td>
						<td>
							${map.replacement }
						</td>
						<td>
							配件价格:
						</td>
						<td colspan="3">
							${map.replacement_cost } 元
						</td>

					</tr>
					<tr>
						<td>
							金料损耗比率%:
						</td>
						<td>
							${map.gold_loss_ratio }
						</td>
						<td>
							顾客特别要求:
						</td>
						<td colspan="3">
							${map.cus_requirement }
						</td>

					</tr>
					<tr>
						<td>
							商场维修费用:
						</td>
						<td>
							${map.store_repair_costs } 元
						</td>
						<td>
							预计维修费用:
						</td>
						<td colspan="3">
							${map.expected_repair_costs } 元
						</td>

					</tr>
					<tr>
						<td>
							专柜受理人:
						</td>
						<td>
							${map.accept_people_first }
						</td>
						<td>
							备注:
						</td>
						<td colspan="3">
							${map.remark1 }
						</td>

					</tr> 
					<tr>
						<td colspan="2">
							顾客维修确认______________
						</td>

						<td colspan="4">
							取货确认______________
						</td>

					</tr>
			</table>

		</div>


	</body>
</html>
<script language="javascript" type="text/javascript">
	var LODOP; //声明为全局变量
	function myShow() {
		LODOP = getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'));
		LODOP.SET_LICENSES("深圳市论衡信息技术有限公司", "459626380837383919278901905623", "", "");
		LODOP.PRINT_INITA(0, 0, "220mm", "150mm", "打印控件功能演示_Lodop功能_显示模式");
		LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
<%--if(count % 4 == 0){
			var table1height = "45mm";
		}else{
			table1height = "50mm";
		}
		--%>
		//LODOP.ADD_PRINT_IMAGE(200,8,"10%","10%","<img src="+document.getElementById("charg_image").src +" width="100%''/>");
	LODOP.ADD_PRINT_TABLE(100, 8, "100%", "100mm", document.getElementById("div2").innerHTML);
	

		//LODOP.ADD_PRINT_HTM(390,0,"95%","40mm",document.getElementById("div3").innerHTML);

		LODOP.SET_PRINT_STYLEA(0, "PageIndex", "Last");

		//LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='order.jpg' width='520mm' height='760mm'>");
		LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='aaa.jpg' width='100%'>");

		LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW", 1); //打印预览时是否包含背景图
		LODOP.SET_SHOW_MODE("BKIMG_LEFT", 0);
		LODOP.SET_SHOW_MODE("BKIMG_TOP", 0);
		LODOP.SET_SHOW_MODE("BKIMG_WIDTH", "260mm");
		LODOP.SET_SHOW_MODE("BKIMG_HEIGHT", "140mm");
		LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW", 1);//隐藏预览窗口的打印按钮
		LODOP.SET_SHOW_MODE("HIDE_SBUTTIN_PREVIEW", 1);//隐藏预览窗口的打印设置按钮
		LODOP.SET_SHOW_MODE("HIDE_QBUTTIN_PREVIEW", 1);//隐藏预览窗口的关闭按钮
		LODOP.SET_SHOW_MODE("HIDE_PAGE_PERCENT", 1);//隐藏预览窗口的关闭按钮

		LODOP.SET_SHOW_MODE("PREVIEW_IN_BROWSE", 1); //打印预览界面是否内嵌到网页内部

		LODOP.ADD_PRINT_TEXT(-20, 5, 105, 52, "第#页/共&页");
		LODOP.SET_PRINT_STYLEA(0, "ItemType", 2);
		LODOP.SET_PRINT_STYLEA(0, "Horient", 1);
		LODOP.SET_PRINT_STYLEA(0, "Vorient", 1);

		LODOP.PREVIEW();
		//f_print();
	};

	function f_print() {
		LODOP.PRINT();
		//window.close();
	}
	function f_setup() {
		LODOP.PRINT_SETUP();
		//window.close();
	}

	function f_close() {
		window.close();
	}
</script>