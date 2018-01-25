package cn.longhaul.pos.member.service;

import org.apache.commons.codec.binary.Base64;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;

/**
 * 发送会员生日祝福短信
 */
public class SendMemberBirthdayMsg  {
    private String url = "http://sms-api.luosimao.com/v1/send.json";
    private String key = "api";
    private String apikey = "key-3e5da838b5f538a2fe6141533061bf34";
    private String getHeader() {
        String auth = key + ":" + apikey;
        byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(Charset.forName("UTF-8")));
        String authHeader = "Basic " + new String(encodedAuth);
        return authHeader;
    }



    public void sendMemberBirthdayMsg(User user) {
        try {
            URL url = new URL(this.url);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            //拼接请求地址
            StringBuilder content = new StringBuilder(100);
            content.append("mobile=").append(user.getSort1())
                    .append("&message=尊敬的").append(user.getAppellation()).append(",今天是您的生日。兆亮珠宝为你送上最诚挚的祝福!您可在本月享受消费双倍积分,还可凭手机号码及短信到店领取精美生日礼品一份。")
                    .append("【兆亮珠宝】");
            connection.setRequestProperty("Authorization", this.getHeader());
            //设置请求方式
            connection.setRequestMethod("POST");
            //有请求体
            connection.setDoOutput(true);
            //获取输出流,写入数据
            connection.getOutputStream().write(content.toString().getBytes("UTF-8"));
            //获取响应信息
            String response = this.getStringFromStream(connection.getInputStream());
            System.out.println(response);
            System.out.println(content);
            if (response.contains("ok")) {
                System.out.println("发送短信成功");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("短信发送失败");
        }
    }

    /**
     * 将输入流转化为字符串
     */
    public static String getStringFromStream(InputStream tInputStream) {
        if (tInputStream != null) {
            try {
                BufferedReader tBufferedReader = new BufferedReader(new InputStreamReader(tInputStream));
                StringBuffer tStringBuffer = new StringBuffer();
                String sTempOneLine = new String("");
                while ((sTempOneLine = tBufferedReader.readLine()) != null) {
                    tStringBuffer.append(sTempOneLine);
                }
                if (tStringBuffer.length() != 0) {
                    return tStringBuffer.toString();
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

}



