import fs from 'fs';
import path from 'path';
import renderTemplate from 'lodash/template';

import { DebtInterface } from '../model/types';

const reportName = 'tyrion_report.html';

export default class TemplateRenderer {
  private static renderGraph(template: string, data: {}): string {
    const compiled = renderTemplate(template.toString());
    const htmlGraph = compiled(data);
    const reportPath = path.resolve(reportName);

    fs.writeFileSync(reportPath, htmlGraph);

    return reportPath;
  }

  public static renderBubbleGraph(debt: DebtInterface) {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../template/google_charts/bubble_report.html'),
      'utf-8',
    );

    return this.renderGraph(file, { debt });
  }
}
