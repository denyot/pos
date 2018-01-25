package org.eredlab.g4.ccl.net.examples;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import org.eredlab.g4.ccl.net.ftp.FTPClient;
import org.eredlab.g4.ccl.net.ftp.FTPConnectionClosedException;
import org.eredlab.g4.ccl.net.ftp.FTPReply;

public final class ftp
{
  public static final String USAGE = "Usage: ftp [-s] [-b] <hostname> <username> <password> <remote file> <local file>\n\nDefault behavior is to download a file and use ASCII transfer mode.\n\t-s store file on server (upload)\n\t-b use binary transfer mode\n";

  public static final void main(String[] args)
  {
    int base = 0;
    boolean storeFile = false; boolean binaryTransfer = false; boolean error = false;

    for (base = 0; base < args.length; base++)
    {
      if (args[base].startsWith("-s")) {
        storeFile = true; } else {
        if (!args[base].startsWith("-b")) break;
        binaryTransfer = true;
      }

    }

    if (args.length - base != 5)
    {
      System.err.println("Usage: ftp [-s] [-b] <hostname> <username> <password> <remote file> <local file>\n\nDefault behavior is to download a file and use ASCII transfer mode.\n\t-s store file on server (upload)\n\t-b use binary transfer mode\n");
      System.exit(1);
    }

    String server = args[(base++)];
    String username = args[(base++)];
    String password = args[(base++)];
    String remote = args[(base++)];
    String local = args[base];

    FTPClient ftp = new FTPClient();
    ftp.addProtocolCommandListener(new PrintCommandListener(
      new PrintWriter(System.out)));
    try
    {
      ftp.connect(server);
      System.out.println("Connected to " + server + ".");

      int reply = ftp.getReplyCode();

      if (!FTPReply.isPositiveCompletion(reply))
      {
        ftp.disconnect();
        System.err.println("FTP server refused connection.");
        System.exit(1);
      }
    }
    catch (IOException e)
    {
      if (ftp.isConnected())
      {
        try
        {
          ftp.disconnect();
        }
        catch (IOException localIOException1)
        {
        }
      }

      System.err.println("Could not connect to server.");
      e.printStackTrace();
      System.exit(1);
    }

    try
    {
      if (!ftp.login(username, password))
      {
        ftp.logout();
        error = true;

        if (ftp.isConnected())
        {
          try
          {
            ftp.disconnect();
          }
          catch (IOException localIOException2)
          {
          }
        }
      }
      else
      {
        System.out.println("Remote system is " + ftp.getSystemName());

        if (binaryTransfer) {
          ftp.setFileType(2);
        }

        ftp.enterLocalPassiveMode();

        if (storeFile)
        {
          InputStream input = new FileInputStream(local);

          ftp.storeFile(remote, input);

          input.close();
        }
        else
        {
          OutputStream output = new FileOutputStream(local);

          ftp.retrieveFile(remote, output);

          output.close();
        }

        ftp.logout();
      }
    }
    catch (FTPConnectionClosedException e) {
      error = true;
      System.err.println("Server closed connection.");
      e.printStackTrace();

      if (ftp.isConnected())
      {
        try
        {
          ftp.disconnect();
        }
        catch (IOException localIOException3)
        {
        }
      }
    }
    catch (IOException e)
    {
      error = true;
      e.printStackTrace();

      if (ftp.isConnected())
      {
        try
        {
          ftp.disconnect();
        }
        catch (IOException localIOException4)
        {
        }
      }
    }
    finally
    {
      if (ftp.isConnected())
      {
        try
        {
          ftp.disconnect();
        }
        catch (IOException localIOException5)
        {
        }
      }

    }

    System.exit(error ? 1 : 0);
  }
}