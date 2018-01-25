package org.eredlab.g4.ccl.id.generator;

import java.io.PrintStream;
import org.eredlab.g4.ccl.id.CreateIDException;

public class UUIDGenerator extends AbstractUUIDGenerator
{
  private String sep = "";

  public UUIDGenerator()
  {
  }

  public UUIDGenerator(String pSep) {
    this.sep = pSep;
  }

  protected String format(int intval) {
    String formatted = Integer.toHexString(intval);
    StringBuffer buf = new StringBuffer("00000000");
    buf.replace(8 - formatted.length(), 8, formatted);
    return buf.toString();
  }

  protected String format(short shortval) {
    String formatted = Integer.toHexString(shortval);
    StringBuffer buf = new StringBuffer("0000");
    buf.replace(4 - formatted.length(), 4, formatted);
    return buf.toString();
  }

  public String create() throws CreateIDException {
    StringBuffer sb = new StringBuffer(36);
    sb.append(format(getIP())).append(this.sep).append(format(getJVM())).append(
      this.sep).append(format(getHiTime())).append(this.sep).append(
      format(getLoTime())).append(this.sep).append(format(getCount()));
    return sb.toString();
  }

  private int getIP() {
	// TODO Auto-generated method stub
	return 0;
}

public static void main(String[] args) throws Exception
  {
    UUIDGenerator a = new UUIDGenerator();
    System.out.println(a.create().length());
  }
}