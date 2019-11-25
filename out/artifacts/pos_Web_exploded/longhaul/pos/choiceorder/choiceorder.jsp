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
	
	<script src="longhaul/pos/choiceorder/js/choiceorder.js" type="text/javascript"></script>
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
		                         选款下单
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
				           	类&nbsp;&nbsp;&nbsp;&nbsp;型: 
				    </label>
				    <select name="type" id="type" >
					    <option value=''>请选择...</option>
					    <option value='J1'>J1 黄金</option>
					    <option value='J2'>J2 铂金</option>
					    <option value='J3'>J3 K金</option>
					    <option value='J4'>J4 钯金</option>
					    <option value='J5'>J5 银</option>
					    <option value='Q1'>Q1 其他</option>
					    <option value='X1'>X1 镶嵌（钻石）</option>
					    <option value='X2'>X2 镶嵌（红蓝宝）</option>
					    <option value='X3'>X3 镶嵌（彩宝）</option>
					    <option value='X4'>X4 镶嵌（锆石）</option>
					   <!--  <option value='X5'>X5 镶嵌（翡翠）</option> -->
					    <option value='Y1'>Y1 玉石</option>
					    
				    </select>
				    <label id="charglabel"> 
				           批&nbsp;&nbsp;次: 
				    </label>
					<input name="charg" id="charg" style="text-transform:uppercase;"  class="inputnom">
				    <label id="charglabel"> 
				           物料号: 
				    </label>
				    <select id="matnrselect"  style="display: none; width: auto;">
				    	<option value=''>请选择...</option>
				    </select>
					 <input id="matnrinput" style="text-transform:uppercase;" class="inputnom"> 
				    <input type="button" value="获取" id="getMatnrInfo" />
				</td>
			</tr>
			
			<tr id="toneRow" style="display: none;">
				<td>
					石&nbsp;&nbsp;&nbsp;&nbsp;料：
					<select id="toneType" >
						<option value=''>请选择...</option>
					</select>
					
					<input type="hidden" id="bismt" />
					 
					
				</td>
				<td>
				<span id="gemweightspan">
					主石重/CT：
					<input name="gemweight" id="gemweight" class="inputnumbernom">
					<input type="hidden" id="gemweightFrom" />
					<input type="hidden" id="gemweightTo" />
					<span style="" id="mainToneWeightRang">
					</span>
					<br/>
					<span id="certificateSpan">
						裸石证书：
						<select id="certificate" multiple="multiple" size="8" style="width:220px;height:20px;">
						</select>
						
						<select id="mycertificate" multiple="multiple" size="8" style="width:90px;height:70px;display: none;">
						</select>
					</span>
					</span>
					<span id="toneColorSpan">
					 石料颜色:
					<select id="toneColor">
						<option value=''>请选择...</option>
					</select>
					</span>
					<span  style="display: none" id="toneNeatnessSpan">
						石料净度：
						<select id="toneNeatness">
							<option value=''>请选择...</option>
						</select>
					</span>
					
				</td>
			
			</tr>
			
			
			<tr id="bowlderRow" style="display: none;">
				<td>
					石&nbsp;&nbsp;&nbsp;&nbsp;料：
					<select id="bowlderType" >
						<option value=''>请选择...</option>
					</select>
					
				</td>
				
				<td>
				
					石料形状：
					<select id="toneshape">
						<option value=''>请选择...</option>
					</select>
					
					 石料颜色：
					<select id="toneColor2">
						<option value=''>请选择...</option>
					</select>
					
					
					
					是否镶嵌：
					<input type="checkbox" id="ifinlay" />
					
					
					
					
				</td>
			</tr>
			
			
			<tr id="goldRow" style="display: none;">
				<td>
					金&nbsp;&nbsp;&nbsp;&nbsp;料：
					<select id="goldType" >
						<option value=''>请选择...</option>
					</select>
				</td>
				<td>
					<span id="goldWeightSpan">金&nbsp;&nbsp;重/G：
					<input name="goldweight" id="goldweight" class="inputnumbernom" style="display: none">
					<input name="goldweightFrom" id="goldweightFrom" class="inputnumbernom" style="width: 30px">-
					<input name="goldweightTo" id="goldweightTo" class="inputnumbernom" style="width: 30px">
					</span>
					
					<span id="mainToneStyleSpan" style="display: none">
						主石规格：
						<select id="mainToneStyle">
							<option value=''>请选择...</option>
						</select>
					</span>
					
					
					<span id="ifNeedLessToneSpan" style="display : none;">
						副石：
						<input type="checkbox" id="ifNeedLessTone" />
					</span>
					
					<span id="lessToneSpan">
						副石石料：
						<select id="lessToneType">
							<option value=''>请选择...</option>
							<option value="锆石">锆石</option>
							<option value="钻石">钻石</option>
						</select>
					</span>
					
					
					
					<input id="oldRetailPrice" type="hidden" />
					<input id="oldYbzjbPrice" type="hidden" />
					<input id="oldTonePrice" type="hidden" />
					<input id="oldTechnicsPrice" type="hidden" />
					<input id="extwg" type="hidden" />
					<input id="matkl" type="hidden" />
					<input id="kbetr" type="hidden" />
					<input name="oldCostPrice" id="oldCostPrice" class="inputnumbernom"  type="hidden" />
					
				</td>
			</tr>
			<tr>
				<td>
					货品尺寸：
					
					<!--<select name="goodsize" id="goodsize">
						<option value=''>请选择</option>
						<option value='13mm'>13mm</option>
						<option value='14mm'>14mm</option>
						<option value='15mm'>15mm</option>
					</select>-->
					 <input name="goodsize" id="goodsize" value="" class="inputnumbernom"/>
					 <input type="hidden" id="goodsizeFrom" />
					<input type="hidden" id="goodsizeTo" />
					<span id="goodsizeRang"></span>
					 
					<!-- <span id="goodTotalWeightSpan">
							货品重量/g：
							<input name="goodTotalWeight" id="goodTotalWeight" class="inputnumbernom" />
						 
						</span>
					-->
				</td>
				<td>
					
					<span id="toneFireColorSpan" style="display: none">
						石料火彩：
						<select id="toneFireColor">
						</select>
					</span>
					
					<span id="technicsspan" style="display: none"> 
					工&nbsp;&nbsp;&nbsp;&nbsp;艺：
					 <select id="technics" name="technics" >
					 </select>
					 <select id="mytechnics" name="technics"style="display:none;">
					 </select>
					 
					 </span>
					 货品名称:
					<input name="zhlhx"  id="zhlhx" style="width:180px" readonly="readonly">
				</td>
			</tr>
			<tr>
				
				<td>
					数&nbsp;&nbsp;&nbsp;&nbsp;量:
					<input name="number" id="number" class="inputnumbernom" maxlength="5" value="1">
					</input>
					<input type="button"  value="计算市场零售参考价"  id="calcNewPrice"/>
					<br/>
					<span id="marketPriceSpan">
						市场零售参考价:
						<input name="retailPrice" id="retailPrice" >
						</input> 
						<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<span style="color: red; font-weight: bold;">(如：1000-1500)</span>
					
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
					<!--  <input type="button" class="orersystembutton" id="calcNewPrice" style="display: none" value="计算新价格" /> -->
					 顾客定制：<input type="checkbox" id='custommade' />
					 <span id="vipInfoSpan" style="display: none;">
					 	会员卡号:<input id="vipid" size="4" />&nbsp;&nbsp;&nbsp;<span id="vipname"></span>
					 </span>
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
						<col style="width: 40px;">
						<col style="width: 40px;">   
						<col style="width: 50px;">   
						<col style="width: 50px;">   
						<col style="width: 50px;">   
						<col style="width: 50px;">
						<col style="width: 50px;">
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
								<th>
									数量
								</th>
								<th id="ifinlayth"  style="display:none">
								       是否镶嵌
								</th>
								<th id="toneTypeth"  style="display:none">
								       石料
								</th>
								<th  id="tongWeightth"  style="display:none" >
								      主石重
								</th>
								<th id="tongColorth"  style="display:none">
								      石料颜色
								</th>
								<th id="toneshapeth"  style="display:none">
								      石料形状
								</th>
								<th id="mainToneStyleth" style="display:none;">
									主石规格
								</th>
								<th id="toneNeatnessth"  style="display:none" >
								     石料净度
								</th>
								<th id="goldTypeth"  style="display:none">
								       金料
								</th>
								<th id="thgoldweight"  style="display:none">
									金重/G
								</th>
								<th id="thgoldweightlittletotal"  style="display:none">
									金重小计/G
								</th>
								<th id="technicsth">
									工艺
								</th>
								<th>
									货品尺寸
								</th>
								
								<th id="marketPriceth">
									售价参考
								</th>
								<th id="littleTotalth">
									金额小计
								</th>
								<th id="ifNeedLessToneTypeth">
									是否要副石
								</th>
								<th id="lessToneTypeth" style="display:none;">
									副石石料
								</th>
								<th id="toneFireColorth" style="display:none;">
									石料火彩
								</th>
								<th id="certificateth" style="display:none;">
									裸石证书
								</th>
								<th id="totalWeightth" style="display:none;">
									总重/g
								</th>
								<th>
									备注
								</th>
							
							</tr>
							
							
							<tr>
							    <td class="tdtotallevel" colspan="6" style="font-size: 20px; font-weight: bold;" align="center">
							        总计    
							    </td>
								<td class="tdtotallevel" align='right' style="font-size:14px;white-space:nowrap;">
								   <div id="totalnumber" >
									 0
									</div>
								</td>
								<td id="totaltoneweightcol" class="tdtotallevel" >
									 &nbsp;   
								</td>
								<td  class="tdtotallevel" align='right' id="tdtotalgoldweight" style="font-size:14px;white-space:nowrap;display:none">  
									<div id="totalgoldweight">
									 0
									</div>
								</td>
								<td class="tdtotallevel" align='right' id="tdtotaltoneweight"  style="width:60px;font-size:14px;white-space:nowrap;display:none">
								     <div id="totaltoneweight" >
									 0
									</div>
								</td>
								<td colspan="2" id="subtotaltd" class="tdtotallevel" >
									 &nbsp;   
								</td>
								<td class="tdtotallevel" align='right' style="width:60px;font-size:14px;white-space:nowrap;">
								    <div id="totalsubtotal" >
									 0-0
									</div>
								</td>
								<td class="tdtotallevel" id="tdLast" colspan="2">
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
			<span id="urgentSpan" style="display: none;">
				 加急状态:
		   		<select id="urgent">
			   		<option value="">请选择</option>
			   		<option value="01">一般</option>
			   		<option value="02">急</option>
			   		<option value="03">加急</option>
		   		</select>
		   </span>
		   <label>联系方式:</label>
		   <input id="contract"   name="contract"  class="statementaccount"/>
		   	 备注：<input name="headremark" id="headermark" style="width: 600px" maxlength="200">
		   </td>
			</tr>
			<tr>
				<td colspan="2">
				   <span style="display: none;">销售单号：<input name="choiceorderid"  id="choiceorderid"  maxlength="12"  class="orderheadpos" style="width:140px">
			  		</span>选款单号:&nbsp;<input name="saporderid"  id="saporderid" value=""  class="orderheadpos" style="width:140px"/>
			  		
			  		<span id="oldtotalmoneySpan" style="display: none;">原始下单金额：<span id='oldtotalmoney'></span>
			  		原始下单数量：<span id='oldquantity'></span>
			  		</span>
			  		
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
			
			
			
		<!-- 	<div id="statementaccount" title="">
		   <div id="showstatement">
		   <label>加急状态:</label>
		   <select id="urgent">
		   		<option value="01">一般</option>
		   		<option value="02">急</option>
		   		<option value="03">加急</option>
		   </select>
		   <label>联系方式:</label>
		   <input id="contract"   name="contract"  class="statementaccount"/>
		   <label>订单备注:</label>
		   <input id="headremark"   name="headremark"  class="statementaccount"/>
		   </div>
		   <div id="showuploading" align="center" style="display:none">
		        <img src="resource/jquery/ui/images/ui-anim_basic_16x16.gif" alt="正在提交"/>正在提交....
		   </div>
		</div>
			
	 -->
	
	
  </body>
</html>
