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
<TITLE>�û���ҵ�޸�</TITLE>
<%cn.longhaul.common.OptionRecords.optionLog2
((cn.longhaul.vo.UserLoginInf) session.getAttribute("userlogininf"),"�û���ҵ�޸�");%>
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
			alert("һ��ֻ��ѡ��һ�У�");
			return false;
		}
		if($("input:checked").not("#selAll").length == 0){
			alert("������ѡ��һ�У�");
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
	//��̬��Ԫ��
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
	
	//ɾ������
	$("#paraDelButton").click(function(){
		if($("input:checked").not("#selAll").length == 0)
		{
			alert("��ѡ��Ҫɾ�����У�");
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
	//�޸Ĳ���
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
					//alert("ɾ���ɹ���");
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
	var htmlStr="<tr><td><input type='checkbox' id='selAll'/></td><td>������</td><td>λ��</td><td>����ֵ</td></tr>";
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
	       		alert   ( "������ʱ����(hh:dd:ss) "); 
	            daily.focus(); 
	            daily.select(); 
	            return   false;     
	    }  
	  	if(tmpDateValue.substring(2,3)!=":" || tmpDateValue.substring(5,6)!=":"){
	  			alert   ( "�밴�ո�ʽ����ʱ����(hh:dd:ss) "); 
            	daily.focus(); 
            	daily.select(); 
            	return   false; 
	  	}
		if(!shu.test(tmpDateValue.substring(0,2))||!shu.test(tmpDateValue.substring(3,5))||!shu.test(tmpDateValue.substring(6,8)))   { 
            	alert   ( "�밴�ո�ʽ����ʱ����(hh:dd:ss) "); 
            	daily.focus(); 
            	daily.select(); 
            	return   false; 
     	} 
		if(tmpDateValue.substring(0,1)>5 || tmpDateValue.substring(3,4)>5 || tmpDateValue.substring(6,7)>5)   { 
	           	alert   ( "�밴�ո�ʽ����ʱ����(hh:dd:ss) "); 
	           	daily.focus(); 
	           	daily.select(); 
	           	return   false; 
      	} 
		if(url.value.length>100){
			alert('��ҵ�����ܳ���100�ַ�');
			url.focus();
			return false;
		}
		if(daily.value.length>20){
			alert('��ҵ���ڲ��ܳ���20���ַ�');
			daily.focus();
			return false;
		}
		if(jobtype.value.length>20){
			alert('ִ�������Ͳ��ܳ���20���ַ�');
			jobtype.focus();
			return false;
		}
		if(weekly.value.length>20){
			alert('ʱ���ܲ��ܳ���20���ַ�');
			weekly.focus();
			return false;
		}
		if(monthly.value.length>20){
			alert('ʱ���²��ܳ���20���ַ�');
			monthly.focus();
			return false;
		}
		if(createname.value.length>20){
			alert('�������������ܳ���20���ַ�');
			createname.focus();
			return false;
		}
		if(jobdefaulttype.value.length>20){
			alert('��ҵִ�����Ͳ��ܳ���20���ַ�');
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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;��ǰ�������û���ҵ��Ϣ����&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(����*������д</td></tr>
<tr><td style="border:0">
<div style="width:100%;height:500;overflow:auto"><br>
<table width=95% align=center BORDER=0 cellpadding=0 cellspacing=0 ><tr><td>
 <fieldset>
 <legend><font color="#FF0000">�û���ҵ��Ϣ</font></legend>
	  <br><TABLE width="100%" border="0" cellspacing="1" cellpadding="0">
  <TBODY><TR>
    <TD width="11%" align="right" class="bodytd1"></TD>
							<TD width="35%" colspan="3"></TD>
						</TR>
	 <TR>
    
    <TD align="right" class="bodytd1">��ҵID</TD>
    <TD class="bodytd2"><INPUT readonly="readonly" class="textdocdown" name="jobid" value="<%=job.getJobid() %>" style="width:40%">
   
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
    
  </TR>
    <TR>
    
    <TD align="right" class="bodytd1">��ҵ��</TD>
    <TD class="bodytd2">
		<INPUT class="textdocdown" name="url" value="<%=job.getUrl() %>" style="width:80%" readonly="readonly">
		</TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
    
  </TR>
  <TR>
    <TD align="right" class="bodytd1">��ҵ����:</TD>
    <TD class="bodytd2"><INPUT class="textdocdown" name="daily" value="<%=job.getDaily() %>" style="width:80%">
      </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
    <TR>
    <TD align="right" class="bodytd1">ִ��������:</TD>
    <TD class="bodytd2">
       	<select class="textdocdown" name="jobtype">
       		<option value="<%=job.getJobtype() %>">
       		<%if(job.getJobtype().equals("daily")){ %>
       			��
       		<%} %>
       		<%if(job.getJobtype().equals("weekly")){ %>
       			��
       		<%} %>
       		<%if(job.getJobtype().equals("monthly")){ %>
       			��
       		<%} %>
       		</option>
       		<%if(!job.getJobtype().equals("daily")){ %>
       		<option value="daily">��</option>
       		<%} %>
       		<%if(!job.getJobtype().equals("weekly")){ %>
			<option value="weekly">
					��</option><%} %>
			<%if(!job.getJobtype().equals("monthly")){ %>
			<option value="monthly">
					��</option>
			<%} %>
		</select>
    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <TR>
    <TD align="right" class="bodytd1">ʱ����:</TD>
    <TD class="bodytd2"><INPUT class="textdocdown" name="weekly" value="<%=job.getWeekly() %>" style="width:80%">

    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <TR>
    <TD align="right" class="bodytd1">ʱ����:</TD>
    <TD class="bodytd2"><INPUT class="textdocdown" name="monthly" value="<%=job.getMonthly() %>" style="width:80%">
    
    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <TR>
    <TD align="right" class="bodytd1">������:</TD>
    <TD class="bodytd2"><INPUT readonly="readonly" class="textdocdown" name="createname" value="<%=job.getCreatename() %>" style="width:80%">
    
    </TD>
    <TD align="right" class="bodytd1"></TD>
    <TD class="bodytd2"></TD>
  </TR>
  <TR>
    <TD align="right" class="bodytd1">��ҵִ������:</TD>
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
  	<TD align="right" class="bodytd1">����:</TD>
    <TD class="bodytd2" style="height: 10px;">
    	<div style="vertical-align: middle;">
    	<button name="" id="paraDelButton" name="paraDelButton">ɾ������</button>
    	<button name="" id="paraModify" name="paraModify">�޸Ĳ���</button>
    	</div>
    	<table class="paraTable" style="display: inline;" id="mainParaTable">
    		<tr>
    			<td><input type="checkbox" id="selAll"/></td>
    			<td>������</td>
    			<td>λ��</td>
    			<td>����ֵ</td>
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
    			<td>������</td>
    			<td><input name="paraName" id="paraName"/><input name="oldParaName" id="oldParaName" type="hidden"/><input id="paraId" name="paraId" type="hidden"/></td>
    		</tr>
    		<tr>
    			<td>λ��</td>
    			<td><input name="paraPos" id="paraPos"/></td>
    		</tr>
    		<tr>
    			<td>����ֵ</td>
    			<td><input name="paraValue" id="paraValue"/></td>
    		</tr>
    		<tr>
    			<td colspan="2"><input type="button" name="paraModifyButton" id="paraModifyButton" value="�޸�"/></td>
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
    <input type="submit"  class='btndoc'  value='ȷ ��'>
&nbsp;&nbsp;
  <input type='button' class='btndoc' onClick='window.close()' value='�� ��'>
  <br><br>
</div></td></tr></table></div></table></form>
</BODY>
</html>

