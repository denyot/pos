<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String emailStr = (String) request.getAttribute("emailAddress");//getAttribute("emailAddress");
%>
<html>
	<head>
		<meta charset="utf-8">
		<base href="<%=basePath%>">
		<title></title>
		<style>
body {
	font-size: 12px;
}
</style>
		<script src="resource/jquery/jquery-1.7.2.js"></script>
		<script type="text/javascript" charset="utf-8">
		 var emailStr = '<%=emailStr%>' ;
		 var html = "";
		 var count = 0;
		 var inputValue = [];
		 var result = [];
		 var deleteButton = function(index){
		 	count --;
		 	if(removeArrayItem(inputValue,inputValue[index])){
		 		var htmlTemp = "";
				for(var i=0;i<inputValue.length;i++){
					htmlTemp+='<span><b>邮箱'+(i+1)+': </b></span>';
					htmlTemp+='<input id="input'+i+'" value='+inputValue[i]+'>';
					htmlTemp+='<span id="span'+i+'" style="display:none;color:red">请输入正确的邮箱地址</span>';
					htmlTemp+='&nbsp;&nbsp;<input type="button" onclick="submitButton('+i+');" value="修改">';
					htmlTemp+='&nbsp;&nbsp;<input type="button" onclick="deleteButton('+i+');" value="删除"><br/><br/>';
				}		 		
				html = htmlTemp;		
				document.getElementById('panel').innerHTML = html;				 	
		 	}
		 }
		 var addButton = function(){
		 	html+='<span><b>邮箱'+(count+1)+': </b></span>';
		 	html+='<input id="input'+count+'" type="text">';
			html+='<span id="span'+count+'" style="display:none;color:red">请输入正确的邮箱地址</span>';
			html+='&nbsp;&nbsp;<input type="button" onclick="submitButton('+count+');" value="修改">';
			html+='&nbsp;&nbsp;<input type="button" onclick="deleteButton('+count+');" value="删除"><br/><br/>';
		 	document.getElementById('panel').innerHTML = html;
		 	inputValue[count++] = "";
		 }
		 var submitButton = function(index){
		 	var email = document.getElementById('input'+index).value;
		 	email = email.trim();
		 	if(verifyAddress(email,index)){
		 		inputValue[index] = email;
		 		var htmlTemp = "";
				for(var i=0;i<inputValue.length;i++){
					htmlTemp+='<span><b>邮箱'+(i+1)+': </b></span>';
					htmlTemp+='<input id="input'+i+'" value='+inputValue[i]+'>';
					htmlTemp+='<span id="span'+i+'" style="display:none;color:red">请输入正确的邮箱地址</span>';
					htmlTemp+='&nbsp;&nbsp;<input type="button" onclick="submitButton('+i+');" value="修改">';
					htmlTemp+='&nbsp;&nbsp;<input type="button" onclick="deleteButton('+i+');" value="删除"><br/><br/>';
				}		 		
				html = htmlTemp;
		 	}
		 }
		 var init = function(){
			if(emailStr){
				emails = emailStr.split(";");
				for(var i=0;i<emails.length;i++){
					html+='<span><b>邮箱'+(i+1)+': </b></span>';
					html+='<input id="input'+i+'" value='+emails[i]+'>';
					html+='<span id="span'+i+'" style="display:none;color:red">请输入正确的邮箱地址</span>';
					html+='&nbsp;&nbsp;<input type="button" onclick="submitButton('+i+');" value="修改">';
					html+='&nbsp;&nbsp;<input type="button" onclick="deleteButton('+i+');" value="删除"><br/><br/>';
					inputValue.push(emails[i]);
				}
				count = emails.length;
				document.getElementById('panel').innerHTML = html;
			}
		}
	   function submit2(){
	   		removeArrayItem(inputValue,"test");
			var url = 'longhaul/jobMange.ered?reqCode=processEmail';
			$.ajax({url: url, 
					type: 'POST', 
					data:{
						'address':result.join(";"),
						'loginuserid':"10000001"
					}, 
					dataType: 'html', 
					timeout: 1000, 
					error: function(){alert("保存失败");}, 
					success: function(result){if(result == 'yes'){
						location.reload();
						alert("保存成功");
					}else{
						alert("保存失败");
					}} 
			});	

	   }
	   function submit(){
		    result = [];
	   		var htmlTemp = '<span ><b>请确认邮箱信息是否正确</b></span><br/><br/>';
			for(var i=0;i<inputValue.length;i++){
				if(inputValue[i]){
					htmlTemp+= '<span style="border-bottom:1px solid gray;"><span ><b>邮箱'+(i+1)+':</b></span><span>'+inputValue[i]+'</span></span><br/><br/>';
					result.push(inputValue[i]);
				}
			}	
			htmlTemp+='<input type="button" onclick="submit2();" value="提交">';	   		
			document.getElementById('content').innerHTML = htmlTemp;
	   }
		
　　　　 function verifyAddress(email,index)  
　　　　　{  
　　　　　　var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;  
　　　　　　var flag = pattern.test(email);  
　　　　　　if(flag)  
　　　　　　{  
　		    document.getElementById('span'+index).style.display = 'none';
　　　　　　　return true;  
　　　　　　}  
　　　　　　else  
　　　　　　　{  
　　　　　　　　document.getElementById('span'+index).style.display = '';
　　　　　　　　return false;  
　　　　　　　 }  
　　　　　 }  
		String.prototype.trim = function()
		{
		    return this.replace(/(^\s*)|(\s*$)/g, '');
		};	
		var removeArrayItem = function(arr,item){
			if(arr instanceof Array) {
				for(var i=0;i<arr.length;i++)
					if(arr[i]==item) {
						arr.splice(i,1);
						return true;
					}	
			}
			return false;
		};			
	</script>
	</head>
	<body onload="init();">
		<div style="padding: 20px; border: 1px solid #ad3;">
			<div id="panel">
			</div>
			<div>
				<input type="button" onclick="addButton();" value="增加">
				<input type="button" onclick="submit();" value="确定">
			</div>
		</div>

		<div id="content" style="width: 300px; padding: 30px;">
		</div>
	</body>
</html>
