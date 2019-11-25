/**
 * 表格综合示例
 * 
 * @author XiongChun
 * @since 2010-10-20
 */
Ext.onReady(function() {

			// 定义一个行级展开器(需要在CM和grid配置中加入)
			var expander = new Ext.grid.RowExpander({
						tpl : new Ext.Template('<p style=margin-left:70px;><span style=color:Teal;>RFC调用函数名称</span><br><span>{funcname}</span></p>',
								'<p style=margin-left:70px;><span style=color:Teal;>开始时间</span><br><span>{starttime}</span></p>',
								'<p style=margin-left:70px;><span style=color:Teal;>结束时间</span><br><span>{endtime}</span></p>',
								'<p style=margin-left:70px;><span style=color:Teal;>输入参数</span><br><span>{inparam}</span></p>',
								'<p style=margin-left:70px;><span style=color:Teal;>输出参数</span><br><span>{outparam}</span></p>',
								'<p style=margin-left:70px;><span style=color:Teal;>调用端信息</span><br><span>{remoteaddr}</span></p>',
								'<p style=margin-left:70px;><span style=color:Teal;>错误信息</span><br><span>{exceptionmsg}</span></p>'
								),
						// 设置行双击是否展开
						expandOnDblClick : true
					});

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
						header : 'NO',
						width : 28
					});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([rownum, expander, {
				header : '项目ID', // 列标题
				dataIndex : 'id', // 数据索引:和Store模型对应
				sortable : true,
				width:50
					// 是否可排序
				}, {
				header : 'RFC调用函数名称',
				dataIndex : 'funcname',
				sortable : true,
				width : 90
			}, {
				header : '调用端IP信息',
				dataIndex : 'remoteaddr',
				sortable : true,
				width : 90
			}, {
				header : '调用开始时间',
				hidden : true,
				dataIndex : 'starttime'
			}, {
				header : '调用结束时间',
				hidden : true,
				dataIndex : 'endtime'
			}, {
				header : '持续时间（s）',
				sortable : true,
				dataIndex : 'costtime',
				width : 60
			}, {
				header : '传入数据',
				dataIndex : 'inparam',
				width : 160
			}, {
				header : '传出数据',
				dataIndex : 'outparam',
				width : 160
			}]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy({
									url : 'rfcMonitor.ered?reqCode=queryMonitorData'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'id' // Json中的属性Key值
										}, {
											name : 'funcname'
										}, {
											name : 'remoteaddr'
										}, {
											name : 'starttime'
										}, {
											name : 'endtime'
										}, {
											name : 'costtime'
										}, {
											name : 'exceptionmsg'
										}, {
											name : 'inparam'
										}, {
											name : 'outparam'
										}])
					});

			/**
			 * 翻页排序时候的参数传递
			 */
			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
						this.baseParams = {
							funcname : Ext.getCmp('funcname').getValue(),
							mtcosttime : Ext.getCmp('mtcosttime').getValue()
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
									id : 'funcname',
									name : 'funcname',
									emptyText : '请输入函数名称',
									width : 150,
									enableKeyEvents : true,
									// 响应回车键
									listeners : {
										specialkey : function(field, e) {
											if (e.getKey() == Ext.EventObject.ENTER) {
												queryCatalogItem();
											}
										}
									}
								},{
									xtype : 'textfield',
									id : 'mtcosttime',
									name : 'mtcosttime',
									emptyText : '持续时间大于(s)',
									width : 100,
									enableKeyEvents : true,
									// 响应回车键
									listeners : {
										specialkey : function(field, e) {
											if (e.getKey() == Ext.EventObject.ENTER) {
												queryCatalogItem();
											}
										}
									}
								}, {
									text : '查询',
									iconCls : 'page_findIcon',
									handler : function() {
										queryCatalogItem();
									}
								}, {
									text : '刷新',
									iconCls : 'page_refreshIcon',
									handler : function() {
										store.reload();
									}
								}, {
									text : '清空',
									iconCls : 'page_refreshIcon',
									handler : clearMsg
								}]
					});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
						// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
						title : '<span class="commoncss">RFC函数调用</span>',
						height : 500,
						autoScroll : true,
						frame : true,
						region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
						store : store, // 数据存储
						stripeRows : true, // 斑马线
						cm : cm, // 列模型
						tbar : tbar, // 表格工具栏
						bbar : bbar,// 分页工具栏
						plugins : expander, // 行级展开
						viewConfig : {
							// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
							forceFit : true
						},
						loadMask : {
							msg : '正在加载表格数据,请稍等...'
						}
					});

			// 是否默认选中第一行数据
			bbar.on("change", function() {
						// grid.getSelectionModel().selectFirstRow();

					});
            //grid.expandRow(2);
			// 页面初始自动查询数据
			// store.load({params : {start : 0,limit : bbar.pageSize}});

			// 布局模型
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
					});

			// 查询表格数据
			function queryCatalogItem() {
				store.load({
							params : {
								start : 0,
								limit : bbar.pageSize,
								funcname : Ext.getCmp('funcname').getValue(),
								mtcosttime : Ext.getCmp('mtcosttime').getValue()
							}
						});
			}
			
			
			function clearMsg(){
				Ext.Msg.confirm('请确认', '确认要清空RFC监控记录吗?', function(btn, text) {
							if (btn == 'yes') {
								showWaitMsg();
								Ext.Ajax.request({
											url : 'rfcMonitor.ered?reqCode=clearAll',
											success : function(response) {
												var resultArray = Ext.util.JSON.decode(response.responseText);
												store.reload();
												Ext.Msg.alert('提示', resultArray.msg);
											},
											failure : function(response) {
												Ext.Msg.alert('提示', '请求失败!');
											}
										});
							}
						});
			}
			
			
			queryCatalogItem();
			
			
			
		});