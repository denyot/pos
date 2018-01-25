package org.eredlab.g4.ccl.net.examples.nntp;

import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import org.eredlab.g4.ccl.net.examples.PrintCommandListener;
import org.eredlab.g4.ccl.net.nntp.Article;
import org.eredlab.g4.ccl.net.nntp.NNTPClient;
import org.eredlab.g4.ccl.net.nntp.NewsgroupInfo;

public class ExtendedNNTPOps
{
  NNTPClient client;

  public ExtendedNNTPOps()
  {
    this.client = new NNTPClient();
    this.client.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out)));
  }

  public void demo(String host, String user, String password)
  {
    try {
      this.client.connect(host);

      boolean success = this.client.authenticate(user, password);
      if (success)
        System.out.println("Authentication succeeded");
      else {
        System.out.println("Authentication failed, error =" + this.client.getReplyString());
      }

      NewsgroupInfo testGroup = new NewsgroupInfo();
      this.client.selectNewsgroup("alt.test", testGroup);
      int lowArticleNumber = testGroup.getFirstArticle();
      int highArticleNumber = lowArticleNumber + 100;
      Article[] articles = NNTPUtils.getArticleInfo(this.client, lowArticleNumber, highArticleNumber);

      for (int i = 0; i < articles.length; i++) {
        System.out.println(articles[i].getSubject());
      }

      NewsgroupInfo[] fanGroups = this.client.listNewsgroups("alt.fan.*");
      for (int i = 0; i < fanGroups.length; i++)
        System.out.println(fanGroups[i].getNewsgroup());
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }

  public static void main(String[] args)
  {
    if (args.length != 3) {
      System.err.println("usage: ExtendedNNTPOps nntpserver username password");
      System.exit(1);
    }

    ExtendedNNTPOps ops = new ExtendedNNTPOps();
    ops.demo(args[0], args[1], args[2]);
  }
}