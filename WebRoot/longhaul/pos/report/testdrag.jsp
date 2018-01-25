<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	//String WERKS = (String)request.getAttribute("WERKS"); WERKS=WERKS==null||WERKS.equals("")?"01DL":WERKS;
	//String opterator = (String)request.getAttribute("userid");   opterator=opterator==null||opterator.equals("")?"CHJ":opterator;
	//opterator = opterator.toUpperCase();
	//String salesorderid = (String)request.getAttribute("salesorderid");   salesorderid=salesorderid==null||salesorderid.equals("")?"":salesorderid;
	//String opmode = (String)request.getAttribute("opmode");   opmode=opmode==null||opmode.equals("")?"ADD":opmode;
	//String ordertype = (String)request.getAttribute("ordertype"); ordertype=ordertype==null||ordertype.equals("")?"":ordertype;
	//String autocompletesecond = (String)request.getAttribute("autocompletesecond");
	//String autocompletewords =  (String)request.getAttribute("autocompletewords");
	//autocompletesecond = autocompletesecond==null||autocompletesecond.equals("")?"4000":autocompletesecond;
	//autocompletewords = autocompletewords==null||autocompletewords.equals("")?"4":autocompletewords;
	//String posurl =(String)request.getAttribute("posurl");
	//posurl= posurl==null||posurl.equals("")?"localhost:8080":posurl;
%>
<html>
	<head>
		<meta charset="utf-8">
			<base href="<%=basePath%>">
				<title>订单系统</title> 
				
				<script src="resource/jquery/jquery-1.7.2.js"></script>
				<script src="resource/jquery/ui/jquery-ui-1.8.18.custom.js"></script>
				<link rel="stylesheet" href="resource/jquery/ui/css/ui-lightness/jquery-ui-1.8.24.custom.css" />
				
							<style>
.ui-autocomplete-loading {
	background: white
		url('resource/jquery/ui/images/ui-anim_basic_16x16.gif') right center
		no-repeat;
}
.demo {
	width: 500px;
}
</style>
							<script type="text/javascript">
	var doubleIntervalValidate = false;
	$(document).ready(function() {
		$("#orderstarttime").datepicker({
			changeMonth : true,
			changeYear : true
		});
		$("#orderendtime").datepicker({
			changeMonth : true,
			changeYear : true
		});
		$("#charg").attr("disabled", true);
		$("#kunnr").focus();
		
		
		$( "#accordion" ).accordion({
			autoHeight: false,
			navigation: true,
			collapsible: true
		}).resizable();
		$( "#drag" ).draggable().resizable().css("width","700px").css("height","100px");
	});
</script>
	 <body>

<div class="demo">

<div id="accordion">
	<h3><a href="#">Section 1</a></h3>
	<div>
		<p>
		Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer
		ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit
		amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut
		odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.
		</p>
	</div>
	<h3><a href="#">Section 2</a></h3>
	<div>
		<p>
		Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet
		purus. Vivamus hendrerit, dolor at aliquet laoreet, mauris turpis porttitor
		velit, faucibus interdum tellus libero ac justo. Vivamus non quam. In
		suscipit faucibus urna.
		</p>
	</div>
	<h3><a href="#">Section 3</a></h3>
	<div>
		<p>
		Nam enim risus, molestie et, porta ac, aliquam ac, risus. Quisque lobortis.
		Phasellus pellentesque purus in massa. Aenean in pede. Phasellus ac libero
		ac tellus pellentesque semper. Sed ac felis. Sed commodo, magna quis
		lacinia ornare, quam ante aliquam nisi, eu iaculis leo purus venenatis dui.
		</p>
		<ul>
			<li>List item one</li>
			<li>List item two</li>
			<li>List item three</li>
		</ul>
	</div>
	<h3><a href="#">Section 4</a></h3>
	<div>
		<p>
		Cras dictum. Pellentesque habitant morbi tristique senectus et netus
		et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in
		faucibus orci luctus et ultrices posuere cubilia Curae; Aenean lacinia
		mauris vel est.
		</p>
		<p>
		Suspendisse eu nisl. Nullam ut libero. Integer dignissim consequat lectus.
		Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
		inceptos himenaeos.
		</p>
	</div>
</div>

</div><!-- End demo -->

<div class="demo-description" id="drag">
<p>
Click headers to expand/collapse content that is broken into logical sections, much like tabs.
Optionally, toggle sections open/closed on mouseover.
</p>
<p>
The underlying HTML markup is a series of headers (H3 tags) and content divs so the content is
usable without JavaScript.
</p>
</div><!-- End demo-description -->
	 
	 
  </body>
</html>
