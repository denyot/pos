/**
 * 表格综合示例
 * 
 * @author XiongChun
 * @since 2010-10-20
 */
 
Ext.onReady(function() {
    // 复选框
    // var sm = new Ext.grid.CheckboxSelectionModel();
	
	Ext.data.Connection.prototype.timeout='300000';
	
    // 定义自动当前页行号
    var rownum = new Ext.grid.RowNumberer({
        header : 'NO',
        width : 28
    });

    // 定义列模型ru
    var cm = new Ext.grid.ColumnModel([rownum,{
        header : '完整状态',
        dataIndex : 'comp_status',
        sortable : true,
        width : 60
    }, {
        header : '修改', // 列标题
        dataIndex : 'edit',
        width : 35,
        renderer : iconColumnRender
    }, {
        header : '销售', // 列标题
        dataIndex : 'showdetail',
        width : 35,
        renderer : iconColumnRender2
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
    },  {
        header : '会员级别',
        dataIndex : 'kondashow',
        sortable : true,
        width : 80
    } , {
        header : '手机号码',
        dataIndex : 'sort1',
        sortable : true,
        width : 120
    }, {
        header : '固定电话',
        dataIndex : 'telf1',
        sortable : true,
        width : 120
    }, {
        header : '入会日期',
        dataIndex :'tel_number',// 'stcd1',
        sortable : true,
        width : 120
    }, {
        header : '生日',
        dataIndex :'gbdat',// 'stcd1',
        sortable : true,
        width : 120,
        renderer:function(value){ 
    		return  Ext.util.Format.date(value, 'm-d');
    	}
    }, {
        header : '会员积分',
        dataIndex : 'zjf',
        sortable : true,
        width : 120
    }, {
    	header : '消费积分',
    	//dataIndex : 'costjf',
	dataIndex : 'zhyjf',
    	sortable : true,
    	width : 120
    }, {
        header : '消费总金额',
        dataIndex : 'totalmoney',
        sortable : true,
        width : 120
    },{
        header : '审批状态',
        dataIndex : 'pavipname',
        sortable : true,
        width : 120
    },{
    	header : '原卡号',
    	dataIndex : 'oldcard',
    	sortable : true,
    	width : 120
    }]);

    /**
	 * 数据存储
	 */
    var store = new Ext.data.Store({
        // 获取数据的方式
        proxy : new Ext.data.HttpProxy({
            url : 'memberSystem.ered?reqCode=getMemberInfo&isactivate=y'
        }),
        // 数据读取器
        reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT', // 记录总数
            root : 'ROOT' // Json中的列表数据根节点
        }, [{
            name : 'kunnr'
        }, {
            name : 'loevm'
        }, {
            name : 'tel_number'
        }, {
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
            name : 'post_code1'//'pstlz'
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
            name : 'zjf',
            type : 'int'
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
        },{
            name : 'fax_number1'
        },{
            name : 'function'
        }, {
            name : 'comp_status'
        }, {
            name : 'pavip'
        },{
            name : 'pavipname'
        }, {
            name : 'pafkt'
        }, {
            name : 'bryth'
        }, {
            name : 'parvo'
        }, {
            name : 'totalmoney'
        }, {
            //name : 'costjf'
	    name : 'zhyjf',
	    type : 'int'
        }, {
            name : 'oldcard'
        }])
    });

    // 会员消费情况列模型
    var cm2 = new Ext.grid.ColumnModel([rownum, {
        header : '查看', // 列标题
        dataIndex : 'showorder',
        width : 35,
        renderer : iconColumnRender3
    },{
        header : '订单号',
        dataIndex : 'salesorderid',
        hidden : true,
        sortable : true,
        width : 120
    }, {
        header : '订单号',
        dataIndex : 'sapsalesorderid',
        sortable : true,
        editor : new Ext.form.TextField(),
        width : 90
    }, {
        header : '购买数量', // 列标题
        dataIndex : 'quantity',
        sortable : true,// 是否可排序
        width : 60
    }, {
        header : '日期 ', // 列标题
        dataIndex : 'saledate', // 数据索引:和Store模型对应
        sortable : true,// 是否可排序
        width : 90
    }, {
        header : '客户编码', // 列标题
        dataIndex : 'customerid',
        hidden : true,
        width : 100
    }, {
        header : '金额',
        dataIndex : 'totalmoney',
        sortable : true,
        width : 60
    // 列宽
    }, {
        header : '地点',
        dataIndex : 'storeidstr',
        sortable : true,
        width : 120
    }, {
        header : '名称',
        dataIndex : 'vipname',
        sortable : true,
        width : 90
    }, {
        header : '类型',
        dataIndex : 'ordertypestr',
        sortable : true,
        width : 160
    }, {
        header : '是否回头',
        dataIndex : 'isagain',
        sortable : true,
        width : 90
    }]);
    
    // 会员消费情况数据
    var store2 = new Ext.data.Store({
        // 获取数据的方式
        proxy : new Ext.data.HttpProxy({
            url : 'memberSystem.ered?reqCode=getMemberConsumDetail'
        }),
        // 数据读取器
        reader : new Ext.data.JsonReader({
            root : 'ROOT' // Json中的列表数据根节点
        }, [{
            name : 'salesorderid'
        }, {
            name : 'operatedatetime'
        }, {
            name : 'sapsalesorderid'
        }, {
            name : 'ordertype'
        }, {
            name : 'ordertypestr'
        }, {
            name : 'salepromotioncode'
        }, {
            name : 'orderreason'
        }, {
            name : 'orderreasonstr'
        }, {
            name : 'storeid'
        }, {
            name : 'storeidstr'
        }, {
            name : 'operator'
        }, {
            name : 'remarks'
        }, {
            name : 'depositid'
        }, {
            name : 'saledate'
        }, {
            name : 'customerid'
        }, {
            name : 'cashcoupon'
        }, {
            name : 'salesclerk'
        }, {
            name : 'storereceipt'
        }, {
            name : 'paymentaccno'
        }, {
            name : 'amountcollected'
        }, {
            name : 'paymentmethod'
        }, {
            name : 'vipcard'
        }, {
            name : 'orderflag'
        }, {
            name : 'deliverydate'
        }, {
            name : 'cardexpired'
        }, {
            name : 'totalmoney'
        }, {
            name : 'resalesorderid'
        }, {
            name : 'vipname'
        }, {
            name : 'statementid'
        }, {
            name : 'deliveryordernumber'
        }, {
            name : 'materialdocumber'
        }, {
            name : 'insertdatetime'	
        }, {
            name : 'cash'
        }, {
            name : 'unionpay'
        }, {
            name : 'shoppingcard'
        }, {
            name : 'subscription'
        }, {
            name : 'referrer'
        }, {
            name : 'thankintegral'
        }, {
            name : 'quantity'
        }, {
            name : 'isagain'
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
    //审核状态
    var approval_status_comb = new Ext.form.ComboBox({
        hiddenName : 'pavip',
        id : 'pavip',
        fieldLabel : '审核状态',
        emptyText : '请选择...',
        triggerAction : 'all',
        typeAhead : true,
        store : new Ext.data.ArrayStore({
            fields : ['vtext', 'pavip'],
            data : [['未审批', '1'], ['已审批', '2']]
        }),
        displayField : 'vtext',
        valueField : 'pavip',
        lazyRender : true,
        mode : 'local',
        editable : false,
        anchor : '90%'
    });
    // 翻页排序时带上查询条件
    store.on('beforeload', function() {
        this.baseParams = {
			zhyjb : Ext.getCmp('zhyjb').getValue(),
			sort2 : Ext.getCmp('sort2').getValue(),
			name1 : Ext.getCmp('name1').getValue(),
			sort1 : Ext.getCmp('sort1').getValue(),
			birthdayFrom : Ext.getCmp('birthdayFrom').getValue(),
			birthdayTo : Ext.getCmp('birthdayTo').getValue(),
			merryFrom : Ext.getCmp('merryFrom').getValue(),
			joinDateFrom : Ext.getCmp('joinDateFrom').getValue(),
			joinDateTo : Ext.getCmp('joinDateTo').getValue(),
			merryTo : Ext.getCmp('merryTo').getValue()
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
        //readOnly : true,
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
        //readOnly : true,
        typeAhead : true,
        store : werks_store,
        valueField : 'werks',
        displayField : 'werksname',
        readOnly : true,
        anchor : '90%'
    });
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
        items : [ {
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
         //不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
//         forceFit : true
        },
        loadMask : {
            msg : '正在加载表格数据,请稍等...'
        }
    });

    // 表格实例
    var grid2 = new Ext.grid.EditorGridPanel({
        // 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
        height : 500,
        frame : true,
        autoScroll : true,
        region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
        store : store2, // 数据存储
        stripeRows : true, // 斑马线
        cm : cm2, // 列模型
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

    // 页面初始自动查询数据
    // store.load({params : {start : 0,limit : bbar.pageSize}});

    // 小画笔点击事件
    grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
        var store = pGrid.getStore();
        var record = store.getAt(rowIndex);
        var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
        // columnIndex为小画笔所在列的索引,索引从0开始
        // 这里要非常注意!!!!!
        if (fieldName == 'edit' && columnIndex == 2) {
            // 到此你就可以继续做其他任何事情了
            // Ext.MessageBox.alert('提示', assistant_name);
            var data = record.get("comp_status");
		        if(data=='完整'){
		           secondForm.form.items.each(function(item){  
                  item.disable();   
               });
               Ext.getCmp('sort1_edit').enable();
               Ext.getCmp('telf1').enable();
               Ext.getCmp('zyjdz').enable();
               Ext.getCmp('reset_second').disable();
               //Ext.getCmp('update_second').disable();
		        }else{
		           secondForm.form.items.each(function(item){  
                  item.enable();   
               });
               Ext.getCmp('reset_second').enable();
		        }
            secondWindow.show();
            secondForm.form.loadRecord(record);
        }

        if (fieldName == 'showdetail' && columnIndex == 3) {
            // var assistant_name =
            // record.get("assistant_name");
            // 到此你就可以继续做其他任何事情了
            // Ext.MessageBox.alert('提示', assistant_name);
            var kunnr = record.get('sort2');
            // alert(record.get('kunnr'));
            thirdWindow.show();
            store2.load({
                params : {
                    kunnr : kunnr
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
    
    // 小画笔点击事件
    grid2.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
        var store = pGrid.getStore();
        var record = store.getAt(rowIndex);
        var fieldName = pGrid.getColumnModel()
        .getDataIndex(columnIndex);
        
        // columnIndex为小画笔所在列的索引,索引从0开始
        // 这里要非常注意!!!!!
        if (fieldName == 'showorder' && columnIndex == 1) {
            // var assistant_name =
            // record.get("assistant_name");
            // 到此你就可以继续做其他任何事情了
            // Ext.MessageBox.alert('提示', assistant_name);
            var data = record.get("salesorderid");
           // alert(data);
            
            var url= "../../pos/order/orderSystem.ered?reqCode=orderSystemStart&postType=1&salesorderid=" + data + "&opmode=view"
            var obj = new Object();
         	obj.name="订单页面";
            window.showModalDialog(url,obj,"dialogWidth=800px;dialogHeight=400px");
            
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

    // 查询表格数据
    function queryCatalogItem() {
    	
    	var birthdayFrom = Ext.getCmp('birthdayFrom').getValue();
    	var birthdayTo = Ext.getCmp('birthdayTo').getValue();
    	var merryFrom = Ext.getCmp('merryFrom').getValue();
    	var merryTo = Ext.getCmp('merryTo').getValue();
    	//var joinDateFrom = Ext.getCmp('joinDateFrom').getValue();
    	//var joinDateTo = Ext.getCmp('joinDateTo').getValue();
    	if(birthdayFrom != '' && birthdayTo != ''){
	    	if(birthdayFrom > birthdayTo){
	    		Ext.Msg.alert("提示","生日开始日期不能大于结束日期！",function(e){
	    			 Ext.getCmp('birthdayTo').focus(true,true);
	    		});
	    		return;
	    	}
    	}
    	if(merryFrom != '' && merryTo != ''){
	    	if(Number(merryFrom) > Number(merryTo)){
	    		Ext.Msg.alert("提示","结婚纪念日开始月份不能打于结束月份！",function(e){
	    			 Ext.getCmp('merryTo').focus(true,true);
	    		});
	    		return;
	    	}
    	}
    	firstWindow.hide();
        store.clearData();
        store.load({
            params : {
                start : 0,
                limit : bbar.pageSize,
                //kunnr : Ext.getCmp('kunnr').getValue(),
                zhyjb : Ext.getCmp('zhyjb').getValue(),
                sort2 : Ext.getCmp('sort2').getValue(),
                name1 : Ext.getCmp('name1').getValue(),
                sort1 : Ext.getCmp('sort1').getValue(),
                birthdayFrom : Ext.getCmp('birthdayFrom').getValue(),
                birthdayTo : Ext.getCmp('birthdayTo').getValue(),
                merryFrom : merryFrom,
                merryTo : merryTo,
                joinDateFrom : Ext.getCmp('joinDateFrom').getValue(),
                joinDateTo : Ext.getCmp('joinDateTo').getValue()
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
    // 生成一个图标列
    function iconColumnRender3(value) {
        return "<a href='javascript:void(0);'><img src='" + webContext
        + "/resource/image/ext/application_view_list.png'/></a>";;
    }

    // queryCatalogItem();

    var memberTypeCombo = new Ext.form.ComboBox({
        // hiddenName : 'zhyjb',
        id : 'zhyjb',
        fieldLabel : '会员卡类别',
        emptyText : '请选择...',
        triggerAction : 'all',
        //readOnly : true,
        typeAhead : true,
        store : new Ext.data.ArrayStore({
            fields : ['name', 'value'],
            data : [['无限定', ''],['畅享卡', '01'], ['EEGO卡', '02'], ['金典卡', '03'], ['六福会员卡', '06'], ['兆亮会员卡', '10']]
        }),
        displayField : 'name',
        valueField : 'value',
        lazyRender : true,
        mode : 'local',
      //  readOnly : true,
        // value : '530101',
        anchor : '100%'
    // 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
    /*
			 * listeners : { 'render' : function(obj) { areaStore.load();
			 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
			 */
    });

    var usedCombo = new Ext.form.ComboBox({
        // hiddenName : 'used',
        id : 'used',
        fieldLabel : '是否使用',
        emptyText : '请选择...',
        triggerAction : 'all',
        typeAhead : true,
        store : new Ext.data.ArrayStore({
            fields : ['name', 'value'],
            data : [['已使用', '1'], ['未使用', '2']]
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
    
    
//    var monthCombo = new Ext.form.ComboBox({
//        emptyText : '请选择...',
//        triggerAction : 'all',
//        typeAhead : true,
//        store : new Ext.data.ArrayStore({
//            fields : ['name', 'value'],
//            data : [['一月', '01'], ['二月', '02'], 
//            		['三月', '03'], ['四月', '04'], 
//            		['五月', '05'], ['六月', '06'], 
//            		['七月', '07'], ['八月', '08'], 
//            		['九月', '09'], ['十月', '10'], 
//            		['十一月', '11'], ['十二月', '12']]
//        }),
//        displayField : 'name',
//        valueField : 'value',
//        lazyRender : true,
//        mode : 'local',
//        editable : false,
//        anchor : '100%'
//    });
    
    var firstForm = new Ext.form.FormPanel({
        id : 'firstForm',
        name : 'firstForm',
        labelWidth : 110, // 标签宽度
        // frame : true, //是否渲染表单面板背景色
        defaultType : 'textfield', // 表单元素默认类型
        labelAlign : 'right', // 标签对齐方式
        bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
        items : [memberTypeCombo, {
            fieldLabel : '会员主数据号', // 标签
            // name : 'kunnr', // name:后台根据此name属性取值
            id : 'kunnr',
            hidden : true,
            anchor : '100%' // 宽度百分比
        },{
            fieldLabel : '会员卡号',
            // name : 'sort2',
            id : 'sort2',
            anchor : '100%'
        }, {
            fieldLabel : '会员姓名',
            // name : 'name1',
            id : 'name1',
            anchor : '100%'
        }, {
            fieldLabel : '身份证号',
            // name : 'name2',
            id : 'name2',
            hidden : true,
            anchor : '100%'
        }, {
            fieldLabel : '手机号码',
            // name : 'telf1',
            id : 'sort1',
            anchor : '100%'
        }, {
        	fieldLabel : '生日从',
            // name : 'telf1',
            id : 'birthdayFrom',
            xtype : 'combo',
            emptyText : '请选择...',
	        triggerAction : 'all',
	        typeAhead : true,
	        store : new Ext.data.ArrayStore({
	            fields : ['name', 'value'],
	            data : [['一月', '01'], ['二月', '02'], 
	            		['三月', '03'], ['四月', '04'], 
	            		['五月', '05'], ['六月', '06'], 
	            		['七月', '07'], ['八月', '08'], 
	            		['九月', '09'], ['十月', '10'], 
	            		['十一月', '11'], ['十二月', '12']]
	        }),
	        displayField : 'name',
	        valueField : 'value',
	        mode : 'local',
            anchor : '100%'
        }, {
        	fieldLabel : '生日到',
            // name : 'telf1',
            id : 'birthdayTo',
            xtype : 'combo',
            emptyText : '请选择...',
	        triggerAction : 'all',
	        typeAhead : true,
	        store : new Ext.data.ArrayStore({
	            fields : ['name', 'value'],
	            data : [['一月', '01'], ['二月', '02'], 
	            		['三月', '03'], ['四月', '04'], 
	            		['五月', '05'], ['六月', '06'], 
	            		['七月', '07'], ['八月', '08'], 
	            		['九月', '09'], ['十月', '10'], 
	            		['十一月', '11'], ['十二月', '12']]
	        }),
	        displayField : 'name',
	        valueField : 'value',
	        mode : 'local',
            anchor : '100%'
        }, {
            fieldLabel : '结婚纪念日从',
            // name : 'telf1',
            id : 'merryFrom',
            xtype : 'combo',
            emptyText : '请选择...',
	        triggerAction : 'all',
	        typeAhead : true,
	        store : new Ext.data.ArrayStore({
	            fields : ['name', 'value'],
	            data : [['一月', '01'], ['二月', '02'], 
	            		['三月', '03'], ['四月', '04'], 
	            		['五月', '05'], ['六月', '06'], 
	            		['七月', '07'], ['八月', '08'], 
	            		['九月', '09'], ['十月', '10'], 
	            		['十一月', '11'], ['十二月', '12']]
	        }),
	        displayField : 'name',
	        valueField : 'value',
	        mode : 'local',
            anchor : '100%'
        }, {
            fieldLabel : '结婚纪念日到',
            // name : 'telf1',
            id : 'merryTo',
            xtype : 'combo',
            emptyText : '请选择...',
	        triggerAction : 'all',
	        typeAhead : true,
	        store : new Ext.data.ArrayStore({
	            fields : ['name', 'value'],
	            data : [['一月', '01'], ['二月', '02'], 
	            		['三月', '03'], ['四月', '04'], 
	            		['五月', '05'], ['六月', '06'], 
	            		['七月', '07'], ['八月', '08'], 
	            		['九月', '09'], ['十月', '10'], 
	            		['十一月', '11'], ['十二月', '12']]
	        }),
	        displayField : 'name',
	        valueField : 'value',
	        mode : 'local',
            anchor : '100%'
        }, {
            fieldLabel : '入会日期从',
            // name : 'telf1',
            id : 'joinDateFrom',
            xtype : 'datefield',
            format:'Y-m-d',
            anchor : '100%'
        }, {
            fieldLabel : '入会日期到',
            // name : 'telf1',
            id : 'joinDateTo',
            xtype : 'datefield',
            format:'Y-m-d',
            anchor : '100%'
        }
        //,usedCombo
        ]
    });

    var firstWindow = new Ext.Window({
        title : '<span class="commoncss">选择查询条件</span>', // 窗口标题
        layout : 'fit', // 设置窗口布局模式
        width : 350, // 窗口宽度
        height : 350, // 窗口高度
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
            }
        }, {	// 窗口底部按钮配置
            text : '重置', // 按钮文本
            iconCls : 'tbar_synchronizeIcon', // 按钮图标
            handler : function() { // 按钮响应函数
                firstForm.form.reset();
            }
        }]
    });

    firstWindow.show(); // 显示窗口

    var memberTypeCombo2 = new Ext.form.ComboBox({
        hiddenName : 'konda',
        fieldLabel : '会员性质',
        emptyText : '请选择...',
        triggerAction : 'all',
        //readOnly : true,
        typeAhead : true,
        store : new Ext.data.ArrayStore({
            fields : ['name', 'value'],
            data : [['畅享卡', '01'], ['EEGO卡', '02'], ['金典卡', '03'], ['未指定', '04'], ['六福会员卡', '06'], ['兆亮会员卡', '10']]
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
        //readOnly : true,
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
////婚姻状况
//    var maritalStatus = new Ext.form.ComboBox({
//        hiddenName : 'bryth',
//        fieldLabel : '婚姻状况',
//        emptyText : '请选择...',
//        triggerAction : 'all',
//        //readOnly : true,
//        typeAhead : true,
//        store : new Ext.data.ArrayStore({
//            fields : ['name', 'value'],
//            data : [['已婚', '0001'], ['未婚', '0002'], ['单身', '0003']]
//        }),
//        displayField : 'name',
//        valueField : 'value',
//        lazyRender : true,
//        mode : 'local',
//        editable : false,
//        anchor : '90%',
//        listeners:{  
//          select:function(combo, record,index){
//            var v = record.data.value;
//            if(v=='0001'){
//              //Ext.getCmp('telf2').setVisible(true);//fieldLabel
//              //Ext.getCmp('telf2').getEl().up('.x-form-item').setDisplayed(true);
//              Ext.getCmp("telf2").show(); 
//            }else{
//              Ext.getCmp("telf2").hide();
//            }
//              
//            }
//         }  
//    });
    //会员等级
     var cardnature = new Ext.form.ComboBox({
        hiddenName : 'pafkt',
        fieldLabel : '会员等级',
        emptyText : '请选择...',
        triggerAction : 'all',
        readOnly : true,
        typeAhead : true,
        store : new Ext.data.ArrayStore({
            fields : ['name', 'value'],
            data : [['特等', '01'], ['一等', '02'],['二等', '03'],['三等', '04']]
        }),
        displayField : 'name',
        valueField : 'value',
        lazyRender : true,
        mode : 'local',
        editable : false,
        anchor : '90%'
    });
    //卡状态
    var card_status = new Ext.form.ComboBox({
        hiddenName : 'parvo',
        fieldLabel : '卡状态',
        emptyText : '请选择...',
        triggerAction : 'all',
        readOnly : true,
        typeAhead : true,
        store : new Ext.data.ArrayStore({
            fields : ['name', 'value'],
            data : [['正常', '1'], ['补卡', '2'], ['卡升级', '3'], ['作废', '4']]
        }),
        displayField : 'name',
        valueField : 'value',
        lazyRender : true,
        mode : 'local',
        editable : false,
        anchor : '90%',
        listeners:{  
          select:function(combo, record,index){
            var v = record.data.value;
            if(v=='2'||v=='3'){
              Ext.getCmp("new_sort2").show();
            }else {
              Ext.getCmp("new_sort2").hide();
            }
          }
        }  
    });
    
    var abtnr = new Ext.form.ComboBox({
        hiddenName : 'abtnr',
        fieldLabel : '职业',
        emptyText : '请选择...',
        triggerAction : 'all',
        typeAhead : true,
        store : new Ext.data.ArrayStore({
            fields : ['name', 'value'],
//            data : [['学生', '0001'], ['金融', '0002'], ['白领', '0003'], ['自由', '0004'], ['公务员', '0005'], ['企业管理', '0006'], ['个体', '0007']
//            , ['家庭主妇', '0008'], ['教育', '0009'], ['专业人士', '0010'], ['医务', '0011'], ['其他', '0012']]
            data : [['学生', '0001'], ['银行职员', '0002'], ['企业行政类', '0003'],
					['自由职业', '0004'], ['公务员', '0005'], ['企业管理', '0006'],
					['个体', '0007'], ['家庭主妇', '0008'], ['教师', '0009'],
					['律师及会计事务所从业人员', '0010'], ['医疗行业', '0011'], ['其他', '0012']]
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
    
    
    //希望提供的服务多选框
	var location = new Ext.ux.form.LovCombo({
		 id:'location',
		 name:'location',
		 anchor : '90%',
		 hideOnSelect:true,
		 maxHeight:200,
		 editable:false,
		 fieldLabel : '希望提供的服务',
		 emptyText : '请选择...',
		 store:new Ext.data.SimpleStore({
			 fields:['id', 'privGroup'],
			 data:[
				 ['流行资讯', '流行资讯'],
				 ['会刊', '会刊'],
				 ['生日PARRT', '生日PARRT'],
				 ['沙龙活动', '沙龙活动'],
				 ['消费指南', '消费指南'],
				 ['其他', '其他']
			]
		}),
		triggerAction:'all',
		valueField:'id',
		displayField:'privGroup',
		mode:'local',
		beforeBlur:function(){}
	});
    
    //平时的穿着风格多选框
	var extension2 = new Ext.ux.form.LovCombo({
		 id:'extension2',
		 name:'extension2',
		 anchor : '90%',
		  hideOnSelect:true,
		 maxHeight:200,
		 editable:false,
		 fieldLabel : '您选择兆亮珠宝和EEGO品牌的理由',
		 emptyText : '请选择...',
		 store:new Ext.data.SimpleStore({
			 fields:['id', 'privGroup'],
//			 data:[
//				 ['休闲型', '休闲型'],
//				 ['优雅型', '优雅型'],
//				 ['浪漫型', '浪漫型'],
//				 ['古典型', '古典型'],
//				 ['前卫型', '前卫型'],
//				 ['其他', '其他']
//			]
			 data : [['品牌知名度', '品牌知名度'], ['店内服务和环境', '店内服务和环境'],
						['朋友推荐', '朋友推荐'], ['商品价格', '商品价格'],['商品品质', '商品品质']]
		}),
		triggerAction:'all',
		valueField:'id',
		displayField:'privGroup',
		mode:'local'
	});
	
    //喜欢购物的地点多选框
	var str_suppl3 = new Ext.ux.form.LovCombo({
		 id:'str_suppl3',
		 name:'str_suppl3',
		 anchor : '90%',
		  hideOnSelect:true,
		 maxHeight:200,
		 editable:false,
		 fieldLabel : '喜欢购物的地点',
		 emptyText : '请选择...',
		 store:new Ext.data.SimpleStore({
			 fields:['id', 'privGroup'],
//			 data:[
//				 ['大型商场', '大型商场'],
//				 ['超市', '超市'],
//				 ['专卖店', '专卖店'],
//				 ['会所', '会所'],
//				 ['其他', '其他']
//			 ]
			 data : [['购物中心','购物中心'],['百货商场','百货商场'],['专卖店','专卖店'],
				        ['会所','会所'],['网购','网购'],['其它','其它']]
		}),
		triggerAction:'all',
		valueField:'id',
		displayField:'privGroup',
		mode:'local'
	});
	
    //购买首饰--自用多选框
	var name_co = new Ext.ux.form.LovCombo({
		 id:'name_co',
		 name:'name_co',
		 anchor : '90%',
		  hideOnSelect:true,
		 maxHeight:200,
		 editable:false,
		 fieldLabel : '购买首饰--自用',
		 emptyText : '请选择...',
		 store:new Ext.data.SimpleStore({
			 fields:['id', 'privGroup'],
			 data:[
			     ['订婚', '订婚'],
				 ['结婚', '结婚'],
				 ['晚装', '晚装'],
				 ['平时配戴', '平时配戴'],
				 ['收藏', '收藏'],
				 ['其他', '其他']
			]
		}),
		triggerAction:'all',
		valueField:'id',
		displayField:'privGroup',
		mode:'local',
		//readOnly : true,
		beforeBlur:function(){}
	});
    //接受资讯方式多选框
	var city2 = new Ext.ux.form.LovCombo({
		 id:'city2',
		 name:'city2',
		 anchor : '90%',
		  hideOnSelect:true,
		 maxHeight:200,
		 editable:false,
		 fieldLabel : '接受资讯方式',
		 emptyText : '请选择...',
		 store:new Ext.data.SimpleStore({
			 fields:['id', 'privGroup'],
//			 data:[
//				 ['信函', '信函'],
//				 ['E-MALL', 'E-MALL'],
//				 ['手机短信', '手机短信'],
//				 ['网站', '网站'],
//				 ['期刊', '期刊'],
//				 ['逛商店', '逛商店'],
//				 ['其他', '其他']
//			]
			 data : [['微信', '微信'],['店内宣传册', '店内宣传册'], ['手机短信', '手机短信'], 
				     ['网站', '网站'],['电话', '电话'], ['其他', '其他']]
		}),
		triggerAction:'all',
		valueField:'id',
		displayField:'privGroup',
		mode:'local',
		//readOnly : true,
		beforeBlur:function(){}
	});
//    //认识兆亮途径多选框
//	var extension1 = new Ext.ux.form.LovCombo({
//		 id:'extension1',
//		 name:'extension1',
//		 anchor : '90%',
//		  hideOnSelect:true,
//		 maxHeight:200,
//		 editable:false,
//		 fieldLabel : '认识兆亮途径',
//		 emptyText : '请选择...',
//		 store:new Ext.data.SimpleStore({
//			 fields:['id', 'privGroup'],
//			 data:[
//				 ['朋友', '朋友'],
//				 ['商场', '商场'],
//				 ['专刊', '专刊'],
//				 ['电视', '电视'],
//				 ['报纸', '报纸'],
//				 ['网络', '网络'],
//				 ['电梯广告', '电梯广告'],
//				 ['地铁', '地铁'],
//				 ['其他', '其他']
//			]
//		}),
//		triggerAction:'all',
//		valueField:'id',
//		displayField:'privGroup',
//		mode:'local',
//		//readOnly : true,
//		beforeBlur:function(){}
//	});
    //喜欢的珠宝品种多选框
	var str_suppl2 = new Ext.ux.form.LovCombo({
		 id:'str_suppl2',
		 name:'str_suppl2',
		 anchor : '90%',
		 hideOnSelect:true,
		 maxHeight:200,
		 editable:false,
		 fieldLabel : '喜欢的珠宝品种',
		 emptyText : '请选择...',
		 store:new Ext.data.SimpleStore({
			 fields:['id', 'privGroup'],
			 data:[
				 ['钻石镶嵌', '钻石镶嵌'],
				 ['K金饰品', 'K金饰品'],
				 ['黄金饰品', '黄金饰品'],
				 ['彩宝饰品', '彩宝饰品'],
				 ['翡翠饰品', '翡翠饰品'],
				 ['其他', '其他']
			]
		}),
		triggerAction:'all',
		valueField:'id',
		displayField:'privGroup',
		mode:'local',
		//readOnly : true,
		beforeBlur:function(){}
	});
    
    //购买首饰--礼物多选框
	var str_suppl1 = new Ext.ux.form.LovCombo({
		 id:'str_suppl1',
		 name:'str_suppl1',
		 anchor : '90%',
		 hideOnSelect:true,
		 maxHeight:200,
		  editable:false,
		 fieldLabel : '购买首饰--礼物',
		 emptyText : '请选择...',
		 store:new Ext.data.SimpleStore({
			 fields:['id', 'privGroup'],
			 data:[
				 ['爱人', '爱人'],
				 ['亲人', '亲人'],
				 ['朋友', '朋友'],
				 ['同事', '同事'],
				 ['其他', '其他']
			]
		}),
		triggerAction:'all',
		valueField:'id',
		displayField:'privGroup',
		mode:'local',
		//readOnly : true,
		beforeBlur:function(){}
	});
    
    
    
  //推荐人卡号
     var suggestText=new Ext.form.TextField({     
          fieldLabel : '推荐人卡号',
          xtype : 'textfield',
          name : 'fax_number',
          id : 'fax_number',
          anchor : '90%',
          //html : '<div id="suggest_div">ssdssd</div>',
          enableKeyEvents:true,
          listeners:{  
            specialkey:function(field,e){  
                if (e.getKey()==Ext.EventObject.ENTER){  
                   getvipbyuser_1();  
                }  
             }  
          }  
     });   
  var secondForm = new Ext.form.FormPanel({
        id : 'secondForm',
        name : 'secondForm',
        labelWidth : 110, // 标签宽度
        autoScroll: true,
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
                items : [memberTypeCombo2, {
                    fieldLabel : '会员主数据号', // 标签
                    name : 'kunnr',
                    xtype : 'textfield',
                    hidden : true,
                    // name:后台根据此name属性取值
                    anchor : '90%' // 宽度百分比
                }, {
                    fieldLabel : '会员卡号',
                    xtype : 'textfield',
                    readOnly : true,
                    name : 'sort2',
                    allowBlank : false,
                    anchor : '90%'
                }, {
                    fieldLabel : '会员姓名',
                    xtype : 'textfield',
                    readOnly : true,
                    name : 'name1',
                    allowBlank : false,
                    anchor : '90%'
                }, gender,abtnr, {
                    fieldLabel : '手机号码',
                    xtype : 'textfield',
                    name : 'sort1',//'telf2',
                    id : 'sort1_edit',
                    allowBlank : false,
                    maxLength : 11,
                    minLength : 11,
                    anchor : '90%'
                },{
                    fieldLabel : '固定电话',
                    xtype : 'textfield',
                    name : 'telf1',
                    id : 'telf1',
                    regex : /\d{2,5}-\d{7,8}/,
                    regexText : '固定电话号码格式不正确,区号必须是2到5位,号码必须7到8位',
                    anchor : '90%'
                }, 
                name_co, str_suppl1, extension2,str_suppl2, str_suppl3, location, city2
//                kunn2_werks_combox, name4_werks_combox, suggestText
//                ,{
//                    fieldLabel : '微信号',
//                    xtype : 'textfield',
//                    name : 'fax_number1',
//                    id : 'fax_number1',
//                    anchor : '90%'
//                },
//                str_suppl1,
//                str_suppl3,
//                extension2,
//                str_suppl2
                ]
            }, {
                columnWidth : .5,
                layout : 'form',
                border : false,
                items : [card_status, cardnature, //maritalStatus, 
                    {
                    fieldLabel : '结婚纪念日',
                    xtype : 'datefield',
                    name : 'telf2',//'stcd2',
                    id: 'telf2',
                    format: 'Y-m-d',
                    value: '1900-01-01',
                    anchor : '90%'
                },{
                    fieldLabel : '出生日期',
                    xtype : 'datefield',
                    //readOnly : true,
                    name : 'gbdat',//'name3',
                    format: 'Y-m-d',
                    anchor : '90%'
                }, {
                    fieldLabel : '入会日期',
                    xtype : 'datefield',
                    //readOnly : true,
                    value : new Date(),
                    name : 'tel_number',
                    format: 'Y-m-d',
                    anchor : '90%'
                }, kunn2_werks_combox, name4_werks_combox, {
                    fieldLabel : '电子信箱',
                    xtype : 'textfield',
                    vtype:'email',
                    //readOnly : true,
                    name : 'smtp_addr',
                    anchor : '90%'
                }, {
					fieldLabel : '微信号',
					xtype : 'textfield',
					name : 'fax_number1',
					id : 'fax_number1',
					anchor : '90%'
				}, {
					fieldLabel : '微博',
					xtype : 'textfield',
					name : 'function',
					id : 'function',
					anchor : '90%'
				}, {
                    fieldLabel : '邮政编码',
                    xtype : 'textfield',
                    name : 'post_code1',//'pstlz',
                    maxLength : 6,
                    minLength : 6,
                    anchor : '90%'
                }, {
                    fieldLabel : '邮寄地址',
                    xtype : 'textfield',
                    name : 'street',
                    anchor : '90%'
                }, {
                    fieldLabel : '柜台办理人',
                    xtype : 'textfield',
                    //readOnly : true,
                    name : 'name2',
                    anchor : '90%'
                }, {
                    fieldLabel : '备注',
                    xtype : 'textfield',
                    //readOnly : true,
                    name : 'parau',
                    anchor : '90%'
                }
            ]
            }]
        }]
    });

    var secondWindow = new Ext.Window({
        title : '<span class="commoncss">修改会员信息</span>', // 窗口标题
        layout : 'fit', // 设置窗口布局模式
        width : 650, // 窗口宽度
        height : 470, // 窗口高度
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
            id : 'update_second',
            iconCls : 'tbar_synchronizeIcon', // 按钮图标
            handler : function() { // 按钮响应函数
                Ext.Msg.confirm("提示", "确定吗？", function(btn, text) {
                    if (btn == "yes") {
                        secondForm.form.submit({
                            url : 'memberSystem.ered?reqCode=updateMember',
                            waitTitle : '提示',
                            method : 'POST',
                            waitMsg : '正在处理数据,请稍候...',
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
            id : 'reset_second',
            iconCls : 'tbar_synchronizeIcon', // 按钮图标
            handler : function() { // 按钮响应函数
                secondForm.form.reset();
            	//alert(Ext.getCmp('location').getValue());
            }
        }]
    });

    // 会员小心信息
    var thirdWindow = new Ext.Window({
        title : '<span class="commoncss">会员消费情况</span>', // 窗口标题
        layout : 'fit', // 设置窗口布局模式
        width : 900, // 窗口宽度
        iconCls : 'window_caise_listIcon', // 按钮图标
        height : 400, // 窗口高度
        closable : true, // 是否可关闭
        collapsible : true, // 是否可收缩
        maximizable : true, // 设置是否可以最大化
        border : false, // 边框线设置
        constrain : true, // 设置窗口是否可以溢出父容器
        pageY : 20, // 页面定位Y坐标
        pageX : document.body.clientWidth / 4 - 300 / 2, // 页面定位X坐标
        items : [grid2], // 嵌入的表单面板
        closeAction : 'hide'
    });
    
     //推荐人
    function getvipbyuser_1(){
      var str = escape(document.getElementById("fax_number").value);
      Ext.Ajax.request({
       url: 'memberSystem.ered?reqCode=getVipRecord&option=user',
       method:'GET',
       params:{
        vipid:str,
        start : 0,
        limit : bbar.pageSize
       },
      success:function(response){
      if(response.responseText==''){
        Ext.Msg.alert('提示', '输入推荐人卡号不存在!');
        return false;
      }else{
        var jsonObj = Ext.util.JSON.decode(response.responseText);
        //Ext.getCmp('telf1').setValue(jsonObj.sj);
        if(jsonObj.sj==''){
          Ext.Msg.alert('提示', '推荐人电话不存在!');
          return false;
        }
        Ext.Msg.alert("提示","获取推荐人成功，推荐人姓名："+jsonObj.hyxm);
        document.getElementById("fax_number1").value = jsonObj.sj;
       }
      }
     });
  } 
  function getvipbyuser_2(){
      var str = escape(document.getElementById("fax_number1").value);
      Ext.Ajax.request({
       url: 'memberSystem.ered?reqCode=getVipRecord&option=user',
       method:'GET',
       params:{
        tel:str,
        start : 0,
        limit : bbar.pageSize
       },
      success:function(response){
        if(response.responseText==''){
          Ext.Msg.alert('提示', '输入推荐人电话不存在!');
          return false;
        }else{
          var jsonObj = Ext.util.JSON.decode(response.responseText);
          if(jsonObj.yhkh==''){
            Ext.Msg.alert('提示', '推荐人卡号不存在!');
            return false;
          }
          Ext.Msg.alert("提示","获取推荐人成功，推荐人姓名："+jsonObj.hyxm);
          document.getElementById("fax_number").value = jsonObj.hykh;
         }
      }
     });
  }
  
});