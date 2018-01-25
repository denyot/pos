package org.eredlab.g4.rif.report.jasper.applet;

import java.awt.BorderLayout;
import java.awt.Container;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URL;
import javax.swing.JApplet;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.util.JRLoader;

public class EmbeddedViewerApplet extends JApplet {
	private JasperPrint jasperPrint = null;
	private JPanel pnlMain;

	public EmbeddedViewerApplet() {
		initComponents();
	}

	public void init() {
		String url = getParameter("REPORT_URL");
		if (url != null)
			try {
				this.jasperPrint = ((JasperPrint) JRLoader.loadObject(new URL(
						getCodeBase(), url)));
				if (this.jasperPrint == null)
					return;
				JRViewerSimple viewer = new JRViewerSimple(this.jasperPrint);
				this.pnlMain.add(viewer, "Center");
			} catch (Exception e) {
				StringWriter swriter = new StringWriter();
				PrintWriter pwriter = new PrintWriter(swriter);
				e.printStackTrace(pwriter);
				JOptionPane.showMessageDialog(this, swriter.toString());
			}
		else
			JOptionPane.showMessageDialog(this, "Source URL not specified");
	}

	private void initComponents() {
		this.pnlMain = new JPanel();

		this.pnlMain.setLayout(new BorderLayout());

		getContentPane().add(this.pnlMain, "Center");
	}
}