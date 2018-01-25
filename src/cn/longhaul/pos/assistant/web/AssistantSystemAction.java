package cn.longhaul.pos.assistant.web;

import cn.longhaul.pos.assistant.util.ImportAssistantInfo;
import cn.longhaul.pos.order.service.OrderService;
import java.io.PrintStream;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class AssistantSystemAction extends BaseAction
{
  private OrderService orderservice = (OrderService)getService("orderService2");
  private static Log log = LogFactory.getLog(AssistantSystemAction.class);

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
    return mapping.findForward("assistantSystem");
  }

  public ActionForward getAssistantPositions(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";

    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("userid", werks);
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    List configerDto = this.g4Reader.queryForList("assistantsystem.getAssistantPosition", dto);

    String jsonString = JsonHelper.encodeObject2Json(configerDto);
    jsonString = "{ROOT:" + jsonString + "}";
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward saveAssistantInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

    String deptId = "";
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    int i = this.g4Dao.update("assistantsystem.saveAssistantInfo", dto);

    if (i != 0)
      write("{success:true,msg:'成功'}", response);
    else
      write("{success:false,msg:'失败'}", response);
    return mapping.findForward(null);
  }

  public ActionForward savePosition(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    int i = this.g4Dao.update("assistantsystem.savePosition", dto);

    if (i != 0)
      write("{success:true,msg:'成功'}", response);
    else
      write("{success:false,msg:'失败'}", response);
    return mapping.findForward(null);
  }

  public ActionForward getAsistantInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    List list = this.g4Reader.queryForPage("assistantsystem.getAssistantInfo", dto);
    Integer totalCount = (Integer)this.g4Reader.queryForObject("assistantsystem.getTotalAssistantCount", dto);
    String jsonString = encodeList2PageJson(list, totalCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward delAssistantInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    String assistantnos = request.getParameter("assistantnos");

    String[] assistantnoses = assistantnos.split(",");
    dto.put("assistantnoses", assistantnoses);
    for (int i = 0; i < assistantnoses.length; i++) {
      assistantnoses[i] = assistantnoses[i].trim();
    }
    int i = this.g4Dao.delete("assistantsystem.delAssistantInfo", dto);
    if (i != 0)
      write("{success:true,msg:'成功'}", response);
    else
      write("{success:false,msg:'失败'}", response);
    return mapping.findForward(null);
  }

  public ActionForward updateAssistantInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }if (Integer.parseInt(dto.getAsString("zt")) == 1) {
      dto.put("lzsj", "");
    }
    int i = this.g4Dao.update("assistantsystem.xgAssistantInfo", dto);
    if (i != 0)
      write("{success:true,msg:'成功'}", response);
    else {
      write("{success:false,msg:'失败'}", response);
    }
    return mapping.findForward(null);
  }

  public ActionForward delPosotion(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    String positionIds = request.getParameter("positionIds");

    String[] position = positionIds.split(",");
    dto.put("position", position);

    int i = this.g4Dao.update("assistantsystem.delPosotion", dto);
    if (i != 0)
      write("{success:true,msg:'成功'}", response);
    else {
      write("{success:false,msg:'失败'}", response);
    }
    return mapping.findForward(null);
  }

  public ActionForward getAssistansInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aform = (CommonActionForm)form;
    Dto dto = aform.getParamAsDto(request);
    String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    dto.put("werks", werks);
    dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
    List data = null;
    int count = 0;
    if ("1000".equals(werks)) {
      data = this.g4Reader.queryForPage("assistantsystem.getAssistant", dto);
      count = ((Integer)this.g4Reader.queryForObject("assistantsystem.getAssistantcount", dto)).intValue();
    } else {
      data = this.g4Reader.queryForPage("assistantsystem.getAssistanInfo", dto);
      count = ((Integer)this.g4Reader.queryForObject("assistantsystem.getAssistanInfocount", dto)).intValue();
    }

    for (int i = 0; i < data.size(); i++) {
      if (!werks.equals(((Dto)data.get(i)).getAsString("store_inital"))) {
        ((Dto)data.get(i)).put("status", "4");
      }

      if (Integer.parseInt(((Dto)data.get(i)).getAsString("status")) == 1)
        ((Dto)data.get(i)).put("status", "在职");
      else if (Integer.parseInt(((Dto)data.get(i)).getAsString("status")) == 2)
        ((Dto)data.get(i)).put("status", "离职");
      else if (Integer.parseInt(((Dto)data.get(i)).getAsString("status")) == 3)
        ((Dto)data.get(i)).put("status", "调离");
      else if (Integer.parseInt(((Dto)data.get(i)).getAsString("status")) == 4) {
        ((Dto)data.get(i)).put("status", "调入");
      }
    }
    String jsonstr = JsonHelper.encodeList2PageJson(data, Integer.valueOf(count), "YYYY-MM-dd");

    System.out.println(jsonstr);
    write(jsonstr, response);
    return mapping.findForward(null);
  }

  public ActionForward getAssistant(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aform = (CommonActionForm)form;
    Dto dto = aform.getParamAsDto(request);
    String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    dto.put("werks", werks);
    dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
    List data = null;
    int count = 0;
    if ("1000".equals(werks)) {
      data = this.g4Reader.queryForPage("assistantsystem.getAssistant", dto);
      count = ((Integer)this.g4Reader.queryForObject("assistantsystem.getAssistantcount", dto)).intValue();
    } else {
      data = this.g4Reader.queryForPage("assistantsystem.getAssistanInfo", dto);
      count = ((Integer)this.g4Reader.queryForObject("assistantsystem.getAssistanInfocount", dto)).intValue();
    }

    for (int i = 0; i < data.size(); i++)
    {
      if (Integer.parseInt(((Dto)data.get(i)).getAsString("status")) == 1)
        ((Dto)data.get(i)).put("status", "在职");
      else if (Integer.parseInt(((Dto)data.get(i)).getAsString("status")) == 2)
        ((Dto)data.get(i)).put("status", "离职");
      else if (Integer.parseInt(((Dto)data.get(i)).getAsString("status")) == 3) {
        ((Dto)data.get(i)).put("status", "调离");
      }
    }
    String jsonstr = JsonHelper.encodeList2PageJson(data, Integer.valueOf(count), "YYYY-MM-dd");

    System.out.println(jsonstr);
    write(jsonstr, response);
    return mapping.findForward(null);
  }

  public ActionForward getAssistentStatus(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aform = (CommonActionForm)form;
    List data = this.g4Dao.queryForList("assistantsystem.getAssistantStatus");

    Dto dto = new BaseDto();

    dto.put("id", "");
    dto.put("value", "全部");
    data.add(0, dto);

    String jstr = JsonHelper.encodeObject2Json(data);

    jstr = "{ROOT:" + jstr + "}";
    write(jstr, response);
    return mapping.findForward(null);
  }

  public ActionForward addAssistantPromotion(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    int i = this.g4Dao.update("assistantsystem.addAssistantPromotion", dto);
    int j = this.g4Dao.update("assistantsystem.upAssistantPosition", dto);
    if ((i != 0) && (j != 0))
      write("{success:true,msg:'成功'}", response);
    else {
      write("{success:false,msg:'失败'}", response);
    }
    return mapping.findForward(null);
  }

  public ActionForward addAssistantscheduling(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    dto.put("werks", werks);
    dto.put("status", Integer.valueOf(3));
    if ((werks.equals(dto.get("md"))) || (dto.get("store_inital").equals(dto.get("md")))) {
      dto.put("status", Integer.valueOf(1));
    }
    int i = this.g4Dao.update("assistantsystem.addAssistantscheduling", dto);
    int j = this.g4Dao.update("assistantsystem.upAssiatantByAssid", dto);
    if ((i != 0) && (j != 0))
      write("{success:true,msg:'成功'}", response);
    else {
      write("{success:false,msg:'失败'}", response);
    }
    return mapping.findForward(null);
  }

  public ActionForward getWerksInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aform = (CommonActionForm)form;
    Dto dto = aform.getParamAsDto(request);

    List data = this.g4Dao.queryForList("assistantsystem.getWerksInfo", dto);
    for (int i = 0; i < data.size(); i++) {
      ((Dto)data.get(i)).put("mdid", ((Dto)data.get(i)).get("werks"));
      ((Dto)data.get(i)).put("mdname", ((Dto)data.get(i)).get("name1"));
    }
    String jstr = JsonHelper.encodeObject2Json(data);
    jstr = "{ROOT:" + jstr + "}";
    System.out.println(jstr);

    write(jstr, response);
    return mapping.findForward(null);
  }

  public ActionForward importAssistantInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aform = (CommonActionForm)form;
    FormFile file = aform.getTheFile();
    Dto dto = new BaseDto();
    List list = ImportAssistantInfo.read(file.getInputStream());
    int num = 0;
    for (int i = 0; i < list.size(); i++) {
      ((Map)list.get(i)).put("rzsj", ((Map)list.get(i)).get("rzsj").toString().replaceAll("/", "-"));
      dto.clear();
      String store_number = (String)this.g4Dao.queryForObject("assistantsystem.getWerksByWerksName", ((Map)list.get(i)).get("store_name"));
      dto.put("store_number", store_number);
      dto.put("position", ((Map)list.get(i)).get("position"));
      String zwid = (String)this.g4Dao.queryForObject("assistantsystem.getZwByZwname", dto);

      if (G4Utils.isNotEmpty(zwid)) {
        dto.put("degreename", ((Map)list.get(i)).get("position"));
        this.g4Dao.update("assistantsystem.savePosition", dto);
        zwid = (String)this.g4Dao.queryForObject("assistantsystem.getZwByZwname", dto);
      }

      ((Map)list.get(i)).put("store_number", store_number);
      ((Map)list.get(i)).put("store_inital", store_number);
      ((Map)list.get(i)).put("position", zwid);
      num += this.g4Dao.update("assistantsystem.insertAssistantInfo", list.get(i));
    }
    if (num != 0)
      write("{success:true,msg:'成功'}", response);
    else {
      write("{success:false,msg:'失败'}", response);
    }
    return mapping.findForward(null);
  }
}