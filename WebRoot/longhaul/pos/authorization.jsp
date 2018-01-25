<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

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
         <td class="c">你没有权限访问此网页,或者用户超时,请重新登录,重试!<a href="login.htm" >回登录页</a></td>
       </tr>
     </tbody>
   </table>
 </div>
 </body>
 </html>
 
