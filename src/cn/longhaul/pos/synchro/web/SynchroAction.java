package cn.longhaul.pos.synchro.web;

import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.datasyn.DataSynToAIGServiceImpl;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class SynchroAction extends BaseAction
{
  private static Log log = LogFactory.getLog(SynchroAction.class);

  public ActionForward synchro(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    Dto retDto = new BaseDto();
    String[] synchroFuncName = dto.getAsString("rfcName").split(",");
    DataSynToAIGServiceImpl service = new DataSynToAIGServiceImpl();
    try {
      for (int i = 0; i < synchroFuncName.length; i++)
        service.dataSyncToAigService(synchroFuncName[i]);
      retDto.put("success", "执行同步成功");
    } catch (Exception e) {
      e.printStackTrace();

      retDto.put("error", e.getMessage());
    }

    String retStr = JsonHelper.encodeObject2Json(retDto);

    write(retStr, response);

    return mapping.findForward(null);
  }

  public ActionForward getSynRFC(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    Dto retDto = new BaseDto();
    String parentId = "001003";
    List list = this.g4Dao.queryForList("commonsqlmap.getAllRfcInfo", parentId);

    String retStr = JsonHelper.encodeObject2Json(list);

    write(retStr, response);

    return mapping.findForward(null);
  }

  public ActionForward synchroMatnr(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    Dto retDto = new BaseDto();

    String[] matnrs = dto.getAsString("matnrstr").split(",");
    String matnrstr = "";
    try
    {
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
      rfctransferinfo.getImportPara().setParameter("I_CURRDATE", "20120101");
      AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_MATNR");

      for (int i = 0; i < matnrs.length; i++) {
        rfctablevbap.setValue("MATNR", matnrs[i]);
        rfctablevbap.appendRow();
      }
      rfctransferinfo.appendTable(rfctablevbap);

      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_01", rfctransferinfo);
      ArrayList matnrList = out.getAigTable("IT_MARA");

      for (int i = 0; i < matnrList.size(); i++) {
        Dto item = new BaseDto();
        item.putAll((Map)matnrList.get(i));
        int ifExists = ((Integer)this.g4Dao.queryForObject("synchrosystem.getMatnrIfExists", item)).intValue();
        if (ifExists > 0)
          this.g4Dao.update("synchrosystem.updateMatnrInfo", item);
        else {
          this.g4Dao.insert("synchrosystem.insertMatnrInfo", item);
        }
        matnrstr = matnrstr + item.getAsString("MATNR") + ",";
      }
      matnrstr = matnrstr.length() > 0 ? matnrstr.substring(0, matnrstr.length() - 1) : matnrstr;
      retDto.put("success", "同步成功!");
    } catch (Exception e) {
      retDto.put("error", "同步时出现错误,错误信息：" + e.getMessage());
      e.printStackTrace();
    }

    retDto.put("matnrsuccess", matnrstr);

    String retStr = JsonHelper.encodeObject2Json(retDto);

    write(retStr, response);

    return mapping.findForward(null);
  }

  public ActionForward synchroCharg(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    Dto retDto = new BaseDto();

    String[] chargs = dto.getAsString("chargstr").split(",");
    String chargstr = "";
    try
    {
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

      AigTransferTable rfctablevbap = rfctransferinfo.getTable("BT_CHARG");

      for (int i = 0; i < chargs.length; i++) {
        rfctablevbap.setValue("CHARG", chargs[i]);
        rfctablevbap.appendRow();
      }
      rfctransferinfo.appendTable(rfctablevbap);

      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_03", rfctransferinfo);
      ArrayList chargList = out.getAigTable("IT_CHARG");

      for (int i = 0; i < chargList.size(); i++) {
        Dto item = new BaseDto();
        item.putAll((Map)chargList.get(i));
        int ifExists = ((Integer)this.g4Dao.queryForObject("synchrosystem.getChargIfExists", item)).intValue();
        if (ifExists > 0)
          this.g4Dao.update("synchrosystem.updateChargInfo", item);
        else {
          this.g4Dao.insert("synchrosystem.insertChargInfo", item);
        }
        chargstr = chargstr + item.getAsString("CHARG") + ",";
      }
      chargstr = chargstr.length() > 0 ? chargstr.substring(0, chargstr.length() - 1) : chargstr;
      retDto.put("success", "同步成功!");
    } catch (Exception e) {
      retDto.put("error", "同步时出现错误,错误信息：" + e.getMessage());
      e.printStackTrace();
    }

    retDto.put("chargsuccess", chargstr);

    String retStr = JsonHelper.encodeObject2Json(retDto);

    write(retStr, response);

    return mapping.findForward(null);
  }

  public ActionForward synchrotemp(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    Dto retDto = new BaseDto();
    String[] temps = dto.getAsString("tempstr").split(",");
    String tempstr = "";
    try
    {
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

      AigTransferTable rfctablevbap = rfctransferinfo.getTable("GT_ZTZMSX");

      for (int i = 0; i < temps.length; i++) {
        rfctablevbap.setValue("ZZMHN", temps[i]);
        rfctablevbap.appendRow();
      }
      rfctransferinfo.appendTable(rfctablevbap);

      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_52", rfctransferinfo);
      ArrayList tempList = out.getAigTable("IT_ZTZMSX");

      for (int i = 0; i < tempList.size(); i++) {
        Dto item = new BaseDto();
        item.putAll((Map)tempList.get(i));
        int ifExists = ((Integer)this.g4Dao.queryForObject("synchrosystem.getTempIfExists", item)).intValue();
        if (ifExists > 0)
          this.g4Dao.update("synchrosystem.updateTempInfo", item);
        else {
          this.g4Dao.insert("synchrosystem.insertTempInfo", item);
        }
        tempstr = tempstr + item.getAsString("ZZMHN") + ",";
      }
      tempstr = tempstr.length() > 0 ? tempstr.substring(0, tempstr.length() - 1) : tempstr;
      retDto.put("success", "同步成功!");
    } catch (Exception e) {
      retDto.put("error", "同步时出现错误,错误信息：" + e.getMessage());
      e.printStackTrace();
    }
    retDto.put("tempsuccess", tempstr);

    String retStr = JsonHelper.encodeObject2Json(retDto);

    write(retStr, response);

    return mapping.findForward(null);
  }
  
	public ActionForward synchroStockByWerks(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		Dto retDto = new BaseDto();

		String werk = dto.getAsString("werk");
		try {
			
			AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
			AigTransferParameter rfcpara = rfctransferinfo.getTransParameter();
			rfcpara.setParameter("I_WERKS", werk);
			rfctransferinfo.setImportPara(rfcpara);

			SapTransferImpl transfer = new SapTransferImpl();
			AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_46", rfctransferinfo);
			ArrayList stockList = out.getAigTable("IT_STOCK");

			for (int i = 0; i < stockList.size(); i++) {
				
				Dto item = new BaseDto();
				item.putAll((Map) stockList.get(i));
				int ifExists = ((Integer) this.g4Dao.queryForObject("synchrosystem.getStockIfExists", item)).intValue();
				if (ifExists > 0)
					this.g4Dao.update("synchrosystem.updateStockInfo", item);
				else {
					this.g4Dao.insert("synchrosystem.insertStockInfo", item);
				}
			}
			retDto.put("success", "同步成功!");
		} catch (Exception e) {
			retDto.put("error", "同步时出现错误,错误信息：" + e.getMessage());
			e.printStackTrace();
		}

		retDto.put("werksuccess", werk);
		String retStr = JsonHelper.encodeObject2Json(retDto);
		write(retStr, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 同步促销代码
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward synchroCxdm(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		Dto retDto = new BaseDto();

		String aktnr = dto.getAsString("aktnrs");
		try {
			
			AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
			AigTransferParameter rfcpara = rfctransferinfo.getTransParameter();
			rfcpara.setParameter("AKTNRS", aktnr);
			rfctransferinfo.setImportPara(rfcpara);

			SapTransferImpl transfer = new SapTransferImpl();
			AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_66", rfctransferinfo);
			ArrayList stockList = out.getAigTable("IT_ZPJG");
			
			String[] aktnrs = aktnr.split(",");
			if(stockList.size()>0){
				Dto item = new BaseDto();
				item.put("aktnrs", aktnrs);
				//先删除前面关于促销代码的信息
				this.g4Dao.update("synchrosystem.deleteAktnr", item);
				this.g4Dao.update("synchrosystem.deleteAktnrCharg", item);//删除批次相关的
				
				for (int i = 0; i < stockList.size(); i++) {
					//添加促销代码信息
					item.clear();
					item.putAll((Map) stockList.get(i));
					if((!item.getAsString("CHARG").equals(""))&&item.getAsString("KSCHL").equals("Z087")){
						item.put("table", "z_rfc_store_54_it_z087");
					}else{
						item.put("table", "z_rfc_store_02_it_zpjg");
					}
					
					this.g4Dao.insert("synchrosystem.insertAktnr", item);
					
				}
				retDto.put("success", "已更改"+stockList.size()+"条");
			}else{
				retDto.put("error", "没有同步任何数据，请检查促销代码是否正确!");
			}
			
		} catch (Exception e) {
			retDto.put("error", "同步时出现错误,错误信息：" + e.getMessage());
			e.printStackTrace();
		}

		
		String retStr = JsonHelper.encodeObject2Json(retDto);
		write(retStr, response);
		return mapping.findForward(null);
	}

  public static void main(String[] args) {
    Double zsjz = Double.valueOf(2.9094944D);
    BigDecimal dec = new BigDecimal(zsjz.doubleValue());

    dec = dec.setScale(2, 4);

    zsjz = Double.valueOf(dec.doubleValue());

    System.out.println(zsjz);
  }
}