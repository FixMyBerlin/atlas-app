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
      exportFormatVersion: 1,
      targetWorkspace: 'taskCompletion',
      exportName: 'Radinfra.de #2',
      exportTimestamp: '2025-03-05T04:46:17.581Z',
    },
    workspace: {
      dataModelVersion: 2,
      name: 'taskCompletion',
      cols: 12,
      rowHeight: 30,
      targets: ['task'],
      widgetKeys: [
        'OSMElementTagsWidget',
        'TaskInstructionsWidget',
        'TagDiffWidget', // Only visible for "Fix Tag" challenges
        'TaskCompletionWidget',
        'TaskMapWidget',
      ],
      layout: [
        { h: 6, w: 12, x: 0, y: 20 },
        { h: 20, w: 5, x: 0, y: 0 },
        { h: 0, w: 7, x: 5, y: 0 },
        { h: 6, w: 7, x: 5, y: 0 },
        { h: 14, w: 7, x: 5, y: 6 },
      ],
    },
  },
} satisfies Partial<CreateMapRouletteChallengeType>
