package cn.longhaul.pos.member.web;

import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.HessianContext;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;

import java.io.PrintStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

public class MemberSystemAction extends BaseAction {
    private static Log log = LogFactory.getLog(MemberSystemAction.class);

    public ActionForward memberInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("WERKS");
        if (super.getSessionContainer(request).getUserInfo() != null) {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
            dto.put("store_number", werks);
        } else {
            return mapping.findForward("authorization");
        }
        return mapping.findForward("assistantSystem");
    }

    public ActionForward getMemberInfoForNewMember(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("WERKS");
        if (super.getSessionContainer(request).getUserInfo() != null) {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
            dto.put("store_number", werks);
        } else {
            return mapping.findForward("authorization");
        }
        dto.put("name1", "未激活会员卡");

        List memberDto = this.g4Reader.queryForPage("membersystem.getMemberInfoForNewMember", dto);

        Integer memberCount = (Integer) this.g4Reader.queryForObject("membersystem.getMemberCount", dto);

        for (int i = 0; i < memberDto.size(); i++) {
            String konda = (String) ((Dto) memberDto.get(i)).get("konda");
            if ("01".equals(konda))
                ((Dto) memberDto.get(i)).put("kondashow", "畅享卡");
            else if ("02".equals(konda))
                ((Dto) memberDto.get(i)).put("kondashow", "EEGO卡");
            else if ("03".equals(konda))
                ((Dto) memberDto.get(i)).put("kondashow", "金典卡");
            else {
                ((Dto) memberDto.get(i)).put("kondashow", "");
            }
        }

        String jsonString = JsonHelper.encodeList2PageJson(memberDto, memberCount, "yyyy-MM-dd");

        write(jsonString, response);

        return mapping.findForward(null);
    }

    public ActionForward getMemberInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        HttpSession session = request.getSession();
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("WERKS");
        if (super.getSessionContainer(request).getUserInfo() != null) {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
            dto.put("store_number", werks);
        } else {
            return mapping.findForward("authorization");
        }

        if ("n".equals(dto.getAsString("isactivate"))) {
            dto.put("name1", "未激活会员");
        } else {
            String[] parvoArray = {"1", "2", "3"};
            dto.put("parvoArray", parvoArray);
        }
        if ("".equals(dto.getAsString("limit"))) {
            dto.put("limit", Integer.valueOf(10));
            dto.put("start", Integer.valueOf(0));
        }

        List memberDto = this.g4Reader.queryForPage("membersystem.getMemberInfo", dto);

        Integer memberCount = (Integer) this.g4Reader.queryForObject("membersystem.getMemberCount", dto);

        for (int i = 0; i < memberDto.size(); i++) {
            try {
                String konda = (String) ((Dto) memberDto.get(i)).get("konda");
                if ("01".equals(konda))
                    ((Dto) memberDto.get(i)).put("kondashow", "畅享卡");
                else if ("02".equals(konda))
                    ((Dto) memberDto.get(i)).put("kondashow", "EEGO卡");
                else if ("03".equals(konda))
                    ((Dto) memberDto.get(i)).put("kondashow", "金典卡");
                else if ("10".equals(konda))
                    ((Dto) memberDto.get(i)).put("kondashow", "兆亮会员卡");
                else {
                    ((Dto) memberDto.get(i)).put("kondashow", "");
                }

                int j = 0;

                String[] aaa = ((Dto) memberDto.get(i)).getAsString("str_suppl1").split(",");
                for (; j < aaa.length; j++)
                    aaa[j] = aaa[j].trim();
                j = 0;

                ((Dto) memberDto.get(i)).put("str_suppl1", aaa);

                aaa = ((Dto) memberDto.get(i)).getAsString("name_co").split(",");
                for (; j < aaa.length; j++)
                    aaa[j] = aaa[j].trim();
                j = 0;
                ((Dto) memberDto.get(i)).put("name_co", aaa);

                aaa = ((Dto) memberDto.get(i)).getAsString("str_suppl2").split(",");
                for (; j < aaa.length; j++)
                    aaa[j] = aaa[j].trim();
                j = 0;

                ((Dto) memberDto.get(i)).put("str_suppl2", aaa);

                aaa = ((Dto) memberDto.get(i)).getAsString("str_suppl3").split(",");
                for (; j < aaa.length; j++)
                    aaa[j] = aaa[j].trim();
                j = 0;

                ((Dto) memberDto.get(i)).put("str_suppl3", aaa);

                aaa = ((Dto) memberDto.get(i)).getAsString("extension1").split(",");
                for (; j < aaa.length; j++)
                    aaa[j] = aaa[j].trim();
                j = 0;
                ((Dto) memberDto.get(i)).put("extension1", aaa);

                aaa = ((Dto) memberDto.get(i)).getAsString("extension2").split(",");
                for (; j < aaa.length; j++)
                    aaa[j] = aaa[j].trim();
                j = 0;
                ((Dto) memberDto.get(i)).put("extension2", aaa);

                aaa = ((Dto) memberDto.get(i)).getAsString("location").split(",");
                for (; j < aaa.length; j++)
                    aaa[j] = aaa[j].trim();
                j = 0;
                ((Dto) memberDto.get(i)).put("location", aaa);

                aaa = ((Dto) memberDto.get(i)).getAsString("city2").split(",");
                for (; j < aaa.length; j++)
                    aaa[j] = aaa[j].trim();
                j = 0;
                ((Dto) memberDto.get(i)).put("city2", aaa);

                if ("0000-00-00".equals(((Dto) memberDto.get(i)).get("gbdat")))
                    ((Dto) memberDto.get(i)).put("gbdat", "");
            } catch (Exception e) {
                e.printStackTrace();
            }

        }

        for (int i = 0; i < memberDto.size(); i++) {
            Dto dtotemp = (Dto) memberDto.get(i);
            if ("".equals(((Dto) memberDto.get(i)).getAsString("telf2"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("name1"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("name2"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("sort2"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("fax_number"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("konda"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("parge"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("gbdat"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("abtnr"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("sort1"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("telf1"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("smtp_addr"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("fax_number1"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("post_code1"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("street"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("zyjdz"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("tel_number"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("name4"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("remark"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("parau"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("name_co"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("str_suppl1"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("str_suppl2"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("extension2"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("str_suppl3"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("location"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("city2"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("extension1"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("kunn2"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("bryth"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("pafkt"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("pavip"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else if ("".equals(((Dto) memberDto.get(i)).getAsString("parvo"))) {
                ((Dto) memberDto.get(i)).put("comp_status", "不完整");
            } else {
                ((Dto) memberDto.get(i)).put("comp_status", "完整");
            }
        }
        String jsonString = JsonHelper.encodeList2PageJson(memberDto, memberCount, "yyyy-MM-dd");

        write(jsonString, response);

        return mapping.findForward(null);
    }

    public ActionForward updateMember(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        SimpleDateFormat timeFormat = new SimpleDateFormat("HHmmss");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("WERKS");
        Dto paraDto = new BaseDto();
        if (super.getSessionContainer(request).getUserInfo() != null) {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
            paraDto.put("werks", werks);
            dto.put("store_number", werks);
        } else {
            return mapping.findForward("authorization");
        }

        String lovcombo = (String) dto.get("lovcombo");
        String kunnr = dto.getAsString("sort2");
        String new_nunnr = dto.getAsString("new_sort2");

        if ("".equals(dto.getAsString("limit"))) {
            dto.put("limit", Integer.valueOf(10));
            dto.put("start", Integer.valueOf(0));
        }

        Dto connectDto = new BaseDto();

        String parvo = dto.getAsString("parvo");
        connectDto.put("parvo", parvo);
        Dto dtoold = null;
        Dto dtonew = null;
        if ("y".equals(dto.getAsString("cmanage"))) {
            if ("1".equals(parvo)) {
                List list = this.g4Reader.queryForPage("membersystem.getMemberInfo", dto);
                if (list.size() == 1) {
                    dtoold = (Dto) list.get(0);
                }
                dtoold.put("parvo", "1");
            } else if ("2".equals(parvo)) {
                List list = this.g4Reader.queryForPage("membersystem.getMemberInfo", dto);
                if (list.size() == 1) {
                    dtoold = (Dto) list.get(0);
                    dtonew = new BaseDto();
                    list.get(0);
                    dtonew.putAll((Map) list.get(0));

                    dtoold.put("parvo", "4");
                    dtoold.put("zjf", Integer.valueOf(0));
                    dtoold.put("zhyjf", Integer.valueOf(0));
                    dtoold.put("updatejf", Integer.valueOf(1));
                }

                Dto querydto = new BaseDto();
                querydto.put("store_number", werks);
                querydto.put("sort2", new_nunnr);
                querydto.put("start", Integer.valueOf(0));
                querydto.put("limit", Integer.valueOf(10));
                List tempList = this.g4Reader.queryForPage("membersystem.getMemberInfo", querydto);
                if (tempList.size() == 1) {
                    dtonew.put("sort2", ((Dto) tempList.get(0)).getAsString("sort2"));
                    dtonew.put("kunnr", ((Dto) tempList.get(0)).getAsString("kunnr"));
                    dtonew.put("konda", ((Dto) tempList.get(0)).getAsString("konda"));

                    connectDto.put("oldkunnr", dtoold.get("sort2"));
                    connectDto.put("newkunnr", dtonew.get("sort2"));
                }

                dtonew.put("parvo", "2");
                dtonew.put("updatejf", Integer.valueOf(1));
            } else if ("3".equals(parvo)) {
                List list = this.g4Reader.queryForPage("membersystem.getMemberInfo", dto);
                if (list.size() == 1) {
                    dtoold = (Dto) list.get(0);
                    dtonew = new BaseDto();
                    list.get(0);
                    dtonew.putAll((Map) list.get(0));

                    dtoold.put("parvo", "4");
                    dtoold.put("zjf", Integer.valueOf(0));
                    dtoold.put("zhyjf", Integer.valueOf(0));
                    dtoold.put("updatejf", Integer.valueOf(1));
                }

                Dto querydto = new BaseDto();
                querydto.put("store_number", werks);
                querydto.put("sort2", new_nunnr);
                querydto.put("start", Integer.valueOf(0));
                querydto.put("limit", Integer.valueOf(10));
                List tempList = this.g4Reader.queryForPage("membersystem.getMemberInfo", querydto);
                if (tempList.size() == 1) {
                    System.out.println(((Dto) tempList.get(0)).getAsString("sort2"));
                    dtonew.put("sort2", ((Dto) tempList.get(0)).getAsString("sort2"));
                    dtonew.put("kunnr", ((Dto) tempList.get(0)).getAsString("kunnr"));
                    dtonew.put("konda", ((Dto) tempList.get(0)).getAsString("konda"));
                    connectDto.put("oldkunnr", dtoold.get("sort2"));
                    connectDto.put("newkunnr", dtonew.get("sort2"));
                }

                dtonew.put("parvo", "3");
                dtonew.put("updatejf", Integer.valueOf(1));
            } else if ("4".equals(parvo)) {
                List list = this.g4Reader.queryForPage("membersystem.getMemberInfo", dto);
                if (list.size() == 1) {
                    dtoold = (Dto) list.get(0);
                }
                dtoold.put("parvo", "4");
            }
        } else if ("y".equals(dto.getAsString("mfcs"))) {
            int building = dto.getAsInteger("building").intValue();
            if (building >= 1)
                building--;
            else {
                return mapping.findForward(null);
            }
            List list = this.g4Reader.queryForPage("membersystem.getMemberInfo", dto);
            if (list.size() == 1) {
                dtoold = (Dto) list.get(0);
                dtoold.put("building", Integer.valueOf(building));
            }
        } else {
            dtoold = dto;
        }

        HessianContext.setRequest(request);

        AigTransferInfo outinfo = transportDto(dtoold);
        Map retMap = outinfo.getAigStructure("U_RETURN");
        if (("y".equals(dto.getAsString("cmanage"))) && (("2".equals(parvo)) || ("3".equals(parvo)))) {
            AigTransferInfo outinfo2 = transportDto(dtonew);
            Map localMap1 = outinfo.getAigStructure("U_RETURN");
        }
        System.out.println(retMap.get("MESSAGE"));

        if ("S".equals(retMap.get("TYPE"))) {
            int i = this.g4Dao.update("membersystem.updateMember", dtoold);
            if (("y".equals(dto.getAsString("cmanage"))) && (("2".equals(parvo)) || ("3".equals(parvo)))) {
                int j = this.g4Dao.update("membersystem.updateMember", dtonew);
                this.g4Dao.insert("membersystem.insertConnection", connectDto);

                insertcorrelation("Z_RFC_STORE_36", connectDto);

                Dto zjf1 = new BaseDto();
                Dto zjf2 = new BaseDto();
                zjf1.putAll(dtonew);
                zjf2.putAll(dtonew);
                List jfDtoList = new ArrayList();
                Double zjf = Double.valueOf(Double.parseDouble(dtonew.getAsString("zjf")));
                Double zhyjf = Double.valueOf(Double.parseDouble(dtonew.getAsString("zhyjf")));
                zjf1.put("KBETR", zjf);
                zjf1.put("KSCHL", "ZJF1");
                zjf2.put("KBETR", zhyjf);
                zjf2.put("KSCHL", "ZJF6");
                jfDtoList.add(zjf1);
                jfDtoList.add(zjf2);
                updateMemberJF("Z_RFC_STORE_34", jfDtoList);

                zjf1 = new BaseDto();
                zjf2 = new BaseDto();
                zjf1.putAll(dtoold);
                zjf2.putAll(dtoold);
                jfDtoList = new ArrayList();
                zjf = Double.valueOf(Double.parseDouble(dtoold.getAsString("zjf")));
                zhyjf = Double.valueOf(Double.parseDouble(dtoold.getAsString("zhyjf")));
                zjf1.put("KBETR", zjf);
                zjf1.put("KSCHL", "ZJF1");
                zjf2.put("KBETR", zhyjf);
                zjf2.put("KSCHL", "ZJF6");
                jfDtoList.add(zjf1);
                jfDtoList.add(zjf2);
                updateMemberJF("Z_RFC_STORE_35", jfDtoList);
            } else if (("y".equals(dto.getAsString("addnew"))) && (G4Utils.isNotEmpty(dto.getAsString("fax_number")))) {
                String fax_number = dto.getAsString("fax_number");

                Dto querydto = new BaseDto();
                querydto.put("store_number", werks);
                querydto.put("sort2", fax_number);
                Dto memberDto = (Dto) this.g4Reader.queryForObject("membersystem.getMemberInfo", querydto);
                Dto zjf1 = new BaseDto();
                Dto zjf2 = new BaseDto();
                zjf1.putAll(memberDto);
                zjf2.putAll(memberDto);
                List jfDtoList = new ArrayList();
                Double zjf = Double.valueOf(Double.parseDouble(memberDto.getAsString("zjf")));
                Double zhyjf = Double.valueOf(Double.parseDouble(memberDto.getAsString("zhyjf")));
                Integer recommendKbert = (Integer) this.g4Dao.queryForObject("membersystem.getRecommendKbert", paraDto);
                recommendKbert = Integer.valueOf(recommendKbert != null ? recommendKbert.intValue() : 10);
                zjf = Double.valueOf(zjf.doubleValue() + recommendKbert.intValue());
                zhyjf = Double.valueOf(zhyjf.doubleValue() + recommendKbert.intValue());
                zjf1.put("KBETR", zjf);
                zjf1.put("KSCHL", "ZJF1");
                zjf2.put("KBETR", zhyjf);
                zjf2.put("KSCHL", "ZJF6");
                jfDtoList.add(zjf1);
                jfDtoList.add(zjf2);

                AigTransferInfo outinfo2 = updateMemberJF("Z_RFC_STORE_34", jfDtoList);

                ArrayList retList = outinfo2.getAigTable("IT_RETURN");
                String type = (String) ((HashMap) retList.get(0)).get("TYPE");

                if ("S".equals(type)) {
                    paraDto = new BaseDto();
                    paraDto.put("zjf", zjf);
                    paraDto.put("zhyjf", zhyjf);
                    paraDto.put("kunnr", memberDto.get("kunnr"));
                    paraDto.put("updatejf", Integer.valueOf(1));
                    this.g4Dao.update("membersystem.updateMember", paraDto);
                }
            }

            if (i > 0) {
                String str = "{success:true,msg:'" + retMap.get("MESSAGE") + "'}";
                write(str, response);
            } else {
                String str = "{success:false,msg:'" + retMap.get("MESSAGE") + "'}";
                write(str, response);
            }
        } else {
            String str = "{success:false,msg:'" + retMap.get("MESSAGE") + "'}";
            write(str, response);
        }
        return mapping.findForward(null);
    }

    public AigTransferInfo transportDto(Dto dto) throws Exception {
        AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
        AigTransferTable table = rfctransferinfo.getTable("IT_ITAB");

        table.setValue("KUNNR", dto.get("kunnr"));
        table.setValue("KUNN2", dto.get("kunn2"));
        table.setValue("SORT2", dto.get("sort2"));
        table.setValue("NAME1", dto.get("name1"));
        table.setValue("NAME2", dto.get("name2"));
        table.setValue("NAME3", dto.get("name3"));
        table.setValue("NAME4", dto.get("name4"));
        table.setValue("NAME_CO", dto.get("name_co"));
        table.setValue("SMTP_ADDR", dto.get("smtp_addr"));
        table.setValue("TELF1", dto.get("telf1"));
        table.setValue("TELF2", dto.getAsString("telf2"));

        table.setValue("REMARK", dto.get("remark"));
        table.setValue("STR_SUPPL2", dto.get("str_suppl2"));
        table.setValue("STR_SUPPL3", dto.get("str_suppl3"));
        table.setValue("LOCATION", dto.get("location"));
        table.setValue("CITY2", dto.get("city2"));

        table.setValue("FAX_NUMBER", dto.get("fax_number"));
        table.setValue("KONDA", dto.get("konda"));
        table.setValue("PARGE", dto.get("parge"));
        table.setValue("GBDAT", dto.getAsString("gbdat"));

        table.setValue("ABTNR", dto.get("abtnr"));
        table.setValue("SORT1", dto.get("sort1"));
        table.setValue("POST_CODE1", dto.get("post_code1"));
        table.setValue("STREET", dto.get("street"));
        table.setValue("ZYJDZ", dto.get("zyjdz"));
        table.setValue("TEL_NUMBER", dto.getAsString("tel_number"));

        table.setValue("PARAU", dto.get("parau"));
        table.setValue("STR_SUPPL1", dto.get("str_suppl1"));
        table.setValue("EXTENSION2", dto.get("extension2"));
        table.setValue("EXTENSION1", dto.get("extension1"));
        table.setValue("FAX_NUMBER1", dto.get("fax_number1"));
        table.setValue("FUNCTION", dto.get("function"));
        table.setValue("BRYTH", dto.get("bryth"));
        table.setValue("PAFKT", dto.get("pafkt"));
        table.setValue("PAVIP", dto.get("pavip"));
        table.setValue("PARVO", dto.get("parvo"));

        table.setValue("BUILDING", dto.get("building"));
        table.appendRow();
        rfctransferinfo.appendTable(table);

        SapTransferImpl transfer = new SapTransferImpl();
        AigTransferInfo outinfo = transfer.transferInfoAig("Z_RFC_STORE_18", rfctransferinfo);
        return outinfo;
    }

    public AigTransferInfo updateMemberJF(String rfcname, List<Dto> dtoList) throws Exception {
        AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
        AigTransferTable table = rfctransferinfo.getTable("IT_ITAB");
        for (int i = 0; i < dtoList.size(); i++) {
            Dto dto = (Dto) dtoList.get(i);
            table.setValue("KUNNR", dto.get("kunnr"));
            table.setValue("KSCHL", dto.get("KSCHL"));
            table.setValue("KBETR", dto.get("KBETR"));
            table.setValue("DATAB", G4Utils.getCurrentTime("yyyy-MM-dd"));
            table.appendRow();
        }
        rfctransferinfo.appendTable(table);
        SapTransferImpl transfer = new SapTransferImpl();
        AigTransferInfo outinfo = transfer.transferInfoAig(rfcname, rfctransferinfo);
        return outinfo;
    }

    public AigTransferInfo insertcorrelation(String rfcname, Dto dto) throws Exception {
        AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
        AigTransferTable table = rfctransferinfo.getTable("IT_ZTHYMX");
        table.setValue("ZJHY", dto.get("oldkunnr"));
        table.setValue("ZXHY", dto.get("newkunnr"));
        table.appendRow();
        rfctransferinfo.appendTable(table);
        SapTransferImpl transfer = new SapTransferImpl();
        AigTransferInfo outinfo = transfer.transferInfoAig(rfcname, rfctransferinfo);
        return outinfo;
    }

    public ActionForward getMemberConsumDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;

        Dto dto = aForm.getParamAsDto(request);
        String werks = dto.getAsString("WERKS");
        if (super.getSessionContainer(request).getUserInfo() != null) {
            werks = super.getSessionContainer(request).getUserInfo().getCustomId();
            dto.put("store_number", werks);
        } else {
            return mapping.findForward("authorization");
        }
        List myIdList = new ArrayList();
        List idList = new ArrayList();
        idList.add(dto.getAsString("kunnr"));
        dto.put("idList", idList);
        myIdList.add(dto.getAsString("kunnr"));
        do {
            idList = this.g4Dao.queryForList("membersystem.getOldIdList", dto);
            dto.put("idList", idList);
            myIdList.addAll(idList);
        } while ((idList != null) && (idList.size() != 0));

        dto.put("idList", myIdList);
        List data = this.g4Dao.queryForList("membersystem.getMemberConsumDetail", dto);

        String jsonStr = JsonHelper.encodeObject2Json(data, "yyyy-MM-dd");

        write("{ROOT:" + jsonStr + '}', response);

        return mapping.findForward(null);
    }

    public ActionForward getWerksInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;

        List list = this.g4Reader.queryForList("membersystem.getWerksInfo");
        List newList = new ArrayList();

        for (int i = 0; i < list.size(); i++) {
            Dto dto = (Dto) list.get(i);
            dto.put("werksname", ((Dto) list.get(i)).getAsString("werks") + "->" + ((Dto) list.get(i)).getAsString("name1"));
            newList.add(dto);
        }
        String jsonStr = JsonHelper.encodeObject2Json(newList);

        write("{ROOT:" + jsonStr + '}', response);

        return mapping.findForward(null);
    }

    public ActionForward getCardCategory(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        List list = this.g4Reader.queryForList("membersystem.getCardCategoryInfo");
        String jsonStr = JsonHelper.encodeObject2Json(list);
        write("{ROOT:" + jsonStr.toLowerCase() + '}', response);
        return mapping.findForward(null);
    }

    public ActionForward getCardStatus(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        List list = this.g4Reader.queryForList("membersystem.getCardStatusInfo");
        String jsonStr = JsonHelper.encodeObject2Json(list);
        write("{ROOT:" + jsonStr.toLowerCase() + '}', response);
        return mapping.findForward(null);
    }

    public ActionForward getVipRecord(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String option = dto.getAsString("option");
        List list = new ArrayList();
        if (option.equals("user"))
            list = this.g4Dao.queryForList("basicinfo.viprecordbyuser", dto);
        else {
            list = this.g4Dao.queryForList("basicinfo.viprecord", dto);
        }
        String jsonString = JsonHelper.encodeObject2Json(list);
        jsonString = jsonString.substring(1, jsonString.length() - 1);
        write(jsonString, response);
        return mapping.findForward(null);
    }
}