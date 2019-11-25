<%@ page language="java" import="java.util.*,cn.longhaul.sap.syncbase.RFCInfo,java.util.Map.Entry,
 cn.longhaul.sap.syncbase.RfcTable,cn.longhaul.sap.syncbase.RFCFieldInfo" pageEncoding="GBK"%>
<html>
  <head>
    <title>RFC调用</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
    <LINK href="../css/main.css" type=text/css rel=stylesheet>
	<LINK href="../css/doc.css" type=text/css rel=stylesheet>
	
  <%
  	RFCInfo  rfcInfo =(RFCInfo)request.getAttribute("rfcInfo");
  	String   exportdatafile = request.getAttribute("exportdatafile")==null?"":request.getAttribute("exportdatafile").toString();
  	ArrayList  rfcTableList = rfcInfo.getRfcTableList();
  	request.setAttribute("rfcinfo",rfcInfo);
  	RFCInfo rfcinfolist  = (RFCInfo)request.getAttribute("dataresult");
  	String userchoseoption= request.getParameter("userchoseoption")==null?"":request.getParameter("userchoseoption").toString();
  	userchoseoption = userchoseoption.equals("on")?"checked":"";
    session.setAttribute("rfcinfo",rfcInfo);
  %>

 <script type="text/javascript">
    function useroption(optionname,optionexport){
     document.getElementById("reqCode").value=optionname;
     document.getElementById("exportdata").value=optionexport;
     document.forms[0].submit();
    }
 window.onload=function(){
   //alert("<%=exportdatafile%>");
   if("<%=exportdatafile%>"!="")
   window.location.href="/"+"<%=exportdatafile%>";
 }
    
 document.onkeydown = function(){
   if (event.keyCode == 13) {   
        useroption("searchdatado","");
        }
   }
  </script>
  
<style>
.FixedTitleRow
{
    position: relative; 
    top: expression(this.offsetParent.scrollTop);
    z-index: 10; 
    border:white solid 1px;
}
.FixedFootRow
{
    position: relative; 
    top: expression(this.offsetParent.scrollFoot);
    z-index: 10; 
    border:white solid 1px;
}

.FixedTitleColumn
{
	background:#e4e5fa; FONT: 13px/20px "宋体";
    position: relative; 
    left: expression(this.parentElement.offsetParent.scrollLeft);
    border:white solid 1px;
}

.FixedDataColumn
{
	background:#e4e5fa; FONT: 13px/20px "宋体";
    position: relative;
    left: expression(this.parentElement.offsetParent.parentElement.scrollLeft);
    border:white solid 1px;
}
  
</style>
</head>
 <body leftmargin="0" marginheight="0" marginwidth="0" bottommargin="0" rightmargin="0" topmargin="0" style="overflow:hidden"  class="body">
 <form action="/sapweb/saprfcconfiger.do" method="get">
   <div id="scrollDiv" style="width: 100%; overflow: auto; cursor: default; display: inline;position: relative; height: 100%;">
       <table  id="sortTable" width="100%" bgColor="#ffffff" align="center" border="0" cellSpacing="0" cellPadding="0">
       <tr  class="FixedTitleRow">
       <td class="FixedDataColumn">
 		<input type="hidden" id="reqCode" name="reqCode" value="add">
 		<input type="hidden" id="exportdata" name="exportdata" value="export">
		<fieldset>
 		<legend><font color="#FF0000"><%=rfcInfo.getRfcName()%>查询</font></legend>
 		<TABLE width="80%" border="0" cellspacing="1" cellpadding="0">
        <TBODY >
        <%
	        String aigTableName=rfcInfo.getRfcTable().getAigtablename();
	        //找出数据字典时面对就字段
	        HashMap<String,String> paramap= cn.longhaul.common.html.HttpProcess.requestLonghaulToUTF8HashMap(aigTableName,request);  //得到参数MAP  
		    String para =(String)paramap.get("longhaulpara")+paramap.get("paramsc")  ;  //得到longhaul 参数
		    //System.out.println(para+"得到参数");
	        ArrayList inputparainfo =rfcinfo.getInputfiledinfo();
	        if (inputparainfo!=null&&inputparainfo.size() > 0) {   // 如果设置了参数
	        int rowsiz=3;
	        int sortsize = inputparainfo.size();
	        int sizetr  = (int)Math.ceil( sortsize/Float.parseFloat(Integer.toString(rowsiz))) ;
	        %>
	       <%for(int tr = 0;tr<sizetr;tr++){ %>
	       <TR> 
	       <%
	        int nowsize= (rowsiz * (tr+1));
	       	    for(int i=tr*rowsiz;i<nowsize&&i<inputparainfo.size();i++){
	    		RFCFieldInfo  rfcfieldinfo= (RFCFieldInfo)inputparainfo.get(i);
	    		String fieldname=rfcfieldinfo.getFieldName();
	    		String filevalue=rfcfieldinfo.getFieldNameValue();
	    		String showField="only:"+fieldname;
	    		String showStr = ViewStringProcess.paraStr(aigTableName,para,paramap,showField,"");
	       %>
	    <TD class="bodytd1"><%=rfcfieldinfo.getMapfiledDescription()%></TD>
	    <TD class="bodytd2">
	    <%if(!showStr.equals("")){%>
	        <%=showStr%>
	    <%}else{%>
	        <INPUT class="textdocdown" name="<%=rfcfieldinfo.getFieldName()%>" value="<%=rfcfieldinfo.getFieldNameValue()%>" style="width:100px"></TD>
	    <%}}
	     %>
         </TR>
        <%} } %>
       <TR>
	    <TD colspan="6" align="right"><input type='button' class='btndoc' onClick='useroption("searchdatado","")' value='查 询'>&nbsp;
	           交<input type='checkbox' name="userchoseoption" class='btndoc' <%=userchoseoption%>>
	    <input type="hidden"  id="p1" name="paramsc"  value="<%=para%>"> 
	    <input type='button' class='btndoc' onClick='useroption("searchdataFilter","")' value='过 滤'>&nbsp;
	    <input type='button' class='btndoc' onClick='useroption("searchdataFilter","export")' value='导 出'>
		    </TD>
		    </TR>
	</TBODY></TABLE>
	</fieldset>
	</td>
    </tr>
   <%
   ArrayList<?> rfctablelist=rfcinfolist.getRfcTableList();
   for(int j=0;j<rfctablelist.size();j++){
   RfcTable rfclistTable =(RfcTable)rfctablelist.get(j);  //得到每个table 
   ArrayList<?> rfctabledata = rfclistTable.getTable();
	 String datarfctablename =rfclistTable.getTablename();
	 ArrayList<?> rfctableinfo =  null;
	 ArrayList<?> readrfctablelist=rfcInfo.getRfcTableList();
	 for(int readj=0;readj<readrfctablelist.size();readj++){
	     RfcTable readrfclistTable =(RfcTable)readrfctablelist.get(readj);
	     String readrfctablename  = readrfclistTable.getTablename();
	     if(readrfctablename.equals(datarfctablename)){
	           rfctableinfo = readrfclistTable.getRfcTableInfo();
	           break;
	      }  
		}
   %>
  <TR>
    <TD align=right >
    <TABLE class=tbview borderColor=#ffffff height=30 cellSpacing=0 cellPadding=0 width="80%" align=center bgColor=#ffffff border=1>
    <TBODY>
    <TR class="FixedTitleRow">
     <%
		if(rfctable!=null){
		//ArrayList<?> rfctableinfo = rfctable.getRfctableinfo();
		for(int i=0;i<rfctableinfo.size();i++){
		RFCFieldInfo  rfcfieldinfo= (RFCFieldInfo)rfctableinfo.get(i);
     %>
     <TD class=TrviewFirst  height=10>
      <DIV style="width:100px;height:20px;overflow:hidden"><%=rfcfieldinfo.getMapfiledDescription()%></DIV></TD>
    <% }}
    %>
    </TR>
  
    <TR  class="FixedTitleRow">
     <%
		if(rfctable!=null){
		//ArrayList<?> rfctableinfo = rfctable.getRfctableinfo();
		for(int i=0;i<rfctableinfo.size();i++){
		RFCFieldInfo  rfcfieldinfo= (RFCFieldInfo)rfctableinfo.get(i);
		String fieldnamefiltervalue=rfcfieldinfo.getFieldNameFilterValue();
		fieldnamefiltervalue=new String(fieldnamefiltervalue.getBytes("ISO-8859-1"), "GB2312");
     %>
     <TD class=TrviewFirst  height=10>
      <DIV style="width:100px;height:20px;overflow:hidden"> 
      <input name="<%=rfcfieldinfo.getFieldName()%>filter" id="<%=rfcfieldinfo.getFieldName()%>filter" value="<%=fieldnamefiltervalue%>" >  </DIV></TD>
    <% }}
     %>
    </TR>
   <%
	 for(int i =0;i<rfctabledata.size();i++){
	       String style=i%2==0?"TrinviewOther2":"TrinviewOther1";
	 	   out.println("<tr class="+style+">");
	 	   	HashMap<?, ?> hd = (HashMap<?, ?>) rfctabledata.get(i);
			for(int k=0;k<rfctableinfo.size();k++){
		    RFCFieldInfo  rfcfieldinfo= (RFCFieldInfo)rfctableinfo.get(k);
		       //System.out.println(hd.get(rfcfieldinfo.getFieldName()));
		       String value = hd.get(rfcfieldinfo.getFieldName())==null?"":hd.get(rfcfieldinfo.getFieldName()).toString();  //对就字段对应的值
	           out.println("<td>");
			%>  
			 <%=value%>  
			<%
			out.println("</td>");
	    }
		  out.println("</tr>");
	   }
	     
	  
	 %>
  </TABLE>
   <%} %>
   </table>
   </div>
   </form>
  </body>
</html>
