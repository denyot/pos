Ext.onReady(function() {
    Ext.QuickTips.init();
    //加载数据
    var old_store = new Ext.data.Store
    ({
        proxy: new Ext.data.HttpProxy({ url: "memberSystem.ered?reqCode=getMemberInfo&isactivate=y" }), // 数据源
        reader: new Ext.data.JsonReader(
        { totalProperty: "TOTALCOUNT",
          root: "ROOT", 
          fields: [{ name: 'kunnr' }, { name: 'sort2'}, { name: 'name1'} ] })// 如何解析
    });
    var new_store = new Ext.data.Store
    ({
        proxy: new Ext.data.HttpProxy({ url: "memberSystem.ered?reqCode=getMemberInfo&isactivate=n" }), // 数据源
        reader: new Ext.data.JsonReader(
        { totalProperty: "TOTALCOUNT",
          root: "ROOT", 
          fields: [{ name: 'kunnr' }, { name: 'sort2'}, { name: 'name1'}] })// 如何解析
    });
    //下拉框
    var old_comboBox = new Ext.form.ComboBox
    ({
        tpl: '<tpl for="."><div ext:qtip="提示：主数据号={kunnr};会员卡号={sort2}" class="x-combo-list-item">{sort2}->{name1}</div></tpl>',
        id: "oldcardid",
        hiddenName: 'sort2',
        fieldLabel : '原卡号',
        editable: true, //默认为true，false为禁止手写和联想功能
        store: old_store,
        emptyText: '请选择',
        mode: 'remote', //指定数据加载方式，如果直接从客户端加载则为local，如果从服务器断加载 则为remote.默认值为：remote
        typeAhead: true,
        triggerAction: 'query',
        valueField: 'sort2',
        displayField: 'sort2',
        enableKeyEvents: true, //键盘事件设置为真
        selectOnFocus: true,
        renderTo: document.getElementById('oldlev'),
        width: 160,
        resizable: true
    });
    //var value;
    //联想事件
    old_comboBox.on('beforequery', function(e) {
        var combo = e.combo;
        //将下拉列表框里的查询值赋为上一次输入的字符与当前输入字符连接，组成当前查询字符串
        //其中e.query为获取输入的值
        //如果没有本条赋值语句的话，那么会自动选择下拉列表中的第一条数据显示在文本框中
        //old_comboBox.setRawValue = value + e.query;//
        //alert(value + e.query);
        if (!e.forceAll) {
            value = e.query; //获取输入的值
            //value = old_comboBox.getRawValue();
            old_store.load({ params: { sort2: value} });
            combo.expand();
            return false;
        }
    });
    old_comboBox.on('select', function(combo, record, index) {
        //alert("你选择了会员：" + old_comboBox.getRawValue() + "value=" + old_comboBox.getValue());
       // Ext.Msg.alert("提示", "你选择了会员：" + old_comboBox.getRawValue());
        //comboBox.focus();
    });
    
    //新卡号
    //下拉框
    var new_comboBox = new Ext.form.ComboBox
    ({
        tpl: '<tpl for="."><div ext:qtip="提示：主数据号={kunnr};会员卡号={sort2}" class="x-combo-list-item">{sort2}->{name1}</div></tpl>',
        id: "newcardid",
        hiddenName: 'new_sort2',
        fieldLabel : '新卡号',
        editable: true, //默认为true，false为禁止手写和联想功能
        store: new_store,
        emptyText: '请选择',
        mode: 'remote', //指定数据加载方式，如果直接从客户端加载则为local，如果从服务器断加载 则为remote.默认值为：remote
        typeAhead: true,
        triggerAction: 'query',
        valueField: 'sort2',
        displayField: 'sort2',
        enableKeyEvents: true, //键盘事件设置为真
        selectOnFocus: true,
        renderTo: document.getElementById('newlev'),
        width: 160,
        resizable: true
    });
    //var value;
    //联想事件
    new_comboBox.on('beforequery', function(e) {
        var combo = e.combo;
        //new_comboBox.setRawValue = value + e.query;//
        if (!e.forceAll) {
            value = e.query; //获取输入的值
            //value = old_comboBox.getRawValue();
            new_store.load({ params: { sort2: value} });
            combo.expand();
            return false;
        }
    });
    new_comboBox.on('select', function(combo, record, index) {
       // alert("你选择了：" + new_comboBox.getRawValue() + "value=" + new_comboBox.getValue());
        //comboBox.focus();
    });
     //卡状态
    var card_status = new Ext.form.ComboBox({
        hiddenName : 'parvo',
        fieldLabel : '升级或补卡',
        emptyText : '请选择...',
        triggerAction : 'all',
        allowBlank : false,
        typeAhead : true,
        store : new Ext.data.ArrayStore({
            fields : ['name', 'value'],
            data : [['补卡', '2'], ['卡升级', '3']]
        }),
        displayField : 'name',
        valueField : 'value',
        lazyRender : true,
        mode : 'local',
        editable : false,
        anchor : '85%',
        listeners:{  
          select:function(combo, record,index){
            var v = record.data.value;
            if(v=='2'||v=='3'){
              Ext.getCmp("newcardid").show();
            }else {
              Ext.getCmp("newcardid").hide();
            }
          }
        }  
    });
    var firstForm = new Ext.form.FormPanel({
        id : 'firstForm',
        name : 'firstForm',
        labelWidth : 110, // 标签宽度
        // frame : true, //是否渲染表单面板背景色
        defaultType : 'textfield', // 表单元素默认类型
        labelAlign : 'right', // 标签对齐方式
        bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
        items : [card_status, old_comboBox, new_comboBox]
    });

    var firstWindow = new Ext.Window({
        title : '<span class="commoncss">卡信息修改</span>', // 窗口标题
        layout : 'fit', // 设置窗口布局模式
        width : 350, // 窗口宽度
        height : 280, // 窗口高度
        closable : false, // 是否可关闭
      //  collapsible : true, // 是否可收缩
        maximizable : true, // 设置是否可以最大化
        border : false, // 边框线设置
        constrain : true, // 设置窗口是否可以溢出父容器
        pageY : 60, // 页面定位Y坐标
        pageX : document.body.clientWidth / 3 - 300 / 2, // 页面定位X坐标
        items : [firstForm], // 嵌入的表单面板
        //closeAction : 'hide',
        buttons : [{ // 窗口底部按钮配置
            text : '更新', // 按钮文本
            iconCls : 'tbar_synchronizeIcon', // 按钮图标
            handler : function() { // 按钮响应函数
            			Ext.Msg.confirm("提示","确定提交吗？",function(e){
            				firstForm.form.submit({
            					url : 'memberSystem.ered?reqCode=updateMember&cmanage=y',
            					waitTitle : '提示',
            					method : 'POST',
            					waitMsg : '正在处理数据,请稍候...',
            					success : function(form, action) {
            						Ext.Msg.alert("提示", "提交成功");
            						//firstWindow.hide();
            					},
            					failure : function(form, action) {
            						//var msg = action.result.msg;
            						Ext.Msg.alert('提示', '操作失败!');
            					}
            				});
            			})
            }
        }, {
            text : '关闭',
            iconCls : 'deleteIcon',
            handler : function() {
              firstWindow.hide();
            }
          }]
    });
    
    firstWindow.show();
    
}); 