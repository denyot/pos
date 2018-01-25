package cn.longhaul.sap.system.info;

import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;

public class TransferParameter
  implements AigTransferParameter, Serializable
{
  private static final long serialVersionUID = -6037933914373958409L;
  private ArrayList<AigTransferStructure> structureList = new ArrayList();

  private HashMap<String, Object> parameters = new HashMap();

  public void appendStructure(AigTransferStructure structure)
  {
    this.structureList.add(structure);
  }

  public void setParameter(String key, Object value)
  {
    this.parameters.put(key, value);
  }

  public ArrayList<AigTransferStructure> getStructureList() {
    return this.structureList;
  }

  public void setStructureList(ArrayList<AigTransferStructure> structureList) {
    this.structureList = structureList;
  }

  public HashMap<String, Object> getParameters() {
    return this.parameters;
  }

  public void setParameters(HashMap<String, Object> parameters) {
    this.parameters = parameters;
  }

  public AigTransferStructure getTransStructure(String structureName)
  {
    return new TransferStructure(structureName);
  }
}