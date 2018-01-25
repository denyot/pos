<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String outid = request.getParameter("outid");
String opmode = request.getParameter("opmode");
String posurl =(String)request.getAttribute("posurl");
posurl= posurl==null||posurl.equals("")?"localhost:8080":posurl;
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<META HTTP-EQUIV="pragma" CONTENT="no-cache"> 
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate"> 
<META HTTP-EQUIV="expires" CONTENT="0">
<html>
<head>
   <base href="<%=basePath%>">
    <script>
    	var outid = "<%=outid%>";
    	var opmode = "<%=opmode%>";
   	 	var posurl="<%=posurl%>";
   		var chargimgpath="http://<%=posurl%>/sappic/";
    </script>
    <!-- base library -->
    
    <link rel="stylesheet" type="text/css" href="resource/ext-3.4.0/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="resource/ext-3.4.0/ux/css/ux-all.css" />
    <link rel="stylesheet" type="text/css" href="resource/myux/gridsummary/css/Ext.ux.grid.GridSummary.css">
    <style type=text/css>
        /* style rows on mouseover */
        .x-grid3-row-over .x-grid3-cell-inner {
            font-weight: bold;
        }

        /* style for the "buy" ActionColumn icon */
        .x-action-col-cell img.buy-col {
            height: 16px;
            width: 16px;
            background-image: url(resource/ext-3.4.0/resources/images/access/shared/accept.png);
        }

        /* style for the "alert" ActionColumn icon */
        .x-action-col-cell img.alert-col {
            height: 16px;
            width: 16px;
            background-image: url(resource/ext-3.4.0/resources/images/access/shared/error.png);
        }
        
        .x-selectable, .x-selectable * {         
        -moz-user-select: text! important ;         
        -khtml-user-select: text! important ;         
    }     

    </style>

    <script type="text/javascript" src="resource/ext-3.4.0/adapter/ext/ext-base.js"></script>
   <script type="text/javascript" src="resource/ext-3.4.0/ext-all.js"></script>
    <script type="text/javascript" src="resource/ext-3.4.0/ux/ux-all.js"></script>
<script type="text/javascript" src="resource/myux/gridsummary/Ext.ux.grid.GridSummary.js"></script>
    <script type="text/javascript" src="longhaul/pos/stock/js/rejectToHeadquarters2.js?a=1"></script>

</head>
<body>
    
    <div id = "panel-basic">
    	
    </div>
    <div id="grid-example"></div>
</body>
</html>

<script>
	if  (!Ext.grid.GridView.prototype.templates) {         
    Ext.grid.GridView.prototype.templates = {};         
}         
Ext.grid.GridView.prototype.templates.cell =  new  Ext.Template(         
     '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>' ,         
     '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>' ,         
     '</td>'         
);   
</script>
