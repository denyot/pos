package org.eredlab.g4.demo.web;

import java.io.PrintStream;
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
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class GridAction extends BaseAction {
	public ActionForward gridDemo1Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("gridDemo1View");
	}

	public ActionForward gridDemo2Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("gridDemo2View");
	}

	public ActionForward gridDemo3Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("gridDemo3View");
	}

	public ActionForward gridDemo4Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("gridDemo4View");
	}

	public ActionForward gridDemo5Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("gridDemo5View");
	}

	public ActionForward gridDemo6Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super
				.removeSessionAttribute(request,
						"GRIDACTION_QUERYBALANCEINFO_DTO");
		return mapping.findForward("gridDemo6View");
	}

	public ActionForward gridDemo7Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("gridDemo7View");
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

	public ActionForward queryBalanceInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List list = new ArrayList();
		if (G4Utils.defaultJdbcTypeOracle())
			list = this.g4Reader.queryForPage("Demo.queryBalanceInfo", dto);
		else {
			list = this.g4Reader
					.queryForPage("Demo.queryBalanceInfoMysql", dto);
		}
		Integer countInteger = (Integer) this.g4Reader.queryForObject(
				"Demo.countBalanceInfo", dto);
		super.setSessionAttribute(request, "GRIDACTION_QUERYBALANCEINFO_DTO",
				dto);
		String jsonString = encodeList2PageJson(list, countInteger,
				"yyyy-MM-dd");
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward sumBalanceInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto dto = (BaseDto) super.getSessionAttribute(request,
				"GRIDACTION_QUERYBALANCEINFO_DTO");
		Dto sumDto = new BaseDto();
		if (G4Utils.defaultJdbcTypeOracle())
			sumDto = (BaseDto) this.g4Reader.queryForObject(
					"Demo.sumBalanceInfo", dto);
		else if (G4Utils.defaultJdbcTypeMysql()) {
			sumDto = (BaseDto) this.g4Reader.queryForObject(
					"Demo.sumBalanceInfoMysql", dto);
		}
		sumDto.put("success", new Boolean(true));
		String jsonString = JsonHelper.encodeObject2Json(sumDto);
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveDirtyDatas(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		List list = aForm.getGridDirtyData(request);
		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);
			System.out.println("脏数据:\n" + dto);
		}

		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "数据已提交到后台,但演示程序没有将其持久化到数据库.<br>"
				+ request.getParameter("dirtydata"));
		super.write(outDto.toJson(), response);
		return mapping.findForward(null);
	}
}