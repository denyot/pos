Ext.onReady(function() {
    //数据
    //维修状态下拉框
    Ext.data.status = [
         [ '全部', '' ], [ '新单', '1' ], [ '关闭', '2' ], [ '送厂', '3' ], [ '合格', '4' ] ,
         [ '返修', '5' ], [ '邮寄', '6' ], [ '门店接收', '7' ], [ '顾客取货', '8' ]
       ]
    var statusDS = new Ext.data.SimpleStore({ //通过字典表获得用户使用状态数据源
          fields: ['name', 'value'],
          data:Ext.data.status //这里对应在字典表里定义的类型名称
     });
    var statusCombo = new Ext.form.ComboBox( {
      hiddenName : 'status',
      id : 'statusCombo',
      //name : 'status',
      fieldLabel : '状态',
      emptyText : '请选择状态',
      triggerAction : 'all',
      typeAhead : true,
      store : statusDS,
      displayField : 'name',
      valueField : 'value',
      lazyRender : true,
      mode : 'local',
      editable : false,
      anchor : '100%'
    });
   
    // 复选框
    var sm = new Ext.grid.CheckboxSelectionModel();
    // 定义自动当前页行号
    var rownum = new Ext.grid.RowNumberer( {
      header : 'NO',
      width : 28
    });
    // 定义列模型
    var cm = new Ext.grid.ColumnModel( [ rownum,{
      header : '改款单号',
      dataIndex : 'service_number',
      sortable : true,
      width : 130
    }, {
      header : '名称',
      dataIndex : 'store_name',
      width : 90
    }, {
      header : '会员卡号', // 列标题
      dataIndex : 'member_cardnumber', // 数据索引:和Store模型对应
      sortable : true,// 是否可排序
      width : 90
    }, {
      header : '顾客姓名',
      dataIndex : 'member_name',
      width : 90
    }, {
      header : '投诉单号',
      dataIndex : 'complaints_number',
      sortable : true,
      width : 80
    }, {
      header : '商品批次',
      dataIndex : 'old_commodity_barcode',
      width : 130
    }, {
      header : '商品名',
      dataIndex : 'trade_name',
      width : 90
    }, {
      header : '状态',
      dataIndex : 'description',
      sortable : true,
      width : 90
    }, {
      header : "操作",
      width : 50,
      dataIndex : '',
      menuDisabled : true, // 单击列头后是否出现菜单
      renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
         var s = record.data.service_number;
         return "<span style='margin-right:10px'><a href='aftersales.ered?reqCode=getServiceInfoById&service_type=2&service_number=" + s + "' target= '_blank' >详细</a></span>";
     }
    } ]);
    /**
     * 数据存储
     */
    var store = new Ext.data.Store( {
      // 获取数据的方式
      proxy : new Ext.data.HttpProxy( {
        url : 'aftersales.ered?reqCode=getFaceliftInfo'
      }),
      // 数据读取器
      reader : new Ext.data.JsonReader( {
        totalProperty : 'TOTALCOUNT', // 记录总数
        root : 'ROOT' // Json中的列表数据根节点
      }, [ {
        name : 'service_number'
      },{
        name : 'store_name'
      }, {
        name : 'member_name'
      }, {
        name : 'member_cardnumber'
      }, {
        name : 'complaints_number'
      }, {
        name : 'old_commodity_barcode'
      }, {
        name : 'trade_name'
      }, {
        name : 'status'
      }, {
        name : 'description'
      }])
    });

    // 每页显示条数下拉选择框
    var pagesize_combo = new Ext.form.ComboBox( {
      name : 'pagesize',
      triggerAction : 'all',
      mode : 'local',
      store : new Ext.data.ArrayStore( {
        fields : [ 'value', 'text' ],
        data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ], [ 100, '100条/页' ], [ 250, '250条/页' ],
            [ 500, '500条/页' ] ]
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
      store.reload( {
        params : {
          start : 0,
          limit : bbar.pageSize
        }
      });
    });

    // 分页工具栏
    var bbar = new Ext.PagingToolbar( {
      pageSize : number,
      store : store,
      displayInfo : true,
      displayMsg : '显示{0}条到{1}条,共{2}条',
      plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
      emptyMsg : "没有符合条件的记录",
      items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
    });
    // 表格实例
    var grid = new Ext.grid.EditorGridPanel( {
      // 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
      height : 500,
      frame : true,
      autoScroll : true,
      region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
      store : store, // 数据存储
      stripeRows : true, // 斑马线
      cm : cm, // 列模型
      sm : sm, // 复选框
      tbar : [ {
        xtype : 'textfield',
        id : 'service_number',
        name : 'service_number',
        emptyText : '改款单号',
        width : 150,
        enableKeyEvents : true,
        listeners : {
          specialkey : function(field, e) {
            if (e.getKey() == Ext.EventObject.ENTER) {
              queryInfo();
            }
          }
        }
      },{
        xtype : 'textfield',
        id : 'member_name',
        name : 'member_name',
        emptyText : '顾客姓名',
        width : 150,
        enableKeyEvents : true,
        listeners : {
          specialkey : function(field, e) {
            if (e.getKey() == Ext.EventObject.ENTER) {
              queryInfo();
            }
          }
        }
      },statusCombo,{
        id : 'start_time',
        name : 'start_time',
        emptyText : '开始时间',
        xtype : 'datefield',
        format : 'Y-m-d',
        allowBlank : true, 
        editable: false,
        anchor : '100%'
      },{
        id : 'end_time',
        name : 'end_time',
        emptyText : '截止时间',
        xtype : 'datefield',
        format : 'Y-m-d',
        allowBlank : true,
        editable: false,
        anchor : '100%'
      }, {
        text : '查询',
        iconCls : 'page_findIcon',
        handler : function() {
          queryInfo();
        }
      }
       ], // 表格工具栏
      bbar : bbar,// 分页工具栏
      viewConfig : {
      // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
      // forceFit : true
      },
      loadMask : {
        msg : '正在加载表格数据,请稍等...'
      }
    });
    store.load( {
      params : {
        start : 0,
        limit : bbar.pageSize
      }
    });

    // 布局模型
    var viewport = new Ext.Viewport( {
      layout : 'border',
      items : [ grid ]
    });

    //查询维修信息
    function queryInfo() {
      store.load( {
        params : {
          start : 0,
          limit : bbar.pageSize,
          service_number : Ext.getCmp('service_number').getValue(),
          member_name : Ext.getCmp('member_name').getValue(),
          status : Ext.getCmp('statusCombo').getValue(),
          start_time : Ext.getCmp('start_time').getValue(),
          end_time : Ext.getCmp('end_time').getValue(),
        }
      });
    }

    // 获取选择行
    function getCheckboxValues() {
      // 返回一个行集合JS数组
      var rows = grid.getSelectionModel().getSelections();
      if (Ext.isEmpty(rows)) {
        Ext.MessageBox.alert('提示', '您没有选中任何数据!');
        return;
      }
      //参数设置
      var ids = jsArray2JsString(rows, 'id');
      if (ids.indexOf(',') > -1) {
        Ext.MessageBox.alert('提示', '请选择单条数据!');
        return;
      }
      Ext.getCmp('detailFormPanel').getForm().findField('id').setValue(ids);
    }
    
    //详细信息显示
    var detailWindow = new Ext.Window( {
      //title : '<span class="commoncss">新添维修大的信息</span>', // 窗口标题
      layout : 'fit', // 设置窗口布局模式
      width : 550, // 窗口宽度
      height : 700, // 窗口高度
      closable : true, // 是否可关闭
      collapsible : true, // 是否可收缩
      maximizable : true, // 设置是否可以最大化
      border : false, // 边框线设置
      constrain : true, // 设置窗口是否可以溢出父容器
      pageY : 60, // 页面定位Y坐标
      pageX : document.body.clientWidth / 3 - 300 / 2, // 页面定位X坐标
      items : [ detailFormPanel ], // 嵌入的表单面板
      closeAction : 'hide',
      buttons : [{
            text : '关闭',
            iconCls : 'deleteIcon',
            handler : function() {
              detailWindow.hide();
            }
          } ]
    });
    //双击事件
  grid.on('rowdblclick', function(grid, rowIndex, event) {
     detailInit();
  });
   //修改编辑初始化
  function detailInit(){
    var record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
        Ext.MessageBox.alert('提示', '请选择要显示的改款记录!');
        return;
      }
      record = grid.getSelectionModel().getSelected();
      detailFormPanel.getForm().loadRecord(record);
      detailWindow.show();
      detailWindow
          .setTitle('<span style="font-weight:normal">改款详细信息</span>');
  }
  //设置为只读
  detailFormPanel.form.items.each(function(item){
    item.disable();
  });
  
  });