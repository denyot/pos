<%@ page language="java" import="java.util.*" pageEncoding="GBK"%>
<html>
  <head>
    <title>RFC调用</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script src="../js/common.js"></script>
	<script src="../js/longhaul.js"></script>
	<LINK href="../css/main.css" type=text/css rel=stylesheet>
	<LINK href="../css/doc.css" type=text/css rel=stylesheet>
	<script>
	function check()
	{
		if(checkField("rfc_id^RFC名称")){
		   var rfc_id =document.getElementById("rfc_id").value;
		   //window.open('/sapweb/saprfcconfiger.do?reqCode=rfcsearch&rfc_id='+rfc_id,'rfcsearch','height=1024, width=900,toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=yes');
		   	document.forms[0].submit();
		}
		
		 
	}
	</script>

  </head>
  <body>
    <form action="/sapweb/saprfcconfiger.do">
        <input type="hidden" name="reqCode" value="rfcsearch">
        RFC名称:<input name="rfc_id" id="rfc_id" >
        <input type='button' class='btndoc' onClick='check()' value='查询'>
    </form>
  </body>
</html>
