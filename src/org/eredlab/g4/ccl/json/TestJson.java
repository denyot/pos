package org.eredlab.g4.ccl.json;

import java.io.PrintStream;

public class TestJson
{
  public static void main(String[] args)
  {
    String string = "[{\"xmid\":\"1000143024\",\"sfdlbm\":\"01\",\"xmmc\":\"盐酸头孢他美酯片1\"},{\"xmid\":\"1000143023\",\"sfdlbm\":\"01\",\"xmmc\":\"盐酸头孢他美酯片(薄膜衣)3\"}]";
    string = string.substring(1, string.length() - 1);
    System.out.println(string);
    String[] strings = string.split("},");
    for (int i = 0; i < strings.length; i++) {
      if (i != strings.length - 1)
      {
        int tmp44_43 = i;
        String[] tmp44_42 = strings; tmp44_42[tmp44_43] = (tmp44_42[tmp44_43] + "}");
      }
      System.out.println(strings[i]);
    }
  }
}