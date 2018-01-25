package cn.longhaul.sap.service;

import cn.longhaul.sap.syncbase.LinkBean;
import cn.longhaul.sap.syncbase.RFCInfo;
import java.util.ArrayList;
import java.util.List;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface SapSyncBaseService extends BaseService
{
  public abstract String getCurrdate(String paramString);

  public abstract boolean updateStatus(String paramString);

  public abstract boolean existCode(String paramString, Dto paramDto);

  public abstract String updateCodeSql(String paramString, Dto paramDto1, Dto paramDto2);

  public abstract boolean delCode(String paramString, Dto paramDto);

  public abstract boolean insertCode(String paramString, Dto paramDto1, Dto paramDto2, ArrayList<?> paramArrayList);

  public abstract List findRfcMapTableById(String paramString);

  public abstract List findSap_DDByName(String paramString);

  public abstract List findRfcInputParaById(String paramString);

  public abstract RFCInfo getRfcInfo(String paramString);

  public abstract boolean getTableData(LinkBean paramLinkBean);

  public abstract String createTableDDL(RFCInfo paramRFCInfo);

  public abstract boolean dataSavetoAig(String paramString1, String paramString2)
    throws Exception;

  public abstract boolean dataMtableSavetoAig(String paramString)
    throws Exception;

  public abstract boolean datasearch(String paramString1, String paramString2, String paramString3)
    throws Exception;

  public abstract RFCInfo searchMtableData(String paramString1, String paramString2, Dto paramDto)
    throws Exception;
}