package cn.longhaul.pos.aftersales.web;

import cn.longhaul.pos.common.Common;
import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.net.URLDecoder;
import java.security.CodeSource;
import java.security.ProtectionDomain;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class AftersalesAction extends BaseAction {
	Map map;
	List<Dto> failedList;
	Map failedMap;

	public ActionForward initAfterSSInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList(
				"basicinfo.getAftersalesserviceInfo", dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initReplacementInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList("basicinfo.getReplacementInfo",
				dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initFaceliftbagInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;

		Dto dto = aForm.getParamAsDto(request);

		List infoList = this.g4Dao.queryForList("basicinfo.getFaceliftbagInfo",
				dto);

		String jsonString = JsonHelper.encodeObject2Json(infoList);

		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initGoldmaterialInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList(
				"basicinfo.getGoldmaterialInfo", dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initGoldQualityInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList("basicinfo.getGoldQualityInfo",
				dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initCertificateInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList("basicinfo.getCertificateInfo",
				dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initLuodanCerInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList(
				"basicinfo.getLuodanCertificateInfo", dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initStoneKind(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList("basicinfo.getStoneKind", dto);
		for (int i = 0; i < infoList.size(); i++) {
			if ("钻石".equals(((Dto) infoList.get(i)).getAsString("zlname"))) {
				Dto tempDto = (Dto) infoList.get(0);
				infoList.set(0, (Dto) infoList.get(i));
				infoList.set(i, tempDto);
				break;
			}
		}
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initStoneClarity(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList("basicinfo.getStoneClarity",
				dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initStoneColor(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList("basicinfo.getStoneColor", dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initStoresInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList("basicinfo.getStoresInfo", dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward initQualityInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List infoList = this.g4Dao.queryForList(
				"basicinfo.getQualityPersonInfo", dto);
		String jsonString = JsonHelper.encodeObject2Json(infoList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getVipRecord(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		dto.put("rownum", Integer.valueOf(15));

		String tel = dto.getAsString("tel");
		if ((!"".equals(tel)) && (tel.indexOf("-") > 1)) {
			dto.put("tel", "");
			dto.put("telf1", tel);
		}
		String option = dto.getAsString("option");
		List list = new ArrayList();
		if (option.equals("user"))
			list = this.g4Dao.queryForList("basicinfo.viprecordbyuser", dto);
		else {
			list = this.g4Dao.queryForList("basicinfo.viprecord", dto);
		}
		String jsonString = JsonHelper.encodeObject2Json(list);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getVipInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		System.out.println(dto.get("name1"));

		List list = this.g4Dao.queryForList("basicinfo.viprecordbyuser", dto);
		String jsonString = JsonHelper.encodeObject2Json(list);
		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward aftersalesStart(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		if (super.getSessionContainer(request).getUserInfo() != null) {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
			dto.put("userid", werks);
		} else {
			return mapping.findForward("authorization");
		}
		String userid = dto.getAsString("userid");
		String salesorderid = dto.getAsString("salesorderid");
		String opmode = dto.getAsString("opmode");
		String password = dto.getAsString("password");
		String ordertype = dto.getAsString("ordertype");
		request.setAttribute("WERKS", werks);
		request.setAttribute("userid", userid);
		request.setAttribute("salesorderid", salesorderid);
		request.setAttribute("opmode", opmode);
		request.setAttribute("ordertype", ordertype);
		String posurl = dto.getAsString("posurl");
		posurl = (posurl == null) || (posurl.equals("")) ? "" : posurl
				.substring(posurl.indexOf("://") + 3, posurl.length());
		posurl = (posurl == null) || (posurl.equals("")) ? "" : posurl
				.substring(0, posurl.indexOf("/"));
		request.setAttribute("posurl", posurl);
		String sessionuser = (String) session.getAttribute("userid");
		Dto configerDto = (Dto) this.g4Reader.queryForObject(
				"posordersystemaig.getuserconfiger", dto);
		if (configerDto != null) {
			request.setAttribute("autocompletesecond", configerDto
					.getAsString("autocompletesecond"));
			request.setAttribute("autocompletewords", configerDto
					.getAsString("autocompletewords"));
		}

		String step = dto.getAsString("step");
		String service_type = dto.getAsString("service_type");
		request.setAttribute("step", step);
		request.setAttribute("service_type", service_type);
		if (sessionuser != null) {
			if ("1".equals(service_type))
				return mapping.findForward("repairlist");
			if ("0".equals(service_type)) {
				return mapping.findForward("alllist");
			}

			return mapping.findForward("faceliftlist");
		}
		session.setAttribute("userid", dto.get("userid"));
		if ("1".equals(service_type)) {
			return mapping.findForward("repairlist");
		}
		return mapping.findForward("faceliftlist");
	}

	public ActionForward saveInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		String deptId = "";
		if (super.getSessionContainer(request).getUserInfo() != null) {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
			dto.put("store_number", werks);
		} else {
			return mapping.findForward("authorization");
		}
		String service_type = dto.getAsString("service_type");
		dto.put("status", "1");
		dto.put("record_date", new Date());
		dto.put("operator_first", dto.get("opterator"));
		dto.put("operator_first_time", new Date());

		String maxServiceNumber = (String) this.g4Reader.queryForObject(
				"aftersalesSystem.getMaxServiceNumber", dto);
		String service_number = werks + getNextNumber(maxServiceNumber);
		dto.put("service_number", service_number);
		if ("1".equals(service_type)) {
			dto.put("service_type", "1");

			String replacement = request.getParameter("replacement");
			if ((replacement != null) && (!"".equals(replacement))) {
				replacement = replacement
						.substring(0, replacement.indexOf("-"));
			}
			dto.put("replacement", replacement);
		} else if (("2".equals(service_type)) || ("3".equals(service_type))) {
			String facelift_bag = dto.getAsString("facelift_bag");
			if ((facelift_bag != null) && (!"".equals(facelift_bag))) {
				facelift_bag = facelift_bag.substring(0, facelift_bag
						.indexOf("-"));
				dto.put("facelift_bag", facelift_bag);
			}

			String gold_material = dto.getAsString("gold_material");
			if ((gold_material != null) && (!"".equals(gold_material))) {
				gold_material = gold_material.substring(0, gold_material
						.indexOf("-"));
				dto.put("gold_material", gold_material);
			}

			String certificate_type = dto.getAsString("certificate_type");
			if ((certificate_type != null) && (!"".equals(certificate_type))) {
				certificate_type = certificate_type.substring(0,
						certificate_type.indexOf("-"));
				dto.put("certificate_type", certificate_type);
			}
		}

		try {
			this.g4Dao.insert("aftersalesSystem.saveServiceInfo", dto);
			write("{\"success\":true,\"msg\":\"成功\",\"service_number\":\""
					+ service_number + "\"}", response);
			boolean flag = tranSaleInfoToSAP(service_number);
		} catch (Exception e) {
			boolean flag;
			e.printStackTrace();
			write("{\"success\":false,\"msg\":\"失败\"}", response);
			throw e;
		}
		return mapping.findForward(null);
	}

	public ActionForward updateInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
	    CommonActionForm aForm = (CommonActionForm)form;
	    HttpSession session = request.getSession();
	    Dto dto = aForm.getParamAsDto(request);
	    String werks = dto.getAsString("WERKS");
	    String step = request.getParameter("step");
	    if (super.getSessionContainer(request).getUserInfo() != null) {
	      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
	      dto.put("store_number", werks);
	    } else {
	      return mapping.findForward("authorization");
	    }String service_type = dto.getAsString("service_type");
	    String status = dto.getAsString("status");
	    int i = 0;
	    if ("1".equals(service_type))
	    {
	      if ("2".equals(step)) {
	        dto.put("operator_second", dto.get("opterator"));
	        dto.put("operator_second_time", new Date());
	      } else if ("3".equals(step)) {
	        dto.put("operator_third", dto.get("opterator"));
	        dto.put("operator_third_time", new Date());
	      }

	      if (("不合格".equals(dto.get("factory_repair_result"))) && ("5".equals(status))) {
	        dto.put("record_date", new Date());
	        dto.put("after_type", "1");
	        this.g4Dao.insert("aftersalesSystem.saveRepairFailedRecord", dto);

	        int factory_repair_number = 0;
	        if (dto.getAsInteger("factory_repair_number") != null) {
	          factory_repair_number = dto.getAsInteger("factory_repair_number").intValue();
	        }
	        dto.put("factory_repair_number", Integer.valueOf(factory_repair_number + 1));
	      }
	    }
	    else if (("2".equals(service_type)) || ("3".equals(service_type)))
	    {
	      if ("2".equals(step)) {
	        dto.put("operator_second", dto.get("opterator"));
	        dto.put("operator_second_time", new Date());
	      } else if ("3".equals(step)) {
	        dto.put("operator_third", dto.get("opterator"));
	        dto.put("operator_third_time", new Date());
	      }

	      if (("不合格".equals(dto.get("factory_repair_result"))) && ("5".equals(status))) {
	        dto.put("record_date", new Date());
	        dto.put("after_type", "2");
	        dto.put("service_number", dto.getAsString("service_number"));
	        this.g4Dao.insert("aftersalesSystem.saveRepairFailedRecord", dto);
	      }

	    }

	    i = this.g4Dao.update("aftersalesSystem.updateServiceInfo", dto);
	    if (i != 0) {
	      write("{\"success\":true,\"msg\":\"成功\"}", response);
	      tranSaleInfoToSAP(dto.getAsString("service_number"));
	    } else {
	      write("{\"success\":false,\"msg\":\"失败\"}", response);
	    }return mapping.findForward(null);
	  }

	public ActionForward getAftersalesList(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		dto.put("member_name", URLDecoder.decode(
				dto.getAsString("member_name"), "utf-8"));
		dto.put("after_ss_project", URLDecoder.decode(dto
				.getAsString("after_ss_project"), "utf-8"));
		String werks = dto.getAsString("WERKS");
		String deptId = "";
		if (super.getSessionContainer(request).getUserInfo() != null) {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
			dto.put("werks", werks);
			if (!"1000".equals(werks))
				dto.put("store_number", werks);
		} else {
			return mapping.findForward("authorization");
		}
		String step = dto.getAsString("step");

		if ("2".equals(step)) {
			String[] statusArray = { "1", "3", "4", "5", "6", "7", "8", "9" };
			dto.put("statusArray", statusArray);
		} else if ("3".equals(step)) {
			String[] statusArray = { "6", "7" };
			dto.put("statusArray", statusArray);
		} else if ("cw".equals(step)) {
			String[] statusArray = { "7", "8" };
			dto.put("statusArray", statusArray);
		}

		Integer pageSize = Integer
				.valueOf(dto.getAsInteger("pageSize") != null ? dto
						.getAsInteger("pageSize").intValue() : 20);
		Integer page = Integer.valueOf(dto.getAsInteger("page") != null ? dto
				.getAsInteger("page").intValue() : 0);
		dto.put("limit", pageSize);
		dto
				.put("start", Integer.valueOf(page.intValue()
						* pageSize.intValue()));
		List list = null;
		UUID uuid = UUID.randomUUID();
		String downloadPath = getWebRoot() + "download/";
		String fileName = uuid + ".xls";

		String sns = dto.getAsString("sns");
		String[] snsArray = (String[]) null;
		if (!"".equals(sns)) {
			sns = sns.trim().replaceAll("\\s*", "");
			snsArray = sns.split(",");
		}
		dto.put("snsArray", snsArray);

		if ("-1".equals(dto.getAsString("service_type"))) {
			dto.remove("service_type");
		}

		list = this.g4Reader.queryForPage("aftersalesSystem.getServiceInfo",
				dto);

		for (int i = 0; i < list.size(); i++) {
			Dto item = (Dto) list.get(i);
			String toneInfo = item.getAsString("stone_detection");
			String[] toneInfos = toneInfo.split("、");
			if (toneInfos.length == 2) {
				String toneColor = toneInfos[0];
				String toneNeatNess = toneInfos[1];

				String color = Common.getToneColor(toneColor);
				String jd = Common.getToneNeatNess(toneNeatNess);

				item.put("ysname", color != null ? color : toneColor);
				item.put("jdname", jd != null ? jd : toneNeatNess);
			}

		}

		String service_type = dto.getAsString("service_type");
		String exporttype = dto.getAsString("exporttype");
		if ("1".equals(service_type)) {
			if ("export".equals(dto.get("step"))) {
				fileName = "repair_" + fileName;
				if (("factory".equals(exporttype))
						|| ("purchase".equals(exporttype))) {
					String[] headers = { "维修单号", "专柜名称", "顾客姓名", "商品批次", "商品名",
							"维修项目", "注意事项", "维修工厂", "货品外观", "石料重量", "货品重量",
							"打印日期", "备注", "图片" };
					String[] fieldProperties = { "service_number",
							"store_name", "member_name",
							"old_commodity_barcode", "trade_name",
							"after_ss_project", "remark2", "process_factory",
							"goods_outward", "old_stone_weight",
							"real_goods_weight", "", "remark1", "product_image" };
					OutputStream out = new FileOutputStream(downloadPath
							+ fileName);
//					ExportExcelUtil.export2FactoryOrPurchaseRepair("维修",
//							headers, fieldProperties, list, out, response, "",
//							exporttype, service_type);
					download(downloadPath, fileName, request, response);
				} else {
					String[] headers = { "维修单号", "专柜名称", "会员卡号", "顾客姓名",
							"商品批次", "商品名", "维修项目", "商场维修费用", "预计维修费用", "状态",
							"维修工费", "加金", "金价", "石料费用", "石料加工费", "配件费用",
							"售后项目", "受理日期", "邮寄日期", "维修实际产生金额", "应收顾客费用",
							"实收顾客费用" };
					String[] fieldProperties = { "service_number",
							"store_name", "member_cardnumber", "member_name",
							"old_commodity_barcode", "trade_name",
							"after_ss_project", "store_repair_costs",
							"expected_repair_costs", "description",
							"repair_charges", "canadian_gold", "gole_price",
							"stone_costs", "stone_process_fees",
							"replacement_cost", "servicename",
							"dept_receive_date", "mailing_date",
							"real_repair_amount", "real_repair_amount_cus",
							"real_customer_amount" };
					OutputStream out = new FileOutputStream(downloadPath
							+ fileName);
//					ExportExcelUtil.export2QualityDept("维修", headers,
//							fieldProperties, list, out, response, "");
					download(downloadPath, fileName, request, response);
				}
				return mapping.findForward(null);
			}
		} else if (("2".equals(service_type)) || ("3".equals(service_type))) {
			if ("export".equals(dto.get("step"))) {
				fileName = "facelift_" + fileName;
				if (("factory".equals(exporttype))
						|| ("purchase".equals(exporttype))) {
					String[] headers = { "改款单号", "专柜名称", "姓名", "电话", "商品批次",
							"拟改款物料号", "首饰名称", "采购下单数量", "金料-款式", "要求到货日期",
							"金料重量", "石料名称", "石料重量", "石料净度", "石料颜色", "石料粒数",
							"尺寸", "工厂", "备注", "图片" };
					String[] fieldProperties = { "service_number",
							"store_name", "member_name", "telephone",
							"old_commodity_barcode", "mf_mold_number",
							"trade_name", "", "goldname", "",
							"old_gold_weight", "mf_stone", "old_stone_weight",
							"jdname", "ysname", "mf_stone_amount", "ring",
							"process_factory", "remark2", "expect_picture" };
					OutputStream out = new FileOutputStream(downloadPath
							+ fileName);
//					ExportExcelUtil.export2FactoryOrPurchase("改款", headers,
//							fieldProperties, list, out, response, "",
//							exporttype, service_type);
					download(downloadPath, fileName, request, response);
				} else {
					String[] headers = { "改款单号", "专柜名称", "会员卡号", "顾客姓名",
							"商品批次", "商品名", "状态", "原货品金重", "新货品金重", "新货品金价",
							"金料损耗", "主石料加工费", "副石料加工费", "副石费用", "配件价格", "起版费",
							"证书费用", "原货品金价", "售后项目", "受理日期", "邮寄日期",
							"改款实际产生金额", "应收顾客费用", "实收顾客费用" };
					String[] fieldProperties = { "service_number",
							"store_name", "member_cardnumber", "member_name",
							"old_commodity_barcode", "trade_name",
							"description", "old_gold_weight",
							"new_gold_weight", "new_gold_price",
							"gold_material_loss", "mainstone_process_fees",
							"total_vicestone_process_fees", "vicestone_cost",
							"replacement_cost", "version_cost",
							"certificate_cost", "old_gold_price",
							"servicename", "dept_receive_date", "mailing_date",
							"real_facelift_amount", "real_facelift_amount_cus",
							"real_customer_amount" };
					OutputStream out = new FileOutputStream(downloadPath
							+ fileName);
//					ExportExcelUtil.export2QualityDept("改款", headers,
//							fieldProperties, list, out, response, "");
					download(downloadPath, fileName, request, response);
				}

				return mapping.findForward(null);
			}

		}

		String jsonString = JsonHelper.encodeObject2Json(list,
				"yyyy-MM-dd hh:mm:ss");
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getServicePageCount(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		dto.put("member_name", URLDecoder.decode(
				dto.getAsString("member_name"), "utf-8"));
		dto.put("after_ss_project", URLDecoder.decode(dto
				.getAsString("after_ss_project"), "utf-8"));
		Integer pageSize = dto.getAsInteger("pageSize");
		Integer pageCount = (Integer) this.g4Dao.queryForObject(
				"aftersalesSystem.getServicePageCount", dto);
		if (pageSize.intValue() == -1)
			pageCount = Integer.valueOf(1);
		else {
			pageCount = Integer.valueOf(pageCount.intValue()
					% pageSize.intValue() == 0 ? pageCount.intValue()
					/ pageSize.intValue() : pageCount.intValue()
					/ pageSize.intValue() + 1);
		}

		write(pageCount.toString(), response);
		return mapping.findForward(null);
	}

	public ActionForward countRepairTime(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		if (super.getSessionContainer(request).getUserInfo() != null) {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
			dto.put("store_numbers", werks);
		} else {
			return mapping.findForward("authorization");
		}
		Integer totalCount = (Integer) this.g4Reader.queryForObject(
				"aftersalesSystem.countRepairTime", dto);
		//write(totalCount, response);
		return mapping.findForward(null);
	}

	public ActionForward getServiceInfoById(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		if (super.getSessionContainer(request).getUserInfo() != null) {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
			request.getSession().setAttribute("store_num", werks);
			dto.put("store_numbers", werks);
		} else {
			return mapping.findForward("authorization");
		}
		List list = this.g4Reader.queryForList(
				"aftersalesSystem.getServiceInfo", dto);
		if ((list != null) && (list.size() > 0)) {
			this.map = ((Map) list.get(0));
		}
		request.setAttribute("map", this.map);
		String step = dto.getAsString("step");
		String service_type = dto.getAsString("service_type");
		String whichp = dto.getAsString("whichp");
		request.setAttribute("whichp", whichp);
		request.setAttribute("service_type", service_type);

		if ("3".equals(step))
			return mapping.findForward("three");
		if ("cwsk".equals(step))
			return mapping.findForward("cwsk");
		if ("cwfk".equals(step)) {
			return mapping.findForward("cwfk");
		}
		if ("1".equals(service_type)) {
			if ("2".equals(step))
				return mapping.findForward("two");
			if ("s".equals(whichp))
				return mapping.findForward("print1");
			if ("detail".equals(step))
				return mapping.findForward("detail");
		} else if (("2".equals(service_type)) || ("3".equals(service_type))) {
			if ("s".equals(whichp))
				return mapping.findForward("print2");
			if ("2".equals(step)) {
				return mapping.findForward("ftwo");
			}
			return mapping.findForward("fdetail");
		}

		return mapping.findForward("detail");
	}

	public ActionForward getFailedReason(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		if (super.getSessionContainer(request).getUserInfo() != null) {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
			dto.put("store_numbers", werks);
		} else {
			return mapping.findForward("authorization");
		}
		this.failedList = this.g4Reader.queryForList(
				"aftersalesSystem.getRepairFailedRecord", dto);
		String jsonString = JsonHelper.encodeObject2Json(this.failedList,
				"yyyy-MM-dd hh:mm:ss");
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward delInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		if (super.getSessionContainer(request).getUserInfo() != null) {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
			dto.put("store_number", werks);
		} else {
			return mapping.findForward("authorization");
		}
		int i = 0;
		if ("1".equals(dto.getAsString("service_type"))) {
			String ids = request.getParameter("service_number");
			String[] idArray = ids.split(",");
			dto.put("idArray", idArray);
			for (int j = 0; j < idArray.length; j++) {
				idArray[j] = idArray[j].trim();
			}
			i = this.g4Dao.delete("aftersalesSystem.delServiceInfo", dto);
		} else if (("2".equals(dto.getAsString("service_type")))
				|| ("3".equals(dto.getAsString("service_type")))) {
			String ids = request.getParameter("service_number");
			String[] idArray = ids.split(",");
			dto.put("idArray", idArray);
			for (int j = 0; j < idArray.length; j++) {
				idArray[j] = idArray[j].trim();
			}
			i = this.g4Dao.delete("aftersalesSystem.delServiceInfo", dto);
		}
		if (i != 0)
			write("{\"success\":true,\"msg\":\"成功\"}", response);
		else
			write("{\"success\":false,\"msg\":\"失败\"}", response);
		return mapping.findForward(null);
	}

	public String getNextNumber(String currentNumber) {
		SimpleDateFormat formater = new SimpleDateFormat("yyyyMMdd");
		DecimalFormat df = new DecimalFormat("000");
		String dateString = formater.format(new Date());
		String nextNumber = "";
		if ((currentNumber != null) && (currentNumber.length() > 11)) {
			String tempDate = currentNumber.substring(
					currentNumber.length() - 11, currentNumber.length() - 3);
			String incStr = currentNumber.substring(currentNumber.length() - 3);
			Integer inc = Integer.valueOf(0);
			if (isNumeric(incStr)) {
				inc = Integer.valueOf(incStr);
			}
			if (!dateString.equals(tempDate)) {
				nextNumber = dateString + "001";
			} else {
				inc = Integer.valueOf(inc.intValue() + 1);
				nextNumber = dateString + df.format(inc);
			}
		} else {
			nextNumber = dateString + "001";
		}
		return nextNumber;
	}

	public ActionForward getKLCherg(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			e.printStackTrace();
			return mapping.findForward("authorization");
		}

		String charg = (String) this.g4Reader.queryForObject(
				"aftersalesSystem.getMaxCharg", "KL" + werks);
		if (G4Utils.isNotEmpty(charg)) {
			Integer num = Integer.valueOf(Integer.parseInt(charg.substring(
					charg.length() - 4, charg.length())));
			String pattern = "0000";
			String maxid = null;
			Integer maxNumber = Integer.valueOf(num.intValue() + 1);
			DecimalFormat df = new DecimalFormat(pattern);
			maxid = df.format(maxNumber);
			charg = "KL" + werks + maxid;
		} else {
			charg = "KL" + werks + "0001";
		}

		Dto data = new BaseDto();
		data.put("charg", charg);
		List list = new ArrayList();
		list.add(data);

		String jsonStr = JsonHelper.encodeObject2Json(list);
		System.out.println(jsonStr);
		write(jsonStr, response);

		return mapping.findForward(null);
	}

	private Dto getHistorySellInfoFromSAP(Dto param) {
		Dto dto = new BaseDto();
		String charg = param.getAsString("charg");
		String kunnr = param.getAsString("kunnr");
		String vipid = param.getAsString("vipcard");
		try {
			AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

			rfctransferinfo.getImportPara().setParameter("I_CHARG", charg);
			rfctransferinfo.getImportPara().setParameter("I_KUNNR", kunnr);

			SapTransferImpl transfer = new SapTransferImpl();
			AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_50",
					rfctransferinfo);

			ArrayList list = out.getAigTable("IT_LIST");
			if (list.size() > 0) {
				Map map = (Map) list.get(0);
				dto.put("xsrq", map.get("AUDAT"));
				System.out.println(map.get("AUDAT"));
				dto.put("xsjg", map.get("ZPR0"));
				dto.put("vipcard", vipid);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dto;
	}

	private String getKunnr(String vipcard) {
		String kunnr = "";
		kunnr = (String) this.g4Reader.queryForObject("basicinfo.getKunnrById",
				vipcard);
		return kunnr;
	}

	public ActionForward getMateriel(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		if (super.getSessionContainer(request).getUserInfo() != null) {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
			String kunnr = super.getSessionContainer(request).getUserInfo()
					.getUserid();
			dto.put("store_numbers", werks);
			dto.put("kunnr", getKunnr(dto.getAsString("vipcard")));
		} else {
			return mapping.findForward("authorization");
		}
		String option = dto.getAsString("option");
		List list = null;
		if (option.equals("user")) {
			list = this.g4Reader.queryForList("basicinfo.getMaterielbyuser",
					dto);
			Dto item = (Dto) this.g4Dao.queryForObject(
					"basicinfo.getSalesInfo", dto);

			if (G4Utils.isEmpty(item)) {
				item = getHistorySellInfoFromSAP(dto);
			}

			if (G4Utils.isEmpty(item)) {
				item = (Dto) this.g4Dao.queryForObject(
						"basicinfo.getchargbaklastpriceforsap", dto);
			}

			if ((item != null) && (G4Utils.isNotEmpty(list))) {
				((Dto) list.get(0)).putAll(item);
			}

			if ((G4Utils.isEmpty(list)) && ("1000".equals(werks))) {
				Dto para = new BaseDto();
				para.put("charg", "ZLSH000000");
				para.put("spmc", "售后虚拟批次");
				para.put("xsjg", "0");
				String chargCount = (String) this.g4Reader.queryForObject(
						"basicinfo.getChargCount", dto);
				para.put("chargappcount", chargCount);
				list = new ArrayList();
				list.add(para);
			}
		} else {
			list = this.g4Reader.queryForList("basicinfo.getMateriel", dto);
		}

		String jsonString = JsonHelper.encodeObject2Json(list);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getMatnrInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String matnr = (String) this.g4Reader.queryForObject(
				"basicinfo.getMatnrbyCharg", dto);
		if (G4Utils.isNotEmpty(matnr)) {
			dto.put("matnr", matnr);
		}
		Dto retDto = (Dto) this.g4Reader.queryForObject(
				"basicinfo.getMatnrbyuser", dto);
		String jsonString = JsonHelper.encodeObject2Json(retDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public boolean isNumeric(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher(str);
		if (!isNum.matches()) {
			return false;
		}
		return true;
	}

	public static void download(String filepath, String filename,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		OutputStream o = response.getOutputStream();
		byte[] b = new byte[1024];

		File fileLoad = new File(filepath, filename);

		response.setHeader("Content-disposition", "attachment;filename="
				+ filename);

		response.setContentType("application/x-tar");

		long fileLength = fileLoad.length();
		String length = String.valueOf(fileLength);
		response.setHeader("Content_Length", length);

		FileInputStream in = new FileInputStream(fileLoad);
		int n = 0;
		while ((n = in.read(b)) != -1)
			o.write(b, 0, n);
	}

	public String getWebRoot() throws IllegalAccessException {
		String path = getClass().getProtectionDomain().getCodeSource()
				.getLocation().getPath();
		if (path.indexOf("WEB-INF") > 0)
			path = path.substring(0, path.indexOf("WEB-INF/classes"));
		else {
			throw new IllegalAccessException("路径获取错误");
		}
		return path;
	}

	public Map getMap() {
		return this.map;
	}

	public void setMap(Map map) {
		this.map = map;
	}

	public Map getFailedMap() {
		return this.failedMap;
	}

	public void setFailedMap(Map failedMap) {
		this.failedMap = failedMap;
	}

	private boolean tranSaleInfoToSAP(String service_number) throws Exception {
		Dto info = (Dto) this.g4Dao
				.queryForObject(
						"aftersalesSystem.getServiceInfoToTranferToSAP",
						service_number);

		if ("1".equals(info.getAsString("service_type"))) {
			return true;
		}
		info.put("werks", info.get("store_number"));
		Dto werksDto = (Dto) this.g4Dao.queryForObject(
				"commonsqlmap.getWerksStr", info);
		info.put("werksStr", werksDto.get("name1"));

		AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
		AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();

		AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_ZTGKPD");

		rfctablevbap.setValue("WERKS", info.get("store_number"));
		rfctablevbap.setValue("ZSHDH", info.get("service_number"));
		rfctablevbap.setValue("SORT1", info.get("werksStr"));
		rfctablevbap.setValue("ZSHLX",
				"2".equals(info.get("service_type")) ? "01" : "02");
		rfctablevbap.setValue("NAME1", info.get("member_name"));
		rfctablevbap.setValue("SORT2", info.get("member_cardnumber"));
		rfctablevbap.setValue("ZTEL", info.get("telephone"));
		rfctablevbap.setValue("CHARG", info.get("old_commodity_barcode"));
		rfctablevbap.setValue("MATNR", info.get("old_matnr_number"));
		rfctablevbap.setValue("MAKTX", info.get("trade_name"));
		rfctablevbap.setValue("HPZL", info.get("old_goods_weight"));
		rfctablevbap.setValue("ZSZSB1", info.get("old_certificate_number"));
		rfctablevbap.setValue("ZSZSB", info.get("luodan_certificate_number"));
		rfctablevbap.setValue("ZJLBM", info.get("old_gold_type"));
		rfctablevbap.setValue("ZCLZL", info.get("old_gold_weight_cus"));
		rfctablevbap.setValue("ZSLBM", info.get("old_stone_type"));
		rfctablevbap.setValue("ZDSZN", info.get("old_stone_weight"));
		rfctablevbap.setValue("ZSLYS", info.get("old_stone_color"));
		rfctablevbap.setValue("LABOR", info.get("old_stone_labor"));
		rfctablevbap.setValue("ZCHARG", info.get("prepared_commodity_barcode"));
		rfctablevbap.setValue("ZMATNR", info.get("mf_mold_number"));
		rfctablevbap.setValue("ZMAKTX", info.get("new_matnr_name"));
		rfctablevbap.setValue("ZHPZL", info.get("new_good_weight"));
		rfctablevbap.setValue("ZCCNN", info.get("ring"));
		rfctablevbap.setValue("ZZSZSB1", info.get("new_certificate_number"));
		rfctablevbap.setValue("ZZJLBM", info.get("gold_material"));
		rfctablevbap.setValue("ZZCLZL", info.get("new_gold_weight_cus"));
		rfctablevbap.setValue("ZZSLBM", info.get("mf_stone_kind"));
		rfctablevbap.setValue("ZZDSZN", info.get("old_stone_weight"));
		rfctablevbap.setValue("ZZSLYS", info.get("mf_stone_color"));
		rfctablevbap.setValue("ZLABOR", info.get("mf_stone_clarity"));
		rfctablevbap.setValue("ZSLGG", info.get("mf_stone_format"));
		rfctablevbap.setValue("ZMDYC", info.get("accept_date"));
		rfctablevbap.setValue("ZSHYC", info.get("dept_receive_date"));
		rfctablevbap.setValue("ZJQYC", info.get("to_purchase_date"));
		rfctablevbap.setValue("ZGCYC", info.get("factory_receive_date"));
		rfctablevbap.setValue("ZHPYC", info.get("good_recieve_date"));
		rfctablevbap.setValue("ZYJYC", info.get("mailing_date"));
		rfctablevbap.setValue("ZDGYC", info.get("to_cabinet_date"));
		rfctablevbap.setValue("ZGKYC", info.get("customer_pickup_date"));
		rfctablevbap.setValue("ZYJFY", info.get("expected_cost"));
		rfctablevbap.setValue("ZJGFY", info.get("real_facelift_amount"));
		rfctablevbap.setValue("ZCWFK", info.get("cw_pay_amount"));
		rfctablevbap.setValue("ZYSFY", info.get("real_repair_amount_cus"));
		rfctablevbap.setValue("ZSSFY", info.get("real_customer_amount"));
		rfctablevbap.setValue("ZCWSK", info.get("cw_receive_amount"));
		rfctablevbap.appendRow();

		rfctransferinfo.appendTable(rfctablevbap);
		SapTransferImpl transfer = new SapTransferImpl();
		AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_40",
				rfctransferinfo);

		Map list = out.getAigStructure("IT_RETURN");

		String result = (String) list.get("TYPE");
		String msg = (String) list.get("MESSAGE");

		System.out.println(result);
		System.out.println(msg);

		if ("S".equals(result)) {
			return true;
		}
		return false;
	}

	public AigTransferInfo transportDto(Dto dto) throws Exception {
		AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
		AigTransferTable table = rfctransferinfo.getTable("IT_ITAB");

		table.setValue("KUNNR", dto.get("kunnr"));
		table.setValue("SORT2", dto.get("sort2"));
		table.setValue("BUILDING", dto.get("buildingcount"));
		table.appendRow();
		rfctransferinfo.appendTable(table);

		SapTransferImpl transfer = new SapTransferImpl();
		AigTransferInfo outinfo = transfer.transferInfoAig("Z_RFC_STORE_18",
				rfctransferinfo);
		return outinfo;
	}
}