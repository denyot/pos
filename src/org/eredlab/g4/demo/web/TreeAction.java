package org.eredlab.g4.demo.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class TreeAction extends BaseAction {
	private OrganizationService organizationService = (OrganizationService) super
			.getService("organizationService");

	public ActionForward treeDemo1Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("treeDemo1View");
	}

	public ActionForward treeDemo2Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("treeDemo2View");
	}

	public ActionForward treeDemo3Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("treeDemo3View");
	}

	public ActionForward treeDemo4Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("treeDemo4View");
	}

	public ActionForward treeDemo5Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("treeDemo5View");
	}

	public ActionForward treeDemo6Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("treeDemo6View");
	}

	public ActionForward treeDemo7Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("treeDemo7View");
	}

	public ActionForward treeDemo8Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("treeDemo8View");
	}

	public ActionForward queryAreas(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = new BaseDto();
		String areacode = aForm.getTreeNodeUID4Clicked(request);
		dto.put("areacode", areacode);
		dto.put("length", Integer.valueOf(areacode.length() + 2));
		List list = null;
		if (areacode.equals("00"))
			list = this.g4Reader.queryForList(
					"Demo.queryAreas4Tree4FirstLevel", dto);
		else {
			list = this.g4Reader.queryForList("Demo.queryAreas4Tree", dto);
		}
		for (int i = 0; i < list.size(); i++) {
			Dto node = (BaseDto) list.get(i);
			if (node.getAsString("id").length() == 6)
				node.put("leaf", new Boolean(true));
			else {
				node.put("leaf", new Boolean(false));
			}
		}
		String jsonString = JsonHelper.encodeObject2Json(list);
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryAreas4CheckTree(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = new BaseDto();
		String areacode = aForm.getTreeNodeUID4Clicked(request);
		dto.put("areacode", areacode);
		dto.put("length", Integer.valueOf(areacode.length() + 2));
		List list = null;
		if (areacode.equals("00"))
			list = this.g4Reader.queryForList(
					"Demo.queryAreas4Tree4FirstLevel", dto);
		else {
			list = this.g4Reader.queryForList("Demo.queryAreas4Tree", dto);
		}
		for (int i = 0; i < list.size(); i++) {
			Dto node = (BaseDto) list.get(i);
			node.put("checked", new Boolean(false));
			if (node.getAsString("id").length() == 6)
				node.put("leaf", new Boolean(true));
			else {
				node.put("leaf", new Boolean(false));
			}
		}
		String jsonString = JsonHelper.encodeObject2Json(list);
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryAreas4CheckTree2(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = new BaseDto();
		String areacode = aForm.getTreeNodeUID4Clicked(request);
		dto.put("areacode", areacode);
		dto.put("length", Integer.valueOf(areacode.length() + 2));
		List list = null;
		if (areacode.equals("00"))
			list = this.g4Reader.queryForList(
					"Demo.queryAreas4Tree4FirstLevel", dto);
		else {
			list = this.g4Reader.queryForList("Demo.queryAreas4Tree", dto);
		}
		for (int i = 0; i < list.size(); i++) {
			Dto node = (BaseDto) list.get(i);
			node.put("checked", new Boolean(false));
			if (node.getAsString("id").length() == 4)
				node.put("leaf", new Boolean(true));
			else {
				node.put("leaf", new Boolean(false));
			}
		}
		String jsonString = JsonHelper.encodeObject2Json(list);
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward departmentTreeInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto dto = new BaseDto();
		String nodeid = request.getParameter("node");
		dto.put("parentid", nodeid);
		List deptList = this.g4Reader.queryForList(
				"Demo.queryDeptItemsByDto4TreeGridDemo", dto);
		Dto deptDto = new BaseDto();
		for (int i = 0; i < deptList.size(); i++) {
			deptDto = (BaseDto) deptList.get(i);
			if (deptDto.getAsString("leaf").equals("1"))
				deptDto.put("leaf", new Boolean(true));
			else
				deptDto.put("leaf", new Boolean(false));
			if (deptDto.getAsString("id").length() == 6)
				deptDto.put("expanded", new Boolean(true));
		}
		String jsonString = JsonHelper.encodeObject2Json(deptList);
		super.write(jsonString, response);
		return mapping.findForward(null);
	}
}