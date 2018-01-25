document.write("<div id='rfcTreeDiv'></div>");
// 下拉框树
var comboxWithTree = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : '<b>所在地区</b>',
	store : new Ext.data.SimpleStore({
		fields : [],
		data : [[]]
	}),
	mode : 'local',
	width:180,
	maxHeight : 200,
	resizable : true,
	triggerAction : 'all',
	tpl : '<tpl for="."><div id="tree1"></div></tpl>',
	displayField : 'key',
	valueField : 'value',
	emptyText : '请选择...'
});

var tree = new Ext.tree.TreePanel({
	height : 200,
	autoScroll : true,
	width : 500,
	loader : new Ext.tree.TreeLoader({
		dataUrl : './brand.ered?reqCode=deptTreeList&pid=001'
	})

});
var root = new Ext.tree.AsyncTreeNode({
	text : 'G4集成与开发平台',
	draggable : false,
	id : '001'
});
tree.setRootNode(root);
// 根据点击的节点加载该节点下的数据,点击哪个节点就加载哪个节点的数据
tree.on('beforeload', function(node) {
	if (node.id != '001') {
		tree.loader.dataUrl = './brand.ered?reqCode=deptTreeList&pid='
				+ node.id;
	}
});
