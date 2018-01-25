package cn.longhaul.flex;

import cn.longhaul.flex.imp.HelloBlazeDSI;
import cn.longhaul.flex.imp.HelloI;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;

public class HelloBlazeDS
  implements HelloBlazeDSI
{
  public String getHello(String String)
  {
    System.out.println("测试" + String);
    return "Hello BlazeDS!" + String;
  }
  public HelloI getHelloClass() {
    HelloI hello = new Hello();
    hello = new Hello();
    hello.setHelloid("2");
    hello.setHelloid("Name2");
    InputPara inputpara = new InputPara();

    ArrayList inputStrutPara = new ArrayList();

    Structure structure = new Structure();
    structure.setStructureName("I_STRUT");
    HashMap structureMap = new HashMap();
    structureMap.put("USREID", "124");
    structureMap.put("USERnAME", "test");
    structure.setStructureMap(structureMap);
    inputStrutPara.add(structure);
    inputpara.setInputStrutPara(inputStrutPara);
    HashMap parameters = new HashMap();
    parameters.put("KUNNR", "1001");
    parameters.put("WERKS", "1002");
    inputpara.setParameters(parameters);
    hello.setInputpara(inputpara);

    return hello;
  }
  public ArrayList<HelloI> setHelloClass(String test, HelloI hello) {
    System.out.println("_" + hello.getHelloid());
    System.out.println("+" + hello.getHelloname());

    ArrayList ret = new ArrayList();

    hello = new Hello();
    hello.setHelloid("2");
    hello.setHelloid("Name2");
    InputPara inputpara = new InputPara();

    ArrayList inputStrutPara = new ArrayList();

    Structure structure = new Structure();
    structure.setStructureName("I_STRUT");
    HashMap structureMap = new HashMap();
    structureMap.put("USREID", "124");
    structureMap.put("USERnAME", "test");
    structure.setStructureMap(structureMap);
    inputStrutPara.add(structure);
    inputpara.setInputStrutPara(inputStrutPara);
    HashMap parameters = new HashMap();
    parameters.put("KUNNR", "1001");
    parameters.put("WERKS", "1002");
    inputpara.setParameters(parameters);
    hello.setInputpara(inputpara);
    ret.add(hello);
    return ret;
  }
}