 <%@page pageEncoding="GBK"  contentType="text/html; charset=GBK" language="java"%>
<%@page import="cn.longhaul.dao.Sap_userjobdefaultDao"%>
<%@page import="cn.longhaul.vo.Sap_userjobdefault"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.Iterator"%>
<%@page import="cn.longhaul.dao.Sap_JobDefaultParaDao"%>
<%@page import="cn.longhaul.vo.Sap_defaultPara"%>
<%@page import="java.util.List"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
 
<html>
<HEAD>

<META http-equiv="Content-Type" content="text/html; charset=GBK">
<META name="GENERATOR" content="IBM WebSphere Studio">
<META http-equiv="Content-Style-Type" content="text/css">
<LINK href="../css/main.css" type=text/css rel=stylesheet><LINK 
href="../css/doc.css" type=text/css rel=stylesheet>
<TITLE>用户作业修改</TITLE>
<%cn.longhaul.common.OptionRecords.optionLog2
((cn.longhaul.vo.UserLoginInf) session.getAttribute("userlogininf"),"用户作业修改");%>
<script src="../js/common.js"></script>
<script src="../js/longhaul.js"></script>
<script type="text/javascript" src="../aig/js/jquery-1.4.js"></script>
<script type='text/javascript' src='/dwr/interface/longhaulajax.js'></script>
<script type='text/javascript' src='/dwr/engine.js'></script>
<script type="text/javascript" src="../aig/js/jquery.livequery.js"></script>
<script>
$(document).ready(function(){
	$("#paraTable").hide();
	$("#paraModify").click(function(){
		if($("input:checked").not("#selAll").length > 1){
			alert("一次只能选择一行！");
			return false;
		}
		if($("input:checked").not("#selAll").length == 0){
			alert("请至少选择一行！");
			return false;
		}
		if($("#paraTable").css("display") == "none"){
			$("#paraTable").show();
			var paraName = $("input:checked").not("#selAll").parent().nextAll().eq(0).text();
			var paraValue = $("input:checked").not("#selAll").parent().nextAll().eq(2).text();
			var paraPos = $("input:checked").not("#selAll").parent().nextAll().eq(1).text();
			var paraId = $("input:checked").not("#selAll").next().val();
			$("#paraName").val(paraName);	
			$("#paraValue").val(paraValue);	
			$("#paraPos").val(paraPos);
			$("#oldParaName").val(paraName);
			$("#paraId").val(paraId);
			}
		else{
			var paraName = $("input:checked").not("#selAll").parent().nextAll().eq(0).text();
			var paraValue = $("input:checked").not("#selAll").parent().nextAll().eq(2).text();
			var paraPos = $("input:checked").not("#selAll").parent().nextAll().eq(1).text();
			var paraId =  $("input:checked").not("#selAll").next().val();
			$("#paraName").val(paraName);	
			$("#paraValue").val(paraValue);	
			$("#paraPos").val(paraPos);	
			$("#oldParaName").val(paraName);
			$("#paraId").val(paraId);
		}
	});
	//动态绑定元素
	$("#selAll").livequery("click",function(){
		if($(this).attr("checked") == true){
			$("input[type='checkbox']").attr("checked",true);
		}else
		{
			$("input[type='checkbox']").attr("checked",false);
		}	
	});
	
$("#aliasSel").change(function(){
		longhaulajax.queryUserJobParaByAlias($(this).val(),doSelJob);
	});
	
	//删除参数
	$("#paraDelButton").click(function(){
		if($("input:checked").not("#selAll").length == 0)
		{
			alert("请选择要删除的行！");
			return;
		}
		var ids = "&";
		$("input:checked").not("#selAll").each(function(i){
			var id = $(this).nextAll().eq(0).val();
			if(i!=$("input:checked").not("#selAll").length-1){
				ids += "id="+id+"&";
			}else{
				ids += "id="+id;
			}
			
		});
		$.ajax({
			type: "POST",
			url: "/sapweb/job.do?reqCode=deletePara"+ids,
			//data: encodeURI(params),
			dataType:"text",
			success: function(data, textStatus){
				window.location.reload();
			},
			error: function(msg){
				alert("msg="+msg);
			}				
		});
	});	
	//修改参数
	$("#paraModifyButton").click(function(){
			var paraId = $("#paraId").val();
			var paraName = $("#paraName").val();
			var paraPos = $("#paraPos").val();
			var paraValue = $("#paraValue").val();
			var oldParaName = $("#oldParaName").val();
			$.ajax({
				type: "get",
				url: "/sapweb/job.do?reqCode=updatePara&paraId="+paraId+"&paraName="+paraName+"&paraPos="+paraPos+"&oldParaName="+oldParaName+"&paraValue="+paraValue,
				//data: encodeURI(params),
				dataType:"text",
				success: function(data, textStatus){
					//alert("删除成功！");
					window.location.reload();
					//$('#showDeliveryDetail').html(data);
				},
				error: function(msg){
					alert("msg="+msg);
				}				
			});
	});
	
}); 
function doSelJob(data){
	var htmlStr="<tr><td><input type='checkbox' id='selAll'/></td><td>参数名</td><td>位置</td><td>参数值</td></tr>";
	for(var attr in data){
		var trStr="";
		trStr = "<tr><td><input type='checkbox'/><input type='hidden' value='"+data[attr].id+"'/></td><td>"+data[attr].para+"<input name='paraName' type='hidden' value="+data[attr].para+"/></td>"+"<td>"+data[attr].position+"<input name='paraPos' type='hidden' value="+data[attr].position+"/></td><td>"+data[attr].value+"<input name='paraValue' type='hidden' value="+data[attr].value+"/></td></tr>";
		htmlStr += trStr;
	}
	$("#mainParaTable").html(htmlStr);
}
function check()
{
	with(document.forms[0])
	{
		var tmpDateValue=daily.value;
		var shu=/^-?\d+$/;
		if(tmpDateValue.length==0){
				return true;
		}
		if   ((tmpDateValue.length   !=   8) )   { 
	       		alert   ( "请输入时分秒(hh:dd:ss) "); 
	            daily.focus(); 
	            daily.select(); 
	            return   false;     
	    }  
	  	if(tmpDateValue.substring(2,3)!=":" || tmpDateValue.substring(5,6)!=":"){
	  			alert   ( "请按照格式输入时分秒(hh:dd:ss) "); 
            	daily.focus(); 
            	daily.select(); 
            	return   false; 
	  	}
		if(!shu.test(tmpDateValue.substring(0,2))||!shu.test(tmpDateValue.substring(3,5))||!shu.test(tmpDateValue.substring(6,8)))   { 
            	alert   ( "请按照格式输入时分秒(hh:dd:ss) "); 
            	daily.focus(); 
            	daily.select(); 
            	return   false; 
     	} 
		if(tmpDateValue.substring(0,1)>5 || tmpDateValue.substring(3,4)>5 || tmpDateValue.substring(6,7)>5)   { 
	           	alert   ( "请按照格式输入时分秒(hh:dd:ss) "); 
	           	daily.focus(); 
	           	daily.select(); 
	           	return   false; 
      	} 
		if(url.value.length>100){
			alert('作业名不能超过100字符');
			url.focus();
			return false;
		}
		if(daily.value.length>20){
			alert('作业日期不能超过20个字符');
			daily.focus();
			return false;
		}
		if(jobtype.value.length>20){
			alert('执行天类型不能超过20个字符');
			jobtype.focus();
			return false;
		}
		if(weekly.value.length>20){
			alert('时间周不能超过20个字符');
			weekly.focus();
			return false;
		}
		if(monthly.value.length>20){
			alert('时间月不能超过20个字符');
			monthly.focus();
			return false;
		}
		if(createname.value.length>20){
			alert('创建人姓名不能超过20个字符');
			createname.focus();
			return false;
		}
		if(jobdefaulttype.value.length>20){
			alert('作业执行类型不能超过20个字符');
			jobdefaulttype.focus();
			return false;
		}
	}
		return true;	
}

</script>
 
   <%
 		String jobid=request.getParameter("jobid");
 		Sap_userjobdefault job= Sap_userjobdefaultDao.findSap_userjobdefaultById(Integer.parseInt(jobid));
 		
  %> 
 <style type="text/css">
 	.paraTable,
	.paraTable td { border-collapse:collapse;  border: solid #000000; border-width:1px 1px 1px 1px; }
 </style>
</HEAD>
 
 
<BODY>
 
 
<P></P>
<form METHOD='POST' ACTION='/sapweb/job.do'  name='form1' target='_self' onsubmit="return check()">
<input type="hidden" name="reqCode" value="update">
<table width=98% align=center BORDER=1 cellpadding=0 cellspacing=0 bordercolor=#3399ff><tr>
<td style="border:0;height:56;"></td></tr>
<tr><td height=24 bordercolor=#999999 bgcolor=#c6e7ff style="color:#ff0000">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前操作：用户作业信息更新&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(标有*必须填写</td></tr>
<tr><td style="border:0">
<div style="width:100%;height:500;overflow:auto"><br>
<table width=95% align=center BORDER=0 cellpadding=0 cellspacing=0 ><tr><td>
 <fieldset>
 <legend><font color="#FF0000">用户作业信息</font></legend>
	  <br><TABLE width="100%" border="0" cellspacing="1" cellpadding="0">
  <TBODY><TR>
    <TD width="11%" align="right" class="bodytd1"></TD>
							<TD width="35%" colspan="3"></TD>
						</TR>
	 <TR>
    
    <TD align="right" class="bodytd1">作业ID</TD>
    <TD class="bodytd2"><INPUT readonly="readonly" class="textdocdown" name="jobid" value="<%=job.getJobid() %>" style="width:40%">
   
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
    
  </TR>
    <TR>
    
    <TD align="right" class="bodytd1">作业名</TD>
    <TD class="bodytd2">
		<INPUT class="textdocdown" name="url" value="<%=job.getUrl() %>" style="width:80%" readonly="readonly">
		</TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
    
  </TR>
  <TR>
    <TD align="right" class="bodytd1">作业日期:</TD>
    <TD class="bodytd2"><INPUT class="textdocdown" name="daily" value="<%=job.getDaily() %>" style="width:80%">
      </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
    <TR>
    <TD align="right" class="bodytd1">执行天类型:</TD>
    <TD class="bodytd2">
       	<select class="textdocdown" name="jobtype">
       		<option value="<%=job.getJobtype() %>">
       		<%if(job.getJobtype().equals("daily")){ %>
       			天
       		<%} %>
       		<%if(job.getJobtype().equals("weekly")){ %>
       			周
       		<%} %>
       		<%if(job.getJobtype().equals("monthly")){ %>
       			月
       		<%} %>
       		</option>
       		<%if(!job.getJobtype().equals("daily")){ %>
       		<option value="daily">天</option>
       		<%} %>
       		<%if(!job.getJobtype().equals("weekly")){ %>
			<option value="weekly">
					周</option><%} %>
			<%if(!job.getJobtype().equals("monthly")){ %>
			<option value="monthly">
					月</option>
			<%} %>
		</select>
    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <TR>
    <TD align="right" class="bodytd1">时间周:</TD>
    <TD class="bodytd2"><INPUT class="textdocdown" name="weekly" value="<%=job.getWeekly() %>" style="width:80%">

    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <TR>
    <TD align="right" class="bodytd1">时间月:</TD>
    <TD class="bodytd2"><INPUT class="textdocdown" name="monthly" value="<%=job.getMonthly() %>" style="width:80%">
    
    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <TR>
    <TD align="right" class="bodytd1">创建人:</TD>
    <TD class="bodytd2"><INPUT readonly="readonly" class="textdocdown" name="createname" value="<%=job.getCreatename() %>" style="width:80%">
    
    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <TR>
    <TD align="right" class="bodytd1">作业执行类型:</TD>
    <TD class="bodytd2">
    	<select class="textdocdown" name="jobdefaulttype" >
       		<option value="<%=job.getJobdefaulttype() %>"><%=job.getJobdefaulttype() %></option>
       		<%if(!job.getJobdefaulttype().equals("USUERJOB")){ %>
       		<option value="USUERJOB">USUERJOB</option>
       		<%} %>
       		<%if(!job.getJobdefaulttype().equals("JOBFIXED")){ %>
			<option value="JOBFIXED">
					JOBFIXED</option><%} %>
			<%if(!job.getJobdefaulttype().equals("JOBTIME")){ %>
			<option value="JOBTIME"><%} %>
					JOBTIME</option>
			<%if(!job.getJobdefaulttype().equals("JOBITS")){ %>
			<option value="JOBITS">
					JOBITS</option>
			<%} %>
		</select>
    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <tr>
  	<TD align="right" class="bodytd1">参数:</TD>
    <TD class="bodytd2" style="height: 10px;">
    	<div style="vertical-align: middle;">
    	<button name="" id="paraDelButton" name="paraDelButton">删除参数</button>
    	<button name="" id="paraModify" name="paraModify">修改参数</button>
    	</div>
    	<table class="paraTable" style="display: inline;" id="mainParaTable">
    		<tr>
    			<td><input type="checkbox" id="selAll"/></td>
    			<td>参数名</td>
    			<td>位置</td>
    			<td>参数值</td>
    		</tr>
    		<%
						List< Sap_defaultPara > list2 = Sap_JobDefaultParaDao.getUserJobListByAlias(job.getJobid());
						for(int j=0;j<list2.size();j++){
							Sap_defaultPara para = list2.get(j);
	 			%>
    		<tr>
    			<td><input type="checkbox"/><input type="hidden" value="<%=para.getId().replace(" ","") %>" /></td>
    			<td><%=para.getPara().replace(" ","") %><input name="paraName" type="hidden" value="<%=para.getPara().replace(" ","") %>"/></td>
	    		<td><%=para.getPosition().replace(" ","") %><input  name="paraPos" type="hidden" value="<%=para.getPosition().replace(" ","") %>"/></td>
	    		<td><%=para.getValue().replace(" ","") %></td>
    		</tr>
    		<%
    			}
    		 %>
    	</table>
    	<input type="hidden" name="hidPara" id="hidPara"/>
    	<table id="paraTable" class="paraTable">
    		<tr>
    			<td>参数名</td>
    			<td><input name="paraName" id="paraName"/><input name="oldParaName" id="oldParaName" type="hidden"/><input id="paraId" name="paraId" type="hidden"/></td>
    		</tr>
    		<tr>
    			<td>位置</td>
    			<td><input name="paraPos" id="paraPos"/></td>
    		</tr>
    		<tr>
    			<td>参数值</td>
    			<td><input name="paraValue" id="paraValue"/></td>
    		</tr>
    		<tr>
    			<td colspan="2"><input type="button" name="paraModifyButton" id="paraModifyButton" value="修改"/></td>
    		</tr>
    	</table>
    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </tr>
</TBODY></TABLE>
<br>
	  </fieldset>
<br>	
<hr size=1 color="#0066CC">
<div align="center">
    <input type="submit"  class='btndoc'  value='确 定'>
&nbsp;&nbsp;
  <input type='button' class='btndoc' onClick='window.close()' value='关 闭'>
  <br><br>
</div></td></tr></table></div></table></form>
</BODY>
</html>

