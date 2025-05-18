import { injectable, inject } from 'inversify';
import { AIConfig, ModelConfig, PipelineConfig } from './types/config';

@injectable()
class AIIntegrationSystem {
  private readonly models: Map<string, AIModel>;
  private readonly pipelines: Map<string, Pipeline>;
  private readonly scheduler: ModelScheduler;
  private readonly optimizer: ModelOptimizer;
  private readonly monitor: AIMonitor;

  constructor(private readonly config: AIConfig) {
    this.models = new Map();
    this.pipelines = new Map();
    this.scheduler = new ModelScheduler(config.scheduling);
    this.optimizer = new ModelOptimizer(config.optimization);
    this.monitor = new AIMonitor(config.monitoring);
  }

  async initialize(): Promise<void> {
    // Initialize AI models
    await this.initializeModels();
    
    // Setup processing pipelines
    await this.setupPipelines();
    
    // Start monitoring
    await this.monitor.start();
  }

  private async initializeModels(): Promise<void> {
    // Initialize NLP models
    const nlpModel = new NLPModel(this.config.models.nlp);
    await nlpModel.initialize();
    this.models.set('nlp', nlpModel);

    // Initialize Computer Vision models
    const visionModel = new VisionModel(this.config.models.vision);
    await visionModel.initialize();
    this.models.set('vision', visionModel);

    // Initialize Recommendation models
    const recommendationModel = new RecommendationModel(this.config.models.recommendation);
    await recommendationModel.initialize();
    this.models.set('recommendation', recommendationModel);

    // Initialize Learning models
    const learningModel = new LearningModel(this.config.models.learning);
    await learningModel.initialize();
    this.models.set('learning', learningModel);
  }

  private async setupPipelines(): Promise<void> {
    // Setup NLP pipeline
    const nlpPipeline = new Pipeline({
      name: 'nlp',
      model: this.models.get('nlp'),
      steps: this.config.pipelines.nlp
    });
    this.pipelines.set('nlp', nlpPipeline);

    // Setup Vision pipeline
    const visionPipeline = new Pipeline({
      name: 'vision',
      model: this.models.get('vision'),
      steps: this.config.pipelines.vision
    });
    this.pipelines.set('vision', visionPipeline);

    // Setup Recommendation pipeline
    const recommendationPipeline = new Pipeline({
      name: 'recommendation',
      model: this.models.get('recommendation'),
      steps: this.config.pipelines.recommendation
    });
    this.pipelines.set('recommendation', recommendationPipeline);

    // Setup Learning pipeline
    const learningPipeline = new Pipeline({
      name: 'learning',
      model: this.models.get('learning'),
      steps: this.config.pipelines.learning
    });
    this.pipelines.set('learning', learningPipeline);
  }

  async processNLP(input: string, options?: ProcessingOptions): Promise<NLPResult> {
    try {
      const pipeline = this.pipelines.get('nlp');
      if (!pipeline) {
        throw new PipelineNotFoundError('nlp');
      }

      const result = await pipeline.process(input, options);
      await this.monitor.logProcessing('nlp', input, result);
      return result;
    } catch (error) {
      await this.monitor.logError('nlp_processing_failed', error);
      throw new ProcessingError('NLP', error);
    }
  }

  async processImage(input: ImageData, options?: ProcessingOptions): Promise<VisionResult> {
    try {
      const pipeline = this.pipelines.get('vision');
      if (!pipeline) {
        throw new PipelineNotFoundError('vision');
      }

      const result = await pipeline.process(input, options);
      await this.monitor.logProcessing('vision', input, result);
      return result;
    } catch (error) {
      await this.monitor.logError('vision_processing_failed', error);
      throw new ProcessingError('Vision', error);
    }
  }

  async getRecommendations(userId: string, context: RecommendationContext): Promise<Recommendation[]> {
    try {
      const pipeline = this.pipelines.get('recommendation');
      if (!pipeline) {
        throw new PipelineNotFoundError('recommendation');
      }

      const result = await pipeline.process({ userId, context });
      await this.monitor.logProcessing('recommendation', { userId, context }, result);
      return result;
    } catch (error) {
      await this.monitor.logError('recommendation_processing_failed', error);
      throw new ProcessingError('Recommendation', error);
    }
  }

  async optimizeLearningPath(userId: string, progress: LearningProgress): Promise<LearningPath> {
    try {
      const pipeline = this.pipelines.get('learning');
      if (!pipeline) {
        throw new PipelineNotFoundError('learning');
      }

      const result = await pipeline.process({ userId, progress });
      await this.monitor.logProcessing('learning', { userId, progress }, result);
      return result;
    } catch (error) {
      await this.monitor.logError('learning_optimization_failed', error);
      throw new ProcessingError('Learning', error);
    }
  }

  async trainModel(modelType: string, data: TrainingData): Promise<void> {
    try {
      const model = this.models.get(modelType);
      if (!model) {
        throw new ModelNotFoundError(modelType);
      }

      await model.train(data);
      await this.monitor.logTraining(modelType, data);
    } catch (error) {
      await this.monitor.logError('model_training_failed', error);
      throw new TrainingError(modelType, error);
    }
  }

  async evaluateModel(modelType: string, testData: TestData): Promise<EvaluationResult> {
    try {
      const model = this.models.get(modelType);
      if (!model) {
        throw new ModelNotFoundError(modelType);
      }

      const result = await model.evaluate(testData);
      await this.monitor.logEvaluation(modelType, result);
      return result;
    } catch (error) {
      await this.monitor.logError('model_evaluation_failed', error);
      throw new EvaluationError(modelType, error);
    }
  }

  async getModelMetrics(modelType: string): Promise<ModelMetrics> {
    const model = this.models.get(modelType);
    if (!model) {
      throw new ModelNotFoundError(modelType);
    }

    return model.getMetrics();
  }

  async healthCheck(): Promise<HealthStatus> {
    const modelHealth = await Promise.all(
      Array.from(this.models.values()).map(model => model.healthCheck())
    );

    const pipelineHealth = await Promise.all(
      Array.from(this.pipelines.values()).map(pipeline => pipeline.healthCheck())
    );

    return {
      status: this.determineOverallHealth([...modelHealth, ...pipelineHealth]),
      models: Object.fromEntries(
        Array.from(this.models.keys()).map((key, index) => [
          key,
          modelHealth[index]
        ])
      ),
      pipelines: Object.fromEntries(
        Array.from(this.pipelines.keys()).map((key, index) => [
          key,
          pipelineHealth[index]
        ])
      ),
      scheduler: await this.scheduler.getStatus(),
      optimizer: await this.optimizer.getStatus(),
      timestamp: new Date().toISOString()
    };
  }

  private determineOverallHealth(componentHealth: ComponentHealth[]): HealthStatus {
    return componentHealth.every(health => health.status === 'healthy')
      ? 'healthy'
      : 'unhealthy';
  }

  async shutdown(): Promise<void> {
    await this.monitor.stop();

    await Promise.all([
      ...Array.from(this.models.values()).map(model => model.shutdown()),
      ...Array.from(this.pipelines.values()).map(pipeline => pipeline.shutdown())
    ]);

    this.models.clear();
    this.pipelines.clear();
  }
}

// Error classes
class AIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIError';
  }
}

class ModelNotFoundError extends AIError {
  constructor(modelType: string) {
    super(`Model ${modelType} not found`);
    this.name = 'ModelNotFoundError';
  }
}

class PipelineNotFoundError extends AIError {
  constructor(pipelineType: string) {
    super(`Pipeline ${pipelineType} not found`);
    this.name = 'PipelineNotFoundError';
  }
}

class ProcessingError extends AIError {
  constructor(type: string, error: any) {
    super(`${type} processing failed: ${error.message}`);
    this.name = 'ProcessingError';
  }
}

class TrainingError extends AIError {
  constructor(modelType: string, error: any) {
    super(`Training ${modelType} failed: ${error.message}`);
    this.name = 'TrainingError';
  }
}

class EvaluationError extends AIError {
  constructor(modelType: string, error: any) {
    super(`Evaluation ${modelType} failed: ${error.message}`);
    this.name = 'EvaluationError';
  }
}

export {
  AIIntegrationSystem,
  AIConfig,
  ModelMetrics,
  EvaluationResult,
  HealthStatus
};