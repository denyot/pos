package org.eredlab.g4.ccl.net.examples;

import java.io.IOException;
import java.io.PrintStream;
import java.net.InetAddress;
import org.eredlab.g4.ccl.net.DaytimeTCPClient;
import org.eredlab.g4.ccl.net.DaytimeUDPClient;

public final class daytime
{
  public static final void daytimeTCP(String host)
    throws IOException
  {
    DaytimeTCPClient client = new DaytimeTCPClient();

    client.setDefaultTimeout(60000);
    client.connect(host);
    System.out.println(client.getTime().trim());
    client.disconnect();
  }

  public static final void daytimeUDP(String host) throws IOException
  {
    DaytimeUDPClient client = new DaytimeUDPClient();

    client.setDefaultTimeout(60000);
    client.open();
    System.out.println(client.getTime(
      InetAddress.getByName(host)).trim());
    client.close();
  }

  public static final void main(String[] args)
  {
    if (args.length == 1)
    {
      try
      {
        daytimeTCP(args[0]);
      }
      catch (IOException e)
      {
        e.printStackTrace();
        System.exit(1);
      }
    }
    else if ((args.length == 2) && (args[0].equals("-udp")))
    {
      try
      {
        daytimeUDP(args[1]);
      }
      catch (IOException e)
      {
        e.printStackTrace();
        System.exit(1);
      }
    }
    else
    {
      System.err.println("Usage: daytime [-udp] <hostname>");
      System.exit(1);
    }
  }
}