package org.eredlab.g4.arm.service;

import cn.longhaul.sap.system.aig.AigTransferInfo;
import java.util.Date;
import javax.servlet.ServletRequest;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface RFCMonitorService extends BaseService
{
  public abstract void saveRfcInvokeInfo(Dto paramDto);

  public abstract int saveStartParam(String paramString, AigTransferInfo paramAigTransferInfo, Date paramDate, ServletRequest paramServletRequest);

  public abstract void saveEndParam(int paramInt, AigTransferInfo paramAigTransferInfo, Date paramDate1, Date paramDate2, String paramString);

  public abstract void clearAll();
}