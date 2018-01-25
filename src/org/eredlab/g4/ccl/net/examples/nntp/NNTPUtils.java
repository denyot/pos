package org.eredlab.g4.ccl.net.examples.nntp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.util.StringTokenizer;
import org.eredlab.g4.ccl.net.io.DotTerminatedMessageReader;
import org.eredlab.g4.ccl.net.nntp.Article;
import org.eredlab.g4.ccl.net.nntp.NNTPClient;

public class NNTPUtils
{
  public static Article[] getArticleInfo(NNTPClient client, int lowArticleNumber, int highArticleNumber)
    throws IOException
  {
    Reader reader = null;
    Article[] articles = (Article[])null;
    reader = 
      (DotTerminatedMessageReader)client.retrieveArticleInfo(
      lowArticleNumber, 
      highArticleNumber);

    if (reader != null) {
      String theInfo = readerToString(reader);
      StringTokenizer st = new StringTokenizer(theInfo, "\n");

      int count = st.countTokens();
      articles = new Article[count];
      int index = 0;

      while (st.hasMoreTokens()) {
        StringTokenizer stt = new StringTokenizer(st.nextToken(), "\t");
        Article article = new Article();
        article.setArticleNumber(Integer.parseInt(stt.nextToken()));
        article.setSubject(stt.nextToken());
        article.setFrom(stt.nextToken());
        article.setDate(stt.nextToken());
        article.setArticleId(stt.nextToken());
        article.addHeaderField("References", stt.nextToken());
        articles[(index++)] = article;
      }
    } else {
      return null;
    }

    return articles;
  }

  public static String readerToString(Reader reader)
  {
    String temp = null;
    StringBuffer sb = null;
    BufferedReader bufReader = new BufferedReader(reader);

    sb = new StringBuffer();
    try {
      temp = bufReader.readLine();
      while (temp != null) {
        sb.append(temp);
        sb.append("\n");
        temp = bufReader.readLine();
      }
    } catch (IOException e) {
      e.printStackTrace();
    }

    return sb.toString();
  }
}