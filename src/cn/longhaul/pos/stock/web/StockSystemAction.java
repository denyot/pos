package cn.longhaul.pos.stock.web;

import cn.longhaul.pos.common.Common;
import cn.longhaul.pos.stock.service.StockService;
import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.SapTransfer;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import cn.longhaul.sap.system.info.TransferInfo;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class StockSystemAction extends BaseAction {
    private StockService stockService = (StockService) getService("stockService");
    //	private OrderConfigerService orderconfiger = (OrderConfigerService) super.getService("orderConfigerService2");
    private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
    private static Log log = LogFactory.getLog(StockSystemAction.class);
    private Map<String, List<Map<String, Object>>> goodInfo = new HashMap();
    private Map<String, List<Map<String, Object>>> labelVerificationInfo = new HashMap();
    private Map<String, List<Map<String, Object>>> receiveGoodInfo = new HashMap();
    private List<Dto> reasonDto = null;

    private Dto lgortMap = null;
    private String werks = null;

    public StockSystemAction() {
        this.reasonDto = this.g4Dao.queryForList("commonsqlmap.getReasons");
    }

    public ActionForward start(ActionMapping mapping, ActionForm form,
                               HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return mapping.findForward("start");
    }

    public ActionForward getDiffInfoForSingleGood(ActionMapping mapping,
                                                  ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);

        List data = this.g4Dao
                .queryForList("stocksystem.getDiffInfoForSingleGood");

        for (int i = 0; i < data.size(); i++) {
            Dto item = (Dto) data.get(i);
            String id = item.getAsString("id");
            String description = item.getAsString("description");
            item.put("diffDetail", id + "、" + description);
        }
        String retStr = JsonHelper.encodeObject2Json(data);
        write(retStr, response);
        return mapping.findForward("start");
    }

    public ActionForward getDiffInfoForHead(ActionMapping mapping,
                                            ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);

        List data = this.g4Dao.queryForList("stocksystem.getDiffInfoForHead");

        for (int i = 0; i < data.size(); i++) {
            Dto item = (Dto) data.get(i);
            String id = item.getAsString("id");
            String description = item.getAsString("description");
            item.put("diffDetail", id + "、" + description);
        }

        String retStr = JsonHelper.encodeObject2Json(data);

        write(retStr, response);

        return mapping.findForward("start");
    }

    public ActionForward getReceiveGoodsHead(ActionMapping mapping,
                                             ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
//		System.out.println(werks);
        String vkorg = (String) this.g4Reader.queryForObject("stocksystem.getVkorg", dto);
        SapTransfer transferservice = new SapTransferImpl();

        TransferInfo transferInfo = new TransferInfo();
        transferInfo.getImportPara().getParameters().put("I_WERKS", werks);
        String rfc = "";
        if ("1000".equals(vkorg.trim()))
            rfc = "Z_RFC_STORE_11";
        else if ("9000".equals(vkorg.trim())) {
            rfc = "Z_RFC_STORE_13";
        }
        AigTransferInfo outinfo = transferservice.transferInfoAig(rfc, transferInfo);

        ArrayList l_AigTable = outinfo.getAigTable("IT_EKPO_HP");
        ArrayList l_AigTable2 = outinfo.getAigTable("IT_EKPO_DXF");
        if (G4Utils.isNotEmpty(l_AigTable2))
            l_AigTable.addAll(l_AigTable2);
        ArrayList l_AigTableDetail = outinfo.getAigTable("GT_EKPO_HP");
        ArrayList l_AigTableDetail2 = outinfo.getAigTable("GT_EKPO_DXP");
        if (G4Utils.isNotEmpty(l_AigTableDetail2)) {
            l_AigTableDetail.addAll(l_AigTableDetail2);
        }

        this.goodInfo.clear();

        DecimalFormat df = new DecimalFormat("#.## ");

        for (int i = 0; i < l_AigTableDetail.size(); i++) {
            String VBELN = (String) ((HashMap) l_AigTableDetail.get(i))
                    .get("VBELN");
            if (this.goodInfo.containsKey(VBELN)) {
                ((List) this.goodInfo.get(VBELN)).add((Map) l_AigTableDetail
                        .get(i));
            } else {
                ArrayList good = new ArrayList();
                good.add((Map) l_AigTableDetail.get(i));
                this.goodInfo.put(VBELN, good);
            }
        }
        try {
            if (G4Utils.isNotEmpty(l_AigTable)) {
                for (int i = 0; i < l_AigTable.size(); i++) {
                    HashMap item = (HashMap) l_AigTable.get(i);
                    String postType = (String) item.get("ZYJFS");
                    String goodType = (String) item.get("ZYJLX");
                    item.put("postType", getPostTypeStr(postType));
                    item.put("goodType", getGoodTypeStr(goodType));

                    String vbeln = (String) item.get("VBELN");

                    List detailItems = (List) this.goodInfo.get(vbeln);
                    Double total = Double.valueOf(0.0D);
                    Double totalCount = Double.valueOf(0.0D);
                    Double totalWeight = Double.valueOf(0.0D);
                    List chargs = new ArrayList();
                    if (G4Utils.isNotEmpty(detailItems)) {
                        for (int j = 0; j < detailItems.size(); j++) {
                            Map detailItem = (Map) detailItems.get(j);
                            chargs.add(detailItem.get("CHARG"));
                            Double kbert = Double.valueOf(Double
                                    .parseDouble((String) detailItem
                                            .get("KBETR")));
                            total = Double.valueOf(total.doubleValue()
                                    + kbert.doubleValue());
                            if ("G".equals(detailItem.get("MEINS"))) {
                                detailItem.put("count", Integer.valueOf(1));
                                detailItem.put("hpzl", detailItem.get("MENGE"));
                                totalWeight = Double
                                        .valueOf(totalWeight.doubleValue()
                                                + Double
                                                .parseDouble((String) detailItem
                                                        .get("MENGE")));
                                totalCount = Double.valueOf(totalCount
                                        .doubleValue() + 1.0D);
                            } else {
                                totalCount = Double
                                        .valueOf(totalCount.doubleValue()
                                                + Double
                                                .parseDouble((String) detailItem
                                                        .get("MENGE")));
                                detailItem
                                        .put("count", detailItem.get("MENGE"));
                                Object hpzl = this.g4Dao.queryForObject(
                                        "stocksystem.getHPZL", detailItem
                                                .get("CHARG"));
                                hpzl = hpzl == null ? Integer.valueOf(0) : hpzl;
                                detailItem.put("hpzl", hpzl);
                                totalWeight = Double
                                        .valueOf(totalWeight.doubleValue()
                                                + Double
                                                .parseDouble(hpzl != null ? hpzl
                                                        .toString()
                                                        : "0"));
                            }
                        }

                        Dto paraDto = new BaseDto();
                        paraDto.put("chargs", chargs);
                        paraDto.put("werks", werks);
                        paraDto.put("currentDate", G4Utils
                                .getCurrentTime("yyyy-MM-dd"));

                        item.put("totalmoney", df.format(total));
                        item.put("totalcount", totalCount);
                        item.put("totalweight", df.format(totalWeight));
                    }
                }
            }
            if (G4Utils.isNotEmpty(l_AigTable2))
                for (int i = 0; i < l_AigTable2.size(); i++) {
                    HashMap item = (HashMap) l_AigTable2.get(i);
                    String postType = (String) item.get("ZYJFS");
                    String goodType = (String) item.get("ZYJLX");
                    item.put("postType", getPostTypeStr(postType));
                    item.put("goodType", getGoodTypeStr(goodType));

                    String vbeln = (String) item.get("VBELN");

                    List detailItems = (List) this.goodInfo.get(vbeln);
                    Double total = Double.valueOf(0.0D);
                    Double totalCount = Double.valueOf(0.0D);
                    Double totalWeight = Double.valueOf(0.0D);
                    List chargs = new ArrayList();
                    if (G4Utils.isNotEmpty(detailItems)) {
                        for (int j = 0; j < detailItems.size(); j++) {
                            Map detailItem = (Map) detailItems.get(j);
                            chargs.add(detailItem.get("CHARG"));

                            Double kbert = Double.valueOf(Double
                                    .parseDouble((String) detailItem
                                            .get("KBETR")));
                            total = Double.valueOf(total.doubleValue()
                                    + kbert.doubleValue());
                            if ("G".equals(detailItem.get("MEINS"))) {
                                detailItem.put("count", Integer.valueOf(1));
                                detailItem.put("hpzl", detailItem.get("MENGE"));
                                totalWeight = Double
                                        .valueOf(totalWeight.doubleValue()
                                                + Double
                                                .parseDouble((String) detailItem
                                                        .get("MENGE")));
                                totalCount = Double.valueOf(totalCount
                                        .doubleValue() + 1.0D);
                            } else {
                                totalCount = Double
                                        .valueOf(totalCount.doubleValue()
                                                + Double
                                                .parseDouble((String) detailItem
                                                        .get("MENGE")));
                                detailItem
                                        .put("count", detailItem.get("MENGE"));
                                Object hpzl = this.g4Dao.queryForObject(
                                        "stocksystem.getHPZL", detailItem
                                                .get("CHARG"));
                                hpzl = hpzl == null ? Integer.valueOf(0) : hpzl;
                                detailItem.put("hpzl", hpzl);
                                totalWeight = Double.valueOf(totalWeight
                                        .doubleValue()
                                        + Double.parseDouble((String) (G4Utils
                                        .isEmpty(hpzl) ? "0" : hpzl)));
                            }
                        }
                        Dto paraDto = new BaseDto();
                        paraDto.put("chargs", chargs);
                        paraDto.put("werks", werks);
                        paraDto.put("currentDate", G4Utils
                                .getCurrentTime("yyyy-MM-dd"));

                        item.put("totalmoney", df.format(total));
                        item.put("totalcount", totalCount);
                        item.put("totalweight", df.format(totalWeight));
                    }
                }
        } catch (Exception e) {
            log.debug(e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(l_AigTable, "yyyy-MM-dd");
        retStr = "{ROOT:" + retStr + "}";
//		System.out.println(retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getReceiveGoodsHeadForYHP(ActionMapping mapping,
                                                   ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
//		System.out.println(werks);

        SapTransfer transferservice = new SapTransferImpl();

        TransferInfo transferInfo = new TransferInfo();
        transferInfo.getImportPara().getParameters().put("I_WERKS", werks);

        AigTransferInfo outinfo = transferservice.transferInfoAig(
                "Z_RFC_STORE_11", transferInfo);

        ArrayList l_AigTable_YHP = outinfo.getAigTable("IT_EKPO_YHP");

        for (int i = 0; i < l_AigTable_YHP.size(); i++) {
            String postType = (String) ((HashMap) l_AigTable_YHP.get(i))
                    .get("ZYJFS");
            String goodType = (String) ((HashMap) l_AigTable_YHP.get(i))
                    .get("ZYJLX");
            ((HashMap) l_AigTable_YHP.get(i)).put("postType",
                    getPostTypeStr(postType));
            ((HashMap) l_AigTable_YHP.get(i)).put("goodType",
                    getGoodTypeStr(goodType));
        }

        ArrayList l_AigTableDetail_YHP = outinfo.getAigTable("GT_EKPO_YHP");

        this.goodInfo.clear();

        for (int i = 0; i < l_AigTableDetail_YHP.size(); i++) {
            String VBELN = (String) ((HashMap) l_AigTableDetail_YHP.get(i))
                    .get("VBELN");
            if (this.goodInfo.containsKey(VBELN)) {
                ((List) this.goodInfo.get(VBELN))
                        .add((Map) l_AigTableDetail_YHP.get(i));
            } else {
                ArrayList good = new ArrayList();
                good.add((Map) l_AigTableDetail_YHP.get(i));
                this.goodInfo.put(VBELN, good);
            }
        }
        String retStr = JsonHelper.encodeObject2Json(l_AigTable_YHP,
                "yyyy-MM-dd");
        retStr = "{ROOT:" + retStr + "}";
//		System.out.println(retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getReceiveGoodDetail(ActionMapping mapping,
                                              ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        } catch (Exception e) {
            String werks;
            e.printStackTrace();
            return mapping.findForward(null);
        }
        String VBELN = (String) dto.get("VBELN");
        dto.put("VBELN", VBELN);

        List detail = (List) this.goodInfo.get(VBELN);
        List matnrs = new ArrayList();
        List chargs = new ArrayList();
        for (int i = 0; i < detail.size(); i++) {
            matnrs.add((String) ((Map) detail.get(i)).get("MATNR"));
            if (G4Utils.isNotEmpty(((Map) detail.get(i)).get("CHARG"))) {
                chargs.add((String) ((Map) detail.get(i)).get("CHARG"));
            }
        }

        dto.put("matnrs", matnrs);
        dto.put("chargs", chargs.size() == 0 ? null : chargs);
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

        List list = this.g4Reader.queryForList(
                "stocksystem.getReceiveGoodDetail", dto);

        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
        }

        for (int i = 0; i < list.size(); i++) {
            if (G4Utils.isEmpty(((Map) detail.get(i)).get("CHARG"))) {
//				System.out.println(((Dto) list.get(i)).get("matnr"));
//				System.out.println(((Map) detail.get(i)).get("MATNR"));
                if (((Map) detail.get(i)).get("MATNR").equals(
                        ((Dto) list.get(i)).get("matnr")))
                    ((Map) detail.get(i)).putAll((Map) list.get(i));
                else {
                    for (int j = 0; j < detail.size(); j++)
                        if (((Map) detail.get(j)).get("MATNR").equals(
                                ((Dto) list.get(i)).get("matnr")))
                            ((Map) detail.get(j)).putAll((Map) list.get(i));
                }
            } else {
//				System.out.println(((Dto) list.get(i)).get("charg"));
//				System.out.println(((Map) detail.get(i)).get("CHARG"));
                if (((Map) detail.get(i)).get("CHARG").equals(
                        ((Dto) list.get(i)).get("charg")))
                    ((Map) detail.get(i)).putAll((Map) list.get(i));
                else {
                    for (int j = 0; j < detail.size(); j++) {
                        if (((Map) detail.get(j)).get("CHARG").equals(
                                ((Dto) list.get(i)).get("charg"))) {
                            ((Map) detail.get(j)).putAll((Map) list.get(i));
                        }
                    }
                }
            }
        }

        String retStr = JsonHelper.encodeObject2Json(detail, "yyyy-MM-dd");
        retStr = "{ROOT:" + retStr + "}";
//		System.out.println(retStr);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward inStock(ActionMapping mapping, ActionForm form,
                                 HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String rfcName = "";

            String ifLifnr = dto.getAsString("ifLifnr");

            rfcName = "Z_RFC_STORE_12";

            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List items = JsonHelper.parseJson2List(G4Utils.replace4JsOutput(dto
                    .getAsString("chargitem")));

            Dto recieveHeaderDto = new BaseDto();
            Integer needvalified = Integer.valueOf(0);
            recieveHeaderDto.put("werks", werks);

            recieveHeaderDto.put("postno", dto.getAsString("postno"));
            recieveHeaderDto.put("posttype", dto.getAsString("postType"));
            recieveHeaderDto.put("goodtype", dto.getAsString("goodType"));
            recieveHeaderDto.put("datum", dto.getAsString("datum"));
            recieveHeaderDto.put("recievedate", G4Utils
                    .getCurrentTime("yyyy-MM-dd"));

            String maxId = "RD" + werks + G4Utils.getCurrentTime("yyyyMMdd");
            String maxrecieveid = "";
            String maxorderid = (String) this.g4Dao.queryForObject(
                    "stocksystem.getmaxstoreid", maxId);
            if ((maxorderid == null) || ("".equals(maxorderid))) {
                maxId = maxId + "001";
            } else {
                String maxid = maxorderid.substring(maxorderid.length() - 3,
                        maxorderid.length());
                Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
                maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
                String pattern = "000";
                DecimalFormat df = new DecimalFormat(pattern);
                maxid = df.format(maxNumber);
                maxId = maxId + maxid;
            }
            recieveHeaderDto.put("id", maxId);

            String vbeln = dto.getAsString("vbeln");

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            if ("0".equals(ifLifnr))
                transferInfo.getImportPara().getParameters().put("FLAG1", "J");
            else {
                transferInfo.getImportPara().getParameters().put("FLAG1", "A");
            }

            AigTransferTable table = transferInfo.getTable("IT_MVT");

            for (int i = 0; i < items.size(); i++) {
                Dto item = (Dto) items.get(i);
                item.put("id", maxId);
                item.put("werks", werks);
                table.setValue("MATNR", item.get("matnr"));
                table.setValue("MENGE", item.get("menge"));
                table.setValue("CHARG", item.get("charg"));
                table.setValue("WERKS", werks);
                if (item.get("reason") != null) {
                    needvalified = Integer.valueOf(1);
                }
                table.setValue("LGORT", item.get("lgort"));
                table.setValue("EBELN", item.get("ebeln"));
                if (!"0".equals(ifLifnr)) {
                    table.setValue("EBELP", item.get("ebelp"));
                    table.setValue("VBELN", vbeln);
                }
                recieveHeaderDto.put("vbeln", vbeln);
                table.appendRow();
            }
            transferInfo.appendTable(table);
            AigTransferInfo outinfo = transferservice.transferInfoAig(rfcName,
                    transferInfo);
            Map regMap = outinfo.getAigStructure("RETURN");
            String I_MBLNR = (String) outinfo.getParameters("I_MBLNR");
            String I_MJAHR = (String) outinfo.getParameters("I_MJAHR");

            recieveHeaderDto.put("meterialdocument", I_MBLNR);
            recieveHeaderDto.put("annualvouchers", I_MJAHR);

            if (G4Utils.isNotEmpty(dto.get("headReason"))) {
                needvalified = Integer.valueOf(1);
            }

            recieveHeaderDto.put("needvalified", needvalified);

//			System.out.println(regMap.get("TYPE"));
//			System.out.println(regMap.get("MESSAGE"));
            String time = G4Utils.getCurrentTime("yyyyMMdd hh:mm:ss");
            String userid = super.getSessionContainer(request).getUserInfo().getAccount();
            log.debug("记录：" + vbeln + userid + time);
            if ("S".equals(regMap.get("TYPE"))) {
                this.stockService.insertRecieveGoodInfo(recieveHeaderDto, items);
                String msg = (String) regMap.get("MESSAGE");
                retDto.put("success", msg);
            } else {
                String msg = (String) regMap.get("MESSAGE");
                retDto.put("error", msg);
            }
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward updatePriceStatus(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String rfcName = "";
            rfcName = "Z_RFC_STORE_31";
            String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));
            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            AigTransferTable table = transferInfo.getTable("IT_ZTLSJZ");
            List updateItems = new ArrayList();
            int updatecount = 0;
            for (int i = 0; i < items.size(); i++) {
                Dto item = (Dto) items.get(i);
                if ("0001".equals(item.getAsString("lgort"))) {
                    item.put("werks", werks);
                    table.setValue("MATNR", item.get("matnr"));
                    table.setValue("CHARG", item.get("charg"));
                    table.setValue("KBETR", item.get("kbetr"));
                    table.setValue("KUNRE", werks);
                    table.appendRow();
                    updatecount++;
                    updateItems.add(item);
                }
            }

            if (updatecount > 0) {
                transferInfo.appendTable(table);
                AigTransferInfo outinfo = transferservice.transferInfoAig(
                        rfcName, transferInfo);

                ArrayList regMap = outinfo.getAigTable("IT_RETURN");
                String TYPE = (String) ((HashMap) regMap.get(0)).get("TYPE");
                String msg = (String) ((HashMap) regMap.get(0)).get("MESSAGE");
//				System.out.println(((HashMap) regMap.get(0)).get("TYPE"));
//				System.out.println(((HashMap) regMap.get(0)).get("MESSAGE"));
                if ("S".equals(TYPE)) {
                    this.stockService.updatePriceStatus(updateItems);
                    retDto.put("success", msg);
                } else {
                    retDto.put("error", msg);
                }
            } else {
                retDto.put("success", "没有需要更新的信息！");
            }
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward recieveGood(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            try {
                werks = super.getSessionContainer(request).getUserInfo()
                        .getCustomId();
            } catch (Exception e) {
                log.debug(e.getMessage());
                e.printStackTrace();
                return mapping.findForward(null);
            }
            String maxOrderId = "RD" + werks
                    + G4Utils.getCurrentTime("yyyyMMdd");

            String maxorderid = (String) this.g4Dao.queryForObject(
                    "stocksystem.getmaxstoreid", maxOrderId);
            if (maxorderid == null) {
                maxOrderId = maxOrderId + "001";
            } else {
                String maxid = maxorderid.substring(maxorderid.length() - 3,
                        maxorderid.length());
                Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
                maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
                String pattern = "000";
                DecimalFormat df = new DecimalFormat(pattern);
                maxid = df.format(maxNumber);
                maxOrderId = maxOrderId + maxid;
            }

            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));
            Dto recieveHead = new BaseDto();

            recieveHead.put("id", maxOrderId);

            Integer needvalified = Integer.valueOf(0);

            String vbeln = dto.getAsString("vbeln");

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            transferInfo.getImportPara().getParameters().put("FLAG1", "A");

            AigTransferTable table = transferInfo.getTable("IT_MVT");

            for (int i = 0; i < items.size(); i++) {
                table.setValue("MATNR", ((Dto) items.get(i)).get("matnr"));
                table.setValue("MENGE", ((Dto) items.get(i)).get("menge"));
                table.setValue("CHARG", ((Dto) items.get(i)).get("charg"));
                table.setValue("WERKS", werks);
                table.setValue("LGORT", ((Dto) items.get(i)).get("lgort"));
                table.setValue("EBELN", ((Dto) items.get(i)).get("ebeln"));
                table.setValue("EBELP", ((Dto) items.get(i)).get("ebelp"));
                table.setValue("VBELN", vbeln);
                recieveHead.put("ebeln", ((Dto) items.get(i)).get("ebeln"));
                if (((Dto) items.get(i)).get("reason") != null) {
                    needvalified = Integer.valueOf(1);
                }
                table.appendRow();
            }
            transferInfo.appendTable(table);
            AigTransferInfo outinfo = transferservice.transferInfoAig(
                    "Z_RFC_STORE_12", transferInfo);
            Map regMap = outinfo.getAigStructure("RETURN");
            String I_MBLNR = (String) outinfo.getParameters("I_MBLNR");
            String I_MJAHR = (String) outinfo.getParameters("I_MJAHR");

            recieveHead.put("meterialdocument", I_MBLNR);
            recieveHead.put("annualvouchers", I_MJAHR);
            recieveHead.put("vbeln", vbeln);
            recieveHead.put("werks", werks);
            recieveHead.put("needvalified", needvalified);

//			System.out.println(regMap.get("TYPE"));
//			System.out.println(regMap.get("MESSAGE"));

            if ("S".equals(regMap.get("TYPE"))) {
                this.stockService.insertRecieveGoodInfo(recieveHead, items);
            }

            String msg = (String) regMap.get("MESSAGE");

            write(msg, response);
        } catch (Exception e) {
            log.debug(e.getMessage());
            e.printStackTrace();
            write("出现系统错误，请联系管理员！", response);
        }
        return mapping.findForward(null);
    }

    /**
     * 调入验收
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward inStockForWerks(ActionMapping mapping,
                                         ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            Dto chargheader = JsonHelper.parseSingleJson2Dto(dto.getAsString(
                    "chargheader").indexOf("\r\n") != -1 ? dto.getAsString(
                    "chargheader").replaceAll("\r\n", "<br />") : dto
                    .getAsString("chargheader").replaceAll("\n", "<br/>"));
            chargheader.put("inwerks", werks);
            List chargitems = JsonHelper.parseJson2List(dto.getAsString(
                    "chargitem").indexOf("\r\n") != -1 ? dto.getAsString(
                    "chargitem").replaceAll("\r\n", "<br/>") : dto.getAsString(
                    "chargitem").replaceAll("\n", "<br/>"));

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            transferInfo.getImportPara().getParameters().put("I_MBLNR",
                    chargheader.get("i_mblnr"));
            System.out.println(chargheader.get("i_mblnr"));
            transferInfo.getImportPara().getParameters().put("I_MJAHR",
                    chargheader.get("i_mjahr"));

            AigTransferTable table = transferInfo.getTable("IT_ITAB");

            for (int i = 0; i < chargitems.size(); i++) {
                table.setValue("MATNR", ((Dto) chargitems.get(i)).get("matnr"));
                table.setValue("MENGE", ((Dto) chargitems.get(i))
                        .get("goodscount"));
                table.setValue("BATCH", ((Dto) chargitems.get(i)).get("charg"));

                table.setValue("UMLGO", ((Dto) chargitems.get(i)).get("lgort"));
                table.appendRow();

            }
            System.out.println(chargitems.size());
            transferInfo.appendTable(table);

            AigTransferInfo outinfo = transferservice.transferInfoAig(
                    "Z_RFC_STORE_17", transferInfo);
            Map regMap = outinfo.getAigStructure("GT_STORE_17");
            String MBLNR = (String) regMap.get("MBLNR");
            String MJAHR = (String) regMap.get("MJAHR");

            chargheader.put("mblnr", MBLNR);
            chargheader.put("mjahr", MJAHR);
            chargheader
                    .put("recievetime", G4Utils.getCurrentTime("yyyy-MM-dd"));
//			System.out.println(regMap.get("TYPE"));
//			System.out.println(regMap.get("MESSAGE"));
            String msg = (String) regMap.get("MESSAGE");

            if ("S".equals(regMap.get("TYPE")))
                try {
                    this.stockService.instock(chargheader, chargitems);
                    retDto.put("success", msg + "<br/>物料凭证号：" + MBLNR);
                } catch (Exception e) {
                    e.printStackTrace();
                    retDto.put("error", e.getMessage());
                }
            else
                retDto.put("error", msg);
        } catch (Exception e) {
            e.printStackTrace();
            log.debug(e.getMessage());
            retDto.put("error", e.getMessage());
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getReceiveGiftHead(ActionMapping mapping,
                                            ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
//		System.out.println(dto.get("werks"));
//		System.out.println("hello！！");

        return mapping.findForward(null);
    }


    /**
     * 获取调拨编号
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOutid(ActionMapping mapping, ActionForm form,
                                  HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("WERKS");
        if (super.getSessionContainer(request).getUserInfo() != null)
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        else {
            return mapping.findForward("authorization");
        }
        dto.put("werks", werks);
        List outidInfo = this.g4Reader.queryForList("stocksystem.getOutid",
                dto);
        String retStr = JsonHelper.encodeObject2Json(outidInfo);
        write(retStr, response);
        return mapping.findForward(null);
    }

    /**
     * 获取调拨相关信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getAll(ActionMapping mapping, ActionForm form,
                                HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("WERKS");
        if (super.getSessionContainer(request).getUserInfo() != null)
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        else {
            return mapping.findForward("authorization");
        }
        dto.put("werks", werks);
        List outhead = this.g4Reader.queryForList("stocksystem.getOutHead",
                dto);

        List outitem = this.g4Reader.queryForList("stocksystem.getOutItem",
                dto);
        List lis = new ArrayList();
        lis.add(outhead);
        lis.add(outitem);
        String retStr = JsonHelper.encodeObject2Json(lis);
        write(retStr, response);
        return mapping.findForward(null);
    }


    public ActionForward getLgort(ActionMapping mapping, ActionForm form,
                                  HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("WERKS");
        if (super.getSessionContainer(request).getUserInfo() != null)
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        else {
            return mapping.findForward("authorization");
        }
        String[] lgorts = dto.get("lgorts") != null ? dto.getAsString("lgorts")
                .split(",") : null;
        dto.put("lgorts", lgorts);
        dto.put("werks", werks);
        List lgortInfo = this.g4Reader.queryForList("stocksystem.getLgortInfo",
                dto);

        for (int i = 0; i < lgortInfo.size(); i++) {
            Dto item = (Dto) lgortInfo.get(i);
            String lgort = (String) item.get("lgort");
            String lgobe = (String) item.get("lgobe");
            item.put("lgortDetail", lgort + "、" + lgobe);
        }

        String retStr = JsonHelper.encodeObject2Json(lgortInfo);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getTakDiffType(ActionMapping mapping, ActionForm form,
                                        HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);

        List takDiffInfo = this.g4Dao.queryForList("stocksystem.getTakDiffInfo");

        String retStr = JsonHelper.encodeObject2Json(takDiffInfo);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getWerks(ActionMapping mapping, ActionForm form,
                                  HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("werks");

        List lgortInfo = this.g4Reader.queryForList("stocksystem.getWerksInfo",
                dto);
        String retStr = JsonHelper.encodeObject2Json(lgortInfo);
        write(retStr, response);
        return mapping.findForward(null);
    }

    /**
     * 根据输入条件查询对应的门店
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getWerksByWhere(ActionMapping mapping, ActionForm form,
                                         HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        String nOwerks;
        HttpSession session = request.getSession();
        try {
            nOwerks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {
            nOwerks = "9999";
        }


        Dto dto = aForm.getParamAsDto(request);
        dto.put("nOwerks", nOwerks);

        String werksName = dto.getAsString("werks");
        if (dto.getAsString("query").equals("")) {
            return mapping.findForward(null);
        }
        List lgortInfo = this.g4Reader.queryForList("stocksystem.getWerksByWhere",
                dto);
        String retStr = JsonHelper.encodeObject2Json(lgortInfo);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitOutStock(ActionMapping mapping, ActionForm form,
                                        HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        String werks = dto.getAsString("werks");

        if (super.getSessionContainer(request).getUserInfo() != null)
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        else {
            return mapping.findForward("authorization");
        }

        try {
            Dto stockHeader = JsonHelper.parseSingleJson2Dto((String) dto.get("orderhead"));
            List stockItems = JsonHelper.parseJson2List((String) dto.get("orderitem"));
            if (stockItems.size() <= 1) {
                ((Dto) stockItems.get(0)).put("storeid", werks);//设置门店 20150106
            }
            String cfCharg = "";
            for (int i = 0; i < stockItems.size() - 1; i++) {
                Dto stockItem1 = (Dto) stockItems.get(i);
                stockItem1.put("storeid", werks);//设置出库门店
                for (int j = stockItems.size() - 1; j > i; j--) {
                    Dto stockItem2 = (Dto) stockItems.get(j);

                    if (stockItem1.get("batchnumber").equals(stockItem2.get("batchnumber"))
                            && !"".equals(stockItem1.get("batchnumber")) && stockItem1.get("batchnumber") != null) {
                        cfCharg += stockItem1.get("batchnumber") + ",";
                    }
                }
            }
            if (!cfCharg.equals("")) {
                retDto.put("error", "以下批次重复：" + cfCharg);
                String retStr = JsonHelper.encodeObject2Json(retDto);
                write(retStr, response);
                return mapping.findForward(null);
            }

            stockHeader.put("outwerks", werks);

            if (G4Utils.isEmpty(stockHeader.get("outid"))) {
                SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
                String maxoutid = "OS" + werks + format.format(new Date())
                        + '%';
                dto.put("maxoutid", maxoutid);
                maxoutid = (String) this.g4Reader.queryForObject(
                        "stocksystem.getMaxOutStockId", dto);
                if ("001".equals(maxoutid)) {
                    maxoutid = "OS" + werks + format.format(new Date())
                            + maxoutid;
                } else {
                    maxoutid = maxoutid.substring(maxoutid.length() - 3);
                    int id = Integer.parseInt(maxoutid) + 1;
                    String pattern = "000";
                    DecimalFormat df = new DecimalFormat(pattern);
                    maxoutid = df.format(id);
                    maxoutid = "OS" + werks + format.format(new Date())
                            + maxoutid;
                }

                stockHeader.put("maxoutid", maxoutid);

                System.out.println("inwerks:" + stockHeader.getAsString("inwerk"));
                if (stockHeader.getAsString("inwerk").equals("1000")) {
                    stockHeader.put("status", Integer.valueOf(11));
                    retDto.put("success", "退货单：" + maxoutid + "创建成功!");
                } else {
                    stockHeader.put("status", Integer.valueOf(0));
                    retDto.put("success", "调拨出库单：" + maxoutid + "创建成功!");
                }

                this.stockService.insertOutStockInfo(stockHeader, stockItems);


                retDto.put("outid", maxoutid);
            } else {
                this.stockService.updateOutStockInfo(stockHeader, stockItems);
                retDto.put("success", "操作："
                        + stockHeader.getAsString("outid") + "更新成功!");
            }

        } catch (Exception e) {
            e.printStackTrace();
            retDto.put("error", "出现错误：" + e.getMessage());
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward rejTo1000(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        String werks = dto.getAsString("werks");
        if (super.getSessionContainer(request).getUserInfo() != null)
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        else {
            return mapping.findForward("authorization");
        }

        try {
            Dto stockHeader = JsonHelper.parseSingleJson2Dto((String) dto.get("orderhead"));
            List stockItems = JsonHelper.parseJson2List((String) dto.get("orderitem"));

            String cfCharg = "";
            for (int i = 0; i < stockItems.size() - 1; i++) {
                Dto stockItem1 = (Dto) stockItems.get(i);
                for (int j = stockItems.size() - 1; j > i; j--) {
                    Dto stockItem2 = (Dto) stockItems.get(j);
                    if (stockItem1.get("batchnumber").equals(stockItem2.get("batchnumber"))
                            && !"".equals(stockItem1.get("batchnumber")) && stockItem1.get("batchnumber") != null) {
                        cfCharg += stockItem1.get("batchnumber") + ",";
                    }
                }
            }
            if (!cfCharg.equals("")) {
                retDto.put("error", "以下批次重复：" + cfCharg);
                String retStr = JsonHelper.encodeObject2Json(retDto);
                write(retStr, response);
                return mapping.findForward(null);
            }

            for (int i = 0; i < stockItems.size(); i++) {
                Dto item = (Dto) stockItems.get(i);
                item.put("outwerks", stockHeader.get("outwerks"));
                item.put("werks", werks);
                item.put("outstock", item.get("storagelocation"));
                item.put("lgortfrom", item.get("storagelocation"));
                item.put("inwerks", "1000");
                item.put("lgort", "0002");
                item.put("goodscount", item.get("salesquantity"));
                item.put("charg", item.get("batchnumber"));
                item.put("matnr", item.get("materialnumber"));
            }

            stockHeader.put("outwerks", werks);

            if (G4Utils.isEmpty(stockHeader.get("outid"))) {
                SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
                String maxoutid = "OS" + werks + format.format(new Date())
                        + '%';
                dto.put("maxoutid", maxoutid);
                maxoutid = (String) this.g4Reader.queryForObject(
                        "stocksystem.getMaxOutStockId", dto);
                if ("001".equals(maxoutid)) {
                    maxoutid = "OS" + werks + format.format(new Date())
                            + maxoutid;
                } else {
                    maxoutid = maxoutid.substring(maxoutid.length() - 3);
                    int id = Integer.parseInt(maxoutid) + 1;
                    String pattern = "000";
                    DecimalFormat df = new DecimalFormat(pattern);
                    maxoutid = df.format(id);
                    maxoutid = "OS" + werks + format.format(new Date())
                            + maxoutid;
                }

                stockHeader.put("maxoutid", maxoutid);
                stockHeader.put("status", Integer.valueOf(11));
                this.stockService.rejTo1000(stockHeader, stockItems);

                retDto.put("success", "退货单：" + maxoutid + "创建成功!");
            } else {
                this.stockService.updateOutStockInfoFro1000(stockHeader,
                        stockItems);
                retDto.put("success", "退货单："
                        + stockHeader.getAsString("outid") + "更新成功!");
            }

        } catch (Exception e) {
            e.printStackTrace();
            retDto.put("error", "出现错误：" + e.getMessage());
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getInStockHeader(ActionMapping mapping,
                                          ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        System.out.println("开始时间："
                + G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss SSS"));
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        dto.put("inwerks", werks);
//		System.out.println(werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage("stocksystem.getInStockHeader",
                dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getInStockHeaderCount", dto);
/**
 for (int i = 0; i < list.size(); i++) {
 List items = this.g4Reader.queryForList(
 "stocksystem.getInStockDetail", list.get(i));
 Integer totalcount = Integer.valueOf(0);
 Double totalweight = Double.valueOf(0.0D);
 Double totalPrice = Double.valueOf(0.0D);
 for (int j = 0; j < items.size(); j++) {
 Dto item = (Dto) items.get(j);
 totalPrice = Double.valueOf(totalPrice.doubleValue()
 + Double.parseDouble(G4Utils
 .isNotEmpty(item.get("bqj")) ? item
 .getAsString("bqj") : "0.0"));
 if ("G".equals(item.getAsString("meins"))) {
 totalcount = Integer.valueOf(totalcount.intValue() + 1);
 totalweight = Double
 .valueOf(totalweight.doubleValue()
 + Double.parseDouble(item
 .getAsString("goodscount")));
 } else {
 totalcount = Integer.valueOf(totalcount.intValue()
 + item.getAsInteger("goodscount").intValue());
 totalweight = Double.valueOf(totalweight.doubleValue()
 + Double.parseDouble(G4Utils.isEmpty(item
 .get("hpzl")) ? "0" : item
 .getAsString("hpzl")));
 }
 }

 ((Dto) list.get(i)).put("total", totalPrice);
 ((Dto) list.get(i)).put("totalcount", totalcount);
 ((Dto) list.get(i)).put("totalweight", totalweight);
 ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
 .get(i)).getAsInteger("status").intValue()));
 ((Dto) list.get(i)).put("reason", ((Dto) list.get(i))
 .get("headreason"));
 ((Dto) list.get(i)).put("reasonStr",
 getReasonStr((Dto) list.get(i)));
 }
 **/
        for (int i = 0; i < list.size(); i++) {
            Dto d = (Dto) list.get(i);
            d.put("statusStr", getStatusStr(d.getAsInteger("status").intValue()));
            d.put("werks", d.get("inwerks"));
            d.put("inwerksStr",
                    getWerksStr(d));
            d.put("werks", d.get("outwerks"));
            d.put("outwerksstr", getWerksStr(d));
            d.put("goodstype", getGoodsType(d.getAsInteger("goodtype").intValue()));
        }


        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");
//		System.out.println(retStr);
        write(retStr, response);
        System.out.println("开始时间："
                + G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss SSS"));

        return mapping.findForward(null);
    }

    public ActionForward getInStockHeaderForItem(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("inwerks", werks);
//		System.out.println(werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

        List outidList = new ArrayList();
        List list = this.g4Reader.queryForPage(
                "stocksystem.getInStockHeaderForItem", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getInStockHeaderForItemCount", dto);

        for (int i = 0; i < list.size(); i++) {
            if (!outidList.contains(((Dto) list.get(i)).getAsString("outid"))) {
                outidList.add(((Dto) list.get(i)).getAsString("outid"));
            }
            if ("G".equals(((Dto) list.get(i)).get("meins"))) {
                ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                        .get("chargcount"));
                ((Dto) list.get(i)).put("count", Integer.valueOf(1));
            } else {
                ((Dto) list.get(i)).put("count", ((Dto) list.get(i))
                        .get("chargcount"));
            }

            ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
                    .get(i)).getAsInteger("status").intValue()));

            ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
                    .get("outwerks"));
            ((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
                    .get(i)));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("instock"));
            dto.put("werks", ((Dto) list.get(i)).get("inwerks"));
            ((Dto) list.get(i)).put("inlgortStr", getLgortStr(dto));
            dto.put("werks", ((Dto) list.get(i)).get("outwerks"));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("outstock"));
            ((Dto) list.get(i)).put("outstockStr", getLgortStr(dto));
        }

        for (int i = 0; i < outidList.size(); i++) {
            Dto baseDto = new BaseDto();
            baseDto.put("outid", outidList.get(i));
            List items = this.g4Reader.queryForList(
                    "stocksystem.getInStockDetailForValidate", baseDto);
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            for (int j = 0; j < items.size(); j++) {
                Dto item = (Dto) items.get(j);
                if ("G".equals(item.getAsString("meins"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double
                            .valueOf(totalweight.doubleValue()
                                    + Double.parseDouble(item
                                    .getAsString("goodscount")));
                } else {
                    totalcount = Integer.valueOf(totalcount.intValue()
                            + item.getAsInteger("goodscount").intValue());
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(G4Utils.isEmpty(item
                            .get("hpzl")) ? "0" : item
                            .getAsString("hpzl")));
                }
            }

            for (int j = 0; j < list.size(); j++) {
                if (((String) outidList.get(i)).equals(((Dto) list.get(j))
                        .getAsString("outid"))) {
                    ((Dto) list.get(j)).put("totalcount", totalcount);
                    ((Dto) list.get(j)).put("totalweight", totalweight);
                }
            }
        }

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");
        this.lgortMap = null;
//		System.out.println(retStr);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getHaveInStockHeader(ActionMapping mapping,
                                              ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("inwerks", werks);
        dto.put("werks", werks);
//		System.out.println(werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage(
                "stocksystem.getHaveInStockHeader", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getHaveInStockHeaderCount", dto);

        for (int i = 0; i < list.size(); i++) {
            List items = this.g4Reader.queryForList(
                    "stocksystem.getInStockDetail", list.get(i));
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            Double totalPrice = Double.valueOf(0.0D);
            for (int j = 0; j < items.size(); j++) {
                Dto item = (Dto) items.get(j);
                totalPrice = Double.valueOf(totalPrice.doubleValue()
                        + Double.parseDouble(G4Utils.isNotEmpty(item
                        .get("tagprice")) ? item
                        .getAsString("tagprice") : "0.0"));
                if ("G".equals(item.getAsString("meins"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double
                            .valueOf(totalweight.doubleValue()
                                    + Double.parseDouble(item
                                    .getAsString("goodscount")));
                } else {
                    totalcount = Integer.valueOf(totalcount.intValue()
                            + item.getAsInteger("goodscount").intValue());
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(G4Utils.isEmpty(item
                            .get("hpzl")) ? "0" : item
                            .getAsString("hpzl")));
                }
            }

            ((Dto) list.get(i)).put("total", totalPrice);
            ((Dto) list.get(i)).put("totalcount", totalcount);
            ((Dto) list.get(i)).put("totalweight", totalweight);
            ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
                    .get(i)).getAsInteger("status").intValue()));
            ((Dto) list.get(i)).put("reason", ((Dto) list.get(i))
                    .get("headreason"));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
                    .get("outwerks"));
            ((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
                    .get(i)));
        }

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

//		System.out.println(retStr);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getInStockDetail(ActionMapping mapping,
                                          ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
//		System.out.println(werks);

        List list = this.g4Reader.queryForList("stocksystem.getInStockDetail",
                dto);

        for (int i = 0; i < list.size(); i++) {
            if ("G".equals(((Dto) list.get(i)).getAsString("meins"))) {
                ((Dto) list.get(i)).put("count", Integer.valueOf(1));
                ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                        .get("goodscount"));
            } else {
                ((Dto) list.get(i)).put("count", ((Dto) list.get(i))
                        .get("goodscount"));
            }

            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("instock"));
            ((Dto) list.get(i)).put("inlgortStr", getLgortStr(dto));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("outstock"));
            ((Dto) list.get(i)).put("outstockStr", getLgortStr(dto));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
        }

        String retStr = JsonHelper.encodeObject2Json(list);
        this.lgortMap = null;
        retStr = "{ROOT:" + retStr + "}";
        retStr = Common.getNewString(werks, retStr);
//		System.out.println(retStr);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getInStockDetailForValidate(ActionMapping mapping,
                                                     ActionForm form, HttpServletRequest request,
                                                     HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
//		System.out.println(werks);

        List list = this.g4Reader.queryForList(
                "stocksystem.getInStockDetailForValidate", dto);

        for (int i = 0; i < list.size(); i++) {
            if ("G".equals(((Dto) list.get(i)).get("meins"))) {
                ((Dto) list.get(i)).put("count", Integer.valueOf(1));
                ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                        .get("goodscount"));
            } else {
                ((Dto) list.get(i)).put("count", ((Dto) list.get(i))
                        .get("goodscount"));
            }

            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            ((Dto) list.get(i)).put("lgort", ((Dto) list.get(i))
                    .get("outstock"));
            ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
                    .get("outwerks"));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr((Dto) list.get(i)));
            ((Dto) list.get(i))
                    .put("werks", ((Dto) list.get(i)).get("inwerks"));
            ((Dto) list.get(i)).put("inwerksStr",
                    getWerksStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
                    .get("outwerks"));
            ((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
                    .get(i)));
        }

        String retStr = JsonHelper.encodeObject2Json(list);
        this.lgortMap = null;
        retStr = "{ROOT:" + retStr + "}";

//		System.out.println(retStr);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getVkorg(ActionMapping mapping, ActionForm form,
                                  HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);

        String vkorg = (String) this.g4Reader.queryForObject(
                "stocksystem.getVkorg", dto);
        retDto.put("vkorg", vkorg);

        String regStr = JsonHelper.encodeObject2Json(retDto);

        write(regStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getOutStockHeader(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        UserInfoVo info = super.getSessionContainer(request).getUserInfo();
        //.getCustomId() 如果等于1000说明是总部人员 登录的，非1000 就是终端人员登录的
        String werks = info.getCustomId();
        //if (G4Utils.isEmpty(dto.get("outwerks"))) {
        //	dto.put("outwerks", werks);
        //}
        //非总部人员登录
        if (!werks.equals("1000")) {
            //{limit=20, inwerks=01HS, start=0, status=-1, outtimee=,
            //	goodstype=, reqCode=getOutStockHeader, outtimeb=, loginuserid=10005038, outwerks=01BX}
            dto.put("outwerks", werks);//设置出库门店为登录门店
        }

        //dto.put("werks", werks);
//		System.out.println(werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

        if ("-1".equals(dto.getAsString("status"))) {
            dto.remove("status");
        }

        if ((G4Utils.isNotEmpty(dto.get("status")))
                && (dto.getAsString("status").indexOf(",") != -1)) {
            String[] status = dto.getAsString("status").split(",");

            dto.put("statusArr", status);

            dto.remove("status");
        }

        List list = this.g4Reader.queryForPage("stocksystem.getOutStockHeader",
                dto);

        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getOutStockHeaderCount", dto);

        for (int i = 0; i < list.size(); i++) {
            Dto d = (Dto) list.get(i);
            d.put("statusStr", getStatusStr(d.getAsInteger("status").intValue()));
            d.put("werks", d.get("inwerks"));
            d.put("inwerksStr",
                    getWerksStr(d));
            d.put("werks", d.get("outwerks"));
            d.put("outwerksStr", getWerksStr(d));
            d.put("goodstype", getGoodsType(d.getAsInteger("goodtype").intValue()));
        }

        /**
         for (int i = 0; i < list.size(); i++) {
         List items = this.g4Reader.queryForList(
         "stocksystem.getInStockDetail", list.get(i));
         Integer totalcount = Integer.valueOf(0);
         Double totalweight = Double.valueOf(0.0D);
         Double totalprice = Double.valueOf(0.0D);
         for (int j = 0; j < items.size(); j++) {
         Dto item = (Dto) items.get(j);
         totalprice = Double.valueOf(totalprice.doubleValue()
         + Double.parseDouble(G4Utils.isNotEmpty(item
         .get("tagprice")) ? item
         .getAsString("tagprice") : "0.0"));
         if ("G".equals(item.getAsString("meins"))) {
         totalcount = Integer.valueOf(totalcount.intValue() + 1);
         totalweight = Double
         .valueOf(totalweight.doubleValue()
         + Double.parseDouble(item
         .getAsString("goodscount")));
         } else {
         totalcount = Integer.valueOf(totalcount.intValue()
         + item.getAsInteger("goodscount").intValue());
         totalweight = Double.valueOf(totalweight.doubleValue()
         + Double.parseDouble(G4Utils.isEmpty(item
         .get("hpzl")) ? "0" : item
         .getAsString("hpzl")));
         }
         }

         if (G4Utils.isEmpty(((Dto) list.get(i)).get("total"))) {
         ((Dto) list.get(i)).put("total", totalprice);
         }

         ((Dto) list.get(i)).put("totalcount", totalcount);
         ((Dto) list.get(i)).put("totalweight", totalweight);
         ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
         .get(i)).getAsInteger("status").intValue()));
         ((Dto) list.get(i)).put("reason", ((Dto) list.get(i))
         .get("headreason"));
         ((Dto) list.get(i)).put("reasonStr",
         getReasonStr((Dto) list.get(i)));
         ((Dto) list.get(i))
         .put("werks", ((Dto) list.get(i)).get("inwerks"));
         ((Dto) list.get(i)).put("inwerksStr",
         getWerksStr((Dto) list.get(i)));
         ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
         .get("outwerks"));
         ((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
         .get(i)));
         ((Dto) list.get(i)).put("goodstype", getGoodsType(((Dto) list
         .get(i)).getAsInteger("goodtype").intValue()));

         int cpzs = ((Integer) this.g4Reader.queryForObject(
         "stocksystem.getCPZSCount", ((Dto) list.get(i))
         .getAsString("charg"))).intValue();
         int lszs = ((Integer) this.g4Reader.queryForObject(
         "stocksystem.getLSZSCount", ((Dto) list.get(i))
         .getAsString("charg"))).intValue();
         ((Dto) list.get(i)).put("cpzs", Integer.valueOf(cpzs));
         ((Dto) list.get(i)).put("lszs", Integer.valueOf(lszs));

         }*/

        request.getSession().setAttribute("OutStockHeader", list);
        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

//		System.out.println(retStr);

        write(retStr, response);

        return mapping.findForward(null);
    }

    /**
     * 导出明细
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward exportStockDetail(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
//		System.out.println(werks);

        List list = this.g4Reader.queryForList("stocksystem.getInStockDetail",
                dto);

        for (int i = 0; i < list.size(); i++) {
            if ("G".equals(((Dto) list.get(i)).getAsString("meins"))) {
                ((Dto) list.get(i)).put("count", Integer.valueOf(1));
                ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                        .get("goodscount"));
            } else {
                ((Dto) list.get(i)).put("count", ((Dto) list.get(i))
                        .get("goodscount"));
            }

            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("instock"));
            ((Dto) list.get(i)).put("inlgortStr", getLgortStr(dto));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("outstock"));
            ((Dto) list.get(i)).put("outstockStr", getLgortStr(dto));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
        }


        Dto parametersDto = new BaseDto();
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter
                .setTemplatePath("/report/excel/mytemplate/outStockdedail.xls");
        parametersDto.put("reportTitle", "明细表");
        excelExporter.setFilename("明细表.xls");
        excelExporter.setData(parametersDto, list);


        excelExporter.export(request, response);

        return mapping.findForward(null);
    }


    public ActionForward exportOutStockHeader(ActionMapping mapping,
                                              ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        Thread.sleep(2000L);
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);

        Dto parametersDto = new BaseDto();
        List fieldsList = (List) request.getSession().getAttribute(
                "OutStockHeader");
        List dlist = new ArrayList();
        List tlist = new ArrayList();

        Integer count1 = Integer.valueOf(0);
        Integer count2 = Integer.valueOf(0);

        Double mytotalprice1 = Double.valueOf(0.0D);
        Double mytotalprice2 = Double.valueOf(0.0D);

        Double myweight1 = Double.valueOf(0.0D);
        Double myweight2 = Double.valueOf(0.0D);

        Integer goodzscount1 = Integer.valueOf(0);
        Integer goodzscount2 = Integer.valueOf(0);

        Integer tonezscount1 = Integer.valueOf(0);
        Integer tonezscount2 = Integer.valueOf(0);

        for (int i = 0; i < fieldsList.size(); i++) {
            Dto rdto = (Dto) fieldsList.get(i);
            if (rdto.getAsInteger("status").intValue() > 11) {
                tlist.add(rdto);
                count1 = Integer.valueOf(count1.intValue()
                        + rdto.getAsInteger("totalcount").intValue());
                mytotalprice1 = Double.valueOf(mytotalprice1.doubleValue()
                        + Double.parseDouble(G4Utils.isNotEmpty(rdto
                        .get("total")) ? rdto.getAsString("total")
                        : "0.00"));
                myweight1 = Double.valueOf(myweight1.doubleValue()
                        + Double.parseDouble(G4Utils.isNotEmpty(rdto
                        .get("totalweight")) ? rdto
                        .getAsString("totalweight") : "0.00"));
                goodzscount1 = Integer.valueOf(goodzscount1.intValue()
                        + rdto.getAsInteger("cpzs").intValue());
                tonezscount1 = Integer.valueOf(tonezscount1.intValue()
                        + rdto.getAsInteger("lszs").intValue());
            } else if ((rdto.getAsInteger("status").intValue() <= 11)
                    && (rdto.getAsInteger("status").intValue() > 1)) {
                dlist.add(rdto);
                count2 = Integer.valueOf(count2.intValue()
                        + rdto.getAsInteger("totalcount").intValue());
                mytotalprice2 = Double.valueOf(mytotalprice2.doubleValue()
                        + Double.parseDouble(G4Utils.isNotEmpty(rdto
                        .get("total")) ? rdto.getAsString("total")
                        : "0.00"));
                myweight2 = Double.valueOf(myweight2.doubleValue()
                        + Double.parseDouble(G4Utils.isNotEmpty(rdto
                        .get("totalweight")) ? rdto
                        .getAsString("totalweight") : "0.00"));
                goodzscount2 = Integer.valueOf(goodzscount2.intValue()
                        + rdto.getAsInteger("cpzs").intValue());
                tonezscount2 = Integer.valueOf(tonezscount2.intValue()
                        + rdto.getAsInteger("lszs").intValue());
            }
        }

        ExcelExporter excelExporter = new ExcelExporter();

        String werks = ((Dto) fieldsList.get(0)).getAsString("outwerksStr");
        parametersDto.put("outwerks", werks);
        if ("1".equals(dto.get("exp"))) {
            parametersDto.put("mytotalcount", count2);
            parametersDto.put("mytotal", mytotalprice2);
            parametersDto.put("mytotalweight", myweight2);
            parametersDto.put("mycpzs", goodzscount2);
            parametersDto.put("mylszs", tonezscount2);

            excelExporter
                    .setTemplatePath("/report/excel/mytemplate/OutStockHeaderList.xls");
            parametersDto.put("reportTitle", "调出表");
            excelExporter.setData(parametersDto, dlist);
            excelExporter.setFilename("调出表.xls");
        } else if ("2".equals(dto.get("exp"))) {
            parametersDto.put("mytotalcount", count1);
            parametersDto.put("mytotal", mytotalprice1);
            parametersDto.put("mytotalweight", myweight1);
            parametersDto.put("mycpzs", goodzscount1);
            parametersDto.put("mylszs", tonezscount1);

            excelExporter
                    .setTemplatePath("/report/excel/mytemplate/RejTo1000HeaderList.xls");
            parametersDto.put("reportTitle", "退货表");
            excelExporter.setData(parametersDto, tlist);
            excelExporter.setFilename("退货表.xls");
        }
        excelExporter.export(request, response);

        return mapping.findForward(null);
    }

    private String getGoodsType(int goodtype) {
        String retStr = "";
        switch (goodtype) {
            case 1:
                retStr = "镶嵌";
                break;
            case 2:
                retStr = "银饰";
                break;
            case 3:
                retStr = "玉石";
                break;
            case 4:
                retStr = "18K金";
                break;
            case 5:
                retStr = "铂金";
                break;
            case 6:
                retStr = "黄金";
                break;
            case 7:
                retStr = "钯金";
                break;
            case 8:
                retStr = "赠品及包材";
                break;
            case 9:
                retStr = "其他";
        }

        return retStr;
    }

    public ActionForward getOutStockHeaderForItemManage(ActionMapping mapping,
                                                        ActionForm form, HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("outwerks", werks);
        dto.put("werks", werks);
//		System.out.println(werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

        if ("-1".equals(dto.getAsString("status"))) {
            dto.remove("status");
        }

        List outidList = new ArrayList();

        List list = this.g4Reader.queryForPage(
                "stocksystem.getOutStockHeaderForItemManage", dto);

        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getOutStockHeaderForItemManageCount", dto);

        for (int i = 0; i < list.size(); i++) {
            if (!outidList.contains(((Dto) list.get(i)).getAsString("outid"))) {
                outidList.add(((Dto) list.get(i)).getAsString("outid"));
            }

            if ("G".equals(((Dto) list.get(i)).getAsString("meins"))) {
                ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                        .get("charggoodscount"));
                ((Dto) list.get(i)).put("count", Integer.valueOf(1));
            } else {
                ((Dto) list.get(i)).put("count", ((Dto) list.get(i))
                        .get("charggoodscount"));
            }

            ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
                    .get(i)).getAsInteger("status").intValue()));

            ((Dto) list.get(i))
                    .put("werks", ((Dto) list.get(i)).get("inwerks"));
            ((Dto) list.get(i)).put("inwerksStr",
                    getWerksStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
                    .get("outwerks"));
            ((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
                    .get(i)));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("instock"));
            ((Dto) list.get(i)).put("inlgortStr", getLgortStr(dto));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("outstock"));
            ((Dto) list.get(i)).put("outstockStr", getLgortStr(dto));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
        }

        for (int i = 0; i < outidList.size(); i++) {
            Dto baseDto = new BaseDto();
            baseDto.put("outid", outidList.get(i));
            List items = this.g4Reader.queryForList(
                    "stocksystem.getInStockDetailForValidate", baseDto);
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            for (int j = 0; j < items.size(); j++) {
                Dto item = (Dto) items.get(j);
                if ("G".equals(item.getAsString("meins"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double
                            .valueOf(totalweight.doubleValue()
                                    + Double.parseDouble(item
                                    .getAsString("goodscount")));
                } else {
                    totalcount = Integer.valueOf(totalcount.intValue()
                            + item.getAsInteger("goodscount").intValue());
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(G4Utils.isEmpty(item
                            .get("hpzl")) ? "0" : item
                            .getAsString("hpzl")));
                }
            }

            for (int j = 0; j < list.size(); j++) {
                if (((String) outidList.get(i)).equals(((Dto) list.get(j))
                        .getAsString("outid"))) {
                    ((Dto) list.get(j)).put("totalcount", totalcount);
                    ((Dto) list.get(j)).put("totalweight", totalweight);
                }
            }
        }
        request.getSession().setAttribute("OutStockHeaderForItemManage", list);
        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");
        this.lgortMap = null;
//		System.out.println(retStr);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getOutStockHeaderForValidate(ActionMapping mapping,
                                                      ActionForm form, HttpServletRequest request,
                                                      HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("outwerks", werks);
//		System.out.println(werks);
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage(
                "stocksystem.getOutStockHeaderForValidate", dto);//"stocksystem.getOutStockHeaderForValidate"
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getOutStockHeaderForValidateCount", dto);
        for (int i = 0; i < list.size(); i++) {
            Dto d = (Dto) list.get(i);
            d.put("statusStr", getStatusStr(d.getAsInteger("status").intValue()));
            d.put("werks", d.get("inwerks"));
            d.put("inwerksStr", getWerksStr(d));
            d.put("werks", d.get("outwerks"));
            d.put("outwerksStr", getWerksStr(d));
            d.put("goodtypeStr", getGoodsType(d.getAsInteger("goodtype").intValue()));
            d.put("reason", d.get("headreason"));
        }




		/*
        for (int i = 0; i < list.size(); i++) {
			Integer totalcount = Integer.valueOf(0);
			Double totalweight = Double.valueOf(0.0D);
			Double totalPrice = Double.valueOf(0.0D);
			boolean flag = false;
			if (G4Utils.isEmpty(((Dto) list.get(i)).get("total"))) {
				flag = true;
			}
			List items = this.g4Reader.queryForList(
				"stocksystem.getInStockDetailForValidate", list.get(i));
			for (int j = 0; j < items.size(); j++) {

				Dto item = (Dto) items.get(j);
				totalPrice = Double.valueOf(totalPrice.doubleValue()
						+ Double.parseDouble(G4Utils
								.isNotEmpty(item.get("bqj")) ? item
								.getAsString("bqj") : "0.0"));
				if ("G".equals(item.getAsString("meins"))) {
					totalcount = Integer.valueOf(totalcount.intValue() + 1);
					totalweight = Double
							.valueOf(totalweight.doubleValue()
									+ Double.parseDouble(item
											.getAsString("goodscount")));
				} else {
					totalcount = Integer.valueOf(totalcount.intValue()
							+ item.getAsInteger("goodscount").intValue());
					totalweight = Double.valueOf(totalweight.doubleValue()
							+ Double.parseDouble(G4Utils.isEmpty(item
									.get("hpzl")) ? "0" : item
									.getAsString("hpzl")));
				}
			}

			try {
				if (flag) {
					((Dto) list.get(i)).put("total", totalPrice);
				}

				((Dto) list.get(i)).put("totalcount", totalcount);
				((Dto) list.get(i)).put("totalweight", totalweight);
				((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
						.get(i)).getAsInteger("status").intValue()));
				((Dto) list.get(i)).put("goodtypeStr",
						getGoodTypeStr(((Dto) list.get(i)).getAsInteger(
								"goodtype").intValue()));
				((Dto) list.get(i)).put("reason", ((Dto) list.get(i))
						.get("headreason"));
				((Dto) list.get(i)).put("reasonStr", getReasonStr((Dto) list
						.get(i)));
				((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
						.get("inwerks"));
				((Dto) list.get(i)).put("inwerksStr", getWerksStr((Dto) list
						.get(i)));
				((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
						.get("outwerks"));
				((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
						.get(i)));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}*/

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

//		System.out.println(retStr);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getOutStockHeaderForNeedPrintLabel(
            ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("outwerks", werks);
//		System.out.println(werks);
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage(
                "stocksystem.getOutStockHeaderForNeedPrintLabel", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getOutStockHeaderForNeedPrintLabelCount", dto);
        for (int i = 0; i < list.size(); i++) {
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            Double totalPrice = Double.valueOf(0.0D);
            boolean flag = false;
            if (G4Utils.isEmpty(((Dto) list.get(i)).get("total"))) {
                flag = true;
            }

            List items = this.g4Reader.queryForList(
                    "stocksystem.getInStockDetailForValidate", list.get(i));
            for (int j = 0; j < items.size(); j++) {
                Dto item = (Dto) items.get(j);
                totalPrice = Double.valueOf(Double.parseDouble(G4Utils
                        .isNotEmpty(item.get("bqj")) ? item.getAsString("bqj")
                        : "0.0"));
                if ("G".equals(item.getAsString("meins"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double
                            .valueOf(totalweight.doubleValue()
                                    + Double.parseDouble(item
                                    .getAsString("goodscount")));
                } else {
                    totalcount = Integer.valueOf(totalcount.intValue()
                            + item.getAsInteger("goodscount").intValue());
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(G4Utils.isEmpty(item
                            .get("hpzl")) ? "0" : item
                            .getAsString("hpzl")));
                }
            }

            if (flag) {
                ((Dto) list.get(i)).put("total", totalPrice);
            }

            ((Dto) list.get(i)).put("totalcount", totalcount);
            ((Dto) list.get(i)).put("totalweight", totalweight);
            ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
                    .get(i)).getAsInteger("status").intValue()));
            ((Dto) list.get(i)).put("reason", ((Dto) list.get(i))
                    .get("headreason"));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
            ((Dto) list.get(i))
                    .put("werks", ((Dto) list.get(i)).get("inwerks"));
            ((Dto) list.get(i)).put("inwerksStr",
                    getWerksStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
                    .get("outwerks"));
            ((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
                    .get(i)));
        }

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

//		System.out.println(retStr);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getNoPriceMoveLgortHeader(ActionMapping mapping,
                                                   ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("outwerks", werks);
//		System.out.println(werks);
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage(
                "stocksystem.getNoPriceMoveLgortHeader", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getNoPriceMoveLgortHeaderCount", dto);
        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
                    .get(i)).getAsInteger("status").intValue()));
            ((Dto) list.get(i))
                    .put("werks", ((Dto) list.get(i)).get("lgortto"));
            ((Dto) list.get(i)).put("inwerksStr",
                    getWerksStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
                    .get("lgortfrom"));
            ((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
                    .get(i)));
        }

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

//		System.out.println(retStr);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getNoPriceMoveLgortHeaderForToWerks(
            ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("outwerks", werks);
//		System.out.println(werks);
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage(
                "stocksystem.getNoPriceMoveLgortHeaderForWerks", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getNoPriceMoveLgortHeaderForWerksCount", dto);
        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
                    .get(i)).getAsInteger("status").intValue()));
            ((Dto) list.get(i))
                    .put("werks", ((Dto) list.get(i)).get("lgortto"));
            ((Dto) list.get(i)).put("inwerksStr",
                    getWerksStr((Dto) list.get(i)));
            ((Dto) list.get(i)).put("werks", ((Dto) list.get(i))
                    .get("lgortfrom"));
            ((Dto) list.get(i)).put("outwerksStr", getWerksStr((Dto) list
                    .get(i)));
        }

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

//		System.out.println(retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getNoPriceMoveLgortHeaderInfo(ActionMapping mapping,
                                                       ActionForm form, HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("outwerks", werks);
//		System.out.println(werks);
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List paraDto = this.g4Reader.queryForList(
                "stocksystem.getNoPriceMoveLgortHeader", dto);

        String retStr = JsonHelper.encodeObject2Json(paraDto, "yyyy-MM-dd");

//		System.out.println(retStr);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getNoPriceMoveLgortHeaderItem(ActionMapping mapping,
                                                       ActionForm form, HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
//		System.out.println(werks);

        List list = this.g4Reader.queryForList(
                "stocksystem.getNoPriceMoveLgortHeaderItem", dto);

        String retStr = JsonHelper.encodeObject2Json(list);

//		System.out.println(retStr);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getOutStockDetail(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);

        List list = this.g4Reader.queryForList("stocksystem.getOutStockDetail", dto);

        String retStr = JsonHelper.encodeObject2Json(list);
        retStr = "{ROOT:" + retStr + "}";
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getpcxxForRejGood(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {
            e.printStackTrace();
            return mapping.findForward(null);
        }
        dto.put("werks", werks);
        String chargtype = dto.get("chargtype").toString();
        dto.put("charg", dto.get("charg"));
        List list = null;
        String userinput = (String) dto.get("userinput");
        String charg = (String) dto.get("charg");
        charg = charg == null ? "" : charg.trim();
        String option = dto.getAsString("option");
        if (option.equals("user")) {
            if (chargtype.equals("charg")) {
                list = this.g4Dao.queryForList(
                        "stocksystem.getpcxxbyuserForRejGood", dto);
                for (int i = 0; i < list.size(); i++) {
                    Dto tempdto = (Dto) list.get(i);

                    String orderid = (String) this.g4Dao.queryForObject(
                            "stocksystem.getchargisusedorderid", tempdto);
                    orderid = orderid == null ? "" : orderid;
                    tempdto.put("usedorderid", orderid);
                    String ordertype = dto.getAsString("ordertype");
                    if ((ordertype.equals("ZRE1"))
                            || (ordertype.equals("ZOR4"))) {
                        tempdto.put("ordertype", "ZOR1");
                        Double price = (Double) this.g4Dao.queryForObject(
                                "stocksystem.getchargbaklastprice", tempdto);
                        if (price != null)
                            tempdto.put("sxj", price);
                    }
                }
            } else if (chargtype.equals("gift")) {
                list = this.g4Dao
                        .queryForList("stocksystem.getgiftbyuser", dto);
                for (int i = 0; i < list.size(); i++) {
                    Dto tempdto = (Dto) list.get(i);
                    tempdto.put("matnr", tempdto.get("cpbm"));
                    String ordertype = dto.getAsString("ordertype");
                    if (ordertype.equals("ZRE2")) {
                        tempdto.put("ordertype", "ZOR8");
                        Double price = (Double) this.g4Dao.queryForObject(
                                "stocksystem.getchargbaklastprice", tempdto);
                        if (price != null) {
                            tempdto.put("sxj", price);
                        }
                    }
                }
            }
        } else if ((userinput != null) && (userinput.equals("1"))) {
            if (chargtype.equals("charg"))
                list = this.g4Dao
                        .queryForList("stocksystem.getpcxxbyuser", dto);
            else if (chargtype.equals("gift")) {
                list = this.g4Dao
                        .queryForList("stocksystem.getgiftbyuser", dto);
            }
        } else if (chargtype.equals("charg"))
            list = this.g4Dao
                    .queryForList("stocksystem.getpcxxForRejGood", dto);
        else if (chargtype.equals("gift")) {
            list = this.g4Dao.queryForList("stocksystem.getgift", dto);
        }

        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }


    public ActionForward getpcxxForKc(ActionMapping mapping,
                                      ActionForm form, HttpServletRequest request,
                                      HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {
            e.printStackTrace();
            return mapping.findForward(null);
        }
        dto.put("werks", werks);
        String chargtype = dto.get("chargtype").toString();
        dto.put("charg", dto.get("charg"));
        List list = null;
        String userinput = (String) dto.get("userinput");
        String charg = (String) dto.get("charg");
        charg = charg == null ? "" : charg.trim();
        String option = dto.getAsString("option");
        if (option.equals("user")) {
            if (chargtype.equals("charg")) {
                list = this.g4Dao.queryForList(
                        "stocksystem.getpcxxbyuserForRejGood", dto);
            }
        }

        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }


    public ActionForward getpcxx(ActionMapping mapping, ActionForm form,
                                 HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {
            e.printStackTrace();
            return mapping.findForward(null);
        }
        dto.put("werks", werks);
        String chargtype = dto.get("chargtype").toString();
        dto.put("charg", dto.get("charg"));
        List list = null;
        String userinput = (String) dto.get("userinput");
        String charg = (String) dto.get("charg");
        charg = charg == null ? "" : charg.trim();
        String option = dto.getAsString("option");
        if (option.equals("user")) {
            if (chargtype.equals("charg")) {
                list = this.g4Dao
                        .queryForList("stocksystem.getpcxxbyuser", dto);
                for (int i = 0; i < list.size(); i++) {
                    Dto tempdto = (Dto) list.get(i);

                    String orderid = (String) this.g4Dao.queryForObject(
                            "stocksystem.getchargisusedorderid", tempdto);
                    orderid = orderid == null ? "" : orderid;
                    tempdto.put("usedorderid", orderid);
                    String ordertype = dto.getAsString("ordertype");
                    if ((ordertype.equals("ZRE1"))
                            || (ordertype.equals("ZOR4"))) {
                        tempdto.put("ordertype", "ZOR1");
                        Double price = (Double) this.g4Dao.queryForObject(
                                "stocksystem.getchargbaklastprice", tempdto);
                        if (price != null)
                            tempdto.put("sxj", price);
                    }
                }
            } else if (chargtype.equals("gift")) {
                list = this.g4Dao
                        .queryForList("stocksystem.getgiftbyuser", dto);
                for (int i = 0; i < list.size(); i++) {
                    Dto tempdto = (Dto) list.get(i);
                    tempdto.put("matnr", tempdto.get("cpbm"));
                    String ordertype = dto.getAsString("ordertype");
                    if (ordertype.equals("ZRE2")) {
                        tempdto.put("ordertype", "ZOR8");
                        Double price = (Double) this.g4Dao.queryForObject(
                                "stocksystem.getchargbaklastprice", tempdto);
                        if (price != null) {
                            tempdto.put("sxj", price);
                        }
                    }
                }
            }
        } else if ((userinput != null) && (userinput.equals("1"))) {
            if (chargtype.equals("charg"))
                list = this.g4Dao
                        .queryForList("stocksystem.getpcxxbyuser", dto);
            else if (chargtype.equals("gift")) {
                list = this.g4Dao
                        .queryForList("stocksystem.getgiftbyuser", dto);
            }
        } else if (chargtype.equals("charg"))
            list = this.g4Dao.queryForList("stocksystem.getpcxx", dto);
        else if (chargtype.equals("gift")) {
            list = this.g4Dao.queryForList("stocksystem.getgift", dto);
        }

        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getpcxxForJoinRej(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {
            e.printStackTrace();
            return mapping.findForward(null);
        }
        dto.put("werks", werks);
        dto.put("charg", dto.get("charg"));
        List list = this.g4Dao.queryForList("stocksystem.getpcxxForJoinRej",
                dto);

        ((Dto) list.get(0)).put("lgort", ((Dto) list.get(0)).get("mylgort"));
        ((Dto) list.get(0)).put("labst", ((Dto) list.get(0)).get("mylabst"));
        ((Dto) list.get(0)).put("count", ((Dto) list.get(0)).get("mylabst"));
        ((Dto) list.get(0)).put("werks", werks);
        ((Dto) list.get(0)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                .get(0)).getAsString("zjlbm")));
        ((Dto) list.get(0)).put("toneTypeStr", getToneTypeStr(((Dto) list
                .get(0)).getAsString("zslbm")));
        ((Dto) list.get(0)).put("toneNeatNessStr",
                getToneNeatNessStr(((Dto) list.get(0)).getAsString("labor")));
        ((Dto) list.get(0)).put("toneColorStr", getToneColorStr(((Dto) list
                .get(0)).getAsString("zslys")));
        ((Dto) list.get(0)).put("lgortStr", getLgortStr((Dto) list.get(0)));

        this.lgortMap = null;

        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getmatnrinfo(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        String chargtype = dto.get("chargtype") != null ? dto
                .getAsString("chargtype") : "";
        dto.put("charg", dto.get("charg"));
        List list = null;
        String userinput = (String) dto.get("userinput");
        String charg = (String) dto.get("charg");
        charg = charg == null ? "" : charg.trim();
        String option = dto.getAsString("option");
        if (option.equals("user")) {
            list = this.g4Dao.queryForList("stocksystem.getmatnrinfobyuser",
                    dto);
            List lgortlist = this.g4Dao.queryForList(
                    "stocksystem.getmatnrinfolgort", dto);
            String lgortListStr = "";
            for (int i = 0; i < lgortlist.size(); i++) {
                lgortListStr = lgortListStr
                        + ((Dto) lgortlist.get(i)).getAsString("info") + "="
                        + ((Dto) lgortlist.get(i)).getAsString("labst") + ",";
            }
            lgortListStr = lgortListStr.length() > 0 ? lgortListStr.substring(
                    0, lgortListStr.length() - 1) : lgortListStr;
            if (G4Utils.isNotEmpty(list))
                ((Dto) list.get(0)).put("lgortlist", lgortListStr);
        } else {
            list = this.g4Dao.queryForList("stocksystem.getmatnrinfo", dto);
        }
        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getMatnrInfoForNoPriceMoveLgrot(ActionMapping mapping,
                                                         ActionForm form, HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        dto.put("matnr", dto.get("charg"));
        List list = null;
        String userinput = (String) dto.get("userinput");
        String charg = (String) dto.get("charg");
        charg = charg == null ? "" : charg.trim();
        String option = dto.getAsString("option");
        if (option.equals("user"))
            list = this.g4Dao.queryForList(
                    "stocksystem.getMatnrInfoForNoPriceMoveLgrotbyuser", dto);
        else {
            list = this.g4Dao.queryForList(
                    "stocksystem.getMatnrInfoForNoPriceMoveLgrot", dto);
        }
        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getchargforstocktaking(ActionMapping mapping,
                                                ActionForm form, HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        dto.put("charg", dto.get("charg"));
        List list = null;
        String charg = (String) dto.get("charg");
        String id = (String) dto.get("id");
        String matnr = (String) dto.get("matnr");

        Integer count = dto.getAsInteger("count");
        charg = charg == null ? "" : charg.trim();
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        if (G4Utils.isEmpty(charg)) {
            list = this.g4Dao.queryForList("stocksystem.getmatnrforstocktaking", dto);
            dto.put("isNeedCheck", "1");
            ((Dto) list.get(0)).put("lgorts", this.g4Dao.queryForList("stocksystem.getMatnrLgortInfo", dto));
        } else {
            list = this.g4Dao.queryForList("stocksystem.getchargforstocktaking", dto);
        }
        for (int i = 0; i < list.size(); i++) {
            if ("G".equals(((Dto) list.get(i)).getAsString("meins"))) {
                if (Double.parseDouble(G4Utils.isNotEmpty(((Dto) list.get(i)).getAsString("mylabst")) ?
                        ((Dto) list.get(i)).getAsString("mylabst") : "0") > 0.0D)
                    ((Dto) list.get(i)).put("count", Integer.valueOf(1));
                else
                    ((Dto) list.get(i)).put("count", Integer.valueOf(0));
            } else {
                ((Dto) list.get(i)).put("count", G4Utils.isNotEmpty(((Dto) list.get(i)).getAsString("mylabst")) ?
                        ((Dto) list.get(i)).getAsString("mylabst") : "0");
            }
            ((Dto) list.get(i)).put("lgort", G4Utils.isNotEmpty(((Dto) list.get(i)).get("mylgort")) ?
                    ((Dto) list.get(i)).get("mylgort") : ((Dto) list.get(i)).get("lgort"));
            ((Dto) list.get(i)).put("labst", G4Utils.isNotEmpty(((Dto) list.get(i)).get("mylabst")) ?
                    ((Dto) list.get(i)).get("mylabst") : ((Dto) list.get(i)).get("labst"));
            ((Dto) list.get(i)).put("werks", werks);
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list.get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list.get(i)).getAsString("zslbm")));
            ((Dto) list.get(i)).put("toneNeatNessStr", getToneNeatNessStr(((Dto) list.get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list.get(i)).getAsString("zslys")));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr((Dto) list.get(i)));
        }

        this.lgortMap = null;
        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getchargforstocktakingforwjz(ActionMapping mapping,
                                                      ActionForm form, HttpServletRequest request,
                                                      HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", "WJZC");
        dto.put("charg", dto.get("charg"));
        dto.put("lgort", werks);
        List list = null;
        String id = (String) dto.get("id");
        String matnr = (String) dto.get("matnr");

        Integer count = dto.getAsInteger("count");
        list = this.g4Dao.queryForList(
                "stocksystem.getmatnrforstocktakingForWJZ", dto);

        dto.put("isNeedCheck", "1");
        ((Dto) list.get(0)).put("lgorts", this.g4Dao.queryForList(
                "stocksystem.getMatnrLgortInfo", dto));

        for (int i = 0; i < list.size(); i++) {
            if ("G".equals(((Dto) list.get(i)).getAsString("meins"))) {
                if (Double.parseDouble(G4Utils.isNotEmpty(((Dto) list.get(i))
                        .getAsString("mylabst")) ? ((Dto) list.get(i))
                        .getAsString("mylabst") : "0") > 0.0D)
                    ((Dto) list.get(i)).put("count", Integer.valueOf(1));
                else
                    ((Dto) list.get(i)).put("count", Integer.valueOf(0));
            } else {
                ((Dto) list.get(i)).put("count", G4Utils.isNotEmpty(((Dto) list
                        .get(i)).getAsString("mylabst")) ? ((Dto) list.get(i))
                        .getAsString("mylabst") : "0");
            }

            ((Dto) list.get(i))
                    .put("lgort", ((Dto) list.get(i)).get("mylgort"));
            ((Dto) list.get(i))
                    .put("labst", ((Dto) list.get(i)).get("mylabst"));
        }

        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getReceiveStoreHead(ActionMapping mapping,
                                             ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

        List list = null;
        Integer count = null;
        if ("1000".equals(werks)) {
            list = this.g4Reader.queryForPage(
                    "stocksystem.getReceiveStoreinfoForHead", dto);
            count = (Integer) this.g4Reader.queryForObject(
                    "stocksystem.getReceiveStoreinfoForHeadcount", dto);
        } else {
            list = this.g4Reader.queryForPage(
                    "stocksystem.getReceiveStoreinfo", dto);
            count = (Integer) this.g4Reader.queryForObject(
                    "stocksystem.getReceiveStoreinfocount", dto);
        }
        for (int i = 0; i < list.size(); i++) {
            Dto item = (Dto) list.get(i);
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            Double totalPrice = Double.valueOf(0.0D);
            List details = this.g4Reader.queryForList(
                    "stocksystem.getRecievedGoodDetail", item);
            for (int j = 0; j < details.size(); j++) {
                Dto detail = (Dto) details.get(j);
                totalPrice = Double.valueOf(totalPrice.doubleValue()
                        + Double.parseDouble(G4Utils.isNotEmpty(detail
                        .get("kbetr")) ? detail.getAsString("kbetr")
                        : "0.0"));
                if ("G".equals(detail.getAsString("meins"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(detail.getAsString("menge")));
                } else {
                    totalcount = Integer.valueOf(totalcount.intValue()
                            + Integer.parseInt(detail.getAsString("menge")
                            .indexOf(".") != -1 ? detail.getAsString(
                            "menge").substring(0,
                            detail.getAsString("menge").indexOf("."))
                            : detail.getAsString("menge")));
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(G4Utils.isEmpty(detail
                            .get("hpzl")) ? "0" : detail
                            .getAsString("hpzl")));
                }

            }

            ((Dto) list.get(i)).put("total", totalPrice);
            ((Dto) list.get(i)).put("totalcount", totalcount);
            ((Dto) list.get(i)).put("totalweight", totalweight);
            ((Dto) list.get(i)).put("reason", ((Dto) list.get(i))
                    .get("headreason"));
            ((Dto) list.get(i)).put("headReason", getReasonStr((Dto) list
                    .get(i)));
            ((Dto) list.get(i)).put("werksStr", getWerksStr((Dto) list.get(i)));
        }

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getReceiveStoreHeadForHeadValidate(
            ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage(
                "stocksystem.getReceiveStoreHeadForHeadValidate", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getReceiveStoreHeadForHeadValidatecount", dto);

        for (int i = 0; i < list.size(); i++) {
            Dto item = (Dto) list.get(i);
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            Double totalPrice = Double.valueOf(0.0D);
            List details = this.g4Reader.queryForList(
                    "stocksystem.getRecievedGoodDetail", item);
            for (int j = 0; j < details.size(); j++) {
                Dto detail = (Dto) details.get(j);

                totalPrice = Double.valueOf(totalPrice.doubleValue()
                        + Double.parseDouble(G4Utils.isNotEmpty(detail
                        .get("kbetr")) ? detail.getAsString("kbetr")
                        : "0.0"));

                if ("G".equals(detail.getAsString("meins")) && !"".equals(detail.getAsString("menge"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(detail.getAsString("menge")));
                } else {
                    try {
                        totalcount = Integer
                                .valueOf(totalcount.intValue()
                                        + Integer
                                        .parseInt(detail
                                                .getAsString("menge")
                                                .substring(
                                                        0,
                                                        detail
                                                                .getAsString(
                                                                        "menge")
                                                                .indexOf(
                                                                        ".") != -1 ? detail
                                                                .getAsString(
                                                                        "menge")
                                                                .indexOf(
                                                                        ".")
                                                                : detail
                                                                .getAsString(
                                                                        "menge")
                                                                .length())));
                        totalweight = Double.valueOf(totalweight.doubleValue()
                                + Double.parseDouble(G4Utils.isEmpty(detail
                                .get("hpzl")) ? "0" : detail
                                .getAsString("hpzl")));
                    } catch (NumberFormatException e) {
                        e.printStackTrace();
                    }
                }

            }

            ((Dto) list.get(i)).put("total", totalPrice);
            ((Dto) list.get(i)).put("totalcount", totalcount);
            ((Dto) list.get(i)).put("totalweight", totalweight);
            ((Dto) list.get(i)).put("reason", ((Dto) list.get(i))
                    .get("headreason"));
            ((Dto) list.get(i)).put("headReason", getReasonStr((Dto) list
                    .get(i)));
            ((Dto) list.get(i)).put("werksStr", getWerksStr((Dto) list.get(i)));
        }
        request.getSession().setAttribute("ReceiveStoreHeadForHeadValidate",
                list);
        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getReceiveStoreHeadForValidate(ActionMapping mapping,
                                                        ActionForm form, HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List idList = new ArrayList();

        List list = this.g4Reader.queryForPage(
                "stocksystem.getReceiveStoreHeadForValidate", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getReceiveStoreHeadForValidatecount", dto);
        for (int i = 0; i < list.size(); i++) {
            if (!idList.contains(((Dto) list.get(i)).getAsString("id"))) {
                idList.add(((Dto) list.get(i)).getAsString("id"));
            }

            if ("G".equals(((Dto) list.get(i)).get("meins"))) {
                if (Double.parseDouble(G4Utils.isEmpty(((Dto) list.get(i))
                        .get("menge")) ? "0" : ((Dto) list.get(i))
                        .getAsString("menge")) > 0.0D) {
                    ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                            .get("menge"));
                    ((Dto) list.get(i)).put("chargcount", Integer.valueOf(1));
                }
            } else
                ((Dto) list.get(i)).put("chargcount", ((Dto) list.get(i))
                        .get("menge"));

            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            ((Dto) list.get(i)).put("werksStr", getWerksStr((Dto) list.get(i)));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("lgort"));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr(dto));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
        }

        for (int i = 0; i < idList.size(); i++) {
            Dto baseDto = new BaseDto();
            baseDto.put("id", idList.get(i));

            Dto item = (Dto) list.get(i);
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            Double totalPrice = Double.valueOf(0.0D);
            List details = this.g4Reader.queryForList(
                    "stocksystem.getRecievedGoodDetail", baseDto);
            for (int j = 0; j < details.size(); j++) {
                Dto detail = (Dto) details.get(j);
                totalPrice = Double.valueOf(totalPrice.doubleValue()
                        + Double.parseDouble(G4Utils.isNotEmpty(detail
                        .get("kbetr")) ? detail.getAsString("kbetr")
                        : "0.0"));

                if ("G".equals(detail.getAsString("meins"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(detail.getAsString("menge")));
                } else {
                    totalcount = Integer.valueOf(totalcount.intValue()
                            + Integer.parseInt(detail.getAsString("menge")
                            .substring(
                                    0,
                                    detail.getAsString("menge")
                                            .indexOf("."))));
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(G4Utils.isEmpty(detail
                            .get("hpzl")) ? "0" : detail
                            .getAsString("hpzl")));
                }
            }
            for (int j = 0; j < list.size(); j++) {
                if (((String) idList.get(i)).equals(((Dto) list.get(j))
                        .get("id"))) {
                    ((Dto) list.get(j)).put("total", totalPrice);
                    ((Dto) list.get(j)).put("totalcount", totalcount);
                    ((Dto) list.get(j)).put("totalweight", totalweight);
                }
            }
        }
        request.getSession().setAttribute("ReceiveStoreHeadForValidate", list);
        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

        this.lgortMap = null;
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getReceiveStoreHeadForQualified(ActionMapping mapping,
                                                         ActionForm form, HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List idList = new ArrayList();
        List list = this.g4Reader.queryForPage(
                "stocksystem.getReceiveStoreHeadForQualified", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getReceiveStoreHeadForQualifiedcount", dto);
        for (int i = 0; i < list.size(); i++) {
            if ("G".equals(((Dto) list.get(i)).get("meins"))) {
                if (Double
                        .parseDouble(((Dto) list.get(i)).getAsString("menge")) > 0.0D) {
                    ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                            .get("menge"));
                    ((Dto) list.get(i)).put("chargcount", Integer.valueOf(1));
                }
            } else
                ((Dto) list.get(i)).put("chargcount", ((Dto) list.get(i))
                        .get("menge"));

            idList.add(((Dto) list.get(i)).getAsString("id"));

            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            ((Dto) list.get(i)).put("werksStr", getWerksStr((Dto) list.get(i)));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("lgort"));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr(dto));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
        }

        for (int i = 0; i < idList.size(); i++) {
            Dto baseDto = new BaseDto();
            baseDto.put("id", idList.get(i));

            Dto item = (Dto) list.get(i);
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            Double totalPrice = Double.valueOf(0.0D);
            List details = this.g4Reader.queryForList(
                    "stocksystem.getRecievedGoodDetail", baseDto);
            for (int j = 0; j < details.size(); j++) {
                Dto detail = (Dto) details.get(j);
                if ("G".equals(detail.getAsString("meins"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(detail.getAsString("menge")));
                } else {
                    totalcount = Integer.valueOf(totalcount.intValue()
                            + Integer.parseInt(detail.getAsString("menge")
                            .substring(
                                    0,
                                    detail.getAsString("menge")
                                            .indexOf("."))));
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(G4Utils.isEmpty(detail
                            .get("hpzl")) ? "0" : detail
                            .getAsString("hpzl")));
                }
            }
            for (int j = 0; j < list.size(); j++) {
                if (((String) idList.get(i)).equals(((Dto) list.get(j))
                        .get("id"))) {
                    ((Dto) list.get(j)).put("totalcount", totalcount);
                    ((Dto) list.get(j)).put("totalweight", totalweight);
                }
            }
        }

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

        this.lgortMap = null;

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getReceiveStoreHeadForHeadQualified(
            ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage(
                "stocksystem.getReceiveStoreHeadForHeadQualified", dto);
        Integer count = (Integer) this.g4Reader.queryForObject(
                "stocksystem.getReceiveStoreHeadForHeadQualifiedcount", dto);

        for (int i = 0; i < list.size(); i++) {
            Dto item = (Dto) list.get(i);
            Integer totalcount = Integer.valueOf(0);
            Double totalweight = Double.valueOf(0.0D);
            List details = this.g4Reader.queryForList(
                    "stocksystem.getRecievedGoodDetail", item);
            for (int j = 0; j < details.size(); j++) {
                Dto detail = (Dto) details.get(j);
                if ("G".equals(detail.getAsString("meins"))) {
                    totalcount = Integer.valueOf(totalcount.intValue() + 1);
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(detail.getAsString("menge")));
                } else {
                    totalcount = Integer.valueOf(totalcount.intValue()
                            + Integer.parseInt(detail.getAsString("menge")
                            .substring(
                                    0,
                                    detail.getAsString("menge")
                                            .indexOf("."))));
                    totalweight = Double.valueOf(totalweight.doubleValue()
                            + Double.parseDouble(G4Utils.isEmpty(detail
                            .get("hpzl")) ? "0" : detail
                            .getAsString("hpzl")));
                }

            }

            ((Dto) list.get(i)).put("totalcount", totalcount);
            ((Dto) list.get(i)).put("totalweight", totalweight);

            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            ((Dto) list.get(i)).put("werksStr", getWerksStr((Dto) list.get(i)));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("lgort"));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr(dto));
            ((Dto) list.get(i)).put("reason", ((Dto) list.get(i))
                    .get("headreason"));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
        }

        String retStr = JsonHelper.encodeList2PageJson(list, count,
                "yyyy-MM-dd");

        this.lgortMap = null;

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getReceiveStoreDetail(ActionMapping mapping,
                                               ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

        List list = this.g4Reader.queryForList(
                "stocksystem.getRecievedGoodDetail", dto);

        for (int i = 0; i < list.size(); i++) {
            if ("G".equals(((Dto) list.get(i)).get("meins"))) {
                ((Dto) list.get(i)).put("count", Integer.valueOf(1));
                ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                        .get("menge"));
            } else {
                ((Dto) list.get(i)).put("count", ((Dto) list.get(i))
                        .getAsString("menge"));
            }

            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("lgort"));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr(dto));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
        }

        String retStr = JsonHelper.encodeObject2Json(list);

        this.lgortMap = null;
        retStr = "{'ROOT':" + retStr + "}";
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getRecievedGoodDetail(ActionMapping mapping,
                                               ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

        List list = this.g4Reader.queryForList(
                "stocksystem.getRecievedGoodDetail", dto);

        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            dto.put("lgort", ((Dto) list.get(i)).getAsString("lgort"));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr(dto));
            ((Dto) list.get(i)).put("reasonStr",
                    getReasonStr((Dto) list.get(i)));
        }

        String retStr = JsonHelper.encodeObject2Json(list);

        retStr = "{ROOT:" + retStr + "}";

        this.lgortMap = null;
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward rejReceive(ActionMapping mapping, ActionForm form,
                                    HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);

        String VBELN = dto.getAsString("vbeln");
        String meterialdocument = dto.getAsString("meterialdocument");
        String annualvouchers = dto.getAsString("annualvouchers");

        SapTransfer transferservice = new SapTransferImpl();
        TransferInfo transferInfo = new TransferInfo();
        transferInfo.getImportPara().getParameters().put("I_MBLNR",
                meterialdocument);
        transferInfo.getImportPara().getParameters().put("I_MJAHR",
                annualvouchers);

        AigTransferInfo outinfo = transferservice.transferInfoAig(
                "Z_RFC_STORE_14", transferInfo);
        ArrayList retResult = outinfo.getAigTable("RETURN");
        String I_MBLNR = (String) outinfo.getParameters("I_MBLNR");
        String I_MJAHR = (String) outinfo.getParameters("I_MJAHR");
        System.out.println(I_MBLNR);
        System.out.println(I_MJAHR);

        write("{success: true}", response);

        return mapping.findForward(null);
    }

    public ActionForward getHeadquartersLgort(ActionMapping mapping,
                                              ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("werks");
        List lgortInfo = this.g4Reader.queryForList("stocksystem.getLgortInfo",
                dto);
        String retStr = JsonHelper.encodeObject2Json(lgortInfo);
        write(retStr, response);
        return mapping.findForward(null);
    }

    private String getGoldTypeStr(String goldType) {
        String retStr = "";

        retStr = Common.getGoldType(goldType);
        return retStr;
    }

    private String getPostTypeStr(String postType) {
        String retStr = "";

        retStr = Common.getPostType(postType);
        return retStr;
    }

    private String getGoodTypeStr(String goodType) {
        String retStr = "";

        retStr = Common.getGoodType(goodType);
        return retStr;
    }

    private String getToneTypeStr(String toneType) {
        String retStr = "";

        retStr = Common.getToneType(toneType);
        return retStr;
    }

    private String getToneNeatNessStr(String toneNeatNess) {
        String retStr = "";

        retStr = Common.getToneNeatNess(toneNeatNess);
        return retStr;
    }

    private String getToneColorStr(String toneColor) {
        String retStr = "";

        retStr = Common.getToneColor(toneColor);
        return retStr;
    }

    private String getLgortStr(Dto dtoParam) {
        if (G4Utils.isEmpty(this.lgortMap)) {
            List lgorts = this.g4Dao.queryForList(
                    "commonsqlmap.getLgortFromWerks", dtoParam);
            this.lgortMap = new BaseDto();
            for (int i = 0; i < lgorts.size(); i++) {
                Dto item = (Dto) lgorts.get(i);
                this.lgortMap.put(item.getAsString("lgort"), item
                        .getAsString("lgobe")
                        + '-' + item.getAsString("lgort"));
            }
        }

        return this.lgortMap.getAsString(dtoParam.getAsString("lgort"));
    }

    private String getWerksStr(Dto dtoParam) {
        String retStr = "";

        retStr = Common.getWerks(dtoParam.getAsString("werks"));
        return retStr;
    }

    private String getReasonStr(Dto dtoParam) {
        if (this.reasonDto == null) {
            this.reasonDto = this.g4Dao.queryForList("commonsqlmap.getReasons");
        }
        String retStr = "";
        String[] reasons = dtoParam.get("reason") != null ? dtoParam
                .getAsString("reason").split(",") : null;
        if (reasons != null) {
            for (int i = 0; i < reasons.length; i++) {
                for (int j = 0; j < this.reasonDto.size(); j++) {
                    Dto reason = (Dto) this.reasonDto.get(j);
                    System.out.println(reasons[i] + "==" + reason.getAsString("id"));
                    if (reasons[i].equals(reason.getAsString("id"))) {
                        retStr = retStr + reason.getAsString("id") + ":"
                                + reason.getAsString("description");
                        if (i == reasons.length - 1)
                            break;
                        retStr = retStr + "<br/>";

                        break;
                    }
                }
            }
        }
        return retStr;
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
            dto.put("werks", werks);
        } catch (Exception e) {
            log.debug(e.getMessage());
            return mapping.findForward(null);
        }

        List data = this.g4Dao.queryForList("stocksystem.getMatnrInfo", dto);
        String retStr = JsonHelper.encodeObject2Json(data);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getMatnrInfobyuser(ActionMapping mapping,
                                            ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = null;
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            dto.put("werks", werks);
        } catch (Exception e) {
            log.debug(e.getMessage());
            return mapping.findForward(null);
        }
        List data = this.g4Dao.queryForList("stocksystem.getMatnrInfobyuser",
                dto);
        if ((data != null) && (data.size() > 0)) {
            Double kbetr = Double
                    .valueOf(Double.parseDouble(((Dto) data.get(0))
                            .get("kbetr") != null ? ((Dto) data.get(0))
                            .getAsString("kbetr") : "0"));
            Double verpr = Double
                    .valueOf(Double.parseDouble(((Dto) data.get(0))
                            .get("verpr") != null ? ((Dto) data.get(0))
                            .getAsString("verpr") : "0"));
            Double realPrice = Double.valueOf(kbetr.doubleValue() / 1000.0D
                    * verpr.doubleValue());
            ((Dto) data.get(0)).put("realprice", realPrice);
            ((Dto) data.get(0)).put("ztjtj", verpr);
        }
        String retStr = JsonHelper.encodeObject2Json(data);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitOutStockForYHP(ActionMapping mapping,
                                              ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("werks");
        if (super.getSessionContainer(request).getUserInfo() != null)
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        else {
            return mapping.findForward("authorization");
        }

        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
            String maxoutid = "OS" + format.format(new Date()) + '%';

            dto.put("maxoutid", maxoutid);
            maxoutid = (String) this.g4Reader.queryForObject(
                    "stocksystem.getMaxOutStockIdForYHP", dto);
            if ("001".equals(maxoutid)) {
                maxoutid = "OS" + format.format(new Date()) + maxoutid;
            } else {
                maxoutid = maxoutid.substring(maxoutid.length() - 3);
                int id = Integer.parseInt(maxoutid) + 1;
                String pattern = "000";
                DecimalFormat df = new DecimalFormat(pattern);
                maxoutid = df.format(id);
                maxoutid = "OS" + format.format(new Date()) + maxoutid;
            }

            Dto stockHeader = JsonHelper.parseSingleJson2Dto((String) dto
                    .get("orderhead"));
            List stockItems = JsonHelper.parseJson2List((String) dto
                    .get("orderitem"));

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            AigTransferTable table = transferInfo.getTable("IT_ITAB");

            for (int i = 0; i < stockItems.size(); i++) {
                Dto item = (Dto) stockItems.get(i);

                table.setValue("MENGE", item.get("salesquantity"));
                table.setValue("LGORT", item.get("storagelocation"));
                table.setValue("MATNR", item.get("batchnumber"));
                table.setValue("UMLGO", item.get("inlgort"));
                table.setValue("WERKS", werks);
                table.setValue("UMWRK", stockHeader.get("inwerk"));
                table.appendRow();
            }
            transferInfo.appendTable(table);

            AigTransferInfo outinfo = transferservice.transferInfoAig(
                    "Z_RFC_STORE_16", transferInfo);
            Map retResult = outinfo.getAigStructure("GT_STORE_16");
            System.out.println(retResult.get("TYPE"));
            System.out.println(retResult.get("MESSAGE"));
            System.out.println(retResult.get("MBLNR"));
            System.out.println(retResult.get("MJAHR"));

            if ("S".equals(retResult.get("TYPE"))) {
                stockHeader.put("I_MBLNR", retResult.get("MBLNR"));
                stockHeader.put("I_MJAHR", retResult.get("MJAHR"));
                stockHeader.put("outwerks", werks);
                stockHeader.put("maxoutid", maxoutid);

                this.stockService.insertOutStockInfoForYHP(stockHeader,
                        stockItems);
            }

            write((String) retResult.get("MESSAGE") + "<br/>凭证号码为:"
                    + retResult.get("MBLNR") + "，凭证年度："
                    + retResult.get("MJAHR"), response);
        } catch (Exception e) {
            e.printStackTrace();
            write(e.getMessage(), response);
        }

        return mapping.findForward(null);
    }

    public ActionForward getInStockHeaderForYHP(ActionMapping mapping,
                                                ActionForm form, HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("inwerks", werks);

        List list = this.g4Reader.queryForList(
                "stocksystem.getInStockHeaderForYHP", dto);

        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("statusStr", getStatusStr(((Dto) list
                    .get(i)).getAsInteger("status").intValue()));
        }

        String retStr = JsonHelper.encodeObject2Json(list);

        retStr = "{ROOT:" + retStr + "}";

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getInStockDetailForYHP(ActionMapping mapping,
                                                ActionForm form, HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);

        List list = this.g4Reader.queryForList(
                "stocksystem.getInStockDetailForYHP", dto);

        String retStr = JsonHelper.encodeObject2Json(list);

        retStr = "{ROOT:" + retStr + "}";

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getDailyGoldPrice(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);

        List list = this.g4Reader.queryForList(
                "stocksystem.getInStockDetailForYHP", dto);

        String retStr = JsonHelper.encodeObject2Json(list);

        retStr = "{ROOT:" + retStr + "}";

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward manageReason(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();

            List itemData = JsonHelper.parseJson2List(dto.getAsString(
                    "chargitem").indexOf("\r\n") != -1 ? dto.getAsString(
                    "chargitem").replaceAll("\r\n", "<br/>") : dto.getAsString(
                    "chargitem").replaceAll("\n", "<br/>"));

            this.stockService.updateRecieveManage(itemData);
            retDto.put("success", "操作已成功！");
        } catch (Exception e) {
            e.printStackTrace();
            retDto.put("error", e.getMessage());
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward submitValidate(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        UserInfoVo info = super.getSessionContainer(request).getUserInfo();
        String werks = info.getCustomId();//门店
        String status = dto.getAsString("status");
        //20150206 zwh
        dto.put("spppr", info.getAccount());//审批人
        dto.put("sptim", G4Utils.getCurrentTime("yyyy-MM-dd hh:mm:ss"));
        Dto retDto = new BaseDto();
        List updateItem = JsonHelper.parseJson2List(dto.getAsString("updateItem"));
        try {
            try {
                if (("1".equals(status)) && (G4Utils.isNotEmpty(((Dto) updateItem.get(0)).get("charg")))) {
                    List chargs = new ArrayList();
                    for (int i = 0; i < updateItem.size(); i++) {
                        Dto item = (Dto) updateItem.get(i);
                        chargs.add(item.getAsString("charg"));

                        Double companyprice = Double.valueOf(G4Utils.isNotEmpty(item.get("companyprice")) ? Double.parseDouble(item.getAsString("companyprice")) : 0.0D);
                        Double bqj = Double.valueOf(G4Utils.isNotEmpty(item.get("bqj")) ? Double.parseDouble(item.getAsString("bqj")) : 0.0D);
                        String ifneedprintLabel = item.getAsString("ifneedprintLabel");
                        String ifneedchangPrice = item.getAsString("ifneedchangPrice");
                        Double inwerksxs = Double.valueOf(G4Utils.isNotEmpty(item.get("inwerksxs")) ? Double.parseDouble(item.getAsString("inwerksxs")) : 1.0D);
                        if ("1、是".equals(ifneedchangPrice)) {
                            Double price = Double.valueOf(companyprice.doubleValue() * inwerksxs.doubleValue());
                            item.put("mykbert", price.toString().subSequence(0, price.toString().indexOf(".")));
                        } else {
                            item.put("mykbert", bqj);
                        }
                    }
                    dto.put("chargs", chargs);
                    List datas = this.g4Dao.queryForList("stocksystem.getInStockDetailForUpdatePrice", dto);
                    for (int i = 0; i < updateItem.size(); i++) {
                        Dto item = (Dto) updateItem.get(i);
                        item.put("vkorg", "1000");
                        item.put("vtweg", "10");
                        item.put("datab", G4Utils.getCurrentTime("yyyy-MM-dd"));
                        item.put("datbi", "9999-12-31");
                        item.put("aedat", "0000-00-00");
                        item.put("currdate", "0000-00-00");
                        for (int j = 0; j < datas.size(); j++) {
                            Dto data = (Dto) datas.get(j);
                            if (item.getAsString("charg").equals(data.getAsString("charg"))) {
                                item.putAll(data);
                                break;
                            }
                        }
                    }

                    List updatesealmethodDto = new ArrayList();
                    SapTransfer transferservice = new SapTransferImpl();
                    TransferInfo transferInfo = new TransferInfo();
                    TransferInfo transferInfo2 = new TransferInfo();
                    AigTransferTable table = transferInfo.getTable("IT_ZTLSJZ");
                    AigTransferTable table2 = transferInfo.getTable("IT_ITAB");
                    for (int i = 0; i < updateItem.size(); i++) {
                        Dto item = (Dto) updateItem.get(i);
                        item.put("werks", werks);
                        table.setValue("MATNR", item.get("matnr"));
                        table.setValue("CHARG", item.get("charg"));
                        table.setValue("KBETR", item.get("mykbert"));
                        table.setValue("KUNRE", item.get("inwerks"));
                        table.appendRow();

                        if (G4Utils.isNotEmpty(item.getAsString("inwerkssealmethod"))) {
                            item.put("sealmethod", item.getAsString("inwerkssealmethod").substring(0, item.getAsString("inwerkssealmethod").indexOf("、")));
                            table2.setValue("CHARG", item.get("charg"));
                            table2.setValue("ZXSFS", item.get("sealmethod"));
                            table2.appendRow();
                            updatesealmethodDto.add(item);
                        }
                    }
                    transferInfo.appendTable(table);
                    transferInfo2.appendTable(table2);
                    //修改零售价接口
                    AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE_31", transferInfo);
                    ArrayList retData = outinfo.getAigTable("IT_RETURN");
                    String TYPE = (String) ((HashMap) retData.get(0)).get("TYPE");
                    String msg = (String) ((HashMap) retData.get(0)).get("MESSAGE");

                    if ("S".equals(TYPE))
                        try {
                            for (int i = 0; i < updateItem.size(); i++) {
                                Dto data = (Dto) updateItem.get(i);
                                data.put("outid", dto.get("outid"));
                                Integer con = (Integer) this.g4Dao.queryForObject("stocksystem.validateInwerksPrice", data);
                                if (con.intValue() > 0)
                                    this.g4Dao.update("stocksystem.updateInwerksPrice", data);
                                else {
                                    this.g4Dao.update("stocksystem.insertInwerksPrice", data);
                                }
                                this.g4Dao.update("stocksystem.updateStockTransferItem", data);
                            }

                            if (updatesealmethodDto.size() > 0) {
                                //更改销售方式接口
                                outinfo = transferservice.transferInfoAig("Z_RFC_STORE_49", transferInfo2);

                                TYPE = (String) ((HashMap) retData.get(0)).get("TYPE");
                                msg = (String) ((HashMap) retData.get(0)).get("MESSAGE");
                                if ("S".equals(TYPE)) {
                                    for (int i = 0; i < updatesealmethodDto.size(); i++) {
                                        this.g4Dao.update("stocksystem.updatesealmethod", updatesealmethodDto.get(i));
                                    }
                                } else {
                                    retDto.put("error", msg);
                                }
                            }
                            this.g4Dao.update("stocksystem.submitValidate", dto);

                            retDto.put("success", "操作成功！");
                        } catch (Exception e) {
                            retDto.put("error", e.getMessage());
                            log.debug(e.getMessage());
                            e.printStackTrace();
                        }
                    else
                        retDto.put("error", msg);
                } else {
                    dto.remove("needprintlabel");
                    this.g4Dao.update("stocksystem.submitValidate", dto);
                    retDto.put("success", "操作成功！");
                }
            } catch (Exception e) {
                e.printStackTrace();
                retDto.put("error", e.getMessage());
            }
        } catch (Exception e) {
            log.debug(e.getMessage());
            e.printStackTrace();
            retDto.put("error", e.getMessage());
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitPrintLabel(ActionMapping mapping,
                                          ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        String status = dto.getAsString("status");
        Dto retDto = new BaseDto();
        try {
            this.g4Dao.update("stocksystem.submitPrintLabel", dto);

            retDto.put("success", "操作成功！");
        } catch (Exception e) {
            log.debug(e.getMessage());
            e.printStackTrace();
            retDto.put("error", e.getMessage());
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitValidateFor1000(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto retDto = new BaseDto();
        Dto dto = aForm.getParamAsDto(request);
        try {
            List updateItem = JsonHelper.parseJson2List(dto.getAsString("updateItem"));
            UserInfoVo info = super.getSessionContainer(request).getUserInfo();
            String werks = info.getCustomId();//门店
            String status = dto.getAsString("status");
            //20150206 zwh
            dto.put("spppr", info.getAccount());//审批人
            dto.put("sptim", G4Utils.getCurrentTime("yyyy-MM-dd hh:mm:ss"));//审批时间

            if ("12".equals(status)) {
                List chargs = new ArrayList();
                for (int i = 0; i < updateItem.size(); i++) {
                    Dto item = (Dto) updateItem.get(i);
                    chargs.add(item.getAsString("charg"));
                    Double companyprice = Double.valueOf(G4Utils.isNotEmpty(item.get("companyprice")) ? Double.parseDouble(item.getAsString("companyprice")) : 0.0D);
                    Double bqj = Double.valueOf(G4Utils.isNotEmpty(item.get("bqj")) ? Double.parseDouble(item.getAsString("bqj")) : 0.0D);
                    String ifneedprintLabel = item.getAsString("ifneedprintLabel");
                    String ifneedchangPrice = item.getAsString("ifneedchangPrice");
                    Double inwerksxs = Double.valueOf(G4Utils.isNotEmpty(item.get("inwerksxs")) ? Double.parseDouble(item.getAsString("inwerksxs")) : 1.0D);
                    Double price = companyprice;
                    item.put("mykbert", price.toString().subSequence(0, price.toString().indexOf(".")));
                }
                dto.put("chargs", chargs);

                List datas = this.g4Dao.queryForList("stocksystem.getInStockDetailForUpdatePrice", dto);
                for (int i = 0; i < updateItem.size(); i++) {
                    Dto item = (Dto) updateItem.get(i);
                    item.put("vkorg", "1000");
                    item.put("vtweg", "10");
                    item.put("datab", G4Utils.getCurrentTime("yyyy-MM-dd"));
                    item.put("datbi", "9999-12-31");
                    item.put("aedat", "0000-00-00");
                    item.put("currdate", "0000-00-00");
                    for (int j = 0; j < datas.size(); j++) {
                        Dto data = (Dto) datas.get(j);
                        if (item.getAsString("charg").equals(data.getAsString("charg"))) {
                            item.putAll(data);
                            break;
                        }
                    }
                }

                List updatesealmethodDto = new ArrayList();
                SapTransfer transferservice = new SapTransferImpl();
                TransferInfo transferInfo = new TransferInfo();
                AigTransferTable table = transferInfo.getTable("IT_ZTLSJZ");
                for (int i = 0; i < updateItem.size(); i++) {
                    Dto item = (Dto) updateItem.get(i);
                    item.put("werks", werks);
                    table.setValue("MATNR", item.get("matnr"));
                    table.setValue("CHARG", item.get("charg"));
                    table.setValue("KBETR", item.get("mykbert"));
                    table.setValue("KUNRE", item.get("inwerks"));
                    table.appendRow();
                }

                transferInfo.appendTable(table);
                AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE_31", transferInfo);
                ArrayList retData = outinfo.getAigTable("IT_RETURN");
                String TYPE = (String) ((HashMap) retData.get(0)).get("TYPE");
                String msg = (String) ((HashMap) retData.get(0)).get("MESSAGE");

                if ("S".equals(TYPE)) {
                    try {
                        for (int i = 0; i < updateItem.size(); i++) {
                            Dto data = (Dto) updateItem.get(i);
                            data.put("outid", dto.get("outid"));
                            Integer con = (Integer) this.g4Dao.queryForObject("stocksystem.validateInwerksPrice", data);
                            if (con.intValue() > 0)
                                this.g4Dao.update("stocksystem.updateInwerksPrice", data);
                            else
                                this.g4Dao.update("stocksystem.insertInwerksPrice", data);
                        }
                    } catch (Exception e) {
                        log.debug("更新标签价出现错误" + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }
            this.g4Dao.update("stocksystem.submitValidate", dto);
            retDto.put("success", "操作成功！");
        } catch (Exception e) {
            log.debug(e.getMessage());
            e.printStackTrace();
            retDto.put("error", e.getMessage());
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitMoveLgortValidate(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        String status = dto.getAsString("status");
        Dto retDto = new BaseDto();
        try {
            this.g4Dao.update("stocksystem.submitMoveLgortValidate", dto);
            retDto.put("success", "操作成功！");
        } catch (Exception e) {
            log.debug(e.getMessage());
            e.printStackTrace();
            retDto.put("error", e.getMessage());
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward submitTransfer(ActionMapping mapping, ActionForm form,
                                        HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        String status = dto.getAsString("status");
        Dto retDto = new BaseDto();
        dto.put("posttime", dto.getAsDate("posttime"));

        List stockItems = this.g4Dao.queryForList(
                "stocksystem.getOutStockDetailForSubmitToSap", dto);

        //获取库存信息  zwh 20141120
        List stockKcs = this.g4Dao.queryForList("stocksystem.getKc", dto);


        SapTransfer transferservice = new SapTransferImpl();
        TransferInfo transferInfo = new TransferInfo();
        AigTransferTable table = transferInfo.getTable("IT_ITAB");
        String charg, lgort;
        StringBuffer buf = new StringBuffer();
        for (int i = 0; i < stockItems.size(); i++) {
            Dto item = (Dto) stockItems.get(i);
            charg = "";
            lgort = "";
            charg = item.getAsString("charg");//批次
            lgort = item.getAsString("outstock");//库位
            String messge = getMsgForcharg(stockKcs, charg, lgort);
            if (!messge.equals("")) {
                buf.append(messge);
                continue;
            }
            if (G4Utils.isNotEmpty(item.get("ifneedprintlabel"))) {
                if (item.getAsString("ifneedprintlabel").startsWith("1、"))
                    table.setValue("GRUND", Integer.valueOf(1));
                else
                    table.setValue("GRUND", Integer.valueOf(2));
            } else {
                table.setValue("GRUND", Integer.valueOf(2));
            }
            table.setValue("MATNR", item.get("matnr"));
            table.setValue("MENGE", item.get("goodscount"));
            table.setValue("LGORT", item.get("outstock"));
            table.setValue("BATCH", item.get("charg"));
            table.setValue("UMLGO", "0018");
            item.put("instock", "0018");
            table.setValue("WERKS", item.get("outwerks"));
            table.setValue("UMWRK", item.get("inwerks"));
            table.appendRow();
        }
        if (buf.toString().equals("")) {
            transferInfo.appendTable(table);
            int iiii = table.getMetaData().size();
//	System.out.println(iiii+'件');


            AigTransferInfo outinfo = transferservice.transferInfoAig(
                    "Z_RFC_STORE_16", transferInfo);
            Map retResult = outinfo.getAigStructure("GT_STORE_16");
            System.out.println(retResult.get("TYPE"));
            System.out.println(retResult.get("MESSAGE"));
            System.out.println(retResult.get("MBLNR"));
            System.out.println(retResult.get("MJAHR"));
            if ("S".equals(retResult.get("TYPE"))) {
                dto.put("I_MBLNR", retResult.get("MBLNR"));
                dto.put("I_MJAHR", retResult.get("MJAHR"));
                String msg = "调拨出库单：" + dto.getAsString("outid") + "更新成功!<br/>"
                        + "商品凭证编号:" + retResult.get("MBLNR") + "<br/>" + "商品凭证年度:"
                        + retResult.get("MJAHR");
                retDto.put("success", msg);
                try {
                    this.stockService.submitTransfer(dto, stockItems);
                } catch (Exception e) {
                    log.debug(e.getMessage());
                    e.printStackTrace();
                    retDto.put("error", e.getMessage());
                }
            } else {
                retDto.put("error", retResult.get("MESSAGE"));
            }
        } else {
            retDto.put("error", buf.toString());
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    private String getMsgForcharg(List stockKcs, String charg, String lgort) {
        for (int i = 0; i < stockKcs.size(); i++) {
            Dto item = (Dto) stockKcs.get(i);
            //批次库位都有
            if (item.getAsString("charg").equals(charg)
                    && item.getAsString("lgort").equals(lgort)) {
                return "";
            }
        }

        return "批次" + charg + "库位" + lgort + "不存在。</br>";
    }

    public ActionForward getOrderhead(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = this.g4Dao.queryForList("stocksystem.getorderhead", dto);
        String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd");
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getOrderItem(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        List list = this.g4Dao.queryForList("stocksystem.getorderitem", dto);
        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = Common.getNewString(werks, jsonString);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getPostType(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = this.g4Dao.queryForList("commonsqlmap.getPostTypeStr");
        String jsonString = JsonHelper.encodeObject2Json(list);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getGoodType(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = this.g4Dao.queryForList("commonsqlmap.getGoodTypeStr");
        String jsonString = JsonHelper.encodeObject2Json(list);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getStockList(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        String[] kondms = G4Utils.isEmpty(dto.get("kondm")) ? null : dto
                .getAsString("kondm").split(",");
        String[] lgorts = G4Utils.isEmpty(dto.get("lgort")) ? null : dto
                .getAsString("lgort").split(",");
        dto.put("kondms", kondms);
        dto.put("lgorts", lgorts);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        String mykondms = null;
        String mylgorts = null;
        if (G4Utils.isNotEmpty(kondms)) {
            mykondms = "('";
            for (int i = 0; i < kondms.length; i++) {
                mykondms = mykondms + kondms[i] + "','";
            }
            mykondms = mykondms.substring(0, mykondms.length() - 2) + ")";
        }
        if (G4Utils.isNotEmpty(lgorts)) {
            mylgorts = "('";
            for (int i = 0; i < lgorts.length; i++) {
                mylgorts = mylgorts + lgorts[i] + "','";
            }
            mylgorts = mylgorts.substring(0, mylgorts.length() - 2) + ")";
        }

        dto.put("mykondms", mykondms);
        dto.put("mylgorts", mylgorts);

        List list = this.g4Dao.queryForPage("stocksystem.getStockList2", dto);

        Integer page = (Integer) this.g4Dao.queryForObject(
                "stocksystem.getStockListCount2", dto);

        for (int i = 0; i < list.size(); i++) {
            if ("G".equals(((Dto) list.get(i)).get("meins"))) {
                ((Dto) list.get(i)).put("hpzl", ((Dto) list.get(i))
                        .get("labst"));
                if (Double
                        .parseDouble(((Dto) list.get(i)).getAsString("labst")) > 0.0D) {
                    if ("11".equals(((Dto) list.get(i)).getAsString("kondm")))
                        try {
                            String name = ((Dto) list.get(i)).getAsString("maktx");
                            String value = name.substring(name.indexOf("0") - 1, name.lastIndexOf("0") + 1);
                            Integer val = Integer.valueOf(Integer.parseInt(value));
                            Double count = Double.valueOf(Double.parseDouble(((Dto) list.get(i)).getAsString("labst")) / val.intValue());
                            ((Dto) list.get(i)).put("labst", count);
                        } catch (Exception e) {
                            ((Dto) list.get(i)).put("labst", Integer.valueOf(1));
                            e.printStackTrace();
                        }
                    else
                        ((Dto) list.get(i)).put("labst", Integer.valueOf(1));
                } else {
                    ((Dto) list.get(i)).put("labst", Integer.valueOf(0));
                }
            }
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr((Dto) list.get(i)));
        }

        this.lgortMap = null;
        String jsonString = JsonHelper.encodeList2PageJson(list, page,
                "yyyy-MM-dd");
        jsonString = Common.getNewString(werks, jsonString);

        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getHavingStockTakingList(ActionMapping mapping,
                                                  ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Dao.queryForList(
                "stocksystem.getHavingStockTakingList", dto);

        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list
                    .get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list
                    .get(i)).getAsString("zslbm")));
            ((Dto) list.get(i))
                    .put("toneNeatNessStr", getToneNeatNessStr(((Dto) list
                            .get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list
                    .get(i)).getAsString("zslys")));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr((Dto) list.get(i)));
        }

        this.lgortMap = null;
        String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd");
        jsonString = Common.getNewString(werks, jsonString);

        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward exportExcel(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        Dto parametersDto = new BaseDto();
        parametersDto.put("reportTitle", "库存信息记录" + G4Utils.getCurrentTime());
        parametersDto.put("jbr", super.getSessionContainer(request)
                .getUserInfo().getUsername());
        parametersDto.put("jbsj", G4Utils.getCurrentTime());
        Dto inDto = (BaseDto) super.getSessionAttribute(request,
                "QUERYCATALOGS4EXPORT_QUERYDTO");
        List fieldsList = null;

        String[] kondms = G4Utils.isEmpty(dto.get("kondm")) ? null : dto
                .getAsString("kondm").split(",");
        String[] lgorts = G4Utils.isEmpty(dto.get("lgort")) ? null : dto
                .getAsString("lgort").split(",");
        dto.put("kondms", kondms);
        dto.put("lgorts", lgorts);

        fieldsList = this.g4Reader.queryForList("stocksystem.getStockList2",
                dto);

        for (int i = 0; i < fieldsList.size(); i++) {
            ((Dto) fieldsList.get(i)).put("goldTypeStr",
                    getGoldTypeStr(((Dto) fieldsList.get(i))
                            .getAsString("zjlbm")));
            ((Dto) fieldsList.get(i)).put("toneTypeStr",
                    getToneTypeStr(((Dto) fieldsList.get(i))
                            .getAsString("zslbm")));
            ((Dto) fieldsList.get(i)).put("toneNeatNessStr",
                    getToneNeatNessStr(((Dto) fieldsList.get(i))
                            .getAsString("labor")));
            ((Dto) fieldsList.get(i)).put("toneColorStr",
                    getToneColorStr(((Dto) fieldsList.get(i))
                            .getAsString("zslys")));
            ((Dto) fieldsList.get(i)).put("lgortStr",
                    getLgortStr((Dto) fieldsList.get(i)));
        }

        this.lgortMap = null;
        parametersDto.put("countXmid", new Integer(fieldsList.size()));
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter
                .setTemplatePath("/report/excel/mytemplate/hisCatalogReport.xls");
        excelExporter.setData(parametersDto, fieldsList);
        excelExporter.setFilename("库存信息记录"
                + G4Utils.getCurrentTime("yyyyMMddhhmmss") + ".xls");
        excelExporter.export(request, response);

        return mapping.findForward(null);
    }

    private String getStatusStr(int status) {
        String retStr = "";
        switch (status) {
            case 0:
                retStr = "待审核";
                break;
            case 1:
                retStr = "待发货";
                break;
            case 2:
                retStr = "已发货";
                break;
            case 3:
                retStr = "驳回";
                break;
            case 4:
                retStr = "已收货";
                break;
            case 5:
                retStr = "待整单差异处理";
                break;
            case 6:
                retStr = "待单行差异处理";
                break;
            case 7:
                retStr = "整单差异处理反馈";
                break;
            case 8:
                retStr = "单行差异处理反馈";
                break;
            case 9:
                retStr = "整单差异处理反馈完成";
                break;
            case 10:
                retStr = "单行差异处理反馈完成";
                break;
            case 11:
                retStr = "门店退货待审批";
                break;
            case 12:
                retStr = "门店退货待发货";
                break;
            case 13:
                retStr = "门店退货审批驳回";
                break;
            case 14:
                retStr = "门店退货完成";
        }

        return retStr;
    }

    private String getGoodTypeStr(int goodType) {
        String retStr = "";
        switch (goodType) {
            case 1:
                retStr = "镶嵌类";
                break;
            case 2:
                retStr = "银饰类";
                break;
            case 3:
                retStr = "玉石类";
                break;
            case 4:
                retStr = "18K金类";
                break;
            case 5:
                retStr = "铂金类";
                break;
            case 6:
                retStr = "黄金类";
                break;
            case 7:
                retStr = "钯金类";
                break;
            case 8:
                retStr = "赠品及包材";
                break;
            case 9:
                retStr = "其他";
        }

        return retStr;
    }

    public ActionForward getNewStockId(ActionMapping mapping, ActionForm form,
                                       HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List list = this.g4Dao.queryForList("commonsqlmap.getNewStockId");
        String jsonString = JsonHelper.encodeObject2Json(list);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward submitMoveLgort(ActionMapping mapping,
                                         ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();

        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        Dto moveHead = JsonHelper.parseSingleJson2Dto(dto
                .getAsString("orderhead"));

        moveHead.put("werks", werks);

        List items = JsonHelper.parseJson2List(dto.getAsString("orderitem"));

        SapTransfer transferservice = new SapTransferImpl();
        TransferInfo transferInfo = new TransferInfo();
        AigTransferTable table = transferInfo.getTable("IT_ITAB");

        for (int i = 0; i < items.size(); i++) {
            Dto item = (Dto) items.get(i);
            item.put("werks", werks);
            item.put("lgortfrom", moveHead.get("lgortfrom"));
            item.put("lgortto", moveHead.get("lgortto"));
            table.setValue("MATNR", item.get("matnr"));
            table.setValue("MENGE", item.get("salesquantity"));
            table.setValue("LGORT", moveHead.get("lgortfrom"));
            table.setValue("BATCH", item.get("charg"));
            table.setValue("UMLGO", moveHead.get("lgortto"));
            table.setValue("WERKS", werks);
            table.setValue("UMWRK", werks);
            table.appendRow();
        }
        transferInfo.appendTable(table);

        AigTransferInfo outinfo = transferservice.transferInfoAig(
                "Z_RFC_STORE_15", transferInfo);
        Map retResult = outinfo.getAigStructure("GT_STORE_15");
        System.out.println(retResult.get("TYPE"));
        String msg = (String) retResult.get("MESSAGE");
        System.out.println(retResult.get("MESSAGE"));
        System.out.println(retResult.get("MBLNR"));
        System.out.println(retResult.get("MJAHR"));

        if ("S".equals(retResult.get("TYPE"))) {
            retDto.put("success", msg);
            retDto.put("MBLNR", retResult.get("MBLNR"));
            retDto.put("MJAHR", retResult.get("MJAHR"));
            try {
                this.stockService.submitMoveLgort(items);
            } catch (Exception e) {
                log.debug(e.getMessage());
                retDto.put("error", e.getMessage());
                e.printStackTrace();
            }
        } else {
            retDto.put("error", msg);
        }

        String jsonString = JsonHelper.encodeObject2Json(retDto);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward submitNoPriceMoveLgort(ActionMapping mapping,
                                                ActionForm form, HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        String noPriceWerks = "WJZC";
        Dto searchDto = new BaseDto();

        searchDto.put("id", dto.get("id"));
        searchDto.put("status", Integer.valueOf(1));

        Dto moveHead = (Dto) this.g4Dao.queryForObject(
                "stocksystem.getNoPriceMoveLgortHeader", searchDto);

        moveHead.put("werks", werks);

        List items = this.g4Dao.queryForList(
                "stocksystem.getMoveLgortDetailForValidate", searchDto);

        SapTransfer transferservice = new SapTransferImpl();
        TransferInfo transferInfo = new TransferInfo();
        AigTransferTable table = transferInfo.getTable("IT_ITAB");

        for (int i = 0; i < items.size(); i++) {
            Dto item = (Dto) items.get(i);
            item.put("werks", werks);
            item.put("lgortfrom", moveHead.get("lgortfrom"));
            item.put("lgortto", moveHead.get("lgortto"));
            table.setValue("MATNR", item.get("matnr"));
            table.setValue("MENGE", item.get("quarty"));
            item.put("salesquantity", item.get("quarty"));
            table.setValue("LGORT", moveHead.get("lgortfrom"));

            table.setValue("UMLGO", moveHead.get("lgortto"));
            table.setValue("WERKS", noPriceWerks);
            table.setValue("UMWRK", noPriceWerks);
            table.appendRow();
        }
        transferInfo.appendTable(table);

        AigTransferInfo outinfo = transferservice.transferInfoAig(
                "Z_RFC_STORE_15", transferInfo);
        Map retResult = outinfo.getAigStructure("GT_STORE_15");
        System.out.println(retResult.get("TYPE"));
        String msg = (String) retResult.get("MESSAGE");
        System.out.println(retResult.get("MESSAGE"));
        System.out.println(retResult.get("MBLNR"));
        System.out.println(retResult.get("MJAHR"));

        if ("S".equals(retResult.get("TYPE"))) {
            msg = msg + "<br/>凭证号:" + retResult.get("MBLNR");
            retDto.put("success", msg);
            retDto.put("MBLNR", retResult.get("MBLNR"));
            retDto.put("MJAHR", retResult.get("MJAHR"));
            dto.put("MBLNR", retResult.get("MBLNR"));
            dto.put("MJAHR", retResult.get("MJAHR"));
            try {
                this.stockService.submitNoPriceMoveLgort(dto, items);
            } catch (Exception e) {
                log.debug(e.getMessage());
                retDto.put("error", e.getMessage());
                e.printStackTrace();
            }
        } else {
            retDto.put("error", msg);
        }

        String jsonString = JsonHelper.encodeObject2Json(retDto);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getKondmInfo(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List list = this.g4Dao.queryForList("stocksystem.getKondmInfo");
        Dto emptyDto = new BaseDto();
        emptyDto.put("kondm", "");
        emptyDto.put("vtext", "所有");
        list.add(0, emptyDto);
        String jsonString = JsonHelper.encodeObject2Json(list);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getextwgInfo(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List list = this.g4Dao.queryForList("stocksystem.getextwgInfo");
        Dto emptyDto = new BaseDto();
        String jsonString = JsonHelper.encodeObject2Json(list);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward gettoneInfo(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List list = this.g4Dao.queryForList("stocksystem.gettoneInfo");
        Dto emptyDto = new BaseDto();
        String jsonString = JsonHelper.encodeObject2Json(list);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward getgoldInfo(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List list = this.g4Dao.queryForList("stocksystem.getgoldInfo");
        Dto emptyDto = new BaseDto();
        String jsonString = JsonHelper.encodeObject2Json(list);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    public ActionForward submitHeadManage(ActionMapping mapping,
                                          ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));

            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                this.g4Dao.update("stocksystem.submitHeadManage", itemDto);
            }
            retDto.put("success", "更新成功！");
        } catch (Exception e) {
            retDto.put("success", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitHeadReason(ActionMapping mapping,
                                          ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));
            String retmsg = "";
            String type = "S";
            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);
                Dto msg = submitRecieveStock(itemDto);
                retmsg = retmsg + msg.getAsString("MESSAGE") + "<br/>";
                if (!"S".equals(msg.getAsString("TYPE"))) {
                    type = "E";
                }
            }
            if ("S".equals(type))
                retDto.put("success", retmsg);
            else
                retDto.put("error", retmsg);
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward updatePriceStatusForHeadReason(ActionMapping mapping,
                                                        ActionForm form, HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));

            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);
                String VBELN = (String) itemDto.get("VBELN");
                dto.put("VBELN", VBELN);
                List detail = (List) this.goodInfo.get(VBELN);
                String[] chargs = new String[detail.size()];
                for (int j = 0; j < detail.size(); j++) {
                    chargs[j] = ((String) ((Map) detail.get(j)).get("CHARG"));
                }

                dto.put("chargs", chargs);
                dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

                List list = this.g4Reader.queryForList(
                        "stocksystem.getReceiveGoodDetail", dto);

                for (int j = 0; j < list.size(); j++) {
                    ((Dto) list.get(j)).put("werks", werks);
                    if (((Map) detail.get(j)).get("CHARG").equals(
                            ((Dto) list.get(j)).get("charg")))
                        ((Dto) list.get(j)).putAll((Map) detail.get(j));
                    else {
                        for (int k = 0; k < detail.size(); k++) {
                            if (((Map) detail.get(k)).get("CHARG").equals(
                                    ((Dto) list.get(j)).get("charg"))) {
                                ((Dto) list.get(k)).putAll((Map) detail.get(j));
                            }
                        }
                    }
                }

                String rfcName = "";

                rfcName = "Z_RFC_STORE_31";

                SapTransfer transferservice = new SapTransferImpl();
                TransferInfo transferInfo = new TransferInfo();
                AigTransferTable table = transferInfo.getTable("IT_ZTLSJZ");
                for (int j = 0; j < list.size(); j++) {
                    Dto item = (Dto) list.get(j);
                    item.put("werks", werks);
                    table.setValue("MATNR", item.get("matnr"));
                    table.setValue("CHARG", item.get("charg"));
                    table.setValue("KUNRE", werks);
                    table.appendRow();
                }
                transferInfo.appendTable(table);
                AigTransferInfo outinfo = transferservice.transferInfoAig(
                        rfcName, transferInfo);
                ArrayList retData = outinfo.getAigTable("IT_RETURN");
                String TYPE = (String) ((HashMap) retData.get(0)).get("TYPE");
                String msg = (String) ((HashMap) retData.get(0)).get("MESSAGE");
                System.out.println(((HashMap) retData.get(0)).get("TYPE"));
                System.out.println(((HashMap) retData.get(0)).get("MESSAGE"));
                if ("S".equals(TYPE)) {
                    this.stockService.updatePriceStatus(list);
                    retDto.put("success", msg);
                } else {
                    retDto.put("error", msg);
                }
            }
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    private Dto submitRecieveStock(Dto dto) throws Exception {
        String VBELN = (String) dto.get("VBELN");
        dto.put("VBELN", VBELN);
        Dto retDto = new BaseDto();

        List detail = (List) this.goodInfo.get(VBELN);
        List chargs = new ArrayList();
        List matnrs = new ArrayList();
        for (int i = 0; i < detail.size(); i++) {
            if (G4Utils.isNotEmpty(((Map) detail.get(i)).get("CHARG")))
                chargs.add((String) ((Map) detail.get(i)).get("CHARG"));
            else {
                matnrs.add((String) ((Map) detail.get(i)).get("MATNR"));
            }
        }

        dto.put("chargs", chargs);
        dto.put("matnrs", matnrs);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

        List list = this.g4Reader.queryForList(
                "stocksystem.getReceiveGoodDetail", dto);

        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("werks", dto.get("werks"));

            if (G4Utils.isNotEmpty(((Dto) list.get(i)).get("charg"))) {
                if (((Map) detail.get(i)).get("CHARG").equals(
                        ((Dto) list.get(i)).get("charg")))
                    ((Dto) list.get(i)).putAll((Map) detail.get(i));
                else {
                    for (int j = 0; j < detail.size(); j++) {
                        if (((Map) detail.get(j)).get("CHARG").equals(
                                ((Dto) list.get(i)).get("charg"))) {
                            ((Dto) list.get(j)).putAll((Map) detail.get(i));
                        }
                    }
                }

            } else if (((Map) detail.get(i)).get("MATNR").equals(
                    ((Dto) list.get(i)).get("matnr")))
                ((Dto) list.get(i)).putAll((Map) detail.get(i));
            else {
                for (int j = 0; j < detail.size(); j++) {
                    if (((Map) detail.get(j)).get("MATNR").equals(
                            ((Dto) list.get(i)).get("matnr"))) {
                        ((Dto) list.get(j)).putAll((Map) detail.get(i));
                    }
                }
            }

        }

        String rfcName = "";

        String ifLifnr = dto.getAsString("ifLifnr");

        if ("0".equals(ifLifnr))
            rfcName = "Z_RFC_STORE_28";
        else {
            rfcName = "Z_RFC_STORE_12";
        }

        Dto recieveHeaderDto = new BaseDto();
        Integer needvalified = Integer.valueOf(3);

        recieveHeaderDto.put("headReason", dto.getAsString("headReason"));
        recieveHeaderDto.put("postno", dto.getAsString("postno"));
        recieveHeaderDto.put("posttype", dto.getAsString("postType"));
        recieveHeaderDto.put("goodtype", dto.getAsString("goodType"));
        recieveHeaderDto.put("datum", dto.getAsString("datum"));
        recieveHeaderDto.put("recievedate", G4Utils
                .getCurrentTime("yyyy-MM-dd"));
        recieveHeaderDto.put("headexplain", dto.get("headexplain"));
        recieveHeaderDto.put("werks", dto.get("werks"));

        String maxId = "RD" + dto.getAsString("werks")
                + G4Utils.getCurrentTime("yyyyMMdd");
        String maxrecieveid = "";
        String maxorderid = (String) this.g4Dao.queryForObject(
                "stocksystem.getmaxstoreid", maxId);
        if ((maxorderid == null) || ("".equals(maxorderid))) {
            maxId = maxId + "001";
        } else {
            String maxid = maxorderid.substring(maxorderid.length() - 3,
                    maxorderid.length());
            Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
            maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
            String pattern = "000";
            DecimalFormat df = new DecimalFormat(pattern);
            maxid = df.format(maxNumber);
            maxId = maxId + maxid;
        }
        recieveHeaderDto.put("id", maxId);

        String vbeln = dto.getAsString("VBELN");

        SapTransfer transferservice = new SapTransferImpl();
        TransferInfo transferInfo = new TransferInfo();
        transferInfo.getImportPara().getParameters().put("FLAG1", "A");

        AigTransferTable table = transferInfo.getTable("IT_MVT");

        for (int i = 0; i < list.size(); i++) {
            Dto item = (Dto) list.get(i);
            item.put("id", maxId);
            item.put("choiceorderid", item.get("ZNUM"));
            item.put("menge", item.get("MENGE"));
            item.put("vkorg", item.get("VKORG"));
            item.put("vtweg", item.get("VTWEG"));
            item.put("kbetr", item.get("KBETR"));
            item.put("datab", item.get("DATAB"));
            item.put("datbi", item.get("DATBI"));
            item.put("kbstat", item.get("KBSTAT"));

            item.put("lgort", "0002");
            item.put("lgortto", "0002");
            item.put("werks", dto.get("werks"));

            table.setValue("MATNR", item.get("MATNR"));
            table.setValue("MENGE", item.get("MENGE"));
            table.setValue("CHARG", item.get("CHARG"));
            table.setValue("WERKS", dto.get("werks"));

            table.setValue("LGORT", "0002");
            table.setValue("EBELN", item.get("EBELN"));
            table.setValue("EBELP", item.get("EBELP"));
            table.setValue("VBELN", vbeln);
            recieveHeaderDto.put("vbeln", vbeln);
            recieveHeaderDto.put("ebeln", item.get("EBELN"));
            table.appendRow();
        }
        transferInfo.appendTable(table);

        AigTransferInfo outinfo = transferservice.transferInfoAig(rfcName,
                transferInfo);
        Map regMap = outinfo.getAigStructure("RETURN");
        String I_MBLNR = (String) outinfo.getParameters("I_MBLNR");
        String I_MJAHR = (String) outinfo.getParameters("I_MJAHR");

        recieveHeaderDto.put("meterialdocument", I_MBLNR);
        recieveHeaderDto.put("annualvouchers", I_MJAHR);

        recieveHeaderDto.put("needvalified", needvalified);

        System.out.println(regMap.get("TYPE"));
        System.out.println(regMap.get("MESSAGE"));

        retDto.put("TYPE", regMap.get("TYPE"));
        retDto.put("MESSAGE", regMap.get("MESSAGE"));
        if ("S".equals(regMap.get("TYPE"))) {
            try {
                this.stockService.insertRecieveGoodInfo(recieveHeaderDto, list);
            } catch (Exception e) {
                log.error(e.getMessage());
                e.printStackTrace();
            }
            try {
                rfcName = "Z_RFC_STORE_31";
                transferservice = new SapTransferImpl();
                transferInfo = new TransferInfo();
                table = transferInfo.getTable("IT_ZTLSJZ");

                for (int i = 0; i < list.size(); i++) {
                    Dto item = (Dto) list.get(i);
                    if ("0001".equals(item.getAsString("lgort"))) {
                        table.setValue("MATNR", item.get("matnr"));
                        table.setValue("CHARG", item.get("charg"));
                        table.setValue("KUNRE", item.get("werks"));
                        table.appendRow();
                    }
                }
                transferInfo.appendTable(table);
                outinfo = transferservice
                        .transferInfoAig(rfcName, transferInfo);
                ArrayList regMap2 = outinfo.getAigTable("IT_RETURN");
                String TYPE = (String) ((HashMap) regMap2.get(0)).get("TYPE");
                String msg = (String) ((HashMap) regMap2.get(0)).get("MESSAGE");
                System.out.println(((HashMap) regMap2.get(0)).get("TYPE"));
                System.out.println(((HashMap) regMap2.get(0)).get("MESSAGE"));
                if ("S".equals(TYPE))
                    this.stockService.updatePriceStatus(list);
            } catch (Exception e) {
                retDto.put("error", e.getMessage());
                e.printStackTrace();
            }

        }

        return retDto;
    }

    public ActionForward submitInstockHeadReason(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));

            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);
                String msg = "";
                msg = msg + submitInStockForHeadReason(itemDto) + "<br/>";

                retDto.put("success", msg);
            }
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitHeaderManageResult(ActionMapping mapping,
                                                  ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            AigTransferTable table = transferInfo.getTable("IT_ITAB");
            List moveList = new ArrayList();

            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);

                List detailDto = this.g4Dao.queryForList(
                        "stocksystem.getRecievedGoodDetail", itemDto);

                if (itemDto.getAsString("headmanageresult").startsWith("1.")) {
                    for (int j = 0; j < detailDto.size(); j++) {
                        Dto item = (Dto) detailDto.get(j);

                        String lgortto = null;
                        if ("A".equals(item.get("goodtype")))
                            lgortto = "0001";
                        else if ("G".equals(item.get("goodtype")))
                            lgortto = "0014";
                        else if ("H".equals(item.get("goodtype"))) {
                            lgortto = "0012";
                        }
                        item.put("lgortto", lgortto);

                        moveList.add(item);

                        table.setValue("MATNR", item.get("matnr"));
                        table.setValue("MENGE", item.get("menge"));
                        table.setValue("LGORT", item.get("lgort"));
                        table.setValue("BATCH", item.get("charg"));
                        table.setValue("UMLGO", lgortto);
                        table.setValue("WERKS", item.get("werks"));
                        table.setValue("UMWRK", item.get("werks"));
                        table.appendRow();
                    }
                }

                this.g4Dao.update("stocksystem.submitHeaderManageResult",
                        itemDto);
            }

            transferInfo.appendTable(table);

            if (moveList.size() > 0) {
                AigTransferInfo outinfo = transferservice.transferInfoAig(
                        "Z_RFC_STORE_15", transferInfo);
                Map retResult = outinfo.getAigStructure("GT_STORE_15");
                System.out.println(retResult.get("TYPE"));
                String msg = (String) retResult.get("MESSAGE");
                System.out.println(retResult.get("MESSAGE"));
                System.out.println(retResult.get("MBLNR"));
                System.out.println(retResult.get("MJAHR"));

                if ("S".equals(retResult.get("TYPE"))) {
                    this.stockService.moveLgortForHeadResult(moveList);
                    retDto.put("success", msg + "，生成凭证号："
                            + retResult.get("MBLNR"));
                } else {
                    retDto.put("error", msg);
                }

            }

            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitItemsManageResult(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));

            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);
            }

            this.stockService.submitItemsManageResult(dto, items);
            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitOutStockHeadManage(ActionMapping mapping,
                                                  ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));

            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);
                this.g4Dao.update("stocksystem.submitOutStockHeadManage",
                        itemDto);
            }

            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitInStockHeadManageResult(ActionMapping mapping,
                                                       ActionForm form, HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));

            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);
            }

            retDto = this.stockService.submitInStockHeadManageResult(items);
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitOutStockItemManage(ActionMapping mapping,
                                                  ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        String werks = null;
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            Dto headDto = JsonHelper.parseSingleJson2Dto(dto.getAsString(
                    "chargheader").indexOf("\r\n") != -1 ? dto.getAsString(
                    "chargheader").replaceAll("\r\n", "<br />") : dto
                    .getAsString("chargheader").replaceAll("\n", "<br/>"));
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));
            headDto.put("status", Integer.valueOf(8));
            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);
            }
            this.stockService.submitOutStockItemManage(headDto, items);

            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitInStockItemManageResult(ActionMapping mapping,
                                                       ActionForm form, HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        String werks = null;
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            Dto headDto = JsonHelper.parseSingleJson2Dto(dto.getAsString(
                    "chargheader").indexOf("\r\n") != -1 ? dto.getAsString(
                    "chargheader").replaceAll("\r\n", "<br />") : dto
                    .getAsString("chargheader").replaceAll("\n", "<br/>"));
            List items = JsonHelper.parseJson2List(dto.getAsString("chargitem")
                    .indexOf("\r\n") != -1 ? dto.getAsString("chargitem")
                    .replaceAll("\r\n", "<br/>") : dto.getAsString("chargitem")
                    .replaceAll("\n", "<br/>"));

            for (int i = 0; i < items.size(); i++) {
                Dto itemDto = (Dto) items.get(i);
                itemDto.put("werks", werks);
            }
            headDto.put("status", Integer.valueOf(10));

            this.stockService.submitInStockItemManageResult(headDto, items);
            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getWerksInfo(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List werksInfo = this.g4Dao.queryForList("stocksystem.getWerksInfo2");
        Dto balankDto = new BaseDto();
        balankDto.put("werks", "");
        balankDto.put("detail", "请选择...");
        werksInfo.add(0, balankDto);
        String retStr = JsonHelper.encodeObject2Json(werksInfo);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getAreaInfo(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List werksInfo = this.g4Dao.queryForList("stocksystem.getAreaInfo");
        Dto balankDto = new BaseDto();
        balankDto.put("vkbur", "");
        balankDto.put("detail", "全部");
        werksInfo.add(0, balankDto);
        String retStr = JsonHelper.encodeObject2Json(werksInfo);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitNoPriceOutStock(ActionMapping mapping,
                                               ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            String werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
            List orderItem = JsonHelper.parseJson2List(dto
                    .getAsString("orderitem"));
            Dto headDto = JsonHelper.parseSingleJson2Dto(dto
                    .getAsString("orderhead"));
            dto.put("werks", werks);

            headDto.put("werks", "WJZC");
            headDto.put("lgortfrom", werks);
            headDto.put("lgortto", headDto.get("inwerk"));
            if (G4Utils.isNotEmpty(headDto.get("id"))) {
                this.stockService.updateNoPriceOutStock(headDto, orderItem);
                retDto.put("success", headDto.getAsString("id") + "更新成功");
            } else {
                String maxId = "ML" + dto.getAsString("werks")
                        + G4Utils.getCurrentTime("yyyyMMdd");
                headDto.put("id", getMaxMoveLgortId(maxId));

                this.stockService.submitNoPriceOutStock(headDto, orderItem);
                retDto
                        .put("success", "创建成功，调拨单号为："
                                + headDto.getAsString("id"));
            }
        } catch (Exception e) {
            retDto.put("error", "创建失败，出现错误：" + e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    private String getMaxMoveLgortId(String maxId) {
        String maxrecieveid = "";
        String maxorderid = (String) this.g4Dao.queryForObject(
                "stocksystem.getMaxMoveLgortId", maxId);
        if ((maxorderid == null) || ("".equals(maxorderid))) {
            maxId = maxId + "001";
        } else {
            String maxid = maxorderid.substring(maxorderid.length() - 3,
                    maxorderid.length());
            Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
            maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
            String pattern = "000";
            DecimalFormat df = new DecimalFormat(pattern);
            maxid = df.format(maxNumber);
            maxId = maxId + maxid;
        }
        return maxId;
    }

    private String submitInStockForHeadReason(Dto dto) throws Exception {
        String msg = "";
        try {
            dto.put("lgort", "0002");
            dto.put("status", "5");

            List chargitems = this.g4Reader.queryForList(
                    "stocksystem.getInStockDetail", dto);

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();

            AigTransferTable table = transferInfo.getTable("IT_ITAB");

            for (int i = 0; i < chargitems.size(); i++) {
                table.setValue("MATNR", ((Dto) chargitems.get(i)).get("matnr"));
                table.setValue("MENGE", ((Dto) chargitems.get(i))
                        .get("goodscount"));
                table.setValue("BATCH", ((Dto) chargitems.get(i)).get("charg"));

                table.setValue("UMLGO", "0002");
                table.appendRow();
            }
            transferInfo.appendTable(table);

            transferInfo.getImportPara().getParameters().put("I_MBLNR",
                    dto.get("i_mblnr"));
            transferInfo.getImportPara().getParameters().put("I_MJAHR",
                    dto.get("i_mjahr"));

            AigTransferInfo outinfo = transferservice.transferInfoAig(
                    "Z_RFC_STORE_17", transferInfo);
            Map regMap = outinfo.getAigStructure("GT_STORE_17");
            String MBLNR = (String) regMap.get("MBLNR");
            String MJAHR = (String) regMap.get("MJAHR");

            dto.put("mblnr", MBLNR);
            dto.put("mjahr", MJAHR);
            dto.put("recievetime", G4Utils.getCurrentTime("yyyy-MM-dd"));
            System.out.println(regMap.get("TYPE"));
            System.out.println(regMap.get("MESSAGE"));
            msg = (String) regMap.get("MESSAGE") + "<br/>物料凭证号：" + MBLNR;

            if ("S".equals(regMap.get("TYPE")))
                try {
                    this.stockService.instock(dto, chargitems);
                } catch (Exception e) {
                    e.printStackTrace();
                }
        } catch (Exception e) {
            log.debug(e.getMessage());
            msg = e.getMessage();
            e.printStackTrace();
        }
        return msg;
    }

    public ActionForward unfreezePrice(ActionMapping mapping, ActionForm form,
                                       HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            try {
                werks = super.getSessionContainer(request).getUserInfo()
                        .getCustomId();
            } catch (Exception e) {

                e.printStackTrace();
                return mapping.findForward(null);
            }

            List orderItem = JsonHelper.parseJson2List(dto.getAsString("info"));

            String rfcName = "Z_RFC_STORE_31";

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            AigTransferTable table = transferInfo.getTable("IT_ZTLSJZ");
            for (int j = 0; j < orderItem.size(); j++) {
                Dto item = (Dto) orderItem.get(j);
                item.put("werks", werks);
                table.setValue("MATNR", item.get("matnr"));
                table.setValue("CHARG", item.get("charg"));
                table.setValue("KBETR", item.get("kbetr"));
                table.setValue("KUNRE", werks);
                table.appendRow();
            }
            transferInfo.appendTable(table);
            AigTransferInfo outinfo = transferservice.transferInfoAig(rfcName,
                    transferInfo);
            ArrayList retData = outinfo.getAigTable("IT_RETURN");
            String TYPE = (String) ((HashMap) retData.get(0)).get("TYPE");
            String msg = (String) ((HashMap) retData.get(0)).get("MESSAGE");
            System.out.println(((HashMap) retData.get(0)).get("TYPE"));
            System.out.println(((HashMap) retData.get(0)).get("MESSAGE"));
            if ("S".equals(TYPE)) {
                this.stockService.updatePriceStatus(orderItem);
                retDto.put("success", msg);
            } else {
                retDto.put("error", msg);
            }
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitStockTakingTime(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto paraDto = aForm.getParamAsDto(request);
        Dto dto = new BaseDto();
        Dto retDto = new BaseDto();
        try {
//			String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
            retDto.put("werks", super.getSessionContainer(request).getUserInfo().getCustomId());
            paraDto.put("werks", super.getSessionContainer(request).getUserInfo().getCustomId());
            dto.put("werks", super.getSessionContainer(request).getUserInfo().getCustomId());

            String maxId = (String) this.g4Dao.queryForObject("stocksystem.getMaxStockTakingId", paraDto);

            dto.put("id", maxId);
            dto.put("starttime", G4Utils.getCurrentTime("yyyy-MM-dd"));
            this.g4Dao.insert("stocksystem.insertStockTakingHead", dto);
            retDto.put("success", "生成盘点单号：" + maxId);
            retDto.put("id", maxId);
            //插入数据时先禁用索引，以加快速度。
            this.g4Dao.update("stocksystem.alertStockTakingDetailIndexDisable");
            this.g4Dao.insert("stocksystem.copyStockToStockTakingDetail", dto);
            this.g4Dao.update("stocksystem.alertStockTakingDetailIndexEnable");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitStockTakingTimeForZP(ActionMapping mapping,
                                                    ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            try {
                String werks = super.getSessionContainer(request).getUserInfo()
                        .getCustomId();
                retDto.put("werks", werks);
            } catch (Exception e) {
                e.printStackTrace();
                return mapping.findForward(null);
            }

            String maxId = "ZD" + werks + dto.getAsString("date").substring(2);

            String maxrecieveid = "";
            String maxorderid = (String) this.g4Dao.queryForObject(
                    "stocksystem.getmaxstockTakingForZPid", maxId);
            if ((maxorderid == null) || ("".equals(maxorderid))) {
                maxId = maxId + "01";
            } else {
                String maxid = maxorderid.substring(maxorderid.length() - 2,
                        maxorderid.length());
                Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
                maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
                String pattern = "00";
                DecimalFormat df = new DecimalFormat(pattern);
                maxid = df.format(maxNumber);
                maxId = maxId + maxid;
            }
            dto.put("id", maxId);
            dto.put("werks", werks);
            dto.put("starttime", G4Utils.getCurrentTime("yyyy-MM-dd"));
            this.g4Dao.insert("stocksystem.insertStockTakingForZPHead", dto);
            retDto.put("success", "生成盘点单号：" + maxId);
            retDto.put("id", maxId);

            this.g4Dao.insert("stocksystem.copyStockToStockTakingForZPDetail",
                    dto);
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitStockTakingTimeForWJZ(ActionMapping mapping,
                                                     ActionForm form, HttpServletRequest request,
                                                     HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            try {
                String werks = super.getSessionContainer(request).getUserInfo()
                        .getCustomId();
                retDto.put("werks", werks);
            } catch (Exception e) {
                e.printStackTrace();
                return mapping.findForward(null);
            }

            String maxId = "WD" + werks + dto.getAsString("date").substring(2);

            String maxrecieveid = "";
            String maxorderid = (String) this.g4Dao.queryForObject(
                    "stocksystem.getmaxstockTakingForWJZid", maxId);
            if ((maxorderid == null) || ("".equals(maxorderid))) {
                maxId = maxId + "01";
            } else {
                String maxid = maxorderid.substring(maxorderid.length() - 2,
                        maxorderid.length());
                Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
                maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
                String pattern = "00";
                DecimalFormat df = new DecimalFormat(pattern);
                maxid = df.format(maxNumber);
                maxId = maxId + maxid;
            }
            dto.put("id", maxId);
            dto.put("werks", werks);
            dto.put("starttime", G4Utils.getCurrentTime("yyyy-MM-dd"));
            this.g4Dao.insert("stocksystem.insertStockTakingForWJZHead", dto);
            retDto.put("success", "生成盘点单号：" + maxId);
            retDto.put("id", maxId);

            this.g4Dao.insert("stocksystem.copyStockToStockTakingForWJZDetail",
                    dto);
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getMyWerks(ActionMapping mapping, ActionForm form,
                                    HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        retDto.put("werks", werks);
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getStockTakingId(ActionMapping mapping,
                                          ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List data = this.g4Dao
                .queryForList("stocksystem.getStockTakingId", dto);

        String retStr = JsonHelper.encodeObject2Json(data);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getStockTakingForZPId(ActionMapping mapping,
                                               ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List data = this.g4Dao.queryForList(
                "stocksystem.getStockTakingForZPId", dto);

        String retStr = JsonHelper.encodeObject2Json(data);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getStockTakingForWJZId(ActionMapping mapping,
                                                ActionForm form, HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List data = this.g4Dao.queryForList(
                "stocksystem.getStockTakingForWJZId", dto);

        String retStr = JsonHelper.encodeObject2Json(data);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getGiftList(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        List data = this.g4Dao.queryForPage("stocksystem.getGiftList", dto);

        Integer count = (Integer) this.g4Dao.queryForObject(
                "stocksystem.getGiftListCount", dto);

        String retStr = JsonHelper.encodeList2PageJson(data, count,
                "yyyy-MM-dd");
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getMatnrList(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        List data = this.g4Dao.queryForPage("stocksystem.getMatnrList", dto);

        Integer count = (Integer) this.g4Dao.queryForObject(
                "stocksystem.getMatnrListCount", dto);

        String retStr = JsonHelper.encodeList2PageJson(data, count,
                "yyyy-MM-dd");
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getStockTakingInfo(ActionMapping mapping,
                                            ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        } catch (Exception e) {
            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        List list = this.g4Dao.queryForList("stocksystem.getStockTakingInfo", dto);

        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("goldTypeStr", getGoldTypeStr(((Dto) list.get(i)).getAsString("zjlbm")));
            ((Dto) list.get(i)).put("toneTypeStr", getToneTypeStr(((Dto) list.get(i)).getAsString("zslbm")));
            ((Dto) list.get(i)).put("toneNeatNessStr", getToneNeatNessStr(((Dto) list.get(i)).getAsString("labor")));
            ((Dto) list.get(i)).put("toneColorStr", getToneColorStr(((Dto) list.get(i)).getAsString("zslys")));
            ((Dto) list.get(i)).put("lgortStr", getLgortStr((Dto) list.get(i)));
        }

        this.lgortMap = null;
        String retStr = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd");
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getStockTakingForZPInfo(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        List list = this.g4Dao.queryForList(
                "stocksystem.getStockTakingForZPInfo", dto);

        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("lgortStr", getLgortStr((Dto) list.get(i)));
        }

        this.lgortMap = null;
        String retStr = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd");
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getStockTakingForWJZInfo(ActionMapping mapping,
                                                  ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        } catch (Exception e) {
            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", "WJZC");
        List list = this.g4Dao.queryForList(
                "stocksystem.getStockTakingForWJZInfo", dto);

        for (int i = 0; i < list.size(); i++) {
            ((Dto) list.get(i)).put("lgortStr", getLgortStr((Dto) list.get(i)));
        }

        this.lgortMap = null;
        String retStr = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd");
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitStockTakingInfo(ActionMapping mapping,
                                               ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        String charg = dto.getAsString("charg");
        String matnr = dto.getAsString("matnr");
        String lgort = dto.getAsString("lgort");
        try {
            this.g4Dao.update("stocksystem.submitStockTakingInfo", dto);
            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward delStockTakingInfo(ActionMapping mapping,
                                            ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            log.debug(e.getMessage());
            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        try {
            this.g4Dao.update("stocksystem.delStockTakingInfo", dto);
            this.g4Dao.update("stocksystem.delStockTakingDetail", dto);
            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward delStockTakingInfoFroZP(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            log.debug(e.getMessage());
            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        try {
            this.g4Dao.update("stocksystem.delStockTakingInfoFroZP", dto);
            this.g4Dao.update("stocksystem.delStockTakingInfoFroZPDetail", dto);
            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward delStockTakingInfoFroWJZ(ActionMapping mapping,
                                                  ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            log.debug(e.getMessage());
            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        try {
            this.g4Dao.update("stocksystem.delStockTakingInfoFroWJZ", dto);
            this.g4Dao
                    .update("stocksystem.delStockTakingInfoFroWJZDetail", dto);
            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward submitStockTakingFroZPInfo(ActionMapping mapping,
                                                    ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        String charg = dto.getAsString("charg");
        String matnr = dto.getAsString("matnr");
        String lgort = dto.getAsString("lgort");
        String realcount = dto.getAsString("realcount");
        try {
            this.g4Dao.update("stocksystem.submitStockTakingFroZPInfo", dto);
            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward submitStockTakingFroWJZInfo(ActionMapping mapping,
                                                     ActionForm form, HttpServletRequest request,
                                                     HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);

        String charg = dto.getAsString("charg");
        String matnr = dto.getAsString("matnr");
        String lgort = dto.getAsString("lgort");
        String realcount = dto.getAsString("realcount");
        try {
            this.g4Dao.update("stocksystem.submitStockTakingFroWJZInfo", dto);
            retDto.put("success", "提交成功！");
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward submitjoininrejto1000(ActionMapping mapping,
                                               ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }
        try {

            dto.put("werks", werks);
            List items = JsonHelper
                    .parseJson2List(dto.getAsString("chargitem"));
            String type = dto.getAsString("type");
            String mytype = null;
            if (!"1".equals(type)) {
                mytype = "X";
            }
            Dto headDto = new BaseDto();

            String maxId = werks + G4Utils.getCurrentTime("yyMM");

            String maxrecieveid = "";
            String maxorderid = (String) this.g4Dao.queryForObject(
                    "stocksystem.getMaxJoininRejId", maxId);
            if ((maxorderid == null) || ("".equals(maxorderid))) {
                maxId = maxId + "01";
            } else {
                String maxid = maxorderid.substring(maxorderid.length() - 2,
                        maxorderid.length());
                Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
                maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
                String pattern = "00";
                DecimalFormat df = new DecimalFormat(pattern);
                maxid = df.format(maxNumber);
                maxId = maxId + maxid;
            }

            headDto.put("id", maxId);
            headDto.put("werks", werks);

            String currentTime = G4Utils.getCurrentTime("yyyy-MM-dd hh:mm:ss");

            headDto.put("datetime", currentTime);

            String rfcName = "Z_RFC_STORE_33";

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            AigTransferTable table = transferInfo.getTable("IT_ZTJMMX");
            for (int j = 0; j < items.size(); j++) {
                Dto item = (Dto) items.get(j);
                item.put("werks", werks);
                table.setValue("ZTHDH", maxId);
                table.setValue("POSNR", item.getAsString("lineid"));
                table.setValue("MATNR", item.get("matnr"));
                table.setValue("CHARG", item.get("charg"));
                table.setValue("ZTHSJ", G4Utils.getCurrentTime("hh:mm:ss"));
                table.setValue("ZTHYQ", G4Utils.getCurrentTime("yyyy-MM-dd"));
                table.setValue("WERKS", werks);
                table.setValue("KWMENG", item.get("count"));
                table.setValue("HPZL", item.get("hpzl"));
                table.setValue("ZHTH", mytype);
                table.appendRow();
            }
            transferInfo.appendTable(table);
            AigTransferInfo outinfo = transferservice.transferInfoAig(rfcName,
                    transferInfo);
            Map retData = outinfo.getAigStructure("RETURN");
            String TYPE = (String) retData.get("TYPE");
            String msg = (String) retData.get("MESSAGE");
            System.out.println(retData.get("TYPE"));
            System.out.println(retData.get("MESSAGE"));
            if ("S".equals(TYPE)) {
                //this.stockService.saveJoininRej(headDto, items);
                retDto.put("success", msg);
            } else {
                retDto.put("error", msg);
            }
        } catch (Exception e) {
            log.debug(e.getMessage());
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto, "yyyy-MM-dd");
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward nopricestockinfo(ActionMapping mapping,
                                          ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        List items = this.g4Dao.queryForPage("stocksystem.nopricestockinfo",
                dto);
        Integer page = (Integer) this.g4Dao.queryForObject(
                "stocksystem.nopricestockinfoPage", dto);
        String retStr = JsonHelper.encodeList2PageJson(items, page,
                "yyyy-MM-dd");
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getChargLgortInfo(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        List items = this.g4Dao.queryForList("stocksystem.getChargLgortInfo",
                dto);
        String retStr = JsonHelper.encodeObject2Json(items);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getMatnrLgortInfoForZP(ActionMapping mapping,
                                                ActionForm form, HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        List items = this.g4Dao.queryForList("stocksystem.getMatnrLgortInfo",
                dto);
        String retStr = JsonHelper.encodeObject2Json(items);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getMatnrLgortInfoForWJZ(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", "WJZC");
        List items = this.g4Dao.queryForList(
                "stocksystem.getMatnrLgortInfoForWJZ", dto);
        String retStr = JsonHelper.encodeObject2Json(items);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward submitStockTakedInfo(ActionMapping mapping,
                                              ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            log.debug(e.getMessage());
            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        try {
            List paraList = this.g4Dao.queryForList(
                    "stocksystem.getStockListForTranSAP", dto);

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            AigTransferTable table = transferInfo.getTable("IT_ZTMDPD");
            int num = 10;
            for (int i = 0; i < paraList.size(); i++) {
                Dto item = (Dto) paraList.get(i);
                if (G4Utils.isEmpty(item.getAsString("iftaking"))) {
                    item.put("remark", "终端未盘");
                }
                if ((G4Utils.isNotEmpty(item.getAsString("iftaking")))
                        && (Double.parseDouble(item.getAsString("labst")) == 0.0D)
                        && (G4Utils.isEmpty(item.get("remark")))) {
                    item.put("remark", "盘盈");
                }

                if ("G".equals(item.getAsString("meins"))) {
                    if (Double.parseDouble(item.getAsString("labst")) > 0.0D)
                        item.put("count", Integer.valueOf(1));
                    else
                        item.put("count", Integer.valueOf(0));
                } else {
                    item.put("count", item.getAsString("labst"));
                }
                table.setValue("WERKS", item.get("werks"));
                table.setValue("MATNR", item.get("matnr"));
                table.setValue("CHARG", item.get("charg"));
                table.setValue("ZPDDH", item.get("id"));
                table.setValue("ZPDYQ", item.get("starttime"));
                table.setValue("NAME1", item.get("name1"));
                table.setValue("ZITEM", Integer.valueOf(num));
                table.setValue("ZPDBS", "1");
                table.setValue("LGORT", item.get("lgort"));
                table.setValue("MAKTX", item.get("maktx"));
                table.setValue("ZJS",
                        item.getAsString("count").indexOf(".") != -1 ? item
                                .getAsString("count").substring(0,
                                        item.getAsString("count").indexOf("."))
                                : item.get("count") == null ? "0" : item
                                .getAsString("count"));
                table.setValue("HPZL", item.get("hpzl"));
                table.setValue("KBETR", item.get("bqj"));
                table.setValue("ZSZSB", item.get("zszsb"));
                table.setValue("ZSZSB1", item.get("zszsb1"));
                table.setValue("ZJLBM", item.get("zjlbm"));
                table.setValue("ZCLZL", item.get("zclzl"));
                table.setValue("ZSLBM", item.get("zslbm"));
                table.setValue("ZDSZN", item.get("zzlnn"));
                table.setValue("ZSLYS", item.get("zslys"));
                table.setValue("LABOR", item.get("labor"));
                table.setValue("ZTEXT", item.get("remark"));
                table.setValue("ZTYPE", item.get("difftype"));

                table.appendRow();
                num += 10;
            }

            transferInfo.appendTable(table);
            AigTransferInfo outinfo = transferservice.transferInfoAig(
                    "Z_RFC_STORE_38", transferInfo);
            Map regMap = outinfo.getAigStructure("IT_RETURN");
            String TYPE = (String) regMap.get("TYPE");
            String msg = (String) regMap.get("MESSAGE");
            System.out.println(regMap.get("TYPE"));
            System.out.println(regMap.get("MESSAGE"));

            if ("S".equals(TYPE)) {
                this.g4Dao.update("stocksystem.submitStockTakedInfo", dto);
                retDto.put("success", msg);
            } else {
                retDto.put("error", msg);
            }
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward submitStockTakedInfoForMatnr(ActionMapping mapping,
                                                      ActionForm form, HttpServletRequest request,
                                                      HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            log.debug(e.getMessage());
            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        try {
            List paraList = this.g4Dao.queryForList(
                    "stocksystem.getStockListForZPTranSAP", dto);

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            AigTransferTable table = transferInfo.getTable("IT_ZTMDPD");
            int num = 10;
            for (int i = 0; i < paraList.size(); i++) {
                Dto item = (Dto) paraList.get(i);
                if (G4Utils.isEmpty(item.getAsString("iftaking"))) {
                    item.put("remark", "终端未盘");
                }
                if ("G".equals(item.getAsString("meins"))) {
                    if (Double.parseDouble(item.getAsString("labst")) > 0.0D)
                        item.put("count", Integer.valueOf(1));
                    else
                        item.put("count", Integer.valueOf(0));
                } else {
                    item.put("count", item.getAsString("labst"));
                }
                table.setValue("WERKS", item.get("werks"));
                table.setValue("MATNR", item.get("matnr"));
                table.setValue("CHARG", item.get("charg"));
                table.setValue("ZPDDH", item.get("id"));
                table.setValue("ZPDYQ", item.get("starttime"));
                table.setValue("NAME1", item.get("name1"));
                table.setValue("ZITEM", Integer.valueOf(num));
                table.setValue("ZPDBS", "2");
                table.setValue("LGORT", item.get("lgort"));
                table.setValue("MAKTX", item.get("maktx"));
                table.setValue("ZJS",
                        item.getAsString("count").indexOf(".") != -1 ? item
                                .getAsString("count").substring(0,
                                        item.getAsString("count").indexOf("."))
                                : item.get("count") == null ? "0" : item
                                .getAsString("count"));
                table.setValue("ZSPS", item.getAsString("realitycount")
                        .indexOf(".") != -1 ? item.getAsString("realitycount")
                        .substring(0,
                                item.getAsString("realitycount").indexOf("."))
                        : item.get("realitycount") == null ? "0" : item
                        .getAsString("realitycount"));
                table.setValue("HPZL", item.get("hpzl"));
                table.setValue("KBETR", item.get("bqj"));
                table.setValue("ZSZSB", item.get("zszsb"));
                table.setValue("ZSZSB1", item.get("zszsb1"));
                table.setValue("ZJLBM", item.get("zjlbm"));
                table.setValue("ZCLZL", item.get("zclzl"));
                table.setValue("ZSLBM", item.get("zslbm"));
                table.setValue("ZDSZN", item.get("zzlnn"));
                table.setValue("ZSLYS", item.get("zslys"));
                table.setValue("LABOR", item.get("labor"));
                table.setValue("ZTEXT", item.get("remark"));

                table.appendRow();
                num += 10;
            }

            transferInfo.appendTable(table);
            AigTransferInfo outinfo = transferservice.transferInfoAig(
                    "Z_RFC_STORE_38", transferInfo);
            Map regMap = outinfo.getAigStructure("IT_RETURN");
            String TYPE = (String) regMap.get("TYPE");
            String msg = (String) regMap.get("MESSAGE");
            System.out.println(regMap.get("TYPE"));
            System.out.println(regMap.get("MESSAGE"));

            if ("S".equals(TYPE)) {
                this.g4Dao.update("stocksystem.submitStockTakedForZPInfo", dto);
                retDto.put("success", msg);
            } else {
                retDto.put("error", msg);
            }
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward submitStockTakedInfoForWJZ(ActionMapping mapping,
                                                    ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            log.debug(e.getMessage());
            e.printStackTrace();
            return mapping.findForward(null);
        }

        dto.put("werks", werks);
        try {
            List paraList = this.g4Dao.queryForList(
                    "stocksystem.getStockListForWJZTranSAP", dto);

            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            AigTransferTable table = transferInfo.getTable("IT_ZTMDPD");
            int num = 10;
            for (int i = 0; i < paraList.size(); i++) {
                Dto item = (Dto) paraList.get(i);
                if (G4Utils.isEmpty(item.getAsString("iftaking"))) {
                    item.put("remark", "终端未盘");
                }
                if ("G".equals(item.getAsString("meins"))) {
                    if (Double.parseDouble(item.getAsString("labst")) > 0.0D)
                        item.put("count", Integer.valueOf(1));
                    else
                        item.put("count", Integer.valueOf(0));
                } else {
                    item.put("count", item.getAsString("labst"));
                }
                table.setValue("WERKS", item.get("werks"));
                table.setValue("MATNR", item.get("matnr"));
                table.setValue("CHARG", item.get("charg"));
                table.setValue("ZPDDH", item.get("id"));
                table.setValue("ZPDYQ", item.get("starttime"));
                table.setValue("NAME1", item.get("name1"));
                table.setValue("ZITEM", Integer.valueOf(num));
                table.setValue("ZPDBS", "2");
                table.setValue("LGORT", item.get("lgort"));
                table.setValue("MAKTX", item.get("maktx"));
                table.setValue("ZJS",
                        item.getAsString("count").indexOf(".") != -1 ? item
                                .getAsString("count").substring(0,
                                        item.getAsString("count").indexOf("."))
                                : item.get("count") == null ? "0" : item
                                .getAsString("count"));
                table.setValue("ZSPS", item.getAsString("realitycount")
                        .indexOf(".") != -1 ? item.getAsString("realitycount")
                        .substring(0,
                                item.getAsString("realitycount").indexOf("."))
                        : item.get("realitycount") == null ? "0" : item
                        .getAsString("realitycount"));
                table.setValue("HPZL", item.get("hpzl"));
                table.setValue("KBETR", item.get("bqj"));
                table.setValue("ZSZSB", item.get("zszsb"));
                table.setValue("ZSZSB1", item.get("zszsb1"));
                table.setValue("ZJLBM", item.get("zjlbm"));
                table.setValue("ZCLZL", item.get("zclzl"));
                table.setValue("ZSLBM", item.get("zslbm"));
                table.setValue("ZDSZN", item.get("zzlnn"));
                table.setValue("ZSLYS", item.get("zslys"));
                table.setValue("LABOR", item.get("labor"));
                table.setValue("ZTEXT", item.get("remark"));

                table.appendRow();
                num += 10;
            }

            transferInfo.appendTable(table);
            AigTransferInfo outinfo = transferservice.transferInfoAig(
                    "Z_RFC_STORE_38", transferInfo);
            Map regMap = outinfo.getAigStructure("IT_RETURN");
            String TYPE = (String) regMap.get("TYPE");
            String msg = (String) regMap.get("MESSAGE");
            System.out.println(regMap.get("TYPE"));
            System.out.println(regMap.get("MESSAGE"));

            if ("S".equals(TYPE)) {
                this.g4Dao
                        .update("stocksystem.submitStockTakedForWJZInfo", dto);
                retDto.put("success", msg);
            } else {
                retDto.put("error", msg);
            }
        } catch (Exception e) {
            retDto.put("error", e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);

        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward exportOutStockHeaderExcel(ActionMapping mapping,
                                                   ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        Thread.sleep(2000L);
        Dto parametersDto = new BaseDto();
        parametersDto.put("reportTitle", "调出整单处理表");
        List fieldsList = (List) request.getSession().getAttribute(
                "OutStockHeader");
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter
                .setTemplatePath("/report/excel/mytemplate/OutStockHeader.xls");
        excelExporter.setData(parametersDto, fieldsList);
        excelExporter.setFilename("调出整单处理表.xls");
        excelExporter.export(request, response);

        return mapping.findForward(null);
    }

    public ActionForward exportOutStockHeaderForItemManageExcel(
            ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Thread.sleep(2000L);
        Dto parametersDto = new BaseDto();
        parametersDto.put("reportTitle", "调出单行处理表");
        List fieldsList = (List) request.getSession().getAttribute(
                "OutStockHeaderForItemManage");
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter
                .setTemplatePath("/report/excel/mytemplate/OutStockHeaderForItemManage.xls");
        excelExporter.setData(parametersDto, fieldsList);
        excelExporter.setFilename("调出单行处理表.xls");
        excelExporter.export(request, response);

        return mapping.findForward(null);
    }

    public ActionForward exportReceiveStoreHeadForValidateExcel(
            ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Thread.sleep(2000L);
        Dto parametersDto = new BaseDto();
        parametersDto.put("reportTitle", "单货品验货差异处理表");
        List fieldsList = (List) request.getSession().getAttribute(
                "ReceiveStoreHeadForValidate");
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter
                .setTemplatePath("/report/excel/mytemplate/ReceiveStoreHeadForValidate.xls");
        excelExporter.setData(parametersDto, fieldsList);
        excelExporter.setFilename("单货品验货差异处理表.xls");
        excelExporter.export(request, response);

        return mapping.findForward(null);
    }

    public ActionForward exportReceiveStoreHeadForHeadValidateExcel(
            ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Thread.sleep(2000L);
        Dto parametersDto = new BaseDto();
        parametersDto.put("reportTitle", "整单验货差异处理表");
        List fieldsList = (List) request.getSession().getAttribute(
                "ReceiveStoreHeadForHeadValidate");
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter
                .setTemplatePath("/report/excel/mytemplate/ReceiveStoreHeadForHeadValidate.xls");
        excelExporter.setData(parametersDto, fieldsList);
        excelExporter.setFilename("整单验货差异处理表.xls");
        excelExporter.export(request, response);

        return mapping.findForward(null);
    }

    public ActionForward getSealMethod(ActionMapping mapping, ActionForm form,
                                       HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        List data = this.g4Dao.queryForList("stocksystem.getSealMethod");
        String retStr = JsonHelper.encodeObject2Json(data);
        write(retStr, response);
        return mapping.findForward(null);
    }

    public ActionForward getLabelVerificationHead(ActionMapping mapping,
                                                  ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo()
                .getCustomId();
        dto.put("werks", werks);
        System.out.println(werks);
        SapTransfer transferservice = new SapTransferImpl();

        TransferInfo transferInfo = new TransferInfo();
        transferInfo.getImportPara().getParameters().put("I_WERKS", werks);
        String rfc = "Z_RFC_STORE_55";

        AigTransferInfo outinfo = transferservice.transferInfoAig(rfc,
                transferInfo);

        ArrayList l_AigTable = outinfo.getAigTable("IT_ITAB");
        ArrayList l_AigTableDetail = outinfo.getAigTable("GT_ITAB");

        this.labelVerificationInfo.clear();

        DecimalFormat df = new DecimalFormat("#.## ");

        for (int i = 0; i < l_AigTableDetail.size(); i++) {
            String ZTJDH = (String) ((HashMap) l_AigTableDetail.get(i))
                    .get("ZTJDH");
            if (this.labelVerificationInfo.containsKey(ZTJDH)) {
                ((List) this.labelVerificationInfo.get(ZTJDH))
                        .add((Map) l_AigTableDetail.get(i));
            } else {
                ArrayList good = new ArrayList();
                good.add((Map) l_AigTableDetail.get(i));
                this.labelVerificationInfo.put(ZTJDH, good);
            }
        }
        try {
            if (G4Utils.isNotEmpty(l_AigTable))
                for (int i = 0; i < l_AigTable.size(); i++) {
                    HashMap item = (HashMap) l_AigTable.get(i);
                    String postType = (String) item.get("ZYJFS");
                    String goodType = (String) item.get("ZYJLX");
                    item.put("postType", getPostTypeStr(postType));
                    item.put("goodType", getGoodTypeStr(goodType));

                    String ZTJDH = (String) item.get("ZTJDH");

                    List detailItems = (List) this.labelVerificationInfo
                            .get(ZTJDH);
                    Double totalWeight = Double.valueOf(0.0D);
                    List chargs = new ArrayList();
                    if (G4Utils.isNotEmpty(detailItems)) {
                        for (int j = 0; j < detailItems.size(); j++) {
                            Map detailItem = (Map) detailItems.get(j);
                            chargs.add(detailItem.get("CHARG"));
                            Object hpzl = this.g4Dao.queryForObject(
                                    "stocksystem.getHPZL", detailItem
                                            .get("CHARG"));
                            detailItem.put("count", Integer.valueOf(1));
                            hpzl = hpzl == null ? Integer.valueOf(0) : hpzl;
                            detailItem.put("hpzl", hpzl);
                            totalWeight = Double
                                    .valueOf(totalWeight.doubleValue()
                                            + Double.parseDouble(G4Utils
                                            .isEmpty(hpzl) ? "0" : hpzl
                                            .toString()));
                        }

                        Dto paraDto = new BaseDto();
                        paraDto.put("chargs", chargs);
                        paraDto.put("werks", werks);
                        paraDto.put("currentDate", G4Utils
                                .getCurrentTime("yyyy-MM-dd"));

                        item.put("totalmoney", item.get("DQBZJ"));
                        item.put("totalcount", item.get("LFIMG"));
                        item.put("totalweight", df.format(totalWeight));
                    }
                }
        } catch (Exception e) {
            log.debug(e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(l_AigTable, "yyyy-MM-dd");
        retStr = "{ROOT:" + retStr + "}";
        write(retStr, response);

        return mapping.findForward(null);
    }

    public ActionForward getLabelVerificationDetail(ActionMapping mapping,
                                                    ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }

        String VBELN = (String) dto.get("EBELN");
        List detail = (List) this.labelVerificationInfo.get(VBELN);
        String retStr = JsonHelper.encodeObject2Json(detail, "yyyy-MM-dd");
        retStr = "{ROOT:" + retStr + "}";
        retStr = Common.getNewString(werks, retStr);
        write(retStr, response);

        return mapping.findForward(null);
    }

    /**
     * 调价标签验收
     */
    public ActionForward submitLabelVarification(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        try {
            werks = super.getSessionContainer(request).getUserInfo()
                    .getCustomId();
        } catch (Exception e) {

            e.printStackTrace();
            return mapping.findForward(null);
        }
        try {

            String VBELN = (String) dto.get("vbeln");
            List detail = (List) this.labelVerificationInfo.get(VBELN);
            System.out.println(VBELN);
            SapTransfer transferservice = new SapTransferImpl();
            TransferInfo transferInfo = new TransferInfo();
            transferInfo.getImportPara().getParameters().put("I_ZTJDH", VBELN);

            AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE_56", transferInfo);
            ArrayList retList = outinfo.getAigTable("U_RETURN");
            String TYPE = (String) ((HashMap) retList.get(0)).get("TYPE");
            String MESSAGE = (String) ((HashMap) retList.get(0)).get("MESSAGE");
            String CODE = (String) ((HashMap) retList.get(0)).get("CODE");
            String error = "";

            if ("S".equalsIgnoreCase(TYPE)) {
                if ("01".equals(CODE)) {
                    for (int i = 0; i < detail.size(); i++) {
                        Dto item = new BaseDto();
                        item.putAll((Map) detail.get(i));
                        item.put("inwerks", werks);
                        item.put("charg", item.get("CHARG"));
                        item.put("vkorg", "1000");
                        item.put("vtweg", "10");
                        item.put("matnr", item.get("MATNR"));
                        item.put("mykbert", Double.valueOf(Double
                                .parseDouble(item.get("THLSJ").toString())));
                        item.put("datab", G4Utils.getCurrentTime("yyyy-MM-dd"));
                        item.put("datbi", "9999-12-31");
                        item.put("aedat", "0000-00-00");
                        item.put("currdate", "0000-00-00");
                        item.put("kbstat", "01");
                        try {
                            Integer con = (Integer) this.g4Dao.queryForObject("stocksystem.validateInwerksPriceForLabelVarify", item);
                            if (con.intValue() > 0) {
                                this.g4Dao.update("stocksystem.deleteInwerksPriceForLabelVarify", item);
                                this.g4Dao.update("stocksystem.insertInwerksPriceForLabelVarify", item);
                            } else {
                                this.g4Dao.update("stocksystem.insertInwerksPriceForLabelVarify", item);
                            }
                        } catch (Exception e) {
                            log.debug(e.getMessage());
                            error = error + "<br />" + e.getMessage();
                            e.printStackTrace();
                        }
                    }
                }
                if (G4Utils.isNotEmpty(error)) {
                    error = "SAP提交成功" + MESSAGE
                            + "<br /><b style='color : red;'>pos更新价格时出现错误："
                            + error + "</b>";
                    retDto.put("someerror", "失败信息： " + error);
                } else {
                    retDto.put("success", "签收成功： " + MESSAGE);
                }
            } else {
                retDto.put("error", "失败信息：<b style='color : red;'> " + MESSAGE + "</b>");
            }
        } catch (Exception e) {
            retDto.put("error", "失败信息： " + e.getMessage());
            log.debug("失败信息： " + e.getMessage());
            e.printStackTrace();
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);

        return mapping.findForward(null);
    }

    public String getEkgrpByType(int type) {
        String ekgrp = "";
        switch (type) {
            case 1:
                ekgrp = "007";
                break;
            case 2:
                ekgrp = "005";
                break;
            case 3:
                ekgrp = "006";
                break;
            case 4:
                ekgrp = "002";
                break;
            case 5:
                ekgrp = "003";
                break;
            case 6:
                ekgrp = "001";
                break;
            case 7:
                ekgrp = "004";
                break;
            case 8:
                ekgrp = "009";
                break;
            case 9:
                ekgrp = "008";
        }
        return ekgrp;
    }

    /**
     * 查询货品调拨退货初始化
     */
    public ActionForward stockTransferListInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        super.removeSessionAttribute(request, "werks");
        Dto inDto = new BaseDto();
        String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        request.setAttribute("werks", werks);
        if ("1000".equals(werks)) {
            return mapping.findForward("stockTransferExamine");
        } else {
            return mapping.findForward("stockTransferView");
        }
    }

    /**
     * 查询货品调拨退货列表
     */
    public ActionForward getStockTransferList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        if (super.getSessionContainer(request).getUserInfo() != null)
            dto.put("werks", super.getSessionContainer(request).getUserInfo().getCustomId());
        else
            return mapping.findForward("authorization");
        if (!G4Utils.isEmpty(dto.get("goodtype"))) {
            String[] goodtype = dto.get("goodtype").toString().split(",");
            dto.put("goodtype", goodtype);
        } else {
            dto.put("goodtype", null);
        }
        if (!G4Utils.isEmpty(dto.get("status"))) {
            String[] status = dto.get("status").toString().replaceAll("-1", "0").split(",");
            dto.put("status", status);
        } else {
            dto.put("status", null);
        }
        List list = this.g4Reader.queryForPage("stocksystem.getStockTransferList", dto);
        for (Object o : list) {
            Dto d = (Dto) o;
            Object obj = this.g4Reader.queryForObject("stocksystem.getStockTransferBZJ", o);
            d.put("bzj", obj);
        }
        Integer count = (Integer) this.g4Reader.queryForObject("stocksystem.getStockTransferListCount", dto);
        String retStr = JsonHelper.encodeList2PageJson(list, count, "yyyy-MM-dd");
        write(retStr, response);
        return mapping.findForward(null);
    }

    /**
     * 查询货品调拨退货订单明细
     */
    public ActionForward getStockTransferOrderDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = this.g4Reader.queryForList("stocksystem.getStockTransferOrderDetail", dto);
        String retStr = JsonHelper.encodeObject2Json(list);
        retStr = "{ROOT:" + retStr + "}";
        write(retStr, response);
        return mapping.findForward(null);
    }


    /**
     * 查询货品调拨退货订单明细(审批)
     */
    public ActionForward getStockTransferExamineDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = this.g4Reader.queryForList("stocksystem.getStockTransferExamineDetail", dto);
        String retStr = JsonHelper.encodeObject2Json(list);
        retStr = "{ROOT:" + retStr + "}";
        write(retStr, response);
        return mapping.findForward(null);
    }

    /**
     * 查询货品调拨退货订单明细(审批)导出Excel
     */
    public ActionForward exportStockTransferDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto parametersDto = new BaseDto();
        List list = this.g4Reader.queryForList("stocksystem.exportStockTransferDetail", dto);
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter.setTemplatePath("/report/excel/app/stockTransferDetailReport.xls");
        excelExporter.setData(parametersDto, list);
        excelExporter.setFilename("货品调出明细_" + dto.get("outid") + ".xls");
        excelExporter.export(request, response);
        return mapping.findForward(null);
    }

    /**
     * 查询货品调拨退货订单审批
     */
    public ActionForward examineStockTransferOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        Dto retDto = new BaseDto();
        JSONArray orderItemList = JSONArray.fromObject(dto.get("jsonItem").toString());
        String status = dto.getAsString("status");

        if ("1".equals(status) || "12".equals(status)) {
            for (int i = 0; i < orderItemList.size(); i++) {
                JSONObject orderItem = (JSONObject) orderItemList.get(i);
                Dto item = new BaseDto();

                item.put("outid", dto.get("outid"));
                item.put("charg", orderItem.get("charg"));
                item.put("ifneedprintLabel", orderItem.get("ifneedprintLabel"));
                item.put("ifneedchangPrice", orderItem.get("ifneedchangPrice"));
                item.put("outwerkssealmethod", orderItem.get("outwerkssealmethod"));
                item.put("inwerkssealmethod", orderItem.get("inwerkssealmethod"));

                try {
                    Integer con = (Integer) this.g4Dao.update("stocksystem.updateStockTransferItem", item);
                } catch (Exception e) {
                    log.debug(e.getMessage());
                    retDto.put("message", "出现错误：" + e.getMessage());
                    e.printStackTrace();
                }
            }
        }
        Integer con = (Integer) this.g4Dao.update("stocksystem.updateStockTransferHead", dto);
        retDto.put("success", "审批完成！ ");
        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);
        return mapping.findForward(null);
    }

    /**
     * 调拨退货单删除
     */
    public ActionForward deleteStockTransferOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto returnMsg = new BaseDto();
        String jsonString = "";
        try {
            this.stockService.deleteStockTransferOrder(dto);    //写入POS表
            returnMsg.put("message", "删除成功！");
        } catch (Exception e) {
            e.printStackTrace();
            returnMsg.put("message", e.toString());
        }
        jsonString = JsonHelper.encodeObject2Json(returnMsg);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 调拨退货单行项目删除
     */
    public ActionForward deleteStockTransferOrderItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto returnMsg = new BaseDto();
        String jsonString = "";
        try {
            this.stockService.deleteStockTransferOrderItem(dto);    //写入POS表
            returnMsg.put("message", "删除成功！");
        } catch (Exception e) {
            e.printStackTrace();
            returnMsg.put("message", e.toString());
        }
        jsonString = JsonHelper.encodeObject2Json(returnMsg);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 创建货品调出退货订单
     */
    public ActionForward submitStockTransferOut(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto retDto = new BaseDto();
        String werks = dto.getAsString("werks");
        if (super.getSessionContainer(request).getUserInfo() != null)
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        else
            return mapping.findForward("authorization");
        try {
            Dto stockHeader = new BaseDto();
            SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
            String maxoutid = "OS" + werks + format.format(new Date()) + '%';
            dto.put("maxoutid", maxoutid);
            maxoutid = (String) this.g4Reader.queryForObject("stocksystem.getMaxOutStockId", dto);
            if ("001".equals(maxoutid)) {
                maxoutid = "OS" + werks + format.format(new Date()) + maxoutid;
            } else {
                maxoutid = maxoutid.substring(maxoutid.length() - 3);
                int id = Integer.parseInt(maxoutid) + 1;
                String pattern = "000";
                DecimalFormat df = new DecimalFormat(pattern);
                maxoutid = df.format(id);
                maxoutid = "OS" + werks + format.format(new Date()) + maxoutid;
            }
            SimpleDateFormat stockDateF = new SimpleDateFormat("yyyy-MM-dd");
            stockHeader.put("maxoutid", maxoutid);
            stockHeader.put("goodtype", dto.get("type"));
            stockHeader.put("status", Integer.valueOf(0));
            stockHeader.put("outwerks", werks);
            stockHeader.put("inwerk", dto.get("inwerk"));
            stockHeader.put("saledate", stockDateF.format(new Date()));

            JSONArray orderItemList = JSONArray.fromObject(dto.get("jsonItem").toString());
            List<Dto> stockItems = new ArrayList<Dto>();

            for (int i = 0; i < orderItemList.size(); i++) {
                JSONObject orderItem = (JSONObject) orderItemList.get(i);
                Dto item = new BaseDto();

                item.put("outid", maxoutid);
                item.put("salesorderitem", (i + 1) * 10);
                item.put("materialnumber", orderItem.get("matnr"));
                item.put("batchnumber", orderItem.get("charg"));
                item.put("salesquantity", "1");
                item.put("goldweight", orderItem.get("labst"));
                item.put("tagprice", orderItem.get("kbetr"));
                item.put("storagelocation", orderItem.get("lgort").toString().substring(orderItem.get("lgort").toString().indexOf("-") + 1));
                item.put("instock", "0001");

                stockItems.add(item);
            }

            this.stockService.insertOutStockInfo(stockHeader, stockItems);
//			if (G4Utils.isEmpty(stockHeader.get("outid"))) {
            retDto.put("message", "调拨出库单：" + maxoutid + " 创建成功!");
//			} else {
//				this.stockService.updateOutStockInfo(stockHeader, stockItems);
//				retDto.put("success", "调拨出库单：" + stockHeader.getAsString("outid") + "更新成功!");
//			}
        } catch (Exception e) {
            e.printStackTrace();
            retDto.put("message", "出现错误：" + e.getMessage());
            throw e;
        }

        String retStr = JsonHelper.encodeObject2Json(retDto);
        write(retStr, response);

        return mapping.findForward(null);
    }

    /**
     * 查询库存批次信息
     */
    public ActionForward getStockChargInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        dto.put("werks", super.getSessionContainer(request).getUserInfo().getCustomId());
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        String charg = (dto.getAsString("charg") == null ? "" : dto.getAsString("charg"));
        List list = null;
        if (!Character.isDigit(charg.charAt(0))) {
            list = this.g4Reader.queryForList("stocksystem.getStockOldgoldInfo", dto);
        } else {
            list = this.g4Reader.queryForList("stocksystem.getStockChargInfo", dto);
        }
        String jsonString = encodeObjectJson(list);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 查询批次商品定价组
     */
    public ActionForward getKondmByCharg(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String kondm = this.g4Reader.queryForObject("stocksystem.getKondmByCharg", dto).toString();
        write(kondm, response);
        return mapping.findForward(null);
    }

    /**
     * 检查批次是否存在于其他调出订单中
     */
    public ActionForward getOtherOrdersByCharg(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        dto.put("werks", super.getSessionContainer(request).getUserInfo().getCustomId());
        String outid = (String) this.g4Reader.queryForObject("stocksystem.getOtherOrdersByCharg", dto);
        outid = (outid == null ? "" : outid);
        write(outid, response);
        return mapping.findForward(null);
    }

    /**
     * 查找库存批次信息
     */
    public ActionForward getStoreByCharg(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        dto.put("werks", super.getSessionContainer(request).getUserInfo().getCustomId());
        String charg = (String) this.g4Reader.queryForObject("stocksystem.getStoreByCharg", dto);
        charg = (charg == null ? "" : charg);
        write(charg, response);
        return mapping.findForward(null);
    }

    /**
     * 根据关键字模糊查询门店
     */
    public ActionForward getWerksByKeywords(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = this.g4Reader.queryForList("stocksystem.getWerksByKeywords", dto);
        String retStr = JsonHelper.encodeObject2Json(list);
        retStr = "{ROOT:" + retStr + "}";
        write(retStr, response);
        return mapping.findForward(null);
    }

    /**
     * 创建加盟商退货订单
     */
    public ActionForward createJoinnerReturnOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto returnMsg = new BaseDto();
        String werks = "";
        String jsonString = "";
        try {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
            Dto dto = aForm.getParamAsDto(request);
            Dto orderHead = new BaseDto();
            orderHead.put("ekorg", "9000");    //采购组织
            orderHead.put("bukrs", "9000");    //公司代码
            orderHead.put("ekgrp", getEkgrpByType(Integer.parseInt(dto.get("type").toString())));    //采购组
            JSONArray orderItemList = JSONArray.fromObject(dto.get("jsonItem").toString());
            List<Dto> itemList = new ArrayList<Dto>();

            AigTransferInfo rfcTransferInfo = AigRepository.getTransferInfo();
            AigTransferTable rfcTableHead = rfcTransferInfo.getTable("IT_HEAD");
            rfcTableHead.setValue("EKORG", orderHead.get("ekorg") != null ? orderHead.get("ekorg") : "");
            rfcTableHead.setValue("BUKRS", orderHead.get("bukrs") != null ? orderHead.get("bukrs") : "");
            rfcTableHead.setValue("LIFNR", orderHead.get("lifnr") != null ? orderHead.get("lifnr") : "");
            rfcTableHead.setValue("EKGRP", orderHead.get("ekgrp") != null ? orderHead.get("ekgrp") : "");
            rfcTableHead.appendRow();
            rfcTransferInfo.appendTable(rfcTableHead);

            AigTransferTable rfcTableItem = rfcTransferInfo.getTable("IT_ITEM");
            for (int i = 0; i < orderItemList.size(); i++) {
                JSONObject orderItem = (JSONObject) orderItemList.get(i);
                Dto item = new BaseDto();

                orderItem.put("ebelp", (i + 1) * 10);
                orderItem.put("werks", werks);
                orderItem.put("lgort", orderItem.get("lgort").toString().substring(orderItem.get("lgort").toString().indexOf("-") + 1));

                item.put("ebelp", orderItem.get("ebelp"));
                item.put("werks", orderItem.get("werks"));
                item.put("lgort", orderItem.get("lgort"));
                item.put("matnr", orderItem.get("matnr"));
                item.put("charg", orderItem.get("charg"));
                item.put("labst", orderItem.get("labst"));
                item.put("meins", orderItem.get("meins"));

                rfcTableItem.setValue("EBELP", orderItem.get("ebelp"));
                rfcTableItem.setValue("PLANT", orderItem.get("werks"));
                rfcTableItem.setValue("LGORT", orderItem.get("lgort"));
                rfcTableItem.setValue("MATNR", orderItem.get("matnr"));
                rfcTableItem.setValue("BATCH", orderItem.get("charg"));
                rfcTableItem.setValue("MENGE", "G".equals(orderItem.get("meins").toString()) ? orderItem.get("labst") : "1");

                rfcTableItem.appendRow();
                itemList.add(item);
            }
            rfcTransferInfo.appendTable(rfcTableItem);

            //调接口
            SapTransferImpl transfer = new SapTransferImpl();
            AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_60", rfcTransferInfo);

            if ((out.getParameters("U_EBELN") == null) || (out.getParameters("U_EBELN") == "")) {
                returnMsg.put("message", out.getAigStructure("U_RETURN").get("MESSAGE").toString().trim());
            } else {
                orderHead.put("id", werks + G4Utils.getCurrentTime("yyyyMMddHHmmss"));
                orderHead.put("werks", werks);
                orderHead.put("type", dto.get("type"));
                orderHead.put("typetext", getGoodsType(Integer.parseInt(dto.get("type").toString())));
                orderHead.put("ebeln", out.getParameters("U_EBELN").toString().trim());
                orderHead.put("status", "0");
                orderHead.put("createtime", G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss"));

                this.stockService.saveJoinnerReturnOrder(orderHead, itemList);    //写入POS表

                returnMsg.put("message", "订单创建成功！单号：" + out.getParameters("U_EBELN").toString().trim());
            }
        } catch (Exception e) {
            e.printStackTrace();
            returnMsg.put("message", e.toString());
        }
        jsonString = JsonHelper.encodeObject2Json(returnMsg);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 加盟商退货订单列表
     */
    public ActionForward getJoinnerReturnList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        dto.put("werks", werks);
        dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
        List list = this.g4Reader.queryForPage("stocksystem.getJoinnerReturnList", dto);
        Integer count = (Integer) this.g4Reader.queryForObject("stocksystem.getJoinnerReturnListCount", dto);
        String retStr = JsonHelper.encodeList2PageJson(list, count, "yyyy-MM-dd");
        write(retStr, response);
        return mapping.findForward(null);
    }

    /**
     * 加盟商退货订单详细信息
     */
    public ActionForward getJoinnerReturnDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = this.g4Reader.queryForList("stocksystem.getJoinnerReturnDetail", dto);
        String retStr = JsonHelper.encodeObject2Json(list);
        retStr = "{ROOT:" + retStr + "}";
        write(retStr, response);
        return mapping.findForward(null);
    }

    /**
     * 加盟商退货订单发货
     */
    public ActionForward sendJoinnerReturnOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto returnMsg = new BaseDto();
        String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
        String jsonString = "";
        try {
            List orderItemList = this.g4Reader.queryForList("stocksystem.getJoinnerReturnDetail", dto);
            AigTransferInfo rfcTransferInfo = AigRepository.getTransferInfo();
            AigTransferTable rfcTableItem = rfcTransferInfo.getTable("IT_ITEM");
            for (int i = 0; i < orderItemList.size(); i++) {
                Dto orderItem = (Dto) orderItemList.get(i);

                rfcTableItem.setValue("LINEID", orderItem.get("ebelp"));
                rfcTableItem.setValue("EBELN", dto.get("ebeln"));
                rfcTableItem.setValue("EBELP", orderItem.get("ebelp"));
                rfcTableItem.setValue("WERKS", orderItem.get("werks"));
                rfcTableItem.setValue("LGORT", orderItem.get("lgort").toString().substring(orderItem.get("lgort").toString().lastIndexOf("-") + 1));
                rfcTableItem.setValue("MATNR", orderItem.get("matnr"));
                rfcTableItem.setValue("CHARG", orderItem.get("charg"));
                rfcTableItem.setValue("LABST", "G".equals(orderItem.get("meins").toString()) ? orderItem.get("labst") : "1");
                rfcTableItem.setValue("MEINS", orderItem.get("meins"));

                rfcTableItem.appendRow();
            }
            rfcTransferInfo.appendTable(rfcTableItem);

            //调接口
            SapTransferImpl transfer = new SapTransferImpl();
            AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_61", rfcTransferInfo);

            if ((out.getParameters("U_MBLNR") == null) || (out.getParameters("U_MBLNR") == "")) {
                returnMsg.put("message", out.getAigStructure("U_RETURN").get("MESSAGE").toString().trim());
            } else {
                dto.put("mblnr", out.getParameters("U_MBLNR").toString().trim());
                this.stockService.sendJoinnerReturnOrder(dto);    //写入POS表
                this.stockService.deleteJoinnerReturnStore(dto);    //减库存

                returnMsg.put("message", "发货成功！凭证号：" + out.getParameters("U_MBLNR").toString().trim());
            }
        } catch (Exception e) {
            e.printStackTrace();
            returnMsg.put("message", e.toString());
        }
        jsonString = JsonHelper.encodeObject2Json(returnMsg);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 加盟商退货订单审批
     */
    public ActionForward submitJoinnerReturnOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto returnMsg = new BaseDto();
        String jsonString = "";
        try {
            this.stockService.submitJoinnerReturnOrder(dto);    //写入POS表
            returnMsg.put("message", "审批成功！");
        } catch (Exception e) {
            e.printStackTrace();
            returnMsg.put("message", e.toString());
        }
        jsonString = JsonHelper.encodeObject2Json(returnMsg);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 加盟商退货订单驳回
     */
    public ActionForward returnJoinnerReturnOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto returnMsg = new BaseDto();
        String jsonString = "";
        try {
            this.stockService.returnJoinnerReturnOrder(dto);    //写入POS表
            returnMsg.put("message", "驳回成功！");
        } catch (Exception e) {
            e.printStackTrace();
            returnMsg.put("message", e.toString());
        }
        jsonString = JsonHelper.encodeObject2Json(returnMsg);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 加盟商退货订单删除
     */
    public ActionForward deleteJoinnerReturnOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto returnMsg = new BaseDto();
        String jsonString = "";
        try {
            this.stockService.deleteJoinnerReturnOrder(dto);    //写入POS表
            returnMsg.put("message", "删除成功！");
        } catch (Exception e) {
            e.printStackTrace();
            returnMsg.put("message", e.toString());
        }
        jsonString = JsonHelper.encodeObject2Json(returnMsg);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 导出退货明细数据
     */
    public ActionForward simpleExcelWrite(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
//		CommonActionForm aForm = (CommonActionForm) form;
//		Dto dto = aForm.getParamAsDto(request);
//		List items = JsonHelper.parseJson2List(G4Utils.replace4JsOutput(dto
//				.getAsString("items")));


        return mapping.findForward(null);
    }

    public ActionForward getXsfs(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = this.g4Reader.queryForList("stocksystem.getXsfs", null);
        String retStr = JsonHelper.encodeObject2Json(list);
        retStr = "{ROOT:" + retStr + "}";
        write(retStr, response);

        return mapping.findForward(null);
    }


}