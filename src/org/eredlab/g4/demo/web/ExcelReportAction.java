package org.eredlab.g4.demo.web;

import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class ExcelReportAction extends BaseAction {
	public ActionForward exportInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		removeSessionAttribute(request, "QUERYCATALOGS4EXPORT_QUERYDTO");
		return mapping.findForward("exportExcelView");
	}

	public ActionForward queryCatalogs4Export(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		super.setSessionAttribute(request, "QUERYCATALOGS4EXPORT_QUERYDTO",
				inDto);
		List catalogList = this.g4Reader.queryForPage(
				"Demo.queryCatalogsForPrint", inDto);
		Integer pageCount = (Integer) this.g4Reader.queryForObject(
				"Demo.queryCatalogsForPrintForPageCount", inDto);
		String jsonString = encodeList2PageJson(catalogList, pageCount,
				"yyyy-MM-dd HH:mm:ss");
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward importExcel(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm actionForm = (CommonActionForm) form;
		FormFile theFile = actionForm.getTheFile();
		String metaData = "xmid,xmmc,xmrj,gg,dw,jx,zfbl,cd,ggsj";
		ExcelReader excelReader = new ExcelReader(metaData, theFile
				.getInputStream());
		List list = excelReader.read(3, 1);
		super.setSessionAttribute(request, "importExcelList", list);
		setOkTipMsg("导入成功", response);
		return mapping.findForward(null);
	}

	public ActionForward queryCatalogs4Import(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		List catalogList = (List) super.getSessionAttribute(request,
				"importExcelList");
		Integer pageCount = new Integer(1);
		String jsonString = encodeList2PageJson(catalogList, pageCount,
				"yyyy-MM-dd");
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward exportExcel(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Thread.sleep(2000L);
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "北京市第一人民医院收费项目表");
		parametersDto.put("jbr", super.getSessionContainer(request)
				.getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request,
				"QUERYCATALOGS4EXPORT_QUERYDTO");
		inDto.put("rownum", "500");
		List fieldsList = null;
		if (G4Utils.defaultJdbcTypeOracle())
			fieldsList = this.g4Reader.queryForList(
					"Demo.queryCatalogsForPrintLimitRows", inDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			fieldsList = this.g4Reader.queryForList(
					"Demo.queryCatalogsForPrintLimitRowsMysql", inDto);
		}
		parametersDto.put("countXmid", new Integer(fieldsList.size()));
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter
				.setTemplatePath("/report/excel/demo/hisCatalogReport.xls");
		excelExporter.setData(parametersDto, fieldsList);
		excelExporter.setFilename("北京市第一人民医院收费项目表.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward exportExcel2(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "北京市第一人民医院收费项目表");
		parametersDto.put("jbr", super.getSessionContainer(request)
				.getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request,
				"QUERYCATALOGS4EXPORT_QUERYDTO");
		inDto.put("rownum", "500");
		List fieldsList = null;
		if (G4Utils.defaultJdbcTypeOracle())
			fieldsList = this.g4Reader.queryForList(
					"Demo.queryCatalogsForPrintLimitRows", inDto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			fieldsList = this.g4Reader.queryForList(
					"Demo.queryCatalogsForPrintLimitRowsMysql", inDto);
		}
		parametersDto.put("countXmid", new Integer(fieldsList.size()));
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter
				.setTemplatePath("/report/excel/demo/hisCatalogReport2.xls");
		excelExporter.setData(parametersDto, fieldsList);
		excelExporter.setFilename("北京市第一人民医院收费项目表.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward exportExcel3(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "北京市第一人民医院收费项目表");
		parametersDto.put("jbr", super.getSessionContainer(request)
				.getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		parametersDto.put("d1_1", "100.00");
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter
				.setTemplatePath("/report/excel/demo/hisCatalogReport3.xls");
		List fuckList = new ArrayList();
		excelExporter.setData(parametersDto, fuckList);
		excelExporter.setFilename("北京市第一人民医院收费项目表.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward importInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "importExcelList");
		return mapping.findForward("importExcelView");
	}
}