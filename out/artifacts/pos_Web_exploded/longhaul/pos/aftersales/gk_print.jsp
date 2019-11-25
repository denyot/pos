<%@ page contentType="text/html;charset=GBK" language="java"
	import="java.sql.*,java.util.*,java.util.List,java.util.ArrayList,org.eredlab.g4.bmf.base.IReader,org.eredlab.g4.bmf.util.SpringBeanLoader,org.eredlab.g4.ccl.util.G4Utils,java.math.BigDecimal"
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
		<title>售后单据-改款</title>
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

		<%

IReader reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
String ordernum=request.getParameter("ordernum").trim();

String dwbh=request.getParameter("dwbh");	
String ywxh=request.getParameter("ywxh");
String sapsalesorderid="";
Connection conn  = null;
PreparedStatement ps=null;
ResultSet rs=null;
PreparedStatement ps2=null;
ResultSet rs2=null;
String ls_sql=null;

String charg = "";
String name = "";

String vipid = "";

double yhpjz=0.00;	//原货品金重
double jljg=0.00;		//原金料价格

double xhpjz = 0.00;	//新货品金重
double xhpjlj = 0.00;		//新货品金料价

double zsjgf = 0.00;//主石加工费
double gkf=0.00;			//该款费
double fsjgf = 0.00;	//副石加工费
double fsfy = 0.00;//副石费用
double zsf = 0.00;		//证书费
double qbf=0.00;		//起版费

double jlf = 0.00;

String dh="";		//单号
double TotalAmount = 0.00;			//统计

double jlsh = 0.00;


String Xsbj = "";
try {
	
	conn=reader.getConnection();
	ls_sql = "select prepared_commodity_barcode,facelift_bag,mainstone_process_fees,old_gold_weight_cus,gold_material_loss ,vicestone_cost_cus ,old_gold_price_cus,ifnull((select tslbm from z_rfc_store_09_it_sl where zslbm = mf_stone_kind limit 1),mf_stone_kind) mf_stone_kind,"+
	"total_vicestone_process_fees_cus,new_gold_weight_cus, mf_stone_weight,certificate_cost,new_gold_price_cus,"+
	"facelift_labor_charge,version_cost_cus,member_cardnumber,service_number ,real_repair_amount_cus ,(select style from pos_facelift_bag where pos_sales_service.facelift_bag = pos_facelift_bag.code) faceliftname "+
	"from pos_sales_service where service_number = '"+ ordernum +"' and service_type = '2' ";
	
	ps= conn.prepareStatement(ls_sql);
	rs=ps.executeQuery();
	%>
	<%
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
		charg = rs.getString("prepared_commodity_barcode");
		vipid=rs.getString("member_cardnumber");
		name = rs.getString("faceliftname");
		yhpjz=rs.getDouble("old_gold_weight_cus");
		fsfy=rs.getDouble("vicestone_cost_cus");
		zsjgf = rs.getDouble("mainstone_process_fees");
		jljg=rs.getDouble("old_gold_price_cus");	
		fsjgf=rs.getDouble("total_vicestone_process_fees_cus");
		xhpjz=rs.getDouble("new_gold_weight_cus");	
		zsf=rs.getDouble("certificate_cost");
		jlsh = rs.getDouble("gold_material_loss");
		xhpjlj=rs.getDouble("new_gold_price_cus");
		gkf=rs.getDouble("facelift_labor_charge");
		qbf = rs.getDouble("version_cost_cus");
		dh=rs.getString("service_number");
		TotalAmount=rs.getDouble("real_repair_amount_cus");
		
		%>
		
		<tr >
		<td width="5%" ></td>
			<TD width="25%" align="left"></TD>
			<td width="35%" align="center"><h3>
			<% 
			if(G4Utils.isNotEmpty(charg)){
				if("KL".equals(charg.substring(0,2))){
					out.print("客来石");
				}else{
					out.print("改款");
				}
			}else{
				out.print("改款");
			}
			%></h3></td>
			<td width="20%"></td>
			<td></td>
			
		</tr>
		
				<tr>
				<td></td>
					<td>批次号：
					<% if (G4Utils.isNotEmpty(charg))
					{
						out.print(charg);
					}else{
						out.print("");
					}
					%>
					</td>
					<td></td>
					<td>名称：
					<% if (G4Utils.isNotEmpty(name))
					{
						out.print(name);
					}else{
						out.print("");
					}
					%>
					</td>
					</tr>
				
				<tr>
					<td></td>
					<td><br/>
					金料费用：
					<% if (G4Utils.isNotEmpty(fsfy)){
						gkf = zsjgf+fsjgf+fsfy+zsf+qbf;
						out.print(df.format(TotalAmount-gkf));
						jlf = TotalAmount-gkf;
					}else{
						out.print(0);
					}
					%>
					</td>
					<td></td>
					<td><br/>
					改款费用：
					<% if (G4Utils.isNotEmpty(fsjgf)){
						out.print(df.format(TotalAmount-jlf));
						//gkf = zsjgf+fsjgf+fsfy+zsf+qbf;
					}else{
						out.print(0);
					}
					%>
					</td>
				</tr>
		
		<%
		}%>
		<script>
			var count = '<%=iRow %>';
		</script>
		<tr >
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td id="hj"><br/>合计：￥
			<% 
			//double   f =   (G4Utils.isNotEmpty(TotalAmount)?TotalAmount : 0.0));  
			BigDecimal   b   =   new   BigDecimal(TotalAmount);  
			double   f1 = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue();  
			out.print(f1);
			%>
			</td>
			
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
				<td width="25%">Membership No.(会员卡)：</td>
				<td width="40%"><%=vipid%><td>
			</tr>
		</TABLE>
	</div>
	<%
}
catch (Exception e) {
	System.out.println("错误，门店质保单打印错误：" + e);
	out.print("错误，请把该错误提供给系统管理员：" + e);
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
	////         out.println("关闭连接发生以外,Exception:"+e.getMessage());
	//		 if (conn != null && !conn.isClosed()) conn.close(); 
	//   }
}
%>

</body>
</html>
<script language="javascript" type="text/javascript"> 
	var LODOP; //声明为全局变量
	function myShow() {		
		LODOP=getLodop(document.getElementById('LODOP'),document.getElementById('LODOP_EM'));  
		LODOP.SET_LICENSES("深圳市论衡信息技术有限公司","459626380837383919278901905623","","");
		LODOP.PRINT_INITA(0,0,"220mm","150mm","打印控件功能演示_Lodop功能_显示模式");
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
		
		LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);		//打印预览时是否包含背景图
		LODOP.SET_SHOW_MODE("BKIMG_LEFT",0);
		LODOP.SET_SHOW_MODE("BKIMG_TOP",0);	
		LODOP.SET_SHOW_MODE("BKIMG_WIDTH","260mm");
		LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","140mm");
		LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW",1);//隐藏预览窗口的打印按钮
		LODOP.SET_SHOW_MODE("HIDE_SBUTTIN_PREVIEW",1);//隐藏预览窗口的打印设置按钮
		LODOP.SET_SHOW_MODE("HIDE_QBUTTIN_PREVIEW",1);//隐藏预览窗口的关闭按钮
		LODOP.SET_SHOW_MODE("HIDE_PAGE_PERCENT",1);//隐藏预览窗口的关闭按钮

		LODOP.SET_SHOW_MODE("PREVIEW_IN_BROWSE",1);		//打印预览界面是否内嵌到网页内部


		LODOP.ADD_PRINT_TEXT(73,755,105,52,"第#页/共&页");
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
		
