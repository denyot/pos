package cn.longhaul.sap.system.esb.hesssion;

import cn.longhaul.sap.system.aig.AigTransferInfo;

public abstract interface SapTransfer
{
  public abstract AigTransferInfo transferInfoAig(String paramString, AigTransferInfo paramAigTransferInfo)
    throws Exception;
}