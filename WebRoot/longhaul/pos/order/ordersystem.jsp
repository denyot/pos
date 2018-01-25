<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String WERKS = (String)request.getAttribute("WERKS"); WERKS=WERKS==null||WERKS.equals("")?"01DL":WERKS;
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
posurl= posurl==null||posurl.equals("")?"localhost:8080":posurl;
%>
<html>
	<head>
	<meta charset="utf-8">
	<base href="<%=basePath%>">
	<title>订单系统</title>
	<script src="resource/jquery/jquery-1.7.2.js"></script>
	<script src="resource/jquery/lhgdialog/lhgdialog.min.js?self=true&skin=mac"></script>
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
    <script src="longhaul/pos/order/js/orderdate.js"></script>
	<script src="longhaul/pos/order/js/ordersystem.js?a=1"></script>
	<link rel="stylesheet" href="resource/jquery/themes/base/jquery.ui.all.css">
	<link rel="stylesheet" href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
	<link rel="stylesheet" href="longhaul/pos/order/css/ordersystem.css" media="screen">
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
		 var doubleIntervalValidate = false;
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
	<body style="width: 100%">
		<table  id="ordersystemtable"  width="100%" border="0">  
		    <tr>
		       <td colspan="3" align="center">
		          <font class="orderhead" id="orderhead">
		                         订单管理
		          </font>
		            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		           <label  class="orderhead" id="sapsalesorderid"></label>	  
		           	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		           	
		       </td>
		    </tr>
			<tr>
				<td id="ordertypetd" width="240px"> 
					订单类型:
					<select name="ordertype" id="ordertype" style="width:150px">
					</select>
				</td>
				<td  width="240px">
					销售时间:
					<input name="ordertime" id="ordertime" class="inputreadonly" readonly="readonly" style="background:#f0f0f0" ></input>
					<div id="operatedatetime" style="display:none"></div>
				</td>
				<td id="ordertypeoptiontd">
				<span id="orderreasonSpan">
					销售原因:
					<select name="orderreason" id="orderreason" style="width:100px">
					</select>
					&nbsp;&nbsp;&nbsp;
					</span>
					
					<span id="salemanSapn">营&nbsp;业&nbsp;员:
					<!-- <input name="saleman"  id="saleman" class="inputnom" maxlength="12"> -->
				    <select id="saleman" name="saleman" multiple="multiple" size="8" style="width:150px">
					</select>
				</span>
				<span id="groupSealSpan" style="display: none;">
				组合销售：<input type="checkbox" id='groupSeal' /></span>
				<span id="ifGiveShopperSpan"  style="display: none;">
				是否交商场：<input type="checkbox" id='ifGiveShopper' /></span>
				</td>
			</tr>
			 
			<tr>
				<td>
					<!-- 客户编号: -->
					<span id="vipidSpan">
					<input name="kunnr" id="kunnr" class="inputkey" style="display: none;">  
					会员卡号:
					<input name="vipid" id="vipid" class="inputnom">
					<input   type="button" id="registertd" value="新会员"/>
					</span>
				</td>
				<td>
				<span id="vipnameSpan"> 
					会员姓名:
					 <label id="vipname" style="font-weight: bold;"></label>
					 </span>
				</td>
				<td>
			         <span id="memberInfoSpan">
				    <span id="kunnrjfSpan">  <label> 积分:</label>
				      <input id="kunnrjf"  class="inputnoboder1" readonly="readonly"/></span>
				      &nbsp;&nbsp;&nbsp;&nbsp;
				      <label> 电话:</label>
				      <input id="tel"  class="inputnoboder" readonly="readonly"/>
				      </span>
				</td>
			 

			</tr>
			<tr id="registertr" style="display:none" >
				<td colspan="3">
				<b>新添加会员:</b>
				会员姓名：<input id="regname" />
				联系电话：<input id="regtel" /> 
				卡类型 ：
				<select id='cardType'>
					<option value="01">畅享卡</option>
					<option value="02">EGGO卡</option>
					<option value="03">金典卡</option>
					<option value="10">兆亮会员卡</option>
				</select>
				<input type="button" id="saveregmsg" value="保存"/>
				</td>
			</tr>
			
			<tr>
				<td>
				    <label id="charglabel"> 
				           批&nbsp;&nbsp;&nbsp;&nbsp;次: 
				    </label>
					<input name="charg" id="charg"  readonly="readonly"   style="text-transform:uppercase;"  class="inputnom">
					<input name="matnrInput" id="matnrInput"   style="text-transform:uppercase; display: none;"  class="inputnom" />
					<input  onmousedown="javascript: this.style.width='auto';" id='matnrSelect1' style="display: none; width: 60%;" >				
					<select  onmousedown="javascript: this.style.width='auto';" onblur="javascript: this.style.width='60%';" 
					 onchange="javascript: this.style.width='60%';" 
					 id='matnrSelect' style="display: none; width: 60%;" >
							<!--  <option value=''>请选择...</option>
							<option value='JG99'>足金旧料-JG99</option>
							<option value='JG90'>足金旧料-JG90</option>
							<option value='JG9X'>千足金旧料-JG9X</option>
							<option value='JK18'>白18K金旧料-JK18</option>
							<option value='JP95'>PT950铂金旧料-JP95</option>
							<option value='JP99'>PT990铂金旧料-JP99</option>
							<option value='JP9X'>PT999铂金旧料-JP9X</option> -->
					</select> 
					
					<select name="swaptype" id="swaptype" style="width:40px;display:none">
					  <option value="ZIN" selected>入</option>
					  <option value="ZOUT">出</option>
					  <option value="GZIN">外金换入</option>
					</select>
					<br/>
					<span id="outGoldTypeSpan" style="display: none;">
					旧金类型:
						<select id="outGoldType" style="width: 145px;">
							<option value=''>请选择...</option>
							<option value='JG99'>足金旧料-JG99</option>
							<option value='JG90'>足金旧料-JG90</option>
							<option value='JG9X'>千足金旧料-JG9X</option>
							<option value='JK18'>白18K金旧料-JK18</option>
							<option value='JP95'>PT950铂金旧料-JP95</option>
							<option value='JP99'>PT990铂金旧料-JP99</option>
							<option value='JP9X'>PT999铂金旧料-JP9X</option>
						</select>
					</span>
					
					<span id="charg_ospan" style="display: none;">旧批次号：<span id="charg_o"></span></span>
					
					<input type="hidden" id="giftReferencePrice" />
					
				</td>
				<td>
				
					<input name="realnumber" id="realnumber" style="display: none;" >
					</input>
					
					<label id="logartlabe" >
					    库位:
					</label>
					<select name="logrt" id="logrt" >
					</select>
					<input name="logrtinput" id="logrtinput"  class="inputcharnom" style="display: none;"> 
					 <br/>
					 <span id="inputHeadGiftSpan">
					 	录入整单礼品<input type="checkbox" id="allGift" />
					 </span>
					 
					  <span id="inputPackageSpan">
					 	录入包材<input type="checkbox" id="inputPackage" />
					 </span>
					  <span id="rejPackageAndGiftSpan" style="display: none;">
					 	退赠品和包材<input type="checkbox" id="rejPackageAndGift" />
					 </span>
					  <span id="inputGoldBarSpan">
					 	投资金条<input type="checkbox" id="inputgoldbar" />
					 </span>
					  <span id="inputWJGFSpan" style="display : none;">
					 	外金工费<input type="checkbox" id="inputWJGF" />
					 	</span>
					 <span id='numberSpan' style="display: none"> 
					 数&nbsp;&nbsp;&nbsp;&nbsp;量:
					<input name="number" id="number" class="inputnumbernom" maxlength="5"> 
					</input>
					</span>
					 
					 <input type="hidden" id="currentIntegral"  value="0" />
					 
				<span id="goldweightSpan" style="display: none;" >	 货品重量:
					<input name="goldweight" style="width:40px;" id="goldweight" class="inputnumbernom">
				</span>
				<span id="hpweightSpan" style="display: none;" >	 货品重量:
					<input name="hpweight" style="width:40px;" id="hpweight" class="inputnumbernom" readonly="readonly">
				</span>
				<span id="mgoldweightSpan" style="display: none;" >	 毛重:
					<input name="mGoldWeight" style="width:40px;" id="mGoldWeight" class="inputnumbernom">
				</span>
				<span id="choiceOrderInfoSpan" style="display: none;" >
					选款单总价:<input type="text" id="choiceOrderTotalMoney" style="width: 60px;"  readonly="readonly"  />
				</span>
				<span id="inputBookGoodSpan" style="display: none;" >
					现货预定:<input type="checkbox" id="inputBookGood" />
				</span>
				<span id="frontMoneySpan" style="display: none;" >
					收取定金总额:<input type="text" id="frontMoney" style="width: 60px;"  readonly="readonly"  />
				</span>
				
				<span id="birthdayspan"  style="float: right; font-size:14px;padding-right: 50px;display: none;">
					生日:<span id="birthday">0000-00-00</span>
				</span><br/>
				<span id="marrydayspan" style="float: right; font-size:14px;padding-right: 50px;display: none;">
					结婚纪念日:<span id="marryday">0000-00-00</span>
				</span>
				
				</td>
				<td>
					<label id="goldvaluelabel">金&nbsp;&nbsp;&nbsp;&nbsp;价:</label>
					<input name="goldvalue" id="goldvalue" class="inputreadonly" value="0" style="background:#f0f0f0"  readonly="readonly">
					
					<span id="goldbargoldvaluespan" style="display: none;">
						<label id="settlegoldvaluelabel">结算金价:</label>
						<input name="settlegoldvalue" id="settlegoldvalue" value="0" style="width:64px;" />
						<label id="realitygoldvaluelabel">实销金价:</label>
						<input name="realitygoldvalue" id="realitygoldvalue" value="0"  style="width:64px;" />
					</span>
					
					<label id="personcostlabel">工费(每克):</label>
					<input name="personcost" id="personcost" class="inputreadonly" value="0" style="background:#f0f0f0 ; display: none;"  readonly="readonly">
			      	<span id="freepersoncostspan" style=" display: none;">免工费：<input type="checkbox" id="freepersoncost" /></span>
			        <label id="giftjf" class="inputnoboder1"></label><br/>
			        <input   type="button" id="userstatement" value="付款" class="orersystembutton"/>
					&nbsp;&nbsp;
				   <input   type="button" id="orderprint" value="打印" class="orersystembutton"  style="display : none;"/> 
				   <input   type="button" id="updateorderprice" value="修改" class="orersystembutton"  style="display : none;"/> 
				   <input   type="button" id="cancleupdate" value="取消修改" class="orersystembutton"  style="display : none;"/> 
				</td>

			</tr>
			
			
		<!-- 	<tr id="frontMoneyTr" style="display: none;" >
				<td colspan="5" >
					定金单信息：
					<select id="frontMoney">
						<option>请选择...</option>
						<option>定金单号：SZ0120323232 ,客户姓名：Romeo,客户卡号：A0039,定金金额：20000</option>
						<option>定金单号：SZ0120323232 ,客户姓名：Romeo,客户卡号：A0039,定金金额：20000</option>
						<option>定金单号：SZ0120323232 ,客户姓名：Romeo,客户卡号：A0039,定金金额：20000</option>
					</select>
				</td>
			</tr>
			 -->
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
					<input name="matnr" id="matnr" readonly="readonly" class=inputreadonly style="width:150px;background:#f0f0f0">
					名称:
					<input name="zhlhx"  id="zhlhx" readonly="readonly" class="inputreadonly" style="width:150px;background:#f0f0f0">
				           标签价格:
					<input name="ztjtj" style="width:80px;background:#f0f0f0" class="inputreadonly" id="ztjtj" readonly="readonly">
					
					<span id="doubleorsingleSpan" style="display: none;">
					单双:
					<select id="doubleorsingle">
						<option value="1">
							一对
						</option>
						<option value="0.5">
							单只
						</option>
					</select>
					</span>
					<!--
					 证书号:
					<input name="certificateno" id="certificateno" readonly="readonly" class="inputreadonly" style="background:#f0f0f0">
					 -->	
				</td>
				 
			</tr>
			<tr id="showoptinfo">
				<td colspan="3">
					
				<span id="discount12Span"><select id="discount12"> 
						<option value="1">非扣点变动销售</option>
						<option value="2">扣点变动销售</option>
						<option value="3">特殊折扣</option>
						<!-- <option value="4">一口价</option> -->
					</select>
					<input name="discount1" style="width: 40px" id="discount1" readonly="readonly" value="100"/>
					
					</span>
					
				<span id="discount34Span"><select id="discount34"> 
						<option value="1">VIP折扣</option>
						<option value="2">商场会员折扣</option>
						<option value="3">特价不打折</option>
					</select>
					<input name="discount2" style="width: 40px" id="discount2" value="100" />
					</span>
				<span id="depreciationPriceSpan" style="display: none;">
					外金工费:<input id="depreciationPrice" style="width: 70px" />(每克)
				</span>
					
				<span id="receivableSpan">	<label id="receivableLabel">应&nbsp;&nbsp;&nbsp;&nbsp;收:</label>
					<input name="receivable" style="width: 70px" id="receivable" readonly="readonly"/>
				</span>
				<span id='realpriceSpan'>
					<label id='realpriceLabel'>单件实收：</label>
					<input name="realprice" style="width: 70px" id="realprice"/> <br/>
				</span>
					<span id="selfprivilegeSpan" >自发优惠券：
					<input name="selfprivilege" style="width: 60px" id="selfprivilege"/></span>
					<span id="selfticketpriceSpan" >自发现金券：
					<input name="selfticketprice" style="width: 60px" id="selfticketprice"/></span>
					<span id="vipintegralSpan" >VIP抵现优惠：
					<input name="vipintegral" style="width: 60px" id="vipintegral"/></span>
					
					<span id='giftMethodSpan'>
						赠送方式：
						<select id="giftMethod">
							<option value=''>无</option>
							<option value='01'>赠链</option>
							<option value='02'>赠货品</option>
						</select>
					</span>
					
					<span id='giftPriceSpan' style="display: none;">赠送限额:<span id='giftPrice'></span></span>
					<br />
					<span id="marketprivilegeSpan">商场优惠券：
					<input name="marketprivilege" style="width: 60px" id="marketprivilege"/></span>
					<span id="marketticketpriceSpan" >商场现金券：
					<input name="marketticketprice" style="width: 60px" id="marketticketprice"/></span>
					<!-- 现&nbsp;&nbsp;金&nbsp;&nbsp;&nbsp;券：
					<input name="cashcoupon" id="cashcoupon" class="inputnom" style="width: 60px" maxlength="12">
					-->	
				<span id="saleorderidspan" style="display: none;">销售单号：
						<input id="oldsaleorderid" type="text" readonly="readonly"  />
						<input id="ifunionpay" type="checkbox" disabled="disabled" />银联
				</span>
				</br>
				<span id="salepromotionSpan" style="display: none;" >
				  	促销代码:
				  	<input id="salepromotion" style="display: none;" />
					<select name="salepromotionSelect" id="salepromotionSelect" >
						<option value="">请选择...</option>
					</select>
				</span>
				
				</td>
			</tr>
		 
			<tr>
				<td width="100%" colspan="3" id="tdtablecontent" align="center">
					<table border="0" id="tablecontent" width="100%">
					<!-- 	<col style="width: 40px;">
						<col style="width: 40px;">
						<col style="width: 35px;" >
						<col style="width: 50px;" >
						<col style="width: 50px;">
						<col style="width: 50px;">
						<col style="width: 35px;">
						<col style="width: 35px;">
						<col style="width: 50px;"> 
						<col style="width: 50px;">   
						<col style="width: 50px;">   
						<col style="width: 40px;">   
						<col style="width: 40px;">
						<col style="width: 50px;">   
						<col style="width: 50px;">   
						<col style="width: 40px;">   
						<col style="width: 40px;">
						<col style="width: 40px;">
						<col style="width: 35px;">
						<col style="width: 50px;">   
						<col style="width: 35px;">
						<col style="width: 35px;">
						<col style="width: 35px;"> -->
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
									批次
								</th>
								<th>
									物料编码 
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
								<th id="labelPriceTh">
									标签价
								</th>
								<th id="realpriceTh">
									实销价
								</th>
								<th>
									类别
								</th>
								<th id="discount1Th">
									常规折扣
								</th>
								<th id="discount2Th">
									促销折扣
								</th>
								<th id="discount5Th">
									特殊折扣
								</th>
								<th id="discount3Th">
									VIP折扣
								</th>
								<th id="discount4Th">
									商场会员折扣
								</th>
								<th id="discount6Th">
									实销折扣
								</th>
								<th id="marketprivilegeTh">
									商场优惠券
								</th>
								<th id="selfprivilegeTh">
									自发优惠券
								</th>
								<th id="marketticketpriceTh">
									商场现金券
								</th>
								<th id="selfticketpriceTh">
									自发现金券
								</th>
								<th id="vipintegralTh">
									VIP抵现优惠
								</th>
								<th id="settlegoldvalueTh" style="display: none;">
									 结算金价
								</th>
								<th id="realitygoldvalueTh" style="display: none;">
									实销金价
								</th>
								<th>
									促销代码
								</th> 
								<th id="lgortTh">
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
								<td class="tdtotallevel" align='right' id="totalztjtjTd" style="width:60px;font-size:14px;white-space:nowrap;">
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
								<td>
									 &nbsp;   
								</td>
							</tr>
						</thead>
					</table>

				</td>

			</tr>
			
			<tr id="mygift">
				<td>
				</td>
				<td>
				<span id="cashSpan">
					 <label id="cashLabel">现&nbsp;&nbsp;&nbsp;&nbsp;金:</label>
			   		<input id="cash"  name="cash"  class="inputnom" value="0"  style="width:60px;" />
		 		 </span>
		   
		 <span id="shoppingcardSpan" ><label>购&nbsp;物&nbsp;卡:</label>
		   <input id="shoppingcard" name="shoppingcard"  value="0" style="width:60px;" />
		 </span>  
			
			<span id="unionpaySpan">
			   <br/>
			   
			    <label>银&nbsp;&nbsp;&nbsp;&nbsp;联:</label>
			   <input id="unionpay"   name="unionpay"  class="inputnom"  value="0" style="width:60px;" />
		   </span>
		  
		  
		     <label id="statementtotalLabel">合&nbsp;&nbsp;&nbsp;&nbsp;计:</label>
		   <input id="statementtotal"    name="statementtotal"  value="0" readonly="readonly"  style="width:60px;" />
		    	      
				</td>
				<td> 
				 <span id="thankIntegralSpan" style="display: none;"><label>答谢积分:</label>
		   <input id="thankIntegral" name="thankIntegral"  value="10" readonly="readonly" style="width:60px;" />
		 </span>  
		   
		   <span id="referrerSpan"  style="display: none;"><label>推荐人卡号:</label>
		   <input id="referrer" name="referrer"  style="width:60px;"  />
		 </span>  
		 <br/>
		   		<span id="shopnumberSpan">
					商场小票:
					<input name="shopnumber" id="shopnumber" class="inputnom" maxlength="16" >
				</span><br/>
					本次消费积分:<span id="currentIntevalSpan" style="font-size: 14px; display: none">0</span>
					<span id="currentIntevalSpanShow" style="font-size: 14px;">0</span>
				
				</td>
			</tr>
			
			<tr>
				<td>
					<input name="opterator"  id="opterator" class="inputnom" maxlength="12" style="display:none">
					<span id="saleorderidSpan" style="display: none;"> 销售单号:&nbsp;<input name="salesorderid"  id="salesorderid" value=""  class="orderheadpos" style="width:100px"/></span>
				</td>
				<td colspan="2">
			  	 备注：
					 <input name="remark" id="remark" style="width: 300px;"  maxlength="40">
				</td>
			</tr>
			<tr>
				<td>
					
				</td>
				<td>
			       
				</td>
				<td style="display: none;">
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
		  <!--  <label>订金:</label>
		   <input id="subscription"    name="subscription" value="0"  class="statementaccount"/>
		    -->
		   <label>合计:</label>
		   <input id="statementtotal"    name="statementtotal"  value="0"  class="inputattention2" readonly="readonly" style="background:#f0f0f0"/>
		   <br />
		    <label>自发券优惠:</label>
		   <input id="selfprivilege"   name="selfprivilege"  value="0" class="statementaccount"/>
		      <label>商场优惠券:</label>
		   <input id="marketprivilege"   name="marketprivilege"  value="0" class="statementaccount"/>
		      <label>VIP抵现优惠:</label>
		   <input id="vipintegral"   name="vipintegral"  value="0" class="statementaccount"/>
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
