import { maprouletteProjectId } from './maprouletteProjectId.const'
import type { CreateMapRouletteChallengeType } from './schema'

export const defaultChallenge = {
  defaultBasemap: -1,
  defaultBasemapId: '',
  instruction:
    ' \n## Kontext {{osmIdentifier}} \n \n{{task_markdown}}\n\n(Letzte Aktualisierung der Aufgabe: {{task_updated_at}})\n(Letzte Aktualisierung der Daten: {{data_updated_at}})\n {{blank}}          {{blank}}                  {{blank}}',
  difficulty: 2,
  defaultPriority: 0,
  // Format: {"condition":"AND","rules":[{"value":"priority.prio1","type":"string","operator":"equal"}]}
  highPriorityRule: JSON.stringify(
    {
      condition: 'AND',
      rules: [{ type: 'string', operator: 'equal', value: 'priority.prio1' }],
    },
    undefined,
    0,
  ),
  mediumPriorityRule: JSON.stringify(
    {
      condition: 'AND',
      rules: [{ type: 'string', operator: 'equal', value: 'priority.prio2' }],
    },
    undefined,
    0,
  ),
  lowPriorityRule: JSON.stringify(
    {
      condition: 'AND',
      rules: [{ type: 'string', operator: 'equal', value: 'priority.prio3' }],
    },
    undefined,
    0,
  ),
  overpassTargetType: null,
  parent: maprouletteProjectId,
  tags: 'highway',
  presets: [],
  taskStyles: [],
  // This is a custom layout I build and then exported.
  // It features a long description left and only the task buttons and task map on the right.
  // I then uploaded it to a test challenge to get this object below.
  taskWidgetLayout: {
    meta: {
      exportName: 'Radinfra.de',
      exportTimestamp: '2025-02-15T16:15:54.537Z',
      targetWorkspace: 'taskCompletion',
      exportFormatVersion: 1,
    },
    workspace: {
      cols: 12,
      name: 'taskCompletion',
      layout: [
        { h: 30, w: 5, x: 0, y: 0 },
        { h: 0, w: 7, x: 5, y: 0 },
        { h: 10, w: 7, x: 5, y: 0 },
        { h: 20, w: 7, x: 5, y: 10 },
      ],
      targets: ['task'],
      rowHeight: 30,
      widgetKeys: [
        'TaskInstructionsWidget',
        'TagDiffWidget', // Only visible for "Fix Tag" challenges
        'TaskCompletionWidget',
        'TaskMapWidget',
      ],
      dataModelVersion: 2,
    },
  },
} satisfies Partial<CreateMapRouletteChallengeType>
