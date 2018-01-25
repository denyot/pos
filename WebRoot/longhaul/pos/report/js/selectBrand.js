/**
 * 门店选择品牌
 * @author Xiashou
 * @since 2013-10-15
 */
Ext.onReady(function() {	
	
	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getHavingStockTakingList'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
		}, [ {
			name : 'charg'
		}, {
			name : 'matnr'
		}, {
			name : 'maktx'
		}, {
			name : 'count'
		}, {
			name : 'hpzl'
		}, {
			name : 'meins'
		}, {
			name : 'kbetr'
		}, {
			name : 'lgort'
		} ])
	});
	
	var firstForm = new Ext.form.FormPanel({
		id : 'firstForm',
		name : 'firstForm',
		labelWidth : 40, // 标签宽度
		// frame : true, //是否渲染表单面板背景色
		defaultType : 'textfield', // 表单元素默认类型
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
		items :[new Ext.form.Checkbox({
				name : 'swim',
				fieldLabel : '爱好',
				boxLabel : '游泳'
			}), new Ext.form.Checkbox({
				name : 'walk',
				boxLabel : '散步'
			}), new Ext.form.Checkbox({
				name : 'basketball',
				checked : true,
				boxLabel : '打篮球'
			})]
	});

	var firstWindow = new Ext.Window({
		title : '<span class="commoncss">选择品牌</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 100%, // 窗口宽度
		height : 100%, // 窗口高度
		closable : false, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 2 - 200 / 2, // 页面定位X坐标
		items : [firstForm], // 嵌入的表单面板
		buttons : [{ // 窗口底部按钮配置
			text : '重置', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				firstForm.form.reset();
			}
		}]
	});
	firstWindow.show(); // 显示窗口

	// 保存
	function submitRows() {
		var m = store.modified.slice(0); // 获取修改过的record数组对象
		if (Ext.isEmpty(m)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
//		if (!validateEditGrid(m, 'xmmc')) {
//			Ext.Msg.alert('提示', '项目名称字段数据校验不合法,请重新输入!', function() {
//						grid.startEditing(0, 2);
//					});
//			return;
//		}
		var jsonArray = [];
		// 将record数组对象转换为简单Json数组对象
		Ext.each(m, function(item) {
			if(!Ext.isEmpty(item.data["charg"])){
				jsonArray.push(item.data);
			}
		});
		if (Ext.isEmpty(jsonArray)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		// 提交到后台处理
		Ext.Msg.wait('正在创建订单，请稍候...','提示'); 
		Ext.Ajax.request({
			url : '../order/orderSystem.ered?reqCode=saveJoinnerReturnGoods',
			type : 'post',
			dataType : 'json',
			cache : false,
			params : {
				jsonArray : Ext.encode(jsonArray)		// 系列化为Json资料格式传入后台处理
			},
			success : function(data) { 
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
					if(returnData.saporderid != null && returnData.saporderid != ""){
						store.reload();
					}
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
	
});