package cn.longhaul.pos.choiceorder.web;

import cn.longhaul.pos.choiceorder.service.ChoiceOrderService;
import cn.longhaul.pos.common.Common;
import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.HessianContext;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import java.io.InputStream;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
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

public class ChoiceOrderSystemAction extends BaseAction {
	private ChoiceOrderService choiceOrderservice = (ChoiceOrderService) getService("choiceOrderService");
	private static Log log = LogFactory.getLog(ChoiceOrderSystemAction.class);

	public ActionForward getTypeInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");

		List typeList = this.g4Reader.queryForList("choiceOrder.getType");

		String jsonString = JsonHelper.encodeObject2Json(typeList);

		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward getGoldTypeInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");

		if ("K".equals(dto.getAsString("type"))) {
			dto.put("type2", "9");
		}

		if ("all".equals(dto.getAsString("type"))) {
			dto.put("type", null);
			dto.put("type2", null);
		}

		List typeList = this.g4Reader.queryForList("choiceOrder.getGoldType",
				dto);

		String jsonString = JsonHelper.encodeObject2Json(typeList);

		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward getToneTypeInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");

		String type = dto.getAsString("type");

		if ("all".equals(type)) {
			dto.put("type", null);
		} else if (type.indexOf('(') != -1) {
			dto.put("type", type.substring(0, type.indexOf('(')));
			if (type.indexOf('!') != -1)
				dto.put("notin", type.substring(type.indexOf('!') + 1,
						type.lastIndexOf(')')).split(","));
			else {
				dto.put("in", type.substring(type.indexOf('(') + 1,
						type.lastIndexOf(')')).split(","));
			}

		}

		List typeList = this.g4Reader.queryForList("choiceOrder.getToneType",
				dto);

		String jsonString = JsonHelper.encodeObject2Json(typeList);

		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward getTechnicsTypeInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");

		List typeList = this.g4Reader.queryForList(
				"choiceOrder.getTechnicsTypeInfo", dto);

		String jsonString = JsonHelper.encodeObject2Json(typeList);

		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward getToneSharp(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");

		List typeList = this.g4Reader.queryForList("choiceOrder.getToneSharp");

		String jsonString = JsonHelper.encodeObject2Json(typeList);

		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward getToneColor(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		if ("all".equals(dto.getAsString("types")))
			dto.put("types", null);
		else if (dto.get("types") != null) {
			dto.put("types", dto.getAsString("types").split(","));
		}
		List typeList = this.g4Reader.queryForList("choiceOrder.getToneColor",
				dto);

		String jsonString = JsonHelper.encodeObject2Json(typeList);

		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward getToneNeatness(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");

		List typeList = this.g4Reader
				.queryForList("choiceOrder.getToneNeatness");

		String jsonString = JsonHelper.encodeObject2Json(typeList);

		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward getToneFireType(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		List typeList = this.g4Reader
				.queryForList("choiceOrder.getToneFireType");

		String jsonString = JsonHelper.encodeObject2Json(typeList);

		write(jsonString, response);

		return mapping.findForward(null);
	}

	public ActionForward getCertificate(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		List typeList = this.g4Reader
				.queryForList("choiceOrder.getCertificate");
		String jsonString = JsonHelper.encodeObject2Json(typeList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getMainToneStyle(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		List typeList = this.g4Reader
				.queryForList("choiceOrder.getMainToneStyle");
		String jsonString = JsonHelper.encodeObject2Json(typeList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getMarketPrice(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		Dto dtoRet = new BaseDto();
		String werks;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			// String werks;
			werks = "SZ01";
		}
		dto.put("werks", werks);

		Double ybzjg = (Double) this.g4Reader.queryForObject(
				"choiceOrder.getYbzjg", dto);
		Double yshck = (Double) this.g4Reader.queryForObject(
				"choiceOrder.getYshck", dto);
		ybzjg = Double.valueOf(ybzjg == null ? 0.0D : ybzjg.doubleValue());
		String vkorg = (String) this.g4Reader.queryForObject(
				"choiceOrder.getVkorg", dto);
		String kschl = "";
		if (vkorg == "9000")
			kschl = "ZZK4";
		else {
			kschl = "ZZK5";
		}
		dto.put("kschl", kschl);
		Double kbetr = (Double) this.g4Reader.queryForObject(
				"choiceOrder.getKbetr", dto);
		Double oldMarketPrice = Double.valueOf((ybzjg == null)
				|| (kbetr == null) ? 0.0D : ybzjg.doubleValue()
				* kbetr.doubleValue() / 10.0D);
		dtoRet.put("oldPrice", yshck);
		dtoRet.put("oldMarketPrice", oldMarketPrice);
		dtoRet.put("oldYbzjbPrice", ybzjg);
		dtoRet.put("kbetr", Double.valueOf(kbetr == null ? 0.0D : kbetr
				.doubleValue() / 10.0D));

		Double zsckj = (Double) this.g4Reader.queryForObject(
				"choiceOrder.getTonePrice", dto);
		Double oldTonePrice = zsckj;
		dtoRet.put("oldTonePrice", Double.valueOf(oldTonePrice == null ? 0.0D
				: oldTonePrice.doubleValue()));

		String[] technics = dto.getAsString("technics").split(",");
		dto.put("technics", technics);
		List technicsPrices = this.g4Reader.queryForList(
				"choiceOrder.getTechnics", dto);
		Double technicsPrice = Double.valueOf(0.0D);
		for (int i = 0; i < technicsPrices.size(); i++) {
			technicsPrice = Double.valueOf(technicsPrice.doubleValue()
					+ ((Dto) technicsPrices.get(i)).getAsInteger("fgy")
							.intValue());
		}
		dtoRet.put("technicsPrice", technicsPrice);

		String regStr = JsonHelper.encodeObject2Json(dtoRet);
		write(regStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getNewMarketPrice(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		Dto dtoRet = new BaseDto();
		String werks;
		try {
			werks = super.getSessionContainer(request).getUserInfo().getCustomId();
		} catch (Exception e) {
			//String werks;
			e.printStackTrace();
			return mapping.findForward(null);
		}
		//String werks;
		dto.put("werks", werks);
		String vkorg = (String) this.g4Dao.queryForObject(
				"choiceOrder.getVkorg", dto);

		if ("DI".equals(dto.getAsString("toneType"))) {
			Double phxs = null;
			Double hjxs = null;
			dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
			if ("钻石".equals(dto.getAsString("lessToneType")))
				dto.put("reallessToneType", "DI");
			else {
				dto.put("reallessToneType", "");
			}

			Object kbert = null;
			if ("9000".equals(vkorg)) {
				kbert = "1000";
			} else if ("1000".equals(werks)) {
				kbert = "1000";
			} else if (G4Utils.isNotEmpty(dto.get("charg"))) {
				kbert = this.g4Dao.queryForObject("choiceOrder.getPHXSByCharg",
						dto);
				if (kbert == null)
					kbert = this.g4Dao.queryForObject(
							"choiceOrder.getPHXSByMatnr", dto);
			} else {
				kbert = this.g4Dao.queryForObject("choiceOrder.getPHXSByMatnr",
						dto);
			}
			if (G4Utils.isNotEmpty(kbert)) {
				phxs = Double
						.valueOf(Double.parseDouble(kbert.toString()) / 1000.0D);
				kbert = this.g4Dao.queryForObject("choiceOrder.getHJXSByMatnr",
						dto);
			} else {
				phxs = Double.valueOf(0.0D);
				dtoRet.put("phxserror", "没有取到配货系数，请联系管理员是否维护！");
			}

			if (!G4Utils.isEmpty(kbert)) {
				hjxs = Double.valueOf(Double.parseDouble(kbert.toString()));
			} else {
				hjxs = Double.valueOf(0.0D);
				dtoRet.put("hjxserror", "没有取到核价系数，请联系管理员是否维护！");
			}

			Dto matnrDto = (Dto) this.g4Dao.queryForObject(
					"choiceOrder.getmatnrbyuser", dto);
			Dto goldInfoDto = (Dto) this.g4Dao.queryForObject(
					"choiceOrder.getJLSHGFByMatnr", dto);

			Double dailyGoldPrice = Double.valueOf(0.0D);
			try {
				Dto goldInfo = (Dto) this.g4Dao.queryForObject(
						"choiceOrder.getDailyGoldPrice", dto);
				Double goldRealPrice = Double.valueOf(Double
						.parseDouble(goldInfo.getAsString("ztjac")));
				Double scale = Double.valueOf(Double.parseDouble(goldInfo
						.getAsString("zqzbl")));
				dailyGoldPrice = Double.valueOf(goldRealPrice.doubleValue()
						* scale.doubleValue());
			} catch (Exception e3) {
				e3.printStackTrace();
				dtoRet.put("dailyGoldPriceerror", "没有维护对应金料的当日金价！");
			}

			Double goldSH = Double.valueOf(0.0D);
			try {
				goldSH = Double.valueOf(Double.parseDouble(goldInfoDto
						.getAsString("zzsh")));
			} catch (Exception e1) {
				e1.printStackTrace();
				log.debug(e1.getMessage());
				dtoRet.put("goldSHerror", "未找到对应金料的金料损耗值");
			}
			Double goldGF = Double.valueOf(0.0D);
			try {
				goldGF = Double.valueOf(Double.parseDouble(goldInfoDto
						.getAsString("zgf")));
			} catch (Exception e1) {
				e1.printStackTrace();
				log.debug(e1.getMessage());
				dtoRet.put("goldGFerror", "未找到对应金料的工费");
			}
			Double goldWeight = Double.valueOf(0.0D);
			try {
				goldWeight = Double.valueOf(Double.parseDouble(matnrDto
						.getAsString("zjz")));
			} catch (Exception e1) {
				e1.printStackTrace();
				log.debug(e1.getMessage());
				dtoRet.put("goldWeighterror", "未找到对应物料的金重");
			}
			Integer lessToneCount = Integer.valueOf(0);
			try {
				lessToneCount = matnrDto.getAsInteger("zfssl");
			} catch (Exception e2) {
				e2.printStackTrace();
				log.debug(e2.getMessage());
				dtoRet.put("lessToneCounterror", "未找到对应物料的辅石数量");
			}
			Double totalLessToneWeight = Double.valueOf(0.0D);
			try {
				totalLessToneWeight = Double.valueOf(Double
						.parseDouble(matnrDto.getAsString("zfszl")));
			} catch (Exception e1) {
				e1.printStackTrace();
				log.debug(e1.getMessage());
				dtoRet.put("totalLessToneWeighterror", "没有取到该物料的辅石重量");
			}
			Double lessToneWeight = Double.valueOf(0.0D);
			Double lessTonePrice = Double.valueOf(0.0D);
			Double tonePrice = Double.valueOf(0.0D);

			if ((lessToneCount.intValue() > 0)
					&& (totalLessToneWeight.doubleValue() > 0.0D)) {
				lessToneWeight = Double.valueOf(totalLessToneWeight
						.doubleValue()
						/ lessToneCount.intValue());
				dto.put("lessToneWeight", lessToneWeight);
				if (lessToneWeight.doubleValue() > 0.078D)
					dto.put("lessToneWeightMore", lessToneWeight);
				try {
					if (!"钻石".equals(dto.getAsString("lessToneType")))
						//break label1044;
					lessTonePrice = Double.valueOf(Double
							.parseDouble(this.g4Dao.queryForObject(
									"choiceOrder.getLessTonePrice", dto)
									.toString()));
				} catch (Exception e) {
					log.debug(e.getMessage());
					e.printStackTrace();
					dtoRet.put("lessTonePriceerror", "未找到指定条件的辅石价格");
				}

			} else if (G4Utils.isNotEmpty(dto.getAsString("lessToneType"))) {
				dtoRet.put("lessToneError", "该物料的副石重量为0");
			}
			try {
				label1044: tonePrice = Double.valueOf(Double
						.parseDouble(this.g4Dao.queryForObject(
								"choiceOrder.getMyTonePrice", dto).toString()));
				Integer toneCount = Integer.valueOf(Integer.parseInt(dto
						.getAsString("toneCount")));
				if (toneCount.intValue() > 0)
					tonePrice = Double.valueOf(tonePrice.doubleValue()
							* toneCount.intValue());
			} catch (Exception e) {
				log.debug(e.getMessage());
				e.printStackTrace();
				dtoRet.put("tonePriceError", "未找到指定条件的主石价格");
			}

			System.out.println(dto.get("gemweight"));
			Double toneWeight = Double.valueOf(Double.parseDouble((String) dto
					.get("gemweight")));
			Double totalTondPrice = Double.valueOf(tonePrice.doubleValue()
					* toneWeight.doubleValue() + lessTonePrice.doubleValue()
					* lessToneWeight.doubleValue()
					* (lessToneCount != null ? lessToneCount.intValue() : 0));

			Double totalGoldPrice = Double
					.valueOf((goldWeight.doubleValue() + goldSH.doubleValue())
							* (dailyGoldPrice != null ? dailyGoldPrice
									.doubleValue() : 0.0D));

			Double totalPrice = Double.valueOf((totalTondPrice.doubleValue()
					+ totalGoldPrice.doubleValue() + goldGF.doubleValue())
					* (phxs != null ? phxs.doubleValue() : 0.0D)
					* (hjxs != null ? hjxs.doubleValue() : 0.0D));

			double discount = 1.0D;
			try {
				discount = ((Double) this.g4Dao.queryForObject(
						"choiceOrder.getDiscount", dto)).doubleValue();
			} catch (Exception e) {
				log.debug("获取折扣信息时出现错误：" + e.getMessage());

				e.printStackTrace();
			}

			totalPrice = Double.valueOf(totalPrice.doubleValue() * discount);

			dtoRet.put("newMarketPrice", totalPrice);

			String regStr = JsonHelper.encodeObject2Json(dtoRet);
			write(regStr, response);
		} else {
			Double newTonePrice = (Double) this.g4Reader.queryForObject(
					"choiceOrder.getTonePrice", dto);
			dtoRet.put("newTonePrice", Double
					.valueOf(newTonePrice != null ? newTonePrice.doubleValue()
							: 0.0D));

			String[] technics = dto.getAsString("technics").split(",");
			dto.put("technics", technics);
			List technicsPrices = this.g4Reader.queryForList(
					"choiceOrder.getTechnics", dto);
			Double technicsPrice = Double.valueOf(0.0D);
			for (int i = 0; i < technicsPrices.size(); i++) {
				technicsPrice = Double.valueOf(technicsPrice.doubleValue()
						+ ((Dto) technicsPrices.get(i)).getAsInteger("fgy")
								.intValue());
			}
			dtoRet.put("technicsPrice", technicsPrice);

			Double zhjxs = (Double) this.g4Reader.queryForObject(
					"choiceOrder.getZhjxs", dto);
			dtoRet.put("zhjxs", Double.valueOf(zhjxs != null ? zhjxs
					.doubleValue() : 0.0D));

			String regStr = JsonHelper.encodeObject2Json(dtoRet);
			write(regStr, response);
		}
		return mapping.findForward(null);
	}

	public ActionForward saveChoiceOrder(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		HessianContext.setRequest(request);

		CommonActionForm aForm = (CommonActionForm) form;
		Dto returnMessag = new BaseDto();
		String jsonString = "";
		try {
			String werks = null;

			Dto dto = aForm.getParamAsDto(request);
			dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
			log.debug("提交订单台头:" + dto.get("orderhead").toString());
			log.debug("项目:" + dto.get("orderitem").toString());
			System.out.println(dto.get("orderhead").toString());
			System.out.println(dto.get("orderitem").toString());
			System.out.print("用户操作:" + dto.getAsString("useroption"));
			Dto orderHead = JsonHelper.parseSingleJson2Dto(dto.get("orderhead")
					.toString());
			String orderType = orderHead.getAsString("type");
			try {
				werks = super.getSessionContainer(request).getUserInfo()
						.getCustomId();
			} catch (Exception e) {
				log.debug(e.getMessage());
				returnMessag.put("loginError", "登录已超时，请重新登录！");
				String retStr = JsonHelper.encodeObject2Json(returnMessag);
				write(retStr, response);
				return mapping.findForward(null);
			}

			System.out.println(orderHead);
			List orderitemal = JsonHelper.parseJson2List(dto.get("orderitem")
					.toString());
			if (("1000".equals(werks))
					&& (G4Utils.isNotEmpty(orderHead.get("oldwerks")))) {
				orderHead.put("werks", orderHead.get("oldwerks"));
				werks = orderHead.getAsString("oldwerks");
				for (int i = 0; i < orderitemal.size(); i++)
					((Dto) orderitemal.get(i)).put("werks", orderHead
							.get("oldwerks"));
			} else {
				orderHead.put("werks", werks);
				for (int i = 0; i < orderitemal.size(); i++) {
					((Dto) orderitemal.get(i)).put("werks", werks);
				}

			}

			String currentDate = G4Utils.getCurrentTime("yyyyMMdd");

			String ordertime = orderHead.getAsString("saledate").replace("-",
					"");

			orderHead.put("ordertime", ordertime);

			orderHead.put("operatordate", ordertime);

			String operatedatetime = G4Utils
					.getCurrentTime("yyyy-MM-dd HH:mm:ss");

			String operattime = operatedatetime.substring(10,
					operatedatetime.length()).replace("-", "");

			String operatdate = operatedatetime.substring(0, 10).replace("-",
					"");

			orderHead.put("insertdatetime", operatedatetime);

			returnMessag.put("operatedatetime", operatedatetime);

			AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

			AigTransferParameter rfcimport = rfctransferinfo
					.getTransParameter();

			rfcimport.getParameters().put("I_WERKS", werks);

			rfctransferinfo.setImportPara(rfcimport);

			AigTransferTable rfctablevbak = rfctransferinfo.getTable("IT_ZXDH");
			rfctablevbak.setValue("ZTYPE", orderHead.get("type"));
			rfctablevbak.setValue("WERKS", werks);
			rfctablevbak.setValue("ZDATE", ordertime);
			rfctablevbak.setValue("TEXT", orderHead.get("remark"));
			rfctablevbak.setValue("ZJJZ", orderHead.get("urgent"));
			rfctablevbak.setValue("ZSUM", orderHead.get("quantity"));
			rfctablevbak.setValue("ZPRICE", orderHead.get("totalmoney"));
			rfctablevbak.setValue("ZNUM", orderHead.get("saporderid"));
			rfctablevbak.setValue("ZGKDZ", orderHead.get("custommade"));
			rfctablevbak.setValue("ZSJZ", orderHead.get("totalgoldweight"));
			rfctablevbak.appendRow();
			rfctransferinfo.appendTable(rfctablevbak);

			AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_ZXDI");

			for (int i = 0; i < orderitemal.size(); i++) {
				Dto orderitem = (Dto) orderitemal.get(i);

				orderitem.put("werks", werks);
				orderitem.put("currentDate", G4Utils
						.getCurrentTime("yyyy-MM-dd"));
				orderitem.put("charg", orderitem.get("batchnumber"));
				orderitem.put("matnr", orderitem.get("materialnumber"));
				String bzj = "0-0";
				try {
					String[] retailPrices = (String[]) null;
					Object phxs = Double.valueOf(1000.0D);
					Object hjxs = this.g4Dao.queryForObject(
							"choiceOrder.getHJXSByMatnr", orderitem);
					hjxs = hjxs == null ? Integer.valueOf(1) : hjxs;
					try {
						if ("1000".equals(werks)) {
							phxs = Double.valueOf(1000.0D);
						} else if (G4Utils.isNotEmpty(orderitem.get("charg"))) {
							phxs = this.g4Dao.queryForObject(
									"choiceOrder.getPHXSByCharg", orderitem);
							if (G4Utils.isEmpty(phxs))
								phxs = this.g4Dao
										.queryForObject(
												"choiceOrder.getPHXSByMatnr",
												orderitem);
						} else {
							phxs = this.g4Dao.queryForObject(
									"choiceOrder.getPHXSByMatnr", orderitem);
						}
						String retailPrice = G4Utils.isNotEmpty(orderitem
								.get("retailPrice")) ? orderitem
								.getAsString("retailPrice") : "0-0";
						retailPrices = retailPrice.split("-");

						double discount = 1.0D;
						try {
							orderitem.put("matnr", orderitem
									.get("materialnumber"));
							discount = ((Double) this.g4Dao.queryForObject(
									"choiceOrder.getDiscount", orderitem))
									.doubleValue();
						} catch (Exception e) {
							log.debug("获取折扣信息时出现错误：" + e.getMessage());

							e.printStackTrace();
						}

						if (retailPrices.length == 2) {
							Double myphxs = (Double) phxs;
							Double bzj1 = null;
							Double bzj2 = null;
							if ((phxs != null)
									&& (myphxs.doubleValue() == 0.0D)) {
								bzj1 = Double.valueOf(0.0D);
								bzj2 = Double.valueOf(0.0D);
							} else {
								bzj1 = Double.valueOf(Double
										.parseDouble(retailPrices[0])
										/ (((Double) (phxs == null ? Double
												.valueOf(1000.0D) : phxs))
												.doubleValue() / 1000.0D)
										/ discount);
								bzj2 = Double.valueOf(Double
										.parseDouble(retailPrices[1])
										/ (((Double) (phxs == null ? Double
												.valueOf(1000.0D) : phxs))
												.doubleValue() / 1000.0D)
										/ discount);
							}
							DecimalFormat df = new DecimalFormat("#.##");
							bzj = df.format(bzj1) + "-" + df.format(bzj2);
						}
					} catch (Exception e1) {
						log.debug(e1.getMessage());
						e1.printStackTrace();
					}

					if (("J1".equals(orderType)) || ("J2".equals(orderType))
							|| ("J5".equals(orderType))
							|| ("J4".equals(orderType))) {
						String mygoldweight = G4Utils.isNotEmpty(orderitem
								.get("mygoldweight")) ? orderitem
								.getAsString("mygoldweight") : "0-0";

						String[] mygoldweights = mygoldweight.split("-");
						Dto paraDto = new BaseDto();
						paraDto
								.put(
										"goldType",
										(orderitem.get("goldType") != null)
												&& (orderitem.getAsString(
														"goldType").indexOf(
														"|-|") != -1) ? orderitem
												.getAsString("goldType")
												.substring(
														0,
														orderitem.getAsString(
																"goldType")
																.indexOf("|-|"))
												: orderitem
														.getAsString("goldType"));

						Dto goldInfo = (Dto) this.g4Dao.queryForObject(
								"choiceOrder.getDailyGoldPrice", paraDto);
						Double goldRealPrice = Double.valueOf(Double
								.parseDouble(goldInfo.getAsString("ztjac")));
						Double scale = Double.valueOf(Double
								.parseDouble(goldInfo.getAsString("zqzbl")));
						Double dailyGoldPrice = Double.valueOf(goldRealPrice
								.doubleValue()
								* scale.doubleValue());

						if (mygoldweights.length == 2) {
							Double bzj1 = Double.valueOf(Double
									.parseDouble(mygoldweights[0])
									* dailyGoldPrice.doubleValue()
									* ((Double) hjxs).doubleValue());
							Double bzj2 = Double.valueOf(Double
									.parseDouble(mygoldweights[1])
									* dailyGoldPrice.doubleValue()
									* ((Double) hjxs).doubleValue());
							DecimalFormat df = new DecimalFormat("#.##");
							bzj = df.format(bzj1) + "-" + df.format(bzj2);
						}
					} else if ("J3".equals(orderType)) {
						Dto paraDto = new BaseDto();
						paraDto.put("goldType", orderitem.getAsString(
								"goldType").substring(
								0,
								orderitem.getAsString("goldType")
										.indexOf("|-|")));
						paraDto.put("currentDate", G4Utils
								.getCurrentTime("yyyy-MM-dd"));
						Dto goldInfo = (Dto) this.g4Dao.queryForObject(
								"choiceOrder.getDailyGoldPrice", paraDto);
						Double goldRealPrice = Double.valueOf(0.0D);
						Double scale = Double.valueOf(0.0D);
						try {
							goldRealPrice = Double
									.valueOf(Double.parseDouble(goldInfo
											.getAsString("ztjac")));
							scale = Double.valueOf(Double.parseDouble(goldInfo
									.getAsString("zqzbl")));
						} catch (Exception e) {
							returnMessag
									.put("dailygolderror", "未取到对应金料的每日金价信息");
							e.printStackTrace();
						}
						Double dailyGoldPrice = Double.valueOf(goldRealPrice
								.doubleValue()
								* scale.doubleValue());

						Double goldWeight1 = Double.valueOf(1.0D);
						Double goldWeight2 = Double.valueOf(1.0D);
						try {
							goldWeight1 = Double
									.valueOf(dailyGoldPrice.doubleValue() == 0.0D ? 1.0D
											: Double
													.parseDouble(retailPrices[0])
													/ dailyGoldPrice
															.doubleValue()
													/ (G4Utils.isNotEmpty(phxs) ? ((Double) phxs)
															.doubleValue() / 1000.0D
															: 1.0D)
													/ (G4Utils.isNotEmpty(hjxs) ? ((Double) hjxs)
															.doubleValue()
															: 1.0D));
							goldWeight2 = Double
									.valueOf(dailyGoldPrice.doubleValue() == 0.0D ? 1.0D
											: Double
													.parseDouble(retailPrices[1])
													/ dailyGoldPrice
															.doubleValue()
													/ (G4Utils.isNotEmpty(phxs) ? ((Double) phxs)
															.doubleValue() / 1000.0D
															: 1.0D)
													/ (G4Utils.isNotEmpty(hjxs) ? ((Double) hjxs)
															.doubleValue()
															: 1.0D));
						} catch (Exception e) {
							log.debug("K金反算金重时出现错误:" + e.getMessage());
							e.printStackTrace();
						}
						DecimalFormat df = new DecimalFormat("#.##");
						String mygoldweight = df.format(goldWeight1) + "-"
								+ df.format(goldWeight2);
						orderitem.put("mygoldweight", mygoldweight);
					}
				} catch (Exception e) {
					log.debug(e.getMessage());
					returnMessag
							.put("bzjerror", "获取标准价时出现错误：" + e.getMessage());
				}

				String[] selectWerks = (String[]) null;
				if (orderitem.get("selectWerks") != null) {
					int line = 1000;
					selectWerks = orderitem.getAsString("selectWerks")
							.substring(
									0,
									orderitem.get("selectWerks").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("selectWerks").toString()
											.indexOf("|-|") : 0).split(",");
					if (selectWerks != null)
						for (int j = 0; j < selectWerks.length; j++) {
							String forWerks = selectWerks[j];

							rfctablevbap.setValue("ZNUM", orderHead
									.get("saporderid"));
							rfctablevbap.setValue("ZITEM", Integer
									.valueOf(orderitem.getAsInteger(
											"choiceorderitem").intValue()
											+ line));
							rfctablevbap.setValue("MAKTX", orderitem
									.get("materialdesc"));
							rfctablevbap.setValue("MATNR", orderitem
									.get("materialnumber"));
							rfctablevbap.setValue("CHARG", orderitem
									.get("batchnumber"));
							rfctablevbap.setValue("ZKS", orderitem
									.get("toneType") != null ? orderitem.get(
									"toneType").toString().substring(
									0,
									orderitem.get("toneType").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneType").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap.setValue("ZSE", orderitem
									.get("toneColor") != null ? orderitem.get(
									"toneColor").toString().substring(
									0,
									orderitem.get("toneColor").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneColor").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap.setValue("ZJG", orderitem
									.get("retailPrice"));
							rfctablevbap.setValue("ZSFYS", orderitem
									.get("ifNeedLessTone"));
							rfctablevbap.setValue("ZZHOG", orderitem
									.get("toneType") != null ? orderitem.get(
									"toneType").toString().substring(
									0,
									orderitem.get("toneType").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneType").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap.setValue("ZJSN", orderitem
									.get("quantity"));
							rfctablevbap.setValue("MENGE", orderitem
									.get("quantity"));
							rfctablevbap.setValue("ZJL", orderitem
									.get("goldType") != null ? orderitem.get(
									"goldType").toString().substring(
									0,
									orderitem.get("goldType").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("goldType").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap.setValue("ZZSZ", orderitem
									.get("toneWeight"));
							rfctablevbap.setValue("ZZSYS", orderitem
									.get("toneColor") != null ? orderitem.get(
									"toneColor").toString().substring(
									0,
									orderitem.get("toneColor").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneColor").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap
									.setValue(
											"ZZSJD",
											orderitem.get("toneNeatness") != null ? orderitem
													.get("toneNeatness")
													.toString()
													.substring(
															0,
															orderitem
																	.get(
																			"toneNeatness")
																	.toString()
																	.indexOf(
																			"|-|") != -1 ? orderitem
																	.get(
																			"toneNeatness")
																	.toString()
																	.indexOf(
																			"|-|")
																	: 0)
													: "");
							rfctablevbap.setValue("ZGY", orderitem
									.get("technics") != null ? orderitem.get(
									"technics").toString().substring(
									0,
									orderitem.get("technics").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("technics").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap.setValue("ZHPCC", orderitem
									.get("goodsize"));
							rfctablevbap.setValue("ZJZ", orderitem
									.get("mygoldweight") == null ? "1-1"
									: orderitem.get("mygoldweight"));
							rfctablevbap.setValue("ZTEXT", orderitem
									.get("remark"));
							rfctablevbap.setValue("ZBZJ", bzj);
							rfctablevbap.setValue("ZSLXZ", orderitem
									.get("toneSharp") != null ? orderitem.get(
									"toneSharp").toString().substring(
									0,
									orderitem.get("toneSharp").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneSharp").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap
									.setValue(
											"ZFSSL",
											orderitem.get("lessToneType") != null ? orderitem
													.get("lessToneType")
													.toString()
													.substring(
															0,
															orderitem
																	.get(
																			"lessToneType")
																	.toString()
																	.indexOf(
																			"|-|") != -1 ? orderitem
																	.get(
																			"lessToneType")
																	.toString()
																	.indexOf(
																			"|-|")
																	: 0)
													: "");
							rfctablevbap
									.setValue(
											"ZSLHC",
											orderitem.get("toneFireColor") != null ? orderitem
													.get("toneFireColor")
													.toString()
													.substring(
															0,
															orderitem
																	.get(
																			"toneFireColor")
																	.toString()
																	.indexOf(
																			"|-|") != -1 ? orderitem
																	.get(
																			"toneFireColor")
																	.toString()
																	.indexOf(
																			"|-|")
																	: 0)
													: "");
							rfctablevbap
									.setValue(
											"ZZSLX",
											orderitem.get("certificate") != null ? orderitem
													.get("certificate")
													.toString()
													.substring(
															0,
															orderitem
																	.get(
																			"certificate")
																	.toString()
																	.indexOf(
																			"|-|") != -1 ? orderitem
																	.get(
																			"certificate")
																	.toString()
																	.indexOf(
																			"|-|")
																	: 0)
													: "");
							rfctablevbap.setValue("ZSLYS", orderitem
									.get("toneColor") != null ? orderitem.get(
									"toneColor").toString().substring(
									0,
									orderitem.get("toneColor").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneColor").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap.setValue("ZJLMC", orderitem
									.get("toneType") != null ? orderitem.get(
									"toneType").toString().substring(
									0,
									orderitem.get("toneType").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneType").toString()
											.indexOf("|-|") : 0) : "");
							rfctablevbap.setValue("ZSFXQ", orderitem
									.get("ifinlay"));
							rfctablevbap
									.setValue(
											"ZSLGG",
											orderitem.get("mainToneStyle") != null ? orderitem
													.get("mainToneStyle")
													.toString()
													.substring(
															0,
															orderitem
																	.get(
																			"mainToneStyle")
																	.toString()
																	.indexOf(
																			"|-|") != -1 ? orderitem
																	.get(
																			"mainToneStyle")
																	.toString()
																	.indexOf(
																			"|-|")
																	: 0)
													: "");
							rfctablevbap.setValue("WERKS", forWerks);
							rfctablevbap.appendRow();
							line += 1000;
						}
				} else {
					rfctablevbap.setValue("ZNUM", orderHead.get("saporderid"));
					rfctablevbap.setValue("ZITEM", orderitem
							.get("choiceorderitem"));
					rfctablevbap.setValue("MAKTX", orderitem
							.get("materialdesc"));
					rfctablevbap.setValue("MATNR", orderitem
							.get("materialnumber"));
					rfctablevbap
							.setValue("CHARG", orderitem.get("batchnumber"));
					rfctablevbap.setValue("ZKS",
							orderitem.get("toneType") != null ? orderitem.get(
									"toneType").toString().substring(
									0,
									orderitem.get("toneType").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneType").toString()
											.indexOf("|-|") : 0) : "");
					rfctablevbap.setValue("ZSE",
							orderitem.get("toneColor") != null ? orderitem.get(
									"toneColor").toString().substring(
									0,
									orderitem.get("toneColor").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneColor").toString()
											.indexOf("|-|") : 0) : "");
					rfctablevbap.setValue("ZJG", orderitem.get("retailPrice"));
					rfctablevbap.setValue("ZSFYS", orderitem
							.get("ifNeedLessTone"));
					rfctablevbap.setValue("ZZHOG",
							orderitem.get("toneType") != null ? orderitem.get(
									"toneType").toString().substring(
									0,
									orderitem.get("toneType").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneType").toString()
											.indexOf("|-|") : 0) : "");
					rfctablevbap.setValue("ZJSN", orderitem.get("quantity"));
					rfctablevbap.setValue("MENGE", orderitem.get("quantity"));
					rfctablevbap.setValue("ZJL",
							orderitem.get("goldType") != null ? orderitem.get(
									"goldType").toString().substring(
									0,
									orderitem.get("goldType").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("goldType").toString()
											.indexOf("|-|") : 0) : "");
					rfctablevbap.setValue("ZZSZ", orderitem.get("toneWeight"));
					rfctablevbap.setValue("ZZSYS",
							orderitem.get("toneColor") != null ? orderitem.get(
									"toneColor").toString().substring(
									0,
									orderitem.get("toneColor").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneColor").toString()
											.indexOf("|-|") : 0) : "");
					rfctablevbap.setValue("ZZSJD", orderitem
							.get("toneNeatness") != null ? orderitem.get(
							"toneNeatness").toString().substring(
							0,
							orderitem.get("toneNeatness").toString().indexOf(
									"|-|") != -1 ? orderitem
									.get("toneNeatness").toString().indexOf(
											"|-|") : 0) : "");
					rfctablevbap.setValue("ZGY",
							orderitem.get("technics") != null ? orderitem.get(
									"technics").toString().substring(
									orderitem.get("technics").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("technics").toString()
											.indexOf("|-|") + 3 : 0) : "");
					rfctablevbap.setValue("ZHPCC", orderitem.get("goodsize"));
					rfctablevbap.setValue("ZJZ",
							orderitem.get("mygoldweight") == null ? "1-1"
									: orderitem.get("mygoldweight"));

					rfctablevbap.setValue("ZTEXT", orderitem.get("remark"));
					rfctablevbap.setValue("ZBZJ", bzj);
					rfctablevbap.setValue("ZSLXZ",
							orderitem.get("toneSharp") != null ? orderitem.get(
									"toneSharp").toString().substring(
									0,
									orderitem.get("toneSharp").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneSharp").toString()
											.indexOf("|-|") : 0) : "");
					rfctablevbap.setValue("ZFSSL", orderitem
							.get("lessToneType") != null ? orderitem.get(
							"lessToneType").toString().substring(
							0,
							orderitem.get("lessToneType").toString().indexOf(
									"|-|") != -1 ? orderitem
									.get("lessToneType").toString().indexOf(
											"|-|") : 0) : "");
					rfctablevbap.setValue("ZSLHC", orderitem
							.get("toneFireColor") != null ? orderitem.get(
							"toneFireColor").toString().substring(
							0,
							orderitem.get("toneFireColor").toString().indexOf(
									"|-|") != -1 ? orderitem.get(
									"toneFireColor").toString().indexOf("|-|")
									: 0) : "");
					rfctablevbap
							.setValue(
									"ZZSLX",
									orderitem.get("certificate") != null ? orderitem
											.get("certificate")
											.toString()
											.substring(
													0,
													orderitem
															.get("certificate")
															.toString()
															.indexOf("|-|") != -1 ? orderitem
															.get("certificate")
															.toString()
															.indexOf("|-|")
															: 0)
											: "");
					rfctablevbap.setValue("ZSLYS",
							orderitem.get("toneColor") != null ? orderitem.get(
									"toneColor").toString().substring(
									0,
									orderitem.get("toneColor").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneColor").toString()
											.indexOf("|-|") : 0) : "");
					rfctablevbap.setValue("ZJLMC",
							orderitem.get("toneType") != null ? orderitem.get(
									"toneType").toString().substring(
									0,
									orderitem.get("toneType").toString()
											.indexOf("|-|") != -1 ? orderitem
											.get("toneType").toString()
											.indexOf("|-|") : 0) : "");
					rfctablevbap.setValue("ZSFXQ", orderitem.get("ifinlay"));
					rfctablevbap.setValue("ZSLGG", orderitem
							.get("mainToneStyle") != null ? orderitem.get(
							"mainToneStyle").toString().substring(
							0,
							orderitem.get("mainToneStyle").toString().indexOf(
									"|-|") != -1 ? orderitem.get(
									"mainToneStyle").toString().indexOf("|-|")
									: 0) : "");
					rfctablevbap.appendRow();
				}
			}

			rfctransferinfo.appendTable(rfctablevbap);
			SapTransferImpl transfer = new SapTransferImpl();
			AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_10",
					rfctransferinfo);

			ArrayList list = out.getAigTable("IT_RETURN");

			String result = (String) ((HashMap) list.get(0)).get("TYPE");
			String msg = (String) ((HashMap) list.get(0)).get("MESSAGE");

			for (int i = 0; i < list.size(); i++) {
				System.out.println(((HashMap) list.get(i)).get("TYPE"));
				System.out.println(((HashMap) list.get(i)).get("MESSAGE"));
			}

			if ("S".equals(result)) {
				if ((orderHead.get("choiceorderid") == null)
						|| ("".equals(orderHead.get("choiceorderid").toString()
								.trim()))) {
					String posChoiceOrderId = werks
							+ G4Utils.getCurrentTime("yyyyMMdd")
							+ orderHead.getAsString("type");

					dto.put("posChoiceOrderId", posChoiceOrderId);

					String newTonePrice = (String) this.g4Reader
							.queryForObject("choiceOrder.getMaxChoiceOrderId",
									dto);

					String maxid = "";

					int maxNumber = Integer.parseInt(newTonePrice
							.substring(newTonePrice.length() - 3)) + 1;

					String pattern = "000";

					DecimalFormat df = new DecimalFormat(pattern);

					maxid = df.format(maxNumber);

					posChoiceOrderId = posChoiceOrderId + maxid;

					String saporderid = (String) out.getParameters("E_NUM");

					msg = msg + "保存成功，选款单号:" + saporderid;

					orderHead.put("choiceorderid", posChoiceOrderId);

					orderHead.put("saporderid", saporderid);

					for (int i = 0; i < orderitemal.size(); i++) {
						((Dto) orderitemal.get(i)).put("choiceorderid",
								posChoiceOrderId);
						((Dto) orderitemal.get(i))
								.put("saporderid", saporderid);
					}

					this.choiceOrderservice.saveChoiceOrder(orderHead,
							orderitemal);
				} else {
					for (int i = 0; i < orderitemal.size(); i++) {
						((Dto) orderitemal.get(i)).put("choiceorderid",
								orderHead.get("choiceorderid"));
						((Dto) orderitemal.get(i)).put("saporderid", orderHead
								.get("saporderid"));
					}

					this.choiceOrderservice.upadteChoiceOrder(orderHead,
							orderitemal);
				}

				returnMessag.put("success", msg);
			} else {
				returnMessag.put("error", msg);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			returnMessag.put("error", ex.toString());
		}
		jsonString = JsonHelper.encodeObject2Json(returnMessag);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveChoiceOrderForGift(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		HessianContext.setRequest(request);

		CommonActionForm aForm = (CommonActionForm) form;
		Dto returnMessag = new BaseDto();
		String jsonString = "";
		try {
			String werks = null;

			Dto dto = aForm.getParamAsDto(request);
			dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
			log.debug("提交订单台头:" + dto.get("orderhead").toString());
			log.debug("项目:" + dto.get("orderitem").toString());
			System.out.println(dto.get("orderhead").toString());
			System.out.println(dto.get("orderitem").toString());
			System.out.print("用户操作:" + dto.getAsString("useroption"));
			Dto orderHead = JsonHelper.parseSingleJson2Dto(dto.get("orderhead")
					.toString());
			String orderType = orderHead.getAsString("type");
			try {
				werks = super.getSessionContainer(request).getUserInfo()
						.getCustomId();
			} catch (Exception e) {
				log.debug(e.getMessage());
				returnMessag.put("loginError", "登录已超时，请重新登录！");
				String retStr = JsonHelper.encodeObject2Json(returnMessag);
				write(retStr, response);
				return mapping.findForward(null);
			}

			orderHead.put("werks", werks);
			System.out.println(orderHead);
			Dto werksDto = (Dto) this.g4Dao.queryForObject(
					"commonsqlmap.getWerksStr", orderHead);

			orderHead.put("werksStr", werksDto.get("name1"));

			List orderitemal = JsonHelper.parseJson2List(dto.get("orderitem")
					.toString());
			String posChoiceOrderId = null;
			if ((orderHead.get("choiceorderid") == null)
					|| ("".equals(orderHead.get("choiceorderid").toString()
							.trim()))) {
				posChoiceOrderId = werks + G4Utils.getCurrentTime("yyyyMMdd");

				dto.put("posChoiceOrderId", posChoiceOrderId);

				String newTonePrice = (String) this.g4Reader.queryForObject(
						"choiceOrder.getMaxChoiceOrderForGiftId", dto);

				String maxid = "";

				int maxNumber = Integer.parseInt(newTonePrice
						.substring(newTonePrice.length() - 3)) + 1;

				String pattern = "000";

				DecimalFormat df = new DecimalFormat(pattern);

				maxid = df.format(maxNumber);

				posChoiceOrderId = posChoiceOrderId + maxid;
			} else {
				posChoiceOrderId = (String) orderHead.get("choiceorderid");
			}

			for (int i = 0; i < orderitemal.size(); i++) {
				((Dto) orderitemal.get(i)).put("werks", werks);
			}
			String currentDate = G4Utils.getCurrentTime("yyyyMMdd");

			String ordertime = orderHead.getAsString("saledate").replace("-",
					"");

			orderHead.put("ordertime", ordertime);

			orderHead.put("operatordate", ordertime);

			String operatedatetime = G4Utils
					.getCurrentTime("yyyy-MM-dd HH:mm:ss");

			String operattime = operatedatetime.substring(10,
					operatedatetime.length()).replace("-", "");

			String operatdate = operatedatetime.substring(0, 10).replace("-",
					"");

			orderHead.put("insertdatetime", operatedatetime);

			returnMessag.put("operatedatetime", operatedatetime);

			AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
			AigTransferParameter rfcimport = rfctransferinfo
					.getTransParameter();

			AigTransferTable rfctablevbap = rfctransferinfo
					.getTable("IT_ZTZPXD");

			for (int i = 0; i < orderitemal.size(); i++) {
				Dto orderitem = (Dto) orderitemal.get(i);

				orderitem.put("werks", werks);
				orderitem.put("werksStr", werksDto.get("name1"));
				orderitem.put("currentDate", G4Utils
						.getCurrentTime("yyyy-MM-dd"));
				orderitem.put("charg", orderitem.get("batchnumber"));
				orderitem.put("matnr", orderitem.get("materialnumber"));

				rfctablevbap.setValue("WERKS", orderitem.get("werks"));
				rfctablevbap.setValue("ZZPDH", posChoiceOrderId);
				rfctablevbap
						.setValue("ZITEM", orderitem.get("choiceorderitem"));
				rfctablevbap.setValue("NAME1", orderitem.get("werksStr"));
				rfctablevbap.setValue("MATNR", orderitem.get("materialnumber"));
				rfctablevbap.setValue("MAKTX", orderitem.get("materialdesc"));
				rfctablevbap.setValue("ZQTY", orderitem.get("quantity"));
				rfctablevbap.setValue("TEMPB", orderitem.get("tbtxt"));
				rfctablevbap.setValue("ZDATE", ordertime);
				rfctablevbap.appendRow();
			}

			rfctransferinfo.appendTable(rfctablevbap);
			SapTransferImpl transfer = new SapTransferImpl();
			AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_39",
					rfctransferinfo);

			Map list = out.getAigStructure("IT_RETURN");

			String result = (String) list.get("TYPE");
			String msg = (String) list.get("MESSAGE");

			System.out.println(result);
			System.out.println(msg);

			if ("S".equals(result)) {
				if ((orderHead.get("choiceorderid") == null)
						|| ("".equals(orderHead.get("choiceorderid").toString()
								.trim()))) {
					msg = msg + "保存成功，选款单号:" + posChoiceOrderId;
					orderHead.put("choiceorderid", posChoiceOrderId);
					for (int i = 0; i < orderitemal.size(); i++) {
						((Dto) orderitemal.get(i)).put("choiceorderid",
								posChoiceOrderId);
					}
					this.choiceOrderservice.saveChoiceOrderForGift(orderHead,
							orderitemal);
				} else {
					for (int i = 0; i < orderitemal.size(); i++) {
						((Dto) orderitemal.get(i)).put("choiceorderid",
								orderHead.get("choiceorderid"));
						((Dto) orderitemal.get(i)).put("saporderid", orderHead
								.get("saporderid"));
					}
					this.choiceOrderservice.upadteChoiceOrderForGift(orderHead,
							orderitemal);
				}
				returnMessag.put("success", msg);
			} else {
				returnMessag.put("error", msg);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			returnMessag.put("error", ex.toString());
		}
		jsonString = JsonHelper.encodeObject2Json(returnMessag);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getpcxx(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			return mapping.findForward(null);
		}
		String chargtype = dto.get("chargtype").toString();
		dto.put("charg", dto.get("charg"));
		List list = null;
		String userinput = (String) dto.get("userinput");
		String charg = (String) dto.get("charg");
		charg = charg == null ? "" : charg.trim();
		String option = dto.getAsString("option");
		String choiceOrderType = dto.getAsString("choiceOrderType");
		dto.put("choiceOrderType", choiceOrderType);
		if (option.equals("user")) {
			if (chargtype.equals("charg")) {
				list = this.g4Dao.queryForList("choiceOrder.getpcxxbyuser", dto);
				for (int i = 0; i < list.size(); i++) {
					Dto tempdto = (Dto) list.get(i);
					if( tempdto.get("mstae").equals("03")){
						list = this.g4Dao.queryForList("choiceOrder.getpcxxOther", dto);
					}
					tempdto.put("charg", tempdto.get("cpbm"));
					String orderid = (String) this.g4Dao.queryForObject("choiceOrder.getchargisusedorderid", tempdto);
					orderid = orderid == null ? "" : orderid;
					tempdto.put("usedorderid", orderid);
					String ordertype = dto.getAsString("ordertype");
					if ((ordertype.equals("ZRE1")) || (ordertype.equals("ZOR4"))) {
						tempdto.put("ordertype", "ZOR1");
						Double price = (Double) this.g4Dao.queryForObject("choiceOrder.getchargbaklastprice", tempdto);
						if (price != null)
							tempdto.put("sxj", price);
					}
				}
			} else if (chargtype.equals("gift")) {
				list = this.g4Dao
						.queryForList("choiceOrder.getgiftbyuser", dto);
				for (int i = 0; i < list.size(); i++) {
					Dto tempdto = (Dto) list.get(i);
					tempdto.put("matnr", tempdto.get("cpbm"));
					String ordertype = dto.getAsString("ordertype");
					if (ordertype.equals("ZRE2")) {
						tempdto.put("ordertype", "ZOR8");
						Double price = (Double) this.g4Dao.queryForObject(
								"choiceOrder.getchargbaklastprice", tempdto);
						if (price != null) {
							tempdto.put("sxj", price);
						}
					}
				}
			}
		} else if ((userinput != null) && (userinput.equals("1"))) {
			if (chargtype.equals("charg"))
				list = this.g4Dao
						.queryForList("choiceOrder.getpcxxbyuser", dto);
			else if (chargtype.equals("gift")) {
				list = this.g4Dao
						.queryForList("choiceOrder.getgiftbyuser", dto);
			}
		} else if (chargtype.equals("charg"))
			list = this.g4Dao.queryForList("choiceOrder.getpcxx", dto);
		else if (chargtype.equals("gift")) {
			list = this.g4Dao.queryForList("choiceOrder.getgift", dto);
		}

		String jsonString = JsonHelper.encodeObject2Json(list);
		jsonString = Common.getNewString(werks, jsonString);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getMatnrInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			return mapping.findForward(null);
		}

		dto.put("matnr", dto.get("matnr"));
		List list = null;
		String matnr = (String) dto.get("matnr");
		String isOk = "NO";

		matnr = matnr == null ? "" : matnr.trim();
		String option = dto.getAsString("option");
		String choiceOrderType = dto.getAsString("choiceOrderType");
		dto.put("choiceOrderType", choiceOrderType);
		if (option.equals("user"))
			list = this.g4Dao.queryForList("choiceOrder.getmatnrbyuser", dto);
		else {
			list = this.g4Dao.queryForList("choiceOrder.getmatnr", dto);
		}

		List kondms = this.g4Dao.queryForList("choiceOrder.getKondms", dto);
		if ((list != null) && (list.size() > 0)) {
			for (int i = 0; i < list.size(); i++) {
				Dto dtoBismt = (Dto)list.get(i);
				if( dtoBismt.get("mstae").equals("03")){
					list = this.g4Dao.queryForList("choiceOrder.getMatnrOther", dto);
				}
			}
			if ((list != null) && (list.size() > 0)) {
				for (int i = 0; i < kondms.size(); i++) {
					String kondm = (String) kondms.get(i);
					if ((kondm != null)
							&& (list.size() != 0)
							&& (kondm.equals(((Dto) list.get(0))
									.getAsString("kondm")))) {
						isOk = "YES";
						break;
					}
				}
				((Dto) list.get(0)).put("isOk", isOk);
			}
		}
		String jsonString = JsonHelper.encodeObject2Json(list);
		//jsonString = Common.getNewString(werks, jsonString);  2016.1.4
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getYshckBymatnr(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		Dto dtoRet = new BaseDto();
		String werks;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			// String werks;
			werks = "SZ01";
		}
		dto.put("werks", werks);

		dto.put("matnr", dto.get("matnr"));
		String matnr = (String) dto.get("matnr");
		matnr = matnr == null ? "" : matnr.trim();
		dto.put("matnr", matnr);
		dto.put("now", G4Utils.getCurrentTime("yyyy-MM-dd"));
		Calendar cal = Calendar.getInstance();
		cal.add(2, -3);
		Date before = cal.getTime();
		dto.put("before", new SimpleDateFormat("yyyy-MM-dd").format(before));

		Double ybzjg = (Double) this.g4Reader.queryForObject(
				"choiceOrder.getYbzjgBymatnr", dto);
		ybzjg = Double.valueOf(ybzjg == null ? 0.0D : ybzjg.doubleValue());
		String vkorg = (String) this.g4Reader.queryForObject(
				"choiceOrder.getVkorg", dto);
		String kschl = "";
		if (vkorg == "9000")
			kschl = "ZZK4";
		else {
			kschl = "ZZK5";
		}
		dto.put("kschl", kschl);
		Double kbetr = (Double) this.g4Reader.queryForObject(
				"choiceOrder.getKbetr", dto);
		ybzjg = Double.valueOf(ybzjg == null ? 0.0D : ybzjg.doubleValue());
		kbetr = Double.valueOf(kbetr == null ? 0.0D : kbetr.doubleValue());
		Double oldMarketPrice = Double.valueOf(ybzjg.doubleValue()
				* kbetr.doubleValue() / 10.0D);
		dtoRet.put("retailPrice", oldMarketPrice);
		dtoRet.put("oldYbzjbPrice", ybzjg);
		dtoRet.put("ybzjg", ybzjg);
		dtoRet.put("kbetr", Double.valueOf(kbetr.doubleValue() / 10.0D));

		Double yshckBymatnr = (Double) this.g4Dao.queryForObject(
				"choiceOrder.getYshckBymatnr", dto);

		dtoRet.put("costPrice", yshckBymatnr);

		Double toneWeight = (Double) this.g4Reader.queryForObject(
				"choiceOrder.getToneWeightByMatnr", dto);
		dto.put("gemweight", Double.valueOf(toneWeight == null ? 0.0D
				: toneWeight.doubleValue()));
		Double zsckj = (Double) this.g4Reader.queryForObject(
				"choiceOrder.getTonePrice", dto);
		Double oldTonePrice = zsckj;
		dtoRet.put("oldTonePrice", oldTonePrice);

		String[] technics = dto.getAsString("technics").split(",");
		dto.put("technics", technics);
		List technicsPrices = this.g4Reader.queryForList(
				"choiceOrder.getTechnics", dto);
		Double technicsPrice = Double.valueOf(0.0D);
		for (int i = 0; i < technicsPrices.size(); i++) {
			technicsPrice = Double.valueOf(technicsPrice.doubleValue()
					+ ((Dto) technicsPrices.get(i)).getAsInteger("fgy")
							.intValue());
		}
		dtoRet.put("technicsPrice", technicsPrice);

		String retStr = JsonHelper.encodeObject2Json(dtoRet);

		write(retStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceOrderHeader(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		String werks = "";
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			log.debug(e.getMessage());
		}

		Dto dto = aForm.getParamAsDto(request);
		dto.put("werks", werks);

		Integer pageSize = Integer
				.valueOf(dto.getAsInteger("pageSize") != null ? dto
						.getAsInteger("pageSize").intValue() : 20);

		Integer page = Integer.valueOf(dto.getAsInteger("page") != null ? dto
				.getAsInteger("page").intValue() : 0);

		dto.put("limit", pageSize);

		dto
				.put("start", Integer.valueOf(page.intValue()
						* pageSize.intValue()));

		String custommade = dto.getAsString("custommade");
		if ("1".equals(custommade)) {
			dto.put("custommade", "X");
		} else if ("0".equals(custommade)) {
			dto.put("custommade", null);
			dto.put("nocustommade", "X");
		}
		List typeList = null;
		if ("1000".equals(dto.getAsString("opterator")))
			typeList = this.g4Reader.queryForPage(
					"choiceOrder.getChoiceOrderHeaderFor1000", dto);
		else {
			typeList = this.g4Reader.queryForPage(
					"choiceOrder.getChoiceOrderHeader", dto);
		}
		String jsonString = JsonHelper.encodeObject2Json(typeList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceOrderForGiftHeader(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		String werks = "";
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			log.debug(e.getMessage());
		}

		Dto dto = aForm.getParamAsDto(request);
		dto.put("werks", werks);

		Integer pageSize = Integer
				.valueOf(dto.getAsInteger("pageSize") != null ? dto
						.getAsInteger("pageSize").intValue() : 20);

		Integer page = Integer.valueOf(dto.getAsInteger("page") != null ? dto
				.getAsInteger("page").intValue() : 0);

		dto.put("limit", pageSize);

		dto
				.put("start", Integer.valueOf(page.intValue()
						* pageSize.intValue()));

		List typeList = this.g4Reader.queryForPage(
				"choiceOrder.getChoiceOrderForGiftHeader", dto);
		String jsonString = JsonHelper.encodeObject2Json(typeList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceOrderHeaderCount(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			log.debug(e.getMessage());
		}
		dto.put("werks", werks);
		String custommade = dto.getAsString("custommade");
		if ("1".equals(custommade)) {
			dto.put("custommade", "X");
		} else if ("0".equals(custommade)) {
			dto.put("custommade", null);
			dto.put("nocustommade", "X");
		}

		Integer count = (Integer) this.g4Reader.queryForObject(
				"choiceOrder.getChoiceOrderHeaderCount", dto);
		Integer pageSize = dto.getAsInteger("pageSize");
		count = Integer
				.valueOf(count.intValue() % pageSize.intValue() == 0 ? count
						.intValue()
						/ pageSize.intValue() : count.intValue()
						/ pageSize.intValue() + 1);
		write(count.toString(), response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceOrderHeaderForGiftCount(
			ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			log.debug(e.getMessage());
		}
		dto.put("werks", werks);

		Integer count = (Integer) this.g4Reader.queryForObject(
				"choiceOrder.getChoiceOrderHeaderForGiftCount", dto);
		Integer pageSize = dto.getAsInteger("pageSize");
		count = Integer
				.valueOf(count.intValue() % pageSize.intValue() == 0 ? count
						.intValue()
						/ pageSize.intValue() : count.intValue()
						/ pageSize.intValue() + 1);
		write(count.toString(), response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceOrderByOrderId(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			log.debug(e.getMessage());
		}
		dto.put("werks", werks);
		String id = dto.getAsString("choiceOrderId");
		request.setAttribute("opmode", dto.get("opmode"));
		request.setAttribute("choiceOrderId", dto.get("choiceOrderId"));
		if (("1000".equals(dto.getAsString("werks")))
				&& (!"1000".equals(dto.getAsString("operator")))) {
			return mapping.findForward("viewforheadquarters");
		}
		return mapping.findForward("view");
	}

	public ActionForward getChoiceOrderByOrderIdForGift(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			log.debug(e.getMessage());
		}
		dto.put("werks", werks);
		String id = dto.getAsString("choiceOrderId");
		request.setAttribute("opmode", dto.get("opmode"));
		request.setAttribute("choiceOrderId", dto.get("choiceOrderId"));
		return mapping.findForward("viewforgift");
	}

	public ActionForward getChoiceOrderByOrderIdForHeadQuarters(
			ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		String id = dto.getAsString("choiceOrderId");
		request.setAttribute("opmode", dto.get("opmode"));
		request.setAttribute("choiceOrderId", dto.get("choiceOrderId"));
		return mapping.findForward("viewforheadquarters");
	}

	public ActionForward getChoiceOrderHeaderInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		String id = dto.getAsString("choiceOrderId");
		Dto dtoRet = (Dto) this.g4Reader.queryForObject(
				"choiceOrder.getChoiceOrderHeaderInfo", dto);
		String regStr = JsonHelper.encodeObject2Json(dtoRet);
		write(regStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceOrderHeaderInfoForGift(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		String id = dto.getAsString("choiceOrderId");
		Dto dtoRet = (Dto) this.g4Reader.queryForObject(
				"choiceOrder.getChoiceOrderHeaderInfoForGift", dto);
		String regStr = JsonHelper.encodeObject2Json(dtoRet);
		write(regStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceOrderItem(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);

		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			return mapping.findForward(null);
		}

		String id = dto.getAsString("choiceOrderId");
		List orderItems = this.g4Reader.queryForList(
				"choiceOrder.getChoiceOrderItem", dto);
		String retStr = JsonHelper.encodeObject2Json(orderItems);
		retStr = Common.getNewString(werks, retStr);
		write(retStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceOrderItemForGift(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			return mapping.findForward(null);
		}
		String id = dto.getAsString("choiceOrderId");
		List orderItems = this.g4Reader.queryForList(
				"choiceOrder.getChoiceOrderItemForGift", dto);
		String retStr = JsonHelper.encodeObject2Json(orderItems);
		retStr = Common.getNewString(werks, retStr);
		write(retStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getWerksInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		List list = this.g4Reader
				.queryForList("membersystem.getWerksInfo", dto);
		String regStr = JsonHelper.encodeObject2Json(list);
		write(regStr, response);
		return mapping.findForward(null);
	}

	public ActionForward delOrder(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");

		List orderHead = JsonHelper
				.parseJson2List(dto.getAsString("orderhead"));

		AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
		AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_ZXDH");

		for (int i = 0; i < orderHead.size(); i++) {
			rfctablevbap.setValue("ZNUM", ((Dto) orderHead.get(i))
					.get("saporderid"));
			rfctablevbap.setValue("ZSCPS", "X");
			rfctablevbap.appendRow();
		}

		rfctransferinfo.appendTable(rfctablevbap);
		SapTransferImpl transfer = new SapTransferImpl();
		AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_10",
				rfctransferinfo);

		ArrayList retTable = out.getAigTable("IT_RETURN");
		Dto retMsg = new BaseDto();
		retMsg.put("message", ((HashMap) retTable.get(0)).get("MESSAGE"));
		System.out.println(((HashMap) retTable.get(0)).get("MESSAGE"));
		System.out.println(((HashMap) retTable.get(0)).get("TYPE"));
		if ("S".equals(((HashMap) retTable.get(0)).get("TYPE"))) {
			for (int i = 0; i < orderHead.size(); i++) {
				try {
					this.choiceOrderservice.delChoiceOrder((Dto) orderHead
							.get(i));
				} catch (Exception e) {
					e.printStackTrace();
					retMsg.put("error", e.getMessage());
				}
			}
		}

		String regStr = JsonHelper.encodeObject2Json(retMsg);

		write(regStr, response);

		return mapping.findForward(null);
	}

	public ActionForward delOrderForGift(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");

		return mapping.findForward(null);
	}

	public ActionForward getMatnrByParam(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			return mapping.findForward(null);
		}

		List list = this.g4Reader.queryForList("choiceOrder.getMatnrByParam",
				dto);
		String retStr = JsonHelper.encodeObject2Json(list);
		retStr = Common.getNewString(werks, retStr);
		write(retStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getBismtInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		Dto info = (Dto) this.g4Reader.queryForObject(
				"choiceOrder.getBismtInfo", dto);
		Map data = new HashMap();
		if (info == null) {
			return mapping.findForward(null);
		}
		String[] slxz = info.get("zslxz") != null ? info.getAsString("zslxz")
				.split("/") : null;
		String[] slgg = info.get("zslgg") != null ? info.getAsString("zslgg")
				.split("/") : null;
		String[] gy = info.get("zgy") != null ? info.getAsString("zgy").split(
				"/") : null;
		String[] jlbm = info.get("zjlbn") != null ? info.getAsString("zjlbn")
				.split("/") : null;
		String[] slbm = info.get("zslbm") != null ? info.getAsString("zslbm")
				.split("/") : null;
		String[] styles = info.get("zcpfg") != null ? info.getAsString("zcpfg")
				.split("/") : null;
		String[] series = info.get("zcpxl") != null ? info.getAsString("zcpxl")
				.split("/") : null;

		List slxzList = new ArrayList();
		List slggList = new ArrayList();
		List gyList = new ArrayList();
		List jlbmList = new ArrayList();
		List slbmList = new ArrayList();
		List zssiz = new ArrayList();
		List list = null;

		if (slxz != null) {
			list = this.g4Dao.queryForList("choiceOrder.getAllToneSharp");
			for (int i = 0; i < list.size(); i++) {
				String zslxz = ((Dto) list.get(i)).getAsString("zslxz");
				for (int j = 0; j < slxz.length; j++) {
					if (zslxz.trim().equals(slxz[j].trim())) {
						slxzList.add((Dto) list.get(i));
					}
				}
			}
		}
		data.put("slxz", slxzList);

		if (slgg != null) {
			list = this.g4Dao.queryForList("choiceOrder.getMainToneStyle");
			for (int i = 0; i < list.size(); i++) {
				String zslgg = ((Dto) list.get(i)).getAsString("zslgg");
				for (int j = 0; j < slgg.length; j++) {
					if (zslgg.trim().equals(slgg[j].trim())) {
						slggList.add((Dto) list.get(i));
					}
				}
			}
		}
		data.put("slgg", slggList);

		if (gy != null) {
			list = this.g4Dao.queryForList("choiceOrder.getTechnicsTypeInfo");
			for (int i = 0; i < list.size(); i++) {
				String atwrt = ((Dto) list.get(i)).getAsString("atwrt");
				for (int j = 0; j < gy.length; j++) {
					if (atwrt.trim().equals(gy[j].trim())) {
						gyList.add((Dto) list.get(i));
					}
				}
			}
		}
		data.put("gy", gyList);

		if (jlbm != null) {
			list = this.g4Dao.queryForList("choiceOrder.getGoldType");
			for (int i = 0; i < list.size(); i++) {
				String zjlbm = ((Dto) list.get(i)).getAsString("zjlbn");
				for (int j = 0; j < jlbm.length; j++) {
					if (zjlbm.trim().equals(jlbm[j].trim())) {
						jlbmList.add((Dto) list.get(i));
					}
				}
			}
		}
		data.put("jlbm", jlbmList);

		if (slbm != null) {
			list = this.g4Dao.queryForList("choiceOrder.getToneType");
			for (int i = 0; i < list.size(); i++) {
				String zslbm = ((Dto) list.get(i)).getAsString("zslbm");
				for (int j = 0; j < slbm.length; j++) {
					if (zslbm.trim().equals(slbm[j].trim())) {
						slbmList.add((Dto) list.get(i));
					}
				}
			}
		}
		data.put("slbm", slbmList);

		if (styles != null) {
			Dto paraDto = new BaseDto();
			paraDto.put("styles", styles);
			list = this.g4Dao.queryForList("choiceOrder.getStyles", paraDto);
			data.put("styles", list);
		}

		if (series != null) {
			Dto paraDto = new BaseDto();
			paraDto.put("series", series);
			list = this.g4Dao.queryForList("choiceOrder.getSeries", paraDto);
			data.put("series", list);
		}

		zssiz.add(info);
		data.put("allinfo", zssiz);

		String retStr = JsonHelper.encodeObject2Json(data);

		System.out.println(retStr);

		write(retStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getChoiceType(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		List retDto = new ArrayList();
		String werks = null;
		try {
			werks = super.getSessionContainer(request).getUserInfo()
					.getCustomId();
		} catch (Exception e) {
			log.debug(e.getMessage());
			e.printStackTrace();
			return mapping.findForward(null);
		}

		dto.put("werks", werks);
		Integer vkorg = (Integer) this.g4Dao.queryForObject(
				"posordersystem.vkorgType", dto);

		if (vkorg.intValue() != 1000) {
			return mapping.findForward(null);
		}

		dto.put("werks", werks + "-01");
		dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
		List list = this.g4Reader.queryForList("choiceOrder.getKondmByWerks",
				dto);
		for (int i = 0; i < list.size(); i++) {
			boolean flag = false;
			if ("01".equals(list.get(i))) {
				Dto da = new BaseDto();
				da.put("value", "X1");
				da.put("name", "X1 镶嵌（钻石）");
				retDto.add(da);
				da = new BaseDto();
				da.put("value", "X4");
				da.put("name", "X4 镶嵌（锆石）");
				retDto.add(da);
			} else if ("02".equals(list.get(i))) {
				Dto da = new BaseDto();
				da.put("value", "X2");
				da.put("name", "X2 镶嵌（红蓝宝）");
				retDto.add(da);
			} else if ("03".equals(list.get(i))) {
				Dto da = new BaseDto();
				da.put("value", "X3");
				da.put("name", "X3 镶嵌（彩宝）");
				retDto.add(da);
			} else if (("05".equals(list.get(i))) || ("15".equals(list.get(i)))) {
				for (int j = 0; j < retDto.size(); j++) {
					if ("Y1".equals(((Dto) retDto.get(j)).getAsString("value"))) {
						flag = true;
					}
				}

				if (flag) {
					continue;
				}
				Dto da = new BaseDto();
				da.put("value", "Y1");
				da.put("name", "Y1 玉石");
				retDto.add(da);
			} else if (("08".equals(list.get(i))) || ("09".equals(list.get(i)))
					|| ("11".equals(list.get(i))) || ("12".equals(list.get(i)))
					|| ("19".equals(list.get(i))) || ("20".equals(list.get(i)))) {
				for (int j = 0; j < retDto.size(); j++) {
					String value = ((Dto) retDto.get(j)).getAsString("value");
					if ("J1".equals(value)) {
						flag = true;
					}
				}
				if (flag) {
					continue;
				}
				Dto da = new BaseDto();
				da.put("value", "J1");
				da.put("name", "J1 黄金");
				retDto.add(da);
			} else if ("07".equals(list.get(i))) {
				Dto da = new BaseDto();
				da.put("value", "J2");
				da.put("name", "J2 铂金");
				retDto.add(da);
			} else if ("06".equals(list.get(i))) {
				Dto da = new BaseDto();
				da.put("value", "J3");
				da.put("name", "J3 K金");
				retDto.add(da);
			} else if ("10".equals(list.get(i))) {
				Dto da = new BaseDto();
				da.put("value", "J4");
				da.put("name", "J4 钯金");
				retDto.add(da);
			} else if (("04".equals(list.get(i))) || ("15".equals(list.get(i)))) {
				for (int j = 0; j < retDto.size(); j++) {
					if ("J5".equals(((Dto) retDto.get(j)).getAsString("value"))) {
						flag = true;
					}
				}
				if (flag) {
					continue;
				}
				Dto da = new BaseDto();
				da.put("value", "J5");
				da.put("name", "J5 银");
				retDto.add(da);
			}
			if (("14".equals(list.get(i))) || ("15".equals(list.get(i)))
					|| ("16".equals(list.get(i)))) {
				for (int j = 0; j < retDto.size(); j++) {
					if ("Q1".equals(((Dto) retDto.get(j)).getAsString("value"))) {
						flag = true;
					}
				}
				if (!flag) {
					Dto da = new BaseDto();
					da.put("value", "Q1");
					da.put("name", "Q1 其他");
					retDto.add(da);
				}

			}

		}

		Collections.sort(retDto, new myComparator());

		String regStr = JsonHelper.encodeObject2Json(retDto);
		write(regStr, response);
		return mapping.findForward(null);
	}

	public ActionForward getIfAllowEdit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		String werks = dto.getAsString("WERKS");
		String choiceOrderId = dto.getAsString("choiceorderid");

		AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
		AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
		rfcimport.getParameters().put("ZNUM", choiceOrderId);
		rfctransferinfo.setImportPara(rfcimport);
		SapTransferImpl transfer = new SapTransferImpl();
		AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_30",
				rfctransferinfo);
		String flag = (String) out.getExportPara().getParameters().get("FLAG");
		write(flag, response);
		return mapping.findForward(null);
	}

	public ActionForward getHeadGoldValue(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		HttpSession session = request.getSession();
		Dto dto = aForm.getParamAsDto(request);
		Dto retData = new BaseDto();

		String goldType = dto.getAsString("goldType");

		dto.put("goldType", goldType);
		dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
		Dto goldInfo = (Dto) this.g4Dao.queryForObject(
				"choiceOrder.getDailyGoldPrice", dto);
		if (goldInfo != null) {
			retData.put("success", "success");
		}

		String retStr = JsonHelper.encodeObject2Json(retData);
		write(retStr, response);
		return mapping.findForward(null);
	}

	public ActionForward importChoiceOrderExcel(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		FormFile file = aform.getTheFile();
		Dto dto = aform.getParamAsDto(request);
		InputStream is = file.getInputStream();

		List list = new ArrayList();
		Workbook wb = Workbook.getWorkbook(is);
		Sheet sheet = wb.getSheet(0);

		int rows = sheet.getRows();
		String metaData = "";
		for (int k = 3; k < rows; k++) {
			metaData = "";
			Dto rowDto = new BaseDto();
			Cell[] cells = sheet.getRow(k);
			if (!G4Utils.isEmpty(cells[1].getContents())) {
				if ("Y1".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zslbm,zslxz,zslys,zsfxq,zhpcc,zslhc,menge,zjg,ztext";
				else if ("Q1".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zslgg,zsz,zzslx,zslys,zsljd,zjlmc,zsfys,zfssl,zhpcc,zgy,menge,zjg,ztext";
				else if ("J5".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zjlmc,zjlfw,zhpcc,zgy,menge,zjg,ztext";
				else if ("J4".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zjlmc,zjlfw,zhpcc,zgy,menge,zjg,ztext";
				else if ("J3".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zjlmc,zhpcc,zgy,menge,zjg,ztext";
				else if ("J2".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zjlmc,zjlfw,zhpcc,zgy,menge,zjg,ztext";
				else if ("J1".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zjlmc,zjlfw,zhpcc,zgy,menge,zjg,ztext";
				else if ("X4".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zslbm,zsz,zslys,zjlmc,zsfys,zfssl,zhpcc,zgy,menge,zjg,ztext";
				else if ("X3".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zslbm,zsz,zslys,zjlmc,zsfys,zfssl,zhpcc,zgy,menge,zjg,ztext";
				else if ("X2".equals(cells[1].getContents()))
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zslbm,zsz,zslys,zjlmc,zsfys,zfssl,zhpcc,zgy,menge,zjg,ztext";
				else if ("X1".equals(cells[1].getContents())) {
					metaData = "ztype,maktx,matnr,werks,zcjsd,charg,zwlh,zslbm,zsz,zzslx,zslys,zsljd,zjlmc,zsfys,zfssl,zhpcc,zgy,menge,zjg,ztext";
				}

				if (!G4Utils.isEmpty(metaData)) {
					for (int j = 0; j < cells.length - 1; j++) {
						String key = metaData.trim().split(",")[j];
						if (G4Utils.isNotEmpty(key)) {
							rowDto.put(key, cells[(j + 1)].getContents());
						}
					}
				}

				if (rowDto.size() > 0)
					list.add(rowDto);
			}
		}
		if (list.size() <= 0) {
			setErrTipMsg("导入失败，请检查Excel文件!", response);
			return mapping.findForward(null);
		}

		AigTransferInfo transferInfo = AigRepository.getTransferInfo();
		List headList = new ArrayList();
		Map itemList = new HashMap();

		for (int i = 0; i < list.size(); i++) {
			String valueKey = ((Dto) list.get(i)).get("matnr").toString();
			if (itemList.containsKey(valueKey)) {
				Dto map1 = new BaseDto();
				map1.put("choiceorderid", valueKey);
				map1.put("materialnumber", ((Dto) list.get(i)).get("zwlh"));
				map1.put("remark", ((Dto) list.get(i)).get("ztext"));
				map1.put("upchoiceorderitem", "00");
				map1.put("quantity", Integer.valueOf(Integer
						.parseInt(G4Utils.isNotEmpty(((Dto) list.get(i))
								.getAsString("menge")) ? ((Dto) list.get(i))
								.getAsString("menge") : "0")));
				map1.put("goldweight", ((Dto) list.get(i)).getAsString("zjz"));
				map1.put("retailPrice", ((Dto) list.get(i)).get("zjg"));
				map1.put("toneType", ((Dto) list.get(i)).get("zslbm"));
				map1.put("goldType", ((Dto) list.get(i)).get("zjlmc"));
				map1.put("technics", ((Dto) list.get(i)).get("zgy"));
				map1.put("toneWeight", ((Dto) list.get(i)).get("zsz"));
				map1.put("mainToneStyle", ((Dto) list.get(i)).get("zslxz"));
				map1.put("toneFireColor", ((Dto) list.get(i)).get("zslhc"));
				map1.put("materialdesc", ((Dto) list.get(i)).get("maktx"));
				map1.put("goodsize", ((Dto) list.get(i)).get("zhpcc"));
				map1.put("toneNeatness", ((Dto) list.get(i)).get("zsljd"));
				map1.put("toneColor", ((Dto) list.get(i)).get("zslys"));
				map1.put("certificate", ((Dto) list.get(i)).get("zzslx"));
				map1.put("ifNeedLessTone", ((Dto) list.get(i)).get("zsfys"));
				map1.put("lessToneType", ((Dto) list.get(i)).get("zfssl"));
				map1.put("charg", ((Dto) list.get(i)).get("charg"));
				map1.put("type", ((Dto) list.get(i)).get("ztype"));
				map1.put("werks", ((Dto) list.get(i)).get("werks"));
				map1.put("mygoldweight", ((Dto) list.get(i)).get("zjlfw"));
				((List) itemList.get(valueKey)).add(map1);
			} else {
				List list1 = new ArrayList();
				Dto map1 = new BaseDto();
				map1.put("choiceorderid", valueKey);
				map1.put("materialnumber", ((Dto) list.get(i)).get("zwlh"));
				map1.put("remark", ((Dto) list.get(i)).get("ztext"));
				map1.put("upchoiceorderitem", "00");
				map1.put("quantity", Integer.valueOf(Integer
						.parseInt(G4Utils.isNotEmpty(((Dto) list.get(i))
								.getAsString("menge")) ? ((Dto) list.get(i))
								.getAsString("menge") : "0")));
				map1.put("goldweight", ((Dto) list.get(i)).getAsString("zjz"));
				map1.put("retailPrice", ((Dto) list.get(i)).get("zjg"));
				map1.put("toneType", ((Dto) list.get(i)).get("zslbm"));
				map1.put("goldType", ((Dto) list.get(i)).get("zjlmc"));
				map1.put("technics", ((Dto) list.get(i)).get("zgy"));
				map1.put("toneWeight", ((Dto) list.get(i)).get("zsz"));
				map1.put("mainToneStyle", ((Dto) list.get(i)).get("zslxz"));
				map1.put("toneFireColor", ((Dto) list.get(i)).get("zslhc"));
				map1.put("materialdesc", ((Dto) list.get(i)).get("maktx"));
				map1.put("goodsize", ((Dto) list.get(i)).get("zhpcc"));
				map1.put("toneNeatness", ((Dto) list.get(i)).get("zsljd"));
				map1.put("toneColor", ((Dto) list.get(i)).get("zslys"));
				map1.put("certificate", ((Dto) list.get(i)).get("zzslx"));
				map1.put("ifNeedLessTone", ((Dto) list.get(i)).get("zsfys"));
				map1.put("lessToneType", ((Dto) list.get(i)).get("zfssl"));
				map1.put("charg", ((Dto) list.get(i)).get("charg"));
				map1.put("type", ((Dto) list.get(i)).get("ztype"));
				map1.put("werks", ((Dto) list.get(i)).get("werks"));
				map1.put("mygoldweight", ((Dto) list.get(i)).get("zjlfw"));
				list1.add(map1);
				itemList.put(valueKey, list1);

				Dto map = new BaseDto();
				map.put("choiceorderid", ((Dto) list.get(i)).get("matnr"));
				map.put("type", ((Dto) list.get(i)).get("ztype"));
				map.put("werks", ((Dto) list.get(i)).get("werks"));
				String name1 = (String) this.g4Dao.queryForObject(
						"choiceOrder.getName1ByWerks", map.get("werks"));
				System.out.println(name1);
				map.put("name1", name1);
				map.put("orderflag", "NO");
				map.put("telephone", null);
				map.put("remark", ((Dto) list.get(i)).get("ztext"));
				try {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					Date date = sdf.parse((String) ((Dto) list.get(i))
							.get("zcjsd"));
					map.put("ordertime", date);
				} catch (Exception e) {
					map.put("ordertime", null);
				}

				headList.add(map);
			}
		}

		List elist = new ArrayList();
		List slist = this.g4Dao.queryForList("choiceOrder.getSlAll");

		for (int i = 0; i < headList.size(); i++) {
			String key = ((Dto) headList.get(i)).getAsString("choiceorderid");
			for (int j = 0; j < ((List) itemList.get(key)).size(); j++) {
				Dto edto = new BaseDto();

				String matnr = ((Dto) ((List) itemList.get(key)).get(j))
						.getAsString("materialnumber");
				Dto mdto = (Dto) this.g4Dao.queryForObject(
						"choiceOrder.getAllByMatnr", matnr);
				int orderidcount = ((Integer) this.g4Reader.queryForObject(
						"choiceOrder.getOrderIdCount", key)).intValue();
				if (G4Utils.isEmpty(mdto)) {
					edto.put("matnr", matnr);
					edto.put("err", "物料号不存在");
					edto.put("rownum", Integer.valueOf(j + 4));
				} else if (orderidcount != 0) {
					edto.put("matnr", matnr);
					edto.put("err", "单据编码已存在");
					edto.put("rownum", Integer.valueOf(j + 4));
				} else {
					((Dto) ((List) itemList.get(key)).get(j)).put("extwg", mdto
							.getAsString("extwg"));
					((Dto) ((List) itemList.get(key)).get(j)).put("matkl", mdto
							.getAsString("matkl"));
					String type = ((Dto) headList.get(i)).getAsString("type");
					Dto tdto = new BaseDto();
					tdto.put("type", ((Dto) headList.get(i))
							.getAsString("type"));
					tdto.put("kondm", mdto.get("kondm"));
					String count = (String) this.g4Dao.queryForObject(
							"choiceOrder.getKondmByType", tdto);

					Double toneWeight = Double
							.valueOf(Double
									.parseDouble(G4Utils
											.isNotEmpty(((Dto) ((List) itemList
													.get(key)).get(j))
													.getAsString("toneWeight")) ? ((Dto) ((List) itemList
											.get(key)).get(j))
											.getAsString("toneWeight")
											: "0"));
					Double zzszq = Double.valueOf(Double.parseDouble(G4Utils
							.isNotEmpty(mdto.getAsString("zzszq")) ? mdto
							.getAsString("zzszq") : "0"));
					Double zzszz = Double.valueOf(Double.parseDouble(G4Utils
							.isNotEmpty(mdto.getAsString("zzszz")) ? mdto
							.getAsString("zzszz") : "0"));

					Double goodsize = Double
							.valueOf(Double
									.parseDouble(G4Utils
											.isNotEmpty(((Dto) ((List) itemList
													.get(key)).get(j))
													.getAsString("goodsize")) ? ((Dto) ((List) itemList
											.get(key)).get(j))
											.getAsString("goodsize")
											: "0"));
					Double zhpccq = Double.valueOf(Double.parseDouble(G4Utils
							.isNotEmpty(mdto.getAsString("zhpccq")) ? mdto
							.getAsString("zhpccq") : "0"));
					Double zhpccz = Double.valueOf(Double.parseDouble(G4Utils
							.isNotEmpty(mdto.getAsString("zhpccz")) ? mdto
							.getAsString("zhpccz") : "0"));

					char[] chars = ((Dto) ((List) itemList.get(key)).get(j))
							.getAsString("mygoldweight").toCharArray();
					int num = 0;
					for (int x = 0; x < chars.length; x++) {
						if ('-' == chars[x]) {
							num++;
						}

					}

					if (num > 1) {
						edto.put("matnr", matnr);
						edto.put("err", "金重范围格式错误");
						edto.put("rownum", Integer.valueOf(j + 4));
					} else if (Integer
							.parseInt(G4Utils.isNotEmpty(count) ? count : "0") <= 0) {
						edto.put("matnr", matnr);
						edto.put("err", "kondm不匹配");
						edto.put("rownum", Integer.valueOf(j + 4));
					} else if ((toneWeight.doubleValue() < zzszq.doubleValue())
							|| (toneWeight.doubleValue() > zzszz.doubleValue())) {
						edto.put("matnr", matnr);
						edto.put("err", "石重不再范围内");
						edto.put("rownum", Integer.valueOf(j + 4));
					} else if ((goodsize.doubleValue() < zhpccq.doubleValue())
							|| (goodsize.doubleValue() > zhpccz.doubleValue())) {
						edto.put("matnr", matnr);
						edto.put("err", "货品尺寸不再范围内");
						edto.put("rownum", Integer.valueOf(j + 4));
					}
				}
				if (edto.size() > 0) {
					elist.add(edto);
				}

			}

		}

		if (elist.size() >= 1) {
			String errorStr = JsonHelper.encodeObject2Json(elist);
			errorStr = "{ROOT:" + errorStr + "}";
			System.out.println(errorStr);
			setErrTipMsg(errorStr, response);
			return mapping.findForward(null);
		}

		for (int i = 0; i < headList.size(); i++) {
			String key = ((Dto) headList.get(i)).getAsString("choiceorderid");
			double zsjz = 0.0D;
			int count = 0;
			String totalprice = "";
			int num1 = 0;
			int num2 = 0;

			for (int j = 0; j < ((List) itemList.get(key)).size(); j++) {
				int num = ((List) itemList.get(key)).size();
				zsjz += Double
						.parseDouble(G4Utils.isNotEmpty(((Dto) ((List) itemList
								.get(key)).get(j)).getAsString("goldweight")) ? ((Dto) ((List) itemList
								.get(key)).get(j)).getAsString("goldweight")
								: "0.0");
				count += Integer
						.parseInt(G4Utils.isNotEmpty(((Dto) ((List) itemList
								.get(key)).get(j)).getAsString("quantity")) ? ((Dto) ((List) itemList
								.get(key)).get(j)).getAsString("quantity")
								: "0");

				BigDecimal dec = new BigDecimal(zsjz);
				dec = dec.setScale(2, 4);
				zsjz = dec.doubleValue();
				totalprice = G4Utils.isNotEmpty(((Dto) ((List) itemList
						.get(key)).get(j)).getAsString("retailPrice")) ? ((Dto) ((List) itemList
						.get(key)).get(j)).getAsString("retailPrice")
						: "0-0";
				String[] prices = totalprice.split("-");
				num1 += Integer.parseInt(prices[0]);
				num2 += Integer.parseInt(prices[1]);

				int menge = Integer
						.parseInt(G4Utils.isNotEmpty(((Dto) ((List) itemList
								.get(key)).get(j)).getAsString("quantity")) ? ((Dto) ((List) itemList
								.get(key)).get(j)).getAsString("quantity")
								: "0");
				int num3 = Integer.parseInt(prices[0]) * menge;
				int num4 = Integer.parseInt(prices[1]) * menge;

				((Dto) ((List) itemList.get(key)).get(j)).put("littleTotal",
						num3 + "-" + num4);
			}
			((Dto) headList.get(i))
					.put("totalgoldweight", Double.valueOf(zsjz));
			((Dto) headList.get(i)).put("oldquantity", Integer.valueOf(count));
			((Dto) headList.get(i)).put("quantity", Integer.valueOf(count));
			((Dto) headList.get(i)).put("oldtotalmoney", num1 + "-" + num2);
			((Dto) headList.get(i)).put("totalmoney", num1 + "-" + num2);
		}

		for (int i = 0; i < headList.size(); i++) {
			String hkey = (String) ((Dto) headList.get(i)).get("choiceorderid");
			for (int j = 0; j < ((List) itemList.get(hkey)).size(); j++) {
				String bzj = "";
				Dto pdto = new BaseDto();
				pdto.put("matnr", ((Dto) ((List) itemList.get(hkey)).get(j))
						.get("materialnumber"));
				pdto.put("werks", ((Dto) ((List) itemList.get(hkey)).get(j))
						.get("werks"));

				Object phxs = null;
				Object hjxs = this.g4Dao.queryForObject(
						"choiceOrder.getHJXSByMatnr", pdto);
				if ("1000".equals(pdto.get("werks")))
					phxs = Double.valueOf(1000.0D);
				else {
					phxs = this.g4Dao.queryForObject(
							"choiceOrder.getPHXSByMatnr", pdto);
				}

				if (G4Utils.isEmpty(((Dto) ((List) itemList.get(hkey)).get(j))
						.getAsString("retailPrice"))) {
					((Dto) ((List) itemList.get(hkey)).get(j))
							.put("bzj", "0-0");
				} else {
					String retailPrice = ((Dto) ((List) itemList.get(hkey))
							.get(j)).getAsString("retailPrice");
					String[] retailPrices = retailPrice.split("-");

					if (retailPrices.length == 1) {
						retailPrices[1] = retailPrices[0];
					}
					if (retailPrices.length == 2) {
						Double bzj1 = Double
								.valueOf(Double.parseDouble(retailPrices[0])
										/ (((Double) (G4Utils.isNotEmpty(phxs) ? phxs
												: Double.valueOf(0.0D)))
												.doubleValue() / 1000.0D));
						Double bzj2 = Double
								.valueOf(Double.parseDouble(retailPrices[1])
										/ (((Double) (G4Utils.isNotEmpty(phxs) ? phxs
												: Double.valueOf(0.0D)))
												.doubleValue() / 1000.0D));
						DecimalFormat df = new DecimalFormat("#0.00");
						bzj = df.format(bzj1) + "-" + df.format(bzj2);
						((Dto) ((List) itemList.get(hkey)).get(j)).put("bzj",
								bzj);
					}

				}

				if ("J3".equals(((Dto) headList.get(i)).get("type"))) {
					Dto paraDto = new BaseDto();
					paraDto.put("goldType", ((Dto) ((List) itemList.get(hkey))
							.get(j)).get("goldType"));
					Dto goldInfo = (Dto) this.g4Dao.queryForObject(
							"choiceOrder.getDailyGoldPrice", paraDto);
					Double goldRealPrice = Double.valueOf(0.0D);
					Double scale = Double.valueOf(0.0D);
					try {
						goldRealPrice = Double
								.valueOf(Double.parseDouble(G4Utils
										.isNotEmpty(goldInfo) ? goldInfo
										.getAsString("ztjac") : "0.0"));
						scale = Double.valueOf(Double.parseDouble(G4Utils
								.isNotEmpty(goldInfo) ? goldInfo
								.getAsString("zqzbl") : "0.0"));
					} catch (Exception e) {
						e.printStackTrace();
					}
					Double dailyGoldPrice = Double.valueOf(goldRealPrice
							.doubleValue()
							* scale.doubleValue());

					Double goldWeight1 = Double.valueOf(1.0D);
					Double goldWeight2 = Double.valueOf(1.0D);
					String retailPrice = G4Utils
							.isNotEmpty(((Dto) ((List) itemList.get(hkey))
									.get(j)).get("retailPrice")) ? ((Dto) ((List) itemList
							.get(hkey)).get(j)).getAsString("retailPrice")
							: "0-0";
					String[] retailPrices = retailPrice.split("-");
					try {
						goldWeight1 = Double.valueOf(dailyGoldPrice
								.doubleValue() == 0.0D ? 1.0D : Double
								.parseDouble(retailPrices[0])
								/ dailyGoldPrice.doubleValue()
								/ (G4Utils.isNotEmpty(phxs) ? ((Double) phxs)
										.doubleValue() : 1.0D)
								* 1000.0D
								/ (G4Utils.isNotEmpty(hjxs) ? ((Double) hjxs)
										.doubleValue() : 1.0D));
						goldWeight2 = Double.valueOf(dailyGoldPrice
								.doubleValue() == 0.0D ? 1.0D : Double
								.parseDouble(retailPrices[1])
								/ dailyGoldPrice.doubleValue()
								/ (G4Utils.isNotEmpty(phxs) ? ((Double) phxs)
										.doubleValue() : 1.0D)
								* 1000.0D
								/ (G4Utils.isNotEmpty(hjxs) ? ((Double) hjxs)
										.doubleValue() : 1.0D));
					} catch (Exception e) {
						log.debug("K金反算金重时出现错误:" + e.getMessage());
						e.printStackTrace();
					}
					DecimalFormat df = new DecimalFormat("#.##");
					String mygoldweight = df.format(goldWeight1) + "-"
							+ df.format(goldWeight2);
					((Dto) ((List) itemList.get(hkey)).get(j)).put(
							"mygoldweight", mygoldweight);
				}
			}

			transferInfo.getImportPara().getParameters().put("I_WERKS",
					((Dto) headList.get(i)).get("werks"));
			AigTransferTable orderHead = transferInfo.getTable("IT_ZXDH");
			orderHead.setValue("ZTYPE", ((Dto) headList.get(i)).get("type"));
			orderHead.setValue("WERKS", ((Dto) headList.get(i)).get("werks"));
			orderHead.setValue("ZDATE", ((Dto) headList.get(i))
					.get("ordertime"));
			orderHead.setValue("TEXT", ((Dto) headList.get(i)).get("remark"));
			orderHead.setValue("ZSJZ", ((Dto) headList.get(i))
					.get("totalgoldweight"));
			orderHead.setValue("ZSUM", ((Dto) headList.get(i))
					.get("oldquantity"));
			orderHead.setValue("ZPRICE", ((Dto) headList.get(i))
					.get("oldtotalmoney"));
			orderHead.setValue("NAME1", ((Dto) headList.get(i)).get("name1"));
			orderHead.appendRow();
			transferInfo.appendTable(orderHead);

			AigTransferTable orderItem = transferInfo.getTable("IT_ZXDI");

			for (int j = 0; j < ((List) itemList.get(hkey)).size(); j++) {
				int num = 1;

				orderItem.setValue("WERKS", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("werks"));
				orderItem.setValue("CHARG", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("charg"));
				orderItem.setValue("ZITEM", Integer.valueOf((num + j) * 10));
				orderItem.setValue("MATNR", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("materialnumber"));
				orderItem.setValue("MAKTX", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("materialdesc"));
				orderItem.setValue("MENGE", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("quantity"));
				orderItem.setValue("ZJSN", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("quantity"));
				orderItem.setValue("ZKS", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("toneType"));
				orderItem.setValue("ZZHOG", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("toneType"));
				orderItem.setValue("ZZSZ", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("toneWeight"));
				orderItem.setValue("ZJG", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("retailPrice"));
				orderItem.setValue("ZJZ", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("mygoldweight") == null ? "1-1"
						: ((Dto) ((List) itemList.get(hkey)).get(j))
								.get("mygoldweight"));
				orderItem.setValue("ZTEXT", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("remark"));

				orderItem.setValue("ZJLMC", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("goldType"));
				orderItem.setValue("ZJL", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("goldType"));
				orderItem.setValue("ZGY", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("technics"));
				orderItem.setValue("ZHPCC", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("goodsize"));
				orderItem.setValue("ZZSJD", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("toneNeatness"));

				orderItem.setValue("ZZSYS", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("toneColor"));
				orderItem.setValue("ZSE", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("toneColor"));
				orderItem.setValue("ZSLYS", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("toneColor"));

				orderItem.setValue("ZBZJ", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("bzj"));
				orderItem.setValue("ZZSLX", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("certificate"));
				orderItem.setValue("ZSFYS", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("ifNeedLessTone"));
				orderItem.setValue("ZFSSL", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("lessToneType"));
				orderItem.setValue("ZSLHC", ((Dto) ((List) itemList.get(hkey))
						.get(j)).get("toneFireColor"));
				orderItem.appendRow();
			}
			transferInfo.appendTable(orderItem);
			SapTransferImpl transfer = new SapTransferImpl();
			AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_10",
					transferInfo);

			ArrayList outlist = out.getAigTable("IT_RETURN");

			String result = (String) ((HashMap) outlist.get(0)).get("TYPE");
			String msg = (String) ((HashMap) outlist.get(0)).get("MESSAGE");
			String saporderid = (String) out.getParameters("E_NUM");

			System.out.println(saporderid);
			for (int k = 0; k < outlist.size(); k++) {
				System.out.println(((HashMap) outlist.get(k)).get("TYPE"));
				System.out.println(((HashMap) outlist.get(k)).get("MESSAGE"));
			}

			if ("S".equals(result)) {
				String saporderid1 = (String) out.getParameters("E_NUM");
				((Dto) headList.get(i)).put("saporderid", saporderid1);

				Date ordertime = (Date) ((Dto) headList.get(i))
						.get("ordertime");
				if (G4Utils.isNotEmpty(ordertime)) {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					String orderDate = sdf.format(ordertime);
					((Dto) headList.get(i)).put("ordertime", orderDate);
				}

				String hkeys = (String) ((Dto) headList.get(i))
						.get("choiceorderid");
				try {
					if (itemList.containsKey(hkeys))
						for (int k = 0; k < ((List) itemList.get(hkeys)).size(); k++) {
							String tonetype = ((Dto) ((List) itemList
									.get(hkeys)).get(k))
									.getAsString("toneType");
							String goldtype = ((Dto) ((List) itemList
									.get(hkeys)).get(k))
									.getAsString("goldType");
							String tonecolor = ((Dto) ((List) itemList
									.get(hkeys)).get(k))
									.getAsString("toneColor");
							String toneneatness = ((Dto) ((List) itemList
									.get(hkeys)).get(k))
									.getAsString("toneNeatness");
							String technics = ((Dto) ((List) itemList
									.get(hkeys)).get(k))
									.getAsString("technics");
							String toneFireColor = ((Dto) ((List) itemList
									.get(hkeys)).get(k))
									.getAsString("toneFireColor");
							String certificate = ((Dto) ((List) itemList
									.get(hkeys)).get(k))
									.getAsString("certificate");
							String lessToneType = ((Dto) ((List) itemList
									.get(hkeys)).get(k))
									.getAsString("lessToneType");

							if (G4Utils.isNotEmpty(lessToneType)) {
								((Dto) ((List) itemList.get(hkeys)).get(k))
										.put("lessToneType", lessToneType
												+ "|-|" + lessToneType);
							}

							String tonetypeStr = Common.getToneType(tonetype);
							if (G4Utils.isNotEmpty(tonetypeStr)) {
								((Dto) ((List) itemList.get(hkeys)).get(k))
										.put("toneType", tonetype + "|-|"
												+ tonetypeStr);
							} else {
								tonetypeStr = Common.getToneTypeKey(tonetype);
								if (G4Utils.isEmpty(tonetypeStr))
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("toneType", null);
								else {
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("toneType", tonetypeStr
													+ "|-|" + tonetype);
								}
							}
							String goldtypeStr = Common.getGoldType(goldtype);
							if (G4Utils.isNotEmpty(goldtypeStr)) {
								((Dto) ((List) itemList.get(hkeys)).get(k))
										.put("goldType", goldtype + "|-|"
												+ goldtypeStr);
							} else {
								goldtypeStr = Common.getGoldTypeKey(goldtype);
								if (G4Utils.isEmpty(goldtypeStr))
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("goldType", null);
								else {
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("goldType", goldtypeStr
													+ "|-|" + goldtype);
								}
							}
							String tonecolorStr = Common
									.getToneColor(tonecolor);
							if (G4Utils.isNotEmpty(tonecolorStr)) {
								((Dto) ((List) itemList.get(hkeys)).get(k))
										.put("toneColor", tonecolor + "|-|"
												+ tonecolorStr);
							} else {
								tonecolorStr = Common
										.getToneColorKey(tonecolor);
								if (G4Utils.isEmpty(tonecolorStr))
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("toneColor", null);
								else {
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("toneColor", tonecolorStr
													+ "|-|" + tonecolor);
								}
							}
							String toneneatnessStr = Common
									.getToneNeatNess(toneneatness);
							if (G4Utils.isNotEmpty(toneneatnessStr)) {
								((Dto) ((List) itemList.get(hkeys)).get(k))
										.put("toneNeatness", toneneatness
												+ "|-|" + toneneatnessStr);
							} else {
								toneneatnessStr = Common
										.getToneNeatNessKey(toneneatness);
								if (G4Utils.isEmpty(toneneatnessStr))
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("toneNeatness", null);
								else {
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("toneNeatness",
													toneneatnessStr + "|-|"
															+ toneneatness);
								}
							}
							String technicsStr = Common.getTechnics(technics);
							if (G4Utils.isNotEmpty(technicsStr)) {
								((Dto) ((List) itemList.get(hkeys)).get(k))
										.put("technics", technics + "|-|"
												+ technicsStr);
							} else {
								technicsStr = Common.getTechnicsKey(technics);
								if (G4Utils.isEmpty(technicsStr))
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("technics", null);
								else {
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("technics", technicsStr
													+ "|-|" + technics);
								}
							}
							String toneFireColorStr = Common
									.getToneFireColor(toneFireColor);
							if (G4Utils.isNotEmpty(toneFireColorStr)) {
								((Dto) ((List) itemList.get(hkeys)).get(k))
										.put("toneFireColor", toneFireColor
												+ "|-|" + toneFireColorStr);
							} else {
								toneFireColorStr = Common
										.getToneFireColorKey(toneFireColor);
								if (G4Utils.isEmpty(toneFireColorStr))
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("toneFireColor", null);
								else {
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("toneFireColor",
													toneFireColorStr + "|-|"
															+ toneFireColor);
								}
							}
							String certificateStr = Common
									.getCertificate(certificate);
							if (G4Utils.isNotEmpty(certificateStr)) {
								((Dto) ((List) itemList.get(hkeys)).get(k))
										.put("certificate", certificate + "|-|"
												+ certificateStr);
							} else {
								certificateStr = Common
										.getCertificateKey(certificate);
								if (G4Utils.isEmpty(certificateStr))
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("certificate", null);
								else {
									((Dto) ((List) itemList.get(hkeys)).get(k))
											.put("certificate", certificateStr
													+ "|-|" + certificate);
								}
							}
							((Dto) ((List) itemList.get(hkeys)).get(k)).put(
									"saporderid", saporderid1);
						}
				} catch (Exception e) {
					continue;
				}

				String key = ((Dto) headList.get(i)).get("choiceorderid")
						.toString();
				for (int j = 0; j < ((List) itemList.get(key)).size(); j++) {
					Dto item = (Dto) ((List) itemList.get(key)).get(j);
					int num = 1;
					item
							.put("choiceorderitem", Integer
									.valueOf((num + j) * 10));

					this.g4Dao.insert("choiceOrder.saveChoiceOrderItem", item);
				}
				this.choiceOrderservice.saveChoiceOrder((Dto) headList.get(i));
			}
		}
		setOkTipMsg("导入成功", response);
		return mapping.findForward(null);
	}

	public class myComparator implements Comparator {
		public myComparator() {
		}

		public int compare(Object o1, Object o2) {
			Dto dto1 = (Dto) o1;
			Dto dto2 = (Dto) o2;
			String value1 = (String) dto1.get("value");
			String value2 = (String) dto2.get("value");
			Integer num1 = Integer.valueOf(Integer
					.parseInt(value1.substring(1)));
			Integer num2 = Integer.valueOf(Integer
					.parseInt(value2.substring(1)));

			if ((value1.startsWith("X")) && (value2.startsWith("X"))) {
				if (num1.intValue() > num2.intValue()) {
					return 1;
				}
				return -1;
			}
			if ((value1.startsWith("X")) && (value2.startsWith("J")))
				return -1;
			if ((value1.startsWith("X")) && (value2.startsWith("Z")))
				return -1;
			if ((value1.startsWith("X")) && (value2.startsWith("Q")))
				return -1;
			if ((value1.startsWith("Q")) && (value2.startsWith("X")))
				return 1;
			if ((value1.startsWith("Q")) && (value2.startsWith("J")))
				return -1;
			if ((value1.startsWith("Q")) && (value2.startsWith("Y")))
				return -1;
			if ((value1.startsWith("J")) && (value2.startsWith("X")))
				return 1;
			if ((value1.startsWith("J")) && (value2.startsWith("Q")))
				return 1;
			if ((value1.startsWith("J")) && (value2.startsWith("J"))) {
				if (num1.intValue() > num2.intValue()) {
					return 1;
				}
				return -1;
			}
			if ((value1.startsWith("J")) && (value2.startsWith("Y")))
				return -1;
			if ((value1.startsWith("Y")) && (value2.startsWith("X")))
				return 1;
			if ((value1.startsWith("Y")) && (value2.startsWith("Q")))
				return 1;
			if ((value1.startsWith("Y")) && (value2.startsWith("J"))) {
				return 1;
			}
			return 0;
		}
	}
}