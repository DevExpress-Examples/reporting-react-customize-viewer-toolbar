'use client';
import React from 'react';
import ReportViewer, { Callbacks, RequestSettings } from 'devexpress-reporting-react/dx-report-viewer';
import { TemplateEngine } from 'devexpress-reporting-react/dx-report-viewer/core/template-engine';
import { ActionId } from 'devexpress-reporting/viewer/constants';
import { CustomAction } from 'devexpress-reporting/dx-webdocumentviewer';

import "devextreme/dist/css/dx.light.css";
import "@devexpress/analytics-core/dist/css/dx-analytics.common.css";
import "@devexpress/analytics-core/dist/css/dx-analytics.light.css";
import "devexpress-reporting/dist/css/dx-webdocumentviewer.css";

export default function Home() {
  const templateEngine = new TemplateEngine();
  templateEngine.setTemplate('slideshow', () => (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
      <polygon className="dxd-icon-fill" points="4,2 4,22 22,12 " />
    </svg>
  ));

  const onCustomizeMenuActions = ({ sender, args }: { sender: any, args: any }) => {
    let interval: any;
    const action = new CustomAction({
      text: "Run Slide Show",
      imageTemplateName: "slideshow",
      visible: true,
      disabled: false,
      selected: false,
      clickAction: function () {
        if (this.selected) {
            clearInterval(interval);
            this.selected = false;
            return;
        }
        var model = sender.GetPreviewModel();
        if (model) {
            this.selected = true;
            interval = setInterval(function () {
                var pageIndex = model.GetCurrentPageIndex();
                model.GoToPage(pageIndex + 1);
            }, 2000);
        }
      }
    });
    args.Actions.push(action);
  
    var highlightEditingFieldsAction = args.GetById(ActionId.HighlightEditingFields);
    if (highlightEditingFieldsAction)
        highlightEditingFieldsAction.visible = false;
  };

  return (
      <ReportViewer reportUrl="Report" templateEngine={templateEngine}>
        <RequestSettings invokeAction="/DXXRDV" host="http://localhost:5000" />
        <Callbacks CustomizeMenuActions={React.useCallback(onCustomizeMenuActions,[])} />
      </ReportViewer>
  );
}
