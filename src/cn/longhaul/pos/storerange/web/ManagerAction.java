package cn.longhaul.pos.storerange.web;

import cn.longhaul.pos.storerange.service.ManagerService;
import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class ManagerAction extends BaseAction
{
  private ManagerService managerService = (ManagerService)super
    .getService("brandService");

  public ActionForward brandInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("brandlist");
  }

  public ActionForward brandList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List list = this.managerService.getBrandList(dto);
    int count = this.managerService.getBrandCount(dto);
    String jsonString = JsonHelper.encodeList2PageJson(list, Integer.valueOf(count), 
      "yyyy-MM-dd hh:mm:ss");
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward saveBrand(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    this.managerService.saveBrand(dto);
    setOkTipMsg("保存成功", response);
    return null;
  }

  public ActionForward updateBrand(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    this.managerService.updateBrand(dto);
    setOkTipMsg("更新成功", response);
    return mapping.findForward(null);
  }

  public ActionForward delBrand(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    this.managerService.delBrand(dto);
    setOkTipMsg("更新成功", response);
    return mapping.findForward(null);
  }

  public ActionForward brandSaleInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("brandsale");
  }

  public ActionForward saveBrandSale(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    SessionContainer cont = WebUtils.getSessionContainer(request);
    String deptid = cont.getUserInfo().getDeptid();
    dto.put("deptid", deptid);
    this.managerService.saveBrandSale(dto);
    setOkTipMsg("保存成功", response);
    return null;
  }

  public ActionForward queryBrandSaleInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("querybrandsale");
  }

  public ActionForward queryBrandSale(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String deptid = dto.getAsString("deptid");
    if ((deptid == null) || (deptid.equals(""))) {
      SessionContainer cont = WebUtils.getSessionContainer(request);
      deptid = cont.getUserInfo().getDeptid();
      dto.put("deptid", deptid);
    }
    List list = this.managerService.getBrandSaleList(dto);

    String jsonString = JsonHelper.encodeList2PageJson(list, Integer.valueOf(list.size()), 
      "yyyy-MM-dd hh:mm:ss");
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward deptTreeList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    Dto outDto = this.managerService.getDeptTree(dto);
    write(outDto.getAsString("jsonString"), response);
    return mapping.findForward(null);
  }

  public ActionForward brandSaleInit2(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("brandsale2");
  }

  public ActionForward saveBrandSale2(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws IOException
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    SessionContainer cont = WebUtils.getSessionContainer(request);
    String deptid = cont.getUserInfo().getDeptid();
    dto.put("deptid", deptid);
    try {
      this.managerService.saveBrandSale2(dto);
      setOkTipMsg("保存成功", response);
    } catch (Exception e) {
      setErrTipMsg("保存失败", response);
      e.printStackTrace();
    }

    return null;
  }
}