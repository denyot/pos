package cn.longhaul.flex;

import java.util.HashMap;

public class Structure
{
  private String structureName;
  private HashMap<String, Object> structureMap = new HashMap();

  public String getStructureName() { return this.structureName; }

  public void setStructureName(String structureName) {
    this.structureName = structureName;
  }
  public HashMap<String, Object> getStructureMap() {
    return this.structureMap;
  }
  public void setStructureMap(HashMap<String, Object> structureMap) {
    this.structureMap = structureMap;
  }
}