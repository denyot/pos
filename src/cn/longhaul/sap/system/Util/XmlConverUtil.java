package cn.longhaul.sap.system.Util;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import net.sf.json.JSON;
import net.sf.json.JSONSerializer;
import net.sf.json.xml.XMLSerializer;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;

public class XmlConverUtil
{
  public static String maptoXml(Map<?, ?> map)
  {
    Document document = DocumentHelper.createDocument();
    Element nodeElement = document.addElement("node");
    for (Iterator localIterator = map.keySet().iterator(); localIterator.hasNext(); ) { Object obj = localIterator.next();
      Element keyElement = nodeElement.addElement("key");
      keyElement.addAttribute("label", String.valueOf(obj));
      keyElement.setText(String.valueOf(map.get(obj)));
    }
    return doc2String(document);
  }

  public static String listtoXml(List<?> list)
    throws Exception
  {
    Document document = DocumentHelper.createDocument();
    Element nodesElement = document.addElement("nodes");
    int i = 0;
    for (Iterator localIterator1 = list.iterator(); localIterator1.hasNext(); ) { Object o = localIterator1.next();
      Element nodeElement = nodesElement.addElement("node");
      if ((o instanceof Map)) {
        for (Iterator localIterator2 = ((Map)o).keySet().iterator(); localIterator2.hasNext(); ) { Object obj = localIterator2.next();
          Element keyElement = nodeElement.addElement("key");
          keyElement.addAttribute("label", String.valueOf(obj));
          keyElement.setText(String.valueOf(((Map)o).get(obj))); }
      }
      else {
        Element keyElement = nodeElement.addElement("key");
        keyElement.addAttribute("label", String.valueOf(i));
        keyElement.setText(String.valueOf(o));
      }
      i++;
    }
    return doc2String(document);
  }

  public static String jsontoXml(String json)
  {
    try
    {
      XMLSerializer serializer = new XMLSerializer();
      JSON jsonObject = JSONSerializer.toJSON(json);
      return serializer.write(jsonObject);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  public static Map<String, String> xmltoMap(String xml)
  {
    try
    {
      Map map = new HashMap();
      Document document = DocumentHelper.parseText(xml);
      Element nodeElement = document.getRootElement();
      List node = nodeElement.elements();
      for (Iterator it = node.iterator(); it.hasNext(); ) {
        Element elm = (Element)it.next();
        map.put(elm.attributeValue("label"), elm.getText());
        elm = null;
      }
      node = null;
      nodeElement = null;
      document = null;
      return map;
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  public static List xmltoList(String xml)
  {
    try
    {
      List list = new ArrayList();
      Document document = DocumentHelper.parseText(xml);
      Element nodesElement = document.getRootElement();
      List nodes = nodesElement.elements();
      for (Iterator its = nodes.iterator(); its.hasNext(); ) {
        Element nodeElement = (Element)its.next();
        Map map = xmltoMap(nodeElement.asXML());
        list.add(map);
        map = null;
      }
      nodes = null;
      nodesElement = null;
      document = null;
      return list;
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  public static String xmltoJson(String xml)
  {
    XMLSerializer xmlSerializer = new XMLSerializer();
    return xmlSerializer.read(xml).toString();
  }

  public static String doc2String(Document document)
  {
    String s = "";
    try
    {
      ByteArrayOutputStream out = new ByteArrayOutputStream();

      OutputFormat format = new OutputFormat("   ", true, "UTF-8");
      XMLWriter writer = new XMLWriter(out, format);
      writer.write(document);
      s = out.toString("UTF-8");
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    return s;
  }
}