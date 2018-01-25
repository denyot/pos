package org.eredlab.g4.ccl.xml;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class XmlHelper {
	private static Log log = LogFactory.getLog(XmlHelper.class);

	public static final Dto parseXml2DtoBasedNode(String pStrXml) {
		Dto outDto = new BaseDto();
		String strTitle = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		Document document = null;
		try {
			if (pStrXml.indexOf("<?xml") < 0)
				pStrXml = strTitle + pStrXml;
			document = DocumentHelper.parseText(pStrXml);
		} catch (DocumentException e) {
			log.error("==开发人员请注意:==\n将XML格式的字符串转换为XML DOM对象时发生错误啦!\n详细错误信息如下:");
			e.printStackTrace();
		}

		Element elNode = document.getRootElement();

		for (Iterator it = elNode.elementIterator(); it.hasNext();) {
			Element leaf = (Element) it.next();
			outDto.put(leaf.getName().toLowerCase(), leaf.getData());
		}
		return outDto;
	}

	public static final Dto parseXml2DtoBasedNode(String pStrXml, String pXPath) {
		Dto outDto = new BaseDto();
		String strTitle = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		Document document = null;
		try {
			if (pStrXml.indexOf("<?xml") < 0)
				pStrXml = strTitle + pStrXml;
			document = DocumentHelper.parseText(pStrXml);
		} catch (DocumentException e) {
			log.error("==开发人员请注意:==\n将XML格式的字符串转换为XML DOM对象时发生错误啦!\n详细错误信息如下:");
			e.printStackTrace();
		}

		Element elNode = document.getRootElement();

		for (Iterator it = elNode.elementIterator(); it.hasNext();) {
			Element leaf = (Element) it.next();
			outDto.put(leaf.getName().toLowerCase(), leaf.getData());
		}
		return outDto;
	}

	public static final Dto parseXml2DtoBasedProperty(String pStrXml,
			String pXPath) {
		Dto outDto = new BaseDto();
		String strTitle = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		Document document = null;
		try {
			if (pStrXml.indexOf("<?xml") < 0)
				pStrXml = strTitle + pStrXml;
			document = DocumentHelper.parseText(pStrXml);
		} catch (DocumentException e) {
			log.error("==开发人员请注意:==\n将XML格式的字符串转换为XML DOM对象时发生错误啦!\n详细错误信息如下:");
			e.printStackTrace();
		}

		Element elRoot = (Element) document.selectSingleNode(pXPath);

		for (Iterator it = elRoot.attributeIterator(); it.hasNext();) {
			Attribute attribute = (Attribute) it.next();
			outDto.put(attribute.getName().toLowerCase(), attribute.getData());
		}
		return outDto;
	}

	public static final String parseDto2Xml(Dto pDto, String pRootNodeName) {
		Document document = DocumentHelper.createDocument();

		document.addElement(pRootNodeName);
		Element root = document.getRootElement();
		Iterator keyIterator = pDto.keySet().iterator();
		while (keyIterator.hasNext()) {
			String key = (String) keyIterator.next();
			String value = pDto.getAsString(key);
			Element leaf = root.addElement(key);
			leaf.setText(value);
		}

		String outXml = document.asXML().substring(39);
		return outXml;
	}

	public static final String parseDto2Xml(Dto pDto, String pRootNodeName,
			String pFirstNodeName) {
		Document document = DocumentHelper.createDocument();

		document.addElement(pRootNodeName);
		Element root = document.getRootElement();
		root.addElement(pFirstNodeName);
		Element firstEl = (Element) document.selectSingleNode("/"
				+ pRootNodeName + "/" + pFirstNodeName);
		Iterator keyIterator = pDto.keySet().iterator();
		while (keyIterator.hasNext()) {
			String key = (String) keyIterator.next();
			String value = pDto.getAsString(key);
			firstEl.addAttribute(key, value);
		}

		String outXml = document.asXML().substring(39);
		return outXml;
	}

	public static final String parseList2Xml(List pList, String pRootNodeName,
			String pFirstNodeName) {
		Document document = DocumentHelper.createDocument();
		Element elRoot = document.addElement(pRootNodeName);
		for (int i = 0; i < pList.size(); i++) {
			Dto dto = (Dto) pList.get(i);
			Element elRow = elRoot.addElement(pFirstNodeName);
			Iterator it = dto.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry entry = (Map.Entry) it.next();
				elRow.addAttribute((String) entry.getKey(), String
						.valueOf(entry.getValue()));
			}
		}
		String outXml = document.asXML().substring(39);
		return outXml;
	}

	public static final String parseList2XmlBasedNode(List pList,
			String pRootNodeName, String pFirstNodeName) {
		Document document = DocumentHelper.createDocument();
		Element output = document.addElement(pRootNodeName);
		for (int i = 0; i < pList.size(); i++) {
			Dto dto = (Dto) pList.get(i);
			Element elRow = output.addElement(pFirstNodeName);
			Iterator it = dto.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry entry = (Map.Entry) it.next();
				Element leaf = elRow.addElement((String) entry.getKey());
				leaf.setText(String.valueOf(entry.getValue()));
			}
		}
		String outXml = document.asXML().substring(39);
		return outXml;
	}

	public static final List parseXml2List(String pStrXml) {
		List lst = new ArrayList();
		String strTitle = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		Document document = null;
		try {
			if (pStrXml.indexOf("<?xml") < 0)
				pStrXml = strTitle + pStrXml;
			document = DocumentHelper.parseText(pStrXml);
		} catch (DocumentException e) {
			log.error("==开发人员请注意:==\n将XML格式的字符串转换为XML DOM对象时发生错误啦!\n详细错误信息如下:");
			e.printStackTrace();
		}

		Element elRoot = document.getRootElement();

		Iterator elIt = elRoot.elementIterator();
		while (elIt.hasNext()) {
			Element el = (Element) elIt.next();
			Iterator attrIt = el.attributeIterator();
			Dto dto = new BaseDto();
			while (attrIt.hasNext()) {
				Attribute attribute = (Attribute) attrIt.next();
				dto.put(attribute.getName().toLowerCase(), attribute.getData());
			}
			lst.add(dto);
		}
		return lst;
	}
}