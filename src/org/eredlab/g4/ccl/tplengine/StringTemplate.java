package org.eredlab.g4.ccl.tplengine;

public class StringTemplate
  implements DefaultTemplate
{
  private String resource;

  public StringTemplate(String pResource)
  {
    this.resource = pResource;
  }

  public StringTemplate()
  {
  }

  public String getTemplateResource()
  {
    return getResource();
  }

  public void setTemplateResource(String pResource)
  {
    this.resource = pResource;
  }

  public String getResource() {
    return this.resource;
  }

  public void setResource(String resource) {
    this.resource = resource;
  }
}