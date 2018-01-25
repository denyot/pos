package cn.longhaul.flex.imp;

import java.util.ArrayList;

public abstract interface HelloBlazeDSI
{
  public abstract String getHello(String paramString);

  public abstract HelloI getHelloClass();

  public abstract ArrayList<HelloI> setHelloClass(String paramString, HelloI paramHelloI);
}