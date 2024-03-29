package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.service.UserService;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class UserAction extends BaseAction
{
  private UserService userService = (UserService)super.getService("userService");

  private OrganizationService organizationService = (OrganizationService)super.getService("organizationService");

  public ActionForward userInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    super.removeSessionAttribute(request, "deptid");
    Dto inDto = new BaseDto();
    String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
    inDto.put("deptid", deptid);
    Dto outDto = this.organizationService.queryDeptinfoByDeptid(inDto);
    request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
    request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
    UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
    request.setAttribute("login_account", userInfoVo.getAccount());
    return mapping.findForward("manageUserView");
  }

  public ActionForward departmentTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto dto = new BaseDto();
    String nodeid = request.getParameter("node");
    dto.put("parentid", nodeid);
    Dto outDto = this.organizationService.queryDeptItems(dto);
    write(outDto.getAsString("jsonString"), response);
    return mapping.findForward(null);
  }

  public ActionForward queryUsersForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String deptid = request.getParameter("deptid");
    if (G4Utils.isNotEmpty(deptid)) {
      setSessionAttribute(request, "deptid", deptid);
    }
    if (!G4Utils.isEmpty(request.getParameter("firstload")))
      dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
    else {
      dto.put("deptid", super.getSessionAttribute(request, "deptid"));
    }
    dto.put("usertype", "2");
    UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
    if (WebUtils.getParamValue("DEFAULT_ADMIN_ACCOUNT", request).equals(userInfoVo.getAccount())) {
      dto.remove("usertype");
    }
    if (WebUtils.getParamValue("DEFAULT_DEVELOP_ACCOUNT", request).equals(userInfoVo.getAccount())) {
      dto.remove("usertype");
    }
    List userList = this.g4Reader.queryForPage("User.queryUsersForManage", dto);
    Integer pageCount = (Integer)this.g4Reader.queryForObject("User.queryUsersForManageForPageCount", dto);
    String jsonString = JsonHelper.encodeList2PageJson(userList, pageCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward saveUserItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    Dto outDto = this.userService.saveUserItem(inDto);
    String jsonString = JsonHelper.encodeObject2Json(outDto);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward deleteUserItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String strChecked = request.getParameter("strChecked");
    Dto inDto = new BaseDto();
    inDto.put("strChecked", strChecked);
    this.userService.deleteUserItems(inDto);
    setOkTipMsg("用户数据删除成功", response);
    return mapping.findForward(null);
  }

  public ActionForward updateUserItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    this.userService.updateUserItem(inDto);
    setOkTipMsg("用户数据修改成功", response);
    return mapping.findForward(null);
  }

  public ActionForward userGrantInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    super.removeSessionAttribute(request, "USERID_USERACTION");
    String userid = request.getParameter("userid");
    super.setSessionAttribute(request, "USERID_USERACTION", userid);
    return mapping.findForward("selectRoleTreeView");
  }

  public ActionForward selectMenuInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("selectMenuTreeView");
  }

  public ActionForward saveSelectedRole(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto inDto = new BaseDto();
    inDto.put("roleid", request.getParameter("roleid"));
    inDto.put("userid", super.getSessionAttribute(request, "USERID_USERACTION"));
    this.userService.saveSelectedRole(inDto);
    setOkTipMsg("您选择的人员角色关联数据保存成功", response);
    return mapping.findForward(null);
  }

  public ActionForward saveSelectedMenu(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto inDto = new BaseDto();
    inDto.put("menuid", request.getParameter("menuid"));
    inDto.put("userid", super.getSessionAttribute(request, "USERID_USERACTION"));
    this.userService.saveSelectedMenu(inDto);
    setOkTipMsg("您选择的人员菜单关联数据保存成功", response);
    return mapping.findForward(null);
  }
}