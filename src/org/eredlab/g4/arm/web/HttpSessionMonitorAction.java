package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.MonitorService;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.SessionListener;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class HttpSessionMonitorAction extends BaseAction
{
  private MonitorService monitorService = (MonitorService)getService("monitorService");

  public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("sessionMonitorView");
  }

  public ActionForward getSessionList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm cForm = (CommonActionForm)form;
    Dto dto = cForm.getParamAsDto(request);
    List sessionList = this.g4Reader.queryForPage("Monitor.queryHttpSessions", dto);
    Integer pageCount = (Integer)this.g4Reader.queryForObject("Monitor.queryHttpSessionsForPageCount", dto);
    String jsonString = encodeList2PageJson(sessionList, pageCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward killSession(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String strChecked = request.getParameter("strChecked");
    String[] sessionid = strChecked.split(",");
    Dto delDto = new BaseDto();
    String msg = "选中的会话已杀死!";
    for (int i = 0; i < sessionid.length; i++) {
      String seid = sessionid[i];
      delDto.put("sessionid", seid);
      if (!seid.equalsIgnoreCase(request.getSession().getId())) {
        this.monitorService.deleteHttpSession(delDto);
        HttpSession session = SessionListener.getSessionByID(seid);
        if (G4Utils.isNotEmpty(seid)) {
          SessionContainer sessionContainer = (SessionContainer)session.getAttribute("SessionContainer");
          sessionContainer.setUserInfo(null);
          sessionContainer.cleanUp();
        }
      } else {
        msg = msg + " 提示：不能自杀哦!";
      }
    }
    setOkTipMsg(msg, response);
    return mapping.findForward(null);
  }
}