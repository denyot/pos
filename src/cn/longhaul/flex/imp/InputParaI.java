package cn.longhaul.flex.imp;

import cn.longhaul.flex.Structure;
import java.util.ArrayList;
import java.util.HashMap;

public abstract interface InputParaI
{
  public abstract ArrayList<Structure> getInputStrutPara();

  public abstract HashMap<String, Object> getParameters();

  public abstract void setParameters(HashMap<String, Object> paramHashMap);

  public abstract void setInputStrutPara(ArrayList<Structure> paramArrayList);
}