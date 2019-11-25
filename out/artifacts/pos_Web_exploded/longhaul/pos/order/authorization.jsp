<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
<title>权限访问</title>
 <style type="text/css">
 <!--
 .t {
         font-family: Verdana, Arial, Helvetica, sans-serif;
         color: #CC0000;
 }
 .c {
         font-family: Verdana, Arial, Helvetica, sans-serif;
         font-size: 14px;
         font-weight: normal;
         color: #000000;
         line-height: 18px;
         text-align: center;
         border: 1px solid #CCCCCC;
         background-color: #FFFFEC;
 }
 body {
         background-color: #FFFFFF;
         margin-top: 100px;
 }
 -->
 </style>
 </head>
 <body>
 <div align="center">
   <h2><span class="t">用户权限问题</span></h2>
   <table border="0" cellpadding="8" cellspacing="0" width="460">
     <tbody>
       <tr>
         <td class="c">你没有权限访问此网页,或者用户超时,请重新登录,重试!</td>
       </tr>
     </tbody>
   </table>
 </div>
 </body>
 </html>
 
