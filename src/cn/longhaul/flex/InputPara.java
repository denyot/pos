package cn.longhaul.flex;

import cn.longhaul.flex.imp.InputParaI;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;

public class InputPara
  implements InputParaI, Serializable
{
  private static final long serialVersionUID = 1L;
  private ArrayList<Structure> inputStrutPara = new ArrayList();
  private HashMap<String, Object> parameters = new HashMap();

  public ArrayList<Structure> getInputStrutPara() {
    return this.inputStrutPara;
  }

  public HashMap<String, Object> getParameters() {
    return this.parameters;
  }

  public void setParameters(HashMap<String, Object> parameters) {
    this.parameters = parameters;
  }

  public void setInputStrutPara(ArrayList<Structure> inputStrutPara) {
    this.inputStrutPara = inputStrutPara;
  }
}