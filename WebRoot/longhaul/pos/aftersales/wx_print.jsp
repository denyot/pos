<%@page import="com.sun.org.apache.xalan.internal.xsltc.compiler.sym"%>
<%@ page contentType="text/html;charset=GBK" language="java"
	import="java.sql.*,java.util.*,java.util.List,java.util.ArrayList,org.eredlab.g4.bmf.base.IReader,org.eredlab.g4.bmf.util.SpringBeanLoader,org.eredlab.g4.ccl.util.G4Utils"
	errorPage=""%>
<%
	request.setCharacterEncoding("GBK");
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">
		<title>�ۺ󵥾�-ά��</title>
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
		
		
		<%

IReader reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");

String ordernum=request.getParameter("ordernum").trim();	

//String ywxh=request.getParameter("ywxh");
String sapsalesorderid="";
Connection conn  = null;
PreparedStatement ps=null;
ResultSet rs=null;
PreparedStatement ps2=null;
ResultSet rs2=null;
String ls_sql=null;

String vipid = "";
String charg = "";
String name = "";
double jj = 0.00;		//�ӽ�
double jg = 0.00;		//���
double slfy = 0.00;	//ʯ�Ϸ���

double TotalAmount = 0.00;			//���
String dh="";		//����
String wxlx = ""; //ά������


try {
	
	conn=reader.getConnection();
	ls_sql = "select old_commodity_barcode,trade_name,member_cardnumber,canadian_gold_cus,gole_price_cus,stone_costs_cus,"+
	"real_repair_amount_cus,after_ss_project,service_number from pos_sales_service where service_number = '"+ ordernum +"' and service_type = '1'";
		
	ps= conn.prepareStatement(ls_sql);
	rs=ps.executeQuery();
	%>
	
	<div id="div2"  style="display:none;">
	<TABLE border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;FONT-SIZE:12PX;font-weight:bold;" >      
	<TBODY>  
	<%
	int iRow = 0;
	while(rs.next()){
		iRow = iRow + 1;
		java.text.DecimalFormat df =new   java.text.DecimalFormat("#.##");  
		charg = rs.getString("old_commodity_barcode");
		name = rs.getString("trade_name");
		vipid=rs.getString("member_cardnumber");
		jj = rs.getDouble("canadian_gold_cus");
		jg = rs.getDouble("gole_price_cus");
		slfy = rs.getDouble("stone_costs_cus");
		TotalAmount=rs.getDouble("real_repair_amount_cus");
		dh=rs.getString("service_number");	
		wxlx = rs.getString("after_ss_project");
		
		if (iRow!=1){%>
		<tr height="1px;">
			<td height="1px;">&nbsp;</td>
			<td height="1px;">&nbsp;</td>
			<td height="1px;">&nbsp;</td>
			<td height="1px;">&nbsp;</td>
			<td height="1px;">&nbsp;</td>
		</tr>
		
		<%}%>
		
		<tr >
		<td width="5%" ></td>
			<TD width="25%" align="left"></TD>
			<TD width="35%" align="center"><h3>ά��</h3></TD>
			<td width="25%" ></td>
			<td  ></td>
			<td width="25"></td>
		</tr>
		
		<%if(!"".equals(dh) ){
			if("��Ȧ".equals(wxlx)){
				TotalAmount = jj * jg;
			}else if("����".equals(wxlx) || "���".equals(wxlx) || "�ⱦ".equals(wxlx)){
				TotalAmount = slfy;
			}
			
		%>
				<tr>
				<td width="5%" ></td>
					<td>���κţ�
					<% if (G4Utils.isNotEmpty(charg))
					{
						out.print(charg);
					}else{
						out.print(0);
					}
					%>
					</td>
					<td></td>
					<td>���ƣ�
					<% if (G4Utils.isNotEmpty(name))
					{
						out.print(name);
					}else{
						out.print(0);
					}
					%>
					</td>
					</tr>
					
					
				
				<tr>
					<td width="5%"></td>
					<td><br/>
					���Ϸ��ã�
					<% if (G4Utils.isNotEmpty(TotalAmount)){
						out.print(TotalAmount);
					}else{
						out.print(0);
					}
					%>
					</td>
					<td><br/>
					</td>
					<td><br/>
					</td>
					
				</tr>
		
		<%}
		}%>
		<script>
			var count = '<%=iRow %>';
		</script>
		<tr >
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td><br/>�ϼƣ���<%=TotalAmount%></td>
			
		</tr>
		<tr>
			<td colspan="5">
			</td>
		</tr>
	</TABLE>
	</div>
	<%
	rs.close();
	ps.close();	


	%>
		<div id="div3" style="display:none;">
		<TABLE border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;FONT-SIZE:12PX;font-weight:bold;" >
			<tr>
			<td width="5%" ></td>
				<td width="25%">Membership No.(��Ա��)��</td>
				<td width="40%"><%=vipid%><td>
			</tr>
		</TABLE>
	</div>
	<%
}
catch (Exception e) {
	System.out.println("�����ŵ��ʱ�����ӡ����" + e);
	out.print("������Ѹô����ṩ��ϵͳ����Ա��" + e);
	e.printStackTrace();
	return;
}
finally 
{
	//try{
	//	if (rs!= null && !rs.isClosed()) rs.close();
	//	if (ps!= null && ! ps.isClosed()) ps.close(); 
	//	if (rs2!= null && !rs2.isClosed()) rs2.close();
	//	if (ps2!= null && !ps2.isClosed()) ps2.close(); 
	//	if (conn != null && !conn.isClosed()) conn.close(); 
	//   }
	//   catch (Exception e){
	////         out.println("�ر����ӷ�������,Exception:"+e.getMessage());
	//		 if (conn != null && !conn.isClosed()) conn.close(); 
	//   }
}
%>

</body>
</html>
<script language="javascript" type="text/javascript"> 
	var LODOP; //����Ϊȫ�ֱ���
	function myShow() {		
		LODOP=getLodop(document.getElementById('LODOP'),document.getElementById('LODOP_EM'));  
		LODOP.SET_LICENSES("�������ۺ���Ϣ�������޹�˾","459626380837383919278901905623","","");
		LODOP.PRINT_INITA(0,0,"220mm","150mm","��ӡ�ؼ�������ʾ_Lodop����_��ʾģʽ");
		LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
	
		if(count % 4 == 0){
			var table1height = "45mm";
		}else{
			table1height = "50mm";
		}
		
		LODOP.ADD_PRINT_TABLE(200,0,"95%",table1height,document.getElementById("div2").innerHTML); 

		LODOP.ADD_PRINT_HTM(390,0,"95%","40mm",document.getElementById("div3").innerHTML);
		
		LODOP.SET_PRINT_STYLEA(0,"PageIndex","Last");

		//LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='order.jpg' width='520mm' height='760mm'>");
		LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='new_order_print.jpg' width='100%'>");
		
		LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);		//��ӡԤ��ʱ�Ƿ��������ͼ
		LODOP.SET_SHOW_MODE("BKIMG_LEFT",0);
		LODOP.SET_SHOW_MODE("BKIMG_TOP",0);	
		LODOP.SET_SHOW_MODE("BKIMG_WIDTH","260mm");
		LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","140mm");
		LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW",1);//����Ԥ�����ڵĴ�ӡ��ť
		LODOP.SET_SHOW_MODE("HIDE_SBUTTIN_PREVIEW",1);//����Ԥ�����ڵĴ�ӡ���ð�ť
		LODOP.SET_SHOW_MODE("HIDE_QBUTTIN_PREVIEW",1);//����Ԥ�����ڵĹرհ�ť
		LODOP.SET_SHOW_MODE("HIDE_PAGE_PERCENT",1);//����Ԥ�����ڵĹرհ�ť

		LODOP.SET_SHOW_MODE("PREVIEW_IN_BROWSE",1);		//��ӡԤ�������Ƿ���Ƕ����ҳ�ڲ�


		LODOP.ADD_PRINT_TEXT(73,755,105,52,"��#ҳ/��&ҳ");
		LODOP.SET_PRINT_STYLEA(0,"ItemType",2);
		LODOP.SET_PRINT_STYLEA(0,"Horient",1);
		LODOP.SET_PRINT_STYLEA(0,"Vorient",1);

		LODOP.PREVIEW();		
		//f_print();
	};

	function f_print(){
		LODOP.PRINT();
			window.close();
	}

	function f_close(){
		window.close();
	}

</script>