/**
 * 欢迎页面
 * 
 */
//Ext.onReady(function() {
//	new Ext.ux.TipWindow({
//		title : '<span class=commoncss>提示</span>',
//		html : '您有[0]条未读信息.',
//		iconCls : 'commentsIcon'
//	}).show(Ext.getBody());
//});

Ext.onReady(function() {
	
	var notice = "<div style=height:60px;line-height:25px class=commoncss>&nbsp;&nbsp;暂无信息</div>";
	var transIn = 0;
	var transOut = 0;
	var receiveIn = 0;
	var lableCount = 0;
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	
	Ext.Ajax.request({
		url : 'longhaul/pos/index/indexSystem.ered?reqCode=getNotice',
		async : false, 		//设置为同步执行，非异步
		success : function(data) {
			var returnData = Ext.decode(data.responseText);
			notice = returnData.notice;
		},
		failure : function(data) {
			var returnData = Ext.decode(data.responseText);
			notice = "<div style=height:60px;line-height:25px class=commoncss>&nbsp;&nbsp;提取公告信息出现错误！</div>";
		}
	});
	
	Ext.Ajax.request({
		url : 'longhaul/pos/index/indexSystem.ered?reqCode=getProcessed',
		async : false, 		//设置为同步执行，非异步
		success : function(data) {
			var returnData = Ext.decode(data.responseText);
			transIn = returnData.transInCount;
			transOut = returnData.transOutCount;
			receiveIn = returnData.receiveInCount;
			lableCount = returnData.lableCount;
		},
		failure : function(data) {
			var returnData = Ext.decode(data.responseText);
			Ext.Msg.alert("提示", "获取信息错误！", function(e) {
			});
		}
	});

	var tools = [{
		id : 'maximize',
			handler : function(e, target, panel) {
		}
	}];

	var my_height1 = document.body.clientHeight - 195;
	var my_height = document.body.clientHeight - 35;
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			xtype : 'portal',
			region : 'center',
			margins : '3 3 3 3',
			items : [{
						columnWidth : .6,
						style : 'padding:8px 0px 8px 8px',
						items : [{
									title : '公告栏',
									layout : 'fit',
									height : document.body.clientHeight - 35,
//									bodyStyle: 'background: url(resource/image/banner1.jpg) no-repeat',
									html : notice
								}]
					}, {
						columnWidth : .4,
						style : 'padding:8px 8px 8px 8px',
						items : [{
							title : '常用链接',
							height: 220,
							// tools : tools,
							html : '<br><div style=height:60px;line-height:25px class=commoncss>' +
								   '&nbsp;&nbsp;兆亮官方网站：<a href="http://www.zljewelry.com" target="_blank">http://www.zljewelry.com</a><br>' +
								   '&nbsp;&nbsp;兆亮POS系统：<a href="http://www.yszbpos.com:10080" target="_blank">http://www.yszbpos.com:10080</a><br>' + 
								   '&nbsp;&nbsp;OA网上办公2：<a href="http://www.yaos.cn:8088" target="_blank">http://www.yaos.cn:8088</a><br>' + 
								   '&nbsp;&nbsp;兆亮网上商城：紧张筹备中...  敬请期待! <br></div>'
						},{
							title : '状态栏',
							height: document.body.clientHeight - 265,
							// tools : tools,
							html : '<br><div style=height:60px;line-height:25px class=commoncss>' + 
								   '&nbsp;&nbsp;已审核待发货订单：<font color="red">' + transOut + '</font> <br>' +
								   '&nbsp;&nbsp;收货验收待收货订单：<font color="red">' + receiveIn + '</font> <br>' + 
								   '&nbsp;&nbsp;调入验收待收货订单：<font color="red">' + transIn + '</font> <br>'+
								   '&nbsp;&nbsp;调价标签待验收: <font color="red">' + lableCount + '</font> <br>'+
								   '&nbsp;&nbsp;亲，记得按时验收哦!<br></div>'
						}]
					}]
		}]
	});
});
