package org.eredlab.g4.ccl.tplengine;

public class FileTemplate
  implements DefaultTemplate
{
  private String resource;

  public FileTemplate(String pResource)
  {
    this.resource = pResource;
  }

  public FileTemplate()
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