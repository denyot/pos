package org.eredlab.g4.demo.web;

import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.report.fcf.Categorie;
import org.eredlab.g4.rif.report.fcf.CategoriesConfig;
import org.eredlab.g4.rif.report.fcf.DataSet;
import org.eredlab.g4.rif.report.fcf.FcfDataMapper;
import org.eredlab.g4.rif.report.fcf.GraphConfig;
import org.eredlab.g4.rif.report.fcf.Set;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class FlashReportAction extends BaseAction {
	public ActionForward fcf2DColumnInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("论衡软件2010年月度销售业绩图表 (产品一)");

		graphConfig.setXAxisName("月度");

		graphConfig.setNumberPrefix("$");

		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("2dColumnView");
	}

	public ActionForward fcf3DColumnInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("3dColumnView");
	}

	public ActionForward fcfLineInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.put("divLineColor", "008ED6");

		graphConfig.put("divLineAlpha", "20");

		graphConfig.put("showAlternateHGridColor", "1");

		graphConfig.put("AlternateHGridColor", "BFFFFF");

		graphConfig.put("alternateHGridAlpha", "20");
		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("lineView");
	}

	public ActionForward fcf2DPieInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");
		graphConfig.setShowNames(new Boolean(true));

		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			set.setIsSliced(dto.getAsString("issliced"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("2dPieView");
	}

	public ActionForward fcf3DPieInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("3dPieView");
	}

	public ActionForward fcfAreaInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		graphConfig.put("divLineColor", "008ED6");

		graphConfig.put("divLineAlpha", "10");

		graphConfig.put("showAlternateHGridColor", "1");

		graphConfig.put("AlternateHGridColor", "BFFFFF");

		graphConfig.put("alternateHGridAlpha", "10");

		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));

			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("areaView");
	}

	public ActionForward fcfCircularityInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");
		graphConfig.setShowNames(new Boolean(true));

		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("circularityView");
	}

	public ActionForward fcf2DColumnMsInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		graphConfig.setCanvasBorderThickness(new Boolean(true));

		CategoriesConfig categoriesConfig = new CategoriesConfig();
		List cateList = new ArrayList();
		cateList.add(new Categorie("一月"));
		cateList.add(new Categorie("二月"));
		cateList.add(new Categorie("三月"));
		cateList.add(new Categorie("四月"));
		cateList.add(new Categorie("五月"));
		cateList.add(new Categorie("六月"));
		categoriesConfig.setCategories(cateList);
		List list = getFcfDataList4Group(new BaseDto());
		String xmlString = FcfDataMapper.toFcfXmlData(list, graphConfig,
				categoriesConfig);
		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("2dColumnMsView");
	}

	public ActionForward fcf3DColumnMsInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		graphConfig.setCanvasBorderThickness(new Boolean(true));

		CategoriesConfig categoriesConfig = new CategoriesConfig();
		List cateList = new ArrayList();
		cateList.add(new Categorie("一月"));
		cateList.add(new Categorie("二月"));
		cateList.add(new Categorie("三月"));
		cateList.add(new Categorie("四月"));
		cateList.add(new Categorie("五月"));
		cateList.add(new Categorie("六月"));
		categoriesConfig.setCategories(cateList);
		List list = getFcfDataList4Group(new BaseDto());
		String xmlString = FcfDataMapper.toFcfXmlData(list, graphConfig,
				categoriesConfig);
		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("3dColumnMsView");
	}

	public ActionForward fcfAreaMsInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		graphConfig.setCanvasBorderThickness(new Boolean(true));

		CategoriesConfig categoriesConfig = new CategoriesConfig();
		List cateList = new ArrayList();
		cateList.add(new Categorie("一月"));
		cateList.add(new Categorie("二月"));
		cateList.add(new Categorie("三月"));
		cateList.add(new Categorie("四月"));
		cateList.add(new Categorie("五月"));
		cateList.add(new Categorie("六月"));
		cateList.add(new Categorie("七月"));
		cateList.add(new Categorie("八月"));
		cateList.add(new Categorie("九月"));
		cateList.add(new Categorie("十月"));
		cateList.add(new Categorie("十一月"));
		cateList.add(new Categorie("十二月"));
		categoriesConfig.setCategories(cateList);
		List list = getFcfDataList4AreaGroup(new BaseDto());
		String xmlString = FcfDataMapper.toFcfXmlData(list, graphConfig,
				categoriesConfig);
		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("areaMsView");
	}

	public ActionForward fcfLineMsInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		graphConfig.setCanvasBorderThickness(new Boolean(true));

		CategoriesConfig categoriesConfig = new CategoriesConfig();
		List cateList = new ArrayList();
		cateList.add(new Categorie("一月"));
		cateList.add(new Categorie("二月"));
		cateList.add(new Categorie("三月"));
		cateList.add(new Categorie("四月"));
		cateList.add(new Categorie("五月"));
		cateList.add(new Categorie("六月"));
		cateList.add(new Categorie("七月"));
		cateList.add(new Categorie("八月"));
		cateList.add(new Categorie("九月"));
		cateList.add(new Categorie("十月"));
		cateList.add(new Categorie("十一月"));
		cateList.add(new Categorie("十二月"));
		categoriesConfig.setCategories(cateList);
		List list = getFcfDataList4LineGroup(new BaseDto());
		String xmlString = FcfDataMapper.toFcfXmlData(list, graphConfig,
				categoriesConfig);
		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("lineMsView");
	}

	public ActionForward fcf3DLineColumnInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		graphConfig.setCanvasBorderThickness(new Boolean(true));

		CategoriesConfig categoriesConfig = new CategoriesConfig();
		List cateList = new ArrayList();
		cateList.add(new Categorie("一月"));
		cateList.add(new Categorie("二月"));
		cateList.add(new Categorie("三月"));
		cateList.add(new Categorie("四月"));
		cateList.add(new Categorie("五月"));
		cateList.add(new Categorie("六月"));
		cateList.add(new Categorie("七月"));
		cateList.add(new Categorie("八月"));
		cateList.add(new Categorie("九月"));
		cateList.add(new Categorie("十月"));
		cateList.add(new Categorie("十一月"));
		cateList.add(new Categorie("十二月"));
		categoriesConfig.setCategories(cateList);
		List list = getFcfDataList4JCT(new BaseDto());
		String xmlString = FcfDataMapper.toFcfXmlData(list, graphConfig,
				categoriesConfig);
		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("3dLineColumnView");
	}

	public ActionForward fcfAdvancedInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");
		graphConfig.setSubcaption("点击柱子看看交互效果");

		graphConfig.setNumberPrefix("$");

		Dto qDto = new BaseDto();
		qDto.put("product", "2");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			set.setJsFunction("fnMyJs(\"xiongchun\")");

			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("3dColumnView");
	}

	private List getFcfDataList4JCT(Dto pDto) {
		pDto.put("rownum", "12");
		List dataList = new ArrayList();
		DataSet dataSet1 = new DataSet();
		dataSet1.setSeriesname("产品A");
		dataSet1.setColor("FDC12E");
		dataSet1.setShowValues(new Boolean(false));
		pDto.put("product", "1");
		List alist = null;
		if (G4Utils.defaultJdbcTypeOracle())
			alist = this.g4Reader.queryForList("Demo.getFcfDataList", pDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			alist = this.g4Reader
					.queryForList("Demo.getFcfDataListMysql", pDto);
		}
		List aSetList = new ArrayList();
		for (int i = 0; i < alist.size(); i++) {
			Dto dto = (BaseDto) alist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			aSetList.add(set);
		}
		dataSet1.setData(aSetList);
		dataList.add(dataSet1);

		DataSet dataSet2 = new DataSet();
		dataSet2.setSeriesname("产品B");
		dataSet2.setColor("44BC2F");
		dataSet2.setShowValues(new Boolean(false));
		pDto.put("product", "2");
		List blist = null;
		if (G4Utils.defaultJdbcTypeOracle())
			blist = this.g4Reader.queryForList("Demo.getFcfDataList", pDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			blist = this.g4Reader
					.queryForList("Demo.getFcfDataListMysql", pDto);
		}
		List bSetList = new ArrayList();
		for (int i = 0; i < blist.size(); i++) {
			Dto dto = (BaseDto) blist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			bSetList.add(set);
		}
		dataSet2.setData(bSetList);
		dataList.add(dataSet2);

		DataSet dataSet3 = new DataSet();
		dataSet3.setSeriesname("合计");
		dataSet3.setColor("3CBBD7");
		dataSet3.setShowValues(new Boolean(false));
		dataSet3.setParentYAxis(new Boolean(true));
		List sumlist = this.g4Reader.queryForList("Demo.getFcfSumDataList",
				pDto);
		List sumSetList = new ArrayList();
		for (int i = 0; i < sumlist.size(); i++) {
			Dto dto = (BaseDto) sumlist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			sumSetList.add(set);
		}
		dataSet3.setData(sumSetList);
		dataList.add(dataSet3);
		return dataList;
	}

	private List getFcfDataList4LineGroup(Dto pDto) {
		pDto.put("rownum", "12");
		List dataList = new ArrayList();
		DataSet dataSet1 = new DataSet();
		dataSet1.setSeriesname("产品A");
		dataSet1.setColor("FDC12E");
		pDto.put("product", "1");
		List alist = null;
		if (G4Utils.defaultJdbcTypeOracle())
			alist = this.g4Reader.queryForList("Demo.getFcfDataList", pDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			alist = this.g4Reader
					.queryForList("Demo.getFcfDataListMysql", pDto);
		}
		List aSetList = new ArrayList();
		for (int i = 0; i < alist.size(); i++) {
			Dto dto = (BaseDto) alist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			aSetList.add(set);
		}
		dataSet1.setData(aSetList);
		dataList.add(dataSet1);

		DataSet dataSet2 = new DataSet();
		dataSet2.setSeriesname("产品B");
		dataSet2.setColor("44BC2F");
		pDto.put("product", "2");
		List blist = null;
		if (G4Utils.defaultJdbcTypeOracle())
			blist = this.g4Reader.queryForList("Demo.getFcfDataList", pDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			blist = this.g4Reader
					.queryForList("Demo.getFcfDataListMysql", pDto);
		}
		List bSetList = new ArrayList();
		for (int i = 0; i < blist.size(); i++) {
			Dto dto = (BaseDto) blist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			bSetList.add(set);
		}
		dataSet2.setData(bSetList);
		dataList.add(dataSet2);
		return dataList;
	}

	private List getFcfDataList4AreaGroup(Dto pDto) {
		pDto.put("rownum", "12");
		List dataList = new ArrayList();
		DataSet dataSet1 = new DataSet();
		dataSet1.setSeriesname("产品A");
		dataSet1.setColor("FDC12E");
		dataSet1.setAreaBorderColor("FDC12E");
		dataSet1.setAreaBorderThickness("1");
		dataSet1.setAreaAlpha("70");
		pDto.put("product", "1");
		List alist = null;
		if (G4Utils.defaultJdbcTypeOracle())
			alist = this.g4Reader.queryForList("Demo.getFcfDataList", pDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			alist = this.g4Reader
					.queryForList("Demo.getFcfDataListMysql", pDto);
		}
		List aSetList = new ArrayList();
		for (int i = 0; i < alist.size(); i++) {
			Dto dto = (BaseDto) alist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			aSetList.add(set);
		}
		dataSet1.setData(aSetList);
		dataList.add(dataSet1);

		DataSet dataSet2 = new DataSet();
		dataSet2.setSeriesname("产品B");
		dataSet2.setColor("56B9F9");
		dataSet2.setAreaBorderColor("56B9F9");
		dataSet2.setAreaBorderThickness("2");
		dataSet2.setAreaAlpha("50");
		pDto.put("product", "2");
		List blist = null;
		if (G4Utils.defaultJdbcTypeOracle())
			blist = this.g4Reader.queryForList("Demo.getFcfDataList", pDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			blist = this.g4Reader
					.queryForList("Demo.getFcfDataListMysql", pDto);
		}
		List bSetList = new ArrayList();
		for (int i = 0; i < blist.size(); i++) {
			Dto dto = (BaseDto) blist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			bSetList.add(set);
		}
		dataSet2.setData(bSetList);
		dataList.add(dataSet2);
		return dataList;
	}

	private List getFcfDataList4Group(Dto pDto) {
		pDto.put("rownum", "6");
		List dataList = new ArrayList();
		DataSet dataSet1 = new DataSet();
		dataSet1.setSeriesname("产品A");
		dataSet1.setColor("FDC12E");
		pDto.put("product", "1");
		List alist = null;
		if (G4Utils.defaultJdbcTypeOracle())
			alist = this.g4Reader.queryForList("Demo.getFcfDataList", pDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			alist = this.g4Reader
					.queryForList("Demo.getFcfDataListMysql", pDto);
		}
		List aSetList = new ArrayList();
		for (int i = 0; i < alist.size(); i++) {
			Dto dto = (BaseDto) alist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			aSetList.add(set);
		}
		dataSet1.setData(aSetList);
		dataList.add(dataSet1);

		DataSet dataSet2 = new DataSet();
		dataSet2.setSeriesname("产品B");
		dataSet2.setColor("56B9F9");
		pDto.put("product", "2");
		List blist = null;
		if (G4Utils.defaultJdbcTypeOracle())
			blist = this.g4Reader.queryForList("Demo.getFcfDataList", pDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			blist = this.g4Reader
					.queryForList("Demo.getFcfDataListMysql", pDto);
		}
		List bSetList = new ArrayList();
		for (int i = 0; i < blist.size(); i++) {
			Dto dto = (BaseDto) blist.get(i);
			Set set = new Set();
			set.setValue(dto.getAsString("value"));
			bSetList.add(set);
		}
		dataSet2.setData(bSetList);
		dataList.add(dataSet2);
		return dataList;
	}

	public ActionForward fcf2DBarInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setXAxisName("月度");

		graphConfig.setNumberPrefix("$");

		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("2dBarView");
	}

	public ActionForward fcf2DBarMsInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表");

		graphConfig.setNumberPrefix("$");

		graphConfig.setCanvasBorderThickness(new Boolean(true));

		CategoriesConfig categoriesConfig = new CategoriesConfig();
		List cateList = new ArrayList();
		cateList.add(new Categorie("一月"));
		cateList.add(new Categorie("二月"));
		cateList.add(new Categorie("三月"));
		cateList.add(new Categorie("四月"));
		cateList.add(new Categorie("五月"));
		cateList.add(new Categorie("六月"));
		categoriesConfig.setCategories(cateList);
		List list = getFcfDataList4Group(new BaseDto());
		String xmlString = FcfDataMapper.toFcfXmlData(list, graphConfig,
				categoriesConfig);
		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("2dBarMsView");
	}

	public ActionForward integrateFlashReport1Init(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表(产品一)");

		graphConfig.setXAxisName("月度");

		graphConfig.setNumberPrefix("$");

		Dto qDto = new BaseDto();
		qDto.put("product", "1");

		List list = this.g4Reader.queryForList("Demo.getFcfDataList", qDto);
		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto.getAsString("name"));
			set.setValue(dto.getAsString("value"));
			set.setColor(dto.getAsString("color"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);

		request.setAttribute("xmlString", xmlString);
		return mapping.findForward("integrateFlashReport1View");
	}

	public ActionForward integrateFlashReport2Init(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("integrateFlashReport2View");
	}

	public ActionForward queryXsyjDatas(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List list = this.g4Reader.queryForPage("Demo.getFcfDataList", dto);
		String jsonString = JsonHelper.encodeList2PageJson(list,
				new Integer(12), "yyyy-MM-dd");
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryReportXmlDatas(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String product = "(产品一)";
		if (dto.getAsString("product").equals("2")) {
			product = "(产品二)";
		}
		List list = this.g4Reader.queryForList("Demo.getFcfDataList", dto);

		GraphConfig graphConfig = new GraphConfig();

		graphConfig.setCaption("Google软件2010年月度销售业绩图表" + product);

		graphConfig.setXAxisName("月度");

		graphConfig.setNumberPrefix("$");

		List dataList = new ArrayList();

		for (int i = 0; i < list.size(); i++) {
			Dto dto1 = (BaseDto) list.get(i);

			Set set = new Set();
			set.setName(dto1.getAsString("name"));
			set.setValue(dto1.getAsString("value"));
			set.setColor(dto1.getAsString("color"));
			dataList.add(set);
		}

		String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		outDto.put("xmlstring", xmlString);
		write(JsonHelper.encodeObject2Json(outDto), response);
		return mapping.findForward(null);
	}
}