Ext.ns('Boat.UI');
// 树形下拉框
Boat.UI.TreeCombox = Ext.extend(Ext.form.ComboBox, {
	store : new Ext.data.SimpleStore({
		fields : [],
		data : [[]]
	}),
	editable : false,
	mode : 'local',
	triggerAction : 'all',
	emptyText : '请选择...',

	treeConfig : {
		border : false,
		autoScroll : true,
		height : 200
	},
	initComponent : function() {
		this.hiddenName = this.name;
		Ext.apply(this.tree, this.treeConfig);
		this.tpl = '<div id="tree-' + this.id + '"></div>';

		Boat.UI.TreeCombox.superclass.initComponent.call(this);
		this.on('expand', this.expandtree, this);
		this.tree.on('click', this.clicktree, this);
	},
	onViewClick : Ext.emptyFn,
	assertValue : Ext.emptyFn,
	expandtree : function() {
		this.tree.render('tree-' + this.id);
		this.tree.expand();
	},
	clicktree : function(node) {
		this.setValue(node);
		this.collapse();
		// 如果要需求是单独叶节点可选时 可这样做
		/*
		 * if (node.isLeaf()) { this.setValue(node); this.collapse(); }
		 */
	},
	setValue : function(v) {
		this.hiddenField.value = v.id;
		Ext.form.ComboBox.superclass.setValue.call(this, v.text);
		this.value = v.id;
	},
	onDestroy : function() {
		this.un('expand', this.expandtree, this);
		Ext.destroy(this.tree);
		Boat.UI.TreeCombox.superclass.onDestroy.call(this);
	}
});
Ext.reg('treecombobox', Boat.UI.TreeCombox);
// ================================================================
root = new Ext.tree.AsyncTreeNode({
	parentid : '',
	text : '菜单树',
	expanded : true,
	id : '01'
});
var loader = new Ext.tree.TreeLoader({
	baseParams : {},
	dataUrl : './brand.ered?reqCode=deptTreeList'
});

categorytree = new Ext.tree.TreePanel({
	// height : document.body.clientHeight,
	root : root,
	loader : loader,
	bodyStyle : 'background-color:#FFFFFA;',
	title : '',
	frame : true,
	autoScroll : true,
	animate : false,
	useArrows : false,
	border : false
});
