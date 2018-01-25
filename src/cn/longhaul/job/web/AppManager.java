package cn.longhaul.job.web;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.net.URLStreamHandler;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionServlet;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.demo.service.DemoService;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class AppManager extends BaseAction
{
  private DemoService demoService = (DemoService)getService("demoService");

  public ActionForward appMangerInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("appmanager");
  }

  public ActionForward doUpload(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    System.err.println("-------");
    CommonActionForm cForm = (CommonActionForm)form;

    FormFile myFile = cForm.getFile1();

    String savePath = getServlet().getServletContext().getRealPath("/") + "uploaddata/";

    File file = new File(savePath);
    if (!file.exists()) {
      file.mkdir();
    }

    savePath = savePath + G4Utils.getCurDate() + "/";
    File file1 = new File(savePath);
    if (!file1.exists()) {
      file1.mkdir();
    }

    String fileName = myFile.getFileName();

    File fileToCreate = new File(savePath, fileName);

    if (!fileToCreate.exists()) {
      FileOutputStream os = new FileOutputStream(fileToCreate);
      os.write(myFile.getFileData());
      os.flush();
      os.close();
    }
    else {
      FileOutputStream os = new FileOutputStream(fileToCreate);
      os.write(myFile.getFileData());
      os.flush();
      os.close();
    }

    Dto inDto = cForm.getParamAsDto(request);
    inDto.put("title", G4Utils.isEmpty(inDto.getAsString("title")) ? fileName : inDto.getAsString("title"));
    inDto.put("filesize", Integer.valueOf(myFile.getFileSize()));
    inDto.put("path", savePath + fileName);
    this.demoService.doUploadApp(inDto);
    setOkTipMsg("应用上传成功", response);
    return mapping.findForward(null);
  }

  public ActionForward queryFileDatas(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String sqlid = G4Utils.defaultJdbcTypeOracle() ? "Demo.queryAppFiles4Oracle" : "Demo.queryAppFiles";
    List list = this.g4Reader.queryForPage(sqlid, dto);
    Integer countInteger = (Integer)this.g4Reader.queryForObject("Demo.countAppFiles", dto);
    String jsonString = JsonHelper.encodeList2PageJson(list, countInteger, "yyyy-MM-dd HH:mm:ss");
    super.write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward queryAppConfigDatas(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    System.err.println(dto.get("fileid") + "---");

    List list = this.g4Reader.queryForPage("Demo.queryAppConfigs", dto);
    Integer countInteger = (Integer)this.g4Reader.queryForObject("Demo.countAppConfigs", dto);
    String jsonString = JsonHelper.encodeList2PageJson(list, countInteger, "yyyy-MM-dd HH:mm:ss");
    System.out.println("list大小---" + list.size());
    super.write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward startappmanger1(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    System.out.println("进入运行------");
    String classname = request.getParameter("appname");
    String methedname = request.getParameter("appmethod");
    String path = request.getParameter("path");
    String paramvalue = request.getParameter("paramvalue");
    String paramtype = request.getParameter("paramtype");

    if (!path.endsWith(".class")) {
      System.out.println("进入加载jar1----");
      if (paramvalue.split(",").length > 1)
        getDrivers(path, methedname, classname, paramvalue, paramtype, "1");
      else {
        getDrivers(path, methedname, classname, paramvalue, paramtype, null);
      }
      return mapping.findForward(null);
    }

    String paths = null;
    if (path.lastIndexOf("\\") > 4) {
      paths = path.substring(0, path.lastIndexOf("/")) + "\\";
    }
    else {
      paths = path.substring(0, path.lastIndexOf("/")) + "\\";
    }

    String[] name = classname.split("\\.");
    URLClassLoader loader = null;
    try {
      URL[] urls = new URL[1];
      URLStreamHandler streamHandler = null;
      String respository = new URL("file", null, paths).toString();
      urls[0] = new URL(null, respository, streamHandler);
      loader = new URLClassLoader(urls);
    } catch (Exception e) {
      e.printStackTrace();
    }
    String[] args = (String[])null;
    Class className = null;
    try {
      className = loader.loadClass(name[0]);
      Object t = className.newInstance();

      if (paramvalue.split(",").length == 0) {
        Method[] m = className.getMethods();
        for (int i = 0; i < m.length; i++)
          if (m[i].getName().equals(methedname)) {
            m[i].invoke(t, args);
            System.out.println("成功执行了参数的方法--");
          }
      }
      else {
        String[] ptype = paramtype.split(",");
        String[] parms = paramvalue.split(",");
        Method[] m1 = className.getDeclaredMethods();
        for (int i = 0; i < m1.length; i++) {
          if (methedname.equals(m1[i].getName())) {
            System.out.println("方法名:" + m1[i].getName());
            Class[] pType = m1[i].getParameterTypes();
            System.out.println("长度a:" + pType.length + "  " + "长度b:" + ptype.length);
            int a = 0;
            if (pType.length == ptype.length) {
              Object[] argList = new Object[pType.length];
              for (int j = 0; j < pType.length; j++) {
                if (pType[j].getName().equals("java.lang." + ptype[j]))
                {
                  if (pType[j].getName().equals("java.lang.String")) {
                    argList[j] = new String(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Integer")) {
                    argList[j] = new Integer(parms[j]);
                  }

                  if (pType[j].getName().equals("java.lang.Long")) {
                    argList[j] = new Long(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Float")) {
                    argList[j] = new Float(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Boolean")) {
                    argList[j] = new Boolean(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Byte")) {
                    argList[j] = new Byte(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Double")) {
                    argList[j] = new Double(parms[j]);
                  }

                  a++;
                }
              }

              if (a == pType.length) {
                System.out.println(" 成功----" + a);
                m1[i].invoke(t, argList);
              }
            }
          }
        }
      }

    }
    catch (ClassNotFoundException e)
    {
      e.printStackTrace();
    }

    return mapping.findForward(null);
  }

  public ActionForward startappmanger(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String classname = request.getParameter("titles");
    String methedname = request.getParameter("methodname");
    String path = request.getParameter("path");

    String paths = null;
    if (path.lastIndexOf("\\") > 4) {
      paths = path.substring(0, path.lastIndexOf("/")) + "\\";
    }
    else {
      paths = path.substring(0, path.lastIndexOf("/")) + "\\";
    }

    Enumeration pNames = request.getParameterNames();
    List list = new ArrayList();
    HashMap hm = new HashMap();
    HashMap hm1 = new HashMap();
    String ppvalue = null;
    while (pNames.hasMoreElements()) {
      String name = (String)pNames.nextElement();
      String value = null;
      String pvalue = null;
      String ptype = null;
      if (name.startsWith("org_field_orgParent_")) {
        value = request.getParameter(name);
        pvalue = name.split("-")[1];
        hm.put(pvalue, value);
        if (!list.contains(pvalue)) {
          list.add(pvalue);
        }
      }
      if (name.startsWith("org_field_orgName_")) {
        value = request.getParameter(name);
        ppvalue = value;
        ptype = name.split("-")[1];
        hm1.put(ptype, value);
        if (!list.contains(ptype)) {
          list.add(ptype);
        }
      }
    }
    int[] c = new int[list.size()];
    for (int j = 0; j < list.size(); j++) {
      String aa = (String)list.get(j);
      String a = aa.substring(3, aa.length());
      if (Integer.parseInt(a) != 0) {
        c[j] = Integer.parseInt(a);
      }
    }
    String s = maopaosort(c);
    StringBuffer parm = new StringBuffer();
    StringBuffer parmtype = new StringBuffer();
    String[] as = s.split(",");
    for (int i = 0; i < as.length; i++) {
      if ((hm.get(as[i]) != null) && (hm1.get(as[i]) != null)) {
        parm.append(hm1.get(as[i]) + ",");
        parmtype.append(hm.get(as[i]) + ",");
      }

    }

    if (!path.endsWith(".class")) {
      System.out.println("进入加载jar----");

      getDrivers(path, methedname, classname, parm.toString(), parmtype.toString(), ppvalue);
      return mapping.findForward(null);
    }

    String[] name = classname.split("\\.");
    URLClassLoader loader = null;
    try {
      URL[] urls = new URL[1];
      URLStreamHandler streamHandler = null;
      String respository = new URL("file", null, paths).toString();
      urls[0] = new URL(null, respository, streamHandler);
      loader = new URLClassLoader(urls);
    } catch (Exception e) {
      e.printStackTrace();
    }
    String[] args = (String[])null;
    Class className = null;
    try {
      className = loader.loadClass(name[0]);
      Object t = className.newInstance();

      System.out.println(ppvalue);
      if (StringUtils.isBlank(ppvalue)) {
        Method[] m = className.getMethods();
        for (int i = 0; i < m.length; i++)
          if (m[i].getName().equals(methedname)) {
            m[i].invoke(t, args);
            System.out.println("成功执行了无参数的方法--");
          }
      }
      else {
        String[] ptype = parmtype.toString().split(",");
        String[] parms = parm.toString().split(",");
        Method[] m1 = className.getDeclaredMethods();
        for (int i = 0; i < m1.length; i++) {
          if (methedname.equals(m1[i].getName())) {
            System.out.println("方法名:" + m1[i].getName());
            Class[] pType = m1[i].getParameterTypes();
            System.out.println("长度a:" + pType.length + "  " + "长度b:" + ptype.length);
            int a = 0;
            if (pType.length == ptype.length) {
              Object[] argList = new Object[pType.length];
              for (int j = 0; j < pType.length; j++) {
                if (pType[j].getName().equals("java.lang." + ptype[j]))
                {
                  if (pType[j].getName().equals("java.lang.String")) {
                    argList[j] = new String(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Integer")) {
                    argList[j] = new Integer(parms[j]);
                  }

                  if (pType[j].getName().equals("java.lang.Long")) {
                    argList[j] = new Long(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Float")) {
                    argList[j] = new Float(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Boolean")) {
                    argList[j] = new Boolean(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Byte")) {
                    argList[j] = new Byte(parms[j]);
                  }
                  if (pType[j].getName().equals("java.lang.Double")) {
                    argList[j] = new Double(parms[j]);
                  }

                  a++;
                }
              }

              if (a == pType.length) {
                System.out.println(" 成功----" + a);
                m1[i].invoke(t, argList);
              }
            }
          }
        }
      }

    }
    catch (ClassNotFoundException e)
    {
      e.printStackTrace();
    }
    return mapping.findForward(null);
  }

  public static Set<String> getDrivers(String file, String methedname, String classname, String paramvalue, String paramtype, String ppvalue)
    throws InstantiationException, IllegalAccessException, SecurityException, NoSuchMethodException, IllegalArgumentException, InvocationTargetException
  {
    JarFile jar = null;
    Set set = new HashSet();
    try {
      jar = new JarFile(file);
    } catch (IOException e) {
      return null;
    }
    Object t = null;
    Enumeration entries = jar.entries();
    String[] args = (String[])null;
    URLClassLoader loader = getLoad(file);

    Class cc = null;
    while (entries.hasMoreElements()) {
      JarEntry entry = (JarEntry)entries.nextElement();
      if (entry.getName().endsWith(classname)) {
        String name = entry.getName();
        name = name.substring(0, name.length() - 6);
        name = name.replaceAll("/", ".");
        try
        {
          cc = loader.loadClass(name);
          t = cc.newInstance();
        }
        catch (ClassNotFoundException localClassNotFoundException) {
        }
      }
    }
    if (StringUtils.isBlank(ppvalue)) {
      Method[] m = cc.getMethods();
      for (int i = 0; i < m.length; i++)
        if (m[i].getName().equals(methedname)) {
          System.out.println("方法名:=" + m[i].getName());
          System.out.println("methedname:=" + methedname);
          m[i].invoke(t, args);
          System.out.println("成功执行了无参数的方法--");
        }
    }
    else {
      String[] ptype = paramtype.split(",");
      String[] parms = paramvalue.split(",");
      Method[] m1 = cc.getDeclaredMethods();
      for (int i = 0; i < m1.length; i++) {
        if (methedname.equals(m1[i].getName())) {
          System.out.println("方法名:" + m1[i].getName());
          Class[] pType = m1[i].getParameterTypes();
          System.out.println("长度a:" + pType.length + "  " + "长度b:" + ptype.length);
          int a = 0;
          if (pType.length == ptype.length) {
            Object[] argList = new Object[pType.length];
            for (int j = 0; j < pType.length; j++) {
              if (pType[j].getName().equals("java.lang." + ptype[j]))
              {
                if (pType[j].getName().equals("java.lang.String")) {
                  argList[j] = new String(parms[j]);
                }
                if (pType[j].getName().equals("java.lang.Integer")) {
                  argList[j] = new Integer(parms[j]);
                }

                if (pType[j].getName().equals("java.lang.Long")) {
                  argList[j] = new Long(parms[j]);
                }
                if (pType[j].getName().equals("java.lang.Float")) {
                  argList[j] = new Float(parms[j]);
                }
                if (pType[j].getName().equals("java.lang.Boolean")) {
                  argList[j] = new Boolean(parms[j]);
                }
                if (pType[j].getName().equals("java.lang.Byte")) {
                  argList[j] = new Byte(parms[j]);
                }
                if (pType[j].getName().equals("java.lang.Double")) {
                  argList[j] = new Double(parms[j]);
                }
                a++;
              }
            }

            if (a == pType.length) {
              System.out.println(" 成功----" + a);
              m1[i].invoke(t, argList);
            }
          }
        }

      }

    }

    return set;
  }

  public static URLClassLoader getLoad(String file)
  {
    URL[] url = (URL[])null;
    try {
      url = new URL[] { new URL("file:" + file) };
    } catch (MalformedURLException e) {
      return null;
    }
    URLClassLoader loader = new URLClassLoader(url);
    return loader;
  }

  public static Class<?> getDynamic(String file, String clazz)
  {
    URLClassLoader loader = getLoad(file);
    try {
      return loader.loadClass(clazz);
    } catch (ClassNotFoundException e) {
      e.printStackTrace();
    }
    return null;
  }

  public ActionForward delFiles(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String[] strChecked = dto.getAsString("strChecked").split(",");
    for (int i = 0; i < strChecked.length; i++) {
      String fileid = strChecked[i];
      Dto fileDto = (BaseDto)this.g4Reader.queryForObject("Demo.queryFileByAppFileID", fileid);
      String path = fileDto.getAsString("path");
      File file = new File(path);
      file.delete();
      this.demoService.delFileApp(fileid);
    }
    setOkTipMsg("应用删除成功", response);
    return mapping.findForward(null);
  }

  public ActionForward delAppConfig(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String[] strChecked = dto.getAsString("strChecked").split(",");
    for (int i = 0; i < strChecked.length; i++) {
      String fileid = strChecked[i];
      String path = dto.getAsString("path");
      System.out.println("---" + path);

      this.demoService.delAppConfig(fileid);
    }
    setOkTipMsg("数据删除成功", response);
    return mapping.findForward(null);
  }

  public String maopaosort(int[] array)
  {
    int mark = 0;
    for (int i = 0; i < array.length; i++)
    {
      for (int j = 0; j < array.length; j++)
      {
        if (array[i] <= array[j])
        {
          mark = array[i];
          array[i] = array[j];
          array[j] = mark;
        }
      }
    }
    StringBuffer sb = new StringBuffer();
    StringBuffer sb1 = new StringBuffer();
    for (int i = 0; i < array.length; i++) {
      sb.append(array[i]);
    }
    String[] s = sb.toString().split("2");
    for (int i = 0; i < s.length; i++) {
      if (!StringUtils.isBlank(s[i])) {
        sb1.append("gen2" + s[i] + ",");
      }
    }

    return sb1.toString();
  }

  public ActionForward savemanger(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws IOException
  {
    System.out.println("保存");
    String classname = request.getParameter("titles");
    String methedname = request.getParameter("methodname");
    String path = request.getParameter("path");
    String appid = request.getParameter("appid");
    System.out.println("appid===" + appid);

    Enumeration pNames = request.getParameterNames();
    List list = new ArrayList();
    HashMap hm = new HashMap();
    HashMap hm1 = new HashMap();
    String ppvalue = null;
    while (pNames.hasMoreElements()) {
      String name = (String)pNames.nextElement();
      String value = null;
      String pvalue = null;
      String ptype = null;
      if (name.startsWith("org_field_orgParent_")) {
        value = request.getParameter(name);
        pvalue = name.split("-")[1];
        hm.put(pvalue, value);
        if (!list.contains(pvalue)) {
          list.add(pvalue);
        }
      }
      if (name.startsWith("org_field_orgName_")) {
        value = request.getParameter(name);
        ppvalue = value;
        ptype = name.split("-")[1];
        hm1.put(ptype, value);
        if (!list.contains(ptype)) {
          list.add(ptype);
        }
      }
    }
    int[] c = new int[list.size()];
    for (int j = 0; j < list.size(); j++) {
      String aa = (String)list.get(j);
      String a = aa.substring(3, aa.length());
      if (Integer.parseInt(a) != 0) {
        c[j] = Integer.parseInt(a);
      }
    }
    String s = maopaosort(c);
    StringBuffer parm = new StringBuffer();
    StringBuffer parmtype = new StringBuffer();
    String[] as = s.split(",");
    for (int i = 0; i < as.length; i++) {
      if ((hm.get(as[i]) != null) && (hm1.get(as[i]) != null)) {
        parm.append(hm1.get(as[i]) + ",");
        parmtype.append(hm.get(as[i]) + ",");
      }
    }

    System.out.println("参数值---" + parm.toString());
    System.out.println("参数类型---" + parmtype.toString());
    CommonActionForm cForm = (CommonActionForm)form;
    Dto inDto = cForm.getParamAsDto(request);
    inDto.put("classname", classname);
    inDto.put("methodname", methedname);
    inDto.put("path", path);
    inDto.put("parm", parm.toString());
    inDto.put("parmtype", parmtype.toString());
    inDto.put("appid", appid);

    this.demoService.saveAppConfig(inDto);
    setOkTipMsg("保存成功", response);

    return mapping.findForward(null);
  }
}