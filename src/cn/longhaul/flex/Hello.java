package cn.longhaul.flex;

import cn.longhaul.flex.imp.HelloI;
import cn.longhaul.flex.imp.InputParaI;
import java.io.Serializable;
import java.util.List;

public class Hello
  implements HelloI, Serializable
{
  private static final long serialVersionUID = 1L;
  private String helloid;
  private String helloname;
  private InputParaI inputpara;
  private List tablelist;

  public List getTablelist()
  {
    return this.tablelist;
  }
  public void setTablelist(List tablelist) {
    this.tablelist = tablelist;
  }

  public String getHelloid() {
    return this.helloid;
  }
  public void setHelloid(String helloid) {
    this.helloid = helloid;
  }
  public String getHelloname() {
    return this.helloname;
  }
  public void setHelloname(String helloname) {
    this.helloname = helloname;
  }
  public InputParaI getInputpara() {
    return this.inputpara;
  }
  public void setInputpara(InputParaI inputpara) {
    this.inputpara = inputpara;
  }
}