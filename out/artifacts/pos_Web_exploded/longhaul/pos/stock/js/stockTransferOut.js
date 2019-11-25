/**
 * 直营店货品调出
 * @author Xiashou
 * @since 2014/05/22
 */
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	
	var inwerk = "";
	
	// 定义列模型
	var cm = new Ext.grid.ColumnModel([
	{
		header : '删除', // 列标题
		dataIndex : 'deleteRow',
		width : 35,
		renderer : iconColumnRender
	}, {
		header : '批次', // 列标题
		dataIndex : 'charg', // 数据索引:和Store模型对应
		width : 90,
		editor : new Ext.grid.GridEditor(new Ext.form.TextField({
			allowBlank : false,
			name: 'charg',
			id: 'charg',
			enableKeyEvents : true,
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == Ext.EventObject.ENTER) {
						insertChargRow();
					}
				}
			}
		}))
	}, {
		header : '物料号', // 列标题
		dataIndex : 'matnr', // 数据索引:和Store模型对应
		width : 140
	}, {
		header : '商品名称',
		dataIndex : 'maktx',
		width : 170
	}, {
		header : '重量',
		dataIndex : 'labst',
		sortable : true,
		width : 70,
		editor : new Ext.grid.GridEditor(new Ext.form.TextField({
			id: 'labst',
			name: 'labst',
			allowBlank : false,
			enableKeyEvents : true,
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == Ext.EventObject.ENTER) {
//						insertChargRow();
					}
				}
			}
		}))
	}, {
		header : '单位',
		dataIndex : 'meins',
		width : 50
	}, {
		header : '标签价',
		dataIndex : 'kbetr',
		sortable : true,
		width : 90
	}, {
		header : '库位',
		dataIndex : 'lgort',
		width : 120
	}, {
		header : '图片', // 列标题
		dataIndex : 'zmatnrt',
		width : 40,
		renderer : function(v) {
			if(v){
				return "<img src='../../../sappic/" + v + "' width='30px' height='30px' " +
					"ext:qtip=\"<img src='../../../sappic/" + v + "' width='260px' height='260px'/>\" />";
			} else {
				return "<img src='./images/sample1.gif' width='30px' height='30px' " +
					"ext:qtip=\"<img src='./images/sample1.gif' width='260px' height='260px'/>\" />";
			}
		}
	} ]); 
	
	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
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
	
	// 定义一个Record
	var MyRecord = Ext.data.Record.create([{
			name : 'charg',
			type : 'string'
		}, {
			name : 'matnr',
			type : 'string'
		}, {
			name : 'maktx',
			type : 'string'
		}, {
			name : 'count',
			type : 'string'
		}, {
			name : 'hpzl',
			type : 'string'
		}, {
			name : 'meins',
			type : 'string'
		}, {
			name : 'kbetr',
			type : 'string'
		}, {
			name : 'lgort',
			type : 'string'
		}
	]);
	
	//查询门店
	var werksStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'stockSystem.ered?reqCode=getWerksByKeywords'
        }),
        reader: new Ext.data.JsonReader({
            root: 'ROOT',
            id: 'werks'
        }, [
			{name: 'werks', mapping: 'werks'},
			{name: 'name1', mapping: 'name1'}
        ])
    });
	
	// 翻页排序时带上查询条件
	werksStore.on('beforeload', function() {
		this.baseParams = {
			keyWords : Ext.getCmp('selectWerks').getValue()
		};
	});
	
	// 每页显示条数下拉选择框
	var typeCombo = new Ext.form.ComboBox({
		id : 'type',
		name : 'type',
		width : 110,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '请选择退货类型',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [[ 1, '镶嵌类' ], [ 2, '银饰类' ], [ 3, '玉石类' ], [ 4, '18K金类' ], 
			        [ 5, '铂金类' ], [ 6, '黄金类' ], [ 7, '钯金类' ], [ 9, '原材料' ]]
		}),
		valueField : 'value',
		displayField : 'text',
		editable : false,
		listeners:{
            "select":function(combo,record,index){
				if(record.data.value == 9){
					Ext.getCmp('labst').setDisabled(false);
				} else {
					Ext.getCmp('labst').setDisabled(true);
					grid.stopEditing();
				}
          	}
        }
	});
	
	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : [{
					text : '货品类型：'
		        },
		        	typeCombo , '-', 
	        	{
					text : '调入门店：'
		        }, {
					id : 'selectWerks',
					name : 'selectWerks',
					text : '选择门店',
					xtype : 'textfield'
				}, '-', 
				{
					text : '添加一行',
					iconCls : 'addIcon',
					handler : function() {
						var row = new MyRecord({});
						grid.stopEditing();
						store.insert(store.getCount(), row);
						grid.startEditing(store.getCount() - 1, 1);
					}
				}, '-',
				{
					text : '提 交',
					iconCls : 'acceptIcon',
					handler : function() {
						submitRows();
					}
				}
			]
	});
	
	var bbar = new Ext.Toolbar({
		items : [ '&nbsp;&nbsp;&nbsp;&nbsp;',{
			xtype : 'label',
			id : 'totalCount',
			text : '总数量：'
		}, '-', '&nbsp;&nbsp;' , {
			xtype : 'label',
			id : 'totalWeight',
			text : '总重量：'
		}, '-', '&nbsp;&nbsp;' ,{
			xtype : 'label',
			id : 'totalPrice',
			text : '总金额：'
		}]
	});
	
	// 表格实例
	var grid = new Ext.grid.EditorGridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height : 500,
//		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		tbar : tbar, // 表格工具栏
		bbar : bbar,// 下工具栏
		viewConfig : {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			// forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		if (fieldName == 'deleteRow' && columnIndex == 0) {
			Ext.Msg.confirm("提示", "确定删除吗？", function(e) {
				if (e == 'yes') {
					store.remove(record);
					showBbarData();
					//条目小于等于1时，启用类型选择框
					if(store.getCount() < 1){
						Ext.getCmp('type').setDisabled(false);
					} 
				}
			});
		}
	});
	
	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});
	
	// Custom rendering Template
    var resultTpl = new Ext.XTemplate(
        '<tpl for="."><div class="search-item">',
            '&nbsp;<span>{name1}</span>',
            '</br>&nbsp;{werks}',
        '</div></tpl>'
    );
	
	//查询门店下拉框    ** 由于有applyTo参数，所以必须在页面布局grid之后加载  **
	var searchCombo = new Ext.form.ComboBox({
		id : 'werks',
		name : 'werks',
        store: werksStore,
//        displayField:'title',
        typeAhead: false,
        loadingText: '查找中...',
        width: 170,
        minChars: 2,
//        pageSize: 3,
        hideTrigger:true,
        tpl: resultTpl,
        applyTo: 'selectWerks',
        itemSelector: 'div.search-item',
        onSelect: function(record){ // override default onSelect to do redirect
			Ext.getCmp('selectWerks').setValue(record.data.name1);
			inwerk = record.data.werks;
        }
    });
	
	var row = new MyRecord({});
	store.insert(0, row);
	grid.startEditing(0, 1);
	
	// 生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/delete.png'/></a>";
	}
	
	// 获取批次信息添加一行
	function insertChargRow() {
		var currCharg = Ext.getCmp('charg').getValue().trim();
		var typeValue = Ext.getCmp('type').getValue();
		
		//判断是否选择了退货类型
		if(Ext.isEmpty(typeValue)){
			Ext.Msg.alert("提示", "请先选择退货类型！");
			return false;
		}
		
		//检查批次号输入是否正确
		if(currCharg.length != 10){
			Ext.Msg.alert("提示", "请输入正确批次号！");
			return false;
		}
		
		//条目大于等于1时，禁用类型下拉框
		if(store.getCount() >= 1){
			Ext.getCmp('type').setDisabled(true);
		} 
		
		//判断批次是否重复录入
		for(var i = 0; i < store.getCount(); i++){
			var item = store.getAt(i).get("charg");
			if(item == currCharg && store.getCount() > 1){
				Ext.Msg.alert("提示", "该批次重复录入！");
				return false;
			}
		}
		
		//判断批次是否符合退货类型(原材料除外)
		if(!typeValue == 9){
			var flag = ifConformType(typeValue, currCharg);
			if(!flag){
				Ext.Msg.alert("提示", "该批次与退货类型不符！");
				return false;
			}
		}
		
		//判断是否有库存
		flag = getStoreByCharg(currCharg);
		if(!flag){
			Ext.Msg.alert("提示", "该批次库存不足！");
			return false;
		}
		
		//判断是否存在与其他未发货订单中
		var outid = ifOtherOrders(currCharg);
		if(!Ext.isEmpty(outid) && outid != ""){
			Ext.Msg.alert("提示", "该批次已存在于未发货订单 " + outid + " 中！");
			return false;
		}
		
		//获取批次信息
		Ext.Msg.wait('正在获取批次信息，请稍候...','提示'); 
		Ext.Ajax.request({
			url : 'stockSystem.ered?reqCode=getStockChargInfo',
			method : 'post',
			params : {
					charg : currCharg
			},
			timeout : 12000000,
			success : function(data) {
				Ext.Msg.hide();
				var myData = Ext.decode(data.responseText);
				if (myData == '') {
					Ext.Msg.alert("提示", "没有找到该批次信息！");
					return false;
				}
				var row = new MyRecord(myData[0]);
				var cell = grid.getSelectionModel().getSelectedCell();
				var record = store.getAt(cell[0]);			//当前行
				currRow = store.indexOf(record);   			//得到当前行号
				if (currRow < 0) currRow = 0; 				//没有任何记录时行号为不能为-1 
				if(currRow < store.getCount() - 1){			//当前行不为最后一行时，先删掉当前行再添加
					store.remove(record);
				} 
				store.insert(currRow, row);
				store.getAt(store.getCount() - 1).set('charg','');	//设置当前行批次为空
				grid.startEditing(store.getCount() - 1, 1);			//设置焦点
				showBbarData();
			},
			failure : function(){
				 Ext.Msg.hide();
				 Ext.Msg.alert("提示", "出现错误！");
			}
		});
	}
	
	function showBbarData(){
		Ext.getCmp('totalCount').setText('总数量：' + store.getCount() + ' ');
		Ext.getCmp('totalWeight').setText('总重量：' + store.sum('labst').toFixed(2) + ' ');
		Ext.getCmp('totalPrice').setText('总金额：¥ ' + store.sum('kbetr'));
	}
	
	//判断批次是否符合退货类型
	function ifConformType(type, charg){
		var flag = false;
		Ext.Ajax.request({
			url    : 'stockSystem.ered?reqCode=getKondmByCharg',
			method : 'post',
			async  : false, 		//设置为同步执行，非异步
			params : {
					charg : charg
			},
			timeout : 120000,
			success : function(data) {
				var kondm = data.responseText;
				if (kondm == '') {
					Ext.Msg.alert("提示", "没有找到该批次的商品定价组！");
					flag = false;
				} else {
					flag = conformType(type, kondm);
				}
			},
			failure : function(){
				 Ext.Msg.hide();
				 Ext.Msg.alert("提示", "出现错误！");
				 flag = false;
			}
		});
		return flag;
	}
	
	//判断是否存在与其他未发货订单中
	function ifOtherOrders(charg){
		var outid = "";
		Ext.Ajax.request({
			url    : 'stockSystem.ered?reqCode=getOtherOrdersByCharg',
			method : 'post',
			async  : false, 		//设置为同步执行，非异步
			params : {
				charg : charg
			},
			timeout : 120000,
			success : function(data) {
				outid = data.responseText;
				return outid;
			},
			failure : function(){
				 Ext.Msg.hide();
				 Ext.Msg.alert("提示", "出现错误！");
				 return outid;
			}
		});
		return outid;
	}
	
	function conformType(type, kondm){
		var flag = false;
		switch (type) {
			case 1 :
				switch (kondm){
					case '01' :
						flag = true;break;
					case '02' :
						flag = true;break;
					case '03' :
						flag = true;break;
				}
				break;
			case 2 :
				switch (kondm) {
					case '04' :
						flag = true;break;
					case '15' :
						flag = true;break;
				}
				break;
			case 3 :
				switch (kondm) {
					case '05' :
						flag = true;break;
					case '23' :
						flag = true;break;
				}
				break;
			case 4 :
				switch (kondm) {
					case '06' :
						flag = true;break;
				}
				break;
			case 5 :
				switch (kondm) {
					case '07' :
						flag = true;break;
				}
				break;
			case 6 :
				switch (kondm) {
					case '09' :
						flag = true;break;
					case '11' :
						flag = true;break;
					case '12' :
						flag = true;break;
					case '13' :
						flag = true;break;
					case '19' :
						flag = true;break;
					case '20' :
						flag = true;break;
				}
				break;
			case 7 :
				switch (kondm) {
					case '10' :
						flag = true;break;
				}
				break;
			case 8 :
				switch (kondm) {
					case '18' :
						flag = true;break;
				}
				break;
			case 9 :
				switch (kondm) {
					case '17' :
						flag = true;break;
				}
				break;
		}
		return flag;
	}
	
	//判断批次是否有库存
	function getStoreByCharg(charg){
		var flag = false;
		Ext.Ajax.request({
			url    : 'stockSystem.ered?reqCode=getStoreByCharg',
			method : 'post',
			async  : false, 		//设置为同步执行，非异步
			params : {
					charg : charg
			},
			timeout : 120000,
			success : function(data) {
				var charg = data.responseText;
				if (Ext.isEmpty(charg)) {
					Ext.Msg.alert("提示", "没有找到该批次的库存信息！");
					flag = false;
				} else {
					flag = true;
				}
			},
			failure : function(){
				 Ext.Msg.hide();
				 Ext.Msg.alert("提示", "出现错误！");
				 flag = false;
			}
		});
		return flag;
	}
	
	// 保存
	function submitRows() {
		if (inwerk == null || Ext.isEmpty(inwerk)){
			Ext.MessageBox.alert('提示', '请选择调入门店!');
			return;
		}
		var m = store.modified.slice(0); // 获取修改过的record数组对象
		if (Ext.isEmpty(m)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		var jsonItem = [];
		// 将record数组对象转换为简单Json数组对象
		Ext.each(m, function(item) {
			if(!Ext.isEmpty(item.data["matnr"])){
				jsonItem.push(item.data);
			}
		});
		if (Ext.isEmpty(jsonItem)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		Ext.Msg.confirm("提示", "确定提交调拨单吗?", function(e) {
			if (e == 'yes') {
				// 提交到后台处理
				Ext.Msg.wait('正在创建订单，请稍候...','提示'); 
				Ext.Ajax.request({
					url      : 'stockSystem.ered?reqCode=submitStockTransferOut',
					type     : 'post',
					dataType : 'json',
					cache    : false,
					params   : {
						type : Ext.getCmp('type').getValue(),
						inwerk : inwerk,
						jsonItem : Ext.encode(jsonItem)		// 系列化为Json资料格式传入后台处理
					},
					success : function(data) { 
						Ext.Msg.hide();
						var returnData = Ext.decode(data.responseText);
						Ext.Msg.alert("提示", returnData.message, function(e) {
							store.removeAll();
							Ext.getCmp('totalCount').setText('总数量： ');
							Ext.getCmp('totalWeight').setText('总重量： ');
							Ext.getCmp('totalPrice').setText('总金额：');
							Ext.getCmp('type').setDisabled(false);
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
});