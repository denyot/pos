<%@ page language="java" import="java.util.*,cn.longhaul.sap.syncbase.RFCInfo,java.util.Map.Entry,
cn.longhaul.sap.syncbase.RfcTable,cn.longhaul.sap.syncbase.RFCFieldInfo" pageEncoding="GBK"%>
<html>
  <head>
    <title>RFC����</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
    <LINK href="../css/main.css" type=text/css rel=stylesheet>
	<LINK href="../css/doc.css" type=text/css rel=stylesheet>
	<script src="../js/longhaul.js"></script>
	<script type='text/javascript' src='/dwr/interface/longhaulajax.js'></script>
	<script type='text/javascript' src='/dwr/engine.js'></script>
	<script type='text/javascript' src='/dwr/util.js'></script>	
  <script type="text/javascript">
    function useroption(optionname){
     document.getElementById("reqCode").value=optionname;
     if(optionname=="addRFCSet"){
         if(confirm("���棡�����ݿⴴ�����ɾ�����ݿ����Ѵ��ڵı��Ƿ�ȷ��?")){
           document.forms[0].submit();
	     }else{
	       return false;
	     }
     }else{
        document.forms[0].submit();
     }
    }
    
    
function callAddressSAP(name,desc, isTrue,sub,f_name,expName){
	var cancel_name = document.getElementsByName(f_name)[0].value;
	AddressSAP(name, desc, false,sub);
	var function_name=document.getElementsByName(f_name)[0].value;
	if(function_name!=""&&cancel_name!=function_name){
		DWREngine.setAsync(false); 
		longhaulajax.getBaseFunction(function_name,getCateCallback);
		DWREngine.setAsync(true); 
		function getCateCallback(data){
			if(data!=null && data !=""){
				document.getElementsByName(expName)[0].value=function_name;
				document.getElementsByName(f_name)[0].value=data;
			}
		}
	}else{
		if(cancel_name!=function_name)
			document.getElementsByName(expName)[0].value="";
	}
}
    
  </script>
 
  </head>
  <%
  	RFCInfo  rfcInfo =(RFCInfo)request.getAttribute("rfcInfo");
  	session.setAttribute("rfcInfo",rfcInfo);
  %>
  <body>
<form action="/sapweb/saprfcconfiger.do" method="post">
<input type="hidden" id="reqCode" name="reqCode" value="add">
<table width=100% align=center BORDER=1 cellpadding=0 cellspacing=0 bordercolor=#3399ff><tr>
<td style="border:0;height:56;"></td></tr>
<tr><td height=24 bordercolor=#999999 bgcolor=#c6e7ff style="color:#ff0000">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;��ǰ������RFC ӳ��&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(����*������д</td></tr>
<tr><td style="border:0">
<div style="width:100%;height:100%;overflow:auto"><br>
<table width=100% align=center BORDER=0 cellpadding=0 cellspacing=0 ><tr><td>
 <fieldset>
 <legend><font color="#FF0000"><%=rfcinfo.getRfcName()%> ӳ���ֶ�</font></legend>
  <br><TABLE width="100%" border="0" cellspacing="1" cellpadding="0">
  <TBODY><TR>
    <TD width="11%" align="right" class="bodytd1"></TD>
	<TD width="35%" colspan="3"></TD></TR>
       <%
       	ArrayList inputparainfo =rfcinfo.getInputFiledInfo();
        if (inputparainfo!=null&&inputparainfo.size() > 0) {   // ��������˲���
       	 	for(int i=0;i<inputparainfo.size();i++){
    		RFCFieldInfo  rfcfieldinfo= (RFCFieldInfo)inputparainfo.get(i);
       %>
	    <TR>
	    <TD align="right" class="bodytd1"><%=rfcfieldinfo.getFiledDescription()%></TD>
	    <TD class="bodytd2"><%=rfcfieldinfo.getFieldName()%> </TD>
	    <TD class="bodytd2">
	    ������<INPUT class="textdocdown" name="aig<%=rfcfieldinfo.getFieldName()%>desc" value="<%=rfcfieldinfo.getFiledDescription()%>" style="width:100px">
	    ֵ:<INPUT class="textdocdown" name="aigvalue<%=rfcfieldinfo.getFieldName()%>" value="" style="width:100px">
	    <input type="hidden" name="hiddenName">
        <A id="defaultSuj" name="singleSelect" href="javascript:callAddressSAP('name:ad', 'hiddenName:aigvalue<%=rfcfieldinfo.getFieldName()%>', false,'SAP_D_DefalultFunction','aigvalue<%=rfcfieldinfo.getFieldName()%>','<%=rfcfieldinfo.getFieldName()%>per');">
		<IMG border="0" src="../images/icon/icon_select.gif" width="13" height="14"></A>
	    ���ʾ:<INPUT class="textdocdown" name="<%=rfcfieldinfo.getFieldName()%>per" value="" style="width:100px">
	    </TD>
	    <TD align="right" class="bodytd1"><%=rfcfieldinfo.getFieldType()%></TD>
	    </TR>
	    <%=rfcfieldinfo.getSonTableInfo() %>
    <%
    	}}
    %>
</TBODY></TABLE>
<br>
</fieldset>

<fieldset>
 <legend><font color="#FF0000"><%=rfcinfo.getRfcName()%> ӳ���</font></legend>
  <br><TABLE width="100%" border="0" cellspacing="1" cellpadding="0">
  <TBODY>
    <%ArrayList rfcTableList = rfcinfo.getRfcTableList(); %>
    <%if(rfcTableList!=null){
//      ArrayList rfctablelist=rfcinfo.getRfcTableList();
       for(int j=0;j<rfcTableList.size();j++){
        RfcTable rfcListTable =(RfcTable)rfcTableList.get(j);
        String aigtablename = rfcInfo.getRfcName()+rfclistTable.getTablename();
        aigtablename =aigtablename.length()>28?aigtablename.substring(0,28):aigtablename; 
     %>
   
    <TR>
    <TD width="200px" align="right" class="bodytd1">  RFC�� </TD>
	<TD width="200px">&nbsp;&nbsp;<%=rfclistTable.getTablename()%>&nbsp;&nbsp;&nbsp;&nbsp;ӳ�䵽 </TD>
	<TD class="bodytd2">&nbsp;&nbsp;AIG��&nbsp;&nbsp;&nbsp;&nbsp;<input class="textdocdown" name=aig<%=rfclistTable.getTablename() %>  value="<%=aigtablename%>"  style="width:200px" readonly="readonly">  </TD>
	<TD class="bodytd2"></TD>
	</TR>
    <%
	    		ArrayList<?> rfctableinfo = rfcListTable.getRfcTableInfo();
	    		for(int i=0;i<rfctableinfo.size();i++){
	    		RFCFieldInfo  rfcfieldinfo= (RFCFieldInfo)rfctableinfo.get(i);
	    		String style=i%2==0?"TrinviewOther2":"TrinviewOther1";
			    %>
			    <TR class="<%=style%>">
			    <TD align="right" class="bodytd1"><%=rfcfieldinfo.getFiledDescription() %>�ֶ�</TD>
			    <TD class="bodytd2"><font color="#ff0000">&nbsp;&nbsp;<%=rfcfieldinfo.getFieldName()%></font></TD>
			    
			    <TD class="bodytd2">ӳ�䵽&nbsp;&nbsp;&nbsp;&nbsp;
			    <INPUT class="textdocdown" name="aig<%=rfcfieldinfo.getFieldName() %>desc" value="<%=rfcfieldinfo.getFiledDescription()%>" style="width:120px">
			    <INPUT class="textdocdown" name="aig<%=rfcfieldinfo.getFieldName() %>" value="<%=rfcfieldinfo.getFieldName() %>"   readonly="readonly" style="width:80px">
			     ���� <INPUT class="textdocdown" name="aig<%=rfcfieldinfo.getFieldName() %>pri"   type="checkbox">
			    </TD>
			    <TD align="right" class="bodytd1"><%=rfcfieldinfo.getFieldType()%></TD>
			  </TR>
  	<% }}}
    %>
</TBODY></TABLE>
<br>
</fieldset>
<br>	

<hr size=1 color="#0066CC">
<div align="center">
  <input type="button"  class='btndoc'  onClick='useroption("addRFCSet")'  value='ȷ ��' >&nbsp;&nbsp;
  <input type='button' class='btndoc' onClick='useroption("searchdata")' value='�� ѯ'>&nbsp;&nbsp;
   <input type='button' class='btndoc' onClick='history.go(-1)' value='�� ��'>
  <br><br>
</div></td></tr></table></div></table>
 </form>
  </body>
</html>
