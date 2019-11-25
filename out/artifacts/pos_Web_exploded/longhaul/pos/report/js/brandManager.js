var modifyflag = false;
var modifyId = '';
Ext.onReady(function() {
			// 复选框
			var sm = new Ext.grid.CheckboxSelectionModel();

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
						header : 'NO',
						width : 28
					});
			// 定义列模型
			var cm = new Ext.grid.ColumnModel([rownum, sm,  {
						header : 'ID', // 列标题
						dataIndex : 'id', // 数据索引:和Store模型对应
						sortable : true,
						hidden : true
						
						// 是否可排序
				   },{
					    header : '品牌代码', // 列标题
						dataIndex : 'id', // 数据索引:和Store模型对应
						width:100,
						sortable : true
					
				   },{
				   		
					    header : '品牌名称', // 列标题
						dataIndex : 'brand', // 数据索引:和Store模型对应
						width:100
				   } 
			       ]);
			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy({
									url : 'reportSystem.ered?reqCode=getBrandList'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'id' // Json中的属性Key值
									},{
										    name : 'id'
									},{
										    name : 'brand'
									}
									])
					});
			

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
						this.baseParams = {
								//queryParam : Ext.getCmp('queryParam').getValue()
						};
					});
			// 每页显示条数下拉选择框
			var pagesize_combo = new Ext.form.ComboBox({
						name : 'pagesize',
						triggerAction : 'all',
						mode : 'local',
						store : new Ext.data.ArrayStore({
									fields : ['value', 'text'],
									data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'], [100, '100条/页'], [250, '250条/页'], [500, '500条/页']]
								}),
						valueField : 'value',
						displayField : 'text',
						value : '100',
						editable : false,
						width : 85
					});
			var number = parseInt(pagesize_combo.getValue());
			// 改变每页显示条数reload数据
			pagesize_combo.on("select", function(comboBox) {
				bbar.pageSize = parseInt(comboBox.getValue());
				number = parseInt(comboBox.getValue());
				store.reload({
							params : {
								start : 0,
								limit : bbar.pageSize
							}
						});
			});

			// 分页工具栏
			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			});
			
			// 表格工具栏
			var tbar = new Ext.Toolbar({
				items : [{
							text : '新增',
							iconCls : 'page_addIcon',
							handler : function() {
								modifyflag = false;
								firstForm.form.reset();
								firstForm.findById('id').enable();
								firstWindow.show();
							}
						},{
							text : '修改',
							iconCls : 'page_edit_1Icon',
							handler : function() {
								var record = grid.getSelectionModel().getSelected();
								if (Ext.isEmpty(record)) {
									Ext.Msg.alert('提示', '请先选中修改项');
									return;
								}
								record = grid.getSelectionModel().getSelected();
								modifyId = record.get('id');
								firstForm.getForm().loadRecord(record);										
								modifyflag = true;
								firstForm.findById('id').disable();
								firstWindow.show();
							}
						},{
							text : '删除',
							iconCls : 'page_delIcon',
							handler : function() {
								delPara();
							}
						}
						, {
							text : '刷新',
							iconCls : 'page_refreshIcon',
							handler : function() {
								store.reload();
							}
						}]
			});

	

			// 表格实例
			var grid = new Ext.grid.GridPanel({
						// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
//						title : '<span class="commoncss">服务器管理</span>',
						height : 800,
						frame : true,
						autoScroll : true,
						region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
						store : store, // 数据存储
						stripeRows : true, // 斑马线
						cm : cm, // 列模型
						sm : sm, // 复选框
						tbar : tbar, // 表格工具栏
						bbar : bbar,// 分页工具栏
						viewConfig : {
						// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
						// forceFit : true
						},
						listeners : {
							specialkey : function(field, e) {
								if (e.getKey() == Ext.EventObject.ENTER) {
									//queryCatalogItem();
								}
							}
						}
                       ,
						loadMask : {
							msg : '正在加载表格数据,请稍等...'
						}
						
					});
		
			// 是否默认选中第一行数据
			bbar.on("change", function() {
						// grid.getSelectionModel().selectFirstRow();

					});

			// 页面初始自动查询数据
			 store.load({params : {start : 0,limit : bbar.pageSize}});
            
       //     	grid.on('rowdblclick', function(pGrid, rowIndex, event) {
		//	
		//				ininEditCodeWindow();
		//			});


			// 布局模型
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
			});
			
		// 查询表格数据
	function queryFiles() {
		store.load({
			params : {
				start : 0,
				limit : bbar.pageSize,
				title : Ext.getCmp('queryParam').getValue()
			}
		});
	}
			
	var firstForm = new Ext.form.FormPanel({
		id : 'firstForm',
		name : 'firstForm',
		fileUpload : true, // 一定要设置这个属性,否则获取不到上传对象的
		labelWidth : 70,
		defaultType : 'textfield',
		labelAlign : 'right',
		bodyStyle : 'padding:5 5 5 5',
	
		items : [ 
			{
			fieldLabel : '品牌代码',
			id : 'id',
			name : 'id',
		//	fieldClass : 'x-custom-field-disabled',
			anchor : '100%',
			allowBlank : false
		},{
			fieldLabel : '品牌名称',
			id : 'brand',
			name : 'brand',
//			xtype : 'textarea',
//			growMax : 130,
//			grow:true,			
		//	fieldClass : 'x-custom-field-disabled',
			anchor : '100%',
			allowBlank : false
		}]
	});
	   
	   
	    
	var firstWindow = new Ext.Window({
		title : '<span class="commoncss">增加品牌</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 360, // 窗口宽度
		height : 150, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		closeAction : 'hide',
		animCollapse : true,
		animateTarget : Ext.getBody(),
		border : false, // 边框线设置
		constrain : true, // 设置窗口是否可以溢出父容器
		// pageY : 20, // 页面定位X坐标
		pageX : document.body.clientWidth / 2 - 500 / 2, // 页面定位Y坐标
		items : [ firstForm ], // 嵌入的表单面板
		buttons : [ { // 窗口底部按钮配置
			text : '保存', // 按钮文本
			iconCls : 'acceptIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				if(modifyflag){
					var url = "reportSystem.ered?reqCode=updateBrand";
				} else {
					var url = "reportSystem.ered?reqCode=saveBrand";
				}
				Ext.Msg.wait('正在提交，请稍候...','提示'); 
				Ext.Ajax.request({
					url : url,
					type : 'post',
					dataType : 'json',
					cache : false,
					params : {
					  id : Ext.getCmp("id").getValue(),
					  brand : Ext.getCmp("brand").getValue()
					},
					success : function(data) {
						Ext.Msg.hide();
						var returnData = Ext.decode(data.responseText);
						Ext.Msg.alert("提示", returnData.message, function(e) {
							firstForm.form.reset();
							store.reload();
					     	firstWindow.hide();
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
		}, { // 窗口底部按钮配置
			text : '重置', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				firstForm.form.reset();
			}
		} ]
	});
			
	/**
	 * 删除参数
	 */
	function delPara() {
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除行!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'id');
		Ext.Msg.confirm('请确认', '你真的要删除选中的数据吗?', function(btn, text) {
			if (btn == 'yes') {
				Ext.Msg.wait('正在提交，请稍候...','提示'); 
				Ext.Ajax.request({
					url : 'reportSystem.ered?reqCode=deleteBrand',
					params : {
						strChecked : strChecked
					},
					success : function(data) {
						Ext.Msg.hide();
						var returnData = Ext.decode(data.responseText);
						Ext.Msg.alert("提示", returnData.message, function(e) {
							firstForm.form.reset();
							store.reload();
					     	firstWindow.hide();
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
	}
	

	
	store.load({params : {start : 0,limit : bbar.pageSize}});

})