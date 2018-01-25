package org.eredlab.g4.ccl.net.examples;

import java.io.IOException;
import java.io.PrintStream;
import org.eredlab.g4.ccl.net.bsd.RLoginClient;

public final class rlogin
{
  public static final void main(String[] args)
  {
    if (args.length != 4)
    {
      System.err.println(
        "Usage: rlogin <hostname> <localuser> <remoteuser> <terminal>");
      System.exit(1);
      return;
    }

    RLoginClient client = new RLoginClient();

    String server = args[0];
    String localuser = args[1];
    String remoteuser = args[2];
    String terminal = args[3];
    try
    {
      client.connect(server);
    }
    catch (IOException e)
    {
      System.err.println("Could not connect to server.");
      e.printStackTrace();
      System.exit(1);
    }

    try
    {
      client.rlogin(localuser, remoteuser, terminal);
    }
    catch (IOException e)
    {
      try
      {
        client.disconnect();
      }
      catch (IOException localIOException1) {
      }
      e.printStackTrace();
      System.err.println("rlogin authentication failed.");
      System.exit(1);
    }

    IOUtil.readWrite(client.getInputStream(), client.getOutputStream(), 
      System.in, System.out);
    try
    {
      client.disconnect();
    }
    catch (IOException e)
    {
      e.printStackTrace();
      System.exit(1);
    }

    System.exit(0);
  }
}