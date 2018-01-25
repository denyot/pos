package cn.longhaul.job.test;


public class MapString
{
  public static void main(String[] args)
  {
    String mapstring = "";
    for (int i = 1; i < 8; i++) {
      mapstring = mapstring + ",{name:'week" + i + "'}";
    }
    System.out.println(mapstring);
  }
}