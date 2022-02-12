import { DuiPanel, DuiPanelTab } from '../state/DuiPanel';
import { DuiPanelModel } from '../model/PanelLayoutModel';

describe('DuiPanel test suite', () => {
  // Setup a model for the panel
  const tab1id = 'tab-1';
  const tab1label = 'Tab 1';
  const tab1: DuiPanelTab = {
    id: tab1id,
    label: tab1label,
  };

  const tab2id = 'tab-2';
  const tab2label = 'Tab 2';
  const tab2: DuiPanelTab = {
    id: tab2id,
    label: tab2label,
  };

  const panelId = 'panel-id';
  const model: DuiPanelModel = {
    id: panelId,
    tabs: [tab1, tab2],
  };

  test('DuiPanel initialises correctly', () => {
    const panelId = 'panel-id';
    const panel = new DuiPanel(panelId);

    expect(panel).toBeDefined();
    expect(panel.id).toEqual(panelId);
    expect(panel.tabs).toEqual([]);
    expect(panel.selectedTab).toBeUndefined();
  });

  test('DuiPanel initialises from model', () => {
    const panel = DuiPanel.fromModel(model);

    expect(panel).toBeDefined();
    expect(panel.id).toEqual(panelId);
    // Ensure the first given tab is selected by default
    expect(panel.selectedTab).toEqual(tab1);
    expect(panel.tabs).toHaveLength(2);
    expect(panel.tabs[0].id).toEqual(tab1id);
    expect(panel.tabs[0].label).toEqual(tab1label);
    expect(panel.tabs[1].id).toEqual(tab2id);
    expect(panel.tabs[1].label).toEqual(tab2label);
  });

  test('DuiPanel::addTab adds and selects new tab', () => {
    const tab3id = 'tab-3';
    const tab3label = 'Tab 3';
    const tab: DuiPanelTab = {
      id: tab3id,
      label: tab3label,
    };

    const panel = DuiPanel.fromModel(model);
    panel.addTab(tab);

    expect(panel.tabs).toHaveLength(3);
    expect(panel.selectedTab).toBeDefined();
    expect(panel.selectedTab).toEqual(tab);
  });

  test('DuiPanel::removeTab removes tab and selects another if available', () => {
    const panel = DuiPanel.fromModel(model);

    expect(panel.selectedTab).toEqual(tab1);
    expect(panel.tabs).toHaveLength(2);

    panel.removeTab(tab1id);

    expect(panel.selectedTab).toEqual(tab2);
    expect(panel.tabs).toHaveLength(1);
  });
});
