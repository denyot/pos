<%@ page contentType="text/html;charset=GBK" language="java" 
import="java.sql.*,java.util.*,java.util.List,java.util.ArrayList,org.eredlab.g4.bmf.base.IReader,org.eredlab.g4.bmf.util.SpringBeanLoader,org.eredlab.g4.ccl.util.G4Utils,cn.longhaul.pos.common.Common,java.math.BigDecimal" 
errorPage="" %>
<%  request.setCharacterEncoding("GBK");
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>

<head>

<base href="<%=basePath%>">
<script src="resource/jquery/jquery-1.7.2.js"></script>
<SCRIPT language=javascript src="resource/jnprint/LodopFuncs.js"></SCRIPT>


<meta http-equiv="Content-Type" content="text/html; charset=GBK" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<title>��ӡ���۵�</title>

</head>
<body onload="myShow()">
<table>
<tr align="center"> 
  <td> 
	<input type="button"  value=" ��ӡ " onClick="f_print()">
	<input type="button"  value=" �ر� " onClick="f_close()"> 
	<input type="button"  value=" ���� " onClick="f_setup()"> 
  </td>
</tr>

</table>

<object  id="LODOP" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA"  width=900 height=1200>  
       <embed id="LODOP_EM" type="application/x-print-lodop"  width=900 height=1200></embed> 
</object> 


<%

IReader reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");

String dwbh=request.getParameter("dwbh");	
String ywxh=request.getParameter("ywxh");
String sapsalesorderid="";
Connection conn  = null;
PreparedStatement ps=null;
ResultSet rs=null;
PreparedStatement ps2=null;
ResultSet rs2=null;
String ls_sql=null;

String VipCard="";						//��Ա�� 
String SaleDate="";						//��������

String TotalMoney="0";				//�ܽ��
String dwmc="";								//�ֵ�����
String cpbm = "";							//��Ʒ����
String cpmc = "";							//��Ʒ����
double GoldWeight = 0;				//����
String TagPrice = "";					//��ǩ��
Integer StoreDiscount = 100;		//�ۿ�
String TotalAmount = "";			//���
double zszl=0;								//��ʯ��
String xsd="";			    			//��������
String zf="";									//�ߴ�
String BatchNumber="";				//����
String SALESQUANTITY="";			//����
String Xsbj="";								//���۽���㷨���:�ӿ���ȡ��ֵ�򰴼���ΪX������Ϊ��
double hpzl = 0;
String goodsize ="";
String sjczbm="";							//��������
double GOODSPROCESSINGFEE=0;	//�ƽ�ӹ���
double GOLDPRICE=0;					  //�ƽ��
String TOTALMONEY="";					//�ܽ��
String dwdh="";
String CASH="";
String UNIONPAY="";
String SHOPPINGCARD="";
String SUBSCRIPTION="";
String REMARKS="";
String lplx="";
String SALESCLERK = "";				//ӪҵԱ
String zhjl = "";
String giftmethod = "";
String orderitemtype = "";
String choiceorderid = "";
String currentIntegral = "";
String memberIntegral = "";
String totalintegral = "";
try {
	conn=reader.getConnection();
	ls_sql = " select VipCard,SaleDate SaleDate, AMOUNTCOLLECTED TotalMoney,z_rfc_store_06_it_t001w.NAME1 dwmc,WERKS dwdh,sapsalesorderid,choiceorderid,";
	ls_sql += " CASH,UNIONPAY,SHOPPINGCARD,SUBSCRIPTION,REMARKS,SALESCLERK,currentintegral,(select zhyjf from z_rfc_store_05_gt_vip where SORT2=aig_orderhead.vipcard and name1 <> 'δ�����Ա��') totalintegral,";
    ls_sql += "(select zhyjf from z_rfc_store_05_gt_vip where SORT2=aig_orderhead.vipcard  and name1 <> 'δ�����Ա��') memberintegral from aig_orderhead,z_rfc_store_06_it_t001w ";
	ls_sql += " where aig_orderhead.StoreID = z_rfc_store_06_it_t001w.WERKS and SalesOrderID='"+ywxh+"'";
	//out.println(ls_sql);
	//System.out.println(ls_sql);
	
	ps2= conn.prepareStatement(ls_sql);
	rs2=ps2.executeQuery();
	if(rs2.next())
	{
		TOTALMONEY="��"+rs2.getString("TOTALMONEY");			
		VipCard=rs2.getString("VipCard");
		SaleDate=rs2.getString("SaleDate");		
		SaleDate = SaleDate.length() > 10 ? SaleDate.substring(0,10):SaleDate;
		TotalMoney=rs2.getString("TotalMoney");
		dwmc=rs2.getString("dwmc");
		dwdh=rs2.getString("dwdh");
		sapsalesorderid=rs2.getString("sapsalesorderid");
		choiceorderid=rs2.getString("choiceorderid");
		currentIntegral = rs2.getString("currentintegral");
		memberIntegral = rs2.getString("memberintegral");
		totalintegral = rs2.getString("totalintegral");
		REMARKS =rs2.getString("REMARKS");
		SALESCLERK =rs2.getString("SALESCLERK");
		CASH=rs2.getString("CASH");
		if (!"".equals(CASH) && !"0".equals(CASH))
		{
			CASH = "�ֽ�"+ CASH + " ";
		}
		else
		{
			CASH = "";
		}

		UNIONPAY=rs2.getString("UNIONPAY");
		if (!"".equals(UNIONPAY) && !"0".equals(UNIONPAY))
		{
			UNIONPAY = "������"+UNIONPAY+" ";
		}
		else
		{
			UNIONPAY = "";
		}

		SHOPPINGCARD=rs2.getString("SHOPPINGCARD");
		if (!"".equals(SHOPPINGCARD) && !"0".equals(SHOPPINGCARD))
		{
			if("ZL2N".equals(orderitemtype) || "ZL3N".equals(orderitemtype)){
				SHOPPINGCARD = "";
			} else {
				SHOPPINGCARD = "���￨��" + SHOPPINGCARD +" ";
			}
		}
		else
		{
			SHOPPINGCARD = "";
		}


		SUBSCRIPTION=rs2.getString("SUBSCRIPTION");
		if (!"".equals(SUBSCRIPTION) && !"0".equals(SUBSCRIPTION))
		{
			SUBSCRIPTION = "����"+SUBSCRIPTION;
		}
		else
		{
			SUBSCRIPTION = "";
		}
	}
	rs2.close();
	ps2.close();

	ls_sql = "select NAME1 Xsbj from z_rfc_store_06_it_t001w where WERKS='"+dwbh+"'";
	ps= conn.prepareStatement(ls_sql);
	rs=ps.executeQuery();
	while (rs.next())
	{
		Xsbj = rs.getString("Xsbj");
	}
	ps.close();
	rs.close();


//	ls_sql = "select BatchNumber,IF(BatchNumber='',MaterialNumber,BatchNumber) cpbm,Materialdesc,ZZLNN zszl,b.hpzl,b.zccnn goodsize,giftmethod,"+
//	"0 xsd,ZCLZL GoldWeight,0 zf,TagPrice TagPrice,(((case DISCOUNT1 when 'N/A' then 100 else DISCOUNT1 end)*(case DISCOUNT2 when 'N/A' then 100 else DISCOUNT2 end)*(case DISCOUNT3 when 'N/A' then 100 else DISCOUNT3 end)"+
//"*(case DISCOUNT4 when 'N/A' then 100 else DISCOUNT4 end)*(case DISCOUNT5 when 'N/A' then 100 else DISCOUNT5 end))/100/100/100/100) StoreDiscount,TotalAmount, SALESQUANTITY,b.ZJLBM sjczbm,"+
//	"GOODSPROCESSINGFEE,GOLDPRICE,0 lplx,0 zhjl from aig_orderitem a left join z_rfc_store_03_it_charg b on "+
//	"( a.BatchNumber=b.CHARG )  left join z_rfc_store_01_it_mara d on "+
//	"( a.MaterialNumber = d.MATNR)"; 

	ls_sql = "select BatchNumber,IF(BatchNumber='',MaterialNumber,BatchNumber) cpbm,Materialdesc,ZZLNN zszl,ifnull(b.hpzl, abs(GoldWeight)*SALESQUANTITY) hpzl,b.zccnn goodsize,giftmethod,"+
	"0 xsd,GoldWeight GoldWeight,0 zf,tagprice TagPrice,(case tagprice when '0'  then 100  else case TotalAmount when '0' then 100 else (netprice/TagPrice)*100 end end) StoreDiscount,netprice TotalAmount, SALESQUANTITY,b.ZJLBM sjczbm,"+
	"GOODSPROCESSINGFEE,GOLDPRICE,0 lplx,0 zhjl,orderitemtype from aig_orderitem a left join z_rfc_store_03_it_charg b on "+
	"( a.BatchNumber=b.CHARG )  left join z_rfc_store_01_it_mara d on "+
	"( a.MaterialNumber = d.MATNR)"; 
	
	ls_sql += " where SalesOrderID='"+ywxh+"' and a.ORDERITEMTYPE !='ZTNN' order by -SALESORDERITEM desc";
		
	
	//out.println(ls_sql);
	
	ps= conn.prepareStatement(ls_sql);
	rs=ps.executeQuery();
	%>

	<div id="div2"  style="display:none;">
	<TABLE border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;FONT-SIZE:11PX;font-weight:bold;font-family:����_GB2312" >      
	<TBODY>  
	<%
	int iRow = 0;
	while(rs.next()){
		iRow = iRow + 1;
		java.text.DecimalFormat df =new   java.text.DecimalFormat("#.##");  
		BatchNumber=rs.getString("BatchNumber");
		cpbm=rs.getString("cpbm");
		cpmc=rs.getString("Materialdesc");
		cpmc = Common.getNewString(dwdh,cpmc);
		zszl=rs.getDouble("zszl");	
		xsd=rs.getString("xsd");
		hpzl=rs.getDouble("hpzl");
		GoldWeight=rs.getDouble("GoldWeight");		
		goodsize = rs.getString("goodsize");
		zf=rs.getString("zf");
		TagPrice=rs.getString("TagPrice");
		Double myStoreDiscount=rs.getDouble("StoreDiscount");
		BigDecimal bd = new BigDecimal(myStoreDiscount);
		StoreDiscount= bd.setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
		//String mydiscount = discount.toString().substring(0,discount.toString().indexOf("."));
		StoreDiscount = StoreDiscount > 100 ? 100 : StoreDiscount;
		
		//StoreDiscount = StoreDiscount != null && StoreDiscount.length() > 2 && !"100".equals(StoreDiscount) ? StoreDiscount.substring(0,2) : StoreDiscount;
		TotalAmount=rs.getString("TotalAmount");
		giftmethod=rs.getString("giftmethod");
		SALESQUANTITY=rs.getString("SALESQUANTITY");
		sjczbm=rs.getString("sjczbm");
		GOODSPROCESSINGFEE=rs.getDouble("GOODSPROCESSINGFEE");
		GOLDPRICE=rs.getDouble("GOLDPRICE");
		
		if(GOLDPRICE > 0){
			hpzl=rs.getDouble("GoldWeight");
		}
		
		lplx=rs.getString("lplx");
		zhjl=rs.getString("zhjl");
		orderitemtype = rs.getString("orderitemtype");
		
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
			<TD width="17%" align="left"><%=cpbm%></TD>
			<TD width="38%" align="left"><%=cpmc%>
			<% 
			if("01".equals(giftmethod)) {
				out.print("��������");
			}else if("02".equals(giftmethod)){
				out.print("������Ʒ��");
			}
			%>
			</TD>
			<td width="20%" ></td>
			<td width="14%" ></td>
			<td width="24%" ></td>
		</tr>
		
		<%if(true){%>
				<tr>
				<td width="3%" ></td>
					<td>������
					<% if (G4Utils.isNotEmpty(hpzl))
					{
						out.print(hpzl);
					}else{
						out.print(0);
					}
					%>
					</td>
					<td>�ߴ磺
					<% if (G4Utils.isNotEmpty(goodsize))
					{
						out.print(goodsize);
					}else{
						out.print(0);
					}
					%>&nbsp;&nbsp;���ѣ�
					<% if (G4Utils.isNotEmpty(GOODSPROCESSINGFEE)){
						out.print("��"+GOODSPROCESSINGFEE);
						if(GOLDPRICE > 0){
							out.print("&nbsp;&nbsp;��ۣ���"+GOLDPRICE);
						}
					}else{
						out.print(0);
					}
					%>
					</td>
					<td align="right">��<%
					if(GOLDPRICE > 0) {
						Double realPrice = GOLDPRICE*GoldWeight + GOODSPROCESSINGFEE;
						//System.out.println(GoldWeight);
						try{
							out.print(realPrice.toString().substring(0,realPrice.toString().indexOf(".")));
						}catch(Exception e){
							out.print(realPrice);
						}
					}else
						out.print(TagPrice);
							%></td>
					<td align="center">
					<% 
					if("01".equals(giftmethod)) {
						if(Double.parseDouble(TotalAmount) > 0){
							out.print("���������");
						}else{
							out.print("����");
						}
					}else if ("02".equals(giftmethod)){
						out.print("����");
					}else if(GOLDPRICE > 0){
						try{
						Double realPrice = GOLDPRICE*GoldWeight + GOODSPROCESSINGFEE;
						Double discount = (Double.parseDouble(TotalAmount) / realPrice * 100);
						bd = new BigDecimal(discount);
						Integer mydiscount = bd.setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
						//String mydiscount = discount.toString().substring(0,discount.toString().indexOf("."));
						mydiscount = mydiscount > 100 ? 100 : mydiscount;
						out.print(mydiscount+"%");
						}catch(Exception e){
							out.print("100%");
						}
					}else if (G4Utils.isNotEmpty(StoreDiscount)){
						out.print(StoreDiscount+"%");
					}else{
						out.print(0);
					}
					%>
					</td>
					<td align="right">��<%=TotalAmount%></td>
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
		
		<script>
			var count = '<%=iRow %>';
		</script>
		<tr>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td align="center">&nbsp;</td>
			<td align="right">&nbsp;</td></tr>
		<tr >
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td><img src="longhaul/pos/order/images/zjzb.gif"></td>
			<td align="center">
			<%
			out.print("ZL2N".equals(orderitemtype) || "ZL3N".equals(orderitemtype) ? "����ϼ�:" : " �ϼ�:");
			 %></td>
			<td align="right">
			<%
				out.print(TOTALMONEY);
			%>
			</td>
		</tr>
		<!-- <tr>
			<td colspan="5">
			<%=REMARKS%>
			</td>
		</tr> -->
	</TABLE>
	</div>
	<%
	rs.close();
	ps.close();	

	String vipinfo = "N/A";
	if(!"NG0001".equals(VipCard)){
		vipinfo = VipCard + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;���û��֣�" + memberIntegral +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;���λ��֣�"+currentIntegral;
	}
	
	%>
	<div id="div3" style="display:none;">
		<TABLE border=0 cellSpacing=0 cellPadding=0 width="100%" style="border-collapse:collapse;FONT-SIZE:12PX;font-weight:bold;" >
			<tr>
			<td width="5%" ></td>
				<td width="25%">Membership No.(��Ա��)��</td>
				<td width="100%"><%=vipinfo%><td>
			</tr>
	 		<tr>
	 		<td width="5%" ></td>
				<td>Date(��������)��</td>
				<td><%=SaleDate%><td>
			</tr>
			<tr>
			<td width="5%" ></td>
				<td>&nbsp;</td><td><%=dwmc%>&nbsp;&nbsp;<%=dwdh%><%if(G4Utils.isNotEmpty(choiceorderid)){ %>
				<span style="display: inline;margin-left: 134px;">ѡ��ţ�<%=choiceorderid %></span><%} %></td>
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
				<td>&nbsp;</td><td><%=CASH%><%=UNIONPAY%><%=SHOPPINGCARD%><span style="display: inline;margin-left: 70px;">���ţ�<%=sapsalesorderid %></span><td>
			</tr> 
		</table>
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
		LODOP.SET_LICENSES("������Ҧ���鱦�������޹�˾","459626380837383919278901905623","","");
		LODOP.PRINT_INITA(0,0,"210mm","297mm","��ӡ�ؼ�������ʾ_Lodop����_��ʾģʽ");
		//LODOP.SET_PRINT_PAGESIZE(0,"210mm","297mm","LodopCustomPage");
		LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
		var table1height;
			table1height = "54mm";
		
		LODOP.ADD_PRINT_TABLE((count == 4 ? 190 : 200),0,"95%",(count == 5 ? "46mm" : table1height ),document.getElementById("div2").innerHTML); 

		LODOP.ADD_PRINT_HTM(385,0,"95%","40mm",document.getElementById("div3").innerHTML);
		
		LODOP.SET_PRINT_STYLEA(0,"PageIndex","Last");

		//LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='order.jpg' width='520mm' height='760mm'>");
		LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='new_order_print.jpg' width='100%'>");
		
		LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);		//��ӡԤ��ʱ�Ƿ��������ͼ
		LODOP.SET_SHOW_MODE("BKIMG_LEFT",0);
		LODOP.SET_SHOW_MODE("BKIMG_TOP",0);	
		LODOP.SET_SHOW_MODE("BKIMG_WIDTH","210mm");
		LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","140mm");
		LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW",1);//����Ԥ�����ڵĴ�ӡ��ť
		LODOP.SET_SHOW_MODE("HIDE_SBUTTIN_PREVIEW",1);//����Ԥ�����ڵĴ�ӡ���ð�ť
		LODOP.SET_SHOW_MODE("HIDE_QBUTTIN_PREVIEW",1);//����Ԥ�����ڵĹرհ�ť
		LODOP.SET_SHOW_MODE("HIDE_PAGE_PERCENT",1);//����Ԥ�����ڵĹرհ�ť

		LODOP.SET_SHOW_MODE("PREVIEW_IN_BROWSE",1);		//��ӡԤ�������Ƿ���Ƕ����ҳ�ڲ�


		LODOP.ADD_PRINT_TEXT(80,80,105,52,"��#ҳ/��&ҳ");
		LODOP.SET_PRINT_STYLEA(0,"ItemType",2);
		LODOP.SET_PRINT_STYLEA(0,"Horient",1);
		LODOP.SET_PRINT_STYLEA(0,"Vorient",1);

		//LODOP.PRINT_DESIGN();		
		//LODOP.PRINT_SETUP();		
		LODOP.PREVIEW();		
		//f_print();
	};

	function f_print(){
		LODOP.PRINT();
			//window.close();
		$.ajax({
					url : "longhaul/pos/order/orderSystem.ered?reqCode=print_order&postType=1&ywxh="	
					+getqueryString("ywxh"),	
					success : function(data) {
						
					}
				});
			
	}

	function f_close(){
		window.close();
	}
	
	function f_setup(){
		LODOP.PRINT_SETUP();
	}
	function getqueryString(name){
	 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
	}


</script>