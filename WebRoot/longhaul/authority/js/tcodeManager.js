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
						header : '事务码ID', // 列标题
						dataIndex : 'tcode_id', // 数据索引:和Store模型对应
						sortable : true
						// 是否可排序
				   },{
					    header : '事务码名', // 列标题
						dataIndex : 'tcode_name', // 数据索引:和Store模型对应
						sortable : true
				   } ,{
					    header : 'ITS模板', // 列标题
						dataIndex : 'its_url', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '创建人', // 列标题
						dataIndex : 'option_userid', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '创建日期', // 列标题
						dataIndex : 'option_date', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '是否锁定', // 列标题
						dataIndex : 'locked', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   }
			       ]);
			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy({
									url : './authority.ered?reqCode=tcodeList'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'tcode_id' // Json中的属性Key值
									},{
										    name : 'tcode_name'
									},{
										    name : 'its_url'
									},{
										    name : 'option_userid'
									},{
										    name : 'option_date'
									},{
										    name : 'locked'
									}
									])
					});
			

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
						this.baseParams = {
								queryParam : Ext.getCmp('queryParam').getValue()
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
						value : '20',
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
									xtype : 'textfield',
									id : 'queryParam',
									name : 'queryParam',
									emptyText : '请输入项目名称',
									width : 150,
									enableKeyEvents : true,
									// 响应回车键
									listeners : {
										specialkey : function(field, e) {
											if (e.getKey() == Ext.EventObject.ENTER) {
												//queryCatalogItem();
											}
										}
									}
								}, {
									text : '查询',
									iconCls : 'page_findIcon',
									handler : function() {
										//queryCatalogItem();
									}
								},{
									text : '新增',
									iconCls : 'page_addIcon',
									handler : function() {
										//addcodeWindow.show();
									}
								},{
									text : '修改',
									iconCls : 'page_edit_1Icon',
									handler : function() {
										//editjobmanger();
									}
								},{
									text : '删除',
									iconCls : 'page_delIcon',
									handler : function() {
										//deljobmanger();
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

			// 表格右键菜单
			var contextmenu = new Ext.menu.Menu({
						id : 'theContextMenu',
						items : [{
									text : '查看详情',
									iconCls : 'previewIcon',
									handler : function() {
										// 获取当前选择行对象
										var record = grid.getSelectionModel().getSelected();
										var queryParam = record.get('queryParam');
										//Ext.MessageBox.alert('提示', xmmc);
									}
								}, {
									text : '导出列表',
									iconCls : 'page_excelIcon',
									handler : function() {
										// 获取当前选择行对象
										var record = grid.getSelectionModel().getSelected();
										var queryParam = record.get('queryParam');
										//Ext.MessageBox.alert('提示', xmmc);
									}
								}]
					});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
						// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
						title : '<span class="commoncss">作业管理</span>',
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

			// 监听单元格双击事件
			grid.on("celldblclick", function(pGrid, rowIndex, columnIndex, e) {
				var record = pGrid.getStore().getAt(rowIndex);
				var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
				var cellData = record.get(fieldName);
					// Ext.MessageBox.alert('提示', cellData);
				});

			// 监听行双击事件
			grid.on('rowdblclick', function(pGrid, rowIndex, event) {
						// 获取行数据集
						var record = pGrid.getStore().getAt(rowIndex);
						// 获取单元格数据集
						var data = record.get("trigger_name");
						//Ext.MessageBox.alert('提示', "双击行的索引为:" + rowIndex);
						//editjobmanger();
					});

			// 给表格绑定右键菜单
			grid.on("rowcontextmenu", function(grid, rowIndex, e) {
						e.preventDefault(); // 拦截默认右键事件
						grid.getSelectionModel().selectRow(rowIndex); // 选中当前行
						contextmenu.showAt(e.getXY());
					});

			// 布局模型
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
			});
					
			store.load({params : {start : 0,limit : bbar.pageSize}});

})