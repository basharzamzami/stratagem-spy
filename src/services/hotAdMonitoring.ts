export interface AcceptanceCriteria {
  feature: string;
  criteria: string;
  target_value: number;
  current_value: number;
  status: 'passing' | 'failing' | 'unknown';
  last_checked: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  timestamp: string;
  tags: Record<string, string>;
}

export interface TestResult {
  test_id: string;
  test_name: string;
  expected_result: any;
  actual_result: any;
  passed: boolean;
  execution_time: number;
  timestamp: string;
}

class HotAdMonitoring {
  private metrics: PerformanceMetric[] = [];
  private testResults: TestResult[] = [];
  private acceptanceCriteria: AcceptanceCriteria[] = [
    {
      feature: 'hotad_detection',
      criteria: 'precision_on_labeled_test_set',
      target_value: 0.85,
      current_value: 0,
      status: 'unknown',
      last_checked: new Date().toISOString()
    },
    {
      feature: 'creative_dna',
      criteria: 'trigger_classification_accuracy',
      target_value: 0.90,
      current_value: 0,
      status: 'unknown', 
      last_checked: new Date().toISOString()
    },
    {
      feature: 'counter_ad_generation',
      criteria: 'generation_latency_seconds',
      target_value: 60,
      current_value: 0,
      status: 'unknown',
      last_checked: new Date().toISOString()
    },
    {
      feature: 'deployment',
      criteria: 'deploy_latency_minutes_95th',
      target_value: 15,
      current_value: 0,
      status: 'unknown',
      last_checked: new Date().toISOString()
    }
  ];

  /**
   * Track performance metric
   */
  recordMetric(name: string, value: number, target: number, tags: Record<string, string> = {}) {
    this.metrics.push({
      name,
      value,
      target,
      timestamp: new Date().toISOString(),
      tags
    });

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    console.log(`[METRIC] ${name}: ${value} (target: ${target})`, tags);
  }

  /**
   * Record test execution result
   */
  recordTestResult(testId: string, testName: string, expected: any, actual: any, executionTime: number) {
    const passed = JSON.stringify(expected) === JSON.stringify(actual);
    
    const result: TestResult = {
      test_id: testId,
      test_name: testName,
      expected_result: expected,
      actual_result: actual,
      passed,
      execution_time: executionTime,
      timestamp: new Date().toISOString()
    };

    this.testResults.push(result);

    // Keep only last 500 test results
    if (this.testResults.length > 500) {
      this.testResults = this.testResults.slice(-500);
    }

    if (!passed) {
      console.error(`[TEST FAIL] ${testName}:`, { expected, actual, executionTime });
    } else {
      console.log(`[TEST PASS] ${testName}: ${executionTime}ms`);
    }

    return result;
  }

  /**
   * Update acceptance criteria status
   */
  updateAcceptanceCriteria(feature: string, criteria: string, currentValue: number) {
    const criterion = this.acceptanceCriteria.find(
      ac => ac.feature === feature && ac.criteria === criteria
    );

    if (criterion) {
      criterion.current_value = currentValue;
      criterion.status = currentValue >= criterion.target_value ? 'passing' : 'failing';
      criterion.last_checked = new Date().toISOString();

      console.log(`[ACCEPTANCE] ${feature}.${criteria}: ${currentValue} (target: ${criterion.target_value}) - ${criterion.status.toUpperCase()}`);
    }
  }

  /**
   * Get current system health based on acceptance criteria
   */
  getSystemHealth(): {
    overall_status: 'healthy' | 'degraded' | 'failing';
    passing_criteria: number;
    total_criteria: number;
    failing_criteria: AcceptanceCriteria[];
  } {
    const passingCount = this.acceptanceCriteria.filter(ac => ac.status === 'passing').length;
    const totalCount = this.acceptanceCriteria.length;
    const failingCriteria = this.acceptanceCriteria.filter(ac => ac.status === 'failing');

    let overallStatus: 'healthy' | 'degraded' | 'failing';
    const passingRatio = passingCount / totalCount;

    if (passingRatio >= 0.9) overallStatus = 'healthy';
    else if (passingRatio >= 0.7) overallStatus = 'degraded';
    else overallStatus = 'failing';

    return {
      overall_status: overallStatus,
      passing_criteria: passingCount,
      total_criteria: totalCount,
      failing_criteria: failingCriteria
    };
  }

  /**
   * Run built-in test cases
   */
  async runAcceptanceTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // Test 1: HotAd detection on simulated spike
    const testStart1 = Date.now();
    const simulatedSpike = await this.simulateAdSpike();
    const testResult1 = this.recordTestResult(
      'hotad_detection_spike',
      'HotAd detection on simulated spike',
      { alert_generated: true, velocity_score_min: 50 },
      { alert_generated: simulatedSpike.alert_generated, velocity_score_min: simulatedSpike.velocity_score >= 50 },
      Date.now() - testStart1
    );
    results.push(testResult1);

    // Test 2: Creative DNA classification
    const testStart2 = Date.now();
    const dnaTest = await this.testCreativeDNAClassification();
    const testResult2 = this.recordTestResult(
      'creative_dna_classification',
      'Creative DNA trigger classification',
      { primary_trigger: 'curiosity', confidence_min: 0.8 },
      { primary_trigger: dnaTest.primary_trigger, confidence_min: dnaTest.confidence >= 0.8 },
      Date.now() - testStart2
    );
    results.push(testResult2);

    // Test 3: Counter-ad generation performance
    const testStart3 = Date.now();
    const counterAdTest = await this.testCounterAdGeneration();
    const testResult3 = this.recordTestResult(
      'counter_ad_generation',
      'Counter-ad generation within time limit',
      { variants_count: 3, generation_time_under_60s: true },
      { variants_count: counterAdTest.variants_count, generation_time_under_60s: counterAdTest.generation_time < 60000 },
      Date.now() - testStart3
    );
    results.push(testResult3);

    return results;
  }

  private async simulateAdSpike(): Promise<{ alert_generated: boolean; velocity_score: number }> {
    // Import the detector dynamically to avoid circular deps
    const { hotAdDetector } = await import('./hotAdDetector');
    const { EngagementSnapshot } = await import('./hotAdDetector');
    
    // Create baseline data
    const baselineSnapshots: EngagementSnapshot[] = [];
    const baseTime = Date.now() - (60 * 60 * 1000); // 1 hour ago
    
    for (let i = 0; i < 20; i++) {
      baselineSnapshots.push({
        ad_id: 'test_ad_1',
        timestamp: new Date(baseTime + (i * 3 * 60 * 1000)).toISOString(),
        likes: 10 + Math.random() * 5,
        comments: 2 + Math.random() * 3,
        shares: 1 + Math.random() * 2,
        clicks: 5 + Math.random() * 5,
        impressions: 100 + Math.random() * 50
      });
    }

    // Create spike data
    const spikeSnapshots: EngagementSnapshot[] = [];
    const spikeTime = Date.now() - (5 * 60 * 1000); // 5 minutes ago
    
    for (let i = 0; i < 5; i++) {
      spikeSnapshots.push({
        ad_id: 'test_ad_1',
        timestamp: new Date(spikeTime + (i * 60 * 1000)).toISOString(),
        likes: 50 + Math.random() * 20, // Much higher engagement
        comments: 15 + Math.random() * 10,
        shares: 8 + Math.random() * 5,
        clicks: 25 + Math.random() * 15,
        impressions: 200 + Math.random() * 100
      });
    }

    const allSnapshots = [...baselineSnapshots, ...spikeSnapshots];
    const alerts = await hotAdDetector.processEngagementData(allSnapshots);
    
    return {
      alert_generated: alerts.length > 0,
      velocity_score: alerts.length > 0 ? alerts[0].velocity_score : 0
    };
  }

  private async testCreativeDNAClassification(): Promise<{ primary_trigger: string; confidence: number }> {
    const { hotAdDetector } = await import('./hotAdDetector');
    
    const testContent = "Discover the secret formula that industry leaders don't want you to know. Limited time exclusive access.";
    const dna = await hotAdDetector.extractCreativeDNA(testContent, "The Secret Formula");
    
    const maxConfidence = Math.max(...Object.values(dna.confidence_scores));
    
    return {
      primary_trigger: dna.hook_type,
      confidence: maxConfidence
    };
  }

  private async testCounterAdGeneration(): Promise<{ variants_count: number; generation_time: number }> {
    const startTime = Date.now();
    const { hotAdDetector } = await import('./hotAdDetector');
    
    const mockDNA = {
      dna_id: 'test_dna',
      hook_type: 'curiosity' as const,
      colors: ['#FF6B6B'],
      tone: 'professional' as const,
      offer_type: 'free_trial',
      cta_text: 'learn more',
      confidence_scores: { curiosity: 0.9 }
    };

    const counterAd = await hotAdDetector.generateCounterAd('test_ad', mockDNA, 'test content');
    const generationTime = Date.now() - startTime;
    
    return {
      variants_count: counterAd.creative_variants.length,
      generation_time: generationTime
    };
  }

  /**
   * Get performance summary for dashboard
   */
  getPerformanceSummary(): {
    avg_detection_latency: number;
    avg_classification_accuracy: number;
    avg_generation_time: number;
    test_pass_rate: number;
  } {
    const recentMetrics = this.metrics.filter(
      m => Date.now() - new Date(m.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    const detectionLatency = recentMetrics
      .filter(m => m.name === 'detection_latency')
      .map(m => m.value);

    const classificationAccuracy = recentMetrics
      .filter(m => m.name === 'classification_accuracy')
      .map(m => m.value);

    const generationTime = recentMetrics
      .filter(m => m.name === 'generation_time')
      .map(m => m.value);

    const recentTests = this.testResults.filter(
      t => Date.now() - new Date(t.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    const passRate = recentTests.length > 0 
      ? recentTests.filter(t => t.passed).length / recentTests.length 
      : 0;

    return {
      avg_detection_latency: detectionLatency.length > 0 
        ? detectionLatency.reduce((a, b) => a + b, 0) / detectionLatency.length 
        : 0,
      avg_classification_accuracy: classificationAccuracy.length > 0
        ? classificationAccuracy.reduce((a, b) => a + b, 0) / classificationAccuracy.length
        : 0,
      avg_generation_time: generationTime.length > 0
        ? generationTime.reduce((a, b) => a + b, 0) / generationTime.length
        : 0,
      test_pass_rate: passRate
    };
  }

  // Getters for monitoring data
  getAcceptanceCriteria(): AcceptanceCriteria[] {
    return [...this.acceptanceCriteria];
  }

  getRecentMetrics(hours: number = 24): PerformanceMetric[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.metrics.filter(m => new Date(m.timestamp).getTime() > cutoff);
  }

  getRecentTestResults(hours: number = 24): TestResult[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.testResults.filter(t => new Date(t.timestamp).getTime() > cutoff);
  }
}

export const hotAdMonitoring = new HotAdMonitoring();
