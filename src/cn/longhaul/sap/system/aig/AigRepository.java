package cn.longhaul.sap.system.aig;

import cn.longhaul.sap.system.info.TransferInfo;

public abstract class AigRepository
{
  public static AigTransferInfo getTransferInfo()
  {
    return new TransferInfo();
  }
}