package org.eredlab.g4.demo.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.report.jasper.ReportData;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class JasperReportAction extends BaseAction {
	public ActionForward appletInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.getSessionContainer(request).cleanUp();
		return mapping.findForward("appletReportView");
	}

	public ActionForward pdfInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.getSessionContainer(request).cleanUp();
		return mapping.findForward("pdfReportView");
	}

	public ActionForward queryCatalogs4Print(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		super.setSessionAttribute(request, "QUERYCATALOGS4PRINT_QUERYDTO",
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

	public ActionForward buildReportDataObject(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto dto = new BaseDto();
		dto.put("reportTitle", "北京市第一人民医院收费项目明细报表(演示)");
		dto
				.put("jbr", getSessionContainer(request).getUserInfo()
						.getUsername());
		dto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) getSessionAttribute(request,
				"QUERYCATALOGS4PRINT_QUERYDTO");
		inDto.put("rownum", "100");
		List catalogList = null;
		if (G4Utils.defaultJdbcTypeOracle()) {
			catalogList = this.g4Reader.queryForList(
					"Demo.queryCatalogsForPrintLimitRows", inDto);
		} else if (G4Utils.defaultJdbcTypeMysql()) {
			catalogList = this.g4Reader.queryForList(
					"Demo.queryCatalogsForPrintLimitRowsMysql", inDto);
			for (int i = 0; i < catalogList.size(); i++) {
				Dto dto2 = (BaseDto) catalogList.get(i);
				dto2.put("zfbl", dto2.getAsBigDecimal("zfbl"));
			}
		}
		ReportData reportData = new ReportData();
		reportData.setParametersDto(dto);
		reportData.setFieldsList(catalogList);
		reportData
				.setReportFilePath("/report/jasper/demo/hisCatalogReport.jasper");
		getSessionContainer(request).setReportData("hisCatalogReport",
				reportData);
		return mapping.findForward(null);
	}
}