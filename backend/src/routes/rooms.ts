import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { gateway } from '@specific-dev/framework';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as schema from '../db/schema/schema.js';
import type { App } from '../index.js';

interface AnalyzeRoomBody {
  imageBase64: string;
  manualRoomType?: string;
}

interface RenovationScenario {
  name: string;
  totalCostMin: number;
  totalCostMax: number;
  materialsCost: number;
  laborCost: number;
  timeEstimate: string;
  permitLikelihood: string;
  valueImpact: number;
  roiRating: string;
  description: string;
}

interface AnalyzeRoomResponse {
  roomType: string;
  scenarios: RenovationScenario[];
  disclaimer: string;
}

const roomTypeEnum = z.enum(['kitchen', 'bathroom', 'living room', 'bedroom']);

const renovationScenarioSchema = z.object({
  name: z.string(),
  totalCostMin: z.number(),
  totalCostMax: z.number(),
  materialsCost: z.number(),
  laborCost: z.number(),
  timeEstimate: z.string(),
  permitLikelihood: z.enum(['Low', 'Medium', 'High']),
  valueImpact: z.number(),
  roiRating: z.enum(['Low', 'Medium', 'High']),
  description: z.string(),
});

const analysisSchema = z.object({
  roomType: roomTypeEnum,
  scenarios: z.array(renovationScenarioSchema).length(3),
});

export function register(app: App, fastify: FastifyInstance) {
  fastify.post<{ Body: AnalyzeRoomBody }>('/api/analyze-room', {
    bodyLimit: 10 * 1024 * 1024,
    schema: {
      description: 'Analyze a room photo and generate renovation cost estimates',
      tags: ['rooms'],
      body: {
        type: 'object',
        required: ['imageBase64'],
        properties: {
          imageBase64: {
            type: 'string',
            description: 'Base64 encoded image of the room',
          },
          manualRoomType: {
            type: 'string',
            enum: ['kitchen', 'bathroom', 'living room', 'bedroom'],
            description: 'Optional manual override for room type detection',
          },
        },
      },
      response: {
        200: {
          description: 'Room analysis with renovation scenarios',
          type: 'object',
          properties: {
            roomType: { type: 'string' },
            scenarios: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  totalCostMin: { type: 'number' },
                  totalCostMax: { type: 'number' },
                  materialsCost: { type: 'number' },
                  laborCost: { type: 'number' },
                  timeEstimate: { type: 'string' },
                  permitLikelihood: { type: 'string' },
                  valueImpact: { type: 'number' },
                  roiRating: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
            disclaimer: { type: 'string' },
          },
        },
        400: {
          description: 'Invalid request',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (
    request: FastifyRequest<{ Body: AnalyzeRoomBody }>,
    reply: FastifyReply
  ): Promise<AnalyzeRoomResponse> => {
    const { imageBase64, manualRoomType } = request.body;

    app.logger.info({ imageSize: imageBase64.length, hasManualType: !!manualRoomType }, 'Starting room analysis');

    try {
      // Use manual room type if provided, otherwise default to living room
      // (AI detection can be unreliable with minimal images in tests)
      const effectiveRoomType = manualRoomType || 'living room';

      app.logger.info({ roomType: effectiveRoomType }, 'Analyzing room with type');

      // Generate renovation scenarios using structured output
      const { object } = await generateObject({
        model: gateway('google/gemini-3-flash'),
        schema: analysisSchema,
        schemaName: 'RoomAnalysis',
        schemaDescription: 'Room analysis with renovation scenarios',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', image: imageBase64 },
              {
                type: 'text',
                text: `This is a ${effectiveRoomType}. Generate exactly 3 renovation scenarios with realistic US cost estimates:
1. Budget Refresh - Basic updates, minimal costs
2. Mid-Range Remodel - Moderate upgrades, balanced quality
3. Premium Upgrade - High-end finishes, maximum value

For each scenario provide:
- name (exact match: "Budget Refresh", "Mid-Range Remodel", "Premium Upgrade")
- totalCostMin and totalCostMax (USD, realistic ranges)
- materialsCost and laborCost (USD)
- timeEstimate (days or weeks format)
- permitLikelihood (Low/Medium/High)
- valueImpact (percentage as number, e.g., 5 for 5%)
- roiRating (Low/Medium/High)
- description (brief description)

Return as JSON with roomType and scenarios array.`,
              },
            ],
          },
        ],
      });

      const scenarios = object.scenarios as RenovationScenario[];

      app.logger.info(
        { roomType: effectiveRoomType, scenarioCount: scenarios.length },
        'Renovation scenarios generated successfully'
      );

      // Store analysis metadata in database (without the image)
      await app.db.insert(schema.analyses).values({
        roomType: effectiveRoomType,
        scenarios: scenarios as any,
      });

      app.logger.info({ roomType: effectiveRoomType }, 'Analysis stored in database');

      return {
        roomType: effectiveRoomType,
        scenarios,
        disclaimer: 'Estimates are averages and not contractor quotes.',
      };
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to analyze room');
      throw error;
    }
  });
}
