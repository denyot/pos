package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.MonitorService;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class EventTrackAction extends BaseAction
{
  private MonitorService monitorService = (MonitorService)super.getService("monitorService");

  public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("eventTrackView");
  }

  public ActionForward queryEvents(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List eventList = null;
    Integer totalCount = null;
    if (G4Utils.defaultJdbcTypeOracle()) {
      eventList = this.g4Reader.queryForPage("Monitor.queryEventsByDto", dto);
      totalCount = (Integer)this.g4Reader.queryForObject("Monitor.queryEventsByDtoForPageCount", dto);
    } else {
      eventList = this.g4Reader.queryForPage("Monitor.queryEventsByDtoMysql", dto);
      totalCount = (Integer)this.g4Reader.queryForObject("Monitor.queryEventsByDtoForPageCountMysql", dto);
    }
    String jsonString = encodeList2PageJson(eventList, totalCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward deleteEvents(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    this.monitorService.deleteEvent(dto);
    if (dto.getAsString("type").equalsIgnoreCase("reset"))
      setOkTipMsg("重置成功,所有事件已被清除!", response);
    else
      setOkTipMsg("数据删除成功!", response);
    return mapping.findForward(null);
  }
}