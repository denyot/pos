package org.eredlab.g4.ccl.net.examples;

import java.io.IOException;
import java.io.PrintStream;
import org.eredlab.g4.ccl.net.bsd.RCommandClient;

public final class rshell
{
  public static final void main(String[] args)
  {
    if (args.length != 4)
    {
      System.err.println(
        "Usage: rshell <hostname> <localuser> <remoteuser> <command>");
      System.exit(1);
      return;
    }

    RCommandClient client = new RCommandClient();

    String server = args[0];
    String localuser = args[1];
    String remoteuser = args[2];
    String command = args[3];
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
      client.rcommand(localuser, remoteuser, command);
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
      System.err.println("Could not execute command.");
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