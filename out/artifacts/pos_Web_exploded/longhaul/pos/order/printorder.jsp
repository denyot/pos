<%@ page contentType="text/html;charset=GBK" language="java" 
import="java.sql.*,java.util.*,java.util.List,java.util.ArrayList,org.eredlab.g4.bmf.base.IReader,org.eredlab.g4.bmf.util.SpringBeanLoader,org.eredlab.g4.ccl.util.G4Utils" 
errorPage="" %>
<%  request.setCharacterEncoding("GBK");
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>

<head>

<base href="<%=basePath%>">
<SCRIPT language=javascript src="resource/jnprint/LodopFuncs.js"></SCRIPT>


<meta http-equiv="Content-Type" content="text/html; charset=GBK" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<title>打印销售单</title>

</head>
<body onload="myShow()">
<table>
<tr align="center"> 
  <td> 
	<input type="button"  value=" 打印 " onClick="f_print()">
	<input type="button"  value=" 关闭 " onClick="f_close()"> 
  </td>
</tr>

</table>

<object  id="LODOP" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA"  width=900 height=700>  
       <embed id="LODOP_EM" type="application/x-print-lodop"  width=900 height=700></embed> 
</object> 


<%

IReader reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");

String dwbh=request.getParameter("dwbh");	
String salesorderid=request.getParameter("salesorderid");
String sapsalesorderid=request.getParameter("sapsalesorderid");
Connection conn  = null;
PreparedStatement ps=null;
ResultSet rs=null;
PreparedStatement ps2=null;
ResultSet rs2=null;
String ls_sql=null;

String VipCard="";						//会员卡 
String SaleDate="";						//销售日期

String TotalMoney="0";				//总金额
String dwmc="";								//分店名称
String cpbm = "";							//产品编码
String cpmc = "";							//产品名称
double GoldWeight = 0;				//金重
String TagPrice = "";					//标签价
String StoreDiscount = "";		//折扣
String TotalAmount = "";			//金额
double zszl=0;								//主石重
String xsd="";			    			//级别描述
String zf="";									//尺寸
String BatchNumber="";				//批次
String SALESQUANTITY="";			//数量
String Xsbj="";								//销售金价算法标记:接口有取到值则按件卖为X，否则为空
double hpzl = 0;
double goodsize =0;
String sjczbm="";							//级别描述
double GOODSPROCESSINGFEE=0;	//黄金加工费
double GOLDPRICE=0;					  //黄金价
String TOTALMONEY="";					//总金额
String dwdh="";
String CASH="";
String UNIONPAY="";
String SHOPPINGCARD="";
String SUBSCRIPTION="";
String REMARKS="";
String lplx="";
String SALESCLERK = "";				//营业员
String zhjl = "";
try {
	
	conn=reader.getConnection();

	ls_sql = "select NAME1 Xsbj from z_rfc_store_06_it_t001w where WERKS='"+dwbh+"'";
	ps= conn.prepareStatement(ls_sql);
	rs=ps.executeQuery();
	while (rs.next())
	{
		Xsbj = rs.getString("Xsbj");
	}
	ps.close();
	rs.close();


	ls_sql = "select BatchNumber,IF(BatchNumber='',MaterialNumber,BatchNumber) cpbm,Materialdesc,ZZLNN zszl,b.hpzl,b.zccnn goodsize,"+
	"0 xsd,ZCLZL GoldWeight,0 zf,TagPrice TagPrice,(((case DISCOUNT1 when 'N/A' then 100 else DISCOUNT1 end)*(case DISCOUNT2 when 'N/A' then 100 else DISCOUNT2 end)*(case DISCOUNT3 when 'N/A' then 100 else DISCOUNT3 end)"+
"*(case DISCOUNT4 when 'N/A' then 100 else DISCOUNT4 end)*(case DISCOUNT5 when 'N/A' then 100 else DISCOUNT5 end))/100/100/100/100) StoreDiscount,TotalAmount, SALESQUANTITY,b.ZJLBM sjczbm,"+
	"GOODSPROCESSINGFEE,GOLDPRICE,0 lplx,0 zhjl from aig_orderitem a left join z_rfc_store_03_it_charg b on "+
	"( a.BatchNumber=b.CHARG )  left join z_rfc_store_01_it_mara d on "+
	"( a.MaterialNumber = d.MATNR)"; 
	
	ls_sql += " where SalesOrderID='"+salesorderid+"' and a.ORDERITEMTYPE !='ZTNN' order by SALESORDERITEM ";
		
	
	//out.println(ls_sql);
	
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
		java.text.DecimalFormat df =new   java.text.DecimalFormat("#.00");  
		BatchNumber=rs.getString("BatchNumber");
		cpbm=rs.getString("cpbm");
		cpmc=rs.getString("Materialdesc");
		zszl=rs.getDouble("zszl");	
		xsd=rs.getString("xsd");
		hpzl=rs.getDouble("hpzl");
		GoldWeight=rs.getDouble("GoldWeight");		
		goodsize = rs.getDouble("goodsize");
		zf=rs.getString("zf");
		TagPrice=rs.getString("TagPrice");
		StoreDiscount=rs.getString("StoreDiscount");
		TotalAmount=rs.getString("TotalAmount");
		SALESQUANTITY=rs.getString("SALESQUANTITY");
		sjczbm=rs.getString("sjczbm");
		GOODSPROCESSINGFEE=rs.getDouble("GOODSPROCESSINGFEE");
		GOLDPRICE=rs.getDouble("GOLDPRICE");
		lplx=rs.getString("lplx");
		zhjl=rs.getString("zhjl");
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
			<TD width="25%" align="left"><%=cpbm%></TD>
			<TD width="25%" align="left"><%=cpmc%></TD>
			<td width="15%" ></td>
			<td width="15%" ></td>
			<td width="15%" ></td>
		</tr>
		
		<%if(!"".equals(BatchNumber) ){%>
				<tr>
				<td width="5%" ></td>
					<td>重量：
					<% if (G4Utils.isNotEmpty(hpzl))
					{
						out.print(hpzl);
					}else{
						out.print(0);
					}
					%>
					</td>
					<td>尺寸：
					<% if (G4Utils.isNotEmpty(goodsize))
					{
						out.print(goodsize);
					}else{
						out.print(0);
					}
					%>&nbsp;&nbsp;工费：
					<% if (G4Utils.isNotEmpty(GOODSPROCESSINGFEE)){
						out.print(GOODSPROCESSINGFEE);
					}else{
						out.print(0);
					}
					%>
					</td>
					<td align="right">￥<%=TagPrice%></td>
					<td align="center">
					<% 
					if (G4Utils.isNotEmpty(StoreDiscount)){
						out.print(StoreDiscount+"%");
					}else{
						out.print(0);
					}
					%>
					</td>
					<td align="right">￥<%=TotalAmount%></td>
				</tr>
			<!-- <tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				</tr> -->	
		
		<%}
		}%>
		<tr >
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td align="center">合计：</td>
			<td align="right">
			<%
				ls_sql = " select VipCard,SaleDate SaleDate,TotalMoney,z_rfc_store_06_it_t001w.NAME1 dwmc,WERKS dwdh,";
				ls_sql += " CASH,UNIONPAY,SHOPPINGCARD,SUBSCRIPTION,REMARKS,SALESCLERK from aig_orderhead,z_rfc_store_06_it_t001w ";
				ls_sql += " where aig_orderhead.StoreID = z_rfc_store_06_it_t001w.WERKS and SalesOrderID='"+ywxh+"'";
				//out.println(ls_sql);
				//System.out.println(ls_sql);
				
				ps2= conn.prepareStatement(ls_sql);
				rs2=ps2.executeQuery();
				if(rs2.next())
				{
					TOTALMONEY="￥"+rs2.getString("TOTALMONEY");			
					VipCard=rs2.getString("VipCard");
					SaleDate=rs2.getString("SaleDate");		
					SaleDate = SaleDate.length() > 10 ? SaleDate.substring(0,10):SaleDate;
					TotalMoney=rs2.getString("TotalMoney");
					dwmc=rs2.getString("dwmc");
					dwdh=rs2.getString("dwdh");
					REMARKS =rs2.getString("REMARKS");
					SALESCLERK =rs2.getString("SALESCLERK");
					CASH=rs2.getString("CASH");
					if (!"".equals(CASH) && !"0".equals(CASH))
					{
						CASH = "现金￥"+ CASH + " ";
					}
					else
					{
						CASH = "";
					}

					UNIONPAY=rs2.getString("UNIONPAY");
					if (!"".equals(UNIONPAY) && !"0".equals(UNIONPAY))
					{
						UNIONPAY = "银联￥"+UNIONPAY+" ";
					}
					else
					{
						UNIONPAY = "";
					}

					SHOPPINGCARD=rs2.getString("SHOPPINGCARD");
					if (!"".equals(SHOPPINGCARD) && !"0".equals(SHOPPINGCARD))
					{
						SHOPPINGCARD = "购物卡￥" + SHOPPINGCARD +" ";
					}
					else
					{
						SHOPPINGCARD = "";
					}


					SUBSCRIPTION=rs2.getString("SUBSCRIPTION");
					if (!"".equals(SUBSCRIPTION) && !"0".equals(SUBSCRIPTION))
					{
						SUBSCRIPTION = "订金￥"+SUBSCRIPTION;
					}
					else
					{
						SUBSCRIPTION = "";
					}
				}
				rs2.close();
				ps2.close();
				out.print(TOTALMONEY);
			%>
			</td>
		</tr>
		<tr>
			<td colspan="5">
			<%=REMARKS%>
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
				<td width="33%">Membership No.(会员卡)：</td>
				<td width="67%"><%=VipCard%><td>
			</tr>
	 		<tr>
	 		<td width="5%" ></td>
				<td>Date(销售日期)：</td>
				<td><%=SaleDate%><td>
			</tr>
			<tr>
			<td width="5%" ></td>
				<td>&nbsp;</td><td><%=dwmc%>&nbsp;&nbsp;<%=dwdh%><td>
			</tr>
			<!-- 
			<tr>
				<td>&nbsp;</td><td><%=SALESCLERK%><td>
			</tr> 
			 
			<tr>
				<td>&nbsp;</td><td>&nbsp;<td>
			</tr> 
			-->
			<tr>
			<td width="5%" ></td>
				<td>&nbsp;</td><td><%=CASH%><%=UNIONPAY%><%=SHOPPINGCARD%><span style="display: inline;margin-left: 50px;">单号：<%=sapsalesorderid %></span><td>
			</tr> 
		</table>
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
		LODOP.SET_PRINT_PAGESIZE(1,"220mm","150mm","LodopCustomPage");

		LODOP.ADD_PRINT_TABLE(200,0,"95%","85mm",document.getElementById("div2").innerHTML); 

		LODOP.ADD_PRINT_HTM(390,0,"95%","70mm",document.getElementById("div3").innerHTML);
		
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