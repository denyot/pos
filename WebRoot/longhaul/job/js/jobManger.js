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
						header : '事件名称', // 列标题
						dataIndex : 'trigger_name', // 数据索引:和Store模型对应
						sortable : true
						// 是否可排序
				   },{
					    header : '事件组', // 列标题
						dataIndex : 'trigger_group', // 数据索引:和Store模型对应
						sortable : true
				   } ,{
					    header : '下次执行时间 ', // 列标题
						dataIndex : 'next_fire_time', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '上次执行时间  ', // 列标题
						dataIndex : 'prev_fire_time', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '优先级  ', // 列标题
						dataIndex : 'priority', // 数据索引:和Store模型对应
						sortable : true,
						width: 50
				   } ,{
					    header : '状态  ', // 列标题
						dataIndex : 'trigger_state', // 数据索引:和Store模型对应
						sortable : true
				   },{
					    header : '类型  ', // 列标题
						dataIndex : 'trigger_type', // 数据索引:和Store模型对应
						sortable : true
				   },{
					    header : '开始时间   ', // 列标题
						dataIndex : 'start_time', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '结束时间  ', // 列标题
						dataIndex : 'end_time', // 数据索引:和Store模型对应
						sortable : true
				   }
			       ]);
			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy({
									url : './jobMange.ered?reqCode=jobMangerList'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'trigger_name' // Json中的属性Key值
									},{
										    name : 'trigger_group'
									},{
										    name : 'next_fire_time'
									},{
										    name : 'prev_fire_time'
									},{
										    name : 'priority'
									},{
										    name : 'trigger_state'
									},{
										    name : 'trigger_type'
									},{
										    name : 'start_time'
									},{
										    name : 'end_time'
									},{
										    name : 'cron_expression'
									}
									,{name:'Y1'},{name:'Y2'},{name:'Y3'},{name:'Y4'},{name:'Y5'},{name:'Y6'},{name:'Y7'},{name:'Y8'},{name:'Y9'},{name:'Y10'}
									,{ name:'every'},{name:'From'},{name:'assign'},{name:'Cyle'},{name:'CHour'},{name:'PHour'}
									,{name:'perday'},{name:'standday'},{name:'perMoth'},{name:'Standmonth'}
									,{name:'Standweek'},{name:'Useweek'},{name:'perWeek'},{name:'year'},{name:'yearfrom'},{name:'yearto'},{name:'standeryear'}
									,{name:'M0'},{name:'M1'},{name:'M2'},{name:'M3'},{name:'M4'},{name:'M5'},{name:'M6'},{name:'M7'},{name:'M8'},{name:'M9'},{name:'M10'},{name:'M11'},{name:'M12'},{name:'M13'},{name:'M14'},{name:'M15'},{name:'M16'},{name:'M17'},{name:'M18'},{name:'M19'},{name:'M20'},{name:'M21'},{name:'M22'},{name:'M23'},{name:'M24'},{name:'M25'},{name:'M26'},{name:'M27'},{name:'M28'},{name:'M29'},{name:'M30'},{name:'M31'},{name:'M32'},{name:'M33'},{name:'M34'},{name:'M35'},{name:'M36'},{name:'M37'},{name:'M38'},{name:'M39'},{name:'M40'},{name:'M41'},{name:'M42'},{name:'M43'},{name:'M44'},{name:'M45'},{name:'M46'},{name:'M47'},{name:'M48'},{name:'M49'},{name:'M50'},{name:'M51'},{name:'M52'},{name:'M53'},{name:'M54'},{name:'M55'},{name:'M56'},{name:'M57'},{name:'M58'},{name:'M59'}
									,{name:'H0'},{name:'H1'},{name:'H2'},{name:'H3'},{name:'H4'},{name:'H5'},{name:'H6'},{name:'H7'},{name:'H8'},{name:'H9'},{name:'H10'},{name:'H11'},{name:'H12'},{name:'H13'},{name:'H14'},{name:'H15'},{name:'H16'},{name:'H17'},{name:'H18'},{name:'H19'},{name:'H20'},{name:'H21'},{name:'H22'}
									,{name:'D1'},{name:'D2'},{name:'D3'},{name:'D4'},{name:'D5'},{name:'D6'},{name:'D7'},{name:'D8'},{name:'D9'},{name:'D10'},{name:'D11'},{name:'D12'},{name:'D13'},{name:'D14'},{name:'D15'},{name:'D16'},{name:'D17'},{name:'D18'},{name:'D19'},{name:'D20'},{name:'D21'},{name:'D22'},{name:'D23'},{name:'D24'},{name:'D25'},{name:'D26'},{name:'D27'},{name:'D28'},{name:'D29'},{name:'D30'},{name:'D31'}
									,{name:'MM1'},{name:'MM2'},{name:'MM3'},{name:'MM4'},{name:'MM5'},{name:'MM6'},{name:'MM7'},{name:'MM8'},{name:'MM9'},{name:'MM10'},{name:'MM11'},{name:'MM12'}
									,{name:'week1'},{name:'week2'},{name:'week3'},{name:'week4'},{name:'week5'},{name:'week6'},{name:'week7'}
									
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
												queryCatalogItem();
											}
										}
									}
								},{
									text : '新增',
									iconCls : 'page_addIcon',
									handler : function() {
										addcodeWindow.show();
									}
								},{
									text : '修改',
									iconCls : 'page_edit_1Icon',
									handler : function() {
										editjobmanger();
									}
								},{
									text : '暂停',
									iconCls : 'keyIcon',
									handler : function() {
										stopjobmanger();
									}
								},{
									text : '恢复',
									iconCls : 'arrow_switchIcon',
									handler : function() {
										restorejobmanger();
									}
								},{
									text : '删除',
									iconCls : 'page_delIcon',
									handler : function() {
										deljobmanger();
									}
								}
								, {
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
									queryCatalogItem();
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
						editjobmanger();
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

			// 查询表格数据
			function queryCatalogItem() {
				store.load({
							params : {
								start : 0,
								limit : bbar.pageSize,
								queryParam : Ext.getCmp('queryParam').getValue()
							}
						});
			}
			//定时自动 刷新
			setInterval(function() {
				store.reload();  // dataStore 换成你的 store 的变量名
				}, 600000);  //每隔X 秒

			//生成一个图标列
			function iconColumnRender(value) {
				return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/edit1.png'/></a>";;
			}
			
			
		
			
			//修改窗口
			var formPanel;
			formPanel = new Ext.form.FormPanel({
				id : 'codeForm',
				name : 'codeForm',
				width : 800,
				Height : 800,
				frame : true,
				layout : "auto", 
				delay: 3000,  
				labelAlign : "right",
				//html: "1234"
				items : [
					 {
	                    xtype: 'label',
	                    text: '名称'
	                },
	                {
	                    xtype: 'textfield',
	                    width: 350,
	                    name: 'trigger_name',
	                    readOnly: true
	                },{
	                    xtype: 'textfield',
	                    width: 100,
	                    name: 'trigger_group'
	                },{
				    xtype: 'tabpanel',
					deferredRender:false ,
				    layoutOnTabChange : true,
				    id: 'Mytable',
				    height: 300,
				    width: 600,
				    activeTab: 0,
				    items: [
				        {
				            xtype: 'panel',
				            id: 'Minute',
				            height: 300,
				            layout: 'absolute',
				            title: '分钟',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'Cyle',
				                    name: 'Cyle',
				                    boxLabel: '循环',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                	handler:function(){
				                    	if(Ext.getCmp("Cyle").checked)
				                    	  {
				                    		Ext.getCmp('XX1').setDisabled(true);
				                    		Ext.getCmp('From').setDisabled(false);
				                    		Ext.getCmp('every').setDisabled(false);
				                    		Ext.getCmp('assign').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'displayfield',
				                    width: 100,
				                    value: '从',
				                    x: 60,
				                    y: 3
				                },
				                {
				                    xtype: 'numberfield',
				                    id: 'From',
				                    width: 40,
				                    name: 'From',
				                    maxValue : 59,
				                    maxText : '最大值59',
				                    minValue :0,
				                    minText: '最小值0',
				                    allowNegative:false,
				                    allowDecimals:false,
				                    value: 0,
				                    x: 80,
				                    y: 0
				                },
				                {
				                    xtype: 'label',
				                    height: 20,
				                    text: '分钟开始',
				                    x: 130,
				                    y: 3
				                },
				                {
				                    xtype: 'displayfield',
				                    height: 20,
				                    width: 80,
				                    value: '每',
				                    x: 200,
				                    y: 3
				                },
				                {
				                    xtype: 'numberfield',
				                    id: 'every',
				                    width: 60,
				                    name: 'every',
				                    maxValue : 59,
				                    maxText : '最大值59',
				                    minValue :0,
				                    minText: '最小值0',
				                    allowNegative:false,
				                    allowDecimals:false,
				                    value: 5,
				                    x: 230,
				                    y: 0
				                },
				                {
				                    xtype: 'label',
				                    text: '分钟执行一次',
				                    x: 300,
				                    y: 3
				                },
				                {
				                    xtype: 'radio',
				                    id: 'assign',
				                    name: 'assign',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                	handler:function(){
				                    	if(Ext.getCmp("assign").checked)
				                    	  {
				                    		Ext.getCmp('XX1').setDisabled(false);
				                    		Ext.getCmp('From').setDisabled(true);
				                    		Ext.getCmp('every').setDisabled(true);
				                    		Ext.getCmp('Cyle').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX1',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX1',
				                            width: 460,
				                            name: 'MX1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M0',
				                                    itemId: '',
				                                    name: 'M0',
				                                    boxLabel: '0'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M1',
				                                    name: 'M1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M2',
				                                    name: 'M2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M3',
				                                    name: 'M3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M4',
				                                    name: 'M4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M5',
				                                    name: 'M5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M6',
				                                    name: 'M6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M7',
				                                    name: 'M7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M8',
				                                    name: 'M8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M9',
				                                    name: 'M9',
				                                    boxLabel: 9
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX2',
				                            width: 460,
				                            name: 'MX2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M10',
				                                    name: 'M10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M11',
				                                    name: 'M11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M12',
				                                    name: 'M12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M13',
				                                    name: 'M13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M14',
				                                    name: 'M14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M15',
				                                    name: 'M15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M16',
				                                    name: 'M16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M17',
				                                    name: 'M17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M18',
				                                    name: 'M18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M19',
				                                    name: 'M19',
				                                    boxLabel: 19
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX3',
				                            width: 460,
				                            name: 'MX3',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M20',
				                                    name: 'M20',
				                                    boxLabel: 20
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M21',
				                                    name: 'M21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M22',
				                                    name: 'M22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M23',
				                                    name: 'M23',
				                                    boxLabel: 23
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M24',
				                                    name: 'M24',
				                                    boxLabel: 24
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M25',
				                                    name: 'M25',
				                                    boxLabel: 25
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M26',
				                                    name: 'M26',
				                                    boxLabel: 26
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M27',
				                                    name: 'M27',
				                                    boxLabel: 27
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M28',
				                                    name: 'M28',
				                                    boxLabel: 28
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M29',
				                                    name: 'M29',
				                                    boxLabel: 29
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX4',
				                            width: 460,
				                            name: 'MX4',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M30',
				                                    name: 'M30',
				                                    boxLabel: 30
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M31',
				                                    name: 'M31',
				                                    boxLabel: 31
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M32',
				                                    name: 'M32',
				                                    boxLabel: 32
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M33',
				                                    name: 'M33',
				                                    boxLabel: 33
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M34',
				                                    name: 'M34',
				                                    boxLabel: 34
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M35',
				                                    name: 'M35',
				                                    boxLabel: 35
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 36,
				                                    name: 36,
				                                    boxLabel: 36
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M37',
				                                    name: 'M37',
				                                    boxLabel: 37
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M38',
				                                    name: 'M38',
				                                    boxLabel: 38
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M39',
				                                    name: 'M39',
				                                    boxLabel: 39
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX5',
				                            width: 460,
				                            name: 'MX5',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M40',
				                                    name: 'M40',
				                                    boxLabel: 40
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M41',
				                                    name: 'M41',
				                                    boxLabel: 41
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M42',
				                                    name: 'M42',
				                                    boxLabel: 42
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M43',
				                                    name: 'M43',
				                                    boxLabel: 43
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M44',
				                                    name: 'M44',
				                                    boxLabel: 44
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M45',
				                                    name: 'M45',
				                                    boxLabel: 45
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M46',
				                                    name: 'M46',
				                                    boxLabel: 46
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M47',
				                                    name: 'M47',
				                                    boxLabel: 47
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M48',
				                                    name: 'M48',
				                                    boxLabel: 48
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M49',
				                                    name: 'M49',
				                                    boxLabel: 49
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX6',
				                            width: 460,
				                            name: 'MX6',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M50',
				                                    name: 'M50',
				                                    boxLabel: 50
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M51',
				                                    name: 'M51',
				                                    boxLabel: 51
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M52',
				                                    name: 'M52',
				                                    boxLabel: 52
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M53',
				                                    name: 'M53',
				                                    boxLabel: 53
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M54',
				                                    name: 'M54',
				                                    boxLabel: 54
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M55',
				                                    name: 'M55',
				                                    boxLabel: 55
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M56',
				                                    name: 'M56',
				                                    boxLabel: 56
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M57',
				                                    name: 'M57',
				                                    boxLabel: 57
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M58',
				                                    name: 'M58',
				                                    boxLabel: 58
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M59',
				                                    name: 'M59',
				                                    boxLabel: 59
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            id: 'hour',
				            layout: 'absolute',
				            title: '小时',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'PHour',
				                    name: 'PHour',
				                    value: '每小时 ',
				                    boxLabel: '每小时 ',
				                    checked: true,
				                    x: 10,
				                    y: -3,
				                    handler:function(){
				                    	if(Ext.getCmp("PHour").checked)
				                    	  {
				                    		Ext.getCmp('XX2').setDisabled(true);
				                    		Ext.getCmp('CHour').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    id: 'CHour',
				                    name: 'CHour',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 20,
				                    handler:function(){
				                    	if(Ext.getCmp("CHour").checked)
				                    	  {
				                    		Ext.getCmp('XX2').setDisabled(false);
				                    		Ext.getCmp('PHour').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    checkboxToggle:false,//关键参数，其他和以前的一样
				                    //hideMode: 'visibility',
				                    //hideParent: true,
				                    //disabled: true,
				                    //collapsed: false,
				                    id: 'XX2',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'HH1',
				                            width: 460,
				                            name: 'HH1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H0',
				                                    name: 'H0',
				                                    boxLabel: '0'
				                                    //checked: true
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H1',
				                                    name: 'H1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H2',
				                                    name: 'H2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H3',
				                                    name: 'H3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H4',
				                                    name: 'H4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H5',
				                                    name: 'H5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H6',
				                                    name: 'H6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H7',
				                                    name: 'H7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H8',
				                                    name: 'H8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H9',
				                                    name: 'H9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H10',
				                                    name: 'H10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H11',
				                                    name: 'H11',
				                                    boxLabel: 11
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'HH2',
				                            width: 460,
				                            name: 'HH2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H12',
				                                    name: 'H12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H13',
				                                    name: 'H13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H14',
				                                    name: 'H14',
				                                    boxLabel: 14
				                                    //isFormField : true
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H15',
				                                    name: 'H15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H16',
				                                    name: 'H16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H17',
				                                    name: 'H17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H18',
				                                    name: 'H18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H19',
				                                    name: 'H19',
				                                    boxLabel: 19
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H20',
				                                    name: 'H20',
				                                    boxLabel: 20
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H21',
				                                    name: 'H21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H22',
				                                    name: 'H22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H23',
				                                    name: 'H23',
				                                    boxLabel: 23
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            id: 'day',
				            layout: 'absolute',
				            title: '天',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'perday',
				                    name: 'perday',
				                    boxLabel: '每天',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(Ext.getCmp("perday").checked)
				                    	  {
				                    		Ext.getCmp('XX3').setDisabled(true);
				                    		Ext.getCmp('standday').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    id: 'standday',
				                    name: 'standday',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(Ext.getCmp("standday").checked)
				                    	  {
				                    		Ext.getCmp('XX3').setDisabled(false);
				                    		Ext.getCmp('perday').setValue(false);
				                    		Ext.getCmp('Useweek').setValue("");
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX3',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'DD1',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D1',
				                                    name: 'D1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D2',
				                                    name: 'D2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D3',
				                                    name: 'D3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D4',
				                                    name: 'D4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D5',
				                                    name: 'D5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D6',
				                                    name: 'D6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D7',
				                                    name: 'D7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D8',
				                                    name: 'D8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D9',
				                                    name: 'D9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D10',
				                                    name: 'D10',
				                                    boxLabel: 10
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'DD2',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D11',
				                                    name: 'D11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D12',
				                                    name: 'D12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D13',
				                                    name: 'D13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D14',
				                                    name: 'D14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D15',
				                                    name: 'D15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D16',
				                                    name: 'D16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D17',
				                                    name: 'D17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D18',
				                                    name: 'D18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D19',
				                                    name: 'D19',
				                                    boxLabel: 19
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D20',
				                                    name: 'D20',
				                                    boxLabel: 20
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'DD3',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D21',
				                                    name: 'D21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D22',
				                                    name: 'D22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D23',
				                                    name: 'D23',
				                                    boxLabel: 23
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D24',
				                                    name: 'D24',
				                                    boxLabel: 24
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D25',
				                                    name: 'D25',
				                                    boxLabel: 25
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D26',
				                                    name: 'D26',
				                                    boxLabel: 26
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D27',
				                                    name: 'D27',
				                                    boxLabel: 27
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D28',
				                                    name: 'D28',
				                                    boxLabel: 28
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D29',
				                                    name: 'D29',
				                                    boxLabel: 29
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D30',
				                                    name: 'D30',
				                                    boxLabel: 30
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'DD4',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D31',
				                                    name: 'D31',
				                                    boxLabel: 31
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            id: 'month',
				            layout: 'absolute',
				            title: '月',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'perMoth',
				                    name: 'perMoth',
				                    boxLabel: '每月',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(Ext.getCmp("perMoth").checked)
				                    	  {
				                    		Ext.getCmp('XX4').setDisabled(true);
				                    		Ext.getCmp('Standmonth').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    id: 'Standmonth',
				                    name: 'Standmonth',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(Ext.getCmp("Standmonth").checked)
				                    	  {
				                    		Ext.getCmp('XX4').setDisabled(false);
				                    		Ext.getCmp('perMoth').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX4',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MonthM1',
				                            width: 460,
				                            name: 'MonthM1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM1',
				                                    name: 'MM1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM2',
				                                    name: 'MM2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM3',
				                                    name: 'MM3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM4',
				                                    name: 'MM4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM5',
				                                    name: 'MM5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM6',
				                                    name: 'MM6',
				                                    boxLabel: 6
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MonthM2',
				                            width: 460,
				                            name: 'MonthM2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM7',
				                                    name: 'MM7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM8',
				                                    name: 'MM8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM9',
				                                    name: 'MM9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM10',
				                                    name: 'MM10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM11',
				                                    name: 'MM11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM12',
				                                    name: 'MM12',
				                                    boxLabel: 12
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            id: 'week',
				            layout: 'absolute',
				            title: '周',
				            items: [
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX5',
				                    height: 200,
				                    width: 490,
				                    layout: 'vbox',
				                    title: '选择',
				                    x: 10,
				                    y: 40,
				                    items: [
				                        {
				                            xtype: 'fieldset',
				                            id: 'XXW1',
				                            width: 460,
				                            layout: 'vbox',
				                            title: '周选择',
				                            flex: 1,
				                            items: [
				                                {
				                                    xtype: 'radio',
				                                    checked: true,
				                                    id: 'perWeek',
				                                    height: 20,
				                                    name: 'perWeek',
				                                    boxLabel: '每周',
				                                    flex: 1,
				                                    handler:function(){
								                    	if(Ext.getCmp("perWeek").checked)
								                    	  {
								                    		Ext.getCmp('weekxx1').setDisabled(true);
								                    		Ext.getCmp('Standweek').setValue(false);
								                    	  }
								                    }
				                                },
				                                {
				                                    xtype: 'radio',
				                                    id: 'Standweek',
				                                    height: 20,
				                                    name: 'Standweek',
				                                    boxLabel: '定义',
				                                    flex: 1,
				                                    handler:function(){
								                    	if(Ext.getCmp("Standweek").checked)
								                    	  {
								                    		Ext.getCmp('weekxx1').setDisabled(false);
								                    		Ext.getCmp('perWeek').setValue(false);
								                    	  }
								                    }
				                                },
				                                {
				                                    xtype: 'checkboxgroup',
				                                    disabled: true,
				                                    id: 'weekxx1',
				                                    name: 'weekxx1',
				                                    flex: 1,
				                                    items: [
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week1',
				                                            name: 'week1',
				                                            boxLabel: '星期天'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week2',
				                                            name: 'week2',
				                                            boxLabel: '星期一'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week3',
				                                            name: 'week3',
				                                            boxLabel: '星期二'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week4',
				                                            name: 'week4',
				                                            boxLabel: '星期三'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week5',
				                                            name: 'week5',
				                                            boxLabel: '星期四'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week6',
				                                            name: 'week6',
				                                            boxLabel: '星期五'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week7',
				                                            width: 460,
				                                            name: 'week7',
				                                            boxLabel: '星期六'
				                                        }
				                                    ]
				                                }
				                            ]
				                        }
				                    ]
				                },
				                {
				                    xtype: 'checkbox',
				                    id: 'Useweek',
				                    name: 'Useweek',
				                    boxLabel: '使用周',
				                    x: 10,
				                    y: 10,
				                    handler:function(){
				                    	if(Ext.getCmp("Useweek").checked)
				                    	  {
				                    		Ext.getCmp('XX5').setDisabled(false);
				                    		Ext.getCmp('XX3').setDisabled(true);
				                    		Ext.getCmp('perday').setValue(true);
				                    	  }else{
				                    		 Ext.getCmp('XX5').setDisabled(true);
				                    	  }
				                    }
				                }
				            ]
				        },{
				            xtype: 'panel',
				            id: 'yearpanel',
				            layout: 'absolute',
				            title: '年',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'year',
				                    name: 'year',
				                    boxLabel: '年',
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(Ext.getCmp("year").checked)
				                    	  {
				                    		Ext.getCmp('yearfrom').setDisabled(false);
				                    		Ext.getCmp('yearto').setDisabled(false);
				                    		Ext.getCmp('standeryear').setValue(false);
				                    		Ext.getCmp('XX6').setDisabled(true);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'displayfield',
				                    width: 59,
				                    value: '从',
				                    x: 50,
				                    y: 0
				                },
				                {
				                    xtype: 'datefield',
				                    name: 'yearfrom',
				                    id: 'yearfrom',
				                    disabled: true,
				                    format:'Y-m-d H:i',
				                    //value:new Date(),
				                    width: 140,
				                    x: 80,
				                    y: 0
				                },
				                {
				                    xtype: 'displayfield',
				                    value: '到',
				                    x: 240,
				                    y: 0
				                },
				                {
				                    xtype: 'datefield',
				                    name: 'yearto',
				                    id: 'yearto',
				                    width: 140,
				                    disabled: true,
				                    format:'Y-m-d H:i',
				                    x: 270,
				                    y: 0
				                },
				                {
				                    xtype: 'radio',
				                    id : 'standeryear',
				                    name: 'standeryear',
				                    boxLabel: '特定年',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(Ext.getCmp("standeryear").checked)
				                    	  {
				                    		Ext.getCmp('yearfrom').setDisabled(true);
				                    		Ext.getCmp('yearto').setDisabled(true);
				                    		Ext.getCmp('XX6').setDisabled(false);
				                    		Ext.getCmp('year').setValue(false);
				                    		//Ext.getCmp('Y1').setValue(true);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX6',
				                    height: 169,
				                    width: 460,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 70,
				                    items: [
					                        {
					                            xtype: 'checkboxgroup',
					                            id: 'yearxx1',
					                            name: 'yearxx1',
					                            flex: 1,
					                            width :460,
					                            items: [
					                                {
					                                	xtype: 'checkbox',
					                                    name: 'Y1',
					                                    id: 'Y1',
					                                    boxLabel: 2012
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    name: 'Y2',
					                                    id: 'Y2',
					                                    boxLabel: 2013
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    name: 'Y3',
					                                    id: 'Y3',
					                                    boxLabel: 2014
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    name: 'Y4',
					                                    id: 'Y4',
					                                    boxLabel: 2015
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    name: 'Y5',
					                                    id: 'Y5',
					                                    boxLabel: 1016
					                                }
					                            ]
					                        },
					                        {
					                            xtype: 'checkboxgroup',
					                            id: 'yearxx2',
					                            name: 'yearxx1',
					                            flex: 1,
					                            width :460,
					                            items: [
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2017,
					                                    name: 'Y6'
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2018,
					                                    name: 'Y7'
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2019,
					                                    name: 'Y8'
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2020,
					                                    name: 'Y9',
					                                    id :'Y9'
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2021,
					                                    name: 'Y10'
					                                }
					                            ]
					                        }
					                    ]
				                }
				            ]
				        }
				    ]
				}]
			});
			
			

			
			var addformPanel;
			addformPanel = new Ext.form.FormPanel({
				name : 'addcodeForm',
				id :'addcodeForm',
				width : 620,
				Height : 400,
				frame : true,
				layout : "auto",  
				labelAlign : "right",
				items : [
					 {
	                    xtype: 'label',
	                    text: '名称'
	                },
	                {
	                    xtype: 'textfield',
	                    width: 350,
	                    name: 'trigger_name'
	                },{
				    xtype: 'tabpanel',
				    //id :  'Mytable',
				    height: 300,
				    width: 600,
				    activeTab: 0,
				    items: [
				        {
				            xtype: 'panel',
				            //id :  'Minute',
				            height: 300,
				            layout: 'absolute',
				            title: '分钟',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id :  'Cyle',
				                    name: 'Cyle',
				                    boxLabel: '循环',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                	handler:function(){
				                    	if(addformPanel.getForm().findField("Cyle").checked)
				                    	  {
				                    		Ext.getCmp('AXX1').setDisabled(true);
				                    		addformPanel.getForm().findField('From').setDisabled(false);
				                    		addformPanel.getForm().findField('every').setDisabled(false);
				                    		addformPanel.getForm().findField('assign').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'displayfield',
				                    width: 100,
				                    value: '从',
				                    x: 60,
				                    y: 3
				                },
				                {
				                    xtype: 'numberfield',
				                    //id :  'From',
				                    width: 40,
				                    name: 'From',
				                    maxValue : 59,
				                    maxText : '最大值59',
				                    minValue :0,
				                    minText: '最小值0',
				                    allowNegative:false,
				                    allowDecimals:false,
				                    value: 0,
				                    x: 80,
				                    y: 0
				                },
				                {
				                    xtype: 'label',
				                    height: 20,
				                    text: '分钟开始',
				                    x: 130,
				                    y: 3
				                },
				                {
				                    xtype: 'displayfield',
				                    height: 20,
				                    width: 80,
				                    value: '每',
				                    x: 200,
				                    y: 3
				                },
				                {
				                    xtype: 'numberfield',
				                    //id :  'every',
				                    width: 60,
				                    name: 'every',
				                    maxValue : 59,
				                    maxText : '最大值59',
				                    minValue :0,
				                    minText: '最小值0',
				                    allowNegative:false,
				                    allowDecimals:false,
				                    value: 5,
				                    x: 230,
				                    y: 0
				                },
				                {
				                    xtype: 'label',
				                    text: '分钟执行一次',
				                    x: 300,
				                    y: 3
				                },
				                {
				                    xtype: 'radio',
				                    //id :  'assign',
				                    name: 'assign',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                	handler:function(){
				                    	if(addformPanel.getForm().findField("assign").checked)
				                    	  {
				                    		Ext.getCmp('AXX1').setDisabled(false);
				                    		addformPanel.getForm().findField('From').setDisabled(true);
				                    		addformPanel.getForm().findField('every').setDisabled(true);
				                    		addformPanel.getForm().findField('Cyle').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX1',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX1',
				                            width: 460,
				                            name: 'MX1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M0',
				                                    itemId: '',
				                                    name: 'M0',
				                                    boxLabel: '0'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M1',
				                                    name: 'M1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M2',
				                                    name: 'M2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M3',
				                                    name: 'M3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M4',
				                                    name: 'M4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M5',
				                                    name: 'M5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M6',
				                                    name: 'M6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M7',
				                                    name: 'M7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M8',
				                                    name: 'M8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M9',
				                                    name: 'M9',
				                                    boxLabel: 9
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX2',
				                            width: 460,
				                            name: 'MX2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M10',
				                                    name: 'M10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M11',
				                                    name: 'M11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M12',
				                                    name: 'M12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M13',
				                                    name: 'M13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M14',
				                                    name: 'M14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M15',
				                                    name: 'M15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M16',
				                                    name: 'M16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M17',
				                                    name: 'M17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M18',
				                                    name: 'M18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M19',
				                                    name: 'M19',
				                                    boxLabel: 19
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX3',
				                            width: 460,
				                            name: 'MX3',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M20',
				                                    name: 'M20',
				                                    boxLabel: 20
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M21',
				                                    name: 'M21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M22',
				                                    name: 'M22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M23',
				                                    name: 'M23',
				                                    boxLabel: 23
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M24',
				                                    name: 'M24',
				                                    boxLabel: 24
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M25',
				                                    name: 'M25',
				                                    boxLabel: 25
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M26',
				                                    name: 'M26',
				                                    boxLabel: 26
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M27',
				                                    name: 'M27',
				                                    boxLabel: 27
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M28',
				                                    name: 'M28',
				                                    boxLabel: 28
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M29',
				                                    name: 'M29',
				                                    boxLabel: 29
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX4',
				                            width: 460,
				                            name: 'MX4',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M30',
				                                    name: 'M30',
				                                    boxLabel: 30
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M31',
				                                    name: 'M31',
				                                    boxLabel: 31
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M32',
				                                    name: 'M32',
				                                    boxLabel: 32
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M33',
				                                    name: 'M33',
				                                    boxLabel: 33
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M34',
				                                    name: 'M34',
				                                    boxLabel: 34
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M35',
				                                    name: 'M35',
				                                    boxLabel: 35
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  36,
				                                    name: 36,
				                                    boxLabel: 36
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M37',
				                                    name: 'M37',
				                                    boxLabel: 37
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M38',
				                                    name: 'M38',
				                                    boxLabel: 38
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M39',
				                                    name: 'M39',
				                                    boxLabel: 39
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX5',
				                            width: 460,
				                            name: 'MX5',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M40',
				                                    name: 'M40',
				                                    boxLabel: 40
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M41',
				                                    name: 'M41',
				                                    boxLabel: 41
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M42',
				                                    name: 'M42',
				                                    boxLabel: 42
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M43',
				                                    name: 'M43',
				                                    boxLabel: 43
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M44',
				                                    name: 'M44',
				                                    boxLabel: 44
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M45',
				                                    name: 'M45',
				                                    boxLabel: 45
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M46',
				                                    name: 'M46',
				                                    boxLabel: 46
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M47',
				                                    name: 'M47',
				                                    boxLabel: 47
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M48',
				                                    name: 'M48',
				                                    boxLabel: 48
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M49',
				                                    name: 'M49',
				                                    boxLabel: 49
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX6',
				                            width: 460,
				                            name: 'MX6',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M50',
				                                    name: 'M50',
				                                    boxLabel: 50
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M51',
				                                    name: 'M51',
				                                    boxLabel: 51
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M52',
				                                    name: 'M52',
				                                    boxLabel: 52
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M53',
				                                    name: 'M53',
				                                    boxLabel: 53
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M54',
				                                    name: 'M54',
				                                    boxLabel: 54
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M55',
				                                    name: 'M55',
				                                    boxLabel: 55
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M56',
				                                    name: 'M56',
				                                    boxLabel: 56
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M57',
				                                    name: 'M57',
				                                    boxLabel: 57
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M58',
				                                    name: 'M58',
				                                    boxLabel: 58
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M59',
				                                    name: 'M59',
				                                    boxLabel: 59
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            //id :  'hour',
				            layout: 'absolute',
				            title: '小时',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id :  'PHour',
				                    name: 'PHour',
				                    value: '每小时 ',
				                    boxLabel: '每小时 ',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField("PHour").checked)
				                    	  {
				                    		Ext.getCmp('AXX2').setDisabled(true);
				                    		addformPanel.getForm().findField('CHour').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    //id :  'CHour',
				                    name: 'CHour',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 20,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField("CHour").checked)
				                    	  {
				                    		Ext.getCmp('AXX2').setDisabled(false);
				                    		addformPanel.getForm().findField('PHour').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX2',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'HH1',
				                            width: 460,
				                            name: 'HH1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H0',
				                                    name: 'H0',
				                                    boxLabel: 'Z0'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H1',
				                                    name: 'H1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H2',
				                                    name: 'H2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H3',
				                                    name: 'H3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H4',
				                                    name: 'H4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H5',
				                                    name: 'H5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H6',
				                                    name: 'H6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H7',
				                                    name: 'H7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H8',
				                                    name: 'H8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H9',
				                                    name: 'H9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H10',
				                                    name: 'H10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H11',
				                                    name: 'H11',
				                                    boxLabel: 11
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'HH2',
				                            width: 460,
				                            name: 'HH2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H12',
				                                    name: 'H12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H13',
				                                    name: 'H13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H14',
				                                    name: 'H14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H15',
				                                    name: 'H15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H16',
				                                    name: 'H16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H17',
				                                    name: 'H17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H18',
				                                    name: 'H18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H19',
				                                    name: 'H19',
				                                    boxLabel: 19
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H20',
				                                    name: 'H20',
				                                    boxLabel: 20
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H21',
				                                    name: 'H21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H22',
				                                    name: 'H22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H23',
				                                    name: 'H23',
				                                    boxLabel: 23
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            //id :  'day',
				            layout: 'absolute',
				            title: '天',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id :  'perday',
				                    name: 'perday',
				                    boxLabel: '每天',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField("perday").checked)
				                    	  {
				                    		Ext.getCmp('AXX3').setDisabled(true);
				                    		addformPanel.getForm().findField('standday').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    //id :  'standday',
				                    name: 'standday',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField("standday").checked)
				                    	  {
				                    		Ext.getCmp('AXX3').setDisabled(false);
				                    		addformPanel.getForm().findField('perday').setValue(false);
				                    		addformPanel.getForm().findField('Useweek').setValue("");
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX3',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'DD1',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D1',
				                                    name: 'D1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D2',
				                                    name: 'D2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D3',
				                                    name: 'D3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D4',
				                                    name: 'D4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D5',
				                                    name: 'D5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D6',
				                                    name: 'D6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D7',
				                                    name: 'D7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D8',
				                                    name: 'D8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D9',
				                                    name: 'D9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D10',
				                                    name: 'D10',
				                                    boxLabel: 10
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'DD2',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D11',
				                                    name: 'D11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D12',
				                                    name: 'D12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D13',
				                                    name: 'D13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D14',
				                                    name: 'D14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D15',
				                                    name: 'D15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D16',
				                                    name: 'D16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D17',
				                                    name: 'D17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D18',
				                                    name: 'D18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D19',
				                                    name: 'D19',
				                                    boxLabel: 19
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D20',
				                                    name: 'D20',
				                                    boxLabel: 20
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'DD3',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D21',
				                                    name: 'D21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D22',
				                                    name: 'D22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D23',
				                                    name: 'D23',
				                                    boxLabel: 23
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D24',
				                                    name: 'D24',
				                                    boxLabel: 24
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D25',
				                                    name: 'D25',
				                                    boxLabel: 25
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D26',
				                                    name: 'D26',
				                                    boxLabel: 26
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D27',
				                                    name: 'D27',
				                                    boxLabel: 27
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D28',
				                                    name: 'D28',
				                                    boxLabel: 28
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D29',
				                                    name: 'D29',
				                                    boxLabel: 29
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D30',
				                                    name: 'D30',
				                                    boxLabel: 30
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'DD4',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D31',
				                                    name: 'D31',
				                                    boxLabel: 31
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            //id :  'month',
				            layout: 'absolute',
				            title: '月',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id :  'perMoth',
				                    name: 'perMoth',
				                    boxLabel: '每月',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField("perMoth").checked)
				                    	  {
				                    		Ext.getCmp('AXX4').setDisabled(true);
				                    		addformPanel.getForm().findField('Standmonth').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    //id :  'Standmonth',
				                    name: 'Standmonth',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField("Standmonth").checked)
				                    	  {
				                    		Ext.getCmp('AXX4').setDisabled(false);
				                    		addformPanel.getForm().findField('perMoth').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX4',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MonthM1',
				                            width: 460,
				                            name: 'MonthM1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM1',
				                                    name: 'MM1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM2',
				                                    name: 'MM2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM3',
				                                    name: 'MM3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM4',
				                                    name: 'MM4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM5',
				                                    name: 'MM5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM6',
				                                    name: 'MM6',
				                                    boxLabel: 6
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MonthM2',
				                            width: 460,
				                            name: 'MonthM2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM7',
				                                    name: 'MM7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM8',
				                                    name: 'MM8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM9',
				                                    name: 'MM9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM10',
				                                    name: 'MM10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM11',
				                                    name: 'MM11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM12',
				                                    name: 'MM12',
				                                    boxLabel: 12
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            //id :  'week',
				            layout: 'absolute',
				            title: '周',
				            items: [
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX5',
				                    height: 200,
				                    width: 490,
				                    layout: 'vbox',
				                    title: '选择',
				                    x: 10,
				                    y: 40,
				                    items: [
				                        {
				                            xtype: 'fieldset',
				                            //id :  'XXW1',
				                            width: 460,
				                            layout: 'vbox',
				                            title: '周选择',
				                            flex: 1,
				                            items: [
				                                {
				                                    xtype: 'radio',
				                                    checked: true,
				                                    //id :  'perWeek',
				                                    height: 20,
				                                    name: 'perWeek',
				                                    boxLabel: '每周',
				                                    flex: 1,
				                                    handler:function(){
								                    	if(addformPanel.getForm().findField("perWeek").checked)
								                    	  {
								                    		Ext.getCmp('Aweekxx1').setDisabled(true);
								                    		addformPanel.getForm().findField('Standweek').setValue(false);
								                    	  }
								                    }
				                                },
				                                {
				                                    xtype: 'radio',
				                                    //id :  'Standweek',
				                                    height: 20,
				                                    name: 'Standweek',
				                                    boxLabel: '定义',
				                                    flex: 1,
				                                    handler:function(){
								                    	if(addformPanel.getForm().findField("Standweek").checked)
								                    	  {
								                    		Ext.getCmp('Aweekxx1').setDisabled(false);
								                    		addformPanel.getForm().findField('perWeek').setValue(false);
								                    	  }
								                    }
				                                },
				                                {
				                                    xtype: 'checkboxgroup',
				                                    disabled: true,
				                                    id :  'Aweekxx1',
				                                    name: 'weekxx1',
				                                    flex: 1,
				                                    items: [
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week1',
				                                            name: 'week1',
				                                            boxLabel: '星期天'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week2',
				                                            name: 'week2',
				                                            boxLabel: '星期一'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week3',
				                                            name: 'week3',
				                                            boxLabel: '星期二'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week4',
				                                            name: 'week4',
				                                            boxLabel: '星期三'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week5',
				                                            name: 'week5',
				                                            boxLabel: '星期四'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week6',
				                                            name: 'week6',
				                                            boxLabel: '星期五'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week7',
				                                            width: 460,
				                                            name: 'week7',
				                                            boxLabel: '星期六'
				                                        }
				                                    ]
				                                }
				                            ]
				                        }
				                    ]
				                },
				                {
				                    xtype: 'checkbox',
				                    //id :  'Useweek',
				                    name: 'Useweek',
				                    boxLabel: '使用周',
				                    x: 10,
				                    y: 10,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField(("Useweek").checked))
				                    	  {
				                    		Ext.getCmp('AXX5').setDisabled(false);
				                    		Ext.getCmp('AXX3').setDisabled(true);
				                    		addformPanel.getForm().findField('perday').setValue(true);
				                    	  }else{
				                    		Ext.getCmp('AXX5').setDisabled(true);
				                    	  }
				                    }
				                }
				            ]
				        },{

				            xtype: 'panel',
				            layout: 'absolute',
				            title: '年',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id: 'year',
				                    name: 'year',
				                    boxLabel: '年',
				                    x: 10,
				                    y: -2,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField("year").checked)
				                    	  {
				                    		addformPanel.getForm().findField('yearfrom').setDisabled(false);
				                    		addformPanel.getForm().findField('yearto').setDisabled(false);
				                    		addformPanel.getForm().findField('standeryear').setValue(false);
				                    		Ext.getCmp('AXX6').setDisabled(true);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'displayfield',
				                    width: 59,
				                    value: '从',
				                    x: 50,
				                    y: 0
				                },
				                {
				                    xtype: 'datefield',
				                    width: 140,
				                    name: 'yearfrom',
				                    value:new Date(),
				                    format:'Y-m-d H:i',
				                    disabled: true,
				                    //readOnly: true,
				                    x: 80,
				                    y: 0
				                },{   
				                	xtype: 'displayfield',
				                    width: 30,
				                    value: '到',
				                    x: 240,
				                    y: 0
				                },
				                {
				                	xtype: 'datefield',
				                    width: 140,
				                    name: 'yearto',
				                    value:'2099-03-29 00:00',
				                    format:'Y-m-d H:i',
				                    disabled: true,
				                    //readOnly:true,
				                    x: 270,
				                    y: 0
				                },
				                {
				                    xtype: 'radio',
				                    //id : 'standeryear',
				                    name: 'standeryear',
				                    boxLabel: '特定年',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(addformPanel.getForm().findField("standeryear").checked)
				                    	  {
				                    		addformPanel.getForm().findField('yearfrom').setDisabled(true);
				                    		addformPanel.getForm().findField('yearto').setDisabled(true);
				                    		Ext.getCmp('AXX6').setDisabled(false);
				                    		addformPanel.getForm().findField('year').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'AXX6',
				                    height: 169,
				                    width: 460,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 70,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y1',
				                                    boxLabel: 2012
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y2',
				                                    boxLabel: 2013
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y3',
				                                    boxLabel: 2014
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y4',
				                                    boxLabel: 2015
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y5',
				                                    boxLabel: 1016
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2017,
				                                    name: 'Y6'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2018,
				                                    name: 'Y7'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2019,
				                                    name: 'Y8'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2020,
				                                    name: 'Y9'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2021,
				                                    name: 'Y10'
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        
				        }
				    ]
				}]
			});
			
            //修改窗口
			var codeWindow;
			codeWindow = new Ext.Window({
				layout : 'fit',
				width : 620,
				height : 400,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">作业修改</span>',
			    iconCls : 'page_edit_1Icon',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [formPanel],
				buttons : [{
					text : '修改',
					iconCls : 'acceptIcon',
					handler : function() {
						if (codeWindow.getComponent('codeForm').form.isValid()) {
							codeWindow.getComponent('codeForm').form.submit({
								url : './jobMange.ered?reqCode=jobMangerUpdate',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									codeWindow.hide();
									store.reload();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' + msg);
									codeWindow.getComponent('codeForm').form.reset();
								}
							});
						} else {
							// 表单验证失败
						}
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						codeWindow.hide();
					}
				}]
			});
			
			//增加 窗口
			var addcodeWindow;
			addcodeWindow = new Ext.Window({
				layout : 'fit',
				width : 620,
				height : 400,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">作业增加</span>',
				iconCls : 'page_addIcon',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [addformPanel],
				buttons : [{
					text : '增加',
					iconCls : 'acceptIcon',
					handler : function() {
						if (addcodeWindow.getComponent('addcodeForm').form.isValid()) {
							addcodeWindow.getComponent('addcodeForm').form.submit({
								url : './jobMange.ered?reqCode=jobMangerSave',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									addcodeWindow.hide();
									store.reload();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' + msg);
									addcodeWindow.getComponent('addcodeForm').form.reset();
								}
							});
						} else {
							// 表单验证失败
						}
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						addcodeWindow.hide();
					}
				}]
			});
			
			
		
			
			  function editjobmanger(){
				  var record = grid.getSelectionModel().getSelected();
					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请先选中要修改的项目');
						return;
					}
					record = grid.getSelectionModel().getSelected();
					
					formPanel.getForm().loadRecord(record);
					
					codeWindow.show();
					
					//alert(formPanel.getForm().findField("H0"));
					//alert(Ext.getCmp("HH2"));
					//Ext.getCmp("HH2").focus();
					
				
					
					//extjs defer
			   }
			  
				/**
				 * 删除
				 */
				function deljobmanger() {
					var rows = grid.getSelectionModel().getSelections();
					if (Ext.isEmpty(rows)) {
						Ext.Msg.alert('提示', '请先选中要删除的项目!');
						return;
					}
					var strChecked = jsArray2JsString(rows, 'trigger_name');
					var strChecked2 = jsArray2JsString(rows, 'trigger_group');
					Ext.Msg.confirm('请确认', '你真的要删除吗?', function(btn, text) {
								if (btn == 'yes') {
									Ext.Ajax.request({
												url : './jobMange.ered?reqCode=jobMangerDel',
												success : function(response) {
													store.reload();
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示', resultArray.msg);
												},
												failure : function(response) {
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示', resultArray.msg);
												},
												params : {
													strChecked : strChecked,
													strChecked2:strChecked2
												}
											});
								}
							});
				}
				
				/**
				 * 暂停
				 */
				function stopjobmanger() {
					var rows = grid.getSelectionModel().getSelections();
					if (Ext.isEmpty(rows)) {
						Ext.Msg.alert('提示', '请先选中项目!');
						return;
					}
					var strChecked = jsArray2JsString(rows, 'trigger_name');
					var strChecked2 = jsArray2JsString(rows, 'trigger_group');
					Ext.Msg.confirm('请确认', '你真的要暂停吗?', function(btn, text) {
								if (btn == 'yes') {
									Ext.Ajax.request({
												url : './jobMange.ered?reqCode=jobMangerStop',
												success : function(response) {
													store.reload();
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示', resultArray.msg);
												},
												failure : function(response) {
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示', resultArray.msg);
												},
												params : {
													strChecked : strChecked,
													strChecked2:strChecked2
												}
											});
								}
							});
				}
				
				function restorejobmanger() {
					var rows = grid.getSelectionModel().getSelections();
					if (Ext.isEmpty(rows)) {
						Ext.Msg.alert('提示', '请先选中项目!');
						return;
					}
					var strChecked = jsArray2JsString(rows, 'trigger_name');
					var strChecked2 = jsArray2JsString(rows, 'trigger_group');
					Ext.Msg.confirm('请确认', '你真的要恢复吗?', function(btn, text) {
								if (btn == 'yes') {
									Ext.Ajax.request({
												url : './jobMange.ered?reqCode=jobMangerRestore',
												success : function(response) {
													store.reload();
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示', resultArray.msg);
												},
												failure : function(response) {
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示', resultArray.msg);
												},
												params : {
													strChecked : strChecked,
													strChecked2:strChecked2
												}
											});
								}
							});
				}

				
				

			  
		});

