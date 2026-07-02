import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';
import { ILatexTypesetter } from '@jupyterlab/rendermime';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { PLUGIN_ID } from './constants';
import pluginMain from './plugin';
import mjPlugin from './mathjax4/plugin';
import notebookAnimatePlugin from './notebookAnimate';

/**
 * Initialization data for the sliveshow extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: `${PLUGIN_ID}:plugin`,
  description: 'JupyterLab extension for animated slideshow.',
  autoStart: true,
  requires: [INotebookTracker, ISettingRegistry],
  optional: [ILatexTypesetter],
  activate: (
    app: JupyterFrontEnd,
    nbTracker: INotebookTracker,
    settingRegistry: ISettingRegistry,
    typesetter: ILatexTypesetter | null
  ) => {
    console.log('JupyterLab extension sliveshow is activated!');
    pluginMain(app, nbTracker, settingRegistry, typesetter);
    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('sliveshow settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for sliveshow.', reason);
        });
    }
  }
};

export default [plugin, mjPlugin, notebookAnimatePlugin];
