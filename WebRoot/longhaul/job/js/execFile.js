Ext.onReady(function() {
	var logDataType = new Ext.data.SimpleStore({
				fields : ['key', 'value'],
				data : [['abc', '执行文件'], ['def', '执行命令']]
			});
	
	var w=new Ext.Window({
        title : '<span class="commoncss">执行文件</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 500, // 窗口宽度
		height : 200, // 窗口高度
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
		items: new Ext.form.FormPanel({
		id : 'firstForm',
		name : 'firstForm',
	//	fileUpload : true, // 一定要设置这个属性,否则获取不到上传对象的
		labelWidth : 60,
		defaultType : 'textfield',
		labelAlign : 'right',
		bodyStyle : 'padding:5 5 5 5',
		items : [
			new Ext.form.ComboBox({
				colspan : 2,
				fieldLabel : '执行类型',
				id : 'aaa',
				store : logDataType,
				displayField : 'value',
				valueField : 'key',
				mode : 'local',
				typeAhead : true,
				forceSelection : true,
				triggerAction : 'all',
				width : 155,
				emptyText : '请选择...',
				selectOnFocus : true,
				 listeners:{
                "select":function(){
						if(Ext.get("aaa").dom.value=="执行文件"){
                              //获取id为combo的值
                            Ext.getCmp("files1").hide(),
                            Ext.getCmp("files").show()
                          //  FormPanel.getForm().findField("files1").hide() ;
                         }else{
                        	   Ext.getCmp("files").hide(),
                        	    Ext.getCmp("files1").show()
                         }
						}
            }
			})
			,{
			fieldLabel : '指定文件',
			id : 'files',
			name : 'files', 
		//	allowBlank : false,
			deferredRender:false,
			anchor : '100%'
		},{
			fieldLabel : '填写命令',
			id : 'files1',
			name : 'files1',
		//	allowBlank : false,
			deferredRender:false,
			anchor : '100%',
		
		}
		  
		]
	}),
           //  plain:true,
		  //  bbar:[{text:"确定"},{text:"取消",handler:function(){w.close();}}],//bottom部
		    buttons:[
		    	{text:"确定",
		    	 handler:function(){
		    	w.getComponent('firstForm').form.submit({
								url : './execFileMange.ered?reqCode=execmanger',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
		    						Ext.MessageBox.alert("提示",'操作成功!');
									w.hide();
							//		store.reload();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' );
									w.hide();
								}

							});
		    	 }
		    	},
		    	{text:"取消",
		    		handler:function(){w.close();}
		    	}
		    	
		    	],//footer部
			buttonAlign:"center",//footer部按钮排列位置,这里是中间
            collapsible:true,//右上角的收缩按钮
 
        });

	 
        w.show();
	
})