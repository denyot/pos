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
		<title>��ӡ����-�Ŀ�</title>
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
					<input type="button" value=" ��ӡ " onClick="f_print()">
					<input type="button" value=" �ر� " onClick="f_close()">
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
							�ŵ�:
						</td>
						<td>
							${map.store_name }
						</td>

						<td>
							����:
						</td>
						<td>
							<%
								String service_type = request.getAttribute("service_type").toString();
								if("2".equals(service_type)){
									out.print("�Ŀ�");
								}else if("3".equals(service_type)){
									out.print("���");
								}
							%>
						</td>
						<td>
							���:
						</td>
						<td>
							${map.service_number }
						</td>
					</tr>
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
						<td rowspan="6" class="inputleft" colspan="2">
							<img src="<%=basePath %>/sappic/${map.charg_image }" width="100px"
								height="80px" />
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
							 ${map.trade_name }
						</td>
					</tr>
					<tr>
						<td>
							ԭ��Ʒ����: 
						</td>
						<td>
							 ${map.old_goods_weight }
						</td>
						<td>
							ԭ��Ʒʯ����: 
						</td>
						<td>
							 ${map.old_stone_weight } ct
						</td>
					</tr>
					<tr>
						<td>
							ԭ��Ʒ֤���: 
						</td>
						<td>
							 ${map.old_certificate_number }
						</td>
						<td>
							ʵ�ջ�Ʒ����: 
						</td>
						<td>
							 ${map.real_goods_weight }
						</td>
						 
					</tr>
					<tr>
						<td>
							��ʯ֤������: 
						</td>
						<td>
							 ${map.luodan_certificate_type }
						</td>
						<td>
							��ʯ֤���: 
						</td>
						<td>
							 ${map.luodan_certificate_number }
						</td>
						 
					</tr>
					<tr>
						<td>
							ʵ�ռ�: 
						</td>
						<td>
							 ${map.clinch_price }
						</td>
						<td>
							��������: 
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
							��������: 
						</td>
						<td>
							 ${map.accept_date }
						</td>
						<td>
							Ԥ��ȡ������: 
						</td>
						<td>
							 ${map.expected_pickup_date }
						</td>
						 
					</tr>
					<tr>
						<td>
								�ⶨ����:  
						</td>
						<td>
								${map.prepared_commodity_barcode } 
						</td>
						<td>
							 �ߴ�:  
						</td>
						<td>
							 ${map.ring } 
						</td>
						
					</tr>
					<tr>
						<td>
							 ��ʽ: 
						</td>
						<td>
							 ${map.faceliftname } 
						</td>
						<td>
							����: 
						</td>
						<td>
							 ${map.mainstone_process_fees }
						</td>
					</tr>
					<tr>
						<td>
							����: 
						</td>
						<td>
							 ${map.goldname }
						</td>
						<td>
							�������: 
						</td>
						<td>
							 ${map.gold_material_loss }
						</td>
					</tr>
					<tr>
						<td>
							���ϳ�ɫ: 
						</td>
						<td>
							 ${map.gold_material_quality }
						</td>
						<td>
							��Ŀ����Ϻ�:  
						</td>
						<td>
							 ${map.mf_mold_number} 
						</td>
					</tr>
					<tr>
						<td>
							�ӹ����Ƿ����: 
						</td>
						<td colspan="5">
							 ${map.isfree_process_fees }
						</td>
						
					</tr>
					<tr>
						<td>
							�Ƿ񺬸�ʯ: 
						</td>
						<td>
							 ${map.isincluding_vicestone }
						</td>
						<td>
							�Ǹ�ʯʯ��: 
						</td>
						<td colspan="3">
							 ${map.vicestone }
						</td>
						 
					</tr>
					<tr>
						<td>
							�Ƿ���֤��: 
						</td>
						<td>
							 ${map.isdo_certificate }
						</td>
						<td>
							Ԥ�Ʒ���: 
						</td>
						<td colspan="3">
							 ${map.expected_cost }
						</td>
						 
					</tr>
					<tr class="isdo_certificate_tr">
						<td>
							֤������: 
						</td>
						<td>
							 ${map.cername }
						</td>
						<td>
							֤�����: 
						</td>
						<td colspan="3">
							 ${map.certificate_cost }
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
		LODOP = getLodop(document.getElementById('LODOP'), document
				.getElementById('LODOP_EM'));
		LODOP.SET_LICENSES("�������ۺ���Ϣ�������޹�˾", "459626380837383919278901905623",
				"", "");
		LODOP.PRINT_INITA(0, 0, "220mm", "150mm", "��ӡ�ؼ�������ʾ_Lodop����_��ʾģʽ");
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

	function f_close() {
		window.close();
	}
</script>