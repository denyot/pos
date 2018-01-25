package cn.longhaul.authority.web;

import cn.longhaul.authority.service.ManagerService;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class ManagerAction extends BaseAction
{
  private ManagerService managerService = (ManagerService)super
    .getService("managerService");

  public ActionForward managerInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("tocdemanager");
  }

  public ActionForward tcodeList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List list = this.managerService.getTcode(dto);
    int count = this.managerService.getTcodeCount(dto);
    String jsonString = JsonHelper.encodeList2PageJson(list, Integer.valueOf(count), "yyyy-MM-dd hh:mm:ss");
    write(jsonString, response);
    return mapping.findForward(null);
  }
}