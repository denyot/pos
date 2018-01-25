package org.eredlab.g4.demo.esb.hessian.client;

import java.io.PrintStream;
import java.util.List;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class RunClient
{
  private IReader g4Reader;

  public static void main(String[] args)
  {
    queryBalanceInfoLimitRownum();
  }

  private static void sayHello() {
    HelloWorldClient client = (HelloWorldClient)SpringBeanLoader.getSpringBean("client_hession");
    String outString = client.sayHello("!");
    System.out.println(outString);
  }

  private static void queryBalanceInfo() {
    HelloWorldClient client = (HelloWorldClient)SpringBeanLoader.getSpringBean("client_hession");
    Dto outDto = client.queryBalanceInfo("BJLK1000000000935");
    System.out.println(outDto);
  }

  private static void queryBalanceInfoLimitRownum() {
    HelloWorldClient client = (HelloWorldClient)SpringBeanLoader.getSpringBean("client_hession");
    List outList = client.queryBalanceInfoLimitRownum(new Integer(10));
    for (int i = 0; i < outList.size(); i++)
      System.out.println((BaseDto)outList.get(i));
  }

  public void setG4Reader(IReader g4Reader)
  {
    this.g4Reader = g4Reader;
  }
}