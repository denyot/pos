package org.eredlab.g4.ccl.net.telnet;

public class SuppressGAOptionHandler extends TelnetOptionHandler
{
  public SuppressGAOptionHandler(boolean initlocal, boolean initremote, boolean acceptlocal, boolean acceptremote)
  {
    super(TelnetOption.SUPPRESS_GO_AHEAD, initlocal, initremote, 
      acceptlocal, acceptremote);
  }

  public SuppressGAOptionHandler()
  {
    super(TelnetOption.SUPPRESS_GO_AHEAD, false, false, false, false);
  }

  public int[] answerSubnegotiation(int[] suboptionData, int suboptionLength)
  {
    return null;
  }

  public int[] startSubnegotiationLocal()
  {
    return null;
  }

  public int[] startSubnegotiationRemote()
  {
    return null;
  }
}