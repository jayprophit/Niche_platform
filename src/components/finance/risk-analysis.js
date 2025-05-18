class RiskAnalysisSystem {
  constructor() {
    this.riskFactors = {
      userHistory: 0.3,
      projectValue: 0.2,
      timeframe: 0.15,
      complexity: 0.2,
      communication: 0.15
    };
  }

  calculateRiskScore(project) {
    let score = 0;
    const history = this.evaluateUserHistory(project);
    const valueRisk = this.evaluateProjectValue(project.value);
    const timeRisk = this.evaluateTimeframe(project.duration);
    const complexityRisk = this.evaluateComplexity(project);
    const communicationRisk = this.evaluateCommunication(project);

    score += history * this.riskFactors.userHistory;
    score += valueRisk * this.riskFactors.projectValue;
    score += timeRisk * this.riskFactors.timeframe;
    score += complexityRisk * this.riskFactors.complexity;
    score += communicationRisk * this.riskFactors.communication;

    return {
      totalScore: score,
      factors: {
        userHistory: history,
        projectValue: valueRisk,
        timeframe: timeRisk,
        complexity: complexityRisk,
        communication: communicationRisk
      }
    };
  }

  evaluateUserHistory(project) {
    const { client, freelancer } = project;
    let risk = 0;

    // Evaluate completed projects
    risk += this.calculateCompletionRisk(client.completedProjects);
    risk += this.calculateCompletionRisk(freelancer.completedProjects);

    // Evaluate dispute history
    risk += this.calculateDisputeRisk(client.disputeHistory);
    risk += this.calculateDisputeRisk(freelancer.disputeHistory);

    return risk / 4; // Normalize to 0-1
  }

  evaluateProjectValue(value) {
    const thresholds = {
      low: 1000,
      medium: 5000,
      high: 10000
    };

    if (value <= thresholds.low) return 0.2;
    if (value <= thresholds.medium) return 0.4;
    if (value <= thresholds.high) return 0.7;
    return 0.9;
  }

  evaluateTimeframe(duration) {
    const daysToCompletion = duration / (24 * 60 * 60); // Convert seconds to days
    
    if (daysToCompletion <= 7) return 0.8;  // Very short timeframe
    if (daysToCompletion <= 30) return 0.5; // Normal timeframe
    if (daysToCompletion <= 90) return 0.3; // Extended timeframe
    return 0.4; // Very long timeframe might also be risky
  }

  evaluateComplexity(project) {
    let complexityScore = 0;
    
    // Evaluate milestones
    complexityScore += project.milestones.length * 0.1;
    
    // Evaluate requirements
    complexityScore += project.requirements.length * 0.05;
    
    // Evaluate dependencies
    complexityScore += project.dependencies.length * 0.15;

    return Math.min(complexityScore, 1); // Cap at 1
  }

  evaluateCommunication(project) {
    let communicationRisk = 0;
    
    // Response time risk
    const avgResponseTime = project.communicationStats.avgResponseTime;
    if (avgResponseTime > 48) communicationRisk += 0.5;
    else if (avgResponseTime > 24) communicationRisk += 0.3;
    else if (avgResponseTime > 12) communicationRisk += 0.1;

    // Message clarity risk
    const clarificationRequests = project.communicationStats.clarificationRequests;
    communicationRisk += Math.min(clarificationRequests * 0.1, 0.5);

    return Math.min(communicationRisk, 1);
  }

  calculateCompletionRisk(completedProjects) {
    if (completedProjects === 0) return 1;
    if (completedProjects < 5) return 0.7;
    if (completedProjects < 10) return 0.4;
    if (completedProjects < 20) return 0.2;
    return 0.1;
  }

  calculateDisputeRisk(disputeHistory) {
    const disputeRate = disputeHistory.disputes / disputeHistory.totalProjects;
    if (disputeRate > 0.2) return 1;
    if (disputeRate > 0.1) return 0.7;
    if (disputeRate > 0.05) return 0.4;
    return 0.2;
  }

  generateRecommendations(riskAnalysis) {
    const recommendations = [];
    
    if (riskAnalysis.factors.userHistory > 0.7) {
      recommendations.push({
        factor: 'User History',
        risk: 'High',
        suggestion: 'Consider requiring milestone-based payments and more frequent check-ins'
      });
    }

    if (riskAnalysis.factors.projectValue > 0.7) {
      recommendations.push({
        factor: 'Project Value',
        risk: 'High',
        suggestion: 'Implement additional escrow safeguards and detailed milestone planning'
      });
    }

    if (riskAnalysis.factors.communication > 0.6) {
      recommendations.push({
        factor: 'Communication',
        risk: 'Moderate',
        suggestion: 'Set up mandatory progress meetings and communication guidelines'
      });
    }

    return recommendations;
  }
}

export default RiskAnalysisSystem;