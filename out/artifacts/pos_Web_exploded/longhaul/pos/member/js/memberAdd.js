Ext.onReady(function() {
	// 复选框
	// var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([rownum, {
				header : '修改', // 列标题
				dataIndex : 'edit',
				width : 35,
				renderer : iconColumnRender
			}, {
				header : '会员主数据号', // 列标题
				dataIndex : 'kunnr', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
				width : 90
			}, {
				header : '会员卡号',
				dataIndex : 'sort2',
				sortable : true,
				width : 90
				// 列宽
		}	, {
				header : '会员姓名',
				dataIndex : 'name1',
				sortable : true,
				width : 80
			}, {
				header : '会员级别',
				dataIndex : 'kondashow',
				sortable : true,
				width : 80
			}, {
				header : '入会日期',
				dataIndex : 'tel_number',// 'stcd1',
				sortable : true,
				hidden : true,
				width : 120
			}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
					url : 'memberSystem.ered?reqCode=getMemberInfoForNewMember&isactivate=n'
				}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [{
							name : 'kunnr'
						}, {
							name : 'loevm'
						},
//						{
//							name : 'tel_number'
//						},
						{
							name : 'name1'
						}, {
							name : 'name2'
						}, {
							name : 'gbdat'
						}, {
							name : 'zyjdz'
						}, {
							name : 'name3'
						}, {
							name : 'street'
						}, {
							name : 'post_code1'// 'pstlz'
						}, {
							name : 'telf1'
						}, {
							name : 'telf2'
						}, {
							name : 'anred'
						}, {
							name : 'werks'
						}, {
							name : 'regio'
						}, {
							name : 'telfx'
						}, {
							name : 'adrnr'
						}, {
							name : 'name_co'
						}, {
							name : 'sort1'
						}, {
							name : 'sort2'
						}, {
							name : 'fax_number'
						}, {
							name : 'str_suppl3'
						}, {
							name : 'abtnr'
						}, {
							name : 'location'
						}, {
							name : 'city2'
						}, {
							name : 'home_city'
						}, {
							name : 'remark'
						}, {
							name : 'smtp_addr'
						}, {
							name : 'bezei'
						}, {
							name : 'parau'
						}, {
							name : 'spras'
						}, {
							name : 'str_suppl1'
						}, {
							name : 'str_suppl2'
						}, {
							name : 'currdate'
						}, {
							name : 'zvip_flag'
						}, {
							name : 'str_suppl3'
						}, {
							name : 'extension1'
						}, {
							name : 'extension2'
						}, {
							name : 'zkdj'
						}, {
							name : 'zdjpj'
						}, {
							name : 'zdczd'
						}, {
							name : 'zndjf'
						}, {
							name : 'zjf'
						}, {
							name : 'konda'
						}, {
							name : 'kondashow'
						}, {
							name : 'zjfjl'
						}, {
							name : 'parge'
						}, {
							name : 'zjftz'
						}, {
							name : 'zydjf'
						}, {
							name : 'zgmpc'
						}, {
							name : 'zgmjs'
						}, {
							name : 'kunn2'
						}, {
							name : 'zdjrq'
						}, {
							name : 'name4'
						}, {
							name : 'zczr'
						}, {
							name : 'fax_number1'
						}, {
							name : 'comp_status'
						}, {
							name : 'pavip'
						}, {
							name : 'pavipname'
						}, {
							name : 'pafkt'
						}, {
							name : 'bryth'
						}])
	});
	// 门店信息
	var werks_store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
							url : 'memberSystem.ered?reqCode=getWerksInfo'
						}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
							root : 'ROOT' // Json中的列表数据根节点
						}, [{
									name : 'werks'
								}, {
									name : 'name1'
								}, {
									name : 'werksname'
								}])
			});

	werks_store.load();

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
				this.baseParams = {
				// zhyjb : Ext.getCmp('zhyjb').getValue(),
				// sortl : Ext.getCmp('sortl').getValue(),
				// used : Ext.getCmp('used').getValue(),
				// name1 : Ext.getCmp('name1').getValue(),
				// telf1 : Ext.getCmp('telf1').getValue()
				};
			});

	// 每页显示条数下拉选择框
	var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [[10, '10条/页'], [20, '20条/页'],
									[50, '50条/页'], [100, '100条/页'],
									[250, '250条/页'], [500, '500条/页']]
						}),
				valueField : 'value',
				displayField : 'text',
				value : '20',
				editable : false,
				width : 85
			});

	// 维护门店
	var kunn2_werks_combox = new Ext.form.ComboBox({
				hiddenName : 'kunn2',
				fieldLabel : '维护门店',
				triggerAction : 'all',
				mode : 'local',
				typeAhead : true,
				store : werks_store,
				valueField : 'werks',
				displayField : 'werksname',
				readOnly : true,
				anchor : '90%'
			});

	// 开办门店
	var name4_werks_combox = new Ext.form.ComboBox({
				hiddenName : 'name4',
				fieldLabel : '开办门店',
				triggerAction : 'all',
				mode : 'local',
				typeAhead : true,
				store : werks_store,
				valueField : 'werks',
				displayField : 'werksname',
				readOnly : true,
				anchor : '90%'
			});
//	// 会员卡类别
//	var card_category = new Ext.data.Store({
//				proxy : new Ext.data.HttpProxy({
//							url : 'memberSystem.ered?reqCode=getCardCategory'
//						}),
//				// 数据读取器
//				reader : new Ext.data.JsonReader({
//							root : 'ROOT' // Json中的列表数据根节点
//						}, [{
//									name : 'pafkt'
//								}, {
//									name : 'vtext'
//								}])
//			});
//	card_category.load();
//	var card_category_comb = new Ext.form.ComboBox({
//				hiddenName : 'pafkt',
//				fieldLabel : '会员性质',
//				emptyText : '请选择...',
//				triggerAction : 'all',
//				typeAhead : true,
//				store : card_category,
//				displayField : 'vtext',
//				valueField : 'pafkt',
//				lazyRender : true,
//				mode : 'local',
//				editable : false,
//				anchor : '90%'
//			});
//    //会员等级
//    var cardnature = new Ext.form.ComboBox({
//       hiddenName : 'pafkt',
//       fieldLabel : '会员等级',
//       emptyText : '请选择...',
//       triggerAction : 'all',
//       typeAhead : true,
//       store : new Ext.data.ArrayStore({
//           fields : ['name', 'value'],
//           data : [['特等', '01'], ['一等', '02'],['二等', '03'],['三等', '04']]
//       }),
//       displayField : 'name',
//       valueField : 'value',
//       lazyRender : true,
//       mode : 'local',
//       editable : false,
//       readOnly : true,
//       anchor : '90%'
//   });
//	// 婚姻状况
//	var maritalStatus = new Ext.form.ComboBox({
//				hiddenName : 'bryth',
//				fieldLabel : '婚姻状况',
//				emptyText : '请选择...',
//				triggerAction : 'all',
//				typeAhead : true,
//				store : new Ext.data.ArrayStore({
//							fields : ['name', 'value'],
//							data : [['已婚', '0001'], ['未婚', '0002'],
//									['单身', '0003']]
//						}),
//				displayField : 'name',
//				valueField : 'value',
//				lazyRender : true,
//				mode : 'local',
//				editable : false,
//				anchor : '90%',
//				listeners : {
//					select : function(combo, record, index) {
//						var v = record.data.value;
//						if (v == '0001') {
//							// Ext.getCmp('telf2').setVisible(true);//fieldLabel
//							// Ext.getCmp('telf2').getEl().up('.x-form-item').setDisplayed(true);
//							Ext.getCmp("telf2").show();
//						} else {
//							Ext.getCmp("telf2").hide();
//						}
//
//					}
//				}
//			});
	var number = parseInt(pagesize_combo.getValue());
	// 改变每页显示条数reload数据
	pagesize_combo.on("select", function(comboBox) {
				bbar.pageSize = parseInt(comboBox.getValue());
				queryCatalogItem();
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
							text : '刷新',
							iconCls : 'page_refreshIcon',
							handler : function() {
								store.reload();
							}
						}, '-', {
							text : '查询条件',
							iconCls : 'arrow_switchIcon',
							handler : function() {
								firstWindow.show();
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
								var record = grid.getSelectionModel()
										.getSelected();
								var assistant_name = record
										.get('assistant_name');
								Ext.MessageBox.alert('提示', assistant_name);
							}
						}, {
							text : '导出列表',
							iconCls : 'page_excelIcon',
							handler : function() {
								// 获取当前选择行对象
								var record = grid.getSelectionModel()
										.getSelected();
								var assistant_name = record
										.get('assistant_name');
								Ext.MessageBox.alert('提示', assistant_name);
							}
						}]
			});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				height : 500,
				frame : true,
				autoScroll : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				// sm : sm, // 复选框
				tbar : tbar, // 表格工具栏
				bbar : bbar,// 分页工具栏
				viewConfig : {
	// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : true
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

	// 是否默认选中第一行数据
	bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();

			});

	// 页面初始自动查询数据
	// store.load({params : {start : 0,limit : bbar.pageSize}});

	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
				var store = pGrid.getStore();
				var record = store.getAt(rowIndex);
				var fieldName = pGrid.getColumnModel()
						.getDataIndex(columnIndex);
				// columnIndex为小画笔所在列的索引,索引从0开始
				// 这里要非常注意!!!!!
				if (fieldName == 'edit' && columnIndex == 1) {
					// var assistant_name =
					// record.get("assistant_name");
					// 到此你就可以继续做其他任何事情了
					// Ext.MessageBox.alert('提示', assistant_name);

					secondWindow.show();
					secondForm.form.loadRecord(record);
				}

				if (fieldName == 'showdetail' && columnIndex == 2) {
					// var assistant_name =
					// record.get("assistant_name");
					// 到此你就可以继续做其他任何事情了
					// Ext.MessageBox.alert('提示', assistant_name);
					var kunner = record.get('kunnr');
					// alert(record.get('kunnr'));
					thirdWindow.show();
					store2.load({
								params : {
									kunner : kunner
								},
								callback : function(records, options, success) {
									if (success == true) {
										if (records.length == 0) {
											Ext.Msg.alert('提示', '没有记录！！');
											thirdWindow.hide();
										}

									} else {
										Ext.Msg.alert('提示', '抓取信息出现错误');
									}
								}
							});

				}

			});

	// // 监听单元格双击事件
	// grid.on("celldblclick", function(pGrid, rowIndex, columnIndex, e)
	// {
	// var record = pGrid.getStore().getAt(rowIndex);
	// var fieldName = pGrid.getColumnModel()
	// .getDataIndex(columnIndex);
	// var cellData = record.get(fieldName);
	// // Ext.MessageBox.alert('提示', cellData);
	// });
	//
	// // 监听行双击事件
	// grid.on('rowdblclick', function(pGrid, rowIndex, event) {
	// // 获取行数据集
	// var record = pGrid.getStore().getAt(rowIndex);
	// // 获取单元格数据集
	// var data = record.get("assistant_name");
	// Ext.MessageBox.alert('提示', "双击行的索引为:" + rowIndex);
	// });
	//
	// // 给表格绑定右键菜单
	// grid.on("rowcontextmenu", function(grid, rowIndex, e) {
	// e.preventDefault(); // 拦截默认右键事件
	// grid.getSelectionModel().selectRow(rowIndex); // 选中当前行
	// contextmenu.showAt(e.getXY());
	// });

	// 布局模型
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});

	initData();
	function initData() {
		store.clearData();
		store.load({
					params : {
						start : 0,
						limit : bbar.pageSize
					},
					callback : function(records, options, success) {
						if (success == true) {
							if (records.length == 0)
								Ext.Msg.alert('提示', '没有数据');
						} else
							Ext.Msg.alert('提示', '出现错误');

					}
				});
	}
	// queryCatalogItem();
	// 查询表格数据
	function queryCatalogItem() {
		store.clearData();
		store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						zhyjb : Ext.getCmp('zhyjb').getValue(),
						sort2 : Ext.getCmp('sort2').getValue(),
						name1 : Ext.getCmp('name1').getValue()
					},
					callback : function(records, options, success) {
						if (success == true) {
							if (records.length == 0)
								Ext.Msg.alert('提示', '没有数据');
						} else
							Ext.Msg.alert('提示', '出现错误');

					}
				});
	}

	// 生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/edit1.png'/></a>";;
	}
	// 生成一个图标列
	function iconColumnRender2(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/application_view_list.png'/></a>";;
	}

	var memberTypeCombo = new Ext.form.ComboBox({
		// hiddenName : 'zhyjb',
		id : 'zhyjb',
		fieldLabel : '会员卡类别',
		emptyText : '请选择...',
		triggerAction : 'all',
		typeAhead : true,
		store : new Ext.data.ArrayStore({
					fields : ['name', 'value'],
					data : [['无限定', ''], ['畅享卡', '01'], ['EEGO卡', '02'],
							['金典卡', '03'], ['六福会员卡', '06'], ['兆亮会员卡', '10']]
				}),
		displayField : 'name',
		valueField : 'value',
		lazyRender : true,
		mode : 'local',
		editable : false,
		// value : '530101',
		anchor : '100%'
			// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
			/*
			 * listeners : { 'render' : function(obj) { areaStore.load();
			 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
			 */
		});

	var firstForm = new Ext.form.FormPanel({
				id : 'firstForm',
				name : 'firstForm',
				labelWidth : 110, // 标签宽度
				// frame : true, //是否渲染表单面板背景色
				defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [memberTypeCombo, {
							fieldLabel : '会员卡号',
							// name : 'sortl',
							id : 'sort2',
							anchor : '100%'
						}, {
							fieldLabel : '会员姓名',
							// name : 'name1',
							id : 'name1',
							anchor : '100%'
						}]
			});

	var firstWindow = new Ext.Window({
				title : '<span class="commoncss">选择查询条件</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 350, // 窗口宽度
				height : 280, // 窗口高度
				closable : true, // 是否可关闭
				collapsible : true, // 是否可收缩
				maximizable : true, // 设置是否可以最大化
				border : false, // 边框线设置
				constrain : true, // 设置窗口是否可以溢出父容器
				pageY : 60, // 页面定位Y坐标
				pageX : document.body.clientWidth / 3 - 300 / 2, // 页面定位X坐标
				items : [firstForm], // 嵌入的表单面板
				closeAction : 'hide',
				buttons : [{ // 窗口底部按钮配置
					text : '查询', // 按钮文本
					iconCls : 'tbar_synchronizeIcon', // 按钮图标
					handler : function() { // 按钮响应函数
						queryCatalogItem();
						firstWindow.hide();
					}
				}, {	// 窗口底部按钮配置
							text : '重置', // 按钮文本
							iconCls : 'tbar_synchronizeIcon', // 按钮图标
							handler : function() { // 按钮响应函数
								firstForm.form.reset();
							}
						}]
			});

	var memberTypeCombo2 = new Ext.form.ComboBox({
		hiddenName : 'konda',
		fieldLabel : '会员卡类别',
		emptyText : '请选择...',
		triggerAction : 'all',
		typeAhead : true,
		store : new Ext.data.ArrayStore({
					fields : ['name', 'value'],
					data : [['畅享卡', '01'], ['EEGO卡', '02'], ['金典卡', '03'],
							['未指定', '04'], ['六福会员卡', '06'], ['兆亮会员卡', '10']]
				}),
		displayField : 'name',
		valueField : 'value',
		lazyRender : true,
		mode : 'local',
		readOnly : true,
		// disabled : true,
		// value : '530101',
		anchor : '90%'
			// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
			/*
			 * listeners : { 'render' : function(obj) { areaStore.load();
			 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
			 */
		});

	var gender = new Ext.form.ComboBox({
		hiddenName : 'parge',
		fieldLabel : '性别',
		emptyText : '请选择...',
		triggerAction : 'all',
		typeAhead : true,
		store : new Ext.data.ArrayStore({
					fields : ['name', 'value'],
					data : [['男', '1'], ['女', '2']]
				}),
		displayField : 'name',
		valueField : 'value',
		lazyRender : true,
		mode : 'local',
		editable : false,
		// disabled : true,
		// value : '530101',
		anchor : '90%'
			// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
			/*
			 * listeners : { 'render' : function(obj) { areaStore.load();
			 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
			 */
		});

	var abtnr = new Ext.form.ComboBox({
		hiddenName : 'abtnr',
		fieldLabel : '职业',
		emptyText : '请选择...',
		triggerAction : 'all',
		typeAhead : true,
		store : new Ext.data.ArrayStore({
					fields : ['name', 'value'],
					data : [['学生', '0001'], ['银行职员', '0002'], ['企业行政类', '0003'],
							['自由职业', '0004'], ['公务员', '0005'], ['企业管理', '0006'],
							['个体', '0007'], ['家庭主妇', '0008'], ['教师', '0009'],
							['律师及会计事务所从业人员', '0010'], ['医疗行业', '0011'], ['其他', '0012']]
//					data : [['律师及会计事务所从业人员','0001'],['银行职员','0002'],['公务员','0003'],['企业行政类','0004'],
//					        ['教师','0005'],['医疗行业','0006'],['自由职业','0007'],['其它','0008']]	
				}),
		displayField : 'name',
		valueField : 'value',
		lazyRender : true,
		mode : 'local',
		editable : false,
		// disabled : true,
		// value : '530101',
		anchor : '90%'
			// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
			/*
			 * listeners : { 'render' : function(obj) { areaStore.load();
			 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
			 */
		});

	// 希望提供的服务多选框
	var location = new Ext.ux.form.LovCombo({
				id : 'location',
				name : 'location',
				anchor : '90%',
				hideOnSelect : true,
				maxHeight : 200,
				editable : false,
				fieldLabel : '希望提供的服务',
				emptyText : '请选择...',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'privGroup'],
							data : [['流行资讯', '流行资讯'], ['会刊', '会刊'],
									['生日PARRT', '生日PARRT'], ['沙龙活动', '沙龙活动'],
									['消费指南', '消费指南'], ['其他', '其他']]
						}),
				triggerAction : 'all',
				valueField : 'id',
				displayField : 'privGroup',
				mode : 'local',
				beforeBlur : function() {
				}
			});

	// 平时的穿着风格多选框
//	var extension2 = new Ext.ux.form.LovCombo({
//				id : 'extension2',
//				name : 'extension2',
//				anchor : '90%',
//				hideOnSelect : true,
//				maxHeight : 200,
//				editable : false,
//				fieldLabel : '平时的穿着风格',
//				emptyText : '请选择...',
//				store : new Ext.data.SimpleStore({
//							fields : ['id', 'privGroup'],
//							data : [['休闲型', '休闲型'], ['优雅型', '优雅型'],
//									['浪漫型', '浪漫型'], ['古典型', '古典型'],
//									['前卫型', '前卫型'], ['其他', '其他']]
//						}),
//				triggerAction : 'all',
//				valueField : 'id',
//				displayField : 'privGroup',
//				mode : 'local',
//				beforeBlur : function() {
//				}
//			});
	
	//您选择兆亮珠宝和EEGO品牌的理由
	var extension2 = new Ext.ux.form.LovCombo({
		id : 'extension2',
		name : 'extension2',
		anchor : '90%',
		hideOnSelect : true,
		maxHeight : 200,
		editable : false,
		fieldLabel : '您选择兆亮珠宝和EEGO品牌的理由',
		emptyText : '请选择...',
		store : new Ext.data.SimpleStore({
					fields : ['id', 'privGroup'],
					data : [['品牌知名度', '品牌知名度'], ['店内服务和环境', '店内服务和环境'],
							['朋友推荐', '朋友推荐'], ['商品价格', '商品价格'],['商品品质', '商品品质']]
				}),
		triggerAction : 'all',
		valueField : 'id',
		displayField : 'privGroup',
		mode : 'local',
		beforeBlur : function() {
		}
	});

	// 喜欢购物的地点多选框
	var str_suppl3 = new Ext.ux.form.LovCombo({
				id : 'str_suppl3',
				name : 'str_suppl3',
				anchor : '90%',
				hideOnSelect : true,
				maxHeight : 200,
				editable : false,
				fieldLabel : '喜欢购物的地点',
				emptyText : '请选择...',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'privGroup'],
//							data : [['购物中心', '购物中心'],['大型商场', '大型商场'], ['购物中心', '购物中心'],
//									['专卖店', '专卖店'], ['会所', '会所'], ['其他', '其他']]
							data : [['购物中心','购物中心'],['百货商场','百货商场'],['专卖店','专卖店'],
							        ['会所','会所'],['网购','网购'],['其它','其它']]
						}),
				triggerAction : 'all',
				valueField : 'id',
				displayField : 'privGroup',
				mode : 'local',
				beforeBlur : function() {
				}
			});

	// 购买首饰--自用多选框
	var name_co = new Ext.ux.form.LovCombo({
				id : 'name_co',
				name : 'name_co',
				anchor : '90%',
				hideOnSelect : true,
				maxHeight : 200,
				editable : false,
				fieldLabel : '购买首饰--自用',
				emptyText : '请选择...',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'privGroup'],
							data : [['订婚', '订婚'],['结婚', '结婚'], ['晚装', '晚装'],
									['平时配戴', '平时配戴'], ['收藏', '收藏'],['其他', '其他']]
						}),
				triggerAction : 'all',
				valueField : 'id',
				displayField : 'privGroup',
				mode : 'local',
				beforeBlur : function() {
				}
			});
	// 接受资讯方式多选框
	var city2 = new Ext.ux.form.LovCombo({
				id : 'city2',
				name : 'city2',
				anchor : '90%',
				hideOnSelect : true,
				maxHeight : 200,
				editable : false,
				fieldLabel : '接受资讯方式',
				emptyText : '请选择...',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'privGroup'],
							data : [['微信', '微信'],['店内宣传册', '店内宣传册'], ['手机短信', '手机短信'], 
							        ['网站', '网站'],['电话', '电话'], ['其他', '其他']]
						}),
				triggerAction : 'all',
				valueField : 'id',
				displayField : 'privGroup',
				mode : 'local',
				beforeBlur : function() {
				}
			});
//	// 认识兆亮途径多选框
//	var extension1 = new Ext.ux.form.LovCombo({
//				id : 'extension1',
//				name : 'extension1',
//				anchor : '90%',
//				hideOnSelect : true,
//				maxHeight : 200,
//				editable : false,
//				fieldLabel : '认识兆亮途径',
//				emptyText : '请选择...',
//				store : new Ext.data.SimpleStore({
//							fields : ['id', 'privGroup'],
//							data : [['朋友', '朋友'], ['商场', '商场'], ['杂志', '杂志'],
//									['电视', '电视'], ['报纸', '报纸'], ['网络', '网络'],
//									['电梯广告', '电梯广告'], ['地铁', '地铁'],
//									['其他', '其他']]
//						}),
//				triggerAction : 'all',
//				valueField : 'id',
//				displayField : 'privGroup',
//				mode : 'local',
//				beforeBlur : function() {
//				}
//			});
	// 喜欢的珠宝品种多选框
	var str_suppl2 = new Ext.ux.form.LovCombo({
				id : 'str_suppl2',
				name : 'str_suppl2',
				anchor : '90%',
				hideOnSelect : true,
				maxHeight : 200,
				editable : false,
				fieldLabel : '喜欢的珠宝品种',
				emptyText : '请选择...',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'privGroup'],
							data : [['钻石镶嵌', '钻石镶嵌'], ['K金饰品', 'K金饰品'],
									['黄金饰品', '黄金饰品'], ['彩宝饰品', '彩宝饰品'],
									['翡翠饰品', '翡翠饰品'], ['其他', '其他']]
						}),
				triggerAction : 'all',
				valueField : 'id',
				displayField : 'privGroup',
				mode : 'local',
				beforeBlur : function() {
				}
			});

	// 购买首饰--礼物多选框
	var str_suppl1 = new Ext.ux.form.LovCombo({
				id : 'str_suppl1',
				name : 'str_suppl1',
				anchor : '90%',
				hideOnSelect : true,
				maxHeight : 200,
				editable : false,
				fieldLabel : '购买首饰--礼物',
				emptyText : '请选择...',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'privGroup'],
							data : [['爱人', '爱人'], ['亲人', '亲人'], ['朋友', '朋友'],
									['同事', '同事'], ['其他', '其他']]
						}),
				triggerAction : 'all',
				valueField : 'id',
				displayField : 'privGroup',
				mode : 'local',
				beforeBlur : function() {
				}
			});

	// 推荐人卡号
	var suggestText = new Ext.form.TextField({
				fieldLabel : '推荐人卡号',
				xtype : 'textfield',
				name : 'fax_number',
				id : 'fax_number',
				anchor : '90%',
				enableKeyEvents : true,
				listeners : {
					specialkey : function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							getvipbyuser_1();
						}
					}
				}
			});
	// suggestText.render("suggest_div");
	var secondForm = new Ext.form.FormPanel({
				id : 'secondForm',
				name : 'secondForm',
				labelWidth : 110, // 标签宽度
				autoScroll : true,
				// frame : true, // 是否渲染表单面板背景色
				// defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [{
					layout : 'column',
					border : false,
					items : [{
						columnWidth : .5,
						layout : 'form',
						border : false,
						items : [
								memberTypeCombo2,
								{
									fieldLabel : '会员主数据号', // 标签
									name : 'kunnr',
									xtype : 'textfield',
									hidden : true,
									anchor : '90%' // 宽度百分比
								},
								{
									fieldLabel : '会员卡号',
									xtype : 'textfield',
									name : 'sort2',
									allowBlank : false,
									readOnly : true,
									anchor : '90%'
								},
								{
									fieldLabel : '会员姓名',
									xtype : 'textfield',
									name : 'name1',
									id : 'name1',
									allowBlank : false,
									anchor : '90%'
								},
								gender,
								abtnr,
								{
									fieldLabel : '手机号码',
									xtype : 'textfield',
									name : 'sort1',// 'telf2',
									id : 'mobilphone',
									//allowBlank : false,
									maxLength : 11,
									minLength : 11,
									anchor : '90%'
								},
								{
									fieldLabel : '固定电话',
									xtype : 'textfield',
									name : 'telf1',
									id : 'telephone',
									regex : /\d{2,5}-\d{7,8}/,
									regexText : '固定电话号码格式不正确,区号必须是2到5位,号码必须7到8位',
									anchor : '90%'
								}, name_co, str_suppl1, extension2,str_suppl2, str_suppl3, location, city2
							]
					}, {
						columnWidth : .5,
						layout : 'form',
						border : false,
						items : [//cardnature, //maritalStatus, 
						         {
									fieldLabel : '结婚纪念日',
									xtype : 'datefield',
									name : 'telf2',// 'stcd2',
									id : 'telf2',
									format : 'Y-m-d',
									value : '1900-01-01',
									// hidden: true,
									// hideLabel:true,
									anchor : '90%'
								}, {
									fieldLabel : '出生日期',
									xtype : 'datefield',
									name : 'gbdat',// 'name3',
									value : '1900-01-01',
									format : 'Y-m-d',
									anchor : '90%'
								}, {
									fieldLabel : '入会日期',
									xtype : 'datefield',
									value : new Date(),
									name : 'tel_number',
									format : 'Y-m-d',
									anchor : '90%'
								}, kunn2_werks_combox, name4_werks_combox, {
									fieldLabel : '电子信箱',
									xtype : 'textfield',
									vtype : 'email',
									name : 'smtp_addr',
									anchor : '90%'
								}, {
									fieldLabel : '微信号',
									xtype : 'textfield',
									name : 'fax_number1',
									id : 'fax_number1',
									anchor : '90%'
//									enableKeyEvents : true,
//									listeners : {
//										specialkey : function(field, e) {
//											if (e.getKey() == Ext.EventObject.ENTER) {
//												getvipbyuser_2();
//											}
//										}
//									}
								}, {
									fieldLabel : '微博',
									xtype : 'textfield',
									name : 'function',
									id : 'function',
									anchor : '90%'
								}, {
									fieldLabel : '邮政编码',
									xtype : 'textfield',
									name : 'post_code1',// 'pstlz',
									//allowBlank : false,
									maxLength : 6,
									minLength : 6,
									anchor : '90%'
								}, {
									fieldLabel : '邮寄地址',
									xtype : 'textfield',
									name : 'street',
									anchor : '90%'
								}, suggestText, {
									fieldLabel : '柜台办理人',
									xtype : 'textfield',
									name : 'name2',
									anchor : '90%'
								}, {
									fieldLabel : '备注',
									xtype : 'textfield',
									name : 'parau',
									anchor : '90%'
								}
						// , {
						// header : '会员卡状态',
						// dataIndex :'parvo',// 'stcd1',
						// sortable : true,
						// hidden: true,
						// width : 120
						// }
						]
					}]
				}]
			});

	var secondWindow = new Ext.Window({
		title : '<span class="commoncss">添加会员信息</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 650, // 窗口宽度
		height : 460, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 3 - 300 / 2, // 页面定位X坐标
		items : [secondForm], // 嵌入的表单面板
		closeAction : 'hide',
		buttons : [{ // 窗口底部按钮配置
			text : '更新', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				if(Ext.getCmp("mobilphone").getValue()=='' && Ext.getCmp("telephone").getValue() == ''){
						Ext.Msg.alert("提示","手机号码和固定电话号码不能同时为空！");	
						return;
					}
				if(Ext.getCmp('name1').getValue() == '' || Ext.getCmp('name1').getValue() == '未激活会员卡'){
					Ext.Msg.alert("提示","会员姓名为录入！");
					return;
				}
				Ext.Msg.confirm("提示", "确定吗？", function(btn, text) {
					if (btn == "yes") {
						secondForm.form.submit({
									url : 'memberSystem.ered?reqCode=updateMember&addnew=y',
									waitTitle : '提示',
									method : 'POST',
									waitMsg : '正在处理数据,请稍候...',
									params : {
										'parvo' : '1'
									},
									success : function(form, action) {
										Ext.Msg.alert("提示", action.result.msg);
										secondForm.form.reset();
										queryCatalogItem();
										secondWindow.hide();
										store.reload();
									},
									failure : function(form, action) {
										Ext.Msg.alert("提示", action.result.msg);
									}
								});
					}
				});
			}
		}, {	// 窗口底部按钮配置
					text : '重置', // 按钮文本
					iconCls : 'tbar_synchronizeIcon', // 按钮图标
					handler : function() { // 按钮响应函数
						secondForm.form.reset();
						// alert(Ext.getCmp('location').getValue());
					}
				}]
	});

	// 推荐人
	function getvipbyuser_1() {
		var str = escape(document.getElementById("fax_number").value);
		Ext.Ajax.request({
					url : 'memberSystem.ered?reqCode=getVipRecord&option=user',
					method : 'GET',
					params : {
						vipid : str,
						start : 0,
						limit : bbar.pageSize
					},
					success : function(response) {
						if (response.responseText == '') {
							Ext.Msg.alert('提示', '输入推荐人卡号不存在!');
							return false;
						} else {
							var jsonObj = Ext.util.JSON
									.decode(response.responseText);
							// Ext.getCmp('telf1').setValue(jsonObj.sj);
							if (jsonObj.sj == '') {
								Ext.Msg.alert('提示', '推荐人电话不存在!');
								return false;
							}
							document.getElementById("fax_number1").value = jsonObj.sj;
						}
					}
				});
	}
//	function getvipbyuser_2() {
//		var str = escape(document.getElementById("fax_number1").value);
//		Ext.Ajax.request({
//					url : 'memberSystem.ered?reqCode=getVipRecord&option=user',
//					method : 'GET',
//					params : {
//						tel : str,
//						start : 0,
//						limit : bbar.pageSize
//					},
//					success : function(response) {
//						if (response.responseText == '') {
//							Ext.Msg.alert('提示', '输入推荐人电话不存在!');
//							return false;
//						} else {
//							var jsonObj = Ext.util.JSON
//									.decode(response.responseText);
//							if (jsonObj.yhkh == '') {
//								Ext.Msg.alert('提示', '推荐人卡号不存在!');
//								return false;
//							}
//							document.getElementById("fax_number").value = jsonObj.hykh;
//						}
//					}
//				});
//	}
	// 联想功能
	function handleSearchSuggest() {
		var str = escape(document.getElementById("fax_number").value);
		Ext.Ajax.request({
			url : 'memberSystem.ered?reqCode=getVipRecord&option=user',
			method : 'GET',
			params : {
				searchText : str,
				start : 0,
				limit : bbar.pageSize
			},
			success : function(response) {
				var suggestText = document.getElementById("fax_number");
				// alert(jsonResult.TOTALCOUNT+'总数');
				var datas = Ext.decode(response.responseText);
				for (ROOT in datas) { // json数组的最外层对象
					Ext.each(datas[ROOT], function(items) {
						Ext.each(items, function(item) {
							alert(item.name1 + "");
							var s = '<div onmouseover="javascript:suggestOver(this);"';
							s += ' onmouseout="javascript:suggestOut(this);" ';
							s += ' onclick="javascript:setSearch(this.innerHTML);" ';
							s += ' class="suggest_link">' + item.name1
									+ '</div>';
							suggestText.innerHTML += s;
								// TODO: 自己的逻辑处理
						});
					});
					suggestText.style.display = "block";
				}
				// else {
				// suggestText.style.display = "none";
				// }

			}
		});
	}

});