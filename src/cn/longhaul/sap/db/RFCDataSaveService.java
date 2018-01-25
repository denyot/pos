package cn.longhaul.sap.db;

import java.util.ArrayList;

public abstract interface RFCDataSaveService
{
  public abstract boolean rfcDataSave(ArrayList<?> paramArrayList, String paramString1, String paramString2)
    throws Exception;
}