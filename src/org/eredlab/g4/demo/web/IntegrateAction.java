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
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.demo.service.DemoService;
import org.eredlab.g4.rif.report.jasper.ReportData;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class IntegrateAction extends BaseAction {
	private DemoService demoService = (DemoService) getService("demoService");

	public ActionForward queryDemo1Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("queryDemo1View");
	}

	public ActionForward callPrcInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("callPrcView");
	}

	public ActionForward queryDemo2Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("queryDemo2View");
	}

	public ActionForward queryBalanceInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List list = this.g4Reader.queryForPage("Demo.queryBalanceInfo2", dto);
		Integer countInteger = (Integer) this.g4Reader.queryForObject(
				"Demo.countBalanceInfo2", dto);
		String jsonString = JsonHelper.encodeList2PageJson(list, countInteger,
				"yyyy-MM-dd");
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward collectDataInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("collectDataView");
	}

	public ActionForward manageDataInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("manageDataView");
	}

	public ActionForward manageData4In1Init(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("manageData4In1View");
	}

	public ActionForward collectDataByWindowInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("collectDataByWindowView");
	}

	public ActionForward querySfxm(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		Dto outDto = new BaseDto();
		Dto dto = (BaseDto) this.g4Reader.queryForObject("Demo.queryCatalogs2",
				inDto);
		if (G4Utils.isEmpty(dto)) {
			outDto.put("msg", "没有查询到数据");
		} else {
			outDto.putAll(dto);
			outDto.put("msg", "ok");
		}
		write(JsonHelper.encodeDto2FormLoadJson(outDto, "yyyy-MM-dd"), response);
		return mapping.findForward(null);
	}

	public ActionForward updateSfxm(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		inDto.put("ggsj", inDto.getAsTimestamp("ggsj"));
		this.demoService.updateSfxmDomain(inDto);
		setOkTipMsg("数据修改成功", response);
		return mapping.findForward(null);
	}

	public ActionForward saveSfxmDomain(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("ggsj", inDto.getAsTimestamp("ggsj"));
		inDto.put("yybm", "03010001");
		this.demoService.saveSfxmDomain(inDto);
		setOkTipMsg("收费项目数据保存成功", response);
		return mapping.findForward(null);
	}

	public ActionForward querySfxmDatas(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List list = this.g4Reader.queryForPage("Demo.queryCatalogsForGridDemo",
				dto);
		Integer countInteger = (Integer) this.g4Reader.queryForObject(
				"Demo.countCatalogsForGridDemo", dto);
		String jsonString = JsonHelper.encodeList2PageJson(list, countInteger,
				"yyyy-MM-dd");
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward deleteSfxm(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		this.demoService.deleteSfxm(inDto);
		setOkTipMsg("收费项目删除成功", response);
		return mapping.findForward(null);
	}

	public ActionForward buildReportDataObject(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto inDto = (BaseDto) getSessionAttribute(request,
				"QUERYCATALOGS4PRINT_QUERYDTO");
		List catalogList = catalogList = this.g4Reader.queryForList(
				"Demo.queryCatalogsForPrintLimitRows4DemoWithMysql", inDto);
		Dto dto = new BaseDto();

		dto
				.put("zbr", getSessionContainer(request).getUserInfo()
						.getUsername());

		dto.put("zbsj", G4Utils.getCurrentTime());
		ReportData reportData = new ReportData();
		reportData.setParametersDto(dto);
		reportData.setFieldsList(catalogList);
		reportData
				.setReportFilePath("/report/jasper/app/hisCatalogReport4App.jasper");
		getSessionContainer(request).setReportData("hisCatalogReport4App",
				reportData);
		return mapping.findForward(null);
	}

	public ActionForward callPrc(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		inDto.put("myname", getSessionContainer(request).getUserInfo()
				.getUsername());
		Dto outDto = this.demoService.callPrc(inDto);
		String result = outDto.getAsString("result");
		result = result + " " + inDto.getAsString("number1") + "+"
				+ inDto.getAsString("number2") + "="
				+ outDto.getAsString("sum");
		outDto.put("result", result);
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "存储过程调用成功");
		write(outDto.toJson(), response);
		return mapping.findForward(null);
	}

	public ActionForward batchSql(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		inDto.put("count", "3");
		inDto.put("ggsj", inDto.getAsTimestamp("ggsj"));
		inDto.put("yybm", "03010001");
		this.demoService.batchSaveSfxmDomains(inDto);
		setOkTipMsg("保存成功(以batch方式一次性向数据库服务器批量提交了3条SQL语句)", response);
		return mapping.findForward(null);
	}
}