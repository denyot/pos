/**
 * 首页公告栏
 * @author Xiashou
 * @since 2014/04/21
 */
Ext.onReady(function() {
	
	var notice = "";
	
	Ext.Ajax.request({
		url : 'indexSystem.ered?reqCode=getNotice',
		async  : false, 		//设置为同步执行，非异步
		success : function(data) {
			var returnData = Ext.decode(data.responseText);
			notice = returnData.notice;
		},
		failure : function(data) {
			var returnData = Ext.decode(data.responseText);
			notice = "<div style=height:60px;line-height:25px class=commoncss>&nbsp;&nbsp;提取公告信息出现错误！</div>";
		}
	});

	var panel = new Ext.form.FormPanel({
		layout : 'fit',
		frame : true,
		items : [{
			id : 'notice',
			name : 'notice',
			xtype : 'htmleditor',
			value : notice,
			plugins : [new Ext.ux.form.HtmlEditor.Link(),
			           new Ext.ux.form.HtmlEditor.Image(),
			           new Ext.ux.form.HtmlEditor.Emote(),
			           new Ext.ux.form.HtmlEditor.Table(),
			           new Ext.ux.form.HtmlEditor.HR(),
			           new Ext.ux.form.HtmlEditor.Word(),
			           new Ext.ux.form.HtmlEditor.RemoveFormat()
			]
		}]
	});
	
	var firstWindow = new Ext.Window({
		title : '<span class="commoncss">公告栏</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 700, // 窗口宽度
		height : 450, // 窗口高度
		closable : false, // 是否可关闭
		collapsible : false, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		constrain : true, // 设置窗口是否可以溢出父容器
		draggable : true,	//设置是否可拖动
		animateTarget : Ext.getBody(),
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 2 - 700 / 2, // 页面定位X坐标
		items : [panel], // 嵌入的表单面板
		buttons : [{ // 窗口底部按钮配置
			text : '保存', // 按钮文本
			iconCls : 'acceptIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				var value = Ext.getCmp('notice').getValue();
				Ext.Msg.wait('正在提交，请稍候...','提示'); 
				Ext.Ajax.request({
					url : 'indexSystem.ered?reqCode=saveNotice',
					params : {
						value : value
					},
					success : function(data) {
						Ext.Msg.hide();
						var returnData = Ext.decode(data.responseText);
						Ext.Msg.alert("提示", returnData.message, function(e) {
						});
					},
					failure : function(data) {
						Ext.Msg.hide();
						var returnData = Ext.decode(data.responseText);
						Ext.Msg.alert("提示", returnData.message, function(e) {
						});
					}
				});
			}
		}, {	// 窗口底部按钮配置
			text : '重置', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				panel.form.reset();
			}
		}]
	});
	
	firstWindow.show(); // 显示窗口

	Ext.getCmp('notice').on('initialize', function() {
		Ext.getCmp('notice').focus();
	})
			
			
});