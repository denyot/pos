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
		<title>��ӡ����-ά��</title>
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
					<input type="button" value=" ��ӡ " onClick="f_print()">
					<input type="button" value="���� " onClick="f_setup()">
					<input type="button" value=" �ر� " onClick="f_close()">
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
							�ŵ�:
						</td>
						<td>
							${map.store_name }
						</td>

						<td>
							����:
						</td>
						<td>
							ά��
						</td>
						<td>
							���:
						</td>
						<td>
							${map.service_number }
						</td>
					</tr>
					<!-- first -->
					 <tr>
						<td>
							�˿�����:
						</td>
						<td>
							${map.member_name }
						</td>
						<td>
							��Ա����:
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
							�绰:
						</td>
						<td>
							${map.telephone }
						</td>
						<td>
							Ͷ�ߵ���:
						</td>
						<td>
							${map.complaints_number }
						</td>
					</tr>
					<tr>
						<td>
							��Ʒ����:
						</td>
						<td>
							${map.old_commodity_barcode }
						</td>
						<td>
							Ʒ��:
						</td>
						<td>
							<input type="hidden" name="product_image" id="product_image" />
							${map.trade_name }
						</td>
					</tr>
					<tr>
						<td>
							ԭ��Ʒ����:
						</td>
						<td>
							${map.old_goods_weight } g
						</td>
						<td>
							ʯ������:
						</td>
						<td>
							${map.old_stone_weight } ct
						</td>
					</tr>
					<tr>
						<td>
							ʵ�ռ�:
						</td>
						<td>
							${map.clinch_price } Ԫ
						</td>
						<td>
							��������:
						</td>
						<td>
							${map.sell_date }
						</td>
					</tr>
					<tr>
						<td>
							ʵ�ջ�Ʒ����:
						</td>
						<td colspan="5">
							${map.real_goods_weight } g
						</td>

					</tr>
					<tr>
						<td>
							��������:
						</td>
						<td>
							${map.accept_date }
						</td>
						<td>
							Ԥ��ȡ������:
						</td>
						<td colspan="3">
							${map.expected_pickup_date }
						</td>

					</tr>
					<tr>
						<td>
							�ۺ������Ŀ:
						</td>
						<td>
							${map.after_ss_project }
						</td>
						<td>
							ά�޴���:
						</td>
						<td colspan="3">
							${map.repair_count }
						</td>
					</tr>
					<tr class="replacement_span" style="display: none;">
						<td>
							���:
						</td>
						<td>
							${map.replacement }
						</td>
						<td>
							����۸�:
						</td>
						<td colspan="3">
							${map.replacement_cost } Ԫ
						</td>

					</tr>
					<tr>
						<td>
							������ı���%:
						</td>
						<td>
							${map.gold_loss_ratio }
						</td>
						<td>
							�˿��ر�Ҫ��:
						</td>
						<td colspan="3">
							${map.cus_requirement }
						</td>

					</tr>
					<tr>
						<td>
							�̳�ά�޷���:
						</td>
						<td>
							${map.store_repair_costs } Ԫ
						</td>
						<td>
							Ԥ��ά�޷���:
						</td>
						<td colspan="3">
							${map.expected_repair_costs } Ԫ
						</td>

					</tr>
					<tr>
						<td>
							ר��������:
						</td>
						<td>
							${map.accept_people_first }
						</td>
						<td>
							��ע:
						</td>
						<td colspan="3">
							${map.remark1 }
						</td>

					</tr> 
					<tr>
						<td colspan="2">
							�˿�ά��ȷ��______________
						</td>

						<td colspan="4">
							ȡ��ȷ��______________
						</td>

					</tr>
			</table>

		</div>


	</body>
</html>
<script language="javascript" type="text/javascript">
	var LODOP; //����Ϊȫ�ֱ���
	function myShow() {
		LODOP = getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'));
		LODOP.SET_LICENSES("�������ۺ���Ϣ�������޹�˾", "459626380837383919278901905623", "", "");
		LODOP.PRINT_INITA(0, 0, "220mm", "150mm", "��ӡ�ؼ�������ʾ_Lodop����_��ʾģʽ");
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

		LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW", 1); //��ӡԤ��ʱ�Ƿ��������ͼ
		LODOP.SET_SHOW_MODE("BKIMG_LEFT", 0);
		LODOP.SET_SHOW_MODE("BKIMG_TOP", 0);
		LODOP.SET_SHOW_MODE("BKIMG_WIDTH", "260mm");
		LODOP.SET_SHOW_MODE("BKIMG_HEIGHT", "140mm");
		LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW", 1);//����Ԥ�����ڵĴ�ӡ��ť
		LODOP.SET_SHOW_MODE("HIDE_SBUTTIN_PREVIEW", 1);//����Ԥ�����ڵĴ�ӡ���ð�ť
		LODOP.SET_SHOW_MODE("HIDE_QBUTTIN_PREVIEW", 1);//����Ԥ�����ڵĹرհ�ť
		LODOP.SET_SHOW_MODE("HIDE_PAGE_PERCENT", 1);//����Ԥ�����ڵĹرհ�ť

		LODOP.SET_SHOW_MODE("PREVIEW_IN_BROWSE", 1); //��ӡԤ�������Ƿ���Ƕ����ҳ�ڲ�

		LODOP.ADD_PRINT_TEXT(-20, 5, 105, 52, "��#ҳ/��&ҳ");
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