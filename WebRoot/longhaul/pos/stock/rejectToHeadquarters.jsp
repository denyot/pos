<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String outid = request.getParameter("outid");
	String opmode = request.getParameter("opmode");
	String posurl = (String) request.getAttribute("posurl");
	posurl = posurl == null || posurl.equals("")
			? "localhost:8080"
			: posurl;
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<base href="<%=basePath%>">
		<script>
    	var outid = "<%=outid%>";
    	var opmode = "<%=opmode%>";
   	 	var posurl="<%=posurl%>";
   		var chargimgpath="http://<%=posurl%>+/sappic/";
</script>
		<title>货品退货</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">

		<script src="resource/jquery/jquery-1.7.2.js"></script>
		<script
			src="resource/jquery/timepicker/jquery-ui-1.8.16.custom.min.js"></script>
		<script src="resource/jquery/timepicker/jquery-ui-timepicker-addon.js"></script>
		<script
			src="resource/jquery/lhgdialog/lhgdialog.min.js?self=true&skin=mac"></script>
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
		<script
			src="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.js"
			type="text/javascript"></script>
		<script src="resource/jquery/jquery-cookie/jquery.cookie.js"
			type="text/javascript"></script>
		<link
			href="resource/jquery/jquery.multiSelect-1.2.3/jquery.multiSelect.css"
			rel="stylesheet" type="text/css" />
		<link rel="stylesheet"
			href="resource/jquery/themes/base/jquery.ui.all.css">
		<link rel="stylesheet"
			href="resource/jquery/jquery.alerts-1.1/jquery.alerts.css">

		<script src="longhaul/pos/stock/js/rejectToHeadquarters.js"
			type="text/javascript"></script>
		<script src="longhaul/pos/stock/js/orderdate.js"
			type="text/javascript"></script>

		<link rel="stylesheet" href="longhaul/pos/stock/css/stock.css"
			media="screen">

	</head>

	<body>

		<table id="ordersystemtable" width="1000px" border="0">
			<tr>
				<td colspan="3" align="center">
					<font class="orderhead" id="orderhead"> 货品退货 </font>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<label class="orderhead" id="sapsalesorderid"></label>
				</td>
			</tr>
			<tr>
				<td width="280px">
					出库时间:
					<input name="ordertime" id="ordertime" class="inputreadonly"
						readonly="readonly" style="background: #f0f0f0"></input>
					<div id="operatedatetime" style="display: none"></div>
				</td>
				<td width="750px">
					<label id="charglabel">
						批&nbsp;&nbsp;&nbsp;&nbsp;次:
					</label>
					<input name="charg" id="charg" style="text-transform: uppercase;"
						class="inputnom">
					<span> 货品类型: <select id="goodtype">
							<option value="">
								请选择...
							</option>
							<option value="1">
								镶嵌类
							</option>
							<option value="2">
								银饰类
							</option>
							<option value="3">
								玉石类
							</option>
							<option value="4">
								18K金类
							</option>
							<option value="5">
								铂金类
							</option>
							<option value="6">
								黄金类
							</option>
							<option value="7">
								钯金类
							</option>
							<option value="8">
								赠品及包材
							</option>
							<option value="9">
								其他
							</option>
						</select> </span>
				</td>

			</tr>

			<tr>

				<td>
					数&nbsp;&nbsp;&nbsp;&nbsp;量:
					<input name="number" id="number" class="inputnumbernom"
						maxlength="5">
					</input>
					<span id="meins"></span>
					<input name="realnumber" id="realnumber" class="inputnumbernom"
						maxlength="5" style="display: none">
					</input>

				</td>
				<td align="right">
					退到门店：
					<select id="inwerk">
						<option value="1000">
							1000 总部
						</option>
					</select>

					退到库位
					<select id="inLgort">
						<option value="0018">
							0018在途仓
						</option>
					</select>

					<input type="button" id="submit" value="提交"
						class="orersystembutton" />
				</td>

			</tr>
			<tr id="showmatnrinfo" style="display: none">
				<td rowspan="2" width="310px">
					<label>
						<input type="radio" id="chargtype" name="chargtype" value="charg"
							checked="checked" disabled="disabled">
						商品
						<input type="radio" id="chargtype" name="chargtype" value="gift"
							disabled="disabled" style="display: none">
						<!-- 赠品 -->
					</label>
					<a href="" class="tooltip" title="商品图片"> <img alt="商品照片" src=""
							id="pcimage" align="middle" style="width: 80px; height: 68px">
						</img> </a>
				</td>
				<td style="border: thin 2px;" colspan="2">
					<label id="matnrlabel">
						物料号:
					</label>
					<input name="matnr" id="matnr" readonly="readonly"
						class=inputreadonly style="width:140px;background:#f0f0f0" />
					名称:
					<input name="zhlhx" id="zhlhx" readonly="readonly"
						class="inputreadonly" style="width: 150px; background: #f0f0f0" />
					标签价格:
					<input name="ztjtj" style="width: 80px; background: #f0f0f0"
						class="inputreadonly" id="ztjtj" readonly="readonly">


				</td>

			</tr>

			<tr style="display: none" id="showmatnrinfo2">
				<td width="700px" colspan="2">

					金重:
					<input name="goldweight" style="width: 40px; background: #f0f0f0"
						class="inputreadonly"  id="goldweight">
					石重:
					<input name="gemweight" style="width: 40px; background: #f0f0f0"
						class="inputreadonly" id="gemweight" readonly="readonly">
					<!-- 证书号:
					<input name="certificateno" id="certificateno" readonly="readonly" class="inputreadonly" style="background:#f0f0f0">
				
					<label id="personcostlabel">工费:</label>
					<input name="personcost" id="personcost" class="inputreadonly" value="0" style="background:#f0f0f0"  readonly="readonly">
					 -->
					<label id="personcostlabel">
						库位:
					</label>
					<input name="logrt" id="logrt" class="inputreadonly" value="0"
						style="background: #f0f0f0" readonly="readonly">
					<label id="personcostlabel">
						备注:
					</label>
					<input name="remark" id="remark">

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
								<th style="display: none">
									上层
								</th>
								<th>
									批次
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
								<th style="display: none">
									单价
								</th>
								<th>
									数量
								</th>
								<!-- 	<th id="thpersoncost" >
									工费
								</th>-->
								<th id="thgoldweight">
									金重
								</th>

								<th style="display: none">
									合计
								</th>
								<th>
									标签价
								</th>
								<th>
									库位
								</th>
								<th>
									备注
								</th>

							</tr>

							<tr>
								<td>
									&nbsp;
								</td>
								<td style="display: none">
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
								<td class="tdtotallevel" align='right'
									style="font-size: 14px; white-space: nowrap;">
									<div id="totalnumber">
										0
									</div>
								</td>
								<td class="tdtotallevel" align='right'
									style="font-size: 14px; white-space: nowrap;">
									<div id="totalgoldweight">
										0
									</div>
								</td>
								<td class="tdtotallevel" align='right'
									style="font-size: 14px; white-space: nowrap;">
									<div id="totalprice">
										0
									</div>
								</td>

							</tr>
						</thead>

					</table>

				</td>

			</tr>

			<tr>
				<td colspan="2">
					<span style="display: none;" id="outidSpan"> 出库单号： <input
							name="outid" id="outid" maxlength="12" class="orderheadpos"
							style="width: 140px" /> </span> 备注：
					<input id="headremark" style="width: 600px" maxlength="200">
				</td>
			</tr>
		</table>

		<div id="statementaccount" title="">
			<div id="showstatement">
				<label>
					邮寄单号:
				</label>
				<input id="postno" name="postno" class="statementaccount" />
				<label>
					邮寄时间:
				</label>
				<input id="posttime" name="posttime" class="statementaccount" />
			</div>
			<div id="showuploading" align="center" style="display: none">
				<img src="resource/jquery/ui/images/ui-anim_basic_16x16.gif"
					alt="正在提交" />
				正在提交....
			</div>
		</div>
	</body>
</html>
