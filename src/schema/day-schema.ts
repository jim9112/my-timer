const daySchema = {
  title: 'day schema',
  descriptiion: 'holds data for a day of timer use',
  primaryKey: 'id',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    dayStart: {
      type: 'number',
    },
    lastBlock: {
      type: 'number',
    },
    todaysBlocks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          start: {
            type: 'number',
          },
          end: {
            type: 'number',
          },
          totalseconds: {
            type: 'number',
          },
        },
      },
    },
  },
};

export {daySchema}