package cn.longhaul.job.constant;

import java.io.File;
import java.io.FileInputStream;
import java.net.URI;
import java.util.Date;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class SentEmail {
	private static String[] emailAdress;
	private static String host = "smtp.126.com";
	private static String username = "atest44";
	private static String password = "abc123456";
	private static String mail_head_name = "this is head of this mail";
	private static String mail_head_value = "this is head of this mail";
	private static String mail_subject = "SAP同步出错";
	private static String mail_from = "atest44@126.com";
	private static String personalName = "SAP同步出错";

	static {
		StringBuffer buffer = new StringBuffer();
		try {
			URI uri = new URI(SentEmail.class.getClassLoader().getResource("") + "/email2.txt");
			FileUtil.readToBuffer(buffer, new FileInputStream(new File(uri)));
			System.out.println(buffer + "-------------");
			emailAdress = buffer.toString().split(";");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void process() {
		StringBuffer buffer = new StringBuffer();
		try {
			URI uri = new URI(SentEmail.class.getClassLoader().getResource("") + "/email2.txt");
			FileUtil.readToBuffer(buffer, new FileInputStream(new File(uri)));
			System.out.println(buffer + "-------------");
			emailAdress = buffer.toString().split(";");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void send(String content) throws Exception {
		for (int i = 0; i < emailAdress.length; i++)
			send2(content, emailAdress[i]);
	}

	public static void send2(String content, String to) throws Exception {
		try {
			Properties props = new Properties();
			Authenticator auth = new Email_Autherticator();
			props.put("mail.smtp.host", host);
			props.put("mail.smtp.auth", "true");
			Session session = Session.getDefaultInstance(props, auth);

			MimeMessage message = new MimeMessage(session);
			System.out.println(message);

			message.setSubject(mail_subject);
			message.setText(content);
			message.setHeader(mail_head_name, mail_head_value);
			message.setSentDate(new Date());
			Address address = new InternetAddress(mail_from, personalName);
			message.setFrom(address);

			System.out.println(to);
			Address toAddress = new InternetAddress(to);
			message.addRecipient(Message.RecipientType.TO, toAddress);
			Transport.send(message);
			System.out.println("send ok!");
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public static void main(String[] args) throws Exception {
	}

	public static class Email_Autherticator extends Authenticator {
		public Email_Autherticator() {
		}

		public Email_Autherticator(String user, String pwd) {
			SentEmail.username = user;
			SentEmail.password = pwd;
		}

		public PasswordAuthentication getPasswordAuthentication() {
			return new PasswordAuthentication(SentEmail.username,
					SentEmail.password);
		}
	}
}