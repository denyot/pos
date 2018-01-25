package org.eredlab.g4.ccl.tplengine;

public class TemplateType
{
  private String type;
  private String description;
  public static final TemplateType VELOCITY = new TemplateType("Velocity", "Velocity engine");

  public TemplateType(String pType, String pDescription)
  {
    this.type = pType;
    this.description = pDescription;
  }

  public String getType() {
    return this.type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getDescription() {
    return this.description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}