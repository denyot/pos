package cn.longhaul.sap.service;

import cn.longhaul.sap.system.info.TransferAigInfo;

public abstract interface SapTransferService
{
  public abstract TransferAigInfo getRfcInfo(String paramString1, String paramString2);
}