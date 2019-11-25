<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String WERKS = (String)request.getAttribute("WERKS"); WERKS=WERKS==null||WERKS.equals("")?"01DLX":WERKS;
String opterator = (String)request.getAttribute("userid");   opterator=opterator==null||opterator.equals("")?"CHJ":opterator;
opterator = opterator.toUpperCase();
String salesorderid = (String)request.getAttribute("salesorderid");   salesorderid=salesorderid==null||salesorderid.equals("")?"":salesorderid;
String opmode = (String)request.getAttribute("opmode");   opmode=opmode==null||opmode.equals("")?"ADD":opmode;
String ordertype = (String)request.getAttribute("ordertype"); ordertype=ordertype==null||ordertype.equals("")?"":ordertype;
String autocompletesecond = (String)request.getAttribute("autocompletesecond");
String autocompletewords =  (String)request.getAttribute("autocompletewords");
autocompletesecond = autocompletesecond==null||autocompletesecond.equals("")?"4000":autocompletesecond;
autocompletewords = autocompletewords==null||autocompletewords.equals("")?"4":autocompletewords;
String posurl =(String)request.getAttribute("posurl");
posurl= posurl==null||posurl.equals("")?"192.168.0.213":posurl;
String vkorg = (String) session.getAttribute("vkorg");
String compImage = "";
if ("".equals(vkorg) || "1300".equals(vkorg) || "9100".equals(vkorg)) {
	compImage = "CHJ";
} else {
	compImage = "VENTI";
}
%>
<html>
	<head>
	<meta charset="utf-8">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<base href="<%=basePath%>">
	<title>订单系统</title>
	<script src="resource/jquery/jquery-1.7.2.js"></script>
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
	<script src="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.js" type="text/javascript"></script>
	<script src="resource/jquery/jquery-cookie/jquery.cookie.js" type="text/javascript"></script>
	<link href="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.css" rel="stylesheet" type="text/css" />
    <script src="longhaul/order/js/orderdate.js"></script>
	<script src="longhaul/order/js/ordersystem.js"></script>
	<link rel="stylesheet" href="resource/jquery/themes/base/jquery.ui.all.css">
	<link rel="stylesheet" href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
	<link rel="stylesheet" href="longhaul/order/css/ordersystem.css" media="screen">
	<style>
	.ui-autocomplete-loading { background: white url('resource/jquery/ui/images/ui-anim_basic_16x16.gif') right center no-repeat; }
	</style>
		<script type="text/javascript">
		 var WERKS="<%=WERKS%>";
		 var opterator = "<%=opterator%>";
		 var chargimgpath="http://<%=posurl%>/sappic/";
		 var opmode="<%=opmode%>";
		 var werkssaleflag="";
		 var autocompletelength=<%=autocompletewords%>;
		 var autocompletedelay=<%=autocompletesecond%>;
		 var salesorderid = "<%=salesorderid%>";
		 var basepath = "<%=basePath%>";
		 var ordertype="<%=ordertype%>";
		 var posurl="<%=posurl%>";
		 var compImage="<%=compImage%>";
		 $(document).ready(function(){
		    $( "#ordertime" ).datepicker({
				changeMonth: true,
				changeYear: true
			});
		    $("#charg").attr("disabled",true);
		    $("#kunnr").focus();
		 });
</script>
	</head>
	<body>
		<table  id="ordersystemtable"  width="1000px" border="0">  
		    <tr>
		       <td colspan="3" align="center">
		          <font class="orderhead" id="orderhead">
		                         订单管理
		          </font>
		            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		           <label  class="orderhead" id="sapsalesorderid"></label>	  
		       </td>
		    </tr>
			<tr>
				<td id="ordertypetd" width="240px"> 
					订单类型:
					<select name="ordertype" id="ordertype" style="width:100px">
					</select>
				</td>
				<td  width="240px">
					销售时间:
					<input name="ordertime" id="ordertime" class="inputreadonly" readonly="readonly" style="background:#f0f0f0" ></input>
					<div id="operatedatetime" style="display:none"></div>
				</td>
				<td id="ordertypeoptiontd">
					销售原因:
					<select name="orderreason" id="orderreason" style="width:100px">
					</select>
					&nbsp;&nbsp;&nbsp;
					营&nbsp;业&nbsp;员:
					<!-- <input name="saleman"  id="saleman" class="inputnom" maxlength="12"> -->
				    <select id="saleman" name="saleman" multiple="multiple" size="8" style="width:150px">
				</select>
				</td>
			</tr>
			 
			<tr>
				<td>
					客户编号:
					<input name="kunnr" id="kunnr" class="inputkey">  
					<input   type="button" id="registertd" value="新会员"/>
				</td>
				<td>
					会员卡号:
					<input name="vipid" id="vipid" class="inputnom">
				</td>
				<td>
			          <label id="vipname"></label>
			        	  &nbsp;&nbsp;&nbsp;&nbsp;
				      <label> 积分:</label>
				      <input id="kunnrjf"  class="inputnoboder1"  readonly="readonly"/>
				      &nbsp;&nbsp;&nbsp;&nbsp;
				      <label> 电话:</label>
				      <input id="tel"  class="inputnoboder"   readonly="readonly"/>
				</td>
			 

			</tr>
			<tr id="registertr" style="display:none" >
				<td colspan="3">
				<b>新添加会员:</b>
				会员姓名：<input id="regname" class="inputnom"/>
				<input type="button" id="saveregmsg" value="保存"/>
				</td>
			</tr>
			
			
			<tr>
				<td>
				    <label id="charglabel"> 
				           条&nbsp;&nbsp;&nbsp;&nbsp;码: 
				    </label>
					<input name="charg" id="charg"  readonly="readonly"   style="text-transform:uppercase;"  class="inputnom">
					<select name="swaptype" id="swaptype" style="width:40px;display:none">
					  <option value="ZIN" selected>入</option>
					  <option value="ZOUT" >出</option>
					</select>
				</td>
				<td>
					数&nbsp;&nbsp;&nbsp;&nbsp;量:
					<input name="number" id="number" class="inputnumbernom" maxlength="5">
					</input>
					<label id="logartlabe" >
					    库位:
					</label>
					 <input name="logrt" id="logrt"  class="inputcharnom">
				</td>
				<td>
					<label id="goldvaluelabel">金&nbsp;&nbsp;&nbsp;&nbsp;价:</label>
					<input name="goldvalue" id="goldvalue" class="inputreadonly" value="0" style="background:#f0f0f0"  readonly="readonly">
					<label id="personcostlabel">工费:</label>
					<input name="personcost" id="personcost" class="inputreadonly" value="0" style="background:#f0f0f0"  readonly="readonly">
			        <label id="giftjf" class="inputnoboder1"></label>
			        <input   type="button" id="userstatement" value="付款" class="orersystembutton"/>
					&nbsp;&nbsp;
				    <input   type="button" id="orderprint" value="打印" class="orersystembutton"/>
				</td>

			</tr>
			<tr id="showmatnrinfo">
			    <td rowspan="2">
			    <label><input type="radio" id="chargtype" name="chargtype" value="charg" checked="checked"   disabled="disabled"  > 商品
					       <input type="radio" id="chargtype" name="chargtype" value="gift"   disabled="disabled" > 赠品
					 </label>
					 <a href="" class="tooltip" title="商品图片">
					 <img alt="商品照片" src="" id="pcimage" align="middle" style="width:80px;height:68px">
					 </img>
					 </a></td>
				<td colspan="2">
				   <label id="matnrlabel">
					物料号:
					</label>
					<input name="matnr" id="matnr" readonly="readonly" class=inputreadonly>
					名称:
					<input name="zhlhx"  id="zhlhx" readonly="readonly" class="inputreadonly" style="width:80px;background:#f0f0f0">
				           标签价格:
					<input name="ztjtj" style="width:80px;background:#f0f0f0" class="inputreadonly" id="ztjtj" readonly="readonly">
					<input name="realTagPrice" style="width:80px;background:#f0f0f0" type="hidden" class="inputreadonly" id="realTagPrice" readonly="readonly">
					金重:
					<input name="goldweight" style="width:40px;background:#f0f0f0" class="inputreadonly"  readonly="readonly" id="goldweight">
					石重:
					<input name="gemweight" style="width:40px;background:#f0f0f0" class="inputreadonly" id="gemweight" readonly="readonly">
					证书号:
					<input name="certificateno" id="certificateno" readonly="readonly" class="inputreadonly" style="background:#f0f0f0">
				</td>
				 
			</tr>
			<tr id="showoptinfo">
				<td colspan="3">
					应&nbsp;&nbsp;&nbsp;&nbsp;收:
					<input name="receivable" style="width: 80px" id="receivable" readonly="readonly"/>
					折扣
					<input name="discount" style="width: 40px" id="discount"/>
					实收
					<input name="realprice" style="width: 80px" id="realprice"/>
				</td>
			</tr>
		 
			<tr>
				<td width="100%" colspan="3" id="tdtablecontent" align="center">
					<table border="0" id="tablecontent" width="100%">
						<col style="width: 40px;">
						<col style="width: 40px;">
						<col style="width: 35px;">
						<col style="width: 50px;">
						<col style="width: 50px;">
						<col style="width: 50px;">
						<col style="width: 35px;">
						 <!--<col style="width: 35px;display:none">    单价 -->
						<col style="width: 35px;">
						<!--<col style="width: 35px;">  工费 -->
						<!--<col style="width: 70px;"> 金重 -->
						<!--<col style="width: 50px;display:none">   合计 -->
						<col style="width: 80px;">   
						<col style="width: 35px;">
						<col style="width: 35px;">
						<col style="width: 35px;">
						<col style="width: 35px;">
						<thead>
							<tr>
							    <th>
							             操作           
							    </th>
						     	<th>
									项目
								</th>
								<th style="display:none">
									上层 
								</th>
								<th>
									条码
								</th>
								<th>
									商品 
								</th>
								<th>
									商品名称
								</th>
								<th>
									图片
								</th>
								<th style="display:none">
									单价
								</th>
								<th>
									数量
								</th>
								<th id="thpersoncost" style="display:none">
									工费
								</th>
								<th id="thgoldweight" style="display:none" >
									金重
								</th>
								<th style="display:none">
								        合计
								</th>
								<th>
									标签价
								</th>
								<th>
									实销价
								</th>
								<th>
									折扣
								</th>
								<th>
									类别
								</th>
								
								<th>
									库位
								</th>
								
							
							</tr>
							
								<tr>
							    <td>
							         &nbsp;      
							    </td>
						     	<td style="display:none">
									 &nbsp;   
								</td>
								<td>
									 &nbsp;   
								</td>
								<td>
									 &nbsp;   
								</td>
								<td>
									 &nbsp;   
								</td>
								<td>
									&nbsp;    
								</td>
								<td>
									 &nbsp;   
								</td>
								<td class="tdtotallevel" align='right' style="font-size:14px;white-space:nowrap;display:none" > 
									<div id="totalprice">
									 0
								</div>
									
								</td >
								<td class="tdtotallevel" align='right' style="font-size:14px;white-space:nowrap;">
								   <div id="totalnumber" >
									 0
									</div>
								</td>
								<td class="tdtotallevel" align='right'  id="tdtoalpersoncost" style="font-size:14px;white-space:nowrap;display:none">
								    <div id="toalpersoncost" >
									 0
									</div>
								</td>
								<td  class="tdtotallevel" align='right' id="tdtotalgoldweight" style="font-size:14px;white-space:nowrap;display:none">  
									<div id="totalgoldweight">
									 0
									</div>
								</td>
								<td class="tdtotallevel" align='right'  style="width:60px;font-size:14px;white-space:nowrap;display:none">
								     <div id="total" >
									 0
									</div>
								</td>
								<td class="tdtotallevel" align='right' style="width:60px;font-size:14px;white-space:nowrap;">
								     <div id="totalztjtj" >
									 0
									</div>
								 
								</td>
								<td class="tdtotallevel" align='right' style="width:60px;font-size:14px;white-space:nowrap;">
								    <div id="totalrealprice" >
									 0
									</div>
								</td>
								<td>
									&nbsp;    
								</td>
								<td>
									 &nbsp;   
								</td>
								     &nbsp;   
								<td>
									 &nbsp;   
								</td>
							</tr>
						</thead>
					</table>

				</td>

			</tr>
			
			<tr>
				<td>
				  促销代码:
				<input name="salepromotion"  id="salepromotion" class="inputnom" maxlength="12">
				</td>
				<td>
		    	       现金券:
					<input name="cashcoupon" id="cashcoupon" class="inputnom"  maxlength="12">
				</td>
				<td>
					 商场小票:
					<input name="shopnumber" id="shopnumber" class="inputnom" maxlength="12">
				</td>
			</tr>
			
			<tr>
				<td>
					<input name="opterator"  id="opterator" class="inputnom" maxlength="12" style="display:none">
					 销售单号:&nbsp;<input name="salesorderid"  id="salesorderid" value=""  class="orderheadpos" style="width:100px"/>
				</td>
				<td colspan="2">
			  	 备注：
					 <input name="remark" id="remark" style="width: 600px" maxlength="200">
				</td>
			</tr>
			<tr>
				<td>
					
				</td>
				<td>
			       
				</td>
				<td>
					 <div id="debugtext"> </div>   
				</td>
			</tr>
		</table>
		<div id="statementaccount" title="">
		   <div id="showstatement">
		   <label>现金:</label>
		   <input id="cash"    name="cash"  class="statementaccount" readonly="readonly" style="background:#f0f0f0"/>
		   <label>银联:</label>
		   <input id="unionpay"   name="unionpay"  value="0" class="statementaccount"/>
		   <label>购物卡:</label>
		   <input id="shoppingcard"  name="shoppingcard"   value="0" class="statementaccount"/>
		   <label>订金:</label>
		   <input id="subscription"    name="subscription" value="0"  class="statementaccount"/>
		   <label>合计:</label>
		   <input id="statementtotal"    name="statementtotal"  value="0"  class="inputattention2" readonly="readonly" style="background:#f0f0f0"/>
		   </div>
		   <div id="showuploading" align="center" style="display:none">
		        <img src="resource/jquery/ui/images/ui-anim_basic_16x16.gif" alt="正在提交"/>正在提交....
		   </div>
		</div>
	  
		
		<div id="userconfiger" title="用户配置">
		 <fieldset>
		<label>下拉框弹出时间</label>
		<input type="text" name="autocompletesecond" id="autocompletesecond" value="1.5" style="width:40px"/>
		<label>毫秒</label> <br/>
		<label>下拉框输入字符</label>
		<input type="text" name="autocompletesecond" id="autocompletewords"  value="2" style="width:40px"/>
		<label>个自动加载</label>
       	</fieldset>
		 </div>
		 <br/>
	     <br/> <br/>
	</body>
</html>
