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
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">
		<title>打印订单-改款</title>
		<base href="<%=basePath%>">
		<SCRIPT language=javascript src="resource/jnprint/LodopFuncs.js"></SCRIPT>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK" />
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
	</head>

	<body onload="myShow()" style="">
		<table>
			<tr align="center">
				<td>
					<input type="button" value=" 打印 " onClick="f_print()">
					<input type="button" value=" 关闭 " onClick="f_close()">
				</td>
			</tr>

		</table>

		<object id="LODOP"
			classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=900
			height=700>
			<embed id="LODOP_EM" type="application/x-print-lodop" width=900
				height=700></embed>
		</object>
		<div id="div2" style="display: none;">
			<table border="1px solid #FFFFFF" align="center" width="620px" height="150px" style="font-size: 10px" >
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
							<%
								String service_type = request.getAttribute("service_type").toString();
								if("2".equals(service_type)){
									out.print("改款");
								}else if("3".equals(service_type)){
									out.print("配对");
								}
							%>
						</td>
						<td>
							编号:
						</td>
						<td>
							${map.service_number }
						</td>
					</tr>
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
						<td rowspan="6" class="inputleft" colspan="2">
							<img src="<%=basePath %>/sappic/${map.charg_image }" width="100px"
								height="80px" />
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
							 ${map.trade_name }
						</td>
					</tr>
					<tr>
						<td>
							原货品总重: 
						</td>
						<td>
							 ${map.old_goods_weight }
						</td>
						<td>
							原货品石料重: 
						</td>
						<td>
							 ${map.old_stone_weight } ct
						</td>
					</tr>
					<tr>
						<td>
							原货品证书号: 
						</td>
						<td>
							 ${map.old_certificate_number }
						</td>
						<td>
							实收货品重量: 
						</td>
						<td>
							 ${map.real_goods_weight }
						</td>
						 
					</tr>
					<tr>
						<td>
							裸石证书类型: 
						</td>
						<td>
							 ${map.luodan_certificate_type }
						</td>
						<td>
							裸石证书号: 
						</td>
						<td>
							 ${map.luodan_certificate_number }
						</td>
						 
					</tr>
					<tr>
						<td>
							实收价: 
						</td>
						<td>
							 ${map.clinch_price }
						</td>
						<td>
							出售日期: 
						</td>
						<td>
							 ${map.sell_date }
						</td>
						 <td rowspan="6" class="inputleft" colspan="2">
							<img width="100px" height="80px" src="<%=basePath %>/sappic/${map.new_charg_image}"/>
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
						<td>
							 ${map.expected_pickup_date }
						</td>
						 
					</tr>
					<tr>
						<td>
								拟定批次:  
						</td>
						<td>
								${map.prepared_commodity_barcode } 
						</td>
						<td>
							 尺寸:  
						</td>
						<td>
							 ${map.ring } 
						</td>
						
					</tr>
					<tr>
						<td>
							 款式: 
						</td>
						<td>
							 ${map.faceliftname } 
						</td>
						<td>
							工费: 
						</td>
						<td>
							 ${map.mainstone_process_fees }
						</td>
					</tr>
					<tr>
						<td>
							金料: 
						</td>
						<td>
							 ${map.goldname }
						</td>
						<td>
							金料损耗: 
						</td>
						<td>
							 ${map.gold_material_loss }
						</td>
					</tr>
					<tr>
						<td>
							金料成色: 
						</td>
						<td>
							 ${map.gold_material_quality }
						</td>
						<td>
							拟改款物料号:  
						</td>
						<td>
							 ${map.mf_mold_number} 
						</td>
					</tr>
					<tr>
						<td>
							加工费是否免费: 
						</td>
						<td colspan="5">
							 ${map.isfree_process_fees }
						</td>
						
					</tr>
					<tr>
						<td>
							是否含副石: 
						</td>
						<td>
							 ${map.isincluding_vicestone }
						</td>
						<td>
							是副石石料: 
						</td>
						<td colspan="3">
							 ${map.vicestone }
						</td>
						 
					</tr>
					<tr>
						<td>
							是否做证书: 
						</td>
						<td>
							 ${map.isdo_certificate }
						</td>
						<td>
							预计费用: 
						</td>
						<td colspan="3">
							 ${map.expected_cost }
						</td>
						 
					</tr>
					<tr class="isdo_certificate_tr">
						<td>
							证书类型: 
						</td>
						<td>
							 ${map.cername }
						</td>
						<td>
							证书费用: 
						</td>
						<td colspan="3">
							 ${map.certificate_cost }
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
		LODOP = getLodop(document.getElementById('LODOP'), document
				.getElementById('LODOP_EM'));
		LODOP.SET_LICENSES("深圳市论衡信息技术有限公司", "459626380837383919278901905623",
				"", "");
		LODOP.PRINT_INITA(0, 0, "220mm", "150mm", "打印控件功能演示_Lodop功能_显示模式");
		LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
<%--if(count % 4 == 0){
			var table1height = "45mm";
		}else{
			table1height = "50mm";
		}
		--%>
	LODOP.ADD_PRINT_TABLE(90, 8, "100%", "150mm", document
				.getElementById("div2").innerHTML);

		//LODOP.ADD_PRINT_HTM(390,0,"95%","40mm",document.getElementById("div3").innerHTML);

		LODOP.SET_PRINT_STYLEA(0, "PageIndex", "Last");

		//LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='order.jpg' width='520mm' height='760mm'>");
		LODOP
				.ADD_PRINT_SETUP_BKIMG("<img border='0' src='aaa.jpg' width='100%'>");

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

	function f_close() {
		window.close();
	}
</script>