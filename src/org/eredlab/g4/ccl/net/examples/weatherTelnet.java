package org.eredlab.g4.ccl.net.examples;

import java.io.IOException;
import org.eredlab.g4.ccl.net.telnet.TelnetClient;

public final class weatherTelnet
{
  public static final void main(String[] args)
  {
    TelnetClient telnet = new TelnetClient();
    try
    {
      telnet.connect("rainmaker.wunderground.com", 3000);
    }
    catch (IOException e)
    {
      e.printStackTrace();
      System.exit(1);
    }

    IOUtil.readWrite(telnet.getInputStream(), telnet.getOutputStream(), 
      System.in, System.out);
    try
    {
      telnet.disconnect();
    }
    catch (IOException e)
    {
      e.printStackTrace();
      System.exit(1);
    }

    System.exit(0);
  }
}