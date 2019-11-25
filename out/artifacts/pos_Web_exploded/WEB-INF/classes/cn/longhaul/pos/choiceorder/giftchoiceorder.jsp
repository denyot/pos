<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String opmode = (String)request.getAttribute("opmode");
String choiceOrderId = (String)request.getAttribute("choiceOrderId");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>选款下单</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
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
	<link rel="stylesheet" href="resource/jquery/themes/base/jquery.ui.all.css">
	<link rel="stylesheet" href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">
	
	<script src="longhaul/pos/choiceorder/js/giftchoiceorder.js" type="text/javascript"></script>
	<script src="longhaul/pos/stock/js/orderdate.js" type="text/javascript"></script>
	
	<link rel="stylesheet" href="longhaul/pos/choiceorder/css/choiceorder.css" media="screen">
	
	<style>
	.ui-autocomplete-loading { background: white url('resource/jquery/ui/images/ui-anim_basic_16x16.gif') right center no-repeat; }
	</style>
	
	<script type="text/javascript">
		var opmode = "<%=opmode %>";
		var choiceOrderId = "<%=choiceOrderId %>"
	</script>
	
  </head>
  
  <body style="width: 100%">
    	
	<table  id="ordersystemtable"  width="100%" border="0">  
		    <tr>
		       <td colspan="3" align="center">
		          <font class="orderhead" id="orderhead">
		                         赠品包材选款下单
		          </font>
		            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		           <label  class="orderhead" id="sapsalesorderid"></label>	  
		       </td>
		    </tr>
			<tr>
				<td  width="330px">
					选款时间:
					<input name="ordertime" id="ordertime" class="inputreadonly" readonly="readonly" style="background:#f0f0f0" ></input>
					<div id="operatedatetime" style="display:none"></div>
				</td>
				<td width="700px">
				    <label id="charglabel"> 
				           物&nbsp;料&nbsp;号: 
				    </label>
					 <input id="matnrinput" style="text-transform:uppercase;" class="inputnom"> 
				</td>
			</tr>
			
			
					
			<tr>
				<td>
				 货品名称:
					<input name="zhlhx"  id="zhlhx" style="width:130px">
				</td>
				<td>
					
					数&nbsp;&nbsp;&nbsp;&nbsp;量:
					<input name="number" id="number" class="inputnumbernom" maxlength="5">
					</input>
				</td>
			</tr>
			<tr>
				
				<td>
					
					<input type="button" style="display: none;"  value="计算市场零售参考价"  id="calcNewPrice"/>
					<br/>
					<span id="marketPriceSpan">
						赠送价位段:
						<input name="retailPrice" id="retailPrice" readonly="readonly">
						</input> 
					
					</span>
					<input name="costPrice" id="costPrice" class="inputnumbernom"  type="hidden">
					</input>
					
					
					<input name="realnumber" id="realnumber" class="inputnumbernom" maxlength="5" style="display: none">
					</input>
					
					
				</td>
				<td>
					备&nbsp;&nbsp;&nbsp;&nbsp;注：
					<input name="remark" id="remark"  style="width: 200px"/>
					<input type= "button"  class="orersystembutton" id="btnAddRow" value="增加行项目" >
					<input type= "button"  class="orersystembutton" id="submit" value="提交" >
				</td>

			</tr>
			<tr id="showmatnrinfo"  style="display: none">
			    <td rowspan="2" width="310px">
			    <label><input type="radio" id="chargtype" name="chargtype" value="charg" checked="checked"   disabled="disabled"  > 商品
					       <input type="radio" id="chargtype" name="chargtype" value="gift"   disabled="disabled" style="display: none"> <!-- 赠品 -->
					 </label>
					 <a href="" class="tooltip" title="商品图片">
					 <img alt="商品照片" src="" id="pcimage" align="middle" style="width:80px;height:68px">
					 </img>
					 </a></td>
				<td style="border: thin 2px;" colspan="4">
				           标签价格:
					<input name="ztjtj" style="width:80px;background:#f0f0f0" class="inputreadonly" id="ztjtj" readonly="readonly">
				</td>
				
			</tr>
			
			<tr style="display: none" id="showmatnrinfo2">
				<td width="700px" colspan="2">
				</td>
			</tr>
		 
			<tr>
				<td width="100%" colspan="3" id="tdtablecontent" align="center">
					<table border="0" id="tablecontent" width="100%">
						<col style="width: 40px;">
						<col style="width: 40px;">
						<col style="width: 40px;" >
						<col style="width: 40px;" >
						<col style="width: 40px;">
						<col style="width: 40px;">
						<col style="width: 40px;">
						<col style="width: 50px;">
						<col style="width: 50px;">
						<col style="width: 50px;">
						<col style="width: 50px;">
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
									物料编码 
								</th>
								<th>
									商品名称
								</th>
								<th>
									赠送价位段
								</th>
								<th>
									数量
								</th>
								<th>
									备注
								</th>
							
							</tr>
							
							
							<tr>
							    <td class="tdtotallevel" colspan="5" style="font-size: 20px; font-weight: bold;" align="center">
							        总计    
							    </td>
								<td class="tdtotallevel" align='right' style="font-size:14px;white-space:nowrap;">
								   <div id="totalnumber" >
									 0
									</div>
								</td>
								<td class="tdtotallevel" id="tdLast" colspan="1">
									&nbsp;    
								</td>
							</tr>
							
							
						</thead>
					</table>

				</td>

			</tr>
			<tr>
			</tr>
			<tr>
				<td colspan="2">
		   <label>联系方式:</label>
		   <input id="contract"   name="contract"  class="statementaccount"/>
		   	 备注：<input name="headremark" id="headermark" style="width: 600px" maxlength="200">
		   </td>
			</tr>
			<tr>
				<td colspan="2">
			  		选款单号:&nbsp;<input name="choiceorderid"  id="choiceorderid" value=""  class="orderheadpos" style="width:140px"/>
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
  </body>
</html>
