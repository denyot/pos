package cn.longhaul.pos.dailygold.web;

import cn.longhaul.pos.order.service.OrderService;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class DailyGoldSystemAction extends BaseAction
{
  private OrderService orderservice = (OrderService)getService("orderService2");
  private static Log log = LogFactory.getLog(DailyGoldSystemAction.class);

  public ActionForward asistantInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";

    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("userid", werks);
    } else {
      return mapping.findForward("authorization");
    }
    return mapping.findForward("dailyGoldSystem");
  }

  public ActionForward getDailyGoldInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("store_numbers", werks);
    } else {
      return mapping.findForward("authorization");
    }
    List list = this.g4Reader.queryForPage("dailygoldsystem.getDailyGoldInfo", dto);
    Integer totalCount = (Integer)this.g4Reader.queryForObject("dailygoldsystem.getTotalDailyGoldCount", dto);
    String jsonString = encodeList2PageJson(list, totalCount, "yyyy-MM-dd");
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward saveDailyGoldInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("store_numbers", werks);
      dto.put("golddate", G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss"));
    } else {
      return mapping.findForward("authorization");
    }
    try {
      this.g4Dao.insert("dailygoldsystem.saveDailyGoldInfo", dto);
      write("{success:true,msg:'成功'}", response);
    } catch (Exception e) {
      e.printStackTrace();
      write("{success:false,msg:'失败'}", response);
      throw e;
    }
    return mapping.findForward(null);
  }
}