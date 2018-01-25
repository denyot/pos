package org.eredlab.g4.rif.report.jasper.applet;

import java.awt.Dimension;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.view.JRViewer;

public class JRViewerSimple extends JRViewer {
	protected JButton btnPlus = new JButton();

	public JRViewerSimple(JasperPrint jrPrint) throws JRException {
		super(jrPrint);

		this.tlbToolBar.remove(this.btnSave);
		this.tlbToolBar.remove(this.btnReload);

		this.btnPlus = new JButton();
		this.btnPlus.setToolTipText("关于此报表组件");
		this.btnPlus.setIcon(new ImageIcon(getClass().getResource(
				"/org/eredlab/g4/rif/report/jasper/applet/image/about.gif")));
		this.btnPlus.setMargin(new Insets(2, 2, 2, 2));
		this.btnPlus.setMaximumSize(new Dimension(23, 23));
		this.btnPlus.setMinimumSize(new Dimension(23, 23));
		this.btnPlus.setPreferredSize(new Dimension(23, 23));
		this.btnPlus.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				JRViewerSimple.this.btnPlusActionPerformed(evt);
			}
		});
		this.tlbToolBar.add(this.btnPlus, 0);
	}

	protected void btnPlusActionPerformed(ActionEvent evt) {
		JOptionPane
				.showMessageDialog(this,
						"此报表由易道系统集成与开发平台报表引擎(eRedG4.Report)强力驱动(BasedJasperReport)\n易道软件实验(中国.昆明)");
	}
}