package org.eredlab.g4.ccl.net.examples.nntp;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.Writer;
import org.eredlab.g4.ccl.net.examples.PrintCommandListener;
import org.eredlab.g4.ccl.net.io.Util;
import org.eredlab.g4.ccl.net.nntp.NNTPClient;
import org.eredlab.g4.ccl.net.nntp.NNTPReply;
import org.eredlab.g4.ccl.net.nntp.SimpleNNTPHeader;

public final class post
{
  public static final void main(String[] args)
  {
    FileReader fileReader = null;

    if (args.length < 1)
    {
      System.err.println("Usage: post newsserver");
      System.exit(1);
    }

    String server = args[0];

    BufferedReader stdin = new BufferedReader(new InputStreamReader(System.in));
    try
    {
      System.out.print("From: ");
      System.out.flush();

      String from = stdin.readLine();

      System.out.print("Subject: ");
      System.out.flush();

      String subject = stdin.readLine();

      SimpleNNTPHeader header = new SimpleNNTPHeader(from, subject);

      System.out.print("Newsgroup: ");
      System.out.flush();

      String newsgroup = stdin.readLine();
      header.addNewsgroup(newsgroup);
      while (true)
      {
        System.out.print("Additional Newsgroup <Hit enter to end>: ");
        System.out.flush();

        newsgroup = stdin.readLine().trim();

        if (newsgroup.length() == 0) {
          break;
        }
        header.addNewsgroup(newsgroup);
      }

      System.out.print("Organization: ");
      System.out.flush();

      String organization = stdin.readLine();

      System.out.print("References: ");
      System.out.flush();

      String references = stdin.readLine();

      if ((organization != null) && (organization.length() > 0)) {
        header.addHeaderField("Organization", organization);
      }
      if ((references != null) && (organization.length() > 0)) {
        header.addHeaderField("References", references);
      }
      header.addHeaderField("X-Newsreader", "NetComponents");

      System.out.print("Filename: ");
      System.out.flush();

      String filename = stdin.readLine();
      try
      {
        fileReader = new FileReader(filename);
      }
      catch (FileNotFoundException e)
      {
        System.err.println("File not found. " + e.getMessage());
        System.exit(1);
      }

      NNTPClient client = new NNTPClient();
      client.addProtocolCommandListener(new PrintCommandListener(
        new PrintWriter(System.out)));

      client.connect(server);

      if (!NNTPReply.isPositiveCompletion(client.getReplyCode()))
      {
        client.disconnect();
        System.err.println("NNTP server refused connection.");
        System.exit(1);
      }

      if (client.isAllowedToPost())
      {
        Writer writer = client.postArticle();

        if (writer != null)
        {
          writer.write(header.toString());
          Util.copyReader(fileReader, writer);
          writer.close();
          client.completePendingCommand();
        }
      }

      fileReader.close();

      client.logout();

      client.disconnect();
    }
    catch (IOException e)
    {
      e.printStackTrace();
      System.exit(1);
    }
  }
}