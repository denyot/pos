package org.eredlab.g4.ccl.net.telnet;

public class EchoOptionHandler extends TelnetOptionHandler
{
  public EchoOptionHandler(boolean initlocal, boolean initremote, boolean acceptlocal, boolean acceptremote)
  {
    super(TelnetOption.ECHO, initlocal, initremote, 
      acceptlocal, acceptremote);
  }

  public EchoOptionHandler()
  {
    super(TelnetOption.ECHO, false, false, false, false);
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